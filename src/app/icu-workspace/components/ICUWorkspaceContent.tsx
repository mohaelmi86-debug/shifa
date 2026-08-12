'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'monitoring' | 'ventilation' | 'scores' | 'sedation' | 'balance';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'monitoring', label: 'Monitoring continu', icon: 'ChartBarIcon' },
  { key: 'ventilation', label: 'Ventilation', icon: 'ArrowPathIcon' },
  { key: 'scores', label: 'Scores SOFA/APACHE', icon: 'ClipboardDocumentListIcon' },
  { key: 'sedation', label: 'Sédation & Analgésie', icon: 'BeakerIcon' },
  { key: 'balance', label: 'Bilan 24h', icon: 'ScaleIcon' },
];

const kpis = [
  { label: 'Lits occupés', value: '14/16', sub: '87.5% occupation', icon: 'BuildingOffice2Icon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Ventilés', value: '9', sub: '64% des patients', icon: 'ArrowPathIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Score SOFA moy.', value: '8.2', sub: 'Défaillance modérée', icon: 'ChartBarIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Alertes actives', value: '3', sub: '1 critique', icon: 'ExclamationTriangleIcon', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
];

const patients = [
  { id: 'REA-001', name: 'Mamadou Sow', age: 67, diagnosis: 'Sepsis sévère — choc septique', sofa: 11, apache: 24, ventilated: true, sedation: 'Midazolam + Fentanyl', days: 5, status: 'critical' },
  { id: 'REA-002', name: 'Fatou Ndiaye', age: 54, diagnosis: 'SDRA post-pneumonie', sofa: 9, apache: 20, ventilated: true, sedation: 'Propofol + Sufentanil', days: 3, status: 'serious' },
  { id: 'REA-003', name: 'Ibrahima Fall', age: 72, diagnosis: 'Insuffisance cardiaque aiguë', sofa: 6, apache: 15, ventilated: false, sedation: 'Aucune', days: 2, status: 'stable' },
  { id: 'REA-004', name: 'Aïcha Ba', age: 45, diagnosis: 'Polytraumatisme — TC grave', sofa: 13, apache: 28, ventilated: true, sedation: 'Kétamine + Midazolam', days: 7, status: 'critical' },
  { id: 'REA-005', name: 'Oumar Diop', age: 61, diagnosis: 'Pancréatite aiguë sévère', sofa: 7, apache: 17, ventilated: false, sedation: 'Morphine PCA', days: 4, status: 'serious' },
];

const vitalsTrend = [
  { time: '00h', fc: 98, pas: 110, spo2: 94, temp: 38.2 },
  { time: '02h', fc: 102, pas: 105, spo2: 93, temp: 38.5 },
  { time: '04h', fc: 95, pas: 112, spo2: 95, temp: 38.1 },
  { time: '06h', fc: 88, pas: 118, spo2: 96, temp: 37.8 },
  { time: '08h', fc: 92, pas: 115, spo2: 95, temp: 37.9 },
  { time: '10h', fc: 86, pas: 122, spo2: 97, temp: 37.6 },
  { time: '12h', fc: 90, pas: 119, spo2: 96, temp: 37.7 },
];

const ventilationData = [
  { id: 'REA-001', patient: 'Mamadou Sow', mode: 'SIMV-PC', fio2: 60, peep: 8, vt: 480, fr: 16, pip: 28, compliance: 32, status: 'stable' },
  { id: 'REA-002', patient: 'Fatou Ndiaye', mode: 'VAC', fio2: 80, peep: 10, vt: 420, fr: 18, pip: 32, compliance: 28, status: 'alert' },
  { id: 'REA-004', patient: 'Aïcha Ba', mode: 'SIMV-VC', fio2: 70, peep: 6, vt: 500, fr: 14, pip: 25, compliance: 38, status: 'stable' },
  { id: 'REA-006', patient: 'Cheikh Mbaye', mode: 'VS-AI', fio2: 40, peep: 5, vt: 460, fr: 12, pip: 18, compliance: 45, status: 'weaning' },
];

const sofaScores = [
  { patient: 'Mamadou Sow', resp: 3, coag: 2, liver: 1, cardio: 3, neuro: 1, renal: 1, total: 11, trend: 'worsening' },
  { patient: 'Fatou Ndiaye', resp: 3, coag: 1, liver: 1, cardio: 2, neuro: 1, renal: 1, total: 9, trend: 'stable' },
  { patient: 'Ibrahima Fall', resp: 1, coag: 1, liver: 1, cardio: 2, neuro: 0, renal: 1, total: 6, trend: 'improving' },
  { patient: 'Aïcha Ba', resp: 3, coag: 2, liver: 2, cardio: 3, neuro: 2, renal: 1, total: 13, trend: 'worsening' },
  { patient: 'Oumar Diop', resp: 2, coag: 1, liver: 1, cardio: 2, neuro: 0, renal: 1, total: 7, trend: 'stable' },
];

const sedationData = [
  { patient: 'Mamadou Sow', drug1: 'Midazolam 5mg/h', drug2: 'Fentanyl 50mcg/h', rass: -2, cpot: 1, target: 'RASS -2 à -3', lastAssessment: '11:30' },
  { patient: 'Fatou Ndiaye', drug1: 'Propofol 100mg/h', drug2: 'Sufentanil 20mcg/h', rass: -3, cpot: 0, target: 'RASS -3 à -4', lastAssessment: '11:00' },
  { patient: 'Aïcha Ba', drug1: 'Kétamine 50mg/h', drug2: 'Midazolam 3mg/h', rass: -4, cpot: 0, target: 'RASS -4 à -5', lastAssessment: '10:45' },
  { patient: 'Oumar Diop', drug1: 'Morphine PCA 2mg/h', drug2: 'Paracétamol 1g/6h', rass: 0, cpot: 2, target: 'RASS 0', lastAssessment: '11:15' },
];

const balanceData = [
  { patient: 'Mamadou Sow', entrees: 3200, sorties: 2100, balance: +1100, diurese: 800, perfusions: 2400, nutrition: 800, status: 'positive' },
  { patient: 'Fatou Ndiaye', entrees: 2800, sorties: 2950, balance: -150, diurese: 1200, perfusions: 2000, nutrition: 800, status: 'negative' },
  { patient: 'Ibrahima Fall', entrees: 2200, sorties: 2100, balance: +100, diurese: 1500, perfusions: 1400, nutrition: 800, status: 'balanced' },
  { patient: 'Aïcha Ba', entrees: 4100, sorties: 2800, balance: +1300, diurese: 600, perfusions: 3300, nutrition: 800, status: 'positive' },
  { patient: 'Oumar Diop', entrees: 2600, sorties: 2400, balance: +200, diurese: 1100, perfusions: 1800, nutrition: 800, status: 'balanced' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  serious: { label: 'Grave', bg: '#fef3c7', color: '#b45309' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  alert: { label: 'Alerte', bg: '#fee2e2', color: '#dc2626' },
  weaning: { label: 'Sevrage', bg: '#dbeafe', color: '#1d4ed8' },
  worsening: { label: '↑ Aggravation', bg: '#fee2e2', color: '#dc2626' },
  improving: { label: '↓ Amélioration', bg: '#dcfce7', color: '#16a34a' },
  positive: { label: 'Positif', bg: '#fef3c7', color: '#b45309' },
  negative: { label: 'Négatif', bg: '#dbeafe', color: '#1d4ed8' },
  balanced: { label: 'Équilibré', bg: '#dcfce7', color: '#16a34a' },
};

export default function ICUWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BoltIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Réanimation & Soins Intensifs</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>Monitoring continu — Ventilation — Scores SOFA/APACHE</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>3 ALERTES ACTIVES</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>14/16 lits</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 0 }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#1e40af' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#1e40af' : 'rgba(255,255,255,0.8)'} />
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
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
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
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients en réanimation</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['ID', 'Patient', 'Diagnostic', 'SOFA', 'APACHE II', 'Ventilé', 'Sédation', 'Jours', 'Statut'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.name} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{p.diagnosis}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: p.sofa >= 10 ? '#fee2e2' : p.sofa >= 7 ? '#fef3c7' : '#dcfce7', color: p.sofa >= 10 ? '#dc2626' : p.sofa >= 7 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.sofa}</span></td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.apache}</td>
                      <td style={{ padding: '10px 12px' }}>{p.ventilated ? <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>OUI</span> : <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>NON</span>}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.sedation}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>J{p.days}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Monitoring continu — REA-001 Mamadou Sow (12h)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={vitalsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="fc" stroke="#dc2626" strokeWidth={2} name="FC (bpm)" dot={false} />
                  <Line type="monotone" dataKey="pas" stroke="#0066ff" strokeWidth={2} name="PAS (mmHg)" dot={false} />
                  <Line type="monotone" dataKey="spo2" stroke="#16a34a" strokeWidth={2} name="SpO2 (%)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'FC', value: '90 bpm', sub: 'Tachycardie modérée', color: '#dc2626', icon: 'HeartIcon' },
                { label: 'PAS/PAD', value: '119/72', sub: 'Noradrénaline 0.3 mcg/kg/min', color: '#0066ff', icon: 'ChartBarIcon' },
                { label: 'SpO2', value: '96%', sub: 'FiO2 60% — PEEP 8', color: '#16a34a', icon: 'ArrowPathIcon' },
                { label: 'Température', value: '37.7°C', sub: 'Apyrexie sous ATB', color: '#f59e0b', icon: 'SunIcon' },
              ].map((v, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${v.color}` }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{v.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: v.color }}>{v.value}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{v.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ventilation' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Paramètres ventilatoires</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Mode', 'FiO2 (%)', 'PEEP (cmH2O)', 'VT (mL)', 'FR (/min)', 'PIP (cmH2O)', 'Compliance (mL/cmH2O)', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ventilationData.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{v.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{v.mode}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: v.fio2 > 60 ? '#dc2626' : '#1e293b', fontWeight: v.fio2 > 60 ? 700 : 400 }}>{v.fio2}%</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{v.peep}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{v.vt}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{v.fr}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: v.pip > 30 ? '#dc2626' : '#1e293b', fontWeight: v.pip > 30 ? 700 : 400 }}>{v.pip}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{v.compliance}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[v.status]?.bg, color: statusConfig[v.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[v.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scores' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Scores SOFA — Défaillances organiques</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['Patient', 'Respiratoire', 'Coagulation', 'Foie', 'Cardiovasculaire', 'Neurologique', 'Rénal', 'SOFA Total', 'Tendance'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sofaScores.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                      {[s.resp, s.coag, s.liver, s.cardio, s.neuro, s.renal].map((score, j) => (
                        <td key={j} style={{ padding: '10px 12px' }}><span style={{ background: score >= 3 ? '#fee2e2' : score >= 2 ? '#fef3c7' : score >= 1 ? '#fef9c3' : '#f0fdf4', color: score >= 3 ? '#dc2626' : score >= 2 ? '#b45309' : score >= 1 ? '#854d0e' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{score}</span></td>
                      ))}
                      <td style={{ padding: '10px 12px' }}><span style={{ background: s.total >= 10 ? '#fee2e2' : s.total >= 7 ? '#fef3c7' : '#dcfce7', color: s.total >= 10 ? '#dc2626' : s.total >= 7 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>{s.total}</span></td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[s.trend]?.bg, color: statusConfig[s.trend]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[s.trend]?.label}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Interprétation SOFA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[{ range: '0-6', label: 'Défaillance légère', mortalite: '< 10%', color: '#16a34a', bg: '#dcfce7' }, { range: '7-9', label: 'Défaillance modérée', mortalite: '15-20%', color: '#b45309', bg: '#fef3c7' }, { range: '10-12', label: 'Défaillance sévère', mortalite: '40-50%', color: '#ea580c', bg: '#ffedd5' }, { range: '≥ 13', label: 'Défaillance critique', mortalite: '> 80%', color: '#dc2626', bg: '#fee2e2' }].map((r, i) => (
                  <div key={i} style={{ background: r.bg, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: r.color }}>{r.range}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: r.color, fontWeight: 600, marginTop: 4 }}>Mortalité {r.mortalite}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sedation' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Sédation & Analgésie — Scores RASS/CPOT</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Sédatif', 'Analgésique', 'RASS actuel', 'CPOT', 'Objectif', 'Dernière évaluation'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sedationData.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.drug1}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.drug2}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: s.rass <= -4 ? '#dbeafe' : s.rass <= -2 ? '#dcfce7' : '#fef3c7', color: s.rass <= -4 ? '#1d4ed8' : s.rass <= -2 ? '#16a34a' : '#b45309', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{s.rass}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: s.cpot >= 3 ? '#fee2e2' : '#dcfce7', color: s.cpot >= 3 ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{s.cpot}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{s.target}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{s.lastAssessment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'balance' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Bilan hydrique 24h</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Entrées totales (mL)', 'Perfusions (mL)', 'Nutrition (mL)', 'Sorties totales (mL)', 'Diurèse (mL)', 'Bilan (mL)', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {balanceData.map((b, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{b.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{b.entrees.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{b.perfusions.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{b.nutrition}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{b.sorties.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{b.diurese.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: b.balance > 500 ? '#fef3c7' : b.balance < 0 ? '#dbeafe' : '#dcfce7', color: b.balance > 500 ? '#b45309' : b.balance < 0 ? '#1d4ed8' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{b.balance > 0 ? '+' : ''}{b.balance}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[b.status]?.label}</span></td>
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
