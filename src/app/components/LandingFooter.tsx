import React from 'react';

import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function LandingFooter() {
  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 xl:px-16 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            <div>
              <p className="text-white font-bold text-sm">SHIFA Health OS</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Plateforme de santé unifiée</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {[
              { icon: 'GlobeAltIcon', label: 'Website' },
              { icon: 'EnvelopeIcon', label: 'Email' },
              { icon: 'PhoneIcon', label: 'Phone' },
            ].map(item => (
              <button
                key={item.label}
                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                title={item.label}
              >
                <Icon name={item.icon as any} size={18} className="text-white" />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t mt-6 pt-6" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 SHIFA Health OS. Tous droits réservés. | Plateforme de santé numérique sécurisée
          </p>
        </div>
      </div>
    </footer>
  );
}