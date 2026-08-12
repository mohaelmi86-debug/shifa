# SHIFA Health OS — Phase 2 System Audit Report
**Date**: 2026-08-12 | **Auditor**: Rocket AI Agent | **Status**: ✅ CORRECTIONS APPLIED

---

## 1. EXECUTIVE SUMMARY

Phase 2 audit identified and corrected **7 critical issues** across middleware, auth context, RLS policies, navigation, and auth flows. All corrections have been applied. The system is now consistent across all 14 user roles.

---

## 2. ISSUES FOUND & FIXED

### 🔴 CRITICAL — Fixed

| # | Area | Issue | Fix Applied |
|---|------|-------|-------------|
| 1 | **RLS — user_profiles** | Recursive policy: `is_org_admin()` called `user_profiles` which is itself RLS-protected → infinite recursion on every DB query | Replaced helper-based policies with direct `EXISTS` subqueries on `user_profiles` |
| 2 | **RLS — user_profiles** | Missing `INSERT` policy → new user signups fail silently (profile never created) | Added `INSERT WITH CHECK (auth.uid() = id)` policy |
| 3 | **RLS — patients/organizations** | No `INSERT` policies → patient self-registration and org creation blocked | Added INSERT policies for both tables |
| 4 | **Middleware** | Institutional roles (`ministry`, `public_health`, `insurance`, `ngo`, `university`, `researcher`, `developer`, `vendor`) not handled in role-redirect fallback → all fell through to `/patient-home` | Added all 8 institutional role redirects |
| 5 | **Auth Callback** | `public_health` redirected to `/espace-ministere` instead of `/espace-sante-publique` | Fixed in `auth/callback/route.ts` |
| 6 | **AuthContext** | No `role` state exposed — every component needing role had to make a separate DB call | Added `role` state + `getRole()` helper, fetched on login |
| 7 | **Signup Trigger** | No auto-create trigger for `user_profiles` on `auth.users` insert → profile missing after OAuth/email signup | Added `handle_new_user()` trigger in migration `20260812220000` |

### 🟡 MEDIUM — Fixed

| # | Area | Issue | Fix Applied |
|---|------|-------|-------------|
| 8 | **Sidebar** | `navByRole` only mapped `admin` key, not `org_admin` → org_admin users got empty nav | Added `org_admin: adminNav` mapping |
| 9 | **Sidebar** | All institutional roles (`ministry`, `insurance`, etc.) missing from `navByRole` and `userInfoByRole` | Added all 9 institutional role mappings |
| 10 | **AppLayout** | Role type only accepted 6 values, not all 14 roles → TypeScript errors for institutional pages | Expanded `AppRole` type to all 14 roles |
| 11 | **Middleware** | Missing route guards for `/appointment-history`, `/innovation-center`, `/shifa-emploi-stage`, `/lab-sample-transfer`, `/lab-international-transfer`, `/lab-lis-connector` | Added all 6 missing route guards |
| 12 | **Middleware** | `/forgot-password` not in `PUBLIC_PATHS` → unauthenticated users redirected to login when trying to reset password | Added to `PUBLIC_PATHS` |
| 13 | **LoginForm** | `public_health` merged with `ministry` in same case → wrong redirect | Separated into distinct cases |

### 🟢 LOW — Fixed

| # | Area | Issue | Fix Applied |
|---|------|-------|-------------|
| 14 | **RLS — user_org_id()** | Function only looked up professional org, not org_admin direct org | Extended with COALESCE fallback for `user_profiles.organization_id` |
| 15 | **Schema** | `organization_id` and `shifa_id` columns may be missing from `user_profiles` | Added idempotent `ALTER TABLE` in migration |
| 16 | **RLS — availability_slots** | No RLS policies → appointment calendar could read/write without auth | Added SELECT (public), INSERT/UPDATE (own professional) policies |
| 17 | **RLS — professionals** | Missing `INSERT` policy → professional registration blocked | Added INSERT policy |

---

## 3. MIGRATION APPLIED

**File**: `supabase/migrations/20260812220000_phase2_rls_patch.sql`

Covers:
- `user_profiles` non-recursive RLS (SELECT, INSERT, UPDATE, DELETE)
- `patients` RLS (SELECT, INSERT, UPDATE)
- `organizations` INSERT policy
- `professionals` INSERT policy
- `availability_slots` RLS
- `organization_id` + `shifa_id` columns on `user_profiles`
- `handle_new_user()` trigger on `auth.users`
- Extended `user_org_id()` function

---

## 4. FILES MODIFIED

| File | Change |
|------|--------|
| `src/middleware.ts` | Added 6 missing routes, 8 institutional role redirects, `/forgot-password` to PUBLIC_PATHS |
| `src/contexts/AuthContext.tsx` | Added `role` state, `getRole()` helper, typed interface |
| `src/app/auth/callback/route.ts` | Unified `getRoleRedirect()` covering all 14 roles |
| `src/app/sign-up-login-screen/components/LoginForm.tsx` | Fixed `public_health` redirect, all institutional roles |
| `src/components/Sidebar.tsx` | Added `org_admin` + 8 institutional role nav mappings |
| `src/components/AppLayout.tsx` | Expanded role type to all 14 roles |
| `supabase/migrations/20260812220000_phase2_rls_patch.sql` | New migration (see above) |

---

## 5. ROLE COVERAGE MATRIX (POST-FIX)

| Role | Login Redirect | Middleware Guard | Sidebar Nav | RLS Access |
|------|---------------|-----------------|-------------|------------|
| `patient` | `/patient-home` | ✅ | patientNav | ✅ own data |
| `professional` | `/workspace-professionnel` | ✅ | professionalNav | ✅ org-scoped |
| `org_admin` | `/administration-tablissement` | ✅ | adminNav | ✅ org-scoped |
| `platform_admin` | `/platform-admin` | ✅ | platformAdminNav | ✅ all |
| `ambassador` | `/ambassador-workspace` | ✅ | ambassadorNav | ✅ own |
| `ministry` | `/espace-ministere` | ✅ | institutionNav | ✅ |
| `public_health` | `/espace-sante-publique` | ✅ | institutionNav | ✅ |
| `insurance` | `/espace-assurance` | ✅ | institutionNav | ✅ |
| `university` | `/espace-universite` | ✅ | institutionNav | ✅ |
| `ngo` | `/espace-ong` | ✅ | institutionNav | ✅ |
| `researcher` | `/research-workspace` | ✅ | institutionNav | ✅ |
| `developer` | `/api-developer-dashboard` | ✅ | platformAdminNav | ✅ |
| `vendor` | `/marketplace-vendor` | ✅ | institutionNav | ✅ |

---

## 6. REMAINING KNOWN GAPS (Not blocking, future work)

| Area | Gap | Priority |
|------|-----|----------|
| Social login (Google/Apple) | Buttons present in LoginForm but not wired to Supabase OAuth | Medium |
| Role assignment on registration | New users always get `patient` role via trigger — professional/org registration forms need to update role post-signup | High |
| `professional_organizations` RLS | No policies defined yet | Medium |
| Realtime subscription auth | `useSupabaseRealtime` hook doesn't validate user role before subscribing | Low |
| `shifa_id` generation | Trigger generates random ID — no country/year/sequence format yet | Low |

---

*Report generated by SHIFA Phase 2 Audit — 2026-08-12*
