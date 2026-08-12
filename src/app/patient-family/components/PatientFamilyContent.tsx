'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Dependent {
  id: string;
  name: string;
  relation: string;
  dob: string;
  age: number;
  shifaId: string;
  status: 'active' | 'pending' | 'minor';
  consentLevel: 'full' | 'limited' | 'emergency';
  lastActivity: string;
  avatar: string;
  phone?: string;
  email?: string;
}

interface AccessLog {
  id: string;
  member: string;
  action: string;
  date: string;
  module: string;
  ip: string;
  authorized: boolean;
}

const mockDependents: Dependent[] = [
  { id: 'DEP-001', name: 'Ibrahima Diallo', relation: 'Fils', dob: '15/06/2018', age: 7, shifaId: 'SH-2-SN-FR-2025-3M9X', status: 'minor', consentLevel: 'full', lastActivity: 'Hier — Vaccination', avatar: 'ID', phone: '', email: '' },
  { id: 'DEP-002', name: 'Mariama Diallo', relation: 'Fille', dob: '22/11/2020', age: 4, shifaId: 'SH-2-SN-FR-2025-8P2R', status: 'minor', consentLevel: 'full', lastActivity: 'Il y a 3 jours — Pédiatrie', avatar: 'MD', phone: '', email: '' },
  { id: 'DEP-003', name: 'Ousmane Diallo', relation: 'Père', dob: '08/03/1958', age: 67, shifaId: 'SH-2-SN-FR-2025-1K7T', status: 'active', consentLevel: 'limited', lastActivity: 'Il y a 1 semaine — Cardiologie', avatar: 'OD', phone: '+221 77 987 6543', email: 'ousmane.diallo@example.com' },
  { id: 'DEP-004', name: 'Aminata Diallo', relation: 'Mère', dob: '12/07/1960', age: 65, shifaId: 'SH-2-SN-FR-2025-5R3T', status: 'pending', consentLevel: 'emergency', lastActivity: 'En attente de confirmation', avatar: 'AM', phone: '+221 76 543 2109', email: 'aminata.d@example.com' },
];

const accessLogs: AccessLog[] = [
  { id: 'log-001', member: 'Ibrahima Diallo', action: 'Consultation dossier vaccination', date: '11 août 2026 14:32', module: 'Vaccination', ip: '192.168.1.45', authorized: true },
  { id: 'log-002', member: 'Ousmane Diallo', action: 'Consultation résultats cardiologie', date: '05 août 2026 09:15', module: 'Résultats', ip: '192.168.1.45', authorized: true },
  { id: 'log-003', member: 'Mariama Diallo', action: 'Consultation dossier pédiatrie', date: '09 août 2026 16:48', module: 'Dossier médical', ip: '192.168.1.45', authorized: true },
  { id: 'log-004', member: 'Ousmane Diallo', action: 'Tentative accès prescriptions', date: '03 août 2026 11:22', module: 'Prescriptions', ip: '192.168.1.45', authorized: false },
  { id: 'log-005', member: 'Ibrahima Diallo', action: 'Prise de rendez-vous pédiatrie', date: '01 août 2026 10:05', module: 'Rendez-vous', ip: '192.168.1.45', authorized: true },
];

const familyConsents = [
  { id: 'cons-001', member: 'Ibrahima Diallo', type: 'Accès dossier médical complet', granted: true, date: '15 jan. 2026', grantedBy: 'Kofi Diallo (parent)' },
  { id: 'cons-002', member: 'Ibrahima Diallo', type: 'Partage données avec professionnels', granted: true, date: '15 jan. 2026', grantedBy: 'Kofi Diallo (parent)' },
  { id: 'cons-003', member: 'Ousmane Diallo', type: 'Accès résultats d\'analyses', granted: true, date: '20 mars 2026', grantedBy: 'Ousmane Diallo (lui-même)' },
  { id: 'cons-004', member: 'Ousmane Diallo', type: 'Accès prescriptions médicaments', granted: false, date: '20 mars 2026', grantedBy: 'Ousmane Diallo (refusé)' },
  { id: 'cons-005', member: 'Aminata Diallo', type: 'Accès informations d\'urgence', granted: true, date: '08 août 2026', grantedBy: 'Kofi Diallo (demandeur)' },
];

const relationColors: Record<string, { bg: string; color: string }> = {
  Fils: { bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  Fille: { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
  Père: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
  Mère: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  Conjoint: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
};

const consentConfig = {
  full: { label: 'Accès complet', color: '#16a34a', bg: '#dcfce7' },
  limited: { label: 'Accès limité', color: '#d97706', bg: '#fef3c7' },
  emergency: { label: 'Urgences uniquement', color: '#dc2626', bg: '#fee2e2' },
};

const statusConfig = {
  active: { label: 'Adulte', color: '#16a34a', bg: '#dcfce7' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
  minor: { label: 'Mineur', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
};

type Tab = 'dependents' | 'linked' | 'consents' | 'access_history' | 'add';

export default function PatientFamilyContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dependents');
  const [selectedDependent, setSelectedDependent] = useState<string | null>(null);
  const [consentFilter, setConsentFilter] = useState('Tous');

  const selected = mockDependents.find(d => d.id === selectedDependent);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dependents', label: 'Mes dépendants', icon: 'UsersIcon' },
    { key: 'linked', label: 'Profils liés', icon: 'LinkIcon' },
    { key: 'consents', label: 'Consentements familiaux', icon: 'ShieldCheckIcon' },
    { key: 'access_history', label: 'Historique d\'accès', icon: 'ClockIcon' },
    { key: 'add', label: 'Ajouter', icon: 'UserPlusIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'DM Sans, sans-serif' }}>Famille & Proches</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Accès délégué · Profils liés · Consentements · Historique</p>
        </div>
        <button onClick={() => setActiveTab('add')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--shifa-blue)' }}>
          <Icon name="UserPlusIcon" size={16} />
          Ajouter un proche
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Membres du foyer', value: String(mockDependents.length), icon: 'UsersIcon', color: 'var(--shifa-blue)' },
          { label: 'Mineurs', value: String(mockDependents.filter(d => d.status === 'minor').length), icon: 'StarIcon', color: '#ec4899' },
          { label: 'Accès complet', value: String(mockDependents.filter(d => d.consentLevel === 'full').length), icon: 'ShieldCheckIcon', color: '#16a34a' },
          { label: 'En attente', value: String(mockDependents.filter(d => d.status === 'pending').length), icon: 'ClockIcon', color: '#d97706' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
            style={activeTab === tab.key ? { background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))', color: '#fff' } : { color: 'var(--muted-foreground)', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DEPENDENTS ── */}
      {activeTab === 'dependents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {mockDependents.map(dep => {
              const rel = relationColors[dep.relation] || { bg: 'var(--muted)', color: 'var(--foreground)' };
              const st = statusConfig[dep.status];
              const isSelected = selectedDependent === dep.id;
              return (
                <div key={dep.id} onClick={() => setSelectedDependent(isSelected ? null : dep.id)}
                  className="card-base p-4 flex items-center gap-3 cursor-pointer transition-all"
                  style={{ border: isSelected ? '2px solid var(--shifa-blue)' : '1px solid var(--border)' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {dep.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{dep.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: rel.bg, color: rel.color }}>{dep.relation}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{dep.age} ans · {st.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{dep.lastActivity}</p>
                  </div>
                  <Icon name="ChevronRightIcon" size={16} className="text-muted-foreground shrink-0" />
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card-base p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>{selected.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.relation} · {selected.age} ans · Né(e) le {selected.dob}</p>
                    <p className="text-xs font-mono mt-1" style={{ color: 'var(--muted-foreground)' }}>{selected.shifaId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Niveau de consentement</p>
                    <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: consentConfig[selected.consentLevel].bg, color: consentConfig[selected.consentLevel].color }}>
                      {consentConfig[selected.consentLevel].label}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>Dernière activité</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{selected.lastActivity}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Accès aux données de santé</h4>
                  {[
                    { label: 'Dossier médical complet', access: selected.consentLevel === 'full' },
                    { label: 'Résultats d\'analyses', access: selected.consentLevel === 'full' },
                    { label: 'Prescriptions', access: selected.consentLevel !== 'emergency' },
                    { label: 'Rendez-vous', access: selected.consentLevel !== 'emergency' },
                    { label: 'Vaccination', access: selected.consentLevel !== 'emergency' },
                    { label: 'Informations d\'urgence', access: true },
                    { label: 'Messagerie médicale', access: selected.consentLevel === 'full' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{item.label}</span>
                      <div className="flex items-center gap-2">
                        <Icon name={item.access ? 'CheckCircleIcon' : 'XCircleIcon'} size={18} style={{ color: item.access ? '#16a34a' : '#dc2626' } as any} />
                        <span className="text-xs" style={{ color: item.access ? '#16a34a' : '#dc2626' }}>{item.access ? 'Autorisé' : 'Refusé'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selected.phone && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Téléphone</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selected.phone}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Email</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{selected.email || '—'}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ backgroundColor: 'var(--shifa-blue)', color: 'white' }}>
                    Modifier les accès
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    Historique
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-base p-12 flex flex-col items-center justify-center text-center">
                <Icon name="UsersIcon" size={48} className="text-muted-foreground mb-4" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Sélectionnez un proche</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur un membre pour voir ses détails et gérer ses accès</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LINKED PROFILES ── */}
      {activeTab === 'linked' && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Profils liés à votre compte SHIFA</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Les profils liés vous permettent de gérer les dossiers de santé de vos proches depuis votre espace SHIFA. Chaque profil reste indépendant et sécurisé.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockDependents.map(dep => {
                const rel = relationColors[dep.relation] || { bg: 'var(--muted)', color: 'var(--foreground)' };
                const consent = consentConfig[dep.consentLevel];
                const st = statusConfig[dep.status];
                return (
                  <div key={dep.id} className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                        {dep.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{dep.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: rel.bg, color: rel.color }}>{dep.relation}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>SHIFA ID</span>
                        <span className="font-mono font-bold" style={{ color: 'var(--shifa-blue)' }}>{dep.shifaId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>Niveau d'accès</span>
                        <span className="font-medium" style={{ color: consent.color }}>{consent.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--muted-foreground)' }}>Dernière activité</span>
                        <span style={{ color: 'var(--foreground)' }}>{dep.lastActivity.split('—')[0].trim()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                        Accéder au profil
                      </button>
                      <button className="px-3 py-1.5 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        Gérer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Lier un nouveau profil</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Entrez le SHIFA ID de la personne que vous souhaitez lier à votre compte. Elle recevra une demande de confirmation.</p>
            <div className="flex gap-3">
              <input placeholder="SHIFA ID — ex: SH-2-SN-FR-2025-XXXX" className="flex-1 px-3 py-2 text-sm rounded-xl border outline-none font-mono"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                Rechercher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONSENTS ── */}
      {activeTab === 'consents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Consentements familiaux</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Gestion des autorisations d'accès aux données de santé de vos proches</p>
            </div>
            <div className="flex gap-2">
              {['Tous', 'Accordé', 'Refusé'].map(f => (
                <button key={f} onClick={() => setConsentFilter(f)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors"
                  style={{ backgroundColor: consentFilter === f ? 'var(--shifa-blue)' : 'var(--card)', color: consentFilter === f ? '#fff' : 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {familyConsents
              .filter(c => consentFilter === 'Tous' || (consentFilter === 'Accordé' ? c.granted : !c.granted))
              .map(c => (
                <div key={c.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: c.granted ? '#dcfce7' : '#fee2e2' }}>
                    <Icon name={c.granted ? 'ShieldCheckIcon' : 'ShieldExclamationIcon'} size={18} style={{ color: c.granted ? '#16a34a' : '#dc2626' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{c.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Pour : {c.member} · {c.date} · Par : {c.grantedBy}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.granted ? '#dcfce7' : '#fee2e2', color: c.granted ? '#16a34a' : '#dc2626' }}>
                      {c.granted ? 'Accordé' : 'Refusé'}
                    </span>
                    <button className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      {c.granted ? 'Révoquer' : 'Accorder'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Niveaux d'accès disponibles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(consentConfig).map(([key, val]) => (
                <div key={key} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: val.bg }}>
                  <p className="text-sm font-bold mb-1" style={{ color: val.color }}>{val.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {key === 'full' ? 'Dossier complet, résultats, prescriptions, rendez-vous, messagerie' :
                     key === 'limited'? 'Résultats, rendez-vous uniquement. Pas de prescriptions ni messagerie.' : 'Informations d\'urgence uniquement (groupe sanguin, allergies, contacts).'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACCESS HISTORY ── */}
      {activeTab === 'access_history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Historique des accès familiaux</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Traçabilité complète de tous les accès aux données de vos proches</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={13} /> Exporter
            </button>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Membre', 'Action', 'Module', 'Date', 'IP', 'Résultat'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map(log => (
                    <tr key={log.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{log.member}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{log.action}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>{log.module}</span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{log.date}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{log.ip}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: log.authorized ? '#dcfce7' : '#fee2e2', color: log.authorized ? '#16a34a' : '#dc2626' }}>
                          {log.authorized ? '✓ Autorisé' : '✗ Refusé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
            <div className="flex items-start gap-3">
              <Icon name="InformationCircleIcon" size={18} style={{ color: '#D97706' }} className="shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <strong style={{ color: 'var(--foreground)' }}>Confidentialité :</strong> Cet historique enregistre uniquement les accès aux données de vos proches depuis votre compte. Les accès refusés sont automatiquement signalés. Vous pouvez révoquer tout accès à tout moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD ── */}
      {activeTab === 'add' && (
        <div className="max-w-lg mx-auto card-base p-6">
          <h3 className="text-base font-bold mb-6" style={{ color: 'var(--shifa-dark)' }}>Ajouter un membre de la famille</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Relation</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option>Fils / Fille (mineur)</option>
                <option>Conjoint(e)</option>
                <option>Père / Mère</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>SHIFA ID (si existant)</label>
              <input placeholder="SH-2-SN-FR-2025-XXXX" className="w-full px-3 py-2.5 rounded-xl text-sm border font-mono outline-none" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Prénom</label>
                <input placeholder="Prénom" className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Nom</label>
                <input placeholder="Nom de famille" className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Date de naissance</label>
              <input type="date" className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Niveau d'accès accordé</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option value="full">Accès complet (dossier, résultats, prescriptions)</option>
                <option value="limited">Accès limité (résultats et rendez-vous uniquement)</option>
                <option value="emergency">Urgences uniquement (groupe sanguin, allergies)</option>
              </select>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <strong style={{ color: 'var(--foreground)' }}>Consentement requis :</strong> Pour les adultes, une confirmation sera envoyée à la personne concernée. Pour les mineurs, vous êtes responsable légal et l'accès est accordé directement.
              </p>
            </div>
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              Envoyer la demande de liaison
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
