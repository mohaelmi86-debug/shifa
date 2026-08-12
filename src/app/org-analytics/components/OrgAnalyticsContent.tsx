'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Tab = 'overview' | 'activity' | 'patients' | 'finance' | 'quality';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { id: 'activity', label: 'Activité', icon: 'ChartBarIcon' },
  { id: 'patients', label: 'Patients', icon: 'UsersIcon' },
  { id: 'finance', label: 'Finance', icon: 'BanknotesIcon' },
  { id: 'quality', label: 'Qualité', icon: 'ShieldCheckIcon' },
];

const kpis = [
  { label: 'Consultations ce mois', value: '1 248', delta: '+12%', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
  { label: 'Patients actifs', value: '3 402', delta: '+5%', icon: 'UsersIcon', color: '#16a34a' },
  { label: 'Taux d\'occupation', value: '87%', delta: '+3%', icon: 'ChartBarIcon', color: '#d97706' },
  { label: 'Revenus du mois', value: '4.2M FCFA', delta: '+8%', icon: 'BanknotesIcon', color: '#7c3aed' },
];

const activityData = [
  { month: 'Mar', consultations: 980, admissions: 120, urgences: 45 },
  { month: 'Avr', consultations: 1050, admissions: 135, urgences: 52 },
  { month: 'Mai', consultations: 1120, admissions: 142, urgences: 48 },
  { month: 'Juin', consultations: 1080, admissions: 128, urgences: 61 },
  { month: 'Juil', consultations: 1190, admissions: 155, urgences: 55 },
  { month: 'Août', consultations: 1248, admissions: 162, urgences: 58 },
];

const patientAgeData = [
  { name: '0-14', value: 18, color: '#60a5fa' },
  { name: '15-29', value: 22, color: '#34d399' },
  { name: '30-44', value: 28, color: 'var(--shifa-blue)' },
  { name: '45-59', value: 20, color: '#f59e0b' },
  { name: '60+', value: 12, color: '#f87171' },
];

const revenueData = [
  { month: 'Mar', recettes: 3200000, depenses: 1800000 },
  { month: 'Avr', recettes: 3500000, depenses: 1900000 },
  { month: 'Mai', recettes: 3800000, depenses: 2000000 },
  { month: 'Juin', recettes: 3600000, depenses: 1950000 },
  { month: 'Juil', recettes: 4000000, depenses: 2100000 },
  { month: 'Août', recettes: 4200000, depenses: 2200000 },
];

const topDepts = [
  { name: 'Médecine interne', consultations: 342, pct: 27 },
  { name: 'Urgences', consultations: 289, pct: 23 },
  { name: 'Pédiatrie', consultations: 215, pct: 17 },
  { name: 'Chirurgie', consultations: 178, pct: 14 },
  { name: 'Maternité', consultations: 142, pct: 11 },
  { name: 'Autres', consultations: 82, pct: 8 },
];

export default function OrgAnalyticsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [period, setPeriod] = useState('month');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Analytics Organisation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>CHU Saint-Louis · Tableau de bord analytique</p>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', 'quarter', 'year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={period === p ? { backgroundColor: 'var(--shifa-blue)', color: '#fff' } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'quarter' ? 'Trimestre' : 'Année'}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            <Icon name="ArrowDownTrayIcon" size={14} />Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}18` }}>
                <Icon name={k.icon as any} size={18} style={{ color: k.color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{k.delta}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? 'shadow-sm' : ''}`}
            style={activeTab === t.id ? { backgroundColor: 'var(--card)', color: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={15} />{t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Activité mensuelle</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="consultations" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Consultations" />
                <Bar dataKey="admissions" fill="#34d399" radius={[4, 4, 0, 0]} name="Admissions" />
                <Bar dataKey="urgences" fill="#f87171" radius={[4, 4, 0, 0]} name="Urgences" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition par âge</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={patientAgeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {patientAgeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {patientAgeData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span style={{ color: 'var(--muted-foreground)' }}>{d.name} ans</span>
                  </div>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Activité par département</h3>
            <div className="space-y-3">
              {topDepts.map(d => (
                <div key={d.name} className="flex items-center gap-4">
                  <p className="text-sm w-36 shrink-0" style={{ color: 'var(--foreground)' }}>{d.name}</p>
                  <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${d.pct}%`, backgroundColor: 'var(--shifa-blue)' }} />
                  </div>
                  <span className="text-sm font-medium w-16 text-right" style={{ color: 'var(--foreground)' }}>{d.consultations}</span>
                  <span className="text-xs w-10 text-right" style={{ color: 'var(--muted-foreground)' }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finance */}
      {activeTab === 'finance' && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Recettes vs Dépenses (FCFA)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(v: number) => [`${(v / 1000000).toFixed(2)}M FCFA`]} />
              <Line type="monotone" dataKey="recettes" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="Recettes" />
              <Line type="monotone" dataKey="depenses" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} name="Dépenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Patients */}
      {activeTab === 'patients' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Nouveaux patients', value: '248', period: 'ce mois', color: 'var(--shifa-blue)' },
            { label: 'Patients récurrents', value: '3 154', period: 'actifs', color: '#16a34a' },
            { label: 'Taux de fidélisation', value: '92%', period: '12 derniers mois', color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-5 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--foreground)' }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.period}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quality */}
      {activeTab === 'quality' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Satisfaction patients', value: '4.7/5', icon: 'StarIcon', color: '#f59e0b' },
            { label: 'Délai moyen consultation', value: '18 min', icon: 'ClockIcon', color: 'var(--shifa-blue)' },
            { label: 'Incidents déclarés', value: '3', icon: 'ExclamationTriangleIcon', color: '#f87171' },
            { label: 'Taux de conformité', value: '96%', icon: 'ShieldCheckIcon', color: '#16a34a' },
          ].map(q => (
            <div key={q.label} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${q.color}18` }}>
                <Icon name={q.icon as any} size={22} style={{ color: q.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{q.value}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{q.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
