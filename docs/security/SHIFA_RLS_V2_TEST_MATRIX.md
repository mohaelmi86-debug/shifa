# SHIFA HEALTH — RLS v2.0 test matrix

**Status:** test design only. No synthetic users, records, or database changes have been created.  
**Execution target:** isolated staging project with synthetic data only.  
**Release gate:** all critical negative-access tests must pass through both SQL/RLS simulation and the real Supabase API using JWTs.

## 1. Synthetic fixture topology

Create only in staging:

- Facilities: HOSP-A and HOSP-B.
- Patients: PAT-A1, PAT-A2 (HOSP-A); PAT-B1 (HOSP-B).
- Professionals: PRO-A1, PRO-A2 (HOSP-A); PRO-B1 (HOSP-B).
- Administrators: ADM-A (HOSP-A), ADM-B (HOSP-B), ADM-PLATFORM.
- One professional with no active facility membership.
- One professional whose care relationship has been revoked.
- One user with an inactive profile.
- One anonymous request (no JWT).

Use generated UUIDs and synthetic names. Never copy production Auth users, patient records, documents, or object keys.

## 2. Authorization test matrix

| ID | Actor | Target | Operation | Expected |
|---|---|---|---|---|
| RLS-001 | PAT-A1 | Own patient row | SELECT | Allow own profile only |
| RLS-002 | PAT-A1 | PAT-A2 / PAT-B1 | SELECT | Deny |
| RLS-003 | PRO-A1 with active care link | PAT-A1 clinical data | SELECT | Allow within HOSP-A |
| RLS-004 | PRO-A1 without care link | PAT-A2 clinical data | SELECT | Deny |
| RLS-005 | PRO-A1 | PAT-B1 clinical data | SELECT | Deny cross-facility |
| RLS-006 | PRO-A1 with revoked/expired care link | PAT-A1 clinical data | SELECT | Deny immediately after revocation/expiry |
| RLS-007 | PRO-A1 with inactive profile or membership | PAT-A1 clinical data | SELECT | Deny |
| RLS-008 | ADM-A | HOSP-A patient directory projection | SELECT | Allow only explicitly approved operational columns |
| RLS-009 | ADM-A | HOSP-A clinical notes, prescriptions, lab results | SELECT | Deny |
| RLS-010 | ADM-A | HOSP-B data | Any | Deny |
| RLS-011 | ADM-PLATFORM | Any patient clinical record | SELECT | Deny by default |
| RLS-012 | ADM-PLATFORM | Authorized break-glass case | SELECT | Allow only time-bound, purpose-bound, audited exception |
| RLS-013 | ADM-PLATFORM | Break-glass after expiry/revocation | SELECT | Deny |
| RLS-014 | anon | Any clinical table or private Storage bucket | SELECT/download | Deny |
| RLS-015 | Any authenticated client | Care-relationship table | INSERT/UPDATE/DELETE | Deny; trusted server workflow only |
| RLS-016 | Any authenticated client | Clinical tables | TRUNCATE / trigger / REFERENCES | Deny at SQL privilege layer |
| RLS-017 | PRO-A1 | Appointments/lab results/vital signs | SELECT/INSERT/UPDATE | Require same active care relationship and operation-specific permission |
| RLS-018 | User with upload rights but no care link | Patient document / clinical Storage object | SELECT/download | Deny |
| RLS-019 | Authorized professional | Patient document / clinical Storage object | SELECT/download | Allow only for linked patient and facility |
| RLS-020 | HOSP-A transfer workflow | Patient transfer HOSP-A to HOSP-B | Read/write | Source/destination rules and patient consent/workflow state enforced |
| RLS-021 | ADM-A | Patient transfer clinical payload | SELECT | No clinical payload access unless explicitly authorized by workflow |
| RLS-022 | Any role | Cross-tenant object key guessing | Download | Deny |

## 3. Required clinical tables

At minimum, run the matrix against:

- `patients`
- `consultations`
- `health_records`
- `prescriptions`
- `appointments`
- `lab_results`
- `vital_signs`
- `patient_documents`
- `patient_transfers`
- Storage buckets `documents`, `lab-reports`, `medical-images`

Test SELECT, INSERT, UPDATE and DELETE separately. A successful SELECT test does not prove write safety.

## 4. Test execution layers

### Layer A — SQL/RLS simulation

Use staging-only fixture UUIDs and transactions that are rolled back. Set both `request.jwt.claim.sub` and `request.jwt.claims` consistently, switch to `authenticated`, and assert expected row counts. Do not treat SQL Editor results as sufficient evidence: SQL Editor/database-owner execution can bypass the application role model.

### Layer B — Supabase API/JWT

Use real staging JWTs for every synthetic actor. Test REST table endpoints and Storage download/upload endpoints. Capture status codes and returned row/object counts without logging tokens or personal data.

### Layer C — privilege verification

Check `has_table_privilege` and `has_function_privilege` for `anon` and `authenticated`. Confirm client roles cannot TRUNCATE clinical tables, alter triggers, write care relationships, or create break-glass grants.

### Layer D — regression

Run the existing app flows for sign-in, patient self-service, appointment booking, professional workflows, lab result entry, prescription handling, transfers, document upload, and administrative directory operations. Ensure the new policy model does not break authorized use cases.

## 5. Pass criteria

- 100% pass for critical deny cases RLS-002, 004–007, 009–016, 018, 020–022.
- Zero cross-facility clinical reads or writes.
- Zero platform-admin standing clinical access.
- Zero hospital-admin clinical record access.
- Revocation and expiry effective immediately for new requests.
- Every break-glass access has actor, patient, facility, reason, start/end, and immutable audit event.
- No service-role key or database credential in browser bundles, logs, fixtures, or test reports.
- Test evidence includes commit SHA, migration version, environment, test actor, operation, expected result, actual result, and timestamp.

## 6. Stop conditions

Stop rollout if any critical negative test fails, any data fixture touches production, any policy depends on user-editable metadata without server validation, or any migration cannot be replayed from a clean isolated staging database.

No production migration or deployment is authorized by this document.
