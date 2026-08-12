'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'cases' | 'assessments' | 'resources' | 'referrals' | 'reports';

interface SocialCase {
  id: string;
  patient: string;
  age: number;
  situation: string;
  worker: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'closed' | 'referred';
  openDate: string;
  lastContact: string;
  issues: string[];
  actions: string[];
}

interface SocialAssessment {
  id: string;
  patient: string;
  date: string;
  worker: string;
  housing: 'stable' | 'precarious' | 'homeless';
  income: 'sufficient' | 'insufficient' | 'none';
  socialSupport: 'strong' | 'moderate' | 'isolated';
  insurance: boolean;
  vulnerabilityScore: number;
  recommendations: string[];
}

const socialCases: SocialCase[] = [
  { id: 'SC-001', patient: 'Aïcha Diallo', age: 45, situation: 'Mère isolée, 3 enfants, chômage', worker: 'AS. Koné', priority: 'urgent', status: 'active', openDate: '01 août', lastContact: 'Aujourd\'hui', issues: ['Précarité financière', 'Accès aux soins', 'Garde enfants'], actions: ['Dossier CMU', 'Contact CPAM', 'Aide alimentaire'] },
  { id: 'SC-002', patient: 'Oumar Diallo', age: 71, situation: 'Personne âgée seule, post-hospitalisation', worker: 'AS. Bah', priority: 'high', status: 'active', openDate: '05 août', lastContact: 'Hier', issues: ['Isolement social', 'Autonomie limitée', 'Logement inadapté'], actions: ['Évaluation APA', 'Aide à domicile', 'Portage repas'] },
  { id: 'SC-003', patient: 'Mariama Bah', age: 38, situation: 'Cancer — difficultés financières traitement', worker: 'AS. Koné', priority: 'high', status: 'active', openDate: '10 juil', lastContact: '10 août', issues: ['Financement traitement', 'Arrêt travail', 'Soutien psychologique'], actions: ['Dossier MDPH', 'Fonds solidarité', 'Assistante sociale CPAM'] },
  { id: 'SC-004', patient: 'Ibrahima Kouyaté', age: 55, situation: 'AVC — retour à domicile complexe', worker: 'AS. Bah', priority: 'urgent', status: 'active', openDate: '12 août', lastContact: 'Aujourd\'hui', issues: ['Accessibilité logement', 'Aidant familial', 'Reprise professionnelle'], actions: ['Visite domicile', 'Dossier MDPH', 'Contact employeur'] },
  { id: 'SC-005', patient: 'Fatoumata Camara', age: 29, situation: 'Grossesse précarité — sans couverture', worker: 'AS. Koné', priority: 'medium', status: 'active', openDate: '08 août', lastContact: '11 août', issues: ['Absence couverture maladie', 'Logement instable', 'Ressources insuffisantes'], actions: ['AME/CMU', 'CCAS', 'Hébergement d\'urgence'] },
  { id: 'SC-006', patient: 'Moussa Traoré', age: 62, situation: 'Insuffisance cardiaque — retour domicile', worker: 'AS. Bah', priority: 'medium', status: 'pending', openDate: '09 août', lastContact: '09 août', issues: ['Suivi médical régulier', 'Transport médicalisé', 'Médicaments coûteux'], actions: ['Transport sanitaire', 'Aide médicaments', 'Infirmière domicile'] },
];

const assessments: SocialAssessment[] = [
  { id: 'SA-001', patient: 'Aïcha Diallo', date: '01 août 2025', worker: 'AS. Koné', housing: 'precarious', income: 'insufficient', socialSupport: 'moderate', insurance: false, vulnerabilityScore: 78, recommendations: ['Ouverture droits CMU', 'Aide alimentaire CCAS', 'Médiation familiale'] },
  { id: 'SA-002', patient: 'Oumar Diallo', date: '05 août 2025', worker: 'AS. Bah', housing: 'stable', income: 'insufficient', socialSupport: 'isolated', insurance: true, vulnerabilityScore: 65, recommendations: ['Évaluation APA', 'Aide à domicile', 'Réseau de voisinage'] },
  { id: 'SA-003', patient: 'Ibrahima Kouyaté', date: '12 août 2025', worker: 'AS. Bah', housing: 'stable', income: 'sufficient', socialSupport: 'strong', insurance: true, vulnerabilityScore: 52, recommendations: ['Adaptation logement', 'Dossier MDPH', 'Congé aidant'] },
];

const resources = [
  { id: 'R-001', name: 'CCAS — Centre Communal d\'Action Sociale', type: 'Aide sociale', contact: '33 820 00 00', services: ['Aide alimentaire', 'Aide financière', 'Hébergement urgence'], availability: 'Lun-Ven 8h-17h' },
  { id: 'R-002', name: 'CPAM — Caisse Primaire Assurance Maladie', type: 'Couverture maladie', contact: '36 46', services: ['CMU-C', 'ACS', 'Invalidité', 'AT/MP'], availability: 'Lun-Ven 9h-17h' },
  { id: 'R-003', name: 'MDPH — Maison Départementale Personnes Handicapées', type: 'Handicap', contact: '33 821 00 00', services: ['AAH', 'PCH', 'RQTH', 'Orientation'], availability: 'Lun-Ven 9h-12h / 14h-17h' },
  { id: 'R-004', name: 'Croix-Rouge — Antenne locale', type: 'Humanitaire', contact: '33 822 00 00', services: ['Colis alimentaires', 'Vestiaire', 'Écoute'], availability: 'Mar-Jeu 10h-16h' },
  { id: 'R-005', name: 'SAMU Social', type: 'Urgence sociale', contact: '115', services: ['Hébergement urgence', 'Maraude', 'Orientation'], availability: '24h/24 — 7j/7' },
];

const referrals = [
  { id: 'REF-001', patient: 'Aïcha Diallo', from: 'AS. Koné', to: 'CCAS', reason: 'Aide alimentaire urgente + dossier CMU', date: '01 août', status: 'in_progress' },
  { id: 'REF-002', patient: 'Oumar Diallo', from: 'AS. Bah', to: 'Conseil Départemental — APA', reason: 'Évaluation allocation personnalisée autonomie', date: '05 août', status: 'pending' },
  { id: 'REF-003', patient: 'Mariama Bah', from: 'AS. Koné', to: 'MDPH', reason: 'Dossier invalidité — arrêt longue durée', date: '10 juil', status: 'completed' },
  { id: 'REF-004', patient: 'Fatoumata Camara', from: 'AS. Koné', to: 'CPAM', reason: 'Ouverture droits AME — grossesse', date: '08 août', status: 'in_progress' },
];

const casesByMonth = [
  { month: 'Mar', cases: 18 },
  { month: 'Avr', cases: 22 },
  { month: 'Mai', cases: 19 },
  { month: 'Juin', cases: 25 },
  { month: 'Juil', cases: 28 },
  { month: 'Août', cases: 24 },
];

const priorityConfig = {
  urgent: { bg: 'bg-red-50', text: 'text-red-700', label: 'Urgent' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Élevé' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moyen' },
  low: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Faible' },
};

const caseStatusConfig = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Actif' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Clôturé' },
  referred: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Orienté' },
};

const housingConfig = {
  stable: { label: 'Stable', color: '#10b981' },
  precarious: { label: 'Précaire', color: '#f59e0b' },
  homeless: { label: 'Sans domicile', color: '#ef4444' },
};

const incomeConfig = {
  sufficient: { label: 'Suffisant', color: '#10b981' },
  insufficient: { label: 'Insuffisant', color: '#f59e0b' },
  none: { label: 'Aucun', color: '#ef4444' },
};

const supportConfig = {
  strong: { label: 'Fort', color: '#10b981' },
  moderate: { label: 'Modéré', color: '#f59e0b' },
  isolated: { label: 'Isolé', color: '#ef4444' },
};

const refStatusConfig = {
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'En cours' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Finalisé' },
};

export default function SocialWorkContent() {
  const [activeTab, setActiveTab] = useState<Tab>('cases');
  const [selectedCase, setSelectedCase] = useState<SocialCase | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'cases', label: 'Dossiers sociaux', icon: 'FolderOpenIcon' },
    { id: 'assessments', label: 'Évaluations sociales', icon: 'ClipboardDocumentListIcon' },
    { id: 'resources', label: 'Ressources & Partenaires', icon: 'BuildingOffice2Icon' },
    { id: 'referrals', label: 'Orientations', icon: 'ArrowsRightLeftIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <Icon name="UsersIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Travail Social & Accompagnement</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Dossiers sociaux, évaluations et orientations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            {[
              { label: 'Dossiers actifs', value: '24', color: '#8b5cf6' },
              { label: 'Urgences', value: '3', color: '#ef4444' },
              { label: 'Orientations en cours', value: '8', color: '#3b82f6' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors"
            style={{ borderBottomColor: activeTab === tab.id ? '#8b5cf6' : 'transparent', color: activeTab === tab.id ? '#8b5cf6' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* CASES TAB */}
        {activeTab === 'cases' && (
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {socialCases.map(sc => {
                const priCfg = priorityConfig[sc.priority];
                const stCfg = caseStatusConfig[sc.status];
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedCase(sc)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCase?.id === sc.id ? 'ring-2 ring-purple-400' : 'hover:shadow-sm'}`}
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                          {sc.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{sc.patient}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sc.age} ans — {sc.situation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priCfg.bg} ${priCfg.text}`}>{priCfg.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stCfg.bg} ${stCfg.text}`}>{stCfg.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Problématiques</p>
                        <div className="flex flex-wrap gap-1">
                          {sc.issues.map(i => <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700">{i}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Actions en cours</p>
                        <div className="flex flex-wrap gap-1">
                          {sc.actions.map(a => <span key={a} className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">{a}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Ouvert le {sc.openDate} — {sc.worker}</span>
                      <span>Dernier contact : {sc.lastContact}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedCase && (
              <div className="w-80 shrink-0 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Détail dossier</h3>
                  <button onClick={() => setSelectedCase(null)}><Icon name="XMarkIcon" size={16} style={{ color: 'var(--muted-foreground)' }} /></button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                    {selectedCase.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedCase.patient}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedCase.age} ans</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedCase.worker}</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Situation</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedCase.situation}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Problématiques identifiées</p>
                  <div className="space-y-1">
                    {selectedCase.issues.map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Actions engagées</p>
                  <div className="space-y-1">
                    {selectedCase.actions.map(a => (
                      <div key={a} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>Ajouter action</button>
                  <button className="w-full py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Orienter vers partenaire</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Évaluations sociales</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                <Icon name="PlusIcon" size={16} />
                Nouvelle évaluation
              </button>
            </div>
            {assessments.map(a => (
              <div key={a.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{a.date} — {a.worker}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: a.vulnerabilityScore >= 70 ? '#ef4444' : a.vulnerabilityScore >= 50 ? '#f59e0b' : '#10b981' }}>{a.vulnerabilityScore}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score vulnérabilité</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Logement', value: housingConfig[a.housing].label, color: housingConfig[a.housing].color },
                    { label: 'Revenus', value: incomeConfig[a.income].label, color: incomeConfig[a.income].color },
                    { label: 'Soutien social', value: supportConfig[a.socialSupport].label, color: supportConfig[a.socialSupport].color },
                    { label: 'Couverture', value: a.insurance ? 'Assurée' : 'Non assurée', color: a.insurance ? '#10b981' : '#ef4444' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Recommandations</p>
                  <div className="flex flex-wrap gap-1">
                    {a.recommendations.map(r => <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{r}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Ressources & Partenaires sociaux</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                <Icon name="PlusIcon" size={16} />
                Ajouter partenaire
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {resources.map(r => (
                <div key={r.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{r.contact}</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Services</p>
                    <div className="flex flex-wrap gap-1">
                      {r.services.map(s => <span key={s} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>{s}</span>)}
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponibilité : {r.availability}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERRALS TAB */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Orientations vers partenaires</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                <Icon name="PlusIcon" size={16} />
                Nouvelle orientation
              </button>
            </div>
            {referrals.map(ref => {
              const cfg = refStatusConfig[ref.status as keyof typeof refStatusConfig];
              return (
                <div key={ref.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{ref.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{ref.from} → {ref.to}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>{ref.reason}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Date : {ref.date}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports & Statistiques</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Dossiers actifs', value: '24', color: '#8b5cf6' },
                { label: 'Évaluations ce mois', value: '18', color: '#3b82f6' },
                { label: 'Orientations réussies', value: '12', color: '#10b981' },
                { label: 'Taux résolution', value: '68%', color: '#f59e0b' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution des dossiers ouverts</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={casesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Dossiers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
