'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// Types
// ============================================================
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  date: string;
  slotDate: string;
}

interface BookingProfessional {
  id: string;
  name: string;
  profession: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  teleconsultation: boolean;
  languages: string[];
  avatar: string;
  verified: boolean;
  bio: string;
  nextSlot: string;
  consultationFee: string;
}

interface ExistingAppointment {
  id: string;
  proName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in_person' | 'teleconsultation';
  status: 'scheduled' | 'cancelled' | 'completed' | 'rescheduled';
  scheduledAt: Date;
}

type BookingStep = 'search' | 'profile' | 'slots' | 'confirm' | 'success';
type MainView = 'book' | 'my-appointments' | 'calendar';

// ============================================================
// Calendar helpers
// ============================================================
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

// ============================================================
// Mock existing appointments
// ============================================================
const mockAppointments: ExistingAppointment[] = [
  {
    id: 'appt-001',
    proName: 'Dr. Aminata Diallo',
    specialty: 'Médecine générale',
    date: '2026-08-20',
    time: '10:00',
    type: 'in_person',
    status: 'scheduled',
    scheduledAt: new Date('2026-08-20T10:00:00'),
  },
  {
    id: 'appt-002',
    proName: 'Dr. Moussa Traoré',
    specialty: 'Cardiologie',
    date: '2026-08-25',
    time: '14:30',
    type: 'teleconsultation',
    status: 'scheduled',
    scheduledAt: new Date('2026-08-25T14:30:00'),
  },
  {
    id: 'appt-003',
    proName: 'Dr. Fatou Ndiaye',
    specialty: 'Pédiatrie',
    date: '2026-07-15',
    time: '09:00',
    type: 'in_person',
    status: 'completed',
    scheduledAt: new Date('2026-07-15T09:00:00'),
  },
];

// ============================================================
// Main Component
// ============================================================
export default function AppointmentBookingContent() {
  const [mainView, setMainView] = useState<MainView>('book');
  const [step, setStep] = useState<BookingStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPro, setSelectedPro] = useState<BookingProfessional | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'in_person' | 'teleconsultation'>('in_person');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [professionals, setProfessionals] = useState<BookingProfessional[]>([]);
  const [loadingPros, setLoadingPros] = useState(true);
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Appointment management state
  const [appointments, setAppointments] = useState<ExistingAppointment[]>(mockAppointments);
  const [managingAppt, setManagingAppt] = useState<ExistingAppointment | null>(null);
  const [manageAction, setManageAction] = useState<'cancel' | 'modify' | null>(null);
  const [manageReason, setManageReason] = useState('');
  const [manageReasonError, setManageReasonError] = useState('');
  const [manageSuccess, setManageSuccess] = useState('');
  const [newApptDate, setNewApptDate] = useState('');
  const [newApptTime, setNewApptTime] = useState('');

  // Calendar state
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const supabase = createClient();

  // Load professionals from Supabase
  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoadingPros(true);
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('id, first_name, last_name, profession, specialty, bio, rating, review_count, teleconsultation, languages, is_verified, country_code')
          .eq('status', 'active')
          .order('rating', { ascending: false })
          .limit(20);

        if (error) {
          setProfessionals([]);
          return;
        }

        const mapped: BookingProfessional[] = (data || []).map((p) => ({
          id: p.id,
          name: `Dr. ${p.first_name} ${p.last_name}`,
          profession: p.profession || 'Médecin',
          specialty: p.specialty || p.profession || 'Médecine générale',
          location: p.country_code === 'SN' ? 'Dakar, Sénégal' : p.country_code || 'Afrique',
          rating: Number(p.rating) || 0,
          reviews: p.review_count || 0,
          teleconsultation: p.teleconsultation || false,
          languages: p.languages || ['Français'],
          avatar: `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`,
          verified: p.is_verified || false,
          bio: p.bio || '',
          nextSlot: 'Disponible',
          consultationFee: '15 000 FCFA',
        }));

        setProfessionals(mapped);
      } catch {
        setProfessionals([]);
      } finally {
        setLoadingPros(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Load availability slots for selected professional
  const loadSlots = async (proId: string) => {
    setLoadingSlots(true);
    try {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 14);

      const { data, error } = await supabase
        .from('availability_slots')
        .select('id, slot_date, start_time, end_time, is_available')
        .eq('professional_id', proId)
        .eq('is_available', true)
        .gte('slot_date', today.toISOString().split('T')[0])
        .lte('slot_date', futureDate.toISOString().split('T')[0])
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        setSlots({});
        return;
      }

      const grouped: Record<string, TimeSlot[]> = {};
      (data || []).forEach((slot) => {
        const dateKey = slot.slot_date;
        if (!grouped[dateKey]) grouped[dateKey] = [];
        const dateObj = new Date(slot.slot_date + 'T00:00:00');
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
        let dateLabel = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
        if (slot.slot_date === todayStr) dateLabel = "Aujourd'hui";
        else if (slot.slot_date === tomorrowStr) dateLabel = 'Demain';

        grouped[dateKey].push({
          id: slot.id,
          time: slot.start_time?.slice(0, 5) || '',
          available: slot.is_available,
          date: dateLabel,
          slotDate: slot.slot_date,
        });
      });

      setSlots(grouped);
      const firstDate = Object.keys(grouped)[0];
      if (firstDate) setSelectedDate(firstDate);
    } catch {
      setSlots({});
    } finally {
      setLoadingSlots(false);
    }
  };

  const filteredPros = professionals.filter(p =>
    !searchQuery ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dateKeys = Object.keys(slots);

  const handleSelectPro = (pro: BookingProfessional) => {
    setSelectedPro(pro);
    loadSlots(pro.id);
    setStep('profile');
  };

  const handleBookSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('confirm');
  };

  const handleConfirmBooking = async () => {
    if (!selectedPro || !selectedSlot) return;
    setIsLoading(true);
    setBookingError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!patientData) {
        setBookingError('Profil patient introuvable. Veuillez compléter votre profil.');
        setIsLoading(false);
        return;
      }

      const scheduledAt = new Date(`${selectedSlot.slotDate}T${selectedSlot.time}:00`).toISOString();

      const { data: appt, error: apptError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientData.id,
          professional_id: selectedPro.id,
          scheduled_at: scheduledAt,
          duration_minutes: 30,
          appointment_type: 'consultation',
          status: 'scheduled',
          reason: reason || null,
          teleconsultation: consultationType === 'teleconsultation',
          created_by: user.id,
        })
        .select('id')
        .single();

      if (apptError) {
        setBookingError('Erreur lors de la réservation. Veuillez réessayer.');
        setIsLoading(false);
        return;
      }

      await supabase
        .from('availability_slots')
        .update({ is_available: false, appointment_id: appt.id })
        .eq('id', selectedSlot.id);

      setBookingRef('RDV-' + appt.id.substring(0, 8).toUpperCase());
      setStep('success');
    } catch (err: any) {
      setBookingError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetBooking = () => {
    setStep('search');
    setSelectedPro(null);
    setSelectedSlot(null);
    setReason('');
    setBookingRef('');
    setBookingError('');
  };

  // ── 48h rule check ──
  const canManageAppointment = (appt: ExistingAppointment) => {
    const now = new Date();
    const diff = appt.scheduledAt.getTime() - now.getTime();
    const hoursUntil = diff / (1000 * 60 * 60);
    return hoursUntil >= 48;
  };

  const hoursUntilAppointment = (appt: ExistingAppointment) => {
    const now = new Date();
    const diff = appt.scheduledAt.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  };

  const handleManageAction = (appt: ExistingAppointment, action: 'cancel' | 'modify') => {
    setManagingAppt(appt);
    setManageAction(action);
    setManageReason('');
    setManageReasonError('');
    setManageSuccess('');
    setNewApptDate('');
    setNewApptTime('');
  };

  const handleConfirmManage = () => {
    if (!managingAppt || !manageAction) return;
    if (!manageReason.trim()) {
      setManageReasonError('Veuillez indiquer le motif de cette modification.');
      return;
    }
    if (manageAction === 'modify' && (!newApptDate || !newApptTime)) {
      setManageReasonError('Veuillez sélectionner une nouvelle date et heure.');
      return;
    }
    setManageReasonError('');

    if (manageAction === 'cancel') {
      setAppointments(prev => prev.map(a =>
        a.id === managingAppt.id ? { ...a, status: 'cancelled' as const } : a
      ));
      setManageSuccess('Rendez-vous annulé avec succès.');
    } else {
      setAppointments(prev => prev.map(a =>
        a.id === managingAppt.id ? {
          ...a,
          date: newApptDate,
          time: newApptTime,
          status: 'rescheduled' as const,
          scheduledAt: new Date(`${newApptDate}T${newApptTime}:00`),
        } : a
      ));
      setManageSuccess('Rendez-vous déplacé avec succès.');
    }

    setTimeout(() => {
      setManagingAppt(null);
      setManageAction(null);
      setManageSuccess('');
    }, 2000);
  };

  // ── Calendar rendering ──
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const apptDates = new Set(
    appointments
      .filter(a => a.status === 'scheduled' || a.status === 'rescheduled')
      .map(a => a.date)
  );

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const calendarDayStr = (day: number) => {
    const m = String(calMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${calYear}-${m}-${d}`;
  };

  const apptStatusConfig = {
    scheduled: { label: 'Prévu', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    rescheduled: { label: 'Déplacé', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
    completed: { label: 'Terminé', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)' },
    cancelled: { label: 'Annulé', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      {/* Main view tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'book', label: 'Prendre RDV', icon: 'PlusCircleIcon' },
          { key: 'my-appointments', label: 'Mes rendez-vous', icon: 'CalendarDaysIcon' },
          { key: 'calendar', label: 'Calendrier', icon: 'CalendarIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setMainView(tab.key as MainView); resetBooking(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: mainView === tab.key ? 'var(--card)' : 'transparent',
              color: mainView === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          VIEW: CALENDAR
      ══════════════════════════════════════════════════════ */}
      {mainView === 'calendar' && (
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Icon name="ChevronLeftIcon" size={18} className="text-muted-foreground" />
            </button>
            <h2 className="font-bold text-lg" style={{ color: 'var(--shifa-dark)' }}>
              {MONTH_NAMES_FR[calMonth]} {calYear}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Icon name="ChevronRightIcon" size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES_FR.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: 'var(--muted-foreground)' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayStr = calendarDayStr(day);
              const hasAppt = apptDates.has(dayStr);
              const isToday = dayStr === now.toISOString().split('T')[0];
              const dayAppts = appointments.filter(a => a.date === dayStr && (a.status === 'scheduled' || a.status === 'rescheduled'));
              return (
                <div
                  key={day}
                  className="relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm transition-all cursor-default"
                  style={{
                    backgroundColor: isToday ? 'var(--shifa-blue)' : hasAppt ? 'rgba(0,102,255,0.06)' : 'transparent',
                    color: isToday ? 'white' : 'var(--foreground)',
                    border: hasAppt && !isToday ? '1px solid rgba(0,102,255,0.2)' : '1px solid transparent',
                  }}
                  title={dayAppts.map(a => `${a.time} - ${a.proName}`).join('\n')}
                >
                  <span className="font-semibold text-xs">{day}</span>
                  {hasAppt && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayAppts.slice(0, 3).map((_, idx) => (
                        <div key={idx} className="w-1 h-1 rounded-full" style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.8)' : 'var(--shifa-blue)' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: 'rgba(0,102,255,0.06)', borderColor: 'rgba(0,102,255,0.2)' }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Rendez-vous prévu</span>
            </div>
          </div>

          {/* Upcoming appointments list */}
          <div className="mt-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Rendez-vous à venir</h3>
            <div className="flex flex-col gap-2">
              {appointments
                .filter(a => (a.status === 'scheduled' || a.status === 'rescheduled') && a.scheduledAt >= now)
                .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
                .map(appt => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                      <Icon name={appt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={15} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{appt.proName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{appt.date} à {appt.time}</p>
                    </div>
                  </div>
                ))}
              {appointments.filter(a => (a.status === 'scheduled' || a.status === 'rescheduled') && a.scheduledAt >= now).length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Aucun rendez-vous à venir</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW: MY APPOINTMENTS
      ══════════════════════════════════════════════════════ */}
      {mainView === 'my-appointments' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg" style={{ color: 'var(--shifa-dark)' }}>Mes rendez-vous</h2>
          </div>

          {/* Manage modal */}
          {managingAppt && manageAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="w-full max-w-md rounded-2xl p-6 shadow-xl" style={{ backgroundColor: 'var(--card)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>
                    {manageAction === 'cancel' ? 'Annuler le rendez-vous' : 'Déplacer le rendez-vous'}
                  </h3>
                  <button onClick={() => { setManagingAppt(null); setManageAction(null); }} className="p-1.5 rounded-lg hover:bg-muted">
                    <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
                  </button>
                </div>

                {manageSuccess ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Icon name="CheckCircleIcon" size={20} style={{ color: 'var(--shifa-green)' } as any} className="" />
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-green)' }}>{manageSuccess}</p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{managingAppt.proName}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{managingAppt.date} à {managingAppt.time}</p>
                    </div>

                    {/* 48h warning */}
                    <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#f59e0b', flexShrink: 0 } as any} className="mt-0.5" />
                      <p className="text-xs" style={{ color: '#92400e' }}>
                        <strong>Règle des 48h :</strong> Toute annulation ou modification doit être effectuée au moins 48h avant le rendez-vous. Le non-respect de cette règle peut entraîner des sanctions.
                      </p>
                    </div>

                    {manageAction === 'modify' && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Nouvelle date</label>
                          <input
                            type="date"
                            className="input-field w-full text-sm"
                            value={newApptDate}
                            onChange={e => setNewApptDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Nouvelle heure</label>
                          <input
                            type="time"
                            className="input-field w-full text-sm"
                            value={newApptTime}
                            onChange={e => setNewApptTime(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                        Motif <span style={{ color: 'var(--shifa-red)' }}>*</span>
                        <span className="font-normal text-xs ml-1" style={{ color: 'var(--muted-foreground)' }}>(obligatoire)</span>
                      </label>
                      <textarea
                        className="input-field w-full resize-none"
                        rows={3}
                        placeholder={manageAction === 'cancel' ? 'Expliquez pourquoi vous annulez ce rendez-vous...' : 'Expliquez pourquoi vous souhaitez déplacer ce rendez-vous...'}
                        value={manageReason}
                        onChange={e => setManageReason(e.target.value)}
                      />
                      {manageReasonError && (
                        <p className="mt-1 text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{manageReasonError}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => { setManagingAppt(null); setManageAction(null); }}
                        className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-muted"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleConfirmManage}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: manageAction === 'cancel' ? '#ef4444' : 'var(--shifa-blue)' }}
                      >
                        {manageAction === 'cancel' ? 'Confirmer l\'annulation' : 'Confirmer le déplacement'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {appointments.map(appt => {
              const st = apptStatusConfig[appt.status];
              const canManage = canManageAppointment(appt) && (appt.status === 'scheduled' || appt.status === 'rescheduled');
              const hours = hoursUntilAppointment(appt);
              return (
                <div key={appt.id} className="card-base p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                      <Icon name={appt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{appt.proName}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{appt.specialty}</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ color: st.color, backgroundColor: st.bg }}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <Icon name="CalendarDaysIcon" size={13} className="text-muted-foreground" />
                          <span className="text-xs" style={{ color: 'var(--foreground)' }}>{appt.date} à {appt.time}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                          {appt.type === 'teleconsultation' ? 'Téléconsultation' : 'Présentiel'}
                        </span>
                      </div>

                      {/* 48h warning for upcoming appointments */}
                      {(appt.status === 'scheduled' || appt.status === 'rescheduled') && hours > 0 && hours < 48 && (
                        <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                          <Icon name="ExclamationTriangleIcon" size={12} style={{ color: '#ef4444' } as any} className="" />
                          <p className="text-xs" style={{ color: '#ef4444' }}>
                            Modification impossible — moins de 48h avant le RDV ({hours}h restantes)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button
                        onClick={() => handleManageAction(appt, 'modify')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                        style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}
                      >
                        <Icon name="PencilSquareIcon" size={13} />
                        Déplacer
                      </button>
                      <button
                        onClick={() => handleManageAction(appt, 'cancel')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm"
                        style={{ borderColor: '#ef4444', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)' }}
                      >
                        <Icon name="XCircleIcon" size={13} />
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          VIEW: BOOK APPOINTMENT
      ══════════════════════════════════════════════════════ */}
      {mainView === 'book' && (
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              {step !== 'search' && step !== 'success' && (
                <button
                  onClick={() => {
                    if (step === 'profile') setStep('search');
                    else if (step === 'slots') setStep('profile');
                    else if (step === 'confirm') setStep('slots');
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Icon name="ArrowLeftIcon" size={18} className="text-muted-foreground" />
                </button>
              )}
              <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>
                {step === 'search' && 'Prendre un rendez-vous'}
                {step === 'profile' && selectedPro?.name}
                {step === 'slots' && 'Choisir un créneau'}
                {step === 'confirm' && 'Confirmer le rendez-vous'}
                {step === 'success' && 'Rendez-vous confirmé'}
              </h1>
            </div>

            {step !== 'success' && (
              <div className="flex items-center gap-2 mt-3">
                {(['search', 'profile', 'slots', 'confirm'] as BookingStep[]).map((s, i) => {
                  const steps = ['search', 'profile', 'slots', 'confirm'];
                  const currentIdx = steps.indexOf(step);
                  const stepIdx = steps.indexOf(s);
                  const isDone = stepIdx < currentIdx;
                  const isCurrent = s === step;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                          style={{
                            backgroundColor: isDone ? 'var(--shifa-green)' : isCurrent ? 'var(--shifa-blue)' : 'var(--muted)',
                            color: isDone || isCurrent ? 'white' : 'var(--muted-foreground)',
                          }}
                        >
                          {isDone ? <Icon name="CheckIcon" size={12} /> : i + 1}
                        </div>
                        <span className="text-xs font-medium hidden sm:block" style={{ color: isCurrent ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
                          {['Recherche', 'Profil', 'Créneaux', 'Confirmation'][i]}
                        </span>
                      </div>
                      {i < 3 && <div className="flex-1 h-px" style={{ backgroundColor: isDone ? 'var(--shifa-green)' : 'var(--border)' }} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── STEP 1: SEARCH ── */}
          {step === 'search' && (
            <div>
              <div className="relative mb-5">
                <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Médecin, spécialité, établissement..."
                  className="input-field pl-10 w-full"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {loadingPros ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des professionnels...</span>
                </div>
              ) : filteredPros.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="UserGroupIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun professionnel trouvé</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Essayez une autre recherche</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPros.map(pro => (
                    <div
                      key={pro.id}
                      className="rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-shifa hover:border-primary"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                      onClick={() => handleSelectPro(pro)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                        >
                          {pro.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{pro.name}</p>
                            {pro.verified && <Icon name="CheckBadgeIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} className="" />}
                          </div>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.profession}</p>
                          <p className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>{pro.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Icon name="StarIcon" size={13} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                          <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{pro.rating > 0 ? pro.rating.toFixed(1) : 'N/A'}</span>
                          {pro.reviews > 0 && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({pro.reviews})</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {pro.teleconsultation && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0, 242, 195, 0.1)', color: 'var(--shifa-cyan)' }}>
                              Téléconsultation
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Icon name="MapPinIcon" size={12} className="text-muted-foreground" />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: PROFILE ── */}
          {step === 'profile' && selectedPro && (
            <div className="space-y-4">
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                  >
                    {selectedPro.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{selectedPro.name}</h2>
                      {selectedPro.verified && <Icon name="CheckBadgeIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />}
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>{selectedPro.specialty}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.profession}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Icon name="StarIcon" size={14} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                        <span className="text-sm font-semibold">{selectedPro.rating > 0 ? selectedPro.rating.toFixed(1) : 'N/A'}</span>
                        {selectedPro.reviews > 0 && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({selectedPro.reviews} avis)</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MapPinIcon" size={14} className="text-muted-foreground" />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedPro.bio && (
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedPro.languages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>{lang}</span>
                  ))}
                  {selectedPro.teleconsultation && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0, 242, 195, 0.1)', color: 'var(--shifa-cyan)' }}>
                      Téléconsultation disponible
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type de consultation</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'in_person', label: 'En présentiel', icon: 'BuildingOffice2Icon' },
                    { key: 'teleconsultation', label: 'Téléconsultation', icon: 'VideoCameraIcon', disabled: !selectedPro.teleconsultation },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      disabled={opt.disabled}
                      onClick={() => setConsultationType(opt.key as any)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                      style={{
                        backgroundColor: consultationType === opt.key ? 'var(--shifa-blue)' : 'var(--background)',
                        borderColor: consultationType === opt.key ? 'var(--shifa-blue)' : 'var(--border)',
                        color: consultationType === opt.key ? 'white' : 'var(--foreground)',
                      }}
                    >
                      <Icon name={opt.icon as any} size={16} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep('slots')} className="btn-primary w-full py-3">
                Voir les créneaux disponibles
                <Icon name="ArrowRightIcon" size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 3: SLOTS ── */}
          {step === 'slots' && selectedPro && (
            <div>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des créneaux...</span>
                </div>
              ) : dateKeys.length === 0 ? (
                <div className="text-center py-16">
                  <Icon name="CalendarDaysIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun créneau disponible</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Ce professionnel n'a pas de créneaux dans les 14 prochains jours</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 mb-5">
                    {dateKeys.map(dateKey => {
                      const daySlots = slots[dateKey] || [];
                      const label = daySlots[0]?.date || dateKey;
                      return (
                        <button
                          key={dateKey}
                          onClick={() => setSelectedDate(dateKey)}
                          className="shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                          style={{
                            backgroundColor: selectedDate === dateKey ? 'var(--shifa-blue)' : 'var(--card)',
                            borderColor: selectedDate === dateKey ? 'var(--shifa-blue)' : 'var(--border)',
                            color: selectedDate === dateKey ? 'white' : 'var(--foreground)',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(slots[selectedDate] || []).map(slot => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => handleBookSlot(slot)}
                        className="py-2.5 rounded-xl border text-sm font-semibold transition-all"
                        style={{
                          backgroundColor: slot.available ? 'var(--card)' : 'var(--muted)',
                          borderColor: slot.available ? 'var(--shifa-blue)' : 'var(--border)',
                          color: slot.available ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                          opacity: slot.available ? 1 : 0.5,
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 4: CONFIRM ── */}
          {step === 'confirm' && selectedPro && selectedSlot && (
            <div className="space-y-4">
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Récapitulatif</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                      {selectedPro.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{selectedPro.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="CalendarDaysIcon" size={16} className="text-muted-foreground" />
                    <span style={{ color: 'var(--foreground)' }}>{selectedSlot.date} à {selectedSlot.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name={consultationType === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={16} className="text-muted-foreground" />
                    <span style={{ color: 'var(--foreground)' }}>{consultationType === 'teleconsultation' ? 'Téléconsultation' : 'En présentiel'}</span>
                  </div>
                </div>
              </div>

              {/* 48h policy notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.05)', border: '1px solid rgba(0,102,255,0.15)' }}>
                <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)', flexShrink: 0 } as any} className="mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <strong style={{ color: 'var(--foreground)' }}>Politique d'annulation :</strong> Toute annulation ou modification doit être effectuée au moins <strong>48h avant</strong> le rendez-vous. Un motif obligatoire sera demandé. Le non-respect peut entraîner des sanctions.
                </p>
              </div>

              <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--foreground)' }}>Motif de consultation (optionnel)</label>
                <textarea
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Décrivez brièvement le motif de votre consultation..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>

              {bookingError && (
                <div className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{bookingError}</p>
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="btn-primary w-full py-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    <Icon name="CheckIcon" size={16} />
                    Confirmer le rendez-vous
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 5: SUCCESS ── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <Icon name="CheckCircleIcon" size={40} style={{ color: 'var(--shifa-green)' } as any} className="" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Rendez-vous confirmé !</h2>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Votre rendez-vous a été enregistré avec succès.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border mb-6" style={{ borderColor: 'var(--shifa-green)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--shifa-green)' }}>{bookingRef}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={resetBooking} className="btn-secondary px-6 py-2.5">
                  Nouveau rendez-vous
                </button>
                <button onClick={() => setMainView('my-appointments')} className="btn-primary px-6 py-2.5">
                  Voir mes rendez-vous
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
