'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'dashboard' | 'care-plans' | 'handovers' | 'surveillance' | 'protocols' | 'assignments';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'care-plans', label: 'Plans de soins', icon: 'ClipboardDocumentListIcon' },
  { key: 'handovers', label: 'Transmissions', icon: 'ArrowsRightLeftIcon' },
  { key: 'surveillance', label: 'Feuilles surveillance', icon: 'ChartBarIcon' },
  { key: 'protocols', label: 'Protocoles infirmiers', icon: 'BookOpenIcon' },
  { key: 'assignments', label: 'Affectations', icon: 'UsersIcon' },
];

const kpis = [
  { label: 'Patients en soins', value: '142', sub: '18 services actifs', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Plans de soins actifs', value: '138', sub: '4 à compléter', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Transmissions du jour', value: '36', sub: '2 en attente', icon: 'ArrowsRightLeftIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Infirmiers de garde', value: '24', sub: '8 par équipe', icon: 'UserGroupIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
];

const carePlans = [
  { id: 'SP-001', patient: 'Aïcha Diallo', room: 'Ch. 204', diagnosis: 'Post-op appendicectomie', nurse: 'Inf. Kouyaté', status: 'active', priority: 'normal', actions: 4, done: 3 },
  { id: 'SP-002', patient: 'Mamadou Sow', room: 'Ch. 112', diagnosis: 'Insuffisance cardiaque', nurse: 'Inf. Ba', status: 'active', priority: 'high', actions: 6, done: 4 },
  { id: 'SP-003', patient: 'Fatou Ndiaye', room: 'Ch. 318', diagnosis: 'Diabète décompensé', nurse: 'Inf. Diallo', status: 'pending', priority: 'high', actions: 5, done: 0 },
  { id: 'SP-004', patient: 'Ibrahima Fall', room: 'Ch. 205', diagnosis: 'AVC ischémique', nurse: 'Inf. Seck', status: 'active', priority: 'critical', actions: 8, done: 6 },
  { id: 'SP-005', patient: 'Mariama Balde', room: 'Ch. 401', diagnosis: 'Pneumonie', nurse: 'Inf. Kouyaté', status: 'active', priority: 'normal', actions: 4, done: 4 },
];

const handovers = [
  { id: 'TR-001', from: 'Inf. Kouyaté', to: 'Inf. Ba', shift: 'Matin → Après-midi', time: '14:00', service: 'Médecine interne', patients: 12, status: 'completed', notes: 'Patient Ch.204 douleurs post-op contrôlées. Surveillance TA Ch.112.' },
  { id: 'TR-002', from: 'Inf. Diallo', to: 'Inf. Sow', shift: 'Après-midi → Nuit', time: '22:00', service: 'Chirurgie', patients: 9, status: 'pending', notes: '' },
  { id: 'TR-003', from: 'Inf. Seck', to: 'Inf. Ndiaye', shift: 'Nuit → Matin', time: '06:00', service: 'Réanimation', patients: 6, status: 'completed', notes: 'Paramètres stables. Glycémie Ch.318 à surveiller.' },
];

const surveillanceSheets = [
  { patient: 'Ibrahima Fall', room: 'Ch. 205', type: 'Neurologique', frequency: 'Toutes les 2h', lastEntry: '11:00', params: ['Glasgow 14/15', 'TA 145/90', 'FC 78', 'SpO2 97%'], alert: false },
  { patient: 'Mamadou Sow', room: 'Ch. 112', type: 'Cardiaque', frequency: 'Toutes les 4h', lastEntry: '10:00', params: ['TA 160/95 ⚠', 'FC 92', 'SpO2 94%', 'Diurèse 800ml'], alert: true },
  { patient: 'Fatou Ndiaye', room: 'Ch. 318', type: 'Glycémique', frequency: 'Avant repas', lastEntry: '08:00', params: ['Glycémie 2.8g/L ⚠', 'Insuline 8UI', 'Repas 80%'], alert: true },
  { patient: 'Aïcha Diallo', room: 'Ch. 204', type: 'Post-opératoire', frequency: 'Toutes les 6h', lastEntry: '12:00', params: ['EVA 3/10', 'Pansement sec', 'Transit +', 'Mobilisation OK'], alert: false },
];

const protocols = [
  { id: 'PROT-INF-001', title: 'Pose et surveillance VVP', category: 'Voies veineuses', version: '3.2', validated: '01/06/2026', uses: 234, status: 'active' },
  { id: 'PROT-INF-002', title: 'Sondage urinaire chez l\'adulte', category: 'Soins invasifs', version: '2.1', validated: '15/03/2026', uses: 89, status: 'active' },
  { id: 'PROT-INF-003', title: 'Préparation et administration insuline', category: 'Médicaments', version: '4.0', validated: '01/07/2026', uses: 312, status: 'active' },
  { id: 'PROT-INF-004', title: 'Prise en charge douleur post-opératoire', category: 'Douleur', version: '2.3', validated: '20/05/2026', uses: 178, status: 'active' },
  { id: 'PROT-INF-005', title: 'Prévention escarres — échelle Braden', category: 'Prévention', version: '1.5', validated: '10/04/2026', uses: 145, status: 'active' },
  { id: 'PROT-INF-006', title: 'Gestion cathéter veineux central', category: 'Voies veineuses', version: '2.0', validated: '01/08/2026', uses: 67, status: 'review' },
];

const assignments = [
  { service: 'Médecine interne', shift: 'Matin', nurses: ['Inf. Kouyaté (resp.)', 'Inf. Ba', 'Inf. Diallo'], patients: 18, ratio: '6:1', status: 'ok' },
  { service: 'Chirurgie', shift: 'Matin', nurses: ['Inf. Seck (resp.)', 'Inf. Ndiaye'], patients: 14, ratio: '7:1', status: 'warning' },
  { service: 'Réanimation', shift: 'Matin', nurses: ['Inf. Fall (resp.)', 'Inf. Camara', 'Inf. Balde'], patients: 6, ratio: '2:1', status: 'ok' },
  { service: 'Pédiatrie', shift: 'Matin', nurses: ['Inf. Mbaye (resp.)', 'Inf. Sarr'], patients: 12, ratio: '6:1', status: 'ok' },
  { service: 'Maternité', shift: 'Matin', nurses: ['Inf. Diouf (resp.)', 'Inf. Gaye', 'Inf. Thiaw'], patients: 16, ratio: '5:1', status: 'ok' },
];

const priorityConfig: Record<string, { label: string; bg: string; color: string }> = {
  normal: { label: 'Normal', bg: '#dbeafe', color: '#1d4ed8' },
  high: { label: 'Élevé', bg: '#fef3c7', color: '#b45309' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
};

export default function OrgNursingManagementContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="HeartIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Gestion des Soins Infirmiers</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Planification, transmissions, surveillance et protocoles</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? 'var(--shifa-blue)' : '#64748b', borderBottom: activeTab === t.key ? '2px solid var(--shifa-blue)' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? 'var(--shifa-blue)' : '#94a3b8'} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 6px' }}>{k.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{k.value}</p>
                      <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>{k.sub}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={20} color={k.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Plans de soins récents</h3>
                {carePlans.slice(0, 4).map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient} — {p.room}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{p.diagnosis}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{p.done}/{p.actions}</span>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: priorityConfig[p.priority].bg, color: priorityConfig[p.priority].color }}>{priorityConfig[p.priority].label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Alertes surveillance</h3>
                {surveillanceSheets.filter(s => s.alert).map((s, i) => (
                  <div key={i} style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Icon name="ExclamationTriangleIcon" size={14} color="#ea580c" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.patient} — {s.room}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{s.params.filter(p => p.includes('⚠')).join(' | ')}</p>
                  </div>
                ))}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 13, color: '#16a34a', margin: 0, fontWeight: 500 }}>✓ 2 patients stables — surveillance normale</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Care Plans */}
        {activeTab === 'care-plans' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Plans de soins infirmiers</h3>
              <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau plan</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Patient', 'Chambre', 'Diagnostic', 'Infirmier(e)', 'Actions', 'Priorité', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carePlans.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{p.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.room}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.diagnosis}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.nurse}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${(p.done / p.actions) * 100}%`, height: '100%', background: 'var(--shifa-green)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{p.done}/{p.actions}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: priorityConfig[p.priority].bg, color: priorityConfig[p.priority].color }}>{priorityConfig[p.priority].label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: p.status === 'active' ? '#dcfce7' : '#fef3c7', color: p.status === 'active' ? '#16a34a' : '#b45309' }}>{p.status === 'active' ? 'Actif' : 'En attente'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Handovers */}
        {activeTab === 'handovers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Transmissions infirmières</h3>
              <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouvelle transmission</button>
            </div>
            {handovers.map((h, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,102,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ArrowsRightLeftIcon" size={18} color="var(--shifa-blue)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{h.from} → {h.to}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{h.service} — {h.shift} à {h.time} — {h.patients} patients</p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: h.status === 'completed' ? '#dcfce7' : '#fef3c7', color: h.status === 'completed' ? '#16a34a' : '#b45309' }}>{h.status === 'completed' ? 'Complétée' : 'En attente'}</span>
                </div>
                {h.notes && <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 13, color: '#475569' }}>{h.notes}</div>}
                {!h.notes && <div style={{ background: '#fff7ed', borderRadius: 8, padding: 12, fontSize: 13, color: '#b45309' }}>⚠ Transmission non encore saisie</div>}
              </div>
            ))}
          </div>
        )}

        {/* Surveillance */}
        {activeTab === 'surveillance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Feuilles de surveillance</h3>
              <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouvelle feuille</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {surveillanceSheets.map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${s.alert ? '#fed7aa' : '#e2e8f0'}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{s.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{s.room} — Surveillance {s.type}</p>
                    </div>
                    {s.alert && <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: '#fee2e2', color: '#dc2626' }}>⚠ Alerte</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {s.params.map((p, j) => (
                      <span key={j} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 12, background: p.includes('⚠') ? '#fee2e2' : '#f1f5f9', color: p.includes('⚠') ? '#dc2626' : '#475569' }}>{p}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Fréquence: {s.frequency} — Dernière saisie: {s.lastEntry}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Protocols */}
        {activeTab === 'protocols' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Protocoles infirmiers validés</h3>
              <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau protocole</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Titre', 'Catégorie', 'Version', 'Validé le', 'Utilisations', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {protocols.map((p, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{p.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.title}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#dbeafe', color: '#1d4ed8' }}>{p.category}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>v{p.version}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.validated}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.uses}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: p.status === 'active' ? '#dcfce7' : '#fef3c7', color: p.status === 'active' ? '#16a34a' : '#b45309' }}>{p.status === 'active' ? 'Actif' : 'En révision'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Affectations par service — Équipe du matin</h3>
              <button style={{ padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Modifier affectations</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {assignments.map((a, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${a.status === 'warning' ? '#fed7aa' : '#e2e8f0'}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{a.service}</h4>
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: a.status === 'ok' ? '#dcfce7' : '#fef3c7', color: a.status === 'ok' ? '#16a34a' : '#b45309' }}>{a.status === 'ok' ? 'OK' : 'Sous-effectif'}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    {a.nurses.map((n, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--shifa-blue)', fontWeight: 700 }}>{n.charAt(4)}</div>
                        <span style={{ fontSize: 12, color: '#475569' }}>{n}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{a.patients} patients</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: a.status === 'warning' ? '#b45309' : '#16a34a' }}>Ratio {a.ratio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
