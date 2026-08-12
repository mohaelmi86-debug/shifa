'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const auditEntries = [
  { id: 'audit-001', time: '10:28', user: 'Dr. Mohamed Sy', action: 'Consultation signée', entity: 'Kwame Asante', type: 'consultation', severity: 'info' },
  { id: 'audit-002', time: '10:15', user: 'Admin', action: 'Module SHIFA AI activé', entity: 'CHU Saint-Louis', type: 'module', severity: 'success' },
  { id: 'audit-003', time: '09:58', user: 'Awa Ndiaye', action: 'Résultats consultés', entity: 'Pierre Dubois', type: 'record', severity: 'info' },
  { id: 'audit-004', time: '09:45', user: 'Admin', action: 'Invitation envoyée', entity: 'Dr. Aminata Kouyaté', type: 'user', severity: 'info' },
  { id: 'audit-005', time: '09:32', user: 'Ibrahima Diop', action: 'Prescription dispensée', entity: 'Isabelle Fontaine', type: 'prescription', severity: 'info' },
  { id: 'audit-006', time: '09:18', user: 'Système', action: 'Tentative d\'accès refusée', entity: 'IP: 185.234.xx.xx', type: 'security', severity: 'error' },
  { id: 'audit-007', time: '09:05', user: 'Dr. Fatou Sarr', action: 'Dossier consulté', entity: 'Aïcha Diallo', type: 'record', severity: 'info' },
  { id: 'audit-008', time: '08:52', user: 'Admin', action: 'Rôle modifié', entity: 'Mariama Balde', type: 'user', severity: 'warning' },
  { id: 'audit-009', time: '08:40', user: 'Dr. Jean Kouassi', action: 'Téléconsultation démarrée', entity: 'Nadia Benali', type: 'consultation', severity: 'info' },
  { id: 'audit-010', time: '08:30', user: 'Système', action: 'Sauvegarde automatique', entity: 'CHU Saint-Louis', type: 'system', severity: 'success' },
  { id: 'audit-011', time: '08:12', user: 'Dr. Mohamed Sy', action: 'Connexion', entity: 'Session #4872', type: 'auth', severity: 'info' },
  { id: 'audit-012', time: '07:58', user: 'Système', action: 'Alerte taux occupation 86%', entity: 'CHU Saint-Louis', type: 'alert', severity: 'warning' },
];

const severityStyle: Record<string, { icon: string; color: string; bg: string }> = {
  info: { icon: 'InformationCircleIcon', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.08)' },
  success: { icon: 'CheckCircleIcon', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.08)' },
  warning: { icon: 'ExclamationTriangleIcon', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.08)' },
  error: { icon: 'XCircleIcon', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.08)' },
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
};

export default function AuditLog() {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning'>('all');

  const filtered = auditEntries.filter(e => {
    if (filter === 'all') return true;
    return e.severity === filter;
  });

  return (
    <div className="card-base h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Journal d'audit</h2>
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
          {(['all', 'warning', 'error'] as const).map((f) => (
            <button
              key={`af-${f}`}
              onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150"
              style={{
                backgroundColor: filter === f ? 'white' : 'transparent',
                color: filter === f
                  ? f === 'error' ? 'var(--shifa-red)' : f === 'warning' ? 'var(--shifa-amber)' : 'var(--shifa-blue)'
                  : 'var(--muted-foreground)',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {f === 'all' ? 'Tout' : f === 'warning' ? 'Alertes' : 'Erreurs'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ maxHeight: '520px' }}>
        <div className="flex flex-col gap-1.5">
          {filtered.map((entry) => {
            const s = severityStyle[entry.severity];
            const tIcon = typeIcon[entry.type] || 'DocumentTextIcon';
            return (
              <div
                key={entry.id}
                className="flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-150 hover:shadow-shifa cursor-pointer"
                style={{ backgroundColor: s.bg, borderColor: `${s.color}20` }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: 'white', border: `1.5px solid ${s.color}30` }}
                >
                  <Icon name={tIcon as any} size={13} style={{ color: s.color } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>{entry.action}</p>
                    <span className="text-xs shrink-0 font-mono" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{entry.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="font-medium">{entry.user}</span> · {entry.entity}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button className="w-full py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150 hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--shifa-blue)' }}>
          <Icon name="ClipboardDocumentCheckIcon" size={14} className="inline mr-1.5" />
          Voir le journal complet
        </button>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
          Dernière mise à jour: 10 août 2026, 10:28
        </p>
      </div>
    </div>
  );
}