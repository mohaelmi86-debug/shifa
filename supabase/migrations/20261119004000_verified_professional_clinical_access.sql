-- Enforce professional verification in database authorization, not only in the UI.
-- Pending / unverified professionals must not access patient or consultation data.

-- Centralized predicate used by RLS policies and SECURITY DEFINER helpers.
CREATE OR REPLACE FUNCTION private.is_verified_active_professional()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    JOIN public.professionals pro ON pro.user_id = up.id
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'professional'
      AND up.is_active IS TRUE
      AND pro.is_verified IS TRUE
      AND pro.status::text = 'active'
  );
$function$;

REVOKE ALL ON FUNCTION private.is_verified_active_professional() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_verified_active_professional() TO authenticated;

CREATE OR REPLACE FUNCTION private.org_admin_can_access_professional(p_professional_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    JOIN public.professional_organizations po
      ON po.professional_id = p_professional_id
     AND po.status::text = 'active'
     AND po.invitation_status = 'accepted'::public.invitation_status
    JOIN public.organizations org
      ON org.id = po.organization_id
     AND org.is_active IS TRUE
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'org_admin'
      AND up.is_active IS TRUE
      AND org.id = po.organization_id
  );
$function$;

REVOKE ALL ON FUNCTION private.org_admin_can_access_professional(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.org_admin_can_access_professional(uuid) TO authenticated;

-- Keep the public directory limited to active, verified professionals while
-- scoping organization-admin visibility to actual membership rows.
DROP POLICY IF EXISTS professionals_tenant_read_guard ON public.professionals;
CREATE POLICY professionals_tenant_read_guard
ON public.professionals
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.is_platform_admin()
  OR (status = 'active'::public.professional_status AND is_verified IS TRUE)
  OR private.org_admin_can_access_professional(id)
);

CREATE OR REPLACE FUNCTION private.is_clinical_role()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    WHERE up.id = (SELECT auth.uid())
      AND up.is_active IS TRUE
      AND (
        up.role::text IN ('org_admin', 'platform_admin')
        OR (
          up.role::text = 'professional'
          AND private.is_verified_active_professional()
        )
      )
  );
$function$;

CREATE OR REPLACE FUNCTION private.belongs_to_org(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT CASE
    WHEN target_org_id IS NULL THEN FALSE
    WHEN public.is_platform_admin() THEN TRUE
    ELSE EXISTS (
      SELECT 1
      FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
        AND up.organization_id = target_org_id
        AND up.is_active IS TRUE
        AND up.role::text = 'org_admin'
    )
    OR EXISTS (
      SELECT 1
      FROM public.professionals p
      JOIN public.user_profiles up ON up.id = p.user_id
        AND up.is_active IS TRUE
        AND up.role::text = 'professional'
      JOIN public.professional_organizations po ON po.professional_id = p.id
      WHERE p.user_id = (SELECT auth.uid())
        AND private.is_verified_active_professional()
        AND po.organization_id = target_org_id
        AND po.status::text = 'active'
    )
  END;
$function$;

CREATE OR REPLACE FUNCTION private.professional_has_patient_consultation(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.professionals pro
    JOIN public.user_profiles up ON up.id = pro.user_id
      AND up.is_active IS TRUE
      AND up.role::text = 'professional'
    JOIN public.professional_organizations po ON po.professional_id = pro.id
    JOIN public.appointments c
      ON c.professional_id = pro.id
     AND c.organization_id = po.organization_id
    WHERE pro.user_id = (SELECT auth.uid())
      AND private.is_verified_active_professional()
      AND po.status::text = 'active'
      AND c.patient_id = p_patient_id
  );
$function$;


CREATE OR REPLACE FUNCTION private.owns_professional_record(pro_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT private.is_verified_active_professional()
    AND EXISTS (
      SELECT 1
      FROM public.professionals pro
      WHERE pro.id = pro_id
        AND pro.user_id = (SELECT auth.uid())
    );
$function$;

-- Explicit restrictive guard for patient rows: permissive patient-self/admin policies
-- remain unchanged, but a professional role must be verified and active.
DROP POLICY IF EXISTS patients_professional_verification_guard ON public.patients;
CREATE POLICY patients_professional_verification_guard
ON public.patients
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  NOT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'professional'
  )
  OR private.is_verified_active_professional()
);

-- Guard direct professional-ID policies too. These restrictive policies apply
-- in addition to existing tenant/patient policies and preserve non-professional roles.
DO $guard$
DECLARE
  v_table text;
  v_tables text[] := ARRAY[
    'appointments', 'availability_slots', 'blood_requests', 'consultations',
    'health_records', 'hospitalizations', 'imaging_studies', 'kiosk_checkins',
    'lab_results', 'lab_samples', 'operating_room_schedules', 'patient_transfers',
    'pharmacy_pos_transactions', 'prescriptions', 'shifa_cards', 'shifa_ids',
    'transfer_notifications', 'vital_signs'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_tables LOOP
    IF to_regclass(format('public.%I', v_table)) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', v_table || '_professional_verification_guard', v_table);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (NOT EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = (SELECT auth.uid()) AND up.role::text = %L) OR private.is_verified_active_professional()) WITH CHECK (NOT EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = (SELECT auth.uid()) AND up.role::text = %L) OR private.is_verified_active_professional())',
        v_table || '_professional_verification_guard',
        v_table,
        'professional',
        'professional'
      );
    END IF;
  END LOOP;
END;
$guard$;

COMMENT ON FUNCTION private.org_admin_can_access_professional(uuid) IS
  'Organization admins can read professional profiles only through their own organization membership.';
COMMENT ON FUNCTION private.is_verified_active_professional() IS
  'True only for an active account with a verified active professional record.';
COMMENT ON FUNCTION private.owns_professional_record(uuid) IS
  'Own professional record access requires verified active professional status.';
COMMENT ON FUNCTION private.is_clinical_role() IS
  'Clinical access: active org/platform admins or verified active professionals only.';
COMMENT ON FUNCTION private.belongs_to_org(uuid) IS
  'Organization membership: active org admins or verified active professionals only.';
COMMENT ON FUNCTION private.professional_has_patient_consultation(uuid) IS
  'Patient consultation visibility requires a verified active professional and active organization membership.';
