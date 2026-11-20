# Remote migration ledger — observed snapshot

Observed on 2026-11-19 using the Supabase migration metadata API. This is a record of version labels only; it does not recreate the missing SQL.

| Version | Name |
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
| 20261118225231 | shifa_revoke_excess_table_privileges |

## Required reconciliation

- The version `20261118225231` is registered remotely, but its matching SQL source file could not be recovered from the GitHub branch or default branch during this audit.
- Current branch migration `20261118220000_shifa_ai_rate_limits.sql` has an earlier timestamp than the missing ledger entry and is not recorded as applied in the observed ledger.
- The branch includes later migrations beginning `20261118233000` and `20261119001000` onward; none should be pushed before resolving ordering and schema baseline.
- Do not mark a migration as applied, deleted or reverted solely to make the CLI plan clean.
- Treat this file as a dated audit artifact. Refresh it before any future deployment.
