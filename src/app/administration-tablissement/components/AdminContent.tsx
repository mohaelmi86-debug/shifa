'use client';
import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminKPIs from './AdminKPIs';
import UserManagement from './UserManagement';
import ModuleGrid from './ModuleGrid';
import AuditLog from './AuditLog';
import ProfessionalManagement from './ProfessionalManagement';
import Icon from '@/components/ui/AppIcon';

// Live facility metrics bar
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
    { key: 'attente', label: 'File d\'attente', value: `${18 + (tick % 5)} patients`, icon: 'UsersIcon', color: 'var(--shifa-green)', alert: false },
    { key: 'teleconsult', label: 'Téléconsultations', value: `${4 + (tick % 3)} actives`, icon: 'VideoCameraIcon', color: '#7c3aed', alert: false },
    { key: 'alertes', label: 'Alertes système', value: `${tick % 2 === 0 ? 1 : 2}`, icon: 'BellAlertIcon', color: 'var(--shifa-amber)', alert: tick % 2 === 0 },
  ];

  return (
    <div
      className="rounded-2xl p-4 mb-6"
      style={{
        background: 'linear-gradient(135deg, var(--shifa-dark) 0%, #1a3a6b 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/80">Métriques en direct — CHU Saint-Louis</span>
        </div>
        <span className="text-xs text-white/50">Mis à jour il y a quelques secondes</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map(m => (
          <div
            key={m.key}
            className="rounded-xl p-3 flex flex-col gap-1.5"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: m.alert ? `1px solid ${m.color}60` : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center justify-between">
              <Icon name={m.icon as any} size={14} style={{ color: m.color } as any} className="" />
              {m.alert && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: m.color }} />}
            </div>
            <p className="text-base font-bold text-white leading-none">{m.value}</p>
            <p className="text-xs text-white/50 leading-tight">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto">
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
  );
}