'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  proId?: string;
}

// Calendar availability per date
interface DayAvailability {
  hasSlots: boolean;
  slotCount: number;
  hasVisio: boolean;
  slots: CalendarSlot[];
}

interface CalendarSlot {
  id: string;
  time: string;
  proName: string;
  proId: string;
  proAvatar: string;
  type: 'in_person' | 'teleconsultation';
  specialty: string;
  fee: string;
}

// Reschedule slot (simple)
interface RescheduleSlot {
  id: string;
  time: string;
  type: 'in_person' | 'teleconsultation';
}

type BookingStep = 'search' | 'profile' | 'slots' | 'confirm' | 'success';
type MainView = 'book' | 'my-appointments' | 'calendar';
type RescheduleStep = 'calendar' | 'slots' | 'confirm';

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

// Generate 15-min slots for a day (08:00 – 18:00)
function generate15MinSlots(dateStr: string, proId: string, proName: string, proAvatar: string, specialty: string, hasVisio: boolean): CalendarSlot[] {
  const slots: CalendarSlot[] = [];
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      // Simulate some slots as taken (deterministic based on time)
      const taken = (h + m) % 7 === 0;
      if (!taken) {
        slots.push({
          id: `${dateStr}-${proId}-${time}`,
          time,
          proName,
          proId,
          proAvatar,
          type: hasVisio && (h % 3 === 0) ? 'teleconsultation' : 'in_person',
          specialty,
          fee: '15 000 FCFA',
        });
      }
    }
  }
  return slots;
}

// Generate reschedule slots for a specific pro/date (15-min, deterministic)
function generateRescheduleSlots(dateStr: string, proId: string, hasVisio: boolean): RescheduleSlot[] {
  const slots: RescheduleSlot[] = [];
  // Use date + proId hash to vary availability per pro
  const seed = proId.charCodeAt(0) || 1;
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      // Deterministic "taken" slots vary by pro
      const taken = (h * 4 + m / 15 + seed) % 5 === 0;
      if (!taken) {
        slots.push({
          id: `reschedule-${dateStr}-${proId}-${time}`,
          time,
          type: hasVisio && h % 4 === 0 ? 'teleconsultation' : 'in_person',
        });
      }
    }
  }
  return slots;
}

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
    proId: 'mock-1',
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
    proId: 'mock-2',
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
    proId: 'mock-3',
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

  // Confirmation modal state
  const [confirmedAppt, setConfirmedAppt] = useState<{
    ref: string;
    proName: string;
    specialty: string;
    date: string;
    time: string;
    type: 'in_person' | 'teleconsultation';
    location: string;
    visioLink?: string;
    notes: string;
  } | null>(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [showRescheduleRequest, setShowRescheduleRequest] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // Appointment management state
  const [appointments, setAppointments] = useState<ExistingAppointment[]>(mockAppointments);
  const [managingAppt, setManagingAppt] = useState<ExistingAppointment | null>(null);
  const [manageAction, setManageAction] = useState<'cancel' | 'modify' | null>(null);
  const [manageReason, setManageReason] = useState('');
  const [manageReasonError, setManageReasonError] = useState('');
  const [manageSuccess, setManageSuccess] = useState('');

  // ── Doctolib-style reschedule state ──
  const [rescheduleStep, setRescheduleStep] = useState<RescheduleStep>('calendar');
  const [rescheduleCalYear, setRescheduleCalYear] = useState(new Date().getFullYear());
  const [rescheduleCalMonth, setRescheduleCalMonth] = useState(new Date().getMonth());
  const [rescheduleSelectedDate, setRescheduleSelectedDate] = useState<string>('');
  const [rescheduleAvailability, setRescheduleAvailability] = useState<Record<string, RescheduleSlot[]>>({});
  const [rescheduleLoadingSlots, setRescheduleLoadingSlots] = useState(false);
  const [rescheduleSelectedSlot, setRescheduleSelectedSlot] = useState<RescheduleSlot | null>(null);
  const [rescheduleTypeFilter, setRescheduleTypeFilter] = useState<'all' | 'in_person' | 'teleconsultation'>('all');

  // Calendar state
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calSelectedDate, setCalSelectedDate] = useState<string>(todayStr);
  const [calAvailability, setCalAvailability] = useState<Record<string, DayAvailability>>({});
  const [calBookingSlot, setCalBookingSlot] = useState<CalendarSlot | null>(null);
  const [calBookingReason, setCalBookingReason] = useState('');
  const [calBookingSuccess, setCalBookingSuccess] = useState('');
  const [calBookingLoading, setCalBookingLoading] = useState(false);
  const [calFilterVisio, setCalFilterVisio] = useState<'all' | 'in_person' | 'teleconsultation'>('all');

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

  // Build calendar availability from mock professionals (fallback when no DB data)
  const buildCalendarAvailability = useCallback((pros: BookingProfessional[], year: number, month: number) => {
    const availability: Record<string, DayAvailability> = {};
    const daysInMonth = getDaysInMonth(year, month);

    // Use mock pros if DB returned none
    const prosToUse = pros.length > 0 ? pros : [
      { id: 'mock-1', name: 'Dr. Aminata Diallo', specialty: 'Médecine générale', avatar: 'AD', teleconsultation: true },
      { id: 'mock-2', name: 'Dr. Moussa Traoré', specialty: 'Cardiologie', avatar: 'MT', teleconsultation: false },
      { id: 'mock-3', name: 'Dr. Fatou Ndiaye', specialty: 'Pédiatrie', avatar: 'FN', teleconsultation: true },
    ] as any[];

    for (let d = 1; d <= daysInMonth; d++) {
      let m = String(month + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${year}-${m}-${day}`;
      const dayOfWeek = new Date(dateStr).getDay();

      // Skip Sundays
      if (dayOfWeek === 0) continue;
      // Skip past dates
      if (dateStr < todayStr) continue;

      // Assign 1-3 pros per day deterministically
      const availPros = prosToUse.filter((_, i) => (d + i) % 3 !== 0).slice(0, 2);
      if (availPros.length === 0) continue;

      const allSlots: CalendarSlot[] = [];
      availPros.forEach(pro => {
        const proSlots = generate15MinSlots(dateStr, pro.id, pro.name, pro.avatar, pro.specialty, pro.teleconsultation);
        allSlots.push(...proSlots);
      });

      const hasVisio = allSlots.some(s => s.type === 'teleconsultation');
      availability[dateStr] = {
        hasSlots: allSlots.length > 0,
        slotCount: allSlots.length,
        hasVisio,
        slots: allSlots,
      };
    }
    return availability;
  }, [todayStr]);

  // Rebuild calendar availability when month changes or professionals load
  useEffect(() => {
    if (mainView === 'calendar') {
      const avail = buildCalendarAvailability(professionals, calYear, calMonth);
      setCalAvailability(avail);
    }
  }, [mainView, calYear, calMonth, professionals, buildCalendarAvailability]);

  // Build reschedule availability for a specific professional
  const buildRescheduleAvailability = useCallback(async (appt: ExistingAppointment, year: number, month: number) => {
    setRescheduleLoadingSlots(true);
    const availability: Record<string, RescheduleSlot[]> = {};
    const daysInMonth = getDaysInMonth(year, month);
    const proId = appt.proId || 'mock-1';
    const hasVisio = appt.type === 'teleconsultation';

    try {
      // Try to load from Supabase first
      const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const { data } = await supabase
        .from('availability_slots')
        .select('id, slot_date, start_time, is_available')
        .eq('professional_id', proId)
        .eq('is_available', true)
        .gte('slot_date', monthStart)
        .lte('slot_date', monthEnd)
        .neq('slot_date', appt.date) // exclude current appointment date
        .order('slot_date')
        .order('start_time');

      if (data && data.length > 0) {
        data.forEach(slot => {
          if (!availability[slot.slot_date]) availability[slot.slot_date] = [];
          availability[slot.slot_date].push({
            id: slot.id,
            time: slot.start_time?.slice(0, 5) || '',
            type: 'in_person',
          });
        });
      } else {
        // Fallback: generate deterministic slots
        for (let d = 1; d <= daysInMonth; d++) {
          let m = String(month + 1).padStart(2, '0');
          const day = String(d).padStart(2, '0');
          const dateStr = `${year}-${m}-${day}`;
          const dayOfWeek = new Date(dateStr).getDay();
          if (dayOfWeek === 0) continue; // no Sundays
          if (dateStr <= todayStr) continue; // no past dates
          if (dateStr === appt.date) continue; // exclude current date
          const slots = generateRescheduleSlots(dateStr, proId, hasVisio);
          if (slots.length > 0) availability[dateStr] = slots;
        }
      }
    } catch {
      // Fallback on error
      for (let d = 1; d <= daysInMonth; d++) {
        let m = String(month + 1).padStart(2, '0');
        const day = String(d).padStart(2, '0');
        const dateStr = `${year}-${m}-${day}`;
        const dayOfWeek = new Date(dateStr).getDay();
        if (dayOfWeek === 0) continue;
        if (dateStr <= todayStr) continue;
        if (dateStr === appt.date) continue;
        const slots = generateRescheduleSlots(dateStr, proId, hasVisio);
        if (slots.length > 0) availability[dateStr] = slots;
      }
    }

    setRescheduleAvailability(availability);
    setRescheduleLoadingSlots(false);
    return availability;
  }, [supabase, todayStr]);

  // Load availability slots for selected professional (booking flow)
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
        const todayDateStr = today.toISOString().split('T')[0];
        const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
        let dateLabel = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
        if (slot.slot_date === todayDateStr) dateLabel = "Aujourd'hui";
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
          duration_minutes: 15,
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

      const ref = 'RDV-' + appt.id.substring(0, 8).toUpperCase();
      setBookingRef(ref);

      // Build confirmed appointment details for modal
      setConfirmedAppt({
        ref,
        proName: selectedPro.name,
        specialty: selectedPro.specialty,
        date: selectedSlot.date,
        time: selectedSlot.time,
        type: consultationType,
        location: consultationType === 'teleconsultation' ? 'Téléconsultation' : selectedPro.location,
        visioLink: consultationType === 'teleconsultation' ? `https://shifa1387.builtwithrocket.new/teleconsultation-session?ref=${ref}` : undefined,
        notes: reason,
      });
      setConfirmNotes(reason);
      setNotesSaved(false);
      setShowRescheduleRequest(false);
      setRescheduleReason('');
      setRescheduleSuccess(false);
      setStep('success');
    } catch (err: any) {
      setBookingError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!confirmedAppt) return;
    setSavingNotes(true);
    await new Promise(r => setTimeout(r, 600));
    setConfirmedAppt(prev => prev ? { ...prev, notes: confirmNotes } : prev);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 3000);
  };

  const handleRescheduleRequest = () => {
    if (!rescheduleReason.trim()) return;
    setRescheduleSuccess(true);
    setTimeout(() => {
      setShowRescheduleRequest(false);
      setRescheduleSuccess(false);
      setRescheduleReason('');
    }, 2500);
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
    // Reset reschedule state
    setRescheduleStep('calendar');
    setRescheduleSelectedDate('');
    setRescheduleSelectedSlot(null);
    setRescheduleTypeFilter('all');
    let yr = now.getFullYear();
    let mo = now.getMonth();
    setRescheduleCalYear(yr);
    setRescheduleCalMonth(mo);
    if (action === 'modify') {
      buildRescheduleAvailability(appt, yr, mo);
    }
  };

  const handleRescheduleMonthChange = (dir: 'prev' | 'next') => {
    if (!managingAppt) return;
    let yr = rescheduleCalYear;
    let mo = rescheduleCalMonth;
    if (dir === 'prev') {
      if (mo === 0) { mo = 11; yr--; } else mo--;
    } else {
      if (mo === 11) { mo = 0; yr++; } else mo++;
    }
    setRescheduleCalYear(yr);
    setRescheduleCalMonth(mo);
    setRescheduleSelectedDate('');
    setRescheduleSelectedSlot(null);
    buildRescheduleAvailability(managingAppt, yr, mo);
  };

  const handleConfirmManage = () => {
    if (!managingAppt || !manageAction) return;
    if (!manageReason.trim()) {
      setManageReasonError('Veuillez indiquer le motif de cette modification.');
      return;
    }
    if (manageAction === 'modify' && (!rescheduleSelectedSlot || !rescheduleSelectedDate)) {
      setManageReasonError('Veuillez sélectionner un nouveau créneau.');
      return;
    }
    setManageReasonError('');

    if (manageAction === 'cancel') {
      setAppointments(prev => prev.map(a =>
        a.id === managingAppt.id ? { ...a, status: 'cancelled' as const } : a
      ));
      setManageSuccess('Rendez-vous annulé avec succès.');
    } else if (rescheduleSelectedSlot && rescheduleSelectedDate) {
      setAppointments(prev => prev.map(a =>
        a.id === managingAppt.id ? {
          ...a,
          date: rescheduleSelectedDate,
          time: rescheduleSelectedSlot.time,
          type: rescheduleSelectedSlot.type,
          status: 'rescheduled' as const,
          scheduledAt: new Date(`${rescheduleSelectedDate}T${rescheduleSelectedSlot.time}:00`),
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

  // ── Calendar helpers ──
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
    let m = String(calMonth + 1).padStart(2, '0');
    let d = String(day).padStart(2, '0');
    return `${calYear}-${m}-${d}`;
  };

  const rescheduleDayStr = (day: number) => {
    let m = String(rescheduleCalMonth + 1).padStart(2, '0');
    let d = String(day).padStart(2, '0');
    return `${rescheduleCalYear}-${m}-${d}`;
  };

  const selectedDayAvailability = calAvailability[calSelectedDate];
  const selectedDayAppts = appointments.filter(a => a.date === calSelectedDate && (a.status === 'scheduled' || a.status === 'rescheduled'));

  const filteredCalSlots = (selectedDayAvailability?.slots || []).filter(s =>
    calFilterVisio === 'all' ? true : s.type === calFilterVisio
  );

  const rescheduleDaysInMonth = getDaysInMonth(rescheduleCalYear, rescheduleCalMonth);
  const rescheduleFirstDay = getFirstDayOfMonth(rescheduleCalYear, rescheduleCalMonth);

  const selectedRescheduleSlots = rescheduleSelectedDate
    ? (rescheduleAvailability[rescheduleSelectedDate] || []).filter(s =>
        rescheduleTypeFilter === 'all' ? true : s.type === rescheduleTypeFilter
      )
    : [];

  const handleCalendarBooking = async () => {
    if (!calBookingSlot) return;
    setCalBookingLoading(true);
    // Simulate booking (optimistic)
    await new Promise(r => setTimeout(r, 800));
    const ref = 'RDV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const newAppt: ExistingAppointment = {
      id: ref,
      proName: calBookingSlot.proName,
      specialty: calBookingSlot.specialty,
      date: calSelectedDate,
      time: calBookingSlot.time,
      type: calBookingSlot.type,
      status: 'scheduled',
      scheduledAt: new Date(`${calSelectedDate}T${calBookingSlot.time}:00`),
    };
    setAppointments(prev => [...prev, newAppt]);
    setCalBookingSuccess(ref);
    setCalBookingLoading(false);
    // Remove slot from availability
    setCalAvailability(prev => {
      const day = prev[calSelectedDate];
      if (!day) return prev;
      return {
        ...prev,
        [calSelectedDate]: {
          ...day,
          slots: day.slots.filter(s => s.id !== calBookingSlot.id),
          slotCount: day.slotCount - 1,
        },
      };
    });
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
          VIEW: INTERACTIVE CALENDAR
      ══════════════════════════════════════════════════════ */}
      {mainView === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* ── Left: Calendar grid ── */}
          <div className="lg:col-span-3 card-base p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                disabled={calYear === now.getFullYear() && calMonth === now.getMonth()}
                style={{ opacity: calYear === now.getFullYear() && calMonth === now.getMonth() ? 0.3 : 1 }}
              >
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
                const isToday = dayStr === todayStr;
                const isSelected = dayStr === calSelectedDate;
                const isPast = dayStr < todayStr;
                const avail = calAvailability[dayStr];
                const hasSlots = avail?.hasSlots;
                const hasVisio = avail?.hasVisio;
                const dayAppts = appointments.filter(a => a.date === dayStr && (a.status === 'scheduled' || a.status === 'rescheduled'));

                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (!isPast) {
                        setCalSelectedDate(dayStr);
                        setCalBookingSlot(null);
                        setCalBookingSuccess('');
                        setCalBookingReason('');
                      }
                    }}
                    disabled={isPast}
                    className="relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl text-sm transition-all"
                    style={{
                      minHeight: '52px',
                      backgroundColor: isSelected
                        ? 'var(--shifa-blue)'
                        : isToday
                        ? 'rgba(0,102,255,0.12)'
                        : hasAppt
                        ? 'rgba(0,102,255,0.05)'
                        : 'transparent',
                      color: isSelected ? 'white' : isPast ? 'var(--muted-foreground)' : 'var(--foreground)',
                      border: isSelected
                        ? '2px solid var(--shifa-blue)'
                        : isToday
                        ? '2px solid rgba(0,102,255,0.4)'
                        : hasSlots
                        ? '1px solid rgba(16,185,129,0.3)'
                        : '1px solid transparent',
                      opacity: isPast ? 0.35 : 1,
                      cursor: isPast ? 'not-allowed' : 'pointer',
                    }}
                    title={
                      hasSlots
                        ? `${avail.slotCount} créneaux disponibles${hasVisio ? ' (dont visio)' : ''}`
                        : hasAppt
                        ? dayAppts.map(a => `${a.time} - ${a.proName}`).join('\n')
                        : ''
                    }
                  >
                    <span className="font-semibold text-xs leading-none">{day}</span>

                    {/* Indicators row */}
                    <div className="flex gap-0.5 mt-1 items-center justify-center flex-wrap">
                      {/* Green dot = available slots */}
                      {hasSlots && !isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                      )}
                      {/* Camera icon for visio availability */}
                      {hasVisio && !isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                      )}
                      {/* Blue dot = existing appointment */}
                      {hasAppt && (
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--shifa-blue)' }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Créneaux libres</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Visio disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Rendez-vous prévu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: 'rgba(0,102,255,0.4)', backgroundColor: 'rgba(0,102,255,0.12)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aujourd'hui</span>
              </div>
            </div>
          </div>

          {/* ── Right: Day detail panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Selected date header */}
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="CalendarDaysIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                <h3 className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>
                  {calSelectedDate
                    ? new Date(calSelectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                    : 'Sélectionnez une date'}
                </h3>
              </div>
              {selectedDayAvailability && (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {selectedDayAvailability.slotCount} créneau{selectedDayAvailability.slotCount > 1 ? 'x' : ''} disponible{selectedDayAvailability.slotCount > 1 ? 's' : ''}
                  {selectedDayAvailability.hasVisio && ' · dont visio'}
                </p>
              )}
            </div>

            {/* Existing appointments for this day */}
            {selectedDayAppts.length > 0 && (
              <div className="card-base p-4">
                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>Mes RDV ce jour</h4>
                <div className="flex flex-col gap-2">
                  {selectedDayAppts.map(appt => (
                    <div key={appt.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: appt.type === 'teleconsultation' ? 'rgba(139,92,246,0.12)' : 'rgba(0,102,255,0.1)' }}>
                        <Icon
                          name={appt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'}
                          size={13}
                          style={{ color: appt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any}
                          className=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{appt.proName}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{appt.time} · {appt.type === 'teleconsultation' ? 'Visio' : 'Présentiel'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available slots for booking */}
            {calBookingSuccess ? (
              <div className="card-base p-5 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                  <Icon name="CheckCircleIcon" size={28} style={{ color: '#10b981' } as any} className="" />
                </div>
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Rendez-vous confirmé !</p>
                <p className="text-xs font-mono font-bold mb-3" style={{ color: '#10b981' }}>{calBookingSuccess}</p>
                <button
                  onClick={() => { setCalBookingSuccess(''); setCalBookingSlot(null); setCalBookingReason(''); }}
                  className="text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                >
                  Réserver un autre créneau
                </button>
              </div>
            ) : calBookingSlot ? (
              /* Booking confirmation mini-panel */
              <div className="card-base p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Confirmer le RDV</h4>
                  <button onClick={() => { setCalBookingSlot(null); setCalBookingReason(''); }} className="p-1 rounded-lg hover:bg-muted">
                    <Icon name="XMarkIcon" size={15} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                    >
                      {calBookingSlot.proAvatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{calBookingSlot.proName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{calBookingSlot.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon name="ClockIcon" size={12} className="text-muted-foreground" />
                      <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{calBookingSlot.time}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· 15 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon
                        name={calBookingSlot.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'}
                        size={12}
                        style={{ color: calBookingSlot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any}
                        className=""
                      />
                      <span className="text-xs" style={{ color: calBookingSlot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' }}>
                        {calBookingSlot.type === 'teleconsultation' ? 'Visio' : 'Présentiel'}
                      </span>
                    </div>
                  </div>
                </div>

                <textarea
                  className="input-field w-full resize-none text-xs mb-3"
                  rows={2}
                  placeholder="Motif (optionnel)..."
                  value={calBookingReason}
                  onChange={e => setCalBookingReason(e.target.value)}
                />

                <button
                  onClick={handleCalendarBooking}
                  disabled={calBookingLoading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--shifa-blue)' }}
                >
                  {calBookingLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon name="CheckIcon" size={15} />
                      Confirmer en 1 clic
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Slots list */
              <div className="card-base p-4 flex-1">
                {/* Filter bar */}
                {selectedDayAvailability?.hasSlots && (
                  <div className="flex gap-1 p-1 rounded-lg mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                    {[
                      { key: 'all', label: 'Tous' },
                      { key: 'in_person', label: 'Présentiel' },
                      { key: 'teleconsultation', label: 'Visio' },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => setCalFilterVisio(f.key as any)}
                        className="flex-1 py-1 rounded-md text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: calFilterVisio === f.key ? 'var(--card)' : 'transparent',
                          color: calFilterVisio === f.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Créneaux disponibles
                </h4>

                {!calSelectedDate ? (
                  <div className="text-center py-8">
                    <Icon name="CalendarIcon" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur une date pour voir les créneaux</p>
                  </div>
                ) : !selectedDayAvailability?.hasSlots ? (
                  <div className="text-center py-8">
                    <Icon name="CalendarDaysIcon" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Aucun créneau disponible</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Choisissez une autre date</p>
                  </div>
                ) : filteredCalSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="VideoCameraSlashIcon" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun créneau {calFilterVisio === 'teleconsultation' ? 'visio' : 'présentiel'} ce jour</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
                    {filteredCalSlots.slice(0, 20).map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => { setCalBookingSlot(slot); setCalBookingSuccess(''); }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all hover:shadow-sm group"
                        style={{
                          backgroundColor: 'var(--card)',
                          borderColor: slot.type === 'teleconsultation' ? 'rgba(139,92,246,0.25)' : 'var(--border)',
                        }}
                      >
                        {/* Time */}
                        <div
                          className="w-12 text-center py-1 rounded-lg shrink-0"
                          style={{
                            backgroundColor: slot.type === 'teleconsultation' ? 'rgba(139,92,246,0.1)' : 'rgba(0,102,255,0.08)',
                          }}
                        >
                          <span className="text-xs font-bold" style={{ color: slot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' }}>
                            {slot.time}
                          </span>
                        </div>

                        {/* Pro info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{slot.proName}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Icon
                              name={slot.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'}
                              size={10}
                              style={{ color: slot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--muted-foreground)' } as any}
                              className=""
                            />
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              {slot.type === 'teleconsultation' ? 'Visio' : 'Présentiel'} · 15 min
                            </span>
                          </div>
                        </div>

                        {/* Book arrow */}
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: 'var(--shifa-blue)' }}
                        >
                          <Icon name="ArrowRightIcon" size={11} style={{ color: 'white' } as any} className="" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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

          {/* ── Doctolib-style Reschedule / Cancel Modal ── */}
          {managingAppt && manageAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
              <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: 'var(--card)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: manageAction === 'cancel' ? 'rgba(239,68,68,0.1)' : 'rgba(0,102,255,0.08)' }}>
                      <Icon name={manageAction === 'cancel' ? 'XCircleIcon' : 'ArrowPathIcon'} size={16} style={{ color: manageAction === 'cancel' ? '#ef4444' : 'var(--shifa-blue)' } as any} className="" />
                    </div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
                      {manageAction === 'cancel' ? 'Annuler le rendez-vous' : 'Déplacer le rendez-vous'}
                    </h3>
                  </div>
                  <button onClick={() => { setManagingAppt(null); setManageAction(null); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-4">
                  {manageSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                        <Icon name="CheckCircleIcon" size={32} style={{ color: '#10b981' } as any} className="" />
                      </div>
                      <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{manageSuccess}</p>
                    </div>
                  ) : (
                    <>
                      {/* Current appointment summary */}
                      <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: managingAppt.type === 'teleconsultation' ? 'rgba(139,92,246,0.12)' : 'rgba(0,102,255,0.1)' }}>
                          <Icon name={managingAppt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={16} style={{ color: managingAppt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any} className="" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{managingAppt.proName}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {new Date(managingAppt.date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {managingAppt.time}
                          </p>
                        </div>
                      </div>

                      {/* 48h warning */}
                      <div className="flex items-start gap-2 p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                        <Icon name="ExclamationTriangleIcon" size={15} style={{ color: '#f59e0b', flexShrink: 0 } as any} className="mt-0.5" />
                        <p className="text-xs" style={{ color: '#92400e' }}>
                          <strong>Règle des 48h :</strong> Toute modification doit être effectuée au moins 48h avant le rendez-vous.
                        </p>
                      </div>

                      {/* ── MODIFY: Doctolib-style calendar ── */}
                      {manageAction === 'modify' && (
                        <div className="mb-4">
                          {/* Step indicator */}
                          <div className="flex items-center gap-2 mb-4">
                            {(['calendar', 'slots', 'confirm'] as RescheduleStep[]).map((s, i) => {
                              const steps: RescheduleStep[] = ['calendar', 'slots', 'confirm'];
                              const currentIdx = steps.indexOf(rescheduleStep);
                              const stepIdx = steps.indexOf(s);
                              const isDone = stepIdx < currentIdx;
                              const isCurrent = s === rescheduleStep;
                              const labels = ['Choisir une date', 'Choisir un créneau', 'Confirmer'];
                              return (
                                <React.Fragment key={s}>
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                      style={{
                                        backgroundColor: isDone ? '#10b981' : isCurrent ? 'var(--shifa-blue)' : 'var(--muted)',
                                        color: isDone || isCurrent ? 'white' : 'var(--muted-foreground)',
                                      }}
                                    >
                                      {isDone ? <Icon name="CheckIcon" size={10} /> : i + 1}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:block" style={{ color: isCurrent ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
                                      {labels[i]}
                                    </span>
                                  </div>
                                  {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: isDone ? '#10b981' : 'var(--border)' }} />}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* STEP 1: Mini calendar */}
                          {rescheduleStep === 'calendar' && (
                            <div>
                              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
                                Sélectionnez une nouvelle date pour <strong style={{ color: 'var(--foreground)' }}>{managingAppt.proName}</strong>
                              </p>

                              {/* Month nav */}
                              <div className="flex items-center justify-between mb-3">
                                <button
                                  onClick={() => handleRescheduleMonthChange('prev')}
                                  disabled={rescheduleCalYear === now.getFullYear() && rescheduleCalMonth === now.getMonth()}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
                                >
                                  <Icon name="ChevronLeftIcon" size={15} className="text-muted-foreground" />
                                </button>
                                <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                                  {MONTH_NAMES_FR[rescheduleCalMonth]} {rescheduleCalYear}
                                </span>
                                <button
                                  onClick={() => handleRescheduleMonthChange('next')}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <Icon name="ChevronRightIcon" size={15} className="text-muted-foreground" />
                                </button>
                              </div>

                              {/* Day headers */}
                              <div className="grid grid-cols-7 mb-1">
                                {DAY_NAMES_FR.map(d => (
                                  <div key={d} className="text-center text-xs font-semibold py-0.5" style={{ color: 'var(--muted-foreground)' }}>{d}</div>
                                ))}
                              </div>

                              {/* Calendar grid */}
                              {rescheduleLoadingSlots ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                  <span className="ml-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>Chargement des disponibilités...</span>
                                </div>
                              ) : (
                                <div className="grid grid-cols-7 gap-0.5">
                                  {Array.from({ length: rescheduleFirstDay }).map((_, i) => (
                                    <div key={`re-empty-${i}`} />
                                  ))}
                                  {Array.from({ length: rescheduleDaysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dayStr = rescheduleDayStr(day);
                                    const isPast = dayStr <= todayStr;
                                    const isCurrent = dayStr === managingAppt.date;
                                    const isSelected = dayStr === rescheduleSelectedDate;
                                    const hasSlots = !isPast && !isCurrent && (rescheduleAvailability[dayStr]?.length || 0) > 0;
                                    const slotCount = rescheduleAvailability[dayStr]?.length || 0;
                                    const hasVisioSlots = (rescheduleAvailability[dayStr] || []).some(s => s.type === 'teleconsultation');

                                    return (
                                      <button
                                        key={day}
                                        onClick={() => {
                                          if (hasSlots) {
                                            setRescheduleSelectedDate(dayStr);
                                            setRescheduleSelectedSlot(null);
                                            setRescheduleStep('slots');
                                          }
                                        }}
                                        disabled={!hasSlots}
                                        title={hasSlots ? `${slotCount} créneau${slotCount > 1 ? 'x' : ''} disponible${slotCount > 1 ? 's' : ''}` : isCurrent ? 'RDV actuel' : ''}
                                        className="relative flex flex-col items-center justify-center rounded-lg text-xs transition-all"
                                        style={{
                                          minHeight: '40px',
                                          backgroundColor: isSelected
                                            ? 'var(--shifa-blue)'
                                            : isCurrent
                                            ? 'rgba(245,158,11,0.12)'
                                            : hasSlots
                                            ? 'rgba(16,185,129,0.06)'
                                            : 'transparent',
                                          color: isSelected ? 'white' : isPast || (!hasSlots && !isCurrent) ? 'var(--muted-foreground)' : 'var(--foreground)',
                                          border: isSelected
                                            ? '2px solid var(--shifa-blue)'
                                            : isCurrent
                                            ? '1.5px solid rgba(245,158,11,0.5)'
                                            : hasSlots
                                            ? '1px solid rgba(16,185,129,0.35)'
                                            : '1px solid transparent',
                                          opacity: isPast || (!hasSlots && !isCurrent) ? 0.35 : 1,
                                          cursor: hasSlots ? 'pointer' : 'not-allowed',
                                        }}
                                      >
                                        <span className="font-semibold leading-none">{day}</span>
                                        {/* Availability dots */}
                                        {hasSlots && !isSelected && (
                                          <div className="flex gap-0.5 mt-0.5">
                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#10b981' }} />
                                            {hasVisioSlots && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />}
                                          </div>
                                        )}
                                        {isCurrent && (
                                          <div className="w-1 h-1 rounded-full mt-0.5" style={{ backgroundColor: '#f59e0b' }} />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Legend */}
                              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponible</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Visio dispo</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>RDV actuel</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* STEP 2: Time slot picker */}
                          {rescheduleStep === 'slots' && rescheduleSelectedDate && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <button
                                  onClick={() => { setRescheduleStep('calendar'); setRescheduleSelectedSlot(null); }}
                                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <Icon name="ArrowLeftIcon" size={14} className="text-muted-foreground" />
                                </button>
                                <div>
                                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                                    {new Date(rescheduleSelectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                  </p>
                                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                    {(rescheduleAvailability[rescheduleSelectedDate] || []).length} créneau{(rescheduleAvailability[rescheduleSelectedDate] || []).length > 1 ? 'x' : ''} disponible{(rescheduleAvailability[rescheduleSelectedDate] || []).length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>

                              {/* Type filter */}
                              <div className="flex gap-1 p-1 rounded-lg mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                                {[
                                  { key: 'all', label: 'Tous' },
                                  { key: 'in_person', label: 'Présentiel' },
                                  { key: 'teleconsultation', label: 'Visio' },
                                ].map(f => (
                                  <button
                                    key={f.key}
                                    onClick={() => setRescheduleTypeFilter(f.key as any)}
                                    className="flex-1 py-1 rounded-md text-xs font-semibold transition-all"
                                    style={{
                                      backgroundColor: rescheduleTypeFilter === f.key ? 'var(--card)' : 'transparent',
                                      color: rescheduleTypeFilter === f.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                                    }}
                                  >
                                    {f.label}
                                  </button>
                                ))}
                              </div>

                              {selectedRescheduleSlots.length === 0 ? (
                                <div className="text-center py-6">
                                  <Icon name="CalendarDaysIcon" size={28} className="text-muted-foreground mx-auto mb-2" />
                                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun créneau {rescheduleTypeFilter !== 'all' ? (rescheduleTypeFilter === 'teleconsultation' ? 'visio' : 'présentiel') : ''} ce jour</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                                  {selectedRescheduleSlots.map(slot => (
                                    <button
                                      key={slot.id}
                                      onClick={() => {
                                        setRescheduleSelectedSlot(slot);
                                        setRescheduleStep('confirm');
                                      }}
                                      className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm"
                                      style={{
                                        backgroundColor: slot.type === 'teleconsultation' ? 'rgba(139,92,246,0.05)' : 'rgba(0,102,255,0.04)',
                                        borderColor: slot.type === 'teleconsultation' ? 'rgba(139,92,246,0.3)' : 'rgba(0,102,255,0.2)',
                                        color: slot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)',
                                      }}
                                    >
                                      <span className="font-bold">{slot.time}</span>
                                      <span className="text-xs mt-0.5 opacity-70">
                                        {slot.type === 'teleconsultation' ? '📹' : '🏥'}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* STEP 3: Confirm new slot */}
                          {rescheduleStep === 'confirm' && rescheduleSelectedSlot && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <button
                                  onClick={() => { setRescheduleStep('slots'); setRescheduleSelectedSlot(null); }}
                                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                                >
                                  <Icon name="ArrowLeftIcon" size={14} className="text-muted-foreground" />
                                </button>
                                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Récapitulatif du déplacement</p>
                              </div>

                              {/* Before → After */}
                              <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <p className="text-xs font-semibold" style={{ color: '#ef4444' }}>Avant</p>
                                    <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--foreground)' }}>
                                      {new Date(managingAppt.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{managingAppt.time}</p>
                                  </div>
                                  <Icon name="ArrowRightIcon" size={16} className="text-muted-foreground shrink-0" />
                                  <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
                                    <p className="text-xs font-semibold" style={{ color: '#10b981' }}>Après</p>
                                    <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--foreground)' }}>
                                      {new Date(rescheduleSelectedDate + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{rescheduleSelectedSlot.time}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                  <Icon
                                    name={rescheduleSelectedSlot.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'}
                                    size={12}
                                    style={{ color: rescheduleSelectedSlot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any}
                                    className=""
                                  />
                                  <span className="text-xs" style={{ color: rescheduleSelectedSlot.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' }}>
                                    {rescheduleSelectedSlot.type === 'teleconsultation' ? 'Téléconsultation (Visio)' : 'Consultation en présentiel'} · 15 min
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reason field (always visible for both cancel and modify) */}
                      {(manageAction === 'cancel' || rescheduleStep === 'confirm') && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                            Motif <span style={{ color: '#ef4444' }}>*</span>
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
                            <p className="mt-1 text-xs font-medium" style={{ color: '#ef4444' }}>{manageReasonError}</p>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      {(manageAction === 'cancel' || rescheduleStep === 'confirm') && (
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
                            {manageAction === 'cancel' ? "Confirmer l'annulation" : 'Confirmer le déplacement'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: appt.type === 'teleconsultation' ? 'rgba(139,92,246,0.1)' : 'rgba(0,102,255,0.08)' }}>
                      <Icon name={appt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={18} style={{ color: appt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any} className="" />
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
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: appt.type === 'teleconsultation' ? 'rgba(139,92,246,0.08)' : 'var(--muted)', color: appt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--muted-foreground)' }}>
                          {appt.type === 'teleconsultation' ? '📹 Visio' : 'Présentiel'}
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
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                              📹 Visio
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
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                      📹 Visio disponible
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type de consultation</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'in_person', label: 'En présentiel', icon: 'BuildingOffice2Icon' },
                    { key: 'teleconsultation', label: 'Visio (15 min)', icon: 'VideoCameraIcon', disabled: !selectedPro.teleconsultation },
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
                    <Icon name="ClockIcon" size={16} className="text-muted-foreground" />
                    <span style={{ color: 'var(--foreground)' }}>Durée : 15 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name={consultationType === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={16} className="text-muted-foreground" />
                    <span style={{ color: 'var(--foreground)' }}>{consultationType === 'teleconsultation' ? 'Visio (téléconsultation)' : 'En présentiel'}</span>
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
                    Confirmer le rendez-vous (15 min)
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 5: SUCCESS ── */}
          {step === 'success' && confirmedAppt && (
            <div className="max-w-lg mx-auto">
              {/* Success header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
                  <Icon name="CheckCircleIcon" size={36} style={{ color: '#10b981' } as any} className="" />
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Rendez-vous confirmé !</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <span className="text-sm font-mono font-bold" style={{ color: '#10b981' }}>{confirmedAppt.ref}</span>
                </div>
              </div>

              {/* Appointment details card */}
              <div className="rounded-2xl border p-5 mb-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                  <Icon name="CalendarDaysIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  Détails du rendez-vous
                </h3>

                {/* Provider */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {confirmedAppt.proName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{confirmedAppt.proName}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{confirmedAppt.specialty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Date & time */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.04)', border: '1px solid rgba(0,102,255,0.1)' }}>
                    <Icon name="CalendarDaysIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0" />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{confirmedAppt.date} à {confirmedAppt.time}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Durée : 15 minutes</p>
                    </div>
                  </div>

                  {/* Type & location */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: confirmedAppt.type === 'teleconsultation' ? 'rgba(139,92,246,0.05)' : 'rgba(0,102,255,0.04)', border: `1px solid ${confirmedAppt.type === 'teleconsultation' ? 'rgba(139,92,246,0.15)' : 'rgba(0,102,255,0.1)'}` }}>
                    <Icon name={confirmedAppt.type === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOffice2Icon'} size={16} style={{ color: confirmedAppt.type === 'teleconsultation' ? '#8b5cf6' : 'var(--shifa-blue)' } as any} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
                        {confirmedAppt.type === 'teleconsultation' ? 'Téléconsultation (Visio)' : 'Consultation en présentiel'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{confirmedAppt.location}</p>
                    </div>
                  </div>

                  {/* Visio link */}
                  {confirmedAppt.visioLink && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <Icon name="LinkIcon" size={16} style={{ color: '#8b5cf6' } as any} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold mb-0.5" style={{ color: '#8b5cf6' }}>Lien de connexion visio</p>
                        <p className="text-xs font-mono truncate" style={{ color: 'var(--muted-foreground)' }}>{confirmedAppt.visioLink}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(confirmedAppt.visioLink || '')}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
                        title="Copier le lien"
                      >
                        <Icon name="ClipboardDocumentIcon" size={13} style={{ color: '#8b5cf6' } as any} className="" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes section */}
              <div className="rounded-2xl border p-5 mb-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                  <Icon name="PencilSquareIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  Notes personnelles
                </h3>
                <textarea
                  className="input-field w-full resize-none text-sm mb-3"
                  rows={3}
                  placeholder="Ajoutez des notes pour ce rendez-vous (symptômes, questions à poser, médicaments à mentionner...)..."
                  value={confirmNotes}
                  onChange={e => { setConfirmNotes(e.target.value); setNotesSaved(false); }}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes || notesSaved}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: notesSaved ? 'rgba(16,185,129,0.1)' : 'rgba(0,102,255,0.08)',
                    color: notesSaved ? '#10b981' : 'var(--shifa-blue)',
                    border: `1px solid ${notesSaved ? 'rgba(16,185,129,0.3)' : 'rgba(0,102,255,0.2)'}`,
                  }}
                >
                  {savingNotes ? (
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : notesSaved ? (
                    <Icon name="CheckIcon" size={14} />
                  ) : (
                    <Icon name="CloudArrowUpIcon" size={14} />
                  )}
                  {notesSaved ? 'Notes enregistrées' : 'Enregistrer les notes'}
                </button>
              </div>

              {/* Reschedule request */}
              <div className="rounded-2xl border p-5 mb-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setShowRescheduleRequest(v => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                    <Icon name="ArrowPathIcon" size={16} style={{ color: '#f59e0b' } as any} className="" />
                    Demander un report
                  </h3>
                  <Icon name={showRescheduleRequest ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} className="text-muted-foreground" />
                </button>

                {showRescheduleRequest && (
                  <div className="mt-4">
                    {rescheduleSuccess ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <Icon name="CheckCircleIcon" size={16} style={{ color: '#10b981' } as any} className="" />
                        <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Demande de report envoyée au prestataire.</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                          Expliquez pourquoi vous souhaitez reporter ce rendez-vous. Le prestataire sera notifié.
                        </p>
                        <textarea
                          className="input-field w-full resize-none text-sm mb-3"
                          rows={3}
                          placeholder="Motif du report (obligatoire)..."
                          value={rescheduleReason}
                          onChange={e => setRescheduleReason(e.target.value)}
                        />
                        <button
                          onClick={handleRescheduleRequest}
                          disabled={!rescheduleReason.trim()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                          style={{ backgroundColor: '#f59e0b', color: 'white' }}
                        >
                          <Icon name="PaperAirplaneIcon" size={14} />
                          Envoyer la demande
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={resetBooking} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Nouveau rendez-vous
                </button>
                <button onClick={() => setMainView('my-appointments')} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)' }}>
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
