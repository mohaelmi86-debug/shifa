'use client';
import React from 'react';

import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface AmbassadorSubPageProps {
  title: string;
  description: string;
  icon: string;
  comingSoonFeatures: string[];
}

function AmbassadorSubPageContent({ title, description, icon, comingSoonFeatures }: AmbassadorSubPageProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
        >
          <Icon name={icon as any} size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{title}</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Icon name="SparklesIcon" size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Fonctionnalités à venir</h2>
        </div>
        <ul className="space-y-2">
          {comingSoonFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--shifa-blue)' }} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/ambassador-workspace"
        className="btn-primary flex items-center justify-center gap-2 py-3 text-sm font-semibold"
      >
        <Icon name="ArrowLeftIcon" size={16} />
        Retour au tableau de bord Ambassadeur
      </Link>
    </div>
  );
}

export { AmbassadorSubPageContent };
