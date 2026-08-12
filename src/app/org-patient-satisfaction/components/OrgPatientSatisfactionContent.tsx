'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type TabKey = 'dashboard' | 'surveys' | 'complaints' | 'improvement' | 'benchmarking';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'surveys', label: 'Enquêtes NPS', icon: 'StarIcon' },
  { key: 'complaints', label: 'Réclamations', icon: 'ExclamationTriangleIcon' },
  { key: 'improvement', label: 'Plans d\'amélioration', icon: 'ArrowTrendingUpIcon' },
  { key: 'benchmarking', label: 'Benchmarking qualité', icon: 'ChartBarSquareIcon' },
];

const kpis = [
  { label: 'NPS global', value: '+42', sub: 'Objectif ≥ +40', icon: 'StarIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Réponses ce mois', value: '284', sub: 'Taux réponse 68%', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Réclamations', value: '12', sub: '3 en cours', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Actions en cours', value: '8', sub: '5 plans actifs', icon: 'ArrowTrendingUpIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
];

const npsData = [
  { month: 'Mar', nps: 35, promoters: 58, passives: 19, detractors: 23 },
  { month: 'Avr', nps: 38, promoters: 61, passives: 16, detractors: 23 },
  { month: 'Mai', nps: 40, promoters: 63, passives: 14, detractors: 23 },
  { month: 'Jun', nps: 37, promoters: 60, passives: 17, detractors: 23 },
  { month: 'Jul', nps: 41, promoters: 64, passives: 13, detractors: 23 },
  { month: 'Aoû', nps: 42, promoters: 65, passives: 12, detractors: 23 },
];

const surveyResults = [
  { service: 'Urgences', nps: 28, responses: 48, satisfaction: 72, topIssue: 'Temps d\'attente', trend: 'up' },
  { service: 'Médecine interne', nps: 45, responses: 62, satisfaction: 84, topIssue: 'Communication', trend: 'stable' },
  { service: 'Chirurgie', nps: 52, responses: 38, satisfaction: 88, topIssue: 'Douleur post-op', trend: 'up' },
  { service: 'Maternité', nps: 61, responses: 44, satisfaction: 92, topIssue: 'Accompagnement', trend: 'up' },
  { service: 'Pédiatrie', nps: 48, responses: 35, satisfaction: 86, topIssue: 'Information parents', trend: 'down' },
  { service: 'Réanimation', nps: 38, responses: 22, satisfaction: 79, topIssue: 'Communication famille', trend: 'stable' },
];

const complaints = [
  { id: 'REC-001', date: '10/08/2026', patient: 'Aïcha Diallo', service: 'Urgences', category: 'Temps d\'attente', description: 'Attente de 4h aux urgences sans information', priority: 'medium', status: 'in-progress', assignee: 'Mme. Kouyaté', deadline: '17/08/2026' },
  { id: 'REC-002', date: '09/08/2026', patient: 'Mamadou Sow', service: 'Médecine interne', category: 'Communication', description: 'Manque d\'information sur le diagnostic', priority: 'high', status: 'open', assignee: 'Dr. Diallo', deadline: '12/08/2026' },
  { id: 'REC-003', date: '08/08/2026', patient: 'Fatou Ndiaye', service: 'Chirurgie', category: 'Douleur', description: 'Douleur post-opératoire insuffisamment prise en charge', priority: 'high', status: 'resolved', assignee: 'Dr. Sy', deadline: '10/08/2026' },
  { id: 'REC-004', date: '07/08/2026', patient: 'Ibrahima Fall', service: 'Pharmacie', category: 'Médicament', description: 'Erreur dans la délivrance d\'ordonnance', priority: 'critical', status: 'resolved', assignee: 'Pharm. Ba', deadline: '08/08/2026' },
  { id: 'REC-005', date: '05/08/2026', patient: 'Mariama Balde', service: 'Pédiatrie', category: 'Information', description: 'Parents non informés du changement de traitement', priority: 'medium', status: 'in-progress', assignee: 'Dr. Ndiaye', deadline: '15/08/2026' },
];

const improvementPlans = [
  { id: 'PAM-001', title: 'Réduction temps d\'attente aux urgences', service: 'Urgences', owner: 'Dr. Fall', startDate: '01/07/2026', targetDate: '30/09/2026', progress: 45, actions: 6, completed: 3, status: 'in-progress', kpi: 'Temps attente médian < 90min' },
  { id: 'PAM-002', title: 'Amélioration communication médecin-patient', service: 'Médecine interne', owner: 'Dr. Diallo', startDate: '15/07/2026', targetDate: '15/10/2026', progress: 30, actions: 5, completed: 2, status: 'in-progress', kpi: 'NPS communication ≥ 50' },
  { id: 'PAM-003', title: 'Protocole douleur post-opératoire', service: 'Chirurgie', owner: 'Dr. Sy', startDate: '01/06/2026', targetDate: '31/08/2026', progress: 80, actions: 4, completed: 3, status: 'in-progress', kpi: 'EVA moyen < 4/10 à 24h' },
  { id: 'PAM-004', title: 'Information famille en réanimation', service: 'Réanimation', owner: 'Dr. Camara', startDate: '01/08/2026', targetDate: '31/10/2026', progress: 15, actions: 5, completed: 1, status: 'in-progress', kpi: 'Satisfaction famille ≥ 80%' },
  { id: 'PAM-005', title: 'Accueil et orientation à l\'entrée', service: 'Accueil', owner: 'Mme. Kouyaté', startDate: '01/05/2026', targetDate: '31/07/2026', progress: 100, actions: 4, completed: 4, status: 'completed', kpi: 'Satisfaction accueil ≥ 85%' },
];

const benchmarkData = [
  { indicator: 'NPS global', hospital: 42, regional: 38, national: 35, target: 40 },
  { indicator: 'Délai réponse réclamation', hospital: 4.2, regional: 5.8, national: 7.1, target: 5 },
  { indicator: 'Taux résolution J+7', hospital: 78, regional: 71, national: 68, target: 80 },
  { indicator: 'Satisfaction globale (%)', hospital: 84, regional: 79, national: 76, target: 85 },
  { indicator: 'Taux réponse enquêtes (%)', hospital: 68, regional: 52, national: 48, target: 65 },
];

const priorityConfig: Record<string, { label: string; bg: string; color: string }> = {
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  high: { label: 'Élevée', bg: '#fed7aa', color: '#c2410c' },
  medium: { label: 'Modérée', bg: '#fef3c7', color: '#b45309' },
  low: { label: 'Faible', bg: '#dbeafe', color: '#1d4ed8' },
};

export default function OrgPatientSatisfactionContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="StarIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Satisfaction Patient & Expérience</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Enquêtes NPS, réclamations, plans d'amélioration, benchmarking qualité</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#3730a3' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #3730a3' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? '#3730a3' : '#94a3b8'} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Évolution NPS — 6 mois</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={npsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="nps" name="NPS" stroke="#3730a3" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Répartition NPS — Août</h3>
                {[{ label: 'Promoteurs (9-10)', value: npsData[5].promoters, color: '#16a34a' }, { label: 'Passifs (7-8)', value: npsData[5].passives, color: '#f59e0b' }, { label: 'Détracteurs (0-6)', value: npsData[5].detractors, color: '#dc2626' }].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}%</span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Résultats NPS par service</h3>
              <button style={{ padding: '8px 16px', background: '#3730a3', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Lancer enquête</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Service', 'NPS', 'Réponses', 'Satisfaction', 'Principal problème', 'Tendance'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {surveyResults.map((s, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.service}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: s.nps >= 40 ? '#16a34a' : s.nps >= 20 ? '#f59e0b' : '#dc2626' }}>+{s.nps}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{s.responses}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${s.satisfaction}%`, height: '100%', background: s.satisfaction >= 85 ? '#16a34a' : s.satisfaction >= 70 ? '#f59e0b' : '#dc2626', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{s.satisfaction}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: '#fef3c7', color: '#b45309' }}>{s.topIssue}</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      <Icon name={s.trend === 'up' ? 'ArrowUpIcon' : s.trend === 'down' ? 'ArrowDownIcon' : 'MinusIcon'} size={16} color={s.trend === 'up' ? '#16a34a' : s.trend === 'down' ? '#dc2626' : '#94a3b8'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Gestion des réclamations</h3>
              <button style={{ padding: '8px 16px', background: '#3730a3', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouvelle réclamation</button>
            </div>
            {complaints.map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${c.status === 'open' ? '#fca5a5' : '#e2e8f0'}`, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{c.patient} — {c.service}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{c.id} — {c.date} — Catégorie: {c.category}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: priorityConfig[c.priority].bg, color: priorityConfig[c.priority].color }}>{priorityConfig[c.priority].label}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: c.status === 'resolved' ? '#dcfce7' : c.status === 'in-progress' ? '#dbeafe' : '#fee2e2', color: c.status === 'resolved' ? '#16a34a' : c.status === 'in-progress' ? '#1d4ed8' : '#dc2626' }}>
                      {c.status === 'resolved' ? 'Résolu' : c.status === 'in-progress' ? 'En cours' : 'Ouvert'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 10, fontSize: 13, color: '#475569', marginBottom: 8 }}>{c.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Assigné à: <strong>{c.assignee}</strong></span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Délai: <strong style={{ color: c.status !== 'resolved' ? '#dc2626' : '#16a34a' }}>{c.deadline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'improvement' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Plans d'amélioration de l'expérience patient</h3>
              <button style={{ padding: '8px 16px', background: '#3730a3', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Nouveau plan</button>
            </div>
            {improvementPlans.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{p.service} — Responsable: {p.owner} — Objectif: {p.kpi}</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: p.status === 'completed' ? '#dcfce7' : '#dbeafe', color: p.status === 'completed' ? '#16a34a' : '#1d4ed8' }}>{p.status === 'completed' ? 'Terminé' : 'En cours'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', background: p.progress === 100 ? '#16a34a' : '#3730a3', borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.progress}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Actions: {p.completed}/{p.actions} complétées</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{p.startDate} → {p.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'benchmarking' && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Benchmarking qualité — Comparaison régionale & nationale</h3>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Indicateur', 'Notre établissement', 'Moyenne régionale', 'Moyenne nationale', 'Objectif', 'Positionnement'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {benchmarkData.map((b, i) => {
                    const isGood = b.indicator.includes('Délai') ? b.hospital <= b.target : b.hospital >= b.target;
                    return (
                      <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{b.indicator}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: isGood ? '#16a34a' : '#dc2626' }}>{b.hospital}{b.indicator.includes('%') || b.indicator.includes('NPS') ? '' : 'j'}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.regional}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.national}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.target}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon name={isGood ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={16} color={isGood ? '#16a34a' : '#f59e0b'} />
                            <span style={{ fontSize: 12, color: isGood ? '#16a34a' : '#b45309' }}>{isGood ? 'Objectif atteint' : 'À améliorer'}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
