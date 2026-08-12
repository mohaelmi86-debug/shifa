'use client';
import React, { useState } from 'react';
import ShifaBrand from '@/components/ui/ShifaBrand';


interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1B3D 0%, #0A4B9A 60%, #0066FF 100%)' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute top-40 left-32 w-40 h-40 rounded-full border border-white" />
          <div className="absolute bottom-32 right-8 w-80 h-80 rounded-full border-2 border-white" />
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
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            SHIFA Health OS connecte patients, professionnels et établissements autour d'un dossier de santé sécurisé et d'une architecture modulaire.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Multi-tenant', 'RBAC', 'RLS', 'FHIR-ready', 'IA médicale'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 SHIFA Health OS · Plateforme de santé numérique
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex justify-center">
          <ShifaBrand variant="auth" />
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}