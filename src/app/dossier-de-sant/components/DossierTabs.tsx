'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

const DossierVitalsChart = dynamic(() => import('./DossierVitalsChart'), { ssr: false });

const tabs = [
  { key: 'tab-resume', label: 'Résumé', icon: 'Squares2X2Icon' },
  { key: 'tab-antecedents', label: 'Antécédents', icon: 'ClockIcon' },
  { key: 'tab-consultations', label: 'Consultations', icon: 'ClipboardDocumentListIcon' },
  { key: 'tab-prescriptions', label: 'Prescriptions', icon: 'DocumentTextIcon' },
  { key: 'tab-resultats', label: 'Résultats', icon: 'BeakerIcon' },
  { key: 'tab-documents', label: 'Documents', icon: 'FolderOpenIcon' },
  { key: 'tab-vaccinations', label: 'Vaccinations', icon: 'ShieldCheckIcon' },
];

const antecedents = {
  medicaux: ['Anémie ferriprive (2026)', 'Palpitations bénignes (2026)', 'Rhinopharyngites récurrentes'],
  chirurgicaux: ['Appendicectomie (2015)'],
  familiaux: ['Hypertension (père)', 'Diabète type 2 (grand-mère maternelle)'],
  allergies: ['Pénicilline — réaction cutanée sévère'],
  traitements: ['Contraceptif oral (en cours)', 'Vitamine D3 (en cours)'],
};

const STATIC_VACCINATIONS = [
  { id: 'vacc-001', name: 'COVID-19 (Rappel)', date: '12 sept. 2023', nextDue: null, status: 'done', lab: 'Pfizer BNT162b2', boosterDueDate: null as string | null, notes: null as string | null },
  { id: 'vacc-002', name: 'Grippe saisonnière', date: '10 oct. 2025', nextDue: 'Oct. 2026', status: 'done', lab: 'Vaxigrip Tetra', boosterDueDate: null as string | null, notes: null as string | null },
  { id: 'vacc-003', name: 'DTP (Rappel)', date: '20 sept. 2016', nextDue: '20 sept. 2026', status: 'due', lab: 'Revaxis', boosterDueDate: null as string | null, notes: null as string | null },
  { id: 'vacc-004', name: 'Hépatite B', date: '15 mars 2010', nextDue: null, status: 'done', lab: 'Engerix-B', boosterDueDate: null as string | null, notes: null as string | null },
];

const STORAGE_KEY = 'shifa_vaccinations';

interface ConsultationRecord {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  motif: string;
  diagnostic: string;
  status: string;
}

interface PrescriptionRecord {
  id: string;
  date: string;
  doctor: string;
  medications: string[];
  status: string;
  notes?: string;
}

interface LabResult {
  id: string;
  date: string;
  type: string;
  label: string;
  lab: string;
  status: string;
  alert: boolean;
  values?: Array<{ name: string; value: string; unit: string; reference_range?: string; is_abnormal?: boolean }>;
}

interface DossierVaccination {
  id: string;
  name: string;
  date: string;
  nextDue: string | null;
  status: string;
  lab: string;
  boosterDueDate: string | null;
  notes: string | null;
}

export default function DossierTabs() {
  const [activeTab, setActiveTab] = useState('tab-resume');
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [vaccinations, setVaccinations] = useState<DossierVaccination[]>(STATIC_VACCINATIONS);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const channelsRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']>[]>([]);

  const supabase = createClient();

  // ── Fetch consultations from health_records ──
  const fetchConsultations = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          id, record_type, title, content, is_signed, created_at,
          professionals ( first_name, last_name, specialty, profession )
        `)
        .eq('patient_id', patientId)
        .eq('record_type', 'consultation')
        .order('created_at', { ascending: false });

      if (error) return;

      const cons: ConsultationRecord[] = (data || []).map((r: any) => {
        const dateStr = r.created_at
          ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';
        const pro = r.professionals;
        return {
          id: r.id,
          date: dateStr,
          doctor: pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Médecin',
          specialty: pro?.specialty || pro?.profession || 'Médecine générale',
          motif: r.content?.motif || r.title || 'Consultation',
          diagnostic: r.content?.diagnostic || r.content?.evaluation || '—',
          status: r.is_signed ? 'signed' : 'draft',
        };
      });
      setConsultations(cons);
    } catch {
      // keep empty state
    }
  };

  // ── Fetch prescriptions from dedicated prescriptions table ──
  const fetchPrescriptions = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          id, created_at, status, notes, medications,
          professionals ( first_name, last_name, specialty )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback: try health_records for prescriptions
        const { data: hrData } = await supabase
          .from('health_records')
          .select(`
            id, title, content, created_at, is_signed,
            professionals ( first_name, last_name, specialty, profession )
          `)
          .eq('patient_id', patientId)
          .eq('record_type', 'prescription')
          .order('created_at', { ascending: false });

        const presc: PrescriptionRecord[] = (hrData || []).map((r: any) => {
          const dateStr = r.created_at
            ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';
          const pro = r.professionals;
          const meds = r.content?.medications || [];
          return {
            id: r.id,
            date: dateStr,
            doctor: pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Médecin',
            medications: Array.isArray(meds)
              ? meds.map((m: any) => typeof m === 'string' ? m : `${m.drug || ''} — ${m.dosage || ''} ${m.frequency || ''}`.trim())
              : [r.title],
            status: r.is_signed ? 'active' : 'draft',
            notes: r.content?.notes,
          };
        });
        setPrescriptions(presc);
        return;
      }

      const presc: PrescriptionRecord[] = (data || []).map((r: any) => {
        const dateStr = r.created_at
          ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';
        const pro = r.professionals;
        const meds = r.medications || [];
        return {
          id: r.id,
          date: dateStr,
          doctor: pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Médecin',
          medications: Array.isArray(meds)
            ? meds.map((m: any) => typeof m === 'string' ? m : `${m.drug || m.name || ''} — ${m.dosage || ''} ${m.frequency || ''}`.trim())
            : [],
          status: r.status || 'active',
          notes: r.notes,
        };
      });
      setPrescriptions(presc);
    } catch {
      // keep empty state
    }
  };

  // ── Fetch lab results from dedicated lab_results table ──
  const fetchLabResults = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select(`
          id, created_at, status, result_values, is_abnormal, notes,
          lab_samples ( sample_type, collected_at ),
          professionals ( first_name, last_name )
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback: try health_records for lab results
        const { data: hrData } = await supabase
          .from('health_records')
          .select(`
            id, title, content, created_at,
            professionals ( first_name, last_name )
          `)
          .eq('patient_id', patientId)
          .eq('record_type', 'lab_result')
          .order('created_at', { ascending: false });

        const labs: LabResult[] = (hrData || []).map((r: any) => {
          const dateStr = r.created_at
            ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';
          return {
            id: r.id,
            date: dateStr,
            type: 'Biologie',
            label: r.title || 'Résultat',
            lab: r.content?.lab || 'Laboratoire',
            status: 'available',
            alert: r.content?.alert || false,
          };
        });
        setLabResults(labs);
        return;
      }

      const labs: LabResult[] = (data || []).map((r: any) => {
        const dateStr = r.created_at
          ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—';
        const pro = r.professionals;
        const values = r.result_values || [];
        return {
          id: r.id,
          date: dateStr,
          type: r.lab_samples?.sample_type || 'Biologie',
          label: Array.isArray(values) && values.length > 0
            ? values.map((v: any) => v.name || v.test_name || '').filter(Boolean).join(', ') || 'Résultat de laboratoire'
            : 'Résultat de laboratoire',
          lab: pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Laboratoire',
          status: r.status || 'available',
          alert: r.is_abnormal || false,
          values: Array.isArray(values) ? values : [],
        };
      });
      setLabResults(labs);
    } catch {
      // keep empty state
    }
  };

  const fetchVaccinations = async (patientId: string) => {
    try {
      const { data } = await supabase
        .from('health_records')
        .select('id, title, content, created_at')
        .eq('patient_id', patientId)
        .eq('record_type', 'vaccination')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const dbVaccinations: DossierVaccination[] = data.map((r: any) => ({
          id: r.id,
          name: r.title || r.content?.name || 'Vaccin',
          date: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—',
          nextDue: r.content?.nextDose || null,
          status: r.content?.status || 'done',
          lab: r.content?.lot ? `Lot: ${r.content.lot}` : r.content?.provider || 'Laboratoire',
          boosterDueDate: r.content?.boosterDueDate || null,
          notes: r.content?.notes || null,
        }));
        setVaccinations([...dbVaccinations, ...STATIC_VACCINATIONS]);
        return;
      }
    } catch {
      // fall through to localStorage
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: Array<{ id: string; name: string; date: string; nextDose?: string; boosterDueDate?: string; lot: string; provider: string; status: string; doses: number; totalDoses: number; notes?: string }> = JSON.parse(raw);
        const mapped: DossierVaccination[] = stored.map(v => ({
          id: v.id,
          name: v.name,
          date: v.date,
          nextDue: v.nextDose || null,
          status: v.status === 'done' ? 'done' : 'due',
          lab: v.lot !== '—' ? `Lot: ${v.lot}` : v.provider,
          boosterDueDate: v.boosterDueDate || null,
          notes: v.notes || null,
        }));
        setVaccinations([...mapped, ...STATIC_VACCINATIONS]);
      }
    } catch {
      // keep static data
    }
  };

  useEffect(() => {
    let patientId: string | null = null;

    const initAndSubscribe = async () => {
      setLoadingRecords(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!patient) return;
        patientId = patient.id;

        await Promise.all([
          fetchConsultations(patientId),
          fetchPrescriptions(patientId),
          fetchLabResults(patientId),
          fetchVaccinations(patientId),
        ]);

        // Realtime: health_records
        const hrChannel = supabase
          .channel(`dossier-health-records-${patientId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'health_records',
            filter: `patient_id=eq.${patientId}`,
          }, () => {
            fetchConsultations(patientId!);
            fetchVaccinations(patientId!);
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') setRealtimeStatus('live');
            else if (status === 'CHANNEL_ERROR') setRealtimeStatus('error');
          });

        // Realtime: prescriptions
        const prescChannel = supabase
          .channel(`dossier-prescriptions-${patientId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'prescriptions',
            filter: `patient_id=eq.${patientId}`,
          }, () => {
            fetchPrescriptions(patientId!);
          })
          .subscribe();

        // Realtime: lab_results
        const labChannel = supabase
          .channel(`dossier-lab-results-${patientId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'lab_results',
            filter: `patient_id=eq.${patientId}`,
          }, () => {
            fetchLabResults(patientId!);
          })
          .subscribe();

        channelsRef.current = [hrChannel, prescChannel, labChannel];
        setRealtimeStatus('live');
      } catch {
        setRealtimeStatus('error');
      } finally {
        setLoadingRecords(false);
      }
    };

    initAndSubscribe();

    return () => {
      channelsRef.current.forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = [];
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: Array<{ id: string; name: string; date: string; nextDose?: string; boosterDueDate?: string; lot: string; provider: string; status: string; doses: number; totalDoses: number; notes?: string }> = JSON.parse(raw);
        const mapped: DossierVaccination[] = stored.map(v => ({
          id: v.id,
          name: v.name,
          date: v.date,
          nextDue: v.nextDose || null,
          status: v.status === 'done' ? 'done' : 'due',
          lab: v.lot !== '—' ? `Lot: ${v.lot}` : v.provider,
          boosterDueDate: v.boosterDueDate || null,
          notes: v.notes || null,
        }));
        setVaccinations(prev => {
          const existingIds = new Set(mapped.map(m => m.id));
          const staticOnly = STATIC_VACCINATIONS.filter(s => !existingIds.has(s.id));
          return [...mapped, ...staticOnly];
        });
      }
    } catch {
      // keep static data
    }
  }, [activeTab]);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-4 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)',
              color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)',
              borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Realtime indicator */}
      <div className="flex items-center gap-1.5 mb-5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: realtimeStatus === 'live' ? '#10b981' : realtimeStatus === 'error' ? '#ef4444' : '#f59e0b',
            boxShadow: realtimeStatus === 'live' ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none',
          }}
        />
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {realtimeStatus === 'live' ? 'Synchronisation en temps réel active' : realtimeStatus === 'error' ? 'Synchronisation indisponible' : 'Connexion en cours...'}
        </span>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {/* RÉSUMÉ */}
        {activeTab === 'tab-resume' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-5">
              <div className="card-base">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Évolution des constantes — 6 derniers mois</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tension</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded" style={{ backgroundColor: 'var(--shifa-red)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pouls</span>
                    </div>
                  </div>
                </div>
                <div className="h-48">
                  <DossierVitalsChart />
                </div>
              </div>

              <div className="card-base">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Consultations récentes</h3>
                {loadingRecords ? (
                  <div className="flex items-center gap-2 py-4">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Chargement...</span>
                  </div>
                ) : consultations.length === 0 ? (
                  <p className="text-sm py-4" style={{ color: 'var(--muted-foreground)' }}>Aucune consultation enregistrée.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {consultations.slice(0, 3).map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 hover:shadow-shifa cursor-pointer" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 102, 255, 0.08)' }}>
                          <Icon name="ClipboardDocumentListIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.motif}</p>
                            <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{c.date}</span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.doctor} · {c.specialty}</p>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--foreground)' }}>{c.diagnostic}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent lab results summary */}
              <div className="card-base">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Derniers résultats de laboratoire</h3>
                {loadingRecords ? (
                  <div className="flex items-center gap-2 py-4">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Chargement...</span>
                  </div>
                ) : labResults.length === 0 ? (
                  <p className="text-sm py-4" style={{ color: 'var(--muted-foreground)' }}>Aucun résultat disponible.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {labResults.slice(0, 3).map((r) => (
                      <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: r.alert ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 102, 255, 0.08)' }}>
                            <Icon name="BeakerIcon" size={14} style={{ color: r.alert ? 'var(--shifa-red)' : 'var(--shifa-blue)' } as any} className="" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{r.label}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.lab} · {r.date}</p>
                          </div>
                        </div>
                        {r.alert && <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-red)' } as any} className="shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="card-base">
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Traitements en cours</h3>
                <div className="flex flex-col gap-2">
                  {prescriptions.length > 0
                    ? prescriptions.filter(p => p.status === 'active').slice(0, 3).flatMap(p => p.medications.slice(0, 2)).map((med, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', borderColor: 'rgba(0, 102, 255, 0.15)' }}>
                        <Icon name="BeakerIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0" />
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{med}</span>
                      </div>
                    ))
                    : antecedents.traitements.map((t) => (
                      <div key={`treat-${t}`} className="flex items-center gap-2.5 p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', borderColor: 'rgba(0, 102, 255, 0.15)' }}>
                        <Icon name="BeakerIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0" />
                        <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{t}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="card-base">
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Allergies</h3>
                <div className="flex flex-col gap-2">
                  {antecedents.allergies.map((a) => (
                    <div key={`allergy-${a}`} className="flex items-start gap-2.5 p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.06)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                      <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-red)' } as any} className="shrink-0 mt-0.5" />
                      <span className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base">
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Vaccinations à venir</h3>
                {vaccinations.filter(v => v.status === 'due').map((v) => (
                  <div key={v.id} className="flex items-center gap-2.5 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                    <Icon name="ShieldExclamationIcon" size={16} style={{ color: 'var(--shifa-amber)' } as any} className="shrink-0" />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--shifa-amber)' }}>{v.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prévu: {v.nextDue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANTÉCÉDENTS */}
        {activeTab === 'tab-antecedents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[
              { key: 'ant-med', title: 'Antécédents médicaux', items: antecedents.medicaux, icon: 'HeartIcon', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.06)' },
              { key: 'ant-chir', title: 'Antécédents chirurgicaux', items: antecedents.chirurgicaux, icon: 'ScissorsIcon', color: 'var(--shifa-purple)', bg: 'rgba(123, 94, 167, 0.06)' },
              { key: 'ant-fam', title: 'Antécédents familiaux', items: antecedents.familiaux, icon: 'UsersIcon', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.06)' },
              { key: 'ant-allerg', title: 'Allergies', items: antecedents.allergies, icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.06)' },
              { key: 'ant-trait', title: 'Traitements en cours', items: antecedents.traitements, icon: 'BeakerIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0, 242, 195, 0.06)' },
            ].map((section) => (
              <div key={section.key} className="card-base" style={{ backgroundColor: section.bg, borderColor: `${section.color}20` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'white', border: `1.5px solid ${section.color}30` }}>
                    <Icon name={section.icon as any} size={16} style={{ color: section.color } as any} className="" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{section.title}</h3>
                </div>
                {section.items.length === 0 ? (
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun antécédent enregistré.</p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <li key={`${section.key}-${item}`} className="flex items-start gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CONSULTATIONS */}
        {activeTab === 'tab-consultations' && (
          <div className="flex flex-col gap-3">
            {loadingRecords ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des consultations...</span>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="ClipboardDocumentListIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune consultation enregistrée</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos consultations apparaîtront ici après votre premier rendez-vous.</p>
              </div>
            ) : (
              consultations.map((c) => (
                <div key={c.id} className="card-base cursor-pointer hover:shadow-shifa transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0, 102, 255, 0.08)' }}>
                        <Icon name="ClipboardDocumentListIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.motif}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{c.doctor} · {c.specialty}</p>
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--foreground)' }}>{c.diagnostic}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</span>
                      {c.status === 'signed' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--shifa-green)' }}>Signé</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRESCRIPTIONS — live from prescriptions table */}
        {activeTab === 'tab-prescriptions' && (
          <div className="flex flex-col gap-3">
            {loadingRecords ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des prescriptions...</span>
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="DocumentTextIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune prescription enregistrée</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos ordonnances apparaîtront ici.</p>
              </div>
            ) : (
              prescriptions.map((p) => (
                <div key={p.id} className="card-base">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.doctor}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.date}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{
                      backgroundColor: p.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      color: p.status === 'active' ? 'var(--shifa-green)' : 'var(--muted-foreground)',
                    }}>
                      {p.status === 'active' ? 'En cours' : p.status === 'draft' ? 'Brouillon' : 'Terminée'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {p.medications.map((med, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <Icon name="BeakerIcon" size={12} className="text-muted-foreground shrink-0" />
                        <span style={{ color: 'var(--foreground)' }}>{med}</span>
                      </div>
                    ))}
                  </div>
                  {p.notes && (
                    <p className="text-xs mt-2 italic" style={{ color: 'var(--muted-foreground)' }}>Note : {p.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* RÉSULTATS — live from lab_results table */}
        {activeTab === 'tab-resultats' && (
          <div className="flex flex-col gap-3">
            {loadingRecords ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des résultats...</span>
              </div>
            ) : labResults.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="BeakerIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun résultat disponible</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos résultats d'analyses apparaîtront ici.</p>
              </div>
            ) : (
              labResults.map((r) => (
                <div key={r.id} className="card-base">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: r.alert ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 102, 255, 0.08)' }}>
                        <Icon name="BeakerIcon" size={18} style={{ color: r.alert ? 'var(--shifa-red)' : 'var(--shifa-blue)' } as any} className="" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.label}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.lab} · {r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.alert && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--shifa-red)' }}>
                          <Icon name="ExclamationTriangleIcon" size={12} />
                          Anomalie
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--shifa-green)' }}>
                        {r.status === 'available' ? 'Disponible' : r.status}
                      </span>
                    </div>
                  </div>
                  {r.values && r.values.length > 0 && (
                    <div className="mt-2 border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ backgroundColor: 'var(--muted)' }}>
                            <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Paramètre</th>
                            <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Valeur</th>
                            <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Référence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.values.map((v, i) => (
                            <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                              <td className="px-3 py-2" style={{ color: 'var(--foreground)' }}>{v.name}</td>
                              <td className={`px-3 py-2 text-right font-medium ${v.is_abnormal ? 'text-red-600' : ''}`} style={{ color: v.is_abnormal ? 'var(--shifa-red)' : 'var(--foreground)' }}>
                                {v.value} {v.unit}
                              </td>
                              <td className="px-3 py-2 text-right" style={{ color: 'var(--muted-foreground)' }}>{v.reference_range || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'tab-documents' && (
          <div className="text-center py-16">
            <Icon name="FolderOpenIcon" size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucun document</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Vos documents médicaux apparaîtront ici.</p>
          </div>
        )}

        {/* VACCINATIONS */}
        {activeTab === 'tab-vaccinations' && (
          <div className="flex flex-col gap-3">
            {vaccinations.map((v) => (
              <div key={v.id} className="card-base flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: v.status === 'due' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)' }}>
                    <Icon name="ShieldCheckIcon" size={18} style={{ color: v.status === 'due' ? 'var(--shifa-amber)' : 'var(--shifa-green)' } as any} className="" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{v.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.lab} · {v.date}</p>
                    {v.nextDue && <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-amber)' }}>Prochaine dose : {v.nextDue}</p>}
                    {v.boosterDueDate && <p className="text-xs mt-0.5" style={{ color: '#f59e0b' }}>Rappel booster : {v.boosterDueDate}</p>}
                    {v.notes && <p className="text-xs mt-1 italic" style={{ color: 'var(--muted-foreground)' }}>Notes : {v.notes}</p>}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0 mt-0.5" style={{
                  backgroundColor: v.status === 'due' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: v.status === 'due' ? 'var(--shifa-amber)' : 'var(--shifa-green)',
                }}>
                  {v.status === 'due' ? 'À faire' : 'Fait'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}