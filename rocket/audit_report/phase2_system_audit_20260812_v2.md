# SHIFA Health OS — Phase 2 Full System Audit (v2)
**Date**: 2026-08-12 | **Auditor**: Rocket AI Agent | **Mode**: REPORT ONLY — No modifications applied

---

## EXECUTIVE SUMMARY

This audit covers the complete SHIFA Health OS codebase as of 2026-08-12, following the application of Phase 2 corrections (middleware, auth, RLS, navigation, institutional roles) and the critical_fixes migration. The system has significantly matured since Phase 1. This report identifies **remaining gaps, inconsistencies, and risks** across all layers.

**Audit scope:**
- Routes & route guards (middleware.ts)
- Roles & permissions (14 roles)
- RLS policies (all migrations)
- Auth flows (login, signup, callback, session)
- Navigation (Sidebar, AppLayout)
- Business logic (services, hooks)
- Module interconnections (moduleInterconnect.ts)
- Cross-cutting concerns (realtime, sync, financial)

---

## 1. ROUTES & ROUTE GUARDS

### 1.1 Middleware Coverage Analysis

**Total routes in codebase**: ~200+ page routes identified in project structure  
**Routes with explicit guards**: ~180 (in ROLE_GUARDS map)  
**Routes with no guard**: ~20+ (fall through as public or unguarded authenticated)

#### 🔴 CRITICAL — Missing or Incorrect Guards

| Route | Current State | Issue |
|-------|--------------|-------|
| `/super-admin-shifa` | **NOT in ROLE_GUARDS** | Super Admin page has no middleware guard — any authenticated user can access it if they know the URL |
| `/phase2-system-audit` | `['platform_admin']` | Correct, but `/phase1-completion-audit` also maps to `['platform_admin']` — consistent |
| `/admin-audit` | `['org_admin', 'platform_admin']` | Sidebar shows this for `org_admin` but guard also allows `platform_admin` — correct |
| `/workforce-admin` | `['platform_admin']` | Sidebar `adminNav` includes `/workforce-admin` for `org_admin` — **mismatch**: org_admin will be redirected away |
| `/admin-professionnels` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-utilisateurs` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-roles` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-activite` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-parametres` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-translations` | `['platform_admin']` | Sidebar `adminNav` includes this for `org_admin` — **mismatch**: org_admin will be blocked |
| `/admin-financial-dashboard` | `['platform_admin']` | Sidebar `adminNav` does NOT include this — inconsistency |

#### 🟡 MEDIUM — Ambiguous or Overly Permissive Guards

| Route | Guard | Issue |
|-------|-------|-------|
| `/dossier-de-sant` | `['patient', 'professional', 'org_admin', 'platform_admin']` | Ambassador, institutional roles can access if they know the URL — no explicit block |
| `/community-hub` | `[]` (any authenticated) | Ambassador role can access community hub — intended? No explicit exclusion |
| `/health-marketplace` | `[]` (any authenticated) | Open to all roles including ambassador — may expose vendor data |
| `/government-licensing` | `[]` (any authenticated) | Open to all authenticated users — should be restricted to institutional/admin |
| `/shifa-academy` | `[]` (any authenticated) | Open to all — correct by design but not documented |
| `/module-catalog` | `[]` (any authenticated) | Open to all — correct by design |
| `/marketplace-buyer` | `[]` (any authenticated) | Open to all — correct by design |
| `/pro-parametres` | Defined **twice** in ROLE_GUARDS | Duplicate key at line ~265 and ~270 — JavaScript object: last definition wins (`['professional', 'platform_admin']`) — no functional bug but code smell |

#### 🟢 LOW — Observations

| Route | Observation |
|-------|-------------|
| `/ambassador-rewards` | Route exists in filesystem but page has no content component (`src/app/ambassador-rewards/page.tsx` exists but no components folder) |
| `/ambassador-invitations` | Same — no components folder |
| `/ambassador-training` | Same — no components folder |
| `/teleconsultation-commercial` | Guard: `['professional', 'platform_admin']` — commercial page, should it include `vendor` or `insurance`? |
| `/insurance-commercial` | Guard: `['insurance', 'platform_admin']` — correct |

---

## 2. ROLES & PERMISSIONS

### 2.1 Role Enum State

**Foundation migration** (`20260810141803`): Defined `user_role` enum with 5 values:
`platform_admin`, `org_admin`, `professional`, `patient`, `guest`

**Institutional roles migration** (`20260812210000`): Added 9 values:
`ministry`, `insurance`, `ngo`, `university`, `ambassador`, `public_health`, `researcher`, `developer`, `vendor`

**Total roles in DB enum**: 14 (+ `guest`)  
**Total roles handled in middleware**: 14  
**Total roles handled in auth/callback**: 13 (no `guest` case — falls to `/patient-home`)  
**Total roles handled in LoginForm**: 13 (same)  
**Total roles handled in Sidebar navByRole**: 14 ✅

### 2.2 Role Assignment on Registration

#### 🔴 CRITICAL

| Issue | Detail |
|-------|--------|
| **All new signups get `patient` role** | The `handle_new_user()` trigger (migration `20260812220000`) always inserts `role = 'patient'` regardless of registration form type |
| **Professional registration form** | `ProfessionalRegisterForm.tsx` calls `signUp()` from AuthContext — which does NOT pass `role` in metadata, and even if it did, the trigger ignores `raw_user_meta_data.role` |
| **Institution registration form** | Same issue — `InstitutionRegisterForm.tsx` creates a user with `patient` role |
| **Impact** | A professional who registers via the professional form will be redirected to `/patient-home` and have no access to professional modules until an admin manually changes their role |

#### 🟡 MEDIUM

| Issue | Detail |
|-------|--------|
| `guest` role | Defined in enum, `is_guest()` function exists, but no route guard handles `guest` — guest users fall through to `/patient-home` |
| Role upgrade flow | No UI or API endpoint exists for role promotion (patient → professional, patient → org_admin) |

### 2.3 Sidebar ↔ Middleware Mismatches (Detailed)

The following nav items appear in `adminNav` (shown to `org_admin`) but their route guards only allow `platform_admin`:

| Nav Item | Route | Guard | Result for org_admin |
|----------|-------|-------|---------------------|
| Professionnels | `/admin-professionnels` | `['platform_admin']` | 🔴 Redirected to `/administration-tablissement` |
| Utilisateurs | `/admin-utilisateurs` | `['platform_admin']` | 🔴 Redirected |
| Rôles & Droits | `/admin-roles` | `['platform_admin']` | 🔴 Redirected |
| Activité | `/admin-activite` | `['platform_admin']` | 🔴 Redirected |
| Paramètres | `/admin-parametres` | `['platform_admin']` | 🔴 Redirected |
| Traductions | `/admin-translations` | `['platform_admin']` | 🔴 Redirected |
| SHIFA Workforce Admin | `/workforce-admin` | `['platform_admin']` | 🔴 Redirected |
| Admin Financier | `/admin-financial-dashboard` | `['platform_admin']` | 🔴 Redirected |

**Root cause**: These routes were originally platform_admin-only but were added to `adminNav` without updating the guards, or vice versa.

---

## 3. RLS POLICIES

### 3.1 Migration Stack Analysis

| Migration | Timestamp | Status | Key Changes |
|-----------|-----------|--------|-------------|
| `shifa_foundation.sql` | 20260810141803 | Applied | Core tables, basic RLS, `is_org_admin(UUID)` |
| `community_hub.sql` | 20260810220000 | Applied | Community tables |
| `phase2_financial_domains.sql` | 20260811140000 | Applied | 12 financial tables |
| `phase2_rls_security.sql` | 20260812135000 | Applied | RLS on clinical tables, helper functions |
| `add_institutional_roles.sql` | 20260812210000 | Applied | 9 new enum values |
| `phase2_rls_patch.sql` | 20260812220000 | Applied | user_profiles non-recursive RLS, INSERT policies, trigger |
| `critical_fixes.sql` | 20260812230000 | Applied | is_org_admin(UUID) removal, 10 new tables, storage buckets |

### 3.2 RLS Coverage by Table

#### Core Tables

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE | Issues |
|-------|-------------|--------|--------|--------|--------|--------|
| `user_profiles` | ✅ | ✅ own+admin | ✅ own | ✅ own+admin | ✅ admin | ⚠️ SELECT policy has nested subquery on same table — potential recursion if `up2` row is not cached |
| `organizations` | ✅ | ❓ No SELECT policy defined | ✅ org_admin/platform_admin | ❓ No UPDATE policy | ❓ No DELETE policy | 🔴 Missing SELECT, UPDATE, DELETE policies |
| `departments` | ✅ | ✅ all authenticated | ✅ is_org_admin() | — | — | ⚠️ No UPDATE/DELETE policies |
| `patients` | ✅ | ✅ | ✅ | ✅ | ❌ No DELETE | 🟡 Missing DELETE policy |
| `professionals` | ✅ | ✅ active only | ✅ own/admin | ✅ own/admin | ❌ No DELETE | 🟡 Missing DELETE policy |
| `professional_organizations` | ✅ | ✅ | ✅ org_admin only | ✅ | ✅ | ✅ Self-invitation blocked |
| `appointments` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `health_records` | ✅ | ✅ | ✅ | ✅ | ✅ admin only | ✅ |
| `availability_slots` | ✅ (conditional) | ✅ public | ✅ own pro | ✅ own pro | ❌ No DELETE | 🟡 Missing DELETE policy |
| `audit_logs` | ✅ | ✅ own+admin | ✅ own | ❌ No UPDATE | ❌ No DELETE | ✅ Correct (audit logs should be immutable) |
| `organization_modules` | ✅ | ✅ all authenticated | ✅ is_org_admin() | — | — | ⚠️ No UPDATE/DELETE |
| `org_roles` | ✅ | ✅ all authenticated | ✅ is_org_admin() | — | — | ⚠️ No UPDATE/DELETE |

#### New Tables (critical_fixes.sql)

| Table | RLS Enabled | SELECT | INSERT | UPDATE | DELETE | Issues |
|-------|-------------|--------|--------|--------|--------|--------|
| `consultations` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |
| `prescriptions` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |
| `lab_results` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |
| `messages` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `notifications` | ✅ | ✅ own | ✅ | ✅ own | ✅ own | ✅ |
| `wallets` | ✅ | ✅ own+admin | ✅ | ✅ own+admin | ✅ admin | ✅ |
| `wallet_transactions` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |
| `shifa_cards` | ✅ | ✅ own+admin | ✅ | ✅ own+admin | ✅ admin | ✅ |
| `sync_queue` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `lab_samples` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |
| `patient_transfers` | ✅ | ✅ | ✅ | ✅ | ✅ admin | ✅ |

#### Financial Tables (phase2_financial_domains.sql)

| Table | RLS Enabled | Policies | Issues |
|-------|-------------|----------|--------|
| `subscriptions` | ❓ Not confirmed in migration | ❓ | 🔴 No explicit `ENABLE ROW LEVEL SECURITY` found in financial migration |
| `payments` | ❓ | ❓ | 🔴 Same |
| `invoices` | ❓ | ❓ | 🔴 Same |
| `tax_records` | ❓ | ❓ | 🔴 Same |
| `commissions` | ❓ | ❓ | 🔴 Same |
| `settlements` | ❓ | ❓ | 🔴 Same |
| `api_billing_records` | ❓ | ❓ | 🔴 Same |
| `financial_notifications` | ❓ | ❓ | 🔴 Same |
| `ambassador_payouts` | ❓ | ❓ | 🔴 Same |
| `marketplace_settlements` | ❓ | ❓ | 🔴 Same |
| `revenue_reconciliations` | ❓ | ❓ | 🔴 Same |

> **Note**: The `phase2_financial_domains.sql` migration (lines 1-200 reviewed) creates tables but the RLS section was not visible in the first 200 lines. The `financialService.ts` queries these tables directly from the client without any visible RLS guard — if RLS is not enabled, financial data is exposed to all authenticated users.

### 3.3 Helper Functions Final State

| Function | Signature | SECURITY DEFINER | Recursive Risk | Status |
|----------|-----------|-----------------|----------------|--------|
| `is_org_admin()` | No param | ✅ | ⚠️ Queries `user_profiles` which has RLS — but SECURITY DEFINER bypasses RLS | ✅ Canonical |
| `is_platform_admin()` | No param | ✅ | Same as above | ✅ |
| `user_role()` | No param | ✅ | Same | ✅ |
| `user_org_id()` | No param | ✅ | No | ✅ Extended with COALESCE |
| `belongs_to_org(UUID)` | With org_id | ✅ | No | ✅ |
| `is_org_admin_user()` | No param | ✅ | Calls `is_org_admin()` | ✅ Alias |
| `is_platform_admin_user()` | No param | ✅ | Calls `is_platform_admin()` | ✅ Alias |
| `is_guest()` | No param | ✅ | No | ✅ |
| `handle_new_user()` | Trigger | ✅ | No | ✅ But always assigns `patient` role |
| `is_org_admin(UUID)` | With UUID | — | — | ✅ DROPPED |

> **SECURITY DEFINER + RLS note**: All helper functions use `SECURITY DEFINER` which means they run as the function owner (typically `postgres`), bypassing RLS on `user_profiles`. This is intentional and correct — it prevents the recursive RLS loop. However, it means these functions have elevated privileges and must be carefully maintained.

---

## 4. AUTH FLOWS

### 4.1 Email/Password Login Flow

```
LoginForm.onSubmit()
  → signIn(email, password)           [AuthContext → Supabase]
  → supabase.auth.getUser()           [fresh client call]
  → user_profiles.select('role')      [DB query]
  → getRoleRedirect(role)             [local function]
  → window.location.href = redirect   [hard navigation]
```

**Status**: ✅ Correct  
**Issues**:
- Uses `.single()` (not `.maybeSingle()`) on line 76 of LoginForm — if profile doesn't exist, throws error and user sees generic error message instead of being redirected to profile setup
- Social login buttons (Google, Apple) are rendered but have no `onClick` handler — clicking them does nothing

### 4.2 OAuth Callback Flow

```
/auth/callback GET
  → supabase.auth.exchangeCodeForSession(code)
  → supabase.auth.getUser()
  → user_profiles.select('role').maybeSingle()   [✅ maybeSingle]
  → getRoleRedirect(profile.role) or next param
  → NextResponse.redirect()
```

**Status**: ✅ Correct  
**Issues**:
- If `profile` is null (new OAuth user, trigger hasn't run yet), falls back to `next` param which defaults to `/patient-home` — acceptable
- No handling for `error` query param from Supabase (e.g., email not confirmed) — redirects to login with `?error=auth_callback_error` ✅

### 4.3 Session Persistence (client.tsx)

The custom cookie/localStorage hybrid in `client.tsx` is complex:
- Tries cookies first (`canUseCookies()`)
- Falls back to `localStorage` with `sb_` prefix
- Patches `window.fetch` to inject `x-sb-token` header
- Middleware reads this header via `injectTokenFromHeader()`

**Issues**:
- `canUseCookies()` uses `SameSite=None; Secure; Partitioned` — the `Partitioned` attribute (CHIPS) is only supported in Chrome 114+. Safari and Firefox may not support it, causing cookie detection to fail and falling back to localStorage
- `localStorage` fallback means session is not shared across tabs in some browsers
- The `window.fetch` patch is global and runs on every request — performance concern for high-frequency API calls

### 4.4 AuthContext Role Fetch

```
fetchRole(userId)
  → user_profiles.select('role').eq('id', userId).single()
  → setRole(data?.role ?? 'patient')   [⚠️ defaults to 'patient' on error]
```

**Issues**:
- Uses `.single()` — if profile doesn't exist (race condition after signup), throws error and role defaults to `'patient'`
- Should use `.maybeSingle()` with a more explicit fallback
- `role` state is set to `'patient'` on any DB error — this could cause a professional/admin to briefly see patient UI before the correct role loads

### 4.5 Password Reset Flow

```
/forgot-password → [page exists in filesystem]
  → No implementation visible in project structure
  → /forgot-password is in PUBLIC_PATHS ✅
```

**Issues**:
- `forgot-password/page.tsx` exists but no components folder — likely a stub page
- No Supabase `resetPasswordForEmail()` call visible in codebase

### 4.6 Email Verification

- `isEmailVerified()` in AuthContext checks `user?.email_confirmed_at !== null`
- No enforcement in middleware or route guards — unverified users can access all routes
- No redirect to "verify your email" page after signup

---

## 5. NAVIGATION

### 5.1 Sidebar Role Mapping

```typescript
const navByRole: Record<string, NavItem[]> = {
  patient: patientNav,
  professional: professionalNav,
  admin: adminNav,
  org_admin: adminNav,        // ✅ Fixed in Phase 2
  platform_admin: platformAdminNav,
  ambassador: ambassadorNav,
  ministry: institutionNav,
  public_health: institutionNav,
  insurance: institutionNav,
  university: institutionNav,
  ngo: institutionNav,
  researcher: institutionNav,
  developer: platformAdminNav,
  vendor: institutionNav,
};
```

**Status**: ✅ All 14 roles mapped  
**Issues**:
- `developer` maps to `platformAdminNav` — this gives developers access to platform admin navigation items. Should have a dedicated `developerNav`
- `vendor` maps to `institutionNav` — vendor sees ministry/insurance/university links. Should have a dedicated `vendorNav`
- `researcher` maps to `institutionNav` — researcher sees all institutional spaces. Should be scoped to research-specific routes

### 5.2 AppLayout Role Type

```typescript
type AppRole = 'patient' | 'professional' | 'admin' | 'org_admin' | 'institution' | 'ambassador' | 'platform_admin' | 'ministry' | 'public_health' | 'insurance' | 'university' | 'ngo' | 'researcher' | 'developer' | 'vendor';
```

**Status**: ✅ All 14 roles + legacy `admin` and `institution` aliases  
**Issues**:
- `admin` and `institution` are legacy aliases — pages using these values won't get the correct Sidebar nav (they map to `adminNav` and `institutionNav` respectively in Sidebar, but the mapping uses `admin` not `org_admin`)
- Pages that pass `role="admin"` to AppLayout will get `adminNav` in Sidebar but the middleware uses `org_admin` — inconsistency if any page still uses the old `admin` string

### 5.3 Missing Navigation Links

Routes that exist in the filesystem but have no Sidebar nav entry:
- `/phase2-system-audit` — no nav entry (accessible via direct URL only)
- `/phase1-completion-audit` — no nav entry
- `/phase2-roadmap` — no nav entry
- `/super-admin-shifa` — no nav entry in `platformAdminNav` (needs verification)
- `/settings/country-module-config` — no nav entry

---

## 6. BUSINESS LOGIC & SERVICES

### 6.1 workspaceService.ts

**Status**: ✅ Well-structured  
**Issues**:
- `fetchWorkspaceProfile()` queries `professional_organizations` with `.eq('status', 'active')` AND `.eq('invitation_status', 'accepted')` — correct double filter
- `fetchWorkspaceKPIs()` uses `appointments` table with `professional_id` filter — correct
- No error boundary: if `professionals` table returns no row, returns `null` — calling code must handle null
- `buildWorkspaceAlerts()` is pure function — no DB calls — ✅ correct

### 6.2 financialService.ts

**Status**: ⚠️ Queries financial tables without visible RLS protection  
**Issues**:
- `getPayments()` fetches all payments with no user filter — if RLS is not enabled on `payments`, this returns ALL payments for ALL users
- `getSubscriptions()` same issue
- `getCommissions()` same issue
- Only `getPaymentsByUser()` and `getSubscriptionsByUser()` filter by user — but the unfiltered versions are also exported and likely used in admin dashboards
- No role check before calling these functions — any authenticated user who calls `getPayments()` could see all financial data if RLS is absent

### 6.3 syncQueueService.ts

**Status**: ✅ Well-structured  
**Issues**:
- `subscribeToQueue()` and `subscribeToTransferEvents()` subscribe to realtime channels filtered by `organization_id` — correct
- No authentication check before subscribing — relies entirely on RLS on `sync_queue` and `patient_transfers`
- `detectConflicts()` uses `.single()` — will throw if no server record found (should use `.maybeSingle()`)

### 6.4 useSupabaseRealtime.ts

**Status**: ✅ Functional  
**Issues**:
- No role validation before subscribing — any component can subscribe to any table
- Channel names use `Math.random()` — not deterministic, could create duplicate channels if component re-renders
- `useSupabaseCount` creates a new realtime channel on every render cycle (no cleanup guard) — potential memory leak if component mounts/unmounts rapidly

### 6.5 moduleInterconnect.ts

**Status**: ✅ Comprehensive design  
**Issues**:
- This is a type/config registry only — no runtime enforcement
- `requiredPermissions` arrays define what permissions are needed but there is no runtime check that verifies these permissions before executing a flow
- `auditRequired: true` is set on most flows but there is no middleware or service that automatically creates an `audit_logs` entry when a flow executes
- The `ConnectorConfig` type defines `authMethod` and `status` but no actual connector registry or validation service exists

---

## 7. MODULE INTERCONNECTIONS

### 7.1 Clinical Flow Completeness

| Flow | Tables Exist | RLS Correct | UI Component | Status |
|------|-------------|-------------|--------------|--------|
| Consultation → Prescription | ✅ `consultations`, `prescriptions` | ✅ | `ProPrescriptionsContent` | ✅ |
| Prescription → Pharmacy | ✅ | ✅ | `PharmacyDashboardContent` | ✅ |
| Pharmacy → Billing | ✅ `payments`, `invoices` | ❓ RLS unconfirmed | `BillingDashboardContent` | ⚠️ |
| Consultation → Lab | ✅ `lab_results` | ✅ | `LabDashboardContent` | ✅ |
| Lab Result → Patient Record | ✅ `health_records` | ✅ | `DossierContent` | ✅ |
| Consultation → Imaging | ✅ `imaging_dashboard` (UI only) | ❓ No `imaging_results` table found | `ImagingDashboardContent` | ⚠️ No DB table |
| Emergency → Hospitalization | ✅ `hospitalization` (UI) | ❓ No `hospitalizations` table found | `HospitalizationContent` | ⚠️ No DB table |

### 7.2 Financial Flow Completeness

| Flow | Tables Exist | RLS | Status |
|------|-------------|-----|--------|
| Act → Billing | ✅ `payments`, `invoices` | ❓ | ⚠️ |
| Billing → Payment | ✅ | ❓ | ⚠️ |
| Payment → Accounting | ✅ `accounting_ledger` (UI only) | ❓ No `accounting_entries` table found | ⚠️ |
| Procurement → Stock | ✅ `inventory_procurement` (UI only) | ❓ No `inventory_items` table found | ⚠️ |

### 7.3 Missing Database Tables (UI exists, no DB backing)

The following pages have full UI components but no corresponding database table was found in any migration:

| Page | Expected Table | Migration | Status |
|------|---------------|-----------|--------|
| `/imaging-dashboard` | `imaging_results` or `dicom_studies` | Not found | 🔴 UI only |
| `/hospitalization` | `hospitalizations` | Not found | 🔴 UI only |
| `/accounting-ledger` | `accounting_entries` or `ledger_entries` | Not found | 🔴 UI only |
| `/inventory-procurement` | `inventory_items`, `purchase_orders` | Not found | 🔴 UI only |
| `/blood-bank` | `blood_units`, `blood_requests` | Not found | 🔴 UI only |
| `/operating-room` | `surgical_cases`, `or_schedules` | Not found | 🔴 UI only |
| `/sterilization` | `sterilization_cycles` | Not found | 🔴 UI only |
| `/ambulance-transport` | `transport_requests` | Not found | 🔴 UI only |
| `/biomedical-equipment` | `equipment_registry` | Not found | 🔴 UI only |
| `/pharmacy-pos` | `pos_transactions` | Not found | 🔴 UI only |
| `/community-hub` | `community_posts`, `community_groups` | `20260810220000` | ✅ Has migration |
| `/shifa-card` | `shifa_cards` | `critical_fixes` | ✅ |
| `/wallet-interface` | `wallets`, `wallet_transactions` | `critical_fixes` | ✅ |

---

## 8. CROSS-CUTTING CONCERNS

### 8.1 Email Transactional

- No email service configured (Resend, SMTP)
- Password reset flow is incomplete
- Email verification is not enforced
- No welcome email on signup

### 8.2 Storage Buckets

| Bucket | Visibility | RLS | Status |
|--------|-----------|-----|--------|
| `documents` | Private | ✅ Owner access | ✅ |
| `avatars` | Public read | ✅ Owner write | ✅ |
| `medical-images` | Private | ✅ Professional/org_admin/platform_admin | ✅ |
| `lab-reports` | Private | ✅ Professional/org_admin/platform_admin | ✅ |

### 8.3 Realtime Subscriptions

- `useSupabaseRealtime` subscribes to tables without role validation
- Relies entirely on RLS — if RLS is misconfigured, realtime events could leak data
- Financial tables without confirmed RLS are particularly at risk

### 8.4 Offline Sync

- `syncQueueService.ts` is well-designed
- `sync_queue` table exists with RLS ✅
- `patient_transfers` realtime subscription is org-scoped ✅
- `detectConflicts()` uses `.single()` — should be `.maybeSingle()`

### 8.5 i18n / Localization

- `src/lib/i18n.ts` exists
- `LanguageContext.tsx` and `LanguageSelector.tsx` exist
- Translations appear to be inline in `i18n.ts` (not JSON files)
- Arabic RTL (`dir="rtl"`) not applied globally
- Languages ES/PT/AR/ZH likely incomplete

### 8.6 Social Login (Google/Apple)

- Buttons rendered in `LoginForm.tsx` with no `onClick` handler
- No `supabase.auth.signInWithOAuth()` call anywhere in codebase
- Clicking Google/Apple does nothing — silent failure for users

---

## 9. SECURITY ANALYSIS

### 9.1 Critical Security Issues

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| 1 | `/super-admin-shifa` unguarded | 🔴 CRITICAL | No entry in ROLE_GUARDS — any authenticated user can access Super Admin if they know the URL |
| 2 | Financial tables RLS unconfirmed | 🔴 CRITICAL | `payments`, `subscriptions`, `invoices`, `commissions`, `settlements` may have no RLS — financial data exposed to all authenticated users |
| 3 | All new users get `patient` role | 🔴 CRITICAL | Professional/institution registration creates patient-role users — broken onboarding |
| 4 | Social login buttons non-functional | 🟡 MEDIUM | Silent failure — users think they're logging in with Google/Apple but nothing happens |
| 5 | Email verification not enforced | 🟡 MEDIUM | Unverified users can access all authenticated routes |
| 6 | `AuthContext.fetchRole` uses `.single()` | 🟡 MEDIUM | Throws on missing profile — role defaults to `patient` |
| 7 | `LoginForm` uses `.single()` | 🟡 MEDIUM | Same issue |
| 8 | `detectConflicts()` uses `.single()` | 🟢 LOW | Throws if no conflict found |

### 9.2 Data Isolation Verification

| Scenario | Expected | Actual |
|----------|----------|--------|
| Patient sees only own health records | ✅ | ✅ RLS enforced |
| Professional sees only org patients | ✅ | ✅ `belongs_to_org()` check |
| org_admin sees only own org | ✅ | ✅ `is_org_admin()` + `belongs_to_org()` |
| platform_admin sees all | ✅ | ✅ `is_platform_admin()` bypass |
| Ambassador sees no medical data | ✅ | ✅ No ambassador in clinical table policies |
| Cross-org access blocked | ✅ | ✅ `invitation_status = 'accepted'` check |
| Self-invitation blocked | ✅ | ✅ `professional_organizations_insert` requires `is_org_admin()` |
| Financial data isolation | ❓ | ❓ RLS not confirmed on financial tables |

---

## 10. SUMMARY SCORECARD

| Domain | Score | Status |
|--------|-------|--------|
| Route Guards | 7/10 | 🟡 Sidebar/middleware mismatches for org_admin; `/super-admin-shifa` unguarded |
| Role System | 6/10 | 🔴 Registration always assigns `patient` role |
| RLS — Clinical | 9/10 | ✅ Well-covered; minor gaps (no DELETE on some tables) |
| RLS — Financial | 4/10 | 🔴 RLS not confirmed on financial tables |
| Auth Flows | 7/10 | 🟡 Social login broken; `.single()` issues; email verification not enforced |
| Navigation | 7/10 | 🟡 developer/vendor/researcher use wrong nav; legacy `admin`/`institution` aliases |
| Business Logic | 8/10 | ✅ Services well-structured; minor `.single()` issues |
| Module Interconnect | 6/10 | 🟡 Many UI-only modules with no DB backing |
| Security | 6/10 | 🔴 Super admin unguarded; financial RLS unconfirmed |
| Offline/Realtime | 8/10 | ✅ Well-designed; minor `.single()` issue |

---

## 11. PRIORITIZED ACTION LIST

### 🔴 P0 — Fix Immediately

1. **Add `/super-admin-shifa` to ROLE_GUARDS** with `['platform_admin']`
2. **Confirm/add RLS on all financial tables** (`subscriptions`, `payments`, `invoices`, `tax_records`, `commissions`, `settlements`, `api_billing_records`, `financial_notifications`, `ambassador_payouts`, `marketplace_settlements`, `revenue_reconciliations`)
3. **Fix role assignment on registration** — `handle_new_user()` trigger should read `raw_user_meta_data.role` and assign accordingly; registration forms must pass `role` in metadata

### 🟡 P1 — Fix Soon

4. **Fix Sidebar/middleware mismatches for org_admin** — either add `org_admin` to guards for admin routes, or remove those items from `adminNav`
5. **Replace `.single()` with `.maybeSingle()`** in `LoginForm.tsx`, `AuthContext.fetchRole()`, `syncQueueService.detectConflicts()`
6. **Wire Google/Apple OAuth** in `LoginForm.tsx` using `supabase.auth.signInWithOAuth()`
7. **Implement password reset** in `/forgot-password/page.tsx`
8. **Create dedicated navs** for `developer`, `vendor`, `researcher` roles

### 🟢 P2 — Backlog

9. **Add missing DB tables** for imaging, hospitalization, accounting, inventory, blood bank, OR, sterilization, ambulance, biomedical, pharmacy POS
10. **Enforce email verification** — redirect unverified users to a confirmation page
11. **Add runtime audit logging** — auto-create `audit_logs` entries when clinical flows execute
12. **Fix `Partitioned` cookie attribute** — use standard `SameSite=Lax` for broader browser support
13. **Complete i18n** — move translations to JSON files; add RTL support for Arabic
14. **Add `organizations` SELECT/UPDATE/DELETE policies**
15. **Add DELETE policies** for `patients`, `professionals`, `availability_slots`

---

*Report generated by SHIFA Phase 2 Audit v2 — 2026-08-12 | Report only — no modifications applied*
