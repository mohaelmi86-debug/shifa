'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { useSupabaseRealtime, useSupabaseCount } from '@/lib/hooks/useSupabaseRealtime';

const ConsultChart = dynamic(() => import('./ConsultChart'), { ssr: false });

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

interface KPI {
  key: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  trend: string;
  trendUp: boolean;
  loading: boolean;
  liveIndicator?: boolean;
  alert?: boolean;
}

export default function WorkspaceKPIs() {
  const { data: todayAppts, loading: l1 } = useSupabaseRealtime({
    table: 'appointments',
    orderBy: { column: 'scheduled_at', ascending: true },
    enabled: true,
  });

  const { data: pendingRecords, loading: l2 } = useSupabaseRealtime({
    table: 'health_records',
    filter: { is_signed: false },
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
    enabled: true,
  });

  const { count: totalPatients, loading: l3 } = useSupabaseCount('patients');

  const completedToday = todayAppts.filter((a: any) => a.status === 'completed').length;
  const upcomingToday = todayAppts.filter((a: any) => ['scheduled', 'confirmed'].includes(a.status)).length;
  const inProgress = todayAppts.filter((a: any) => a.status === 'in_progress').length;
  const totalToday = todayAppts.length;
  const pendingConsultations = todayAppts.filter((a: any) => ['scheduled', 'confirmed', 'waiting'].includes(a.status)).length;

  const kpis: KPI[] = [
    {
      key: 'kpi-patients-today',
      label: "Patients aujourd'hui",
      value: l1 ? '—' : String(totalToday || 0),
      sub: l1 ? 'Chargement...' : `${completedToday} terminés · ${upcomingToday} à venir`,
      icon: 'UsersIcon',
      color: '#1565D8',
      gradientFrom: '#1565D8',
      gradientTo: '#38B6FF',
      trend: inProgress > 0 ? `${inProgress} en cours` : 'Aucun en cours',
      trendUp: inProgress > 0,
      loading: l1,
      liveIndicator: true,
    },
    {
      key: 'kpi-pending-consult',
      label: 'Consultations en attente',
      value: l1 ? '—' : String(pendingConsultations),
      sub: 'Planifiées + confirmées',
      icon: 'ClockIcon',
      color: '#D97706',
      gradientFrom: '#D97706',
      gradientTo: '#FCD34D',
      trend: pendingConsultations > 5 ? 'File chargée' : 'File normale',
      trendUp: pendingConsultations <= 5,
      loading: l1,
      alert: pendingConsultations > 5,
    },
    {
      key: 'kpi-patients-total',
      label: 'Total patients',
      value: l3 ? '—' : String(totalPatients),
      sub: 'Dossiers actifs',
      icon: 'ClipboardDocumentListIcon',
      color: '#059669',
      gradientFrom: '#059669',
      gradientTo: '#34D399',
      trend: 'Base de données',
      trendUp: true,
      loading: l3,
    },
    {
      key: 'kpi-duree',
      label: 'Durée moy. consultation',
      value: '18',
      sub: 'minutes par patient',
      icon: 'ChartBarIcon',
      color: '#7C3AED',
      gradientFrom: '#7C3AED',
      gradientTo: '#A78BFA',
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
      color: '#EF4444',
      gradientFrom: '#EF4444',
      gradientTo: '#FCA5A5',
      trend: pendingRecords.length > 0 ? 'À examiner' : 'Tout à jour',
      trendUp: pendingRecords.length === 0,
      alert: pendingRecords.length > 0,
      loading: l2,
    },
  ];

  return (
    <div className="mt-6">
      {/* Premium KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{
              background: 'var(--card)',
              border: kpi.alert ? `1.5px solid ${kpi.color}40` : '1px solid var(--border)',
              boxShadow: kpi.alert
                ? `0 4px 20px ${kpi.color}18, 0 1px 4px rgba(0,0,0,0.04)`
                : '0 2px 12px rgba(21,101,216,0.05), 0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            {/* Gradient accent bar top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${kpi.gradientFrom}, ${kpi.gradientTo})` }}
            />

            {/* Alert pulse dot */}
            {kpi.alert && (
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: kpi.color }}
              />
            )}

            {/* Icon + live badge row */}
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${kpi.gradientFrom}18, ${kpi.gradientTo}10)`,
                  border: `1.5px solid ${kpi.gradientFrom}22`,
                }}
              >
                <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as React.CSSProperties} />
              </div>
              {kpi.liveIndicator && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold" style={{ color: '#059669', fontSize: '10px' }}>Live</span>
                </div>
              )}
            </div>

            {/* Value + label */}
            <div>
              {kpi.loading ? (
                <Skeleton className="h-7 w-16 mb-1" />
              ) : (
                <p
                  className="text-2xl font-extrabold leading-none"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}
                >
                  {kpi.value}
                </p>
              )}
              <p className="text-xs font-semibold mt-1.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{kpi.sub}</p>
            </div>

            {/* Trend badge */}
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full self-start"
              style={{
                backgroundColor: kpi.trendUp ? 'rgba(5,150,105,0.1)' : `${kpi.color}14`,
                border: `1px solid ${kpi.trendUp ? 'rgba(5,150,105,0.2)' : kpi.color + '22'}`,
              }}
            >
              <Icon
                name={kpi.trendUp ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'}
                size={10}
                style={{ color: kpi.trendUp ? '#059669' : kpi.color } as React.CSSProperties}
              />
              <span
                className="font-semibold"
                style={{ color: kpi.trendUp ? '#059669' : kpi.color, fontSize: '10px' }}
              >
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity chart card */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(21,101,216,0.05)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}
            >
              Activité — 4 dernières semaines
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Consultations par jour</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--shifa-green)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Temps réel</span>
          </div>
        </div>
        <div className="h-36">
          <ConsultChart />
        </div>
      </div>
    </div>
  );
}