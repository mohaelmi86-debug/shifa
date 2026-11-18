-- ============================================================
-- SHIFA HEALTH OS — P0 Critical Fixes
-- 1. Fix handle_new_user() to read raw_user_meta_data.role
-- 2. Ensure RLS is enabled on all financial tables (idempotent)
-- ============================================================

-- ============================================================
-- FIX 1: handle_new_user() — read role from raw_user_meta_data
-- ============================================================
-- The previous version in 20260812220000_phase2_rls_patch.sql
-- always hardcoded 'patient' role, ignoring raw_user_meta_data.role.
-- This fix reads the role from metadata and validates it against
-- the allowed enum values, falling back to 'patient' only when
-- no valid role is provided.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shifa_id TEXT;
  v_role     public.user_role;
  v_raw_role TEXT;
BEGIN
  -- Generate a unique SHIFA ID
  v_shifa_id := 'SH-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));

  -- Read role from metadata, validate against enum, default to 'patient'
  v_raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');

  -- Validate the role value against allowed enum values
  BEGIN
    v_role := v_raw_role::public.user_role;
  EXCEPTION
    WHEN invalid_text_representation THEN
      v_role := 'patient'::public.user_role;
  END;

  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role, shifa_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    v_role,
    v_shifa_id
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Recreate the trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FIX 2: Ensure RLS is enabled on all financial tables
-- (idempotent — safe to run even if already enabled)
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
