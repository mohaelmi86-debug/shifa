'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = 'home' | 'planning' | 'leave' | 'documents' | 'training' | 'habilitations' | 'requests' | 'messages';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const employee = {
  name: 'Dr. Amadou Ba',
  profession: 'Médecin — Réanimation',
  id: 'EMP-001',
  organization: 'CHU Saint-Louis',
  manager: 'Dr. Fatou Traoré',
  contractType: 'CDI',
  startDate: '2018-03-01',
  avatar: 'AB',
};

const upcomingShifts = [
  { date: 'Lun 12/08', time: '08:00 – 20:00', service: 'Réanimation', type: 'Jour' },
  { date: 'Mar 13/08', time: '08:00 – 20:00', service: 'Réanimation', type: 'Jour' },
  { date: 'Mer 14/08', time: 'Repos', service: '—', type: 'Repos' },
  { date: 'Jeu 15/08', time: '20:00 – 08:00', service: 'Réanimation', type: 'Nuit' },
  { date: 'Ven 16/08', time: 'Repos', service: '—', type: 'Repos' },
  { date: 'Sam 17/08', time: '08:00 – 20:00', service: 'Réanimation', type: 'Garde' },
  { date: 'Dim 18/08', time: 'Repos', service: '—', type: 'Repos' },
];

const myDocuments = [
  { name: 'Contrat CDI — Mars 2018', type: 'Contrat', date: '01/03/2018', icon: 'DocumentTextIcon' },
  { name: 'Bulletin de paie — Juillet 2026', type: 'Paie', date: '31/07/2026', icon: 'BanknotesIcon' },
  { name: 'Attestation de travail', type: 'Attestation', date: '10/08/2026', icon: 'DocumentCheckIcon' },
  { name: 'Diplôme — Doctorat en Médecine', type: 'Diplôme', date: '15/06/2010', icon: 'AcademicCapIcon' },
  { name: 'DES Réanimation', type: 'Diplôme', date: '20/09/2015', icon: 'AcademicCapIcon' },
];

const myTrainings = [
  { name: 'ACLS — Advanced Cardiac Life Support', status: 'completed', date: '15/03/2026', cert: true },
  { name: 'ATLS — Advanced Trauma Life Support', status: 'completed', date: '10/01/2026', cert: true },
  { name: 'Radioprotection', status: 'pending', date: 'Avant 31/12/2026', cert: false },
  { name: 'Gestion des risques hospitaliers', status: 'pending', date: 'Avant 31/10/2026', cert: false },
];

const myHabilitations = [
  { name: 'Réanimation adulte', expiry: '2027-12-31', status: 'valid', module: 'Réanimation' },
  { name: 'Urgences vitales', expiry: '2027-06-30', status: 'valid', module: 'Urgences' },
  { name: 'Prescription stupéfiants', expiry: '2028-01-01', status: 'valid', module: 'Pharmacie' },
];

const myRequests = [
  { id: 'REQ-001', type: 'Congé annuel', status: 'approved', date: '2026-08-01', details: '15/08 → 29/08 (14 jours)' },
  { id: 'REQ-002', type: 'Attestation de travail', status: 'completed', date: '2026-08-10', details: 'Générée le 10/08/2026' },
  { id: 'REQ-003', type: 'Formation ACLS', status: 'approved', date: '2026-03-01', details: 'Inscrit — 15/03/2026' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  valid: { label: 'Valide', bg: '#dcfce7', color: '#16a34a' },
  expiring: { label: 'Expire bientôt', bg: '#fef3c7', color: '#d97706' },
  expired: { label: 'Expiré', bg: '#fee2e2', color: '#dc2626' },
  completed: { label: 'Terminé', bg: '#dcfce7', color: '#16a34a' },
  pending: { label: 'À faire', bg: '#fef3c7', color: '#d97706' },
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  rejected: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
  Jour: { label: 'Jour', bg: '#dbeafe', color: '#2563eb' },
  Nuit: { label: 'Nuit', bg: '#ede9fe', color: '#7c3aed' },
  Garde: { label: 'Garde', bg: '#fef3c7', color: '#d97706' },
  Repos: { label: 'Repos', bg: '#f1f5f9', color: '#64748b' },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MyWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'home', label: 'Accueil', icon: 'HomeIcon' },
    { key: 'planning', label: 'Mon Planning', icon: 'CalendarDaysIcon' },
    { key: 'leave', label: 'Congés & Absences', icon: 'ClockIcon' },
    { key: 'documents', label: 'Mes Documents', icon: 'FolderOpenIcon' },
    { key: 'training', label: 'Formations', icon: 'AcademicCapIcon' },
    { key: 'habilitations', label: 'Habilitations', icon: 'ShieldCheckIcon' },
    { key: 'requests', label: 'Mes Demandes', icon: 'ClipboardDocumentListIcon' },
    { key: 'messages', label: 'Communications', icon: 'ChatBubbleLeftRightIcon' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '24px', marginBottom: '24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700 }}>
            {employee.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Bonjour, {employee.name}</h1>
            <p style={{ fontSize: '13px', opacity: 0.85, margin: '2px 0' }}>{employee.profession} · {employee.organization}</p>
            <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>ID : {employee.id} · Responsable : {employee.manager}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/workforce-admin" style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="UsersIcon" size={13} />Admin RH
            </Link>
            <Link href="/shifa-academy" style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="AcademicCapIcon" size={13} />SHIFA Academy
            </Link>
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

      {/* ── HOME ── */}
      {activeTab === 'home' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Prochaine garde', value: 'Sam 17/08', icon: 'CalendarDaysIcon', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
              { label: 'Congés restants', value: '18 jours', icon: 'ClockIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
              { label: 'Formations à faire', value: '2', icon: 'AcademicCapIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
              { label: 'Habilitations valides', value: '3/3', icon: 'ShieldCheckIcon', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={kpi.icon} size={18} color={kpi.color} />
                </div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: kpi.color, lineHeight: 1, margin: 0 }}>{kpi.value}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Today's schedule */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '12px' }}>Planning de la semaine</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {upcomingShifts.map(shift => {
                const st = statusConfig[shift.type] || { label: shift.type, bg: '#f1f5f9', color: '#64748b' };
                return (
                  <div key={shift.date} style={{ padding: '10px', borderRadius: '8px', background: st.bg, border: `1px solid ${st.color}30`, textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: st.color, margin: 0 }}>{shift.date}</p>
                    <p style={{ fontSize: '10px', color: st.color, margin: '4px 0 0' }}>{shift.time}</p>
                    <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: `${st.color}20`, color: st.color, fontWeight: 600 }}>{shift.type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { label: 'Demander un congé', icon: 'ClockIcon', action: () => setActiveTab('leave') },
              { label: 'Mes formations', icon: 'AcademicCapIcon', action: () => setActiveTab('training') },
              { label: 'Mes documents', icon: 'FolderOpenIcon', action: () => setActiveTab('documents') },
              { label: 'Nouvelle demande', icon: 'PlusCircleIcon', action: () => setActiveTab('requests') },
            ].map(action => (
              <button key={action.label} onClick={action.action} style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Icon name={action.icon} size={20} color="var(--shifa-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PLANNING ── */}
      {activeTab === 'planning' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Mon Planning — Août 2026</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcomingShifts.map(shift => {
              const st = statusConfig[shift.type] || { label: shift.type, bg: '#f1f5f9', color: '#64748b' };
              return (
                <div key={shift.date} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: st.bg, border: `1px solid ${st.color}30` }}>
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: st.color, margin: 0 }}>{shift.date}</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{shift.time}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{shift.service}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${st.color}20`, color: st.color, fontWeight: 600 }}>{shift.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEAVE ── */}
      {activeTab === 'leave' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Demander un congé</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '4px' }}>Type de congé</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
                  <option>Congé annuel</option>
                  <option>Congé maladie</option>
                  <option>Congé formation</option>
                  <option>Congé exceptionnel</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '4px' }}>Du</label>
                  <input type="date" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '4px' }}>Au</label>
                  <input type="date" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '4px' }}>Motif (optionnel)</label>
                <textarea rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <button style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                Soumettre la demande
              </button>
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Solde de congés</h3>
            {[
              { type: 'Congés annuels', total: 30, used: 12, remaining: 18 },
              { type: 'RTT', total: 10, used: 4, remaining: 6 },
              { type: 'Congés formation', total: 5, used: 0, remaining: 5 },
            ].map(bal => (
              <div key={bal.type} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{bal.type}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{bal.remaining}/{bal.total} jours</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(bal.remaining / bal.total) * 100}%`, background: 'var(--shifa-blue)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {activeTab === 'documents' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Mes Documents RH</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myDocuments.map(doc => (
              <div key={doc.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--muted)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={doc.icon} size={16} color="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{doc.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{doc.type} · {doc.date}</p>
                </div>
                <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="ArrowDownTrayIcon" size={12} />Télécharger
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TRAINING ── */}
      {activeTab === 'training' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Mes Formations</h3>
            <Link href="/shifa-academy" style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="AcademicCapIcon" size={13} />SHIFA Academy
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myTrainings.map(training => {
              const st = statusConfig[training.status];
              return (
                <div key={training.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--card)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: training.status === 'completed' ? '#dcfce7' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={training.status === 'completed' ? 'CheckCircleIcon' : 'ClockIcon'} size={18} color={training.status === 'completed' ? '#16a34a' : '#d97706'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{training.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{training.date}</p>
                  </div>
                  {training.cert && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>🏆 Certifié</span>}
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HABILITATIONS ── */}
      {activeTab === 'habilitations' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Mes Habilitations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myHabilitations.map(hab => {
              const st = statusConfig[hab.status];
              return (
                <div key={hab.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: `1px solid ${st.color}30`, background: st.bg }}>
                  <Icon name="ShieldCheckIcon" size={20} color={st.color} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{hab.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>Module : {hab.module} · Expire : {hab.expiry}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${st.color}20`, color: st.color, fontWeight: 600 }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REQUESTS ── */}
      {activeTab === 'requests' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Mes Demandes RH</h3>
            <button style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PlusIcon" size={13} />Nouvelle demande
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myRequests.map(req => {
              const st = statusConfig[req.status];
              return (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--muted)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{req.type}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{req.details} · {req.date}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {activeTab === 'messages' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Communications RH</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { from: 'Direction RH', subject: 'Rappel : Formations obligatoires avant le 31/12/2026', date: '10/08/2026', read: false },
              { from: 'Cadre Mariama Diallo', subject: 'Planning de garde — Septembre 2026', date: '08/08/2026', read: true },
              { from: 'SHIFA Academy', subject: 'Nouveau cours disponible : Gestion des risques', date: '05/08/2026', read: true },
            ].map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: msg.read ? 'var(--muted)' : '#dbeafe' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.read ? 'var(--border)' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="EnvelopeIcon" size={16} color={msg.read ? 'var(--muted-foreground)' : '#fff'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: msg.read ? 500 : 700, color: 'var(--foreground)', margin: 0 }}>{msg.subject}</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>De : {msg.from} · {msg.date}</p>
                </div>
                {!msg.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
