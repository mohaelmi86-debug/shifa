'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type Tab = 'workflow' | 'specimens' | 'network' | 'tracking' | 'billing' | 'audit';

interface LabNetwork {
  id: string;
  name: string;
  city: string;
  country: string;
  type: 'local' | 'regional' | 'national' | 'international';
  specialties: string[];
  status: 'active' | 'inactive' | 'pending';
  turnaround: string;
  distance?: string;
}

interface SampleTransfer {
  id: string;
  barcode: string;
  patient: string;
  patientId: string;
  test: string;
  fromLab: string;
  toLab: string;
  reason: string;
  status: 'requested' | 'validated' | 'prepared' | 'in_transit' | 'received' | 'analyzing' | 'result_ready' | 'transmitted' | 'archived';
  priority: 'normal' | 'urgent' | 'stat';
  requestedAt: string;
  estimatedDelivery: string;
  transportMode: string;
  temperature: string;
  cost: number;
  currency: string;
}

const labNetwork: LabNetwork[] = [
  { id: 'LAB-001', name: 'Laboratoire SHIFA Central', city: 'Dakar', country: 'Sénégal', type: 'local', specialties: ['Biochimie', 'Hématologie', 'Microbiologie'], status: 'active', turnaround: '2-4h' },
  { id: 'LAB-002', name: 'BioSanté Référence', city: 'Dakar', country: 'Sénégal', type: 'regional', specialties: ['Génétique', 'Anatomopathologie', 'Immunologie'], status: 'active', turnaround: '24-48h', distance: '12 km' },
  { id: 'LAB-003', name: 'CHU Saint-Louis — Labo', city: 'Saint-Louis', country: 'Sénégal', type: 'regional', specialties: ['Biochimie spécialisée', 'Toxicologie'], status: 'active', turnaround: '48-72h', distance: '270 km' },
  { id: 'LAB-004', name: 'Institut Pasteur Dakar', city: 'Dakar', country: 'Sénégal', type: 'national', specialties: ['Virologie', 'Parasitologie', 'Bactériologie spécialisée'], status: 'active', turnaround: '3-5j', distance: '8 km' },
  { id: 'LAB-005', name: 'Cerba International', city: 'Cergy', country: 'France', type: 'international', specialties: ['Génomique', 'Oncologie moléculaire', 'Maladies rares'], status: 'active', turnaround: '7-14j', distance: '4 800 km' },
  { id: 'LAB-006', name: 'Biomnis Lyon', city: 'Lyon', country: 'France', type: 'international', specialties: ['Endocrinologie', 'Auto-immunité', 'Allergologie'], status: 'active', turnaround: '5-10j', distance: '4 600 km' },
  { id: 'LAB-007', name: 'SYNLAB Maroc', city: 'Casablanca', country: 'Maroc', type: 'international', specialties: ['Biologie moléculaire', 'Cytogénétique'], status: 'active', turnaround: '4-7j', distance: '2 100 km' },
  { id: 'LAB-008', name: 'Labo Régional Abidjan', city: 'Abidjan', country: 'Côte d\'Ivoire', type: 'regional', specialties: ['Hématologie spécialisée', 'Coagulation'], status: 'pending', turnaround: '48-72h', distance: '1 800 km' },
];

const transfers: SampleTransfer[] = [
  { id: 'TRF-2026-001', barcode: 'SHIFA-SP-20260812-001', patient: 'Oumar Diallo', patientId: 'PAT-00142', test: 'Analyse génétique BRCA1/BRCA2', fromLab: 'Laboratoire SHIFA Central', toLab: 'Cerba International', reason: 'Capacité technique non disponible localement', status: 'in_transit', priority: 'normal', requestedAt: '2026-08-10 09:30', estimatedDelivery: '2026-08-12 18:00', transportMode: 'DHL Express Médical', temperature: '2-8°C', cost: 280, currency: 'EUR' },
  { id: 'TRF-2026-002', barcode: 'SHIFA-SP-20260812-002', patient: 'Fatou Seck', patientId: 'PAT-00287', test: 'Anatomopathologie — biopsie', fromLab: 'Laboratoire SHIFA Central', toLab: 'BioSanté Référence', reason: 'Spécialité anatomopathologie', status: 'analyzing', priority: 'urgent', requestedAt: '2026-08-12 08:00', estimatedDelivery: '2026-08-13 16:00', transportMode: 'Transport interne SHIFA', temperature: 'Ambiante (fixateur)', cost: 45, currency: 'XOF' },
  { id: 'TRF-2026-003', barcode: 'SHIFA-SP-20260812-003', patient: 'Ibrahima Ba', patientId: 'PAT-00391', test: 'Virologie — PCR VHC quantitatif', fromLab: 'Laboratoire SHIFA Central', toLab: 'Institut Pasteur Dakar', reason: 'Équipement PCR spécialisé', status: 'result_ready', priority: 'normal', requestedAt: '2026-08-09 14:00', estimatedDelivery: '2026-08-12 12:00', transportMode: 'Coursier réfrigéré', temperature: '-20°C', cost: 85, currency: 'XOF' },
  { id: 'TRF-2026-004', barcode: 'SHIFA-SP-20260812-004', patient: 'Mariama Koné', patientId: 'PAT-00512', test: 'Cytogénétique — caryotype', fromLab: 'Laboratoire SHIFA Central', toLab: 'SYNLAB Maroc', reason: 'Analyse cytogénétique spécialisée', status: 'prepared', priority: 'normal', requestedAt: '2026-08-12 10:00', estimatedDelivery: '2026-08-16 18:00', transportMode: 'Fret aérien médical', temperature: '37°C (culture cellulaire)', cost: 320, currency: 'EUR' },
  { id: 'TRF-2026-005', barcode: 'SHIFA-SP-20260812-005', patient: 'Cheikh Mbaye', patientId: 'PAT-00634', test: 'Toxicologie — dépistage élargi', fromLab: 'Laboratoire SHIFA Central', toLab: 'CHU Saint-Louis — Labo', reason: 'Équipement toxicologie régional', status: 'transmitted', priority: 'urgent', requestedAt: '2026-08-11 16:00', estimatedDelivery: '2026-08-12 10:00', transportMode: 'Ambulance SHIFA', temperature: '4°C', cost: 12000, currency: 'XOF' },
];

const workflowSteps = [
  { step: 1, label: 'Demande d\'analyse', icon: 'DocumentPlusIcon', desc: 'Prescription médicale + identification patient' },
  { step: 2, label: 'Identification patient', icon: 'IdentificationIcon', desc: 'Vérification identité SHIFA ID' },
  { step: 3, label: 'Identification échantillon', icon: 'BeakerIcon', desc: 'Prélèvement + étiquetage' },
  { step: 4, label: 'Code-barres / QR', icon: 'QrCodeIcon', desc: 'Génération identifiant unique SHIFA' },
  { step: 5, label: 'Sélection laboratoire', icon: 'BuildingOfficeIcon', desc: 'Réseau SHIFA — local / régional / international' },
  { step: 6, label: 'Demande d\'envoi', icon: 'PaperAirplaneIcon', desc: 'Création bon de transfert' },
  { step: 7, label: 'Validation', icon: 'CheckBadgeIcon', desc: 'Validation biologiste + consentement patient' },
  { step: 8, label: 'Préparation', icon: 'ArchiveBoxIcon', desc: 'Conditionnement + température + documents' },
  { step: 9, label: 'Transport', icon: 'TruckIcon', desc: 'Coursier / fret / ambulance selon distance' },
  { step: 10, label: 'Suivi temps réel', icon: 'MapPinIcon', desc: 'Tracking GPS + alertes température' },
  { step: 11, label: 'Réception', icon: 'InboxArrowDownIcon', desc: 'Accusé de réception + contrôle qualité' },
  { step: 12, label: 'Analyse', icon: 'MagnifyingGlassIcon', desc: 'Analyse par laboratoire destinataire' },
  { step: 13, label: 'Validation résultat', icon: 'ClipboardDocumentCheckIcon', desc: 'Validation biologiste + signature' },
  { step: 14, label: 'Transmission sécurisée', icon: 'LockClosedIcon', desc: 'Envoi chiffré vers SHIFA' },
  { step: 15, label: 'Intégration SHIFA', icon: 'ArrowPathIcon', desc: 'Résultat dans dossier patient' },
  { step: 16, label: 'Facturation', icon: 'BanknotesIcon', desc: 'Facture → Finance SHIFA' },
  { step: 17, label: 'Archivage', icon: 'FolderIcon', desc: 'Archivage légal + traçabilité' },
  { step: 18, label: 'Audit', icon: 'ShieldCheckIcon', desc: 'Journal complet de la chaîne' },
];

const statusConfig: Record<SampleTransfer['status'], { label: string; color: string; bg: string; step: number }> = {
  requested: { label: 'Demandé', color: '#64748b', bg: '#f1f5f9', step: 6 },
  validated: { label: 'Validé', color: '#2563eb', bg: '#dbeafe', step: 7 },
  prepared: { label: 'Préparé', color: '#7c3aed', bg: '#ede9fe', step: 8 },
  in_transit: { label: 'En transit', color: '#d97706', bg: '#fef3c7', step: 9 },
  received: { label: 'Reçu', color: '#0891b2', bg: '#cffafe', step: 11 },
  analyzing: { label: 'En analyse', color: '#d97706', bg: '#fef3c7', step: 12 },
  result_ready: { label: 'Résultat prêt', color: '#16a34a', bg: '#dcfce7', step: 13 },
  transmitted: { label: 'Transmis', color: '#16a34a', bg: '#dcfce7', step: 14 },
  archived: { label: 'Archivé', color: '#64748b', bg: '#f1f5f9', step: 17 },
};

const priorityConfig = {
  normal: { label: 'Normal', color: '#2563eb', bg: '#dbeafe' },
  urgent: { label: 'Urgent', color: '#d97706', bg: '#fef3c7' },
  stat: { label: 'STAT', color: '#dc2626', bg: '#fee2e2' },
};

const typeConfig: Record<LabNetwork['type'], { label: string; color: string }> = {
  local: { label: 'Local', color: '#16a34a' },
  regional: { label: 'Régional', color: '#2563eb' },
  national: { label: 'National', color: '#7c3aed' },
  international: { label: 'International', color: '#d97706' },
};

export default function LabSampleTransferContent() {
  const [activeTab, setActiveTab] = useState<Tab>('workflow');
  const [selectedTransfer, setSelectedTransfer] = useState<SampleTransfer | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'workflow', label: 'Workflow', icon: 'ArrowsRightLeftIcon' },
    { key: 'specimens', label: 'Transferts actifs', icon: 'BeakerIcon' },
    { key: 'network', label: 'Réseau de labos', icon: 'BuildingOffice2Icon' },
    { key: 'tracking', label: 'Suivi & Traçabilité', icon: 'MapPinIcon' },
    { key: 'billing', label: 'Facturation', icon: 'BanknotesIcon' },
    { key: 'audit', label: 'Audit', icon: 'ShieldCheckIcon' },
  ];

  const kpis = [
    { label: 'Transferts actifs', value: String(transfers.filter(t => !['archived', 'transmitted'].includes(t.status)).length), icon: 'BeakerIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'Résultats prêts', value: String(transfers.filter(t => t.status === 'result_ready').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'En transit', value: String(transfers.filter(t => t.status === 'in_transit').length), icon: 'TruckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Labos partenaires', value: String(labNetwork.filter(l => l.status === 'active').length), icon: 'BuildingOfficeIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="var(--shifa-blue)" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Réseau de Transfert d'Échantillons</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>SHIFA Lab Transfer Network — Local · Régional · International</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <Link href="/lab-lis-connector" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PuzzlePieceIcon" size={14} color="var(--shifa-blue)" /> LIS Connector
            </Link>
            <Link href="/lab-international-transfer" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: 'var(--shifa-amber)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="GlobeAltIcon" size={14} color="var(--shifa-amber)" /> Transfert International
            </Link>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--shifa-blue)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PlusIcon" size={14} color="#fff" /> Nouveau transfert
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)' }}>{kpi.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', transition: 'all 0.15s' }}>
            <Icon name={tab.icon} size={14} color={activeTab === tab.key ? '#fff' : 'var(--muted-foreground)'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '20px' }}>Workflow complet — 18 étapes de traçabilité</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {workflowSteps.map((ws) => (
                <div key={ws.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{ws.step}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '2px' }}>{ws.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{ws.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(0,102,255,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,102,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icon name="InformationCircleIcon" size={16} color="var(--shifa-blue)" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-blue)' }}>Architecture SHIFA Lab Transfer</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
              Chaque échantillon reçoit un identifiant unique SHIFA (barcode + QR). La traçabilité est complète de la prescription jusqu'à l'archivage. 
              Les résultats sont transmis de façon sécurisée et intégrés automatiquement dans le dossier patient SHIFA. 
              La facturation est connectée au module Finance existant.
            </p>
          </div>
        </div>
      )}

      {/* Transfers Tab */}
      {activeTab === 'specimens' && (
        <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Transferts en cours</h2>
            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{transfers.length} transferts</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['ID / Barcode', 'Patient', 'Analyse', 'Labo source → Destinataire', 'Priorité', 'Statut', 'Livraison estimée', 'Coût', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => {
                  const sc = statusConfig[t.status];
                  const pc = priorityConfig[t.priority];
                  return (
                    <tr key={t.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>{t.barcode}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{t.patient}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.patientId}</div>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '180px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--foreground)' }}>{t.test}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.reason}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.fromLab}</div>
                        <div style={{ fontSize: '11px', color: 'var(--shifa-blue)', fontWeight: 600 }}>→ {t.toLab}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>{t.transportMode} · {t.temperature}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: pc.bg, color: pc.color }}>{pc.label}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                        <div style={{ fontSize: '10px', color: 'var(--muted-foreground)', marginTop: '2px' }}>Étape {sc.step}/18</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{t.estimatedDelivery}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{t.cost.toLocaleString()} {t.currency}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => setSelectedTransfer(t)} style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Détails</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Network Tab */}
      {activeTab === 'network' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {labNetwork.map(lab => {
            const tc = typeConfig[lab.type];
            return (
              <div key={lab.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,102,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="BeakerIcon" size={18} color="var(--shifa-blue)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{lab.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{lab.city}, {lab.country}{lab.distance ? ` · ${lab.distance}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: lab.status === 'active' ? '#dcfce7' : lab.status === 'pending' ? '#fef3c7' : '#f1f5f9', color: lab.status === 'active' ? '#16a34a' : lab.status === 'pending' ? '#d97706' : '#64748b' }}>{lab.status === 'active' ? 'Actif' : lab.status === 'pending' ? 'En attente' : 'Inactif'}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600, color: tc.color, background: `${tc.color}18` }}>{tc.label}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {lab.specialties.map(s => (
                    <span key={s} style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>⏱ Délai : <strong style={{ color: 'var(--foreground)' }}>{lab.turnaround}</strong></span>
                  <button style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Envoyer un échantillon</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Suivi en temps réel</h3>
            {transfers.filter(t => t.status === 'in_transit').map(t => (
              <div key={t.id} style={{ padding: '14px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#d97706' }}>En transit</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{t.patient} — {t.test}</div>
                <div style={{ fontSize: '12px', color: 'var(--foreground)', marginBottom: '8px' }}>🚚 {t.transportMode} · 🌡️ {t.temperature}</div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(statusConfig[t.status].step / 18) * 100}%`, background: 'var(--shifa-amber)', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>Étape {statusConfig[t.status].step}/18 · Livraison : {t.estimatedDelivery}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Identifiants uniques SHIFA</h3>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.15)', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--shifa-blue)', marginBottom: '8px' }}>Format identifiant SHIFA</div>
              <code style={{ fontSize: '13px', color: 'var(--foreground)', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>SHIFA-SP-YYYYMMDD-NNN</code>
              <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>SP = Specimen · YYYYMMDD = Date · NNN = Séquence</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '10px' }}>Derniers barcodes générés</div>
            {transfers.slice(0, 4).map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'monospace' }}>{t.barcode}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.patient}</div>
                </div>
                <Icon name="QrCodeIcon" size={20} color="var(--muted-foreground)" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div>
          <div style={{ background: 'rgba(16,185,129,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="ArrowsRightLeftIcon" size={20} color="var(--shifa-green)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-green)' }}>Connecté au module Finance SHIFA</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Les factures de transfert sont automatiquement transmises au module Finance existant. Aucun doublon.</div>
            </div>
            <Link href="/finance-dashboard" style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Voir Finance →</Link>
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Facturation des transferts</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Transfert', 'Patient', 'Laboratoire destinataire', 'Analyse', 'Transport', 'Analyse', 'Total', 'Devise', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.patient}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.toLab}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{Math.round(t.cost * 0.7).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{Math.round(t.cost * 0.3).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{Math.round(t.cost * 0.7).toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{t.cost.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{t.currency}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: t.status === 'archived' ? '#dcfce7' : '#fef3c7', color: t.status === 'archived' ? '#16a34a' : '#d97706' }}>{t.status === 'archived' ? 'Facturé' : 'En cours'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Journal d'audit — Traçabilité complète</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transfers.map(t => (
              <div key={t.id} style={{ padding: '14px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id} — {t.patient}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusConfig[t.status].bg, color: statusConfig[t.status].color }}>{statusConfig[t.status].label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Barcode : <strong style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{t.barcode}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Demandé : <strong style={{ color: 'var(--foreground)' }}>{t.requestedAt}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Transport : <strong style={{ color: 'var(--foreground)' }}>{t.transportMode}</strong></div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Température : <strong style={{ color: 'var(--foreground)' }}>{t.temperature}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer Detail Modal */}
      {selectedTransfer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedTransfer(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '24px', width: '560px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Détails du transfert</h3>
              <button onClick={() => setSelectedTransfer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                ['ID', selectedTransfer.id], ['Barcode', selectedTransfer.barcode],
                ['Patient', selectedTransfer.patient], ['ID Patient', selectedTransfer.patientId],
                ['Analyse', selectedTransfer.test], ['Raison', selectedTransfer.reason],
                ['Labo source', selectedTransfer.fromLab], ['Labo destinataire', selectedTransfer.toLab],
                ['Transport', selectedTransfer.transportMode], ['Température', selectedTransfer.temperature],
                ['Demandé le', selectedTransfer.requestedAt], ['Livraison estimée', selectedTransfer.estimatedDelivery],
                ['Coût', `${selectedTransfer.cost.toLocaleString()} ${selectedTransfer.currency}`], ['Priorité', selectedTransfer.priority],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
