'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import SmartAmount from '@/components/ui/SmartAmount';

type FacilityType = 'clinic' | 'lab' | 'pharmacy' | 'imaging' | 'health_center' | 'hospital' | 'enterprise';

interface OrgPlan {
  id: FacilityType;
  name: string;
  icon: string;
  tagline: string;
  priceNote: string;
  color: string;
  gradient: string;
  includedModules: string[];
  optionalModules: string[];
  pricingFactors: string[];
}

const orgPlans: OrgPlan[] = [
  {
    id: 'clinic',
    name: 'Cabinet / Clinique',
    icon: 'BuildingOfficeIcon',
    tagline: 'Pour les cabinets médicaux et petites cliniques',
    priceNote: 'À configurer',
    color: 'var(--shifa-blue)',
    gradient: 'linear-gradient(135deg, var(--shifa-blue), #0044cc)',
    includedModules: ['Tableau de bord', 'Gestion des professionnels', 'Agenda', 'Consultations', 'Messagerie', 'Facturation basique'],
    optionalModules: ['Téléconsultation', 'SHIFA AI', 'Prescriptions numériques', 'Résultats en ligne'],
    pricingFactors: ['Nombre de professionnels', 'Nombre de patients actifs', 'Modules activés', 'Pays / devise'],
  },
  {
    id: 'lab',
    name: 'Laboratoire',
    icon: 'BeakerIcon',
    tagline: 'Pour les laboratoires d\'analyses médicales',
    priceNote: 'À configurer',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    includedModules: ['Tableau de bord labo', 'Gestion des demandes', 'Prélèvements', 'Résultats & validation', 'Rapports qualité'],
    optionalModules: ['Contrôle qualité avancé', 'Gestion des réactifs', 'Équipements & maintenance', 'Facturation avancée', 'Interopérabilité HL7'],
    pricingFactors: ['Volume d\'analyses', 'Nombre de techniciens', 'Modules qualité', 'Pays / devise'],
  },
  {
    id: 'pharmacy',
    name: 'Pharmacie',
    icon: 'ArchiveBoxIcon',
    tagline: 'Pour les officines et pharmacies hospitalières',
    priceNote: 'À configurer',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    includedModules: ['Tableau de bord pharmacie', 'Gestion des prescriptions', 'Dispensation', 'Inventaire basique', 'Alertes péremption'],
    optionalModules: ['Gestion des lots', 'Commandes fournisseurs', 'Facturation avancée', 'Interopérabilité', 'Rapports avancés'],
    pricingFactors: ['Volume de dispensation', 'Nombre de pharmaciens', 'Modules activés', 'Pays / devise'],
  },
  {
    id: 'imaging',
    name: 'Centre d\'Imagerie',
    icon: 'PhotoIcon',
    tagline: 'Pour les centres de radiologie et imagerie médicale',
    priceNote: 'À configurer',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    includedModules: ['Tableau de bord imagerie', 'Worklist', 'Rapports radiologiques', 'Gestion des examens', 'Facturation'],
    optionalModules: ['DICOM viewer', 'Intégration PACS', 'Télé-radiologie', 'IA imagerie', 'Interopérabilité DICOM'],
    pricingFactors: ['Volume d\'examens', 'Nombre de radiologues', 'Modules DICOM', 'Pays / devise'],
  },
  {
    id: 'health_center',
    name: 'Centre de Santé',
    icon: 'BuildingOffice2Icon',
    tagline: 'Pour les centres de santé communautaires',
    priceNote: 'À configurer',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #d97706)',
    includedModules: ['Tableau de bord', 'Consultations', 'Vaccination', 'Prévention', 'Gestion des patients', 'Rapports santé publique'],
    optionalModules: ['Labo basique', 'Pharmacie basique', 'Téléconsultation', 'Maternité', 'Pédiatrie'],
    pricingFactors: ['Population desservie', 'Nombre de professionnels', 'Modules activés', 'Pays / devise'],
  },
  {
    id: 'hospital',
    name: 'Hôpital',
    icon: 'BuildingOffice2Icon',
    tagline: 'Pour les hôpitaux et établissements de soins complets',
    priceNote: 'À configurer',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444, #b91c1c)',
    includedModules: ['Tableau de bord hôpital', 'Admissions', 'Hospitalisation', 'Urgences', 'Consultations', 'Labo', 'Pharmacie', 'Imagerie', 'Finance'],
    optionalModules: ['Bloc opératoire', 'Maternité', 'Pédiatrie', 'Réanimation', 'RH avancé', 'Biomédical', 'Qualité & accréditation', 'Interopérabilité FHIR'],
    pricingFactors: ['Nombre de lits', 'Nombre de professionnels', 'Modules activés', 'Nombre de sites', 'Pays / devise'],
  },
  {
    id: 'enterprise',
    name: 'Réseau / Enterprise',
    icon: 'BuildingLibraryIcon',
    tagline: 'Pour les réseaux de santé et groupes hospitaliers',
    priceNote: 'Sur devis',
    color: '#0A1B3D',
    gradient: 'linear-gradient(135deg, #0A1B3D, #1e3a6e)',
    includedModules: ['Tous les modules hôpital', 'Multi-établissements', 'Tableau de bord réseau', 'Analytics avancés', 'API & interopérabilité', 'SLA dédié'],
    optionalModules: ['Déploiement national', 'Intégration assurance', 'Modules B2G', 'Support 24/7', 'Formation dédiée'],
    pricingFactors: ['Nombre d\'établissements', 'Nombre total de professionnels', 'Périmètre géographique', 'Contrat personnalisé'],
  },
];

const allModules = [
  { name: 'Laboratoire', icon: 'BeakerIcon', category: 'Clinique' },
  { name: 'Pharmacie', icon: 'ArchiveBoxIcon', category: 'Clinique' },
  { name: 'Imagerie', icon: 'PhotoIcon', category: 'Clinique' },
  { name: 'Urgences', icon: 'BoltIcon', category: 'Clinique' },
  { name: 'Maternité', icon: 'HeartIcon', category: 'Clinique' },
  { name: 'Pédiatrie', icon: 'StarIcon', category: 'Clinique' },
  { name: 'Bloc opératoire', icon: 'ScissorsIcon', category: 'Clinique' },
  { name: 'Finance & Facturation', icon: 'BanknotesIcon', category: 'Gestion' },
  { name: 'RH & Personnel', icon: 'UsersIcon', category: 'Gestion' },
  { name: 'Inventaire', icon: 'ArchiveBoxIcon', category: 'Gestion' },
  { name: 'Qualité & Accréditation', icon: 'ShieldCheckIcon', category: 'Gestion' },
  { name: 'Biomédical', icon: 'CpuChipIcon', category: 'Gestion' },
  { name: 'SHIFA AI', icon: 'SparklesIcon', category: 'Avancé' },
  { name: 'Téléconsultation', icon: 'VideoCameraIcon', category: 'Avancé' },
  { name: 'Interopérabilité FHIR/HL7', icon: 'ArrowsRightLeftIcon', category: 'Avancé' },
  { name: 'API & Webhooks', icon: 'CodeBracketIcon', category: 'Avancé' },
];

export default function OrgPricingContent() {
  const [selectedFacility, setSelectedFacility] = useState<FacilityType>('hospital');
  const [activeTab, setActiveTab] = useState<'plans' | 'modules' | 'factors'>('plans');

  const selectedPlan = orgPlans.find(p => p.id === selectedFacility)!;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(123,94,167,0.1)', color: 'var(--shifa-purple)' }}>
            ÉTABLISSEMENTS & ORGANISATIONS
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
            PRIX CONFIGURABLES
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Plans Organisation SHIFA</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Plan de base + modules optionnels · Tarification par type d'établissement, pays et usage
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'var(--muted)' }}>
        {(['plans', 'modules', 'factors'] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={activeTab === t ? { background: 'var(--shifa-dark)', color: 'white' } : { color: 'var(--muted-foreground)' }}>
            {t === 'plans' ? 'Plans par type' : t === 'modules' ? 'Catalogue modules' : 'Facteurs de prix'}
          </button>
        ))}
      </div>

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facility selector */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Type d'établissement</h3>
            <div className="space-y-2">
              {orgPlans.map((plan) => (
                <button key={plan.id}
                  onClick={() => setSelectedFacility(plan.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                  style={{
                    background: selectedFacility === plan.id ? `${plan.color}12` : 'var(--card)',
                    border: selectedFacility === plan.id ? `2px solid ${plan.color}` : '2px solid var(--border)',
                  }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: plan.gradient }}>
                    <Icon name={plan.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: selectedFacility === plan.id ? plan.color : 'var(--foreground)' }}>{plan.name}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--muted-foreground)' }}>{plan.priceNote}</p>
                  </div>
                  {selectedFacility === plan.id && <Icon name="ChevronRightIcon" className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Plan detail */}
          <div className="lg:col-span-2">
            <div className="card-base overflow-hidden">
              <div className="p-6" style={{ background: selectedPlan.gradient }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Icon name={selectedPlan.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPlan.name}</h2>
                    <p className="text-sm text-white opacity-80">{selectedPlan.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{selectedPlan.priceNote}</span>
                  {selectedPlan.priceNote !== 'Sur devis' && (
                    <span className="text-xs text-white opacity-70">/ mois · par pays · configurable</span>
                  )}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included modules */}
                <div>
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: '#10B981' }}>
                    <Icon name="CheckCircleIcon" className="w-4 h-4" />
                    Modules inclus
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedPlan.includedModules.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="CheckIcon" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10B981' }} />
                        <span className="text-xs" style={{ color: 'var(--foreground)' }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional modules */}
                <div>
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--shifa-blue)' }}>
                    <Icon name="PuzzlePieceIcon" className="w-4 h-4" />
                    Modules optionnels
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedPlan.optionalModules.map((m, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Icon name="PlusCircleIcon" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />
                        <span className="text-xs" style={{ color: 'var(--foreground)' }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing factors */}
                <div className="sm:col-span-2">
                  <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: '#F59E0B' }}>
                    <Icon name="AdjustmentsHorizontalIcon" className="w-4 h-4" />
                    Facteurs de tarification
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.pricingFactors.map((f, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Currency example */}
              <div className="px-6 pb-4">
                <div className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Exemple d'affichage tarifaire (montants illustratifs)</p>
                  <div className="flex flex-wrap gap-4">
                    <SmartAmount amount={50000} currency="KMF" size="sm" />
                    <SmartAmount amount={2500} currency="MAD" size="sm" />
                    <SmartAmount amount={299} currency="EUR" size="sm" />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                {selectedPlan.priceNote === 'Sur devis' ? (
                  <Link href="/support-center" className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: selectedPlan.gradient, color: 'white' }}>
                    Demander un devis
                  </Link>
                ) : (
                  <Link href="/checkout" className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: selectedPlan.gradient, color: 'white' }}>
                    Souscrire à ce plan
                  </Link>
                )}
                <Link href="/pricing-plans" className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  Comparer les plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div>
          <div className="mb-4">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Les modules SHIFA sont activables selon le type d'organisation, le pays, l'abonnement et les autorisations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allModules.map((m, i) => (
              <div key={i} className="card-base p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.1)' }}>
                    <Icon name={m.icon} className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{m.category}</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{m.name}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--muted-foreground)' }}>Activable selon plan & pays</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'factors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: 'Type d\'organisation', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)', items: ['Cabinet / Clinique', 'Laboratoire', 'Pharmacie', 'Centre d\'imagerie', 'Centre de santé', 'Hôpital', 'Réseau / Enterprise'] },
            { title: 'Facteurs d\'usage', icon: 'ChartBarIcon', color: '#10B981', items: ['Nombre de professionnels', 'Nombre de patients actifs', 'Volume de transactions', 'Nombre d\'établissements', 'Nombre de lits (hôpital)'] },
            { title: 'Modules activés', icon: 'PuzzlePieceIcon', color: '#8b5cf6', items: ['Modules inclus dans le plan', 'Modules optionnels activés', 'Modules premium', 'Modules enterprise', 'Modules pays-spécifiques'] },
            { title: 'Contexte pays', icon: 'GlobeAltIcon', color: '#F59E0B', items: ['Pays / territoire', 'Devise locale', 'Pouvoir d\'achat local', 'Fiscalité applicable', 'Méthodes de paiement disponibles', 'Réglementation locale'] },
          ].map((section, i) => (
            <div key={i} className="card-base p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${section.color}15` }}>
                  <Icon name={section.icon} className="w-4 h-4" style={{ color: section.color }} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{section.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: section.color }} />
                    <span className="text-xs" style={{ color: 'var(--foreground)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
