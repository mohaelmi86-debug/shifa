'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';

interface AppointmentRecord {
  id: string;
  proName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  type: 'in_person' | 'teleconsultation';
  status: 'completed' | 'cancelled' | 'no_show';
  cancellationReason?: string;
  patientNotes?: string;
  scheduledAt: string;
}

const STATUS_CONFIG = {
  completed: { label: 'Terminé', color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: 'CheckCircleIcon' },
  cancelled: { label: 'Annulé', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: 'XCircleIcon' },
  no_show: { label: 'Absent', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: 'ExclamationCircleIcon' },
};

const MOCK_HISTORY: AppointmentRecord[] = [
  {
    id: 'hist-001',
    proName: 'Dr. Aminata Diallo',
    specialty: 'Médecine générale',
    date: '15 juil. 2026',
    time: '09:00',
    duration: 15,
    type: 'in_person',
    status: 'completed',
    patientNotes: 'Consultation de suivi pour tension artérielle. Renouvellement ordonnance.',
    scheduledAt: '2026-07-15T09:00:00',
  },
  {
    id: 'hist-002',
    proName: 'Dr. Moussa Traoré',
    specialty: 'Cardiologie',
    date: '02 juil. 2026',
    time: '14:30',
    duration: 15,
    type: 'teleconsultation',
    status: 'cancelled',
    cancellationReason: 'Empêchement professionnel imprévu — annulé 72h avant le RDV.',
    scheduledAt: '2026-07-02T14:30:00',
  },
  {
    id: 'hist-003',
    proName: 'Dr. Fatou Ndiaye',
    specialty: 'Pédiatrie',
    date: '20 juin 2026',
    time: '10:00',
    duration: 15,
    type: 'in_person',
    status: 'completed',
    patientNotes: 'Bilan de santé annuel enfant. Vaccins à jour.',
    scheduledAt: '2026-06-20T10:00:00',
  },
  {
    id: 'hist-004',
    proName: 'Dr. Ibrahim Koné',
    specialty: 'Dermatologie',
    date: '10 juin 2026',
    time: '11:15',
    duration: 15,
    type: 'teleconsultation',
    status: 'completed',
    patientNotes: 'Consultation visio pour éruption cutanée. Prescription crème corticoïde.',
    scheduledAt: '2026-06-10T11:15:00',
  },
  {
    id: 'hist-005',
    proName: 'Dr. Mariama Bah',
    specialty: 'Gynécologie',
    date: '28 mai 2026',
    time: '08:30',
    duration: 15,
    type: 'in_person',
    status: 'cancelled',
    cancellationReason: 'Annulé par le prestataire — indisponibilité urgente.',
    scheduledAt: '2026-05-28T08:30:00',
  },
];

export default function AppointmentHistoryContent() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  const supabase = createClient();

  const fetchHistory = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          scheduled_at,
          duration_minutes,
          appointment_type,
          status,
          reason,
          teleconsultation,
          notes,
          professionals (
            first_name,
            last_name,
            specialty,
            profession
          )
        `)
        .eq('patient_id', patientId)
        .in('status', ['completed', 'cancelled', 'no_show'])
        .order('scheduled_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setAppointments(MOCK_HISTORY);
        return;
      }

      const mapped: AppointmentRecord[] = data.map((a: any) => {
        const pro = a.professionals;
        const dt = a.scheduled_at ? new Date(a.scheduled_at) : null;
        return {
          id: a.id,
          proName: pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Médecin',
          specialty: pro?.specialty || pro?.profession || 'Médecine générale',
          date: dt ? dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          time: dt ? dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
          duration: a.duration_minutes || 15,
          type: a.teleconsultation ? 'teleconsultation' : 'in_person',
          status: a.status as AppointmentRecord['status'],
          cancellationReason: a.reason || undefined,
          patientNotes: a.notes || undefined,
          scheduledAt: a.scheduled_at || '',
        };
      });

      setAppointments(mapped);
    } catch {
      setAppointments(MOCK_HISTORY);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAppointments(MOCK_HISTORY);
          setRealtimeStatus('error');
          return;
        }

        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!patient) {
          setAppointments(MOCK_HISTORY);
          setRealtimeStatus('error');
          return;
        }

        await fetchHistory(patient.id);

        // Realtime subscription
        const channel = supabase
          .channel(`appt-history-${patient.id}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `patient_id=eq.${patient.id}`,
          }, () => {
            fetchHistory(patient.id);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') setRealtimeStatus('live');
            else if (status === 'CHANNEL_ERROR') setRealtimeStatus('error');
          });

        channelRef.current = channel;
      } catch {
        setAppointments(MOCK_HISTORY);
        setRealtimeStatus('error');
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, []);

  const filtered = appointments.filter(a =>
    filterStatus === 'all' ? true : a.status === filterStatus
  );

  const counts = {
    all: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show').length,
  };

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/appointment-booking"
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={18} className="text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
              Historique des rendez-vous
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: realtimeStatus === 'live' ? '#10b981' : realtimeStatus === 'error' ? '#ef4444' : '#f59e0b',
                  boxShadow: realtimeStatus === 'live' ? '0 0 0 3px rgba(16,185,129,0.15)' : 'none',
                }}
              />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {realtimeStatus === 'live' ? 'Temps réel actif' : realtimeStatus === 'error' ? 'Hors ligne' : 'Connexion...'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { key: 'all', label: 'Total', count: counts.all, color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.06)' },
            { key: 'completed', label: 'Terminés', count: counts.completed, color: '#10b981', bg: 'rgba(16,185,129,0.06)' },
            { key: 'cancelled', label: 'Annulés', count: counts.cancelled, color: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
          ].map(stat => (
            <div key={stat.key} className="rounded-2xl p-4 text-center" style={{ backgroundColor: stat.bg, border: `1px solid ${stat.color}20` }}>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.count}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'completed', label: 'Terminés' },
            { key: 'cancelled', label: 'Annulés' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key as any)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                backgroundColor: filterStatus === f.key ? 'var(--card)' : 'transparent',
                color: filterStatus === f.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement de l'historique...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="CalendarDaysIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun rendez-vous trouvé</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos rendez-vous passés apparaîtront ici.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(appt => {
              const st = STATUS_CONFIG[appt.status] || STATUS_CONFIG.cancelled;
              const isExpanded = expandedId === appt.id;

              return (
                <div
                  key={appt.id}
                  className="rounded-2xl border overflow-hidden transition-all"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  {/* Main row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                    className="w-full text-left p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Type icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: appt.type === 'teleconsultation' ? 'rgba(139,92,246,0.1)' : 'rgba(0,102,255,0.08)' }}
                      >
                        <Icon
                          name={appt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'}
                          size={18}
                          style={{ color: appt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any}
                          className=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{appt.proName}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{appt.specialty}</p>
                          </div>
                          <span
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                            style={{ color: st.color, backgroundColor: st.bg }}
                          >
                            <Icon name={st.icon as any} size={12} />
                            {st.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5">
                            <Icon name="CalendarDaysIcon" size={13} className="text-muted-foreground" />
                            <span className="text-xs" style={{ color: 'var(--foreground)' }}>{appt.date} à {appt.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Icon name="ClockIcon" size={13} className="text-muted-foreground" />
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{appt.duration} min</span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: appt.type === 'teleconsultation' ? 'rgba(139,92,246,0.08)' : 'var(--muted)',
                              color: appt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--muted-foreground)',
                            }}
                          >
                            {appt.type === 'teleconsultation' ? '📹 Visio' : 'Présentiel'}
                          </span>
                        </div>
                      </div>

                      <Icon
                        name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                        size={16}
                        className="text-muted-foreground shrink-0 mt-1"
                      />
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="pt-4 flex flex-col gap-3">
                        {/* Cancellation reason */}
                        {appt.cancellationReason && (
                          <div
                            className="flex items-start gap-2.5 p-3 rounded-xl"
                            style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            <Icon name="XCircleIcon" size={15} style={{ color: '#ef4444', flexShrink: 0 } as any} className="mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: '#ef4444' }}>Motif d'annulation</p>
                              <p className="text-xs" style={{ color: 'var(--foreground)' }}>{appt.cancellationReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Patient notes */}
                        {appt.patientNotes ? (
                          <div
                            className="flex items-start gap-2.5 p-3 rounded-xl"
                            style={{ backgroundColor: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.12)' }}
                          >
                            <Icon name="PencilSquareIcon" size={15} style={{ color: 'var(--shifa-blue)', flexShrink: 0 } as any} className="mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--shifa-blue)' }}>Notes du patient</p>
                              <p className="text-xs" style={{ color: 'var(--foreground)' }}>{appt.patientNotes}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>Aucune note pour ce rendez-vous.</p>
                        )}

                        {/* Rebook button for completed */}
                        {appt.status === 'completed' && (
                          <Link
                            href="/appointment-booking"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                            style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', border: '1px solid rgba(0,102,255,0.2)' }}
                          >
                            <Icon name="ArrowPathIcon" size={14} />
                            Reprendre RDV avec {appt.proName.split(' ')[0]} {appt.proName.split(' ')[1]}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
