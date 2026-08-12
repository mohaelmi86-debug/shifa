'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  priority: number;
}

const mockContacts: EmergencyContact[] = [
  { id: '1', name: 'Mamadou Diallo', relation: 'Époux', phone: '+221 77 123 45 67', priority: 1 },
  { id: '2', name: 'Aminata Diallo', relation: 'Mère', phone: '+221 76 234 56 78', priority: 2 },
  { id: '3', name: 'Dr. Mohamed Sy', relation: 'Médecin traitant', phone: '+221 33 821 00 00', priority: 3 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
      style={{ backgroundColor: checked ? 'var(--shifa-blue)' : 'var(--border)' }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: checked ? '22px' : '4px' }}
      />
    </button>
  );
}

export default function PatientEmergencyContent() {
  const [activeTab, setActiveTab] = useState<'card' | 'contacts' | 'info'>('card');
  const [shareConsent, setShareConsent] = useState(true);

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Urgences</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#ef4444' }}>
              Accès rapide
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Contacts d'urgence, informations critiques et carte d'urgence</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#ef4444' }}
        >
          <Icon name="PhoneIcon" size={16} />
          Appel d'urgence
        </button>
      </div>

      {/* Emergency alert banner */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Icon name="ExclamationTriangleIcon" size={20} style={{ color: '#ef4444' } as any} className="shrink-0" />
        <p className="text-sm" style={{ color: 'var(--foreground)' }}>
          <span className="font-bold">En cas d'urgence :</span> Composez le <span className="font-bold" style={{ color: '#ef4444' }}>15 (SAMU)</span> ou le <span className="font-bold" style={{ color: '#ef4444' }}>18 (Pompiers)</span>. Votre carte d'urgence SHIFA peut être présentée aux secouristes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'card', label: 'Carte d\'urgence', icon: 'IdentificationIcon' },
          { key: 'contacts', label: 'Contacts', icon: 'PhoneIcon' },
          { key: 'info', label: 'Infos médicales', icon: 'HeartIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'card' && (
        <div className="max-w-md">
          {/* Emergency card */}
          <div
            className="rounded-3xl overflow-hidden p-6 mb-4"
            style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)',
              boxShadow: '0 20px 60px rgba(239,68,68,0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Icon name="ExclamationTriangleIcon" size={18} className="text-white" />
                </div>
                <span className="text-white font-extrabold text-sm tracking-wide">URGENCE MÉDICALE</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>SHIFA</span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white border-2 shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                AD
              </div>
              <div>
                <p className="text-white font-extrabold text-lg">DIALLO Aïcha</p>
                <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>SH-2-225-FR-2025-7K4D</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Née le 12/03/1992</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Groupe sanguin', value: 'O+', critical: true },
                { label: 'Allergies', value: 'Pénicilline', critical: true },
                { label: 'Médecin traitant', value: 'Dr. M. Sy', critical: false },
                { label: 'Contact urgence', value: '+221 77 123 45 67', critical: false },
              ].map(item => (
                <div key={item.label} className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${item.critical ? 'text-yellow-300' : 'text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <Icon name="ShieldCheckIcon" size={14} className="text-white opacity-70 shrink-0" />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Informations vérifiées par SHIFA Health OS · Accès d'urgence autorisé</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}
            >
              <Icon name="ArrowDownTrayIcon" size={15} />
              Télécharger
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:shadow-sm"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
            >
              <Icon name="ShareIcon" size={15} />
              Partager
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Partage en cas d'urgence</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Autoriser les secouristes à accéder à cette carte</p>
            </div>
            <Toggle checked={shareConsent} onChange={() => setShareConsent(!shareConsent)} />
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="max-w-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>{mockContacts.length} contacts enregistrés</p>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
            >
              <Icon name="PlusIcon" size={15} />
              Ajouter
            </button>
          </div>

          {mockContacts.map(contact => (
            <div key={contact.id} className="card-base p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
              >
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{contact.name}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}
                  >
                    {contact.relation}
                  </span>
                  {contact.priority === 1 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                      Prioritaire
                    </span>
                  )}
                </div>
                <p className="text-sm mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>{contact.phone}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 rounded-xl transition-all hover:shadow-sm" style={{ backgroundColor: 'rgba(0,242,195,0.1)' }} title="Appeler">
                  <Icon name="PhoneIcon" size={16} style={{ color: 'var(--shifa-cyan)' } as any} className="" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Modifier">
                  <Icon name="PencilIcon" size={15} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="max-w-2xl flex flex-col gap-4">
          {/* Critical info */}
          <div className="card-base p-5" style={{ borderColor: 'rgba(239,68,68,0.3)', borderWidth: '1.5px' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
              <Icon name="ExclamationCircleIcon" size={18} />
              Informations critiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Groupe sanguin', value: 'O Positif (O+)', icon: 'HeartIcon', critical: true },
                { label: 'Allergies médicamenteuses', value: 'Pénicilline, Aspirine', icon: 'ExclamationTriangleIcon', critical: true },
                { label: 'Allergies alimentaires', value: 'Arachides', icon: 'ExclamationTriangleIcon', critical: true },
                { label: 'Maladies chroniques', value: 'Hypertension artérielle', icon: 'HeartIcon', critical: false },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: item.critical ? 'rgba(239,68,68,0.05)' : 'var(--muted)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={item.icon as any} size={14} style={{ color: item.critical ? '#ef4444' : 'var(--muted-foreground)' } as any} className="" />
                    <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: item.critical ? '#ef4444' : 'var(--foreground)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div className="card-base p-5">
            <h3 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Traitements en cours</h3>
            <div className="flex flex-col gap-2">
              {[
                { med: 'Amlodipine 5mg', dose: '1 cp/jour le matin', since: 'Depuis 01/2025' },
                { med: 'Ramipril 5mg', dose: '1 cp/jour le soir', since: 'Depuis 01/2025' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                    <Icon name="BeakerIcon" size={16} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{t.med}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.dose} · {t.since}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physician */}
          <div className="card-base p-5">
            <h3 className="font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Médecin traitant</h3>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
              >
                MS
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Dr. Mohamed Sy</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Médecin généraliste · Cabinet Médical Plateau</p>
                <p className="text-sm font-mono mt-0.5" style={{ color: 'var(--shifa-blue)' }}>+221 33 821 00 00</p>
              </div>
              <button className="p-2 rounded-xl transition-all hover:shadow-sm" style={{ backgroundColor: 'rgba(0,242,195,0.1)' }}>
                <Icon name="PhoneIcon" size={16} style={{ color: 'var(--shifa-cyan)' } as any} className="" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
