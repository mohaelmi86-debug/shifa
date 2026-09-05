-- ============================================================
-- SHIFA HEALTH — P0 SECURITY HARDENING
-- Corrective RLS migration for kiosk_checkins,
-- shifa_access_verifications, and shifa_ids
-- ADDITIVE ONLY — no DROP TABLE, no DROP COLUMN
-- ============================================================

-- ============================================================
-- STEP 1: ADD MISSING COLUMNS FIRST (before policies reference them)
-- ============================================================

-- Add patient_user_id to kiosk_checkins if missing (for patient self-read)
ALTER TABLE public.kiosk_checkins
ADD COLUMN IF NOT EXISTS patient_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Add organization_id column to shifa_ids if missing
-- (needed for org-scoped access)
ALTER TABLE public.shifa_ids
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- ============================================================
-- STEP 2: HELPER FUNCTIONS (created before policies that reference them)
-- ============================================================

-- Check if current user is a platform admin (via auth metadata — no recursion)
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
      AND (
        au.raw_user_meta_data->>'role' = 'platform_admin'
        OR au.raw_app_meta_data->>'role' = 'platform_admin'
      )
  )
$$;

-- Check if current user is an org_admin for a given organization
CREATE OR REPLACE FUNCTION public.is_org_admin_for(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'org_admin'
      AND up.organization_id = target_org_id
  )
$$;

-- Get the organization_id of the current user (non-recursive helper)
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT organization_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1
$$;

-- Get the role of the current user (non-recursive helper)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role::TEXT FROM public.user_profiles WHERE id = auth.uid() LIMIT 1
$$;

-- ============================================================
-- STEP 3: P0.3 — kiosk_checkins RLS
-- DENY BY DEFAULT — restrict to organization + role
-- ============================================================

-- Drop all existing permissive policies
DROP POLICY IF EXISTS "kiosk_checkins_insert" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "kiosk_checkins_select" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "kiosk_checkins_update" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "kiosk_checkins_delete" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "kiosk_checkins_all" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "kiosk_checkins_open" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "authenticated_insert_kiosk_checkins" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "authenticated_select_kiosk_checkins" ON public.kiosk_checkins;
DROP POLICY IF EXISTS "authenticated_update_kiosk_checkins" ON public.kiosk_checkins;

-- Ensure RLS is enabled
ALTER TABLE public.kiosk_checkins ENABLE ROW LEVEL SECURITY;

-- SELECT: org_admin/professional of same org, platform_admin, or the patient themselves
DROP POLICY IF EXISTS "p0_kiosk_checkins_select" ON public.kiosk_checkins;
CREATE POLICY "p0_kiosk_checkins_select"
ON public.kiosk_checkins
FOR SELECT
TO authenticated
USING (
  public.is_platform_admin()
  OR (
    public.current_user_role() IN ('org_admin', 'professional')
    AND organization_id = public.current_user_org_id()
  )
  OR patient_user_id = auth.uid()
);

-- INSERT: only org_admin/professional of the same org, or platform_admin
DROP POLICY IF EXISTS "p0_kiosk_checkins_insert" ON public.kiosk_checkins;
CREATE POLICY "p0_kiosk_checkins_insert"
ON public.kiosk_checkins
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_platform_admin()
  OR (
    public.current_user_role() IN ('org_admin', 'professional')
    AND organization_id = public.current_user_org_id()
  )
);

-- UPDATE: only org_admin of same org, or platform_admin
DROP POLICY IF EXISTS "p0_kiosk_checkins_update" ON public.kiosk_checkins;
CREATE POLICY "p0_kiosk_checkins_update"
ON public.kiosk_checkins
FOR UPDATE
TO authenticated
USING (
  public.is_platform_admin()
  OR (
    public.current_user_role() = 'org_admin'
    AND organization_id = public.current_user_org_id()
  )
)
WITH CHECK (
  public.is_platform_admin()
  OR (
    public.current_user_role() = 'org_admin'
    AND organization_id = public.current_user_org_id()
  )
);

-- DELETE: only platform_admin (audit data — highly restricted)
DROP POLICY IF EXISTS "p0_kiosk_checkins_delete" ON public.kiosk_checkins;
CREATE POLICY "p0_kiosk_checkins_delete"
ON public.kiosk_checkins
FOR DELETE
TO authenticated
USING (public.is_platform_admin());

-- ============================================================
-- STEP 4: P0.4 — shifa_access_verifications RLS
-- Treat as security/audit data — DENY BY DEFAULT
-- Column names: verified_by (operator), patient_id (patient FK to patients table),
--               organization_id (org FK)
-- ============================================================

DROP POLICY IF EXISTS "shifa_access_verifications_all" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "shifa_access_verifications_select" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "shifa_access_verifications_insert" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "shifa_access_verifications_update" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "shifa_access_verifications_delete" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "shifa_access_verifications_open" ON public.shifa_access_verifications;
DROP POLICY IF EXISTS "authenticated_manage_shifa_access" ON public.shifa_access_verifications;

ALTER TABLE public.shifa_access_verifications ENABLE ROW LEVEL SECURITY;

-- SELECT: operator (verified_by) sees their own verifications,
--         org_admin sees verifications within their org, platform_admin sees all
--         patients can see verifications of their own record via patient_id join
DROP POLICY IF EXISTS "p0_shifa_access_verifications_select" ON public.shifa_access_verifications;
CREATE POLICY "p0_shifa_access_verifications_select"
ON public.shifa_access_verifications
FOR SELECT
TO authenticated
USING (
  public.is_platform_admin()
  OR verified_by = auth.uid()
  OR (
    public.current_user_role() = 'org_admin'
    AND organization_id = public.current_user_org_id()
  )
  OR EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = patient_id
      AND p.user_id = auth.uid()
  )
);

-- INSERT: authenticated professionals/org_admins within their org
DROP POLICY IF EXISTS "p0_shifa_access_verifications_insert" ON public.shifa_access_verifications;
CREATE POLICY "p0_shifa_access_verifications_insert"
ON public.shifa_access_verifications
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_platform_admin()
  OR (
    verified_by = auth.uid()
    AND public.current_user_role() IN ('professional', 'org_admin')
    AND organization_id = public.current_user_org_id()
  )
);

-- UPDATE: FORBIDDEN for all except platform_admin (audit data must be immutable)
DROP POLICY IF EXISTS "p0_shifa_access_verifications_update" ON public.shifa_access_verifications;
CREATE POLICY "p0_shifa_access_verifications_update"
ON public.shifa_access_verifications
FOR UPDATE
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

-- DELETE: FORBIDDEN for all except platform_admin
DROP POLICY IF EXISTS "p0_shifa_access_verifications_delete" ON public.shifa_access_verifications;
CREATE POLICY "p0_shifa_access_verifications_delete"
ON public.shifa_access_verifications
FOR DELETE
TO authenticated
USING (public.is_platform_admin());

-- ============================================================
-- STEP 5: P0.5 — shifa_ids RLS
-- Restrict SELECT USING(true) — patients own their SHIFA ID
-- ============================================================

DROP POLICY IF EXISTS "shifa_ids_all" ON public.shifa_ids;
DROP POLICY IF EXISTS "shifa_ids_select" ON public.shifa_ids;
DROP POLICY IF EXISTS "shifa_ids_insert" ON public.shifa_ids;
DROP POLICY IF EXISTS "shifa_ids_update" ON public.shifa_ids;
DROP POLICY IF EXISTS "shifa_ids_delete" ON public.shifa_ids;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.shifa_ids;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.shifa_ids;
DROP POLICY IF EXISTS "shifa_ids_open" ON public.shifa_ids;
DROP POLICY IF EXISTS "authenticated_select_shifa_ids" ON public.shifa_ids;
DROP POLICY IF EXISTS "authenticated_insert_shifa_ids" ON public.shifa_ids;
DROP POLICY IF EXISTS "authenticated_update_shifa_ids" ON public.shifa_ids;

ALTER TABLE public.shifa_ids ENABLE ROW LEVEL SECURITY;

-- SELECT: owner, authorized professional (same org), org_admin (same org), platform_admin
DROP POLICY IF EXISTS "p0_shifa_ids_select" ON public.shifa_ids;
CREATE POLICY "p0_shifa_ids_select"
ON public.shifa_ids
FOR SELECT
TO authenticated
USING (
  public.is_platform_admin()
  OR user_id = auth.uid()
  OR (
    public.current_user_role() IN ('professional', 'org_admin')
    AND organization_id = public.current_user_org_id()
  )
);

-- INSERT: patient creates their own, or org_admin/professional within org
DROP POLICY IF EXISTS "p0_shifa_ids_insert" ON public.shifa_ids;
CREATE POLICY "p0_shifa_ids_insert"
ON public.shifa_ids
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_platform_admin()
  OR user_id = auth.uid()
  OR (
    public.current_user_role() IN ('professional', 'org_admin')
    AND organization_id = public.current_user_org_id()
  )
);

-- UPDATE: owner or platform_admin only
DROP POLICY IF EXISTS "p0_shifa_ids_update" ON public.shifa_ids;
CREATE POLICY "p0_shifa_ids_update"
ON public.shifa_ids
FOR UPDATE
TO authenticated
USING (
  public.is_platform_admin()
  OR user_id = auth.uid()
)
WITH CHECK (
  public.is_platform_admin()
  OR user_id = auth.uid()
);

-- DELETE: platform_admin only
DROP POLICY IF EXISTS "p0_shifa_ids_delete" ON public.shifa_ids;
CREATE POLICY "p0_shifa_ids_delete"
ON public.shifa_ids
FOR DELETE
TO authenticated
USING (public.is_platform_admin());

-- ============================================================
-- STEP 6: Indexes for performance on RLS filter columns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_kiosk_checkins_org_id ON public.kiosk_checkins(organization_id);
CREATE INDEX IF NOT EXISTS idx_kiosk_checkins_patient_user_id ON public.kiosk_checkins(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_shifa_access_verifications_verified_by ON public.shifa_access_verifications(verified_by);
CREATE INDEX IF NOT EXISTS idx_shifa_access_verifications_org ON public.shifa_access_verifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_shifa_ids_user_id ON public.shifa_ids(user_id);
CREATE INDEX IF NOT EXISTS idx_shifa_ids_org_id ON public.shifa_ids(organization_id);
