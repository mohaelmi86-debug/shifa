# SHIFA HEALTH — PLAN DIRECTEUR DE RÉORGANISATION v2.0
**Date** : 31 août 2026 | **Mode** : AUDIT + ARCHITECTURE — AUCUNE MODIFICATION DE CODE
**Basé sur** : Audit Global SHIFA HEALTH v1.0 (shifa_global_audit_20260831.md)
**Règle absolue** : NE RIEN SUPPRIMER · NE PAS CODER · NE PAS MIGRER · NE PAS MODIFIER LES TABLES · NE PAS MODIFIER LES RLS · NE PAS MODIFIER LES ROUTES · NE PAS MODIFIER LES SIDEBARS

---

## TABLE DES MATIÈRES

1. Architecture SHIFA Cible
2. Architecture des Rôles
3. Architecture Professions / Spécialités
4. Architecture Modes d'Exercice
5. Architecture Organisations
6. Architecture Sidebars
7. Architecture SHIFA ID
8. Architecture SHIFA Rights
9. Architecture Consent
10. Architecture RBAC / ABAC / RLS
11. Architecture Break-Glass
12. Architecture Internationale
13. Architecture Interopérabilité
14. Cartographie Routes → Modules
15. Cartographie Modules → Tables
16. Cartographie MOCK / RÉEL / PARTIEL / ABSENT
17. Doublons et Stratégie de Consolidation
18. Dépendances Critiques
19. Risques de Sécurité
20. Plan de Migration NON DESTRUCTIF
21. Ordre Exact Recommandé des Futures Implémentations

---

## SECTION 1 — ARCHITECTURE SHIFA CIBLE

### Vision Générale

SHIFA HEALTH doit devenir la **couche de connexion, de continuité et d'interopérabilité** entre les systèmes de santé nationaux — non pas les remplacer. L'architecture cible s'organise autour de **17 domaines fonctionnels** (SHIFA Domains), chacun autonome mais interconnecté via SHIFA ID comme couche d'identité transversale.

### Les 17 Domaines SHIFA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHIFA PLATFORM                                    │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  SHIFA CORE  │  │ SHIFA IDENTITY│  │  SHIFA CARD  │  │ SHIFA RIGHTS │   │
│  │  Auth/RBAC   │  │  SHIFA ID    │  │  QR/NFC/Puce │  │  Couverture  │   │
│  │  Orgs/Users  │  │  Nat.IDs     │  │  Offline     │  │  Assurance   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  SHIFA CARE  │  │SHIFA CONNECT │  │SHIFA DIAGNOS.│  │SHIFA PHARMACY│   │
│  │  Patients    │  │  Messagerie  │  │  Labo/LIS    │  │  Dispensation│   │
│  │  Dossiers    │  │  Téléconsult │  │  Imagerie    │  │  Stock/POS   │   │
│  │  Prescriptions│  │  Notifs      │  │  DICOM       │  │  Interactions│   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │SHIFA EMERGENCY│  │SHIFA ORGANIZ.│  │SHIFA FINANCE │  │ SHIFA SUPPLY │   │
│  │  Urgences    │  │  Établissmt  │  │  Facturation │  │  Fournisseurs│   │
│  │  Ambulances  │  │  RH/Finance  │  │  Paiements   │  │  Achats grp. │   │
│  │  Triage/Bloc │  │  Qualité     │  │  Remboursmt  │  │  Logistique  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │SHIFA PUB.HLTH│  │SHIFA INTEROP.│  │SHIFA ACADEMY │  │   SHIFA AI   │   │
│  │  Épidémio.   │  │  FHIR/HL7    │  │  Formation   │  │  IA Clinique │   │
│  │  Surveillance│  │  DICOM       │  │  Recherche   │  │  IA Pharma   │   │
│  │  Alertes     │  │  Connecteurs │  │  Éthique     │  │  Gouvernance │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    SHIFA ID (Couche Transversale)                    │  │
│  │         Lien mondial entre tous les domaines et systèmes             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mapping Domaines → État Actuel

| Domaine SHIFA | État | Priorité |
|---------------|------|----------|
| SHIFA CORE | ✅ RÉEL (mature) | Maintenir |
| SHIFA IDENTITY | ⚠️ PARTIEL | P1 |
| SHIFA CARD | ⚠️ PARTIEL | P2 |
| SHIFA RIGHTS | ❌ ABSENT | P0 |
| SHIFA CARE | ✅ RÉEL (partiel) | P1 |
| SHIFA CONNECT | 🔴 MOCK | P2 |
| SHIFA DIAGNOSTICS | ⚠️ PARTIEL | P2 |
| SHIFA PHARMACY | ⚠️ PARTIEL | P2 |
| SHIFA EMERGENCY | 🔴 MOCK | P3 |
| SHIFA ORGANIZATION | ⚠️ PARTIEL | P2 |
| SHIFA FINANCE | ✅ RÉEL (Stripe) | Maintenir |
| SHIFA SUPPLY | 🔴 MOCK | P3 |
| SHIFA PUBLIC HEALTH | 🔴 MOCK | P3 |
| SHIFA INTEROPERABILITY | 🔴 MOCK | P3 |
| SHIFA ACADEMY | 🔴 MOCK | P4 |
| SHIFA AI | ⚠️ PARTIEL (OpenAI) | P2 |

---

## SECTION 2 — ARCHITECTURE DES RÔLES

### Principe Fondamental

**Séparer AUTH ROLE de PROFESSION de SPÉCIALITÉ de MODE D'EXERCICE de PERMISSIONS.**

Le rôle auth ne doit pas tenter de représenter la profession. Il représente uniquement le **type d'acteur** dans le système.

### Rôles Auth Actuels (14 rôles — À CONSERVER)

```
platform_admin   → Super Admin SHIFA (accès total)
org_admin        → Administrateur d'établissement
professional     → Tout professionnel de santé (différencié par profession/spécialité)
patient          → Patient
ministry         → Ministère / Autorité sanitaire nationale
insurance        → Assurance / Mutuelle
ngo              → ONG / Organisation humanitaire
university       → Université / École de santé
ambassador       → Ambassadeur SHIFA
public_health    → Santé publique / Épidémiologie
researcher       → Chercheur
developer        → Développeur API
vendor           → Vendeur Marketplace
guest            → Invité (accès limité)
```

### Rôles Auth Manquants — À AJOUTER (sans supprimer les existants)

Ces rôles ne doivent PAS être créés comme des rôles auth distincts. Ils doivent être gérés via le champ `profession` dans la table `professionals` :

```
RÔLE AUTH : professional
  └── PROFESSION : médecin_generaliste | cardiologue | neurologue | ...
      └── SPÉCIALITÉ : médecine_générale | cardiologie | neurologie | ...
          └── SOUS-SPÉCIALITÉ : cardiologie_interventionnelle | ...
              └── MODE D'EXERCICE : libéral | salarié | hospitalier | mixte | remplaçant
                  └── ORGANISATION(S) : cabinet | hôpital | clinique | ...
                      └── LICENCES : RPPS | ADELI | numéro_national | ...
                          └── PERMISSIONS : (calculées dynamiquement)
```

### Rôles Institutionnels — Différenciation Recommandée

Actuellement, `ministry`, `insurance`, `ngo`, `university`, `public_health` partagent la même sidebar. La différenciation doit se faire via :
- Le champ `org_type` dans `organizations`
- Des sidebars dynamiques par `org_type` (voir Section 6)
- Des permissions ABAC spécifiques (voir Section 10)

### Rôles Futurs Potentiels (P4 — ne pas créer maintenant)

```
oms_international    → OMS / Organisation internationale de santé
national_regulator   → Régulateur national (ANSM, etc.)
logistics_operator   → Opérateur logistique
```

---

## SECTION 3 — ARCHITECTURE PROFESSIONS / SPÉCIALITÉS

### Modèle Hiérarchique Cible

```
TYPE D'ACTEUR
  └── PROFESSION (champ `profession` dans `professionals`)
      └── SPÉCIALITÉ (champ `specialty` dans `professionals`)
          └── SOUS-SPÉCIALITÉ (champ `sub_specialty` — À AJOUTER)
```

### Taxonomie des Professions (basée sur `professionConfig.ts` existant)

#### Professions Libérales (`category: 'liberal'`)
| Profession | Spécialités | Sous-spécialités |
|-----------|-------------|-----------------|
| Médecin Généraliste | Médecine générale | — |
| Cardiologue | Cardiologie | Cardiologie interventionnelle, Rythmologie, Insuffisance cardiaque |
| Neurologue | Neurologie | Neurologie vasculaire, Épileptologie, Neurologie pédiatrique |
| Dermatologue | Dermatologie | Dermatologie oncologique, Vénérologie |
| Ophtalmologue | Ophtalmologie | Rétinologie, Glaucome, Chirurgie réfractive |
| Psychiatre | Psychiatrie | Psychiatrie adulte, Psychiatrie pédiatrique, Addictologie |
| Gynécologue-Obstétricien | Gynécologie, Obstétrique | Médecine fœtale, Gynécologie oncologique |
| Pédiatre | Pédiatrie | Néonatologie, Pédiatrie spécialisée |
| Chirurgien | Chirurgie générale | Chirurgie digestive, Chirurgie orthopédique, Chirurgie vasculaire |
| Dentiste | Chirurgie dentaire | Orthodontie, Implantologie, Parodontologie |
| Psychologue | Psychologie clinique | Psychothérapie, Neuropsychologie |

#### Professions Hospitalières (`category: 'hospital'`)
| Profession | Spécialités |
|-----------|-------------|
| Anesthésiste-Réanimateur | Anesthésie, Réanimation, Soins intensifs |
| Urgentiste | Médecine d'urgence, SMUR |
| Radiologue | Radiologie diagnostique, Radiologie interventionnelle |
| Oncologue | Oncologie médicale, Radiothérapie, Oncologie pédiatrique |
| Néphrologue | Néphrologie, Dialyse, Transplantation |
| Gastroentérologue | Gastroentérologie, Hépatologie, Endoscopie |
| Rhumatologue | Rhumatologie, Médecine interne |
| Pneumologue | Pneumologie, Allergologie |
| Endocrinologue | Endocrinologie, Diabétologie, Maladies métaboliques |
| Hématologue | Hématologie, Transfusion |
| Infectiologue | Infectiologie, Maladies tropicales, VIH |
| Urologue | Urologie, Andrologie |
| Gériatre | Gériatrie, Soins palliatifs |
| Orthopédiste | Orthopédie, Traumatologie |

#### Professions Paramédicales (`category: 'paramedical'`)
| Profession | Modes d'exercice |
|-----------|-----------------|
| Infirmier(ère) | Libéral, Salarié, Hospitalier, IADE, IBODE, Puériculteur |
| Sage-femme | Libérale, Hospitalière, PMI |
| Kinésithérapeute | Libéral, Salarié, Hospitalier |
| Ergothérapeute | Libéral, Salarié |
| Orthophoniste | Libéral, Salarié |
| Diététicien(ne) | Libéral, Salarié |
| Manipulateur Radio | Hospitalier, Libéral |
| Ambulancier | DEA, Auxiliaire ambulancier |
| Aide-soignant(e) | Hospitalier, EHPAD, Libéral |
| Travailleur Social | Salarié, Associatif |

#### Professions Pharmacie / Biologie (`category: 'pharmacy'`)
| Profession | Sous-rôles |
|-----------|-----------|
| Pharmacien | Titulaire, Adjoint, Hospitalier, Biologiste |
| Biologiste Médical | Biologie clinique, Microbiologie, Hématologie biologique |
| Technicien de Laboratoire | Biochimie, Hématologie, Microbiologie |
| Préparateur en Pharmacie | Officine, Hospitalier |

### Champs à Ajouter dans la Table `professionals`

```sql
-- À AJOUTER (sans modifier les colonnes existantes) :
sub_specialty        TEXT          -- Sous-spécialité
exercise_mode        TEXT          -- libéral | salarié | hospitalier | mixte | remplaçant
rpps_number          TEXT          -- Numéro RPPS (France)
adeli_number         TEXT          -- Numéro ADELI (France)
national_id_type     TEXT          -- Type d'identifiant national (par pays)
national_id_value    TEXT          -- Valeur de l'identifiant national
convention_sector    TEXT          -- Secteur 1 | 2 | 3 (France)
accreditations       JSONB         -- Accréditations par pays/organisme
```

---

## SECTION 4 — ARCHITECTURE MODES D'EXERCICE

### Modes d'Exercice Identifiés

| Mode | Description | Impact Sidebar | Impact Permissions |
|------|-------------|---------------|-------------------|
| `liberal` | Cabinet privé, honoraires libres | Facturation, Agenda, Cabinet | Accès direct patients |
| `salarie` | Salarié d'un établissement | Planning, RH, Paie | Via organisation |
| `hospitalier` | Praticien hospitalier | DPI, Admissions, Bloc | Via département |
| `mixte` | Libéral + Hospitalier | Combinaison | Dual |
| `remplacant` | Remplacement temporaire | Accès limité | Durée limitée |
| `teleconsultation` | Exclusivement en ligne | Téléconsultation | Virtuel |
| `urgentiste` | Urgences / SMUR | Urgences, Triage | Accès élargi |

### Impact sur la Sidebar Dynamique

```
SIDEBAR = CORE_NAVIGATION
        + f(PROFESSION)
        + f(SPÉCIALITÉ)
        + f(MODE_EXERCICE)
        + f(ORGANISATION)
        + f(PERMISSIONS)
```

Exemple — Médecin Libéral :
```
Tableau de bord | Patients | Agenda | Consultations | Prescriptions
Résultats | Suivi | Adressage | Téléconsultation | Facturation
Mon cabinet | Mon profil
```

Exemple — Infirmier Libéral :
```
Tableau de bord | Tournées | Patients | Soins | Constantes
Plans de soins | Coordination | Prescriptions | Suivi | Facturation
Mon cabinet | Profil
```

Exemple — Pharmacien :
```
Tableau de bord | Ordonnances | Dispensation | Patients | Stock
Fournisseurs | Interactions | Assurance | Caisse | Profil
```

Exemple — Biologiste / Laboratoire :
```
Tableau de bord | Demandes | Échantillons | Analyses | Validation
Résultats | LIS/LIMS | Qualité | Stocks | Transferts
```

### Implémentation Recommandée

Le fichier `professionConfig.ts` (existant, 1081 lignes) est le bon endroit pour étendre cette logique. Il faudra ajouter :
- Un champ `exerciseMode: ExerciseMode[]` dans `ProfessionConfig`
- Une fonction `getSidebarForProfession(profession, specialty, exerciseMode, orgType)` qui retourne les items de navigation filtrés
- La sidebar dynamique appellera cette fonction au lieu d'afficher tous les 100+ liens

---

## SECTION 5 — ARCHITECTURE ORGANISATIONS

### Types d'Organisations Actuels (dans `organizations.org_type`)

```
hospital          → Hôpital public / CHU
clinic            → Clinique privée
pharmacy          → Pharmacie
laboratory        → Laboratoire d'analyses
imaging_center    → Centre d'imagerie
rehabilitation    → Centre de rééducation
mental_health     → Établissement psychiatrique
maternity         → Maternité
emergency         → Centre d'urgences
primary_care      → Maison de santé / Centre de santé
insurance         → Assurance / Mutuelle
ngo               → ONG / Association
university        → Université / École
government        → Ministère / Autorité sanitaire
research          → Institut de recherche
vendor            → Fournisseur / Fabricant
```

### Hiérarchie Organisationnelle Cible

```
SHIFA PLATFORM
  └── PAYS (country_code)
      └── ORGANISATION (organizations)
          ├── DÉPARTEMENT (departments)
          │   └── SERVICE / UNITÉ
          ├── SITE (multi-sites)
          └── FILIALE / ANTENNE
```

### Champs à Ajouter dans `organizations`

```sql
-- À AJOUTER (sans modifier les colonnes existantes) :
parent_organization_id   UUID REFERENCES organizations(id)  -- Pour les filiales
country_code_secondary   TEXT[]                             -- Présence multi-pays
accreditation_status     TEXT                               -- Accréditation nationale
accreditation_body       TEXT                               -- Organisme accréditation
license_number           TEXT                               -- Numéro d'agrément
license_expiry           DATE                               -- Expiration agrément
capacity_beds            INTEGER                            -- Capacité lits (hôpitaux)
emergency_level          TEXT                               -- Niveau urgences (1-3)
```

### Espaces Institutionnels Spécialisés (Cible)

| Type Organisation | Espace Dédié | Route Actuelle | Statut |
|------------------|-------------|----------------|--------|
| Ministère / Gouvernement | Espace Ministère | `/espace-ministere` | MOCK |
| Assurance / Mutuelle | Espace Assurance | `/espace-assurance` | MOCK |
| ONG | Espace ONG | `/espace-ong` | PARTIEL |
| Université | Espace Université | `/espace-universite` | MOCK |
| Santé Publique | Espace Santé Publique | `/espace-sante-publique` | MOCK |
| Recherche | Research Workspace | `/research-workspace` | MOCK |
| OMS / International | À créer | — | ABSENT |

---

## SECTION 6 — ARCHITECTURE SIDEBARS

### Principe : Sidebar Dynamique par Contexte

La sidebar ne doit plus être une liste statique de 100+ liens. Elle doit être **générée dynamiquement** selon :

```
SIDEBAR_ITEMS = resolve(
  user.role,
  professional.profession,
  professional.specialty,
  professional.exercise_mode,
  organization.org_type,
  user.permissions
)
```

### 6.1 — Sidebar Patient (Restructurée)

**Principe** : Réduire la complexité visible. Grouper par usage, pas par fonctionnalité.

```
MA SANTÉ
  ├── Accueil                    → /patient-home
  ├── Mon dossier                → /dossier-de-sant
  ├── Rendez-vous                → /appointment-booking
  ├── Consultations              → /patient-consultations
  ├── Résultats                  → /patient-results
  ├── Ordonnances                → /patient-prescription-receipt
  └── Documents                  → /patient-documents

PRÉVENTION
  ├── Vaccinations               → /patient-vaccination
  ├── Prévention                 → /patient-prevention
  ├── Programmes de santé        → /patient-health-programs
  └── Maladies chroniques        → /patient-chronic-disease

SHIFA
  ├── SHIFA ID                   → /patient-shifa-id
  ├── SHIFA Card                 → /shifa-card
  ├── Mes droits                 → [SHIFA Rights — à créer]
  ├── Consentements              → /patient-consent
  └── Confidentialité            → /patient-privacy

COMMUNICATION
  ├── Messages                   → /patient-messages
  ├── Téléconsultation           → /patient-teleconsultation
  ├── SHIFA Share                → /shifa-share
  ├── Notifications              → /patient-notifications
  └── Urgences                   → /patient-emergency

COMPTE
  ├── Profil                     → /patient-settings
  ├── Paiements                  → /patient-payments
  ├── Abonnements                → /patient-subscriptions
  ├── Paramètres                 → /patient-settings
  ├── Langue & région            → [LanguageSelector intégré]
  └── Aide                       → /support-center
```

**Note** : Les fonctionnalités existantes restent accessibles mais ne sont pas toutes affichées simultanément. Les items moins fréquents (famille, appareils connectés, réhabilitation, etc.) peuvent être dans un sous-menu "Plus" ou accessibles via la recherche.

### 6.2 — Sidebar Professionnel (Dynamique par Profession)

**Principe** : Remplacer la sidebar universelle de 100+ liens par une sidebar contextuelle.

**CORE (commun à tous les professionnels)**
```
  ├── Tableau de bord            → /workspace-professionnel
  ├── Patients                   → /pro-patients
  ├── Agenda                     → /pro-agenda
  ├── Messages                   → /pro-messages
  └── Notifications              → /notifications-center
```

**CLINIQUE (selon profession)**
```
Médecin :
  ├── Consultations              → /consultation-workspace
  ├── Prescriptions              → /pro-prescriptions
  ├── Résultats                  → /pro-resultats
  ├── Plans de soins             → /pro-care-plans
  ├── Adressages                 → /pro-referrals
  └── Téléconsultation           → /pro-teleconsultation

Infirmier :
  ├── Tournées                   → [à créer]
  ├── Soins                      → [à créer]
  ├── Constantes                 → [vital_signs]
  ├── Plans de soins             → /pro-care-plans
  └── Coordination               → /pro-care-coordination

Pharmacien :
  ├── Ordonnances                → /pro-prescriptions
  ├── Dispensation               → /pharmacy-dashboard
  ├── Stock                      → /inventory-procurement
  ├── Interactions               → /shifa-ai-pharmacy
  └── Caisse                     → /pharmacy-pos

Biologiste / Labo :
  ├── Demandes                   → /lab-dashboard
  ├── Échantillons               → /lab-sample-transfer
  ├── Analyses                   → /laboratory-lms
  ├── Validation                 → [à créer]
  └── LIS/LIMS                   → /lab-lis-connector
```

**SPÉCIALITÉ (selon spécialité)**
```
  └── Espace [Spécialité]        → /[specialty]-workspace
```

**OUTILS**
```
  ├── SHIFA AI                   → /shifa-ai-pro
  ├── Documents                  → /pro-documents
  └── Facturation                → /pro-billing
```

**COMPTE**
```
  ├── Mon profil                 → /pro-profile
  ├── Disponibilités             → /pro-agenda-availability
  └── Paramètres                 → /pro-parametres
```

### 6.3 — Sidebar Admin Organisation (Restructurée)

```
ADMINISTRATION
  ├── Tableau de bord            → /administration-tablissement
  ├── Hôpital                    → /hopital-dashboard
  ├── Admissions                 → /hopital-admissions
  ├── DPI Hospitalier            → /hopital-dpi
  ├── Flux Patients              → /org-patient-flow
  └── Hospitalisation            → /hospitalization

GESTION
  ├── Utilisateurs               → /admin-utilisateurs
  ├── Professionnels             → /admin-professionnels
  ├── Services & Départements    → /hopital-configuration
  ├── Planning                   → /org-hr-planning
  ├── RH & Paie                  → /org-hr-payroll
  ├── Finance                    → /org-finance-dashboard
  ├── Facturation                → /billing-dashboard
  ├── Achats & Stocks            → /inventory-procurement
  ├── Logistique                 → /org-supply-chain
  ├── Maintenance                → /org-biomedical-maintenance
  ├── Qualité                    → /quality-accreditation
  ├── Accréditation              → /org-quality
  └── Documents                  → /org-documents

ANALYSE
  ├── Analytics                  → /org-analytics
  ├── Reporting                  → /org-reporting
  ├── Satisfaction patient       → /org-patient-satisfaction
  └── Audit                      → /admin-audit

COMPTE
  ├── Configuration              → /org-onboarding
  ├── Modules                    → /module-catalog
  └── Paramètres                 → /admin-parametres
```

### 6.4 — Sidebars Institutionnelles (Différenciées par org_type)

#### Ministère / Gouvernement
```
  ├── Tableau de bord national   → /espace-ministere
  ├── Population                 → [à créer]
  ├── Établissements             → /ministere-oversight
  ├── Professionnels             → /admin-professionnels
  ├── Programmes                 → /patient-health-programs
  ├── Santé publique             → /espace-sante-publique
  ├── Épidémiologie              → /epidemio-surveillance
  ├── Alertes                    → [à créer]
  ├── Financement                → /finance-dashboard
  ├── Indicateurs                → /org-analytics
  ├── Réglementation             → /government-licensing
  └── Audit                      → /admin-audit
```

#### Assurance / Mutuelle
```
  ├── Tableau de bord            → /espace-assurance
  ├── Adhérents                  → [à créer]
  ├── Droits                     → [SHIFA Rights]
  ├── Garanties                  → [à créer]
  ├── Prises en charge           → /assurance-workspace
  ├── Réclamations               → [insurance_claims]
  ├── Remboursements             → [à créer]
  ├── Fraude                     → [à créer]
  └── Statistiques               → /org-analytics
```

#### ONG
```
  ├── Tableau de bord            → /espace-ong
  ├── Programmes                 → /patient-health-programs
  ├── Bénéficiaires              → [à créer]
  ├── Campagnes                  → /community-hub
  ├── Financements               → /finance-dashboard
  ├── Distribution               → [à créer]
  ├── Territoires                → /patient-map
  └── Reporting                  → /org-reporting
```

#### Université
```
  ├── Tableau de bord            → /espace-universite
  ├── Étudiants                  → [à créer]
  ├── Enseignants                → [à créer]
  ├── Formation                  → /shifa-academy
  ├── Stages                     → /shifa-emploi-stage
  ├── Recherche                  → /research-workspace
  ├── Données anonymisées        → /research-datasets
  └── Éthique                    → /research-ethics-board
```

#### Santé Publique
```
  ├── Surveillance               → /espace-sante-publique
  ├── Épidémiologie              → /epidemio-surveillance
  ├── Alertes                    → [à créer]
  ├── Indicateurs                → /org-analytics
  ├── Campagnes                  → /community-hub
  ├── Territoires                → /patient-map
  └── Rapports                   → /org-reporting
```

#### Recherche
```
  ├── Projets                    → /research-workspace
  ├── Cohortes                   → [à créer]
  ├── Datasets                   → /research-datasets
  ├── Analyses                   → /shifa-ai-research
  ├── Éthique                    → /research-ethics-board
  └── Publications               → [à créer]
```

#### OMS / Organisation Internationale (À créer — P4)
```
  ├── Indicateurs agrégés        → [à créer]
  ├── Surveillance mondiale      → [à créer]
  ├── Tendances                  → [à créer]
  ├── Alertes                    → [à créer]
  ├── Programmes                 → [à créer]
  ├── Données anonymisées        → [à créer]
  └── Rapports internationaux    → [à créer]
```

### 6.5 — Implémentation Technique Recommandée

```typescript
// Concept — NE PAS IMPLÉMENTER MAINTENANT
// Fichier cible : src/lib/sidebarConfig.ts (nouveau fichier)

type SidebarContext = {
  role: UserRole;
  profession?: string;
  specialty?: string;
  exerciseMode?: ExerciseMode;
  orgType?: OrgType;
  permissions?: string[];
};

function resolveSidebar(ctx: SidebarContext): NavItem[] {
  const items: NavItem[] = [...CORE_ITEMS];
  
  if (ctx.role === 'professional') {
    items.push(...getProfessionItems(ctx.profession));
    items.push(...getSpecialtyItems(ctx.specialty));
    items.push(...getExerciseModeItems(ctx.exerciseMode));
  }
  
  if (ctx.role === 'org_admin') {
    items.push(...getOrgAdminItems(ctx.orgType));
  }
  
  if (['ministry', 'insurance', 'ngo', 'university', 'public_health'].includes(ctx.role)) {
    items.push(...getInstitutionalItems(ctx.role, ctx.orgType));
  }
  
  return filterByPermissions(items, ctx.permissions);
}
```

---

## SECTION 7 — ARCHITECTURE SHIFA ID

### Vision Cible : SHIFA ID comme Lien Mondial

SHIFA ID ne remplace PAS les identifiants nationaux. Il est la **couche de liaison** entre eux.

```
SHIFA ID (SH-{gender}-{country}-{year}-{random})
   │
   ├── Identité nationale Pays A (INS, NIN, etc.)
   ├── Identité nationale Pays B
   ├── Identité nationale Pays C
   ├── Dossier SHIFA (health_records)
   ├── Historique médical longitudinal
   ├── Consentements (table à créer)
   └── Historique international des accès
```

### Flux International

```
SYSTÈME DE SANTÉ DU PAYS B
        ↓
IDENTIFICATION DU PATIENT (identifiant local ou SHIFA ID)
        ↓
VÉRIFICATION CONSENTEMENT (table consents)
        ↓
SHIFA ID (résolution de l'identité)
        ↓
ÉCHANGE SÉCURISÉ (FHIR / HL7 / API SHIFA)
        ↓
DOSSIER SHIFA (health_records filtrés par consentement)
        ↓
SYSTÈME DU PAYS D'ORIGINE (si nécessaire)
```

### Tables à Créer (P1)

```sql
-- Table des identifiants nationaux
CREATE TABLE national_identifiers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id),
  shifa_id        TEXT REFERENCES shifa_ids(shifa_id),
  country_code    TEXT NOT NULL,
  id_type         TEXT NOT NULL,  -- INS | RPPS | NIN | CIN | etc.
  id_value        TEXT NOT NULL,
  is_verified     BOOLEAN DEFAULT false,
  verified_at     TIMESTAMPTZ,
  verified_by     UUID REFERENCES user_profiles(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_code, id_type, id_value)
);

-- Table de l'historique d'identité
CREATE TABLE identity_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES patients(id),
  shifa_id        TEXT,
  change_type     TEXT,  -- created | updated | merged | linked | unlinked
  old_value       JSONB,
  new_value       JSONB,
  changed_by      UUID REFERENCES user_profiles(id),
  reason          TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Table de déduplication
CREATE TABLE identity_merge_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_patient_id  UUID REFERENCES patients(id),
  target_patient_id  UUID REFERENCES patients(id),
  confidence_score   DECIMAL(3,2),
  status          TEXT DEFAULT 'pending',  -- pending | approved | rejected
  reviewed_by     UUID REFERENCES user_profiles(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### Format SHIFA ID — Évolution

Format actuel : `SH-{gender}-{country}-{year}-{random4}`
Format cible : `SH-{country}-{year}-{random8}` (plus robuste, moins de collisions)

**Note** : Ne pas modifier le format existant pour les SHIFA IDs déjà créés. Ajouter un champ `id_version` pour distinguer les formats.

---

## SECTION 8 — ARCHITECTURE SHIFA RIGHTS

### Vision : Moteur de Droits de Santé

SHIFA Rights doit déterminer **qui a droit à quoi, dans quel pays, pendant quelle période, pour quels actes, avec quel taux, avec quel plafond, qui finance, qui valide, ce qui a été consommé, ce qui reste disponible**.

### Architecture des Tables (À Créer — P0)

```sql
-- Plans de couverture (assurance, mutuelle, ONG, gouvernement)
CREATE TABLE coverage_plans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID REFERENCES organizations(id),  -- Assureur/ONG/Gouvernement
  plan_name           TEXT NOT NULL,
  plan_type           TEXT NOT NULL,  -- insurance | mutuelle | ong | government | mixed
  country_code        TEXT NOT NULL,
  valid_from          DATE NOT NULL,
  valid_until         DATE,
  is_active           BOOLEAN DEFAULT true,
  coverage_rules      JSONB,  -- Règles de couverture (actes, médicaments, taux)
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Droits de santé individuels
CREATE TABLE health_rights (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID REFERENCES patients(id),
  coverage_plan_id    UUID REFERENCES coverage_plans(id),
  valid_from          DATE NOT NULL,
  valid_until         DATE,
  status              TEXT DEFAULT 'active',  -- active | suspended | expired | revoked
  coverage_rate       DECIMAL(5,2),  -- Taux de prise en charge (%)
  annual_ceiling      DECIMAL(12,2), -- Plafond annuel
  consumed_amount     DECIMAL(12,2) DEFAULT 0,
  remaining_amount    DECIMAL(12,2),
  activation_type     TEXT DEFAULT 'automatic',  -- automatic | manual_exceptional
  activated_by        UUID REFERENCES user_profiles(id),
  activation_reason   TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Consommation des droits
CREATE TABLE rights_consumption (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_right_id     UUID REFERENCES health_rights(id),
  patient_id          UUID REFERENCES patients(id),
  act_code            TEXT,  -- Code acte (CCAM, NGAP, etc.)
  act_description     TEXT,
  act_date            DATE NOT NULL,
  total_amount        DECIMAL(12,2),
  covered_amount      DECIMAL(12,2),
  patient_amount      DECIMAL(12,2),
  status              TEXT DEFAULT 'pending',  -- pending | validated | rejected | reimbursed
  validated_by        UUID REFERENCES user_profiles(id),
  validated_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- Activations manuelles exceptionnelles
CREATE TABLE manual_rights_activations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_right_id     UUID REFERENCES health_rights(id),
  patient_id          UUID REFERENCES patients(id),
  operator_id         UUID REFERENCES user_profiles(id),  -- Qui active
  beneficiary_id      UUID REFERENCES user_profiles(id),  -- Pour qui
  justification       TEXT NOT NULL,
  old_status          TEXT NOT NULL,
  new_status          TEXT NOT NULL,
  old_value           JSONB,
  new_value           JSONB,
  requires_second_validation  BOOLEAN DEFAULT false,
  second_validator_id UUID REFERENCES user_profiles(id),
  second_validated_at TIMESTAMPTZ,
  valid_until         TIMESTAMPTZ,  -- Durée de validité de l'activation manuelle
  is_revoked          BOOLEAN DEFAULT false,
  revoked_by          UUID REFERENCES user_profiles(id),
  revoked_at          TIMESTAMPTZ,
  revocation_reason   TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
  -- Cet enregistrement est IMMUABLE — pas de UPDATE possible via RLS
);
```

### Règles Métier SHIFA Rights

1. **Aucun administrateur ne peut contourner silencieusement les règles** — toute activation manuelle est journalisée
2. **L'activation manuelle est temporaire** — elle a une durée de validité
3. **L'activation manuelle peut être révoquée** — mais la trace reste
4. **La seconde validation est optionnelle** mais recommandée pour les montants élevés
5. **L'audit est immuable** — la table `manual_rights_activations` ne doit pas permettre de DELETE ou UPDATE via RLS

### Flux SHIFA Rights

```
PATIENT demande un soin
  ↓
VÉRIFICATION AUTOMATIQUE des droits (health_rights)
  ↓
  ├── DROITS ACTIFS → Prise en charge automatique
  │     ↓
  │   CONSOMMATION enregistrée (rights_consumption)
  │     ↓
  │   FACTURATION générée (invoices)
  │
  └── DROITS ABSENTS / EXPIRÉS / SUSPENDUS
        ↓
        ├── ACTIVATION AUTOMATIQUE possible ? → OUI → Activer
        │
        └── NON → ACTIVATION MANUELLE EXCEPTIONNELLE
              ↓
            Justification + Identification opérateur
              ↓
            Seconde validation (si requis)
              ↓
            Audit immuable créé
              ↓
            Durée de validité définie
              ↓
            Notification patient + superviseur
```

---

## SECTION 9 — ARCHITECTURE CONSENT

### Vision : Consentement Granulaire et Traçable

```
CONSENTEMENT
  ├── Type : traitement_données | partage_dossier | téléconsultation | recherche | urgence
  ├── Portée : global | par_professionnel | par_organisation | par_acte
  ├── Durée : permanent | temporaire | ponctuel
  ├── Révocabilité : révocable à tout moment
  └── Audit : immuable
```

### Table à Créer (P2)

```sql
CREATE TABLE consents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID REFERENCES patients(id),
  consent_type        TEXT NOT NULL,
  -- Types : data_processing | record_sharing | teleconsultation | research | emergency_access
  -- | third_party_sharing | marketing | analytics
  scope               TEXT NOT NULL,  -- global | professional | organization | act
  scope_reference_id  UUID,           -- ID du professionnel/organisation/acte concerné
  granted             BOOLEAN NOT NULL,
  granted_at          TIMESTAMPTZ DEFAULT now(),
  expires_at          TIMESTAMPTZ,
  revoked_at          TIMESTAMPTZ,
  revoked_reason      TEXT,
  ip_address          TEXT,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
  -- Immuable : pas de UPDATE, seulement INSERT (révocation = nouvel enregistrement)
);
```

### Intégration avec SHIFA ID et SHIFA Rights

- Tout accès au dossier médical depuis un pays étranger nécessite un consentement actif
- SHIFA Rights peut être conditionné à un consentement de partage avec l'assureur
- La révocation d'un consentement doit déclencher la suspension des droits associés

---

## SECTION 10 — ARCHITECTURE RBAC / ABAC / RLS

### Modèle Combiné

```
DÉCISION D'ACCÈS = RBAC(rôle) ∩ ABAC(attributs) ∩ RLS(données)
```

### RBAC (Role-Based Access Control)

Niveau 1 — Rôle Auth (existant) :
```
platform_admin > org_admin > professional > patient > [institutionnels] > guest
```

Niveau 2 — Rôle Organisation (existant via `org_roles`) :
```
org_admin > department_head > senior_professional > professional > staff > intern
```

### ABAC (Attribute-Based Access Control)

Les décisions d'accès doivent pouvoir dépendre de :

| Attribut | Exemple |
|---------|---------|
| Profession | Un pharmacien ne voit pas l'intégralité du dossier médical |
| Spécialité | Un cardiologue accède aux données cardiaques de son patient |
| Organisation | Un professionnel ne voit que les patients de son organisation |
| Département | Un médecin ne voit que les patients de son département |
| Pays | Accès conditionné au pays d'exercice |
| Relation patient | Accès uniquement si rendez-vous ou suivi actif |
| Type de donnée | Données psychiatriques : accès ultra-restreint |
| Niveau de confidentialité | `is_confidential` dans `health_records` |
| Consentement | Accès conditionné au consentement actif |
| Contexte d'urgence | Break-Glass (voir Section 11) |
| Mode d'exercice | Libéral vs hospitalier |
| Statut professionnel | Actif vs suspendu vs en attente |

### RLS (Row-Level Security) — Corrections Prioritaires

#### Corrections P0 (Critiques)

```sql
-- PROBLÈME ACTUEL : kiosk_checkins — USING (true) trop permissif
-- CORRECTION CIBLE (ne pas implémenter maintenant — plan uniquement) :
-- Remplacer USING (true) par USING (
--   auth.uid() IN (
--     SELECT user_id FROM professional_organizations
--     WHERE organization_id = kiosk_checkins.organization_id
--   ) OR is_org_admin(auth.uid())
-- )

-- PROBLÈME ACTUEL : shifa_access_verifications — USING (true) trop permissif
-- CORRECTION CIBLE :
-- Remplacer USING (true) par USING (
--   operator_user_id = auth.uid() OR is_org_admin(auth.uid())
-- )
```

#### Corrections P1

```sql
-- PROBLÈME : Un professionnel ne peut pas lire les patients de ses consultations
-- CORRECTION CIBLE :
-- Ajouter politique sur patients :
-- USING (
--   user_id = auth.uid() OR
--   id IN (
--     SELECT patient_id FROM appointments
--     WHERE professional_id IN (
--       SELECT id FROM professionals WHERE user_id = auth.uid()
--     )
--   )
-- )

-- PROBLÈME : is_org_admin() ne vérifie pas l'organization_id
-- CORRECTION CIBLE :
-- CREATE OR REPLACE FUNCTION is_org_admin(org_id UUID)
-- RETURNS BOOLEAN AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM user_profiles
--     WHERE id = auth.uid()
--     AND role = 'org_admin'
--     AND id IN (
--       SELECT user_id FROM professional_organizations
--       WHERE organization_id = org_id
--     )
--   );
-- $$ LANGUAGE SQL SECURITY DEFINER;
```

### Matrice RBAC/ABAC Cible

| Acteur | Données Patient | Données Médicales | Données Financières | Données Org | Droits Santé |
|--------|----------------|-------------------|--------------------|-----------|----|
| Patient | FULL (own) | FULL (own) | FULL (own) | NONE | READ (own) |
| Professionnel | READ (relation) | READ+WRITE (relation+consentement) | READ (own) | READ (org) | READ (relation) |
| Pharmacien | READ (ordonnance) | READ (ordonnance uniquement) | READ (own) | READ (org) | READ (couverture) |
| Biologiste | READ (demande) | READ+WRITE (résultats) | READ (own) | READ (org) | NONE |
| Org Admin | READ+WRITE (org) | READ (org) | FULL (org) | FULL (own) | READ (org) |
| Platform Admin | FULL | FULL | FULL | FULL | FULL |
| Assurance | NONE | PARTIAL (claims uniquement) | READ (claims) | NONE | READ+WRITE (own plans) |
| ONG | NONE | NONE | READ (campaigns) | NONE | READ+WRITE (own programs) |
| Chercheur | ANONYMIZED | ANONYMIZED | NONE | NONE | NONE |
| Ministère | AGGREGATED | AGGREGATED | READ (national) | READ (national) | READ (national) |

---

## SECTION 11 — ARCHITECTURE BREAK-GLASS

### Définition

Le mécanisme Break-Glass permet un **accès exceptionnel en urgence** à des données normalement inaccessibles. Il est distinct de l'activation manuelle SHIFA Rights.

### Cas d'Usage

- Patient inconscient sans consentement préalable
- Urgence vitale nécessitant l'accès au dossier complet
- Accès inter-établissements en urgence
- Accès depuis un pays étranger sans accord préalable

### Architecture

```sql
CREATE TABLE break_glass_accesses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessor_id         UUID REFERENCES user_profiles(id),  -- Qui accède
  patient_id          UUID REFERENCES patients(id),        -- Pour qui
  justification       TEXT NOT NULL,                       -- Obligatoire
  access_scope        TEXT NOT NULL,                       -- Périmètre limité
  -- Valeurs : full_record | medications | allergies | emergency_contacts | vital_signs
  valid_from          TIMESTAMPTZ DEFAULT now(),
  valid_until         TIMESTAMPTZ NOT NULL,                -- Durée limitée (max 24h)
  is_active           BOOLEAN DEFAULT true,
  revoked_by          UUID REFERENCES user_profiles(id),
  revoked_at          TIMESTAMPTZ,
  revocation_reason   TEXT,
  notification_sent   BOOLEAN DEFAULT false,               -- Patient notifié
  reviewed_at         TIMESTAMPTZ,                         -- Revue a posteriori
  reviewed_by         UUID REFERENCES user_profiles(id),
  review_outcome      TEXT,  -- justified | unjustified | under_review
  created_at          TIMESTAMPTZ DEFAULT now()
  -- Immuable : pas de DELETE possible via RLS
);
```

### Règles Break-Glass

1. **Justification obligatoire** — texte libre + code de motif
2. **Durée limitée** — maximum 24 heures (configurable par organisation)
3. **Périmètre limité** — pas d'accès à l'intégralité du dossier par défaut
4. **Journalisation immédiate** — enregistrement avant l'accès, pas après
5. **Notification** — patient notifié dès que possible (email/SMS)
6. **Notification superviseur** — org_admin et platform_admin alertés
7. **Revue a posteriori** — obligatoire dans les 72h
8. **Audit immuable** — pas de DELETE ou UPDATE via RLS
9. **Révocable** — mais la trace reste

### Flux Break-Glass

```
URGENCE DÉTECTÉE
  ↓
PROFESSIONNEL clique "Accès d'urgence"
  ↓
FORMULAIRE : Justification + Périmètre + Durée
  ↓
ENREGISTREMENT dans break_glass_accesses (AVANT l'accès)
  ↓
ACCÈS ACCORDÉ (durée limitée)
  ↓
NOTIFICATION patient + superviseur (asynchrone)
  ↓
ACCÈS EXPIRÉ automatiquement
  ↓
REVUE A POSTERIORI (72h)
  ↓
OUTCOME : Justifié / Non justifié / Mesures disciplinaires
```

---

## SECTION 12 — ARCHITECTURE INTERNATIONALE

### Principe

SHIFA ne doit pas imposer un format identique aux systèmes nationaux. Il doit être **adaptable** à chaque pays tout en maintenant une couche commune.

### Couches d'Architecture Internationale

```
COUCHE 1 — SHIFA CORE (universelle)
  ├── SHIFA ID (format universel)
  ├── Authentification (Supabase Auth)
  ├── RBAC de base (14 rôles)
  └── Données fondamentales (patients, professionals, organizations)

COUCHE 2 — SHIFA NATIONAL (adaptable par pays)
  ├── Identifiants nationaux (national_identifiers)
  ├── Nomenclatures médicales (CCAM, NGAP, CIM-10, etc.)
  ├── Systèmes de couverture (SHIFA Rights par pays)
  ├── Réglementations locales
  └── Intégrations nationales (INS, RPPS, SESAM-Vitale, etc.)

COUCHE 3 — SHIFA INTERNATIONAL (échanges)
  ├── FHIR R4 (standard international)
  ├── Consentements internationaux
  ├── Échanges sécurisés inter-pays
  └── Données agrégées anonymisées (OMS)
```

### Configuration Multi-Pays (existant : `settings/country-module-config`)

La route `/settings/country-module-config` existe déjà. Elle doit être étendue pour gérer :
- Modules actifs par pays
- Identifiants nationaux par pays
- Nomenclatures médicales par pays
- Systèmes de couverture par pays
- Intégrations nationales par pays

### Flux Patient International

```
Patient français consulte au Maroc :

1. IDENTIFICATION au Maroc (CIN marocaine ou SHIFA ID)
2. VÉRIFICATION CONSENTEMENT (partage inter-pays)
3. RÉSOLUTION SHIFA ID (liaison CIN → SHIFA ID)
4. ACCÈS DOSSIER SHIFA (filtré par consentement)
5. CONSULTATION + PRESCRIPTION (enregistrée dans SHIFA)
6. NOTIFICATION au médecin traitant français (si consentement)
7. SYNCHRONISATION avec DMP français (si intégration active)
```

---

## SECTION 13 — ARCHITECTURE INTEROPÉRABILITÉ

### État Actuel : MOCK Complet

La page `/interoperability-hub` est une interface très élaborée mais **100% MOCK**. Aucune intégration réelle avec des systèmes externes n'est implémentée.

### Architecture Cible (Progressive)

#### Phase 1 — FHIR R4 (P3)
```
SHIFA FHIR Server
  ├── Patient Resource (→ patients table)
  ├── Practitioner Resource (→ professionals table)
  ├── Organization Resource (→ organizations table)
  ├── Appointment Resource (→ appointments table)
  ├── Observation Resource (→ vital_signs table)
  ├── MedicationRequest Resource (→ prescriptions table)
  ├── DiagnosticReport Resource (→ health_records table)
  └── Condition Resource (→ health_records table)
```

#### Phase 2 — Connecteurs Nationaux (P3-P4)
```
France :
  ├── INS (Identité Nationale de Santé)
  ├── RPPS (Répertoire Partagé des Professionnels de Santé)
  ├── DMP / Mon espace santé
  ├── SESAM-Vitale (droits AMO/AMC)
  ├── MSSanté (messagerie sécurisée)
  └── Pro Santé Connect (authentification)

Afrique (priorité) :
  ├── DHIS2 (District Health Information Software)
  ├── OpenMRS (dossier médical open source)
  └── Systèmes nationaux par pays
```

#### Phase 3 — Standards Additionnels (P4)
```
  ├── HL7 v2.x (laboratoires, imagerie)
  ├── DICOM (imagerie médicale)
  ├── IHE XDS.b (partage de documents)
  └── WHO GHO (indicateurs OMS)
```

### Stratégie d'Implémentation

1. **Ne pas modifier** l'UI existante de `/interoperability-hub`
2. **Ajouter** une couche backend réelle derrière l'UI existante
3. **Remplacer progressivement** les données MOCK par des données réelles
4. **Utiliser des Edge Functions** Supabase pour les connecteurs externes

---

## SECTION 14 — CARTOGRAPHIE ROUTES → MODULES

### Routes par Domaine SHIFA

#### SHIFA CORE
| Route | Module | Statut |
|-------|--------|--------|
| `/sign-up-login-screen` | Auth | RÉEL |
| `/auth/callback` | Auth OAuth | RÉEL |
| `/forgot-password` | Auth | PARTIEL |
| `/settings` | Paramètres globaux | PARTIEL |
| `/settings/country-module-config` | Config pays | PARTIEL |
| `/platform-admin` | Admin plateforme | RÉEL |
| `/super-admin-shifa` | Super admin | RÉEL |
| `/admin-utilisateurs` | Gestion utilisateurs | RÉEL |
| `/admin-professionnels` | Gestion professionnels | RÉEL |
| `/admin-roles` | Gestion rôles | MOCK |
| `/admin-audit` | Audit | RÉEL |
| `/admin-parametres` | Paramètres admin | PARTIEL |

#### SHIFA IDENTITY
| Route | Module | Statut |
|-------|--------|--------|
| `/patient-shifa-id` | SHIFA ID patient | RÉEL |
| `/shifa-access` | Vérification identité | RÉEL |
| `/shifa-kiosk` | Kiosk identité | RÉEL |
| `/pro-verification` | Vérification pro | PARTIEL |

#### SHIFA CARD
| Route | Module | Statut |
|-------|--------|--------|
| `/shifa-card` | Carte SHIFA | RÉEL |
| `/shifa-card-management` | Gestion carte | RÉEL |
| `/shifa-display` | Affichage kiosk | PARTIEL |

#### SHIFA RIGHTS (ABSENT)
| Route | Module | Statut |
|-------|--------|--------|
| — | SHIFA Rights Engine | ABSENT |
| `/espace-assurance` | Espace assureur | MOCK |
| `/assurance-workspace` | Workspace assureur | MOCK |

#### SHIFA CARE
| Route | Module | Statut |
|-------|--------|--------|
| `/patient-home` | Accueil patient | RÉEL |
| `/dossier-de-sant` | Dossier médical | RÉEL |
| `/appointment-booking` | Prise de RDV | RÉEL |
| `/appointment-history` | Historique RDV | PARTIEL |
| `/consultation-workspace` | Consultation | PARTIEL |
| `/pro-patients` | Patients pro | RÉEL |
| `/pro-prescriptions` | Prescriptions | RÉEL |
| `/pro-resultats` | Résultats | PARTIEL |
| `/pro-care-plans` | Plans de soins | MOCK |
| `/pro-care-coordination` | Coordination | MOCK |
| `/pro-patient-monitoring` | Suivi | MOCK |
| `/patient-consultations` | Consultations patient | PARTIEL |
| `/patient-results` | Résultats patient | PARTIEL |
| `/patient-follow-up` | Suivi patient | MOCK |
| `/patient-consent` | Consentements | MOCK |

#### SHIFA CONNECT
| Route | Module | Statut |
|-------|--------|--------|
| `/patient-messages` | Messagerie patient | MOCK |
| `/pro-messages` | Messagerie pro | MOCK |
| `/patient-teleconsultation` | Téléconsult patient | PARTIEL |
| `/pro-teleconsultation` | Téléconsult pro | MOCK |
| `/teleconsultation-session` | Session | MOCK |
| `/teleconsultation-lobby` | Lobby | MOCK |
| `/teleconsultation-waiting` | Salle d'attente | MOCK |
| `/teleconsultation-history` | Historique | MOCK |
| `/teleconsultation-commercial` | Commercial | MOCK |
| `/notifications-center` | Notifications | MOCK |
| `/patient-notifications` | Notifs patient | MOCK |
| `/shifa-share` | Partage sécurisé | MOCK |

#### SHIFA DIAGNOSTICS
| Route | Module | Statut |
|-------|--------|--------|
| `/lab-dashboard` | Laboratoire | PARTIEL |
| `/laboratory-lms` | LMS Labo | MOCK |
| `/lab-sample-transfer` | Transfert échantillons | MOCK |
| `/lab-international-transfer` | Transfert international | MOCK |
| `/lab-lis-connector` | LIS/LIMS | MOCK |
| `/imaging-dashboard` | Imagerie | MOCK |
| `/imaging-lms` | LMS Imagerie | MOCK |

#### SHIFA PHARMACY
| Route | Module | Statut |
|-------|--------|--------|
| `/pharmacy-dashboard` | Pharmacie | PARTIEL |
| `/pharmacy-pos` | Caisse pharmacie | MOCK |
| `/shifa-ai-pharmacy` | IA Pharmacie | PARTIEL |

#### SHIFA EMERGENCY
| Route | Module | Statut |
|-------|--------|--------|
| `/emergency` | Urgences | MOCK |
| `/emergency-dashboard` | Dashboard urgences | MOCK |
| `/emergency-workspace` | SAU | MOCK |
| `/ambulance-transport` | Ambulances | MOCK |
| `/operating-room` | Bloc opératoire | MOCK |
| `/icu-workspace` | Réanimation | MOCK |
| `/blood-bank` | Banque de sang | MOCK |
| `/patient-emergency` | Urgences patient | MOCK |

#### SHIFA ORGANIZATION
| Route | Module | Statut |
|-------|--------|--------|
| `/administration-tablissement` | Admin établissement | RÉEL |
| `/hopital-dashboard` | Dashboard hôpital | RÉEL |
| `/hopital-configuration` | Config hôpital | PARTIEL |
| `/hopital-admissions` | Admissions | PARTIEL |
| `/hopital-dpi` | DPI hospitalier | PARTIEL |
| `/org-patient-flow` | Flux patients | PARTIEL |
| `/hospitalization` | Hospitalisation | PARTIEL |
| `/hr-module` | RH | MOCK |
| `/org-hr-payroll` | Paie | MOCK |
| `/org-hr-planning` | Planning RH | MOCK |
| `/workforce-admin` | Admin workforce | MOCK |
| `/quality-accreditation` | Qualité | MOCK |
| `/org-quality` | Qualité org | MOCK |
| `/org-infection-control` | Hygiène | MOCK |
| `/org-nursing-management` | Soins infirmiers | MOCK |
| `/org-waste-management` | Déchets | MOCK |
| `/sterilization` | Stérilisation | MOCK |
| `/org-sterilization-central` | Stérilisation centrale | MOCK |
| `/biomedical-maintenance` | Maintenance biomédical | MOCK |
| `/org-biomedical-maintenance` | Maintenance complète | MOCK |
| `/biomedical-equipment` | Équipements | MOCK |
| `/org-staff-directory` | Annuaire | MOCK |
| `/org-documents` | Documents org | MOCK |
| `/org-onboarding` | Config initiale | PARTIEL |
| `/org-capacity-planning` | Planification capacitaire | MOCK |
| `/org-patient-satisfaction` | Satisfaction | MOCK |

#### SHIFA FINANCE
| Route | Module | Statut |
|-------|--------|--------|
| `/billing-dashboard` | Facturation | RÉEL |
| `/finance-dashboard` | Finance | RÉEL |
| `/org-finance-dashboard` | Finance org | RÉEL |
| `/admin-financial-dashboard` | Finance admin | RÉEL |
| `/pro-billing` | Facturation pro | RÉEL |
| `/patient-payments` | Paiements patient | RÉEL |
| `/patient-subscriptions` | Abonnements | RÉEL |
| `/subscription-management` | Gestion abonnements | RÉEL |
| `/checkout` | Paiement | RÉEL |
| `/accounting-ledger` | Comptabilité | MOCK |
| `/wallet-interface` | Portefeuille | MOCK |
| `/platform-revenue` | Revenus plateforme | RÉEL |

#### SHIFA SUPPLY
| Route | Module | Statut |
|-------|--------|--------|
| `/health-marketplace` | Marketplace | RÉEL (catalogue) |
| `/marketplace-buyer` | Acheteur | RÉEL (catalogue) |
| `/marketplace-vendor` | Vendeur | MOCK |
| `/marketplace-commercial` | Commercial | MOCK |
| `/inventory-procurement` | Inventaire | MOCK |
| `/supply-chain` | Chaîne appro. | MOCK |
| `/org-supply-chain` | Appro. org | MOCK |

#### SHIFA PUBLIC HEALTH
| Route | Module | Statut |
|-------|--------|--------|
| `/espace-sante-publique` | Santé publique | MOCK |
| `/epidemio-surveillance` | Épidémiologie | MOCK |
| `/espace-ministere` | Ministère | MOCK |
| `/ministere-oversight` | Supervision nationale | MOCK |
| `/government-licensing` | Licences | MOCK |

#### SHIFA INTEROPERABILITY
| Route | Module | Statut |
|-------|--------|--------|
| `/interoperability-hub` | Hub interop | MOCK |
| `/integration-layer` | Couche intégration | MOCK |
| `/external-connectors` | Connecteurs externes | MOCK |
| `/offline-mode-config` | Config offline | MOCK |

#### SHIFA ACADEMY
| Route | Module | Statut |
|-------|--------|--------|
| `/shifa-academy` | Académie | MOCK |
| `/academy-dashboard` | Dashboard académie | MOCK |
| `/academy-pricing` | Tarifs académie | MOCK |
| `/research-workspace` | Recherche | MOCK |
| `/research-datasets` | Datasets | MOCK |
| `/research-ethics-board` | Éthique | MOCK |
| `/shifa-emploi-stage` | Emploi/Stages | MOCK |
| `/espace-universite` | Université | MOCK |

#### SHIFA AI
| Route | Module | Statut |
|-------|--------|--------|
| `/shifa-ai-pro` | IA Clinique | RÉEL (OpenAI) |
| `/shifa-ai-patient` | IA Patient | PARTIEL |
| `/shifa-ai-pharmacy` | IA Pharmacie | PARTIEL |
| `/shifa-ai-org` | IA Organisation | PARTIEL |
| `/shifa-ai-institution` | IA Institution | PARTIEL |
| `/shifa-ai-research` | IA Recherche | PARTIEL |
| `/shifa-ai-workspace` | IA Workspace | PARTIEL |

---

## SECTION 15 — CARTOGRAPHIE MODULES → TABLES

### Tables Existantes et Modules Associés

| Table | Module SHIFA | Statut | Routes Principales |
|-------|-------------|--------|-------------------|
| `user_profiles` | SHIFA CORE | ✅ RÉEL | Toutes |
| `organizations` | SHIFA CORE + ORGANIZATION | ✅ RÉEL | `/administration-tablissement` |
| `departments` | SHIFA ORGANIZATION | ✅ RÉEL | `/hopital-configuration` |
| `patients` | SHIFA CARE | ✅ RÉEL | `/patient-home`, `/dossier-de-sant` |
| `professionals` | SHIFA CORE | ✅ RÉEL | `/workspace-professionnel` |
| `professional_organizations` | SHIFA CORE | ✅ RÉEL | `/administration-tablissement` |
| `appointments` | SHIFA CARE | ✅ RÉEL | `/appointment-booking` |
| `health_records` | SHIFA CARE + DIAGNOSTICS | ✅ RÉEL | `/dossier-de-sant` |
| `availability_slots` | SHIFA CARE | ✅ RÉEL | `/pro-agenda-availability` |
| `modules` | SHIFA CORE | ✅ RÉEL | `/module-catalog` |
| `organization_modules` | SHIFA CORE | ✅ RÉEL | `/admin-modules` |
| `org_roles` | SHIFA CORE | ✅ RÉEL | `/admin-roles` |
| `audit_logs` | SHIFA CORE | ✅ RÉEL | `/admin-audit` |
| `subscriptions` | SHIFA FINANCE | ✅ RÉEL | `/patient-subscriptions` |
| `payments` | SHIFA FINANCE | ✅ RÉEL | `/patient-payments` |
| `invoices` | SHIFA FINANCE | ✅ RÉEL | `/billing-dashboard` |
| `tax_records` | SHIFA FINANCE | ✅ RÉEL | `/accounting-ledger` |
| `commissions` | SHIFA FINANCE | ✅ RÉEL | `/ambassador-commercial` |
| `settlements` | SHIFA FINANCE | ✅ RÉEL | `/finance-dashboard` |
| `api_billing_records` | SHIFA FINANCE | ✅ RÉEL | `/api-developer-dashboard` |
| `card_delivery_orders` | SHIFA CARD | ✅ RÉEL | `/shifa-card` |
| `insurance_claims` | SHIFA RIGHTS (partiel) | ⚠️ PARTIEL | `/espace-assurance` |
| `ambassador_payouts` | SHIFA FINANCE | ✅ RÉEL | `/ambassador-rewards` |
| `marketplace_settlements` | SHIFA SUPPLY | ✅ RÉEL | `/marketplace-vendor` |
| `ngo_partnerships` | SHIFA PUBLIC HEALTH | ✅ RÉEL | `/espace-ong` |
| `health_services` | SHIFA SUPPLY | ✅ RÉEL | `/health-marketplace` |
| `marketplace_products` | SHIFA SUPPLY | ✅ RÉEL | `/health-marketplace` |
| `funding_campaigns` | SHIFA PUBLIC HEALTH | ✅ RÉEL | `/community-hub` |
| `funding_contributions` | SHIFA PUBLIC HEALTH | ✅ RÉEL | `/community-hub` |
| `shifa_ids` | SHIFA IDENTITY | ✅ RÉEL | `/patient-shifa-id` |
| `kiosk_checkins` | SHIFA IDENTITY | ✅ RÉEL | `/shifa-kiosk` |
| `shifa_access_verifications` | SHIFA IDENTITY | ✅ RÉEL | `/shifa-access` |
| `shifa_cards` | SHIFA CARD | ✅ RÉEL | `/shifa-card` |
| `user_settings` | SHIFA CORE | ✅ RÉEL | `/patient-settings` |

### Tables Référencées mais Non Confirmées

| Table | Référencée dans | Module | Priorité Création |
|-------|----------------|--------|------------------|
| `vital_signs` | `VitalSignsAndPrescriptions.tsx`, `useSupabaseRealtime` | SHIFA CARE | 🔴 P0 |
| `prescriptions` | Multiples composants | SHIFA CARE + PHARMACY | 🔴 P0 |
| `sync_queue` | `syncQueueService.ts` | SHIFA INTEROP (offline) | 🔴 P0 |
| `messages` | `ProMessagesContent`, `PatientMessagesContent` | SHIFA CONNECT | 🟡 P2 |
| `notifications` | `NotificationsCenterContent` | SHIFA CONNECT | 🟡 P2 |
| `teleconsultation_sessions` | Routes téléconsultation | SHIFA CONNECT | 🟡 P2 |
| `research_datasets` | `ResearchDatasetsContent` | SHIFA ACADEMY | 🟢 P4 |

### Tables à Créer (Nouvelles)

| Table | Module | Priorité |
|-------|--------|----------|
| `coverage_plans` | SHIFA RIGHTS | 🔴 P0 |
| `health_rights` | SHIFA RIGHTS | 🔴 P0 |
| `rights_consumption` | SHIFA RIGHTS | 🔴 P0 |
| `manual_rights_activations` | SHIFA RIGHTS | 🔴 P0 |
| `orders` | SHIFA SUPPLY | 🔴 P1 |
| `order_items` | SHIFA SUPPLY | 🔴 P1 |
| `national_identifiers` | SHIFA IDENTITY | 🟡 P1 |
| `identity_history` | SHIFA IDENTITY | 🟡 P1 |
| `identity_merge_requests` | SHIFA IDENTITY | 🟡 P2 |
| `consents` | SHIFA CONSENT | 🟡 P2 |
| `break_glass_accesses` | SHIFA CORE (sécurité) | 🟡 P2 |
| `group_orders` | SHIFA SUPPLY | 🟢 P3 |
| `group_order_items` | SHIFA SUPPLY | 🟢 P3 |
| `fhir_resources` | SHIFA INTEROP | 🟢 P3 |
| `interop_logs` | SHIFA INTEROP | 🟢 P3 |

---

## SECTION 16 — CARTOGRAPHIE MOCK / RÉEL / PARTIEL / ABSENT

### Légende
- ✅ **RÉEL** : Connecté à Supabase/Stripe/OpenAI, données persistées
- ⚠️ **PARTIEL** : UI connectée mais fonctionnalités incomplètes ou données partiellement réelles
- 🔴 **MOCK** : UI élaborée mais données hardcodées, aucun backend réel
- ❌ **ABSENT** : Ni UI ni backend

### Cartographie par Module

| Module | Statut | Détail |
|--------|--------|--------|
| **Auth / RBAC** | ✅ RÉEL | Supabase Auth, middleware, 14 rôles |
| **SHIFA ID** | ⚠️ PARTIEL | Table créée, QR fonctionnel, multi-pays absent |
| **SHIFA Card** | ⚠️ PARTIEL | Table créée, commande physique, NFC/puce absent |
| **SHIFA Rights** | ❌ ABSENT | Aucune table, aucun moteur |
| **Patients** | ✅ RÉEL | CRUD complet, RLS, temps réel |
| **Professionnels** | ✅ RÉEL | CRUD complet, professionConfig.ts |
| **Organisations** | ✅ RÉEL | CRUD complet, multi-tenant |
| **Rendez-vous** | ✅ RÉEL | CRUD complet, temps réel |
| **Dossier médical** | ✅ RÉEL | health_records, signé, confidentiel |
| **Prescriptions** | 🔴 MOCK | UI présente, table non confirmée |
| **Constantes vitales** | 🔴 MOCK | UI présente, table non confirmée |
| **Consultations** | ⚠️ PARTIEL | UI connectée, données partielles |
| **Plans de soins** | 🔴 MOCK | UI présente, pas de table dédiée |
| **Coordination soins** | 🔴 MOCK | UI présente, pas de backend |
| **Suivi post-consultation** | 🔴 MOCK | UI présente, pas de backend |
| **Messagerie** | 🔴 MOCK | UI présente, pas de table messages |
| **Téléconsultation** | 🔴 MOCK | UI très élaborée, pas de WebRTC réel |
| **Notifications** | 🔴 MOCK | UI présente, pas de table notifications |
| **SHIFA Share** | 🔴 MOCK | UI présente, pas de backend |
| **Laboratoire** | ⚠️ PARTIEL | health_records type lab_result, LIS absent |
| **Imagerie** | 🔴 MOCK | UI présente, pas de DICOM réel |
| **Pharmacie** | ⚠️ PARTIEL | Dashboard partiel, dispensation absente |
| **Urgences** | 🔴 MOCK | UI très élaborée, pas de backend |
| **Bloc opératoire** | 🔴 MOCK | UI présente, pas de backend |
| **Réanimation** | 🔴 MOCK | UI présente, pas de backend |
| **Banque de sang** | 🔴 MOCK | UI présente, pas de backend |
| **Ambulances** | 🔴 MOCK | UI présente, pas de backend |
| **Maternité** | 🔴 MOCK | UI présente, health_records uniquement |
| **Pédiatrie** | 🔴 MOCK | UI présente, health_records uniquement |
| **Toutes spécialités** | 🔴 MOCK | UI présente, pas de tables dédiées |
| **RH / Paie** | 🔴 MOCK | UI présente, pas de tables RH |
| **Comptabilité** | 🔴 MOCK | UI présente, pas de backend |
| **Facturation** | ✅ RÉEL | invoices, payments, Stripe |
| **Paiements Stripe** | ✅ RÉEL | Edge Functions, PaymentIntent |
| **Abonnements** | ✅ RÉEL | subscriptions, Stripe |
| **Marketplace (catalogue)** | ✅ RÉEL | marketplace_products, health_services |
| **Marketplace (commandes)** | ❌ ABSENT | Table orders absente |
| **Achats groupés** | ❌ ABSENT | Concept absent |
| **Logistique** | 🔴 MOCK | UI présente, pas de backend |
| **Santé publique** | 🔴 MOCK | UI présente, pas de données réelles |
| **Épidémiologie** | 🔴 MOCK | UI présente, pas de données réelles |
| **Interopérabilité** | 🔴 MOCK | UI très élaborée, aucune intégration réelle |
| **Offline / PWA** | ⚠️ PARTIEL | syncQueueService, pas de Service Worker |
| **IA Clinique** | ✅ RÉEL | OpenAI via API route |
| **IA Pharmacie** | ⚠️ PARTIEL | OpenAI connecté, fonctionnalités limitées |
| **IA Patient** | ⚠️ PARTIEL | OpenAI connecté, fonctionnalités limitées |
| **IA Organisation** | ⚠️ PARTIEL | OpenAI connecté, fonctionnalités limitées |
| **Gouvernance IA** | ❌ ABSENT | Pas de framework de gouvernance |
| **Emails transactionnels** | ✅ RÉEL | Resend, 7 types d'emails |
| **Ambassadeurs** | 🔴 MOCK | UI présente, commissions réelles |
| **Académie** | 🔴 MOCK | UI présente, pas de backend |
| **Recherche** | 🔴 MOCK | UI présente, pas de backend |
| **Consentements** | 🔴 MOCK | UI présente, pas de table consents |
| **SHIFA Kiosk** | ✅ RÉEL | kiosk_checkins, temps réel |
| **SHIFA Access** | ✅ RÉEL | shifa_access_verifications |
| **Community Hub** | ⚠️ PARTIEL | ngo_partnerships, health_services réels |
| **Tests automatisés** | ❌ ABSENT | Aucun test |
| **Monitoring** | ❌ ABSENT | Aucun monitoring |
| **CI/CD** | ❌ ABSENT | Non visible |

---

## SECTION 17 — DOUBLONS ET STRATÉGIE DE CONSOLIDATION

### Doublons Identifiés

#### Doublons de Routes (Même Fonctionnalité, URLs Différentes)

| Route Canonique | Route Doublon | Type | Stratégie |
|----------------|--------------|------|-----------|
| `/maternity-workspace` | `/maternity` | workspace vs page | Conserver les deux. `/maternity` = vue simplifiée, `/maternity-workspace` = vue complète professionnelle |
| `/pediatrics-workspace` | `/pediatrics` | workspace vs page | Idem |
| `/emergency-workspace` | `/emergency` | workspace vs page | Idem. `/emergency-dashboard` = dashboard KPIs |
| `/emergency-dashboard` | `/emergency` | dashboard vs page | Conserver. `/emergency-dashboard` = KPIs, `/emergency` = interface clinique |
| `/org-biomedical-maintenance` | `/biomedical-maintenance` | org vs pro | `/biomedical-maintenance` = vue pro, `/org-biomedical-maintenance` = vue admin |
| `/org-sterilization-central` | `/sterilization` | org vs pro | Idem |
| `/org-supply-chain` | `/supply-chain` | org vs pro | Idem |
| `/palliative-care-workspace` | `/palliative-care` | workspace vs page | Idem |

#### Doublons de Fonctionnalités dans la Sidebar Pro

| Fonctionnalité | Routes Dupliquées | Stratégie |
|---------------|------------------|-----------|
| Urgences | `/emergency`, `/emergency-dashboard`, `/emergency-workspace` | Regrouper sous "Urgences" avec sous-menu |
| Maternité | `/maternity`, `/maternity-workspace` | Regrouper sous "Maternité" avec sous-menu |
| Pédiatrie | `/pediatrics`, `/pediatrics-workspace` | Regrouper sous "Pédiatrie" avec sous-menu |
| Soins Palliatifs | `/palliative-care`, `/palliative-care-workspace` | Regrouper |
| Maintenance | `/biomedical-maintenance`, `/org-biomedical-maintenance` | Séparer par rôle (pro vs admin) |
| Stérilisation | `/sterilization`, `/org-sterilization-central` | Séparer par rôle |
| Approvisionnement | `/supply-chain`, `/org-supply-chain` | Séparer par rôle |

#### Doublons de Workspaces

| Workspace | Routes | Stratégie |
|-----------|--------|-----------|
| Workspace Pro | `/workspace-professionnel`, `/workspace`, `/my-workspace` | `/workspace-professionnel` = dashboard KPIs, `/workspace` = workspace métier (professionConfig), `/my-workspace` = espace employé |
| Téléconsultation | 5 routes | Conserver. Chaque route = étape du flux (lobby → waiting → session → history) |

### Stratégie de Consolidation Globale

**Règle** : NE RIEN SUPPRIMER. Classifier chaque route :

| Classification | Définition | Action |
|---------------|-----------|--------|
| **Route Canonique** | Route principale, référence | Maintenir, améliorer |
| **Route Alias** | Même contenu, URL différente | Maintenir, rediriger vers canonique si doublon exact |
| **Route Spécialisée** | Variante pour un rôle/contexte | Maintenir, différencier par rôle |
| **Route Workspace** | Version complète professionnelle | Maintenir, accessible via sidebar pro |
| **Route Dashboard** | Vue KPIs/résumé | Maintenir, accessible via sidebar |
| **Route Orpheline** | Accessible mais non dans sidebar | Maintenir, ajouter dans sidebar appropriée |

### Routes Orphelines — Action Recommandée

| Route | Statut | Action |
|-------|--------|--------|
| `/live-module-interactions` | Orpheline | Ajouter dans sidebar platform_admin |
| `/shifa-display` | Orpheline (org admin) | Déjà dans adminNav, vérifier visibilité |
| `/phase3-completion-report` | Orpheline | Ajouter dans sidebar platform_admin |
| `/lab-lis-connector` | Orpheline | Ajouter dans sidebar pro (groupe laboratoire) |
| `/lab-international-transfer` | Orpheline | Ajouter dans sidebar pro (groupe laboratoire) |
| `/settings/country-module-config` | Sous-route | Accessible via `/settings` |

---

## SECTION 18 — DÉPENDANCES CRITIQUES

### Graphe de Dépendances Complet

```
NIVEAU 0 — FONDATION (RÉEL ✅)
  auth.users → user_profiles → organizations → departments
                                             → org_roles
                                             → organization_modules

NIVEAU 1 — IDENTITÉ (RÉEL ✅ / PARTIEL ⚠️)
  user_profiles → patients → shifa_ids ← shifa_cards
                           → national_identifiers [À CRÉER]
                           → consents [À CRÉER]

NIVEAU 2 — SOINS (RÉEL ✅ / PARTIEL ⚠️)
  patients → appointments → health_records
           → vital_signs [TABLE INCERTAINE]
           → prescriptions [TABLE INCERTAINE]

NIVEAU 3 — DROITS (ABSENT ❌)
  patients → health_rights [À CRÉER] ← coverage_plans [À CRÉER]
           → rights_consumption [À CRÉER]
           → manual_rights_activations [À CRÉER]

NIVEAU 4 — SERVICES (PARTIEL ⚠️ / MOCK 🔴)
  prescriptions → pharmacy_dispensation [ABSENT]
  health_records → lab_results → lab_reports [PARTIEL]
  health_records → imaging_studies → dicom [ABSENT]

NIVEAU 5 — FINANCE (RÉEL ✅)
  invoices → payments → settlements
  subscriptions → payments
  insurance_claims → payments [PARTIEL]

NIVEAU 6 — MARKETPLACE (PARTIEL ⚠️)
  marketplace_products → orders [ABSENT] → order_items [ABSENT]
                       → marketplace_settlements

NIVEAU 7 — INTEROPÉRABILITÉ (MOCK 🔴)
  shifa_ids → national_identifiers → external_systems [ABSENT]
  health_records → fhir_resources [ABSENT]
```

### Dépendances Bloquantes

| Dépendance Manquante | Bloque | Priorité |
|---------------------|--------|----------|
| Table `vital_signs` | Monitoring patient, temps réel | 🔴 P0 |
| Table `prescriptions` | Consultation → Pharmacie | 🔴 P0 |
| Table `sync_queue` | Mode offline | 🔴 P0 |
| SHIFA Rights Engine | Remboursements, couverture, pharmacie | 🔴 P0 |
| Table `orders` | Marketplace fonctionnelle | 🔴 P1 |
| Table `national_identifiers` | SHIFA ID multi-pays | 🟡 P1 |
| Table `consents` | Partage dossier, RGPD | 🟡 P2 |
| Table `messages` | Messagerie | 🟡 P2 |
| Table `notifications` | Alertes temps réel | 🟡 P2 |
| WebRTC / Téléconsultation | Téléconsultation réelle | 🟡 P2 |
| FHIR Server | Interopérabilité | 🟢 P3 |
| PWA / Service Worker | Mode offline complet | 🟢 P3 |

---

## SECTION 19 — RISQUES DE SÉCURITÉ

### Risques Critiques (P0 — À Corriger en Priorité Absolue)

| # | Risque | Sévérité | Détail | Correction |
|---|--------|----------|--------|-----------|
| 1 | `ignoreBuildErrors: true` | 🔴 CRITIQUE | Erreurs TypeScript silencieuses en production. Des bugs critiques peuvent passer inaperçus. | Passer à `false`, résoudre toutes les erreurs TS |
| 2 | RLS `kiosk_checkins` trop permissive | 🔴 CRITIQUE | `USING (true)` — tout utilisateur authentifié peut lire TOUS les check-ins de TOUS les établissements | Restreindre à l'organisation de l'utilisateur |
| 3 | RLS `shifa_access_verifications` trop permissive | 🔴 CRITIQUE | `USING (true)` — tout utilisateur authentifié peut lire/écrire TOUTES les vérifications | Restreindre à l'opérateur ou org_admin |
| 4 | Table `sync_queue` référencée mais migration non confirmée | 🔴 CRITIQUE | Erreur runtime silencieuse possible | Créer la migration |
| 5 | Tables `vital_signs` et `prescriptions` non confirmées | 🔴 CRITIQUE | Temps réel abonné à des tables inexistantes | Créer les migrations |
| 6 | Comptes démo avec mots de passe en clair dans migrations SQL | 🔴 CRITIQUE | Credentials exposés dans le code source | Supprimer des migrations, utiliser des variables d'environnement |

### Risques Élevés (P1)

| # | Risque | Sévérité | Détail | Correction |
|---|--------|----------|--------|-----------|
| 7 | `is_org_admin()` ne vérifie pas l'organization_id | 🟠 ÉLEVÉ | Un org_admin peut agir sur toutes les organisations | Ajouter paramètre org_id à la fonction |
| 8 | Middleware `__unknown__` role laisse passer | 🟠 ÉLEVÉ | Rôle inconnu non bloqué | Ajouter cas par défaut bloquant |
| 9 | Pas de MFA | 🟠 ÉLEVÉ | Comptes médicaux sans double authentification | Implémenter TOTP via Supabase Auth |
| 10 | Pas de rate limiting sur API routes | 🟠 ÉLEVÉ | `/api/ai/chat-completion` peut être abusé | Ajouter rate limiting (Upstash Redis ou middleware) |
| 11 | Source maps en production | 🟠 ÉLEVÉ | Code source exposé aux utilisateurs | Désactiver `productionBrowserSourceMaps` |

### Risques Moyens (P2)

| # | Risque | Sévérité | Détail | Correction |
|---|--------|----------|--------|-----------|
| 12 | Pas de validation Zod côté serveur | 🟡 MOYEN | Validation client uniquement sur les API routes | Ajouter Zod sur toutes les API routes |
| 13 | Badges hardcodés dans Sidebar | 🟡 MOYEN | Données fictives affichées (2, 3, 5, 7) | Connecter à des requêtes Supabase |
| 14 | `/settings` dans sidebar patient/pro → route platform_admin | 🟡 MOYEN | RBAC incohérent | Créer une route `/settings` accessible à tous les rôles |
| 15 | Multi-tenancy partiel | 🟡 MOYEN | `organization_id` non systématiquement vérifié dans RLS | Audit complet des politiques RLS |
| 16 | Pas de CSRF explicite | 🟡 MOYEN | Next.js protège partiellement | Vérifier les API routes sensibles |
| 17 | Chiffrement offline fictif | 🟡 MOYEN | `encryptedLocally: true` flag sans chiffrement réel | Implémenter AES-256 pour données locales |
| 18 | `stripe_customer_id` potentiellement absent | 🟡 MOYEN | Colonne référencée dans Edge Function mais migration incertaine | Vérifier et créer si absent |

### Risques Faibles (P3)

| # | Risque | Sévérité | Détail | Correction |
|---|--------|----------|--------|-----------|
| 19 | Pas de tests automatisés | 🟢 FAIBLE | Aucun filet de sécurité pour les régressions | Ajouter Jest/Vitest |
| 20 | Pas de monitoring | 🟢 FAIBLE | Erreurs production non détectées | Ajouter Sentry ou équivalent |
| 21 | Pas de CI/CD visible | 🟢 FAIBLE | Déploiements manuels risqués | Configurer GitHub Actions |

### Risques Spécifiques aux Données Médicales

| Risque | Détail |
|--------|--------|
| Accès non autorisé aux dossiers | RLS `patients` ne couvre pas les professionnels via leurs consultations |
| Données psychiatriques non protégées | `is_confidential` dans `health_records` mais pas de politique RLS spécifique |
| Partage sans consentement | Table `consents` absente — impossible de vérifier le consentement |
| Audit insuffisant | `audit_logs` existe mais pas systématiquement utilisé |
| Break-Glass absent | Pas de mécanisme d'accès d'urgence traçable |

---

## SECTION 20 — PLAN DE MIGRATION NON DESTRUCTIF

### Principe Fondamental

**AUCUNE ROUTE NE SERA SUPPRIMÉE.**
**AUCUN COMPOSANT NE SERA REMPLACÉ.**
**AUCUNE TABLE NE SERA MODIFIÉE.**

Toutes les évolutions sont **additives** : nouvelles tables, nouvelles colonnes (optionnelles), nouvelles fonctions, nouvelles politiques RLS (en complément des existantes).

### Phase A — Stabilisation Critique (P0)
**Objectif** : Corriger les risques de sécurité critiques et les tables manquantes
**Durée estimée** : 1-2 semaines
**Impact** : Aucune modification visible pour les utilisateurs

```
A1. Corriger next.config.mjs : ignoreBuildErrors → false
    → Résoudre toutes les erreurs TypeScript révélées
    → Fichiers concernés : next.config.mjs + tous les fichiers avec erreurs TS

A2. Créer migration : vital_signs
    → Nouvelle table, pas de modification des tables existantes
    → RLS restrictive dès la création

A3. Créer migration : prescriptions
    → Nouvelle table, pas de modification des tables existantes
    → Liaison avec health_records et professionals

A4. Créer migration : sync_queue
    → Nouvelle table, pas de modification des tables existantes

A5. Corriger RLS kiosk_checkins
    → Remplacer USING (true) par politique restrictive
    → Tester que le kiosk fonctionne toujours

A6. Corriger RLS shifa_access_verifications
    → Remplacer USING (true) par politique restrictive
    → Tester que SHIFA Access fonctionne toujours

A7. Supprimer comptes démo des migrations SQL
    → Créer un script de seed séparé (non versionné)
```

### Phase B — Architecture Fondamentale (P1)
**Objectif** : Créer les briques manquantes critiques
**Durée estimée** : 3-4 semaines
**Impact** : Nouvelles fonctionnalités, aucune régression

```
B1. Créer SHIFA Rights Engine
    → Nouvelles tables : coverage_plans, health_rights, rights_consumption, manual_rights_activations
    → Nouvelles RLS restrictives
    → Nouvelle Edge Function : check-health-rights
    → Connecter à l'UI existante /espace-assurance (remplacer MOCK progressivement)

B2. Créer table orders / order_items
    → Nouvelle table, pas de modification des tables existantes
    → Connecter à l'UI existante /marketplace-buyer (remplacer MOCK progressivement)

B3. Créer table national_identifiers
    → Nouvelle table, pas de modification des tables existantes
    → Connecter à l'UI existante /patient-shifa-id

B4. Corriger is_org_admin() pour vérifier l'organization_id
    → Modification de fonction DB existante (non destructive)
    → Tester que l'admin établissement fonctionne toujours

B5. Corriger middleware : rôle __unknown__ bloquant
    → Modification de src/middleware.ts (ligne spécifique)
    → Tester tous les rôles
```

### Phase C — Parcours Médical (P2)
**Objectif** : Connecter les modules cliniques aux données réelles
**Durée estimée** : 4-6 semaines
**Impact** : Modules MOCK deviennent RÉELS progressivement

```
C1. Connecter messagerie à Supabase Realtime
    → Créer table messages
    → Connecter /patient-messages et /pro-messages (sans modifier l'UI)

C2. Connecter notifications à Supabase
    → Créer table notifications
    → Connecter /notifications-center et /patient-notifications

C3. Créer table consents
    → Connecter /patient-consent (sans modifier l'UI)

C4. Créer table break_glass_accesses
    → Ajouter bouton "Accès d'urgence" dans /consultation-workspace

C5. Ajouter MFA (TOTP)
    → Via Supabase Auth (configuration uniquement)
    → Ajouter UI dans /patient-settings et /pro-parametres

C6. Ajouter validation Zod sur API routes
    → Modifier /api/ai/chat-completion, /api/financial/*
    → Pas de modification des composants

C7. Connecter badges Sidebar à des données réelles
    → Modifier Sidebar.tsx pour requêtes Supabase
    → Remplacer les valeurs hardcodées

C8. Différencier sidebars institutionnelles par org_type
    → Modifier Sidebar.tsx pour ajouter logique org_type
    → Pas de suppression de routes existantes
```

### Phase D — Interopérabilité (P3)
**Objectif** : Implémenter les premières intégrations réelles
**Durée estimée** : 6-8 semaines
**Impact** : Nouvelles fonctionnalités, aucune régression

```
D1. Implémenter FHIR R4 (lecture seule)
    → Nouvelle Edge Function : fhir-server
    → Connecter /interoperability-hub (remplacer MOCK progressivement)

D2. Implémenter PWA
    → Ajouter manifest.json
    → Ajouter Service Worker (next-pwa ou custom)
    → Confirmer table sync_queue

D3. Téléconsultation réelle (WebRTC)
    → Intégrer Daily.co ou Twilio Video
    → Connecter /teleconsultation-session (sans modifier l'UI)

D4. Ajouter rate limiting sur API routes
    → Middleware Upstash Redis ou équivalent

D5. Ajouter monitoring (Sentry)
    → Configuration uniquement, pas de modification du code métier
```

### Phase E — Fonctionnalités Avancées (P4)
**Objectif** : Compléter l'écosystème SHIFA
**Durée estimée** : 8-12 semaines

```
E1. Achats groupés (table group_orders)
E2. Connecteurs nationaux (INS, RPPS, DHIS2)
E3. Gouvernance IA (audit des décisions)
E4. Espace OMS / International
E5. Tests automatisés (Jest/Vitest)
E6. CI/CD (GitHub Actions)
E7. Mobile Money (Orange Money, M-Pesa, etc.)
E8. SHIFA Academy (backend réel)
```

---

## SECTION 21 — ORDRE EXACT RECOMMANDÉ DES FUTURES IMPLÉMENTATIONS

### Critères de Priorisation

1. **Sécurité** — Corriger les failles avant tout
2. **Dépendances** — Les briques fondamentales avant les fonctionnalités
3. **Valeur utilisateur** — Les parcours les plus utilisés en premier
4. **Non-destructivité** — Chaque étape doit être réversible

### Ordre Exact (21 étapes)

| # | Implémentation | Phase | Priorité | Dépendances | Impact |
|---|---------------|-------|----------|-------------|--------|
| 1 | Corriger `ignoreBuildErrors: true` | A | 🔴 P0 | Aucune | Sécurité build |
| 2 | Corriger RLS kiosk_checkins | A | 🔴 P0 | Aucune | Sécurité données |
| 3 | Corriger RLS shifa_access_verifications | A | 🔴 P0 | Aucune | Sécurité données |
| 4 | Créer migration vital_signs | A | 🔴 P0 | Aucune | Monitoring patient |
| 5 | Créer migration prescriptions | A | 🔴 P0 | vital_signs | Parcours médical |
| 6 | Créer migration sync_queue | A | 🔴 P0 | Aucune | Offline |
| 7 | Supprimer comptes démo des migrations | A | 🔴 P0 | Aucune | Sécurité |
| 8 | Créer SHIFA Rights Engine (4 tables) | B | 🔴 P1 | prescriptions | Droits santé |
| 9 | Créer table orders / order_items | B | 🔴 P1 | Aucune | Marketplace |
| 10 | Créer table national_identifiers | B | 🟡 P1 | shifa_ids | SHIFA ID multi-pays |
| 11 | Corriger is_org_admin() | B | 🟡 P1 | Aucune | Sécurité RBAC |
| 12 | Corriger middleware rôle inconnu | B | 🟡 P1 | Aucune | Sécurité auth |
| 13 | Créer table messages + connecter UI | C | 🟡 P2 | Aucune | Messagerie |
| 14 | Créer table notifications + connecter UI | C | 🟡 P2 | Aucune | Alertes |
| 15 | Créer table consents + connecter UI | C | 🟡 P2 | shifa_ids | RGPD |
| 16 | Créer table break_glass_accesses | C | 🟡 P2 | consents | Urgences |
| 17 | Ajouter MFA (TOTP) | C | 🟡 P2 | Aucune | Sécurité auth |
| 18 | Ajouter validation Zod API routes | C | 🟡 P2 | Aucune | Sécurité API |
| 19 | Sidebar dynamique par profession | C | 🟡 P2 | professionConfig.ts | UX pro |
| 20 | Sidebars institutionnelles différenciées | C | 🟡 P2 | org_type | UX institutionnel |
| 21 | Connecter badges Sidebar à Supabase | C | 🟡 P2 | messages, notifications | UX |

### Étapes Suivantes (P3-P4, après validation du plan)

| # | Implémentation | Phase | Priorité |
|---|---------------|-------|----------|
| 22 | FHIR R4 (lecture seule) | D | 🟢 P3 |
| 23 | PWA + Service Worker | D | 🟢 P3 |
| 24 | Téléconsultation WebRTC | D | 🟢 P3 |
| 25 | Rate limiting API routes | D | 🟢 P3 |
| 26 | Monitoring (Sentry) | D | 🟢 P3 |
| 27 | Achats groupés | E | 🔵 P4 |
| 28 | Connecteurs nationaux (INS, RPPS) | E | 🔵 P4 |
| 29 | Gouvernance IA | E | 🔵 P4 |
| 30 | Tests automatisés | E | 🔵 P4 |
| 31 | CI/CD | E | 🔵 P4 |
| 32 | Mobile Money | E | 🔵 P4 |
| 33 | SHIFA Academy (backend) | E | 🔵 P4 |
| 34 | Espace OMS / International | E | 🔵 P4 |

---

## RÉSUMÉ EXÉCUTIF

### Ce que SHIFA HEALTH possède aujourd'hui (Points Forts)

✅ **Base technique solide** : Next.js 15, Supabase, Stripe, OpenAI, TypeScript strict
✅ **Architecture multi-tenant** : 14 rôles, organisations, départements
✅ **Couverture fonctionnelle exceptionnelle** : ~200 routes, 30+ spécialités
✅ **Modules critiques réels** : Auth, Patients, RDV, Dossiers, Paiements, SHIFA ID, SHIFA Card
✅ **IA Clinique fonctionnelle** : OpenAI connecté, diagnostics, prescriptions, CIM-10
✅ **Emails transactionnels** : Resend, 7 types d'emails
✅ **Temps réel** : useSupabaseRealtime sur appointments
✅ **professionConfig.ts** : Moteur de workspace professionnel (30+ professions)

### Ce qui Manque Critiquement

❌ **SHIFA Rights Engine** : Aucun moteur de droits de santé
❌ **Table orders** : Marketplace sans commandes
❌ **Tables vital_signs / prescriptions** : Référencées mais non confirmées
❌ **Consentements** : Table absente (RGPD critique)
❌ **Break-Glass** : Mécanisme d'urgence absent
❌ **Interopérabilité réelle** : 100% MOCK
❌ **Tests automatisés** : Aucun

### Ce qui Doit Être Corrigé Immédiatement

🔴 `ignoreBuildErrors: true` → Erreurs silencieuses en production
🔴 RLS kiosk_checkins et shifa_access_verifications → Données exposées
🔴 Comptes démo dans migrations SQL → Credentials exposés

### Vision SHIFA — Écart Global

| Dimension | Complétude | Priorité |
|-----------|-----------|----------|
| Identité & Auth | 75% | Maintenir + Améliorer |
| Parcours médical | 50% | P1 |
| Droits de santé | 0% | P0 |
| Communication | 20% | P2 |
| Finance | 70% | Maintenir |
| Marketplace | 40% | P1 |
| Interopérabilité | 5% | P3 |
| IA | 40% | P2 |
| Sécurité | 60% | P0 |
| International | 10% | P3-P4 |

**SHIFA HEALTH est à ~45% de sa vision cible.** Les 55% restants sont architecturés (routes, UI) mais pas encore connectés à un backend réel. Le plan ci-dessus permet d'atteindre ~75% en 6 mois sans casser l'existant.

---

*Plan Directeur de Réorganisation SHIFA HEALTH v2.0*
*Généré le 31 août 2026 — Mode AUDIT + ARCHITECTURE uniquement*
*Aucune modification du code n'a été effectuée dans le cadre de ce plan.*
*Validation humaine requise avant toute implémentation.*
