'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'etablissement' | 'securite' | 'notifications' | 'integrations' | 'sauvegarde';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'etablissement', label: 'Établissement', icon: 'BuildingOffice2Icon' },
  { key: 'securite', label: 'Sécurité & Accès', icon: 'ShieldCheckIcon' },
  { key: 'notifications', label: 'Notifications', icon: 'BellIcon' },
  { key: 'integrations', label: 'Intégrations', icon: 'PuzzlePieceIcon' },
  { key: 'sauvegarde', label: 'Sauvegarde', icon: 'CircleStackIcon' },
];

function EtablissementTab() {
  const [form, setForm] = useState({
    name: 'CHU Saint-Louis', type: 'Centre Hospitalier Universitaire',
    address: 'Avenue Blaise Diagne, Saint-Louis', city: 'Saint-Louis',
    country: 'Sénégal', phone: '+221 33 961 00 00', email: 'contact@chu-saintlouis.sn',
    website: 'www.chu-saintlouis.sn', beds: '450', staff: '320',
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Nom de l'établissement</label>
            <input className="input-field w-full text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Type d'établissement</label>
            <select className="input-field w-full text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option>Centre Hospitalier Universitaire</option>
              <option>Centre Hospitalier Régional</option>
              <option>Clinique privée</option>
              <option>Centre de santé</option>
              <option>Dispensaire</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Ville</label>
            <input className="input-field w-full text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Adresse complète</label>
            <input className="input-field w-full text-sm" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Téléphone</label>
            <input className="input-field w-full text-sm" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>E-mail institutionnel</label>
            <input type="email" className="input-field w-full text-sm" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Capacité (lits)</label>
            <input type="number" className="input-field w-full text-sm" value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Effectif total</label>
            <input type="number" className="input-field w-full text-sm" value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))} />
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
  const [policies, setPolicies] = useState({
    mfa: true, sessionTimeout: '30', passwordExpiry: '90',
    ipWhitelist: false, auditLog: true, dataEncryption: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Politique de sécurité</h3>
        <div className="flex flex-col gap-4">
          {[
            { key: 'mfa', label: 'Authentification à deux facteurs obligatoire', desc: 'Tous les utilisateurs doivent activer le 2FA' },
            { key: 'ipWhitelist', label: 'Restriction par adresse IP', desc: 'Limiter l\'accès aux IPs autorisées uniquement' },
            { key: 'auditLog', label: 'Journal d\'audit complet', desc: 'Enregistrer toutes les actions utilisateurs' },
            { key: 'dataEncryption', label: 'Chiffrement des données sensibles', desc: 'Chiffrement AES-256 pour les dossiers patients' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
              </div>
              <button
                onClick={() => setPolicies(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                className="relative w-10 h-5 rounded-full transition-colors shrink-0"
                style={{ backgroundColor: policies[item.key as keyof typeof policies] ? 'var(--shifa-blue)' : 'var(--muted)' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                  style={{ left: policies[item.key as keyof typeof policies] ? '22px' : '2px' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Paramètres de session</h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Expiration session (min)</label>
            <select className="input-field w-full text-sm" value={policies.sessionTimeout} onChange={e => setPolicies(p => ({ ...p, sessionTimeout: e.target.value }))}>
              <option value="15">15 min</option><option value="30">30 min</option><option value="60">1 heure</option><option value="120">2 heures</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Expiration mot de passe (j)</label>
            <select className="input-field w-full text-sm" value={policies.passwordExpiry} onChange={e => setPolicies(p => ({ ...p, passwordExpiry: e.target.value }))}>
              <option value="30">30 jours</option><option value="60">60 jours</option><option value="90">90 jours</option><option value="180">180 jours</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn-primary text-sm px-5 py-2">
            <Icon name="CheckIcon" size={15} />
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    newUser: true, securityAlert: true, systemUpdate: true,
    weeklyReport: true, moduleAlert: false, capacityAlert: true,
  });

  const items = [
    { key: 'newUser', label: 'Nouvel utilisateur inscrit', desc: 'Quand un nouveau compte est créé' },
    { key: 'securityAlert', label: 'Alertes de sécurité', desc: 'Tentatives de connexion suspectes' },
    { key: 'systemUpdate', label: 'Mises à jour système', desc: 'Nouvelles versions et maintenances planifiées' },
    { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé d\'activité de l\'établissement' },
    { key: 'moduleAlert', label: 'Alertes modules', desc: 'Erreurs ou dysfonctionnements des modules' },
    { key: 'capacityAlert', label: 'Alerte capacité', desc: 'Quand le taux d\'occupation dépasse 90%' },
  ];

  return (
    <div className="card-base">
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Notifications administrateur</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.key} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
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
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: 'SUPABASE', desc: 'Base de données et authentification', status: 'connected', icon: 'CircleStackIcon', color: 'var(--shifa-green)' },
    { name: 'OpenAI', desc: 'Intelligence artificielle médicale', status: 'connected', icon: 'SparklesIcon', color: 'var(--shifa-blue)' },
    { name: 'SMS Gateway', desc: 'Notifications SMS patients', status: 'disconnected', icon: 'DevicePhoneMobileIcon', color: 'var(--shifa-amber)' },
    { name: 'HL7 FHIR', desc: 'Interopérabilité des données de santé', status: 'disconnected', icon: 'ArrowsRightLeftIcon', color: 'var(--shifa-purple)' },
    { name: 'DICOM', desc: 'Imagerie médicale', status: 'disconnected', icon: 'PhotoIcon', color: 'var(--shifa-cyan)' },
  ];

  return (
    <div className="card-base">
      <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Services connectés</h3>
      <div className="flex flex-col gap-3">
        {integrations.map(intg => (
          <div key={intg.name} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${intg.color}15` }}>
                <Icon name={intg.icon as any} size={18} style={{ color: intg.color } as any} className="" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{intg.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{intg.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge-base text-xs ${intg.status === 'connected' ? 'status-active' : 'status-cancelled'}`}>
                {intg.status === 'connected' ? 'Connecté' : 'Déconnecté'}
              </span>
              <button className="btn-secondary text-xs px-3 py-1.5">
                {intg.status === 'connected' ? 'Configurer' : 'Connecter'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SauvegardeTab() {
  const backups = [
    { date: '10 août 2026, 02:00', size: '2.4 Go', type: 'Automatique', status: 'success' },
    { date: '09 août 2026, 02:00', size: '2.3 Go', type: 'Automatique', status: 'success' },
    { date: '08 août 2026, 02:00', size: '2.3 Go', type: 'Automatique', status: 'success' },
    { date: '07 août 2026, 14:32', size: '2.2 Go', type: 'Manuelle', status: 'success' },
    { date: '06 août 2026, 02:00', size: '2.2 Go', type: 'Automatique', status: 'failed' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Historique des sauvegardes</h3>
          <button className="btn-primary text-xs px-3 py-1.5">
            <Icon name="ArrowPathIcon" size={13} />
            Sauvegarder maintenant
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-thin rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Taille', 'Type', 'Statut', ''].map(col => (
                  <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.map((b, idx) => (
                <tr key={idx} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{b.date}</td>
                  <td className="px-3 py-3 text-xs font-tabular" style={{ color: 'var(--muted-foreground)' }}>{b.size}</td>
                  <td className="px-3 py-3">
                    <span className="badge-base text-xs" style={{ backgroundColor: b.type === 'Manuelle' ? 'rgba(0,102,255,0.1)' : 'var(--muted)', color: b.type === 'Manuelle' ? 'var(--shifa-blue)' : 'var(--muted-foreground)' }}>
                      {b.type}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`badge-base text-xs ${b.status === 'success' ? 'status-active' : 'status-cancelled'}`}>
                      {b.status === 'success' ? 'Réussi' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {b.status === 'success' && (
                      <button className="text-xs font-medium" style={{ color: 'var(--shifa-blue)' }}>
                        <Icon name="ArrowDownTrayIcon" size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-base">
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Planification des sauvegardes</h3>
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Fréquence</label>
            <select className="input-field w-full text-sm">
              <option>Quotidienne</option><option>Hebdomadaire</option><option>Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Heure</label>
            <input type="time" className="input-field w-full text-sm" defaultValue="02:00" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Rétention (jours)</label>
            <select className="input-field w-full text-sm">
              <option>7 jours</option><option>30 jours</option><option>90 jours</option><option>365 jours</option>
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

export default function AdminParametresContent() {
  const [activeTab, setActiveTab] = useState<Tab>('etablissement');

  const renderTab = () => {
    switch (activeTab) {
      case 'etablissement': return <EtablissementTab />;
      case 'securite': return <SecuriteTab />;
      case 'notifications': return <NotificationsTab />;
      case 'integrations': return <IntegrationsTab />;
      case 'sauvegarde': return <SauvegardeTab />;
    }
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Paramètres de l'établissement</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Configuration globale — CHU Saint-Louis</p>
      </div>

      <div className="flex gap-6 flex-col xl:flex-row">
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
        <div className="flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
