-- SHIFA ACL review worksheet (metadata only).
-- Run only on a disposable database or staging. Never run on production as a
-- mutation script; every result requires a human-reviewed access matrix.

-- 1) Effective table privileges by role and table.
SELECT
  table_schema,
  table_name,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, grantee, privilege_type;

-- 2) Explicit grants to anon. Each row requires a documented public-use case.
SELECT table_name, privilege_type, is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'anon'
ORDER BY table_name, privilege_type;

-- 3) Default privileges that may grant access to future tables.
SELECT
  pg_get_userbyid(d.defaclrole) AS owner_role,
  n.nspname AS schema_name,
  CASE d.defaclobjtype
    WHEN 'r' THEN 'tables'
    WHEN 'S' THEN 'sequences'
    WHEN 'f' THEN 'functions'
    WHEN 'T' THEN 'types'
    ELSE d.defaclobjtype::text
  END AS object_type,
  d.defaclacl
FROM pg_default_acl d
LEFT JOIN pg_namespace n ON n.oid = d.defaclnamespace
WHERE n.nspname = 'public'
ORDER BY owner_role, object_type;

-- 4) Column-level grants can override assumptions made from table grants.
SELECT table_name, column_name, grantee, privilege_type, is_grantable
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY table_name, column_name, grantee, privilege_type;

-- 5) Sequence grants.
SELECT sequence_name, grantee, privilege_type, is_grantable
FROM information_schema.role_usage_grants
WHERE object_schema = 'public'
  AND object_type = 'SEQUENCE'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY sequence_name, grantee, privilege_type;

-- 6) RLS policy inventory for the reviewers' access matrix.
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7) PUBLIC/anon role exposure. A PUBLIC policy can apply to anon and
-- authenticated; check actual grants and JWT role context before conclusions.
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND 'public' = ANY (roles)
ORDER BY tablename, policyname;
