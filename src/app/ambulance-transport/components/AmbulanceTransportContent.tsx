'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'dispatch' | 'fleet' | 'crew' | 'history';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'dispatch', label: 'Dispatch', icon: 'BoltIcon' },
  { key: 'fleet', label: 'Flotte', icon: 'TruckIcon' },
  { key: 'crew', label: 'Équipes', icon: 'UsersIcon' },
  { key: 'history', label: 'Historique', icon: 'ClockIcon' },
];

const ambulances = [
  { id: 'AMB-01', type: 'SMUR', status: 'available', crew: 'Équipe Alpha', location: 'Base centrale', lastMission: '08/08/2026 14:30' },
  { id: 'AMB-02', type: 'UMH', status: 'on_mission', crew: 'Équipe Bravo', location: 'En route — Dakar Nord', lastMission: 'En cours' },
  { id: 'AMB-03', type: 'VSL', status: 'available', crew: 'Équipe Charlie', location: 'Base Sud', lastMission: '08/08/2026 11:15' },
  { id: 'AMB-04', type: 'SMUR', status: 'maintenance', crew: '—', location: 'Atelier', lastMission: '07/08/2026 09:00' },
];

const activeRequests = [
  { id: 'REQ-0091', type: 'Urgence vitale', origin: 'CHU Saint-Louis', destination: 'Réanimation — CHU', priority: 'P1', status: 'dispatched', eta: '8 min' },
  { id: 'REQ-0090', type: 'Transport programmé', origin: 'Domicile patient', destination: 'Dialyse — Clinique A', priority: 'P3', status: 'scheduled', eta: '45 min' },
  { id: 'REQ-0089', type: 'Inter-établissement', origin: 'Hôpital Régional', destination: 'CHU — Cardiologie', priority: 'P2', status: 'en_route', eta: '22 min' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  on_mission: { label: 'En mission', bg: '#fef9c3', color: '#ca8a04' },
  maintenance: { label: 'Maintenance', bg: '#fee2e2', color: '#dc2626' },
  dispatched: { label: 'Dépêché', bg: '#fef9c3', color: '#ca8a04' },
  scheduled: { label: 'Planifié', bg: '#f1f5f9', color: '#64748b' },
  en_route: { label: 'En route', bg: '#dbeafe', color: '#2563eb' },
  P1: { label: 'P1 — Critique', bg: '#fee2e2', color: '#dc2626' },
  P2: { label: 'P2 — Urgent', bg: '#ffedd5', color: '#ea580c' },
  P3: { label: 'P3 — Standard', bg: '#f1f5f9', color: '#64748b' },
};

export default function AmbulanceTransportContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const available = ambulances.filter(a => a.status === 'available').length;
  const onMission = ambulances.filter(a => a.status === 'on_mission').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
              <Icon name="TruckIcon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Ambulances & Transport Médical</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Dispatch, flotte, équipes et suivi des missions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            {available} disponible(s)
          </span>
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}>
            {onMission} en mission
          </span>
          <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon name="PlusIcon" size={16} />
            Nouvelle demande
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            style={{ borderColor: activeTab === t.key ? '#ea580c' : 'transparent', color: activeTab === t.key ? '#ea580c' : 'var(--muted-foreground)' }}
          >
            <Icon name={t.icon as any} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Ambulances disponibles', value: String(available), color: '#16a34a', icon: 'TruckIcon' },
              { label: 'En mission', value: String(onMission), color: '#ca8a04', icon: 'BoltIcon' },
              { label: 'Demandes actives', value: String(activeRequests.length), color: '#ea580c', icon: 'ClipboardDocumentListIcon' },
              { label: 'Missions (30j)', value: '142', color: 'var(--shifa-blue)', icon: 'ChartBarIcon' },
            ].map(kpi => (
              <div key={kpi.label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color } as any} />
                </div>
                <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Active requests */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Demandes actives</h3>
            <div className="space-y-3">
              {activeRequests.map(req => {
                const priCfg = statusConfig[req.priority];
                const stCfg = statusConfig[req.status];
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ffedd5' }}>
                        <Icon name="TruckIcon" size={18} style={{ color: '#ea580c' } as any} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{req.id} — {req.type}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.origin} → {req.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: priCfg.bg, color: priCfg.color }}>{priCfg.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                      <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>ETA: {req.eta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Centre de dispatch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Type de transport', placeholder: 'Urgence vitale / Programmé / Inter-établissement' },
                { label: 'Priorité', placeholder: 'P1 — Critique / P2 — Urgent / P3 — Standard' },
                { label: 'Lieu de prise en charge', placeholder: 'Adresse ou établissement' },
                { label: 'Destination', placeholder: 'Établissement de destination' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{f.label.toUpperCase()}</label>
                  <input className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted-foreground)' }}>AMBULANCE À DÉPÊCHER</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ambulances.filter(a => a.status === 'available').map(amb => (
                  <div key={amb.id} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-orange-400 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <input type="radio" name="ambulance" className="accent-orange-500" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{amb.id} — {amb.type}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{amb.crew} · {amb.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">Dépêcher l'ambulance</button>
          </div>
        </div>
      )}

      {/* Fleet */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Gestion de la flotte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ambulances.map(amb => {
              const cfg = statusConfig[amb.status];
              return (
                <div key={amb.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ffedd5' }}>
                        <Icon name="TruckIcon" size={18} style={{ color: '#ea580c' } as any} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{amb.id}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{amb.type}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <div className="space-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <p>Équipe : <span style={{ color: 'var(--foreground)' }}>{amb.crew}</span></p>
                    <p>Position : <span style={{ color: 'var(--foreground)' }}>{amb.location}</span></p>
                    <p>Dernière mission : <span style={{ color: 'var(--foreground)' }}>{amb.lastMission}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crew */}
      {activeTab === 'crew' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Équipes de transport médical</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Équipe Alpha', 'Équipe Bravo', 'Équipe Charlie'].map((team, i) => (
              <div key={team} className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>{team[7]}</div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{team}</p>
                </div>
                <div className="space-y-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <p>Conducteur : <span style={{ color: 'var(--foreground)' }}>Agent {i + 1}</span></p>
                  <p>Infirmier : <span style={{ color: 'var(--foreground)' }}>IDE {i + 1}</span></p>
                  <p>Statut : <span className="font-medium" style={{ color: i === 1 ? '#ca8a04' : '#16a34a' }}>{i === 1 ? 'En mission' : 'Disponible'}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Historique des missions</h2>
          <div className="card p-5 text-center py-10">
            <Icon name="ClockIcon" size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' } as any} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Historique complet des missions de transport médical</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Filtres par date, type, équipe et statut disponibles</p>
          </div>
        </div>
      )}
    </div>
  );
}
