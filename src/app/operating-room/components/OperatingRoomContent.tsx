'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'schedule' | 'interventions' | 'teams' | 'checklists' | 'reports';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'schedule', label: 'Planning', icon: 'CalendarDaysIcon' },
  { key: 'interventions', label: 'Interventions', icon: 'ClipboardDocumentListIcon' },
  { key: 'teams', label: 'Équipes', icon: 'UsersIcon' },
  { key: 'checklists', label: 'Checklists', icon: 'ClipboardDocumentCheckIcon' },
  { key: 'reports', label: 'Comptes rendus', icon: 'DocumentTextIcon' },
];

const scheduledOps = [
  { id: 'BO-2026-0041', patient: 'Patient A', procedure: 'Appendicectomie', surgeon: 'Dr. Diallo', room: 'Salle 1', time: '08:00', duration: '1h30', status: 'in_progress', anesthesia: 'Générale' },
  { id: 'BO-2026-0042', patient: 'Patient B', procedure: 'Cholécystectomie laparoscopique', surgeon: 'Dr. Ndiaye', room: 'Salle 2', time: '10:00', duration: '2h00', status: 'scheduled', anesthesia: 'Générale' },
  { id: 'BO-2026-0043', patient: 'Patient C', procedure: 'Hernie inguinale', surgeon: 'Dr. Sow', room: 'Salle 1', time: '13:30', duration: '1h00', status: 'scheduled', anesthesia: 'Locorégionale' },
  { id: 'BO-2026-0040', patient: 'Patient D', procedure: 'Césarienne', surgeon: 'Dr. Bâ', room: 'Salle 3', time: '07:00', duration: '1h00', status: 'completed', anesthesia: 'Rachianesthésie' },
];

const rooms = [
  { id: 'Salle 1', specialty: 'Chirurgie générale', status: 'occupied', currentOp: 'BO-2026-0041' },
  { id: 'Salle 2', specialty: 'Chirurgie viscérale', status: 'available', currentOp: null },
  { id: 'Salle 3', specialty: 'Obstétrique', status: 'cleaning', currentOp: null },
  { id: 'Salle 4', specialty: 'Orthopédie', status: 'available', currentOp: null },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  in_progress: { label: 'En cours', bg: '#fef9c3', color: '#ca8a04' },
  scheduled: { label: 'Planifié', bg: '#dbeafe', color: '#2563eb' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
  cancelled: { label: 'Annulé', bg: '#fee2e2', color: '#dc2626' },
  occupied: { label: 'Occupée', bg: '#fef9c3', color: '#ca8a04' },
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  cleaning: { label: 'Nettoyage', bg: '#f1f5f9', color: '#64748b' },
};

const checklistItems = [
  { category: 'Avant induction', items: ['Identité patient vérifiée', 'Consentement signé', 'Site opératoire marqué', 'Allergie vérifiée', 'Voie veineuse en place'] },
  { category: 'Avant incision', items: ['Équipe présentée', 'Antibioprophylaxie administrée', 'Imagerie disponible', 'Matériel stérile vérifié'] },
  { category: 'Avant sortie de salle', items: ['Décompte instruments correct', 'Décompte compresses correct', 'Étiquetage prélèvements', 'Problèmes à signaler'] },
];

export default function OperatingRoomContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('schedule');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
              <Icon name="ScissorsIcon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Bloc Opératoire</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Planning chirurgical, interventions, équipes et comptes rendus opératoires</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
            1 intervention en cours
          </span>
          <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon name="PlusIcon" size={16} />
            Planifier
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
            style={{ borderColor: activeTab === t.key ? '#7c3aed' : 'transparent', color: activeTab === t.key ? '#7c3aed' : 'var(--muted-foreground)' }}
          >
            <Icon name={t.icon as any} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Room status */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {rooms.map(room => {
              const cfg = statusConfig[room.status];
              return (
                <div key={room.id} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{room.id}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{room.specialty}</p>
                  {room.currentOp && <p className="text-xs mt-1 font-mono" style={{ color: '#7c3aed' }}>{room.currentOp}</p>}
                </div>
              );
            })}
          </div>

          {/* Today's program */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Programme du jour — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
            <div className="space-y-3">
              {scheduledOps.map(op => {
                const cfg = statusConfig[op.status];
                return (
                  <div key={op.id} className="flex items-center gap-4 p-3 rounded-xl border" style={{ borderColor: 'var(--border)', borderLeft: op.status === 'in_progress' ? '3px solid #7c3aed' : undefined }}>
                    <div className="text-center shrink-0 w-14">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{op.time}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.duration}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{op.procedure}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.surgeon} · {op.room} · {op.anesthesia}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interventions */}
      {activeTab === 'interventions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Registre des interventions</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Nouvelle intervention
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Intervention', 'Chirurgien', 'Salle', 'Heure', 'Durée', 'Anesthésie', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduledOps.map(op => {
                  const cfg = statusConfig[op.status];
                  return (
                    <tr key={op.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{op.id}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{op.procedure}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.surgeon}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.room}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>{op.time}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.duration}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.anesthesia}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teams */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Équipes chirurgicales du jour</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Équipe Salle 1', surgeon: 'Dr. Diallo', anesthesiologist: 'Dr. Traoré', nurse: 'IDE Fatou', status: 'in_progress' },
              { name: 'Équipe Salle 2', surgeon: 'Dr. Ndiaye', anesthesiologist: 'Dr. Camara', nurse: 'IDE Moussa', status: 'scheduled' },
              { name: 'Équipe Salle 3', surgeon: 'Dr. Sow', anesthesiologist: 'Dr. Diop', nurse: 'IDE Aminata', status: 'available' },
            ].map(team => {
              const cfg = statusConfig[team.status];
              return (
                <div key={team.name} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{team.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div className="space-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <p>Chirurgien : <span style={{ color: 'var(--foreground)' }}>{team.surgeon}</span></p>
                    <p>Anesthésiste : <span style={{ color: 'var(--foreground)' }}>{team.anesthesiologist}</span></p>
                    <p>Infirmier(e) de bloc : <span style={{ color: 'var(--foreground)' }}>{team.nurse}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Checklists */}
      {activeTab === 'checklists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Checklist sécurité — OMS / HAS</h2>
            <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>BO-2026-0041 en cours</span>
          </div>
          <div className="space-y-4">
            {checklistItems.map(section => (
              <div key={section.category} className="card p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <Icon name="ClipboardDocumentCheckIcon" size={16} style={{ color: '#7c3aed' } as any} />
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map(item => {
                    const key = `${section.category}-${item}`;
                    return (
                      <label key={item} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!checkedItems[key]}
                          onChange={() => toggleCheck(key)}
                          className="w-4 h-4 rounded accent-purple-600"
                        />
                        <span className="text-sm" style={{ color: checkedItems[key] ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: checkedItems[key] ? 'line-through' : 'none' }}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Comptes rendus opératoires</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Nouveau CR
            </button>
          </div>
          <div className="card p-5">
            {scheduledOps.filter(op => op.status === 'completed').map(op => (
              <div key={op.id} className="flex items-center justify-between p-3 rounded-xl border mb-2" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{op.id} — {op.procedure}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.surgeon} · {op.time} · {op.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Voir</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#7c3aed' }}>Signer</button>
                </div>
              </div>
            ))}
            {scheduledOps.filter(op => op.status === 'completed').length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: 'var(--muted-foreground)' }}>Aucun compte rendu disponible pour aujourd'hui</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
