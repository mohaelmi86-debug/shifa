'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TabKey = 'dashboard' | 'patients' | 'falls' | 'polypharmacy' | 'cognitive' | 'nutrition';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'patients', label: 'Patients gériatriques', icon: 'UsersIcon' },
  { key: 'falls', label: 'Chutes & Mobilité', icon: 'ExclamationTriangleIcon' },
  { key: 'polypharmacy', label: 'Polymédication', icon: 'BeakerIcon' },
  { key: 'cognitive', label: 'Troubles cognitifs', icon: 'CpuChipIcon' },
  { key: 'nutrition', label: 'Nutrition & Dénutrition', icon: 'HeartIcon' },
];

const kpis = [
  { label: 'Patients gériatriques', value: '198', sub: 'Âge moyen 78 ans', icon: 'UsersIcon', color: '#0f766e', bg: 'rgba(15,118,110,0.08)' },
  { label: 'Risque chute élevé', value: '64', sub: 'Score Morse > 45', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Dénutrition', value: '42', sub: 'MNA < 17', icon: 'HeartIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Polymédication', value: '118', sub: '≥ 5 médicaments', icon: 'BeakerIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
];

const geriatricPatients = [
  { patient: 'Mariama Diallo', age: 82, adl: 3, iadl: 2, mmse: 18, gds: 8, morse: 65, mna: 14, medications: 8, diagnoses: ['Démence Alzheimer', 'HTA', 'Diabète', 'Ostéoporose'], status: 'complex' },
  { patient: 'Oumar Sow', age: 76, adl: 5, iadl: 4, mmse: 24, gds: 4, morse: 35, mna: 22, medications: 6, diagnoses: ['HTA', 'Insuffisance cardiaque', 'BPCO'], status: 'moderate' },
  { patient: 'Fatou Ndiaye', age: 88, adl: 1, iadl: 0, mmse: 10, gds: 12, morse: 80, mna: 10, medications: 11, diagnoses: ['Démence sévère', 'Dénutrition', 'Escarre', 'Dépression'], status: 'severe' },
  { patient: 'Ibrahima Ba', age: 72, adl: 6, iadl: 6, mmse: 28, gds: 2, morse: 20, mna: 26, medications: 4, diagnoses: ['Arthrose', 'HTA'], status: 'stable' },
];

const fallsData = [
  { patient: 'Mariama Diallo', age: 82, morse: 65, lastFall: '05/08/2026', injuries: 'Fracture poignet droit', prevention: 'Barres appui, chaussures antidérapantes, kinésithérapie', status: 'high' },
  { patient: 'Fatou Ndiaye', age: 88, morse: 80, lastFall: '10/08/2026', injuries: 'Hématome sous-dural', prevention: 'Lit bas, tapis antidérapant, surveillance rapprochée', status: 'critical' },
  { patient: 'Cheikh Mbaye', age: 79, morse: 50, lastFall: '28/07/2026', injuries: 'Contusion genou', prevention: 'Déambulateur, éclairage nuit, révision médicaments', status: 'high' },
];

const cognitivePatients = [
  { patient: 'Mariama Diallo', age: 82, diagnosis: 'Maladie d\'Alzheimer', mmse: 18, cdr: 1, stage: 'Modéré', treatment: 'Donépézil 10mg/j + Mémantine 20mg/j', caregiver: 'Fille — Présente', status: 'moderate' },
  { patient: 'Fatou Ndiaye', age: 88, diagnosis: 'Démence vasculaire', mmse: 10, cdr: 2, stage: 'Sévère', treatment: 'Soins de confort — Pas d\'inhibiteur ChE', caregiver: 'EHPAD', status: 'severe' },
  { patient: 'Rokhaya Sarr', age: 74, diagnosis: 'Trouble cognitif léger', mmse: 26, cdr: 0.5, stage: 'Léger', treatment: 'Surveillance cognitive — Activités cognitives', caregiver: 'Conjoint', status: 'mild' },
];

const mnaBarData = [
  { range: 'Normal (≥24)', count: 98 }, { range: 'Risque (17-23)', count: 58 }, { range: 'Dénutrition (<17)', count: 42 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  complex: { label: 'Complexe', bg: '#fee2e2', color: '#dc2626' },
  moderate: { label: 'Modéré', bg: '#fef3c7', color: '#b45309' },
  severe: { label: 'Sévère', bg: '#fee2e2', color: '#dc2626' },
  stable: { label: 'Stable', bg: '#dcfce7', color: '#16a34a' },
  high: { label: 'Risque élevé', bg: '#fef3c7', color: '#b45309' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  mild: { label: 'Léger', bg: '#dcfce7', color: '#16a34a' },
  treatment: { label: 'Traitement', bg: '#dbeafe', color: '#1d4ed8' },
};

export default function GeriatricsWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0f766e 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="UsersIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Gériatrie & Soins aux Personnes Âgées</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>Évaluation gériatrique · Chutes · Polymédication · Cognition · Nutrition</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#0f766e' : '#fff' }}>
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Statut nutritionnel MNA — Distribution</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={mnaBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f766e" radius={[4,4,0,0]} name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Indicateurs gériatriques clés</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Patients avec syndrome de fragilité', value: '84', pct: 42, color: '#dc2626' },
                    { label: 'Dépendance ADL ≤ 4', value: '72', pct: 36, color: '#f59e0b' },
                    { label: 'Dépression (GDS > 5)', value: '56', pct: 28, color: '#7c3aed' },
                    { label: 'Troubles cognitifs (MMSE < 24)', value: '48', pct: 24, color: '#0284c7' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
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

        {activeTab === 'patients' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Évaluation gériatrique standardisée (EGS)</h3>
              <button style={{ padding: '7px 14px', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle EGS</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'ADL/6', 'IADL/8', 'MMSE/30', 'GDS/15', 'Morse', 'MNA', 'Médicaments', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geriatricPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.adl <= 3 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.adl}/6</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.iadl <= 3 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.iadl}/8</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.mmse < 20 ? '#dc2626' : p.mmse < 24 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.mmse}/30</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.gds > 5 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.gds}/15</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.morse > 45 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.morse}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.mna < 17 ? '#dc2626' : p.mna < 24 ? '#f59e0b' : '#16a34a', fontWeight: 600 }}>{p.mna}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.medications >= 8 ? '#dc2626' : p.medications >= 5 ? '#f59e0b' : '#475569', fontWeight: p.medications >= 5 ? 600 : 400 }}>{p.medications}</td>
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

        {activeTab === 'falls' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Prévention des chutes — Score Morse & Incidents</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Score Morse', 'Dernière chute', 'Blessures', 'Mesures préventives', 'Risque'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fallsData.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.morse > 45 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>{p.morse}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.lastFall}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#dc2626', fontWeight: 500 }}>{p.injuries}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 200 }}>{p.prevention}</td>
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

        {activeTab === 'polypharmacy' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {geriatricPatients.filter(p => p.medications >= 5).map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.diagnoses.join(' · ')}</p>
                  </div>
                  <div style={{ textAlign: 'center', background: p.medications >= 8 ? '#fee2e2' : '#fef3c7', borderRadius: 10, padding: '8px 12px' }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: p.medications >= 8 ? '#dc2626' : '#b45309', margin: 0 }}>{p.medications}</p>
                    <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>médicaments</p>
                  </div>
                </div>
                <div style={{ background: '#fef3c7', borderRadius: 8, padding: 10 }}>
                  <p style={{ fontSize: 11, color: '#b45309', fontWeight: 600, margin: '0 0 4px' }}>⚠ Alerte polymédication</p>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
                    {p.medications >= 8 ? 'Révision médicamenteuse urgente — Critères STOPP/START à appliquer' : 'Révision médicamenteuse recommandée — Vérifier interactions'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cognitive' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Troubles cognitifs — MMSE & CDR</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Diagnostic', 'MMSE/30', 'CDR', 'Stade', 'Traitement', 'Aidant', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cognitivePatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.diagnosis}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.mmse < 20 ? '#dc2626' : p.mmse < 24 ? '#f59e0b' : '#16a34a', fontWeight: 700 }}>{p.mmse}/30</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.cdr}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.stage}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569', maxWidth: 180 }}>{p.treatment}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.caregiver}</td>
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

        {activeTab === 'nutrition' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Fatou Ndiaye', age: 88, mna: 10, weight: 42, bmi: 16.2, albumin: 24, prealbumin: 0.12, loss: '8kg en 3 mois', support: 'CNO + Sonde nasogastrique', status: 'severe' },
              { patient: 'Mariama Diallo', age: 82, mna: 14, weight: 52, bmi: 19.8, albumin: 30, prealbumin: 0.18, loss: '4kg en 2 mois', support: 'CNO 2x/j + Enrichissement alimentaire', status: 'moderate' },
              { patient: 'Cheikh Mbaye', age: 79, mna: 20, weight: 68, bmi: 23.4, albumin: 36, prealbumin: 0.24, loss: '2kg en 1 mois', support: 'Conseils diététiques + Surveillance', status: 'mild' },
              { patient: 'Rokhaya Sarr', age: 74, mna: 26, weight: 61, bmi: 24.8, albumin: 40, prealbumin: 0.28, loss: 'Aucune', support: 'Alimentation normale', status: 'stable' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Perte pondérale : {p.loss}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'MNA', value: p.mna, alert: p.mna < 17 },
                      { label: 'IMC', value: p.bmi, alert: p.bmi < 18.5 },
                      { label: 'Albumine g/L', value: p.albumin, alert: p.albumin < 30 },
                      { label: 'Préalbumine g/L', value: p.prealbumin, alert: p.prealbumin < 0.2 },
                    ].map((item, j) => (
                      <div key={j} style={{ background: '#f8fafc', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: item.alert ? '#dc2626' : '#16a34a', margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#f0fdf4', borderRadius: 8, padding: 10 }}>
                    <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, margin: '0 0 4px' }}>Support nutritionnel</p>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.support}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
