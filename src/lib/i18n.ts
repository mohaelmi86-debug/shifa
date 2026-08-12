'use client';

// ─── SHIFA Global i18n Architecture ──────────────────────────────────────────
// Supports: French, English, Spanish, Portuguese, Arabic (RTL), Chinese

export type Language = 'fr' | 'en' | 'es' | 'pt' | 'ar' | 'zh';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; nativeLabel: string; rtl: boolean; flag: string }[] = [
  { code: 'fr', label: 'Français', nativeLabel: 'Français', rtl: false, flag: '🇫🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', rtl: false, flag: '🇬🇧' },
  { code: 'es', label: 'Español', nativeLabel: 'Español', rtl: false, flag: '🇪🇸' },
  { code: 'pt', label: 'Português', nativeLabel: 'Português', rtl: false, flag: '🇧🇷' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', rtl: true, flag: '🇸🇦' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', rtl: false, flag: '🇨🇳' },
];

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}

// ─── Currency System ──────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Record<string, Currency> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2, symbolPosition: 'before' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2, symbolPosition: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2, symbolPosition: 'before' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2, symbolPosition: 'after' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', decimals: 2, symbolPosition: 'after' },
  KMF: { code: 'KMF', symbol: 'CF', name: 'Comorian Franc', decimals: 0, symbolPosition: 'after' },
  MAD: { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', decimals: 2, symbolPosition: 'after' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2, symbolPosition: 'before' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2, symbolPosition: 'before' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2, symbolPosition: 'before' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0, symbolPosition: 'before' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2, symbolPosition: 'before' },
  XOF: { code: 'XOF', symbol: 'FCFA', name: 'West African CFA Franc', decimals: 0, symbolPosition: 'after' },
  XAF: { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc', decimals: 0, symbolPosition: 'after' },
};

// Demo exchange rates (Phase 1 — replaced by live provider in Phase 3)
export const DEMO_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.86,
  AED: 3.97,
  SAR: 4.05,
  KMF: 491.97,
  MAD: 10.82,
  CAD: 1.47,
  CHF: 0.96,
  CNY: 7.82,
  JPY: 163.5,
  BRL: 5.52,
  XOF: 655.96,
  XAF: 655.96,
};

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount} ${currencyCode}`;
  const formatted = amount.toLocaleString('fr-FR', { minimumFractionDigits: currency.decimals, maximumFractionDigits: currency.decimals });
  return currency.symbolPosition === 'before' ? `${currency.symbol}${formatted}` : `${formatted} ${currency.symbol}`;
}

export function convertToEUR(amount: number, fromCurrency: string): number {
  const rate = DEMO_EXCHANGE_RATES[fromCurrency];
  if (!rate) return amount;
  return amount / rate;
}

export function convertToUSD(amount: number, fromCurrency: string): number {
  const eurAmount = convertToEUR(amount, fromCurrency);
  return eurAmount * DEMO_EXCHANGE_RATES['USD'];
}

// ─── Country Catalogue ────────────────────────────────────────────────────────

export interface Country {
  code: string;
  name: string;
  nameEn: string;
  flag: string;
  phonePrefix: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  defaultLanguage: Language;
  addressFormat: 'standard' | 'arabic' | 'cjk' | 'flexible';
}

export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', nameEn: 'France', flag: '🇫🇷', phonePrefix: '+33', currency: 'EUR', timezone: 'Europe/Paris', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'standard' },
  { code: 'GB', name: 'Royaume-Uni', nameEn: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44', currency: 'GBP', timezone: 'Europe/London', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'en', addressFormat: 'standard' },
  { code: 'US', name: 'États-Unis', nameEn: 'United States', flag: '🇺🇸', phonePrefix: '+1', currency: 'USD', timezone: 'America/New_York', dateFormat: 'MM/DD/YYYY', defaultLanguage: 'en', addressFormat: 'standard' },
  { code: 'SA', name: 'Arabie Saoudite', nameEn: 'Saudi Arabia', flag: '🇸🇦', phonePrefix: '+966', currency: 'SAR', timezone: 'Asia/Riyadh', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'ar', addressFormat: 'arabic' },
  { code: 'AE', name: 'Émirats Arabes Unis', nameEn: 'United Arab Emirates', flag: '🇦🇪', phonePrefix: '+971', currency: 'AED', timezone: 'Asia/Dubai', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'ar', addressFormat: 'arabic' },
  { code: 'MA', name: 'Maroc', nameEn: 'Morocco', flag: '🇲🇦', phonePrefix: '+212', currency: 'MAD', timezone: 'Africa/Casablanca', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'ar', addressFormat: 'arabic' },
  { code: 'KM', name: 'Comores', nameEn: 'Comoros', flag: '🇰🇲', phonePrefix: '+269', currency: 'KMF', timezone: 'Indian/Comoro', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'flexible' },
  { code: 'SN', name: 'Sénégal', nameEn: 'Senegal', flag: '🇸🇳', phonePrefix: '+221', currency: 'XOF', timezone: 'Africa/Dakar', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'flexible' },
  { code: 'CI', name: "Côte d'Ivoire", nameEn: "Côte d'Ivoire", flag: '🇨🇮', phonePrefix: '+225', currency: 'XOF', timezone: 'Africa/Abidjan', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'flexible' },
  { code: 'CM', name: 'Cameroun', nameEn: 'Cameroon', flag: '🇨🇲', phonePrefix: '+237', currency: 'XAF', timezone: 'Africa/Douala', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'flexible' },
  { code: 'CN', name: 'Chine', nameEn: 'China', flag: '🇨🇳', phonePrefix: '+86', currency: 'CNY', timezone: 'Asia/Shanghai', dateFormat: 'YYYY/MM/DD', defaultLanguage: 'zh', addressFormat: 'cjk' },
  { code: 'BR', name: 'Brésil', nameEn: 'Brazil', flag: '🇧🇷', phonePrefix: '+55', currency: 'BRL', timezone: 'America/Sao_Paulo', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'pt', addressFormat: 'standard' },
  { code: 'ES', name: 'Espagne', nameEn: 'Spain', flag: '🇪🇸', phonePrefix: '+34', currency: 'EUR', timezone: 'Europe/Madrid', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'es', addressFormat: 'standard' },
  { code: 'CA', name: 'Canada', nameEn: 'Canada', flag: '🇨🇦', phonePrefix: '+1', currency: 'CAD', timezone: 'America/Toronto', dateFormat: 'DD/MM/YYYY', defaultLanguage: 'fr', addressFormat: 'standard' },
  { code: 'CH', name: 'Suisse', nameEn: 'Switzerland', flag: '🇨🇭', phonePrefix: '+41', currency: 'CHF', timezone: 'Europe/Zurich', dateFormat: 'DD.MM.YYYY', defaultLanguage: 'fr', addressFormat: 'standard' },
];

// ─── Translation Strings ──────────────────────────────────────────────────────

export type TranslationKey =
  // Core actions
  | 'dashboard' | 'patients' | 'settings' | 'logout' | 'search' | 'notifications'
  | 'save' | 'cancel' | 'confirm' | 'delete' | 'edit' | 'add' | 'close' | 'back'
  | 'loading' | 'error' | 'success' | 'noData' | 'viewAll' | 'filter' | 'export'
  | 'language' | 'currency' | 'country' | 'timezone' | 'profile' | 'help' | 'support'
  // Actor spaces
  | 'ambassador' | 'research' | 'platformAdmin' | 'organizations' | 'users' | 'modules'
  | 'reports'| 'analytics' | 'security' | 'audit' | 'integrations' | 'subscriptions' |'network'| 'invitations' | 'referrals' | 'rewards' | 'training' | 'resources' |'projects' | 'studies' | 'datasets' | 'participants' | 'ethics' | 'dataAccess'
  // Navigation labels
  | 'home' | 'explore' | 'appointments' | 'healthRecord' | 'messages' | 'documents'
  | 'consultations'| 'results' | 'followUp' | 'vaccination' | 'prevention' | 'emergency' |'teleconsultation' | 'card' | 'wallet' | 'payments' | 'consent' | 'devices'
  | 'agenda' | 'prescriptions' | 'carePlans' | 'certificates' | 'referralsNav'
  | 'billing'| 'finance' | 'inventory' | 'quality' | 'biomedical' | 'interoperability' |'laboratory'| 'pharmacy' | 'imaging' | 'emergencyDept' | 'maternity' | 'pediatrics' |'academy' | 'marketplace' | 'aiAssistant' | 'communityHub'
  // Buttons
  | 'btnBook' | 'btnStartConsult' | 'btnSendMessage' | 'btnDownload' | 'btnUpload' |'btnNewInvoice'| 'btnPay' | 'btnRefund' | 'btnApprove' | 'btnReject' | 'btnSubmit' |'btnConnect'| 'btnDisconnect' | 'btnActivate' | 'btnDeactivate' | 'btnRenew' |'btnInvite' | 'btnShare' | 'btnPrint' | 'btnGenerate' | 'btnVerify' | 'btnRequest'
  // Form labels
  | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'postalCode' |'dateOfBirth'| 'gender' | 'nationality' | 'profession' | 'specialty' | 'organization' |'password'| 'confirmPassword' | 'currentPassword' | 'newPassword' |'description' | 'notes' | 'reason' | 'diagnosis' | 'treatment' | 'dosage'
  | 'startDate' | 'endDate' | 'duration' | 'quantity' | 'price' | 'total' | 'discount'
  // Validation messages
  | 'validRequired' | 'validEmail' | 'validPhone' | 'validMinLength' | 'validMaxLength' |'validPasswordMatch'| 'validPasswordStrength' | 'validFutureDate' | 'validPastDate' |'validPositiveNumber' | 'validFileSize' | 'validFileType'
  // Status labels
  | 'statusActive' | 'statusInactive' | 'statusPending' | 'statusApproved' | 'statusRejected' |'statusCompleted'| 'statusCancelled' | 'statusDraft' | 'statusSent' | 'statusPaid' |'statusOverdue' | 'statusRefunded' | 'statusCovered' | 'statusScheduled' | 'statusInProgress'
  // Module names (25 SHIFA modules)
  | 'modPatientPortal' | 'modProfessionalWorkspace' | 'modHospitalManagement' | 'modLaboratory' |'modPharmacy'| 'modImaging' | 'modEmergency' | 'modMaternityPediatrics' | 'modFinanceBilling' |'modInventorySupplyChain'| 'modBiomedicalEquipment' | 'modQualityAccreditation' |'modTeleconsultation' | 'modInteroperability' | 'modShifaCard' | 'modWallet'
  | 'modNotifications' | 'modShifaAI' | 'modShifaAcademy' | 'modMarketplace'
  | 'modAmbassadorProgram'| 'modMinistryAuthority' | 'modHealthInsurance' |'modUniversityTraining' | 'modNGOPartner'
  // Country-module config
  | 'countryModuleConfig' | 'moduleStatus' | 'statusAvailable' | 'statusRestricted' |'statusUnavailable'| 'statusComingSoon' | 'regulatoryRules' | 'licenseRequired' |'authorizationRequired'| 'countryConfig' | 'moduleVisibility' | 'applyConfig' |'resetConfig' | 'saveConfig' | 'configSaved' | 'selectCountry' | 'selectModule'
  // Greetings & common phrases
  | 'hello' | 'goodMorning' | 'goodAfternoon' | 'goodEvening' | 'welcome' | 'welcomeBack' |'today'| 'yesterday' | 'tomorrow' | 'thisWeek' | 'thisMonth' | 'thisYear' |'noResults' | 'tryAgain' | 'contactSupport' | 'learnMore' | 'seeDetails' | 'hideDetails';

export type Translations = Record<TranslationKey, string>;

const translations: Record<Language, Translations> = {
  fr: {
    // Core actions
    dashboard: 'Tableau de bord', patients: 'Patients', settings: 'Paramètres', logout: 'Déconnexion',
    search: 'Rechercher', notifications: 'Notifications', save: 'Enregistrer', cancel: 'Annuler',
    confirm: 'Confirmer', delete: 'Supprimer', edit: 'Modifier', add: 'Ajouter', close: 'Fermer',
    back: 'Retour', loading: 'Chargement...', error: 'Erreur', success: 'Succès', noData: 'Aucune donnée',
    viewAll: 'Voir tout', filter: 'Filtrer', export: 'Exporter', language: 'Langue', currency: 'Devise',
    country: 'Pays', timezone: 'Fuseau horaire', profile: 'Profil', help: 'Aide', support: 'Support',
    // Actor spaces
    ambassador: 'Ambassadeur', research: 'Recherche', platformAdmin: 'Administration Plateforme',
    organizations: 'Organisations', users: 'Utilisateurs', modules: 'Modules', reports: 'Rapports',
    analytics: 'Analytique', security: 'Sécurité', audit: 'Audit', integrations: 'Intégrations',
    subscriptions: 'Abonnements', network: 'Réseau', invitations: 'Invitations', referrals: 'Parrainages',
    rewards: 'Récompenses', training: 'Formation', resources: 'Ressources', projects: 'Projets',
    studies: 'Études', datasets: 'Jeux de données', participants: 'Participants', ethics: 'Éthique',
    dataAccess: 'Accès aux données',
    // Navigation
    home: 'Accueil', explore: 'Explorer', appointments: 'Rendez-vous', healthRecord: 'Dossier de santé',
    messages: 'Messages', documents: 'Documents', consultations: 'Consultations', results: 'Résultats',
    followUp: 'Suivi & Soins', vaccination: 'Vaccination', prevention: 'Prévention', emergency: 'Urgences',
    teleconsultation: 'Téléconsultation', card: 'Carte SHIFA', wallet: 'Portefeuilles', payments: 'Paiements',
    consent: 'Consentements', devices: 'Appareils connectés', agenda: 'Agenda', prescriptions: 'Prescriptions',
    carePlans: 'Plans de soins', certificates: 'Certificats médicaux', referralsNav: 'Adressages',
    billing: 'Facturation', finance: 'Finance', inventory: 'Inventaire', quality: 'Qualité & Accréditation',
    biomedical: 'Équipements biomédicaux', interoperability: 'Interopérabilité', laboratory: 'Laboratoire',
    pharmacy: 'Pharmacie', imaging: 'Imagerie', emergencyDept: 'Urgences', maternity: 'Maternité',
    pediatrics: 'Pédiatrie', academy: 'Académie SHIFA', marketplace: 'Marketplace', aiAssistant: 'SHIFA AI',
    communityHub: 'Hub Communautaire',
    // Buttons
    btnBook: 'Prendre rendez-vous', btnStartConsult: 'Démarrer une consultation', btnSendMessage: 'Envoyer un message',
    btnDownload: 'Télécharger', btnUpload: 'Importer', btnNewInvoice: 'Nouvelle facture', btnPay: 'Payer',
    btnRefund: 'Rembourser', btnApprove: 'Approuver', btnReject: 'Rejeter', btnSubmit: 'Soumettre',
    btnConnect: 'Connecter', btnDisconnect: 'Déconnecter', btnActivate: 'Activer', btnDeactivate: 'Désactiver',
    btnRenew: 'Renouveler', btnInvite: 'Inviter', btnShare: 'Partager', btnPrint: 'Imprimer',
    btnGenerate: 'Générer', btnVerify: 'Vérifier', btnRequest: 'Demander',
    // Form labels
    firstName: 'Prénom', lastName: 'Nom', email: 'Email', phone: 'Téléphone', address: 'Adresse',
    city: 'Ville', postalCode: 'Code postal', dateOfBirth: 'Date de naissance', gender: 'Genre',
    nationality: 'Nationalité', profession: 'Profession', specialty: 'Spécialité', organization: 'Organisation',
    password: 'Mot de passe', confirmPassword: 'Confirmer le mot de passe', currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe', description: 'Description', notes: 'Notes', reason: 'Motif',
    diagnosis: 'Diagnostic', treatment: 'Traitement', dosage: 'Posologie', startDate: 'Date de début',
    endDate: 'Date de fin', duration: 'Durée', quantity: 'Quantité', price: 'Prix', total: 'Total', discount: 'Remise',
    // Validation
    validRequired: 'Ce champ est obligatoire', validEmail: 'Adresse email invalide',
    validPhone: 'Numéro de téléphone invalide', validMinLength: 'Trop court (minimum {min} caractères)',
    validMaxLength: 'Trop long (maximum {max} caractères)', validPasswordMatch: 'Les mots de passe ne correspondent pas',
    validPasswordStrength: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre',
    validFutureDate: 'La date doit être dans le futur', validPastDate: 'La date doit être dans le passé',
    validPositiveNumber: 'La valeur doit être positive', validFileSize: 'Fichier trop volumineux (max {size})',
    validFileType: 'Type de fichier non supporté',
    // Status
    statusActive: 'Actif', statusInactive: 'Inactif', statusPending: 'En attente', statusApproved: 'Approuvé',
    statusRejected: 'Rejeté', statusCompleted: 'Terminé', statusCancelled: 'Annulé', statusDraft: 'Brouillon',
    statusSent: 'Envoyé', statusPaid: 'Payé', statusOverdue: 'En retard', statusRefunded: 'Remboursé',
    statusCovered: 'Pris en charge', statusScheduled: 'Planifié', statusInProgress: 'En cours',
    // Module names
    modPatientPortal: 'Portail Patient', modProfessionalWorkspace: 'Espace Professionnel',
    modHospitalManagement: 'Gestion Hospitalière', modLaboratory: 'Laboratoire', modPharmacy: 'Pharmacie',
    modImaging: 'Imagerie Médicale', modEmergency: 'Urgences', modMaternityPediatrics: 'Maternité & Pédiatrie',
    modFinanceBilling: 'Finance & Facturation', modInventorySupplyChain: 'Inventaire & Approvisionnement',
    modBiomedicalEquipment: 'Équipements Biomédicaux', modQualityAccreditation: 'Qualité & Accréditation',
    modTeleconsultation: 'Téléconsultation', modInteroperability: 'Interopérabilité', modShifaCard: 'Carte SHIFA',
    modWallet: 'Portefeuilles Numériques', modNotifications: 'Notifications & Communications',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'SHIFA Académie', modMarketplace: 'Marketplace Santé',
    modAmbassadorProgram: 'Programme Ambassadeur', modMinistryAuthority: 'Ministère & Autorités',
    modHealthInsurance: 'Assurance Santé', modUniversityTraining: 'Université & Formation', modNGOPartner: 'ONG & Partenaires',
    // Country-module config
    countryModuleConfig: 'Configuration Modules par Pays', moduleStatus: 'Statut du module',
    statusAvailable: 'Actif', statusRestricted: 'Restreint', statusUnavailable: 'Non disponible',
    statusComingSoon: 'Bientôt', regulatoryRules: 'Règles réglementaires', licenseRequired: 'Licence requise',
    authorizationRequired: 'Autorisation requise', countryConfig: 'Configuration pays',
    moduleVisibility: 'Visibilité du module', applyConfig: 'Appliquer', resetConfig: 'Réinitialiser',
    saveConfig: 'Sauvegarder la configuration', configSaved: 'Configuration sauvegardée',
    selectCountry: 'Sélectionner un pays', selectModule: 'Sélectionner un module',
    // Greetings
    hello: 'Bonjour', goodMorning: 'Bonjour', goodAfternoon: 'Bon après-midi', goodEvening: 'Bonsoir',
    welcome: 'Bienvenue', welcomeBack: 'Bon retour', today: "Aujourd'hui", yesterday: 'Hier',
    tomorrow: 'Demain', thisWeek: 'Cette semaine', thisMonth: 'Ce mois', thisYear: 'Cette année',
    noResults: 'Aucun résultat', tryAgain: 'Réessayer', contactSupport: 'Contacter le support',
    learnMore: 'En savoir plus', seeDetails: 'Voir les détails', hideDetails: 'Masquer les détails',
  },
  en: {
    // Core actions
    dashboard: 'Dashboard', patients: 'Patients', settings: 'Settings', logout: 'Sign out',
    search: 'Search', notifications: 'Notifications', save: 'Save', cancel: 'Cancel',
    confirm: 'Confirm', delete: 'Delete', edit: 'Edit', add: 'Add', close: 'Close',
    back: 'Back', loading: 'Loading...', error: 'Error', success: 'Success', noData: 'No data',
    viewAll: 'View all', filter: 'Filter', export: 'Export', language: 'Language', currency: 'Currency',
    country: 'Country', timezone: 'Timezone', profile: 'Profile', help: 'Help', support: 'Support',
    // Actor spaces
    ambassador: 'Ambassador', research: 'Research', platformAdmin: 'Platform Administration',
    organizations: 'Organizations', users: 'Users', modules: 'Modules', reports: 'Reports',
    analytics: 'Analytics', security: 'Security', audit: 'Audit', integrations: 'Integrations',
    subscriptions: 'Subscriptions', network: 'Network', invitations: 'Invitations', referrals: 'Referrals',
    rewards: 'Rewards', training: 'Training', resources: 'Resources', projects: 'Projects',
    studies: 'Studies', datasets: 'Datasets', participants: 'Participants', ethics: 'Ethics',
    dataAccess: 'Data Access',
    // Navigation
    home: 'Home', explore: 'Explore', appointments: 'Appointments', healthRecord: 'Health Record',
    messages: 'Messages', documents: 'Documents', consultations: 'Consultations', results: 'Results',
    followUp: 'Follow-up & Care', vaccination: 'Vaccination', prevention: 'Prevention', emergency: 'Emergency',
    teleconsultation: 'Teleconsultation', card: 'SHIFA Card', wallet: 'Wallets', payments: 'Payments',
    consent: 'Consents', devices: 'Connected Devices', agenda: 'Agenda', prescriptions: 'Prescriptions',
    carePlans: 'Care Plans', certificates: 'Medical Certificates', referralsNav: 'Referrals',
    billing: 'Billing', finance: 'Finance', inventory: 'Inventory', quality: 'Quality & Accreditation',
    biomedical: 'Biomedical Equipment', interoperability: 'Interoperability', laboratory: 'Laboratory',
    pharmacy: 'Pharmacy', imaging: 'Imaging', emergencyDept: 'Emergency', maternity: 'Maternity',
    pediatrics: 'Pediatrics', academy: 'SHIFA Academy', marketplace: 'Marketplace', aiAssistant: 'SHIFA AI',
    communityHub: 'Community Hub',
    // Buttons
    btnBook: 'Book appointment', btnStartConsult: 'Start consultation', btnSendMessage: 'Send message',
    btnDownload: 'Download', btnUpload: 'Upload', btnNewInvoice: 'New invoice', btnPay: 'Pay',
    btnRefund: 'Refund', btnApprove: 'Approve', btnReject: 'Reject', btnSubmit: 'Submit',
    btnConnect: 'Connect', btnDisconnect: 'Disconnect', btnActivate: 'Activate', btnDeactivate: 'Deactivate',
    btnRenew: 'Renew', btnInvite: 'Invite', btnShare: 'Share', btnPrint: 'Print',
    btnGenerate: 'Generate', btnVerify: 'Verify', btnRequest: 'Request',
    // Form labels
    firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone', address: 'Address',
    city: 'City', postalCode: 'Postal code', dateOfBirth: 'Date of birth', gender: 'Gender',
    nationality: 'Nationality', profession: 'Profession', specialty: 'Specialty', organization: 'Organization',
    password: 'Password', confirmPassword: 'Confirm password', currentPassword: 'Current password',
    newPassword: 'New password', description: 'Description', notes: 'Notes', reason: 'Reason',
    diagnosis: 'Diagnosis', treatment: 'Treatment', dosage: 'Dosage', startDate: 'Start date',
    endDate: 'End date', duration: 'Duration', quantity: 'Quantity', price: 'Price', total: 'Total', discount: 'Discount',
    // Validation
    validRequired: 'This field is required', validEmail: 'Invalid email address',
    validPhone: 'Invalid phone number', validMinLength: 'Too short (minimum {min} characters)',
    validMaxLength: 'Too long (maximum {max} characters)', validPasswordMatch: 'Passwords do not match',
    validPasswordStrength: 'Password must contain at least 8 characters, one uppercase letter and one number',
    validFutureDate: 'Date must be in the future', validPastDate: 'Date must be in the past',
    validPositiveNumber: 'Value must be positive', validFileSize: 'File too large (max {size})',
    validFileType: 'Unsupported file type',
    // Status
    statusActive: 'Active', statusInactive: 'Inactive', statusPending: 'Pending', statusApproved: 'Approved',
    statusRejected: 'Rejected', statusCompleted: 'Completed', statusCancelled: 'Cancelled', statusDraft: 'Draft',
    statusSent: 'Sent', statusPaid: 'Paid', statusOverdue: 'Overdue', statusRefunded: 'Refunded',
    statusCovered: 'Covered', statusScheduled: 'Scheduled', statusInProgress: 'In progress',
    // Module names
    modPatientPortal: 'Patient Portal', modProfessionalWorkspace: 'Professional Workspace',
    modHospitalManagement: 'Hospital Management', modLaboratory: 'Laboratory', modPharmacy: 'Pharmacy',
    modImaging: 'Medical Imaging', modEmergency: 'Emergency', modMaternityPediatrics: 'Maternity & Pediatrics',
    modFinanceBilling: 'Finance & Billing', modInventorySupplyChain: 'Inventory & Supply Chain',
    modBiomedicalEquipment: 'Biomedical Equipment', modQualityAccreditation: 'Quality & Accreditation',
    modTeleconsultation: 'Teleconsultation', modInteroperability: 'Interoperability', modShifaCard: 'SHIFA Card',
    modWallet: 'Digital Wallets', modNotifications: 'Notifications & Communications',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'SHIFA Academy', modMarketplace: 'Health Marketplace',
    modAmbassadorProgram: 'Ambassador Program', modMinistryAuthority: 'Ministry & Authorities',
    modHealthInsurance: 'Health Insurance', modUniversityTraining: 'University & Training', modNGOPartner: 'NGO & Partners',
    // Country-module config
    countryModuleConfig: 'Country Module Configuration', moduleStatus: 'Module status',
    statusAvailable: 'Active', statusRestricted: 'Restricted', statusUnavailable: 'Unavailable',
    statusComingSoon: 'Coming soon', regulatoryRules: 'Regulatory rules', licenseRequired: 'License required',
    authorizationRequired: 'Authorization required', countryConfig: 'Country configuration',
    moduleVisibility: 'Module visibility', applyConfig: 'Apply', resetConfig: 'Reset',
    saveConfig: 'Save configuration', configSaved: 'Configuration saved',
    selectCountry: 'Select a country', selectModule: 'Select a module',
    // Greetings
    hello: 'Hello', goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
    welcome: 'Welcome', welcomeBack: 'Welcome back', today: 'Today', yesterday: 'Yesterday',
    tomorrow: 'Tomorrow', thisWeek: 'This week', thisMonth: 'This month', thisYear: 'This year',
    noResults: 'No results', tryAgain: 'Try again', contactSupport: 'Contact support',
    learnMore: 'Learn more', seeDetails: 'See details', hideDetails: 'Hide details',
  },
  es: {
    // Core actions
    dashboard: 'Panel de control', patients: 'Pacientes', settings: 'Configuración', logout: 'Cerrar sesión',
    search: 'Buscar', notifications: 'Notificaciones', save: 'Guardar', cancel: 'Cancelar',
    confirm: 'Confirmar', delete: 'Eliminar', edit: 'Editar', add: 'Agregar', close: 'Cerrar',
    back: 'Volver', loading: 'Cargando...', error: 'Error', success: 'Éxito', noData: 'Sin datos',
    viewAll: 'Ver todo', filter: 'Filtrar', export: 'Exportar', language: 'Idioma', currency: 'Moneda',
    country: 'País', timezone: 'Zona horaria', profile: 'Perfil', help: 'Ayuda', support: 'Soporte',
    // Actor spaces
    ambassador: 'Embajador', research: 'Investigación', platformAdmin: 'Administración de Plataforma',
    organizations: 'Organizaciones', users: 'Usuarios', modules: 'Módulos', reports: 'Informes',
    analytics: 'Analítica', security: 'Seguridad', audit: 'Auditoría', integrations: 'Integraciones',
    subscriptions: 'Suscripciones', network: 'Red', invitations: 'Invitaciones', referrals: 'Referencias',
    rewards: 'Recompensas', training: 'Formación', resources: 'Recursos', projects: 'Proyectos',
    studies: 'Estudios', datasets: 'Conjuntos de datos', participants: 'Participantes', ethics: 'Ética',
    dataAccess: 'Acceso a datos',
    // Navigation
    home: 'Inicio', explore: 'Explorar', appointments: 'Citas', healthRecord: 'Historial médico',
    messages: 'Mensajes', documents: 'Documentos', consultations: 'Consultas', results: 'Resultados',
    followUp: 'Seguimiento', vaccination: 'Vacunación', prevention: 'Prevención', emergency: 'Urgencias',
    teleconsultation: 'Teleconsulta', card: 'Tarjeta SHIFA', wallet: 'Billeteras', payments: 'Pagos',
    consent: 'Consentimientos', devices: 'Dispositivos conectados', agenda: 'Agenda', prescriptions: 'Recetas',
    carePlans: 'Planes de atención', certificates: 'Certificados médicos', referralsNav: 'Derivaciones',
    billing: 'Facturación', finance: 'Finanzas', inventory: 'Inventario', quality: 'Calidad y Acreditación',
    biomedical: 'Equipos biomédicos', interoperability: 'Interoperabilidad', laboratory: 'Laboratorio',
    pharmacy: 'Farmacia', imaging: 'Imágenes médicas', emergencyDept: 'Urgencias', maternity: 'Maternidad',
    pediatrics: 'Pediatría', academy: 'Academia SHIFA', marketplace: 'Mercado', aiAssistant: 'SHIFA AI',
    communityHub: 'Centro comunitario',
    // Buttons
    btnBook: 'Reservar cita', btnStartConsult: 'Iniciar consulta', btnSendMessage: 'Enviar mensaje',
    btnDownload: 'Descargar', btnUpload: 'Subir', btnNewInvoice: 'Nueva factura', btnPay: 'Pagar',
    btnRefund: 'Reembolsar', btnApprove: 'Aprobar', btnReject: 'Rechazar', btnSubmit: 'Enviar',
    btnConnect: 'Conectar', btnDisconnect: 'Desconectar', btnActivate: 'Activar', btnDeactivate: 'Desactivar',
    btnRenew: 'Renovar', btnInvite: 'Invitar', btnShare: 'Compartir', btnPrint: 'Imprimir',
    btnGenerate: 'Generar', btnVerify: 'Verificar', btnRequest: 'Solicitar',
    // Form labels
    firstName: 'Nombre', lastName: 'Apellido', email: 'Correo electrónico', phone: 'Teléfono', address: 'Dirección',
    city: 'Ciudad', postalCode: 'Código postal', dateOfBirth: 'Fecha de nacimiento', gender: 'Género',
    nationality: 'Nacionalidad', profession: 'Profesión', specialty: 'Especialidad', organization: 'Organización',
    password: 'Contraseña', confirmPassword: 'Confirmar contraseña', currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña', description: 'Descripción', notes: 'Notas', reason: 'Motivo',
    diagnosis: 'Diagnóstico', treatment: 'Tratamiento', dosage: 'Dosis', startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin', duration: 'Duración', quantity: 'Cantidad', price: 'Precio', total: 'Total', discount: 'Descuento',
    // Validation
    validRequired: 'Este campo es obligatorio', validEmail: 'Correo electrónico inválido',
    validPhone: 'Número de teléfono inválido', validMinLength: 'Demasiado corto (mínimo {min} caracteres)',
    validMaxLength: 'Demasiado largo (máximo {max} caracteres)', validPasswordMatch: 'Las contraseñas no coinciden',
    validPasswordStrength: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
    validFutureDate: 'La fecha debe ser futura', validPastDate: 'La fecha debe ser pasada',
    validPositiveNumber: 'El valor debe ser positivo', validFileSize: 'Archivo demasiado grande (máx {size})',
    validFileType: 'Tipo de archivo no compatible',
    // Status
    statusActive: 'Activo', statusInactive: 'Inactivo', statusPending: 'Pendiente', statusApproved: 'Aprobado',
    statusRejected: 'Rechazado', statusCompleted: 'Completado', statusCancelled: 'Cancelado', statusDraft: 'Borrador',
    statusSent: 'Enviado', statusPaid: 'Pagado', statusOverdue: 'Vencido', statusRefunded: 'Reembolsado',
    statusCovered: 'Cubierto', statusScheduled: 'Programado', statusInProgress: 'En progreso',
    // Module names
    modPatientPortal: 'Portal del Paciente', modProfessionalWorkspace: 'Espacio Profesional',
    modHospitalManagement: 'Gestión Hospitalaria', modLaboratory: 'Laboratorio', modPharmacy: 'Farmacia',
    modImaging: 'Imágenes Médicas', modEmergency: 'Urgencias', modMaternityPediatrics: 'Maternidad y Pediatría',
    modFinanceBilling: 'Finanzas y Facturación', modInventorySupplyChain: 'Inventario y Cadena de Suministro',
    modBiomedicalEquipment: 'Equipos Biomédicos', modQualityAccreditation: 'Calidad y Acreditación',
    modTeleconsultation: 'Teleconsulta', modInteroperability: 'Interoperabilidad', modShifaCard: 'Tarjeta SHIFA',
    modWallet: 'Billeteras Digitales', modNotifications: 'Notificaciones y Comunicaciones',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'Academia SHIFA', modMarketplace: 'Mercado de Salud',
    modAmbassadorProgram: 'Programa de Embajadores', modMinistryAuthority: 'Ministerio y Autoridades',
    modHealthInsurance: 'Seguro de Salud', modUniversityTraining: 'Universidad y Formación', modNGOPartner: 'ONG y Socios',
    // Country-module config
    countryModuleConfig: 'Configuración de Módulos por País', moduleStatus: 'Estado del módulo',
    statusAvailable: 'Activo', statusRestricted: 'Restringido', statusUnavailable: 'No disponible',
    statusComingSoon: 'Próximamente', regulatoryRules: 'Reglas regulatorias', licenseRequired: 'Licencia requerida',
    authorizationRequired: 'Autorización requerida', countryConfig: 'Configuración del país',
    moduleVisibility: 'Visibilidad del módulo', applyConfig: 'Aplicar', resetConfig: 'Restablecer',
    saveConfig: 'Guardar configuración', configSaved: 'Configuración guardada',
    selectCountry: 'Seleccionar un país', selectModule: 'Seleccionar un módulo',
    // Greetings
    hello: 'Hola', goodMorning: 'Buenos días', goodAfternoon: 'Buenas tardes', goodEvening: 'Buenas noches',
    welcome: 'Bienvenido', welcomeBack: 'Bienvenido de vuelta', today: 'Hoy', yesterday: 'Ayer',
    tomorrow: 'Mañana', thisWeek: 'Esta semana', thisMonth: 'Este mes', thisYear: 'Este año',
    noResults: 'Sin resultados', tryAgain: 'Intentar de nuevo', contactSupport: 'Contactar soporte',
    learnMore: 'Saber más', seeDetails: 'Ver detalles', hideDetails: 'Ocultar detalles',
  },
  pt: {
    // Core actions
    dashboard: 'Painel', patients: 'Pacientes', settings: 'Configurações', logout: 'Sair',
    search: 'Pesquisar', notifications: 'Notificações', save: 'Salvar', cancel: 'Cancelar',
    confirm: 'Confirmar', delete: 'Excluir', edit: 'Editar', add: 'Adicionar', close: 'Fechar',
    back: 'Voltar', loading: 'Carregando...', error: 'Erro', success: 'Sucesso', noData: 'Sem dados',
    viewAll: 'Ver tudo', filter: 'Filtrar', export: 'Exportar', language: 'Idioma', currency: 'Moeda',
    country: 'País', timezone: 'Fuso horário', profile: 'Perfil', help: 'Ajuda', support: 'Suporte',
    // Actor spaces
    ambassador: 'Embaixador', research: 'Pesquisa', platformAdmin: 'Administração da Plataforma',
    organizations: 'Organizações', users: 'Usuários', modules: 'Módulos', reports: 'Relatórios',
    analytics: 'Análise', security: 'Segurança', audit: 'Auditoria', integrations: 'Integrações',
    subscriptions: 'Assinaturas', network: 'Rede', invitations: 'Convites', referrals: 'Indicações',
    rewards: 'Recompensas', training: 'Treinamento', resources: 'Recursos', projects: 'Projetos',
    studies: 'Estudos', datasets: 'Conjuntos de dados', participants: 'Participantes', ethics: 'Ética',
    dataAccess: 'Acesso a dados',
    // Navigation
    home: 'Início', explore: 'Explorar', appointments: 'Consultas', healthRecord: 'Prontuário',
    messages: 'Mensagens', documents: 'Documentos', consultations: 'Consultas', results: 'Resultados',
    followUp: 'Acompanhamento', vaccination: 'Vacinação', prevention: 'Prevenção', emergency: 'Emergência',
    teleconsultation: 'Teleconsulta', card: 'Cartão SHIFA', wallet: 'Carteiras', payments: 'Pagamentos',
    consent: 'Consentimentos', devices: 'Dispositivos conectados', agenda: 'Agenda', prescriptions: 'Prescrições',
    carePlans: 'Planos de cuidados', certificates: 'Certificados médicos', referralsNav: 'Encaminhamentos',
    billing: 'Faturamento', finance: 'Finanças', inventory: 'Estoque', quality: 'Qualidade e Acreditação',
    biomedical: 'Equipamentos biomédicos', interoperability: 'Interoperabilidade', laboratory: 'Laboratório',
    pharmacy: 'Farmácia', imaging: 'Imagens médicas', emergencyDept: 'Emergência', maternity: 'Maternidade',
    pediatrics: 'Pediatria', academy: 'Academia SHIFA', marketplace: 'Marketplace', aiAssistant: 'SHIFA AI',
    communityHub: 'Hub Comunitário',
    // Buttons
    btnBook: 'Agendar consulta', btnStartConsult: 'Iniciar consulta', btnSendMessage: 'Enviar mensagem',
    btnDownload: 'Baixar', btnUpload: 'Enviar', btnNewInvoice: 'Nova fatura', btnPay: 'Pagar',
    btnRefund: 'Reembolsar', btnApprove: 'Aprovar', btnReject: 'Rejeitar', btnSubmit: 'Enviar',
    btnConnect: 'Conectar', btnDisconnect: 'Desconectar', btnActivate: 'Ativar', btnDeactivate: 'Desativar',
    btnRenew: 'Renovar', btnInvite: 'Convidar', btnShare: 'Compartilhar', btnPrint: 'Imprimir',
    btnGenerate: 'Gerar', btnVerify: 'Verificar', btnRequest: 'Solicitar',
    // Form labels
    firstName: 'Nome', lastName: 'Sobrenome', email: 'E-mail', phone: 'Telefone', address: 'Endereço',
    city: 'Cidade', postalCode: 'CEP', dateOfBirth: 'Data de nascimento', gender: 'Gênero',
    nationality: 'Nacionalidade', profession: 'Profissão', specialty: 'Especialidade', organization: 'Organização',
    password: 'Senha', confirmPassword: 'Confirmar senha', currentPassword: 'Senha atual',
    newPassword: 'Nova senha', description: 'Descrição', notes: 'Notas', reason: 'Motivo',
    diagnosis: 'Diagnóstico', treatment: 'Tratamento', dosage: 'Dosagem', startDate: 'Data de início',
    endDate: 'Data de fim', duration: 'Duração', quantity: 'Quantidade', price: 'Preço', total: 'Total', discount: 'Desconto',
    // Validation
    validRequired: 'Este campo é obrigatório', validEmail: 'Endereço de e-mail inválido',
    validPhone: 'Número de telefone inválido', validMinLength: 'Muito curto (mínimo {min} caracteres)',
    validMaxLength: 'Muito longo (máximo {max} caracteres)', validPasswordMatch: 'As senhas não coincidem',
    validPasswordStrength: 'A senha deve ter pelo menos 8 caracteres, uma maiúscula e um número',
    validFutureDate: 'A data deve ser futura', validPastDate: 'A data deve ser passada',
    validPositiveNumber: 'O valor deve ser positivo', validFileSize: 'Arquivo muito grande (máx {size})',
    validFileType: 'Tipo de arquivo não suportado',
    // Status
    statusActive: 'Ativo', statusInactive: 'Inativo', statusPending: 'Pendente', statusApproved: 'Aprovado',
    statusRejected: 'Rejeitado', statusCompleted: 'Concluído', statusCancelled: 'Cancelado', statusDraft: 'Rascunho',
    statusSent: 'Enviado', statusPaid: 'Pago', statusOverdue: 'Vencido', statusRefunded: 'Reembolsado',
    statusCovered: 'Coberto', statusScheduled: 'Agendado', statusInProgress: 'Em andamento',
    // Module names
    modPatientPortal: 'Portal do Paciente', modProfessionalWorkspace: 'Espaço Profissional',
    modHospitalManagement: 'Gestão Hospitalar', modLaboratory: 'Laboratório', modPharmacy: 'Farmácia',
    modImaging: 'Imagens Médicas', modEmergency: 'Emergência', modMaternityPediatrics: 'Maternidade e Pediatria',
    modFinanceBilling: 'Finanças e Faturamento', modInventorySupplyChain: 'Estoque e Cadeia de Suprimentos',
    modBiomedicalEquipment: 'Equipamentos Biomédicos', modQualityAccreditation: 'Qualidade e Acreditação',
    modTeleconsultation: 'Teleconsulta', modInteroperability: 'Interoperabilidade', modShifaCard: 'Cartão SHIFA',
    modWallet: 'Carteiras Digitais', modNotifications: 'Notificações e Comunicações',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'Academia SHIFA', modMarketplace: 'Marketplace de Saúde',
    modAmbassadorProgram: 'Programa de Embaixadores', modMinistryAuthority: 'Ministério e Autoridades',
    modHealthInsurance: 'Seguro de Saúde', modUniversityTraining: 'Universidade e Formação', modNGOPartner: 'ONG e Parceiros',
    // Country-module config
    countryModuleConfig: 'Configuração de Módulos por País', moduleStatus: 'Status do módulo',
    statusAvailable: 'Ativo', statusRestricted: 'Restrito', statusUnavailable: 'Indisponível',
    statusComingSoon: 'Em breve', regulatoryRules: 'Regras regulatórias', licenseRequired: 'Licença necessária',
    authorizationRequired: 'Autorização necessária', countryConfig: 'Configuração do país',
    moduleVisibility: 'Visibilidade do módulo', applyConfig: 'Aplicar', resetConfig: 'Redefinir',
    saveConfig: 'Salvar configuração', configSaved: 'Configuração salva',
    selectCountry: 'Selecionar um país', selectModule: 'Selecionar um módulo',
    // Greetings
    hello: 'Olá', goodMorning: 'Bom dia', goodAfternoon: 'Boa tarde', goodEvening: 'Boa noite',
    welcome: 'Bem-vindo', welcomeBack: 'Bem-vindo de volta', today: 'Hoje', yesterday: 'Ontem',
    tomorrow: 'Amanhã', thisWeek: 'Esta semana', thisMonth: 'Este mês', thisYear: 'Este ano',
    noResults: 'Sem resultados', tryAgain: 'Tentar novamente', contactSupport: 'Contatar suporte',
    learnMore: 'Saiba mais', seeDetails: 'Ver detalhes', hideDetails: 'Ocultar detalhes',
  },
  ar: {
    // Core actions
    dashboard: 'لوحة التحكم', patients: 'المرضى', settings: 'الإعدادات', logout: 'تسجيل الخروج',
    search: 'بحث', notifications: 'الإشعارات', save: 'حفظ', cancel: 'إلغاء',
    confirm: 'تأكيد', delete: 'حذف', edit: 'تعديل', add: 'إضافة', close: 'إغلاق',
    back: 'رجوع', loading: 'جارٍ التحميل...', error: 'خطأ', success: 'نجاح', noData: 'لا توجد بيانات',
    viewAll: 'عرض الكل', filter: 'تصفية', export: 'تصدير', language: 'اللغة', currency: 'العملة',
    country: 'البلد', timezone: 'المنطقة الزمنية', profile: 'الملف الشخصي', help: 'مساعدة', support: 'الدعم',
    // Actor spaces
    ambassador: 'السفير', research: 'البحث', platformAdmin: 'إدارة المنصة',
    organizations: 'المنظمات', users: 'المستخدمون', modules: 'الوحدات', reports: 'التقارير',
    analytics: 'التحليلات', security: 'الأمان', audit: 'التدقيق', integrations: 'التكاملات',
    subscriptions: 'الاشتراكات', network: 'الشبكة', invitations: 'الدعوات', referrals: 'الإحالات',
    rewards: 'المكافآت', training: 'التدريب', resources: 'الموارد', projects: 'المشاريع',
    studies: 'الدراسات', datasets: 'مجموعات البيانات', participants: 'المشاركون', ethics: 'الأخلاقيات',
    dataAccess: 'الوصول إلى البيانات',
    // Navigation
    home: 'الرئيسية', explore: 'استكشاف', appointments: 'المواعيد', healthRecord: 'السجل الصحي',
    messages: 'الرسائل', documents: 'الوثائق', consultations: 'الاستشارات', results: 'النتائج',
    followUp: 'المتابعة والرعاية', vaccination: 'التطعيم', prevention: 'الوقاية', emergency: 'الطوارئ',
    teleconsultation: 'الاستشارة عن بُعد', card: 'بطاقة SHIFA', wallet: 'المحافظ', payments: 'المدفوعات',
    consent: 'الموافقات', devices: 'الأجهزة المتصلة', agenda: 'جدول الأعمال', prescriptions: 'الوصفات الطبية',
    carePlans: 'خطط الرعاية', certificates: 'الشهادات الطبية', referralsNav: 'الإحالات',
    billing: 'الفواتير', finance: 'المالية', inventory: 'المخزون', quality: 'الجودة والاعتماد',
    biomedical: 'المعدات الطبية الحيوية', interoperability: 'التشغيل البيني', laboratory: 'المختبر',
    pharmacy: 'الصيدلية', imaging: 'التصوير الطبي', emergencyDept: 'الطوارئ', maternity: 'الأمومة',
    pediatrics: 'طب الأطفال', academy: 'أكاديمية SHIFA', marketplace: 'السوق', aiAssistant: 'SHIFA AI',
    communityHub: 'مركز المجتمع',
    // Buttons
    btnBook: 'حجز موعد', btnStartConsult: 'بدء الاستشارة', btnSendMessage: 'إرسال رسالة',
    btnDownload: 'تنزيل', btnUpload: 'رفع', btnNewInvoice: 'فاتورة جديدة', btnPay: 'دفع',
    btnRefund: 'استرداد', btnApprove: 'موافقة', btnReject: 'رفض', btnSubmit: 'إرسال',
    btnConnect: 'توصيل', btnDisconnect: 'قطع الاتصال', btnActivate: 'تفعيل', btnDeactivate: 'تعطيل',
    btnRenew: 'تجديد', btnInvite: 'دعوة', btnShare: 'مشاركة', btnPrint: 'طباعة',
    btnGenerate: 'توليد', btnVerify: 'التحقق', btnRequest: 'طلب',
    // Form labels
    firstName: 'الاسم الأول', lastName: 'اسم العائلة', email: 'البريد الإلكتروني', phone: 'الهاتف', address: 'العنوان',
    city: 'المدينة', postalCode: 'الرمز البريدي', dateOfBirth: 'تاريخ الميلاد', gender: 'الجنس',
    nationality: 'الجنسية', profession: 'المهنة', specialty: 'التخصص', organization: 'المنظمة',
    password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور', currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة', description: 'الوصف', notes: 'ملاحظات', reason: 'السبب',
    diagnosis: 'التشخيص', treatment: 'العلاج', dosage: 'الجرعة', startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء', duration: 'المدة', quantity: 'الكمية', price: 'السعر', total: 'المجموع', discount: 'الخصم',
    // Validation
    validRequired: 'هذا الحقل مطلوب', validEmail: 'عنوان البريد الإلكتروني غير صالح',
    validPhone: 'رقم الهاتف غير صالح', validMinLength: 'قصير جداً (الحد الأدنى {min} أحرف)',
    validMaxLength: 'طويل جداً (الحد الأقصى {max} أحرف)', validPasswordMatch: 'كلمات المرور غير متطابقة',
    validPasswordStrength: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف كبير ورقم',
    validFutureDate: 'يجب أن يكون التاريخ في المستقبل', validPastDate: 'يجب أن يكون التاريخ في الماضي',
    validPositiveNumber: 'يجب أن تكون القيمة موجبة', validFileSize: 'الملف كبير جداً (الحد الأقصى {size})',
    validFileType: 'نوع الملف غير مدعوم',
    // Status
    statusActive: 'نشط', statusInactive: 'غير نشط', statusPending: 'قيد الانتظار', statusApproved: 'موافق عليه',
    statusRejected: 'مرفوض', statusCompleted: 'مكتمل', statusCancelled: 'ملغى', statusDraft: 'مسودة',
    statusSent: 'مُرسل', statusPaid: 'مدفوع', statusOverdue: 'متأخر', statusRefunded: 'مُسترد',
    statusCovered: 'مُغطى', statusScheduled: 'مجدول', statusInProgress: 'قيد التنفيذ',
    // Module names
    modPatientPortal: 'بوابة المريض', modProfessionalWorkspace: 'مساحة العمل المهنية',
    modHospitalManagement: 'إدارة المستشفى', modLaboratory: 'المختبر', modPharmacy: 'الصيدلية',
    modImaging: 'التصوير الطبي', modEmergency: 'الطوارئ', modMaternityPediatrics: 'الأمومة وطب الأطفال',
    modFinanceBilling: 'المالية والفواتير', modInventorySupplyChain: 'المخزون وسلسلة التوريد',
    modBiomedicalEquipment: 'المعدات الطبية الحيوية', modQualityAccreditation: 'الجودة والاعتماد',
    modTeleconsultation: 'الاستشارة عن بُعد', modInteroperability: 'التشغيل البيني', modShifaCard: 'بطاقة SHIFA',
    modWallet: 'المحافظ الرقمية', modNotifications: 'الإشعارات والاتصالات',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'أكاديمية SHIFA', modMarketplace: 'سوق الصحة',
    modAmbassadorProgram: 'برنامج السفراء', modMinistryAuthority: 'الوزارة والسلطات',
    modHealthInsurance: 'التأمين الصحي', modUniversityTraining: 'الجامعة والتدريب', modNGOPartner: 'المنظمات غير الحكومية والشركاء',
    // Country-module config
    countryModuleConfig: 'تكوين الوحدات حسب البلد', moduleStatus: 'حالة الوحدة',
    statusAvailable: 'نشط', statusRestricted: 'مقيد', statusUnavailable: 'غير متاح',
    statusComingSoon: 'قريباً', regulatoryRules: 'القواعد التنظيمية', licenseRequired: 'ترخيص مطلوب',
    authorizationRequired: 'تفويض مطلوب', countryConfig: 'تكوين البلد',
    moduleVisibility: 'رؤية الوحدة', applyConfig: 'تطبيق', resetConfig: 'إعادة تعيين',
    saveConfig: 'حفظ التكوين', configSaved: 'تم حفظ التكوين',
    selectCountry: 'اختر بلداً', selectModule: 'اختر وحدة',
    // Greetings
    hello: 'مرحباً', goodMorning: 'صباح الخير', goodAfternoon: 'مساء الخير', goodEvening: 'مساء النور',
    welcome: 'أهلاً وسهلاً', welcomeBack: 'مرحباً بعودتك', today: 'اليوم', yesterday: 'أمس',
    tomorrow: 'غداً', thisWeek: 'هذا الأسبوع', thisMonth: 'هذا الشهر', thisYear: 'هذا العام',
    noResults: 'لا توجد نتائج', tryAgain: 'حاول مرة أخرى', contactSupport: 'تواصل مع الدعم',
    learnMore: 'اعرف المزيد', seeDetails: 'عرض التفاصيل', hideDetails: 'إخفاء التفاصيل',
  },
  zh: {
    // Core actions
    dashboard: '仪表板', patients: '患者', settings: '设置', logout: '退出登录',
    search: '搜索', notifications: '通知', save: '保存', cancel: '取消',
    confirm: '确认', delete: '删除', edit: '编辑', add: '添加', close: '关闭',
    back: '返回', loading: '加载中...', error: '错误', success: '成功', noData: '暂无数据',
    viewAll: '查看全部', filter: '筛选', export: '导出', language: '语言', currency: '货币',
    country: '国家', timezone: '时区', profile: '个人资料', help: '帮助', support: '支持',
    // Actor spaces
    ambassador: '大使', research: '研究', platformAdmin: '平台管理',
    organizations: '组织', users: '用户', modules: '模块', reports: '报告',
    analytics: '分析', security: '安全', audit: '审计', integrations: '集成',
    subscriptions: '订阅', network: '网络', invitations: '邀请', referrals: '推荐',
    rewards: '奖励', training: '培训', resources: '资源', projects: '项目',
    studies: '研究', datasets: '数据集', participants: '参与者', ethics: '伦理',
    dataAccess: '数据访问',
    // Navigation
    home: '首页', explore: '探索', appointments: '预约', healthRecord: '健康档案',
    messages: '消息', documents: '文件', consultations: '问诊', results: '结果',
    followUp: '随访与护理', vaccination: '疫苗接种', prevention: '预防', emergency: '急诊',
    teleconsultation: '远程问诊', card: 'SHIFA卡', wallet: '钱包', payments: '支付',
    consent: '知情同意', devices: '连接设备', agenda: '日程', prescriptions: '处方',
    carePlans: '护理计划', certificates: '医疗证明', referralsNav: '转诊',
    billing: '账单', finance: '财务', inventory: '库存', quality: '质量与认证',
    biomedical: '生物医学设备', interoperability: '互操作性', laboratory: '实验室',
    pharmacy: '药房', imaging: '医学影像', emergencyDept: '急诊', maternity: '产科',
    pediatrics: '儿科', academy: 'SHIFA学院', marketplace: '市场', aiAssistant: 'SHIFA AI',
    communityHub: '社区中心',
    // Buttons
    btnBook: '预约', btnStartConsult: '开始问诊', btnSendMessage: '发送消息',
    btnDownload: '下载', btnUpload: '上传', btnNewInvoice: '新建发票', btnPay: '支付',
    btnRefund: '退款', btnApprove: '批准', btnReject: '拒绝', btnSubmit: '提交',
    btnConnect: '连接', btnDisconnect: '断开', btnActivate: '激活', btnDeactivate: '停用',
    btnRenew: '续订', btnInvite: '邀请', btnShare: '分享', btnPrint: '打印',
    btnGenerate: '生成', btnVerify: '验证', btnRequest: '申请',
    // Form labels
    firstName: '名', lastName: '姓', email: '电子邮件', phone: '电话', address: '地址',
    city: '城市', postalCode: '邮政编码', dateOfBirth: '出生日期', gender: '性别',
    nationality: '国籍', profession: '职业', specialty: '专业', organization: '组织',
    password: '密码', confirmPassword: '确认密码', currentPassword: '当前密码',
    newPassword: '新密码', description: '描述', notes: '备注', reason: '原因',
    diagnosis: '诊断', treatment: '治疗', dosage: '剂量', startDate: '开始日期',
    endDate: '结束日期', duration: '时长', quantity: '数量', price: '价格', total: '总计', discount: '折扣',
    // Validation
    validRequired: '此字段为必填项', validEmail: '无效的电子邮件地址',
    validPhone: '无效的电话号码', validMinLength: '太短（最少{min}个字符）',
    validMaxLength: '太长（最多{max}个字符）', validPasswordMatch: '密码不匹配',
    validPasswordStrength: '密码必须包含至少8个字符、一个大写字母和一个数字',
    validFutureDate: '日期必须在未来', validPastDate: '日期必须在过去',
    validPositiveNumber: '值必须为正数', validFileSize: '文件太大（最大{size}）',
    validFileType: '不支持的文件类型',
    // Status
    statusActive: '活跃', statusInactive: '不活跃', statusPending: '待处理', statusApproved: '已批准',
    statusRejected: '已拒绝', statusCompleted: '已完成', statusCancelled: '已取消', statusDraft: '草稿',
    statusSent: '已发送', statusPaid: '已支付', statusOverdue: '逾期', statusRefunded: '已退款',
    statusCovered: '已覆盖', statusScheduled: '已安排', statusInProgress: '进行中',
    // Module names
    modPatientPortal: '患者门户', modProfessionalWorkspace: '专业工作区',
    modHospitalManagement: '医院管理', modLaboratory: '实验室', modPharmacy: '药房',
    modImaging: '医学影像', modEmergency: '急诊', modMaternityPediatrics: '产科与儿科',
    modFinanceBilling: '财务与账单', modInventorySupplyChain: '库存与供应链',
    modBiomedicalEquipment: '生物医学设备', modQualityAccreditation: '质量与认证',
    modTeleconsultation: '远程问诊', modInteroperability: '互操作性', modShifaCard: 'SHIFA卡',
    modWallet: '数字钱包', modNotifications: '通知与通信',
    modShifaAI: 'SHIFA AI', modShifaAcademy: 'SHIFA学院', modMarketplace: '健康市场',
    modAmbassadorProgram: '大使计划', modMinistryAuthority: '卫生部与当局',
    modHealthInsurance: '健康保险', modUniversityTraining: '大学与培训', modNGOPartner: '非政府组织与合作伙伴',
    // Country-module config
    countryModuleConfig: '按国家配置模块', moduleStatus: '模块状态',
    statusAvailable: '活跃', statusRestricted: '受限', statusUnavailable: '不可用',
    statusComingSoon: '即将推出', regulatoryRules: '监管规则', licenseRequired: '需要许可证',
    authorizationRequired: '需要授权', countryConfig: '国家配置',
    moduleVisibility: '模块可见性', applyConfig: '应用', resetConfig: '重置',
    saveConfig: '保存配置', configSaved: '配置已保存',
    selectCountry: '选择国家', selectModule: '选择模块',
    // Greetings
    hello: '你好', goodMorning: '早上好', goodAfternoon: '下午好', goodEvening: '晚上好',
    welcome: '欢迎', welcomeBack: '欢迎回来', today: '今天', yesterday: '昨天',
    tomorrow: '明天', thisWeek: '本周', thisMonth: '本月', thisYear: '今年',
    noResults: '无结果', tryAgain: '重试', contactSupport: '联系支持',
    learnMore: '了解更多', seeDetails: '查看详情', hideDetails: '隐藏详情',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations['fr'];
}

export function t(key: TranslationKey, lang: Language = 'fr'): string {
  return translations[lang]?.[key] ?? translations['fr'][key] ?? key;
}
