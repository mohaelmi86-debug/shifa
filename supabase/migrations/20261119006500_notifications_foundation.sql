-- Reproducible baseline for the notification center.
-- The live SHIFA database already contains this table, but its original
-- creation migration is absent from the repository history. IF NOT EXISTS
-- keeps this migration safe for environments where the table already exists.

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  notification_type text NOT NULL DEFAULT 'info'
    CHECK (notification_type IN (
      'info', 'warning', 'error', 'success', 'appointment',
      'message', 'lab_result', 'prescription', 'payment', 'system'
    )),
  title text NOT NULL,
  body text NOT NULL,
  action_url text,
  reference_id uuid,
  reference_type text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  priority text DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON public.notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read
  ON public.notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS ix_fk_f7d5e97cc860
  ON public.notifications (organization_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
      AND policyname = 'notifications_select'
  ) THEN
    CREATE POLICY notifications_select ON public.notifications
      FOR SELECT USING (auth.uid() = user_id OR public.is_platform_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
      AND policyname = 'notifications_insert'
  ) THEN
    CREATE POLICY notifications_insert ON public.notifications
      FOR INSERT WITH CHECK (
        auth.uid() = user_id OR public.is_platform_admin()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
      AND policyname = 'notifications_update'
  ) THEN
    CREATE POLICY notifications_update ON public.notifications
      FOR UPDATE USING (auth.uid() = user_id OR public.is_platform_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
      AND policyname = 'notifications_delete'
  ) THEN
    CREATE POLICY notifications_delete ON public.notifications
      FOR DELETE USING (auth.uid() = user_id OR public.is_platform_admin());
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
REVOKE ALL ON public.notifications FROM anon;
