'use client';
import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/i18n';
import { useSupabaseRealtime } from '@/lib/hooks/useSupabaseRealtime';

export default function WorkspaceHeader() {
  const { language } = useLanguage();
  const tr = getTranslations(language);

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
    fr: 'Bonjour, Dr. Sy', en: 'Hello, Dr. Sy', es: 'Hola, Dr. Sy',
    pt: 'Olá, Dr. Sy', ar: 'مرحباً، د. سي', zh: '你好，Sy医生',
  };
  const statusLabels: Record<string, string> = {
    fr: 'En service', en: 'On duty', es: 'En servicio', pt: 'Em serviço', ar: 'في الخدمة', zh: '值班中',
  };

  const queueStats = [
    { key: 'total', icon: 'UsersIcon', value: loadingAppts ? '—' : String(totalCount), label: 'Total', color: 'var(--shifa-blue)', bg: 'rgba(21,101,216,0.08)' },
    { key: 'pending', icon: 'ClockIcon', value: loadingAppts ? '—' : String(pendingCount), label: 'En attente', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
    { key: 'inprogress', icon: 'PlayCircleIcon', value: loadingAppts ? '—' : String(inProgressCount), label: 'En cours', color: 'var(--shifa-blue)', bg: 'rgba(21,101,216,0.08)' },
    { key: 'done', icon: 'CheckCircleIcon', value: loadingAppts ? '—' : String(completedCount), label: 'Terminés', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {tr.today} · CHU Saint-Louis
            </p>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
            {greetings[language] || greetings.fr}
            <span className="text-2xl">👨‍⚕️</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Votre espace de travail clinique — données en temps réel
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status badge */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ backgroundColor: 'rgba(5,150,105,0.06)', borderColor: 'rgba(5,150,105,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#059669' }} />
            <span style={{ color: '#059669', fontWeight: 600 }}>{statusLabels[language] || statusLabels.fr}</span>
          </div>
          {/* Start consultation */}
          <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Icon name="PlayIcon" size={15} />
            <span>Démarrer</span>
          </button>
          {/* Notification bell with pending badge */}
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
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(21,101,216,0.06)' }}
      >
        {/* Header strip */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            background: 'linear-gradient(90deg, rgba(21,101,216,0.06), rgba(14,165,233,0.04))',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold" style={{ color: '#059669', fontFamily: 'var(--font-heading)' }}>
              File de consultation — Temps réel
            </span>
          </div>
          {pendingCount > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.3)' }}
            >
              <Icon name="ExclamationCircleIcon" size={12} style={{ color: '#D97706' } as React.CSSProperties} />
              <span className="text-xs font-bold" style={{ color: '#D97706' }}>
                {pendingCount} consultation{pendingCount > 1 ? 's' : ''} en attente
              </span>
            </div>
          )}
        </div>
        {/* Stats grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {queueStats.map((stat, idx) => (
            <div
              key={stat.key}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderRight: idx < queueStats.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: stat.bg }}
              >
                <Icon name={stat.icon as any} size={17} style={{ color: stat.color } as React.CSSProperties} />
              </div>
              <div>
                <p
                  className="text-xl font-extrabold leading-none font-tabular"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-heading)' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}