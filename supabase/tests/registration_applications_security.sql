-- SHIFA registration workflow security assertions.
-- Run only against a disposable/staging database after both registration migrations.
-- This script is read-only and intentionally raises an exception on a failed assertion.

DO $$
DECLARE
  v_rls boolean;
  v_trigger_count integer;
  v_policy_count integer;
  v_config text[];
  v_security_definer boolean;
BEGIN
  SELECT c.relrowsecurity
    INTO v_rls
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = 'registration_applications';

  IF v_rls IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'FAIL: RLS must be enabled on registration_applications';
  END IF;

  IF has_table_privilege('anon', 'public.registration_applications', 'SELECT')
     OR has_table_privilege('anon', 'public.registration_applications', 'INSERT')
     OR has_table_privilege('anon', 'public.registration_applications', 'UPDATE')
     OR has_table_privilege('anon', 'public.registration_applications', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: anon must have no table privileges';
  END IF;

  IF has_table_privilege('authenticated', 'public.registration_applications', 'INSERT')
     OR has_table_privilege('authenticated', 'public.registration_applications', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.registration_applications', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: authenticated clients must not mutate application rows directly';
  END IF;

  IF NOT has_column_privilege('authenticated', 'public.registration_applications', 'applicant_id', 'SELECT')
     OR NOT has_column_privilege('authenticated', 'public.registration_applications', 'status', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: applicants must be able to read their own status fields';
  END IF;

  IF has_column_privilege('authenticated', 'public.registration_applications', 'review_note', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: internal review notes must not be readable by clients';
  END IF;

  IF has_function_privilege('anon', 'public.review_registration_application(uuid,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon must not execute review_registration_application';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.review_registration_application(uuid,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: authenticated platform admins need the RPC grant (role check remains inside function)';
  END IF;

  SELECT count(*)
    INTO v_trigger_count
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'auth'
    AND c.relname = 'users'
    AND t.tgname = 'on_auth_user_registration_application'
    AND NOT t.tgisinternal;

  IF v_trigger_count <> 1 THEN
    RAISE EXCEPTION 'FAIL: expected exactly one auth registration capture trigger';
  END IF;

  SELECT count(*)
    INTO v_policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'registration_applications'
    AND cmd <> 'SELECT';

  IF v_policy_count <> 0 THEN
    RAISE EXCEPTION 'FAIL: no client write policies should exist on registration_applications';
  END IF;

  SELECT p.proconfig
    INTO v_config
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'review_registration_application'
    AND pg_get_function_identity_arguments(p.oid) = 'p_application_id uuid, p_decision text, p_review_note text';

  SELECT p.prosecdef
    INTO v_security_definer
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname = 'review_registration_application'
    AND pg_get_function_identity_arguments(p.oid) = 'p_application_id uuid, p_decision text, p_review_note text';

  IF v_security_definer IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'FAIL: review RPC must be SECURITY DEFINER';
  END IF;

  IF v_config IS NULL OR NOT ('search_path=public, pg_temp' = ANY(v_config)) THEN
    RAISE EXCEPTION 'FAIL: review RPC must pin its search_path';
  END IF;

  -- Organization invitation security checks (requires migration 20261119003000).
  SELECT c.relrowsecurity
    INTO v_rls
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relname = 'organization_professional_invitations';

  IF v_rls IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'FAIL: RLS must be enabled on organization_professional_invitations';
  END IF;

  IF has_table_privilege('anon', 'public.organization_professional_invitations', 'SELECT')
     OR has_table_privilege('authenticated', 'public.organization_professional_invitations', 'SELECT')
     OR has_table_privilege('authenticated', 'public.organization_professional_invitations', 'INSERT')
     OR has_table_privilege('authenticated', 'public.organization_professional_invitations', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.organization_professional_invitations', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL: invitation tokens and rows must not be directly accessible to clients';
  END IF;

  IF has_function_privilege('anon', 'public.create_professional_invitation(text,text,text,text,text,text,text,text)', 'EXECUTE')
     OR has_function_privilege('anon', 'public.accept_professional_invitation(text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: anon must not execute invitation RPCs';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.create_professional_invitation(text,text,text,text,text,text,text,text)', 'EXECUTE')
     OR NOT has_function_privilege('authenticated', 'public.accept_professional_invitation(text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: authenticated users need invitation RPC grants (authorization remains enforced inside functions)';
  END IF;

  IF position('professional_organizations' IN pg_get_functiondef(
    'public.accept_professional_invitation(text)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: accepting an invitation must persist the organization membership row';
  END IF;

  -- Verified-professional clinical access checks (requires migration 20261119004000).
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'professionals'
      AND policyname = 'professionals_tenant_read_guard'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'SELECT'
  ) OR position('professional_organizations' IN pg_get_functiondef(
    'private.org_admin_can_access_professional(uuid)'::regprocedure
  )) = 0 OR position('org_admin' IN pg_get_functiondef(
    'private.org_admin_can_access_professional(uuid)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: professional directory reads must be restricted to self, verified public profiles, platform admins, or the owning organization';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patients'
      AND policyname = 'patients_professional_verification_guard'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'SELECT'
      AND qual ILIKE '%user_profiles%'
      AND qual ILIKE '%is_verified%'
      AND qual ILIKE '%active%'
  ) THEN
    RAISE EXCEPTION 'FAIL: patient SELECT must have a restrictive guard for all professional profiles, including inactive ones, requiring verified active status';
  END IF;

  IF position('private.is_verified_active_professional()' IN pg_get_functiondef(
    'private.is_clinical_role()'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: clinical role helper must delegate to the verified active professional predicate';
  END IF;

  IF position('private.is_verified_active_professional()' IN pg_get_functiondef(
    'private.belongs_to_org(uuid)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: professional organization membership must require verification';
  END IF;

  IF position('private.is_verified_active_professional()' IN pg_get_functiondef(
    'private.professional_has_patient_consultation(uuid)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: patient consultation visibility must require verification';
  END IF;

  IF position('pro.is_verified IS TRUE' IN pg_get_functiondef(
    'private.is_verified_active_professional()'::regprocedure
  )) = 0 OR position('pro.status::text = ''active''' IN pg_get_functiondef(
    'private.is_verified_active_professional()'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: central predicate must require verified active professional status';
  END IF;

  IF position('private.is_verified_active_professional()' IN pg_get_functiondef(
    'private.owns_professional_record(uuid)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: professional-owned clinical records must require verified active status';
  END IF;

  SELECT count(*)
    INTO v_policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND policyname LIKE '%_professional_verification_guard'
    AND permissive = 'RESTRICTIVE';

  IF v_policy_count < 19 THEN
    RAISE EXCEPTION 'FAIL: expected restrictive verification guards on patients and clinical tables; found %', v_policy_count;
  END IF;

  RAISE NOTICE 'PASS: registration and organization invitation privilege, RLS, trigger and RPC configuration assertions';
END;
$$;
