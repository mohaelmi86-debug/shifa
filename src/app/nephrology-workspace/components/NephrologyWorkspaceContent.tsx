'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'ckd' | 'dialysis' | 'access' | 'transplant' | 'labs';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'ckd', label: 'IRC & Suivi', icon: 'ChartBarIcon' },
  { key: 'dialysis', label: 'Séances HD/DP', icon: 'ArrowPathIcon' },
  { key: 'access', label: 'Accès vasculaires', icon: 'BeakerIcon' },
  { key: 'transplant', label: 'Transplantation', icon: 'HeartIcon' },
  { key: 'labs', label: 'Biologie rénale', icon: 'ClipboardDocumentListIcon' },
];

const kpis = [
  { label: 'Patients IRC', value: '198', sub: 'Stades 3-5', icon: 'UsersIcon', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  { label: 'En dialyse', value: '84', sub: '62 HD — 22 DP', icon: 'ArrowPathIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Liste transplant.', value: '23', sub: 'Attente greffe rénale', icon: 'HeartIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { label: 'DFG moyen', value: '28', sub: 'mL/min/1.73m²', icon: 'ChartBarIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const ckdPatients = [
  { patient: 'Mamadou Sow', age: 65, stage: 'IRC stade 4', dfg: 22, cause: 'Néphropathie diabétique', hta: true, dialysisDate: 'Prévu 2027', treatment: 'Losartan 100mg + Furosémide 40mg', status: 'monitoring' },
  { patient: 'Fatou Ndiaye', age: 58, stage: 'IRC stade 3b', dfg: 35, cause: 'Néphropathie hypertensive', hta: true, dialysisDate: 'Non prévu', treatment: 'Amlodipine 10mg + Bicarbonate', status: 'stable' },
  { patient: 'Ibrahima Fall', age: 72, stage: 'IRC stade 5', dfg: 8, cause: 'Glomérulonéphrite chronique', hta: true, dialysisDate: 'En cours HD', treatment: 'Hémodialyse 3x/sem', status: 'dialysis' },
  { patient: 'Aïcha Ba', age: 45, stage: 'IRC stade 3a', dfg: 48, cause: 'Lupus néphrite', hta: false, dialysisDate: 'Non prévu', treatment: 'Hydroxychloroquine + Prednisone', status: 'stable' },
];

const dfgTrend = [
  { month: 'Fév', dfg: 38 }, { month: 'Mar', dfg: 35 }, { month: 'Avr', dfg: 33 },
  { month: 'Mai', dfg: 31 }, { month: 'Jun', dfg: 29 }, { month: 'Jul', dfg: 28 }, { month: 'Aoû', dfg: 28 },
];

const dialysisSessions = [
  { id: 'HD-001', patient: 'Ibrahima Fall', date: '11/08/2026', type: 'HD', duration: '4h', machine: 'Fresenius 5008', access: 'FAV radiale G', ufGoal: 2.5, ufActual: 2.3, kt_v: 1.4, status: 'completed' },
  { id: 'HD-002', patient: 'Oumar Diop', date: '11/08/2026', type: 'HD', duration: '4h', machine: 'Nipro DBB-27', access: 'CVC jugulaire D', ufGoal: 3.0, ufActual: 2.8, kt_v: 1.3, status: 'completed' },
  { id: 'DP-001', patient: 'Mariama Balde', date: '11/08/2026', type: 'DP', duration: '8h', machine: 'Baxter HomeChoice', access: 'Cathéter Tenckhoff', ufGoal: 1.5, ufActual: 1.6, kt_v: 1.8, status: 'in_progress' },
  { id: 'HD-003', patient: 'Cheikh Mbaye', date: '11/08/2026', type: 'HD', duration: '4h', machine: 'Fresenius 5008', access: 'FAV cubitale D', ufGoal: 2.0, ufActual: 0, kt_v: 0, status: 'scheduled' },
];

const vascularAccess = [
  { patient: 'Ibrahima Fall', type: 'FAV radiale gauche', created: '15/03/2024', lastCheck: '01/08/2026', flow: 850, status: 'functional', complications: 'Aucune' },
  { patient: 'Oumar Diop', type: 'CVC jugulaire droit', created: '20/06/2026', lastCheck: '05/08/2026', flow: 350, status: 'temporary', complications: 'Infection légère traitée' },
  { patient: 'Cheikh Mbaye', type: 'FAV cubitale droite', created: '10/01/2025', lastCheck: '10/07/2026', flow: 720, status: 'functional', complications: 'Sténose légère — surveillance' },
  { patient: 'Ndéye Gaye', type: 'Prothèse PTFE brachiale', created: '05/09/2023', lastCheck: '05/08/2026', flow: 650, status: 'functional', complications: 'Aucune' },
];

const transplantList = [
  { patient: 'Aïcha Ba', age: 45, waitingSince: '15/01/2025', bloodGroup: 'A+', pra: 15, dialysis: 'HD', priority: 'standard', status: 'waiting' },
  { patient: 'Moussa Camara', age: 38, waitingSince: '20/06/2024', bloodGroup: 'O+', pra: 5, dialysis: 'DP', priority: 'high', status: 'waiting' },
  { patient: 'Rokhaya Sarr', age: 52, waitingSince: '10/03/2026', bloodGroup: 'B+', pra: 45, dialysis: 'HD', priority: 'standard', status: 'waiting' },
];

const labResults = [
  { patient: 'Ibrahima Fall', creatinine: 850, uree: 28, potassium: 5.8, bicarbonate: 18, hemoglobin: 9.2, pth: 420, date: '10/08/2026' },
  { patient: 'Oumar Diop', creatinine: 780, uree: 24, potassium: 5.2, bicarbonate: 20, hemoglobin: 10.1, pth: 380, date: '10/08/2026' },
  { patient: 'Mariama Balde', creatinine: 650, uree: 20, potassium: 4.8, bicarbonate: 22, hemoglobin: 11.0, pth: 290, date: '09/08/2026' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  monitoring: { label: 'Surveillance', bg: '#dbeafe', color: '#1d4ed8' },
  dialysis: { label: 'Dialyse', bg: '#ede9fe', color: '#7c3aed' },
  completed: { label: 'Terminée', bg: '#dcfce7', color: '#16a34a' },
  in_progress: { label: 'En cours', bg: '#fef3c7', color: '#b45309' },
  scheduled: { label: 'Planifiée', bg: '#dbeafe', color: '#1d4ed8' },
  functional: { label: 'Fonctionnel', bg: '#dcfce7', color: '#16a34a' },
  temporary: { label: 'Temporaire', bg: '#fef3c7', color: '#b45309' },
  waiting: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
  high: { label: 'Priorité haute', bg: '#fee2e2', color: '#dc2626' },
  standard: { label: 'Standard', bg: '#f1f5f9', color: '#64748b' },
};

export default function NephrologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0e7490 0%, #0891b2 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Néphrologie & Dialyse</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>IRC — Hémodialyse/DP — Accès vasculaires — Transplantation</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>84 dialysés</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>198 IRC</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#0891b2' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#0891b2' : 'rgba(255,255,255,0.8)'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={18} color={k.color} />
                    </div>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{k.label}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{k.value}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Évolution DFG — Mamadou Sow</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dfgTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 60]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="dfg" stroke="#0891b2" strokeWidth={2} name="DFG (mL/min)" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Séances du jour</h3>
                {dialysisSessions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < dialysisSessions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{s.type} — {s.access}</div>
                    </div>
                    <span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[s.status]?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ckd' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Insuffisance rénale chronique — Suivi</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Stade IRC', 'DFG', 'Étiologie', 'HTA', 'Dialyse prévue', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ckdPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.dfg < 15 ? '#fee2e2' : p.dfg < 30 ? '#fef3c7' : '#dcfce7', color: p.dfg < 15 ? '#dc2626' : p.dfg < 30 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.stage}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: p.dfg < 15 ? '#dc2626' : p.dfg < 30 ? '#b45309' : '#16a34a' }}>{p.dfg}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.cause}</td>
                    <td style={{ padding: '10px 12px' }}>{p.hta ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>OUI</span> : <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>NON</span>}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.dialysisDate}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'dialysis' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Séances d'hémodialyse & dialyse péritonéale</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Type', 'Durée', 'Machine', 'Accès', 'UF Objectif (L)', 'UF Réel (L)', 'Kt/V', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dialysisSessions.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{s.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: s.type === 'HD' ? '#dbeafe' : '#ede9fe', color: s.type === 'HD' ? '#1d4ed8' : '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{s.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.duration}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.machine}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.access}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{s.ufGoal}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: s.ufActual > 0 && Math.abs(s.ufActual - s.ufGoal) > 0.5 ? '#f59e0b' : '#1e293b', fontWeight: 600 }}>{s.ufActual > 0 ? s.ufActual : '—'}</td>
                    <td style={{ padding: '10px 12px' }}>{s.kt_v > 0 ? <span style={{ background: s.kt_v >= 1.2 ? '#dcfce7' : '#fee2e2', color: s.kt_v >= 1.2 ? '#16a34a' : '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{s.kt_v}</span> : '—'}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[s.status]?.bg, color: statusConfig[s.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[s.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'access' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Accès vasculaires & cathéters</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Type d\'accès', 'Créé le', 'Dernier contrôle', 'Débit (mL/min)', 'Statut', 'Complications'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vascularAccess.map((a, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{a.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{a.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{a.created}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{a.lastCheck}</td>
                    <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: a.flow >= 600 ? '#16a34a' : '#f59e0b' }}>{a.flow}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[a.status]?.bg, color: statusConfig[a.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[a.status]?.label}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{a.complications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'transplant' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Liste d'attente — Transplantation rénale</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Âge', 'En attente depuis', 'Groupe sanguin', 'PRA (%)', 'Dialyse', 'Priorité', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transplantList.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{t.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{t.age}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{t.waitingSince}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{t.bloodGroup}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: t.pra > 30 ? '#dc2626' : '#1e293b', fontWeight: t.pra > 30 ? 700 : 400 }}>{t.pra}%</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: t.dialysis === 'HD' ? '#dbeafe' : '#ede9fe', color: t.dialysis === 'HD' ? '#1d4ed8' : '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{t.dialysis}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[t.priority]?.bg, color: statusConfig[t.priority]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[t.priority]?.label}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[t.status]?.bg, color: statusConfig[t.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[t.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'labs' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Biologie rénale — Résultats récents</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Créatinine (µmol/L)', 'Urée (mmol/L)', 'Kaliémie (mEq/L)', 'Bicarbonates', 'Hémoglobine (g/dL)', 'PTH (pg/mL)', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labResults.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{l.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#dc2626', fontWeight: 700 }}>{l.creatinine}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: l.uree > 25 ? '#dc2626' : '#1e293b', fontWeight: l.uree > 25 ? 700 : 400 }}>{l.uree}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.potassium > 5.5 ? '#fee2e2' : l.potassium < 3.5 ? '#fef3c7' : '#dcfce7', color: l.potassium > 5.5 ? '#dc2626' : l.potassium < 3.5 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.potassium}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.bicarbonate < 20 ? '#fee2e2' : '#dcfce7', color: l.bicarbonate < 20 ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.bicarbonate}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.hemoglobin < 10 ? '#fee2e2' : '#dcfce7', color: l.hemoglobin < 10 ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.hemoglobin}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: l.pth > 300 ? '#f59e0b' : '#1e293b', fontWeight: l.pth > 300 ? 700 : 400 }}>{l.pth}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
