-- ============================================================
-- SHIFA HEALTH OS — RLS All Modules (20 modules)
-- Role-scoped data access at database layer
-- lab_technician → lab data only
-- finance → billing only
-- ambassador → zero medical data
-- Migration: 20260812200000_rls_all_modules.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS (idempotent)
-- ============================================================

CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role::TEXT = required_role
  );
$$;

CREATE OR REPLACE FUNCTION public.user_role_in(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role::TEXT = ANY(roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_lab_technician()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.user_role_in(ARRAY['lab_technician', 'lab_manager', 'org_admin', 'platform_admin']);
$$;

CREATE OR REPLACE FUNCTION public.is_finance_role()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.user_role_in(ARRAY['finance', 'accountant', 'billing_manager', 'org_admin', 'platform_admin']);
$$;

CREATE OR REPLACE FUNCTION public.is_ambassador()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.user_has_role('ambassador');
$$;

CREATE OR REPLACE FUNCTION public.is_clinical_role()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.user_role_in(ARRAY['professional', 'doctor', 'nurse', 'pharmacist', 'org_admin', 'platform_admin']);
$$;

CREATE OR REPLACE FUNCTION public.is_research_role()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.user_role_in(ARRAY['researcher', 'research_manager', 'org_admin', 'platform_admin']);
$$;

-- ============================================================
-- MODULE 1: PATIENT TRANSFERS
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_transfers') THEN
    EXECUTE 'ALTER TABLE public.patient_transfers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "transfers_select" ON public.patient_transfers';
    EXECUTE 'DROP POLICY IF EXISTS "transfers_insert" ON public.patient_transfers';
    EXECUTE 'DROP POLICY IF EXISTS "transfers_update" ON public.patient_transfers';
    EXECUTE $p$
      CREATE POLICY "transfers_select" ON public.patient_transfers FOR SELECT USING (
        public.is_clinical_role()
        OR public.is_platform_admin()
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "transfers_insert" ON public.patient_transfers FOR INSERT WITH CHECK (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "transfers_update" ON public.patient_transfers FOR UPDATE USING (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 2: LAB RESULTS / LAB DASHBOARD
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_results') THEN
    EXECUTE 'ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_select" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_insert" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_update" ON public.lab_results';
    -- Lab technicians see all lab data; ambassadors blocked
    EXECUTE $p$
      CREATE POLICY "lab_results_rls_select" ON public.lab_results FOR SELECT USING (
        public.is_lab_technician()
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        OR (public.is_clinical_role() AND public.belongs_to_org(organization_id))
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "lab_results_rls_insert" ON public.lab_results FOR INSERT WITH CHECK (
        public.is_lab_technician() AND NOT public.is_ambassador()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "lab_results_rls_update" ON public.lab_results FOR UPDATE USING (
        public.is_lab_technician() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 3: LAB SAMPLES / SAMPLE TRANSFER
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_samples') THEN
    EXECUTE 'ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "lab_samples_select" ON public.lab_samples';
    EXECUTE 'DROP POLICY IF EXISTS "lab_samples_insert" ON public.lab_samples';
    EXECUTE $p$
      CREATE POLICY "lab_samples_select" ON public.lab_samples FOR SELECT USING (
        public.is_lab_technician() OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "lab_samples_insert" ON public.lab_samples FOR INSERT WITH CHECK (
        public.is_lab_technician() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 4: BILLING / INVOICES (Finance sees only)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'invoices') THEN
    EXECUTE 'ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "invoices_select" ON public.invoices';
    EXECUTE 'DROP POLICY IF EXISTS "invoices_insert" ON public.invoices';
    EXECUTE 'DROP POLICY IF EXISTS "invoices_update" ON public.invoices';
    -- Finance role sees all billing; clinical roles see their org; ambassadors blocked
    EXECUTE $p$
      CREATE POLICY "invoices_select" ON public.invoices FOR SELECT USING (
        public.is_finance_role()
        OR (public.belongs_to_org(organization_id) AND public.user_role_in(ARRAY['org_admin', 'platform_admin']))
        OR auth.uid() = user_id
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "invoices_insert" ON public.invoices FOR INSERT WITH CHECK (
        public.is_finance_role() AND NOT public.is_ambassador()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "invoices_update" ON public.invoices FOR UPDATE USING (
        public.is_finance_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 5: PAYMENTS
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    EXECUTE 'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "payments_select" ON public.payments';
    EXECUTE 'DROP POLICY IF EXISTS "payments_insert" ON public.payments';
    EXECUTE $p$
      CREATE POLICY "payments_select" ON public.payments FOR SELECT USING (
        public.is_finance_role()
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (
        public.is_finance_role() OR public.is_platform_admin()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 6: SYNC QUEUE (all modules — org-scoped)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sync_queue') THEN
    EXECUTE 'ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "sync_queue_select" ON public.sync_queue';
    EXECUTE 'DROP POLICY IF EXISTS "sync_queue_insert" ON public.sync_queue';
    EXECUTE 'DROP POLICY IF EXISTS "sync_queue_update" ON public.sync_queue';
    EXECUTE $p$
      CREATE POLICY "sync_queue_select" ON public.sync_queue FOR SELECT USING (
        public.belongs_to_org(organization_id) OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "sync_queue_insert" ON public.sync_queue FOR INSERT WITH CHECK (
        public.belongs_to_org(organization_id) OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "sync_queue_update" ON public.sync_queue FOR UPDATE USING (
        public.belongs_to_org(organization_id) OR public.is_platform_admin()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 7: IMAGING / RADIOLOGY
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imaging_studies') THEN
    EXECUTE 'ALTER TABLE public.imaging_studies ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "imaging_select" ON public.imaging_studies';
    EXECUTE 'DROP POLICY IF EXISTS "imaging_insert" ON public.imaging_studies';
    EXECUTE $p$
      CREATE POLICY "imaging_select" ON public.imaging_studies FOR SELECT USING (
        public.is_clinical_role()
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "imaging_insert" ON public.imaging_studies FOR INSERT WITH CHECK (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 8: PHARMACY / DISPENSATION
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dispensations') THEN
    EXECUTE 'ALTER TABLE public.dispensations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "dispensations_select" ON public.dispensations';
    EXECUTE 'DROP POLICY IF EXISTS "dispensations_insert" ON public.dispensations';
    EXECUTE $p$
      CREATE POLICY "dispensations_select" ON public.dispensations FOR SELECT USING (
        public.user_role_in(ARRAY['pharmacist', 'pharmacy_manager', 'professional', 'org_admin', 'platform_admin'])
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "dispensations_insert" ON public.dispensations FOR INSERT WITH CHECK (
        public.user_role_in(ARRAY['pharmacist', 'pharmacy_manager', 'platform_admin'])
        AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 9: RESEARCH DATA
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'research_datasets') THEN
    EXECUTE 'ALTER TABLE public.research_datasets ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "research_datasets_select" ON public.research_datasets';
    EXECUTE 'DROP POLICY IF EXISTS "research_datasets_insert" ON public.research_datasets';
    EXECUTE $p$
      CREATE POLICY "research_datasets_select" ON public.research_datasets FOR SELECT USING (
        public.is_research_role()
        OR (is_public = true)
        OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "research_datasets_insert" ON public.research_datasets FOR INSERT WITH CHECK (
        public.is_research_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 10: TELECONSULTATIONS
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'teleconsultations') THEN
    EXECUTE 'ALTER TABLE public.teleconsultations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "teleconsultations_select" ON public.teleconsultations';
    EXECUTE 'DROP POLICY IF EXISTS "teleconsultations_insert" ON public.teleconsultations';
    EXECUTE $p$
      CREATE POLICY "teleconsultations_select" ON public.teleconsultations FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
        OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
        OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "teleconsultations_insert" ON public.teleconsultations FOR INSERT WITH CHECK (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 11: NOTIFICATIONS
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    EXECUTE 'ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "notifications_select" ON public.notifications';
    EXECUTE 'DROP POLICY IF EXISTS "notifications_insert" ON public.notifications';
    EXECUTE 'DROP POLICY IF EXISTS "notifications_update" ON public.notifications';
    EXECUTE $p$
      CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (
        auth.uid() = user_id OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (
        public.is_platform_admin()
        OR public.belongs_to_org(organization_id)
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (
        auth.uid() = user_id OR public.is_platform_admin()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 12: HOSPITALIZATION
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hospitalizations') THEN
    EXECUTE 'ALTER TABLE public.hospitalizations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "hospitalizations_select" ON public.hospitalizations';
    EXECUTE 'DROP POLICY IF EXISTS "hospitalizations_insert" ON public.hospitalizations';
    EXECUTE $p$
      CREATE POLICY "hospitalizations_select" ON public.hospitalizations FOR SELECT USING (
        public.is_clinical_role()
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
        OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "hospitalizations_insert" ON public.hospitalizations FOR INSERT WITH CHECK (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 13: SUPPLY CHAIN / INVENTORY
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventory_items') THEN
    EXECUTE 'ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "inventory_select" ON public.inventory_items';
    EXECUTE 'DROP POLICY IF EXISTS "inventory_insert" ON public.inventory_items';
    EXECUTE $p$
      CREATE POLICY "inventory_select" ON public.inventory_items FOR SELECT USING (
        public.user_role_in(ARRAY['supply_manager', 'pharmacist', 'org_admin', 'platform_admin'])
        AND NOT public.is_ambassador()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "inventory_insert" ON public.inventory_items FOR INSERT WITH CHECK (
        public.user_role_in(ARRAY['supply_manager', 'org_admin', 'platform_admin'])
        AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 14: HR / WORKFORCE
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hr_records') THEN
    EXECUTE 'ALTER TABLE public.hr_records ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "hr_records_select" ON public.hr_records';
    EXECUTE 'DROP POLICY IF EXISTS "hr_records_insert" ON public.hr_records';
    EXECUTE $p$
      CREATE POLICY "hr_records_select" ON public.hr_records FOR SELECT USING (
        public.user_role_in(ARRAY['hr_manager', 'org_admin', 'platform_admin'])
        OR auth.uid() = employee_user_id
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "hr_records_insert" ON public.hr_records FOR INSERT WITH CHECK (
        public.user_role_in(ARRAY['hr_manager', 'org_admin', 'platform_admin'])
        AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 15: INSURANCE / ASSURANCE
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'insurance_claims') THEN
    EXECUTE 'ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "insurance_claims_select" ON public.insurance_claims';
    EXECUTE 'DROP POLICY IF EXISTS "insurance_claims_insert" ON public.insurance_claims';
    EXECUTE $p$
      CREATE POLICY "insurance_claims_select" ON public.insurance_claims FOR SELECT USING (
        public.user_role_in(ARRAY['insurance_agent', 'finance', 'org_admin', 'platform_admin'])
        OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "insurance_claims_insert" ON public.insurance_claims FOR INSERT WITH CHECK (
        public.user_role_in(ARRAY['insurance_agent', 'finance', 'org_admin', 'platform_admin'])
        AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 16: AMBASSADOR COMMERCIAL (no medical data)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ambassador_activities') THEN
    EXECUTE 'ALTER TABLE public.ambassador_activities ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "ambassador_activities_select" ON public.ambassador_activities';
    EXECUTE 'DROP POLICY IF EXISTS "ambassador_activities_insert" ON public.ambassador_activities';
    EXECUTE $p$
      CREATE POLICY "ambassador_activities_select" ON public.ambassador_activities FOR SELECT USING (
        auth.uid() = ambassador_user_id
        OR public.user_role_in(ARRAY['org_admin', 'platform_admin'])
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "ambassador_activities_insert" ON public.ambassador_activities FOR INSERT WITH CHECK (
        auth.uid() = ambassador_user_id OR public.is_platform_admin()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 17: EMERGENCY
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emergency_cases') THEN
    EXECUTE 'ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "emergency_cases_select" ON public.emergency_cases';
    EXECUTE 'DROP POLICY IF EXISTS "emergency_cases_insert" ON public.emergency_cases';
    EXECUTE $p$
      CREATE POLICY "emergency_cases_select" ON public.emergency_cases FOR SELECT USING (
        public.is_clinical_role() OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "emergency_cases_insert" ON public.emergency_cases FOR INSERT WITH CHECK (
        public.is_clinical_role() AND NOT public.is_ambassador()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 18: AUDIT LOGS (platform admin only)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') THEN
    EXECUTE 'ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs';
    EXECUTE 'DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs';
    EXECUTE $p$
      CREATE POLICY "audit_logs_select" ON public.audit_logs FOR SELECT USING (
        public.is_platform_admin()
        OR (public.is_org_admin() AND organization_id = public.user_org_id())
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "audit_logs_insert" ON public.audit_logs FOR INSERT WITH CHECK (true)
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 19: COMMUNITY HUB (public content, no medical data)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') THEN
    EXECUTE 'ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "community_posts_select" ON public.community_posts';
    EXECUTE 'DROP POLICY IF EXISTS "community_posts_insert" ON public.community_posts';
    EXECUTE 'DROP POLICY IF EXISTS "community_posts_update" ON public.community_posts';
    EXECUTE $p$
      CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (
        is_published = true OR auth.uid() = author_id OR public.is_platform_admin()
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND auth.uid() = author_id
      )
    $p$;
    EXECUTE $p$
      CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (
        auth.uid() = author_id OR public.is_platform_admin()
      )
    $p$;
  END IF;
END $$;

-- ============================================================
-- MODULE 20: PLATFORM EVENTS (live module interactions feed)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_events') THEN
    CREATE TABLE public.platform_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      source_module TEXT NOT NULL,
      target_module TEXT,
      organization_id UUID,
      user_id UUID,
      patient_id UUID,
      payload JSONB DEFAULT '{}',
      severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
      resolved BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_platform_events_created ON public.platform_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_platform_events_type ON public.platform_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_platform_events_org ON public.platform_events(organization_id);
  END IF;
END $$;

ALTER TABLE IF EXISTS public.platform_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "platform_events_select" ON public.platform_events;
DROP POLICY IF EXISTS "platform_events_insert" ON public.platform_events;

CREATE POLICY "platform_events_select" ON public.platform_events
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "platform_events_insert" ON public.platform_events
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id) OR public.is_platform_admin()
  );

-- ============================================================
-- TRANSFER STATE MACHINE TABLE
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patient_transfers') THEN
    CREATE TABLE public.patient_transfers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      patient_id UUID,
      organization_id UUID,
      from_facility TEXT NOT NULL,
      to_facility TEXT NOT NULL,
      transfer_type TEXT NOT NULL DEFAULT 'inter-service',
      urgency TEXT NOT NULL DEFAULT 'routine',
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','consent','authorization','acceptance','in-transit','received','completed','cancelled')),
      consent_obtained BOOLEAN DEFAULT false,
      consent_obtained_at TIMESTAMPTZ,
      authorized_by UUID,
      authorized_at TIMESTAMPTZ,
      accepted_by UUID,
      accepted_at TIMESTAMPTZ,
      departed_at TIMESTAMPTZ,
      received_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      selected_documents JSONB DEFAULT '[]',
      notes TEXT,
      created_by UUID DEFAULT auth.uid(),
      updated_by UUID DEFAULT auth.uid(),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_patient_transfers_status ON public.patient_transfers(status);
    CREATE INDEX IF NOT EXISTS idx_patient_transfers_org ON public.patient_transfers(organization_id);
    CREATE INDEX IF NOT EXISTS idx_patient_transfers_patient ON public.patient_transfers(patient_id);
  END IF;
END $$;

ALTER TABLE IF EXISTS public.patient_transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "transfers_select" ON public.patient_transfers;
DROP POLICY IF EXISTS "transfers_insert" ON public.patient_transfers;
DROP POLICY IF EXISTS "transfers_update" ON public.patient_transfers;

CREATE POLICY "transfers_select" ON public.patient_transfers FOR SELECT USING (
  public.is_clinical_role()
  OR public.is_platform_admin()
  OR auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
);

CREATE POLICY "transfers_insert" ON public.patient_transfers FOR INSERT WITH CHECK (
  public.is_clinical_role() AND NOT public.is_ambassador()
);

CREATE POLICY "transfers_update" ON public.patient_transfers FOR UPDATE USING (
  public.is_clinical_role() AND NOT public.is_ambassador()
);

-- ============================================================
-- TRANSFER NOTIFICATIONS TABLE
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transfer_notifications') THEN
    CREATE TABLE public.transfer_notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      transfer_id UUID NOT NULL,
      recipient_user_id UUID NOT NULL,
      notification_type TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_transfer_notif_recipient ON public.transfer_notifications(recipient_user_id);
    CREATE INDEX IF NOT EXISTS idx_transfer_notif_transfer ON public.transfer_notifications(transfer_id);
  END IF;
END $$;

ALTER TABLE IF EXISTS public.transfer_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "transfer_notif_select" ON public.transfer_notifications;
DROP POLICY IF EXISTS "transfer_notif_insert" ON public.transfer_notifications;
DROP POLICY IF EXISTS "transfer_notif_update" ON public.transfer_notifications;

CREATE POLICY "transfer_notif_select" ON public.transfer_notifications
  FOR SELECT USING (auth.uid() = recipient_user_id OR public.is_platform_admin());

CREATE POLICY "transfer_notif_insert" ON public.transfer_notifications
  FOR INSERT WITH CHECK (public.is_clinical_role() OR public.is_platform_admin());

CREATE POLICY "transfer_notif_update" ON public.transfer_notifications
  FOR UPDATE USING (auth.uid() = recipient_user_id OR public.is_platform_admin());

-- Enable realtime for live module interactions screen
ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_transfers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfer_notifications;
