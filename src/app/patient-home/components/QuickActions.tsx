import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const actions = [
  { key: 'qa-rdv', icon: 'CalendarDaysIcon', label: 'Prendre un rendez-vous', color: 'var(--shifa-blue)', bg: 'rgba(0, 102, 255, 0.08)', href: '/appointment-booking' },
  { key: 'qa-teleconsult', icon: 'VideoCameraIcon', label: 'Téléconsultation', color: 'var(--shifa-green)', bg: 'rgba(16, 185, 129, 0.08)', href: '/appointment-booking' },
  { key: 'qa-dossier', icon: 'FolderOpenIcon', label: 'Mon dossier de santé', color: 'var(--shifa-purple)', bg: 'rgba(123, 94, 167, 0.08)', href: '/dossier-de-sant' },
  { key: 'qa-carte', icon: 'CreditCardIcon', label: 'Ma carte SHIFA', color: 'var(--shifa-cyan)', bg: 'rgba(0, 242, 195, 0.08)', href: '/shifa-card' },
  { key: 'qa-pharmacie', icon: 'BeakerIcon', label: 'Pharmacie autour de moi', color: 'var(--shifa-amber)', bg: 'rgba(245, 158, 11, 0.08)', href: '/patient-explorer' },
  { key: 'qa-urgence', icon: 'ExclamationTriangleIcon', label: 'Urgence proche', color: 'var(--shifa-red)', bg: 'rgba(239, 68, 68, 0.08)', href: '/patient-explorer' },
];

export default function QuickActions() {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Accès rapide</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((action) => (
          <Link
            key={action.key}
            href={action.href}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-150 hover:shadow-shifa hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: action.bg, borderColor: 'var(--border)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'white', border: `1.5px solid ${action.color}25` }}>
              <Icon name={action.icon as any} size={20} style={{ color: action.color } as any} className="" />
            </div>
            <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--foreground)' }}>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}