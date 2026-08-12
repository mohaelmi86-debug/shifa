'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  type: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  ip: string;
}

const auditEntries: AuditEntry[] = [
  { id: 'a1', timestamp: '10/08/2026 10:28', user: 'Dr. Mohamed Sy', role: 'Médecin', action: 'Consultation signée', entity: 'Kwame Asante', type: 'consultation', severity: 'info', ip: '192.168.1.45' },
  { id: 'a2', timestamp: '10/08/2026 10:15', user: 'Admin', role: 'Administrateur', action: 'Module SHIFA AI activé', entity: 'CHU Saint-Louis', type: 'module', severity: 'success', ip: '192.168.1.1' },
  { id: 'a3', timestamp: '10/08/2026 09:58', user: 'Awa Ndiaye', role: 'Infirmière', action: 'Résultats consultés', entity: 'Pierre Dubois', type: 'record', severity: 'info', ip: '192.168.1.67' },
  { id: 'a4', timestamp: '10/08/2026 09:45', user: 'Admin', role: 'Administrateur', action: 'Invitation envoyée', entity: 'Dr. Aminata Kouyaté', type: 'user', severity: 'info', ip: '192.168.1.1' },
  { id: 'a5', timestamp: '10/08/2026 09:32', user: 'Ibrahima Diop', role: 'Pharmacien', action: 'Prescription dispensée', entity: 'Isabelle Fontaine', type: 'prescription', severity: 'info', ip: '192.168.1.89' },
  { id: 'a6', timestamp: '10/08/2026 09:18', user: 'Système', role: 'Système', action: 'Tentative d\'accès refusée', entity: 'IP: 185.234.xx.xx', type: 'security', severity: 'error', ip: '185.234.xx.xx' },
  { id: 'a7', timestamp: '10/08/2026 09:05', user: 'Dr. Fatou Sarr', role: 'Médecin', action: 'Dossier consulté', entity: 'Aïcha Diallo', type: 'record', severity: 'info', ip: '192.168.1.23' },
  { id: 'a8', timestamp: '10/08/2026 08:52', user: 'Admin', role: 'Administrateur', action: 'Rôle modifié', entity: 'Mariama Balde', type: 'user', severity: 'warning', ip: '192.168.1.1' },
  { id: 'a9', timestamp: '10/08/2026 08:40', user: 'Dr. Jean Kouassi', role: 'Médecin', action: 'Téléconsultation démarrée', entity: 'Nadia Benali', type: 'consultation', severity: 'info', ip: '192.168.1.56' },
  { id: 'a10', timestamp: '10/08/2026 08:30', user: 'Système', role: 'Système', action: 'Sauvegarde automatique', entity: 'CHU Saint-Louis', type: 'system', severity: 'success', ip: 'localhost' },
  { id: 'a11', timestamp: '10/08/2026 08:12', user: 'Dr. Mohamed Sy', role: 'Médecin', action: 'Connexion', entity: 'Session #4872', type: 'auth', severity: 'info', ip: '192.168.1.45' },
  { id: 'a12', timestamp: '10/08/2026 07:58', user: 'Système', role: 'Système', action: 'Alerte taux occupation 86%', entity: 'CHU Saint-Louis', type: 'alert', severity: 'warning', ip: 'localhost' },
  { id: 'a13', timestamp: '09/08/2026 17:45', user: 'Mariama Balde', role: 'Secrétaire', action: 'RDV annulé', entity: 'Alioune Badara Cissé', type: 'appointment', severity: 'warning', ip: '192.168.1.34' },
  { id: 'a14', timestamp: '09/08/2026 16:30', user: 'Admin', role: 'Administrateur', action: 'Utilisateur désactivé', entity: 'Compte #1234', type: 'user', severity: 'warning', ip: '192.168.1.1' },
  { id: 'a15', timestamp: '09/08/2026 15:00', user: 'Système', role: 'Système', action: 'Certificat SSL renouvelé', entity: 'shifa.health', type: 'system', severity: 'success', ip: 'localhost' },
];

const severityConfig = {
  info: { label: 'Info', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.08)', icon: 'InformationCircleIcon' },
  success: { label: 'Succès', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.08)', icon: 'CheckCircleIcon' },
  warning: { label: 'Avertissement', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.08)', icon: 'ExclamationTriangleIcon' },
  error: { label: 'Erreur', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.08)', icon: 'XCircleIcon' },
};

const typeIcon: Record<string, string> = {
  consultation: 'ClipboardDocumentListIcon',
  module: 'PuzzlePieceIcon',
  record: 'FolderOpenIcon',
  user: 'UserIcon',
  prescription: 'DocumentTextIcon',
  security: 'ShieldExclamationIcon',
  system: 'CpuChipIcon',
  auth: 'LockClosedIcon',
  alert: 'BellAlertIcon',
  appointment: 'CalendarDaysIcon',
};

export default function AdminAuditContent() {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [search, setSearch] = useState('');

  const filtered = auditEntries.filter(e => {
    const matchSeverity = severityFilter === 'all' || e.severity === severityFilter;
    const matchSearch = search === '' ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entity.toLowerCase().includes(search.toLowerCase());
    return matchSeverity && matchSearch;
  });

  const counts = {
    total: auditEntries.length,
    error: auditEntries.filter(e => e.severity === 'error').length,
    warning: auditEntries.filter(e => e.severity === 'warning').length,
    success: auditEntries.filter(e => e.severity === 'success').length,
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Journal d'audit</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Traçabilité complète des actions — conformité réglementaire</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm px-4 py-2.5">
            <Icon name="ArrowDownTrayIcon" size={15} />
            Exporter CSV
          </button>
          <button className="btn-secondary text-sm px-4 py-2.5">
            <Icon name="FunnelIcon" size={15} />
            Filtres avancés
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Événements aujourd\'hui', value: counts.total, color: 'var(--shifa-blue)', icon: 'ClipboardDocumentCheckIcon' },
          { label: 'Succès', value: counts.success, color: 'var(--shifa-green)', icon: 'CheckCircleIcon' },
          { label: 'Avertissements', value: counts.warning, color: 'var(--shifa-amber)', icon: 'ExclamationTriangleIcon' },
          { label: 'Erreurs / Sécurité', value: counts.error, color: 'var(--shifa-red)', icon: 'ShieldExclamationIcon' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}15` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as React.CSSProperties} className="" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher utilisateur, action, entité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'info', 'success', 'warning', 'error'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: severityFilter === s ? 'var(--shifa-blue)' : 'var(--card)',
                color: severityFilter === s ? 'white' : 'var(--muted-foreground)',
                border: `1px solid ${severityFilter === s ? 'var(--shifa-blue)' : 'var(--border)'}`,
              }}
            >
              {s === 'all' ? 'Tous' : severityConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                {['Horodatage', 'Utilisateur', 'Rôle', 'Action', 'Entité concernée', 'Type', 'Sévérité', 'IP'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const sv = severityConfig[entry.severity];
                const tIcon = typeIcon[entry.type] || 'DocumentTextIcon';
                return (
                  <tr
                    key={entry.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                    style={{ borderColor: 'var(--border)', borderLeft: `3px solid ${sv.color}` }}
                  >
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{entry.timestamp}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)', whiteSpace: 'nowrap' }}>{entry.user}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.role}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{entry.action}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{entry.entity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon name={tIcon as any} size={13} className="text-muted-foreground" />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold w-fit" style={{ backgroundColor: sv.bg, color: sv.color }}>
                        <Icon name={sv.icon as any} size={11} />
                        {sv.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{entry.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} entrée(s) affichée(s)</p>
          <button className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>Charger plus →</button>
        </div>
      </div>
    </div>
  );
}
