-- ============================================================
-- SHIFA HEALTH OS — Phase 3A: Security Hardening
-- Financial Tables RLS, Super Admin Guard, Data Isolation
-- Migration: 20260814000000_phase3_security_financial_rls.sql
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS (idempotent)
-- ============================================================

-- Check if current user is platform_admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'platform_admin'
  );
$$;

-- Check if current user is org_admin or platform_admin
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('org_admin', 'platform_admin')
  );
$$;

-- Get current user's organization_id (via professionals table)
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT po.organization_id
  FROM public.professionals p
  JOIN public.professional_organizations po ON po.professional_id = p.id
  WHERE p.user_id = auth.uid()
    AND po.is_primary = true
  LIMIT 1;
$$;

-- Get current user's role
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- ============================================================
-- FINANCIAL TABLES — Enable RLS + Policies
-- ============================================================

-- ── subscriptions ──────────────────────────────────────────
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

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
    AND organization_id = public.user_org_id()
    AND public.user_role() IN ('org_admin', 'professional')
  );

CREATE POLICY "subscriptions_select_admin" ON public.subscriptions
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "subscriptions_insert" ON public.subscriptions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_update" ON public.subscriptions
  FOR UPDATE USING (
    user_id = auth.uid()
    OR (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "subscriptions_delete" ON public.subscriptions
  FOR DELETE USING (public.is_platform_admin());

-- ── payments ───────────────────────────────────────────────
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;

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
    AND organization_id = public.user_org_id()
    AND public.user_role() IN ('org_admin', 'professional')
  );

CREATE POLICY "payments_select_admin" ON public.payments
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "payments_update" ON public.payments
  FOR UPDATE USING (
    (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "payments_delete" ON public.payments
  FOR DELETE USING (public.is_platform_admin());

-- ── invoices ───────────────────────────────────────────────
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;

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
    AND organization_id = public.user_org_id()
    AND public.user_role() IN ('org_admin', 'professional')
  );

CREATE POLICY "invoices_select_admin" ON public.invoices
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_update" ON public.invoices
  FOR UPDATE USING (
    (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "invoices_delete" ON public.invoices
  FOR DELETE USING (public.is_platform_admin());

-- ── tax_records ────────────────────────────────────────────
ALTER TABLE IF EXISTS public.tax_records ENABLE ROW LEVEL SECURITY;

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
    AND organization_id = public.user_org_id()
    AND public.is_org_admin()
  );

CREATE POLICY "tax_records_select_admin" ON public.tax_records
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "tax_records_insert" ON public.tax_records
  FOR INSERT WITH CHECK (
    (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "tax_records_update" ON public.tax_records
  FOR UPDATE USING (
    (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "tax_records_delete" ON public.tax_records
  FOR DELETE USING (public.is_platform_admin());

-- ── commissions ────────────────────────────────────────────
ALTER TABLE IF EXISTS public.commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "commissions_select_own" ON public.commissions;
DROP POLICY IF EXISTS "commissions_select_admin" ON public.commissions;
DROP POLICY IF EXISTS "commissions_insert" ON public.commissions;
DROP POLICY IF EXISTS "commissions_update" ON public.commissions;
DROP POLICY IF EXISTS "commissions_delete" ON public.commissions;

-- Ambassadors see only their own commissions
CREATE POLICY "commissions_select_own" ON public.commissions
  FOR SELECT USING (ambassador_id = auth.uid());

CREATE POLICY "commissions_select_admin" ON public.commissions
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "commissions_insert" ON public.commissions
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "commissions_update" ON public.commissions
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "commissions_delete" ON public.commissions
  FOR DELETE USING (public.is_platform_admin());

-- ── settlements ────────────────────────────────────────────
ALTER TABLE IF EXISTS public.settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settlements_select_org" ON public.settlements;
DROP POLICY IF EXISTS "settlements_select_admin" ON public.settlements;
DROP POLICY IF EXISTS "settlements_insert" ON public.settlements;
DROP POLICY IF EXISTS "settlements_update" ON public.settlements;
DROP POLICY IF EXISTS "settlements_delete" ON public.settlements;

CREATE POLICY "settlements_select_org" ON public.settlements
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND organization_id = public.user_org_id()
    AND public.is_org_admin()
  );

CREATE POLICY "settlements_select_admin" ON public.settlements
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "settlements_insert" ON public.settlements
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "settlements_update" ON public.settlements
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "settlements_delete" ON public.settlements
  FOR DELETE USING (public.is_platform_admin());

-- ── api_billing_records ────────────────────────────────────
ALTER TABLE IF EXISTS public.api_billing_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "api_billing_select_org" ON public.api_billing_records;
DROP POLICY IF EXISTS "api_billing_select_admin" ON public.api_billing_records;
DROP POLICY IF EXISTS "api_billing_insert" ON public.api_billing_records;
DROP POLICY IF EXISTS "api_billing_update" ON public.api_billing_records;
DROP POLICY IF EXISTS "api_billing_delete" ON public.api_billing_records;

CREATE POLICY "api_billing_select_org" ON public.api_billing_records
  FOR SELECT USING (
    organization_id IS NOT NULL
    AND organization_id = public.user_org_id()
    AND public.is_org_admin()
  );

CREATE POLICY "api_billing_select_admin" ON public.api_billing_records
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "api_billing_insert" ON public.api_billing_records
  FOR INSERT WITH CHECK (
    (organization_id = public.user_org_id() AND public.is_org_admin())
    OR public.is_platform_admin()
  );

CREATE POLICY "api_billing_update" ON public.api_billing_records
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "api_billing_delete" ON public.api_billing_records
  FOR DELETE USING (public.is_platform_admin());

-- ── financial_notifications ────────────────────────────────
ALTER TABLE IF EXISTS public.financial_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fin_notif_select_own" ON public.financial_notifications;
DROP POLICY IF EXISTS "fin_notif_select_admin" ON public.financial_notifications;
DROP POLICY IF EXISTS "fin_notif_insert" ON public.financial_notifications;
DROP POLICY IF EXISTS "fin_notif_update" ON public.financial_notifications;
DROP POLICY IF EXISTS "fin_notif_delete" ON public.financial_notifications;

CREATE POLICY "fin_notif_select_own" ON public.financial_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "fin_notif_select_admin" ON public.financial_notifications
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "fin_notif_insert" ON public.financial_notifications
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR public.is_platform_admin()
  );

CREATE POLICY "fin_notif_update" ON public.financial_notifications
  FOR UPDATE USING (user_id = auth.uid() OR public.is_platform_admin());

CREATE POLICY "fin_notif_delete" ON public.financial_notifications
  FOR DELETE USING (public.is_platform_admin());

-- ── ambassador_payouts ─────────────────────────────────────
ALTER TABLE IF EXISTS public.ambassador_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "amb_payouts_select_own" ON public.ambassador_payouts;
DROP POLICY IF EXISTS "amb_payouts_select_admin" ON public.ambassador_payouts;
DROP POLICY IF EXISTS "amb_payouts_insert" ON public.ambassador_payouts;
DROP POLICY IF EXISTS "amb_payouts_update" ON public.ambassador_payouts;
DROP POLICY IF EXISTS "amb_payouts_delete" ON public.ambassador_payouts;

CREATE POLICY "amb_payouts_select_own" ON public.ambassador_payouts
  FOR SELECT USING (ambassador_id = auth.uid());

CREATE POLICY "amb_payouts_select_admin" ON public.ambassador_payouts
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "amb_payouts_insert" ON public.ambassador_payouts
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "amb_payouts_update" ON public.ambassador_payouts
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "amb_payouts_delete" ON public.ambassador_payouts
  FOR DELETE USING (public.is_platform_admin());

-- ── marketplace_settlements ────────────────────────────────
ALTER TABLE IF EXISTS public.marketplace_settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mkt_settle_select_vendor" ON public.marketplace_settlements;
DROP POLICY IF EXISTS "mkt_settle_select_admin" ON public.marketplace_settlements;
DROP POLICY IF EXISTS "mkt_settle_insert" ON public.marketplace_settlements;
DROP POLICY IF EXISTS "mkt_settle_update" ON public.marketplace_settlements;
DROP POLICY IF EXISTS "mkt_settle_delete" ON public.marketplace_settlements;

CREATE POLICY "mkt_settle_select_vendor" ON public.marketplace_settlements
  FOR SELECT USING (
    vendor_id = auth.uid()
    OR (organization_id IS NOT NULL AND organization_id = public.user_org_id() AND public.is_org_admin())
  );

CREATE POLICY "mkt_settle_select_admin" ON public.marketplace_settlements
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "mkt_settle_insert" ON public.marketplace_settlements
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "mkt_settle_update" ON public.marketplace_settlements
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "mkt_settle_delete" ON public.marketplace_settlements
  FOR DELETE USING (public.is_platform_admin());

-- ── revenue_reconciliations ────────────────────────────────
ALTER TABLE IF EXISTS public.revenue_reconciliations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rev_recon_select_admin" ON public.revenue_reconciliations;
DROP POLICY IF EXISTS "rev_recon_insert" ON public.revenue_reconciliations;
DROP POLICY IF EXISTS "rev_recon_update" ON public.revenue_reconciliations;
DROP POLICY IF EXISTS "rev_recon_delete" ON public.revenue_reconciliations;

CREATE POLICY "rev_recon_select_admin" ON public.revenue_reconciliations
  FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "rev_recon_insert" ON public.revenue_reconciliations
  FOR INSERT WITH CHECK (public.is_platform_admin());

CREATE POLICY "rev_recon_update" ON public.revenue_reconciliations
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "rev_recon_delete" ON public.revenue_reconciliations
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- AUDIT LOG TABLE — Ensure RLS
-- ============================================================
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_update" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_delete" ON public.audit_logs;

CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT USING (
    public.is_platform_admin()
    OR (public.is_org_admin() AND organization_id = public.user_org_id())
  );

CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Audit logs are immutable — no UPDATE or DELETE for non-admins
CREATE POLICY "audit_logs_update" ON public.audit_logs
  FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "audit_logs_delete" ON public.audit_logs
  FOR DELETE USING (public.is_platform_admin());

-- ============================================================
-- SECURITY: Revoke direct function access from public
-- ============================================================
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_org_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_org_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_role() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_role() TO authenticated;
