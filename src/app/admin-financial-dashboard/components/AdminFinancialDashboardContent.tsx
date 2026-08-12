'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import {
  getAdminFinancialSummary,
  getPayments,
  getSubscriptions,
  getCommissions,
  getSettlements,
  getTaxRecords,
  getRevenueReconciliation,
  getAmbassadorPayouts,
  getMarketplaceSettlements,
  type AdminFinancialSummary,
  type Payment,
  type Subscription,
  type Commission,
  type Settlement,
  type TaxRecord,
  type RevenueReconciliation,
  type AmbassadorPayout,
  type MarketplaceSettlement,
} from '@/lib/supabase/financialService';

type Tab = 'overview' | 'transactions' | 'subscriptions' | 'settlements' | 'taxes' | 'commissions' | 'reconciliation';

const STATUS_COLORS: Record<string, string> = {
  completed: '#16a34a', active: '#16a34a', paid: '#16a34a', settled: '#16a34a', reconciled: '#16a34a', approved: '#16a34a',
  pending: '#f59e0b', processing: '#0ea5e9', trialing: '#0ea5e9', draft: '#64748b', submitted: '#0ea5e9',
  failed: '#dc2626', cancelled: '#dc2626', overdue: '#dc2626', disputed: '#dc2626', expired: '#dc2626', past_due: '#dc2626',
  on_hold: '#f59e0b', paused: '#f59e0b',
};

const STATUS_BG: Record<string, string> = {
  completed: '#dcfce7', active: '#dcfce7', paid: '#dcfce7', settled: '#dcfce7', reconciled: '#dcfce7', approved: '#dcfce7',
  pending: '#fef3c7', processing: '#e0f2fe', trialing: '#e0f2fe', draft: '#f1f5f9', submitted: '#e0f2fe',
  failed: '#fee2e2', cancelled: '#fee2e2', overdue: '#fee2e2', disputed: '#fee2e2', expired: '#fee2e2', past_due: '#fee2e2',
  on_hold: '#fef3c7', paused: '#fef3c7',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: 'Carte', mobile_money: 'Mobile Money', bank_transfer: 'Virement', wallet: 'Portefeuille',
  insurance: 'Assurance', cash: 'Espèces', crypto: 'Crypto',
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratuit', starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise',
  institution: 'Institution', ambassador: 'Ambassadeur',
};

function fmt(n: number, currency = 'XOF'): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M ${currency}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K ${currency}`;
  return `${n.toLocaleString('fr-FR')} ${currency}`;
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || '#64748b';
  const bg = STATUS_BG[status] || '#f1f5f9';
  const labels: Record<string, string> = {
    completed: 'Complété', active: 'Actif', paid: 'Payé', settled: 'Réglé', reconciled: 'Réconcilié',
    approved: 'Approuvé', pending: 'En attente', processing: 'En cours', trialing: 'Essai', draft: 'Brouillon',
    submitted: 'Soumis', failed: 'Échoué', cancelled: 'Annulé', overdue: 'En retard', disputed: 'Contesté',
    expired: 'Expiré', past_due: 'Impayé', on_hold: 'En pause', paused: 'Suspendu',
  };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: bg, color }}>
      {labels[status] || status}
    </span>
  );
}

export default function AdminFinancialDashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [summary, setSummary] = useState<AdminFinancialSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const [reconciliation, setReconciliation] = useState<RevenueReconciliation[]>([]);
  const [ambassadorPayouts, setAmbassadorPayouts] = useState<AmbassadorPayout[]>([]);
  const [marketplaceSettlements, setMarketplaceSettlements] = useState<MarketplaceSettlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sum, pays, subs, comms, settles, taxes, recon, payouts, mktSettles] = await Promise.all([
        getAdminFinancialSummary(),
        getPayments(30),
        getSubscriptions(30),
        getCommissions(30),
        getSettlements(20),
        getTaxRecords(20),
        getRevenueReconciliation(),
        getAmbassadorPayouts(20),
        getMarketplaceSettlements(20),
      ]);
      setSummary(sum);
      setPayments(pays);
      setSubscriptions(subs);
      setCommissions(comms);
      setSettlements(settles);
      setTaxRecords(taxes);
      setReconciliation(recon);
      setAmbassadorPayouts(payouts);
      setMarketplaceSettlements(mktSettles);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'transactions', label: 'Transactions', icon: 'BanknotesIcon' },
    { id: 'subscriptions', label: 'Abonnements', icon: 'StarIcon' },
    { id: 'settlements', label: 'Règlements', icon: 'ArrowsRightLeftIcon' },
    { id: 'taxes', label: 'Taxes', icon: 'DocumentTextIcon' },
    { id: 'commissions', label: 'Commissions', icon: 'TrophyIcon' },
    { id: 'reconciliation', label: 'Réconciliation', icon: 'ChartBarIcon' },
  ];

  // Build chart data from payments
  const paymentsByMethod = payments.reduce<Record<string, number>>((acc, p) => {
    if (p.status === 'completed') {
      acc[p.payment_method] = (acc[p.payment_method] || 0) + p.amount;
    }
    return acc;
  }, {});

  const paymentMethodChartData = Object.entries(paymentsByMethod).map(([method, value], i) => ({
    name: PAYMENT_METHOD_LABELS[method] || method,
    value,
    color: ['#2563eb', '#0891b2', '#7c3aed', '#059669', '#f59e0b', '#ef4444'][i % 6],
  }));

  const subscriptionsByPlan = subscriptions.reduce<Record<string, number>>((acc, s) => {
    if (s.status === 'active') acc[s.plan] = (acc[s.plan] || 0) + 1;
    return acc;
  }, {});

  const planChartData = Object.entries(subscriptionsByPlan).map(([plan, count], i) => ({
    name: PLAN_LABELS[plan] || plan,
    count,
    color: ['#2563eb', '#0891b2', '#7c3aed', '#059669', '#f59e0b', '#ef4444'][i % 6],
  }));

  const revenueChartData = reconciliation.slice(0, 6).reverse().map((r) => ({
    period: r.period_start.slice(0, 7),
    subscriptions: r.subscription_revenue,
    payments: r.payment_revenue,
    marketplace: r.marketplace_revenue,
    net: r.net_revenue,
  }));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <Icon name="ChartBarSquareIcon" size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
                  Dashboard Financier Admin
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  MRR · Transactions · Règlements · Taxes · Commissions — 12 domaines Phase 2
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <Icon name="ArrowPathIcon" size={15} />
            Actualiser
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === tab.id ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={tab.icon as any} size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
            <Icon name="ExclamationCircleIcon" size={18} style={{ color: '#dc2626' }} />
            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
            <button onClick={loadData} className="ml-auto text-xs underline" style={{ color: '#dc2626' }}>Réessayer</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des données financières…</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === 'overview' && summary && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'MRR (Abonnements actifs)', value: fmt(summary.totalMRR), icon: 'ArrowTrendingUpIcon', color: '#16a34a', sub: `${summary.activeSubscriptions} abonnements actifs` },
                    { label: 'Volume transactions (30j)', value: fmt(summary.totalTransactionVolume), icon: 'BanknotesIcon', color: '#2563eb', sub: `${payments.filter(p => p.status === 'completed').length} transactions` },
                    { label: 'Règlements en attente', value: fmt(summary.pendingSettlements), icon: 'ClockIcon', color: '#f59e0b', sub: `${settlements.filter(s => s.status === 'pending').length} règlements` },
                    { label: 'Taxes collectées', value: fmt(summary.totalTaxCollected), icon: 'DocumentTextIcon', color: '#7c3aed', sub: `${taxRecords.filter(t => t.status === 'paid').length} déclarations payées` },
                    { label: 'Commissions versées', value: fmt(summary.totalCommissionsPaid), icon: 'TrophyIcon', color: '#0891b2', sub: `${commissions.filter(c => c.status === 'paid').length} commissions` },
                    { label: 'Paiements échoués', value: String(summary.failedPayments), icon: 'ExclamationCircleIcon', color: '#dc2626', sub: 'Derniers 30 jours' },
                    { label: 'Règlements marketplace', value: fmt(marketplaceSettlements.reduce((s, m) => s + m.net_settlement, 0)), icon: 'BuildingStorefrontIcon', color: '#059669', sub: `${marketplaceSettlements.length} règlements` },
                    { label: 'Versements ambassadeurs', value: fmt(ambassadorPayouts.reduce((s, p) => s + p.net_payout, 0)), icon: 'StarIcon', color: '#f59e0b', sub: `${ambassadorPayouts.length} versements` },
                  ].map((kpi, i) => (
                    <div key={i} className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium leading-tight" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.color + '20' }}>
                          <Icon name={kpi.icon as any} size={15} style={{ color: kpi.color }} />
                        </div>
                      </div>
                      <p className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{kpi.value}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {revenueChartData.length > 0 && (
                    <div className="lg:col-span-2 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Revenus par source (historique)</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueChartData}>
                          <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                          <Tooltip formatter={(v: number) => [fmt(v)]} />
                          <Area type="monotone" dataKey="subscriptions" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} name="Abonnements" />
                          <Area type="monotone" dataKey="payments" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} name="Paiements" />
                          <Area type="monotone" dataKey="marketplace" stroke="#059669" fill="#d1fae5" strokeWidth={2} name="Marketplace" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {paymentMethodChartData.length > 0 && (
                    <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Volume par méthode de paiement</h3>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={paymentMethodChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                            {paymentMethodChartData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number) => [fmt(v)]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 mt-2">
                        {paymentMethodChartData.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.name}</span>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{fmt(s.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subscription plan breakdown */}
                {planChartData.length > 0 && (
                  <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition des abonnements actifs par plan</h3>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={planChartData} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip formatter={(v: number) => [`${v} abonnements`]} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {planChartData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* TRANSACTIONS */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Transactions récentes ({payments.length})</h3>
                    <div className="flex gap-2">
                      {['completed', 'pending', 'failed'].map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: STATUS_BG[s], color: STATUS_COLORS[s] }}>
                          {payments.filter(p => p.status === s).length} {s === 'completed' ? 'complétés' : s === 'pending' ? 'en attente' : 'échoués'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {payments.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucune transaction</p>
                    ) : (
                      payments.map((p) => (
                        <div key={p.id} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: STATUS_BG[p.status] || '#f1f5f9' }}>
                              <Icon name="BanknotesIcon" size={14} style={{ color: STATUS_COLORS[p.status] || '#64748b' }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.reference}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                {PAYMENT_METHOD_LABELS[p.payment_method] || p.payment_method}
                                {p.provider ? ` · ${p.provider}` : ''}
                                {p.description ? ` · ${p.description}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <StatusBadge status={p.status} />
                            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{fmt(p.amount, p.currency)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBSCRIPTIONS */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-4">
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Abonnements ({subscriptions.length})</h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {subscriptions.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucun abonnement</p>
                    ) : (
                      subscriptions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{PLAN_LABELS[s.plan] || s.plan}</p>
                              <StatusBadge status={s.status} />
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                              {s.billing_cycle === 'monthly' ? 'Mensuel' : 'Annuel'} · Expire {new Date(s.current_period_end).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{fmt(s.amount, s.currency)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SETTLEMENTS */}
            {activeTab === 'settlements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Platform settlements */}
                  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Règlements plateforme</h3>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {settlements.length === 0 ? (
                        <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucun règlement</p>
                      ) : (
                        settlements.map((s) => (
                          <div key={s.id} className="px-5 py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.reference}</p>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                  {s.settlement_type} · {s.transaction_count} transactions
                                </p>
                              </div>
                              <StatusBadge status={s.status} />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs space-y-0.5" style={{ color: 'var(--muted-foreground)' }}>
                                <p>Brut: {fmt(s.gross_amount, s.currency)}</p>
                                <p>Frais: {fmt(s.platform_fee, s.currency)}</p>
                                <p>Taxes: {fmt(s.tax_withheld, s.currency)}</p>
                              </div>
                              <p className="text-base font-bold" style={{ color: '#16a34a' }}>Net: {fmt(s.net_amount, s.currency)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Marketplace settlements */}
                  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Règlements marketplace</h3>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {marketplaceSettlements.length === 0 ? (
                        <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucun règlement marketplace</p>
                      ) : (
                        marketplaceSettlements.map((m) => (
                          <div key={m.id} className="px-5 py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                                  {new Date(m.period_start).toLocaleDateString('fr-FR')} → {new Date(m.period_end).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.order_count} commandes</p>
                              </div>
                              <StatusBadge status={m.status} />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs space-y-0.5" style={{ color: 'var(--muted-foreground)' }}>
                                <p>Ventes: {fmt(m.total_sales, m.currency)}</p>
                                <p>Commission: {fmt(m.platform_commission, m.currency)}</p>
                              </div>
                              <p className="text-base font-bold" style={{ color: '#16a34a' }}>Net: {fmt(m.net_settlement, m.currency)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Ambassador payouts */}
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Versements ambassadeurs</h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {ambassadorPayouts.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucun versement</p>
                    ) : (
                      ambassadorPayouts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                              {new Date(p.period_start).toLocaleDateString('fr-FR')} → {new Date(p.period_end).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Commissions: {fmt(p.total_commissions, p.currency)} · Bonus: {fmt(p.total_bonuses, p.currency)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={p.status} />
                            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{fmt(p.net_payout, p.currency)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAXES */}
            {activeTab === 'taxes' && (
              <div className="space-y-4">
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Registre fiscal ({taxRecords.length})</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        Collecté: {fmt(taxRecords.filter(t => t.status === 'paid').reduce((s, t) => s + t.tax_amount, 0))}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                        En attente: {fmt(taxRecords.filter(t => t.status === 'pending').reduce((s, t) => s + t.tax_amount, 0))}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {taxRecords.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucun enregistrement fiscal</p>
                    ) : (
                      taxRecords.map((t) => (
                        <div key={t.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                              {t.tax_type} — {t.country_code} ({t.tax_rate}%)
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Base imposable: {fmt(t.taxable_amount, t.currency)}
                              {t.period_start ? ` · ${new Date(t.period_start).toLocaleDateString('fr-FR')}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={t.status} />
                            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{fmt(t.tax_amount, t.currency)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* COMMISSIONS */}
            {activeTab === 'commissions' && (
              <div className="space-y-4">
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Commissions ambassadeurs ({commissions.length})</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        Total: {fmt(commissions.reduce((s, c) => s + c.commission_amount, 0))}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {commissions.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucune commission</p>
                    ) : (
                      commissions.map((c) => (
                        <div key={c.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                              {c.commission_type === 'referral' ? 'Parrainage' : c.commission_type} — {c.rate}%
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Base: {fmt(c.base_amount, c.currency)} · {new Date(c.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={c.status} />
                            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{fmt(c.commission_amount, c.currency)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* RECONCILIATION */}
            {activeTab === 'reconciliation' && (
              <div className="space-y-6">
                {reconciliation.length > 0 && (
                  <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Revenus nets réconciliés</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={revenueChartData}>
                        <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                        <Tooltip formatter={(v: number) => [fmt(v)]} />
                        <Line type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4 }} name="Revenu net" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Périodes de réconciliation</h3>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {reconciliation.length === 0 ? (
                      <p className="p-6 text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>Aucune réconciliation</p>
                    ) : (
                      reconciliation.map((r) => (
                        <div key={r.id} className="px-5 py-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                {new Date(r.period_start).toLocaleDateString('fr-FR')} → {new Date(r.period_end).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={r.status} />
                              <p className="text-base font-bold" style={{ color: '#2563eb' }}>{fmt(r.net_revenue, r.currency)}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mt-2">
                            {[
                              { label: 'Abonnements', value: r.subscription_revenue },
                              { label: 'Paiements', value: r.payment_revenue },
                              { label: 'Marketplace', value: r.marketplace_revenue },
                              { label: 'API', value: r.api_revenue },
                              { label: 'Remboursements', value: -r.total_refunds },
                              { label: 'Taxes collectées', value: r.total_taxes_collected },
                            ].map((item, i) => (
                              <div key={i} className="rounded-lg p-2" style={{ backgroundColor: 'var(--muted)' }}>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                                <p className="text-xs font-semibold mt-0.5" style={{ color: item.value < 0 ? '#dc2626' : 'var(--foreground)' }}>
                                  {fmt(Math.abs(item.value), r.currency)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
