'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

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

const staticResults: AnalysisResult[] = [
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

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'sampling', label: 'Prélèvements', icon: 'BeakerIcon' },
  { key: 'analysis', label: 'Résultats', icon: 'ChartBarIcon' },
  { key: 'results', label: 'Supabase', icon: 'CircleStackIcon' },
  { key: 'quality', label: 'Contrôle qualité', icon: 'ShieldCheckIcon' },
];

export default function LabDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');
  const [dbResults, setDbResults] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    if (activeTab === 'results') {
      fetchLabResults();
    }
  }, [activeTab]);

  const fetchLabResults = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('lab_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setDbResults(data || []);
    } catch (err: any) {
      setDbError(err?.message || 'Erreur lors du chargement des résultats.');
    } finally {
      setDbLoading(false);
    }
  };

  const kpis = [
    { label: 'Demandes du jour', value: String(labRequests.length), icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
    { label: 'En analyse', value: String(labRequests.filter(r => r.status === 'en analyse').length), icon: 'BeakerIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Résultats validés', value: String(labRequests.filter(r => r.status === 'validé').length), icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
    { label: 'Résultats critiques', value: String(staticResults.filter(r => r.flag === 'critical').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #1a0533 0%, #5B2D8E 55%, #7B5EA7 100%)',
          boxShadow: '0 8px 32px rgba(91,45,142,0.3)',
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
              <Icon name="BeakerIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  Laboratoire d'analyses médicales
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Tableau de bord Labo
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Demandes, prélèvements, résultats et contrôle qualité analytique
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowDownTrayIcon" size={15} />
              Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#5B2D8E' }}>
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
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Demandes du jour</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouvelle demande</button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {labRequests.map((req) => (
              <div key={req.id} className="p-4 flex items-start justify-between gap-4 hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: priorityConfig[req.priority].bg }}>
                    <Icon name="BeakerIcon" size={16} style={{ color: priorityConfig[req.priority].color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{req.patient}</p>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{req.id}</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{req.doctor} · {req.date}</p>
                    <div className="flex flex-wrap gap-1">
                      {req.tests.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--shifa-surface)', color: 'var(--foreground)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: priorityConfig[req.priority].bg, color: priorityConfig[req.priority].color }}>
                    {priorityConfig[req.priority].label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusConfig[req.status]?.bg, color: statusConfig[req.status]?.color }}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sampling Tab */}
      {activeTab === 'sampling' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Suivi des prélèvements</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['ID', 'Patient', 'Type', 'Tube', 'Collecté', 'Technicien', 'Statut', 'Temp.'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specimens.map((sp, i) => (
                  <tr key={sp.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{sp.id}</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{sp.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{sp.type}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{sp.tube}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{sp.collected}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{sp.technician}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusConfig[sp.status]?.bg, color: statusConfig[sp.status]?.color }}>
                        {sp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{sp.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis Tab — static results */}
      {activeTab === 'analysis' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Résultats d'analyses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Patient', 'Analyse', 'Valeur', 'Unité', 'Référence', 'Flag'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staticResults.map((r, i) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{r.patient}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.test}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: flagConfig[r.flag].color }}>{r.value}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.unit}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.ref}</td>
                    <td className="px-4 py-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: flagConfig[r.flag].color }}>
                        {flagConfig[r.flag].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supabase Results Tab */}
      {activeTab === 'results' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Résultats Supabase (lab_results)</h3>
            <button onClick={fetchLabResults} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Icon name="ArrowPathIcon" size={13} className={dbLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>

          {dbLoading && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--shifa-blue)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des résultats…</p>
            </div>
          )}

          {!dbLoading && dbError && (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                <Icon name="ExclamationCircleIcon" size={24} style={{ color: 'var(--shifa-red)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-red)' }}>Erreur de chargement</p>
              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>{dbError}</p>
              <button onClick={fetchLabResults} className="btn-primary text-xs px-4 py-2">Réessayer</button>
            </div>
          )}

          {!dbLoading && !dbError && dbResults.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                <Icon name="CircleStackIcon" size={26} style={{ color: 'var(--shifa-blue)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>Aucun résultat en base</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>La table lab_results est vide pour le moment.</p>
            </div>
          )}

          {!dbLoading && !dbError && dbResults.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                    {['ID', 'Statut', 'Créé le'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dbResults.map((r: any, i: number) => (
                    <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{r.id?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.status || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quality Tab */}
      {activeTab === 'quality' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Contrôle qualité analytique</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                  {['Analyseur', 'Contrôle', 'Heure', 'Résultat', 'Cible', 'CV', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qcRecords.map((qc, i) => (
                  <tr key={qc.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--shifa-dark)' }}>{qc.analyzer}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{qc.control}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{qc.date}</td>
                    <td className="px-4 py-3 text-xs font-mono font-semibold" style={{ color: 'var(--foreground)' }}>{qc.result}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{qc.target}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{qc.cv}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: qcStatusConfig[qc.status].bg, color: qcStatusConfig[qc.status].color }}>
                        {qcStatusConfig[qc.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
