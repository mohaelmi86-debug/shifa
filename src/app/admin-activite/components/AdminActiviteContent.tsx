'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';

const weeklyData = [
  { week: 'S.20', consultations: 312, admissions: 28, urgences: 45, prescriptions: 198 },
  { week: 'S.21', consultations: 398, admissions: 31, urgences: 52, prescriptions: 241 },
  { week: 'S.22', consultations: 445, admissions: 25, urgences: 38, prescriptions: 278 },
  { week: 'S.23', consultations: 421, admissions: 34, urgences: 61, prescriptions: 255 },
  { week: 'S.24', consultations: 380, admissions: 29, urgences: 44, prescriptions: 230 },
  { week: 'S.25', consultations: 502, admissions: 38, urgences: 58, prescriptions: 312 },
  { week: 'S.26', consultations: 467, admissions: 32, urgences: 49, prescriptions: 289 },
  { week: 'S.27', consultations: 489, admissions: 35, urgences: 55, prescriptions: 301 },
  { week: 'S.28', consultations: 524, admissions: 40, urgences: 63, prescriptions: 328 },
  { week: 'S.29', consultations: 441, admissions: 30, urgences: 47, prescriptions: 271 },
  { week: 'S.30', consultations: 510, admissions: 36, urgences: 54, prescriptions: 315 },
  { week: 'S.31', consultations: 487, admissions: 33, urgences: 50, prescriptions: 298 },
  { week: 'S.32', consultations: 462, admissions: 28, urgences: 42, prescriptions: 280 },
];

const deptActivity = [
  { dept: 'Méd. Gén.', consultations: 142, color: 'var(--shifa-blue)' },
  { dept: 'Urgences', consultations: 98, color: 'var(--shifa-red)' },
  { dept: 'Gynéco', consultations: 67, color: 'var(--shifa-purple)' },
  { dept: 'Pédiatrie', consultations: 55, color: 'var(--shifa-green)' },
  { dept: 'Cardio', consultations: 44, color: 'var(--shifa-cyan)' },
  { dept: 'Maternité', consultations: 38, color: 'var(--shifa-amber)' },
];

const pieData = [
  { name: 'Consultations', value: 462, color: 'var(--shifa-blue)' },
  { name: 'Urgences', value: 42, color: 'var(--shifa-red)' },
  { name: 'Admissions', value: 28, color: 'var(--shifa-green)' },
  { name: 'Prescriptions', value: 280, color: 'var(--shifa-amber)' },
];

const recentEvents = [
  { time: '10:45', user: 'Dr. Mohamed Sy', action: 'Consultation terminée', patient: 'Aïcha Diallo', dept: 'Méd. Générale', type: 'consult' },
  { time: '10:32', user: 'Awa Ndiaye', action: 'Constantes enregistrées', patient: 'Moussa Camara', dept: 'Urgences', type: 'nursing' },
  { time: '10:18', user: 'Dr. Fatou Sarr', action: 'Ordonnance signée', patient: 'Fatima Koné', dept: 'Gynécologie', type: 'prescription' },
  { time: '10:05', user: 'Ibrahima Diop', action: 'Médicament dispensé', patient: 'Seydou Ba', dept: 'Pharmacie', type: 'pharmacy' },
  { time: '09:52', user: 'Dr. Jean Kouassi', action: 'ECG interprété', patient: 'Oumar Diallo', dept: 'Cardiologie', type: 'result' },
  { time: '09:38', user: 'Mariama Baldé', action: 'Accouchement enregistré', patient: 'Aminata Sow', dept: 'Maternité', type: 'birth' },
  { time: '09:21', user: 'Oumar Traoré', action: 'Résultat biologie validé', patient: 'Ibou Ndiaye', dept: 'Biologie', type: 'result' },
];

const eventColors: Record<string, string> = {
  consult: 'var(--shifa-blue)',
  nursing: 'var(--shifa-green)',
  prescription: 'var(--shifa-amber)',
  pharmacy: 'var(--shifa-cyan)',
  result: 'var(--shifa-purple)',
  birth: 'var(--shifa-red)',
};

const kpis = [
  { label: 'Consultations aujourd\'hui', value: '87', delta: '+12%', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
  { label: 'Admissions en cours', value: '14', delta: '+2', icon: 'BuildingOffice2Icon', color: 'var(--shifa-green)' },
  { label: 'Urgences actives', value: '6', delta: '-3', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Prescriptions émises', value: '52', delta: '+8%', icon: 'DocumentCheckIcon', color: 'var(--shifa-amber)' },
];

type Period = 'week' | 'month' | 'quarter';

export default function AdminActiviteContent() {
  const [period, setPeriod] = useState<Period>('month');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Activité de l'établissement</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Tableau de bord analytique — CHU Saint-Louis
          </p>
        </div>
        <div className="flex items-center gap-2 p-1 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
          {(['week', 'month', 'quarter'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: period === p ? 'var(--card)' : 'transparent',
                color: period === p ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Trimestre'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}15` }}>
              <Icon name={k.icon as any} size={20} style={{ color: k.color } as any} className="" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{k.label}</p>
              <p className="text-xs font-semibold" style={{ color: k.delta.startsWith('+') ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{k.delta} vs hier</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Area chart */}
        <div className="xl:col-span-2 card-base">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Évolution hebdomadaire</h2>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--shifa-blue)' }} />Consultations</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--shifa-red)' }} />Urgences</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--shifa-green)' }} />Admissions</span>
            </div>
          </div>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="actConsult" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--shifa-blue)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--shifa-blue)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actUrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--shifa-red)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--shifa-red)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--shifa-green)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--shifa-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px' }} labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }} />
                <Area type="monotone" dataKey="consultations" stroke="var(--shifa-blue)" strokeWidth={2} fill="url(#actConsult)" name="Consultations" />
                <Area type="monotone" dataKey="urgences" stroke="var(--shifa-red)" strokeWidth={2} fill="url(#actUrg)" name="Urgences" />
                <Area type="monotone" dataKey="admissions" stroke="var(--shifa-green)" strokeWidth={2} fill="url(#actAdm)" name="Admissions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="card-base">
          <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition des actes</h2>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Dept bar chart */}
        <div className="card-base">
          <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Activité par département (ce mois)</h2>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptActivity} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '11px' }} />
                <Bar dataKey="consultations" name="Consultations" radius={[4, 4, 0, 0]}>
                  {deptActivity.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent events */}
        <div className="card-base">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Activité récente</h2>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aujourd'hui</span>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin" style={{ maxHeight: '200px' }}>
            {recentEvents.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: eventColors[ev.type] || 'var(--shifa-blue)' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{ev.user}</p>
                    <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{ev.time}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ev.action} · <span style={{ color: 'var(--foreground)' }}>{ev.patient}</span></p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{ev.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
