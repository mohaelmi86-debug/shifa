'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'overview' | 'orgs' | 'professionals' | 'history' | 'sharing' | 'sensitive';

interface ConnectedOrg {
  id: string;
  name: string;
  type: string;
  accessLevel: 'full' | 'limited' | 'emergency_only';
  connectedSince: string;
  lastAccess: string;
  status: 'active' | 'suspended' | 'revoked';
}

interface ConnectedPro {
  id: string;
  name: string;
  specialty: string;
  org: string;
  accessLevel: 'full' | 'limited' | 'results_only';
  connectedSince: string;
  lastAccess: string;
  status: 'active' | 'revoked';
}

interface AccessEvent {
  id: string;
  actor: string;
  actorType: 'professional' | 'organization' | 'system';
  action: string;
  resource: string;
  date: string;
  context: string;
  authorized: boolean;
}

const connectedOrgs: ConnectedOrg[] = [
  { id: 'o1', name: 'CHU Saint-Louis', type: 'Hôpital', accessLevel: 'limited', connectedSince: '01 jan. 2026', lastAccess: '10 août 2026', status: 'active' },
  { id: 'o2', name: 'Pharmacie Centrale Dakar', type: 'Pharmacie', accessLevel: 'limited', connectedSince: '15 fév. 2026', lastAccess: '09 août 2026', status: 'active' },
  { id: 'o3', name: 'Assurance Santé Plus', type: 'Assurance', accessLevel: 'limited', connectedSince: '01 jan. 2026', lastAccess: '05 août 2026', status: 'active' },
  { id: 'o4', name: 'Labo BioAnalyse', type: 'Laboratoire', accessLevel: 'results_only' as any, connectedSince: '10 mars 2026', lastAccess: '08 août 2026', status: 'active' },
  { id: 'o5', name: 'Clinique Pasteur', type: 'Clinique', accessLevel: 'full', connectedSince: '01 jan. 2025', lastAccess: '01 juil. 2026', status: 'suspended' },
];

const connectedPros: ConnectedPro[] = [
  { id: 'p1', name: 'Dr. Mohamed Sy', specialty: 'Médecine générale', org: 'Cabinet Médical Plateau', accessLevel: 'full', connectedSince: '01 jan. 2026', lastAccess: '10 août 2026', status: 'active' },
  { id: 'p2', name: 'Dr. Fatou Ndiaye', specialty: 'Cardiologie', org: 'CHU Saint-Louis', accessLevel: 'limited', connectedSince: '01 juin 2026', lastAccess: '08 août 2026', status: 'active' },
  { id: 'p3', name: 'Dr. Ibrahima Fall', specialty: 'Dermatologie', org: 'Clinique Pasteur', accessLevel: 'limited', connectedSince: '20 juil. 2026', lastAccess: '20 juil. 2026', status: 'revoked' },
  { id: 'p4', name: 'Dr. Aissatou Balde', specialty: 'Gynécologie', org: 'CHU Saint-Louis', accessLevel: 'limited', connectedSince: '05 août 2026', lastAccess: '05 août 2026', status: 'active' },
];

const accessHistory: AccessEvent[] = [
  { id: 'h1', actor: 'Dr. Mohamed Sy', actorType: 'professional', action: 'Consultation dossier', resource: 'Dossier médical complet', date: '10 août 2026 — 14h30', context: 'Consultation programmée', authorized: true },
  { id: 'h2', actor: 'Pharmacie Centrale Dakar', actorType: 'organization', action: 'Vérification ordonnance', resource: 'Ordonnance #ORD-2026-0041', date: '10 août 2026 — 16h42', context: 'Dispensation médicament', authorized: true },
  { id: 'h3', actor: 'Dr. Fatou Ndiaye', actorType: 'professional', action: 'Consultation résultats', resource: 'ECG + Bilan lipidique', date: '08 août 2026 — 11h00', context: 'Suivi cardiologique', authorized: true },
  { id: 'h4', actor: 'Assurance Santé Plus', actorType: 'organization', action: 'Consultation actes', resource: 'Actes médicaux — juil. 2026', date: '05 août 2026 — 09h15', context: 'Remboursement', authorized: true },
  { id: 'h5', actor: 'Système SHIFA', actorType: 'system', action: 'Sauvegarde automatique', resource: 'Données de santé chiffrées', date: '01 août 2026 — 02h00', context: 'Backup planifié', authorized: true },
];

const sensitiveCategories = [
  { id: 's1', label: 'Psychiatrie & Santé mentale', description: 'Consultations, diagnostics et traitements psychiatriques', restricted: true },
  { id: 's2', label: 'VIH / SIDA', description: 'Statut sérologique et traitement antirétroviral', restricted: true },
  { id: 's3', label: 'Addictologie', description: 'Traitements de substitution et suivi addictions', restricted: false },
  { id: 's4', label: 'Interruption de grossesse', description: 'IVG et suivi associé', restricted: true },
  { id: 's5', label: 'Génétique', description: 'Tests génétiques et résultats', restricted: false },
  { id: 's6', label: 'Violence et maltraitance', description: 'Signalements et consultations liées', restricted: true },
];

const accessLevelConfig = {
  full: { label: 'Accès complet', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  limited: { label: 'Accès limité', color: '#d97706', bg: '#fef3c7' },
  emergency_only: { label: 'Urgences uniquement', color: '#dc2626', bg: '#fee2e2' },
  results_only: { label: 'Résultats uniquement', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
};

const statusConfig = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7' },
  suspended: { label: 'Suspendu', color: '#d97706', bg: '#fef3c7' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2' },
};

export default function PatientPrivacyContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sensitiveState, setSensitiveState] = useState<Record<string, boolean>>(
    Object.fromEntries(sensitiveCategories.map(s => [s.id, s.restricted]))
  );

  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'ShieldCheckIcon' },
    { key: 'orgs', label: 'Organisations', icon: 'BuildingOffice2Icon' },
    { key: 'professionals', label: 'Professionnels', icon: 'UserGroupIcon' },
    { key: 'history', label: 'Historique d\'accès', icon: 'ClockIcon' },
    { key: 'sharing', label: 'Partage de données', icon: 'ShareIcon' },
    { key: 'sensitive', label: 'Données sensibles', icon: 'LockClosedIcon' },
  ];

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Confidentialité & Consentements</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Contrôlez qui accède à vos données de santé et gérez vos autorisations</p>
      </div>

      {/* Privacy notice */}
      <div className="card-base p-4 mb-6 flex items-start gap-3" style={{ borderLeft: '4px solid var(--shifa-blue)' }}>
        <Icon name="ShieldCheckIcon" className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--shifa-dark)' }}>Vous êtes propriétaire de vos données de santé</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>SHIFA applique le principe de moindre privilège. Aucun professionnel ou organisation n'accède à vos données sans votre autorisation explicite ou un contexte légal justifié.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as Tab)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all" style={{ background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === t.key ? '#fff' : 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Organisations connectées', value: connectedOrgs.filter(o => o.status === 'active').length, icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)' },
              { label: 'Professionnels autorisés', value: connectedPros.filter(p => p.status === 'active').length, icon: 'UserGroupIcon', color: '#8b5cf6' },
              { label: 'Accès ce mois', value: accessHistory.length, icon: 'ClockIcon', color: '#d97706' },
              { label: 'Données sensibles restreintes', value: sensitiveCategories.filter(s => s.restricted).length, icon: 'LockClosedIcon', color: '#dc2626' },
            ].map(kpi => (
              <div key={kpi.label} className="card-base p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
                  <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-base p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Derniers accès</h3>
              <div className="space-y-2">
                {accessHistory.slice(0, 3).map(h => (
                  <div key={h.id} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: h.authorized ? '#16a34a' : '#dc2626' }} />
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--shifa-dark)' }}>{h.actor} — {h.action}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('history')} className="mt-3 text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>Voir tout l'historique →</button>
            </div>
            <div className="card-base p-4">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Actions rapides</h3>
              <div className="space-y-2">
                {[
                  { label: 'Révoquer un accès', icon: 'XCircleIcon', tab: 'professionals' as Tab },
                  { label: 'Restreindre données sensibles', icon: 'LockClosedIcon', tab: 'sensitive' as Tab },
                  { label: 'Voir historique complet', icon: 'ClockIcon', tab: 'history' as Tab },
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
                    <Icon name={a.icon} className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Orgs */}
      {activeTab === 'orgs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Organisations connectées</h2>
          </div>
          {connectedOrgs.map(org => {
            const al = accessLevelConfig[org.accessLevel as keyof typeof accessLevelConfig] ?? accessLevelConfig.limited;
            const st = statusConfig[org.status];
            return (
              <div key={org.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="BuildingOffice2Icon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{org.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{org.type} — Connecté depuis {org.connectedSince} — Dernier accès : {org.lastAccess}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: al.bg, color: al.color }}>{al.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  {org.status === 'active' && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>Révoquer</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connected Professionals */}
      {activeTab === 'professionals' && (
        <div className="space-y-3">
          <h2 className="font-semibold mb-2" style={{ color: 'var(--shifa-dark)' }}>Professionnels autorisés</h2>
          {connectedPros.map(pro => {
            const al = accessLevelConfig[pro.accessLevel];
            const st = statusConfig[pro.status];
            return (
              <div key={pro.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: pro.status === 'revoked' ? '#6b7280' : 'var(--shifa-blue)' }}>
                  {pro.name.charAt(3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{pro.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{pro.specialty} — {pro.org} — Dernier accès : {pro.lastAccess}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: al.bg, color: al.color }}>{al.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  {pro.status === 'active' && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>Révoquer</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Access History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Historique d'accès à vos données</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
              <Icon name="ArrowDownTrayIcon" className="w-4 h-4" />
              Exporter
            </button>
          </div>
          {accessHistory.map(h => (
            <div key={h.id} className="card-base p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: h.authorized ? '#dcfce7' : '#fee2e2' }}>
                <Icon name={h.authorized ? 'CheckCircleIcon' : 'XCircleIcon'} className="w-4 h-4" style={{ color: h.authorized ? '#16a34a' : '#dc2626' }} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{h.actor} — <span className="font-normal">{h.action}</span></div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Ressource : {h.resource}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Contexte : {h.context} — {h.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Sharing */}
      {activeTab === 'sharing' && (
        <div className="space-y-4">
          <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Paramètres de partage de données</h2>
          {[
            { label: 'Partage avec mon médecin traitant', description: 'Dossier médical complet accessible à votre médecin référent', enabled: true },
            { label: 'Partage pour remboursements assurance', description: 'Transmission des actes médicaux à votre assureur', enabled: true },
            { label: 'Participation à la recherche anonymisée', description: 'Vos données anonymisées contribuent aux études épidémiologiques SHIFA', enabled: true },
            { label: 'Partage en cas d\'urgence', description: 'Accès d\'urgence aux informations vitales pour les équipes de secours', enabled: true },
            { label: 'Notifications médicales par SMS', description: 'Rappels de rendez-vous et alertes médicales par SMS', enabled: false },
            { label: 'Amélioration des services SHIFA', description: 'Utilisation de données anonymisées pour améliorer la plateforme', enabled: false },
          ].map((item, i) => (
            <div key={i} className="card-base p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{item.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.description}</div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-11 h-6 rounded-full relative cursor-pointer transition-all" style={{ background: item.enabled ? 'var(--shifa-blue)' : 'var(--border)' }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all" style={{ left: item.enabled ? '24px' : '4px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sensitive Data */}
      {activeTab === 'sensitive' && (
        <div className="space-y-4">
          <div className="card-base p-4 flex items-start gap-3 mb-2" style={{ borderLeft: '4px solid #dc2626' }}>
            <Icon name="LockClosedIcon" className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
            <p className="text-sm" style={{ color: 'var(--shifa-dark)' }}>Les données de santé sensibles bénéficient d'une protection renforcée. Vous pouvez restreindre leur accès même aux professionnels autorisés.</p>
          </div>
          {sensitiveCategories.map(cat => (
            <div key={cat.id} className="card-base p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                  <Icon name="LockClosedIcon" className="w-4 h-4" style={{ color: sensitiveState[cat.id] ? '#dc2626' : 'var(--muted-foreground)' }} />
                  {cat.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{cat.description}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: sensitiveState[cat.id] ? '#dc2626' : '#16a34a' }}>
                  {sensitiveState[cat.id] ? 'Restreint' : 'Accessible'}
                </span>
                <div
                  onClick={() => setSensitiveState(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                  className="w-11 h-6 rounded-full relative cursor-pointer transition-all"
                  style={{ background: sensitiveState[cat.id] ? '#dc2626' : 'var(--shifa-blue)' }}
                >
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all" style={{ left: sensitiveState[cat.id] ? '24px' : '4px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
