'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TabKey = 'dashboard' | 'ecg' | 'followup' | 'hypertension' | 'pacemakers' | 'reports';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'ecg', label: 'ECG & Holter', icon: 'ChartBarIcon' },
  { key: 'followup', label: 'Suivi cardiologique', icon: 'HeartIcon' },
  { key: 'hypertension', label: 'HTA', icon: 'ExclamationTriangleIcon' },
  { key: 'pacemakers', label: 'Pacemakers', icon: 'CpuChipIcon' },
  { key: 'reports', label: 'Rapports structurés', icon: 'DocumentTextIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '284', sub: 'Cardiologie active', icon: 'UsersIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'ECG ce mois', value: '147', sub: '12 anomalies détectées', icon: 'ChartBarIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Holter en cours', value: '8', sub: '3 à analyser', icon: 'ClockIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Pacemakers actifs', value: '23', sub: '1 contrôle urgent', icon: 'CpuChipIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
];

const ecgList = [
  { id: 'ECG-001', patient: 'Mamadou Sow', age: 62, date: '11/08/2026', type: 'ECG 12 dérivations', result: 'FA paroxystique', urgency: 'high', cardiologist: 'Dr. Diallo', status: 'interpreted' },
  { id: 'ECG-002', patient: 'Fatou Ndiaye', age: 55, date: '11/08/2026', type: 'ECG 12 dérivations', result: 'Normal', urgency: 'normal', cardiologist: 'Dr. Sy', status: 'interpreted' },
  { id: 'ECG-003', patient: 'Ibrahima Fall', age: 71, date: '10/08/2026', type: 'Holter 24h', result: 'En cours d\'analyse', urgency: 'normal', cardiologist: 'Dr. Diallo', status: 'pending' },
  { id: 'ECG-004', patient: 'Aïcha Ba', age: 48, date: '10/08/2026', type: 'ECG effort', result: 'Sous-décalage ST à l\'effort', urgency: 'high', cardiologist: 'Dr. Sy', status: 'interpreted' },
  { id: 'ECG-005', patient: 'Oumar Diop', age: 67, date: '09/08/2026', type: 'Holter 48h', result: 'ESV fréquentes', urgency: 'medium', cardiologist: 'Dr. Diallo', status: 'interpreted' },
];

const followupPatients = [
  { patient: 'Mamadou Sow', id: 'PAT-001', condition: 'Insuffisance cardiaque FEVG 35%', lastVisit: '01/08/2026', nextVisit: '15/08/2026', medications: ['Bisoprolol 5mg', 'Ramipril 10mg', 'Furosémide 40mg'], status: 'stable', risk: 'high' },
  { patient: 'Fatou Ndiaye', id: 'PAT-002', condition: 'Coronaropathie — post-IDM', lastVisit: '28/07/2026', nextVisit: '28/08/2026', medications: ['Aspirine 100mg', 'Atorvastatine 80mg', 'Clopidogrel 75mg'], status: 'stable', risk: 'medium' },
  { patient: 'Ibrahima Fall', id: 'PAT-003', condition: 'Fibrillation auriculaire chronique', lastVisit: '05/08/2026', nextVisit: '12/08/2026', medications: ['Apixaban 5mg', 'Bisoprolol 2.5mg'], status: 'monitoring', risk: 'high' },
  { patient: 'Aïcha Ba', id: 'PAT-004', condition: 'Angor stable — HTA', lastVisit: '20/07/2026', nextVisit: '20/08/2026', medications: ['Amlodipine 10mg', 'Isosorbide 20mg'], status: 'stable', risk: 'medium' },
];

const htaData = [
  { month: 'Mar', controlled: 68, uncontrolled: 32 }, { month: 'Avr', controlled: 71, uncontrolled: 29 },
  { month: 'Mai', controlled: 74, uncontrolled: 26 }, { month: 'Jun', controlled: 72, uncontrolled: 28 },
  { month: 'Jul', controlled: 76, uncontrolled: 24 }, { month: 'Aoû', controlled: 78, uncontrolled: 22 },
];

const htaPatients = [
  { patient: 'Oumar Diop', id: 'PAT-005', lastBP: '168/98', target: '< 140/90', medications: 2, compliance: 'poor', risk: 'high', lastVisit: '08/08/2026' },
  { patient: 'Mariama Balde', id: 'PAT-006', lastBP: '138/85', target: '< 140/90', medications: 1, compliance: 'good', risk: 'low', lastVisit: '05/08/2026' },
  { patient: 'Cheikh Mbaye', id: 'PAT-007', lastBP: '152/92', target: '< 130/80', medications: 3, compliance: 'moderate', risk: 'medium', lastVisit: '03/08/2026' },
  { patient: 'Rokhaya Sarr', id: 'PAT-008', lastBP: '128/78', target: '< 130/80', medications: 2, compliance: 'good', risk: 'low', lastVisit: '01/08/2026' },
];

const pacemakers = [
  { id: 'PM-001', patient: 'Ibrahima Fall', model: 'Medtronic Micra AV', implantDate: '15/03/2024', lastCheck: '15/06/2026', nextCheck: '15/09/2026', battery: 87, mode: 'VVIR', rate: 60, status: 'ok' },
  { id: 'PM-002', patient: 'Aminata Diallo', model: 'Boston Scientific Accolade', implantDate: '20/11/2023', lastCheck: '20/05/2026', nextCheck: '20/08/2026', battery: 72, mode: 'DDD', rate: 70, status: 'urgent' },
  { id: 'PM-003', patient: 'Moussa Camara', model: 'Abbott Endurity', implantDate: '10/07/2025', lastCheck: '10/07/2026', nextCheck: '10/01/2027', battery: 94, mode: 'DDDR', rate: 60, status: 'ok' },
  { id: 'PM-004', patient: 'Ndéye Gaye', model: 'Biotronik Edora', implantDate: '05/01/2024', lastCheck: '05/07/2026', nextCheck: '05/10/2026', battery: 81, mode: 'DDD', rate: 65, status: 'ok' },
];

const reports = [
  { id: 'RPT-001', type: 'Compte-rendu échocardiographie', patient: 'Mamadou Sow', date: '10/08/2026', cardiologist: 'Dr. Diallo', status: 'signed', conclusion: 'FEVG 35% — CMD dilatée — IM modérée' },
  { id: 'RPT-002', type: 'Rapport Holter ECG', patient: 'Oumar Diop', date: '09/08/2026', cardiologist: 'Dr. Sy', status: 'signed', conclusion: 'ESV fréquentes — 1200/24h — Pas de TV soutenue' },
  { id: 'RPT-003', type: 'Compte-rendu coronarographie', patient: 'Fatou Ndiaye', date: '05/08/2026', cardiologist: 'Dr. Diallo', status: 'signed', conclusion: 'Sténose IVA 70% — Angioplastie recommandée' },
  { id: 'RPT-004', type: 'Rapport ECG effort', patient: 'Aïcha Ba', date: '10/08/2026', cardiologist: 'Dr. Sy', status: 'draft', conclusion: 'Test positif — Exploration complémentaire requise' },
];

const riskConfig: Record<string, { label: string; bg: string; color: string }> = {
  high: { label: 'Élevé', bg: '#fee2e2', color: '#dc2626' },
  medium: { label: 'Modéré', bg: '#fef3c7', color: '#b45309' },
  low: { label: 'Faible', bg: '#dcfce7', color: '#16a34a' },
};

export default function CardiologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="HeartIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Workspace Cardiologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>ECG/Holter, suivi cardio, HTA, pacemakers, rapports structurés</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#dc2626' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #dc2626' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? '#dc2626' : '#94a3b8'} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Contrôle HTA — Évolution mensuelle</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={htaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="controlled" name="Contrôlés %" fill="#16a34a" radius={[4,4,0,0]} />
                    <Bar dataKey="uncontrolled" name="Non contrôlés %" fill="#dc2626" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>ECG récents — Anomalies</h3>
                {ecgList.filter(e => e.urgency === 'high').map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{e.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{e.result} — {e.type}</p>
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{e.date}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: 12, background: '#fff7ed', borderRadius: 8 }}>
                  <p style={{ fontSize: 13, color: '#b45309', margin: 0 }}>⚠ Pacemaker PM-002 — Contrôle urgent requis (batterie 72%)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ecg' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>ECG & Holter — Examens</h3>
              <button style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouvel examen</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Patient', 'Âge', 'Date', 'Type', 'Résultat', 'Urgence', 'Cardiologue', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ecgList.map((e, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{e.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{e.patient}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.age} ans</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.date}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#dbeafe', color: '#1d4ed8' }}>{e.type}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.result}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: e.urgency === 'high' ? '#fee2e2' : e.urgency === 'medium' ? '#fef3c7' : '#f1f5f9', color: e.urgency === 'high' ? '#dc2626' : e.urgency === 'medium' ? '#b45309' : '#475569' }}>
                        {e.urgency === 'high' ? 'Urgent' : e.urgency === 'medium' ? 'Modéré' : 'Normal'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.cardiologist}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: e.status === 'interpreted' ? '#dcfce7' : '#fef3c7', color: e.status === 'interpreted' ? '#16a34a' : '#b45309' }}>{e.status === 'interpreted' ? 'Interprété' : 'En attente'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'followup' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Suivi cardiologique</h3>
              <button style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau suivi</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {followupPatients.map((p, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{p.id}</p>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: riskConfig[p.risk].bg, color: riskConfig[p.risk].color }}>Risque {riskConfig[p.risk].label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#475569', margin: '0 0 10px', fontWeight: 500 }}>{p.condition}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {p.medications.map((m, j) => (
                      <span key={j} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: '#f1f5f9', color: '#475569' }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Dernière visite: {p.lastVisit}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>Prochain: {p.nextVisit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hypertension' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Taux de contrôle HTA — 6 mois</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={htaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="controlled" name="Contrôlés %" fill="#16a34a" radius={[4,4,0,0]} />
                    <Bar dataKey="uncontrolled" name="Non contrôlés %" fill="#dc2626" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 12px' }}>Statistiques HTA</h3>
                {[{ label: 'Patients HTA suivis', value: '156' }, { label: 'HTA contrôlée', value: '78%' }, { label: 'Sous monothérapie', value: '42%' }, { label: 'Sous bithérapie', value: '38%' }, { label: 'Sous trithérapie+', value: '20%' }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Patients HTA — Suivi tensionnel</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Patient', 'Dernière TA', 'Objectif', 'Médicaments', 'Observance', 'Risque', 'Dernière visite'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {htaPatients.map((p, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: parseInt(p.lastBP) > 140 ? '#dc2626' : '#16a34a' }}>{p.lastBP}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.target}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.medications} médicament(s)</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: p.compliance === 'good' ? '#dcfce7' : p.compliance === 'moderate' ? '#fef3c7' : '#fee2e2', color: p.compliance === 'good' ? '#16a34a' : p.compliance === 'moderate' ? '#b45309' : '#dc2626' }}>
                          {p.compliance === 'good' ? 'Bonne' : p.compliance === 'moderate' ? 'Modérée' : 'Mauvaise'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: riskConfig[p.risk].bg, color: riskConfig[p.risk].color }}>{riskConfig[p.risk].label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pacemakers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Registre des pacemakers</h3>
              <button style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Enregistrer PM</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {pacemakers.map((pm, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${pm.status === 'urgent' ? '#fca5a5' : '#e2e8f0'}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{pm.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{pm.id} — {pm.model}</p>
                    </div>
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: pm.status === 'urgent' ? '#fee2e2' : '#dcfce7', color: pm.status === 'urgent' ? '#dc2626' : '#16a34a' }}>{pm.status === 'urgent' ? '⚠ Contrôle urgent' : 'OK'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[{ label: 'Mode', value: pm.mode }, { label: 'Fréquence base', value: `${pm.rate} bpm` }, { label: 'Implantation', value: pm.implantDate }, { label: 'Dernier contrôle', value: pm.lastCheck }].map((d, j) => (
                      <div key={j} style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 2px' }}>{d.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Batterie:</span>
                    <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pm.battery}%`, height: '100%', background: pm.battery > 80 ? '#16a34a' : pm.battery > 60 ? '#f59e0b' : '#dc2626', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: pm.battery > 80 ? '#16a34a' : pm.battery > 60 ? '#b45309' : '#dc2626' }}>{pm.battery}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '10px 0 0' }}>Prochain contrôle: <strong>{pm.nextCheck}</strong></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Rapports cardiologiques structurés</h3>
              <button style={{ padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau rapport</button>
            </div>
            {reports.map((r, i) => (
              <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="DocumentTextIcon" size={18} color="#dc2626" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{r.type} — {r.patient}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{r.conclusion}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.date} — {r.cardiologist}</span>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: r.status === 'signed' ? '#dcfce7' : '#fef3c7', color: r.status === 'signed' ? '#16a34a' : '#b45309' }}>{r.status === 'signed' ? 'Signé' : 'Brouillon'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
