'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'patients' | 'das28' | 'biotherapy' | 'imaging' | 'labs';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patients rhumato', icon: 'UsersIcon' },
  { key: 'das28', label: 'Scores DAS28', icon: 'ChartBarIcon' },
  { key: 'biotherapy', label: 'Biothérapies', icon: 'BeakerIcon' },
  { key: 'imaging', label: 'Imagerie articulaire', icon: 'PhotoIcon' },
  { key: 'labs', label: 'Biologie', icon: 'ClipboardDocumentListIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '234', sub: 'Rhumatologie active', icon: 'UsersIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Sous biothérapie', value: '78', sub: '33% des patients', icon: 'BeakerIcon', color: '#0066ff', bg: 'rgba(0,102,255,0.08)' },
  { label: 'DAS28 moyen', value: '3.8', sub: 'Activité modérée', icon: 'ChartBarIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Imageries/mois', value: '56', sub: 'Rx + IRM + Echo', icon: 'PhotoIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const patients = [
  { patient: 'Mamadou Sow', age: 48, disease: 'Polyarthrite rhumatoïde', das28: 5.2, rf: true, acpa: true, treatment: 'Méthotrexate + Adalimumab', lastVisit: '01/08/2026', status: 'active' },
  { patient: 'Fatou Ndiaye', age: 35, disease: 'Lupus érythémateux systémique', das28: 2.8, rf: false, acpa: false, treatment: 'Hydroxychloroquine + Prednisone 5mg', lastVisit: '15/07/2026', status: 'stable' },
  { patient: 'Ibrahima Fall', age: 42, disease: 'Spondylarthrite ankylosante', das28: 4.1, rf: false, acpa: false, treatment: 'Naproxène + Sécukinumab', lastVisit: '05/08/2026', status: 'active' },
  { patient: 'Aïcha Ba', age: 55, disease: 'Polyarthrite rhumatoïde', das28: 2.1, rf: true, acpa: true, treatment: 'Méthotrexate 15mg/sem', lastVisit: '20/07/2026', status: 'remission' },
  { patient: 'Oumar Diop', age: 62, disease: 'Goutte chronique', das28: 1.8, rf: false, acpa: false, treatment: 'Allopurinol 300mg + Colchicine', lastVisit: '10/08/2026', status: 'stable' },
];

const das28Trend = [
  { month: 'Fév', das28: 6.2 }, { month: 'Mar', das28: 5.8 }, { month: 'Avr', das28: 5.4 },
  { month: 'Mai', das28: 5.0 }, { month: 'Jun', das28: 4.8 }, { month: 'Jul', das28: 5.2 }, { month: 'Aoû', das28: 5.2 },
];

const biotherapies = [
  { patient: 'Mamadou Sow', drug: 'Adalimumab (Humira)', class: 'Anti-TNF', dose: '40mg SC/2sem', since: '15/01/2025', nextInfusion: '25/08/2026', response: 'Partielle', tolerance: 'Bonne', status: 'active' },
  { patient: 'Ibrahima Fall', drug: 'Sécukinumab (Cosentyx)', class: 'Anti-IL17', dose: '150mg SC/mois', since: '20/03/2025', nextInfusion: '20/08/2026', response: 'Bonne', tolerance: 'Excellente', status: 'active' },
  { patient: 'Cheikh Mbaye', drug: 'Rituximab (MabThera)', class: 'Anti-CD20', dose: '1g IV x2/6mois', since: '10/02/2024', nextInfusion: '10/08/2026', response: 'Bonne', tolerance: 'Bonne', status: 'infusion_due' },
  { patient: 'Rokhaya Sarr', drug: 'Tocilizumab (RoActemra)', class: 'Anti-IL6', dose: '8mg/kg IV/mois', since: '05/06/2025', nextInfusion: '05/09/2026', response: 'Excellente', tolerance: 'Bonne', status: 'active' },
];

const imagingList = [
  { id: 'RX-001', patient: 'Mamadou Sow', type: 'Radiographie mains/pieds', indication: 'Suivi PR — érosions', date: '10/08/2026', result: 'Érosions carpiennes bilatérales — Score Sharp 28', status: 'reported' },
  { id: 'IRM-001', patient: 'Ibrahima Fall', type: 'IRM sacro-iliaque', indication: 'Spondylarthrite', date: '08/08/2026', result: 'Sacro-iliite bilatérale grade III — Œdème actif', status: 'reported' },
  { id: 'ECH-001', patient: 'Aïcha Ba', type: 'Échographie articulaire', indication: 'Synovite poignets', date: '05/08/2026', result: 'Synovite grade 1 poignets — Pas de signal Doppler', status: 'reported' },
  { id: 'RX-002', patient: 'Oumar Diop', type: 'Radiographie genou droit', indication: 'Arthropathie goutteuse', date: '03/08/2026', result: 'Chondrocalcinose — Géodes sous-chondrales', status: 'reported' },
];

const labResults = [
  { patient: 'Mamadou Sow', crp: 42, vs: 68, fr: 320, acpa: 180, complement: 'Normal', cbc: 'Normal', date: '10/08/2026' },
  { patient: 'Fatou Ndiaye', crp: 8, vs: 28, fr: 12, acpa: 8, complement: 'C3 bas', cbc: 'Leucopénie', date: '15/07/2026' },
  { patient: 'Ibrahima Fall', crp: 28, vs: 52, fr: 15, acpa: 10, complement: 'Normal', cbc: 'Normal', date: '05/08/2026' },
  { patient: 'Aïcha Ba', crp: 5, vs: 18, fr: 280, acpa: 150, complement: 'Normal', cbc: 'Normal', date: '20/07/2026' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: 'Maladie active', bg: '#fef3c7', color: '#b45309' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  remission: { label: 'Rémission', bg: '#d1fae5', color: '#059669' },
  infusion_due: { label: 'Perfusion due', bg: '#fee2e2', color: '#dc2626' },
  reported: { label: 'Rapporté', bg: '#dcfce7', color: '#16a34a' },
};

export default function RheumatologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="SparklesIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Rhumatologie</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>PR — Lupus — Spondylarthrite — Scores DAS28 — Biothérapies</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>78 biothérapies</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>234 patients</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)', transition: 'all 0.2s' }}>
              <Icon name={tab.icon} size={15} color={activeTab === tab.key ? '#7c3aed' : 'rgba(255,255,255,0.8)'} />
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
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Évolution DAS28 — Mamadou Sow</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={das28Trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 8]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="das28" stroke="#7c3aed" strokeWidth={2} name="DAS28" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Biothérapies actives</h3>
                {biotherapies.slice(0, 4).map((b, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{b.patient}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{b.drug} — {b.class}</div>
                      </div>
                      <span style={{ background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[b.status]?.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Patients rhumatologie</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Maladie', 'DAS28', 'FR', 'ACPA', 'Traitement', 'Dernière visite', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient} <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.age}a</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.disease}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: p.das28 >= 5.1 ? '#fee2e2' : p.das28 >= 3.2 ? '#fef3c7' : '#dcfce7', color: p.das28 >= 5.1 ? '#dc2626' : p.das28 >= 3.2 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{p.das28}</span></td>
                    <td style={{ padding: '10px 12px' }}>{p.rf ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>+</span> : <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>—</span>}</td>
                    <td style={{ padding: '10px 12px' }}>{p.acpa ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>+</span> : <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>—</span>}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{p.treatment}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{p.lastVisit}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[p.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'das28' && (
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>Interprétation DAS28</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[{ range: '< 2.6', label: 'Rémission', color: '#16a34a', bg: '#dcfce7' }, { range: '2.6-3.2', label: 'Activité faible', color: '#65a30d', bg: '#f7fee7' }, { range: '3.2-5.1', label: 'Activité modérée', color: '#b45309', bg: '#fef3c7' }, { range: '> 5.1', label: 'Activité élevée', color: '#dc2626', bg: '#fee2e2' }].map((d, i) => (
                  <div key={i} style={{ background: d.bg, borderRadius: 10, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: d.color }}>{d.range}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>DAS28 par patient</h3>
              {patients.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: i < patients.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width: 160 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.patient}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{p.disease}</div>
                  </div>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <div style={{ width: `${(p.das28 / 8) * 100}%`, height: '100%', background: p.das28 >= 5.1 ? '#dc2626' : p.das28 >= 3.2 ? '#f59e0b' : '#16a34a', borderRadius: 8, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ width: 50, fontSize: 16, fontWeight: 700, color: p.das28 >= 5.1 ? '#dc2626' : p.das28 >= 3.2 ? '#b45309' : '#16a34a', textAlign: 'right' }}>{p.das28}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'biotherapy' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Biothérapies — Suivi</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'Médicament', 'Classe', 'Posologie', 'Depuis', 'Prochaine dose', 'Réponse', 'Tolérance', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {biotherapies.map((b, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{b.patient}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{b.drug}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{b.class}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{b.dose}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{b.since}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: b.status === 'infusion_due' ? '#dc2626' : '#64748b', fontWeight: b.status === 'infusion_due' ? 700 : 400 }}>{b.nextInfusion}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: b.response === 'Excellente' ? '#dcfce7' : b.response === 'Bonne' ? '#d1fae5' : '#fef3c7', color: b.response === 'Excellente' ? '#059669' : b.response === 'Bonne' ? '#16a34a' : '#b45309', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{b.response}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>{b.tolerance}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[b.status]?.bg, color: statusConfig[b.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[b.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'imaging' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Imagerie articulaire</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['ID', 'Patient', 'Examen', 'Indication', 'Date', 'Résultat', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {imagingList.map((img, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{img.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{img.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: '#ede9fe', color: '#7c3aed', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{img.type}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569' }}>{img.indication}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b' }}>{img.date}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#475569', maxWidth: 240 }}>{img.result}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: statusConfig[img.status]?.bg, color: statusConfig[img.status]?.color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{statusConfig[img.status]?.label}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'labs' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Biologie rhumatologique</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Patient', 'CRP (mg/L)', 'VS (mm/h)', 'FR (UI/mL)', 'Anti-CCP (U/mL)', 'Complément', 'NFS', 'Date'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labResults.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{l.patient}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.crp > 20 ? '#fee2e2' : l.crp > 5 ? '#fef3c7' : '#dcfce7', color: l.crp > 20 ? '#dc2626' : l.crp > 5 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.crp}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.vs > 40 ? '#fef3c7' : '#dcfce7', color: l.vs > 40 ? '#b45309' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.vs}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.fr > 20 ? '#fee2e2' : '#dcfce7', color: l.fr > 20 ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.fr}</span></td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: l.acpa > 20 ? '#fee2e2' : '#dcfce7', color: l.acpa > 20 ? '#dc2626' : '#16a34a', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{l.acpa}</span></td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: l.complement !== 'Normal' ? '#dc2626' : '#16a34a', fontWeight: l.complement !== 'Normal' ? 700 : 400 }}>{l.complement}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: l.cbc !== 'Normal' ? '#f59e0b' : '#16a34a', fontWeight: l.cbc !== 'Normal' ? 700 : 400 }}>{l.cbc}</td>
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
