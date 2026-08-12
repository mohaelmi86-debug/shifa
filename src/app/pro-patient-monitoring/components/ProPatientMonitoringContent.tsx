'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Patient {
  id: string;
  name: string;
  age: number;
  avatar: string;
  condition: string;
  carePlanStatus: 'on_track' | 'at_risk' | 'critical' | 'completed';
  compliance: number; // 0-100
  lastContact: string;
  nextFollowUp: string;
  alerts: number;
}

interface CarePlanTask {
  id: string;
  patientId: string;
  patientName: string;
  task: string;
  category: 'medication' | 'exercise' | 'diet' | 'checkup' | 'lab' | 'imaging';
  dueDate: string;
  status: 'pending' | 'done' | 'overdue' | 'skipped';
  priority: 'low' | 'medium' | 'high';
}

interface VitalThreshold {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  critical_min: number;
  critical_max: number;
  icon: string;
  color: string;
}

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'vital_deviation' | 'missed_task' | 'compliance_drop' | 'overdue_followup';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPatients: Patient[] = [
  { id: 'p1', name: 'Aïcha Diallo', age: 42, avatar: 'AD', condition: 'Diabète type 2 + HTA', carePlanStatus: 'at_risk', compliance: 68, lastContact: 'Il y a 2 jours', nextFollowUp: '15 août 2026', alerts: 3 },
  { id: 'p2', name: 'Moussa Traoré', age: 58, avatar: 'MT', condition: 'Insuffisance cardiaque', carePlanStatus: 'critical', compliance: 42, lastContact: 'Il y a 5 jours', nextFollowUp: 'Aujourd\'hui', alerts: 5 },
  { id: 'p3', name: 'Fatou Ndiaye', age: 35, avatar: 'FN', condition: 'Asthme chronique', carePlanStatus: 'on_track', compliance: 91, lastContact: 'Hier', nextFollowUp: '20 août 2026', alerts: 0 },
  { id: 'p4', name: 'Ibrahima Sow', age: 67, avatar: 'IS', condition: 'BPCO stade III', carePlanStatus: 'at_risk', compliance: 74, lastContact: 'Il y a 3 jours', nextFollowUp: '12 août 2026', alerts: 2 },
  { id: 'p5', name: 'Mariama Bah', age: 29, avatar: 'MB', condition: 'Grossesse à risque', carePlanStatus: 'on_track', compliance: 95, lastContact: 'Aujourd\'hui', nextFollowUp: '18 août 2026', alerts: 0 },
  { id: 'p6', name: 'Oumar Konaté', age: 51, avatar: 'OK', condition: 'Post-AVC rééducation', carePlanStatus: 'completed', compliance: 88, lastContact: 'Il y a 1 jour', nextFollowUp: '25 août 2026', alerts: 1 },
];

const mockTasks: CarePlanTask[] = [
  { id: 't1', patientId: 'p1', patientName: 'Aïcha Diallo', task: 'Contrôle glycémie à jeun', category: 'checkup', dueDate: 'Aujourd\'hui', status: 'pending', priority: 'high' },
  { id: 't2', patientId: 'p2', patientName: 'Moussa Traoré', task: 'Prise de poids quotidienne', category: 'checkup', dueDate: 'Aujourd\'hui', status: 'overdue', priority: 'high' },
  { id: 't3', patientId: 'p4', patientName: 'Ibrahima Sow', task: 'Spirométrie de contrôle', category: 'lab', dueDate: '12 août 2026', status: 'pending', priority: 'medium' },
  { id: 't4', patientId: 'p3', patientName: 'Fatou Ndiaye', task: 'Renouvellement ordonnance inhalateur', category: 'medication', dueDate: '14 août 2026', status: 'pending', priority: 'medium' },
  { id: 't5', patientId: 'p6', patientName: 'Oumar Konaté', task: 'Séance kinésithérapie', category: 'exercise', dueDate: 'Hier', status: 'done', priority: 'high' },
  { id: 't6', patientId: 'p2', patientName: 'Moussa Traoré', task: 'Bilan BNP + ionogramme', category: 'lab', dueDate: 'Aujourd\'hui', status: 'overdue', priority: 'high' },
  { id: 't7', patientId: 'p1', patientName: 'Aïcha Diallo', task: 'Consultation diététicienne', category: 'diet', dueDate: '16 août 2026', status: 'pending', priority: 'low' },
  { id: 't8', patientId: 'p5', patientName: 'Mariama Bah', task: 'Échographie obstétricale', category: 'imaging', dueDate: '18 août 2026', status: 'pending', priority: 'high' },
];

const mockThresholds: VitalThreshold[] = [
  { id: 'v1', name: 'Tension artérielle systolique', unit: 'mmHg', min: 90, max: 140, critical_min: 80, critical_max: 180, icon: 'HeartIcon', color: '#e11d48' },
  { id: 'v2', name: 'Fréquence cardiaque', unit: 'bpm', min: 50, max: 100, critical_min: 40, critical_max: 130, icon: 'HeartIcon', color: '#f97316' },
  { id: 'v3', name: 'Glycémie à jeun', unit: 'mmol/L', min: 3.9, max: 7.0, critical_min: 2.5, critical_max: 13.9, icon: 'BeakerIcon', color: '#8b5cf6' },
  { id: 'v4', name: 'SpO2', unit: '%', min: 94, max: 100, critical_min: 88, critical_max: 100, icon: 'CloudIcon', color: '#0ea5e9' },
  { id: 'v5', name: 'Poids', unit: 'kg', min: 0, max: 0, critical_min: 0, critical_max: 0, icon: 'ScaleIcon', color: '#14b8a6' },
  { id: 'v6', name: 'Température', unit: '°C', min: 36.0, max: 37.5, critical_min: 35.0, critical_max: 40.0, icon: 'FireIcon', color: '#f59e0b' },
];

const mockAlerts: Alert[] = [
  { id: 'a1', patientId: 'p2', patientName: 'Moussa Traoré', type: 'vital_deviation', message: 'TA systolique à 168 mmHg — dépasse le seuil critique (140)', severity: 'critical', timestamp: 'Il y a 30 min', acknowledged: false },
  { id: 'a2', patientId: 'p2', patientName: 'Moussa Traoré', type: 'missed_task', message: 'Bilan BNP non réalisé — en retard de 2 jours', severity: 'critical', timestamp: 'Il y a 2 h', acknowledged: false },
  { id: 'a3', patientId: 'p1', patientName: 'Aïcha Diallo', type: 'compliance_drop', message: 'Observance médicamenteuse chutée à 68% (−18% en 7 jours)', severity: 'warning', timestamp: 'Il y a 4 h', acknowledged: false },
  { id: 'a4', patientId: 'p4', patientName: 'Ibrahima Sow', type: 'vital_deviation', message: 'SpO2 à 91% — sous le seuil d\'alerte (94%)', severity: 'warning', timestamp: 'Hier 18:42', acknowledged: false },
  { id: 'a5', patientId: 'p6', patientName: 'Oumar Konaté', type: 'overdue_followup', message: 'Consultation de suivi post-AVC à planifier (délai dépassé)', severity: 'info', timestamp: 'Hier 09:00', acknowledged: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusConfig = {
  on_track: { label: 'En bonne voie', color: '#10b981', bg: 'rgba(16,185,129,0.1)', dot: 'bg-emerald-500' },
  at_risk: { label: 'À risque', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', dot: 'bg-amber-500' },
  critical: { label: 'Critique', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', dot: 'bg-red-500' },
  completed: { label: 'Complété', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: 'bg-gray-400' },
};

const categoryConfig = {
  medication: { label: 'Médicament', icon: 'BeakerIcon', color: '#8b5cf6' },
  exercise: { label: 'Exercice', icon: 'BoltIcon', color: '#10b981' },
  diet: { label: 'Alimentation', icon: 'SparklesIcon', color: '#f59e0b' },
  checkup: { label: 'Contrôle', icon: 'ClipboardDocumentCheckIcon', color: '#0ea5e9' },
  lab: { label: 'Biologie', icon: 'BeakerIcon', color: '#6366f1' },
  imaging: { label: 'Imagerie', icon: 'PhotoIcon', color: '#ec4899' },
};

const taskStatusConfig = {
  pending: { label: 'À faire', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  done: { label: 'Fait', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  overdue: { label: 'En retard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  skipped: { label: 'Ignoré', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

const alertSeverityConfig = {
  critical: { label: 'Critique', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'border-red-200', icon: 'ExclamationCircleIcon' },
  warning: { label: 'Avertissement', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'border-amber-200', icon: 'ExclamationTriangleIcon' },
  info: { label: 'Info', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'border-sky-200', icon: 'InformationCircleIcon' },
};

function ComplianceBar({ value }: { value: number }) {
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}%</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProPatientMonitoringContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'careplan' | 'tasks' | 'thresholds' | 'alerts'>('overview');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [thresholds, setThresholds] = useState<VitalThreshold[]>(mockThresholds);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'overdue' | 'done'>('all');

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged);
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue');
  const atRiskPatients = mockPatients.filter(p => p.carePlanStatus === 'at_risk' || p.carePlanStatus === 'critical');

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  };

  const filteredTasks = mockTasks.filter(t => {
    if (selectedPatient && t.patientId !== selectedPatient) return false;
    if (taskFilter !== 'all' && t.status !== taskFilter) return false;
    return true;
  });

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'careplan', label: 'Plans de soins', icon: 'ClipboardDocumentListIcon' },
    { key: 'tasks', label: 'Tâches de suivi', icon: 'CheckCircleIcon', badge: overdueTasks.length },
    { key: 'thresholds', label: 'Seuils vitaux', icon: 'AdjustmentsHorizontalIcon' },
    { key: 'alerts', label: 'Alertes', icon: 'BellAlertIcon', badge: unacknowledgedAlerts.length },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Suivi post-consultation
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--shifa-gray)' }}>
            Monitoring des patients, plans de soins et alertes de déviation
          </p>
        </div>
        <div className="flex items-center gap-3">
          {criticalAlerts.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold animate-pulse" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <Icon name="ExclamationCircleIcon" className="w-4 h-4" />
              {criticalAlerts.length} alerte{criticalAlerts.length > 1 ? 's' : ''} critique{criticalAlerts.length > 1 ? 's' : ''}
            </div>
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'var(--shifa-primary)' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouveau plan
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Patients suivis', value: mockPatients.length, icon: 'UsersIcon', color: 'var(--shifa-primary)', bg: 'rgba(0,128,128,0.08)' },
          { label: 'À risque / Critiques', value: atRiskPatients.length, icon: 'ExclamationTriangleIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Tâches en retard', value: overdueTasks.length, icon: 'ClockIcon', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Alertes actives', value: unacknowledgedAlerts.length, icon: 'BellAlertIcon', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
              <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--shifa-dark)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{kpi.value}</div>
              <div className="text-xs" style={{ color: 'var(--shifa-gray)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: 'var(--shifa-light)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all relative flex-shrink-0"
            style={activeTab === tab.key
              ? { background: 'var(--shifa-white)', color: 'var(--shifa-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
              : { color: 'var(--shifa-gray)' }
            }
          >
            <Icon name={tab.icon} className="w-4 h-4" />
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#ef4444', minWidth: '18px', textAlign: 'center' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
              <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Patients sous surveillance</h2>
              <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--shifa-light)', color: 'var(--shifa-gray)' }}>{mockPatients.length} patients</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--shifa-border)' }}>
              {mockPatients.map(patient => {
                const sc = statusConfig[patient.carePlanStatus];
                return (
                  <div
                    key={patient.id}
                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
                    style={selectedPatient === patient.id ? { background: 'rgba(0,128,128,0.04)' } : {}}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--shifa-primary)' }}>
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{patient.name}</span>
                        <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>{patient.age} ans</span>
                        {patient.alerts > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                            <Icon name="BellIcon" className="w-3 h-3" />
                            {patient.alerts}
                          </span>
                        )}
                      </div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--shifa-gray)' }}>{patient.condition}</div>
                      <div className="mt-2">
                        <ComplianceBar value={patient.compliance} />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>Suivi: {patient.nextFollowUp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: active alerts + upcoming follow-ups */}
          <div className="flex flex-col gap-6">
            {/* Active alerts */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
                <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Alertes récentes</h2>
                {unacknowledgedAlerts.length > 0 && (
                  <button onClick={acknowledgeAll} className="text-xs font-medium" style={{ color: 'var(--shifa-primary)' }}>
                    Tout acquitter
                  </button>
                )}
              </div>
              <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: 'var(--shifa-border)' }}>
                {alerts.filter(a => !a.acknowledged).slice(0, 5).map(alert => {
                  const sc = alertSeverityConfig[alert.severity];
                  return (
                    <div key={alert.id} className="px-4 py-3 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: sc.bg }}>
                        <Icon name={sc.icon} className="w-4 h-4" style={{ color: sc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: 'var(--shifa-dark)' }}>{alert.patientName}</div>
                        <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--shifa-gray)' }}>{alert.message}</div>
                        <div className="text-xs mt-1" style={{ color: 'var(--shifa-gray)', opacity: 0.7 }}>{alert.timestamp}</div>
                      </div>
                      <button onClick={() => acknowledgeAlert(alert.id)} className="text-xs px-2 py-1 rounded-lg flex-shrink-0 transition-colors hover:bg-gray-100" style={{ color: 'var(--shifa-gray)' }}>
                        ✓
                      </button>
                    </div>
                  );
                })}
                {unacknowledgedAlerts.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <Icon name="CheckCircleIcon" className="w-8 h-8 mx-auto mb-2" style={{ color: '#10b981' }} />
                    <p className="text-sm" style={{ color: 'var(--shifa-gray)' }}>Aucune alerte active</p>
                  </div>
                )}
              </div>
            </div>

            {/* Overdue tasks */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--shifa-border)' }}>
                <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Tâches en retard</h2>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--shifa-border)' }}>
                {overdueTasks.map(task => {
                  const cat = categoryConfig[task.category];
                  return (
                    <div key={task.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}18` }}>
                        <Icon name={cat.icon} className="w-3.5 h-3.5" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: 'var(--shifa-dark)' }}>{task.task}</div>
                        <div className="text-xs" style={{ color: '#ef4444' }}>{task.patientName} · {task.dueDate}</div>
                      </div>
                      <span className="w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                    </div>
                  );
                })}
                {overdueTasks.length === 0 && (
                  <div className="px-5 py-6 text-center text-sm" style={{ color: 'var(--shifa-gray)' }}>Aucun retard</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: CARE PLAN TRACKER
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'careplan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {mockPatients.map(patient => {
            const sc = statusConfig[patient.carePlanStatus];
            const patientTasks = mockTasks.filter(t => t.patientId === patient.id);
            const doneTasks = patientTasks.filter(t => t.status === 'done').length;
            const progress = patientTasks.length > 0 ? Math.round((doneTasks / patientTasks.length) * 100) : 0;

            return (
              <div key={patient.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                {/* Card header */}
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--shifa-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--shifa-primary)' }}>
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{patient.name}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--shifa-gray)' }}>{patient.condition}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Compliance + progress */}
                <div className="px-5 py-3 border-b grid grid-cols-2 gap-4" style={{ borderColor: 'var(--shifa-border)' }}>
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'var(--shifa-gray)' }}>Observance</div>
                    <ComplianceBar value={patient.compliance} />
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'var(--shifa-gray)' }}>Tâches ({doneTasks}/{patientTasks.length})</div>
                    <ComplianceBar value={progress} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="px-5 py-3 space-y-2">
                  {patientTasks.length === 0 && (
                    <p className="text-xs text-center py-3" style={{ color: 'var(--shifa-gray)' }}>Aucune tâche planifiée</p>
                  )}
                  {patientTasks.map(task => {
                    const cat = categoryConfig[task.category];
                    const ts = taskStatusConfig[task.status];
                    return (
                      <div key={task.id} className="flex items-center gap-3 py-1.5">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}18` }}>
                          <Icon name={cat.icon} className="w-3 h-3" style={{ color: cat.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: 'var(--shifa-dark)' }}>{task.task}</div>
                          <div className="text-xs" style={{ color: 'var(--shifa-gray)' }}>{task.dueDate}</div>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: ts.bg, color: ts.color }}>
                          {ts.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--shifa-gray)' }}>Prochain suivi: {patient.nextFollowUp}</span>
                  <button className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: 'var(--shifa-primary)' }}>
                    <Icon name="PencilSquareIcon" className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: FOLLOW-UP TASKS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tasks' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Filters */}
          <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--shifa-border)' }}>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--shifa-light)' }}>
              {(['all', 'pending', 'overdue', 'done'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={taskFilter === f
                    ? { background: 'var(--shifa-white)', color: 'var(--shifa-primary)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                    : { color: 'var(--shifa-gray)' }
                  }
                >
                  {f === 'all' ? 'Toutes' : f === 'pending' ? 'À faire' : f === 'overdue' ? 'En retard' : 'Terminées'}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {mockPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(selectedPatient === p.id ? null : p.id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all border"
                  style={selectedPatient === p.id
                    ? { background: 'var(--shifa-primary)', color: 'white', borderColor: 'var(--shifa-primary)' }
                    : { background: 'var(--shifa-white)', color: 'var(--shifa-gray)', borderColor: 'var(--shifa-border)' }
                  }
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Task table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--shifa-light)' }}>
                  {['Patient', 'Tâche', 'Catégorie', 'Échéance', 'Priorité', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--shifa-gray)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--shifa-border)' }}>
                {filteredTasks.map(task => {
                  const cat = categoryConfig[task.category];
                  const ts = taskStatusConfig[task.status];
                  const priorityColor = task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#6b7280';
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>{task.patientName}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: 'var(--shifa-dark)' }}>{task.task}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                          <Icon name={cat.icon} className="w-3.5 h-3.5" style={{ color: cat.color }} />
                          <span style={{ color: cat.color }}>{cat.label}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm" style={{ color: task.status === 'overdue' ? '#ef4444' : 'var(--shifa-gray)' }}>{task.dueDate}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold capitalize" style={{ color: priorityColor }}>
                          {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: ts.bg, color: ts.color }}>
                          {ts.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Marquer fait">
                            <Icon name="CheckIcon" className="w-4 h-4" style={{ color: '#10b981' }} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Modifier">
                            <Icon name="PencilSquareIcon" className="w-4 h-4" style={{ color: 'var(--shifa-gray)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--shifa-gray)' }}>
                      Aucune tâche correspondant aux filtres sélectionnés
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: VITAL THRESHOLDS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'thresholds' && (
        <div>
          <div className="mb-4 p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <Icon name="InformationCircleIcon" className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0ea5e9' }} />
            <p className="text-sm" style={{ color: 'var(--shifa-dark)' }}>
              Ces seuils s'appliquent par défaut à tous les patients sous surveillance. Vous pouvez les personnaliser par patient depuis la fiche individuelle. Une alerte automatique est générée dès qu'une valeur dépasse les seuils définis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {thresholds.map(threshold => (
              <div key={threshold.id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${threshold.color}18` }}>
                      <Icon name={threshold.icon} className="w-4.5 h-4.5" style={{ color: threshold.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{threshold.name}</div>
                      <div className="text-xs" style={{ color: 'var(--shifa-gray)' }}>Unité: {threshold.unit}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingThreshold(editingThreshold === threshold.id ? null : threshold.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="PencilSquareIcon" className="w-4 h-4" style={{ color: 'var(--shifa-gray)' }} />
                  </button>
                </div>

                <div className="px-5 py-4 space-y-3">
                  {/* Normal range */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--shifa-gray)' }}>Plage normale</span>
                      <span className="text-xs font-semibold" style={{ color: '#10b981' }}>
                        {threshold.min} – {threshold.max} {threshold.unit}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--shifa-light)' }}>
                      <div className="h-full rounded-full" style={{ background: '#10b981', width: '60%', marginLeft: '20%' }} />
                    </div>
                  </div>
                  {/* Critical range */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--shifa-gray)' }}>Seuil critique</span>
                      <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>
                        &lt;{threshold.critical_min} ou &gt;{threshold.critical_max} {threshold.unit}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--shifa-light)' }}>
                      <div className="h-full rounded-l-full" style={{ background: '#ef4444', width: '15%' }} />
                      <div className="h-full flex-1" style={{ background: 'transparent' }} />
                      <div className="h-full rounded-r-full" style={{ background: '#ef4444', width: '15%' }} />
                    </div>
                  </div>
                </div>

                {editingThreshold === threshold.id && (
                  <div className="px-5 pb-4 pt-0 border-t space-y-3" style={{ borderColor: 'var(--shifa-border)' }}>
                    <p className="text-xs font-semibold pt-3" style={{ color: 'var(--shifa-dark)' }}>Modifier les seuils</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Min normal', key: 'min', value: threshold.min },
                        { label: 'Max normal', key: 'max', value: threshold.max },
                        { label: 'Min critique', key: 'critical_min', value: threshold.critical_min },
                        { label: 'Max critique', key: 'critical_max', value: threshold.critical_max },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="text-xs mb-1 block" style={{ color: 'var(--shifa-gray)' }}>{field.label}</label>
                          <input
                            type="number"
                            defaultValue={field.value}
                            className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2"
                            style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-dark)' }}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              setThresholds(prev => prev.map(t => t.id === threshold.id ? { ...t, [field.key]: val } : t));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setEditingThreshold(null)}
                      className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--shifa-primary)' }}
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: ALERTS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {/* Alert summary bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Critiques', count: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: 'ExclamationCircleIcon' },
              { label: 'Avertissements', count: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: 'ExclamationTriangleIcon' },
              { label: 'Informations', count: alerts.filter(a => a.severity === 'info' && !a.acknowledged).length, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', icon: 'InformationCircleIcon' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon name={s.icon} className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums" style={{ color: s.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{s.count}</div>
                  <div className="text-xs" style={{ color: 'var(--shifa-gray)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Alert list */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--shifa-white)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--shifa-border)' }}>
              <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Toutes les alertes</h2>
              <button onClick={acknowledgeAll} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100" style={{ color: 'var(--shifa-primary)' }}>
                Tout acquitter
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--shifa-border)' }}>
              {alerts.map(alert => {
                const sc = alertSeverityConfig[alert.severity];
                const typeLabels = {
                  vital_deviation: 'Déviation vitale',
                  missed_task: 'Tâche manquée',
                  compliance_drop: 'Chute d\'observance',
                  overdue_followup: 'Suivi en retard',
                };
                return (
                  <div
                    key={alert.id}
                    className="px-5 py-4 flex items-start gap-4 transition-colors"
                    style={{ opacity: alert.acknowledged ? 0.5 : 1, background: alert.acknowledged ? 'transparent' : sc.bg }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${sc.color}18` }}>
                      <Icon name={sc.icon} className="w-5 h-5" style={{ color: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{alert.patientName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sc.color}18`, color: sc.color }}>
                          {typeLabels[alert.type]}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(107,114,128,0.1)', color: '#6b7280' }}>
                            Acquittée
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--shifa-dark)' }}>{alert.message}</p>
                      <span className="text-xs mt-1 block" style={{ color: 'var(--shifa-gray)' }}>{alert.timestamp}</span>
                    </div>
                    {!alert.acknowledged && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                          style={{ background: 'var(--shifa-primary)', color: 'white' }}
                        >
                          Acquitter
                        </button>
                        <Link
                          href="/pro-patients"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-100 border"
                          style={{ color: 'var(--shifa-dark)', borderColor: 'var(--shifa-border)' }}
                        >
                          Voir patient
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
