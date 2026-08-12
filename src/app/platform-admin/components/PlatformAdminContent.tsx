'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const tabs = [
  { key: 'dashboard', label: 'Tableau de bord global', icon: 'Squares2X2Icon' },
  { key: 'organizations', label: 'Organisations', icon: 'BuildingOffice2Icon' },
  { key: 'users', label: 'Utilisateurs', icon: 'UsersIcon' },
  { key: 'modules', label: 'Catalogue modules', icon: 'PuzzlePieceIcon' },
  { key: 'subscriptions', label: 'Abonnements', icon: 'CreditCardIcon' },
  { key: 'ambassadors', label: 'Ambassadeurs', icon: 'StarIcon' },
  { key: 'security', label: 'Sécurité & Audit', icon: 'ShieldCheckIcon' },
  { key: 'route-audit', label: 'Audit Routes', icon: 'ClipboardDocumentCheckIcon' },
  { key: 'settings', label: 'Paramètres système', icon: 'Cog6ToothIcon' },
];

const globalKpis = [
  { label: 'Organisations actives', value: '1 284', sub: '+47 ce mois', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Utilisateurs enregistrés', value: '284 750', sub: '+12 400 ce mois', icon: 'UsersIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Professionnels vérifiés', value: '18 420', sub: '94% taux de vérif.', icon: 'ShieldCheckIcon', color: 'var(--shifa-cyan)', bg: 'rgba(6,182,212,0.08)' },
  { label: 'Revenus plateforme', value: '€ 284K', sub: 'Mois en cours', icon: 'BanknotesIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Ambassadeurs actifs', value: '342', sub: '28 pays', icon: 'StarIcon', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { label: 'Pays déployés', value: '28', sub: 'Afrique, Europe, Moyen-Orient', icon: 'GlobeAltIcon', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
];

const growthData = [
  { mois: 'Mar', orgs: 1180, users: 248000 },
  { mois: 'Avr', orgs: 1210, users: 256000 },
  { mois: 'Mai', orgs: 1235, users: 264000 },
  { mois: 'Jun', orgs: 1248, users: 270000 },
  { mois: 'Jul', orgs: 1268, users: 278000 },
  { mois: 'Aoû', orgs: 1284, users: 284750 },
];

const orgTypeData = [
  { name: 'Cliniques', value: 420, color: 'var(--shifa-blue)' },
  { name: 'Hôpitaux', value: 180, color: 'var(--shifa-cyan)' },
  { name: 'Pharmacies', value: 310, color: 'var(--shifa-green)' },
  { name: 'Laboratoires', value: 145, color: 'var(--shifa-amber)' },
  { name: 'Autres', value: 229, color: '#8B5CF6' },
];

const organizations = [
  { id: 'org-001', name: 'CHU Saint-Louis', type: 'Hôpital', country: '🇸🇳 Sénégal', plan: 'Enterprise', users: 284, status: 'actif', since: 'Jan 2025' },
  { id: 'org-002', name: 'Clinique Al-Shifa Dakar', type: 'Clinique', country: '🇸🇳 Sénégal', plan: 'Pro', users: 48, status: 'actif', since: 'Mar 2025' },
  { id: 'org-003', name: "Pharmacie Centrale Abidjan", type: 'Pharmacie', country: "🇨🇮 Côte d\'Ivoire", plan: 'Standard', users: 12, status: 'actif', since: 'Avr 2025' },
  { id: 'org-004', name: 'Hôpital Ibn Sina Casablanca', type: 'Hôpital', country: '🇲🇦 Maroc', plan: 'Enterprise', users: 520, status: 'actif', since: 'Fév 2025' },
  { id: 'org-005', name: 'Labo BioMed Comores', type: 'Laboratoire', country: '🇰🇲 Comores', plan: 'Standard', users: 8, status: 'en_attente', since: 'Aoû 2026' },
  { id: 'org-006', name: 'Centre Santé Yaoundé', type: 'Centre de santé', country: '🇨🇲 Cameroun', plan: 'Pro', users: 35, status: 'actif', since: 'Jun 2025' },
];

const modules = [
  { id: 'mod-001', name: 'Dossier Patient', category: 'Clinique', status: 'stable', orgs: 1284, version: '2.4.1' },
  { id: 'mod-002', name: 'Téléconsultation', category: 'Clinique', status: 'stable', orgs: 842, version: '1.8.3' },
  { id: 'mod-003', name: 'Laboratoire', category: 'Spécialisé', status: 'stable', orgs: 145, version: '1.2.0' },
  { id: 'mod-004', name: 'Pharmacie', category: 'Spécialisé', status: 'stable', orgs: 310, version: '1.5.2' },
  { id: 'mod-005', name: 'SHIFA AI', category: 'IA', status: 'beta', orgs: 284, version: '0.9.4' },
  { id: 'mod-006', name: 'Interopérabilité FHIR', category: 'Intégration', status: 'beta', orgs: 48, version: '0.7.1' },
  { id: 'mod-007', name: 'Biomédicale', category: 'Gestion', status: 'stable', orgs: 180, version: '1.1.0' },
  { id: 'mod-008', name: 'Wallet & Paiements', category: 'Finance', status: 'coming_soon', orgs: 0, version: '—' },
];

const ambassadors = [
  { id: 'amb-001', name: 'Karim Diallo', country: '🇸🇳 Sénégal', level: 'Or', referrals: 47, activations: 38, status: 'actif' },
  { id: 'amb-002', name: 'Fatima Al-Rashid', country: '🇸🇦 Arabie Saoudite', level: 'Platine', referrals: 124, activations: 108, status: 'actif' },
  { id: 'amb-003', name: 'Jean-Pierre Mbeki', country: '🇨🇲 Cameroun', level: 'Argent', referrals: 22, activations: 15, status: 'actif' },
  { id: 'amb-004', name: 'Amira Benali', country: '🇲🇦 Maroc', level: 'Or', referrals: 58, activations: 44, status: 'actif' },
];

const auditLogs = [
  { id: 'log-001', action: 'Organisation créée', actor: 'admin@shifa.health', target: 'Labo BioMed Comores', time: '10 août 2026 14:32', level: 'info' },
  { id: 'log-002', action: 'Module activé', actor: 'admin@shifa.health', target: 'SHIFA AI — CHU Saint-Louis', time: '10 août 2026 11:18', level: 'info' },
  { id: 'log-003', action: 'Tentative connexion échouée', actor: 'unknown@example.com', target: 'Portail admin', time: '9 août 2026 23:47', level: 'warning' },
  { id: 'log-004', action: 'Rôle modifié', actor: 'admin@shifa.health', target: 'Dr. Moussa Coulibaly', time: '9 août 2026 16:05', level: 'info' },
  { id: 'log-005', action: 'Export données autorisé', actor: 'admin@shifa.health', target: 'Ministère Santé Sénégal', time: '8 août 2026 09:22', level: 'warning' },
];

const countries = [
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', orgs: 284, users: 48200, currency: 'XOF', status: 'actif' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', orgs: 210, users: 38400, currency: 'MAD', status: 'actif' },
  { code: 'CI', name: "Côte d\'Ivoire", flag: '🇨🇮', orgs: 185, users: 32100, currency: 'XOF', status: 'actif' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', orgs: 142, users: 24800, currency: 'XAF', status: 'actif' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', orgs: 28, users: 4200, currency: 'KMF', status: 'actif' },
  { code: 'FR', name: 'France', flag: '🇫🇷', orgs: 98, users: 18400, currency: 'EUR', status: 'actif' },
  { code: 'AE', name: 'Émirats Arabes Unis', flag: '🇦🇪', orgs: 64, users: 12800, currency: 'AED', status: 'actif' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  suspendu: { label: 'Suspendu', bg: '#fee2e2', text: '#dc2626' },
  stable: { label: 'Stable', bg: '#dcfce7', text: '#16a34a' },
  beta: { label: 'Bêta', bg: '#fef9c3', text: '#ca8a04' },
  coming_soon: { label: 'Bientôt', bg: '#f1f5f9', text: '#64748b' },
  info: { label: 'Info', bg: '#dbeafe', text: '#1d4ed8' },
  warning: { label: 'Alerte', bg: '#fef9c3', text: '#ca8a04' },
  error: { label: 'Erreur', bg: '#fee2e2', text: '#dc2626' },
};

const planConfig: Record<string, { bg: string; text: string }> = {
  Enterprise: { bg: 'rgba(139,92,246,0.1)', text: '#7C3AED' },
  Pro: { bg: 'rgba(0,102,255,0.1)', text: 'var(--shifa-blue)' },
  Standard: { bg: 'rgba(16,185,129,0.1)', text: 'var(--shifa-green)' },
};

// ─── Route Audit Data ─────────────────────────────────────────────────────────
type IssueType = 'orphaned' | 'circular' | 'unreachable' | 'missing-sidebar' | 'accessibility' | 'ok';

interface RouteAuditEntry {
  route: string;
  label: string;
  actor: string;
  hasSidebar: boolean;
  hasPage: boolean;
  issues: IssueType[];
  a11yScore: number;
}

const routeAuditData: RouteAuditEntry[] = [
  { route: '/patient-home', label: 'Accueil Patient', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 92 },
  { route: '/patient-explorer', label: 'Explorateur', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/appointment-booking', label: 'Rendez-vous', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/dossier-de-sant', label: 'Dossier Santé', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 85 },
  { route: '/patient-messages', label: 'Messages', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/patient-documents', label: 'Documents', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/patient-consultations', label: 'Consultations', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/patient-results', label: 'Résultats', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/patient-follow-up', label: 'Suivi', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 86 },
  { route: '/patient-vaccination', label: 'Vaccination', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/patient-prevention', label: 'Prévention', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/patient-emergency', label: 'Urgences', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 84 },
  { route: '/patient-teleconsultation', label: 'Téléconsultation', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/patient-precall-vitals', label: 'Préparer session', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 85 },
  { route: '/patient-session-teleconsult', label: 'Session téléconsult.', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 83 },
  { route: '/patient-postcall-survey', label: 'Enquête post-appel', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/patient-prescription-receipt', label: 'Ordonnances reçues', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/shifa-card', label: 'Carte SHIFA', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/shifa-card-management', label: 'Gestion carte', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/wallet-interface', label: 'Portefeuille', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 86 },
  { route: '/patient-payments', label: 'Paiements', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/patient-subscriptions', label: 'Abonnements', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/subscription-management', label: 'Gestion abonnement', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/checkout', label: 'Checkout', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/patient-consent', label: 'Consentements', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/patient-connected-devices', label: 'Appareils connectés', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 85 },
  { route: '/patient-notifications', label: 'Notifications', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/patient-settings', label: 'Paramètres', actor: 'Patient', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/workspace-professionnel', label: 'Workspace Pro', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/pro-patients', label: 'Patients', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/pro-agenda', label: 'Agenda', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/consultation-workspace', label: 'Consultation', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/pro-prescriptions', label: 'Prescriptions', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/pro-resultats', label: 'Résultats', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/pro-messages', label: 'Messagerie', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 86 },
  { route: '/pro-patient-monitoring', label: 'Suivi post-consult.', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 85 },
  { route: '/pro-care-plans', label: 'Plans de soins', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/teleconsultation-lobby', label: 'Lobby téléconsult.', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/teleconsultation-waiting', label: "Salle d'attente", actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 85 },
  { route: '/teleconsultation-session', label: 'Session en cours', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 84 },
  { route: '/teleconsultation-history', label: 'Historique téléconsult.', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/lab-dashboard', label: 'Laboratoire', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/pharmacy-dashboard', label: 'Pharmacie', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/imaging-dashboard', label: 'Imagerie', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/emergency-dashboard', label: 'Urgences', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 86 },
  { route: '/maternity-workspace', label: 'Maternité', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/pediatrics-workspace', label: 'Pédiatrie', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/shifa-ai-workspace', label: 'SHIFA AI', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/shifa-academy', label: 'Académie', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/health-marketplace', label: 'Marketplace', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/notifications-center', label: 'Notifications', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/support-center', label: 'Support', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/interoperability-hub', label: 'Interopérabilité', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 86 },
  { route: '/referrals-interface', label: 'Adressages', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/medical-certificates', label: 'Certificats médicaux', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/pro-pricing', label: 'Plans & tarifs', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/pro-parametres', label: 'Paramètres pro', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/pro-verification', label: 'Vérification pro', actor: 'Professionnel', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/administration-tablissement', label: 'Admin établissement', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/hopital-dashboard', label: 'Dashboard hôpital', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/hopital-configuration', label: 'Config. hôpital', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/hopital-admissions', label: 'Admissions', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/billing-dashboard', label: 'Facturation', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/finance-dashboard', label: 'Finance', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/biomedical-equipment', label: 'Équipements biomédicaux', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/quality-accreditation', label: 'Qualité', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/inventory-procurement', label: 'Inventaire', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/admin-professionnels', label: 'Professionnels', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/admin-utilisateurs', label: 'Utilisateurs', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/admin-modules', label: 'Modules', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/admin-roles', label: 'Rôles & droits', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/admin-activite', label: 'Activité', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/admin-audit', label: 'Audit', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/org-onboarding', label: 'Config. initiale', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/admin-parametres', label: 'Paramètres admin', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/module-catalog', label: 'Catalogue modules', actor: 'Admin Org', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/espace-ministere', label: 'Espace ministère', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/ministere-oversight', label: 'Supervision nationale', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/espace-assurance', label: 'Espace assurance', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/assurance-workspace', label: 'Workspace assureur', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/espace-universite', label: 'Espace université', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/espace-ong', label: 'Espace ONG', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/espace-sante-publique', label: 'Santé publique', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/epidemio-surveillance', label: 'Épidémio.', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/research-workspace', label: 'Recherche', actor: 'Institution', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/community-hub', label: 'Hub communautaire', actor: 'Tous', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/ambassador-workspace', label: 'Workspace ambassadeur', actor: 'Ambassadeur', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/ambassador-commercial', label: 'Commercial ambassadeur', actor: 'Ambassadeur', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/platform-admin', label: 'Admin plateforme', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/admin-translations', label: 'Traductions i18n', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/settings/country-module-config', label: 'Modules par pays', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/pricing', label: 'Tarification globale', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/pricing-plans', label: 'Comparaison plans', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/org-pricing', label: 'Plans organisation', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/ambassador-commercial', label: 'Ambassadeur commercial', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/marketplace-commercial', label: 'Marketplace commercial', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/academy-pricing', label: 'Academy tarification', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/enterprise-contact', label: 'Enterprise & B2G', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/platform-revenue', label: 'Revenus plateforme', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/ai-pricing', label: 'SHIFA AI tarification', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/card-economy', label: 'Économie carte', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 87 },
  { route: '/teleconsultation-commercial', label: 'Téléconsult. commercial', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/insurance-commercial', label: 'Assurance commercial', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/api-monetization', label: 'API & interopérabilité', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 88 },
  { route: '/tax-configuration', label: 'Config. fiscale', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 90 },
  { route: '/pricing-engine', label: 'Moteur tarification', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 89 },
  { route: '/phase1-completion-audit', label: 'Audit Phase 1', actor: 'Platform Admin', hasSidebar: true, hasPage: true, issues: ['ok'], a11yScore: 91 },
  { route: '/sign-up-login-screen', label: 'Connexion / Inscription', actor: 'Tous', hasSidebar: false, hasPage: true, issues: ['ok'], a11yScore: 92 },
  { route: '/', label: "Page d'accueil", actor: 'Tous', hasSidebar: false, hasPage: true, issues: ['ok'], a11yScore: 88 },
];

const issueConfig: Record<IssueType, { label: string; bg: string; text: string; icon: string }> = {
  ok: { label: 'OK', bg: '#dcfce7', text: '#16a34a', icon: 'CheckCircleIcon' },
  orphaned: { label: 'Orphelin', bg: '#fee2e2', text: '#dc2626', icon: 'ExclamationCircleIcon' },
  circular: { label: 'Nav circulaire', bg: '#fef9c3', text: '#ca8a04', icon: 'ArrowPathIcon' },
  unreachable: { label: 'Inaccessible', bg: '#fee2e2', text: '#dc2626', icon: 'XCircleIcon' },
  'missing-sidebar': { label: 'Sidebar manquant', bg: '#fef9c3', text: '#ca8a04', icon: 'Bars3Icon' },
  accessibility: { label: 'A11y gap', bg: '#fef3c7', text: '#d97706', icon: 'EyeIcon' },
};

function RouteAuditTab() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [progress, setProgress] = useState(0);
  const [issueFilter, setIssueFilter] = useState<'all' | IssueType>('all');
  const [actorFilter, setActorFilter] = useState('Tous');
  const [search, setSearch] = useState('');

  const actors = ['Tous', 'Patient', 'Professionnel', 'Admin Org', 'Institution', 'Ambassadeur', 'Platform Admin'];

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setScanned(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanned(true);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const filtered = routeAuditData.filter(r => {
    const matchActor = actorFilter === 'Tous' || r.actor === actorFilter;
    const matchIssue = issueFilter === 'all' || r.issues.includes(issueFilter);
    const matchSearch = !search || r.route.toLowerCase().includes(search.toLowerCase()) || r.label.toLowerCase().includes(search.toLowerCase());
    return matchActor && matchIssue && matchSearch;
  });

  const totalRoutes = routeAuditData.length;
  const okRoutes = routeAuditData.filter(r => r.issues.includes('ok')).length;
  const issueRoutes = totalRoutes - okRoutes;
  const avgA11y = Math.round(routeAuditData.reduce((s, r) => s + r.a11yScore, 0) / totalRoutes);
  const missingNavRoutes = routeAuditData.filter(r => !r.hasSidebar && r.actor !== 'Tous').length;

  return (
    <div className="space-y-5">
      {/* Scanner header */}
      <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Validation des routes — Scanner en temps réel</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Détecte : pages orphelines · nav circulaire · pages inaccessibles · liens Sidebar manquants · lacunes accessibilité</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/phase1-completion-audit" className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              Inventaire complet →
            </Link>
            <button
              onClick={startScan}
              disabled={scanning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              {scanning ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Scan en cours…</>
              ) : (
                <><Icon name="MagnifyingGlassIcon" size={15} />Lancer le scan</>
              )}
            </button>
          </div>
        </div>
        {scanning && (
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>
              <span>Analyse de {totalRoutes} routes…</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--shifa-blue), var(--shifa-cyan))' }} />
            </div>
          </div>
        )}
        {scanned && (
          <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <Icon name="CheckCircleIcon" size={14} />
            Scan terminé — {totalRoutes} routes analysées · {issueRoutes} problème(s) détecté(s)
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Routes totales', value: totalRoutes, icon: 'MapIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
          { label: 'Routes OK', value: okRoutes, icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Problèmes détectés', value: issueRoutes, icon: 'ExclamationTriangleIcon', color: issueRoutes > 0 ? '#dc2626' : 'var(--shifa-green)', bg: issueRoutes > 0 ? 'rgba(220,38,38,0.08)' : 'rgba(16,185,129,0.08)' },
          { label: 'Score A11y moyen', value: `${avgA11y}%`, icon: 'EyeIcon', color: avgA11y >= 85 ? 'var(--shifa-green)' : 'var(--shifa-amber)', bg: 'rgba(6,182,212,0.08)' },
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

      {/* Issue summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.entries(issueConfig) as [IssueType, typeof issueConfig[IssueType]][]).filter(([k]) => k !== 'ok').map(([key, cfg]) => {
          const count = routeAuditData.filter(r => r.issues.includes(key)).length;
          return (
            <button
              key={key}
              onClick={() => setIssueFilter(issueFilter === key ? 'all' : key)}
              className="rounded-xl p-3 border text-left transition-all hover:shadow-sm"
              style={{ backgroundColor: issueFilter === key ? cfg.bg : 'var(--card)', borderColor: issueFilter === key ? cfg.text : 'var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name={cfg.icon as any} size={15} style={{ color: cfg.text }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{cfg.label}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: count > 0 ? cfg.text : 'var(--shifa-green)' }}>{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters + table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="p-4 border-b flex flex-wrap gap-3" style={{ borderColor: 'var(--border)' }}>
          <input
            type="text"
            placeholder="Rechercher une route…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[160px] px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
          />
          <select
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
          >
            {actors.map(a => <option key={a}>{a}</option>)}
          </select>
          <select
            value={issueFilter}
            onChange={e => setIssueFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border text-sm"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
          >
            <option value="all">Tous les statuts</option>
            {(Object.entries(issueConfig) as [IssueType, typeof issueConfig[IssueType]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <span className="flex items-center text-xs px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            {filtered.length} route{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)' }}>
                {['Route', 'Interface', 'Acteur', 'Sidebar', 'Page', 'Score A11y', 'Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const primaryIssue = r.issues[0];
                const cfg = issueConfig[primaryIssue];
                const a11yColor = r.a11yScore >= 90 ? 'var(--shifa-green)' : r.a11yScore >= 80 ? 'var(--shifa-blue)' : 'var(--shifa-amber)';
                return (
                  <tr key={i} className="border-t hover:bg-muted/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-2.5 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.route}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--foreground)' }}>{r.label}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{r.actor}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Icon name={r.hasSidebar ? 'CheckCircleIcon' : 'MinusCircleIcon'} size={16} style={{ color: r.hasSidebar ? 'var(--shifa-green)' : 'var(--muted-foreground)' }} />
                    </td>
                    <td className="px-4 py-2.5">
                      <Icon name={r.hasPage ? 'CheckCircleIcon' : 'XCircleIcon'} size={16} style={{ color: r.hasPage ? 'var(--shifa-green)' : '#dc2626' }} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${r.a11yScore}%`, backgroundColor: a11yColor }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: a11yColor }}>{r.a11yScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                        <Icon name={cfg.icon as any} size={11} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PlatformAdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' }}>
            <Icon name="CpuChipIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Administration Plateforme SHIFA</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion globale de l'écosystème SHIFA — Accès restreint</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#7C3AED' }}>
            🔐 Super Admin
          </div>
        </div>
      </div>

      {/* Clinical data notice */}
      <div className="mb-5 px-4 py-3 rounded-xl border flex items-start gap-3" style={{ backgroundColor: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.2)' }}>
        <Icon name="ShieldCheckIcon" size={18} style={{ color: '#7C3AED' }} className="shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Accès clinique séparé :</strong> L'administrateur plateforme gère l'infrastructure SHIFA. L'accès aux données cliniques individuelles nécessite une autorisation distincte et explicite, conformément aux règles de confidentialité médicale.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'text-white shadow-sm' : 'hover:bg-muted'}`}
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #1E1B4B, #3730A3)' } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {globalKpis.map(kpi => (
              <div key={kpi.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                </div>
                <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                <p className="text-xs font-medium mb-1 leading-tight" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Croissance de l'écosystème (6 mois)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="orgs" name="Organisations" stroke="#3730A3" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="users" name="Utilisateurs" stroke="var(--shifa-cyan)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition par type d'org.</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={orgTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {orgTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {orgTypeData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span style={{ color: 'var(--muted-foreground)' }}>{d.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Déploiement par pays</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Pays', 'Organisations', 'Utilisateurs', 'Devise', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {countries.map(c => {
                    const s = statusConfig[c.status];
                    return (
                      <tr key={c.code} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{c.flag} {c.name}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-blue)' }}>{c.orgs.toLocaleString()}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{c.users.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.currency}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Rechercher une organisation..." className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} />
            <select className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              <option>Tous les types</option>
              <option>Hôpital</option><option>Clinique</option><option>Pharmacie</option><option>Laboratoire</option>
            </select>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#3730A3' }}>+ Nouvelle org.</button>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Organisation', 'Type', 'Pays', 'Plan', 'Utilisateurs', 'Statut', 'Depuis', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {organizations.map(org => {
                    const s = statusConfig[org.status];
                    const p = planConfig[org.plan] || planConfig['Standard'];
                    return (
                      <tr key={org.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{org.name}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{org.type}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{org.country}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: p.bg, color: p.text }}>{org.plan}</span></td>
                        <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-blue)' }}>{org.users}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{org.since}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: 'var(--shifa-blue)' }}>Voir</button>
                            <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>Gérer</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Patients', value: '248 420', icon: 'UserIcon', color: 'var(--shifa-blue)' },
              { label: 'Professionnels', value: '18 420', icon: 'BriefcaseIcon', color: 'var(--shifa-green)' },
              { label: 'Admins org.', value: '4 280', icon: 'BuildingOffice2Icon', color: 'var(--shifa-cyan)' },
              { label: 'Ambassadeurs', value: '342', icon: 'StarIcon', color: 'var(--shifa-amber)' },
            ].map(u => (
              <div key={u.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${u.color}18` }}>
                    <Icon name={u.icon as any} size={18} style={{ color: u.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{u.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <input type="text" placeholder="Rechercher un utilisateur..." className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} />
              <select className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                <option>Tous les rôles</option>
                <option>Patient</option><option>Professionnel</option><option>Admin</option><option>Ambassadeur</option>
              </select>
            </div>
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted-foreground)' }}>Recherchez un utilisateur pour afficher ses informations. Les données cliniques ne sont pas accessibles depuis cet espace.</p>
          </div>
        </div>
      )}

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Catalogue des modules SHIFA</h3>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#3730A3' }}>+ Nouveau module</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Module', 'Catégorie', 'Version', 'Organisations actives', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => {
                  const s = statusConfig[mod.status];
                  return (
                    <tr key={mod.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{mod.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{mod.category}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{mod.version}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-blue)' }}>{mod.orgs.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: 'var(--shifa-blue)' }}>Configurer</button>
                          <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>Déployer</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { plan: 'Standard', price: '€ 49/mois', orgs: 620, color: 'var(--shifa-green)', features: ["Jusqu'à 20 utilisateurs", 'Modules de base', 'Support email'] },
              { plan: 'Pro', price: '€ 149/mois', orgs: 480, color: 'var(--shifa-blue)', features: ["Jusqu'à 100 utilisateurs", 'Modules avancés', 'Support prioritaire', 'API access'] },
              { plan: 'Enterprise', price: 'Sur devis', orgs: 184, color: '#7C3AED', features: ['Utilisateurs illimités', 'Tous les modules', 'Support dédié', 'SLA garanti', 'Déploiement personnalisé'] },
            ].map(plan => (
              <div key={plan.plan} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold" style={{ color: plan.color }}>{plan.plan}</h3>
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{plan.price}</span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>{plan.orgs}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>organisations actives</p>
                <ul className="space-y-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="CheckIcon" size={12} style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ambassadors Tab */}
      {activeTab === 'ambassadors' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Réseau d'ambassadeurs ({ambassadors.length} actifs)</h3>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#3730A3' }}>+ Inviter ambassadeur</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Ambassadeur', 'Pays', 'Niveau', 'Parrainages', 'Activations', 'Taux', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ambassadors.map(amb => {
                  const s = statusConfig[amb.status];
                  const rate = Math.round((amb.activations / amb.referrals) * 100);
                  return (
                    <tr key={amb.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>{amb.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{amb.country}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: amb.level === 'Platine' ? 'rgba(139,92,246,0.1)' : amb.level === 'Or' ? 'rgba(245,158,11,0.1)' : 'rgba(156,163,175,0.2)', color: amb.level === 'Platine' ? '#7C3AED' : amb.level === 'Or' ? '#D97706' : '#6B7280' }}>
                          {amb.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-blue)' }}>{amb.referrals}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-green)' }}>{amb.activations}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${rate}%`, backgroundColor: 'var(--shifa-green)' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: 'var(--shifa-green)' }}>{rate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security & Audit Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Tentatives échouées (24h)', value: '3', icon: 'ExclamationTriangleIcon', color: '#EF4444' },
              { label: 'Sessions actives', value: '1 284', icon: 'UserGroupIcon', color: 'var(--shifa-green)' },
              { label: 'Alertes sécurité', value: '1', icon: 'ShieldExclamationIcon', color: 'var(--shifa-amber)' },
              { label: 'Dernière sauvegarde', value: 'Il y a 2h', icon: 'CircleStackIcon', color: 'var(--shifa-blue)' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}18` }}>
                    <Icon name={item.icon as any} size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>{item.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Journal d'audit récent</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Action', 'Acteur', 'Cible', 'Horodatage', 'Niveau'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => {
                    const s = statusConfig[log.level];
                    return (
                      <tr key={log.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{log.action}</td>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.actor}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{log.target}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{log.time}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Route Audit Tab */}
      {activeTab === 'route-audit' && <RouteAuditTab />}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {[
            { section: 'Paramètres globaux', items: ['Nom de la plateforme', 'URL de la plateforme', 'Logo officiel', 'Couleurs de la marque', 'Langue par défaut', 'Fuseau horaire système'] },
            { section: 'Pays & Localisation', items: ['Pays déployés', 'Devises supportées', 'Formats de date', 'Préfixes téléphoniques', "Formats d'adresse"] },
            { section: 'Intégrations', items: ['Fournisseurs de paiement', 'Fournisseurs SMS', 'Fournisseurs email', 'API FHIR', 'Connecteurs HL7', 'Serveurs DICOM'] },
            { section: 'Sécurité', items: ['Politique de mots de passe', 'Authentification 2FA', 'Durée des sessions', 'Règles IP', 'Chiffrement des données'] },
          ].map(group => (
            <div key={group.section} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{group.section}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.items.map(item => (
                  <div key={item} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item}</span>
                    <Icon name="ChevronRightIcon" size={14} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
