'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'new' | 'active' | 'history' | 'protocol' | 'audit';

interface Transfer {
  id: string;
  patientName: string;
  patientId: string;
  from: string;
  to: string;
  type: 'inter-service' | 'inter-facility' | 'inter-region' | 'international';
  status: 'pending' | 'authorized' | 'in-transit' | 'received' | 'cancelled';
  urgency: 'routine' | 'urgent' | 'critical';
  reason: string;
  requestedAt: string;
  authorizedBy?: string;
  documents: string[];
}

interface AuditEvent {
  id: string;
  transferId: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  module: string;
  data: string;
  ip: string;
  result: 'success' | 'warning' | 'error';
}

const mockTransfers: Transfer[] = [
  {
    id: 'TRF-2025-001',
    patientName: 'Aïcha Diallo',
    patientId: 'SH-2-SN-2025-7K4D',
    from: 'Urgences — CHU Saint-Louis',
    to: 'Radiologie — CHU Saint-Louis',
    type: 'inter-service',
    status: 'authorized',
    urgency: 'urgent',
    reason: 'Scanner cérébral urgent — suspicion AVC',
    requestedAt: '2025-08-12 09:14',
    authorizedBy: 'Dr. Mohamed Sy',
    documents: ['Bilan initial', 'Constantes', 'ECG'],
  },
  {
    id: 'TRF-2025-002',
    patientName: 'Mamadou Koné',
    patientId: 'SH-1-CI-2025-3P9X',
    from: 'Clinique Pasteur — Abidjan',
    to: 'CHU de Cocody — Abidjan',
    type: 'inter-facility',
    status: 'in-transit',
    urgency: 'critical',
    reason: 'Chirurgie cardiaque — plateau technique insuffisant',
    requestedAt: '2025-08-12 07:30',
    authorizedBy: 'Dr. Fatou Traoré',
    documents: ['Dossier complet', 'Imagerie', 'Biologie', 'Prescriptions'],
  },
  {
    id: 'TRF-2025-003',
    patientName: 'Zara Abdou',
    patientId: 'SH-3-KM-2025-8R2T',
    from: 'Hôpital de Moroni — Comores',
    to: 'CHU de La Réunion — France',
    type: 'international',
    status: 'pending',
    urgency: 'urgent',
    reason: 'Greffe rénale — liste d\'attente internationale',
    requestedAt: '2025-08-11 16:45',
    documents: ['Dossier médical', 'Bilan pré-greffe', 'Consentement'],
  },
  {
    id: 'TRF-2025-004',
    patientName: 'Ibrahim Tall',
    patientId: 'SH-2-SN-2025-5M1K',
    from: 'Centre de Santé de Ziguinchor',
    to: 'CHU de Dakar',
    type: 'inter-region',
    status: 'received',
    urgency: 'routine',
    reason: 'Suivi spécialisé — oncologie',
    requestedAt: '2025-08-10 11:00',
    authorizedBy: 'Dr. Aminata Ndiaye',
    documents: ['Compte-rendu', 'Biopsie', 'Imagerie'],
  },
];

const auditEvents: AuditEvent[] = [
  { id: 'AUD-001', transferId: 'TRF-2025-002', action: 'Transfert créé', actor: 'Dr. Fatou Traoré', role: 'Médecin', timestamp: '2025-08-12 07:30:14', module: 'Patient Transfer', data: 'Mamadou Koné → CHU Cocody', ip: '192.168.1.45', result: 'success' },
  { id: 'AUD-002', transferId: 'TRF-2025-002', action: 'Données sélectionnées', actor: 'Dr. Fatou Traoré', role: 'Médecin', timestamp: '2025-08-12 07:31:02', module: 'Patient Transfer', data: '4 catégories de données sélectionnées (minimisation)', ip: '192.168.1.45', result: 'success' },
  { id: 'AUD-003', transferId: 'TRF-2025-002', action: 'Consentement patient recueilli', actor: 'Inf. Aminata Sow', role: 'Infirmier', timestamp: '2025-08-12 07:35:20', module: 'Patient Transfer', data: 'Consentement signé — Mamadou Koné', ip: '192.168.1.52', result: 'success' },
  { id: 'AUD-004', transferId: 'TRF-2025-002', action: 'Autorisation médicale accordée', actor: 'Dr. Moussa Diop', role: 'Chef de service', timestamp: '2025-08-12 07:42:08', module: 'Patient Transfer', data: 'Validation chef de service Urgences', ip: '192.168.1.12', result: 'success' },
  { id: 'AUD-005', transferId: 'TRF-2025-002', action: 'Dossier chiffré et transmis', actor: 'Système SHIFA', role: 'Automatique', timestamp: '2025-08-12 07:43:00', module: 'Integration Layer', data: 'Chiffrement AES-256 — Transmission sécurisée SHIFA', ip: 'SYSTEM', result: 'success' },
  { id: 'AUD-006', transferId: 'TRF-2025-002', action: 'Réception confirmée par CHU Cocody', actor: 'Dr. Kofi Asante', role: 'Médecin destinataire', timestamp: '2025-08-12 08:15:33', module: 'Patient Transfer', data: 'Accusé de réception — CHU de Cocody', ip: '10.0.2.88', result: 'success' },
  { id: 'AUD-007', transferId: 'TRF-2025-001', action: 'Transfert créé', actor: 'Dr. Mohamed Sy', role: 'Médecin', timestamp: '2025-08-12 09:14:00', module: 'Patient Transfer', data: 'Aïcha Diallo → Radiologie', ip: '192.168.1.30', result: 'success' },
  { id: 'AUD-008', transferId: 'TRF-2025-003', action: 'Tentative de transfert sans consentement', actor: 'Admin. Système', role: 'Administrateur', timestamp: '2025-08-11 16:50:00', module: 'Patient Transfer', data: 'Consentement manquant — transfert bloqué', ip: '192.168.1.99', result: 'warning' },
  { id: 'AUD-009', transferId: 'TRF-2025-003', action: 'Consentement ajouté', actor: 'Dr. Hamid Abdou', role: 'Médecin', timestamp: '2025-08-11 17:05:00', module: 'Patient Transfer', data: 'Consentement recueilli — Zara Abdou', ip: '192.168.1.30', result: 'success' },
];

const typeConfig: Record<Transfer['type'], { label: string; color: string; bg: string }> = {
  'inter-service': { label: 'Inter-service', color: '#2563eb', bg: '#dbeafe' },
  'inter-facility': { label: 'Inter-établissement', color: '#7c3aed', bg: '#ede9fe' },
  'inter-region': { label: 'Inter-région', color: '#0891b2', bg: '#cffafe' },
  'international': { label: 'International', color: '#dc2626', bg: '#fee2e2' },
};

const statusConfig: Record<Transfer['status'], { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
  authorized: { label: 'Autorisé', color: '#059669', bg: '#d1fae5', icon: 'CheckCircleIcon' },
  'in-transit': { label: 'En transit', color: '#2563eb', bg: '#dbeafe', icon: 'TruckIcon' },
  received: { label: 'Reçu', color: '#16a34a', bg: '#dcfce7', icon: 'CheckBadgeIcon' },
  cancelled: { label: 'Annulé', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
};

const urgencyConfig: Record<Transfer['urgency'], { label: string; color: string }> = {
  routine: { label: 'Routine', color: '#64748b' },
  urgent: { label: 'Urgent', color: '#d97706' },
  critical: { label: 'Critique', color: '#dc2626' },
};

const dataCategories = [
  { id: 'identity', label: 'Identité du patient', icon: 'IdentificationIcon', required: true },
  { id: 'reason', label: 'Motif & diagnostic', icon: 'ClipboardDocumentListIcon', required: true },
  { id: 'vitals', label: 'Constantes vitales', icon: 'HeartIcon', required: false },
  { id: 'prescriptions', label: 'Prescriptions en cours', icon: 'DocumentCheckIcon', required: false },
  { id: 'results', label: 'Résultats biologiques', icon: 'BeakerIcon', required: false },
  { id: 'imaging', label: 'Imagerie médicale', icon: 'PhotoIcon', required: false },
  { id: 'documents', label: 'Documents médicaux', icon: 'FolderOpenIcon', required: false },
  { id: 'transport', label: 'Informations de transport', icon: 'TruckIcon', required: false },
];

const auditResultConfig = {
  success: { color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon', label: 'Succès' },
  warning: { color: '#d97706', bg: '#fef3c7', icon: 'ExclamationTriangleIcon', label: 'Avertissement' },
  error: { color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon', label: 'Erreur' },
};

export default function PatientTransferContent() {
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['identity', 'reason']);
  const [transferType, setTransferType] = useState<Transfer['type']>('inter-service');
  const [urgency, setUrgency] = useState<Transfer['urgency']>('routine');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  const toggleCategory = (id: string) => {
    const cat = dataCategories.find(c => c.id === id);
    if (cat?.required) return;
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredTransfers = filterStatus === 'all'
    ? mockTransfers
    : mockTransfers.filter(t => t.status === filterStatus);

  const filteredAudit = auditFilter === 'all'
    ? auditEvents
    : auditEvents.filter(e => e.result === auditFilter);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'new', label: 'Nouveau transfert', icon: 'PlusCircleIcon' },
    { id: 'active', label: 'Transferts actifs', icon: 'ArrowsRightLeftIcon' },
    { id: 'history', label: 'Historique', icon: 'ClockIcon' },
    { id: 'protocol', label: 'Protocoles', icon: 'ShieldCheckIcon' },
    { id: 'audit', label: 'Audit & Traçabilité', icon: 'ClipboardDocumentListIcon' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            Transfert Patient
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Transfert sécurisé inter-service · inter-établissement · inter-région · international
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
          <Icon name="ShieldCheckIcon" size={14} />
          Autorisé · Documenté · Traçable · Sécurisé
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'En attente', value: '3', icon: 'ClockIcon', color: '#d97706', bg: '#fef3c7' },
          { label: 'En transit', value: '1', icon: 'TruckIcon', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Reçus (7j)', value: '12', icon: 'CheckBadgeIcon', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Internationaux', value: '2', icon: 'GlobeAltIcon', color: '#7c3aed', bg: '#ede9fe' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: New Transfer */}
      {activeTab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>Informations du transfert</h2>

              {/* Patient search */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Patient</label>
                <div className="relative">
                  <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, SHIFA ID..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              {/* Transfer type */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Type de transfert</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(typeConfig) as [Transfer['type'], typeof typeConfig[Transfer['type']]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setTransferType(key)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all"
                      style={{
                        backgroundColor: transferType === key ? cfg.bg : 'var(--background)',
                        borderColor: transferType === key ? cfg.color : 'var(--border)',
                        color: transferType === key ? cfg.color : 'var(--muted-foreground)',
                      }}
                    >
                      <Icon name="ArrowsRightLeftIcon" size={14} />
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Service / Établissement d'origine</label>
                  <input
                    type="text"
                    placeholder="Ex: Urgences — CHU Saint-Louis"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Service / Établissement destinataire</label>
                  <input
                    type="text"
                    placeholder="Ex: Radiologie — CHU Saint-Louis"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Niveau d'urgence</label>
                <div className="flex gap-2">
                  {(Object.entries(urgencyConfig) as [Transfer['urgency'], typeof urgencyConfig[Transfer['urgency']]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setUrgency(key)}
                      className="flex-1 py-2 rounded-lg border text-sm font-medium transition-all"
                      style={{
                        backgroundColor: urgency === key ? cfg.color + '20' : 'var(--background)',
                        borderColor: urgency === key ? cfg.color : 'var(--border)',
                        color: urgency === key ? cfg.color : 'var(--muted-foreground)',
                      }}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Motif du transfert</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez le motif clinique du transfert..."
                  className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </div>

              {/* Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Mode de transport</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <option>Ambulance médicalisée</option>
                    <option>Ambulance simple</option>
                    <option>Hélicoptère SMUR</option>
                    <option>Transport sanitaire aérien</option>
                    <option>Véhicule personnel</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Date / heure prévue</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            {/* Data categories */}
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="ShieldCheckIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />
                <h2 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>Données transmises</h2>
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                  Principe de minimisation — transmettez uniquement le nécessaire
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dataCategories.map(cat => {
                  const selected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all text-left"
                      style={{
                        backgroundColor: selected ? '#dbeafe' : 'var(--background)',
                        borderColor: selected ? '#2563eb' : 'var(--border)',
                        color: selected ? '#1d4ed8' : 'var(--muted-foreground)',
                        cursor: cat.required ? 'default' : 'pointer',
                      }}
                    >
                      <Icon name={cat.icon as any} size={16} />
                      <span className="flex-1">{cat.label}</span>
                      {cat.required && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Obligatoire</span>
                      )}
                      {!cat.required && selected && <Icon name="CheckCircleIcon" size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Traceability confirmation */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="ClipboardDocumentListIcon" size={16} style={{ color: 'var(--shifa-blue)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Traçabilité automatique</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Horodatage SHIFA', icon: 'ClockIcon', active: true },
                  { label: 'Identifiant unique', icon: 'FingerPrintIcon', active: true },
                  { label: 'Chiffrement AES-256', icon: 'LockClosedIcon', active: true },
                  { label: 'Journal d\'audit', icon: 'DocumentTextIcon', active: true },
                  { label: 'Notification patient', icon: 'BellIcon', active: true },
                  { label: 'Accusé de réception', icon: 'CheckBadgeIcon', active: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs py-1">
                    <Icon name={item.icon as any} size={13} style={{ color: item.active ? '#16a34a' : '#d97706' }} />
                    <span style={{ color: item.active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="ml-auto text-xs font-medium" style={{ color: item.active ? '#16a34a' : '#d97706' }}>{item.active ? '✓' : '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                Enregistrer brouillon
              </button>
              <button className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-colors" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                Soumettre pour autorisation
              </button>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Contrôle obligatoire</h3>
              <div className="space-y-2">
                {[
                  { label: 'Autorisation médicale', icon: 'CheckCircleIcon', ok: false },
                  { label: 'Consentement patient', icon: 'DocumentCheckIcon', ok: false },
                  { label: 'Données minimisées', icon: 'ShieldCheckIcon', ok: true },
                  { label: 'Traçabilité activée', icon: 'ClipboardDocumentListIcon', ok: true },
                  { label: 'Chiffrement activé', icon: 'LockClosedIcon', ok: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <Icon name={item.icon as any} size={16} style={{ color: item.ok ? '#16a34a' : '#d97706' }} />
                    <span style={{ color: item.ok ? '#16a34a' : 'var(--muted-foreground)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#d97706' }} />
                <h3 className="font-semibold text-sm" style={{ color: '#92400e' }}>Transfert international</h3>
              </div>
              <p className="text-xs" style={{ color: '#92400e' }}>
                Un transfert international requiert l'accord du patient, la validation du médecin référent, et la conformité aux réglementations des deux pays concernés.
              </p>
            </div>

            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Audit trail</h3>
              <div className="space-y-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <p>• Chaque transfert est horodaté et signé</p>
                <p>• Toutes les actions sont journalisées</p>
                <p>• Le destinataire ne reçoit que les données sélectionnées</p>
                <p>• Le patient est notifié si applicable</p>
              </div>
            </div>

            {/* Inter-module links */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Modules connectés</h3>
              <div className="space-y-2">
                {[
                  { label: 'DPI Hôpital', href: '/hopital-dpi', icon: 'FolderOpenIcon' },
                  { label: 'Flux patients', href: '/org-patient-flow', icon: 'ArrowsRightLeftIcon' },
                  { label: 'Coordination soins', href: '/pro-care-coordination', icon: 'UsersIcon' },
                  { label: 'Adressages', href: '/referrals-interface', icon: 'ArrowUpRightIcon' },
                ].map(link => (
                  <a key={link.label} href={link.href} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>
                    <Icon name={link.icon as any} size={13} />
                    {link.label}
                    <Icon name="ArrowTopRightOnSquareIcon" size={11} className="ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Active transfers */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'authorized', 'in-transit'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={{
                    backgroundColor: filterStatus === s ? 'var(--shifa-blue)' : 'var(--card)',
                    borderColor: filterStatus === s ? 'var(--shifa-blue)' : 'var(--border)',
                    color: filterStatus === s ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {s === 'all' ? 'Tous' : statusConfig[s as Transfer['status']]?.label || s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransfers.filter(t => ['pending', 'authorized', 'in-transit'].includes(t.status)).map(transfer => (
              <TransferCard key={transfer.id} transfer={transfer} onSelect={setSelectedTransfer} selected={selectedTransfer?.id === transfer.id} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {mockTransfers.map(transfer => (
            <TransferCard key={transfer.id} transfer={transfer} onSelect={setSelectedTransfer} selected={selectedTransfer?.id === transfer.id} />
          ))}
        </div>
      )}

      {/* Tab: Protocols */}
      {activeTab === 'protocol' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Transfert inter-service',
              icon: 'ArrowsRightLeftIcon',
              color: '#2563eb',
              bg: '#dbeafe',
              steps: ['Prescription médicale de transfert', 'Vérification disponibilité service destinataire', 'Préparation dossier minimal', 'Accompagnement soignant si nécessaire', 'Remise en main propre + signature'],
            },
            {
              title: 'Transfert inter-établissement',
              icon: 'BuildingOffice2Icon',
              color: '#7c3aed',
              bg: '#ede9fe',
              steps: ['Accord médecin référent + destinataire', 'Consentement patient signé', 'Préparation dossier de transfert complet', 'Organisation transport médicalisé', 'Transmission sécurisée via SHIFA', 'Confirmation de réception'],
            },
            {
              title: 'Transfert inter-région',
              icon: 'MapPinIcon',
              color: '#0891b2',
              bg: '#cffafe',
              steps: ['Validation médicale + administrative', 'Coordination avec autorités régionales si requis', 'Transport adapté à la distance', 'Dossier chiffré transmis via SHIFA', 'Suivi en temps réel', 'Prise en charge confirmée'],
            },
            {
              title: 'Transfert international',
              icon: 'GlobeAltIcon',
              color: '#dc2626',
              bg: '#fee2e2',
              steps: ['Validation médicale des deux pays', 'Consentement éclairé patient', 'Conformité réglementaire (RGPD, loi locale)', 'Traduction documents si nécessaire', 'Coordination consulaire si requis', 'Transport médical international', 'Transmission chiffrée SHIFA', 'Confirmation prise en charge'],
            },
          ].map(proto => (
            <div key={proto.title} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: proto.bg }}>
                  <Icon name={proto.icon as any} size={20} style={{ color: proto.color }} />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{proto.title}</h3>
              </div>
              <ol className="space-y-2">
                {proto.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: proto.color }}>
                      {i + 1}
                    </span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Audit & Traceability */}
      {activeTab === 'audit' && (
        <div className="space-y-5">
          {/* Audit KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Événements total', value: String(auditEvents.length), icon: 'ClipboardDocumentListIcon', color: '#2563eb', bg: '#dbeafe' },
              { label: 'Succès', value: String(auditEvents.filter(e => e.result === 'success').length), icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
              { label: 'Avertissements', value: String(auditEvents.filter(e => e.result === 'warning').length), icon: 'ExclamationTriangleIcon', color: '#d97706', bg: '#fef3c7' },
              { label: 'Erreurs', value: String(auditEvents.filter(e => e.result === 'error').length), icon: 'XCircleIcon', color: '#dc2626', bg: '#fee2e2' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Security rule */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: '#dbeafe', borderColor: '#2563eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="ShieldCheckIcon" size={16} style={{ color: '#1d4ed8' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#1e3a8a' }}>Règle de traçabilité SHIFA</h3>
            </div>
            <p className="text-xs" style={{ color: '#1e3a8a' }}>
              Chaque transfert est horodaté, signé numériquement, et journalisé de manière immuable. Aucune donnée médicale ne peut être transmise sans autorisation explicite, consentement patient, et traçabilité complète. Toutes les actions sont auditables par les responsables autorisés.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Filtrer :</span>
            {['all', 'success', 'warning', 'error'].map(f => (
              <button
                key={f}
                onClick={() => setAuditFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={{
                  backgroundColor: auditFilter === f ? 'var(--shifa-blue)' : 'var(--card)',
                  borderColor: auditFilter === f ? 'var(--shifa-blue)' : 'var(--border)',
                  color: auditFilter === f ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {f === 'all' ? 'Tous' : f === 'success' ? 'Succès' : f === 'warning' ? 'Avertissements' : 'Erreurs'}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={13} />
              Exporter journal
            </button>
          </div>

          {/* Audit timeline */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-8 gap-2">
                {['ID', 'Transfert', 'Action', 'Acteur', 'Rôle', 'Horodatage', 'Module', 'Résultat'].map(h => (
                  <span key={h} className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</span>
                ))}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredAudit.map((event, i) => {
                const rc = auditResultConfig[event.result];
                return (
                  <div key={event.id} className="px-4 py-3 grid grid-cols-8 gap-2 items-center" style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{event.id}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{event.transferId}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{event.action}</span>
                    <span className="text-xs" style={{ color: 'var(--foreground)' }}>{event.actor}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{event.role}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{event.timestamp}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{event.module}</span>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit" style={{ backgroundColor: rc.bg, color: rc.color }}>
                      <Icon name={rc.icon as any} size={11} />
                      {rc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traceability chain for a specific transfer */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Chaîne de traçabilité — TRF-2025-002 (Mamadou Koné)</h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--border)' }} />
              <div className="space-y-4">
                {auditEvents.filter(e => e.transferId === 'TRF-2025-002').map((event, i) => {
                  const rc = auditResultConfig[event.result];
                  return (
                    <div key={event.id} className="flex items-start gap-4 pl-12 relative">
                      <div className="absolute left-3 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: rc.color }}>
                        <Icon name={rc.icon as any} size={8} style={{ color: 'white' }} />
                      </div>
                      <div className="flex-1 rounded-lg border p-3" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{event.action}</span>
                          <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{event.timestamp}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{event.actor} · {event.role} · {event.module}</p>
                        <p className="text-xs mt-1 italic" style={{ color: 'var(--foreground)' }}>{event.data}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer detail panel */}
      {selectedTransfer && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 border-l shadow-xl z-40 overflow-y-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Détail — {selectedTransfer.id}</h2>
              <button onClick={() => setSelectedTransfer(null)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: typeConfig[selectedTransfer.type].bg, color: typeConfig[selectedTransfer.type].color }}>
                {typeConfig[selectedTransfer.type].label}
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: statusConfig[selectedTransfer.status].bg, color: statusConfig[selectedTransfer.status].color }}>
                {statusConfig[selectedTransfer.status].label}
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ color: urgencyConfig[selectedTransfer.urgency].color, backgroundColor: urgencyConfig[selectedTransfer.urgency].color + '20' }}>
                {urgencyConfig[selectedTransfer.urgency].label}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Patient</p><p className="font-semibold" style={{ color: 'var(--foreground)' }}>{selectedTransfer.patientName}</p><p className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedTransfer.patientId}</p></div>
              <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Origine</p><p style={{ color: 'var(--foreground)' }}>{selectedTransfer.from}</p></div>
              <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Destination</p><p style={{ color: 'var(--foreground)' }}>{selectedTransfer.to}</p></div>
              <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Motif</p><p style={{ color: 'var(--foreground)' }}>{selectedTransfer.reason}</p></div>
              {selectedTransfer.authorizedBy && <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Autorisé par</p><p style={{ color: 'var(--foreground)' }}>{selectedTransfer.authorizedBy}</p></div>}
              <div><p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Demandé le</p><p style={{ color: 'var(--foreground)' }}>{selectedTransfer.requestedAt}</p></div>
            </div>

            <div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Documents transmis</p>
              <div className="space-y-1">
                {selectedTransfer.documents.map(doc => (
                  <div key={doc} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name="DocumentTextIcon" size={14} className="text-muted-foreground" />
                    <span style={{ color: 'var(--foreground)' }}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedTransfer.status === 'pending' && (
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#16a34a' }}>
                  Autoriser
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
                  Refuser
                </button>
              </div>
            )}
            {selectedTransfer.status === 'in-transit' && (
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                Confirmer réception
              </button>
            )}

            <button
              onClick={() => setActiveTab('audit')}
              className="w-full py-2 rounded-xl text-sm font-medium border flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}
            >
              <Icon name="ClipboardDocumentListIcon" size={14} />
              Voir journal d'audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransferCard({ transfer, onSelect, selected }: { transfer: Transfer; onSelect: (t: Transfer) => void; selected: boolean }) {
  const type = typeConfig[transfer.type];
  const status = statusConfig[transfer.status];
  const urgency = urgencyConfig[transfer.urgency];

  return (
    <div
      onClick={() => onSelect(transfer)}
      className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: selected ? 'var(--shifa-blue)' : 'var(--border)',
        borderWidth: selected ? '2px' : '1px',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{transfer.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: type.bg, color: type.color }}>{type.label}</span>
            <span className="text-xs font-medium" style={{ color: urgency.color }}>● {urgency.label}</span>
          </div>
          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{transfer.patientName}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{transfer.from} → {transfer.to}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{transfer.reason}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: status.bg, color: status.color }}>
            <Icon name={status.icon as any} size={12} />
            {status.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{transfer.requestedAt}</span>
        </div>
      </div>
    </div>
  );
}
