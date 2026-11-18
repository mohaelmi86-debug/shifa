'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'library' | 'permanent-orders' | 'checklists' | 'emergency' | 'versions';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'library', label: 'Bibliothèque protocoles', icon: 'BookOpenIcon' },
  { key: 'permanent-orders', label: 'Ordres permanents', icon: 'DocumentCheckIcon' },
  { key: 'checklists', label: 'Check-lists procédurales', icon: 'ClipboardDocumentListIcon' },
  { key: 'emergency', label: 'Protocoles urgence', icon: 'BoltIcon' },
  { key: 'versions', label: 'Versioning & Approbations', icon: 'ClockIcon' },
];

const protocols = [
  { id: 'PROT-001', title: 'Prise en charge de l\'infarctus du myocarde (SCA ST+)', specialty: 'Cardiologie', cim10: 'I21.0', version: '3.2', status: 'approved', lastUpdated: '15/07/2026', approvedBy: 'Dr. Kouyaté', category: 'Urgence', views: 284 },
  { id: 'PROT-002', title: 'Protocole de sédation en réanimation adulte', specialty: 'Réanimation', cim10: 'Z99.1', version: '2.1', status: 'approved', lastUpdated: '20/06/2026', approvedBy: 'Dr. Diallo', category: 'Soins intensifs', views: 156 },
  { id: 'PROT-003', title: 'Prise en charge de l\'AVC ischémique aigu', specialty: 'Neurologie', cim10: 'I63.9', version: '4.0', status: 'approved', lastUpdated: '01/08/2026', approvedBy: 'Dr. Ba', category: 'Urgence', views: 312 },
  { id: 'PROT-004', title: 'Antibiothérapie probabiliste des pneumonies communautaires', specialty: 'Pneumologie', cim10: 'J18.9', version: '2.3', status: 'approved', lastUpdated: '10/07/2026', approvedBy: 'Dr. Ndiaye', category: 'Infectiologie', views: 198 },
  { id: 'PROT-005', title: 'Prise en charge du diabète de type 2 en consultation', specialty: 'Endocrinologie', cim10: 'E11.9', version: '1.5', status: 'review', lastUpdated: '05/08/2026', approvedBy: 'En attente', category: 'Chronique', views: 421 },
  { id: 'PROT-006', title: 'Protocole transfusion sanguine — adulte', specialty: 'Hématologie', cim10: 'Z51.3', version: '3.0', status: 'approved', lastUpdated: '25/06/2026', approvedBy: 'Dr. Sarr', category: 'Procédure', views: 89 },
  { id: 'PROT-007', title: 'Prise en charge de la prééclampsie sévère', specialty: 'Obstétrique', cim10: 'O14.1', version: '2.2', status: 'approved', lastUpdated: '18/07/2026', approvedBy: 'Dr. Mbaye', category: 'Urgence', views: 134 },
  { id: 'PROT-008', title: 'Analgésie post-opératoire multimodale', specialty: 'Anesthésie', cim10: 'Z51.5', version: '1.8', status: 'draft', lastUpdated: '11/08/2026', approvedBy: '—', category: 'Procédure', views: 67 },
];

const permanentOrders = [
  { id: 'OP-001', title: 'Surveillance constantes toutes les 4h en post-op', service: 'Chirurgie', validFor: 'Post-opératoire J0-J2', approvedBy: 'Dr. Ndiaye', validUntil: '31/12/2026', status: 'active' },
  { id: 'OP-002', title: 'Bilan biologique d\'entrée aux urgences', service: 'Urgences', validFor: 'Toute admission urgences', approvedBy: 'Dr. Diallo', validUntil: '31/12/2026', status: 'active' },
  { id: 'OP-003', title: 'Oxygénothérapie si SpO2 < 94%', service: 'Tous services', validFor: 'Tout patient hospitalisé', approvedBy: 'Dr. Ba', validUntil: '31/12/2026', status: 'active' },
  { id: 'OP-004', title: 'Prévention TVP — HBPM prophylactique', service: 'Chirurgie / Médecine', validFor: 'Patient alité > 48h', approvedBy: 'Dr. Kouyaté', validUntil: '31/12/2026', status: 'active' },
  { id: 'OP-005', title: 'Glycémie capillaire toutes les 6h chez diabétique hospitalisé', service: 'Tous services', validFor: 'Patient diabétique', approvedBy: 'Dr. Sarr', validUntil: '30/06/2027', status: 'active' },
  { id: 'OP-006', title: 'Restriction hydrique 1500ml/j en insuffisance cardiaque', service: 'Cardiologie', validFor: 'IC décompensée', approvedBy: 'Dr. Mbaye', validUntil: '31/12/2026', status: 'review' },
];

const checklists = [
  { id: 'CL-001', title: 'Check-list sécurité bloc opératoire (OMS)', category: 'Chirurgie', steps: 19, lastUsed: '11/08/2026', usageCount: 847, status: 'active' },
  { id: 'CL-002', title: 'Check-list pose cathéter veineux central', category: 'Réanimation', steps: 12, lastUsed: '10/08/2026', usageCount: 234, status: 'active' },
  { id: 'CL-003', title: 'Check-list intubation orotrachéale', category: 'Urgences / Réanimation', steps: 15, lastUsed: '09/08/2026', usageCount: 156, status: 'active' },
  { id: 'CL-004', title: 'Check-list sortie de réanimation', category: 'Réanimation', steps: 8, lastUsed: '08/08/2026', usageCount: 89, status: 'active' },
  { id: 'CL-005', title: 'Check-list accouchement normal', category: 'Maternité', steps: 22, lastUsed: '11/08/2026', usageCount: 312, status: 'active' },
];

const emergencyProtocols = [
  { id: 'URG-001', title: 'Arrêt cardio-respiratoire adulte (RCP)', color: '#dc2626', icon: 'HeartIcon', steps: ['Appeler aide + chariot urgence', 'MCE 30:2 — démarrer immédiatement', 'Défibrillation si FV/TV sans pouls', 'Adrénaline 1mg IV toutes les 3-5 min', 'Identifier et traiter cause réversible (4H/4T)'] },
  { id: 'URG-002', title: 'Choc anaphylactique', color: '#f59e0b', icon: 'ExclamationTriangleIcon', steps: ['Adrénaline 0.5mg IM cuisse externe', 'Position allongée jambes surélevées', 'O2 haut débit + voie veineuse', 'Remplissage NaCl 0.9% 500ml rapide', 'Antihistaminique + corticoïdes IV'] },
  { id: 'URG-003', title: 'Détresse respiratoire aiguë', color: '#7c3aed', icon: 'LungIcon', steps: ['Évaluation rapide SpO2 / FR / conscience', 'O2 haut débit — objectif SpO2 ≥ 94%', 'Position demi-assise', 'Identifier cause (OAP, EP, pneumothorax...)', 'Traitement étiologique + appel réanimation si nécessaire'] },
  { id: 'URG-004', title: 'Hypoglycémie sévère (< 0.5 g/L)', color: '#0891b2', icon: 'BeakerIcon', steps: ['Glucose 30% IV 30-50ml en bolus', 'Si pas de voie: glucagon 1mg IM/SC', 'Contrôle glycémie à 15 min', 'Perfusion G10% si persistance', 'Rechercher cause + prévenir récidive'] },
];

const versions = [
  { id: 'PROT-003', title: 'Prise en charge de l\'AVC ischémique aigu', version: '4.0', previousVersion: '3.1', changedBy: 'Dr. Ba', changeDate: '01/08/2026', approvedBy: 'Commission médicale', approvalDate: '05/08/2026', status: 'approved', changes: 'Mise à jour délai thrombolyse (4.5h), ajout critères thrombectomie' },
  { id: 'PROT-001', title: 'Prise en charge de l\'infarctus du myocarde', version: '3.2', previousVersion: '3.1', changedBy: 'Dr. Kouyaté', changeDate: '10/07/2026', approvedBy: 'Commission médicale', approvalDate: '15/07/2026', status: 'approved', changes: 'Révision doses anticoagulants, ajout critères TAVI' },
  { id: 'PROT-005', title: 'Prise en charge du diabète de type 2', version: '1.5', previousVersion: '1.4', changedBy: 'Dr. Sarr', changeDate: '05/08/2026', approvedBy: 'En attente commission', approvalDate: '—', status: 'review', changes: 'Intégration nouvelles recommandations HAS 2026, ajout GLP-1' },
  { id: 'PROT-008', title: 'Analgésie post-opératoire multimodale', version: '1.8', previousVersion: '1.7', changedBy: 'Dr. Ndiaye', changeDate: '11/08/2026', approvedBy: '—', approvalDate: '—', status: 'draft', changes: 'Révision protocole kétamine, ajout tramadol IV' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  review: { label: 'En révision', bg: '#fef3c7', color: '#b45309' },
  draft: { label: 'Brouillon', bg: '#f3f4f6', color: '#6b7280' },
  active: { label: 'Actif', bg: '#dcfce7', color: '#16a34a' },
};

export default function ProClinicalProtocolsContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const filteredProtocols = protocols.filter(p =>
    (searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.cim10.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedSpecialty === 'all' || p.specialty === selectedSpecialty)
  );

  const specialties = ['all', ...Array.from(new Set(protocols.map(p => p.specialty)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.1)' }}>
              <Icon name="BookOpenIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Protocoles Cliniques & Ordres Permanents</h1>
              <p className="text-sm text-gray-500">Bibliothèque · Ordres permanents · Check-lists · Urgences · CIM-10</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouveau protocole
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Icon name="MagnifyingGlassIcon" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, CIM-10..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedSpecialty}
                onChange={e => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map(s => <option key={s} value={s}>{s === 'all' ? 'Toutes spécialités' : s}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID', 'Titre', 'Spécialité', 'CIM-10', 'Version', 'Statut', 'Mis à jour', 'Approuvé par', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProtocols.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{p.title}</div>
                        <div className="text-xs text-gray-400">{p.category}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.specialty}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{p.cim10}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">v{p.version}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[p.status]?.bg, color: statusConfig[p.status]?.color }}>
                          {statusConfig[p.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.lastUpdated}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{p.approvedBy}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Consulter</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Permanent Orders Tab */}
        {activeTab === 'permanent-orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Ordres Permanents Validés</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouvel ordre permanent
              </button>
            </div>
            <div className="grid gap-4">
              {permanentOrders.map(op => (
                <div key={op.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{op.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[op.status]?.bg, color: statusConfig[op.status]?.color }}>
                          {statusConfig[op.status]?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{op.title}</h3>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><span className="text-gray-500">Service:</span> <span className="font-medium text-gray-700">{op.service}</span></div>
                        <div><span className="text-gray-500">Applicable:</span> <span className="font-medium text-gray-700">{op.validFor}</span></div>
                        <div><span className="text-gray-500">Approuvé par:</span> <span className="font-medium text-gray-700">{op.approvedBy}</span></div>
                        <div><span className="text-gray-500">Valide jusqu'au:</span> <span className="font-medium text-gray-700">{op.validUntil}</span></div>
                      </div>
                    </div>
                    <button className="ml-4 text-blue-600 hover:text-blue-800 text-xs font-medium">Modifier</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklists Tab */}
        {activeTab === 'checklists' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Check-lists Procédurales</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                <Icon name="PlusIcon" className="w-4 h-4" />
                Nouvelle check-list
              </button>
            </div>
            <div className="grid gap-4">
              {checklists.map(cl => (
                <div key={cl.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.08)' }}>
                      <Icon name="ClipboardDocumentCheckIcon" className="w-6 h-6" style={{ color: 'var(--shifa-blue)' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cl.title}</h3>
                      <p className="text-sm text-gray-500">{cl.category} · {cl.steps} étapes · Dernière utilisation: {cl.lastUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{cl.usageCount}</div>
                      <div className="text-xs text-gray-500">utilisations</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>Actif</span>
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>Utiliser</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Protocols Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Protocoles d'Urgence — Accès Rapide</h2>
            <div className="grid grid-cols-2 gap-4">
              {emergencyProtocols.map(ep => (
                <div key={ep.id} className="bg-white rounded-xl p-5 border-l-4 shadow-sm" style={{ borderLeftColor: ep.color }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${ep.color}15` }}>
                      <Icon name={ep.icon} className="w-5 h-5" style={{ color: ep.color }} />
                    </div>
                    <h3 className="font-bold text-gray-900">{ep.title}</h3>
                  </div>
                  <ol className="space-y-2">
                    {ep.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ background: ep.color }}>{i + 1}</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <button className="mt-4 w-full py-2 rounded-lg text-sm font-semibold text-white" style={{ background: ep.color }}>
                    Voir protocole complet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Versions Tab */}
        {activeTab === 'versions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Versioning & Approbations Médicales</h2>
            <div className="grid gap-4">
              {versions.map(v => (
                <div key={v.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{v.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[v.status]?.bg, color: statusConfig[v.status]?.color }}>
                          {statusConfig[v.status]?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{v.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono">v{v.previousVersion}</span>
                      <Icon name="ArrowRightIcon" className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono font-bold">v{v.version}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div><span className="text-gray-500">Modifié par:</span> <span className="font-medium text-gray-700">{v.changedBy}</span></div>
                    <div><span className="text-gray-500">Date modif.:</span> <span className="font-medium text-gray-700">{v.changeDate}</span></div>
                    <div><span className="text-gray-500">Approuvé par:</span> <span className="font-medium text-gray-700">{v.approvedBy}</span></div>
                    <div><span className="text-gray-500">Date approbation:</span> <span className="font-medium text-gray-700">{v.approvalDate}</span></div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Modifications: </span>{v.changes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
