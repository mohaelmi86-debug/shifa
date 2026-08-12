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
    color: 'var(--shifa-blue)',
    bg: 'rgba(0, 102, 255, 0.06)',
    trend: '+4.9%',
    trendUp: true,
  },
  {
    key: 'akpi-professionnels',
    label: 'Professionnels',
    value: '48',
    sub: '3 invitations en attente',
    icon: 'UserGroupIcon',
    color: 'var(--shifa-green)',
    bg: 'rgba(16, 185, 129, 0.06)',
    trend: '+3 ce mois',
    trendUp: true,
  },
  {
    key: 'akpi-consultations',
    label: 'Consultations (mois)',
    value: '1 847',
    sub: '+18% vs mois dernier',
    icon: 'ClipboardDocumentListIcon',
    color: 'var(--shifa-purple)',
    bg: 'rgba(123, 94, 167, 0.06)',
    trend: '+18%',
    trendUp: true,
  },
  {
    key: 'akpi-admissions',
    label: 'Admissions',
    value: '124',
    sub: 'En cours: 18 · Sorties: 12',
    icon: 'BuildingOffice2Icon',
    color: 'var(--shifa-amber)',
    bg: 'rgba(245, 158, 11, 0.06)',
    trend: '+8',
    trendUp: true,
  },
  {
    key: 'akpi-taux',
    label: 'Taux d\'occupation',
    value: '86%',
    sub: 'Seuil d\'alerte: 90%',
    icon: 'ChartBarIcon',
    color: 'var(--shifa-red)',
    bg: 'rgba(239, 68, 68, 0.08)',
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
    color: 'var(--shifa-cyan)',
    bg: 'rgba(0, 242, 195, 0.06)',
    trend: 'Sur 15 total',
    trendUp: true,
  },
];

export default function AdminKPIs() {
  return (
    <div className="mt-6">
      {/* Grid: 6 cards → 3x2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="card-base flex flex-col gap-3 relative overflow-hidden"
            style={{
              backgroundColor: kpi.bg,
              border: (kpi as any).alert ? `1.5px solid ${kpi.color}40` : '1px solid var(--border)',
            }}
          >
            {(kpi as any).alert && (
              <div className="absolute top-0 right-0 w-0 h-0" style={{
                borderLeft: '18px solid transparent',
                borderTop: `18px solid ${kpi.color}`,
              }} />
            )}
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'white', border: `1.5px solid ${kpi.color}25` }}>
                <Icon name={kpi.icon as any} size={16} style={{ color: kpi.color } as any} className="" />
              </div>
            </div>
            <div>
              <p className="text-xl font-extrabold font-tabular" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--foreground)' }}>{kpi.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{kpi.sub}</p>
            </div>
            <div className="flex items-center gap-1">
              <Icon
                name={kpi.trendUp ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'}
                size={11}
                style={{ color: kpi.trendUp ? 'var(--shifa-green)' : (kpi as any).alert ? kpi.color : 'var(--shifa-amber)' } as any}
                className=""
              />
              <span className="text-xs" style={{ color: kpi.trendUp ? 'var(--shifa-green)' : (kpi as any).alert ? kpi.color : 'var(--shifa-amber)', fontSize: '10px' }}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="card-base mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Activité de l'établissement — 4 semaines</h3>
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