'use client';
import React from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';

export default function LandingCard() {
  const ecosystem = [
    { key: 'patients', label: 'Patients', icon: '👤', href: '/sign-up-login-screen' },
    { key: 'pros', label: 'Professionnels', icon: '🩺', href: '/sign-up-login-screen' },
    { key: 'etabs', label: 'Établissements', icon: '🏥', href: '/sign-up-login-screen' },
    { key: 'institutions', label: 'Institutions', icon: '🏛️', href: '/sign-up-login-screen' },
    { key: 'assurances', label: 'Assurances', icon: '🛡️', href: '/sign-up-login-screen' },
    { key: 'partenaires', label: 'Partenaires', icon: '🤝', href: '/sign-up-login-screen' },
  ];

  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 xl:px-16">
        {/* Ecosystem */}
        <div
          className="rounded-3xl p-6 lg:p-8"
          style={{ background: 'linear-gradient(135deg, #0F2A6B 0%, #0878EF 100%)', boxShadow: '0 16px 48px rgba(8,120,239,0.25)' }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="mb-3">
                <ShifaBrand variant="card" symbolSize={28} />
              </div>
              <h2 className="font-bold text-xl text-white mb-2">Un écosystème complet et connecté</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                SHIFA rassemble tous les acteurs de la santé pour vous offrir une expérience simple, sécurisée et humaine.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-3 gap-3">
                {ecosystem?.map((item) => (
                  <Link
                    key={item?.key}
                    href={item?.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <span className="text-base">{item?.icon}</span>
                    <span className="text-xs font-semibold text-white">{item?.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3 h-3 ml-auto opacity-60">
                      <path strokeLinecap="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
