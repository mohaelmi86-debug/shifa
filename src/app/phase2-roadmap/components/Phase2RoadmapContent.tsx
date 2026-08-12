'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

// ─── Domain Data ──────────────────────────────────────────────────────────────

type DomainStatus = 'foundation' | 'in_progress' | 'planned' | 'blocked';
type DomainPhase = 1 | 2 | 3;

interface DataDep {
  from: string;
  to: string;
  label: string;
  critical: boolean;
}

interface Domain {
  id: string;
  order: number;
  phase: DomainPhase;
  label: string;
  labelFr: string;
  icon: string;
  status: DomainStatus;
  route?: string;
  description: string;
  inputs: string[];   // domain IDs this depends on
  outputs: string[];  // domain IDs that depend on this
  tables: string[];
  kpis: string[];
  wave: number; // implementation wave 1-4
}

const domains: Domain[] = [
  {
    id: 'subscriptions',
    order: 1,
    phase: 2,
    label: 'Subscriptions',
    labelFr: 'Abonnements',
    icon: 'StarIcon',
    status: 'foundation',
    route: '/subscription-management',
    description: 'Plan lifecycle, billing cycles, upgrades/downgrades, trial management, and renewal logic for all actor types.',
    inputs: [],
    outputs: ['payments', 'taxes', 'revenue_reconciliation'],
    tables: ['subscriptions', 'subscription_plans', 'billing_cycles'],
    kpis: ['MRR', 'ARR', 'Churn Rate', 'Trial Conversion'],
    wave: 1,
  },
  {
    id: 'payments',
    order: 2,
    phase: 2,
    label: 'Payments',
    labelFr: 'Paiements',
    icon: 'CreditCardIcon',
    status: 'foundation',
    route: '/patient-payments',
    description: 'Multi-method payment processing (card, mobile money, bank transfer, wallet) with retry logic and reconciliation hooks.',
    inputs: ['subscriptions'],
    outputs: ['taxes', 'commissions', 'revenue_reconciliation', 'marketplace_settlement'],
    tables: ['payments', 'payment_methods', 'payment_intents', 'refunds'],
    kpis: ['Payment Success Rate', 'Avg Transaction Value', 'Refund Rate'],
    wave: 1,
  },
  {
    id: 'taxes',
    order: 3,
    phase: 2,
    label: 'Taxes',
    labelFr: 'Fiscalité',
    icon: 'DocumentTextIcon',
    status: 'foundation',
    route: '/tax-configuration',
    description: 'Configurable tax rules per country × service type. VAT, withholding, digital services tax — no hardcoded rates.',
    inputs: ['subscriptions', 'payments'],
    outputs: ['revenue_reconciliation', 'marketplace_settlement'],
    tables: ['tax_rules', 'tax_rates', 'tax_transactions', 'tax_exemptions'],
    kpis: ['Tax Collected', 'Effective Rate', 'Compliance Coverage'],
    wave: 1,
  },
  {
    id: 'commissions',
    order: 4,
    phase: 2,
    label: 'Commissions',
    labelFr: 'Commissions',
    icon: 'ReceiptPercentIcon',
    status: 'planned',
    description: 'Platform fee calculation on consultations, marketplace transactions, and referrals. Configurable per actor and country.',
    inputs: ['payments', 'marketplace_settlement'],
    outputs: ['ambassador_payouts', 'revenue_reconciliation'],
    tables: ['commission_rules', 'commission_ledger', 'commission_tiers'],
    kpis: ['Commission Revenue', 'Avg Commission %', 'Net Revenue After Commission'],
    wave: 2,
  },
  {
    id: 'api_billing',
    order: 5,
    phase: 2,
    label: 'API Billing',
    labelFr: 'Facturation API',
    icon: 'CodeBracketIcon',
    status: 'foundation',
    route: '/api-monetization',
    description: 'Usage-based billing for FHIR, HL7, DICOM, and REST API consumers. Metered quotas, overage charges, SLA credits.',
    inputs: ['subscriptions', 'payments'],
    outputs: ['revenue_reconciliation'],
    tables: ['api_usage_logs', 'api_billing_plans', 'api_quotas', 'api_invoices'],
    kpis: ['API Revenue', 'Calls/Month', 'Overage Rate', 'SLA Breach Credits'],
    wave: 2,
  },
  {
    id: 'card_delivery',
    order: 6,
    phase: 2,
    label: 'Card Delivery',
    labelFr: 'Livraison Carte',
    icon: 'TruckIcon',
    status: 'foundation',
    route: '/card-economy',
    description: 'Physical SHIFA card manufacturing, activation fees, delivery tracking, replacement, and renewal cost management.',
    inputs: ['payments', 'subscriptions'],
    outputs: ['revenue_reconciliation'],
    tables: ['card_orders', 'card_delivery_tracking', 'card_fees'],
    kpis: ['Cards Issued', 'Delivery Success Rate', 'Avg Delivery Cost', 'Activation Rate'],
    wave: 2,
  },
  {
    id: 'insurance_claims',
    order: 7,
    phase: 2,
    label: 'Insurance Claims',
    labelFr: 'Remboursements Assurance',
    icon: 'ShieldCheckIcon',
    status: 'foundation',
    route: '/insurance-commercial',
    description: 'Claim submission, adjudication, reimbursement routing to providers, and insurer settlement with audit trail.',
    inputs: ['payments', 'taxes'],
    outputs: ['marketplace_settlement', 'revenue_reconciliation'],
    tables: ['insurance_claims', 'claim_adjudications', 'insurer_contracts', 'reimbursements'],
    kpis: ['Claims Processed', 'Avg Settlement Time', 'Rejection Rate', 'Reimbursement Volume'],
    wave: 2,
  },
  {
    id: 'ambassador_payouts',
    order: 8,
    phase: 2,
    label: 'Ambassador Payouts',
    labelFr: 'Versements Ambassadeurs',
    icon: 'UserGroupIcon',
    status: 'planned',
    route: '/ambassador-commercial',
    description: 'Referral commission calculation, tier-based bonuses, payout scheduling, and multi-currency disbursement to ambassadors.',
    inputs: ['commissions', 'payments'],
    outputs: ['revenue_reconciliation'],
    tables: ['ambassador_earnings', 'payout_schedules', 'payout_transactions', 'ambassador_tiers'],
    kpis: ['Total Payouts', 'Avg Payout/Ambassador', 'Active Ambassadors', 'Referral Conversion'],
    wave: 3,
  },
  {
    id: 'marketplace_settlement',
    order: 9,
    phase: 2,
    label: 'Marketplace Settlement',
    labelFr: 'Règlement Marketplace',
    icon: 'BuildingStorefrontIcon',
    status: 'planned',
    route: '/marketplace-commercial',
    description: 'Seller/provider fund settlement after platform fee deduction, tax withholding, and dispute resolution escrow.',
    inputs: ['payments', 'taxes', 'insurance_claims'],
    outputs: ['commissions', 'revenue_reconciliation'],
    tables: ['marketplace_settlements', 'seller_accounts', 'escrow_holds', 'dispute_resolutions'],
    kpis: ['GMV', 'Net Settlement Volume', 'Dispute Rate', 'Avg Settlement Delay'],
    wave: 3,
  },
  {
    id: 'revenue_reconciliation',
    order: 10,
    phase: 2,
    label: 'Revenue Reconciliation',
    labelFr: 'Réconciliation Revenus',
    icon: 'ChartBarIcon',
    status: 'planned',
    route: '/platform-revenue',
    description: 'Cross-domain revenue aggregation, ledger reconciliation, financial reporting, and discrepancy detection across all streams.',
    inputs: ['subscriptions', 'payments', 'taxes', 'commissions', 'api_billing', 'card_delivery', 'insurance_claims', 'ambassador_payouts', 'marketplace_settlement'],
    outputs: [],
    tables: ['revenue_ledger', 'reconciliation_runs', 'financial_reports', 'discrepancy_flags'],
    kpis: ['Total Revenue', 'Reconciliation Accuracy', 'Discrepancy Rate', 'Report Latency'],
    wave: 4,
  },
  {
    id: 'billing_dashboard',
    order: 11,
    phase: 2,
    label: 'Billing Dashboard',
    labelFr: 'Tableau Facturation',
    icon: 'Squares2X2Icon',
    status: 'foundation',
    route: '/billing-dashboard',
    description: 'Unified billing overview for org admins and platform admin: invoices, payment history, upcoming charges, and dispute management.',
    inputs: ['subscriptions', 'payments', 'taxes'],
    outputs: ['revenue_reconciliation'],
    tables: ['invoices', 'invoice_line_items', 'billing_contacts'],
    kpis: ['Outstanding Invoices', 'Overdue Rate', 'Invoice Volume', 'Collection Rate'],
    wave: 3,
  },
  {
    id: 'finance_reporting',
    order: 12,
    phase: 2,
    label: 'Finance Reporting',
    labelFr: 'Reporting Financier',
    icon: 'DocumentChartBarIcon',
    status: 'planned',
    route: '/finance-dashboard',
    description: 'Automated financial statements, cash flow projections, multi-currency P&L, and regulatory reporting exports.',
    inputs: ['revenue_reconciliation', 'taxes'],
    outputs: [],
    tables: ['financial_statements', 'cash_flow_projections', 'regulatory_reports'],
    kpis: ['P&L Accuracy', 'Report Generation Time', 'Regulatory Compliance %'],
    wave: 4,
  },
];

const dataDeps: DataDep[] = [
  { from: 'subscriptions', to: 'payments', label: 'billing trigger', critical: true },
  { from: 'subscriptions', to: 'taxes', label: 'taxable event', critical: true },
  { from: 'payments', to: 'taxes', label: 'tax calculation', critical: true },
  { from: 'payments', to: 'commissions', label: 'fee base', critical: true },
  { from: 'payments', to: 'marketplace_settlement', label: 'escrow release', critical: true },
  { from: 'payments', to: 'ambassador_payouts', label: 'payout source', critical: false },
  { from: 'taxes', to: 'revenue_reconciliation', label: 'tax ledger', critical: true },
  { from: 'commissions', to: 'ambassador_payouts', label: 'commission split', critical: true },
  { from: 'commissions', to: 'revenue_reconciliation', label: 'net revenue', critical: true },
  { from: 'marketplace_settlement', to: 'commissions', label: 'platform fee', critical: true },
  { from: 'insurance_claims', to: 'marketplace_settlement', label: 'claim settlement', critical: false },
  { from: 'api_billing', to: 'revenue_reconciliation', label: 'usage revenue', critical: false },
  { from: 'card_delivery', to: 'revenue_reconciliation', label: 'card fees', critical: false },
  { from: 'ambassador_payouts', to: 'revenue_reconciliation', label: 'payout cost', critical: false },
  { from: 'marketplace_settlement', to: 'revenue_reconciliation', label: 'net GMV', critical: true },
  { from: 'revenue_reconciliation', to: 'finance_reporting', label: 'ledger data', critical: true },
  { from: 'taxes', to: 'finance_reporting', label: 'tax reports', critical: true },
  { from: 'billing_dashboard', to: 'revenue_reconciliation', label: 'invoice data', critical: false },
];

const statusConfig: Record<DomainStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  foundation: { label: 'Fondation', bg: '#dcfce7', text: '#15803d', border: '#86efac', dot: '#22c55e' },
  in_progress: { label: 'En cours', bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd', dot: '#3b82f6' },
  planned: { label: 'Planifié', bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', dot: '#94a3b8' },
  blocked: { label: 'Bloqué', bg: '#fee2e2', text: '#dc2626', border: '#fca5a5', dot: '#ef4444' },
};

const waveConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Vague 1 — Fondations', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
  2: { label: 'Vague 2 — Flux Commerciaux', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  3: { label: 'Vague 3 — Règlements & Tableaux', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  4: { label: 'Vague 4 — Réconciliation & Reporting', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Phase2RoadmapContent() {
  const [view, setView] = useState<'matrix' | 'deps' | 'waves'>('matrix');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [filterStatus, setFilterStatus] = useState<DomainStatus | 'all'>('all');

  const filtered = filterStatus === 'all' ? domains : domains.filter(d => d.status === filterStatus);

  const getDomain = (id: string) => domains.find(d => d.id === id);

  const getDepDomains = (domain: Domain) => ({
    inputs: domain.inputs.map(id => getDomain(id)).filter(Boolean) as Domain[],
    outputs: domain.outputs.map(id => getDomain(id)).filter(Boolean) as Domain[],
  });

  const waves = [1, 2, 3, 4];
  const foundationCount = domains.filter(d => d.status === 'foundation').length;
  const plannedCount = domains.filter(d => d.status === 'planned').length;
  const totalDeps = dataDeps.length;
  const criticalDeps = dataDeps.filter(d => d.critical).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div className="border-b px-6 py-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/platform-admin" className="text-xs font-medium hover:underline" style={{ color: 'var(--muted-foreground)' }}>
                Platform Admin
              </Link>
              <Icon name="ChevronRightIcon" size={12} className="text-muted-foreground" />
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Phase 2 Roadmap</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
              Phase 2 — Roadmap Commerciale
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              12 domaines commerciaux · Ordre d'implémentation · Dépendances de données
            </p>
          </div>
          {/* Stats strip */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Domaines', value: '12', icon: 'PuzzlePieceIcon', color: 'var(--shifa-blue)' },
              { label: 'Fondations', value: String(foundationCount), icon: 'CheckCircleIcon', color: '#22c55e' },
              { label: 'Planifiés', value: String(plannedCount), icon: 'ClockIcon', color: '#94a3b8' },
              { label: 'Dépendances', value: String(totalDeps), icon: 'ArrowsRightLeftIcon', color: '#8b5cf6' },
              { label: 'Critiques', value: String(criticalDeps), icon: 'ExclamationTriangleIcon', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <Icon name={s.icon as any} size={16} style={{ color: s.color }} />
                <div>
                  <p className="text-base font-bold leading-none" style={{ color: 'var(--foreground)' }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View tabs + filter */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
            {([['matrix', 'TableCellsIcon', 'Matrice'], ['waves', 'Squares2X2Icon', 'Vagues'], ['deps', 'ArrowsRightLeftIcon', 'Dépendances']] as const).map(([v, icon, lbl]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: view === v ? 'var(--shifa-blue)' : 'transparent',
                  color: view === v ? '#fff' : 'var(--muted-foreground)',
                }}
              >
                <Icon name={icon as any} size={14} />
                {lbl}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Statut :</span>
            {(['all', 'foundation', 'in_progress', 'planned', 'blocked'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium border transition-all"
                style={{
                  borderColor: filterStatus === s ? 'var(--shifa-blue)' : 'var(--border)',
                  backgroundColor: filterStatus === s ? 'rgba(var(--shifa-blue-rgb, 14,165,233),0.1)' : 'transparent',
                  color: filterStatus === s ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                }}
              >
                {s === 'all' ? 'Tous' : statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* ── MATRIX VIEW ── */}
        {view === 'matrix' && (
          <div className="space-y-3">
            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap mb-4">
              {Object.entries(statusConfig).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.dot }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 ml-4">
                <span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#ef4444' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dépendance critique</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded" style={{ backgroundColor: '#94a3b8' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dépendance normale</span>
              </div>
            </div>

            {/* Domain cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(domain => {
                const sc = statusConfig[domain.status];
                const { inputs, outputs } = getDepDomains(domain);
                const isSelected = selectedDomain?.id === domain.id;
                return (
                  <div
                    key={domain.id}
                    onClick={() => setSelectedDomain(isSelected ? null : domain)}
                    className="rounded-2xl border cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isSelected ? 'var(--shifa-blue)' : 'var(--border)',
                      backgroundColor: 'var(--card)',
                      boxShadow: isSelected ? '0 0 0 2px var(--shifa-blue)' : undefined,
                    }}
                  >
                    {/* Card header */}
                    <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))', opacity: domain.status === 'planned' ? 0.6 : 1 }}>
                            <Icon name={domain.icon as any} size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                                #{domain.order}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                                {sc.label}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold mt-1" style={{ color: 'var(--foreground)' }}>{domain.labelFr}</h3>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{domain.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: waveConfig[domain.wave].bg, color: waveConfig[domain.wave].color }}>
                            V{domain.wave}
                          </span>
                          {domain.route && (
                            <Link
                              href={domain.route}
                              onClick={e => e.stopPropagation()}
                              className="p-1 rounded-lg hover:bg-muted transition-colors"
                              title="Ouvrir le module"
                            >
                              <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-muted-foreground" />
                            </Link>
                          )}
                        </div>
                      </div>
                      <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{domain.description}</p>
                    </div>

                    {/* Dependencies */}
                    <div className="p-4 space-y-3">
                      {inputs.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                            <Icon name="ArrowDownTrayIcon" size={12} />
                            Dépend de ({inputs.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {inputs.map(dep => {
                              const depLink = dataDeps.find(d => d.from === dep.id && d.to === domain.id);
                              return (
                                <span
                                  key={dep.id}
                                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                                  style={{
                                    borderColor: depLink?.critical ? '#fca5a5' : 'var(--border)',
                                    backgroundColor: depLink?.critical ? '#fee2e2' : 'var(--muted)',
                                    color: depLink?.critical ? '#dc2626' : 'var(--muted-foreground)',
                                  }}
                                >
                                  {dep.labelFr}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {outputs.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                            <Icon name="ArrowUpTrayIcon" size={12} />
                            Alimente ({outputs.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {outputs.map(dep => {
                              const depLink = dataDeps.find(d => d.from === domain.id && d.to === dep.id);
                              return (
                                <span
                                  key={dep.id}
                                  className="text-xs px-2 py-0.5 rounded-full border font-medium"
                                  style={{
                                    borderColor: depLink?.critical ? '#fca5a5' : 'var(--border)',
                                    backgroundColor: depLink?.critical ? '#fee2e2' : 'var(--muted)',
                                    color: depLink?.critical ? '#dc2626' : 'var(--muted-foreground)',
                                  }}
                                >
                                  {dep.labelFr}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tables & KPIs */}
                      {isSelected && (
                        <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Tables de données</p>
                            <div className="flex flex-wrap gap-1">
                              {domain.tables.map(t => (
                                <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{t}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>KPIs clés</p>
                            <div className="flex flex-wrap gap-1">
                              {domain.kpis.map(k => (
                                <span key={k} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(14,165,233,0.08)', color: 'var(--shifa-blue)' }}>{k}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WAVES VIEW ── */}
        {view === 'waves' && (
          <div className="space-y-6">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Les domaines sont regroupés en 4 vagues d'implémentation séquentielles. Chaque vague dépend de la précédente.
            </p>
            {waves.map(wave => {
              const waveDomains = domains.filter(d => d.wave === wave);
              const wc = waveConfig[wave];
              return (
                <div key={wave} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  {/* Wave header */}
                  <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: wc.bg, borderBottom: `2px solid ${wc.color}20` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: wc.color }}>
                        {wave}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: wc.color }}>{wc.label}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{waveDomains.length} domaine{waveDomains.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {waveDomains.map(d => (
                        <span key={d.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[d.status].dot }} title={d.labelFr} />
                      ))}
                    </div>
                  </div>

                  {/* Wave domains */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3" style={{ backgroundColor: 'var(--card)' }}>
                    {waveDomains.map(domain => {
                      const sc = statusConfig[domain.status];
                      return (
                        <div
                          key={domain.id}
                          className="rounded-xl border p-3 cursor-pointer hover:shadow-md transition-all"
                          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                          onClick={() => { setSelectedDomain(domain); setView('matrix'); }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `linear-gradient(135deg, ${wc.color}, ${wc.color}99)` }}>
                              <Icon name={domain.icon as any} size={15} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate" style={{ color: 'var(--foreground)' }}>{domain.labelFr}</p>
                              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{domain.description}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>#{domain.order} · {domain.inputs.length} entrées</span>
                            {domain.route && (
                              <Link href={domain.route} onClick={e => e.stopPropagation()} className="text-xs font-medium hover:underline" style={{ color: 'var(--shifa-blue)' }}>
                                Voir →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Wave dependencies summary */}
                  {wave < 4 && (
                    <div className="px-5 py-2 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                      <Icon name="ArrowDownIcon" size={12} className="text-muted-foreground" />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Vague {wave + 1} requiert la complétion de : {waveDomains.map(d => d.labelFr).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── DEPS VIEW ── */}
        {view === 'deps' && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Toutes les dépendances de données entre domaines. Les dépendances critiques bloquent l'implémentation du domaine cible.
            </p>

            {/* Dependency matrix table */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Registre des dépendances ({dataDeps.length})</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Critique ({criticalDeps})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#94a3b8' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Normale ({totalDeps - criticalDeps})</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Source</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Cible</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Flux de données</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Criticité</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Vague source</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Vague cible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataDeps.map((dep, i) => {
                      const fromD = getDomain(dep.from);
                      const toD = getDomain(dep.to);
                      if (!fromD || !toD) return null;
                      return (
                        <tr
                          key={i}
                          className="border-t hover:bg-muted/50 transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Icon name={fromD.icon as any} size={14} className="text-muted-foreground shrink-0" />
                              <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{fromD.labelFr}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <Icon name={toD.icon as any} size={14} className="text-muted-foreground shrink-0" />
                              <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{toD.labelFr}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                              {dep.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: dep.critical ? '#fee2e2' : 'var(--muted)',
                                color: dep.critical ? '#dc2626' : 'var(--muted-foreground)',
                              }}
                            >
                              {dep.critical ? '🔴 Critique' : '⚪ Normale'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: waveConfig[fromD.wave].bg, color: waveConfig[fromD.wave].color }}>
                              V{fromD.wave}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: waveConfig[toD.wave].bg, color: waveConfig[toD.wave].color }}>
                              V{toD.wave}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dependency fan-out per domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map(domain => {
                const inDeps = dataDeps.filter(d => d.to === domain.id);
                const outDeps = dataDeps.filter(d => d.from === domain.id);
                const critIn = inDeps.filter(d => d.critical).length;
                const critOut = outDeps.filter(d => d.critical).length;
                const sc = statusConfig[domain.status];
                return (
                  <div key={domain.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                        <Icon name={domain.icon as any} size={15} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{domain.labelFr}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Ordre #{domain.order} · Vague {domain.wave}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>← Entrées</p>
                        <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{inDeps.length}</p>
                        {critIn > 0 && <p className="text-xs" style={{ color: '#dc2626' }}>{critIn} critique{critIn > 1 ? 's' : ''}</p>}
                      </div>
                      <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>→ Sorties</p>
                        <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{outDeps.length}</p>
                        {critOut > 0 && <p className="text-xs" style={{ color: '#dc2626' }}>{critOut} critique{critOut > 1 ? 's' : ''}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
