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

## 7. Additional read-only RLS and privilege findings

A second read-only inspection of `pg_policies` and `information_schema.role_table_grants` confirms:

- `authenticated` currently has broad table-level privileges on all five inspected clinical tables, including `TRUNCATE`, `REFERENCES`, and `TRIGGER` alongside normal CRUD. RLS does not filter `TRUNCATE`; this is a high-priority privilege-hardening issue. The proposed revocation must be designed and tested carefully, and must not be run directly in production as an unreviewed one-liner.
- The restrictive `clinical_scope_guard` is present on consultations, health_records, prescriptions, and patient_documents. However, several permissive policies still grant broad access paths; restrictive policies constrain them only if their predicate is correct and applies to the relevant role/command.
- Clinical SELECT policies still contain direct platform-admin and organization-admin access paths, inconsistent with the approved no-standing-clinical-access rule for platform admins and restricted-only hospital administrators.
- `health_records_patient_insert` compares `health_records.patient_id` to `auth.uid()`, although the FK maps that column to `patients.id`. This is an identity-model mismatch and must be resolved without breaking patient-owned writes.
- `patient_documents_uploader_select` grants a read path to the uploader without checking an active care relationship. Its restrictive guard also passes a patient identifier that is an `auth.users.id`, while the shared guard's patient lookup model expects `patients.id`.
- Storage policies for `documents`, `lab-reports`, and `medical-images` currently rely on the first folder segment matching the authenticated user's ID (or platform-admin allowance in some buckets). They do not demonstrate an active-care-relationship check for clinical documents.
- The `patients_select` policy allows organization-admin and platform-admin access to the full patient row. This conflicts with the approved restricted admin model; implement a deliberately minimized administrative projection rather than granting full-table clinical identity access.

These are policy/grant observations, not proof that every path is exploitable in the current application. Validate them with real JWT/API tests and synthetic fixtures before rollout.

## 8. Expanded clinical-surface audit (read-only)

The audit was expanded to appointments, lab results, vital signs, and patient transfers.

| Table | Policies | Permissive | Restrictive | Finding |
|---|---:|---:|---:|---|
| appointments | 7 | 6 | 1 | Restrictive guard delegates to the legacy broad clinical scope; permissive rules include organization-admin and platform-admin access |
| consultations | 5 | 4 | 1 | Same legacy scope; platform-admin and organization-admin paths remain |
| health_records | 8 | 7 | 1 | Same legacy scope; patient insert identity mismatch remains |
| lab_results | 9 | 8 | 1 | Same legacy scope; broad org/admin/platform paths and professional checks need redesign |
| patient_documents | 4 | 3 | 1 | Uploader SELECT path and auth-user-vs-patient UUID mismatch |
| patient_transfers | 4 | 4 | 0 | No restrictive clinical-scope policy; transfer helper must be inspected and tested independently |
| patients | 4 | 4 | 0 | No restrictive policy; full-row SELECT currently includes org-admin/platform-admin paths |
| prescriptions | 7 | 6 | 1 | Same legacy scope; professional ALL policy and admin/platform paths remain |
| vital_signs | 4 | 3 | 1 | Same legacy scope; SELECT/INSERT/UPDATE allow broad clinical-role or platform-admin paths |

### 8.1 Legacy scope is not an active care relationship

The current `private.clinical_scope_guard(patient_id, organization_id)` returns true when:
- the authenticated user owns the patient record; OR
- the user is a platform administrator; OR
- the user has a clinical role and belongs to the supplied organization, or is an organization administrator for it.

It does **not** require a specific active care relationship between that professional and that patient. This means the existing restrictive policy is not equivalent to the approved SHIFA v2.0 `care` rule. Because permissive policies are combined with restrictive policies, this broad guard currently does not narrow all clinical access to the intended patient-professional relationship.

The helper `private.professional_has_patient_consultation(patient_id)` checks for any matching consultation with active professional and organization membership, but it does not constrain consultation status or validity dates and is not a substitute for a revocable, explicit care-relationship record.

### 8.2 Organization-admin and platform-admin semantics

`private.is_org_admin_for(org_id)` returns true for an active `org_admin` whose `user_profiles.organization_id` matches, but it also returns true for a platform administrator. This helper must not be reused as a clinical-record authorization predicate under the approved model.

The schema-level grants inspection also confirmed that `anon` and `authenticated` cannot CREATE objects in either `public` or `private` schemas. This reduces the immediate schema-object-shadowing risk, but the SECURITY DEFINER functions should still be hardened with a minimal, explicitly qualified search path and reviewed ownership/EXECUTE grants.

### 8.3 Additional table-level privilege exposure

The same broad authenticated table grants (including `TRUNCATE`, `REFERENCES`, and `TRIGGER`) were observed on appointments, lab_results, vital_signs, and patient_transfers, not just the initial five tables. No equivalent direct table privileges for `anon` were returned for this inspected set. This does not replace a complete database-wide grant audit.

### 8.4 Storage buckets

Current buckets:
- `avatars`: public; 5 MiB limit; image formats.
- `documents`: private; 50 MiB limit; PDF, image and Word formats.
- `lab-reports`: private; 50 MiB limit; PDF, image and spreadsheet/CSV formats.
- `medical-images`: private; 100 MiB limit; JPEG, PNG, WebP and DICOM formats.

The private clinical buckets must be tested via authenticated Storage API requests and signed URLs. Existing folder-prefix policies are not sufficient evidence of patient-level care authorization. The public avatars bucket is a separate public-media decision and should not contain clinical content.

## 9. Revised RLS v2.0 implementation boundary

The first RLS v2.0 migration must cover, at minimum:

1. Patients: patient self-access plus a minimized administrative projection; no blanket clinical row access for org/platform administrators.
2. Consultations, health_records, prescriptions, appointments, lab_results, vital_signs: active patient-care relationship + active professional + active facility membership, with patient self-read as a separate path and tightly controlled write operations.
3. Patient documents: reconcile the current `auth.users.id` foreign key model with patient-care checks; never pass this identifier to a helper that expects `patients.id`.
4. Patient transfers: explicit source/destination facility authorization, patient consent/workflow state, and restrictive tenant boundary; no general platform-admin clinical bypass.
5. Storage: map object metadata to patient and organization; authorize upload/download/delete through the same care and facility rules, not just a user-folder prefix.
6. Privileges: remove unnecessary table-level `TRUNCATE`, `REFERENCES`, and `TRIGGER` from end-user roles; retain only operation-specific DML grants needed by the client and verify application compatibility.
7. SECURITY DEFINER helpers: pinned safe search path, fully qualified references, least-privilege EXECUTE grants, and no client-write access to care relationships or break-glass audit rows.

All of the above remains a design and audit record only. No DDL, policy, grant, bucket, or application setting has been changed in Supabase.
