-- Secure professional credential submission and establishment review.
-- Documents are stored in a private bucket; clients can only upload into their own user folder.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'professional-credentials',
  'professional-credentials',
  FALSE,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE
SET public = FALSE,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE TABLE IF NOT EXISTS public.professional_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  credential_type text NOT NULL CHECK (credential_type IN ('professional_license', 'professional_registration', 'diploma', 'identity', 'other')),
  document_name text NOT NULL CHECK (length(trim(document_name)) BETWEEN 1 AND 180),
  storage_path text NOT NULL UNIQUE,
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png')),
  file_size integer NOT NULL CHECK (file_size BETWEEN 1 AND 10485760),
  issuing_country text,
  license_number text,
  expires_at date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text CHECK (review_note IS NULL OR length(review_note) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT professional_credentials_storage_path_owner
    CHECK (storage_path LIKE submitted_by::text || '/%')
);

CREATE INDEX IF NOT EXISTS idx_professional_credentials_org_status_created
  ON public.professional_credentials (organization_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_professional_credentials_professional
  ON public.professional_credentials (professional_id, created_at DESC);

-- Tenant-scoped authorization: a manager may only access credentials for a
-- professional's membership in that manager's own active organization.
CREATE OR REPLACE FUNCTION private.org_admin_can_access_professional_in_org(
  p_professional_id uuid,
  p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    JOIN public.organizations org
      ON org.id = up.organization_id
     AND org.is_active IS TRUE
    JOIN public.professional_organizations po
      ON po.organization_id = up.organization_id
     AND po.professional_id = p_professional_id
     AND po.organization_id = p_organization_id
     AND po.invitation_status = 'accepted'::public.invitation_status
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'org_admin'
      AND up.is_active IS TRUE
  );
$function$;

REVOKE ALL ON FUNCTION private.org_admin_can_access_professional_in_org(uuid,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.org_admin_can_access_professional_in_org(uuid,uuid) TO authenticated;

ALTER TABLE public.professional_credentials ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.professional_credentials FROM PUBLIC, anon, authenticated;
GRANT SELECT (
  id, professional_id, organization_id, submitted_by, credential_type,
  document_name, storage_path, mime_type, file_size, issuing_country,
  license_number, expires_at, status, reviewed_at, created_at, updated_at
) ON TABLE public.professional_credentials TO authenticated;

DROP POLICY IF EXISTS professional_credentials_read_scope ON public.professional_credentials;
CREATE POLICY professional_credentials_read_scope
ON public.professional_credentials
FOR SELECT TO authenticated
USING (
  submitted_by = (SELECT auth.uid())
  OR private.org_admin_can_access_professional_in_org(professional_id, organization_id)
  OR public.is_platform_admin()
);

DROP POLICY IF EXISTS professional_credentials_storage_upload ON storage.objects;
CREATE POLICY professional_credentials_storage_upload
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'professional-credentials'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS professional_credentials_storage_read ON storage.objects;
CREATE POLICY professional_credentials_storage_read
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'professional-credentials'
  AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM public.professional_credentials pc
      WHERE pc.storage_path = name
        AND private.org_admin_can_access_professional_in_org(pc.professional_id, pc.organization_id)
    )
    OR public.is_platform_admin()
  )
);

-- The submit page removes an uploaded object if metadata registration fails.
DROP POLICY IF EXISTS professional_credentials_storage_delete ON storage.objects;
CREATE POLICY professional_credentials_storage_delete
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'professional-credentials'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Restrictive guards ensure other permissive Storage policies cannot widen access
-- to this private bucket.
DROP POLICY IF EXISTS professional_credentials_storage_upload_guard ON storage.objects;
CREATE POLICY professional_credentials_storage_upload_guard
ON storage.objects
AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'professional-credentials'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS professional_credentials_storage_delete_guard ON storage.objects;
CREATE POLICY professional_credentials_storage_delete_guard
ON storage.objects
AS RESTRICTIVE
FOR DELETE TO authenticated
USING (
  bucket_id = 'professional-credentials'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS professional_credentials_storage_read_guard ON storage.objects;
CREATE POLICY professional_credentials_storage_read_guard
ON storage.objects
AS RESTRICTIVE
FOR SELECT TO authenticated
USING (
  bucket_id = 'professional-credentials'
  AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM public.professional_credentials pc
      WHERE pc.storage_path = name
        AND private.org_admin_can_access_professional_in_org(pc.professional_id, pc.organization_id)
    )
    OR public.is_platform_admin()
  )
);

-- Return only the authenticated professional's accepted organization memberships.
-- The client uses this list to choose the tenant for each credential submission.
CREATE OR REPLACE FUNCTION public.list_my_professional_credential_organizations()
RETURNS TABLE (
  organization_id uuid,
  organization_name text,
  membership_status text,
  is_primary boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT org.id, org.name::text, po.status::text,
         (profile.organization_id = org.id) AS is_primary
  FROM public.user_profiles profile
  JOIN public.professionals pro ON pro.user_id = profile.id
  JOIN public.professional_organizations po ON po.professional_id = pro.id
  JOIN public.organizations org ON org.id = po.organization_id
  WHERE profile.id = (SELECT auth.uid())
    AND profile.role::text = 'professional'
    AND profile.is_active IS TRUE
    AND po.invitation_status = 'accepted'::public.invitation_status
    AND org.is_active IS TRUE
  ORDER BY (profile.organization_id = org.id) DESC, org.name;
$function$;

REVOKE ALL ON FUNCTION public.list_my_professional_credential_organizations() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_professional_credential_organizations() TO authenticated;

-- Replace the earlier primary-organization-only RPC with an explicit tenant argument.
DROP FUNCTION IF EXISTS public.submit_professional_credential(text,text,text,text,integer,text,text,date);

CREATE OR REPLACE FUNCTION public.submit_professional_credential(
  p_organization_id uuid,
  p_credential_type text,
  p_document_name text,
  p_storage_path text,
  p_mime_type text,
  p_file_size integer,
  p_issuing_country text DEFAULT NULL,
  p_license_number text DEFAULT NULL,
  p_expires_at date DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_professional public.professionals%ROWTYPE;
  v_membership public.professional_organizations%ROWTYPE;
  v_object_size bigint;
  v_object_mime text;
  v_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTHENTICATION_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_credential_type NOT IN ('professional_license', 'professional_registration', 'diploma', 'identity', 'other') THEN
    RAISE EXCEPTION 'INVALID_CREDENTIAL_TYPE' USING ERRCODE = '22023';
  END IF;
  IF p_mime_type NOT IN ('application/pdf', 'image/jpeg', 'image/png')
     OR p_file_size IS NULL OR p_file_size < 1 OR p_file_size > 10485760 THEN
    RAISE EXCEPTION 'INVALID_CREDENTIAL_FILE' USING ERRCODE = '22023';
  END IF;
  IF p_storage_path IS NULL OR (storage.foldername(p_storage_path))[1] <> v_user_id::text THEN
    RAISE EXCEPTION 'INVALID_CREDENTIAL_STORAGE_PATH' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_professional
  FROM public.professionals
  WHERE user_id = v_user_id
  ORDER BY created_at DESC NULLS LAST
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'PROFESSIONAL_PROFILE_REQUIRED' USING ERRCODE = 'P0002';
  END IF;

  -- The tenant is explicitly selected by the professional. Validate the exact
  -- accepted membership; never infer a tenant from profile defaults or timestamps.
  IF p_organization_id IS NULL THEN
    RAISE EXCEPTION 'ORGANIZATION_SELECTION_REQUIRED' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_membership
  FROM public.professional_organizations
  WHERE professional_id = v_professional.id
    AND organization_id = p_organization_id
    AND invitation_status = 'accepted'::public.invitation_status
  LIMIT 1;

  IF NOT FOUND OR v_membership.organization_id IS NULL
     OR NOT EXISTS (
       SELECT 1 FROM public.organizations
       WHERE id = p_organization_id AND is_active IS TRUE
     ) THEN
    RAISE EXCEPTION 'ACTIVE_ORGANIZATION_MEMBERSHIP_REQUIRED' USING ERRCODE = '42501';
  END IF;

  SELECT (metadata->>'size')::bigint, metadata->>'mimetype'
  INTO v_object_size, v_object_mime
  FROM storage.objects
  WHERE bucket_id = 'professional-credentials'
    AND name = p_storage_path
    AND (owner = v_user_id OR owner_id = v_user_id::text);

  IF NOT FOUND OR v_object_size IS NULL OR v_object_size <> p_file_size
     OR v_object_mime IS DISTINCT FROM p_mime_type THEN
    RAISE EXCEPTION 'CREDENTIAL_FILE_NOT_FOUND_OR_METADATA_MISMATCH' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.professional_credentials (
    professional_id, organization_id, submitted_by, credential_type,
    document_name, storage_path, mime_type, file_size, issuing_country,
    license_number, expires_at
  ) VALUES (
    v_professional.id, v_membership.organization_id, v_user_id, p_credential_type,
    left(trim(p_document_name), 180), p_storage_path, p_mime_type, p_file_size,
    nullif(trim(p_issuing_country), ''), nullif(trim(p_license_number), ''), p_expires_at
  )
  RETURNING id INTO v_id;

  INSERT INTO public.audit_logs (organization_id, user_id, action, resource_type, resource_id, details)
  VALUES (
    v_membership.organization_id, v_user_id, 'professional_credential_submitted',
    'professional_credential', v_id,
    jsonb_build_object('credential_type', p_credential_type, 'mime_type', p_mime_type, 'file_size', p_file_size)
  );

  RETURN v_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_professional_credential(uuid,text,text,text,text,integer,text,text,date) TO authenticated;

CREATE OR REPLACE FUNCTION public.review_professional_credential(
  p_credential_id uuid,
  p_decision text,
  p_review_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_credential public.professional_credentials%ROWTYPE;
  v_professional public.professionals%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'AUTHENTICATION_REQUIRED' USING ERRCODE = '42501';
  END IF;
  -- NULL must be rejected explicitly: SQL's NOT IN returns NULL for NULL input.
  IF p_decision IS NULL OR p_decision NOT IN ('approve', 'reject') THEN
    RAISE EXCEPTION 'INVALID_CREDENTIAL_DECISION' USING ERRCODE = '22023';
  END IF;
  IF p_review_note IS NOT NULL AND length(p_review_note) > 2000 THEN
    RAISE EXCEPTION 'REVIEW_NOTE_TOO_LONG' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_credential
  FROM public.professional_credentials
  WHERE id = p_credential_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CREDENTIAL_NOT_FOUND' USING ERRCODE = 'P0002';
  END IF;
  IF NOT private.org_admin_can_access_professional_in_org(v_credential.professional_id, v_credential.organization_id) THEN
    RAISE EXCEPTION 'ORGANIZATION_ADMIN_REQUIRED' USING ERRCODE = '42501';
  END IF;
  IF v_credential.status <> 'pending' THEN
    RAISE EXCEPTION 'CREDENTIAL_ALREADY_REVIEWED' USING ERRCODE = '55000';
  END IF;
  IF p_decision = 'approve' AND v_credential.expires_at IS NOT NULL AND v_credential.expires_at < current_date THEN
    RAISE EXCEPTION 'CREDENTIAL_EXPIRED' USING ERRCODE = '22023';
  END IF;
  IF p_decision = 'reject' AND nullif(trim(p_review_note), '') IS NULL THEN
    RAISE EXCEPTION 'REJECTION_REASON_REQUIRED' USING ERRCODE = '22023';
  END IF;

  UPDATE public.professional_credentials
  SET status = CASE WHEN p_decision = 'approve' THEN 'approved' ELSE 'rejected' END,
      reviewed_by = v_user_id,
      reviewed_at = now(),
      review_note = nullif(trim(p_review_note), ''),
      updated_at = now()
  WHERE id = p_credential_id;

  SELECT * INTO v_professional
  FROM public.professionals
  WHERE id = v_credential.professional_id
  FOR UPDATE;

  IF p_decision = 'approve'
     AND v_credential.credential_type IN ('professional_license', 'professional_registration') THEN
    UPDATE public.professionals
    SET is_verified = TRUE,
        status = 'active'::public.professional_status,
        license_number = COALESCE(v_credential.license_number, license_number),
        updated_at = now()
    WHERE id = v_credential.professional_id;

    UPDATE public.professional_organizations
    SET status = 'active'::public.professional_status
    WHERE professional_id = v_credential.professional_id
      AND organization_id = v_credential.organization_id
      AND invitation_status = 'accepted'::public.invitation_status;
  END IF;

  INSERT INTO public.audit_logs (organization_id, user_id, action, resource_type, resource_id, details)
  VALUES (
    v_credential.organization_id, v_user_id, 'professional_credential_' || p_decision,
    'professional_credential', p_credential_id,
    jsonb_build_object(
      'professional_id', v_credential.professional_id,
      'credential_type', v_credential.credential_type,
      'review_note', nullif(trim(p_review_note), '')
    )
  );

  RETURN v_credential.professional_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.review_professional_credential(uuid,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_professional_credential(uuid,text,text) TO authenticated;

COMMENT ON TABLE public.professional_credentials IS
  'Private professional qualification evidence. Access is limited to the submitting professional and the linked organization administrators.';


COMMENT ON FUNCTION private.org_admin_can_access_professional_in_org(uuid,uuid) IS
  'Organization admins may access professional credentials only for an accepted membership in their own active organization.';
