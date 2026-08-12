'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

type Tab = 'patients' | 'sessions' | 'exercises' | 'progress' | 'equipment' | 'reports';

interface RehabPatient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  therapist: string;
  startDate: string;
  sessions: number;
  totalSessions: number;
  status: 'active' | 'completed' | 'on_hold';
  painScore: number;
  mobilityScore: number;
  nextSession: string;
  goals: string[];
}

interface Session {
  id: string;
  patient: string;
  date: string;
  duration: number;
  type: string;
  therapist: string;
  painBefore: number;
  painAfter: number;
  exercises: string[];
  notes: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

const rehabPatients: RehabPatient[] = [
  { id: 'RP-001', name: 'Ibrahima Kouyaté', age: 55, diagnosis: 'AVC — hémiplégie droite', therapist: 'Kiné. Diallo', startDate: '01 août', sessions: 8, totalSessions: 30, status: 'active', painScore: 4, mobilityScore: 45, nextSession: 'Aujourd\'hui 10h', goals: ['Récupération motricité', 'Marche autonome', 'Activités quotidiennes'] },
  { id: 'RP-002', name: 'Aminata Sow', age: 42, diagnosis: 'Lombalgie chronique', therapist: 'Kiné. Bah', startDate: '15 juil', sessions: 12, totalSessions: 20, status: 'active', painScore: 3, mobilityScore: 68, nextSession: 'Demain 14h', goals: ['Réduction douleur', 'Renforcement lombaire', 'Posture'] },
  { id: 'RP-003', name: 'Oumar Diallo', age: 68, diagnosis: 'Prothèse genou droit', therapist: 'Kiné. Diallo', startDate: '20 juil', sessions: 15, totalSessions: 25, status: 'active', painScore: 2, mobilityScore: 72, nextSession: '16 août 09h', goals: ['Flexion 120°', 'Marche sans aide', 'Montée escaliers'] },
  { id: 'RP-004', name: 'Kadiatou Balde', age: 35, diagnosis: 'Entorse cheville grade 3', therapist: 'Kiné. Bah', startDate: '05 août', sessions: 4, totalSessions: 12, status: 'active', painScore: 5, mobilityScore: 38, nextSession: '15 août 11h', goals: ['Stabilité cheville', 'Reprise sport', 'Proprioception'] },
  { id: 'RP-005', name: 'Mamadou Camara', age: 58, diagnosis: 'Épaule gelée', therapist: 'Kiné. Diallo', startDate: '10 juil', sessions: 18, totalSessions: 24, status: 'active', painScore: 2, mobilityScore: 78, nextSession: '17 août 15h', goals: ['Amplitude complète', 'Retour travail', 'Renforcement coiffe'] },
  { id: 'RP-006', name: 'Fatoumata Traoré', age: 29, diagnosis: 'Rééducation post-partum', therapist: 'Kiné. Bah', startDate: '01 août', sessions: 3, totalSessions: 10, status: 'active', painScore: 1, mobilityScore: 85, nextSession: '18 août 10h', goals: ['Périnée', 'Abdominaux', 'Posture'] },
];

const sessions: Session[] = [
  { id: 'S-001', patient: 'Ibrahima Kouyaté', date: 'Aujourd\'hui 10h', duration: 60, type: 'Rééducation neurologique', therapist: 'Kiné. Diallo', painBefore: 5, painAfter: 3, exercises: ['Mobilisation passive membre sup.', 'Exercices équilibre', 'Marche assistée'], notes: 'Bonne progression. Amélioration préhension main droite.', status: 'scheduled' },
  { id: 'S-002', patient: 'Aminata Sow', date: 'Hier 14h', duration: 45, type: 'Kinésithérapie lombaire', therapist: 'Kiné. Bah', painBefore: 6, painAfter: 3, exercises: ['Étirements ischio-jambiers', 'Renforcement paravertébraux', 'McKenzie'], notes: 'Réduction significative de la douleur. Continuer programme.', status: 'completed' },
  { id: 'S-003', patient: 'Oumar Diallo', date: 'Hier 09h', duration: 50, type: 'Rééducation prothèse genou', therapist: 'Kiné. Diallo', painBefore: 3, painAfter: 2, exercises: ['Flexion progressive', 'Renforcement quadriceps', 'Proprioception'], notes: 'Flexion atteinte 95°. Objectif 120° dans 2 semaines.', status: 'completed' },
];

const progressData = [
  { session: 'S1', pain: 8, mobility: 30 },
  { session: 'S4', pain: 6, mobility: 42 },
  { session: 'S8', pain: 5, mobility: 55 },
  { session: 'S12', pain: 4, mobility: 65 },
  { session: 'S16', pain: 3, mobility: 72 },
  { session: 'S20', pain: 2, mobility: 80 },
];

const radarData = [
  { subject: 'Force', value: 65 },
  { subject: 'Mobilité', value: 72 },
  { subject: 'Équilibre', value: 58 },
  { subject: 'Endurance', value: 70 },
  { subject: 'Coordination', value: 55 },
  { subject: 'Proprioception', value: 62 },
];

const exercises = [
  { id: 'EX-001', name: 'Mobilisation passive épaule', category: 'Membre supérieur', duration: '10 min', sets: 3, reps: 15, difficulty: 'Facile', indication: 'Épaule gelée, post-op' },
  { id: 'EX-002', name: 'Renforcement quadriceps', category: 'Membre inférieur', duration: '15 min', sets: 3, reps: 20, difficulty: 'Modéré', indication: 'Prothèse genou, gonarthrose' },
  { id: 'EX-003', name: 'Exercices McKenzie', category: 'Rachis', duration: '20 min', sets: 2, reps: 10, difficulty: 'Modéré', indication: 'Lombalgie, hernie discale' },
  { id: 'EX-004', name: 'Marche assistée déambulateur', category: 'Neurologique', duration: '20 min', sets: 1, reps: 1, difficulty: 'Variable', indication: 'AVC, Parkinson, fracture' },
  { id: 'EX-005', name: 'Proprioception plateau instable', category: 'Cheville/Genou', duration: '10 min', sets: 3, reps: 30, difficulty: 'Modéré', indication: 'Entorse, instabilité' },
  { id: 'EX-006', name: 'Rééducation périnéale', category: 'Périnée', duration: '30 min', sets: 1, reps: 1, difficulty: 'Facile', indication: 'Post-partum, incontinence' },
];

const equipment = [
  { id: 'EQ-001', name: 'Table de kinésithérapie électrique', qty: 4, status: 'operational', lastMaintenance: '01 août', nextMaintenance: '01 nov' },
  { id: 'EQ-002', name: 'Électrostimulateur TENS/EMS', qty: 6, status: 'operational', lastMaintenance: '15 juil', nextMaintenance: '15 oct' },
  { id: 'EQ-003', name: 'Ultrasons thérapeutiques', qty: 2, status: 'maintenance', lastMaintenance: '10 août', nextMaintenance: 'En cours' },
  { id: 'EQ-004', name: 'Vélo ergomètre', qty: 3, status: 'operational', lastMaintenance: '20 juil', nextMaintenance: '20 oct' },
  { id: 'EQ-005', name: 'Plateau de proprioception', qty: 8, status: 'operational', lastMaintenance: '05 août', nextMaintenance: '05 nov' },
  { id: 'EQ-006', name: 'Balnéothérapie', qty: 1, status: 'out_of_service', lastMaintenance: '01 juil', nextMaintenance: 'Réparation' },
];

const statusConfig = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Actif' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Terminé' },
  on_hold: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En pause' },
  scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Planifiée' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Annulée' },
};

const eqStatusConfig = {
  operational: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Opérationnel' },
  maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Maintenance' },
  out_of_service: { bg: 'bg-red-50', text: 'text-red-700', label: 'Hors service' },
};

export default function PhysiotherapyContent() {
  const [activeTab, setActiveTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<RehabPatient | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { id: 'sessions', label: 'Séances', icon: 'CalendarDaysIcon' },
    { id: 'exercises', label: 'Bibliothèque exercices', icon: 'BookOpenIcon' },
    { id: 'progress', label: 'Suivi & Progrès', icon: 'ChartBarIcon' },
    { id: 'equipment', label: 'Équipements', icon: 'WrenchScrewdriverIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <Icon name="BoltIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Kinésithérapie & Rééducation</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Suivi rééducation, séances et progression fonctionnelle</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            {[
              { label: 'Patients actifs', value: '18', color: '#3b82f6' },
              { label: 'Séances aujourd\'hui', value: '12', color: '#10b981' },
              { label: 'Taux réussite', value: '84%', color: '#f59e0b' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors`}
            style={{ borderBottomColor: activeTab === tab.id ? '#3b82f6' : 'transparent', color: activeTab === tab.id ? '#3b82f6' : 'var(--muted-foreground)' }}
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
              {rehabPatients.map(patient => {
                const cfg = statusConfig[patient.status];
                const progressPct = Math.round((patient.sessions / patient.totalSessions) * 100);
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.id === patient.id ? 'ring-2 ring-blue-400' : 'hover:shadow-sm'}`}
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{patient.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.age} ans — {patient.diagnosis}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { label: 'Séances', value: `${patient.sessions}/${patient.totalSessions}` },
                        { label: 'Douleur', value: `${patient.painScore}/10` },
                        { label: 'Mobilité', value: `${patient.mobilityScore}%` },
                        { label: 'Prochain RDV', value: patient.nextSession },
                      ].map(item => (
                        <div key={item.label} className="p-2 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Progression du programme</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${progressPct}%`, backgroundColor: '#3b82f6' }} />
                      </div>
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
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.age} ans</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Objectifs de rééducation</p>
                  <div className="space-y-1">
                    {selectedPatient.goals.map(g => (
                      <div key={g} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: 'Thérapeute', value: selectedPatient.therapist },
                    { label: 'Début', value: selectedPatient.startDate },
                    { label: 'Douleur', value: `${selectedPatient.painScore}/10` },
                    { label: 'Mobilité', value: `${selectedPatient.mobilityScore}%` },
                  ].map(item => (
                    <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>Planifier séance</button>
                  <button className="w-full py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Modifier programme</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Séances de kinésithérapie</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>
                <Icon name="PlusIcon" size={16} />
                Planifier séance
              </button>
            </div>
            {sessions.map(s => {
              const cfg = statusConfig[s.status];
              return (
                <div key={s.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{s.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.date} — {s.type} — {s.duration} min</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold text-red-600">{s.painBefore}/10</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Douleur avant</p>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold text-emerald-600">{s.painAfter}/10</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Douleur après</p>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold text-blue-600">{s.therapist}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Thérapeute</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Exercices réalisés</p>
                    <div className="flex flex-wrap gap-1">
                      {s.exercises.map(ex => (
                        <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{ex}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Notes de séance</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{s.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EXERCISES TAB */}
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Bibliothèque d'exercices</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>
                <Icon name="PlusIcon" size={16} />
                Ajouter exercice
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {exercises.map(ex => (
                <div key={ex.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{ex.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ex.difficulty === 'Facile' ? 'bg-emerald-50 text-emerald-700' : ex.difficulty === 'Modéré' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{ex.difficulty}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: 'Catégorie', value: ex.category },
                      { label: 'Durée', value: ex.duration },
                      { label: 'Séries', value: ex.sets.toString() },
                      { label: 'Répétitions', value: ex.reps.toString() },
                    ].map(item => (
                      <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Indication : {ex.indication}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution douleur & mobilité</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Douleur /10" />
                    <Line type="monotone" dataKey="mobility" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Mobilité %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Bilan fonctionnel — Ibrahima Kouyaté</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip formatter={(v) => `${v}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Tableau de suivi — tous patients</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Patient', 'Diagnostic', 'Séances', 'Douleur', 'Mobilité', 'Progression', 'Statut'].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rehabPatients.map(p => {
                      const cfg = statusConfig[p.status];
                      const pct = Math.round((p.sessions / p.totalSessions) * 100);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="py-2 px-3 font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.diagnosis}</td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--foreground)' }}>{p.sessions}/{p.totalSessions}</td>
                          <td className="py-2 px-3">
                            <span className={`text-xs font-bold ${p.painScore <= 3 ? 'text-emerald-600' : p.painScore <= 6 ? 'text-amber-600' : 'text-red-600'}`}>{p.painScore}/10</span>
                          </td>
                          <td className="py-2 px-3 text-xs" style={{ color: 'var(--foreground)' }}>{p.mobilityScore}%</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
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

        {/* EQUIPMENT TAB */}
        {activeTab === 'equipment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Équipements de kinésithérapie</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>
                <Icon name="PlusIcon" size={16} />
                Ajouter équipement
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {equipment.map(eq => {
                const cfg = eqStatusConfig[eq.status as keyof typeof eqStatusConfig];
                return (
                  <div key={eq.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{eq.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Quantité', value: eq.qty.toString() },
                        { label: 'Dernière maint.', value: eq.lastMaintenance },
                        { label: 'Prochaine maint.', value: eq.nextMaintenance },
                      ].map(item => (
                        <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                          <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports & Statistiques</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Patients actifs', value: '18', color: '#3b82f6' },
                { label: 'Séances ce mois', value: '142', color: '#10b981' },
                { label: 'Taux réussite', value: '84%', color: '#f59e0b' },
                { label: 'Réduction douleur moy.', value: '-3.2', color: '#8b5cf6' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Rapport mensuel activité', desc: 'Séances, patients, thérapeutes — août 2025' },
                { title: 'Rapport résultats cliniques', desc: 'Évolution douleur, mobilité, objectifs atteints' },
                { title: 'Rapport équipements', desc: 'État, maintenance, utilisation' },
                { title: 'Rapport satisfaction patients', desc: 'Évaluation qualité des soins' },
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
