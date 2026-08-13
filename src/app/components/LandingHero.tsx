'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingHero() {
  return (
    <section className="px-5 pt-10 pb-8 bg-white">
      <div className="max-w-md mx-auto flex flex-col items-center text-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <AppLogo size={40} />
          <div className="text-left">
            <p className="text-xl font-extrabold tracking-tight" style={{ color: '#0F172A', letterSpacing: '-0.03em' }}>SHIFA</p>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#2563EB', fontSize: '9px' }}>HEALTH OS</p>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1
            className="font-extrabold leading-tight mb-3"
            style={{ fontSize: '28px', color: '#0F172A', letterSpacing: '-0.03em' }}
          >
            Votre santé,{' '}
            <span style={{ color: '#2563EB' }}>simplement.</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#64748B', maxWidth: '280px', margin: '0 auto' }}>
            Dossier médical, rendez-vous, téléconsultation — tout en un, sécurisé et accessible partout.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/sign-up-login-screen"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all active:scale-95"
            style={{ backgroundColor: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
          >
            Se connecter
          </Link>
          <Link
            href="/sign-up-login-screen"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 border-2"
            style={{ borderColor: '#2563EB', color: '#2563EB', backgroundColor: 'transparent' }}
          >
            Créer un compte
          </Link>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: '#F0F7FF', border: '1px solid #DBEAFE' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
          <span className="text-xs font-medium" style={{ color: '#1E40AF' }}>Certifié RGPD · ISO 27001 · FHIR</span>
        </div>
      </div>
    </section>
  );
}
