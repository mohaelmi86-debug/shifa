'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'hemato' | 'transfusion' | 'coagulation' | 'transplant' | 'biology';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: "Vue d'ensemble", icon: 'Squares2X2Icon' },
  { key: 'hemato', label: 'Hématologie clinique', icon: 'BeakerIcon' },
  { key: 'transfusion', label: 'Transfusion', icon: 'HeartIcon' },
  { key: 'coagulation', label: 'Hémostase & Coagulation', icon: 'ExclamationTriangleIcon' },
  { key: 'transplant', label: 'Greffe & Allogreffe', icon: 'SparklesIcon' },
  { key: 'biology', label: 'Biologie hématologique', icon: 'ChartBarIcon' },
];

const kpis = [
  { label: 'Patients suivis', value: '184', sub: 'Hématologie', icon: 'UsersIcon', color: '#be123c', bg: 'rgba(190,18,60,0.08)' },
  { label: 'Hémopathies malignes', value: '67', sub: 'LAM/LLC/LNH/MM', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Transfusions/mois', value: '142', sub: 'CGR + PFC + CPA', icon: 'HeartIcon', color: '#e11d48', bg: 'rgba(225,29,72,0.08)' },
  { label: 'Dossiers greffe', value: '12', sub: '4 en attente', icon: 'SparklesIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
];

const hemPatients = [
  { patient: 'Mamadou Diallo', age: 58, diagnosis: 'LAM M2', phase: 'Induction', blast: 72, wbc: 48.2, hb: 7.1, plt: 28, treatment: 'Cytarabine + Daunorubicine (7+3)', status: 'induction' },
  { patient: 'Fatou Sow', age: 65, diagnosis: 'LLC stade III', phase: 'Traitement', blast: 0, wbc: 124, hb: 9.2, plt: 68, treatment: 'Ibrutinib 420mg/j', status: 'treatment' },
  { patient: 'Ibrahima Ndiaye', age: 52, diagnosis: 'Myélome multiple', phase: 'Rémission', blast: 0, wbc: 6.8, hb: 11.4, plt: 142, treatment: 'Lénalidomide + Dexaméthasone (maintenance)', status: 'remission' },
  { patient: 'Aïcha Ba', age: 34, diagnosis: 'LNH diffus à grandes cellules B', phase: 'Consolidation', blast: 0, wbc: 4.2, hb: 10.8, plt: 98, treatment: 'R-CHOP cycle 4/6', status: 'consolidation' },
];

const transfusions = [
  { patient: 'Mamadou Diallo', date: '11/08/2026', product: 'CGR x2', indication: 'Anémie sévère Hb 7.1 g/dL', group: 'A+', crossmatch: 'Compatible', status: 'done' },
  { patient: 'Mariama Camara', date: '11/08/2026', product: 'CPA x1', indication: 'Thrombopénie < 10G/L', group: 'O+', crossmatch: 'Compatible', status: 'done' },
  { patient: 'Cheikh Fall', date: '10/08/2026', product: 'PFC x4', indication: 'CIVD — TP 32%', group: 'B+', crossmatch: 'Compatible', status: 'done' },
  { patient: 'Rokhaya Mbaye', date: '12/08/2026', product: 'CGR x2', indication: 'Anémie hémolytique Hb 6.8 g/dL', group: 'AB+', crossmatch: 'En cours', status: 'pending' },
];

const hbTrend = [
  { day: 'J1', hb: 7.1 }, { day: 'J3', hb: 8.4 }, { day: 'J5', hb: 9.2 },
  { day: 'J7', hb: 9.8 }, { day: 'J10', hb: 10.4 }, { day: 'J14', hb: 11.1 },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  induction: { label: 'Induction', bg: '#fee2e2', color: '#dc2626' },
  treatment: { label: 'Traitement', bg: '#dbeafe', color: '#1d4ed8' },
  remission: { label: 'Rémission', bg: '#dcfce7', color: '#16a34a' },
  consolidation: { label: 'Consolidation', bg: '#fef3c7', color: '#b45309' },
  done: { label: 'Réalisée', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En cours', bg: '#fef3c7', color: '#b45309' },
  normal: { label: 'Normal', bg: '#dcfce7', color: '#16a34a' },
  abnormal: { label: 'Anormal', bg: '#fee2e2', color: '#dc2626' },
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  waiting: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
  engrafted: { label: 'Prise de greffe', bg: '#dcfce7', color: '#16a34a' },
};

export default function HematologyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #881337 0%, #be123c 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BeakerIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Hématologie & Transfusion</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>Hémopathies · Transfusion · Coagulation · Greffe de moelle</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.12)',
                color: activeTab === t.key ? '#be123c' : '#fff' }}>
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
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Évolution Hb post-transfusion (g/dL)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={hbTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis domain={[6, 13]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="hb" stroke="#be123c" strokeWidth={2} dot={{ r: 3 }} name="Hb g/dL" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Répartition hémopathies malignes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Leucémies aiguës (LAM/LAL)', count: 22, pct: 33, color: '#dc2626' },
                    { label: 'Lymphomes (LNH/LH)', count: 18, pct: 27, color: '#7c3aed' },
                    { label: 'Myélome multiple', count: 14, pct: 21, color: '#0284c7' },
                    { label: 'LLC / SMP', count: 13, pct: 19, color: '#f59e0b' },
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

        {activeTab === 'hemato' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Hémopathies malignes — Suivi clinique</h3>
              <button style={{ padding: '7px 14px', background: '#be123c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouveau dossier</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Âge', 'Diagnostic', 'Phase', 'Blastes %', 'GB G/L', 'Hb g/dL', 'Plaquettes G/L', 'Traitement', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hemPatients.map((p, i) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.age} ans</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.diagnosis}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{p.phase}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.blast > 20 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.blast > 0 ? `${p.blast}%` : '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.wbc > 20 ? '#dc2626' : '#475569', fontWeight: p.wbc > 20 ? 600 : 400 }}>{p.wbc}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.hb < 8 ? '#dc2626' : '#475569', fontWeight: p.hb < 8 ? 600 : 400 }}>{p.hb}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: p.plt < 50 ? '#dc2626' : '#475569', fontWeight: p.plt < 50 ? 600 : 400 }}>{p.plt}</td>
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

        {activeTab === 'transfusion' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Actes transfusionnels — Traçabilité</h3>
              <button style={{ padding: '7px 14px', background: '#be123c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Nouvelle transfusion</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Patient', 'Date', 'Produit', 'Indication', 'Groupe', 'Compatibilité', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfusions.map((t, i) => {
                  const s = statusConfig[t.status];
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t.patient}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{t.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#be123c' }}>{t.product}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{t.indication}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t.group}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: t.crossmatch === 'Compatible' ? '#dcfce7' : '#fef3c7',
                          color: t.crossmatch === 'Compatible' ? '#16a34a' : '#b45309' }}>{t.crossmatch}</span>
                      </td>
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

        {activeTab === 'coagulation' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Cheikh Fall', diagnosis: 'CIVD aiguë', tp: 32, tca: 2.8, fibrinogen: 0.8, ddimers: 12400, treatment: 'PFC + Fibrinogène + Traitement étiologique', status: 'critical' },
              { patient: 'Aminata Diop', diagnosis: 'Hémophilie A sévère', tp: 98, tca: 3.4, fibrinogen: 3.2, ddimers: 180, treatment: 'Facteur VIII 50 UI/kg — Emicizumab prophylaxie', status: 'treatment' },
              { patient: 'Oumar Sarr', diagnosis: 'Thrombose veineuse profonde', tp: 88, tca: 1.2, fibrinogen: 4.8, ddimers: 2800, treatment: 'Rivaroxaban 15mg x2/j (phase aiguë)', status: 'treatment' },
              { patient: 'Ndéye Balde', diagnosis: 'Déficit en protéine C', tp: 94, tca: 1.1, fibrinogen: 3.6, ddimers: 420, treatment: 'Anticoagulation préventive — Warfarine', status: 'monitoring' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.diagnosis}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'TP %', value: p.tp, alert: p.tp < 50 },
                      { label: 'TCA ratio', value: p.tca, alert: p.tca > 2 },
                      { label: 'Fibrinogène g/L', value: p.fibrinogen, alert: p.fibrinogen < 1.5 },
                      { label: 'D-dimères ng/mL', value: p.ddimers, alert: p.ddimers > 500 },
                    ].map((item, j) => (
                      <div key={j} style={{ background: '#f8fafc', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: item.alert ? '#dc2626' : '#16a34a', margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{p.treatment}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'transplant' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Mamadou Diallo', age: 58, type: 'Allogreffe géno-identique', indication: 'LAM M2 RC1', donor: 'Frère HLA 10/10', day: 'J+42', chimerism: 98, gvhd: 'Grade I cutané', status: 'engrafted' },
              { patient: 'Fatou Camara', age: 44, type: 'Autogreffe', indication: 'Myélome multiple', donor: 'Auto', day: 'J+18', chimerism: 100, gvhd: '—', status: 'engrafted' },
              { patient: 'Ibrahima Sow', age: 35, type: 'Allogreffe non apparentée', indication: 'LAL Ph+', donor: 'Registre 9/10', day: 'En attente', chimerism: 0, gvhd: '—', status: 'waiting' },
              { patient: 'Aïcha Ndiaye', age: 52, type: 'Allogreffe haplo-identique', indication: 'LNH réfractaire', donor: 'Fils 5/10', day: 'J+8', chimerism: 62, gvhd: 'Surveillance', status: 'engrafted' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{p.patient} — {p.age} ans</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{p.type}</p>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Indication</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.indication}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Donneur</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.donor}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Jour greffe</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed', margin: 0 }}>{p.day}</p>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10 }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>Chimérisme %</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: p.chimerism >= 95 ? '#16a34a' : p.chimerism > 0 ? '#f59e0b' : '#64748b', margin: 0 }}>{p.chimerism > 0 ? `${p.chimerism}%` : '—'}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>GvHD : <strong>{p.gvhd}</strong></p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'biology' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { patient: 'Mamadou Diallo', nfs: { gb: 48.2, hb: 7.1, plt: 28 }, reticulocytes: 12, ferritin: 8, b12: 180, folates: 3.2, ldh: 1240, status: 'abnormal' },
              { patient: 'Fatou Sow', nfs: { gb: 124, hb: 9.2, plt: 68 }, reticulocytes: 28, ferritin: 420, b12: 890, folates: 8.4, ldh: 680, status: 'abnormal' },
              { patient: 'Ibrahima Ndiaye', nfs: { gb: 6.8, hb: 11.4, plt: 142 }, reticulocytes: 68, ferritin: 280, b12: 420, folates: 6.8, ldh: 220, status: 'normal' },
              { patient: 'Aïcha Ba', nfs: { gb: 4.2, hb: 10.8, plt: 98 }, reticulocytes: 42, ferritin: 18, b12: 310, folates: 4.2, ldh: 380, status: 'normal' },
            ].map((p, i) => {
              const s = statusConfig[p.status];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.patient}</p>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {[
                      { label: 'GB G/L', value: p.nfs.gb, alert: p.nfs.gb > 10 || p.nfs.gb < 4 },
                      { label: 'Hb g/dL', value: p.nfs.hb, alert: p.nfs.hb < 10 },
                      { label: 'Plaquettes G/L', value: p.nfs.plt, alert: p.nfs.plt < 100 },
                      { label: 'Réticulocytes G/L', value: p.reticulocytes, alert: false },
                      { label: 'Ferritine µg/L', value: p.ferritin, alert: p.ferritin < 20 },
                      { label: 'LDH UI/L', value: p.ldh, alert: p.ldh > 500 },
                    ].map((item, j) => (
                      <div key={j} style={{ background: '#f8fafc', borderRadius: 8, padding: 8, textAlign: 'center' }}>
                        <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 2px' }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: item.alert ? '#dc2626' : '#475569', margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
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
