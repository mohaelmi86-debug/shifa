-- Platform administration is not a clinical-care relationship.
-- Keep tenant/platform administration separate from access to patient records.
-- This additive guard intentionally denies platform_admin accounts all direct
-- access to clinical data through authenticated RLS, including legacy permissive
-- policies. Emergency clinical access must use a separately audited break-glass
-- workflow; no such workflow is assumed by this migration.

CREATE OR REPLACE FUNCTION private.is_platform_admin_clinical_access_denied()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles AS up
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'platform_admin'
  );
$function$;

REVOKE ALL ON FUNCTION private.is_platform_admin_clinical_access_denied()
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_platform_admin_clinical_access_denied()
  TO authenticated;

COMMENT ON FUNCTION private.is_platform_admin_clinical_access_denied() IS
  'True for platform administrator accounts regardless of active status; platform administration does not grant direct clinical record access.';

DO $guard$
DECLARE
  v_table text;
  v_tables text[] := ARRAY[
    'patients',
    'patient_documents',
    'appointments',
    'blood_requests',
    'consultations',
    'health_records',
    'hospitalizations',
    'imaging_studies',
    'kiosk_checkins',
    'lab_results',
    'lab_samples',
    'operating_room_schedules',
    'patient_transfers',
    'pharmacy_pos_transactions',
    'prescriptions',
    'shifa_cards',
    'shifa_ids',
    'vital_signs'
  ];
  v_rls boolean;
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL THEN
      SELECT c.relrowsecurity
        INTO v_rls
      FROM pg_class AS c
      WHERE c.oid = to_regclass(format('public.%I', v_table));

      IF v_rls IS DISTINCT FROM TRUE THEN
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', v_table);
      END IF;

      EXECUTE format(
        'DROP POLICY IF EXISTS platform_admin_clinical_default_deny ON public.%I',
        v_table
      );
      EXECUTE format(
        'CREATE POLICY platform_admin_clinical_default_deny ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (NOT private.is_platform_admin_clinical_access_denied()) WITH CHECK (NOT private.is_platform_admin_clinical_access_denied())',
        v_table
      );
    END IF;
  END LOOP;
END;
$guard$;
