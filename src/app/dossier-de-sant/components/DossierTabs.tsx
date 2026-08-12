'use client';
import React, { useState, useEffect } from 'react';
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

// Static fallback data for sections not yet connected to Supabase
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
}

interface LabResult {
  id: string;
  date: string;
  type: string;
  label: string;
  lab: string;
  status: string;
  alert: boolean;
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

  const supabase = createClient();

  useEffect(() => {
    const fetchHealthRecords = async () => {
      setLoadingRecords(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get patient record
        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!patient) return;

        // Fetch health records
        const { data: records, error } = await supabase
          .from('health_records')
          .select(`
            id,
            record_type,
            title,
            content,
            is_signed,
            created_at,
            professionals (
              first_name,
              last_name,
              specialty,
              profession
            )
          `)
          .eq('patient_id', patient.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Health records fetch error:', error.message);
          return;
        }

        const cons: ConsultationRecord[] = [];
        const presc: PrescriptionRecord[] = [];
        const labs: LabResult[] = [];

        (records || []).forEach((r: any) => {
          const dateStr = r.created_at
            ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—';
          const pro = r.professionals;
          const doctorName = pro ? `Dr. ${pro.first_name} ${pro.last_name}` : 'Médecin';
          const specialty = pro?.specialty || pro?.profession || 'Médecine générale';

          if (r.record_type === 'consultation') {
            cons.push({
              id: r.id,
              date: dateStr,
              doctor: doctorName,
              specialty,
              motif: r.content?.motif || r.title || 'Consultation',
              diagnostic: r.content?.diagnostic || r.content?.evaluation || '—',
              status: r.is_signed ? 'signed' : 'draft',
            });
          } else if (r.record_type === 'prescription') {
            const meds = r.content?.medications || [];
            presc.push({
              id: r.id,
              date: dateStr,
              doctor: doctorName,
              medications: Array.isArray(meds) ? meds.map((m: any) => typeof m === 'string' ? m : `${m.drug || ''} — ${m.dosage || ''} ${m.frequency || ''}`.trim()) : [r.title],
              status: 'active',
            });
          } else if (r.record_type === 'lab_result') {
            labs.push({
              id: r.id,
              date: dateStr,
              type: 'Biologie',
              label: r.title || 'Résultat',
              lab: r.content?.lab || 'Laboratoire',
              status: 'available',
              alert: r.content?.alert || false,
            });
          }
        });

        setConsultations(cons);
        setPrescriptions(presc);
        setLabResults(labs);
      } catch {
        // Keep empty state
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchHealthRecords();
  }, []);

  // Sync vaccinations from localStorage (added via /patient-vaccination)
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
        setVaccinations([...mapped, ...STATIC_VACCINATIONS]);
      }
    } catch {
      // keep static data
    }
  }, [activeTab]);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
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

      {/* Tab content */}
      <div className="animate-fade-in">
        {/* RÉSUMÉ */}
        {activeTab === 'tab-resume' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-5">
              {/* Vitals chart */}
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

              {/* Recent consultations */}
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
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-5">
              {/* Current treatments */}
              <div className="card-base">
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Traitements en cours</h3>
                <div className="flex flex-col gap-2">
                  {antecedents.traitements.map((t) => (
                    <div key={`treat-${t}`} className="flex items-center gap-2.5 p-2.5 rounded-xl border" style={{ backgroundColor: 'rgba(0, 102, 255, 0.04)', borderColor: 'rgba(0, 102, 255, 0.15)' }}>
                      <Icon name="BeakerIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0" />
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
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

              {/* Vaccinations alert */}
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

        {/* PRESCRIPTIONS */}
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
                      {p.status === 'active' ? 'En cours' : 'Terminée'}
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
                </div>
              ))
            )}
          </div>
        )}

        {/* RÉSULTATS */}
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
                <div key={r.id} className="card-base flex items-center justify-between gap-4">
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
                    {r.alert && <Icon name="ExclamationTriangleIcon" size={16} style={{ color: 'var(--shifa-red)' } as any} className="" />}
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--shifa-green)' }}>Disponible</span>
                  </div>
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