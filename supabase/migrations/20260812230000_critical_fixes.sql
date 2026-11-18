-- ============================================================
-- SHIFA HEALTH OS — Critical Fixes Migration
-- Version: 20260812230000 (IDEMPOTENT)
--
-- STRATEGY FOR is_org_admin(UUID) DEPENDENCY CONFLICT:
-- The foundation migration defined is_org_admin(p_org_id UUID).
-- Five policies depend on it:
--   departments_admin_write, pro_orgs_admin_write,
--   org_modules_admin_write, org_roles_admin_write, audit_logs_admin_read
-- The rls_security migration defined is_org_admin() (no param).
-- We CANNOT DROP is_org_admin(UUID) while those policies exist.
-- SOLUTION (no CASCADE):
--   Step 1 — Ensure is_org_admin() (no-param canonical) exists first.
--   Step 2 — Recreate all 5 dependent policies using is_org_admin() instead.
--   Step 3 — Now is_org_admin(UUID) has zero dependents → drop it safely.
--   Step 4 — Proceed with all other fixes.
-- ============================================================

-- ============================================================
-- STEP 1: ENSURE CANONICAL FUNCTIONS EXIST
-- These are idempotent (CREATE OR REPLACE).
-- ============================================================

-- Canonical is_org_admin() — no parameter, checks current user
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('org_admin', 'platform_admin')
  );
$$;

-- Ensure is_platform_admin() is consistent
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'platform_admin'
  );
$$;

-- Ensure user_role() exists
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role::TEXT
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Ensure user_org_id() exists
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT po.organization_id
  FROM public.professionals p
  JOIN public.professional_organizations po ON po.professional_id = p.id
  WHERE p.user_id = auth.uid()
    AND po.is_primary = true
  LIMIT 1;
$$;

-- Ensure belongs_to_org() exists
CREATE OR REPLACE FUNCTION public.belongs_to_org(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.professionals p
    JOIN public.professional_organizations po ON po.professional_id = p.id
    WHERE p.user_id = auth.uid()
      AND po.organization_id = target_org_id
      AND po.invitation_status = 'accepted'
  );
$$;

-- Alias for financial domain compatibility
CREATE OR REPLACE FUNCTION public.is_org_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.is_org_admin();
$$;

-- Alias for financial domain compatibility
CREATE OR REPLACE FUNCTION public.is_platform_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.is_platform_admin();
$$;

-- Guest helper
CREATE OR REPLACE FUNCTION public.is_guest()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'guest'
  );
$$;

-- ============================================================
-- STEP 2: MIGRATE ALL POLICIES THAT DEPEND ON is_org_admin(UUID)
-- We drop and recreate them using is_org_admin() (no-param).
-- After this step, is_org_admin(UUID) has ZERO dependents.
-- ============================================================

-- 2a. departments_admin_write
-- Foundation: USING (public.is_org_admin(organization_id))
DROP POLICY IF EXISTS "departments_admin_write" ON public.departments;
CREATE POLICY "departments_admin_write" ON public.departments
  FOR ALL TO authenticated
  USING (public.is_org_admin())
  WITH CHECK (public.is_org_admin());

-- 2b. pro_orgs_admin_write
-- Foundation: USING (invited_by = auth.uid() OR public.is_org_admin(organization_id))
DROP POLICY IF EXISTS "pro_orgs_admin_write" ON public.professional_organizations;
CREATE POLICY "pro_orgs_admin_write" ON public.professional_organizations
  FOR ALL TO authenticated
  USING (invited_by = auth.uid() OR public.is_org_admin())
  WITH CHECK (invited_by = auth.uid() OR public.is_org_admin());

-- 2c. org_modules_admin_write
-- Foundation: USING (public.is_org_admin(organization_id))
DROP POLICY IF EXISTS "org_modules_admin_write" ON public.organization_modules;
CREATE POLICY "org_modules_admin_write" ON public.organization_modules
  FOR ALL TO authenticated
  USING (public.is_org_admin())
  WITH CHECK (public.is_org_admin());

-- 2d. org_roles_admin_write
-- Foundation: USING (public.is_org_admin(organization_id))
DROP POLICY IF EXISTS "org_roles_admin_write" ON public.org_roles;
CREATE POLICY "org_roles_admin_write" ON public.org_roles
  FOR ALL TO authenticated
  USING (public.is_org_admin())
  WITH CHECK (public.is_org_admin());

-- 2e. audit_logs_admin_read
-- Foundation: USING (user_id = auth.uid() OR public.is_platform_admin() OR public.is_org_admin(organization_id))
DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_platform_admin()
    OR public.is_org_admin()
  );

-- ============================================================
-- STEP 3: NOW SAFELY DROP is_org_admin(UUID)
-- No objects depend on it anymore → no CASCADE needed.
-- ============================================================

DROP FUNCTION IF EXISTS public.is_org_admin(UUID);

-- ============================================================
-- STEP 4: RESOLVE CONFLICTING RLS POLICIES
-- foundation.sql and rls_security.sql both define policies on
-- health_records, appointments, patients.
-- Drop ALL variants and recreate clean unified versions.
-- ============================================================

-- ---- health_records ----
DROP POLICY IF EXISTS "health_records_patient_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_professional_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_org_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_admin_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_professional_insert" ON public.health_records;
DROP POLICY IF EXISTS "health_records_org_insert" ON public.health_records;
DROP POLICY IF EXISTS "health_records_professional_update" ON public.health_records;
DROP POLICY IF EXISTS "health_records_org_update" ON public.health_records;
DROP POLICY IF EXISTS "health_records_admin_delete" ON public.health_records;
DROP POLICY IF EXISTS "health_records_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_insert" ON public.health_records;
DROP POLICY IF EXISTS "health_records_update" ON public.health_records;
DROP POLICY IF EXISTS "health_records_delete" ON public.health_records;
DROP POLICY IF EXISTS "health_records_access" ON public.health_records;

ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "health_records_select" ON public.health_records
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "health_records_insert" ON public.health_records
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "health_records_update" ON public.health_records
  FOR UPDATE USING (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "health_records_delete" ON public.health_records
  FOR DELETE USING (public.is_platform_admin());

-- ---- appointments ----
DROP POLICY IF EXISTS "appointments_patient_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_professional_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_org_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admin_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_professional_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_professional_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_org_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_delete" ON public.appointments;
DROP POLICY IF EXISTS "appointments_org_delete" ON public.appointments;
DROP POLICY IF EXISTS "appointments_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_delete" ON public.appointments;
DROP POLICY IF EXISTS "appointments_involved_parties" ON public.appointments;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_select" ON public.appointments
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "appointments_insert" ON public.appointments
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin', 'platform_admin'))
  );

CREATE POLICY "appointments_update" ON public.appointments
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "appointments_delete" ON public.appointments
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- ---- patients ----
DROP POLICY IF EXISTS "patients_own_select" ON public.patients;
DROP POLICY IF EXISTS "patients_professional_select" ON public.patients;
DROP POLICY IF EXISTS "patients_admin_select" ON public.patients;
DROP POLICY IF EXISTS "patients_own_insert" ON public.patients;
DROP POLICY IF EXISTS "patients_professional_insert" ON public.patients;
DROP POLICY IF EXISTS "patients_own_update" ON public.patients;
DROP POLICY IF EXISTS "patients_professional_update" ON public.patients;
DROP POLICY IF EXISTS "patients_select" ON public.patients;
DROP POLICY IF EXISTS "patients_insert" ON public.patients;
DROP POLICY IF EXISTS "patients_update" ON public.patients;
DROP POLICY IF EXISTS "patients_own_record" ON public.patients;
DROP POLICY IF EXISTS "patients_platform_admin" ON public.patients;

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patients_select" ON public.patients
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "patients_insert" ON public.patients
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "patients_update" ON public.patients
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

-- ---- professionals ----
-- Keep foundation policies but ensure no duplicates
DROP POLICY IF EXISTS "professionals_public_read" ON public.professionals;
DROP POLICY IF EXISTS "professionals_own_write" ON public.professionals;

ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "professionals_public_read" ON public.professionals
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "professionals_own_write" ON public.professionals
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---- professional_organizations: fix self-invitation vulnerability ----
DROP POLICY IF EXISTS "pro_orgs_read" ON public.professional_organizations;
DROP POLICY IF EXISTS "professional_organizations_select" ON public.professional_organizations;
DROP POLICY IF EXISTS "professional_organizations_insert" ON public.professional_organizations;
DROP POLICY IF EXISTS "professional_organizations_update" ON public.professional_organizations;
DROP POLICY IF EXISTS "professional_organizations_delete" ON public.professional_organizations;

ALTER TABLE public.professional_organizations ENABLE ROW LEVEL SECURITY;

-- SELECT: own records OR org_admin of that org OR platform_admin
CREATE POLICY "professional_organizations_select" ON public.professional_organizations
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- INSERT: only org_admin can invite — prevents self-invitation
CREATE POLICY "professional_organizations_insert" ON public.professional_organizations
  FOR INSERT WITH CHECK (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- UPDATE: the professional accepting their own invite OR org_admin OR platform_admin
CREATE POLICY "professional_organizations_update" ON public.professional_organizations
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- DELETE: org_admin or platform_admin only
CREATE POLICY "professional_organizations_delete" ON public.professional_organizations
  FOR DELETE USING (
    (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- ---- departments: ensure clean policies (already migrated in step 2) ----
DROP POLICY IF EXISTS "departments_org_read" ON public.departments;

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "departments_org_read" ON public.departments
  FOR SELECT TO authenticated
  USING (true);

-- ---- organization_modules: ensure clean policies (already migrated in step 2) ----
DROP POLICY IF EXISTS "org_modules_read" ON public.organization_modules;

ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_modules_read" ON public.organization_modules
  FOR SELECT TO authenticated
  USING (true);

-- ---- org_roles: ensure clean policies (already migrated in step 2) ----
DROP POLICY IF EXISTS "org_roles_read" ON public.org_roles;

ALTER TABLE public.org_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_roles_read" ON public.org_roles
  FOR SELECT TO authenticated
  USING (true);

-- ---- audit_logs: ensure insert policy exists (already migrated in step 2) ----
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- STEP 5: CREATE MISSING TABLES (idempotent via CREATE TABLE IF NOT EXISTS)
-- ============================================================

-- 5.1 CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  consultation_type TEXT NOT NULL DEFAULT 'in_person',
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  chief_complaint TEXT,
  history_of_present_illness TEXT,
  physical_examination JSONB DEFAULT '{}'::jsonb,
  vital_signs JSONB DEFAULT '{}'::jsonb,
  diagnosis TEXT,
  icd_codes TEXT[] DEFAULT ARRAY[]::TEXT[],
  treatment_plan TEXT,
  follow_up_date DATE,
  follow_up_instructions TEXT,
  notes TEXT,
  is_confidential BOOLEAN DEFAULT false,
  duration_minutes INTEGER DEFAULT 30,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON public.consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_professional_id ON public.consultations(professional_id);
CREATE INDEX IF NOT EXISTS idx_consultations_organization_id ON public.consultations(organization_id);
CREATE INDEX IF NOT EXISTS idx_consultations_appointment_id ON public.consultations(appointment_id);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consultations_select" ON public.consultations;
DROP POLICY IF EXISTS "consultations_insert" ON public.consultations;
DROP POLICY IF EXISTS "consultations_update" ON public.consultations;
DROP POLICY IF EXISTS "consultations_delete" ON public.consultations;

CREATE POLICY "consultations_select" ON public.consultations
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "consultations_insert" ON public.consultations
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "consultations_update" ON public.consultations
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "consultations_delete" ON public.consultations
  FOR DELETE USING (public.is_platform_admin());

-- 5.2 PRESCRIPTIONS
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  prescriber_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  prescription_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'dispensed', 'cancelled', 'expired')),
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  diagnosis TEXT,
  instructions TEXT,
  validity_days INTEGER DEFAULT 30,
  is_renewable BOOLEAN DEFAULT false,
  dispensed_at TIMESTAMPTZ,
  dispensed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_prescriber_id ON public.prescriptions(prescriber_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_organization_id ON public.prescriptions(organization_id);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prescriptions_select" ON public.prescriptions;
DROP POLICY IF EXISTS "prescriptions_insert" ON public.prescriptions;
DROP POLICY IF EXISTS "prescriptions_update" ON public.prescriptions;
DROP POLICY IF EXISTS "prescriptions_delete" ON public.prescriptions;

CREATE POLICY "prescriptions_select" ON public.prescriptions
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "prescriptions_insert" ON public.prescriptions
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
    AND public.user_role() IN ('professional', 'platform_admin')
  );

CREATE POLICY "prescriptions_update" ON public.prescriptions
  FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "prescriptions_delete" ON public.prescriptions
  FOR DELETE USING (public.is_platform_admin());

-- 5.3 LAB RESULTS
CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
  result_number TEXT UNIQUE,
  test_name TEXT NOT NULL,
  test_category TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'error')),
  sample_type TEXT,
  sample_collected_at TIMESTAMPTZ,
  sample_received_at TIMESTAMPTZ,
  results JSONB DEFAULT '[]'::jsonb,
  reference_ranges JSONB DEFAULT '{}'::jsonb,
  interpretation TEXT,
  is_critical BOOLEAN DEFAULT false,
  critical_notified_at TIMESTAMPTZ,
  validated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  report_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON public.lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_organization_id ON public.lab_results(organization_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_professional_id ON public.lab_results(professional_id);

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lab_results_select" ON public.lab_results;
DROP POLICY IF EXISTS "lab_results_insert" ON public.lab_results;
DROP POLICY IF EXISTS "lab_results_update" ON public.lab_results;
DROP POLICY IF EXISTS "lab_results_delete" ON public.lab_results;

CREATE POLICY "lab_results_select" ON public.lab_results
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "lab_results_insert" ON public.lab_results
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "lab_results_update" ON public.lab_results
  FOR UPDATE USING (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "lab_results_delete" ON public.lab_results
  FOR DELETE USING (public.is_platform_admin());

-- 5.4 MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID,
  sender_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  message_type TEXT NOT NULL DEFAULT 'text'
    CHECK (message_type IN ('text', 'image', 'document', 'audio', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_recipient BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_patient_id ON public.messages(patient_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_update" ON public.messages;
DROP POLICY IF EXISTS "messages_delete" ON public.messages;

CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id
    OR auth.uid() = recipient_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "messages_update" ON public.messages
  FOR UPDATE USING (
    auth.uid() = sender_id
    OR auth.uid() = recipient_id
  );

CREATE POLICY "messages_delete" ON public.messages
  FOR DELETE USING (
    auth.uid() = sender_id
    OR public.is_platform_admin()
  );

-- 5.5 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL DEFAULT 'info'
    CHECK (notification_type IN ('info', 'warning', 'error', 'success', 'appointment', 'message', 'lab_result', 'prescription', 'payment', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;

CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
    OR public.is_org_admin()
  );

CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "notifications_delete" ON public.notifications
  FOR DELETE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- 5.6 WALLETS
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'closed')),
  total_deposited NUMERIC(15,2) DEFAULT 0,
  total_withdrawn NUMERIC(15,2) DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL
    CHECK (transaction_type IN ('deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'payment', 'refund', 'fee')),
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  balance_before NUMERIC(15,2) NOT NULL,
  balance_after NUMERIC(15,2) NOT NULL,
  reference TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wallets_select" ON public.wallets;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets;
DROP POLICY IF EXISTS "wallets_update" ON public.wallets;

CREATE POLICY "wallets_select" ON public.wallets
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "wallets_insert" ON public.wallets
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "wallets_update" ON public.wallets
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

DROP POLICY IF EXISTS "wallet_transactions_select" ON public.wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_insert" ON public.wallet_transactions;

CREATE POLICY "wallet_transactions_select" ON public.wallet_transactions
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.wallets WHERE id = wallet_id LIMIT 1)
    OR public.is_platform_admin()
  );

CREATE POLICY "wallet_transactions_insert" ON public.wallet_transactions
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.wallets WHERE id = wallet_id LIMIT 1)
    OR public.is_platform_admin()
  );

-- 5.7 SHIFA CARDS
CREATE TABLE IF NOT EXISTS public.shifa_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  shifa_id TEXT NOT NULL,
  card_number TEXT UNIQUE,
  card_type TEXT NOT NULL DEFAULT 'standard'
    CHECK (card_type IN ('standard', 'premium', 'professional', 'institutional')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'blocked', 'expired', 'pending_delivery')),
  qr_code_data TEXT,
  nfc_data TEXT,
  issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  delivery_address JSONB DEFAULT '{}'::jsonb,
  delivery_status TEXT DEFAULT 'not_requested'
    CHECK (delivery_status IN ('not_requested', 'requested', 'processing', 'shipped', 'delivered')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shifa_cards_user_id ON public.shifa_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_shifa_cards_shifa_id ON public.shifa_cards(shifa_id);

ALTER TABLE public.shifa_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shifa_cards_select" ON public.shifa_cards;
DROP POLICY IF EXISTS "shifa_cards_insert" ON public.shifa_cards;
DROP POLICY IF EXISTS "shifa_cards_update" ON public.shifa_cards;

CREATE POLICY "shifa_cards_select" ON public.shifa_cards
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "shifa_cards_insert" ON public.shifa_cards
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "shifa_cards_update" ON public.shifa_cards
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- 5.8 SYNC QUEUE (for offline mode)
CREATE TABLE IF NOT EXISTS public.sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  operation TEXT NOT NULL
    CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  table_name TEXT NOT NULL,
  record_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'synced', 'failed', 'conflict')),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_user_id ON public.sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON public.sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_created_at ON public.sync_queue(created_at);

ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sync_queue_select" ON public.sync_queue;
DROP POLICY IF EXISTS "sync_queue_insert" ON public.sync_queue;
DROP POLICY IF EXISTS "sync_queue_update" ON public.sync_queue;
DROP POLICY IF EXISTS "sync_queue_delete" ON public.sync_queue;

CREATE POLICY "sync_queue_select" ON public.sync_queue
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "sync_queue_insert" ON public.sync_queue
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "sync_queue_update" ON public.sync_queue
  FOR UPDATE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "sync_queue_delete" ON public.sync_queue
  FOR DELETE USING (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- 5.9 LAB SAMPLES
CREATE TABLE IF NOT EXISTS public.lab_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  lab_result_id UUID REFERENCES public.lab_results(id) ON DELETE SET NULL,
  sample_number TEXT UNIQUE,
  sample_type TEXT NOT NULL,
  collection_method TEXT,
  collected_at TIMESTAMPTZ,
  collected_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  received_at TIMESTAMPTZ,
  received_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  storage_conditions TEXT,
  storage_location TEXT,
  status TEXT NOT NULL DEFAULT 'collected'
    CHECK (status IN ('collected', 'in_transit', 'received', 'processing', 'completed', 'rejected', 'disposed')),
  transfer_type TEXT DEFAULT 'internal'
    CHECK (transfer_type IN ('internal', 'external', 'international')),
  destination_lab TEXT,
  destination_country TEXT,
  tracking_number TEXT,
  chain_of_custody JSONB DEFAULT '[]'::jsonb,
  temperature_log JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lab_samples_patient_id ON public.lab_samples(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_samples_organization_id ON public.lab_samples(organization_id);
CREATE INDEX IF NOT EXISTS idx_lab_samples_status ON public.lab_samples(status);

ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lab_samples_select" ON public.lab_samples;
DROP POLICY IF EXISTS "lab_samples_insert" ON public.lab_samples;
DROP POLICY IF EXISTS "lab_samples_update" ON public.lab_samples;
DROP POLICY IF EXISTS "lab_samples_delete" ON public.lab_samples;

CREATE POLICY "lab_samples_select" ON public.lab_samples
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "lab_samples_insert" ON public.lab_samples
  FOR INSERT WITH CHECK (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "lab_samples_update" ON public.lab_samples
  FOR UPDATE USING (
    public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
  );

CREATE POLICY "lab_samples_delete" ON public.lab_samples
  FOR DELETE USING (public.is_platform_admin());

-- 5.10 PATIENT TRANSFERS
-- Create table if it does not exist yet
CREATE TABLE IF NOT EXISTS public.patient_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  from_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  to_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  accepted_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  transfer_reason TEXT,
  clinical_summary TEXT,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'accepted', 'rejected', 'in_transit', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Idempotent column additions for pre-existing patient_transfers table
-- (table may already exist from foundation migration without these columns)
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS from_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS to_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS requested_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS accepted_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS transfer_reason TEXT;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS clinical_summary TEXT;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.patient_transfers
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_patient_transfers_patient_id ON public.patient_transfers(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_transfers_from_org ON public.patient_transfers(from_organization_id);
CREATE INDEX IF NOT EXISTS idx_patient_transfers_to_org ON public.patient_transfers(to_organization_id);
CREATE INDEX IF NOT EXISTS idx_patient_transfers_status ON public.patient_transfers(status);

ALTER TABLE public.patient_transfers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patient_transfers_select" ON public.patient_transfers;
DROP POLICY IF EXISTS "patient_transfers_insert" ON public.patient_transfers;
DROP POLICY IF EXISTS "patient_transfers_update" ON public.patient_transfers;
DROP POLICY IF EXISTS "patient_transfers_delete" ON public.patient_transfers;

CREATE POLICY "patient_transfers_select" ON public.patient_transfers
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(from_organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR (public.belongs_to_org(to_organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "patient_transfers_insert" ON public.patient_transfers
  FOR INSERT WITH CHECK (
    (public.belongs_to_org(from_organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "patient_transfers_update" ON public.patient_transfers
  FOR UPDATE USING (
    (public.belongs_to_org(from_organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR (public.belongs_to_org(to_organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "patient_transfers_delete" ON public.patient_transfers
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 6: ADD updated_at TRIGGERS FOR NEW TABLES
-- ============================================================

DROP TRIGGER IF EXISTS set_updated_at_consultations ON public.consultations;
CREATE TRIGGER set_updated_at_consultations
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_prescriptions ON public.prescriptions;
CREATE TRIGGER set_updated_at_prescriptions
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_lab_results ON public.lab_results;
CREATE TRIGGER set_updated_at_lab_results
  BEFORE UPDATE ON public.lab_results
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_messages ON public.messages;
CREATE TRIGGER set_updated_at_messages
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_wallets ON public.wallets;
CREATE TRIGGER set_updated_at_wallets
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_shifa_cards ON public.shifa_cards;
CREATE TRIGGER set_updated_at_shifa_cards
  BEFORE UPDATE ON public.shifa_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_sync_queue ON public.sync_queue;
CREATE TRIGGER set_updated_at_sync_queue
  BEFORE UPDATE ON public.sync_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_lab_samples ON public.lab_samples;
CREATE TRIGGER set_updated_at_lab_samples
  BEFORE UPDATE ON public.lab_samples
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_patient_transfers ON public.patient_transfers;
CREATE TRIGGER set_updated_at_patient_transfers
  BEFORE UPDATE ON public.patient_transfers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- STEP 7: GENERATE PRESCRIPTION NUMBERS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_prescription_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.prescription_number IS NULL THEN
    NEW.prescription_number := 'RX-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_prescription_number ON public.prescriptions;
CREATE TRIGGER set_prescription_number
  BEFORE INSERT ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.generate_prescription_number();

-- ============================================================
-- STEP 8: GENERATE LAB RESULT NUMBERS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_result_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.result_number IS NULL THEN
    NEW.result_number := 'LAB-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_result_number ON public.lab_results;
CREATE TRIGGER set_result_number
  BEFORE INSERT ON public.lab_results
  FOR EACH ROW EXECUTE FUNCTION public.generate_result_number();

-- ============================================================
-- STEP 9: GENERATE SAMPLE NUMBERS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_sample_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.sample_number IS NULL THEN
    NEW.sample_number := 'SAMP-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_sample_number ON public.lab_samples;
CREATE TRIGGER set_sample_number
  BEFORE INSERT ON public.lab_samples
  FOR EACH ROW EXECUTE FUNCTION public.generate_sample_number();

-- ============================================================
-- STEP 10: STORAGE BUCKETS
-- ============================================================

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'documents', 'documents', false, 52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'avatars', 'avatars', true, 5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'medical-images', 'medical-images', false, 104857600,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/dicom', 'image/dicom']
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'lab-reports', 'lab-reports', false, 52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'text/csv',
          'application/vnd.ms-excel']
  ) ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Storage bucket creation skipped (may need Supabase dashboard): %', SQLERRM;
END $$;

-- Storage RLS Policies
DO $$
BEGIN
  -- Documents: private, owner access only
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documents') THEN
    DROP POLICY IF EXISTS "documents_select_own" ON storage.objects;
    CREATE POLICY "documents_select_own" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    DROP POLICY IF EXISTS "documents_insert_own" ON storage.objects;
    CREATE POLICY "documents_insert_own" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    DROP POLICY IF EXISTS "documents_update_own" ON storage.objects;
    CREATE POLICY "documents_update_own" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    DROP POLICY IF EXISTS "documents_delete_own" ON storage.objects;
    CREATE POLICY "documents_delete_own" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'documents'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- Avatars: public read, owner write
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
    DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
    CREATE POLICY "avatars_public_select" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
    CREATE POLICY "avatars_insert_own" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );

    DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
    CREATE POLICY "avatars_update_own" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- Medical images: professionals and org_admin only
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'medical-images') THEN
    DROP POLICY IF EXISTS "medical_images_select" ON storage.objects;
    CREATE POLICY "medical_images_select" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'medical-images'
        AND (
          auth.uid()::text = (storage.foldername(name))[1]
          OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
      );

    DROP POLICY IF EXISTS "medical_images_insert" ON storage.objects;
    CREATE POLICY "medical_images_insert" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'medical-images'
        AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
      );
  END IF;

  -- Lab reports: professionals and org_admin only
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'lab-reports') THEN
    DROP POLICY IF EXISTS "lab_reports_select" ON storage.objects;
    CREATE POLICY "lab_reports_select" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'lab-reports'
        AND (
          auth.uid()::text = (storage.foldername(name))[1]
          OR public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
      );

    DROP POLICY IF EXISTS "lab_reports_insert" ON storage.objects;
    CREATE POLICY "lab_reports_insert" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'lab-reports'
        AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
      );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Storage RLS policies skipped: %', SQLERRM;
END $$;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
