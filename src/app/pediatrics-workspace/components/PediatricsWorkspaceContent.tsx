'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'patients' | 'growth' | 'vaccines' | 'milestones' | 'records';

interface PedPatient { id: string; name: string; dob: string; age: string; sex: 'M' | 'F'; parent: string; doctor: string; weight: number; height: number; bmi: number; status: 'normal' | 'surveillance' | 'suivi renforcé'; nextVisit: string; }
interface GrowthEntry { date: string; age: string; weight: number; height: number; hc: number; bmi: number; percentileW: number; percentileH: number; }
interface VaccineRecord { id: string; vaccine: string; doses: { dose: number; date: string | null; status: 'fait' | 'planifié' | 'en retard' | 'non applicable' }[]; }
interface Milestone { id: string; category: string; description: string; expectedAge: string; achievedAge: string | null; status: 'atteint' | 'en cours' | 'retard' | 'non évalué'; }

const pedPatients: PedPatient[] = [
  { id: 'PED-001', name: 'Ibrahima Diallo', dob: '2023-03-15', age: '3 ans 5 mois', sex: 'M', parent: 'Oumar Diallo', doctor: 'Dr. Sow', weight: 14.2, height: 96, bmi: 15.4, status: 'normal', nextVisit: '15/09/2026' },
  { id: 'PED-002', name: 'Fatoumata Ndiaye', dob: '2021-07-22', age: '5 ans 0 mois', sex: 'F', parent: 'Aminata Ndiaye', doctor: 'Dr. Sow', weight: 17.8, height: 108, bmi: 15.2, status: 'normal', nextVisit: '22/01/2027' },
  { id: 'PED-003', name: 'Moussa Ba', dob: '2024-11-08', age: '9 mois', sex: 'M', parent: 'Ibrahima Ba', doctor: 'Dr. Camara', weight: 8.1, height: 70, bmi: 16.5, status: 'surveillance', nextVisit: '10/09/2026' },
  { id: 'PED-004', name: 'Aïcha Koné', dob: '2020-05-30', age: '6 ans 2 mois', sex: 'F', parent: 'Mariama Koné', doctor: 'Dr. Sow', weight: 19.5, height: 115, bmi: 14.7, status: 'suivi renforcé', nextVisit: '24/08/2026' },
  { id: 'PED-005', name: 'Cheikh Mbaye Jr.', dob: '2025-02-14', age: '6 mois', sex: 'M', parent: 'Cheikh Mbaye', doctor: 'Dr. Camara', weight: 7.2, height: 65, bmi: 17.0, status: 'normal', nextVisit: '14/08/2026' },
];

const growthHistory: GrowthEntry[] = [
  { date: '10/08/2026', age: '3 ans 5 mois', weight: 14.2, height: 96, hc: 50.2, bmi: 15.4, percentileW: 50, percentileH: 55 },
  { date: '15/05/2026', age: '3 ans 2 mois', weight: 13.8, height: 94, hc: 49.8, bmi: 15.6, percentileW: 48, percentileH: 52 },
  { date: '10/02/2026', age: '2 ans 11 mois', weight: 13.2, height: 92, hc: 49.5, bmi: 15.6, percentileW: 45, percentileH: 50 },
  { date: '12/11/2025', age: '2 ans 8 mois', weight: 12.8, height: 89, hc: 49.2, bmi: 16.2, percentileW: 44, percentileH: 48 },
  { date: '05/08/2025', age: '2 ans 5 mois', weight: 12.1, height: 86, hc: 48.8, bmi: 16.4, percentileW: 42, percentileH: 46 },
];

const vaccineRecords: VaccineRecord[] = [
  { id: 'V-01', vaccine: 'BCG', doses: [{ dose: 1, date: '2023-03-20', status: 'fait' }] },
  { id: 'V-02', vaccine: 'Hépatite B', doses: [{ dose: 1, date: '2023-03-20', status: 'fait' }, { dose: 2, date: '2023-04-20', status: 'fait' }, { dose: 3, date: '2023-06-20', status: 'fait' }] },
  { id: 'V-03', vaccine: 'Pentavalent (DTP-Hib-HepB)', doses: [{ dose: 1, date: '2023-05-15', status: 'fait' }, { dose: 2, date: '2023-06-15', status: 'fait' }, { dose: 3, date: '2023-07-15', status: 'fait' }] },
  { id: 'V-04', vaccine: 'Polio oral (VPO)', doses: [{ dose: 1, date: '2023-05-15', status: 'fait' }, { dose: 2, date: '2023-06-15', status: 'fait' }, { dose: 3, date: '2023-07-15', status: 'fait' }] },
  { id: 'V-05', vaccine: 'Rougeole-Rubéole', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }, { dose: 2, date: null, status: 'planifié' }] },
  { id: 'V-06', vaccine: 'Méningite A', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }] },
  { id: 'V-07', vaccine: 'Fièvre jaune', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }] },
  { id: 'V-08', vaccine: 'Rappel DTP', doses: [{ dose: 1, date: null, status: 'en retard' }] },
];

const milestones: Milestone[] = [
  { id: 'MS-01', category: 'Motricité grossière', description: 'Marche seul', expectedAge: '12-15 mois', achievedAge: '13 mois', status: 'atteint' },
  { id: 'MS-02', category: 'Motricité grossière', description: 'Monte les escaliers', expectedAge: '18-24 mois', achievedAge: '20 mois', status: 'atteint' },
  { id: 'MS-03', category: 'Motricité grossière', description: 'Saute sur place', expectedAge: '24-30 mois', achievedAge: '26 mois', status: 'atteint' },
  { id: 'MS-04', category: 'Langage', description: 'Premiers mots (2-3 mots)', expectedAge: '12-18 mois', achievedAge: '14 mois', status: 'atteint' },
  { id: 'MS-05', category: 'Langage', description: 'Phrases de 2 mots', expectedAge: '18-24 mois', achievedAge: '22 mois', status: 'atteint' },
  { id: 'MS-06', category: 'Langage', description: 'Phrases complètes (3-4 mots)', expectedAge: '30-36 mois', achievedAge: '34 mois', status: 'atteint' },
  { id: 'MS-07', category: 'Cognitif', description: 'Reconnaît les couleurs', expectedAge: '36-42 mois', achievedAge: null, status: 'en cours' },
  { id: 'MS-08', category: 'Social', description: 'Jeu coopératif', expectedAge: '36-48 mois', achievedAge: null, status: 'en cours' },
  { id: 'MS-09', category: 'Autonomie', description: 'Propre le jour', expectedAge: '24-36 mois', achievedAge: '30 mois', status: 'atteint' },
];

const statusPedConfig = {
  normal: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Normal' },
  surveillance: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Surveillance' },
  'suivi renforcé': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Suivi renforcé' },
};

const vaccineStatusConfig = {
  fait: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Fait' },
  planifié: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', label: 'Planifié' },
  'en retard': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'En retard' },
  'non applicable': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)', label: 'N/A' },
};

const milestoneStatusConfig = {
  atteint: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', icon: 'CheckCircleIcon' },
  'en cours': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', icon: 'ClockIcon' },
  retard: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', icon: 'ExclamationTriangleIcon' },
  'non évalué': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)', icon: 'MinusCircleIcon' },
};

const milestoneCategories = [...new Set(milestones.map(m => m.category))];

const kpis = [
  { label: 'Enfants suivis', value: '124', icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'Consultations ce mois', value: '38', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-cyan)' },
  { label: 'Vaccins en retard', value: '7', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Retards développement', value: '3', icon: 'ChartBarIcon', color: 'var(--shifa-amber)' },
  { label: 'Malnutrition dépistée', value: '2', icon: 'ScaleIcon', color: 'var(--shifa-amber)' },
  { label: 'RDV cette semaine', value: '12', icon: 'CalendarDaysIcon', color: 'var(--shifa-green)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
  { key: 'growth', label: 'Courbes de croissance', icon: 'ChartBarIcon' },
  { key: 'vaccines', label: 'Calendrier vaccinal', icon: 'ShieldCheckIcon' },
  { key: 'milestones', label: 'Développement', icon: 'StarIcon' },
  { key: 'records', label: 'Dossier pédiatrique', icon: 'DocumentTextIcon' },
];

export default function PediatricsWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('patients');
  const [selectedPatient, setSelectedPatient] = useState<PedPatient>(pedPatients[0]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-cyan), var(--shifa-green))' }}>
              <Icon name="StarIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Espace Pédiatrie</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Croissance · Vaccination · Développement · Dossier enfant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="ArrowDownTrayIcon" size={14} /> Export</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={14} /> Nouveau patient</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-1" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-cyan)] text-[var(--shifa-cyan)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* PATIENTS */}
        {activeTab === 'patients' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Liste des patients pédiatriques</h3>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pedPatients.length} enfants</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Enfant', 'Âge', 'Parent/Tuteur', 'Poids', 'Taille', 'IMC', 'Médecin', 'Statut', 'Prochain RDV'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedPatients.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < pedPatients.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => { setSelectedPatient(p); setActiveTab('growth'); }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-cyan)' }}>{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: p.sex === 'F' ? 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-cyan))' : 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>{p.sex}</div>
                        <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.parent}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{p.weight} kg</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{p.height} cm</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: p.bmi < 14 || p.bmi > 18 ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{p.bmi}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.doctor}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusPedConfig[p.status].bg, color: statusPedConfig[p.status].color }}>{statusPedConfig[p.status].label}</span></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{p.nextVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GROWTH */}
        {activeTab === 'growth' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Historique de croissance — {selectedPatient.name}</h3>
                <div className="flex gap-2">
                  {pedPatients.map(p => (
                    <button key={p.id} onClick={() => setSelectedPatient(p)} className="text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: selectedPatient.id === p.id ? 'var(--shifa-cyan)' : 'var(--muted)', color: selectedPatient.id === p.id ? 'white' : 'var(--muted-foreground)' }}>{p.name.split(' ')[0]}</button>
                  ))}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Date', 'Âge', 'Poids (kg)', 'Taille (cm)', 'PC (cm)', 'IMC', 'P. Poids', 'P. Taille'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {growthHistory.map((g, i) => (
                    <tr key={i} style={{ borderBottom: i < growthHistory.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{g.date}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{g.age}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--shifa-cyan)' }}>{g.weight}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--shifa-blue)' }}>{g.height}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{g.hc}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{g.bmi}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${g.percentileW}%`, backgroundColor: 'var(--shifa-cyan)' }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: 'var(--shifa-cyan)' }}>P{g.percentileW}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${g.percentileH}%`, backgroundColor: 'var(--shifa-blue)' }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>P{g.percentileH}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Dernière mesure</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Poids', value: `${selectedPatient.weight} kg`, color: 'var(--shifa-cyan)' },
                  { label: 'Taille', value: `${selectedPatient.height} cm`, color: 'var(--shifa-blue)' },
                  { label: 'IMC', value: selectedPatient.bmi.toString(), color: selectedPatient.bmi < 14 || selectedPatient.bmi > 18 ? 'var(--shifa-amber)' : 'var(--shifa-green)' },
                  { label: 'Statut', value: statusPedConfig[selectedPatient.status].label, color: statusPedConfig[selectedPatient.status].color },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.label}</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>LIEN PARENT-ENFANT</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>{selectedPatient.parent.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selectedPatient.parent}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Parent / Tuteur légal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VACCINES */}
        {activeTab === 'vaccines' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Calendrier vaccinal — {selectedPatient.name} ({selectedPatient.age})</h3>
              <div className="flex gap-2">
                {Object.entries(vaccineStatusConfig).map(([k, v]) => (
                  <span key={k} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: v.bg, color: v.color }}>{v.label}</span>
                ))}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {vaccineRecords.map(v => (
                <div key={v.id} className="px-4 py-3 flex items-center gap-4">
                  <div className="w-48 shrink-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{v.vaccine}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {v.doses.map(d => (
                      <div key={d.dose} className="flex flex-col items-center gap-1">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dose {d.dose}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: vaccineStatusConfig[d.status].bg, color: vaccineStatusConfig[d.status].color }}>{d.date || vaccineStatusConfig[d.status].label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="shrink-0">
                    {v.doses.some(d => d.status === 'en retard') && (
                      <button className="text-xs px-2.5 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Planifier</button>
                    )}
                    {v.doses.some(d => d.status === 'planifié') && (
                      <button className="text-xs px-2.5 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Confirmer</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {milestoneCategories.map(cat => (
              <div key={cat} className="card overflow-hidden">
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{cat}</h3>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {milestones.filter(m => m.category === cat).map(m => (
                    <div key={m.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: milestoneStatusConfig[m.status].bg }}>
                        <Icon name={milestoneStatusConfig[m.status].icon as any} size={14} style={{ color: milestoneStatusConfig[m.status].color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{m.description}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Attendu : {m.expectedAge}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {m.achievedAge ? (
                          <p className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>✓ {m.achievedAge}</p>
                        ) : (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: milestoneStatusConfig[m.status].bg, color: milestoneStatusConfig[m.status].color }}>{m.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RECORDS */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Sélectionner un patient</h3>
              <div className="space-y-2">
                {pedPatients.map(p => (
                  <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedPatient.id === p.id ? 'ring-2' : 'hover:bg-muted'}`}
                    style={{ backgroundColor: selectedPatient.id === p.id ? 'rgba(0,194,194,0.08)' : 'var(--muted)', ringColor: 'var(--shifa-cyan)' } as React.CSSProperties}
                    onClick={() => setSelectedPatient(p)}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: p.sex === 'F' ? 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-cyan))' : 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>{p.sex}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age}</p>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0" style={{ backgroundColor: statusPedConfig[p.status].bg, color: statusPedConfig[p.status].color }}>{statusPedConfig[p.status].label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 card p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.id} · {selectedPatient.age} · Né(e) le {selectedPatient.dob}</p>
                </div>
                <button className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"><Icon name="ArrowTopRightOnSquareIcon" size={12} /> Dossier complet</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Parent / Tuteur', value: selectedPatient.parent, icon: 'UserIcon' },
                  { label: 'Médecin référent', value: selectedPatient.doctor, icon: 'UserCircleIcon' },
                  { label: 'Poids actuel', value: `${selectedPatient.weight} kg`, icon: 'ScaleIcon' },
                  { label: 'Taille actuelle', value: `${selectedPatient.height} cm`, icon: 'ArrowsUpDownIcon' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name={f.icon as any} size={14} style={{ color: 'var(--shifa-cyan)' }} />
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.label}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>ANTÉCÉDENTS PÉDIATRIQUES</p>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>Aucun antécédent notable. Développement psychomoteur dans les normes. Vaccinations à jour selon calendrier national.</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>DERNIÈRE CONSULTATION</p>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>Consultation de routine. Croissance normale. Aucune pathologie aiguë. Prochain RDV : {selectedPatient.nextVisit}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
