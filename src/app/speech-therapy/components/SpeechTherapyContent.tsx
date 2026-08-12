'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'patients' | 'sessions' | 'disorders' | 'exercises' | 'progress' | 'reports';

const patients = [
  { id: 'ORT-001', name: 'Aminata Kouyaté', age: 6, diagnosis: 'Retard de langage — dysphasie', therapist: 'Ortho. Diallo', sessions: 12, totalSessions: 40, langScore: 45, artScore: 52, status: 'active', nextSession: "Aujourd\'hui 10h" },
  { id: 'ORT-002', name: 'Moussa Barry', age: 8, diagnosis: 'Bégaiement — fluence', therapist: 'Ortho. Sow', sessions: 8, totalSessions: 30, langScore: 62, artScore: 70, status: 'active', nextSession: 'Demain 14h' },
  { id: 'ORT-003', name: 'Fatoumata Camara', age: 55, diagnosis: 'Aphasie post-AVC', therapist: 'Ortho. Diallo', sessions: 20, totalSessions: 50, langScore: 38, artScore: 42, status: 'active', nextSession: '16 août 09h' },
  { id: 'ORT-004', name: 'Ibrahima Sow', age: 10, diagnosis: 'Dyslexie — troubles lecture', therapist: 'Ortho. Sow', sessions: 15, totalSessions: 35, langScore: 55, artScore: 68, status: 'active', nextSession: '17 août 11h' },
  { id: 'ORT-005', name: 'Kadiatou Balde', age: 4, diagnosis: 'Trouble phonologique', therapist: 'Ortho. Diallo', sessions: 6, totalSessions: 25, langScore: 40, artScore: 35, status: 'active', nextSession: '18 août 10h' },
];

const sessions = [
  { id: 'S-001', patient: 'Aminata Kouyaté', date: "Aujourd\'hui 10h", duration: 45, type: 'Rééducation langage oral', therapist: 'Ortho. Diallo', objectives: ['Enrichissement lexical', 'Morphosyntaxe', 'Compréhension'], notes: 'Bonne progression sur le vocabulaire. Difficultés persistantes en syntaxe.', status: 'scheduled' },
  { id: 'S-002', patient: 'Moussa Barry', date: 'Hier 14h', duration: 30, type: 'Thérapie fluence', therapist: 'Ortho. Sow', objectives: ['Respiration', 'Débit', 'Relaxation'], notes: 'Réduction du bégaiement en lecture. Continuer exercices de respiration.', status: 'completed' },
  { id: 'S-003', patient: 'Fatoumata Camara', date: 'Hier 09h', duration: 60, type: 'Rééducation aphasie', therapist: 'Ortho. Diallo', objectives: ['Dénomination', 'Compréhension orale', 'Expression'], notes: 'Amélioration dénomination d\'images. Expression spontanée encore limitée.', status: 'completed' },
];

const disorders = [
  { name: 'Dysphasie / Retard de langage', category: 'Langage oral', prevalence: '5-7% enfants', tools: ['EVALO 2-6', 'NEEL', 'ECOSSE'], approach: 'Stimulation langage, jeux symboliques, narration' },
  { name: 'Bégaiement', category: 'Fluence', prevalence: '1% population', tools: ['SSI-4', 'OASES', 'PSI'], approach: 'Thérapie fluence, relaxation, désensibilisation' },
  { name: 'Aphasie', category: 'Neurologique', prevalence: 'Post-AVC', tools: ['BDAE', 'MT86', 'LAST'], approach: 'Rééducation intensive, CAA, approche pragmatique' },
  { name: 'Dyslexie', category: 'Langage écrit', prevalence: '5-10% enfants', tools: ['Alouette-R', 'LMC-R', 'BALE'], approach: 'Méthode phonologique, entraînement fluence lecture' },
  { name: 'Trouble phonologique', category: 'Articulation', prevalence: '2-3% enfants', tools: ['EDA', 'BEPA', 'BILO-3C'], approach: 'Discrimination auditive, production phonèmes cibles' },
  { name: 'Dysarthrie', category: 'Motricité bucco-faciale', prevalence: 'Neurologique', tools: ['FDA-2', 'BECD', 'Frenchay'], approach: 'Exercices praxies, respiration, prosodie' },
];

const exercises = [
  { name: 'Jeu de dénomination d\'images', category: 'Lexique', age: '3-8 ans', duration: '15 min', objective: 'Enrichissement vocabulaire' },
  { name: 'Lecture de syllabes — fluence', category: 'Lecture', age: '6-12 ans', duration: '20 min', objective: 'Automatisation décodage' },
  { name: 'Exercices de respiration abdominale', category: 'Fluence', age: 'Tous', duration: '10 min', objective: 'Contrôle débit parole' },
  { name: 'Narration d\'histoire séquentielle', category: 'Discours', age: '4-10 ans', duration: '20 min', objective: 'Structure narrative' },
  { name: 'Praxies bucco-faciales', category: 'Motricité', age: 'Tous', duration: '10 min', objective: 'Mobilité articulatoire' },
  { name: 'Discrimination phonémique', category: 'Phonologie', age: '3-7 ans', duration: '15 min', objective: 'Conscience phonologique' },
];

const progressData = [
  { session: 'S1', lang: 30, artic: 35, compre: 40 },
  { session: 'S5', lang: 38, artic: 42, compre: 48 },
  { session: 'S10', lang: 45, artic: 52, compre: 55 },
  { session: 'S15', lang: 52, artic: 60, compre: 62 },
  { session: 'S20', lang: 60, artic: 68, compre: 70 },
];

const kpis = [
  { label: 'Patients actifs', value: '18', icon: 'UsersIcon', color: '#06b6d4' },
  { label: 'Séances ce mois', value: '142', icon: 'CalendarDaysIcon', color: '#10b981' },
  { label: 'Score langage moyen', value: '48%', icon: 'ChatBubbleLeftRightIcon', color: '#f59e0b' },
  { label: 'Progression moyenne', value: '+12%', icon: 'ArrowTrendingUpIcon', color: '#8b5cf6' },
];

export default function SpeechTherapyContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'sessions', label: 'Séances', icon: 'CalendarDaysIcon' },
    { key: 'disorders', label: 'Troubles & Protocoles', icon: 'BookOpenIcon' },
    { key: 'exercises', label: 'Exercices', icon: 'SparklesIcon' },
    { key: 'progress', label: 'Suivi & Progrès', icon: 'ChartBarIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Orthophonie</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Troubles du langage & de la communication</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>
            <Icon name="PlusIcon" size={16} />Nouveau patient
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {kpis.map(k => (
            <div key={k.label} className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={k.icon as any} size={14} style={{ color: k.color }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              style={tab === t.key ? { backgroundColor: '#06b6d4', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              <Icon name={t.icon as any} size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {patients.map(p => (
                <div key={p.id} onClick={() => setSelectedPatient(p)}
                  className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#06b6d4' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans · {p.therapist}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#cffafe', color: '#0e7490' }}>Actif</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>{p.diagnosis}</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Langage</span><span>{p.langScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${p.langScore}%`, backgroundColor: '#06b6d4' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Articulation</span><span>{p.artScore}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${p.artScore}%`, backgroundColor: '#0891b2' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Séances: {p.sessions}/{p.totalSessions}</span>
                    <span>Prochain: {p.nextSession}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {selectedPatient ? (
                <div className="rounded-xl border p-4 sticky top-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#06b6d4' }}>{selectedPatient.langScore}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Langage</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#0891b2' }}>{selectedPatient.artScore}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Articulation</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>Nouvelle séance</button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Bilan</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Icon name="UserIcon" size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un patient</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'sessions' && (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{s.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.type} · {s.duration} min · {s.therapist}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={s.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#cffafe', color: '#0e7490' }}>
                      {s.status === 'completed' ? 'Terminée' : 'Planifiée'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {s.objectives.map((o, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#cffafe', color: '#0e7490' }}>{o}</span>
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.notes}</p>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium" style={{ borderColor: '#06b6d4', color: '#06b6d4' }}>
              + Planifier une séance
            </button>
          </div>
        )}

        {tab === 'disorders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disorders.map((d, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{d.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{ backgroundColor: '#cffafe', color: '#0e7490' }}>{d.category}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Prévalence: {d.prevalence}</p>
                <div className="mb-2">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Outils d'évaluation:</p>
                  <div className="flex flex-wrap gap-1">
                    {d.tools.map((t, j) => (
                      <span key={j} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Approche: {d.approach}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'exercises' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((e, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{e.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#cffafe', color: '#0e7490' }}>{e.category}</span>
                <div className="mt-2 space-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <p>Âge: {e.age}</p>
                  <p>Durée: {e.duration}</p>
                  <p>Objectif: {e.objective}</p>
                </div>
                <button className="w-full mt-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#06b6d4' }}>Prescrire</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution des scores</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="lang" stroke="#06b6d4" strokeWidth={2} name="Langage" dot={false} />
                  <Line type="monotone" dataKey="artic" stroke="#0891b2" strokeWidth={2} name="Articulation" dot={false} />
                  <Line type="monotone" dataKey="compre" stroke="#10b981" strokeWidth={2} name="Compréhension" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Progression par patient</h3>
              <div className="space-y-3">
                {patients.map(p => (
                  <div key={p.id}>
                    <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      <span>{p.name}</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{p.sessions}/{p.totalSessions}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${(p.sessions / p.totalSessions) * 100}%`, backgroundColor: '#06b6d4' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Rapport mensuel d\'activité', 'Bilan orthophonique individuel', 'Statistiques par trouble', 'Rapport de progression'].map((r, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>{r}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Août 2026</p>
                <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#06b6d4' }}>
                  <Icon name="ArrowDownTrayIcon" size={12} />Télécharger PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
