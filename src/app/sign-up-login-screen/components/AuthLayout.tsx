'use client';
import React from 'react';
import ShifaBrand from '@/components/ui/ShifaBrand';
import LanguageSelector from '@/components/ui/LanguageSelector';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F0F4FA' }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F1F3D 0%, #1558D6 65%, #0EA5E9 100%)' }}
      >
        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.025)' }} />
          <div className="absolute -bottom-24 right-8 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <ShifaBrand variant="full" theme="dark" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            Un dossier.<br />
            Un patient.<br />
            Un écosystème.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
            SHIFA Health OS connecte patients, professionnels et établissements autour d'un dossier de santé sécurisé.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Multi-tenant', 'RBAC', 'RLS', 'FHIR-ready', 'IA médicale'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            {[
              { value: '14', label: 'Rôles' },
              { value: '100+', label: 'Modules' },
              { value: '12', label: 'Langues' },
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
          <ShifaBrand variant="compact" />
          <LanguageSelector compact />
        </div>

        {/* Mobile hero card */}
        <div className="lg:hidden w-full px-5 mt-4 mb-2">
          <div
            className="w-full rounded-2xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(145deg, #1558D6 0%, #0D47B5 50%, #0A3A9A 100%)',
              padding: '28px 24px',
            }}
          >
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.04)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'rgba(14,165,233,0.12)', transform: 'translate(-20%, 30%)' }} />

            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                <ShifaBrand variant="auth" />
              </div>
              <p className="text-sm font-medium text-center" style={{ color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em' }}>
                Votre santé, simplement.
              </p>
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