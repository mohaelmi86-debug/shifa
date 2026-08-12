'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'requests' | 'specimens' | 'preanalysis' | 'analysis' | 'qr_tracking' | 'quality' | 'inventory' | 'reagents';

interface LabRequest { id: string; patient: string; age: number; doctor: string; tests: string[]; priority: 'urgent' | 'normal' | 'stat'; status: 'en attente' | 'prélevé' | 'pré-analyse' | 'en analyse' | 'validé' | 'livré'; date: string; qrCode: string; }
interface Specimen { id: string; patient: string; type: string; tube: string; collected: string; technician: string; status: 'reçu' | 'en traitement' | 'analysé' | 'archivé'; temp: string; qrCode: string; }
interface PreAnalysis { id: string; specimenId: string; patient: string; check: string; result: 'conforme' | 'non conforme' | 'à vérifier'; notes?: string; }
interface AnalysisResult { id: string; patient: string; test: string; value: string; unit: string; ref: string; flag: 'normal' | 'high' | 'low' | 'critical'; validator?: string; }
interface QCRecord { id: string; analyzer: string; control: string; date: string; result: string; target: string; cv: string; status: 'pass' | 'fail' | 'warning'; }
interface InventoryItem { id: string; name: string; category: string; stock: number; minStock: number; unit: string; expiry: string; supplier: string; status: 'ok' | 'low' | 'critical' | 'expired'; }
interface Reagent { id: string; name: string; analyzer: string; lotNumber: string; expiry: string; openedDate?: string; remaining: number; unit: string; status: 'ok' | 'low' | 'expired'; }

const labRequests: LabRequest[] = [
  { id: 'LR-001', patient: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', tests: ['NFS', 'CRP', 'Glycémie'], priority: 'urgent', status: 'en analyse', date: '10:15', qrCode: 'QR-LR001-2026' },
  { id: 'LR-002', patient: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', tests: ['Bilan hépatique', 'TP/TCA'], priority: 'stat', status: 'prélevé', date: '10:32', qrCode: 'QR-LR002-2026' },
  { id: 'LR-003', patient: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', tests: ['Ionogramme', 'Créatinine', 'Urée'], priority: 'normal', status: 'en attente', date: '11:00', qrCode: 'QR-LR003-2026' },
  { id: 'LR-004', patient: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', tests: ['β-HCG', 'NFS'], priority: 'normal', status: 'validé', date: '09:20', qrCode: 'QR-LR004-2026' },
  { id: 'LR-005', patient: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', tests: ['HbA1c', 'Glycémie à jeun', 'Bilan lipidique'], priority: 'normal', status: 'livré', date: '08:45', qrCode: 'QR-LR005-2026' },
  { id: 'LR-006', patient: 'Aïssatou Diop', age: 19, doctor: 'Dr. Traoré', tests: ['ECBU', 'Antibiogramme'], priority: 'urgent', status: 'pré-analyse', date: '11:20', qrCode: 'QR-LR006-2026' },
];

const specimens: Specimen[] = [
  { id: 'SP-2401', patient: 'Oumar Diallo', type: 'Sang veineux', tube: 'EDTA + Sec', collected: '10:18', technician: 'Tech. Camara', status: 'en traitement', temp: '4°C', qrCode: 'QR-SP2401' },
  { id: 'SP-2402', patient: 'Fatou Seck', type: 'Sang veineux', tube: 'Citrate', collected: '10:35', technician: 'Tech. Diallo', status: 'reçu', temp: 'Ambiante', qrCode: 'QR-SP2402' },
  { id: 'SP-2403', patient: 'Aïssatou Diop', type: 'Urine', tube: 'Stérile', collected: '11:22', technician: 'Tech. Camara', status: 'en traitement', temp: '4°C', qrCode: 'QR-SP2403' },
  { id: 'SP-2404', patient: 'Mariama Koné', type: 'Sang veineux', tube: 'Sec', collected: '09:22', technician: 'Tech. Sarr', status: 'analysé', temp: '4°C', qrCode: 'QR-SP2404' },
  { id: 'SP-2405', patient: 'Cheikh Mbaye', type: 'Sang veineux', tube: 'EDTA + Fluorure', collected: '08:48', technician: 'Tech. Diallo', status: 'archivé', temp: '-20°C', qrCode: 'QR-SP2405' },
];

const preAnalysisChecks: PreAnalysis[] = [
  { id: 'PA-01', specimenId: 'SP-2401', patient: 'Oumar Diallo', check: 'Hémolyse visible', result: 'conforme', notes: 'Aucune hémolyse détectée' },
  { id: 'PA-02', specimenId: 'SP-2401', patient: 'Oumar Diallo', check: 'Volume suffisant', result: 'conforme' },
  { id: 'PA-03', specimenId: 'SP-2401', patient: 'Oumar Diallo', check: 'Étiquetage correct', result: 'conforme' },
  { id: 'PA-04', specimenId: 'SP-2402', patient: 'Fatou Seck', check: 'Coagulation tube citrate', result: 'à vérifier', notes: 'Délai de transport > 2h' },
  { id: 'PA-05', specimenId: 'SP-2402', patient: 'Fatou Seck', check: 'Volume suffisant', result: 'non conforme', notes: 'Volume insuffisant — prélèvement à refaire' },
  { id: 'PA-06', specimenId: 'SP-2403', patient: 'Aïssatou Diop', check: 'Contamination urine', result: 'conforme' },
];

const results: AnalysisResult[] = [
  { id: 'R-001', patient: 'Oumar Diallo', test: 'CRP', value: '48.2', unit: 'mg/L', ref: '< 5', flag: 'critical', validator: 'Dr. Sy' },
  { id: 'R-002', patient: 'Oumar Diallo', test: 'Glycémie', value: '1.12', unit: 'g/L', ref: '0.70–1.10', flag: 'high' },
  { id: 'R-003', patient: 'Oumar Diallo', test: 'Leucocytes', value: '12.4', unit: 'G/L', ref: '4.0–10.0', flag: 'high' },
  { id: 'R-004', patient: 'Mariama Koné', test: 'β-HCG', value: '1240', unit: 'mUI/mL', ref: '< 5', flag: 'high', validator: 'Dr. Fall' },
  { id: 'R-005', patient: 'Mariama Koné', test: 'Hémoglobine', value: '10.2', unit: 'g/dL', ref: '12.0–16.0', flag: 'low' },
  { id: 'R-006', patient: 'Cheikh Mbaye', test: 'HbA1c', value: '7.2', unit: '%', ref: '< 6.5', flag: 'high', validator: 'Dr. Sow' },
];

const qcRecords: QCRecord[] = [
  { id: 'QC-01', analyzer: 'Cobas c501', control: 'Niveau 1 (bas)', date: '08:00', result: '4.98', target: '5.00 ± 0.25', cv: '0.4%', status: 'pass' },
  { id: 'QC-02', analyzer: 'Cobas c501', control: 'Niveau 2 (normal)', date: '08:00', result: '10.12', target: '10.00 ± 0.50', cv: '1.2%', status: 'pass' },
  { id: 'QC-03', analyzer: 'Sysmex XN-1000', control: 'Niveau 1', date: '07:45', result: '5.82', target: '5.50 ± 0.30', cv: '5.8%', status: 'warning' },
  { id: 'QC-04', analyzer: 'Sysmex XN-1000', control: 'Niveau 2', date: '07:45', result: '9.10', target: '10.00 ± 0.40', cv: '9.0%', status: 'fail' },
  { id: 'QC-05', analyzer: 'Cobas e411', control: 'Niveau 1', date: '08:15', result: '1.01', target: '1.00 ± 0.05', cv: '1.0%', status: 'pass' },
];

const inventory: InventoryItem[] = [
  { id: 'INV-01', name: 'Tubes EDTA 4mL', category: 'Consommables', stock: 450, minStock: 200, unit: 'unités', expiry: '2027-06-30', supplier: 'BD Vacutainer', status: 'ok' },
  { id: 'INV-02', name: 'Tubes citrate 2.7mL', category: 'Consommables', stock: 85, minStock: 100, unit: 'unités', expiry: '2027-03-15', supplier: 'BD Vacutainer', status: 'low' },
  { id: 'INV-03', name: 'Gants latex M', category: 'EPI', stock: 12, minStock: 50, unit: 'boîtes', expiry: '2028-01-01', supplier: 'Ansell', status: 'critical' },
  { id: 'INV-04', name: 'Lancettes stériles', category: 'Consommables', stock: 320, minStock: 100, unit: 'unités', expiry: '2026-07-01', supplier: 'Roche', status: 'expired' },
  { id: 'INV-05', name: 'Flacons hémoculture aérobie', category: 'Microbiologie', stock: 48, minStock: 30, unit: 'flacons', expiry: '2027-09-30', supplier: 'bioMérieux', status: 'ok' },
  { id: 'INV-06', name: 'Milieu CLED', category: 'Microbiologie', stock: 18, minStock: 20, unit: 'boîtes', expiry: '2026-12-31', supplier: 'bioMérieux', status: 'low' },
];

const reagents: Reagent[] = [
  { id: 'REA-01', name: 'Réactif CRP (Cobas c501)', analyzer: 'Cobas c501', lotNumber: 'LOT-2026-0441', expiry: '2026-12-31', openedDate: '2026-08-01', remaining: 68, unit: '%', status: 'ok' },
  { id: 'REA-02', name: 'Réactif Glycémie (Cobas c501)', analyzer: 'Cobas c501', lotNumber: 'LOT-2026-0442', expiry: '2026-11-30', openedDate: '2026-08-01', remaining: 45, unit: '%', status: 'ok' },
  { id: 'REA-03', name: 'Réactif NFS (Sysmex XN-1000)', analyzer: 'Sysmex XN-1000', lotNumber: 'LOT-2026-0215', expiry: '2026-09-15', openedDate: '2026-07-15', remaining: 22, unit: '%', status: 'low' },
  { id: 'REA-04', name: 'Réactif HbA1c (Cobas e411)', analyzer: 'Cobas e411', lotNumber: 'LOT-2026-0318', expiry: '2026-08-05', remaining: 5, unit: '%', status: 'expired' },
  { id: 'REA-05', name: 'Réactif Troponine (Cobas e411)', analyzer: 'Cobas e411', lotNumber: 'LOT-2026-0320', expiry: '2027-02-28', remaining: 80, unit: '%', status: 'ok' },
];

const priorityConfig = {
  urgent: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Urgent' },
  stat: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'STAT' },
  normal: { bg: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', label: 'Normal' },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'en attente': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
  'prélevé': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'pré-analyse': { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  'en analyse': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'validé': { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'livré': { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
  'reçu': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'en traitement': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'analysé': { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'archivé': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
};

const flagConfig = {
  normal: { color: 'var(--shifa-green)', label: 'N' },
  high: { color: 'var(--shifa-amber)', label: 'H' },
  low: { color: 'var(--shifa-blue)', label: 'L' },
  critical: { color: 'var(--shifa-red)', label: '!' },
};

const qcStatusConfig = {
  pass: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Conforme' },
  warning: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Avertissement' },
  fail: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Non conforme' },
};

const invStatusConfig = {
  ok: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'OK' },
  low: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Bas' },
  critical: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Critique' },
  expired: { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)', label: 'Expiré' },
};

const preAnalysisConfig = {
  conforme: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  'non conforme': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
  'à vérifier': { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'specimens', label: 'Spécimens', icon: 'BeakerIcon' },
  { key: 'preanalysis', label: 'Pré-analyse', icon: 'MagnifyingGlassIcon' },
  { key: 'analysis', label: 'Résultats', icon: 'ChartBarIcon' },
  { key: 'qr_tracking', label: 'Traçabilité QR', icon: 'QrCodeIcon' },
  { key: 'quality', label: 'Contrôle Qualité', icon: 'ShieldCheckIcon' },
  { key: 'inventory', label: 'Inventaire', icon: 'ArchiveBoxIcon' },
  { key: 'reagents', label: 'Réactifs', icon: 'CpuChipIcon' },
];

const kpis = [
  { label: 'Demandes du jour', value: '47', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
  { label: 'Pré-analyse en cours', value: String(preAnalysisChecks.filter(p => p.result === 'à vérifier').length), icon: 'MagnifyingGlassIcon', color: 'var(--shifa-purple)' },
  { label: 'En analyse', value: '14', icon: 'CpuChipIcon', color: 'var(--shifa-amber)' },
  { label: 'Résultats critiques', value: String(results.filter(r => r.flag === 'critical').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Stock critique', value: String(inventory.filter(i => i.status === 'critical' || i.status === 'expired').length), icon: 'ArchiveBoxIcon', color: 'var(--shifa-amber)' },
  { label: 'QC non conformes', value: String(qcRecords.filter(q => q.status === 'fail').length), icon: 'ShieldCheckIcon', color: 'var(--shifa-red)' },
];

export default function LaboratoryLMSContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');
  const [filterStatus, setFilterStatus] = useState('all');
  const [qrSearch, setQrSearch] = useState('');

  const filteredRequests = filterStatus === 'all' ? labRequests : labRequests.filter(r => r.status === filterStatus);
  const qrResult = qrSearch ? [...labRequests.map(r => ({ type: 'Demande', id: r.id, patient: r.patient, status: r.status, qr: r.qrCode })), ...specimens.map(s => ({ type: 'Spécimen', id: s.id, patient: s.patient, status: s.status, qr: s.qrCode }))].find(i => i.qr.toLowerCase().includes(qrSearch.toLowerCase())) : null;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="BeakerIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Laboratoire LMS</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Demandes · Spécimens · Pré-analyse · QR · QC · Inventaire · Réactifs</p>
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
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-blue)] text-[var(--shifa-blue)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Filtrer :</span>
              {['all', 'en attente', 'prélevé', 'pré-analyse', 'en analyse', 'validé', 'livré'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'text-white' : 'hover:bg-muted'}`}
                  style={filterStatus === s ? { backgroundColor: 'var(--shifa-blue)' } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {s === 'all' ? 'Tous' : s}
                </button>
              ))}
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Prescripteur', 'Analyses', 'Priorité', 'Statut', 'QR Code', 'Heure'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r, i) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < filteredRequests.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.id}</td>
                      <td className="px-4 py-3"><p className="font-medium" style={{ color: 'var(--foreground)' }}>{r.patient}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.age} ans</p></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.doctor}</td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{r.tests.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{t}</span>)}</div></td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: priorityConfig[r.priority].bg, color: priorityConfig[r.priority].color }}>{priorityConfig[r.priority].label}</span></td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig[r.status].bg, color: statusConfig[r.status].color }}>{r.status}</span></td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.qrCode}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SPECIMENS */}
        {activeTab === 'specimens' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Suivi des spécimens</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Enregistrer spécimen</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ID Spécimen', 'Patient', 'Type', 'Tube', 'Collecté', 'Technicien', 'Temp.', 'QR Code', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specimens.map((s, i) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < specimens.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--shifa-blue)' }}>{s.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{s.patient}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{s.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.tube}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.collected}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.technician}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-cyan)' }}>{s.temp}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.qrCode}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig[s.status].bg, color: statusConfig[s.status].color }}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRE-ANALYSIS */}
        {activeTab === 'preanalysis' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Validation pré-analytique</h3>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Conformes: {preAnalysisChecks.filter(p => p.result === 'conforme').length}</span>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' }}>À vérifier: {preAnalysisChecks.filter(p => p.result === 'à vérifier').length}</span>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' }}>Non conformes: {preAnalysisChecks.filter(p => p.result === 'non conforme').length}</span>
              </div>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Spécimen', 'Patient', 'Contrôle effectué', 'Résultat', 'Notes'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preAnalysisChecks.map((p, i) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < preAnalysisChecks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{p.id}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{p.specimenId}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.patient}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{p.check}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: preAnalysisConfig[p.result].bg, color: preAnalysisConfig[p.result].color }}>{p.result}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYSIS / RESULTS */}
        {activeTab === 'analysis' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Résultats & Validation biologique</h3>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patient', 'Analyse', 'Résultat', 'Unité', 'Valeurs de référence', 'Flag', 'Validé par'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: r.flag === 'critical' ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{r.test}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: flagConfig[r.flag].color }}>{r.value}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.unit}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.ref}</td>
                      <td className="px-4 py-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: flagConfig[r.flag].color }}>{flagConfig[r.flag].label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: r.validator ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{r.validator || 'En attente'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QR TRACKING */}
        {activeTab === 'qr_tracking' && (
          <div>
            <div className="card p-5 mb-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Recherche par QR Code</h3>
              <div className="flex gap-3">
                <input
                  className="flex-1 px-3 py-2 rounded-xl border text-sm"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                  placeholder="Scanner ou saisir le QR Code (ex: QR-LR001-2026)"
                  value={qrSearch}
                  onChange={e => setQrSearch(e.target.value)}
                />
                <button className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5"><Icon name="QrCodeIcon" size={14} /> Scanner</button>
              </div>
              {qrResult && (
                <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: 'var(--shifa-green)', backgroundColor: 'rgba(16,185,129,0.06)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="CheckCircleIcon" size={16} style={{ color: 'var(--shifa-green)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--shifa-green)' }}>Trouvé</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span style={{ color: 'var(--muted-foreground)' }}>Type: </span><span style={{ color: 'var(--foreground)' }}>{qrResult.type}</span></div>
                    <div><span style={{ color: 'var(--muted-foreground)' }}>ID: </span><span className="font-mono" style={{ color: 'var(--shifa-blue)' }}>{qrResult.id}</span></div>
                    <div><span style={{ color: 'var(--muted-foreground)' }}>Patient: </span><span style={{ color: 'var(--foreground)' }}>{qrResult.patient}</span></div>
                    <div><span style={{ color: 'var(--muted-foreground)' }}>Statut: </span><span style={{ color: 'var(--shifa-amber)' }}>{qrResult.status}</span></div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card p-4">
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Demandes — QR Codes</h4>
                <div className="space-y-2">
                  {labRequests.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{r.patient}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{r.qrCode}</p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConfig[r.status].bg, color: statusConfig[r.status].color }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Spécimens — QR Codes</h4>
                <div className="space-y-2">
                  {specimens.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{s.patient}</p>
                        <p className="text-xs font-mono" style={{ color: 'var(--shifa-cyan)' }}>{s.qrCode}</p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConfig[s.status].bg, color: statusConfig[s.status].color }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUALITY CONTROL */}
        {activeTab === 'quality' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Contrôle Qualité — Résultats du jour</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouveau QC</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Analyseur', 'Contrôle', 'Heure', 'Résultat', 'Cible', 'CV', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qcRecords.map((q, i) => (
                    <tr key={q.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < qcRecords.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{q.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{q.analyzer}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{q.control}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{q.date}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--foreground)' }}>{q.result}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{q.target}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: q.status === 'fail' ? 'var(--shifa-red)' : q.status === 'warning' ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{q.cv}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: qcStatusConfig[q.status].bg, color: qcStatusConfig[q.status].color }}>{qcStatusConfig[q.status].label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Inventaire consommables & EPI</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Ajouter article</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {inventory.map(item => (
                <div key={item.id} className="card p-4 border-l-4" style={{ borderLeftColor: invStatusConfig[item.status].color }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.category} · {item.supplier}</p>
                    </div>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: invStatusConfig[item.status].bg, color: invStatusConfig[item.status].color }}>{invStatusConfig[item.status].label}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: item.status === 'critical' || item.status === 'expired' ? 'var(--shifa-red)' : item.status === 'low' ? 'var(--shifa-amber)' : 'var(--shifa-green)', fontFamily: 'var(--font-display)' }}>{item.stock}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.unit} · Min: {item.minStock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Expiry</p>
                      <p className="text-xs font-mono" style={{ color: item.status === 'expired' ? 'var(--shifa-red)' : 'var(--foreground)' }}>{item.expiry}</p>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (item.stock / (item.minStock * 3)) * 100)}%`, backgroundColor: invStatusConfig[item.status].color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REAGENTS */}
        {activeTab === 'reagents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Gestion des réactifs</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Enregistrer réactif</button>
            </div>
            <div className="space-y-3">
              {reagents.map(r => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: invStatusConfig[r.status].bg, color: invStatusConfig[r.status].color }}>{invStatusConfig[r.status].label}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.analyzer} · Lot: {r.lotNumber}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Expiry: <span className="font-mono" style={{ color: r.status === 'expired' ? 'var(--shifa-red)' : 'var(--foreground)' }}>{r.expiry}</span></span>
                        {r.openedDate && <span>Ouvert: <span className="font-mono" style={{ color: 'var(--foreground)' }}>{r.openedDate}</span></span>}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold" style={{ color: r.remaining < 20 ? 'var(--shifa-red)' : r.remaining < 40 ? 'var(--shifa-amber)' : 'var(--shifa-green)', fontFamily: 'var(--font-display)' }}>{r.remaining}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>restant</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full rounded-full h-2" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${r.remaining}%`, backgroundColor: r.remaining < 20 ? 'var(--shifa-red)' : r.remaining < 40 ? 'var(--shifa-amber)' : 'var(--shifa-green)' }} />
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
