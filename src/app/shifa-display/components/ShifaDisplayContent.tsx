'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QueueEntry {
  number: string;
  service: string;
  room: string;
  status: 'calling' | 'waiting' | 'done';
}

const initialQueue: QueueEntry[] = [
  { number: 'A-041', service: 'Médecine interne', room: 'Salle 3', status: 'calling' },
  { number: 'B-018', service: 'Chirurgie', room: 'Salle 7', status: 'calling' },
  { number: 'A-042', service: 'Médecine interne', room: 'Salle 3', status: 'waiting' },
  { number: 'C-005', service: 'Pédiatrie', room: 'Salle 12', status: 'waiting' },
  { number: 'A-043', service: 'Médecine interne', room: 'Salle 3', status: 'waiting' },
  { number: 'B-019', service: 'Chirurgie', room: 'Salle 7', status: 'waiting' },
];

const announcements = [
  'Rappel : Veuillez éteindre votre téléphone dans les zones de soins.',
  'SHIFA Health OS — Votre santé, notre priorité.',
  'Lavez-vous les mains régulièrement pour votre protection et celle des autres.',
  'En cas d\'urgence, signalez-vous immédiatement à l\'accueil.',
];

export default function ShifaDisplayContent() {
  const [displayMode, setDisplayMode] = useState<'admin' | 'display'>('admin');
  const [queue] = useState<QueueEntry[]>(initialQueue);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex(i => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (displayMode === 'admin') {
    return (
      <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}>
                <Icon name="TvIcon" size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA Display</h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Affichage salle d'attente — file d'attente, appels patients, annonces</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDisplayMode('display')}
              className="btn-primary text-sm px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Icon name="TvIcon" size={16} />
              Aperçu affichage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Active calls */}
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Appels en cours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queue.filter(q => q.status === 'calling').map(entry => (
                  <div key={entry.number} className="p-4 rounded-2xl text-white text-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    <p className="text-xs font-semibold opacity-80 mb-1">APPELÉ</p>
                    <p className="text-4xl font-bold">{entry.number}</p>
                    <p className="text-sm mt-1 opacity-90">{entry.service}</p>
                    <p className="text-xs mt-0.5 opacity-80">{entry.room}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue */}
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>File d'attente</h3>
              <div className="space-y-2">
                {queue.filter(q => q.status === 'waiting').map((entry, i) => (
                  <div key={entry.number} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>{i + 1}</span>
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{entry.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{entry.service}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Config */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Écrans connectés</h3>
              <div className="space-y-2">
                {[
                  { id: 'DISP-01', location: 'Salle d\'attente principale', status: 'online' },
                  { id: 'DISP-02', location: 'Couloir consultations', status: 'online' },
                  { id: 'DISP-03', location: 'Urgences', status: 'offline' },
                ].map(screen => (
                  <div key={screen.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{screen.id}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{screen.location}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs" style={{ color: screen.status === 'online' ? '#16a34a' : '#dc2626' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: screen.status === 'online' ? '#16a34a' : '#dc2626' }} />
                      {screen.status === 'online' ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Annonces</h3>
              <div className="space-y-2">
                {announcements.map((ann, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name="MegaphoneIcon" size={14} style={{ color: 'var(--shifa-blue)', marginTop: 2 } as any} />
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{ann}</p>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full text-sm py-2 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                + Ajouter une annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen display simulation
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a1628', color: 'white' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            <Icon name="TvIcon" size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">SHIFA Display</p>
            <p className="text-xs opacity-60">CHU Saint-Louis — Salle d'attente principale</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold font-mono">{currentTime}</p>
          <button
            onClick={() => setDisplayMode('admin')}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/20 opacity-60 hover:opacity-100 transition-opacity"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calling now */}
        <div>
          <p className="text-xs font-semibold tracking-widest mb-4 opacity-60">APPEL EN COURS</p>
          <div className="space-y-4">
            {queue.filter(q => q.status === 'calling').map(entry => (
              <div key={entry.number} className="rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.3), rgba(0,242,195,0.2))', border: '1px solid rgba(0,102,255,0.4)' }}>
                <p className="text-7xl font-black tracking-tight" style={{ color: 'var(--shifa-cyan)' }}>{entry.number}</p>
                <p className="text-xl font-semibold mt-2">{entry.service}</p>
                <p className="text-sm opacity-70 mt-1">{entry.room}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Waiting queue */}
        <div>
          <p className="text-xs font-semibold tracking-widest mb-4 opacity-60">FILE D'ATTENTE</p>
          <div className="space-y-2">
            {queue.filter(q => q.status === 'waiting').slice(0, 6).map((entry, i) => (
              <div key={entry.number} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-40 w-4">{i + 1}</span>
                  <p className="text-xl font-bold">{entry.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">{entry.service}</p>
                  <p className="text-xs opacity-50">{entry.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcement ticker */}
      <div className="px-8 py-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,102,255,0.15)' }}>
        <Icon name="MegaphoneIcon" size={16} style={{ color: 'var(--shifa-cyan)', flexShrink: 0 } as any} />
        <p className="text-sm opacity-80 transition-all">{announcements[announcementIndex]}</p>
      </div>
    </div>
  );
}
