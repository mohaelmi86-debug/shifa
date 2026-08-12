'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

interface PricingEntry {
  id: string;
  product: string;
  plan: string;
  country: string;
  flag: string;
  currency: string;
  amount: number;
  period: string;
  taxRule: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'archived';
}

const PRICING_TABLE: PricingEntry[] = [
  { id: 'PE-001', product: 'Plan Pro Professionnel', plan: 'Pro', country: 'Sénégal', flag: '🇸🇳', currency: 'XOF', amount: 25000, period: 'Mensuel', taxRule: 'TVA SN (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-002', product: 'Plan Pro Professionnel', plan: 'Pro', country: 'Maroc', flag: '🇲🇦', currency: 'MAD', amount: 199, period: 'Mensuel', taxRule: 'TVA MA (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-003', product: 'Plan Pro Professionnel', plan: 'Pro', country: 'France', flag: '🇫🇷', currency: 'EUR', amount: 49, period: 'Mensuel', taxRule: 'TVA FR (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-004', product: 'Organisation Base', plan: 'Base', country: 'Comores', flag: '🇰🇲', currency: 'KMF', amount: 150000, period: 'Mensuel', taxRule: 'Taxe KM (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-005', product: 'Carte SHIFA Physique', plan: 'Standard', country: 'Sénégal', flag: '🇸🇳', currency: 'XOF', amount: 8500, period: 'Unique', taxRule: 'TVA SN (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-006', product: 'AI Pro', plan: 'Pro', country: 'Maroc', flag: '🇲🇦', currency: 'MAD', amount: 99, period: 'Mensuel', taxRule: 'TVA MA (config.)', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-007', product: 'API Usage-based', plan: 'Usage', country: 'International', flag: '🌍', currency: 'EUR', amount: 0, period: 'À l\'usage', taxRule: 'Selon pays', effectiveDate: '2025-01-01', status: 'draft' },
  { id: 'PE-008', product: 'Enterprise / B2G', plan: 'Enterprise', country: 'International', flag: '🌍', currency: 'EUR', amount: 0, period: 'Contrat', taxRule: 'Selon contrat', effectiveDate: '2025-01-01', status: 'draft' },
];

const EXCHANGE_RATES = [
  { base: 'EUR', target: 'KMF', rate: 491.97, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'EUR', target: 'XOF', rate: 655.96, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'EUR', target: 'MAD', rate: 10.89, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'EUR', target: 'TND', rate: 3.35, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'EUR', target: 'DZD', rate: 145.2, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'EUR', target: 'XAF', rate: 655.96, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'USD', target: 'EUR', rate: 0.92, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
  { base: 'USD', target: 'KMF', rate: 452.6, provider: 'Démo Phase 1', timestamp: '2025-01-11', validity: '24h', status: 'demo' },
];

const PAYMENT_METHODS = [
  { country: '🇰🇲 Comores', methods: ['Virement bancaire', 'Mobile Money (Huri)', 'Carte bancaire'], currency: 'KMF' },
  { country: '🇸🇳 Sénégal', methods: ['Orange Money', 'Wave', 'Carte bancaire', 'Virement'], currency: 'XOF' },
  { country: '🇲🇦 Maroc', methods: ['Carte bancaire', 'CMI', 'Virement', 'CIH Pay'], currency: 'MAD' },
  { country: '🇫🇷 France', methods: ['Carte bancaire', 'Virement SEPA', 'PayPal', 'Apple Pay', 'Google Pay'], currency: 'EUR' },
  { country: "🇨🇮 Côte d\'Ivoire", methods: ['Orange Money', 'MTN Money', 'Carte bancaire'], currency: 'XOF' },
  { country: '🇹🇳 Tunisie', methods: ['Carte bancaire', 'Virement', 'Flouci'], currency: 'TND' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#dcfce7', text: '#16a34a', label: 'Actif' },
  draft: { bg: '#fef9c3', text: '#ca8a04', label: 'Brouillon' },
  archived: { bg: '#f1f5f9', text: '#64748b', label: 'Archivé' },
  demo: { bg: '#dbeafe', text: '#1d4ed8', label: 'Démo' },
};

export default function PricingEngineContent() {
  const [tab, setTab] = useState<'table' | 'rates' | 'payments' | 'architecture'>('table');
  const [filterProduct, setFilterProduct] = useState('Tous');

  const products = ['Tous', ...Array.from(new Set(PRICING_TABLE.map(p => p.product)))];
  const filtered = PRICING_TABLE.filter(p => filterProduct === 'Tous' || p.product === filterProduct);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Moteur de Tarification Global</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Table centralisée : produit → plan → pays → devise → période → taxe → statut · Service taux de change · Méthodes de paiement par pays
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#fef9c3', color: '#ca8a04' }}>
            <Icon name="ExclamationTriangleIcon" size={12} />
            Prix = Brouillons Phase 1
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            <Icon name="ArrowPathIcon" size={12} />
            Taux = Démo
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Entrées tarifaires', value: PRICING_TABLE.length.toString(), icon: 'TableCellsIcon', color: '#2563eb' },
          { label: 'Paires de change', value: EXCHANGE_RATES.length.toString(), icon: 'ArrowsRightLeftIcon', color: '#7c3aed' },
          { label: 'Pays avec méthodes', value: PAYMENT_METHODS.length.toString(), icon: 'GlobeAltIcon', color: '#16a34a' },
          { label: 'Devises supportées', value: '14+', icon: 'BanknotesIcon', color: '#d97706' },
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
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {([['table', 'Table tarifaire'], ['rates', 'Taux de change'], ['payments', 'Méthodes paiement'], ['architecture', 'Architecture']] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? 'var(--card)' : 'transparent',
              color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Pricing Table */}
      {tab === 'table' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Produit :</span>
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {products.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['ID', 'Produit / Service', 'Plan', 'Pays', 'Montant', 'Période', 'Règle fiscale', 'Date effet', 'Statut'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, i) => (
                    <tr key={entry.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-3 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.id}</td>
                      <td className="px-3 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{entry.product}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{entry.plan}</span>
                      </td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{entry.flag} {entry.country}</td>
                      <td className="px-3 py-3">
                        {entry.amount > 0
                          ? <SmartAmount amount={entry.amount} currency={entry.currency} size="xs" inline />
                          : <span className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>Sur devis</span>
                        }
                      </td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.period}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.taxRule}</td>
                      <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.effectiveDate}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[entry.status]?.bg, color: STATUS_CONFIG[entry.status]?.text }}>
                          {STATUS_CONFIG[entry.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs italic px-1" style={{ color: 'var(--muted-foreground)' }}>
            * Tous les prix sont des brouillons Phase 1. Les prix définitifs seront configurés avant le lancement commercial.
          </p>
        </div>
      )}

      {/* Tab: Exchange Rates */}
      {tab === 'rates' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ background: '#fef9c3', borderColor: '#fde68a' }}>
            <div className="flex items-center gap-2">
              <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#ca8a04' }} />
              <p className="text-sm font-medium" style={{ color: '#92400e' }}>
                Taux de démonstration — Phase 1. Un service de taux de change en temps réel sera intégré en Phase 3.
              </p>
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Service de taux de change — Architecture Phase 1</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Devise base', 'Devise cible', 'Taux', 'Fournisseur', 'Horodatage', 'Validité', 'Statut'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EXCHANGE_RATES.map((rate, i) => (
                    <tr key={`${rate.base}-${rate.target}`} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: '#2563eb' }}>{rate.base}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold" style={{ color: '#7c3aed' }}>{rate.target}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm" style={{ color: 'var(--foreground)' }}>{rate.rate}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rate.provider}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rate.timestamp}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{rate.validity}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[rate.status]?.bg, color: STATUS_CONFIG[rate.status]?.text }}>
                          {STATUS_CONFIG[rate.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Architecture note */}
          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Architecture service taux de change — Phase 3</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { step: '1', label: 'Fournisseur externe', desc: 'Open Exchange Rates / ECB / Fixer.io — taux en temps réel', color: '#2563eb' },
                { step: '2', label: 'Cache centralisé', desc: 'Stockage en base avec TTL configurable (ex: 1h) — évite les appels excessifs', color: '#7c3aed' },
                { step: '3', label: 'Affichage UI', desc: 'SmartAmount utilise les taux du cache — jamais hardcodés dans les composants', color: '#16a34a' },
              ].map(item => (
                <div key={item.step} className="rounded-lg p-3" style={{ background: 'var(--muted)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: item.color }}>{item.step}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Payment Methods */}
      {tab === 'payments' && (
        <div className="grid md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map(pm => (
            <div key={pm.country} className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{pm.country}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{pm.currency}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pm.methods.map(m => (
                  <span key={m} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                    <Icon name="CreditCardIcon" size={10} style={{ color: 'var(--muted-foreground)' }} />
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs italic col-span-2 px-1" style={{ color: 'var(--muted-foreground)' }}>
            * Les méthodes de paiement disponibles dépendent du pays, de la devise et du prestataire. Les intégrations réelles seront connectées en Phase 3.
          </p>
        </div>
      )}

      {/* Tab: Architecture */}
      {tab === 'architecture' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Flux de tarification — Architecture globale</h3>
            <div className="space-y-3">
              {[
                { step: 'PAYS', desc: 'Détection du pays du client (IP, profil, sélection manuelle)', color: '#2563eb' },
                { step: 'DEVISE LOCALE', desc: 'Résolution de la devise locale associée au pays', color: '#7c3aed' },
                { step: 'PRIX LOCAL', desc: 'Lecture du prix configuré pour ce produit × plan × pays × devise', color: '#16a34a' },
                { step: 'RÉFÉRENCE EUR', desc: 'Conversion via taux de change centralisé — valeur de référence uniquement', color: '#d97706' },
                { step: 'RÉFÉRENCE USD', desc: 'Conversion via taux de change centralisé — valeur de référence uniquement', color: '#e11d48' },
                { step: 'MÉTHODES PAIEMENT', desc: 'Affichage des méthodes disponibles pour ce pays × devise', color: '#0891b2' },
                { step: 'RÈGLE FISCALE', desc: 'Application de la règle fiscale configurée pour ce pays × type client × service', color: '#6b7280' },
                { step: 'PLAN COMMERCIAL', desc: 'Activation du plan et des modules associés après paiement confirmé', color: '#16a34a' },
              ].map((item, i) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-40 shrink-0">
                    <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: item.color }}>{i + 1}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.step}</span>
                  </div>
                  <Icon name="ArrowRightIcon" size={12} style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Règles fondamentales du moteur</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { rule: 'Devise locale = devise de transaction', ok: true },
                { rule: 'EUR/USD = valeurs de référence uniquement', ok: true },
                { rule: 'Aucun prix hardcodé dans les composants UI', ok: true },
                { rule: 'Taux de change centralisés et configurables', ok: true },
                { rule: 'Règles fiscales par pays × client × service', ok: true },
                { rule: 'Méthodes de paiement par pays × devise', ok: true },
                { rule: 'France ≠ prix global par défaut', ok: true },
                { rule: 'Prix définitifs = Phase 3', ok: true },
              ].map(item => (
                <div key={item.rule} className="flex items-center gap-2 text-xs">
                  <Icon name={item.ok ? 'CheckCircleIcon' : 'XCircleIcon'} size={14} style={{ color: item.ok ? '#16a34a' : '#dc2626' }} />
                  <span style={{ color: 'var(--foreground)' }}>{item.rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
