'use client';
import React, { useState } from 'react';
import ShifaBrand from '@/components/ui/ShifaBrand';
import LanguageSelector from '@/components/ui/LanguageSelector';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A2B4A 0%, #1A73E8 70%, #0EA5E9 100%)' }}
      >
        {/* Subtle background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute top-1/3 -left-20 w-56 h-56 rounded-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
          <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <ShifaBrand variant="full" theme="dark" />
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Un dossier.<br />
            Un patient.<br />
            Un écosystème.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            SHIFA Health OS connecte patients, professionnels et établissements autour d'un dossier de santé sécurisé et d'une architecture modulaire.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Multi-tenant', 'RBAC', 'RLS', 'FHIR-ready', 'IA médicale'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)' }}
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
              { value: '12', label: 'Langues' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 SHIFA Health OS · Plateforme de santé numérique
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 sm:p-10 overflow-y-auto">
        {/* Mobile header */}
        <div className="w-full max-w-md mb-6 flex items-center justify-between lg:hidden">
          <ShifaBrand variant="compact" />
          <LanguageSelector compact />
        </div>

        {/* Mobile logo centered */}
        <div className="lg:hidden mb-6 flex justify-center w-full max-w-md">
          <div
            className="w-full rounded-3xl p-8 flex flex-col items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #1A73E8 100%)' }}
          >
            <ShifaBrand variant="auth" />
            <p className="text-sm text-center font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Votre santé, simplement.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}