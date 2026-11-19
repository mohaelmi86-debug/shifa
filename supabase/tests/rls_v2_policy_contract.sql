-- SHIFA HEALTH — RLS v2.0 policy contract (staging only)
-- Purpose: fail closed while known unsafe policy/grant/function patterns remain.
-- This script reads catalog metadata only. It creates no objects and reads no patient rows.
-- Execute only against an isolated, schema-faithful staging database after migration replay.
-- Expected to FAIL against the current production metadata until remediation is complete.

DO $$
DECLARE
  violations text;
  clinical_tables text[] := ARRAY[
    'patients','patient_documents','health_records','consultations',
    'prescriptions','appointments','lab_results','vital_signs','patient_transfers'
  ];
BEGIN
  -- The contract must not silently pass when a clinical table is missing.
  SELECT string_agg(t, ', ') INTO violations
  FROM unnest(clinical_tables) AS t
  WHERE to_regclass(format('public.%I', t)) IS NULL;
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: missing required clinical tables: %', violations;
  END IF;

  -- No standing platform-admin or org-admin bypass on clinical tables.
  SELECT string_agg(format('%I.%I [%s]', tablename, policyname, cmd), E'\n')
  INTO violations
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = ANY(clinical_tables)
    AND (
      coalesce(qual, '') || ' ' || coalesce(with_check, '')
    ) ~* '(is_platform_admin|is_org_admin|is_org_admin_for|org_admin_can_access_patient)';
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: standing admin bypass remains in clinical policies:%', E'\n' || violations;
  END IF;

  -- Every clinical table must have a restrictive policy. This prevents
  -- permissive policy OR-composition from widening the clinical boundary.
  SELECT string_agg(t, ', ') INTO violations
  FROM unnest(clinical_tables) AS t
  WHERE NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public'
      AND p.tablename = t
      AND p.permissive = 'RESTRICTIVE'
  );
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: missing restrictive guard on: %', violations;
  END IF;

  -- Helpers used by clinical RLS must not reintroduce standing admin bypasses.
  SELECT string_agg(format('%I.%I(%s)', n.nspname, p.proname,
                           pg_get_function_identity_arguments(p.oid)), E'\\n')
  INTO violations
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'private'
    AND p.proname IN (
      'belongs_to_org','clinical_scope_guard','can_access_transfer',
      'professional_has_patient_consultation','owns_professional_record'
    )
    AND pg_get_functiondef(p.oid) ~* '(is_platform_admin|is_org_admin|is_org_admin_for|org_admin_can_access_patient)';
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: clinical authorization helper contains standing admin bypass:%', E'\\n' || violations;
  END IF;

  -- anon must have no direct table privileges on clinical tables.
  SELECT string_agg(format('%I.%I (%s)', table_name, privilege_type), ', ')
  INTO violations
  FROM information_schema.role_table_grants
  WHERE table_schema = 'public'
    AND table_name = ANY(clinical_tables)
    AND grantee = 'anon';
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: anon has direct clinical table grants: %', violations;
  END IF;

  -- Uploader identity alone must never grant clinical document read access.
  SELECT string_agg(policyname, ', ') INTO violations
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'patient_documents'
    AND cmd IN ('SELECT', 'ALL')
    AND coalesce(qual, '') ~* 'uploaded_by\s*=\s*\(?\s*(select\s+)?auth\.uid';
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: uploader-only document read path remains: %', violations;
  END IF;

  -- Client roles must not retain table-level destructive/DDL-adjacent rights.
  SELECT string_agg(format('%s.%s -> %s (%s)', table_schema, table_name, grantee, privilege_type), E'\n')
  INTO violations
  FROM information_schema.role_table_grants
  WHERE table_schema = 'public'
    AND table_name = ANY(clinical_tables)
    AND grantee IN ('anon', 'authenticated')
    AND privilege_type IN ('TRUNCATE', 'REFERENCES', 'TRIGGER');
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: excess client table privileges remain:%', E'\n' || violations;
  END IF;

  -- Storage must not have a standing platform-admin bypass on clinical buckets.
  SELECT string_agg(policyname || ' [' || cmd || ']', E'\n')
  INTO violations
  FROM pg_policies
  WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND (
      coalesce(qual, '') || ' ' || coalesce(with_check, '')
    ) ~* 'is_platform_admin'
    AND (
      coalesce(qual, '') || ' ' || coalesce(with_check, '')
    ) ~* '(lab-reports|medical-images|documents)';
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: platform-admin Storage bypass remains:%', E'\n' || violations;
  END IF;

  -- SECURITY DEFINER routines must not use broad public/temporary search paths.
  SELECT string_agg(format('%I.%I(%s)', n.nspname, p.proname,
                           pg_get_function_identity_arguments(p.oid)), E'\n')
  INTO violations
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname IN ('public', 'private')
    AND p.prosecdef
    AND EXISTS (
      SELECT 1
      FROM unnest(coalesce(p.proconfig, ARRAY[]::text[])) cfg
      WHERE cfg ~* '^search_path=.*(public|pg_temp)'
    );
  IF violations IS NOT NULL THEN
    RAISE EXCEPTION 'RLS contract: SECURITY DEFINER functions have broad search_path:%', E'\n' || violations;
  END IF;

  RAISE NOTICE 'SHIFA RLS v2.0 policy contract passed.';
END $$;
