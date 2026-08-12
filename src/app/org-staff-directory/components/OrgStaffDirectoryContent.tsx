'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'directory' | 'contracts' | 'schedules' | 'leaves' | 'competencies' | 'pay';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  avatar: string;
  permissions: string[];
  contractType: string;
  salary: number;
}

const staff: StaffMember[] = [
  { id: 's1', name: 'Dr. Aminata Diallo', role: 'Médecin chef', department: 'Médecine interne', email: 'a.diallo@chu.sn', phone: '+221 77 123 4567', status: 'active', joinDate: '2020-03-15', avatar: 'AD', permissions: ['dossiers', 'prescriptions', 'admissions'], contractType: 'CDI', salary: 850000 },
  { id: 's2', name: 'Ibrahima Sow', role: 'Infirmier coordinateur', department: 'Urgences', email: 'i.sow@chu.sn', phone: '+221 76 234 5678', status: 'active', joinDate: '2021-07-01', avatar: 'IS', permissions: ['dossiers', 'soins'], contractType: 'CDI', salary: 420000 },
  { id: 's3', name: 'Fatou Ndiaye', role: 'Administratrice', department: 'Administration', email: 'f.ndiaye@chu.sn', phone: '+221 78 345 6789', status: 'active', joinDate: '2019-01-10', avatar: 'FN', permissions: ['facturation', 'admissions', 'rapports'], contractType: 'CDI', salary: 380000 },
  { id: 's4', name: 'Dr. Moussa Traoré', role: 'Chirurgien', department: 'Bloc opératoire', email: 'm.traore@chu.sn', phone: '+221 77 456 7890', status: 'on_leave', joinDate: '2018-09-20', avatar: 'MT', permissions: ['dossiers', 'prescriptions', 'bloc'], contractType: 'CDI', salary: 950000 },
  { id: 's5', name: 'Aïssatou Ba', role: 'Laborantine', department: 'Laboratoire', email: 'a.ba@chu.sn', phone: '+221 76 567 8901', status: 'active', joinDate: '2022-04-05', avatar: 'AB', permissions: ['resultats', 'analyses'], contractType: 'CDD', salary: 320000 },
  { id: 's6', name: 'Cheikh Diop', role: 'Technicien biomédical', department: 'Biomédical', email: 'c.diop@chu.sn', phone: '+221 78 678 9012', status: 'inactive', joinDate: '2023-02-14', avatar: 'CD', permissions: ['equipements'], contractType: 'Stage', salary: 150000 },
];

const contracts = [
  { id: 'c1', employee: 'Dr. Aminata Diallo', type: 'CDI', start: '15/03/2020', end: '—', statut: 'actif', poste: 'Médecin chef', salaire: 850000 },
  { id: 'c2', employee: 'Ibrahima Sow', type: 'CDI', start: '01/07/2021', end: '—', statut: 'actif', poste: 'Infirmier coordinateur', salaire: 420000 },
  { id: 'c3', employee: 'Fatou Ndiaye', type: 'CDI', start: '10/01/2019', end: '—', statut: 'actif', poste: 'Administratrice', salaire: 380000 },
  { id: 'c4', employee: 'Aïssatou Ba', type: 'CDD', start: '05/04/2022', end: '05/04/2024', statut: 'renouvellement', poste: 'Laborantine', salaire: 320000 },
  { id: 'c5', employee: 'Cheikh Diop', type: 'Stage', start: '14/02/2023', end: '14/08/2023', statut: 'expiré', poste: 'Technicien biomédical', salaire: 150000 },
];

const scheduleData = [
  { jour: 'Lun', matin: 4, soir: 3, nuit: 2 },
  { jour: 'Mar', matin: 5, soir: 3, nuit: 2 },
  { jour: 'Mer', matin: 4, soir: 4, nuit: 2 },
  { jour: 'Jeu', matin: 5, soir: 3, nuit: 2 },
  { jour: 'Ven', matin: 4, soir: 3, nuit: 3 },
  { jour: 'Sam', matin: 3, soir: 2, nuit: 2 },
  { jour: 'Dim', matin: 2, soir: 2, nuit: 3 },
];

const schedules = [
  { id: 'sch1', employee: 'Dr. Aminata Diallo', semaine: 'S33 2026', lundi: 'Matin 08h-14h', mardi: 'Matin 08h-14h', mercredi: 'Repos', jeudi: 'Matin 08h-14h', vendredi: 'Matin 08h-14h', samedi: 'Repos', dimanche: 'Repos' },
  { id: 'sch2', employee: 'Ibrahima Sow', semaine: 'S33 2026', lundi: 'Soir 14h-20h', mardi: 'Soir 14h-20h', mercredi: 'Soir 14h-20h', jeudi: 'Repos', vendredi: 'Repos', samedi: 'Nuit 20h-08h', dimanche: 'Nuit 20h-08h' },
  { id: 'sch3', employee: 'Fatou Ndiaye', semaine: 'S33 2026', lundi: 'Matin 08h-16h', mardi: 'Matin 08h-16h', mercredi: 'Matin 08h-16h', jeudi: 'Matin 08h-16h', vendredi: 'Matin 08h-16h', samedi: 'Repos', dimanche: 'Repos' },
];

const leaves = [
  { id: 'l1', employee: 'Dr. Moussa Traoré', type: 'Congé annuel', debut: '01/08/2026', fin: '20/08/2026', jours: 20, statut: 'approuvé', motif: 'Congé estival' },
  { id: 'l2', employee: 'Aïssatou Ba', type: 'Congé maladie', debut: '05/08/2026', fin: '08/08/2026', jours: 4, statut: 'approuvé', motif: 'Certificat médical fourni' },
  { id: 'l3', employee: 'Ibrahima Sow', type: 'Congé formation', debut: '15/09/2026', fin: '17/09/2026', jours: 3, statut: 'en_attente', motif: 'Formation ACLS Dakar' },
  { id: 'l4', employee: 'Fatou Ndiaye', type: 'Absence justifiée', debut: '10/08/2026', fin: '10/08/2026', jours: 1, statut: 'approuvé', motif: 'Obligation familiale' },
];

const competencies = [
  { id: 'comp1', employee: 'Dr. Aminata Diallo', competence: 'Médecine interne', niveau: 5, certifié: true, expiration: '2028', formation: 'Spécialisation CHU Dakar' },
  { id: 'comp2', employee: 'Dr. Aminata Diallo', competence: 'Téléconsultation SHIFA', niveau: 4, certifié: true, expiration: '2027', formation: 'SHIFA Academy' },
  { id: 'comp3', employee: 'Ibrahima Sow', competence: 'Soins infirmiers urgences', niveau: 4, certifié: true, expiration: '2026', formation: 'IFSI Dakar' },
  { id: 'comp4', employee: 'Ibrahima Sow', competence: 'ACLS / Réanimation', niveau: 3, certifié: false, expiration: '—', formation: 'En cours' },
  { id: 'comp5', employee: 'Aïssatou Ba', competence: 'Biologie médicale', niveau: 4, certifié: true, expiration: '2027', formation: 'Université Cheikh Anta Diop' },
  { id: 'comp6', employee: 'Dr. Moussa Traoré', competence: 'Chirurgie générale', niveau: 5, certifié: true, expiration: '2029', formation: 'Spécialisation Paris' },
];

const payroll = [
  { id: 'pay1', employee: 'Dr. Aminata Diallo', brut: 850000, cotisations: 127500, net: 722500, mois: 'Août 2026', statut: 'versé' },
  { id: 'pay2', employee: 'Ibrahima Sow', brut: 420000, cotisations: 63000, net: 357000, mois: 'Août 2026', statut: 'versé' },
  { id: 'pay3', employee: 'Fatou Ndiaye', brut: 380000, cotisations: 57000, net: 323000, mois: 'Août 2026', statut: 'versé' },
  { id: 'pay4', employee: 'Dr. Moussa Traoré', brut: 950000, cotisations: 142500, net: 807500, mois: 'Août 2026', statut: 'en_attente' },
  { id: 'pay5', employee: 'Aïssatou Ba', brut: 320000, cotisations: 48000, net: 272000, mois: 'Août 2026', statut: 'versé' },
];

const departments = [
  { name: 'Médecine interne', head: 'Dr. Aminata Diallo', staff: 12, beds: 40 },
  { name: 'Urgences', head: 'Dr. Karim Fall', staff: 18, beds: 20 },
  { name: 'Bloc opératoire', head: 'Dr. Moussa Traoré', staff: 9, beds: 6 },
  { name: 'Laboratoire', head: 'Aïssatou Ba', staff: 7, beds: 0 },
  { name: 'Administration', head: 'Fatou Ndiaye', staff: 5, beds: 0 },
  { name: 'Biomédical', head: 'Cheikh Diop', staff: 3, beds: 0 },
];

const STATUS_CONFIG = {
  active: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  inactive: { label: 'Inactif', bg: '#f1f5f9', text: '#64748b' },
  on_leave: { label: 'En congé', bg: '#fef9c3', text: '#a16207' },
};

const contractStatut: Record<string, { label: string; bg: string; text: string }> = {
  actif: { label: 'Actif', bg: '#dcfce7', text: '#16a34a' },
  renouvellement: { label: 'À renouveler', bg: '#fef9c3', text: '#ca8a04' },
  expiré: { label: 'Expiré', bg: '#fee2e2', text: '#dc2626' },
};

const leaveStatut: Record<string, { label: string; bg: string; text: string }> = {
  approuvé: { label: 'Approuvé', bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
  refusé: { label: 'Refusé', bg: '#fee2e2', text: '#dc2626' },
};

export default function OrgStaffDirectoryContent() {
  const [activeTab, setActiveTab] = useState<Tab>('directory');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'directory', label: 'Annuaire', icon: 'UsersIcon' },
    { key: 'contracts', label: 'Contrats', icon: 'DocumentTextIcon' },
    { key: 'schedules', label: 'Planning & Horaires', icon: 'CalendarDaysIcon' },
    { key: 'leaves', label: 'Congés & Absences', icon: 'ClockIcon' },
    { key: 'competencies', label: 'Compétences', icon: 'AcademicCapIcon' },
    { key: 'pay', label: 'Paie', icon: 'BanknotesIcon' },
  ];

  const filtered = staff.filter(s =>
    (filterDept === 'all' || s.department === filterDept) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>
            Annuaire & RH
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {staff.length} membres · {staff.filter(s => s.status === 'active').length} actifs · {departments.length} départements
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
          <Icon name="UserPlusIcon" size={16} />
          Inviter un membre
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total personnel', value: staff.length, icon: 'UsersIcon', color: '#dbeafe' },
          { label: 'Actifs', value: staff.filter(s => s.status === 'active').length, icon: 'CheckCircleIcon', color: '#dcfce7' },
          { label: 'En congé', value: staff.filter(s => s.status === 'on_leave').length, icon: 'CalendarDaysIcon', color: '#fef9c3' },
          { label: 'Inactifs', value: staff.filter(s => s.status === 'inactive').length, icon: 'XCircleIcon', color: '#fee2e2' },
        ].map((kpi, i) => (
          <div key={i} className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.color }}>
                <Icon name={kpi.icon as any} size={18} style={{ color: '#374151' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: activeTab === tab.key ? 'var(--primary)' : 'var(--card)',
              color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DIRECTORY ── */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                <input type="text" placeholder="Rechercher un membre..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm"
                  style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option value="all">Tous les départements</option>
                {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {filtered.map(member => {
                const sc = STATUS_CONFIG[member.status];
                return (
                  <div key={member.id} onClick={() => setSelectedMember(member)}
                    className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm"
                    style={{ background: selectedMember?.id === member.id ? 'var(--muted)' : 'var(--card)', borderColor: selectedMember?.id === member.id ? 'var(--primary)' : 'var(--border)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'var(--primary)' }}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{member.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{member.role} · {member.department} · {member.contractType}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            {selectedMember ? (
              <div className="rounded-2xl border p-5 space-y-5 h-fit" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{ background: 'var(--primary)' }}>
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{selectedMember.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedMember.role}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: STATUS_CONFIG[selectedMember.status].bg, color: STATUS_CONFIG[selectedMember.status].text }}>
                      {STATUS_CONFIG[selectedMember.status].label}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: 'BuildingOffice2Icon', label: 'Département', value: selectedMember.department },
                    { icon: 'DocumentTextIcon', label: 'Contrat', value: selectedMember.contractType },
                    { icon: 'BanknotesIcon', label: 'Salaire brut', value: `${selectedMember.salary.toLocaleString()} FCFA` },
                    { icon: 'EnvelopeIcon', label: 'Email', value: selectedMember.email },
                    { icon: 'PhoneIcon', label: 'Téléphone', value: selectedMember.phone },
                    { icon: 'CalendarDaysIcon', label: 'Membre depuis', value: selectedMember.joinDate },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--muted)' }}>
                        <Icon name={item.icon as any} size={14} style={{ color: 'var(--muted-foreground)' }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.permissions.map(p => (
                      <span key={p} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>Modifier</button>
                  <button className="px-3 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border flex items-center justify-center p-10" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-center">
                  <Icon name="UserCircleIcon" size={40} style={{ color: 'var(--muted-foreground)', margin: '0 auto 8px' }} />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un membre</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTRACTS ── */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Contrats de travail ({contracts.length})</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={13} /> Nouveau contrat
            </button>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Employé', 'Type', 'Début', 'Fin', 'Poste', 'Salaire brut', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contracts.map(c => {
                    const s = contractStatut[c.statut];
                    return (
                      <tr key={c.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{c.employee}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.type === 'CDI' ? '#dcfce7' : c.type === 'CDD' ? '#fef9c3' : '#dbeafe', color: c.type === 'CDI' ? '#16a34a' : c.type === 'CDD' ? '#ca8a04' : '#1d4ed8' }}>{c.type}</span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.start}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.end}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{c.poste}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: 'var(--foreground)' }}>{c.salaire.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg border text-xs" style={{ borderColor: 'var(--border)' }}>
                              <Icon name="ArrowDownTrayIcon" size={12} style={{ color: 'var(--muted-foreground)' }} />
                            </button>
                            <button className="p-1.5 rounded-lg border text-xs" style={{ borderColor: 'var(--border)' }}>
                              <Icon name="PencilIcon" size={12} style={{ color: 'var(--muted-foreground)' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULES ── */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition des effectifs par jour (semaine S33)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scheduleData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="jour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="matin" name="Matin" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="soir" name="Soir" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="nuit" name="Nuit" fill="#1e293b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Planning semaine S33 2026</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary)' }}>
                <Icon name="PlusIcon" size={13} /> Modifier planning
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Employé', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(h => (
                      <th key={h} className="text-left px-3 py-3 font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-3 py-3 font-medium" style={{ color: 'var(--foreground)' }}>{s.employee}</td>
                      {[s.lundi, s.mardi, s.mercredi, s.jeudi, s.vendredi, s.samedi, s.dimanche].map((shift, i) => (
                        <td key={i} className="px-3 py-3">
                          <span className="px-2 py-1 rounded-lg text-xs" style={{
                            backgroundColor: shift === 'Repos' ? 'var(--muted)' : shift.includes('Matin') ? '#dbeafe' : shift.includes('Soir') ? '#ede9fe' : '#1e293b',
                            color: shift === 'Repos' ? 'var(--muted-foreground)' : shift.includes('Matin') ? '#1d4ed8' : shift.includes('Soir') ? '#7c3aed' : '#fff',
                          }}>{shift}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── LEAVES ── */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Congés & Absences</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{leaves.filter(l => l.statut === 'en_attente').length} demande(s) en attente d'approbation</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={13} /> Nouvelle demande
            </button>
          </div>
          <div className="space-y-3">
            {leaves.map(l => {
              const s = leaveStatut[l.statut];
              return (
                <div key={l.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="CalendarDaysIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{l.employee}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{l.type}</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.debut} → {l.fin} · {l.jours} jour(s) · {l.motif}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    {l.statut === 'en_attente' && (
                      <>
                        <button className="px-2 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#16a34a' }}>Approuver</button>
                        <button className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Refuser</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Congés annuels restants', value: '18j', icon: 'SunIcon', color: '#f59e0b' },
              { label: 'Congés maladie utilisés', value: '4j', icon: 'HeartIcon', color: '#ef4444' },
              { label: 'Congés formation', value: '3j', icon: 'AcademicCapIcon', color: '#8b5cf6' },
              { label: 'Absences ce mois', value: '1j', icon: 'XCircleIcon', color: '#6b7280' },
            ].map((k, i) => (
              <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                  <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMPETENCIES ── */}
      {activeTab === 'competencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Compétences & Habilitations</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={13} /> Ajouter compétence
            </button>
          </div>
          <div className="space-y-3">
            {competencies.map(comp => (
              <div key={comp.id} className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(139,92,246,0.08)' }}>
                  <Icon name="AcademicCapIcon" size={18} style={{ color: '#8b5cf6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{comp.competence}</span>
                    {comp.certifié && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>✓ Certifié</span>}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{comp.employee} · {comp.formation} · Expiration : {comp.expiration}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: i < comp.niveau ? '#8b5cf6' : 'var(--border)' }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#8b5cf6' }}>{comp.niveau}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PAY ── */}
      {activeTab === 'pay' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Masse salariale brute', value: `${payroll.reduce((s, p) => s + p.brut, 0).toLocaleString()} FCFA`, icon: 'BanknotesIcon', color: '#10b981' },
              { label: 'Total cotisations', value: `${payroll.reduce((s, p) => s + p.cotisations, 0).toLocaleString()} FCFA`, icon: 'DocumentTextIcon', color: '#f59e0b' },
              { label: 'Net à payer', value: `${payroll.reduce((s, p) => s + p.net, 0).toLocaleString()} FCFA`, icon: 'CreditCardIcon', color: '#0ea5e9' },
              { label: 'Bulletins en attente', value: `${payroll.filter(p => p.statut === 'en_attente').length}`, icon: 'ClockIcon', color: '#dc2626' },
            ].map((k, i) => (
              <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: k.color + '20' }}>
                  <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                </div>
                <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{k.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Bulletins de paie — Août 2026</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary)' }}>
                <Icon name="ArrowDownTrayIcon" size={13} /> Exporter tout
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    {['Employé', 'Salaire brut', 'Cotisations', 'Net à payer', 'Mois', 'Statut', 'Bulletin'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payroll.map(p => {
                    const s = p.statut === 'versé' ? { bg: '#dcfce7', text: '#16a34a', label: 'Versé' } : { bg: '#fef9c3', text: '#ca8a04', label: 'En attente' };
                    return (
                      <tr key={p.id} className="border-t hover:bg-muted/40" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.employee}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{p.brut.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#dc2626' }}>-{p.cotisations.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: '#10b981' }}>{p.net.toLocaleString()} FCFA</td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.mois}</td>
                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span></td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 text-xs" style={{ color: 'var(--shifa-blue)' }}>
                            <Icon name="ArrowDownTrayIcon" size={12} /> PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
