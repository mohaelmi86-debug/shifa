'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ScheduledSession {
  id: string;
  patient: string;
  avatar: string;
  time: string;
  duration: string;
  type: 'video' | 'audio';
  status: 'waiting' | 'scheduled' | 'in_progress' | 'completed';
  reason: string;
  waitTime?: number;
}

const sessions: ScheduledSession[] = [
  { id: 's1', patient: 'Aïcha Diallo', avatar: 'AD', time: '09:00', duration: '20 min', type: 'video', status: 'waiting', reason: 'Suivi diabète type 2', waitTime: 8 },
  { id: 's2', patient: 'Kwame Asante', avatar: 'KA', time: '09:30', duration: '15 min', type: 'video', status: 'waiting', reason: 'Renouvellement ordonnance HTA', waitTime: 3 },
  { id: 's3', patient: 'Nadia Benali', avatar: 'NB', time: '10:00', duration: '30 min', type: 'audio', status: 'scheduled', reason: 'Consultation prénatale — 28 SA' },
  { id: 's4', patient: 'Pierre Dubois', avatar: 'PD', time: '10:30', duration: '20 min', type: 'video', status: 'scheduled', reason: 'Suivi asthme' },
  { id: 's5', patient: 'Isabelle Fontaine', avatar: 'IF', time: '11:00', duration: '15 min', type: 'video', status: 'scheduled', reason: 'Résultats thyroïde' },
  { id: 's6', patient: 'Mamadou Traoré', avatar: 'MT', time: '11:30', duration: '20 min', type: 'audio', status: 'scheduled', reason: 'Fièvre persistante — 3 jours' },
];

const statusConfig = {
  waiting: { label: 'En salle d\'attente', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.1)' },
  scheduled: { label: 'Planifié', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  in_progress: { label: 'En cours', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.1)' },
  completed: { label: 'Terminé', color: 'var(--muted-foreground)', bg: 'rgba(0,0,0,0.05)' },
};

export default function TeleconsultationLobbyContent() {
  const [filter, setFilter] = useState<'all' | 'waiting' | 'scheduled'>('all');

  const waiting = sessions.filter(s => s.status === 'waiting');
  const filtered = sessions.filter(s => filter === 'all' ? true : s.status === filter);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Lobby Téléconsultation</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gérez vos sessions de téléconsultation du jour</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/teleconsultation-waiting" className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-2">
            <Icon name="UsersIcon" size={16} />
            Salle d'attente
          </Link>
          <Link href="/teleconsultation-session" className="btn-primary text-sm px-4 py-2.5 flex items-center gap-2">
            <Icon name="VideoCameraIcon" size={16} />
            Démarrer session
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sessions aujourd\'hui', value: sessions.length, icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
          { label: 'En attente', value: waiting.length, icon: 'ClockIcon', color: 'var(--shifa-amber)' },
          { label: 'Terminées', value: sessions.filter(s => s.status === 'completed').length, icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
          { label: 'Attente moy.', value: `${Math.round(waiting.reduce((a, s) => a + (s.waitTime || 0), 0) / Math.max(waiting.length, 1))} min`, icon: 'ChartBarIcon', color: 'var(--shifa-cyan)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base flex items-center gap-4 py-4 px-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${kpi.color}18` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Waiting alert */}
      {waiting.length > 0 && (
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3 border" style={{ backgroundColor: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
            <Icon name="BellAlertIcon" size={18} style={{ color: 'var(--shifa-amber)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--shifa-amber)' }}>
              {waiting.length} patient{waiting.length > 1 ? 's' : ''} en salle d'attente
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {waiting[0].patient} attend depuis {waiting[0].waitTime} min
            </p>
          </div>
          <Link href="/teleconsultation-session" className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5">
            <Icon name="PlayIcon" size={14} />
            Démarrer
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'waiting', 'scheduled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'text-white' : ''}`}
            style={filter === f ? { backgroundColor: 'var(--shifa-blue)', color: '#fff' } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
          >
            {f === 'all' ? 'Toutes' : f === 'waiting' ? 'En attente' : 'Planifiées'}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {filtered.map((session) => {
          const sc = statusConfig[session.status];
          return (
            <div key={session.id} className="card-base flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                {session.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{session.patient}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ color: sc.color, backgroundColor: sc.bg }}>
                    {sc.label}
                  </span>
                  {session.waitTime && (
                    <span className="text-xs" style={{ color: 'var(--shifa-amber)' }}>⏱ {session.waitTime} min d'attente</span>
                  )}
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>{session.reason}</p>
              </div>

              {/* Time & type */}
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{session.time}</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Icon name={session.type === 'video' ? 'VideoCameraIcon' : 'PhoneIcon'} size={12} className="text-muted-foreground" />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{session.duration}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {session.status === 'waiting' && (
                  <Link href="/teleconsultation-session"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                    style={{ backgroundColor: 'var(--shifa-green)' }}>
                    <Icon name="PlayIcon" size={13} />
                    Rejoindre
                  </Link>
                )}
                {session.status === 'scheduled' && (
                  <Link href="/teleconsultation-session"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                    <Icon name="VideoCameraIcon" size={13} />
                    Préparer
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick setup card */}
      <div className="mt-6 card-base p-5 border-dashed" style={{ borderColor: 'var(--shifa-blue)', borderWidth: '1.5px' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
            <Icon name="Cog6ToothIcon" size={24} style={{ color: 'var(--shifa-blue)' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Configuration de la session</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Vérifiez votre caméra, microphone et connexion avant de démarrer</p>
          </div>
          <Link href="/teleconsultation-session"
            className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <Icon name="WrenchScrewdriverIcon" size={15} />
            Tester
          </Link>
        </div>
      </div>
    </div>
  );
}
