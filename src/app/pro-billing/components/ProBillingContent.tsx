'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';

type BillingTab = 'overview' | 'invoices' | 'acts' | 'insurance' | 'settings';

interface Act {
  id: string;
  patient: string;
  date: string;
  type: string;
  code: string;
  amount: number;
  status: 'billed' | 'pending' | 'paid' | 'cancelled';
  paymentMethod: string;
  insurer?: string;
  covered?: number;
}

interface Invoice {
  id: string;
  patient: string;
  date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: number;
}

const mockActs: Act[] = [
  { id: 'ACT-001', patient: 'Oumar Diallo', date: '2025-08-11', type: 'Consultation générale', code: 'C', amount: 15000, status: 'paid', paymentMethod: 'Wave', insurer: 'IPRES', covered: 10000 },
  { id: 'ACT-002', patient: 'Fatou Seck', date: '2025-08-11', type: 'Consultation spécialisée', code: 'CS', amount: 25000, status: 'billed', paymentMethod: 'Orange Money' },
  { id: 'ACT-003', patient: 'Ibrahima Ba', date: '2025-08-10', type: 'Téléconsultation', code: 'TC', amount: 12000, status: 'paid', paymentMethod: 'SHIFA Pay' },
  { id: 'ACT-004', patient: 'Mariama Ndiaye', date: '2025-08-10', type: 'Consultation + ECG', code: 'C+ECG', amount: 35000, status: 'pending', paymentMethod: '—', insurer: 'CNAM', covered: 20000 },
  { id: 'ACT-005', patient: 'Cheikh Diop', date: '2025-08-09', type: 'Consultation générale', code: 'C', amount: 15000, status: 'paid', paymentMethod: 'Espèces' },
  { id: 'ACT-006', patient: 'Rokhaya Fall', date: '2025-08-08', type: 'Certificat médical', code: 'CM', amount: 8000, status: 'paid', paymentMethod: 'Wave' },
];

const mockInvoices: Invoice[] = [
  { id: 'FAC-2025-0041', patient: 'Oumar Diallo', date: '2025-08-11', amount: 15000, status: 'paid', items: 1 },
  { id: 'FAC-2025-0042', patient: 'Fatou Seck', date: '2025-08-11', amount: 25000, status: 'sent', items: 1 },
  { id: 'FAC-2025-0043', patient: 'Ibrahima Ba', date: '2025-08-10', amount: 12000, status: 'paid', items: 1 },
  { id: 'FAC-2025-0044', patient: 'Mariama Ndiaye', date: '2025-08-10', amount: 35000, status: 'draft', items: 2 },
  { id: 'FAC-2025-0040', patient: 'Cheikh Diop', date: '2025-08-09', amount: 15000, status: 'paid', items: 1 },
];

const actStatusConfig = {
  billed: { label: 'Facturé', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
  paid: { label: 'Payé', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Annulé', color: '#6b7280', bg: '#f3f4f6' },
};

const invoiceStatusConfig = {
  draft: { label: 'Brouillon', color: '#6b7280', bg: '#f3f4f6' },
  sent: { label: 'Envoyée', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  paid: { label: 'Payée', color: '#16a34a', bg: '#dcfce7' },
  overdue: { label: 'En retard', color: '#dc2626', bg: '#fee2e2' },
};

export default function ProBillingContent() {
  const [activeTab, setActiveTab] = useState<BillingTab>('overview');

  const totalRevenue = mockActs.filter(a => a.status === 'paid').reduce((s, a) => s + a.amount, 0);
  const pendingRevenue = mockActs.filter(a => a.status !== 'paid' && a.status !== 'cancelled').reduce((s, a) => s + a.amount, 0);
  const insuranceCovered = mockActs.filter(a => a.covered).reduce((s, a) => s + (a.covered || 0), 0);
  const actCount = mockActs.length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Facturation & Revenus</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gestion des actes, factures, paiements et tiers payant</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouvel acte
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
            <Icon name="ArrowDownTrayIcon" size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Revenus encaissés', value: totalRevenue, icon: 'BanknotesIcon', color: '#16a34a', currency: true },
          { label: 'En attente', value: pendingRevenue, icon: 'ClockIcon', color: '#d97706', currency: true },
          { label: 'Tiers payant', value: insuranceCovered, icon: 'ShieldCheckIcon', color: 'var(--shifa-blue)', currency: true },
          { label: 'Actes ce mois', value: actCount, icon: 'ClipboardDocumentListIcon', color: '#8b5cf6', currency: false },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} />
            </div>
            <div className="min-w-0">
              {stat.currency ? (
                <CurrencyDisplay amount={stat.value} className="text-sm font-bold" style={{ color: 'var(--foreground)' }} />
              ) : (
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              )}
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'overview', label: 'Vue d\'ensemble', icon: 'ChartBarIcon' },
          { key: 'acts', label: 'Actes médicaux', icon: 'ClipboardDocumentListIcon' },
          { key: 'invoices', label: 'Factures', icon: 'DocumentTextIcon' },
          { key: 'insurance', label: 'Tiers payant', icon: 'ShieldCheckIcon' },
          { key: 'settings', label: 'Paramètres', icon: 'Cog6ToothIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as BillingTab)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Revenue chart placeholder */}
            <div className="card-base p-6">
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Revenus — Août 2025</h3>
              <div className="flex items-end gap-2 h-32">
                {[45, 62, 38, 75, 55, 80, 48, 90, 65, 72, 58, 85, 70, 95, 60, 78, 50, 88, 42, 76, 55, 68, 82, 45, 70, 58, 92, 65, 48, 75, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 30 ? 'var(--shifa-blue)' : 'rgba(0,102,255,0.2)',
                      minWidth: '4px',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>1 août</span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>31 août</span>
              </div>
            </div>

            {/* Recent acts */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Actes récents</h3>
                <button onClick={() => setActiveTab('acts')} className="text-sm font-semibold" style={{ color: 'var(--shifa-blue)' }}>Voir tout</button>
              </div>
              <div className="space-y-3">
                {mockActs.slice(0, 4).map(act => {
                  const s = actStatusConfig[act.status];
                  return (
                    <div key={act.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{act.patient}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{act.type} · {act.date}</p>
                      </div>
                      <CurrencyDisplay amount={act.amount} className="text-sm font-bold shrink-0" style={{ color: 'var(--foreground)' }} />
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Payment methods breakdown */}
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Modes de paiement</h3>
              <div className="space-y-2">
                {[
                  { method: 'Wave', amount: 23000, pct: 38 },
                  { method: 'Orange Money', amount: 25000, pct: 31 },
                  { method: 'SHIFA Pay', amount: 12000, pct: 20 },
                  { method: 'Espèces', amount: 15000, pct: 11 },
                ].map(item => (
                  <div key={item.method}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.method}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: 'var(--shifa-blue)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Actions rapides</h3>
              <div className="space-y-2">
                {[
                  { label: 'Créer une facture', icon: 'DocumentPlusIcon', color: 'var(--shifa-blue)' },
                  { label: 'Enregistrer un paiement', icon: 'BanknotesIcon', color: '#16a34a' },
                  { label: 'Soumettre tiers payant', icon: 'ShieldCheckIcon', color: '#8b5cf6' },
                  { label: 'Rapport mensuel', icon: 'ChartBarIcon', color: '#f59e0b' },
                ].map(action => (
                  <button key={action.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                    <Icon name={action.icon as any} size={16} style={{ color: action.color } as any} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Acts */}
      {activeTab === 'acts' && (
        <div className="card-base overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Actes médicaux</h3>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />
              Nouvel acte
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Réf.', 'Patient', 'Date', 'Acte', 'Code', 'Montant', 'Tiers payant', 'Mode', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockActs.map(act => {
                  const s = actStatusConfig[act.status];
                  return (
                    <tr key={act.id} className="border-b hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{act.id}</td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{act.patient}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{act.date}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{act.type}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{act.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <CurrencyDisplay amount={act.amount} className="text-sm font-bold" style={{ color: 'var(--foreground)' }} />
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: act.covered ? '#16a34a' : 'var(--muted-foreground)' }}>
                        {act.covered ? `${act.insurer} — ${act.covered.toLocaleString()} FCFA` : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{act.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {mockInvoices.map(inv => {
            const s = invoiceStatusConfig[inv.status];
            return (
              <div key={inv.id} className="card-base p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Icon name="DocumentTextIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{inv.id}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{inv.patient} · {inv.date} · {inv.items} ligne{inv.items > 1 ? 's' : ''}</p>
                </div>
                <CurrencyDisplay amount={inv.amount} className="text-sm font-bold shrink-0" style={{ color: 'var(--foreground)' }} />
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-muted transition-all">
                    <Icon name="EyeIcon" size={14} className="text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-all">
                    <Icon name="ArrowDownTrayIcon" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Insurance */}
      {activeTab === 'insurance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Tiers payant actifs</h3>
            <div className="space-y-3">
              {[
                { name: 'IPRES', type: 'Retraite', coverage: '70%', status: 'Actif', patients: 12 },
                { name: 'CNAM', type: 'Assurance maladie nationale', coverage: '80%', status: 'Actif', patients: 8 },
                { name: 'AXA Assurance', type: 'Assurance privée', coverage: '90%', status: 'Actif', patients: 5 },
                { name: 'Mutuelle Santé Pro', type: 'Mutuelle professionnelle', coverage: '75%', status: 'En attente', patients: 3 },
              ].map(ins => (
                <div key={ins.name} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                    <Icon name="ShieldCheckIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{ins.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ins.type} · {ins.patients} patients · Couverture {ins.coverage}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: ins.status === 'Actif' ? '#dcfce7' : '#fef3c7', color: ins.status === 'Actif' ? '#16a34a' : '#d97706' }}>
                    {ins.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Soumissions en attente</h3>
            <div className="space-y-3">
              {mockActs.filter(a => a.insurer && a.status !== 'paid').map(act => (
                <div key={act.id} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{act.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{act.type} · {act.insurer}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <CurrencyDisplay amount={act.covered || 0} className="text-sm font-bold" style={{ color: '#16a34a' }} />
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>à rembourser</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                    Soumettre
                  </button>
                </div>
              ))}
              {mockActs.filter(a => a.insurer && a.status !== 'paid').length === 0 && (
                <div className="text-center py-8">
                  <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' } as any} className="mx-auto mb-2" />
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Tout est à jour</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-lg mx-auto card-base p-6">
          <h3 className="text-base font-bold mb-6" style={{ color: 'var(--shifa-dark)' }}>Paramètres de facturation</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Numéro RPPS / Ordre</label>
              <input type="text" defaultValue="10003456789" className="w-full px-3 py-2.5 rounded-xl text-sm border font-mono" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Devise de facturation</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option>FCFA (XOF)</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Tarif consultation (C)</label>
              <input type="number" defaultValue={15000} className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Tarif consultation spécialisée (CS)</label>
              <input type="number" defaultValue={25000} className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Tarif téléconsultation (TC)</label>
              <input type="number" defaultValue={12000} className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              Enregistrer les paramètres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
