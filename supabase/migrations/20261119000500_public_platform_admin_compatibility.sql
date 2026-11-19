-- Compatibility implementation for migrations and legacy policies that reference
-- public.is_platform_admin(). The linked production project has the same trusted
-- predicate in private.is_platform_admin(); isolated CI may expose a legacy
-- private wrapper that delegates back to public. Keep this function independent
-- to avoid recursive helper calls and preserve the established authorization rule.

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, auth, public, pg_temp
AS $function$
  SELECT EXISTS (
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
$function$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, service_role;

COMMENT ON FUNCTION public.is_platform_admin() IS
  'Compatibility implementation using trusted app_metadata or an active platform_admin profile; independent from private helper wrappers to avoid recursion.';
