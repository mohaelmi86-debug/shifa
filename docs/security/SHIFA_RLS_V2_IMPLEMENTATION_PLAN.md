# SHIFA HEALTH — RLS v2.0 implementation plan

**Status:** preparation only — no production SQL has been executed.
**Target:** integrate security hardening into this existing repository without replacing the application architecture.

## 1. Non-negotiable access model

| Actor | Target access |
|---|---|
| Patient | Own records only |
| Healthcare professional | Clinical records only with an active care relationship, active professional profile, active membership and same organization |
| Hospital administrator | Restricted administrative data only; no automatic access to clinical records |
| Platform administrator | No permanent clinical access; exceptional break-glass workflow only, time-limited and fully audited |
| anon | No clinical access |
| service_role | Server-side technical operations only; never expose its key to browser code |

These rules are acceptance criteria, not yet deployed policies.

## 2. Repository and database reconciliation

The main branch currently contains three SQL migrations under supabase/migrations/:
- 20260810141803_shifa_foundation.sql
- 20260810220000_community_hub.sql
- 20260811140000_phase2_financial_domains.sql

The connected Supabase project audit reported 15 migration history entries. Therefore, the repository migration history is incomplete relative to the remote project.

**Do not run supabase db reset against this repository until the migration history and live schema have been reconciled.** Do not assume the three committed migrations recreate the current database.

The branch audit/shifa-security-hardening-2026-11 contains an earlier tenant hardening migration. It is retained for review only and must not be copied or applied blindly: its organization-admin ownership rule and SECURITY DEFINER search path require reassessment against the current schema.

## 3. Confirmed schema constraints to preserve

- patients.id is the patient-record UUID.
- patients.user_id links to user_profiles.id (which represents the authenticated user).
- health_records.patient_id, consultations.patient_id, and prescriptions.patient_id reference patients.id.
- patient_documents.patient_id references auth.users.id — this is a different identifier model and must not be treated as patients.id.
- professional_organizations carries professional_id, organization_id, department_id, and status.
- consultations carries professional_id, organization_id, patient_id, and status.
- health_records and prescriptions carry organization and patient references.
- patients has no organization_id column.

Any policy/function must use the correct identifier for each table. Do not infer a care relationship merely from a historical consultation or from organization membership.

## 4. Implementation sequence

### Phase A — establish a reproducible baseline
1. Capture the current remote schema as a schema-only artifact in a controlled environment.
2. Reconcile the 15 remote migration-history entries with the repository's three committed migration files.
3. Identify dashboard/manual SQL changes and managed Supabase objects that are not represented in migrations.
4. Rebuild a disposable local database from the reconciled snapshot.
5. Confirm PostgreSQL/Supabase versions and required extensions.

No patient data or production auth users are to be copied into the test environment.

### Phase B — implement the care relationship model
Create a private relation table with, at minimum:
- patient record identifier (patients.id)
- professional identifier
- organization identifier
- status (active / revoked)
- validity start and optional expiry
- created-by, revoked-by and revocation timestamp
- timestamps and audit metadata

Only a trusted server-side workflow may create or revoke these relations. A professional must not be able to grant themselves access. Enforce same-organization membership and active profile status at authorization time, not only when the relation is created.

### Phase C — apply restrictive authorization
- Add restrictive RLS guards to relevant clinical tables so existing permissive policies cannot widen access.
- Use separate, type-correct authorization functions for patients-keyed clinical tables and auth.users-keyed document tables.
- Restrict hospital administrators to a purpose-built administrative projection containing only the minimum operational fields; do not grant direct clinical table access.
- Keep platform-admin break-glass separate from normal RLS access, with reason, scope, expiry, actor, patient, organization and immutable audit record.
- Revoke dangerous table privileges from client roles only after staging tests prove that the application does not depend on them. RLS does not protect against TRUNCATE.

### Phase D — test before any deployment
Use synthetic accounts and synthetic patients only. Run both SQL-level tests and authenticated API tests.

Required negative tests:
1. Patient A cannot read or modify Patient B.
2. Professional A cannot read records without an active care relationship.
3. A revoked or expired care relationship immediately blocks access.
4. Professional A cannot cross organization boundaries.
5. An inactive professional profile or inactive organization membership blocks access.
6. Hospital administrator cannot read clinical notes, prescriptions, documents or full patient records.
7. Platform administrator has no standing clinical access.
8. anon cannot read or write clinical data.
9. Uploader status alone does not grant access to a patient document.
10. Patient-document authorization uses auth.users.id, not patients.id.
11. Unauthorized inserts, updates and deletes are denied.
12. Browser clients cannot use service_role privileges.

**Release gate:** 100% of critical negative tests pass; no cross-patient or cross-organization leakage; no unexplained policy overlap; application smoke tests pass.

## 5. Other audit findings — separate workstreams

The previous read-only audit also identified:
- broad client grants including TRUNCATE, REFERENCES, and TRIGGER;
- permissive/overlapping RLS policies;
- payment, invoice and subscription consistency concerns;
- missing/unclear Stripe webhook processing;
- breached-password protection disabled;
- permissive CORS;
- an over-privileged email service function;
- Storage policies requiring care-relationship enforcement;
- backup/restore not yet verified;
- no dedicated development branch at the time of that audit.

These findings must be revalidated against the current project before remediation. Unused-index and policy-advisor counts are not, by themselves, proof of a vulnerability or grounds for automated deletion.

## 6. Deployment controls

- This branch is for code review and staging preparation only.
- Never run supabase db push, apply SQL in the production SQL editor, or modify production Auth/Storage settings as part of this work.
- Every migration must be reviewed, tested on a disposable environment, and accompanied by rollback/forward-recovery guidance.
- Production deployment requires a separate explicit approval after evidence is presented.
- Report statuses precisely: prepared, syntax-checked, tested locally, tested on staging, deployed.

## 7. Immediate next actions

1. Reconcile database migration history and repository history.
2. Confirm exact column types and status values for professionals, professional_organizations, and user_profiles.
3. Inspect all policies and grants on the five clinical tables plus Storage.
4. Build the first RLS v2.0 migration only after these checks.
5. Add pgTAP/API tests with synthetic fixtures and run them in staging.
