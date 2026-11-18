'use client';
import React from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';

const quickAccess = [
  {
    key: 'rdv',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    label: 'Prendre rendez-vous',
    href: '/appointment-booking',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 'pro',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
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
    key: 'teleconsult',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    label: 'Laboratoires',
    href: '/lab-dashboard',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    key: 'results',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    label: "Résultats d\'analyses",
    href: '/patient-results',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    key: 'docs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    label: 'Documents médicaux',
    href: '/patient-documents',
    color: '#0878EF',
    bg: '#EBF4FF',
  },
  {
    key: 'msg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: 'Messagerie sécurisée',
    href: '/patient-messages',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
];

export default function LandingPaths() {
  return (
    <>
      {/* Accès rapides */}
      <section className="py-8 lg:py-12" style={{ backgroundColor: '#F8FAFF' }}>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
          <h2 className="font-bold text-base mb-5" style={{ color: '#123B86' }}>Accès rapides</h2>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {quickAccess?.map((item) => (
              <Link key={item?.key} href={item?.href} className="flex flex-col items-center gap-2 group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-active:scale-95"
                  style={{ backgroundColor: item?.bg, color: item?.color, boxShadow: '0 2px 8px rgba(8,120,239,0.08)' }}
                >
                  {item?.icon}
                </div>
                <p className="text-xs text-center leading-tight font-medium" style={{ color: '#5F7A9B' }}>
                  {item?.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Votre Carte SHIFA */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 max-w-2xl">
            {/* Card visual */}
            <div
              className="relative rounded-3xl overflow-hidden p-6 w-full max-w-xs shrink-0"
              style={{
                background: 'linear-gradient(135deg, #0F2A6B 0%, #0878EF 60%, #38B6FF 100%)',
                boxShadow: '0 16px 48px rgba(8,120,239,0.3)',
                minHeight: '160px',
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(30%,-30%)' }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(-20%,30%)' }} />
              <div className="relative z-10 flex items-center justify-between mb-6">
                <ShifaBrand variant="card" symbolSize={24} />
                <div className="flex gap-1">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-white font-bold text-base">Aïcha DIALLO</p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>ID : SHF-24-0010-001</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1">
                    {[1,2,3,4]?.map(i => <div key={i} className="w-5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />)}
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-6 h-6">
                      <path strokeLinecap="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-2" style={{ color: '#123B86' }}>Votre Carte SHIFA</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#5F7A9B' }}>
                Votre identité numérique de santé, accessible quand vous en avez besoin.
              </p>
              <Link
                href="/sign-up-login-screen"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm border-2"
                style={{ borderColor: '#0878EF', color: '#0878EF' }}
              >
                Demander ma carte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
