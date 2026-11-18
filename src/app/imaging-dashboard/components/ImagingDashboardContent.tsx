'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type TabKey = 'requests' | 'appointments' | 'worklist' | 'reports' | 'equipment';

interface ImagingRequest { id: string; patient: string; age: number; doctor: string; modality: string; exam: string; priority: 'urgent' | 'normal' | 'stat'; status: 'en attente' | 'planifié' | 'en cours' | 'réalisé' | 'validé'; date: string; }
interface Appointment { id: string; patient: string; time: string; modality: string; exam: string; room: string; technician: string; status: 'confirmé' | 'en salle' | 'terminé' | 'annulé'; }
interface DicomItem { id: string; patient: string; dob: string; accession: string; modality: string; description: string; images: number; status: 'new' | 'read' | 'reported' | 'validated'; }
interface Equipment { id: string; name: string; modality: string; room: string; status: 'opérationnel' | 'maintenance' | 'hors service'; lastMaint: string; nextMaint: string; uptime: string; }

const staticRequests: ImagingRequest[] = [
  { id: 'IMG-301', patient: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', modality: 'RX', exam: 'Radiographie thorax F+P', priority: 'urgent', status: 'en cours', date: '10:30' },
  { id: 'IMG-302', patient: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', modality: 'Echo', exam: 'Échographie abdominale', priority: 'normal', status: 'planifié', date: '11:00' },
  { id: 'IMG-303', patient: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', modality: 'TDM', exam: 'Scanner cérébral sans injection', priority: 'stat', status: 'en attente', date: '10:45' },
  { id: 'IMG-304', patient: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', modality: 'Echo', exam: 'Échographie obstétricale T2', priority: 'normal', status: 'validé', date: '09:00' },
  { id: 'IMG-305', patient: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', modality: 'IRM', exam: 'IRM genou droit', priority: 'normal', status: 'réalisé', date: '08:30' },
];

const staticAppointments: Appointment[] = [
  { id: 'APT-01', patient: 'Oumar Diallo', time: '10:30', modality: 'RX', exam: 'Thorax F+P', room: 'Salle RX-1', technician: 'Tech. Camara', status: 'en salle' },
  { id: 'APT-02', patient: 'Fatou Seck', time: '11:00', modality: 'Echo', exam: 'Abdominale', room: 'Salle Echo-2', technician: 'Tech. Diallo', status: 'confirmé' },
  { id: 'APT-03', patient: 'Ibrahima Ba', time: '11:15', modality: 'TDM', exam: 'Cérébral', room: 'Salle TDM', technician: 'Tech. Sarr', status: 'confirmé' },
  { id: 'APT-04', patient: 'Aminata Sow', time: '12:00', modality: 'IRM', exam: 'Colonne lombaire', room: 'Salle IRM', technician: 'Tech. Ba', status: 'confirmé' },
  { id: 'APT-05', patient: 'Boubacar Koné', time: '14:30', modality: 'RX', exam: 'Bassin F', room: 'Salle RX-2', technician: 'Tech. Camara', status: 'confirmé' },
];

const staticDicom: DicomItem[] = [
  { id: 'DCM-001', patient: 'Oumar Diallo', dob: '1968-03-15', accession: 'ACC-2024-0891', modality: 'CR', description: 'CHEST 2 VIEWS', images: 2, status: 'new' },
  { id: 'DCM-002', patient: 'Mariama Koné', dob: '2000-07-22', accession: 'ACC-2024-0890', modality: 'US', description: 'OB US 2ND TRIMESTER', images: 18, status: 'validated' },
  { id: 'DCM-003', patient: 'Cheikh Mbaye', dob: '1981-11-08', accession: 'ACC-2024-0889', modality: 'MR', description: 'KNEE MRI RIGHT', images: 124, status: 'reported' },
  { id: 'DCM-004', patient: 'Ibrahima Ba', dob: '1954-05-30', accession: 'ACC-2024-0888', modality: 'CT', description: 'HEAD CT W/O CONTRAST', images: 0, status: 'new' },
];

const staticEquipment: Equipment[] = [
  { id: 'EQ-01', name: 'Siemens SOMATOM Definition AS', modality: 'TDM', room: 'Salle TDM', status: 'opérationnel', lastMaint: '15/07/2026', nextMaint: '15/10/2026', uptime: '98.2%' },
  { id: 'EQ-02', name: 'GE Signa Architect 3T', modality: 'IRM', room: 'Salle IRM', status: 'opérationnel', lastMaint: '01/08/2026', nextMaint: '01/11/2026', uptime: '96.5%' },
  { id: 'EQ-03', name: 'Philips DigitalDiagnost C90', modality: 'RX', room: 'Salle RX-1', status: 'opérationnel', lastMaint: '20/07/2026', nextMaint: '20/10/2026', uptime: '99.1%' },
  { id: 'EQ-04', name: 'Siemens Multix Fusion', modality: 'RX', room: 'Salle RX-2', status: 'maintenance', lastMaint: '10/08/2026', nextMaint: '10/09/2026', uptime: '87.3%' },
  { id: 'EQ-05', name: 'GE LOGIQ E10', modality: 'Echo', room: 'Salle Echo-1', status: 'opérationnel', lastMaint: '05/08/2026', nextMaint: '05/11/2026', uptime: '99.8%' },
];

const priorityConfig = {
  urgent: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Urgent' },
  stat: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'STAT' },
  normal: { bg: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', label: 'Normal' },
};

const statusImgConfig: Record<string, { bg: string; color: string }> = {
  'en attente': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
  'planifié': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'en cours': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'réalisé': { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  'validé': { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const aptStatusConfig: Record<string, { bg: string; color: string }> = {
  confirmé: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'en salle': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  terminé: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  annulé: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const dicomStatusConfig = {
  new: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Nouveau' },
  read: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Lu' },
  reported: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', label: 'Rapporté' },
  validated: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Validé' },
};

const eqStatusConfig = {
  opérationnel: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  maintenance: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'hors service': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'appointments', label: 'Planning', icon: 'CalendarDaysIcon' },
  { key: 'worklist', label: 'Worklist DICOM', icon: 'ComputerDesktopIcon' },
  { key: 'reports', label: 'Comptes rendus', icon: 'DocumentTextIcon' },
  { key: 'equipment', label: 'Équipements', icon: 'CpuChipIcon' },
];

export default function ImagingDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');
  const [dbStudies, setDbStudies] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    fetchImagingStudies();
  }, []);

  const fetchImagingStudies = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('imaging_studies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setDbStudies(data || []);
    } catch (err: any) {
      setDbError(err?.message || 'Erreur lors du chargement des études.');
    } finally {
      setDbLoading(false);
    }
  };

  // Merge DB studies into display list (DB data takes priority when available)
  const displayRequests = dbStudies.length > 0
    ? dbStudies.map((s: any) => ({
        id: s.id?.slice(0, 8) || '—',
        patient: s.patient_id || 'Patient',
        age: 0,
        doctor: s.requested_by || '—',
        modality: s.modality || '—',
        exam: s.description || '—',
        priority: (s.priority || 'normal') as 'urgent' | 'normal' | 'stat',
        status: (s.status || 'en attente') as ImagingRequest['status'],
        date: s.created_at ? new Date(s.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—',
      }))
    : staticRequests;

  const kpis = [
    { label: 'Demandes du jour', value: String(displayRequests.length), icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'En cours', value: String(displayRequests.filter(r => r.status === 'en cours').length), icon: 'ArrowPathIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Validés', value: String(displayRequests.filter(r => r.status === 'validé').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Équipements actifs', value: String(staticEquipment.filter(e => e.status === 'opérationnel').length), icon: 'CpuChipIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #0A1E4A 0%, #0878EF 55%, #7B5EA7 100%)',
          boxShadow: '0 8px 32px rgba(8,120,239,0.25)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="CpuChipIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {dbStudies.length > 0 ? `${dbStudies.length} études en base` : 'Données de démonstration'}
                </span>
                {dbLoading && <Icon name="ArrowPathIcon" size={14} className="text-white animate-spin" />}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Imagerie Médicale
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Demandes, planning, worklist DICOM, comptes rendus et équipements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchImagingStudies} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowPathIcon" size={15} className={dbLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={15} />
              Nouvelle demande
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={kpi.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {dbError && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)' }} />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{dbError} — Affichage des données de démonstration.</p>
          <button onClick={fetchImagingStudies} className="ml-auto text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Réessayer</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Demandes d'imagerie</h3>
              {dbStudies.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>
                  Données Supabase
                </span>
              )}
            </div>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouvelle demande</button>
          </div>

          {dbLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des études…</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {displayRequests.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="CpuChipIcon" size={26} style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Aucune demande d'imagerie</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Les demandes apparaîtront ici.</p>
                </div>
              ) : displayRequests.map((req) => (
                <div key={req.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: req.modality === 'RX' ? 'var(--shifa-blue)' : req.modality === 'TDM' || req.modality === 'CT' ? 'var(--shifa-purple)' : req.modality === 'IRM' || req.modality === 'MR' ? 'var(--shifa-amber)' : 'var(--shifa-cyan)' }}>
                      {req.modality.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{req.patient}</p>
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{req.id}</span>
                      </div>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{req.doctor} · {req.date}</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{req.exam}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: priorityConfig[req.priority]?.bg, color: priorityConfig[req.priority]?.color }}>
                      {priorityConfig[req.priority]?.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusImgConfig[req.status]?.bg, color: statusImgConfig[req.status]?.color }}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Planning du jour</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {staticAppointments.map((apt) => (
              <div key={apt.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 text-center">
                    <p className="text-sm font-bold" style={{ color: 'var(--shifa-blue)' }}>{apt.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{apt.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{apt.exam} · {apt.room} · {apt.technician}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: apt.modality === 'RX' ? 'var(--shifa-blue)' : apt.modality === 'TDM' ? 'var(--shifa-purple)' : apt.modality === 'IRM' ? 'var(--shifa-amber)' : 'var(--shifa-cyan)' }}>
                    {apt.modality}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: aptStatusConfig[apt.status]?.bg, color: aptStatusConfig[apt.status]?.color }}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Worklist Tab */}
      {activeTab === 'worklist' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Worklist DICOM</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Patient', 'Accession', 'Modalité', 'Description', 'Images', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staticDicom.map((d, i) => (
                  <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{d.patient}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.accession}</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>{d.modality}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.description}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{d.images}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: dicomStatusConfig[d.status].bg, color: dicomStatusConfig[d.status].color }}>
                        {dicomStatusConfig[d.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
            <Icon name="DocumentTextIcon" size={24} style={{ color: 'var(--shifa-blue)' }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>Comptes rendus radiologiques</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Intégration PACS/RIS à configurer pour accéder aux comptes rendus.</p>
        </div>
      )}

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>État des équipements</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {staticEquipment.map((eq) => (
              <div key={eq.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="CpuChipIcon" size={16} style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{eq.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{eq.modality} · {eq.room} · Uptime: {eq.uptime}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière maint.: {eq.lastMaint} · Prochaine: {eq.nextMaint}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: eqStatusConfig[eq.status]?.bg, color: eqStatusConfig[eq.status]?.color }}>
                  {eq.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
