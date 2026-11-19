-- Reconstructed migration for remote ledger version 20261118225231.
--
-- IMPORTANT:
-- The original SQL file for this already-applied remote migration could not
-- be recovered from Git history. This file is a reproducible reconstruction
-- from the live project's metadata-only ACL snapshot (19 Nov 2026), NOT a
-- byte-for-byte recovery of the original.
--
-- Observed state: 64 public tables/views grant CRUD to authenticated and
-- full table privileges to service_role; anon has SELECT on exactly four
-- public catalog tables; no table privileges are granted to PUBLIC.
-- This migration establishes that same table-level grant contract for
-- fresh environments. It does not change RLS policies or row data.
--
-- On the linked project this version is already present in supabase_migrations
-- and Supabase CLI must therefore skip it. Do not use migration repair.

DO $$
DECLARE
  r record;
BEGIN
  -- Remove direct table access from anonymous and PUBLIC roles first.
  FOR r IN
    SELECT format('%I.%I', schemaname, tablename) AS relation_name
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE %s FROM anon, PUBLIC', r.relation_name);
  END LOOP;

  -- Reproduce the authenticated and service-role table privilege baseline.
  FOR r IN
    SELECT format('%I.%I', schemaname, tablename) AS relation_name
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE %s TO authenticated', r.relation_name);
    EXECUTE format('GRANT ALL PRIVILEGES ON TABLE %s TO service_role', r.relation_name);
  END LOOP;

  -- The only anonymous table reads observed in the remote ACL snapshot.
  GRANT SELECT ON TABLE
    public.availability_slots,
    public.funding_campaigns,
    public.health_services,
    public.marketplace_products
  TO anon;
END
$$;
