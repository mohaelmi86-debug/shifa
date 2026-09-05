'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'status' | 'queue' | 'cache' | 'sync' | 'devices' | 'settings' | 'conflicts' | 'audit';
type NetworkMode = 'online' | 'low-bandwidth' | 'offline';

interface SyncItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'conflict' | 'error';
  size: string;
  priority: 'critical' | 'high' | 'normal';
}

interface Device {
  id: string;
  name: string;
  type: 'tablet' | 'phone' | 'desktop' | 'kiosk';
  user: string;
  role: string;
  lastSeen: string;
  offlineEnabled: boolean;
  cacheSize: string;
  pendingSync: number;
  encryptionStatus: 'active' | 'inactive' | 'expired';
  os: string;
}

const mockSyncQueue: SyncItem[] = [
  { id: 'SQ-001', type: 'Consultation', description: 'Consultation Dr. Sy — Aïcha Diallo', timestamp: '2025-08-12 09:14', status: 'pending', size: '12 KB', priority: 'critical' },
  { id: 'SQ-002', type: 'Constantes', description: 'Constantes vitales — Ibrahim Tall', timestamp: '2025-08-12 09:10', status: 'pending', size: '2 KB', priority: 'high' },
  { id: 'SQ-003', type: 'Prescription', description: 'Ordonnance — Mamadou Koné', timestamp: '2025-08-12 09:05', status: 'syncing', size: '4 KB', priority: 'high' },
  { id: 'SQ-004', type: 'Résultat', description: 'Résultat labo — Zara Abdou', timestamp: '2025-08-12 08:55', status: 'synced', size: '8 KB', priority: 'normal' },
  { id: 'SQ-005', type: 'Transfert', description: 'Demande transfert — Fatou Ndiaye', timestamp: '2025-08-12 08:40', status: 'conflict', size: '6 KB', priority: 'critical' },
  { id: 'SQ-006', type: 'Acte', description: 'Acte chirurgical — Oumar Ba', timestamp: '2025-08-12 08:30', status: 'error', size: '3 KB', priority: 'high' },
];

const mockDevices: Device[] = [
  { id: 'DEV-001', name: 'Tablette Urgences 1', type: 'tablet', user: 'Dr. Mohamed Sy', role: 'Médecin', lastSeen: 'Il y a 2 min', offlineEnabled: true, cacheSize: '45 MB', pendingSync: 3, encryptionStatus: 'active', os: 'Android 13' },
  { id: 'DEV-002', name: 'Mobile Infirmier 3', type: 'phone', user: 'Inf. Fatou Sow', role: 'Infirmier', lastSeen: 'Il y a 8 min', offlineEnabled: true, cacheSize: '22 MB', pendingSync: 0, encryptionStatus: 'active', os: 'iOS 17' },
  { id: 'DEV-003', name: 'Poste Pharmacie', type: 'desktop', user: 'Ph. Moussa Diop', role: 'Pharmacien', lastSeen: 'Il y a 1 min', offlineEnabled: false, cacheSize: '0 MB', pendingSync: 0, encryptionStatus: 'inactive', os: 'Windows 11' },
  { id: 'DEV-004', name: 'Kiosque Accueil', type: 'kiosk', user: 'Système', role: 'Kiosque', lastSeen: 'Il y a 30 sec', offlineEnabled: true, cacheSize: '8 MB', pendingSync: 1, encryptionStatus: 'active', os: 'Android 12' },
  { id: 'DEV-005', name: 'Tablette Labo', type: 'tablet', user: 'Tech. Aminata Ba', role: 'Laborantin', lastSeen: 'Il y a 45 min', offlineEnabled: true, cacheSize: '18 MB', pendingSync: 2, encryptionStatus: 'expired', os: 'Android 11' },
];

const statusConfig: Record<SyncItem['status'], { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
  syncing: { label: 'Sync...', color: '#2563eb', bg: '#dbeafe', icon: 'ArrowPathIcon' },
  synced: { label: 'Synchronisé', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  conflict: { label: 'Conflit', color: '#dc2626', bg: '#fee2e2', icon: 'ExclamationTriangleIcon' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
};

const priorityConfig: Record<SyncItem['priority'], { label: string; color: string }> = {
  critical: { label: 'Critique', color: '#dc2626' },
  high: { label: 'Haute', color: '#d97706' },
  normal: { label: 'Normale', color: '#64748b' },
};

const encryptionConfig = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7', icon: 'LockClosedIcon' },
  inactive: { label: 'Inactif', color: '#64748b', bg: '#f1f5f9', icon: 'LockOpenIcon' },
  expired: { label: 'Expiré', color: '#dc2626', bg: '#fee2e2', icon: 'ExclamationTriangleIcon' },
};

const deviceTypeIcon: Record<Device['type'], string> = {
  tablet: 'DeviceTabletIcon',
  phone: 'DevicePhoneMobileIcon',
  desktop: 'ComputerDesktopIcon',
  kiosk: 'Squares2X2Icon',
};

const cacheModules = [
  { name: 'Dossiers patients', size: '45 MB', items: 128, icon: 'FolderOpenIcon', enabled: true },
  { name: 'Constantes vitales', size: '8 MB', items: 512, icon: 'HeartIcon', enabled: true },
  { name: 'Prescriptions', size: '12 MB', items: 89, icon: 'DocumentCheckIcon', enabled: true },
  { name: 'Résultats biologiques', size: '22 MB', items: 67, icon: 'BeakerIcon', enabled: true },
  { name: 'Imagerie (miniatures)', size: '38 MB', items: 34, icon: 'PhotoIcon', enabled: false },
  { name: 'Protocoles & procédures', size: '5 MB', items: 210, icon: 'ClipboardDocumentListIcon', enabled: true },
  { name: 'Médicaments (référentiel)', size: '18 MB', items: 4500, icon: 'ArchiveBoxIcon', enabled: true },
  { name: 'Contacts d\'urgence', size: '1 MB', items: 45, icon: 'PhoneIcon', enabled: true },
];

export default function OfflineModeConfigContent() {
  const [activeTab, setActiveTab] = useState<Tab>('status');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('online');
  const [cacheEnabled, setCacheEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(cacheModules.map(m => [m.name, m.enabled]))
  );

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'status', label: 'État réseau', icon: 'WifiIcon' },
    { id: 'queue', label: 'File de sync', icon: 'QueueListIcon' },
    { id: 'cache', label: 'Cache local', icon: 'CircleStackIcon' },
    { id: 'sync', label: 'Synchronisation', icon: 'ArrowPathIcon' },
    { id: 'devices', label: 'Appareils', icon: 'DeviceTabletIcon' },
    { id: 'conflicts', label: 'Conflits', icon: 'ExclamationTriangleIcon' },
    { id: 'audit', label: 'Audit Offline', icon: 'ClipboardDocumentListIcon' },
    { id: 'settings', label: 'Configuration', icon: 'Cog6ToothIcon' },
  ];

  const modeConfig: Record<NetworkMode, { label: string; icon: string; color: string; bg: string; description: string }> = {
    online: { label: 'En ligne', icon: 'WifiIcon', color: '#16a34a', bg: '#dcfce7', description: 'Synchronisation Cloud normale — toutes les fonctionnalités disponibles' },
    'low-bandwidth': { label: 'Faible débit', icon: 'SignalIcon', color: '#d97706', bg: '#fef3c7', description: 'Mode économique — interface légère, compression activée, synchronisation différée' },
    offline: { label: 'Hors ligne', icon: 'WifiIcon', color: '#dc2626', bg: '#fee2e2', description: 'Mode local — opérations critiques uniquement, synchronisation à la reconnexion' },
  };

  const offlineCapabilities = [
    { role: 'Médecin', capabilities: ['Consulter dossiers mis en cache', 'Enregistrer consultation', 'Enregistrer constantes', 'Créer prescription', 'Enregistrer acte'], icon: 'UserCircleIcon' },
    { role: 'Infirmier', capabilities: ['Consulter patients assignés', 'Enregistrer constantes', 'Administrer médicaments', 'Enregistrer soins', 'Gérer file d\'attente'], icon: 'HeartIcon' },
    { role: 'Pharmacien', capabilities: ['Consulter stock local', 'Enregistrer dispensation', 'Consulter ordonnances en cache'], icon: 'ArchiveBoxIcon' },
    { role: 'Laborantin', capabilities: ['Enregistrer résultats', 'Consulter demandes en cache', 'Enregistrer contrôle qualité'], icon: 'BeakerIcon' },
    { role: 'Administrateur', capabilities: ['Consulter activité locale', 'Gérer file d\'attente', 'Enregistrer admissions'], icon: 'Squares2X2Icon' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Mode Offline & Faible Débit</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Architecture de continuité de service — SHIFA fonctionne même sans Internet
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ backgroundColor: modeConfig[networkMode].bg, borderColor: modeConfig[networkMode].color }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: modeConfig[networkMode].color }} />
          <span className="text-sm font-semibold" style={{ color: modeConfig[networkMode].color }}>{modeConfig[networkMode].label}</span>
        </div>
      </div>

      {/* Network mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.entries(modeConfig) as [NetworkMode, typeof modeConfig[NetworkMode]][]).map(([mode, cfg]) => (
          <button
            key={mode}
            onClick={() => setNetworkMode(mode)}
            className="rounded-xl border p-4 text-left transition-all"
            style={{
              backgroundColor: networkMode === mode ? cfg.bg : 'var(--card)',
              borderColor: networkMode === mode ? cfg.color : 'var(--border)',
              borderWidth: networkMode === mode ? '2px' : '1px',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                <Icon name={cfg.icon as any} size={18} style={{ color: cfg.color }} />
              </div>
              <span className="font-semibold text-sm" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cfg.description}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Status */}
      {activeTab === 'status' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Éléments en attente', value: '4', icon: 'ClockIcon', color: '#d97706', bg: '#fef3c7' },
              { label: 'Conflits détectés', value: '1', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: '#fee2e2' },
              { label: 'Cache utilisé', value: '149 MB', icon: 'CircleStackIcon', color: '#2563eb', bg: '#dbeafe' },
              { label: 'Dernière sync', value: '09:14', icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bandwidth monitor */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Moniteur de bande passante</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Débit entrant', value: '1.2 Mbps', icon: 'ArrowDownIcon', color: '#16a34a', bar: 60 },
                { label: 'Débit sortant', value: '0.4 Mbps', icon: 'ArrowUpIcon', color: '#2563eb', bar: 20 },
                { label: 'Latence', value: '48 ms', icon: 'BoltIcon', color: '#d97706', bar: 35 },
              ].map(metric => (
                <div key={metric.label} className="rounded-lg border p-4" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={metric.icon as any} size={16} style={{ color: metric.color }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{metric.label}</span>
                  </div>
                  <p className="text-2xl font-bold mb-2" style={{ color: metric.color }}>{metric.value}</p>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${metric.bar}%`, backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encryption status */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>État du chiffrement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Cache local', status: 'AES-256 actif', icon: 'LockClosedIcon', ok: true },
                { label: 'Transmission réseau', status: 'TLS 1.3 actif', icon: 'ShieldCheckIcon', ok: true },
                { label: 'File de synchronisation', status: 'Chiffrement bout-en-bout', icon: 'ArrowPathIcon', ok: true },
                { label: 'Expiration des clés', status: 'Renouvellement dans 14 jours', icon: 'ClockIcon', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: item.ok ? '#dcfce7' : '#fee2e2' }}>
                  <Icon name={item.icon as any} size={18} style={{ color: item.ok ? '#16a34a' : '#dc2626' }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: item.ok ? '#15803d' : '#dc2626' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: item.ok ? '#166534' : '#991b1b' }}>{item.status}</p>
                  </div>
                  <Icon name="CheckCircleIcon" size={16} className="ml-auto" style={{ color: '#16a34a' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Capacités par rôle en mode Offline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineCapabilities.map(role => (
                <div key={role.role} className="rounded-lg border p-4" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={role.icon as any} size={18} style={{ color: 'var(--shifa-blue)' }} />
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{role.role}</h3>
                  </div>
                  <ul className="space-y-1">
                    {role.capabilities.map(cap => (
                      <li key={cap} className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="CheckCircleIcon" size={12} style={{ color: '#16a34a' }} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ShieldCheckIcon" size={16} style={{ color: '#d97706' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#92400e' }}>Règle de sécurité absolue</h3>
            </div>
            <p className="text-xs" style={{ color: '#92400e' }}>
              Le mode offline ne contourne jamais les permissions de sécurité. Un utilisateur ne peut accéder qu'aux données pour lesquelles il a été explicitement autorisé. Le cache local est chiffré et expire automatiquement.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Sync Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>File de synchronisation</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="ArrowPathIcon" size={16} />
              Synchroniser maintenant
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Type', 'Description', 'Horodatage', 'Priorité', 'Taille', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockSyncQueue.map((item, i) => {
                  const s = statusConfig[item.status];
                  const p = priorityConfig[item.priority];
                  return (
                    <tr key={item.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.id}</td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{item.type}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{item.description}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.timestamp}</td>
                      <td className="px-4 py-3 text-xs font-medium" style={{ color: p.color }}>● {p.label}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.size}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit" style={{ backgroundColor: s.bg, color: s.color }}>
                          <Icon name={s.icon as any} size={12} className={item.status === 'syncing' ? 'animate-spin' : ''} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.status === 'conflict' && (
                          <button className="text-xs px-2 py-1 rounded border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>Résoudre</button>
                        )}
                        {item.status === 'error' && (
                          <button className="text-xs px-2 py-1 rounded border" style={{ borderColor: '#d97706', color: '#d97706' }}>Réessayer</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Cache */}
      {activeTab === 'cache' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Gestion du cache local</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
              <Icon name="TrashIcon" size={16} />
              Vider le cache
            </button>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Espace utilisé</span>
              <span className="text-sm font-bold" style={{ color: 'var(--shifa-blue)' }}>149 MB / 500 MB</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="h-full rounded-full" style={{ width: '29.8%', background: 'linear-gradient(90deg, var(--shifa-blue), var(--shifa-cyan))' }} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>29.8% utilisé — 351 MB disponibles</p>
          </div>

          <div className="space-y-2">
            {cacheModules.map(mod => (
              <div key={mod.name} className="flex items-center gap-4 px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <Icon name={mod.icon as any} size={18} style={{ color: 'var(--shifa-blue)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{mod.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{mod.items} éléments · {mod.size}</p>
                </div>
                <button
                  onClick={() => setCacheEnabled(prev => ({ ...prev, [mod.name]: !prev[mod.name] }))}
                  className="relative w-10 h-5 rounded-full transition-colors"
                  style={{ backgroundColor: cacheEnabled[mod.name] ? 'var(--shifa-blue)' : 'var(--muted)' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: cacheEnabled[mod.name] ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Sync */}
      {activeTab === 'sync' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Architecture de synchronisation SHIFA</h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['Cloud SHIFA', 'API Gateway', 'Edge / Local', 'Appareils'].map((node, i, arr) => (
                <React.Fragment key={node}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xs text-center px-2" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                      {node}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex flex-col items-center gap-1">
                      <Icon name="ArrowsRightLeftIcon" size={20} style={{ color: 'var(--shifa-blue)' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>sync</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs text-center" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              Une coupure Internet ne doit pas arrêter les services de santé critiques. La reprise est contrôlée à la reconnexion.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Résolution des conflits', icon: 'ExclamationTriangleIcon', color: '#d97706', items: ['Horodatage serveur prioritaire', 'Fusion intelligente si possible', 'Alerte utilisateur si conflit critique', 'Journalisation de toutes les résolutions'] },
              { title: 'Sécurité du cache', icon: 'LockClosedIcon', color: '#7c3aed', items: ['Chiffrement AES-256 local', 'Expiration automatique configurable', 'Identifiants uniques par enregistrement', 'Protection contre les doublons'] },
              { title: 'Priorités de sync', icon: 'BoltIcon', color: '#dc2626', items: ['Critique : transferts, urgences, constantes', 'Haute : consultations, prescriptions', 'Normale : documents, historiques', 'Différée : statistiques, rapports'] },
              { title: 'Audit & traçabilité', icon: 'ClipboardDocumentListIcon', color: '#2563eb', items: ['Chaque opération offline est horodatée', 'Identifiant unique par enregistrement', 'Journal de synchronisation complet', 'Rapport de reprise après reconnexion'] },
            ].map(section => (
              <div key={section.title} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name={section.icon as any} size={18} style={{ color: section.color }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{section.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {section.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="CheckCircleIcon" size={12} style={{ color: section.color, marginTop: '2px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Devices */}
      {activeTab === 'devices' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Appareils enregistrés</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                {mockDevices.filter(d => d.offlineEnabled).length} offline activé
              </span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                {mockDevices.filter(d => d.encryptionStatus === 'expired').length} chiffrement expiré
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDevices.map(device => {
              const enc = encryptionConfig[device.encryptionStatus];
              return (
                <div key={device.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: device.encryptionStatus === 'expired' ? '#dc2626' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <Icon name={deviceTypeIcon[device.type] as any} size={20} style={{ color: 'var(--shifa-blue)' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{device.name}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.os} · {device.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: enc.bg, color: enc.color }}>
                      <Icon name={enc.icon as any} size={11} />
                      {enc.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Utilisateur</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{device.user}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.role}</p>
                    </div>
                    <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cache / Sync</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{device.cacheSize}</p>
                      <p className="text-xs" style={{ color: device.pendingSync > 0 ? '#d97706' : '#16a34a' }}>{device.pendingSync} en attente</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#16a34a' }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{device.lastSeen}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: device.offlineEnabled ? '#16a34a' : 'var(--muted-foreground)' }}>
                        {device.offlineEnabled ? '✓ Offline activé' : '✗ Offline désactivé'}
                      </span>
                      {device.encryptionStatus === 'expired' && (
                        <button className="text-xs px-2 py-1 rounded border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>Renouveler</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border p-4" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ExclamationTriangleIcon" size={16} style={{ color: '#d97706' }} />
              <h3 className="font-semibold text-sm" style={{ color: '#92400e' }}>Appareil avec chiffrement expiré détecté</h3>
            </div>
            <p className="text-xs" style={{ color: '#92400e' }}>
              La tablette Labo (DEV-005) a un certificat de chiffrement expiré. Le mode offline est désactivé automatiquement jusqu'au renouvellement. Contactez l'administrateur système.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Configuration du mode faible débit</h2>
            <div className="space-y-4">
              {[
                { label: 'Seuil de déclenchement (kbps)', type: 'number', value: '256', hint: 'En dessous de ce seuil, le mode faible débit s\'active automatiquement' },
                { label: 'Expiration du cache (heures)', type: 'number', value: '24', hint: 'Les données en cache expirent après cette durée' },
                { label: 'Taille max du cache (MB)', type: 'number', value: '500', hint: 'Limite de stockage local par appareil' },
                { label: 'Intervalle de sync automatique (minutes)', type: 'number', value: '5', hint: 'Fréquence de synchronisation en mode online' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{field.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Options avancées</h2>
            <div className="space-y-3">
              {[
                { label: 'Compression des données en transit', enabled: true },
                { label: 'Chargement progressif des images', enabled: true },
                { label: 'Synchronisation différée en faible débit', enabled: true },
                { label: 'Notifications offline', enabled: false },
                { label: 'Mode kiosque offline', enabled: false },
                { label: 'Journalisation détaillée des conflits', enabled: true },
              ].map(opt => (
                <div key={opt.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>{opt.label}</span>
                  <div className="relative w-10 h-5 rounded-full cursor-pointer" style={{ backgroundColor: opt.enabled ? 'var(--shifa-blue)' : 'var(--muted)' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: opt.enabled ? 'translateX(20px)' : 'translateX(2px)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
            Enregistrer la configuration
          </button>
        </div>
      )}

      {/* ── CONFLICTS TAB ── */}
      {activeTab === 'conflicts' && (
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
            <Icon name="ExclamationTriangleIcon" size={18} style={{ color: '#d97706' }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#92400e' }}>1 conflit de synchronisation détecté</p>
              <p className="text-xs" style={{ color: '#92400e' }}>Un enregistrement a été modifié simultanément en mode offline et en ligne. Une résolution manuelle est requise.</p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Conflits actifs', value: '1', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: '#fee2e2' },
              { label: 'Résolus (7j)', value: '4', icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
              { label: 'Résolution auto', value: '3', icon: 'ArrowPathIcon', color: '#2563eb', bg: '#dbeafe' },
              { label: 'Résolution manuelle', value: '2', icon: 'UserCircleIcon', color: '#d97706', bg: '#fef3c7' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                    <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active conflict */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Conflit actif — Résolution requise</h2>
            <div className="rounded-xl border p-4 mb-4" style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold" style={{ color: '#92400e' }}>SQ-005 — Demande transfert — Fatou Ndiaye</p>
                  <p className="text-xs" style={{ color: '#92400e' }}>Type : Transfert patient · Priorité : Critique</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Conflit</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: '#fbbf24' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#2563eb' }}>Version OFFLINE (Tablette Urgences 1)</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Modifié le : 12/08/2026 08:40</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Auteur : Dr. Mohamed Sy</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--foreground)' }}>Statut : <strong>Autorisé</strong> · Destination : CHU Dakar</p>
                  <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#2563eb' }}>
                    Utiliser cette version
                  </button>
                </div>
                <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--card)', borderColor: '#fbbf24' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#16a34a' }}>Version CLOUD (Serveur SHIFA)</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Modifié le : 12/08/2026 08:42</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Auteur : Inf. Aminata Sow</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--foreground)' }}>Statut : <strong>En attente</strong> · Destination : Clinique Pasteur</p>
                  <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#16a34a' }}>
                    Utiliser cette version
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Fusionner manuellement
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Escalader au superviseur
                </button>
              </div>
            </div>
          </div>

          {/* Conflict resolution rules */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Règles de résolution automatique</h2>
            <div className="space-y-3">
              {[
                { rule: 'Données critiques (constantes, urgences)', strategy: 'Conserver la version la plus récente', auto: true, color: '#dc2626' },
                { rule: 'Prescriptions', strategy: 'Conserver la version du médecin prescripteur', auto: true, color: '#d97706' },
                { rule: 'Dossier patient (notes cliniques)', strategy: 'Résolution manuelle obligatoire', auto: false, color: '#2563eb' },
                { rule: 'Résultats de laboratoire', strategy: 'Conserver la version du laborantin', auto: true, color: '#16a34a' },
                { rule: 'Transferts patients', strategy: 'Résolution manuelle obligatoire', auto: false, color: '#7c3aed' },
                { rule: 'Données administratives', strategy: 'Conserver la version la plus récente', auto: true, color: '#64748b' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.rule}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.strategy}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: item.auto ? '#dcfce7' : '#fef3c7', color: item.auto ? '#16a34a' : '#d97706' }}>
                    {item.auto ? 'Auto' : 'Manuel'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT OFFLINE TAB ── */}
      {activeTab === 'audit' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Journal d'audit — Opérations offline</h2>
            <div className="space-y-2">
              {[
                { id: 'AUD-OFF-001', action: 'Consultation enregistrée en mode offline', actor: 'Dr. Mohamed Sy', device: 'Tablette Urgences 1', timestamp: '12/08/2026 09:14', type: 'consultation', result: 'success' },
                { id: 'AUD-OFF-002', action: 'Constantes vitales enregistrées', actor: 'Inf. Fatou Sow', device: 'Mobile Infirmier 3', timestamp: '12/08/2026 09:10', type: 'vitals', result: 'success' },
                { id: 'AUD-OFF-003', action: 'Prescription créée hors ligne', actor: 'Dr. Mohamed Sy', device: 'Tablette Urgences 1', timestamp: '12/08/2026 09:05', type: 'prescription', result: 'success' },
                { id: 'AUD-OFF-004', action: 'Conflit détecté lors de la synchronisation', actor: 'Système SHIFA', device: 'Serveur', timestamp: '12/08/2026 08:45', type: 'conflict', result: 'warning' },
                { id: 'AUD-OFF-005', action: 'Tentative d\'accès données non mises en cache', actor: 'Tech. Aminata Ba', device: 'Tablette Labo', timestamp: '12/08/2026 08:30', type: 'access', result: 'error' },
                { id: 'AUD-OFF-006', action: 'Synchronisation complète réussie', actor: 'Système SHIFA', device: 'Tablette Urgences 1', timestamp: '12/08/2026 08:15', type: 'sync', result: 'success' },
              ].map(event => {
                const resultConfig = {
                  success: { color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
                  warning: { color: '#d97706', bg: '#fef3c7', icon: 'ExclamationTriangleIcon' },
                  error: { color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
                }[event.result];
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: resultConfig.bg }}>
                      <Icon name={resultConfig.icon as any} size={16} style={{ color: resultConfig.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{event.action}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{event.actor} · {event.device}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{event.timestamp}</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{event.id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit summary */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Résumé des opérations offline (7 derniers jours)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Consultations offline', value: '47', color: '#2563eb' },
                { label: 'Prescriptions offline', value: '23', color: '#8b5cf6' },
                { label: 'Constantes enregistrées', value: '156', color: '#16a34a' },
                { label: 'Conflits résolus', value: '4', color: '#d97706' },
              ].map(stat => (
                <div key={stat.label} className="rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
