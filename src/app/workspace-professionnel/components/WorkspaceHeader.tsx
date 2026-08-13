'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

export default function WorkspaceHeader() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

  // Live queue data
  const { data: todayAppts, loading: loadingAppts } = useSupabaseRealtime({
    table: 'appointments',
    orderBy: { column: 'scheduled_at', ascending: true },
    enabled: true,
  });

  const pendingCount = todayAppts.filter((a: any) => ['scheduled', 'confirmed', 'waiting'].includes(a.status)).length;
  const inProgressCount = todayAppts.filter((a: any) => a.status === 'in_progress').length;
  const completedCount = todayAppts.filter((a: any) => a.status === 'completed').length;
  const totalCount = todayAppts.length;

  const greetings: Record<string, string> = {
    fr: 'Bonjour, Dr. Sy 👨‍⚕️',
    en: 'Hello, Dr. Sy 👨‍⚕️',
    es: 'Hola, Dr. Sy 👨‍⚕️',
    pt: 'Olá, Dr. Sy 👨‍⚕️',
    ar: 'مرحباً، د. سي 👨‍⚕️',
    zh: '你好，Sy医生 👨‍⚕️',
  };

  const statusLabels: Record<string, string> = {
    fr: 'En service', en: 'On duty', es: 'En servicio', pt: 'Em serviço', ar: 'في الخدمة', zh: '值班中',
  };

  const startConsultLabels: Record<string, string> = {
    fr: 'Démarrer', en: 'Start', es: 'Iniciar', pt: 'Iniciar', ar: 'بدء', zh: '开始',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
            {tr.today} · CHU Saint-Louis
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}
          >
            {greetings[language] || greetings.fr}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--shifa-green)' }} />
            <span style={{ color: 'var(--foreground)' }}>{statusLabels[language] || statusLabels.fr}</span>
          </div>
          <button className="btn-primary text-sm px-4 py-2">
            <Icon name="PlayIcon" size={15} />
            {startConsultLabels[language] || startConsultLabels.fr}
          </button>
          <button
            className="relative p-2.5 rounded-xl border transition-colors hover:bg-muted"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Icon name="BellIcon" size={18} className="text-muted-foreground" />
            {pendingCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: 'var(--shifa-red)', fontSize: '10px', padding: '0 4px' }}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Live queue status bar */}
      <div
        className="flex items-center gap-3 flex-wrap rounded-2xl px-4 py-3"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(8,120,239,0.05)',
        }}
      >
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 pr-3" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: '#059669' }}>File en direct</span>
        </div>

        {/* Stats */}
        {[
          {
            key: 'stat-total',
            icon: 'UsersIcon',
            value: loadingAppts ? '—' : String(totalCount),
            label: 'Total',
            color: 'var(--shifa-blue)',
          },
          {
            key: 'stat-pending',
            icon: 'ClockIcon',
            value: loadingAppts ? '—' : String(pendingCount),
            label: 'En attente',
            color: '#D97706',
          },
          {
            key: 'stat-inprogress',
            icon: 'PlayCircleIcon',
            value: loadingAppts ? '—' : String(inProgressCount),
            label: 'En cours',
            color: 'var(--shifa-blue)',
          },
          {
            key: 'stat-done',
            icon: 'CheckCircleIcon',
            value: loadingAppts ? '—' : String(completedCount),
            label: 'Terminés',
            color: '#059669',
          },
        ].map((stat) => (
          <div key={stat.key} className="flex items-center gap-2">
            <Icon name={stat.icon as any} size={14} style={{ color: stat.color } as React.CSSProperties} />
            <span
              className="text-sm font-bold font-tabular"
              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}
            >
              {stat.value}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</span>
            <span className="text-xs" style={{ color: 'var(--border)' }}>·</span>
          </div>
        ))}

        {/* Pending consultations badge */}
        {pendingCount > 0 && (
          <div
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(217,119,6,0.1)',
              border: '1px solid rgba(217,119,6,0.25)',
            }}
          >
            <Icon name="ExclamationCircleIcon" size={13} style={{ color: '#D97706' } as React.CSSProperties} />
            <span className="text-xs font-semibold" style={{ color: '#D97706' }}>
              {pendingCount} consultation{pendingCount > 1 ? 's' : ''} en attente
            </span>
          </div>
        )}
      </div>
    </div>
  );
}