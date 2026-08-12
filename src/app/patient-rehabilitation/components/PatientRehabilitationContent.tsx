'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

type TabKey = 'program' | 'exercises' | 'progress' | 'goals' | 'journal';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'program', label: 'Mon programme', icon: 'ClipboardDocumentListIcon' },
  { key: 'exercises', label: 'Exercices prescrits', icon: 'BoltIcon' },
  { key: 'progress', label: 'Progression', icon: 'ChartBarIcon' },
  { key: 'goals', label: 'Objectifs fonctionnels', icon: 'TrophyIcon' },
  { key: 'journal', label: 'Journal de séances', icon: 'BookOpenIcon' },
];

const program = {
  patient: 'Aïcha Diallo',
  diagnosis: 'Gonarthrose droite — post-opératoire PTG',
  startDate: '01/07/2026',
  endDate: '30/09/2026',
  duration: '12 semaines',
  phase: 'Phase 2 — Renforcement musculaire',
  week: 6,
  totalWeeks: 12,
  team: [
    { role: 'Kinésithérapeute', name: 'M. Kouyaté', contact: '+221 77 123 45 67' },
    { role: 'Ergothérapeute', name: 'Mme Diallo', contact: '+221 77 234 56 78' },
    { role: 'Médecin référent', name: 'Dr. Ndiaye', contact: '+221 77 345 67 89' },
  ],
  nextSession: 'Mercredi 13/08/2026 à 10h00',
  sessionsCompleted: 18,
  totalSessions: 36,
};

const exercises = [
  { id: 'EX-001', name: 'Quadriceps isométrique', category: 'Renforcement', muscle: 'Quadriceps', sets: 3, reps: 15, duration: '—', frequency: 'Quotidien', difficulty: 'facile', instructions: 'Allongé sur le dos, contracter le quadriceps en appuyant le genou vers le sol. Maintenir 5 secondes.', precautions: 'Éviter si douleur > 4/10', completed: true },
  { id: 'EX-002', name: 'Flexion genou actif-aidé', category: 'Mobilité', muscle: 'Genou', sets: 3, reps: 10, duration: '—', frequency: 'Quotidien', difficulty: 'modéré', instructions: 'Assis au bord du lit, fléchir le genou avec aide de la jambe saine. Objectif: 90° de flexion.', precautions: 'Amplitude progressive, ne pas forcer', completed: true },
  { id: 'EX-003', name: 'Marche avec déambulateur', category: 'Marche', muscle: 'Membres inférieurs', sets: 1, reps: 1, duration: '10 min', frequency: '2x/jour', difficulty: 'modéré', instructions: 'Marcher avec déambulateur sur surface plane. Appui complet autorisé. Distance cible: 100m.', precautions: 'Chaussures antidérapantes obligatoires', completed: false },
  { id: 'EX-004', name: 'Élévation jambe tendue', category: 'Renforcement', muscle: 'Quadriceps / Psoas', sets: 3, reps: 12, duration: '—', frequency: 'Quotidien', difficulty: 'modéré', instructions: 'Allongé, lever la jambe tendue à 45°. Maintenir 3 secondes. Descendre lentement.', precautions: 'Pas de compensation lombaire', completed: false },
  { id: 'EX-005', name: 'Vélo ergomètre', category: 'Cardio-rééducation', muscle: 'Membres inférieurs', sets: 1, reps: 1, duration: '20 min', frequency: '3x/semaine', difficulty: 'modéré', instructions: 'Résistance légère, cadence 60 rpm. Selle haute pour limiter la flexion.', precautions: 'Arrêter si douleur > 5/10', completed: false },
  { id: 'EX-006', name: 'Cryothérapie post-exercice', category: 'Récupération', muscle: '—', sets: 1, reps: 1, duration: '15 min', frequency: 'Après chaque séance', difficulty: 'facile', instructions: 'Appliquer poche de glace sur le genou après chaque séance d\'exercice.', precautions: 'Interposer tissu entre glace et peau', completed: false },
];

const progressData = [
  { week: 'S1', flexion: 45, extension: 5, pain: 7, distance: 20 },
  { week: 'S2', flexion: 55, extension: 3, pain: 6, distance: 40 },
  { week: 'S3', flexion: 65, extension: 2, pain: 5, distance: 60 },
  { week: 'S4', flexion: 75, extension: 1, pain: 4, distance: 80 },
  { week: 'S5', flexion: 82, extension: 0, pain: 3, distance: 100 },
  { week: 'S6', flexion: 88, extension: 0, pain: 2, distance: 150 },
];

const functionalGoals = [
  { id: 'G-001', goal: 'Flexion genou ≥ 90°', category: 'Mobilité', target: 90, current: 88, unit: '°', deadline: '25/08/2026', status: 'in_progress', priority: 'high' },
  { id: 'G-002', goal: 'Marche sans aide technique', category: 'Marche', target: 100, current: 60, unit: '%', deadline: '15/09/2026', status: 'in_progress', priority: 'high' },
  { id: 'G-003', goal: 'Monter/descendre escaliers', category: 'Fonctionnel', target: 100, current: 30, unit: '%', deadline: '30/09/2026', status: 'in_progress', priority: 'medium' },
  { id: 'G-004', goal: 'Douleur ≤ 2/10 au repos', category: 'Douleur', target: 2, current: 2, unit: '/10', deadline: '01/08/2026', status: 'achieved', priority: 'high' },
  { id: 'G-005', goal: 'Reprise conduite automobile', category: 'Autonomie', target: 100, current: 0, unit: '%', deadline: '30/09/2026', status: 'pending', priority: 'medium' },
  { id: 'G-006', goal: 'Retour activité professionnelle', category: 'Autonomie', target: 100, current: 0, unit: '%', deadline: '30/09/2026', status: 'pending', priority: 'high' },
];

const sessions = [
  { id: 'SES-018', date: '11/08/2026', time: '10:00 - 11:30', therapist: 'M. Kouyaté', type: 'Kinésithérapie', exercises: ['Quadriceps isométrique', 'Flexion genou actif-aidé', 'Marche 150m'], pain: 2, fatigue: 3, mood: 4, notes: 'Bonne séance. Flexion atteint 88°. Patient motivé. Augmentation de la distance de marche à 150m.', completed: true },
  { id: 'SES-017', date: '09/08/2026', time: '10:00 - 11:30', therapist: 'M. Kouyaté', type: 'Kinésithérapie', exercises: ['Élévation jambe tendue', 'Vélo ergomètre 20min', 'Cryothérapie'], pain: 3, fatigue: 4, mood: 3, notes: 'Légère fatigue musculaire. Vélo bien toléré. Douleur modérée en fin de séance.', completed: true },
  { id: 'SES-016', date: '07/08/2026', time: '14:00 - 15:00', therapist: 'Mme Diallo', type: 'Ergothérapie', exercises: ['Activités vie quotidienne', 'Transferts lit-fauteuil', 'Habillage membre inférieur'], pain: 2, fatigue: 2, mood: 5, notes: 'Excellente séance ergothérapie. Patient autonome pour habillage. Transferts sécurisés.', completed: true },
  { id: 'SES-015', date: '05/08/2026', time: '10:00 - 11:30', therapist: 'M. Kouyaté', type: 'Kinésithérapie', exercises: ['Quadriceps isométrique', 'Flexion genou actif-aidé', 'Marche 100m'], pain: 3, fatigue: 3, mood: 4, notes: 'Progression régulière. Flexion à 85°. Marche 100m sans douleur significative.', completed: true },
];

const radarData = [
  { subject: 'Mobilité', current: 78, target: 100 },
  { subject: 'Force', current: 65, target: 100 },
  { subject: 'Équilibre', current: 70, target: 100 },
  { subject: 'Endurance', current: 55, target: 100 },
  { subject: 'Douleur', current: 80, target: 100 },
  { subject: 'Autonomie', current: 60, target: 100 },
];

const goalStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  achieved: { label: '✓ Atteint', bg: '#dcfce7', color: '#16a34a' },
  in_progress: { label: 'En cours', bg: '#dbeafe', color: '#1d4ed8' },
  pending: { label: 'À venir', bg: '#f3f4f6', color: '#6b7280' },
};

const difficultyConfig: Record<string, { bg: string; color: string }> = {
  facile: { bg: '#dcfce7', color: '#16a34a' },
  modéré: { bg: '#fef3c7', color: '#b45309' },
  difficile: { bg: '#fee2e2', color: '#dc2626' },
};

export default function PatientRehabilitationContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('program');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <Icon name="BoltIcon" className="w-5 h-5" style={{ color: 'var(--shifa-green)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rééducation & Réhabilitation</h1>
              <p className="text-sm text-gray-500">Programme personnalisé · Exercices · Progression · Objectifs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
              Semaine {program.week}/{program.totalWeeks}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#dcfce7', color: '#16a34a' }}>
              {program.phase}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Program Tab */}
        {activeTab === 'program' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{program.patient}</h2>
                  <p className="text-sm text-gray-600 mt-0.5">{program.diagnosis}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Prochain RDV</div>
                  <div className="font-semibold text-gray-900">{program.nextSession}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progression globale du programme</span>
                  <span className="font-semibold text-gray-900">{program.sessionsCompleted}/{program.totalSessions} séances</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full" style={{ width: `${(program.sessionsCompleted / program.totalSessions) * 100}%`, background: 'var(--shifa-green)' }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{program.startDate}</span>
                  <span>{Math.round((program.sessionsCompleted / program.totalSessions) * 100)}% complété</span>
                  <span>{program.endDate}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Durée</div>
                  <div className="font-semibold text-gray-900">{program.duration}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Phase actuelle</div>
                  <div className="font-semibold text-gray-900">{program.phase}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Séances complétées</div>
                  <div className="font-semibold text-gray-900">{program.sessionsCompleted}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Séances restantes</div>
                  <div className="font-semibold text-gray-900">{program.totalSessions - program.sessionsCompleted}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Équipe de rééducation</h3>
              <div className="grid grid-cols-3 gap-4">
                {program.team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                      <Icon name="UserCircleIcon" className="w-6 h-6" style={{ color: 'var(--shifa-green)' }} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                      <div className="text-xs text-blue-600">{member.contact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Exercices Prescrits — Aujourd'hui</h2>
              <span className="text-sm text-gray-500">{exercises.filter(e => e.completed).length}/{exercises.length} complétés</span>
            </div>
            <div className="grid gap-4">
              {exercises.map(ex => (
                <div key={ex.id} className={`bg-white rounded-xl p-5 border shadow-sm transition-all ${ex.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${ex.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {ex.completed && <Icon name="CheckIcon" className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{ex.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: difficultyConfig[ex.difficulty]?.bg, color: difficultyConfig[ex.difficulty]?.color }}>
                          {ex.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{ex.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ex.instructions}</p>
                      <div className="flex items-center gap-4 text-sm">
                        {ex.sets > 1 && <span className="text-gray-500"><span className="font-medium text-gray-700">{ex.sets} séries</span> × {ex.reps} rép.</span>}
                        {ex.duration !== '—' && <span className="text-gray-500">Durée: <span className="font-medium text-gray-700">{ex.duration}</span></span>}
                        <span className="text-gray-500">Fréquence: <span className="font-medium text-gray-700">{ex.frequency}</span></span>
                      </div>
                      {ex.precautions && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-amber-700">
                          <Icon name="ExclamationTriangleIcon" className="w-3.5 h-3.5" />
                          {ex.precautions}
                        </div>
                      )}
                    </div>
                    {!ex.completed && (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white flex-shrink-0" style={{ background: 'var(--shifa-green)' }}>
                        Marquer fait
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Suivi de Progression</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Amplitude de flexion (°)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 120]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="flexion" stroke="var(--shifa-green)" strokeWidth={2} dot={{ r: 4 }} name="Flexion (°)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Douleur (EVA /10)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pain" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} name="Douleur EVA" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Profil fonctionnel global</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar name="Actuel" dataKey="current" stroke="var(--shifa-green)" fill="var(--shifa-green)" fillOpacity={0.3} />
                  <Radar name="Objectif" dataKey="target" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeDasharray="4 4" />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Objectifs Fonctionnels</h2>
            <div className="grid gap-4">
              {functionalGoals.map(goal => (
                <div key={goal.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{goal.goal}</h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: goalStatusConfig[goal.status]?.bg, color: goalStatusConfig[goal.status]?.color }}>
                          {goalStatusConfig[goal.status]?.label}
                        </span>
                        {goal.priority === 'high' && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">Prioritaire</span>}
                      </div>
                      <p className="text-xs text-gray-500">{goal.category} · Échéance: {goal.deadline}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{goal.current}<span className="text-sm text-gray-400">{goal.unit}</span></div>
                      <div className="text-xs text-gray-500">/ {goal.target}{goal.unit}</div>
                    </div>
                  </div>
                  {goal.status !== 'pending' && (
                    <div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%`, background: goal.status === 'achieved' ? '#16a34a' : 'var(--shifa-blue)' }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1 text-right">{Math.round((goal.current / goal.target) * 100)}%</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Journal de Séances</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-green)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Ajouter séance
              </button>
            </div>
            <div className="grid gap-4">
              {sessions.map(ses => (
                <div key={ses.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{ses.id}</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Complétée</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{ses.type}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{ses.date} · {ses.time}</h3>
                      <p className="text-sm text-gray-500">Thérapeute: {ses.therapist}</p>
                    </div>
                    <div className="flex items-center gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold" style={{ color: ses.pain <= 3 ? '#16a34a' : ses.pain <= 6 ? '#f59e0b' : '#dc2626' }}>{ses.pain}/10</div>
                        <div className="text-xs text-gray-400">Douleur</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-700">{ses.fatigue}/5</div>
                        <div className="text-xs text-gray-400">Fatigue</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-500">{'⭐'.repeat(ses.mood)}</div>
                        <div className="text-xs text-gray-400">Humeur</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ses.exercises.map((ex, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">{ex}</span>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
                    {ses.notes}
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
