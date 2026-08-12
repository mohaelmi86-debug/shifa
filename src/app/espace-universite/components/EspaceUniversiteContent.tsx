'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tabs = [
  { key: 'tab-dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'tab-etudiants', label: 'Étudiants', icon: 'AcademicCapIcon' },
  { key: 'tab-formations', label: 'Formations', icon: 'BookOpenIcon' },
  { key: 'tab-stages', label: 'Stages cliniques', icon: 'ClipboardDocumentListIcon' },
  { key: 'tab-recherche', label: 'Recherche', icon: 'BeakerIcon' },
];

const kpis = [
  { label: 'Étudiants inscrits', value: '4 820', sub: 'Médecine, pharmacie, soins', icon: 'AcademicCapIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Enseignants & Tuteurs', value: '342', sub: '128 médecins hospitaliers', icon: 'UserGroupIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Stages en cours', value: '1 240', sub: '38 établissements partenaires', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Projets de recherche', value: '87', sub: '12 financés internationalement', icon: 'BeakerIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
];

const inscriptionsData = [
  { annee: '2021', medecine: 820, pharmacie: 340, soins: 580 },
  { annee: '2022', medecine: 890, pharmacie: 360, soins: 620 },
  { annee: '2023', medecine: 940, pharmacie: 380, soins: 660 },
  { annee: '2024', medecine: 1020, pharmacie: 410, soins: 710 },
  { annee: '2025', medecine: 1100, pharmacie: 440, soins: 760 },
  { annee: '2026', medecine: 1180, pharmacie: 470, soins: 820 },
];

const etudiants = [
  { id: 'etu-001', nom: 'Cheikh Diallo', filiere: 'Médecine', annee: '4ème année', statut: 'actif', moyenne: '14.8/20', stage: 'CHU Dakar' },
  { id: 'etu-002', nom: 'Aminata Sow', filiere: 'Pharmacie', annee: '3ème année', statut: 'actif', moyenne: '15.2/20', stage: 'Pharmacie Centrale' },
  { id: 'etu-003', nom: 'Oumar Traoré', filiere: 'Médecine', annee: '6ème année', statut: 'stage', moyenne: '13.9/20', stage: 'CHR Saint-Louis' },
  { id: 'etu-004', nom: 'Rokhaya Fall', filiere: 'Soins infirmiers', annee: '2ème année', statut: 'actif', moyenne: '16.1/20', stage: 'Non affecté' },
  { id: 'etu-005', nom: 'Modou Gaye', filiere: 'Médecine', annee: '5ème année', statut: 'stage', moyenne: '14.3/20', stage: 'Clinique du Cap-Vert' },
];

const formations = [
  { id: 'form-001', titre: 'Médecine générale', niveau: 'Doctorat (7 ans)', inscrits: 1180, diplomes: 142, statut: 'actif' },
  { id: 'form-002', titre: 'Pharmacie', niveau: 'Doctorat (6 ans)', inscrits: 470, diplomes: 68, statut: 'actif' },
  { id: 'form-003', titre: 'Soins infirmiers', niveau: 'Licence (3 ans)', inscrits: 820, diplomes: 210, statut: 'actif' },
  { id: 'form-004', titre: 'Sage-femme', niveau: 'Licence (3 ans)', inscrits: 380, diplomes: 95, statut: 'actif' },
  { id: 'form-005', titre: 'Santé publique', niveau: 'Master (2 ans)', inscrits: 240, diplomes: 88, statut: 'actif' },
  { id: 'form-006', titre: 'Médecine tropicale', niveau: 'Spécialisation (2 ans)', inscrits: 95, diplomes: 32, statut: 'actif' },
];

const recherches = [
  { id: 'rech-001', titre: 'Résistance aux antimicrobiens en Afrique subsaharienne', responsable: 'Pr. Kofi Mensah', statut: 'en_cours', financement: 'OMS / 45M FCFA', annee: '2024–2027' },
  { id: 'rech-002', titre: 'Efficacité des traitements antipaludéens de 2ème ligne', responsable: 'Pr. Fatou Diop', statut: 'en_cours', financement: 'Gates Foundation / 120M FCFA', annee: '2025–2028' },
  { id: 'rech-003', titre: 'Santé mentale post-COVID dans les populations urbaines', responsable: 'Dr. Ibrahima Ndiaye', statut: 'terminé', financement: 'Ministère / 18M FCFA', annee: '2023–2025' },
  { id: 'rech-004', titre: 'Télémédecine et accès aux soins en zones rurales', responsable: 'Pr. Aïssatou Balde', statut: 'en_cours', financement: 'AFD / 32M FCFA', annee: '2025–2027' },
];

export default function EspaceUniversiteContent() {
  const [activeTab, setActiveTab] = useState('tab-dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #7B5EA7, #0066FF)' }}>
            <Icon name="AcademicCapIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Université / École de Santé</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion académique, stages cliniques et recherche</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="UserPlusIcon" size={15} />Inscrire étudiant</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {activeTab === 'tab-dashboard' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card-base flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as any} className="" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                  <p className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Évolution des inscriptions par filière</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inscriptionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="annee" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="medecine" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} name="Médecine" stackId="a" />
                  <Bar dataKey="pharmacie" fill="var(--shifa-purple)" radius={[0, 0, 0, 0]} name="Pharmacie" stackId="a" />
                  <Bar dataKey="soins" fill="var(--shifa-cyan)" radius={[4, 4, 0, 0]} name="Soins" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ÉTUDIANTS */}
      {activeTab === 'tab-etudiants' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>4 820 étudiants inscrits</p>
            <input type="text" placeholder="Rechercher un étudiant..." className="input-field text-sm" style={{ width: '240px' }} />
          </div>
          <div className="card-base overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Étudiant', 'Filière', 'Année', 'Moyenne', 'Stage', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {etudiants.map((e, i) => (
                  <tr key={e.id} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < etudiants.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{e.nom}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.filiere}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{e.annee}</td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{e.moyenne}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.stage}</td>
                    <td className="px-4 py-3"><span className={`badge-base ${e.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{e.statut}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORMATIONS */}
      {activeTab === 'tab-formations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {formations.map((f) => (
            <div key={f.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(123,94,167,0.1)' }}>
                    <Icon name="BookOpenIcon" size={16} style={{ color: 'var(--shifa-purple)' } as any} className="" />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{f.titre}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.niveau}</p>
                  </div>
                </div>
                <span className="badge-base status-active">{f.statut}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                <span>Inscrits: <strong style={{ color: 'var(--shifa-blue)' }}>{f.inscrits}</strong></span>
                <span>Diplômés/an: <strong style={{ color: 'var(--shifa-green)' }}>{f.diplomes}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STAGES */}
      {activeTab === 'tab-stages' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>1 240 stages en cours — 38 établissements partenaires</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Affecter un stage</button>
          </div>
          {[
            { etab: 'CHU de Dakar', type: 'Hôpital universitaire', etudiants: 320, specialites: 'Médecine, Chirurgie, Pédiatrie', statut: 'actif' },
            { etab: 'CHR de Saint-Louis', type: 'Centre hospitalier régional', etudiants: 180, specialites: 'Médecine générale, Gynécologie', statut: 'actif' },
            { etab: 'Pharmacie Centrale', type: 'Pharmacie', etudiants: 95, specialites: 'Pharmacie clinique, Officine', statut: 'actif' },
            { etab: 'Clinique du Cap-Vert', type: 'Clinique privée', etudiants: 140, specialites: 'Cardiologie, Neurologie', statut: 'actif' },
          ].map((s) => (
            <div key={s.etab} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="BuildingOffice2Icon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{s.etab}</p>
                      <span className="badge-base status-active">{s.statut}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.type} · {s.specialites}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-blue)' }}>{s.etudiants}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>stagiaires</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECHERCHE */}
      {activeTab === 'tab-recherche' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>87 projets de recherche actifs</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouveau projet</button>
          </div>
          {recherches.map((r) => (
            <div key={r.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
                  <Icon name="BeakerIcon" size={18} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{r.titre}</p>
                    <span className={`badge-base ${r.statut === 'en_cours' ? 'status-active' : 'status-completed'}`}>{r.statut === 'en_cours' ? 'En cours' : 'Terminé'}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{r.responsable} · {r.annee}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>{r.financement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
