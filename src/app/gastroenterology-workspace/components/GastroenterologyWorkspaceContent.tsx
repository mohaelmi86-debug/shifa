'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'ibd' | 'cirrhosis' | 'endoscopy' | 'scores' | 'hepatitis';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'ibd', label: 'MICI', icon: 'ExclamationTriangleIcon' },
  { key: 'cirrhosis', label: 'Cirrhose & Hépatologie', icon: 'ChartBarIcon' },
  { key: 'endoscopy', label: 'Endoscopies', icon: 'EyeIcon' },
  { key: 'scores', label: 'Scores Child-Pugh/MELD', icon: 'ClipboardDocumentListIcon' },
  { key: 'hepatitis', label: 'Hépatites virales', icon: 'BeakerIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '267', sub: 'Gastro-hépatologie', icon: 'UsersIcon', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { label: 'MICI actives', value: '89', sub: '34 en poussée', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Cirrhoses', value: '52', sub: '18 Child-Pugh C', icon: 'ChartBarIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Endoscopies/mois', value: '124', sub: '8 urgentes', icon: 'EyeIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
];

const ibdPatients = [
  { patient: 'Mamadou Sow', age: 32, type: 'Maladie de Crohn', location: 'Iléo-colique', activity: 'Poussée modérée', cdai: 280, treatment: 'Adalimumab 40mg/2sem', lastFlare: '01/08/2026', status: 'flare' },
  { patient: 'Fatou Ndiaye', age: 28, type: 'RCH', location: 'Pancolite', activity: 'Rémission', cdai: 80, treatment: 'Mésalazine 4g/j', lastFlare: '15/04/2026', status: 'remission' },
  { patient: 'Ibrahima Fall', age: 45, type: 'Maladie de Crohn', location: 'Colique', activity: 'Poussée sévère', cdai: 420, treatment: 'Infliximab 5mg/kg', lastFlare: '08/08/2026', status: 'severe' },
  { patient: 'Aïcha Ba', age: 38, type: 'RCH', location: 'Rectosigmoïdite', activity: 'Rémission', cdai: 60, treatment: 'Mésalazine 2g/j + suppositoires', lastFlare: '10/02/2026', status: 'remission' },
];

const cirrhosisPatients = [
  { patient: 'Oumar Diop', age: 58, etiology: 'Cirrhose alcoolique', childPugh: 'B', childScore: 8, meld: 16, complications: ['Ascite', 'Varices œsophagiennes'], status: 'monitoring' },
  { patient: 'Mariama Balde', age: 65, etiology: 'Cirrhose VHC', childPugh: 'C', childScore: 12, meld: 24, complications: ['Encéphalopathie', 'Ascite réfractaire', 'SBP'], status: 'critical' },
  { patient: 'Cheikh Mbaye', age: 52, etiology: 'NASH cirrhose', childPugh: 'A', childScore: 6, meld: 10, complications: ['Varices grade 1'], status: 'stable' },
  { patient: 'Rokhaya Sarr', age: 70, etiology: 'Cirrhose VHB', childPugh: 'B', childScore: 9, meld: 18, complications: ['Ascite', 'CHC suspecté'], status: 'monitoring' },
];

const endoscopies = [
  { id: 'FOGD-001', patient: 'Mariama Balde', type: 'FOGD', indication: 'Hémorragie digestive haute', date: '11/08/2026', result: 'Varices œsophagiennes grade III — Ligature x4', urgency: 'urgent', status: 'done' },
  { id: 'COLO-001', patient: 'Mamadou Sow', type: 'Coloscopie', indication: 'Surveillance Crohn', date: '10/08/2026', result: 'Ulcérations iléales — Biopsies x6', urgency: 'normal', status: 'done' },
  { id: 'FOGD-002', patient: 'Ibrahima Fall', type: 'FOGD', indication: 'Dysphagie', date: '09/08/2026', result: 'Œsophagite grade B — Hernie hiatale', urgency: 'normal', status: 'done' },
  { id: 'CPRE-001', patient: 'Oumar Diop', type: 'CPRE', indication: 'Lithiase cholédocienne', date: '08/08/2026', result: 'Sphinctérotomie + extraction calcul 8mm', urgency: 'semi-urgent', status: 'done' },
  { id: 'COLO-002', patient: 'Cheikh Mbaye', type: 'Coloscopie', indication: 'Dépistage CCR', date: '12/08/2026', result: 'Planifiée', urgency: 'normal', status: 'scheduled' },
];

const meldTrend = [
  { month: 'Fév', meld: 14 }, { month: 'Mar', meld: 15 }, { month: 'Avr', meld: 16 },
  { month: 'Mai', meld: 18 }, { month: 'Jun', meld: 20 }, { month: 'Jul', meld: 22 }, { month: 'Aoû', meld: 24 },
];

const hepatitisPatients = [
  { patient: 'Ndéye Gaye', virus: 'VHC', genotype: '1b', viral_load: 'Indétectable', treatment: 'Sofosbuvir/Velpatasvir 12sem', svr: true, fibrosis: 'F2', status: 'svr' },
  { patient: 'Moussa Camara', virus: 'VHB', hbsag: '+', viral_load: '2400 UI/mL', treatment: 'Ténofovir 300mg/j', svr: false, fibrosis: 'F3', status: 'treatment' },
  { patient: 'Aminata Diallo', virus: 'VHC', genotype: '3a', viral_load: '850000 UI/mL', treatment: 'Glécaprévir/Pibrentasvir 8sem', svr: false, fibrosis: 'F1', status: 'treatment' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  flare: { label: 'Poussée', bg: '#fef3c7', color: '#b45309' },
  remission: { label: 'Rémission', bg: '#dcfce7', color: '#16a34a' },
  severe: { label: 'Sévère', bg: '#fee2e2', color: '#dc2626' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  monitoring: { label: 'Surveillance', bg: '#dbeafe', color: '#1d4ed8' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  done: { label: 'Réalisée', bg: '#dcfce7', color: '#16a34a' },
  scheduled: { label: 'Planifiée', bg: '#dbeafe', color: '#1d4ed8' },
  svr: { label: 'RVS — Guéri', bg: '#dcfce7', color: '#16a34a' },
  treatment: { label: 'En traitement', bg: '#dbeafe', color: '#1d4ed8' },
  urgent: { label: 'Urgent', bg: '#fee2e2', color: '#dc2626' },
  'semi-urgent': { label: 'Semi-urgent', bg: '#fef3c7', color: '#b45309' },
  normal: { label: 'Programmé', bg: '#f1f5f9', color: '#64748b' },
};

export default function GastroenterologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Gastroentérologie & Hépatologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>MICI — Cirrhose — Endoscopies — Scores Child-Pugh/MELD</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>34 POUSSÉES MICI</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>267 patients</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#059669' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#059669' : 'rgba(255,255,255,0.8)'} />
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Évolution MELD — Mariama Balde</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={meldTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 40]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="meld" stroke="#059669" strokeWidth={2} name="Score MELD" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Endoscopies récentes</h3>
                {endoscopies.slice(0, 4).map((e, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient} — {e.type}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{e.indication}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{e.date}</div>
                      </div>
                      <span style={{ background: statusConfig[e.urgency]?.bg, color: statusConfig[e.urgency]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{statusConfig[e.urgency]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ibd' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>MICI — Maladie de Crohn & RCH</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Type', 'Localisation', 'Activité', 'CDAI', 'Traitement', 'Dernière poussée', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ibdPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.type.includes('Crohn') ? '#fef3c7' : '#dbeafe', color: p.type.includes('Crohn') ? '#b45309' : '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.location}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.activity}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.cdai > 300 ? '#fee2e2' : p.cdai > 150 ? '#fef3c7' : '#dcfce7', color: p.cdai > 300 ? '#dc2626' : p.cdai > 150 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.cdai}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.lastFlare}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cirrhosis' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Cirrhose & Hépatologie</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Étiologie', 'Child-Pugh', 'Score', 'MELD', 'Complications', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cirrhosisPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.etiology}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.childPugh === 'C' ? '#fee2e2' : p.childPugh === 'B' ? '#fef3c7' : '#dcfce7', color: p.childPugh === 'C' ? '#dc2626' : p.childPugh === 'B' ? '#b45309' : '#16a34a', borderRadius: 6, padding: '3px 12px', fontSize: 14, fontWeight: 700 }}>{p.childPugh}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{p.childScore}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.meld >= 20 ? '#fee2e2' : p.meld >= 15 ? '#fef3c7' : '#dcfce7', color: p.meld >= 20 ? '#dc2626' : p.meld >= 15 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 13, fontWeight: 700 }}>{p.meld}</span></td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {p.complications.map((c, j) => <span key={j} style={{ background: '#f1f5f9', color: '#475569', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>{c}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'endoscopy' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Endoscopies digestives</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Type', 'Indication', 'Date', 'Résultat', 'Urgence', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {endoscopies.map((e, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{e.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{e.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#d1fae5', color: '#059669', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{e.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{e.indication}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{e.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 220 }}>{e.result}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[e.urgency]?.bg, color: statusConfig[e.urgency]?.color, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{statusConfig[e.urgency]?.label}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[e.status]?.bg, color: statusConfig[e.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[e.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'scores' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Classification Child-Pugh</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[{ grade: 'A', range: '5-6', survival: '100%', color: '#16a34a', bg: '#dcfce7' }, { grade: 'B', range: '7-9', survival: '80%', color: '#b45309', bg: '#fef3c7' }, { grade: 'C', range: '10-15', survival: '45%', color: '#dc2626', bg: '#fee2e2' }].map((g, i) => (
                    <div key={i} style={{ background: g.bg, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: g.color }}>{g.grade}</div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Score {g.range}</div>
                      <div style={{ fontSize: 11, color: g.color, fontWeight: 600, marginTop: 4 }}>Survie 1 an: {g.survival}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Score MELD — Mortalité 90j</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[{ range: '< 10', mortality: '1.9%', color: '#16a34a', bg: '#dcfce7' }, { range: '10-19', mortality: '6%', color: '#b45309', bg: '#fef3c7' }, { range: '20-29', mortality: '19.6%', color: '#ea580c', bg: '#ffedd5' }, { range: '≥ 30', mortality: '52.6%', color: '#dc2626', bg: '#fee2e2' }].map((m, i) => (
                    <div key={i} style={{ background: m.bg, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.color }}>{m.range}</div>
                      <div style={{ fontSize: 11, color: m.color, fontWeight: 600, marginTop: 4 }}>{m.mortality}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Scores par patient</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['Patient', 'Child-Pugh', 'Score CP', 'MELD', 'Survie estimée 1 an', 'Priorité greffe'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cirrhosisPatients.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: p.childPugh === 'C' ? '#fee2e2' : p.childPugh === 'B' ? '#fef3c7' : '#dcfce7', color: p.childPugh === 'C' ? '#dc2626' : p.childPugh === 'B' ? '#b45309' : '#16a34a', borderRadius: 6, padding: '3px 12px', fontSize: 14, fontWeight: 700 }}>{p.childPugh}</span></td>
                      <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{p.childScore}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: p.meld >= 20 ? '#fee2e2' : p.meld >= 15 ? '#fef3c7' : '#dcfce7', color: p.meld >= 20 ? '#dc2626' : p.meld >= 15 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 13, fontWeight: 700 }}>{p.meld}</span></td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{p.childPugh === 'C' ? '45%' : p.childPugh === 'B' ? '80%' : '100%'}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: p.meld >= 20 ? '#fee2e2' : p.meld >= 15 ? '#fef3c7' : '#f1f5f9', color: p.meld >= 20 ? '#dc2626' : p.meld >= 15 ? '#b45309' : '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.meld >= 20 ? 'Haute' : p.meld >= 15 ? 'Modérée' : 'Faible'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'hepatitis' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Hépatites virales — Suivi traitement</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Virus', 'Génotype/AgHBs', 'Charge virale', 'Traitement', 'RVS', 'Fibrose', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hepatitisPatients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.virus === 'VHC' ? '#fef3c7' : '#dbeafe', color: p.virus === 'VHC' ? '#b45309' : '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.virus}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.virus === 'VHC' ? p.genotype : p.hbsag}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.viral_load}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                    <td style={{ padding: '10px 12px' }}>{p.svr ? <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>✓ RVS</span> : <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>En cours</span>}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#f1f5f9', color: '#475569', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.fibrosis}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
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
