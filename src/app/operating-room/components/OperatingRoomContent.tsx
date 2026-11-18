'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type TabKey = 'schedule' | 'interventions' | 'teams' | 'checklists' | 'reports';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'schedule', label: 'Planning', icon: 'CalendarDaysIcon' },
  { key: 'interventions', label: 'Interventions', icon: 'ClipboardDocumentListIcon' },
  { key: 'teams', label: 'Équipes', icon: 'UsersIcon' },
  { key: 'checklists', label: 'Checklists', icon: 'ClipboardDocumentCheckIcon' },
  { key: 'reports', label: 'Comptes rendus', icon: 'DocumentTextIcon' },
];

const staticOps = [
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
  in_progress: { label: 'En cours', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  scheduled: { label: 'Planifié', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  completed: { label: 'Terminé', bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  cancelled: { label: 'Annulé', bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
  occupied: { label: 'Occupée', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  available: { label: 'Disponible', bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  cleaning: { label: 'Nettoyage', bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
};

const checklistItems = [
  { category: 'Avant induction', items: ['Identité patient vérifiée', 'Consentement signé', 'Site opératoire marqué', 'Allergie vérifiée', 'Voie veineuse en place'] },
  { category: 'Avant incision', items: ['Équipe présentée', 'Antibioprophylaxie administrée', 'Imagerie disponible', 'Matériel stérile vérifié'] },
  { category: 'Avant sortie de salle', items: ['Décompte instruments correct', 'Décompte compresses correct', 'Étiquetage prélèvements', 'Problèmes à signaler'] },
];

export default function OperatingRoomContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('schedule');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [dbSchedules, setDbSchedules] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('operating_room_schedules')
        .select('*')
        .order('scheduled_at', { ascending: true })
        .limit(50);
      if (error) throw error;
      setDbSchedules(data || []);
    } catch (err: any) {
      setDbError(err?.message || 'Erreur lors du chargement du planning.');
    } finally {
      setDbLoading(false);
    }
  };

  const toggleCheck = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  // Use DB data if available, otherwise fallback to static
  const displayOps = dbSchedules.length > 0
    ? dbSchedules.map((s: any) => ({
        id: s.id?.slice(0, 12) || '—',
        patient: s.patient_id || 'Patient',
        procedure: s.procedure_name || '—',
        surgeon: s.surgeon_id || '—',
        room: s.room || '—',
        time: s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
        duration: s.estimated_duration ? `${s.estimated_duration}min` : '—',
        status: s.status || 'scheduled',
        anesthesia: s.anesthesia_type || '—',
      }))
    : staticOps;

  const kpis = [
    { label: 'Interventions planifiées', value: String(displayOps.length), icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
    { label: 'En cours', value: String(displayOps.filter(o => o.status === 'in_progress').length), icon: 'ArrowPathIcon', color: 'var(--shifa-amber)' },
    { label: 'Terminées', value: String(displayOps.filter(o => o.status === 'completed').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
    { label: 'Salles disponibles', value: String(rooms.filter(r => r.status === 'available').length), icon: 'BuildingOffice2Icon', color: 'var(--shifa-purple)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #2d1b69 0%, #7c3aed 55%, #8b5cf6 100%)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="ScissorsIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {dbSchedules.length > 0 ? `${dbSchedules.length} interventions en base` : 'Données de démonstration'}
                </span>
                {dbLoading && <Icon name="ArrowPathIcon" size={14} className="text-white animate-spin" />}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Bloc Opératoire
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Planning chirurgical, interventions, équipes et comptes rendus opératoires
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSchedules} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowPathIcon" size={15} className={dbLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#7c3aed' }}>
              <Icon name="PlusIcon" size={15} />
              Planifier
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={kpi.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {dbError && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)' }} />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{dbError} — Affichage des données de démonstration.</p>
          <button onClick={fetchSchedules} className="ml-auto text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Réessayer</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px`}
            style={{ borderBottomColor: activeTab === t.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}
          >
            <Icon name={t.icon as any} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Room status */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>{room.id}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusConfig[room.status]?.bg, color: statusConfig[room.status]?.color }}>
                    {statusConfig[room.status]?.label}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{room.specialty}</p>
                {room.currentOp && <p className="text-xs mt-1 font-mono" style={{ color: 'var(--shifa-blue)' }}>{room.currentOp}</p>}
              </div>
            ))}
          </div>

          {/* Operations list */}
          {dbLoading ? (
            <div className="rounded-2xl border p-12 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement du planning…</p>
            </div>
          ) : displayOps.length === 0 ? (
            <div className="rounded-2xl border p-12 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.08)' }}>
                <Icon name="CalendarDaysIcon" size={26} style={{ color: '#7c3aed' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Aucune intervention planifiée</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Les interventions apparaîtront ici.</p>
            </div>
          ) : (
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Interventions du jour</h3>
                  {dbSchedules.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Supabase</span>
                  )}
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {displayOps.map((op) => (
                  <div key={op.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center">
                        <p className="text-sm font-bold" style={{ color: '#7c3aed' }}>{op.time}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{op.procedure}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.patient} · {op.surgeon} · {op.room}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Anesthésie: {op.anesthesia}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: statusConfig[op.status]?.bg, color: statusConfig[op.status]?.color }}>
                      {statusConfig[op.status]?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'interventions' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Historique des interventions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['ID', 'Patient', 'Procédure', 'Chirurgien', 'Salle', 'Heure', 'Durée', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayOps.map((op, i) => (
                  <tr key={op.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{op.id}</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{op.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.procedure}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.surgeon}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.room}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.time}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{op.duration}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusConfig[op.status]?.bg, color: statusConfig[op.status]?.color }}>
                        {statusConfig[op.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'checklists' && (
        <div className="space-y-4">
          {checklistItems.map((section) => (
            <div key={section.category} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const key = `${section.category}-${item}`;
                  return (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                        style={{ backgroundColor: checkedItems[key] ? 'var(--shifa-green)' : 'transparent', border: `2px solid ${checkedItems[key] ? 'var(--shifa-green)' : 'var(--border)'}` }}
                        onClick={() => toggleCheck(key)}
                      >
                        {checkedItems[key] && <Icon name="CheckIcon" size={12} className="text-white" />}
                      </div>
                      <span className="text-sm" style={{ color: checkedItems[key] ? 'var(--muted-foreground)' : 'var(--foreground)', textDecoration: checkedItems[key] ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'teams' || activeTab === 'reports') && (
        <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(124,58,237,0.08)' }}>
            <Icon name={activeTab === 'teams' ? 'UsersIcon' : 'DocumentTextIcon'} size={24} style={{ color: '#7c3aed' }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>
            {activeTab === 'teams' ? 'Gestion des équipes chirurgicales' : 'Comptes rendus opératoires'}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cette section sera disponible prochainement.</p>
        </div>
      )}
    </div>
  );
}
