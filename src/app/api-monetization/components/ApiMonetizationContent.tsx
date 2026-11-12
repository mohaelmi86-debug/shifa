'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const API_PLANS = [
  {
    id: 'included', label: 'Inclus', color: '#6b7280', bg: '#f9fafb', badge: 'Inclus dans le plan',
    description: 'Accès API de base inclus dans les plans SHIFA Pro et Organisation',
    quotas: { calls: '1 000/mois', rate: '10 req/min', storage: '1 GB', sla: '99%', support: 'Standard' },
    protocols: ['REST API', 'Webhooks basiques'],
    useCases: ['Lecture dossier patient (avec consentement)', 'Vérification identité SHIFA', 'Notifications push', 'Données de rendez-vous'],
  },
  {
    id: 'usage', label: 'Usage-based', color: '#2563eb', bg: '#eff6ff', badge: 'Pay-as-you-go',
    description: 'Facturation à l\'usage — idéal pour intégrations variables',
    quotas: { calls: 'Illimité (facturé)', rate: '60 req/min', storage: '10 GB', sla: '99.5%', support: 'Prioritaire' },
    protocols: ['REST API', 'FHIR R4', 'Webhooks avancés', 'HL7 v2.x'],
    useCases: ['Intégration SIH', 'Échange dossiers médicaux', 'Résultats laboratoire', 'Prescriptions électroniques', 'Imagerie DICOM'],
  },
  {
    id: 'enterprise', label: 'Enterprise', color: '#7c3aed', bg: '#f5f3ff', badge: 'Contrat dédié',
    description: 'Accès complet avec SLA garanti et support dédié',
    quotas: { calls: 'Illimité', rate: 'Illimité', storage: 'Illimité', sla: '99.95%', support: 'Dédié 24/7' },
    protocols: ['REST API', 'FHIR R4/R5', 'HL7 v2/v3', 'DICOM', 'Webhooks', 'GraphQL', 'gRPC'],
    useCases: ['Déploiement national', 'Intégration ministère', 'Réseau hospitalier', 'Assurance nationale', 'Recherche clinique', 'Épidémiosurveillance'],
  },
  {
    id: 'custom', label: 'Contrat Custom', color: '#d97706', bg: '#fffbeb', badge: 'Sur mesure',
    description: 'Contrat personnalisé pour besoins spécifiques',
    quotas: { calls: 'Négocié', rate: 'Négocié', storage: 'Négocié', sla: 'Négocié', support: 'Négocié' },
    protocols: ['Tous protocoles', 'Protocoles propriétaires', 'Intégrations custom'],
    useCases: ['Partenariats stratégiques', 'Intégrations gouvernementales', 'Projets de recherche', 'Déploiements ONG'],
  },
];

const PROTOCOLS = [
  { name: 'REST API', description: 'API RESTful standard — JSON/HTTP', status: 'Disponible', plans: ['Inclus', 'Usage-based', 'Enterprise', 'Custom'], color: '#2563eb' },
  { name: 'FHIR R4', description: 'Fast Healthcare Interoperability Resources v4', status: 'Disponible', plans: ['Usage-based', 'Enterprise', 'Custom'], color: '#16a34a' },
  { name: 'FHIR R5', description: 'Fast Healthcare Interoperability Resources v5', status: 'Bêta', plans: ['Enterprise', 'Custom'], color: '#16a34a' },
  { name: 'HL7 v2.x', description: 'Health Level 7 version 2 — messages ADT/ORM/ORU', status: 'Disponible', plans: ['Usage-based', 'Enterprise', 'Custom'], color: '#7c3aed' },
  { name: 'HL7 v3', description: 'Health Level 7 version 3 — CDA documents', status: 'Bientôt', plans: ['Enterprise', 'Custom'], color: '#7c3aed' },
  { name: 'DICOM', description: 'Digital Imaging and Communications in Medicine', status: 'Disponible', plans: ['Enterprise', 'Custom'], color: '#d97706' },
  { name: 'Webhooks', description: 'Notifications temps réel par HTTP POST', status: 'Disponible', plans: ['Inclus', 'Usage-based', 'Enterprise', 'Custom'], color: '#6b7280' },
  { name: 'GraphQL', description: 'API flexible avec requêtes personnalisées', status: 'Bêta', plans: ['Enterprise', 'Custom'], color: '#e11d48' },
];

const SLA_TIERS = [
  { tier: 'Standard', uptime: '99%', responseTime: '< 2s', support: 'Email', incidents: '72h', plans: 'Inclus' },
  { tier: 'Pro', uptime: '99.5%', responseTime: '< 500ms', support: 'Email + Chat', incidents: '24h', plans: 'Usage-based' },
  { tier: 'Enterprise', uptime: '99.9%', responseTime: '< 200ms', support: 'Dédié', incidents: '4h', plans: 'Enterprise' },
  { tier: 'Premium', uptime: '99.95%', responseTime: '< 100ms', support: '24/7 dédié', incidents: '1h', plans: 'Custom' },
];

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'Disponible': { bg: '#dcfce7', text: '#16a34a' },
  'Bêta': { bg: '#fef9c3', text: '#ca8a04' },
  'Bientôt': { bg: '#f1f5f9', text: '#64748b' },
};

export default function ApiMonetizationContent() {
  const [tab, setTab] = useState<'plans' | 'protocols' | 'sla'>('plans');
  const [selectedPlan, setSelectedPlan] = useState('usage');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>API & Interopérabilité — Monétisation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Plans API/FHIR/HL7/DICOM — Inclus / Usage-based / Enterprise / Custom — avec quotas et SLA
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
          <Icon name="ArrowsRightLeftIcon" size={12} />
          Tarification configurable — Phase 1
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Plans API', value: '4', icon: 'CodeBracketIcon', color: '#2563eb' },
          { label: 'Protocoles', value: '8', icon: 'ArrowsRightLeftIcon', color: '#7c3aed' },
          { label: 'Niveaux SLA', value: '4', icon: 'ShieldCheckIcon', color: '#16a34a' },
          { label: 'Standards santé', value: 'FHIR/HL7/DICOM', icon: 'DocumentTextIcon', color: '#d97706' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {([['plans', 'Plans API'], ['protocols', 'Protocoles'], ['sla', 'SLA & Support']] as const).map(([t, label]) => (
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
        <div className="grid md:grid-cols-2 gap-5">
          {API_PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="rounded-xl border p-5 cursor-pointer transition-all"
              style={{
                background: plan.bg,
                borderColor: selectedPlan === plan.id ? plan.color : plan.color + '30',
                boxShadow: selectedPlan === plan.id ? `0 0 0 2px ${plan.color}40` : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold" style={{ color: plan.color }}>{plan.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: plan.color + '20', color: plan.color }}>{plan.badge}</span>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>{plan.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(plan.quotas).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span style={{ color: 'var(--muted-foreground)' }}>{k === 'calls' ? 'Appels' : k === 'rate' ? 'Débit' : k === 'storage' ? 'Stockage' : k === 'sla' ? 'SLA' : 'Support'} : </span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Protocoles inclus</p>
                <div className="flex flex-wrap gap-1">
                  {plan.protocols.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: plan.color + '15', color: plan.color }}>{p}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Cas d'usage</p>
                <ul className="space-y-1">
                  {plan.useCases.slice(0, 3).map(u => (
                    <li key={u} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--foreground)' }}>
                      <Icon name="CheckIcon" size={10} style={{ color: plan.color }} />
                      {u}
                    </li>
                  ))}
                  {plan.useCases.length > 3 && (
                    <li className="text-xs" style={{ color: 'var(--muted-foreground)' }}>+{plan.useCases.length - 3} autres...</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Protocols */}
      {tab === 'protocols' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Standards d'interopérabilité supportés</span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {PROTOCOLS.map(proto => (
              <div key={proto.name} className="px-4 py-4 flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <span className="text-sm font-bold" style={{ color: proto.color }}>{proto.name}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{proto.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_CONFIG[proto.status]?.bg, color: STATUS_CONFIG[proto.status]?.text }}>
                    {proto.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 shrink-0 max-w-48">
                  {proto.plans.map(p => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: SLA */}
      {tab === 'sla' && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Niveaux de service (SLA) par plan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Niveau SLA', 'Disponibilité', 'Temps de réponse', 'Support', 'Résolution incidents', 'Plan associé'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLA_TIERS.map((sla, i) => (
                  <tr key={sla.tier} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--foreground)' }}>{sla.tier}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>{sla.uptime}</span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{sla.responseTime}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{sla.support}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{sla.incidents}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{sla.plans}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
