'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


const AI_PLANS = [
  {
    id: 'included', label: 'AI Inclus', color: '#6b7280', bg: '#f9fafb', badge: 'Inclus dans le plan',
    description: 'Fonctionnalités IA de base incluses dans tous les plans SHIFA',
    quotas: { requests: '100/mois', tokens: 'Limité', models: 'Standard', api: false, analytics: false, dedicated: false },
    features: ['Assistance documentation clinique', 'Résumés patients basiques', 'Suggestions diagnostiques', 'Aide à la prescription', 'Traduction médicale'],
    actors: ['Patient', 'Professionnel Starter', 'Organisation Base'],
  },
  {
    id: 'pro', label: 'AI Pro', color: '#2563eb', bg: '#eff6ff', badge: 'Plan Pro',
    description: 'Fonctionnalités IA avancées pour professionnels et organisations',
    quotas: { requests: '2 000/mois', tokens: 'Étendu', models: 'Avancé', api: false, analytics: true, dedicated: false },
    features: ['Tout AI Inclus', 'Documentation automatisée avancée', 'Analyse de données patients', 'Automatisation administrative', 'Assistants spécialisés', 'Analytiques organisation', 'Alertes intelligentes'],
    actors: ['Professionnel Pro/Premium', 'Organisation Pro', 'Assurance'],
  },
  {
    id: 'enterprise', label: 'AI Enterprise', color: '#7c3aed', bg: '#f5f3ff', badge: 'Enterprise / B2G',
    description: 'Accès API complet, quotas illimités et services IA dédiés',
    quotas: { requests: 'Illimité', tokens: 'Illimité', models: 'Tous modèles', api: true, analytics: true, dedicated: true },
    features: ['Tout AI Pro', 'Accès API complet', 'Modèles personnalisés', 'Fine-tuning sur données org.', 'Analytiques épidémiologiques', 'Intégration systèmes tiers', 'Support IA dédié', 'SLA garanti'],
    actors: ['Hôpital / Réseau', 'Ministère', 'Université', 'Assurance nationale', 'ONG'],
  },
];

const ACTOR_MATRIX = [
  { actor: 'Patient', included: true, pro: false, enterprise: false },
  { actor: 'Professionnel Starter', included: true, pro: false, enterprise: false },
  { actor: 'Professionnel Pro', included: true, pro: true, enterprise: false },
  { actor: 'Organisation Base', included: true, pro: false, enterprise: false },
  { actor: 'Organisation Pro', included: true, pro: true, enterprise: false },
  { actor: 'Hôpital / Réseau', included: true, pro: true, enterprise: true },
  { actor: 'Ministère / B2G', included: true, pro: true, enterprise: true },
  { actor: 'Université', included: true, pro: true, enterprise: true },
  { actor: 'Assurance', included: true, pro: true, enterprise: true },
];

const API_TIERS = [
  { tier: 'Gratuit', rateLimit: '10 req/min', monthly: '100 req', auth: 'Clé API', sla: '—', color: '#6b7280' },
  { tier: 'Standard', rateLimit: '60 req/min', monthly: '10 000 req', auth: 'Clé API + OAuth', sla: '99.5%', color: '#2563eb' },
  { tier: 'Pro', rateLimit: '300 req/min', monthly: '100 000 req', auth: 'OAuth 2.0', sla: '99.9%', color: '#7c3aed' },
  { tier: 'Enterprise', rateLimit: 'Illimité', monthly: 'Illimité', auth: 'mTLS + OAuth', sla: '99.95%', color: '#d97706' },
];

export default function AIPricingContent() {
  const [tab, setTab] = useState<'plans' | 'matrix' | 'api'>('plans');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>SHIFA AI — Tarification</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Plans Inclus / Pro / Enterprise, quotas d'utilisation, accès API et services IA avancés par acteur</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: '#eff6ff', color: '#2563eb' }}>
          <Icon name="CpuChipIcon" size={14} />
          Prix configurables — Phase 1
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Plans IA', value: '3', icon: 'SparklesIcon', color: '#7c3aed' },
          { label: 'Acteurs couverts', value: '9', icon: 'UsersIcon', color: '#2563eb' },
          { label: 'Niveaux API', value: '4', icon: 'CodeBracketIcon', color: '#16a34a' },
          { label: 'Tarification', value: 'Config.', icon: 'BanknotesIcon', color: '#d97706' },
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
        {(['plans', 'matrix', 'api'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: tab === t ? 'var(--shifa-blue)' : 'transparent', color: tab === t ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            {{ plans: 'Plans IA', matrix: 'Matrice acteurs', api: 'Niveaux API' }[t]}
          </button>
        ))}
      </div>

      {tab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_PLANS.map(plan => (
            <div key={plan.id} className="rounded-xl border p-5 flex flex-col gap-4" style={{ background: plan.bg, borderColor: plan.color + '44' }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: plan.color + '22' }}>
                      <Icon name="CpuChipIcon" size={18} style={{ color: plan.color }} />
                    </div>
                    <p className="font-bold text-base" style={{ color: plan.color }}>{plan.label}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: plan.color + '22', color: plan.color }}>{plan.badge}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{plan.description}</p>
              </div>

              {/* Quotas */}
              <div className="rounded-lg p-3 space-y-1.5" style={{ background: 'var(--card)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Quotas</p>
                {[
                  { label: 'Requêtes', value: plan.quotas.requests },
                  { label: 'Tokens', value: plan.quotas.tokens },
                  { label: 'Modèles', value: plan.quotas.models },
                ].map(q => (
                  <div key={q.label} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>{q.label}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{q.value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Accès API</span>
                  <Icon name={plan.quotas.api ? 'CheckIcon' : 'XMarkIcon'} size={12} style={{ color: plan.quotas.api ? '#16a34a' : '#dc2626' }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Analytics IA</span>
                  <Icon name={plan.quotas.analytics ? 'CheckIcon' : 'XMarkIcon'} size={12} style={{ color: plan.quotas.analytics ? '#16a34a' : '#dc2626' }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Support dédié</span>
                  <Icon name={plan.quotas.dedicated ? 'CheckIcon' : 'XMarkIcon'} size={12} style={{ color: plan.quotas.dedicated ? '#16a34a' : '#dc2626' }} />
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-1 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                    <Icon name="CheckIcon" size={11} style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Actors */}
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Acteurs éligibles</p>
                <div className="flex flex-wrap gap-1">
                  {plan.actors.map(a => (
                    <span key={a} className="text-xs px-1.5 py-0.5 rounded" style={{ background: plan.color + '18', color: plan.color }}>{a}</span>
                  ))}
                </div>
              </div>

              <div className="text-center py-2 rounded-lg text-xs font-semibold" style={{ background: plan.color + '18', color: plan.color }}>
                Tarif configurable — Phase 3
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'matrix' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--muted)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Acteur</th>
                {AI_PLANS.map(p => (
                  <th key={p.id} className="px-4 py-3 text-center text-xs font-semibold" style={{ color: p.color }}>{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTOR_MATRIX.map((row, i) => (
                <tr key={row.actor} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{row.actor}</td>
                  <td className="px-4 py-3 text-center">
                    <Icon name={row.included ? 'CheckCircleIcon' : 'MinusCircleIcon'} size={16} style={{ color: row.included ? '#16a34a' : '#d1d5db' }} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Icon name={row.pro ? 'CheckCircleIcon' : 'MinusCircleIcon'} size={16} style={{ color: row.pro ? '#2563eb' : '#d1d5db' }} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Icon name={row.enterprise ? 'CheckCircleIcon' : 'MinusCircleIcon'} size={16} style={{ color: row.enterprise ? '#7c3aed' : '#d1d5db' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'api' && (
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#166534' }}>Architecture API SHIFA AI</p>
            <p className="text-xs" style={{ color: '#166534' }}>L'accès API est réservé aux plans Enterprise. Les quotas et tarifs sont configurables par organisation. La facturation à l'usage sera implémentée en Phase 3.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {API_TIERS.map(tier => (
              <div key={tier.tier} className="rounded-xl border p-4 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: tier.color + '44' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: tier.color + '18' }}>
                    <Icon name="CodeBracketIcon" size={16} style={{ color: tier.color }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: tier.color }}>{tier.tier}</p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Rate limit', value: tier.rateLimit },
                    { label: 'Mensuel', value: tier.monthly },
                    { label: 'Auth', value: tier.auth },
                    { label: 'SLA', value: tier.sla },
                  ].map(item => (
                    <li key={item.label} className="flex justify-between text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center py-1.5 rounded-lg text-xs font-medium" style={{ background: tier.color + '18', color: tier.color }}>
                  {tier.tier === 'Gratuit' ? 'Inclus' : 'Configurable'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
