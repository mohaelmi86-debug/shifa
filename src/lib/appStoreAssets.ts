/**
 * SHIFA HEALTH OS — App Store & Google Play Assets Structure
 * 
 * This file defines all metadata, asset paths, and configuration
 * required for publishing SHIFA on both app stores.
 * 
 * Phase 3 — Store Readiness
 */

// ─── App Identity ─────────────────────────────────────────────────────────────

export const APP_IDENTITY = {
  name: 'SHIFA Health OS',
  tagline: 'Un Patient, Un Dossier, Un Écosystème',
  taglineEn: 'One Patient, One Record, One Ecosystem',
  version: '1.0.0',
  buildNumber: 1,
  
  // Android
  android: {
    packageId: 'health.shifa.app',
    targetSdkVersion: 34,
    minSdkVersion: 24, // Android 7.0+
    versionCode: 1,
    versionName: '1.0.0',
  },
  
  // iOS
  ios: {
    bundleId: 'health.shifa.app',
    minimumOSVersion: '15.0',
    buildNumber: '1',
    teamId: 'YOUR_APPLE_TEAM_ID',
    appStoreConnectId: 'YOUR_APP_STORE_CONNECT_ID',
  },
} as const;

// ─── App Store Descriptions ───────────────────────────────────────────────────

export const APP_DESCRIPTIONS: Record<string, { short: string; full: string }> = {
  fr: {
    short: 'Votre dossier de santé sécurisé, vos rendez-vous, vos professionnels — tout en un.',
    full: `SHIFA Health OS est la plateforme de santé numérique qui connecte patients, professionnels de santé et établissements autour d'un dossier de santé sécurisé et d'une architecture modulaire mondiale.

POUR LES PATIENTS :
• Dossier de santé centralisé et sécurisé
• Prise de rendez-vous simplifiée
• Téléconsultation avec vos médecins
• Résultats de laboratoire en temps réel
• Carte SHIFA numérique
• Messagerie sécurisée avec vos soignants

POUR LES PROFESSIONNELS :
• Agenda et gestion des consultations
• Prescriptions électroniques
• Dossier patient complet
• Coordination des soins
• Téléconsultation intégrée

POUR LES ÉTABLISSEMENTS :
• Gestion hospitalière complète
• Modules spécialisés (laboratoire, pharmacie, imagerie...)
• Tableaux de bord et analytique
• Interopérabilité et connecteurs

SÉCURITÉ & CONFIDENTIALITÉ :
• Données chiffrées et hébergées de manière sécurisée
• Conformité RGPD
• Authentification à deux facteurs
• Contrôle total de vos données

Disponible en français, anglais, arabe, espagnol, portugais et chinois.`,
  },
  en: {
    short: 'Your secure health record, appointments, and care team — all in one place.',
    full: `SHIFA Health OS is the digital health platform connecting patients, healthcare professionals, and institutions around a secure health record and modular global architecture.

FOR PATIENTS:
• Centralized and secure health record
• Easy appointment booking
• Teleconsultation with your doctors
• Real-time lab results
• Digital SHIFA Card
• Secure messaging with your care team

FOR PROFESSIONALS:
• Agenda and consultation management
• Electronic prescriptions
• Complete patient records
• Care coordination
• Integrated teleconsultation

FOR INSTITUTIONS:
• Complete hospital management
• Specialized modules (lab, pharmacy, imaging...)
• Dashboards and analytics
• Interoperability and connectors

SECURITY & PRIVACY:
• Encrypted and securely hosted data
• GDPR compliant
• Two-factor authentication
• Full control of your data

Available in French, English, Arabic, Spanish, Portuguese, and Chinese.`,
  },
  ar: {
    short: 'سجلك الصحي الآمن، مواعيدك، وفريق رعايتك — كل شيء في مكان واحد.',
    full: `SHIFA Health OS هي منصة الصحة الرقمية التي تربط المرضى والمهنيين الصحيين والمؤسسات حول سجل صحي آمن وبنية معيارية عالمية.

للمرضى:
• سجل صحي مركزي وآمن
• حجز المواعيد بسهولة
• الاستشارة عن بُعد مع أطبائك
• نتائج المختبر في الوقت الفعلي
• بطاقة SHIFA الرقمية
• مراسلة آمنة مع فريق رعايتك

للمهنيين:
• إدارة الجدول والاستشارات
• الوصفات الطبية الإلكترونية
• ملف المريض الكامل
• تنسيق الرعاية
• استشارة عن بُعد متكاملة

للمؤسسات:
• إدارة المستشفى الكاملة
• وحدات متخصصة (مختبر، صيدلية، تصوير...)
• لوحات المعلومات والتحليلات
• قابلية التشغيل البيني والموصلات`,
  },
};

// ─── Asset Paths ──────────────────────────────────────────────────────────────

export const STORE_ASSETS = {
  // App Icons (required sizes)
  icons: {
    android: [
      { size: 48, density: 'mdpi', path: 'public/store-assets/android/ic_launcher_48.png' },
      { size: 72, density: 'hdpi', path: 'public/store-assets/android/ic_launcher_72.png' },
      { size: 96, density: 'xhdpi', path: 'public/store-assets/android/ic_launcher_96.png' },
      { size: 144, density: 'xxhdpi', path: 'public/store-assets/android/ic_launcher_144.png' },
      { size: 192, density: 'xxxhdpi', path: 'public/store-assets/android/ic_launcher_192.png' },
      { size: 512, density: 'play-store', path: 'public/store-assets/android/ic_launcher_512.png' },
    ],
    ios: [
      { size: 20, scale: 1, path: 'public/store-assets/ios/AppIcon-20@1x.png' },
      { size: 20, scale: 2, path: 'public/store-assets/ios/AppIcon-20@2x.png' },
      { size: 20, scale: 3, path: 'public/store-assets/ios/AppIcon-20@3x.png' },
      { size: 29, scale: 1, path: 'public/store-assets/ios/AppIcon-29@1x.png' },
      { size: 29, scale: 2, path: 'public/store-assets/ios/AppIcon-29@2x.png' },
      { size: 29, scale: 3, path: 'public/store-assets/ios/AppIcon-29@3x.png' },
      { size: 40, scale: 2, path: 'public/store-assets/ios/AppIcon-40@2x.png' },
      { size: 40, scale: 3, path: 'public/store-assets/ios/AppIcon-40@3x.png' },
      { size: 60, scale: 2, path: 'public/store-assets/ios/AppIcon-60@2x.png' },
      { size: 60, scale: 3, path: 'public/store-assets/ios/AppIcon-60@3x.png' },
      { size: 76, scale: 1, path: 'public/store-assets/ios/AppIcon-76@1x.png' },
      { size: 76, scale: 2, path: 'public/store-assets/ios/AppIcon-76@2x.png' },
      { size: 83.5, scale: 2, path: 'public/store-assets/ios/AppIcon-83.5@2x.png' },
      { size: 1024, scale: 1, path: 'public/store-assets/ios/AppIcon-1024@1x.png' },
    ],
  },

  // Screenshots (required dimensions)
  screenshots: {
    android: [
      { width: 1080, height: 1920, label: 'Phone 5.5"', count: 8 },
      { width: 1200, height: 1920, label: 'Tablet 7"', count: 4 },
      { width: 1600, height: 2560, label: 'Tablet 10"', count: 4 },
    ],
    ios: [
      { width: 1290, height: 2796, label: 'iPhone 6.7" (iPhone 15 Pro Max)', count: 10 },
      { width: 1179, height: 2556, label: 'iPhone 6.1" (iPhone 15)', count: 10 },
      { width: 1284, height: 2778, label: 'iPhone 6.5" (iPhone 14 Plus)', count: 10 },
      { width: 1242, height: 2688, label: 'iPhone 5.8" (iPhone X)', count: 10 },
      { width: 2048, height: 2732, label: 'iPad Pro 12.9"', count: 10 },
    ],
  },

  // Feature Graphic (Android only)
  featureGraphic: {
    width: 1024,
    height: 500,
    path: 'public/store-assets/android/feature_graphic.png',
  },
} as const;

// ─── Privacy & Permissions ────────────────────────────────────────────────────

export const APP_PERMISSIONS = {
  android: [
    { permission: 'INTERNET', reason: 'Required for all app functionality and data sync' },
    { permission: 'CAMERA', reason: 'For teleconsultation video calls and document scanning' },
    { permission: 'RECORD_AUDIO', reason: 'For teleconsultation audio calls' },
    { permission: 'READ_EXTERNAL_STORAGE', reason: 'For uploading medical documents' },
    { permission: 'WRITE_EXTERNAL_STORAGE', reason: 'For downloading medical documents' },
    { permission: 'RECEIVE_BOOT_COMPLETED', reason: 'For appointment reminder notifications' },
    { permission: 'VIBRATE', reason: 'For notification alerts' },
    { permission: 'USE_BIOMETRIC', reason: 'For secure biometric authentication (optional)' },
    { permission: 'USE_FINGERPRINT', reason: 'For fingerprint authentication (optional)' },
  ],
  ios: [
    { key: 'NSCameraUsageDescription', reason: 'SHIFA uses your camera for teleconsultation video calls and scanning medical documents.' },
    { key: 'NSMicrophoneUsageDescription', reason: 'SHIFA uses your microphone for teleconsultation audio calls.' },
    { key: 'NSPhotoLibraryUsageDescription', reason: 'SHIFA accesses your photo library to upload medical documents and profile photos.' },
    { key: 'NSPhotoLibraryAddUsageDescription', reason: 'SHIFA saves medical documents to your photo library.' },
    { key: 'NSFaceIDUsageDescription', reason: 'SHIFA uses Face ID for secure and convenient authentication.' },
    { key: 'NSUserNotificationsUsageDescription', reason: 'SHIFA sends appointment reminders and health notifications.' },
    { key: 'NSLocationWhenInUseUsageDescription', reason: 'SHIFA uses your location to find nearby healthcare professionals.' },
  ],
} as const;

// ─── Data Safety (Google Play) ────────────────────────────────────────────────

export const DATA_SAFETY = {
  dataCollected: [
    { type: 'Health and fitness', subtype: 'Health info', purpose: 'App functionality, Analytics', optional: false },
    { type: 'Personal info', subtype: 'Name, Email address, Phone number', purpose: 'App functionality, Account management', optional: false },
    { type: 'Personal info', subtype: 'Date of birth', purpose: 'App functionality', optional: false },
    { type: 'Photos and videos', subtype: 'Photos', purpose: 'App functionality', optional: true },
    { type: 'Audio files', subtype: 'Voice or sound recordings', purpose: 'App functionality (teleconsultation)', optional: true },
    { type: 'Location', subtype: 'Approximate location', purpose: 'App functionality (find nearby professionals)', optional: true },
    { type: 'Device or other IDs', subtype: 'Device ID', purpose: 'Analytics, Fraud prevention', optional: false },
  ],
  dataShared: [
    { type: 'Health and fitness', subtype: 'Health info', sharedWith: 'Healthcare professionals (with user consent only)' },
  ],
  securityPractices: [
    'Data is encrypted in transit using TLS 1.3',
    'Data is encrypted at rest using AES-256',
    'Users can request data deletion from the app',
    'Data is not sold to third parties',
    'Compliant with GDPR and applicable health data regulations',
  ],
} as const;

// ─── App Privacy (Apple App Store) ───────────────────────────────────────────

export const APP_PRIVACY = {
  privacyPolicyUrl: 'https://shifa1387.builtwithrocket.new/patient-privacy',
  dataTypes: [
    {
      category: 'Health & Fitness',
      types: ['Health', 'Fitness'],
      linkedToIdentity: true,
      usedForTracking: false,
      purposes: ['App Functionality', 'Analytics'],
    },
    {
      category: 'Contact Info',
      types: ['Name', 'Email Address', 'Phone Number'],
      linkedToIdentity: true,
      usedForTracking: false,
      purposes: ['App Functionality', 'Account Management'],
    },
    {
      category: 'User Content',
      types: ['Photos or Videos', 'Audio Data', 'Other User Content'],
      linkedToIdentity: true,
      usedForTracking: false,
      purposes: ['App Functionality'],
    },
    {
      category: 'Identifiers',
      types: ['User ID', 'Device ID'],
      linkedToIdentity: true,
      usedForTracking: false,
      purposes: ['App Functionality', 'Analytics'],
    },
    {
      category: 'Location',
      types: ['Coarse Location'],
      linkedToIdentity: false,
      usedForTracking: false,
      purposes: ['App Functionality'],
    },
  ],
} as const;

// ─── Age Rating ───────────────────────────────────────────────────────────────

export const AGE_RATING = {
  android: {
    contentRating: 'Everyone',
    targetAgeGroup: 'General audience (18+)',
  },
  ios: {
    ageRating: '4+',
    contentDescriptors: ['Medical/Treatment Information'],
  },
} as const;

// ─── Store Categories ─────────────────────────────────────────────────────────

export const STORE_CATEGORIES = {
  android: {
    primary: 'Medical',
    secondary: 'Health & Fitness',
  },
  ios: {
    primary: 'Medical',
    secondary: 'Health & Fitness',
  },
} as const;

// ─── Keywords ─────────────────────────────────────────────────────────────────

export const STORE_KEYWORDS = {
  fr: 'santé, dossier médical, rendez-vous médecin, téléconsultation, ordonnance, résultats labo, hôpital, patient, médecin, pharmacie',
  en: 'health, medical record, doctor appointment, teleconsultation, prescription, lab results, hospital, patient, doctor, pharmacy',
  ar: 'صحة، سجل طبي، موعد طبيب، استشارة عن بعد، وصفة طبية، نتائج مختبر، مستشفى، مريض',
} as const;

// ─── Demo Account (for App Store Review) ─────────────────────────────────────

export const DEMO_ACCOUNT = {
  note: 'Provide these credentials to Apple/Google reviewers if required',
  patient: {
    email: 'demo.patient@shifa.health',
    password: 'ShifaDemo2026#',
    role: 'patient',
  },
  professional: {
    email: 'demo.pro@shifa.health',
    password: 'ShifaDemo2026#',
    role: 'professional',
  },
} as const;

// ─── Account Deletion ─────────────────────────────────────────────────────────
// Required by both Apple and Google as of 2024

export const ACCOUNT_DELETION = {
  inAppPath: 'Mon Espace → Sécurité et confidentialité → Supprimer mon compte',
  webUrl: 'https://shifa1387.builtwithrocket.new/patient-privacy',
  description: 'Users can delete their account and all associated data directly from within the app.',
} as const;
