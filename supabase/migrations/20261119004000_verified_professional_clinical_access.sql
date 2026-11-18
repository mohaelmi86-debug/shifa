-- Enforce professional verification in database authorization, not only in the UI.
-- Pending / unverified professionals must not access patient or consultation data.

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
          AND EXISTS (
            SELECT 1
            FROM public.professionals pro
            WHERE pro.user_id = up.id
              AND pro.is_verified IS TRUE
              AND pro.status::text = 'active'
          )
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
    WHEN private.is_platform_admin() THEN TRUE
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
        AND p.is_verified IS TRUE
        AND p.status::text = 'active'
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
    JOIN public.consultations c
      ON c.professional_id = pro.id
     AND c.organization_id = po.organization_id
    WHERE pro.user_id = (SELECT auth.uid())
      AND pro.is_verified IS TRUE
      AND pro.status::text = 'active'
      AND po.status::text = 'active'
      AND c.patient_id = p_patient_id
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
  OR EXISTS (
    SELECT 1
    FROM public.professionals pro
    WHERE pro.user_id = (SELECT auth.uid())
      AND pro.is_verified IS TRUE
      AND pro.status::text = 'active'
  )
);

COMMENT ON FUNCTION private.is_clinical_role() IS
  'Clinical access: active org/platform admins or verified active professionals only.';
COMMENT ON FUNCTION private.belongs_to_org(uuid) IS
  'Organization membership: active org admins or verified active professionals only.';
COMMENT ON FUNCTION private.professional_has_patient_consultation(uuid) IS
  'Patient consultation visibility requires a verified active professional and active organization membership.';
