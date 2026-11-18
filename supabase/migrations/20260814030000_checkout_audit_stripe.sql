-- ─── Phase 3H: Checkout / Stripe / Audit Realtime ──────────────────────────
-- Adds: payment_intent_id, stripe_customer_id, financial event triggers

-- 1. Extend payments table with Stripe fields
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT;

-- 2. Extend user_profiles with Stripe customer id
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- 3. Extend invoices with i18n / localization fields
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'FR',
  ADD COLUMN IF NOT EXISTS language_code TEXT DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS legal_disclaimer TEXT,
  ADD COLUMN IF NOT EXISTS billing_name TEXT,
  ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{}'::jsonb;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_payments_payment_intent_id ON public.payments(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 5. Function: log financial event to audit_logs
CREATE OR REPLACE FUNCTION public.log_financial_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
  v_action TEXT;
  v_resource_type TEXT;
  v_user_id UUID;
  v_org_id UUID;
  v_details JSONB;
BEGIN
  v_resource_type := TG_TABLE_NAME;

  IF TG_TABLE_NAME = 'payments' THEN
    v_action := CASE
      WHEN TG_OP = 'INSERT' THEN 'payment_created'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'completed' THEN 'payment_completed'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'failed' THEN 'payment_failed'
      ELSE 'payment_updated'
    END;
    v_user_id := NEW.user_id;
    v_org_id := NEW.organization_id;
    v_details := jsonb_build_object(
      'reference', NEW.reference,
      'amount', NEW.amount,
      'currency', NEW.currency,
      'status', NEW.status,
      'payment_method', NEW.payment_method,
      'provider', COALESCE(NEW.provider, 'stripe'),
      'payment_intent_id', COALESCE(NEW.payment_intent_id, '')
    );

  ELSIF TG_TABLE_NAME = 'invoices' THEN
    v_action := CASE
      WHEN TG_OP = 'INSERT' THEN 'invoice_issued'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'paid' THEN 'invoice_paid'
      ELSE 'invoice_updated'
    END;
    v_user_id := NEW.user_id;
    v_org_id := NEW.organization_id;
    v_details := jsonb_build_object(
      'invoice_number', NEW.invoice_number,
      'total', NEW.total,
      'currency', NEW.currency,
      'status', NEW.status,
      'country_code', COALESCE(NEW.country_code, 'FR'),
      'language_code', COALESCE(NEW.language_code, 'fr')
    );

  ELSIF TG_TABLE_NAME = 'settlements' THEN
    v_action := CASE
      WHEN TG_OP = 'INSERT' THEN 'settlement_processed'
      WHEN TG_OP = 'UPDATE' AND NEW.status = 'completed' THEN 'settlement_completed'
      ELSE 'settlement_updated'
    END;
    v_user_id := NULL;
    v_org_id := NEW.organization_id;
    v_details := jsonb_build_object(
      'reference', NEW.reference,
      'net_amount', NEW.net_amount,
      'currency', NEW.currency,
      'status', NEW.status,
      'transaction_count', NEW.transaction_count
    );

  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.audit_logs (
    id, user_id, organization_id, action, resource_type, resource_id, details, created_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    v_org_id,
    v_action,
    v_resource_type,
    NEW.id,
    v_details,
    CURRENT_TIMESTAMP
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Financial event log failed: %', SQLERRM;
    RETURN NEW;
END;
$func$;

-- 6. Triggers for financial event streaming
DROP TRIGGER IF EXISTS trg_payment_audit ON public.payments;
CREATE TRIGGER trg_payment_audit
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.log_financial_event();

DROP TRIGGER IF EXISTS trg_invoice_audit ON public.invoices;
CREATE TRIGGER trg_invoice_audit
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.log_financial_event();

DROP TRIGGER IF EXISTS trg_settlement_audit ON public.settlements;
CREATE TRIGGER trg_settlement_audit
  AFTER INSERT OR UPDATE ON public.settlements
  FOR EACH ROW EXECUTE FUNCTION public.log_financial_event();

-- 7. RLS: audit_logs — users see their own; platform_admin sees all
DROP POLICY IF EXISTS "audit_logs_user_read" ON public.audit_logs;
CREATE POLICY "audit_logs_user_read"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "audit_logs_platform_admin_all" ON public.audit_logs;
CREATE POLICY "audit_logs_platform_admin_all"
  ON public.audit_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'platform_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'platform_admin'
    )
  );

DROP POLICY IF EXISTS "audit_logs_service_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_service_insert"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
