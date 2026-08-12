'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'intake' | 'triage' | 'queue' | 'assessment' | 'orders';

interface EmergencyPatient {
  id: string; name: string; age: number; sex: 'M' | 'F'; arrivalTime: string;
  motif: string; triage: 'P1' | 'P2' | 'P3' | 'P4'; status: 'triage' | 'attente' | 'en soins' | 'observation' | 'sortie';
  vitals: { ta: string; fc: number; spo2: number; temp: number; fr: number; };
  location: string; nurse: string; waitMin: number;
}

interface CareOrder { id: string; patient: string; type: 'médicament' | 'examen' | 'consultation' | 'acte'; description: string; priority: 'urgent' | 'normal'; status: 'prescrit' | 'en cours' | 'réalisé'; time: string; }

const emergencyPatients: EmergencyPatient[] = [
  { id: 'URG-001', name: 'Oumar Diallo', age: 58, sex: 'M', arrivalTime: '10:05', motif: 'Douleur thoracique aiguë irradiant bras gauche', triage: 'P1', status: 'en soins', vitals: { ta: '185/115', fc: 118, spo2: 94, temp: 37.2, fr: 22 }, location: 'Box 1', nurse: 'Inf. Camara', waitMin: 0 },
  { id: 'URG-002', name: 'Ibrahima Ba', age: 72, sex: 'M', arrivalTime: '10:18', motif: 'Déficit moteur hémicorps droit brutal', triage: 'P1', status: 'en soins', vitals: { ta: '200/120', fc: 88, spo2: 97, temp: 36.8, fr: 18 }, location: 'Box 2', nurse: 'Inf. Diallo', waitMin: 0 },
  { id: 'URG-003', name: 'Fatou Seck', age: 34, sex: 'F', arrivalTime: '10:32', motif: 'Dyspnée aiguë — asthme sévère', triage: 'P2', status: 'attente', vitals: { ta: '130/85', fc: 105, spo2: 88, temp: 37.5, fr: 28 }, location: 'Salle attente P2', nurse: 'Inf. Sarr', waitMin: 12 },
  { id: 'URG-004', name: 'Mariama Koné', age: 26, sex: 'F', arrivalTime: '10:45', motif: 'Fracture fermée jambe droite (chute)', triage: 'P3', status: 'attente', vitals: { ta: '118/76', fc: 92, spo2: 99, temp: 36.9, fr: 16 }, location: 'Salle attente P3', nurse: 'Inf. Ba', waitMin: 38 },
  { id: 'URG-005', name: 'Cheikh Fall', age: 45, sex: 'M', arrivalTime: '11:00', motif: 'Crise hyperglycémique — diabète connu', triage: 'P2', status: 'observation', vitals: { ta: '145/92', fc: 96, spo2: 98, temp: 37.1, fr: 17 }, location: 'Obs. 1', nurse: 'Inf. Camara', waitMin: 5 },
  { id: 'URG-006', name: 'Aïssatou Diop', age: 19, sex: 'F', arrivalTime: '11:15', motif: 'Plaie lacérée main droite', triage: 'P4', status: 'attente', vitals: { ta: '115/72', fc: 78, spo2: 99, temp: 36.7, fr: 15 }, location: 'Salle attente P4', nurse: 'Inf. Diallo', waitMin: 65 },
];

const careOrders: CareOrder[] = [
  { id: 'ORD-01', patient: 'Oumar Diallo', type: 'médicament', description: 'Aspirine 500mg IV + Héparine 5000UI SC', priority: 'urgent', status: 'en cours', time: '10:10' },
  { id: 'ORD-02', patient: 'Oumar Diallo', type: 'examen', description: 'ECG 12 dérivations + Troponine + NFS', priority: 'urgent', status: 'réalisé', time: '10:08' },
  { id: 'ORD-03', patient: 'Ibrahima Ba', type: 'examen', description: 'Scanner cérébral sans injection STAT', priority: 'urgent', status: 'en cours', time: '10:22' },
  { id: 'ORD-04', patient: 'Ibrahima Ba', type: 'consultation', description: 'Avis neurologie urgente', priority: 'urgent', status: 'prescrit', time: '10:25' },
  { id: 'ORD-05', patient: 'Fatou Seck', type: 'médicament', description: 'Salbutamol nébulisation + Corticoïdes IV', priority: 'urgent', status: 'prescrit', time: '10:35' },
  { id: 'ORD-06', patient: 'Cheikh Fall', type: 'médicament', description: 'Insuline rapide 10UI SC + Sérum physiologique 1L', priority: 'normal', status: 'en cours', time: '11:05' },
];

const triageConfig = {
  P1: { label: 'P1 — Immédiat', bg: 'rgba(239,68,68,0.15)', color: 'var(--shifa-red)', dot: '#ef4444', border: 'rgba(239,68,68,0.4)' },
  P2: { label: 'P2 — Urgent', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', dot: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  P3: { label: 'P3 — Semi-urgent', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', dot: '#0066ff', border: 'rgba(0,102,255,0.2)' },
  P4: { label: 'P4 — Non urgent', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)', dot: '#10b981', border: 'rgba(16,185,129,0.2)' },
};

const statusEmgConfig: Record<string, { bg: string; color: string }> = {
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

const orderTypeConfig: Record<string, { icon: string; color: string }> = {
  médicament: { icon: 'BeakerIcon', color: 'var(--shifa-purple)' },
  examen: { icon: 'MagnifyingGlassIcon', color: 'var(--shifa-blue)' },
  consultation: { icon: 'UserIcon', color: 'var(--shifa-cyan)' },
  acte: { icon: 'WrenchScrewdriverIcon', color: 'var(--shifa-amber)' },
};

const kpis = [
  { label: 'Patients présents', value: '6', icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'P1 — Critiques', value: '2', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'P2 — Urgents', value: '2', icon: 'BoltIcon', color: 'var(--shifa-amber)' },
  { label: 'En attente', value: '3', icon: 'ClockIcon', color: 'var(--shifa-amber)' },
  { label: 'Attente moy.', value: '28 min', icon: 'ClockIcon', color: 'var(--shifa-cyan)' },
  { label: 'Sorties aujourd\'hui', value: '14', icon: 'ArrowRightOnRectangleIcon', color: 'var(--shifa-green)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'intake', label: 'Accueil & Admission', icon: 'UserPlusIcon' },
  { key: 'triage', label: 'Triage', icon: 'FunnelIcon' },
  { key: 'queue', label: 'File d\'attente', icon: 'QueueListIcon' },
  { key: 'assessment', label: 'Évaluation clinique', icon: 'ClipboardDocumentListIcon' },
  { key: 'orders', label: 'Ordres de soins', icon: 'DocumentCheckIcon' },
];

export default function EmergencyDashboardContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('queue');
  const [selectedPatient, setSelectedPatient] = useState<EmergencyPatient>(emergencyPatients[0]);

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
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Triage · Soins · Orientation · Sortie</p>
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
      <div className="px-6 border-b flex gap-1" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-red)] text-[var(--shifa-red)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
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
                {[{ label: 'Nom complet', placeholder: 'Nom et prénom' }, { label: 'Âge', placeholder: 'Âge en années' }, { label: 'Motif de consultation', placeholder: 'Motif principal' }, { label: 'Mode d\'arrivée', placeholder: 'Ambulance / Seul / Famille' }].map(f => (
                  <div key={f.label} className={f.label === 'Motif de consultation' ? 'col-span-2' : ''}>
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
                {emergencyPatients.slice(0, 4).map(p => (
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
              const patients = emergencyPatients.filter(p => p.triage === level);
              return (
                <div key={level} className="card overflow-hidden">
                  <div className="px-4 py-3 border-b" style={{ borderColor: triageConfig[level].border, backgroundColor: triageConfig[level].bg }}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: triageConfig[level].color }}>{triageConfig[level].label}</span>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: triageConfig[level].dot }}>{patients.length}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {patients.length === 0 && <p className="text-xs text-center py-4" style={{ color: 'var(--muted-foreground)' }}>Aucun patient</p>}
                    {patients.map(p => (
                      <div key={p.id} className="p-3 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors" style={{ borderColor: 'var(--border)' }} onClick={() => { setSelectedPatient(p); setActiveTab('assessment'); }}>
                        <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.arrivalTime}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: statusEmgConfig[p.status].bg, color: statusEmgConfig[p.status].color }}>{p.status}</span>
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
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>File d'attente — Salle des urgences</h3>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Triés par priorité</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[...emergencyPatients].sort((a, b) => parseInt(a.triage[1]) - parseInt(b.triage[1])).map(p => (
                <div key={p.id} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => { setSelectedPatient(p); setActiveTab('assessment'); }}>
                  <div className="w-12 text-center">
                    <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: triageConfig[p.triage].bg, color: triageConfig[p.triage].color }}>{p.triage}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name} · {p.age} ans · {p.sex}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.motif}</p>
                  </div>
                  <div className="text-center w-24">
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Arrivée</p>
                    <p className="font-mono text-sm font-bold" style={{ color: 'var(--foreground)' }}>{p.arrivalTime}</p>
                  </div>
                  <div className="text-center w-24">
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Attente</p>
                    <p className="font-mono text-sm font-bold" style={{ color: p.waitMin > 30 ? 'var(--shifa-red)' : p.waitMin > 15 ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{p.waitMin} min</p>
                  </div>
                  <div className="text-center w-28">
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Localisation</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{p.location}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusEmgConfig[p.status].bg, color: statusEmgConfig[p.status].color }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ASSESSMENT */}
        {activeTab === 'assessment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-3">
              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: triageConfig[selectedPatient.triage].dot }}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.age} ans · {selectedPatient.sex} · {selectedPatient.id}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: triageConfig[selectedPatient.triage].bg, border: `1px solid ${triageConfig[selectedPatient.triage].border}` }}>
                  <p className="text-xs font-semibold" style={{ color: triageConfig[selectedPatient.triage].color }}>{triageConfig[selectedPatient.triage].label}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>{selectedPatient.motif}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'TA', value: selectedPatient.vitals.ta, unit: 'mmHg', alert: false },
                    { label: 'FC', value: selectedPatient.vitals.fc, unit: 'bpm', alert: selectedPatient.vitals.fc > 100 },
                    { label: 'SpO2', value: selectedPatient.vitals.spo2, unit: '%', alert: selectedPatient.vitals.spo2 < 95 },
                    { label: 'Temp.', value: selectedPatient.vitals.temp, unit: '°C', alert: selectedPatient.vitals.temp > 38 },
                    { label: 'FR', value: selectedPatient.vitals.fr, unit: '/min', alert: selectedPatient.vitals.fr > 20 },
                  ].map(v => (
                    <div key={v.label} className="p-2 rounded-xl text-center" style={{ backgroundColor: v.alert ? 'rgba(239,68,68,0.08)' : 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.label}</p>
                      <p className="font-bold text-sm" style={{ color: v.alert ? 'var(--shifa-red)' : 'var(--foreground)' }}>{v.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-4">
                <h4 className="font-semibold text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>ORIENTATION RAPIDE</h4>
                <div className="space-y-2">
                  {['Hospitalisation', 'Bloc opératoire', 'Réanimation', 'Sortie avec ordonnance'].map(o => (
                    <button key={o} className="w-full py-2 rounded-xl text-sm font-medium text-left px-3 hover:bg-muted transition-colors" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 card p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Évaluation clinique — {selectedPatient.name}</h3>
              <div className="space-y-3">
                {['Anamnèse & antécédents', 'Examen physique', 'Hypothèse diagnostique', 'Plan de prise en charge'].map((section, i) => (
                  <div key={section}>
                    <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{section.toUpperCase()}</label>
                    <textarea rows={i === 2 ? 2 : 3} className="w-full px-3 py-2 rounded-xl border text-sm resize-none" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                      defaultValue={i === 0 ? 'Patient de 58 ans, antécédents HTA et diabète type 2 sous traitement. Douleur thoracique depuis 45 min, irradiant bras gauche, sueurs froides.' : i === 1 ? 'TA 185/115 mmHg, FC 118 bpm, SpO2 94%. Douleur thoracique à la palpation. Auscultation cardiaque : tachycardie régulière. Poumons clairs.' : i === 2 ? 'Syndrome coronarien aigu (SCA) — STEMI suspecté' : 'ECG + Troponine STAT. Aspirine + Héparine. Appel cardiologue. Préparation salle de cathétérisme.'} />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Sauvegarder brouillon</button>
                  <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Valider évaluation</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Ordres de soins actifs</h3>
              <button className="btn-primary text-xs px-2.5 py-1 flex items-center gap-1"><Icon name="PlusIcon" size={12} /> Nouvel ordre</button>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {careOrders.map(o => (
                <div key={o.id} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${orderTypeConfig[o.type].color}18` }}>
                    <Icon name={orderTypeConfig[o.type].icon as any} size={14} style={{ color: orderTypeConfig[o.type].color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{o.description}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{o.patient} · {o.time}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs capitalize" style={{ backgroundColor: `${orderTypeConfig[o.type].color}18`, color: orderTypeConfig[o.type].color }}>{o.type}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: o.priority === 'urgent' ? 'rgba(239,68,68,0.12)' : 'rgba(0,102,255,0.08)', color: o.priority === 'urgent' ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>{o.priority}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: orderStatusConfig[o.status].bg, color: orderStatusConfig[o.status].color }}>{o.status}</span>
                  <button className="p-1 rounded hover:bg-muted"><Icon name="CheckCircleIcon" size={16} style={{ color: 'var(--shifa-green)' }} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
