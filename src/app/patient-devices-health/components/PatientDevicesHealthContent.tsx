'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'overview' | 'devices' | 'trends' | 'alerts' | 'settings';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'devices', label: 'Mes appareils', icon: 'CpuChipIcon' },
  { key: 'trends', label: 'Tendances', icon: 'ChartBarIcon' },
  { key: 'alerts', label: 'Alertes', icon: 'BellAlertIcon' },
  { key: 'settings', label: 'Paramètres', icon: 'Cog6ToothIcon' },
];

interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  battery?: number;
  latestReading: string;
  readingLabel: string;
  icon: string;
  color: string;
  bg: string;
  trend: 'stable' | 'up' | 'down';
}

const devices: Device[] = [
  { id: 'D001', name: 'Montre connectée', type: 'Wearable', brand: 'Apple', model: 'Watch Series 9', status: 'connected', lastSync: 'Il y a 5 min', battery: 78, latestReading: '72 bpm', readingLabel: 'Fréquence cardiaque', icon: 'ClockIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)', trend: 'stable' },
  { id: 'D002', name: 'Tensiomètre connecté', type: 'Tension artérielle', brand: 'Omron', model: 'M7 Intelli IT', status: 'connected', lastSync: 'Il y a 2h', battery: 92, latestReading: '128/82 mmHg', readingLabel: 'Tension artérielle', icon: 'HeartIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', trend: 'stable' },
  { id: 'D003', name: 'Balance connectée', type: 'Poids', brand: 'Withings', model: 'Body+', status: 'connected', lastSync: 'Hier 07:30', battery: 65, latestReading: '74.2 kg', readingLabel: 'Poids corporel', icon: 'ChartBarIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', trend: 'down' },
  { id: 'D004', name: 'Oxymètre de pouls', type: 'SpO₂', brand: 'Beurer', model: 'PO 60', status: 'disconnected', lastSync: 'Il y a 3 jours', battery: 45, latestReading: '98%', readingLabel: 'Saturation O₂', icon: 'SparklesIcon', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.08)', trend: 'stable' },
  { id: 'D005', name: 'Glucomètre', type: 'Glycémie', brand: 'Accu-Chek', model: 'Guide', status: 'error', lastSync: 'Il y a 7 jours', latestReading: '5.4 mmol/L', readingLabel: 'Glycémie', icon: 'BeakerIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)', trend: 'up' },
  { id: 'D006', name: 'Thermomètre connecté', type: 'Température', brand: 'Withings', model: 'Thermo', status: 'connected', lastSync: 'Il y a 1h', battery: 88, latestReading: '36.8°C', readingLabel: 'Température', icon: 'BoltIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)', trend: 'stable' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  connected: { label: 'Connecté', color: '#16a34a', bg: '#dcfce7', dot: '#16a34a' },
  disconnected: { label: 'Déconnecté', color: '#6b7280', bg: '#f3f4f6', dot: '#6b7280' },
  syncing: { label: 'Sync...', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', dot: 'var(--shifa-blue)' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', dot: '#dc2626' },
};

const trendConfig: Record<string, { icon: string; color: string }> = {
  stable: { icon: 'MinusIcon', color: '#6b7280' },
  up: { icon: 'ArrowUpIcon', color: '#dc2626' },
  down: { icon: 'ArrowDownIcon', color: 'var(--shifa-green)' },
};

const heartRateData = [
  { time: '06:00', value: 58 }, { time: '08:00', value: 72 }, { time: '10:00', value: 85 },
  { time: '12:00', value: 78 }, { time: '14:00', value: 82 }, { time: '16:00', value: 76 },
  { time: '18:00', value: 88 }, { time: '20:00', value: 70 }, { time: '22:00', value: 62 },
];

const bpData = [
  { date: 'Lun', systolic: 125, diastolic: 80 }, { date: 'Mar', systolic: 130, diastolic: 84 },
  { date: 'Mer', systolic: 122, diastolic: 78 }, { date: 'Jeu', systolic: 128, diastolic: 82 },
  { date: 'Ven', systolic: 135, diastolic: 86 }, { date: 'Sam', systolic: 120, diastolic: 76 },
  { date: 'Dim', systolic: 128, diastolic: 82 },
];

const alerts = [
  { id: 'A001', device: 'Tensiomètre connecté', message: 'Tension artérielle élevée détectée: 145/92 mmHg', severity: 'warning', time: 'Il y a 2h', read: false },
  { id: 'A002', device: 'Glucomètre', message: 'Synchronisation échouée depuis 7 jours — vérifiez la connexion', severity: 'error', time: 'Il y a 7 jours', read: false },
  { id: 'A003', device: 'Oxymètre de pouls', message: 'Appareil déconnecté depuis 3 jours', severity: 'info', time: 'Il y a 3 jours', read: true },
  { id: 'A004', device: 'Montre connectée', message: 'Fréquence cardiaque au repos normale: 58 bpm', severity: 'success', time: 'Ce matin', read: true },
];

const alertConfig: Record<string, { icon: string; color: string; bg: string }> = {
  warning: { icon: 'ExclamationTriangleIcon', color: '#b45309', bg: '#fef3c7' },
  error: { icon: 'XCircleIcon', color: '#dc2626', bg: '#fee2e2' },
  info: { icon: 'InformationCircleIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  success: { icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
};

export default function PatientDevicesHealthContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const connectedCount = devices.filter(d => d.status === 'connected').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Santé Connectée</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--shifa-muted)' }}>Tableau de bord de vos appareils de santé connectés</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {connectedCount} appareils connectés
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Ajouter un appareil
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--shifa-muted)',
              border: `1px solid ${activeTab === t.key ? 'var(--shifa-blue)' : 'var(--shifa-border)'}`,
            }}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
            {t.key === 'alerts' && alerts.filter(a => !a.read).length > 0 && (
              <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center text-white" style={{ background: '#dc2626' }}>
                {alerts.filter(a => !a.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick readings */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.filter(d => d.status === 'connected').map(d => {
              const tr = trendConfig[d.trend];
              return (
                <div key={d.id} className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }} onClick={() => setSelectedDevice(d)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: d.bg }}>
                      <Icon name={d.icon} className="w-5 h-5" style={{ color: d.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--shifa-dark)' }}>{d.name}</p>
                      <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{d.brand} {d.model}</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--shifa-dark)' }}>{d.latestReading}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{d.readingLabel}</p>
                    <Icon name={tr.icon} className="w-4 h-4" style={{ color: tr.color }} />
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--shifa-muted)' }}>Sync: {d.lastSync}</p>
                </div>
              );
            })}
          </div>

          {/* Heart rate chart */}
          <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Fréquence cardiaque — Aujourd'hui</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--shifa-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--shifa-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--shifa-muted)' }} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" name="bpm" stroke="var(--shifa-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Devices list */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map(d => {
            const st = statusConfig[d.status];
            return (
              <div key={d.id} className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: d.bg }}>
                    <Icon name={d.icon} className="w-6 h-6" style={{ color: d.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>{d.name}</p>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{d.brand} · {d.model}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: st.dot }}></span>
                    <span className="text-xs font-medium" style={{ color: st.color }}>{st.label}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-lg p-2.5" style={{ background: 'var(--shifa-bg)' }}>
                    <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>{d.readingLabel}</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--shifa-dark)' }}>{d.latestReading}</p>
                  </div>
                  {d.battery !== undefined && (
                    <div className="rounded-lg p-2.5" style={{ background: 'var(--shifa-bg)' }}>
                      <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Batterie</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--shifa-border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${d.battery}%`, background: d.battery > 50 ? 'var(--shifa-green)' : d.battery > 20 ? 'var(--shifa-amber)' : '#dc2626' }}></div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--shifa-dark)' }}>{d.battery}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Dernière sync: {d.lastSync}</p>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-muted)' }}>
                    Configurer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Tension artérielle — 7 derniers jours</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--shifa-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--shifa-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--shifa-muted)' }} domain={[60, 160]} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" name="Systolique" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolique" stroke="var(--shifa-blue)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border p-5" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Fréquence cardiaque — Aujourd'hui</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--shifa-border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--shifa-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--shifa-muted)' }} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" name="bpm" stroke="var(--shifa-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map(a => {
            const cfg = alertConfig[a.severity];
            return (
              <div key={a.id} className="rounded-xl border p-4 flex items-start gap-3" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)', opacity: a.read ? 0.7 : 1 }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                  <Icon name={cfg.icon} className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{a.device}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{a.message}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--shifa-muted)' }}>{a.time}</p>
                </div>
                {!a.read && <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: cfg.color }}></span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-xl border p-6" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--shifa-dark)' }}>Paramètres des appareils connectés</h3>
          <div className="space-y-4">
            {[
              { label: 'Synchronisation automatique', desc: 'Synchroniser les données en arrière-plan', enabled: true },
              { label: 'Alertes de santé', desc: 'Recevoir des alertes en cas de valeurs anormales', enabled: true },
              { label: 'Partage avec mon médecin', desc: 'Autoriser mon médecin à consulter mes données', enabled: false },
              { label: 'Historique étendu', desc: 'Conserver les données sur 12 mois', enabled: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--shifa-border)' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{s.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${s.enabled ? '' : ''}`} style={{ background: s.enabled ? 'var(--shifa-blue)' : 'var(--shifa-border)' }}>
                  <div className="w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform" style={{ transform: s.enabled ? 'translateX(22px)' : 'translateX(2px)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
