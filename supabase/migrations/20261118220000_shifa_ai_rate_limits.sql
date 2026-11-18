-- SHIFA HEALTH — durable per-user AI request limits
-- Apply only after reconciling the live Supabase migration ledger with repository history.
-- This migration is additive and does not touch clinical tables or existing patient data.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.shifa_ai_rate_limits (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bucket_type text NOT NULL CHECK (bucket_type IN ('minute', 'day')),
  bucket_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, bucket_type, bucket_start)
);

ALTER TABLE private.shifa_ai_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.shifa_ai_rate_limits FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.consume_shifa_ai_rate_limit()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_minute_start timestamptz;
  v_day_start timestamptz;
  v_minute_count integer;
  v_day_count integer;
  v_retry_after integer;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'unauthenticated', 'retry_after_seconds', 60);
  END IF;

  DELETE FROM private.shifa_ai_rate_limits
  WHERE user_id = v_user_id
    AND ((bucket_type = 'minute' AND bucket_start < v_now - INTERVAL '2 hours')
      OR (bucket_type = 'day' AND bucket_start < v_now - INTERVAL '2 days'));

  v_minute_start := date_trunc('minute', v_now);
  v_day_start := date_trunc('day', v_now AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';

  INSERT INTO private.shifa_ai_rate_limits (user_id, bucket_type, bucket_start, request_count, updated_at)
  VALUES (v_user_id, 'minute', v_minute_start, 1, v_now)
  ON CONFLICT (user_id, bucket_type, bucket_start)
  DO UPDATE SET request_count = private.shifa_ai_rate_limits.request_count + 1,
                updated_at = EXCLUDED.updated_at
  RETURNING request_count INTO v_minute_count;

  INSERT INTO private.shifa_ai_rate_limits (user_id, bucket_type, bucket_start, request_count, updated_at)
  VALUES (v_user_id, 'day', v_day_start, 1, v_now)
  ON CONFLICT (user_id, bucket_type, bucket_start)
  DO UPDATE SET request_count = private.shifa_ai_rate_limits.request_count + 1,
                updated_at = EXCLUDED.updated_at
  RETURNING request_count INTO v_day_count;

  IF v_minute_count > 10 OR v_day_count > 200 THEN
    IF v_minute_count > 10 THEN
      v_retry_after := GREATEST(1, 60 - EXTRACT(SECOND FROM v_now)::integer);
    ELSE
      v_retry_after := GREATEST(1, 86400 - EXTRACT(EPOCH FROM (v_now - v_day_start))::integer);
    END IF;
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', CASE WHEN v_minute_count > 10 THEN 'minute_limit' ELSE 'daily_limit' END,
      'retry_after_seconds', v_retry_after
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'minute_remaining', GREATEST(0, 10 - v_minute_count),
    'daily_remaining', GREATEST(0, 200 - v_day_count)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.consume_shifa_ai_rate_limit() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_shifa_ai_rate_limit() TO authenticated;

COMMENT ON TABLE private.shifa_ai_rate_limits IS
  'Private atomic request counters for SHIFA AI. Retain only short-lived aggregate counters; no prompt or clinical content is stored.';
COMMENT ON FUNCTION public.consume_shifa_ai_rate_limit() IS
  'Atomically enforces 10 SHIFA AI requests per user per minute and 200 per UTC day. Requires an authenticated JWT.';
