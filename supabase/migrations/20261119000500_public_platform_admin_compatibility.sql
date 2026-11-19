-- Compatibility wrapper for migrations and legacy policies that reference
-- public.is_platform_admin(). The live SHIFA project exposes the hardened
-- implementation in private.is_platform_admin() only.
-- Keep authorization logic centralized in the existing private function.

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, private, auth, public, pg_temp
AS $function$
  SELECT private.is_platform_admin();
$function$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, service_role;

COMMENT ON FUNCTION public.is_platform_admin() IS
  'Compatibility wrapper delegating to private.is_platform_admin(); does not implement a separate authorization rule.';
