'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'dashboard' | 'campagnes' | 'entretiens' | 'formulaire' | 'analytics';

interface Campaign {
  id: string;
  name: string;
  year: number;
  status: 'active' | 'draft' | 'closed';
  total: number;
  completed: number;
  deadline: string;
}

interface Review {
  id: string;
  employee: string;
  role: string;
  department: string;
  manager: string;
  status: 'pending' | 'scheduled' | 'completed' | 'validated';
  date: string | null;
  score: number | null;
  initials: string;
  color: string;
}

const campaigns: Campaign[] = [
  { id: 'c1', name: 'Entretiens annuels 2026', year: 2026, status: 'active', total: 48, completed: 31, deadline: '30 sept. 2026' },
  { id: 'c2', name: 'Entretiens annuels 2025', year: 2025, status: 'closed', total: 45, completed: 45, deadline: '30 sept. 2025' },
  { id: 'c3', name: 'Entretiens mi-parcours 2026', year: 2026, status: 'draft', total: 48, completed: 0, deadline: '15 mars 2026' },
];

const reviews: Review[] = [
  { id: 'r1', employee: 'Dr. Mohamed Sy', role: 'Médecin généraliste', department: 'Médecine générale', manager: 'Dr. Kofi Diallo', status: 'completed', date: '05 août 2026', score: 87, initials: 'MS', color: '#0878EF' },
  { id: 'r2', employee: 'Awa Ndiaye', role: 'Infirmière chef', department: 'Urgences', manager: 'Dr. Aminata Sow', status: 'scheduled', date: '20 août 2026', score: null, initials: 'AN', color: '#059669' },
  { id: 'r3', employee: 'Dr. Fatou Sarr', role: 'Gynécologue', department: 'Gynécologie', manager: 'Dr. Kofi Diallo', status: 'pending', date: null, score: null, initials: 'FS', color: '#7c3aed' },
  { id: 'r4', employee: 'Ibrahima Diop', role: 'Pharmacien', department: 'Pharmacie', manager: 'Dr. Aminata Sow', status: 'validated', date: '01 août 2026', score: 92, initials: 'ID', color: '#d97706' },
  { id: 'r5', employee: 'Mariama Balde', role: 'Sage-femme', department: 'Maternité', manager: 'Dr. Fatou Traoré', status: 'completed', date: '10 août 2026', score: 79, initials: 'MB', color: '#ec4899' },
  { id: 'r6', employee: 'Dr. Jean Kouassi', role: 'Cardiologue', department: 'Cardiologie', manager: 'Dr. Kofi Diallo', status: 'pending', date: null, score: null, initials: 'JK', color: '#0ea5e9' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'En attente', bg: 'rgba(107,114,128,0.1)', text: '#6b7280' },
  scheduled: { label: 'Planifié', bg: 'rgba(245,158,11,0.1)', text: '#d97706' },
  completed: { label: 'Réalisé', bg: 'rgba(8,120,239,0.1)', text: '#0878EF' },
  validated: { label: 'Validé', bg: 'rgba(5,150,105,0.1)', text: '#059669' },
};

const formSections = [
  {
    id: 'fs1',
    title: 'Bilan de l\'année écoulée',
    questions: [
      { id: 'q1', label: 'Objectifs fixés l\'année dernière', type: 'textarea', placeholder: 'Décrivez les objectifs définis lors du dernier entretien...' },
      { id: 'q2', label: 'Niveau d\'atteinte des objectifs', type: 'rating', max: 5 },
      { id: 'q3', label: 'Réalisations marquantes', type: 'textarea', placeholder: 'Quelles ont été vos principales réalisations ?' },
    ],
  },
  {
    id: 'fs2',
    title: 'Compétences & développement',
    questions: [
      { id: 'q4', label: 'Compétences techniques', type: 'rating', max: 5 },
      { id: 'q5', label: 'Compétences relationnelles', type: 'rating', max: 5 },
      { id: 'q6', label: 'Besoins en formation identifiés', type: 'textarea', placeholder: 'Quelles formations souhaiteriez-vous suivre ?' },
    ],
  },
  {
    id: 'fs3',
    title: 'Objectifs pour l\'année à venir',
    questions: [
      { id: 'q7', label: 'Objectifs professionnels 2027', type: 'textarea', placeholder: 'Définissez vos objectifs pour la prochaine période...' },
      { id: 'q8', label: 'Projets d\'évolution', type: 'textarea', placeholder: 'Avez-vous des aspirations d\'évolution de carrière ?' },
    ],
  },
];

export default function EntretiensAnnuelsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('c1');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'ChartBarIcon' },
    { key: 'campagnes', label: 'Campagnes', icon: 'CalendarDaysIcon' },
    { key: 'entretiens', label: 'Entretiens', icon: 'ClipboardDocumentListIcon' },
    { key: 'formulaire', label: 'Formulaire', icon: 'DocumentTextIcon' },
    { key: 'analytics', label: 'Analytique', icon: 'PresentationChartLineIcon' },
  ];

  const activeCampaign = campaigns.find(c => c.id === selectedCampaign) || campaigns[0];
  const filteredReviews = reviews.filter(r => statusFilter === 'all' || r.status === statusFilter);

  const kpis = [
    { label: 'Entretiens réalisés', value: `${activeCampaign.completed}/${activeCampaign.total}`, icon: 'ClipboardDocumentCheckIcon', color: '#0878EF', gradient: ['#0878EF', '#38B6FF'], trend: `${Math.round((activeCampaign.completed / activeCampaign.total) * 100)}%`, trendUp: true },
    { label: 'En attente', value: `${reviews.filter(r => r.status === 'pending').length}`, icon: 'ClockIcon', color: '#d97706', gradient: ['#d97706', '#FCD34D'], trend: '-3 vs sem.', trendUp: false },
    { label: 'Score moyen', value: '84/100', icon: 'StarIcon', color: '#059669', gradient: ['#059669', '#34D399'], trend: '+2 pts', trendUp: true },
    { label: 'Taux de complétion', value: `${Math.round((activeCampaign.completed / activeCampaign.total) * 100)}%`, icon: 'ChartBarIcon', color: '#7c3aed', gradient: ['#7c3aed', '#A78BFA'], trend: 'Objectif: 100%', trendUp: true },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-5 flex items-start justify-between gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #0878EF, #7c3aed)' }}
          >
            <Icon name="UserGroupIcon" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Entretiens professionnels annuels
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Gestion des campagnes d'évaluation · Suivi des performances · Développement RH
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <Icon name="ArrowDownTrayIcon" size={14} />
            Exporter
          </button>
          <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Icon name="PlusIcon" size={14} />
            Nouvelle campagne
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
                color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Campaign selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Campagne :</span>
              {campaigns.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCampaign(c.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: selectedCampaign === c.id ? 'var(--shifa-blue)' : 'var(--card)',
                    color: selectedCampaign === c.id ? 'white' : 'var(--muted-foreground)',
                    borderColor: selectedCampaign === c.id ? 'var(--shifa-blue)' : 'var(--border)',
                  }}
                >
                  {c.name}
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs" style={{
                    backgroundColor: c.status === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    color: selectedCampaign === c.id ? 'white' : 'var(--muted-foreground)',
                  }}>
                    {c.status === 'active' ? 'Active' : c.status === 'closed' ? 'Clôturée' : 'Brouillon'}
                  </span>
                </button>
              ))}
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 12px rgba(8,120,239,0.06)',
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${kpi.gradient[0]}, ${kpi.gradient[1]})` }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${kpi.gradient[0]}18, ${kpi.gradient[1]}10)`, border: `1.5px solid ${kpi.gradient[0]}20` }}>
                    <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as any} className="" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{kpi.value}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full self-start" style={{ backgroundColor: kpi.trendUp ? 'rgba(5,150,105,0.1)' : `${kpi.color}15`, border: `1px solid ${kpi.trendUp ? 'rgba(5,150,105,0.2)' : kpi.color + '25'}` }}>
                    <Icon name={kpi.trendUp ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'} size={10} style={{ color: kpi.trendUp ? '#059669' : kpi.color } as any} className="" />
                    <span className="font-semibold" style={{ color: kpi.trendUp ? '#059669' : kpi.color, fontSize: '10px' }}>{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="card-base">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Avancement — {activeCampaign.name}</h3>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Échéance : {activeCampaign.deadline}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.round((activeCampaign.completed / activeCampaign.total) * 100)}%`,
                    background: 'linear-gradient(90deg, var(--shifa-blue), #7c3aed)',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{activeCampaign.completed} entretiens réalisés</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{activeCampaign.total - activeCampaign.completed} restants</span>
              </div>
            </div>

            {/* Recent reviews */}
            <div className="card-base">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Entretiens récents</h3>
                <button onClick={() => setActiveTab('entretiens')} className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>Voir tous →</button>
              </div>
              <div className="flex flex-col gap-2">
                {reviews.slice(0, 4).map(r => {
                  const sc = statusConfig[r.status];
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-shifa cursor-pointer" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}99)` }}>
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{r.employee}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.role} · {r.department}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {r.score !== null && (
                          <span className="text-sm font-bold" style={{ color: r.score >= 80 ? 'var(--shifa-green)' : r.score >= 60 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>
                            {r.score}/100
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CAMPAGNES */}
        {activeTab === 'campagnes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Campagnes d'entretiens</h2>
              <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Icon name="PlusIcon" size={14} />
                Créer une campagne
              </button>
            </div>
            {campaigns.map(c => (
              <div key={c.id} className="card-base">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{c.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Échéance : {c.deadline} · {c.total} collaborateurs</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{
                    backgroundColor: c.status === 'active' ? 'rgba(5,150,105,0.1)' : c.status === 'closed' ? 'rgba(107,114,128,0.1)' : 'rgba(245,158,11,0.1)',
                    color: c.status === 'active' ? '#059669' : c.status === 'closed' ? '#6b7280' : '#d97706',
                  }}>
                    {c.status === 'active' ? 'Active' : c.status === 'closed' ? 'Clôturée' : 'Brouillon'}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--muted)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((c.completed / c.total) * 100)}%`,
                      background: c.status === 'closed' ? '#059669' : 'linear-gradient(90deg, var(--shifa-blue), #7c3aed)',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.completed}/{c.total} entretiens réalisés</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{Math.round((c.completed / c.total) * 100)}%</span>
                </div>
                {c.status !== 'closed' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <Icon name="PlayIcon" size={12} />
                      {c.status === 'draft' ? 'Lancer la campagne' : 'Gérer'}
                    </button>
                    <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <Icon name="PencilSquareIcon" size={12} />
                      Modifier
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ENTRETIENS */}
        {activeTab === 'entretiens' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Liste des entretiens — {activeCampaign.name}</h2>
              <div className="flex items-center gap-2">
                {['all', 'pending', 'scheduled', 'completed', 'validated'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: statusFilter === s ? 'var(--shifa-blue)' : 'var(--muted)',
                      color: statusFilter === s ? 'white' : 'var(--muted-foreground)',
                    }}
                  >
                    {s === 'all' ? 'Tous' : statusConfig[s]?.label || s}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-base overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                      {['Collaborateur', 'Poste', 'Responsable', 'Date', 'Score', 'Statut', 'Actions'].map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map((r, idx) => {
                      const sc = statusConfig[r.status];
                      return (
                        <tr key={r.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.color}99)` }}>
                                {r.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.employee}</p>
                                <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{r.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.role}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.manager}</td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date || '—'}</td>
                          <td className="px-4 py-3">
                            {r.score !== null ? (
                              <span className="font-bold text-sm" style={{ color: r.score >= 80 ? 'var(--shifa-green)' : r.score >= 60 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>
                                {r.score}/100
                              </span>
                            ) : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setActiveTab('formulaire')}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Ouvrir le formulaire"
                              >
                                <Icon name="DocumentTextIcon" size={14} className="text-muted-foreground" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Planifier">
                                <Icon name="CalendarIcon" size={14} className="text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FORMULAIRE */}
        {activeTab === 'formulaire' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Form header */}
            <div className="card-base" style={{ background: 'linear-gradient(135deg, rgba(8,120,239,0.06), rgba(124,58,237,0.06))' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0878EF, #7c3aed)' }}>
                  <Icon name="DocumentTextIcon" size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base" style={{ color: 'var(--shifa-dark)' }}>Formulaire d'entretien annuel 2026</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Dr. Mohamed Sy · Médecine générale · Responsable : Dr. Kofi Diallo</p>
                </div>
              </div>
            </div>

            {formSubmitted ? (
              <div className="card-base text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(5,150,105,0.1)' }}>
                  <Icon name="CheckCircleIcon" size={36} style={{ color: '#059669' } as any} className="" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Entretien enregistré avec succès</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Le formulaire a été soumis et est en attente de validation par le responsable RH.</p>
                <button onClick={() => setFormSubmitted(false)} className="btn-primary px-6 py-2">
                  Nouvel entretien
                </button>
              </div>
            ) : (
              <>
                {formSections.map(section => (
                  <div key={section.id} className="card-base">
                    <h3 className="font-bold text-sm mb-4 pb-3 border-b" style={{ color: 'var(--shifa-dark)', borderColor: 'var(--border)' }}>
                      {section.title}
                    </h3>
                    <div className="space-y-5">
                      {section.questions.map(q => (
                        <div key={q.id}>
                          <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--foreground)' }}>{q.label}</label>
                          {q.type === 'textarea' && (
                            <textarea
                              rows={3}
                              placeholder={q.placeholder}
                              className="w-full px-3 py-2.5 text-sm rounded-xl border outline-none resize-none transition-colors"
                              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            />
                          )}
                          {q.type === 'rating' && (
                            <div className="flex items-center gap-2">
                              {Array.from({ length: q.max || 5 }, (_, i) => i + 1).map(star => (
                                <button
                                  key={star}
                                  onClick={() => setRatings(prev => ({ ...prev, [q.id]: star }))}
                                  className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all"
                                  style={{
                                    backgroundColor: (ratings[q.id] || 0) >= star ? 'var(--shifa-blue)' : 'var(--background)',
                                    borderColor: (ratings[q.id] || 0) >= star ? 'var(--shifa-blue)' : 'var(--border)',
                                    color: (ratings[q.id] || 0) >= star ? 'white' : 'var(--muted-foreground)',
                                  }}
                                >
                                  {star}
                                </button>
                              ))}
                              {ratings[q.id] && (
                                <span className="text-xs ml-2 font-semibold" style={{ color: 'var(--shifa-blue)' }}>
                                  {ratings[q.id]}/{q.max}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Score summary */}
                <div className="card-base" style={{ backgroundColor: 'rgba(8,120,239,0.04)', borderColor: 'rgba(8,120,239,0.15)' }}>
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Score global calculé</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-extrabold" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-heading)' }}>
                      {Object.keys(ratings).length > 0 ? Math.round((Object.values(ratings).reduce((a, b) => a + b, 0) / (Object.keys(ratings).length * 5)) * 100) : '—'}
                      {Object.keys(ratings).length > 0 && <span className="text-lg font-normal text-muted-foreground">/100</span>}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: Object.keys(ratings).length > 0 ? `${Math.round((Object.values(ratings).reduce((a, b) => a + b, 0) / (Object.keys(ratings).length * 5)) * 100)}%` : '0%',
                            backgroundColor: 'var(--shifa-blue)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="btn-secondary flex-1 py-3 text-sm">Sauvegarder brouillon</button>
                  <button onClick={() => setFormSubmitted(true)} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Icon name="CheckIcon" size={16} />
                    Soumettre l'entretien
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Analytique des entretiens</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score distribution */}
              <div className="card-base">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Distribution des scores</h3>
                <div className="space-y-3">
                  {[
                    { range: '90-100', count: 8, color: '#059669' },
                    { range: '80-89', count: 14, color: '#0878EF' },
                    { range: '70-79', count: 6, color: '#d97706' },
                    { range: '60-69', count: 3, color: '#f59e0b' },
                    { range: '< 60', count: 0, color: '#ef4444' },
                  ].map(item => (
                    <div key={item.range} className="flex items-center gap-3">
                      <span className="text-xs font-semibold w-16 shrink-0" style={{ color: 'var(--muted-foreground)' }}>{item.range}</span>
                      <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-lg flex items-center px-2 transition-all"
                          style={{ width: `${(item.count / 31) * 100}%`, backgroundColor: item.color, minWidth: item.count > 0 ? '24px' : '0' }}
                        >
                          {item.count > 0 && <span className="text-xs font-bold text-white">{item.count}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status breakdown */}
              <div className="card-base">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Répartition par statut</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Validés', count: 12, total: 48, color: '#059669' },
                    { label: 'Réalisés', count: 19, total: 48, color: '#0878EF' },
                    { label: 'Planifiés', count: 8, total: 48, color: '#d97706' },
                    { label: 'En attente', count: 9, total: 48, color: '#6b7280' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.count}/{item.total}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(item.count / item.total) * 100}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department scores */}
              <div className="card-base md:col-span-2">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Scores moyens par département</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { dept: 'Médecine générale', score: 86, color: '#0878EF' },
                    { dept: 'Urgences', score: 79, color: '#ef4444' },
                    { dept: 'Gynécologie', score: 91, color: '#ec4899' },
                    { dept: 'Pharmacie', score: 88, color: '#059669' },
                    { dept: 'Maternité', score: 83, color: '#7c3aed' },
                    { dept: 'Cardiologie', score: 90, color: '#0ea5e9' },
                    { dept: 'Pédiatrie', score: 85, color: '#f59e0b' },
                    { dept: 'Biologie', score: 77, color: '#d97706' },
                  ].map(item => (
                    <div key={item.dept} className="p-3 rounded-xl border text-center" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                      <p className="text-2xl font-extrabold mb-1" style={{ color: item.color, fontFamily: 'var(--font-heading)' }}>{item.score}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.dept}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
