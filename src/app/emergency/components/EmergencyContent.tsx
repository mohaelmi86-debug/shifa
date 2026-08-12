'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'intake' | 'triage' | 'queue' | 'vitals' | 'assessment' | 'orders' | 'obs_beds' | 'discharge';

interface EmgPatient {
  id: string; name: string; age: number; sex: 'M' | 'F'; arrivalTime: string; motif: string;
  triage: 'P1' | 'P2' | 'P3' | 'P4'; status: 'triage' | 'attente' | 'en soins' | 'observation' | 'sortie';
  vitals: { ta: string; fc: number; spo2: number; temp: number; fr: number; douleur: number };
  location: string; nurse: string; waitMin: number; physician?: string;
}
interface CareOrder { id: string; patient: string; type: 'médicament' | 'examen' | 'consultation' | 'acte'; description: string; priority: 'urgent' | 'normal'; status: 'prescrit' | 'en cours' | 'réalisé'; time: string; }
interface ObsBed { id: string; patient?: string; status: 'libre' | 'occupé'; since?: string; reason?: string; vitalsOk?: boolean; }

const patients: EmgPatient[] = [
  { id: 'URG-001', name: 'Oumar Diallo', age: 58, sex: 'M', arrivalTime: '10:05', motif: 'Douleur thoracique aiguë irradiant bras gauche', triage: 'P1', status: 'en soins', vitals: { ta: '185/115', fc: 118, spo2: 94, temp: 37.2, fr: 22, douleur: 8 }, location: 'Box 1', nurse: 'Inf. Camara', waitMin: 0, physician: 'Dr. Ba' },
  { id: 'URG-002', name: 'Ibrahima Ba', age: 72, sex: 'M', arrivalTime: '10:18', motif: 'Déficit moteur hémicorps droit brutal', triage: 'P1', status: 'en soins', vitals: { ta: '200/120', fc: 88, spo2: 97, temp: 36.8, fr: 18, douleur: 4 }, location: 'Box 2', nurse: 'Inf. Diallo', waitMin: 0, physician: 'Dr. Diallo' },
  { id: 'URG-003', name: 'Fatou Seck', age: 34, sex: 'F', arrivalTime: '10:32', motif: 'Dyspnée aiguë — asthme sévère', triage: 'P2', status: 'attente', vitals: { ta: '130/85', fc: 105, spo2: 88, temp: 37.5, fr: 28, douleur: 5 }, location: 'Salle attente P2', nurse: 'Inf. Sarr', waitMin: 12 },
  { id: 'URG-004', name: 'Mariama Koné', age: 26, sex: 'F', arrivalTime: '10:45', motif: 'Fracture fermée jambe droite', triage: 'P3', status: 'attente', vitals: { ta: '118/76', fc: 92, spo2: 99, temp: 36.9, fr: 16, douleur: 7 }, location: 'Salle attente P3', nurse: 'Inf. Ba', waitMin: 38 },
  { id: 'URG-005', name: 'Cheikh Fall', age: 45, sex: 'M', arrivalTime: '11:00', motif: 'Crise hyperglycémique — diabète connu', triage: 'P2', status: 'observation', vitals: { ta: '145/92', fc: 96, spo2: 98, temp: 37.1, fr: 17, douleur: 3 }, location: 'Obs. 1', nurse: 'Inf. Camara', waitMin: 5, physician: 'Dr. Sow' },
  { id: 'URG-006', name: 'Aïssatou Diop', age: 19, sex: 'F', arrivalTime: '11:15', motif: 'Plaie lacérée main droite', triage: 'P4', status: 'attente', vitals: { ta: '115/72', fc: 78, spo2: 99, temp: 36.7, fr: 15, douleur: 4 }, location: 'Salle attente P4', nurse: 'Inf. Diallo', waitMin: 65 },
];

const careOrders: CareOrder[] = [
  { id: 'ORD-01', patient: 'Oumar Diallo', type: 'médicament', description: 'Aspirine 500mg IV + Héparine 5000UI SC', priority: 'urgent', status: 'en cours', time: '10:10' },
  { id: 'ORD-02', patient: 'Oumar Diallo', type: 'examen', description: 'ECG 12 dérivations + Troponine + NFS', priority: 'urgent', status: 'réalisé', time: '10:08' },
  { id: 'ORD-03', patient: 'Ibrahima Ba', type: 'examen', description: 'Scanner cérébral sans injection STAT', priority: 'urgent', status: 'en cours', time: '10:22' },
  { id: 'ORD-04', patient: 'Ibrahima Ba', type: 'consultation', description: 'Avis neurologie urgente', priority: 'urgent', status: 'prescrit', time: '10:25' },
  { id: 'ORD-05', patient: 'Fatou Seck', type: 'médicament', description: 'Salbutamol nébulisation + Corticoïdes IV', priority: 'urgent', status: 'prescrit', time: '10:35' },
  { id: 'ORD-06', patient: 'Cheikh Fall', type: 'médicament', description: 'Insuline rapide 10UI SC + Sérum physiologique 1L', priority: 'normal', status: 'en cours', time: '11:05' },
];

const obsBeds: ObsBed[] = [
  { id: 'OBS-1', patient: 'Cheikh Fall', status: 'occupé', since: '11:05', reason: 'Surveillance glycémique post-correction', vitalsOk: true },
  { id: 'OBS-2', status: 'libre' },
  { id: 'OBS-3', status: 'libre' },
  { id: 'OBS-4', patient: 'Moussa Traoré', status: 'occupé', since: '09:30', reason: 'Observation post-syncope', vitalsOk: false },
  { id: 'OBS-5', status: 'libre' },
  { id: 'OBS-6', status: 'libre' },
];

const triageConfig = {
  P1: { label: 'P1 — Immédiat', bg: 'rgba(239,68,68,0.15)', color: 'var(--shifa-red)', dot: '#ef4444', border: 'rgba(239,68,68,0.4)' },
  P2: { label: 'P2 — Urgent', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', dot: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  P3: { label: 'P3 — Semi-urgent', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', dot: '#0066ff', border: 'rgba(0,102,255,0.2)' },
  P4: { label: 'P4 — Non urgent', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)', dot: '#10b981', border: 'rgba(16,185,129,0.2)' },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  triage: { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
  attente: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'en soins': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
  observation: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  sortie: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const orderStatusConfig: Record<string, { bg: string; color: string }> = {
  prescrit: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  'en cours': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  réalisé: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'intake', label: 'Accueil', icon: 'UserPlusIcon' },
  { key: 'triage', label: 'Triage', icon: 'FunnelIcon' },
  { key: 'queue', label: 'File d\'attente', icon: 'QueueListIcon' },
  { key: 'vitals', label: 'Constantes', icon: 'HeartIcon' },
  { key: 'assessment', label: 'Évaluation clinique', icon: 'ClipboardDocumentListIcon' },
  { key: 'orders', label: 'Ordres de soins', icon: 'DocumentCheckIcon' },
  { key: 'obs_beds', label: 'Lits observation', icon: 'HomeIcon' },
  { key: 'discharge', label: 'Sortie', icon: 'ArrowRightOnRectangleIcon' },
];

const kpis = [
  { label: 'Patients présents', value: String(patients.length), icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'P1 — Critiques', value: String(patients.filter(p => p.triage === 'P1').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'P2 — Urgents', value: String(patients.filter(p => p.triage === 'P2').length), icon: 'BoltIcon', color: 'var(--shifa-amber)' },
  { label: 'En attente', value: String(patients.filter(p => p.status === 'attente').length), icon: 'ClockIcon', color: 'var(--shifa-amber)' },
  { label: 'Lits obs. libres', value: String(obsBeds.filter(b => b.status === 'libre').length), icon: 'HomeIcon', color: 'var(--shifa-cyan)' },
  { label: 'Sorties aujourd\'hui', value: '14', icon: 'ArrowRightOnRectangleIcon', color: 'var(--shifa-green)' },
];

function VitalBadge({ label, value, unit, alert }: { label: string; value: string | number; unit: string; alert?: boolean }) {
  return (
    <div className="p-2 rounded-xl text-center" style={{ backgroundColor: alert ? 'rgba(239,68,68,0.08)' : 'var(--muted)', border: alert ? '1px solid rgba(239,68,68,0.2)' : 'none' }}>
      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
      <p className="text-base font-bold" style={{ color: alert ? 'var(--shifa-red)' : 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{unit}</p>
    </div>
  );
}

export default function EmergencyContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('queue');
  const [selectedPatient, setSelectedPatient] = useState<EmgPatient>(patients[0]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-red), var(--shifa-amber))' }}>
              <Icon name="BoltIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Service des Urgences</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Triage · Constantes · Évaluation · Observation · Sortie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--shifa-red)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>URGENCES OUVERTES</span>
            </div>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="UserPlusIcon" size={14} /> Nouveau patient</button>
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
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-red)] text-[var(--shifa-red)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* INTAKE */}
        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Enregistrement nouveau patient</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Nom complet', placeholder: 'Nom et prénom', span: false },
                  { label: 'Âge', placeholder: 'Âge en années', span: false },
                  { label: 'Motif de consultation', placeholder: 'Motif principal', span: true },
                  { label: 'Mode d\'arrivée', placeholder: 'Ambulance / Seul / Famille', span: false },
                  { label: 'Accompagnant / Contact', placeholder: 'Nom et téléphone', span: false },
                ].map(f => (
                  <div key={f.label} className={f.span ? 'col-span-2' : ''}>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{f.label.toUpperCase()}</label>
                    <input className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Enregistrer & Orienter vers triage</button>
            </div>
            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Admissions récentes</h3>
              <div className="space-y-2">
                {patients.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: triageConfig[p.triage].dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.arrivalTime}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: triageConfig[p.triage].bg, color: triageConfig[p.triage].color }}>{p.triage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRIAGE */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(['P1', 'P2', 'P3', 'P4'] as const).map(level => {
              const pts = patients.filter(p => p.triage === level);
              return (
                <div key={level} className="card overflow-hidden">
                  <div className="px-4 py-3 border-b" style={{ borderColor: triageConfig[level].border, backgroundColor: triageConfig[level].bg }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: triageConfig[level].color }}>{triageConfig[level].label}</span>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: triageConfig[level].dot }}>{pts.length}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {pts.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Aucun patient</p>}
                    {pts.map(p => (
                      <div key={p.id} className="p-3 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors" style={{ borderColor: 'var(--border)' }} onClick={() => { setSelectedPatient(p); setActiveTab('assessment'); }}>
                        <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.arrivalTime}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConfig[p.status].bg, color: statusConfig[p.status].color }}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>File d'attente — {patients.filter(p => p.status === 'attente').length} patients en attente</h3>
            </div>
            {patients.sort((a, b) => {
              const order = { P1: 0, P2: 1, P3: 2, P4: 3 };
              return order[a.triage] - order[b.triage];
            }).map((p, idx) => (
              <div key={p.id} className="card p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => { setSelectedPatient(p); setActiveTab('assessment'); }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: triageConfig[p.triage].dot }}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: triageConfig[p.triage].bg, color: triageConfig[p.triage].color }}>{p.triage}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConfig[p.status].bg, color: statusConfig[p.status].color }}>{p.status}</span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>Arrivée {p.arrivalTime}</p>
                  <p className="text-xs" style={{ color: p.waitMin > 30 ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>{p.waitMin > 0 ? `Attente ${p.waitMin} min` : 'En cours'}</p>
                </div>
                <div className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{p.location}</div>
              </div>
            ))}
          </div>
        )}

        {/* VITALS */}
        {activeTab === 'vitals' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Surveillance des constantes vitales</h3>
            {patients.filter(p => p.status !== 'sortie').map(p => (
              <div key={p.id} className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: triageConfig[p.triage].dot }} />
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: triageConfig[p.triage].bg, color: triageConfig[p.triage].color }}>{p.triage}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.location}</span>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                  <VitalBadge label="TA" value={p.vitals.ta} unit="mmHg" alert={parseInt(p.vitals.ta) > 180} />
                  <VitalBadge label="FC" value={p.vitals.fc} unit="bpm" alert={p.vitals.fc > 110 || p.vitals.fc < 50} />
                  <VitalBadge label="SpO2" value={p.vitals.spo2} unit="%" alert={p.vitals.spo2 < 92} />
                  <VitalBadge label="Temp." value={p.vitals.temp} unit="°C" alert={p.vitals.temp > 38.5} />
                  <VitalBadge label="FR" value={p.vitals.fr} unit="/min" alert={p.vitals.fr > 25} />
                  <VitalBadge label="Douleur" value={`${p.vitals.douleur}/10`} unit="EVA" alert={p.vitals.douleur >= 7} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>Patients</h3>
              {patients.map(p => (
                <div key={p.id} className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedPatient.id === p.id ? 'border-[var(--shifa-red)]' : 'border-transparent hover:bg-muted/50'}`}
                  style={{ backgroundColor: selectedPatient.id === p.id ? 'rgba(239,68,68,0.06)' : 'var(--card)', borderColor: selectedPatient.id === p.id ? 'var(--shifa-red)' : 'var(--border)' }}
                  onClick={() => setSelectedPatient(p)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: triageConfig[p.triage].dot }} />
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                  </div>
                  <p className="text-xs mt-0.5 ml-4 truncate" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: triageConfig[selectedPatient.triage].dot }} />
                <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: triageConfig[selectedPatient.triage].bg, color: triageConfig[selectedPatient.triage].color }}>{selectedPatient.triage}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <VitalBadge label="TA" value={selectedPatient.vitals.ta} unit="mmHg" alert={parseInt(selectedPatient.vitals.ta) > 180} />
                <VitalBadge label="FC" value={selectedPatient.vitals.fc} unit="bpm" alert={selectedPatient.vitals.fc > 110} />
                <VitalBadge label="SpO2" value={selectedPatient.vitals.spo2} unit="%" alert={selectedPatient.vitals.spo2 < 92} />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>MOTIF DE CONSULTATION</label>
                <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{selectedPatient.motif}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>ÉVALUATION CLINIQUE</label>
                <textarea rows={4} className="w-full px-3 py-2 rounded-xl border text-sm resize-none" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} placeholder="Anamnèse, examen clinique, hypothèses diagnostiques..." />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Enregistrer évaluation</button>
                <button className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)', border: '1px solid var(--border)' }}>Prescrire</button>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Ordres de soins urgences</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvel ordre</button>
            </div>
            <div className="space-y-2">
              {careOrders.map(o => (
                <div key={o.id} className="card p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: o.priority === 'urgent' ? 'rgba(239,68,68,0.12)' : 'rgba(0,102,255,0.08)' }}>
                    <Icon name={o.type === 'médicament' ? 'BeakerIcon' : o.type === 'examen' ? 'MagnifyingGlassIcon' : o.type === 'consultation' ? 'UserIcon' : 'WrenchScrewdriverIcon'} size={16} style={{ color: o.priority === 'urgent' ? 'var(--shifa-red)' : 'var(--shifa-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{o.patient}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: o.priority === 'urgent' ? 'rgba(239,68,68,0.12)' : 'rgba(0,102,255,0.08)', color: o.priority === 'urgent' ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>{o.priority}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: orderStatusConfig[o.status].bg, color: orderStatusConfig[o.status].color }}>{o.status}</span>
                    <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>{o.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OBS BEDS */}
        {activeTab === 'obs_beds' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Lits d'observation</h3>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{obsBeds.filter(b => b.status === 'libre').length} libres · {obsBeds.filter(b => b.status === 'occupé').length} occupés</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {obsBeds.map(b => (
                <div key={b.id} className="card p-4 border-l-4" style={{ borderLeftColor: b.status === 'libre' ? 'var(--shifa-green)' : b.vitalsOk ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{b.id}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: b.status === 'libre' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: b.status === 'libre' ? 'var(--shifa-green)' : 'var(--shifa-red)' }}>{b.status}</span>
                  </div>
                  {b.patient ? (
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{b.patient}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis {b.since}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{b.reason}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.vitalsOk ? 'var(--shifa-green)' : 'var(--shifa-amber)' }} />
                        <span className="text-xs" style={{ color: b.vitalsOk ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{b.vitalsOk ? 'Constantes stables' : 'Surveillance renforcée'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Disponible</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DISCHARGE */}
        {activeTab === 'discharge' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Workflow de sortie</h3>
              <div className="space-y-3">
                {patients.filter(p => p.status === 'observation' || p.status === 'en soins').map(p => (
                  <div key={p.id} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusConfig[p.status].bg, color: statusConfig[p.status].color }}>{p.status}</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-green)' }}>Autoriser sortie</button>
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Hospitaliser</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Formulaire de sortie</h3>
              <div className="space-y-3">
                {[{ label: 'Patient', placeholder: 'Sélectionner patient' }, { label: 'Diagnostic de sortie', placeholder: 'Diagnostic final' }, { label: 'Traitement prescrit', placeholder: 'Médicaments et posologie' }, { label: 'Consignes de sortie', placeholder: 'Instructions pour le patient' }, { label: 'Suivi recommandé', placeholder: 'Médecin / Spécialiste / Délai' }].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{f.label.toUpperCase()}</label>
                    <input className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} placeholder={f.placeholder} />
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{ backgroundColor: 'var(--shifa-green)' }}>Valider la sortie</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
