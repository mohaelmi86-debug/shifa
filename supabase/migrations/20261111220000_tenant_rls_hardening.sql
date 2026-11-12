-- SHIFA: scope organization administrator access to the organization they own.
-- The current schema has no organization-membership table for org admins;
-- created_by is therefore the only safe tenant ownership relation available.
CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'platform_admin'
  ) OR EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = p_org_id AND o.created_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'org_admin'
      )
  );
$$;

-- Remove cross-tenant reads from organization-scoped tables.
DROP POLICY IF EXISTS "departments_org_read" ON public.departments;
CREATE POLICY "departments_org_read" ON public.departments
FOR SELECT TO authenticated
USING (
  public.is_org_admin(organization_id)
  OR EXISTS (
    SELECT 1 FROM public.professional_organizations po
    JOIN public.professionals pr ON pr.id = po.professional_id
    WHERE po.organization_id = departments.organization_id
      AND pr.user_id = auth.uid()
      AND po.status = 'active'
  )
);

DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;
CREATE POLICY "org_modules_read" ON public.organization_modules
FOR SELECT TO authenticated
USING (public.is_org_admin(organization_id));

DROP POLICY IF EXISTS "org_roles_read" ON public.org_roles;
CREATE POLICY "org_roles_read" ON public.org_roles
FOR SELECT TO authenticated
USING (public.is_org_admin(organization_id));
