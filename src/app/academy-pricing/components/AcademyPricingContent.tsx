'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


const COURSE_TIERS = [
  {
    id: 'free', label: 'Contenu Gratuit', color: '#16a34a', bg: '#f0fdf4',
    description: 'Accès libre pour tous les utilisateurs SHIFA',
    items: ['Modules de prévention santé', 'Guides patients', 'Webinaires publics', 'Articles santé communautaire', 'Tutoriels plateforme'],
    revenue: 'Aucun — Acquisition & fidélisation',
  },
  {
    id: 'premium', label: 'Cours Premium', color: '#2563eb', bg: '#eff6ff',
    description: 'Achat à l\'unité ou abonnement mensuel/annuel',
    items: ['Formations cliniques avancées', 'Protocoles spécialisés', 'Cas cliniques interactifs', 'Simulations diagnostiques', 'Accès instructeurs experts'],
    revenue: 'Prix configurable par cours ou abonnement',
  },
  {
    id: 'certification', label: 'Certifications', color: '#7c3aed', bg: '#f5f3ff',
    description: 'Programmes certifiants avec évaluation officielle',
    items: ['Certification SHIFA Academy', 'Examens supervisés', 'Badge numérique vérifiable', 'Reconnaissance institutionnelle', 'CPD/CME crédits (selon pays)'],
    revenue: 'Frais de certification configurables',
  },
  {
    id: 'institutional', label: 'Licences Institutionnelles', color: '#d97706', bg: '#fffbeb',
    description: 'Accès groupé pour hôpitaux, universités, ministères',
    items: ['Licences multi-utilisateurs', 'Tableau de bord RH/formation', 'Contenu personnalisé', 'Rapports de progression', 'Intégration LMS existant'],
    revenue: 'Contrat institutionnel — sur devis',
  },
];

const REVENUE_FLOWS = [
  { actor: 'Apprenant', flow: 'Paye cours / abonnement / certification', direction: 'out', currency: 'Local' },
  { actor: 'SHIFA Academy', flow: 'Reçoit frais plateforme + commission', direction: 'in', currency: 'Local' },
  { actor: 'Instructeur', flow: 'Reçoit part du revenu cours (configurable)', direction: 'in', currency: 'Local' },
  { actor: 'Institution', flow: 'Paye licence groupée annuelle', direction: 'out', currency: 'Local' },
  { actor: 'Université partenaire', flow: 'Reçoit frais de co-certification', direction: 'in', currency: 'Local' },
];

const SAMPLE_COURSES = [
  { title: 'Diabète & Nutrition — Protocoles 2026', type: 'Premium', instructor: 'Dr. Aminata Diallo', duration: '6h', enrolled: 342, price: null, currency: 'XOF' },
  { title: 'Téléconsultation : bonnes pratiques', type: 'Gratuit', instructor: 'SHIFA Academy', duration: '2h', enrolled: 1240, price: 0, currency: 'XOF' },
  { title: 'Certification Urgences Pédiatriques', type: 'Certification', instructor: 'Dr. Ibrahima Sow', duration: '12h', enrolled: 89, price: null, currency: 'MAD' },
  { title: 'Gestion hospitalière avancée', type: 'Institutionnel', instructor: 'SHIFA Pro', duration: '20h', enrolled: 56, price: null, currency: 'EUR' },
];

const typeColor: Record<string, { bg: string; text: string }> = {
  Gratuit: { bg: '#dcfce7', text: '#16a34a' },
  Premium: { bg: '#dbeafe', text: '#2563eb' },
  Certification: { bg: '#ede9fe', text: '#7c3aed' },
  Institutionnel: { bg: '#fef9c3', text: '#ca8a04' },
};

export default function AcademyPricingContent() {
  const [tab, setTab] = useState<'tiers' | 'courses' | 'revenue'>('tiers');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>SHIFA Academy — Tarification</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Contenu gratuit, cours premium, certifications, licences institutionnelles et flux de revenus</p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <Icon name="AcademicCapIcon" size={14} />
          Phase 1 — Structure commerciale
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cours disponibles', value: '4+', icon: 'BookOpenIcon', color: '#2563eb' },
          { label: 'Apprenants (démo)', value: '1 727', icon: 'UsersIcon', color: '#16a34a' },
          { label: 'Certifications', value: '—', icon: 'ShieldCheckIcon', color: '#7c3aed' },
          { label: 'Licences instit.', value: '—', icon: 'BuildingLibraryIcon', color: '#d97706' },
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
        {(['tiers', 'courses', 'revenue'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: tab === t ? 'var(--shifa-blue)' : 'transparent', color: tab === t ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            {{ tiers: 'Niveaux d\'accès', courses: 'Catalogue cours', revenue: 'Flux de revenus' }[t]}
          </button>
        ))}
      </div>

      {tab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSE_TIERS.map(tier => (
            <div key={tier.id} className="rounded-xl border p-5" style={{ background: tier.bg, borderColor: tier.color + '33' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: tier.color + '22' }}>
                  <Icon name="AcademicCapIcon" size={18} style={{ color: tier.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: tier.color }}>{tier.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tier.description}</p>
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                {tier.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                    <Icon name="CheckIcon" size={11} style={{ color: tier.color }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg px-3 py-2 text-xs font-medium" style={{ background: tier.color + '18', color: tier.color }}>
                Revenu : {tier.revenue}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'courses' && (
        <div className="space-y-3">
          {SAMPLE_COURSES.map((course, i) => {
            const tc = typeColor[course.type] || { bg: '#f1f5f9', text: '#64748b' };
            return (
              <div key={i} className="rounded-xl border p-4 flex flex-wrap items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: tc.bg, color: tc.text }}>{course.type}</span>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{course.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{course.instructor} · {course.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{course.enrolled} inscrits</p>
                  {course.price === 0 ? (
                    <p className="font-bold text-sm" style={{ color: '#16a34a' }}>Gratuit</p>
                  ) : (
                    <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Prix configurable</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'revenue' && (
        <div className="space-y-3">
          <div className="rounded-xl border p-4" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <p className="text-xs font-medium mb-1" style={{ color: '#92400e' }}>Note Phase 1</p>
            <p className="text-xs" style={{ color: '#92400e' }}>Les prix des cours, les parts instructeurs et les frais de certification sont configurables. Aucun prix final n'est défini dans cette phase.</p>
          </div>
          {REVENUE_FLOWS.map((flow, i) => (
            <div key={i} className="rounded-xl border p-4 flex items-center gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: flow.direction === 'in' ? '#dcfce7' : '#fee2e2' }}>
                <Icon name={flow.direction === 'in' ? 'ArrowDownIcon' : 'ArrowUpIcon'} size={16} style={{ color: flow.direction === 'in' ? '#16a34a' : '#dc2626' }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{flow.actor}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{flow.flow}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                Devise : {flow.currency}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
