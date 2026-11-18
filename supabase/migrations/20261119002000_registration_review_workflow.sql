-- Privileged review workflow for professional and organization applications.
-- Only active platform administrators can approve or reject applications.

CREATE OR REPLACE FUNCTION public.review_registration_application(
  p_application_id uuid,
  p_decision text,
  p_review_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_admin_id uuid := auth.uid();
  v_application public.registration_applications%ROWTYPE;
  v_payload jsonb;
  v_organization_id uuid;
  v_org_type public.org_type;
BEGIN
  IF v_admin_id IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.user_profiles AS profile
    WHERE profile.id = v_admin_id
      AND profile.role::text = 'platform_admin'
      AND profile.is_active IS TRUE
  ) THEN
    RAISE EXCEPTION 'FORBIDDEN' USING ERRCODE = '42501';
  END IF;

  IF p_decision IS NULL OR p_decision NOT IN ('approve', 'reject') THEN
    RAISE EXCEPTION 'INVALID_DECISION' USING ERRCODE = '22023';
  END IF;

  SELECT *
  INTO v_application
  FROM public.registration_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'APPLICATION_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_application.status NOT IN ('pending', 'in_review') THEN
    RAISE EXCEPTION 'APPLICATION_ALREADY_REVIEWED' USING ERRCODE = '55000';
  END IF;

  v_payload := v_application.payload;

  IF p_decision = 'reject' THEN
    UPDATE public.registration_applications
    SET status = 'rejected',
        reviewed_at = now(),
        reviewed_by = v_admin_id,
        review_note = NULLIF(left(trim(COALESCE(p_review_note, '')), 2000), '')
    WHERE id = p_application_id;

    RETURN p_application_id;
  END IF;

  IF v_application.application_type = 'professional' THEN
    IF EXISTS (
      SELECT 1 FROM public.professionals
      WHERE user_id = v_application.applicant_id
    ) THEN
      RAISE EXCEPTION 'PROFESSIONAL_PROFILE_ALREADY_EXISTS' USING ERRCODE = '23505';
    END IF;

    INSERT INTO public.professionals (
      user_id, first_name, last_name, profession, specialty, license_number,
      country_code, phone, email, is_verified, status
    ) VALUES (
      v_application.applicant_id,
      v_payload->>'firstName',
      v_payload->>'lastName',
      v_payload->>'profession',
      NULLIF(v_payload->>'specialty', ''),
      NULLIF(v_payload->>'licenseNumber', ''),
      v_payload->>'country',
      NULLIF(v_payload->>'phone', ''),
      NULLIF(v_payload->>'email', ''),
      TRUE,
      'active'::public.professional_status
    );

    UPDATE public.user_profiles
    SET role = 'professional'::public.user_role,
        updated_at = now()
    WHERE id = v_application.applicant_id;

    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object('role', 'professional')
    WHERE id = v_application.applicant_id;

  ELSIF v_application.application_type = 'organization' THEN
    v_org_type := CASE v_payload->>'organizationType'
      WHEN 'hopital' THEN 'hospital'::public.org_type
      WHEN 'clinique' THEN 'clinic'::public.org_type
      WHEN 'centre-sante' THEN 'health_center'::public.org_type
      WHEN 'cabinet' THEN 'medical_office'::public.org_type
      WHEN 'laboratoire' THEN 'laboratory'::public.org_type
      WHEN 'pharmacie' THEN 'pharmacy'::public.org_type
      WHEN 'imagerie' THEN 'imaging_center'::public.org_type
      WHEN 'universite' THEN 'university'::public.org_type
      WHEN 'ministere' THEN 'ministry'::public.org_type
      WHEN 'assurance' THEN 'insurance'::public.org_type
      WHEN 'ong' THEN 'ngo'::public.org_type
      ELSE 'other'::public.org_type
    END;

    INSERT INTO public.organizations (
      name, org_type, country_code, city, address, phone, email,
      is_verified, is_active, created_by
    ) VALUES (
      v_payload->>'organizationName',
      v_org_type,
      v_payload->>'country',
      NULLIF(v_payload->>'city', ''),
      NULLIF(v_payload->>'address', ''),
      NULLIF(v_payload->>'phone', ''),
      COALESCE(NULLIF(v_payload->>'contactEmail', ''), NULLIF(v_payload->>'adminEmail', '')),
      TRUE,
      TRUE,
      v_application.applicant_id
    )
    RETURNING id INTO v_organization_id;

    UPDATE public.user_profiles
    SET role = 'org_admin'::public.user_role,
        organization_id = v_organization_id,
        updated_at = now()
    WHERE id = v_application.applicant_id;

    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
      || jsonb_build_object(
        'role', 'org_admin',
        'organization_id', v_organization_id::text
      )
    WHERE id = v_application.applicant_id;
  ELSE
    RAISE EXCEPTION 'UNSUPPORTED_APPLICATION_TYPE' USING ERRCODE = '22023';
  END IF;

  UPDATE public.registration_applications
  SET status = 'approved',
      reviewed_at = now(),
      reviewed_by = v_admin_id,
      review_note = NULLIF(left(trim(COALESCE(p_review_note, '')), 2000), '')
  WHERE id = p_application_id;

  RETURN p_application_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.review_registration_application(uuid, text, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_registration_application(uuid, text, text)
  TO authenticated;
