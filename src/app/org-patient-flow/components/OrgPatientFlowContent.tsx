'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'realtime' | 'beds' | 'transfers' | 'discharges' | 'stats';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'realtime', label: 'Flux temps réel', icon: 'BoltIcon' },
  { key: 'beds', label: 'Gestion des lits', icon: 'HomeIcon' },
  { key: 'transfers', label: 'Transferts', icon: 'ArrowsRightLeftIcon' },
  { key: 'discharges', label: 'Sorties planifiées', icon: 'ArrowRightCircleIcon' },
  { key: 'stats', label: 'Statistiques', icon: 'ChartBarIcon' },
];

const departments = [
  { name: 'Réanimation', total: 12, occupied: 11, available: 1, cleaning: 0, color: '#dc2626', occupancy: 92 },
  { name: 'Médecine interne', total: 30, occupied: 24, available: 4, cleaning: 2, color: 'var(--shifa-blue)', occupancy: 80 },
  { name: 'Chirurgie', total: 25, occupied: 18, available: 5, cleaning: 2, color: 'var(--shifa-purple)', occupancy: 72 },
  { name: 'Maternité', total: 20, occupied: 14, available: 5, cleaning: 1, color: '#ec4899', occupancy: 70 },
  { name: 'Pédiatrie', total: 18, occupied: 10, available: 7, cleaning: 1, color: 'var(--shifa-amber)', occupancy: 56 },
  { name: 'Urgences', total: 15, occupied: 13, available: 2, cleaning: 0, color: '#f97316', occupancy: 87 },
  { name: 'Cardiologie', total: 16, occupied: 12, available: 3, cleaning: 1, color: '#e11d48', occupancy: 75 },
  { name: 'Neurologie', total: 14, occupied: 9, available: 4, cleaning: 1, color: 'var(--shifa-cyan)', occupancy: 64 },
];

const bedGrid = [
  { id: 'REA-01', dept: 'Réanimation', patient: 'Moussa Traoré', status: 'occupied', since: '06:50', physician: 'Dr. Ba', triage: 'P1' },
  { id: 'REA-02', dept: 'Réanimation', patient: 'Aïcha Ndiaye', status: 'occupied', since: '14:20', physician: 'Dr. Mbaye', triage: 'P2' },
  { id: 'REA-03', dept: 'Réanimation', patient: 'Oumar Diallo', status: 'occupied', since: '08:14', physician: 'Dr. Ba', triage: 'P1' },
  { id: 'REA-04', dept: 'Réanimation', patient: null, status: 'available', since: null, physician: null, triage: null },
  { id: 'MED-01', dept: 'Médecine interne', patient: 'Fatou Seck', status: 'occupied', since: '09:02', physician: 'Dr. Diallo', triage: 'P2' },
  { id: 'MED-02', dept: 'Médecine interne', patient: 'Cheikh Fall', status: 'discharge_planned', since: '07:30', physician: 'Dr. Diallo', triage: 'P3' },
  { id: 'MED-03', dept: 'Médecine interne', patient: null, status: 'cleaning', since: null, physician: null, triage: null },
  { id: 'MED-04', dept: 'Médecine interne', patient: null, status: 'available', since: null, physician: null, triage: null },
  { id: 'CHIR-01', dept: 'Chirurgie', patient: 'Mariama Ba', status: 'occupied', since: '10:20', physician: 'Dr. Ndiaye', triage: 'P3' },
  { id: 'CHIR-02', dept: 'Chirurgie', patient: null, status: 'available', since: null, physician: null, triage: null },
  { id: 'MAT-01', dept: 'Maternité', patient: 'Aminata Coulibaly', status: 'occupied', since: '05:30', physician: 'Dr. Faye', triage: 'P2' },
  { id: 'MAT-02', dept: 'Maternité', patient: null, status: 'available', since: null, physician: null, triage: null },
];

const transfers = [
  { id: 'TRF-001', patient: 'Ibrahima Ndiaye', from: 'Urgences', to: 'Neurologie', requestedAt: '09:45', requestedBy: 'Dr. Mbaye', status: 'pending', reason: 'AVC suspecté — bilan neuro urgent', bed: 'NEU-06' },
  { id: 'TRF-002', patient: 'Oumar Diallo', from: 'Réanimation', to: 'Cardiologie', requestedAt: '18:00', requestedBy: 'Dr. Ba', status: 'approved', reason: 'Stabilisation post-STEMI — transfert programmé demain', bed: 'CARD-08' },
  { id: 'TRF-003', patient: 'Fatou Seck', from: 'Médecine interne', to: 'Pneumologie', requestedAt: '11:30', requestedBy: 'Dr. Diallo', status: 'in_transit', reason: 'Détresse respiratoire — expertise pneumo', bed: 'PNEU-03' },
  { id: 'TRF-004', patient: 'Aïcha Ndiaye', from: 'Réanimation', to: 'CHU Dakar', requestedAt: '14:00', requestedBy: 'Dr. Mbaye', status: 'pending', reason: 'Transfert inter-établissement — neurochirurgie', bed: '—' },
];

const discharges = [
  { id: 'DIS-001', patient: 'Cheikh Fall', dept: 'Médecine interne', bed: 'MED-22', plannedDate: 'Aujourd\'hui 14:00', physician: 'Dr. Diallo', status: 'ready', insurance: 'Privé', checklist: 4 },
  { id: 'DIS-002', patient: 'Mariama Ba', dept: 'Chirurgie', bed: 'CHIR-14', plannedDate: 'Demain 10:00', physician: 'Dr. Ndiaye', status: 'in_progress', insurance: 'Mutuelle CNTS', checklist: 2 },
  { id: 'DIS-003', patient: 'Aminata Coulibaly', dept: 'Maternité', bed: 'MAT-05', plannedDate: 'Demain 09:00', physician: 'Dr. Faye', status: 'pending', insurance: 'CSS', checklist: 1 },
  { id: 'DIS-004', patient: 'Oumar Diallo', dept: 'Réanimation', bed: 'REA-03', plannedDate: '12 août 2026', physician: 'Dr. Ba', status: 'pending', insurance: 'IPRES', checklist: 0 },
];

const occupancyData = [
  { day: 'Lun', rate: 78 }, { day: 'Mar', rate: 82 }, { day: 'Mer', rate: 85 }, { day: 'Jeu', rate: 88 }, { day: 'Ven', rate: 91 }, { day: 'Sam', rate: 87 }, { day: 'Dim', rate: 76 },
];

const bedStatusConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  occupied: { label: 'Occupé', bg: 'rgba(220,38,38,0.08)', color: '#dc2626', dot: '#dc2626' },
  available: { label: 'Disponible', bg: 'rgba(16,185,129,0.08)', color: '#16a34a', dot: '#16a34a' },
  cleaning: { label: 'Nettoyage', bg: 'rgba(245,158,11,0.08)', color: '#ca8a04', dot: '#ca8a04' },
  discharge_planned: { label: 'Sortie prévue', bg: 'rgba(99,102,241,0.08)', color: '#4f46e5', dot: '#4f46e5' },
};

export default function OrgPatientFlowContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('realtime');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const totalBeds = departments.reduce((s, d) => s + d.total, 0);
  const occupiedBeds = departments.reduce((s, d) => s + d.occupied, 0);
  const availableBeds = departments.reduce((s, d) => s + d.available, 0);
  const globalOccupancy = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Flux Patients & Gestion des Lits</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Tableau de bord temps réel — CHU Saint-Louis · Mis à jour il y a 2 min</p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Taux d\'occupation global', value: `${globalOccupancy}%`, sub: `${occupiedBeds}/${totalBeds} lits`, icon: 'HomeIcon', color: globalOccupancy > 85 ? '#dc2626' : 'var(--shifa-blue)', bg: globalOccupancy > 85 ? 'rgba(220,38,38,0.08)' : 'rgba(0,102,255,0.08)' },
          { label: 'Lits disponibles', value: String(availableBeds), sub: 'Toutes unités', icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Transferts en cours', value: '3', sub: '1 inter-établissement', icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Sorties planifiées', value: '4', sub: 'Dont 1 aujourd\'hui', icon: 'ArrowRightCircleIcon', color: 'var(--shifa-purple)', bg: 'rgba(139,92,246,0.08)' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value}</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginTop: '4px' }}>{kpi.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
            <Icon name={tab.icon} size={14} />{tab.label}
          </button>
        ))}
      </div>

      {/* Realtime Tab */}
      {activeTab === 'realtime' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {departments.map(dept => (
              <div key={dept.name} onClick={() => setSelectedDept(selectedDept === dept.name ? null : dept.name)} style={{ background: 'var(--card)', border: `2px solid ${selectedDept === dept.name ? dept.color : 'var(--border)'}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{dept.name}</h4>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: dept.occupancy > 85 ? '#dc2626' : dept.occupancy > 70 ? '#ca8a04' : '#16a34a' }}>{dept.occupancy}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${dept.occupancy}%`, background: dept.occupancy > 85 ? '#dc2626' : dept.occupancy > 70 ? '#ca8a04' : '#16a34a', borderRadius: '3px', transition: 'width 0.3s' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>● {dept.occupied} occupés</span>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>● {dept.available} libres</span>
                  {dept.cleaning > 0 && <span style={{ fontSize: '11px', color: '#ca8a04', fontWeight: 600 }}>● {dept.cleaning} nettoyage</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beds Tab */}
      {activeTab === 'beds' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {Object.entries(bedStatusConfig).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.dot }} />
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{cfg.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {bedGrid.map(bed => {
              const cfg = bedStatusConfig[bed.status];
              return (
                <div key={bed.id} style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{bed.id}</span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: cfg.bg, color: cfg.color, fontWeight: 600, border: `1px solid ${cfg.color}40` }}>{cfg.label}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{bed.dept}</p>
                  {bed.patient ? (
                    <>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{bed.patient}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{bed.physician} · depuis {bed.since}</p>
                    </>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>—</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transfers Tab */}
      {activeTab === 'transfers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Transferts en cours & planifiés</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Nouveau transfert
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transfers.map(trf => (
              <div key={trf.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>{trf.patient}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{trf.from}</span>
                      <Icon name="ArrowRightIcon" size={14} color="var(--muted-foreground)" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--shifa-blue)' }}>{trf.to}</span>
                      {trf.bed !== '—' && <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>· Lit {trf.bed}</span>}
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: trf.status === 'approved' ? '#dcfce7' : trf.status === 'in_transit' ? 'rgba(0,102,255,0.1)' : '#fef9c3', color: trf.status === 'approved' ? '#16a34a' : trf.status === 'in_transit' ? 'var(--shifa-blue)' : '#ca8a04' }}>
                    {trf.status === 'approved' ? 'Approuvé' : trf.status === 'in_transit' ? 'En transit' : 'En attente'}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>{trf.reason}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Demandé par {trf.requestedBy} · {trf.requestedAt}</p>
                </div>
                {trf.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button style={{ padding: '6px 14px', background: 'var(--shifa-green)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Approuver</button>
                    <button style={{ padding: '6px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Refuser</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discharges Tab */}
      {activeTab === 'discharges' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Sorties planifiées</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {discharges.map(dis => (
              <div key={dis.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#4f46e5' }}>{dis.patient.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{dis.patient}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{dis.dept} · Lit {dis.bed} · {dis.physician}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Assurance: {dis.insurance}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)' }}>{dis.plannedDate}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Checklist: {dis.checklist}/6</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: dis.status === 'ready' ? '#dcfce7' : dis.status === 'in_progress' ? 'rgba(0,102,255,0.1)' : '#fef9c3', color: dis.status === 'ready' ? '#16a34a' : dis.status === 'in_progress' ? 'var(--shifa-blue)' : '#ca8a04' }}>
                    {dis.status === 'ready' ? 'Prêt' : dis.status === 'in_progress' ? 'En cours' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Taux d'occupation — 7 derniers jours</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Taux']} />
                <Bar dataKey="rate" fill="var(--shifa-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Occupation par service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {departments.map(dept => (
                <div key={dept.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--foreground)', fontWeight: 500 }}>{dept.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: dept.occupancy > 85 ? '#dc2626' : dept.occupancy > 70 ? '#ca8a04' : '#16a34a' }}>{dept.occupancy}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${dept.occupancy}%`, background: dept.occupancy > 85 ? '#dc2626' : dept.occupancy > 70 ? '#ca8a04' : '#16a34a', borderRadius: '3px' }} />
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
