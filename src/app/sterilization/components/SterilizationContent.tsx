'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'dashboard' | 'cycles' | 'instruments' | 'quality' | 'inventory' | 'reports';

interface SterilizationCycle {
  id: string;
  type: 'autoclave' | 'eo' | 'plasma' | 'dry_heat';
  machine: string;
  startTime: string;
  endTime: string;
  temperature: number;
  pressure: number;
  duration: number;
  load: string[];
  status: 'running' | 'completed' | 'failed' | 'pending';
  operator: string;
  batchNumber: string;
  biologicalIndicator: 'pass' | 'fail' | 'pending';
  chemicalIndicator: 'pass' | 'fail' | 'pending';
}

interface Instrument {
  id: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  available: number;
  inSterilization: number;
  lastSterilized: string;
  nextDue: string;
  condition: 'good' | 'fair' | 'needs_repair';
  cycleCount: number;
  maxCycles: number;
}

const cycles: SterilizationCycle[] = [
  { id: 'CY-001', type: 'autoclave', machine: 'Autoclave A1', startTime: '08:00', endTime: '08:45', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments chirurgie générale', 'Pinces', 'Ciseaux'], status: 'completed', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-001', biologicalIndicator: 'pass', chemicalIndicator: 'pass' },
  { id: 'CY-002', type: 'autoclave', machine: 'Autoclave A2', startTime: '09:30', endTime: '10:15', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments maternité', 'Forceps', 'Spéculums'], status: 'running', operator: 'Tech. Bah', batchNumber: 'B-2025-0812-002', biologicalIndicator: 'pending', chemicalIndicator: 'pass' },
  { id: 'CY-003', type: 'plasma', machine: 'Plasma P1', startTime: '10:00', endTime: '10:55', temperature: 50, pressure: 0.3, duration: 55, load: ['Endoscopes', 'Fibroscopes'], status: 'completed', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-003', biologicalIndicator: 'pass', chemicalIndicator: 'pass' },
  { id: 'CY-004', type: 'autoclave', machine: 'Autoclave A1', startTime: '11:00', endTime: '11:45', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments bloc opératoire', 'Rétracteurs', 'Écarteurs'], status: 'pending', operator: 'Tech. Bah', batchNumber: 'B-2025-0812-004', biologicalIndicator: 'pending', chemicalIndicator: 'pending' },
  { id: 'CY-005', type: 'eo', machine: 'EO E1', startTime: '07:00', endTime: '13:00', temperature: 55, pressure: 0.8, duration: 360, load: ['Cathéters', 'Sondes', 'Matériel thermosensible'], status: 'running', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-005', biologicalIndicator: 'pending', chemicalIndicator: 'pass' },
];

const instruments: Instrument[] = [
  { id: 'I-001', name: 'Pince Kocher', category: 'Chirurgie générale', department: 'Bloc opératoire', quantity: 24, available: 18, inSterilization: 6, lastSterilized: 'Aujourd\'hui 08:45', nextDue: 'Demain', condition: 'good', cycleCount: 142, maxCycles: 500 },
  { id: 'I-002', name: 'Ciseaux Mayo', category: 'Chirurgie générale', department: 'Bloc opératoire', quantity: 16, available: 12, inSterilization: 4, lastSterilized: 'Aujourd\'hui 08:45', nextDue: 'Demain', condition: 'good', cycleCount: 98, maxCycles: 300 },
  { id: 'I-003', name: 'Forceps obstétrical', category: 'Maternité', department: 'Maternité', quantity: 8, available: 5, inSterilization: 3, lastSterilized: 'Aujourd\'hui 10:15', nextDue: 'Demain', condition: 'good', cycleCount: 67, maxCycles: 200 },
  { id: 'I-004', name: 'Fibroscope bronchique', category: 'Endoscopie', department: 'Pneumologie', quantity: 3, available: 2, inSterilization: 1, lastSterilized: 'Aujourd\'hui 10:55', nextDue: 'Demain', condition: 'fair', cycleCount: 312, maxCycles: 400 },
  { id: 'I-005', name: 'Rétracteur Balfour', category: 'Chirurgie abdominale', department: 'Bloc opératoire', quantity: 6, available: 4, inSterilization: 2, lastSterilized: 'Hier', nextDue: 'Aujourd\'hui', condition: 'good', cycleCount: 45, maxCycles: 300 },
  { id: 'I-006', name: 'Laryngoscope', category: 'Anesthésie', department: 'Anesthésie', quantity: 10, available: 7, inSterilization: 3, lastSterilized: 'Hier', nextDue: 'Aujourd\'hui', condition: 'needs_repair', cycleCount: 289, maxCycles: 300 },
];

const cyclesByDay = [
  { day: 'Lun', autoclave: 12, plasma: 3, eo: 1 },
  { day: 'Mar', autoclave: 14, plasma: 4, eo: 1 },
  { day: 'Mer', autoclave: 11, plasma: 3, eo: 2 },
  { day: 'Jeu', autoclave: 15, plasma: 5, eo: 1 },
  { day: 'Ven', autoclave: 13, plasma: 4, eo: 1 },
  { day: 'Sam', autoclave: 8, plasma: 2, eo: 0 },
];

const qualityTrend = [
  { month: 'Mar', pass: 98.2 },
  { month: 'Avr', pass: 99.1 },
  { month: 'Mai', pass: 97.8 },
  { month: 'Juin', pass: 99.4 },
  { month: 'Juil', pass: 98.9 },
  { month: 'Août', pass: 99.6 },
];

const cycleStatusConfig = {
  running: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'En cours' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Terminé' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', label: 'Échec' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
};

const indicatorConfig = {
  pass: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Conforme' },
  fail: { bg: 'bg-red-50', text: 'text-red-700', label: 'Non conforme' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
};

const conditionConfig = {
  good: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Bon état' },
  fair: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Usure normale' },
  needs_repair: { bg: 'bg-red-50', text: 'text-red-700', label: 'À réparer' },
};

const typeLabels = {
  autoclave: 'Autoclave vapeur',
  eo: 'Oxyde d\'éthylène',
  plasma: 'Plasma H₂O₂',
  dry_heat: 'Chaleur sèche',
};

export default function SterilizationContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
    { id: 'cycles', label: 'Cycles de stérilisation', icon: 'ArrowPathIcon' },
    { id: 'instruments', label: 'Instruments', icon: 'WrenchScrewdriverIcon' },
    { id: 'quality', label: 'Contrôle qualité', icon: 'ShieldCheckIcon' },
    { id: 'inventory', label: 'Inventaire consommables', icon: 'ArchiveBoxIcon' },
    { id: 'reports', label: 'Rapports & Traçabilité', icon: 'DocumentChartBarIcon' },
  ];

  const completedToday = cycles.filter(c => c.status === 'completed').length;
  const runningNow = cycles.filter(c => c.status === 'running').length;
  const failedToday = cycles.filter(c => c.status === 'failed').length;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
            <Icon name="ShieldCheckIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Stérilisation Centrale</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion des cycles, instruments et traçabilité</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            {[
              { label: 'Cycles terminés', value: completedToday.toString(), color: '#10b981' },
              { label: 'En cours', value: runningNow.toString(), color: '#3b82f6' },
              { label: 'Taux conformité', value: '99.6%', color: '#f59e0b' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau cycle
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors"
            style={{ borderBottomColor: activeTab === tab.id ? '#0ea5e9' : 'transparent', color: activeTab === tab.id ? '#0ea5e9' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Cycles aujourd\'hui', value: cycles.length.toString(), icon: 'ArrowPathIcon', color: '#0ea5e9' },
                { label: 'Terminés', value: completedToday.toString(), icon: 'CheckCircleIcon', color: '#10b981' },
                { label: 'En cours', value: runningNow.toString(), icon: 'ClockIcon', color: '#3b82f6' },
                { label: 'Instruments en stéril.', value: instruments.reduce((s, i) => s + i.inSterilization, 0).toString(), icon: 'WrenchScrewdriverIcon', color: '#f59e0b' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}20` }}>
                      <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Cycles par type — cette semaine</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={cyclesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="autoclave" fill="#0ea5e9" radius={[2, 2, 0, 0]} name="Autoclave" stackId="a" />
                    <Bar dataKey="plasma" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Plasma" stackId="a" />
                    <Bar dataKey="eo" fill="#f59e0b" radius={[2, 2, 0, 0]} name="EO" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Taux de conformité mensuel (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={qualityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[95, 100]} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Line type="monotone" dataKey="pass" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Conformité" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Cycles en cours</h3>
              <div className="space-y-2">
                {cycles.filter(c => c.status === 'running').map(c => (
                  <div key={c.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
                        <Icon name="ArrowPathIcon" size={16} className="text-blue-600 animate-spin" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.machine} — {typeLabels[c.type]}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Démarré {c.startTime} — {c.operator} — {c.batchNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">En cours</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.temperature}°C / {c.pressure} bar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CYCLES TAB */}
        {activeTab === 'cycles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Cycles de stérilisation — Aujourd'hui</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
                <Icon name="PlusIcon" size={16} />
                Lancer cycle
              </button>
            </div>
            {cycles.map(c => {
              const stCfg = cycleStatusConfig[c.status];
              const biCfg = indicatorConfig[c.biologicalIndicator];
              const ciCfg = indicatorConfig[c.chemicalIndicator];
              return (
                <div key={c.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{c.machine} — {typeLabels[c.type]}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.startTime} → {c.endTime} — {c.duration} min — {c.operator}</p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Lot : {c.batchNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stCfg.bg} ${stCfg.text}`}>{stCfg.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Température', value: `${c.temperature}°C` },
                      { label: 'Pression', value: `${c.pressure} bar` },
                      { label: 'Durée', value: `${c.duration} min` },
                    ].map(item => (
                      <div key={item.label} className="p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      </div>
                    ))}
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Indicateurs</p>
                      <div className="flex gap-1">
                        <span className={`text-xs px-1 py-0.5 rounded ${biCfg.bg} ${biCfg.text}`}>Bio</span>
                        <span className={`text-xs px-1 py-0.5 rounded ${ciCfg.bg} ${ciCfg.text}`}>Chim</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Charge stérilisée</p>
                    <div className="flex flex-wrap gap-1">
                      {c.load.map(l => <span key={l} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{l}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INSTRUMENTS TAB */}
        {activeTab === 'instruments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Inventaire des instruments</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
                <Icon name="PlusIcon" size={16} />
                Ajouter instrument
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm" style={{ backgroundColor: 'var(--card)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Instrument', 'Catégorie', 'Service', 'Disponible', 'En stéril.', 'Dernier cycle', 'Cycles', 'État'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {instruments.map(inst => {
                    const condCfg = conditionConfig[inst.condition];
                    const cyclePct = Math.round((inst.cycleCount / inst.maxCycles) * 100);
                    return (
                      <tr key={inst.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{inst.name}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.category}</td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.department}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{inst.available}/{inst.quantity}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{inst.inSterilization}</span>
                        </td>
                        <td className="py-3 px-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.lastSterilized}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${cyclePct}%`, backgroundColor: cyclePct >= 80 ? '#ef4444' : cyclePct >= 60 ? '#f59e0b' : '#10b981' }} />
                            </div>
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.cycleCount}/{inst.maxCycles}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${condCfg.bg} ${condCfg.text}`}>{condCfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QUALITY TAB */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Contrôle qualité & Indicateurs biologiques</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Taux conformité', value: '99.6%', sub: 'Cycles validés', color: '#10b981' },
                { label: 'Indicateurs bio', value: '100%', sub: 'Conformes ce mois', color: '#3b82f6' },
                { label: 'Non-conformités', value: '2', sub: 'Ce trimestre', color: '#f59e0b' },
              ].map(kpi => (
                <div key={kpi.label} className="p-5 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="font-semibold mt-1" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Résultats indicateurs — cycles du jour</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Lot', 'Machine', 'Type', 'Indicateur biologique', 'Indicateur chimique', 'Opérateur', 'Statut'].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cycles.map(c => {
                      const biCfg = indicatorConfig[c.biologicalIndicator];
                      const ciCfg = indicatorConfig[c.chemicalIndicator];
                      const stCfg = cycleStatusConfig[c.status];
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-2 px-3 font-mono text-xs" style={{ color: 'var(--foreground)' }}>{c.batchNumber}</td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.machine}</td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{typeLabels[c.type]}</td>
                          <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded-full ${biCfg.bg} ${biCfg.text}`}>{biCfg.label}</span></td>
                          <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded-full ${ciCfg.bg} ${ciCfg.text}`}>{ciCfg.label}</span></td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.operator}</td>
                          <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded-full ${stCfg.bg} ${stCfg.text}`}>{stCfg.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Inventaire consommables stérilisation</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#0ea5e9' }}>
                <Icon name="PlusIcon" size={16} />
                Commande
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Sachets de stérilisation 200×300mm', stock: 450, min: 200, unit: 'unités', expiry: '12/2026', status: 'ok' },
                { name: 'Sachets de stérilisation 300×400mm', stock: 180, min: 200, unit: 'unités', expiry: '06/2026', status: 'low' },
                { name: 'Indicateurs chimiques classe 5', stock: 1200, min: 500, unit: 'bandelettes', expiry: '03/2026', status: 'ok' },
                { name: 'Indicateurs biologiques Geobacillus', stock: 48, min: 50, unit: 'ampoules', expiry: '09/2025', status: 'critical' },
                { name: 'Ruban indicateur autoclave', stock: 24, min: 10, unit: 'rouleaux', expiry: '12/2026', status: 'ok' },
                { name: 'Gaz oxyde d\'éthylène (cartouches)', stock: 8, min: 10, unit: 'cartouches', expiry: '06/2026', status: 'low' },
              ].map(item => {
                const pct = Math.min(100, Math.round((item.stock / (item.min * 3)) * 100));
                const color = item.status === 'ok' ? '#10b981' : item.status === 'low' ? '#f59e0b' : '#ef4444';
                return (
                  <div key={item.name} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'ok' ? 'bg-emerald-50 text-emerald-700' : item.status === 'low' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                        {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Faible' : 'Critique'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Stock : {item.stock} {item.unit}</span>
                      <span>Min : {item.min}</span>
                    </div>
                    <div className="h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Expiration : {item.expiry}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports & Traçabilité</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Cycles ce mois', value: '312', color: '#0ea5e9' },
                { label: 'Taux conformité', value: '99.6%', color: '#10b981' },
                { label: 'Instruments traités', value: '1,248', color: '#f59e0b' },
                { label: 'Non-conformités', value: '2', color: '#ef4444' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Registre des cycles', desc: 'Traçabilité complète — août 2025' },
                { title: 'Rapport indicateurs biologiques', desc: 'Résultats mensuels Geobacillus' },
                { title: 'Rapport non-conformités', desc: 'Incidents, causes, actions correctives' },
                { title: 'Rapport maintenance équipements', desc: 'Autoclaves, plasma, EO — état' },
              ].map(r => (
                <div key={r.title} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
