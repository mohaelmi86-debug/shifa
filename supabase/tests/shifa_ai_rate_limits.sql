-- SHIFA AI quota contract tests. Synthetic users only; isolated CI database.
-- No prompts, clinical data, provider credentials or production records are used.

BEGIN;

DO $privileges$
BEGIN
  IF NOT has_function_privilege('authenticated', 'public.consume_shifa_ai_rate_limit()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: authenticated users must be able to invoke the AI rate limiter';
  END IF;
  IF has_function_privilege('anon', 'public.consume_shifa_ai_rate_limit()', 'EXECUTE')
     OR has_function_privilege('PUBLIC', 'public.consume_shifa_ai_rate_limit()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anonymous and PUBLIC roles must not execute the AI rate limiter';
  END IF;
  IF has_table_privilege('authenticated', 'private.shifa_ai_rate_limits', 'SELECT')
     OR has_table_privilege('authenticated', 'private.shifa_ai_rate_limits', 'INSERT')
     OR has_table_privilege('authenticated', 'private.shifa_ai_rate_limits', 'UPDATE')
     OR has_table_privilege('authenticated', 'private.shifa_ai_rate_limits', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: authenticated clients must not access raw AI quota counters';
  END IF;
END;
$privileges$;

INSERT INTO auth.users (id, email, raw_app_meta_data)
VALUES
  ('51000000-0000-4000-8000-000000000001', 'ci-ai-minute-limit@shifa.invalid', '{"role":"patient"}'::jsonb),
  ('51000000-0000-4000-8000-000000000002', 'ci-ai-daily-limit@shifa.invalid', '{"role":"patient"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed only an aggregate daily counter for the daily-limit scenario.
INSERT INTO private.shifa_ai_rate_limits (user_id, bucket_type, bucket_start, request_count)
VALUES (
  '51000000-0000-4000-8000-000000000002',
  'day',
  date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC',
  200
)
ON CONFLICT (user_id, bucket_type, bucket_start)
DO UPDATE SET request_count = 200, updated_at = now();

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.role', 'authenticated', true);

DO $quota_assertions$
DECLARE
  v_result jsonb;
  v_i integer;
BEGIN
  -- Unauthenticated calls must fail closed and must not create counters.
  PERFORM set_config('request.jwt.claim.sub', '', true);
  v_result := public.consume_shifa_ai_rate_limit();
  IF v_result->>'allowed' <> 'false' OR v_result->>'reason' <> 'unauthenticated' THEN
    RAISE EXCEPTION 'FAIL: unauthenticated AI quota calls must be denied';
  END IF;

  -- Ten requests in one minute are allowed; request eleven is rejected.
  PERFORM set_config('request.jwt.claim.sub', '51000000-0000-4000-8000-000000000001', true);
  FOR v_i IN 1..10 LOOP
    v_result := public.consume_shifa_ai_rate_limit();
    IF v_result->>'allowed' <> 'true' THEN
      RAISE EXCEPTION 'FAIL: AI request % of 10 should be allowed, got %', v_i, v_result;
    END IF;
  END LOOP;
  v_result := public.consume_shifa_ai_rate_limit();
  IF v_result->>'allowed' <> 'false'
     OR v_result->>'reason' <> 'minute_limit'
     OR COALESCE((v_result->>'retry_after_seconds')::integer, 0) < 1 THEN
    RAISE EXCEPTION 'FAIL: AI request eleven must return a minute-limit denial with Retry-After';
  END IF;

  -- A separate user already at 200 daily requests must be rejected even
  -- though their current minute bucket is empty.
  PERFORM set_config('request.jwt.claim.sub', '51000000-0000-4000-8000-000000000002', true);
  v_result := public.consume_shifa_ai_rate_limit();
  IF v_result->>'allowed' <> 'false'
     OR v_result->>'reason' <> 'daily_limit'
     OR COALESCE((v_result->>'retry_after_seconds')::integer, 0) < 1 THEN
    RAISE EXCEPTION 'FAIL: AI request beyond 200 per UTC day must be rejected';
  END IF;
END;
$quota_assertions$;

RESET ROLE;
ROLLBACK;
