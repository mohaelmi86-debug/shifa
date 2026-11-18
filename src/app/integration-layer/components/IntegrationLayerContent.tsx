'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { allFlows, connectorRegistry, ModuleFlow } from '@/lib/moduleInterconnect';

type Tab = 'overview' | 'flows' | 'connectors' | 'audit' | 'permissions';

const dataScopeConfig: Record<string, { label: string; color: string; bg: string }> = {
  identity: { label: 'Identité', color: '#2563eb', bg: '#dbeafe' },
  administrative: { label: 'Administratif', color: '#0891b2', bg: '#cffafe' },
  'clinical-summary': { label: 'Clinique (résumé)', color: '#7c3aed', bg: '#ede9fe' },
  'clinical-full': { label: 'Clinique (complet)', color: '#dc2626', bg: '#fee2e2' },
  financial: { label: 'Financier', color: '#16a34a', bg: '#dcfce7' },
  hr: { label: 'RH', color: '#d97706', bg: '#fef3c7' },
  operational: { label: 'Opérationnel', color: '#64748b', bg: '#f1f5f9' },
  analytics: { label: 'Analytics', color: '#0891b2', bg: '#cffafe' },
  public: { label: 'Public', color: '#64748b', bg: '#f1f5f9' },
};

const connectorStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  inactive: { label: 'Inactif', color: '#64748b', bg: '#f1f5f9', icon: 'MinusCircleIcon' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
  revoked: { label: 'Révoqué', color: '#dc2626', bg: '#fee2e2', icon: 'XMarkIcon' },
};

const mockAuditEvents = [
  { id: 'AUD-001', ts: '2026-08-12 09:14', user: 'Dr. Mohamed Sy', role: 'Médecin', org: 'CHU Saint-Louis', from: 'consultation', to: 'prescription', scope: 'clinical-summary', action: 'write', authorized: true, result: 'success' },
  { id: 'AUD-002', ts: '2026-08-12 09:15', user: 'Dr. Mohamed Sy', role: 'Médecin', org: 'CHU Saint-Louis', from: 'prescription', to: 'pharmacy', scope: 'administrative', action: 'share', authorized: true, result: 'success' },
  { id: 'AUD-003', ts: '2026-08-12 09:30', user: 'Pharmacien Diallo', role: 'Pharmacien', org: 'CHU Saint-Louis', from: 'pharmacy', to: 'patient-record', scope: 'clinical-full', action: 'read', authorized: false, result: 'denied' },
  { id: 'AUD-004', ts: '2026-08-12 09:45', user: 'Comptable Ndiaye', role: 'Comptable', org: 'CHU Saint-Louis', from: 'billing', to: 'accounting', scope: 'financial', action: 'write', authorized: true, result: 'success' },
  { id: 'AUD-005', ts: '2026-08-12 10:00', user: 'Système SHIFA', role: 'Système', org: 'CHU Saint-Louis', from: 'laboratory', to: 'patient-record', scope: 'clinical-summary', action: 'write', authorized: true, result: 'success' },
];

const moduleStatusMap: Record<string, { status: string; color: string; emoji: string }> = {
  'SHIFA Share': { status: 'NOUVEAU', color: '#2563eb', emoji: '🔵' },
  'SHIFA Workforce Admin': { status: 'NOUVEAU', color: '#2563eb', emoji: '🔵' },
  'My SHIFA Workspace': { status: 'NOUVEAU', color: '#2563eb', emoji: '🔵' },
  'Module Interconnection Layer': { status: 'NOUVEAU', color: '#2563eb', emoji: '🔵' },
  'Patient Transfer': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'External Connectors': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Interoperability Hub': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'HR Module': { status: 'PARTIEL', color: '#d97706', emoji: '🟡' },
  'Org HR Payroll': { status: 'PARTIEL', color: '#d97706', emoji: '🟡' },
  'Org HR Planning': { status: 'PARTIEL', color: '#d97706', emoji: '🟡' },
  'Consultation Workspace': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Pharmacy Dashboard': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Lab Dashboard': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Imaging Dashboard': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Billing Dashboard': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Finance Dashboard': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Offline Mode Config': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Local Health Services': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Workspace Engine': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Profession Config (39 métiers)': { status: 'EXISTANT', color: '#16a34a', emoji: '🟢' },
  'Stripe / Mobile Money': { status: 'DÉPENDANCE EXTERNE', color: '#dc2626', emoji: '🔴' },
  'LIS / PACS / DICOM': { status: 'DÉPENDANCE EXTERNE', color: '#dc2626', emoji: '🔴' },
  'Identité nationale': { status: 'DÉPENDANCE EXTERNE', color: '#dc2626', emoji: '🔴' },
};

export default function IntegrationLayerContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedFlow, setSelectedFlow] = useState<ModuleFlow | null>(null);
  const [filterScope, setFilterScope] = useState<string>('all');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'flows', label: 'Flux inter-modules', icon: 'ArrowsRightLeftIcon' },
    { key: 'connectors', label: 'Connecteurs externes', icon: 'PuzzlePieceIcon' },
    { key: 'audit', label: 'Journal d\'audit', icon: 'ClipboardDocumentCheckIcon' },
    { key: 'permissions', label: 'Matrice permissions', icon: 'ShieldCheckIcon' },
  ];

  const filteredFlows = filterScope === 'all' ? allFlows : allFlows.filter(f => f.dataScope === filterScope);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowsRightLeftIcon" size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>SHIFA Integration Layer</h1>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', margin: 0 }}>Couche d'interconnexion des modules — Contrôlée, auditée, sécurisée</p>
          </div>
        </div>
        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="InformationCircleIcon" size={16} color="#2563eb" />
          <p style={{ fontSize: '12px', color: '#1e40af', margin: 0 }}>
            <strong>Principe fondamental :</strong> Interconnecté ≠ Accès global. Chaque échange respecte : Utilisateur → Organisation → Rôle → Service → Module → Permission → Ressource → Action → Contexte.
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

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Flux définis', value: String(allFlows.length), icon: 'ArrowsRightLeftIcon', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
              { label: 'Connecteurs', value: String(connectorRegistry.length), icon: 'PuzzlePieceIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
              { label: 'Connecteurs actifs', value: String(connectorRegistry.filter(c => c.status === 'active').length), icon: 'CheckCircleIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
              { label: 'Flux avec audit', value: String(allFlows.filter(f => f.auditRequired).length), icon: 'ClipboardDocumentCheckIcon', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
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

          {/* Architecture diagram */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Architecture SHIFA Integration Layer</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap', padding: '16px' }}>
              {[
                { label: 'MODULE SHIFA', icon: 'PuzzlePieceIcon', color: '#2563eb', bg: '#dbeafe' },
                { label: '↓', icon: null, color: '#64748b', bg: 'transparent' },
                { label: 'INTEGRATION LAYER', icon: 'ArrowsRightLeftIcon', color: '#7c3aed', bg: '#ede9fe' },
                { label: '↓', icon: null, color: '#64748b', bg: 'transparent' },
                { label: 'CONNECTOR', icon: 'LinkIcon', color: '#0891b2', bg: '#cffafe' },
                { label: '↓', icon: null, color: '#64748b', bg: 'transparent' },
                { label: 'SERVICE EXTERNE', icon: 'GlobeAltIcon', color: '#dc2626', bg: '#fee2e2' },
              ].map((item, i) => (
                item.icon ? (
                  <div key={i} style={{ padding: '12px 20px', borderRadius: '10px', background: item.bg, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', gap: '8px', margin: '4px' }}>
                    <Icon name={item.icon} size={16} color={item.color} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.label}</span>
                  </div>
                ) : (
                  <span key={i} style={{ fontSize: '20px', color: item.color, margin: '0 4px' }}>{item.label}</span>
                )
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
              {[
                { label: 'Authentification', icon: 'KeyIcon', items: ['API Key sécurisée', 'OAuth 2.0', 'mTLS', 'HMAC-SHA256'] },
                { label: 'Sécurité', icon: 'ShieldCheckIcon', items: ['Chiffrement bout-en-bout', 'Secrets jamais exposés', 'Consentement requis', 'Révocation possible'] },
                { label: 'Monitoring', icon: 'ChartBarIcon', items: ['Journalisation complète', 'Retry automatique', 'Statut en temps réel', 'Alertes d\'erreur'] },
              ].map(section => (
                <div key={section.label} style={{ padding: '14px', borderRadius: '10px', background: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Icon name={section.icon} size={16} color="var(--shifa-blue)" />
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{section.label}</p>
                  </div>
                  {section.items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon name="CheckCircleIcon" size={11} color="#16a34a" />
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Module status report */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '16px' }}>Rapport d'état des modules</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.entries(moduleStatusMap).map(([name, info]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'var(--muted)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '14px' }}>{info.emoji}</span>
                  <span style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{name}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: `${info.color}15`, color: info.color, fontWeight: 600 }}>{info.status}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { emoji: '🟢', label: 'EXISTANT ET FONCTIONNEL' },
                { emoji: '🟡', label: 'EXISTANT MAIS PARTIEL' },
                { emoji: '🟠', label: 'MOCK' },
                { emoji: '🔵', label: 'NOUVEAU (cette session)' },
                { emoji: '🔴', label: 'DÉPENDANCE EXTERNE' },
              ].map(leg => (
                <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{leg.emoji}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{leg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FLOWS ── */}
      {activeTab === 'flows' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilterScope('all')} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', background: filterScope === 'all' ? 'var(--shifa-blue)' : 'var(--muted)', color: filterScope === 'all' ? '#fff' : 'var(--muted-foreground)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Tous ({allFlows.length})</button>
            {Object.entries(dataScopeConfig).map(([key, cfg]) => {
              const count = allFlows.filter(f => f.dataScope === key).length;
              if (count === 0) return null;
              return (
                <button key={key} onClick={() => setFilterScope(key)} style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', background: filterScope === key ? cfg.color : cfg.bg, color: filterScope === key ? '#fff' : cfg.color, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFlows.map(flow => {
              const scope = dataScopeConfig[flow.dataScope];
              return (
                <div key={flow.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', cursor: 'pointer' }} onClick={() => setSelectedFlow(flow)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', padding: '4px 8px', borderRadius: '6px', background: 'var(--muted)' }}>{flow.from}</span>
                      <Icon name="ArrowRightIcon" size={14} color="var(--muted-foreground)" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--foreground)', padding: '4px 8px', borderRadius: '6px', background: 'var(--muted)' }}>{flow.to}</span>
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: scope.bg, color: scope.color, fontWeight: 600, flexShrink: 0 }}>{scope.label}</span>
                    {flow.auditRequired && <Icon name="ClipboardDocumentCheckIcon" size={14} color="#7c3aed" title="Audit requis" />}
                    {flow.consentRequired === 'always' && <Icon name="ShieldCheckIcon" size={14} color="#d97706" title="Consentement requis" />}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: '6px 0 0' }}>{flow.description}</p>
                  {flow.example && <p style={{ fontSize: '11px', color: 'var(--shifa-blue)', margin: '4px 0 0', fontStyle: 'italic' }}>Ex : {flow.example}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CONNECTORS ── */}
      {activeTab === 'connectors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Link href="/external-connectors" style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'var(--shifa-blue)', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="PuzzlePieceIcon" size={13} />Connecteurs complets
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {connectorRegistry.map(conn => {
              const st = connectorStatusConfig[conn.status];
              const scope = dataScopeConfig[conn.dataScope];
              return (
                <div key={conn.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={st.icon} size={18} color={st.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{conn.name}</p>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: st.bg, color: st.color, fontWeight: 600 }}>{st.label}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', margin: 0 }}>Module : {conn.module} · Auth : {conn.authMethod} · Direction : {conn.direction}{conn.country ? ` · ${conn.country}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: scope.bg, color: scope.color, fontWeight: 600, flexShrink: 0 }}>{scope.label}</span>
                  {conn.encrypted && <Icon name="LockClosedIcon" size={14} color="#16a34a" title="Chiffré" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AUDIT ── */}
      {activeTab === 'audit' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>Journal d'audit inter-modules</h3>
            <Link href="/admin-audit" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              Audit complet
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Horodatage', 'Utilisateur', 'Rôle', 'Source', 'Destination', 'Données', 'Action', 'Résultat'].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted-foreground)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAuditEvents.map(evt => {
                  const scope = dataScopeConfig[evt.scope];
                  return (
                    <tr key={evt.id} style={{ borderBottom: '1px solid var(--border)', background: !evt.authorized ? '#fff5f5' : 'transparent' }}>
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{evt.ts}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--foreground)' }}>{evt.user}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--muted-foreground)' }}>{evt.role}</td>
                      <td style={{ padding: '8px 10px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--muted)', fontSize: '11px', fontWeight: 600 }}>{evt.from}</span></td>
                      <td style={{ padding: '8px 10px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--muted)', fontSize: '11px', fontWeight: 600 }}>{evt.to}</span></td>
                      <td style={{ padding: '8px 10px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: scope.bg, color: scope.color, fontSize: '11px', fontWeight: 600 }}>{scope.label}</span></td>
                      <td style={{ padding: '8px 10px', color: 'var(--muted-foreground)' }}>{evt.action}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: evt.result === 'success' ? '#dcfce7' : '#fee2e2', color: evt.result === 'success' ? '#16a34a' : '#dc2626' }}>
                          {evt.result === 'success' ? '✓ Succès' : '✗ Refusé'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PERMISSIONS ── */}
      {activeTab === 'permissions' && (
        <div>
          <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="ShieldExclamationIcon" size={16} color="#d97706" />
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
              <strong>Principe NEED TO KNOW :</strong> Un module ne reçoit que les données strictement nécessaires à son fonctionnement. Le pharmacien ne voit pas le dossier médical complet. Le comptable ne voit pas les notes cliniques.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              {
                role: 'Pharmacien', icon: 'ArchiveBoxIcon', color: '#16a34a',
                allowed: ['Prescription (données administratives)', 'Identité patient (nom uniquement)', 'Facturation (montants)', 'Stock pharmacie'],
                denied: ['Dossier médical complet', 'Notes cliniques', 'Résultats biologiques', 'Imagerie'],
              },
              {
                role: 'Comptable', icon: 'CalculatorIcon', color: '#2563eb',
                allowed: ['Facturation (montants, références)', 'Paiements reçus', 'Comptabilité générale'],
                denied: ['Dossier médical', 'Consultations', 'Prescriptions', 'Résultats biologiques'],
              },
              {
                role: 'Responsable RH', icon: 'UsersIcon', color: '#7c3aed',
                allowed: ['Données RH employés', 'Planning & congés', 'Formations & habilitations', 'Évaluations'],
                denied: ['Dossier médical des employés', 'Données patients', 'Résultats cliniques'],
              },
              {
                role: 'Radiologue', icon: 'PhotoIcon', color: '#0891b2',
                allowed: ['Imagerie complète', 'Résumé clinique (contexte)', 'Identité patient', 'Résultats biologiques (résumé)'],
                denied: ['Dossier médical complet', 'Prescriptions', 'Données financières'],
              },
            ].map(perm => (
              <div key={perm.role} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Icon name={perm.icon} size={18} color={perm.color} />
                  <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{perm.role}</p>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>✓ AUTORISÉ</p>
                  {perm.allowed.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <Icon name="CheckCircleIcon" size={11} color="#16a34a" />
                      <span style={{ fontSize: '11px', color: 'var(--foreground)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>✗ INTERDIT</p>
                  {perm.denied.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <Icon name="XCircleIcon" size={11} color="#dc2626" />
                      <span style={{ fontSize: '11px', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flow detail modal */}
      {selectedFlow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedFlow(null)}>
          <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>{selectedFlow.label}</h3>
              <button onClick={() => setSelectedFlow(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Icon name="XMarkIcon" size={20} color="var(--muted-foreground)" />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>{selectedFlow.description}</p>
            {selectedFlow.example && (
              <div style={{ background: '#dbeafe', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#1e40af', margin: 0, fontStyle: 'italic' }}>Exemple : {selectedFlow.example}</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Source', value: selectedFlow.from },
                { label: 'Destination', value: selectedFlow.to },
                { label: 'Données', value: dataScopeConfig[selectedFlow.dataScope]?.label },
                { label: 'Direction', value: selectedFlow.direction },
                { label: 'Mode', value: selectedFlow.mode },
                { label: 'Consentement', value: selectedFlow.consentRequired },
                { label: 'Audit requis', value: selectedFlow.auditRequired ? 'Oui' : 'Non' },
                { label: 'Permissions requises', value: selectedFlow.requiredPermissions.join(', ') },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
