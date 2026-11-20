-- Notification authorization regression tests.
-- Run only in the disposable PostgreSQL CI database after all migrations.

DO $$
DECLARE
  v_policy record;
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'notifications'
    AND policyname IN (
      'notifications_select','notifications_insert',
      'notifications_update','notifications_delete'
    )
    AND roles = ARRAY['authenticated']::name[];

  IF v_count <> 4 THEN
    RAISE EXCEPTION 'Expected four notifications policies scoped to authenticated; found %', v_count;
  END IF;

  SELECT * INTO v_policy
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'notifications'
    AND policyname = 'notifications_insert';

  IF v_policy.with_check IS NULL
     OR position('auth.uid' in v_policy.with_check) = 0
     OR position('is_platform_admin' in v_policy.with_check) = 0
     OR position('is_org_admin' in v_policy.with_check) > 0 THEN
    RAISE EXCEPTION 'Notification INSERT policy is not restricted to self/platform workflow';
  END IF;

  IF has_table_privilege('anon', 'public.notifications', 'SELECT')
     OR has_table_privilege('anon', 'public.notifications', 'INSERT')
     OR has_table_privilege('anon', 'public.notifications', 'UPDATE')
     OR has_table_privilege('anon', 'public.notifications', 'DELETE') THEN
    RAISE EXCEPTION 'anon retains direct privileges on notifications';
  END IF;

  IF NOT has_table_privilege('authenticated', 'public.notifications', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.notifications', 'INSERT') THEN
    RAISE EXCEPTION 'authenticated is missing required notification table privileges';
  END IF;
END
$$;
