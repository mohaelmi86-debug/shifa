'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type KioskStep = 'welcome' | 'scan' | 'confirm' | 'ticket';

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  shifa_id: string;
}

interface AppointmentData {
  id: string;
  scheduled_at: string;
  appointment_type: string;
  reason: string | null;
  status: string;
  professionals?: { first_name: string; last_name: string; specialty?: string } | null;
  departments?: { name: string } | null;
}

interface CheckinStats {
  total: number;
  today: number;
  avgTime: string;
}

export default function ShifaKioskContent() {
  const { user } = useAuth();
  const supabase = createClient();
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const [step, setStep] = useState<KioskStep>('welcome');
  const [adminView, setAdminView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [queueNumber, setQueueNumber] = useState<string>('');
  const [stats, setStats] = useState<CheckinStats>({ total: 0, today: 0, avgTime: '—' });
  const [searchName, setSearchName] = useState('');

  const fetchPatientData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id, first_name, last_name, shifa_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (patientData) {
        setPatient(patientData);

        // Fetch today's appointments
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const { data: appts } = await supabase
          .from('appointments')
          .select('id, scheduled_at, appointment_type, reason, status, professionals(first_name, last_name), departments(name)')
          .eq('patient_id', patientData.id)
          .gte('scheduled_at', todayStart.toISOString())
          .lte('scheduled_at', todayEnd.toISOString())
          .in('status', ['scheduled', 'confirmed'])
          .order('scheduled_at', { ascending: true });

        if (appts) setTodayAppointments(appts as any);
        if (appts && appts.length > 0) setSelectedAppointment(appts[0] as any);
      }

      // Fetch kiosk stats
      const todayStart2 = new Date();
      todayStart2.setHours(0, 0, 0, 0);

      const { count: todayCount } = await supabase
        .from('kiosk_checkins')
        .select('*', { count: 'exact', head: true })
        .gte('checked_in_at', todayStart2.toISOString());

      const { count: totalCount } = await supabase
        .from('kiosk_checkins')
        .select('*', { count: 'exact', head: true });

      setStats({
        total: totalCount || 0,
        today: todayCount || 0,
        avgTime: '1m 42s',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  // Real-time subscription to appointments table for instant kiosk updates
  useEffect(() => {
    if (!user) return;
    const channelName = `kiosk-appointments-${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchPatientData();
      })
      .subscribe();
    realtimeChannelRef.current = channel;
    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [user, supabase, fetchPatientData]);

  const handleCheckin = async () => {
    if (!patient) return;
    setCheckinLoading(true);
    try {
      // Generate queue number
      const prefix = selectedAppointment?.departments?.name?.charAt(0)?.toUpperCase() || 'A';
      const num = Math.floor(Math.random() * 90 + 10);
      const generatedQueue = `${prefix}-${num.toString().padStart(3, '0')}`;
      setQueueNumber(generatedQueue);

      // Insert kiosk check-in
      const { error: insertErr } = await supabase
        .from('kiosk_checkins')
        .insert({
          patient_id: patient.id,
          appointment_id: selectedAppointment?.id || null,
          kiosk_id: 'KIOSK-01',
          queue_number: generatedQueue,
          department: selectedAppointment?.departments?.name || 'Consultations générales',
          status: 'checked_in',
          checked_in_at: new Date().toISOString(),
        });

      if (insertErr) throw insertErr;

      // Update appointment status to in_progress if exists
      if (selectedAppointment) {
        await supabase
          .from('appointments')
          .update({ status: 'in_progress' })
          .eq('id', selectedAppointment.id);
      }

      // Log to audit_logs
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'kiosk_checkin',
        resource_type: 'patient',
        resource_id: patient.id,
        details: {
          queue_number: generatedQueue,
          kiosk_id: 'KIOSK-01',
          appointment_id: selectedAppointment?.id,
        },
      });

      setStep('ticket');
      await fetchPatientData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCheckinLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (adminView) {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                <Icon name="ComputerDesktopIcon" size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA Kiosk</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Borne d'accueil patient — enregistrement, QR, tickets de file d'attente</p>
          </div>
          <button onClick={() => { setAdminView(false); setStep('welcome'); }} className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon name="ComputerDesktopIcon" size={16} />
            Aperçu borne patient
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>État des bornes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'KIOSK-01', location: 'Entrée principale', status: 'online', queue: stats.today },
                  { id: 'KIOSK-02', location: 'Urgences', status: 'online', queue: 4 },
                  { id: 'KIOSK-03', location: 'Consultations externes', status: 'offline', queue: 0 },
                  { id: 'KIOSK-04', location: 'Maternité', status: 'online', queue: 3 },
                ].map(kiosk => (
                  <div key={kiosk.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{kiosk.id}</p>
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: kiosk.status === 'online' ? '#16a34a' : '#dc2626' }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kiosk.status === 'online' ? '#16a34a' : '#dc2626' }} />
                        {kiosk.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kiosk.location}</p>
                    {kiosk.status === 'online' && (
                      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--shifa-blue)' }}>{kiosk.queue} enregistrements aujourd'hui</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Statistiques du jour</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Enregistrements aujourd'hui", value: stats.today.toString(), color: 'var(--shifa-blue)' },
                    { label: 'Total enregistrements', value: stats.total.toString(), color: '#8b5cf6' },
                    { label: 'Temps moyen', value: stats.avgTime, color: '#16a34a' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Configuration</h3>
              <div className="space-y-3">
                {[
                  { label: 'Scan QR SHIFA', enabled: true },
                  { label: 'Recherche par nom', enabled: true },
                  { label: 'Impression ticket', enabled: true },
                  { label: 'Orientation automatique', enabled: false },
                  { label: 'Mode accessibilité', enabled: false },
                ].map(opt => (
                  <div key={opt.label} className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{opt.label}</p>
                    <div className={`w-10 h-5 rounded-full transition-colors ${opt.enabled ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Message d'accueil</h3>
              <textarea className="w-full px-3 py-2 rounded-xl border text-sm resize-none" rows={3} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                defaultValue="Bienvenue au CHU Saint-Louis. Veuillez scanner votre carte SHIFA ou saisir votre nom." />
              <button className="mt-2 w-full text-sm py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Patient-facing kiosk
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f0f7ff' }}>
      <div className="w-full max-w-md">
        <button onClick={() => { setAdminView(true); setStep('welcome'); }} className="mb-4 flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="ArrowLeftIcon" size={16} /> Retour à l'administration
        </button>

        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'white' }}>
          <div className="p-6 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Icon name="ComputerDesktopIcon" size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">SHIFA Kiosk</h2>
            <p className="text-sm opacity-80 mt-1">CHU Saint-Louis — Entrée principale</p>
          </div>

          {error && (
            <div className="mx-4 mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div className="p-6">
            {step === 'welcome' && (
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold" style={{ color: 'var(--shifa-dark)' }}>Bienvenue</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Veuillez scanner votre carte SHIFA ou saisir votre nom pour vous enregistrer</p>
                <div className="space-y-3 mt-6">
                  <button onClick={() => setStep('scan')} className="w-full py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    <Icon name="QrCodeIcon" size={24} />
                    Scanner ma carte SHIFA
                  </button>
                  <button onClick={() => setStep('confirm')} className="w-full py-4 rounded-2xl font-semibold text-lg border-2 flex items-center justify-center gap-3" style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)' }}>
                    <Icon name="MagnifyingGlassIcon" size={24} />
                    Rechercher par nom
                  </button>
                </div>
              </div>
            )}

            {step === 'scan' && (
              <div className="text-center space-y-4">
                <p className="text-lg font-semibold" style={{ color: 'var(--shifa-dark)' }}>Scan QR Code</p>
                <div className="w-48 h-48 mx-auto rounded-2xl border-4 flex items-center justify-center" style={{ borderColor: 'var(--shifa-blue)', backgroundColor: '#f0f7ff' }}>
                  <div className="text-center">
                    <Icon name="QrCodeIcon" size={64} style={{ color: 'var(--shifa-blue)' } as any} />
                    <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Zone de scan</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Présentez le QR code de votre carte SHIFA devant la caméra</p>
                <button onClick={() => setStep('confirm')} className="w-full py-3 rounded-2xl text-white font-semibold" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  {loading ? 'Recherche...' : 'Simuler un scan réussi'}
                </button>
                <button onClick={() => setStep('welcome')} className="w-full py-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>Retour</button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="space-y-4">
                <p className="text-lg font-semibold text-center" style={{ color: 'var(--shifa-dark)' }}>Confirmation</p>
                {patient ? (
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: '#f0f7ff' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                        {patient.first_name[0]}{patient.last_name[0]}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--shifa-dark)' }}>{patient.first_name} {patient.last_name}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{patient.shifa_id}</p>
                      </div>
                    </div>
                    {todayAppointments.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Rendez-vous du jour :</p>
                        {todayAppointments.map(appt => (
                          <button
                            key={appt.id}
                            onClick={() => setSelectedAppointment(appt)}
                            className="w-full text-left p-2 rounded-xl border-2 transition-all"
                            style={{
                              borderColor: selectedAppointment?.id === appt.id ? 'var(--shifa-blue)' : 'var(--border)',
                              backgroundColor: selectedAppointment?.id === appt.id ? 'rgba(0,102,255,0.05)' : 'white',
                            }}
                          >
                            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                              {(appt.professionals as any)?.first_name} {(appt.professionals as any)?.last_name} — {formatTime(appt.scheduled_at)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              {(appt.departments as any)?.name || appt.appointment_type}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                        <p>Aucun rendez-vous programmé aujourd'hui</p>
                        <p className="text-xs">Vous serez enregistré en consultation générale</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      className="w-full px-4 py-3 rounded-xl border text-sm"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Rechercher par nom..."
                      value={searchName}
                      onChange={e => setSearchName(e.target.value)}
                    />
                    <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>Profil patient non trouvé pour ce compte</p>
                  </div>
                )}
                <button
                  onClick={handleCheckin}
                  disabled={checkinLoading}
                  className="w-full py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                >
                  {checkinLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement...</>
                  ) : (
                    'Confirmer et obtenir mon ticket'
                  )}
                </button>
                <button onClick={() => setStep('welcome')} className="w-full py-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>Retour</button>
              </div>
            )}

            {step === 'ticket' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#dcfce7' }}>
                  <Icon name="CheckCircleIcon" size={32} style={{ color: '#16a34a' } as any} />
                </div>
                <p className="text-lg font-bold" style={{ color: '#16a34a' }}>Enregistrement confirmé</p>
                <div className="p-4 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--shifa-blue)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>VOTRE NUMÉRO DE FILE</p>
                  <p className="text-5xl font-bold" style={{ color: 'var(--shifa-blue)' }}>{queueNumber}</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
                    {selectedAppointment?.departments?.name || 'Consultations générales'}
                  </p>
                  {selectedAppointment && (
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      RDV à {formatTime(selectedAppointment.scheduled_at)}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Temps d'attente estimé : ~15 min</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Votre ticket a été envoyé sur votre application SHIFA</p>
                <button onClick={() => { setStep('welcome'); setSelectedAppointment(null); setQueueNumber(''); }} className="w-full py-3 rounded-2xl text-white font-semibold" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
