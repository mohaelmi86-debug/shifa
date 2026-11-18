'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type TabKey = 'dashboard' | 'payslips' | 'contributions' | 'qualifications' | 'evaluations' | 'training';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
  { key: 'payslips', label: 'Bulletins de paie', icon: 'DocumentTextIcon' },
  { key: 'contributions', label: 'Cotisations sociales', icon: 'BanknotesIcon' },
  { key: 'qualifications', label: 'Habilitations & Qualif.', icon: 'AcademicCapIcon' },
  { key: 'evaluations', label: 'Évaluations', icon: 'StarIcon' },
  { key: 'training', label: 'Formations obligatoires', icon: 'BookOpenIcon' },
];

const kpis = [
  { label: 'Masse salariale mensuelle', value: '48.2M', unit: 'FCFA', sub: '+2.1% vs mois dernier', icon: 'BanknotesIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Effectif total', value: '187', unit: 'agents', sub: '12 contrats en cours', icon: 'UsersIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Cotisations dues', value: '9.6M', unit: 'FCFA', sub: 'IPRES + CSS + CNSS', icon: 'ShieldCheckIcon', color: 'var(--shifa-purple)', bg: 'rgba(139,92,246,0.08)' },
  { label: 'Formations en retard', value: '14', unit: 'agents', sub: 'Formations obligatoires', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const payslips = [
  { id: 'BS-2026-08-001', employee: 'Dr. Amadou Ba', role: 'Médecin Chef', dept: 'Réanimation', period: 'Août 2026', gross: '1 850 000', deductions: '320 000', net: '1 530 000', status: 'validated' },
  { id: 'BS-2026-08-002', employee: 'Inf. Fatou Sow', role: 'Infirmière D3', dept: 'Réanimation', period: 'Août 2026', gross: '680 000', deductions: '98 000', net: '582 000', status: 'validated' },
  { id: 'BS-2026-08-003', employee: 'Dr. Aminata Faye', role: 'Médecin Spécialiste', dept: 'Cardiologie', period: 'Août 2026', gross: '1 420 000', deductions: '245 000', net: '1 175 000', status: 'pending' },
  { id: 'BS-2026-08-004', employee: 'Inf. Moussa Diop', role: 'Infirmier D2', dept: 'Médecine interne', period: 'Août 2026', gross: '580 000', deductions: '82 000', net: '498 000', status: 'pending' },
  { id: 'BS-2026-08-005', employee: 'Tech. Ibrahima Sow', role: 'Technicien Biomédical', dept: 'Maintenance', period: 'Août 2026', gross: '520 000', deductions: '74 000', net: '446 000', status: 'validated' },
  { id: 'BS-2026-08-006', employee: 'Adm. Mariama Diallo', role: 'Secrétaire Médicale', dept: 'Administration', period: 'Août 2026', gross: '380 000', deductions: '52 000', net: '328 000', status: 'draft' },
];

const contributions = [
  { org: 'IPRES', type: 'Retraite', employeeRate: '5.6%', employerRate: '8.4%', base: '48 200 000', employeeAmt: '2 699 200', employerAmt: '4 048 800', status: 'due', dueDate: '31/08/2026' },
  { org: 'CSS', type: 'Sécurité Sociale', employeeRate: '3.0%', employerRate: '7.0%', base: '48 200 000', employeeAmt: '1 446 000', employerAmt: '3 374 000', status: 'paid', dueDate: '31/07/2026' },
  { org: 'CNSS', type: 'Accidents du travail', employeeRate: '0%', employerRate: '2.0%', base: '48 200 000', employeeAmt: '0', employerAmt: '964 000', status: 'due', dueDate: '31/08/2026' },
  { org: 'FDFP', type: 'Formation professionnelle', employeeRate: '0%', employerRate: '1.5%', base: '48 200 000', employeeAmt: '0', employerAmt: '723 000', status: 'paid', dueDate: '31/07/2026' },
];

const qualifications = [
  { employee: 'Dr. Amadou Ba', role: 'Médecin Chef', diplomas: ['Doctorat en Médecine', 'DES Réanimation'], certifications: ['ACLS', 'ATLS'], habilitations: ['Réanimation adulte', 'Urgences vitales'], validity: '31/12/2027', status: 'valid' },
  { employee: 'Inf. Fatou Sow', role: 'Infirmière D3', diplomas: ['Diplôme d\'État Infirmier'], certifications: ['BLS', 'Soins intensifs'], habilitations: ['Soins infirmiers spécialisés'], validity: '30/06/2026', status: 'expired' },
  { employee: 'Tech. Ibrahima Sow', role: 'Technicien Biomédical', diplomas: ['BTS Génie Biomédical'], certifications: ['Siemens Healthineers', 'Dräger Medical'], habilitations: ['Maintenance IRM', 'Ventilateurs'], validity: '15/03/2027', status: 'valid' },
  { employee: 'Dr. Aminata Faye', role: 'Cardiologue', diplomas: ['Doctorat en Médecine', 'DES Cardiologie'], certifications: ['ACLS', 'Échocardiographie'], habilitations: ['Cardiologie interventionnelle'], validity: '31/12/2026', status: 'expiring' },
];

const evaluations = [
  { employee: 'Dr. Amadou Ba', period: '2025', score: 4.8, criteria: { competence: 5, communication: 4.5, leadership: 5, punctuality: 4.8 }, evaluator: 'Direction Médicale', status: 'completed', recommendation: 'Promotion Chef de Service' },
  { employee: 'Inf. Fatou Sow', period: '2025', score: 4.2, criteria: { competence: 4.5, communication: 4.0, leadership: 3.8, punctuality: 4.5 }, evaluator: 'Dr. Ba', status: 'completed', recommendation: 'Formation complémentaire recommandée' },
  { employee: 'Tech. Ibrahima Sow', period: '2025', score: 4.5, criteria: { competence: 4.8, communication: 4.2, leadership: 4.0, punctuality: 5.0 }, evaluator: 'Responsable Maintenance', status: 'completed', recommendation: 'Augmentation salariale proposée' },
  { employee: 'Inf. Moussa Diop', period: '2025', score: 0, criteria: { competence: 0, communication: 0, leadership: 0, punctuality: 0 }, evaluator: '—', status: 'pending', recommendation: '—' },
];

const trainings = [
  { name: 'Gestes d\'urgence (BLS/ACLS)', mandatory: true, frequency: 'Annuelle', employees: 187, completed: 142, deadline: '31/12/2026', status: 'in_progress' },
  { name: 'Hygiène hospitalière & prévention infections', mandatory: true, frequency: 'Annuelle', employees: 187, completed: 187, deadline: '30/06/2026', status: 'completed' },
  { name: 'Radioprotection', mandatory: true, frequency: 'Triennale', employees: 45, completed: 38, deadline: '31/03/2027', status: 'in_progress' },
  { name: 'Sécurité incendie SSIAP', mandatory: true, frequency: 'Annuelle', employees: 187, completed: 160, deadline: '31/10/2026', status: 'in_progress' },
  { name: 'Gestion des déchets médicaux', mandatory: true, frequency: 'Annuelle', employees: 187, completed: 187, deadline: '30/04/2026', status: 'completed' },
  { name: 'Pharmacovigilance', mandatory: true, frequency: 'Biennale', employees: 80, completed: 52, deadline: '31/12/2026', status: 'in_progress' },
];

const payrollData = [
  { month: 'Mar', amount: 45.8 }, { month: 'Avr', amount: 46.2 }, { month: 'Mai', amount: 46.8 }, { month: 'Jun', amount: 47.1 }, { month: 'Jul', amount: 47.2 }, { month: 'Aoû', amount: 48.2 },
];

export default function OrgHRPayrollContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [expandedEval, setExpandedEval] = useState<string | null>(null);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Paie & Ressources Humaines</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Bulletins de paie, cotisations sociales, habilitations, évaluations et formations obligatoires</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {kpis.map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value} <span style={{ fontSize: '13px', fontWeight: 500 }}>{kpi.unit}</span></p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginTop: '4px' }}>{kpi.label}</p>
              <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
            <Icon name={tab.icon} size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Évolution masse salariale (M FCFA)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 55]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}M FCFA`, 'Masse salariale']} />
                <Line type="monotone" dataKey="amount" stroke="var(--shifa-blue)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Répartition effectif par service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { dept: 'Médecine & Soins', count: 82, pct: 44 },
                { dept: 'Infirmiers & Paramédicaux', count: 65, pct: 35 },
                { dept: 'Administration', count: 24, pct: 13 },
                { dept: 'Technique & Maintenance', count: 16, pct: 8 },
              ].map(d => (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--foreground)' }}>{d.dept}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{d.count} agents</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.pct}%`, background: 'var(--shifa-blue)', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payslips */}
      {activeTab === 'payslips' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Bulletins de paie — Août 2026</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 14px', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Générer tous</button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--shifa-blue)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                <Icon name="ArrowDownTrayIcon" size={14} /> Export PDF
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Agent', 'Poste', 'Service', 'Brut (FCFA)', 'Retenues', 'Net (FCFA)', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payslips.map(bs => (
                  <tr key={bs.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{bs.employee}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{bs.role}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--muted-foreground)' }}>{bs.dept}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>{bs.gross}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: '#dc2626' }}>-{bs.deductions}</td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: 'var(--shifa-green)' }}>{bs.net}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: bs.status === 'validated' ? '#dcfce7' : bs.status === 'pending' ? '#fef9c3' : '#f3f4f6', color: bs.status === 'validated' ? '#16a34a' : bs.status === 'pending' ? '#ca8a04' : '#6b7280' }}>
                        {bs.status === 'validated' ? 'Validé' : bs.status === 'pending' ? 'En attente' : 'Brouillon'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button style={{ padding: '4px 10px', background: 'var(--muted)', color: 'var(--foreground)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contributions */}
      {activeTab === 'contributions' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Cotisations sociales — Août 2026</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contributions.map(c => (
              <div key={c.org} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)' }}>{c.org}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{c.type} · Échéance: {c.dueDate}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: c.status === 'paid' ? '#dcfce7' : '#fef9c3', color: c.status === 'paid' ? '#16a34a' : '#ca8a04' }}>
                    {c.status === 'paid' ? '✓ Payé' : '⏳ À payer'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Base de calcul', value: c.base + ' FCFA' },
                    { label: `Part salariale (${c.employeeRate})`, value: c.employeeAmt + ' FCFA' },
                    { label: `Part patronale (${c.employerRate})`, value: c.employerAmt + ' FCFA' },
                    { label: 'Total à verser', value: (parseInt(c.employeeAmt.replace(/\s/g, '')) + parseInt(c.employerAmt.replace(/\s/g, ''))).toLocaleString() + ' FCFA' },
                  ].map(f => (
                    <div key={f.label} style={{ padding: '10px 12px', background: 'var(--muted)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{f.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)' }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Qualifications */}
      {activeTab === 'qualifications' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Habilitations & Qualifications du personnel</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {qualifications.map(q => (
              <div key={q.employee} style={{ background: 'var(--card)', border: `1px solid ${q.status === 'expired' ? '#fca5a5' : q.status === 'expiring' ? '#fde68a' : 'var(--border)'}`, borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)' }}>{q.employee}</p>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{q.role}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Validité: {q.validity}</p>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: q.status === 'valid' ? '#dcfce7' : q.status === 'expiring' ? '#fef9c3' : '#fee2e2', color: q.status === 'valid' ? '#16a34a' : q.status === 'expiring' ? '#ca8a04' : '#dc2626' }}>
                      {q.status === 'valid' ? 'Valide' : q.status === 'expiring' ? 'Expire bientôt' : 'Expiré'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>DIPLÔMES</p>
                    {q.diplomas.map(d => <p key={d} style={{ fontSize: '12px', color: 'var(--foreground)' }}>• {d}</p>)}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>CERTIFICATIONS</p>
                    {q.certifications.map(c => <p key={c} style={{ fontSize: '12px', color: 'var(--foreground)' }}>• {c}</p>)}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>HABILITATIONS</p>
                    {q.habilitations.map(h => <p key={h} style={{ fontSize: '12px', color: 'var(--foreground)' }}>• {h}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluations */}
      {activeTab === 'evaluations' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Évaluations annuelles — 2025</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {evaluations.map(ev => (
              <div key={ev.employee} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }} onClick={() => setExpandedEval(expandedEval === ev.employee ? null : ev.employee)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{ev.employee.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{ev.employee}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Évaluateur: {ev.evaluator} · {ev.period}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {ev.status === 'completed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: '16px', color: s <= Math.round(ev.score) ? '#f59e0b' : 'var(--border)' }}>★</span>)}
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginLeft: '4px' }}>{ev.score}/5</span>
                      </div>
                    )}
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: ev.status === 'completed' ? '#dcfce7' : '#fef9c3', color: ev.status === 'completed' ? '#16a34a' : '#ca8a04' }}>
                      {ev.status === 'completed' ? 'Terminée' : 'En attente'}
                    </span>
                  </div>
                </div>
                {expandedEval === ev.employee && ev.status === 'completed' && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                      {Object.entries(ev.criteria).map(([key, val]) => (
                        <div key={key} style={{ padding: '10px', background: 'var(--muted)', borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px', textTransform: 'capitalize' }}>{key}</p>
                          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--shifa-blue)' }}>{val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '10px 12px', background: 'rgba(0,102,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,102,255,0.15)' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--shifa-blue)', marginBottom: '2px' }}>Recommandation</p>
                      <p style={{ fontSize: '13px', color: 'var(--foreground)' }}>{ev.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training */}
      {activeTab === 'training' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Formations obligatoires</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trainings.map(tr => {
              const pct = Math.round((tr.completed / tr.employees) * 100);
              return (
                <div key={tr.name} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{tr.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Fréquence: {tr.frequency} · Échéance: {tr.deadline}</p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: tr.status === 'completed' ? '#dcfce7' : '#fef9c3', color: tr.status === 'completed' ? '#16a34a' : '#ca8a04' }}>
                      {tr.status === 'completed' ? '✓ Complété' : 'En cours'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>{tr.completed}/{tr.employees} agents formés</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: pct === 100 ? '#16a34a' : pct > 70 ? '#ca8a04' : '#dc2626' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--muted)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : pct > 70 ? '#ca8a04' : '#dc2626', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
