'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Device {
  id: string;
  name: string;
  type: 'watch' | 'scale' | 'bp_monitor' | 'glucometer' | 'oximeter' | 'thermometer';
  brand: string;
  model: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  battery?: number;
  latestReading?: string;
  latestReadingLabel?: string;
}

const mockDevices: Device[] = [
  { id: 'D001', name: 'Montre connectée', type: 'watch', brand: 'Apple', model: 'Watch Series 9', status: 'connected', lastSync: 'Il y a 5 min', battery: 78, latestReading: '72 bpm', latestReadingLabel: 'Fréquence cardiaque' },
  { id: 'D002', name: 'Tensiomètre connecté', type: 'bp_monitor', brand: 'Omron', model: 'M7 Intelli IT', status: 'connected', lastSync: 'Il y a 2h', battery: 92, latestReading: '128/82 mmHg', latestReadingLabel: 'Tension artérielle' },
  { id: 'D003', name: 'Balance connectée', type: 'scale', brand: 'Withings', model: 'Body+', status: 'connected', lastSync: 'Hier 07:30', battery: 65, latestReading: '74.2 kg', latestReadingLabel: 'Poids' },
  { id: 'D004', name: 'Oxymètre de pouls', type: 'oximeter', brand: 'Beurer', model: 'PO 60', status: 'disconnected', lastSync: 'Il y a 3 jours', battery: 45, latestReading: '98%', latestReadingLabel: 'SpO₂' },
  { id: 'D005', name: 'Glucomètre', type: 'glucometer', brand: 'Accu-Chek', model: 'Guide', status: 'error', lastSync: 'Il y a 7 jours', latestReading: '5.4 mmol/L', latestReadingLabel: 'Glycémie' },
];

const typeConfig = {
  watch: { icon: 'ClockIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  scale: { icon: 'ChartBarIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  bp_monitor: { icon: 'HeartIcon', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  glucometer: { icon: 'BeakerIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  oximeter: { icon: 'SparklesIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)' },
  thermometer: { icon: 'BoltIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
};

const statusConfig = {
  connected: { label: 'Connecté', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
  disconnected: { label: 'Déconnecté', color: '#6b7280', bg: '#f3f4f6', dot: '#6b7280' },
  syncing: { label: 'Synchronisation...', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', dot: 'var(--shifa-blue)' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
};

export default function PatientConnectedDevicesContent() {
  const [activeTab, setActiveTab] = useState<'devices' | 'data' | 'settings'>('devices');

  const connectedCount = mockDevices.filter(d => d.status === 'connected').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Appareils Connectés</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Wearables, capteurs et appareils médicaux connectés à votre dossier SHIFA</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Appareils connectés', value: String(connectedCount), icon: 'WifiIcon', color: '#16a34a' },
          { label: 'Total appareils', value: String(mockDevices.length), icon: 'CpuChipIcon', color: 'var(--shifa-blue)' },
          { label: 'Avec erreur', value: String(mockDevices.filter(d => d.status === 'error').length), icon: 'ExclamationTriangleIcon', color: '#dc2626' },
          { label: 'Dernière synchro', value: 'Il y a 5 min', icon: 'ArrowPathIcon', color: 'var(--shifa-cyan)' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'devices', label: 'Mes appareils', icon: 'CpuChipIcon' },
          { key: 'data', label: 'Données collectées', icon: 'ChartBarIcon' },
          { key: 'settings', label: 'Paramètres', icon: 'Cog6ToothIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
            style={{ color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent' }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'devices' && (
        <div className="space-y-3">
          {mockDevices.map(device => {
            const tc = typeConfig[device.type];
            const sc = statusConfig[device.status];
            return (
              <div key={device.id} className="card-base p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tc.bg }}>
                    <Icon name={tc.icon as any} size={22} style={{ color: tc.color } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{device.name}</p>
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: sc.dot }} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{device.brand} {device.model}</p>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {device.latestReading && (
                        <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{device.latestReadingLabel}: <span style={{ color: tc.color }}>{device.latestReading}</span></span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Synchro: {device.lastSync}</span>
                      {device.battery !== undefined && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: device.battery < 20 ? '#dc2626' : 'var(--muted-foreground)' }}>
                          <Icon name="BoltIcon" size={12} /> {device.battery}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Synchroniser">
                      <Icon name="ArrowPathIcon" size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Paramètres">
                      <Icon name="Cog6ToothIcon" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="w-full card-base p-4 flex items-center justify-center gap-3 border-dashed hover:bg-muted transition-colors" style={{ borderStyle: 'dashed' }}>
            <Icon name="PlusCircleIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} className="" />
            <span className="text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>Ajouter un appareil</span>
          </button>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="card-base p-6 text-center">
          <Icon name="ChartBarIcon" size={40} className="mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Visualisation des données</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Les graphiques de tendances (fréquence cardiaque, tension, poids, SpO₂) seront disponibles en Phase 3 avec la connexion aux APIs des appareils.</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          {[
            { title: 'Synchronisation automatique', desc: 'Synchroniser les données toutes les heures', enabled: true },
            { title: 'Partage avec médecin traitant', desc: 'Autoriser Dr. Mohamed Sy à consulter les données des appareils', enabled: true },
            { title: 'Alertes seuils critiques', desc: 'Recevoir une notification si une valeur dépasse les seuils définis', enabled: true },
            { title: 'Historique 90 jours', desc: 'Conserver les données des appareils pendant 90 jours', enabled: false },
          ].map(setting => (
            <div key={setting.title} className="card-base p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{setting.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{setting.desc}</p>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${setting.enabled ? 'bg-shifa-blue' : 'bg-gray-300'}`} style={{ backgroundColor: setting.enabled ? 'var(--shifa-blue)' : '#d1d5db' }}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${setting.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
