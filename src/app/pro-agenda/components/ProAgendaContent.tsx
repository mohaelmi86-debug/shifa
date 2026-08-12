'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Slot {
  id: string;
  time: string;
  patient: string;
  type: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'done';
  avatar: string;
}

const weekDays = ['Lun 11', 'Mar 12', 'Mer 13', 'Jeu 14', 'Ven 15', 'Sam 16'];

const slots: Slot[] = [
  { id: 's1', time: '08:00', patient: 'Aïcha Diallo', type: 'Consultation générale', duration: 30, status: 'done', avatar: 'AD' },
  { id: 's2', time: '08:30', patient: 'Kwame Asante', type: 'Suivi cardiologique', duration: 45, status: 'done', avatar: 'KA' },
  { id: 's3', time: '09:30', patient: 'Nadia Benali', type: 'Suivi grossesse', duration: 30, status: 'confirmed', avatar: 'NB' },
  { id: 's4', time: '10:00', patient: 'Pierre Dubois', type: 'Urgence respiratoire', duration: 60, status: 'confirmed', avatar: 'PD' },
  { id: 's5', time: '11:00', patient: '—', type: 'Pause déjeuner', duration: 60, status: 'cancelled', avatar: '' },
  { id: 's6', time: '14:00', patient: 'Isabelle Fontaine', type: 'Bilan thyroïdien', duration: 30, status: 'confirmed', avatar: 'IF' },
  { id: 's7', time: '14:30', patient: 'Mamadou Traoré', type: 'Consultation paludisme', duration: 30, status: 'pending', avatar: 'MT' },
  { id: 's8', time: '15:30', patient: 'Fatima Ouédraogo', type: 'Résultats anémie', duration: 20, status: 'confirmed', avatar: 'FO' },
  { id: 's9', time: '16:00', patient: 'Alioune Badara Cissé', type: 'Suivi diabète + HTA', duration: 45, status: 'pending', avatar: 'AC' },
];

const statusConfig = {
  confirmed: { label: 'Confirmé', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.08)', border: 'rgba(0, 102, 255, 0.2)' },
  pending: { label: 'En attente', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)' },
  cancelled: { label: 'Annulé', color: 'var(--muted-foreground)', bg: 'var(--muted)', border: 'var(--border)' },
  done: { label: 'Terminé', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)' },
};

export default function ProAgendaContent() {
  const [activeDay, setActiveDay] = useState(0);
  const [view, setView] = useState<'day' | 'week'>('day');

  const confirmed = slots.filter(s => s.status === 'confirmed').length;
  const pending = slots.filter(s => s.status === 'pending').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Agenda</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Semaine du 11 au 16 août 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            {(['day', 'week'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ backgroundColor: view === v ? 'white' : 'transparent', color: view === v ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}
              >
                {v === 'day' ? 'Jour' : 'Semaine'}
              </button>
            ))}
          </div>
          <button className="btn-primary text-sm px-4 py-2.5">
            <Icon name="PlusIcon" size={16} />
            Nouveau RDV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total aujourd\'hui', value: slots.length, icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
          { label: 'Confirmés', value: confirmed, icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
          { label: 'En attente', value: pending, icon: 'ClockIcon', color: 'var(--shifa-amber)' },
          { label: 'Terminés', value: slots.filter(s => s.status === 'done').length, icon: 'CheckBadgeIcon', color: 'var(--muted-foreground)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}15` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as React.CSSProperties} className="" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Day selector */}
        <div className="xl:col-span-1">
          <div className="card-base">
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Août 2026</p>
            <div className="grid grid-cols-3 gap-2">
              {weekDays.map((day, i) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(i)}
                  className="flex flex-col items-center py-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: activeDay === i ? 'var(--shifa-blue)' : 'var(--background)',
                    border: `1px solid ${activeDay === i ? 'var(--shifa-blue)' : 'var(--border)'}`,
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: activeDay === i ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)' }}>
                    {day.split(' ')[0]}
                  </span>
                  <span className="text-base font-bold" style={{ color: activeDay === i ? 'white' : 'var(--foreground)' }}>
                    {day.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Légende</p>
              {Object.entries(statusConfig).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: val.color }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="xl:col-span-3">
          <div className="card-base p-0 overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>
                {weekDays[activeDay]} — Planning du jour
              </p>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                {slots.length} créneaux
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {slots.map((slot) => {
                const st = statusConfig[slot.status];
                return (
                  <div
                    key={slot.id}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                    style={{ borderLeft: `3px solid ${st.color}` }}
                  >
                    <div className="w-14 shrink-0 text-right">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{slot.time}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{slot.duration}min</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        {slot.avatar ? (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                          >
                            {slot.avatar}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
                            <Icon name="CalendarIcon" size={14} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{slot.patient}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{slot.type}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0" style={{ backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Démarrer">
                        <Icon name="PlayIcon" size={14} className="text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Modifier">
                        <Icon name="PencilIcon" size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
