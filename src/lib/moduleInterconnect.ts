// ─── SHIFA MODULE INTERCONNECTION LAYER ──────────────────────────────────────
// Central registry for all inter-module data flows, permissions, and audit events.
// PRINCIPLE: Interconnected ≠ Open Access. Each exchange is scoped, auditable, and revocable.

// ─── CORE TYPES ──────────────────────────────────────────────────────────────

export type ModuleId =
  | 'consultation' | 'prescription' | 'pharmacy' | 'dispensation' |'laboratory'| 'imaging' | 'billing' | 'payment' | 'accounting' |'hospitalization'| 'emergency' | 'maternity' | 'pediatrics' |'patient-record'| 'teleconsultation' | 'care-plans' |'workforce'| 'planning' | 'training' | 'habilitation' |'inventory'| 'procurement' | 'supply-chain' |'biomedical'| 'maintenance' | 'sterilization' |'finance'| 'insurance' | 'public-health' |'patient-transfer' | 'referrals' | 'shifa-share'
  | 'shifa-academy'| 'analytics' | 'audit' |'innovation-center' | 'research' | 'marketplace' | 'ambassador' | 'offline-sync';

export type DataScope =
  | 'identity'           // Name, DOB, ID — minimal
  | 'administrative'     // Appointment, billing ref — no clinical
  | 'clinical-summary'   // Diagnosis, treatment summary — need-to-know
  | 'clinical-full'      // Full medical record — restricted
  | 'financial'          // Amounts, invoices — role-gated
  | 'hr'                 // Employee data — HR only
  | 'operational'        // Scheduling, capacity — operational roles
  | 'analytics'          // Aggregated, anonymized — reporting
  | 'public';            // Public content — no restriction

export type FlowDirection = 'push' | 'pull' | 'bidirectional' | 'event';
export type FlowMode = 'realtime' | 'batch' | 'on-demand' | 'async';
export type ConsentRequired = 'always' | 'first-time' | 'never';

export interface ModuleFlow {
  id: string;
  from: ModuleId;
  to: ModuleId;
  label: string;
  dataScope: DataScope;
  direction: FlowDirection;
  mode: FlowMode;
  consentRequired: ConsentRequired;
  auditRequired: boolean;
  description: string;
  requiredPermissions: string[];
  example?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  organization: string;
  sourceModule: ModuleId;
  targetModule: ModuleId;
  dataScope: DataScope;
  action: 'read' | 'write' | 'share' | 'transfer' | 'revoke' | 'sync';
  resourceId?: string;
  authorized: boolean;
  result: 'success' | 'denied' | 'error';
  errorMessage?: string;
}

export interface ConnectorConfig {
  id: string;
  name: string;
  module: ModuleId;
  type: ConnectorType;
  direction: 'read' | 'write' | 'bidirectional' | 'sync';
  authMethod: 'api-key' | 'oauth2' | 'mtls' | 'hmac' | 'basic';
  status: 'active' | 'inactive' | 'error' | 'pending' | 'revoked';
  scopes: string[];
  dataScope: DataScope;
  consentRequired: ConsentRequired;
  encrypted: boolean;
  retryEnabled: boolean;
  maxRetries: number;
  syncInterval?: string;
  country?: string;
  lastSync?: string;
  monitoringEnabled: boolean;
}

export type ConnectorType =
  | 'payment' | 'lis' | 'pacs-dicom' | 'insurance' | 'identity' |'vaccination-registry'| 'accounting-erp' | 'hr-system' |'his'| 'pharmacy-system' | 'public-health' | 'mobile-money' |'national-health' | 'bank' | 'sms-gateway' | 'email';

// ─── CLINICAL FLOWS ───────────────────────────────────────────────────────────

export const clinicalFlows: ModuleFlow[] = [
  {
    id: 'flow-consult-prescription',
    from: 'consultation', to: 'prescription',
    label: 'Consultation → Prescription',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Le médecin génère une prescription depuis la consultation.',
    requiredPermissions: ['consultation.write', 'prescription.create'],
    example: 'Dr. Sy rédige une ordonnance après consultation de Aïcha Diallo',
  },
  {
    id: 'flow-prescription-pharmacy',
    from: 'prescription', to: 'pharmacy',
    label: 'Prescription → Pharmacie',
    dataScope: 'administrative',
    direction: 'push', mode: 'on-demand',
    consentRequired: 'first-time', auditRequired: true,
    description: 'La prescription autorisée est transmise à la pharmacie. Le pharmacien ne reçoit PAS le dossier médical complet.',
    requiredPermissions: ['prescription.share', 'pharmacy.receive'],
    example: 'Ordonnance transmise à la pharmacie — sans les notes cliniques',
  },
  {
    id: 'flow-pharmacy-billing',
    from: 'pharmacy', to: 'billing',
    label: 'Pharmacie → Facturation',
    dataScope: 'financial',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'La dispensation génère automatiquement une ligne de facturation.',
    requiredPermissions: ['pharmacy.dispense', 'billing.create'],
  },
  {
    id: 'flow-lab-request',
    from: 'consultation', to: 'laboratory',
    label: 'Consultation → Demande Labo',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Le médecin prescrit des analyses depuis la consultation.',
    requiredPermissions: ['consultation.write', 'laboratory.request'],
  },
  {
    id: 'flow-lab-result-record',
    from: 'laboratory', to: 'patient-record',
    label: 'Résultat Labo → Dossier Patient',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'Les résultats validés sont versés au dossier patient.',
    requiredPermissions: ['laboratory.validate', 'patient-record.write'],
  },
  {
    id: 'flow-lab-result-doctor',
    from: 'laboratory', to: 'consultation',
    label: 'Résultat Labo → Médecin',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'Notification au médecin prescripteur avec les résultats.',
    requiredPermissions: ['laboratory.validate', 'consultation.read'],
  },
  {
    id: 'flow-imaging-request',
    from: 'consultation', to: 'imaging',
    label: 'Consultation → Imagerie',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Demande d\'examen d\'imagerie depuis la consultation.',
    requiredPermissions: ['consultation.write', 'imaging.request'],
  },
  {
    id: 'flow-imaging-record',
    from: 'imaging', to: 'patient-record',
    label: 'Compte rendu imagerie → Dossier',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'Le compte rendu validé est versé au dossier patient.',
    requiredPermissions: ['imaging.validate', 'patient-record.write'],
  },
  {
    id: 'flow-emergency-hospitalization',
    from: 'emergency', to: 'hospitalization',
    label: 'Urgences → Hospitalisation',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Admission depuis les urgences vers un service d\'hospitalisation.',
    requiredPermissions: ['emergency.admit', 'hospitalization.create'],
  },
];

// ─── FINANCIAL FLOWS ──────────────────────────────────────────────────────────

export const financialFlows: ModuleFlow[] = [
  {
    id: 'flow-act-billing',
    from: 'consultation', to: 'billing',
    label: 'Acte médical → Facturation',
    dataScope: 'financial',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Chaque acte médical génère une ligne de facturation.',
    requiredPermissions: ['consultation.write', 'billing.create'],
  },
  {
    id: 'flow-billing-payment',
    from: 'billing', to: 'payment',
    label: 'Facture → Paiement',
    dataScope: 'financial',
    direction: 'push', mode: 'on-demand',
    consentRequired: 'never', auditRequired: true,
    description: 'La facture validée est transmise au module paiement.',
    requiredPermissions: ['billing.validate', 'payment.create'],
  },
  {
    id: 'flow-payment-accounting',
    from: 'payment', to: 'accounting',
    label: 'Paiement → Comptabilité',
    dataScope: 'financial',
    direction: 'push', mode: 'batch',
    consentRequired: 'never', auditRequired: true,
    description: 'Les paiements validés alimentent la comptabilité. Le comptable ne voit pas les notes cliniques.',
    requiredPermissions: ['payment.validate', 'accounting.write'],
  },
  {
    id: 'flow-procurement-stock',
    from: 'procurement', to: 'inventory',
    label: 'Achat → Stock',
    dataScope: 'operational',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'La réception d\'une commande met à jour le stock.',
    requiredPermissions: ['procurement.receive', 'inventory.write'],
  },
  {
    id: 'flow-stock-finance',
    from: 'inventory', to: 'finance',
    label: 'Stock → Finance',
    dataScope: 'financial',
    direction: 'push', mode: 'batch',
    consentRequired: 'never', auditRequired: true,
    description: 'La valorisation du stock alimente les états financiers.',
    requiredPermissions: ['inventory.read', 'finance.write'],
  },
];

// ─── WORKFORCE FLOWS ──────────────────────────────────────────────────────────

export const workforceFlows: ModuleFlow[] = [
  {
    id: 'flow-habilitation-module',
    from: 'habilitation', to: 'consultation',
    label: 'Habilitation → Accès Module',
    dataScope: 'hr',
    direction: 'event', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Une habilitation expirée peut suspendre l\'accès au module concerné.',
    requiredPermissions: ['habilitation.manage', 'module.access-control'],
    example: 'Habilitation radioprotection expirée → accès imagerie suspendu',
  },
  {
    id: 'flow-training-habilitation',
    from: 'training', to: 'habilitation',
    label: 'Formation → Habilitation',
    dataScope: 'hr',
    direction: 'push', mode: 'on-demand',
    consentRequired: 'never', auditRequired: true,
    description: 'La validation d\'une formation renouvelle l\'habilitation correspondante.',
    requiredPermissions: ['training.validate', 'habilitation.update'],
  },
  {
    id: 'flow-workforce-planning',
    from: 'workforce', to: 'planning',
    label: 'Workforce → Planning',
    dataScope: 'operational',
    direction: 'bidirectional', mode: 'realtime',
    consentRequired: 'never', auditRequired: false,
    description: 'Les données RH alimentent le planning (contrats, disponibilités, congés).',
    requiredPermissions: ['workforce.read', 'planning.write'],
  },
  {
    id: 'flow-offboarding-access',
    from: 'workforce', to: 'consultation',
    label: 'Offboarding → Révocation accès',
    dataScope: 'hr',
    direction: 'event', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Le départ d\'un employé révoque ses permissions organisationnelles. Son compte SHIFA est conservé.',
    requiredPermissions: ['workforce.offboard', 'module.revoke-access'],
    example: 'Dr. Sy quitte le CHU → accès CHU révoqué, compte SHIFA conservé',
  },
  {
    id: 'flow-academy-workforce',
    from: 'shifa-academy', to: 'workforce',
    label: 'Academy → Mise à jour habilitation',
    dataScope: 'hr',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'La validation d\'une certification Academy met à jour les habilitations dans Workforce.',
    requiredPermissions: ['academy.certify', 'workforce.habilitation.update'],
    example: 'Certification ACLS validée → habilitation réanimation renouvelée → accès ICU maintenu',
  },
];

// ─── TRANSFER FLOWS (COMPLETE) ────────────────────────────────────────────────

export const transferFlows: ModuleFlow[] = [
  {
    id: 'flow-transfer-identity',
    from: 'patient-transfer', to: 'patient-record',
    label: 'Transfert → Données sélectionnées',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'on-demand',
    consentRequired: 'always', auditRequired: true,
    description: 'Seules les données nécessaires au transfert sont partagées. Pas le dossier complet.',
    requiredPermissions: ['patient-transfer.create', 'patient-record.share'],
    example: 'Transfert Urgences → Chirurgie : constantes + biologie + imagerie récente',
  },
  {
    id: 'flow-transfer-authorization',
    from: 'patient-transfer', to: 'audit',
    label: 'Transfert → Autorisation médicale',
    dataScope: 'administrative',
    direction: 'event', mode: 'realtime',
    consentRequired: 'always', auditRequired: true,
    description: 'Chaque transfert doit être autorisé par un médecin habilité avant exécution.',
    requiredPermissions: ['patient-transfer.authorize', 'audit.write'],
    example: 'Chef de service valide le transfert → événement d\'autorisation tracé',
  },
  {
    id: 'flow-transfer-acceptance',
    from: 'patient-transfer', to: 'hospitalization',
    label: 'Transfert → Acceptation établissement destinataire',
    dataScope: 'administrative',
    direction: 'bidirectional', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'L\'établissement destinataire doit confirmer sa capacité d\'accueil avant le transfert.',
    requiredPermissions: ['patient-transfer.accept', 'hospitalization.create'],
    example: 'CHU Cocody confirme disponibilité lit → transfert autorisé',
  },
  {
    id: 'flow-transfer-billing',
    from: 'patient-transfer', to: 'billing',
    label: 'Transfert → Facturation transport',
    dataScope: 'financial',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: true,
    description: 'Les frais de transport et de transfert sont transmis au module facturation.',
    requiredPermissions: ['patient-transfer.complete', 'billing.create'],
  },
  {
    id: 'flow-transfer-insurance',
    from: 'patient-transfer', to: 'insurance',
    label: 'Transfert → Prise en charge assurance',
    dataScope: 'administrative',
    direction: 'push', mode: 'on-demand',
    consentRequired: 'first-time', auditRequired: true,
    description: 'Vérification de la couverture assurance pour le transfert et le transport.',
    requiredPermissions: ['patient-transfer.create', 'insurance.eligibility.check'],
  },
  {
    id: 'flow-transfer-emergency',
    from: 'emergency', to: 'patient-transfer',
    label: 'Urgences → Demande de transfert',
    dataScope: 'clinical-summary',
    direction: 'push', mode: 'realtime',
    consentRequired: 'always', auditRequired: true,
    description: 'Les urgences peuvent initier un transfert vers un autre service ou établissement.',
    requiredPermissions: ['emergency.transfer.request', 'patient-transfer.create'],
    example: 'Patient AVC aux urgences → transfert vers neurologie CHU',
  },
];

// ─── INNOVATION / RESEARCH / ECOSYSTEM FLOWS ─────────────────────────────────

export const ecosystemFlows: ModuleFlow[] = [
  {
    id: 'flow-innovation-research',
    from: 'innovation-center', to: 'research',
    label: 'Innovation → Recherche',
    dataScope: 'public',
    direction: 'bidirectional', mode: 'on-demand',
    consentRequired: 'never', auditRequired: false,
    description: 'Les projets d\'innovation peuvent être liés à des protocoles de recherche.',
    requiredPermissions: ['innovation.manage', 'research.read'],
  },
  {
    id: 'flow-research-academy',
    from: 'research', to: 'shifa-academy',
    label: 'Recherche → Academy (publications)',
    dataScope: 'public',
    direction: 'push', mode: 'async',
    consentRequired: 'never', auditRequired: false,
    description: 'Les résultats de recherche peuvent alimenter le catalogue Academy.',
    requiredPermissions: ['research.publish', 'academy.content.create'],
  },
  {
    id: 'flow-marketplace-supply',
    from: 'marketplace', to: 'supply-chain',
    label: 'Marketplace → Supply Chain',
    dataScope: 'operational',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Une commande Marketplace déclenche le workflow Supply Chain.',
    requiredPermissions: ['marketplace.order', 'supply-chain.create'],
  },
  {
    id: 'flow-marketplace-finance',
    from: 'marketplace', to: 'finance',
    label: 'Marketplace → Finance',
    dataScope: 'financial',
    direction: 'push', mode: 'realtime',
    consentRequired: 'never', auditRequired: true,
    description: 'Les transactions Marketplace alimentent la comptabilité.',
    requiredPermissions: ['marketplace.transact', 'finance.write'],
  },
];

// ─── OFFLINE SYNC QUEUE TYPES ─────────────────────────────────────────────────

export type SyncOperationType =
  | 'consultation.create' | 'consultation.update' |'prescription.create' |'vitals.record' |'patient-transfer.create'| 'patient-transfer.update' |'lab-result.receive' |'billing.create' |'appointment.create'| 'appointment.update' |'document.upload';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'conflict' | 'error' | 'deferred';

export interface SyncQueueItem {
  id: string;                    // UUID unique — generated offline
  operationType: SyncOperationType;
  moduleId: ModuleId;
  payload: Record<string, unknown>;
  patientId?: string;
  organizationId?: string;
  createdAt: string;             // ISO timestamp (local device time)
  attemptCount: number;
  maxAttempts: number;
  status: SyncStatus;
  conflictResolution?: 'server-wins' | 'client-wins' | 'manual';
  encryptedLocally: boolean;
  priority: 'critical' | 'high' | 'normal';
  errorMessage?: string;
  syncedAt?: string;
}

export interface SyncConflict {
  id: string;
  queueItemId: string;
  serverVersion: Record<string, unknown>;
  clientVersion: Record<string, unknown>;
  field: string;
  detectedAt: string;
  resolvedAt?: string;
  resolution?: 'server-wins' | 'client-wins' | 'merged' | 'manual';
  resolvedBy?: string;
}

// ─── REAL-TIME EVENT BUS ──────────────────────────────────────────────────────

export type ShifaEventType =
  | 'transfer.created' | 'transfer.authorized' | 'transfer.accepted' | 'transfer.in-transit' | 'transfer.received' | 'transfer.cancelled' |'lab-result.ready'| 'lab-result.validated' |'prescription.created'| 'prescription.dispensed' |'habilitation.expired'| 'habilitation.renewed' |'sync.conflict' | 'sync.completed' | 'sync.error'
  | 'module.access-revoked'| 'module.access-granted' |'patient.admitted' | 'patient.discharged';

export interface ShifaEvent {
  id: string;
  type: ShifaEventType;
  sourceModule: ModuleId;
  targetModules: ModuleId[];
  payload: Record<string, unknown>;
  timestamp: string;
  organizationId: string;
  userId: string;
  patientId?: string;
  requiresAck: boolean;
  acknowledged?: boolean;
}

// ─── ALL FLOWS ────────────────────────────────────────────────────────────────

export const allFlows: ModuleFlow[] = [
  ...clinicalFlows,
  ...financialFlows,
  ...workforceFlows,
  ...transferFlows,
  ...ecosystemFlows,
];

// ─── CONNECTOR FRAMEWORK ─────────────────────────────────────────────────────

export const connectorRegistry: ConnectorConfig[] = [
  {
    id: 'conn-stripe', name: 'Stripe Payments', module: 'payment',
    type: 'payment', direction: 'bidirectional', authMethod: 'api-key',
    status: 'active', scopes: ['payment.create', 'payment.read', 'refund.create'],
    dataScope: 'financial', consentRequired: 'first-time',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'Global', monitoringEnabled: true,
  },
  {
    id: 'conn-orange-money', name: 'Orange Money', module: 'payment',
    type: 'mobile-money', direction: 'bidirectional', authMethod: 'oauth2',
    status: 'active', scopes: ['payment.create', 'payment.status'],
    dataScope: 'financial', consentRequired: 'first-time',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'Afrique de l\'Ouest', monitoringEnabled: true,
  },
  {
    id: 'conn-lis', name: 'LIS Externe (Biomnis)', module: 'laboratory',
    type: 'lis', direction: 'bidirectional', authMethod: 'mtls',
    status: 'active', scopes: ['order.send', 'result.receive'],
    dataScope: 'clinical-summary', consentRequired: 'never',
    encrypted: true, retryEnabled: true, maxRetries: 5,
    country: 'France', monitoringEnabled: true,
  },
  {
    id: 'conn-pacs', name: 'PACS/DICOM (Carestream)', module: 'imaging',
    type: 'pacs-dicom', direction: 'bidirectional', authMethod: 'mtls',
    status: 'active', scopes: ['study.send', 'study.retrieve', 'worklist.query'],
    dataScope: 'clinical-summary', consentRequired: 'never',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'Global', monitoringEnabled: true,
  },
  {
    id: 'conn-insurance', name: 'Assurance CNAM', module: 'insurance',
    type: 'insurance', direction: 'bidirectional', authMethod: 'oauth2',
    status: 'active', scopes: ['eligibility.check', 'claim.submit', 'claim.status'],
    dataScope: 'administrative', consentRequired: 'first-time',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'Tunisie', monitoringEnabled: true,
  },
  {
    id: 'conn-identity', name: 'Identité Nationale (CNI)', module: 'patient-record',
    type: 'identity', direction: 'read', authMethod: 'oauth2',
    status: 'pending', scopes: ['identity.verify'],
    dataScope: 'identity', consentRequired: 'always',
    encrypted: true, retryEnabled: false, maxRetries: 1,
    country: 'Sénégal', monitoringEnabled: true,
  },
  {
    id: 'conn-vaccination', name: 'Registre Vaccination OMS', module: 'patient-record',
    type: 'vaccination-registry', direction: 'bidirectional', authMethod: 'api-key',
    status: 'inactive', scopes: ['vaccination.read', 'vaccination.write'],
    dataScope: 'clinical-summary', consentRequired: 'always',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'Global', monitoringEnabled: false,
  },
  {
    id: 'conn-accounting', name: 'Sage Comptabilité', module: 'accounting',
    type: 'accounting-erp', direction: 'write', authMethod: 'api-key',
    status: 'error', scopes: ['journal.write', 'invoice.export'],
    dataScope: 'financial', consentRequired: 'never',
    encrypted: true, retryEnabled: true, maxRetries: 3,
    country: 'France', monitoringEnabled: true,
  },
];

// ─── SHIFA SHARE TYPES ────────────────────────────────────────────────────────

export type ShareContext =
  | 'internal'          // Partage interne SHIFA (entre modules/utilisateurs)
  | 'professional'      // Avec un professionnel de santé
  | 'facility'          // Avec un établissement
  | 'institution'       // Avec une institution autorisée
  | 'external-system'   // Avec un système externe
  | 'public'            // Contenu public
  | 'social';           // Réseaux sociaux (contenu public uniquement)

export type SharePermission = 'view' | 'download' | 'print' | 'forward' | 'edit';

export interface ShareRequest {
  id: string;
  createdBy: string;
  resourceType: ShareResourceType;
  resourceId: string;
  resourceLabel: string;
  context: ShareContext;
  recipientId?: string;
  recipientLabel?: string;
  permissions: SharePermission[];
  expiresAt?: string;
  consentGiven: boolean;
  status: 'active' | 'expired' | 'revoked' | 'pending-consent';
  auditLog: ShareAuditEntry[];
  isMedical: boolean;  // NEVER allow social share if true
}

export type ShareResourceType =
  | 'patient-record' | 'consultation' | 'prescription' | 'lab-result' |'imaging' | 'document' | 'certificate'
  | 'article'| 'campaign' | 'event' | 'training' | 'professional-profile' |'facility-profile' | 'marketplace-item';

export interface ShareAuditEntry {
  timestamp: string;
  action: 'created' | 'viewed' | 'downloaded' | 'revoked' | 'expired';
  actor: string;
  ip?: string;
}

// ─── PERMISSION MATRIX ────────────────────────────────────────────────────────

export const SOCIAL_SHARE_FORBIDDEN_TYPES: ShareResourceType[] = [
  'patient-record', 'consultation', 'prescription', 'lab-result', 'imaging', 'document', 'certificate',
];

export const isSocialShareAllowed = (resourceType: ShareResourceType): boolean => {
  return !SOCIAL_SHARE_FORBIDDEN_TYPES.includes(resourceType);
};

// ─── NEED-TO-KNOW MATRIX ─────────────────────────────────────────────────────
// Defines what data scope each role can receive from each module

export const needToKnowMatrix: Record<string, Record<ModuleId, DataScope[]>> = {
  pharmacist: {
    prescription: ['administrative', 'clinical-summary'],
    'patient-record': ['identity'],  // Name only, no clinical notes
    billing: ['financial'],
    pharmacy: ['operational', 'financial'],
  } as Record<ModuleId, DataScope[]>,
  accountant: {
    billing: ['financial'],
    payment: ['financial'],
    accounting: ['financial'],
    'patient-record': [],  // No access to clinical data
    consultation: [],
  } as Record<ModuleId, DataScope[]>,
  'hr-manager': {
    workforce: ['hr', 'operational'],
    planning: ['operational'],
    training: ['hr', 'operational'],
    habilitation: ['hr'],
    'patient-record': [],  // No access to employee medical records
  } as Record<ModuleId, DataScope[]>,
  radiologist: {
    imaging: ['clinical-full'],
    'patient-record': ['clinical-summary', 'identity'],
    consultation: ['clinical-summary'],
    laboratory: ['clinical-summary'],
  } as Record<ModuleId, DataScope[]>,
  'lab-technician': {
    laboratory: ['clinical-summary', 'operational'],
    'patient-record': ['identity', 'clinical-summary'],  // Only what's needed for the analysis
    consultation: [],  // No access to full clinical notes
    billing: ['financial'],
  } as Record<ModuleId, DataScope[]>,
  ambassador: {
    // Ambassadors have ZERO access to any medical data
    'patient-record': [],
    consultation: [],
    prescription: [],
    laboratory: [],
    imaging: [],
  } as Record<ModuleId, DataScope[]>,
};

// ─── TRANSFER WORKFLOW STATE MACHINE ─────────────────────────────────────────

export type TransferState =
  | 'draft' |'pending-consent' |'consent-given' |'pending-authorization' |'authorized' |'pending-acceptance' |'accepted' |'preparing' |'in-transit' |'received' |'completed' |'cancelled' |'rejected';

export interface TransferStateTransition {
  from: TransferState;
  to: TransferState;
  requiredRole: string;
  requiredPermission: string;
  auditAction: string;
  notifyModules: ModuleId[];
}

export const transferStateMachine: TransferStateTransition[] = [
  { from: 'draft', to: 'pending-consent', requiredRole: 'physician', requiredPermission: 'patient-transfer.create', auditAction: 'transfer.created', notifyModules: ['patient-record'] },
  { from: 'pending-consent', to: 'consent-given', requiredRole: 'patient|nurse', requiredPermission: 'patient-transfer.consent', auditAction: 'transfer.consent-given', notifyModules: ['audit'] },
  { from: 'consent-given', to: 'pending-authorization', requiredRole: 'physician', requiredPermission: 'patient-transfer.submit', auditAction: 'transfer.submitted', notifyModules: ['audit'] },
  { from: 'pending-authorization', to: 'authorized', requiredRole: 'department-head|medical-director', requiredPermission: 'patient-transfer.authorize', auditAction: 'transfer.authorized', notifyModules: ['audit', 'patient-record'] },
  { from: 'authorized', to: 'pending-acceptance', requiredRole: 'system', requiredPermission: 'patient-transfer.notify-destination', auditAction: 'transfer.destination-notified', notifyModules: ['hospitalization'] },
  { from: 'pending-acceptance', to: 'accepted', requiredRole: 'destination-physician', requiredPermission: 'patient-transfer.accept', auditAction: 'transfer.accepted', notifyModules: ['audit', 'billing'] },
  { from: 'accepted', to: 'preparing', requiredRole: 'nurse|coordinator', requiredPermission: 'patient-transfer.prepare', auditAction: 'transfer.preparing', notifyModules: [] },
  { from: 'preparing', to: 'in-transit', requiredRole: 'nurse|coordinator', requiredPermission: 'patient-transfer.dispatch', auditAction: 'transfer.in-transit', notifyModules: ['audit'] },
  { from: 'in-transit', to: 'received', requiredRole: 'destination-nurse|destination-physician', requiredPermission: 'patient-transfer.receive', auditAction: 'transfer.received', notifyModules: ['audit', 'hospitalization', 'billing'] },
  { from: 'received', to: 'completed', requiredRole: 'system', requiredPermission: 'patient-transfer.complete', auditAction: 'transfer.completed', notifyModules: ['patient-record', 'billing', 'audit'] },
  { from: 'pending-authorization', to: 'cancelled', requiredRole: 'physician|department-head', requiredPermission: 'patient-transfer.cancel', auditAction: 'transfer.cancelled', notifyModules: ['audit'] },
  { from: 'pending-acceptance', to: 'rejected', requiredRole: 'destination-physician', requiredPermission: 'patient-transfer.reject', auditAction: 'transfer.rejected', notifyModules: ['audit', 'patient-record'] },
];

// ─── UTILITY FUNCTIONS ────────────────────────────────────────────────────────

export const getFlowsForModule = (moduleId: ModuleId): ModuleFlow[] =>
  allFlows.filter(f => f.from === moduleId || f.to === moduleId);

export const getOutboundFlows = (moduleId: ModuleId): ModuleFlow[] =>
  allFlows.filter(f => f.from === moduleId);

export const getInboundFlows = (moduleId: ModuleId): ModuleFlow[] =>
  allFlows.filter(f => f.to === moduleId);

export const getConnectorsForModule = (moduleId: ModuleId): ConnectorConfig[] =>
  connectorRegistry.filter(c => c.module === moduleId);

export const getTransferTransitions = (currentState: TransferState): TransferStateTransition[] =>
  transferStateMachine.filter(t => t.from === currentState);

export const canRolePerformTransition = (
  role: string,
  transition: TransferStateTransition
): boolean => transition.requiredRole.split('|').includes(role);
