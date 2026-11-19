-- Synthetic catalog fixture for rls_v2_policy_contract.sql.
-- Runs only in an ephemeral CI PostgreSQL container. No production data.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE SCHEMA private;
CREATE SCHEMA storage;

CREATE TABLE public.patients (id uuid PRIMARY KEY);
CREATE TABLE public.patient_documents (id uuid PRIMARY KEY);
CREATE TABLE public.health_records (id uuid PRIMARY KEY);
CREATE TABLE public.consultations (id uuid PRIMARY KEY);
CREATE TABLE public.prescriptions (id uuid PRIMARY KEY);
CREATE TABLE public.appointments (id uuid PRIMARY KEY);
CREATE TABLE public.lab_results (id uuid PRIMARY KEY);
CREATE TABLE public.vital_signs (id uuid PRIMARY KEY);
CREATE TABLE public.patient_transfers (id uuid PRIMARY KEY);
CREATE TABLE storage.objects (id uuid PRIMARY KEY);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'patients','patient_documents','health_records','consultations',
    'prescriptions','appointments','lab_results','vital_signs','patient_transfers'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    -- Deny-all fixture: a positive test must never rely on an unconditional TRUE guard.
    EXECUTE format(
      'CREATE POLICY contract_guard ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (false) WITH CHECK (false)',
      t
    );
  END LOOP;
END $$;

CREATE FUNCTION private.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$ SELECT false $$;

GRANT USAGE ON SCHEMA private TO authenticated;

CREATE FUNCTION private.belongs_to_org(target_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $$ SELECT false $$;
