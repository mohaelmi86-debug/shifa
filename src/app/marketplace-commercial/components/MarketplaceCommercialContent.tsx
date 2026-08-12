'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

const VENDOR_PLANS = [
  { id: 'free', label: 'Vendeur Gratuit', color: '#6b7280', monthly: 0, currency: 'EUR', commission: 'Configurable', listings: 5, featured: 0, analytics: false, badge: false },
  { id: 'standard', label: 'Vendeur Standard', color: '#2563eb', monthly: null, currency: 'EUR', commission: 'Configurable', listings: 50, featured: 3, analytics: true, badge: false },
  { id: 'pro', label: 'Vendeur Pro', color: '#7c3aed', monthly: null, currency: 'EUR', commission: 'Configurable −', listings: 999, featured: 20, analytics: true, badge: true },
  { id: 'supplier', label: 'Fournisseur B2B', color: '#d97706', monthly: null, currency: 'EUR', commission: 'Négocié', listings: 999, featured: 50, analytics: true, badge: true },
];

const TRANSACTIONS = [
  { id: 't1', date: '2026-08-10', product: 'Tensiomètre Omron M3', buyer: 'Dr. Fatou Ndiaye', seller: 'MedEquip Dakar', amount: 45000, currency: 'XOF', commission: '—', status: 'Complété' },
  { id: 't2', date: '2026-08-09', product: 'Kit diabète complet', buyer: 'Clinique Pasteur', seller: 'PharmaSup', amount: 128000, currency: 'XOF', commission: '—', status: 'En cours' },
  { id: 't3', date: '2026-08-07', product: 'Stéthoscope Littmann', buyer: 'Dr. Ibrahima Sow', seller: 'MedStore MA', amount: 1850, currency: 'MAD', commission: '—', status: 'Complété' },
  { id: 't4', date: '2026-08-05', product: 'Glucomètre + bandelettes', buyer: 'Hôpital Régional', seller: 'DiabCare', amount: 89000, currency: 'XOF', commission: '—', status: 'Remboursé' },
];

const ACTOR_SURFACES = [
  {
    id: 'buyer', label: 'Acheteur', icon: 'ShoppingBagIcon', color: '#2563eb',
    items: ['Recherche produits & services', 'Panier & commande', 'Paiement en devise locale', 'Suivi livraison', 'Historique achats', 'Remboursements'],
  },
  {
    id: 'seller', label: 'Vendeur', icon: 'BuildingStorefrontIcon', color: '#7c3aed',
    items: ['Gestion catalogue', 'Listings produits', 'Gestion commandes', 'Revenus vendeur', 'Commission SHIFA déduite', 'Listings sponsorisés'],
  },
  {
    id: 'supplier', label: 'Fournisseur B2B', icon: 'TruckIcon', color: '#d97706',
    items: ['Catalogue grossiste', 'Commandes B2B', 'Contrats cadre', 'Facturation institutionnelle', 'API catalogue', 'Intégration ERP'],
  },
  {
    id: 'platform', label: 'SHIFA Plateforme', icon: 'CpuChipIcon', color: '#16a34a',
    items: ['Commission par transaction', 'Abonnements vendeurs', 'Listings sponsorisés', 'Services B2B premium', 'Frais de traitement', 'Analyse revenus'],
  },
];

const statusColor: Record<string, { bg: string; text: string }> = {
  Complété: { bg: '#dcfce7', text: '#16a34a' },
  'En cours': { bg: '#dbeafe', text: '#2563eb' },
  Remboursé: { bg: '#fee2e2', text: '#dc2626' },
};

export default function MarketplaceCommercialContent() {
  const [tab, setTab] = useState<'structure' | 'vendors' | 'transactions'>('structure');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Marketplace — Surface Commerciale</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Structure de commissions, plans vendeurs, listings sponsorisés et frais de transaction</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: '#dcfce7', color: '#16a34a' }}>
          <Icon name="InformationCircleIcon" size={14} />
          Commissions configurables — Phase 3
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transactions (démo)', value: '4', icon: 'ArrowsRightLeftIcon', color: '#2563eb' },
          { label: 'Vendeurs actifs', value: '—', icon: 'BuildingStorefrontIcon', color: '#7c3aed' },
          { label: 'Commission SHIFA', value: 'Config.', icon: 'BanknotesIcon', color: '#16a34a' },
          { label: 'Listings sponsorisés', value: '—', icon: 'SparklesIcon', color: '#d97706' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {(['structure', 'vendors', 'transactions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: tab === t ? 'var(--shifa-blue)' : 'transparent', color: tab === t ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            {{ structure: 'Surfaces par acteur', vendors: 'Plans vendeurs', transactions: 'Transactions' }[t]}
          </button>
        ))}
      </div>

      {tab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTOR_SURFACES.map(s => (
            <div key={s.id} className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '18' }}>
                  <Icon name={s.icon as any} size={20} style={{ color: s.color }} />
                </div>
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{s.label}</p>
              </div>
              <ul className="space-y-1.5">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VENDOR_PLANS.map(plan => (
            <div key={plan.id} className="rounded-xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: plan.color + '44' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: plan.color + '18' }}>
                  <Icon name="BuildingStorefrontIcon" size={16} style={{ color: plan.color }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: plan.color }}>{plan.label}</p>
              </div>
              <div>
                {plan.monthly === 0 ? (
                  <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Gratuit</p>
                ) : (
                  <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Tarif configurable</p>
                )}
              </div>
              <ul className="space-y-1 flex-1">
                <li className="text-xs" style={{ color: 'var(--foreground)' }}>Commission : <span className="font-medium">{plan.commission}</span></li>
                <li className="text-xs" style={{ color: 'var(--foreground)' }}>Listings : <span className="font-medium">{plan.listings === 999 ? 'Illimité' : plan.listings}</span></li>
                <li className="text-xs" style={{ color: 'var(--foreground)' }}>Sponsorisés : <span className="font-medium">{plan.featured === 0 ? '—' : plan.featured + '/mois'}</span></li>
                <li className="flex items-center gap-1 text-xs" style={{ color: 'var(--foreground)' }}>
                  Analytiques : <Icon name={plan.analytics ? 'CheckIcon' : 'XMarkIcon'} size={12} style={{ color: plan.analytics ? '#16a34a' : '#dc2626' }} />
                </li>
                <li className="flex items-center gap-1 text-xs" style={{ color: 'var(--foreground)' }}>
                  Badge vérifié : <Icon name={plan.badge ? 'CheckIcon' : 'XMarkIcon'} size={12} style={{ color: plan.badge ? '#16a34a' : '#dc2626' }} />
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'transactions' && (
        <div className="space-y-3">
          <div className="rounded-xl border p-3 flex items-center gap-3" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <Icon name="InformationCircleIcon" size={16} style={{ color: '#d97706' }} />
            <p className="text-xs" style={{ color: '#92400e' }}>Les commissions sont configurables par type de produit, pays et plan vendeur. Le règlement réel est implémenté en Phase 3.</p>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--muted)' }}>
                <tr>
                  {['Date', 'Produit', 'Acheteur', 'Vendeur', 'Montant', 'Commission', 'Statut'].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t, i) => {
                  const sc = statusColor[t.status] || { bg: '#f1f5f9', text: '#64748b' };
                  return (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.date}</td>
                      <td className="px-3 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{t.product}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{t.buyer}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{t.seller}</td>
                      <td className="px-3 py-3"><SmartAmount amount={t.amount} currency={t.currency} size="xs" inline /></td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.commission}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>{t.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
