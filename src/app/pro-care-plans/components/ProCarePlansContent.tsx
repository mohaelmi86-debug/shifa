'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'builder' | 'detail';
type BuilderStep = 'template' | 'patient' | 'timeline' | 'schedules' | 'goals' | 'review';

interface CarePlanTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  interventions: number;
  icon: string;
  color: string;
  tags: string[];
}

interface AssignedPatient {
  id: string;
  name: string;
  age: number;
  avatar: string;
  condition: string;
  planStatus: 'active' | 'paused' | 'completed' | 'draft';
  progress: number;
  startDate: string;
  endDate: string;
  nextMilestone: string;
  compliance: number;
  alerts: number;
}

interface Intervention {
  id: string;
  title: string;
  type: 'medication' | 'therapy' | 'monitoring' | 'lab' | 'imaging' | 'consultation' | 'education';
  startWeek: number;
  durationWeeks: number;
  frequency: string;
  responsible: string;
  notes: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  metric: string;
  targetValue: string;
  currentValue: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'missed';
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  achieved: boolean;
  achievedDate?: string;
}

interface Schedule {
  id: string;
  type: 'medication' | 'therapy' | 'monitoring';
  name: string;
  dosage?: string;
  frequency: string;
  time: string[];
  duration: string;
  instructions: string;
  active: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const templates: CarePlanTemplate[] = [
  {
    id: 't1', name: 'Diabète type 2 — Contrôle glycémique', category: 'Endocrinologie',
    description: 'Plan structuré pour la gestion du diabète type 2 avec suivi glycémique, adaptation thérapeutique et éducation nutritionnelle.',
    duration: '12 semaines', interventions: 8, icon: 'BeakerIcon', color: '#8b5cf6',
    tags: ['Glycémie', 'HbA1c', 'Nutrition', 'Activité physique'],
  },
  {
    id: 't2', name: 'Insuffisance cardiaque — Stabilisation', category: 'Cardiologie',
    description: 'Protocole de suivi intensif pour patients insuffisants cardiaques avec surveillance des signes de décompensation.',
    duration: '8 semaines', interventions: 12, icon: 'HeartIcon', color: '#e11d48',
    tags: ['Poids quotidien', 'BNP', 'Diurétiques', 'Restriction sodée'],
  },
  {
    id: 't3', name: 'HTA — Contrôle tensionnel', category: 'Cardiologie',
    description: 'Plan de prise en charge de l\'hypertension artérielle avec objectifs tensionnels, adaptation médicamenteuse et hygiène de vie.',
    duration: '16 semaines', interventions: 6, icon: 'HeartIcon', color: '#f97316',
    tags: ['TA', 'Sel', 'Activité physique', 'Observance'],
  },
  {
    id: 't4', name: 'Asthme — Contrôle et prévention', category: 'Pneumologie',
    description: 'Gestion de l\'asthme chronique avec plan d\'action, surveillance des symptômes et éducation thérapeutique.',
    duration: '12 semaines', interventions: 5, icon: 'CloudIcon', color: '#0ea5e9',
    tags: ['DEP', 'Inhalateurs', 'Facteurs déclenchants', 'Urgences'],
  },
  {
    id: 't5', name: 'Post-AVC — Rééducation', category: 'Neurologie',
    description: 'Programme de rééducation post-AVC multidisciplinaire avec kinésithérapie, orthophonie et suivi neurologique.',
    duration: '24 semaines', interventions: 15, icon: 'BoltIcon', color: '#10b981',
    tags: ['Kinésithérapie', 'Orthophonie', 'Neurologie', 'Autonomie'],
  },
  {
    id: 't6', name: 'Grossesse à risque — Suivi renforcé', category: 'Obstétrique',
    description: 'Protocole de surveillance intensifiée pour grossesses à risque avec consultations rapprochées et bilans ciblés.',
    duration: 'Jusqu\'à l\'accouchement', interventions: 10, icon: 'SparklesIcon', color: '#ec4899',
    tags: ['Échographies', 'TA', 'Glycémie', 'Croissance fœtale'],
  },
  {
    id: 't7', name: 'BPCO — Réhabilitation respiratoire', category: 'Pneumologie',
    description: 'Programme de réhabilitation respiratoire pour patients BPCO avec entraînement à l\'effort et éducation.',
    duration: '20 semaines', interventions: 9, icon: 'CloudIcon', color: '#64748b',
    tags: ['Spirométrie', 'Réhabilitation', 'Bronchodilatateurs', 'Oxygène'],
  },
  {
    id: 't8', name: 'Plan personnalisé (vide)', category: 'Personnalisé',
    description: 'Créez un plan de soins entièrement personnalisé à partir de zéro selon les besoins spécifiques du patient.',
    duration: 'À définir', interventions: 0, icon: 'PlusCircleIcon', color: '#6366f1',
    tags: ['Personnalisé'],
  },
];

const assignedPatients: AssignedPatient[] = [
  { id: 'p1', name: 'Aïcha Diallo', age: 42, avatar: 'AD', condition: 'Diabète type 2 + HTA', planStatus: 'active', progress: 62, startDate: '01 juil. 2026', endDate: '30 sept. 2026', nextMilestone: 'HbA1c < 7%', compliance: 68, alerts: 2 },
  { id: 'p2', name: 'Moussa Traoré', age: 58, avatar: 'MT', condition: 'Insuffisance cardiaque', planStatus: 'active', progress: 35, startDate: '15 juil. 2026', endDate: '10 sept. 2026', nextMilestone: 'Stabilisation poids', compliance: 42, alerts: 4 },
  { id: 'p3', name: 'Fatou Ndiaye', age: 35, avatar: 'FN', condition: 'Asthme chronique', planStatus: 'active', progress: 78, startDate: '01 juin 2026', endDate: '31 août 2026', nextMilestone: 'DEP > 80%', compliance: 91, alerts: 0 },
  { id: 'p4', name: 'Ibrahima Sow', age: 67, avatar: 'IS', condition: 'BPCO stade III', planStatus: 'paused', progress: 45, startDate: '01 mai 2026', endDate: '30 sept. 2026', nextMilestone: 'Spirométrie contrôle', compliance: 74, alerts: 1 },
  { id: 'p5', name: 'Mariama Bah', age: 29, avatar: 'MB', condition: 'Grossesse à risque', planStatus: 'active', progress: 55, startDate: '01 avr. 2026', endDate: '15 oct. 2026', nextMilestone: 'Écho 32 SA', compliance: 95, alerts: 0 },
  { id: 'p6', name: 'Oumar Konaté', age: 51, avatar: 'OK', condition: 'Post-AVC rééducation', planStatus: 'completed', progress: 100, startDate: '01 janv. 2026', endDate: '30 juin 2026', nextMilestone: 'Terminé', compliance: 88, alerts: 0 },
];

const mockInterventions: Intervention[] = [
  { id: 'i1', title: 'Metformine 1000mg', type: 'medication', startWeek: 1, durationWeeks: 12, frequency: '2x/jour', responsible: 'Dr. Mohamed Sy', notes: 'Avec les repas' },
  { id: 'i2', title: 'Contrôle glycémie capillaire', type: 'monitoring', startWeek: 1, durationWeeks: 12, frequency: 'Quotidien', responsible: 'Patient', notes: 'À jeun + 2h post-prandial' },
  { id: 'i3', title: 'Consultation diététicienne', type: 'therapy', startWeek: 1, durationWeeks: 12, frequency: 'Mensuel', responsible: 'Diététicienne Koné', notes: 'Régime hypoglucidique' },
  { id: 'i4', title: 'HbA1c', type: 'lab', startWeek: 6, durationWeeks: 1, frequency: 'Unique', responsible: 'Laboratoire', notes: 'Objectif < 7%' },
  { id: 'i5', title: 'Activité physique modérée', type: 'therapy', startWeek: 2, durationWeeks: 10, frequency: '3x/semaine', responsible: 'Patient', notes: '30 min marche rapide' },
  { id: 'i6', title: 'Bilan lipidique', type: 'lab', startWeek: 12, durationWeeks: 1, frequency: 'Unique', responsible: 'Laboratoire', notes: 'Contrôle final' },
];

const mockGoals: Goal[] = [
  {
    id: 'g1', title: 'Contrôle glycémique optimal', description: 'Atteindre et maintenir une HbA1c < 7%',
    targetDate: '30 sept. 2026', metric: 'HbA1c', targetValue: '< 7%', currentValue: '8.2%',
    status: 'in_progress',
    milestones: [
      { id: 'm1', title: 'HbA1c < 8.5%', targetDate: '31 juil. 2026', achieved: true, achievedDate: '28 juil. 2026' },
      { id: 'm2', title: 'HbA1c < 7.5%', targetDate: '31 août 2026', achieved: false },
      { id: 'm3', title: 'HbA1c < 7%', targetDate: '30 sept. 2026', achieved: false },
    ],
  },
  {
    id: 'g2', title: 'Perte de poids', description: 'Réduire le poids corporel de 5% minimum',
    targetDate: '30 sept. 2026', metric: 'Poids', targetValue: '< 75 kg', currentValue: '82 kg',
    status: 'in_progress',
    milestones: [
      { id: 'm4', title: 'Perte 2 kg', targetDate: '31 juil. 2026', achieved: true, achievedDate: '25 juil. 2026' },
      { id: 'm5', title: 'Perte 4 kg', targetDate: '31 août 2026', achieved: false },
    ],
  },
  {
    id: 'g3', title: 'Observance médicamenteuse', description: 'Maintenir une observance > 90%',
    targetDate: '30 sept. 2026', metric: 'Observance', targetValue: '> 90%', currentValue: '68%',
    status: 'in_progress',
    milestones: [
      { id: 'm6', title: 'Observance > 75%', targetDate: '15 août 2026', achieved: false },
    ],
  },
];

const mockSchedules: Schedule[] = [
  { id: 's1', type: 'medication', name: 'Metformine 1000mg', dosage: '1 comprimé', frequency: '2x/jour', time: ['08:00', '20:00'], duration: '12 semaines', instructions: 'Prendre avec les repas pour réduire les effets gastro-intestinaux', active: true },
  { id: 's2', type: 'medication', name: 'Amlodipine 5mg', dosage: '1 comprimé', frequency: '1x/jour', time: ['08:00'], duration: '12 semaines', instructions: 'Prendre le matin, surveiller la tension', active: true },
  { id: 's3', type: 'monitoring', name: 'Glycémie capillaire', frequency: '2x/jour', time: ['07:00', '19:00'], duration: '12 semaines', instructions: 'À jeun le matin, 2h après le dîner le soir', active: true },
  { id: 's4', type: 'monitoring', name: 'Tension artérielle', frequency: '1x/jour', time: ['08:00'], duration: '12 semaines', instructions: 'Après 5 min de repos, noter les valeurs', active: true },
  { id: 's5', type: 'therapy', name: 'Séance kinésithérapie', frequency: '3x/semaine', time: ['10:00'], duration: '8 semaines', instructions: 'Exercices de renforcement musculaire et cardio', active: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  medication: '#8b5cf6', therapy: '#0ea5e9', monitoring: '#10b981',
  lab: '#f59e0b', imaging: '#6366f1', consultation: '#e11d48', education: '#64748b',
};
const typeLabels: Record<string, string> = {
  medication: 'Médicament', therapy: 'Thérapie', monitoring: 'Surveillance',
  lab: 'Biologie', imaging: 'Imagerie', consultation: 'Consultation', education: 'Éducation',
};
const statusColors: Record<string, string> = {
  active: '#10b981', paused: '#f59e0b', completed: '#6366f1', draft: '#94a3b8',
};
const statusLabels: Record<string, string> = {
  active: 'Actif', paused: 'Suspendu', completed: 'Terminé', draft: 'Brouillon',
};
const goalStatusColors: Record<string, string> = {
  not_started: '#94a3b8', in_progress: '#f59e0b', achieved: '#10b981', missed: '#e11d48',
};
const goalStatusLabels: Record<string, string> = {
  not_started: 'Non démarré', in_progress: 'En cours', achieved: 'Atteint', missed: 'Manqué',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: string; color: string }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon name={icon as any} size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</p>
        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function PatientCard({ patient, onSelect }: { patient: AssignedPatient; onSelect: (p: AssignedPatient) => void }) {
  return (
    <div
      className="card p-4 cursor-pointer hover:shadow-md transition-all"
      onClick={() => onSelect(patient)}
      style={{ borderLeft: `3px solid ${statusColors[patient.planStatus]}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            {patient.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{patient.name}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.age} ans · {patient.condition}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${statusColors[patient.planStatus]}18`, color: statusColors[patient.planStatus] }}>
          {statusLabels[patient.planStatus]}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>Progression</span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{patient.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${patient.progress}%`, backgroundColor: statusColors[patient.planStatus] }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p style={{ color: 'var(--muted-foreground)' }}>Observance</p>
          <p className="font-semibold" style={{ color: patient.compliance >= 80 ? '#10b981' : patient.compliance >= 60 ? '#f59e0b' : '#e11d48' }}>{patient.compliance}%</p>
        </div>
        <div>
          <p style={{ color: 'var(--muted-foreground)' }}>Prochain jalon</p>
          <p className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>{patient.nextMilestone}</p>
        </div>
      </div>

      {patient.alerts > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#e11d4818', color: '#e11d48' }}>
          <Icon name="ExclamationTriangleIcon" size={12} />
          <span>{patient.alerts} alerte{patient.alerts > 1 ? 's' : ''} active{patient.alerts > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView({ onNewPlan, onSelectPatient }: { onNewPlan: () => void; onSelectPatient: (p: AssignedPatient) => void }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const filtered = filter === 'all' ? assignedPatients : assignedPatients.filter(p => p.planStatus === filter);
  const active = assignedPatients.filter(p => p.planStatus === 'active').length;
  const alerts = assignedPatients.reduce((s, p) => s + p.alerts, 0);
  const avgCompliance = Math.round(assignedPatients.reduce((s, p) => s + p.compliance, 0) / assignedPatients.length);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Plans actifs" value={active} sub={`sur ${assignedPatients.length} patients`} icon="ClipboardDocumentListIcon" color="#0ea5e9" />
        <KPICard label="Observance moy." value={`${avgCompliance}%`} sub="tous plans confondus" icon="ChartBarIcon" color="#10b981" />
        <KPICard label="Alertes actives" value={alerts} sub="nécessitent attention" icon="ExclamationTriangleIcon" color="#e11d48" />
        <KPICard label="Plans terminés" value={assignedPatients.filter(p => p.planStatus === 'completed').length} sub="ce trimestre" icon="CheckCircleIcon" color="#8b5cf6" />
      </div>

      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Plans de soins assignés</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} patient{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            {(['all', 'active', 'paused', 'completed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ backgroundColor: filter === f ? 'var(--shifa-blue)' : 'transparent', color: filter === f ? '#fff' : 'var(--muted-foreground)' }}>
                {f === 'all' ? 'Tous' : statusLabels[f]}
              </button>
            ))}
          </div>
          <button onClick={onNewPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau plan
          </button>
        </div>
      </div>

      {/* Patient grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => <PatientCard key={p.id} patient={p} onSelect={onSelectPatient} />)}
      </div>
    </div>
  );
}

// ─── Builder View ─────────────────────────────────────────────────────────────

function BuilderView({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<BuilderStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<CarePlanTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<AssignedPatient | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [planName, setPlanName] = useState('');
  const [planDuration, setPlanDuration] = useState('12');

  const steps: { key: BuilderStep; label: string; icon: string }[] = [
    { key: 'template', label: 'Modèle', icon: 'DocumentDuplicateIcon' },
    { key: 'patient', label: 'Patient', icon: 'UserIcon' },
    { key: 'timeline', label: 'Calendrier', icon: 'CalendarDaysIcon' },
    { key: 'schedules', label: 'Protocoles', icon: 'ClockIcon' },
    { key: 'goals', label: 'Objectifs', icon: 'FlagIcon' },
    { key: 'review', label: 'Révision', icon: 'CheckCircleIcon' },
  ];
  const stepOrder: BuilderStep[] = ['template', 'patient', 'timeline', 'schedules', 'goals', 'review'];
  const currentIdx = stepOrder.indexOf(step);

  const goNext = () => { if (currentIdx < stepOrder.length - 1) setStep(stepOrder[currentIdx + 1]); };
  const goPrev = () => { if (currentIdx > 0) setStep(stepOrder[currentIdx - 1]); };

  const typeIcon: Record<string, string> = {
    medication: 'BeakerIcon', therapy: 'HeartIcon', monitoring: 'ChartBarIcon',
    lab: 'BeakerIcon', imaging: 'PhotoIcon', consultation: 'UserIcon', education: 'AcademicCapIcon',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Icon name="ArrowLeftIcon" size={18} style={{ color: 'var(--muted-foreground)' }} />
        </button>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Nouveau plan de soins</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Étape {currentIdx + 1} sur {stepOrder.length}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((s, idx) => {
          const done = idx < currentIdx;
          const active = s.key === step;
          return (
            <React.Fragment key={s.key}>
              <button
                onClick={() => setStep(s.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: active ? 'var(--shifa-blue)' : done ? '#10b98118' : 'var(--muted)',
                  color: active ? '#fff' : done ? '#10b981' : 'var(--muted-foreground)',
                }}>
                <Icon name={done ? 'CheckIcon' : s.icon as any} size={14} />
                {s.label}
              </button>
              {idx < steps.length - 1 && (
                <div className="w-4 h-px shrink-0" style={{ backgroundColor: 'var(--border)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="card p-6">

        {/* STEP 1: Template */}
        {step === 'template' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Choisir un modèle de plan</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un protocole clinique ou créez un plan personnalisé.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map(t => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t); if (!planName) setPlanName(t.name); }}
                  className="text-left p-4 rounded-xl border-2 transition-all hover:shadow-md"
                  style={{ borderColor: selectedTemplate?.id === t.id ? t.color : 'var(--border)', backgroundColor: selectedTemplate?.id === t.id ? `${t.color}08` : 'var(--card)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}18` }}>
                      <Icon name={t.icon as any} size={18} style={{ color: t.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{t.category} · {t.duration}</p>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{t.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {t.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${t.color}18`, color: t.color }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    {selectedTemplate?.id === t.id && (
                      <Icon name="CheckCircleIcon" size={18} style={{ color: t.color }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedTemplate && (
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Nom du plan</label>
                <input value={planName} onChange={e => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                  placeholder="Nom du plan de soins" />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Patient */}
        {step === 'patient' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Assigner un patient</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez le patient pour ce plan de soins.</p>
            </div>
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} placeholder="Rechercher un patient..." />
            </div>
            <div className="space-y-2">
              {assignedPatients.map(p => (
                <button key={p.id} onClick={() => setSelectedPatient(p)}
                  className="w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3"
                  style={{ borderColor: selectedPatient?.id === p.id ? 'var(--shifa-blue)' : 'var(--border)', backgroundColor: selectedPatient?.id === p.id ? 'rgba(var(--shifa-blue-rgb),0.05)' : 'var(--card)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans · {p.condition}</p>
                  </div>
                  {selectedPatient?.id === p.id && <Icon name="CheckCircleIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />}
                </button>
              ))}
            </div>
            {selectedPatient && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Date de début</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} defaultValue="2026-08-10" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: 'var(--muted-foreground)' }}>Durée (semaines)</label>
                  <input type="number" value={planDuration} onChange={e => setPlanDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }} min="1" max="52" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Timeline */}
        {step === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Calendrier des interventions</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Planifiez les interventions sur la durée du plan.</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={14} /> Ajouter
              </button>
            </div>

            {/* Gantt-style timeline */}
            <div className="overflow-x-auto">
              <div style={{ minWidth: '600px' }}>
                {/* Week headers */}
                <div className="flex mb-2">
                  <div className="w-48 shrink-0" />
                  <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${parseInt(planDuration)}, 1fr)` }}>
                    {Array.from({ length: parseInt(planDuration) }, (_, i) => (
                      <div key={i} className="text-center text-xs py-1 border-l" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>S{i + 1}</div>
                    ))}
                  </div>
                </div>

                {/* Interventions */}
                {interventions.map(iv => (
                  <div key={iv.id} className="flex items-center mb-2 group">
                    <div className="w-48 shrink-0 pr-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[iv.type] }} />
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{iv.title}</p>
                      </div>
                      <p className="text-xs ml-3.5" style={{ color: 'var(--muted-foreground)' }}>{iv.frequency}</p>
                    </div>
                    <div className="flex-1 relative h-7 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="absolute top-1 h-5 rounded flex items-center px-2"
                        style={{
                          left: `${((iv.startWeek - 1) / parseInt(planDuration)) * 100}%`,
                          width: `${(iv.durationWeeks / parseInt(planDuration)) * 100}%`,
                          backgroundColor: typeColors[iv.type],
                          minWidth: '20px',
                        }}>
                        <span className="text-xs text-white font-medium truncate">{iv.durationWeeks > 1 ? typeLabels[iv.type] : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              {Object.entries(typeLabels).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: typeColors[k] }} />
                  {v}
                </div>
              ))}
            </div>

            {/* Intervention list */}
            <div className="space-y-2">
              {interventions.map(iv => (
                <div key={iv.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeColors[iv.type]}18` }}>
                    <Icon name={typeIcon[iv.type] as any} size={16} style={{ color: typeColors[iv.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{iv.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {typeLabels[iv.type]} · Sem. {iv.startWeek}–{iv.startWeek + iv.durationWeeks - 1} · {iv.frequency} · {iv.responsible}
                    </p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Icon name="PencilIcon" size={14} style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                  <button onClick={() => setInterventions(prev => prev.filter(i => i.id !== iv.id))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Icon name="TrashIcon" size={14} style={{ color: '#e11d48' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Schedules */}
        {step === 'schedules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Protocoles médicaments, thérapies & surveillance</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Définissez les horaires et fréquences de chaque protocole.</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={14} /> Ajouter
              </button>
            </div>

            {(['medication', 'monitoring', 'therapy'] as const).map(sType => {
              const items = schedules.filter(s => s.type === sType);
              const sTypeLabels: Record<string, string> = { medication: 'Médicaments', monitoring: 'Surveillance', therapy: 'Thérapies' };
              const sTypeIcons: Record<string, string> = { medication: 'BeakerIcon', monitoring: 'ChartBarIcon', therapy: 'HeartIcon' };
              if (!items.length) return null;
              return (
                <div key={sType}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={sTypeIcons[sType] as any} size={14} style={{ color: typeColors[sType] }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{sTypeLabels[sType]}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[sType]}18`, color: typeColors[sType] }}>{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(s => (
                      <div key={s.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', opacity: s.active ? 1 : 0.6 }}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                            {s.dosage && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.dosage}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? 'text-green-600' : 'text-gray-400'}`}
                              style={{ backgroundColor: s.active ? '#10b98118' : '#94a3b818' }}>
                              {s.active ? 'Actif' : 'Inactif'}
                            </span>
                            <button className="p-1 rounded hover:bg-muted transition-colors">
                              <Icon name="PencilIcon" size={13} style={{ color: 'var(--muted-foreground)' }} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <p style={{ color: 'var(--muted-foreground)' }}>Fréquence</p>
                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.frequency}</p>
                          </div>
                          <div>
                            <p style={{ color: 'var(--muted-foreground)' }}>Horaires</p>
                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.time.join(', ')}</p>
                          </div>
                          <div>
                            <p style={{ color: 'var(--muted-foreground)' }}>Durée</p>
                            <p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.duration}</p>
                          </div>
                        </div>
                        {s.instructions && (
                          <p className="text-xs mt-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                            <Icon name="InformationCircleIcon" size={12} className="inline mr-1" />{s.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 5: Goals */}
        {step === 'goals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Objectifs & jalons</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Définissez les objectifs cliniques mesurables et leurs jalons.</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" size={14} /> Objectif
              </button>
            </div>

            <div className="space-y-4">
              {goals.map(g => (
                <div key={g.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{g.title}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${goalStatusColors[g.status]}18`, color: goalStatusColors[g.status] }}>
                          {goalStatusLabels[g.status]}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{g.description}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-2">
                      <Icon name="PencilIcon" size={14} style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p style={{ color: 'var(--muted-foreground)' }}>Métrique</p>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{g.metric}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p style={{ color: 'var(--muted-foreground)' }}>Valeur actuelle</p>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{g.currentValue}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p style={{ color: 'var(--muted-foreground)' }}>Objectif</p>
                      <p className="font-semibold" style={{ color: goalStatusColors[g.status] }}>{g.targetValue}</p>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>JALONS</p>
                    <div className="space-y-1.5">
                      {g.milestones.map((m, idx) => (
                        <div key={m.id} className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${m.achieved ? 'bg-green-500' : 'border-2'}`}
                            style={{ borderColor: m.achieved ? undefined : 'var(--border)' }}>
                            {m.achieved
                              ? <Icon name="CheckIcon" size={11} className="text-white" />
                              : <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>{idx + 1}</span>
                            }
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <p className="text-xs" style={{ color: m.achieved ? '#10b981' : 'var(--foreground)', textDecoration: m.achieved ? 'line-through' : 'none' }}>{m.title}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.achieved ? m.achievedDate : m.targetDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Review */}
        {step === 'review' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--foreground)' }}>Révision & validation</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérifiez le plan avant de l'activer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>PLAN</p>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{planName || selectedTemplate?.name || '—'}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{selectedTemplate?.category} · {planDuration} semaines</p>
              </div>
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>PATIENT</p>
                {selectedPatient ? (
                  <>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.age} ans · {selectedPatient.condition}</p>
                  </>
                ) : <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Non assigné</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Interventions', value: interventions.length, icon: 'CalendarDaysIcon', color: '#0ea5e9' },
                { label: 'Protocoles', value: schedules.filter(s => s.active).length, icon: 'ClockIcon', color: '#8b5cf6' },
                { label: 'Objectifs', value: goals.length, icon: 'FlagIcon', color: '#10b981' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: `${item.color}10` }}>
                  <Icon name={item.icon as any} size={20} className="mx-auto mb-1" style={{ color: item.color }} />
                  <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border" style={{ borderColor: '#10b98140', backgroundColor: '#10b98108' }}>
              <div className="flex items-start gap-2">
                <Icon name="CheckCircleIcon" size={18} style={{ color: '#10b981' }} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Plan prêt à être activé</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    Le plan sera activé immédiatement. Les notifications seront envoyées au patient et aux soignants assignés.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                Enregistrer comme brouillon
              </button>
              <button onClick={onComplete} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#10b981' }}>
                <Icon name="CheckIcon" size={16} />
                Activer le plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {step !== 'review' && (
        <div className="flex justify-between">
          <button onClick={goPrev} disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            <Icon name="ChevronLeftIcon" size={16} /> Précédent
          </button>
          <button onClick={goNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--shifa-blue)' }}>
            Suivant <Icon name="ChevronRightIcon" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function DetailView({ patient, onBack }: { patient: AssignedPatient; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'schedules' | 'goals'>('overview');

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'timeline', label: 'Calendrier', icon: 'CalendarDaysIcon' },
    { key: 'schedules', label: 'Protocoles', icon: 'ClockIcon' },
    { key: 'goals', label: 'Objectifs', icon: 'FlagIcon' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Icon name="ArrowLeftIcon" size={18} style={{ color: 'var(--muted-foreground)' }} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            {patient.avatar}
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{patient.name}</h2>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.condition} · Plan actif depuis {patient.startDate}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${statusColors[patient.planStatus]}18`, color: statusColors[patient.planStatus] }}>
          {statusLabels[patient.planStatus]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>Progression globale</span>
          <span className="font-bold" style={{ color: 'var(--shifa-blue)' }}>{patient.progress}%</span>
        </div>
        <div className="h-2 rounded-full mb-3" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-2 rounded-full" style={{ width: `${patient.progress}%`, backgroundColor: 'var(--shifa-blue)' }} />
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-center">
            <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{patient.compliance}%</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Observance</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{mockInterventions.length}</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Interventions</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{mockGoals.length}</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Objectifs</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base" style={{ color: patient.alerts > 0 ? '#e11d48' : '#10b981' }}>{patient.alerts}</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Alertes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{ borderColor: activeTab === t.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>PROCHAINS JALONS</p>
              <div className="space-y-2">
                {mockGoals.flatMap(g => g.milestones.filter(m => !m.achieved)).slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                    <span className="flex-1" style={{ color: 'var(--foreground)' }}>{m.title}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{m.targetDate}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>PROTOCOLES ACTIFS</p>
              <div className="space-y-2">
                {mockSchedules.filter(s => s.active).slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[s.type] }} />
                    <span className="flex-1 truncate" style={{ color: 'var(--foreground)' }}>{s.name}</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>{s.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {patient.alerts > 0 && (
            <div className="p-4 rounded-xl border" style={{ borderColor: '#e11d4840', backgroundColor: '#e11d4808' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#e11d48' }} />
                <p className="text-sm font-semibold" style={{ color: '#e11d48' }}>{patient.alerts} alerte{patient.alerts > 1 ? 's' : ''} active{patient.alerts > 1 ? 's' : ''}</p>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Observance faible détectée. Contacter le patient pour évaluer les obstacles à l'adhérence.</p>
              <button className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#e11d4818', color: '#e11d48' }}>
                Voir les alertes
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-3">
          {mockInterventions.map(iv => (
            <div key={iv.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeColors[iv.type]}18` }}>
                <Icon name="CalendarDaysIcon" size={15} style={{ color: typeColors[iv.type] }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{iv.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  {typeLabels[iv.type]} · Sem. {iv.startWeek}–{iv.startWeek + iv.durationWeeks - 1} · {iv.frequency}
                </p>
                {iv.notes && <p className="text-xs mt-1 italic" style={{ color: 'var(--muted-foreground)' }}>{iv.notes}</p>}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[iv.type]}18`, color: typeColors[iv.type] }}>
                {typeLabels[iv.type]}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="space-y-3">
          {mockSchedules.map(s => (
            <div key={s.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', opacity: s.active ? 1 : 0.6 }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeColors[s.type]}18`, color: typeColors[s.type] }}>
                  {typeLabels[s.type]}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p style={{ color: 'var(--muted-foreground)' }}>Fréquence</p><p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.frequency}</p></div>
                <div><p style={{ color: 'var(--muted-foreground)' }}>Horaires</p><p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.time.join(', ')}</p></div>
                <div><p style={{ color: 'var(--muted-foreground)' }}>Durée</p><p className="font-medium" style={{ color: 'var(--foreground)' }}>{s.duration}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-4">
          {mockGoals.map(g => (
            <div key={g.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{g.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{g.description}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2" style={{ backgroundColor: `${goalStatusColors[g.status]}18`, color: goalStatusColors[g.status] }}>
                  {goalStatusLabels[g.status]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs mb-3">
                <span style={{ color: 'var(--muted-foreground)' }}>Actuel: <strong style={{ color: 'var(--foreground)' }}>{g.currentValue}</strong></span>
                <span>→</span>
                <span style={{ color: 'var(--muted-foreground)' }}>Cible: <strong style={{ color: goalStatusColors[g.status] }}>{g.targetValue}</strong></span>
                <span style={{ color: 'var(--muted-foreground)' }}>Échéance: {g.targetDate}</span>
              </div>
              <div className="space-y-1.5">
                {g.milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${m.achieved ? 'bg-green-500' : 'border-2'}`}
                      style={{ borderColor: m.achieved ? undefined : 'var(--border)' }}>
                      {m.achieved ? <Icon name="CheckIcon" size={11} className="text-white" /> : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{idx + 1}</span>}
                    </div>
                    <p className="text-xs flex-1" style={{ color: m.achieved ? '#10b981' : 'var(--foreground)', textDecoration: m.achieved ? 'line-through' : 'none' }}>{m.title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.achieved ? m.achievedDate : m.targetDate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProCarePlansContent() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<AssignedPatient | null>(null);

  const handleSelectPatient = (p: AssignedPatient) => {
    setSelectedPatient(p);
    setView('detail');
  };

  const handleBuilderComplete = () => {
    setView('dashboard');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      {/* Page header */}
      {view === 'dashboard' && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Plans de soins</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Créez, assignez et suivez les plans de soins personnalisés de vos patients.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/pro-patient-monitoring" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="ChartBarIcon" size={15} />
              Suivi
            </Link>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <DashboardView onNewPlan={() => setView('builder')} onSelectPatient={handleSelectPatient} />
      )}
      {view === 'builder' && (
        <BuilderView onBack={() => setView('dashboard')} onComplete={handleBuilderComplete} />
      )}
      {view === 'detail' && selectedPatient && (
        <DetailView patient={selectedPatient} onBack={() => setView('dashboard')} />
      )}
    </div>
  );
}
