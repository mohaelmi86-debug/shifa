'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'profil' | 'securite' | 'notifications' | 'agenda' | 'confidentialite';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'profil', label: 'Profil professionnel', icon: 'UserCircleIcon' },
  { key: 'securite', label: 'Sécurité', icon: 'LockClosedIcon' },
  { key: 'notifications', label: 'Notifications', icon: 'BellIcon' },
  { key: 'agenda', label: 'Agenda & Disponibilités', icon: 'CalendarDaysIcon' },
  { key: 'confidentialite', label: 'Confidentialité', icon: 'ShieldCheckIcon' },
];

function ProfilTab() {
  const [form, setForm] = useState({
    firstName: 'Mohamed', lastName: 'Sy', title: 'Dr.',
    speciality: 'Médecin généraliste', rpps: 'RPPS-10012345',
    phone: '+221 77 123 45 67', email: 'dr.sy@chu-saintlouis.sn',
    department: 'Médecine Générale', bio: 'Médecin généraliste avec 12 ans d\'expérience en médecine interne et soins primaires.',
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="card-base flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
          MS
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Photo de profil</p>
          <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>JPG, PNG ou GIF · Max 2 Mo</p>
          <button className="btn-secondary text-xs px-3 py-1.5">
            <Icon name="ArrowUpTrayIcon" size={13} />
            Changer la photo
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Identité professionnelle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Titre</label>
            <select className="input-field w-full text-sm" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}>
              <option>Dr.</option><option>Pr.</option><option>M.</option><option>Mme</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Prénom</label>
            <input className="input-field w-full text-sm" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Nom de famille</label>
            <input className="input-field w-full text-sm" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Spécialité</label>
            <input className="input-field w-full text-sm" value={form.speciality} onChange={e => setForm(f => ({ ...f, speciality: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>N° RPPS</label>
            <input className="input-field w-full text-sm font-mono" value={form.rpps} onChange={e => setForm(f => ({ ...f, rpps: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Département</label>
            <input className="input-field w-full text-sm" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Biographie courte</label>
            <textarea className="input-field w-full text-sm resize-none" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary text-sm px-5 py-2">
            <Icon name="CheckIcon" size={15} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuriteTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Changer le mot de passe</h3>
        <div className="flex flex-col gap-3 max-w-md">
          {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le nouveau mot de passe'].map(label => (
            <div key={label}>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{label}</label>
              <input type="password" className="input-field w-full text-sm" placeholder="••••••••" />
            </div>
          ))}
          <button className="btn-primary text-sm px-5 py-2 self-start mt-1">
            <Icon name="LockClosedIcon" size={15} />
            Mettre à jour
          </button>
        </div>
      </div>
      <div className="card-base">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Authentification à deux facteurs</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Renforcez la sécurité de votre compte médical</p>
          </div>
          <button className="btn-primary text-xs px-4 py-2">Activer</button>
        </div>
      </div>
      <div className="card-base">
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>Sessions actives</h3>
        {[
          { device: 'Chrome · macOS', location: 'Dakar, Sénégal', time: 'Maintenant', current: true },
          { device: 'Safari · iPhone 14', location: 'Saint-Louis, Sénégal', time: 'Il y a 2h', current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                <Icon name="ComputerDesktopIcon" size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{s.device}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.location} · {s.time}</p>
              </div>
            </div>
            {s.current ? (
              <span className="badge-base status-active text-xs">Session actuelle</span>
            ) : (
              <button className="text-xs font-medium" style={{ color: 'var(--shifa-red)' }}>Révoquer</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    newPatient: true, appointmentReminder: true, urgentAlert: true,
    labResults: true, prescriptionExpiry: false, teamMessage: true,
    systemUpdate: false, weeklyReport: true,
  });

  const groups = [
    {
      title: 'Alertes cliniques',
      items: [
        { key: 'urgentAlert', label: 'Alertes urgentes', desc: 'Notifications critiques pour les patients en urgence' },
        { key: 'labResults', label: 'Résultats de laboratoire', desc: 'Nouveaux résultats biologiques disponibles' },
        { key: 'prescriptionExpiry', label: 'Expiration d\'ordonnances', desc: 'Rappel avant expiration des prescriptions actives' },
      ],
    },
    {
      title: 'Agenda & Patients',
      items: [
        { key: 'newPatient', label: 'Nouveau patient assigné', desc: 'Quand un patient vous est affecté' },
        { key: 'appointmentReminder', label: 'Rappels de rendez-vous', desc: '30 min avant chaque consultation' },
      ],
    },
    {
      title: 'Communication',
      items: [
        { key: 'teamMessage', label: 'Messages de l\'équipe', desc: 'Messagerie inter-professionnels' },
        { key: 'systemUpdate', label: 'Mises à jour système', desc: 'Nouvelles fonctionnalités et maintenances' },
        { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé de votre activité de la semaine' },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {groups.map(group => (
        <div key={group.title} className="card-base">
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--shifa-dark)' }}>{group.title}</h3>
          <div className="flex flex-col gap-3">
            {group.items.map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                  className="relative w-10 h-5 rounded-full transition-colors shrink-0"
                  style={{ backgroundColor: notifs[item.key as keyof typeof notifs] ? 'var(--shifa-blue)' : 'var(--muted)' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{ left: notifs[item.key as keyof typeof notifs] ? '22px' : '2px' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgendaTab() {
  const [slots, setSlots] = useState({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false,
  });
  const days = [
    { key: 'mon', label: 'Lundi' }, { key: 'tue', label: 'Mardi' }, { key: 'wed', label: 'Mercredi' },
    { key: 'thu', label: 'Jeudi' }, { key: 'fri', label: 'Vendredi' }, { key: 'sat', label: 'Samedi' }, { key: 'sun', label: 'Dimanche' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Jours de consultation</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => (
            <button
              key={d.key}
              onClick={() => setSlots(s => ({ ...s, [d.key]: !s[d.key as keyof typeof s] }))}
              className="flex flex-col items-center gap-1 py-3 rounded-xl border transition-all text-xs font-semibold"
              style={{
                borderColor: slots[d.key as keyof typeof slots] ? 'var(--shifa-blue)' : 'var(--border)',
                backgroundColor: slots[d.key as keyof typeof slots] ? 'rgba(0,102,255,0.08)' : 'var(--muted)',
                color: slots[d.key as keyof typeof slots] ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              {d.label.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Horaires de consultation</h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Début</label>
            <input type="time" className="input-field w-full text-sm" defaultValue="08:00" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Fin</label>
            <input type="time" className="input-field w-full text-sm" defaultValue="17:00" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Durée consultation</label>
            <select className="input-field w-full text-sm">
              <option>15 min</option><option>20 min</option><option selected>30 min</option><option>45 min</option><option>60 min</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Pause déjeuner</label>
            <select className="input-field w-full text-sm">
              <option>Aucune</option><option>12h–13h</option><option selected>13h–14h</option><option>12h30–13h30</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary text-sm px-5 py-2">
            <Icon name="CheckIcon" size={15} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfidentialiteTab() {
  const [prefs, setPrefs] = useState({
    shareStats: true, anonymizeReports: true, allowResearch: false, publicProfile: false,
  });

  const items = [
    { key: 'shareStats', label: 'Partager mes statistiques d\'activité', desc: 'Avec l\'administration de l\'établissement' },
    { key: 'anonymizeReports', label: 'Anonymiser dans les rapports', desc: 'Vos données apparaissent anonymisées dans les rapports institutionnels' },
    { key: 'allowResearch', label: 'Participer à la recherche médicale', desc: 'Vos données anonymisées peuvent être utilisées à des fins de recherche' },
    { key: 'publicProfile', label: 'Profil visible par les patients', desc: 'Les patients peuvent consulter votre profil public sur SHIFA' },
  ];

  return (
    <div className="card-base">
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Préférences de confidentialité</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
              className="relative w-10 h-5 rounded-full transition-colors shrink-0"
              style={{ backgroundColor: prefs[item.key as keyof typeof prefs] ? 'var(--shifa-blue)' : 'var(--muted)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                style={{ left: prefs[item.key as keyof typeof prefs] ? '22px' : '2px' }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProParametresContent() {
  const [activeTab, setActiveTab] = useState<Tab>('profil');

  const renderTab = () => {
    switch (activeTab) {
      case 'profil': return <ProfilTab />;
      case 'securite': return <SecuriteTab />;
      case 'notifications': return <NotificationsTab />;
      case 'agenda': return <AgendaTab />;
      case 'confidentialite': return <ConfidentialiteTab />;
    }
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Paramètres</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Gérez votre profil professionnel et vos préférences</p>
      </div>

      <div className="flex gap-6 flex-col xl:flex-row">
        {/* Sidebar tabs */}
        <div className="xl:w-56 shrink-0">
          <div className="card-base p-2 flex xl:flex-col gap-1 overflow-x-auto xl:overflow-visible">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap xl:whitespace-normal text-left"
                style={{
                  backgroundColor: activeTab === tab.key ? 'rgba(0,102,255,0.08)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
                }}
              >
                <Icon name={tab.icon as any} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
