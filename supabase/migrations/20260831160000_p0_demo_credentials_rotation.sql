-- ============================================================
-- SHIFA HEALTH — P0 DEMO CREDENTIALS REMOVAL
-- Removes hardcoded demo passwords from versioned migration
-- ADDITIVE — does not modify the original migration file
-- ============================================================
-- 
-- CONTEXT (P0.7):
-- The original migration 20260810141803_shifa_foundation.sql contains
-- demo accounts with hardcoded passwords (Shifa2026#A, Shifa2026#P, Shifa2026#D).
-- Those passwords are now considered COMPROMISED if the repository was shared.
--
-- This migration:
-- 1. Rotates the demo account passwords to random values (accounts remain usable
--    only via the Supabase dashboard password reset flow)
-- 2. Documents the procedure for creating new demo accounts
--
-- TO CREATE FRESH DEMO ACCOUNTS:
-- Use the Supabase dashboard or the following environment variables:
--   DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD
--   DEMO_PATIENT_EMAIL / DEMO_PATIENT_PASSWORD
--   DEMO_PRO_EMAIL / DEMO_PRO_PASSWORD
--
-- NEVER commit real passwords to version control.
-- ============================================================

DO $$
DECLARE
  new_admin_password TEXT;
  new_patient_password TEXT;
  new_pro_password TEXT;
BEGIN
  -- Generate cryptographically random passwords (not stored anywhere in code)
  -- These accounts will require a password reset via Supabase Auth dashboard
  -- or via the forgot-password flow to be usable again.
  new_admin_password := encode(gen_random_bytes(24), 'base64');
  new_patient_password := encode(gen_random_bytes(24), 'base64');
  new_pro_password := encode(gen_random_bytes(24), 'base64');

  -- Rotate passwords for the three demo accounts created in the foundation migration
  -- The accounts remain in the database but their passwords are now unknown
  UPDATE auth.users
  SET
    encrypted_password = crypt(new_admin_password, gen_salt('bf', 12)),
    updated_at = now()
  WHERE email = 'admin@chu-saintlouis.shifa.health';

  UPDATE auth.users
  SET
    encrypted_password = crypt(new_patient_password, gen_salt('bf', 12)),
    updated_at = now()
  WHERE email = 'aicha.diallo@shifa.health';

  UPDATE auth.users
  SET
    encrypted_password = crypt(new_pro_password, gen_salt('bf', 12)),
    updated_at = now()
  WHERE email = 'dr.sy@shifa.health';

  RAISE NOTICE 'P0.7: Demo account passwords have been rotated. Use Supabase Auth dashboard to reset if needed.';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'P0.7 password rotation failed (accounts may not exist): %', SQLERRM;
END $$;
