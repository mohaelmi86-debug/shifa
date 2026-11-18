'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type TabKey = 'forecast' | 'beds' | 'scenarios' | 'alerts' | 'export';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'forecast', label: 'Prévision d\'activité', icon: 'ChartBarIcon' },
  { key: 'beds', label: 'Modélisation lits', icon: 'HomeIcon' },
  { key: 'scenarios', label: 'Simulation scénarios', icon: 'AdjustmentsHorizontalIcon' },
  { key: 'alerts', label: 'Alertes saturation', icon: 'ExclamationTriangleIcon' },
  { key: 'export', label: 'Export direction', icon: 'DocumentArrowDownIcon' },
];

const kpis = [
  { label: 'Taux occupation actuel', value: '84%', sub: 'Seuil alerte: 90%', icon: 'HomeIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Admissions prévues J+7', value: '312', sub: '+8% vs semaine passée', icon: 'UserPlusIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Sorties prévues J+7', value: '287', sub: 'Solde net: +25 patients', icon: 'ArrowRightOnRectangleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Services en tension', value: '3', sub: 'Réanimation, Urgences, Chir.', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const forecast7Days = [
  { day: 'Mer 13', admissions: 44, discharges: 38, occupancy: 85 },
  { day: 'Jeu 14', admissions: 48, discharges: 42, occupancy: 87 },
  { day: 'Ven 15', admissions: 52, discharges: 45, occupancy: 89 },
  { day: 'Sam 16', admissions: 38, discharges: 50, occupancy: 84 },
  { day: 'Dim 17', admissions: 32, discharges: 44, occupancy: 80 },
  { day: 'Lun 18', admissions: 55, discharges: 40, occupancy: 88 },
  { day: 'Mar 19', admissions: 43, discharges: 28, occupancy: 91 },
];

const forecast30Days = [
  { week: 'S33', admissions: 312, discharges: 287, occupancy: 84 },
  { week: 'S34', admissions: 328, discharges: 301, occupancy: 86 },
  { week: 'S35', admissions: 345, discharges: 318, occupancy: 88 },
  { week: 'S36', admissions: 298, discharges: 334, occupancy: 83 },
  { week: 'S37', admissions: 315, discharges: 290, occupancy: 85 },
];

const bedsByService = [
  { service: 'Médecine interne', total: 48, occupied: 43, reserved: 2, available: 3, occupancy: 90, trend: 'up', alert: true },
  { service: 'Chirurgie générale', total: 36, occupied: 30, reserved: 2, available: 4, occupancy: 83, trend: 'stable', alert: false },
  { service: 'Réanimation', total: 12, occupied: 11, reserved: 1, available: 0, occupancy: 100, trend: 'up', alert: true },
  { service: 'Pédiatrie', total: 28, occupied: 20, reserved: 1, available: 7, occupancy: 71, trend: 'down', alert: false },
  { service: 'Maternité', total: 24, occupied: 19, reserved: 2, available: 3, occupancy: 79, trend: 'stable', alert: false },
  { service: 'Cardiologie', total: 20, occupied: 18, reserved: 1, available: 1, occupancy: 90, trend: 'up', alert: true },
  { service: 'Neurologie', total: 16, occupied: 12, reserved: 0, available: 4, occupancy: 75, trend: 'stable', alert: false },
  { service: 'Oncologie', total: 18, occupied: 16, reserved: 1, available: 1, occupancy: 89, trend: 'up', alert: false },
  { service: 'Urgences (UHCD)', total: 10, occupied: 9, reserved: 0, available: 1, occupancy: 90, trend: 'up', alert: true },
];

const scenarios = [
  {
    id: 'SC-001', name: 'Scénario de base', description: 'Activité normale sans événement exceptionnel', assumptions: ['Taux d\'occupation moyen 84%', 'Pas d\'épidémie saisonnière', 'Effectif nominal'], bedsNeeded: 212, staffNeeded: 0, cost: 0, feasibility: 'high', color: '#16a34a'
  },
  {
    id: 'SC-002', name: 'Pic d\'activité hivernal', description: 'Augmentation de 25% des admissions (grippe, bronchiolite)', assumptions: ['Admissions +25%', 'Durée séjour +10%', 'Renfort personnel requis'], bedsNeeded: 265, staffNeeded: 18, cost: 4200000, feasibility: 'medium', color: '#f59e0b'
  },
  {
    id: 'SC-003', name: 'Épidémie locale', description: 'Cluster épidémique nécessitant isolement renforcé', assumptions: ['Admissions +40%', 'Chambres individuelles requises', 'Renfort majeur'], bedsNeeded: 297, staffNeeded: 32, cost: 8500000, feasibility: 'low', color: '#dc2626'
  },
  {
    id: 'SC-004', name: 'Optimisation sorties', description: 'Programme de sortie précoce et HAD renforcée', assumptions: ['Durée séjour -15%', 'HAD +30 patients/mois', 'Coordination renforcée'], bedsNeeded: 180, staffNeeded: -5, cost: -1200000, feasibility: 'high', color: '#7c3aed'
  },
];

const saturationAlerts = [
  { service: 'Réanimation', occupancy: 100, trend: '+2 patients attendus demain', level: 'critical', action: 'Activation plan blanc partiel — transferts vers CHU recommandés' },
  { service: 'Médecine interne', occupancy: 90, trend: '+5 admissions prévues J+2', level: 'warning', action: 'Accélérer sorties planifiées — contacter HAD pour 3 patients éligibles' },
  { service: 'Cardiologie', occupancy: 90, trend: 'Stable', level: 'warning', action: 'Surveiller — 2 patients en attente de chambre aux urgences' },
  { service: 'Urgences (UHCD)', occupancy: 90, trend: '+3 patients attendus ce soir', level: 'warning', action: 'Préparer transferts vers médecine interne — 2 lits libérables' },
];

const alertLevelConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626', border: '#dc2626' },
  warning: { label: 'Attention', bg: '#fef3c7', color: '#b45309', border: '#f59e0b' },
  ok: { label: 'Normal', bg: '#dcfce7', color: '#16a34a', border: '#16a34a' },
};

export default function OrgCapacityPlanningContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('forecast');
  const [forecastPeriod, setForecastPeriod] = useState<'7' | '30'>('7');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.1)' }}>
              <Icon name="ChartBarSquareIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Planification Capacitaire</h1>
              <p className="text-sm text-gray-500">Prévision activité · Modélisation lits · Scénarios · Alertes saturation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>
              3 services en tension
            </span>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
              <Icon name="DocumentArrowDownIcon" className="w-4 h-4" />
              Rapport direction
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
        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: kpi.bg }}>
                    <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">{kpi.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Prévision d'activité</h3>
                <div className="flex gap-2">
                  <button onClick={() => setForecastPeriod('7')} className={`px-3 py-1 rounded-lg text-xs font-medium ${forecastPeriod === '7' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>J+7</button>
                  <button onClick={() => setForecastPeriod('30')} className={`px-3 py-1 rounded-lg text-xs font-medium ${forecastPeriod === '30' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>J+30</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={forecastPeriod === '7' ? forecast7Days : forecast30Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={forecastPeriod === '7' ? 'day' : 'week'} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="admissions" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Admissions" />
                  <Bar dataKey="discharges" fill="var(--shifa-green)" radius={[4, 4, 0, 0]} name="Sorties" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Taux d'occupation prévu (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={forecastPeriod === '7' ? forecast7Days : forecast30Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={forecastPeriod === '7' ? 'day' : 'week'} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="occupancy" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" name="Taux occupation %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Beds Tab */}
        {activeTab === 'beds' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Modélisation des Besoins en Lits par Service</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Disponible</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Réservé</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Occupé</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Service', 'Total lits', 'Occupés', 'Réservés', 'Disponibles', 'Taux occupation', 'Tendance', 'Statut'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bedsByService.map((s, i) => (
                    <tr key={i} className={`hover:bg-gray-50 transition-colors ${s.alert ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{s.service}</td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">{s.total}</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-medium">{s.occupied}</td>
                      <td className="px-4 py-3 text-center text-yellow-600 font-medium">{s.reserved}</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: s.available === 0 ? '#dc2626' : s.available <= 2 ? '#f59e0b' : '#16a34a' }}>{s.available}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div className="h-2 rounded-full" style={{ width: `${s.occupancy}%`, background: s.occupancy >= 95 ? '#dc2626' : s.occupancy >= 85 ? '#f59e0b' : '#16a34a' }} />
                          </div>
                          <span className="text-xs font-medium" style={{ color: s.occupancy >= 95 ? '#dc2626' : s.occupancy >= 85 ? '#b45309' : '#16a34a' }}>{s.occupancy}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Icon name={s.trend === 'up' ? 'ArrowUpIcon' : s.trend === 'down' ? 'ArrowDownIcon' : 'MinusIcon'} className="w-4 h-4" style={{ color: s.trend === 'up' ? '#dc2626' : s.trend === 'down' ? '#16a34a' : '#6b7280' }} />
                      </td>
                      <td className="px-4 py-3">
                        {s.alert ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">⚠ Tension</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Simulation de Scénarios Capacitaires</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouveau scénario
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {scenarios.map(sc => (
                <div key={sc.id} className="bg-white rounded-xl p-5 border-l-4 shadow-sm" style={{ borderLeftColor: sc.color }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{sc.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{sc.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.feasibility === 'high' ? '#dcfce7' : sc.feasibility === 'medium' ? '#fef3c7' : '#fee2e2', color: sc.feasibility === 'high' ? '#16a34a' : sc.feasibility === 'medium' ? '#b45309' : '#dc2626' }}>
                      Faisabilité {sc.feasibility === 'high' ? 'élevée' : sc.feasibility === 'medium' ? 'modérée' : 'faible'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xl font-bold text-gray-900">{sc.bedsNeeded}</div>
                      <div className="text-xs text-gray-500">Lits nécessaires</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-xl font-bold" style={{ color: sc.staffNeeded > 0 ? '#dc2626' : sc.staffNeeded < 0 ? '#16a34a' : '#6b7280' }}>
                        {sc.staffNeeded > 0 ? '+' : ''}{sc.staffNeeded}
                      </div>
                      <div className="text-xs text-gray-500">Personnel</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm font-bold" style={{ color: sc.cost > 0 ? '#dc2626' : sc.cost < 0 ? '#16a34a' : '#6b7280' }}>
                        {sc.cost > 0 ? '+' : ''}{sc.cost !== 0 ? `${(sc.cost / 1000000).toFixed(1)}M` : '—'}
                      </div>
                      <div className="text-xs text-gray-500">Impact coût (FCFA)</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hypothèses</p>
                    <ul className="space-y-1">
                      {sc.assumptions.map((a, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Alertes de Saturation</h2>
            <div className="grid gap-4">
              {saturationAlerts.map((alert, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border-l-4 shadow-sm" style={{ borderLeftColor: alertLevelConfig[alert.level]?.border }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{alert.service}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: alertLevelConfig[alert.level]?.bg, color: alertLevelConfig[alert.level]?.color }}>
                          {alertLevelConfig[alert.level]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{alert.trend}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: alertLevelConfig[alert.level]?.color }}>{alert.occupancy}%</div>
                      <div className="text-xs text-gray-500">occupation</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg text-sm" style={{ background: alertLevelConfig[alert.level]?.bg }}>
                    <span className="font-medium" style={{ color: alertLevelConfig[alert.level]?.color }}>Action recommandée: </span>
                    <span className="text-gray-700">{alert.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Export pour la Direction</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Période du rapport</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sections à inclure</label>
                <div className="space-y-2">
                  {['Prévision d\'activité J+7 et J+30', 'Taux d\'occupation par service', 'Alertes de saturation', 'Simulation de scénarios', 'Recommandations capacitaires', 'Comparaison vs objectifs'].map((section, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded" />
                      {section}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format d'export</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>PDF — Rapport exécutif</option>
                  <option>Excel — Données brutes</option>
                  <option>PowerPoint — Présentation direction</option>
                </select>
              </div>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="DocumentArrowDownIcon" className="w-4 h-4" />
                Générer le rapport
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
