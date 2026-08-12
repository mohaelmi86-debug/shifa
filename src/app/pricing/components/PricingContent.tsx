'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ActorCard {
  id: string;
  actor: string;
  icon: string;
  tagline: string;
  model: string;
  highlight: string;
  highlightColor: string;
  features: string[];
  cta: string;
  ctaHref: string;
  badge?: string;
  gradient: string;
}

const actors: ActorCard[] = [
  {
    id: 'patient',
    actor: 'Patient',
    icon: 'UserIcon',
    tagline: 'Votre santé, votre identité SHIFA',
    model: 'Gratuit par défaut',
    highlight: 'GRATUIT',
    highlightColor: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    features: [
      'Compte SHIFA & identité numérique',
      'Dossier de santé personnel',
      'Carte SHIFA numérique',
      'Rendez-vous & messagerie sécurisée',
      'Prescriptions & résultats',
      'Prévention & suivi',
    ],
    cta: 'Créer un compte gratuit',
    ctaHref: '/sign-up-login-screen',
    badge: 'Cœur gratuit',
  },
  {
    id: 'professional',
    actor: 'Professionnel de santé',
    icon: 'UserGroupIcon',
    tagline: 'Votre espace clinique complet',
    model: 'Starter gratuit · Pro payant',
    highlight: 'STARTER GRATUIT',
    highlightColor: 'var(--shifa-blue)',
    gradient: 'linear-gradient(135deg, var(--shifa-blue) 0%, #0044cc 100%)',
    features: [
      'Profil professionnel vérifié',
      'Agenda & gestion des rendez-vous',
      'Espace de consultation',
      'Prescriptions & résultats',
      'Téléconsultation (Pro)',
      'SHIFA AI & statistiques (Pro)',
    ],
    cta: 'Voir les plans Pro',
    ctaHref: '/pro-pricing',
  },
  {
    id: 'organization',
    actor: 'Établissement / Organisation',
    icon: 'BuildingOffice2Icon',
    tagline: 'La plateforme pour votre structure de santé',
    model: 'Plan de base + modules optionnels',
    highlight: 'SUR DEVIS',
    highlightColor: 'var(--shifa-purple)',
    gradient: 'linear-gradient(135deg, var(--shifa-purple) 0%, #5b3d8a 100%)',
    features: [
      'Tableau de bord organisation',
      'Gestion des professionnels & patients',
      'Modules activables (Labo, Pharma, Imagerie…)',
      'Facturation & finance',
      'Qualité & accréditation',
      'Interopérabilité FHIR/HL7',
    ],
    cta: 'Voir les plans Organisation',
    ctaHref: '/org-pricing',
  },
  {
    id: 'insurance',
    actor: 'Assurance / Mutuelle',
    icon: 'ShieldCheckIcon',
    tagline: 'Intégration assurance dans l\'écosystème SHIFA',
    model: 'Abonnement institutionnel',
    highlight: 'INSTITUTIONNEL',
    highlightColor: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #d97706 100%)',
    features: [
      'Gestion des membres & éligibilité',
      'Couverture & remboursements',
      'Pré-autorisations',
      'API usage & intégration',
      'Rapports & analytics',
      'Contrats personnalisés',
    ],
    cta: 'Contacter SHIFA',
    ctaHref: '/support-center',
  },
  {
    id: 'ministry',
    actor: 'Ministère / Autorité de santé',
    icon: 'BuildingLibraryIcon',
    tagline: 'Déploiement national de santé numérique',
    model: 'Contrat national personnalisé',
    highlight: 'B2G',
    highlightColor: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #b91c1c 100%)',
    features: [
      'Tableau de bord national',
      'Indicateurs de santé publique',
      'Surveillance épidémiologique',
      'Programmes de vaccination',
      'Déploiement multi-établissements',
      'SLA & support dédié',
    ],
    cta: 'Demander un devis national',
    ctaHref: '/support-center',
  },
  {
    id: 'university',
    actor: 'Université / Formation',
    icon: 'AcademicCapIcon',
    tagline: 'Formation médicale et recherche',
    model: 'Licence institutionnelle',
    highlight: 'ACADÉMIQUE',
    highlightColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    features: [
      'Accès Académie SHIFA',
      'Gestion des étudiants',
      'Stages & internats',
      'Datasets de recherche autorisés',
      'Rapports & analytics',
      'Contrat multi-campus',
    ],
    cta: 'Contacter SHIFA',
    ctaHref: '/support-center',
  },
  {
    id: 'ngo',
    actor: 'ONG / Partenaire santé',
    icon: 'HeartIcon',
    tagline: 'Santé humanitaire et programmes terrain',
    model: 'Partenariat personnalisé',
    highlight: 'PARTENARIAT',
    highlightColor: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    features: [
      'Tableau de bord programmes',
      'Gestion des bénéficiaires',
      'Équipes terrain',
      'Indicateurs de santé autorisés',
      'Rapports & analytics',
      'Accès humanitaire',
    ],
    cta: 'Contacter SHIFA',
    ctaHref: '/support-center',
  },
  {
    id: 'ambassador',
    actor: 'Ambassadeur SHIFA',
    icon: 'StarIcon',
    tagline: 'Développez l\'écosystème SHIFA',
    model: 'Programme de récompenses',
    highlight: 'PROGRAMME',
    highlightColor: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    features: [
      'Tableau de bord ambassadeur',
      'Liens de parrainage',
      'Suivi des conversions',
      'Récompenses & commissions',
      'Kit marketing SHIFA',
      'Formation & certification',
    ],
    cta: 'Devenir Ambassadeur',
    ctaHref: '/ambassador-workspace',
  },
];

const revenueStreams = [
  { icon: 'UserGroupIcon', label: 'Abonnements Pro', color: 'var(--shifa-blue)' },
  { icon: 'BuildingOffice2Icon', label: 'Abonnements Organisation', color: 'var(--shifa-purple)' },
  { icon: 'PuzzlePieceIcon', label: 'Modules Premium', color: '#8b5cf6' },
  { icon: 'VideoCameraIcon', label: 'Téléconsultation', color: '#06b6d4' },
  { icon: 'CreditCardIcon', label: 'Carte SHIFA Physique', color: '#F59E0B' },
  { icon: 'ShoppingBagIcon', label: 'Marketplace', color: '#10B981' },
  { icon: 'AcademicCapIcon', label: 'Académie', color: '#f97316' },
  { icon: 'CpuChipIcon', label: 'SHIFA AI', color: '#EF4444' },
  { icon: 'ArrowsRightLeftIcon', label: 'API / Interopérabilité', color: '#6366f1' },
  { icon: 'BuildingLibraryIcon', label: 'Contrats B2G', color: '#0891b2' },
  { icon: 'StarIcon', label: 'Programme Ambassadeur', color: '#f97316' },
  { icon: 'GlobeAltIcon', label: 'Intégrations Enterprise', color: '#059669' },
];

export default function PricingContent() {
  const [hoveredActor, setHoveredActor] = useState<string | null>(null);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
            PHASE 1 — SURFACE COMMERCIALE
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            PRIX CONFIGURABLES — NON FINALISÉS
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--shifa-dark)' }}>
          SHIFA Health OS — Modèle Commercial Global
        </h1>
        <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
          Plateforme de santé mondiale · B2C · B2B · B2B2C · B2G · Institutionnel · Marketplace · API
        </p>
      </div>

      {/* Core principle banner */}
      <div className="card-base p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Icon name="HeartIcon" className="w-6 h-6 text-white" />
        </div>
        <div className="text-white flex-1">
          <p className="font-bold text-lg">Le cœur patient SHIFA est GRATUIT</p>
          <p className="text-sm opacity-90 mt-0.5">Compte SHIFA · Identité numérique · Dossier de santé · Carte SHIFA numérique · Services de santé essentiels</p>
        </div>
        <Link href="/sign-up-login-screen"
          className="px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
          Créer un compte
        </Link>
      </div>

      {/* Actor grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Modèles commerciaux par acteur</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="card-base overflow-hidden cursor-pointer transition-all duration-200"
              style={{ transform: hoveredActor === actor.id ? 'translateY(-2px)' : 'none', boxShadow: hoveredActor === actor.id ? '0 8px 24px rgba(0,0,0,0.12)' : undefined }}
              onMouseEnter={() => setHoveredActor(actor.id)}
              onMouseLeave={() => setHoveredActor(null)}
            >
              {/* Card header */}
              <div className="p-4" style={{ background: actor.gradient }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Icon name={actor.icon} className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                    {actor.highlight}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm leading-tight">{actor.actor}</h3>
                <p className="text-[11px] text-white opacity-80 mt-0.5">{actor.tagline}</p>
              </div>

              {/* Card body */}
              <div className="p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: actor.highlightColor }}>{actor.model}</p>
                <ul className="space-y-1.5 mb-4">
                  {actor.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Icon name="CheckIcon" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: actor.highlightColor }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{f}</span>
                    </li>
                  ))}
                  {actor.features.length > 4 && (
                    <li className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      +{actor.features.length - 4} autres services…
                    </li>
                  )}
                </ul>
                <Link href={actor.ctaHref}
                  className="w-full block text-center text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: actor.gradient, color: 'white' }}>
                  {actor.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue streams */}
      <div className="card-base p-6 mb-8">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Sources de revenus SHIFA</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Modèle multi-flux · Devise locale · Référence EUR/USD · Configurable par pays</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {revenueStreams.map((stream, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stream.color}18` }}>
                <Icon name={stream.icon} className="w-5 h-5" style={{ color: stream.color }} />
              </div>
              <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--foreground)' }}>{stream.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global pricing principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card-base p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(0,102,255,0.1)' }}>
            <Icon name="GlobeAltIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shifa-dark)' }}>Devise locale = Devise de transaction</h3>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            10 000 KMF reste 10 000 KMF. EUR et USD sont des valeurs de référence, pas la devise de transaction par défaut.
          </p>
        </div>
        <div className="card-base p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Icon name="ArrowPathIcon" className="w-5 h-5" style={{ color: '#F59E0B' }} />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shifa-dark)' }}>Taux de change en temps réel</h3>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Chaque prix affiche la valeur locale + ≈ €xx · ≈ $xx (réf.). Intégration fournisseur de taux en Phase 3.
          </p>
        </div>
        <div className="card-base p-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <Icon name="AdjustmentsHorizontalIcon" className="w-5 h-5" style={{ color: '#10B981' }} />
          </div>
          <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shifa-dark)' }}>Tarification configurable par pays</h3>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Aucun prix final codé en dur. Chaque pays dispose de sa propre configuration tarifaire, fiscale et de paiement.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="card-base p-5">
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Interfaces commerciales disponibles</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Plans Professionnels', href: '/pro-pricing', color: 'var(--shifa-blue)' },
            { label: 'Plans Organisation', href: '/org-pricing', color: 'var(--shifa-purple)' },
            { label: 'Comparaison des plans', href: '/pricing-plans', color: '#8b5cf6' },
            { label: 'Gestion abonnement', href: '/subscription-management', color: '#F59E0B' },
            { label: 'Checkout', href: '/checkout', color: '#10B981' },
            { label: 'Espace Ambassadeur', href: '/ambassador-workspace', color: '#f97316' },
            { label: 'Marketplace', href: '/health-marketplace', color: '#06b6d4' },
            { label: 'Académie', href: '/shifa-academy', color: '#6366f1' },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: `${link.color}15`, color: link.color, border: `1px solid ${link.color}30` }}>
              {link.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
