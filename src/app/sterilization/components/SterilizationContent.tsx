'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase/client';

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

const staticCycles: SterilizationCycle[] = [
  { id: 'CY-001', type: 'autoclave', machine: 'Autoclave A1', startTime: '08:00', endTime: '08:45', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments chirurgie générale', 'Pinces', 'Ciseaux'], status: 'completed', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-001', biologicalIndicator: 'pass', chemicalIndicator: 'pass' },
  { id: 'CY-002', type: 'autoclave', machine: 'Autoclave A2', startTime: '09:30', endTime: '10:15', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments maternité', 'Forceps', 'Spéculums'], status: 'running', operator: 'Tech. Bah', batchNumber: 'B-2025-0812-002', biologicalIndicator: 'pending', chemicalIndicator: 'pass' },
  { id: 'CY-003', type: 'plasma', machine: 'Plasma P1', startTime: '10:00', endTime: '10:55', temperature: 50, pressure: 0.3, duration: 55, load: ['Endoscopes', 'Fibroscopes'], status: 'completed', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-003', biologicalIndicator: 'pass', chemicalIndicator: 'pass' },
  { id: 'CY-004', type: 'autoclave', machine: 'Autoclave A1', startTime: '11:00', endTime: '11:45', temperature: 134, pressure: 2.1, duration: 45, load: ['Instruments bloc opératoire', 'Rétracteurs', 'Écarteurs'], status: 'pending', operator: 'Tech. Bah', batchNumber: 'B-2025-0812-004', biologicalIndicator: 'pending', chemicalIndicator: 'pending' },
  { id: 'CY-005', type: 'eo', machine: 'EO E1', startTime: '07:00', endTime: '13:00', temperature: 55, pressure: 0.8, duration: 360, load: ['Cathéters', 'Sondes', 'Matériel thermosensible'], status: 'running', operator: 'Tech. Diallo', batchNumber: 'B-2025-0812-005', biologicalIndicator: 'pending', chemicalIndicator: 'pass' },
];

const staticInstruments: Instrument[] = [
  { id: 'I-001', name: 'Pince Kocher', category: 'Chirurgie générale', department: 'Bloc opératoire', quantity: 24, available: 18, inSterilization: 6, lastSterilized: "Aujourd'hui 08:45", nextDue: 'Demain', condition: 'good', cycleCount: 142, maxCycles: 500 },
  { id: 'I-002', name: 'Ciseaux Mayo', category: 'Chirurgie générale', department: 'Bloc opératoire', quantity: 16, available: 12, inSterilization: 4, lastSterilized: "Aujourd'hui 08:45", nextDue: 'Demain', condition: 'good', cycleCount: 98, maxCycles: 300 },
  { id: 'I-003', name: 'Forceps obstétrical', category: 'Maternité', department: 'Maternité', quantity: 8, available: 5, inSterilization: 3, lastSterilized: "Aujourd'hui 10:15", nextDue: 'Demain', condition: 'good', cycleCount: 67, maxCycles: 200 },
  { id: 'I-004', name: 'Fibroscope bronchique', category: 'Endoscopie', department: 'Pneumologie', quantity: 3, available: 2, inSterilization: 1, lastSterilized: "Aujourd'hui 10:55", nextDue: 'Demain', condition: 'fair', cycleCount: 312, maxCycles: 400 },
  { id: 'I-005', name: 'Rétracteur Balfour', category: 'Chirurgie abdominale', department: 'Bloc opératoire', quantity: 6, available: 4, inSterilization: 2, lastSterilized: 'Hier', nextDue: "Aujourd'hui", condition: 'good', cycleCount: 45, maxCycles: 300 },
  { id: 'I-006', name: 'Laryngoscope', category: 'Anesthésie', department: 'Anesthésie', quantity: 10, available: 7, inSterilization: 3, lastSterilized: 'Hier', nextDue: "Aujourd'hui", condition: 'needs_repair', cycleCount: 289, maxCycles: 300 },
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
  running: { bg: 'rgba(0,102,255,0.10)', text: 'var(--shifa-blue)', label: 'En cours' },
  completed: { bg: 'rgba(16,185,129,0.12)', text: 'var(--shifa-green)', label: 'Terminé' },
  failed: { bg: 'rgba(239,68,68,0.12)', text: 'var(--shifa-red)', label: 'Échec' },
  pending: { bg: 'rgba(245,158,11,0.12)', text: 'var(--shifa-amber)', label: 'En attente' },
};

const indicatorConfig = {
  pass: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'OK' },
  fail: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Échec' },
  pending: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'En attente' },
};

const conditionConfig = {
  good: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Bon état' },
  fair: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Correct' },
  needs_repair: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'À réparer' },
};

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'cycles', label: 'Cycles', icon: 'ArrowPathIcon' },
  { key: 'instruments', label: 'Instruments', icon: 'WrenchScrewdriverIcon' },
  { key: 'quality', label: 'Qualité', icon: 'ShieldCheckIcon' },
  { key: 'inventory', label: 'Inventaire', icon: 'ArchiveBoxIcon' },
  { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
];

export default function SterilizationContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [dbCycles, setDbCycles] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sterilization_cycles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setDbCycles(data || []);
    } catch (err: any) {
      setDbError(err?.message || 'Erreur lors du chargement des cycles.');
    } finally {
      setDbLoading(false);
    }
  };

  // Use DB data if available, otherwise fallback to static
  const displayCycles = dbCycles.length > 0
    ? dbCycles.map((c: any) => ({
        id: c.id?.slice(0, 10) || '—',
        type: (c.cycle_type || 'autoclave') as SterilizationCycle['type'],
        machine: c.machine_name || '—',
        startTime: c.started_at ? new Date(c.started_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
        endTime: c.ended_at ? new Date(c.ended_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
        temperature: c.temperature || 0,
        pressure: c.pressure || 0,
        duration: c.duration_minutes || 0,
        load: c.load_description ? [c.load_description] : [],
        status: (c.status || 'pending') as SterilizationCycle['status'],
        operator: c.operator_id || '—',
        batchNumber: c.batch_number || '—',
        biologicalIndicator: (c.biological_indicator || 'pending') as 'pass' | 'fail' | 'pending',
        chemicalIndicator: (c.chemical_indicator || 'pending') as 'pass' | 'fail' | 'pending',
      }))
    : staticCycles;

  const kpis = [
    { label: 'Cycles du jour', value: String(displayCycles.length), icon: 'ArrowPathIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'En cours', value: String(displayCycles.filter(c => c.status === 'running').length), icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Terminés', value: String(displayCycles.filter(c => c.status === 'completed').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Instruments suivis', value: String(staticInstruments.length), icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 55%, #38bdf8 100%)',
          boxShadow: '0 8px 32px rgba(2,132,199,0.3)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="ShieldCheckIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {dbCycles.length > 0 ? `${dbCycles.length} cycles en base` : 'Données de démonstration'}
                </span>
                {dbLoading && <Icon name="ArrowPathIcon" size={14} className="text-white animate-spin" />}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Stérilisation Centrale
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Cycles de stérilisation, instruments, contrôle qualité et traçabilité
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchCycles} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowPathIcon" size={15} className={dbLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#0284c7' }}>
              <Icon name="PlusIcon" size={15} />
              Nouveau cycle
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={kpi.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {dbError && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)' }} />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{dbError} — Affichage des données de démonstration.</p>
          <button onClick={fetchCycles} className="ml-auto text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Réessayer</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {dbLoading ? (
            <div className="rounded-2xl border p-12 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#0284c7', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des données…</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Cycles par jour</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={cyclesByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="autoclave" fill="var(--shifa-blue)" radius={[3,3,0,0]} name="Autoclave" stackId="a" />
                      <Bar dataKey="plasma" fill="var(--shifa-purple)" radius={[3,3,0,0]} name="Plasma" stackId="a" />
                      <Bar dataKey="eo" fill="var(--shifa-amber)" radius={[3,3,0,0]} name="EO" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Taux de conformité (%)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={qualityTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis domain={[95, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="pass" stroke="var(--shifa-green)" strokeWidth={2} dot={{ fill: 'var(--shifa-green)', r: 4 }} name="Conformité %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active cycles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Cycles actifs</h3>
                  {dbCycles.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Données Supabase</span>
                  )}
                </div>
                {displayCycles.filter(c => c.status === 'running' || c.status === 'pending').length === 0 ? (
                  <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <Icon name="CheckCircleIcon" size={24} style={{ color: 'var(--shifa-green)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucun cycle actif en ce moment</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {displayCycles.filter(c => c.status === 'running' || c.status === 'pending').map((cycle) => (
                      <div key={cycle.id} className="rounded-2xl border p-4 flex items-center justify-between gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(2,132,199,0.1)' }}>
                            <Icon name="ArrowPathIcon" size={18} style={{ color: '#0284c7' }} className={cycle.status === 'running' ? 'animate-spin' : ''} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{cycle.machine}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.batchNumber} · {cycle.operator}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.startTime} → {cycle.endTime} · {cycle.duration}min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: cycleStatusConfig[cycle.status].bg, color: cycleStatusConfig[cycle.status].text }}>
                            {cycleStatusConfig[cycle.status].label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Cycles Tab */}
      {activeTab === 'cycles' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Historique des cycles</h3>
              {dbCycles.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Supabase</span>
              )}
            </div>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouveau cycle</button>
          </div>

          {dbLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#0284c7', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des cycles…</p>
            </div>
          ) : displayCycles.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(2,132,199,0.08)' }}>
                <Icon name="ArrowPathIcon" size={26} style={{ color: '#0284c7' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Aucun cycle enregistré</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Les cycles de stérilisation apparaîtront ici.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                    {['Lot', 'Machine', 'Type', 'Début', 'Fin', 'Durée', 'Opérateur', 'Statut', 'BI', 'CI'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayCycles.map((cycle, i) => (
                    <tr key={cycle.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{cycle.batchNumber}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--shifa-dark)' }}>{cycle.machine}</td>
                      <td className="px-4 py-3 text-xs uppercase font-semibold" style={{ color: 'var(--shifa-blue)' }}>{cycle.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.startTime}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.endTime}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.duration}min</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{cycle.operator}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: cycleStatusConfig[cycle.status].bg, color: cycleStatusConfig[cycle.status].text }}>
                          {cycleStatusConfig[cycle.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: indicatorConfig[cycle.biologicalIndicator].bg, color: indicatorConfig[cycle.biologicalIndicator].color }}>
                          {indicatorConfig[cycle.biologicalIndicator].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: indicatorConfig[cycle.chemicalIndicator].bg, color: indicatorConfig[cycle.chemicalIndicator].color }}>
                          {indicatorConfig[cycle.chemicalIndicator].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Instruments Tab */}
      {activeTab === 'instruments' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Suivi des instruments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Instrument', 'Catégorie', 'Service', 'Dispo', 'En stéril.', 'Dernière stéril.', 'Prochaine', 'État', 'Cycles'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staticInstruments.map((inst, i) => (
                  <tr key={inst.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{inst.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.category}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.department}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>{inst.available}/{inst.quantity}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--shifa-amber)' }}>{inst.inSterilization}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.lastSterilized}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.nextDue}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: conditionConfig[inst.condition].bg, color: conditionConfig[inst.condition].color }}>
                        {conditionConfig[inst.condition].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--shifa-surface)', minWidth: '40px' }}>
                          <div className="h-full rounded-full" style={{ width: `${(inst.cycleCount / inst.maxCycles) * 100}%`, backgroundColor: inst.cycleCount / inst.maxCycles > 0.8 ? 'var(--shifa-red)' : 'var(--shifa-blue)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inst.cycleCount}/{inst.maxCycles}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'quality' || activeTab === 'inventory' || activeTab === 'reports') && (
        <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(2,132,199,0.08)' }}>
            <Icon name={activeTab === 'quality' ? 'ShieldCheckIcon' : activeTab === 'inventory' ? 'ArchiveBoxIcon' : 'DocumentChartBarIcon'} size={24} style={{ color: '#0284c7' }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>
            {activeTab === 'quality' ? 'Contrôle qualité' : activeTab === 'inventory' ? 'Inventaire consommables' : 'Rapports de stérilisation'}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cette section sera disponible prochainement.</p>
        </div>
      )}
    </div>
  );
}
