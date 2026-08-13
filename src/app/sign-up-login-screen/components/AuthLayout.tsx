'use client';
import React from 'react';
import Link from 'next/link';
import ShifaBrand from '@/components/ui/ShifaBrand';
import LanguageSelector from '@/components/ui/LanguageSelector';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8FAFF' }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1E4A 0%, #0878EF 65%, #38B6FF 100%)' }}
      >
        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="absolute -bottom-24 right-8 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <ShifaBrand variant="full" theme="dark" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Votre santé,<br />
            au même endroit.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Dossier médical, rendez-vous, téléconsultation, échanges sécurisés et bien plus encore.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['RGPD', 'ISO 27001', 'FHIR-ready', 'IA médicale', '+190 pays'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              { value: '14', label: 'Rôles' },
              { value: '100+', label: 'Modules' },
              { value: '+190', label: 'Pays' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2026 SHIFA Health OS · Plateforme de santé numérique
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {/* Mobile top bar */}
        <div className="w-full px-5 pt-5 pb-0 flex items-center justify-between lg:hidden">
          <Link href="/">
            <ShifaBrand variant="compact" />
          </Link>
          <LanguageSelector compact />
        </div>

        {/* Mobile logo card — clean centered */}
        <div className="lg:hidden w-full px-5 mt-6 mb-2">
          <div
            className="w-full rounded-2xl overflow-hidden relative flex flex-col items-center justify-center py-8"
            style={{
              background: 'linear-gradient(145deg, #0878EF 0%, #0A1E4A 100%)',
              minHeight: '140px',
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(56,182,255,0.10)', transform: 'translate(-20%, 30%)' }} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.95)', padding: '12px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                <ShifaBrand variant="auth" />
              </div>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="w-full max-w-md px-5 py-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}