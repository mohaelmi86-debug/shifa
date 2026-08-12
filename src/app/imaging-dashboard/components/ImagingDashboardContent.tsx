'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'requests' | 'appointments' | 'worklist' | 'reports' | 'equipment';

interface ImagingRequest { id: string; patient: string; age: number; doctor: string; modality: string; exam: string; priority: 'urgent' | 'normal' | 'stat'; status: 'en attente' | 'planifié' | 'en cours' | 'réalisé' | 'validé'; date: string; }
interface Appointment { id: string; patient: string; time: string; modality: string; exam: string; room: string; technician: string; status: 'confirmé' | 'en salle' | 'terminé' | 'annulé'; }
interface DicomItem { id: string; patient: string; dob: string; accession: string; modality: string; description: string; images: number; status: 'new' | 'read' | 'reported' | 'validated'; }
interface Equipment { id: string; name: string; modality: string; room: string; status: 'opérationnel' | 'maintenance' | 'hors service'; lastMaint: string; nextMaint: string; uptime: string; }

const imagingRequests: ImagingRequest[] = [
  { id: 'IMG-301', patient: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', modality: 'RX', exam: 'Radiographie thorax F+P', priority: 'urgent', status: 'en cours', date: '10:30' },
  { id: 'IMG-302', patient: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', modality: 'Echo', exam: 'Échographie abdominale', priority: 'normal', status: 'planifié', date: '11:00' },
  { id: 'IMG-303', patient: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', modality: 'TDM', exam: 'Scanner cérébral sans injection', priority: 'stat', status: 'en attente', date: '10:45' },
  { id: 'IMG-304', patient: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', modality: 'Echo', exam: 'Échographie obstétricale T2', priority: 'normal', status: 'validé', date: '09:00' },
  { id: 'IMG-305', patient: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', modality: 'IRM', exam: 'IRM genou droit', priority: 'normal', status: 'réalisé', date: '08:30' },
];

const appointments: Appointment[] = [
  { id: 'APT-01', patient: 'Oumar Diallo', time: '10:30', modality: 'RX', exam: 'Thorax F+P', room: 'Salle RX-1', technician: 'Tech. Camara', status: 'en salle' },
  { id: 'APT-02', patient: 'Fatou Seck', time: '11:00', modality: 'Echo', exam: 'Abdominale', room: 'Salle Echo-2', technician: 'Tech. Diallo', status: 'confirmé' },
  { id: 'APT-03', patient: 'Ibrahima Ba', time: '11:15', modality: 'TDM', exam: 'Cérébral', room: 'Salle TDM', technician: 'Tech. Sarr', status: 'confirmé' },
  { id: 'APT-04', patient: 'Aminata Sow', time: '12:00', modality: 'IRM', exam: 'Colonne lombaire', room: 'Salle IRM', technician: 'Tech. Ba', status: 'confirmé' },
  { id: 'APT-05', patient: 'Boubacar Koné', time: '14:30', modality: 'RX', exam: 'Bassin F', room: 'Salle RX-2', technician: 'Tech. Camara', status: 'confirmé' },
];

const dicomWorklist: DicomItem[] = [
  { id: 'DCM-001', patient: 'Oumar Diallo', dob: '1968-03-15', accession: 'ACC-2024-0891', modality: 'CR', description: 'CHEST 2 VIEWS', images: 2, status: 'new' },
  { id: 'DCM-002', patient: 'Mariama Koné', dob: '2000-07-22', accession: 'ACC-2024-0890', modality: 'US', description: 'OB US 2ND TRIMESTER', images: 18, status: 'validated' },
  { id: 'DCM-003', patient: 'Cheikh Mbaye', dob: '1981-11-08', accession: 'ACC-2024-0889', modality: 'MR', description: 'KNEE MRI RIGHT', images: 124, status: 'reported' },
  { id: 'DCM-004', patient: 'Ibrahima Ba', dob: '1954-05-30', accession: 'ACC-2024-0888', modality: 'CT', description: 'HEAD CT W/O CONTRAST', images: 0, status: 'new' },
];

const equipment: Equipment[] = [
  { id: 'EQ-01', name: 'Siemens SOMATOM Definition AS', modality: 'TDM', room: 'Salle TDM', status: 'opérationnel', lastMaint: '15/07/2026', nextMaint: '15/10/2026', uptime: '98.2%' },
  { id: 'EQ-02', name: 'GE Signa Architect 3T', modality: 'IRM', room: 'Salle IRM', status: 'opérationnel', lastMaint: '01/08/2026', nextMaint: '01/11/2026', uptime: '96.5%' },
  { id: 'EQ-03', name: 'Philips DigitalDiagnost C90', modality: 'RX', room: 'Salle RX-1', status: 'opérationnel', lastMaint: '20/07/2026', nextMaint: '20/10/2026', uptime: '99.1%' },
  { id: 'EQ-04', name: 'Siemens Multix Fusion', modality: 'RX', room: 'Salle RX-2', status: 'maintenance', lastMaint: '10/08/2026', nextMaint: '10/09/2026', uptime: '87.3%' },
  { id: 'EQ-05', name: 'GE LOGIQ E10', modality: 'Echo', room: 'Salle Echo-1', status: 'opérationnel', lastMaint: '05/08/2026', nextMaint: '05/11/2026', uptime: '99.8%' },
];

const modalityColors: Record<string, string> = {
  RX: 'var(--shifa-blue)', Echo: 'var(--shifa-cyan)', TDM: 'var(--shifa-purple)', IRM: 'var(--shifa-amber)', CR: 'var(--shifa-blue)', US: 'var(--shifa-cyan)', MR: 'var(--shifa-amber)', CT: 'var(--shifa-purple)',
};

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

const kpis = [
  { label: 'Demandes du jour', value: '28', icon: 'DocumentTextIcon', color: 'var(--shifa-blue)' },
  { label: 'Examens planifiés', value: '12', icon: 'CalendarDaysIcon', color: 'var(--shifa-cyan)' },
  { label: 'En cours', value: '3', icon: 'CpuChipIcon', color: 'var(--shifa-amber)' },
  { label: 'Rapports à valider', value: '5', icon: 'ClipboardDocumentCheckIcon', color: 'var(--shifa-purple)' },
  { label: 'Équipements actifs', value: '4/5', icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-green)' },
  { label: 'Images DICOM', value: '144', icon: 'PhotoIcon', color: 'var(--shifa-blue)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'DocumentTextIcon' },
  { key: 'appointments', label: 'Rendez-vous', icon: 'CalendarDaysIcon' },
  { key: 'worklist', label: 'Worklist DICOM', icon: 'PhotoIcon' },
  { key: 'reports', label: 'Rapports & Validation', icon: 'ClipboardDocumentCheckIcon' },
  { key: 'equipment', label: 'Équipements', icon: 'WrenchScrewdriverIcon' },
];

export default function ImagingDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-blue))' }}>
              <Icon name="PhotoIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Imagerie Médicale</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Radiologie, échographie, scanner, IRM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="ArrowDownTrayIcon" size={14} /> Export DICOM</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={14} /> Nouvelle demande</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-1" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-purple)] text-[var(--shifa-purple)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {activeTab === 'requests' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patient', 'Médecin', 'Modalité', 'Examen demandé', 'Priorité', 'Statut', 'Heure'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imagingRequests.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < imagingRequests.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{r.id}</td>
                    <td className="px-4 py-3"><p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.age} ans</p></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.doctor}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: `${modalityColors[r.modality]}18`, color: modalityColors[r.modality] }}>{r.modality}</span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{r.exam}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: priorityConfig[r.priority].bg, color: priorityConfig[r.priority].color }}>{priorityConfig[r.priority].label}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusImgConfig[r.status].bg, color: statusImgConfig[r.status].color }}>{r.status}</span></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Planning du jour — Lundi 10 août 2026</h3>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {appointments.map(a => (
                  <div key={a.id} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="text-center w-14">
                      <p className="text-lg font-bold" style={{ color: 'var(--shifa-purple)', fontFamily: 'var(--font-display)' }}>{a.time}</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.exam} · {a.room}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: `${modalityColors[a.modality]}18`, color: modalityColors[a.modality] }}>{a.modality}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: aptStatusConfig[a.status].bg, color: aptStatusConfig[a.status].color }}>{a.status}</span>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.technician}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Occupation des salles</h3>
              {[{ room: 'Salle RX-1', status: 'occupée', patient: 'Oumar Diallo' }, { room: 'Salle RX-2', status: 'maintenance', patient: '' }, { room: 'Salle Echo-1', status: 'libre', patient: '' }, { room: 'Salle Echo-2', status: 'libre', patient: '' }, { room: 'Salle TDM', status: 'libre', patient: '' }, { room: 'Salle IRM', status: 'libre', patient: '' }].map(r => (
                <div key={r.room} className="flex items-center justify-between p-2.5 rounded-xl mb-2" style={{ backgroundColor: 'var(--muted)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{r.room}</p>
                    {r.patient && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.patient}</p>}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    backgroundColor: r.status === 'occupée' ? 'rgba(245,158,11,0.12)' : r.status === 'maintenance' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                    color: r.status === 'occupée' ? 'var(--shifa-amber)' : r.status === 'maintenance' ? 'var(--shifa-red)' : 'var(--shifa-green)'
                  }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'worklist' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>DICOM Worklist — Études en attente de lecture</h3>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' }}>{dicomWorklist.filter(d => d.status === 'new').length} nouvelles</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID Étude', 'Patient', 'Date naissance', 'N° Accession', 'Modalité', 'Description', 'Images', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dicomWorklist.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: i < dicomWorklist.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: d.status === 'new' ? 'rgba(239,68,68,0.03)' : 'transparent' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{d.id}</td>
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{d.patient}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.dob}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{d.accession}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: `${modalityColors[d.modality]}18`, color: modalityColors[d.modality] }}>{d.modality}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{d.description}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: d.images === 0 ? 'var(--shifa-red)' : 'var(--muted-foreground)' }}>{d.images === 0 ? 'En cours' : d.images}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: dicomStatusConfig[d.status].bg, color: dicomStatusConfig[d.status].color }}>{dicomStatusConfig[d.status].label}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1 rounded hover:bg-muted" title="Ouvrir viewer"><Icon name="EyeIcon" size={14} style={{ color: 'var(--shifa-purple)' }} /></button>
                        <button className="p-1 rounded hover:bg-muted" title="Rédiger rapport"><Icon name="PencilSquareIcon" size={14} style={{ color: 'var(--shifa-blue)' }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Rapport en cours de rédaction</h3>
              <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Cheikh Mbaye — IRM Genou droit</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' }}>Rapporté</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dr. Radiologue Diallo · 08:30</p>
              </div>
              <div className="space-y-2 text-sm" style={{ color: 'var(--foreground)' }}>
                {[{ label: 'Indication', text: 'Douleur mécanique genou droit, suspicion lésion méniscale.' }, { label: 'Technique', text: 'IRM 3T, séquences DP fat-sat, T2, T1 dans les 3 plans.' }, { label: 'Résultats', text: 'Lésion méniscale interne de type III selon la classification de Stoller. Épanchement articulaire modéré. Pas de lésion ligamentaire associée.' }, { label: 'Conclusion', text: 'Déchirure méniscale interne. Avis chirurgical recommandé.' }].map(s => (
                  <div key={s.label}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label.toUpperCase()}</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Modifier</button>
                <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Valider & Signer</button>
              </div>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Statistiques du mois</h3>
              {[{ label: 'Radiographies', count: 312, pct: 45 }, { label: 'Échographies', count: 198, pct: 29 }, { label: 'Scanners', count: 87, pct: 13 }, { label: 'IRM', count: 54, pct: 8 }, { label: 'Autres', count: 34, pct: 5 }].map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{s.label}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{s.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: 'var(--shifa-purple)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Parc d'équipements — Maintenance & Disponibilité</h3>
              <button className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"><Icon name="PlusIcon" size={12} /> Planifier maintenance</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Équipement', 'Modalité', 'Salle', 'Statut', 'Dernière maintenance', 'Prochaine maintenance', 'Disponibilité'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipment.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < equipment.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{e.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ backgroundColor: `${modalityColors[e.modality]}18`, color: modalityColors[e.modality] }}>{e.modality}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{e.room}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: eqStatusConfig[e.status].bg, color: eqStatusConfig[e.status].color }}>{e.status}</span></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{e.lastMaint}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-amber)' }}>{e.nextMaint}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden" style={{ maxWidth: '60px' }}>
                          <div className="h-full rounded-full" style={{ width: e.uptime, backgroundColor: parseFloat(e.uptime) >= 95 ? 'var(--shifa-green)' : 'var(--shifa-amber)' }} />
                        </div>
                        <span className="text-xs font-mono font-bold" style={{ color: parseFloat(e.uptime) >= 95 ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{e.uptime}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
