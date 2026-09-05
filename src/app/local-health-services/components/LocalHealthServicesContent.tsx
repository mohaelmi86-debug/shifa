'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'overview' | 'countries' | 'integrations' | 'config' | 'identity' | 'connectors';

interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  services: LocalService[];
  status: 'active' | 'partial' | 'planned';
}

interface LocalService {
  name: string;
  type: string;
  status: 'connected' | 'available' | 'planned';
  icon: string;
}

const countries: Country[] = [
  {
    code: 'SN', name: 'Sénégal', flag: '🇸🇳', region: 'Afrique de l\'Ouest', status: 'active',
    services: [
      { name: 'CNAM Sénégal', type: 'Assurance maladie', status: 'connected', icon: 'ShieldCheckIcon' },
      { name: 'Orange Money', type: 'Paiement mobile', status: 'connected', icon: 'BanknotesIcon' },
      { name: 'Wave', type: 'Paiement mobile', status: 'connected', icon: 'BanknotesIcon' },
      { name: 'Registre vaccination MSAS', type: 'Vaccination', status: 'available', icon: 'ShieldCheckIcon' },
      { name: 'SAMU 15', type: 'Urgences', status: 'planned', icon: 'BoltIcon' },
    ],
  },
  {
    code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', region: 'Afrique de l\'Ouest', status: 'active',
    services: [
      { name: 'CNAM CI', type: 'Assurance maladie', status: 'connected', icon: 'ShieldCheckIcon' },
      { name: 'MTN Mobile Money', type: 'Paiement mobile', status: 'connected', icon: 'BanknotesIcon' },
      { name: 'Moov Money', type: 'Paiement mobile', status: 'available', icon: 'BanknotesIcon' },
      { name: 'Pharmacie centrale CI', type: 'Pharmacie', status: 'planned', icon: 'ArchiveBoxIcon' },
    ],
  },
  {
    code: 'KM', name: 'Comores', flag: '🇰🇲', region: 'Océan Indien', status: 'partial',
    services: [
      { name: 'Hôpital El Maarouf', type: 'Hôpital public', status: 'connected', icon: 'BuildingOffice2Icon' },
      { name: 'Telecom Comores', type: 'Paiement mobile', status: 'available', icon: 'BanknotesIcon' },
      { name: 'Ministère Santé KM', type: 'Santé publique', status: 'planned', icon: 'BuildingLibraryIcon' },
    ],
  },
  {
    code: 'MA', name: 'Maroc', flag: '🇲🇦', region: 'Afrique du Nord', status: 'active',
    services: [
      { name: 'CNOPS / CNSS', type: 'Assurance maladie', status: 'connected', icon: 'ShieldCheckIcon' },
      { name: 'Maroc Telecom Money', type: 'Paiement mobile', status: 'connected', icon: 'BanknotesIcon' },
      { name: 'Registre national santé', type: 'Identité', status: 'available', icon: 'IdentificationIcon' },
      { name: 'RAMED', type: 'Aide médicale', status: 'available', icon: 'HeartIcon' },
    ],
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', status: 'active',
    services: [
      { name: 'Carte Vitale / CPAM', type: 'Assurance maladie', status: 'connected', icon: 'CreditCardIcon' },
      { name: 'Mon Espace Santé', type: 'Dossier médical', status: 'available', icon: 'FolderOpenIcon' },
      { name: 'SAMU 15', type: 'Urgences', status: 'connected', icon: 'BoltIcon' },
      { name: 'Doctolib', type: 'Rendez-vous', status: 'available', icon: 'CalendarDaysIcon' },
      { name: 'Stripe', type: 'Paiement', status: 'connected', icon: 'CreditCardIcon' },
    ],
  },
  {
    code: 'TN', name: 'Tunisie', flag: '🇹🇳', region: 'Afrique du Nord', status: 'partial',
    services: [
      { name: 'CNAM Tunisie', type: 'Assurance maladie', status: 'connected', icon: 'ShieldCheckIcon' },
      { name: 'Poste Tunisienne', type: 'Paiement', status: 'available', icon: 'BanknotesIcon' },
      { name: 'Ministère Santé TN', type: 'Santé publique', status: 'planned', icon: 'BuildingLibraryIcon' },
    ],
  },
];

const serviceStatusConfig: Record<LocalService['status'], { label: string; color: string; bg: string; icon: string }> = {
  connected: { label: 'Connecté', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  available: { label: 'Disponible', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
  planned: { label: 'Planifié', color: '#64748b', bg: '#f1f5f9', icon: 'CalendarDaysIcon' },
};

const countryStatusConfig: Record<Country['status'], { label: string; color: string; bg: string }> = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7' },
  partial: { label: 'Partiel', color: '#d97706', bg: '#fef3c7' },
  planned: { label: 'Planifié', color: '#64748b', bg: '#f1f5f9' },
};

const integrationModes = [
  {
    title: 'SHIFA → Service local → SHIFA',
    icon: 'ArrowsRightLeftIcon',
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'SHIFA délègue une opération à un service local (paiement, rendez-vous, vaccination) et récupère le résultat dans l\'écosystème SHIFA.',
    example: 'Patient paie via Orange Money → SHIFA enregistre le paiement → Reçu SHIFA généré',
  },
  {
    title: 'SHIFA → Système national → SHIFA',
    icon: 'BuildingLibraryIcon',
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'SHIFA s\'intègre au système national de santé (assurance, vaccination, identité) avec synchronisation bidirectionnelle.',
    example: 'Consultation SHIFA → Déclaration CNAM → Remboursement → Mise à jour dossier SHIFA',
  },
  {
    title: 'SHIFA → Établissement local',
    icon: 'BuildingOffice2Icon',
    color: '#0891b2',
    bg: '#cffafe',
    description: 'SHIFA se connecte directement à un établissement de santé local (hôpital, clinique, laboratoire) sans passer par un système national.',
    example: 'Demande d\'analyse SHIFA → LIS local → Résultats → Dossier patient SHIFA',
  },
];

export default function LocalHealthServicesContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(countries[0]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'GlobeAltIcon' },
    { id: 'countries', label: 'Par pays', icon: 'MapPinIcon' },
    { id: 'integrations', label: 'Modes d\'intégration', icon: 'ArrowsRightLeftIcon' },
    { id: 'connectors', label: 'Connecteurs actifs', icon: 'BoltIcon' },
    { id: 'config', label: 'Configuration', icon: 'Cog6ToothIcon' },
    { id: 'identity', label: 'Identité SHIFA', icon: 'ShieldCheckIcon' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Services de Santé Locaux</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            SHIFA s'intègre aux infrastructures de santé existantes dans chaque pays — sans les remplacer
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ backgroundColor: '#dbeafe', borderColor: '#2563eb' }}>
          <Icon name="ShieldCheckIcon" size={16} style={{ color: '#2563eb' }} />
          <span className="text-sm font-semibold" style={{ color: '#1d4ed8' }}>Identité SHIFA préservée</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pays couverts', value: String(countries.length), icon: 'GlobeAltIcon', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Services connectés', value: String(countries.flatMap(c => c.services).filter(s => s.status === 'connected').length), icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Services disponibles', value: String(countries.flatMap(c => c.services).filter(s => s.status === 'available').length), icon: 'ClockIcon', color: '#d97706', bg: '#fef3c7' },
          { label: 'Intégrations planifiées', value: String(countries.flatMap(c => c.services).filter(s => s.status === 'planned').length), icon: 'CalendarDaysIcon', color: '#64748b', bg: '#f1f5f9' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color }} />
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Principe fondamental</h2>
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#dbeafe', border: '1px solid #2563eb' }}>
              <Icon name="InformationCircleIcon" size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1d4ed8' }}>SHIFA ne remplace pas les systèmes locaux — il s'y intègre</p>
                <p className="text-xs" style={{ color: '#1e40af' }}>
                  L'utilisateur voit toujours SHIFA Health OS comme son environnement principal. Même lorsqu'un service externe est utilisé, l'identité SHIFA est préservée dans l'expérience utilisateur.
                </p>
                <div className="mt-2 px-3 py-2 rounded-lg text-xs font-mono" style={{ backgroundColor: '#1d4ed8', color: 'white' }}>
                  Service fourni par [organisme local] — intégré à SHIFA
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {countries.map(country => {
              const s = countryStatusConfig[country.status];
              const connected = country.services.filter(sv => sv.status === 'connected').length;
              return (
                <div
                  key={country.code}
                  onClick={() => { setSelectedCountry(country); setActiveTab('countries'); }}
                  className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{country.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{country.region}</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <Icon name="CheckCircleIcon" size={12} style={{ color: '#16a34a' }} />
                    {connected} service{connected > 1 ? 's' : ''} connecté{connected > 1 ? 's' : ''}
                    <span className="ml-auto">{country.services.length} au total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Countries */}
      {activeTab === 'countries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Country list */}
          <div className="space-y-2">
            {countries.map(country => {
              const s = countryStatusConfig[country.status];
              return (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
                  style={{
                    backgroundColor: selectedCountry?.code === country.code ? '#dbeafe' : 'var(--card)',
                    borderColor: selectedCountry?.code === country.code ? '#2563eb' : 'var(--border)',
                  }}
                >
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{country.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{country.region}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Country detail */}
          {selectedCountry && (
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selectedCountry.flag}</span>
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{selectedCountry.name}</h2>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedCountry.region}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedCountry.services.map(service => {
                    const s = serviceStatusConfig[service.status];
                    return (
                      <div key={service.name} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                          <Icon name={service.icon as any} size={18} style={{ color: 'var(--shifa-blue)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{service.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{service.type}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>
                          <Icon name={s.icon as any} size={12} />
                          {s.label}
                        </span>
                        {service.status !== 'connected' && (
                          <button className="text-xs px-3 py-1.5 rounded-lg font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                            {service.status === 'available' ? 'Connecter' : 'Planifier'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Integration modes */}
      {activeTab === 'integrations' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrationModes.map(mode => (
              <div key={mode.title} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: mode.bg }}>
                    <Icon name={mode.icon as any} size={20} style={{ color: mode.color }} />
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{mode.title}</h3>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{mode.description}</p>
                <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: mode.bg, color: mode.color }}>
                  <span className="font-semibold">Exemple: </span>{mode.example}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Types d'intégration possibles</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Lecture seule', icon: 'ArrowDownTrayIcon', color: '#2563eb', bg: '#dbeafe' },
                { label: 'Écriture seule', icon: 'ArrowUpTrayIcon', color: '#7c3aed', bg: '#ede9fe' },
                { label: 'Bidirectionnel', icon: 'ArrowsRightLeftIcon', color: '#16a34a', bg: '#dcfce7' },
                { label: 'Sync partielle', icon: 'ArrowPathIcon', color: '#d97706', bg: '#fef3c7' },
                { label: 'Sync complète', icon: 'CloudArrowUpIcon', color: '#0891b2', bg: '#cffafe' },
              ].map(type => (
                <div key={type.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border text-center" style={{ backgroundColor: type.bg, borderColor: type.color }}>
                  <Icon name={type.icon as any} size={24} style={{ color: type.color }} />
                  <span className="text-xs font-semibold" style={{ color: type.color }}>{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Config */}
      {activeTab === 'config' && (
        <div className="space-y-5 max-w-2xl">
          <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Configuration par pays</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Pays</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                {countries.map(c => <option key={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Devise locale</label>
              <input type="text" placeholder="Ex: XOF, MAD, EUR..." className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Fuseau horaire</label>
              <select className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                <option>Africa/Dakar (UTC+0)</option>
                <option>Africa/Abidjan (UTC+0)</option>
                <option>Indian/Comoro (UTC+3)</option>
                <option>Africa/Casablanca (UTC+1)</option>
                <option>Europe/Paris (UTC+2)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Réglementation applicable</label>
              <div className="space-y-2">
                {['RGPD (Europe)', 'Loi informatique & libertés locale', 'Réglementation médicale nationale', 'Normes ISO 27001', 'HL7 FHIR'].map(reg => (
                  <label key={reg} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" defaultChecked={reg.includes('RGPD') || reg.includes('HL7')} />
                    <span style={{ color: 'var(--foreground)' }}>{reg}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              Enregistrer la configuration
            </button>
          </div>
        </div>
      )}

      {/* Tab: Identity */}
      {activeTab === 'identity' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Préservation de l'identité SHIFA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Expérience utilisateur unifiée', icon: 'UserCircleIcon', color: '#2563eb', items: ['L\'utilisateur voit toujours SHIFA Health OS', 'Navigation et interface SHIFA préservées', 'Logo et couleurs SHIFA maintenus', 'SHIFA ID conservé comme identifiant principal'] },
                { title: 'Transparence des services locaux', icon: 'InformationCircleIcon', color: '#d97706', items: ['Bandeau "Service fourni par [organisme]"', 'Indication claire de l\'intégration externe', 'Retour vers SHIFA après le service', 'Données synchronisées dans le dossier SHIFA'] },
                { title: 'Sécurité & Consentement', icon: 'ShieldCheckIcon', color: '#16a34a', items: ['Consentement explicite avant tout partage', 'Données minimisées transmises au service local', 'Révocation possible à tout moment', 'Audit trail de toutes les interactions'] },
                { title: 'Continuité du dossier', icon: 'FolderOpenIcon', color: '#7c3aed', items: ['Résultats du service local intégrés au dossier SHIFA', 'Historique complet dans SHIFA', 'Pas de perte de données lors du retour', 'Synchronisation automatique'] },
              ].map(section => (
                <div key={section.title} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name={section.icon as any} size={18} style={{ color: section.color }} />
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{section.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name="CheckCircleIcon" size={12} style={{ color: section.color, marginTop: '2px' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Example UI banner */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Exemple d'affichage dans SHIFA</h3>
            <div className="rounded-xl border p-4" style={{ backgroundColor: '#f0f9ff', borderColor: '#0ea5e9' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>S</div>
                <span className="font-bold text-sm" style={{ color: 'var(--shifa-blue)' }}>SHIFA Health OS</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#dbeafe', border: '1px solid #2563eb' }}>
                <Icon name="InformationCircleIcon" size={14} style={{ color: '#2563eb' }} />
                <span style={{ color: '#1d4ed8' }}>
                  <strong>Service fourni par CNAM Sénégal</strong> — intégré à SHIFA · Vos données restent dans votre dossier SHIFA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONNECTORS TAB ── */}
      {activeTab === 'connectors' && (
        <div className="space-y-5">
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Connecteurs locaux actifs</h2>
            <div className="space-y-3">
              {[
                {
                  name: 'CNAM Sénégal — Assurance maladie',
                  type: 'Assurance',
                  country: '🇸🇳 Sénégal',
                  protocol: 'REST API + OAuth 2.0',
                  status: 'connected',
                  lastSync: 'Il y a 2 min',
                  dataFlow: 'SHIFA → Déclaration → CNAM → Remboursement → SHIFA',
                  scopes: ['Déclaration actes', 'Vérification droits', 'Remboursements'],
                  color: '#16a34a',
                },
                {
                  name: 'Orange Money — Paiement mobile',
                  type: 'Paiement',
                  country: '🇸🇳 Sénégal / 🇨🇮 CI',
                  protocol: 'REST API + Webhook',
                  status: 'connected',
                  lastSync: 'Il y a 5 min',
                  dataFlow: 'SHIFA → Initiation paiement → Orange Money → Confirmation → SHIFA Finance',
                  scopes: ['Initiation paiement', 'Vérification statut', 'Remboursement'],
                  color: '#f59e0b',
                },
                {
                  name: 'Carte Vitale / CPAM — France',
                  type: 'Assurance',
                  country: '🇫🇷 France',
                  protocol: 'SESAM-Vitale + REST',
                  status: 'connected',
                  lastSync: 'Il y a 1 min',
                  dataFlow: 'SHIFA → Lecture carte → CPAM → Droits → SHIFA',
                  scopes: ['Lecture droits', 'Télétransmission', 'Feuille de soins'],
                  color: '#2563eb',
                },
                {
                  name: 'CNOPS / CNSS — Maroc',
                  type: 'Assurance',
                  country: '🇲🇦 Maroc',
                  protocol: 'SOAP/XML + REST',
                  status: 'connected',
                  lastSync: 'Il y a 8 min',
                  dataFlow: 'SHIFA → Vérification adhérent → CNOPS → Prise en charge → SHIFA',
                  scopes: ['Vérification adhérent', 'Taux remboursement', 'Accord préalable'],
                  color: '#dc2626',
                },
                {
                  name: 'Hôpital El Maarouf — Comores',
                  type: 'Établissement',
                  country: '🇰🇲 Comores',
                  protocol: 'HL7 FHIR R4',
                  status: 'connected',
                  lastSync: 'Il y a 15 min',
                  dataFlow: 'SHIFA → Demande admission → HIS El Maarouf → Confirmation → SHIFA',
                  scopes: ['Admissions', 'Résultats', 'Transferts'],
                  color: '#0891b2',
                },
                {
                  name: 'Registre vaccination MSAS — Sénégal',
                  type: 'Santé publique',
                  country: '🇸🇳 Sénégal',
                  protocol: 'REST API',
                  status: 'available',
                  lastSync: '—',
                  dataFlow: 'SHIFA → Déclaration vaccination → MSAS → Mise à jour registre national',
                  scopes: ['Déclaration vaccinations', 'Consultation carnet'],
                  color: '#7c3aed',
                },
              ].map(connector => (
                <div key={connector.name} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{connector.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: connector.status === 'connected' ? '#dcfce7' : '#fef3c7', color: connector.status === 'connected' ? '#16a34a' : '#d97706' }}>
                          {connector.status === 'connected' ? '● Connecté' : '○ Disponible'}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{connector.country} · {connector.type} · {connector.protocol}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière sync</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{connector.lastSync}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg mb-3 font-mono text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {connector.dataFlow}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {connector.scopes.map(scope => (
                      <span key={scope} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: connector.color + '15', color: connector.color }}>
                        {scope}
                      </span>
                    ))}
                    <div className="ml-auto flex gap-2">
                      <button className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Config</button>
                      <button className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Tester</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add connector */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Ajouter un nouveau connecteur local</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nom du service', placeholder: 'Ex: CNAM Côte d\'Ivoire' },
                { label: 'Pays', placeholder: 'Ex: Côte d\'Ivoire' },
                { label: 'Type', placeholder: 'Assurance / Paiement / Établissement / Santé publique' },
                { label: 'Protocole', placeholder: 'REST API / HL7 FHIR / SOAP / Webhook' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full px-3 py-2 text-sm rounded-xl border outline-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
              <Icon name="PlusIcon" size={14} /> Ajouter le connecteur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
