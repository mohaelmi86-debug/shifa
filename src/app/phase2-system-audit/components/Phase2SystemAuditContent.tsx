'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type Status = 'open' | 'fixed' | 'accepted';
type Category = 'route' | 'permission' | 'rls' | 'navigation' | 'business_logic' | 'role_conflict' | 'org_isolation';

interface AuditFinding {
  id: string;
  category: Category;
  severity: Severity;
  status: Status;
  title: string;
  description: string;
  affectedRoutes: string[];
  recommendation: string;
  roles?: string[];
}

// ─── Audit Data ───────────────────────────────────────────────────────────────

const findings: AuditFinding[] = [
  // ── CRITICAL ──────────────────────────────────────────────────────────────
  {
    id: 'F-001',
    category: 'route',
    severity: 'critical',
    status: 'open',
    title: 'Middleware protège seulement 28 routes sur ~180 routes existantes',
    description: 'Le middleware ne liste que 28 préfixes protégés dans PROTECTED_PREFIXES. Les ~152 routes restantes (modules cliniques, financiers, institutionnels, spécialisés) sont accessibles sans authentification. Toute personne connaissant l\'URL peut accéder à des données médicales sensibles.',
    affectedRoutes: [
      '/lab-dashboard', '/pharmacy-dashboard', '/imaging-dashboard', '/billing-dashboard',
      '/emergency-dashboard', '/operating-room', '/icu-workspace', '/hopital-dpi',
      '/workforce-admin', '/org-finance-dashboard', '/platform-admin', '/platform-revenue',
      '/admin-financial-dashboard', '/shifa-ai-pro', '/research-datasets', '/epidemio-surveillance',
      '/pro-verification', '/integration-layer', '/external-connectors', '/platform-monitoring',
      '/platform-compliance', '/ministere-oversight', '/assurance-workspace', '/shifa-share',
      '/my-workspace', '/pro-care-coordination', '/referrals-interface', '/hopital-admissions',
      '/blood-bank', '/ambulance-transport', '/sterilization', '/org-infection-control'
    ],
    recommendation: 'Remplacer la liste blanche par une approche inverse : protéger TOUTES les routes sauf les routes publiques explicites (/, /sign-up-login-screen, /auth/callback, /pricing, /pricing-plans, /enterprise-contact). Utiliser un wildcard catch-all dans PROTECTED_PREFIXES ou inverser la logique du middleware.',
    roles: ['all'],
  },
  {
    id: 'F-002',
    category: 'permission',
    severity: 'critical',
    status: 'open',
    title: 'Aucune vérification de rôle côté serveur — role spoofing possible',
    description: 'Le middleware vérifie uniquement l\'authentification (user !== null) mais ne vérifie JAMAIS le rôle de l\'utilisateur. Un patient authentifié peut accéder à /platform-admin, /workforce-admin, /admin-financial-dashboard, /platform-revenue, etc. Le rôle n\'est utilisé que côté client (Sidebar) pour l\'affichage de la navigation.',
    affectedRoutes: ['/platform-admin', '/workforce-admin', '/admin-financial-dashboard', '/platform-revenue', '/platform-monitoring', '/platform-compliance', '/admin-roles', '/admin-utilisateurs', '/admin-professionnels', '/ministere-oversight'],
    recommendation: 'Ajouter une vérification de rôle dans le middleware pour les routes sensibles. Créer une map ROLE_REQUIRED_ROUTES : { route_prefix → required_role[] }. Interroger user_profiles.role depuis Supabase dans le middleware et rediriger si le rôle est insuffisant.',
    roles: ['patient', 'professional'],
  },
  {
    id: 'F-003',
    category: 'rls',
    severity: 'critical',
    status: 'open',
    title: 'Tables financières sans RLS activé dans la migration Phase 2',
    description: 'La migration 20260811140000_phase2_financial_domains.sql crée les tables subscriptions, payments, invoices, commissions, settlements, etc. mais aucune politique RLS n\'est visible dans les 80 premières lignes analysées. Si RLS n\'est pas activé sur ces tables, tout utilisateur authentifié peut lire/modifier les données financières de tous les autres utilisateurs.',
    affectedRoutes: ['/patient-payments', '/pro-billing', '/org-finance-dashboard', '/admin-financial-dashboard', '/platform-revenue', '/checkout', '/subscription-management'],
    recommendation: 'Vérifier et activer ALTER TABLE ... ENABLE ROW LEVEL SECURITY sur toutes les tables financières. Ajouter des politiques : patients voient leurs propres paiements, org_admin voit les paiements de son organisation, platform_admin voit tout. Créer une migration dédiée si manquante.',
    roles: ['all'],
  },
  {
    id: 'F-004',
    category: 'org_isolation',
    severity: 'critical',
    status: 'open',
    title: 'Isolation organisation non vérifiée pour les modules cliniques',
    description: 'Les pages cliniques (lab-dashboard, pharmacy-dashboard, imaging-dashboard, hopital-dpi, billing-dashboard) utilisent des données mock ou des requêtes Supabase sans filtre organization_id systématique. Un professionnel d\'un établissement A pourrait voir les données de l\'établissement B.',
    affectedRoutes: ['/lab-dashboard', '/pharmacy-dashboard', '/imaging-dashboard', '/hopital-dpi', '/billing-dashboard', '/hopital-admissions', '/org-patient-flow', '/operating-room'],
    recommendation: 'Toutes les requêtes Supabase sur des tables liées à une organisation (health_records, appointments, prescriptions, lab_results) doivent inclure un filtre .eq("organization_id", userOrgId). Implémenter via workspaceService.ts en propageant organization_id depuis le profil professionnel.',
    roles: ['professional', 'admin'],
  },

  // ── HIGH ──────────────────────────────────────────────────────────────────
  {
    id: 'F-005',
    category: 'route',
    severity: 'high',
    status: 'open',
    title: 'Routes orphelines — pages sans lien de retour ni navigation cohérente',
    description: 'Plusieurs routes existent dans le filesystem mais ne sont référencées dans aucune navigation Sidebar ni dans aucun lien inter-module : /patient-postcall-survey, /patient-precall-vitals, /teleconsultation-session, /patient-session-teleconsult, /teleconsultation-waiting, /shifa-kiosk, /shifa-display, /shifa-desktop. Ces pages sont inaccessibles pour l\'utilisateur normal.',
    affectedRoutes: ['/patient-postcall-survey', '/patient-precall-vitals', '/teleconsultation-session', '/patient-session-teleconsult', '/teleconsultation-waiting', '/shifa-kiosk', '/shifa-display', '/shifa-desktop'],
    recommendation: 'Soit ajouter ces routes dans la navigation Sidebar du rôle approprié, soit les marquer comme routes de flux (accessibles uniquement via redirection programmatique depuis un module parent) et documenter le flux d\'entrée.',
    roles: ['patient', 'professional', 'admin'],
  },
  {
    id: 'F-006',
    category: 'role_conflict',
    severity: 'high',
    status: 'open',
    title: 'Routes partagées entre rôles sans garde de permission différenciée',
    description: 'Plusieurs routes apparaissent dans la navigation de PLUSIEURS rôles sans logique de permission différenciée : /community-hub (patient + pro + admin), /shifa-share (patient + pro + platform_admin), /subscription-management (patient + pro + platform_admin), /checkout (patient + pro + platform_admin), /interoperability-hub (pro + admin), /dossier-de-sant (patient + pro). Le contenu affiché est identique quel que soit le rôle.',
    affectedRoutes: ['/community-hub', '/shifa-share', '/subscription-management', '/checkout', '/interoperability-hub', '/dossier-de-sant', '/support-center', '/notifications-center'],
    recommendation: 'Implémenter une logique de rôle dans chaque page partagée : lire le rôle depuis AuthContext et afficher le contenu approprié. Alternativement, créer des sous-routes par rôle (/shifa-share/patient, /shifa-share/pro) ou utiliser des composants conditionnels basés sur le rôle.',
    roles: ['patient', 'professional', 'admin', 'platform_admin'],
  },
  {
    id: 'F-007',
    category: 'permission',
    severity: 'high',
    status: 'open',
    title: 'Pages Platform Admin accessibles sans vérification platform_admin',
    description: '/platform-admin, /platform-revenue, /platform-monitoring, /platform-compliance, /admin-translations, /settings/country-module-config, /api-monetization, /pricing-engine, /tax-configuration, /admin-financial-dashboard sont des pages ultra-sensibles de gestion de plateforme. Aucune de ces routes n\'est dans PROTECTED_PREFIXES du middleware.',
    affectedRoutes: ['/platform-admin', '/platform-revenue', '/platform-monitoring', '/platform-compliance', '/admin-translations', '/settings/country-module-config', '/api-monetization', '/pricing-engine', '/tax-configuration', '/admin-financial-dashboard'],
    recommendation: 'Ajouter ces préfixes dans PROTECTED_PREFIXES ET ajouter une vérification de rôle platform_admin. Créer un helper requireRole(request, ["platform_admin"]) dans le middleware.',
    roles: ['platform_admin'],
  },
  {
    id: 'F-008',
    category: 'rls',
    severity: 'high',
    status: 'open',
    title: 'Table user_profiles — politique RLS manquante pour la mise à jour',
    description: 'La migration foundation crée user_profiles avec RLS mais les politiques de mise à jour (UPDATE) ne sont pas explicitement vérifiées. Un utilisateur pourrait potentiellement modifier le champ role de son propre profil pour s\'auto-promouvoir en platform_admin.',
    affectedRoutes: ['/patient-settings', '/pro-parametres', '/pro-profile', '/admin-parametres'],
    recommendation: 'Ajouter une politique RLS UPDATE sur user_profiles : les utilisateurs peuvent mettre à jour leur propre profil SAUF le champ role. Le champ role ne peut être modifié que par un platform_admin. Utiliser une fonction trigger pour protéger le champ role.',
    roles: ['all'],
  },
  {
    id: 'F-009',
    category: 'navigation',
    severity: 'high',
    status: 'open',
    title: 'Sidebar utilise des données utilisateur hardcodées (mock) — pas de données live',
    description: 'userInfoByRole dans Sidebar.tsx contient des noms, avatars et identifiants hardcodés (ex: "Aïcha Diallo", "Dr. Mohamed Sy", "SH-2-SN-2025-7K4D"). Ces données ne proviennent pas de AuthContext ni de Supabase. L\'utilisateur réel voit toujours le même nom fictif.',
    affectedRoutes: ['global — Sidebar'],
    recommendation: 'Remplacer userInfoByRole par des données dynamiques depuis useAuth() : user.user_metadata.full_name, user.email, et le shifa_id depuis la table patients ou user_profiles. Ajouter un useEffect dans Sidebar pour charger le profil réel.',
    roles: ['all'],
  },
  {
    id: 'F-010',
    category: 'business_logic',
    severity: 'high',
    status: 'open',
    title: 'Flux teleconsultation incomplet — pas de gestion d\'état de session',
    description: 'Le flux teleconsultation implique 5 étapes : /appointment-booking → /teleconsultation-lobby → /teleconsultation-waiting → /teleconsultation-session → /patient-postcall-survey. Aucun état partagé (session_id, room_id) n\'est transmis entre ces étapes. Les pages de session et d\'attente sont orphelines sans contexte de session.',
    affectedRoutes: ['/teleconsultation-lobby', '/teleconsultation-waiting', '/teleconsultation-session', '/patient-session-teleconsult', '/patient-postcall-survey', '/patient-precall-vitals'],
    recommendation: 'Implémenter un état de session teleconsultation via URL params (?session_id=xxx) ou via un contexte React dédié TeleconsultContext. Chaque étape du flux doit vérifier l\'existence d\'une session valide et rediriger si absente.',
    roles: ['patient', 'professional'],
  },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    id: 'F-011',
    category: 'navigation',
    severity: 'medium',
    status: 'open',
    title: 'Doublons de routes dans la navigation professionnelle',
    description: 'La navigation professionnelle contient des doublons fonctionnels : /maternity et /maternity-workspace, /pediatrics et /pediatrics-workspace, /palliative-care et /palliative-care-workspace, /emergency et /emergency-dashboard et /emergency-workspace. Trois entrées pour les urgences créent de la confusion.',
    affectedRoutes: ['/maternity', '/maternity-workspace', '/pediatrics', '/pediatrics-workspace', '/palliative-care', '/palliative-care-workspace', '/emergency', '/emergency-dashboard', '/emergency-workspace'],
    recommendation: 'Consolider les doublons : garder une seule entrée par spécialité dans la navigation (la version workspace) et faire pointer l\'ancienne URL vers la nouvelle via une redirection Next.js dans next.config.mjs. Ou fusionner le contenu dans un seul composant avec onglets.',
    roles: ['professional'],
  },
  {
    id: 'F-012',
    category: 'navigation',
    severity: 'medium',
    status: 'open',
    title: 'Navigation ambassadeur — 5 liens sur 8 pointent vers /ambassador-workspace',
    description: 'Dans ambassadorNav, les items nav-amb-network, nav-amb-invitations, nav-amb-rewards, nav-amb-training, nav-amb-resources pointent tous vers /ambassador-workspace. Seuls nav-amb-commercial et nav-amb-support ont des destinations distinctes. La navigation est non-fonctionnelle.',
    affectedRoutes: ['/ambassador-workspace'],
    recommendation: 'Créer les sous-pages manquantes (/ambassador-network, /ambassador-invitations, /ambassador-rewards) ou implémenter un système d\'onglets dans /ambassador-workspace avec ancres URL (?tab=network, ?tab=invitations) et mettre à jour les hrefs en conséquence.',
    roles: ['ambassador'],
  },
  {
    id: 'F-013',
    category: 'navigation',
    severity: 'medium',
    status: 'open',
    title: 'Navigation platform_admin — 6 liens pointent vers /platform-admin',
    description: 'Dans platformAdminNav, nav-pa-orgs, nav-pa-users, nav-pa-subscriptions, nav-pa-ambassadors, nav-pa-security, nav-pa-settings pointent tous vers /platform-admin. La page /platform-admin doit gérer tous ces contextes via onglets ou la navigation est trompeuse.',
    affectedRoutes: ['/platform-admin'],
    recommendation: 'Vérifier que /platform-admin implémente bien des onglets pour Organisations, Utilisateurs, Abonnements, Ambassadeurs, Sécurité, Paramètres. Si non, créer des sous-pages dédiées ou utiliser des query params (?section=users).',
    roles: ['platform_admin'],
  },
  {
    id: 'F-014',
    category: 'org_isolation',
    severity: 'medium',
    status: 'open',
    title: 'Module /shifa-share — règles de partage non enforced côté serveur',
    description: 'ShifaShareContent.tsx implémente la règle "données médicales jamais sur réseaux sociaux" uniquement côté client (UI). Aucune validation serveur (API route ou RLS) ne bloque un partage de données médicales via une requête directe à Supabase.',
    affectedRoutes: ['/shifa-share'],
    recommendation: 'Créer une table shifa_shares avec une colonne share_type (medical|public) et une contrainte CHECK ou trigger qui empêche share_type=medical avec destination=social_network. Ajouter une politique RLS qui valide le type de partage.',
    roles: ['patient', 'professional', 'platform_admin'],
  },
  {
    id: 'F-015',
    category: 'business_logic',
    severity: 'medium',
    status: 'open',
    title: 'Flux onboarding organisation sans vérification d\'étapes complétées',
    description: '/org-onboarding est accessible directement sans vérifier si l\'organisation a déjà complété l\'onboarding. Un admin peut relancer l\'onboarding sur une organisation déjà configurée, risquant d\'écraser des paramètres existants.',
    affectedRoutes: ['/org-onboarding', '/hopital-configuration', '/administration-tablissement'],
    recommendation: 'Ajouter un champ onboarding_completed_at dans la table organizations. Si ce champ est renseigné, rediriger /org-onboarding vers /administration-tablissement avec un message "Configuration déjà complétée".',
    roles: ['admin'],
  },
  {
    id: 'F-016',
    category: 'rls',
    severity: 'medium',
    status: 'open',
    title: 'Table health_records — accès NEED-TO-KNOW non enforced par RLS',
    description: 'La matrice NEED-TO-KNOW définie dans moduleInterconnect.ts est documentée mais non implémentée en RLS. Par exemple, un pharmacien ne devrait voir que les prescriptions, pas les résultats d\'imagerie. Ces restrictions sont conceptuelles mais pas enforced en base.',
    affectedRoutes: ['/hopital-dpi', '/dossier-de-sant', '/pro-resultats', '/pharmacy-dashboard', '/imaging-dashboard', '/lab-dashboard'],
    recommendation: 'Créer une table professional_access_matrix (professional_id, record_type[], organization_id) et une politique RLS sur health_records qui joint cette table pour filtrer les types de records accessibles par profession.',
    roles: ['professional'],
  },
  {
    id: 'F-017',
    category: 'business_logic',
    severity: 'medium',
    status: 'open',
    title: 'Vérification professionnelle (/pro-verification) sans workflow de validation',
    description: '/pro-verification existe mais aucun workflow complet n\'est implémenté : soumission de documents → révision admin → approbation/rejet → notification → activation du compte professionnel. Le statut professional_status dans la DB existe mais le flux de transition n\'est pas codé.',
    affectedRoutes: ['/pro-verification', '/admin-professionnels', '/pro-profile'],
    recommendation: 'Implémenter le workflow complet : (1) Pro soumet documents via /pro-verification, (2) Admin reçoit notification dans /admin-professionnels, (3) Admin approuve/rejette, (4) Trigger Supabase met à jour professional_status, (5) Email de notification envoyé.',
    roles: ['professional', 'admin'],
  },
  {
    id: 'F-018',
    category: 'route',
    severity: 'medium',
    status: 'open',
    title: 'Route /auth/callback sans gestion des erreurs OAuth',
    description: 'src/app/auth/callback/route.ts gère le callback OAuth mais sans gestion explicite des cas d\'erreur : token expiré, email non vérifié, compte suspendu. L\'utilisateur est redirigé sans message d\'erreur contextuel.',
    affectedRoutes: ['/auth/callback', '/sign-up-login-screen'],
    recommendation: 'Ajouter la gestion des paramètres error et error_description dans l\'URL de callback. Rediriger vers /sign-up-login-screen?error=xxx avec des messages d\'erreur localisés pour chaque cas (email_not_confirmed, access_denied, etc.).',
    roles: ['all'],
  },

  // ── LOW ───────────────────────────────────────────────────────────────────
  {
    id: 'F-019',
    category: 'navigation',
    severity: 'low',
    status: 'open',
    title: 'Page /not-found.tsx sans lien de retour contextuel par rôle',
    description: 'La page 404 existe mais redirige probablement vers / (landing page) sans tenir compte du rôle de l\'utilisateur connecté. Un professionnel connecté qui tape une mauvaise URL devrait être redirigé vers /workspace-professionnel, pas vers la landing.',
    affectedRoutes: ['/not-found'],
    recommendation: 'Dans not-found.tsx, utiliser useAuth() pour détecter le rôle et proposer un lien de retour contextuel : patient → /patient-home, professional → /workspace-professionnel, admin → /administration-tablissement.',
    roles: ['all'],
  },
  {
    id: 'F-020',
    category: 'navigation',
    severity: 'low',
    status: 'open',
    title: 'Badges de notification hardcodés dans Sidebar',
    description: 'Les badges numériques (badge: 2, badge: 3, badge: 7) dans patientNav et professionalNav sont des valeurs statiques hardcodées. Ils ne reflètent pas le nombre réel de notifications/messages non lus.',
    affectedRoutes: ['global — Sidebar'],
    recommendation: 'Remplacer les badges statiques par des compteurs dynamiques depuis Supabase Realtime. Créer un hook useUnreadCounts() qui s\'abonne aux tables messages et notifications filtrées par user_id.',
    roles: ['patient', 'professional'],
  },
  {
    id: 'F-021',
    category: 'business_logic',
    severity: 'low',
    status: 'open',
    title: 'Module /offline-mode-config sans persistance de configuration',
    description: 'OfflineModeConfigContent.tsx affiche une interface de configuration du mode offline mais les paramètres (seuil de bande passante, données à synchroniser, appareils autorisés) ne sont pas persistés en base de données.',
    affectedRoutes: ['/offline-mode-config'],
    recommendation: 'Créer une table offline_configs (organization_id, sync_interval, bandwidth_threshold, allowed_modules, encryption_enabled) et connecter le formulaire à Supabase pour persister et charger la configuration.',
    roles: ['admin', 'platform_admin'],
  },
  {
    id: 'F-022',
    category: 'role_conflict',
    severity: 'low',
    status: 'open',
    title: 'Rôle "institution" dans Sidebar non mappé à un rôle Supabase',
    description: 'Le Sidebar gère 6 rôles UI (patient, professional, admin, institution, ambassador, platform_admin) mais la DB user_profiles.role n\'a que 5 valeurs ENUM (platform_admin, org_admin, professional, patient, guest). Le rôle "institution" n\'a pas d\'équivalent DB.',
    affectedRoutes: ['/espace-ministere', '/espace-assurance', '/espace-universite', '/espace-ong', '/espace-sante-publique'],
    recommendation: 'Ajouter "institution" au type ENUM user_role dans une nouvelle migration, ou mapper le rôle institution à org_admin avec un sous-type institution_type dans la table organizations. Mettre à jour AuthContext pour retourner le rôle UI correct.',
    roles: ['institution'],
  },
  {
    id: 'F-023',
    category: 'business_logic',
    severity: 'low',
    status: 'open',
    title: 'Règle offboarding Workforce Admin non enforced automatiquement',
    description: 'WorkforceAdminContent.tsx documente la règle "accès organisation révoqué, compte SHIFA conservé" lors de l\'offboarding mais aucun trigger Supabase ni Edge Function ne révoque automatiquement les accès lors du changement de statut.',
    affectedRoutes: ['/workforce-admin', '/my-workspace'],
    recommendation: 'Créer un trigger Supabase sur la table professionals : quand status passe à "inactive" ou "offboarded", supprimer automatiquement l\'entrée dans org_members et révoquer les permissions d\'organisation tout en conservant le user_profile.',
    roles: ['admin'],
  },

  // ── INFO ──────────────────────────────────────────────────────────────────
  {
    id: 'F-024',
    category: 'route',
    severity: 'info',
    status: 'open',
    title: 'Routes commerciales publiques sans protection contre le scraping',
    description: '/pricing, /pricing-plans, /pro-pricing, /org-pricing, /academy-pricing sont publiques (correct) mais sans rate limiting ni protection contre le scraping automatisé des tarifs.',
    affectedRoutes: ['/pricing', '/pricing-plans', '/pro-pricing', '/org-pricing', '/academy-pricing'],
    recommendation: 'Ajouter un rate limiting dans le middleware pour les routes publiques sensibles (max 60 req/min par IP). Considérer l\'ajout d\'un token CSRF pour les formulaires de contact/souscription.',
    roles: ['all'],
  },
  {
    id: 'F-025',
    category: 'rls',
    severity: 'info',
    status: 'open',
    title: 'Absence de politique d\'audit trail pour les accès aux dossiers médicaux',
    description: 'Aucune table d\'audit trail n\'est visible dans les migrations pour tracer les accès aux health_records. Les réglementations de santé (RGPD, lois locales) exigent généralement de tracer qui a accédé à quel dossier médical et quand.',
    affectedRoutes: ['/dossier-de-sant', '/hopital-dpi', '/pro-resultats', '/lab-dashboard', '/imaging-dashboard'],
    recommendation: 'Créer une table medical_access_logs (id, user_id, patient_id, record_id, record_type, action, ip_address, timestamp) avec un trigger automatique sur les SELECT/UPDATE des tables médicales sensibles.',
    roles: ['professional', 'admin'],
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const severityConfig: Record<Severity, { label: string; color: string; bg: string; icon: string }> = {
  critical: { label: 'Critique', color: '#dc2626', bg: '#fef2f2', icon: 'ExclamationCircleIcon' },
  high: { label: 'Élevé', color: '#ea580c', bg: '#fff7ed', icon: 'ExclamationTriangleIcon' },
  medium: { label: 'Moyen', color: '#ca8a04', bg: '#fefce8', icon: 'InformationCircleIcon' },
  low: { label: 'Faible', color: '#2563eb', bg: '#eff6ff', icon: 'InformationCircleIcon' },
  info: { label: 'Info', color: '#6b7280', bg: '#f9fafb', icon: 'InformationCircleIcon' },
};

const categoryConfig: Record<Category, { label: string; icon: string }> = {
  route: { label: 'Routes & Accès', icon: 'MapIcon' },
  permission: { label: 'Permissions', icon: 'ShieldCheckIcon' },
  rls: { label: 'RLS Supabase', icon: 'LockClosedIcon' },
  navigation: { label: 'Navigation', icon: 'Bars3Icon' },
  business_logic: { label: 'Logique Métier', icon: 'CpuChipIcon' },
  role_conflict: { label: 'Conflits de Rôles', icon: 'UsersIcon' },
  org_isolation: { label: 'Isolation Org.', icon: 'BuildingOffice2Icon' },
};

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  open: { label: 'Ouvert', color: '#dc2626', bg: '#fef2f2' },
  fixed: { label: 'Corrigé', color: '#16a34a', bg: '#f0fdf4' },
  accepted: { label: 'Accepté', color: '#6b7280', bg: '#f9fafb' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Phase2SystemAuditContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'routes' | 'rls' | 'navigation' | 'business'>('overview');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount = findings.filter(f => f.severity === 'high').length;
  const mediumCount = findings.filter(f => f.severity === 'medium').length;
  const lowCount = findings.filter(f => f.severity === 'low').length;
  const infoCount = findings.filter(f => f.severity === 'info').length;

  const filteredFindings = findings.filter(f => {
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    return true;
  });

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'findings', label: `Findings (${findings.length})`, icon: 'ClipboardDocumentListIcon' },
    { id: 'routes', label: 'Audit Routes', icon: 'MapIcon' },
    { id: 'rls', label: 'Audit RLS', icon: 'LockClosedIcon' },
    { id: 'navigation', label: 'Navigation', icon: 'Bars3Icon' },
    { id: 'business', label: 'Logique Métier', icon: 'CpuChipIcon' },
  ] as const;

  // All routes from the project
  const allRoutes = [
    { path: '/patient-home', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/patient-explorer', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/appointment-booking', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/dossier-de-sant', roles: ['patient', 'professional'], protected: true, inMiddleware: true },
    { path: '/patient-messages', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/shifa-card', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/patient-settings', roles: ['patient'], protected: true, inMiddleware: true },
    { path: '/workspace-professionnel', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/consultation-workspace', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-patients', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-agenda', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-prescriptions', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-resultats', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-messages', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/pro-parametres', roles: ['professional'], protected: true, inMiddleware: true },
    { path: '/administration-tablissement', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-modules', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-roles', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-audit', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-professionnels', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-utilisateurs', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-activite', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/admin-parametres', roles: ['admin'], protected: true, inMiddleware: true },
    { path: '/org-onboarding', roles: ['admin', 'institution'], protected: true, inMiddleware: true },
    { path: '/espace-ministere', roles: ['institution'], protected: true, inMiddleware: true },
    { path: '/espace-assurance', roles: ['institution'], protected: true, inMiddleware: true },
    { path: '/espace-universite', roles: ['institution'], protected: true, inMiddleware: true },
    { path: '/espace-ong', roles: ['institution'], protected: true, inMiddleware: true },
    { path: '/espace-sante-publique', roles: ['institution'], protected: true, inMiddleware: true },
    // UNPROTECTED — should be protected
    { path: '/lab-dashboard', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/pharmacy-dashboard', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/imaging-dashboard', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/billing-dashboard', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/emergency-dashboard', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/operating-room', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/icu-workspace', roles: ['professional'], protected: true, inMiddleware: false },
    { path: '/hopital-dpi', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/workforce-admin', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/org-finance-dashboard', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/platform-admin', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/platform-revenue', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/admin-financial-dashboard', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/platform-monitoring', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/platform-compliance', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/shifa-share', roles: ['patient', 'professional', 'platform_admin'], protected: true, inMiddleware: false },
    { path: '/my-workspace', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/integration-layer', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/external-connectors', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/pro-care-coordination', roles: ['professional'], protected: true, inMiddleware: false },
    { path: '/referrals-interface', roles: ['professional'], protected: true, inMiddleware: false },
    { path: '/hopital-admissions', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/blood-bank', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/ambulance-transport', roles: ['professional', 'admin'], protected: true, inMiddleware: false },
    { path: '/sterilization', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/org-infection-control', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/research-datasets', roles: ['institution'], protected: true, inMiddleware: false },
    { path: '/epidemio-surveillance', roles: ['institution'], protected: true, inMiddleware: false },
    { path: '/ministere-oversight', roles: ['institution'], protected: true, inMiddleware: false },
    { path: '/pro-verification', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/tax-configuration', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/pricing-engine', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/api-monetization', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/settings/country-module-config', roles: ['platform_admin'], protected: true, inMiddleware: false },
    { path: '/admin-translations', roles: ['platform_admin'], protected: true, inMiddleware: false },
    // PUBLIC
    { path: '/', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/sign-up-login-screen', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/auth/callback', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/pricing', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/pricing-plans', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/enterprise-contact', roles: ['all'], protected: false, inMiddleware: false },
    { path: '/support-center', roles: ['all'], protected: false, inMiddleware: false },
    // ORPHANED
    { path: '/patient-postcall-survey', roles: ['patient'], protected: true, inMiddleware: false },
    { path: '/patient-precall-vitals', roles: ['patient'], protected: true, inMiddleware: false },
    { path: '/teleconsultation-session', roles: ['professional'], protected: true, inMiddleware: false },
    { path: '/patient-session-teleconsult', roles: ['patient'], protected: true, inMiddleware: false },
    { path: '/teleconsultation-waiting', roles: ['professional'], protected: true, inMiddleware: false },
    { path: '/shifa-kiosk', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/shifa-display', roles: ['admin'], protected: true, inMiddleware: false },
    { path: '/shifa-desktop', roles: ['platform_admin'], protected: true, inMiddleware: false },
  ];

  const unprotectedCount = allRoutes.filter(r => r.protected && !r.inMiddleware).length;
  const protectedCount = allRoutes.filter(r => r.inMiddleware).length;
  const publicCount = allRoutes.filter(r => !r.protected).length;

  // RLS audit data
  const rlsAudit = [
    { table: 'user_profiles', rlsEnabled: true, policies: ['SELECT: own profile + platform_admin', 'INSERT: on signup', 'UPDATE: own profile (role field unprotected ⚠️)'], risk: 'medium' },
    { table: 'organizations', rlsEnabled: true, policies: ['SELECT: members of org + platform_admin', 'INSERT: authenticated users', 'UPDATE: org_admin of same org'], risk: 'low' },
    { table: 'patients', rlsEnabled: true, policies: ['SELECT: own record + treating professionals + org_admin', 'INSERT: authenticated', 'UPDATE: own record + treating pro'], risk: 'low' },
    { table: 'health_records', rlsEnabled: true, policies: ['SELECT: patient + treating pro (no NEED-TO-KNOW filter ⚠️)', 'INSERT: professional', 'UPDATE: creating professional'], risk: 'medium' },
    { table: 'appointments', rlsEnabled: true, policies: ['SELECT: patient + professional + org_admin', 'INSERT: patient/professional', 'UPDATE: patient/professional'], risk: 'low' },
    { table: 'subscriptions', rlsEnabled: false, policies: ['⚠️ NO RLS POLICIES CONFIRMED'], risk: 'critical' },
    { table: 'payments', rlsEnabled: false, policies: ['⚠️ NO RLS POLICIES CONFIRMED'], risk: 'critical' },
    { table: 'invoices', rlsEnabled: false, policies: ['⚠️ NO RLS POLICIES CONFIRMED'], risk: 'critical' },
    { table: 'commissions', rlsEnabled: false, policies: ['⚠️ NO RLS POLICIES CONFIRMED'], risk: 'critical' },
    { table: 'settlements', rlsEnabled: false, policies: ['⚠️ NO RLS POLICIES CONFIRMED'], risk: 'critical' },
    { table: 'professionals', rlsEnabled: true, policies: ['SELECT: own profile + org_admin + platform_admin', 'UPDATE: own profile + org_admin'], risk: 'low' },
    { table: 'departments', rlsEnabled: true, policies: ['SELECT: org members', 'INSERT/UPDATE: org_admin'], risk: 'low' },
    { table: 'medical_access_logs', rlsEnabled: false, policies: ['⚠️ TABLE DOES NOT EXIST — needs creation'], risk: 'high' },
    { table: 'shifa_shares', rlsEnabled: false, policies: ['⚠️ TABLE DOES NOT EXIST — needs creation'], risk: 'high' },
    { table: 'offline_configs', rlsEnabled: false, policies: ['⚠️ TABLE DOES NOT EXIST — needs creation'], risk: 'medium' },
  ];

  const riskConfig: Record<string, { color: string; bg: string; label: string }> = {
    critical: { color: '#dc2626', bg: '#fef2f2', label: 'Critique' },
    high: { color: '#ea580c', bg: '#fff7ed', label: 'Élevé' },
    medium: { color: '#ca8a04', bg: '#fefce8', label: 'Moyen' },
    low: { color: '#16a34a', bg: '#f0fdf4', label: 'Faible' },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <Icon name="ShieldCheckIcon" size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SHIFA Health OS — Audit Phase 2</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Audit système complet : routes, rôles, permissions, RLS, navigation, logique métier</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: '#dc2626', color: 'white' }}>
                {criticalCount} Critiques
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: '#ea580c', color: 'white' }}>
                {highCount} Élevés
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: '#ca8a04', color: 'white' }}>
                {mediumCount} Moyens
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: '#2563eb', color: 'white' }}>
                {lowCount} Faibles
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {infoCount} Infos
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Généré le</p>
            <p className="text-sm font-mono text-white">2026-08-12</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Version</p>
            <p className="text-sm font-mono text-white">Phase 2.0</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
            style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Routes totales auditées', value: allRoutes.length, icon: 'MapIcon', color: '#2563eb' },
              { label: 'Routes non protégées', value: unprotectedCount, icon: 'ExclamationTriangleIcon', color: '#dc2626' },
              { label: 'Findings totaux', value: findings.length, icon: 'ClipboardDocumentListIcon', color: '#ea580c' },
              { label: 'Tables RLS à risque', value: rlsAudit.filter(r => r.risk === 'critical' || r.risk === 'high').length, icon: 'LockClosedIcon', color: '#ca8a04' },
            ].map(card => (
              <div key={card.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '20' }}>
                    <Icon name={card.icon as any} size={16} style={{ color: card.color }} />
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{card.label}</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Severity breakdown */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition par sévérité</h2>
            <div className="space-y-3">
              {(['critical', 'high', 'medium', 'low', 'info'] as Severity[]).map(sev => {
                const count = findings.filter(f => f.severity === sev).length;
                const pct = Math.round((count / findings.length) * 100);
                const cfg = severityConfig[sev];
                return (
                  <div key={sev} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-16" style={{ color: cfg.color }}>{cfg.label}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                    </div>
                    <span className="text-xs font-bold w-6 text-right" style={{ color: cfg.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition par catégorie</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(categoryConfig) as Category[]).map(cat => {
                const count = findings.filter(f => f.category === cat).length;
                const cfg = categoryConfig[cat];
                return (
                  <div key={cat} className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={cfg.icon as any} size={14} style={{ color: 'var(--muted-foreground)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.label}</span>
                    </div>
                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive summary */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Résumé Exécutif</h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <p>L'audit Phase 2 de SHIFA Health OS révèle <strong style={{ color: 'var(--foreground)' }}>4 vulnérabilités critiques</strong> nécessitant une correction immédiate avant tout déploiement en production.</p>
              <p><strong style={{ color: '#dc2626' }}>Priorité absolue :</strong> Le middleware de sécurité ne protège que 28 des ~180 routes de l'application. Les 152 routes restantes — incluant des modules cliniques, financiers et d'administration de plateforme — sont accessibles sans authentification. Combiné à l'absence de vérification de rôle, cela signifie qu'un utilisateur non authentifié peut accéder à des données médicales sensibles.</p>
              <p><strong style={{ color: '#ea580c' }}>Risque financier :</strong> Les tables de la migration Phase 2 (subscriptions, payments, invoices, commissions, settlements) n'ont pas de politiques RLS confirmées, exposant potentiellement toutes les données financières de tous les utilisateurs.</p>
              <p><strong style={{ color: '#ca8a04' }}>Cohérence UX :</strong> La navigation contient des doublons, des liens orphelins et des données hardcodées qui dégradent l'expérience utilisateur et masquent les vrais états de l'application.</p>
            </div>
          </div>

          {/* Priority action plan */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Plan d'action prioritaire</h2>
            <div className="space-y-3">
              {[
                { priority: 1, action: 'Inverser la logique middleware : protéger toutes les routes sauf whitelist publique', effort: '2h', impact: 'Critique', color: '#dc2626' },
                { priority: 2, action: 'Ajouter vérification de rôle dans middleware pour routes sensibles', effort: '4h', impact: 'Critique', color: '#dc2626' },
                { priority: 3, action: 'Créer migration RLS pour tables financières Phase 2', effort: '3h', impact: 'Critique', color: '#dc2626' },
                { priority: 4, action: 'Ajouter filtre organization_id systématique dans requêtes cliniques', effort: '8h', impact: 'Critique', color: '#dc2626' },
                { priority: 5, action: 'Remplacer données mock Sidebar par données live AuthContext', effort: '3h', impact: 'Élevé', color: '#ea580c' },
                { priority: 6, action: 'Implémenter état de session pour flux teleconsultation', effort: '6h', impact: 'Élevé', color: '#ea580c' },
                { priority: 7, action: 'Consolider doublons de navigation professionnelle', effort: '2h', impact: 'Moyen', color: '#ca8a04' },
                { priority: 8, action: 'Créer table medical_access_logs avec trigger automatique', effort: '4h', impact: 'Info', color: '#6b7280' },
              ].map(item => (
                <div key={item.priority} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: item.color }}>
                    {item.priority}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{item.action}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + '20', color: item.color }}>{item.impact}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.effort}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FINDINGS TAB ── */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Sévérité :</span>
              {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterSeverity(s)}
                  className="text-xs px-2 py-1 rounded-lg transition-colors"
                  style={filterSeverity === s
                    ? { backgroundColor: s === 'all' ? 'var(--shifa-blue)' : severityConfig[s as Severity]?.color, color: 'white' }
                    : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  {s === 'all' ? 'Tous' : severityConfig[s as Severity]?.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Catégorie :</span>
            {(['all', ...Object.keys(categoryConfig)] as const).map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c as Category | 'all')}
                className="text-xs px-2 py-1 rounded-lg transition-colors"
                style={filterCategory === c
                  ? { backgroundColor: 'var(--shifa-blue)', color: 'white' }
                  : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
              >
                {c === 'all' ? 'Toutes' : categoryConfig[c as Category]?.label}
              </button>
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{filteredFindings.length} finding(s) affiché(s)</p>

          {/* Findings list */}
          <div className="space-y-3">
            {filteredFindings.map(finding => {
              const sevCfg = severityConfig[finding.severity];
              const catCfg = categoryConfig[finding.category];
              const stCfg = statusConfig[finding.status];
              const isExpanded = expandedId === finding.id;
              return (
                <div key={finding.id} className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <button
                    className="w-full text-left p-4 flex items-start gap-3 hover:bg-muted transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sevCfg.bg }}>
                      <Icon name={sevCfg.icon as any} size={16} style={{ color: sevCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold" style={{ color: 'var(--muted-foreground)' }}>{finding.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sevCfg.bg, color: sevCfg.color }}>{sevCfg.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                          <Icon name={catCfg.icon as any} size={10} className="inline mr-1" />{catCfg.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{finding.title}</p>
                    </div>
                    <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground shrink-0 mt-1" />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="pt-4">
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DESCRIPTION</p>
                        <p className="text-sm" style={{ color: 'var(--foreground)' }}>{finding.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>ROUTES AFFECTÉES</p>
                        <div className="flex flex-wrap gap-1">
                          {finding.affectedRoutes.map(r => (
                            <span key={r} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: sevCfg.bg, color: sevCfg.color }}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#16a34a' }}>RECOMMANDATION</p>
                        <p className="text-sm" style={{ color: '#15803d' }}>{finding.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ROUTES TAB ── */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <p className="text-2xl font-bold" style={{ color: '#16a34a' }}>{protectedCount}</p>
              <p className="text-xs mt-1" style={{ color: '#15803d' }}>Routes protégées (middleware)</p>
            </div>
            <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>{unprotectedCount}</p>
              <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>Routes non protégées ⚠️</p>
            </div>
            <div className="rounded-xl border p-4 text-center" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
              <p className="text-2xl font-bold" style={{ color: '#2563eb' }}>{publicCount}</p>
              <p className="text-xs mt-1" style={{ color: '#1d4ed8' }}>Routes publiques (correct)</p>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Matrice de protection des routes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Route</th>
                    <th className="text-left p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Rôles requis</th>
                    <th className="text-center p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Auth requise</th>
                    <th className="text-center p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Dans middleware</th>
                    <th className="text-center p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoutes.map((route, i) => (
                    <tr key={route.path} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                      <td className="p-3 font-mono" style={{ color: 'var(--foreground)' }}>{route.path}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {route.roles.map(r => (
                            <span key={r} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {route.protected
                          ? <Icon name="LockClosedIcon" size={14} style={{ color: '#16a34a', display: 'inline' }} />
                          : <Icon name="GlobeAltIcon" size={14} style={{ color: '#2563eb', display: 'inline' }} />}
                      </td>
                      <td className="p-3 text-center">
                        {route.inMiddleware
                          ? <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Oui</span>
                          : route.protected
                            ? <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>✗ Non</span>
                            : <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>Public</span>}
                      </td>
                      <td className="p-3 text-center">
                        {!route.protected
                          ? <span className="text-xs" style={{ color: '#2563eb' }}>Public</span>
                          : route.inMiddleware
                            ? <span className="text-xs" style={{ color: '#16a34a' }}>Sécurisé</span>
                            : <span className="text-xs font-bold" style={{ color: '#dc2626' }}>EXPOSÉ</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fix recommendation */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#dc2626' }}>Correction recommandée — middleware.ts</h3>
            <pre className="text-xs overflow-x-auto p-3 rounded-lg" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>{`// AVANT (approche liste blanche — incomplète)
const PROTECTED_PREFIXES = ['/patient-home', '/workspace-professionnel', ...28 routes];

// APRÈS (approche liste noire — sécurisée)
const PUBLIC_PATHS = ['/', '/sign-up-login-screen', '/auth/callback', 
  '/pricing', '/pricing-plans', '/enterprise-contact'];

const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p));
if (!isPublic) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(loginUrl);
  
  // Vérification de rôle pour routes sensibles
  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single();
  
  if (pathname.startsWith('/platform-admin') && profile?.role !== 'platform_admin')
    return NextResponse.redirect(unauthorizedUrl);
}`}</pre>
          </div>
        </div>
      )}

      {/* ── RLS TAB ── */}
      {activeTab === 'rls' && (
        <div className="space-y-4">
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>État RLS par table Supabase</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Table</th>
                    <th className="text-center p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>RLS Activé</th>
                    <th className="text-left p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Politiques</th>
                    <th className="text-center p-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Risque</th>
                  </tr>
                </thead>
                <tbody>
                  {rlsAudit.map((row, i) => {
                    const rc = riskConfig[row.risk];
                    return (
                      <tr key={row.table} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                        <td className="p-3 font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{row.table}</td>
                        <td className="p-3 text-center">
                          {row.rlsEnabled
                            ? <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Activé</span>
                            : <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>✗ Non</span>}
                        </td>
                        <td className="p-3">
                          <div className="space-y-0.5">
                            {row.policies.map((p, j) => (
                              <p key={j} style={{ color: p.includes('⚠️') ? '#dc2626' : 'var(--muted-foreground)' }}>{p}</p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: rc.bg, color: rc.color }}>{rc.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#dc2626' }}>Migration RLS requise — tables financières Phase 2</h3>
            <pre className="text-xs overflow-x-auto p-3 rounded-lg" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4' }}>{`-- Migration: 20260812_financial_rls_policies.sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Subscriptions: user voit les siennes, org_admin voit celles de son org
CREATE POLICY "subscriptions_select" ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.org_members WHERE user_id = auth.uid() AND role = 'org_admin'
  ) OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'platform_admin'));

-- Payments: même logique
CREATE POLICY "payments_select" ON public.payments FOR SELECT
  USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM public.org_members WHERE user_id = auth.uid() AND role = 'org_admin'
  ) OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'platform_admin'));`}</pre>
          </div>
        </div>
      )}

      {/* ── NAVIGATION TAB ── */}
      {activeTab === 'navigation' && (
        <div className="space-y-4">
          {/* Nav stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { role: 'Patient', count: 46, duplicates: 0, orphaned: 3, color: '#2563eb' },
              { role: 'Professionnel', count: 72, duplicates: 6, orphaned: 5, color: '#16a34a' },
              { role: 'Admin', count: 54, duplicates: 0, orphaned: 0, color: '#ea580c' },
              { role: 'Institution', count: 15, duplicates: 0, orphaned: 0, color: '#7c3aed' },
              { role: 'Ambassadeur', count: 8, duplicates: 5, orphaned: 0, color: '#ca8a04' },
              { role: 'Platform Admin', count: 38, duplicates: 6, orphaned: 0, color: '#dc2626' },
            ].map(r => (
              <div key={r.role} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.role}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>Items nav</span>
                    <span className="font-bold" style={{ color: 'var(--foreground)' }}>{r.count}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>Doublons</span>
                    <span className="font-bold" style={{ color: r.duplicates > 0 ? '#ca8a04' : '#16a34a' }}>{r.duplicates}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>Orphelins</span>
                    <span className="font-bold" style={{ color: r.orphaned > 0 ? '#dc2626' : '#16a34a' }}>{r.orphaned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation findings */}
          <div className="space-y-3">
            {findings.filter(f => f.category === 'navigation' || f.category === 'role_conflict').map(finding => {
              const sevCfg = severityConfig[finding.severity];
              return (
                <div key={finding.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sevCfg.bg }}>
                      <Icon name={sevCfg.icon as any} size={16} style={{ color: sevCfg.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{finding.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: sevCfg.bg, color: sevCfg.color }}>{sevCfg.label}</span>
                      </div>
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{finding.title}</p>
                      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{finding.description}</p>
                      <div className="rounded-lg p-2" style={{ backgroundColor: '#f0fdf4' }}>
                        <p className="text-xs" style={{ color: '#15803d' }}><strong>Fix :</strong> {finding.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BUSINESS LOGIC TAB ── */}
      {activeTab === 'business' && (
        <div className="space-y-4">
          {/* Workflow status */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>État des workflows métier critiques</h3>
            <div className="space-y-3">
              {[
                { workflow: 'Inscription & Onboarding Patient', steps: ['Formulaire inscription', 'Vérification email', 'Création profil DB', 'Redirection patient-home'], complete: [true, true, true, true], status: 'complete' },
                { workflow: 'Inscription Professionnel', steps: ['Formulaire pro', 'Soumission documents', 'Révision admin', 'Activation compte'], complete: [true, true, false, false], status: 'partial' },
                { workflow: 'Flux Téléconsultation', steps: ['Prise RDV', 'Lobby', 'Salle d\'attente', 'Session', 'Post-call survey'], complete: [true, true, true, false, false], status: 'partial' },
                { workflow: 'Onboarding Organisation', steps: ['Création org', 'Config initiale', 'Ajout professionnels', 'Activation modules'], complete: [true, true, false, false], status: 'partial' },
                { workflow: 'Paiement & Abonnement', steps: ['Sélection plan', 'Checkout', 'Paiement', 'Activation abonnement', 'Notification'], complete: [true, true, false, false, false], status: 'partial' },
                { workflow: 'Partage Médical SHIFA Share', steps: ['Sélection document', 'Choix destinataire', 'Validation NEED-TO-KNOW', 'Chiffrement', 'Envoi sécurisé'], complete: [true, true, false, false, false], status: 'partial' },
                { workflow: 'Offboarding Employé', steps: ['Initiation offboarding', 'Révocation accès org', 'Conservation compte SHIFA', 'Notification'], complete: [true, false, false, false], status: 'incomplete' },
                { workflow: 'Transfert Patient Inter-établissements', steps: ['Demande transfert', 'Validation médecin', 'Notification établissement cible', 'Transfert dossier', 'Confirmation'], complete: [true, true, false, false, false], status: 'partial' },
              ].map(wf => {
                const completedSteps = wf.steps.filter((_, i) => wf.complete[i]).length;
                const pct = Math.round((completedSteps / wf.steps.length) * 100);
                const statusColor = wf.status === 'complete' ? '#16a34a' : wf.status === 'partial' ? '#ca8a04' : '#dc2626';
                return (
                  <div key={wf.workflow} className="rounded-lg border p-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{wf.workflow}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusColor + '20', color: statusColor }}>
                        {completedSteps}/{wf.steps.length} étapes
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {wf.steps.map((step, i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: wf.complete[i] ? statusColor : 'var(--border)' }} title={step} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {wf.steps.map((step, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{
                          backgroundColor: wf.complete[i] ? statusColor + '20' : '#fef2f2',
                          color: wf.complete[i] ? statusColor : '#dc2626',
                        }}>
                          {wf.complete[i] ? '✓' : '✗'} {step}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business logic findings */}
          <div className="space-y-3">
            {findings.filter(f => f.category === 'business_logic').map(finding => {
              const sevCfg = severityConfig[finding.severity];
              return (
                <div key={finding.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sevCfg.bg }}>
                      <Icon name="CpuChipIcon" size={16} style={{ color: sevCfg.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{finding.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: sevCfg.bg, color: sevCfg.color }}>{sevCfg.label}</span>
                      </div>
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{finding.title}</p>
                      <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{finding.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {finding.affectedRoutes.map(r => (
                          <span key={r} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{r}</span>
                        ))}
                      </div>
                      <div className="rounded-lg p-2" style={{ backgroundColor: '#f0fdf4' }}>
                        <p className="text-xs" style={{ color: '#15803d' }}><strong>Fix :</strong> {finding.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
