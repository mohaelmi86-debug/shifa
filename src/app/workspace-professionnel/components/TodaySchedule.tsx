'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

interface Appointment {
  id: string;
  scheduled_at: string;
  status: string;
  appointment_type: string;
  teleconsultation: boolean;
  reason: string;
  duration_minutes: number;
  patients: { first_name: string; last_name: string } | null;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

const statusStyle: Record<string, { dot: string; label: string; rowBg: string }> = {
  completed: { dot: 'var(--shifa-green)', label: 'Terminé', rowBg: 'rgba(16, 185, 129, 0.04)' },
  in_progress: { dot: 'var(--shifa-blue)', label: 'En cours', rowBg: 'rgba(0, 102, 255, 0.06)' },
  scheduled: { dot: 'var(--border)', label: 'Planifié', rowBg: 'var(--background)' },
  confirmed: { dot: 'var(--shifa-cyan)', label: 'Confirmé', rowBg: 'var(--background)' },
  cancelled: { dot: 'var(--shifa-red)', label: 'Annulé', rowBg: 'rgba(239,68,68,0.04)' },
  no_show: { dot: 'var(--muted-foreground)', label: 'Absent', rowBg: 'var(--background)' },
};

export default function TodaySchedule() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: appointments, loading, error } = useSupabaseRealtime<Appointment>({
    table: 'appointments',
    select: '*, patients(first_name, last_name)',
    orderBy: { column: 'scheduled_at', ascending: true },
    limit: 20,
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="card-base h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Agenda du jour</h2>
        {loading ? (
          <Skeleton className="h-5 w-20" />
        ) : (
          <span className="badge-base status-active">{appointments.length} rendez-vous</span>
        )}
      </div>

      {error && (
        <div className="p-2 rounded-lg mb-3 text-xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-thin" style={{ maxHeight: '480px' }}>
        {loading ? (
          [1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)
        ) : appointments.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            <Icon name="CalendarDaysIcon" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun rendez-vous aujourd'hui</p>
          </div>
        ) : (
          appointments.map((item) => {
            const s = statusStyle[item.status] || statusStyle.scheduled;
            const isSelected = selectedId === item.id;
            const patientName = item.patients
              ? `${item.patients.first_name} ${item.patients.last_name}`
              : 'Patient inconnu';
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150"
                style={{
                  backgroundColor: isSelected ? 'rgba(0, 102, 255, 0.08)' : s.rowBg,
                  borderColor: isSelected ? 'rgba(0, 102, 255, 0.3)' : 'var(--border)',
                }}
              >
                <div className="flex flex-col items-center gap-1 shrink-0" style={{ minWidth: '40px' }}>
                  <span className="text-xs font-bold font-tabular" style={{ color: 'var(--foreground)' }}>
                    {formatTime(item.scheduled_at)}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '9px' }}>
                    {item.duration_minutes}min
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{patientName}</p>
                    {item.teleconsultation && (
                      <Icon name="VideoCameraIcon" size={12} style={{ color: 'var(--shifa-green)' } as any} className="shrink-0" />
                    )}
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {item.reason || item.appointment_type}
                  </p>
                </div>
                {item.status === 'in_progress' && (
                  <span className="badge-base status-completed shrink-0" style={{ fontSize: '9px' }}>En cours</span>
                )}
              </button>
            );
          })
        )}
      </div>

      <button className="w-full mt-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>
        <Icon name="CalendarDaysIcon" size={15} className="inline mr-1.5" />
        Gérer mes disponibilités
      </button>
    </div>
  );
}