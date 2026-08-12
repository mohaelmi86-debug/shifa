'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import ShifaBrand from '@/components/ui/ShifaBrand';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Department {
  id: string;
  name: string;
  head: string;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professional' | 'staff';
  department: string;
}

interface OrgConfig {
  // Step 1 — Institution
  institutionName: string;
  institutionShortName: string;
  facilityType: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  // Step 2 — Branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoFile: File | null;
  logoPreview: string;
  // Step 3 — Departments
  departments: Department[];
  // Step 4 — Team
  teamMembers: TeamMember[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FACILITY_TYPES = [
  { value: 'chu', label: 'CHU — Centre Hospitalier Universitaire', icon: 'BuildingOffice2Icon' },
  { value: 'ch', label: 'CH — Centre Hospitalier', icon: 'BuildingOfficeIcon' },
  { value: 'clinique', label: 'Clinique privée', icon: 'HomeModernIcon' },
  { value: 'cabinet', label: 'Cabinet médical', icon: 'HomeIcon' },
  { value: 'polyclinique', label: 'Polyclinique', icon: 'BuildingStorefrontIcon' },
  { value: 'dispensaire', label: 'Dispensaire / Centre de santé', icon: 'MapPinIcon' },
  { value: 'laboratoire', label: 'Laboratoire d\'analyses', icon: 'BeakerIcon' },
  { value: 'pharmacie', label: 'Pharmacie', icon: 'ShoppingBagIcon' },
];

const PRESET_COLORS = [
  { name: 'SHIFA Blue', value: '#0066FF' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Indigo', value: '#4338CA' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Slate', value: '#334155' },
];

const DEPT_COLORS = ['#0066FF', '#0D9488', '#7C3AED', '#E11D48', '#D97706', '#059669', '#0891B2', '#9333EA'];

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Médecine Générale', head: '', color: '#0066FF' },
  { id: 'd2', name: 'Urgences', head: '', color: '#E11D48' },
  { id: 'd3', name: 'Chirurgie', head: '', color: '#0D9488' },
];

const STEPS = [
  { id: 1, label: 'Institution', icon: 'BuildingOffice2Icon' },
  { id: 2, label: 'Identité visuelle', icon: 'SwatchIcon' },
  { id: 3, label: 'Départements', icon: 'RectangleGroupIcon' },
  { id: 4, label: 'Équipe', icon: 'UserGroupIcon' },
  { id: 5, label: 'Confirmation', icon: 'CheckBadgeIcon' },
];

// ─── Step 1 — Institution Info ─────────────────────────────────────────────────

function StepInstitution({ config, onChange }: { config: OrgConfig; onChange: (k: keyof OrgConfig, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Informations de l'établissement</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Renseignez les informations officielles de votre institution.</p>
      </div>

      {/* Facility type */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Type d'établissement <span style={{ color: 'var(--shifa-red)' }}>*</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {FACILITY_TYPES.map(ft => (
            <button
              key={ft.value}
              onClick={() => onChange('facilityType', ft.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all duration-150 ${config.facilityType === ft.value ? 'border-[var(--shifa-blue)] bg-blue-50' : 'border-[var(--border)] hover:border-[var(--shifa-blue)]/40'}`}
            >
              <Icon name={ft.icon as any} size={22} className={config.facilityType === ft.value ? 'text-[var(--shifa-blue)]' : 'text-[var(--muted-foreground)]'} />
              <span className={`text-xs font-medium leading-tight ${config.facilityType === ft.value ? 'text-[var(--shifa-blue)]' : 'text-[var(--muted-foreground)]'}`}>{ft.label.split(' — ')[0]}</span>
            </button>
          ))}
        </div>
        {config.facilityType && (
          <p className="mt-2 text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>
            {FACILITY_TYPES.find(f => f.value === config.facilityType)?.label}
          </p>
        )}
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom complet <span style={{ color: 'var(--shifa-red)' }}>*</span></label>
          <input
            className="input-field"
            placeholder="ex. Centre Hospitalier Universitaire de Dakar"
            value={config.institutionName}
            onChange={e => onChange('institutionName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Nom abrégé</label>
          <input
            className="input-field"
            placeholder="ex. CHU Dakar"
            value={config.institutionShortName}
            onChange={e => onChange('institutionShortName', e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Pays</label>
          <input className="input-field" placeholder="ex. Sénégal" value={config.country} onChange={e => onChange('country', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Ville</label>
          <input className="input-field" placeholder="ex. Dakar" value={config.city} onChange={e => onChange('city', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Adresse</label>
          <input className="input-field" placeholder="ex. Avenue Cheikh Anta Diop" value={config.address} onChange={e => onChange('address', e.target.value)} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone</label>
          <input className="input-field" placeholder="+221 33 xxx xx xx" value={config.phone} onChange={e => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email officiel</label>
          <input className="input-field" type="email" placeholder="contact@institution.sn" value={config.email} onChange={e => onChange('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Site web</label>
          <input className="input-field" placeholder="https://www.institution.sn" value={config.website} onChange={e => onChange('website', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Branding ─────────────────────────────────────────────────────────

function StepBranding({ config, onChange }: { config: OrgConfig; onChange: (k: keyof OrgConfig, v: any) => void }) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange('logoFile', file);
    const reader = new FileReader();
    reader.onload = ev => onChange('logoPreview', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Identité visuelle</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Personnalisez les couleurs et le logo de votre espace institutionnel.</p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Logo de l'établissement</label>
        <div className="flex items-start gap-5">
          {/* Preview */}
          <div
            className="w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden"
            style={{ borderColor: config.logoPreview ? 'var(--shifa-blue)' : 'var(--border)', backgroundColor: 'var(--muted)' }}
          >
            {config.logoPreview ? (
              <img src={config.logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
            ) : (
              <Icon name="PhotoIcon" size={28} className="text-[var(--muted-foreground)]" />
            )}
          </div>
          {/* Upload zone */}
          <div className="flex-1">
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-[var(--shifa-blue)]/60 hover:bg-blue-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <Icon name="ArrowUpTrayIcon" size={22} className="text-[var(--shifa-blue)]" />
              <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Glissez votre logo ici</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PNG, SVG, JPG — max 2 Mo — fond transparent recommandé</span>
            </label>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            {config.logoFile && (
              <div className="mt-2 flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} className="text-[var(--shifa-green)]" />
                <span className="text-xs font-medium" style={{ color: 'var(--shifa-green)' }}>{config.logoFile.name}</span>
                <button onClick={() => { onChange('logoFile', null); onChange('logoPreview', ''); }} className="ml-auto text-xs text-red-500 hover:underline">Supprimer</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { key: 'primaryColor' as keyof OrgConfig, label: 'Couleur principale', desc: 'Boutons, liens actifs' },
          { key: 'secondaryColor' as keyof OrgConfig, label: 'Couleur secondaire', desc: 'Fonds, badges' },
          { key: 'accentColor' as keyof OrgConfig, label: 'Couleur d\'accent', desc: 'Highlights, notifications' },
        ].map(({ key, label, desc }) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{label}</label>
            <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
            {/* Preset swatches */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.value}
                  title={c.name}
                  onClick={() => onChange(key, c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${(config[key] as string) === c.value ? 'border-[var(--foreground)] scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            {/* Custom color input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config[key] as string}
                onChange={e => onChange(key, e.target.value)}
                className="w-9 h-9 rounded-lg border cursor-pointer p-0.5"
                style={{ borderColor: 'var(--border)' }}
              />
              <input
                className="input-field flex-1 font-mono text-xs"
                value={config[key] as string}
                onChange={e => onChange(key, e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live preview card */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Aperçu de la carte d'identité</label>
        <div
          className="rounded-2xl p-5 flex items-center gap-4 shadow-shifa"
          style={{ background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)` }}
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
            {config.logoPreview ? (
              <img src={config.logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Icon name="BuildingOffice2Icon" size={26} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-bold text-white text-base leading-tight">{config.institutionName || 'Nom de l\'établissement'}</p>
            <p className="text-white/70 text-xs mt-0.5">{config.institutionShortName || 'Abrégé'} · {FACILITY_TYPES.find(f => f.value === config.facilityType)?.label.split(' — ')[0] || 'Type'}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.accentColor }} />
              <span className="text-white/80 text-xs">Espace SHIFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 — Departments ──────────────────────────────────────────────────────

function StepDepartments({ config, onChange }: { config: OrgConfig; onChange: (k: keyof OrgConfig, v: any) => void }) {
  const addDept = () => {
    const newDept: Department = {
      id: `d${Date.now()}`,
      name: '',
      head: '',
      color: DEPT_COLORS[config.departments.length % DEPT_COLORS.length],
    };
    onChange('departments', [...config.departments, newDept]);
  };

  const updateDept = (id: string, field: keyof Department, value: string) => {
    onChange('departments', config.departments.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDept = (id: string) => {
    onChange('departments', config.departments.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Structure des départements</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Définissez les services et unités de votre établissement.</p>
        </div>
        <button onClick={addDept} className="btn-primary shrink-0 text-sm">
          <Icon name="PlusIcon" size={16} />
          Ajouter
        </button>
      </div>

      {/* Department list */}
      <div className="space-y-3">
        {config.departments.map((dept, idx) => (
          <div
            key={dept.id}
            className="rounded-xl border p-4 flex items-center gap-3 group transition-all"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            {/* Color dot + picker */}
            <div className="relative shrink-0">
              <input
                type="color"
                value={dept.color}
                onChange={e => updateDept(dept.id, 'color', e.target.value)}
                className="w-8 h-8 rounded-full border-2 cursor-pointer p-0"
                style={{ borderColor: dept.color }}
                title="Couleur du département"
              />
            </div>

            {/* Number */}
            <span className="text-xs font-bold w-5 text-center shrink-0" style={{ color: 'var(--muted-foreground)' }}>{idx + 1}</span>

            {/* Name */}
            <input
              className="input-field flex-1 min-w-0"
              placeholder="Nom du département / service"
              value={dept.name}
              onChange={e => updateDept(dept.id, 'name', e.target.value)}
            />

            {/* Head */}
            <input
              className="input-field w-44 shrink-0 hidden sm:block"
              placeholder="Responsable"
              value={dept.head}
              onChange={e => updateDept(dept.id, 'head', e.target.value)}
            />

            {/* Remove */}
            <button
              onClick={() => removeDept(dept.id)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              title="Supprimer"
            >
              <Icon name="TrashIcon" size={16} className="text-red-400" />
            </button>
          </div>
        ))}

        {config.departments.length === 0 && (
          <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <Icon name="RectangleGroupIcon" size={32} className="text-[var(--muted-foreground)] mx-auto mb-2" />
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Aucun département. Cliquez sur « Ajouter » pour commencer.</p>
          </div>
        )}
      </div>

      {/* Summary chips */}
      {config.departments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {config.departments.filter(d => d.name).map(d => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: d.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 4 — Team Assignments ─────────────────────────────────────────────────

function StepTeam({ config, onChange }: { config: OrgConfig; onChange: (k: keyof OrgConfig, v: any) => void }) {
  const addMember = () => {
    const newMember: TeamMember = {
      id: `m${Date.now()}`,
      name: '',
      email: '',
      role: 'professional',
      department: config.departments[0]?.name || '',
    };
    onChange('teamMembers', [...config.teamMembers, newMember]);
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    onChange('teamMembers', config.teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMember = (id: string) => {
    onChange('teamMembers', config.teamMembers.filter(m => m.id !== id));
  };

  const roleColors: Record<string, string> = {
    admin: 'var(--shifa-purple)',
    professional: 'var(--shifa-blue)',
    staff: 'var(--shifa-gray)',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    professional: 'Professionnel',
    staff: 'Personnel',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Équipe & Affectations</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Invitez les membres de votre équipe et assignez-les à leurs départements.</p>
        </div>
        <button onClick={addMember} className="btn-primary shrink-0 text-sm">
          <Icon name="UserPlusIcon" size={16} />
          Inviter
        </button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(roleLabels).map(([key, label]) => (
          <span key={key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: roleColors[key] }}>
            {label}
          </span>
        ))}
      </div>

      {/* Member rows */}
      <div className="space-y-3">
        {config.teamMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border p-4 group transition-all"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: roleColors[member.role] }}
              >
                {member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
              </div>

              {/* Name */}
              <input
                className="input-field flex-1 min-w-[140px]"
                placeholder="Nom complet"
                value={member.name}
                onChange={e => updateMember(member.id, 'name', e.target.value)}
              />

              {/* Email */}
              <input
                className="input-field flex-1 min-w-[160px]"
                type="email"
                placeholder="email@institution.sn"
                value={member.email}
                onChange={e => updateMember(member.id, 'email', e.target.value)}
              />

              {/* Role */}
              <select
                className="input-field w-36 shrink-0"
                value={member.role}
                onChange={e => updateMember(member.id, 'role', e.target.value as TeamMember['role'])}
              >
                <option value="admin">Administrateur</option>
                <option value="professional">Professionnel</option>
                <option value="staff">Personnel</option>
              </select>

              {/* Department */}
              <select
                className="input-field w-44 shrink-0"
                value={member.department}
                onChange={e => updateMember(member.id, 'department', e.target.value)}
              >
                <option value="">— Département —</option>
                {config.departments.filter(d => d.name).map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Remove */}
              <button
                onClick={() => removeMember(member.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shrink-0"
              >
                <Icon name="TrashIcon" size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {config.teamMembers.length === 0 && (
          <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <Icon name="UserGroupIcon" size={32} className="text-[var(--muted-foreground)] mx-auto mb-2" />
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Aucun membre. Cliquez sur « Inviter » pour ajouter des collaborateurs.</p>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {config.teamMembers.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(roleLabels).map(([key, label]) => {
            const count = config.teamMembers.filter(m => m.role === key).length;
            return (
              <div key={key} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-2xl font-bold" style={{ color: roleColors[key] }}>{count}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}{count !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Step 5 — Confirmation ─────────────────────────────────────────────────────

function StepConfirmation({ config }: { config: OrgConfig }) {
  const facilityLabel = FACILITY_TYPES.find(f => f.value === config.facilityType)?.label || '—';

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
          <Icon name={icon as any} size={16} className="text-[var(--shifa-blue)]" />
        </div>
        <h3 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Récapitulatif & Confirmation</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Vérifiez les informations avant de finaliser la configuration.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Institution */}
        <Section title="Institution" icon="BuildingOffice2Icon">
          <Row label="Nom" value={config.institutionName} />
          <Row label="Abrégé" value={config.institutionShortName} />
          <Row label="Type" value={facilityLabel} />
          <Row label="Ville" value={`${config.city}${config.country ? ', ' + config.country : ''}`} />
          <Row label="Email" value={config.email} />
        </Section>

        {/* Branding */}
        <Section title="Identité visuelle" icon="SwatchIcon">
          <div className="flex items-center gap-3 mb-3">
            {config.logoPreview ? (
              <img src={config.logoPreview} alt="Logo" className="w-12 h-12 rounded-xl object-contain border p-1" style={{ borderColor: 'var(--border)' }} />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                <Icon name="PhotoIcon" size={20} className="text-[var(--muted-foreground)]" />
              </div>
            )}
            <div className="flex gap-2">
              {[config.primaryColor, config.secondaryColor, config.accentColor].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} title={['Principale', 'Secondaire', 'Accent'][i]} />
              ))}
            </div>
          </div>
          <Row label="Couleur principale" value={config.primaryColor} />
          <Row label="Couleur secondaire" value={config.secondaryColor} />
          <Row label="Accent" value={config.accentColor} />
        </Section>

        {/* Departments */}
        <Section title={`Départements (${config.departments.filter(d => d.name).length})`} icon="RectangleGroupIcon">
          {config.departments.filter(d => d.name).length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun département configuré.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {config.departments.filter(d => d.name).map(d => (
                <span key={d.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: d.color }}>
                  {d.name}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Team */}
        <Section title={`Équipe (${config.teamMembers.length} membre${config.teamMembers.length !== 1 ? 's' : ''})`} icon="UserGroupIcon">
          {config.teamMembers.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Aucun membre invité.</p>
          ) : (
            <div className="space-y-1.5">
              {config.teamMembers.slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ backgroundColor: m.role === 'admin' ? 'var(--shifa-purple)' : m.role === 'professional' ? 'var(--shifa-blue)' : 'var(--shifa-gray)' }}>
                    {m.name ? m.name[0].toUpperCase() : '?'}
                  </div>
                  <span className="text-xs font-medium truncate flex-1" style={{ color: 'var(--foreground)' }}>{m.name || m.email || 'Sans nom'}</span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.department || '—'}</span>
                </div>
              ))}
              {config.teamMembers.length > 4 && (
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>+{config.teamMembers.length - 4} autres membres</p>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* CTA note */}
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
        <Icon name="InformationCircleIcon" size={18} className="text-[var(--shifa-blue)] shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: 'var(--shifa-blue)' }}>
          En cliquant sur <strong>Finaliser la configuration</strong>, votre espace institutionnel sera activé et les invitations envoyées aux membres de l'équipe.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function OrgOnboardingContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [config, setConfig] = useState<OrgConfig>({
    institutionName: '',
    institutionShortName: '',
    facilityType: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    primaryColor: '#0066FF',
    secondaryColor: '#0A4B9A',
    accentColor: '#00F2C3',
    logoFile: null,
    logoPreview: '',
    departments: DEFAULT_DEPARTMENTS,
    teamMembers: [],
  });

  const onChange = (key: keyof OrgConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (currentStep === 1) return config.institutionName.trim().length > 0 && config.facilityType.length > 0;
    return true;
  };

  const handleFinish = () => {
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-md w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-shifa-lg"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
          >
            <Icon name="CheckBadgeIcon" size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Configuration terminée !</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            L'espace institutionnel de <strong>{config.institutionName || 'votre établissement'}</strong> est maintenant configuré. Les invitations ont été envoyées à votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/administration-tablissement" className="btn-primary">
              <Icon name="Squares2X2Icon" size={16} />
              Accéder au tableau de bord
            </a>
            <button onClick={() => { setCompleted(false); setCurrentStep(1); }} className="btn-secondary">
              Reconfigurer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 lg:px-10 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <ShifaBrand variant="full" />
          <div className="h-5 w-px" style={{ backgroundColor: 'var(--border)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>Configuration initiale</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--shifa-cyan)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Premier lancement</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Configurez votre espace institutionnel</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Complétez les 4 étapes pour activer votre organisation sur SHIFA Health OS.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Progress line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 z-0" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, backgroundColor: 'var(--shifa-blue)' }}
            />
          </div>

          {STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
                <button
                  onClick={() => isDone && setCurrentStep(step.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    isDone ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor: isDone ? 'var(--shifa-blue)' : isActive ? 'var(--card)' : 'var(--muted)',
                    borderColor: isDone || isActive ? 'var(--shifa-blue)' : 'var(--border)',
                    boxShadow: isActive ? '0 0 0 4px rgba(0,102,255,0.15)' : 'none',
                  }}
                >
                  {isDone ? (
                    <Icon name="CheckIcon" size={14} className="text-white" />
                  ) : (
                    <Icon name={step.icon as any} size={14} className={isActive ? 'text-[var(--shifa-blue)]' : 'text-[var(--muted-foreground)]'} />
                  )}
                </button>
                <span className={`text-xs font-semibold hidden sm:block ${isActive ? 'text-[var(--shifa-blue)]' : isDone ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step content card */}
        <div className="rounded-2xl border p-6 sm:p-8 shadow-shifa" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {currentStep === 1 && <StepInstitution config={config} onChange={onChange} />}
          {currentStep === 2 && <StepBranding config={config} onChange={onChange} />}
          {currentStep === 3 && <StepDepartments config={config} onChange={onChange} />}
          {currentStep === 4 && <StepTeam config={config} onChange={onChange} />}
          {currentStep === 5 && <StepConfirmation config={config} />}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeftIcon" size={16} />
            Précédent
          </button>

          <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Étape {currentStep} / {STEPS.length}
          </span>

          {currentStep < STEPS.length ? (
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
              <Icon name="ChevronRightIcon" size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} className="btn-primary">
              <Icon name="CheckBadgeIcon" size={16} />
              Finaliser la configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
