'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

const COUNTRIES = [
  { code: 'KM', name: 'Comores', currency: 'KMF', flag: '🇰🇲' },
  { code: 'SN', name: 'Sénégal', currency: 'XOF', flag: '🇸🇳' },
  { code: 'MA', name: 'Maroc', currency: 'MAD', flag: '🇲🇦' },
  { code: 'CI', name: "Côte d\'Ivoire", currency: 'XOF', flag: '🇨🇮' },
  { code: 'TN', name: 'Tunisie', currency: 'TND', flag: '🇹🇳' },
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'DZ', name: 'Algérie', currency: 'DZD', flag: '🇩🇿' },
  { code: 'CM', name: 'Cameroun', currency: 'XAF', flag: '🇨🇲' },
];

interface FeeRow {
  type: string;
  icon: string;
  description: string;
  baseAmount: number;
  currency: string;
  status: 'active' | 'configurable' | 'coming_soon';
  required: boolean;
}

const CARD_FEES: FeeRow[] = [
  { type: 'Fabrication', icon: 'CreditCardIcon', description: 'Coût de production de la carte physique SHIFA', baseAmount: 2500, currency: 'KMF', status: 'configurable', required: true },
  { type: 'Activation', icon: 'BoltIcon', description: "Frais d'activation initiale de la carte", baseAmount: 500, currency: 'KMF', status: 'configurable', required: false },
  { type: 'Livraison standard', icon: 'TruckIcon', description: 'Livraison postale standard (5–10 jours)', baseAmount: 1500, currency: 'KMF', status: 'configurable', required: true },
  { type: 'Livraison express', icon: 'BoltIcon', description: 'Livraison express (1–3 jours ouvrés)', baseAmount: 4000, currency: 'KMF', status: 'coming_soon', required: false },
  { type: 'Remplacement', icon: 'ArrowPathIcon', description: 'Remplacement en cas de perte ou vol', baseAmount: 3000, currency: 'KMF', status: 'configurable', required: false },
  { type: 'Renouvellement', icon: 'CalendarDaysIcon', description: 'Renouvellement à expiration (tous les 3 ans)', baseAmount: 2000, currency: 'KMF', status: 'configurable', required: false },
];

const CARD_TYPES = [
  { id: 'standard', label: 'Standard', color: '#6b7280', bg: '#f9fafb', description: 'Carte SHIFA de base — accès identité numérique', features: ['SHIFA ID', 'QR Code', 'NFC basique', 'Données de santé essentielles'] },
  { id: 'premium', label: 'Premium', color: '#2563eb', bg: '#eff6ff', description: 'Carte SHIFA avancée — services étendus', features: ['Tout Standard', 'NFC avancé', 'Puce sécurisée', 'Accès urgences prioritaire', 'Données médicales complètes'] },
  { id: 'enterprise', label: 'Professionnel', color: '#7c3aed', bg: '#f5f3ff', description: 'Carte SHIFA professionnelle — usage clinique', features: ['Tout Premium', 'Signature électronique', 'Accès prescriptions', 'Identité professionnelle vérifiée', 'Intégration systèmes hospitaliers'] },
];

const ORDERS = [
  { id: 'ORD-001', patient: 'Aïcha Diallo', country: '🇰🇲 Comores', type: 'Standard', fees: ['Fabrication', 'Livraison standard'], total: 4000, currency: 'KMF', status: 'En livraison', date: '2025-01-08' },
  { id: 'ORD-002', patient: 'Mohamed Sy', country: '🇸🇳 Sénégal', type: 'Premium', fees: ['Fabrication', 'Activation', 'Livraison standard'], total: 8500, currency: 'XOF', status: 'Activée', date: '2025-01-05' },
  { id: 'ORD-003', patient: 'Fatima Benali', country: '🇲🇦 Maroc', type: 'Standard', fees: ['Remplacement'], total: 120, currency: 'MAD', status: 'En traitement', date: '2025-01-10' },
  { id: 'ORD-004', patient: 'Dr. Koné Ibrahima', country: "🇨🇮 Côte d\'Ivoire", type: 'Professionnel', fees: ['Fabrication', 'Activation', 'Livraison express'], total: 18000, currency: 'XOF', status: 'Commandée', date: '2025-01-11' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'En livraison': { bg: '#dbeafe', text: '#1d4ed8' },
  'Activée': { bg: '#dcfce7', text: '#16a34a' },
  'En traitement': { bg: '#fef9c3', text: '#ca8a04' },
  'Commandée': { bg: '#f3e8ff', text: '#7c3aed' },
  active: { bg: '#dcfce7', text: '#16a34a' },
  configurable: { bg: '#dbeafe', text: '#1d4ed8' },
  coming_soon: { bg: '#f1f5f9', text: '#64748b' },
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  configurable: 'Configurable',
  coming_soon: 'Bientôt',
};

export default function CardEconomyContent() {
  const [selectedCountry, setSelectedCountry] = useState('KM');
  const [selectedCardType, setSelectedCardType] = useState('standard');
  const [tab, setTab] = useState<'fees' | 'orders' | 'config'>('fees');

  const country = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Économie Carte SHIFA Physique</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Frais de fabrication, activation, livraison, remplacement et renouvellement — configurables par pays et devise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <Icon name="CreditCardIcon" size={12} />
            Carte Digitale : Gratuite
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
            <Icon name="BanknotesIcon" size={12} />
            Carte Physique : Payante
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Types de carte', value: '3', icon: 'CreditCardIcon', color: '#2563eb' },
          { label: 'Frais configurables', value: '6', icon: 'Cog6ToothIcon', color: '#7c3aed' },
          { label: 'Pays supportés', value: '8+', icon: 'GlobeAltIcon', color: '#16a34a' },
          { label: 'Commandes actives', value: '4', icon: 'TruckIcon', color: '#d97706' },
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

      {/* Country + Card Type Selector */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Pays de référence</p>
          <div className="grid grid-cols-2 gap-2">
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: selectedCountry === c.code ? '#dbeafe' : 'var(--muted)',
                  color: selectedCountry === c.code ? '#1d4ed8' : 'var(--foreground)',
                  fontWeight: selectedCountry === c.code ? 600 : 400,
                  border: selectedCountry === c.code ? '1.5px solid #93c5fd' : '1.5px solid transparent',
                }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="ml-auto text-xs opacity-60">{c.currency}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type de carte</p>
          <div className="space-y-2">
            {CARD_TYPES.map(ct => (
              <button
                key={ct.id}
                onClick={() => setSelectedCardType(ct.id)}
                className="w-full text-left rounded-lg p-3 transition-all border"
                style={{
                  background: selectedCardType === ct.id ? ct.bg : 'var(--muted)',
                  borderColor: selectedCardType === ct.id ? ct.color + '40' : 'transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: selectedCardType === ct.id ? ct.color : 'var(--foreground)' }}>{ct.label}</span>
                  {selectedCardType === ct.id && <Icon name="CheckCircleIcon" size={14} style={{ color: ct.color }} />}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ct.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {([['fees', 'Structure des frais'], ['orders', 'Commandes'], ['config', 'Configuration']] as const).map(([t, label]) => (
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

      {/* Tab: Fees */}
      {tab === 'fees' && (
        <div className="space-y-4">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Frais — {country.flag} {country.name} ({country.currency})
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                Prix configurables — Phase 1
              </span>
            </div>
            <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {CARD_FEES.map(fee => (
                <div key={fee.type} className="px-4 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                    <Icon name={fee.icon as any} size={18} style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{fee.type}</span>
                      {fee.required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#fef9c3', color: '#ca8a04' }}>Obligatoire</span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: STATUS_CONFIG[fee.status].bg, color: STATUS_CONFIG[fee.status].text }}>
                        {STATUS_LABELS[fee.status]}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{fee.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <SmartAmount amount={fee.baseAmount} currency={fee.currency} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total estimé */}
          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Estimation commande — Carte {CARD_TYPES.find(c => c.id === selectedCardType)?.label}</p>
            <div className="space-y-2">
              {['Fabrication', 'Activation', 'Livraison standard'].map((item, i) => {
                const fee = CARD_FEES.find(f => f.type === item);
                if (!fee) return null;
                return (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item}</span>
                    <SmartAmount amount={fee.baseAmount} currency={fee.currency} size="xs" inline />
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Total estimé</span>
                <SmartAmount amount={4500} currency="KMF" size="md" />
              </div>
            </div>
            <p className="text-xs mt-3 italic" style={{ color: 'var(--muted-foreground)' }}>
              * Prix indicatifs — Phase 1. Les tarifs définitifs seront configurés par pays avant le lancement.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {tab === 'orders' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Commandes de cartes physiques</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Référence', 'Patient', 'Pays', 'Type', 'Frais inclus', 'Total', 'Statut', 'Date'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order, i) => (
                  <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.id}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{order.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.country}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{order.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {order.fees.map(f => (
                          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{f}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SmartAmount amount={order.total} currency={order.currency} size="xs" inline />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[order.status]?.bg || '#f1f5f9', color: STATUS_CONFIG[order.status]?.text || '#64748b' }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Config */}
      {tab === 'config' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Règles de tarification par pays</h3>
            <div className="space-y-3">
              {[
                { rule: 'Devise locale = devise de transaction', status: '✅', note: 'KMF pour Comores, XOF pour Sénégal/CI, MAD pour Maroc...' },
                { rule: 'EUR/USD = valeurs de référence uniquement', status: '✅', note: 'Affichées en ≈ — pas la devise de facturation' },
                { rule: 'Prix configurables par pays', status: '⚙️', note: 'Aucun prix hardcodé — configuration admin requise' },
                { rule: 'Livraison express disponible selon pays', status: '🔶', note: 'Disponibilité à configurer par zone géographique' },
                { rule: 'Frais activation optionnels', status: '⚙️', note: 'Peut être inclus ou facturé séparément selon le marché' },
              ].map(r => (
                <div key={r.rule} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--muted)' }}>
                  <span className="text-base shrink-0">{r.status}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{r.rule}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Fonctionnalités par type de carte</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {CARD_TYPES.map(ct => (
                <div key={ct.id} className="rounded-lg p-4 border" style={{ background: ct.bg, borderColor: ct.color + '30' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: ct.color }}>{ct.label}</p>
                  <ul className="space-y-1">
                    {ct.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--foreground)' }}>
                        <Icon name="CheckIcon" size={10} style={{ color: ct.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
