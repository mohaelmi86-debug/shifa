'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';


// ─── TYPES ────────────────────────────────────────────────────────────────────

interface LiveEvent {
  id: string;
  eventType: string;
  sourceModule: string;
  targetModule?: string;
  organizationId?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  payload: Record<string, unknown>;
  resolved: boolean;
  createdAt: string;
}

interface ActiveTransfer {
  id: string;
  patientName: string;
  fromFacility: string;
  toFacility: string;
  status: string;
  urgency: string;
  transferType: string;
  updatedAt: string;
}

interface PendingConsultation {
  id: string;
  patientName: string;
  professionalName: string;
  scheduledAt: string;
  type: string;
  status: string;
}

interface SampleRoute {
  id: string;
  sampleId: string;
  fromLab: string;
  toLab: string;
  status: string;
  priority: string;
  estimatedArrival: string;
}

interface ResearchShare {
  id: string;
  datasetName: string;
  sharedBy: string;
  sharedWith: string;
  status: string;
  recordCount: number;
  createdAt: string;
}

// ─── MOCK DATA (fallback when DB tables don't exist yet) ──────────────────────

const mockTransfers: ActiveTransfer[] = [
  { id: 'TRF-001', patientName: 'Aïcha Diallo', fromFacility: 'Urgences CHU Saint-Louis', toFacility: 'Radiologie CHU', status: 'authorization', urgency: 'urgent', transferType: 'inter-service', updatedAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'TRF-002', patientName: 'Mamadou Koné', fromFacility: 'Clinique Pasteur Abidjan', toFacility: 'CHU de Cocody', status: 'in-transit', urgency: 'critical', transferType: 'inter-facility', updatedAt: new Date(Date.now() - 900000).toISOString() },
  { id: 'TRF-003', patientName: 'Zara Abdou', fromFacility: 'Hôpital Moroni', toFacility: 'CHU La Réunion', status: 'consent', urgency: 'urgent', transferType: 'international', updatedAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'TRF-004', patientName: 'Ibrahim Tall', fromFacility: 'CS Ziguinchor', toFacility: 'CHU Dakar', status: 'received', urgency: 'routine', transferType: 'inter-region', updatedAt: new Date(Date.now() - 3600000).toISOString() },
];

const mockConsultations: PendingConsultation[] = [
  { id: 'CONS-001', patientName: 'Fatou Ndiaye', professionalName: 'Dr. Mohamed Sy', scheduledAt: new Date(Date.now() + 1800000).toISOString(), type: 'Téléconsultation', status: 'pending' },
  { id: 'CONS-002', patientName: 'Oumar Ba', professionalName: 'Dr. Aminata Traoré', scheduledAt: new Date(Date.now() + 3600000).toISOString(), type: 'Consultation présentielle', status: 'confirmed' },
  { id: 'CONS-003', patientName: 'Mariam Coulibaly', professionalName: 'Dr. Kofi Asante', scheduledAt: new Date(Date.now() + 7200000).toISOString(), type: 'Suivi chronique', status: 'pending' },
];

const mockSampleRoutes: SampleRoute[] = [
  { id: 'SMP-001', sampleId: 'LAB-2025-4421', fromLab: 'Labo CHU Dakar', toLab: 'Institut Pasteur Paris', status: 'in-transit', priority: 'urgent', estimatedArrival: new Date(Date.now() + 86400000).toISOString() },
  { id: 'SMP-002', sampleId: 'LAB-2025-4422', fromLab: 'Clinique Pasteur Abidjan', toLab: 'Labo Référence Accra', status: 'processing', priority: 'routine', estimatedArrival: new Date(Date.now() + 172800000).toISOString() },
  { id: 'SMP-003', sampleId: 'LAB-2025-4423', fromLab: 'CHU Cotonou', toLab: 'Labo CHU Dakar', status: 'received', priority: 'critical', estimatedArrival: new Date(Date.now() - 3600000).toISOString() },
];

const mockResearchShares: ResearchShare[] = [
  { id: 'RES-001', datasetName: 'Épidémio Paludisme Sahel 2025', sharedBy: 'SHIFA Research', sharedWith: 'OMS Genève', status: 'active', recordCount: 12450, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'RES-002', datasetName: 'Données Vaccination COVID-19', sharedBy: 'Ministère Santé SN', sharedWith: 'CDC Africa', status: 'pending_approval', recordCount: 8920, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'RES-003', datasetName: 'Résistance Antibiotiques Afrique', sharedBy: 'Institut Pasteur', sharedWith: 'Université Dakar', status: 'active', recordCount: 3210, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

const mockEvents: LiveEvent[] = [
  { id: 'EVT-001', eventType: 'transfer.in-transit', sourceModule: 'patient-transfer', targetModule: 'hospitalization', severity: 'info', payload: { patient: 'Mamadou Koné' }, resolved: false, createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: 'EVT-002', eventType: 'sync.conflict', sourceModule: 'offline-sync', severity: 'warning', payload: { module: 'consultation', count: 2 }, resolved: false, createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: 'EVT-003', eventType: 'rls.blocked', sourceModule: 'ambassador-workspace', severity: 'error', payload: { table: 'health_records', userId: 'amb-123' }, resolved: true, createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'EVT-004', eventType: 'transfer.consent', sourceModule: 'patient-transfer', severity: 'info', payload: { patient: 'Zara Abdou' }, resolved: false, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'EVT-005', eventType: 'research.share.created', sourceModule: 'research-workspace', targetModule: 'external', severity: 'info', payload: { dataset: 'Épidémio Paludisme' }, resolved: false, createdAt: new Date(Date.now() - 900000).toISOString() },
  { id: 'EVT-006', eventType: 'lab.sample.dispatched', sourceModule: 'lab-sample-transfer', severity: 'info', payload: { sampleId: 'LAB-2025-4421' }, resolved: false, createdAt: new Date(Date.now() - 1200000).toISOString() },
  { id: 'EVT-007', eventType: 'sync.error', sourceModule: 'offline-sync', severity: 'error', payload: { module: 'billing', error: 'Connection timeout' }, resolved: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const severityConfig = {
  info: { color: '#2563eb', bg: '#dbeafe', icon: 'InformationCircleIcon', label: 'Info' },
  warning: { color: '#d97706', bg: '#fef3c7', icon: 'ExclamationTriangleIcon', label: 'Avertissement' },
  error: { color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon', label: 'Erreur' },
  critical: { color: '#7c2d12', bg: '#fef2f2', icon: 'FireIcon', label: 'Critique' },
};

const transferStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Brouillon', color: '#64748b', bg: '#f1f5f9' },
  consent: { label: 'Consentement', color: '#d97706', bg: '#fef3c7' },
  authorization: { label: 'Autorisation', color: '#7c3aed', bg: '#ede9fe' },
  acceptance: { label: 'Acceptation', color: '#0891b2', bg: '#cffafe' },
  'in-transit': { label: 'En transit', color: '#2563eb', bg: '#dbeafe' },
  received: { label: 'Reçu', color: '#059669', bg: '#d1fae5' },
  completed: { label: 'Terminé', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Annulé', color: '#dc2626', bg: '#fee2e2' },
};

const urgencyConfig: Record<string, { color: string; label: string }> = {
  routine: { color: '#64748b', label: 'Routine' },
  urgent: { color: '#d97706', label: 'Urgent' },
  critical: { color: '#dc2626', label: 'Critique' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
}

function formatEventType(type: string): string {
  return type.replace(/\./g, ' › ').replace(/-/g, ' ');
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'transfers' | 'consultations' | 'samples' | 'research' | 'events' | 'rls';

export default function LiveModuleInteractionsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(mockEvents);
  const [transfers, setTransfers] = useState<ActiveTransfer[]>(mockTransfers);
  const [isConnected, setIsConnected] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [eventCount, setEventCount] = useState(0);
  const eventFeedRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Real-time subscription to platform_events
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      try {
        channel = supabase
          .channel('live-module-interactions')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'platform_events' }, (payload) => {
            const raw = payload.new as Record<string, unknown>;
            const newEvent: LiveEvent = {
              id: String(raw.id ?? Date.now()),
              eventType: String(raw.event_type ?? ''),
              sourceModule: String(raw.source_module ?? ''),
              targetModule: raw.target_module ? String(raw.target_module) : undefined,
              organizationId: raw.organization_id ? String(raw.organization_id) : undefined,
              severity: (raw.severity as LiveEvent['severity']) ?? 'info',
              payload: (raw.payload as Record<string, unknown>) ?? {},
              resolved: Boolean(raw.resolved),
              createdAt: String(raw.created_at ?? new Date().toISOString()),
            };
            setLiveEvents(prev => [newEvent, ...prev].slice(0, 100));
            setEventCount(c => c + 1);
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'patient_transfers' }, (payload) => {
            const raw = payload.new as Record<string, unknown>;
            setTransfers(prev => prev.map(t =>
              t.id === String(raw.id) ? { ...t, status: String(raw.status ?? t.status), updatedAt: String(raw.updated_at ?? t.updatedAt) } : t
            ));
          })
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
          });
      } catch {
        setIsConnected(false);
      }
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll event feed
  useEffect(() => {
    if (autoScroll && eventFeedRef.current) {
      eventFeedRef.current.scrollTop = 0;
    }
  }, [liveEvents, autoScroll]);

  const filteredEvents = eventFilter === 'all'
    ? liveEvents
    : liveEvents.filter(e => e.severity === eventFilter || (eventFilter === 'unresolved' && !e.resolved));

  const errorCount = liveEvents.filter(e => (e.severity === 'error' || e.severity === 'critical') && !e.resolved).length;
  const warningCount = liveEvents.filter(e => e.severity === 'warning' && !e.resolved).length;
  const activeTransferCount = transfers.filter(t => !['completed', 'cancelled'].includes(t.status)).length;
  const criticalTransferCount = transfers.filter(t => t.urgency === 'critical' && !['completed', 'cancelled'].includes(t.status)).length;

  const tabs: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'transfers', label: 'Transferts actifs', icon: 'TruckIcon', badge: activeTransferCount },
    { id: 'consultations', label: 'Consultations', icon: 'VideoCameraIcon', badge: mockConsultations.filter(c => c.status === 'pending').length },
    { id: 'samples', label: 'Routage Labo', icon: 'BeakerIcon' },
    { id: 'research', label: 'Données Recherche', icon: 'CircleStackIcon' },
    { id: 'events', label: 'Flux d\'événements', icon: 'BoltIcon', badge: errorCount + warningCount },
    { id: 'rls', label: 'RLS & Sécurité', icon: 'ShieldCheckIcon' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}>
              <Icon name="BoltIcon" size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Interactions Modules — Live
              </h1>
              <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Supervision temps réel · Transferts · Consultations · Labo · Recherche
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              SUPER ADMIN ONLY
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: isConnected ? '#dcfce7' : '#fef3c7', color: isConnected ? '#16a34a' : '#d97706' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              {isConnected ? 'Temps réel connecté' : 'Mode démo (mock data)'}
            </span>
            {errorCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                <Icon name="ExclamationTriangleIcon" size={12} />
                {errorCount} erreur{errorCount > 1 ? 's' : ''} active{errorCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Événements reçus</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{eventCount + mockEvents.length}</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transferts actifs', value: String(activeTransferCount), icon: 'TruckIcon', color: criticalTransferCount > 0 ? '#dc2626' : '#2563eb', bg: criticalTransferCount > 0 ? '#fee2e2' : '#dbeafe', sub: criticalTransferCount > 0 ? `${criticalTransferCount} critique(s)` : 'En cours' },
          { label: 'Consultations en attente', value: String(mockConsultations.filter(c => c.status === 'pending').length), icon: 'VideoCameraIcon', color: '#7c3aed', bg: '#ede9fe', sub: 'Aujourd\'hui' },
          { label: 'Échantillons en transit', value: String(mockSampleRoutes.filter(s => s.status === 'in-transit').length), icon: 'BeakerIcon', color: '#0891b2', bg: '#cffafe', sub: 'Routage actif' },
          { label: 'Alertes non résolues', value: String(errorCount + warningCount), icon: 'ExclamationTriangleIcon', color: errorCount > 0 ? '#dc2626' : '#d97706', bg: errorCount > 0 ? '#fee2e2' : '#fef3c7', sub: `${errorCount} erreur(s), ${warningCount} avert.` },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                <p className="text-xs font-medium" style={{ color: kpi.color }}>{kpi.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-bold rounded-full text-white" style={{ backgroundColor: '#dc2626', minWidth: '18px', textAlign: 'center', fontSize: '10px' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Transfers Summary */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Transferts actifs</h2>
              <button onClick={() => setActiveTab('transfers')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout →</button>
            </div>
            <div className="space-y-2">
              {transfers.slice(0, 4).map(t => {
                const sc = transferStatusConfig[t.status] || { label: t.status, color: '#64748b', bg: '#f1f5f9' };
                const uc = urgencyConfig[t.urgency] || { color: '#64748b', label: t.urgency };
                return (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: uc.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{t.patientName}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{t.fromFacility} → {t.toFacility}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Event Feed (mini) */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Flux d'événements</h2>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <button onClick={() => setActiveTab('events')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout →</button>
            </div>
            <div className="space-y-2">
              {liveEvents.slice(0, 6).map(evt => {
                const sc = severityConfig[evt.severity];
                return (
                  <div key={evt.id} className="flex items-start gap-2.5 p-2 rounded-lg" style={{ backgroundColor: evt.resolved ? 'var(--muted)' : sc.bg + '40' }}>
                    <Icon name={sc.icon as any} size={14} style={{ color: sc.color, marginTop: '1px', flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{formatEventType(evt.eventType)}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{evt.sourceModule} · {formatRelativeTime(evt.createdAt)}</p>
                    </div>
                    {!evt.resolved && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: sc.color }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Consultations */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Consultations en attente</h2>
              <button onClick={() => setActiveTab('consultations')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout →</button>
            </div>
            <div className="space-y-2">
              {mockConsultations.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                    {c.patientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{c.patientName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{c.professionalName} · {c.type}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: c.status === 'pending' ? '#fef3c7' : '#dcfce7', color: c.status === 'pending' ? '#d97706' : '#16a34a' }}>
                    {c.status === 'pending' ? 'En attente' : 'Confirmé'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Routing */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Routage Échantillons</h2>
              <button onClick={() => setActiveTab('samples')} className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout →</button>
            </div>
            <div className="space-y-2">
              {mockSampleRoutes.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <Icon name="BeakerIcon" size={16} style={{ color: '#0891b2', flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{s.sampleId}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{s.fromLab} → {s.toLab}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style={{ backgroundColor: s.status === 'in-transit' ? '#dbeafe' : s.status === 'received' ? '#dcfce7' : '#fef3c7', color: s.status === 'in-transit' ? '#2563eb' : s.status === 'received' ? '#16a34a' : '#d97706' }}>
                    {s.status === 'in-transit' ? 'En transit' : s.status === 'received' ? 'Reçu' : 'Traitement'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ACTIVE TRANSFERS ─────────────────────────────────────────────── */}
      {activeTab === 'transfers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Transferts actifs — Machine d'états</h2>
            <Link href="/patient-transfer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />
              Nouveau transfert
            </Link>
          </div>

          {/* State machine legend */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>MACHINE D'ÉTATS — FLUX DE TRANSFERT</p>
            <div className="flex items-center gap-1 flex-wrap">
              {(['draft', 'consent', 'authorization', 'acceptance', 'in-transit', 'received', 'completed'] as const).map((s, i, arr) => {
                const sc = transferStatusConfig[s];
                return (
                  <React.Fragment key={s}>
                    <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                    {i < arr.length - 1 && <Icon name="ChevronRightIcon" size={12} className="text-muted-foreground" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {transfers.map(t => {
              const sc = transferStatusConfig[t.status] || { label: t.status, color: '#64748b', bg: '#f1f5f9' };
              const uc = urgencyConfig[t.urgency] || { color: '#64748b', label: t.urgency };
              return (
                <div key={t.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sc.bg }}>
                        <Icon name="TruckIcon" size={18} style={{ color: sc.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.patientName}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: uc.color + '20', color: uc.color }}>{uc.label}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>{t.transferType}</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {t.fromFacility} <Icon name="ArrowRightIcon" size={10} className="inline" /> {t.toFacility}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          Mis à jour {formatRelativeTime(t.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                      <Link href="/patient-transfer" className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Gérer">
                        <Icon name="ArrowTopRightOnSquareIcon" size={14} className="text-muted-foreground" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── CONSULTATIONS ────────────────────────────────────────────────── */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Consultations en attente</h2>
          <div className="space-y-3">
            {mockConsultations.map(c => (
              <div key={c.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                      {c.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{c.patientName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.professionalName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.type} · {new Date(c.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: c.status === 'pending' ? '#fef3c7' : '#dcfce7', color: c.status === 'pending' ? '#d97706' : '#16a34a' }}>
                    {c.status === 'pending' ? 'En attente' : 'Confirmé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SAMPLE ROUTING ───────────────────────────────────────────────── */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Routage Échantillons Laboratoire</h2>
          <div className="space-y-3">
            {mockSampleRoutes.map(s => (
              <div key={s.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#cffafe' }}>
                      <Icon name="BeakerIcon" size={18} style={{ color: '#0891b2' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{s.sampleId}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: s.priority === 'critical' ? '#fee2e2' : s.priority === 'urgent' ? '#fef3c7' : '#f1f5f9', color: s.priority === 'critical' ? '#dc2626' : s.priority === 'urgent' ? '#d97706' : '#64748b' }}>
                          {s.priority}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.fromLab} → {s.toLab}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Arrivée estimée: {new Date(s.estimatedArrival).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: s.status === 'in-transit' ? '#dbeafe' : s.status === 'received' ? '#dcfce7' : '#fef3c7', color: s.status === 'in-transit' ? '#2563eb' : s.status === 'received' ? '#16a34a' : '#d97706' }}>
                    {s.status === 'in-transit' ? 'En transit' : s.status === 'received' ? 'Reçu' : 'Traitement'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── RESEARCH DATA SHARES ─────────────────────────────────────────── */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Partages de Données Recherche</h2>
          <div className="space-y-3">
            {mockResearchShares.map(r => (
              <div key={r.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#ede9fe' }}>
                      <Icon name="CircleStackIcon" size={18} style={{ color: '#7c3aed' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.datasetName}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.sharedBy} → {r.sharedWith}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {r.recordCount.toLocaleString('fr-FR')} enregistrements · {formatRelativeTime(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: r.status === 'active' ? '#dcfce7' : '#fef3c7', color: r.status === 'active' ? '#16a34a' : '#d97706' }}>
                    {r.status === 'active' ? 'Actif' : 'Approbation requise'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LIVE EVENT FEED ──────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Flux d'événements temps réel</h2>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={eventFilter}
                onChange={e => setEventFilter(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <option value="all">Tous les événements</option>
                <option value="unresolved">Non résolus</option>
                <option value="critical">Critique</option>
                <option value="error">Erreur</option>
                <option value="warning">Avertissement</option>
                <option value="info">Info</option>
              </select>
              <button
                onClick={() => setAutoScroll(a => !a)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs border"
                style={{ backgroundColor: autoScroll ? '#dbeafe' : 'var(--card)', borderColor: 'var(--border)', color: autoScroll ? '#2563eb' : 'var(--muted-foreground)' }}
              >
                <Icon name="ArrowPathIcon" size={12} />
                Auto-scroll
              </button>
            </div>
          </div>

          <div ref={eventFeedRef} className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredEvents.map(evt => {
              const sc = severityConfig[evt.severity];
              return (
                <div
                  key={evt.id}
                  className="rounded-xl border p-3 transition-all"
                  style={{
                    backgroundColor: evt.resolved ? 'var(--card)' : sc.bg + '30',
                    borderColor: evt.resolved ? 'var(--border)' : sc.color + '40',
                    opacity: evt.resolved ? 0.7 : 1,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: sc.bg }}>
                      <Icon name={sc.icon as any} size={14} style={{ color: sc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{formatEventType(evt.eventType)}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                        {evt.resolved && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Résolu</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          <span className="font-medium">Source:</span> {evt.sourceModule}
                        </span>
                        {evt.targetModule && (
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            <span className="font-medium">Cible:</span> {evt.targetModule}
                          </span>
                        )}
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatRelativeTime(evt.createdAt)}</span>
                      </div>
                      {Object.keys(evt.payload).length > 0 && (
                        <div className="mt-1.5 px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                          {JSON.stringify(evt.payload)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
                <Icon name="CheckCircleIcon" size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucun événement dans cette catégorie</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── RLS & SECURITY ───────────────────────────────────────────────── */}
      {activeTab === 'rls' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>RLS — Politiques de sécurité par rôle</h2>

          {/* Role matrix */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="p-4 border-b" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Matrice d'accès par rôle</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left px-4 py-2 font-semibold" style={{ color: 'var(--foreground)' }}>Module / Table</th>
                    {['Professionnel', 'Lab Tech.', 'Finance', 'Ambassadeur', 'Org Admin', 'Super Admin'].map(r => (
                      <th key={r} className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--foreground)' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { module: 'Dossiers médicaux', access: ['✅ Org', '❌', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Résultats labo', access: ['✅ Org', '✅ Tout', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Facturation / Invoices', access: ['❌', '❌', '✅ Tout', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Paiements', access: ['❌', '❌', '✅ Tout', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Transferts patients', access: ['✅ Org', '❌', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Téléconsultations', access: ['✅ Propre', '❌', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Échantillons labo', access: ['❌', '✅ Tout', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Données recherche', access: ['❌', '❌', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Activités ambassadeur', access: ['❌', '❌', '❌', '✅ Propre', '✅ Org', '✅ Tout'] },
                    { module: 'Logs d\'audit', access: ['❌', '❌', '❌', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Sync Queue', access: ['✅ Org', '✅ Org', '✅ Org', '🚫 Bloqué', '✅ Org', '✅ Tout'] },
                    { module: 'Événements plateforme', access: ['❌', '❌', '❌', '🚫 Bloqué', '❌', '✅ Tout'] },
                  ].map((row, i) => (
                    <tr key={row.module} style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)' }}>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--foreground)' }}>{row.module}</td>
                      {row.access.map((a, j) => (
                        <td key={j} className="text-center px-3 py-2" style={{ color: a.includes('🚫') ? '#dc2626' : a.includes('✅') ? '#16a34a' : '#64748b' }}>
                          {a}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RLS Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Statut RLS par module</h3>
              <div className="space-y-2">
                {[
                  { module: 'health_records', status: 'active', policies: 4 },
                  { module: 'appointments', status: 'active', policies: 4 },
                  { module: 'lab_results', status: 'active', policies: 3 },
                  { module: 'invoices', status: 'active', policies: 3 },
                  { module: 'patient_transfers', status: 'active', policies: 3 },
                  { module: 'sync_queue', status: 'active', policies: 3 },
                  { module: 'platform_events', status: 'active', policies: 2 },
                  { module: 'transfer_notifications', status: 'active', policies: 3 },
                ].map(item => (
                  <div key={item.module} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                      <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{item.module}</span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.policies} politiques</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Règles clés</h3>
              <div className="space-y-3">
                {[
                  { rule: 'Lab Technician', desc: 'Accès uniquement aux tables lab_results, lab_samples. Bloqué sur health_records, invoices, transfers.', color: '#0891b2', bg: '#cffafe' },
                  { rule: 'Finance', desc: 'Accès uniquement aux tables invoices, payments. Bloqué sur toutes les données cliniques.', color: '#16a34a', bg: '#dcfce7' },
                  { rule: 'Ambassador', desc: 'Zéro accès aux données médicales. Uniquement ambassador_activities (propre compte).', color: '#dc2626', bg: '#fee2e2' },
                  { rule: 'Platform Admin', desc: 'Accès complet à toutes les tables. Seul rôle pouvant lire platform_events et audit_logs.', color: '#7c3aed', bg: '#ede9fe' },
                ].map(item => (
                  <div key={item.rule} className="p-3 rounded-lg" style={{ backgroundColor: item.bg }}>
                    <p className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.rule}</p>
                    <p className="text-xs" style={{ color: item.color + 'cc' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
