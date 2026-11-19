-- Behavioral authorization tests using disposable synthetic identities only.
-- Executed by the isolated PostgreSQL CI service; never run against production.
-- All fixtures are rolled back at the end of this file.

BEGIN;

DO $fixtures$
DECLARE
  v_patient_user uuid := '10000000-0000-4000-8000-000000000001';
  v_verified_user uuid := '10000000-0000-4000-8000-000000000002';
  v_pending_user uuid := '10000000-0000-4000-8000-000000000003';
  v_org_admin_user uuid := '10000000-0000-4000-8000-000000000004';
  v_platform_admin_user uuid := '10000000-0000-4000-8000-000000000005';
  v_org uuid := '20000000-0000-4000-8000-000000000001';
  v_patient uuid := '30000000-0000-4000-8000-000000000001';
  v_verified_professional uuid := '40000000-0000-4000-8000-000000000001';
  v_pending_professional uuid := '40000000-0000-4000-8000-000000000002';
  v_visible_count integer;
BEGIN
  INSERT INTO auth.users (id, email) VALUES
    (v_patient_user, 'ci-patient@shifa.invalid'),
    (v_verified_user, 'ci-verified-professional@shifa.invalid'),
    (v_pending_user, 'ci-pending-professional@shifa.invalid'),
    (v_org_admin_user, 'ci-org-admin@shifa.invalid'),
    (v_platform_admin_user, 'ci-platform-admin@shifa.invalid')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (id, email, full_name, role, is_active) VALUES
    (v_patient_user, 'ci-patient@shifa.invalid', 'CI Patient', 'patient', true),
    (v_verified_user, 'ci-verified-professional@shifa.invalid', 'CI Verified Professional', 'professional', true),
    (v_pending_user, 'ci-pending-professional@shifa.invalid', 'CI Pending Professional', 'professional', true),
    (v_org_admin_user, 'ci-org-admin@shifa.invalid', 'CI Organization Admin', 'org_admin', true),
    (v_platform_admin_user, 'ci-platform-admin@shifa.invalid', 'CI Platform Admin', 'platform_admin', true)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_active = true;

  INSERT INTO public.organizations (id, name, org_type, is_active)
  VALUES (v_org, 'CI Synthetic Clinic', 'clinic', true)
  ON CONFLICT (id) DO UPDATE SET is_active = true;

  INSERT INTO public.professionals
    (id, user_id, first_name, last_name, profession, is_verified, status)
  VALUES
    (v_verified_professional, v_verified_user, 'Verified', 'Clinician', 'doctor', true, 'active'),
    (v_pending_professional, v_pending_user, 'Pending', 'Clinician', 'doctor', false, 'pending')
  ON CONFLICT (id) DO UPDATE
    SET is_verified = EXCLUDED.is_verified, status = EXCLUDED.status;

  INSERT INTO public.professional_organizations
    (professional_id, organization_id, status, invitation_status)
  VALUES
    (v_verified_professional, v_org, 'active', 'accepted'),
    (v_pending_professional, v_org, 'pending', 'accepted')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.patients (id, user_id, shifa_id, first_name, last_name)
  VALUES (v_patient, v_patient_user, 'CI-SYNTHETIC-PATIENT-001', 'CI', 'Patient')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.appointments
    (patient_id, professional_id, organization_id, scheduled_at, status)
  VALUES (v_patient, v_verified_professional, v_org, now() + interval '1 day', 'scheduled');

  -- Switch to the same role used by Supabase client sessions and exercise
  -- the real SECURITY DEFINER authorization helpers under synthetic JWT claims.
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  EXECUTE 'SET LOCAL ROLE authenticated';

  PERFORM set_config('request.jwt.claim.sub', v_verified_user::text, true);
  IF private.is_verified_active_professional() IS NOT TRUE
     OR private.is_verified_professional_member_of_org(v_org) IS NOT TRUE
     OR private.professional_has_patient_consultation_in_org(v_patient, v_org) IS NOT TRUE
     OR private.clinical_scope_guard(v_patient, v_org) IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: verified active professional with accepted membership and patient appointment must have scoped clinical access';
  END IF;

  PERFORM set_config('request.jwt.claim.sub', v_pending_user::text, true);
  IF private.is_verified_active_professional() IS NOT FALSE
     OR private.is_verified_professional_member_of_org(v_org) IS NOT FALSE
     OR private.professional_has_patient_consultation_in_org(v_patient, v_org) IS NOT FALSE
     OR private.clinical_scope_guard(v_patient, v_org) IS NOT FALSE THEN
    RAISE EXCEPTION 'FAIL: pending/unverified professional must be denied clinical access';
  END IF;

  PERFORM set_config('request.jwt.claim.sub', v_org_admin_user::text, true);
  IF private.org_admin_can_access_patient(v_patient) IS NOT FALSE
     OR private.clinical_scope_guard(v_patient, v_org) IS NOT FALSE THEN
    RAISE EXCEPTION 'FAIL: organization administrator must not gain clinical access from tenant administration alone';
  END IF;
  SELECT count(*) INTO v_visible_count FROM public.patients WHERE id = v_patient;
  IF v_visible_count <> 0 THEN
    RAISE EXCEPTION 'FAIL: organization administrator can read a patient without an explicit care relationship';
  END IF;

  PERFORM set_config('request.jwt.claim.sub', v_platform_admin_user::text, true);
  IF private.is_platform_admin_clinical_access_denied() IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: platform administrator must be recognized by clinical default-deny guard';
  END IF;
  SELECT count(*) INTO v_visible_count FROM public.patients WHERE id = v_patient;
  IF v_visible_count <> 0 THEN
    RAISE EXCEPTION 'FAIL: platform administrator can read a clinical patient row';
  END IF;

  PERFORM set_config('request.jwt.claim.sub', v_patient_user::text, true);
  SELECT count(*) INTO v_visible_count FROM public.patients WHERE id = v_patient;
  IF v_visible_count <> 1 THEN
    RAISE EXCEPTION 'FAIL: patient must retain access to their own patient record';
  END IF;

  EXECUTE 'RESET ROLE';
  RAISE NOTICE 'PASS: synthetic patient, verified professional, pending professional, org admin and platform admin authorization scenarios';
END;
$fixtures$;

ROLLBACK;
