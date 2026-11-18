'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'lithiasis' | 'prostate' | 'oncourology' | 'incontinence' | 'andrology';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'lithiasis', label: 'Lithiase urinaire', icon: 'ExclamationTriangleIcon' },
  { key: 'prostate', label: 'Prostate & HBP', icon: 'ChartBarIcon' },
  { key: 'oncourology', label: 'Uro-oncologie', icon: 'BeakerIcon' },
  { key: 'incontinence', label: 'Incontinence & Pelvi-périnée', icon: 'HeartIcon' },
  { key: 'andrology', label: 'Andrologie & Fertilité', icon: 'SparklesIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '248', sub: 'Urologie', icon: 'UsersIcon', color: '#0369a1', bg: 'rgba(3,105,161,0.08)' },
  { label: 'Lithiases actives', value: '62', sub: '18 en colique', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Cancers urologiques', value: '44', sub: 'Prostate/Rein/Vessie', icon: 'BeakerIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Actes endoscopiques', value: '38', sub: 'Ce mois', icon: 'EyeIcon', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
];

const lithiasisPatients = [
  { patient: 'Oumar Sow', age: 45, location: 'Uretère lombaire droit', size: 8, composition: 'Oxalate de calcium', pain: 'EVA 8/10', hydronephrosis: 'Grade II', treatment: 'AINS + Alpha-bloquant — URSS planifiée', status: 'urgent' },
  { patient: 'Fatou Diallo', age: 38, location: 'Bassinet gauche', size: 14, composition: 'Struvite', pain: 'EVA 3/10', hydronephrosis: 'Grade I', treatment: 'LEC séance 1/3', status: 'treatment' },
  { patient: 'Ibrahima Ndiaye', age: 52, location: 'Uretère pelvien gauche', size: 5, composition: 'Acide urique', pain: 'EVA 6/10', hydronephrosis: 'Absent', treatment: 'Alcalinisation urinaire + AINS', status: 'moderate' },
  { patient: 'Cheikh Ba', age: 61, location: 'Calice inférieur droit', size: 22, composition: 'Oxalate mixte', pain: 'EVA 2/10', hydronephrosis: 'Grade III', treatment: 'Néphrostomie + NLPC planifiée', status: 'severe' },
];

const prostatePatients = [
  { patient: 'Mamadou Camara', age: 68, psa: 4.2, ipss: 18, qmax: 8.4, residual: 120, volume: 58, treatment: 'Alpha-bloquant + 5-ARI', status: 'moderate' },
  { patient: 'Cheikh Mbaye', age: 72, psa: 12.8, ipss: 24, qmax: 5.2, residual: 280, volume: 82, treatment: 'RTUP planifiée', status: 'severe' },
  { patient: 'Oumar Fall', age: 65, psa: 2.1, ipss: 8, qmax: 14.6, residual: 40, volume: 38, treatment: 'Surveillance active', status: 'mild' },
];

const psaTrend = [
  { month: 'Fév', psa: 8.2 }, { month: 'Mar', psa: 9.4 }, { month: 'Avr', psa: 10.8 },
  { month: 'Mai', psa: 11.2 }, { month: 'Jun', psa: 12.1 }, { month: 'Jul', psa: 12.8 }, { month: 'Aoû', psa: 13.4 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  urgent: { label: 'Urgent', bg: '#fee2e2', color: '#dc2626' },
  treatment: { label: 'Traitement', bg: '#dbeafe', color: '#1d4ed8' },
  moderate: { label: 'Modéré', bg: '#fef3c7', color: '#b45309' },
  severe: { label: 'Sévère', bg: '#fee2e2', color: '#dc2626' },
  mild: { label: 'Léger', bg: '#dcfce7', color: '#16a34a' },
  monitoring: { label: 'Surveillance', bg: '#f1f5f9', color: '#64748b' },
  active: { label: 'Traitement actif', bg: '#dbeafe', color: '#1d4ed8' },
  remission: { label: 'Rémission', bg: '#dcfce7', color: '#16a34a' },
};

export default function UrologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Urologie & Andrologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>Lithiase · Prostate · Uro-oncologie · Incontinence · Andrologie</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#0369a1' : '#fff' }}>
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Évolution PSA — Patient HBP sévère (ng/mL)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={psaTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 16]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="psa" stroke="#0369a1" strokeWidth={2} dot={{ r: 3 }} name="PSA ng/mL" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Répartition pathologies urologiques</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Lithiase urinaire', count: 62, pct: 25, color: '#dc2626' },
                    { label: 'HBP & Troubles mictionnels', count: 78, pct: 31, color: '#0369a1' },
                    { label: 'Cancer prostate', count: 28, pct: 11, color: '#7c3aed' },
                    { label: 'Cancer rein/vessie', count: 16, pct: 6, color: '#f59e0b' },
                    { label: 'Incontinence urinaire', count: 44, pct: 18, color: '#059669' },
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

        {activeTab === 'lithiasis' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Lithiase urinaire — Suivi & Traitement</h3>
              <button style={{ padding: '7px 14px', background: '#0369a1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau cas</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Localisation', 'Taille (mm)', 'Composition', 'Douleur', 'Hydronéphrose', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lithiasisPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.location}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.size > 10 ? '#dc2626' : '#475569', fontWeight: p.size > 10 ? 600 : 400 }}>{p.size} mm</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.composition}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.pain}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.hydronephrosis !== 'Absent' ? '#f59e0b' : '#16a34a' }}>{p.hydronephrosis}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.treatment}</td>
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

        {activeTab === 'prostate' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>HBP & Pathologies prostatiques — Score IPSS</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'PSA ng/mL', 'Score IPSS', 'Qmax mL/s', 'Résidu post-mict. mL', 'Volume prostate mL', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prostatePatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.psa > 10 ? '#dc2626' : p.psa > 4 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.psa}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.ipss > 19 ? '#dc2626' : p.ipss > 7 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.ipss}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.qmax < 10 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.qmax}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.residual > 150 ? '#dc2626' : '#475569', fontWeight: p.residual > 150 ? 600 : 400 }}>{p.residual}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.volume}</td>
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

        {(activeTab === 'oncourology' || activeTab === 'incontinence' || activeTab === 'andrology') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {activeTab === 'oncourology' && [
              { patient: 'Cheikh Diallo', age: 68, cancer: 'Cancer prostate', stage: 'T3bN0M0 — Gleason 8', psa: 18.4, treatment: 'Hormonothérapie + Radiothérapie externe', status: 'active' },
              { patient: 'Oumar Sarr', age: 62, cancer: 'Cancer rein droit', stage: 'T2aN0M0', psa: '—', treatment: 'Néphrectomie partielle laparoscopique — Réalisée', status: 'remission' },
              { patient: 'Ibrahima Balde', age: 71, cancer: 'Cancer vessie', stage: 'T2G3 — Infiltrant', psa: '—', treatment: 'Cystectomie totale + Bricker planifiée', status: 'active' },
              { patient: 'Mamadou Fall', age: 55, cancer: 'Cancer prostate', stage: 'T1cN0M0 — Gleason 6', psa: 6.8, treatment: 'Surveillance active — PSA/6 mois', status: 'monitoring' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed', margin: 0 }}>{p.cancer}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>Stade : {p.stage}</p>
                  {p.psa !== '—' && <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px' }}>PSA : <strong>{p.psa} ng/mL</strong></p>}
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
                </div>
              );
            })}
            {activeTab === 'incontinence' && [
              { patient: 'Fatou Sow', age: 52, type: "Incontinence d'effort", severity: 'Grade II', pad: 3, urodynamics: 'Hypermobilité urétrale — Pression clôture 42 cmH₂O', treatment: 'Bandelette sous-urétrale TVT planifiée', status: 'treatment' },
              { patient: 'Mariama Diallo', age: 68, type: 'Incontinence par urgenturie', severity: 'Grade III', pad: 6, urodynamics: 'Hyperactivité détrusorienne — Capacité vésicale 180 mL', treatment: 'Solifénacine 5mg/j + Rééducation périnéale', status: 'treatment' },
              { patient: 'Aïcha Ndiaye', age: 45, type: 'Incontinence mixte', severity: 'Grade I', pad: 1, urodynamics: 'Composante effort prédominante', treatment: 'Rééducation périnéale 15 séances', status: 'mild' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                      <p style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, margin: 0 }}>{p.type}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Sévérité</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.severity}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Protections/j</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.pad}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 6px' }}>Bilan urodynamique : {p.urodynamics}</p>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
                </div>
              );
            })}
            {activeTab === 'andrology' && [
              { patient: 'Amadou Diallo', age: 34, complaint: 'Infertilité masculine', spermogram: 'Oligoasthénospermie sévère — 2M/mL — Mobilité 18%', testosterone: 8.2, fsh: 18.4, treatment: 'FIV-ICSI planifiée', status: 'treatment' },
              { patient: 'Cheikh Fall', age: 42, complaint: 'Dysfonction érectile', spermogram: 'Normal', testosterone: 6.8, fsh: 4.2, treatment: 'Sildénafil 50mg + Bilan cardiovasculaire', status: 'treatment' },
              { patient: 'Moussa Sarr', age: 38, complaint: 'Hypogonadisme', spermogram: 'Azoospermie', testosterone: 3.2, fsh: 28.6, treatment: 'TRT — Testostérone undécanoate IM', status: 'active' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                      <p style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, margin: 0 }}>{p.complaint}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Testostérone nmol/L</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: p.testosterone < 8 ? '#dc2626' : '#16a34a', margin: 0 }}>{p.testosterone}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 8 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>FSH UI/L</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: p.fsh > 12 ? '#dc2626' : '#475569', margin: 0 }}>{p.fsh}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 6px' }}>Spermogramme : {p.spermogram}</p>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
