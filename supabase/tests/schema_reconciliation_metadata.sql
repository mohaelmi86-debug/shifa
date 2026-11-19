-- SHIFA schema reconciliation checks.
-- Metadata only: this file must not read clinical rows or mutate production.
-- Run against a disposable PostgreSQL test database or a reviewed staging clone.
-- The live production database must never be used as a test target.

DO $$
DECLARE
  v_public_tables integer;
  v_rls_tables integer;
  v_notifications boolean;
BEGIN
  SELECT count(*) INTO v_public_tables
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r','p');

  SELECT count(*) INTO v_rls_tables
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
    AND c.relrowsecurity;

  IF v_public_tables = 0 THEN
    RAISE EXCEPTION 'Schema baseline missing: no public tables found';
  END IF;

  IF v_public_tables <> v_rls_tables THEN
    RAISE EXCEPTION 'RLS coverage mismatch: % public tables, % with RLS',
      v_public_tables, v_rls_tables;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND table_type = 'BASE TABLE'
  ) INTO v_notifications;

  IF NOT v_notifications THEN
    RAISE EXCEPTION 'Expected public.notifications baseline table is missing';
  END IF;
END $$;

-- Inventory query: compare this output between a schema snapshot and the
-- target staging database. It intentionally returns metadata only.
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relkind,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r','p','v','m')
ORDER BY c.relname;

-- Security-definer function inventory for manual comparison.
SELECT
  n.nspname AS schema_name,
  p.proname AS function_name,
  pg_get_function_identity_arguments(p.oid) AS arguments,
  p.prosecdef AS security_definer,
  p.proconfig AS function_settings,
  COALESCE(array_to_string(p.proacl, ','), '(default)') AS function_acl
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname IN ('public','private')
ORDER BY n.nspname, p.proname, pg_get_function_identity_arguments(p.oid);

-- Policy inventory. Expressions are included so reviewers can compare exact
-- tenant constraints, command scope, roles and permissive/restrictive mode.
SELECT
  schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Trigger inventory.
SELECT
  event_object_schema, event_object_table, trigger_name,
  event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name, event_manipulation;

-- ACL inventory for application roles. Review unexpected grants individually;
-- do not bulk-revoke as a shortcut because grants may be required by the app.
SELECT
  grantee, table_name, privilege_type, is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon','authenticated','service_role')
ORDER BY table_name, grantee, privilege_type;
