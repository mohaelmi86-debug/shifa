'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type Tab = 'dashboard' | 'custom' | 'scheduled' | 'exports' | 'templates';

const activityData = [
  { month: 'Mar', consultations: 420, admissions: 85, teleconsult: 130 },
  { month: 'Avr', consultations: 480, admissions: 92, teleconsult: 155 },
  { month: 'Mai', consultations: 510, admissions: 78, teleconsult: 180 },
  { month: 'Juin', consultations: 465, admissions: 95, teleconsult: 165 },
  { month: 'Juil', consultations: 530, admissions: 88, teleconsult: 210 },
  { month: 'Août', consultations: 490, admissions: 82, teleconsult: 195 },
];

const revenueData = [
  { month: 'Mar', revenue: 4200000 },
  { month: 'Avr', revenue: 4800000 },
  { month: 'Mai', revenue: 5100000 },
  { month: 'Juin', revenue: 4650000 },
  { month: 'Juil', revenue: 5300000 },
  { month: 'Août', revenue: 4900000 },
];

interface ScheduledReport {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextRun: string;
  recipients: string[];
  format: string;
  status: 'active' | 'paused';
}

const scheduledReports: ScheduledReport[] = [
  { id: 'SR-001', name: 'Rapport d\'activité mensuel', type: 'Activité', frequency: 'Mensuel', nextRun: '1 sept. 2026', recipients: ['direction@chu.sn', 'dsi@chu.sn'], format: 'PDF', status: 'active' },
  { id: 'SR-002', name: 'Bilan financier hebdomadaire', type: 'Finance', frequency: 'Hebdomadaire', nextRun: '18 août 2026', recipients: ['daf@chu.sn'], format: 'Excel', status: 'active' },
  { id: 'SR-003', name: 'Indicateurs qualité trimestriels', type: 'Qualité', frequency: 'Trimestriel', nextRun: '1 oct. 2026', recipients: ['qualite@chu.sn', 'direction@chu.sn'], format: 'PDF', status: 'active' },
  { id: 'SR-004', name: 'Rapport RH mensuel', type: 'RH', frequency: 'Mensuel', nextRun: '1 sept. 2026', recipients: ['drh@chu.sn'], format: 'Excel', status: 'paused' },
];

interface ExportRecord {
  id: string;
  name: string;
  type: string;
  format: string;
  size: string;
  date: string;
  requestedBy: string;
  status: 'ready' | 'processing' | 'failed';
}

const exports: ExportRecord[] = [
  { id: 'EX-001', name: 'Activité_Juillet_2026.pdf', type: 'Activité', format: 'PDF', size: '2.4 MB', date: '1 août 2026', requestedBy: 'Dr. Sy', status: 'ready' },
  { id: 'EX-002', name: 'Finance_Q2_2026.xlsx', type: 'Finance', format: 'Excel', size: '1.8 MB', date: '15 juil. 2026', requestedBy: 'Admin', status: 'ready' },
  { id: 'EX-003', name: 'Patients_Anonymises_2026.csv', type: 'Patients', format: 'CSV', size: '5.2 MB', date: '10 août 2026', requestedBy: 'Dr. Camara', status: 'processing' },
  { id: 'EX-004', name: 'Rapport_Qualite_S1.pdf', type: 'Qualité', format: 'PDF', size: '3.1 MB', date: '5 août 2026', requestedBy: 'Admin', status: 'ready' },
];

export default function OrgReportingContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [reportType, setReportType] = useState('activite');
  const [reportPeriod, setReportPeriod] = useState('month');
  const [reportFormat, setReportFormat] = useState('pdf');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'ChartBarSquareIcon' },
    { key: 'custom', label: 'Rapport personnalisé', icon: 'AdjustmentsHorizontalIcon' },
    { key: 'scheduled', label: 'Exports planifiés', icon: 'CalendarDaysIcon' },
    { key: 'exports', label: 'Historique exports', icon: 'ArrowDownTrayIcon' },
    { key: 'templates', label: 'Modèles', icon: 'DocumentDuplicateIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Rapports & Exports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Rapports personnalisés, exports planifiés et tableaux de bord analytiques</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau rapport
          </button>
        </div>

        <div className="flex gap-1 mt-5 border-b border-border -mb-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Consultations (août)', value: '490', change: '+8%', up: true, icon: 'ClipboardDocumentListIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Admissions (août)', value: '82', change: '-7%', up: false, icon: 'UserPlusIcon', color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Téléconsultations', value: '195', change: '+18%', up: true, icon: 'VideoCameraIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Revenus (août)', value: '4,9M FCFA', change: '+5%', up: true, icon: 'BanknotesIcon', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <Icon name={kpi.icon} size={18} className={kpi.color} />
                    </div>
                    <span className={`text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>{kpi.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Activité — 6 derniers mois</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="consultations" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Consultations" />
                    <Bar dataKey="admissions" fill="#8b5cf6" radius={[3, 3, 0, 0]} name="Admissions" />
                    <Bar dataKey="teleconsult" fill="#10b981" radius={[3, 3, 0, 0]} name="Téléconsult." />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Revenus — 6 derniers mois (FCFA)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [`${(v / 1000000).toFixed(2)}M FCFA`, 'Revenus']} />
                    <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick exports */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Exports rapides</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Rapport mensuel PDF', icon: 'DocumentTextIcon', color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Données patients CSV', icon: 'TableCellsIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Bilan financier Excel', icon: 'BanknotesIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Indicateurs qualité', icon: 'ShieldCheckIcon', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(item => (
                  <button key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
                    <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                      <Icon name={item.icon} size={18} className={item.color} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Report Builder */}
        {activeTab === 'custom' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Configuration du rapport</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">TYPE DE RAPPORT</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
                      <option value="activite">Activité clinique</option>
                      <option value="finance">Finance & Facturation</option>
                      <option value="qualite">Qualité & Accréditation</option>
                      <option value="rh">Ressources Humaines</option>
                      <option value="patients">Données patients</option>
                      <option value="teleconsult">Téléconsultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">PÉRIODE</label>
                    <select value={reportPeriod} onChange={e => setReportPeriod(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground">
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                      <option value="quarter">Ce trimestre</option>
                      <option value="year">Cette année</option>
                      <option value="custom">Période personnalisée</option>
                    </select>
                  </div>
                  {reportPeriod === 'custom' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Du</label>
                        <input type="date" className="w-full border border-border rounded-lg px-2 py-1.5 text-sm bg-background text-foreground" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Au</label>
                        <input type="date" className="w-full border border-border rounded-lg px-2 py-1.5 text-sm bg-background text-foreground" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">FORMAT D'EXPORT</label>
                    <div className="flex gap-2">
                      {['pdf', 'excel', 'csv'].map(f => (
                        <button key={f} onClick={() => setReportFormat(f)} className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${reportFormat === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                          {f.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">MÉTRIQUES INCLUSES</label>
                    <div className="space-y-2">
                      {['Nombre de consultations', 'Durée moyenne', 'Taux d\'occupation', 'Revenus générés', 'Satisfaction patients', 'Indicateurs qualité'].map(m => (
                        <label key={m} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-foreground">{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                    Générer le rapport
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Aperçu du rapport</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted">
                    <Icon name="EyeIcon" size={14} /> Aperçu
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg" style={{ background: 'var(--primary)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} /> Exporter
                  </button>
                </div>
              </div>
              <div className="border border-dashed border-border rounded-xl p-8 text-center">
                <Icon name="DocumentChartBarIcon" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Rapport d'activité clinique — Août 2026</p>
                <p className="text-xs text-muted-foreground mt-1">Configurez les paramètres et cliquez sur "Générer" pour prévisualiser</p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-left">
                  {[
                    { label: 'Consultations totales', value: '490', sub: '+8% vs juillet' },
                    { label: 'Durée moyenne', value: '24 min', sub: '-2 min vs juillet' },
                    { label: 'Taux d\'occupation', value: '87%', sub: '+3% vs juillet' },
                    { label: 'Revenus générés', value: '4,9M FCFA', sub: '+5% vs juillet' },
                    { label: 'Satisfaction patients', value: '4.6/5', sub: 'Stable' },
                    { label: 'Incidents qualité', value: '2', sub: '-1 vs juillet' },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-bold text-foreground mt-0.5">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Reports */}
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Exports planifiés</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                <Icon name="PlusIcon" size={14} /> Planifier un export
              </button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Rapport', 'Type', 'Fréquence', 'Prochain envoi', 'Destinataires', 'Format', 'Statut', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scheduledReports.map(r => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.id}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{r.type}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{r.frequency}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{r.nextRun}</td>
                      <td className="px-4 py-3">
                        {r.recipients.map(rec => (
                          <p key={rec} className="text-xs text-muted-foreground">{rec}</p>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{r.format}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {r.status === 'active' ? 'Actif' : 'Pausé'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-primary hover:underline">Modifier</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export History */}
        {activeTab === 'exports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Historique des exports</h2>
              <div className="flex gap-2">
                <input type="text" placeholder="Rechercher..." className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground w-48" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Fichier', 'Type', 'Format', 'Taille', 'Date', 'Demandé par', 'Statut', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exports.map(ex => {
                    const statusMap = { ready: { label: 'Prêt', bg: 'bg-emerald-50', text: 'text-emerald-700' }, processing: { label: 'En cours', bg: 'bg-blue-50', text: 'text-blue-700' }, failed: { label: 'Échec', bg: 'bg-red-50', text: 'text-red-700' } };
                    const s = statusMap[ex.status];
                    return (
                      <tr key={ex.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon name="DocumentTextIcon" size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{ex.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{ex.type}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{ex.format}</span></td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{ex.size}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{ex.date}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{ex.requestedBy}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          {ex.status === 'ready' && (
                            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                              <Icon name="ArrowDownTrayIcon" size={13} /> Télécharger
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Rapport d\'activité standard', desc: 'Consultations, admissions, durées moyennes', type: 'Activité', icon: 'ClipboardDocumentListIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
              { name: 'Bilan financier mensuel', desc: 'Revenus, dépenses, facturation, tiers-payant', type: 'Finance', icon: 'BanknotesIcon', color: 'text-amber-600', bg: 'bg-amber-50' },
              { name: 'Tableau de bord qualité', desc: 'Indicateurs, incidents, non-conformités', type: 'Qualité', icon: 'ShieldCheckIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Rapport RH & plannings', desc: 'Effectifs, congés, heures supplémentaires', type: 'RH', icon: 'UsersIcon', color: 'text-purple-600', bg: 'bg-purple-50' },
              { name: 'Suivi téléconsultation', desc: 'Sessions, durées, satisfaction, revenus', type: 'Téléconsult.', icon: 'VideoCameraIcon', color: 'text-teal-600', bg: 'bg-teal-50' },
              { name: 'Rapport épidémiologique', desc: 'Pathologies, tendances, alertes sanitaires', type: 'Épidémio.', icon: 'ChartBarIcon', color: 'text-red-600', bg: 'bg-red-50' },
            ].map(tpl => (
              <div key={tpl.name} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-lg ${tpl.bg} flex items-center justify-center mb-3`}>
                  <Icon name={tpl.icon} size={20} className={tpl.color} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{tpl.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tpl.desc}</p>
                <span className="inline-block mt-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tpl.type}</span>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted transition-colors text-foreground">Utiliser</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-white rounded-lg" style={{ background: 'var(--primary)' }}>Personnaliser</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
