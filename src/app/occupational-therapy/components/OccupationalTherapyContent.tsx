'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type Tab = 'patients' | 'evaluations' | 'activities' | 'progress' | 'equipment' | 'reports';

const patients = [
  { id: 'OT-001', name: 'Mariama Diallo', age: 45, diagnosis: 'AVC — hémiplégie gauche', therapist: 'Ergo. Koné', sessions: 10, totalSessions: 30, adl: 52, iadl: 38, status: 'active', nextSession: "Aujourd\'hui 09h", goals: ['Autonomie AVQ', 'Préhension fine', 'Retour domicile'] },
  { id: 'OT-002', name: 'Boubacar Sow', age: 62, diagnosis: 'Polyarthrite rhumatoïde', therapist: 'Ergo. Bah', sessions: 6, totalSessions: 20, adl: 68, iadl: 55, status: 'active', nextSession: 'Demain 11h', goals: ['Économie articulaire', 'Orthèses', 'Maintien autonomie'] },
  { id: 'OT-003', name: 'Kadiatou Camara', age: 8, diagnosis: 'Paralysie cérébrale — diplégie', therapist: 'Ergo. Koné', sessions: 22, totalSessions: 40, adl: 45, iadl: 20, status: 'active', nextSession: '16 août 14h', goals: ['Écriture', 'Habillage', 'Jeu fonctionnel'] },
  { id: 'OT-004', name: 'Ibrahima Traoré', age: 55, diagnosis: 'Traumatisme crânien modéré', therapist: 'Ergo. Bah', sessions: 14, totalSessions: 35, adl: 60, iadl: 42, status: 'active', nextSession: '17 août 10h', goals: ['Mémoire procédurale', 'Cuisine adaptée', 'Reprise travail'] },
  { id: 'OT-005', name: 'Fatoumata Barry', age: 72, diagnosis: 'Fracture col fémur post-op', therapist: 'Ergo. Koné', sessions: 5, totalSessions: 15, adl: 40, iadl: 28, status: 'active', nextSession: '18 août 09h', goals: ['Transferts sécurisés', 'Aménagement domicile', 'Prévention chutes'] },
];

const evaluations = [
  { id: 'EV-001', patient: 'Mariama Diallo', date: '10 août', tool: 'MIF — Mesure d\'Indépendance Fonctionnelle', score: 72, maxScore: 126, domains: ['Soins personnels', 'Contrôle sphinctérien', 'Mobilité', 'Locomotion', 'Communication', 'Cognition sociale'], scores: [18, 12, 20, 14, 10, 8], therapist: 'Ergo. Koné', status: 'completed' },
  { id: 'EV-002', patient: 'Boubacar Sow', date: '08 août', tool: 'HAQ — Health Assessment Questionnaire', score: 1.8, maxScore: 3, domains: ['Habillage', 'Lever', 'Alimentation', 'Marche', 'Hygiène', 'Préhension'], scores: [2, 1.5, 1.5, 2, 2, 1.5], therapist: 'Ergo. Bah', status: 'completed' },
  { id: 'EV-003', patient: 'Kadiatou Camara', date: '05 août', tool: 'PEDI — Pediatric Evaluation of Disability Inventory', score: 45, maxScore: 100, domains: ['Soins personnels', 'Mobilité', 'Fonction sociale', 'Responsabilité'], scores: [40, 50, 45, 35], therapist: 'Ergo. Koné', status: 'completed' },
  { id: 'EV-004', patient: 'Ibrahima Traoré', date: '12 août', tool: 'LOTCA — Loewenstein Occupational Therapy Cognitive Assessment', score: 68, maxScore: 119, domains: ['Orientation', 'Perception', 'Visuomoteur', 'Opérations mentales', 'Attention'], scores: [18, 20, 15, 10, 5], therapist: 'Ergo. Bah', status: 'pending' },
];

const activities = [
  { id: 'ACT-001', name: 'Entraînement AVQ — Habillage', category: 'Activités de la vie quotidienne', duration: '30 min', difficulty: 'Modéré', indication: 'AVC, TC, polyarthrite', materials: ['Vêtements adaptés', 'Enfile-chaussettes', 'Crochet boutonnage'] },
  { id: 'ACT-002', name: 'Cuisine thérapeutique', category: 'IADL', duration: '45 min', difficulty: 'Modéré', indication: 'TC, démence, AVC', materials: ['Cuisine adaptée', 'Ustensiles ergonomiques', 'Tablier'] },
  { id: 'ACT-003', name: 'Préhension fine — Pinces', category: 'Motricité fine', duration: '20 min', difficulty: 'Variable', indication: 'AVC, polyarthrite, TC', materials: ['Pâte à modeler', 'Pinces graduées', 'Perles'] },
  { id: 'ACT-004', name: 'Jeu de construction adapté', category: 'Pédiatrique', duration: '30 min', difficulty: 'Facile', indication: 'Paralysie cérébrale, TSA', materials: ['Blocs Duplo', 'Puzzles adaptés', 'Jeux magnétiques'] },
  { id: 'ACT-005', name: 'Entraînement transferts', category: 'Mobilité fonctionnelle', duration: '25 min', difficulty: 'Modéré', indication: 'Fracture, AVC, chirurgie', materials: ['Planche de transfert', 'Lève-personne', 'Barres appui'] },
  { id: 'ACT-006', name: 'Écriture & graphomotricité', category: 'Motricité fine', duration: '20 min', difficulty: 'Variable', indication: 'Enfants, TC, AVC', materials: ['Stylos adaptés', 'Guides d\'écriture', 'Tablette graphique'] },
  { id: 'ACT-007', name: 'Gestion du stress — Relaxation', category: 'Santé mentale', duration: '30 min', difficulty: 'Facile', indication: 'Burn-out, anxiété, douleur chronique', materials: ['Tapis', 'Musique douce', 'Balles anti-stress'] },
];

const progressData = [
  { week: 'S1', adl: 35, iadl: 20, satisfaction: 40 },
  { week: 'S3', adl: 42, iadl: 28, satisfaction: 52 },
  { week: 'S5', adl: 50, iadl: 35, satisfaction: 60 },
  { week: 'S7', adl: 55, iadl: 40, satisfaction: 68 },
  { week: 'S9', adl: 60, iadl: 46, satisfaction: 75 },
  { week: 'S11', adl: 65, iadl: 52, satisfaction: 80 },
];

const radarData = [
  { subject: 'Soins personnels', value: 65 },
  { subject: 'Mobilité', value: 72 },
  { subject: 'Cognition', value: 58 },
  { subject: 'Communication', value: 70 },
  { subject: 'Participation', value: 55 },
  { subject: 'Environnement', value: 62 },
];

const equipment = [
  { id: 'EQ-001', name: 'Table de travail réglable', category: 'Mobilier adapté', status: 'available', condition: 'Bon', lastMaintenance: '01 juil' },
  { id: 'EQ-002', name: 'Orthèses de repos main', category: 'Orthèses', status: 'in_use', condition: 'Bon', lastMaintenance: '15 juil' },
  { id: 'EQ-003', name: 'Lève-personne électrique', category: 'Aide à la mobilité', status: 'available', condition: 'Excellent', lastMaintenance: '10 août' },
  { id: 'EQ-004', name: 'Cuisine thérapeutique équipée', category: 'Espace thérapeutique', status: 'available', condition: 'Bon', lastMaintenance: '20 juil' },
  { id: 'EQ-005', name: 'Tablette graphique Wacom', category: 'Technologie assistive', status: 'in_use', condition: 'Bon', lastMaintenance: '05 août' },
  { id: 'EQ-006', name: 'Bac de sable thérapeutique', category: 'Pédiatrique', status: 'available', condition: 'Bon', lastMaintenance: '01 août' },
];

const kpis = [
  { label: 'Patients actifs', value: '24', icon: 'UsersIcon', color: '#3b82f6' },
  { label: 'Séances ce mois', value: '186', icon: 'CalendarDaysIcon', color: '#10b981' },
  { label: 'Score ADL moyen', value: '61%', icon: 'ChartBarIcon', color: '#8b5cf6' },
  { label: 'Taux d\'atteinte objectifs', value: '74%', icon: 'CheckCircleIcon', color: '#f59e0b' },
];

export default function OccupationalTherapyContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [selectedEval, setSelectedEval] = useState<typeof evaluations[0] | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'evaluations', label: 'Évaluations fonctionnelles', icon: 'ClipboardDocumentListIcon' },
    { key: 'activities', label: 'Activités thérapeutiques', icon: 'SparklesIcon' },
    { key: 'progress', label: 'Suivi & Progrès', icon: 'ChartBarIcon' },
    { key: 'equipment', label: 'Équipements & Aides', icon: 'WrenchScrewdriverIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
              <Icon name="HandRaisedIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Ergothérapie</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Réadaptation fonctionnelle & autonomie</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau patient
          </button>
        </div>
        {/* KPIs */}
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
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? 'text-white' : ''}`}
              style={tab === t.key ? { backgroundColor: '#8b5cf6', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              <Icon name={t.icon as any} size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* PATIENTS TAB */}
        {tab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {patients.map(p => (
                <div key={p.id} onClick={() => setSelectedPatient(p)}
                  className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#8b5cf6' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans · {p.therapist}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Actif</span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>{p.diagnosis}</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>ADL</span><span>{p.adl}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${p.adl}%`, backgroundColor: '#8b5cf6' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                        <span>IADL</span><span>{p.iadl}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${p.iadl}%`, backgroundColor: '#6d28d9' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Séances: {p.sessions}/{p.totalSessions}</span>
                    <span>Prochain: {p.nextSession}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {selectedPatient ? (
                <div className="rounded-xl border p-4 sticky top-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--foreground)' }}>Objectifs thérapeutiques</p>
                    {selectedPatient.goals.map((g, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{g}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#8b5cf6' }}>{selectedPatient.adl}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score ADL</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#6d28d9' }}>{selectedPatient.iadl}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Score IADL</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>Nouvelle séance</button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Évaluation</button>
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

        {/* EVALUATIONS TAB */}
        {tab === 'evaluations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {evaluations.map(ev => (
                <div key={ev.id} onClick={() => setSelectedEval(ev)}
                  className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedEval?.id === ev.id ? '#8b5cf6' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{ev.patient}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ev.tool}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={ev.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#fef9c3', color: '#ca8a04' }}>
                      {ev.status === 'completed' ? 'Complété' : 'En attente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span style={{ color: 'var(--muted-foreground)' }}>Score: <strong style={{ color: 'var(--foreground)' }}>{ev.score}/{ev.maxScore}</strong></span>
                    <span style={{ color: 'var(--muted-foreground)' }}>Date: {ev.date}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{ev.therapist}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-medium" style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}>
                + Nouvelle évaluation
              </button>
            </div>
            <div>
              {selectedEval ? (
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{selectedEval.patient}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedEval.tool}</p>
                  <div className="rounded-lg p-3 mb-3 text-center" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{selectedEval.score}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>/ {selectedEval.maxScore}</p>
                  </div>
                  <div className="space-y-2">
                    {selectedEval.domains.map((d, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          <span>{d}</span><span>{selectedEval.scores[i]}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${(selectedEval.scores[i] / 25) * 100}%`, backgroundColor: '#8b5cf6' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Icon name="ClipboardDocumentListIcon" size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez une évaluation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {tab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(a => (
              <div key={a.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{a.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>{a.difficulty}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#8b5cf6' }}>{a.category}</p>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Indication: {a.indication}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Durée: {a.duration}</p>
                <div className="mb-3">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>Matériel:</p>
                  <div className="flex flex-wrap gap-1">
                    {a.materials.map((m, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>{m}</span>
                    ))}
                  </div>
                </div>
                <button className="w-full py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>Prescrire</button>
              </div>
            ))}
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution ADL / IADL</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="adl" stroke="#8b5cf6" strokeWidth={2} name="ADL" dot={false} />
                  <Line type="monotone" dataKey="iadl" stroke="#6d28d9" strokeWidth={2} name="IADL" dot={false} />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Profil fonctionnel</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Atteinte des objectifs par patient</h3>
              <div className="space-y-3">
                {patients.map(p => (
                  <div key={p.id}>
                    <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                      <span>{p.name}</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{p.sessions}/{p.totalSessions} séances</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${(p.sessions / p.totalSessions) * 100}%`, backgroundColor: '#8b5cf6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EQUIPMENT TAB */}
        {tab === 'equipment' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Équipements & Aides techniques</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>
                <Icon name="PlusIcon" size={14} />Ajouter
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map(eq => (
                <div key={eq.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{eq.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={eq.status === 'available' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#fef9c3', color: '#ca8a04' }}>
                      {eq.status === 'available' ? 'Disponible' : 'En utilisation'}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#8b5cf6' }}>{eq.category}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>État: {eq.condition}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière maintenance: {eq.lastMaintenance}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {tab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Rapport mensuel d\'activité', desc: 'Séances, patients, objectifs atteints', date: 'Août 2026', icon: 'DocumentChartBarIcon' },
              { title: 'Bilan fonctionnel individuel', desc: 'ADL/IADL, MIF, HAQ par patient', date: 'Août 2026', icon: 'ClipboardDocumentListIcon' },
              { title: 'Rapport d\'équipements', desc: 'État, utilisation, maintenance', date: 'Août 2026', icon: 'WrenchScrewdriverIcon' },
              { title: 'Statistiques thérapeutiques', desc: 'Taux de réussite, durée moyenne', date: 'Août 2026', icon: 'ChartBarIcon' },
            ].map((r, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
                    <Icon name={r.icon as any} size={18} style={{ color: '#7c3aed' }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date}</span>
                  <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#8b5cf6' }}>
                    <Icon name="ArrowDownTrayIcon" size={12} />Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
