-- Compatibility wrapper for migrations and legacy policies that reference
-- public.is_platform_admin(). The linked Supabase project exposes the hardened
-- implementation in private.is_platform_admin(); isolated migration CI may not.
-- Prefer the private implementation when present and retain the same fail-closed
-- predicate for fresh databases where the legacy private helper is not installed.

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, auth, public, pg_temp
AS $function$
DECLARE
  v_result boolean;
BEGIN
  IF to_regprocedure('private.is_platform_admin()') IS NOT NULL THEN
    EXECUTE 'SELECT private.is_platform_admin()' INTO v_result;
    RETURN COALESCE(v_result, FALSE);
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM auth.users AS au
    WHERE au.id = (SELECT auth.uid())
      AND au.raw_app_meta_data->>'role' = 'platform_admin'
  )
  OR EXISTS (
    SELECT 1
    FROM public.user_profiles AS up
    WHERE up.id = (SELECT auth.uid())
      AND up.role::text = 'platform_admin'
      AND up.is_active IS TRUE
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, service_role;

COMMENT ON FUNCTION public.is_platform_admin() IS
  'Compatibility wrapper: delegates to private.is_platform_admin() when installed; otherwise uses the equivalent trusted app_metadata and active profile predicate.';
