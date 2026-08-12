'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'plans' | 'tasks' | 'handoffs' | 'team' | 'timeline';

interface CarePlan {
  id: string;
  patient: string;
  condition: string;
  lead: string;
  team: string[];
  status: 'active' | 'pending' | 'completed';
  progress: number;
  nextAction: string;
  updated: string;
}

interface Task {
  id: string;
  title: string;
  patient: string;
  assignedTo: string;
  role: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  status: 'todo' | 'in_progress' | 'done';
  planId: string;
}

interface Handoff {
  id: string;
  patient: string;
  from: string;
  to: string;
  type: string;
  notes: string;
  status: 'pending' | 'accepted' | 'completed';
  date: string;
  urgency: 'routine' | 'urgent' | 'critical';
}

const plans: CarePlan[] = [
  { id: 'CP-001', patient: 'Aïcha Diallo', condition: 'Diabète type 2 + HTA', lead: 'Dr. Sy', team: ['Dr. Sy', 'Inf. Fatou', 'Diét. Koné', 'Cardio. Diop'], status: 'active', progress: 68, nextAction: 'Bilan HbA1c — 15 août', updated: 'Aujourd\'hui' },
  { id: 'CP-002', patient: 'Moussa Traoré', condition: 'Insuffisance cardiaque', lead: 'Dr. Diop', team: ['Dr. Diop', 'Dr. Sy', 'Inf. Aminata'], status: 'active', progress: 45, nextAction: 'Échocardiographie — 18 août', updated: 'Hier' },
  { id: 'CP-003', patient: 'Mariama Bah', condition: 'Cancer du sein — suivi', lead: 'Dr. Camara', team: ['Dr. Camara', 'Onco. Ndiaye', 'Psy. Sow', 'Inf. Kadiatou'], status: 'active', progress: 82, nextAction: 'Séance chimio — 20 août', updated: '2j' },
  { id: 'CP-004', patient: 'Ibrahima Kouyaté', condition: 'AVC — rééducation', lead: 'Dr. Baldé', team: ['Dr. Baldé', 'Kiné. Diallo', 'Ortho. Bah'], status: 'pending', progress: 12, nextAction: 'Bilan initial — 16 août', updated: '3j' },
];

const tasks: Task[] = [
  { id: 'T-001', title: 'Ajuster dose metformine', patient: 'Aïcha Diallo', assignedTo: 'Dr. Sy', role: 'Médecin', priority: 'high', due: 'Aujourd\'hui', status: 'in_progress', planId: 'CP-001' },
  { id: 'T-002', title: 'Éducation thérapeutique diabète', patient: 'Aïcha Diallo', assignedTo: 'Diét. Koné', role: 'Diététicien', priority: 'medium', due: 'Demain', status: 'todo', planId: 'CP-001' },
  { id: 'T-003', title: 'Contrôle tension artérielle x3/j', patient: 'Moussa Traoré', assignedTo: 'Inf. Aminata', role: 'Infirmier', priority: 'high', due: 'Aujourd\'hui', status: 'in_progress', planId: 'CP-002' },
  { id: 'T-004', title: 'Bilan biologique complet', patient: 'Mariama Bah', assignedTo: 'Dr. Camara', role: 'Oncologue', priority: 'medium', due: '15 août', status: 'todo', planId: 'CP-003' },
  { id: 'T-005', title: 'Séance kinésithérapie', patient: 'Ibrahima Kouyaté', assignedTo: 'Kiné. Diallo', role: 'Kinésithérapeute', priority: 'high', due: '16 août', status: 'todo', planId: 'CP-004' },
  { id: 'T-006', title: 'Évaluation psychologique', patient: 'Mariama Bah', assignedTo: 'Psy. Sow', role: 'Psychologue', priority: 'low', due: '20 août', status: 'todo', planId: 'CP-003' },
];

const handoffs: Handoff[] = [
  { id: 'H-001', patient: 'Aïcha Diallo', from: 'Dr. Sy (Généraliste)', to: 'Cardio. Diop', type: 'Consultation spécialisée', notes: 'HTA résistante — évaluation cardiologique nécessaire. Dernière TA : 165/95.', status: 'pending', date: 'Aujourd\'hui 14h', urgency: 'urgent' },
  { id: 'H-002', patient: 'Moussa Traoré', from: 'Urgences', to: 'Dr. Diop (Cardiologue)', type: 'Transfert de service', notes: 'Décompensation cardiaque stabilisée. Transfert en cardiologie pour suivi.', status: 'accepted', date: 'Hier 09h', urgency: 'critical' },
  { id: 'H-003', patient: 'Mariama Bah', from: 'Dr. Camara (Oncologue)', to: 'Psy. Sow', type: 'Orientation psychologique', notes: 'Anxiété importante avant chimio. Soutien psychologique recommandé.', status: 'completed', date: '12 août', urgency: 'routine' },
];

const statusColors = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Actif' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Terminé' },
};

const priorityColors = {
  high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Haute' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moyenne' },
  low: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Basse' },
};

const urgencyColors = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', label: 'Critique' },
  urgent: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Urgent' },
  routine: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Routine' },
};

const handoffStatusColors = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  accepted: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Accepté' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Complété' },
};

export default function ProCareCoordinationContent() {
  const [activeTab, setActiveTab] = useState<Tab>('plans');
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'plans', label: 'Plans de soins partagés', icon: 'ClipboardDocumentListIcon', count: plans.length },
    { key: 'tasks', label: 'Tâches assignées', icon: 'CheckCircleIcon', count: tasks.filter(t => t.status !== 'done').length },
    { key: 'handoffs', label: 'Transmissions', icon: 'ArrowsRightLeftIcon', count: handoffs.filter(h => h.status === 'pending').length },
    { key: 'team', label: 'Équipe soignante', icon: 'UsersIcon' },
    { key: 'timeline', label: 'Chronologie', icon: 'CalendarDaysIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Coordination des soins</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Plans partagés, tâches et transmissions inter-professionnelles</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau plan
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mt-5">
          {[
            { label: 'Plans actifs', value: '4', icon: 'ClipboardDocumentListIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Tâches en cours', value: '2', icon: 'ClockIcon', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Transmissions en attente', value: '1', icon: 'ArrowsRightLeftIcon', color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Professionnels impliqués', value: '9', icon: 'UsersIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <Icon name={kpi.icon} size={20} className={kpi.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 border-b border-border -mb-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            {plans.map(plan => {
              const sc = statusColors[plan.status];
              return (
                <div key={plan.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => setSelectedPlan(plan === selectedPlan ? null : plan)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {plan.patient.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{plan.patient}</h3>
                          <span className="text-xs text-muted-foreground">{plan.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{plan.condition}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">Chef de file : <span className="text-foreground font-medium">{plan.lead}</span></span>
                          <span className="text-xs text-muted-foreground">Équipe : {plan.team.length} professionnels</span>
                          <span className="text-xs text-muted-foreground">Mis à jour : {plan.updated}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {plan.team.map(m => (
                            <span key={m} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right min-w-[140px]">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">{plan.progress}%</span>
                      </div>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${plan.progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Prochaine action :</p>
                      <p className="text-xs text-foreground font-medium">{plan.nextAction}</p>
                    </div>
                  </div>

                  {selectedPlan?.id === plan.id && (
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">TÂCHES ASSOCIÉES</p>
                        {tasks.filter(t => t.planId === plan.id).map(t => (
                          <div key={t.id} className="flex items-center gap-2 py-1.5">
                            <div className={`w-2 h-2 rounded-full ${priorityColors[t.priority].dot}`} />
                            <span className="text-xs text-foreground">{t.title}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{t.assignedTo}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">ACTIONS RAPIDES</p>
                        <div className="space-y-1.5">
                          {['Ajouter une tâche', 'Créer une transmission', 'Voir le dossier', 'Envoyer un message'].map(a => (
                            <button key={a} className="w-full text-left text-xs text-primary hover:underline py-0.5">{a}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">DERNIÈRES NOTES</p>
                        <p className="text-xs text-muted-foreground italic">Aucune note récente. Cliquez pour ajouter une note clinique partagée.</p>
                        <button className="mt-2 text-xs text-primary hover:underline">+ Ajouter une note</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Tâches assignées</h2>
              <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Icon name="PlusIcon" size={14} /> Nouvelle tâche
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {['Tâche', 'Patient', 'Assigné à', 'Priorité', 'Échéance', 'Statut'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tasks.map(task => {
                  const pc = priorityColors[task.priority];
                  const taskStatusMap = { todo: { label: 'À faire', bg: 'bg-slate-100', text: 'text-slate-600' }, in_progress: { label: 'En cours', bg: 'bg-blue-50', text: 'text-blue-700' }, done: { label: 'Terminé', bg: 'bg-emerald-50', text: 'text-emerald-700' } };
                  const ts = taskStatusMap[task.status];
                  return (
                    <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.planId}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{task.patient}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{task.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">{task.role}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.text}`}>{pc.label}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{task.due}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ts.bg} ${ts.text}`}>{ts.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Handoffs Tab */}
        {activeTab === 'handoffs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Transmissions inter-professionnelles</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                <Icon name="PlusIcon" size={14} /> Nouvelle transmission
              </button>
            </div>
            {handoffs.map(h => {
              const uc = urgencyColors[h.urgency];
              const hsc = handoffStatusColors[h.status];
              return (
                <div key={h.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                        <Icon name="ArrowsRightLeftIcon" size={18} className="text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{h.patient}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uc.bg} ${uc.text}`}>{uc.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${hsc.bg} ${hsc.text}`}>{hsc.label}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{h.from}</span>
                          <Icon name="ArrowRightIcon" size={14} />
                          <span className="text-foreground font-medium">{h.to}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.type} · {h.date}</p>
                        <p className="text-sm text-foreground mt-2 bg-muted/50 rounded-lg p-3 italic">"{h.notes}"</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {h.status === 'pending' && (
                        <>
                          <button className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">Accepter</button>
                          <button className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Refuser</button>
                        </>
                      )}
                      {h.status === 'accepted' && (
                        <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Marquer complété</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Dr. Mohamed Sy', role: 'Médecin généraliste', specialty: 'Chef de file', patients: 2, tasks: 1, avatar: 'MS', status: 'online' },
              { name: 'Dr. Amadou Diop', role: 'Cardiologue', specialty: 'Spécialiste', patients: 1, tasks: 0, avatar: 'AD', status: 'online' },
              { name: 'Dr. Fatoumata Camara', role: 'Oncologue', specialty: 'Spécialiste', patients: 1, tasks: 1, avatar: 'FC', status: 'offline' },
              { name: 'Inf. Fatou Ndiaye', role: 'Infirmière', specialty: 'Soins', patients: 1, tasks: 1, avatar: 'FN', status: 'online' },
              { name: 'Inf. Aminata Balde', role: 'Infirmière', specialty: 'Soins', patients: 1, tasks: 1, avatar: 'AB', status: 'online' },
              { name: 'Diét. Koné', role: 'Diététicien', specialty: 'Nutrition', patients: 1, tasks: 1, avatar: 'DK', status: 'offline' },
              { name: 'Psy. Sow', role: 'Psychologue', specialty: 'Soutien', patients: 1, tasks: 1, avatar: 'PS', status: 'online' },
              { name: 'Kiné. Diallo', role: 'Kinésithérapeute', specialty: 'Rééducation', patients: 1, tasks: 1, avatar: 'KD', status: 'offline' },
              { name: 'Dr. Baldé', role: 'Neurologue', specialty: 'Spécialiste', patients: 1, tasks: 0, avatar: 'DB', status: 'online' },
            ].map(member => (
              <div key={member.name} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{member.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded-full">{member.specialty}</span>
                  <span>{member.patients} patient{member.patients > 1 ? 's' : ''}</span>
                  <span>{member.tasks} tâche{member.tasks > 1 ? 's' : ''}</span>
                </div>
                <button className="mt-3 w-full text-xs text-primary border border-primary/30 rounded-lg py-1.5 hover:bg-primary/5 transition-colors">Envoyer un message</button>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Chronologie des soins — Semaine du 11 août 2026</h2>
            <div className="space-y-3">
              {[
                { time: 'Lun 11 — 09h00', event: 'Consultation Dr. Sy', patient: 'Aïcha Diallo', type: 'consultation', done: true },
                { time: 'Lun 11 — 14h00', event: 'Transmission urgente → Cardio. Diop', patient: 'Aïcha Diallo', type: 'handoff', done: false },
                { time: 'Mar 12 — 10h00', event: 'Séance éducation thérapeutique', patient: 'Aïcha Diallo', type: 'education', done: false },
                { time: 'Mar 12 — 14h30', event: 'Évaluation psychologique', patient: 'Mariama Bah', type: 'psychology', done: true },
                { time: 'Mer 13 — 08h00', event: 'Contrôle TA matin', patient: 'Moussa Traoré', type: 'monitoring', done: true },
                { time: 'Jeu 14 — 11h00', event: 'Bilan biologique', patient: 'Mariama Bah', type: 'lab', done: false },
                { time: 'Ven 15 — 09h00', event: 'Bilan HbA1c', patient: 'Aïcha Diallo', type: 'lab', done: false },
                { time: 'Sam 16 — 10h00', event: 'Bilan initial rééducation', patient: 'Ibrahima Kouyaté', type: 'kine', done: false },
              ].map((item, i) => {
                const typeColors: Record<string, string> = { consultation: 'bg-blue-500', handoff: 'bg-orange-500', education: 'bg-purple-500', psychology: 'bg-pink-500', monitoring: 'bg-emerald-500', lab: 'bg-amber-500', kine: 'bg-teal-500' };
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-36 text-xs text-muted-foreground shrink-0">{item.time}</div>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.done ? 'bg-emerald-500' : typeColors[item.type] || 'bg-slate-400'}`} />
                    <div className={`flex-1 p-3 rounded-lg border ${item.done ? 'bg-muted/30 border-border opacity-60' : 'bg-card border-border'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{item.event}</span>
                        <span className="text-xs text-muted-foreground">{item.patient}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
