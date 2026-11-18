'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  slotDate: string;
}

interface ProfessionalAvailabilityModalProps {
  professionalId: string;
  professionalName: string;
  specialty: string;
  currentDate: string;
  currentTime: string;
  onConfirm: (date: string, time: string, slotId?: string) => void;
  onClose: () => void;
}

const MONTH_NAMES_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ProfessionalAvailabilityModal({
  professionalId,
  professionalName,
  specialty,
  currentDate,
  currentTime,
  onConfirm,
  onClose,
}: ProfessionalAvailabilityModalProps) {
  const supabase = createClient();
  const now = new Date();

  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [noSlotsMessage, setNoSlotsMessage] = useState('');

  // Load availability slots for the professional
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setNoSlotsMessage('');
      try {
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 60);

        const { data, error } = await supabase
          .from('availability_slots')
          .select('id, slot_date, start_time, is_available')
          .eq('professional_id', professionalId)
          .eq('is_available', true)
          .gte('slot_date', today.toISOString().split('T')[0])
          .lte('slot_date', futureDate.toISOString().split('T')[0])
          .order('slot_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error || !data || data.length === 0) {
          // Fallback: generate mock slots for demo
          const mockSlots: Record<string, TimeSlot[]> = {};
          const times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00'];
          for (let i = 1; i <= 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dow = d.getDay();
            if (dow === 0 || dow === 6) continue; // skip weekends
            const dateStr = d.toISOString().split('T')[0];
            // Randomly skip some days
            if (Math.random() < 0.3) continue;
            mockSlots[dateStr] = times
              .filter(() => Math.random() > 0.4)
              .map((t, idx) => ({
                id: `mock-${dateStr}-${idx}`,
                time: t,
                available: true,
                slotDate: dateStr,
              }));
            if (mockSlots[dateStr].length === 0) delete mockSlots[dateStr];
          }
          setSlots(mockSlots);
          if (Object.keys(mockSlots).length === 0) {
            setNoSlotsMessage('Aucun créneau disponible dans les 30 prochains jours.');
          }
          return;
        }

        const grouped: Record<string, TimeSlot[]> = {};
        data.forEach((slot) => {
          const dateKey = slot.slot_date;
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push({
            id: slot.id,
            time: slot.start_time?.slice(0, 5) || '',
            available: slot.is_available,
            slotDate: slot.slot_date,
          });
        });
        setSlots(grouped);
      } catch {
        setSlots({});
        setNoSlotsMessage('Impossible de charger les disponibilités.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [professionalId]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const calendarDayStr = (day: number) => {
    const m = String(calMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${calYear}-${m}-${d}`;
  };

  const todayStr = now.toISOString().split('T')[0];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleDayClick = (dayStr: string) => {
    if (!slots[dayStr]) return; // no slots on this day
    if (dayStr < todayStr) return; // past day
    setSelectedDate(dayStr);
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    onConfirm(selectedDate, selectedSlot.time, selectedSlot.id);
  };

  const slotsForSelectedDate = selectedDate ? (slots[selectedDate] || []) : [];

  const formatDateFr = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--card)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', flexShrink: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
              <Icon name="CalendarDaysIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} className="" />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Disponibilités de {professionalName}</h3>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{specialty} · Choisissez un nouveau créneau</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Current appointment info */}
        <div className="mx-6 mt-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', flexShrink: 0 }}>
          <Icon name="ClockIcon" size={16} style={{ color: '#f59e0b', flexShrink: 0 } as any} className="" />
          <p className="text-xs" style={{ color: '#92400e' }}>
            <strong>RDV actuel :</strong> {currentDate} à {currentTime} — Sélectionnez un nouveau créneau disponible ci-dessous
          </p>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {loadingSlots ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des disponibilités...</span>
            </div>
          ) : noSlotsMessage ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon name="CalendarDaysIcon" size={40} className="text-muted-foreground mb-3" />
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{noSlotsMessage}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Contactez le professionnel directement.</p>
            </div>
          ) : (
            <>
              {/* Calendar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    disabled={calYear === now.getFullYear() && calMonth === now.getMonth()}
                  >
                    <Icon name="ChevronLeftIcon" size={16} className="text-muted-foreground" />
                  </button>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--shifa-dark)' }}>
                    {MONTH_NAMES_FR[calMonth]} {calYear}
                  </h4>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
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
                    const hasSlots = !!slots[dayStr] && slots[dayStr].length > 0;
                    const isPast = dayStr < todayStr;
                    const isSelected = dayStr === selectedDate;
                    const isToday = dayStr === todayStr;
                    const slotCount = slots[dayStr]?.length || 0;

                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(dayStr)}
                        disabled={!hasSlots || isPast}
                        className="relative flex flex-col items-center justify-center rounded-xl text-xs transition-all py-2"
                        style={{
                          backgroundColor: isSelected
                            ? 'var(--shifa-blue)'
                            : isToday && hasSlots
                            ? 'rgba(0,102,255,0.12)'
                            : hasSlots
                            ? 'rgba(16,185,129,0.08)'
                            : 'transparent',
                          color: isSelected
                            ? 'white'
                            : isPast
                            ? 'var(--muted-foreground)'
                            : hasSlots
                            ? 'var(--foreground)'
                            : 'var(--muted-foreground)',
                          border: isSelected
                            ? '2px solid var(--shifa-blue)'
                            : hasSlots && !isPast
                            ? '1px solid rgba(16,185,129,0.3)'
                            : '1px solid transparent',
                          cursor: hasSlots && !isPast ? 'pointer' : 'default',
                          opacity: isPast ? 0.4 : 1,
                          minHeight: '44px',
                        }}
                        title={hasSlots && !isPast ? `${slotCount} créneau${slotCount > 1 ? 'x' : ''} disponible${slotCount > 1 ? 's' : ''}` : ''}
                      >
                        <span className="font-semibold">{day}</span>
                        {hasSlots && !isPast && (
                          <span
                            className="text-xs mt-0.5 font-medium"
                            style={{ color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--shifa-green)', fontSize: '9px' }}
                          >
                            {slotCount} dispo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponible</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Sélectionné</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'transparent', border: '1px solid var(--border)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Indisponible</span>
                  </div>
                </div>
              </div>

              {/* Time slots for selected date */}
              {selectedDate && (
                <div className="mt-5">
                  <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>
                    Créneaux disponibles — <span style={{ color: 'var(--shifa-blue)' }}>{formatDateFr(selectedDate)}</span>
                  </h4>
                  {slotsForSelectedDate.length === 0 ? (
                    <p className="text-sm text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Aucun créneau disponible ce jour.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slotsForSelectedDate.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className="py-2.5 px-3 rounded-xl text-sm font-semibold transition-all border"
                          style={{
                            backgroundColor: selectedSlot?.id === slot.id ? 'var(--shifa-blue)' : 'var(--muted)',
                            color: selectedSlot?.id === slot.id ? 'white' : 'var(--foreground)',
                            borderColor: selectedSlot?.id === slot.id ? 'var(--shifa-blue)' : 'var(--border)',
                          }}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!selectedDate && (
                <div className="mt-5 flex items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <Icon name="HandPointerIcon" size={16} className="text-muted-foreground" />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Cliquez sur un jour <span style={{ color: 'var(--shifa-green)', fontWeight: 600 }}>disponible</span> pour voir les créneaux horaires.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)', flexShrink: 0 }}>
          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {selectedDate && selectedSlot ? (
              <span>
                ✅ <strong style={{ color: 'var(--foreground)' }}>{formatDateFr(selectedDate)}</strong> à <strong style={{ color: 'var(--shifa-blue)' }}>{selectedSlot.time}</strong>
              </span>
            ) : (
              <span>Sélectionnez une date et un créneau</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedSlot}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--shifa-blue)' }}
            >
              Confirmer ce créneau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
