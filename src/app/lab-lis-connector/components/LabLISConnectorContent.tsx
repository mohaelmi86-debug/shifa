'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

type Tab = 'architecture' | 'connectors' | 'modes' | 'mapping' | 'monitoring';

interface LISConnector {
  id: string;
  name: string;
  type: 'internal_shifa' | 'internal_lims' | 'external_lims' | 'partner_lab';
  protocol: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lab: string;
  country: string;
  lastSync: string;
  messagesDay: number;
  latency: string;
  direction: 'bidirectional' | 'read' | 'write';
}

const lisConnectors: LISConnector[] = [
  { id: 'LIS-001', name: 'SHIFA Lab Direct', type: 'internal_shifa', protocol: 'SHIFA Native API', status: 'active', lab: 'Laboratoire SHIFA Central', country: 'Sénégal', lastSync: 'Il y a 2 min', messagesDay: 1840, latency: '45 ms', direction: 'bidirectional' },
  { id: 'LIS-002', name: 'CHU Dakar — LIS Interne', type: 'internal_lims', protocol: 'HL7 v2.5 (ORM/ORU)', status: 'active', lab: 'CHU de Dakar', country: 'Sénégal', lastSync: 'Il y a 5 min', messagesDay: 3240, latency: '112 ms', direction: 'bidirectional' },
  { id: 'LIS-003', name: 'Biomnis — LIS Externe', type: 'external_lims', protocol: 'FHIR R4 + HL7 v2', status: 'active', lab: 'Biomnis Lyon', country: 'France', lastSync: 'Il y a 15 min', messagesDay: 480, latency: '280 ms', direction: 'bidirectional' },
  { id: 'LIS-004', name: 'Cerba — LIS Externe', type: 'external_lims', protocol: 'FHIR R4 (Observations)', status: 'active', lab: 'Cerba International', country: 'France', lastSync: 'Il y a 8 min', messagesDay: 320, latency: '310 ms', direction: 'read' },
  { id: 'LIS-005', name: 'Institut Pasteur — Partenaire', type: 'partner_lab', protocol: 'REST API SHIFA', status: 'active', lab: 'Institut Pasteur Dakar', country: 'Sénégal', lastSync: 'Il y a 20 min', messagesDay: 180, latency: '95 ms', direction: 'bidirectional' },
  { id: 'LIS-006', name: 'CHR Saint-Louis — LIS', type: 'internal_lims', protocol: 'HL7 v2.5', status: 'error', lab: 'CHR Saint-Louis', country: 'Sénégal', lastSync: 'Il y a 2h', messagesDay: 0, latency: '—', direction: 'bidirectional' },
  { id: 'LIS-007', name: 'SYNLAB Maroc', type: 'partner_lab', protocol: 'FHIR R4', status: 'pending', lab: 'SYNLAB Casablanca', country: 'Maroc', lastSync: '—', messagesDay: 0, latency: '—', direction: 'bidirectional' },
];

const operationModes = [
  {
    id: 'A',
    title: 'Mode A — Laboratoire SHIFA Direct',
    icon: 'BeakerIcon',
    color: '#16a34a',
    bg: '#dcfce7',
    description: 'Le laboratoire utilise directement les modules SHIFA Lab Dashboard et Laboratory LMS.',
    flow: ['Prescription médicale', 'SHIFA Lab Dashboard', 'Analyse', 'Résultat', 'Dossier patient SHIFA'],
    status: '🟢 Opérationnel',
    links: ['/lab-dashboard', '/laboratory-lms'],
  },
  {
    id: 'B',
    title: 'Mode B — LIMS Interne Établissement',
    icon: 'BuildingOfficeIcon',
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'L\'établissement possède son propre LIMS. SHIFA se connecte via HL7 v2 ou FHIR.',
    flow: ['Prescription SHIFA', 'SHIFA Lab Integration Layer', 'HL7/FHIR', 'LIMS Interne', 'Résultat', 'SHIFA'],
    status: '🟡 Partiel — connecteurs HL7 actifs',
    links: ['/interoperability-hub', '/external-connectors'],
  },
  {
    id: 'C',
    title: 'Mode C — LIMS Externe',
    icon: 'GlobeAltIcon',
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'Laboratoire externe avec son propre LIMS. Connexion via API SHIFA ou standards ouverts.',
    flow: ['Prescription SHIFA', 'SHIFA Integration Layer', 'API/FHIR/HL7', 'LIMS Externe', 'Résultat', 'SHIFA'],
    status: '🟡 Partiel — Biomnis/Cerba actifs',
    links: ['/external-connectors', '/lab-sample-transfer'],
  },
  {
    id: 'D',
    title: 'Mode D — Laboratoire Partenaire SHIFA',
    icon: 'BuildingOffice2Icon',
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Laboratoire partenaire connecté directement à l\'écosystème SHIFA via API dédiée.',
    flow: ['Prescription SHIFA', 'SHIFA Partner API', 'Laboratoire Partenaire', 'Analyse', 'Résultat', 'SHIFA'],
    status: '🟡 Partiel — Institut Pasteur actif',
    links: ['/api-developer-dashboard', '/lab-sample-transfer'],
  },
];

const typeConfig: Record<LISConnector['type'], { label: string; color: string; bg: string }> = {
  internal_shifa: { label: 'SHIFA Direct', color: '#16a34a', bg: '#dcfce7' },
  internal_lims: { label: 'LIMS Interne', color: '#2563eb', bg: '#dbeafe' },
  external_lims: { label: 'LIMS Externe', color: '#7c3aed', bg: '#ede9fe' },
  partner_lab: { label: 'Labo Partenaire', color: '#d97706', bg: '#fef3c7' },
};

const statusConfig: Record<LISConnector['status'], { label: string; color: string; bg: string; icon: string }> = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  inactive: { label: 'Inactif', color: '#64748b', bg: '#f1f5f9', icon: 'MinusCircleIcon' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
};

const dataMapping = [
  { shifa: 'Prescription (SHIFA)', hl7: 'ORM^O01 (Order Message)', fhir: 'ServiceRequest', desc: 'Demande d\'analyse' },
  { shifa: 'Identité patient', hl7: 'ADT^A01 (Patient)', fhir: 'Patient', desc: 'Données démographiques' },
  { shifa: 'Échantillon', hl7: 'OML^O21 (Specimen)', fhir: 'Specimen', desc: 'Prélèvement + tube' },
  { shifa: 'Résultat analyse', hl7: 'ORU^R01 (Result)', fhir: 'Observation', desc: 'Valeur + unité + référence' },
  { shifa: 'Rapport biologique', hl7: 'ORU^R01 (Report)', fhir: 'DiagnosticReport', desc: 'Rapport complet validé' },
  { shifa: 'Statut demande', hl7: 'ORM^O01 (Status)', fhir: 'Task', desc: 'Suivi workflow' },
  { shifa: 'Facturation analyse', hl7: 'DFT^P03 (Charge)', fhir: 'ChargeItem', desc: 'Tarification + facturation' },
];

export default function LabLISConnectorContent() {
  const [activeTab, setActiveTab] = useState<Tab>('architecture');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'architecture', label: 'Architecture', icon: 'Squares2X2Icon' },
    { key: 'connectors', label: 'Connecteurs actifs', icon: 'ArrowsRightLeftIcon' },
    { key: 'modes', label: '4 Modes opératoires', icon: 'AdjustmentsHorizontalIcon' },
    { key: 'mapping', label: 'Mapping HL7/FHIR', icon: 'CodeBracketIcon' },
    { key: 'monitoring', label: 'Monitoring', icon: 'ChartBarIcon' },
  ];

  const kpis = [
    { label: 'Connecteurs actifs', value: String(lisConnectors.filter(c => c.status === 'active').length), icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Messages/jour', value: lisConnectors.reduce((s, c) => s + c.messagesDay, 0).toLocaleString(), icon: 'BoltIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'En erreur', value: String(lisConnectors.filter(c => c.status === 'error').length), icon: 'XCircleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
    { label: 'En attente', value: String(lisConnectors.filter(c => c.status === 'pending').length), icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="PuzzlePieceIcon" size={22} color="var(--shifa-blue)" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>SHIFA Lab Integration Layer</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>LIS / LIMS Connector — SHIFA ↕ Lab Integration Layer ↕ LIS/LIMS</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <Link href="/lab-sample-transfer" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="BeakerIcon" size={14} color="var(--shifa-blue)" /> Transfert échantillons
            </Link>
            <Link href="/interoperability-hub" style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(123,94,167,0.08)', color: 'var(--shifa-purple)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="ArrowsRightLeftIcon" size={14} color="var(--shifa-purple)" /> Interoperability Hub
            </Link>
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

      {/* Architecture */}
      {activeTab === 'architecture' && (
        <div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '20px' }}>Architecture SHIFA Lab Integration Layer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              {[
                { label: 'SHIFA Core', sublabel: 'Dossier patient · Prescriptions · Résultats · Facturation', color: '#2563eb', bg: '#dbeafe' },
                { label: '↕', sublabel: '', color: '#64748b', bg: 'transparent', small: true },
                { label: 'SHIFA Lab Integration Layer', sublabel: 'Traduction HL7/FHIR · Routage · Authentification · Audit · Mapping · Normalisation', color: '#7c3aed', bg: '#ede9fe' },
                { label: '↕', sublabel: '', color: '#64748b', bg: 'transparent', small: true },
              ].map((item, i) => (
                item.small ? (
                  <div key={i} style={{ fontSize: '20px', color: '#64748b', fontWeight: 700 }}>↕</div>
                ) : (
                  <div key={i} style={{ width: '100%', maxWidth: '600px', padding: '16px 20px', borderRadius: '12px', background: item.bg, border: `2px solid ${item.color}33`, textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '4px' }}>{item.sublabel}</div>
                  </div>
                )
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '100%' }}>
                {operationModes.map(mode => (
                  <div key={mode.id} style={{ padding: '14px', borderRadius: '10px', background: mode.bg, border: `1px solid ${mode.color}33`, textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: mode.color, marginBottom: '4px' }}>Mode {mode.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{mode.title.replace(`Mode ${mode.id} — `, '')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(0,102,255,0.04)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(0,102,255,0.15)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-blue)', marginBottom: '8px' }}>Protocoles supportés</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['HL7 v2.5 (ORM/ORU/ADT)', 'FHIR R4 (ServiceRequest/Observation/DiagnosticReport)', 'SHIFA Native API (REST)', 'DICOM Worklist (MWL)', 'LIS propriétaire (via adaptateur)', 'Webhook SHIFA'].map(p => (
                <span key={p} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connectors */}
      {activeTab === 'connectors' && (
        <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                {['Connecteur', 'Type', 'Protocole', 'Laboratoire', 'Pays', 'Direction', 'Messages/j', 'Latence', 'Dernière sync', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lisConnectors.map((c, i) => {
                const sc = statusConfig[c.status];
                const tc = typeConfig[c.type];
                return (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{c.id}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: tc.bg, color: tc.color }}>{tc.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{c.protocol}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{c.lab}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{c.country}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{c.direction === 'bidirectional' ? '⇄' : c.direction === 'read' ? '←' : '→'} {c.direction}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{c.messagesDay.toLocaleString()}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--foreground)' }}>{c.latency}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{c.lastSync}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name={sc.icon} size={14} color={sc.color} />
                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modes */}
      {activeTab === 'modes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {operationModes.map(mode => (
            <div key={mode.id} style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: `1px solid ${mode.color}33` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: mode.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={mode.icon} size={18} color={mode.color} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{mode.title}</div>
                  <div style={{ fontSize: '11px', color: mode.color, fontWeight: 600 }}>{mode.status}</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '14px' }}>{mode.description}</p>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>Flux :</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                  {mode.flow.map((step, i) => (
                    <React.Fragment key={i}>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', background: mode.bg, color: mode.color, fontWeight: 500 }}>{step}</span>
                      {i < mode.flow.length - 1 && <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {mode.links.map(link => (
                  <Link key={link} href={link} style={{ padding: '5px 10px', borderRadius: '6px', background: mode.bg, color: mode.color, fontSize: '11px', fontWeight: 600, textDecoration: 'none' }}>
                    {link.replace('/', '')} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mapping */}
      {activeTab === 'mapping' && (
        <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Mapping SHIFA ↔ HL7 v2 ↔ FHIR R4</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                {['Concept SHIFA', 'HL7 v2 Message', 'FHIR R4 Resource', 'Description'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataMapping.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: 'var(--shifa-blue)' }}>{row.shifa}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--shifa-purple)' }}>{row.hl7}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--shifa-green)' }}>{row.fhir}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Monitoring */}
      {activeTab === 'monitoring' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>État des connecteurs</h3>
            {lisConnectors.map(c => {
              const sc = statusConfig[c.status];
              return (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{c.protocol} · {c.lastSync}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{c.messagesDay.toLocaleString()}/j</span>
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Liens vers modules connexes</h3>
            {[
              { name: 'Lab Dashboard', href: '/lab-dashboard', desc: 'Tableau de bord laboratoire SHIFA', icon: 'BeakerIcon' },
              { name: 'Laboratory LMS', href: '/laboratory-lms', desc: 'LIMS complet SHIFA', icon: 'ClipboardDocumentListIcon' },
              { name: 'Lab Sample Transfer', href: '/lab-sample-transfer', desc: 'Réseau transfert échantillons', icon: 'TruckIcon' },
              { name: 'International Transfer', href: '/lab-international-transfer', desc: 'Transferts internationaux', icon: 'GlobeAltIcon' },
              { name: 'Interoperability Hub', href: '/interoperability-hub', desc: 'Hub FHIR/HL7/DICOM', icon: 'ArrowsRightLeftIcon' },
              { name: 'External Connectors', href: '/external-connectors', desc: 'Connecteurs externes', icon: 'PuzzlePieceIcon' },
              { name: 'Finance Dashboard', href: '/finance-dashboard', desc: 'Facturation analyses', icon: 'BanknotesIcon' },
            ].map(item => (
              <Link key={item.name} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'var(--background)', border: '1px solid var(--border)', marginBottom: '8px', textDecoration: 'none' }}>
                <Icon name={item.icon} size={16} color="var(--shifa-blue)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{item.desc}</div>
                </div>
                <Icon name="ArrowRightIcon" size={14} color="var(--muted-foreground)" style={{ marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
