'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'requests' | 'worklist' | 'dicom' | 'reports' | 'validation' | 'equipment' | 'maintenance';

interface ImagingRequest { id: string; patient: string; age: number; doctor: string; modality: string; exam: string; priority: 'urgent' | 'normal' | 'stat'; status: 'en attente' | 'planifié' | 'en cours' | 'réalisé' | 'validé'; date: string; }
interface WorklistItem { id: string; patient: string; time: string; modality: string; exam: string; room: string; technician: string; status: 'confirmé' | 'en salle' | 'terminé' | 'annulé'; accession: string; }
interface DicomItem { id: string; patient: string; dob: string; accession: string; modality: string; description: string; images: number; status: 'new' | 'read' | 'reported' | 'validated'; size: string; }
interface RadiologyReport { id: string; patient: string; exam: string; modality: string; radiologist: string; date: string; findings: string; conclusion: string; status: 'brouillon' | 'validé' | 'signé' | 'transmis'; }
interface Equipment { id: string; name: string; modality: string; room: string; status: 'opérationnel' | 'maintenance' | 'hors service'; lastMaint: string; nextMaint: string; uptime: string; serialNumber: string; }
interface MaintenanceAlert { id: string; equipment: string; type: 'préventive' | 'corrective'; description: string; dueDate: string; priority: 'haute' | 'normale' | 'basse'; status: 'planifiée' | 'en cours' | 'terminée' | 'en retard'; }

const imagingRequests: ImagingRequest[] = [
  { id: 'IMG-301', patient: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', modality: 'RX', exam: 'Radiographie thorax F+P', priority: 'urgent', status: 'en cours', date: '10:30' },
  { id: 'IMG-302', patient: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', modality: 'Echo', exam: 'Échographie abdominale', priority: 'normal', status: 'planifié', date: '11:00' },
  { id: 'IMG-303', patient: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', modality: 'TDM', exam: 'Scanner cérébral sans injection', priority: 'stat', status: 'en attente', date: '10:45' },
  { id: 'IMG-304', patient: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', modality: 'Echo', exam: 'Échographie obstétricale T2', priority: 'normal', status: 'validé', date: '09:00' },
  { id: 'IMG-305', patient: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', modality: 'IRM', exam: 'IRM genou droit', priority: 'normal', status: 'réalisé', date: '08:30' },
  { id: 'IMG-306', patient: 'Aïssatou Diop', age: 19, doctor: 'Dr. Traoré', modality: 'RX', exam: 'Radiographie main droite F+P', priority: 'urgent', status: 'en attente', date: '11:30' },
];

const worklist: WorklistItem[] = [
  { id: 'WL-01', patient: 'Oumar Diallo', time: '10:30', modality: 'RX', exam: 'Thorax F+P', room: 'Salle RX-1', technician: 'Tech. Camara', status: 'en salle', accession: 'ACC-2026-0891' },
  { id: 'WL-02', patient: 'Fatou Seck', time: '11:00', modality: 'Echo', exam: 'Abdominale', room: 'Salle Echo-2', technician: 'Tech. Diallo', status: 'confirmé', accession: 'ACC-2026-0892' },
  { id: 'WL-03', patient: 'Ibrahima Ba', time: '11:15', modality: 'TDM', exam: 'Cérébral', room: 'Salle TDM', technician: 'Tech. Sarr', status: 'confirmé', accession: 'ACC-2026-0893' },
  { id: 'WL-04', patient: 'Aminata Sow', time: '12:00', modality: 'IRM', exam: 'Colonne lombaire', room: 'Salle IRM', technician: 'Tech. Ba', status: 'confirmé', accession: 'ACC-2026-0894' },
  { id: 'WL-05', patient: 'Boubacar Koné', time: '14:30', modality: 'RX', exam: 'Bassin F', room: 'Salle RX-2', technician: 'Tech. Camara', status: 'confirmé', accession: 'ACC-2026-0895' },
];

const dicomWorklist: DicomItem[] = [
  { id: 'DCM-001', patient: 'Oumar Diallo', dob: '1968-03-15', accession: 'ACC-2026-0891', modality: 'CR', description: 'CHEST 2 VIEWS', images: 2, status: 'new', size: '4.2 MB' },
  { id: 'DCM-002', patient: 'Mariama Koné', dob: '2000-07-22', accession: 'ACC-2026-0890', modality: 'US', description: 'OB US 2ND TRIMESTER', images: 18, status: 'validated', size: '12.8 MB' },
  { id: 'DCM-003', patient: 'Cheikh Mbaye', dob: '1981-11-08', accession: 'ACC-2026-0889', modality: 'MR', description: 'KNEE MRI RIGHT', images: 124, status: 'reported', size: '248 MB' },
  { id: 'DCM-004', patient: 'Ibrahima Ba', dob: '1954-05-30', accession: 'ACC-2026-0888', modality: 'CT', description: 'HEAD CT W/O CONTRAST', images: 0, status: 'new', size: '—' },
  { id: 'DCM-005', patient: 'Fatou Seck', dob: '1992-04-12', accession: 'ACC-2026-0887', modality: 'US', description: 'ABDOMINAL US', images: 8, status: 'read', size: '6.4 MB' },
];

const radiologyReports: RadiologyReport[] = [
  { id: 'RPT-001', patient: 'Cheikh Mbaye', exam: 'IRM genou droit', modality: 'IRM', radiologist: 'Dr. Mbaye (Radiologue)', date: '10/08/2026', findings: 'Rupture partielle du ligament croisé antérieur. Épanchement articulaire modéré. Pas de lésion méniscale associée.', conclusion: 'Rupture partielle LCA droit. Recommandation : avis orthopédique.', status: 'signé' },
  { id: 'RPT-002', patient: 'Mariama Koné', exam: 'Échographie obstétricale T2', modality: 'Echo', radiologist: 'Dr. Faye (Radiologue)', date: '10/08/2026', findings: 'Grossesse évolutive de 28 SA. Biométrie concordante. Placenta antérieur grade I. Liquide amniotique normal.', conclusion: 'Grossesse évolutive normale à 28 SA. Prochain contrôle à 32 SA.', status: 'transmis' },
  { id: 'RPT-003', patient: 'Oumar Diallo', exam: 'Radiographie thorax F+P', modality: 'RX', radiologist: 'Dr. Mbaye (Radiologue)', date: '10/08/2026', findings: '', conclusion: '', status: 'brouillon' },
];

const equipment: Equipment[] = [
  { id: 'EQ-01', name: 'Siemens SOMATOM Definition AS', modality: 'TDM', room: 'Salle TDM', status: 'opérationnel', lastMaint: '15/07/2026', nextMaint: '15/10/2026', uptime: '98.2%', serialNumber: 'SN-TDM-2021-0441' },
  { id: 'EQ-02', name: 'GE Signa Architect 3T', modality: 'IRM', room: 'Salle IRM', status: 'opérationnel', lastMaint: '01/08/2026', nextMaint: '01/11/2026', uptime: '96.5%', serialNumber: 'SN-IRM-2020-0218' },
  { id: 'EQ-03', name: 'Philips DigitalDiagnost C90', modality: 'RX', room: 'Salle RX-1', status: 'opérationnel', lastMaint: '20/07/2026', nextMaint: '20/10/2026', uptime: '99.1%', serialNumber: 'SN-RX1-2022-0315' },
  { id: 'EQ-04', name: 'Siemens Multix Fusion', modality: 'RX', room: 'Salle RX-2', status: 'maintenance', lastMaint: '10/08/2026', nextMaint: '10/09/2026', uptime: '87.3%', serialNumber: 'SN-RX2-2019-0112' },
  { id: 'EQ-05', name: 'GE LOGIQ E10', modality: 'Echo', room: 'Salle Echo-1', status: 'opérationnel', lastMaint: '05/08/2026', nextMaint: '05/11/2026', uptime: '99.8%', serialNumber: 'SN-ECH-2023-0507' },
];

const maintenanceAlerts: MaintenanceAlert[] = [
  { id: 'MA-01', equipment: 'Siemens Multix Fusion (RX-2)', type: 'corrective', description: 'Remplacement détecteur panneau plat — défaut pixels', dueDate: '10/09/2026', priority: 'haute', status: 'en cours' },
  { id: 'MA-02', equipment: 'Siemens SOMATOM Definition AS (TDM)', type: 'préventive', description: 'Révision annuelle — calibration tube RX', dueDate: '15/10/2026', priority: 'normale', status: 'planifiée' },
  { id: 'MA-03', equipment: 'GE Signa Architect 3T (IRM)', type: 'préventive', description: 'Contrôle hélium liquide et gradient', dueDate: '01/11/2026', priority: 'normale', status: 'planifiée' },
  { id: 'MA-04', equipment: 'Philips DigitalDiagnost C90 (RX-1)', type: 'préventive', description: 'Révision trimestrielle — contrôle qualité image', dueDate: '20/10/2026', priority: 'basse', status: 'planifiée' },
  { id: 'MA-05', equipment: 'GE LOGIQ E10 (Echo-1)', type: 'préventive', description: 'Nettoyage sondes et mise à jour logicielle', dueDate: '05/09/2026', priority: 'basse', status: 'en retard' },
];

const modalityColors: Record<string, string> = {
  RX: 'var(--shifa-blue)', Echo: 'var(--shifa-cyan)', TDM: 'var(--shifa-purple)', IRM: 'var(--shifa-amber)',
  CR: 'var(--shifa-blue)', US: 'var(--shifa-cyan)', MR: 'var(--shifa-amber)', CT: 'var(--shifa-purple)',
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

const maintAlertConfig = {
  planifiée: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'en cours': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  terminée: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'en retard': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const maintPriorityConfig = {
  haute: { color: 'var(--shifa-red)' },
  normale: { color: 'var(--shifa-amber)' },
  basse: { color: 'var(--shifa-blue)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'worklist', label: 'Worklist', icon: 'CalendarDaysIcon' },
  { key: 'dicom', label: 'DICOM', icon: 'PhotoIcon' },
  { key: 'reports', label: 'Comptes rendus', icon: 'DocumentTextIcon' },
  { key: 'validation', label: 'Validation', icon: 'ShieldCheckIcon' },
  { key: 'equipment', label: 'Équipements', icon: 'CpuChipIcon' },
  { key: 'maintenance', label: 'Maintenance', icon: 'WrenchScrewdriverIcon' },
];

const kpis = [
  { label: 'Demandes du jour', value: String(imagingRequests.length), icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
  { label: 'STAT en attente', value: String(imagingRequests.filter(r => r.priority === 'stat' && r.status === 'en attente').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Worklist aujourd\'hui', value: String(worklist.length), icon: 'CalendarDaysIcon', color: 'var(--shifa-cyan)' },
  { label: 'DICOM à lire', value: String(dicomWorklist.filter(d => d.status === 'new').length), icon: 'PhotoIcon', color: 'var(--shifa-amber)' },
  { label: 'Rapports à valider', value: String(radiologyReports.filter(r => r.status === 'brouillon').length), icon: 'DocumentTextIcon', color: 'var(--shifa-purple)' },
  { label: 'Alertes maintenance', value: String(maintenanceAlerts.filter(m => m.status === 'en retard' || m.status === 'en cours').length), icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-red)' },
];

export default function ImagingLMSContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');
  const [selectedReport, setSelectedReport] = useState<RadiologyReport | null>(null);

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
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Imagerie LMS</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Demandes · Worklist · DICOM · Rapports · Équipements · Maintenance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PrinterIcon" size={14} /> Rapport</button>
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
      <div className="px-6 border-b flex gap-1 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-purple)] text-[var(--shifa-purple)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patient', 'Prescripteur', 'Modalité', 'Examen', 'Priorité', 'Statut', 'Heure'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imagingRequests.map((r, i) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < imagingRequests.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{r.id}</td>
                    <td className="px-4 py-3"><p className="font-medium" style={{ color: 'var(--foreground)' }}>{r.patient}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.age} ans</p></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.doctor}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${modalityColors[r.modality]}18`, color: modalityColors[r.modality] }}>{r.modality}</span></td>
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

        {/* WORKLIST */}
        {activeTab === 'worklist' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Worklist du jour — {worklist.length} examens planifiés</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Planifier examen</button>
            </div>
            <div className="space-y-2">
              {worklist.map(w => (
                <div key={w.id} className="card p-4 flex items-center gap-4">
                  <div className="text-center w-14 shrink-0">
                    <p className="text-lg font-bold" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-display)' }}>{w.time}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${modalityColors[w.modality]}18`, color: modalityColors[w.modality] }}>{w.modality}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{w.patient}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: aptStatusConfig[w.status].bg, color: aptStatusConfig[w.status].color }}>{w.status}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{w.exam} · {w.room} · {w.technician}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{w.accession}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DICOM */}
        {activeTab === 'dicom' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Préparation DICOM — Worklist radiologie</h3>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ID DICOM', 'Patient', 'Date naissance', 'Accession', 'Modalité', 'Description', 'Images', 'Taille', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dicomWorklist.map((d, i) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < dicomWorklist.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{d.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{d.patient}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.dob}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{d.accession}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${modalityColors[d.modality]}18`, color: modalityColors[d.modality] }}>{d.modality}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{d.description}</td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{d.images || '—'}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.size}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: dicomStatusConfig[d.status].bg, color: dicomStatusConfig[d.status].color }}>{dicomStatusConfig[d.status].label}</span></td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>Ouvrir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Comptes rendus radiologiques</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouveau compte rendu</button>
            </div>
            <div className="space-y-3">
              {radiologyReports.map(r => (
                <div key={r.id} className="card p-5 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setSelectedReport(r)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{r.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${modalityColors[r.modality]}18`, color: modalityColors[r.modality] }}>{r.modality}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: r.status === 'signé' || r.status === 'transmis' ? 'rgba(16,185,129,0.12)' : r.status === 'validé' ? 'rgba(0,102,255,0.10)' : 'rgba(245,158,11,0.12)', color: r.status === 'signé' || r.status === 'transmis' ? 'var(--shifa-green)' : r.status === 'validé' ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }}>{r.status}</span>
                      </div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{r.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.exam} · {r.radiologist} · {r.date}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>Modifier</button>
                      {r.status === 'brouillon' && <button className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Valider</button>}
                    </div>
                  </div>
                  {r.findings && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>RÉSULTATS</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>{r.findings}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>CONCLUSION</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>{r.conclusion}</p>
                      </div>
                    </div>
                  )}
                  {!r.findings && (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Compte rendu en cours de rédaction...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VALIDATION */}
        {activeTab === 'validation' && (
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Validation radiologique — Examens à valider</h3>
            <div className="space-y-3">
              {dicomWorklist.filter(d => d.status === 'reported' || d.status === 'new').map(d => (
                <div key={d.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{d.accession}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${modalityColors[d.modality]}18`, color: modalityColors[d.modality] }}>{d.modality}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: dicomStatusConfig[d.status].bg, color: dicomStatusConfig[d.status].color }}>{dicomStatusConfig[d.status].label}</span>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{d.patient}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.description} · {d.images} images · {d.size}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="text-xs px-3 py-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)', border: '1px solid var(--border)' }}>Voir images</button>
                      {d.status === 'reported' && <button className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Valider</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EQUIPMENT */}
        {activeTab === 'equipment' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Registre des équipements d'imagerie</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Ajouter équipement</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {equipment.map(eq => (
                <div key={eq.id} className="card p-4 border-l-4" style={{ borderLeftColor: eqStatusConfig[eq.status].color }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{eq.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{eq.room} · S/N: {eq.serialNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${modalityColors[eq.modality]}18`, color: modalityColors[eq.modality] }}>{eq.modality}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: eqStatusConfig[eq.status].bg, color: eqStatusConfig[eq.status].color }}>{eq.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold" style={{ color: 'var(--shifa-green)' }}>{eq.uptime}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponibilité</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{eq.lastMaint}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière maint.</p>
                    </div>
                    <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-mono" style={{ color: 'var(--shifa-amber)' }}>{eq.nextMaint}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochaine maint.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Alertes & Planification maintenance</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Planifier intervention</button>
            </div>
            <div className="space-y-3">
              {maintenanceAlerts.map(m => (
                <div key={m.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: m.type === 'corrective' ? 'rgba(239,68,68,0.12)' : 'rgba(0,102,255,0.10)', color: m.type === 'corrective' ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>{m.type}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: maintAlertConfig[m.status].bg, color: maintAlertConfig[m.status].color }}>{m.status}</span>
                        <span className="text-xs font-semibold" style={{ color: maintPriorityConfig[m.priority].color }}>Priorité {m.priority}</span>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{m.equipment}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{m.description}</p>
                      <p className="text-xs mt-1" style={{ color: m.status === 'en retard' ? 'var(--shifa-red)' : 'var(--muted-foreground)' }}>Échéance: {m.dueDate}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {m.status === 'planifiée' && <button className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Démarrer</button>}
                      {m.status === 'en cours' && <button className="text-xs px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Terminer</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
