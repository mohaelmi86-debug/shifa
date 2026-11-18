-- SHIFA: remove two overly permissive tenant read policies.
-- The live schema already has scoped SELECT policies:
--   departments_select         -> private.belongs_to_org(...) OR private.is_platform_admin()
--   organization_modules_select -> private.belongs_to_org(...) OR private.is_platform_admin()
--   org_roles_select           -> private.belongs_to_org(...) OR private.is_platform_admin()
-- The additional *_org_read policies were USING (true), so PostgreSQL's
-- permissive-policy OR semantics made the scoped policies ineffective.
-- Drop the broad policies; retain the existing tenant-scoped policies.

DROP POLICY IF EXISTS "departments_org_read" ON public.departments;
DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;

-- No org_roles_read policy exists in the inspected live schema. Keep this
-- defensive drop so the migration also cleans up a partially applied branch.
DROP POLICY IF EXISTS "org_roles_read" ON public.org_roles;
