'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'new' | 'active' | 'history' | 'protocol';

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

export default function PatientTransferContent() {
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['identity', 'reason']);
  const [transferType, setTransferType] = useState<Transfer['type']>('inter-service');
  const [urgency, setUrgency] = useState<Transfer['urgency']>('routine');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'new', label: 'Nouveau transfert', icon: 'PlusCircleIcon' },
    { id: 'active', label: 'Transferts actifs', icon: 'ArrowsRightLeftIcon' },
    { id: 'history', label: 'Historique', icon: 'ClockIcon' },
    { id: 'protocol', label: 'Protocoles', icon: 'ShieldCheckIcon' },
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
      <div className="flex gap-1 p-1 rounded-xl border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${activeTab === tab.id ? 'shadow-sm' : ''}`}
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
                        opacity: cat.required ? 1 : 1,
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
