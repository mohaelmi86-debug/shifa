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
  v_invitation_function text;
  v_existing_professional_update text;
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

  -- Multi-organization membership support: accepting a second invitation must
  -- preserve the primary organization while inserting the additional membership.
  IF position('COALESCE(organization_id, v_invitation.organization_id)' IN pg_get_functiondef(
    'public.accept_professional_invitation(text)'::regprocedure
  )) = 0
     OR position('PROFESSIONAL_ALREADY_LINKED_TO_ANOTHER_ORGANIZATION' IN pg_get_functiondef(
       'public.accept_professional_invitation(text)'::regprocedure
     )) > 0 THEN
    RAISE EXCEPTION 'FAIL: professional invitation must support a second organization without replacing the primary organization';
  END IF;

  IF position('professional_organizations' IN pg_get_functiondef(
    'public.accept_professional_invitation(text)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: accepting an invitation must persist the organization membership row';
  END IF;

  -- A second invitation must not reset an already verified professional's
  -- global status. The newly added organization membership remains pending.
  SELECT pg_get_functiondef('public.accept_professional_invitation(text)'::regprocedure)
    INTO v_invitation_function;
  v_existing_professional_update := substring(
    v_invitation_function
    FROM position('IF v_professional_id IS NOT NULL THEN' IN v_invitation_function)
    FOR position('ELSE' IN substring(
      v_invitation_function FROM position('IF v_professional_id IS NOT NULL THEN' IN v_invitation_function) + 1
    )) 
  );
  IF v_existing_professional_update ILIKE '%is_verified = FALSE%'
     OR v_existing_professional_update ILIKE '%status = ''pending''%'
     OR v_existing_professional_update ILIKE '%first_name = v_invitation.%'
     OR v_existing_professional_update ILIKE '%last_name = v_invitation.%'
     OR v_existing_professional_update ILIKE '%license_number = v_invitation.%'
     OR v_existing_professional_update ILIKE '%email = v_email%' THEN
    RAISE EXCEPTION 'FAIL: adding an organization must preserve the existing global professional profile and verification state';
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

  -- Professional credential submission and review workflow (migration 20261119005000).
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'professional-credentials'
      AND public IS FALSE
      AND file_size_limit = 10485760
  ) THEN
    RAISE EXCEPTION 'FAIL: professional credential bucket must be private and limited to 10 MiB';
  END IF;

  SELECT c.relrowsecurity INTO v_rls
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relname = 'professional_credentials';

  IF v_rls IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'FAIL: professional_credentials must have RLS enabled';
  END IF;

  IF has_table_privilege('anon', 'public.professional_credentials', 'SELECT')
     OR has_table_privilege('authenticated', 'public.professional_credentials', 'INSERT')
     OR has_table_privilege('authenticated', 'public.professional_credentials', 'UPDATE')
     OR has_table_privilege('authenticated', 'public.professional_credentials', 'DELETE')
     OR has_column_privilege('authenticated', 'public.professional_credentials', 'review_note', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: credential metadata must be read-scoped, immutable to clients, and review notes private';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)', 'EXECUTE')
     OR NOT has_function_privilege('authenticated', 'public.review_professional_credential(uuid,text,text)', 'EXECUTE')
     OR has_function_privilege('anon', 'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)', 'EXECUTE')
     OR has_function_privilege('anon', 'public.review_professional_credential(uuid,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: credential RPC grants are not correctly scoped';
  END IF;

  IF NOT has_function_privilege('authenticated', 'public.list_my_professional_credential_organizations()', 'EXECUTE')
     OR has_function_privilege('anon', 'public.list_my_professional_credential_organizations()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: organization picker RPC grants are not correctly scoped';
  END IF;

  IF position('p_organization_id' IN pg_get_functiondef(
    'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)'::regprocedure
  )) = 0
     OR position('organization_id = p_organization_id' IN pg_get_functiondef(
       'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential submission must validate the explicitly selected organization';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'professional_credentials_storage_upload_guard'
      AND permissive = 'RESTRICTIVE' AND cmd = 'INSERT'
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'professional_credentials_storage_read_guard'
      AND permissive = 'RESTRICTIVE' AND cmd = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'FAIL: credential Storage access must have restrictive upload and read guards';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'professional_credentials_storage_delete_guard'
      AND permissive = 'RESTRICTIVE' AND cmd = 'DELETE'
  ) THEN
    RAISE EXCEPTION 'FAIL: credential cleanup must be restricted to the uploading user's folder';
  END IF;

  IF position('private.org_admin_can_access_professional' IN pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  )) = 0 OR position('SECURITY DEFINER' IN upper(pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  ))) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential review must be performed by a SECURITY DEFINER RPC with organization checks';
  END IF;

  -- Credential access must be scoped to the exact organization, not merely to a professional
  -- who may have memberships in multiple organizations.
  IF NOT has_function_privilege('authenticated', 'private.org_admin_can_access_professional_in_org(uuid,uuid)', 'EXECUTE')
     OR has_function_privilege('anon', 'private.org_admin_can_access_professional_in_org(uuid,uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: tenant-scoped credential helper grants are not correctly restricted';
  END IF;

  IF position('p_organization_id' IN pg_get_functiondef(
    'private.org_admin_can_access_professional_in_org(uuid,uuid)'::regprocedure
  )) = 0
     OR position('po.organization_id = p_organization_id' IN pg_get_functiondef(
       'private.org_admin_can_access_professional_in_org(uuid,uuid)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential access helper must match the administrator organization exactly';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'professional_credentials'
      AND policyname = 'professional_credentials_read_scope'
      AND qual ILIKE '%org_admin_can_access_professional_in_org%'
      AND qual ILIKE '%organization_id%'
  ) OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'professional_credentials_storage_read_guard'
      AND qual ILIKE '%org_admin_can_access_professional_in_org%'
      AND qual ILIKE '%organization_id%'
  ) THEN
    RAISE EXCEPTION 'FAIL: credential table and Storage reads must enforce exact organization scope';
  END IF;

  IF position('org_admin_can_access_professional_in_org' IN pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential review RPC must enforce exact organization scope';
  END IF;

  IF position('professional_license' IN pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  )) = 0 OR position('is_verified = TRUE' IN pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: approval of a valid professional license or registration must activate the verified profile';
  END IF;

  IF position('ORDER BY joined_at DESC' IN pg_get_functiondef(
    'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)'::regprocedure
  )) > 0
     OR position('ACTIVE_ORGANIZATION_MEMBERSHIP_REQUIRED' IN pg_get_functiondef(
       'public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential submission must validate the explicitly selected accepted organization membership';
  END IF;

  IF position('p_decision IS NULL' IN pg_get_functiondef(
    'public.review_professional_credential(uuid,text,text)'::regprocedure
  )) = 0 THEN
    RAISE EXCEPTION 'FAIL: credential review RPC must reject a NULL decision explicitly';
  END IF;

  -- Expired credential processor (requires migration 20261119006000).
  IF NOT has_function_privilege('service_role', 'public.process_expired_professional_credentials()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.process_expired_professional_credentials()', 'EXECUTE')
     OR has_function_privilege('anon', 'public.process_expired_professional_credentials()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: expiry processor must be executable only by service_role';
  END IF;

  IF position('SECURITY DEFINER' IN upper(pg_get_functiondef(
    'public.process_expired_professional_credentials()'::regprocedure
  ))) = 0
     OR position('expires_at < current_date' IN pg_get_functiondef(
       'public.process_expired_professional_credentials()'::regprocedure
     )) = 0
     OR position('valid_pc.expires_at IS NULL OR valid_pc.expires_at >= current_date' IN pg_get_functiondef(
       'public.process_expired_professional_credentials()'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: expiry processor must use server-side execution and preserve currently valid credentials';
  END IF;

  IF position('professional_organizations' IN pg_get_functiondef(
    'public.process_expired_professional_credentials()'::regprocedure
  )) = 0
     OR position('professional_credential_expired' IN pg_get_functiondef(
       'public.process_expired_professional_credentials()'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: expiry processor must suspend organization membership and create an audit record';
  END IF;


  -- Expiry reminders (migration 20261119007000): in-app queue only, no external delivery.
  IF NOT has_function_privilege('service_role', 'public.queue_professional_credential_expiry_reminders()', 'EXECUTE')
     OR has_function_privilege('authenticated', 'public.queue_professional_credential_expiry_reminders()', 'EXECUTE')
     OR has_function_privilege('anon', 'public.queue_professional_credential_expiry_reminders()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: credential expiry reminder queue must be executable only by service_role';
  END IF;

  IF position('ARRAY[30, 15, 7]' IN pg_get_functiondef(
    'public.queue_professional_credential_expiry_reminders()'::regprocedure
  )) = 0
     OR position('ON CONFLICT' IN upper(pg_get_functiondef(
       'public.queue_professional_credential_expiry_reminders()'::regprocedure
     ))) = 0
     OR position('credential_expiry' IN pg_get_functiondef(
       'public.queue_professional_credential_expiry_reminders()'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: reminder queue must target 30/15/7-day windows and be idempotent';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'notifications'
      AND indexname = 'uq_notifications_user_dedupe_key'
  ) THEN
    RAISE EXCEPTION 'FAIL: notification idempotency index is missing';
  END IF;

  IF position('admin_profile.role::text = ''org_admin''' IN pg_get_functiondef(
    'public.queue_professional_credential_expiry_reminders()'::regprocedure
  )) = 0
     OR position('admin_profile.organization_id = po.organization_id' IN pg_get_functiondef(
       'public.queue_professional_credential_expiry_reminders()'::regprocedure
     )) = 0
     OR position('org-credential-expiry:' IN pg_get_functiondef(
       'public.queue_professional_credential_expiry_reminders()'::regprocedure
     )) = 0
     OR position('recipient_role' IN pg_get_functiondef(
       'public.queue_professional_credential_expiry_reminders()'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: expiry reminders must notify only active admins of the owning organization with recipient-specific idempotency';
  END IF;

  -- Tenant scope for professional-owned clinical rows (migration 20261119008000).
  IF NOT has_function_privilege('authenticated', 'private.owns_professional_record_in_org(uuid,uuid)', 'EXECUTE')
     OR has_function_privilege('anon', 'private.owns_professional_record_in_org(uuid,uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: exact-organization professional ownership helper grants are not correctly scoped';
  END IF;

  IF position('po.organization_id = p_organization_id' IN pg_get_functiondef(
    'private.owns_professional_record_in_org(uuid,uuid)'::regprocedure
  )) = 0
     OR position('po.status::text = ''active''' IN pg_get_functiondef(
       'private.owns_professional_record_in_org(uuid,uuid)'::regprocedure
     )) = 0
     OR position('po.invitation_status' IN pg_get_functiondef(
       'private.owns_professional_record_in_org(uuid,uuid)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: professional-owned clinical access must require accepted, active membership in the exact organization';
  END IF;

  IF (SELECT count(*) FROM pg_policies
      WHERE schemaname = 'public'
        AND policyname IN (
          'appointments_professional_org_scope_guard',
          'health_records_professional_org_scope_guard',
          'prescriptions_professional_org_scope_guard'
        )
        AND permissive = 'RESTRICTIVE'
        AND cmd = 'ALL') < 3 THEN
    RAISE EXCEPTION 'FAIL: professional-owned appointment, health record and prescription rows must have exact-tenant restrictive guards';
  END IF;

  -- Availability and transfer-notification tenant boundaries (migration 20261119008000).
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'availability_slots'
      AND policyname = 'availability_slots_professional_org_scope_guard'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'ALL'
      AND qual ILIKE '%owns_professional_record_in_org%'
      AND with_check ILIKE '%owns_professional_record_in_org%'
  ) THEN
    RAISE EXCEPTION 'FAIL: professional availability writes must require exact active organization membership';
  END IF;

  IF NOT has_function_privilege('authenticated', 'private.is_transfer_notification_recipient(uuid,uuid)', 'EXECUTE')
     OR has_function_privilege('anon', 'private.is_transfer_notification_recipient(uuid,uuid)', 'EXECUTE')
     OR position('po.organization_id IN' IN pg_get_functiondef(
       'private.is_transfer_notification_recipient(uuid,uuid)'::regprocedure
     )) = 0 THEN
    RAISE EXCEPTION 'FAIL: transfer notification recipient validation must be authenticated-only and tenant-scoped';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'transfer_notifications'
      AND policyname = 'transfer_notifications_insert_scope_guard'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'INSERT'
      AND with_check ILIKE '%can_access_transfer%'
      AND with_check ILIKE '%is_transfer_notification_recipient%'
  ) THEN
    RAISE EXCEPTION 'FAIL: transfer notifications must be linked to an accessible transfer and valid participant';
  END IF;

  RAISE NOTICE 'PASS: registration, invitation, credential verification, expiry suspension and reminder queue security assertions';
END;
$$;
