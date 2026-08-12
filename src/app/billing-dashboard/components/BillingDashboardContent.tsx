'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';

// ─── Types ───────────────────────────────────────────────────────────────────
type BillingTab = 'invoices' | 'payments' | 'refunds' | 'claims' | 'subscriptions' | 'entities';
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
type ClaimStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'paid';
type EntityType = 'patient' | 'professional' | 'organization' | 'platform';

interface Invoice {
  id: string;
  entity: string;
  entityType: EntityType;
  description: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: number;
}

interface Payment {
  id: string;
  entity: string;
  entityType: EntityType;
  amount: number;
  method: string;
  date: string;
  reference: string;
  invoiceId: string;
}

interface Refund {
  id: string;
  entity: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed';
  date: string;
}

interface InsuranceClaim {
  id: string;
  patient: string;
  insurer: string;
  amount: number;
  covered: number;
  status: ClaimStatus;
  submittedDate: string;
  service: string;
}

interface Subscription {
  id: string;
  entity: string;
  entityType: EntityType;
  plan: string;
  amount: number;
  cycle: 'monthly' | 'annual';
  nextBilling: string;
  status: 'active' | 'paused' | 'cancelled';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const invoices: Invoice[] = [
  { id: 'INV-2025-0841', entity: 'Oumar Diallo', entityType: 'patient', description: 'Consultation + Bilan biologique', amount: 45000, status: 'paid', date: '2025-08-08', dueDate: '2025-08-22', items: 3 },
  { id: 'INV-2025-0842', entity: 'CHU Saint-Louis', entityType: 'organization', description: 'Abonnement modules hospitaliers', amount: 850000, status: 'sent', date: '2025-08-09', dueDate: '2025-08-23', items: 5 },
  { id: 'INV-2025-0843', entity: 'Dr. Mohamed Sy', entityType: 'professional', description: 'Commission téléconsultations — Juillet', amount: 125000, status: 'overdue', date: '2025-07-31', dueDate: '2025-08-07', items: 1 },
  { id: 'INV-2025-0844', entity: 'SHIFA Platform', entityType: 'platform', description: 'Infrastructure & Maintenance Q3', amount: 2500000, status: 'draft', date: '2025-08-10', dueDate: '2025-09-10', items: 8 },
  { id: 'INV-2025-0845', entity: 'Fatou Seck', entityType: 'patient', description: 'Hospitalisation 3 jours — Médecine', amount: 180000, status: 'sent', date: '2025-08-10', dueDate: '2025-08-24', items: 6 },
  { id: 'INV-2025-0846', entity: 'Clinique Pasteur', entityType: 'organization', description: 'Intégration API SHIFA', amount: 350000, status: 'paid', date: '2025-08-05', dueDate: '2025-08-19', items: 2 },
];

const payments: Payment[] = [
  { id: 'PAY-2025-0301', entity: 'Oumar Diallo', entityType: 'patient', amount: 45000, method: 'Wave', date: '2025-08-09', reference: 'WV-8847291', invoiceId: 'INV-2025-0841' },
  { id: 'PAY-2025-0302', entity: 'Clinique Pasteur', entityType: 'organization', amount: 350000, method: 'Virement bancaire', date: '2025-08-06', reference: 'VB-2025-0088', invoiceId: 'INV-2025-0846' },
  { id: 'PAY-2025-0303', entity: 'Mariama Ba', entityType: 'patient', amount: 22000, method: 'Orange Money', date: '2025-08-08', reference: 'OM-5512847', invoiceId: 'INV-2025-0839' },
  { id: 'PAY-2025-0304', entity: 'Dr. Aminata Faye', entityType: 'professional', amount: 98000, method: 'Virement bancaire', date: '2025-08-07', reference: 'VB-2025-0091', invoiceId: 'INV-2025-0837' },
  { id: 'PAY-2025-0305', entity: 'Ministère Santé', entityType: 'organization', amount: 5000000, method: 'Virement bancaire', date: '2025-08-01', reference: 'VB-2025-0075', invoiceId: 'INV-2025-0820' },
];

const refunds: Refund[] = [
  { id: 'REF-2025-041', entity: 'Cheikh Fall', originalAmount: 35000, refundAmount: 35000, reason: 'Consultation annulée par le médecin', status: 'processed', date: '2025-08-08' },
  { id: 'REF-2025-042', entity: 'Aïssatou Diop', originalAmount: 15000, refundAmount: 7500, reason: 'Remboursement partiel — prestation incomplète', status: 'approved', date: '2025-08-09' },
  { id: 'REF-2025-043', entity: 'Ibrahima Ndiaye', originalAmount: 60000, refundAmount: 60000, reason: 'Double facturation', status: 'pending', date: '2025-08-10' },
];

const claims: InsuranceClaim[] = [
  { id: 'CLM-2025-1201', patient: 'Oumar Diallo', insurer: 'IPRES', amount: 45000, covered: 36000, status: 'paid', submittedDate: '2025-08-09', service: 'Consultation + Bilan' },
  { id: 'CLM-2025-1202', patient: 'Fatou Seck', insurer: 'CSS', amount: 180000, covered: 162000, status: 'in_review', submittedDate: '2025-08-10', service: 'Hospitalisation' },
  { id: 'CLM-2025-1203', patient: 'Mariama Ba', insurer: 'Mutuelle CNTS', amount: 22000, covered: 13200, status: 'approved', submittedDate: '2025-08-08', service: 'Chirurgie ambulatoire' },
  { id: 'CLM-2025-1204', patient: 'Moussa Traoré', insurer: 'IPRES', amount: 320000, covered: 0, status: 'rejected', submittedDate: '2025-08-05', service: 'Réanimation' },
  { id: 'CLM-2025-1205', patient: 'Aminata Coulibaly', insurer: 'CSS', amount: 95000, covered: 85500, status: 'submitted', submittedDate: '2025-08-10', service: 'Maternité' },
];

const subscriptions: Subscription[] = [
  { id: 'SUB-001', entity: 'CHU Saint-Louis', entityType: 'organization', plan: 'Hôpital Premium', amount: 850000, cycle: 'monthly', nextBilling: '2025-09-01', status: 'active' },
  { id: 'SUB-002', entity: 'Dr. Mohamed Sy', entityType: 'professional', plan: 'Pro Médecin', amount: 25000, cycle: 'monthly', nextBilling: '2025-09-01', status: 'active' },
  { id: 'SUB-003', entity: 'Clinique Pasteur', entityType: 'organization', plan: 'Clinique Standard', amount: 350000, cycle: 'monthly', nextBilling: '2025-09-05', status: 'active' },
  { id: 'SUB-004', entity: 'Ministère Santé', entityType: 'organization', plan: 'Gouvernement', amount: 5000000, cycle: 'annual', nextBilling: '2026-01-01', status: 'active' },
  { id: 'SUB-005', entity: 'Dr. Aminata Faye', entityType: 'professional', plan: 'Pro Médecin', amount: 25000, cycle: 'monthly', nextBilling: '2025-09-10', status: 'paused' },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const invoiceStatusConfig: Record<InvoiceStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Brouillon', bg: '#f1f5f9', text: '#64748b' },
  sent: { label: 'Envoyée', bg: '#dbeafe', text: '#1d4ed8' },
  paid: { label: 'Payée', bg: '#dcfce7', text: '#16a34a' },
  overdue: { label: 'En retard', bg: '#fee2e2', text: '#dc2626' },
  cancelled: { label: 'Annulée', bg: '#f1f5f9', text: '#94a3b8' },
};

const claimStatusConfig: Record<ClaimStatus, { label: string; bg: string; text: string }> = {
  submitted: { label: 'Soumise', bg: '#dbeafe', text: '#1d4ed8' },
  in_review: { label: 'En révision', bg: '#fef9c3', text: '#ca8a04' },
  approved: { label: 'Approuvée', bg: '#dcfce7', text: '#16a34a' },
  rejected: { label: 'Rejetée', bg: '#fee2e2', text: '#dc2626' },
  paid: { label: 'Remboursée', bg: '#ede9fe', text: '#7c3aed' },
};

const entityTypeConfig: Record<EntityType, { label: string; color: string; icon: string }> = {
  patient: { label: 'Patient', color: 'var(--shifa-blue)', icon: 'UserIcon' },
  professional: { label: 'Professionnel', color: 'var(--shifa-purple)', icon: 'BriefcaseIcon' },
  organization: { label: 'Organisation', color: 'var(--shifa-cyan)', icon: 'BuildingOffice2Icon' },
  platform: { label: 'Plateforme SHIFA', color: 'var(--shifa-amber)', icon: 'GlobeAltIcon' },
};

function formatCFA(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

// ─── KPI Strip ────────────────────────────────────────────────────────────────
function BillingKPIs() {
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const pendingClaims = claims.filter(c => c.status === 'submitted' || c.status === 'in_review').length;
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {[
        { label: 'Revenus du mois', value: formatCFA(totalRevenue), icon: 'BanknotesIcon', color: 'var(--shifa-green)' },
        { label: 'Impayés en cours', value: formatCFA(outstanding), icon: 'ExclamationCircleIcon', color: 'var(--shifa-red)' },
        { label: 'Réclamations actives', value: pendingClaims, icon: 'ShieldCheckIcon', color: 'var(--shifa-amber)' },
        { label: 'Abonnements actifs', value: activeSubs, icon: 'ArrowPathIcon', color: 'var(--shifa-purple)' },
      ].map(k => (
        <div key={k.label} className="card-base flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}18` }}>
            <Icon name={k.icon as any} size={20} style={{ color: k.color } as React.CSSProperties} className="" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Invoices ────────────────────────────────────────────────────────────
function InvoicesTab() {
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'text-white' : 'hover:bg-muted'}`} style={filter === s ? { backgroundColor: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
              {s === 'all' ? 'Toutes' : invoiceStatusConfig[s].label}
            </button>
          ))}
        </div>
        <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Icon name="PlusIcon" size={13} />
          Nouvelle facture
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              {['N° Facture', 'Entité', 'Type', 'Description', 'Montant', 'Statut', 'Échéance'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => {
              const s = invoiceStatusConfig[inv.status];
              const et = entityTypeConfig[inv.entityType];
              return (
                <tr key={inv.id} className="border-b hover:bg-muted/30 cursor-pointer transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: 'var(--shifa-blue)' }}>{inv.id}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{inv.entity}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${et.color}15`, color: et.color }}>
                      <Icon name={et.icon as any} size={11} />
                      {et.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{inv.description}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{formatCFA(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: inv.status === 'overdue' ? 'var(--shifa-red)' : 'var(--muted-foreground)' }}>{inv.dueDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Payments ────────────────────────────────────────────────────────────
function PaymentsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{payments.length} paiements reçus ce mois</p>
        <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Icon name="ArrowDownTrayIcon" size={13} />
          Exporter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              {['Référence', 'Entité', 'Type', 'Montant', 'Méthode', 'Date', 'Facture liée'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => {
              const et = entityTypeConfig[p.entityType];
              return (
                <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color: 'var(--shifa-green)' }}>{p.reference}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{p.entity}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${et.color}15`, color: et.color }}>
                      <Icon name={et.icon as any} size={11} />
                      {et.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--shifa-green)' }}>{formatCFA(p.amount)}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{p.method}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{p.date}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{p.invoiceId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Refunds ─────────────────────────────────────────────────────────────
function RefundsTab() {
  const refundStatusConfig = {
    pending: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
    approved: { label: 'Approuvé', bg: '#dcfce7', text: '#16a34a' },
    processed: { label: 'Traité', bg: '#ede9fe', text: '#7c3aed' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{refunds.length} remboursements en cours</p>
        <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Icon name="PlusIcon" size={13} />
          Nouveau remboursement
        </button>
      </div>
      <div className="space-y-3">
        {refunds.map(r => {
          const s = refundStatusConfig[r.status];
          return (
            <div key={r.id} className="card-base p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.entity}</p>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.id}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.reason}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{r.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>{formatCFA(r.originalAmount)}</p>
                <p className="text-base font-bold" style={{ color: 'var(--shifa-red)' }}>−{formatCFA(r.refundAmount)}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
              {r.status === 'pending' && (
                <div className="flex gap-1 shrink-0">
                  <button className="btn-primary text-xs px-2 py-1">Approuver</button>
                  <button className="btn-secondary text-xs px-2 py-1">Rejeter</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Insurance Claims ────────────────────────────────────────────────────
function ClaimsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{claims.length} réclamations — {claims.filter(c => c.status === 'paid').length} remboursées</p>
        <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Icon name="PlusIcon" size={13} />
          Soumettre réclamation
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              {['N° Réclamation', 'Patient', 'Assureur', 'Service', 'Montant', 'Couverture', 'Statut', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {claims.map(c => {
              const s = claimStatusConfig[c.status];
              const pct = Math.round((c.covered / c.amount) * 100);
              return (
                <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{c.id}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{c.patient}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{c.insurer}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.service}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{formatCFA(c.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)', minWidth: '60px' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 0 ? 'var(--shifa-green)' : 'var(--border)' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{pct}%</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{formatCFA(c.covered)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.submittedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Subscriptions ───────────────────────────────────────────────────────
function SubscriptionsTab() {
  const subStatusConfig = {
    active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
    paused: { label: 'Suspendu', bg: '#fef9c3', text: '#ca8a04' },
    cancelled: { label: 'Annulé', bg: '#fee2e2', text: '#dc2626' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{subscriptions.filter(s => s.status === 'active').length} abonnements actifs</p>
        <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Icon name="PlusIcon" size={13} />
          Nouvel abonnement
        </button>
      </div>
      <div className="grid gap-3">
        {subscriptions.map(sub => {
          const s = subStatusConfig[sub.status];
          const et = entityTypeConfig[sub.entityType];
          return (
            <div key={sub.id} className="card-base p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${et.color}15` }}>
                  <Icon name={et.icon as any} size={18} style={{ color: et.color } as React.CSSProperties} className="" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{sub.entity}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub.plan} · {et.label}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{formatCFA(sub.amount)}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub.cycle === 'monthly' ? 'par mois' : 'par an'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochain prélèvement</p>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{sub.nextBilling}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Modifier">
                  <Icon name="PencilIcon" size={14} className="text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Suspendre">
                  <Icon name="PauseIcon" size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Multi-entity ────────────────────────────────────────────────────────
function EntitiesTab() {
  const entitySummary = (Object.keys(entityTypeConfig) as EntityType[]).map(et => {
    const config = entityTypeConfig[et];
    const entityInvoices = invoices.filter(i => i.entityType === et);
    const entityPayments = payments.filter(p => p.entityType === et);
    const totalBilled = entityInvoices.reduce((s, i) => s + i.amount, 0);
    const totalPaid = entityPayments.reduce((s, p) => s + p.amount, 0);
    const entitySubs = subscriptions.filter(s => s.entityType === et && s.status === 'active').length;
    return { ...config, type: et, totalBilled, totalPaid, invoiceCount: entityInvoices.length, subs: entitySubs };
  });

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vue consolidée par type d'entité facturée sur la plateforme SHIFA</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {entitySummary.map(e => (
          <div key={e.type} className="card-base p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${e.color}18` }}>
                <Icon name={e.icon as any} size={22} style={{ color: e.color } as React.CSSProperties} className="" />
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{e.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.invoiceCount} factures · {e.subs} abonnements actifs</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Total facturé</p>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{formatCFA(e.totalBilled)}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Total encaissé</p>
                <p className="text-sm font-bold" style={{ color: 'var(--shifa-green)' }}>{formatCFA(e.totalPaid)}</p>
              </div>
            </div>
            {e.totalBilled > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Taux de recouvrement</span>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{Math.round((e.totalPaid / e.totalBilled) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((e.totalPaid / e.totalBilled) * 100))}%`, backgroundColor: e.color }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BillingDashboardContent() {
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');

  const tabs: { key: BillingTab; label: string; icon: string }[] = [
    { key: 'invoices', label: 'Factures', icon: 'DocumentTextIcon' },
    { key: 'payments', label: 'Paiements', icon: 'BanknotesIcon' },
    { key: 'refunds', label: 'Remboursements', icon: 'ArrowUturnLeftIcon' },
    { key: 'claims', label: 'Réclamations assurance', icon: 'ShieldCheckIcon' },
    { key: 'subscriptions', label: 'Abonnements', icon: 'ArrowPathIcon' },
    { key: 'entities', label: 'Multi-entités', icon: 'BuildingOffice2Icon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Tableau de bord facturation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Facturation unifiée — patients, professionnels, organisations, plateforme SHIFA</p>
          <div className="mt-2">
            <CurrencyDisplay amount={4095000} currency="XOF" showReference size="sm" />
          </div>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
          <Icon name="DocumentPlusIcon" size={16} />
          Nouvelle facture
        </button>
      </div>

      <BillingKPIs />

      {/* Tabs */}
      <div className="card-base overflow-hidden">
        <div className="flex gap-1 p-3 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === t.key ? 'text-white' : 'hover:bg-muted'}`}
              style={activeTab === t.key ? { backgroundColor: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}
            >
              <Icon name={t.icon as any} size={13} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {activeTab === 'invoices' && <InvoicesTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'refunds' && <RefundsTab />}
          {activeTab === 'claims' && <ClaimsTab />}
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
          {activeTab === 'entities' && <EntitiesTab />}
        </div>
      </div>
    </div>
  );
}
