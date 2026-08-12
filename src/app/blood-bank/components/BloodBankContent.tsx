'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'donors' | 'inventory' | 'requests' | 'transfusions' | 'traceability';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const inventoryData = [
  { group: 'O+', units: 42, critical: false, expiringSoon: 3 },
  { group: 'A+', units: 28, critical: false, expiringSoon: 1 },
  { group: 'B+', units: 15, critical: false, expiringSoon: 0 },
  { group: 'AB+', units: 6, critical: true, expiringSoon: 0 },
  { group: 'O-', units: 4, critical: true, expiringSoon: 2 },
  { group: 'A-', units: 9, critical: false, expiringSoon: 0 },
  { group: 'B-', units: 3, critical: true, expiringSoon: 0 },
  { group: 'AB-', units: 2, critical: true, expiringSoon: 0 },
];

const recentDonors = [
  { id: 'DON-001', name: 'Moussa Diallo', group: 'O+', date: '08/08/2026', status: 'validated', units: 1 },
  { id: 'DON-002', name: 'Fatou Ndiaye', group: 'A+', date: '07/08/2026', status: 'testing', units: 1 },
  { id: 'DON-003', name: 'Ibrahima Sow', group: 'B-', date: '06/08/2026', status: 'validated', units: 1 },
  { id: 'DON-004', name: 'Aminata Bâ', group: 'AB+', date: '05/08/2026', status: 'deferred', units: 0 },
];

const bloodRequests = [
  { id: 'REQ-2026-0041', patient: 'Patient A', ward: 'Chirurgie', group: 'O-', units: 2, urgency: 'urgent', status: 'pending' },
  { id: 'REQ-2026-0040', patient: 'Patient B', ward: 'Maternité', group: 'A+', units: 1, urgency: 'standard', status: 'fulfilled' },
  { id: 'REQ-2026-0039', patient: 'Patient C', ward: 'Réanimation', group: 'AB-', units: 3, urgency: 'critical', status: 'pending' },
  { id: 'REQ-2026-0038', patient: 'Patient D', ward: 'Pédiatrie', group: 'B+', units: 1, urgency: 'standard', status: 'fulfilled' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  validated: { label: 'Validé', bg: '#dcfce7', color: '#16a34a' },
  testing: { label: 'En analyse', bg: '#fef9c3', color: '#ca8a04' },
  deferred: { label: 'Différé', bg: '#fee2e2', color: '#dc2626' },
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  fulfilled: { label: 'Satisfait', bg: '#dcfce7', color: '#16a34a' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  urgent: { label: 'Urgent', bg: '#ffedd5', color: '#ea580c' },
  standard: { label: 'Standard', bg: '#f1f5f9', color: '#64748b' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'donors', label: 'Donneurs', icon: 'UsersIcon' },
  { key: 'inventory', label: 'Stock', icon: 'ArchiveBoxIcon' },
  { key: 'requests', label: 'Demandes', icon: 'ClipboardDocumentListIcon' },
  { key: 'transfusions', label: 'Transfusions', icon: 'BeakerIcon' },
  { key: 'traceability', label: 'Traçabilité', icon: 'MagnifyingGlassIcon' },
];

export default function BloodBankContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
              <Icon name="BeakerIcon" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Banque de Sang</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Gestion des dons, stocks, compatibilité et transfusions</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            4 groupes en stock critique
          </span>
          <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Icon name="PlusIcon" size={16} />
            Nouveau don
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key ? 'border-red-600 text-red-600' : 'border-transparent'}`}
            style={{ color: activeTab === t.key ? '#dc2626' : 'var(--muted-foreground)' }}
          >
            <Icon name={t.icon as any} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Unités disponibles', value: '109', icon: 'ArchiveBoxIcon', color: '#dc2626' },
              { label: 'Dons ce mois', value: '34', icon: 'UsersIcon', color: 'var(--shifa-blue)' },
              { label: 'Transfusions (30j)', value: '28', icon: 'BeakerIcon', color: '#8b5cf6' },
              { label: 'Groupes critiques', value: '4', icon: 'ExclamationTriangleIcon', color: '#ea580c' },
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

          {/* Inventory overview */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Stock par groupe sanguin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {inventoryData.map(item => (
                <div key={item.group} className="rounded-xl p-3 text-center border" style={{ borderColor: item.critical ? '#fca5a5' : 'var(--border)', backgroundColor: item.critical ? '#fff5f5' : 'var(--muted)' }}>
                  <p className="text-lg font-bold" style={{ color: item.critical ? '#dc2626' : 'var(--foreground)' }}>{item.group}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: item.critical ? '#dc2626' : 'var(--shifa-blue)' }}>{item.units}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>unités</p>
                  {item.critical && <p className="text-xs mt-1 font-semibold" style={{ color: '#dc2626' }}>⚠ Critique</p>}
                  {item.expiringSoon > 0 && <p className="text-xs mt-0.5" style={{ color: '#ea580c' }}>{item.expiringSoon} expirent bientôt</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent requests */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Demandes récentes</h3>
            <div className="space-y-2">
              {bloodRequests.map(req => {
                const urgCfg = statusConfig[req.urgency];
                const stCfg = statusConfig[req.status];
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#dc2626' }}>{req.group}</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{req.id}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.ward} — {req.units} unité(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: urgCfg.bg, color: urgCfg.color }}>{urgCfg.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Registre des donneurs</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Enregistrer un don
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID Don', 'Donneur', 'Groupe', 'Date', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDonors.map((d, i) => {
                  const cfg = statusConfig[d.status];
                  return (
                    <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.id}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{d.name}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#dc2626' }}>{d.group}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.date}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Voir</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Gestion du stock sanguin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryData.map(item => (
              <div key={item.group} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold px-3 py-1 rounded-xl text-white" style={{ backgroundColor: '#dc2626' }}>{item.group}</span>
                  {item.critical && <Icon name="ExclamationTriangleIcon" size={18} style={{ color: '#ea580c' } as any} />}
                </div>
                <p className="text-3xl font-bold" style={{ color: item.critical ? '#dc2626' : 'var(--foreground)' }}>{item.units}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>unités disponibles</p>
                {item.expiringSoon > 0 && (
                  <p className="text-xs mt-2 font-medium" style={{ color: '#ea580c' }}>⚠ {item.expiringSoon} unité(s) expirent sous 7j</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 text-xs py-1.5 rounded-lg border text-center" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Détail</button>
                  <button className="flex-1 text-xs py-1.5 rounded-lg text-center text-white" style={{ backgroundColor: '#dc2626' }}>Réserver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Demandes de sang</h2>
            <button className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <Icon name="PlusIcon" size={15} /> Nouvelle demande
            </button>
          </div>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['Réf.', 'Service', 'Groupe', 'Unités', 'Urgence', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloodRequests.map(req => {
                  const urgCfg = statusConfig[req.urgency];
                  const stCfg = statusConfig[req.status];
                  return (
                    <tr key={req.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{req.id}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{req.ward}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#dc2626' }}>{req.group}</span></td>
                      <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{req.units}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: urgCfg.bg, color: urgCfg.color }}>{urgCfg.label}</span></td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span></td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Traiter</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfusions Tab */}
      {activeTab === 'transfusions' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Suivi des transfusions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Transfusions ce mois', value: '28', color: '#dc2626' },
              { label: 'En cours', value: '3', color: '#ea580c' },
              { label: 'Incidents signalés', value: '0', color: '#16a34a' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              Historique complet des transfusions — disponible après connexion au module clinique
            </p>
          </div>
        </div>
      )}

      {/* Traceability Tab */}
      {activeTab === 'traceability' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Traçabilité — Du don à la transfusion</h2>
          <div className="card p-5">
            <div className="flex gap-3 mb-4">
              <input className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }} placeholder="Rechercher par ID de poche, donneur ou patient..." />
              <button className="btn-primary px-4 py-2 rounded-xl text-sm">Rechercher</button>
            </div>
            <div className="text-center py-8">
              <Icon name="MagnifyingGlassIcon" size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' } as any} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Saisissez un identifiant pour tracer une unité sanguine</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Chaque unité est tracée du prélèvement à la transfusion</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
