'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'schedule' | 'leave' | 'requests' | 'absences' | 'planning';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'schedule', label: 'Plannings', icon: 'CalendarDaysIcon' },
  { key: 'leave', label: 'Congés', icon: 'SunIcon' },
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'absences', label: 'Absences', icon: 'UserMinusIcon' },
  { key: 'planning', label: 'Vue mensuelle', icon: 'TableCellsIcon' },
];

const kpis = [
  { label: 'Effectif planifié', value: '42', sub: 'Sur 48 actifs', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Congés en cours', value: '6', sub: '3 approuvés cette semaine', icon: 'SunIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Demandes en attente', value: '8', sub: 'À traiter', icon: 'ClockIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Absences imprévues', value: '2', sub: 'Aujourd\'hui', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const weekDays = ['Lun 11', 'Mar 12', 'Mer 13', 'Jeu 14', 'Ven 15', 'Sam 16', 'Dim 17'];

const scheduleData = [
  { name: 'Dr. Moussa Diallo', role: 'Médecin', dept: 'Médecine interne', shifts: ['M', 'M', 'M', 'M', 'M', '', ''] },
  { name: 'Fatou Ndiaye', role: 'Infirmière', dept: 'Chirurgie', shifts: ['M', 'M', '', 'S', 'S', 'S', ''] },
  { name: 'Ibrahima Sow', role: 'Technicien labo', dept: 'Laboratoire', shifts: ['M', '', 'M', 'M', 'M', '', ''] },
  { name: 'Aminata Bâ', role: 'Sage-femme', dept: 'Maternité', shifts: ['C', 'C', 'C', 'C', 'C', 'C', 'C'] },
  { name: 'Oumar Diop', role: 'Aide-soignant', dept: 'Urgences', shifts: ['N', 'N', '', '', 'N', 'N', 'N'] },
  { name: 'Seynabou Diallo', role: 'Infirmière', dept: 'Pédiatrie', shifts: ['M', 'M', 'S', 'S', '', '', ''] },
  { name: 'Cheikh Mbaye', role: 'Médecin', dept: 'Urgences', shifts: ['', 'S', 'S', 'M', 'M', 'M', ''] },
  { name: 'Rokhaya Fall', role: 'Aide-soignante', dept: 'Gériatrie', shifts: ['M', 'M', 'M', '', '', 'M', 'M'] },
];

const shiftConfig: Record<string, { label: string; bg: string; color: string }> = {
  M: { label: 'Matin', bg: 'rgba(0,102,255,0.12)', color: 'var(--shifa-blue)' },
  S: { label: 'Soir', bg: 'rgba(139,92,246,0.12)', color: '#7c3aed' },
  N: { label: 'Nuit', bg: 'rgba(30,30,60,0.12)', color: '#1e1e3c' },
  C: { label: 'Congé', bg: '#fef9c3', color: '#ca8a04' },
  '': { label: '', bg: 'transparent', color: 'transparent' },
};

const leaveRequests = [
  { id: 'CONG-001', employee: 'Fatou Ndiaye', dept: 'Chirurgie', type: 'Congé annuel', from: '15/08/2026', to: '29/08/2026', days: 14, status: 'approved', requestedOn: '01/08/2026' },
  { id: 'CONG-002', employee: 'Ibrahima Sow', dept: 'Laboratoire', type: 'Congé maladie', from: '10/08/2026', to: '12/08/2026', days: 3, status: 'pending', requestedOn: '09/08/2026' },
  { id: 'CONG-003', employee: 'Oumar Diop', dept: 'Urgences', type: 'Congé annuel', from: '01/09/2026', to: '15/09/2026', days: 15, status: 'pending', requestedOn: '05/08/2026' },
  { id: 'CONG-004', employee: 'Seynabou Diallo', dept: 'Pédiatrie', type: 'Congé maternité', from: '20/08/2026', to: '20/11/2026', days: 91, status: 'approved', requestedOn: '10/07/2026' },
  { id: 'CONG-005', employee: 'Cheikh Mbaye', dept: 'Urgences', type: 'Congé annuel', from: '05/09/2026', to: '12/09/2026', days: 7, status: 'pending', requestedOn: '08/08/2026' },
  { id: 'CONG-006', employee: 'Rokhaya Fall', dept: 'Gériatrie', type: 'Congé exceptionnel', from: '11/08/2026', to: '13/08/2026', days: 3, status: 'approved', requestedOn: '10/08/2026' },
];

const absences = [
  { employee: 'Dr. Moussa Diallo', dept: 'Médecine interne', reason: 'Maladie', date: '11/08/2026', duration: '1 jour', status: 'justified' },
  { employee: 'Aminata Bâ', dept: 'Maternité', reason: 'Congé maternité', date: '11/08/2026', duration: 'En cours', status: 'justified' },
  { employee: 'Inconnu', dept: 'Chirurgie', reason: 'Absence non justifiée', date: '11/08/2026', duration: '1 jour', status: 'unjustified' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  rejected: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
  justified: { label: 'Justifiée', bg: '#dbeafe', color: '#1d4ed8' },
  unjustified: { label: 'Non justifiée', bg: '#fee2e2', color: '#dc2626' },
};

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

export default function OrgHRPlanningContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('schedule');
  const [showNewLeave, setShowNewLeave] = useState(false);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Planification RH & Congés</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--shifa-muted)' }}>Gestion des plannings, congés et absences du personnel</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewLeave(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-dark)', background: 'var(--shifa-surface)' }}
          >
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouvelle demande
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'var(--shifa-blue)' }}
          >
            <Icon name="CalendarDaysIcon" className="w-4 h-4" />
            Modifier planning
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: k.bg }}>
                <Icon name={k.icon} className="w-5 h-5" style={{ color: k.color }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--shifa-muted)',
              border: `1px solid ${activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-border)'}`,
            }}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
            {t.key === 'requests' && leaveRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center text-white" style={{ background: 'var(--shifa-amber)' }}>
                {leaveRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {activeTab === 'schedule' && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Semaine du 11 au 17 août 2026</h3>
            <div className="flex gap-3 text-xs">
              {Object.entries(shiftConfig).filter(([k]) => k !== '').map(([k, v]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded text-xs flex items-center justify-center font-bold" style={{ background: v.bg, color: v.color }}>{k}</span>
                  {v.label}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--shifa-muted)' }}>Personnel</th>
                  {weekDays.map(d => (
                    <th key={d} className="text-center px-3 py-3 font-medium text-xs" style={{ color: 'var(--shifa-muted)' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < scheduleData.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{row.name}</p>
                      <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{row.role} · {row.dept}</p>
                    </td>
                    {row.shifts.map((shift, j) => {
                      const cfg = shiftConfig[shift];
                      return (
                        <td key={j} className="px-3 py-3 text-center">
                          {shift ? (
                            <span className="inline-flex w-7 h-7 rounded items-center justify-center text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>{shift}</span>
                          ) : (
                            <span className="inline-flex w-7 h-7 rounded items-center justify-center text-xs" style={{ color: 'var(--shifa-border)' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave list */}
      {activeTab === 'leave' && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--shifa-bg)', borderBottom: '1px solid var(--shifa-border)' }}>
                  {['ID', 'Employé', 'Département', 'Type', 'Du', 'Au', 'Jours', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--shifa-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((r, i) => {
                  const st = statusConfig[r.status];
                  return (
                    <tr key={r.id} style={{ borderBottom: i < leaveRequests.length - 1 ? '1px solid var(--shifa-border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.id}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--shifa-dark)' }}>{r.employee}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.dept}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.from}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.to}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{r.days}j</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests pending */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {leaveRequests.filter(r => r.status === 'pending').map(r => (
            <div key={r.id} className="rounded-xl border p-4" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: 'var(--shifa-blue)' }}>
                    {r.employee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>{r.employee}</p>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{r.dept} · {r.type}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--shifa-muted)' }}>Du {r.from} au {r.to} · {r.days} jours · Demandé le {r.requestedOn}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
                    Refuser
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors" style={{ background: 'var(--shifa-green)' }}>
                    Approuver
                  </button>
                </div>
              </div>
            </div>
          ))}
          {leaveRequests.filter(r => r.status === 'pending').length === 0 && (
            <div className="rounded-xl border p-8 text-center" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
              <Icon name="CheckCircleIcon" className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--shifa-green)' }} />
              <p className="font-medium" style={{ color: 'var(--shifa-dark)' }}>Aucune demande en attente</p>
            </div>
          )}
        </div>
      )}

      {/* Absences */}
      {activeTab === 'absences' && (
        <div className="space-y-3">
          {absences.map((a, i) => {
            const st = statusConfig[a.status];
            return (
              <div key={i} className="rounded-xl border p-4 flex items-center gap-4" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: a.status === 'unjustified' ? '#dc2626' : 'var(--shifa-blue)' }}>
                  {a.employee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>{a.employee}</p>
                  <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{a.dept} · {a.reason} · {a.date} · {a.duration}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly planning */}
      {activeTab === 'planning' && (
        <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Août 2026 — Vue mensuelle</h3>
          <div className="overflow-x-auto">
            <div className="grid text-xs" style={{ gridTemplateColumns: '160px repeat(31, minmax(28px, 1fr))' }}>
              <div className="py-2 font-medium" style={{ color: 'var(--shifa-muted)' }}>Personnel</div>
              {monthDays.map(d => (
                <div key={d} className="py-2 text-center font-medium" style={{ color: d === 11 ? 'var(--shifa-blue)' : 'var(--shifa-muted)' }}>{d}</div>
              ))}
              {scheduleData.map(row => (
                <React.Fragment key={row.name}>
                  <div className="py-1.5 pr-2 font-medium truncate" style={{ color: 'var(--shifa-dark)' }}>{row.name.split(' ').slice(-1)[0]}</div>
                  {monthDays.map(d => {
                    const shift = row.shifts[(d - 1) % 7];
                    const cfg = shiftConfig[shift || ''];
                    return (
                      <div key={d} className="py-1.5 flex items-center justify-center">
                        {shift ? (
                          <span className="w-5 h-5 rounded text-xs flex items-center justify-center font-bold" style={{ background: cfg.bg, color: cfg.color }}>{shift}</span>
                        ) : (
                          <span className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ color: 'var(--shifa-border)' }}>·</span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Leave Modal */}
      {showNewLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl w-full max-w-lg p-6" style={{ background: 'var(--shifa-surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Nouvelle demande de congé</h2>
              <button onClick={() => setShowNewLeave(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <Icon name="XMarkIcon" className="w-5 h-5" style={{ color: 'var(--shifa-muted)' }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Employé</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                  {scheduleData.map(s => <option key={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Type de congé</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}>
                  <option>Congé annuel</option>
                  <option>Congé maladie</option>
                  <option>Congé maternité / paternité</option>
                  <option>Congé exceptionnel</option>
                  <option>RTT</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Date de début</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Date de fin</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--shifa-muted)' }}>Motif (optionnel)</label>
                <textarea rows={2} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }} placeholder="Précisez si nécessaire..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowNewLeave(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>Annuler</button>
              <button onClick={() => setShowNewLeave(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>Soumettre la demande</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
