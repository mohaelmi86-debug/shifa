-- Behavioral authorization tests using disposable synthetic identities only.
-- Executed by the isolated PostgreSQL CI service; never run against production.
-- All fixtures are rolled back at the end of this file.

BEGIN;

INSERT INTO auth.users (id, email) VALUES
  ('10000000-0000-4000-8000-000000000001', 'ci-patient@shifa.invalid'),
  ('10000000-0000-4000-8000-000000000002', 'ci-verified-professional@shifa.invalid'),
  ('10000000-0000-4000-8000-000000000003', 'ci-pending-professional@shifa.invalid'),
  ('10000000-0000-4000-8000-000000000004', 'ci-org-admin@shifa.invalid'),
  ('10000000-0000-4000-8000-000000000005', 'ci-platform-admin@shifa.invalid')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_profiles (id, email, full_name, role, is_active) VALUES
  ('10000000-0000-4000-8000-000000000001', 'ci-patient@shifa.invalid', 'CI Patient', 'patient', true),
  ('10000000-0000-4000-8000-000000000002', 'ci-verified-professional@shifa.invalid', 'CI Verified Professional', 'professional', true),
  ('10000000-0000-4000-8000-000000000003', 'ci-pending-professional@shifa.invalid', 'CI Pending Professional', 'professional', true),
  ('10000000-0000-4000-8000-000000000004', 'ci-org-admin@shifa.invalid', 'CI Organization Admin', 'org_admin', true),
  ('10000000-0000-4000-8000-000000000005', 'ci-platform-admin@shifa.invalid', 'CI Platform Admin', 'platform_admin', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_active = true;

INSERT INTO public.organizations (id, name, org_type, is_active)
VALUES ('20000000-0000-4000-8000-000000000001', 'CI Synthetic Clinic', 'clinic', true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

INSERT INTO public.professionals
  (id, user_id, first_name, last_name, profession, is_verified, status)
VALUES
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', 'Verified', 'Clinician', 'doctor', true, 'active'),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', 'Pending', 'Clinician', 'doctor', false, 'pending')
ON CONFLICT (id) DO UPDATE
  SET is_verified = EXCLUDED.is_verified, status = EXCLUDED.status;

INSERT INTO public.professional_organizations
  (professional_id, organization_id, status, invitation_status)
VALUES
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'active', 'accepted'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'pending', 'accepted')
ON CONFLICT DO NOTHING;

INSERT INTO public.patients (id, user_id, shifa_id, first_name, last_name)
VALUES ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'CI-SYNTHETIC-PATIENT-001', 'CI', 'Patient')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.appointments
  (patient_id, professional_id, organization_id, scheduled_at, status)
VALUES (
  '30000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  now() + interval '1 day',
  'scheduled'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.role', 'authenticated', true);

DO $assertions$
DECLARE
  v_visible_count integer;
BEGIN
  -- Verified professional: active profile, verified license, accepted exact-org
  -- membership and an appointment for this patient in that same organization.
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
  IF private.is_verified_active_professional() IS NOT TRUE
     OR private.is_verified_professional_member_of_org('20000000-0000-4000-8000-000000000001') IS NOT TRUE
     OR private.professional_has_patient_consultation_in_org(
       '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001'
     ) IS NOT TRUE
     OR private.clinical_scope_guard(
       '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001'
     ) IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: verified professional with accepted membership and patient appointment must have scoped clinical access';
  END IF;

  -- Pending/unverified professional is denied, even though a membership row
  -- and patient appointment exist for another professional in that tenant.
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
  IF private.is_verified_active_professional() IS NOT FALSE
     OR private.is_verified_professional_member_of_org('20000000-0000-4000-8000-000000000001') IS NOT FALSE
     OR private.professional_has_patient_consultation_in_org(
       '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001'
     ) IS NOT FALSE
     OR private.clinical_scope_guard(
       '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001'
     ) IS NOT FALSE THEN
    RAISE EXCEPTION 'FAIL: pending/unverified professional must be denied clinical access';
  END IF;

  -- Tenant administration alone is not a care relationship.
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000004', true);
  IF private.org_admin_can_access_patient('30000000-0000-4000-8000-000000000001') IS NOT FALSE
     OR private.clinical_scope_guard(
       '30000000-0000-4000-8000-000000000001',
       '20000000-0000-4000-8000-000000000001'
     ) IS NOT FALSE THEN
    RAISE EXCEPTION 'FAIL: organization administrator must not gain clinical access from tenant administration alone';
  END IF;
  SELECT count(*) INTO v_visible_count
  FROM public.patients WHERE id = '30000000-0000-4000-8000-000000000001';
  IF v_visible_count <> 0 THEN
    RAISE EXCEPTION 'FAIL: organization administrator can read a patient without an explicit care relationship';
  END IF;

  -- Platform administration is also explicitly excluded from clinical access.
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000005', true);
  IF private.is_platform_admin_clinical_access_denied() IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: platform administrator must be recognized by clinical default-deny guard';
  END IF;
  SELECT count(*) INTO v_visible_count
  FROM public.patients WHERE id = '30000000-0000-4000-8000-000000000001';
  IF v_visible_count <> 0 THEN
    RAISE EXCEPTION 'FAIL: platform administrator can read a clinical patient row';
  END IF;

  -- Patient self-access remains intact.
  PERFORM set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
  SELECT count(*) INTO v_visible_count
  FROM public.patients WHERE id = '30000000-0000-4000-8000-000000000001';
  IF v_visible_count <> 1 THEN
    RAISE EXCEPTION 'FAIL: patient must retain access to their own patient record';
  END IF;
END;
$assertions$;

RESET ROLE;
ROLLBACK;
