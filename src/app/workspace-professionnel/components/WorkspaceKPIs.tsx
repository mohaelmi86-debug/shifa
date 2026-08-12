'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime, useSupabaseCount } from '@/lib/hooks/useSupabaseRealtime';
import { useAuth } from '@/contexts/AuthContext';

const ConsultChart = dynamic(() => import('./ConsultChart'), { ssr: false });

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

export default function WorkspaceKPIs() {
  const { user } = useAuth();

  // Live: today's appointments for this professional
  const todayStr = new Date().toISOString().split('T')[0];
  const { data: todayAppts, loading: l1 } = useSupabaseRealtime({
    table: 'appointments',
    orderBy: { column: 'scheduled_at', ascending: true },
    enabled: true,
  });

  // Live: pending health records (results)
  const { data: pendingRecords, loading: l2 } = useSupabaseRealtime({
    table: 'health_records',
    filter: { is_signed: false },
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
    enabled: true,
  });

  // Counts
  const { count: totalPatients, loading: l3 } = useSupabaseCount('patients');

  const completedToday = todayAppts.filter((a: any) => a.status === 'completed').length;
  const upcomingToday = todayAppts.filter((a: any) => ['scheduled', 'confirmed'].includes(a.status)).length;
  const inProgress = todayAppts.filter((a: any) => a.status === 'in_progress').length;
  const totalToday = todayAppts.length;

  const kpis = [
    {
      key: 'kpi-patients-today',
      label: "Patients aujourd\'hui",
      value: l1 ? '—' : String(totalToday || 0),
      sub: l1 ? 'Chargement...' : `${completedToday} terminés · ${upcomingToday} à venir`,
      icon: 'UsersIcon',
      color: 'var(--shifa-blue)',
      bg: 'rgba(0, 102, 255, 0.06)',
      trend: inProgress > 0 ? `${inProgress} en cours` : 'Aucun en cours',
      trendUp: inProgress > 0,
      loading: l1,
    },
    {
      key: 'kpi-patients-total',
      label: 'Total patients',
      value: l3 ? '—' : String(totalPatients),
      sub: 'Dossiers actifs',
      icon: 'ClipboardDocumentListIcon',
      color: 'var(--shifa-green)',
      bg: 'rgba(16, 185, 129, 0.06)',
      trend: 'Base de données',
      trendUp: true,
      loading: l3,
    },
    {
      key: 'kpi-duree',
      label: 'Durée moy. consultation',
      value: '18',
      sub: 'minutes par patient',
      icon: 'ClockIcon',
      color: 'var(--shifa-purple)',
      bg: 'rgba(123, 94, 167, 0.06)',
      trend: '-2 min vs sem.',
      trendUp: false,
      loading: false,
    },
    {
      key: 'kpi-resultats',
      label: 'Résultats en attente',
      value: l2 ? '—' : String(pendingRecords.length),
      sub: 'Non signés',
      icon: 'BeakerIcon',
      color: 'var(--shifa-red)',
      bg: 'rgba(239, 68, 68, 0.06)',
      trend: pendingRecords.length > 0 ? 'À examiner' : 'Tout à jour',
      trendUp: false,
      alert: pendingRecords.length > 0,
      loading: l2,
    },
    {
      key: 'kpi-rdv-total',
      label: 'RDV programmés',
      value: l1 ? '—' : String(todayAppts.filter((a: any) => ['scheduled', 'confirmed'].includes(a.status)).length),
      sub: 'Confirmés + planifiés',
      icon: 'CalendarDaysIcon',
      color: 'var(--shifa-amber)',
      bg: 'rgba(245, 158, 11, 0.08)',
      trend: 'Temps réel',
      trendUp: true,
      loading: l1,
    },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="card-base flex flex-col gap-3 relative overflow-hidden"
            style={{ backgroundColor: kpi.bg, border: (kpi as any).alert ? `1.5px solid ${kpi.color}40` : '1px solid var(--border)' }}
          >
            {(kpi as any).alert && (
              <div className="absolute top-0 right-0 w-0 h-0" style={{
                borderLeft: '20px solid transparent',
                borderTop: `20px solid ${kpi.color}`,
              }} />
            )}
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'white', border: `1.5px solid ${kpi.color}25` }}>
                <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as any} />
              </div>
              <div className="flex items-center gap-1">
                <Icon name={kpi.trendUp ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'} size={13}
                  style={{ color: kpi.trendUp ? 'var(--shifa-green)' : (kpi as any).alert ? kpi.color : 'var(--shifa-amber)' } as any} />
                <span className="text-xs font-medium" style={{ color: kpi.trendUp ? 'var(--shifa-green)' : (kpi as any).alert ? kpi.color : 'var(--shifa-amber)', fontSize: '10px' }}>
                  {kpi.trend}
                </span>
              </div>
            </div>
            <div>
              {kpi.loading ? (
                <Skeleton className="h-7 w-16 mb-1" />
              ) : (
                <p className="text-2xl font-extrabold font-tabular" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
              )}
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-base mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Activité — 4 dernières semaines</h3>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Consultations par jour</span>
        </div>
        <div className="h-36">
          <ConsultChart />
        </div>
      </div>
    </div>
  );
}