'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


const INSURANCE_PLANS = [
  {
    id: 'starter', label: 'Starter', color: '#6b7280', bg: '#f9fafb',
    description: 'Pour mutuelles et assurances de taille moyenne',
    members: '< 10 000 membres', claims: '< 5 000 sinistres/an', api: 'Accès basique',
    features: ['Portail assureur', 'Vérification couverture', 'Gestion sinistres basique', 'Rapports mensuels', 'Support standard'],
    pricing: 'Abonnement institutionnel configurable',
  },
  {
    id: 'pro', label: 'Pro', color: '#2563eb', bg: '#eff6ff',
    description: 'Pour assurances nationales et mutuelles importantes',
    members: '10 000 – 500 000 membres', claims: '5 000 – 50 000 sinistres/an', api: 'API REST complète',
    features: ['Tout Starter', 'API sinistres temps réel', 'Intégration FHIR', 'Analytiques avancées', 'Gestion membres en masse', 'Remboursements automatisés', 'Support prioritaire'],
    pricing: 'Tarification par membre + usage API',
  },
  {
    id: 'enterprise', label: 'Enterprise', color: '#7c3aed', bg: '#f5f3ff',
    description: 'Pour systèmes nationaux d\'assurance maladie',
    members: '500 000+ membres', claims: 'Volume illimité', api: 'API Enterprise + DICOM',
    features: ['Tout Pro', 'Déploiement dédié', 'SLA garanti 99.9%', 'Intégration HL7/DICOM', 'Analytiques épidémiologiques', 'Contrat sur mesure', 'Support 24/7 dédié'],
    pricing: 'Contrat national — devis sur mesure',
  },
];

const API_TIERS = [
  { tier: 'Basique', calls: '1 000/mois', latency: '< 2s', sla: '99%', webhooks: false, fhir: false, color: '#6b7280' },
  { tier: 'Standard', calls: '50 000/mois', latency: '< 500ms', sla: '99.5%', webhooks: true, fhir: false, color: '#2563eb' },
  { tier: 'Pro', calls: '500 000/mois', latency: '< 200ms', sla: '99.9%', webhooks: true, fhir: true, color: '#7c3aed' },
  { tier: 'Enterprise', calls: 'Illimité', latency: '< 100ms', sla: '99.95%', webhooks: true, fhir: true, color: '#d97706' },
];

const CLIENTS = [
  { name: 'CNSS Comores', country: '🇰🇲', plan: 'Pro', members: '45 000', claims: '12 000/an', apiCalls: '28 000/mois', status: 'Actif' },
  { name: 'CNAM Maroc', country: '🇲🇦', plan: 'Enterprise', members: '2 400 000', claims: '850 000/an', apiCalls: '1 200 000/mois', status: 'Actif' },
  { name: 'IPM Sénégal', country: '🇸🇳', plan: 'Pro', members: '180 000', claims: '65 000/an', apiCalls: '95 000/mois', status: 'Actif' },
  { name: 'MUGEF-CI', country: '🇨🇮', plan: 'Starter', members: '8 500', claims: '3 200/an', apiCalls: '4 500/mois', status: 'Essai' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'Actif': { bg: '#dcfce7', text: '#16a34a' },
  'Essai': { bg: '#fef9c3', text: '#ca8a04' },
  'Suspendu': { bg: '#fee2e2', text: '#dc2626' },
};

export default function InsuranceCommercialContent() {
  const [tab, setTab] = useState<'plans' | 'api' | 'clients'>('plans');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Assurance — Modèle Commercial</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Abonnement institutionnel, tarification par membre, niveaux API et volume sinistres
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
          <Icon name="ShieldCheckIcon" size={12} />
          B2B Institutionnel — Prix configurables
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Plans assurance', value: '3', icon: 'ShieldCheckIcon', color: '#7c3aed' },
          { label: 'Clients actifs', value: '3', icon: 'BuildingOffice2Icon', color: '#2563eb' },
          { label: 'Niveaux API', value: '4', icon: 'CodeBracketIcon', color: '#16a34a' },
          { label: 'Membres couverts', value: '2.6M+', icon: 'UsersIcon', color: '#d97706' },
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
        {([['plans', 'Plans institutionnels'], ['api', 'Niveaux API'], ['clients', 'Clients']] as const).map(([t, label]) => (
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

      {/* Tab: Plans */}
      {tab === 'plans' && (
        <div className="grid md:grid-cols-3 gap-5">
          {INSURANCE_PLANS.map(plan => (
            <div key={plan.id} className="rounded-xl border p-5 flex flex-col" style={{ background: plan.bg, borderColor: plan.color + '30' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold" style={{ color: plan.color }}>{plan.label}</span>
                <Icon name="ShieldCheckIcon" size={20} style={{ color: plan.color, opacity: 0.5 }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>{plan.description}</p>

              <div className="space-y-2 mb-4">
                {[
                  { label: 'Membres', value: plan.members },
                  { label: 'Sinistres', value: plan.claims },
                  { label: 'API', value: plan.api },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--foreground)' }}>
                    <Icon name="CheckIcon" size={10} style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-3 border-t" style={{ borderColor: plan.color + '20' }}>
                <p className="text-xs font-medium" style={{ color: plan.color }}>{plan.pricing}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: API */}
      {tab === 'api' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Niveaux d'accès API — Assurance</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Niveau', 'Appels/mois', 'Latence', 'SLA', 'Webhooks', 'FHIR'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {API_TIERS.map((tier, i) => (
                  <tr key={tier.tier} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold" style={{ color: tier.color }}>{tier.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{tier.calls}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{tier.latency}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>{tier.sla}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Icon name={tier.webhooks ? 'CheckCircleIcon' : 'XCircleIcon'} size={16} style={{ color: tier.webhooks ? '#16a34a' : '#dc2626' }} />
                    </td>
                    <td className="px-4 py-3">
                      <Icon name={tier.fhir ? 'CheckCircleIcon' : 'XCircleIcon'} size={16} style={{ color: tier.fhir ? '#16a34a' : '#dc2626' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Clients */}
      {tab === 'clients' && (
        <div className="space-y-3">
          {CLIENTS.map(client => (
            <div key={client.name} className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{client.country}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{client.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[client.status]?.bg, color: STATUS_CONFIG[client.status]?.text }}>{client.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-wrap text-center">
                  {[
                    { label: 'Plan', value: client.plan },
                    { label: 'Membres', value: client.members },
                    { label: 'Sinistres/an', value: client.claims },
                    { label: 'Appels API/mois', value: client.apiCalls },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs italic px-1" style={{ color: 'var(--muted-foreground)' }}>
            * Données de démonstration — Phase 1. Les tarifs définitifs seront négociés par contrat institutionnel.
          </p>
        </div>
      )}
    </div>
  );
}
