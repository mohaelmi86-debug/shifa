'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

type Tab = 'overview' | 'revenue' | 'expenses' | 'cashflow' | 'reports';

const revenueData = [
  { month: 'Mar', consultations: 4200000, teleconsult: 1800000, pharmacy: 2100000, lab: 980000 },
  { month: 'Avr', consultations: 4800000, teleconsult: 2100000, pharmacy: 2400000, lab: 1100000 },
  { month: 'Mai', consultations: 5100000, teleconsult: 2400000, pharmacy: 2200000, lab: 1250000 },
  { month: 'Jun', consultations: 4900000, teleconsult: 2800000, pharmacy: 2600000, lab: 1400000 },
  { month: 'Jul', consultations: 5600000, teleconsult: 3100000, pharmacy: 2900000, lab: 1600000 },
  { month: 'Aoû', consultations: 5200000, teleconsult: 2900000, pharmacy: 2700000, lab: 1480000 },
];

const expenseData = [
  { month: 'Mar', salaires: 6200000, fournitures: 1200000, equipements: 800000, loyer: 1500000 },
  { month: 'Avr', salaires: 6200000, fournitures: 1400000, equipements: 600000, loyer: 1500000 },
  { month: 'Mai', salaires: 6400000, fournitures: 1100000, equipements: 1200000, loyer: 1500000 },
  { month: 'Jun', salaires: 6200000, fournitures: 1300000, equipements: 900000, loyer: 1500000 },
  { month: 'Jul', salaires: 6600000, fournitures: 1500000, equipements: 700000, loyer: 1500000 },
  { month: 'Aoû', salaires: 6400000, fournitures: 1200000, equipements: 850000, loyer: 1500000 },
];

const cashflowData = [
  { month: 'Mar', entrees: 9080000, sorties: 9700000, net: -620000 },
  { month: 'Avr', entrees: 10400000, sorties: 9700000, net: 700000 },
  { month: 'Mai', entrees: 10950000, sorties: 10200000, net: 750000 },
  { month: 'Jun', entrees: 11700000, sorties: 9900000, net: 1800000 },
  { month: 'Jul', entrees: 13200000, sorties: 10300000, net: 2900000 },
  { month: 'Aoû', entrees: 12280000, sorties: 9950000, net: 2330000 },
];

const revenueBySource = [
  { name: 'Consultations', value: 5200000, color: '#2563eb' },
  { name: 'Téléconsultations', value: 2900000, color: '#0891b2' },
  { name: 'Pharmacie', value: 2700000, color: '#7c3aed' },
  { name: 'Laboratoire', value: 1480000, color: '#059669' },
];

const topServices = [
  { name: 'Consultation générale', revenue: 2100000, count: 420, trend: '+8%' },
  { name: 'Téléconsultation', revenue: 2900000, count: 580, trend: '+22%' },
  { name: 'Analyse biologique', revenue: 1480000, count: 296, trend: '+12%' },
  { name: 'Consultation spécialisée', revenue: 1800000, count: 180, trend: '+5%' },
  { name: 'Pharmacie OTC', revenue: 1200000, count: 800, trend: '+3%' },
];

const pendingPayments = [
  { id: 'INV-2026-0892', entity: 'CNSS Sénégal', amount: 1840000, dueDate: '2026-08-20', type: 'Assurance', overdue: false },
  { id: 'INV-2026-0889', entity: 'IPM Fonctionnaires', amount: 920000, dueDate: '2026-08-15', type: 'Mutuelle', overdue: false },
  { id: 'INV-2026-0881', entity: 'Allianz Sénégal', amount: 640000, dueDate: '2026-08-08', type: 'Assurance', overdue: true },
  { id: 'INV-2026-0874', entity: 'NSIA Assurances', amount: 380000, dueDate: '2026-08-05', type: 'Assurance', overdue: true },
];

const COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#059669'];

export default function FinanceDashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'revenue', label: 'Revenus', icon: 'ArrowTrendingUpIcon' },
    { id: 'expenses', label: 'Dépenses', icon: 'ArrowTrendingDownIcon' },
    { id: 'cashflow', label: 'Trésorerie', icon: 'BanknotesIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  const currentRevenue = revenueData[revenueData.length - 1];
  const totalRevenue = currentRevenue.consultations + currentRevenue.teleconsult + currentRevenue.pharmacy + currentRevenue.lab;
  const currentExpenses = expenseData[expenseData.length - 1];
  const totalExpenses = currentExpenses.salaires + currentExpenses.fournitures + currentExpenses.equipements + currentExpenses.loyer;
  const netProfit = totalRevenue - totalExpenses;
  const margin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Tableau de bord Financier
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Revenus, dépenses, trésorerie et performance financière
            </p>
            <div className="mt-1.5">
              <CurrencyDisplay amount={11080000} currency="XOF" showReference size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <option>Août 2026</option>
              <option>Juillet 2026</option>
              <option>Juin 2026</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Revenus (Août)', value: `${(totalRevenue / 1000000).toFixed(1)}M`, unit: 'XOF', sub: '+12% vs juillet', icon: 'ArrowTrendingUpIcon', color: '#16a34a', trend: 'up' },
                { label: 'Dépenses (Août)', value: `${(totalExpenses / 1000000).toFixed(1)}M`, unit: 'XOF', sub: '+3% vs juillet', icon: 'ArrowTrendingDownIcon', color: '#dc2626', trend: 'up' },
                { label: 'Résultat net', value: `${(netProfit / 1000000).toFixed(1)}M`, unit: 'XOF', sub: `Marge ${margin}%`, icon: 'ChartBarIcon', color: 'var(--shifa-blue)', trend: 'up' },
                { label: 'Créances en attente', value: `${(pendingPayments.reduce((a, p) => a + p.amount, 0) / 1000000).toFixed(1)}M`, unit: 'XOF', sub: `${pendingPayments.filter(p => p.overdue).length} en retard`, icon: 'ClockIcon', color: '#f59e0b', trend: 'neutral' },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.color + '20' }}>
                      <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
                    {kpi.value} <span className="text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>{kpi.unit}</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: kpi.trend === 'up' && i < 2 ? (i === 0 ? '#16a34a' : '#dc2626') : 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Revenus vs Dépenses (6 mois)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cashflowData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(v: number) => [`${(v/1000000).toFixed(2)}M XOF`]} />
                    <Area type="monotone" dataKey="entrees" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} name="Revenus" />
                    <Area type="monotone" dataKey="sorties" stroke="#dc2626" fill="#fee2e2" strokeWidth={2} name="Dépenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Revenus par source</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={revenueBySource} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {revenueBySource.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${(v/1000000).toFixed(2)}M XOF`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {revenueBySource.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.name}</span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{(s.value/1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top services + Pending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Top services par revenu</h3>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {topServices.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-5 text-center" style={{ color: 'var(--muted-foreground)' }}>#{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.count} actes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{(s.revenue/1000000).toFixed(1)}M XOF</p>
                        <p className="text-xs" style={{ color: '#16a34a' }}>{s.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Créances en attente</h3>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {pendingPayments.map(p => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.entity}</p>
                          {p.overdue && <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Retard</span>}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.type} · Échéance {p.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: p.overdue ? '#dc2626' : 'var(--foreground)' }}>{(p.amount/1000000).toFixed(2)}M XOF</p>
                        <button className="text-xs" style={{ color: 'var(--shifa-blue)' }}>Relancer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVENUE */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Revenus par source (6 mois)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => [`${(v/1000000).toFixed(2)}M XOF`]} />
                  <Bar dataKey="consultations" fill="#2563eb" name="Consultations" stackId="a" />
                  <Bar dataKey="teleconsult" fill="#0891b2" name="Téléconsult." stackId="a" />
                  <Bar dataKey="pharmacy" fill="#7c3aed" name="Pharmacie" stackId="a" />
                  <Bar dataKey="lab" fill="#059669" name="Laboratoire" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {revenueBySource.map((s, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: s.color }} />
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{(s.value/1000000).toFixed(1)}M</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Dépenses par catégorie (6 mois)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={expenseData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => [`${(v/1000000).toFixed(2)}M XOF`]} />
                  <Bar dataKey="salaires" fill="#ef4444" name="Salaires" stackId="a" />
                  <Bar dataKey="fournitures" fill="#f97316" name="Fournitures" stackId="a" />
                  <Bar dataKey="equipements" fill="#eab308" name="Équipements" stackId="a" />
                  <Bar dataKey="loyer" fill="#8b5cf6" name="Loyer" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Salaires', value: 6400000, color: '#ef4444' },
                { label: 'Fournitures', value: 1200000, color: '#f97316' },
                { label: 'Équipements', value: 850000, color: '#eab308' },
                { label: 'Loyer', value: 1500000, color: '#8b5cf6' },
              ].map((e, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: e.color }} />
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{(e.value/1000000).toFixed(1)}M</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{e.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASHFLOW */}
        {activeTab === 'cashflow' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Entrées (Août)', value: cashflowData[5].entrees, color: '#16a34a' },
                { label: 'Sorties (Août)', value: cashflowData[5].sorties, color: '#dc2626' },
                { label: 'Flux net (Août)', value: cashflowData[5].net, color: 'var(--shifa-blue)' },
              ].map((k, i) => (
                <div key={i} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                  <p className="text-2xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{(k.value/1000000).toFixed(2)}M XOF</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Flux de trésorerie net (6 mois)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={cashflowData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => [`${(v/1000000).toFixed(2)}M XOF`]} />
                  <Line type="monotone" dataKey="net" stroke="var(--shifa-blue)" strokeWidth={3} dot={{ fill: 'var(--shifa-blue)', r: 5 }} name="Flux net" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { title: 'Bilan mensuel — Août 2026', desc: 'Revenus, dépenses, résultat net, marges', icon: 'DocumentChartBarIcon', type: 'PDF', date: '2026-08-10' },
              { title: 'Rapport trimestriel Q2 2026', desc: 'Analyse comparative T1 vs T2, KPIs financiers', icon: 'ChartBarIcon', type: 'PDF', date: '2026-07-01' },
              { title: 'Créances assurances — Août', desc: 'État des remboursements en attente par assureur', icon: 'ClipboardDocumentListIcon', type: 'Excel', date: '2026-08-10' },
              { title: 'Analyse des coûts — Juillet', desc: 'Décomposition des dépenses par département', icon: 'CalculatorIcon', type: 'PDF', date: '2026-08-01' },
              { title: 'Prévisions budgétaires S2 2026', desc: 'Projections revenus et dépenses H2', icon: 'ArrowTrendingUpIcon', type: 'Excel', date: '2026-07-15' },
              { title: 'Rapport annuel 2025', desc: 'Bilan complet exercice 2025', icon: 'BookOpenIcon', type: 'PDF', date: '2026-01-31' },
            ].map((r, i) => (
              <div key={i} className="rounded-xl border p-5 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name={r.icon as any} size={22} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: r.type === 'PDF' ? '#fee2e2' : '#dcfce7', color: r.type === 'PDF' ? '#dc2626' : '#16a34a' }}>{r.type}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 rounded-lg border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <Icon name="ArrowDownTrayIcon" size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
