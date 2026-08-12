'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'cycles' | 'loads' | 'indicators' | 'nonconformities' | 'traceability';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'cycles', label: 'Cycles autoclave', icon: 'ArrowPathIcon' },
  { key: 'loads', label: 'Charges instruments', icon: 'ArchiveBoxIcon' },
  { key: 'indicators', label: 'Indicateurs bio/chimiques', icon: 'BeakerIcon' },
  { key: 'nonconformities', label: 'Non-conformités', icon: 'ExclamationTriangleIcon' },
  { key: 'traceability', label: 'Traçabilité patient', icon: 'LinkIcon' },
];

const kpis = [
  { label: 'Cycles aujourd\'hui', value: '18', sub: '16 conformes · 2 en cours', icon: 'ArrowPathIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Taux conformité', value: '98.2%', sub: 'Objectif ≥ 98%', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Non-conformités', value: '3', sub: '1 ouverte · 2 clôturées', icon: 'ExclamationTriangleIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Instruments traçables', value: '2 847', sub: 'Liés à 1 204 patients', icon: 'LinkIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
];

const autoclaves = [
  { id: 'AUTO-01', name: 'Autoclave A — 134L', type: 'Vapeur saturée', capacity: '134L', status: 'running', currentCycle: 'CYC-2026-0847', cycleType: '134°C / 18 min', startTime: '09:42', estimatedEnd: '10:05', operator: 'Tech. Kouyaté' },
  { id: 'AUTO-02', name: 'Autoclave B — 134L', type: 'Vapeur saturée', capacity: '134L', status: 'idle', currentCycle: '—', cycleType: '—', startTime: '—', estimatedEnd: '—', operator: '—' },
  { id: 'AUTO-03', name: 'Autoclave C — 280L', type: 'Vapeur saturée', capacity: '280L', status: 'running', currentCycle: 'CYC-2026-0848', cycleType: '134°C / 18 min', startTime: '09:55', estimatedEnd: '10:18', operator: 'Tech. Diallo' },
  { id: 'AUTO-04', name: 'Autoclave D — Plasma', type: 'Plasma H2O2', capacity: '100L', status: 'maintenance', currentCycle: '—', cycleType: '—', startTime: '—', estimatedEnd: '—', operator: 'Maintenance' },
];

const cycles = [
  { id: 'CYC-2026-0846', autoclave: 'Autoclave A', type: '134°C / 18 min', startTime: '08:15', endTime: '08:38', operator: 'Tech. Kouyaté', loadRef: 'LOAD-0412', instruments: 24, status: 'compliant', bowieDick: 'pass', chemical: 'pass', biological: 'pass' },
  { id: 'CYC-2026-0845', autoclave: 'Autoclave C', type: '134°C / 18 min', startTime: '07:30', endTime: '07:53', operator: 'Tech. Diallo', loadRef: 'LOAD-0411', instruments: 18, status: 'compliant', bowieDick: 'pass', chemical: 'pass', biological: 'pass' },
  { id: 'CYC-2026-0844', autoclave: 'Autoclave B', type: '121°C / 30 min', startTime: '06:45', endTime: '07:20', operator: 'Tech. Ba', loadRef: 'LOAD-0410', instruments: 32, status: 'non_compliant', bowieDick: 'fail', chemical: 'pass', biological: 'pending' },
  { id: 'CYC-2026-0843', autoclave: 'Autoclave A', type: '134°C / 18 min', startTime: '06:00', endTime: '06:23', operator: 'Tech. Kouyaté', loadRef: 'LOAD-0409', instruments: 15, status: 'compliant', bowieDick: 'pass', chemical: 'pass', biological: 'pass' },
  { id: 'CYC-2026-0842', autoclave: 'Autoclave C', type: '134°C / 18 min', startTime: '05:15', endTime: '05:38', operator: 'Tech. Ndiaye', loadRef: 'LOAD-0408', instruments: 28, status: 'compliant', bowieDick: 'pass', chemical: 'pass', biological: 'pass' },
];

const loads = [
  { id: 'LOAD-0412', cycleRef: 'CYC-2026-0846', service: 'Bloc opératoire', instruments: ['Pince Kocher x4', 'Ciseau Mayo x2', 'Porte-aiguille x3', 'Écarteur Farabeuf x2', 'Bistouri manche x1'], packagingDate: '11/08/2026 07:45', packager: 'Tech. Sow', status: 'sterilized', expiryDate: '11/11/2026' },
  { id: 'LOAD-0411', cycleRef: 'CYC-2026-0845', service: 'Urgences', instruments: ['Pince hémostatique x6', 'Ciseau chirurgical x2', 'Sonde urinaire kit x4'], packagingDate: '11/08/2026 06:30', packager: 'Tech. Diallo', status: 'sterilized', expiryDate: '11/11/2026' },
  { id: 'LOAD-0410', cycleRef: 'CYC-2026-0844', service: 'Chirurgie', instruments: ['Plateau chirurgie générale x2', 'Pince Allis x4', 'Rétracteur x2'], packagingDate: '11/08/2026 05:45', packager: 'Tech. Ba', status: 'quarantine', expiryDate: '—' },
  { id: 'LOAD-0409', cycleRef: 'CYC-2026-0843', service: 'Maternité', instruments: ['Kit accouchement x3', 'Pince cordon x6', 'Ciseau épisiotomie x2'], packagingDate: '11/08/2026 05:00', packager: 'Tech. Kouyaté', status: 'sterilized', expiryDate: '11/11/2026' },
];

const indicators = [
  { id: 'IND-001', type: 'Bowie-Dick', cycleRef: 'CYC-2026-0846', autoclave: 'Autoclave A', date: '11/08/2026 08:38', result: 'pass', readBy: 'Tech. Kouyaté', notes: '' },
  { id: 'IND-002', type: 'Chimique classe 5', cycleRef: 'CYC-2026-0846', autoclave: 'Autoclave A', date: '11/08/2026 08:38', result: 'pass', readBy: 'Tech. Kouyaté', notes: '' },
  { id: 'IND-003', type: 'Biologique (Geobacillus)', cycleRef: 'CYC-2026-0845', autoclave: 'Autoclave C', date: '11/08/2026 07:53', result: 'pass', readBy: 'Tech. Diallo', notes: 'Résultat J+1 confirmé' },
  { id: 'IND-004', type: 'Bowie-Dick', cycleRef: 'CYC-2026-0844', autoclave: 'Autoclave B', date: '11/08/2026 07:20', result: 'fail', readBy: 'Tech. Ba', notes: 'Virage incomplet — charge mise en quarantaine' },
  { id: 'IND-005', type: 'Chimique classe 5', cycleRef: 'CYC-2026-0844', autoclave: 'Autoclave B', date: '11/08/2026 07:20', result: 'pass', readBy: 'Tech. Ba', notes: '' },
  { id: 'IND-006', type: 'Biologique (Geobacillus)', cycleRef: 'CYC-2026-0843', autoclave: 'Autoclave A', date: '10/08/2026 06:23', result: 'pass', readBy: 'Tech. Kouyaté', notes: '' },
];

const nonConformities = [
  { id: 'NC-001', date: '11/08/2026', type: 'Indicateur Bowie-Dick négatif', cycleRef: 'CYC-2026-0844', autoclave: 'Autoclave B', severity: 'major', status: 'open', reportedBy: 'Tech. Ba', action: 'Charge mise en quarantaine, maintenance autoclave demandée, investigation en cours', assignedTo: 'Resp. stérilisation' },
  { id: 'NC-002', date: '05/08/2026', type: 'Emballage endommagé détecté', cycleRef: 'CYC-2026-0821', autoclave: 'Autoclave A', severity: 'minor', status: 'closed', reportedBy: 'Tech. Sow', action: 'Instrument re-conditionné et re-stérilisé. Formation équipe conditionnement.', assignedTo: 'Tech. Sow' },
  { id: 'NC-003', date: '28/07/2026', type: 'Dépassement délai de stérilisation', cycleRef: 'CYC-2026-0798', autoclave: 'Autoclave C', severity: 'minor', status: 'closed', reportedBy: 'Tech. Diallo', action: 'Instruments re-stérilisés. Révision procédure de planification.', assignedTo: 'Tech. Diallo' },
];

const traceabilityRecords = [
  { patientId: 'PAT-7K4D', patientName: 'Aïcha Diallo', procedure: 'Appendicectomie', date: '10/08/2026', surgeon: 'Dr. Ndiaye', loadRef: 'LOAD-0408', cycleRef: 'CYC-2026-0843', instruments: ['Plateau chirurgie générale #1', 'Pince Allis x2', 'Porte-aiguille x1'] },
  { patientId: 'PAT-3M2K', patientName: 'Oumar Ndiaye', procedure: 'Césarienne', date: '11/08/2026', surgeon: 'Dr. Mbaye', loadRef: 'LOAD-0409', cycleRef: 'CYC-2026-0843', instruments: ['Kit césarienne #2', 'Pince Kocher x4', 'Ciseau Mayo x1'] },
  { patientId: 'PAT-9P1R', patientName: 'Mariama Ba', procedure: 'Pose cathéter veineux central', date: '11/08/2026', surgeon: 'Dr. Diallo', loadRef: 'LOAD-0411', cycleRef: 'CYC-2026-0845', instruments: ['Kit CVC stérile #3'] },
];

const cycleData = [
  { day: 'Lun', cycles: 22 }, { day: 'Mar', cycles: 19 }, { day: 'Mer', cycles: 24 },
  { day: 'Jeu', cycles: 21 }, { day: 'Ven', cycles: 18 }, { day: 'Sam', cycles: 12 }, { day: 'Dim', cycles: 8 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  running: { label: 'En cours', bg: '#dbeafe', color: '#1d4ed8' },
  idle: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  maintenance: { label: 'Maintenance', bg: '#fef3c7', color: '#b45309' },
  compliant: { label: 'Conforme', bg: '#dcfce7', color: '#16a34a' },
  non_compliant: { label: 'Non conforme', bg: '#fee2e2', color: '#dc2626' },
  sterilized: { label: 'Stérilisé', bg: '#dcfce7', color: '#16a34a' },
  quarantine: { label: 'Quarantaine', bg: '#fee2e2', color: '#dc2626' },
  pass: { label: '✓ Conforme', bg: '#dcfce7', color: '#16a34a' },
  fail: { label: '✗ Non conforme', bg: '#fee2e2', color: '#dc2626' },
  pending: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
  open: { label: 'Ouverte', bg: '#fee2e2', color: '#dc2626' },
  closed: { label: 'Clôturée', bg: '#dcfce7', color: '#16a34a' },
  major: { label: 'Majeure', bg: '#fee2e2', color: '#dc2626' },
  minor: { label: 'Mineure', bg: '#fef3c7', color: '#b45309' },
};

export default function OrgSterilizationCentralContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <Icon name="ArrowPathIcon" className="w-5 h-5" style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Stérilisation Centrale</h1>
              <p className="text-sm text-gray-500">Cycles autoclave · Traçabilité instruments · Indicateurs · Non-conformités</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#7c3aed' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouveau cycle
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
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

            {/* Autoclave Status */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">État des autoclaves en temps réel</h3>
              <div className="grid grid-cols-4 gap-4">
                {autoclaves.map(a => (
                  <div key={a.id} className="p-4 rounded-xl border" style={{ borderColor: a.status === 'running' ? '#7c3aed' : a.status === 'maintenance' ? '#f59e0b' : '#e5e7eb', background: a.status === 'running' ? 'rgba(124,58,237,0.04)' : 'white' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">{a.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[a.status]?.bg, color: statusConfig[a.status]?.color }}>
                        {statusConfig[a.status]?.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{a.type} · {a.capacity}</div>
                      {a.status === 'running' && (
                        <>
                          <div className="font-mono text-purple-600">{a.currentCycle}</div>
                          <div>{a.cycleType}</div>
                          <div>Début: {a.startTime} → Fin: {a.estimatedEnd}</div>
                          <div>Opérateur: {a.operator}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Cycles par jour (semaine en cours)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={cycleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="cycles" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Cycles" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Cycles Tab */}
        {activeTab === 'cycles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Traçabilité des Cycles Autoclave</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#7c3aed' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Démarrer cycle
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID Cycle', 'Autoclave', 'Type', 'Début', 'Fin', 'Opérateur', 'Charge', 'Instruments', 'Bowie-Dick', 'Chimique', 'Biologique', 'Statut'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cycles.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-purple-600">{c.id}</td>
                      <td className="px-3 py-3 text-gray-700">{c.autoclave}</td>
                      <td className="px-3 py-3 text-gray-600 text-xs">{c.type}</td>
                      <td className="px-3 py-3 text-gray-600">{c.startTime}</td>
                      <td className="px-3 py-3 text-gray-600">{c.endTime}</td>
                      <td className="px-3 py-3 text-gray-600">{c.operator}</td>
                      <td className="px-3 py-3 font-mono text-xs text-gray-500">{c.loadRef}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{c.instruments}</td>
                      {[c.bowieDick, c.chemical, c.biological].map((ind, i) => (
                        <td key={i} className="px-3 py-3">
                          <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: statusConfig[ind]?.bg, color: statusConfig[ind]?.color }}>
                            {statusConfig[ind]?.label}
                          </span>
                        </td>
                      ))}
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[c.status]?.bg, color: statusConfig[c.status]?.color }}>
                          {statusConfig[c.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loads Tab */}
        {activeTab === 'loads' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Charges par Instrument</h2>
            <div className="grid gap-4">
              {loads.map(load => (
                <div key={load.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-purple-600">{load.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[load.status]?.bg, color: statusConfig[load.status]?.color }}>
                          {statusConfig[load.status]?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Cycle: {load.cycleRef} · Service: {load.service}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-500">Conditionné le: <span className="font-medium text-gray-700">{load.packagingDate}</span></div>
                      <div className="text-gray-500">Par: <span className="font-medium text-gray-700">{load.packager}</span></div>
                      {load.expiryDate !== '—' && <div className="text-gray-500">Expire: <span className="font-medium text-gray-700">{load.expiryDate}</span></div>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {load.instruments.map((inst, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{inst}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicators Tab */}
        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Indicateurs Biologiques & Chimiques</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID', 'Type d\'indicateur', 'Cycle', 'Autoclave', 'Date/Heure', 'Résultat', 'Lu par', 'Notes'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {indicators.map(ind => (
                    <tr key={ind.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{ind.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{ind.type}</td>
                      <td className="px-4 py-3 font-mono text-xs text-purple-600">{ind.cycleRef}</td>
                      <td className="px-4 py-3 text-gray-600">{ind.autoclave}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{ind.date}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[ind.result]?.bg, color: statusConfig[ind.result]?.color }}>
                          {statusConfig[ind.result]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ind.readBy}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs italic">{ind.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Non-conformities Tab */}
        {activeTab === 'nonconformities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Non-Conformités</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#dc2626' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Déclarer non-conformité
              </button>
            </div>
            <div className="grid gap-4">
              {nonConformities.map(nc => (
                <div key={nc.id} className="bg-white rounded-xl p-5 border-l-4 shadow-sm" style={{ borderLeftColor: nc.status === 'open' ? '#dc2626' : '#16a34a' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-gray-500">{nc.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[nc.severity]?.bg, color: statusConfig[nc.severity]?.color }}>
                          {statusConfig[nc.severity]?.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[nc.status]?.bg, color: statusConfig[nc.status]?.color }}>
                          {statusConfig[nc.status]?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{nc.type}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{nc.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div><span className="text-gray-500">Cycle:</span> <span className="font-mono text-purple-600">{nc.cycleRef}</span></div>
                    <div><span className="text-gray-500">Autoclave:</span> <span className="font-medium text-gray-700">{nc.autoclave}</span></div>
                    <div><span className="text-gray-500">Signalé par:</span> <span className="font-medium text-gray-700">{nc.reportedBy}</span></div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Action corrective: </span>{nc.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Traceability Tab */}
        {activeTab === 'traceability' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Traçabilité Patient-Instrument</h2>
              <div className="relative">
                <Icon name="MagnifyingGlassIcon" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Rechercher patient ou instrument..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="grid gap-4">
              {traceabilityRecords.map((rec, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{rec.patientName} <span className="font-mono text-xs text-gray-400 ml-1">{rec.patientId}</span></h3>
                      <p className="text-sm text-gray-600">{rec.procedure} · {rec.date} · {rec.surgeon}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>Charge: <span className="font-mono text-purple-600">{rec.loadRef}</span></div>
                      <div>Cycle: <span className="font-mono text-purple-600">{rec.cycleRef}</span></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rec.instruments.map((inst, j) => (
                      <span key={j} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{inst}</span>
                    ))}
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
