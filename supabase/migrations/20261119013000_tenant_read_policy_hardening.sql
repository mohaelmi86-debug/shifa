-- SHIFA: remove tenant-wide read policies that bypass scoped SELECT policies.
-- The existing scoped policies are retained; PostgreSQL ORs permissive policies,
-- so an additional USING (true) policy would otherwise defeat tenant isolation.
-- Ordered after the currently deployed migration ledger; additive and idempotent.

DROP POLICY IF EXISTS "departments_org_read" ON public.departments;
DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;

DO $$
BEGIN
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
  ) THEN
    RAISE EXCEPTION 'Expected tenant-scoped departments_select policy is missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organization_modules'
      AND policyname = 'organization_modules_select'
  ) THEN
    RAISE EXCEPTION 'Expected tenant-scoped organization_modules_select policy is missing';
  END IF;
END $$;
