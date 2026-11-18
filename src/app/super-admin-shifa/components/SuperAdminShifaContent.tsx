'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { allFlows, connectorRegistry, transferStateMachine } from '@/lib/moduleInterconnect';

type Tab = 'overview' | 'modules' | 'interconnect' | 'transfers' | 'sync' | 'users' | 'audit' | 'system';

interface ModuleStatus {
  id: string;
  name: string;
  route: string;
  interface: 'complete' | 'partial' | 'mock' | 'todo';
  supabase: 'complete' | 'partial' | 'mock' | 'todo';
  logic: 'complete' | 'partial' | 'mock' | 'todo';
  permissions: 'complete' | 'partial' | 'mock' | 'todo';
  interactions: 'complete' | 'partial' | 'mock' | 'todo';
  connectors: string;
  offline: 'complete' | 'partial' | 'mock' | 'todo';
  category: string;
}

const moduleMatrix: ModuleStatus[] = [
  { id: 'patient-transfer', name: 'Transfert Patient', route: '/patient-transfer', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'Établissements', offline: 'todo', category: 'Clinique' },
  { id: 'lab-dashboard', name: 'Lab Dashboard', route: '/lab-dashboard', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'LIS', offline: 'mock', category: 'Laboratoire' },
  { id: 'lab-lis-connector', name: 'LIS/LIMS Connector', route: '/lab-lis-connector', interface: 'complete', supabase: 'todo', logic: 'mock', permissions: 'todo', interactions: 'partial', connectors: 'HL7/FHIR', offline: 'todo', category: 'Laboratoire' },
  { id: 'lab-sample-transfer', name: 'Transfert Échantillons', route: '/lab-sample-transfer', interface: 'complete', supabase: 'todo', logic: 'mock', permissions: 'todo', interactions: 'partial', connectors: 'Transport/DHL', offline: 'todo', category: 'Laboratoire' },
  { id: 'lab-international', name: 'Labo International', route: '/lab-international-transfer', interface: 'complete', supabase: 'todo', logic: 'mock', permissions: 'todo', interactions: 'partial', connectors: 'IATA/Douanes', offline: 'todo', category: 'Laboratoire' },
  { id: 'innovation-center', name: 'Innovation Center', route: '/innovation-center', interface: 'complete', supabase: 'todo', logic: 'mock', permissions: 'todo', interactions: 'partial', connectors: 'Partenaires', offline: 'todo', category: 'Écosystème' },
  { id: 'research-workspace', name: 'Research Workspace', route: '/research-workspace', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'partial', interactions: 'partial', connectors: 'Universités', offline: 'todo', category: 'Écosystème' },
  { id: 'shifa-academy', name: 'SHIFA Academy', route: '/shifa-academy', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'LMS Univ.', offline: 'mock', category: 'Écosystème' },
  { id: 'health-marketplace', name: 'Marketplace', route: '/health-marketplace', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'partial', interactions: 'partial', connectors: 'Fournisseurs', offline: 'todo', category: 'Écosystème' },
  { id: 'workforce-admin', name: 'Workforce Admin', route: '/workforce-admin', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'RH externe', offline: 'todo', category: 'RH' },
  { id: 'finance-dashboard', name: 'Finance Dashboard', route: '/finance-dashboard', interface: 'complete', supabase: 'partial', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'Banque/Stripe', offline: 'mock', category: 'Finance' },
  { id: 'integration-layer', name: 'Integration Layer', route: '/integration-layer', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'complete', connectors: 'LIS/PACS', offline: 'mock', category: 'Technique' },
  { id: 'interoperability-hub', name: 'Interoperability Hub', route: '/interoperability-hub', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'complete', connectors: 'HL7/FHIR/DICOM', offline: 'mock', category: 'Technique' },
  { id: 'offline-mode-config', name: 'Offline Mode Config', route: '/offline-mode-config', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'partial', interactions: 'partial', connectors: '—', offline: 'mock', category: 'Technique' },
  { id: 'emergency', name: 'Urgences', route: '/emergency', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'SAMU', offline: 'mock', category: 'Clinique' },
  { id: 'pharmacy-dashboard', name: 'Pharmacie', route: '/pharmacy-dashboard', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'Logiciel pharma', offline: 'mock', category: 'Clinique' },
  { id: 'imaging-dashboard', name: 'Imagerie', route: '/imaging-dashboard', interface: 'complete', supabase: 'mock', logic: 'partial', permissions: 'partial', interactions: 'partial', connectors: 'PACS/DICOM', offline: 'mock', category: 'Clinique' },
  { id: 'ambassador-workspace', name: 'Ambassador', route: '/ambassador-workspace', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'complete', interactions: 'partial', connectors: '—', offline: 'todo', category: 'Commercial' },
  { id: 'local-health-services', name: 'Services Locaux', route: '/local-health-services', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'partial', interactions: 'partial', connectors: 'Systèmes nationaux', offline: 'todo', category: 'Technique' },
  { id: 'shifa-share', name: 'SHIFA Share', route: '/shifa-share', interface: 'complete', supabase: 'mock', logic: 'mock', permissions: 'partial', interactions: 'partial', connectors: 'Réseaux sociaux', offline: 'todo', category: 'Partage' },
];

const statusIcon: Record<string, { icon: string; color: string; label: string }> = {
  complete: { icon: '🟢', color: '#16a34a', label: 'Complet' },
  partial: { icon: '🟡', color: '#d97706', label: 'Partiel' },
  mock: { icon: '🟠', color: '#ea580c', label: 'Mock' },
  todo: { icon: '🔵', color: '#2563eb', label: 'À créer' },
};

const syncQueueMock = [
  { id: 'SQ-001', type: 'Consultation', desc: 'Dr. Sy — Aïcha Diallo', status: 'pending', priority: 'critical', module: 'consultation', ts: '09:14' },
  { id: 'SQ-002', type: 'Constantes', desc: 'Ibrahim Tall', status: 'pending', priority: 'high', module: 'vitals', ts: '09:10' },
  { id: 'SQ-003', type: 'Prescription', desc: 'Mamadou Koné', status: 'syncing', priority: 'high', module: 'prescription', ts: '09:05' },
  { id: 'SQ-004', type: 'Résultat Labo', desc: 'Zara Abdou', status: 'synced', priority: 'normal', module: 'laboratory', ts: '08:55' },
  { id: 'SQ-005', type: 'Transfert', desc: 'Fatou Ndiaye', status: 'conflict', priority: 'critical', module: 'patient-transfer', ts: '08:40' },
  { id: 'SQ-006', type: 'Acte', desc: 'Oumar Ba', status: 'error', priority: 'high', module: 'billing', ts: '08:30' },
];

const syncStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: '#d97706', bg: '#fef3c7', label: 'En attente' },
  syncing: { color: '#2563eb', bg: '#dbeafe', label: 'Sync...' },
  synced: { color: '#16a34a', bg: '#dcfce7', label: 'Synchronisé' },
  conflict: { color: '#dc2626', bg: '#fee2e2', label: 'Conflit' },
  error: { color: '#dc2626', bg: '#fee2e2', label: 'Erreur' },
};

const priorityConfig: Record<string, { color: string }> = {
  critical: { color: '#dc2626' },
  high: { color: '#d97706' },
  normal: { color: '#64748b' },
};

const recentAudit = [
  { id: 'AUD-001', action: 'Transfert créé', actor: 'Dr. Fatou Traoré', module: 'patient-transfer', result: 'success', ts: '09:30:14' },
  { id: 'AUD-002', action: 'Autorisation accordée', actor: 'Dr. Moussa Diop', module: 'patient-transfer', result: 'success', ts: '09:42:08' },
  { id: 'AUD-003', action: 'Tentative sans consentement', actor: 'Admin', module: 'patient-transfer', result: 'warning', ts: '09:50:00' },
  { id: 'AUD-004', action: 'Sync conflit résolu', actor: 'Système SHIFA', module: 'offline-sync', result: 'success', ts: '10:01:33' },
  { id: 'AUD-005', action: 'Connecteur LIS activé', actor: 'Super Admin', module: 'integration-layer', result: 'success', ts: '10:15:00' },
  { id: 'AUD-006', action: 'Habilitation expirée', actor: 'Système SHIFA', module: 'workforce', result: 'warning', ts: '10:22:45' },
];

const auditResultConfig: Record<string, { color: string; bg: string }> = {
  success: { color: '#16a34a', bg: '#dcfce7' },
  warning: { color: '#d97706', bg: '#fef3c7' },
  error: { color: '#dc2626', bg: '#fee2e2' },
};

export default function SuperAdminShifaContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [syncFilter, setSyncFilter] = useState('all');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'modules', label: 'Matrice Modules', icon: 'TableCellsIcon' },
    { id: 'interconnect', label: 'Interconnexions', icon: 'ArrowsRightLeftIcon' },
    { id: 'transfers', label: 'Transferts', icon: 'TruckIcon' },
    { id: 'sync', label: 'Sync Queue', icon: 'ArrowPathIcon' },
    { id: 'users', label: 'Utilisateurs', icon: 'UsersIcon' },
    { id: 'audit', label: 'Audit Global', icon: 'ClipboardDocumentListIcon' },
    { id: 'system', label: 'Système', icon: 'CpuChipIcon' },
  ];

  const categories = ['all', ...Array.from(new Set(moduleMatrix.map(m => m.category)))];
  const filteredModules = moduleFilter === 'all' ? moduleMatrix : moduleMatrix.filter(m => m.category === moduleFilter);
  const filteredSync = syncFilter === 'all' ? syncQueueMock : syncQueueMock.filter(s => s.status === syncFilter);

  const totalFlows = allFlows.length;
  const totalConnectors = connectorRegistry.length;
  const activeConnectors = connectorRegistry.filter(c => c.status === 'active').length;
  const completeModules = moduleMatrix.filter(m => m.interface === 'complete').length;
  const syncStats = {
    pending: syncQueueMock.filter(s => s.status === 'pending').length,
    syncing: syncQueueMock.filter(s => s.status === 'syncing').length,
    conflicts: syncQueueMock.filter(s => s.status === 'conflict').length,
    errors: syncQueueMock.filter(s => s.status === 'error').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)' }}>
              <Icon name="ShieldCheckIcon" size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                SHIFA Super Admin
              </h1>
              <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Espace DEMO — Accès SHIFA Health OS complet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              SUPER ADMIN
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
              DEMO MODE
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              ● ONLINE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Connecté en tant que</p>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>SHIFA Admin</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Tous droits · Toutes organisations</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)' }}>
            SA
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Modules actifs', value: `${completeModules}/${moduleMatrix.length}`, icon: 'Squares2X2Icon', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Flux inter-modules', value: String(totalFlows), icon: 'ArrowsRightLeftIcon', color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Connecteurs actifs', value: `${activeConnectors}/${totalConnectors}`, icon: 'LinkIcon', color: '#059669', bg: '#d1fae5' },
          { label: 'Sync en attente', value: String(syncStats.pending + syncStats.conflicts), icon: 'ArrowPathIcon', color: syncStats.conflicts > 0 ? '#dc2626' : '#d97706', bg: syncStats.conflicts > 0 ? '#fee2e2' : '#fef3c7' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Vision Banner */}
          <div className="rounded-xl p-5 border" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)', borderColor: '#1e3a5f' }}>
            <div className="flex items-center gap-3 mb-3">
              <Icon name="GlobeAltIcon" size={24} className="text-sky-400" />
              <h2 className="text-lg font-bold text-white">SHIFA Health OS — Vision Globale</h2>
            </div>
            <p className="text-sky-200 text-sm mb-4">ONE PATIENT · ONE RECORD · ONE ECOSYSTEM</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Patients', icon: 'UserIcon' },
                { label: 'Professionnels', icon: 'BriefcaseIcon' },
                { label: 'Établissements', icon: 'BuildingOfficeIcon' },
                { label: 'Laboratoires', icon: 'BeakerIcon' },
                { label: 'Pharmacies', icon: 'ShoppingBagIcon' },
                { label: 'Assurances', icon: 'ShieldCheckIcon' },
                { label: 'Universités', icon: 'AcademicCapIcon' },
                { label: 'Ministères', icon: 'BuildingLibraryIcon' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <Icon name={item.icon as any} size={14} className="text-sky-300" />
                  <span className="text-xs text-sky-100">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Grid */}
          <div>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Accès rapide — Modules clés</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: 'Transfert Patient', href: '/patient-transfer', icon: 'TruckIcon', color: '#2563eb', bg: '#dbeafe', status: '🟡' },
                { label: 'Lab LIS/LIMS', href: '/lab-lis-connector', icon: 'BeakerIcon', color: '#7c3aed', bg: '#ede9fe', status: '🟠' },
                { label: 'Transfert Labo', href: '/lab-sample-transfer', icon: 'ArrowsRightLeftIcon', color: '#0891b2', bg: '#cffafe', status: '🟠' },
                { label: 'Innovation Center', href: '/innovation-center', icon: 'LightBulbIcon', color: '#d97706', bg: '#fef3c7', status: '🟠' },
                { label: 'Integration Layer', href: '/integration-layer', icon: 'LinkIcon', color: '#059669', bg: '#d1fae5', status: '🟡' },
                { label: 'Interop Hub', href: '/interoperability-hub', icon: 'GlobeAltIcon', color: '#dc2626', bg: '#fee2e2', status: '🟡' },
                { label: 'Offline Config', href: '/offline-mode-config', icon: 'WifiIcon', color: '#64748b', bg: '#f1f5f9', status: '🟠' },
                { label: 'Finance', href: '/finance-dashboard', icon: 'BanknotesIcon', color: '#16a34a', bg: '#dcfce7', status: '🟡' },
                { label: 'Workforce Admin', href: '/workforce-admin', icon: 'UsersIcon', color: '#7c3aed', bg: '#ede9fe', status: '🟡' },
                { label: 'SHIFA Academy', href: '/shifa-academy', icon: 'AcademicCapIcon', color: '#0891b2', bg: '#cffafe', status: '🟡' },
                { label: 'Marketplace', href: '/health-marketplace', icon: 'ShoppingBagIcon', color: '#d97706', bg: '#fef3c7', status: '🟠' },
                { label: 'Platform Admin', href: '/platform-admin', icon: 'Cog6ToothIcon', color: '#64748b', bg: '#f1f5f9', status: '🟡' },
              ].map(item => (
                <Link key={item.href} href={item.href}>
                  <div className="rounded-xl p-4 border cursor-pointer hover:shadow-md transition-all" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                        <Icon name={item.icon as any} size={18} style={{ color: item.color }} />
                      </div>
                      <span className="text-sm">{item.status}</span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sync Alert */}
          {(syncStats.conflicts > 0 || syncStats.errors > 0) && (
            <div className="rounded-xl p-4 border flex items-start gap-3" style={{ backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
              <Icon name="ExclamationTriangleIcon" size={20} style={{ color: '#ea580c' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#ea580c' }}>Attention — Sync Queue</p>
                <p className="text-xs mt-0.5" style={{ color: '#9a3412' }}>
                  {syncStats.conflicts} conflit(s) et {syncStats.errors} erreur(s) en attente de résolution.
                  <button onClick={() => setActiveTab('sync')} className="ml-2 underline font-medium">Voir la queue →</button>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── MODULE MATRIX ────────────────────────────────────────────────── */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Matrice d'état des modules</h2>
            <div className="flex gap-1 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setModuleFilter(cat)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    backgroundColor: moduleFilter === cat ? 'var(--shifa-blue)' : 'var(--muted)',
                    color: moduleFilter === cat ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 flex-wrap text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {Object.entries(statusIcon).map(([key, val]) => (
              <span key={key}>{val.icon} {val.label}</span>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Module', 'Route', 'Interface', 'Supabase', 'Logique', 'Permissions', 'Interactions', 'Connecteurs', 'Offline'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((mod, i) => (
                  <tr key={mod.id} style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--muted)', borderTop: '1px solid var(--border)' }}>
                    <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--foreground)' }}>{mod.name}</td>
                    <td className="px-3 py-2.5">
                      <Link href={mod.route} className="text-sky-500 hover:underline">{mod.route}</Link>
                    </td>
                    {(['interface', 'supabase', 'logic', 'permissions', 'interactions'] as const).map(field => (
                      <td key={field} className="px-3 py-2.5 text-center">
                        <span title={statusIcon[mod[field]]?.label}>{statusIcon[mod[field]]?.icon}</span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5" style={{ color: 'var(--muted-foreground)' }}>{mod.connectors}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span title={statusIcon[mod.offline]?.label}>{statusIcon[mod.offline]?.icon}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── INTERCONNECTIONS ─────────────────────────────────────────────── */}
      {activeTab === 'interconnect' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            Flux d'interconnexion — {allFlows.length} flux enregistrés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allFlows.map(flow => (
              <div key={flow.id} className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{flow.label}</p>
                  <span className="px-2 py-0.5 rounded text-xs font-medium shrink-0" style={{
                    backgroundColor: flow.mode === 'realtime' ? '#dbeafe' : flow.mode === 'batch' ? '#f1f5f9' : '#fef3c7',
                    color: flow.mode === 'realtime' ? '#1d4ed8' : flow.mode === 'batch' ? '#475569' : '#92400e',
                  }}>
                    {flow.mode}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{flow.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {flow.from} → {flow.to}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                    {flow.dataScope}
                  </span>
                  {flow.consentRequired === 'always' && (
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                      Consentement requis
                    </span>
                  )}
                  {flow.auditRequired && (
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                      Auditable
                    </span>
                  )}
                </div>
                {flow.example && (
                  <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>Ex: {flow.example}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TRANSFERS ────────────────────────────────────────────────────── */}
      {activeTab === 'transfers' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
            Workflow Transfert Patient — Machine d'état
          </h2>
          <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Chaque transition est autorisée, tracée et sécurisée. Aucun transfert ne peut bypasser le workflow.
            </p>
            <div className="space-y-2">
              {transferStateMachine.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium shrink-0" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>{t.from}</span>
                    <Icon name="ArrowRightIcon" size={12} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="px-2 py-0.5 rounded text-xs font-medium shrink-0" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>{t.to}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{t.requiredRole}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.auditAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/patient-transfer">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="TruckIcon" size={16} />
                Ouvrir Transfert Patient
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ─── SYNC QUEUE ───────────────────────────────────────────────────── */}
      {activeTab === 'sync' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              File de synchronisation Supabase Real-Time
            </h2>
            <div className="flex gap-1">
              {['all', 'pending', 'syncing', 'conflict', 'error', 'synced'].map(s => (
                <button
                  key={s}
                  onClick={() => setSyncFilter(s)}
                  className="px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: syncFilter === s ? 'var(--shifa-blue)' : 'var(--muted)',
                    color: syncFilter === s ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {s === 'all' ? 'Tous' : syncStatusConfig[s]?.label ?? s}
                </button>
              ))}
            </div>
          </div>

          {/* Sync Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'En attente', value: syncStats.pending, color: '#d97706', bg: '#fef3c7' },
              { label: 'En cours', value: syncStats.syncing, color: '#2563eb', bg: '#dbeafe' },
              { label: 'Conflits', value: syncStats.conflicts, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Erreurs', value: syncStats.errors, color: '#dc2626', bg: '#fee2e2' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3 border text-center" style={{ backgroundColor: stat.bg, borderColor: stat.color + '40' }}>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs font-medium" style={{ color: stat.color }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Queue Items */}
          <div className="space-y-2">
            {filteredSync.map(item => (
              <div key={item.id} className="rounded-xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.id}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: syncStatusConfig[item.status]?.bg, color: syncStatusConfig[item.status]?.color }}>
                      {syncStatusConfig[item.status]?.label}
                    </span>
                    <span className="text-xs font-medium" style={{ color: priorityConfig[item.priority]?.color }}>
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>{item.type} — {item.desc}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Module: {item.module} · {item.ts}</p>
                </div>
                {item.status === 'conflict' && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    Résoudre
                  </button>
                )}
                {item.status === 'error' && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    Réessayer
                  </button>
                )}
                {item.status === 'pending' && (
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                    Forcer sync
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Architecture Note */}
          <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Architecture Sync Queue — SHIFA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Offline → Queue locale</p>
                <p>Chaque opération est enregistrée localement avec un UUID unique, chiffrée, et priorisée (critique/haute/normale).</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Reconnexion → Sync Supabase</p>
                <p>À la reconnexion, les items sont envoyés par ordre de priorité via Supabase upsert avec détection de conflits.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Real-Time → Événements</p>
                <p>Supabase Realtime diffuse les changements aux modules concernés via le ShifaEvent bus.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── USERS ────────────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Gestion des utilisateurs — Vue Super Admin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { role: 'Super Admin', count: 1, color: '#dc2626', bg: '#fee2e2', desc: 'Accès total à toutes les organisations et modules', icon: 'ShieldCheckIcon' },
              { role: 'Admin Plateforme', count: 3, color: '#7c3aed', bg: '#ede9fe', desc: 'Gestion des organisations, modules, et configurations', icon: 'Cog6ToothIcon' },
              { role: 'Admin Établissement', count: 24, color: '#2563eb', bg: '#dbeafe', desc: 'Gestion de leur établissement uniquement', icon: 'BuildingOfficeIcon' },
              { role: 'Médecin', count: 1847, color: '#059669', bg: '#d1fae5', desc: 'Accès clinique selon spécialité et habilitations', icon: 'UserIcon' },
              { role: 'Infirmier', count: 3241, color: '#0891b2', bg: '#cffafe', desc: 'Accès soins selon service et habilitations', icon: 'HeartIcon' },
              { role: 'Patient', count: 48920, color: '#64748b', bg: '#f1f5f9', desc: 'Accès à leur propre dossier uniquement', icon: 'IdentificationIcon' },
            ].map(role => (
              <div key={role.role} className="rounded-xl border p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: role.bg }}>
                  <Icon name={role.icon as any} size={20} style={{ color: role.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{role.role}</p>
                    <span className="text-lg font-bold" style={{ color: role.color }}>{role.count.toLocaleString()}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Link href="/admin-utilisateurs">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="UsersIcon" size={16} />
                Gestion utilisateurs
              </button>
            </Link>
            <Link href="/admin-roles">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <Icon name="ShieldCheckIcon" size={16} />
                Rôles & Permissions
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ─── AUDIT ────────────────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Journal d'audit global — Temps réel</h2>
          <div className="space-y-2">
            {recentAudit.map(event => (
              <div key={event.id} className="rounded-xl border p-4 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: auditResultConfig[event.result]?.bg }}>
                  <Icon
                    name={event.result === 'success' ? 'CheckCircleIcon' : 'ExclamationTriangleIcon'}
                    size={16}
                    style={{ color: auditResultConfig[event.result]?.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{event.action}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{event.actor} · {event.module}</p>
                </div>
                <span className="text-xs font-mono shrink-0" style={{ color: 'var(--muted-foreground)' }}>{event.ts}</span>
              </div>
            ))}
          </div>
          <Link href="/admin-audit">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="ClipboardDocumentListIcon" size={16} />
              Audit complet
            </button>
          </Link>
        </div>
      )}

      {/* ─── SYSTEM ───────────────────────────────────────────────────────── */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>État du système SHIFA Health OS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Connectors */}
            <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Connecteurs externes ({connectorRegistry.length})</h3>
              <div className="space-y-2">
                {connectorRegistry.map(conn => (
                  <div key={conn.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{conn.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{conn.type} · {conn.country}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                      backgroundColor: conn.status === 'active' ? '#dcfce7' : conn.status === 'error' ? '#fee2e2' : conn.status === 'pending' ? '#fef3c7' : '#f1f5f9',
                      color: conn.status === 'active' ? '#15803d' : conn.status === 'error' ? '#dc2626' : conn.status === 'pending' ? '#92400e' : '#475569',
                    }}>
                      {conn.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Principles */}
            <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Principes d'architecture</h3>
              <div className="space-y-2">
                {[
                  { label: 'RBAC + RLS Supabase', status: '🟡', desc: 'Migration appliquée, RLS actif' },
                  { label: 'Need-to-Know Matrix', status: '🟢', desc: 'Définie dans moduleInterconnect.ts' },
                  { label: 'Audit Trail', status: '🟡', desc: 'Interface complète, Supabase partiel' },
                  { label: 'Chiffrement local (Offline)', status: '🟠', desc: 'Architecture définie, implémentation mock' },
                  { label: 'Consentement patient', status: '🟡', desc: 'Interface + workflow, Supabase partiel' },
                  { label: 'Transfer State Machine', status: '🟢', desc: 'Définie dans moduleInterconnect.ts' },
                  { label: 'Sync Queue Real-Time', status: '🟡', desc: 'Service créé, table Supabase à créer' },
                  { label: 'Event Bus SHIFA', status: '🟡', desc: 'Types définis, implémentation partielle' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <span className="text-sm shrink-0">{item.status}</span>
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Prochaines étapes recommandées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { step: 'Étape 3', label: 'Vérifier rôles & permissions', status: '🟡', desc: 'RLS migration appliquée — enrichir les policies par module' },
                { step: 'Étape 4', label: 'Vérifier interactions inter-modules', status: '🟡', desc: 'moduleInterconnect.ts enrichi — connecter aux composants' },
                { step: 'Étape 5', label: 'Connecteurs externes réels', status: '🔵', desc: 'Adaptateurs HL7/FHIR pour LIS/LIMS, PACS/DICOM' },
                { step: 'Étape 6', label: 'Low Bandwidth / Offline', status: '🟠', desc: 'syncQueueService.ts créé — créer table Supabase sync_queue' },
                { step: 'Étape 7', label: 'Workflows de transfert complets', status: '🟡', desc: 'State machine définie — connecter à Supabase' },
                { step: 'Étape 8', label: 'Corps métier complet', status: '🔵', desc: 'Après validation des étapes 3-7' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-2 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <span className="text-sm shrink-0">{item.status}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.step} — {item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
