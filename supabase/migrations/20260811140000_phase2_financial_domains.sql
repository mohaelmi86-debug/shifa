-- ============================================================
-- SHIFA HEALTH OS — Phase 2 Financial Domains
-- Subscriptions, Payments, Invoices, Taxes, Commissions,
-- Settlements, API Billing, Card Delivery, Insurance Claims,
-- Ambassador Payouts, Marketplace Settlement, Revenue Reconciliation
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================

DROP TYPE IF EXISTS public.subscription_status CASCADE;
CREATE TYPE public.subscription_status AS ENUM ('active', 'trialing', 'past_due', 'cancelled', 'paused', 'expired');

DROP TYPE IF EXISTS public.subscription_plan CASCADE;
CREATE TYPE public.subscription_plan AS ENUM ('free', 'starter', 'pro', 'enterprise', 'institution', 'ambassador');

DROP TYPE IF EXISTS public.payment_status CASCADE;
CREATE TYPE public.payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed', 'cancelled');

DROP TYPE IF EXISTS public.payment_method CASCADE;
CREATE TYPE public.payment_method AS ENUM ('card', 'mobile_money', 'bank_transfer', 'wallet', 'insurance', 'cash', 'crypto');

DROP TYPE IF EXISTS public.invoice_status CASCADE;
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'disputed');

DROP TYPE IF EXISTS public.commission_status CASCADE;
CREATE TYPE public.commission_status AS ENUM ('pending', 'approved', 'paid', 'cancelled', 'disputed');

DROP TYPE IF EXISTS public.settlement_status CASCADE;
CREATE TYPE public.settlement_status AS ENUM ('pending', 'processing', 'settled', 'failed', 'on_hold');

DROP TYPE IF EXISTS public.financial_notification_type CASCADE;
CREATE TYPE public.financial_notification_type AS ENUM (
  'payment_received', 'payment_failed', 'payment_refunded',
  'subscription_activated', 'subscription_cancelled', 'subscription_renewed', 'subscription_expiring',
  'invoice_created', 'invoice_paid', 'invoice_overdue',
  'commission_earned', 'commission_paid',
  'settlement_completed', 'settlement_failed',
  'tax_due', 'tax_paid',
  'payout_processed', 'payout_failed'
);

-- ============================================================
-- 2. DOMAIN 1: SUBSCRIPTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  plan public.subscription_plan NOT NULL DEFAULT 'free'::public.subscription_plan,
  status public.subscription_status NOT NULL DEFAULT 'active'::public.subscription_status,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 month'),
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. DOMAIN 2: PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_method public.payment_method NOT NULL DEFAULT 'card'::public.payment_method,
  status public.payment_status NOT NULL DEFAULT 'pending'::public.payment_status,
  provider TEXT,
  provider_transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. DOMAIN 3: INVOICES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  status public.invoice_status NOT NULL DEFAULT 'draft'::public.invoice_status,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  line_items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. DOMAIN 4: TAXES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.tax_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  tax_type TEXT NOT NULL DEFAULT 'VAT',
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  taxable_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  country_code TEXT NOT NULL DEFAULT 'SN',
  period_start DATE,
  period_end DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  filed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. DOMAIN 5: COMMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  referred_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  referred_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  commission_type TEXT NOT NULL DEFAULT 'referral',
  rate NUMERIC NOT NULL DEFAULT 0,
  base_amount NUMERIC NOT NULL DEFAULT 0,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status public.commission_status NOT NULL DEFAULT 'pending'::public.commission_status,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payout_reference TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. DOMAIN 6: SETTLEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  settlement_type TEXT NOT NULL DEFAULT 'marketplace',
  gross_amount NUMERIC NOT NULL DEFAULT 0,
  platform_fee NUMERIC NOT NULL DEFAULT 0,
  tax_withheld NUMERIC NOT NULL DEFAULT 0,
  net_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status public.settlement_status NOT NULL DEFAULT 'pending'::public.settlement_status,
  period_start DATE,
  period_end DATE,
  transaction_count INTEGER DEFAULT 0,
  bank_account JSONB DEFAULT '{}'::jsonb,
  settled_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. DOMAIN 7: API BILLING
-- ============================================================

CREATE TABLE IF NOT EXISTS public.api_billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  api_key_id TEXT,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  billable_units INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  invoiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. DOMAIN 8: CARD DELIVERY
-- ============================================================

CREATE TABLE IF NOT EXISTS public.card_delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  card_type TEXT NOT NULL DEFAULT 'standard',
  delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_fee NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  estimated_delivery DATE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. DOMAIN 9: INSURANCE CLAIMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  insurer_name TEXT NOT NULL,
  policy_number TEXT,
  claim_number TEXT UNIQUE,
  service_date DATE,
  claimed_amount NUMERIC NOT NULL DEFAULT 0,
  approved_amount NUMERIC,
  reimbursed_amount NUMERIC,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMPTZ,
  reimbursed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. DOMAIN 10: AMBASSADOR PAYOUTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ambassador_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_commissions NUMERIC NOT NULL DEFAULT 0,
  total_bonuses NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  net_payout NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status public.settlement_status NOT NULL DEFAULT 'pending'::public.settlement_status,
  payment_method TEXT DEFAULT 'mobile_money',
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 12. DOMAIN 11: MARKETPLACE SETTLEMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketplace_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sales NUMERIC NOT NULL DEFAULT 0,
  platform_commission NUMERIC NOT NULL DEFAULT 0,
  tax_withheld NUMERIC NOT NULL DEFAULT 0,
  net_settlement NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  order_count INTEGER DEFAULT 0,
  status public.settlement_status NOT NULL DEFAULT 'pending'::public.settlement_status,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 13. DOMAIN 12: REVENUE RECONCILIATION
-- ============================================================

CREATE TABLE IF NOT EXISTS public.revenue_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  subscription_revenue NUMERIC NOT NULL DEFAULT 0,
  payment_revenue NUMERIC NOT NULL DEFAULT 0,
  marketplace_revenue NUMERIC NOT NULL DEFAULT 0,
  api_revenue NUMERIC NOT NULL DEFAULT 0,
  other_revenue NUMERIC NOT NULL DEFAULT 0,
  total_refunds NUMERIC NOT NULL DEFAULT 0,
  total_commissions_paid NUMERIC NOT NULL DEFAULT 0,
  total_taxes_collected NUMERIC NOT NULL DEFAULT 0,
  net_revenue NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'XOF',
  status TEXT NOT NULL DEFAULT 'draft',
  reconciled_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reconciled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. FINANCIAL NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.financial_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  notification_type public.financial_notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  amount NUMERIC,
  currency TEXT DEFAULT 'XOF',
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON public.subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_tax_records_org_id ON public.tax_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_commissions_ambassador_id ON public.commissions(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_settlements_org_id ON public.settlements(organization_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON public.settlements(status);
CREATE INDEX IF NOT EXISTS idx_financial_notifications_user_id ON public.financial_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_notifications_is_read ON public.financial_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_financial_notifications_created_at ON public.financial_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ambassador_payouts_ambassador_id ON public.ambassador_payouts(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_settlements_seller_id ON public.marketplace_settlements(seller_organization_id);
CREATE INDEX IF NOT EXISTS idx_revenue_reconciliation_period ON public.revenue_reconciliation(period_start, period_end);

-- ============================================================
-- 16. HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_platform_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE id = auth.uid() AND role = 'platform_admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE id = auth.uid() AND role IN ('platform_admin'::public.user_role, 'org_admin'::public.user_role)
)
$$;

-- ============================================================
-- 17. ENABLE RLS
-- ============================================================

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 18. RLS POLICIES
-- ============================================================

-- Subscriptions
DROP POLICY IF EXISTS "users_view_own_subscriptions" ON public.subscriptions;
CREATE POLICY "users_view_own_subscriptions" ON public.subscriptions
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_org_admin_user());

DROP POLICY IF EXISTS "admins_manage_subscriptions" ON public.subscriptions;
CREATE POLICY "admins_manage_subscriptions" ON public.subscriptions
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Payments
DROP POLICY IF EXISTS "users_view_own_payments" ON public.payments;
CREATE POLICY "users_view_own_payments" ON public.payments
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_org_admin_user());

DROP POLICY IF EXISTS "admins_manage_payments" ON public.payments;
CREATE POLICY "admins_manage_payments" ON public.payments
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Invoices
DROP POLICY IF EXISTS "users_view_own_invoices" ON public.invoices;
CREATE POLICY "users_view_own_invoices" ON public.invoices
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_org_admin_user());

DROP POLICY IF EXISTS "admins_manage_invoices" ON public.invoices;
CREATE POLICY "admins_manage_invoices" ON public.invoices
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Tax records
DROP POLICY IF EXISTS "admins_manage_tax_records" ON public.tax_records;
CREATE POLICY "admins_manage_tax_records" ON public.tax_records
FOR ALL TO authenticated
USING (public.is_org_admin_user())
WITH CHECK (public.is_org_admin_user());

-- Commissions
DROP POLICY IF EXISTS "ambassadors_view_own_commissions" ON public.commissions;
CREATE POLICY "ambassadors_view_own_commissions" ON public.commissions
FOR SELECT TO authenticated
USING (ambassador_id = auth.uid() OR public.is_platform_admin_user());

DROP POLICY IF EXISTS "admins_manage_commissions" ON public.commissions;
CREATE POLICY "admins_manage_commissions" ON public.commissions
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Settlements
DROP POLICY IF EXISTS "admins_manage_settlements" ON public.settlements;
CREATE POLICY "admins_manage_settlements" ON public.settlements
FOR ALL TO authenticated
USING (public.is_org_admin_user())
WITH CHECK (public.is_org_admin_user());

-- API billing
DROP POLICY IF EXISTS "admins_manage_api_billing" ON public.api_billing_records;
CREATE POLICY "admins_manage_api_billing" ON public.api_billing_records
FOR ALL TO authenticated
USING (public.is_org_admin_user())
WITH CHECK (public.is_org_admin_user());

-- Card delivery
DROP POLICY IF EXISTS "users_manage_own_card_delivery" ON public.card_delivery_orders;
CREATE POLICY "users_manage_own_card_delivery" ON public.card_delivery_orders
FOR ALL TO authenticated
USING (user_id = auth.uid() OR public.is_platform_admin_user())
WITH CHECK (user_id = auth.uid() OR public.is_platform_admin_user());

-- Insurance claims
DROP POLICY IF EXISTS "admins_manage_insurance_claims" ON public.insurance_claims;
CREATE POLICY "admins_manage_insurance_claims" ON public.insurance_claims
FOR ALL TO authenticated
USING (public.is_org_admin_user())
WITH CHECK (public.is_org_admin_user());

-- Ambassador payouts
DROP POLICY IF EXISTS "ambassadors_view_own_payouts" ON public.ambassador_payouts;
CREATE POLICY "ambassadors_view_own_payouts" ON public.ambassador_payouts
FOR SELECT TO authenticated
USING (ambassador_id = auth.uid() OR public.is_platform_admin_user());

DROP POLICY IF EXISTS "admins_manage_ambassador_payouts" ON public.ambassador_payouts;
CREATE POLICY "admins_manage_ambassador_payouts" ON public.ambassador_payouts
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Marketplace settlements
DROP POLICY IF EXISTS "admins_manage_marketplace_settlements" ON public.marketplace_settlements;
CREATE POLICY "admins_manage_marketplace_settlements" ON public.marketplace_settlements
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Revenue reconciliation
DROP POLICY IF EXISTS "admins_manage_revenue_reconciliation" ON public.revenue_reconciliation;
CREATE POLICY "admins_manage_revenue_reconciliation" ON public.revenue_reconciliation
FOR ALL TO authenticated
USING (public.is_platform_admin_user())
WITH CHECK (public.is_platform_admin_user());

-- Financial notifications
DROP POLICY IF EXISTS "users_manage_own_financial_notifications" ON public.financial_notifications;
CREATE POLICY "users_manage_own_financial_notifications" ON public.financial_notifications
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admins_view_all_financial_notifications" ON public.financial_notifications;
CREATE POLICY "admins_view_all_financial_notifications" ON public.financial_notifications
FOR SELECT TO authenticated
USING (public.is_platform_admin_user());

-- ============================================================
-- 19. MOCK DATA
-- ============================================================

DO $$
DECLARE
  existing_user_id UUID;
  existing_org_id UUID;
  sub_id_1 UUID := gen_random_uuid();
  sub_id_2 UUID := gen_random_uuid();
  pay_id_1 UUID := gen_random_uuid();
  pay_id_2 UUID := gen_random_uuid();
  pay_id_3 UUID := gen_random_uuid();
  pay_id_4 UUID := gen_random_uuid();
  pay_id_5 UUID := gen_random_uuid();
  inv_id_1 UUID := gen_random_uuid();
  inv_id_2 UUID := gen_random_uuid();
  settle_id_1 UUID := gen_random_uuid();
  settle_id_2 UUID := gen_random_uuid();
BEGIN
  SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
  SELECT id INTO existing_org_id FROM public.organizations LIMIT 1;

  IF existing_user_id IS NOT NULL THEN
    -- Subscriptions
    INSERT INTO public.subscriptions (id, user_id, organization_id, plan, status, billing_cycle, amount, currency, current_period_start, current_period_end)
    VALUES
      (sub_id_1, existing_user_id, existing_org_id, 'pro'::public.subscription_plan, 'active'::public.subscription_status, 'monthly', 25000, 'XOF', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days'),
      (sub_id_2, existing_user_id, NULL, 'starter'::public.subscription_plan, 'active'::public.subscription_status, 'monthly', 9900, 'XOF', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days')
    ON CONFLICT (id) DO NOTHING;

    -- Payments
    INSERT INTO public.payments (id, reference, user_id, organization_id, subscription_id, amount, currency, payment_method, status, provider, description, processed_at)
    VALUES
      (pay_id_1, 'PAY-2026-001', existing_user_id, existing_org_id, sub_id_1, 25000, 'XOF', 'mobile_money'::public.payment_method, 'completed'::public.payment_status, 'Orange Money', 'Abonnement Pro - Août 2026', NOW() - INTERVAL '15 days'),
      (pay_id_2, 'PAY-2026-002', existing_user_id, NULL, sub_id_2, 9900, 'XOF', 'card'::public.payment_method, 'completed'::public.payment_status, 'Stripe', 'Abonnement Starter - Août 2026', NOW() - INTERVAL '5 days'),
      (pay_id_3, 'PAY-2026-003', existing_user_id, existing_org_id, NULL, 15000, 'XOF', 'bank_transfer'::public.payment_method, 'pending'::public.payment_status, 'CBAO', 'Consultation spécialisée', NULL),
      (pay_id_4, 'PAY-2026-004', existing_user_id, NULL, NULL, 5000, 'XOF', 'wallet'::public.payment_method, 'completed'::public.payment_status, 'SHIFA Wallet', 'Téléconsultation', NOW() - INTERVAL '2 days'),
      (pay_id_5, 'PAY-2026-005', existing_user_id, existing_org_id, NULL, 75000, 'XOF', 'insurance'::public.payment_method, 'failed'::public.payment_status, 'CNSS', 'Remboursement assurance', NULL)
    ON CONFLICT (reference) DO NOTHING;

    -- Invoices
    INSERT INTO public.invoices (id, invoice_number, user_id, organization_id, payment_id, subscription_id, status, subtotal, tax_amount, total, currency, due_date, paid_at)
    VALUES
      (inv_id_1, 'INV-2026-0001', existing_user_id, existing_org_id, pay_id_1, sub_id_1, 'paid'::public.invoice_status, 21186, 3814, 25000, 'XOF', CURRENT_DATE - INTERVAL '10 days', NOW() - INTERVAL '15 days'),
      (inv_id_2, 'INV-2026-0002', existing_user_id, NULL, pay_id_3, NULL, 'sent'::public.invoice_status, 12712, 2288, 15000, 'XOF', CURRENT_DATE + INTERVAL '7 days', NULL)
    ON CONFLICT (invoice_number) DO NOTHING;

    -- Tax records
    INSERT INTO public.tax_records (organization_id, user_id, payment_id, invoice_id, tax_type, tax_rate, taxable_amount, tax_amount, currency, country_code, period_start, period_end, status)
    VALUES
      (existing_org_id, existing_user_id, pay_id_1, inv_id_1, 'TVA', 18, 21186, 3814, 'XOF', 'SN', DATE_TRUNC('month', NOW())::DATE, (DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 day')::DATE, 'paid'),
      (existing_org_id, existing_user_id, pay_id_2, NULL, 'TVA', 18, 8390, 1510, 'XOF', 'SN', DATE_TRUNC('month', NOW())::DATE, (DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 day')::DATE, 'pending')
    ON CONFLICT (id) DO NOTHING;

    -- Commissions
    INSERT INTO public.commissions (ambassador_id, referred_user_id, payment_id, commission_type, rate, base_amount, commission_amount, currency, status, approved_at)
    VALUES
      (existing_user_id, existing_user_id, pay_id_1, 'referral', 10, 25000, 2500, 'XOF', 'approved'::public.commission_status, NOW() - INTERVAL '14 days'),
      (existing_user_id, existing_user_id, pay_id_2, 'referral', 10, 9900, 990, 'XOF', 'pending'::public.commission_status, NULL)
    ON CONFLICT (id) DO NOTHING;

    -- Settlements
    INSERT INTO public.settlements (id, reference, organization_id, settlement_type, gross_amount, platform_fee, tax_withheld, net_amount, currency, status, period_start, period_end, transaction_count, settled_at)
    VALUES
      (settle_id_1, 'SET-2026-001', existing_org_id, 'marketplace', 450000, 45000, 72900, 332100, 'XOF', 'settled'::public.settlement_status, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '1 day', 18, NOW() - INTERVAL '2 days'),
      (settle_id_2, 'SET-2026-002', existing_org_id, 'consultation', 280000, 28000, 45360, 206640, 'XOF', 'pending'::public.settlement_status, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 11, NULL)
    ON CONFLICT (reference) DO NOTHING;

    -- Marketplace settlements
    INSERT INTO public.marketplace_settlements (seller_organization_id, period_start, period_end, total_sales, platform_commission, tax_withheld, net_settlement, currency, order_count, status, settled_at)
    VALUES
      (existing_org_id, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '1 day', 850000, 85000, 137700, 627300, 'XOF', 34, 'settled'::public.settlement_status, NOW() - INTERVAL '1 day'),
      (existing_org_id, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 320000, 32000, 51840, 236160, 'XOF', 12, 'pending'::public.settlement_status, NULL)
    ON CONFLICT (id) DO NOTHING;

    -- Revenue reconciliation
    INSERT INTO public.revenue_reconciliation (period_start, period_end, total_revenue, subscription_revenue, payment_revenue, marketplace_revenue, api_revenue, other_revenue, total_refunds, total_commissions_paid, total_taxes_collected, net_revenue, currency, status, reconciled_by, reconciled_at)
    VALUES
      (DATE_TRUNC('month', NOW() - INTERVAL '1 month')::DATE, (DATE_TRUNC('month', NOW()) - INTERVAL '1 day')::DATE, 12800000, 4200000, 5600000, 2100000, 600000, 300000, 240000, 380000, 2304000, 9876000, 'XOF', 'reconciled', existing_user_id, NOW() - INTERVAL '5 days'),
      (DATE_TRUNC('month', NOW())::DATE, CURRENT_DATE, 8400000, 2800000, 3700000, 1400000, 350000, 150000, 120000, 210000, 1512000, 6558000, 'XOF', 'draft', NULL, NULL)
    ON CONFLICT (id) DO NOTHING;

    -- Ambassador payouts
    INSERT INTO public.ambassador_payouts (ambassador_id, period_start, period_end, total_commissions, total_bonuses, deductions, net_payout, currency, status, payment_method, paid_at)
    VALUES
      (existing_user_id, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '1 day', 45000, 5000, 0, 50000, 'XOF', 'settled'::public.settlement_status, 'mobile_money', NOW() - INTERVAL '3 days'),
      (existing_user_id, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 18500, 2000, 0, 20500, 'XOF', 'pending'::public.settlement_status, 'mobile_money', NULL)
    ON CONFLICT (id) DO NOTHING;

    -- Financial notifications
    INSERT INTO public.financial_notifications (user_id, notification_type, title, body, amount, currency, reference_type, is_read, priority)
    VALUES
      (existing_user_id, 'payment_received'::public.financial_notification_type, 'Paiement reçu', 'Votre paiement de 25 000 XOF a été confirmé pour l''abonnement Pro.', 25000, 'XOF', 'payment', false, 'high'),
      (existing_user_id, 'subscription_renewed'::public.financial_notification_type, 'Abonnement renouvelé', 'Votre abonnement Pro a été renouvelé avec succès pour le mois d''août 2026.', 25000, 'XOF', 'subscription', false, 'normal'),
      (existing_user_id, 'commission_earned'::public.financial_notification_type, 'Commission gagnée', 'Vous avez gagné une commission de 2 500 XOF sur le parrainage de Dr. Aminata Koné.', 2500, 'XOF', 'commission', true, 'normal'),
      (existing_user_id, 'payment_failed'::public.financial_notification_type, 'Paiement échoué', 'Le remboursement CNSS de 75 000 XOF a échoué. Veuillez vérifier les informations.', 75000, 'XOF', 'payment', false, 'high'),
      (existing_user_id, 'settlement_completed'::public.financial_notification_type, 'Règlement effectué', 'Le règlement marketplace SET-2026-001 de 332 100 XOF a été traité avec succès.', 332100, 'XOF', 'settlement', true, 'normal'),
      (existing_user_id, 'invoice_overdue'::public.financial_notification_type, 'Facture en retard', 'La facture INV-2026-0003 de 15 000 XOF est en retard de paiement.', 15000, 'XOF', 'invoice', false, 'high'),
      (existing_user_id, 'payout_processed'::public.financial_notification_type, 'Versement ambassadeur traité', 'Votre versement de 50 000 XOF pour juillet 2026 a été envoyé via Orange Money.', 50000, 'XOF', 'payout', true, 'normal'),
      (existing_user_id, 'subscription_expiring'::public.financial_notification_type, 'Abonnement expirant bientôt', 'Votre abonnement Starter expire dans 5 jours. Renouvelez pour continuer.', 9900, 'XOF', 'subscription', false, 'normal'),
      (existing_user_id, 'tax_due'::public.financial_notification_type, 'Déclaration TVA à soumettre', 'La déclaration TVA du mois d''août 2026 est à soumettre avant le 15 septembre.', 5324, 'XOF', 'tax', false, 'high'),
      (existing_user_id, 'commission_paid'::public.financial_notification_type, 'Commission versée', 'Votre commission de 990 XOF a été créditée sur votre portefeuille SHIFA.', 990, 'XOF', 'commission', true, 'normal')
    ON CONFLICT (id) DO NOTHING;

  ELSE
    RAISE NOTICE 'No existing users found. Run auth migration first.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Phase 2 financial mock data insertion failed: %', SQLERRM;
END $$;
