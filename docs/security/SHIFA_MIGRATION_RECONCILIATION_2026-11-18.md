# SHIFA HEALTH — migration reconciliation
**Date:** 2026-11-18  
**Scope:** read-only comparison of the connected Supabase migration ledger and GitHub repository history.  
**Status:** findings documented; no database or production changes performed.

## 1. Supabase migration ledger

The connected Supabase project reports these 15 registered migrations:

| Version | Migration |
|---|---|
| 20261101143942 | shifa_p0_part1_schema_and_functions |
| 20261101144008 | shifa_p0_part2_handle_new_user_and_triggers |
| 20261101144357 | shifa_p0_part3_rls_hardening |
| 20261111200209 | p0_signup_and_patient_access_hardening |
| 20261111200327 | p0_storage_isolation_and_definer_anon_revocation |
| 20261111200337 | p0_revoke_public_definer_execute |
| 20261111204026 | p0_lock_trigger_only_definers |
| 20261111204047 | p1_index_foreign_keys |
| 20261111204055 | p1_remove_duplicate_indexes |
| 20261111204131 | p1_patient_transfer_policy_dedup |
| 20261111204137 | p1_patient_transfer_access_scope |
| 20261111204406 | p0_clinical_records_scope_guard |
| 20261111204501 | p0_active_professional_org_membership |
| 20261111204719 | fix_subscription_user_upsert_conflict |
| 20261111204721 | fix_subscription_upsert_unique_user |

## 2. Git repository inventory

On `main`, only these three SQL migrations were found:

- `supabase/migrations/20260810141803_shifa_foundation.sql`
- `supabase/migrations/20260810220000_community_hub.sql`
- `supabase/migrations/20260811140000_phase2_financial_domains.sql`

Therefore, 12 migrations present in the connected Supabase ledger are not represented by those three files on `main`. Their original SQL bodies must be recovered from the authoritative source (original development machine, backup, CI artifact, or the commit/branch where they were authored) before the repository can be considered reproducible.

The separate branch `audit/shifa-security-hardening-2026-11` contains `20261111220000_tenant_rls_hardening.sql`. That file is not among the 15 migrations registered in Supabase and is not part of `main`. Treat it as an unmerged proposal, not as applied database history.

## 3. Important migration safety finding

The initial foundation migration contains destructive schema operations such as `DROP TYPE IF EXISTS ... CASCADE` and demo/sample-data insertion blocks. It must not be used as a routine reset or replay against an existing database. In particular:

- Do not run `supabase db reset` against the connected production project.
- Do not mark missing migrations as applied merely to silence drift.
- Do not reconstruct the missing migration SQL from names alone.
- Do not squash or rewrite migration history while the remote database is live.
- Preserve a verified backup and establish a staging restore before any future DDL rollout.

## 4. RLS design facts confirmed read-only

- `professional_organizations.status` observed value: `active`.
- `professionals.status` observed value: `active`.
- These are observed data values, not proof that the column constraints permit only this value.
- `patients` has no `organization_id`; the patient-to-user identity mapping uses `patients.user_id` referencing `user_profiles.id`.
- `patient_documents.patient_id` references `auth.users(id)`, unlike `health_records`, `consultations`, and `prescriptions`, whose patient identifiers reference `patients(id)`. RLS functions must respect this distinction.
- The older tenant-hardening proposal uses `organizations.created_by` as the ownership test for an `org_admin`. This is not an adequate general authorization model for hospital administrators. Use an explicit, auditable organization-admin membership/assignment model instead.
- The approved target remains: patient = own records; professional = clinical records only with active care relationship in the same facility; hospital administrator = restricted administrative projection only; platform administrator = no standing clinical access, with exceptional time-limited audited break-glass only.

## 5. Required actions before authoring an executable RLS migration

1. Recover and commit the 12 missing migration source files in their exact historical order, or document a formally reviewed baseline strategy if the originals cannot be recovered.
2. Compare the resulting repository migration ledger against the remote Supabase ledger and explain every difference.
3. Inspect the complete current grants, policies, helper functions, triggers, and Storage policies for each clinical data path.
4. Define explicit organization-admin membership and active patient-care relationship data models, including trusted server-side write paths and revocation semantics.
5. Build a forward-only migration that is safe for the verified live schema; never use a destructive reset.
6. Run SQL compilation, synthetic-fixture RLS tests, and real API/JWT tests in isolated staging. Test both allowed and denied access, including cross-facility reads/writes, anon, admin restrictions, Storage downloads, and break-glass audit.
7. Obtain explicit approval before any production migration or deployment.

## 6. Security note

The public repository root contains a file named `.env`. Its contents were deliberately not opened. The repository owner should inspect it through a secure local environment; if it contains any real secret, revoke/rotate the credential immediately and remove the secret from the repository history using a controlled cleanup process. Never commit service-role keys, database passwords, or private API secrets.
