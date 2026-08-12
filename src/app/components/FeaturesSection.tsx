import React from 'react';
import Icon from '@/components/ui/AppIcon';

const ecosystem = [
  { key: 'eco-patients', icon: 'UserIcon', label: 'Patients', count: '128.7M', color: 'var(--shifa-blue)' },
  { key: 'eco-professionnels', icon: 'UserGroupIcon', label: 'Professionnels', count: '1.24M', color: 'var(--shifa-green)' },
  { key: 'eco-hopitaux', icon: 'BuildingOffice2Icon', label: 'Hôpitaux & Cliniques', count: '24.7K', color: 'var(--shifa-purple)' },
  { key: 'eco-pharmacies', icon: 'BeakerIcon', label: 'Pharmacies', count: '18.3K', color: 'var(--shifa-amber)' },
  { key: 'eco-laboratoires', icon: 'MagnifyingGlassIcon', label: 'Laboratoires', count: '9.1K', color: 'var(--shifa-cyan)' },
  { key: 'eco-assurances', icon: 'ShieldCheckIcon', label: 'Assurances', count: '340', color: 'var(--shifa-red)' },
  { key: 'eco-universites', icon: 'AcademicCapIcon', label: 'Universités & Recherche', count: '520', color: 'var(--shifa-blue)' },
  { key: 'eco-ong', icon: 'GlobeAltIcon', label: 'OMS / ONG', count: '180+', color: 'var(--shifa-green)' },
];

const stats = [
  { key: 'stat-pays', value: '67', label: 'Pays connectés', icon: 'GlobeAltIcon' },
  { key: 'stat-securite', value: '100%', label: 'Sécurité RGPD & ISO 27001', icon: 'ShieldCheckIcon' },
  { key: 'stat-modules', value: '∞', label: 'Modules interconnectés', icon: 'PuzzlePieceIcon' },
  { key: 'stat-dispo', value: '24/7', label: 'Disponibilité continue', icon: 'ClockIcon' },
];

export default function FeaturesSection() {
  return (
    <section style={{ backgroundColor: 'var(--shifa-dark)' }} className="py-16 lg:py-24">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 xl:px-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--shifa-cyan)' }}>
            UN ÉCOSYSTÈME COMPLET
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Tous les acteurs de la santé, connectés
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            SHIFA Health OS relie chaque maillon de la chaîne de soins autour d'un dossier de santé unique et sécurisé.
          </p>
        </div>

        {/* Ecosystem grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
          {ecosystem.map((item) => (
            <div
              key={item.key}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon name={item.icon as any} size={20} style={{ color: item.color } as any} className="" />
              </div>
              <p className="text-xs font-bold font-tabular" style={{ color: item.color }}>{item.count}</p>
              <p className="text-xs text-center leading-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex items-center gap-4 p-5 rounded-2xl border"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0, 102, 255, 0.3)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
              >
                <Icon name={stat.icon as any} size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-extrabold font-tabular text-white">{stat.value}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}