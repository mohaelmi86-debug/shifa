-- Organization-managed invitations for salaried / attached healthcare professionals.
-- The raw token is returned once to the authorized organization admin; only its SHA-256 hash is stored.
-- Acceptance links a verified account to the inviter's organization but does NOT mark credentials verified.

CREATE TABLE IF NOT EXISTS public.organization_professional_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  invited_email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  profession text NOT NULL,
  specialty text,
  license_number text,
  country_code text,
  phone text,
  token_hash bytea NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organization_professional_invitation_email_check
    CHECK (invited_email = lower(trim(invited_email))),
  CONSTRAINT organization_professional_invitation_expiry_check
    CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS organization_professional_invites_org_status_idx
  ON public.organization_professional_invitations (organization_id, status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS organization_professional_invites_one_pending_email_idx
  ON public.organization_professional_invitations (organization_id, invited_email)
  WHERE status = 'pending';

ALTER TABLE public.organization_professional_invitations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.organization_professional_invitations FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_professional_invitation(
  p_email text,
  p_first_name text,
  p_last_name text,
  p_profession text,
  p_specialty text DEFAULT NULL,
  p_license_number text DEFAULT NULL,
  p_country_code text DEFAULT NULL,
  p_phone text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_email text := lower(trim(COALESCE(p_email, '')));
  v_token text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTHENTICATION_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT organization_id INTO v_org_id
  FROM public.user_profiles
  WHERE id = v_user_id
    AND role::text = 'org_admin'
    AND is_active IS TRUE;

  IF v_org_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = v_org_id AND is_active IS TRUE
  ) THEN
    RAISE EXCEPTION 'ACTIVE_ORGANIZATION_ADMIN_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF v_email = '' OR length(v_email) > 254 OR position('@' in v_email) < 2
     OR trim(COALESCE(p_first_name, '')) = ''
     OR trim(COALESCE(p_last_name, '')) = ''
     OR trim(COALESCE(p_profession, '')) = '' THEN
    RAISE EXCEPTION 'INVALID_INVITATION_DETAILS' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.user_profiles p ON p.id = u.id
    WHERE lower(u.email) = v_email
      AND p.role::text = 'professional'
      AND p.organization_id = v_org_id
      AND p.is_active IS TRUE
  ) THEN
    RAISE EXCEPTION 'PROFESSIONAL_ALREADY_IN_ORGANIZATION' USING ERRCODE = '23505';
  END IF;

  UPDATE public.organization_professional_invitations
  SET status = 'revoked'
  WHERE organization_id = v_org_id
    AND invited_email = v_email
    AND status = 'pending';

  v_token := encode(extensions.gen_random_bytes(32), 'hex');

  INSERT INTO public.organization_professional_invitations (
    organization_id, invited_by, invited_email, first_name, last_name,
    profession, specialty, license_number, country_code, phone, token_hash
  ) VALUES (
    v_org_id, v_user_id, v_email,
    left(trim(p_first_name), 100), left(trim(p_last_name), 100),
    left(trim(p_profession), 120), NULLIF(left(trim(COALESCE(p_specialty, '')), 150), ''),
    NULLIF(left(trim(COALESCE(p_license_number, '')), 120), ''),
    NULLIF(left(trim(COALESCE(p_country_code, '')), 2), ''),
    NULLIF(left(trim(COALESCE(p_phone, '')), 40), ''),
    extensions.digest(v_token, 'sha256')
  );

  RETURN v_token;
END;
$function$;

CREATE OR REPLACE FUNCTION public.accept_professional_invitation(p_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_invitation public.organization_professional_invitations%ROWTYPE;
  v_profile_role text;
  v_profile_org_id uuid;
  v_professional_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTHENTICATION_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id = v_user_id;
  IF v_email IS NULL THEN
    RAISE EXCEPTION 'AUTHENTICATED_EMAIL_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_invitation
  FROM public.organization_professional_invitations
  WHERE token_hash = extensions.digest(COALESCE(p_token, ''), 'sha256')
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVITATION_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;

  IF v_invitation.status <> 'pending' OR v_invitation.expires_at <= now() THEN
    IF v_invitation.status = 'pending' AND v_invitation.expires_at <= now() THEN
      UPDATE public.organization_professional_invitations SET status = 'expired'
      WHERE id = v_invitation.id;
    END IF;
    RAISE EXCEPTION 'INVITATION_NOT_ACTIVE' USING ERRCODE = '55000';
  END IF;

  IF v_email <> v_invitation.invited_email THEN
    RAISE EXCEPTION 'INVITATION_EMAIL_MISMATCH' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.organizations
    WHERE id = v_invitation.organization_id AND is_active IS TRUE
  ) THEN
    RAISE EXCEPTION 'ORGANIZATION_NOT_ACTIVE' USING ERRCODE = '55000';
  END IF;

  SELECT role::text, organization_id INTO v_profile_role, v_profile_org_id
  FROM public.user_profiles
  WHERE id = v_user_id AND is_active IS TRUE
  FOR UPDATE;

  IF v_profile_role IS NULL OR v_profile_role NOT IN ('patient', 'guest', 'professional') THEN
    RAISE EXCEPTION 'ACCOUNT_ROLE_NOT_ELIGIBLE' USING ERRCODE = '42501';
  END IF;

  -- A professional may hold memberships in multiple organizations. The
  -- profile's organization_id remains its primary/default organization;
  -- the membership table is the authoritative multi-tenant relationship.
  SELECT id INTO v_professional_id
  FROM public.professionals
  WHERE user_id = v_user_id
  ORDER BY created_at DESC NULLS LAST
  LIMIT 1
  FOR UPDATE;

  IF v_professional_id IS NOT NULL THEN
    -- The professional record is global, while role_title and verification
    -- for this employer belong to the organization membership. Do not let a
    -- second employer's invitation overwrite the professional's global
    -- identity, contact details, license number, or existing verification.
    UPDATE public.professionals
    SET updated_at = now()
    WHERE id = v_professional_id;
  ELSE
    INSERT INTO public.professionals (
      user_id, first_name, last_name, profession, specialty,
      license_number, country_code, phone, email, is_verified, status
    ) VALUES (
      v_user_id, v_invitation.first_name, v_invitation.last_name,
      v_invitation.profession, v_invitation.specialty,
      v_invitation.license_number, v_invitation.country_code,
      v_invitation.phone, v_email, FALSE, 'pending'::public.professional_status
    )
    RETURNING id INTO v_professional_id;
  END IF;

  -- Persist the organization membership used by tenant-scoped clinical RLS.
  UPDATE public.professional_organizations
  SET role_title = v_invitation.profession,
      status = 'pending'::public.professional_status,
      invitation_status = 'accepted'::public.invitation_status,
      invited_by = v_invitation.invited_by,
      invited_at = COALESCE(invited_at, now()),
      joined_at = now()
  WHERE professional_id = v_professional_id
    AND organization_id = v_invitation.organization_id;

  IF NOT FOUND THEN
    INSERT INTO public.professional_organizations (
      professional_id, organization_id, role_title, status,
      invitation_status, invited_by, invited_at, joined_at, is_primary
    ) VALUES (
      v_professional_id, v_invitation.organization_id, v_invitation.profession,
      'pending'::public.professional_status, 'accepted'::public.invitation_status,
      v_invitation.invited_by, now(), now(), FALSE
    );
  END IF;

  UPDATE public.user_profiles
  SET role = 'professional'::public.user_role,
      organization_id = COALESCE(organization_id, v_invitation.organization_id),
      updated_at = now()
  WHERE id = v_user_id;

  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object(
      'role', 'professional',
      'organization_id', COALESCE(v_profile_org_id, v_invitation.organization_id)::text
    )
  WHERE id = v_user_id;

  UPDATE public.organization_professional_invitations
  SET status = 'accepted', accepted_by = v_user_id, accepted_at = now()
  WHERE id = v_invitation.id;

  RETURN v_invitation.organization_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.create_professional_invitation(text,text,text,text,text,text,text,text)
  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_professional_invitation(text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_professional_invitation(text,text,text,text,text,text,text,text)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_professional_invitation(text)
  TO authenticated;
