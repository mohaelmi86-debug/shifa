'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

const TIERS = [
  { id: 'ambassador', label: 'Ambassadeur', color: '#6b7280', bg: '#f3f4f6', icon: 'StarIcon', minReferrals: 0, commission: 'Configurable', perks: ['Lien de parrainage personnel', 'Kit marketing de base', 'Tableau de bord', 'Formation initiale'] },
  { id: 'certified', label: 'Ambassadeur Certifié', color: '#2563eb', bg: '#eff6ff', icon: 'ShieldCheckIcon', minReferrals: 10, commission: 'Configurable +', perks: ['Tout Ambassadeur', 'Badge certifié', 'Kit marketing avancé', 'Support prioritaire', 'Accès formations avancées'] },
  { id: 'regional', label: 'Ambassadeur Régional', color: '#7c3aed', bg: '#f5f3ff', icon: 'GlobeAltIcon', minReferrals: 50, commission: 'Configurable ++', perks: ['Tout Certifié', 'Territoire régional', 'Sous-réseau ambassadeurs', 'Reporting régional', 'Événements SHIFA'] },
  { id: 'partner', label: 'SHIFA Partner', color: '#d97706', bg: '#fffbeb', icon: 'TrophyIcon', minReferrals: 200, commission: 'Négocié', perks: ['Tout Régional', 'Contrat partenariat', 'Co-branding', 'Accès API partenaire', 'Revenue sharing dédié'] },
];

const REFERRAL_LINKS = [
  { id: 'rl-1', label: 'Lien professionnel général', url: 'shifa.health/ref/KD-PRO-7X2', clicks: 342, conversions: 28, status: 'active' },
  { id: 'rl-2', label: 'Campagne Sénégal — Médecins', url: 'shifa.health/ref/KD-SN-MED', clicks: 189, conversions: 14, status: 'active' },
  { id: 'rl-3', label: 'Campagne Cliniques Dakar', url: 'shifa.health/ref/KD-CLN-DKR', clicks: 97, conversions: 6, status: 'paused' },
  { id: 'rl-4', label: 'Lien organisation', url: 'shifa.health/ref/KD-ORG-4K1', clicks: 54, conversions: 3, status: 'active' },
];

const CONVERSIONS = [
  { id: 'c1', date: '2026-08-10', type: 'Professionnel activé', actor: 'Dr. Fatou Ndiaye', plan: 'Pro', reward: 'En attente', currency: 'XOF' },
  { id: 'c2', date: '2026-08-08', type: 'Organisation souscrite', actor: 'Clinique Pasteur', plan: 'Org Pro', reward: 'Validé', currency: 'XOF' },
  { id: 'c3', date: '2026-08-05', type: 'Professionnel vérifié', actor: 'Dr. Ibrahima Sow', plan: 'Starter', reward: 'Validé', currency: 'XOF' },
  { id: 'c4', date: '2026-07-30', type: 'Module activé', actor: 'Lab Analyses Dakar', plan: 'Module Lab', reward: 'Payé', currency: 'XOF' },
  { id: 'c5', date: '2026-07-22', type: 'Professionnel activé', actor: 'Dr. Aminata Diallo', plan: 'Pro', reward: 'Payé', currency: 'XOF' },
];

const PAYOUTS = [
  { id: 'p1', period: 'Juillet 2026', amount: 45000, currency: 'XOF', status: 'Payé', method: 'Orange Money', date: '2026-08-01' },
  { id: 'p2', period: 'Juin 2026', amount: 38500, currency: 'XOF', status: 'Payé', method: 'Orange Money', date: '2026-07-01' },
  { id: 'p3', period: 'Mai 2026', amount: 29000, currency: 'XOF', status: 'Payé', method: 'Orange Money', date: '2026-06-01' },
];

const statusColor: Record<string, { bg: string; text: string }> = {
  active: { bg: '#dcfce7', text: '#16a34a' },
  paused: { bg: '#fef9c3', text: '#ca8a04' },
  'En attente': { bg: '#fef9c3', text: '#ca8a04' },
  Validé: { bg: '#dbeafe', text: '#2563eb' },
  Payé: { bg: '#dcfce7', text: '#16a34a' },
};

export default function AmbassadorCommercialContent() {
  const [tab, setTab] = useState<'overview' | 'links' | 'conversions' | 'payouts'>('overview');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Programme Ambassadeur — Commercial</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Niveaux, liens de parrainage, conversions, récompenses et historique des paiements</p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: '#fffbeb', color: '#d97706' }}>
          Niveau actuel : Ambassadeur Certifié
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Clics totaux', value: '682', icon: 'CursorArrowRaysIcon', color: '#2563eb' },
          { label: 'Conversions', value: '51', icon: 'CheckCircleIcon', color: '#16a34a' },
          { label: 'Taux conversion', value: '7.5%', icon: 'ChartBarIcon', color: '#7c3aed' },
          { label: 'Récompenses en attente', value: '—', icon: 'BanknotesIcon', color: '#d97706' },
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
        {(['overview', 'links', 'conversions', 'payouts'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: tab === t ? 'var(--shifa-blue)' : 'transparent', color: tab === t ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            {{ overview: 'Niveaux & Tiers', links: 'Liens de parrainage', conversions: 'Conversions', payouts: 'Paiements' }[t]}
          </button>
        ))}
      </div>

      {/* Tab: Tiers */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIERS.map(tier => (
            <div key={tier.id} className="rounded-xl border p-5" style={{ background: tier.bg, borderColor: tier.color + '33' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: tier.color + '22' }}>
                  <Icon name={tier.icon as any} size={20} style={{ color: tier.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: tier.color }}>{tier.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Seuil : {tier.minReferrals === 0 ? 'Entrée' : `${tier.minReferrals}+ conversions`}</p>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium" style={{ background: tier.color + '22', color: tier.color }}>
                  Commission : {tier.commission}
                </span>
              </div>
              <ul className="space-y-1">
                {tier.perks.map(p => (
                  <li key={p} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                    <Icon name="CheckIcon" size={12} style={{ color: tier.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Referral Links */}
      {tab === 'links' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />
              Créer un lien
            </button>
          </div>
          {REFERRAL_LINKS.map(link => {
            const sc = statusColor[link.status] || { bg: '#f1f5f9', text: '#64748b' };
            return (
              <div key={link.id} className="rounded-xl border p-4 flex flex-wrap items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{link.label}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{link.url}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{link.clicks}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Clics</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{link.conversions}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Conversions</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>
                    {link.status === 'active' ? 'Actif' : 'Pausé'}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Icon name="ClipboardDocumentIcon" size={14} style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Conversions */}
      {tab === 'conversions' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--muted)' }}>
              <tr>
                {['Date', 'Type', 'Acteur', 'Plan', 'Récompense'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONVERSIONS.map((c, i) => {
                const sc = statusColor[c.reward] || { bg: '#f1f5f9', text: '#64748b' };
                return (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{c.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.actor}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.plan}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>{c.reward}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Payouts */}
      {tab === 'payouts' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4 flex items-center gap-4" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <Icon name="InformationCircleIcon" size={18} style={{ color: '#d97706' }} />
            <p className="text-sm" style={{ color: '#92400e' }}>Les montants de commission sont configurables. Les paiements sont traités en Phase 3 avec les prestataires de paiement locaux.</p>
          </div>
          {PAYOUTS.map(p => {
            const sc = statusColor[p.status] || { bg: '#f1f5f9', text: '#64748b' };
            return (
              <div key={p.id} className="rounded-xl border p-4 flex flex-wrap items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.period}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Via {p.method} · {p.date}</p>
                </div>
                <SmartAmount amount={p.amount} currency={p.currency} size="md" />
                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>{p.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
