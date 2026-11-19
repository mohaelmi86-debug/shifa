-- Tighten notification policies against cross-tenant notification injection.
-- Existing live policy allowed any org admin to insert notifications for any
-- user. Notification creation for other users must go through trusted server
-- workflows (service_role); authenticated clients may create only their own.
-- This migration is additive and must be tested on staging before production.

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_select ON public.notifications;
DROP POLICY IF EXISTS notifications_insert ON public.notifications;
DROP POLICY IF EXISTS notifications_update ON public.notifications;
DROP POLICY IF EXISTS notifications_delete ON public.notifications;

CREATE POLICY notifications_select
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.is_platform_admin()
  );

CREATE POLICY notifications_insert
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR private.is_platform_admin()
  );

CREATE POLICY notifications_update
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.is_platform_admin()
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR private.is_platform_admin()
  );

CREATE POLICY notifications_delete
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR private.is_platform_admin()
  );

REVOKE ALL ON public.notifications FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

COMMENT ON POLICY notifications_insert ON public.notifications IS
  'Authenticated users may insert only notifications addressed to themselves. Cross-user notifications must use a trusted server-side workflow.';
