'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TabKey = 'dashboard' | 'copd' | 'asthma' | 'efi' | 'sleep' | 'imaging';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'copd', label: 'BPCO & Insuffisance respiratoire', icon: 'ExclamationTriangleIcon' },
  { key: 'asthma', label: 'Asthme', icon: 'BoltIcon' },
  { key: 'efi', label: 'EFR & Explorations', icon: 'ChartBarIcon' },
  { key: 'sleep', label: 'Sommeil & Apnées', icon: 'MoonIcon' },
  { key: 'imaging', label: 'Imagerie thoracique', icon: 'PhotoIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '312', sub: 'Pneumologie', icon: 'UsersIcon', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
  { label: 'BPCO sévères', value: '78', sub: 'GOLD III-IV', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'EFR ce mois', value: '94', sub: '12 pathologiques', icon: 'ChartBarIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Appareils PPC', value: '56', sub: 'Apnées du sommeil', icon: 'MoonIcon', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
];

const copdPatients = [
  { patient: 'Oumar Diallo', age: 67, gold: 'GOLD III', fev1: 42, exacerbations: 3, o2: true, treatment: 'LABA/LAMA + CSI', lastExac: '02/08/2026', status: 'severe' },
  { patient: 'Mariama Sow', age: 72, gold: 'GOLD II', fev1: 58, exacerbations: 1, o2: false, treatment: 'LABA/LAMA', lastExac: '15/05/2026', status: 'moderate' },
  { patient: 'Ibrahima Ndiaye', age: 61, gold: 'GOLD IV', fev1: 28, exacerbations: 5, o2: true, treatment: 'LABA/LAMA + CSI + O2 long terme', lastExac: '08/08/2026', status: 'critical' },
  { patient: 'Fatou Camara', age: 55, gold: 'GOLD I', fev1: 74, exacerbations: 0, o2: false, treatment: 'SABA si besoin', lastExac: '—', status: 'stable' },
];

const asthmaPatients = [
  { patient: 'Aïcha Ba', age: 28, control: 'Non contrôlé', gina: 'GINA 4', eosinophils: 620, ige: 340, treatment: 'CSI forte dose + LABA + anti-IL5', lastCrisis: '05/08/2026', status: 'uncontrolled' },
  { patient: 'Cheikh Fall', age: 35, control: 'Partiellement contrôlé', gina: 'GINA 3', eosinophils: 280, ige: 180, treatment: 'CSI dose moyenne + LABA', lastCrisis: '20/06/2026', status: 'partial' },
  { patient: 'Ndéye Mbaye', age: 19, control: 'Contrôlé', gina: 'GINA 2', eosinophils: 120, ige: 95, treatment: 'CSI faible dose', lastCrisis: '10/01/2026', status: 'controlled' },
];

const efrData = [
  { patient: 'Oumar Diallo', date: '10/08/2026', fev1: 42, fvc: 68, ratio: 0.52, tlco: 38, result: 'Obstruction sévère', status: 'pathological' },
  { patient: 'Mariama Sow', date: '09/08/2026', fev1: 58, fvc: 72, ratio: 0.61, tlco: 55, result: 'Obstruction modérée', status: 'pathological' },
  { patient: 'Aïcha Ba', date: '08/08/2026', fev1: 71, fvc: 88, ratio: 0.68, tlco: 82, result: 'Réversibilité +18%', status: 'reversible' },
  { patient: 'Moussa Sarr', date: '07/08/2026', fev1: 92, fvc: 95, ratio: 0.78, tlco: 91, result: 'Normal', status: 'normal' },
];

const sleepPatients = [
  { patient: 'Cheikh Mbaye', age: 52, iah: 42, type: 'SAOS sévère', odi: 38, spo2min: 78, ppc: true, compliance: 6.2, status: 'treated' },
  { patient: 'Rokhaya Diop', age: 48, iah: 18, type: 'SAOS modéré', odi: 14, spo2min: 85, ppc: false, compliance: 0, status: 'pending' },
  { patient: 'Amadou Balde', age: 61, iah: 67, type: 'SAOS très sévère', odi: 58, spo2min: 72, ppc: true, compliance: 7.1, status: 'treated' },
];

const fev1Trend = [
  { month: 'Fév', fev1: 48 }, { month: 'Mar', fev1: 46 }, { month: 'Avr', fev1: 45 },
  { month: 'Mai', fev1: 44 }, { month: 'Jun', fev1: 43 }, { month: 'Jul', fev1: 42 }, { month: 'Aoû', fev1: 42 },
];

const exacBarData = [
  { month: 'Mar', count: 4 }, { month: 'Avr', count: 6 }, { month: 'Mai', count: 3 },
  { month: 'Jun', count: 7 }, { month: 'Jul', count: 5 }, { month: 'Aoû', count: 8 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  severe: { label: 'Sévère', bg: '#fef3c7', color: '#b45309' },
  moderate: { label: 'Modéré', bg: '#dbeafe', color: '#1d4ed8' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  uncontrolled: { label: 'Non contrôlé', bg: '#fee2e2', color: '#dc2626' },
  partial: { label: 'Partiel', bg: '#fef3c7', color: '#b45309' },
  controlled: { label: 'Contrôlé', bg: '#dcfce7', color: '#16a34a' },
  pathological: { label: 'Pathologique', bg: '#fee2e2', color: '#dc2626' },
  reversible: { label: 'Réversible', bg: '#fef3c7', color: '#b45309' },
  normal: { label: 'Normal', bg: '#dcfce7', color: '#16a34a' },
  treated: { label: 'Appareillé', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
};

export default function PneumologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BoltIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Pneumologie & Respiratoire</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>BPCO · Asthme · EFR · Apnées du sommeil · Imagerie thoracique</p>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#0284c7' : '#fff' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {/* DASHBOARD */}
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Évolution VEMS moyen (%) — Patient BPCO sévère</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={fev1Trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[30, 60]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="fev1" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} name="VEMS %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Exacerbations BPCO / mois</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={exacBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#dc2626" radius={[4,4,0,0]} name="Exacerbations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* BPCO */}
        {activeTab === 'copd' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>BPCO & Insuffisance respiratoire chronique</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>{copdPatients.length} patients</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Stade GOLD', 'VEMS %', 'Exacerbations/an', 'O₂ long terme', 'Traitement', 'Dernière exac.', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copdPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0284c7' }}>{p.gold}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.fev1 < 50 ? '#dc2626' : '#475569', fontWeight: p.fev1 < 50 ? 600 : 400 }}>{p.fev1}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.exacerbations >= 3 ? '#dc2626' : '#475569', fontWeight: p.exacerbations >= 3 ? 600 : 400 }}>{p.exacerbations}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.o2 ? '#fee2e2' : '#f1f5f9', color: p.o2 ? '#dc2626' : '#64748b' }}>{p.o2 ? 'Oui' : 'Non'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.lastExac}</td>
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

        {/* ASTHME */}
        {activeTab === 'asthma' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Suivi Asthme — Contrôle & Biothérapies</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Contrôle', 'Palier GINA', 'Éosinophiles/µL', 'IgE totales', 'Traitement', 'Dernière crise', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {asthmaPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.control}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>{p.gina}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.eosinophils > 300 ? '#dc2626' : '#475569', fontWeight: p.eosinophils > 300 ? 600 : 400 }}>{p.eosinophils}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.ige} UI/mL</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.lastCrisis}</td>
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

        {/* EFR */}
        {activeTab === 'efi' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Explorations Fonctionnelles Respiratoires (EFR)</h3>
              <button style={{ padding: '7px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle EFR</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Date', 'VEMS %', 'CVF %', 'Rapport VEMS/CVF', 'TLCO %', 'Résultat', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {efrData.map((e, i) => {
                  const s = statusConfig[e.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{e.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: e.fev1 < 70 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{e.fev1}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.fvc}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: e.ratio < 0.7 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{e.ratio.toFixed(2)}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: e.tlco < 70 ? '#dc2626' : '#475569' }}>{e.tlco}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{e.result}</td>
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

        {/* SLEEP */}
        {activeTab === 'sleep' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Apnées du sommeil & Appareillage PPC</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'IAH/h', 'Type', 'ODI', 'SpO₂ min %', 'PPC', 'Observance (h/nuit)', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sleepPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.iah > 30 ? '#dc2626' : '#f59e0b', fontWeight: 600 }}>{p.iah}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.odi}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.spo2min < 80 ? '#dc2626' : '#475569', fontWeight: p.spo2min < 80 ? 600 : 400 }}>{p.spo2min}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: p.ppc ? '#dcfce7' : '#f1f5f9', color: p.ppc ? '#16a34a' : '#64748b' }}>{p.ppc ? 'Oui' : 'Non'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.compliance >= 4 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{p.compliance > 0 ? `${p.compliance}h` : '—'}</td>
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

        {/* IMAGING */}
        {activeTab === 'imaging' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Ibrahima Ndiaye', type: 'TDM thoracique', date: '10/08/2026', finding: 'Emphysème centrolobulaire diffus — Bulles apicales bilatérales', urgency: 'semi-urgent', icon: 'PhotoIcon' },
              { patient: 'Oumar Diallo', type: 'Radiographie thorax', date: '09/08/2026', finding: 'Distension thoracique — Aplatissement diaphragmatique — Hyperclarté', urgency: 'normal', icon: 'PhotoIcon' },
              { patient: 'Aïcha Ba', type: 'TDM haute résolution', date: '08/08/2026', finding: 'Épaississement parois bronchiques — Piégeage aérique en mosaïque', urgency: 'normal', icon: 'PhotoIcon' },
              { patient: 'Mariama Sow', type: 'Scintigraphie V/P', date: '07/08/2026', finding: 'Défect perfusionnel segment postéro-basal droit — Suspicion EP', urgency: 'urgent', icon: 'ExclamationTriangleIcon' },
            ].map((img, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{img.patient}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{img.type} — {img.date}</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    background: img.urgency === 'urgent' ? '#fee2e2' : img.urgency === 'semi-urgent' ? '#fef3c7' : '#f1f5f9',
                    color: img.urgency === 'urgent' ? '#dc2626' : img.urgency === 'semi-urgent' ? '#b45309' : '#64748b' }}>
                    {img.urgency === 'urgent' ? 'Urgent' : img.urgency === 'semi-urgent' ? 'Semi-urgent' : 'Programmé'}
                  </span>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: 1.5 }}>{img.finding}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
