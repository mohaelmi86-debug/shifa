-- Preserve the existing signup authorization model while storing the
-- additional patient demographics collected by the public registration form.
-- User-editable metadata is used only as profile data, never to grant roles.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_role public.user_role := 'patient'::public.user_role;
  v_requested_role text;
  v_full_name text;
  v_first_name text;
  v_last_name text;
  v_specialty text;
  v_date_of_birth date;
  v_gender public.gender_type;
BEGIN
  -- raw_user_meta_data is user-editable and is deliberately ignored for authorization.
  -- Only trusted app_metadata may request non-patient roles.
  v_requested_role := NULLIF(NEW.raw_app_meta_data->>'role', '');
  IF v_requested_role IS NOT NULL THEN
    BEGIN
      v_role := v_requested_role::public.user_role;
    EXCEPTION WHEN OTHERS THEN
      v_role := 'patient'::public.user_role;
    END;
  END IF;

  -- Even trusted metadata cannot create an org admin or platform admin via signup.
  -- Those roles must be provisioned by a separate privileged approval process.
  IF v_role IN ('org_admin'::public.user_role, 'platform_admin'::public.user_role) THEN
    v_role := 'patient'::public.user_role;
  END IF;

  IF v_role NOT IN ('patient'::public.user_role, 'professional'::public.user_role) THEN
    v_role := 'patient'::public.user_role;
  END IF;

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'fullName'), ''),
    split_part(NEW.email, '@', 1)
  );
  v_first_name := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), ''), split_part(v_full_name, ' ', 1));
  v_last_name := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), ''), NULLIF(TRIM(substr(v_full_name, length(v_first_name) + 2)), ''), v_first_name);

  INSERT INTO public.user_profiles (
    id, email, full_name, phone, role, organization_id, country, is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    COALESCE(NEW.phone, NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), '')),
    v_role,
    NULL,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''), 'FR'),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.user_profiles.full_name),
    updated_at = now();

  IF v_role = 'professional'::public.user_role THEN
    v_specialty := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'specialty'), ''), 'general_practice');
    IF v_specialty NOT IN ('general_practice', 'cardiology', 'dermatology', 'endocrinology', 'gastroenterology', 'gynecology', 'neurology', 'oncology', 'ophthalmology', 'orthopedics', 'pediatrics', 'psychiatry', 'pulmonology', 'radiology', 'surgery', 'urology', 'emergency_medicine', 'anesthesiology', 'pathology', 'other') THEN
      v_specialty := 'other';
    END IF;

    INSERT INTO public.professionals (
      user_id, first_name, last_name, specialty, license_number,
      country_code, phone, email, is_verified
    ) VALUES (
      NEW.id, v_first_name, v_last_name, v_specialty,
      NULLIF(TRIM(NEW.raw_user_meta_data->>'license_number'), ''),
      COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''), 'FR'),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''),
      NEW.email, FALSE
    )
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    -- Invalid optional demographic values must not prevent account creation.
    BEGIN
      v_date_of_birth := NULLIF(TRIM(NEW.raw_user_meta_data->>'date_of_birth'), '')::date;
    EXCEPTION WHEN OTHERS THEN
      v_date_of_birth := NULL;
    END;

    v_gender := CASE LOWER(COALESCE(NEW.raw_user_meta_data->>'gender', ''))
      WHEN 'male' THEN 'male'::public.gender_type
      WHEN 'female' THEN 'female'::public.gender_type
      WHEN 'other' THEN 'other'::public.gender_type
      WHEN 'prefer_not_to_say' THEN 'prefer_not_to_say'::public.gender_type
      ELSE NULL
    END;

    INSERT INTO public.patients (
      user_id, first_name, last_name, phone, email, country_code,
      date_of_birth, gender
    ) VALUES (
      NEW.id, v_first_name, v_last_name,
      COALESCE(NEW.phone, NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), '')),
      NEW.email,
      COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'country'), ''), 'FR'),
      v_date_of_birth,
      v_gender
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;
