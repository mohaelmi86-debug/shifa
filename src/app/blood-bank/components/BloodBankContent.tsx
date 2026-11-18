'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

type TabKey = 'dashboard' | 'donors' | 'inventory' | 'requests' | 'transfusions' | 'traceability';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const staticInventory = [
  { group: 'O+', units: 42, critical: false, expiringSoon: 3 },
  { group: 'A+', units: 28, critical: false, expiringSoon: 1 },
  { group: 'B+', units: 15, critical: false, expiringSoon: 0 },
  { group: 'AB+', units: 6, critical: true, expiringSoon: 0 },
  { group: 'O-', units: 4, critical: true, expiringSoon: 2 },
  { group: 'A-', units: 9, critical: false, expiringSoon: 0 },
  { group: 'B-', units: 3, critical: true, expiringSoon: 0 },
  { group: 'AB-', units: 2, critical: true, expiringSoon: 0 },
];

const staticDonors = [
  { id: 'DON-001', name: 'Moussa Diallo', group: 'O+', date: '08/08/2026', status: 'validated', units: 1 },
  { id: 'DON-002', name: 'Fatou Ndiaye', group: 'A+', date: '07/08/2026', status: 'testing', units: 1 },
  { id: 'DON-003', name: 'Ibrahima Sow', group: 'B-', date: '06/08/2026', status: 'validated', units: 1 },
  { id: 'DON-004', name: 'Aminata Bâ', group: 'AB+', date: '05/08/2026', status: 'deferred', units: 0 },
];

const staticRequests = [
  { id: 'REQ-2026-0041', patient: 'Patient A', ward: 'Chirurgie', group: 'O-', units: 2, urgency: 'urgent', status: 'pending' },
  { id: 'REQ-2026-0040', patient: 'Patient B', ward: 'Maternité', group: 'A+', units: 1, urgency: 'standard', status: 'fulfilled' },
  { id: 'REQ-2026-0039', patient: 'Patient C', ward: 'Réanimation', group: 'AB-', units: 3, urgency: 'critical', status: 'pending' },
  { id: 'REQ-2026-0038', patient: 'Patient D', ward: 'Pédiatrie', group: 'B+', units: 1, urgency: 'standard', status: 'fulfilled' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  validated: { label: 'Validé', bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  testing: { label: 'En analyse', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  deferred: { label: 'Différé', bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
  pending: { label: 'En attente', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  fulfilled: { label: 'Satisfait', bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  critical: { label: 'Critique', bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
  urgent: { label: 'Urgent', bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  standard: { label: 'Standard', bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)' },
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
  const [dbInventory, setDbInventory] = useState<any[]>([]);
  const [dbRequests, setDbRequests] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    fetchBloodBankData();
  }, []);

  const fetchBloodBankData = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const supabase = createClient();
      const [invRes, reqRes] = await Promise.all([
        supabase.from('blood_bank_inventory').select('*').order('blood_group', { ascending: true }),
        supabase.from('blood_requests').select('*').order('created_at', { ascending: false }).limit(20),
      ]);
      if (invRes.error) throw invRes.error;
      if (reqRes.error) throw reqRes.error;
      setDbInventory(invRes.data || []);
      setDbRequests(reqRes.data || []);
    } catch (err: any) {
      setDbError(err?.message || 'Erreur lors du chargement des données.');
    } finally {
      setDbLoading(false);
    }
  };

  // Merge DB inventory with static display
  const displayInventory = dbInventory.length > 0
    ? dbInventory.map((item: any) => ({
        group: item.blood_group || '—',
        units: item.units_available || 0,
        critical: (item.units_available || 0) < 5,
        expiringSoon: item.expiring_soon || 0,
      }))
    : staticInventory;

  const displayRequests = dbRequests.length > 0
    ? dbRequests.map((r: any) => ({
        id: r.id?.slice(0, 12) || '—',
        patient: r.patient_id || 'Patient',
        ward: r.ward || '—',
        group: r.blood_group || '—',
        units: r.units_requested || 1,
        urgency: r.urgency || 'standard',
        status: r.status || 'pending',
      }))
    : staticRequests;

  const criticalGroups = displayInventory.filter(i => i.critical).length;

  const kpis = [
    { label: 'Poches disponibles', value: String(displayInventory.reduce((a, b) => a + b.units, 0)), icon: 'ArchiveBoxIcon', color: 'var(--shifa-blue)' },
    { label: 'Groupes critiques', value: String(criticalGroups), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
    { label: 'Demandes en attente', value: String(displayRequests.filter(r => r.status === 'pending').length), icon: 'ClockIcon', color: 'var(--shifa-amber)' },
    { label: 'Donneurs récents', value: String(staticDonors.length), icon: 'UsersIcon', color: 'var(--shifa-green)' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Premium Page Header — SHIFA design tokens */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 55%, #ef4444 100%)',
          boxShadow: '0 8px 32px rgba(220,38,38,0.3)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <Icon name="BeakerIcon" size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {dbInventory.length > 0 ? `${dbInventory.length} groupes en base` : 'Données de démonstration'}
                </span>
                {dbLoading && <Icon name="ArrowPathIcon" size={14} className="text-white animate-spin" />}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
                Banque de Sang
              </h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Gestion des dons, stocks, compatibilité et transfusions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchBloodBankData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Icon name="ArrowPathIcon" size={15} className={dbLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#dc2626' }}>
              <Icon name="PlusIcon" size={15} />
              Nouveau don
            </button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={kpi.icon as any} size={14} className="text-white opacity-80" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{kpi.label}</span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {dbError && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6 border" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <Icon name="ExclamationCircleIcon" size={18} style={{ color: 'var(--shifa-red)' }} />
          <p className="text-sm" style={{ color: 'var(--shifa-red)' }}>{dbError} — Affichage des données de démonstration.</p>
          <button onClick={fetchBloodBankData} className="ml-auto text-xs font-semibold" style={{ color: 'var(--shifa-red)' }}>Réessayer</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {dbLoading ? (
            <div className="rounded-2xl border p-12 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#dc2626', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des données…</p>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Stock par groupe sanguin</h3>
                  {dbInventory.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Données Supabase</span>
                  )}
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                  {displayInventory.map((item) => (
                    <div
                      key={item.group}
                      className="rounded-2xl border p-4 text-center"
                      style={{ backgroundColor: 'var(--card)', borderColor: item.critical ? 'rgba(239,68,68,0.4)' : 'var(--border)', boxShadow: item.critical ? '0 0 0 1px rgba(239,68,68,0.2)' : 'none' }}
                    >
                      <p className="text-lg font-bold mb-1" style={{ color: item.critical ? 'var(--shifa-red)' : 'var(--shifa-dark)' }}>{item.group}</p>
                      <p className="text-2xl font-bold" style={{ color: item.critical ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>{item.units}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>poches</p>
                      {item.critical && (
                        <div className="mt-2">
                          <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' }}>Critique</span>
                        </div>
                      )}
                      {item.expiringSoon > 0 && (
                        <p className="text-xs mt-1" style={{ color: 'var(--shifa-amber)' }}>{item.expiringSoon} exp.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent requests */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Demandes récentes</h3>
                  {dbRequests.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Données Supabase</span>
                  )}
                </div>
                {displayRequests.length === 0 ? (
                  <div className="rounded-2xl border p-8 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <Icon name="ClipboardDocumentListIcon" size={24} style={{ color: 'var(--muted-foreground)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucune demande en cours</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {displayRequests.map((req) => (
                        <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: '#dc2626' }}>
                              {req.group}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{req.patient}</p>
                              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.ward} · {req.units} poche(s)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusConfig[req.urgency]?.bg, color: statusConfig[req.urgency]?.color }}>
                              {statusConfig[req.urgency]?.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusConfig[req.status]?.bg, color: statusConfig[req.status]?.color }}>
                              {statusConfig[req.status]?.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Donneurs récents</h3>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouveau don</button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {staticDonors.map((donor) => (
              <div key={donor.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: '#dc2626' }}>
                    {donor.group}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{donor.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{donor.id} · {donor.date}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: statusConfig[donor.status]?.bg, color: statusConfig[donor.status]?.color }}>
                  {statusConfig[donor.status]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Stock détaillé</h3>
              {dbInventory.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Supabase</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {displayInventory.map((item) => (
              <div key={item.group} className="rounded-xl border p-4 text-center" style={{ backgroundColor: 'var(--shifa-surface)', borderColor: item.critical ? 'rgba(239,68,68,0.3)' : 'var(--border)' }}>
                <p className="text-2xl font-bold mb-1" style={{ color: item.critical ? 'var(--shifa-red)' : 'var(--shifa-dark)' }}>{item.group}</p>
                <p className="text-3xl font-bold" style={{ color: item.critical ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>{item.units}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>poches disponibles</p>
                {item.expiringSoon > 0 && <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--shifa-amber)' }}>{item.expiringSoon} expirent bientôt</p>}
                {item.critical && <p className="text-xs mt-1 font-bold" style={{ color: 'var(--shifa-red)' }}>⚠ Stock critique</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Demandes de sang</h3>
              {dbRequests.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' }}>Supabase</span>
              )}
            </div>
            <button className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"><Icon name="PlusIcon" size={13} />Nouvelle demande</button>
          </div>
          {displayRequests.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Icon name="ClipboardDocumentListIcon" size={32} style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Aucune demande en cours</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--shifa-surface)' }}>
                    {['ID', 'Patient', 'Service', 'Groupe', 'Poches', 'Urgence', 'Statut'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRequests.map((req, i) => (
                    <tr key={req.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--shifa-surface)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{req.id}</td>
                      <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--shifa-dark)' }}>{req.patient}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{req.ward}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: '#dc2626' }}>{req.group}</span></td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{req.units}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusConfig[req.urgency]?.bg, color: statusConfig[req.urgency]?.color }}>
                          {statusConfig[req.urgency]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: statusConfig[req.status]?.bg, color: statusConfig[req.status]?.color }}>
                          {statusConfig[req.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'transfusions' || activeTab === 'traceability') && (
        <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}>
            <Icon name={activeTab === 'transfusions' ? 'BeakerIcon' : 'MagnifyingGlassIcon'} size={24} style={{ color: '#dc2626' }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--shifa-dark)' }}>
            {activeTab === 'transfusions' ? 'Suivi des transfusions' : 'Traçabilité des poches'}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cette section sera disponible prochainement.</p>
        </div>
      )}
    </div>
  );
}
