'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FollowUpItem {
  id: string;
  title: string;
  type: 'rdv' | 'medicament' | 'examen' | 'objectif';
  dueDate: string;
  doctor: string;
  status: 'upcoming' | 'done' | 'overdue' | 'ongoing';
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

interface CarePlan {
  id: string;
  title: string;
  condition: string;
  doctor: string;
  startDate: string;
  progress: number;
  items: number;
  completedItems: number;
}

const mockFollowUps: FollowUpItem[] = [
  { id: 'F001', title: 'Contrôle tension artérielle', type: 'rdv', dueDate: '15/08/2026', doctor: 'Dr. Fatou Ndiaye', status: 'upcoming', notes: 'Apporter carnet de suivi tensionnel', priority: 'high' },
  { id: 'F002', title: 'Prise Amlodipine 5mg — matin', type: 'medicament', dueDate: 'Quotidien', doctor: 'Dr. Fatou Ndiaye', status: 'ongoing', notes: 'Ne pas arrêter sans avis médical', priority: 'high' },
  { id: 'F003', title: 'Bilan lipidique de contrôle', type: 'examen', dueDate: '01/09/2026', doctor: 'Dr. Fatou Ndiaye', status: 'upcoming', notes: 'À jeun depuis 12h', priority: 'medium' },
  { id: 'F004', title: 'Activité physique 30 min/jour', type: 'objectif', dueDate: 'Quotidien', doctor: 'Dr. Mohamed Sy', status: 'ongoing', notes: 'Marche rapide ou natation', priority: 'medium' },
  { id: 'F005', title: 'Consultation dermatologie — suivi eczéma', type: 'rdv', dueDate: '10/08/2026', doctor: 'Dr. Ibrahima Fall', status: 'overdue', notes: 'Reprogrammer dès que possible', priority: 'high' },
  { id: 'F006', title: 'Prise de poids hebdomadaire', type: 'objectif', dueDate: 'Hebdomadaire', doctor: 'Dr. Mohamed Sy', status: 'done', priority: 'low' },
];

const mockCarePlans: CarePlan[] = [
  { id: 'CP001', title: 'Plan de soins HTA', condition: 'Hypertension artérielle', doctor: 'Dr. Fatou Ndiaye', startDate: '01/06/2026', progress: 65, items: 8, completedItems: 5 },
  { id: 'CP002', title: 'Suivi eczéma atopique', condition: 'Eczéma atopique', doctor: 'Dr. Ibrahima Fall', startDate: '20/07/2026', progress: 30, items: 5, completedItems: 1 },
];

const typeConfig = {
  rdv: { label: 'Rendez-vous', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'CalendarDaysIcon' },
  medicament: { label: 'Médicament', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', icon: 'ArchiveBoxIcon' },
  examen: { label: 'Examen', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'BeakerIcon' },
  objectif: { label: 'Objectif santé', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'TrophyIcon' },
};

const statusConfig = {
  upcoming: { label: 'À venir', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  done: { label: 'Fait', color: '#16a34a', bg: '#dcfce7' },
  overdue: { label: 'En retard', color: '#dc2626', bg: '#fee2e2' },
  ongoing: { label: 'En cours', color: '#d97706', bg: '#fef3c7' },
};

const priorityConfig = {
  high: { label: 'Haute', color: '#dc2626' },
  medium: { label: 'Moyenne', color: '#d97706' },
  low: { label: 'Faible', color: '#16a34a' },
};

export default function PatientFollowUpContent() {
  const [activeTab, setActiveTab] = useState<'suivi' | 'plans'>('suivi');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Suivi & Soins</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos actions de suivi, plans de soins et objectifs santé</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Actions en cours', value: '4', icon: 'ClockIcon', color: 'var(--shifa-blue)' },
          { label: 'En retard', value: '1', icon: 'ExclamationTriangleIcon', color: '#dc2626' },
          { label: 'Plans de soins actifs', value: '2', icon: 'ClipboardDocumentListIcon', color: '#8b5cf6' },
          { label: 'Complétées', value: '1', icon: 'CheckCircleIcon', color: '#16a34a' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {[{ key: 'suivi', label: 'Actions de suivi', icon: 'ClipboardDocumentListIcon' }, { key: 'plans', label: 'Plans de soins', icon: 'DocumentTextIcon' }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
            style={{ color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent' }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'suivi' && (
        <div className="space-y-3">
          {mockFollowUps.map(item => {
            const tc = typeConfig[item.type];
            const sc = statusConfig[item.status];
            const pc = priorityConfig[item.priority];
            return (
              <div key={item.id} className="card-base p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                    <Icon name={tc.icon as any} size={18} style={{ color: tc.color } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.doctor} · {tc.label}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                        <span className="text-xs font-medium" style={{ color: pc.color }}>Priorité {pc.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="CalendarDaysIcon" size={12} /> {item.dueDate}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-xs mt-1.5 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-4">
          {mockCarePlans.map(plan => (
            <div key={plan.id} className="card-base p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>{plan.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{plan.condition} · {plan.doctor}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Démarré le {plan.startDate}</p>
                </div>
                <span className="text-2xl font-bold shrink-0" style={{ color: 'var(--shifa-blue)' }}>{plan.progress}%</span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>Progression</span>
                  <span>{plan.completedItems}/{plan.items} actions</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${plan.progress}%`, background: 'linear-gradient(90deg, var(--shifa-blue), var(--shifa-cyan))' }} />
                </div>
              </div>
              <button className="btn-secondary text-sm py-1.5 flex items-center gap-2">
                <Icon name="EyeIcon" size={14} /> Voir le plan complet
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
