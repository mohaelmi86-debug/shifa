'use client';
import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminKPIs from './AdminKPIs';
import UserManagement from './UserManagement';
import ModuleGrid from './ModuleGrid';
import AuditLog from './AuditLog';
import ProfessionalManagement from './ProfessionalManagement';
import Icon from '@/components/ui/AppIcon';

function LiveFacilityMetrics() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { key: 'lits', label: 'Lits occupés', value: `${86 + (tick % 3)}%`, icon: 'BuildingOffice2Icon', color: 'var(--shifa-blue)', alert: false },
    { key: 'urgences', label: 'Urgences actives', value: `${12 + (tick % 4)}`, icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)', alert: true },
    { key: 'bloc', label: 'Bloc opératoire', value: `${2 + (tick % 2)} en cours`, icon: 'ScissorsIcon', color: 'var(--shifa-amber)', alert: false },
    { key: 'attente', label: "File d\'attente", value: `${18 + (tick % 5)} patients`, icon: 'UsersIcon', color: 'var(--shifa-green)', alert: false },
    { key: 'teleconsult', label: 'Téléconsultations', value: `${4 + (tick % 3)} actives`, icon: 'VideoCameraIcon', color: '#7c3aed', alert: false },
    { key: 'alertes', label: 'Alertes système', value: `${tick % 2 === 0 ? 1 : 2}`, icon: 'BellAlertIcon', color: 'var(--shifa-amber)', alert: tick % 2 === 0 },
  ];

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, #0A1E4A 0%, #123B86 60%, #1565D8 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(10,30,74,0.18)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">Métriques en direct</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
          >
            CHU Saint-Louis
          </span>
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Mis à jour il y a quelques secondes</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map(m => (
          <div
            key={m.key}
            className="rounded-xl p-3.5 flex flex-col gap-2"
            style={{
              backgroundColor: 'rgba(255,255,255,0.07)',
              border: m.alert ? `1px solid ${m.color}70` : '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <Icon name={m.icon as any} size={14} style={{ color: m.alert ? m.color : 'rgba(255,255,255,0.8)' } as any} />
              </div>
              {m.alert && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: m.color }} />}
            </div>
            <p className="text-lg font-bold text-white leading-none">{m.value}</p>
            <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminContent() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
        {/* Premium page header strip */}
        <div
          className="rounded-2xl px-5 py-4 mb-6 flex items-center gap-3"
          style={{
            background: 'linear-gradient(90deg, rgba(21,101,216,0.06) 0%, rgba(14,165,233,0.03) 100%)',
            border: '1px solid rgba(21,101,216,0.1)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            <Icon name="BuildingOffice2Icon" size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--shifa-blue)', letterSpacing: '0.08em' }}>
              Administration Établissement
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Gestion complète · CHU Saint-Louis
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#059669' }}>Système opérationnel</span>
          </div>
        </div>

        <AdminHeader />
        <LiveFacilityMetrics />
        <AdminKPIs />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <ProfessionalManagement />
            <UserManagement />
            <ModuleGrid />
          </div>
          <div>
            <AuditLog />
          </div>
        </div>
      </div>
    </div>
  );
}