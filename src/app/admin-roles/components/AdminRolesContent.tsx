'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  color: string;
  permissions: string[];
}

const roles: Role[] = [
  {
    id: 'r1', name: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités', users: 2, color: 'var(--shifa-red)',
    permissions: ['Gestion utilisateurs', 'Gestion modules', 'Audit complet', 'Configuration système', 'Rapports financiers', 'Gestion rôles'],
  },
  {
    id: 'r2', name: 'Médecin', description: 'Accès clinique complet — consultations, prescriptions, dossiers', users: 18, color: 'var(--shifa-blue)',
    permissions: ['Consultations', 'Prescriptions', 'Dossiers patients', 'Résultats biologie', 'Messagerie sécurisée', 'Téléconsultation'],
  },
  {
    id: 'r3', name: 'Infirmier(e)', description: 'Soins infirmiers, constantes, administration médicaments', users: 12, color: 'var(--shifa-cyan)',
    permissions: ['Constantes vitales', 'Administration médicaments', 'Dossiers patients (lecture)', 'Messagerie sécurisée'],
  },
  {
    id: 'r4', name: 'Pharmacien', description: 'Dispensation médicaments et gestion des stocks', users: 4, color: 'var(--shifa-green)',
    permissions: ['Prescriptions (lecture)', 'Dispensation', 'Gestion stocks', 'Interactions médicamenteuses'],
  },
  {
    id: 'r5', name: 'Secrétaire médicale', description: 'Gestion des rendez-vous et accueil patients', users: 6, color: 'var(--shifa-amber)',
    permissions: ['Agenda', 'Rendez-vous', 'Accueil patients', 'Facturation'],
  },
  {
    id: 'r6', name: 'Biologiste', description: 'Gestion des analyses et résultats de laboratoire', users: 6, color: 'var(--shifa-purple)',
    permissions: ['Résultats biologie', 'Analyses (création)', 'Dossiers patients (lecture)', 'Rapports laboratoire'],
  },
];

const allPermissions = [
  'Consultations', 'Prescriptions', 'Dossiers patients', 'Résultats biologie', 'Messagerie sécurisée',
  'Téléconsultation', 'Agenda', 'Rendez-vous', 'Gestion utilisateurs', 'Gestion modules', 'Audit complet',
  'Configuration système', 'Constantes vitales', 'Administration médicaments', 'Dispensation', 'Gestion stocks',
  'Accueil patients', 'Facturation', 'Analyses (création)', 'Rapports laboratoire', 'Rapports financiers', 'Gestion rôles',
];

export default function AdminRolesContent() {
  const [selectedRole, setSelectedRole] = useState<string>('r1');
  const active = roles.find(r => r.id === selectedRole)!;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Rôles & Droits d'accès</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gérez les rôles et les permissions des utilisateurs</p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Icon name="PlusIcon" size={16} />
          Nouveau rôle
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Roles list */}
        <div className="xl:col-span-1 flex flex-col gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="card-base text-left transition-all w-full"
              style={{ border: `2px solid ${selectedRole === role.id ? role.color : 'var(--border)'}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${role.color}15` }}
                >
                  <Icon name="ShieldCheckIcon" size={18} style={{ color: role.color } as React.CSSProperties} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{role.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                      {role.users} users
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Permissions detail */}
        <div className="xl:col-span-2">
          <div className="card-base">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${active.color}15` }}>
                    <Icon name="ShieldCheckIcon" size={16} style={{ color: active.color } as React.CSSProperties} className="" />
                  </div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>{active.name}</h2>
                </div>
                <p className="text-sm mt-1.5" style={{ color: 'var(--muted-foreground)' }}>{active.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-xs px-3 py-2">
                  <Icon name="PencilIcon" size={13} />
                  Modifier
                </button>
                <button className="btn-secondary text-xs px-3 py-2">
                  <Icon name="DocumentDuplicateIcon" size={13} />
                  Dupliquer
                </button>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>
                PERMISSIONS ({active.permissions.length}/{allPermissions.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allPermissions.map((perm) => {
                  const hasPermission = active.permissions.includes(perm);
                  return (
                    <div
                      key={perm}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                      style={{
                        backgroundColor: hasPermission ? `${active.color}08` : 'var(--background)',
                        border: `1px solid ${hasPermission ? `${active.color}25` : 'var(--border)'}`,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                        style={{ backgroundColor: hasPermission ? active.color : 'var(--border)' }}
                      >
                        {hasPermission && <Icon name="CheckIcon" size={10} className="text-white" />}
                      </div>
                      <span className="text-xs font-medium" style={{ color: hasPermission ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                        {perm}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted-foreground)' }}>UTILISATEURS AVEC CE RÔLE ({active.users})</p>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(active.users, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white"
                    style={{ background: `linear-gradient(135deg, ${active.color}, var(--shifa-cyan))`, marginLeft: i > 0 ? '-8px' : '0' }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {active.users > 5 && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
                    style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', marginLeft: '-8px' }}
                  >
                    +{active.users - 5}
                  </div>
                )}
                <button className="ml-2 text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>Voir tous →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
