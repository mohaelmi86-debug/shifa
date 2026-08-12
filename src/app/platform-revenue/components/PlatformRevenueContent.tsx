'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

const REVENUE_STREAMS = [
  { id: 'cards', label: 'Cartes SHIFA', icon: 'CreditCardIcon', color: '#2563eb', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'marketplace', label: 'Marketplace', icon: 'ShoppingBagIcon', color: '#7c3aed', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'ai', label: 'SHIFA AI', icon: 'CpuChipIcon', color: '#0891b2', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'academy', label: 'Academy', icon: 'AcademicCapIcon', color: '#16a34a', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'api', label: 'API / Interop', icon: 'ArrowsRightLeftIcon', color: '#d97706', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'pro', label: 'Abonnements Pro', icon: 'UserGroupIcon', color: '#dc2626', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'org', label: 'Abonnements Org', icon: 'BuildingOffice2Icon', color: '#7c3aed', mrr: 0, arr: 0, txCount: 0, note: 'Configurable' },
  { id: 'enterprise', label: 'Contrats Enterprise', icon: 'BuildingLibraryIcon', color: '#0f766e', mrr: 0, arr: 0, txCount: 0, note: 'Sur devis' },
];

const COUNTRY_DATA = [
  { country: 'Sénégal', flag: '🇸🇳', currency: 'XOF', users: 1240, revenue: 0, growth: '+—' },
  { country: 'Maroc', flag: '🇲🇦', currency: 'MAD', users: 890, revenue: 0, growth: '+—' },
  { country: 'Côte d\'Ivoire', flag: '🇨🇮', currency: 'XOF', users: 654, revenue: 0, growth: '+—' },
  { country: 'Comores', flag: '🇰🇲', currency: 'KMF', users: 312, revenue: 0, growth: '+—' },
  { country: 'France', flag: '🇫🇷', currency: 'EUR', users: 287, revenue: 0, growth: '+—' },
  { country: 'Tunisie', flag: '🇹🇳', currency: 'TND', users: 198, revenue: 0, growth: '+—' },
];

const CURRENCY_BREAKDOWN = [
  { currency: 'XOF', name: 'Franc CFA Ouest', symbol: 'CFA', share: '—', transactions: '—' },
  { currency: 'MAD', name: 'Dirham Marocain', symbol: 'DH', share: '—', transactions: '—' },
  { currency: 'KMF', name: 'Franc Comorien', symbol: 'CF', share: '—', transactions: '—' },
  { currency: 'EUR', name: 'Euro', symbol: '€', share: '—', transactions: '—' },
  { currency: 'TND', name: 'Dinar Tunisien', symbol: 'DT', share: '—', transactions: '—' },
];

export default function PlatformRevenueContent() {
  const [tab, setTab] = useState<'overview' | 'streams' | 'countries' | 'currencies'>('overview');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Tableau de bord Revenus — Plateforme</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>MRR, ARR, transactions, commissions par flux, revenus par pays et analyse des devises</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: '#fef9c3', color: '#ca8a04' }}>
          <Icon name="InformationCircleIcon" size={14} />
          Données démo — Phase 1
        </span>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'MRR (démo)', value: '—', sub: 'Revenu mensuel récurrent', icon: 'ChartBarIcon', color: '#2563eb' },
          { label: 'ARR (démo)', value: '—', sub: 'Revenu annuel récurrent', icon: 'ArrowTrendingUpIcon', color: '#16a34a' },
          { label: 'Transactions', value: '—', sub: 'Ce mois', icon: 'ArrowsRightLeftIcon', color: '#7c3aed' },
          { label: 'Pays actifs', value: String(COUNTRY_DATA.length), sub: 'Avec utilisateurs', icon: 'GlobeAltIcon', color: '#d97706' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {(['overview', 'streams', 'countries', 'currencies'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: tab === t ? 'var(--shifa-blue)' : 'transparent', color: tab === t ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            {{ overview: 'Vue globale', streams: 'Flux de revenus', countries: 'Revenus par pays', currencies: 'Analyse devises' }[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div className="flex items-start gap-3">
              <Icon name="InformationCircleIcon" size={18} style={{ color: '#d97706' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#92400e' }}>Phase 1 — Structure commerciale</p>
                <p className="text-xs mt-1" style={{ color: '#92400e' }}>Les montants réels seront disponibles en Phase 3 après intégration des prestataires de paiement. Ce tableau de bord affiche la structure des flux de revenus avec des données de démonstration.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Flux B2C', items: ['Abonnements professionnels', 'Cours Academy', 'Carte SHIFA physique', 'Services premium patients'], color: '#2563eb' },
              { title: 'Flux B2B', items: ['Abonnements organisations', 'Modules premium', 'Contrats Enterprise', 'Licences institutionnelles'], color: '#7c3aed' },
              { title: 'Flux Transactions', items: ['Commissions marketplace', 'Frais téléconsultation', 'Frais API / appels', 'Frais de traitement'], color: '#16a34a' },
              { title: 'Flux B2G', items: ['Contrats ministériels', 'Déploiements nationaux', 'Intégrations systèmes santé', 'SLA gouvernementaux'], color: '#d97706' },
            ].map(section => (
              <div key={section.title} className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: section.color }} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{section.title}</p>
                </div>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="text-xs flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      <Icon name="ChevronRightIcon" size={10} style={{ color: section.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'streams' && (
        <div className="space-y-3">
          {REVENUE_STREAMS.map(stream => (
            <div key={stream.id} className="rounded-xl border p-4 flex flex-wrap items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stream.color + '18' }}>
                <Icon name={stream.icon as any} size={18} style={{ color: stream.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{stream.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Commission / tarif : {stream.note}</p>
              </div>
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>MRR</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>—</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>ARR</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>—</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Transactions</p>
                  <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>—</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>Phase 3</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'countries' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--muted)' }}>
              <tr>
                {['Pays', 'Devise', 'Utilisateurs', 'Revenu', 'Croissance'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTRY_DATA.map((c, i) => (
                <tr key={c.country} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{c.flag} {c.country}</td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{c.currency}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.users.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>— (Phase 3)</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#16a34a' }}>{c.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'currencies' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#1e40af' }}>Architecture multi-devises SHIFA</p>
            <p className="text-xs" style={{ color: '#1e40af' }}>Chaque transaction est enregistrée en devise locale. Les références EUR et USD sont calculées via le service de taux de change centralisé (Phase 3 : taux en temps réel).</p>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--muted)' }}>
                <tr>
                  {['Devise', 'Nom', 'Symbole', 'Part du volume', 'Transactions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CURRENCY_BREAKDOWN.map((c, i) => (
                  <tr key={c.currency} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                    <td className="px-4 py-3 text-sm font-mono font-bold" style={{ color: 'var(--foreground)' }}>{c.currency}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>{c.symbol}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.share}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Exemple SmartAmount — Affichage multi-devise</p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Transaction XOF</p>
                <SmartAmount amount={10000} currency="XOF" size="md" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Transaction MAD</p>
                <SmartAmount amount={1850} currency="MAD" size="md" />
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Transaction KMF</p>
                <SmartAmount amount={50000} currency="KMF" size="md" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
