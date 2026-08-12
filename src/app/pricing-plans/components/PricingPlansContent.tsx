'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

type BillingPeriod = 'monthly' | 'annual' | 'onetime';
type ActorFilter = 'all' | 'patient' | 'professional' | 'organization';

interface PlanFeature {
  name: string;
  patient?: boolean | string;
  starter?: boolean | string;
  pro?: boolean | string;
  org_base?: boolean | string;
  org_pro?: boolean | string;
  enterprise?: boolean | string;
}

const features: PlanFeature[] = [
  { name: 'Compte SHIFA & identité', patient: true, starter: true, pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Carte SHIFA numérique', patient: true, starter: true, pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Dossier de santé', patient: true, starter: false, pro: false, org_base: true, org_pro: true, enterprise: true },
  { name: 'Rendez-vous', patient: true, starter: true, pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Messagerie sécurisée', patient: true, starter: true, pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Profil professionnel vérifié', patient: false, starter: true, pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Agenda avancé', patient: false, starter: 'Basique', pro: true, org_base: true, org_pro: true, enterprise: true },
  { name: 'Espace de consultation', patient: false, starter: false, pro: true, org_base: false, org_pro: true, enterprise: true },
  { name: 'Prescriptions', patient: false, starter: false, pro: true, org_base: false, org_pro: true, enterprise: true },
  { name: 'Téléconsultation', patient: 'Payant', starter: false, pro: true, org_base: false, org_pro: true, enterprise: true },
  { name: 'SHIFA AI', patient: false, starter: false, pro: 'Pro AI', org_base: false, org_pro: 'Org AI', enterprise: 'Enterprise AI' },
  { name: 'Statistiques & analytics', patient: false, starter: false, pro: true, org_base: 'Basique', org_pro: true, enterprise: true },
  { name: 'Modules spécialisés', patient: false, starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Inclus', enterprise: 'Illimité' },
  { name: 'Interopérabilité FHIR/HL7', patient: false, starter: false, pro: false, org_base: false, org_pro: 'Optionnel', enterprise: true },
  { name: 'API & webhooks', patient: false, starter: false, pro: false, org_base: false, org_pro: false, enterprise: true },
  { name: 'SLA & support dédié', patient: false, starter: false, pro: false, org_base: false, org_pro: false, enterprise: true },
  { name: 'Carte SHIFA physique', patient: 'Payant', starter: 'Payant', pro: 'Incluse', org_base: false, org_pro: false, enterprise: false },
  { name: 'Notifications SMS', patient: false, starter: false, pro: true, org_base: true, org_pro: true, enterprise: true },
];

const plans = [
  { key: 'patient', label: 'Patient', sublabel: 'Gratuit', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: 'UserIcon', priceNote: 'Gratuit', actor: 'patient' },
  { key: 'starter', label: 'Pro Starter', sublabel: 'Professionnel', color: 'var(--shifa-blue)', gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)', icon: 'UserGroupIcon', priceNote: 'Gratuit', actor: 'professional' },
  { key: 'pro', label: 'Pro Premium', sublabel: 'Professionnel', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', icon: 'SparklesIcon', priceNote: 'À configurer', actor: 'professional' },
  { key: 'org_base', label: 'Org. Base', sublabel: 'Organisation', color: 'var(--shifa-purple)', gradient: 'linear-gradient(135deg, var(--shifa-purple), #5b3d8a)', icon: 'BuildingOffice2Icon', priceNote: 'À configurer', actor: 'organization' },
  { key: 'org_pro', label: 'Org. Pro', sublabel: 'Organisation', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: 'BuildingOffice2Icon', priceNote: 'À configurer', actor: 'organization' },
  { key: 'enterprise', label: 'Enterprise', sublabel: 'B2G / Réseau', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #b91c1c)', icon: 'BuildingLibraryIcon', priceNote: 'Sur devis', actor: 'organization' },
];

const modules = [
  { name: 'Laboratoire', icon: 'BeakerIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Pharmacie', icon: 'ArchiveBoxIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Imagerie', icon: 'PhotoIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Urgences', icon: 'BoltIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Inclus', enterprise: 'Inclus' },
  { name: 'Maternité', icon: 'HeartIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Pédiatrie', icon: 'StarIcon', starter: false, pro: false, org_base: 'Optionnel', org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Bloc opératoire', icon: 'ScissorsIcon', starter: false, pro: false, org_base: false, org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Finance & Facturation', icon: 'BanknotesIcon', starter: false, pro: false, org_base: 'Basique', org_pro: 'Avancé', enterprise: 'Complet' },
  { name: 'RH & Personnel', icon: 'UsersIcon', starter: false, pro: false, org_base: false, org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Inventaire', icon: 'ArchiveBoxIcon', starter: false, pro: false, org_base: 'Basique', org_pro: 'Avancé', enterprise: 'Complet' },
  { name: 'Qualité & Accréditation', icon: 'ShieldCheckIcon', starter: false, pro: false, org_base: false, org_pro: 'Optionnel', enterprise: 'Inclus' },
  { name: 'Biomédical', icon: 'CpuChipIcon', starter: false, pro: false, org_base: false, org_pro: 'Optionnel', enterprise: 'Inclus' },
];

function FeatureCell({ value }: { value: boolean | string | undefined }) {
  if (value === true) return <Icon name="CheckCircleIcon" className="w-4 h-4 mx-auto" style={{ color: '#10B981' }} />;
  if (value === false || value === undefined) return <span className="text-gray-300 text-sm mx-auto block text-center">—</span>;
  return <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mx-auto block text-center w-fit" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{value}</span>;
}

export default function PricingPlansContent() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [actorFilter, setActorFilter] = useState<ActorFilter>('all');
  const [activeTab, setActiveTab] = useState<'features' | 'modules'>('features');

  const visiblePlans = actorFilter === 'all' ? plans : plans.filter(p => p.actor === actorFilter || actorFilter === 'all');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            PRIX CONFIGURABLES — NON FINALISÉS
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Comparaison des plans SHIFA</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Tous les acteurs · Toutes les fonctionnalités · Modules activables · Devise locale + référence EUR/USD
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Billing period */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
          {(['monthly', 'annual', 'onetime'] as BillingPeriod[]).map((p) => (
            <button key={p} onClick={() => setBillingPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={billingPeriod === p ? { background: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              {p === 'monthly' ? 'Mensuel' : p === 'annual' ? 'Annuel' : 'Ponctuel'}
            </button>
          ))}
        </div>
        {/* Actor filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
          {(['all', 'patient', 'professional', 'organization'] as ActorFilter[]).map((a) => (
            <button key={a} onClick={() => setActorFilter(a)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={actorFilter === a ? { background: 'var(--shifa-dark)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              {a === 'all' ? 'Tous' : a === 'patient' ? 'Patient' : a === 'professional' ? 'Professionnel' : 'Organisation'}
            </button>
          ))}
        </div>
        {/* Tab */}
        <div className="flex items-center gap-1 p-1 rounded-xl ml-auto" style={{ background: 'var(--muted)' }}>
          {(['features', 'modules'] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={activeTab === t ? { background: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              {t === 'features' ? 'Fonctionnalités' : 'Modules'}
            </button>
          ))}
        </div>
      </div>

      {/* Plan headers */}
      <div className="card-base overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="p-4 text-left w-48" style={{ background: 'var(--muted)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Fonctionnalité</span>
                </th>
                {visiblePlans.map((plan) => (
                  <th key={plan.key} className="p-4 text-center" style={{ background: 'var(--muted)' }}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: plan.gradient }}>
                        <Icon name={plan.icon} className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{plan.label}</span>
                      <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{plan.sublabel}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${plan.color}15`, color: plan.color }}>
                        {plan.priceNote}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'features' ? features.map((f, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)' }}>
                  <td className="p-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{f.name}</td>
                  {visiblePlans.map((plan) => (
                    <td key={plan.key} className="p-3 text-center">
                      <FeatureCell value={f[plan.key as keyof PlanFeature] as boolean | string | undefined} />
                    </td>
                  ))}
                </tr>
              )) : modules.map((m, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--muted)' }}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon name={m.icon} className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{m.name}</span>
                    </div>
                  </td>
                  {visiblePlans.map((plan) => (
                    <td key={plan.key} className="p-3 text-center">
                      <FeatureCell value={m[plan.key as keyof typeof m] as boolean | string | undefined} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency display example */}
      <div className="card-base p-5 mb-6">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Exemple d'affichage des prix — Devise locale + référence EUR/USD</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Comores (KMF)</p>
            <SmartAmount amount={10000} currency="KMF" size="sm" />
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Maroc (MAD)</p>
            <SmartAmount amount={250} currency="MAD" size="sm" />
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Afrique de l'Ouest (XOF)</p>
            <SmartAmount amount={5000} currency="XOF" size="sm" />
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Europe (EUR)</p>
            <SmartAmount amount={29} currency="EUR" size="sm" />
          </div>
        </div>
        <p className="text-[11px] mt-3" style={{ color: 'var(--muted-foreground)' }}>
          ⚠️ Les montants EUR/USD affichés sont des valeurs de référence (taux démo Phase 1). Intégration fournisseur de taux en temps réel prévue en Phase 3.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link href="/pro-pricing" className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--shifa-blue)', color: 'white' }}>
          Plans Professionnels →
        </Link>
        <Link href="/org-pricing" className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--shifa-purple)', color: 'white' }}>
          Plans Organisation →
        </Link>
        <Link href="/checkout" className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#10B981', color: 'white' }}>
          Souscrire →
        </Link>
      </div>
    </div>
  );
}
