'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const users = [
  { id: 'usr-001', name: 'Dr. Mohamed Sy', email: 'dr.sy@chu-saintlouis.sn', role: 'Médecin', department: 'Médecine générale', status: 'active', lastLogin: '10 août 2026, 08:12', modules: 8 },
  { id: 'usr-002', name: 'Dr. Fatou Sarr', email: 'f.sarr@chu-saintlouis.sn', role: 'Médecin', department: 'Gynécologie', status: 'active', lastLogin: '09 août 2026, 17:45', modules: 9 },
  { id: 'usr-003', name: 'Awa Ndiaye', email: 'a.ndiaye@chu-saintlouis.sn', role: 'Infirmière', department: 'Urgences', status: 'active', lastLogin: '10 août 2026, 07:30', modules: 5 },
  { id: 'usr-004', name: 'Ibrahima Diop', email: 'i.diop@chu-saintlouis.sn', role: 'Pharmacien', department: 'Pharmacie', status: 'active', lastLogin: '10 août 2026, 09:00', modules: 4 },
  { id: 'usr-005', name: 'Dr. Aminata Kouyaté', email: 'a.kouyate@chu-saintlouis.sn', role: 'Médecin', department: 'Pédiatrie', status: 'pending', lastLogin: 'Invitation envoyée', modules: 0 },
  { id: 'usr-006', name: 'Mariama Balde', email: 'm.balde@chu-saintlouis.sn', role: 'Sage-femme', department: 'Maternité', status: 'active', lastLogin: '08 août 2026, 14:22', modules: 6 },
  { id: 'usr-007', name: 'Oumar Traoré', email: 'o.traore@chu-saintlouis.sn', role: 'Laborantin', department: 'Biologie', status: 'inactive', lastLogin: '01 août 2026, 11:00', modules: 3 },
  { id: 'usr-008', name: 'Dr. Jean Kouassi', email: 'j.kouassi@chu-saintlouis.sn', role: 'Médecin', department: 'Cardiologie', status: 'active', lastLogin: '10 août 2026, 06:55', modules: 10 },
];

const roleColors: Record<string, string> = {
  'Médecin': 'var(--shifa-blue)',
  'Infirmière': 'var(--shifa-green)',
  'Pharmacien': 'var(--shifa-amber)',
  'Sage-femme': 'var(--shifa-purple)',
  'Laborantin': 'var(--shifa-cyan)',
};

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="card-base">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Gestion des utilisateurs</h2>
        <button className="btn-primary text-sm px-4 py-2">
          <Icon name="UserPlusIcon" size={15} />
          Inviter
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            className="input-field pl-9 text-sm w-full"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field text-sm"
          style={{ width: 'auto', minWidth: '160px' }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="Médecin">Médecin</option>
          <option value="Infirmière">Infirmière</option>
          <option value="Pharmacien">Pharmacien</option>
          <option value="Sage-femme">Sage-femme</option>
          <option value="Laborantin">Laborantin</option>
        </select>
      </div>

      {/* Bulk bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-3 animate-slide-up" style={{ backgroundColor: 'rgba(0, 102, 255, 0.08)', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--shifa-blue)' }}>{selectedIds.length} utilisateur(s) sélectionné(s)</span>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--shifa-amber)', color: 'white' }}>
              Suspendre
            </button>
            <button className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: 'var(--shifa-red)', color: 'white' }}>
              Révoquer l'accès
            </button>
            <button onClick={() => setSelectedIds([])} className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Désélectionner
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin rounded-xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm min-w-[780px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
              <th className="w-8 px-3 py-2.5">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-primary"
                  onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(u => u.id) : [])}
                />
              </th>
              {['Utilisateur', 'Rôle', 'Département', 'Statut', 'Modules', 'Dernière connexion', ''].map((col) => (
                <th key={`uth-${col}`} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => (
              <tr
                key={u.id}
                className="group border-b transition-colors hover:bg-muted/50 cursor-pointer"
                style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-primary"
                    checked={selectedIds.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: `linear-gradient(135deg, ${roleColors[u.role] || 'var(--shifa-blue)'}, ${roleColors[u.role] || 'var(--shifa-blue)'}99)` }}
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
                  <span
                    className="badge-base text-xs"
                    style={{
                      backgroundColor: `${roleColors[u.role] || 'var(--shifa-blue)'}15`,
                      color: roleColors[u.role] || 'var(--shifa-blue)',
                      border: `1px solid ${roleColors[u.role] || 'var(--shifa-blue)'}25`,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.department}</td>
                <td className="px-3 py-3">
                  <span className={`badge-base ${u.status === 'active' ? 'status-active' : u.status === 'pending' ? 'status-pending' : 'status-cancelled'}`}>
                    {u.status === 'active' ? 'Actif' : u.status === 'pending' ? 'En attente' : 'Inactif'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)', minWidth: '48px' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(u.modules / 12) * 100}%`,
                          backgroundColor: u.modules > 8 ? 'var(--shifa-green)' : u.modules > 4 ? 'var(--shifa-blue)' : 'var(--shifa-amber)',
                        }}
                      />
                    </div>
                    <span className="text-xs font-tabular" style={{ color: 'var(--muted-foreground)', minWidth: '28px' }}>{u.modules}/12</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.lastLogin}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Modifier les droits">
                      <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Gérer les modules">
                      <Icon name="PuzzlePieceIcon" size={14} className="text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded-lg transition-colors hover:bg-muted" title="Suspendre l'accès">
                      <Icon name="NoSymbolIcon" size={14} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {filtered.length} utilisateur(s) · Page 1 sur {Math.ceil(users.length / 8)}
        </p>
        <div className="flex items-center gap-1">
          {[1, 2].map((page) => (
            <button
              key={`upage-${page}`}
              className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: page === 1 ? 'var(--shifa-blue)' : 'var(--muted)',
                color: page === 1 ? 'white' : 'var(--muted-foreground)',
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}