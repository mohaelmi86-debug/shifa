'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';

const AdminActivityChart = dynamic(() => import('./AdminActivityChart'), { ssr: false });

const kpis = [
  {
    key: 'akpi-utilisateurs',
    label: 'Utilisateurs actifs',
    value: '256',
    sub: '+12 ce mois',
    icon: 'UsersIcon',
    color: '#0878EF',
    gradientFrom: '#0878EF',
    gradientTo: '#38B6FF',
    trend: '+4.9%',
    trendUp: true,
  },
  {
    key: 'akpi-professionnels',
    label: 'Professionnels',
    value: '48',
    sub: '3 invitations en attente',
    icon: 'UserGroupIcon',
    color: '#059669',
    gradientFrom: '#059669',
    gradientTo: '#34D399',
    trend: '+3 ce mois',
    trendUp: true,
  },
  {
    key: 'akpi-consultations',
    label: 'Consultations (mois)',
    value: '1 847',
    sub: '+18% vs mois dernier',
    icon: 'ClipboardDocumentListIcon',
    color: '#7C3AED',
    gradientFrom: '#7C3AED',
    gradientTo: '#A78BFA',
    trend: '+18%',
    trendUp: true,
  },
  {
    key: 'akpi-admissions',
    label: 'Admissions',
    value: '124',
    sub: 'En cours: 18 · Sorties: 12',
    icon: 'BuildingOffice2Icon',
    color: '#D97706',
    gradientFrom: '#D97706',
    gradientTo: '#FCD34D',
    trend: '+8',
    trendUp: true,
  },
  {
    key: 'akpi-taux',
    label: "Taux d\'occupation",
    value: '86%',
    sub: "Seuil d\'alerte: 90%",
    icon: 'ChartBarIcon',
    color: '#EF4444',
    gradientFrom: '#EF4444',
    gradientTo: '#FCA5A5',
    trend: '+5% vs sem.',
    trendUp: false,
    alert: true,
  },
  {
    key: 'akpi-modules',
    label: 'Modules actifs',
    value: '12',
    sub: '3 modules disponibles',
    icon: 'PuzzlePieceIcon',
    color: '#0EA5E9',
    gradientFrom: '#0EA5E9',
    gradientTo: '#7DD3FC',
    trend: 'Sur 15 total',
    trendUp: true,
  },
];

export default function AdminKPIs() {
  return (
    <div className="mt-6">
      {/* Premium KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 group transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--card)',
              border: kpi.alert ? `1.5px solid ${kpi.color}50` : '1px solid var(--border)',
              boxShadow: kpi.alert
                ? `0 4px 20px ${kpi.color}20, 0 1px 4px rgba(0,0,0,0.04)`
                : '0 2px 12px rgba(8,120,239,0.06), 0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            {/* Gradient accent bar at top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${kpi.gradientFrom}, ${kpi.gradientTo})` }}
            />

            {/* Alert corner indicator */}
            {kpi.alert && (
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: kpi.color }}
              />
            )}

            {/* Icon with gradient background */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${kpi.gradientFrom}18, ${kpi.gradientTo}10)`,
                border: `1.5px solid ${kpi.gradientFrom}20`,
              }}
            >
              <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color } as React.CSSProperties} />
            </div>

            {/* Value + label */}
            <div className="flex-1">
              <p
                className="text-2xl font-extrabold font-tabular leading-none"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}
              >
                {kpi.value}
              </p>
              <p
                className="text-xs font-semibold mt-1 leading-tight"
                style={{ color: 'var(--foreground)' }}
              >
                {kpi.label}
              </p>
              <p
                className="text-xs mt-0.5 leading-tight"
                style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}
              >
                {kpi.sub}
              </p>
            </div>

            {/* Trend badge */}
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full self-start"
              style={{
                backgroundColor: kpi.trendUp ? 'rgba(5,150,105,0.1)' : `${kpi.color}15`,
                border: `1px solid ${kpi.trendUp ? 'rgba(5,150,105,0.2)' : kpi.color + '25'}`,
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

      {/* Activity chart */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(8,120,239,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}
            >
              Activité de l'établissement
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>4 dernières semaines</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { key: 'leg-consult', color: 'var(--shifa-blue)', label: 'Consultations' },
              { key: 'leg-admissions', color: 'var(--shifa-green)', label: 'Admissions' },
              { key: 'leg-urgences', color: 'var(--shifa-red)', label: 'Urgences' },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: item.color }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-48">
          <AdminActivityChart />
        </div>
      </div>
    </div>
  );
}