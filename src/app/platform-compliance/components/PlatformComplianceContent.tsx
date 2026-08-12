'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'overview' | 'gdpr' | 'certifications' | 'audits' | 'incidents';

interface ComplianceItem {
  domain: string;
  score: number;
  status: 'compliant' | 'partial' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
  items: number;
  open: number;
}

const complianceData: ComplianceItem[] = [
  { domain: 'RGPD / Protection des données', score: 94, status: 'compliant', lastAudit: '2025-06-01', nextAudit: '2025-12-01', items: 48, open: 3 },
  { domain: 'ISO 27001 — Sécurité SI', score: 87, status: 'compliant', lastAudit: '2025-05-15', nextAudit: '2026-05-15', items: 114, open: 8 },
  { domain: 'HDS — Hébergement données santé', score: 96, status: 'compliant', lastAudit: '2025-04-20', nextAudit: '2026-04-20', items: 62, open: 2 },
  { domain: 'HL7 FHIR R4 — Interopérabilité', score: 78, status: 'partial', lastAudit: '2025-07-01', nextAudit: '2025-10-01', items: 35, open: 12 },
  { domain: 'Réglementation pharmaceutique', score: 91, status: 'compliant', lastAudit: '2025-03-10', nextAudit: '2026-03-10', items: 29, open: 4 },
  { domain: 'Accessibilité WCAG 2.1 AA', score: 65, status: 'partial', lastAudit: '2025-07-15', nextAudit: '2025-09-15', items: 42, open: 18 },
];

const STATUS_CONFIG = {
  compliant: { label: 'Conforme', bg: '#dcfce7', text: '#16a34a', icon: 'CheckCircleIcon' },
  partial: { label: 'Partiel', bg: '#fef9c3', text: '#a16207', icon: 'ExclamationTriangleIcon' },
  non_compliant: { label: 'Non conforme', bg: '#fee2e2', text: '#b91c1c', icon: 'XCircleIcon' },
};

const gdprItems = [
  { category: 'Bases légales', status: 'compliant', description: 'Toutes les bases légales documentées pour chaque traitement' },
  { category: 'Registre des traitements', status: 'compliant', description: 'Registre ROPA à jour, 47 traitements documentés' },
  { category: 'Droits des personnes', status: 'compliant', description: 'Portail droits opérationnel (accès, rectification, effacement, portabilité)' },
  { category: 'Transferts hors UE', status: 'partial', description: '2 sous-traitants sans clauses contractuelles types à jour' },
  { category: 'DPO désigné', status: 'compliant', description: 'DPO interne désigné et notifié à la CNIL' },
  { category: 'Analyses d\'impact (AIPD)', status: 'partial', description: '3 AIPD en cours de finalisation pour nouveaux traitements' },
];

const certifications = [
  { name: 'HDS — Hébergeur de Données de Santé', issuer: 'ANSSI / BSI', expiry: '2026-04-20', status: 'valid' },
  { name: 'ISO 27001:2022', issuer: 'Bureau Veritas', expiry: '2026-05-15', status: 'valid' },
  { name: 'CE Dispositif médical classe I', issuer: 'ANSM', expiry: '2027-01-01', status: 'valid' },
  { name: 'SOC 2 Type II', issuer: 'Deloitte', expiry: '2025-11-30', status: 'expiring' },
];

const incidents = [
  { id: 'INC-2025-012', date: '2025-07-15', type: 'Violation de données', severity: 'medium', status: 'resolved', description: 'Accès non autorisé à 3 dossiers patients — corrigé en 4h' },
  { id: 'INC-2025-008', date: '2025-06-22', type: 'Indisponibilité service', severity: 'low', status: 'resolved', description: 'Interruption API 23 minutes — maintenance non planifiée' },
  { id: 'INC-2025-003', date: '2025-04-10', type: 'Fuite de données', severity: 'high', status: 'resolved', description: 'Log exposé contenant des emails — notifié CNIL dans les 72h' },
];

const SEVERITY_CONFIG = {
  low: { label: 'Faible', bg: '#dcfce7', text: '#16a34a' },
  medium: { label: 'Moyen', bg: '#fef9c3', text: '#a16207' },
  high: { label: 'Élevé', bg: '#fee2e2', text: '#b91c1c' },
};

export default function PlatformComplianceContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'ShieldCheckIcon' },
    { key: 'gdpr', label: 'RGPD', icon: 'LockClosedIcon' },
    { key: 'certifications', label: 'Certifications', icon: 'DocumentCheckIcon' },
    { key: 'audits', label: 'Audits', icon: 'ClipboardDocumentCheckIcon' },
    { key: 'incidents', label: 'Incidents', icon: 'ExclamationTriangleIcon' },
  ];

  const overallScore = Math.round(complianceData.reduce((s, d) => s + d.score, 0) / complianceData.length);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>
            Conformité & Réglementation
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Tableau de bord de conformité plateforme · Dernière mise à jour : 2025-08-01
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Icon name="ArrowDownTrayIcon" size={16} />
          Rapport de conformité
        </button>
      </div>

      {/* Score global */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 p-5 rounded-xl border flex flex-col items-center justify-center" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="relative w-24 h-24 mb-3">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={overallScore >= 90 ? '#16a34a' : overallScore >= 70 ? '#a16207' : '#b91c1c'} strokeWidth="3"
                strokeDasharray={`${overallScore} ${100 - overallScore}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{overallScore}%</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-center" style={{ color: 'var(--foreground)' }}>Score global</p>
          <span className="text-xs px-2 py-0.5 rounded-full mt-1" style={{ background: '#dcfce7', color: '#16a34a' }}>Conforme</span>
        </div>

        {[
          { label: 'Domaines conformes', value: complianceData.filter(d => d.status === 'compliant').length, total: complianceData.length, color: '#dcfce7', textColor: '#16a34a' },
          { label: 'Points ouverts', value: complianceData.reduce((s, d) => s + d.open, 0), total: complianceData.reduce((s, d) => s + d.items, 0), color: '#fef9c3', textColor: '#a16207' },
          { label: 'Certifications valides', value: certifications.filter(c => c.status === 'valid').length, total: certifications.length, color: '#dbeafe', textColor: '#1d4ed8' },
        ].map((kpi, i) => (
          <div key={i} className="p-5 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {kpi.value}<span className="text-lg font-normal" style={{ color: 'var(--muted-foreground)' }}>/{kpi.total}</span>
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            <div className="mt-3 h-1.5 rounded-full" style={{ background: 'var(--muted)' }}>
              <div className="h-1.5 rounded-full" style={{ width: `${(kpi.value / kpi.total) * 100}%`, background: kpi.textColor }} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'var(--background)' : 'transparent',
              color: activeTab === tab.key ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {complianceData.map((item, i) => {
            const sc = STATUS_CONFIG[item.status];
            return (
              <div key={i} className="p-5 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon name={sc.icon as any} size={18} style={{ color: sc.text }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.domain}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        Dernier audit : {item.lastAudit} · Prochain : {item.nextAudit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.score}%</span>
                    {item.open > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#fee2e2', color: '#b91c1c' }}>{item.open} ouverts</span>
                    )}
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--muted)' }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${item.score}%`, background: item.score >= 90 ? '#16a34a' : item.score >= 70 ? '#f59e0b' : '#ef4444' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GDPR Tab */}
      {activeTab === 'gdpr' && (
        <div className="space-y-3">
          {gdprItems.map((item, i) => {
            const sc = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
            return (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: sc.bg }}>
                  <Icon name={sc.icon as any} size={16} style={{ color: sc.text }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.category}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.description}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-2 gap-4">
          {certifications.map((cert, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cert.status === 'valid' ? '#dcfce7' : '#fef9c3' }}>
                  <Icon name="DocumentCheckIcon" size={20} style={{ color: cert.status === 'valid' ? '#16a34a' : '#a16207' }} />
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{
                  background: cert.status === 'valid' ? '#dcfce7' : '#fef9c3',
                  color: cert.status === 'valid' ? '#16a34a' : '#a16207',
                }}>
                  {cert.status === 'valid' ? 'Valide' : 'Expire bientôt'}
                </span>
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{cert.name}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Émis par : {cert.issuer}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Expire le : {cert.expiry}</p>
            </div>
          ))}
        </div>
      )}

      {/* Audits Tab */}
      {activeTab === 'audits' && (
        <div className="space-y-3">
          {complianceData.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{item.domain}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Dernier audit : {item.lastAudit} · {item.items} points vérifiés
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochain audit</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.nextAudit}</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  Rapport
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Incidents de sécurité et violations de données</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={15} />
              Déclarer un incident
            </button>
          </div>
          {incidents.map((inc, i) => {
            const sc = SEVERITY_CONFIG[inc.severity as keyof typeof SEVERITY_CONFIG];
            return (
              <div key={i} className="p-5 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{inc.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>Résolu</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inc.date}</span>
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{inc.type}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{inc.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
