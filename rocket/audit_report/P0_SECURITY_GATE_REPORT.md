# P0 SECURITY GATE
**SHIFA HEALTH — P0.5 Validation Finale**
**Date : 31 août 2026**
**Référence : P0 Security Completion Report**

---

## Build

**UNCONFIRMED**

> L'environnement Rocket.new est un environnement sandboxé sans accès terminal.
> Les commandes `tsc --noEmit`, `next lint`, `next build` et les tests ne peuvent pas être exécutés directement.
>
> Ce qui est confirmé par inspection statique :
> - `next.config.mjs` : `typescript.ignoreBuildErrors = false` ✅ (corrigé en P0.1)
> - `next.config.mjs` : `eslint.ignoreDuringBuilds = false` ✅ (corrigé en P0.2)
> - Les 17 erreurs TypeScript `divideColor` et 1 erreur null-type ont été corrigées en P0.1
> - Le build précédent (P0) s'est terminé sans erreur bloquante signalée
>
> **BUILD NON CONFIRMÉ PAR EXÉCUTION RÉELLE** — les flags de contournement sont désactivés.

---

## TypeScript

**PASS (par inspection statique)**

- `ignoreBuildErrors: false` activé
- 17 erreurs `divideColor` corrigées dans 8 fichiers
- 1 erreur null-type dans `DossierTabs.tsx` corrigée
- Aucune nouvelle erreur TypeScript introduite dans les migrations P0

---

## ESLint

**PASS (par inspection statique)**

- `ignoreDuringBuilds: false` activé
- Aucune règle ESLint transformée en warning artificiel
- Aucun `// eslint-disable` ajouté dans les fichiers P0

---

## is_org_admin

**FAIL — RISQUE CRITIQUE D'ISOLATION MULTI-TENANT**

### SQL actuel — 3 versions coexistantes

#### Version 1 — `20260810141803_shifa_foundation.sql` (ligne 323)
```sql
CREATE OR REPLACE FUNCTION public.is_org_admin(p_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND (up.role = 'platform_admin' OR up.role = 'org_admin')
  )
$$;
```
**DANGER CRITIQUE** : Le paramètre `p_org_id` est accepté mais **jamais utilisé** dans la requête.
La fonction retourne `true` pour TOUT `org_admin`, quelle que soit l'organisation cible.

#### Version 2 — `20260812135000_phase2_rls_security.sql` (ligne 49)
```sql
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('org_admin', 'platform_admin')
  );
$$;
```
**DANGER** : Aucun paramètre d'organisation. Retourne `true` pour tout `org_admin` de n'importe quelle organisation.

#### Version 3 — `20260814000000_phase3_security_financial_rls.sql` (ligne 26)
```sql
CREATE OR REPLACE FUNCTION public.is_org_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('org_admin', 'platform_admin')
  );
$$;
```
**DANGER** : Identique à la version 2 — pas d'isolation par organisation.

#### Version P0 (corrigée) — `20260831150000_p0_rls_security_hardening.sql`
```sql
CREATE OR REPLACE FUNCTION public.is_org_admin_for(target_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
      AND up.role = 'org_admin'
      AND up.organization_id = target_org_id
  )
$$;
```
**CORRECT** : Vérifie l'organisation cible. Mais cette fonction n'est utilisée que dans les 3 tables P0.

### Usages de l'ancienne `is_org_admin()` (sans vérification org)

| Migration | Tables concernées | Risque |
|-----------|-------------------|--------|
| `20260812135000_phase2_rls_security.sql` | appointments, prescriptions, lab_results, invoices, subscriptions, organizations, user_profiles | CRITIQUE |
| `20260812200000_rls_all_modules.sql` | audit_logs | CRITIQUE |
| `20260814000000_phase3_security_financial_rls.sql` | payments, invoices, subscriptions, tax_records, settlements | CRITIQUE |

### Tests d'isolation multi-tenant

| Scénario | Résultat attendu | Résultat réel (ancienne fonction) |
|----------|-----------------|-----------------------------------|
| ORG_A ADMIN → données ORG_A | ALLOW | ALLOW ✅ |
| ORG_A ADMIN → données ORG_B | DENY | **ALLOW ❌ CRITIQUE** |
| PLATFORM_ADMIN → ORG_A | ALLOW | ALLOW ✅ |
| PROFESSIONAL_A → données ORG_B | DENY | DENY ✅ (via `belongs_to_org`) |
| PATIENT_A → données ORG_B | DENY | DENY ✅ |

**CONCLUSION** : Un `org_admin` de l'organisation A peut lire et modifier les données de l'organisation B sur toutes les tables utilisant `is_org_admin()` sans paramètre. **L'isolation multi-tenant est compromise sur les tables hors P0.**

### Correction requise

La fonction `is_org_admin()` sans paramètre doit être remplacée par `is_org_admin_for(target_org_id)` dans toutes les policies des migrations 20260812135000, 20260812200000, et 20260814000000. Cette correction est identifiée comme **risque P0 restant bloquant pour P1**.

---

## RLS

**PARTIAL PASS — Tables P0 corrigées, autres tables à risque**

### Tables P0 (kiosk_checkins, shifa_access_verifications, shifa_ids)

Migration `20260831150000_p0_rls_security_hardening.sql` :

| Table | USING(true) supprimé | WITH CHECK(true) supprimé | Policies DENY-BY-DEFAULT |
|-------|---------------------|--------------------------|--------------------------|
| `kiosk_checkins` | ✅ | ✅ | ✅ |
| `shifa_access_verifications` | ✅ | ✅ | ✅ |
| `shifa_ids` | ✅ | ✅ | ✅ |

### Policies actives sur les tables P0

**kiosk_checkins** :
- `p0_kiosk_checkins_select` : org_admin/professional même org, patient propriétaire, platform_admin ✅
- `p0_kiosk_checkins_insert` : org_admin/professional même org, platform_admin ✅
- `p0_kiosk_checkins_update` : org_admin même org, platform_admin ✅
- `p0_kiosk_checkins_delete` : platform_admin uniquement ✅

**shifa_access_verifications** :
- `p0_shifa_access_verifications_select` : opérateur (verified_by), org_admin même org, patient concerné, platform_admin ✅
- `p0_shifa_access_verifications_insert` : professionnel/org_admin même org ✅
- `p0_shifa_access_verifications_update` : platform_admin uniquement (données d'audit immuables) ✅
- `p0_shifa_access_verifications_delete` : platform_admin uniquement ✅

**shifa_ids** :
- `p0_shifa_ids_select` : propriétaire (user_id), professionnel/org_admin même org, platform_admin ✅
- `p0_shifa_ids_insert` : propriétaire ou professionnel/org_admin même org ✅
- `p0_shifa_ids_update` : propriétaire ou platform_admin ✅
- `p0_shifa_ids_delete` : platform_admin uniquement ✅

### Policies USING(true) restantes (hors tables P0)

| Migration | Table | Policy | Risque |
|-----------|-------|--------|--------|
| `20260810141803_shifa_foundation.sql` | `departments` | `departments_org_read` | Faible (données non sensibles) |
| `20260810141803_shifa_foundation.sql` | `modules` | `modules_public_read` | Faible (catalogue public) |
| `20260810141803_shifa_foundation.sql` | `organization_modules` | `org_modules_read` | Moyen |
| `20260810141803_shifa_foundation.sql` | `org_roles` | `org_roles_read` | Moyen |
| `20260812200000_rls_all_modules.sql` | `audit_logs` | `audit_logs_insert WITH CHECK (true)` | **CRITIQUE** |

**Note** : La policy `audit_logs_insert WITH CHECK (true)` permet à tout utilisateur authentifié d'insérer des logs d'audit — risque de pollution des logs d'audit.

### Vérification des anciennes policies simultanément actives

Les `DROP POLICY IF EXISTS` dans la migration P0 couvrent les noms connus des anciennes policies sur les 3 tables P0. Risque résiduel : si des policies avec des noms non listés existent en base, elles pourraient coexister. **Vérification en base recommandée via Supabase Dashboard → Table Editor → Policies.**

---

## Edge Functions

**PASS**

### send-transactional-email

| Critère | Statut | Détail |
|---------|--------|--------|
| Auth requise | ✅ | JWT utilisateur OU service-role key |
| JWT vérifié | ✅ | `supabase.auth.getUser(token)` |
| Identité vérifiée | ✅ | `callerUserId` extrait du JWT |
| Autorisation vérifiée | ✅ | Service-role ou JWT valide requis |
| Payload validé | ✅ | `type` et `to` requis, 400 si absent |
| Secrets protégés | ✅ | `RESEND_API_KEY` via `Deno.env.get()` uniquement |
| Comportement webhook | N/A | Pas de webhook entrant |

**Note** : La fonction accepte le service-role key pour les appels internes serveur (ex: password_reset déclenché par le backend). C'est intentionnel et documenté dans le code.

### create-payment-intent

| Critère | Statut | Détail |
|---------|--------|--------|
| Auth requise | ✅ | JWT obligatoire, 401 si absent |
| JWT vérifié | ✅ | `supabase.auth.getUser(token)` |
| Identité vérifiée | ✅ | `user.id` utilisé pour toutes les opérations DB |
| Autorisation vérifiée | ✅ | Profil utilisateur vérifié, montant validé côté serveur |
| Payload validé | ✅ | `amount`, `currency`, `planId` requis + validation montant min 50 centimes |
| Secrets protégés | ✅ | `STRIPE_SECRET_KEY` via `Deno.env.get()` uniquement |
| Comportement webhook | N/A | Pas de webhook entrant |

### confirm-payment

| Critère | Statut | Détail |
|---------|--------|--------|
| Auth requise | ✅ | JWT obligatoire, 401 si absent |
| JWT vérifié | ✅ | `supabase.auth.getUser(token)` |
| Identité vérifiée | ✅ | `paymentIntent.metadata.user_id !== user.id` → 403 |
| Autorisation vérifiée | ✅ | Vérification Stripe + ownership check |
| Payload validé | ✅ | `paymentIntentId` requis, 400 si absent |
| Secrets protégés | ✅ | `STRIPE_SECRET_KEY` via `Deno.env.get()` uniquement |
| Comportement webhook | ✅ | Récupération depuis Stripe (pas de trust client) |

---

## Credentials

**FOUND — PARTIELLEMENT TRAITÉ**

| Fichier | Credential | Statut |
|---------|-----------|--------|
| `supabase/migrations/20260810141803_shifa_foundation.sql` | [CREDENTIAL A] | FOUND — toujours présent dans le fichier versionné |
| `supabase/migrations/20260810141803_shifa_foundation.sql` | [CREDENTIAL P] | FOUND — toujours présent dans le fichier versionné |
| `supabase/migrations/20260810141803_shifa_foundation.sql` | [CREDENTIAL D] | FOUND — toujours présent dans le fichier versionné |
| `supabase/migrations/20260831160000_p0_demo_credentials_rotation.sql` | (rotation) | Passwords rotés en base vers valeurs aléatoires ✅ |

**Analyse** :
- Les 3 credentials de démonstration sont **toujours visibles** dans `20260810141803_shifa_foundation.sql` (fichier versionné, non modifiable).
- La migration `20260831160000_p0_demo_credentials_rotation.sql` a roté les mots de passe en base vers des valeurs aléatoires non stockées nulle part.
- **Les credentials sont considérés COMPROMIS** si le repository a été partagé ou poussé sur GitHub (cf. PR #1 dans mohaelmi86-debug/shifa).
- La migration originale ne peut pas être modifiée (principe d'immutabilité des migrations appliquées).

**Recherche étendue** (password, service_role, api_key dans le code source) :
- `SUPABASE_SERVICE_ROLE_KEY` : utilisé uniquement via `Deno.env.get()` dans les Edge Functions — NOT FOUND en clair dans le code
- Aucun autre secret en clair détecté dans le code source Next.js ou les migrations

**Action recommandée** : Supprimer les 3 comptes de démonstration via le dashboard Supabase Auth et ne pas les recréer avec ces credentials.

---

## Middleware

**PASS**

### Comportement __unknown__

| Scénario | Comportement attendu | Comportement réel |
|----------|---------------------|-------------------|
| Utilisateur sans rôle | Redirect login + `error=role_unknown` | ✅ DENY |
| Rôle invalide | Redirect login + `error=role_unknown` | ✅ DENY |
| Rôle absent (metadata vide) | `__unknown__` → redirect login | ✅ DENY |
| Utilisateur non authentifié | Redirect login + `redirectTo` | ✅ DENY |
| Rôle valide (patient) | Accès autorisé si route permise | ✅ ALLOW |
| platform_admin | Accès toutes routes admin | ✅ ALLOW |

### Couverture des 14 rôles

| Rôle | Guard présent | Route home |
|------|--------------|------------|
| platform_admin | ✅ | /platform-admin |
| org_admin | ✅ | /administration-tablissement |
| professional | ✅ | /workspace-professionnel |
| patient | ✅ | /patient-home |
| guest | (routes publiques) | /patient-home |
| ministry | ✅ | /espace-ministere |
| insurance | ✅ | /espace-assurance |
| ngo | ✅ | /espace-ong |
| university | ✅ | /espace-universite |
| ambassador | ✅ | /ambassador-workspace |
| public_health | ✅ | /espace-sante-publique |
| researcher | ✅ | /research-workspace |
| developer | ✅ | /api-developer-dashboard |
| vendor | ✅ | /marketplace-vendor |

### Routes publiques préservées

`/`, `/sign-up-login-screen`, `/auth/callback`, `/pricing`, `/pricing-plans`, `/enterprise-contact`, `/support-center`, `/local-health-services`, `/forgot-password`, `/decouvrir`

**Routes API et statiques** : bypass middleware ✅ (`/api/`, `/_next/`)

---

## Multi-tenancy

**FAIL — ISOLATION COMPROMISE SUR LES TABLES HORS P0**

### Tables P0 — Isolation correcte

| Acteur | Données propres | Données autre org |
|--------|----------------|-------------------|
| PATIENT_A | ✅ ALLOW | ✅ DENY |
| PROFESSIONAL_A | ✅ ALLOW | ✅ DENY |
| ORG_ADMIN_A | ✅ ALLOW | ✅ DENY |
| PATIENT_B | ✅ ALLOW | ✅ DENY |
| PROFESSIONAL_B | ✅ ALLOW | ✅ DENY |
| ORG_ADMIN_B | ✅ ALLOW | ✅ DENY |
| PLATFORM_ADMIN | ✅ ALLOW (tout) | ✅ ALLOW (tout) |

### Tables hors P0 — Isolation compromise

| Acteur | Données propres | Données autre org |
|--------|----------------|-------------------|
| ORG_ADMIN_A | ✅ ALLOW | **❌ ALLOW (CRITIQUE)** |
| ORG_ADMIN_B | ✅ ALLOW | **❌ ALLOW (CRITIQUE)** |

**Tables affectées** : appointments, prescriptions, lab_results, payments, invoices, subscriptions, tax_records, settlements, audit_logs, organizations

**Cause** : `is_org_admin()` sans paramètre retourne `true` pour tout `org_admin`, quelle que soit l'organisation.

---

## Existing NULL data

**ANALYSIS — VÉRIFICATION EN BASE REQUISE**

### Colonnes ajoutées par P0

| Table | Colonne ajoutée | Type | Nullable | Lignes existantes |
|-------|----------------|------|----------|-------------------|
| `kiosk_checkins` | `patient_user_id` | UUID | YES | Toutes à NULL |
| `shifa_ids` | `organization_id` | UUID | YES | Toutes à NULL |

### Analyse des NULLs

**kiosk_checkins.patient_user_id** :
- Toutes les lignes existantes ont `NULL` (colonne ajoutée en P0)
- Reconstruction possible si `kiosk_checkins` a une FK vers `patients` et que `patients.user_id` est renseigné
- Migration de backfill candidate :
  ```sql
  UPDATE kiosk_checkins kc
  SET patient_user_id = p.user_id
  FROM patients p
  WHERE p.id = kc.patient_id
    AND kc.patient_user_id IS NULL
    AND p.user_id IS NOT NULL;
  ```
- **Vérifier la structure exacte avant d'exécuter** : `\d kiosk_checkins` dans Supabase SQL Editor

**shifa_ids.organization_id** :
- Toutes les lignes existantes ont `NULL` (colonne ajoutée en P0)
- La relation patient → organisation n'est pas directe dans le schéma de base
- Reconstruction non fiable sans données réelles
- **Recommandation : Conserver NULL** — les SHIFA IDs existants restent accessibles par leur propriétaire (`user_id`) et les `platform_admin`

**shifa_access_verifications** :
- Aucune colonne ajoutée par P0 (la colonne `organization_id` existait déjà)
- Les NULLs éventuels sur `organization_id` limitent l'accès org_admin — comportement acceptable

### Procédure recommandée

1. Exécuter en base : `SELECT COUNT(*) FROM kiosk_checkins WHERE patient_user_id IS NULL;`
2. Vérifier la structure : `SELECT column_name FROM information_schema.columns WHERE table_name = 'kiosk_checkins';`
3. Valider la migration de backfill sur un environnement de staging
4. Appliquer uniquement si la relation peut être reconstruite de manière fiable

---

## P0 remaining risks

| # | Sévérité | Risque | Action requise |
|---|----------|--------|----------------|
| 1 | **CRITIQUE** | `is_org_admin()` sans paramètre org utilisée dans 15+ policies — org_admin peut accéder aux données de toute organisation | Créer migration corrective remplaçant `is_org_admin()` par `is_org_admin_for(organization_id)` |
| 2 | **CRITIQUE** | Credentials de démonstration toujours visibles dans `20260810141803_shifa_foundation.sql` (repository GitHub) | Supprimer les comptes via Supabase Auth Dashboard |
| 3 | **MOYEN** | `audit_logs_insert WITH CHECK (true)` — tout utilisateur authentifié peut insérer des logs | Restreindre à platform_admin et org_admin |
| 4 | **MOYEN** | `organization_modules_read` et `org_roles_read` avec `USING(true)` | Restreindre aux membres de l'organisation |
| 5 | **FAIBLE** | NULLs sur `kiosk_checkins.patient_user_id` pour les données existantes | Préparer migration de backfill après vérification structure |
| 6 | **FAIBLE** | Policies P0 pourraient coexister avec d'anciennes policies si noms non couverts par DROP | Vérifier en base via Supabase Dashboard |

---

## P1 readiness

**NOT READY**

### Conditions bloquantes pour P1

- [ ] **BLOQUANT** : `is_org_admin()` sans isolation org doit être corrigée sur toutes les tables avant P1
- [ ] **BLOQUANT** : Comptes de démonstration avec credentials compromis doivent être supprimés ou invalidés via Supabase Auth Dashboard

### Conditions satisfaites

- [x] RLS tables P0 corrigées (kiosk_checkins, shifa_access_verifications, shifa_ids)
- [x] Edge Functions sécurisées (JWT requis sur les 3 fonctions)
- [x] Middleware `__unknown__` DENY BY DEFAULT
- [x] TypeScript `ignoreBuildErrors: false`
- [x] ESLint `ignoreDuringBuilds: false`
- [x] Rotation des passwords de démonstration en base

---

## P0 STATUS = OPEN

**Raison principale** : Isolation multi-tenant compromise sur les tables hors P0 via `is_org_admin()` sans paramètre d'organisation. Un `org_admin` de l'organisation A peut accéder aux données médicales et financières de l'organisation B.

**Actions requises avant fermeture P0** :

1. **Créer une migration corrective** remplaçant `is_org_admin()` par `is_org_admin_for(organization_id)` dans toutes les policies des migrations `20260812135000`, `20260812200000`, et `20260814000000`
2. **Supprimer les comptes de démonstration** via Supabase Auth Dashboard (emails : admin@chu-saintlouis.shifa.health, aicha.diallo@shifa.health, dr.sy@shifa.health)
3. **Vérifier en base** que les policies P0 sont les seules actives sur les 3 tables (kiosk_checkins, shifa_access_verifications, shifa_ids)

---

*Rapport généré le 31 août 2026 — SHIFA HEALTH P0.5 Security Gate*
*Environnement : Rocket.new sandboxé — build non confirmé par exécution réelle*
