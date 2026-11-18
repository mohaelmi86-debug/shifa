'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const tabs = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'standards', label: 'Standards (FHIR/HL7/DICOM)', icon: 'CodeBracketIcon' },
  { key: 'apis', label: 'APIs & Webhooks', icon: 'BoltIcon' },
  { key: 'integrations', label: 'Intégrations actives', icon: 'ArrowsRightLeftIcon' },
  { key: 'logs', label: 'Journaux d\'intégration', icon: 'ClipboardDocumentListIcon' },
];

const kpis = [
  { label: 'Intégrations actives', value: '24', sub: '3 en attente', icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Messages FHIR/jour', value: '48 240', sub: '+12% vs hier', icon: 'CodeBracketIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Taux de succès', value: '99.7%', sub: '0.3% erreurs', icon: 'CheckCircleIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)' },
  { label: 'Latence moyenne', value: '142 ms', sub: 'P99: 480 ms', icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Webhooks actifs', value: '18', sub: '2 en erreur', icon: 'BoltIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Partenaires connectés', value: '37', sub: '12 hôpitaux, 25 autres', icon: 'BuildingOffice2Icon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
];

const standards = [
  { id: 'std-001', nom: 'FHIR R4', type: 'HL7 FHIR', version: 'R4 (4.0.1)', statut: 'actif', endpoints: 42, messages_jour: 28400, derniere_sync: 'Il y a 2 min', description: 'Ressources patients, observations, prescriptions, rendez-vous' },
  { id: 'std-002', nom: 'HL7 v2.x', type: 'HL7 v2', version: '2.5.1', statut: 'actif', endpoints: 18, messages_jour: 12800, derniere_sync: 'Il y a 5 min', description: 'ADT, ORM, ORU — admissions, ordres, résultats' },
  { id: 'std-003', nom: 'DICOM 3.0', type: 'DICOM', version: '3.0 (2023)', statut: 'actif', endpoints: 8, messages_jour: 4200, derniere_sync: 'Il y a 1 min', description: 'Imagerie médicale — PACS, modalités, worklist' },
  { id: 'std-004', nom: 'CDA R2', type: 'HL7 CDA', version: 'R2 Level 3', statut: 'actif', endpoints: 6, messages_jour: 1840, derniere_sync: 'Il y a 8 min', description: 'Documents cliniques structurés — comptes rendus, résumés' },
  { id: 'std-005', nom: 'IHE XDS.b', type: 'IHE Profile', version: 'ITI-41/42/43', statut: 'beta', endpoints: 4, messages_jour: 620, derniere_sync: 'Il y a 15 min', description: 'Partage de documents entre établissements' },
  { id: 'std-006', nom: 'SNOMED CT', type: 'Terminologie', version: '2024-01', statut: 'actif', endpoints: 2, messages_jour: 380, derniere_sync: 'Il y a 30 min', description: 'Codification clinique — diagnostics, procédures' },
];

const apis = [
  { id: 'api-001', nom: 'SHIFA Patient API', methode: 'REST', version: 'v2.1', cle: 'sk_live_...4K2D', statut: 'actif', appels_jour: 18400, quota: 50000, latence: '98 ms', auth: 'OAuth 2.0' },
  { id: 'api-002', nom: 'SHIFA Appointments API', methode: 'REST', version: 'v1.8', cle: 'sk_live_...8R3F', statut: 'actif', appels_jour: 8240, quota: 20000, latence: '112 ms', auth: 'API Key' },
  { id: 'api-003', nom: 'SHIFA Lab Results API', methode: 'REST', version: 'v1.5', cle: 'sk_live_...2P9L', statut: 'actif', appels_jour: 4820, quota: 10000, latence: '145 ms', auth: 'OAuth 2.0' },
  { id: 'api-004', nom: 'SHIFA Imaging API', methode: 'REST/DICOM', version: 'v1.2', cle: 'sk_live_...7M4T', statut: 'actif', appels_jour: 2140, quota: 5000, latence: '280 ms', auth: 'mTLS' },
  { id: 'api-005', nom: 'SHIFA Webhook Dispatcher', methode: 'WebSocket', version: 'v1.0', cle: 'wh_live_...5X0Q', statut: 'actif', appels_jour: 12800, quota: 100000, latence: '42 ms', auth: 'HMAC-SHA256' },
  { id: 'api-006', nom: 'SHIFA Analytics API', methode: 'GraphQL', version: 'v1.1', cle: 'sk_live_...9B2R', statut: 'maintenance', appels_jour: 0, quota: 5000, latence: '—', auth: 'API Key' },
];

const webhooks = [
  { id: 'wh-001', nom: 'CHU Dakar — Admissions', url: 'https://chu-dakar.sn/webhooks/shifa', evenements: ['patient.admitted', 'patient.discharged'], statut: 'actif', derniere_livraison: 'Il y a 3 min', taux_succes: '99.8%' },
  { id: 'wh-002', nom: 'Assurance NSIA — Sinistres', url: 'https://nsia.sn/api/webhooks', evenements: ['claim.created', 'claim.approved', 'claim.paid'], statut: 'actif', derniere_livraison: 'Il y a 7 min', taux_succes: '98.4%' },
  { id: 'wh-003', nom: 'Ministère Santé — Alertes', url: 'https://msas.gouv.sn/api/shifa', evenements: ['alert.epidemio', 'report.weekly'], statut: 'actif', derniere_livraison: 'Il y a 1h', taux_succes: '100%' },
  { id: 'wh-004', nom: 'Pharmacie Centrale — Stock', url: 'https://pharma-centrale.sn/hooks', evenements: ['stock.low', 'order.confirmed'], statut: 'erreur', derniere_livraison: 'Il y a 2h', taux_succes: '72.1%' },
  { id: 'wh-005', nom: 'Labo BioSanté — Résultats', url: 'https://biosante.sn/webhooks', evenements: ['result.ready', 'result.critical'], statut: 'actif', derniere_livraison: 'Il y a 12 min', taux_succes: '99.2%' },
];

const integrations = [
  { id: 'int-001', partenaire: 'CHU de Dakar', type: 'Hôpital', protocole: 'FHIR R4 + HL7 v2', statut: 'actif', flux_entrant: 4820, flux_sortant: 3240, derniere_sync: '10 août 2026 22:38', sla: '99.9%' },
  { id: 'int-002', partenaire: 'Clinique du Cap-Vert', type: 'Clinique', protocole: 'FHIR R4', statut: 'actif', flux_entrant: 1840, flux_sortant: 1240, derniere_sync: '10 août 2026 22:35', sla: '99.5%' },
  { id: 'int-003', partenaire: 'NSIA Assurances', type: 'Assurance', protocole: 'REST API + Webhooks', statut: 'actif', flux_entrant: 2840, flux_sortant: 1820, derniere_sync: '10 août 2026 22:40', sla: '99.8%' },
  { id: 'int-004', partenaire: 'Ministère de la Santé', type: 'Gouvernement', protocole: 'IHE XDS.b + FHIR', statut: 'actif', flux_entrant: 480, flux_sortant: 820, derniere_sync: '10 août 2026 21:00', sla: '99.9%' },
  { id: 'int-005', partenaire: 'CHR Saint-Louis', type: 'Hôpital', protocole: 'HL7 v2.5', statut: 'actif', flux_entrant: 980, flux_sortant: 640, derniere_sync: '10 août 2026 22:30', sla: '98.7%' },
  { id: 'int-006', partenaire: 'Laboratoire BioSanté', type: 'Laboratoire', protocole: 'FHIR R4 (Observations)', statut: 'actif', flux_entrant: 3840, flux_sortant: 280, derniere_sync: '10 août 2026 22:42', sla: '99.6%' },
  { id: 'int-007', partenaire: 'Centre Imagerie Dakar', type: 'Imagerie', protocole: 'DICOM 3.0 + FHIR', statut: 'actif', flux_entrant: 1240, flux_sortant: 480, derniere_sync: '10 août 2026 22:28', sla: '99.1%' },
  { id: 'int-008', partenaire: 'Pharmacie Centrale', type: 'Pharmacie', protocole: 'REST API', statut: 'erreur', flux_entrant: 0, flux_sortant: 0, derniere_sync: '10 août 2026 20:15', sla: '94.2%' },
];

const logs = [
  { id: 'log-001', timestamp: '22:42:07', source: 'CHU Dakar', destination: 'SHIFA Core', type: 'FHIR', operation: 'POST /Patient', statut: 'success', duree: '98 ms', taille: '2.4 KB' },
  { id: 'log-002', timestamp: '22:42:05', source: 'SHIFA Core', destination: 'NSIA Assurances', type: 'Webhook', operation: 'claim.created', statut: 'success', duree: '42 ms', taille: '1.1 KB' },
  { id: 'log-003', timestamp: '22:41:58', source: 'Labo BioSanté', destination: 'SHIFA Core', type: 'FHIR', operation: 'POST /Observation', statut: 'success', duree: '112 ms', taille: '3.8 KB' },
  { id: 'log-004', timestamp: '22:41:52', source: 'SHIFA Core', destination: 'Pharmacie Centrale', type: 'Webhook', operation: 'stock.low', statut: 'error', duree: '5000 ms', taille: '0.8 KB' },
  { id: 'log-005', timestamp: '22:41:48', source: 'Centre Imagerie', destination: 'SHIFA Core', type: 'DICOM', operation: 'C-STORE', statut: 'success', duree: '284 ms', taille: '48.2 MB' },
  { id: 'log-006', timestamp: '22:41:40', source: 'SHIFA Core', destination: 'Ministère Santé', type: 'IHE XDS', operation: 'ITI-41 Provide', statut: 'success', duree: '320 ms', taille: '12.4 KB' },
  { id: 'log-007', timestamp: '22:41:35', source: 'Clinique Cap-Vert', destination: 'SHIFA Core', type: 'HL7 v2', operation: 'ADT^A01', statut: 'success', duree: '78 ms', taille: '1.2 KB' },
  { id: 'log-008', timestamp: '22:41:28', source: 'SHIFA Core', destination: 'CHR Saint-Louis', type: 'HL7 v2', operation: 'ORU^R01', statut: 'warning', duree: '1240 ms', taille: '4.8 KB' },
];

const trafficData = [
  { heure: '16h', fhir: 3200, hl7: 1800, dicom: 420, webhooks: 980 },
  { heure: '17h', fhir: 3800, hl7: 2100, dicom: 380, webhooks: 1240 },
  { heure: '18h', fhir: 4200, hl7: 2400, dicom: 520, webhooks: 1480 },
  { heure: '19h', fhir: 3600, hl7: 1900, dicom: 340, webhooks: 1120 },
  { heure: '20h', fhir: 2800, hl7: 1400, dicom: 280, webhooks: 840 },
  { heure: '21h', fhir: 2200, hl7: 1100, dicom: 220, webhooks: 680 },
  { heure: '22h', fhir: 2400, hl7: 1200, dicom: 240, webhooks: 720 },
];

const latencyData = [
  { heure: '16h', p50: 82, p95: 240, p99: 420 },
  { heure: '17h', p50: 94, p95: 280, p99: 480 },
  { heure: '18h', p50: 112, p95: 320, p99: 560 },
  { heure: '19h', p50: 88, p95: 260, p99: 440 },
  { heure: '20h', p50: 76, p95: 220, p99: 380 },
  { heure: '21h', p50: 68, p95: 200, p99: 340 },
  { heure: '22h', p50: 72, p95: 210, p99: 360 },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  beta: { label: 'Bêta', bg: '#fef9c3', text: '#ca8a04' },
  erreur: { label: 'Erreur', bg: '#fee2e2', text: '#dc2626' },
  maintenance: { label: 'Maintenance', bg: '#f1f5f9', text: '#64748b' },
  success: { label: 'Succès', bg: '#dcfce7', text: '#16a34a' },
  error: { label: 'Erreur', bg: '#fee2e2', text: '#dc2626' },
  warning: { label: 'Avertissement', bg: '#fef9c3', text: '#ca8a04' },
};

export default function InteroperabilityHubContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [logFilter, setLogFilter] = useState('all');

  const filteredLogs = logFilter === 'all' ? logs : logs.filter(l => l.statut === logFilter || l.type.toLowerCase().includes(logFilter));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="ArrowsRightLeftIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>Hub d'Interopérabilité</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>FHIR R4 · HL7 v2 · DICOM · APIs · Webhooks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>Tous systèmes opérationnels</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />
              Nouvelle intégration
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.key ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.map(kpi => (
                <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>{kpi.value}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Trafic par protocole (messages/heure)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="heure" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="fhir" name="FHIR" fill="var(--shifa-blue)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="hl7" name="HL7" fill="var(--shifa-cyan)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="dicom" name="DICOM" fill="var(--shifa-purple)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="webhooks" name="Webhooks" fill="var(--shifa-amber)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Latence (ms) — P50 / P95 / P99</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="heure" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="p50" name="P50" stroke="var(--shifa-green)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="p95" name="P95" stroke="var(--shifa-amber)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="p99" name="P99" stroke="var(--shifa-red)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent logs preview */}
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Derniers événements</h3>
                <button onClick={() => setActiveTab('logs')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tous les journaux →</button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {logs.slice(0, 5).map(log => {
                  const s = statusConfig[log.statut];
                  return (
                    <div key={log.id} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-xs font-mono w-14 shrink-0" style={{ color: 'var(--muted-foreground)' }}>{log.timestamp}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{log.type}</span>
                      <span className="text-xs flex-1 truncate" style={{ color: 'var(--foreground)' }}>{log.source} → {log.destination}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.operation}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      <span className="text-xs font-mono shrink-0" style={{ color: 'var(--muted-foreground)' }}>{log.duree}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Standards Tab */}
        {activeTab === 'standards' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standards.map(std => {
                const s = statusConfig[std.statut];
                return (
                  <div key={std.id} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{std.nom}</h3>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{std.type} · {std.version}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold" style={{ color: 'var(--shifa-blue)', fontFamily: 'DM Sans, sans-serif' }}>{std.messages_jour.toLocaleString()}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>msg/jour</p>
                      </div>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{std.description}</p>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>{std.endpoints} endpoints actifs</span>
                      <span>Sync: {std.derniere_sync}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* APIs & Webhooks Tab */}
        {activeTab === 'apis' && (
          <div className="space-y-6">
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>APIs SHIFA</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['API', 'Méthode', 'Version', 'Clé API', 'Appels/jour', 'Quota', 'Latence', 'Auth', 'Statut'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {apis.map(api => {
                      const s = statusConfig[api.statut];
                      const pct = Math.round((api.appels_jour / api.quota) * 100);
                      return (
                        <tr key={api.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{api.nom}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--shifa-blue)' }}>{api.methode}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{api.version}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted-foreground)' }}>{api.cle}</td>
                          <td className="px-4 py-3">
                            <div>
                              <span style={{ color: 'var(--foreground)' }}>{api.appels_jour.toLocaleString()}</span>
                              <div className="w-20 h-1 rounded-full mt-1" style={{ backgroundColor: 'var(--muted)' }}>
                                <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? 'var(--shifa-red)' : 'var(--shifa-blue)' }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{api.quota.toLocaleString()}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--foreground)' }}>{api.latence}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{api.auth}</td>
                          <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Webhooks configurés</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  <Icon name="PlusIcon" size={12} />
                  Ajouter webhook
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {webhooks.map(wh => {
                  const s = statusConfig[wh.statut];
                  return (
                    <div key={wh.id} className="px-5 py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{wh.nom}</h4>
                            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                          </div>
                          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{wh.url}</p>
                        </div>
                        <div className="text-right text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          <p>Succès: <span className="font-semibold" style={{ color: 'var(--shifa-green)' }}>{wh.taux_succes}</span></p>
                          <p>{wh.derniere_livraison}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {wh.evenements.map(ev => (
                          <span key={ev} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{ev}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Intégrations actives ({integrations.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Partenaire', 'Type', 'Protocole', 'Flux entrant', 'Flux sortant', 'Dernière sync', 'SLA', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {integrations.map(int => {
                    const s = statusConfig[int.statut];
                    return (
                      <tr key={int.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{int.partenaire}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{int.type}</td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{int.protocole}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{int.flux_entrant.toLocaleString()}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{int.flux_sortant.toLocaleString()}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{int.derniere_sync}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-green)' }}>{int.sla}</td>
                        <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1 rounded hover:bg-muted transition-colors" title="Configurer"><Icon name="Cog6ToothIcon" size={14} className="text-muted-foreground" /></button>
                            <button className="p-1 rounded hover:bg-muted transition-colors" title="Tester"><Icon name="PlayIcon" size={14} className="text-muted-foreground" /></button>
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

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'success', label: 'Succès' },
                { key: 'error', label: 'Erreurs' },
                { key: 'warning', label: 'Avertissements' },
                { key: 'fhir', label: 'FHIR' },
                { key: 'hl7', label: 'HL7' },
                { key: 'dicom', label: 'DICOM' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setLogFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${logFilter === f.key ? 'text-white' : 'hover:bg-muted'}`}
                  style={logFilter === f.key ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      {['Heure', 'Type', 'Source', 'Destination', 'Opération', 'Statut', 'Durée', 'Taille'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {filteredLogs.map(log => {
                      const s = statusConfig[log.statut];
                      return (
                        <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.timestamp}</td>
                          <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{log.type}</span></td>
                          <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{log.source}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{log.destination}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.operation}</td>
                          <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--foreground)' }}>{log.duree}</td>
                          <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.taille}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
