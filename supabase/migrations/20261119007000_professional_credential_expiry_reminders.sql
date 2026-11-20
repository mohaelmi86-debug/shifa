-- In-app reminders for approved professional credentials nearing expiry.
-- This queues notifications in the existing public.notifications table only.
-- No email/SMS/push is sent. Invoke from a trusted server scheduler.

CREATE UNIQUE INDEX IF NOT EXISTS uq_notifications_user_dedupe_key
  ON public.notifications (user_id, (metadata ->> 'dedupe_key'))
  WHERE metadata ? 'dedupe_key';

CREATE OR REPLACE FUNCTION public.queue_professional_credential_expiry_reminders()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_inserted_count integer := 0;
  v_admin_inserted_count integer := 0;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    organization_id,
    notification_type,
    title,
    body,
    action_url,
    reference_id,
    reference_type,
    priority,
    metadata
  )
  SELECT
    pro.user_id,
    po.organization_id,
    'credential_expiry',
    CASE reminder.days_remaining
      WHEN 7 THEN 'Votre justificatif professionnel expire dans 7 jours'
      WHEN 15 THEN 'Votre justificatif professionnel expire dans 15 jours'
      ELSE 'Votre justificatif professionnel expire dans 30 jours'
    END,
    format(
      'Un justificatif professionnel approuvé arrive à expiration le %s. Déposez son renouvellement pour éviter une interruption de votre accès professionnel.',
      to_char(pc.expires_at::date, 'DD/MM/YYYY')
    ),
    '/professional-verification',
    pc.id,
    'professional_credential',
    CASE WHEN reminder.days_remaining = 7 THEN 'high' ELSE 'normal' END,
    jsonb_build_object(
      'dedupe_key',
      format('credential-expiry:%s:%s:%s', pc.id, pc.expires_at::date, reminder.days_remaining),
      'credential_type', pc.credential_type,
      'expires_on', pc.expires_at::date,
      'days_remaining', reminder.days_remaining,
      'channel', 'in_app'
    )
  FROM public.professional_credentials pc
  JOIN public.professionals pro
    ON pro.id = pc.professional_id
  JOIN public.professional_organizations po
    ON po.professional_id = pc.professional_id
   AND po.organization_id = pc.organization_id
  CROSS JOIN unnest(ARRAY[30, 15, 7]) AS reminder(days_remaining)
  WHERE pro.user_id IS NOT NULL
    AND pro.status = 'active'::public.professional_status
    AND pro.is_verified IS TRUE
    AND po.status = 'active'::public.professional_status
    AND po.invitation_status = 'accepted'::public.invitation_status
    AND pc.status = 'approved'
    AND pc.credential_type IN ('professional_license', 'professional_registration')
    AND pc.expires_at IS NOT NULL
    AND pc.expires_at::date - current_date = reminder.days_remaining
  ON CONFLICT (user_id, (metadata ->> 'dedupe_key'))
    WHERE metadata ? 'dedupe_key'
    DO NOTHING;

  GET DIAGNOSTICS v_inserted_count = ROW_COUNT;

  -- Notify active administrators of the same organization. The recipient
  -- is resolved from the organization's own user_profiles scope, never from
  -- client-supplied metadata or a global administrator list.
  INSERT INTO public.notifications (
    user_id,
    organization_id,
    notification_type,
    title,
    body,
    action_url,
    reference_id,
    reference_type,
    priority,
    metadata
  )
  SELECT
    admin_profile.id,
    po.organization_id,
    'credential_expiry',
    CASE reminder.days_remaining
      WHEN 7 THEN 'Un justificatif professionnel expire dans 7 jours'
      WHEN 15 THEN 'Un justificatif professionnel expire dans 15 jours'
      ELSE 'Un justificatif professionnel expire dans 30 jours'
    END,
    format(
      'Le justificatif %s de l’un des professionnels de votre établissement expire le %s. Vérifiez le renouvellement avant cette échéance.',
      CASE pc.credential_type
        WHEN 'professional_license' THEN 'de licence'
        ELSE 'd’inscription professionnelle'
      END,
      to_char(pc.expires_at::date, 'DD/MM/YYYY')
    ),
    '/admin-professionnels',
    pc.id,
    'professional_credential',
    CASE WHEN reminder.days_remaining = 7 THEN 'high' ELSE 'normal' END,
    jsonb_build_object(
      'dedupe_key',
      format('org-credential-expiry:%s:%s:%s:%s', pc.id, pc.expires_at::date, reminder.days_remaining, admin_profile.id),
      'credential_type', pc.credential_type,
      'expires_on', pc.expires_at::date,
      'days_remaining', reminder.days_remaining,
      'channel', 'in_app',
      'recipient_role', 'org_admin'
    )
  FROM public.professional_credentials pc
  JOIN public.professionals pro
    ON pro.id = pc.professional_id
  JOIN public.professional_organizations po
    ON po.professional_id = pc.professional_id
   AND po.organization_id = pc.organization_id
  JOIN public.user_profiles admin_profile
    ON admin_profile.organization_id = po.organization_id
   AND admin_profile.role::text = 'org_admin'
   AND admin_profile.is_active IS TRUE
  CROSS JOIN unnest(ARRAY[30, 15, 7]) AS reminder(days_remaining)
  WHERE pro.user_id IS NOT NULL
    AND pro.status = 'active'::public.professional_status
    AND pro.is_verified IS TRUE
    AND po.status = 'active'::public.professional_status
    AND po.invitation_status = 'accepted'::public.invitation_status
    AND pc.status = 'approved'
    AND pc.credential_type IN ('professional_license', 'professional_registration')
    AND pc.expires_at IS NOT NULL
    AND pc.expires_at::date - current_date = reminder.days_remaining
  ON CONFLICT (user_id, (metadata ->> 'dedupe_key'))
    WHERE metadata ? 'dedupe_key'
    DO NOTHING;

  GET DIAGNOSTICS v_admin_inserted_count = ROW_COUNT;
  v_inserted_count := v_inserted_count + v_admin_inserted_count;
  RETURN v_inserted_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.queue_professional_credential_expiry_reminders() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.queue_professional_credential_expiry_reminders() TO service_role;

COMMENT ON FUNCTION public.queue_professional_credential_expiry_reminders() IS
  'Queues idempotent in-app notifications 30, 15 and 7 days before expiry of an approved professional license or registration. Service-role only; requires a trusted scheduler. Does not send email, SMS or push notifications.';
