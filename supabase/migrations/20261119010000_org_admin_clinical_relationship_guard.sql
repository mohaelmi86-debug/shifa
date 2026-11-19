-- Organization administration is not a clinical-care relationship.
-- A tenant administrator may manage organization operations, but may not read,
-- create, update or delete patient clinical records merely by managing the tenant.
-- Clinical access is limited to the patient themself or a verified professional
-- with an appointment for that patient in the exact active organization.

CREATE OR REPLACE FUNCTION private.org_admin_can_access_patient(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $function$
  SELECT FALSE;
$function$;

REVOKE ALL ON FUNCTION private.org_admin_can_access_patient(uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.org_admin_can_access_patient(uuid)
  TO authenticated;

COMMENT ON FUNCTION private.org_admin_can_access_patient(uuid) IS
  'Fail-closed: organization administration alone is not a patient-care relationship. Re-enable only through a separately modeled, explicit and audited care assignment.';

CREATE OR REPLACE FUNCTION private.clinical_scope_guard(
  p_patient_id uuid,
  p_org_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $function$
  SELECT p_patient_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.patients AS p
      WHERE p.id = p_patient_id
    )
    AND (
      private.owns_patient_record(p_patient_id)
      OR (
        p_org_id IS NOT NULL
        AND private.professional_has_patient_consultation_in_org(
          p_patient_id,
          p_org_id
        )
      )
    );
$function$;

REVOKE ALL ON FUNCTION private.clinical_scope_guard(uuid,uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.clinical_scope_guard(uuid,uuid)
  TO authenticated;

COMMENT ON FUNCTION private.clinical_scope_guard(uuid,uuid) IS
  'Clinical RLS guard: patient self-access or verified active professional with accepted active membership and appointment in the exact active organization. Org/platform administration alone is never sufficient.';

-- Replace the old broad admin allowance on every clinical table with both
-- patient_id and organization_id. Existing permissive policies remain in place,
-- but this restrictive policy intersects with them and blocks admin-only paths.
DO $guard$
DECLARE
  v_table text;
  v_tables text[] := ARRAY[
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
    'shifa_ids',
    'vital_signs'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = v_table
           AND column_name = 'patient_id'
       )
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = v_table
           AND column_name = 'organization_id'
       ) THEN
      EXECUTE format(
        'DROP POLICY IF EXISTS org_admin_clinical_relationship_guard ON public.%I',
        v_table
      );
      EXECUTE format(
        'CREATE POLICY org_admin_clinical_relationship_guard ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (private.clinical_scope_guard(patient_id, organization_id)) WITH CHECK (private.clinical_scope_guard(patient_id, organization_id))',
        v_table
      );
    END IF;
  END LOOP;
END;
$guard$;

-- Patient identity rows have no organization_id. Do not expose a tenant-wide
-- patient directory to org admins; professionals require an actual appointment.
DROP POLICY IF EXISTS org_admin_clinical_relationship_guard ON public.patients;
CREATE POLICY org_admin_clinical_relationship_guard
  ON public.patients
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.professional_has_patient_consultation(id)
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR private.professional_has_patient_consultation(id)
  );

-- SHIFA cards contain patient identity data but do not carry organization_id.
-- Access is limited to the card owner or a professional with an appointment.
DROP POLICY IF EXISTS org_admin_clinical_relationship_guard ON public.shifa_cards;
CREATE POLICY org_admin_clinical_relationship_guard
  ON public.shifa_cards
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (
      patient_id IS NOT NULL
      AND private.professional_has_patient_consultation(patient_id)
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR (
      patient_id IS NOT NULL
      AND private.professional_has_patient_consultation(patient_id)
    )
  );
