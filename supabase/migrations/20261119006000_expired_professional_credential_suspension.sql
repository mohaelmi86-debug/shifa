-- Suspend organization access when an approved professional license/registration expires.
-- This routine is service-role only; schedule it from a trusted server/Edge Function.
-- It does not alter other active memberships; global profile deactivation occurs only
-- when no accepted active organization membership remains (legacy memberships included).

CREATE OR REPLACE FUNCTION public.process_expired_professional_credentials()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_suspended_count integer := 0;
BEGIN
  WITH expired_memberships AS (
    SELECT
      po.professional_id,
      po.organization_id,
      array_agg(DISTINCT pc.id) AS expired_credential_ids
    FROM public.professional_organizations po
    JOIN public.professional_credentials pc
      ON pc.professional_id = po.professional_id
     AND pc.organization_id = po.organization_id
    WHERE po.status = 'active'::public.professional_status
      AND po.invitation_status = 'accepted'::public.invitation_status
      AND pc.status = 'approved'
      AND pc.credential_type IN ('professional_license', 'professional_registration')
      AND pc.expires_at IS NOT NULL
      AND pc.expires_at < current_date
      AND NOT EXISTS (
        SELECT 1
        FROM public.professional_credentials valid_pc
        WHERE valid_pc.professional_id = po.professional_id
          AND valid_pc.organization_id = po.organization_id
          AND valid_pc.status = 'approved'
          AND valid_pc.credential_type IN ('professional_license', 'professional_registration')
          AND (valid_pc.expires_at IS NULL OR valid_pc.expires_at >= current_date)
      )
    GROUP BY po.professional_id, po.organization_id
  ),
  suspended AS (
    UPDATE public.professional_organizations po
    SET status = 'pending'::public.professional_status
    FROM expired_memberships em
    WHERE po.professional_id = em.professional_id
      AND po.organization_id = em.organization_id
      AND po.status = 'active'::public.professional_status
      AND po.invitation_status = 'accepted'::public.invitation_status
    RETURNING po.id, po.professional_id, po.organization_id
  ),
  audit_memberships AS (
    INSERT INTO public.audit_logs (
      organization_id, user_id, action, resource_type, resource_id, details
    )
    SELECT
      s.organization_id,
      p.user_id,
      'professional_credential_expired',
      'professional_organization',
      s.id,
      jsonb_build_object(
        'professional_id', s.professional_id,
        'reason', 'No currently valid approved license or registration remains for this organization',
        'processed_on', current_date
      )
    FROM suspended s
    JOIN public.professionals p ON p.id = s.professional_id
    RETURNING id
  ),
  affected_professionals AS (
    SELECT DISTINCT s.professional_id
    FROM suspended s
  ),
  deactivated_profiles AS (
    UPDATE public.professionals p
    SET is_verified = FALSE,
        status = 'pending'::public.professional_status,
        updated_at = now()
    FROM affected_professionals ap
    WHERE p.id = ap.professional_id
      AND NOT EXISTS (
        SELECT 1
        FROM public.professional_organizations active_po
        WHERE active_po.professional_id = p.id
          AND active_po.status = 'active'::public.professional_status
          AND active_po.invitation_status = 'accepted'::public.invitation_status
      )
    RETURNING p.id, p.user_id
  )
  INSERT INTO public.audit_logs (
    organization_id, user_id, action, resource_type, resource_id, details
  )
  SELECT
    NULL,
    dp.user_id,
    'professional_profile_suspended_expired_credential',
    'professional',
    dp.id,
    jsonb_build_object(
      'reason', 'No active organization membership remains after expiry processing',
      'processed_on', current_date
    )
  FROM deactivated_profiles dp;

  GET DIAGNOSTICS v_suspended_count = ROW_COUNT;
  -- ROW_COUNT above counts profile-level suspensions; the function returns the
  -- number of profiles globally deactivated (not the number of memberships).
  RETURN v_suspended_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.process_expired_professional_credentials() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_expired_professional_credentials() TO service_role;

COMMENT ON FUNCTION public.process_expired_professional_credentials() IS
  'Service-role-only expiry processor. Suspends organization memberships lacking a current approved license/registration and globally deactivates a professional only when no active organization membership remains. Must be invoked by a trusted scheduler.';
