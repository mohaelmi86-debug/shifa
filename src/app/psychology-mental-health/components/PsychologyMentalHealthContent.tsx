'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

type Tab = 'patients' | 'consultations' | 'assessments' | 'therapy' | 'crisis' | 'reports';

const patients = [
  { id: 'PSY-001', name: 'Aïcha Diallo', age: 32, diagnosis: 'Trouble dépressif majeur', therapist: 'Dr. Koné', sessions: 8, phq9: 14, gad7: 10, status: 'active', risk: 'moderate', nextSession: "Aujourd\'hui 14h" },
  { id: 'PSY-002', name: 'Mamadou Traoré', age: 45, diagnosis: 'Trouble anxieux généralisé', therapist: 'Dr. Bah', sessions: 12, phq9: 8, gad7: 16, status: 'active', risk: 'low', nextSession: 'Demain 10h' },
  { id: 'PSY-003', name: 'Kadiatou Sow', age: 28, diagnosis: 'PTSD — trauma relationnel', therapist: 'Dr. Koné', sessions: 20, phq9: 18, gad7: 14, status: 'active', risk: 'high', nextSession: '16 août 11h' },
  { id: 'PSY-004', name: 'Ibrahima Barry', age: 19, diagnosis: 'Trouble bipolaire type II', therapist: 'Dr. Bah', sessions: 15, phq9: 12, gad7: 9, status: 'active', risk: 'moderate', nextSession: '17 août 15h' },
  { id: 'PSY-005', name: 'Fatoumata Camara', age: 55, diagnosis: 'Burn-out professionnel', therapist: 'Dr. Koné', sessions: 6, phq9: 10, gad7: 12, status: 'active', risk: 'low', nextSession: '18 août 09h' },
];

const consultations = [
  { id: 'C-001', patient: 'Aïcha Diallo', date: "Aujourd\'hui 14h", type: 'TCC — Séance 8', therapist: 'Dr. Koné', mood: 4, energy: 3, sleep: 5, notes: 'Travail sur les pensées automatiques négatives. Exercice de restructuration cognitive.', homework: 'Journal des pensées, 3x/semaine', status: 'scheduled' },
  { id: 'C-002', patient: 'Mamadou Traoré', date: 'Hier 10h', type: 'Thérapie ACT — Séance 12', therapist: 'Dr. Bah', mood: 6, energy: 5, sleep: 6, notes: 'Bonne progression sur l\'acceptation. Exercices de pleine conscience bien intégrés.', homework: 'Méditation guidée 10 min/jour', status: 'completed' },
  { id: 'C-003', patient: 'Kadiatou Sow', date: 'Avant-hier 11h', type: 'EMDR — Séance 20', therapist: 'Dr. Koné', mood: 3, energy: 4, sleep: 4, notes: 'Retraitement souvenir traumatique. Réduction SUD de 8 à 4. Continuer protocole.', homework: 'Exercice ancrage sécurité', status: 'completed' },
];

const assessments = [
  { tool: 'PHQ-9', fullName: 'Patient Health Questionnaire', domain: 'Dépression', patient: 'Aïcha Diallo', score: 14, maxScore: 27, severity: 'Modérée', date: '10 août', color: '#f59e0b' },
  { tool: 'GAD-7', fullName: 'Generalized Anxiety Disorder Scale', domain: 'Anxiété', patient: 'Mamadou Traoré', score: 16, maxScore: 21, severity: 'Sévère', date: '08 août', color: '#ef4444' },
  { tool: 'PCL-5', fullName: 'PTSD Checklist for DSM-5', domain: 'PTSD', patient: 'Kadiatou Sow', score: 52, maxScore: 80, severity: 'Sévère', date: '05 août', color: '#ef4444' },
  { tool: 'MDQ', fullName: 'Mood Disorder Questionnaire', domain: 'Bipolarité', patient: 'Ibrahima Barry', score: 7, maxScore: 13, severity: 'Positif', date: '12 août', color: '#8b5cf6' },
  { tool: 'MBI', fullName: 'Maslach Burnout Inventory', domain: 'Burn-out', patient: 'Fatoumata Camara', score: 42, maxScore: 54, severity: 'Élevé', date: '07 août', color: '#f59e0b' },
];

const therapyApproaches = [
  { name: 'TCC — Thérapie Cognitivo-Comportementale', indication: 'Dépression, anxiété, phobies, TOC', sessions: '12-20', evidence: 'Niveau A', color: '#3b82f6' },
  { name: 'EMDR', indication: 'PTSD, traumatismes, deuil', sessions: '8-15', evidence: 'Niveau A', color: '#10b981' },
  { name: 'ACT — Acceptance & Commitment Therapy', indication: 'Anxiété, dépression, douleur chronique', sessions: '10-16', evidence: 'Niveau A', color: '#8b5cf6' },
  { name: 'Thérapie des schémas', indication: 'Troubles personnalité, trauma complexe', sessions: '20-40', evidence: 'Niveau B', color: '#f59e0b' },
  { name: 'Pleine conscience (MBSR)', indication: 'Stress, prévention rechute dépressive', sessions: '8 semaines', evidence: 'Niveau A', color: '#06b6d4' },
  { name: 'Thérapie interpersonnelle (TIP)', indication: 'Dépression, deuil, conflits relationnels', sessions: '12-16', evidence: 'Niveau A', color: '#ec4899' },
];

const moodData = [
  { week: 'S1', mood: 3, anxiety: 8, sleep: 4 },
  { week: 'S3', mood: 4, anxiety: 7, sleep: 5 },
  { week: 'S5', mood: 5, anxiety: 6, sleep: 6 },
  { week: 'S7', mood: 6, anxiety: 5, sleep: 6 },
  { week: 'S9', mood: 6, anxiety: 4, sleep: 7 },
  { week: 'S11', mood: 7, anxiety: 3, sleep: 7 },
];

const radarData = [
  { subject: 'Humeur', value: 60 },
  { subject: 'Anxiété', value: 45 },
  { subject: 'Sommeil', value: 65 },
  { subject: 'Énergie', value: 55 },
  { subject: 'Relations', value: 70 },
  { subject: 'Fonctionnement', value: 58 },
];

const kpis = [
  { label: 'Patients actifs', value: '22', icon: 'UsersIcon', color: '#ec4899' },
  { label: 'Séances ce mois', value: '168', icon: 'CalendarDaysIcon', color: '#10b981' },
  { label: 'PHQ-9 moyen', value: '12.4', icon: 'HeartIcon', color: '#f59e0b' },
  { label: 'Patients à risque élevé', value: '3', icon: 'ExclamationTriangleIcon', color: '#ef4444' },
];

const riskColors: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: '#dcfce7', text: '#16a34a', label: 'Faible' },
  moderate: { bg: '#fef9c3', text: '#ca8a04', label: 'Modéré' },
  high: { bg: '#fee2e2', text: '#dc2626', label: 'Élevé' },
};

export default function PsychologyMentalHealthContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'consultations', label: 'Consultations', icon: 'CalendarDaysIcon' },
    { key: 'assessments', label: 'Évaluations cliniques', icon: 'ClipboardDocumentListIcon' },
    { key: 'therapy', label: 'Approches thérapeutiques', icon: 'BookOpenIcon' },
    { key: 'crisis', label: 'Suivi & Humeur', icon: 'ChartBarIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
              <Icon name="HeartIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Psychologie & Santé Mentale</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Psychologie clinique & suivi thérapeutique</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#ec4899' }}>
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
              style={tab === t.key ? { backgroundColor: '#ec4899', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              <Icon name={t.icon as any} size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {patients.map(p => {
                const risk = riskColors[p.risk];
                return (
                  <div key={p.id} onClick={() => setSelectedPatient(p)}
                    className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                    style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#ec4899' : 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans · {p.therapist}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: risk.bg, color: risk.text }}>Risque {risk.label}</span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>{p.diagnosis}</p>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PHQ-9:</span>
                        <span className="text-sm font-bold" style={{ color: p.phq9 >= 15 ? '#ef4444' : p.phq9 >= 10 ? '#f59e0b' : '#10b981' }}>{p.phq9}/27</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>GAD-7:</span>
                        <span className="text-sm font-bold" style={{ color: p.gad7 >= 15 ? '#ef4444' : p.gad7 >= 10 ? '#f59e0b' : '#10b981' }}>{p.gad7}/21</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Séances: {p.sessions}</span>
                      <span>Prochain: {p.nextSession}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {selectedPatient ? (
                <div className="rounded-xl border p-4 sticky top-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: selectedPatient.phq9 >= 15 ? '#ef4444' : '#f59e0b' }}>{selectedPatient.phq9}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PHQ-9</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: selectedPatient.gad7 >= 15 ? '#ef4444' : '#f59e0b' }}>{selectedPatient.gad7}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>GAD-7</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#ec4899' }}>Nouvelle séance</button>
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

        {tab === 'consultations' && (
          <div className="space-y-4">
            {consultations.map(c => (
              <div key={c.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{c.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.type} · {c.therapist} · {c.date}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={c.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#fce7f3', color: '#be185d' }}>
                    {c.status === 'completed' ? 'Terminée' : 'Planifiée'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[{ label: 'Humeur', value: c.mood }, { label: 'Énergie', value: c.energy }, { label: 'Sommeil', value: c.sleep }].map(m => (
                    <div key={m.label} className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: m.value >= 6 ? '#10b981' : m.value >= 4 ? '#f59e0b' : '#ef4444' }}>{m.value}/10</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>{c.notes}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Devoir: {c.homework}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'assessments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((a, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg" style={{ color: a.color }}>{a.tool}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.fullName}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${a.color}20`, color: a.color }}>{a.severity}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold" style={{ color: a.color }}>{a.score}</span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>/ {a.maxScore}</span>
                </div>
                <div className="h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--border)' }}>
                  <div className="h-2 rounded-full" style={{ width: `${(a.score / a.maxScore) * 100}%`, backgroundColor: a.color }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Évalué le {a.date}</p>
              </div>
            ))}
            <button className="rounded-xl border-2 border-dashed p-4 text-sm font-medium" style={{ borderColor: '#ec4899', color: '#ec4899' }}>
              + Nouvelle évaluation
            </button>
          </div>
        )}

        {tab === 'therapy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {therapyApproaches.map((t, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ backgroundColor: `${t.color}20`, color: t.color }}>{t.evidence}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Indication: {t.indication}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Durée: {t.sessions} séances</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'crisis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution humeur / anxiété / sommeil</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} name="Humeur" dot={false} />
                  <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} name="Anxiété" dot={false} />
                  <Line type="monotone" dataKey="sleep" stroke="#10b981" strokeWidth={2} name="Sommeil" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Profil clinique global</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 rounded-xl border p-4" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ExclamationTriangleIcon" size={18} style={{ color: '#dc2626' }} />
                <p className="font-semibold text-sm" style={{ color: '#dc2626' }}>Protocole de crise — Accès rapide</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Ligne de crise: 3114', 'SAMU: 15', 'Urgences psychiatriques'].map((c, i) => (
                  <button key={i} className="py-2 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#dc2626' }}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Rapport mensuel clinique', 'Bilan psychologique individuel', 'Statistiques par diagnostic', 'Rapport de suivi thérapeutique'].map((r, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>{r}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Août 2026</p>
                <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#ec4899' }}>
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
