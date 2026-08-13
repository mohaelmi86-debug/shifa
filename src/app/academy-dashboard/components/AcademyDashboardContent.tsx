'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const courses = [
  { id: 1, title: 'Fondamentaux de la télémédecine', category: 'Télémédecine', progress: 100, duration: '4h 30min', lessons: 12, status: 'completed', cert: true, instructor: 'Dr. Aminata Diallo', level: 'Débutant', color: '#0D9E6E' },
  { id: 2, title: 'Dossier médical électronique — Pratiques avancées', category: 'Informatique médicale', progress: 72, duration: '6h 15min', lessons: 18, status: 'in_progress', cert: false, instructor: 'Pr. Ibrahima Sow', level: 'Intermédiaire', color: '#1558D6' },
  { id: 3, title: 'Pharmacovigilance et sécurité médicamenteuse', category: 'Pharmacologie', progress: 35, duration: '5h 00min', lessons: 15, status: 'in_progress', cert: false, instructor: 'Dr. Fatou Ndiaye', level: 'Avancé', color: '#6D4FC2' },
  { id: 4, title: 'Urgences pédiatriques — Protocoles SHIFA', category: 'Pédiatrie', progress: 0, duration: '3h 45min', lessons: 10, status: 'not_started', cert: false, instructor: 'Dr. Moussa Traoré', level: 'Intermédiaire', color: '#E8900A' },
  { id: 5, title: 'Éthique médicale et consentement éclairé', category: 'Éthique', progress: 0, duration: '2h 30min', lessons: 8, status: 'not_started', cert: false, instructor: 'Pr. Mariama Ba', level: 'Débutant', color: '#0EA5E9' },
];

const certificates = [
  { title: 'Fondamentaux de la télémédecine', date: '2026-07-15', id: 'CERT-SHIFA-2026-TM-0041', valid: true },
  { title: 'Hygiène hospitalière — Niveau 1', date: '2026-05-22', id: 'CERT-SHIFA-2026-HH-0018', valid: true },
  { title: 'Premiers secours et réanimation', date: '2025-11-10', id: 'CERT-SHIFA-2025-PS-0093', valid: false },
];

const categories = ['Tous', 'Télémédecine', 'Informatique médicale', 'Pharmacologie', 'Pédiatrie', 'Éthique'];
const tabs = ['Mes cours', 'Catalogue', 'Certificats', 'Progression'];

const kpis = [
  { label: 'Cours terminés', value: 1, color: '#0D9E6E', bg: 'rgba(13,158,110,0.08)', icon: 'CheckCircleIcon' },
  { label: 'En cours', value: 2, color: '#1558D6', bg: 'rgba(21,88,214,0.08)', icon: 'PlayCircleIcon' },
  { label: 'Certificats', value: 2, color: '#E8900A', bg: 'rgba(232,144,10,0.08)', icon: 'TrophyIcon' },
  { label: 'Heures', value: '22.5h', color: '#6D4FC2', bg: 'rgba(109,79,194,0.08)', icon: 'ClockIcon' },
];

export default function AcademyDashboardContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [activeCourse, setActiveCourse] = useState<number | null>(null);

  const filtered = selectedCat === 'Tous' ? courses : courses.filter(c => c.category === selectedCat);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>

      {/* ── Header ── */}
      <div
        className="px-4 pt-4 pb-3 flex items-center justify-between"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #6D4FC2)' }}
          >
            <Icon name="AcademicCapIcon" size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight" style={{ letterSpacing: '-0.01em' }}>SHIFA Academy</h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Formation médicale continue certifiante</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-sm font-semibold leading-tight">Dr. Mohamed Sy</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Niveau 3 · 1 240 XP</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #6D4FC2)' }}
          >
            MS
          </div>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-4 gap-2.5 px-4 py-3">
        {kpis.map(k => (
          <div
            key={k.label}
            className="rounded-xl p-3 flex flex-col items-center gap-1"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border)' }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.bg }}>
              <Icon name={k.icon as any} size={15} style={{ color: k.color }} />
            </div>
            <p className="text-lg font-bold leading-none" style={{ color: k.color, letterSpacing: '-0.02em' }}>{k.value}</p>
            <p className="text-center leading-tight" style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="px-4">
        <div className="flex gap-0 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className="px-3 py-2.5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap"
              style={{
                borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent',
                color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)',
                fontSize: '13px',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="px-4 py-4">

        {/* Tab 0: Mes cours */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {courses.filter(c => c.status !== 'not_started').map(course => (
              <div
                key={course.id}
                className="rounded-2xl border cursor-pointer transition-all duration-150"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: activeCourse === course.id ? course.color : 'var(--border)',
                  boxShadow: activeCourse === course.id ? `0 2px 12px ${course.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onClick={() => setActiveCourse(activeCourse === course.id ? null : course.id)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: course.color + '14' }}
                    >
                      <Icon name="BookOpenIcon" size={19} style={{ color: course.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm leading-snug" style={{ letterSpacing: '-0.01em' }}>{course.title}</p>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold leading-none" style={{ color: course.color, letterSpacing: '-0.02em' }}>{course.progress}%</p>
                          {course.status === 'completed' && (
                            <span
                              className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: 'rgba(13,158,110,0.10)', color: '#0D9E6E' }}
                            >
                              Terminé ✓
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {course.instructor} · {course.category} · {course.level}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>⏱ {course.duration}</span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>📚 {course.lessons} leçons</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>

                {/* Expanded action */}
                {activeCourse === course.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-95"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.status === 'completed' ? 'Revoir le cours' : 'Continuer le cours →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 1: Catalogue */}
        {activeTab === 1 && (
          <div>
            {/* Category filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap"
                  style={{
                    borderColor: selectedCat === cat ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedCat === cat ? 'var(--primary)' : '#FFFFFF',
                    color: selectedCat === cat ? '#FFFFFF' : 'var(--foreground)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filtered.map(course => (
                <div
                  key={course.id}
                  className="p-3.5 rounded-2xl border transition-all"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: course.color + '14' }}>
                    <Icon name="BookOpenIcon" size={18} style={{ color: course.color }} />
                  </div>
                  <p className="font-semibold text-xs leading-snug mb-1">{course.title}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{course.instructor}</p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: course.color + '14', color: course.color }}
                    >
                      {course.level}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{course.duration}</span>
                  </div>

                  {course.status !== 'not_started' && (
                    <div className="mt-2.5">
                      <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{course.progress}%</p>
                    </div>
                  )}

                  <button
                    className="mt-2.5 w-full text-xs py-1.5 rounded-lg font-semibold transition-all active:scale-95"
                    style={{ backgroundColor: course.color + '14', color: course.color }}
                  >
                    {course.status === 'not_started' ? 'Commencer' : course.status === 'completed' ? 'Revoir' : 'Continuer'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Certificats */}
        {activeTab === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold mb-1">Mes certificats de formation</p>
            {certificates.map((cert, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: cert.valid ? 'rgba(232,144,10,0.25)' : 'var(--border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: cert.valid ? 'rgba(232,144,10,0.10)' : 'var(--muted)' }}
                  >
                    <Icon name="TrophyIcon" size={22} style={{ color: cert.valid ? '#E8900A' : '#A8B5CC' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug">{cert.title}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{cert.id}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Délivré le {cert.date}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: cert.valid ? 'rgba(13,158,110,0.10)' : 'rgba(107,122,153,0.10)',
                        color: cert.valid ? '#0D9E6E' : '#6B7A99',
                      }}
                    >
                      {cert.valid ? 'Valide' : 'Expiré'}
                    </span>
                    {cert.valid && (
                      <button
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium transition-all active:scale-95"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      >
                        <Icon name="ArrowDownTrayIcon" size={12} />
                        PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Progression */}
        {activeTab === 3 && (
          <div className="space-y-3">
            {/* Global progress card */}
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 className="font-semibold text-sm mb-4">Progression globale</h3>
              <div className="flex items-center gap-5">
                {/* Donut */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--muted)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#0EA5E9" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 38 * 0.44} ${2 * Math.PI * 38}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold" style={{ letterSpacing: '-0.02em' }}>44%</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>complété</span>
                  </div>
                </div>
                {/* Per-course bars */}
                <div className="flex-1 space-y-2.5">
                  {courses.map(c => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs truncate max-w-[160px]" style={{ color: 'var(--muted-foreground)' }}>{c.title}</span>
                        <span className="text-xs font-semibold ml-2" style={{ color: c.color }}>{c.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'Rang national', value: '#142', sub: 'Médecins généralistes', icon: 'TrophyIcon', color: '#E8900A', bg: 'rgba(232,144,10,0.08)' },
                { label: 'Points XP', value: '1 240', sub: '+180 ce mois', icon: 'StarIcon', color: '#6D4FC2', bg: 'rgba(109,79,194,0.08)' },
                { label: 'Streak', value: '14j', sub: 'Meilleur : 21j', icon: 'FireIcon', color: '#D93025', bg: 'rgba(217,48,37,0.08)' },
              ].map(s => (
                <div
                  key={s.label}
                  className="p-3 rounded-2xl border text-center"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: s.bg }}>
                    <Icon name={s.icon as any} size={17} style={{ color: s.color }} />
                  </div>
                  <p className="text-base font-bold leading-none" style={{ letterSpacing: '-0.02em' }}>{s.value}</p>
                  <p className="text-xs mt-0.5 font-semibold">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
