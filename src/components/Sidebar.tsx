'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShifaBrand from '@/components/ui/ShifaBrand';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavItem {
  key: string;
  label: string;
  labelKey?: string;
  icon: string;
  href: string;
  badge?: number;
  group?: string;
}

const patientNav: NavItem[] = [
  { key: 'nav-accueil', label: 'Accueil', icon: 'HomeIcon', href: '/patient-home', group: 'principal' },
  { key: 'nav-explorer', label: 'Explorer', icon: 'MagnifyingGlassIcon', href: '/patient-explorer', group: 'principal' },
  { key: 'nav-rdv', label: 'Rendez-vous', icon: 'CalendarDaysIcon', href: '/appointment-booking', badge: 2, group: 'principal' },
  { key: 'nav-sante', label: 'Ma Santé', icon: 'HeartIcon', href: '/dossier-de-sant', group: 'principal' },
  { key: 'nav-messages', label: 'Messages', icon: 'ChatBubbleLeftRightIcon', href: '/patient-messages', badge: 3, group: 'principal' },
  { key: 'nav-community-hub-pat', label: 'Hub Communautaire', icon: 'GlobeAltIcon', href: '/community-hub', group: 'principal' },
  { key: 'nav-documents', label: 'Documents', icon: 'DocumentTextIcon', href: '/patient-documents', group: 'sante' },
  { key: 'nav-consultations', label: 'Consultations', icon: 'ClipboardDocumentListIcon', href: '/patient-consultations', group: 'sante' },
  { key: 'nav-results', label: 'Résultats', icon: 'BeakerIcon', href: '/patient-results', group: 'sante' },
  { key: 'nav-follow-up', label: 'Suivi & Soins', icon: 'ChartBarIcon', href: '/patient-follow-up', group: 'sante' },
  { key: 'nav-vaccination', label: 'Vaccination', icon: 'ShieldCheckIcon', href: '/patient-vaccination', group: 'sante' },
  { key: 'nav-pat-health-programs', label: 'Programmes de santé', icon: 'ShieldCheckIcon', href: '/patient-health-programs', group: 'sante' },
  { key: 'nav-pat-chronic-disease', label: 'Maladies chroniques', icon: 'HeartIcon', href: '/patient-chronic-disease', group: 'sante' },
  { key: 'nav-prevention', label: 'Prévention', icon: 'SparklesIcon', href: '/patient-prevention', group: 'sante' },
  { key: 'nav-urgences', label: 'Urgences', icon: 'ExclamationTriangleIcon', href: '/patient-emergency', group: 'sante' },
  { key: 'nav-urgences-contacts', label: 'Contacts d\'urgence', icon: 'PhoneIcon', href: '/patient-emergency-contacts', group: 'sante' },
  { key: 'nav-map', label: 'Carte de santé', icon: 'MapPinIcon', href: '/patient-map', group: 'sante' },
  { key: 'nav-family', label: 'Famille & Dépendants', icon: 'UsersIcon', href: '/patient-family', group: 'sante' },
  { key: 'nav-maternal-child', label: 'Santé Maternelle & Infantile', icon: 'HeartIcon', href: '/patient-maternal-child', group: 'sante' },
  { key: 'nav-pat-rehabilitation', label: 'Rééducation & Réhabilitation', icon: 'BoltIcon', href: '/patient-rehabilitation', group: 'sante' },
  { key: 'nav-pat-teleconsult', label: 'Mes téléconsultations', icon: 'VideoCameraIcon', href: '/patient-teleconsultation', badge: 1, group: 'teleconsult' },
  { key: 'nav-pat-precall', label: 'Préparer la session', icon: 'HeartIcon', href: '/patient-precall-vitals', group: 'teleconsult' },
  { key: 'nav-pat-ordonnance', label: 'Ordonnances reçues', icon: 'DocumentCheckIcon', href: '/patient-prescription-receipt', group: 'teleconsult' },
  { key: 'nav-carte', label: 'Carte SHIFA', icon: 'CreditCardIcon', href: '/shifa-card', group: 'compte' },
  { key: 'nav-shifa-id', label: 'Mon SHIFA ID', icon: 'IdentificationIcon', href: '/patient-shifa-id', group: 'compte' },
  { key: 'nav-carte-gestion', label: 'Gestion Carte SHIFA', icon: 'IdentificationIcon', href: '/shifa-card-management', group: 'compte' },
  { key: 'nav-wallet', label: 'Portefeuilles', icon: 'BanknotesIcon', href: '/wallet-interface', group: 'compte' },
  { key: 'nav-paiements', label: 'Paiements', icon: 'BanknotesIcon', href: '/patient-payments', group: 'compte' },
  { key: 'nav-subscriptions', label: 'Abonnements', icon: 'StarIcon', href: '/patient-subscriptions', group: 'compte' },
  { key: 'nav-sub-management', label: 'Gestion abonnement', icon: 'Cog6ToothIcon', href: '/subscription-management', group: 'compte' },
  { key: 'nav-checkout', label: 'Souscrire', icon: 'ShoppingCartIcon', href: '/checkout', group: 'compte' },
  { key: 'nav-consent', label: 'Consentements', icon: 'ShieldCheckIcon', href: '/patient-consent', group: 'compte' },
  { key: 'nav-privacy', label: 'Confidentialité', icon: 'LockClosedIcon', href: '/patient-privacy', group: 'compte' },
  { key: 'nav-devices', label: 'Appareils connectés', icon: 'CpuChipIcon', href: '/patient-connected-devices', group: 'compte' },
  { key: 'nav-devices-health', label: 'Santé connectée', icon: 'HeartIcon', href: '/patient-devices-health', group: 'compte' },
  { key: 'nav-shifa-ai-patient', label: 'SHIFA AI', icon: 'CpuChipIcon', href: '/shifa-ai-patient', group: 'compte' },
  { key: 'nav-notifications', label: 'Notifications', icon: 'BellIcon', href: '/patient-notifications', badge: 3, group: 'compte' },
  { key: 'nav-parametres', label: 'Paramètres', icon: 'Cog6ToothIcon', href: '/patient-settings', group: 'compte' },
];

const professionalNav: NavItem[] = [
  { key: 'nav-pro-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon', href: '/workspace-professionnel', group: 'principal' },
  { key: 'nav-pro-patients', label: 'Patients', icon: 'UsersIcon', href: '/pro-patients', badge: 5, group: 'principal' },
  { key: 'nav-pro-agenda', label: 'Agenda', icon: 'CalendarDaysIcon', href: '/pro-agenda', group: 'principal' },
  { key: 'nav-pro-consultations', label: 'Consultations', icon: 'ClipboardDocumentListIcon', href: '/consultation-workspace', group: 'principal' },
  { key: 'nav-community-hub-pro', label: 'Hub Communautaire', icon: 'GlobeAltIcon', href: '/community-hub', group: 'principal' },
  { key: 'nav-pro-dossiers', label: 'Dossiers', icon: 'FolderOpenIcon', href: '/dossier-de-sant', group: 'clinique' },
  { key: 'nav-pro-prescriptions', label: 'Prescriptions', icon: 'DocumentCheckIcon', href: '/pro-prescriptions', group: 'clinique' },
  { key: 'nav-pro-resultats', label: 'Résultats', icon: 'BeakerIcon', href: '/pro-resultats', badge: 4, group: 'clinique' },
  { key: 'nav-pro-messages', label: 'Messagerie', icon: 'ChatBubbleLeftRightIcon', href: '/pro-messages', badge: 7, group: 'clinique' },
  { key: 'nav-pro-monitoring', label: 'Suivi post-consultation', icon: 'ChartBarIcon', href: '/pro-patient-monitoring', group: 'clinique' },
  { key: 'nav-pro-care-plans', label: 'Plans de soins', icon: 'ClipboardDocumentListIcon', href: '/pro-care-plans', group: 'clinique' },
  { key: 'nav-pro-care-coordination', label: 'Coordination des soins', icon: 'UsersIcon', href: '/pro-care-coordination', group: 'clinique' },
  { key: 'nav-pro-patient-transfer', label: 'Transfert patient', icon: 'ArrowsRightLeftIcon', href: '/patient-transfer', group: 'clinique' },
  { key: 'nav-pro-teleconsult-lobby', label: 'Lobby Téléconsult.', icon: 'VideoCameraIcon', href: '/teleconsultation-lobby', group: 'teleconsultation' },
  { key: 'nav-pro-teleconsult-waiting', label: "Salle d'attente", icon: 'UsersIcon', href: '/teleconsultation-waiting', badge: 2, group: 'teleconsultation' },
  { key: 'nav-pro-teleconsult-session', label: 'Session en cours', icon: 'PhoneIcon', href: '/teleconsultation-session', group: 'teleconsultation' },
  { key: 'nav-pro-teleconsult-history', label: 'Historique', icon: 'ClipboardDocumentListIcon', href: '/teleconsultation-history', group: 'teleconsultation' },
  { key: 'nav-pro-teleconsultation', label: 'Téléconsultation Pro', icon: 'VideoCameraIcon', href: '/pro-teleconsultation', group: 'teleconsultation' },
  { key: 'nav-pro-lab', label: 'Laboratoire', icon: 'BeakerIcon', href: '/lab-dashboard', group: 'specialites' },
  { key: 'nav-pro-lab-lms', label: 'Laboratoire LMS', icon: 'CpuChipIcon', href: '/laboratory-lms', group: 'specialites' },
  { key: 'nav-pro-pharmacy', label: 'Pharmacie', icon: 'ArchiveBoxIcon', href: '/pharmacy-dashboard', group: 'specialites' },
  { key: 'nav-pro-shifa-ai-pharmacy', label: 'SHIFA AI Pharmacie', icon: 'BeakerIcon', href: '/shifa-ai-pharmacy', group: 'specialites' },
  { key: 'nav-pro-imaging', label: 'Imagerie', icon: 'PhotoIcon', href: '/imaging-dashboard', group: 'specialites' },
  { key: 'nav-pro-imaging-lms', label: 'Imagerie LMS', icon: 'MagnifyingGlassCircleIcon', href: '/imaging-lms', group: 'specialites' },
  { key: 'nav-pro-emergency', label: 'Urgences', icon: 'BoltIcon', href: '/emergency-dashboard', group: 'specialites' },
  { key: 'nav-pro-emergency-full', label: 'Urgences (Complet)', icon: 'ExclamationTriangleIcon', href: '/emergency', group: 'specialites' },
  { key: 'nav-pro-maternity', label: 'Maternité', icon: 'HeartIcon', href: '/maternity-workspace', group: 'specialites' },
  { key: 'nav-pro-maternity-full', label: 'Maternité (Complet)', icon: 'HeartIcon', href: '/maternity', group: 'specialites' },
  { key: 'nav-pro-pediatrics', label: 'Pédiatrie', icon: 'StarIcon', href: '/pediatrics-workspace', group: 'specialites' },
  { key: 'nav-pro-pediatrics-full', label: 'Pédiatrie (Complet)', icon: 'StarIcon', href: '/pediatrics', group: 'specialites' },
  { key: 'nav-pro-blood-bank', label: 'Banque de Sang', icon: 'BeakerIcon', href: '/blood-bank', group: 'specialites' },
  { key: 'nav-pro-ambulance', label: 'Ambulances & Transport', icon: 'TruckIcon', href: '/ambulance-transport', group: 'specialites' },
  { key: 'nav-pro-operating-room', label: 'Bloc Opératoire', icon: 'ScissorsIcon', href: '/operating-room', group: 'specialites' },
  { key: 'nav-pro-nutrition', label: 'Nutrition & Diététique', icon: 'HeartIcon', href: '/nutrition-dietetics', group: 'specialites' },
  { key: 'nav-pro-physiotherapy', label: 'Kinésithérapie & Rééducation', icon: 'BoltIcon', href: '/physiotherapy', group: 'specialites' },
  { key: 'nav-pro-social-work', label: 'Travail Social', icon: 'UsersIcon', href: '/social-work', group: 'specialites' },
  { key: 'nav-pro-palliative-care', label: 'Soins Palliatifs', icon: 'HeartIcon', href: '/palliative-care', group: 'specialites' },
  { key: 'nav-pro-pharmacy-pos', label: 'Pharmacie — Caisse', icon: 'ShoppingCartIcon', href: '/pharmacy-pos', group: 'specialites' },
  { key: 'nav-pro-occupational-therapy', label: 'Ergothérapie', icon: 'HandRaisedIcon', href: '/occupational-therapy', group: 'specialites' },
  { key: 'nav-pro-speech-therapy', label: 'Orthophonie', icon: 'ChatBubbleLeftRightIcon', href: '/speech-therapy', group: 'specialites' },
  { key: 'nav-pro-psychology', label: 'Psychologie & Santé Mentale', icon: 'HeartIcon', href: '/psychology-mental-health', group: 'specialites' },
  { key: 'nav-pro-dental-care', label: 'Soins Dentaires', icon: 'SparklesIcon', href: '/dental-care', group: 'specialites' },
  { key: 'nav-pro-ophthalmology', label: 'Ophtalmologie', icon: 'EyeIcon', href: '/ophthalmology', group: 'specialites' },
  { key: 'nav-pro-dermatology', label: 'Dermatologie', icon: 'SunIcon', href: '/dermatology', group: 'specialites' },
  { key: 'nav-pro-shifa-ai', label: 'SHIFA AI', icon: 'CpuChipIcon', href: '/shifa-ai-workspace', group: 'outils' },
  { key: 'nav-pro-academy-dashboard', label: 'Mon espace Academy', icon: 'AcademicCapIcon', href: '/academy-dashboard', group: 'outils' },
  { key: 'nav-pro-academy', label: 'Académie', icon: 'AcademicCapIcon', href: '/shifa-academy', group: 'outils' },
  { key: 'nav-pro-marketplace', label: 'Marketplace', icon: 'ShoppingBagIcon', href: '/health-marketplace', group: 'outils' },
  { key: 'nav-pro-notifications', label: 'Notifications', icon: 'BellIcon', href: '/notifications-center', badge: 3, group: 'outils' },
  { key: 'nav-pro-support', label: 'Support & Aide', icon: 'LifebuoyIcon', href: '/support-center', group: 'outils' },
  { key: 'nav-pro-interop', label: 'Interopérabilité', icon: 'ArrowsRightLeftIcon', href: '/interoperability-hub', group: 'outils' },
  { key: 'nav-pro-referrals', label: 'Adressages & Certificats', icon: 'ArrowsRightLeftIcon', href: '/pro-referrals', group: 'outils' },
  { key: 'nav-pro-referrals-network', label: 'Réseau d\'adressage complet', icon: 'UsersIcon', href: '/pro-referrals-network', group: 'outils' },
  { key: 'nav-pro-clinical-protocols', label: 'Protocoles cliniques', icon: 'BookOpenIcon', href: '/pro-clinical-protocols', group: 'outils' },
  { key: 'nav-pro-certificates', label: 'Certificats médicaux', icon: 'DocumentTextIcon', href: '/medical-certificates', group: 'outils' },
  { key: 'nav-pro-documents', label: 'Documents', icon: 'FolderOpenIcon', href: '/pro-documents', group: 'outils' },
  { key: 'nav-pro-shifa-ai-pro', label: 'SHIFA AI Clinical', icon: 'CpuChipIcon', href: '/shifa-ai-pro', group: 'outils' },
  { key: 'nav-pro-profile', label: 'Mon profil professionnel', icon: 'UserCircleIcon', href: '/pro-profile', group: 'compte' },
  { key: 'nav-pro-billing', label: 'Facturation & Revenus', icon: 'BanknotesIcon', href: '/pro-billing', group: 'compte' },
  { key: 'nav-pro-pricing', label: 'Plans & Tarifs', icon: 'CreditCardIcon', href: '/pro-pricing', group: 'compte' },
  { key: 'nav-pro-sub-management', label: 'Mon abonnement', icon: 'StarIcon', href: '/subscription-management', group: 'compte' },
  { key: 'nav-pro-checkout', label: 'Souscrire', icon: 'ShoppingCartIcon', href: '/checkout', group: 'compte' },
  { key: 'nav-pro-agenda-availability', label: 'Disponibilités & Horaires', icon: 'CalendarDaysIcon', href: '/pro-agenda-availability', group: 'compte' },
  { key: 'nav-pro-schedule-templates', label: 'Modèles de planning', icon: 'CalendarDaysIcon', href: '/pro-schedule-templates', group: 'compte' },
  { key: 'nav-pro-parametres', label: 'Paramètres', icon: 'Cog6ToothIcon', href: '/pro-parametres', group: 'compte' },
];

const adminNav: NavItem[] = [
  { key: 'nav-adm-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon', href: '/administration-tablissement', group: 'principal' },
  { key: 'nav-adm-hopital', label: 'Tableau de bord Hôpital', icon: 'BuildingOffice2Icon', href: '/hopital-dashboard', group: 'principal' },
  { key: 'nav-adm-hopital-config', label: 'Configuration Hôpital', icon: 'AdjustmentsHorizontalIcon', href: '/hopital-configuration', group: 'principal' },
  { key: 'nav-adm-admissions', label: 'Admissions', icon: 'UserPlusIcon', href: '/hopital-admissions', group: 'principal' },
  { key: 'nav-adm-hopital-dpi', label: 'DPI Hospitalier', icon: 'ClipboardDocumentListIcon', href: '/hopital-dpi', group: 'principal' },
  { key: 'nav-adm-patient-flow', label: 'Flux Patients & Lits', icon: 'HomeIcon', href: '/org-patient-flow', group: 'principal' },
  { key: 'nav-adm-hospitalization', label: 'Hospitalisation', icon: 'BuildingOffice2Icon', href: '/hospitalization', group: 'principal' },
  { key: 'nav-adm-billing', label: 'Facturation', icon: 'BanknotesIcon', href: '/billing-dashboard', group: 'principal' },
  { key: 'nav-adm-community-hub', label: 'Hub Communautaire', icon: 'GlobeAltIcon', href: '/community-hub', group: 'principal' },
  { key: 'nav-adm-biomedical', label: 'Équipements biomédicaux', icon: 'CpuChipIcon', href: '/biomedical-equipment', group: 'gestion' },
  { key: 'nav-adm-biomedical-maintenance', label: 'Maintenance biomédicale', icon: 'WrenchScrewdriverIcon', href: '/biomedical-maintenance', group: 'gestion' },
  { key: 'nav-adm-org-biomedical-maintenance', label: 'Maintenance biomédicale complète', icon: 'CpuChipIcon', href: '/org-biomedical-maintenance', group: 'gestion' },
  { key: 'nav-adm-quality', label: 'Qualité & Accréditation', icon: 'ShieldCheckIcon', href: '/quality-accreditation', group: 'gestion' },
  { key: 'nav-adm-org-quality', label: 'Qualité Organisation', icon: 'StarIcon', href: '/org-quality', group: 'gestion' },
  { key: 'nav-adm-interop', label: 'Interopérabilité', icon: 'ArrowsRightLeftIcon', href: '/interoperability-hub', group: 'gestion' },
  { key: 'nav-adm-inventory', label: 'Inventaire & Approvisionnement', icon: 'ArchiveBoxIcon', href: '/inventory-procurement', group: 'gestion' },
  { key: 'nav-adm-supply-chain', label: 'Chaîne d\'approvisionnement', icon: 'TruckIcon', href: '/supply-chain', group: 'gestion' },
  { key: 'nav-adm-org-supply-chain', label: 'Approvisionnement complet', icon: 'ArchiveBoxIcon', href: '/org-supply-chain', group: 'gestion' },
  { key: 'nav-adm-finance', label: 'Finance', icon: 'ChartBarIcon', href: '/finance-dashboard', group: 'gestion' },
  { key: 'nav-adm-hr', label: 'Ressources Humaines', icon: 'UsersIcon', href: '/hr-module', group: 'gestion' },
  { key: 'nav-adm-org-hr-payroll', label: 'Paie & RH', icon: 'BanknotesIcon', href: '/org-hr-payroll', group: 'gestion' },
  { key: 'nav-adm-hr-planning', label: 'Planification RH & Congés', icon: 'CalendarDaysIcon', href: '/org-hr-planning', group: 'gestion' },
  { key: 'nav-adm-kiosk', label: 'SHIFA Kiosk', icon: 'ComputerDesktopIcon', href: '/shifa-kiosk', group: 'gestion' },
  { key: 'nav-adm-display', label: 'SHIFA Display', icon: 'TvIcon', href: '/shifa-display', group: 'gestion' },
  { key: 'nav-adm-pro-verif', label: 'Vérification professionnels', icon: 'ShieldCheckIcon', href: '/pro-verification', group: 'gestion' },
  { key: 'nav-adm-sterilization', label: 'Stérilisation Centrale', icon: 'ShieldCheckIcon', href: '/sterilization', group: 'gestion' },
  { key: 'nav-adm-sterilization-central', label: 'Stérilisation Centrale complète', icon: 'ArrowPathIcon', href: '/org-sterilization-central', group: 'gestion' },
  { key: 'nav-adm-infection-control', label: 'Hygiène & Infections (CLIN)', icon: 'ShieldCheckIcon', href: '/org-infection-control', group: 'gestion' },
  { key: 'nav-adm-capacity-planning', label: 'Planification capacitaire', icon: 'ChartBarSquareIcon', href: '/org-capacity-planning', group: 'analyse' },
  { key: 'nav-adm-accounting-ledger', label: 'Comptabilité générale', icon: 'CalculatorIcon', href: '/accounting-ledger', group: 'gestion' },
  { key: 'nav-adm-module-catalog', label: 'Catalogue modules', icon: 'PuzzlePieceIcon', href: '/module-catalog', group: 'gestion' },
  { key: 'nav-adm-professionnels', label: 'Professionnels', icon: 'UserGroupIcon', href: '/admin-professionnels', badge: 3, group: 'gestion' },
  { key: 'nav-adm-utilisateurs', label: 'Utilisateurs', icon: 'UsersIcon', href: '/admin-utilisateurs', group: 'gestion' },
  { key: 'nav-adm-modules', label: 'Modules', icon: 'PuzzlePieceIcon', href: '/admin-modules', group: 'gestion' },
  { key: 'nav-adm-roles', label: 'Rôles & Droits', icon: 'ShieldCheckIcon', href: '/admin-roles', group: 'gestion' },
  { key: 'nav-adm-org-finance', label: 'Finance Organisation', icon: 'BanknotesIcon', href: '/org-finance-dashboard', group: 'analyse' },
  { key: 'nav-adm-org-analytics', label: 'Analytics Organisation', icon: 'ChartBarSquareIcon', href: '/org-analytics', group: 'analyse' },
  { key: 'nav-adm-org-reporting', label: 'Rapports & Exports', icon: 'DocumentChartBarIcon', href: '/org-reporting', group: 'analyse' },
  { key: 'nav-adm-shifa-ai-org', label: 'SHIFA AI Organisation', icon: 'CpuChipIcon', href: '/shifa-ai-org', group: 'analyse' },
  { key: 'nav-adm-marketplace-vendor', label: 'Espace Vendeur', icon: 'BuildingStorefrontIcon', href: '/marketplace-vendor', group: 'analyse' },
  { key: 'nav-adm-marketplace-buyer', label: 'Marketplace Acheteur', icon: 'ShoppingBagIcon', href: '/marketplace-buyer', group: 'analyse' },
  { key: 'nav-adm-activite', label: 'Activité', icon: 'ChartBarIcon', href: '/admin-activite', group: 'analyse' },
  { key: 'nav-adm-audit', label: 'Audit', icon: 'ClipboardDocumentCheckIcon', href: '/admin-audit', group: 'analyse' },
  { key: 'nav-adm-onboarding', label: 'Config. initiale', icon: 'AdjustmentsHorizontalIcon', href: '/org-onboarding', group: 'compte' },
  { key: 'nav-adm-staff-directory', label: 'Annuaire du personnel', icon: 'UsersIcon', href: '/org-staff-directory', group: 'compte' },
  { key: 'nav-adm-org-documents', label: 'Gestion documentaire', icon: 'FolderOpenIcon', href: '/org-documents', group: 'compte' },
  { key: 'nav-adm-parametres', label: 'Paramètres', icon: 'Cog6ToothIcon', href: '/admin-parametres', group: 'compte' },
];

const institutionNav: NavItem[] = [
  { key: 'nav-inst-ministere', label: 'Ministère de la Santé', icon: 'BuildingLibraryIcon', href: '/espace-ministere', group: 'espaces' },
  { key: 'nav-inst-assurance', label: 'Assurance / Mutuelle', icon: 'ShieldCheckIcon', href: '/espace-assurance', group: 'espaces' },
  { key: 'nav-inst-universite', label: 'Université / École', icon: 'AcademicCapIcon', href: '/espace-universite', group: 'espaces' },
  { key: 'nav-inst-ong', label: 'ONG / Humanitaire', icon: 'HeartIcon', href: '/espace-ong', group: 'espaces' },
  { key: 'nav-inst-sante-pub', label: 'Santé Publique', icon: 'ChartBarIcon', href: '/espace-sante-publique', group: 'espaces' },
  { key: 'nav-inst-community-hub', label: 'Hub Communautaire', icon: 'GlobeAltIcon', href: '/community-hub', group: 'espaces' },
  { key: 'nav-inst-shifa-ai-institution', label: 'SHIFA AI Institution', icon: 'CpuChipIcon', href: '/shifa-ai-institution', group: 'workspaces' },
  { key: 'nav-inst-shifa-ai-research', label: 'SHIFA AI Recherche', icon: 'BeakerIcon', href: '/shifa-ai-research', group: 'workspaces' },
  { key: 'nav-inst-research-datasets', label: 'Jeux de données recherche', icon: 'CircleStackIcon', href: '/research-datasets', group: 'workspaces' },
  { key: 'nav-inst-ethics-board', label: 'Comité d\'éthique', icon: 'ClipboardDocumentCheckIcon', href: '/research-ethics-board', group: 'workspaces' },
  { key: 'nav-inst-research', label: 'Organisation de Recherche', icon: 'BeakerIcon', href: '/research-workspace', group: 'espaces' },
  { key: 'nav-inst-epidemio', label: 'Surveillance Épidémio.', icon: 'EyeIcon', href: '/epidemio-surveillance', group: 'workspaces' },
  { key: 'nav-inst-ministere-oversight', label: 'Supervision Nationale', icon: 'BuildingLibraryIcon', href: '/ministere-oversight', group: 'workspaces' },
  { key: 'nav-inst-assurance-workspace', label: 'Espace Assureur', icon: 'IdentificationIcon', href: '/assurance-workspace', group: 'workspaces' },
  { key: 'nav-inst-admin', label: 'Administration', icon: 'Squares2X2Icon', href: '/administration-tablissement', group: 'gestion' },
  { key: 'nav-inst-onboarding', label: 'Config. initiale', icon: 'AdjustmentsHorizontalIcon', href: '/org-onboarding', group: 'gestion' },
  { key: 'nav-inst-parametres', label: 'Paramètres', icon: 'Cog6ToothIcon', href: '/admin-parametres', group: 'gestion' },
];

const ambassadorNav: NavItem[] = [
  { key: 'nav-amb-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon', href: '/ambassador-workspace', group: 'principal' },
  { key: 'nav-amb-network', label: 'Mon Réseau', icon: 'UsersIcon', href: '/ambassador-workspace', group: 'principal' },
  { key: 'nav-amb-commercial', label: 'Commercial & Revenus', icon: 'BanknotesIcon', href: '/ambassador-commercial', group: 'activite' },
  { key: 'nav-amb-invitations', label: 'Invitations', icon: 'EnvelopeIcon', href: '/ambassador-workspace', group: 'activite' },
  { key: 'nav-amb-rewards', label: 'Récompenses', icon: 'TrophyIcon', href: '/ambassador-workspace', group: 'activite' },
  { key: 'nav-amb-training', label: 'Formation', icon: 'AcademicCapIcon', href: '/ambassador-workspace', group: 'ressources' },
  { key: 'nav-amb-resources', label: 'Kit Marketing', icon: 'SparklesIcon', href: '/ambassador-workspace', group: 'ressources' },
  { key: 'nav-amb-support', label: 'Support', icon: 'LifebuoyIcon', href: '/support-center', group: 'ressources' },
];

const platformAdminNav: NavItem[] = [
  { key: 'nav-pa-dashboard', label: 'Tableau de bord global', icon: 'Squares2X2Icon', href: '/platform-admin', group: 'principal' },
  { key: 'nav-pa-orgs', label: 'Organisations', icon: 'BuildingOffice2Icon', href: '/platform-admin', group: 'gestion' },
  { key: 'nav-pa-users', label: 'Utilisateurs', icon: 'UsersIcon', href: '/platform-admin', group: 'gestion' },
  { key: 'nav-pa-modules', label: 'Catalogue modules', icon: 'PuzzlePieceIcon', href: '/module-catalog', group: 'gestion' },
  { key: 'nav-pa-country-modules', label: 'Modules par pays', icon: 'GlobeAltIcon', href: '/settings/country-module-config', group: 'gestion' },
  { key: 'nav-pa-subscriptions', label: 'Abonnements', icon: 'CreditCardIcon', href: '/platform-admin', group: 'gestion' },
  { key: 'nav-pa-ambassadors', label: 'Ambassadeurs', icon: 'StarIcon', href: '/platform-admin', group: 'gestion' },
  { key: 'nav-pa-translations', label: 'Traductions i18n', icon: 'LanguageIcon', href: '/admin-translations', group: 'gestion' },
  { key: 'nav-pa-pricing', label: 'Tarification globale', icon: 'BanknotesIcon', href: '/pricing', group: 'commercial' },
  { key: 'nav-pa-pricing-plans', label: 'Comparaison plans', icon: 'TableCellsIcon', href: '/pricing-plans', group: 'commercial' },
  { key: 'nav-pa-pro-pricing', label: 'Plans Professionnels', icon: 'UserGroupIcon', href: '/pro-pricing', group: 'commercial' },
  { key: 'nav-pa-org-pricing', label: 'Plans Organisation', icon: 'BuildingOffice2Icon', href: '/org-pricing', group: 'commercial' },
  { key: 'nav-pa-sub-mgmt', label: 'Gestion abonnements', icon: 'Cog6ToothIcon', href: '/subscription-management', group: 'commercial' },
  { key: 'nav-pa-checkout', label: 'Checkout', icon: 'ShoppingCartIcon', href: '/checkout', group: 'commercial' },
  { key: 'nav-pa-ambassador-commercial', label: 'Ambassadeur Commercial', icon: 'TrophyIcon', href: '/ambassador-commercial', group: 'commercial' },
  { key: 'nav-pa-marketplace-commercial', label: 'Marketplace Commercial', icon: 'BuildingStorefrontIcon', href: '/marketplace-commercial', group: 'commercial' },
  { key: 'nav-pa-academy-pricing', label: 'Academy Tarification', icon: 'AcademicCapIcon', href: '/academy-pricing', group: 'commercial' },
  { key: 'nav-pa-enterprise-contact', label: 'Enterprise & B2G', icon: 'BuildingLibraryIcon', href: '/enterprise-contact', group: 'commercial' },
  { key: 'nav-pa-platform-revenue', label: 'Revenus Plateforme', icon: 'ChartBarIcon', href: '/platform-revenue', group: 'commercial' },
  { key: 'nav-pa-ai-pricing', label: 'SHIFA AI Tarification', icon: 'CpuChipIcon', href: '/ai-pricing', group: 'commercial' },
  { key: 'nav-pa-card-economy', label: 'Économie Carte Physique', icon: 'CreditCardIcon', href: '/card-economy', group: 'commercial' },
  { key: 'nav-pa-teleconsult-commercial', label: 'Téléconsult. Commercial', icon: 'VideoCameraIcon', href: '/teleconsultation-commercial', group: 'commercial' },
  { key: 'nav-pa-insurance-commercial', label: 'Assurance Commercial', icon: 'ShieldCheckIcon', href: '/insurance-commercial', group: 'commercial' },
  { key: 'nav-pa-api-monetization', label: 'API & Interopérabilité', icon: 'ArrowsRightLeftIcon', href: '/api-monetization', group: 'commercial' },
  { key: 'nav-pa-tax-config', label: 'Configuration Fiscale', icon: 'DocumentTextIcon', href: '/tax-configuration', group: 'commercial' },
  { key: 'nav-pa-pricing-engine', label: 'Moteur de Tarification', icon: 'Cog6ToothIcon', href: '/pricing-engine', group: 'commercial' },
  { key: 'nav-pa-admin-financial', label: 'Dashboard Financier Admin', icon: 'ChartBarSquareIcon', href: '/admin-financial-dashboard', group: 'commercial' },
  { key: 'nav-pa-api-developer', label: 'Portail Développeur', icon: 'CodeBracketIcon', href: '/api-developer-dashboard', group: 'systeme' },
  { key: 'nav-pa-platform-compliance', label: 'Conformité & Réglementation', icon: 'ShieldCheckIcon', href: '/platform-compliance', group: 'systeme' },
  { key: 'nav-pa-platform-monitoring', label: 'Monitoring Plateforme', icon: 'ChartBarIcon', href: '/platform-monitoring', group: 'systeme' },
  { key: 'nav-pa-phase2-roadmap', label: 'Roadmap Phase 2', icon: 'MapIcon', href: '/phase2-roadmap', group: 'systeme' },
  { key: 'nav-pa-shifa-desktop', label: 'SHIFA Desktop', icon: 'ComputerDesktopIcon', href: '/shifa-desktop', group: 'systeme' },
  { key: 'nav-pa-phase1-audit', label: 'Audit Phase 1', icon: 'ClipboardDocumentCheckIcon', href: '/phase1-completion-audit', group: 'systeme' },
  { key: 'nav-pa-security', label: 'Sécurité & Audit', icon: 'ShieldCheckIcon', href: '/platform-admin', group: 'systeme' },
  { key: 'nav-pa-ai', label: 'SHIFA AI', icon: 'CpuChipIcon', href: '/shifa-ai-workspace', group: 'systeme' },
  { key: 'nav-pa-interop', label: 'Interopérabilité', icon: 'ArrowsRightLeftIcon', href: '/interoperability-hub', group: 'systeme' },
  { key: 'nav-pa-external-connectors', label: 'Connecteurs externes', icon: 'PuzzlePieceIcon', href: '/external-connectors', group: 'systeme' },
  { key: 'nav-pa-offline-mode', label: 'Mode Offline & Débit', icon: 'WifiIcon', href: '/offline-mode-config', group: 'systeme' },
  { key: 'nav-pa-local-health', label: 'Services de santé locaux', icon: 'GlobeAltIcon', href: '/local-health-services', group: 'systeme' },
  { key: 'nav-pa-settings', label: 'Paramètres système', icon: 'Cog6ToothIcon', href: '/platform-admin', group: 'systeme' },
  { key: 'nav-pa-support', label: 'Support', icon: 'LifebuoyIcon', href: '/support-center', group: 'systeme' },
];

const navByRole = { patient: patientNav, professional: professionalNav, admin: adminNav, institution: institutionNav, ambassador: ambassadorNav, platform_admin: platformAdminNav };

const groupLabels: Record<string, string> = {
  principal: 'Principal',
  sante: 'Santé & Dossiers',
  teleconsult: 'Téléconsultation',
  clinique: 'Clinique',
  teleconsultation: 'Téléconsultation',
  specialites: 'Espaces Spécialisés',
  outils: 'Outils & Services',
  gestion: 'Gestion',
  analyse: 'Analyse',
  compte: 'Compte',
  espaces: 'Espaces institutionnels',
  workspaces: 'Espaces de travail',
  activite: 'Activité',
  ressources: 'Ressources',
  systeme: 'Système',
  commercial: 'Commercial & Tarification',
};

const userInfoByRole = {
  patient: { name: 'Aïcha Diallo', sub: 'SH-2-SN-2025-7K4D', avatar: 'AD' },
  professional: { name: 'Dr. Mohamed Sy', sub: 'Médecin généraliste', avatar: 'MS' },
  admin: { name: 'Admin — CHU Saint-Louis', sub: 'Administrateur', avatar: 'AS' },
  institution: { name: 'Espace Institutionnel', sub: 'Accès multi-organisations', avatar: 'EI' },
  ambassador: { name: 'Karim Diallo', sub: 'Ambassadeur SHIFA — Niveau Or', avatar: 'KD' },
  platform_admin: { name: 'Super Admin SHIFA', sub: 'Administration Plateforme', avatar: 'SA' },
};

// ─── Phase 1 Module Catalog ───────────────────────────────────────────────────
interface CatalogModule {
  name: string;
  icon: string;
  status: 'available' | 'beta' | 'coming_soon';
  href?: string;
}

const phase1Modules: CatalogModule[] = [
  { name: 'Santé Publique', icon: 'ChartBarIcon', status: 'available', href: '/espace-sante-publique' },
  { name: 'Ministère', icon: 'BuildingLibraryIcon', status: 'available', href: '/espace-ministere' },
  { name: 'Assurance', icon: 'ShieldCheckIcon', status: 'available', href: '/espace-assurance' },
  { name: 'Université', icon: 'AcademicCapIcon', status: 'available', href: '/espace-universite' },
  { name: 'ONG', icon: 'HeartIcon', status: 'available', href: '/espace-ong' },
  { name: 'IA Médicale', icon: 'CpuChipIcon', status: 'available', href: '/shifa-ai-workspace' },
  { name: 'Académie', icon: 'BookOpenIcon', status: 'available', href: '/shifa-academy' },
  { name: 'Marketplace', icon: 'ShoppingBagIcon', status: 'available', href: '/health-marketplace' },
  { name: 'Notifications', icon: 'BellIcon', status: 'available', href: '/notifications-center' },
  { name: 'Support', icon: 'LifebuoyIcon', status: 'available', href: '/support-center' },
  { name: 'Interopérabilité', icon: 'ArrowsRightLeftIcon', status: 'available', href: '/interoperability-hub' },
  { name: 'Inventaire', icon: 'ArchiveBoxIcon', status: 'available', href: '/inventory-procurement' },
  { name: 'Finance', icon: 'ChartBarIcon', status: 'available', href: '/finance-dashboard' },
  { name: 'Vérification Pro.', icon: 'ShieldCheckIcon', status: 'available', href: '/pro-verification' },
  { name: 'Adressages', icon: 'ArrowsRightLeftIcon', status: 'available', href: '/referrals-interface' },
  { name: 'Certificats', icon: 'DocumentTextIcon', status: 'available', href: '/medical-certificates' },
  { name: 'Catalogue modules', icon: 'PuzzlePieceIcon', status: 'available', href: '/module-catalog' },
  { name: 'Ambassadeur', icon: 'StarIcon', status: 'available', href: '/ambassador-workspace' },
  { name: 'Admin Plateforme', icon: 'CpuChipIcon', status: 'available', href: '/platform-admin' },
  { name: 'Recherche', icon: 'BeakerIcon', status: 'available', href: '/research-workspace' },
];

const catalogStatusConfig = {
  available: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  beta: { label: 'Bêta', bg: '#fef9c3', text: '#ca8a04' },
  coming_soon: { label: 'Bientôt', bg: '#f1f5f9', text: '#64748b' },
};

function ModuleCatalogSection({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);

  if (collapsed) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <p className="section-label text-left">Catalogue Phase 1</p>
        <Icon name={open ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={14} className="text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5">
          {phase1Modules.map(mod => {
            const s = catalogStatusConfig[mod.status];
            const inner = (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name={mod.icon as any} size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-xs truncate" style={{ color: 'var(--foreground)' }}>{mod.name}</span>
                </div>
                <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-1" style={{ backgroundColor: s.bg, color: s.text, fontSize: '10px' }}>{s.label}</span>
              </div>
            );
            return mod.href ? (
              <Link key={mod.name} href={mod.href}>{inner}</Link>
            ) : (
              <div key={mod.name}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ role = 'patient', activeRoute = '' }: { role?: 'patient' | 'professional' | 'admin' | 'institution' | 'ambassador' | 'platform_admin'; activeRoute?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const { dir } = useLanguage();
  const navItems = navByRole[role];
  const groups = [...new Set(navItems.map(i => i.group || 'principal'))];
  const userInfo = userInfoByRole[role];

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch {
      setSigningOut(false);
    }
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)', minHeight: '56px' }}>
        <div className="flex items-center flex-1 min-w-0">
          {!collapsed ? (
            <ShifaBrand variant="full" />
          ) : (
            <div className="flex justify-center w-full">
              <ShifaBrand variant="symbol" symbolSize={32} />
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-colors hover:bg-muted ml-2 hidden lg:flex shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} size={16} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 rounded-lg transition-colors hover:bg-muted ml-2 lg:hidden shrink-0"
          aria-label="Close menu"
        >
          <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {groups.map((group) => {
          const items = navItems.filter(i => (i.group || 'principal') === group);
          return (
            <div key={`group-${group}`} className="mb-4">
              {!collapsed && (
                <p className="section-label px-3 mb-1">{groupLabels[group] || group}</p>
              )}
              {items.map((item) => {
                const isActive = activeRoute === item.href || (item.href !== '/patient-home' && activeRoute.startsWith(item.href));
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item mb-0.5 relative ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon name={item.icon as any} size={18} />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && item.badge && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold rounded-full text-white" style={{ backgroundColor: 'var(--shifa-blue)', minWidth: '20px', textAlign: 'center' }}>
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && item.badge > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
        {/* Module Catalog — admin only */}
        {role === 'admin' && <ModuleCatalogSection collapsed={collapsed} />}
      </nav>

      {/* User footer */}
      <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
        {!collapsed && (
          <div className="flex items-center justify-between mb-2">
            <LanguageSelector compact={false} />
          </div>
        )}
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            {userInfo.avatar}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{userInfo.name}</p>
              <p className="text-xs truncate font-mono" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{userInfo.sub}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              title="Déconnexion"
            >
              {signingOut ? (
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="ArrowLeftOnRectangleIcon" size={16} className="text-muted-foreground" />
              )}
            </button>
          )}
          {collapsed && (
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              title="Déconnexion"
            >
              {signingOut ? (
                <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="ArrowLeftOnRectangleIcon" size={14} className="text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl shadow-lg border"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        aria-label="Open menu"
      >
        <Icon name="Bars3Icon" size={20} className="text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        dir={dir}
        className={`lg:hidden fixed top-0 left-0 z-50 h-full flex flex-col border-r transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '260px', backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        dir={dir}
        className="hidden lg:flex flex-col h-full border-r transition-all duration-300 ease-in-out shrink-0"
        style={{
          width: collapsed ? '64px' : '240px',
          backgroundColor: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <NavContent />
      </aside>
    </>
  );
}