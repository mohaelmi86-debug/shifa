'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  altPhone?: string;
  email?: string;
  priority: number;
  type: 'personal' | 'medical' | 'emergency_service';
  notes?: string;
  notifyOnAdmission: boolean;
  notifyOnEmergency: boolean;
}

const mockContacts: EmergencyContact[] = [
  {
    id: 'EC-001',
    name: 'Mamadou Diallo',
    relation: 'Époux',
    phone: '+221 77 123 45 67',
    altPhone: '+221 33 821 00 10',
    email: 'mamadou.diallo@email.com',
    priority: 1,
    type: 'personal',
    notes: 'Contacter en priorité absolue',
    notifyOnAdmission: true,
    notifyOnEmergency: true,
  },
  {
    id: 'EC-002',
    name: 'Aminata Diallo',
    relation: 'Mère',
    phone: '+221 76 234 56 78',
    priority: 2,
    type: 'personal',
    notifyOnAdmission: true,
    notifyOnEmergency: true,
  },
  {
    id: 'EC-003',
    name: 'Dr. Mohamed Sy',
    relation: 'Médecin traitant',
    phone: '+221 33 821 00 00',
    priority: 3,
    type: 'medical',
    notes: 'CHU Saint-Louis — Cardiologie',
    notifyOnAdmission: false,
    notifyOnEmergency: true,
  },
  {
    id: 'EC-004',
    name: 'SAMU',
    relation: 'Service d\'urgence',
    phone: '15',
    priority: 4,
    type: 'emergency_service',
    notifyOnAdmission: false,
    notifyOnEmergency: false,
  },
];

const typeConfig = {
  personal: { label: 'Personnel', icon: 'UserIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.1)' },
  medical: { label: 'Médical', icon: 'HeartIcon', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  emergency_service: { label: 'Service d\'urgence', icon: 'BoltIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
};

const priorityColors = ['#dc2626', '#f59e0b', '#16a34a', '#6b7280'];

export default function PatientEmergencyContactsContent() {
  const [contacts, setContacts] = useState(mockContacts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleNotify = (id: string, field: 'notifyOnAdmission' | 'notifyOnEmergency') => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: !c[field] } : c));
  };

  function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
      <button
        onClick={onChange}
        className="relative w-10 h-5 rounded-full transition-all duration-200 shrink-0"
        style={{ backgroundColor: checked ? 'var(--shifa-blue)' : 'var(--border)' }}
      >
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: checked ? '18px' : '2px' }} />
      </button>
    );
  }

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Contacts d'urgence</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#ef4444' }}>
              Accès rapide
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Personnes à contacter en cas d'urgence médicale</p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--shifa-blue)' }}
        >
          <Icon name="PlusIcon" size={16} />
          Ajouter un contact
        </button>
      </div>

      {/* Emergency banner */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Icon name="ExclamationTriangleIcon" size={20} style={{ color: '#ef4444' } as any} className="shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>En cas d'urgence</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Composez le <strong style={{ color: '#ef4444' }}>15 (SAMU)</strong> ou le <strong style={{ color: '#ef4444' }}>18 (Pompiers)</strong>. Ces contacts seront notifiés automatiquement si vous êtes hospitalisé(e).</p>
        </div>
        <a href="tel:15" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shrink-0" style={{ backgroundColor: '#ef4444' }}>
          <Icon name="PhoneIcon" size={14} />
          15
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Contacts actifs', value: String(contacts.length), icon: 'UsersIcon', color: 'var(--shifa-blue)' },
          { label: 'Notif. admission', value: String(contacts.filter(c => c.notifyOnAdmission).length), icon: 'BellIcon', color: '#16a34a' },
          { label: 'Notif. urgence', value: String(contacts.filter(c => c.notifyOnEmergency).length), icon: 'ExclamationTriangleIcon', color: '#dc2626' },
        ].map(stat => (
          <div key={stat.label} className="card-base p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}18` }}>
              <Icon name={stat.icon as any} size={20} style={{ color: stat.color } as any} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card-base p-6 mb-6">
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Nouveau contact d'urgence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Nom complet</label>
              <input type="text" placeholder="Prénom Nom" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Relation</label>
              <select className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option>Conjoint(e)</option>
                <option>Parent</option>
                <option>Enfant</option>
                <option>Ami(e) proche</option>
                <option>Médecin traitant</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone principal</label>
              <input type="tel" placeholder="+221 77 000 00 00" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone secondaire</label>
              <input type="tel" placeholder="+221 33 000 00 00" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold block mb-1.5" style={{ color: 'var(--foreground)' }}>Notes (optionnel)</label>
              <input type="text" placeholder="Ex: Disponible 24h/24, parle français et wolof" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              Enregistrer
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Contacts list */}
      <div className="space-y-4">
        {contacts.map((contact, index) => {
          const cfg = typeConfig[contact.type];
          const isEditing = editingId === contact.id;
          return (
            <div key={contact.id} className="card-base p-5">
              <div className="flex items-start gap-4">
                {/* Priority badge */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: priorityColors[index] || '#6b7280' }}
                  >
                    {contact.priority}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Priorité</span>
                </div>

                {/* Type icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                  <Icon name={cfg.icon as any} size={20} style={{ color: cfg.color } as any} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold" style={{ color: 'var(--foreground)' }}>{contact.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{contact.relation}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{cfg.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--shifa-blue)' }}>
                          <Icon name="PhoneIcon" size={14} />
                          {contact.phone}
                        </a>
                        {contact.altPhone && (
                          <a href={`tel:${contact.altPhone}`} className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            <Icon name="PhoneIcon" size={12} />
                            {contact.altPhone}
                          </a>
                        )}
                      </div>
                      {contact.notes && (
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{contact.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(isEditing ? null : contact.id)}
                        className="p-2 rounded-lg transition-all hover:bg-muted"
                      >
                        <Icon name="PencilIcon" size={14} className="text-muted-foreground" />
                      </button>
                      {contact.type !== 'emergency_service' && (
                        <button className="p-2 rounded-lg transition-all hover:bg-muted">
                          <Icon name="TrashIcon" size={14} style={{ color: '#dc2626' } as any} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification toggles */}
                  <div className="flex items-center gap-6 mt-3 pt-3 border-t flex-wrap" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <Toggle checked={contact.notifyOnAdmission} onChange={() => toggleNotify(contact.id, 'notifyOnAdmission')} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Notifier à l'admission</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle checked={contact.notifyOnEmergency} onChange={() => toggleNotify(contact.id, 'notifyOnEmergency')} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Notifier en urgence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)' }}>
        <div className="flex items-start gap-2">
          <Icon name="InformationCircleIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: 'var(--foreground)' }}>
            Vos contacts d'urgence sont accessibles aux professionnels de santé en cas d'urgence, même sans votre consentement préalable. Ils ne voient que les informations de contact, pas votre dossier médical.
          </p>
        </div>
      </div>
    </div>
  );
}
