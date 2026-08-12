'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const courses = [
  { id: 1, title: 'Fondamentaux de la télémédecine', category: 'Télémédecine', progress: 100, duration: '4h 30min', lessons: 12, status: 'completed', cert: true, instructor: 'Dr. Aminata Diallo', level: 'Débutant', color: '#16a34a' },
  { id: 2, title: 'Dossier médical électronique — Pratiques avancées', category: 'Informatique médicale', progress: 72, duration: '6h 15min', lessons: 18, status: 'in_progress', cert: false, instructor: 'Pr. Ibrahima Sow', level: 'Intermédiaire', color: '#2563eb' },
  { id: 3, title: 'Pharmacovigilance et sécurité médicamenteuse', category: 'Pharmacologie', progress: 35, duration: '5h 00min', lessons: 15, status: 'in_progress', cert: false, instructor: 'Dr. Fatou Ndiaye', level: 'Avancé', color: '#7c3aed' },
  { id: 4, title: 'Urgences pédiatriques — Protocoles SHIFA', category: 'Pédiatrie', progress: 0, duration: '3h 45min', lessons: 10, status: 'not_started', cert: false, instructor: 'Dr. Moussa Traoré', level: 'Intermédiaire', color: '#d97706' },
  { id: 5, title: 'Éthique médicale et consentement éclairé', category: 'Éthique', progress: 0, duration: '2h 30min', lessons: 8, status: 'not_started', cert: false, instructor: 'Pr. Mariama Ba', level: 'Débutant', color: '#0891b2' },
];

const certificates = [
  { title: 'Fondamentaux de la télémédecine', date: '2026-07-15', id: 'CERT-SHIFA-2026-TM-0041', valid: true },
  { title: 'Hygiène hospitalière — Niveau 1', date: '2026-05-22', id: 'CERT-SHIFA-2026-HH-0018', valid: true },
  { title: 'Premiers secours et réanimation', date: '2025-11-10', id: 'CERT-SHIFA-2025-PS-0093', valid: false },
];

const categories = ['Tous', 'Télémédecine', 'Informatique médicale', 'Pharmacologie', 'Pédiatrie', 'Éthique'];

const tabs = ['Mes cours', 'Catalogue', 'Certificats', 'Progression'];

export default function AcademyDashboardContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [activeCourse, setActiveCourse] = useState<number | null>(null);

  const filtered = selectedCat === 'Tous' ? courses : courses.filter(c => c.category === selectedCat);
  const completed = courses.filter(c => c.status === 'completed').length;
  const inProgress = courses.filter(c => c.status === 'in_progress').length;
  const totalHours = 22.5;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>
            <Icon name="AcademicCapIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>SHIFA Academy</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Formation médicale continue certifiante</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold">Dr. Mohamed Sy</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Niveau 3 · 1 240 XP</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #0891b2, #7c3aed)' }}>MS</div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        {[
          { label: 'Cours terminés', value: completed, icon: 'CheckCircleIcon', color: '#16a34a' },
          { label: 'En cours', value: inProgress, icon: 'PlayCircleIcon', color: '#2563eb' },
          { label: 'Certificats obtenus', value: certificates.filter(c => c.valid).length, icon: 'TrophyIcon', color: '#d97706' },
          { label: 'Heures de formation', value: totalHours + 'h', icon: 'ClockIcon', color: '#7c3aed' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: k.color, fontFamily: 'DM Sans, sans-serif' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{ borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent', color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Tab 0: Mes cours */}
        {activeTab === 0 && (
          <div className="space-y-4">
            {courses.filter(c => c.status !== 'not_started').map(course => (
              <div key={course.id} className="p-5 rounded-xl border cursor-pointer hover:shadow-sm transition-all"
                style={{ borderColor: activeCourse === course.id ? course.color : 'var(--border)', backgroundColor: 'var(--card)' }}
                onClick={() => setActiveCourse(activeCourse === course.id ? null : course.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.color + '20' }}>
                      <Icon name="BookOpenIcon" size={20} style={{ color: course.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{course.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{course.instructor} · {course.category} · {course.level}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>⏱ {course.duration}</span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>📚 {course.lessons} leçons</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold" style={{ color: course.color }}>{course.progress}%</p>
                    {course.status === 'completed' && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Terminé ✓</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                </div>
                {activeCourse === course.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: course.color }}>
                      {course.status === 'completed' ? 'Revoir le cours' : 'Continuer le cours →'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 1: Catalogue */}
        {activeTab === 1 && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                  style={{
                    borderColor: selectedCat === cat ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedCat === cat ? 'var(--primary)' : 'transparent',
                    color: selectedCat === cat ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(course => (
                <div key={course.id} className="p-4 rounded-xl border hover:shadow-sm transition-all" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.color + '20' }}>
                      <Icon name="BookOpenIcon" size={20} style={{ color: course.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm leading-tight">{course.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{course.instructor}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border)' }}>{course.level}</span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {course.status !== 'not_started' ? (
                      <div className="flex-1 mr-3">
                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{course.progress}%</p>
                      </div>
                    ) : <div className="flex-1" />}
                    <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: course.color + '20', color: course.color }}>
                      {course.status === 'not_started' ? 'Commencer' : course.status === 'completed' ? 'Revoir' : 'Continuer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Certificats */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Mes certificats de formation</h3>
            {certificates.map((cert, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ borderColor: cert.valid ? '#d97706' : 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cert.valid ? '#fef3c7' : 'var(--muted)' }}>
                      <Icon name="TrophyIcon" size={24} style={{ color: cert.valid ? '#d97706' : '#94a3b8' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cert.title}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>{cert.id}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Délivré le {cert.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cert.valid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cert.valid ? 'Valide' : 'Expiré'}
                    </span>
                    {cert.valid && (
                      <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                        <Icon name="ArrowDownTrayIcon" size={12} />
                        Télécharger
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
          <div className="space-y-4">
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold mb-4 text-sm">Progression globale</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--muted)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0891b2" strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.44} ${2 * Math.PI * 40}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>44%</span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>complété</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {courses.map(c => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs truncate max-w-[200px]">{c.title}</span>
                        <span className="text-xs font-medium ml-2" style={{ color: c.color }}>{c.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Rang national', value: '#142', sub: 'Parmi les médecins généralistes', icon: 'TrophyIcon', color: '#d97706' },
                { label: 'Points XP', value: '1 240', sub: '+180 ce mois', icon: 'StarIcon', color: '#7c3aed' },
                { label: 'Streak actuel', value: '14 jours', sub: 'Meilleur : 21 jours', icon: 'FireIcon', color: '#dc2626' },
              ].map(s => (
                <div key={s.label} className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <Icon name={s.icon as any} size={24} style={{ color: s.color }} className="mx-auto mb-2" />
                  <p className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.value}</p>
                  <p className="text-xs mt-0.5 font-medium">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
