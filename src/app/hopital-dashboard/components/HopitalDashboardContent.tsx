'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime, useSupabaseCount } from '@/lib/hooks/useSupabaseRealtime';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Department {
  id: string;
  name: string;
  beds: number;
  occupied: number;
  available: number;
  critical: number;
  head: string;
  color: string;
}

interface EmergencyPatient {
  id: string;
  name: string;
  age: number;
  triage: 'P1' | 'P2' | 'P3' | 'P4';
  motif: string;
  waitMin: number;
  vitals: string;
  status: 'en attente' | 'en cours' | 'observation';
}

interface CriticalPatient {
  id: string;
  name: string;
  room: string;
  dept: string;
  condition: string;
  alert: string;
  since: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const departments: Department[] = [
  { id: 'd1', name: 'Médecine interne', beds: 40, occupied: 36, available: 4, critical: 3, head: 'Dr. Diallo', color: 'var(--shifa-blue)' },
  { id: 'd2', name: 'Chirurgie générale', beds: 30, occupied: 22, available: 8, critical: 1, head: 'Dr. Ndiaye', color: 'var(--shifa-purple)' },
  { id: 'd3', name: 'Pédiatrie', beds: 25, occupied: 18, available: 7, critical: 2, head: 'Dr. Sow', color: 'var(--shifa-green)' },
  { id: 'd4', name: 'Maternité', beds: 20, occupied: 17, available: 3, critical: 0, head: 'Dr. Faye', color: 'var(--shifa-cyan)' },
  { id: 'd5', name: 'Réanimation', beds: 12, occupied: 11, available: 1, critical: 8, head: 'Dr. Ba', color: 'var(--shifa-red)' },
  { id: 'd6', name: 'Urgences', beds: 18, occupied: 14, available: 4, critical: 4, head: 'Dr. Mbaye', color: 'var(--shifa-amber)' },
];

const emergencyQueue: EmergencyPatient[] = [
  { id: 'e1', name: 'Oumar Diallo', age: 58, triage: 'P1', motif: 'Douleur thoracique aiguë', waitMin: 0, vitals: 'TA: 180/110 · FC: 112', status: 'en cours' },
  { id: 'e2', name: 'Fatou Seck', age: 34, triage: 'P2', motif: 'Détresse respiratoire', waitMin: 8, vitals: 'SpO2: 88% · FR: 28', status: 'en attente' },
  { id: 'e3', name: 'Ibrahima Ndiaye', age: 72, triage: 'P2', motif: 'AVC suspecté', waitMin: 12, vitals: 'TA: 200/120 · Glasgow: 12', status: 'en attente' },
  { id: 'e4', name: 'Mariama Ba', age: 26, triage: 'P3', motif: 'Fracture membre inférieur', waitMin: 35, vitals: 'TA: 120/80 · FC: 88', status: 'observation' },
  { id: 'e5', name: 'Cheikh Fall', age: 45, triage: 'P3', motif: 'Crise hyperglycémique', waitMin: 42, vitals: 'Glycémie: 4.2 g/L', status: 'en attente' },
  { id: 'e6', name: 'Aïssatou Diop', age: 19, triage: 'P4', motif: 'Plaie superficielle', waitMin: 68, vitals: 'Stable', status: 'en attente' },
];

const criticalPatients: CriticalPatient[] = [
  { id: 'c1', name: 'Moussa Traoré', room: 'REA-03', dept: 'Réanimation', condition: 'Sepsis sévère', alert: 'Pression artérielle critique', since: '2h' },
  { id: 'c2', name: 'Aminata Coulibaly', room: 'REA-07', dept: 'Réanimation', condition: 'Insuffisance respiratoire', alert: 'SpO2 < 90% — ventilation assistée', since: '5h' },
  { id: 'c3', name: 'Boubacar Koné', room: 'MED-12', dept: 'Médecine interne', condition: 'Décompensation cardiaque', alert: 'Surveillance renforcée requise', since: '1h' },
  { id: 'c4', name: 'Rokhaya Sarr', room: 'URG-02', dept: 'Urgences', condition: 'Polytraumatisme', alert: 'Bilan chirurgical en cours', since: '30min' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const triageConfig = {
  P1: { label: 'P1 — Immédiat', bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', dot: '#ef4444' },
  P2: { label: 'P2 — Urgent', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', dot: '#f59e0b' },
  P3: { label: 'P3 — Semi-urgent', bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', dot: '#0066ff' },
  P4: { label: 'P4 — Non urgent', bg: 'rgba(16,185,129,0.10)', color: 'var(--shifa-green)', dot: '#10b981' },
};

const statusConfig = {
  'en cours': { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  'en attente': { bg: 'rgba(245,158,11,0.10)', color: 'var(--shifa-amber)' },
  'observation': { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' },
};

function OccupancyBar({ pct, color }: { pct: number; color: string }) {
  const bg = pct >= 90 ? 'var(--shifa-red)' : pct >= 75 ? 'var(--shifa-amber)' : color;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: bg }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HopitalDashboardContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'emergency' | 'departments' | 'critical'>('overview');

  // Live Supabase data
  const { count: totalPatients, loading: lPat } = useSupabaseCount('patients', { is_active: true });
  const { count: totalProfessionals, loading: lPro } = useSupabaseCount('professionals', { status: 'active' });
  const { count: totalDepts, loading: lDept } = useSupabaseCount('departments');
  const { data: liveAppointments, loading: lAppt } = useSupabaseRealtime({
    table: 'appointments',
    orderBy: { column: 'scheduled_at', ascending: false },
    limit: 100,
  });
  const { data: liveRecords, loading: lRec } = useSupabaseRealtime({
    table: 'health_records',
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = liveAppointments.filter((a: any) => a.scheduled_at?.startsWith(todayStr));
  const admissionsToday = todayAppts.filter((a: any) => a.status === 'confirmed' || a.status === 'in_progress').length;
  const completedToday = todayAppts.filter((a: any) => a.status === 'completed').length;
  const inProgressAppts = liveAppointments.filter((a: any) => a.status === 'in_progress').length;
  const pendingRecords = liveRecords.filter((r: any) => !r.is_signed).length;

  // Static department/emergency data (would be from DB in full implementation)
  const departments: Department[] = [
    { id: 'd1', name: 'Médecine interne', beds: 40, occupied: 36, available: 4, critical: 3, head: 'Dr. Diallo', color: 'var(--shifa-blue)' },
    { id: 'd2', name: 'Chirurgie générale', beds: 30, occupied: 22, available: 8, critical: 1, head: 'Dr. Ndiaye', color: 'var(--shifa-purple)' },
    { id: 'd3', name: 'Pédiatrie', beds: 25, occupied: 18, available: 7, critical: 2, head: 'Dr. Sow', color: 'var(--shifa-green)' },
    { id: 'd4', name: 'Maternité', beds: 20, occupied: 17, available: 3, critical: 0, head: 'Dr. Faye', color: 'var(--shifa-cyan)' },
    { id: 'd5', name: 'Réanimation', beds: 12, occupied: 11, available: 1, critical: 8, head: 'Dr. Ba', color: 'var(--shifa-red)' },
    { id: 'd6', name: 'Urgences', beds: 18, occupied: 14, available: 4, critical: 4, head: 'Dr. Mbaye', color: 'var(--shifa-amber)' },
  ];

  const emergencyQueue: EmergencyPatient[] = [
    { id: 'e1', name: 'Oumar Diallo', age: 58, triage: 'P1', motif: 'Douleur thoracique aiguë', waitMin: 0, vitals: 'TA: 180/110 · FC: 112', status: 'en cours' },
    { id: 'e2', name: 'Fatou Seck', age: 34, triage: 'P2', motif: 'Détresse respiratoire', waitMin: 8, vitals: 'SpO2: 88% · FR: 28', status: 'en attente' },
    { id: 'e3', name: 'Ibrahima Ndiaye', age: 72, triage: 'P2', motif: 'AVC suspecté', waitMin: 12, vitals: 'TA: 200/120 · Glasgow: 12', status: 'en attente' },
    { id: 'e4', name: 'Mariama Ba', age: 26, triage: 'P3', motif: 'Fracture membre inférieur', waitMin: 35, vitals: 'TA: 120/80 · FC: 88', status: 'observation' },
    { id: 'e5', name: 'Cheikh Fall', age: 45, triage: 'P3', motif: 'Crise hyperglycémique', waitMin: 42, vitals: 'Glycémie: 4.2 g/L', status: 'en attente' },
    { id: 'e6', name: 'Aïssatou Diop', age: 19, triage: 'P4', motif: 'Plaie superficielle', waitMin: 68, vitals: 'Stable', status: 'en attente' },
  ];

  const criticalPatients: CriticalPatient[] = [
    { id: 'c1', name: 'Moussa Traoré', room: 'REA-03', dept: 'Réanimation', condition: 'Sepsis sévère', alert: 'Pression artérielle critique', since: '2h' },
    { id: 'c2', name: 'Aminata Coulibaly', room: 'REA-07', dept: 'Réanimation', condition: 'Insuffisance respiratoire', alert: 'SpO2 < 90% — ventilation assistée', since: '5h' },
    { id: 'c3', name: 'Boubacar Koné', room: 'MED-12', dept: 'Médecine interne', condition: 'Décompensation cardiaque', alert: 'Surveillance renforcée requise', since: '1h' },
    { id: 'c4', name: 'Rokhaya Sarr', room: 'URG-02', dept: 'Urgences', condition: 'Polytraumatisme', alert: 'Bilan chirurgical en cours', since: '30min' },
  ];

  const totalBeds = departments.reduce((s, d) => s + d.beds, 0);
  const totalOccupied = departments.reduce((s, d) => s + d.occupied, 0);
  const totalAvailable = departments.reduce((s, d) => s + d.available, 0);
  const totalCritical = departments.reduce((s, d) => s + d.critical, 0);
  const occupancyPct = Math.round((totalOccupied / totalBeds) * 100);

  const tabs = [
    { id: 'overview', label: "Vue d\'ensemble", icon: 'Squares2X2Icon' },
    { id: 'emergency', label: "File d\'urgence", icon: 'ExclamationTriangleIcon', badge: emergencyQueue.filter(p => p.triage === 'P1' || p.triage === 'P2').length },
    { id: 'departments', label: 'Départements', icon: 'BuildingOffice2Icon' },
    { id: 'critical', label: 'Patients critiques', icon: 'HeartIcon', badge: criticalPatients.length },
  ] as const;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="BuildingOffice2Icon" size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>
              Tableau de bord — Hôpital
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            CHU Saint-Louis · Données en temps réel via Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Système opérationnel
          </span>
        </div>
      </div>

      {/* ── Live KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Patients actifs', value: lPat ? '…' : totalPatients.toString(), icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.06)', sub: 'Base de données live' },
          { label: "Taux d\'occupation", value: `${occupancyPct}%`, icon: 'ChartBarIcon', color: occupancyPct >= 90 ? 'var(--shifa-red)' : 'var(--shifa-amber)', bg: occupancyPct >= 90 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.06)', sub: `${totalOccupied} / ${totalBeds} lits`, alert: occupancyPct >= 85 },
          { label: "Admissions aujourd\'hui", value: lAppt ? '…' : admissionsToday.toString(), icon: 'UserPlusIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.06)', sub: 'RDV confirmés + en cours' },
          { label: 'Consultations terminées', value: lAppt ? '…' : completedToday.toString(), icon: 'CheckCircleIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.06)', sub: "Aujourd\'hui" },
          { label: 'Patients critiques', value: totalCritical.toString(), icon: 'HeartIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)', sub: 'Surveillance active', alert: true },
          { label: "File d\'urgence", value: emergencyQueue.length.toString(), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.06)', sub: `${emergencyQueue.filter(p => p.triage === 'P1').length} P1 · ${emergencyQueue.filter(p => p.triage === 'P2').length} P2` },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color }} />
              </div>
              {(kpi as any).alert && (
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--shifa-red)' }} />
              )}
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: 'var(--font-display)' }}>{kpi.value}</p>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Live stats bar ── */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl border text-xs" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--shifa-green)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Temps réel Supabase</span>
        </div>
        <span style={{ color: 'var(--muted-foreground)' }}>·</span>
        <span style={{ color: 'var(--muted-foreground)' }}>
          {lPro ? '…' : totalProfessionals} professionnels actifs
        </span>
        <span style={{ color: 'var(--muted-foreground)' }}>·</span>
        <span style={{ color: 'var(--muted-foreground)' }}>
          {lRec ? '…' : pendingRecords} dossiers en attente de signature
        </span>
        <span style={{ color: 'var(--muted-foreground)' }}>·</span>
        <span style={{ color: 'var(--muted-foreground)' }}>
          {lDept ? '…' : totalDepts} départements
        </span>
      </div>

      {/* ── Action Shortcuts ── */}
      <div className="rounded-xl border p-4 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>Actions rapides</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Nouvelle admission', icon: 'UserPlusIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
            { label: 'Planifier consultation', icon: 'CalendarDaysIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
            { label: 'Gérer les sorties', icon: 'ArrowRightOnRectangleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
            { label: 'Affecter un lit', icon: 'BuildingOffice2Icon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)' },
            { label: 'Urgence — Triage', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
            { label: 'Rapport journalier', icon: 'DocumentChartBarIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
          ].map((action, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: action.bg, color: action.color }}
            >
              <Icon name={action.icon as any} size={15} />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? 'border-current' : 'border-transparent hover:border-muted'}`}
            style={{ color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
            {(tab as any).badge > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold rounded-full text-white" style={{ backgroundColor: 'var(--shifa-red)', minWidth: '18px', textAlign: 'center' }}>
                {(tab as any).badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Bed Occupancy Visual */}
          <div className="xl:col-span-2 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Occupation des lits par département</h2>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: occupancyPct >= 90 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: occupancyPct >= 90 ? 'var(--shifa-red)' : 'var(--shifa-amber)' }}>
                {occupancyPct}% global
              </span>
            </div>
            <div className="space-y-4">
              {departments.map(dept => {
                const pct = Math.round((dept.occupied / dept.beds) * 100);
                return (
                  <div key={dept.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{dept.name}</span>
                        {dept.critical > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>
                            {dept.critical} critiques
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span>{dept.occupied}/{dept.beds} lits</span>
                        <span className="font-bold" style={{ color: pct >= 90 ? 'var(--shifa-red)' : pct >= 75 ? 'var(--shifa-amber)' : dept.color }}>{pct}%</span>
                      </div>
                    </div>
                    <OccupancyBar pct={pct} color={dept.color} />
                    <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>{dept.available} lit{dept.available > 1 ? 's' : ''} disponible{dept.available > 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>Chef: {dept.head}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Critical + Emergency summary */}
          <div className="flex flex-col gap-4">
            {/* Critical alert */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                  <Icon name="HeartIcon" size={14} style={{ color: 'var(--shifa-red)' }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Patients critiques</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>{criticalPatients.length}</span>
              </div>
              <div className="space-y-2">
                {criticalPatients.slice(0, 3).map(p => (
                  <div key={p.id} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.04)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse" style={{ backgroundColor: 'var(--shifa-red)' }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.room} · {p.condition}</p>
                    </div>
                  </div>
                ))}
                {criticalPatients.length > 3 && (
                  <button className="text-xs w-full text-center py-1" style={{ color: 'var(--shifa-blue)' }}>
                    +{criticalPatients.length - 3} autres →
                  </button>
                )}
              </div>
            </div>

            {/* Emergency summary */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
                  <Icon name="ExclamationTriangleIcon" size={14} style={{ color: 'var(--shifa-amber)' }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>File d'urgence</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--shifa-amber)' }}>{emergencyQueue.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(['P1', 'P2', 'P3', 'P4'] as const).map(p => {
                  const count = emergencyQueue.filter(e => e.triage === p).length;
                  const cfg = triageConfig[p];
                  return (
                    <div key={p} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: cfg.bg }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                      <span className="text-xs font-bold" style={{ color: cfg.color }}>{p}</span>
                      <span className="text-xs font-bold ml-auto" style={{ color: cfg.color }}>{count}</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setActiveTab('emergency')}
                className="w-full text-xs py-1.5 rounded-lg font-medium transition-colors hover:opacity-80"
                style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--shifa-amber)' }}
              >
                Voir la file complète →
              </button>
            </div>

            {/* Admissions today */}
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                  <Icon name="UserPlusIcon" size={14} style={{ color: 'var(--shifa-green)' }} />
                </div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Admissions du jour</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Seydou Konaté', dept: 'Médecine interne', time: '08:14', type: 'Programmée' },
                  { name: 'Ndeye Diop', dept: 'Maternité', time: '09:32', type: 'Urgence' },
                  { name: 'Lamine Touré', dept: 'Chirurgie', time: '10:05', type: 'Programmée' },
                  { name: 'Kadiatou Bah', dept: 'Pédiatrie', time: '11:47', type: 'Urgence' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{a.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{a.time}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: a.type === 'Urgence' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: a.type === 'Urgence' ? 'var(--shifa-red)' : 'var(--shifa-green)' }}>
                        {a.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Emergency Queue ── */}
      {activeTab === 'emergency' && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>File d'urgence en cours</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{emergencyQueue.length} patients · Triés par priorité</p>
            </div>
            <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>
              <Icon name="UserPlusIcon" size={14} />
              Nouveau patient
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {emergencyQueue.map((patient) => {
              const tCfg = triageConfig[patient.triage];
              const sCfg = statusConfig[patient.status];
              return (
                <div key={patient.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  {/* Triage badge */}
                  <div className="shrink-0 w-14 text-center">
                    <span className="inline-block px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: tCfg.bg, color: tCfg.color }}>
                      {patient.triage}
                    </span>
                  </div>
                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{patient.name}</p>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.age} ans</span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{patient.motif}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{patient.vitals}</p>
                  </div>
                  {/* Wait time */}
                  <div className="shrink-0 text-center w-20">
                    <p className="text-sm font-bold" style={{ color: patient.waitMin > 30 ? 'var(--shifa-amber)' : 'var(--foreground)' }}>
                      {patient.waitMin === 0 ? 'En cours' : `${patient.waitMin} min`}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>attente</p>
                  </div>
                  {/* Status */}
                  <div className="shrink-0">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: sCfg.bg, color: sCfg.color }}>
                      {patient.status}
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Prendre en charge">
                      <Icon name="PlayIcon" size={14} style={{ color: 'var(--shifa-blue)' }} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Voir dossier">
                      <Icon name="DocumentTextIcon" size={14} style={{ color: 'var(--muted-foreground)' }} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Admettre">
                      <Icon name="ArrowRightCircleIcon" size={14} style={{ color: 'var(--shifa-green)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab: Departments ── */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map(dept => {
            const pct = Math.round((dept.occupied / dept.beds) * 100);
            return (
              <div key={dept.id} className="rounded-xl border p-5 hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{dept.name}</h3>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{dept.head}</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: pct >= 90 ? 'var(--shifa-red)' : pct >= 75 ? 'var(--shifa-amber)' : dept.color }}>{pct}%</span>
                </div>
                <OccupancyBar pct={pct} color={dept.color} />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { label: 'Total', value: dept.beds, color: 'var(--muted-foreground)' },
                    { label: 'Occupés', value: dept.occupied, color: dept.color },
                    { label: 'Libres', value: dept.available, color: 'var(--shifa-green)' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-base font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                {dept.critical > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 p-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--shifa-red)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{dept.critical} patient{dept.critical > 1 ? 's' : ''} en état critique</span>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors hover:opacity-80" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                    Gérer les lits
                  </button>
                  <button className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors hover:opacity-80" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    Voir patients
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab: Critical Patients ── */}
      {activeTab === 'critical' && (
        <div className="space-y-3">
          {criticalPatients.map(p => (
            <div key={p.id} className="rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderLeftWidth: '3px', borderLeftColor: 'var(--shifa-red)' }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-red), var(--shifa-amber))' }}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>{p.room}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.dept} · {p.condition}</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5 p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                  <Icon name="ExclamationCircleIcon" size={14} style={{ color: 'var(--shifa-red)' }} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{p.alert}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis {p.since}</span>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                  <Icon name="EyeIcon" size={13} />
                  Voir dossier
                </button>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: 'var(--shifa-red)' }}>
                  <Icon name="BellAlertIcon" size={13} />
                  Alerter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
