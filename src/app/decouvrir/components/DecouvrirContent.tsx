'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const specialties = [
  { icon: '🫀', label: 'Cardiologie', href: '/cardiology-workspace' },
  { icon: '🧠', label: 'Neurologie', href: '/neurology-workspace' },
  { icon: '👶', label: 'Pédiatrie', href: '/pediatrics-workspace' },
  { icon: '🦷', label: 'Dentaire', href: '/dental-care' },
  { icon: '👁️', label: 'Ophtalmologie', href: '/ophthalmology' },
  { icon: '🩺', label: 'Généraliste', href: '/appointment-booking' },
  { icon: '🤰', label: 'Gynécologie', href: '/gynecology-workspace' },
  { icon: '🦴', label: 'Orthopédie', href: '/orthopedics-workspace' },
  { icon: '🫁', label: 'Pneumologie', href: '/pneumology-workspace' },
  { icon: '🧬', label: 'Oncologie', href: '/pro-oncology' },
  { icon: '🧪', label: 'Laboratoire', href: '/lab-dashboard' },
  { icon: '💊', label: 'Pharmacie', href: '/pharmacy-dashboard' },
];

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Trouver un professionnel',
    desc: 'Près de chez vous',
    href: '/patient-explorer',
    color: '#1A73E8',
    bg: '#EBF3FF',
    available: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: 'Téléconsultation',
    desc: 'Consultation à distance',
    href: '/patient-teleconsultation',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    available: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    label: 'Laboratoire',
    desc: 'Analyses & résultats',
    href: '/lab-dashboard',
    color: '#7B5EA7',
    bg: '#F3F0FF',
    available: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    label: 'Urgences',
    desc: 'Informations & contacts',
    href: '/patient-emergency',
    color: '#EF4444',
    bg: '#FEF2F2',
    available: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    label: 'Pharmacie',
    desc: 'Médicaments & ordonnances',
    href: '/pharmacy-dashboard',
    color: '#10B981',
    bg: '#ECFDF5',
    available: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    ),
    label: 'Imagerie médicale',
    desc: 'Radio, IRM, Scanner',
    href: '/imaging-dashboard',
    color: '#F59E0B',
    bg: '#FFFBEB',
    available: false,
  },
];

export default function DecouvrirContent() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const headings: Record<string, { title: string; sub: string }> = {
    fr: { title: 'Votre santé, simplement.', sub: 'Trouvez les soins dont vous avez besoin, où que vous soyez.' },
    en: { title: 'Your health, simply.', sub: 'Find the care you need, wherever you are.' },
    ar: { title: 'صحتك، ببساطة.', sub: 'اعثر على الرعاية التي تحتاجها، أينما كنت.' },
    es: { title: 'Tu salud, simplemente.', sub: 'Encuentra la atención que necesitas, donde estés.' },
    pt: { title: 'A sua saúde, simplesmente.', sub: 'Encontre os cuidados de que precisa, onde quer que esteja.' },
    zh: { title: '您的健康，简单明了。', sub: '无论身在何处，找到您需要的医疗服务。' },
  };

  const h = headings[language] || headings.fr;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 gap-3"
        style={{
          backgroundColor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 1px 8px rgba(26,115,232,0.06)',
        }}
      >
        <ShifaBrand variant="compact" />
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <Link
            href="/support-center"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-muted"
            style={{ color: 'var(--shifa-gray)' }}
            aria-label="Aide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
              <path strokeLinecap="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="px-4 pt-6 pb-28 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold leading-tight mb-2" style={{ color: 'var(--shifa-dark)' }}>
            {h.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--shifa-gray)' }}>{h.sub}</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--shifa-gray)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Médecin, spécialité, établissement..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm border-0 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              boxShadow: '0 2px 16px rgba(26,115,232,0.10)',
              focusRingColor: 'var(--shifa-blue)',
            }}
            aria-label="Rechercher un professionnel ou service de santé"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href="/patient-explorer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95"
            style={{ backgroundColor: 'var(--shifa-blue)', color: 'white', boxShadow: '0 4px 16px rgba(26,115,232,0.25)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Trouver un professionnel</p>
              <p className="text-xs opacity-80 mt-0.5">Près de chez vous</p>
            </div>
          </Link>
          <Link
            href="/appointment-booking"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', boxShadow: '0 2px 8px rgba(26,115,232,0.06)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--secondary)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--shifa-dark)' }}>Planifier</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>Prendre rendez-vous</p>
            </div>
          </Link>
        </div>

        {/* Services */}
        <section className="mb-8" aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-base font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>
            Services SHIFA
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98]"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 6px rgba(26,115,232,0.05)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: service.bg, color: service.color }}
                >
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--shifa-dark)' }}>{service.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-gray)' }}>{service.desc}</p>
                </div>
                {!service.available && (
                  <span className="badge-preparation shrink-0">En préparation</span>
                )}
                {service.available && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0" style={{ color: 'var(--shifa-gray)' }}>
                    <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Specialties */}
        <section aria-labelledby="specialties-heading">
          <h2 id="specialties-heading" className="text-base font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>
            Spécialités médicales
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {specialties.map((spec) => (
              <Link
                key={spec.label}
                href={spec.href}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all active:scale-95"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <span className="text-2xl" role="img" aria-hidden="true">{spec.icon}</span>
                <span className="text-xs font-medium leading-tight" style={{ color: 'var(--shifa-dark)' }}>{spec.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
