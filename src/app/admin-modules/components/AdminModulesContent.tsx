'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ModuleGrid from '@/app/administration-tablissement/components/ModuleGrid';

export default function AdminModulesContent() {
  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Gestion des modules</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Activez, désactivez et configurez les modules de votre établissement</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Icon name="PuzzlePieceIcon" size={16} />
          Catalogue complet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Modules disponibles', value: 15, icon: 'PuzzlePieceIcon', color: 'var(--shifa-blue)' },
          { label: 'Modules actifs', value: 11, icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
          { label: 'Modules inactifs', value: 4, icon: 'XCircleIcon', color: 'var(--muted-foreground)' },
          { label: 'Utilisateurs actifs', value: 48, icon: 'UsersIcon', color: 'var(--shifa-purple)' },
        ].map((kpi) => (
          <div key={kpi.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${kpi.color}15` }}>
              <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as React.CSSProperties} className="" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ModuleGrid />
    </div>
  );
}
