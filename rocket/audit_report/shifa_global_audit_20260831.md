# SHIFA HEALTH — AUDIT GLOBAL COMPLET
**Date** : 31 août 2026 | **Version** : 1.0 | **Statut** : NON DESTRUCTIF — LECTURE SEULE

---

## SECTION 1 — ARCHITECTURE TECHNIQUE RÉELLE

### Framework & Versions
| Composant | Version | Statut |
|-----------|---------|--------|
| Next.js | 15.5.18 | ✅ Actif |
| React | 19.0.3 | ✅ Actif |
| TypeScript | ^5.x | ✅ Actif |
| Tailwind CSS | 3.4.6 | ✅ Actif |
| @supabase/supabase-js | 2.49.4 | ✅ Actif |
| @supabase/ssr | 0.6.1 | ✅ Actif |
| @stripe/stripe-js | 9.13.0 | ✅ Actif |
| @stripe/react-stripe-js | 6.8.1 | ✅ Actif |
| lucide-react | ^1.7.0 | ✅ Actif |
| recharts | ^2.15.2 | ✅ Actif |
| react-hook-form | ^7.85.0 | ✅ Actif |
| react-hot-toast | 2.4.1 | ✅ Actif |
| @heroicons/react | ^2.2.0 | ✅ Actif |
| @rocketnew/llm-sdk | ^1.1.0 | ✅ Actif (AI) |

### Structure des dossiers
```
src/
├── app/                    ~200+ routes/pages (App Router Next.js 15)
│   ├── api/                Routes API (financial, ai, health-news)
│   ├── auth/callback/      OAuth callback
│   ├── components/         Composants landing page
│   └── [module]/           Pages par module
├── components/             Composants globaux (Sidebar, AppLayout, etc.)
├── contexts/               AuthContext, LanguageContext
├── lib/
│   ├── supabase/           client, server, services (financial, workspace, email, sync)
│   ├── ai/                 aiClient, chatCompletion
│   ├── hooks/              useChat, useSupabaseRealtime
│   └── stripe/             client
└── styles/                 index.css, tailwind.css
supabase/
├── functions/              3 Edge Functions (confirm-payment, send-transactional-email, create-payment-intent)
└── migrations/             17 fichiers de migration
```

### Composants Serveur / Client
- **Server Components** : Layouts, pages statiques (landing, pricing)
- **Client Components** : Tous les composants interactifs (`'use client'` déclaré)
- **Middleware** : `src/middleware.ts` — Auth + RBAC complet (438 lignes)

### Services & Librairies
| Service | Fichier | Statut |
|---------|---------|--------|
| Supabase Client | `src/lib/supabase/client.tsx` | ✅ RÉEL |
| Supabase Server | `src/lib/supabase/server.ts` | ✅ RÉEL |
| Financial Service | `src/lib/supabase/financialService.ts` | ✅ RÉEL |
| Workspace Service | `src/lib/supabase/workspaceService.ts` | ✅ RÉEL |
| Email Service | `src/lib/supabase/emailService.ts` | ✅ RÉEL |
| Sync Queue Service | `src/lib/supabase/syncQueueService.ts` | ✅ RÉEL |
| Transfer State Machine | `src/lib/supabase/transferStateMachine.ts` | ✅ RÉEL |
| AI Client | `src/lib/ai/aiClient.ts` | ✅ RÉEL |
| Stripe Client | `src/lib/stripe/client.ts` | ✅ RÉEL |
| Module Interconnect | `src/lib/moduleInterconnect.ts` | ✅ RÉEL |
| Profession Config | `src/lib/professionConfig.ts` | ✅ RÉEL (1081 lignes) |
| i18n | `src/lib/i18n.ts` | ✅ RÉEL |

### Hooks
- `useSupabaseRealtime` — Abonnements temps réel Supabase (167 lignes)
- `useChat` — Chat AI via API route

### Contextes
- `AuthContext` — Auth complète (signUp, signIn, OTP, signOut, role)
- `LanguageContext` — i18n multi-langue

### Routes API (Next.js)
| Route | Méthode | Rôle |
|-------|---------|------|
| `/api/ai/chat-completion` | POST | Proxy AI (OpenAI/Anthropic/Gemini/Perplexity) |
| `/api/financial/payments` | GET | Lecture paiements (RBAC) |
| `/api/financial/invoices` | GET | Lecture factures |
| `/api/financial/subscriptions` | GET | Lecture abonnements |
| `/api/health-news` | GET | Actualités santé |
| `/auth/callback` | GET | OAuth callback Supabase |

### Edge Functions Supabase
| Fonction | Statut | Description |
|----------|--------|-------------|
| `create-payment-intent` | ✅ RÉEL | Stripe PaymentIntent + enregistrement DB |
| `confirm-payment` | ✅ RÉEL | Confirmation paiement Stripe |
| `send-transactional-email` | ✅ RÉEL | Emails via Resend (7 types) |

### Variables d'Environnement
| Variable | Statut |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Configurée |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Configurée |
| `OPENAI_API_KEY` | ✅ Configurée |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Configurée |
| `NEXT_PUBLIC_SITE_URL` | ✅ Configurée |
| `GEMINI_API_KEY` | ⚠️ Placeholder |
| `ANTHROPIC_API_KEY` | ⚠️ Placeholder |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⚠️ Placeholder |
| `NEXT_PUBLIC_ADSENSE_ID` | ⚠️ Placeholder |
| `PERPLEXITY_API_KEY` | ⚠️ Placeholder |
| `STRIPE_SECRET_KEY` | ⚠️ Non visible (Edge Function) |
| `RESEND_API_KEY` | ⚠️ Non visible (Edge Function) |

### Configuration Build
- `typescript.ignoreBuildErrors: true` — ⚠️ RISQUE : erreurs TS silencieuses en production
- `eslint.ignoreDuringBuilds: true` — ⚠️ RISQUE : warnings ESLint ignorés
- `productionBrowserSourceMaps: true` — Source maps exposées en production
- Port dev : 4028

### Problèmes Détectés
| Problème | Sévérité | Fichier |
|----------|----------|---------|
| `ignoreBuildErrors: true` | 🔴 CRITIQUE | next.config.mjs |
| Source maps en production | 🟡 MOYEN | next.config.mjs |
| `professionConfig.ts` > 1081 lignes | 🟡 MOYEN | src/lib/professionConfig.ts |
| `Sidebar.tsx` 753 lignes | 🟡 MOYEN | src/components/Sidebar.tsx |
| `middleware.ts` 438 lignes | 🟡 MOYEN | src/middleware.ts |
| Badges hardcodés dans Sidebar | 🟡 MOYEN | src/components/Sidebar.tsx |
| `sync_queue` table référencée mais non créée dans migrations visibles | 🔴 CRITIQUE | syncQueueService.ts |
| `stripe_customer_id` sur `user_profiles` non dans migration fondation | 🟡 MOYEN | create-payment-intent/index.ts |

---

## SECTION 2 — CARTOGRAPHIE DE TOUTES LES ROUTES

### Routes Publiques (sans auth)
| Route | Nom | Statut | Données |
|-------|-----|--------|---------|
| `/` | Landing Page | ✅ RÉEL | MOCK |
| `/sign-up-login-screen` | Auth | ✅ RÉEL | RÉEL (Supabase) |
| `/auth/callback` | OAuth Callback | ✅ RÉEL | RÉEL |
| `/pricing` | Tarification | ✅ RÉEL | MOCK |
| `/pricing-plans` | Plans | ✅ RÉEL | MOCK |
| `/enterprise-contact` | Contact Enterprise | ✅ RÉEL | MOCK |
| `/support-center` | Support | ✅ RÉEL | MOCK |
| `/local-health-services` | Services locaux | ✅ RÉEL | MOCK |
| `/forgot-password` | Mot de passe oublié | ✅ RÉEL | PARTIEL |
| `/decouvrir` | Découvrir SHIFA | ✅ RÉEL | MOCK |

### Routes Patient
| Route | Nom | Rôle | Données | Risque |
|-------|-----|------|---------|--------|
| `/patient-home` | Accueil Patient | patient | RÉEL (Supabase RT) | Faible |
| `/patient-explorer` | Explorer | patient | PARTIEL | Moyen |
| `/appointment-booking` | Réservation RDV | tous | RÉEL | Faible |
| `/appointment-history` | Historique RDV | patient | PARTIEL | Moyen |
| `/dossier-de-sant` | Dossier de Santé | patient+pro | RÉEL | Faible |
| `/patient-documents` | Documents | patient | PARTIEL | Moyen |
| `/patient-consultations` | Consultations | patient | PARTIEL | Moyen |
| `/patient-results` | Résultats | patient | PARTIEL | Moyen |
| `/patient-follow-up` | Suivi & Soins | patient | MOCK | Moyen |
| `/patient-vaccination` | Vaccinations | patient | MOCK | Moyen |
| `/patient-prevention` | Prévention | patient | MOCK | Moyen |
| `/patient-chronic-disease` | Maladies chroniques | patient | MOCK | Moyen |
| `/patient-maternal-child` | Santé Maternelle | patient | MOCK | Moyen |
| `/patient-rehabilitation` | Rééducation | patient | MOCK | Moyen |
| `/patient-messages` | Messages | patient | MOCK | Moyen |
| `/patient-teleconsultation` | Téléconsultation | patient | PARTIEL | Moyen |
| `/patient-session-teleconsult` | Session Téléconsult | patient | MOCK | Élevé |
| `/patient-precall-vitals` | Préparer session | patient | MOCK | Moyen |
| `/patient-postcall-survey` | Enquête post-appel | patient | MOCK | Moyen |
| `/patient-emergency` | Urgences | patient | MOCK | Élevé |
| `/patient-emergency-contacts` | Contacts urgence | patient | MOCK | Élevé |
| `/patient-family` | Famille | patient | MOCK | Moyen |
| `/patient-map` | Carte santé | patient | MOCK | Moyen |
| `/patient-notifications` | Notifications | patient | MOCK | Moyen |
| `/patient-privacy` | Confidentialité | patient | MOCK | Moyen |
| `/patient-consent` | Consentements | patient | MOCK | Élevé |
| `/patient-health-programs` | Programmes santé | patient | MOCK | Moyen |
| `/patient-devices-health` | Santé connectée | patient | MOCK | Moyen |
| `/patient-connected-devices` | Appareils connectés | patient | MOCK | Moyen |
| `/patient-shifa-id` | SHIFA ID | patient | RÉEL | Faible |
| `/patient-payments` | Paiements | patient | RÉEL | Faible |
| `/patient-subscriptions` | Abonnements | patient | RÉEL | Faible |
| `/patient-prescription-receipt` | Ordonnances reçues | patient | MOCK | Moyen |
| `/patient-settings` | Paramètres | patient | PARTIEL | Moyen |
| `/shifa-card` | Carte SHIFA | tous | RÉEL | Faible |
| `/shifa-card-management` | Gestion Carte | tous | RÉEL | Faible |
| `/patient-shifa-id` | Mon SHIFA ID | patient | RÉEL | Faible |
| `/shifa-ai-patient` | SHIFA AI Patient | patient | RÉEL (API) | Faible |

### Routes Professionnel (sélection)
| Route | Nom | Données | Risque |
|-------|-----|---------|--------|
| `/workspace-professionnel` | Dashboard Pro | RÉEL (Supabase RT) | Faible |
| `/workspace` | Workspace Métier | RÉEL | Faible |
| `/my-workspace` | Espace Employé | PARTIEL | Moyen |
| `/consultation-workspace` | Consultation | PARTIEL | Moyen |
| `/pro-patients` | Patients | RÉEL | Faible |
| `/pro-agenda` | Agenda | RÉEL | Faible |
| `/pro-prescriptions` | Prescriptions | RÉEL | Faible |
| `/pro-resultats` | Résultats | PARTIEL | Moyen |
| `/pro-messages` | Messagerie | MOCK | Moyen |
| `/pro-billing` | Facturation | RÉEL | Faible |
| `/pro-referrals` | Adressages | MOCK | Moyen |
| `/pro-teleconsultation` | Téléconsultation | MOCK | Élevé |
| `/teleconsultation-session` | Session en cours | MOCK | Élevé |
| `/teleconsultation-lobby` | Lobby | MOCK | Élevé |
| `/teleconsultation-waiting` | Salle d'attente | MOCK | Élevé |
| `/shifa-ai-pro` | SHIFA AI Clinical | RÉEL (OpenAI) | Faible |
| `/shifa-ai-workspace` | SHIFA AI Workspace | RÉEL | Faible |
| `/lab-dashboard` | Laboratoire | PARTIEL | Moyen |
| `/pharmacy-dashboard` | Pharmacie | PARTIEL | Moyen |
| `/pharmacy-pos` | Pharmacie Caisse | MOCK | Moyen |
| `/imaging-dashboard` | Imagerie | MOCK | Moyen |
| `/emergency-dashboard` | Urgences | MOCK | Élevé |
| `/emergency-workspace` | Urgences SAU | MOCK | Élevé |
| `/operating-room` | Bloc Opératoire | MOCK | Élevé |
| `/icu-workspace` | Réanimation | MOCK | Élevé |
| `/blood-bank` | Banque de Sang | MOCK | Élevé |
| `/cardiology-workspace` | Cardiologie | MOCK | Moyen |
| `/nephrology-workspace` | Néphrologie | MOCK | Moyen |
| `/neurology-workspace` | Neurologie | MOCK | Moyen |
| `/gynecology-workspace` | Gynécologie | MOCK | Moyen |
| `/pediatrics-workspace` | Pédiatrie | MOCK | Moyen |
| `/maternity-workspace` | Maternité | MOCK | Moyen |
| `/psychiatry-workspace` | Psychiatrie | MOCK | Moyen |
| `/endocrinology-workspace` | Endocrinologie | MOCK | Moyen |
| `/gastroenterology-workspace` | Gastroentérologie | MOCK | Moyen |
| `/orthopedics-workspace` | Orthopédie | MOCK | Moyen |
| `/rheumatology-workspace` | Rhumatologie | MOCK | Moyen |
| `/hematology-workspace` | Hématologie | MOCK | Moyen |
| `/infectiology-workspace` | Infectiologie | MOCK | Moyen |
| `/pneumology-workspace` | Pneumologie | MOCK | Moyen |
| `/urology-workspace` | Urologie | MOCK | Moyen |
| `/geriatrics-workspace` | Gériatrie | MOCK | Moyen |
| `/palliative-care-workspace` | Soins Palliatifs | MOCK | Moyen |
| `/ophthalmology` | Ophtalmologie | MOCK | Moyen |
| `/dermatology` | Dermatologie | MOCK | Moyen |
| `/dental-care` | Soins Dentaires | MOCK | Moyen |
| `/physiotherapy` | Kinésithérapie | MOCK | Moyen |
| `/speech-therapy` | Orthophonie | MOCK | Moyen |
| `/occupational-therapy` | Ergothérapie | MOCK | Moyen |
| `/nutrition-dietetics` | Nutrition | MOCK | Moyen |
| `/psychology-mental-health` | Psychologie | MOCK | Moyen |
| `/social-work` | Travail Social | MOCK | Moyen |
| `/palliative-care` | Soins Palliatifs | MOCK | Moyen |
| `/pro-anesthesia` | Anesthésie | MOCK | Moyen |
| `/pro-oncology` | Oncologie | MOCK | Moyen |
| `/pro-endoscopy` | Endoscopie | MOCK | Moyen |
| `/medical-certificates` | Certificats | MOCK | Moyen |
| `/shifa-kiosk` | Kiosk | RÉEL | Faible |
| `/shifa-access` | SHIFA Access | RÉEL | Faible |

### Routes Admin Organisation
| Route | Données | Risque |
|-------|---------|--------|
| `/administration-tablissement` | RÉEL | Faible |
| `/hopital-dashboard` | RÉEL | Faible |
| `/hopital-configuration` | PARTIEL | Moyen |
| `/hopital-admissions` | PARTIEL | Moyen |
| `/hopital-dpi` | PARTIEL | Moyen |
| `/org-finance-dashboard` | RÉEL | Faible |
| `/org-analytics` | PARTIEL | Moyen |
| `/org-reporting` | MOCK | Moyen |
| `/org-hr-payroll` | MOCK | Moyen |
| `/org-hr-planning` | MOCK | Moyen |
| `/org-supply-chain` | MOCK | Moyen |
| `/billing-dashboard` | RÉEL | Faible |
| `/inventory-procurement` | MOCK | Moyen |
| `/quality-accreditation` | MOCK | Moyen |
| `/admin-utilisateurs` | RÉEL | Faible |
| `/admin-professionnels` | RÉEL | Faible |
| `/admin-roles` | MOCK | Moyen |
| `/admin-audit` | RÉEL | Faible |

### Routes Platform Admin
| Route | Données | Risque |
|-------|---------|--------|
| `/platform-admin` | RÉEL | Faible |
| `/super-admin-shifa` | RÉEL | Faible |
| `/platform-monitoring` | MOCK | Moyen |
| `/platform-compliance` | MOCK | Moyen |
| `/platform-revenue` | RÉEL | Faible |
| `/admin-financial-dashboard` | RÉEL | Faible |
| `/settings/country-module-config` | PARTIEL | Moyen |
| `/phase1-completion-audit` | MOCK | Faible |
| `/phase2-system-audit` | MOCK | Faible |
| `/phase2-roadmap` | MOCK | Faible |
| `/phase3-completion-report` | MOCK | Faible |

### Routes Institutionnelles
| Route | Rôle | Données |
|-------|------|---------|
| `/espace-ministere` | ministry | MOCK |
| `/espace-assurance` | insurance | MOCK |
| `/espace-universite` | university | MOCK |
| `/espace-ong` | ngo | MOCK |
| `/espace-sante-publique` | public_health | MOCK |
| `/assurance-workspace` | insurance | MOCK |
| `/ministere-oversight` | ministry | MOCK |
| `/epidemio-surveillance` | public_health | MOCK |
| `/research-workspace` | researcher | MOCK |
| `/research-datasets` | researcher | MOCK |
| `/research-ethics-board` | researcher | MOCK |
| `/government-licensing` | tous | MOCK |

### Routes Ambassadeur
| Route | Données |
|-------|---------|
| `/ambassador-workspace` | MOCK |
| `/ambassador-network` | MOCK |
| `/ambassador-commercial` | MOCK |
| `/ambassador-invitations` | MOCK |
| `/ambassador-rewards` | MOCK |
| `/ambassador-training` | MOCK |
| `/ambassador-resources` | MOCK |

### Routes Marketplace / Finance
| Route | Données |
|-------|---------|
| `/health-marketplace` | RÉEL (DB) |
| `/marketplace-vendor` | MOCK |
| `/marketplace-buyer` | RÉEL (DB) |
| `/marketplace-commercial` | MOCK |
| `/checkout` | RÉEL (Stripe) |
| `/wallet-interface` | MOCK |
| `/finance-dashboard` | RÉEL |
| `/accounting-ledger` | MOCK |
| `/subscription-management` | RÉEL |

### Routes Orphelines (accessibles mais absentes de certaines sidebars)
- `/live-module-interactions` — Accessible mais non listé dans sidebar principale
- `/shifa-display` — Org admin uniquement, absent sidebar patient/pro
- `/shifa-desktop` — Accessible pro+org mais peu visible
- `/phase3-completion-report` — Accessible platform_admin mais non dans sidebar
- `/pro-verification` — Accessible pro mais peu visible
- `/lab-lis-connector` — Accessible pro mais peu visible
- `/lab-international-transfer` — Accessible pro mais peu visible
- `/settings/country-module-config` — Sous-route settings, accessible platform_admin

---

## SECTION 3 — CARTOGRAPHIE DES SIDEBARS

### Sidebar Patient (`patientNav`)
**Groupes** : Principal, Ma Santé, Prévention, Communication, Compte
**Nombre d'items** : ~45 liens
**Couverture** : Complète pour les fonctionnalités patient
**Problèmes** :
- Badges hardcodés (2, 3, 1) — non connectés à des données réelles
- `/settings` (Langue & Région) pointe vers une route platform_admin uniquement → ⚠️ RBAC incohérent

### Sidebar Professionnel (`professionalNav`)
**Groupes** : Principal, Clinique, Téléconsultation, Espaces Spécialisés, Outils & Services, Compte
**Nombre d'items** : ~100+ liens
**Couverture** : Très large — toutes les spécialités médicales
**Problèmes** :
- Badges hardcodés (5, 4, 7, 2, 3)
- Doublons : `/maternity` et `/maternity-workspace`, `/pediatrics` et `/pediatrics-workspace`, `/emergency` et `/emergency-dashboard` et `/emergency-workspace`
- `/settings` pointe vers route platform_admin

### Sidebar Admin Organisation (`adminNav`)
**Groupes** : Principal, Gestion, Analyse, Compte
**Nombre d'items** : ~55 liens
**Couverture** : Complète pour gestion hospitalière
**Problèmes** :
- Badge hardcodé (3) sur Professionnels
- Doublons : `/biomedical-maintenance` et `/org-biomedical-maintenance`, `/sterilization` et `/org-sterilization-central`, `/supply-chain` et `/org-supply-chain`

### Sidebar Institutionnelle (`institutionNav`)
**Groupes** : Espaces institutionnels, Espaces de travail, Gestion
**Nombre d'items** : ~18 liens
**Couverture** : Partielle — manque des espaces spécifiques par rôle (assureur, ONG, université)
**Problèmes** :
- Tous les rôles institutionnels (ministry, insurance, ngo, university, public_health) partagent la même sidebar → manque de personnalisation

### Sidebar Ambassadeur (`ambassadorNav`)
**Groupes** : Principal, Activité, Ressources
**Nombre d'items** : 8 liens
**Couverture** : Correcte pour le rôle ambassadeur

### Sidebar Développeur (`developerNav`)
**Groupes** : Principal, Ressources
**Nombre d'items** : 9 liens
**Couverture** : Minimale

### Sidebar Vendeur (`vendorNav`)
**Groupes** : Principal, Ressources
**Nombre d'items** : 6 liens
**Couverture** : Minimale

### Sidebar Chercheur (`researcherNav`)
**Groupes** : Principal, Analyse, Ressources
**Nombre d'items** : 8 liens
**Couverture** : Correcte

### Sidebar Platform Admin (`platformAdminNav`)
**Groupes** : Principal, Gestion, Commercial & Tarification, Système
**Nombre d'items** : ~50 liens
**Couverture** : Très large
**Problèmes** :
- Plusieurs liens pointent vers `/platform-admin` (Organisations, Utilisateurs, Abonnements, Ambassadeurs, Sécurité, Paramètres) → routes non différenciées

---

## SECTION 4 — CARTOGRAPHIE DES UTILISATEURS ET RÔLES

### Rôles Techniques (Enum `user_role` en DB)
Définis dans la migration fondation + migration institutionnelle :
`platform_admin`, `org_admin`, `professional`, `patient`, `guest`, `ministry`, `insurance`, `ngo`, `university`, `ambassador`, `public_health`, `researcher`, `developer`, `vendor`

### Rôles Métier Détaillés

| Rôle Technique | Rôle Métier | Home Route | Sidebar | Tables Accessibles |
|----------------|-------------|------------|---------|-------------------|
| `platform_admin` | Super Admin SHIFA | `/platform-admin` | platformAdminNav | Toutes |
| `org_admin` | Admin Établissement | `/administration-tablissement` | adminNav | organizations, user_profiles, professionals, appointments, health_records, modules, org_roles, audit_logs |
| `professional` | Professionnel de santé | `/workspace-professionnel` | professionalNav | professionals, appointments, health_records, availability_slots, patients (via RLS) |
| `patient` | Patient | `/patient-home` | patientNav | patients (own), appointments (own), health_records (own), shifa_ids (own), shifa_cards (own) |
| `ministry` | Ministère de la Santé | `/espace-ministere` | institutionNav | organizations (read), audit_logs (read) |
| `insurance` | Assurance / Mutuelle | `/espace-assurance` | institutionNav | insurance_claims, organizations (read) |
| `ngo` | ONG / Humanitaire | `/espace-ong` | institutionNav | ngo_partnerships, funding_campaigns |
| `university` | Université / École | `/espace-universite` | institutionNav | organizations (read) |
| `ambassador` | Ambassadeur SHIFA | `/ambassador-workspace` | ambassadorNav | commissions, ambassador_payouts |
| `public_health` | Santé Publique | `/espace-sante-publique` | institutionNav | organizations (read), audit_logs (read) |
| `researcher` | Chercheur | `/research-workspace` | researcherNav | research_datasets (hypothétique) |
| `developer` | Développeur API | `/api-developer-dashboard` | developerNav | api_billing_records |
| `vendor` | Vendeur Marketplace | `/marketplace-vendor` | vendorNav | marketplace_products, marketplace_settlements |
| `guest` | Invité | N/A | N/A | Aucune |

### Rôles Manquants (présents dans la vision mais absents du code)
- `nurse` / `infirmier` — Pas de rôle technique distinct (fusionné dans `professional`)
- `pharmacist` / `pharmacien` — Pas de rôle distinct
- `lab_technician` — Pas de rôle distinct
- `radiologist` — Pas de rôle distinct
- `ambulance_driver` — Pas de rôle distinct
- `hr_manager` — Pas de rôle distinct
- `accountant` — Pas de rôle distinct
- `logistics` — Pas de rôle distinct

**Constat** : Tous les professionnels de santé (médecin, infirmier, pharmacien, kinésithérapeute, etc.) sont regroupés sous le rôle unique `professional`. La différenciation se fait via le champ `profession` dans la table `professionals`, non via le rôle auth.

---

## SECTION 5 — PROFESSIONNELS LIBÉRAUX

### Gestion Actuelle
La table `professionals` contient :
- `profession` (TEXT) — ex: "Médecin généraliste"
- `specialty` (TEXT) — ex: "Médecine générale"
- `country_code` (TEXT) — pays d'exercice
- `teleconsultation` (BOOLEAN) — mode téléconsultation
- `is_verified` (BOOLEAN) — vérification
- `status` (professional_status) — active/pending/suspended/inactive

### Ce qui est PRÉSENT
✅ Profession + Spécialité : OUI (champs séparés)
✅ Mode d'exercice (téléconsultation) : PARTIEL (boolean uniquement)
✅ Pays : OUI (country_code)
✅ Organisation : OUI (via `professional_organizations`)
✅ Relation patient : OUI (via `appointments`, `health_records`)
✅ Permissions : OUI (JSONB dans `professional_organizations`)

### Ce qui est ABSENT ou PARTIEL
❌ Mode d'exercice libéral vs salarié : NON DISTINGUÉ
❌ Numéro RPPS / ADELI / équivalent national : NON (license_number présent mais non structuré)
❌ Spécialité hiérarchisée (spécialité principale + sous-spécialité) : NON
❌ Accréditations par pays : NON
❌ Tarification par acte (NGAP, CCAM) : NON
❌ Secteur de conventionnement (secteur 1/2/3 France) : NON
❌ Cabinet libéral multi-sites : PARTIEL (professional_organizations multi-entrées)

### `professionConfig.ts` (1081 lignes)
Contient des configurations détaillées pour ~30+ professions avec modules, stats rapides, et liens. C'est le moteur du workspace professionnel. **STATUT : RÉEL et fonctionnel**.

---

## SECTION 6 — MODULES SHIFA

### Comparaison avec l'Architecture Cible

| Module Cible | Statut | Routes | Tables | Maturité |
|-------------|--------|--------|--------|----------|
| SHIFA CORE | ✅ EXISTE | `/` | user_profiles, organizations | 🟢 Mature |
| SHIFA ID | ✅ EXISTE | `/patient-shifa-id` | shifa_ids, patients | 🟡 Partiel |
| SHIFA CARD | ✅ EXISTE | `/shifa-card`, `/shifa-card-management` | shifa_cards, card_delivery_orders | 🟡 Partiel |
| SHIFA RIGHTS | ❌ ABSENT | — | — | 🔴 Absent |
| PATIENT SHIFA | ✅ EXISTE | `/patient-home` + ~30 routes | patients, appointments, health_records | 🟢 Mature |
| MÉDECIN SHIFA | ✅ EXISTE | `/workspace-professionnel` + ~50 routes | professionals, appointments | 🟢 Mature |
| INFIRMIER SHIFA | ⚠️ PARTIEL | Fusionné dans pro | — | 🟡 Partiel |
| HÔPITAL SHIFA | ✅ EXISTE | `/hopital-dashboard` + ~10 routes | organizations, departments | 🟡 Partiel |
| PHARMACIE SHIFA | ✅ EXISTE | `/pharmacy-dashboard`, `/pharmacy-pos` | marketplace_products | 🟡 Partiel |
| LABORATOIRE SHIFA | ✅ EXISTE | `/lab-dashboard`, `/laboratory-lms` | health_records | 🟡 Partiel |
| IMAGERIE SHIFA | ✅ EXISTE | `/imaging-dashboard`, `/imaging-lms` | health_records | 🟡 Partiel |
| URGENCES | ✅ EXISTE | `/emergency`, `/emergency-dashboard`, `/emergency-workspace` | appointments | 🟡 Partiel |
| MATERNITÉ | ✅ EXISTE | `/maternity`, `/maternity-workspace` | health_records | 🟡 Partiel |
| PÉDIATRIE | ✅ EXISTE | `/pediatrics`, `/pediatrics-workspace` | health_records | 🟡 Partiel |
| BANQUE DE SANG | ✅ EXISTE | `/blood-bank` | — | 🔴 MOCK |
| AMBULANCES | ✅ EXISTE | `/ambulance-transport` | — | 🔴 MOCK |
| BLOC OPÉRATOIRE | ✅ EXISTE | `/operating-room` | — | 🔴 MOCK |
| RÉANIMATION | ✅ EXISTE | `/icu-workspace` | — | 🔴 MOCK |
| NUTRITION | ✅ EXISTE | `/nutrition-dietetics` | — | 🔴 MOCK |
| KINÉSITHÉRAPIE | ✅ EXISTE | `/physiotherapy` | — | 🔴 MOCK |
| ERGOTHÉRAPIE | ✅ EXISTE | `/occupational-therapy` | — | 🔴 MOCK |
| ORTHOPHONIE | ✅ EXISTE | `/speech-therapy` | — | 🔴 MOCK |
| PSYCHOLOGIE | ✅ EXISTE | `/psychology-mental-health` | — | 🔴 MOCK |
| PSYCHIATRIE | ✅ EXISTE | `/psychiatry-workspace` | — | 🔴 MOCK |
| DENTAIRE | ✅ EXISTE | `/dental-care` | — | 🔴 MOCK |
| OPHTALMOLOGIE | ✅ EXISTE | `/ophthalmology` | — | 🔴 MOCK |
| CARDIOLOGIE | ✅ EXISTE | `/cardiology-workspace` | — | 🔴 MOCK |
| NEUROLOGIE | ✅ EXISTE | `/neurology-workspace` | — | 🔴 MOCK |
| NÉPHROLOGIE | ✅ EXISTE | `/nephrology-workspace` | — | 🔴 MOCK |
| GASTROENTÉROLOGIE | ✅ EXISTE | `/gastroenterology-workspace` | — | 🔴 MOCK |
| RHUMATOLOGIE | ✅ EXISTE | `/rheumatology-workspace` | — | 🔴 MOCK |
| ANESTHÉSIE | ✅ EXISTE | `/pro-anesthesia` | — | 🔴 MOCK |
| ONCOLOGIE | ✅ EXISTE | `/pro-oncology` | — | 🔴 MOCK |
| ENDOSCOPIE | ✅ EXISTE | `/pro-endoscopy` | — | 🔴 MOCK |
| PNEUMOLOGIE | ✅ EXISTE | `/pneumology-workspace` | — | 🔴 MOCK |
| ENDOCRINOLOGIE | ✅ EXISTE | `/endocrinology-workspace` | — | 🔴 MOCK |
| HÉMATOLOGIE | ✅ EXISTE | `/hematology-workspace` | — | 🔴 MOCK |
| INFECTIOLOGIE | ✅ EXISTE | `/infectiology-workspace` | — | 🔴 MOCK |
| UROLOGIE | ✅ EXISTE | `/urology-workspace` | — | 🔴 MOCK |
| GÉRIATRIE | ✅ EXISTE | `/geriatrics-workspace` | — | 🔴 MOCK |
| ORTHOPÉDIE | ✅ EXISTE | `/orthopedics-workspace` | — | 🔴 MOCK |
| GYNÉCOLOGIE-OBSTÉTRIQUE | ✅ EXISTE | `/gynecology-workspace` | — | 🔴 MOCK |
| SOINS PALLIATIFS | ✅ EXISTE | `/palliative-care`, `/palliative-care-workspace` | — | 🔴 MOCK |
| RH | ✅ EXISTE | `/hr-module`, `/org-hr-payroll`, `/org-hr-planning` | — | 🔴 MOCK |
| FINANCE | ✅ EXISTE | `/finance-dashboard`, `/billing-dashboard` | payments, invoices, subscriptions | 🟡 Partiel |
| COMPTABILITÉ | ✅ EXISTE | `/accounting-ledger` | — | 🔴 MOCK |
| FACTURATION | ✅ EXISTE | `/billing-dashboard`, `/pro-billing` | invoices, payments | 🟡 Partiel |
| MARKETPLACE | ✅ EXISTE | `/health-marketplace`, `/marketplace-buyer`, `/marketplace-vendor` | marketplace_products, health_services | 🟡 Partiel |
| ACHATS GROUPÉS | ❌ ABSENT | — | — | 🔴 Absent |
| LOGISTIQUE | ⚠️ PARTIEL | `/org-supply-chain`, `/supply-chain` | — | 🔴 MOCK |
| SHIFA ACADEMY | ✅ EXISTE | `/shifa-academy`, `/academy-dashboard` | — | 🔴 MOCK |
| ONG | ✅ EXISTE | `/espace-ong` | ngo_partnerships, funding_campaigns | 🟡 Partiel |
| GOUVERNEMENT | ✅ EXISTE | `/espace-ministere`, `/ministere-oversight` | — | 🔴 MOCK |
| SANTÉ PUBLIQUE | ✅ EXISTE | `/espace-sante-publique`, `/epidemio-surveillance` | — | 🔴 MOCK |
| ÉPIDÉMIOLOGIE | ✅ EXISTE | `/epidemio-surveillance` | — | 🔴 MOCK |
| SHIFA AI | ✅ EXISTE | `/shifa-ai-pro`, `/shifa-ai-patient`, `/shifa-ai-workspace`, etc. | — | 🟡 Partiel (OpenAI connecté) |
| ANALYTICS | ✅ EXISTE | `/org-analytics`, `/platform-revenue` | — | 🟡 Partiel |
| SHIFA CONNECT | ⚠️ PARTIEL | Téléconsultation | — | 🔴 MOCK |
| TÉLÉCONSULTATION | ✅ EXISTE | 5+ routes | — | 🔴 MOCK |
| MESSAGERIE | ✅ EXISTE | `/pro-messages`, `/patient-messages` | — | 🔴 MOCK |
| DOCUMENTS | ✅ EXISTE | `/patient-documents`, `/pro-documents`, `/org-documents` | health_records | 🟡 Partiel |
| NOTIFICATIONS | ✅ EXISTE | `/notifications-center`, `/patient-notifications` | — | 🔴 MOCK |
| COMMUNAUTÉ | ✅ EXISTE | `/community-hub` | ngo_partnerships, health_services | 🟡 Partiel |
| EMPLOI/STAGES | ✅ EXISTE | `/shifa-emploi-stage` | — | 🔴 MOCK |
| INNOVATION | ✅ EXISTE | `/innovation-center` | — | 🔴 MOCK |
| INTEROPÉRABILITÉ | ✅ EXISTE | `/interoperability-hub` | — | 🔴 MOCK (UI seulement) |

---

## SECTION 7 — BASE DE DONNÉES SUPABASE

### Tables Existantes (par migration)

#### Migration Fondation (`20260810141803`)
| Table | Colonnes Clés | RLS | Triggers |
|-------|--------------|-----|---------|
| `user_profiles` | id, email, full_name, role, phone, country_code, preferred_language | ✅ | set_updated_at, handle_new_user |
| `organizations` | id, name, org_type, country_code, city, is_verified | ✅ | set_updated_at |
| `departments` | id, organization_id, name, head_professional_id | ✅ | — |
| `patients` | id, user_id, shifa_id, first_name, last_name, dob, gender, blood_type | ✅ | set_updated_at |
| `professionals` | id, user_id, profession, specialty, license_number, teleconsultation, is_verified | ✅ | set_updated_at |
| `professional_organizations` | professional_id, organization_id, department_id, permissions | ✅ | — |
| `appointments` | id, patient_id, professional_id, scheduled_at, status, teleconsultation | ✅ | set_updated_at |
| `health_records` | id, patient_id, record_type, content, is_signed, is_confidential | ✅ | set_updated_at |
| `availability_slots` | id, professional_id, slot_date, start_time, end_time, is_available | ✅ | — |
| `modules` | id, code, name, category, applicable_org_types, is_core | ✅ | — |
| `organization_modules` | organization_id, module_id, is_active, settings | ✅ | — |
| `org_roles` | id, organization_id, name, permissions | ✅ | — |
| `audit_logs` | id, organization_id, user_id, action, resource_type, details | ✅ | — |

#### Migration Financial Domains (`20260811140000`)
| Table | Description |
|-------|-------------|
| `subscriptions` | Abonnements utilisateurs/organisations |
| `payments` | Paiements (Stripe, Mobile Money, etc.) |
| `invoices` | Factures |
| `tax_records` | Enregistrements fiscaux |
| `commissions` | Commissions ambassadeurs |
| `settlements` | Règlements marketplace |
| `api_billing_records` | Facturation API |
| `card_delivery_orders` | Commandes carte physique |
| `insurance_claims` | Demandes de remboursement assurance |
| `ambassador_payouts` | Paiements ambassadeurs |
| `marketplace_settlements` | Règlements vendeurs |

#### Migration Community Hub (`20260810220000`)
| Table | Description |
|-------|-------------|
| `ngo_partnerships` | Partenariats ONG |
| `health_services` | Services de santé listés |
| `marketplace_products` | Produits marketplace |
| `funding_campaigns` | Campagnes de financement |
| `funding_contributions` | Contributions aux campagnes |

#### Migration SHIFA ID Access (`20260814050000`)
| Table | Description |
|-------|-------------|
| `shifa_ids` | Registre canonique SHIFA ID |
| `kiosk_checkins` | Événements de badgeage kiosk |
| `shifa_access_verifications` | Vérifications d'identité SHIFA Access |

#### Migrations Additionnelles
- `shifa_cards` — Cartes SHIFA physiques (référencée dans seed mais migration non lue complètement)
- `vital_signs` — Constantes vitales (référencée dans composants)
- `prescriptions` — Prescriptions (référencée dans composants)
- `user_settings` — Paramètres utilisateur (`20260814020000`)
- `sync_queue` — File de synchronisation offline (référencée dans `syncQueueService.ts` mais migration non visible)

### Tables Manquantes (référencées dans le code mais non confirmées dans migrations)
| Table | Référencée dans | Risque |
|-------|----------------|--------|
| `sync_queue` | `syncQueueService.ts` | 🔴 CRITIQUE |
| `vital_signs` | `VitalSignsAndPrescriptions.tsx` | 🔴 CRITIQUE |
| `prescriptions` | Multiples composants | 🔴 CRITIQUE |
| `shifa_cards` | `ShifaCardContent.tsx`, seed | 🟡 MOYEN |
| `messages` | `ProMessagesContent`, `PatientMessagesContent` | 🟡 MOYEN |
| `notifications` | `NotificationsCenterContent` | 🟡 MOYEN |
| `teleconsultation_sessions` | Routes téléconsultation | 🟡 MOYEN |
| `research_datasets` | `ResearchDatasetsContent` | 🟡 MOYEN |
| `stripe_customer_id` sur `user_profiles` | `create-payment-intent` | 🟡 MOYEN |

### Fonctions DB
- `handle_new_user()` — Auto-création profil à l'inscription ✅
- `set_updated_at()` — Auto-update timestamps ✅
- `generate_shifa_id()` — Génération SHIFA ID ✅
- `is_org_admin()` — Vérification rôle org admin ✅
- `is_platform_admin()` — Vérification rôle platform admin ✅

### Politiques RLS — Risques Identifiés
| Table | Politique | Risque |
|-------|-----------|--------|
| `kiosk_checkins` | `authenticated_read_kiosk_checkins: USING (true)` | 🔴 Tout utilisateur authentifié peut lire tous les check-ins |
| `shifa_access_verifications` | `authenticated_manage_shifa_access: USING (true)` | 🔴 Tout utilisateur authentifié peut lire/écrire toutes les vérifications |
| `health_services` | `public_read_health_services: TO public` | 🟡 Données publiques sans auth |
| `marketplace_products` | `public_read_marketplace_products: TO public` | 🟡 Données publiques sans auth |
| `ngo_partnerships` | `public_read_ngo_partnerships: TO public` | 🟡 Données publiques sans auth |
| `patients` | Pas de politique pour les professionnels | 🔴 Un professionnel ne peut pas lire les patients de ses consultations via RLS |

### Storage
Non audité directement — aucune migration Storage visible.

### Realtime
Activé via `useSupabaseRealtime` hook sur : `appointments`, `vital_signs`, `prescriptions`.

### Edge Functions
3 fonctions déployées (voir Section 1).

---

## SECTION 8 — PARCOURS MÉDICAL COMPLET

### Analyse des Dépendances

```
Patient (auth.users → user_profiles)
  ↓ RÉEL ✅
SHIFA ID (shifa_ids, patients.shifa_id)
  ↓ RÉEL ✅
Identifiants nationaux
  ↓ ❌ ABSENT (license_number non structuré, pas d'INS/RPPS)
SHIFA Card (shifa_cards)
  ↓ RÉEL ✅ (table créée, UI connectée)
SHIFA Rights
  ↓ ❌ ABSENT (aucune table de droits de santé)
Rendez-vous (appointments)
  ↓ RÉEL ✅
Consultation (health_records)
  ↓ RÉEL ✅
Dossier médical (health_records, vital_signs)
  ↓ PARTIEL ⚠️ (vital_signs table incertaine)
Prescription (prescriptions)
  ↓ PARTIEL ⚠️ (table incertaine)
Pharmacie (pharmacy_dashboard)
  ↓ MOCK ❌ (pas de liaison prescription → dispensation)
Laboratoire (lab_dashboard)
  ↓ PARTIEL ⚠️ (health_records type lab_result)
Imagerie (imaging_dashboard)
  ↓ MOCK ❌ (pas de DICOM réel)
Suivi (pro-patient-monitoring)
  ↓ MOCK ❌
Facturation (invoices, payments)
  ↓ RÉEL ✅ (Stripe intégré)
Assurance/Mutuelle (insurance_claims)
  ↓ PARTIEL ⚠️ (table créée, UI mock)
Paiement (checkout, Stripe)
  ↓ RÉEL ✅
Remboursement
  ↓ MOCK ❌ (insurance_claims.reimbursed_amount présent mais pas de workflow)
```

### Ruptures Identifiées
1. **SHIFA Rights** — Aucun moteur de droits de santé (couverture, taux, plafonds)
2. **Prescription → Pharmacie** — Pas de liaison numérique ordonnance → dispensation
3. **Imagerie DICOM** — Aucune intégration DICOM réelle
4. **Remboursement** — Workflow incomplet (insurance_claims existe mais pas de processus)
5. **Identifiants nationaux** — Pas de structure pour INS, RPPS, ADELI, etc.
6. **Consentement** — Page UI existe mais pas de table de consentements

---

## SECTION 9 — SHIFA ID

### État Actuel
- **Table `shifa_ids`** : ✅ Créée (patient_id, user_id, shifa_id, status, verification_level, qr_code_data)
- **Table `patients.shifa_id`** : ✅ Champ TEXT UNIQUE
- **Génération** : Fonction `generate_shifa_id(gender, country)` → Format `SH-{gender}-{country}-{year}-{random4}`
- **UI** : `/patient-shifa-id` — Connectée à Supabase ✅
- **QR Code** : Déterministe basé sur SHIFA ID ✅
- **Historique d'accès** : Via `audit_logs` ✅
- **Niveaux de vérification** : basic / verified / biometric ✅

### Ce qui Manque
❌ **Multi-pays** : Format SHIFA ID inclut country_code mais pas de liaison avec systèmes nationaux
❌ **Identifiants nationaux** : Pas de table `national_identifiers` (INS, RPPS, NIN, etc.)
❌ **Déduplication d'identité** : Pas de mécanisme anti-doublons
❌ **Consentement lié à l'identité** : Pas de table de consentements
❌ **Identité internationale** : Pas de liaison avec systèmes étrangers
❌ **Historique des modifications** : Pas de versioning de l'identité

---

## SECTION 10 — SHIFA CARD

### État Actuel
- **Table `shifa_cards`** : ✅ Créée (user_id, patient_id, shifa_id, card_number, card_type, status, qr_code_data, issued_at, expires_at, delivery_status)
- **Table `card_delivery_orders`** : ✅ Créée (user_id, card_type, delivery_address, delivery_fee, payment_id, status, tracking_number)
- **UI** : `/shifa-card` — Connectée à Supabase ✅
- **Commande physique** : Formulaire → `card_delivery_orders` ✅
- **QR Code** : Présent ✅
- **Statuts** : active / suspended / revoked ✅

### Ce qui Manque
❌ **NFC** : Aucune implémentation
❌ **Puce** : Aucune implémentation
❌ **Photo** : Pas de champ photo sur la carte
❌ **Droits de santé** : Pas de liaison avec SHIFA Rights
❌ **Mode offline** : Pas de données embarquées sur la carte
❌ **Révocation** : UI présente mais workflow incomplet
❌ **Contrôle manuel exceptionnel** : Pas de workflow
❌ **Journalisation des interventions manuelles** : Partiel (audit_logs)

---

## SECTION 11 — SHIFA RIGHTS ENGINE

### État Actuel
**STATUT : ❌ ABSENT**

Aucune table dédiée aux droits de santé n'a été identifiée dans les migrations. Les `insurance_claims` existent mais ne constituent pas un moteur de droits.

### Ce qui Manque
❌ Table `health_rights` ou `coverage_plans`
❌ Taux de prise en charge par acte
❌ Plafonds de remboursement
❌ Actes couverts
❌ Médicaments couverts
❌ Période de validité des droits
❌ Consommation des droits
❌ Activation manuelle exceptionnelle
❌ Validation / révocation
❌ Audit des droits

---

## SECTION 12 — MARKETPLACE / ACHATS GROUPÉS

### État Actuel
| Fonctionnalité | Statut | Table |
|---------------|--------|-------|
| Catalogue produits | ✅ RÉEL | `marketplace_products` |
| Fournisseurs/vendeurs | ✅ PARTIEL | `organizations` (seller_organization_id) |
| Stocks | ✅ PARTIEL | `marketplace_products.stock_quantity` |
| Commandes B2B | ❌ ABSENT | — |
| Commandes individuelles | ❌ ABSENT | — |
| Commandes gouvernementales | ❌ ABSENT | — |
| Commandes ONG | ❌ ABSENT | — |
| Commandes hospitalières | ❌ ABSENT | — |
| Commandes pharmacies | ❌ ABSENT | — |
| **ACHATS GROUPÉS** | ❌ ABSENT | — |
| Paiement | ✅ RÉEL | `payments`, Stripe |
| Commissions | ✅ RÉEL | `commissions` |
| Séparation des fonds | ✅ PARTIEL | `settlements`, `marketplace_settlements` |

### Manquant Critique
❌ Table `orders` / `order_items` — Aucune table de commandes
❌ Achats groupés — Concept absent du schéma
❌ Consolidation des besoins — Absent
❌ Livraison unique / colis commun — Absent

---

## SECTION 13 — INTEROPÉRABILITÉ

### État Actuel
**STATUT GLOBAL : 🔴 MOCK — UI seulement**

La page `/interoperability-hub` affiche une interface très complète avec :
- Standards : FHIR R4, HL7 v2.x, DICOM 3.0, CDA R2, IHE XDS.b, SNOMED CT
- APIs : REST, GraphQL, WebSocket
- Webhooks : 5 webhooks simulés
- Intégrations : 8 partenaires simulés
- Logs : Journaux simulés

**Mais toutes ces données sont MOCK** — hardcodées dans le composant.

### Intégrations Réellement Implémentées
| Standard | Statut |
|----------|--------|
| FHIR | ❌ MOCK uniquement |
| HL7 | ❌ MOCK uniquement |
| DHIS2 | ❌ ABSENT |
| OpenMRS | ❌ ABSENT |
| Pro Santé Connect | ❌ ABSENT |
| INS | ❌ ABSENT |
| MSSanté | ❌ ABSENT |
| DMP / Mon espace santé | ❌ ABSENT |
| SESAM-Vitale | ❌ ABSENT |
| ADRi | ❌ ABSENT |
| Systèmes africains | ❌ ABSENT |

**Seule intégration réelle** : Supabase (DB), Stripe (paiements), Resend (emails), OpenAI (IA).

---

## SECTION 14 — HORS-LIGNE

### État Actuel
| Composant | Statut | Détail |
|-----------|--------|--------|
| PWA | ❌ ABSENT | Pas de manifest.json, pas de service worker |
| Service Worker | ❌ ABSENT | Non configuré |
| Cache | ⚠️ PARTIEL | `syncQueueService.ts` implémente un cache local en mémoire |
| IndexedDB | ❌ ABSENT | Non utilisé |
| Synchronisation | ⚠️ PARTIEL | `ShifaSyncQueueService` avec file de priorité |
| File d'attente offline | ⚠️ PARTIEL | Implémentée en mémoire (non persistante) |
| Résolution des conflits | ⚠️ PARTIEL | `detectConflicts()` implémentée mais basique |
| Sécurité données locales | ⚠️ PARTIEL | `encryptedLocally: true` flag mais pas de chiffrement réel |
| UI Offline Config | ✅ EXISTE | `/offline-mode-config` — UI complète mais MOCK |

**Constat** : L'infrastructure offline est partiellement architecturée (`syncQueueService`, `transferStateMachine`) mais non déployée en production. La table `sync_queue` est référencée mais sa migration n'est pas confirmée.

---

## SECTION 15 — IA SHIFA

### État Actuel
| Fonctionnalité IA | Statut | Implémentation |
|------------------|--------|----------------|
| IA clinique (aide consultation) | ✅ RÉEL | `/shifa-ai-pro` → OpenAI via `/api/ai/chat-completion` |
| Extraction médicale | ✅ PARTIEL | Prompts système dans ShifaAIProContent |
| Aide à la documentation | ✅ RÉEL | Notes cliniques, courriers, CIM-10 |
| Diagnostics différentiels | ✅ RÉEL | Outil dédié dans ShifaAIProContent |
| Interactions médicamenteuses | ✅ RÉEL | Outil prescription dans ShifaAIProContent |
| Aide à la prescription | ✅ RÉEL | Vérification posologies |
| Analyse des résultats | ❌ ABSENT | Pas d'analyse automatique des résultats labo |
| Surveillance épidémiologique | ❌ ABSENT | UI mock uniquement |
| IA pharmacie | ✅ PARTIEL | `/shifa-ai-pharmacy` — connectée à OpenAI |
| IA patient | ✅ PARTIEL | `/shifa-ai-patient` — connectée à OpenAI |
| IA organisation | ✅ PARTIEL | `/shifa-ai-org`, `/shifa-ai-institution` |
| IA recherche | ✅ PARTIEL | `/shifa-ai-research` |
| Gouvernance IA | ❌ ABSENT | Pas de framework de gouvernance |
| Validation humaine | ⚠️ PARTIEL | Disclaimer dans l'UI uniquement |
| Audit IA | ❌ ABSENT | Pas de journalisation des décisions IA |

### Providers Configurés
- **OpenAI** : ✅ Clé configurée
- **Anthropic** : ⚠️ Placeholder
- **Gemini** : ⚠️ Placeholder
- **Perplexity** : ⚠️ Placeholder

---

## SECTION 16 — FINANCE / PAIEMENTS

### État Actuel
| Fonctionnalité | Statut | Implémentation |
|---------------|--------|----------------|
| Facturation | ✅ RÉEL | `invoices` table + `/billing-dashboard` |
| Paiements Stripe | ✅ RÉEL | Edge Functions + `payments` table |
| Mobile Money | ❌ ABSENT | Enum présent mais pas d'intégration |
| Assurances | ⚠️ PARTIEL | `insurance_claims` table, UI mock |
| Mutuelles | ❌ ABSENT | Pas de distinction mutuelle/assurance |
| ONG | ⚠️ PARTIEL | `funding_campaigns`, `funding_contributions` |
| Programmes gouvernementaux | ❌ ABSENT | — |
| Remboursements | ⚠️ PARTIEL | Champs présents, workflow absent |
| Comptes établissements | ✅ RÉEL | `settlements` table |
| Commissions | ✅ RÉEL | `commissions` table |
| Séparation fonds SHIFA/tiers | ✅ PARTIEL | `settlements`, `marketplace_settlements` |
| Abonnements | ✅ RÉEL | `subscriptions` table + Stripe |
| Taxes | ✅ PARTIEL | `tax_records` table, UI mock |

---

## SECTION 17 — SÉCURITÉ

### Authentification
| Mécanisme | Statut |
|-----------|--------|
| Email/Password | ✅ RÉEL |
| OTP Email | ✅ RÉEL |
| OAuth | ✅ PARTIEL (callback configuré) |
| MFA | ❌ ABSENT |
| Session management | ✅ RÉEL (Supabase SSR) |
| Email confirmation gate | ✅ RÉEL (middleware) |

### RBAC
| Aspect | Statut |
|--------|--------|
| Rôles définis | ✅ 14 rôles |
| Guards middleware | ✅ RÉEL (438 lignes) |
| RLS Supabase | ✅ RÉEL (toutes tables) |
| Permissions granulaires | ⚠️ PARTIEL (JSONB dans professional_organizations) |

### Risques de Sécurité Identifiés
| Risque | Sévérité | Détail |
|--------|----------|--------|
| `kiosk_checkins` RLS trop permissive | 🔴 CRITIQUE | Tout auth peut lire tous les check-ins |
| `shifa_access_verifications` RLS trop permissive | 🔴 CRITIQUE | Tout auth peut lire/écrire |
| `ignoreBuildErrors: true` | 🔴 CRITIQUE | Erreurs TS silencieuses |
| Source maps en production | 🟡 MOYEN | Code source exposé |
| Badges hardcodés dans Sidebar | 🟡 MOYEN | Données fictives affichées |
| `stripe_customer_id` non dans migration | 🟡 MOYEN | Colonne potentiellement manquante |
| Comptes démo dans migrations | 🟡 MOYEN | Mots de passe en clair dans SQL |
| Pas de rate limiting | 🟡 MOYEN | API routes non protégées |
| Pas de CSRF explicite | 🟡 MOYEN | Next.js protège partiellement |
| Pas de validation Zod côté serveur | 🟡 MOYEN | Validation client uniquement |
| Multi-tenancy partiel | 🟡 MOYEN | organization_id non systématiquement vérifié |

### Chiffrement
- Données en transit : ✅ HTTPS (Supabase/Vercel)
- Données au repos : ✅ Supabase (PostgreSQL chiffré)
- Données locales offline : ⚠️ Flag `encryptedLocally` mais pas de chiffrement réel

---

## SECTION 18 — TESTS / PRODUCTION

| Aspect | Statut |
|--------|--------|
| TypeScript strict | ✅ `strict: true` dans tsconfig |
| Build errors ignorés | 🔴 `ignoreBuildErrors: true` |
| ESLint ignoré au build | 🔴 `ignoreDuringBuilds: true` |
| Tests unitaires | ❌ ABSENT |
| Tests d'intégration | ❌ ABSENT |
| Tests E2E | ❌ ABSENT |
| Monitoring | ❌ ABSENT (GA placeholder) |
| Logs structurés | ⚠️ PARTIEL (console.warn/error) |
| CI/CD | ❌ Non visible |
| Variables d'environnement | ⚠️ PARTIEL (5 placeholders) |
| Erreurs silencieuses | 🔴 Oui (ignoreBuildErrors) |
| Performance | ⚠️ Non mesuré |

---

## SECTION 19 — MATRICE FONCTIONNELLE

### Matrice Acteur × Module × Action (sélection)

| Acteur | Module | READ | CREATE | UPDATE | DELETE | SIGN | VALIDATE | SHARE | BILL | PAY | CONSENT | ADMIN |
|--------|--------|------|--------|--------|--------|------|----------|-------|------|-----|---------|-------|
| Patient | Dossier | ✅ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ⚠️ | ❌ | ✅ | ⚠️ | ❌ |
| Patient | RDV | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Patient | SHIFA ID | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Professionnel | Dossier | ✅ | ✅ | ✅ | ❌ | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ❌ | ❌ |
| Professionnel | RDV | ✅ | ✅ | ✅ | ⚠️ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Professionnel | Prescription | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Org Admin | Utilisateurs | ✅ | ✅ | ✅ | ⚠️ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Org Admin | Finance | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Platform Admin | Tout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Assurance | Dossier | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ONG | Campagnes | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

*✅ = Implémenté | ⚠️ = Partiel | ❌ = Absent*

### Matrice Acteur × Donnée × Niveau d'Accès

| Acteur | Données Personnelles | Données Médicales | Données Financières | Données Org | Données Publiques |
|--------|---------------------|-------------------|--------------------|-----------|--------------------|
| Patient | FULL (own) | FULL (own) | FULL (own) | NONE | READ |
| Professionnel | READ (patients) | READ+WRITE (patients) | READ (own) | READ (org) | READ |
| Org Admin | READ+WRITE (org) | READ (org) | FULL (org) | FULL (own) | READ |
| Platform Admin | FULL | FULL | FULL | FULL | FULL |
| Assurance | NONE | PARTIAL (claims) | READ (claims) | NONE | READ |
| ONG | NONE | NONE | READ (campaigns) | NONE | READ |
| Chercheur | ANONYMIZED | ANONYMIZED | NONE | NONE | READ |

---

## SECTION 20 — DÉPENDANCES

### Graphe de Dépendances

```
IDENTITÉ (auth.users)
  ↓ RÉEL ✅
SHIFA ID (shifa_ids, patients.shifa_id)
  ↓ RÉEL ✅
PATIENT (patients, user_profiles)
  ↓ RÉEL ✅
SHIFA CARD (shifa_cards)
  ↓ RÉEL ✅ (table) / ❌ (NFC, puce)
SHIFA RIGHTS
  ↓ ❌ ABSENT — RUPTURE CRITIQUE
SOINS (appointments, health_records)
  ↓ RÉEL ✅
PHARMACIE / LABO / IMAGERIE
  ↓ PARTIEL ⚠️ (health_records) / MOCK ❌ (dispensation, DICOM)
FINANCE (payments, invoices, subscriptions)
  ↓ RÉEL ✅ (Stripe)
MARKETPLACE (marketplace_products, health_services)
  ↓ PARTIEL ⚠️ (pas de table orders)
LOGISTIQUE
  ↓ MOCK ❌
SANTÉ PUBLIQUE (epidemio-surveillance)
  ↓ MOCK ❌
INTEROPÉRABILITÉ (interoperability-hub)
  ↓ MOCK ❌
SYSTÈMES NATIONAUX / INTERNATIONAUX
  ↓ ❌ ABSENT
```

### Dépendances Obligatoires Non Satisfaites
1. **SHIFA Rights** → bloque : couverture soins, remboursements, accès pharmacie
2. **Table `orders`** → bloque : marketplace fonctionnelle, achats groupés
3. **Interopérabilité réelle** → bloque : échanges inter-établissements
4. **Table `prescriptions`** → bloque : liaison consultation → pharmacie
5. **Table `vital_signs`** → bloque : monitoring patient temps réel

---

## SECTION 21 — COMPARAISON AVEC LA VISION SHIFA

| Capacité Vision | État Actuel | Écart |
|----------------|-------------|-------|
| Fonctionner avec systèmes nationaux | ❌ ABSENT | Majeur |
| Conserver spécificités pays | ⚠️ PARTIEL (country_code) | Moyen |
| SHIFA ID comme lien international | ⚠️ PARTIEL (format multi-pays) | Moyen |
| Dossier SHIFA longitudinal | ✅ RÉEL (health_records) | Faible |
| Échanges internationaux contrôlés | ❌ ABSENT | Majeur |
| Connecter patients+pros+hôpitaux+pharmacies | ✅ PARTIEL | Moyen |
| Connecter gouvernements+ONG+assureurs | ⚠️ PARTIEL (UI mock) | Moyen |
| Connecter universités+fournisseurs+OMS | ❌ ABSENT | Majeur |
| Gérer droits de santé | ❌ ABSENT | Critique |
| Soutenir financements soins | ⚠️ PARTIEL (insurance_claims) | Moyen |
| Marketplace + achats groupés | ⚠️ PARTIEL (pas d'orders) | Moyen |
| Santé publique + épidémiologie | ❌ MOCK | Majeur |
| IA progressive | ✅ PARTIEL (OpenAI) | Moyen |
| Fonctionner hors ligne | ⚠️ PARTIEL (architecture) | Moyen |

---

## SECTION 22 — RAPPORT FINAL

### Résumé Exécutif
SHIFA HEALTH est un projet **ambitieux et bien architecturé** avec une base technique solide (Next.js 15, Supabase, Stripe, OpenAI). Le projet dispose d'une **couverture fonctionnelle exceptionnellement large** (~200 routes, 14 rôles, 30+ spécialités médicales) mais avec une **profondeur variable** : certains modules sont pleinement connectés à des données réelles, d'autres sont des interfaces MOCK sans backend.

### Fonctionnalités RÉELLES (connectées à Supabase/Stripe/OpenAI)
- Auth complète (signUp, OTP, signIn, signOut, RBAC middleware)
- Gestion patients, professionnels, organisations, départements
- Rendez-vous (CRUD complet)
- Dossiers de santé (health_records)
- SHIFA ID + SHIFA Card + SHIFA Access + Kiosk
- Paiements Stripe (PaymentIntent, confirmation)
- Abonnements, factures, commissions, règlements
- Emails transactionnels (Resend, 7 types)
- IA clinique (OpenAI via API route)
- Temps réel (useSupabaseRealtime sur appointments, vital_signs, prescriptions)
- Marketplace produits (catalogue)
- Campagnes de financement ONG
- Partenariats ONG

### Fonctionnalités MOCK (UI sans backend réel)
- Téléconsultation (sessions, lobby, waiting)
- Messagerie (patient et professionnel)
- Notifications
- Toutes les spécialités médicales (cardiologie, neurologie, etc.)
- Urgences, bloc opératoire, réanimation
- Interopérabilité (FHIR, HL7, DICOM)
- Santé publique et épidémiologie
- RH, paie, comptabilité
- Ambassadeurs (réseau, récompenses)
- Mode offline (UI config uniquement)

### Fonctionnalités ABSENTES (ni UI ni backend)
- SHIFA Rights Engine
- Achats groupés
- Identifiants nationaux structurés
- Consentements (table)
- Intégrations nationales (INS, RPPS, SESAM-Vitale, etc.)
- MFA
- Tests automatisés

### Risques Critiques
1. 🔴 `ignoreBuildErrors: true` — Erreurs TypeScript silencieuses en production
2. 🔴 RLS trop permissives sur `kiosk_checkins` et `shifa_access_verifications`
3. 🔴 Table `sync_queue` référencée mais migration non confirmée
4. 🔴 Tables `vital_signs` et `prescriptions` référencées mais migrations non confirmées
5. 🔴 Comptes démo avec mots de passe dans les migrations SQL
6. 🔴 SHIFA Rights Engine absent — bloque le parcours médical complet

### Risques de Sécurité
1. 🔴 RLS kiosk_checkins : `USING (true)` — tout utilisateur authentifié voit tout
2. 🔴 RLS shifa_access_verifications : `USING (true)` — idem
3. 🟡 Source maps en production (code source exposé)
4. 🟡 Pas de rate limiting sur les API routes
5. 🟡 Pas de MFA
6. 🟡 Pas de validation Zod côté serveur

### Incohérences UX
1. Badges hardcodés dans la Sidebar (2, 3, 1, 5, 4, 7) — données fictives
2. `/settings` dans sidebar patient/pro pointe vers route platform_admin
3. Doublons de routes dans sidebar pro (maternity/maternity-workspace, etc.)
4. Tous les rôles institutionnels partagent la même sidebar
5. Plusieurs liens platform_admin pointent vers `/platform-admin` sans différenciation

### Incohérences RBAC/ABAC
1. Rôle `professional` trop générique — médecin, infirmier, pharmacien, kiné ont le même rôle
2. RLS `patients` : un professionnel ne peut pas lire les patients de ses consultations via RLS standard
3. `is_org_admin()` ne vérifie pas l'organization_id — tout org_admin peut agir sur toutes les orgs
4. Middleware `__unknown__` role — laisse passer sans bloquer

### Top 20 Améliorations Prioritaires

| # | Amélioration | Action | Priorité |
|---|-------------|--------|----------|
| 1 | Corriger `ignoreBuildErrors: true` | AMÉLIORER | 🔴 P0 |
| 2 | Corriger RLS kiosk_checkins et shifa_access_verifications | AMÉLIORER | 🔴 P0 |
| 3 | Confirmer/créer migrations pour vital_signs, prescriptions, sync_queue | AJOUTER | 🔴 P0 |
| 4 | Créer SHIFA Rights Engine (table coverage_plans, health_rights) | AJOUTER | 🔴 P1 |
| 5 | Créer table `orders` / `order_items` pour marketplace | AJOUTER | 🔴 P1 |
| 6 | Connecter téléconsultation à un vrai service (WebRTC/Daily.co) | CONNECTER | 🔴 P1 |
| 7 | Connecter messagerie à Supabase Realtime | CONNECTER | 🟡 P2 |
| 8 | Connecter notifications à Supabase | CONNECTER | 🟡 P2 |
| 9 | Ajouter MFA (TOTP) | AJOUTER | 🟡 P2 |
| 10 | Ajouter validation Zod côté serveur (API routes) | AMÉLIORER | 🟡 P2 |
| 11 | Corriger `is_org_admin()` pour vérifier l'organization_id | AMÉLIORER | 🟡 P2 |
| 12 | Ajouter table `national_identifiers` pour SHIFA ID multi-pays | AJOUTER | 🟡 P2 |
| 13 | Connecter badges Sidebar à des données réelles | AMÉLIORER | 🟡 P2 |
| 14 | Différencier sidebars par rôle institutionnel | AMÉLIORER | 🟡 P3 |
| 15 | Ajouter table `consents` pour gestion des consentements | AJOUTER | 🟡 P3 |
| 16 | Implémenter PWA (manifest + service worker) | AJOUTER | 🟡 P3 |
| 17 | Ajouter tests unitaires (Jest/Vitest) | AJOUTER | 🟡 P3 |
| 18 | Retirer source maps de production | AMÉLIORER | 🟡 P3 |
| 19 | Ajouter rate limiting sur API routes | AMÉLIORER | 🟡 P3 |
| 20 | Implémenter achats groupés (table group_orders) | AJOUTER | 🟢 P4 |

### Architecture Cible Recommandée

```
SHIFA CORE (auth, RBAC, multi-tenant)
  ├── SHIFA ID (identité + identifiants nationaux)
  ├── SHIFA CARD (carte physique + NFC)
  ├── SHIFA RIGHTS (droits de santé + couverture)
  └── SHIFA CONSENT (consentements)

SHIFA CLINICAL (dossier médical)
  ├── Consultations + Prescriptions (table prescriptions)
  ├── Résultats (vital_signs + lab_results)
  ├── Imagerie (DICOM intégration)
  └── Spécialités (workspaces connectés)

SHIFA CONNECT (communication)
  ├── Téléconsultation (WebRTC réel)
  ├── Messagerie (Supabase Realtime)
  └── Notifications (Supabase Realtime)

SHIFA FINANCE (paiements)
  ├── Facturation + Paiements (Stripe ✅)
  ├── SHIFA RIGHTS ENGINE (couverture)
  └── Marketplace + Orders (table orders)

SHIFA PUBLIC (santé publique)
  ├── Épidémiologie (données réelles)
  └── Interopérabilité (FHIR réel)

SHIFA OFFLINE (hors-ligne)
  ├── PWA + Service Worker
  └── Sync Queue (table confirmée)
```

### Plan d'Évolution NON DESTRUCTIF

**Phase A — Stabilisation (P0, sans casser l'existant)**
1. Corriger `ignoreBuildErrors` → `false` (résoudre les erreurs TS)
2. Corriger RLS kiosk_checkins et shifa_access_verifications
3. Créer migrations manquantes (vital_signs, prescriptions, sync_queue)
4. Ajouter `stripe_customer_id` à la migration user_profiles

**Phase B — Connexion des modules critiques (P1)**
5. Créer SHIFA Rights Engine (nouvelles tables, sans modifier l'existant)
6. Créer table `orders` / `order_items` (nouvelle table)
7. Connecter messagerie à Supabase Realtime (nouveaux canaux)
8. Connecter notifications à Supabase (nouvelle table)

**Phase C — Sécurité & Qualité (P2)**
9. Ajouter MFA (nouvelle fonctionnalité auth)
10. Ajouter validation Zod (nouvelles fonctions, sans modifier les routes)
11. Corriger `is_org_admin()` (amélioration fonction existante)
12. Ajouter table `national_identifiers`

**Phase D — Fonctionnalités Avancées (P3-P4)**
13. Téléconsultation réelle (WebRTC)
14. PWA + Service Worker
15. Achats groupés
16. Interopérabilité FHIR réelle
17. Tests automatisés

**Règle absolue** : Chaque phase CONSERVE toutes les routes et composants existants. Les nouvelles fonctionnalités s'ajoutent, elles ne remplacent pas.

---

*Rapport généré le 31 août 2026 — SHIFA HEALTH Global Audit v1.0*
*Aucune modification du code n'a été effectuée dans le cadre de cet audit.*
