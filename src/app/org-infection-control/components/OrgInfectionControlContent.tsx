'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type TabKey = 'dashboard' | 'surveillance' | 'protocols' | 'hand-hygiene' | 'alerts' | 'clin';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'surveillance', label: 'Surveillance IAS', icon: 'EyeIcon' },
  { key: 'protocols', label: 'Protocoles nettoyage', icon: 'ClipboardDocumentListIcon' },
  { key: 'hand-hygiene', label: 'Hygiène des mains', icon: 'HandRaisedIcon' },
  { key: 'alerts', label: 'Alertes épidémiques', icon: 'ExclamationTriangleIcon' },
  { key: 'clin', label: 'Tableau de bord CLIN', icon: 'ChartBarSquareIcon' },
];

const kpis = [
  { label: 'Taux IAS global', value: '2.4%', sub: 'Objectif ≤ 3%', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)', trend: '↓ -0.3%' },
  { label: 'Compliance SHA', value: '78%', sub: 'Objectif ≥ 85%', icon: 'HandRaisedIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', trend: '↑ +4%' },
  { label: 'Alertes actives', value: '2', sub: '1 en investigation', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', trend: '' },
  { label: 'Audits ce mois', value: '34', sub: '28 conformes', icon: 'ClipboardDocumentCheckIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)', trend: '82% conformité' },
];

const iasData = [
  { month: 'Mar', ias: 2.8, target: 3.0 }, { month: 'Avr', ias: 2.6, target: 3.0 },
  { month: 'Mai', ias: 2.9, target: 3.0 }, { month: 'Jun', ias: 2.5, target: 3.0 },
  { month: 'Jul', ias: 2.7, target: 3.0 }, { month: 'Aoû', ias: 2.4, target: 3.0 },
];

const iasCases = [
  { id: 'IAS-001', type: 'Infection urinaire sur sonde', service: 'Réanimation', patient: 'PAT-7K4D', onset: '08/08/2026', pathogen: 'E. coli BLSE', status: 'confirmed', severity: 'moderate' },
  { id: 'IAS-002', type: 'Pneumonie sous ventilation', service: 'Réanimation', patient: 'PAT-3M2K', onset: '07/08/2026', pathogen: 'Klebsiella pneumoniae', status: 'confirmed', severity: 'severe' },
  { id: 'IAS-003', type: 'Infection site opératoire', service: 'Chirurgie', patient: 'PAT-9P1R', onset: '05/08/2026', pathogen: 'Staphylococcus aureus', status: 'suspected', severity: 'mild' },
  { id: 'IAS-004', type: 'Bactériémie sur cathéter', service: 'Oncologie', patient: 'PAT-4Q6V', onset: '03/08/2026', pathogen: 'Candida albicans', status: 'confirmed', severity: 'severe' },
  { id: 'IAS-005', type: 'Infection urinaire sur sonde', service: 'Médecine interne', patient: 'PAT-2L8S', onset: '01/08/2026', pathogen: 'Enterococcus faecalis', status: 'confirmed', severity: 'mild' },
];

const cleaningProtocols = [
  { zone: 'Bloc opératoire', frequency: 'Entre chaque intervention', product: 'Surfanios Premium', method: 'Désinfection haute niveau', lastAudit: '10/08/2026', compliance: 96, responsible: 'Équipe hygiène A' },
  { zone: 'Réanimation', frequency: 'Quotidienne + après chaque patient', product: 'Aniosurf ND', method: 'Désinfection niveau intermédiaire', lastAudit: '09/08/2026', compliance: 91, responsible: 'Équipe hygiène B' },
  { zone: 'Urgences', frequency: 'Toutes les 4h + après contamination', product: 'Aniosurf ND', method: 'Désinfection niveau intermédiaire', lastAudit: '08/08/2026', compliance: 88, responsible: 'Équipe hygiène C' },
  { zone: 'Chambres hospitalisation', frequency: 'Quotidienne + sortie patient', product: 'Surfa Safe Premium', method: 'Désinfection niveau bas', lastAudit: '07/08/2026', compliance: 94, responsible: 'Équipe hygiène A' },
  { zone: 'Laboratoire', frequency: 'Quotidienne + après manipulation', product: 'Aniosurf ND', method: 'Désinfection niveau intermédiaire', lastAudit: '06/08/2026', compliance: 97, responsible: 'Équipe hygiène B' },
  { zone: 'Pharmacie', frequency: 'Quotidienne', product: 'Surfa Safe Premium', method: 'Désinfection niveau bas', lastAudit: '05/08/2026', compliance: 99, responsible: 'Équipe hygiène C' },
];

const handHygieneAudits = [
  { service: 'Réanimation', auditor: 'Inf. Kouyaté', date: '10/08/2026', observations: 45, compliant: 38, rate: 84, moments: { before: 88, after: 92, aseptic: 79, fluid: 95, environment: 76 } },
  { service: 'Chirurgie', auditor: 'Inf. Diallo', date: '09/08/2026', observations: 52, compliant: 47, rate: 90, moments: { before: 92, after: 96, aseptic: 85, fluid: 98, environment: 82 } },
  { service: 'Urgences', auditor: 'Inf. Ba', date: '08/08/2026', observations: 38, compliant: 28, rate: 74, moments: { before: 76, after: 82, aseptic: 68, fluid: 88, environment: 65 } },
  { service: 'Médecine interne', auditor: 'Inf. Sow', date: '07/08/2026', observations: 41, compliant: 33, rate: 80, moments: { before: 82, after: 88, aseptic: 74, fluid: 91, environment: 72 } },
  { service: 'Pédiatrie', auditor: 'Inf. Ndiaye', date: '06/08/2026', observations: 35, compliant: 30, rate: 86, moments: { before: 88, after: 94, aseptic: 80, fluid: 96, environment: 78 } },
];

const shaConsumption = [
  { month: 'Mar', liters: 48 }, { month: 'Avr', liters: 52 }, { month: 'Mai', liters: 55 },
  { month: 'Jun', liters: 51 }, { month: 'Jul', liters: 58 }, { month: 'Aoû', liters: 61 },
];

const epidemicAlerts = [
  { id: 'ALT-001', type: 'Cluster IAS', pathogen: 'Klebsiella pneumoniae carbapénémase', service: 'Réanimation', cases: 3, onset: '06/08/2026', status: 'investigation', level: 'high', measures: ['Isolement contact renforcé', 'Dépistage contacts', 'Renforcement SHA', 'Prélèvements environnementaux'] },
  { id: 'ALT-002', type: 'Augmentation IU', pathogen: 'E. coli BLSE', service: 'Médecine interne', cases: 4, onset: '01/08/2026', status: 'monitoring', level: 'medium', measures: ['Révision protocoles sondage', 'Formation équipe', 'Audit pratiques'] },
];

const clinIndicators = [
  { category: 'Infections du site opératoire', rate: 1.2, target: 2.0, trend: 'down', status: 'good' },
  { category: 'Pneumonies sous ventilation', rate: 8.4, target: 10.0, trend: 'stable', status: 'good' },
  { category: 'Infections urinaires sur sonde', rate: 3.1, target: 4.0, trend: 'up', status: 'warning' },
  { category: 'Bactériémies sur cathéter', rate: 1.8, target: 2.5, trend: 'down', status: 'good' },
  { category: 'Compliance SHA globale', rate: 78, target: 85, trend: 'up', status: 'warning' },
  { category: 'Conformité protocoles nettoyage', rate: 93, target: 90, trend: 'stable', status: 'good' },
];

const severityConfig: Record<string, { label: string; bg: string; color: string }> = {
  mild: { label: 'Légère', bg: '#dbeafe', color: '#1d4ed8' },
  moderate: { label: 'Modérée', bg: '#fef3c7', color: '#b45309' },
  severe: { label: 'Sévère', bg: '#fee2e2', color: '#dc2626' },
  confirmed: { label: 'Confirmé', bg: '#dcfce7', color: '#16a34a' },
  suspected: { label: 'Suspecté', bg: '#fef3c7', color: '#b45309' },
  investigation: { label: 'Investigation', bg: '#fee2e2', color: '#dc2626' },
  monitoring: { label: 'Surveillance', bg: '#fef3c7', color: '#b45309' },
  high: { label: 'Élevé', bg: '#fee2e2', color: '#dc2626' },
  medium: { label: 'Modéré', bg: '#fef3c7', color: '#b45309' },
};

export default function OrgInfectionControlContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
              <Icon name="ShieldCheckIcon" className="w-5 h-5" style={{ color: '#dc2626' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Hygiène & Prévention des Infections</h1>
              <p className="text-sm text-gray-500">Surveillance IAS · Protocoles · Audits · CLIN</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>
              2 alertes actives
            </span>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" className="w-4 h-4" />
              Déclarer IAS
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: kpi.bg }}>
                      <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                    </div>
                    {kpi.trend && <span className="text-xs font-medium text-gray-500">{kpi.trend}</span>}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">{kpi.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Évolution taux IAS (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={iasData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 4]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="ias" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Taux IAS" />
                    <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 4" name="Objectif" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Consommation SHA (litres/mois)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={shaConsumption}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="liters" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Litres SHA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent IAS Cases */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Cas IAS récents</h3>
                <button className="text-xs text-blue-600 font-medium">Voir tout</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['ID', 'Type', 'Service', 'Patient', 'Début', 'Pathogène', 'Statut', 'Sévérité'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {iasCases.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{c.type}</td>
                        <td className="px-4 py-3 text-gray-600">{c.service}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.patient}</td>
                        <td className="px-4 py-3 text-gray-600">{c.onset}</td>
                        <td className="px-4 py-3 text-gray-600 italic">{c.pathogen}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[c.status]?.bg, color: severityConfig[c.status]?.color }}>
                            {severityConfig[c.status]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[c.severity]?.bg, color: severityConfig[c.severity]?.color }}>
                            {severityConfig[c.severity]?.label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Surveillance IAS Tab */}
        {activeTab === 'surveillance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Surveillance des Infections Associées aux Soins</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#dc2626' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouvelle déclaration IAS
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['ID', 'Type d\'infection', 'Service', 'Patient', 'Date début', 'Pathogène identifié', 'Statut', 'Sévérité', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {iasCases.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{c.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{c.type}</td>
                        <td className="px-4 py-3 text-gray-600">{c.service}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.patient}</td>
                        <td className="px-4 py-3 text-gray-600">{c.onset}</td>
                        <td className="px-4 py-3 text-gray-600 italic text-xs">{c.pathogen}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[c.status]?.bg, color: severityConfig[c.status]?.color }}>
                            {severityConfig[c.status]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[c.severity]?.bg, color: severityConfig[c.severity]?.color }}>
                            {severityConfig[c.severity]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Voir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Cleaning Protocols Tab */}
        {activeTab === 'protocols' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Protocoles de Nettoyage & Désinfection par Zone</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouveau protocole
              </button>
            </div>
            <div className="grid gap-4">
              {cleaningProtocols.map((p, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{p.zone}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: p.compliance >= 95 ? '#dcfce7' : p.compliance >= 85 ? '#fef3c7' : '#fee2e2', color: p.compliance >= 95 ? '#16a34a' : p.compliance >= 85 ? '#b45309' : '#dc2626' }}>
                          {p.compliance}% conformité
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><span className="text-gray-500">Fréquence:</span> <span className="text-gray-700 font-medium">{p.frequency}</span></div>
                        <div><span className="text-gray-500">Produit:</span> <span className="text-gray-700 font-medium">{p.product}</span></div>
                        <div><span className="text-gray-500">Méthode:</span> <span className="text-gray-700 font-medium">{p.method}</span></div>
                        <div><span className="text-gray-500">Responsable:</span> <span className="text-gray-700 font-medium">{p.responsible}</span></div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Taux de conformité</span>
                          <span>Dernier audit: {p.lastAudit}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${p.compliance}%`, background: p.compliance >= 95 ? '#16a34a' : p.compliance >= 85 ? '#f59e0b' : '#dc2626' }} />
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 text-blue-600 hover:text-blue-800 text-xs font-medium">Voir protocole</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hand Hygiene Tab */}
        {activeTab === 'hand-hygiene' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Audits Hygiène des Mains — 5 Moments OMS</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouvel audit
              </button>
            </div>
            <div className="grid gap-4">
              {handHygieneAudits.map((a, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{a.service}</h3>
                      <p className="text-sm text-gray-500">Auditeur: {a.auditor} · {a.date} · {a.observations} observations</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: a.rate >= 85 ? '#16a34a' : a.rate >= 75 ? '#f59e0b' : '#dc2626' }}>{a.rate}%</div>
                      <div className="text-xs text-gray-500">{a.compliant}/{a.observations} conformes</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: 'Avant contact', value: a.moments.before },
                      { label: 'Avant geste aseptique', value: a.moments.aseptic },
                      { label: 'Après risque liquide', value: a.moments.fluid },
                      { label: 'Après contact patient', value: a.moments.after },
                      { label: 'Après environnement', value: a.moments.environment },
                    ].map((m, j) => (
                      <div key={j} className="text-center p-3 rounded-lg bg-gray-50">
                        <div className="text-lg font-bold" style={{ color: m.value >= 85 ? '#16a34a' : m.value >= 75 ? '#f59e0b' : '#dc2626' }}>{m.value}%</div>
                        <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Epidemic Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Alertes Épidémiques Intra-Hospitalières</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#dc2626' }}>
                <Icon name="ExclamationTriangleIcon" className="w-4 h-4" />
                Déclarer alerte
              </button>
            </div>
            <div className="grid gap-4">
              {epidemicAlerts.map(alert => (
                <div key={alert.id} className="bg-white rounded-xl p-5 border-l-4 shadow-sm" style={{ borderLeftColor: alert.level === 'high' ? '#dc2626' : '#f59e0b' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-gray-500">{alert.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[alert.level]?.bg, color: severityConfig[alert.level]?.color }}>
                          Risque {severityConfig[alert.level]?.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: severityConfig[alert.status]?.bg, color: severityConfig[alert.status]?.color }}>
                          {severityConfig[alert.status]?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{alert.type}</h3>
                      <p className="text-sm text-gray-600 italic">{alert.pathogen}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{alert.cases}</div>
                      <div className="text-xs text-gray-500">cas identifiés</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="text-gray-500">Service:</span> <span className="font-medium text-gray-700">{alert.service}</span></div>
                    <div><span className="text-gray-500">Début:</span> <span className="font-medium text-gray-700">{alert.onset}</span></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mesures en place</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.measures.map((m, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIN Dashboard Tab */}
        {activeTab === 'clin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tableau de Bord CLIN — Comité de Lutte contre les Infections Nosocomiales</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="DocumentArrowDownIcon" className="w-4 h-4" />
                Exporter rapport CLIN
              </button>
            </div>
            <div className="grid gap-4">
              {clinIndicators.map((ind, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{ind.category}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm text-gray-500">Valeur actuelle: <span className="font-bold text-gray-900">{ind.rate}{ind.category.includes('Compliance') || ind.category.includes('Conformité') ? '%' : '‰'}</span></div>
                        <div className="text-sm text-gray-500">Objectif: <span className="font-medium text-gray-700">{ind.target}{ind.category.includes('Compliance') || ind.category.includes('Conformité') ? '%' : '‰'}</span></div>
                        <div className="flex items-center gap-1 text-sm">
                          <Icon name={ind.trend === 'down' ? 'ArrowDownIcon' : ind.trend === 'up' ? 'ArrowUpIcon' : 'MinusIcon'} className="w-3 h-3" style={{ color: ind.trend === 'down' ? '#16a34a' : ind.trend === 'up' ? '#dc2626' : '#6b7280' }} />
                          <span style={{ color: ind.trend === 'down' ? '#16a34a' : ind.trend === 'up' ? '#dc2626' : '#6b7280' }} className="text-xs font-medium">
                            {ind.trend === 'down' ? 'En baisse' : ind.trend === 'up' ? 'En hausse' : 'Stable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${Math.min((ind.rate / ind.target) * 100, 100)}%`, background: ind.status === 'good' ? '#16a34a' : '#f59e0b' }} />
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: ind.status === 'good' ? '#dcfce7' : '#fef3c7', color: ind.status === 'good' ? '#16a34a' : '#b45309' }}>
                        {ind.status === 'good' ? '✓ Objectif atteint' : '⚠ À améliorer'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
