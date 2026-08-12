'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ProfStatus = 'active' | 'pending' | 'suspended' | 'inactive';

interface Professional {
  id: string;
  name: string;
  email: string;
  profession: string;
  department: string;
  speciality: string;
  status: ProfStatus;
  patients: number;
  consultations: number;
  joinedAt: string;
  lastActivity: string;
}

const professionals: Professional[] = [
  { id: 'p01', name: 'Dr. Mohamed Sy', email: 'dr.sy@chu-saintlouis.sn', profession: 'Médecin', department: 'Médecine Générale', speciality: 'Médecin généraliste', status: 'active', patients: 142, consultations: 38, joinedAt: 'Jan 2025', lastActivity: 'Aujourd\'hui, 08:12' },
  { id: 'p02', name: 'Dr. Fatou Sarr', email: 'f.sarr@chu-saintlouis.sn', profession: 'Médecin', department: 'Gynécologie', speciality: 'Gynécologue-obstétricien', status: 'active', patients: 98, consultations: 22, joinedAt: 'Mar 2025', lastActivity: 'Hier, 17:45' },
  { id: 'p03', name: 'Awa Ndiaye', email: 'a.ndiaye@chu-saintlouis.sn', profession: 'Infirmière', department: 'Urgences', speciality: 'Infirmière chef', status: 'active', patients: 0, consultations: 0, joinedAt: 'Fév 2025', lastActivity: 'Aujourd\'hui, 07:30' },
  { id: 'p04', name: 'Dr. Ibrahima Fall', email: 'i.fall@chu-saintlouis.sn', profession: 'Médecin', department: 'Urgences', speciality: 'Urgentiste', status: 'active', patients: 210, consultations: 55, joinedAt: 'Déc 2024', lastActivity: 'Aujourd\'hui, 06:55' },
  { id: 'p05', name: 'Dr. Aminata Kouyaté', email: 'a.kouyate@chu-saintlouis.sn', profession: 'Médecin', department: 'Pédiatrie', speciality: 'Pédiatre', status: 'pending', patients: 0, consultations: 0, joinedAt: 'Invitation', lastActivity: 'Invitation envoyée' },
  { id: 'p06', name: 'Mariama Baldé', email: 'm.balde@chu-saintlouis.sn', profession: 'Sage-femme', department: 'Maternité', speciality: 'Sage-femme', status: 'active', patients: 67, consultations: 14, joinedAt: 'Avr 2025', lastActivity: '08 août 2026' },
  { id: 'p07', name: 'Oumar Traoré', email: 'o.traore@chu-saintlouis.sn', profession: 'Laborantin', department: 'Biologie', speciality: 'Technicien labo', status: 'inactive', patients: 0, consultations: 0, joinedAt: 'Juin 2025', lastActivity: '01 août 2026' },
  { id: 'p08', name: 'Dr. Jean Kouassi', email: 'j.kouassi@chu-saintlouis.sn', profession: 'Médecin', department: 'Cardiologie', speciality: 'Cardiologue', status: 'active', patients: 88, consultations: 19, joinedAt: 'Nov 2024', lastActivity: 'Aujourd\'hui, 06:55' },
  { id: 'p09', name: 'Ibrahima Diop', email: 'i.diop@chu-saintlouis.sn', profession: 'Pharmacien', department: 'Pharmacie', speciality: 'Pharmacien hospitalier', status: 'active', patients: 0, consultations: 0, joinedAt: 'Mai 2025', lastActivity: 'Aujourd\'hui, 09:00' },
  { id: 'p10', name: 'Dr. Rokhaya Ndiaye', email: 'r.ndiaye@chu-saintlouis.sn', profession: 'Sage-femme', department: 'Maternité', speciality: 'Sage-femme senior', status: 'pending', patients: 0, consultations: 0, joinedAt: 'Invitation', lastActivity: 'Invitation envoyée' },
];

const statusConfig: Record<ProfStatus, { bg: string; text: string; label: string; icon: string }> = {
  active: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: 'Actif', icon: 'CheckCircleIcon' },
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: 'En attente', icon: 'ClockIcon' },
  suspended: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', label: 'Suspendu', icon: 'ExclamationCircleIcon' },
  inactive: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Inactif', icon: 'MinusCircleIcon' },
};

const profColors: Record<string, string> = {
  'Médecin': 'var(--shifa-blue)',
  'Infirmière': 'var(--shifa-green)',
  'Pharmacien': 'var(--shifa-amber)',
  'Sage-femme': 'var(--shifa-purple)',
  'Laborantin': 'var(--shifa-cyan)',
};

const kpis = [
  { label: 'Professionnels actifs', value: '7', sub: '+2 ce mois', icon: 'UserGroupIcon', color: 'var(--shifa-blue)' },
  { label: 'Invitations en attente', value: '2', sub: 'Réponse attendue', icon: 'EnvelopeIcon', color: 'var(--shifa-amber)' },
  { label: 'Consultations / mois', value: '148', sub: '+12% vs mois dernier', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-green)' },
  { label: 'Départements couverts', value: '7', sub: 'Sur 8 actifs', icon: 'BuildingOffice2Icon', color: 'var(--shifa-purple)' },
];

export default function AdminProfessionnelsContent() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const departments = [...new Set(professionals.map(p => p.department))];

  const filtered = professionals.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.speciality.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'all' || p.department === deptFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Professionnels de santé</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Gestion des membres de l'équipe soignante — CHU Saint-Louis
          </p>
        </div>
        <button
          className="btn-primary text-sm px-4 py-2.5"
          onClick={() => setShowInviteModal(true)}
        >
          <Icon name="UserPlusIcon" size={16} />
          Inviter un professionnel
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
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
          <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Équipe soignante</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                className="input-field pl-9 text-sm"
                style={{ minWidth: '220px' }}
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input-field text-sm" style={{ width: 'auto', minWidth: '160px' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="all">Tous les départements</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
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

        <div className="overflow-x-auto scrollbar-thin rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Professionnel', 'Spécialité', 'Département', 'Statut', 'Patients', 'Consultations/mois', 'Depuis', ''].map(col => (
                  <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const sc = statusConfig[p.status];
                const color = profColors[p.profession] || 'var(--shifa-blue)';
                return (
                  <tr
                    key={p.id}
                    className="group border-b transition-colors hover:bg-muted/50"
                    style={{ borderColor: 'var(--border)', backgroundColor: idx % 2 === 0 ? 'var(--card)' : 'var(--background)' }}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                        >
                          {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="badge-base text-xs" style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}25` }}>
                        {p.speciality}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.department}</td>
                    <td className="px-3 py-3">
                      <span className="badge-base text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm font-tabular font-semibold" style={{ color: 'var(--foreground)' }}>
                      {p.patients > 0 ? p.patients : '—'}
                    </td>
                    <td className="px-3 py-3 text-sm font-tabular" style={{ color: 'var(--foreground)' }}>
                      {p.consultations > 0 ? p.consultations : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.joinedAt}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Voir le profil">
                          <Icon name="EyeIcon" size={14} className="text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Modifier les droits">
                          <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                        </button>
                        {p.status === 'active' && (
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Suspendre">
                            <Icon name="NoSymbolIcon" size={14} style={{ color: 'var(--shifa-amber)' } as any} className="" />
                          </button>
                        )}
                        {p.status === 'pending' && (
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Renvoyer l'invitation">
                            <Icon name="PaperAirplaneIcon" size={14} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} professionnel(s) affiché(s)</p>
          <button className="btn-secondary text-xs px-3 py-1.5">
            <Icon name="ArrowDownTrayIcon" size={13} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="rounded-2xl border w-full max-w-md p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Inviter un professionnel</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Nom complet', placeholder: 'Dr. Prénom Nom', type: 'text' },
                { label: 'E-mail professionnel', placeholder: 'prenom.nom@etablissement.sn', type: 'email' },
                { label: 'Profession', placeholder: 'Médecin, Infirmier(ère)...', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{f.label}</label>
                  <input type={f.type} className="input-field w-full text-sm" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Département</label>
                <select className="input-field w-full text-sm">
                  <option value="">Sélectionner un département</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 btn-secondary py-2.5 text-sm" onClick={() => setShowInviteModal(false)}>Annuler</button>
              <button className="flex-1 btn-primary py-2.5 text-sm" onClick={() => setShowInviteModal(false)}>
                <Icon name="PaperAirplaneIcon" size={15} />
                Envoyer l'invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
