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

type BookingStep = 'search' | 'profile' | 'slots' | 'confirm' | 'success';

// ============================================================
// Main Component
// ============================================================
export default function AppointmentBookingContent() {
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
          console.log('Professionals fetch error:', error.message);
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
        console.log('Slots fetch error:', error.message);
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

      // Get patient record for this user
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

      // Build scheduled_at from slot date + time
      const scheduledAt = new Date(`${selectedSlot.slotDate}T${selectedSlot.time}:00`).toISOString();

      // Insert appointment
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
        console.log('Appointment insert error:', apptError.message);
        setBookingError('Erreur lors de la réservation. Veuillez réessayer.');
        setIsLoading(false);
        return;
      }

      // Mark slot as unavailable
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
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

        {/* Progress steps */}
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

          {/* Consultation type */}
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

          <button
            onClick={() => setStep('slots')}
            className="btn-primary w-full py-3"
          >
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
              {/* Date selector */}
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

              {/* Time slots */}
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
          </div>
        </div>
      )}
    </div>
  );
}
