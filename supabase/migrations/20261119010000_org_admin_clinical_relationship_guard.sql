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

-- Exact organization membership permits a professional to create a new
-- clinical workflow row, but does not grant read access to existing patient data.
CREATE OR REPLACE FUNCTION private.is_verified_professional_member_of_org(
  p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $function$
  SELECT p_organization_id IS NOT NULL
    AND private.is_verified_active_professional()
    AND EXISTS (
      SELECT 1
      FROM public.professionals AS pro
      JOIN public.professional_organizations AS po
        ON po.professional_id = pro.id
       AND po.organization_id = p_organization_id
       AND po.status::text = 'active'
       AND po.invitation_status = 'accepted'::public.invitation_status
      JOIN public.organizations AS org
        ON org.id = po.organization_id
       AND org.is_active IS TRUE
      WHERE pro.user_id = (SELECT auth.uid())
    );
$function$;

REVOKE ALL ON FUNCTION private.is_verified_professional_member_of_org(uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_verified_professional_member_of_org(uuid)
  TO authenticated;

-- Restrictive command-specific policies avoid blocking the creation of a new
-- appointment by a verified professional who has just been assigned to the
-- patient, while still preventing tenant-admin browsing of existing records.
DO $guard$
DECLARE
  v_table text;
  v_tables text[] := ARRAY[
    'appointments','blood_requests','consultations','health_records',
    'hospitalizations','imaging_studies','kiosk_checkins','lab_results',
    'lab_samples','operating_room_schedules','patient_transfers',
    'pharmacy_pos_transactions','prescriptions','shifa_ids','vital_signs'
  ];
  v_policy text;
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = v_table
           AND column_name = 'patient_id'
       )
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = v_table
           AND column_name = 'organization_id'
       ) THEN
      FOREACH v_policy IN ARRAY ARRAY[
        'org_admin_clinical_relationship_select',
        'org_admin_clinical_relationship_insert',
        'org_admin_clinical_relationship_update',
        'org_admin_clinical_relationship_delete'
      ] LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_policy, v_table);
      END LOOP;

      EXECUTE format(
        'CREATE POLICY org_admin_clinical_relationship_select ON public.%I AS RESTRICTIVE FOR SELECT TO authenticated USING (private.clinical_scope_guard(patient_id, organization_id))',
        v_table
      );
      EXECUTE format(
        'CREATE POLICY org_admin_clinical_relationship_insert ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (private.owns_patient_record(patient_id) OR private.is_verified_professional_member_of_org(organization_id))',
        v_table
      );
      EXECUTE format(
        'CREATE POLICY org_admin_clinical_relationship_update ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated USING (private.clinical_scope_guard(patient_id, organization_id)) WITH CHECK (private.clinical_scope_guard(patient_id, organization_id))',
        v_table
      );
      EXECUTE format(
        'CREATE POLICY org_admin_clinical_relationship_delete ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated USING (private.clinical_scope_guard(patient_id, organization_id))',
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

-- patient_documents.patient_id references auth.users(id), not patients.id.
-- Use the actual FK semantics and do not let uploader identity grant clinical reads.
CREATE OR REPLACE FUNCTION private.can_access_patient_document(
  p_patient_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $function$
  SELECT p_patient_user_id IS NOT NULL
    AND (
      p_patient_user_id = (SELECT auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.patients AS patient
        WHERE patient.user_id = p_patient_user_id
          AND private.professional_has_patient_consultation(patient.id)
      )
    );
$function$;

REVOKE ALL ON FUNCTION private.can_access_patient_document(uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.can_access_patient_document(uuid)
  TO authenticated;

DO $documents$
BEGIN
  IF to_regclass('public.patient_documents') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS clinical_scope_guard ON public.patient_documents';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_uploader_select ON public.patient_documents';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_uploader_insert ON public.patient_documents';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_relationship_select ON public.patient_documents';
    EXECUTE 'CREATE POLICY patient_documents_relationship_select ON public.patient_documents AS RESTRICTIVE FOR SELECT TO authenticated USING (private.can_access_patient_document(patient_id))';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_relationship_insert ON public.patient_documents';
    EXECUTE 'CREATE POLICY patient_documents_relationship_insert ON public.patient_documents AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (private.can_access_patient_document(patient_id) AND uploaded_by = (SELECT auth.uid()))';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_relationship_update ON public.patient_documents';
    EXECUTE 'CREATE POLICY patient_documents_relationship_update ON public.patient_documents AS RESTRICTIVE FOR UPDATE TO authenticated USING (private.can_access_patient_document(patient_id)) WITH CHECK (private.can_access_patient_document(patient_id))';
    EXECUTE 'DROP POLICY IF EXISTS patient_documents_relationship_delete ON public.patient_documents';
    EXECUTE 'CREATE POLICY patient_documents_relationship_delete ON public.patient_documents AS RESTRICTIVE FOR DELETE TO authenticated USING (patient_id = (SELECT auth.uid()) OR EXISTS (SELECT 1 FROM public.patients AS patient WHERE patient.user_id = patient_documents.patient_id AND private.professional_has_patient_consultation(patient.id)))';
  END IF;
END;
$documents$;

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


-- Harden name resolution for every SECURITY DEFINER helper in the private
-- schema. pg_catalog is first, auth is explicit, public is retained for the
-- schema-qualified application objects, and pg_temp is last.
DO $search_path$
DECLARE
  v_function record;
BEGIN
  FOR v_function IN
    SELECT p.oid
    FROM pg_proc AS p
    JOIN pg_namespace AS n ON n.oid = p.pronamespace
    WHERE n.nspname = 'private'
      AND p.prosecdef IS TRUE
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %s SET search_path = pg_catalog, auth, public, pg_temp',
      v_function.oid::regprocedure
    );
  END LOOP;
END;
$search_path$;


-- Storage object ownership is not clinical access. Platform administrators
-- must not bypass private-folder boundaries for medical documents/images.
DO $storage$
BEGIN
  IF to_regclass('storage.objects') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS lab_reports_select ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS lab_reports_insert ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS medical_images_select ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS medical_images_insert ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS clinical_storage_owner_default_deny ON storage.objects';

    EXECUTE $policy$
      CREATE POLICY clinical_storage_owner_default_deny
      ON storage.objects
      AS RESTRICTIVE
      FOR ALL
      TO authenticated
      USING (
        bucket_id NOT IN ('lab-reports', 'medical-images')
        OR (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
      WITH CHECK (
        bucket_id NOT IN ('lab-reports', 'medical-images')
        OR (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY lab_reports_select
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'lab-reports'
        AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY lab_reports_insert
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'lab-reports'
        AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY medical_images_select
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'medical-images'
        AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY medical_images_insert
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'medical-images'
        AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
      )
    $policy$;
  END IF;
END;
$storage$;
