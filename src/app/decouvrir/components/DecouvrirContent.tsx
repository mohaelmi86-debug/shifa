'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';

import { useLanguage } from '@/contexts/LanguageContext';

const quickServices = [
  {
    key: 'pro',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Trouver un professionnel',
    href: '/patient-explorer',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 'rdv',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    label: 'Prendre rendez-vous',
    href: '/appointment-booking',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 'teleconsult',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: 'Téléconsultation',
    href: '/patient-teleconsultation',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    key: 'pharma',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
    label: 'Pharmacies',
    href: '/pharmacy-dashboard',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    key: 'lab',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    label: 'Laboratoires',
    href: '/lab-dashboard',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    key: 'more',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    label: 'Plus de services',
    href: '/health-marketplace',
    color: '#5F7A9B',
    bg: '#F0F4FA',
  },
];

const nearbyPros = [
  {
    key: 'p1',
    name: 'Dr. Amina Koné',
    specialty: 'Médecine générale',
    distance: '800 m',
    rating: 4.8,
    reviews: 105,
    available: true,
    avatar: 'AK',
    color: '#0878EF',
  },
  {
    key: 'p2',
    name: 'Centre Médical Lumière',
    specialty: 'Polyclinique',
    distance: '1,2 km',
    rating: 4.5,
    reviews: 98,
    available: true,
    avatar: 'CL',
    color: '#10B981',
  },
  {
    key: 'p3',
    name: 'Pharmacie du Marché',
    specialty: 'Pharmacie',
    distance: '1,4 km',
    rating: 4.7,
    reviews: 54,
    available: true,
    avatar: 'PM',
    color: '#7C3AED',
  },
];

const shifaCardData = {
  name: 'Aïcha DIALLO',
  id: 'SHF-24-0010-001',
};

export default function DecouvrirContent() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFF' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 gap-3 bg-white"
        style={{ borderBottom: '1px solid #E8EFF8', boxShadow: '0 1px 8px rgba(8,120,239,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <ShifaBrand variant="compact" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: '#F0F4FA' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5" style={{ color: '#5F7A9B' }}>
              <path strokeLinecap="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs font-medium" style={{ color: '#5F7A9B' }}>Moroni, Comores</span>
          </div>
          <Link
            href="/patient-notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: '#F0F4FA' }}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" style={{ color: '#5F7A9B' }}>
              <path strokeLinecap="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
          </Link>
        </div>
      </header>
      <div className="px-4 pt-5 pb-28 max-w-2xl mx-auto">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9AAAC0' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            placeholder="Rechercher un professionnel, spécialité, établissement..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 bg-white"
            style={{
              color: '#123B86',
              boxShadow: '0 2px 12px rgba(8,120,239,0.10)',
              border: '1.5px solid #E8EFF8',
            }}
            aria-label="Rechercher un professionnel ou service de santé"
          />
        </div>

        {/* Services populaires */}
        <section className="mb-7">
          <h2 className="text-sm font-bold mb-4" style={{ color: '#123B86' }}>Services populaires</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickServices?.map((s) => (
              <Link
                key={s?.key}
                href={s?.href}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border transition-all active:scale-95"
                style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 6px rgba(8,120,239,0.05)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: s?.bg, color: s?.color }}
                >
                  {s?.icon}
                </div>
                <p className="text-xs text-center font-medium leading-tight" style={{ color: '#5F7A9B' }}>{s?.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Accès Carte SHIFA */}
        <section className="mb-7">
          <div
            className="relative rounded-2xl overflow-hidden p-4 flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #0F2A6B 0%, #0878EF 100%)', boxShadow: '0 8px 24px rgba(8,120,239,0.25)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(30%,-30%)' }} />
            <div
              className="relative z-10 rounded-xl p-3 shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-8 h-8">
                <path strokeLinecap="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-white font-bold text-sm">{shifaCardData?.name}</p>
              <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>ID : {shifaCardData?.id}</p>
            </div>
            <Link
              href="/shifa-card"
              className="relative z-10 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Voir
            </Link>
          </div>
          <Link
            href="/shifa-card"
            className="mt-3 w-full flex items-center justify-center py-3 rounded-2xl text-sm font-semibold border-2 bg-white"
            style={{ borderColor: '#0878EF', color: '#0878EF' }}
          >
            Demander ma carte
          </Link>
        </section>

        {/* À proximité */}
        <section className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold" style={{ color: '#123B86' }}>À proximité</h2>
            <Link href="/patient-explorer" className="text-xs font-semibold" style={{ color: '#0878EF' }}>Voir tout</Link>
          </div>
          <div className="flex flex-col gap-3">
            {nearbyPros?.map((pro) => (
              <Link
                key={pro?.key}
                href="/appointment-booking"
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border transition-all active:scale-[0.98]"
                style={{ borderColor: '#E8EFF8', boxShadow: '0 1px 6px rgba(8,120,239,0.05)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: pro?.color }}
                >
                  {pro?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#123B86' }}>{pro?.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#5F7A9B' }}>{pro?.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" style={{ color: '#F59E0B' }}>
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold" style={{ color: '#123B86' }}>{pro?.rating}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#9AAAC0' }}>({pro?.reviews} avis)</span>
                    <span className="text-xs" style={{ color: '#9AAAC0' }}>·</span>
                    <span className="text-xs" style={{ color: '#5F7A9B' }}>{pro?.distance}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {pro?.available && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
                      Disponible
                    </span>
                  )}
                  <span className="text-xs font-semibold" style={{ color: '#0878EF' }}>Consulter</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
