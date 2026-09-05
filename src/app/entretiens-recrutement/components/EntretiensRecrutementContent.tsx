'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'pipeline' | 'offres' | 'candidats' | 'evaluation' | 'stages';

interface Candidate {
  id: string;
  name: string;
  role: string;
  type: 'emploi' | 'stage';
  stage: 'candidature' | 'preselection' | 'entretien_rh' | 'entretien_tech' | 'offre' | 'accepte' | 'refuse';
  date: string;
  score: number | null;
  initials: string;
  color: string;
  university?: string;
  experience?: string;
}

interface JobOffer {
  id: string;
  title: string;
  department: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Vacation';
  location: string;
  applications: number;
  status: 'active' | 'draft' | 'closed';
  deadline: string;
  color: string;
}

const candidates: Candidate[] = [
  { id: 'ca1', name: 'Dr. Aminata Kouyaté', role: 'Médecin généraliste', type: 'emploi', stage: 'entretien_tech', date: '15 août 2026', score: 88, initials: 'AK', color: '#0878EF', experience: '5 ans' },
  { id: 'ca2', name: 'Oumar Traoré', role: 'Infirmier urgentiste', type: 'emploi', stage: 'entretien_rh', date: '18 août 2026', score: null, initials: 'OT', color: '#059669', experience: '3 ans' },
  { id: 'ca3', name: 'Fatoumata Diallo', role: 'Stage — Pharmacie', type: 'stage', stage: 'preselection', date: '20 août 2026', score: null, initials: 'FD', color: '#7c3aed', university: 'Université Cheikh Anta Diop' },
  { id: 'ca4', name: 'Dr. Kofi Mensah', role: 'Cardiologue', type: 'emploi', stage: 'offre', date: '10 août 2026', score: 94, initials: 'KM', color: '#d97706', experience: '8 ans' },
  { id: 'ca5', name: 'Aissatou Bah', role: 'Stage — Soins infirmiers', type: 'stage', stage: 'entretien_rh', date: '22 août 2026', score: null, initials: 'AB', color: '#ec4899', university: 'École de Santé de Dakar' },
  { id: 'ca6', name: 'Ibrahim Coulibaly', role: 'Laborantin', type: 'emploi', stage: 'candidature', date: '25 août 2026', score: null, initials: 'IC', color: '#0ea5e9', experience: '2 ans' },
  { id: 'ca7', name: 'Dr. Marie Dupont', role: 'Gynécologue', type: 'emploi', stage: 'accepte', date: '01 août 2026', score: 91, initials: 'MD', color: '#059669', experience: '10 ans' },
  { id: 'ca8', name: 'Mamadou Sow', role: 'Stage — Radiologie', type: 'stage', stage: 'refuse', date: '05 août 2026', score: 42, initials: 'MS', color: '#ef4444', university: 'Université de Bamako' },
];

const jobOffers: JobOffer[] = [
  { id: 'jo1', title: 'Médecin généraliste', department: 'Médecine générale', type: 'CDI', location: 'Saint-Louis, Sénégal', applications: 12, status: 'active', deadline: '31 août 2026', color: '#0878EF' },
  { id: 'jo2', title: 'Infirmier(ère) urgentiste', department: 'Urgences', type: 'CDI', location: 'Saint-Louis, Sénégal', applications: 8, status: 'active', deadline: '15 sept. 2026', color: '#ef4444' },
  { id: 'jo3', title: 'Cardiologue', department: 'Cardiologie', type: 'CDI', location: 'Saint-Louis, Sénégal', applications: 4, status: 'active', deadline: '30 sept. 2026', color: '#d97706' },
  { id: 'jo4', title: 'Stage — Pharmacie clinique', department: 'Pharmacie', type: 'Stage', location: 'Saint-Louis, Sénégal', applications: 18, status: 'active', deadline: '10 sept. 2026', color: '#7c3aed' },
  { id: 'jo5', title: 'Stage — Soins infirmiers', department: 'Soins', type: 'Stage', location: 'Saint-Louis, Sénégal', applications: 24, status: 'active', deadline: '05 sept. 2026', color: '#ec4899' },
  { id: 'jo6', title: 'Laborantin', department: 'Biologie', type: 'CDD', location: 'Saint-Louis, Sénégal', applications: 6, status: 'draft', deadline: '—', color: '#059669' },
];

const pipelineStages = [
  { key: 'candidature', label: 'Candidatures', color: '#6b7280' },
  { key: 'preselection', label: 'Présélection', color: '#d97706' },
  { key: 'entretien_rh', label: 'Entretien RH', color: '#0878EF' },
  { key: 'entretien_tech', label: 'Entretien technique', color: '#7c3aed' },
  { key: 'offre', label: 'Offre envoyée', color: '#0ea5e9' },
  { key: 'accepte', label: 'Accepté', color: '#059669' },
];

const evalCriteria = [
  { id: 'ec1', label: 'Compétences techniques médicales', weight: 30 },
  { id: 'ec2', label: 'Communication et relation patient', weight: 20 },
  { id: 'ec3', label: 'Travail en équipe', weight: 15 },
  { id: 'ec4', label: 'Adaptabilité et gestion du stress', weight: 15 },
  { id: 'ec5', label: 'Motivation et projet professionnel', weight: 20 },
];

export default function EntretiensRecrutementContent() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [typeFilter, setTypeFilter] = useState<'all' | 'emploi' | 'stage'>('all');
  const [evalScores, setEvalScores] = useState<Record<string, number>>({});
  const [evalSubmitted, setEvalSubmitted] = useState(false);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'pipeline', label: 'Pipeline', icon: 'FunnelIcon' },
    { key: 'offres', label: 'Offres d\'emploi', icon: 'BriefcaseIcon' },
    { key: 'candidats', label: 'Candidats', icon: 'UsersIcon' },
    { key: 'evaluation', label: 'Évaluation', icon: 'ClipboardDocumentCheckIcon' },
    { key: 'stages', label: 'Stages', icon: 'AcademicCapIcon' },
  ];

  const filteredCandidates = candidates.filter(c => typeFilter === 'all' || c.type === typeFilter);

  const kpis = [
    { label: 'Postes ouverts', value: jobOffers.filter(j => j.status === 'active').length.toString(), icon: 'BriefcaseIcon', color: '#0878EF', gradient: ['#0878EF', '#38B6FF'] },
    { label: 'Candidatures reçues', value: candidates.length.toString(), icon: 'UsersIcon', color: '#7c3aed', gradient: ['#7c3aed', '#A78BFA'] },
    { label: 'Entretiens planifiés', value: candidates.filter(c => c.stage === 'entretien_rh' || c.stage === 'entretien_tech').length.toString(), icon: 'CalendarDaysIcon', color: '#d97706', gradient: ['#d97706', '#FCD34D'] },
    { label: 'Offres acceptées', value: candidates.filter(c => c.stage === 'accepte').length.toString(), icon: 'CheckCircleIcon', color: '#059669', gradient: ['#059669', '#34D399'] },
  ];

  const stageCount = (stage: string) => candidates.filter(c => c.stage === stage).length;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-5 flex items-start justify-between gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #059669, #0ea5e9)' }}>
            <Icon name="BriefcaseIcon" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Entretiens d'embauche & de stage
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Recrutement · Stages · Pipeline candidats · Évaluations
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
            Nouvelle offre
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
                borderColor: activeTab === tab.key ? '#059669' : 'transparent',
                color: activeTab === tab.key ? '#059669' : 'var(--muted-foreground)',
              }}
            >
              <Icon name={tab.icon as any} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(8,120,239,0.06)' }}>
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${kpi.gradient[0]}, ${kpi.gradient[1]})` }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${kpi.gradient[0]}18, ${kpi.gradient[1]}10)`, border: `1.5px solid ${kpi.gradient[0]}20` }}>
                    <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as any} className="" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{kpi.value}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2">
              {(['all', 'emploi', 'stage'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: typeFilter === t ? '#059669' : 'var(--muted)',
                    color: typeFilter === t ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {t === 'all' ? 'Tous' : t === 'emploi' ? 'Emploi' : 'Stage'}
                </button>
              ))}
            </div>

            {/* Kanban pipeline */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4 min-w-max">
                {pipelineStages.map(stage => {
                  const stageCandidates = filteredCandidates.filter(c => c.stage === stage.key);
                  return (
                    <div key={stage.key} className="w-56 flex flex-col gap-2">
                      <div className="flex items-center justify-between px-2 py-1.5 rounded-xl" style={{ backgroundColor: `${stage.color}12` }}>
                        <span className="text-xs font-bold" style={{ color: stage.color }}>{stage.label}</span>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: stage.color }}>
                          {stageCandidates.length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {stageCandidates.map(c => (
                          <div key={c.id} className="rounded-xl border p-3 cursor-pointer hover:shadow-shifa transition-all" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                                {c.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                              </div>
                            </div>
                            <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.role}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium" style={{
                                backgroundColor: c.type === 'emploi' ? 'rgba(8,120,239,0.1)' : 'rgba(124,58,237,0.1)',
                                color: c.type === 'emploi' ? '#0878EF' : '#7c3aed',
                                fontSize: '9px',
                              }}>
                                {c.type === 'emploi' ? 'Emploi' : 'Stage'}
                              </span>
                              {c.score !== null && (
                                <span className="text-xs font-bold ml-auto" style={{ color: c.score >= 80 ? '#059669' : c.score >= 60 ? '#d97706' : '#ef4444' }}>
                                  {c.score}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {stageCandidates.length === 0 && (
                          <div className="rounded-xl border border-dashed p-4 text-center" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun candidat</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* OFFRES */}
        {activeTab === 'offres' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Offres d'emploi & de stage</h2>
              <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Icon name="PlusIcon" size={14} />
                Publier une offre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOffers.map(offer => (
                <div key={offer.id} className="card-base relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: offer.color }} />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${offer.color}15` }}>
                        <Icon name={offer.type === 'Stage' ? 'AcademicCapIcon' : 'BriefcaseIcon'} size={18} style={{ color: offer.color } as any} className="" />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{offer.title}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{offer.department} · {offer.location}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{
                      backgroundColor: offer.status === 'active' ? 'rgba(5,150,105,0.1)' : offer.status === 'draft' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)',
                      color: offer.status === 'active' ? '#059669' : offer.status === 'draft' ? '#d97706' : '#6b7280',
                    }}>
                      {offer.status === 'active' ? 'Active' : offer.status === 'draft' ? 'Brouillon' : 'Clôturée'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${offer.color}12`, color: offer.color }}>
                      {offer.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="UsersIcon" size={12} />
                      {offer.applications} candidature(s)
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="CalendarIcon" size={12} />
                      {offer.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <Icon name="EyeIcon" size={12} />
                      Voir les candidats
                    </button>
                    <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <Icon name="PencilSquareIcon" size={12} />
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CANDIDATS */}
        {activeTab === 'candidats' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Tous les candidats</h2>
              <div className="flex items-center gap-2">
                {(['all', 'emploi', 'stage'] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: typeFilter === t ? '#059669' : 'var(--muted)', color: typeFilter === t ? 'white' : 'var(--muted-foreground)' }}>
                    {t === 'all' ? 'Tous' : t === 'emploi' ? 'Emploi' : 'Stage'}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-base overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                      {['Candidat', 'Poste', 'Type', 'Étape', 'Date', 'Score', 'Actions'].map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((c, idx) => {
                      const stageInfo = pipelineStages.find(s => s.key === c.stage) || { label: c.stage, color: '#6b7280' };
                      return (
                        <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                                {c.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                                {c.university && <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.university}</p>}
                                {c.experience && <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{c.experience} d'expérience</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.role}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: c.type === 'emploi' ? 'rgba(8,120,239,0.1)' : 'rgba(124,58,237,0.1)', color: c.type === 'emploi' ? '#0878EF' : '#7c3aed' }}>
                              {c.type === 'emploi' ? 'Emploi' : 'Stage'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${stageInfo.color}15`, color: stageInfo.color }}>
                              {stageInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</td>
                          <td className="px-4 py-3">
                            {c.score !== null ? (
                              <span className="font-bold text-sm" style={{ color: c.score >= 80 ? '#059669' : c.score >= 60 ? '#d97706' : '#ef4444' }}>{c.score}/100</span>
                            ) : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setActiveTab('evaluation')} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Évaluer">
                                <Icon name="ClipboardDocumentCheckIcon" size={14} className="text-muted-foreground" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Planifier entretien">
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

        {/* ÉVALUATION */}
        {activeTab === 'evaluation' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="card-base" style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(14,165,233,0.06))' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #0ea5e9)' }}>
                  <Icon name="ClipboardDocumentCheckIcon" size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-base" style={{ color: 'var(--shifa-dark)' }}>Grille d'évaluation — Entretien</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Dr. Aminata Kouyaté · Médecin généraliste · Entretien technique</p>
                </div>
              </div>
            </div>

            {evalSubmitted ? (
              <div className="card-base text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(5,150,105,0.1)' }}>
                  <Icon name="CheckCircleIcon" size={36} style={{ color: '#059669' } as any} className="" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Évaluation enregistrée</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Score final : <span className="font-bold text-lg" style={{ color: '#059669' }}>
                    {Object.keys(evalScores).length > 0
                      ? Math.round(evalCriteria.reduce((acc, c) => acc + ((evalScores[c.id] || 0) / 5) * c.weight, 0))
                      : 0}/100
                  </span>
                </p>
                <button onClick={() => { setEvalSubmitted(false); setEvalScores({}); }} className="btn-primary px-6 py-2 mt-4">
                  Nouvelle évaluation
                </button>
              </div>
            ) : (
              <>
                <div className="card-base">
                  <h3 className="font-bold text-sm mb-4 pb-3 border-b" style={{ color: 'var(--shifa-dark)', borderColor: 'var(--border)' }}>
                    Critères d'évaluation
                  </h3>
                  <div className="space-y-5">
                    {evalCriteria.map(criterion => (
                      <div key={criterion.id}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{criterion.label}</label>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(8,120,239,0.1)', color: 'var(--shifa-blue)' }}>
                            Poids : {criterion.weight}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => setEvalScores(prev => ({ ...prev, [criterion.id]: star }))}
                              className="flex-1 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all"
                              style={{
                                backgroundColor: (evalScores[criterion.id] || 0) >= star ? '#059669' : 'var(--background)',
                                borderColor: (evalScores[criterion.id] || 0) >= star ? '#059669' : 'var(--border)',
                                color: (evalScores[criterion.id] || 0) >= star ? 'white' : 'var(--muted-foreground)',
                              }}
                            >
                              {star}
                            </button>
                          ))}
                          {evalScores[criterion.id] && (
                            <span className="text-xs ml-1 font-semibold shrink-0" style={{ color: '#059669' }}>
                              {evalScores[criterion.id]}/5
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-base">
                  <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--foreground)' }}>Commentaires & recommandation</label>
                  <textarea
                    rows={4}
                    placeholder="Synthèse de l'entretien, points forts, axes d'amélioration, recommandation finale..."
                    className="w-full px-3 py-2.5 text-sm rounded-xl border outline-none resize-none"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Recommandation :</span>
                    {[
                      { label: 'Retenir', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
                      { label: 'À discuter', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
                      { label: 'Refuser', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
                    ].map(rec => (
                      <button key={rec.label} className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all" style={{ backgroundColor: rec.bg, color: rec.color, borderColor: `${rec.color}30` }}>
                        {rec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score preview */}
                {Object.keys(evalScores).length > 0 && (
                  <div className="card-base" style={{ backgroundColor: 'rgba(5,150,105,0.04)', borderColor: 'rgba(5,150,105,0.15)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Score pondéré estimé</span>
                      <span className="text-2xl font-extrabold" style={{ color: '#059669', fontFamily: 'var(--font-heading)' }}>
                        {Math.round(evalCriteria.reduce((acc, c) => acc + ((evalScores[c.id] || 0) / 5) * c.weight, 0))}/100
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button className="btn-secondary flex-1 py-3 text-sm">Sauvegarder brouillon</button>
                  <button onClick={() => setEvalSubmitted(true)} className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <Icon name="CheckIcon" size={16} />
                    Valider l'évaluation
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STAGES */}
        {activeTab === 'stages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Gestion des stages</h2>
              <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Icon name="PlusIcon" size={14} />
                Nouvelle convention
              </button>
            </div>

            {/* Stage KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Stagiaires actifs', value: '8', icon: 'AcademicCapIcon', color: '#7c3aed' },
                { label: 'Offres de stage', value: jobOffers.filter(j => j.type === 'Stage').length.toString(), icon: 'BriefcaseIcon', color: '#0ea5e9' },
                { label: 'Conventions signées', value: '6', icon: 'DocumentCheckIcon', color: '#059669' },
                { label: 'Universités partenaires', value: '4', icon: 'BuildingLibraryIcon', color: '#d97706' },
              ].map((kpi, i) => (
                <div key={i} className="card-base">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${kpi.color}15` }}>
                    <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as any} className="" />
                  </div>
                  <p className="text-2xl font-extrabold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{kpi.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Active interns */}
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Stagiaires en cours</h3>
              <div className="flex flex-col gap-3">
                {candidates.filter(c => c.type === 'stage' && c.stage !== 'refuse').map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-shifa" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.role}</p>
                      {c.university && <p className="text-xs mt-0.5" style={{ color: '#7c3aed' }}>{c.university}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                        backgroundColor: c.stage === 'accepte' ? 'rgba(5,150,105,0.1)' : 'rgba(8,120,239,0.1)',
                        color: c.stage === 'accepte' ? '#059669' : '#0878EF',
                      }}>
                        {c.stage === 'accepte' ? 'En cours' : pipelineStages.find(s => s.key === c.stage)?.label || c.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
