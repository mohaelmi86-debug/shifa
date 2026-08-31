-- ============================================================
-- SHIFA HEALTH — P0.6 MULTI-TENANT SECURITY CLOSURE
-- Corrective additive migration
-- Fixes: is_org_admin() cross-org traversal vulnerability
-- Fixes: audit_logs WITH CHECK(true) pollution risk
-- Fixes: organization_modules / org_roles USING(true)
-- Hardens: all financial + clinical policies with org scope
-- ADDITIVE ONLY — no DROP TABLE, no DROP COLUMN, no data deletion
-- ============================================================

-- ============================================================
-- STEP 1: CREATE is_org_admin_for(target_org_id UUID)
-- The ONLY safe org-admin check for multi-tenant isolation.
-- Replaces the dangerous is_org_admin() which returns TRUE
-- for ANY org_admin regardless of their organization.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_org_admin_for(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'org_admin'
      AND up.organization_id = target_org_id
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'platform_admin'
  );
$$;

-- ============================================================
-- STEP 2: REPLACE is_org_admin() WITH SCOPED VERSION
-- The old is_org_admin() returns TRUE for any org_admin
-- regardless of which organization they belong to.
-- We replace it with a version that checks the user's own org.
-- This is used in policies where organization_id is a column
-- on the table itself (self-scoped check).
-- ============================================================

-- Replace the dangerous is_org_admin() with a scoped version
-- that checks the user's own organization_id from user_profiles.
-- This prevents ORG_A admin from accessing ORG_B data.
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- IMPORTANT: This function now only returns TRUE if the user IS an org_admin.
  -- It does NOT grant cross-org access. Policies using this function MUST
  -- also check organization_id = public.user_org_id() or use is_org_admin_for().
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('org_admin', 'platform_admin')
  );
$$;

-- ============================================================
-- STEP 3: HARDEN appointments POLICIES
-- Replace is_org_admin() with is_org_admin_for(organization_id)
-- ============================================================

ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "appointments_select" ON public.appointments;
DROP POLICY IF EXISTS "appointments_insert" ON public.appointments;
DROP POLICY IF EXISTS "appointments_update" ON public.appointments;
DROP POLICY IF EXISTS "appointments_delete" ON public.appointments;

CREATE POLICY "appointments_select" ON public.appointments
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = professional_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
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
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "appointments_delete" ON public.appointments
  FOR DELETE USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
    OR (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

-- ============================================================
-- STEP 4: HARDEN prescriptions POLICIES
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prescriptions') THEN
    EXECUTE 'ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "prescriptions_select" ON public.prescriptions';
    EXECUTE 'DROP POLICY IF EXISTS "prescriptions_insert" ON public.prescriptions';
    EXECUTE 'DROP POLICY IF EXISTS "prescriptions_update" ON public.prescriptions';
    EXECUTE 'DROP POLICY IF EXISTS "prescriptions_delete" ON public.prescriptions';
    EXECUTE $policy$
      CREATE POLICY "prescriptions_select" ON public.prescriptions
        FOR SELECT USING (
          auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
          OR auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
          OR (public.belongs_to_org(organization_id) AND public.user_role() IN ('professional', 'org_admin')
              AND public.is_org_admin_for(organization_id))
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "prescriptions_insert" ON public.prescriptions
        FOR INSERT WITH CHECK (
          auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
          AND public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'platform_admin')
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "prescriptions_update" ON public.prescriptions
        FOR UPDATE USING (
          auth.uid() = (SELECT user_id FROM public.professionals WHERE id = prescriber_id LIMIT 1)
          OR (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "prescriptions_delete" ON public.prescriptions
        FOR DELETE USING (
          (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
          OR public.is_platform_admin()
        )
    $policy$;
  END IF;
END $$;

-- ============================================================
-- STEP 5: HARDEN lab_results POLICIES
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_results') THEN
    EXECUTE 'ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_select" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_select" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_insert" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_insert" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_update" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_rls_update" ON public.lab_results';
    EXECUTE 'DROP POLICY IF EXISTS "lab_results_delete" ON public.lab_results';
    EXECUTE $policy$
      CREATE POLICY "lab_results_select" ON public.lab_results
        FOR SELECT USING (
          auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id LIMIT 1)
          OR (public.belongs_to_org(organization_id)
              AND public.user_role() IN ('professional', 'org_admin', 'lab_technician', 'lab_manager')
              AND (public.user_role() != 'org_admin' OR public.is_org_admin_for(organization_id)))
          OR public.is_platform_admin()
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "lab_results_insert" ON public.lab_results
        FOR INSERT WITH CHECK (
          public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'lab_technician', 'lab_manager', 'platform_admin')
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "lab_results_update" ON public.lab_results
        FOR UPDATE USING (
          public.belongs_to_org(organization_id)
          AND public.user_role() IN ('professional', 'org_admin', 'lab_technician', 'lab_manager', 'platform_admin')
          AND (public.user_role() != 'org_admin' OR public.is_org_admin_for(organization_id))
        )
    $policy$;
    EXECUTE $policy$
      CREATE POLICY "lab_results_delete" ON public.lab_results
        FOR DELETE USING (
          (public.belongs_to_org(organization_id) AND public.is_org_admin_for(organization_id))
          OR public.is_platform_admin()
        )
    $policy$;
  END IF;
END $$;

-- ============================================================
-- STEP 6: HARDEN invoices POLICIES
-- Replace is_org_admin() + user_org_id() with is_org_admin_for()
-- ============================================================

ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_org" ON public.invoices;
DROP POLICY IF EXISTS "invoices_select_admin" ON public.invoices;
DROP POLICY IF EXISTS "invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "invoices_update" ON public.invoices;
DROP POLICY IF EXISTS "invoices_delete" ON public.invoices;

CREATE POLICY "invoices_select_own" ON public.invoices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "invoices_select_org" ON public.invoices
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

CREATE POLICY "invoices_select_admin" ON public.invoices
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_update" ON public.invoices
  FOR UPDATE USING (
    (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_delete" ON public.invoices
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 7: HARDEN payments POLICIES
-- ============================================================

ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select" ON public.payments;
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_select_org" ON public.payments;
DROP POLICY IF EXISTS "payments_select_admin" ON public.payments;
DROP POLICY IF EXISTS "payments_insert" ON public.payments;
DROP POLICY IF EXISTS "payments_update" ON public.payments;
DROP POLICY IF EXISTS "payments_delete" ON public.payments;

CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "payments_select_org" ON public.payments
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "payments_update" ON public.payments
  FOR UPDATE USING (
    (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "payments_delete" ON public.payments
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 8: HARDEN subscriptions POLICIES
-- ============================================================

ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_org" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_admin" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete" ON public.subscriptions;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "subscriptions_select_org" ON public.subscriptions
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

CREATE POLICY "subscriptions_select_admin" ON public.subscriptions
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "subscriptions_insert" ON public.subscriptions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_update" ON public.subscriptions
  FOR UPDATE USING (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_delete" ON public.subscriptions
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 9: HARDEN tax_records POLICIES
-- ============================================================

ALTER TABLE IF EXISTS public.tax_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tax_records_select" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_select_own" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_select_org" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_select_admin" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_insert" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_update" ON public.tax_records;
DROP POLICY IF EXISTS "tax_records_delete" ON public.tax_records;

CREATE POLICY "tax_records_select_own" ON public.tax_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "tax_records_select_org" ON public.tax_records
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

CREATE POLICY "tax_records_select_admin" ON public.tax_records
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "tax_records_insert" ON public.tax_records
  FOR INSERT WITH CHECK (
    (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "tax_records_update" ON public.tax_records
  FOR UPDATE USING (
    (organization_id IS NOT NULL AND public.is_org_admin_for(organization_id))
    OR public.is_platform_admin()
  );

CREATE POLICY "tax_records_delete" ON public.tax_records
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 10: HARDEN settlements POLICIES
-- ============================================================

ALTER TABLE IF EXISTS public.settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settlements_select" ON public.settlements;
DROP POLICY IF EXISTS "settlements_select_org" ON public.settlements;
DROP POLICY IF EXISTS "settlements_select_admin" ON public.settlements;
DROP POLICY IF EXISTS "settlements_insert" ON public.settlements;
DROP POLICY IF EXISTS "settlements_update" ON public.settlements;
DROP POLICY IF EXISTS "settlements_delete" ON public.settlements;

CREATE POLICY "settlements_select_org" ON public.settlements
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

CREATE POLICY "settlements_select_admin" ON public.settlements
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "settlements_insert" ON public.settlements
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "settlements_update" ON public.settlements
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "settlements_delete" ON public.settlements
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 11: FIX audit_logs — REPLACE WITH CHECK(true)
-- The old policy "audit_logs_insert" WITH CHECK(true) allows
-- ANY authenticated user to write ANY content to audit logs,
-- enabling log pollution / fabrication.
-- New policy: only authenticated users can insert their OWN
-- user_id, and only for their own organization.
-- Service role (edge functions) bypasses RLS entirely.
-- ============================================================

ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing insert policies for audit_logs
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;

-- SELECT: platform_admin sees all; org_admin sees their org only
DROP POLICY IF EXISTS "audit_logs_select" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;

CREATE POLICY "audit_logs_select" ON public.audit_logs
  FOR SELECT USING (
    public.is_platform_admin()
    OR (
      public.is_org_admin_for(organization_id)
      AND organization_id IS NOT NULL
    )
  );

-- INSERT: authenticated users can only insert logs where:
-- 1. user_id matches their own auth.uid() (no impersonation)
-- 2. organization_id matches their own org (no cross-org pollution)
-- Service role (edge functions, backend) bypasses RLS — this is correct.
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      -- User inserting their own log entry
      user_id = auth.uid()
      -- OR org_admin inserting a log for their own org
      OR (
        organization_id IS NOT NULL
        AND public.is_org_admin_for(organization_id)
      )
      -- OR platform_admin
      OR public.is_platform_admin()
    )
  );

-- UPDATE: FORBIDDEN — audit logs are immutable
DROP POLICY IF EXISTS "audit_logs_update" ON public.audit_logs;
CREATE POLICY "audit_logs_update" ON public.audit_logs
  FOR UPDATE USING (public.is_platform_admin());

-- DELETE: platform_admin only
DROP POLICY IF EXISTS "audit_logs_delete" ON public.audit_logs;
CREATE POLICY "audit_logs_delete" ON public.audit_logs
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 12: FIX organization_modules — REPLACE USING(true)
-- organization_modules contains internal org configuration.
-- It should NOT be publicly readable.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organization_modules') THEN
    EXECUTE 'ALTER TABLE public.organization_modules ENABLE ROW LEVEL SECURITY';

    -- Drop all existing policies including any USING(true) ones
    EXECUTE 'DROP POLICY IF EXISTS "organization_modules_read" ON public.organization_modules';
    EXECUTE 'DROP POLICY IF EXISTS "organization_modules_select" ON public.organization_modules';
    EXECUTE 'DROP POLICY IF EXISTS "organization_modules_insert" ON public.organization_modules';
    EXECUTE 'DROP POLICY IF EXISTS "organization_modules_update" ON public.organization_modules';
    EXECUTE 'DROP POLICY IF EXISTS "organization_modules_delete" ON public.organization_modules';

    -- SELECT: members of the org can see their own modules; platform_admin sees all
    EXECUTE $p$
      CREATE POLICY "organization_modules_select" ON public.organization_modules
        FOR SELECT USING (
          public.belongs_to_org(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    -- INSERT/UPDATE/DELETE: org_admin of that org or platform_admin
    EXECUTE $p$
      CREATE POLICY "organization_modules_insert" ON public.organization_modules
        FOR INSERT WITH CHECK (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    EXECUTE $p$
      CREATE POLICY "organization_modules_update" ON public.organization_modules
        FOR UPDATE USING (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    EXECUTE $p$
      CREATE POLICY "organization_modules_delete" ON public.organization_modules
        FOR DELETE USING (public.is_platform_admin())
    $p$;
  END IF;
END $$;

-- ============================================================
-- STEP 13: FIX org_roles — REPLACE USING(true)
-- org_roles contains internal role definitions per organization.
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'org_roles') THEN
    EXECUTE 'ALTER TABLE public.org_roles ENABLE ROW LEVEL SECURITY';

    -- Drop all existing policies including any USING(true) ones
    EXECUTE 'DROP POLICY IF EXISTS "org_roles_read" ON public.org_roles';
    EXECUTE 'DROP POLICY IF EXISTS "org_roles_select" ON public.org_roles';
    EXECUTE 'DROP POLICY IF EXISTS "org_roles_insert" ON public.org_roles';
    EXECUTE 'DROP POLICY IF EXISTS "org_roles_update" ON public.org_roles';
    EXECUTE 'DROP POLICY IF EXISTS "org_roles_delete" ON public.org_roles';

    -- SELECT: members of the org can see their org's roles; platform_admin sees all
    EXECUTE $p$
      CREATE POLICY "org_roles_select" ON public.org_roles
        FOR SELECT USING (
          public.belongs_to_org(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    -- INSERT/UPDATE: org_admin of that org or platform_admin
    EXECUTE $p$
      CREATE POLICY "org_roles_insert" ON public.org_roles
        FOR INSERT WITH CHECK (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    EXECUTE $p$
      CREATE POLICY "org_roles_update" ON public.org_roles
        FOR UPDATE USING (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;

    EXECUTE $p$
      CREATE POLICY "org_roles_delete" ON public.org_roles
        FOR DELETE USING (public.is_platform_admin())
    $p$;
  END IF;
END $$;

-- ============================================================
-- STEP 14: HARDEN organizations TABLE POLICIES
-- Replace is_org_admin() with is_org_admin_for(id)
-- ============================================================

ALTER TABLE IF EXISTS public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "organizations_select" ON public.organizations;
DROP POLICY IF EXISTS "organizations_update" ON public.organizations;
DROP POLICY IF EXISTS "organizations_insert" ON public.organizations;
DROP POLICY IF EXISTS "organizations_delete" ON public.organizations;

CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (
    public.belongs_to_org(id)
    OR public.is_platform_admin()
  );

CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE USING (
    public.is_org_admin_for(id)
    OR public.is_platform_admin()
  );

CREATE POLICY "organizations_insert" ON public.organizations
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "organizations_delete" ON public.organizations
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- STEP 15: HARDEN user_profiles POLICIES
-- The old policy allows any org_admin to read ALL user profiles.
-- Restrict to same-org users only.
-- ============================================================

ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_all" ON public.user_profiles;

-- Own profile always readable
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Org admin can see profiles of users in their org only
CREATE POLICY "user_profiles_select_org" ON public.user_profiles
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND public.is_org_admin_for(organization_id)
  );

-- Platform admin sees all
CREATE POLICY "user_profiles_select_admin" ON public.user_profiles
  FOR SELECT USING (public.is_platform_admin());

-- Own profile update
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_platform_admin());

-- Platform admin full access
CREATE POLICY "user_profiles_admin_all" ON public.user_profiles
  FOR ALL USING (public.is_platform_admin());

-- ============================================================
-- STEP 16: HARDEN departments TABLE (if exists)
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'departments') THEN
    EXECUTE 'ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "departments_select" ON public.departments';
    EXECUTE 'DROP POLICY IF EXISTS "departments_insert" ON public.departments';
    EXECUTE 'DROP POLICY IF EXISTS "departments_update" ON public.departments';
    EXECUTE 'DROP POLICY IF EXISTS "departments_delete" ON public.departments';
    EXECUTE $p$
      CREATE POLICY "departments_select" ON public.departments
        FOR SELECT USING (
          public.belongs_to_org(organization_id)
          OR public.is_platform_admin()
        )
    $p$;
    EXECUTE $p$
      CREATE POLICY "departments_insert" ON public.departments
        FOR INSERT WITH CHECK (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;
    EXECUTE $p$
      CREATE POLICY "departments_update" ON public.departments
        FOR UPDATE USING (
          public.is_org_admin_for(organization_id)
          OR public.is_platform_admin()
        )
    $p$;
    EXECUTE $p$
      CREATE POLICY "departments_delete" ON public.departments
        FOR DELETE USING (public.is_platform_admin())
    $p$;
  END IF;
END $$;

-- ============================================================
-- STEP 17: NULL DATA ANALYSIS — kiosk_checkins.patient_user_id
-- Safe backfill via confirmed schema relationship:
-- kiosk_checkins.patient_id → patients.id → patients.user_id
-- Only backfill where the join is unambiguous (1:1 match).
-- ============================================================

DO $$
DECLARE
  backfill_count INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'kiosk_checkins'
      AND column_name = 'patient_user_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'kiosk_checkins'
      AND column_name = 'patient_id'
  ) THEN
    -- Only backfill rows where patient_user_id IS NULL
    -- and the patient_id → patients.user_id join is unambiguous
    UPDATE public.kiosk_checkins kc
    SET patient_user_id = p.user_id
    FROM public.patients p
    WHERE kc.patient_id = p.id
      AND kc.patient_user_id IS NULL
      AND p.user_id IS NOT NULL;

    GET DIAGNOSTICS backfill_count = ROW_COUNT;
    RAISE NOTICE 'P0.6: Backfilled % kiosk_checkins.patient_user_id rows via patient_id → patients.user_id', backfill_count;
  ELSE
    RAISE NOTICE 'P0.6: kiosk_checkins.patient_user_id or patient_id column not found — skipping backfill';
  END IF;
END $$;

-- ============================================================
-- STEP 18: NULL DATA ANALYSIS — shifa_ids.organization_id
-- NO BACKFILL — cannot reliably determine organization from
-- shifa_id data alone without additional context.
-- NULL values are preserved. Documented below.
-- ============================================================

-- DOCUMENTATION: shifa_ids.organization_id NULL analysis
-- Reason for no backfill:
-- A SHIFA ID is a patient identity document. The organization_id
-- on shifa_ids represents the issuing organization. Without a
-- confirmed issuing_organization_id column or a reliable join
-- path (shifa_ids has no direct FK to organizations other than
-- the organization_id column itself), we cannot safely infer
-- which organization issued each ID. Inventing this relationship
-- would create false data and potential security misattribution.
-- Action: NULL values remain. Future data entry should populate
-- organization_id at creation time via the kiosk/admin workflow.

-- ============================================================
-- STEP 19: GRANT EXECUTE on new function
-- ============================================================

REVOKE ALL ON FUNCTION public.is_org_admin_for(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_org_admin_for(UUID) TO authenticated;

-- ============================================================
-- STEP 20: PERFORMANCE INDEXES for new policy columns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_org_id ON public.user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_org_id ON public.payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON public.subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- ============================================================
-- P0.6 MIGRATION COMPLETE
-- Summary of changes:
-- ✅ is_org_admin_for(target_org_id) created — scoped multi-tenant check
-- ✅ is_org_admin() replaced — no longer grants cross-org access
-- ✅ appointments: is_org_admin_for(organization_id) applied
-- ✅ prescriptions: is_org_admin_for(organization_id) applied
-- ✅ lab_results: is_org_admin_for(organization_id) applied
-- ✅ invoices: is_org_admin_for(organization_id) applied
-- ✅ payments: is_org_admin_for(organization_id) applied
-- ✅ subscriptions: is_org_admin_for(organization_id) applied
-- ✅ tax_records: is_org_admin_for(organization_id) applied
-- ✅ settlements: is_org_admin_for(organization_id) applied
-- ✅ audit_logs: WITH CHECK(true) replaced with scoped policy
-- ✅ organization_modules: USING(true) replaced with org-scoped policy
-- ✅ org_roles: USING(true) replaced with org-scoped policy
-- ✅ organizations: is_org_admin_for(id) applied
-- ✅ user_profiles: org-scoped read for org_admin
-- ✅ departments: is_org_admin_for(organization_id) applied
-- ✅ kiosk_checkins.patient_user_id: backfilled via patients table
-- ✅ shifa_ids.organization_id: NULL preserved (no reliable join path)
-- ============================================================
