'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'diabetes' | 'thyroid' | 'adrenal' | 'osteo' | 'obesity';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'diabetes', label: 'Diabétologie', icon: 'BeakerIcon' },
  { key: 'thyroid', label: 'Thyroïde & Parathyroïde', icon: 'ChartBarIcon' },
  { key: 'adrenal', label: 'Surrénales & Hypophyse', icon: 'BoltIcon' },
  { key: 'osteo', label: 'Ostéoporose & Calcium', icon: 'SparklesIcon' },
  { key: 'obesity', label: 'Obésité & Métabolisme', icon: 'ScaleIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '428', sub: 'Endocrinologie', icon: 'UsersIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Diabétiques', value: '289', sub: '68% DT2', icon: 'BeakerIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'HbA1c > 8%', value: '74', sub: 'Déséquilibrés', icon: 'ExclamationTriangleIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Pompes à insuline', value: '23', sub: 'Capteurs CGM', icon: 'CpuChipIcon', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
];

const diabetesPatients = [
  { patient: 'Fatou Diallo', age: 52, type: 'DT2', hba1c: 9.2, glucose: 2.4, insulin: true, pump: false, complications: ['Rétinopathie', 'Neuropathie'], treatment: 'Insuline basale + Metformine', status: 'uncontrolled' },
  { patient: 'Mamadou Sow', age: 38, type: 'DT1', hba1c: 7.1, glucose: 1.4, insulin: true, pump: true, complications: [], treatment: 'Pompe à insuline + CGM', status: 'controlled' },
  { patient: 'Aïcha Ndiaye', age: 61, type: 'DT2', hba1c: 8.8, glucose: 2.1, insulin: false, pump: false, complications: ['Néphropathie'], treatment: 'Metformine + iSGLT2 + GLP1', status: 'partial' },
  { patient: 'Ibrahima Ba', age: 45, type: 'DT2', hba1c: 6.8, glucose: 1.2, insulin: false, pump: false, complications: [], treatment: 'Metformine + DPP4', status: 'controlled' },
];

const thyroidPatients = [
  { patient: 'Mariama Camara', age: 44, diagnosis: 'Hypothyroïdie de Hashimoto', tsh: 12.4, t4l: 0.6, antibodies: 'Anti-TPO 840 UI/mL', treatment: 'Lévothyroxine 100µg/j', status: 'hypothyroid' },
  { patient: 'Rokhaya Fall', age: 35, diagnosis: 'Maladie de Basedow', tsh: 0.01, t4l: 3.8, antibodies: 'TRAK positifs', treatment: 'Carbimazole 30mg/j', status: 'hyperthyroid' },
  { patient: 'Cheikh Mbaye', age: 58, diagnosis: 'Nodule thyroïdien', tsh: 1.8, t4l: 1.4, antibodies: 'Négatifs', treatment: 'Surveillance échographique', status: 'monitoring' },
];

const hba1cTrend = [
  { month: 'Fév', hba1c: 9.8 }, { month: 'Mar', hba1c: 9.5 }, { month: 'Avr', hba1c: 9.2 },
  { month: 'Mai', hba1c: 8.9 }, { month: 'Jun', hba1c: 8.6 }, { month: 'Jul', hba1c: 9.0 }, { month: 'Aoû', hba1c: 9.2 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  uncontrolled: { label: 'Déséquilibré', bg: '#fee2e2', color: '#dc2626' },
  controlled: { label: 'Équilibré', bg: '#dcfce7', color: '#16a34a' },
  partial: { label: 'Partiel', bg: '#fef3c7', color: '#b45309' },
  hypothyroid: { label: 'Hypothyroïdie', bg: '#dbeafe', color: '#1d4ed8' },
  hyperthyroid: { label: 'Hyperthyroïdie', bg: '#fee2e2', color: '#dc2626' },
  monitoring: { label: 'Surveillance', bg: '#f1f5f9', color: '#64748b' },
  normal: { label: 'Normal', bg: '#dcfce7', color: '#16a34a' },
  high: { label: 'Élevé', bg: '#fee2e2', color: '#dc2626' },
};

export default function EndocrinologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Endocrinologie & Diabétologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>Diabète · Thyroïde · Surrénales · Ostéoporose · Obésité</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#7c3aed' : '#fff' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>{k.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{k.value}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{k.sub}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={20} color={k.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>HbA1c moyen — Cohorte DT2 déséquilibrée</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={hba1cTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[6, 11]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="hba1c" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} name="HbA1c %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Répartition pathologies endocrines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {[
                    { label: 'Diabète type 2', count: 197, pct: 68, color: '#dc2626' },
                    { label: 'Diabète type 1', count: 92, pct: 22, color: '#7c3aed' },
                    { label: 'Pathologies thyroïdiennes', count: 78, pct: 18, color: '#0284c7' },
                    { label: 'Ostéoporose', count: 45, pct: 11, color: '#f59e0b' },
                    { label: 'Obésité morbide', count: 38, pct: 9, color: '#059669' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{item.count}</span>
                      </div>
                      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diabetes' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Suivi diabétologique — HbA1c & Complications</h3>
              <button style={{ padding: '7px 14px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau patient</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Type', 'HbA1c %', 'Glycémie g/L', 'Insuline', 'Pompe/CGM', 'Complications', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diabetesPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: p.type === 'DT1' ? '#7c3aed' : '#dc2626' }}>{p.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.hba1c > 8 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.hba1c}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.glucose}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.insulin ? '#dbeafe' : '#f1f5f9', color: p.insulin ? '#1d4ed8' : '#64748b' }}>{p.insulin ? 'Oui' : 'Non'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.pump ? '#dcfce7' : '#f1f5f9', color: p.pump ? '#16a34a' : '#64748b' }}>{p.pump ? 'Pompe+CGM' : '—'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: p.complications.length > 0 ? '#dc2626' : '#16a34a' }}>{p.complications.length > 0 ? p.complications.join(', ') : 'Aucune'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 160 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'thyroid' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Pathologies thyroïdiennes & parathyroïdiennes</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Diagnostic', 'TSH mUI/L', 'T4L pmol/L', 'Anticorps', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {thyroidPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.diagnosis}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.tsh > 4 ? '#dc2626' : p.tsh < 0.4 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.tsh}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.t4l}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.antibodies}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'adrenal' || activeTab === 'osteo' || activeTab === 'obesity') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {activeTab === 'adrenal' && [
              { title: 'Insuffisance surrénalienne', patient: 'Oumar Sarr', detail: 'Cortisol 8h: 42 nmol/L — Hydrocortisone 20mg/j + Fludrocortisone 0.1mg/j', status: 'treatment', icon: 'BoltIcon' },
              { title: 'Syndrome de Cushing', patient: 'Ndéye Diop', detail: 'Cortisolurie 24h: 480 µg/j — CLU élevé — IRM hypophysaire: microadénome 6mm', status: 'monitoring', icon: 'ExclamationTriangleIcon' },
              { title: 'Hyperaldostéronisme primaire', patient: 'Cheikh Fall', detail: 'Aldostérone/rénine ratio: 42 — TDM surrénales: adénome gauche 14mm', status: 'monitoring', icon: 'ChartBarIcon' },
              { title: 'Phéochromocytome', patient: 'Aminata Balde', detail: 'Métanéphrines urinaires: 3x normale — TDM: masse surrénale droite 32mm', status: 'critical', icon: 'ExclamationTriangleIcon' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{item.title}</p>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: item.status === 'critical' ? '#fee2e2' : item.status === 'monitoring' ? '#dbeafe' : '#dcfce7',
                    color: item.status === 'critical' ? '#dc2626' : item.status === 'monitoring' ? '#1d4ed8' : '#16a34a' }}>
                    {item.status === 'critical' ? 'Critique' : item.status === 'monitoring' ? 'Surveillance' : 'Traitement'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 8px' }}>Patient : <strong>{item.patient}</strong></p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{item.detail}</p>
              </div>
            ))}
            {activeTab === 'osteo' && [
              { patient: 'Mariama Balde', age: 68, tscore: -2.9, site: 'Col fémoral', calcium: 2.1, vitd: 18, fractures: 1, treatment: 'Alendronate 70mg/sem + Vit D3 + Calcium', status: 'high' },
              { patient: 'Fatou Sow', age: 72, tscore: -3.4, site: 'Rachis L2-L4', calcium: 2.0, vitd: 12, fractures: 2, treatment: 'Dénosumab 60mg/6mois + Vit D3', status: 'high' },
              { patient: 'Rokhaya Ndiaye', age: 61, tscore: -1.8, site: 'Col fémoral', calcium: 2.3, vitd: 32, fractures: 0, treatment: 'Vit D3 + Calcium + Exercice', status: 'monitoring' },
            ].map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient} — {p.age} ans</p>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: p.status === 'high' ? '#fee2e2' : '#fef3c7', color: p.status === 'high' ? '#dc2626' : '#b45309' }}>
                    {p.status === 'high' ? 'Risque élevé' : 'Surveillance'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>T-score ({p.site})</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', margin: 0 }}>{p.tscore}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Vit D (nmol/L)</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: p.vitd < 25 ? '#dc2626' : '#16a34a', margin: 0 }}>{p.vitd}</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
              </div>
            ))}
            {activeTab === 'obesity' && [
              { patient: 'Amadou Diallo', age: 44, bmi: 42.3, class: 'Obésité III', waist: 128, comorbidities: ['DT2', 'HTA', 'SAOS'], treatment: 'Chirurgie bariatrique planifiée — Sleeve', status: 'surgery' },
              { patient: 'Ndéye Camara', age: 38, bmi: 36.8, class: 'Obésité II', waist: 112, comorbidities: ['Dyslipidémie', 'Stéatose'], treatment: 'Sémaglutide 2.4mg/sem + Diététique', status: 'medical' },
              { patient: 'Cheikh Sarr', age: 52, bmi: 31.2, class: 'Obésité I', waist: 104, comorbidities: ['HTA'], treatment: 'Régime hypocalorique + Activité physique', status: 'lifestyle' },
            ].map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient} — {p.age} ans</p>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: p.status === 'surgery' ? '#fee2e2' : p.status === 'medical' ? '#dbeafe' : '#dcfce7',
                    color: p.status === 'surgery' ? '#dc2626' : p.status === 'medical' ? '#1d4ed8' : '#16a34a' }}>
                    {p.status === 'surgery' ? 'Chirurgie' : p.status === 'medical' ? 'Médical' : 'Hygiéno-diét.'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>IMC</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', margin: 0 }}>{p.bmi}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Classe</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.class}</p>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Tour taille</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b', margin: 0 }}>{p.waist} cm</p>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>Comorbidités : {p.comorbidities.join(', ')}</p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
