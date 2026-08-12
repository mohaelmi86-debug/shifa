import React from 'react';

import Icon from '@/components/ui/AppIcon';

const features = [
  {
    key: 'feat-securise',
    icon: 'ShieldCheckIcon',
    title: 'Sécurisé',
    desc: 'Vos données sont protégées selon les plus hauts standards RGPD et ISO 27001.',
    color: 'var(--shifa-blue)',
    bg: 'rgba(0, 102, 255, 0.06)',
  },
  {
    key: 'feat-unifie',
    icon: 'UserGroupIcon',
    title: 'Unifié',
    desc: 'Tous vos services de santé connectés en un seul endroit.',
    color: 'var(--shifa-cyan)',
    bg: 'rgba(0, 242, 195, 0.08)',
  },
  {
    key: 'feat-intelligent',
    icon: 'SparklesIcon',
    title: 'Intelligent',
    desc: "L\'IA au service des professionnels et des patients.",
    color: 'var(--shifa-purple)',
    bg: 'rgba(123, 94, 167, 0.08)',
  },
  {
    key: 'feat-accessible',
    icon: 'GlobeAltIcon',
    title: 'Accessible',
    desc: 'Partout, à tout moment, sur tous vos appareils.',
    color: 'var(--shifa-green)',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
];

export default function HeroSection() {
  return (
    <div className="flex flex-col gap-8">
      {/* Tagline */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--shifa-blue)' }}>
          ONE PATIENT · ONE RECORD · ONE ECOSYSTEM
        </p>
        <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--shifa-dark)' }}>
          Votre santé,{' '}
          <span className="text-gradient-primary">notre mission.</span>
        </h1>
        <p className="text-base leading-relaxed max-w-md" style={{ color: 'var(--muted-foreground)' }}>
          SHIFA Health OS connecte tous les acteurs de la santé pour des soins plus sûrs, plus efficaces et plus humains.
        </p>
      </div>

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((f) => (
          <div
            key={f.key}
            className="flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 hover:shadow-shifa"
            style={{ backgroundColor: f.bg, borderColor: 'var(--border)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'white', border: `1.5px solid ${f.color}20` }}
            >
              <Icon name={f.icon as any} size={18} style={{ color: f.color } as any} className="" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: f.color }}>{f.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SHIFA ID badge */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl border"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--shifa-dark), var(--shifa-mid))' }}
        >
          <Icon name="FingerPrintIcon" size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Un patient · Un dossier · Un écosystème</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>La bonne information, au bon moment, pour de meilleurs soins.</p>
        </div>
      </div>

      {/* Hero image placeholder area */}
      <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80" style={{ background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 60%, #0066FF 100%)' }}>
        <div className="blob-primary absolute top-0 left-0 w-64 h-64 rounded-full" />
        <div className="blob-accent absolute bottom-0 right-0 w-48 h-48 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(0,242,195,0.4)' }}>
              <Icon name="HeartIcon" size={36} style={{ color: 'var(--shifa-cyan)' } as any} className="" />
            </div>
            <p className="text-lg font-bold">SHIFA Health OS</p>
            <p className="text-sm opacity-70 mt-1">Votre santé, notre mission</p>
          </div>
        </div>
        {/* Floating stat badges */}
        <div className="absolute top-4 left-4 glass-card rounded-xl px-3 py-2 border" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>128.7M</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Patients</p>
        </div>
        <div className="absolute bottom-4 right-4 glass-card rounded-xl px-3 py-2 border" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--shifa-dark)' }}>67 Pays</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Connectés</p>
        </div>
      </div>
    </div>
  );
}