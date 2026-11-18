'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type Tab = 'overview' | 'transfers' | 'regulations' | 'billing' | 'compliance' | 'audit';

interface InternationalTransfer {
  id: string;
  barcode: string;
  patient: string;
  test: string;
  fromCountry: string;
  fromLab: string;
  toCountry: string;
  toLab: string;
  status: 'requested' | 'consent_obtained' | 'regulatory_cleared' | 'shipped' | 'customs' | 'received' | 'analyzing' | 'result_ready' | 'transmitted' | 'invoiced' | 'archived';
  priority: 'normal' | 'urgent';
  requestedAt: string;
  estimatedDelivery: string;
  transportMode: string;
  temperature: string;
  costAnalysis: number;
  costTransport: number;
  costInsurance: number;
  currency: string;
  exchangeRate?: string;
  regulatoryStatus: 'pending' | 'cleared' | 'blocked';
  consentObtained: boolean;
  customsRef?: string;
}

interface PartnerLab {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  specialties: string[];
  accreditation: string[];
  turnaround: string;
  currency: string;
  status: 'active' | 'pending' | 'inactive';
  regulatoryNotes: string;
}

const partnerLabs: PartnerLab[] = [
  { id: 'INTL-001', name: 'Cerba International', country: 'France', flag: '🇫🇷', city: 'Cergy', specialties: ['Génomique', 'Oncologie moléculaire', 'Maladies rares', 'Pharmacogénomique'], accreditation: ['ISO 15189', 'COFRAC', 'CAP'], turnaround: '7-14 jours', currency: 'EUR', status: 'active', regulatoryNotes: 'Accord bilatéral Sénégal-France. Autorisation ANSM. Consentement RGPD requis.' },
  { id: 'INTL-002', name: 'Biomnis', country: 'France', flag: '🇫🇷', city: 'Lyon', specialties: ['Endocrinologie', 'Auto-immunité', 'Allergologie', 'Fertilité'], accreditation: ['ISO 15189', 'COFRAC'], turnaround: '5-10 jours', currency: 'EUR', status: 'active', regulatoryNotes: 'Accord bilatéral. Transfert de données RGPD. Pseudonymisation obligatoire.' },
  { id: 'INTL-003', name: 'SYNLAB Maroc', country: 'Maroc', flag: '🇲🇦', city: 'Casablanca', specialties: ['Biologie moléculaire', 'Cytogénétique', 'Hématologie spécialisée'], accreditation: ['ISO 15189', 'CNAS'], turnaround: '4-7 jours', currency: 'MAD', status: 'active', regulatoryNotes: 'Accord CEDEAO étendu. Réglementation CNDP Maroc. Consentement explicite requis.' },
  { id: 'INTL-004', name: 'LANCET Laboratories', country: 'Afrique du Sud', flag: '🇿🇦', city: 'Johannesburg', specialties: ['Virologie tropicale', 'Parasitologie', 'Génétique moléculaire'], accreditation: ['ISO 15189', 'SANAS'], turnaround: '5-8 jours', currency: 'ZAR', status: 'active', regulatoryNotes: 'Accord UA. Réglementation POPIA. Autorisation SAHPRA pour certains tests.' },
  { id: 'INTL-005', name: 'Mayo Clinic Laboratories', country: 'États-Unis', flag: '🇺🇸', city: 'Rochester, MN', specialties: ['Tests ultra-spécialisés', 'Maladies rares', 'Oncologie avancée'], accreditation: ['CAP', 'CLIA', 'ISO 15189'], turnaround: '10-21 jours', currency: 'USD', status: 'pending', regulatoryNotes: 'Accord en cours. HIPAA + RGPD. Autorisation FDA. Consentement spécifique requis.' },
  { id: 'INTL-006', name: 'Institut Pasteur Paris', country: 'France', flag: '🇫🇷', city: 'Paris', specialties: ['Maladies infectieuses tropicales', 'Virologie émergente', 'Bactériologie rare'], accreditation: ['ISO 15189', 'COFRAC', 'OMS'], turnaround: '7-14 jours', currency: 'EUR', status: 'active', regulatoryNotes: 'Partenariat institutionnel. Protocole OMS. Accord cadre Sénégal-France.' },
];

const internationalTransfers: InternationalTransfer[] = [
  { id: 'INTL-TRF-001', barcode: 'SHIFA-INTL-20260812-001', patient: 'Oumar Diallo', test: 'Analyse génétique BRCA1/BRCA2', fromCountry: 'Sénégal', fromLab: 'Laboratoire SHIFA Dakar', toCountry: 'France', toLab: 'Cerba International', status: 'shipped', priority: 'normal', requestedAt: '2026-08-08 09:00', estimatedDelivery: '2026-08-15 18:00', transportMode: 'DHL Express Médical — Fret aérien', temperature: '2-8°C (réfrigéré)', costAnalysis: 420, costTransport: 180, costInsurance: 45, currency: 'EUR', exchangeRate: '1 EUR = 655 XOF', regulatoryStatus: 'cleared', consentObtained: true, customsRef: 'CDG-2026-08-44821' },
  { id: 'INTL-TRF-002', barcode: 'SHIFA-INTL-20260812-002', patient: 'Mariama Koné', test: 'Caryotype + FISH oncologie', fromCountry: 'Sénégal', fromLab: 'Laboratoire SHIFA Dakar', toCountry: 'Maroc', toLab: 'SYNLAB Maroc', status: 'regulatory_cleared', priority: 'urgent', requestedAt: '2026-08-12 10:00', estimatedDelivery: '2026-08-18 12:00', transportMode: 'Fret aérien médical — Air Maroc Cargo', temperature: '37°C (culture cellulaire)', costAnalysis: 280, costTransport: 95, costInsurance: 30, currency: 'MAD', exchangeRate: '1 MAD = 67 XOF', regulatoryStatus: 'cleared', consentObtained: true },
  { id: 'INTL-TRF-003', barcode: 'SHIFA-INTL-20260812-003', patient: 'Aïssatou Diop', test: 'Virologie émergente — Séquençage NGS', fromCountry: 'Sénégal', fromLab: 'Laboratoire SHIFA Dakar', toCountry: 'France', toLab: 'Institut Pasteur Paris', status: 'consent_obtained', priority: 'normal', requestedAt: '2026-08-12 11:00', estimatedDelivery: '2026-08-22 18:00', transportMode: 'En attente validation douanière', temperature: '-80°C (azote liquide)', costAnalysis: 650, costTransport: 320, costInsurance: 80, currency: 'EUR', exchangeRate: '1 EUR = 655 XOF', regulatoryStatus: 'pending', consentObtained: true },
];

const statusConfig: Record<InternationalTransfer['status'], { label: string; color: string; bg: string; step: number }> = {
  requested: { label: 'Demandé', color: '#64748b', bg: '#f1f5f9', step: 1 },
  consent_obtained: { label: 'Consentement obtenu', color: '#2563eb', bg: '#dbeafe', step: 2 },
  regulatory_cleared: { label: 'Autorisations obtenues', color: '#7c3aed', bg: '#ede9fe', step: 3 },
  shipped: { label: 'Expédié', color: '#d97706', bg: '#fef3c7', step: 4 },
  customs: { label: 'En douane', color: '#d97706', bg: '#fef3c7', step: 5 },
  received: { label: 'Reçu', color: '#0891b2', bg: '#cffafe', step: 6 },
  analyzing: { label: 'En analyse', color: '#d97706', bg: '#fef3c7', step: 7 },
  result_ready: { label: 'Résultat prêt', color: '#16a34a', bg: '#dcfce7', step: 8 },
  transmitted: { label: 'Transmis à SHIFA', color: '#16a34a', bg: '#dcfce7', step: 9 },
  invoiced: { label: 'Facturé', color: '#16a34a', bg: '#dcfce7', step: 10 },
  archived: { label: 'Archivé', color: '#64748b', bg: '#f1f5f9', step: 11 },
};

const internationalConsiderations = [
  { icon: 'GlobeAltIcon', title: 'Pays & Réglementation', items: ['Accord bilatéral ou multilatéral requis', 'Réglementation pays source + destination', 'Autorisation de transfert de données médicales', 'Conformité RGPD (Europe) / POPIA (Afrique du Sud) / HIPAA (USA)'] },
  { icon: 'TruckIcon', title: 'Transport & Logistique', items: ['Fret aérien médical certifié IATA P650', 'Chaîne du froid documentée', 'Emballage UN3373 / UN2814 selon type', 'Assurance transport spécialisée'] },
  { icon: 'ClockIcon', title: 'Délais & Suivi', items: ['Délai douanier variable (1-5 jours)', 'Suivi GPS + température en temps réel', 'Alertes automatiques si rupture chaîne du froid', 'Délai total : 5-21 jours selon destination'] },
  { icon: 'BanknotesIcon', title: 'Devise & Facturation', items: ['Tarif en devise locale du laboratoire', 'Conversion automatique XOF/EUR/USD/MAD', 'Frais de transport + analyse + assurance', 'Tiers payant assurance si applicable'] },
  { icon: 'ShieldCheckIcon', title: 'Assurance & Autorisations', items: ['Assurance transport valeur déclarée', 'Autorisation export matériel biologique', 'Certificat sanitaire si requis', 'Déclaration douanière CN22/CN23'] },
  { icon: 'LockClosedIcon', title: 'Confidentialité & Consentement', items: ['Consentement explicite patient obligatoire', 'Pseudonymisation avant transfert international', 'Accord de traitement des données signé', 'Droit à l\'oubli respecté selon juridiction'] },
];

export default function LabInternationalTransferContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'GlobeAltIcon' },
    { key: 'transfers', label: 'Transferts actifs', icon: 'BeakerIcon' },
    { key: 'regulations', label: 'Réseau & Réglementation', icon: 'BuildingLibraryIcon' },
    { key: 'billing', label: 'Facturation internationale', icon: 'BanknotesIcon' },
    { key: 'compliance', label: 'Conformité', icon: 'ShieldCheckIcon' },
    { key: 'audit', label: 'Audit', icon: 'ClipboardDocumentCheckIcon' },
  ];

  const kpis = [
    { label: 'Transferts actifs', value: String(internationalTransfers.length), icon: 'BeakerIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'Labos partenaires', value: String(partnerLabs.filter(l => l.status === 'active').length), icon: 'BuildingOfficeIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Pays couverts', value: '6', icon: 'GlobeAltIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
    { label: 'En attente douane', value: String(internationalTransfers.filter(t => t.status === 'customs').length), icon: 'TruckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(123,94,167,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="GlobeAltIcon" size={22} color="var(--shifa-purple)" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Transfert International d'Échantillons</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>SHIFA International Lab Network — Analyses spécialisées mondiales</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <Link href="/lab-sample-transfer" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="BeakerIcon" size={14} color="var(--shifa-blue)" /> Réseau local
            </Link>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--shifa-purple)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PlusIcon" size={14} color="#fff" /> Nouveau transfert international
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
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', background: activeTab === tab.key ? 'var(--shifa-purple)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', transition: 'all 0.15s' }}>
            <Icon name={tab.icon} size={14} color={activeTab === tab.key ? '#fff' : 'var(--muted-foreground)'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ background: 'rgba(245,158,11,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icon name="ExclamationTriangleIcon" size={16} color="var(--shifa-amber)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--shifa-amber)' }}>Transfert international ≠ simple changement d'adresse</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
              Chaque transfert international implique : réglementation pays source + destination, autorisation de transfert de données médicales, 
              transport certifié IATA, douane, assurance, devise, facturation multidevise, consentement explicite, pseudonymisation, et traçabilité complète.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {internationalConsiderations.map((c, i) => (
              <div key={i} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Icon name={c.icon} size={18} color="var(--shifa-purple)" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{c.title}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {c.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfers */}
      {activeTab === 'transfers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {internationalTransfers.map(t => {
            const sc = statusConfig[t.status];
            return (
              <div key={t.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>{t.id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>{t.barcode}</div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>Patient</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{t.patient}</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>Analyse</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{t.test}</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>Trajet</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{t.fromCountry} → {t.toCountry}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.toLab}</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>Coût total</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{(t.costAnalysis + t.costTransport + t.costInsurance).toLocaleString()} {t.currency}</div>
                    {t.exchangeRate && <div style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>{t.exchangeRate}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', background: t.consentObtained ? '#dcfce7' : '#fee2e2', color: t.consentObtained ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                    {t.consentObtained ? '✓ Consentement obtenu' : '⚠ Consentement requis'}
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', background: t.regulatoryStatus === 'cleared' ? '#dcfce7' : t.regulatoryStatus === 'pending' ? '#fef3c7' : '#fee2e2', color: t.regulatoryStatus === 'cleared' ? '#16a34a' : t.regulatoryStatus === 'pending' ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                    {t.regulatoryStatus === 'cleared' ? '✓ Autorisations OK' : t.regulatoryStatus === 'pending' ? '⏳ Autorisations en cours' : '✗ Bloqué'}
                  </span>
                  {t.customsRef && <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', background: '#fef3c7', color: '#d97706', fontWeight: 600 }}>Douane : {t.customsRef}</span>}
                  <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>🌡️ {t.temperature}</span>
                  <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '11px', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>✈️ {t.transportMode}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Partner Labs */}
      {activeTab === 'regulations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {partnerLabs.map(lab => (
            <div key={lab.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{lab.flag}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{lab.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{lab.city}, {lab.country} · {lab.currency}</div>
                  </div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: lab.status === 'active' ? '#dcfce7' : lab.status === 'pending' ? '#fef3c7' : '#f1f5f9', color: lab.status === 'active' ? '#16a34a' : lab.status === 'pending' ? '#d97706' : '#64748b' }}>
                  {lab.status === 'active' ? 'Actif' : lab.status === 'pending' ? 'En cours' : 'Inactif'}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                {lab.specialties.map(s => (
                  <span key={s} style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', background: 'rgba(123,94,167,0.08)', color: 'var(--shifa-purple)', border: '1px solid rgba(123,94,167,0.15)' }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {lab.accreditation.map(a => (
                  <span key={a} style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>{a}</span>
                ))}
              </div>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--shifa-amber)', fontWeight: 600, marginBottom: '2px' }}>⚖️ Réglementation</div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{lab.regulatoryNotes}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>⏱ {lab.turnaround}</span>
                <button style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(123,94,167,0.08)', color: 'var(--shifa-purple)', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Initier transfert</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Billing */}
      {activeTab === 'billing' && (
        <div>
          <div style={{ background: 'rgba(16,185,129,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="ArrowsRightLeftIcon" size={20} color="var(--shifa-green)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-green)' }}>Connecté au module Finance SHIFA — Aucun doublon</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Conversion automatique des devises. Tiers payant assurance si applicable. Impayés trackés.</div>
            </div>
            <Link href="/finance-dashboard" style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Finance →</Link>
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Transfert', 'Patient', 'Destination', 'Analyse', 'Transport', 'Assurance', 'Total', 'Devise', 'Taux change'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {internationalTransfers.map((t, i) => (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.patient}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.toCountry} — {t.toLab}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.costAnalysis} {t.currency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.costTransport} {t.currency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{t.costInsurance} {t.currency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{(t.costAnalysis + t.costTransport + t.costInsurance)} {t.currency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{t.currency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.exchangeRate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance */}
      {activeTab === 'compliance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Checklist conformité internationale</h3>
            {[
              { label: 'Consentement explicite patient', status: true },
              { label: 'Pseudonymisation des données', status: true },
              { label: 'Accord de traitement des données signé', status: true },
              { label: 'Autorisation export matériel biologique', status: true },
              { label: 'Certificat sanitaire (si requis)', status: false },
              { label: 'Déclaration douanière CN22/CN23', status: true },
              { label: 'Emballage IATA P650 / UN3373', status: true },
              { label: 'Assurance transport valeur déclarée', status: true },
              { label: 'Accord bilatéral pays source/destination', status: true },
              { label: 'Conformité RGPD/POPIA/HIPAA selon pays', status: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <Icon name={item.status ? 'CheckCircleIcon' : 'XCircleIcon'} size={16} color={item.status ? 'var(--shifa-green)' : 'var(--shifa-red)'} />
                <span style={{ fontSize: '13px', color: 'var(--foreground)' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Réglementations par région</h3>
            {[
              { region: '🇪🇺 Europe (RGPD)', rules: ['Pseudonymisation obligatoire', 'DPA signé', 'Transfert hors UE : clauses contractuelles types', 'Droit à l\'oubli applicable'] },
              { region: '🌍 Afrique (UA / CEDEAO)', rules: ['Accord bilatéral ou régional requis', 'Réglementation nationale variable', 'Consentement explicite', 'Traçabilité complète'] },
              { region: '🇺🇸 États-Unis (HIPAA)', rules: ['BAA (Business Associate Agreement) requis', 'PHI protégé', 'Audit trail obligatoire', 'Notification de violation 60j'] },
              { region: '🌐 International (OMS)', rules: ['Règlement sanitaire international (RSI)', 'Notification maladies à déclaration obligatoire', 'Protocoles biosécurité P2/P3/P4'] },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '6px' }}>{r.region}</div>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {r.rules.map((rule, j) => (
                    <li key={j} style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '3px' }}>{rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit */}
      {activeTab === 'audit' && (
        <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Journal d'audit — Transferts internationaux</h3>
          {internationalTransfers.map(t => (
            <div key={t.id} style={{ padding: '14px', borderRadius: '10px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{t.id} — {t.patient}</span>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusConfig[t.status].bg, color: statusConfig[t.status].color }}>{statusConfig[t.status].label}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Barcode : <strong style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{t.barcode}</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Trajet : <strong style={{ color: 'var(--foreground)' }}>{t.fromCountry} → {t.toCountry}</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Demandé : <strong style={{ color: 'var(--foreground)' }}>{t.requestedAt}</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Consentement : <strong style={{ color: t.consentObtained ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{t.consentObtained ? 'Obtenu' : 'Manquant'}</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Réglementation : <strong style={{ color: t.regulatoryStatus === 'cleared' ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{t.regulatoryStatus === 'cleared' ? 'Conforme' : 'En cours'}</strong></div>
                {t.customsRef && <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Douane : <strong style={{ color: 'var(--foreground)' }}>{t.customsRef}</strong></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
