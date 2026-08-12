'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'profile' | 'verification' | 'specialties' | 'organizations';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'profile', label: 'Profil', icon: 'UserCircleIcon' },
  { id: 'verification', label: 'Vérification', icon: 'ShieldCheckIcon' },
  { id: 'specialties', label: 'Spécialités', icon: 'AcademicCapIcon' },
  { id: 'organizations', label: 'Organisations', icon: 'BuildingOffice2Icon' },
];

const verificationSteps = [
  { id: 1, label: 'Identité vérifiée', status: 'done', date: '12/01/2025', icon: 'IdentificationIcon' },
  { id: 2, label: 'Diplôme médical', status: 'done', date: '15/01/2025', icon: 'AcademicCapIcon' },
  { id: 3, label: 'Numéro ONMS', status: 'done', date: '18/01/2025', icon: 'DocumentCheckIcon' },
  { id: 4, label: 'Organisation principale', status: 'done', date: '20/01/2025', icon: 'BuildingOffice2Icon' },
  { id: 5, label: 'Re-vérification annuelle', status: 'pending', date: 'Échéance: 20/01/2026', icon: 'ArrowPathIcon' },
];

const specialties = [
  { name: 'Médecine générale', level: 'Principal', since: '2018', certified: true },
  { name: 'Médecine interne', level: 'Secondaire', since: '2021', certified: true },
  { name: 'Télémédecine', level: 'Compétence', since: '2023', certified: false },
];

const organizations = [
  { name: 'CHU Saint-Louis', role: 'Médecin salarié', dept: 'Médecine interne', since: '2020', status: 'active', primary: true },
  { name: 'Cabinet Médical Plateau', role: 'Libéral', dept: 'Consultation générale', since: '2022', status: 'active', primary: false },
  { name: 'Clinique du Littoral', role: 'Vacataire', dept: 'Urgences', since: '2023', status: 'inactive', primary: false },
];

export default function ProProfileContent() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Profil Professionnel</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Gérez votre identité professionnelle SHIFA</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            <Icon name="ShieldCheckIcon" size={14} />
            Vérifié
          </span>
        </div>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
            MS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
                Médecin généraliste
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>ONMS N° 2018-SN-04521 · SHIFA ID: SH-P-SN-2018-9K2M</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-1.5"><Icon name="EnvelopeIcon" size={14} />dr.sy@shifa.health</span>
              <span className="flex items-center gap-1.5"><Icon name="PhoneIcon" size={14} />+221 77 000 00 00</span>
              <span className="flex items-center gap-1.5"><Icon name="MapPinIcon" size={14} />Dakar, Sénégal</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-muted"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            <Icon name="PencilSquareIcon" size={16} />
            {editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'shadow-sm' : ''}`}
            style={activeTab === t.id ? { backgroundColor: 'var(--card)', color: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={15} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Informations personnelles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Prénom', value: 'Mohamed' },
              { label: 'Nom', value: 'Sy' },
              { label: 'Date de naissance', value: '15/03/1985' },
              { label: 'Sexe', value: 'Masculin' },
              { label: 'Nationalité', value: 'Sénégalaise' },
              { label: 'Langue principale', value: 'Français' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                {editing ? (
                  <input defaultValue={f.value} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                ) : (
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.value}</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Biographie professionnelle</label>
            {editing ? (
              <textarea rows={3} defaultValue="Médecin généraliste avec 7 ans d'expérience, spécialisé en médecine interne et télémédecine." className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            ) : (
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>Médecin généraliste avec 7 ans d'expérience, spécialisé en médecine interne et télémédecine.</p>
            )}
          </div>
          {editing && (
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Annuler</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Enregistrer</button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Verification */}
      {activeTab === 'verification' && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Statut de vérification</h3>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Vérifié SHIFA</span>
          </div>
          <div className="space-y-3">
            {verificationSteps.map(step => (
              <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${step.status === 'done' ? '' : ''}`}
                  style={{ backgroundColor: step.status === 'done' ? '#dcfce7' : '#fef3c7' }}>
                  <Icon name={step.icon as any} size={18} style={{ color: step.status === 'done' ? '#16a34a' : '#d97706' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{step.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{step.date}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={step.status === 'done' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#fef3c7', color: '#d97706' }}>
                  {step.status === 'done' ? 'Validé' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.05)', border: '1px solid rgba(0,102,255,0.15)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--shifa-blue)' }}>Documents de vérification</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Pièce d'identité, diplôme, attestation ONMS — tous validés par l'équipe SHIFA.</p>
          </div>
        </div>
      )}

      {/* Tab: Specialties */}
      {activeTab === 'specialties' && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Spécialités & Compétences</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {specialties.map(s => (
              <div key={s.name} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                  <Icon name="AcademicCapIcon" size={18} style={{ color: 'var(--shifa-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Depuis {s.since} · {s.level}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.certified && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Certifié</span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{s.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Organizations */}
      {activeTab === 'organizations' && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Organisations rattachées</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} />Rejoindre
            </button>
          </div>
          <div className="space-y-3">
            {organizations.map(org => (
              <div key={org.name} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                      <Icon name="BuildingOffice2Icon" size={20} style={{ color: 'var(--shifa-blue)' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{org.name}</p>
                        {org.primary && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Principale</span>}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{org.role} · {org.dept}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Depuis {org.since}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full shrink-0" style={org.status === 'active' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {org.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
            <Icon name="InformationCircleIcon" size={14} className="inline mr-1" />
            Vous pouvez appartenir à plusieurs organisations avec un seul compte SHIFA. Chaque contexte est isolé.
          </div>
        </div>
      )}
    </div>
  );
}
