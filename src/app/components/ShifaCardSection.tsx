import React from 'react';

import AppLogo from '@/components/ui/AppLogo';

export default function ShifaCardSection() {
  return (
    <section className="py-16 lg:py-20 px-6 lg:px-10 xl:px-16">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Carte SHIFA — Votre identité numérique
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Accès sécurisé à votre dossier de santé, partout, à tout moment
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Digital Card */}
          <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-8 min-h-[280px] flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
              boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full border border-white" />
              <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <AppLogo size={20} />
                  <div>
                    <p className="text-white font-bold text-xs">SHIFA</p>
                    <p className="text-xs" style={{ color: 'var(--shifa-cyan)', fontSize: '8px', letterSpacing: '0.1em' }}>HEALTH OS</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(0,242,195,0.15)', border: '1px solid rgba(0,242,195,0.3)' }}>
                  <span className="text-xs font-semibold" style={{ color: 'var(--shifa-cyan)' }}>Actif</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-white/60 text-xs mb-2">Identité numérique</p>
                <p className="text-white font-bold text-lg">Aïcha DIALLO</p>
                <p className="text-white/70 text-sm mt-1">SH-2-225-FR-2025-7K4D</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs">Groupe sanguin</p>
                <p className="text-white font-bold text-lg">O+</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                AD
              </div>
            </div>
          </div>

          {/* Physical Card */}
          <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-8 min-h-[280px] flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #0A1B3D 0%, #0A4B9A 55%, #0066FF 100%)',
              boxShadow: '0 20px 60px rgba(0,102,255,0.3)',
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full border border-white" />
              <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-white" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AppLogo size={18} />
                  <p className="text-white font-bold text-xs">SHIFA HEALTH OS</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
              </div>

              <div>
                <p className="text-white/60 text-xs mb-1">SHIFA ID</p>
                <p className="text-white font-mono font-bold text-sm">SH-2-225-FR-2025-7K4D</p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/60 text-xs">Groupe sanguin</p>
                  <p className="text-white font-bold" style={{ color: 'var(--shifa-cyan)' }}>O+</p>
                </div>
                <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                  <div className="grid grid-cols-4 gap-0.5 p-1">
                    {Array.from({ length: 16 })?.map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-sm"
                        style={{ backgroundColor: Math.random() > 0.4 ? '#0A1B3D' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="btn-primary px-8 py-3 text-base">
            Demander ma carte SHIFA
          </button>
        </div>
      </div>
    </section>
  );
}