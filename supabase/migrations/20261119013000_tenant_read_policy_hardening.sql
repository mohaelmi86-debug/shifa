-- SHIFA: remove tenant-wide read policies that bypass scoped SELECT policies.
-- The existing scoped policies are retained; PostgreSQL ORs permissive policies,
-- so an additional USING (true) policy would otherwise defeat tenant isolation.
-- On clean installs, recreate the intended scoped policies if the historical
-- foundation migration did not define them. This keeps fresh CI and deployed
-- schemas aligned without replacing an existing reviewed policy definition.

DROP POLICY IF EXISTS "departments_org_read" ON public.departments;
DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'departments'
      AND policyname = 'departments_select'
  ) THEN
    CREATE POLICY "departments_select" ON public.departments
      FOR SELECT TO authenticated
      USING (private.belongs_to_org(organization_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organization_modules'
      AND policyname = 'organization_modules_select'
  ) THEN
    CREATE POLICY "organization_modules_select" ON public.organization_modules
      FOR SELECT TO authenticated
      USING (private.belongs_to_org(organization_id));
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'departments'
      AND policyname = 'departments_org_read'
  ) THEN
    RAISE EXCEPTION 'Unsafe departments_org_read policy remains';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organization_modules'
      AND policyname = 'org_modules_read'
  ) THEN
    RAISE EXCEPTION 'Unsafe org_modules_read policy remains';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'departments'
      AND policyname = 'departments_select'
      AND qual ILIKE '%belongs_to_org%'
  ) THEN
    RAISE EXCEPTION 'Expected tenant-scoped departments_select policy is missing or unsafe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organization_modules'
      AND policyname = 'organization_modules_select'
      AND qual ILIKE '%belongs_to_org%'
  ) THEN
    RAISE EXCEPTION 'Expected tenant-scoped organization_modules_select policy is missing or unsafe';
  END IF;
END $$;
