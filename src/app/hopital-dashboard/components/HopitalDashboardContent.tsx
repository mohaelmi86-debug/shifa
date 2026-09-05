'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime, useSupabaseCount } from '@/lib/hooks/useSupabaseRealtime';

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

const triageConfig = {
  P1: { label: 'P1 — Immédiat', bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', dot: '#ef4444' },
  P2: { label: 'P2 — Urgent', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', dot: '#f59e0b' },
  P3: { label: 'P3 — Semi-urgent', bg: 'rgba(21,101,216,0.10)', color: 'var(--shifa-blue)', dot: '#1565D8' },
  P4: { label: 'P4 — Non urgent', bg: 'rgba(5,150,105,0.10)', color: 'var(--shifa-green)', dot: '#059669' },
};

const statusConfig = {
  'en cours': { bg: 'rgba(21,101,216,0.10)', color: 'var(--shifa-blue)' },
  'en attente': { bg: 'rgba(217,119,6,0.10)', color: 'var(--shifa-amber)' },
  'observation': { bg: 'rgba(109,40,217,0.10)', color: 'var(--shifa-purple)' },
};

function OccupancyBar({ pct, color }: { pct: number; color: string }) {
  const bg = pct >= 90 ? 'var(--shifa-red)' : pct >= 75 ? 'var(--shifa-amber)' : color;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: bg }} />
    </div>
  );
}

export default function HopitalDashboardContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'emergency' | 'departments' | 'critical'>('overview');

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">

        {/* Premium page header strip */}
        <div
          className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-3"
          style={{
            background: 'linear-gradient(90deg, rgba(21,101,216,0.06) 0%, rgba(14,165,233,0.03) 100%)',
            border: '1px solid rgba(21,101,216,0.1)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            <Icon name="BuildingOffice2Icon" size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--shifa-blue)', letterSpacing: '0.08em' }}>
              Tableau de bord Hôpital
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              CHU Saint-Louis · Données en temps réel via Supabase
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#059669' }}>Système opérationnel</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
              Tableau de bord — Hôpital
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
              Vue d'ensemble de l'activité hospitalière en temps réel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <Icon name="ArrowDownTrayIcon" size={15} />
              Exporter
            </button>
            <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
              <Icon name="UserPlusIcon" size={15} />
              Nouvelle admission
            </button>
          </div>
        </div>

        {/* Live KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Patients actifs', value: lPat ? '…' : totalPatients.toString(), icon: 'UsersIcon', color: 'var(--shifa-blue)', gradFrom: '#1565D8', gradTo: '#38B6FF', sub: 'Base de données live', alert: false },
            { label: "Taux d\'occupation", value: `${occupancyPct}%`, icon: 'ChartBarIcon', color: occupancyPct >= 90 ? 'var(--shifa-red)' : 'var(--shifa-amber)', gradFrom: occupancyPct >= 90 ? '#DC2626' : '#D97706', gradTo: occupancyPct >= 90 ? '#FCA5A5' : '#FCD34D', sub: `${totalOccupied} / ${totalBeds} lits`, alert: occupancyPct >= 85 },
            { label: "Admissions aujourd\'hui", value: lAppt ? '…' : admissionsToday.toString(), icon: 'UserPlusIcon', color: 'var(--shifa-green)', gradFrom: '#059669', gradTo: '#34D399', sub: 'RDV confirmés + en cours', alert: false },
            { label: 'Consultations terminées', value: lAppt ? '…' : completedToday.toString(), icon: 'CheckCircleIcon', color: 'var(--shifa-cyan)', gradFrom: '#0EA5E9', gradTo: '#38BDF8', sub: "Aujourd\'hui", alert: false },
            { label: 'Patients critiques', value: totalCritical.toString(), icon: 'HeartIcon', color: 'var(--shifa-red)', gradFrom: '#DC2626', gradTo: '#FCA5A5', sub: 'Surveillance active', alert: true },
            { label: "File d\'urgence", value: emergencyQueue.length.toString(), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-amber)', gradFrom: '#D97706', gradTo: '#FCD34D', sub: `${emergencyQueue.filter(p => p.triage === 'P1').length} P1 · ${emergencyQueue.filter(p => p.triage === 'P2').length} P2`, alert: false },
          ].map((kpi, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl p-4 border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: kpi.alert ? `${kpi.gradFrom}40` : 'var(--border)',
                boxShadow: kpi.alert ? `0 4px 20px ${kpi.gradFrom}18` : '0 2px 12px rgba(21,101,216,0.05)',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${kpi.gradFrom}, ${kpi.gradTo})` }}
              />
              {kpi.alert && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: kpi.gradFrom }} />
              )}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `linear-gradient(135deg, ${kpi.gradFrom}18, ${kpi.gradTo}10)`, border: `1.5px solid ${kpi.gradFrom}22` }}
              >
                <Icon name={kpi.icon as any} size={17} style={{ color: kpi.color }} />
              </div>
              <p className="text-2xl font-extrabold mb-0.5 leading-none" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}>{kpi.value}</p>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Live stats bar */}
        <div
          className="flex flex-wrap items-center gap-4 mb-5 p-3.5 rounded-xl border text-xs"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-center gap-1.5" style={{ color: 'var(--shifa-green)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Temps réel Supabase</span>
          </div>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ color: 'var(--muted-foreground)' }}>{lPro ? '…' : totalProfessionals} professionnels actifs</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ color: 'var(--muted-foreground)' }}>{lRec ? '…' : pendingRecords} dossiers en attente de signature</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ color: 'var(--muted-foreground)' }}>{lDept ? '…' : totalDepts} départements</span>
        </div>

        {/* Action Shortcuts */}
        <div
          className="rounded-2xl border p-5 mb-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 12px rgba(21,101,216,0.05)' }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>Actions rapides</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Nouvelle admission', icon: 'UserPlusIcon', color: 'var(--shifa-blue)', bg: 'rgba(21,101,216,0.08)' },
              { label: 'Planifier consultation', icon: 'CalendarDaysIcon', color: 'var(--shifa-purple)', bg: 'rgba(109,40,217,0.08)' },
              { label: 'Gérer les sorties', icon: 'ArrowRightOnRectangleIcon', color: 'var(--shifa-green)', bg: 'rgba(5,150,105,0.08)' },
              { label: 'Affecter un lit', icon: 'BuildingOffice2Icon', color: 'var(--shifa-cyan)', bg: 'rgba(14,165,233,0.08)' },
              { label: 'Urgence — Triage', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', bg: 'rgba(220,38,38,0.08)' },
              { label: 'Rapport journalier', icon: 'DocumentChartBarIcon', color: 'var(--shifa-amber)', bg: 'rgba(217,119,6,0.08)' },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: action.bg, color: action.color, border: `1px solid ${action.color}20` }}
              >
                <Icon name={action.icon as any} size={15} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Premium Tab Bar */}
        <div
          className="flex gap-1 mb-5 p-1 rounded-xl"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all relative flex-1 justify-center"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--shifa-blue)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--muted-foreground)',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(21,101,216,0.25)' : 'none',
              }}
            >
              <Icon name={tab.icon as any} size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
              {(tab as any).badge > 0 && (
                <span
                  className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--shifa-red)',
                    color: 'white',
                    fontSize: '10px',
                    padding: '0 4px',
                  }}
                >
                  {(tab as any).badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Departments summary */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                Occupation par département
              </h3>
              <div className="flex flex-col gap-3">
                {departments.map(dept => {
                  const pct = Math.round((dept.occupied / dept.beds) * 100);
                  return (
                    <div key={dept.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {dept.critical > 0 && (
                            <span className="font-semibold" style={{ color: 'var(--shifa-red)' }}>
                              {dept.critical} critique{dept.critical > 1 ? 's' : ''}
                            </span>
                          )}
                          <span>{dept.occupied}/{dept.beds} lits · {pct}%</span>
                        </div>
                      </div>
                      <OccupancyBar pct={pct} color={dept.color} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Critical patients summary */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                  Patients critiques
                </h3>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--shifa-red)' }}
                >
                  {criticalPatients.length} actifs
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {criticalPatients.map(p => (
                  <div
                    key={p.id}
                    className="flex items-start gap-3 p-3 rounded-xl border"
                    style={{ backgroundColor: 'rgba(220,38,38,0.03)', borderColor: 'rgba(220,38,38,0.15)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}
                    >
                      <Icon name="HeartIcon" size={15} style={{ color: 'var(--shifa-red)' } as any} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p.room}</span>
                      </div>
                      <p className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{p.alert}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.condition} · depuis {p.since}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg, rgba(220,38,38,0.05), transparent)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
                  File d'urgence — Triage en cours
                </h3>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                {emergencyQueue.length} patients
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {emergencyQueue.map(p => {
                const tc = triageConfig[p.triage];
                const sc = statusConfig[p.status];
                return (
                  <div key={p.id} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: tc.bg, color: tc.color }}
                    >
                      {p.triage}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{p.motif}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{p.vitals}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        {p.status}
                      </span>
                      {p.waitMin > 0 && (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          Attente: {p.waitMin}min
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => {
              const pct = Math.round((dept.occupied / dept.beds) * 100);
              return (
                <div
                  key={dept.id}
                  className="relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ backgroundColor: dept.color }}
                  />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{dept.name}</h4>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{dept.head}</p>
                    </div>
                    {dept.critical > 0 && (
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: 'var(--shifa-red)' }}
                      >
                        {dept.critical} critique{dept.critical > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Total', value: dept.beds, color: 'var(--muted-foreground)' },
                      { label: 'Occupés', value: dept.occupied, color: dept.color },
                      { label: 'Libres', value: dept.available, color: 'var(--shifa-green)' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <OccupancyBar pct={pct} color={dept.color} />
                  <p className="text-xs mt-1.5 text-right font-semibold" style={{ color: pct >= 90 ? 'var(--shifa-red)' : pct >= 75 ? 'var(--shifa-amber)' : 'var(--muted-foreground)' }}>
                    {pct}% occupé
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'critical' && (
          <div className="flex flex-col gap-4">
            {criticalPatients.map(p => (
              <div
                key={p.id}
                className="rounded-2xl border p-5 flex items-start gap-4"
                style={{ backgroundColor: 'var(--card)', borderColor: 'rgba(220,38,38,0.2)', boxShadow: '0 2px 12px rgba(220,38,38,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(252,165,165,0.08))', border: '1.5px solid rgba(220,38,38,0.2)' }}
                >
                  <Icon name="HeartIcon" size={22} style={{ color: 'var(--shifa-red)' } as any} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{p.name}</h4>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p.room}</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.dept}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{p.condition}</p>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}
                  >
                    <Icon name="ExclamationCircleIcon" size={14} style={{ color: 'var(--shifa-red)' } as any} />
                    <p className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>{p.alert}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{p.since}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
