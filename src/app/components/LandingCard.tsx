'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingCard() {
  return (
    <section className="px-5 py-8" style={{ backgroundColor: '#F8FAFF' }}>
      <div className="max-w-md mx-auto">
        <p className="text-center text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: '#2563EB' }}>
          Carte SHIFA
        </p>

        {/* Card preview */}
        <div
          className="relative rounded-3xl overflow-hidden p-6 mb-5"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1D4ED8 60%, #2563EB 100%)',
            boxShadow: '0 16px 48px rgba(37,99,235,0.3)',
            minHeight: '160px',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%,-30%)' }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(-20%,30%)' }} />

          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AppLogo size={22} />
              <div>
                <p className="text-white font-bold text-xs">SHIFA</p>
                <p className="text-xs font-semibold tracking-widest" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '8px' }}>HEALTH OS</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}>
              <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>Actif</span>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Identité numérique</p>
              <p className="text-white font-bold text-base">Aïcha DIALLO</p>
              <p className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>SH-2-225-FR-2025-7K4D</p>
            </div>
            <div>
              <p className="text-xs mb-1 text-right" style={{ color: 'rgba(255,255,255,0.55)' }}>Groupe</p>
              <p className="text-xl font-extrabold text-white">O+</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-sm mb-5" style={{ color: '#64748B' }}>
          Votre identité numérique de santé — accès sécurisé à votre dossier, partout, à tout moment.
        </p>

        {/* CTA */}
        <Link
          href="/sign-up-login-screen"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
          style={{ backgroundColor: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}
        >
          Demander ma carte SHIFA
        </Link>
      </div>
    </section>
  );
}
