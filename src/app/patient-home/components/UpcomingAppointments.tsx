'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  scheduled_at: string;
  status: string;
  appointment_type: string;
  teleconsultation: boolean;
  reason: string;
  duration_minutes: number;
  professionals: { first_name: string; last_name: string; specialty: string | null } | null;
  organizations: { name: string } | null;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmé', className: 'status-active' },
  scheduled: { label: 'Planifié', className: 'status-pending' },
  in_progress: { label: 'En cours', className: 'status-completed' },
  completed: { label: 'Terminé', className: 'status-cancelled' },
  cancelled: { label: 'Annulé', className: 'status-cancelled' },
  no_show: { label: 'Absent', className: 'status-cancelled' },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};
const formatTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function UpcomingAppointments() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { user } = useAuth();

  const { data: appointments, loading, error } = useSupabaseRealtime<Appointment>({
    table: 'appointments',
    select: '*, professionals(first_name, last_name, specialty), organizations(name)',
    orderBy: { column: 'scheduled_at', ascending: activeTab === 'upcoming' },
    limit: 10,
    enabled: true,
  });

  const now = new Date();
  const filtered = appointments.filter(a => {
    const d = new Date(a.scheduled_at);
    return activeTab === 'upcoming'
      ? d >= now && !['cancelled', 'completed', 'no_show'].includes(a.status)
      : d < now || ['completed', 'cancelled', 'no_show'].includes(a.status);
  });

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Mes Rendez-vous</h2>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
          {(['upcoming', 'past'] as const).map((tab) => (
            <button
              key={`rdv-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
              style={{ color: activeTab === tab ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}
            >
              {tab === 'upcoming' ? 'À venir' : 'Passés'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-2 rounded-lg mb-3 text-xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>{error}</div>
      )}

      <div className="flex flex-col gap-3">
        {loading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            <Icon name="CalendarDaysIcon" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">{activeTab === 'upcoming' ? 'Aucun rendez-vous à venir' : 'Aucun rendez-vous passé'}</p>
          </div>
        ) : (
          filtered.map((apt) => {
            const status = statusConfig[apt.status] || statusConfig.scheduled;
            const proName = apt.professionals
              ? `Dr. ${apt.professionals.first_name} ${apt.professionals.last_name}`
              : 'Professionnel';
            const specialty = apt.professionals?.specialty || apt.appointment_type;
            const facility = apt.organizations?.name || '';
            const initials = apt.professionals
              ? `${apt.professionals.first_name[0] || ''}${apt.professionals.last_name[0] || ''}`
              : 'DR';
            return (
              <div
                key={apt.id}
                className="flex items-start gap-3 p-4 rounded-xl border transition-all duration-150 hover:shadow-shifa cursor-pointer"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{proName}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{specialty}</p>
                    </div>
                    <span className={`badge-base shrink-0 ${status.className}`}>{status.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon name="CalendarDaysIcon" size={13} className="text-muted-foreground" />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatDate(apt.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="ClockIcon" size={13} className="text-muted-foreground" />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatTime(apt.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {apt.teleconsultation ? (
                        <Icon name="VideoCameraIcon" size={13} style={{ color: 'var(--shifa-green)' } as any} />
                      ) : (
                        <Icon name="MapPinIcon" size={13} className="text-muted-foreground" />
                      )}
                      <span className="text-xs" style={{ color: apt.teleconsultation ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>
                        {apt.teleconsultation ? 'Téléconsultation' : facility || 'Présentiel'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Modifier">
                    <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Annuler">
                    <Icon name="XMarkIcon" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="w-full mt-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>
        Voir tous mes rendez-vous
      </button>
    </div>
  );
}