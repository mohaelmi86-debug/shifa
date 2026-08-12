'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ConsentItem {
  id: string;
  title: string;
  category: 'medical' | 'data' | 'research' | 'communication';
  description: string;
  grantedTo: string;
  grantedDate: string;
  expiryDate?: string;
  status: 'active' | 'revoked' | 'expired' | 'pending';
  required: boolean;
}

const mockConsents: ConsentItem[] = [
  { id: 'CON001', title: 'Partage dossier médical — Dr. Mohamed Sy', category: 'medical', description: 'Accès complet au dossier médical pour le suivi de santé général', grantedTo: 'Dr. Mohamed Sy — Cabinet Médical Plateau', grantedDate: '01/01/2026', status: 'active', required: false },
  { id: 'CON002', title: 'Partage résultats — Dr. Fatou Ndiaye', category: 'medical', description: 'Accès aux résultats de biologie et imagerie pour le suivi cardiologique', grantedTo: 'Dr. Fatou Ndiaye — CHU Saint-Louis', grantedDate: '01/06/2026', expiryDate: '01/06/2027', status: 'active', required: false },
  { id: 'CON003', title: 'Utilisation données anonymisées — Recherche SHIFA', category: 'research', description: 'Participation aux études épidémiologiques anonymisées de la plateforme SHIFA', grantedTo: 'SHIFA Research — Données anonymisées uniquement', grantedDate: '15/01/2026', status: 'active', required: false },
  { id: 'CON004', title: 'Notifications médicales par SMS', category: 'communication', description: 'Réception de rappels de rendez-vous et alertes médicales par SMS', grantedTo: 'SHIFA Platform', grantedDate: '15/01/2026', status: 'active', required: false },
  { id: 'CON005', title: 'Conditions générales SHIFA', category: 'data', description: 'Acceptation des conditions générales d\'utilisation et de la politique de confidentialité SHIFA', grantedTo: 'SHIFA Health OS', grantedDate: '15/01/2026', status: 'active', required: true },
  { id: 'CON006', title: 'Partage données — Assurance Santé Plus', category: 'data', description: 'Transmission des actes médicaux à votre assureur pour remboursement', grantedTo: 'Assurance Santé Plus', grantedDate: '15/01/2026', expiryDate: '15/01/2027', status: 'active', required: false },
  { id: 'CON007', title: 'Partage dossier — Dr. Ibrahima Fall', category: 'medical', description: 'Accès au dossier dermatologique', grantedTo: 'Dr. Ibrahima Fall — Clinique Pasteur', grantedDate: '20/07/2026', status: 'revoked', required: false },
];

const categoryConfig = {
  medical: { label: 'Médical', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)', icon: 'HeartIcon' },
  data: { label: 'Données personnelles', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: 'ShieldCheckIcon' },
  research: { label: 'Recherche', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'BeakerIcon' },
  communication: { label: 'Communication', color: 'var(--shifa-cyan)', bg: 'rgba(0,242,195,0.1)', icon: 'BellIcon' },
};

const statusConfig = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2' },
  expired: { label: 'Expiré', color: '#6b7280', bg: '#f3f4f6' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' },
};

export default function PatientConsentContent() {
  const [activeTab, setActiveTab] = useState<'all' | 'medical' | 'data' | 'research' | 'communication'>('all');
  const [revoking, setRevoking] = useState<string | null>(null);

  const filtered = activeTab === 'all' ? mockConsents : mockConsents.filter(c => c.category === activeTab);

  const handleRevoke = (id: string) => {
    setRevoking(id);
    setTimeout(() => setRevoking(null), 1500);
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Consentements & Confidentialité</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gérez vos autorisations d'accès à vos données de santé</p>
      </div>

      {/* Privacy notice */}
      <div className="card-base p-4 mb-6 flex items-start gap-3" style={{ borderLeft: '4px solid var(--shifa-blue)' }}>
        <Icon name="ShieldCheckIcon" size={20} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Vos données vous appartiennent</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>SHIFA respecte le RGPD et les réglementations locales. Vous pouvez révoquer tout consentement non obligatoire à tout moment. La révocation prend effet immédiatement.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Consentements actifs', value: String(mockConsents.filter(c => c.status === 'active').length), icon: 'CheckCircleIcon', color: '#16a34a' },
          { label: 'Révoqués', value: String(mockConsents.filter(c => c.status === 'revoked').length), icon: 'XCircleIcon', color: '#dc2626' },
          { label: 'Obligatoires', value: String(mockConsents.filter(c => c.required).length), icon: 'LockClosedIcon', color: '#6b7280' },
          { label: 'Avec expiration', value: String(mockConsents.filter(c => c.expiryDate).length), icon: 'CalendarDaysIcon', color: '#d97706' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} className="" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'all', label: 'Tous', icon: 'ClipboardDocumentListIcon' },
          { key: 'medical', label: 'Médical', icon: 'HeartIcon' },
          { key: 'data', label: 'Données', icon: 'ShieldCheckIcon' },
          { key: 'research', label: 'Recherche', icon: 'BeakerIcon' },
          { key: 'communication', label: 'Communication', icon: 'BellIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
            style={{ color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'transparent' }}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(consent => {
          const cc = categoryConfig[consent.category];
          const sc = statusConfig[consent.status];
          return (
            <div key={consent.id} className="card-base p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cc.bg }}>
                  <Icon name={cc.icon as any} size={18} style={{ color: cc.color } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{consent.title}</p>
                        {consent.required && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>Obligatoire</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{consent.description}</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--muted-foreground)' }}>Accordé à : {consent.grantedTo}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis le {consent.grantedDate}</span>
                        {consent.expiryDate && (
                          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· Expire le {consent.expiryDate}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                      {!consent.required && consent.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(consent.id)}
                          disabled={revoking === consent.id}
                          className="text-xs px-3 py-1 rounded-lg border transition-colors hover:bg-red-50"
                          style={{ borderColor: '#dc2626', color: '#dc2626' }}
                        >
                          {revoking === consent.id ? 'Révocation...' : 'Révoquer'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data export */}
      <div className="card-base p-5 mt-6">
        <h3 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Portabilité des données</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Conformément au RGPD, vous pouvez demander une copie de toutes vos données personnelles stockées sur SHIFA.</p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary text-sm py-2 flex items-center gap-2">
            <Icon name="ArrowDownTrayIcon" size={16} /> Exporter mes données
          </button>
          <button className="text-sm px-4 py-2 rounded-xl border transition-colors hover:bg-red-50 flex items-center gap-2" style={{ borderColor: '#dc2626', color: '#dc2626' }}>
            <Icon name="TrashIcon" size={16} /> Demander la suppression
          </button>
        </div>
      </div>
    </div>
  );
}
