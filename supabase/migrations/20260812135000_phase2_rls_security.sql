-- ============================================================
-- SHIFA HEALTH OS — Phase 2 Security: RLS Policies
-- Activates Row-Level Security on all clinical and financial tables
-- Scoped to user_id + organization_id
-- Migration: 20260812135000_phase2_rls_security.sql
-- ============================================================

-- ============================================================
-- HELPER: org membership check function
-- ============================================================
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT organization_id
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

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

CREATE OR REPLACE FUNCTION public.belongs_to_org(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND organization_id = target_org_id
  );
$$;

-- ============================================================
-- CLINICAL TABLES — Enable RLS
-- ============================================================

-- health_records
ALTER TABLE IF EXISTS public.health_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "health_records_select" ON public.health_records;
DROP POLICY IF EXISTS "health_records_insert" ON public.health_records;
DROP POLICY IF EXISTS "health_records_update" ON public.health_records;
DROP POLICY IF EXISTS "health_records_delete" ON public.health_records;

CREATE POLICY "health_records_select" ON public.health_records
  FOR SELECT USING (
    auth.uid() = patient_id
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

-- appointments
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "appointments_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_delete" ON public.appointments;

CREATE POLICY "appointments_select" ON public.appointments
  FOR SELECT USING (
    auth.uid() = patient_id
    OR auth.uid() = professional_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "appointments_insert" ON public.appointments
  FOR INSERT WITH CHECK (
    auth.uid() = patient_id
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin', 'platform_admin'))
  );

CREATE POLICY "appointments_update" ON public.appointments
  FOR UPDATE USING (
    auth.uid() = patient_id
    OR auth.uid() = professional_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "appointments_delete" ON public.appointments
  FOR DELETE USING (
    auth.uid() = patient_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- prescriptions
ALTER TABLE IF EXISTS public.prescriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "prescriptions_select" ON public.prescriptions;
DROP POLICY IF EXISTS "prescriptions_insert" ON public.prescriptions;
DROP POLICY IF EXISTS "prescriptions_update" ON public.prescriptions;

CREATE POLICY "prescriptions_select" ON public.prescriptions
  FOR SELECT USING (
    auth.uid() = patient_id
    OR auth.uid() = prescriber_id
    OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
    OR public.is_platform_admin()
  );

CREATE POLICY "prescriptions_insert" ON public.prescriptions
  FOR INSERT WITH CHECK (
    auth.uid() = prescriber_id
    AND public.belongs_to_org(organization_id)
    AND public.user_role() IN ('professional', 'platform_admin')
  );

CREATE POLICY "prescriptions_update" ON public.prescriptions
  FOR UPDATE USING (
    auth.uid() = prescriber_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- lab_results
ALTER TABLE IF EXISTS public.lab_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lab_results_select" ON public.lab_results;
DROP POLICY IF EXISTS "lab_results_insert" ON public.lab_results;
DROP POLICY IF EXISTS "lab_results_update" ON public.lab_results;

CREATE POLICY "lab_results_select" ON public.lab_results
  FOR SELECT USING (
    auth.uid() = patient_id
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

-- consultations (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'consultations') THEN
    EXECUTE 'ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "consultations_select" ON public.consultations';
    EXECUTE 'DROP POLICY IF EXISTS "consultations_insert" ON public.consultations';
    EXECUTE 'DROP POLICY IF EXISTS "consultations_update" ON public.consultations';
    EXECUTE $policy$
      CREATE POLICY "consultations_select" ON public.consultations
        FOR SELECT USING (
          auth.uid() = patient_id
          OR auth.uid() = professional_id
          OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "consultations_insert" ON public.consultations
        FOR INSERT WITH CHECK (
          auth.uid() = professional_id
          AND public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'platform_admin')
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "consultations_update" ON public.consultations
        FOR UPDATE USING (
          auth.uid() = professional_id
          OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
          OR public.is_platform_admin()
        )
    $policy$;
  END IF;
END $$;

-- dossier_patient (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dossier_patient') THEN
    EXECUTE 'ALTER TABLE public.dossier_patient ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "dossier_patient_select" ON public.dossier_patient';
    EXECUTE 'DROP POLICY IF EXISTS "dossier_patient_insert" ON public.dossier_patient';
    EXECUTE 'DROP POLICY IF EXISTS "dossier_patient_update" ON public.dossier_patient';
    EXECUTE $policy$
      CREATE POLICY "dossier_patient_select" ON public.dossier_patient
        FOR SELECT USING (
          auth.uid() = patient_id
          OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "dossier_patient_insert" ON public.dossier_patient
        FOR INSERT WITH CHECK (
          public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "dossier_patient_update" ON public.dossier_patient
        FOR UPDATE USING (
          public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
    $policy$;
  END IF;
END $$;

-- transfers (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transfers') THEN
    EXECUTE 'ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "transfers_select" ON public.transfers';
    EXECUTE 'DROP POLICY IF EXISTS "transfers_insert" ON public.transfers';
    EXECUTE $policy$
      CREATE POLICY "transfers_select" ON public.transfers
        FOR SELECT USING (
          auth.uid() = patient_id
          OR public.belongs_to_org(from_organization_id)
          OR public.belongs_to_org(to_organization_id)
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "transfers_insert" ON public.transfers
        FOR INSERT WITH CHECK (
          public.belongs_to_org(from_organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
    $policy$;
  END IF;
END $$;

-- ============================================================
-- FINANCIAL TABLES — Enable RLS
-- ============================================================

-- subscriptions
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update" ON public.subscriptions;

CREATE POLICY "subscriptions_select" ON public.subscriptions
  FOR SELECT USING (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_insert" ON public.subscriptions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_update" ON public.subscriptions
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- payments
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payments_select" ON public.payments;
DROP POLICY IF EXISTS "payments_insert" ON public.payments;

CREATE POLICY "payments_select" ON public.payments
  FOR SELECT USING (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR public.is_platform_admin()
  );

-- invoices
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "invoices_update" ON public.invoices;

CREATE POLICY "invoices_select" ON public.invoices
  FOR SELECT USING (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_update" ON public.invoices
  FOR UPDATE USING (
    (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- tax_records
ALTER TABLE IF EXISTS public.tax_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tax_records_select" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_insert" ON public.tax_records;

CREATE POLICY "tax_records_select" ON public.tax_records
  FOR SELECT USING (
    auth.uid() = user_id
    OR (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "tax_records_insert" ON public.tax_records
  FOR INSERT WITH CHECK (
    (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- commissions
ALTER TABLE IF EXISTS public.commissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "commissions_select" ON public.commissions;
DROP POLICY IF EXISTS "commissions_update" ON public.commissions;

CREATE POLICY "commissions_select" ON public.commissions
  FOR SELECT USING (
    auth.uid() = ambassador_id
    OR public.is_platform_admin()
  );

CREATE POLICY "commissions_update" ON public.commissions
  FOR UPDATE USING (public.is_platform_admin());

-- settlements
ALTER TABLE IF EXISTS public.settlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settlements_select" ON public.settlements;

CREATE POLICY "settlements_select" ON public.settlements
  FOR SELECT USING (
    (organization_id IS NOT NULL AND public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- billing (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'billing') THEN
    EXECUTE 'ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "billing_select" ON public.billing';
    EXECUTE 'DROP POLICY IF EXISTS "billing_insert" ON public.billing';
    EXECUTE $policy$
      CREATE POLICY "billing_select" ON public.billing
        FOR SELECT USING (
          auth.uid() = patient_id
          OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin'))
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "billing_insert" ON public.billing
        FOR INSERT WITH CHECK (
          public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'platform_admin')
        )
    $policy$;
  END IF;
END $$;

-- ============================================================
-- USER PROFILES — Ensure RLS is active
-- ============================================================
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_all" ON public.user_profiles;

CREATE POLICY "user_profiles_select_own" ON public.user_profiles
  FOR SELECT USING (
    auth.uid() = id
    OR public.is_platform_admin()
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
  );

CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_platform_admin());

CREATE POLICY "user_profiles_admin_all" ON public.user_profiles
  FOR ALL USING (public.is_platform_admin());

-- ============================================================
-- ORGANIZATIONS — Ensure RLS is active
-- ============================================================
ALTER TABLE IF EXISTS public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "organizations_select" ON public.organizations;
DROP POLICY IF EXISTS "organizations_update" ON public.organizations;

CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (
    public.belongs_to_org(id)
    OR public.is_platform_admin()
  );

CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE USING (
    (public.belongs_to_org(id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );

-- ============================================================
-- PROFESSIONALS — Ensure RLS is active
-- ============================================================
ALTER TABLE IF EXISTS public.professionals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "professionals_select" ON public.professionals;
DROP POLICY IF EXISTS "professionals_update_own" ON public.professionals;

CREATE POLICY "professionals_select" ON public.professionals
  FOR SELECT USING (
    auth.uid() = user_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
    -- Allow patients to see basic professional info for booking
    OR public.user_role() = 'patient'
  );

CREATE POLICY "professionals_update_own" ON public.professionals
  FOR UPDATE USING (
    auth.uid() = user_id
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin())
    OR public.is_platform_admin()
  );
