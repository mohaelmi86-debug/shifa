'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'dashboard' | 'submissions' | 'reviews' | 'approvals' | 'members' | 'calendar';

interface Submission {
  id: string;
  title: string;
  researcher: string;
  institution: string;
  type: string;
  submitted: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'revision_required';
  reviewer?: string;
  risk: 'low' | 'moderate' | 'high';
}

const submissions: Submission[] = [
  { id: 'CER-2026-041', title: 'Étude sur l\'efficacité du traitement antipaludéen chez l\'enfant', researcher: 'Dr. Aminata Koné', institution: 'UCAD — Faculté de Médecine', type: 'Essai clinique', submitted: '8 août 2026', status: 'under_review', reviewer: 'Pr. Diallo', risk: 'moderate' },
  { id: 'CER-2026-042', title: 'Analyse rétrospective des données de mortalité maternelle 2020–2025', researcher: 'Dr. Fatou Sow', institution: 'CHU de Dakar', type: 'Étude rétrospective', submitted: '5 août 2026', status: 'pending', risk: 'low' },
  { id: 'CER-2026-043', title: 'Essai randomisé — Vaccin contre la méningite W135', researcher: 'Pr. Ibrahim Baldé', institution: 'Institut Pasteur Dakar', type: 'Essai randomisé', submitted: '1 août 2026', status: 'approved', reviewer: 'Pr. Camara', risk: 'high' },
  { id: 'CER-2026-044', title: 'Étude observationnelle — Diabète et alimentation en milieu rural', researcher: 'Dr. Mariama Diop', institution: 'UCAD', type: 'Étude observationnelle', submitted: '28 juil. 2026', status: 'revision_required', reviewer: 'Pr. Ndiaye', risk: 'low' },
  { id: 'CER-2026-045', title: 'Protocole de recherche génomique — Drépanocytose', researcher: 'Dr. Ousmane Traoré', institution: 'Hôpital Principal', type: 'Recherche génomique', submitted: '20 juil. 2026', status: 'rejected', reviewer: 'Pr. Diallo', risk: 'high' },
];

const statusConfig = {
  pending: { label: 'En attente', bg: 'bg-slate-100', text: 'text-slate-600' },
  under_review: { label: 'En révision', bg: 'bg-blue-50', text: 'text-blue-700' },
  approved: { label: 'Approuvé', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejeté', bg: 'bg-red-50', text: 'text-red-700' },
  revision_required: { label: 'Révision requise', bg: 'bg-amber-50', text: 'text-amber-700' },
};

const riskConfig = {
  low: { label: 'Faible', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  moderate: { label: 'Modéré', bg: 'bg-amber-50', text: 'text-amber-700' },
  high: { label: 'Élevé', bg: 'bg-red-50', text: 'text-red-700' },
};

export default function ResearchEthicsBoardContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
    { key: 'submissions', label: 'Soumissions', icon: 'DocumentPlusIcon', count: submissions.filter(s => s.status === 'pending').length },
    { key: 'reviews', label: 'En révision', icon: 'ClipboardDocumentCheckIcon', count: submissions.filter(s => s.status === 'under_review').length },
    { key: 'approvals', label: 'Décisions', icon: 'CheckBadgeIcon' },
    { key: 'members', label: 'Membres du comité', icon: 'UsersIcon' },
    { key: 'calendar', label: 'Réunions', icon: 'CalendarDaysIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Comité d'Éthique de la Recherche</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gestion des soumissions, révisions et approbations éthiques</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouvelle soumission
          </button>
        </div>

        <div className="flex gap-1 mt-5 border-b border-border -mb-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Total soumissions', value: submissions.length.toString(), icon: 'DocumentTextIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'En attente', value: submissions.filter(s => s.status === 'pending').length.toString(), icon: 'ClockIcon', color: 'text-slate-600', bg: 'bg-slate-100' },
                { label: 'En révision', value: submissions.filter(s => s.status === 'under_review').length.toString(), icon: 'ClipboardDocumentCheckIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Approuvés', value: submissions.filter(s => s.status === 'approved').length.toString(), icon: 'CheckCircleIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Rejetés / Révision', value: submissions.filter(s => ['rejected', 'revision_required'].includes(s.status)).length.toString(), icon: 'XCircleIcon', color: 'text-red-600', bg: 'bg-red-50' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center mb-2`}>
                    <Icon name={kpi.icon} size={18} className={kpi.color} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Recent submissions */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Soumissions récentes</h2>
              </div>
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Référence', 'Titre', 'Chercheur', 'Type', 'Risque', 'Statut', 'Soumis le'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map(sub => {
                    const sc = statusConfig[sub.status];
                    const rc = riskConfig[sub.risk];
                    return (
                      <tr key={sub.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedSubmission(sub === selectedSubmission ? null : sub)}>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{sub.id}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-sm font-medium text-foreground truncate">{sub.title}</p>
                          <p className="text-xs text-muted-foreground">{sub.institution}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{sub.researcher}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{sub.type}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>{rc.label}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{sub.submitted}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedSubmission && (
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedSubmission.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedSubmission.id} · {selectedSubmission.researcher} · {selectedSubmission.institution}</p>
                  </div>
                  <button onClick={() => setSelectedSubmission(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="XMarkIcon" size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">INFORMATIONS</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{selectedSubmission.type}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Soumis le</span><span className="text-foreground">{selectedSubmission.submitted}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Rapporteur</span><span className="text-foreground">{selectedSubmission.reviewer || 'Non assigné'}</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">CHECKLIST ÉTHIQUE</p>
                    <div className="space-y-1.5">
                      {['Consentement éclairé', 'Protection des données', 'Rapport bénéfice/risque', 'Indemnisation participants', 'Assurance responsabilité'].map(item => (
                        <label key={item} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                          <input type="checkbox" defaultChecked={Math.random() > 0.3} className="rounded" />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">ACTIONS</p>
                    <div className="space-y-2">
                      <button className="w-full py-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">Approuver</button>
                      <button className="w-full py-2 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">Demander révision</button>
                      <button className="w-full py-2 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Rejeter</button>
                      <button className="w-full py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">Assigner rapporteur</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Toutes les soumissions</h2>
              <div className="flex gap-2">
                <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground">
                  <option>Tous les statuts</option>
                  <option>En attente</option>
                  <option>En révision</option>
                  <option>Approuvé</option>
                  <option>Rejeté</option>
                </select>
                <select className="border border-border rounded-lg px-3 py-1.5 text-sm bg-background text-foreground">
                  <option>Tous les risques</option>
                  <option>Faible</option>
                  <option>Modéré</option>
                  <option>Élevé</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {submissions.map(sub => {
                const sc = statusConfig[sub.status];
                const rc = riskConfig[sub.risk];
                return (
                  <div key={sub.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{sub.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>Risque {rc.label}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mt-1">{sub.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{sub.researcher}</span>
                          <span>·</span>
                          <span>{sub.institution}</span>
                          <span>·</span>
                          <span>{sub.type}</span>
                          <span>·</span>
                          <span>Soumis le {sub.submitted}</span>
                        </div>
                        {sub.reviewer && <p className="text-xs text-muted-foreground mt-1">Rapporteur : <span className="text-foreground">{sub.reviewer}</span></p>}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-muted text-foreground">Voir dossier</button>
                        {sub.status === 'pending' && (
                          <button className="px-3 py-1.5 text-xs font-medium text-white rounded-lg" style={{ background: 'var(--primary)' }}>Assigner</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Dossiers en cours de révision</h2>
            {submissions.filter(s => s.status === 'under_review').map(sub => (
              <div key={sub.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{sub.id}</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">En révision</span>
                    </div>
                    <h3 className="font-semibold text-foreground mt-1">{sub.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub.researcher} · {sub.institution}</p>
                    <p className="text-xs text-muted-foreground mt-1">Rapporteur : <span className="text-foreground font-medium">{sub.reviewer}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">Approuver</button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100">Révision</button>
                    <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Rejeter</button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">COMMENTAIRES DU RAPPORTEUR</p>
                  <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none" rows={3} placeholder="Ajouter un commentaire d'évaluation..." />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Décisions rendues</h2>
            {submissions.filter(s => ['approved', 'rejected', 'revision_required'].includes(s.status)).map(sub => {
              const sc = statusConfig[sub.status];
              return (
                <div key={sub.id} className={`border rounded-xl p-5 ${sub.status === 'approved' ? 'border-emerald-200 bg-emerald-50/30' : sub.status === 'rejected' ? 'border-red-200 bg-red-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{sub.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mt-1">{sub.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub.researcher} · Décision par : {sub.reviewer}</p>
                    </div>
                    {sub.status === 'approved' && (
                      <button className="flex items-center gap-1.5 text-xs text-emerald-700 border border-emerald-300 rounded-lg px-3 py-1.5 hover:bg-emerald-50">
                        <Icon name="ArrowDownTrayIcon" size={13} /> Certificat
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Pr. Amadou Diallo', role: 'Président du comité', specialty: 'Médecine interne', institution: 'UCAD', dossiers: 12 },
              { name: 'Pr. Fatoumata Camara', role: 'Vice-présidente', specialty: 'Pédiatrie', institution: 'CHU Dakar', dossiers: 8 },
              { name: 'Pr. Ibrahim Ndiaye', role: 'Rapporteur senior', specialty: 'Épidémiologie', institution: 'Institut Pasteur', dossiers: 15 },
              { name: 'Dr. Mariama Sow', role: 'Membre', specialty: 'Bioéthique', institution: 'UCAD', dossiers: 6 },
              { name: 'Me. Ousmane Baldé', role: 'Juriste', specialty: 'Droit de la santé', institution: 'Barreau de Dakar', dossiers: 4 },
              { name: 'Mme. Aïssatou Diop', role: 'Représentante patients', specialty: 'Associations', institution: 'ANCS', dossiers: 3 },
            ].map(member => (
              <div key={member.name} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Spécialité : <span className="text-foreground">{member.specialty}</span></p>
                  <p>Institution : <span className="text-foreground">{member.institution}</span></p>
                  <p>Dossiers traités : <span className="text-foreground font-semibold">{member.dossiers}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Réunions du comité</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                <Icon name="PlusIcon" size={14} /> Planifier une réunion
              </button>
            </div>
            <div className="space-y-3">
              {[
                { date: '20 août 2026', time: '09h00 – 12h00', type: 'Réunion plénière', agenda: ['CER-2026-041 — Antipaludéen enfant', 'CER-2026-042 — Mortalité maternelle'], location: 'Salle de conférence A — UCAD', quorum: true },
                { date: '3 sept. 2026', time: '14h00 – 16h00', type: 'Réunion d\'urgence', agenda: ['CER-2026-046 — Essai vaccin COVID-19 (urgent)'], location: 'Visioconférence', quorum: false },
                { date: '17 sept. 2026', time: '09h00 – 12h00', type: 'Réunion plénière', agenda: ['Révision des procédures', 'Dossiers en attente'], location: 'Salle de conférence A — UCAD', quorum: false },
              ].map((meeting, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-center w-14 shrink-0">
                        <p className="text-lg font-bold text-primary">{meeting.date.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{meeting.date.split(' ')[1]} {meeting.date.split(' ')[2]}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{meeting.type}</h3>
                          {meeting.quorum && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">Quorum confirmé</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{meeting.time} · {meeting.location}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">ORDRE DU JOUR</p>
                          {meeting.agenda.map(item => (
                            <p key={item} className="text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline">Voir détails</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
