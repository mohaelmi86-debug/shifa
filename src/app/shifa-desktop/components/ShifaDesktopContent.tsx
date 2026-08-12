'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';


type DesktopTab = 'auth' | 'orgs' | 'workspace' | 'devices' | 'sync';

interface Organization {
  id: string;
  name: string;
  type: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  lastAccess: string;
  modules: number;
}

interface ConnectedDevice {
  id: string;
  name: string;
  os: string;
  lastSeen: string;
  location: string;
  status: 'active' | 'inactive' | 'revoked';
  trusted: boolean;
  current: boolean;
}

const mockOrgs: Organization[] = [
  { id: 'ORG-001', name: 'CHU Saint-Louis', type: 'Hôpital universitaire', role: 'Médecin — Cardiologie', status: 'active', lastAccess: 'Aujourd\'hui 09:14', modules: 12 },
  { id: 'ORG-002', name: 'Clinique Pasteur', type: 'Clinique privée', role: 'Médecin consultant', status: 'active', lastAccess: 'Hier 16:30', modules: 7 },
  { id: 'ORG-003', name: 'Cabinet Dr. Sy', type: 'Cabinet libéral', role: 'Propriétaire', status: 'active', lastAccess: 'Il y a 3 jours', modules: 4 },
  { id: 'ORG-004', name: 'Centre de Santé Médina', type: 'Centre de santé', role: 'Médecin vacataire', status: 'pending', lastAccess: 'Jamais', modules: 0 },
];

const mockDevices: ConnectedDevice[] = [
  { id: 'DEV-001', name: 'MacBook Pro 16"', os: 'macOS 15.2', lastSeen: 'Maintenant', location: 'Dakar, Sénégal', status: 'active', trusted: true, current: true },
  { id: 'DEV-002', name: 'Windows PC — Bureau', os: 'Windows 11 Pro', lastSeen: 'Hier 18:45', location: 'Dakar, Sénégal', status: 'active', trusted: true, current: false },
  { id: 'DEV-003', name: 'iPhone 15 Pro', os: 'iOS 18.1', lastSeen: 'Il y a 2h', location: 'Dakar, Sénégal', status: 'active', trusted: true, current: false },
  { id: 'DEV-004', name: 'iPad Pro', os: 'iPadOS 18.1', lastSeen: 'Il y a 5 jours', location: 'Saint-Louis, Sénégal', status: 'inactive', trusted: false, current: false },
  { id: 'DEV-005', name: 'Appareil inconnu', os: 'Linux Ubuntu', lastSeen: 'Il y a 12 jours', location: 'Paris, France', status: 'revoked', trusted: false, current: false },
];

const statusConfig = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
  suspended: { label: 'Suspendu', color: '#dc2626', bg: '#fee2e2' },
  inactive: { label: 'Inactif', color: '#6b7280', bg: '#f3f4f6' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2' },
};

const orgTypeIcon: Record<string, string> = {
  'Hôpital universitaire': 'BuildingOffice2Icon',
  'Clinique privée': 'BuildingOfficeIcon',
  'Cabinet libéral': 'HomeIcon',
  'Centre de santé': 'HeartIcon',
};

export default function ShifaDesktopContent() {
  const [activeTab, setActiveTab] = useState<DesktopTab>('auth');
  const [selectedOrg, setSelectedOrg] = useState<string>('ORG-001');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const tabs: { key: DesktopTab; label: string; icon: string }[] = [
    { key: 'auth', label: 'Authentification', icon: 'ShieldCheckIcon' },
    { key: 'orgs', label: 'Organisations', icon: 'BuildingOffice2Icon' },
    { key: 'workspace', label: 'Espace de travail', icon: 'ComputerDesktopIcon' },
    { key: 'devices', label: 'Appareils', icon: 'DevicePhoneMobileIcon' },
    { key: 'sync', label: 'Synchronisation', icon: 'ArrowPathIcon' },
  ];

  function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
      <button
        onClick={onChange}
        className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
        style={{ backgroundColor: checked ? 'var(--shifa-blue)' : 'var(--border)' }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: checked ? '22px' : '4px' }}
        />
      </button>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
              <Icon name="ComputerDesktopIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA Desktop</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Surface desktop sécurisée — Windows · macOS · Linux</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            Session active
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
            v2.4.1
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Organisations actives', value: '3', icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)' },
          { label: 'Appareils de confiance', value: '3', icon: 'ShieldCheckIcon', color: '#16a34a' },
          { label: 'Session en cours', value: 'MacBook Pro', icon: 'ComputerDesktopIcon', color: 'var(--shifa-cyan)' },
          { label: 'Dernière synchro', value: 'Il y a 2 min', icon: 'ArrowPathIcon', color: '#8b5cf6' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Auth */}
      {activeTab === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session info */}
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Session active</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--muted)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                MS
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Médecin généraliste · SH-2-SN-2025-7K4D</p>
                <p className="text-xs mt-0.5" style={{ color: '#16a34a' }}>Connecté depuis 09:14 · MacBook Pro 16"</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Expiration de session', value: 'Dans 7h 46min', icon: 'ClockIcon' },
                { label: 'Méthode d\'authentification', value: 'Email + MFA TOTP', icon: 'KeyIcon' },
                { label: 'IP de connexion', value: '41.82.xxx.xxx (Dakar)', icon: 'GlobeAltIcon' },
                { label: 'Niveau de sécurité', value: 'Élevé', icon: 'ShieldCheckIcon' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <Icon name={item.icon as any} size={14} className="text-muted-foreground" />
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#dc2626' }}>
              Terminer la session
            </button>
          </div>

          {/* Security settings */}
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Sécurité desktop</h3>
            <div className="space-y-4">
              {[
                { label: 'Authentification à deux facteurs (MFA)', desc: 'TOTP via application d\'authentification', checked: mfaEnabled, onChange: () => setMfaEnabled(v => !v), required: true },
                { label: 'Authentification biométrique', desc: 'Touch ID / Windows Hello / Empreinte', checked: biometricEnabled, onChange: () => setBiometricEnabled(v => !v), required: false },
                { label: 'Verrouillage automatique', desc: 'Verrouiller après 15 min d\'inactivité', checked: autoLock, onChange: () => setAutoLock(v => !v), required: false },
                { label: 'Mode hors-ligne limité', desc: 'Accès lecture seule sans connexion', checked: offlineMode, onChange: () => setOfflineMode(v => !v), required: false },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                      {item.required && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Requis</span>}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                  <Toggle checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
              <div className="flex items-start gap-2">
                <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                  La session desktop est liée à votre compte SHIFA Cloud. Toute action clinique est journalisée et synchronisée en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Orgs */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez l'organisation active pour cette session desktop</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={16} />
              Rejoindre une org.
            </button>
          </div>
          {mockOrgs.map(org => {
            const s = statusConfig[org.status];
            const isSelected = selectedOrg === org.id;
            return (
              <div
                key={org.id}
                onClick={() => org.status === 'active' && setSelectedOrg(org.id)}
                className="card-base p-5 flex items-center gap-4 transition-all cursor-pointer"
                style={{
                  border: isSelected ? '2px solid var(--shifa-blue)' : '1px solid var(--border)',
                  opacity: org.status !== 'active' ? 0.6 : 1,
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Icon name={(orgTypeIcon[org.type] || 'BuildingOfficeIcon') as any} size={22} style={{ color: 'var(--shifa-blue)' } as any} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{org.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    {isSelected && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Active</span>}
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{org.type} · {org.role}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Dernier accès : {org.lastAccess} · {org.modules} modules</p>
                </div>
                {org.status === 'active' && (
                  <Icon name={isSelected ? 'CheckCircleIcon' : 'ChevronRightIcon'} size={20} style={{ color: isSelected ? 'var(--shifa-blue)' : 'var(--muted-foreground)' } as any} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Workspace */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card-base p-6">
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Espace de travail professionnel</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Tableau de bord', icon: 'Squares2X2Icon', href: '/workspace-professionnel', color: 'var(--shifa-blue)' },
                  { label: 'Agenda', icon: 'CalendarDaysIcon', href: '/pro-agenda', color: '#8b5cf6' },
                  { label: 'Patients', icon: 'UsersIcon', href: '/pro-patients', color: '#16a34a' },
                  { label: 'Consultations', icon: 'ClipboardDocumentListIcon', href: '/consultation-workspace', color: '#f59e0b' },
                  { label: 'Messagerie', icon: 'ChatBubbleLeftRightIcon', href: '/pro-messages', color: 'var(--shifa-cyan)' },
                  { label: 'Prescriptions', icon: 'DocumentCheckIcon', href: '/pro-prescriptions', color: '#ec4899' },
                  { label: 'Résultats', icon: 'BeakerIcon', href: '/pro-resultats', color: '#06b6d4' },
                  { label: 'Téléconsultation', icon: 'VideoCameraIcon', href: '/teleconsultation-lobby', color: '#6366f1' },
                  { label: 'SHIFA AI', icon: 'CpuChipIcon', href: '/shifa-ai-workspace', color: '#0ea5e9' },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}18` }}>
                      <Icon name={item.icon as any} size={20} style={{ color: item.color } as any} />
                    </div>
                    <span className="text-xs font-semibold text-center" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="card-base p-6">
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Activité récente</h3>
              <div className="space-y-3">
                {[
                  { action: 'Consultation terminée', detail: 'Oumar Diallo — Cardio', time: 'Il y a 45 min', icon: 'ClipboardDocumentListIcon', color: '#16a34a' },
                  { action: 'Ordonnance signée', detail: 'Fatou Seck — Renouvellement', time: 'Il y a 1h20', icon: 'DocumentCheckIcon', color: 'var(--shifa-blue)' },
                  { action: 'Résultat reçu', detail: 'Bilan lipidique — Labo Central', time: 'Il y a 2h', icon: 'BeakerIcon', color: '#f59e0b' },
                  { action: 'Message reçu', detail: 'Dr. Ndiaye — Adressage urgent', time: 'Il y a 3h', icon: 'ChatBubbleLeftRightIcon', color: '#8b5cf6' },
                ].map(item => (
                  <div key={item.action} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}18` }}>
                      <Icon name={item.icon as any} size={16} style={{ color: item.color } as any} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.action}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.detail}</p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Organisation active</h3>
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
                <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>CHU Saint-Louis</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Médecin — Cardiologie</p>
                <p className="text-xs mt-1" style={{ color: '#16a34a' }}>● 12 modules actifs</p>
              </div>
            </div>
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Notifications en attente</h3>
              <div className="space-y-2">
                {[
                  { label: '3 résultats à valider', color: '#f59e0b' },
                  { label: '2 messages non lus', color: 'var(--shifa-blue)' },
                  { label: '1 adressage urgent', color: '#dc2626' },
                ].map(n => (
                  <div key={n.label} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
                    <span style={{ color: 'var(--foreground)' }}>{n.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Devices */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Appareils autorisés à accéder à votre compte SHIFA</p>
          </div>
          {mockDevices.map(device => {
            const s = statusConfig[device.status];
            return (
              <div key={device.id} className="card-base p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: device.current ? 'rgba(0,102,255,0.1)' : 'var(--muted)' }}>
                  <Icon
                    name={device.os.includes('iOS') || device.os.includes('iPadOS') ? 'DevicePhoneMobileIcon' : 'ComputerDesktopIcon'}
                    size={22}
                    style={{ color: device.current ? 'var(--shifa-blue)' : 'var(--muted-foreground)' } as any}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{device.name}</p>
                    {device.current && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Cet appareil</span>}
                    {device.trusted && !device.current && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>De confiance</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{device.os} · {device.location}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Dernière activité : {device.lastSeen}</p>
                </div>
                {!device.current && device.status !== 'revoked' && (
                  <button className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all hover:opacity-80" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    Révoquer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Sync */}
      {activeTab === 'sync' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>État de synchronisation</h3>
            <div className="space-y-3">
              {[
                { label: 'Dossiers patients', status: 'Synchronisé', time: 'Il y a 2 min', icon: 'FolderOpenIcon', ok: true },
                { label: 'Agenda & rendez-vous', status: 'Synchronisé', time: 'Il y a 2 min', icon: 'CalendarDaysIcon', ok: true },
                { label: 'Prescriptions', status: 'Synchronisé', time: 'Il y a 5 min', icon: 'DocumentCheckIcon', ok: true },
                { label: 'Résultats de labo', status: 'En attente', time: '—', icon: 'BeakerIcon', ok: false },
                { label: 'Documents & images', status: 'Synchronisé', time: 'Il y a 8 min', icon: 'PhotoIcon', ok: true },
                { label: 'Messages sécurisés', status: 'Synchronisé', time: 'Il y a 1 min', icon: 'ChatBubbleLeftRightIcon', ok: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <Icon name={item.icon as any} size={16} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.ok ? '#dcfce7' : '#fef3c7', color: item.ok ? '#16a34a' : '#d97706' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="ArrowPathIcon" size={16} />
              Forcer la synchronisation
            </button>
          </div>
          <div className="card-base p-6">
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Paramètres de synchronisation</h3>
            <div className="space-y-4">
              {[
                { label: 'Synchronisation automatique', desc: 'Toutes les 5 minutes', checked: true },
                { label: 'Synchronisation sur Wi-Fi uniquement', desc: 'Économiser les données mobiles', checked: false },
                { label: 'Notifications push desktop', desc: 'Alertes en temps réel', checked: true },
                { label: 'Cache local chiffré', desc: 'Accès hors-ligne limité (lecture)', checked: true },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full shrink-0" style={{ backgroundColor: item.checked ? 'var(--shifa-blue)' : 'var(--border)' }}>
                    <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" style={{ left: item.checked ? '22px' : '4px' }} />
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
