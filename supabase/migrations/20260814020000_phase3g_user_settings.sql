-- Phase 3G: User Localisation Settings
-- Adds country, language, currency, timezone, date_format columns to user_profiles
-- Idempotent: uses IF NOT EXISTS / DO blocks

DO $$
BEGIN
  -- country
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN country TEXT DEFAULT 'FR';
  END IF;

  -- language
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'language'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN language TEXT DEFAULT 'fr';
  END IF;

  -- currency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN currency TEXT DEFAULT 'EUR';
  END IF;

  -- timezone
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN timezone TEXT DEFAULT 'Europe/Paris';
  END IF;

  -- date_format
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'date_format'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN date_format TEXT DEFAULT 'DD/MM/YYYY';
  END IF;
END $$;

-- RLS: users can update their own settings columns
-- The existing user_profiles RLS already allows users to update their own row.
-- No new policy needed — existing policy covers the new columns.
