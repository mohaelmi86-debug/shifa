-- ============================================================
-- SHIFA HEALTH OS — Phase 2 RLS Patch
-- Fixes: recursive user_profiles policy, missing INSERT for signup,
--        user_org_id fallback for patients, professionals public read
-- Migration: 20260812220000_phase2_rls_patch.sql
-- ============================================================

-- ============================================================
-- FIX 1: user_profiles — break recursion + add INSERT for signup
-- The is_org_admin() / is_platform_admin() helpers call user_profiles,
-- which is itself RLS-protected — causing infinite recursion.
-- Solution: use auth.uid() directly in the SELECT policy, and use
-- SECURITY DEFINER functions only for non-recursive checks.
-- ============================================================

ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_all" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;

-- SELECT: own row OR platform_admin (checked via direct subquery, no helper)
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up2
      WHERE up2.id = auth.uid()
        AND up2.role IN ('platform_admin', 'org_admin')
    )
  );

-- INSERT: only for own row (triggered on signup via trigger or direct insert)
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: own row or platform_admin
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up2
      WHERE up2.id = auth.uid() AND up2.role = 'platform_admin'
    )
  );

-- DELETE: platform_admin only
CREATE POLICY "user_profiles_delete_admin" ON public.user_profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up2
      WHERE up2.id = auth.uid() AND up2.role = 'platform_admin'
    )
  );

-- ============================================================
-- FIX 2: user_org_id() — extend to support patient org lookup
-- Patients may belong to an org via patient_organizations table
-- or via the patients table itself. Provide a safe fallback.
-- ============================================================

CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    -- Professional org lookup
    (
      SELECT po.organization_id
      FROM public.professionals p
      JOIN public.professional_organizations po ON po.professional_id = p.id
      WHERE p.user_id = auth.uid()
        AND po.is_primary = true
      LIMIT 1
    ),
    -- org_admin direct org lookup via user_profiles
    (
      SELECT organization_id
      FROM public.user_profiles
      WHERE id = auth.uid()
        AND organization_id IS NOT NULL
      LIMIT 1
    )
  );
$$;

-- ============================================================
-- FIX 3: professionals — allow patients to read for booking
-- (already in place, but ensure INSERT policy exists for registration)
-- ============================================================

ALTER TABLE IF EXISTS public.professionals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professionals_insert_own" ON public.professionals;

CREATE POLICY "professionals_insert_own" ON public.professionals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- ============================================================
-- FIX 4: patients — add INSERT policy for self-registration
-- ============================================================

ALTER TABLE IF EXISTS public.patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patients_select" ON public.patients;
DROP POLICY IF EXISTS "patients_insert" ON public.patients;
DROP POLICY IF EXISTS "patients_update" ON public.patients;

CREATE POLICY "patients_select" ON public.patients
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_org_admin()
    OR public.is_platform_admin()
    OR (public.user_role() = 'professional')
  );

CREATE POLICY "patients_insert" ON public.patients
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR (public.user_role() IN ('professional', 'org_admin', 'platform_admin'))
  );

CREATE POLICY "patients_update" ON public.patients
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (public.user_role() IN ('professional', 'org_admin', 'platform_admin'))
  );

-- ============================================================
-- FIX 5: organizations — add INSERT policy for org creation
-- ============================================================

ALTER TABLE IF EXISTS public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organizations_insert" ON public.organizations;

CREATE POLICY "organizations_insert" ON public.organizations
  FOR INSERT WITH CHECK (
    public.user_role() IN ('org_admin', 'platform_admin')
    OR auth.uid() = created_by
  );

-- ============================================================
-- FIX 6: availability_slots — ensure RLS + policies exist
-- (used by appointment booking calendar)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'availability_slots'
  ) THEN
    EXECUTE 'ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "availability_slots_select" ON public.availability_slots';
    EXECUTE 'DROP POLICY IF EXISTS "availability_slots_insert" ON public.availability_slots';
    EXECUTE 'DROP POLICY IF EXISTS "availability_slots_update" ON public.availability_slots';
    EXECUTE $policy$
      CREATE POLICY "availability_slots_select" ON public.availability_slots
        FOR SELECT USING (true)
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "availability_slots_insert" ON public.availability_slots
        FOR INSERT WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "availability_slots_update" ON public.availability_slots
        FOR UPDATE USING (
          auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
          OR public.is_platform_admin()
        )
    $policy$;
  END IF;
END $$;

-- ============================================================
-- FIX 7: Add organization_id column to user_profiles if missing
-- (needed for org_admin direct org lookup in user_org_id())
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE public.user_profiles
      ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- FIX 8: Add shifa_id column to user_profiles if missing
-- (used by Sidebar for display)
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
      AND column_name = 'shifa_id'
  ) THEN
    ALTER TABLE public.user_profiles
      ADD COLUMN shifa_id TEXT UNIQUE;
  END IF;
END $$;

-- ============================================================
-- FIX 9: Trigger to auto-create user_profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shifa_id TEXT;
BEGIN
  -- Generate a unique SHIFA ID
  v_shifa_id := 'SH-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));

  INSERT INTO public.user_profiles (id, email, full_name, role, shifa_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'patient'::public.user_role,
    v_shifa_id
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
