'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay';

type PaymentTab = 'invoices' | 'transactions' | 'coverage' | 'subscriptions';

interface Invoice {
  id: string;
  ref: string;
  description: string;
  provider: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'refunded' | 'covered';
}

const mockInvoices: Invoice[] = [
  { id: '1', ref: 'FAC-2026-0812', description: 'Consultation — Dr. Mohamed Sy', provider: 'Cabinet Médical Plateau', date: '08/08/2026', amount: '15 000 FCFA', status: 'paid' },
  { id: '2', ref: 'FAC-2026-0798', description: 'Bilan sanguin complet', provider: 'Laboratoire Central', date: '05/08/2026', amount: '28 500 FCFA', status: 'covered' },
  { id: '3', ref: 'FAC-2026-0755', description: 'Consultation cardiologie', provider: 'CHU Saint-Louis', date: '01/08/2026', amount: '35 000 FCFA', status: 'pending' },
  { id: '4', ref: 'FAC-2026-0701', description: 'Radiographie thorax', provider: 'Centre Imagerie Dakar', date: '20/07/2026', amount: '22 000 FCFA', status: 'paid' },
  { id: '5', ref: 'FAC-2026-0650', description: 'Médicaments — Ordonnance #0812', provider: 'Pharmacie Centrale', date: '15/07/2026', amount: '8 750 FCFA', status: 'refunded' },
];

const statusConfig = {
  paid: { label: 'Payé', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)', icon: 'CheckCircleIcon' },
  pending: { label: 'En attente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'ClockIcon' },
  refunded: { label: 'Remboursé', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'ArrowUturnLeftIcon' },
  covered: { label: 'Pris en charge', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'ShieldCheckIcon' },
};

export default function PatientPaymentsContent() {
  const [activeTab, setActiveTab] = useState<PaymentTab>('invoices');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Paiements & Facturation</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Factures, transactions, couverture assurance et abonnements</p>
      </div>

      {/* Currency reference banner */}
      <div className="card-base p-3 mb-5 flex items-center gap-3" style={{ backgroundColor: 'rgba(0,102,255,0.04)' }}>
        <Icon name="BanknotesIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0" />
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Total dépensé 2026 :</span>
          <CurrencyDisplay amount={109250} currency="XOF" showReference size="sm" />
        </div>
        <span className="ml-auto text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>Taux de référence (Phase 1 — démo)</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
        { label: 'Total dépensé (2026)', value: '109 250 FCFA', icon: 'BanknotesIcon', color: 'var(--shifa-blue)' },
          { label: 'Remboursé assurance', value: '28 500 FCFA', icon: 'ShieldCheckIcon', color: 'var(--shifa-cyan)' },
          { label: 'En attente', value: '35 000 FCFA', icon: 'ClockIcon', color: '#f59e0b' },
          { label: 'Factures ce mois', value: '3', icon: 'DocumentTextIcon', color: '#8b5cf6' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'invoices', label: 'Factures', icon: 'DocumentTextIcon' },
          { key: 'transactions', label: 'Transactions', icon: 'ArrowsRightLeftIcon' },
          { key: 'coverage', label: 'Couverture', icon: 'ShieldCheckIcon' },
          { key: 'subscriptions', label: 'Abonnements', icon: 'StarIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as PaymentTab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        <div className="flex flex-col gap-3">
          {mockInvoices.map(inv => {
            const st = statusConfig[inv.status];
            return (
              <div key={inv.id} className="card-base p-5 flex items-center gap-4 hover:shadow-shifa transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${st.color}18` }}>
                  <Icon name={st.icon as any} size={20} style={{ color: st.color } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{inv.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{inv.provider} · {inv.date} · Réf: {inv.ref}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold" style={{ color: 'var(--foreground)' }}>{inv.amount}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0" title="Télécharger reçu">
                  <Icon name="ArrowDownTrayIcon" size={15} className="text-muted-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card-base p-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Historique des transactions</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Paiement consultation Dr. Sy', date: '08/08/2026', amount: '-15 000 FCFA', type: 'debit', method: 'Orange Money' },
              { label: 'Remboursement Labo Central', date: '07/08/2026', amount: '+28 500 FCFA', type: 'credit', method: 'Virement assurance' },
              { label: 'Paiement radiographie', date: '20/07/2026', amount: '-22 000 FCFA', type: 'debit', method: 'Wave' },
              { label: 'Remboursement pharmacie', date: '18/07/2026', amount: '+8 750 FCFA', type: 'credit', method: 'Virement assurance' },
              { label: 'Abonnement SHIFA Premium', date: '01/07/2026', amount: '-5 000 FCFA', type: 'debit', method: 'Carte bancaire' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-all">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tx.type === 'credit' ? 'rgba(0,242,195,0.1)' : 'rgba(239,68,68,0.1)' }}
                >
                  <Icon
                    name={tx.type === 'credit' ? 'ArrowDownLeftIcon' : 'ArrowUpRightIcon'}
                    size={18}
                    style={{ color: tx.type === 'credit' ? 'var(--shifa-cyan)' : '#ef4444' } as any}
                    className=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{tx.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tx.date} · {tx.method}</p>
                </div>
                <p
                  className="font-bold text-sm shrink-0"
                  style={{ color: tx.type === 'credit' ? 'var(--shifa-cyan)' : '#ef4444' }}
                >
                  {tx.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'coverage' && (
        <div className="flex flex-col gap-4">
          <div className="card-base p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <Icon name="ShieldCheckIcon" size={24} style={{ color: 'var(--shifa-blue)' } as any} className="" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>IPRES — Assurance maladie</h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>N° adhérent : IPR-2025-44821 · Actif depuis 01/01/2025</p>
              </div>
              <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: 'var(--shifa-cyan)', backgroundColor: 'rgba(0,242,195,0.1)' }}>Actif</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Consultations', value: '80%', icon: 'UserIcon' },
                { label: 'Hospitalisation', value: '70%', icon: 'BuildingOfficeIcon' },
                { label: 'Médicaments', value: '60%', icon: 'BeakerIcon' },
                { label: 'Imagerie', value: '75%', icon: 'PhotoIcon' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <Icon name={item.icon as any} size={18} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold" style={{ color: 'var(--shifa-blue)' }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-base p-5">
            <h3 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Demandes de remboursement</h3>
            <div className="flex flex-col gap-2">
              {[
                { ref: 'RBT-2026-0055', desc: 'Bilan sanguin — Labo Central', date: '06/08/2026', amount: '28 500 FCFA', status: 'Approuvé' },
                { ref: 'RBT-2026-0041', desc: 'Médicaments — Pharmacie Centrale', date: '16/07/2026', amount: '8 750 FCFA', status: 'Versé' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.desc}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.ref} · {r.date}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--shifa-cyan)' }}>{r.amount}</p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: 'var(--shifa-cyan)', backgroundColor: 'rgba(0,242,195,0.1)' }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="flex flex-col gap-4">
          {[
            { name: 'SHIFA Premium', price: '5 000 FCFA/mois', features: ['Téléconsultation illimitée', 'Stockage documents 10 Go', 'Assistance prioritaire', 'Carte SHIFA physique incluse'], active: true, color: 'var(--shifa-blue)' },
            { name: 'SHIFA Essentiel', price: 'Gratuit', features: ['Dossier médical de base', 'Prise de RDV', 'Messagerie sécurisée', 'Carte SHIFA numérique'], active: false, color: 'var(--muted-foreground)' },
          ].map((plan, i) => (
            <div
              key={i}
              className="card-base p-6"
              style={{ borderColor: plan.active ? 'var(--shifa-blue)' : 'var(--border)', borderWidth: plan.active ? '2px' : '1px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{plan.name}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: plan.color }}>{plan.price}</p>
                </div>
                {plan.active && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Actif</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Icon name="CheckCircleIcon" size={15} style={{ color: plan.active ? 'var(--shifa-cyan)' : 'var(--muted-foreground)' } as any} className="" />
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
