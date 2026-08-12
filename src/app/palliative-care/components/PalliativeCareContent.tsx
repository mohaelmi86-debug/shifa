'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'patients' | 'care-plans' | 'symptoms' | 'team' | 'resources' | 'reports';

interface PalliativePatient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  stage: string;
  physician: string;
  nurse: string;
  location: 'hospital' | 'home' | 'hospice';
  dnr: boolean;
  painScore: number;
  comfort: 'good' | 'moderate' | 'poor';
  prognosis: string;
  lastAssessment: string;
  nextVisit: string;
  family: string;
  goals: string[];
}

interface SymptomRecord {
  id: string;
  patient: string;
  date: string;
  pain: number;
  dyspnea: number;
  nausea: number;
  anxiety: number;
  fatigue: number;
  notes: string;
  nurse: string;
}

const palliativePatients: PalliativePatient[] = [
  { id: 'PP-001', name: 'Mariama Bah', age: 38, diagnosis: 'Cancer du sein stade IV', stage: 'Terminal', physician: 'Dr. Camara', nurse: 'Inf. Kadiatou', location: 'hospital', dnr: true, painScore: 4, comfort: 'moderate', prognosis: '2-4 mois', lastAssessment: 'Aujourd\'hui', nextVisit: 'Demain', family: 'Époux + 2 enfants', goals: ['Contrôle douleur', 'Temps avec famille', 'Dignité'] },
  { id: 'PP-002', name: 'Oumar Diallo', age: 71, diagnosis: 'Insuffisance cardiaque terminale', stage: 'Avancé', physician: 'Dr. Diop', nurse: 'Inf. Aminata', location: 'home', dnr: true, painScore: 3, comfort: 'good', prognosis: '3-6 mois', lastAssessment: 'Hier', nextVisit: '16 août', family: 'Épouse + fils', goals: ['Rester à domicile', 'Confort respiratoire', 'Soutien famille'] },
  { id: 'PP-003', name: 'Ibrahima Kouyaté', age: 55, diagnosis: 'Cancer pancréas stade IV', stage: 'Terminal', physician: 'Dr. Sy', nurse: 'Inf. Fatou', location: 'hospice', dnr: true, painScore: 6, comfort: 'poor', prognosis: '< 1 mois', lastAssessment: 'Aujourd\'hui', nextVisit: 'Aujourd\'hui 16h', family: 'Épouse + 4 enfants', goals: ['Sédation palliative', 'Présence famille', 'Accompagnement spirituel'] },
  { id: 'PP-004', name: 'Fatoumata Traoré', age: 62, diagnosis: 'BPCO sévère — insuffisance respiratoire', stage: 'Avancé', physician: 'Dr. Baldé', nurse: 'Inf. Kadiatou', location: 'home', dnr: false, painScore: 2, comfort: 'good', prognosis: '6-12 mois', lastAssessment: '10 août', nextVisit: '17 août', family: 'Fils + belle-fille', goals: ['Oxygénothérapie domicile', 'Réduction hospitalisations', 'Qualité de vie'] },
];

const symptomRecords: SymptomRecord[] = [
  { id: 'SR-001', patient: 'Mariama Bah', date: 'Aujourd\'hui 08h', pain: 4, dyspnea: 2, nausea: 3, anxiety: 5, fatigue: 7, notes: 'Douleur thoracique modérée. Anxiété majorée ce matin. Morphine ajustée.', nurse: 'Inf. Kadiatou' },
  { id: 'SR-002', patient: 'Ibrahima Kouyaté', date: 'Aujourd\'hui 09h', pain: 6, dyspnea: 4, nausea: 5, anxiety: 7, fatigue: 9, notes: 'Douleur sévère. Discussion sédation palliative avec famille et équipe.', nurse: 'Inf. Fatou' },
  { id: 'SR-003', patient: 'Oumar Diallo', date: 'Hier 14h', pain: 3, dyspnea: 4, nausea: 1, anxiety: 2, fatigue: 6, notes: 'Dyspnée d\'effort. Furosémide ajusté. Confort global satisfaisant.', nurse: 'Inf. Aminata' },
];

const painTrendData = [
  { day: 'J-6', mariama: 7, ibrahima: 8, oumar: 5 },
  { day: 'J-5', mariama: 6, ibrahima: 7, oumar: 4 },
  { day: 'J-4', mariama: 5, ibrahima: 8, oumar: 4 },
  { day: 'J-3', mariama: 5, ibrahima: 7, oumar: 3 },
  { day: 'J-2', mariama: 4, ibrahima: 7, oumar: 3 },
  { day: 'J-1', mariama: 4, ibrahima: 6, oumar: 3 },
];

const teamMembers = [
  { name: 'Dr. Camara', role: 'Médecin référent soins palliatifs', specialty: 'Oncologie palliative', patients: 8, available: true },
  { name: 'Dr. Diop', role: 'Médecin cardiologue', specialty: 'Insuffisance cardiaque', patients: 4, available: true },
  { name: 'Dr. Sy', role: 'Médecin généraliste', specialty: 'Soins primaires', patients: 6, available: false },
  { name: 'Inf. Kadiatou', role: 'Infirmière soins palliatifs', specialty: 'Soins de confort', patients: 12, available: true },
  { name: 'Inf. Aminata', role: 'Infirmière', specialty: 'Soins généraux', patients: 10, available: true },
  { name: 'Psy. Sow', role: 'Psychologue', specialty: 'Accompagnement deuil', patients: 15, available: true },
  { name: 'AS. Koné', role: 'Assistante sociale', specialty: 'Soutien famille', patients: 8, available: false },
  { name: 'Aumônier Diallo', role: 'Accompagnement spirituel', specialty: 'Soutien religieux', patients: 20, available: true },
];

const resources = [
  { title: 'Protocole douleur palliative', type: 'Protocole', updated: '01 août 2025' },
  { title: 'Guide sédation palliative profonde', type: 'Guide clinique', updated: '15 juil 2025' },
  { title: 'Formulaire directives anticipées', type: 'Document légal', updated: '01 jan 2025' },
  { title: 'Fiche information famille — phase terminale', type: 'Information patient', updated: '10 mars 2025' },
  { title: 'Protocole accompagnement deuil', type: 'Protocole', updated: '20 avr 2025' },
  { title: 'Médicaments soins palliatifs — référentiel', type: 'Référentiel', updated: '01 juin 2025' },
];

const locationConfig = {
  hospital: { label: 'Hôpital', bg: 'bg-blue-50', text: 'text-blue-700' },
  home: { label: 'Domicile', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  hospice: { label: 'Unité SP', bg: 'bg-purple-50', text: 'text-purple-700' },
};

const comfortConfig = {
  good: { label: 'Bon', color: '#10b981' },
  moderate: { label: 'Modéré', color: '#f59e0b' },
  poor: { label: 'Insuffisant', color: '#ef4444' },
};

export default function PalliativeCareContent() {
  const [activeTab, setActiveTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<PalliativePatient | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { id: 'care-plans', label: 'Plans de confort', icon: 'ClipboardDocumentListIcon' },
    { id: 'symptoms', label: 'Suivi symptômes', icon: 'ChartBarIcon' },
    { id: 'team', label: 'Équipe pluridisciplinaire', icon: 'UserGroupIcon' },
    { id: 'resources', label: 'Ressources & Protocoles', icon: 'BookOpenIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
            <Icon name="HeartIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Soins Palliatifs & Accompagnement</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Confort, dignité et accompagnement en fin de vie</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            {[
              { label: 'Patients suivis', value: '12', color: '#6366f1' },
              { label: 'À domicile', value: '5', color: '#10b981' },
              { label: 'Urgences confort', value: '2', color: '#ef4444' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#6366f1' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau patient
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
            style={{ borderBottomColor: activeTab === tab.id ? '#6366f1' : 'transparent', color: activeTab === tab.id ? '#6366f1' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              {palliativePatients.map(patient => {
                const locCfg = locationConfig[patient.location];
                const comCfg = comfortConfig[patient.comfort];
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.id === patient.id ? 'ring-2 ring-indigo-400' : 'hover:shadow-sm'}`}
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{patient.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.age} ans — {patient.diagnosis}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.stage} — Pronostic : {patient.prognosis}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${locCfg.bg} ${locCfg.text}`}>{locCfg.label}</span>
                        {patient.dnr && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-medium">DNR</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { label: 'Douleur', value: `${patient.painScore}/10`, color: patient.painScore <= 3 ? '#10b981' : patient.painScore <= 6 ? '#f59e0b' : '#ef4444' },
                        { label: 'Confort', value: comCfg.label, color: comCfg.color },
                        { label: 'Médecin', value: patient.physician },
                        { label: 'Prochain RDV', value: patient.nextVisit },
                      ].map(item => (
                        <div key={item.label} className="p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-xs font-bold" style={{ color: item.color || 'var(--foreground)' }}>{item.value}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.goals.map(g => <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{g}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedPatient && (
              <div className="w-80 shrink-0 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Fiche patient</h3>
                  <button onClick={() => setSelectedPatient(null)}><Icon name="XMarkIcon" size={16} style={{ color: 'var(--muted-foreground)' }} /></button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.age} ans</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: 'Stade', value: selectedPatient.stage },
                    { label: 'Pronostic', value: selectedPatient.prognosis },
                    { label: 'Lieu', value: locationConfig[selectedPatient.location].label },
                    { label: 'DNR', value: selectedPatient.dnr ? 'Oui' : 'Non' },
                    { label: 'Médecin', value: selectedPatient.physician },
                    { label: 'Infirmier(e)', value: selectedPatient.nurse },
                    { label: 'Famille', value: selectedPatient.family },
                    { label: 'Douleur', value: `${selectedPatient.painScore}/10` },
                  ].map(item => (
                    <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Objectifs de soins</p>
                  <div className="space-y-1">
                    {selectedPatient.goals.map(g => (
                      <div key={g} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#6366f1' }}>Évaluation symptômes</button>
                  <button className="w-full py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Réunion pluridisciplinaire</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARE PLANS TAB */}
        {activeTab === 'care-plans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Plans de confort individualisés</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#6366f1' }}>
                <Icon name="PlusIcon" size={16} />
                Nouveau plan
              </button>
            </div>
            {palliativePatients.map(p => (
              <div key={p.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{p.diagnosis} — {p.stage}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${locationConfig[p.location].bg} ${locationConfig[p.location].text}`}>{locationConfig[p.location].label}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Objectifs de soins</p>
                    <div className="space-y-0.5">
                      {p.goals.map(g => <p key={g} className="text-xs" style={{ color: 'var(--foreground)' }}>• {g}</p>)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Équipe référente</p>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{p.physician}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{p.nurse}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Directives</p>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>DNR : {p.dnr ? 'Oui' : 'Non'}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>Famille : {p.family}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#6366f1' }}>Modifier plan</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Réunion équipe</button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Contact famille</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SYMPTOMS TAB */}
        {activeTab === 'symptoms' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution de la douleur (7 derniers jours)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={painTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mariama" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Mariama" />
                  <Line type="monotone" dataKey="ibrahima" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Ibrahima" />
                  <Line type="monotone" dataKey="oumar" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Oumar" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Évaluations récentes</h3>
              {symptomRecords.map(sr => (
                <div key={sr.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{sr.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{sr.date} — {sr.nurse}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[
                      { label: 'Douleur', value: sr.pain, color: sr.pain >= 7 ? '#ef4444' : sr.pain >= 4 ? '#f59e0b' : '#10b981' },
                      { label: 'Dyspnée', value: sr.dyspnea, color: sr.dyspnea >= 7 ? '#ef4444' : sr.dyspnea >= 4 ? '#f59e0b' : '#10b981' },
                      { label: 'Nausées', value: sr.nausea, color: sr.nausea >= 7 ? '#ef4444' : sr.nausea >= 4 ? '#f59e0b' : '#10b981' },
                      { label: 'Anxiété', value: sr.anxiety, color: sr.anxiety >= 7 ? '#ef4444' : sr.anxiety >= 4 ? '#f59e0b' : '#10b981' },
                      { label: 'Fatigue', value: sr.fatigue, color: sr.fatigue >= 7 ? '#ef4444' : sr.fatigue >= 4 ? '#f59e0b' : '#10b981' },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-lg font-bold" style={{ color: item.color }}>{item.value}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>/10</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Notes</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{sr.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Équipe pluridisciplinaire soins palliatifs</h2>
            <div className="grid grid-cols-2 gap-4">
              {teamMembers.map(member => (
                <div key={member.name} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{member.name}</p>
                      <div className={`w-2 h-2 rounded-full ${member.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.role}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.specialty}</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold" style={{ color: '#6366f1' }}>{member.patients}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>patients</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Ressources & Protocoles</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#6366f1' }}>
                <Icon name="PlusIcon" size={16} />
                Ajouter ressource
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {resources.map(r => (
                <div key={r.title} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-indigo-50">
                      <Icon name="DocumentTextIcon" size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.type} — Mis à jour : {r.updated}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports & Indicateurs</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Patients suivis', value: '12', color: '#6366f1' },
                { label: 'Score douleur moy.', value: '3.8', color: '#f59e0b' },
                { label: 'Décès à domicile', value: '60%', color: '#10b981' },
                { label: 'Satisfaction famille', value: '92%', color: '#3b82f6' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Rapport mensuel activité', desc: 'Patients, évaluations, décès — août 2025' },
                { title: 'Rapport qualité soins', desc: 'Contrôle douleur, confort, satisfaction' },
                { title: 'Rapport équipe pluridisciplinaire', desc: 'Réunions, interventions, coordination' },
                { title: 'Rapport accompagnement deuil', desc: 'Familles accompagnées, suivi post-décès' },
              ].map(r => (
                <div key={r.title} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
