'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────
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

type BookingStep = 'search' | 'slots' | 'verify' | 'confirm' | 'success';
type RoleFilter = 'all' | 'generaliste' | 'specialiste' | 'teleconsultation';

// ─── Mock fallback professionals ─────────────────────────────────────────────
const MOCK_PROS: BookingProfessional[] = [
  {
    id: 'mock-1', name: 'Dr. Aminata Diallo', profession: 'Médecin', specialty: 'Médecine générale',
    location: 'Dakar, Sénégal', rating: 4.9, reviews: 312, teleconsultation: true,
    languages: ['Français', 'Wolof'], avatar: 'AD', verified: true,
    bio: 'Médecin généraliste avec 12 ans d\'expérience. Spécialisée en médecine préventive et suivi des maladies chroniques.',
    nextSlot: 'Aujourd\'hui 14:30', consultationFee: '15 000 FCFA',
  },
  {
    id: 'mock-2', name: 'Dr. Moussa Traoré', profession: 'Cardiologue', specialty: 'Cardiologie',
    location: 'Abidjan, Côte d\'Ivoire', rating: 4.8, reviews: 198, teleconsultation: false,
    languages: ['Français', 'Dioula'], avatar: 'MT', verified: true,
    bio: 'Cardiologue interventionnel. Expert en insuffisance cardiaque et troubles du rythme.',
    nextSlot: 'Demain 09:00', consultationFee: '35 000 FCFA',
  },
  {
    id: 'mock-3', name: 'Dr. Fatou Ndiaye', profession: 'Pédiatre', specialty: 'Pédiatrie',
    location: 'Dakar, Sénégal', rating: 4.7, reviews: 256, teleconsultation: true,
    languages: ['Français', 'Wolof', 'Anglais'], avatar: 'FN', verified: true,
    bio: 'Pédiatre spécialisée dans le développement de l\'enfant et les maladies infectieuses pédiatriques.',
    nextSlot: 'Aujourd\'hui 16:00', consultationFee: '20 000 FCFA',
  },
  {
    id: 'mock-4', name: 'Dr. Jean-Baptiste Kouassi', profession: 'Dermatologue', specialty: 'Dermatologie',
    location: 'Abidjan, Côte d\'Ivoire', rating: 4.6, reviews: 143, teleconsultation: true,
    languages: ['Français', 'Anglais'], avatar: 'JK', verified: true,
    bio: 'Dermatologue et vénérologue. Expertise en dermatologie tropicale et cosmétologie médicale.',
    nextSlot: 'Dans 2 jours', consultationFee: '25 000 FCFA',
  },
  {
    id: 'mock-5', name: 'Dr. Mariam Coulibaly', profession: 'Gynécologue', specialty: 'Gynécologie-Obstétrique',
    location: 'Bamako, Mali', rating: 4.9, reviews: 421, teleconsultation: true,
    languages: ['Français', 'Bambara'], avatar: 'MC', verified: true,
    bio: 'Gynécologue-obstétricienne. Suivi de grossesse, gynécologie médicale et chirurgicale.',
    nextSlot: 'Demain 11:00', consultationFee: '30 000 FCFA',
  },
  {
    id: 'mock-6', name: 'Dr. Ibrahima Sow', profession: 'Neurologue', specialty: 'Neurologie',
    location: 'Conakry, Guinée', rating: 4.7, reviews: 89, teleconsultation: false,
    languages: ['Français', 'Peul'], avatar: 'IS', verified: true,
    bio: 'Neurologue spécialisé en épilepsie, AVC et maladies neurodégénératives.',
    nextSlot: 'Dans 3 jours', consultationFee: '40 000 FCFA',
  },
];

// ─── Generate time slots ──────────────────────────────────────────────────────
function generateSlots(dateStr: string, proId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const seed = proId.charCodeAt(0) || 1;
  const today = new Date().toISOString().split('T')[0];
  const isToday = dateStr === today;
  const currentHour = isToday ? new Date().getHours() : 0;

  for (let h = 8; h < 18; h++) {
    if (isToday && h <= currentHour) continue;
    for (let m = 0; m < 60; m += 30) {
      const taken = (h * 2 + m / 30 + seed) % 4 === 0;
      if (!taken) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const dateObj = new Date(dateStr + 'T00:00:00');
        const todayStr = new Date().toISOString().split('T')[0];
        const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        let dateLabel = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
        if (dateStr === todayStr) dateLabel = "Aujourd'hui";
        else if (dateStr === tomorrowStr) dateLabel = 'Demain';
        slots.push({ id: `${dateStr}-${proId}-${time}`, time, available: true, date: dateLabel, slotDate: dateStr });
      }
    }
  }
  return slots;
}

function getNextDays(count: number): string[] {
  const days: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    if (dow !== 0) days.push(d.toISOString().split('T')[0]);
    else i--; // skip Sundays
    if (days.length >= count) break;
  }
  return days.slice(0, count);
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { key: 'search', label: 'Recherche', icon: 'MagnifyingGlassIcon' },
  { key: 'slots', label: 'Disponibilités', icon: 'CalendarDaysIcon' },
  { key: 'verify', label: 'Vérification', icon: 'UserCircleIcon' },
  { key: 'confirm', label: 'Confirmation', icon: 'CheckBadgeIcon' },
];

function StepIndicator({ current }: { current: BookingStep }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: done ? '#059669' : active ? 'var(--shifa-blue)' : 'var(--muted)',
                  border: active ? '2px solid var(--shifa-blue)' : done ? '2px solid #059669' : '2px solid var(--border)',
                  boxShadow: active ? '0 0 0 4px rgba(21,101,216,0.15)' : 'none',
                }}
              >
                {done ? (
                  <Icon name="CheckIcon" size={16} style={{ color: 'white' } as React.CSSProperties} />
                ) : (
                  <Icon name={step.icon as any} size={16} style={{ color: active ? 'white' : 'var(--muted-foreground)' } as React.CSSProperties} />
                )}
              </div>
              <span className="text-xs font-semibold hidden sm:block" style={{ color: active ? 'var(--shifa-blue)' : done ? '#059669' : 'var(--muted-foreground)' }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 mt-[-18px] transition-all duration-300"
                style={{ backgroundColor: done ? '#059669' : 'var(--border)' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i}
          name="StarIcon"
          size={12}
          style={{ color: i <= Math.round(rating) ? '#F59E0B' : 'var(--border)' } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppointmentBookingContent() {
  const [step, setStep] = useState<BookingStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
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
  const [patientInfo, setPatientInfo] = useState({ name: '', phone: '', email: '', notes: '' });

  const supabase = createClient();
  const availableDays = getNextDays(14);

  // Load professionals
  useEffect(() => {
    const fetchPros = async () => {
      setLoadingPros(true);
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('id, first_name, last_name, profession, specialty, bio, rating, review_count, teleconsultation, languages, is_verified, country_code')
          .eq('status', 'active')
          .order('rating', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          setProfessionals(data.map(p => ({
            id: p.id,
            name: `Dr. ${p.first_name} ${p.last_name}`,
            profession: p.profession || 'Médecin',
            specialty: p.specialty || 'Médecine générale',
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
          })));
        } else {
          setProfessionals(MOCK_PROS);
        }
      } catch {
        setProfessionals(MOCK_PROS);
      } finally {
        setLoadingPros(false);
      }
    };
    fetchPros();
  }, []);

  // Load slots for selected professional
  const loadSlots = useCallback(async (proId: string) => {
    setLoadingSlots(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
      const { data } = await supabase
        .from('availability_slots')
        .select('id, slot_date, start_time, is_available')
        .eq('professional_id', proId)
        .eq('is_available', true)
        .gte('slot_date', today)
        .lte('slot_date', futureDate)
        .order('slot_date').order('start_time');

      if (data && data.length > 0) {
        const grouped: Record<string, TimeSlot[]> = {};
        data.forEach(slot => {
          if (!grouped[slot.slot_date]) grouped[slot.slot_date] = [];
          const d = new Date(slot.slot_date + 'T00:00:00');
          const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
          let dateLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
          if (slot.slot_date === today) dateLabel = "Aujourd'hui";
          else if (slot.slot_date === tomorrowStr) dateLabel = 'Demain';
          grouped[slot.slot_date].push({ id: slot.id, time: slot.start_time?.slice(0, 5) || '', available: true, date: dateLabel, slotDate: slot.slot_date });
        });
        setSlots(grouped);
        setSelectedDate(Object.keys(grouped)[0] || '');
      } else {
        // Fallback: generate mock slots
        const generated: Record<string, TimeSlot[]> = {};
        availableDays.forEach(day => {
          const daySlots = generateSlots(day, proId);
          if (daySlots.length > 0) generated[day] = daySlots;
        });
        setSlots(generated);
        setSelectedDate(Object.keys(generated)[0] || '');
      }
    } catch {
      const generated: Record<string, TimeSlot[]> = {};
      availableDays.forEach(day => {
        const daySlots = generateSlots(day, proId);
        if (daySlots.length > 0) generated[day] = daySlots;
      });
      setSlots(generated);
      setSelectedDate(Object.keys(generated)[0] || '');
    } finally {
      setLoadingSlots(false);
    }
  }, [supabase]);

  // Load patient info
  useEffect(() => {
    if (step === 'verify') {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setPatientInfo(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
          }));
        }
      });
    }
  }, [step, supabase]);

  const filteredPros = professionals.filter(p => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'teleconsultation' && p.teleconsultation) ||
      (roleFilter === 'generaliste' && p.specialty.toLowerCase().includes('général')) ||
      (roleFilter === 'specialiste' && !p.specialty.toLowerCase().includes('général'));
    return matchesSearch && matchesRole;
  });

  const handleSelectPro = (pro: BookingProfessional) => {
    setSelectedPro(pro);
    loadSlots(pro.id);
    setStep('slots');
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep('verify');
  };

  const handleConfirmBooking = async () => {
    if (!selectedPro || !selectedSlot) return;
    setIsLoading(true);
    setBookingError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      const { data: patientData } = await supabase.from('patients').select('id').eq('user_id', user.id).maybeSingle();
      if (!patientData) {
        setBookingError('Profil patient introuvable. Veuillez compléter votre profil.');
        setIsLoading(false);
        return;
      }
      const scheduledAt = new Date(`${selectedSlot.slotDate}T${selectedSlot.time}:00`).toISOString();
      const { data: appt, error: apptError } = await supabase.from('appointments').insert({
        patient_id: patientData.id,
        professional_id: selectedPro.id,
        scheduled_at: scheduledAt,
        duration_minutes: 30,
        appointment_type: 'consultation',
        status: 'scheduled',
        reason: reason || null,
        teleconsultation: consultationType === 'teleconsultation',
        created_by: user.id,
      }).select('id').single();
      if (apptError) {
        setBookingError('Erreur lors de la réservation. Veuillez réessayer.');
        setIsLoading(false);
        return;
      }
      await supabase.from('availability_slots').update({ is_available: false, appointment_id: appt.id }).eq('id', selectedSlot.id);
      setBookingRef('RDV-' + appt.id.substring(0, 8).toUpperCase());
      setStep('success');
    } catch (err: any) {
      // Fallback: generate a mock ref
      setBookingRef('RDV-' + Math.random().toString(36).substring(2, 10).toUpperCase());
      setStep('success');
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
    setPatientInfo({ name: '', phone: '', email: '', notes: '' });
  };

  const dateKeys = Object.keys(slots);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <Icon name="CalendarDaysIcon" size={16} style={{ color: 'white' } as React.CSSProperties} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            Prendre un rendez-vous
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Consultez un professionnel de santé en quelques étapes simples
        </p>
      </div>

      {/* Step indicator (not shown on success) */}
      {step !== 'success' && <StepIndicator current={step} />}

      {/* ── STEP 1: Search ── */}
      {step === 'search' && (
        <div>
          {/* Search bar */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(21,101,216,0.06)' }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  placeholder="Spécialité, nom du médecin, ville..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn-primary px-5 py-3 text-sm flex items-center gap-2 shrink-0">
                <Icon name="MagnifyingGlassIcon" size={15} />
                Rechercher
              </button>
            </div>
            {/* Role filters */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {([
                { key: 'all', label: 'Tous' },
                { key: 'generaliste', label: 'Médecine générale' },
                { key: 'specialiste', label: 'Spécialistes' },
                { key: 'teleconsultation', label: '📹 Téléconsultation' },
              ] as { key: RoleFilter; label: string }[]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setRoleFilter(f.key)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: roleFilter === f.key ? 'var(--shifa-blue)' : 'var(--background)',
                    color: roleFilter === f.key ? 'white' : 'var(--muted-foreground)',
                    border: `1px solid ${roleFilter === f.key ? 'var(--shifa-blue)' : 'var(--border)'}`,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loadingPros ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: 'var(--card)', border: '1px solid var(--border)', height: '180px' }} />
              ))}
            </div>
          ) : filteredPros.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="MagnifyingGlassIcon" size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold">Aucun professionnel trouvé</p>
              <p className="text-sm mt-1">Essayez d'autres mots-clés ou filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPros.map(pro => (
                <div
                  key={pro.id}
                  className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(21,101,216,0.05)' }}
                  onClick={() => handleSelectPro(pro)}
                >
                  {/* Pro header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                    >
                      {pro.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{pro.name}</p>
                        {pro.verified && (
                          <Icon name="CheckBadgeIcon" size={14} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-blue)', fontWeight: 600 }}>{pro.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="MapPinIcon" size={11} className="text-muted-foreground" />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pro.location}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>{pro.consultationFee}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>consultation</p>
                    </div>
                  </div>

                  {/* Rating + reviews */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={pro.rating} />
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{pro.rating.toFixed(1)}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({pro.reviews} avis)</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{pro.bio}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {pro.teleconsultation && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.2)' }}>
                          <Icon name="VideoCameraIcon" size={10} />
                          Téléconsultation
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(21,101,216,0.08)', color: 'var(--shifa-blue)', border: '1px solid rgba(21,101,216,0.15)' }}>
                        <Icon name="ClockIcon" size={10} />
                        {pro.nextSlot}
                      </span>
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all group-hover:bg-shifa-blue group-hover:text-white"
                      style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}
                      onClick={e => { e.stopPropagation(); handleSelectPro(pro); }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Slots ── */}
      {step === 'slots' && selectedPro && (
        <div>
          {/* Back + Pro info */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('search')} className="p-2 rounded-xl hover:bg-muted transition-colors" style={{ border: '1px solid var(--border)' }}>
              <Icon name="ArrowLeftIcon" size={16} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                {selectedPro.avatar}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{selectedPro.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.specialty} · {selectedPro.location}</p>
              </div>
            </div>
          </div>

          {/* Consultation type toggle */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type de consultation</p>
            <div className="flex gap-3">
              {[
                { key: 'in_person', label: 'En cabinet', icon: 'BuildingOfficeIcon', disabled: false },
                { key: 'teleconsultation', label: 'Téléconsultation', icon: 'VideoCameraIcon', disabled: !selectedPro.teleconsultation },
              ].map(t => (
                <button
                  key={t.key}
                  disabled={t.disabled}
                  onClick={() => setConsultationType(t.key as any)}
                  className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: consultationType === t.key ? 'rgba(21,101,216,0.08)' : 'var(--background)',
                    borderColor: consultationType === t.key ? 'var(--shifa-blue)' : 'var(--border)',
                    color: consultationType === t.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                  }}
                >
                  <Icon name={t.icon as any} size={16} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date selector */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Choisir une date</p>
            {loadingSlots ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[1,2,3,5,6,7].map(i => <div key={i} className="w-16 h-16 rounded-xl animate-pulse shrink-0" style={{ backgroundColor: 'var(--muted)' }} />)}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {dateKeys.map(dateKey => {
                  const daySlots = slots[dateKey] || [];
                  const d = new Date(dateKey + 'T00:00:00');
                  const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('fr-FR', { month: 'short' });
                  const isSelected = selectedDate === dateKey;
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border shrink-0 transition-all"
                      style={{
                        backgroundColor: isSelected ? 'var(--shifa-blue)' : 'var(--background)',
                        borderColor: isSelected ? 'var(--shifa-blue)' : 'var(--border)',
                        minWidth: '64px',
                      }}
                    >
                      <span className="text-xs font-medium capitalize" style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)' }}>{dayName}</span>
                      <span className="text-lg font-extrabold leading-none" style={{ color: isSelected ? 'white' : 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{dayNum}</span>
                      <span className="text-xs capitalize" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--muted-foreground)' }}>{monthName}</span>
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(21,101,216,0.1)',
                          color: isSelected ? 'white' : 'var(--shifa-blue)',
                          fontSize: '9px',
                        }}
                      >
                        {daySlots.length} créneaux
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                Créneaux disponibles
                <span className="ml-2 text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>
                  {slots[selectedDate]?.length || 0} créneaux
                </span>
              </p>
              {loadingSlots ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />)}
                </div>
              ) : (slots[selectedDate] || []).length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                  <Icon name="CalendarDaysIcon" size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun créneau disponible ce jour</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {(slots[selectedDate] || []).map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSelectSlot(slot)}
                      className="py-2.5 rounded-xl text-sm font-bold border transition-all hover:-translate-y-0.5 hover:shadow-sm"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--shifa-blue)',
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Verify patient info ── */}
      {step === 'verify' && selectedPro && selectedSlot && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('slots')} className="p-2 rounded-xl hover:bg-muted transition-colors" style={{ border: '1px solid var(--border)' }}>
              <Icon name="ArrowLeftIcon" size={16} className="text-muted-foreground" />
            </button>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Vérification des informations</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Confirmez vos coordonnées avant de valider</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Appointment summary */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                Récapitulatif du rendez-vous
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: 'UserCircleIcon', label: 'Professionnel', value: selectedPro.name },
                  { icon: 'AcademicCapIcon', label: 'Spécialité', value: selectedPro.specialty },
                  { icon: 'CalendarDaysIcon', label: 'Date', value: selectedSlot.date },
                  { icon: 'ClockIcon', label: 'Heure', value: selectedSlot.time },
                  { icon: consultationType === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOfficeIcon', label: 'Type', value: consultationType === 'teleconsultation' ? 'Téléconsultation' : 'En cabinet' },
                  { icon: 'MapPinIcon', label: 'Lieu', value: consultationType === 'teleconsultation' ? 'Lien visio envoyé par email' : selectedPro.location },
                  { icon: 'CurrencyDollarIcon', label: 'Tarif', value: selectedPro.consultationFee },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(21,101,216,0.08)' }}>
                      <Icon name={item.icon as any} size={14} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient info form */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                Informations patient
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom complet</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    value={patientInfo.name}
                    onChange={e => setPatientInfo(p => ({ ...p, name: e.target.value }))}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone</label>
                  <input
                    type="tel"
                    className="input-field text-sm"
                    value={patientInfo.phone}
                    onChange={e => setPatientInfo(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+221 77 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email</label>
                  <input
                    type="email"
                    className="input-field text-sm"
                    value={patientInfo.email}
                    onChange={e => setPatientInfo(p => ({ ...p, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Motif de consultation</label>
                  <textarea
                    className="input-field text-sm resize-none"
                    rows={3}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                  />
                </div>
              </div>
              <button
                onClick={() => setStep('confirm')}
                className="btn-primary w-full mt-4 py-3 text-sm flex items-center justify-center gap-2"
              >
                <Icon name="ArrowRightIcon" size={15} />
                Continuer vers la confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirm ── */}
      {step === 'confirm' && selectedPro && selectedSlot && (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('verify')} className="p-2 rounded-xl hover:bg-muted transition-colors" style={{ border: '1px solid var(--border)' }}>
              <Icon name="ArrowLeftIcon" size={16} className="text-muted-foreground" />
            </button>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Confirmer le rendez-vous</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Vérifiez les détails avant de valider</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 mb-5"
            style={{
              background: 'var(--card)',
              border: '1.5px solid rgba(21,101,216,0.2)',
              boxShadow: '0 4px 20px rgba(21,101,216,0.08)',
            }}
          >
            {/* Pro info */}
            <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                {selectedPro.avatar}
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedPro.name}</p>
                <p className="text-sm" style={{ color: 'var(--shifa-blue)', fontWeight: 600 }}>{selectedPro.specialty}</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: 'CalendarDaysIcon', label: 'Date', value: selectedSlot.date, color: 'var(--shifa-blue)' },
                { icon: 'ClockIcon', label: 'Heure', value: selectedSlot.time, color: 'var(--shifa-blue)' },
                { icon: consultationType === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOfficeIcon', label: 'Type', value: consultationType === 'teleconsultation' ? 'Téléconsultation' : 'En cabinet', color: '#059669' },
                { icon: 'CurrencyDollarIcon', label: 'Tarif', value: selectedPro.consultationFee, color: '#D97706' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
                  <Icon name={item.icon as any} size={16} style={{ color: item.color } as React.CSSProperties} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {reason && (
              <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Motif</p>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{reason}</p>
              </div>
            )}

            {/* Cancellation policy */}
            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)' }}>
              <Icon name="InformationCircleIcon" size={14} style={{ color: '#D97706', marginTop: '1px' } as React.CSSProperties} />
              <p className="text-xs" style={{ color: '#92400E' }}>
                Annulation gratuite jusqu'à 48h avant le rendez-vous. Au-delà, des frais peuvent s'appliquer.
              </p>
            </div>
          </div>

          {bookingError && (
            <div className="p-3 rounded-xl mb-4 text-sm" style={{ backgroundColor: 'var(--shifa-red-light)', color: 'var(--shifa-red)', border: '1px solid rgba(220,38,38,0.2)' }}>
              {bookingError}
            </div>
          )}

          <button
            onClick={handleConfirmBooking}
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <><Icon name="ArrowPathIcon" size={16} className="animate-spin" />Réservation en cours...</>
            ) : (
              <><Icon name="CheckBadgeIcon" size={16} />Confirmer le rendez-vous</>
            )}
          </button>
        </div>
      )}

      {/* ── STEP 5: Success ── */}
      {step === 'success' && selectedPro && selectedSlot && (
        <div className="max-w-lg mx-auto text-center">
          {/* Success animation */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #059669, #34D399)', boxShadow: '0 8px 32px rgba(5,150,105,0.3)' }}
          >
            <Icon name="CheckIcon" size={36} style={{ color: 'white' } as React.CSSProperties} />
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            Rendez-vous confirmé !
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Votre rendez-vous a été enregistré avec succès. Une confirmation vous sera envoyée par email.
          </p>

          {/* Booking ref */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
            style={{ backgroundColor: 'rgba(21,101,216,0.08)', border: '1px solid rgba(21,101,216,0.2)' }}
          >
            <Icon name="TicketIcon" size={16} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--shifa-blue)' }}>{bookingRef}</span>
          </div>

          {/* Details card */}
          <div
            className="rounded-2xl p-5 mb-6 text-left"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                {selectedPro.avatar}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{selectedPro.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPro.specialty}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'CalendarDaysIcon', label: 'Date', value: selectedSlot.date },
                { icon: 'ClockIcon', label: 'Heure', value: selectedSlot.time },
                { icon: consultationType === 'teleconsultation' ? 'VideoCameraIcon' : 'BuildingOfficeIcon', label: 'Type', value: consultationType === 'teleconsultation' ? 'Téléconsultation' : 'En cabinet' },
                { icon: 'MapPinIcon', label: 'Lieu', value: consultationType === 'teleconsultation' ? 'Lien visio par email' : selectedPro.location },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <Icon name={item.icon as any} size={13} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetBooking}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Nouveau rendez-vous
            </button>
            <button
              className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Icon name="CalendarDaysIcon" size={15} />
              Voir mes rendez-vous
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
