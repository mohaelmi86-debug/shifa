'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', recettes: 4200000, depenses: 2800000, net: 1400000 },
  { month: 'Fév', recettes: 3900000, depenses: 2600000, net: 1300000 },
  { month: 'Mar', recettes: 5100000, depenses: 3100000, net: 2000000 },
  { month: 'Avr', recettes: 4700000, depenses: 2900000, net: 1800000 },
  { month: 'Mai', recettes: 5400000, depenses: 3200000, net: 2200000 },
  { month: 'Jun', recettes: 6100000, depenses: 3500000, net: 2600000 },
  { month: 'Jul', recettes: 5800000, depenses: 3300000, net: 2500000 },
  { month: 'Aoû', recettes: 6400000, depenses: 3600000, net: 2800000 },
];

const expenseBreakdown = [
  { name: 'Personnel', value: 45, color: '#3b82f6' },
  { name: 'Médicaments', value: 22, color: '#10b981' },
  { name: 'Équipements', value: 15, color: '#f59e0b' },
  { name: 'Maintenance', value: 10, color: '#8b5cf6' },
  { name: 'Autres', value: 8, color: '#64748b' },
];

const invoices = [
  { id: 'FAC-2026-0841', patient: 'Aïcha Diallo', service: 'Consultation générale', amount: 15000, status: 'payée', date: '2026-08-10', mode: 'SHIFA Pay' },
  { id: 'FAC-2026-0840', patient: 'Moussa Traoré', service: 'Téléconsultation', amount: 12000, status: 'en attente', date: '2026-08-09', mode: 'Assurance' },
  { id: 'FAC-2026-0839', patient: 'Fatou Ndiaye', service: 'Bilan biologique', amount: 28500, status: 'payée', date: '2026-08-09', mode: 'Espèces' },
  { id: 'FAC-2026-0838', patient: 'Ibrahim Sow', service: 'Radiographie', amount: 35000, status: 'impayée', date: '2026-08-08', mode: 'Tiers payant' },
  { id: 'FAC-2026-0837', patient: 'Mariama Ba', service: 'Consultation spécialisée', amount: 25000, status: 'payée', date: '2026-08-07', mode: 'Mobile Money' },
];

const budgetLines = [
  { category: 'Personnel soignant', budget: 18000000, spent: 14200000, pct: 79 },
  { category: 'Pharmacie & Médicaments', budget: 8000000, spent: 7100000, pct: 89 },
  { category: 'Équipements médicaux', budget: 5000000, spent: 2800000, pct: 56 },
  { category: 'Maintenance & Travaux', budget: 3000000, spent: 1900000, pct: 63 },
  { category: 'Formation & Développement', budget: 2000000, spent: 800000, pct: 40 },
];

const tabs = ['Vue d\'ensemble', 'Recettes & Dépenses', 'Factures', 'Budget', 'Tiers payant'];

const statusColors: Record<string, string> = {
  'payée': 'bg-green-100 text-green-700',
  'en attente': 'bg-amber-100 text-amber-700',
  'impayée': 'bg-red-100 text-red-700',
};

export default function OrgFinanceDashboardContent() {
  const [activeTab, setActiveTab] = useState(0);

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Finance — CHU Saint-Louis</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Tableau de bord financier de l'organisation · Exercice 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
            <option>Août 2026</option>
            <option>Juillet 2026</option>
            <option>Juin 2026</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)' }}>
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        {[
          { label: 'Recettes du mois', value: '6 400 000 FCFA', delta: '+10.3%', up: true, icon: 'ArrowTrendingUpIcon', color: '#16a34a' },
          { label: 'Dépenses du mois', value: '3 600 000 FCFA', delta: '+9.1%', up: false, icon: 'ArrowTrendingDownIcon', color: '#dc2626' },
          { label: 'Résultat net', value: '2 800 000 FCFA', delta: '+12.0%', up: true, icon: 'BanknotesIcon', color: '#2563eb' },
          { label: 'Factures impayées', value: '14', delta: '-3 vs mois dernier', up: true, icon: 'DocumentTextIcon', color: '#d97706' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
            </div>
            <p className="text-lg font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: k.up ? '#16a34a' : '#dc2626' }}>{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{ borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent', color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold mb-4 text-sm">Recettes vs Dépenses (8 mois)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => (v / 1000000).toFixed(1) + 'M'} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="recettes" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Recettes" />
                  <Bar dataKey="depenses" fill="#f87171" radius={[3, 3, 0, 0]} name="Dépenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold mb-4 text-sm">Répartition des dépenses</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {expenseBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => v + '%'} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {expenseBreakdown.map(e => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                      <span>{e.name}</span>
                    </div>
                    <span className="font-medium">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Recettes & Dépenses */}
        {activeTab === 1 && (
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <h3 className="font-semibold mb-4 text-sm">Résultat net mensuel</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => (v / 1000000).toFixed(1) + 'M'} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Line type="monotone" dataKey="recettes" stroke="#3b82f6" strokeWidth={2} dot={false} name="Recettes" />
                <Line type="monotone" dataKey="depenses" stroke="#f87171" strokeWidth={2} dot={false} name="Dépenses" />
                <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2.5} dot={false} name="Net" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 2: Factures */}
        {activeTab === 2 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold text-sm">Factures récentes</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: 'var(--border)' }}>
                <Icon name="PlusIcon" size={12} />
                Nouvelle facture
              </button>
            </div>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: 'var(--muted)' }}>
                <tr>
                  {['N° Facture', 'Patient', 'Service', 'Montant', 'Mode', 'Date', 'Statut'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={inv.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td className="px-4 py-3 font-mono text-xs">{inv.id}</td>
                    <td className="px-4 py-3 font-medium">{inv.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inv.service}</td>
                    <td className="px-4 py-3 font-semibold">{inv.amount.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3 text-xs">{inv.mode}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{inv.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Budget */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Suivi budgétaire — Exercice 2026</h3>
            {budgetLines.map(b => (
              <div key={b.category} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{b.category}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{fmt(b.spent)} / {fmt(b.budget)}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${b.pct}%`, backgroundColor: b.pct > 85 ? '#dc2626' : b.pct > 70 ? '#f59e0b' : '#16a34a' }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: b.pct > 85 ? '#dc2626' : 'var(--muted-foreground)' }}>{b.pct}% consommé</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Tiers payant */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Conventions tiers payant actives</h3>
            {[
              { name: 'IPRES', type: 'Retraite', pending: 8, amount: 420000, status: 'actif' },
              { name: 'CSS Sénégal', type: 'Sécurité sociale', pending: 12, amount: 680000, status: 'actif' },
              { name: 'Allianz Sénégal', type: 'Assurance privée', pending: 3, amount: 195000, status: 'actif' },
              { name: 'LONASE Mutuelle', type: 'Mutuelle', pending: 5, amount: 310000, status: 'en révision' },
            ].map((tp, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name="ShieldCheckIcon" size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{tp.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tp.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-amber-600">{tp.pending}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>En attente</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{tp.amount.toLocaleString('fr-FR')} FCFA</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>À récupérer</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${tp.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{tp.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
