'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'employees' | 'recruitment' | 'contracts' | 'planning' | 'habilitations' | 'training' | 'evaluations' | 'payroll' | 'offboarding';

interface Employee {
  id: string;
  name: string;
  profession: string;
  specialty?: string;
  service: string;
  contractType: 'CDI' | 'CDD' | 'Vacation' | 'Stage' | 'Intérim';
  status: 'active' | 'on_leave' | 'suspended' | 'offboarded';
  startDate: string;
  manager: string;
  habilitations: { name: string; expiry: string; status: 'valid' | 'expiring' | 'expired' }[];
  trainings: { name: string; status: 'completed' | 'pending' | 'overdue' }[];
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const employees: Employee[] = [
  {
    id: 'EMP-001', name: 'Dr. Amadou Ba', profession: 'Médecin', specialty: 'Réanimation',
    service: 'Réanimation', contractType: 'CDI', status: 'active', startDate: '2018-03-01', manager: 'Dr. Fatou Traoré',
    habilitations: [
      { name: 'Réanimation adulte', expiry: '2027-12-31', status: 'valid' },
      { name: 'Urgences vitales', expiry: '2027-06-30', status: 'valid' },
    ],
    trainings: [{ name: 'ACLS', status: 'completed' }, { name: 'Radioprotection', status: 'pending' }],
  },
  {
    id: 'EMP-002', name: 'Inf. Fatou Sow', profession: 'Infirmière', specialty: undefined,
    service: 'Chirurgie', contractType: 'CDI', status: 'active', startDate: '2020-09-15', manager: 'Cadre Mariama Diallo',
    habilitations: [
      { name: 'Soins infirmiers spécialisés', expiry: '2026-06-30', status: 'expired' },
    ],
    trainings: [{ name: 'BLS', status: 'completed' }, { name: 'Hygiène hospitalière', status: 'overdue' }],
  },
  {
    id: 'EMP-003', name: 'Tech. Ibrahima Sow', profession: 'Technicien Biomédical', specialty: undefined,
    service: 'Maintenance', contractType: 'CDI', status: 'active', startDate: '2019-01-10', manager: 'Ing. Oumar Diop',
    habilitations: [
      { name: 'Maintenance IRM', expiry: '2027-03-15', status: 'valid' },
      { name: 'Ventilateurs Dräger', expiry: '2026-09-01', status: 'expiring' },
    ],
    trainings: [{ name: 'Radioprotection', status: 'completed' }],
  },
  {
    id: 'EMP-004', name: 'Aminata Bâ', profession: 'Sage-femme', specialty: undefined,
    service: 'Maternité', contractType: 'CDI', status: 'on_leave', startDate: '2021-06-01', manager: 'Dr. Aïssatou Ndiaye',
    habilitations: [{ name: 'Accouchement normal', expiry: '2028-01-01', status: 'valid' }],
    trainings: [{ name: 'Urgences obstétricales', status: 'completed' }],
  },
  {
    id: 'EMP-005', name: 'Oumar Diop', profession: 'Aide-soignant', specialty: undefined,
    service: 'Urgences', contractType: 'CDD', status: 'active', startDate: '2025-01-01', manager: 'Dr. Moussa Diallo',
    habilitations: [],
    trainings: [{ name: 'Gestes d\'urgence', status: 'pending' }],
  },
  {
    id: 'EMP-006', name: 'Dr. Aminata Faye', profession: 'Médecin', specialty: 'Cardiologie',
    service: 'Cardiologie', contractType: 'CDI', status: 'active', startDate: '2017-09-01', manager: 'Dr. Fatou Traoré',
    habilitations: [{ name: 'Cardiologie interventionnelle', expiry: '2026-12-31', status: 'expiring' }],
    trainings: [{ name: 'ACLS', status: 'completed' }, { name: 'Échocardiographie avancée', status: 'pending' }],
  },
];

const recruitmentPipeline = [
  { id: 'REC-001', role: 'Médecin Urgentiste', service: 'Urgences', status: 'interview', candidates: 4, posted: '2026-07-15' },
  { id: 'REC-002', role: 'Infirmier(ère) Réanimation', service: 'Réanimation', status: 'screening', candidates: 12, posted: '2026-07-20' },
  { id: 'REC-003', role: 'Technicien de Laboratoire', service: 'Laboratoire', status: 'offer', candidates: 2, posted: '2026-06-30' },
  { id: 'REC-004', role: 'Secrétaire Médicale', service: 'Administration', status: 'onboarding', candidates: 1, posted: '2026-06-15' },
];

const leaveRequests = [
  { id: 'CONG-001', employee: 'Fatou Sow', type: 'Congé annuel', from: '2026-08-15', to: '2026-08-29', days: 14, status: 'approved' },
  { id: 'CONG-002', employee: 'Ibrahima Sow', type: 'Congé maladie', from: '2026-08-10', to: '2026-08-12', days: 3, status: 'pending' },
  { id: 'CONG-003', employee: 'Oumar Diop', type: 'Congé annuel', from: '2026-09-01', to: '2026-09-15', days: 15, status: 'pending' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
  on_leave: { label: 'En congé', bg: '#fef9c3', color: '#ca8a04' },
  suspended: { label: 'Suspendu', bg: '#fee2e2', color: '#dc2626' },
  offboarded: { label: 'Parti', bg: '#f1f5f9', color: '#64748b' },
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'En attente', bg: '#fef9c3', color: '#ca8a04' },
  rejected: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
  interview: { label: 'Entretien', bg: '#dbeafe', color: '#2563eb' },
  screening: { label: 'Présélection', bg: '#fef3c7', color: '#d97706' },
  offer: { label: 'Offre envoyée', bg: '#ede9fe', color: '#7c3aed' },
  onboarding: { label: 'Onboarding', bg: '#dcfce7', color: '#16a34a' },
  valid: { label: 'Valide', bg: '#dcfce7', color: '#16a34a' },
  expiring: { label: 'Expire bientôt', bg: '#fef3c7', color: '#d97706' },
  expired: { label: 'Expiré', bg: '#fee2e2', color: '#dc2626' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
  overdue: { label: 'En retard', bg: '#fee2e2', color: '#dc2626' },
};

const kpis = [
  { label: 'Effectif total', value: '187', sub: '12 contrats en cours', icon: 'UsersIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'En congé', value: '14', sub: '7.5% de l\'effectif', icon: 'CalendarDaysIcon', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
  { label: 'Habilitations expirées', value: '8', sub: 'Action requise', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Formations en retard', value: '14', sub: 'Formations obligatoires', icon: 'AcademicCapIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Recrutements actifs', value: '4', sub: '19 candidats en cours', icon: 'UserPlusIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { label: 'Masse salariale', value: '48.2M', sub: 'FCFA / mois', icon: 'BanknotesIcon', color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function WorkforceAdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'Squares2X2Icon' },
    { key: 'employees', label: 'Employés', icon: 'UsersIcon' },
    { key: 'recruitment', label: 'Recrutement', icon: 'UserPlusIcon' },
    { key: 'contracts', label: 'Contrats & Postes', icon: 'DocumentTextIcon' },
    { key: 'planning', label: 'Planning & Gardes', icon: 'CalendarDaysIcon' },
    { key: 'habilitations', label: 'Habilitations', icon: 'ShieldCheckIcon' },
    { key: 'training', label: 'Formations', icon: 'AcademicCapIcon' },
    { key: 'evaluations', label: 'Évaluations', icon: 'StarIcon' },
    { key: 'payroll', label: 'Paie & RH', icon: 'BanknotesIcon' },
    { key: 'offboarding', label: 'Offboarding', icon: 'ArrowLeftOnRectangleIcon' },
  ];

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="UsersIcon" size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>SHIFA Workforce — Administration</h1>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>Gestion complète des ressources humaines et du personnel</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/my-workspace" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="UserCircleIcon" size={14} />Mon Espace Employé
            </Link>
            <button style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="UserPlusIcon" size={14} />Nouvel employé
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
            <Icon name={tab.icon} size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {kpis.map(kpi => (
              <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={kpi.icon} size={20} color={kpi.color} />
                </div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: kpi.color, lineHeight: 1, margin: 0 }}>{kpi.value}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginTop: '4px' }}>{kpi.label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>⚠️ Alertes RH</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {employees.flatMap(e => e.habilitations.filter(h => h.status !== 'valid').map(h => ({
                type: h.status === 'expired' ? 'error' : 'warning',
                message: `${e.name} — Habilitation "${h.name}" ${h.status === 'expired' ? 'expirée' : 'expire bientôt'} (${h.expiry})`,
                action: 'Planifier formation',
              }))).concat(
                employees.flatMap(e => e.trainings.filter(t => t.status === 'overdue').map(t => ({
                  type: 'error',
                  message: `${e.name} — Formation "${t.name}" en retard`,
                  action: 'Inscrire',
                })))
              ).map((alert, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: alert.type === 'error' ? '#fee2e2' : '#fef3c7', border: `1px solid ${alert.type === 'error' ? '#fca5a5' : '#fbbf24'}` }}>
                  <Icon name={alert.type === 'error' ? 'XCircleIcon' : 'ExclamationTriangleIcon'} size={14} color={alert.type === 'error' ? '#dc2626' : '#d97706'} />
                  <span style={{ flex: 1, fontSize: '12px', color: alert.type === 'error' ? '#991b1b' : '#92400e' }}>{alert.message}</span>
                  <button style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: alert.type === 'error' ? '#dc2626' : '#d97706', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{alert.action}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Paie & RH', href: '/org-hr-payroll', icon: 'BanknotesIcon', color: '#16a34a' },
              { label: 'Planning & Congés', href: '/org-hr-planning', icon: 'CalendarDaysIcon', color: '#2563eb' },
              { label: 'SHIFA Academy', href: '/shifa-academy', icon: 'AcademicCapIcon', color: '#7c3aed' },
              { label: 'Annuaire Personnel', href: '/org-staff-directory', icon: 'UsersIcon', color: '#0891b2' },
            ].map(link => (
              <Link key={link.label} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', textDecoration: 'none', color: 'var(--foreground)' }}>
                <Icon name={link.icon} size={18} color={link.color} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── EMPLOYEES ── */}
      {activeTab === 'employees' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Rechercher un employé..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }} />
            <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
              <option>Tous les services</option>
              <option>Réanimation</option>
              <option>Chirurgie</option>
              <option>Urgences</option>
              <option>Maternité</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredEmployees.map(emp => {
              const st = statusConfig[emp.status];
              const hasAlerts = emp.habilitations.some(h => h.status !== 'valid') || emp.trainings.some(t => t.status === 'overdue');
              return (
                <div key={emp.id} style={{ background: 'var(--card)', border: `1px solid ${hasAlerts ? '#fbbf24' : 'var(--border)'}`, borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                    {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{emp.name}</p>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      {hasAlerts && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#d97706', fontWeight: 600 }}>⚠️ Alerte</span>}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>{emp.profession}{emp.specialty ? ` — ${emp.specialty}` : ''} · {emp.service} · {emp.contractType}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>Responsable : {emp.manager} · Depuis : {emp.startDate}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setSelectedEmployee(emp)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Dossier</button>
                    <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Modifier</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── RECRUITMENT ── */}
      {activeTab === 'recruitment' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {['Présélection', 'Entretien', 'Offre envoyée', 'Onboarding'].map((stage, i) => {
              const counts = [1, 1, 1, 1];
              return (
                <div key={stage} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--shifa-blue)', margin: 0 }}>{counts[i]}</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '4px' }}>{stage}</p>
                </div>
              );
            })}
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Postes ouverts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recruitmentPipeline.map(rec => {
                const st = statusConfig[rec.status];
                return (
                  <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{rec.role}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{rec.service} · Publié le {rec.posted}</p>
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{rec.candidates} candidat(s)</span>
                    <button style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Gérer</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PLANNING ── */}
      {activeTab === 'planning' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Demandes de congés</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaveRequests.map(req => {
                  const st = statusConfig[req.status];
                  return (
                    <div key={req.id} style={{ padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{req.employee}</p>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{req.type} · {req.from} → {req.to} ({req.days} jours)</p>
                      {req.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                          <button style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#dcfce7', color: '#16a34a', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Approuver</button>
                          <button style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Refuser</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Liens rapides Planning</h3>
              {[
                { label: 'Planification RH & Congés', href: '/org-hr-planning', icon: 'CalendarDaysIcon' },
                { label: 'Annuaire du personnel', href: '/org-staff-directory', icon: 'UsersIcon' },
                { label: 'Gestion soins infirmiers', href: '/org-nursing-management', icon: 'HeartIcon' },
              ].map(link => (
                <Link key={link.label} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--muted)', textDecoration: 'none', color: 'var(--foreground)', marginBottom: '8px' }}>
                  <Icon name={link.icon} size={16} color="var(--shifa-blue)" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{link.label}</span>
                  <Icon name="ChevronRightIcon" size={14} color="var(--muted-foreground)" style={{ marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HABILITATIONS ── */}
      {activeTab === 'habilitations' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Habilitations & Certifications</h3>
          <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="ExclamationTriangleIcon" size={14} color="#d97706" />
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>Une habilitation expirée peut entraîner la suspension de l'accès au module concerné. Planifiez les formations de renouvellement.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {employees.filter(e => e.habilitations.length > 0).map(emp => (
              <div key={emp.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>{emp.name} — {emp.profession}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {emp.habilitations.map(hab => {
                    const st = statusConfig[hab.status];
                    return (
                      <div key={hab.name} style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${st.color}30`, background: st.bg, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon name={hab.status === 'valid' ? 'CheckCircleIcon' : 'ExclamationTriangleIcon'} size={12} color={st.color} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: st.color }}>{hab.name}</span>
                        <span style={{ fontSize: '10px', color: st.color }}>({hab.expiry})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRAINING ── */}
      {activeTab === 'training' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Formations & SHIFA Academy</h3>
            <Link href="/shifa-academy" style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="AcademicCapIcon" size={13} />SHIFA Academy
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Gestes d\'urgence (BLS/ACLS)', mandatory: true, frequency: 'Annuelle', total: 187, done: 142, deadline: '31/12/2026' },
              { name: 'Hygiène hospitalière', mandatory: true, frequency: 'Annuelle', total: 187, done: 187, deadline: '30/06/2026' },
              { name: 'Radioprotection', mandatory: true, frequency: 'Triennale', total: 45, done: 38, deadline: '31/03/2027' },
              { name: 'Sécurité incendie SSIAP', mandatory: true, frequency: 'Annuelle', total: 187, done: 160, deadline: '31/10/2026' },
              { name: 'Pharmacovigilance', mandatory: true, frequency: 'Biennale', total: 80, done: 52, deadline: '31/12/2026' },
            ].map(training => {
              const pct = Math.round((training.done / training.total) * 100);
              return (
                <div key={training.name} style={{ padding: '14px', background: 'var(--muted)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{training.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{training.frequency} · Échéance : {training.deadline}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: pct === 100 ? '#16a34a' : pct > 70 ? '#d97706' : '#dc2626' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : pct > 70 ? '#d97706' : '#dc2626', borderRadius: '3px', transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>{training.done}/{training.total} agents formés</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── EVALUATIONS ── */}
      {activeTab === 'evaluations' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Évaluations annuelles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Dr. Amadou Ba', score: 4.8, period: '2025', status: 'completed', recommendation: 'Promotion Chef de Service' },
              { name: 'Inf. Fatou Sow', score: 4.2, period: '2025', status: 'completed', recommendation: 'Formation complémentaire' },
              { name: 'Tech. Ibrahima Sow', score: 4.5, period: '2025', status: 'completed', recommendation: 'Augmentation proposée' },
              { name: 'Inf. Moussa Diop', score: 0, period: '2025', status: 'pending', recommendation: '—' },
            ].map(eval_ => (
              <div key={eval_.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{eval_.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{eval_.recommendation}</p>
                </div>
                {eval_.status === 'completed' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Icon key={s} name="StarIcon" size={14} color={s <= Math.round(eval_.score) ? '#f59e0b' : 'var(--border)'} />
                    ))}
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', marginLeft: '4px' }}>{eval_.score}</span>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#fef3c7', color: '#d97706', fontWeight: 600 }}>En attente</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PAYROLL ── */}
      {activeTab === 'payroll' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Paie & Rémunération</h3>
            <Link href="/org-hr-payroll" style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              Module Paie complet
            </Link>
          </div>
          <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="InformationCircleIcon" size={16} color="#2563eb" />
            <p style={{ fontSize: '12px', color: '#1e40af', margin: 0 }}>Le module Paie complet est disponible dans <strong>Paie & RH</strong>. Il inclut les bulletins de paie, cotisations sociales, et exports comptables.</p>
          </div>
        </div>
      )}

      {/* ── OFFBOARDING ── */}
      {activeTab === 'offboarding' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Offboarding</h3>
          <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="ShieldCheckIcon" size={16} color="#d97706" />
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
              <strong>Règle SHIFA :</strong> Lors du départ d'un employé, ses accès à l'organisation sont révoqués. Son compte SHIFA personnel est conservé. L'historique est archivé conformément aux règles applicables.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { step: '1', label: 'Désactivation accès organisation', icon: 'LockClosedIcon', color: '#dc2626' },
              { step: '2', label: 'Conservation compte SHIFA', icon: 'UserCircleIcon', color: '#16a34a' },
              { step: '3', label: 'Révocation permissions modules', icon: 'ShieldExclamationIcon', color: '#d97706' },
              { step: '4', label: 'Archivage historique', icon: 'ArchiveBoxIcon', color: '#2563eb' },
              { step: '5', label: 'Notification responsable', icon: 'BellIcon', color: '#7c3aed' },
              { step: '6', label: 'Audit trail complet', icon: 'ClipboardDocumentCheckIcon', color: '#0891b2' },
            ].map(step => (
              <div key={step.step} style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${step.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={step.icon} size={16} color={step.color} />
                </div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTRACTS ── */}
      {activeTab === 'contracts' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Contrats & Postes</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Employé', 'Poste', 'Service', 'Type contrat', 'Depuis', 'Responsable', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const st = statusConfig[emp.status];
                  return (
                    <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--foreground)' }}>{emp.name}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{emp.profession}{emp.specialty ? ` — ${emp.specialty}` : ''}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{emp.service}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: emp.contractType === 'CDI' ? '#dcfce7' : '#fef3c7', color: emp.contractType === 'CDI' ? '#16a34a' : '#d97706', fontWeight: 600 }}>{emp.contractType}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{emp.startDate}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{emp.manager}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee detail modal */}
      {selectedEmployee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedEmployee(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '24px', maxWidth: '520px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Dossier employé</h3>
              <button onClick={() => setSelectedEmployee(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="XMarkIcon" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{selectedEmployee.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>{selectedEmployee.profession}{selectedEmployee.specialty ? ` — ${selectedEmployee.specialty}` : ''} · {selectedEmployee.service}</p>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>Habilitations</p>
              {selectedEmployee.habilitations.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Aucune habilitation enregistrée</p>
              ) : selectedEmployee.habilitations.map(hab => {
                const st = statusConfig[hab.status];
                return (
                  <div key={hab.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--foreground)' }}>{hab.name}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label} ({hab.expiry})</span>
                  </div>
                );
              })}
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '8px' }}>Formations</p>
              {selectedEmployee.trainings.map(t => {
                const st = statusConfig[t.status];
                return (
                  <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--foreground)' }}>{t.name}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
