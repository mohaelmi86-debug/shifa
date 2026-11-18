-- ============================================================
-- SHIFA HEALTH OS — Phase 3: Role Assignment Fix
-- Ensures professionals and institutions never receive patient role
-- Adds UPDATE path for existing profiles with wrong role
-- ============================================================

-- ============================================================
-- FIX: handle_new_user() — robust role assignment
-- Reads role from raw_user_meta_data, validates against enum,
-- and UPDATES existing profiles if role was previously wrong.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shifa_id TEXT;
  v_role     public.user_role;
  v_raw_role TEXT;
BEGIN
  -- Generate a unique SHIFA ID
  v_shifa_id := 'SH-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));

  -- Read role from metadata, validate against enum, default to 'patient'
  v_raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');

  -- Validate the role value against allowed enum values
  BEGIN
    v_role := v_raw_role::public.user_role;
  EXCEPTION
    WHEN invalid_text_representation THEN
      v_role := 'patient'::public.user_role;
    WHEN others THEN
      v_role := 'patient'::public.user_role;
  END;

  -- Insert profile, or UPDATE role if profile already exists with wrong role
  -- This handles the case where a previous broken trigger created a 'patient' profile
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role, shifa_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    v_role,
    v_shifa_id
  )
  ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role,
        full_name = CASE
          WHEN public.user_profiles.full_name = '' OR public.user_profiles.full_name IS NULL
          THEN EXCLUDED.full_name
          ELSE public.user_profiles.full_name
        END,
        updated_at = CURRENT_TIMESTAMP
    -- Only update role if the stored role is 'patient' and the new role is more specific
    -- This prevents downgrading an admin to patient if they re-register
    WHERE public.user_profiles.role = 'patient'::public.user_role
      AND EXCLUDED.role != 'patient'::public.user_role;

  RETURN NEW;
END;
$$;

-- Recreate the trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SECURITY: Ensure the trigger function cannot be called by
-- regular users to escalate privileges.
-- Only the trigger itself (SECURITY DEFINER) can call this.
-- ============================================================
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- ============================================================
-- HELPER: Allow users to read their own role without recursion
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role::TEXT FROM public.user_profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- ============================================================
-- COMMENT: Role assignment flow
-- 1. Client calls supabase.auth.signUp({ options: { data: { role: 'professional' } } })
-- 2. Supabase inserts into auth.users with raw_user_meta_data = { role: 'professional', ... }
-- 3. Trigger handle_new_user() fires, reads role from metadata, inserts user_profiles
-- 4. If profile already exists with 'patient' role and new role is more specific, UPDATE
-- 5. AuthContext.fetchRole() reads from user_profiles — gets correct role
-- ============================================================
