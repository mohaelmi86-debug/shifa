-- Enforce exact organization membership when a professional accesses their own clinical rows.
-- Global verification is a qualification gate; it is not a tenant authorization grant.

CREATE OR REPLACE FUNCTION private.owns_professional_record_in_org(
  p_professional_id uuid,
  p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT p_organization_id IS NOT NULL
    AND private.owns_professional_record(p_professional_id)
    AND EXISTS (
      SELECT 1
      FROM public.professional_organizations po
      JOIN public.organizations org ON org.id = po.organization_id
      WHERE po.professional_id = p_professional_id
        AND po.organization_id = p_organization_id
        AND po.invitation_status = 'accepted'::public.invitation_status
        AND po.status::text = 'active'
        AND org.is_active IS TRUE
    );
$function$;

REVOKE ALL ON FUNCTION private.owns_professional_record_in_org(uuid,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.owns_professional_record_in_org(uuid,uuid) TO authenticated;

-- Restrict only direct professional-owner access; patient, org-admin and
-- platform-admin paths remain governed by their existing policies.
DO $scope$
DECLARE
  v_table text[];
  v_tables text[][] := ARRAY[
    ARRAY['appointments', 'professional_id'],
    ARRAY['health_records', 'professional_id'],
    ARRAY['prescriptions', 'prescriber_id']
  ];
BEGIN
  FOREACH v_table SLICE 1 IN ARRAY v_tables LOOP
    IF to_regclass(format('public.%I', v_table[1])) IS NOT NULL
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = v_table[1]
           AND column_name = v_table[2]
       )
       AND EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = v_table[1]
           AND column_name = 'organization_id'
       ) THEN
      EXECUTE format(
        'DROP POLICY IF EXISTS %I ON public.%I',
        v_table[1] || '_professional_org_scope_guard',
        v_table[1]
      );
      EXECUTE format(
        'CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (NOT private.owns_professional_record(%I) OR private.owns_professional_record_in_org(%I, organization_id)) WITH CHECK (NOT private.owns_professional_record(%I) OR private.owns_professional_record_in_org(%I, organization_id))',
        v_table[1] || '_professional_org_scope_guard',
        v_table[1],
        v_table[2],
        v_table[2],
        v_table[2],
        v_table[2]
      );
    END IF;
  END LOOP;
END;
$scope$;

COMMENT ON FUNCTION private.owns_professional_record_in_org(uuid,uuid) IS
  'A verified professional may access their own tenant-scoped clinical row only through an accepted active membership in that exact active organization.';

-- Availability is also tenant-scoped: an old owner-only policy must not let a
-- verified professional write slots for a second organization before joining it.
DROP POLICY IF EXISTS availability_slots_professional_org_scope_guard ON public.availability_slots;
CREATE POLICY availability_slots_professional_org_scope_guard
  ON public.availability_slots
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    NOT private.owns_professional_record(professional_id)
    OR private.owns_professional_record_in_org(professional_id, organization_id)
  )
  WITH CHECK (
    NOT private.owns_professional_record(professional_id)
    OR private.owns_professional_record_in_org(professional_id, organization_id)
  );

-- Transfer notifications must relate to a transfer the sender can access and
-- target a real participant in one of that transfer's organizations (or patient).
CREATE OR REPLACE FUNCTION private.is_transfer_notification_recipient(
  p_transfer_id uuid,
  p_recipient_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT p_recipient_user_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.patient_transfers pt
      JOIN public.user_profiles recipient
        ON recipient.id = p_recipient_user_id
       AND recipient.is_active IS TRUE
      WHERE pt.id = p_transfer_id
        AND (
          EXISTS (
            SELECT 1 FROM public.patients patient
            WHERE patient.id = pt.patient_id
              AND patient.user_id = p_recipient_user_id
          )
          OR (
            recipient.role::text = 'org_admin'
            AND recipient.organization_id IN (
              pt.organization_id, pt.from_organization_id, pt.to_organization_id
            )
          )
          OR EXISTS (
            SELECT 1
            FROM public.professionals pro
            JOIN public.professional_organizations po
              ON po.professional_id = pro.id
            WHERE pro.user_id = p_recipient_user_id
              AND pro.status::text = 'active'
              AND po.status::text = 'active'
              AND po.invitation_status = 'accepted'::public.invitation_status
              AND po.organization_id IN (
                pt.organization_id, pt.from_organization_id, pt.to_organization_id
              )
          )
        )
    );
$function$;

REVOKE ALL ON FUNCTION private.is_transfer_notification_recipient(uuid,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_transfer_notification_recipient(uuid,uuid) TO authenticated;

DROP POLICY IF EXISTS transfer_notifications_insert_scope_guard ON public.transfer_notifications;
CREATE POLICY transfer_notifications_insert_scope_guard
  ON public.transfer_notifications
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    private.is_platform_admin()
    OR (
      private.can_access_transfer(transfer_id)
      AND (
        recipient_user_id = (SELECT auth.uid())
        OR private.is_transfer_notification_recipient(transfer_id, recipient_user_id)
      )
    )
  );

COMMENT ON FUNCTION private.is_transfer_notification_recipient(uuid,uuid) IS
  'Checks that a transfer notification recipient is the patient or an active participant of the transfer source/destination organization.';

-- Membership must be both active and explicitly accepted. A pending invitation
-- is not an authorization grant even if a stale status value says "active".
CREATE OR REPLACE FUNCTION private.belongs_to_org(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT CASE
    WHEN target_org_id IS NULL THEN FALSE
    WHEN private.is_platform_admin() THEN TRUE
    ELSE EXISTS (
      SELECT 1
      FROM public.user_profiles up
      WHERE up.id = (SELECT auth.uid())
        AND up.organization_id = target_org_id
        AND up.is_active IS TRUE
        AND up.role::text = 'org_admin'
    )
    OR EXISTS (
      SELECT 1
      FROM public.professionals pro
      JOIN public.user_profiles up
        ON up.id = pro.user_id
       AND up.is_active IS TRUE
       AND up.role::text = 'professional'
      JOIN public.professional_organizations po
        ON po.professional_id = pro.id
      JOIN public.organizations org
        ON org.id = po.organization_id
       AND org.is_active IS TRUE
      WHERE pro.user_id = (SELECT auth.uid())
        AND private.is_verified_active_professional()
        AND po.organization_id = target_org_id
        AND po.status::text = 'active'
        AND po.invitation_status = 'accepted'::public.invitation_status
    )
  END;
$function$;

CREATE OR REPLACE FUNCTION private.professional_has_patient_consultation(p_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.professionals pro
    JOIN public.user_profiles up
      ON up.id = pro.user_id
     AND up.is_active IS TRUE
     AND up.role::text = 'professional'
    JOIN public.professional_organizations po
      ON po.professional_id = pro.id
    JOIN public.organizations org
      ON org.id = po.organization_id
     AND org.is_active IS TRUE
    JOIN public.consultations c
      ON c.professional_id = pro.id
     AND c.organization_id = po.organization_id
    WHERE pro.user_id = (SELECT auth.uid())
      AND private.is_verified_active_professional()
      AND po.status::text = 'active'
      AND po.invitation_status = 'accepted'::public.invitation_status
      AND c.patient_id = p_patient_id
  );
$function$;

COMMENT ON FUNCTION private.belongs_to_org(uuid) IS
  'Organization membership requires an active org admin or a verified active professional with an explicitly accepted active membership in the exact active organization.';
COMMENT ON FUNCTION private.professional_has_patient_consultation(uuid) IS
  'Patient consultation visibility requires verified active professional status and accepted active membership in the consultation organization.';
