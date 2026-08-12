'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// Types
// ============================================================
type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
type ProfessionalStatus = 'active' | 'pending' | 'suspended' | 'inactive';

interface ProfessionalInvitation {
  id: string;
  name: string;
  email: string;
  profession: string;
  department: string;
  role: string;
  status: InvitationStatus;
  invitedAt: string;
  invitedBy: string;
}

interface OrgRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  isSystem: boolean;
}

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  memberCount: number;
  isActive: boolean;
}

// ============================================================
// Mock data
// ============================================================
const mockInvitations: ProfessionalInvitation[] = [
  { id: 'inv-001', name: 'Dr. Aminata Kouyaté', email: 'a.kouyate@chu-saintlouis.sn', profession: 'Médecin', department: 'Pédiatrie', role: 'Médecin senior', status: 'pending', invitedAt: '08 août 2026', invitedBy: 'Admin CHU' },
  { id: 'inv-002', name: 'Samba Diallo', email: 's.diallo@chu-saintlouis.sn', profession: 'Infirmier', department: 'Urgences', role: 'Infirmier chef', status: 'accepted', invitedAt: '05 août 2026', invitedBy: 'Admin CHU' },
  { id: 'inv-003', name: 'Dr. Rokhaya Ndiaye', email: 'r.ndiaye@chu-saintlouis.sn', profession: 'Sage-femme', department: 'Maternité', role: 'Sage-femme', status: 'pending', invitedAt: '10 août 2026', invitedBy: 'Admin CHU' },
  { id: 'inv-004', name: 'Dr. Cheikh Sow', email: 'c.sow@chu-saintlouis.sn', profession: 'Médecin', department: 'Cardiologie', role: 'Cardiologue', status: 'rejected', invitedAt: '01 août 2026', invitedBy: 'Admin CHU' },
  { id: 'inv-005', name: 'Mariama Bah', email: 'm.bah@chu-saintlouis.sn', profession: 'Laborantine', department: 'Biologie', role: 'Technicienne labo', status: 'expired', invitedAt: '15 juil. 2026', invitedBy: 'Admin CHU' },
];

const mockRoles: OrgRole[] = [
  { id: 'role-001', name: 'Médecin senior', description: 'Accès complet aux dossiers patients et prescriptions', permissions: ['read:patients', 'write:consultations', 'write:prescriptions', 'read:results', 'sign:documents'], memberCount: 12, isSystem: false },
  { id: 'role-002', name: 'Infirmier(ère)', description: 'Accès aux soins infirmiers et constantes', permissions: ['read:patients', 'write:nursing_care', 'read:prescriptions', 'write:vitals'], memberCount: 18, isSystem: false },
  { id: 'role-003', name: 'Administrateur établissement', description: 'Gestion complète de l\'établissement', permissions: ['admin:users', 'admin:modules', 'admin:roles', 'admin:departments', 'read:audit'], memberCount: 2, isSystem: true },
  { id: 'role-004', name: 'Pharmacien', description: 'Gestion des médicaments et dispensation', permissions: ['read:prescriptions', 'write:dispensation', 'read:stock', 'write:stock'], memberCount: 4, isSystem: false },
  { id: 'role-005', name: 'Laborantin', description: 'Saisie et validation des résultats biologiques', permissions: ['read:lab_orders', 'write:lab_results', 'validate:results'], memberCount: 6, isSystem: false },
];

const mockDepartments: Department[] = [
  { id: 'dept-001', name: 'Médecine Générale', description: 'Consultations externes et médecine interne', head: 'Dr. Mohamed Sy', memberCount: 15, isActive: true },
  { id: 'dept-002', name: 'Urgences', description: 'Prise en charge des urgences médicales et chirurgicales', head: 'Dr. Ibrahima Fall', memberCount: 24, isActive: true },
  { id: 'dept-003', name: 'Pédiatrie', description: 'Soins spécialisés pour les enfants de 0 à 18 ans', head: 'Dr. Fatou Mbaye', memberCount: 10, isActive: true },
  { id: 'dept-004', name: 'Maternité', description: 'Suivi grossesse, accouchement et néonatologie', head: 'Mme. Rokhaya Ndiaye', memberCount: 14, isActive: true },
  { id: 'dept-005', name: 'Cardiologie', description: 'Diagnostic et traitement des maladies cardiovasculaires', head: 'Dr. Jean Kouassi', memberCount: 8, isActive: true },
  { id: 'dept-006', name: 'Biologie Médicale', description: 'Analyses biologiques et examens de laboratoire', head: 'Oumar Traoré', memberCount: 7, isActive: true },
];

const permissionGroups = [
  { group: 'Patients', permissions: ['read:patients', 'write:patients', 'delete:patients'] },
  { group: 'Consultations', permissions: ['read:consultations', 'write:consultations', 'sign:documents'] },
  { group: 'Prescriptions', permissions: ['read:prescriptions', 'write:prescriptions', 'validate:prescriptions'] },
  { group: 'Résultats', permissions: ['read:results', 'write:lab_results', 'validate:results'] },
  { group: 'Administration', permissions: ['admin:users', 'admin:modules', 'admin:roles', 'admin:departments', 'read:audit'] },
];

const statusColors: Record<InvitationStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: 'En attente' },
  accepted: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', label: 'Accepté' },
  rejected: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', label: 'Refusé' },
  expired: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Expiré' },
};

// ============================================================
// Sub-components
// ============================================================

function InviteModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', profession: '', department: '', role: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!form.email || !form.profession) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      if (supabase) {
        // Supabase integration point: insert professional_organizations invitation
      }
      await new Promise(r => setTimeout(r, 800));
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="rounded-2xl border w-full max-w-md p-6 animate-fade-in" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
              <Icon name="CheckIcon" size={28} style={{ color: '#10B981' } as any} className="" />
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--shifa-dark)' }}>Invitation envoyée</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Une invitation a été envoyée à <strong>{form.email}</strong>
            </p>
            <button className="btn-primary px-6 py-2 text-sm" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Inviter un professionnel</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { key: 'name', label: 'Nom complet', placeholder: 'Dr. Prénom Nom', type: 'text' },
                { key: 'email', label: 'Adresse e-mail professionnelle', placeholder: 'prenom.nom@etablissement.sn', type: 'email' },
                { key: 'profession', label: 'Profession', placeholder: 'Médecin, Infirmier(ère)...', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{field.label}</label>
                  <input
                    type={field.type}
                    className="input-field w-full text-sm"
                    placeholder={field.placeholder}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Département</label>
                <select
                  className="input-field w-full text-sm"
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                >
                  <option value="">Sélectionner un département</option>
                  {mockDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Rôle assigné</label>
                <select
                  className="input-field w-full text-sm"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Sélectionner un rôle</option>
                  {mockRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button className="flex-1 btn-secondary py-2.5 text-sm" onClick={onClose}>Annuler</button>
              <button
                className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60"
                onClick={handleSend}
                disabled={isLoading || !form.email}
              >
                {isLoading ? <Icon name="ArrowPathIcon" size={15} className="animate-spin" /> : (
                  <><Icon name="PaperAirplaneIcon" size={15} />Envoyer l'invitation</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RoleModal({ role, onClose }: { role: OrgRole | null; onClose: () => void }) {
  const [activePerms, setActivePerms] = useState<string[]>(role?.permissions || []);
  const isNew = !role;

  const togglePerm = (perm: string) => {
    setActivePerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="rounded-2xl border w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>
            {isNew ? 'Créer un rôle' : `Modifier : ${role?.name}`}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Icon name="XMarkIcon" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {!isNew && (
          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{role?.description}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--foreground)' }}>{role?.memberCount} membre(s) avec ce rôle</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {permissionGroups.map(group => (
            <div key={group.group}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--muted-foreground)' }}>{group.group}</p>
              <div className="flex flex-col gap-1.5">
                {group.permissions.map(perm => (
                  <label key={perm} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      checked={activePerms.includes(perm)}
                      onChange={() => togglePerm(perm)}
                      disabled={role?.isSystem}
                    />
                    <span className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="flex-1 btn-secondary py-2.5 text-sm" onClick={onClose}>Annuler</button>
          <button
            className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-50"
            disabled={role?.isSystem}
            onClick={onClose}
          >
            <Icon name="CheckIcon" size={15} />
            {role?.isSystem ? 'Rôle système (non modifiable)' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
type AdminTab = 'invitations' | 'roles' | 'departments';

export default function ProfessionalManagement() {
  const [activeTab, setActiveTab] = useState<AdminTab>('invitations');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<OrgRole | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [invitations, setInvitations] = useState(mockInvitations);

  const pendingCount = invitations.filter(i => i.status === 'pending').length;

  const handleApprove = (id: string) => {
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: 'accepted' as InvitationStatus } : i));
  };

  const handleReject = (id: string) => {
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' as InvitationStatus } : i));
  };

  return (
    <>
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
      {showRoleModal && <RoleModal role={selectedRole} onClose={() => { setShowRoleModal(false); setSelectedRole(null); }} />}

      <div className="card-base">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--shifa-dark)' }}>Gestion des professionnels</h2>
            {pendingCount > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-amber)' }}>
                <Icon name="ExclamationCircleIcon" size={12} className="inline mr-1" />
                {pendingCount} invitation(s) en attente d'approbation
              </p>
            )}
          </div>
          <button className="btn-primary text-sm px-4 py-2" onClick={() => setShowInviteModal(true)}>
            <Icon name="UserPlusIcon" size={15} />
            Inviter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
          {([
            { key: 'invitations', label: 'Invitations', badge: pendingCount },
            { key: 'roles', label: 'Rôles & Permissions' },
            { key: 'departments', label: 'Départements' },
          ] as { key: AdminTab; label: string; badge?: number }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
                color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-white text-xs font-bold" style={{ backgroundColor: 'var(--shifa-amber)', fontSize: '9px' }}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── INVITATIONS TAB ── */}
        {activeTab === 'invitations' && (
          <div className="flex flex-col gap-2">
            {invitations.map(inv => {
              const sc = statusColors[inv.status];
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
                  >
                    {inv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{inv.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inv.profession} · {inv.department} · {inv.role}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{inv.email} · Invité le {inv.invitedAt}</p>
                  </div>
                  {inv.status === 'pending' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApprove(inv.id)}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                      >
                        <Icon name="CheckIcon" size={12} />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(inv.id)}
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
                      >
                        <Icon name="XMarkIcon" size={12} />
                        Refuser
                      </button>
                    </div>
                  )}
                  {inv.status === 'expired' && (
                    <button className="text-xs font-semibold px-2.5 py-1.5 rounded-lg shrink-0" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      Renvoyer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── ROLES TAB ── */}
        {activeTab === 'roles' && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <button
                className="btn-secondary text-xs px-3 py-2"
                onClick={() => { setSelectedRole(null); setShowRoleModal(true); }}
              >
                <Icon name="PlusIcon" size={13} />
                Nouveau rôle
              </button>
            </div>
            {mockRoles.map(role => (
              <div
                key={role.id}
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                  <Icon name="ShieldCheckIcon" size={17} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{role.name}</p>
                    {role.isSystem && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>
                        Système
                      </span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{role.memberCount} membre(s)</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{role.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {role.permissions.slice(0, 4).map(p => (
                      <span key={p} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: '9px' }}>
                        {p}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', fontSize: '9px' }}>
                        +{role.permissions.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
                  onClick={() => { setSelectedRole(role); setShowRoleModal(true); }}
                  title="Modifier les permissions"
                >
                  <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── DEPARTMENTS TAB ── */}
        {activeTab === 'departments' && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <button className="btn-secondary text-xs px-3 py-2">
                <Icon name="PlusIcon" size={13} />
                Nouveau département
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockDepartments.map(dept => (
                <div
                  key={dept.id}
                  className="flex items-start gap-3 p-4 rounded-xl border"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.08)' }}>
                    <Icon name="BuildingOffice2Icon" size={17} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{dept.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${dept.isActive ? 'status-active' : 'status-cancelled'}`}>
                        {dept.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{dept.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="flex items-center gap-1">
                        <Icon name="UserCircleIcon" size={11} />
                        {dept.head}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="UsersIcon" size={11} />
                        {dept.memberCount} membres
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
                    <Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
