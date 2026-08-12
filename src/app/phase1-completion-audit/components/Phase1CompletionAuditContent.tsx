'use client';
import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

type RouteStatus = 'existing' | 'new' | 'placeholder' | 'missing';

interface RouteEntry {
  actor: string;
  space: string;
  module: string;
  route: string;
  label: string;
  status: RouteStatus;
}

const inventory: RouteEntry[] = [
  // PATIENT
  { actor: 'Patient', space: 'Espace Patient', module: 'Accueil', route: '/patient-home', label: 'Tableau de bord patient', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Exploration', route: '/patient-explorer', label: 'Explorateur professionnels', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Rendez-vous', route: '/appointment-booking', label: 'Prise de rendez-vous', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Dossier Santé', route: '/dossier-de-sant', label: 'Dossier de santé', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Messagerie', route: '/patient-messages', label: 'Messages patient', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Documents', route: '/patient-documents', label: 'Documents médicaux', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Consultations', route: '/patient-consultations', label: 'Historique consultations', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Résultats', route: '/patient-results', label: 'Résultats analyses', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Suivi', route: '/patient-follow-up', label: 'Suivi & soins', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Vaccination', route: '/patient-vaccination', label: 'Carnet vaccination', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Prévention', route: '/patient-prevention', label: 'Prévention santé', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Urgences', route: '/patient-emergency', label: 'Urgences patient', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Téléconsultation', route: '/patient-teleconsultation', label: 'Mes téléconsultations', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Téléconsultation', route: '/patient-precall-vitals', label: 'Préparer la session', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Téléconsultation', route: '/patient-session-teleconsult', label: 'Session téléconsult.', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Téléconsultation', route: '/patient-postcall-survey', label: 'Enquête post-appel', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Ordonnances', route: '/patient-prescription-receipt', label: 'Ordonnances reçues', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Carte SHIFA', route: '/shifa-card', label: 'Carte SHIFA', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Carte SHIFA', route: '/shifa-card-management', label: 'Gestion carte SHIFA', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Finance', route: '/wallet-interface', label: 'Portefeuille', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Finance', route: '/patient-payments', label: 'Paiements patient', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Abonnement', route: '/patient-subscriptions', label: 'Abonnements patient', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Abonnement', route: '/subscription-management', label: 'Gestion abonnement', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Abonnement', route: '/checkout', label: 'Checkout / Souscrire', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Compte', route: '/patient-consent', label: 'Consentements', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Compte', route: '/patient-connected-devices', label: 'Appareils connectés', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Compte', route: '/patient-notifications', label: 'Notifications', status: 'existing' },
  { actor: 'Patient', space: 'Espace Patient', module: 'Compte', route: '/patient-settings', label: 'Paramètres patient', status: 'existing' },
  // PROFESSIONAL
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Tableau de bord', route: '/workspace-professionnel', label: 'Workspace professionnel', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Patients', route: '/pro-patients', label: 'Liste patients', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Agenda', route: '/pro-agenda', label: 'Agenda professionnel', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Consultation', route: '/consultation-workspace', label: 'Espace consultation', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Dossiers', route: '/dossier-de-sant', label: 'Dossiers patients', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Prescriptions', route: '/pro-prescriptions', label: 'Prescriptions', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Résultats', route: '/pro-resultats', label: 'Résultats', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Messagerie', route: '/pro-messages', label: 'Messagerie pro', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Suivi', route: '/pro-patient-monitoring', label: 'Suivi post-consultation', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Plans de soins', route: '/pro-care-plans', label: 'Plans de soins', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Téléconsultation', route: '/teleconsultation-lobby', label: 'Lobby téléconsult.', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Téléconsultation', route: '/teleconsultation-waiting', label: "Salle d'attente", status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Téléconsultation', route: '/teleconsultation-session', label: 'Session en cours', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Téléconsultation', route: '/teleconsultation-history', label: 'Historique téléconsult.', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/lab-dashboard', label: 'Laboratoire', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/pharmacy-dashboard', label: 'Pharmacie', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/imaging-dashboard', label: 'Imagerie', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/emergency-dashboard', label: 'Urgences', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/maternity-workspace', label: 'Maternité', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Spécialités', route: '/pediatrics-workspace', label: 'Pédiatrie', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'IA', route: '/shifa-ai-workspace', label: 'SHIFA AI', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/shifa-academy', label: 'Académie', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/health-marketplace', label: 'Marketplace santé', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/notifications-center', label: 'Centre notifications', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/support-center', label: 'Support & aide', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/interoperability-hub', label: 'Interopérabilité', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/referrals-interface', label: 'Adressages', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Outils', route: '/medical-certificates', label: 'Certificats médicaux', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Compte', route: '/pro-pricing', label: 'Plans & tarifs pro', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Compte', route: '/pro-parametres', label: 'Paramètres pro', status: 'existing' },
  { actor: 'Professionnel', space: 'Espace Professionnel', module: 'Vérification', route: '/pro-verification', label: 'Vérification pro', status: 'existing' },
  // ADMIN ORGANISATION
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Tableau de bord', route: '/administration-tablissement', label: 'Admin établissement', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Hôpital', route: '/hopital-dashboard', label: 'Dashboard hôpital', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Hôpital', route: '/hopital-configuration', label: 'Configuration hôpital', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Hôpital', route: '/hopital-admissions', label: 'Admissions', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Finance', route: '/billing-dashboard', label: 'Facturation', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Finance', route: '/finance-dashboard', label: 'Finance dashboard', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Équipements', route: '/biomedical-equipment', label: 'Équipements biomédicaux', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Qualité', route: '/quality-accreditation', label: 'Qualité & accréditation', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Interopérabilité', route: '/interoperability-hub', label: 'Interopérabilité', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Inventaire', route: '/inventory-procurement', label: 'Inventaire & approvisionnement', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Gestion', route: '/admin-professionnels', label: 'Professionnels', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Gestion', route: '/admin-utilisateurs', label: 'Utilisateurs', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Gestion', route: '/admin-modules', label: 'Modules', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Gestion', route: '/admin-roles', label: 'Rôles & droits', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Analyse', route: '/admin-activite', label: 'Activité', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Analyse', route: '/admin-audit', label: 'Audit', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Compte', route: '/org-onboarding', label: 'Config. initiale', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Compte', route: '/admin-parametres', label: 'Paramètres admin', status: 'existing' },
  { actor: 'Admin Organisation', space: 'Administration Établissement', module: 'Catalogue', route: '/module-catalog', label: 'Catalogue modules', status: 'existing' },
  // INSTITUTION
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Ministère', route: '/espace-ministere', label: 'Espace ministère', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Ministère', route: '/ministere-oversight', label: 'Supervision nationale', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Assurance', route: '/espace-assurance', label: 'Espace assurance', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Assurance', route: '/assurance-workspace', label: 'Workspace assureur', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Université', route: '/espace-universite', label: 'Espace université', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'ONG', route: '/espace-ong', label: 'Espace ONG', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Santé Publique', route: '/espace-sante-publique', label: 'Santé publique', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Épidémio', route: '/epidemio-surveillance', label: 'Surveillance épidémio.', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Recherche', route: '/research-workspace', label: 'Organisation de recherche', status: 'existing' },
  { actor: 'Institution', space: 'Espace Institutionnel', module: 'Communauté', route: '/community-hub', label: 'Hub communautaire', status: 'existing' },
  // AMBASSADOR
  { actor: 'Ambassadeur', space: 'Espace Ambassadeur', module: 'Tableau de bord', route: '/ambassador-workspace', label: 'Workspace ambassadeur', status: 'existing' },
  { actor: 'Ambassadeur', space: 'Espace Ambassadeur', module: 'Commercial', route: '/ambassador-commercial', label: 'Commercial & revenus', status: 'existing' },
  { actor: 'Ambassadeur', space: 'Espace Ambassadeur', module: 'Formation', route: '/shifa-academy', label: 'Formation & académie', status: 'existing' },
  { actor: 'Ambassadeur', space: 'Espace Ambassadeur', module: 'Support', route: '/support-center', label: 'Support', status: 'existing' },
  // PLATFORM ADMIN
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Tableau de bord', route: '/platform-admin', label: 'Admin plateforme', status: 'existing' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Traductions', route: '/admin-translations', label: 'Traductions i18n', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Modules', route: '/module-catalog', label: 'Catalogue modules', status: 'existing' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Modules', route: '/settings/country-module-config', label: 'Modules par pays', status: 'existing' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/pricing', label: 'Tarification globale', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/pricing-plans', label: 'Comparaison plans', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/pro-pricing', label: 'Plans professionnels', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/org-pricing', label: 'Plans organisation', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/subscription-management', label: 'Gestion abonnements', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/checkout', label: 'Checkout', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/ambassador-commercial', label: 'Ambassadeur commercial', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/marketplace-commercial', label: 'Marketplace commercial', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/academy-pricing', label: 'Academy tarification', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/enterprise-contact', label: 'Enterprise & B2G', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/platform-revenue', label: 'Revenus plateforme', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/ai-pricing', label: 'SHIFA AI tarification', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/card-economy', label: 'Économie carte physique', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/teleconsultation-commercial', label: 'Téléconsult. commercial', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/insurance-commercial', label: 'Assurance commercial', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/api-monetization', label: 'API & interopérabilité', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/tax-configuration', label: 'Configuration fiscale', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Commercial', route: '/pricing-engine', label: 'Moteur de tarification', status: 'new' },
  { actor: 'Platform Admin', space: 'Administration Plateforme', module: 'Audit', route: '/phase1-completion-audit', label: 'Audit Phase 1', status: 'new' },
  // AUTH
  { actor: 'Tous', space: 'Authentification', module: 'Auth', route: '/sign-up-login-screen', label: 'Connexion / Inscription', status: 'existing' },
  { actor: 'Tous', space: 'Authentification', module: 'Auth', route: '/auth/callback', label: 'Callback OAuth', status: 'existing' },
  // LANDING
  { actor: 'Tous', space: 'Landing', module: 'Landing', route: '/', label: 'Page d\'accueil', status: 'existing' },
];

const statusConfig: Record<RouteStatus, { label: string; bg: string; text: string; icon: string }> = {
  existing: { label: 'Existant', bg: '#dcfce7', text: '#16a34a', icon: 'CheckCircleIcon' },
  new: { label: 'Nouveau', bg: '#dbeafe', text: '#1d4ed8', icon: 'PlusCircleIcon' },
  placeholder: { label: 'Placeholder', bg: '#fef9c3', text: '#ca8a04', icon: 'ClockIcon' },
  missing: { label: 'Manquant', bg: '#fee2e2', text: '#dc2626', icon: 'XCircleIcon' },
};

const actors = ['Tous', 'Patient', 'Professionnel', 'Admin Organisation', 'Institution', 'Ambassadeur', 'Platform Admin'];

export default function Phase1CompletionAuditContent() {
  const [actorFilter, setActorFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState<'all' | RouteStatus>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'coverage'>('table');

  const filtered = useMemo(() => inventory.filter(r => {
    const matchActor = actorFilter === 'Tous' || r.actor === actorFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchSearch = !search || r.route.toLowerCase().includes(search.toLowerCase()) || r.label.toLowerCase().includes(search.toLowerCase()) || r.module.toLowerCase().includes(search.toLowerCase());
    return matchActor && matchStatus && matchSearch;
  }), [actorFilter, statusFilter, search]);

  const totalRoutes = inventory.length;
  const existingCount = inventory.filter(r => r.status === 'existing').length;
  const newCount = inventory.filter(r => r.status === 'new').length;
  const placeholderCount = inventory.filter(r => r.status === 'placeholder').length;
  const missingCount = inventory.filter(r => r.status === 'missing').length;
  const coveredCount = existingCount + newCount;
  const coveragePct = Math.round((coveredCount / totalRoutes) * 100);

  // Coverage by actor
  const actorCoverage = actors.filter(a => a !== 'Tous').map(actor => {
    const routes = inventory.filter(r => r.actor === actor);
    const covered = routes.filter(r => r.status === 'existing' || r.status === 'new').length;
    const pct = routes.length > 0 ? Math.round((covered / routes.length) * 100) : 0;
    return { actor, total: routes.length, covered, pct };
  });

  // Module catalog
  const moduleCatalog = useMemo(() => {
    const map: Record<string, { actor: string; routes: RouteEntry[] }> = {};
    inventory.forEach(r => {
      const key = `${r.actor}::${r.module}`;
      if (!map[key]) map[key] = { actor: r.actor, routes: [] };
      map[key].routes.push(r);
    });
    return Object.entries(map).map(([key, val]) => {
      const [, module] = key.split('::');
      const covered = val.routes.filter(r => r.status === 'existing' || r.status === 'new').length;
      return { module, actor: val.actor, total: val.routes.length, covered, pct: Math.round((covered / val.routes.length) * 100) };
    });
  }, []);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}>
            <Icon name="ClipboardDocumentCheckIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Audit Phase 1 — Inventaire complet</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>ACTEUR → ESPACE → MODULE → ROUTE → STATUT · Validation readiness Phase 2</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: coveragePct >= 90 ? '#dcfce7' : '#fef9c3', color: coveragePct >= 90 ? '#16a34a' : '#ca8a04' }}>
            {coveragePct}% couverture Phase 1
          </div>
        </div>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Routes totales', value: totalRoutes, color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)', icon: 'MapIcon' },
          { label: 'Existantes', value: existingCount, color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)', icon: 'CheckCircleIcon' },
          { label: 'Nouvelles Phase 1', value: newCount, color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)', icon: 'PlusCircleIcon' },
          { label: 'Placeholder', value: placeholderCount, color: '#ca8a04', bg: 'rgba(202,138,4,0.08)', icon: 'ClockIcon' },
          { label: 'Manquantes', value: missingCount, color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: 'XCircleIcon' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-4 border flex items-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: k.bg }}>
              <Icon name={k.icon as any} size={18} style={{ color: k.color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coverage progress bar */}
      <div className="rounded-2xl p-5 border mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Couverture globale Phase 1</span>
          <span className="text-sm font-bold" style={{ color: coveragePct >= 90 ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{coveredCount} / {totalRoutes} routes ({coveragePct}%)</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${coveragePct}%`, background: 'linear-gradient(90deg, var(--shifa-blue), var(--shifa-cyan))' }} />
        </div>
        <div className="flex gap-4 mt-3">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = inventory.filter(r => r.status === key).length;
            const pct = Math.round((count / totalRoutes) * 100);
            return (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.text }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.label}: {count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'table', label: 'Inventaire complet', icon: 'TableCellsIcon' }, { key: 'coverage', label: 'Couverture par acteur & module', icon: 'ChartBarIcon' }].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === v.key ? 'text-white shadow-sm' : 'hover:bg-muted'}`}
            style={view === v.key ? { background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={v.icon as any} size={15} />
            {v.label}
          </button>
        ))}
      </div>

      {view === 'table' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="Rechercher route, module, label..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            />
            <select
              value={actorFilter}
              onChange={e => setActorFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {actors.map(a => <option key={a}>{a}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <span className="flex items-center text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Acteur', 'Espace', 'Module', 'Route', 'Interface', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const s = statusConfig[r.status];
                    return (
                      <tr key={i} className="border-t hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{r.actor}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.space}</td>
                        <td className="px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{r.module}</td>
                        <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.route}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{r.label}</td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit" style={{ backgroundColor: s.bg, color: s.text }}>
                            <Icon name={s.icon as any} size={11} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'coverage' && (
        <div className="space-y-6">
          {/* Coverage by actor */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Couverture par acteur</h3>
            </div>
            <div className="p-4 space-y-4">
              {actorCoverage.map(ac => (
                <div key={ac.actor}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{ac.actor}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ac.covered}/{ac.total} routes · <strong style={{ color: ac.pct === 100 ? 'var(--shifa-green)' : ac.pct >= 80 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }}>{ac.pct}%</strong></span>
                  </div>
                  <div className="w-full h-2.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2.5 rounded-full transition-all" style={{ width: `${ac.pct}%`, backgroundColor: ac.pct === 100 ? 'var(--shifa-green)' : ac.pct >= 80 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module catalog */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Catalogue modules — couverture par acteur</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Acteur', 'Module', 'Routes', 'Couvertes', 'Couverture'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {moduleCatalog.map((m, i) => (
                    <tr key={i} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{m.actor}</span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-xs" style={{ color: 'var(--foreground)' }}>{m.module}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{m.total}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>{m.covered}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${m.pct}%`, backgroundColor: m.pct === 100 ? 'var(--shifa-green)' : m.pct >= 80 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: m.pct === 100 ? 'var(--shifa-green)' : m.pct >= 80 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }}>{m.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phase 2 readiness */}
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.2)' }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.12)' }}>
                <Icon name="RocketLaunchIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>Readiness Phase 2</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Phase 1 couvre <strong>{coveredCount} routes</strong> sur <strong>{totalRoutes}</strong> ({coveragePct}%). 
                  {missingCount > 0 ? ` ${missingCount} route(s) manquante(s) à implémenter avant Phase 2.` : ' Aucune route manquante — Phase 2 peut démarrer.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Surface commerciale', ok: true },
                    { label: 'Espaces acteurs', ok: true },
                    { label: 'Modules spécialisés', ok: true },
                    { label: 'Téléconsultation', ok: true },
                    { label: 'Authentification', ok: true },
                    { label: 'Moteur de tarification', ok: true },
                    { label: 'Taux de change live', ok: false },
                    { label: 'Paiement production', ok: false },
                  ].map(item => (
                    <span key={item.label} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: item.ok ? '#dcfce7' : '#fee2e2', color: item.ok ? '#16a34a' : '#dc2626' }}>
                      <Icon name={item.ok ? 'CheckIcon' : 'XMarkIcon'} size={11} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
