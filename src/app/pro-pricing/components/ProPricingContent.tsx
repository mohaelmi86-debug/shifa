'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

type BillingPeriod = 'monthly' | 'annual';

interface ProPlan {
  id: string;
  name: string;
  tier: 'starter' | 'pro' | 'premium';
  tagline: string;
  priceNote: string;
  gradient: string;
  color: string;
  recommended?: boolean;
  features: { name: string; included: boolean | string }[];
}

const plans: ProPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    tagline: 'Démarrez votre pratique numérique',
    priceNote: 'Gratuit',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    color: '#6b7280',
    features: [
      { name: 'Profil professionnel', included: true },
      { name: 'Vérification SHIFA', included: true },
      { name: 'Agenda basique', included: true },
      { name: 'Gestion des rendez-vous', included: true },
      { name: 'Découverte patients', included: true },
      { name: 'Messagerie sécurisée basique', included: true },
      { name: 'Notifications', included: true },
      { name: 'Espace de consultation', included: false },
      { name: 'Prescriptions numériques', included: false },
      { name: 'Résultats & documents', included: false },
      { name: 'Téléconsultation', included: false },
      { name: 'SHIFA AI', included: false },
      { name: 'Statistiques avancées', included: false },
      { name: 'Automatisation', included: false },
      { name: 'Intégrations', included: false },
      { name: 'Carte SHIFA physique offerte', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tier: 'pro',
    tagline: 'La pratique clinique complète',
    priceNote: 'À configurer',
    gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)',
    color: 'var(--shifa-blue)',
    recommended: true,
    features: [
      { name: 'Profil professionnel', included: true },
      { name: 'Vérification SHIFA', included: true },
      { name: 'Agenda avancé', included: true },
      { name: 'Gestion des rendez-vous', included: true },
      { name: 'Découverte patients', included: true },
      { name: 'Messagerie sécurisée avancée', included: true },
      { name: 'Notifications avancées', included: true },
      { name: 'Espace de consultation', included: true },
      { name: 'Prescriptions numériques', included: true },
      { name: 'Résultats & documents', included: true },
      { name: 'Téléconsultation', included: true },
      { name: 'SHIFA AI', included: 'AI Pro' },
      { name: 'Statistiques avancées', included: true },
      { name: 'Automatisation basique', included: true },
      { name: 'Intégrations', included: 'Basique' },
      { name: 'Carte SHIFA physique offerte', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tier: 'premium',
    tagline: 'Pour les praticiens et réseaux exigeants',
    priceNote: 'À configurer',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    color: '#8b5cf6',
    features: [
      { name: 'Profil professionnel', included: true },
      { name: 'Vérification SHIFA', included: true },
      { name: 'Agenda avancé + multi-sites', included: true },
      { name: 'Gestion des rendez-vous', included: true },
      { name: 'Découverte patients', included: true },
      { name: 'Messagerie sécurisée avancée', included: true },
      { name: 'Notifications avancées', included: true },
      { name: 'Espace de consultation', included: true },
      { name: 'Prescriptions numériques', included: true },
      { name: 'Résultats & documents', included: true },
      { name: 'Téléconsultation illimitée', included: true },
      { name: 'SHIFA AI', included: 'AI Enterprise' },
      { name: 'Statistiques avancées', included: true },
      { name: 'Automatisation avancée', included: true },
      { name: 'Intégrations', included: 'Avancé' },
      { name: 'Carte SHIFA physique offerte', included: true },
    ],
  },
];

const aiFeatures = [
  { name: 'Assistant clinique', starter: false, pro: true, premium: true },
  { name: 'Documentation automatique', starter: false, pro: true, premium: true },
  { name: 'Résumés patients', starter: false, pro: true, premium: true },
  { name: 'Analyse de données', starter: false, pro: 'Basique', premium: true },
  { name: 'Assistants spécialisés', starter: false, pro: false, premium: true },
  { name: 'Accès API AI', starter: false, pro: false, premium: true },
  { name: 'Quotas d\'utilisation avancés', starter: false, pro: 'Standard', premium: 'Illimité' },
];

const professions = [
  { name: 'Médecin généraliste', icon: 'UserIcon' },
  { name: 'Spécialiste', icon: 'AcademicCapIcon' },
  { name: 'Infirmier(e)', icon: 'HeartIcon' },
  { name: 'Sage-femme', icon: 'StarIcon' },
  { name: 'Dentiste', icon: 'SparklesIcon' },
  { name: 'Pharmacien', icon: 'ArchiveBoxIcon' },
  { name: 'Kinésithérapeute', icon: 'ArrowPathIcon' },
  { name: 'Psychologue', icon: 'ChatBubbleLeftRightIcon' },
  { name: 'Biologiste', icon: 'BeakerIcon' },
  { name: 'Radiologue', icon: 'PhotoIcon' },
];

function FeatureRow({ name, value }: { name: string; value: boolean | string }) {
  if (value === true) return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
      <span className="text-xs" style={{ color: 'var(--foreground)' }}>{name}</span>
    </div>
  );
  if (value === false) return (
    <div className="flex items-center gap-2 py-1.5 opacity-40">
      <Icon name="XMarkIcon" className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
      <span className="text-xs line-through" style={{ color: 'var(--muted-foreground)' }}>{name}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon name="CheckCircleIcon" className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />
      <span className="text-xs" style={{ color: 'var(--foreground)' }}>{name}</span>
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{value}</span>
    </div>
  );
}

export default function ProPricingContent() {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
            PROFESSIONNELS DE SANTÉ
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            PRIX CONFIGURABLES
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Plans Professionnels SHIFA</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Pour tous les professionnels de santé · Médecins, infirmiers, pharmaciens, biologistes et plus
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
          <button onClick={() => setBilling('monthly')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={billing === 'monthly' ? { background: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
            Mensuel
          </button>
          <button onClick={() => setBilling('annual')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={billing === 'annual' ? { background: 'var(--shifa-blue)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
            Annuel
          </button>
        </div>
        {billing === 'annual' && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
            Économies annuelles — à configurer
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {plans.map((plan) => (
          <div key={plan.id}
            className="card-base overflow-hidden cursor-pointer transition-all duration-200"
            style={{ border: selectedPlan === plan.id ? `2px solid ${plan.color}` : '2px solid transparent', position: 'relative' }}
            onClick={() => setSelectedPlan(plan.id)}>
            {plan.recommended && (
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--shifa-blue)', color: 'white' }}>
                  RECOMMANDÉ
                </span>
              </div>
            )}
            {/* Plan header */}
            <div className="p-5" style={{ background: plan.gradient }}>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-white opacity-80 mt-0.5">{plan.tagline}</p>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white">{plan.priceNote}</span>
                {plan.priceNote !== 'Gratuit' && (
                  <span className="text-xs text-white opacity-70 ml-1">/ {billing === 'monthly' ? 'mois' : 'an'} · par pays</span>
                )}
              </div>
              {plan.priceNote !== 'Gratuit' && (
                <p className="text-[11px] text-white opacity-60 mt-1">Prix final défini par pays et devise locale</p>
              )}
            </div>

            {/* Features */}
            <div className="p-5">
              <div className="space-y-0 divide-y" style={{ borderColor: 'var(--border)' }}>
                {plan.features.map((f, i) => (
                  <FeatureRow key={i} name={f.name} value={f.included} />
                ))}
              </div>
              <button
                className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: plan.gradient, color: 'white' }}>
                {plan.tier === 'starter' ? 'Commencer gratuitement' : 'Choisir ce plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Features matrix */}
      <div className="card-base p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <Icon name="CpuChipIcon" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA AI — Fonctionnalités par plan</h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Les suggestions IA sont toujours clairement identifiées · Jamais de contournement des permissions</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="text-left p-2 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Fonctionnalité AI</th>
                {['Starter', 'Pro', 'Premium'].map((p) => (
                  <th key={p} className="text-center p-2 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aiFeatures.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-2 text-xs" style={{ color: 'var(--foreground)' }}>{f.name}</td>
                  {(['starter', 'pro', 'premium'] as const).map((tier) => (
                    <td key={tier} className="p-2 text-center">
                      {f[tier] === true ? <Icon name="CheckCircleIcon" className="w-4 h-4 mx-auto" style={{ color: '#10B981' }} />
                        : f[tier] === false ? <span className="text-gray-300">—</span>
                          : <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{f[tier]}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professions */}
      <div className="card-base p-5 mb-6">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Disponible pour toutes les professions de santé</h3>
        <div className="flex flex-wrap gap-2">
          {professions.map((p) => (
            <div key={p.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
              <Icon name={p.icon} className="w-3.5 h-3.5" style={{ color: 'var(--shifa-blue)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>+ autres professions…</span>
          </div>
        </div>
      </div>

      {/* Currency note */}
      <div className="card-base p-4 mb-6 flex items-start gap-3" style={{ background: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.15)' }}>
        <Icon name="InformationCircleIcon" className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--shifa-blue)' }} />
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Tarification internationale</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Les prix sont configurés par pays en devise locale. Exemple : 5 000 KMF/mois aux Comores, 250 MAD/mois au Maroc.
            EUR et USD sont affichés comme valeurs de référence uniquement. Prix finaux définis séparément.
          </p>
          <div className="flex gap-4 mt-2">
            <SmartAmount amount={5000} currency="KMF" size="xs" inline />
            <SmartAmount amount={250} currency="MAD" size="xs" inline />
            <SmartAmount amount={29} currency="EUR" size="xs" inline />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/checkout" className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--shifa-blue)', color: 'white' }}>
          Souscrire →
        </Link>
        <Link href="/pricing-plans" className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
          Comparer tous les plans
        </Link>
      </div>
    </div>
  );
}
