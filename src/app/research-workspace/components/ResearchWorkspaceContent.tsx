'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const tabs = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'projects', label: 'Projets', icon: 'FolderOpenIcon' },
  { key: 'studies', label: 'Études', icon: 'BeakerIcon' },
  { key: 'datasets', label: 'Jeux de données', icon: 'CircleStackIcon' },
  { key: 'participants', label: 'Participants', icon: 'UsersIcon' },
  { key: 'ethics', label: 'Éthique & Autorisations', icon: 'ShieldCheckIcon' },
  { key: 'access', label: 'Demandes d\'accès', icon: 'KeyIcon' },
  { key: 'reports', label: 'Rapports', icon: 'DocumentTextIcon' },
];

const kpis = [
  { label: 'Projets actifs', value: '12', sub: '3 en cours de validation', icon: 'FolderOpenIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Études en cours', value: '8', sub: '2 recrutements ouverts', icon: 'BeakerIcon', color: 'var(--shifa-cyan)', bg: 'rgba(6,182,212,0.08)' },
  { label: 'Participants enrôlés', value: '4 280', sub: 'Données anonymisées', icon: 'UsersIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Autorisations éthiques', value: '9 / 12', sub: '3 en attente de renouvellement', icon: 'ShieldCheckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const enrollmentData = [
  { mois: 'Mar', enroles: 280, objectif: 400 },
  { mois: 'Avr', enroles: 520, objectif: 600 },
  { mois: 'Mai', enroles: 840, objectif: 900 },
  { mois: 'Jun', enroles: 1200, objectif: 1400 },
  { mois: 'Jul', enroles: 2800, objectif: 3000 },
  { mois: 'Aoû', enroles: 4280, objectif: 5000 },
];

const projects = [
  { id: 'proj-001', title: 'Impact de la téléconsultation sur l\'accès aux soins en Afrique subsaharienne', pi: 'Pr. Aminata Diallo', institution: 'Université Cheikh Anta Diop', status: 'actif', ethics: 'approuvé', start: 'Jan 2026', end: 'Déc 2026', participants: 1840 },
  { id: 'proj-002', title: 'Prévalence du diabète de type 2 dans les zones urbaines — Maroc', pi: 'Dr. Youssef Benali', institution: 'Université Mohammed V', status: 'actif', ethics: 'approuvé', start: 'Mar 2026', end: 'Mar 2027', participants: 620 },
  { id: 'proj-003', title: 'Efficacité des programmes de vaccination communautaire — Comores', pi: 'Dr. Farid Madi', institution: 'Université des Comores', status: 'recrutement', ethics: 'approuvé', start: 'Juin 2026', end: 'Juin 2027', participants: 284 },
  { id: 'proj-004', title: 'Analyse des parcours de soins maternels — Côte d\'Ivoire', pi: 'Pr. Awa Koné', institution: 'Université Félix Houphouët-Boigny', status: 'validation', ethics: 'en_attente', start: 'Oct 2026', end: 'Oct 2027', participants: 0 },
  { id: 'proj-005', title: 'Biomarqueurs prédictifs de l\'hypertension — Étude multicentrique', pi: 'Dr. Moussa Traoré', institution: 'INSERM / Partenaires africains', status: 'actif', ethics: 'approuvé', start: 'Fév 2026', end: 'Fév 2028', participants: 1536 },
];

const studies = [
  { id: 'std-001', title: 'Cohorte téléconsultation Afrique', type: 'Cohorte prospective', phase: 'Collecte données', participants: 1840, completion: 68 },
  { id: 'std-002', title: 'Diabète urbain Maroc', type: 'Transversale', phase: 'Analyse', participants: 620, completion: 85 },
  { id: 'std-003', title: 'Vaccination communautaire Comores', type: 'Interventionnelle', phase: 'Recrutement', participants: 284, completion: 24 },
  { id: 'std-004', title: 'Biomarqueurs HTA multicentrique', type: 'Cas-témoins', phase: 'Collecte données', participants: 1536, completion: 42 },
];

const datasets = [
  { id: 'ds-001', name: 'Données téléconsultation anonymisées 2025-2026', records: 48200, format: 'FHIR R4', access: 'restreint', status: 'disponible', ethics: 'Comité Éthique SN-2025-047' },
  { id: 'ds-002', name: 'Indicateurs de santé maternelle — Afrique de l\'Ouest', records: 12400, format: 'CSV / JSON', access: 'autorisé', status: 'disponible', ethics: 'OMS / UNICEF' },
  { id: 'ds-003', name: 'Registre vaccinations pédiatriques', records: 84000, format: 'HL7 v2', access: 'restreint', status: 'disponible', ethics: 'Comité Éthique CI-2026-012' },
  { id: 'ds-004', name: 'Données biomarqueurs HTA (en cours)', records: 18200, format: 'FHIR R4', access: 'en_cours', status: 'partiel', ethics: 'INSERM 2026-089' },
];

const ethicsRecords = [
  { id: 'eth-001', project: 'Cohorte téléconsultation Afrique', committee: 'Comité National Éthique — Sénégal', ref: 'SN-2025-047', approved: '15 déc. 2025', expires: '15 déc. 2026', status: 'approuvé' },
  { id: 'eth-002', project: 'Diabète urbain Maroc', committee: 'Comité Éthique Recherche — Maroc', ref: 'MA-2026-018', approved: '10 fév. 2026', expires: '10 fév. 2027', status: 'approuvé' },
  { id: 'eth-003', project: 'Vaccination communautaire Comores', committee: 'Comité Éthique — Comores', ref: 'KM-2026-003', approved: '1 juin 2026', expires: '1 juin 2027', status: 'approuvé' },
  { id: 'eth-004', project: 'Parcours soins maternels CI', committee: 'Comité Éthique — Côte d\'Ivoire', ref: 'CI-2026-041', approved: '—', expires: '—', status: 'en_attente' },
  { id: 'eth-005', project: 'Biomarqueurs HTA multicentrique', committee: 'INSERM / Comités partenaires', ref: 'INSERM-2026-089', approved: '20 jan. 2026', expires: '20 jan. 2028', status: 'approuvé' },
];

const accessRequests = [
  { id: 'req-001', requester: 'Pr. Kofi Mensah — Univ. Ghana', dataset: 'Données téléconsultation anonymisées', purpose: 'Étude comparative accès aux soins', submitted: '8 août 2026', status: 'en_examen' },
  { id: 'req-002', requester: 'Dr. Laila Benkirane — OMS', dataset: 'Indicateurs santé maternelle', purpose: 'Rapport mondial santé maternelle 2027', submitted: '5 août 2026', status: 'approuvé' },
  { id: 'req-003', requester: 'Pr. Ahmed Al-Rashid — Univ. Dubaï', dataset: 'Registre vaccinations pédiatriques', purpose: 'Modélisation couverture vaccinale', submitted: '2 août 2026', status: 'en_examen' },
  { id: 'req-004', requester: 'Dr. Marie Dupont — INSERM', dataset: 'Données biomarqueurs HTA', purpose: 'Méta-analyse HTA Afrique', submitted: '28 juil. 2026', status: 'refusé' },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  recrutement: { label: 'Recrutement', bg: '#dbeafe', text: '#1d4ed8' },
  validation: { label: 'En validation', bg: '#fef9c3', text: '#ca8a04' },
  approuvé: { label: 'Approuvé', bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  disponible: { label: 'Disponible', bg: '#dcfce7', text: '#16a34a' },
  partiel: { label: 'Partiel', bg: '#fef9c3', text: '#ca8a04' },
  restreint: { label: 'Restreint', bg: '#fee2e2', text: '#dc2626' },
  autorisé: { label: 'Autorisé', bg: '#dcfce7', text: '#16a34a' },
  en_cours: { label: 'En cours', bg: '#dbeafe', text: '#1d4ed8' },
  en_examen: { label: 'En examen', bg: '#fef9c3', text: '#ca8a04' },
  refusé: { label: 'Refusé', bg: '#fee2e2', text: '#dc2626' },
};

export default function ResearchWorkspaceContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}>
            <Icon name="BeakerIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Espace Organisation de Recherche</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Projets, études, jeux de données autorisés et accès éthique</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0F766E, #0891B2)' }}>
          <Icon name="PlusIcon" size={16} /> Nouveau projet
        </button>
      </div>

      {/* Privacy notice */}
      <div className="mb-5 px-4 py-3 rounded-xl border flex items-start gap-3" style={{ backgroundColor: 'rgba(15,118,110,0.06)', borderColor: 'rgba(15,118,110,0.2)' }}>
        <Icon name="ShieldCheckIcon" size={18} style={{ color: '#0F766E' }} className="shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <strong style={{ color: 'var(--foreground)' }}>Protection des données :</strong> Les organisations de recherche n'ont pas accès automatique aux dossiers patients identifiables. Tout accès aux données nécessite une autorisation éthique explicite, une anonymisation conforme et une approbation du comité de protection des données SHIFA.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'text-white shadow-sm' : 'hover:bg-muted'}`}
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, #0F766E, #0891B2)' } : { color: 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <div key={kpi.label} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                </div>
                <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Enrôlement participants (6 mois)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="objectif" name="Objectif" stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="enroles" name="Enrôlés" stroke="#0F766E" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Statut des études</h3>
              <div className="space-y-3">
                {studies.map(s => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate flex-1 mr-2" style={{ color: 'var(--foreground)' }}>{s.title}</p>
                      <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{s.completion}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.completion}%`, backgroundColor: '#0F766E' }} />
                      </div>
                      <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{s.phase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent access requests */}
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Demandes d'accès récentes</h3>
            <div className="space-y-2">
              {accessRequests.slice(0, 3).map(req => {
                const s = statusConfig[req.status];
                return (
                  <div key={req.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(15,118,110,0.1)' }}>
                      <Icon name="KeyIcon" size={14} style={{ color: '#0F766E' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{req.requester}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{req.dataset}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Rechercher un projet..." className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} />
            <select className="px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              <option>Tous les statuts</option>
              <option>Actif</option><option>Recrutement</option><option>Validation</option>
            </select>
          </div>
          <div className="space-y-3">
            {projects.map(proj => {
              const s = statusConfig[proj.status];
              const e = statusConfig[proj.ethics];
              return (
                <div key={proj.id} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{proj.title}</h3>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PI : {proj.pi} — {proj.institution}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: e.bg, color: e.text }}>Éthique : {e.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>📅 {proj.start} → {proj.end}</span>
                    <span>👥 {proj.participants.toLocaleString()} participants</span>
                    <button className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium" style={{ color: '#0F766E', backgroundColor: 'rgba(15,118,110,0.08)' }}>Voir le projet</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Studies Tab */}
      {activeTab === 'studies' && (
        <div className="space-y-3">
          {studies.map(s => (
            <div key={s.id} className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{s.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.type} · Phase : {s.phase}</p>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: '#0F766E' }}>{s.participants.toLocaleString()} participants</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${s.completion}%`, backgroundColor: '#0F766E' }} />
                </div>
                <span className="text-sm font-bold" style={{ color: '#0F766E' }}>{s.completion}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Datasets Tab */}
      {activeTab === 'datasets' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Jeux de données autorisés</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Jeu de données', 'Enregistrements', 'Format', 'Accès', 'Statut', 'Autorisation éthique', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasets.map(ds => {
                  const acc = statusConfig[ds.access];
                  const st = statusConfig[ds.status];
                  return (
                    <tr key={ds.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium max-w-xs" style={{ color: 'var(--foreground)' }}>{ds.name}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--shifa-blue)' }}>{ds.records.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{ds.format}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: acc.bg, color: acc.text }}>{acc.label}</span></td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: st.bg, color: st.text }}>{st.label}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{ds.ethics}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: '#0F766E' }}>Demander accès</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="rounded-2xl p-6 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(15,118,110,0.1)' }}>
            <Icon name="UsersIcon" size={28} style={{ color: '#0F766E' }} />
          </div>
          <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Données participants — Accès restreint</h3>
          <p className="text-sm max-w-md mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Les données des participants sont strictement anonymisées. L'accès aux données identifiables nécessite une autorisation éthique approuvée et une demande d'accès validée par le comité SHIFA.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { label: 'Total enrôlés', value: '4 280', color: '#0F766E' },
              { label: 'Actifs', value: '3 840', color: 'var(--shifa-green)' },
              { label: 'Retirés', value: '440', color: 'var(--muted-foreground)' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ethics Tab */}
      {activeTab === 'ethics' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Autorisations éthiques</h3>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#0F766E' }}>+ Nouvelle demande</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Projet', 'Comité', 'Référence', 'Approuvé le', 'Expire le', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ethicsRecords.map(eth => {
                  const s = statusConfig[eth.status];
                  return (
                    <tr key={eth.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium max-w-xs" style={{ color: 'var(--foreground)' }}>{eth.project}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{eth.committee}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{eth.ref}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{eth.approved}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{eth.expires}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Access Requests Tab */}
      {activeTab === 'access' && (
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Demandes d'accès aux données</h3>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#0F766E' }}>+ Nouvelle demande</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Demandeur', 'Jeu de données', 'Finalité', 'Soumise le', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessRequests.map(req => {
                    const s = statusConfig[req.status];
                    return (
                      <tr key={req.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{req.requester}</td>
                        <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--muted-foreground)' }}>{req.dataset}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.purpose}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.submitted}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: '#0F766E' }}>Voir</button>
                            {req.status === 'en_examen' && (
                              <>
                                <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: 'var(--shifa-green)' }}>Approuver</button>
                                <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted" style={{ color: '#EF4444' }}>Refuser</button>
                              </>
                            )}
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

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Rapport d\'avancement — Cohorte téléconsultation', date: '1 août 2026', type: 'Rapport intermédiaire', format: 'PDF' },
            { title: 'Analyse préliminaire — Diabète urbain Maroc', date: '15 juil. 2026', type: 'Analyse statistique', format: 'PDF + XLSX' },
            { title: 'Rapport éthique annuel 2025-2026', date: '30 juin 2026', type: 'Rapport éthique', format: 'PDF' },
            { title: 'Synthèse enrôlement — Tous projets', date: '10 août 2026', type: 'Tableau de bord', format: 'PDF' },
            { title: 'Demandes d\'accès données — Bilan', date: '5 août 2026', type: 'Rapport accès', format: 'PDF' },
            { title: 'Publication — Téléconsultation Afrique (preprint)', date: '20 juil. 2026', type: 'Publication scientifique', format: 'PDF' },
          ].map((report, i) => (
            <div key={i} className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(15,118,110,0.1)' }}>
                  <Icon name="DocumentTextIcon" size={18} style={{ color: '#0F766E' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight mb-1" style={{ color: 'var(--foreground)' }}>{report.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{report.type} · {report.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <Icon name="EyeIcon" size={12} /> Voir
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#0F766E' }}>
                  <Icon name="ArrowDownTrayIcon" size={12} /> {report.format}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
