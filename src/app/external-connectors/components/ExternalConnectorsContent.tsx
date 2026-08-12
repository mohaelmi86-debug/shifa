'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'overview' | 'connectors' | 'new' | 'logs' | 'security';

interface Connector {
  id: string;
  name: string;
  module: string;
  type: string;
  direction: 'read' | 'write' | 'bidirectional';
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync: string;
  country: string;
  icon: string;
}

const mockConnectors: Connector[] = [
  { id: 'CON-001', name: 'Stripe Payments', module: 'Finance', type: 'Paiement', direction: 'bidirectional', status: 'active', lastSync: '2025-08-12 09:00', country: 'Global', icon: 'CreditCardIcon' },
  { id: 'CON-002', name: 'LIS Externe — Biomnis', module: 'Laboratoire', type: 'LIS', direction: 'bidirectional', status: 'active', lastSync: '2025-08-12 08:45', country: 'France', icon: 'BeakerIcon' },
  { id: 'CON-003', name: 'PACS — Carestream', module: 'Imagerie', type: 'PACS/DICOM', direction: 'read', status: 'active', lastSync: '2025-08-12 07:30', country: 'Global', icon: 'PhotoIcon' },
  { id: 'CON-004', name: 'Assurance CNAM', module: 'Assurance', type: 'Tiers payant', direction: 'bidirectional', status: 'active', lastSync: '2025-08-12 09:10', country: 'Tunisie', icon: 'ShieldCheckIcon' },
  { id: 'CON-005', name: 'Identité Nationale — CNI', module: 'Identité', type: 'Identité numérique', direction: 'read', status: 'pending', lastSync: '—', country: 'Sénégal', icon: 'IdentificationIcon' },
  { id: 'CON-006', name: 'Registre Vaccination OMS', module: 'Vaccination', type: 'Registre national', direction: 'bidirectional', status: 'inactive', lastSync: '2025-08-10 14:00', country: 'Global', icon: 'ShieldCheckIcon' },
  { id: 'CON-007', name: 'Sage Comptabilité', module: 'Comptabilité', type: 'Logiciel comptable', direction: 'write', status: 'error', lastSync: '2025-08-11 18:00', country: 'France', icon: 'CalculatorIcon' },
  { id: 'CON-008', name: 'Orange Money', module: 'Finance', type: 'Mobile Money', direction: 'bidirectional', status: 'active', lastSync: '2025-08-12 09:05', country: 'Afrique de l\'Ouest', icon: 'BanknotesIcon' },
];

const statusConfig: Record<Connector['status'], { label: string; color: string; bg: string; icon: string }> = {
  active: { label: 'Actif', color: '#16a34a', bg: '#dcfce7', icon: 'CheckCircleIcon' },
  inactive: { label: 'Inactif', color: '#64748b', bg: '#f1f5f9', icon: 'MinusCircleIcon' },
  error: { label: 'Erreur', color: '#dc2626', bg: '#fee2e2', icon: 'XCircleIcon' },
  pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7', icon: 'ClockIcon' },
};

const directionConfig: Record<Connector['direction'], { label: string; icon: string }> = {
  read: { label: 'Lecture seule', icon: 'ArrowDownTrayIcon' },
  write: { label: 'Écriture seule', icon: 'ArrowUpTrayIcon' },
  bidirectional: { label: 'Bidirectionnel', icon: 'ArrowsRightLeftIcon' },
};

const connectorCategories = [
  { name: 'Finance & Paiement', icon: 'BanknotesIcon', color: '#16a34a', bg: '#dcfce7', examples: ['Stripe', 'PayPal', 'Mobile Money', 'Banque locale', 'Virement SEPA'] },
  { name: 'Laboratoire (LIS)', icon: 'BeakerIcon', color: '#2563eb', bg: '#dbeafe', examples: ['Biomnis', 'Cerba', 'LIS hospitalier', 'Automates Roche/Siemens'] },
  { name: 'Imagerie (PACS/DICOM)', icon: 'PhotoIcon', color: '#7c3aed', bg: '#ede9fe', examples: ['Carestream', 'Agfa', 'Philips PACS', 'Orthanc open-source'] },
  { name: 'Assurance & Tiers payant', icon: 'ShieldCheckIcon', color: '#0891b2', bg: '#cffafe', examples: ['CNAM', 'CNSS', 'Assureur privé', 'Mutuelle'] },
  { name: 'Identité nationale', icon: 'IdentificationIcon', color: '#d97706', bg: '#fef3c7', examples: ['CNI numérique', 'Passeport biométrique', 'Carte vitale'] },
  { name: 'Vaccination & Registres', icon: 'ShieldCheckIcon', color: '#dc2626', bg: '#fee2e2', examples: ['OMS GAVI', 'Registre national', 'Carnet vaccinal numérique'] },
  { name: 'Comptabilité & ERP', icon: 'CalculatorIcon', color: '#64748b', bg: '#f1f5f9', examples: ['Sage', 'SAP', 'Odoo', 'QuickBooks'] },
  { name: 'RH & Paie', icon: 'UsersIcon', color: '#7c3aed', bg: '#ede9fe', examples: ['Silae', 'ADP', 'Workday', 'Système RH local'] },
  { name: 'Urgences & SAMU', icon: 'BoltIcon', color: '#dc2626', bg: '#fee2e2', examples: ['SAMU 15', 'SMUR', 'Dispatch urgences', 'Ambulanciers'] },
  { name: 'Santé publique & Ministère', icon: 'BuildingLibraryIcon', color: '#2563eb', bg: '#dbeafe', examples: ['Système ministériel', 'Surveillance épidémio', 'Registre national'] },
  { name: 'Université & Formation', icon: 'AcademicCapIcon', color: '#16a34a', bg: '#dcfce7', examples: ['LMS universitaire', 'Registre étudiant', 'Plateforme e-learning'] },
  { name: 'Pharmacie & Médicaments', icon: 'ArchiveBoxIcon', color: '#d97706', bg: '#fef3c7', examples: ['Logiciel officine', 'Grossiste répartiteur', 'Base médicaments'] },
];

const logEntries = [
  { id: 'LOG-001', connector: 'Stripe Payments', action: 'Paiement synchronisé', status: 'success', timestamp: '2025-08-12 09:00:14', details: 'Transaction TXN-8821 — 45.00 EUR' },
  { id: 'LOG-002', connector: 'LIS Externe — Biomnis', action: 'Résultats reçus', status: 'success', timestamp: '2025-08-12 08:45:02', details: '3 résultats biologiques importés' },
  { id: 'LOG-003', connector: 'Sage Comptabilité', action: 'Export écritures', status: 'error', timestamp: '2025-08-11 18:00:33', details: 'Erreur authentification — token expiré' },
  { id: 'LOG-004', connector: 'Orange Money', action: 'Paiement reçu', status: 'success', timestamp: '2025-08-12 09:05:11', details: 'Paiement 12 500 XOF — Réf. OM-4421' },
  { id: 'LOG-005', connector: 'PACS — Carestream', action: 'Image DICOM reçue', status: 'success', timestamp: '2025-08-12 07:30:55', details: 'Accession ACC-2025-0812-001' },
];

export default function ExternalConnectorsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { id: 'connectors', label: 'Connecteurs actifs', icon: 'ArrowsRightLeftIcon' },
    { id: 'new', label: 'Nouveau connecteur', icon: 'PlusCircleIcon' },
    { id: 'logs', label: 'Journaux', icon: 'ClipboardDocumentListIcon' },
    { id: 'security', label: 'Sécurité', icon: 'ShieldCheckIcon' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Connecteurs Externes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Gateway d'intégration — Module SHIFA → API Gateway → Connecteur → Service externe
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
            {mockConnectors.filter(c => c.status === 'active').length} actifs
          </span>
          <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            {mockConnectors.filter(c => c.status === 'error').length} erreur
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Connecteurs actifs', value: String(mockConnectors.filter(c => c.status === 'active').length), icon: 'CheckCircleIcon', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Modules connectés', value: '8', icon: 'PuzzlePieceIcon', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Pays couverts', value: '5', icon: 'GlobeAltIcon', color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Appels API (24h)', value: '1 247', icon: 'ArrowsRightLeftIcon', color: '#0891b2', bg: '#cffafe' },
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
          {/* Architecture diagram */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Architecture d'intégration</h2>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {['Module SHIFA', 'API Gateway', 'Connecteur', 'Service externe'].map((node, i, arr) => (
                <React.Fragment key={node}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-4 py-3 rounded-xl text-white text-xs font-semibold text-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))', minWidth: '100px' }}>
                      {node}
                    </div>
                  </div>
                  {i < arr.length - 1 && <Icon name="ArrowRightIcon" size={20} style={{ color: 'var(--shifa-blue)' }} />}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Authentification', icon: 'LockClosedIcon' },
                { label: 'Autorisation & Scopes', icon: 'ShieldCheckIcon' },
                { label: 'Consentement', icon: 'DocumentCheckIcon' },
                { label: 'Journalisation', icon: 'ClipboardDocumentListIcon' },
                { label: 'Chiffrement', icon: 'LockClosedIcon' },
                { label: 'Minimisation données', icon: 'FunnelIcon' },
                { label: 'Révocation', icon: 'XCircleIcon' },
                { label: 'Monitoring', icon: 'ChartBarIcon' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  <Icon name={item.icon as any} size={14} style={{ color: 'var(--shifa-blue)' }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Catégories de connecteurs disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectorCategories.map(cat => (
                <div key={cat.name} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.bg }}>
                      <Icon name={cat.icon as any} size={16} style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{cat.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.examples.map(ex => (
                      <span key={ex} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Connectors */}
      {activeTab === 'connectors' && (
        <div className="space-y-3">
          {mockConnectors.map(connector => {
            const s = statusConfig[connector.status];
            const d = directionConfig[connector.direction];
            return (
              <div
                key={connector.id}
                onClick={() => setSelectedConnector(connector)}
                className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: selectedConnector?.id === connector.id ? 'var(--shifa-blue)' : 'var(--border)',
                  borderWidth: selectedConnector?.id === connector.id ? '2px' : '1px',
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--muted)' }}>
                    <Icon name={connector.icon as any} size={20} style={{ color: 'var(--shifa-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{connector.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{connector.module}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{connector.country}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Icon name={d.icon as any} size={12} />
                        {d.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière sync: {connector.lastSync}</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                    <Icon name={s.icon as any} size={12} />
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: New Connector */}
      {activeTab === 'new' && (
        <div className="max-w-2xl space-y-5">
          <div className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Configurer un nouveau connecteur</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Nom du connecteur</label>
                <input type="text" placeholder="Ex: Stripe Payments" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Module SHIFA concerné</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Finance</option><option>Laboratoire</option><option>Imagerie</option><option>Pharmacie</option>
                  <option>Assurance</option><option>Identité</option><option>Vaccination</option><option>Comptabilité</option>
                  <option>RH</option><option>Urgences</option><option>Santé publique</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>URL de l'API externe</label>
              <input type="url" placeholder="https://api.service-externe.com/v1" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Type d'authentification</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>API Key</option><option>OAuth 2.0</option><option>JWT</option><option>Basic Auth</option><option>mTLS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Direction</label>
                <select className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  <option>Lecture seule</option><option>Écriture seule</option><option>Bidirectionnel</option>
                  <option>Synchronisation partielle</option><option>Synchronisation complète</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Pays / Région</label>
              <input type="text" placeholder="Ex: France, Sénégal, Global..." className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Scopes de données autorisés</label>
              <div className="grid grid-cols-2 gap-2">
                {['Identité patient', 'Données médicales', 'Résultats biologiques', 'Imagerie', 'Prescriptions', 'Données financières', 'Données RH', 'Statistiques anonymisées'].map(scope => (
                  <label key={scope} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span style={{ color: 'var(--foreground)' }}>{scope}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                Tester la connexion
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                Créer le connecteur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Journal des intégrations</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <Icon name="ArrowDownTrayIcon" size={16} />
              Exporter
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)' }}>
                  {['ID', 'Connecteur', 'Action', 'Statut', 'Horodatage', 'Détails'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logEntries.map((entry, i) => (
                  <tr key={entry.id} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{entry.id}</td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--foreground)' }}>{entry.connector}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--foreground)' }}>{entry.action}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: entry.status === 'success' ? '#dcfce7' : '#fee2e2', color: entry.status === 'success' ? '#16a34a' : '#dc2626' }}>
                        {entry.status === 'success' ? 'Succès' : 'Erreur'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.timestamp}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Authentification & Autorisation', icon: 'LockClosedIcon', color: '#2563eb', items: ['OAuth 2.0 / API Key / JWT / mTLS', 'Scopes granulaires par connecteur', 'Révocation instantanée', 'Rotation automatique des tokens'] },
              { title: 'Protection des données', icon: 'ShieldCheckIcon', color: '#16a34a', items: ['Chiffrement TLS 1.3 en transit', 'Minimisation des données transmises', 'Consentement patient requis', 'Aucune donnée médicale sans autorisation'] },
              { title: 'Monitoring & Alertes', icon: 'ChartBarIcon', color: '#d97706', items: ['Surveillance temps réel des appels API', 'Alertes sur anomalies de volume', 'Détection d\'accès non autorisés', 'Rate limiting par connecteur'] },
              { title: 'Audit & Conformité', icon: 'ClipboardDocumentListIcon', color: '#7c3aed', items: ['Journal immuable de toutes les intégrations', 'Traçabilité des données transmises', 'Conformité RGPD / loi locale', 'Rapport d\'audit exportable'] },
            ].map(section => (
              <div key={section.title} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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
      )}

      {/* Connector detail panel */}
      {selectedConnector && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-80 border-l shadow-xl z-40 overflow-y-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{selectedConnector.name}</h2>
              <button onClick={() => setSelectedConnector(null)} className="p-1.5 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'ID', value: selectedConnector.id },
                { label: 'Module', value: selectedConnector.module },
                { label: 'Type', value: selectedConnector.type },
                { label: 'Direction', value: directionConfig[selectedConnector.direction].label },
                { label: 'Pays', value: selectedConnector.country },
                { label: 'Dernière sync', value: selectedConnector.lastSync },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                  <p style={{ color: 'var(--foreground)' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: '#dc2626', color: '#dc2626' }}>Désactiver</button>
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Configurer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
