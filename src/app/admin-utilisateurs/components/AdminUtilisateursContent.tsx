'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type UserStatus = 'active' | 'pending' | 'inactive' | 'suspended';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  type: 'patient' | 'professional' | 'admin';
  department?: string;
  status: UserStatus;
  modules: number;
  lastLogin: string;
  createdAt: string;
}

const users: AppUser[] = [
  { id: 'u01', name: 'Aïcha Diallo', email: 'aicha.diallo@gmail.com', role: 'Patient', type: 'patient', status: 'active', modules: 4, lastLogin: 'Aujourd\'hui, 10:22', createdAt: 'Mar 2025' },
  { id: 'u02', name: 'Moussa Camara', email: 'm.camara@gmail.com', role: 'Patient', type: 'patient', status: 'active', modules: 3, lastLogin: 'Hier, 14:05', createdAt: 'Avr 2025' },
  { id: 'u03', name: 'Dr. Mohamed Sy', email: 'dr.sy@chu-saintlouis.sn', role: 'Médecin', type: 'professional', department: 'Médecine Générale', status: 'active', modules: 8, lastLogin: 'Aujourd\'hui, 08:12', createdAt: 'Jan 2025' },
  { id: 'u04', name: 'Dr. Fatou Sarr', email: 'f.sarr@chu-saintlouis.sn', role: 'Médecin', type: 'professional', department: 'Gynécologie', status: 'active', modules: 9, lastLogin: 'Hier, 17:45', createdAt: 'Mar 2025' },
  { id: 'u05', name: 'Awa Ndiaye', email: 'a.ndiaye@chu-saintlouis.sn', role: 'Infirmière', type: 'professional', department: 'Urgences', status: 'active', modules: 5, lastLogin: 'Aujourd\'hui, 07:30', createdAt: 'Fév 2025' },
  { id: 'u06', name: 'Admin CHU', email: 'admin@chu-saintlouis.sn', role: 'Administrateur', type: 'admin', status: 'active', modules: 12, lastLogin: 'Aujourd\'hui, 09:00', createdAt: 'Déc 2024' },
  { id: 'u07', name: 'Fatima Koné', email: 'f.kone@gmail.com', role: 'Patient', type: 'patient', status: 'pending', modules: 0, lastLogin: 'Inscription en cours', createdAt: 'Août 2026' },
  { id: 'u08', name: 'Ibrahima Diop', email: 'i.diop@chu-saintlouis.sn', role: 'Pharmacien', type: 'professional', department: 'Pharmacie', status: 'active', modules: 4, lastLogin: 'Aujourd\'hui, 09:00', createdAt: 'Mai 2025' },
  { id: 'u09', name: 'Oumar Traoré', email: 'o.traore@chu-saintlouis.sn', role: 'Laborantin', type: 'professional', department: 'Biologie', status: 'inactive', modules: 3, lastLogin: '01 août 2026', createdAt: 'Juin 2025' },
  { id: 'u10', name: 'Seydou Ba', email: 's.ba@gmail.com', role: 'Patient', type: 'patient', status: 'active', modules: 5, lastLogin: '09 août 2026', createdAt: 'Juil 2025' },
];

const typeConfig = {
  patient: { label: 'Patient', color: 'var(--shifa-green)', icon: 'UserIcon' },
  professional: { label: 'Professionnel', color: 'var(--shifa-blue)', icon: 'BriefcaseIcon' },
  admin: { label: 'Admin', color: 'var(--shifa-purple)', icon: 'ShieldCheckIcon' },
};

const statusConfig: Record<UserStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: 'Actif' },
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: 'En attente' },
  inactive: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Inactif' },
  suspended: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', label: 'Suspendu' },
};

const kpis = [
  { label: 'Total utilisateurs', value: '10', sub: '+3 ce mois', icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'Patients actifs', value: '4', sub: '40% du total', icon: 'UserIcon', color: 'var(--shifa-green)' },
  { label: 'Professionnels', value: '5', sub: 'Équipe soignante', icon: 'BriefcaseIcon', color: 'var(--shifa-cyan)' },
  { label: 'En attente', value: '1', sub: 'Vérification requise', icon: 'ClockIcon', color: 'var(--shifa-amber)' },
];

export default function AdminUtilisateursContent() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || u.type === typeFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Gestion des utilisateurs</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Tous les comptes enregistrés sur la plateforme SHIFA
          </p>
        </div>
        <button className="btn-primary text-sm px-4 py-2.5">
          <Icon name="UserPlusIcon" size={16} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="card-base flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}15` }}>
              <Icon name={k.icon as any} size={20} style={{ color: k.color } as any} className="" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{k.value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{k.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Tous les comptes</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="input-field pl-9 text-sm"
                style={{ minWidth: '200px' }}
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input-field text-sm" style={{ width: 'auto', minWidth: '150px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">Tous les types</option>
              <option value="patient">Patients</option>
              <option value="professional">Professionnels</option>
              <option value="admin">Administrateurs</option>
            </select>
            <select className="input-field text-sm" style={{ width: 'auto', minWidth: '140px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-3" style={{ backgroundColor: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.2)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{selectedIds.length} utilisateur(s) sélectionné(s)</span>
            <div className="flex items-center gap-2">
              <button className="text-xs font-medium px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-amber)' }}>Suspendre</button>
              <button className="text-xs font-medium px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--shifa-red)' }}>Révoquer</button>
              <button className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }} onClick={() => setSelectedIds([])}>Désélectionner</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-thin rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="w-8 px-3 py-2.5">
                  <input type="checkbox" className="w-3.5 h-3.5 accent-primary" onChange={e => setSelectedIds(e.target.checked ? filtered.map(u => u.id) : [])} />
                </th>
                {['Utilisateur', 'Type', 'Rôle / Département', 'Statut', 'Modules', 'Dernière connexion', 'Depuis', ''].map(col => (
                  <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => {
                const tc = typeConfig[u.type];
                const sc = statusConfig[u.status];
                return (
                  <tr
                    key={u.id}
                    className="group border-b transition-colors hover:bg-muted/50"
                    style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}
                  >
                    <td className="px-3 py-3">
                      <input type="checkbox" className="w-3.5 h-3.5 accent-primary" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, ${tc.color}, ${tc.color}99)` }}
                        >
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{u.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="badge-base text-xs" style={{ backgroundColor: `${tc.color}15`, color: tc.color, border: `1px solid ${tc.color}25` }}>
                        {tc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {u.role}{u.department ? ` · ${u.department}` : ''}
                    </td>
                    <td className="px-3 py-3">
                      <span className="badge-base text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)', minWidth: '48px' }}>
                          <div className="h-full rounded-full" style={{ width: `${(u.modules / 12) * 100}%`, backgroundColor: u.modules > 8 ? 'var(--shifa-green)' : u.modules > 4 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                        </div>
                        <span className="text-xs font-tabular" style={{ color: 'var(--muted-foreground)', minWidth: '28px' }}>{u.modules}/12</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.lastLogin}</td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.createdAt}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Modifier">
                          <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Modules">
                          <Icon name="PuzzlePieceIcon" size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Suspendre">
                          <Icon name="NoSymbolIcon" size={14} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} utilisateur(s) affiché(s)</p>
          <button className="btn-secondary text-xs px-3 py-1.5">
            <Icon name="ArrowDownTrayIcon" size={13} />
            Exporter CSV
          </button>
        </div>
      </div>
    </div>
  );
}
