-- Secure intake for professional and healthcare-organization registration.
-- The auth trigger stores a whitelisted copy of user-supplied application data.
-- It does not grant roles, activate organizations, or verify credentials.

CREATE TABLE IF NOT EXISTS public.registration_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_type text NOT NULL CHECK (application_type IN ('professional', 'organization')),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'withdrawn')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_note text,
  CONSTRAINT registration_applications_payload_size CHECK (octet_length(payload::text) <= 20000)
);

CREATE INDEX IF NOT EXISTS registration_applications_status_submitted_idx
  ON public.registration_applications (status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS registration_applications_applicant_idx
  ON public.registration_applications (applicant_id, submitted_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS registration_applications_one_open_per_type_idx
  ON public.registration_applications (applicant_id, application_type)
  WHERE status IN ('pending', 'in_review');

ALTER TABLE public.registration_applications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.registration_applications FROM anon, authenticated;
GRANT SELECT ON TABLE public.registration_applications TO authenticated;

DROP POLICY IF EXISTS registration_applications_read_own_or_platform_admin
  ON public.registration_applications;
CREATE POLICY registration_applications_read_own_or_platform_admin
  ON public.registration_applications
  FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.user_profiles AS profile
      WHERE profile.id = auth.uid()
        AND profile.role::text = 'platform_admin'
        AND profile.is_active IS TRUE
    )
  );

CREATE OR REPLACE FUNCTION public.capture_registration_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_type text;
  v_data jsonb;
  v_payload jsonb;
BEGIN
  v_type := lower(COALESCE(NEW.raw_user_meta_data->>'registration_type', ''));
  v_data := NEW.raw_user_meta_data->'registration_data';

  IF jsonb_typeof(v_data) <> 'object' THEN
    RETURN NEW;
  END IF;

  IF v_type = 'professional' THEN
    v_payload := jsonb_build_object(
      'firstName', NULLIF(left(trim(v_data->>'firstName'), 100), ''),
      'lastName', NULLIF(left(trim(v_data->>'lastName'), 100), ''),
      'profession', NULLIF(left(trim(v_data->>'profession'), 100), ''),
      'specialty', NULLIF(left(trim(v_data->>'specialty'), 150), ''),
      'licenseNumber', NULLIF(left(trim(v_data->>'licenseNumber'), 120), ''),
      'country', NULLIF(left(trim(v_data->>'country'), 2), ''),
      'phone', NULLIF(left(trim(v_data->>'phone'), 40), ''),
      'email', lower(NULLIF(left(trim(v_data->>'email'), 254), '')),
      'professionalType', CASE
        WHEN v_data->>'professionalType' IN ('liberal', 'salarie')
          THEN v_data->>'professionalType'
        ELSE 'liberal'
      END
    );

    IF v_payload->>'firstName' IS NULL
      OR v_payload->>'lastName' IS NULL
      OR v_payload->>'profession' IS NULL
      OR v_payload->>'licenseNumber' IS NULL
      OR v_payload->>'country' IS NULL
      OR v_payload->>'phone' IS NULL
      OR v_payload->>'email' IS NULL THEN
      RETURN NEW;
    END IF;

  ELSIF v_type = 'organization' THEN
    v_payload := jsonb_build_object(
      'organizationName', NULLIF(left(trim(v_data->>'organizationName'), 180), ''),
      'organizationType', NULLIF(left(trim(v_data->>'organizationType'), 80), ''),
      'country', NULLIF(left(trim(v_data->>'country'), 2), ''),
      'city', NULLIF(left(trim(v_data->>'city'), 120), ''),
      'address', NULLIF(left(trim(v_data->>'address'), 250), ''),
      'phone', NULLIF(left(trim(v_data->>'phone'), 40), ''),
      'contactEmail', lower(NULLIF(left(trim(v_data->>'contactEmail'), 254), '')),
      'registrationNumber', NULLIF(left(trim(v_data->>'registrationNumber'), 120), ''),
      'adminFirstName', NULLIF(left(trim(v_data->>'adminFirstName'), 100), ''),
      'adminLastName', NULLIF(left(trim(v_data->>'adminLastName'), 100), ''),
      'adminEmail', lower(NULLIF(left(trim(v_data->>'adminEmail'), 254), ''))
    );

    IF v_payload->>'organizationName' IS NULL
      OR v_payload->>'organizationType' IS NULL
      OR v_payload->>'country' IS NULL
      OR v_payload->>'city' IS NULL
      OR v_payload->>'address' IS NULL
      OR v_payload->>'phone' IS NULL
      OR v_payload->>'adminFirstName' IS NULL
      OR v_payload->>'adminLastName' IS NULL
      OR v_payload->>'adminEmail' IS NULL THEN
      RETURN NEW;
    END IF;
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.registration_applications (
    applicant_id, application_type, payload
  ) VALUES (
    NEW.id, v_type, v_payload
  );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_registration_application
  ON auth.users;
CREATE TRIGGER on_auth_user_registration_application
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_registration_application();

REVOKE ALL ON FUNCTION public.capture_registration_application() FROM PUBLIC, anon, authenticated;
