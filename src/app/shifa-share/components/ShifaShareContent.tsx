'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { ShareRequest, ShareContext, ShareResourceType, SharePermission, SOCIAL_SHARE_FORBIDDEN_TYPES,  } from '@/lib/moduleInterconnect';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'new-share' | 'active' | 'history' | 'public-pages' | 'social';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const mockShares: ShareRequest[] = [
  {
    id: 'SHR-001', createdBy: 'Aïcha Diallo', resourceType: 'consultation',
    resourceId: 'CONS-2026-0812', resourceLabel: 'Consultation du 12/08/2026 — Dr. Sy',
    context: 'professional', recipientId: 'PRO-002', recipientLabel: 'Dr. Aminata Faye — Cardiologue',
    permissions: ['view'], expiresAt: '2026-08-19T23:59:00Z',
    consentGiven: true, status: 'active', isMedical: true,
    auditLog: [
      { timestamp: '2026-08-12T09:14:00Z', action: 'created', actor: 'Aïcha Diallo' },
    ],
  },
  {
    id: 'SHR-002', createdBy: 'Aïcha Diallo', resourceType: 'lab-result',
    resourceId: 'LAB-2026-0810', resourceLabel: 'Résultats biologiques — 10/08/2026',
    context: 'facility', recipientId: 'FAC-001', recipientLabel: 'CHU Saint-Louis',
    permissions: ['view', 'download'], expiresAt: '2026-09-12T23:59:00Z',
    consentGiven: true, status: 'active', isMedical: true,
    auditLog: [
      { timestamp: '2026-08-10T14:30:00Z', action: 'created', actor: 'Aïcha Diallo' },
      { timestamp: '2026-08-11T08:00:00Z', action: 'viewed', actor: 'Dr. Moussa Diallo' },
    ],
  },
  {
    id: 'SHR-003', createdBy: 'SHIFA Health OS', resourceType: 'article',
    resourceId: 'ART-2026-0801', resourceLabel: 'Campagne prévention paludisme — Août 2026',
    context: 'social', permissions: ['view'],
    consentGiven: true, status: 'active', isMedical: false,
    auditLog: [
      { timestamp: '2026-08-01T10:00:00Z', action: 'created', actor: 'SHIFA Health OS' },
    ],
  },
  {
    id: 'SHR-004', createdBy: 'Dr. Mohamed Sy', resourceType: 'prescription',
    resourceId: 'PRESC-2026-0812', resourceLabel: 'Ordonnance — 12/08/2026',
    context: 'internal', recipientId: 'PHARM-001', recipientLabel: 'Pharmacie Centrale — CHU',
    permissions: ['view'], expiresAt: '2026-08-19T23:59:00Z',
    consentGiven: true, status: 'active', isMedical: true,
    auditLog: [
      { timestamp: '2026-08-12T09:30:00Z', action: 'created', actor: 'Dr. Mohamed Sy' },
    ],
  },
  {
    id: 'SHR-005', createdBy: 'Aïcha Diallo', resourceType: 'imaging',
    resourceId: 'IMG-2026-0805', resourceLabel: 'Scanner thoracique — 05/08/2026',
    context: 'professional', recipientId: 'PRO-003', recipientLabel: 'Dr. Ibrahima Ndiaye — Pneumologue',
    permissions: ['view'], expiresAt: '2026-08-12T23:59:00Z',
    consentGiven: true, status: 'expired', isMedical: true,
    auditLog: [
      { timestamp: '2026-08-05T11:00:00Z', action: 'created', actor: 'Aïcha Diallo' },
      { timestamp: '2026-08-12T00:00:00Z', action: 'expired', actor: 'Système SHIFA' },
    ],
  },
];

const publicPages = [
  { type: 'professional', label: 'Dr. Mohamed Sy', sub: 'Médecin généraliste — Vérifié SHIFA', href: '/pro-profile', badge: 'Vérifié', icon: 'UserCircleIcon', color: '#2563eb' },
  { type: 'facility', label: 'CHU Saint-Louis', sub: 'Établissement référencé SHIFA', href: '/hopital-dashboard', badge: 'Référencé', icon: 'BuildingOffice2Icon', color: '#16a34a' },
  { type: 'event', label: 'Journée Prévention Diabète', sub: 'Événement public — 20/08/2026', href: '/shifa-academy', badge: 'Public', icon: 'CalendarDaysIcon', color: '#d97706' },
  { type: 'training', label: 'Formation BLS — SHIFA Academy', sub: 'Formation certifiante ouverte', href: '/shifa-academy', badge: 'Public', icon: 'AcademicCapIcon', color: '#7c3aed' },
  { type: 'article', label: 'Prévention du paludisme', sub: 'Article santé publique', href: '/espace-sante-publique', badge: 'Public', icon: 'DocumentTextIcon', color: '#0891b2' },
  { type: 'marketplace', label: 'Tensiomètre connecté SHIFA', sub: 'Produit Marketplace — Disponible', href: '/health-marketplace', badge: 'Public', icon: 'ShoppingBagIcon', color: '#dc2626' },
];

const socialPlatforms = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'ChatBubbleLeftRightIcon', color: '#25D366', bg: '#dcfce7' },
  { id: 'facebook', label: 'Facebook', icon: 'GlobeAltIcon', color: '#1877F2', bg: '#dbeafe' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'BriefcaseIcon', color: '#0A66C2', bg: '#dbeafe' },
  { id: 'x', label: 'X (Twitter)', icon: 'HashtagIcon', color: '#000000', bg: '#f1f5f9' },
  { id: 'telegram', label: 'Telegram', icon: 'PaperAirplaneIcon', color: '#26A5E4', bg: '#cffafe' },
  { id: 'instagram', label: 'Instagram', icon: 'PhotoIcon', color: '#E4405F', bg: '#fce7f3' },
];

const contextConfig: Record<ShareContext, { label: string; icon: string; color: string; bg: string }> = {
  internal: { label: 'Interne SHIFA', icon: 'ShieldCheckIcon', color: '#2563eb', bg: '#dbeafe' },
  professional: { label: 'Professionnel de santé', icon: 'UserCircleIcon', color: '#16a34a', bg: '#dcfce7' },
  facility: { label: 'Établissement', icon: 'BuildingOffice2Icon', color: '#7c3aed', bg: '#ede9fe' },
  institution: { label: 'Institution autorisée', icon: 'BuildingLibraryIcon', color: '#0891b2', bg: '#cffafe' },
  'external-system': { label: 'Système externe', icon: 'ArrowsRightLeftIcon', color: '#d97706', bg: '#fef3c7' },
  public: { label: 'Public', icon: 'GlobeAltIcon', color: '#64748b', bg: '#f1f5f9' },
  social: { label: 'Réseaux sociaux', icon: 'ShareIcon', color: '#dc2626', bg: '#fee2e2' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7' },
  expired: { label: 'Expiré', color: '#64748b', bg: '#f1f5f9' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2' },
  'pending-consent': { label: 'Consentement requis', color: '#d97706', bg: '#fef3c7' },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function ShifaShareContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedShare, setSelectedShare] = useState<ShareRequest | null>(null);
  const [newShareType, setNewShareType] = useState<ShareResourceType>('consultation');
  const [newShareContext, setNewShareContext] = useState<ShareContext>('professional');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'new-share', label: 'Nouveau partage', icon: 'ShareIcon' },
    { key: 'active', label: 'Partages actifs', icon: 'CheckCircleIcon' },
    { key: 'history', label: 'Historique & Audit', icon: 'ClipboardDocumentListIcon' },
    { key: 'public-pages', label: 'Pages publiques', icon: 'GlobeAltIcon' },
    { key: 'social', label: 'Partage social', icon: 'HashtagIcon' },
  ];

  const activeShares = mockShares.filter(s => s.status === 'active');
  const medicalShares = mockShares.filter(s => s.isMedical);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ShareIcon" size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>SHIFA Share</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>Système de partage sécurisé, contrôlé et auditable</p>
          </div>
        </div>
        {/* Security notice */}
        <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="ShieldExclamationIcon" size={16} color="#d97706" />
          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
            <strong>Règle absolue :</strong> Les données médicales (dossier, diagnostic, ordonnance, résultats, imagerie) ne peuvent jamais être partagées sur les réseaux sociaux. Seul le partage sécurisé SHIFA est autorisé pour ces contenus.
          </p>
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
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Partages actifs', value: String(activeShares.length), icon: 'CheckCircleIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
              { label: 'Partages médicaux', value: String(medicalShares.length), icon: 'ShieldCheckIcon', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
              { label: 'Expirés ce mois', value: '1', icon: 'ClockIcon', color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
              { label: 'Révocations', value: '0', icon: 'XCircleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={kpi.icon} size={20} color={kpi.color} />
                </div>
                <div>
                  <p style={{ fontSize: '28px', fontWeight: 700, color: kpi.color, lineHeight: 1, margin: 0 }}>{kpi.value}</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '4px' }}>{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent shares */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Partages récents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mockShares.slice(0, 4).map(share => {
                const ctx = contextConfig[share.context];
                const st = statusConfig[share.status];
                return (
                  <div key={share.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--muted)', borderRadius: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: ctx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={ctx.icon} size={16} color={ctx.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--foreground)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{share.resourceLabel}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{ctx.label}{share.recipientLabel ? ` → ${share.recipientLabel}` : ''}</p>
                    </div>
                    {share.isMedical && (
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 600, flexShrink: 0 }}>🔒 Médical</span>
                    )}
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600, flexShrink: 0 }}>{st.label}</span>
                    <button onClick={() => setSelectedShare(share)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '11px', color: 'var(--muted-foreground)' }}>Détails</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── NEW SHARE ── */}
      {activeTab === 'new-share' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Créer un partage sécurisé</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>Type de ressource</label>
              <select value={newShareType} onChange={e => setNewShareType(e.target.value as ShareResourceType)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px' }}>
                <option value="consultation">Consultation</option>
                <option value="prescription">Ordonnance</option>
                <option value="lab-result">Résultats biologiques</option>
                <option value="imaging">Imagerie</option>
                <option value="patient-record">Dossier patient</option>
                <option value="document">Document médical</option>
                <option value="certificate">Certificat médical</option>
                <option value="article">Article / Campagne (public)</option>
                <option value="training">Formation (public)</option>
                <option value="professional-profile">Profil professionnel (public)</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>Contexte de partage</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {(Object.entries(contextConfig) as [ShareContext, typeof contextConfig[ShareContext]][]).map(([key, cfg]) => {
                  const isSocial = key === 'social';
                  const isMedicalResource = SOCIAL_SHARE_FORBIDDEN_TYPES.includes(newShareType);
                  const isDisabled = isSocial && isMedicalResource;
                  return (
                    <button key={key} onClick={() => !isDisabled && setNewShareContext(key)}
                      disabled={isDisabled}
                      style={{ padding: '8px', borderRadius: '8px', border: `2px solid ${newShareContext === key ? cfg.color : 'var(--border)'}`, background: newShareContext === key ? cfg.bg : 'transparent', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: newShareContext === key ? cfg.color : 'var(--muted-foreground)' }}>
                      <Icon name={cfg.icon} size={14} color={newShareContext === key ? cfg.color : undefined} />
                      {cfg.label}
                      {isDisabled && <Icon name="LockClosedIcon" size={10} color="#dc2626" />}
                    </button>
                  );
                })}
              </div>
              {SOCIAL_SHARE_FORBIDDEN_TYPES.includes(newShareType) && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon name="ExclamationTriangleIcon" size={14} color="#dc2626" />
                  <p style={{ fontSize: '11px', color: '#dc2626', margin: 0 }}>Ce type de contenu médical ne peut pas être partagé sur les réseaux sociaux.</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>Destinataire</label>
              <input type="text" placeholder="Rechercher un professionnel, établissement..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>Permissions accordées</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['view', 'download', 'print', 'forward'] as SharePermission[]).map(perm => (
                  <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={perm === 'view'} />
                    {perm === 'view' ? 'Consulter' : perm === 'download' ? 'Télécharger' : perm === 'print' ? 'Imprimer' : 'Transférer'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', display: 'block', marginBottom: '6px' }}>Expiration</label>
              <input type="datetime-local" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              Créer le partage sécurisé SHIFA
            </button>
          </div>

          {/* Info panel */}
          <div>
            <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>Chaque partage définit :</h4>
              {['QUI reçoit les données', 'QUOI est partagé (données minimales)', 'POURQUOI (contexte médical)', 'QUELLE DURÉE (expiration)', 'QUELLES ACTIONS (permissions)', 'QUELLES PERMISSIONS (lecture/téléchargement)'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Icon name="CheckCircleIcon" size={12} color="#2563eb" />
                  <span style={{ fontSize: '12px', color: '#1e40af' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '8px' }}>Fonctionnalités incluses :</h4>
              {['Lien SHIFA sécurisé + limité dans le temps', 'QR Code de partage', 'Copier le lien', 'Révocation à tout moment', 'Historique d\'accès complet', 'Notification au destinataire', 'Consentement patient si requis'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Icon name="ShieldCheckIcon" size={12} color="#16a34a" />
                  <span style={{ fontSize: '12px', color: '#166534' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVE SHARES ── */}
      {activeTab === 'active' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Partages actifs ({activeShares.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeShares.map(share => {
              const ctx = contextConfig[share.context];
              return (
                <div key={share.id} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: ctx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={ctx.icon} size={18} color={ctx.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{share.resourceLabel}</p>
                        {share.isMedical && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>🔒 Médical sécurisé</span>}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>{ctx.label}{share.recipientLabel ? ` → ${share.recipientLabel}` : ''}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {share.permissions.map(p => (
                          <span key={p} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{p}</span>
                        ))}
                        {share.expiresAt && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#92400e' }}>Expire: {new Date(share.expiresAt).toLocaleDateString('fr-FR')}</span>}
                      </div>
                    </div>
                    <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                      Révoquer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── HISTORY & AUDIT ── */}
      {activeTab === 'history' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Historique & Journal d'audit</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['ID', 'Ressource', 'Contexte', 'Destinataire', 'Statut', 'Dernière action', 'Accès'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockShares.map(share => {
                  const ctx = contextConfig[share.context];
                  const st = statusConfig[share.status];
                  const lastEntry = share.auditLog[share.auditLog.length - 1];
                  return (
                    <tr key={share.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--muted-foreground)' }}>{share.id}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--foreground)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{share.resourceLabel}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: ctx.bg, color: ctx.color, fontWeight: 600 }}>{ctx.label}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{share.recipientLabel || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{lastEntry?.action} — {new Date(lastEntry?.timestamp).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--muted-foreground)' }}>{share.auditLog.length} entrée(s)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PUBLIC PAGES ── */}
      {activeTab === 'public-pages' && (
        <div>
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="GlobeAltIcon" size={16} color="#16a34a" />
            <p style={{ fontSize: '12px', color: '#166534', margin: 0 }}>Les pages publiques SHIFA conservent l'identité SHIFA et ramènent toujours vers l'écosystème SHIFA. Chaque partage renforce la visibilité de SHIFA.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {publicPages.map(page => (
              <div key={page.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${page.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={page.icon} size={20} color={page.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{page.label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>{page.sub}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>{page.badge}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>Identité SHIFA</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link href={page.href} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted-foreground)', fontSize: '11px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'block' }}>Voir la page</Link>
                  <button style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Partager</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SOCIAL SHARING ── */}
      {activeTab === 'social' && (
        <div>
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="ShieldExclamationIcon" size={16} color="#dc2626" />
            <p style={{ fontSize: '12px', color: '#991b1b', margin: 0 }}>
              <strong>INTERDICTION ABSOLUE :</strong> Le partage social ne s'applique qu'aux contenus publics (articles, campagnes, formations, profils publics, Marketplace). Aucune donnée médicale ne peut être partagée sur les réseaux sociaux.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Plateformes disponibles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {socialPlatforms.map(platform => (
                  <div key={platform.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: platform.bg }}>
                    <Icon name={platform.icon} size={18} color={platform.color} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{platform.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon name="LinkIcon" size={14} />Copier le lien
                </button>
                <button style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon name="QrCodeIcon" size={14} />QR Code
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Contenus partageables</h3>
              {[
                { label: 'Articles de prévention', icon: 'DocumentTextIcon', allowed: true },
                { label: 'Campagnes de santé', icon: 'MegaphoneIcon', allowed: true },
                { label: 'Formations SHIFA Academy', icon: 'AcademicCapIcon', allowed: true },
                { label: 'Profils publics professionnels', icon: 'UserCircleIcon', allowed: true },
                { label: 'Pages publiques d\'établissements', icon: 'BuildingOffice2Icon', allowed: true },
                { label: 'Produits Marketplace publics', icon: 'ShoppingBagIcon', allowed: true },
                { label: 'Dossier médical', icon: 'ClipboardDocumentListIcon', allowed: false },
                { label: 'Ordonnances & Résultats', icon: 'BeakerIcon', allowed: false },
                { label: 'Imagerie médicale', icon: 'PhotoIcon', allowed: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <Icon name={item.allowed ? 'CheckCircleIcon' : 'XCircleIcon'} size={14} color={item.allowed ? '#16a34a' : '#dc2626'} />
                  <Icon name={item.icon} size={13} color="var(--muted-foreground)" />
                  <span style={{ fontSize: '12px', color: item.allowed ? 'var(--foreground)' : 'var(--muted-foreground)', textDecoration: item.allowed ? 'none' : 'line-through' }}>{item.label}</span>
                  {!item.allowed && <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '4px', background: '#fee2e2', color: '#dc2626', fontWeight: 600, marginLeft: 'auto' }}>Interdit</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedShare && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedShare(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Détails du partage</h3>
              <button onClick={() => setSelectedShare(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="XMarkIcon" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'ID', value: selectedShare.id },
                { label: 'Ressource', value: selectedShare.resourceLabel },
                { label: 'Contexte', value: contextConfig[selectedShare.context].label },
                { label: 'Destinataire', value: selectedShare.recipientLabel || '—' },
                { label: 'Permissions', value: selectedShare.permissions.join(', ') },
                { label: 'Expiration', value: selectedShare.expiresAt ? new Date(selectedShare.expiresAt).toLocaleString('fr-FR') : 'Aucune' },
                { label: 'Données médicales', value: selectedShare.isMedical ? '🔒 Oui — partage sécurisé uniquement' : 'Non' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{row.value}</span>
                </div>
              ))}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)', marginBottom: '6px' }}>Journal d'audit</p>
                {selectedShare.auditLog.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
                    <span>{new Date(entry.timestamp).toLocaleString('fr-FR')}</span>
                    <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{entry.action}</span>
                    <span>{entry.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
