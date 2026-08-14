import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const actions = [
  { key: 'qa-planifier', icon: 'CalendarDaysIcon', label: 'Planifier', color: 'var(--shifa-blue)', bg: 'var(--shifa-light)', href: '/appointment-booking' },
  { key: 'qa-teleconsult', icon: 'VideoCameraIcon', label: 'Téléconsultation', color: '#059669', bg: '#D1FAE5', href: '/patient-teleconsultation' },
  { key: 'qa-resultats', icon: 'BeakerIcon', label: 'Résultats', color: 'var(--shifa-purple)', bg: '#EDE9FE', href: '/patient-results' },
  { key: 'qa-dossier', icon: 'FolderOpenIcon', label: 'Dossier santé', color: 'var(--shifa-cyan)', bg: '#E0F2FE', href: '/dossier-de-sant' },
  { key: 'qa-echanges', icon: 'ChatBubbleLeftRightIcon', label: 'Échanges', color: 'var(--shifa-amber)', bg: 'var(--shifa-amber-light)', href: '/patient-messages' },
  { key: 'qa-prevention', icon: 'ShieldCheckIcon', label: 'Prévention', color: '#059669', bg: '#D1FAE5', href: '/patient-prevention' },
];

export default function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <div className="flex items-center justify-between mb-3">
        <h2 id="quick-actions-title" className="text-sm font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
          Accès rapide
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {actions.map((action) => (
          <Link
            key={action.key}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-150 hover:shadow-shifa hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: 'var(--shifa-surface-2)',
              borderColor: 'var(--border)',
            }}
            aria-label={action.label}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: action.bg }}
              aria-hidden="true"
            >
              <Icon name={action.icon as any} size={22} style={{ color: action.color } as any} className="" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--shifa-dark)' }}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}