'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { WorkspaceProfile, WorkspaceKPIs, WorkspaceAlert } from '@/lib/supabase/workspaceService';
import { ProfessionConfig } from '@/lib/professionConfig';

interface ProfessionSummaryCardProps {
  profession: ProfessionConfig;
  profile: WorkspaceProfile;
  kpis: WorkspaceKPIs;
  alerts: WorkspaceAlert[];
  onEnterWorkspace: () => void;
}

function KPITile({
  label,
  value,
  icon,
  color,
  sublabel,
}: {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  sublabel?: string;
}) {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-1"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon name={icon as any} size={14} style={{ color }} />
        </div>
      </div>
      <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
        {value}
      </span>
      {sublabel && (
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {sublabel}
        </span>
      )}
    </div>
  );
}

function AlertBanner({ alert }: { alert: WorkspaceAlert }) {
  const colors: Record<string, { bg: string; border: string; icon: string; iconName: string }> = {
    warning: { bg: '#fef9c3', border: '#fde047', icon: '#ca8a04', iconName: 'ExclamationTriangleIcon' },
    info: { bg: '#eff6ff', border: '#93c5fd', icon: '#2563eb', iconName: 'InformationCircleIcon' },
    error: { bg: '#fef2f2', border: '#fca5a5', icon: '#dc2626', iconName: 'XCircleIcon' },
    success: { bg: '#f0fdf4', border: '#86efac', icon: '#16a34a', iconName: 'CheckCircleIcon' },
  };
  const c = colors[alert.type] ?? colors.info;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <Icon name={c.iconName as any} size={16} style={{ color: c.icon, flexShrink: 0, marginTop: 2 }} />
      <span className="flex-1" style={{ color: '#374151' }}>
        {alert.message}
      </span>
      {alert.action && alert.actionHref && (
        <Link
          href={alert.actionHref}
          className="text-xs font-semibold whitespace-nowrap hover:underline"
          style={{ color: c.icon }}
        >
          {alert.action} →
        </Link>
      )}
    </div>
  );
}

function QuickActionButton({
  label,
  icon,
  href,
  color,
}: {
  label: string;
  icon: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-sm hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
      }}
    >
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon name={icon as any} size={13} style={{ color }} />
      </div>
      {label}
    </Link>
  );
}

export default function ProfessionSummaryCard({
  profession,
  profile,
  kpis,
  alerts,
  onEnterWorkspace,
}: ProfessionSummaryCardProps) {
  // Build quick actions from the first 5 modules of the profession
  const quickActions = profession.modules.slice(0, 5).filter(m => m.href);

  // Role-specific KPI tiles
  const kpiTiles = [
    {
      label: "Rendez-vous aujourd\'hui",
      value: kpis.todayAppointments,
      icon: 'CalendarDaysIcon',
      color: profession.color,
      sublabel: `${kpis.pendingAppointments} en attente`,
    },
    {
      label: 'Terminés aujourd\'hui',
      value: kpis.completedToday,
      icon: 'CheckCircleIcon',
      color: '#16a34a',
      sublabel: 'consultations',
    },
    {
      label: 'Téléconsultations',
      value: kpis.teleconsultToday,
      icon: 'VideoCameraIcon',
      color: '#0891b2',
      sublabel: 'aujourd\'hui',
    },
    {
      label: 'Patients suivis',
      value: kpis.totalPatients,
      icon: 'UsersIcon',
      color: '#7c3aed',
      sublabel: 'total',
    },
    {
      label: 'Dossiers récents',
      value: kpis.recentRecords,
      icon: 'FolderOpenIcon',
      color: '#d97706',
      sublabel: '7 derniers jours',
    },
    {
      label: 'Non signés',
      value: kpis.pendingRecords,
      icon: 'PencilSquareIcon',
      color: kpis.pendingRecords > 0 ? '#dc2626' : '#64748b',
      sublabel: 'à valider',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${profession.color}15, ${profession.color}06)`,
          border: `1px solid ${profession.color}30`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${profession.color}22` }}
            >
              <Icon name={profession.icon as any} size={32} style={{ color: profession.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                {profile.isVerified && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                  >
                    <Icon name="ShieldCheckIcon" size={11} />
                    Vérifié
                  </span>
                )}
                {profile.status === 'pending' && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}
                  >
                    En attente
                  </span>
                )}
              </div>
              <p className="text-sm font-medium mt-0.5" style={{ color: profession.color }}>
                {profession.labelFr}
                {profile.specialty && ` · ${profile.specialty}`}
              </p>
              {(profile.organizationName || profile.departmentName || profile.roleTitle) && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  {[profile.roleTitle, profile.departmentName, profile.organizationName]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              {!profile.organizationName && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  Exercice libéral / indépendant
                </p>
              )}
            </div>
          </div>

          {/* Enter workspace CTA */}
          <button
            onClick={onEnterWorkspace}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:-translate-y-0.5 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${profession.color}, ${profession.color}cc)`,
              color: '#fff',
            }}
          >
            <Icon name="Squares2X2Icon" size={16} />
            Accéder aux modules
          </button>
        </div>

        {/* Org / module info row */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${profession.color}20` }}>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${profession.color}12`, color: profession.color }}
          >
            <Icon name="CubeIcon" size={11} />
            {profession.modules.length} modules disponibles
          </div>
          {profile.activatedModuleCodes.length > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
            >
              <Icon name="CheckCircleIcon" size={11} />
              {profile.activatedModuleCodes.length} modules activés par l'établissement
            </div>
          )}
          {profile.organizationName && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              <Icon name="BuildingOffice2Icon" size={11} />
              {profile.organizationName}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          {alerts.map(alert => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* KPI grid */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Indicateurs du jour
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiTiles.map((tile, i) => (
            <KPITile key={i} {...tile} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            Accès rapide
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(mod => (
              <QuickActionButton
                key={mod.id}
                label={mod.label}
                icon={mod.icon}
                href={mod.href!}
                color={profession.color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
