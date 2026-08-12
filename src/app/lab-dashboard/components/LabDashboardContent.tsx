'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


type TabKey = 'requests' | 'sampling' | 'analysis' | 'results' | 'quality';

interface LabRequest { id: string; patient: string; age: number; doctor: string; tests: string[]; priority: 'urgent' | 'normal' | 'stat'; status: 'en attente' | 'prélevé' | 'en analyse' | 'validé' | 'livré'; date: string; }
interface Specimen { id: string; patient: string; type: string; tube: string; collected: string; technician: string; status: 'reçu' | 'en traitement' | 'analysé' | 'archivé'; temp: string; }
interface AnalysisResult { id: string; patient: string; test: string; value: string; unit: string; ref: string; flag: 'normal' | 'high' | 'low' | 'critical'; validator?: string; }
interface QCRecord { id: string; analyzer: string; control: string; date: string; result: string; target: string; cv: string; status: 'pass' | 'fail' | 'warning'; }

const labRequests: LabRequest[] = [
  { id: 'LR-001', patient: 'Oumar Diallo', age: 58, doctor: 'Dr. Sy', tests: ['NFS', 'CRP', 'Glycémie'], priority: 'urgent', status: 'en analyse', date: '10:15' },
  { id: 'LR-002', patient: 'Fatou Seck', age: 34, doctor: 'Dr. Ndiaye', tests: ['Bilan hépatique', 'TP/TCA'], priority: 'stat', status: 'prélevé', date: '10:32' },
  { id: 'LR-003', patient: 'Ibrahima Ba', age: 72, doctor: 'Dr. Diallo', tests: ['Ionogramme', 'Créatinine', 'Urée'], priority: 'normal', status: 'en attente', date: '11:00' },
  { id: 'LR-004', patient: 'Mariama Koné', age: 26, doctor: 'Dr. Fall', tests: ['β-HCG', 'NFS'], priority: 'normal', status: 'validé', date: '09:20' },
  { id: 'LR-005', patient: 'Cheikh Mbaye', age: 45, doctor: 'Dr. Sow', tests: ['HbA1c', 'Glycémie à jeun', 'Bilan lipidique'], priority: 'normal', status: 'livré', date: '08:45' },
  { id: 'LR-006', patient: 'Aïssatou Diop', age: 19, doctor: 'Dr. Traoré', tests: ['ECBU', 'Antibiogramme'], priority: 'urgent', status: 'en analyse', date: '11:20' },
];

const specimens: Specimen[] = [
  { id: 'SP-2401', patient: 'Oumar Diallo', type: 'Sang veineux', tube: 'EDTA + Sec', collected: '10:18', technician: 'Tech. Camara', status: 'en traitement', temp: '4°C' },
  { id: 'SP-2402', patient: 'Fatou Seck', type: 'Sang veineux', tube: 'Citrate', collected: '10:35', technician: 'Tech. Diallo', status: 'reçu', temp: 'Ambiante' },
  { id: 'SP-2403', patient: 'Aïssatou Diop', type: 'Urine', tube: 'Stérile', collected: '11:22', technician: 'Tech. Camara', status: 'en traitement', temp: '4°C' },
  { id: 'SP-2404', patient: 'Mariama Koné', type: 'Sang veineux', tube: 'Sec', collected: '09:22', technician: 'Tech. Sarr', status: 'analysé', temp: '4°C' },
  { id: 'SP-2405', patient: 'Cheikh Mbaye', type: 'Sang veineux', tube: 'EDTA + Fluorure', collected: '08:48', technician: 'Tech. Diallo', status: 'archivé', temp: '-20°C' },
];

const results: AnalysisResult[] = [
  { id: 'R-001', patient: 'Oumar Diallo', test: 'CRP', value: '48.2', unit: 'mg/L', ref: '< 5', flag: 'critical' },
  { id: 'R-002', patient: 'Oumar Diallo', test: 'Glycémie', value: '1.12', unit: 'g/L', ref: '0.70–1.10', flag: 'high' },
  { id: 'R-003', patient: 'Oumar Diallo', test: 'Leucocytes', value: '12.4', unit: 'G/L', ref: '4.0–10.0', flag: 'high' },
  { id: 'R-004', patient: 'Mariama Koné', test: 'β-HCG', value: '1240', unit: 'mUI/mL', ref: '< 5', flag: 'high' },
  { id: 'R-005', patient: 'Mariama Koné', test: 'Hémoglobine', value: '10.2', unit: 'g/dL', ref: '12.0–16.0', flag: 'low' },
  { id: 'R-006', patient: 'Cheikh Mbaye', test: 'HbA1c', value: '7.2', unit: '%', ref: '< 6.5', flag: 'high' },
  { id: 'R-007', patient: 'Cheikh Mbaye', test: 'LDL-Cholestérol', value: '1.42', unit: 'g/L', ref: '< 1.30', flag: 'high' },
  { id: 'R-008', patient: 'Ibrahima Ba', test: 'Créatinine', value: '88', unit: 'µmol/L', ref: '62–106', flag: 'normal' },
];

const qcRecords: QCRecord[] = [
  { id: 'QC-01', analyzer: 'Cobas c501', control: 'Niveau 1 (bas)', date: '08:00', result: '4.98', target: '5.00 ± 0.25', cv: '0.4%', status: 'pass' },
  { id: 'QC-02', analyzer: 'Cobas c501', control: 'Niveau 2 (normal)', date: '08:00', result: '10.12', target: '10.00 ± 0.50', cv: '1.2%', status: 'pass' },
  { id: 'QC-03', analyzer: 'Sysmex XN-1000', control: 'Niveau 1', date: '07:45', result: '5.82', target: '5.50 ± 0.30', cv: '5.8%', status: 'warning' },
  { id: 'QC-04', analyzer: 'Sysmex XN-1000', control: 'Niveau 2', date: '07:45', result: '9.10', target: '10.00 ± 0.40', cv: '9.0%', status: 'fail' },
  { id: 'QC-05', analyzer: 'Cobas e411', control: 'Niveau 1', date: '08:15', result: '1.01', target: '1.00 ± 0.05', cv: '1.0%', status: 'pass' },
];

const priorityConfig = {
  urgent: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Urgent' },
  stat: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'STAT' },
  normal: { bg: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)', label: 'Normal' },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  'en attente': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
  'prélevé': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
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

const kpis = [
  { label: 'Demandes du jour', value: '47', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)' },
  { label: 'En attente prélèvement', value: '8', icon: 'BeakerIcon', color: 'var(--shifa-amber)' },
  { label: 'En analyse', value: '14', icon: 'CpuChipIcon', color: 'var(--shifa-purple)' },
  { label: 'Résultats à valider', value: '6', icon: 'ClipboardDocumentCheckIcon', color: 'var(--shifa-cyan)' },
  { label: 'Résultats critiques', value: '2', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Livrés aujourd\'hui', value: '17', icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'sampling', label: 'Prélèvements & Spécimens', icon: 'BeakerIcon' },
  { key: 'analysis', label: 'Résultats & Validation', icon: 'ChartBarIcon' },
  { key: 'results', label: 'Ordonnances', icon: 'DocumentTextIcon' },
  { key: 'quality', label: 'Contrôle Qualité', icon: 'ShieldCheckIcon' },
];

export default function LabDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRequests = filterStatus === 'all' ? labRequests : labRequests.filter(r => r.status === filterStatus);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="BeakerIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Laboratoire d'Analyses</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tableau de bord — Lundi 10 août 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5">
              <Icon name="PrinterIcon" size={14} /> Rapport journalier
            </button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5">
              <Icon name="PlusIcon" size={14} /> Nouvelle demande
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k) => (
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
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-blue)] text-[var(--shifa-blue)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
          >
            <Icon name={t.icon as any} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Filtrer :</span>
              {['all', 'en attente', 'prélevé', 'en analyse', 'validé', 'livré'].map(s => (
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
                    {['Réf.', 'Patient', 'Médecin prescripteur', 'Analyses demandées', 'Priorité', 'Statut', 'Heure', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: i < filteredRequests.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{r.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{r.patient}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.age} ans</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.doctor}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.tests.map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: priorityConfig[r.priority].bg, color: priorityConfig[r.priority].color }}>{priorityConfig[r.priority].label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig[r.status].bg, color: statusConfig[r.status].color }}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1 rounded hover:bg-muted transition-colors" title="Voir"><Icon name="EyeIcon" size={14} style={{ color: 'var(--shifa-blue)' }} /></button>
                          <button className="p-1 rounded hover:bg-muted transition-colors" title="Prélever"><Icon name="BeakerIcon" size={14} style={{ color: 'var(--shifa-amber)' }} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SAMPLING TAB */}
        {activeTab === 'sampling' && (
          <div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Reçus', count: 12, color: 'var(--shifa-blue)' },
                { label: 'En traitement', count: 8, color: 'var(--shifa-amber)' },
                { label: 'Analysés', count: 21, color: 'var(--shifa-green)' },
                { label: 'Archivés', count: 6, color: 'var(--muted-foreground)' },
              ].map(s => (
                <div key={s.label} className="card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                    <Icon name="BeakerIcon" size={18} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Suivi des spécimens</h3>
                <button className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"><Icon name="QrCodeIcon" size={12} /> Scanner</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ID Spécimen', 'Patient', 'Type', 'Tube(s)', 'Collecté à', 'Technicien', 'Temp.', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specimens.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < specimens.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{s.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{s.patient}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{s.tube}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{s.collected}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.technician}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-cyan)' }}>{s.temp}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig[s.status].bg, color: statusConfig[s.status].color }}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYSIS / RESULTS TAB */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Résultats en attente de validation</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' }}>6 à valider</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Patient', 'Analyse', 'Résultat', 'Unité', 'Valeurs réf.', 'Flag', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', backgroundColor: r.flag === 'critical' ? 'rgba(239,68,68,0.04)' : 'transparent' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.test}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: flagConfig[r.flag].color }}>{r.value}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.unit}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.ref}</td>
                      <td className="px-4 py-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: flagConfig[r.flag].color }}>{flagConfig[r.flag].label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Valider</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Résultats critiques</h3>
              <div className="space-y-3">
                {results.filter(r => r.flag === 'critical').map(r => (
                  <div key={r.id} className="p-3 rounded-xl border" style={{ borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.06)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-red)' }} />
                      <span className="font-semibold text-sm" style={{ color: 'var(--shifa-red)' }}>Valeur critique</span>
                    </div>
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.test} : <strong style={{ color: 'var(--shifa-red)' }}>{r.value} {r.unit}</strong></p>
                    <button className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Notifier le médecin</button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>RÉPARTITION DES FLAGS</h4>
                {(['normal', 'high', 'low', 'critical'] as const).map(f => {
                  const count = results.filter(r => r.flag === f).length;
                  return (
                    <div key={f} className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: flagConfig[f].color }}>{flagConfig[f].label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / results.length) * 100}%`, backgroundColor: flagConfig[f].color }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {activeTab === 'results' && (
          <div className="card p-6 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
            <Icon name="DocumentTextIcon" size={40} style={{ color: 'var(--muted-foreground)' }} />
            <p className="mt-3 font-semibold" style={{ color: 'var(--foreground)' }}>Ordonnances & Prescriptions biologiques</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Accédez aux ordonnances liées aux demandes d'analyses</p>
            <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-lg">
              {labRequests.slice(0, 3).map(r => (
                <div key={r.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.doctor}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--shifa-blue)' }}>{r.tests.join(', ')}</p>
                  <button className="mt-2 w-full py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Voir</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUALITY CONTROL TAB */}
        {activeTab === 'quality' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Conformes', count: qcRecords.filter(q => q.status === 'pass').length, color: 'var(--shifa-green)' },
                { label: 'Avertissements', count: qcRecords.filter(q => q.status === 'warning').length, color: 'var(--shifa-amber)' },
                { label: 'Non conformes', count: qcRecords.filter(q => q.status === 'fail').length, color: 'var(--shifa-red)' },
              ].map(s => (
                <div key={s.label} className="card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                    <Icon name="ShieldCheckIcon" size={18} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.count}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Registre des contrôles qualité — Aujourd'hui</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Analyseur', 'Niveau de contrôle', 'Heure', 'Résultat obtenu', 'Cible ± tolérance', 'CV%', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qcRecords.map((q, i) => (
                    <tr key={q.id} style={{ borderBottom: i < qcRecords.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{q.analyzer}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{q.control}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{q.date}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: qcStatusConfig[q.status].color }}>{q.result}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{q.target}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: q.status === 'fail' ? 'var(--shifa-red)' : 'var(--foreground)' }}>{q.cv}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: qcStatusConfig[q.status].bg, color: qcStatusConfig[q.status].color }}>{qcStatusConfig[q.status].label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
