'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'staff' | 'contracts' | 'schedules' | 'leave' | 'training';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'staff', label: 'Personnel', icon: 'UsersIcon' },
  { key: 'contracts', label: 'Contrats', icon: 'DocumentTextIcon' },
  { key: 'schedules', label: 'Plannings', icon: 'CalendarDaysIcon' },
  { key: 'leave', label: 'Congés & Absences', icon: 'ClockIcon' },
  { key: 'training', label: 'Formations', icon: 'AcademicCapIcon' },
];

const staffMembers = [
  { id: 'EMP-001', name: 'Dr. Moussa Diallo', role: 'Médecin', dept: 'Médecine interne', contract: 'CDI', status: 'active' },
  { id: 'EMP-002', name: 'Fatou Ndiaye', role: 'Infirmière', dept: 'Chirurgie', contract: 'CDI', status: 'active' },
  { id: 'EMP-003', name: 'Ibrahima Sow', role: 'Technicien de labo', dept: 'Laboratoire', contract: 'CDD', status: 'active' },
  { id: 'EMP-004', name: 'Aminata Bâ', role: 'Sage-femme', dept: 'Maternité', contract: 'CDI', status: 'on_leave' },
  { id: 'EMP-005', name: 'Oumar Diop', role: 'Aide-soignant', dept: 'Urgences', contract: 'CDD', status: 'active' },
];

const leaveRequests = [
  { id: 'CONG-001', employee: 'Fatou Ndiaye', type: 'Congé annuel', from: '15/08/2026', to: '29/08/2026', days: 14, status: 'approved' },
  { id: 'CONG-002', employee: 'Ibrahima Sow', type: 'Congé maladie', from: '10/08/2026', to: '12/08/2026', days: 3, status: 'pending' },
  { id: 'CONG-003', employee: 'Oumar Diop', type: 'Congé annuel', from: '01/09/2026', to: '15/09/2026', days: 15, status: 'pending' },
];

const trainings = [
  { title: 'Gestes d\'urgence — AFGSU 2', target: 'Tout le personnel soignant', date: '20/08/2026', status: 'upcoming', enrolled: 12 },
  { title: 'Hygiène et prévention des infections', target: 'Infirmiers, Aides-soignants', date: '05/09/2026', status: 'upcoming', enrolled: 8 },
  { title: 'Radioprotection — Niveau 1', target: 'Imagerie, Bloc opératoire', date: '10/09/2026', status: 'upcoming', enrolled: 5 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  on_leave: { label: 'En congé', bg: '#fef9c3', color: '#ca8a04' },
  inactive: { label: 'Inactif', bg: '#fee2e2', color: '#dc2626' },
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  rejected: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
  upcoming: { label: 'À venir', bg: '#dbeafe', color: '#2563eb' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
};

export default function HRModuleContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
              <Icon name="UsersIcon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Ressources Humaines</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion du personnel, contrats, plannings, congés et formations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            {staffMembers.filter(s => s.status === 'active').length} actifs
          </span>
          <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon name="PlusIcon" size={16} />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            style={{ borderColor: activeTab === t.key ? '#0284c7' : 'transparent', color: activeTab === t.key ? '#0284c7' : 'var(--muted-foreground)' }}
          >
            <Icon name={t.icon as any} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Effectif total', value: String(staffMembers.length), icon: 'UsersIcon', color: '#0284c7' },
              { label: 'En congé', value: String(staffMembers.filter(s => s.status === 'on_leave').length), icon: 'ClockIcon', color: '#ca8a04' },
              { label: 'Demandes en attente', value: String(leaveRequests.filter(l => l.status === 'pending').length), icon: 'ClipboardDocumentListIcon', color: '#ea580c' },
              { label: 'Formations planifiées', value: String(trainings.length), icon: 'AcademicCapIcon', color: '#8b5cf6' },
            ].map(kpi => (
              <div key={kpi.label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color } as any} />
                </div>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Department breakdown */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition par service</h3>
            <div className="space-y-2">
              {['Médecine interne', 'Chirurgie', 'Laboratoire', 'Maternité', 'Urgences'].map((dept, i) => {
                const count = staffMembers.filter(s => s.dept === dept).length;
                const pct = Math.round((count / staffMembers.length) * 100);
                return (
                  <div key={dept} className="flex items-center gap-3">
                    <p className="text-sm w-36 shrink-0" style={{ color: 'var(--foreground)' }}>{dept}</p>
                    <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: '#0284c7' }} />
                    </div>
                    <p className="text-xs w-8 text-right" style={{ color: 'var(--muted-foreground)' }}>{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending leave */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Demandes de congé en attente</h3>
            <div className="space-y-2">
              {leaveRequests.filter(l => l.status === 'pending').map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{req.employee}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.type} · {req.from} → {req.to} ({req.days}j)</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#16a34a' }}>Approuver</button>
                    <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>Refuser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Registre du personnel</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Ajouter un agent
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Nom', 'Fonction', 'Service', 'Contrat', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffMembers.map(emp => {
                  const cfg = statusConfig[emp.status];
                  return (
                    <tr key={emp.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{emp.id}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{emp.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{emp.role}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{emp.dept}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{emp.contract}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Dossier</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Gestion des contrats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'CDI', count: staffMembers.filter(s => s.contract === 'CDI').length, color: '#16a34a' },
              { label: 'CDD', count: staffMembers.filter(s => s.contract === 'CDD').length, color: '#ca8a04' },
              { label: 'Intérim', count: 0, color: '#64748b' },
            ].map(c => (
              <div key={c.label} className="card p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: c.color }}>{c.count}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{c.label}</p>
              </div>
            ))}
          </div>
          <div className="card p-5 text-center py-10">
            <Icon name="DocumentTextIcon" size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' } as any} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion complète des contrats — renouvellements, avenants, fins de contrat</p>
          </div>
        </div>
      )}

      {/* Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Plannings du personnel</h2>
          <div className="card p-5 text-center py-10">
            <Icon name="CalendarDaysIcon" size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' } as any} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Planification des gardes, rotations et affectations par service</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Vue hebdomadaire et mensuelle disponibles</p>
          </div>
        </div>
      )}

      {/* Leave */}
      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Congés & Absences</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Nouvelle demande
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Agent', 'Type', 'Du', 'Au', 'Jours', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(req => {
                  const cfg = statusConfig[req.status];
                  return (
                    <tr key={req.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{req.id}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{req.employee}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.from}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.to}</td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{req.days}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      <td className="px-4 py-3">
                        {req.status === 'pending' && (
                          <div className="flex gap-1">
                            <button className="text-xs px-2 py-1 rounded-lg text-white" style={{ backgroundColor: '#16a34a' }}>✓</button>
                            <button className="text-xs px-2 py-1 rounded-lg text-white" style={{ backgroundColor: '#dc2626' }}>✗</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Training */}
      {activeTab === 'training' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Plan de formation</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Planifier une formation
            </button>
          </div>
          <div className="space-y-3">
            {trainings.map(t => {
              const cfg = statusConfig[t.status];
              return (
                <div key={t.title} className="card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                      <Icon name="AcademicCapIcon" size={18} style={{ color: '#2563eb' } as any} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{t.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.target} · {t.date} · {t.enrolled} inscrits</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
