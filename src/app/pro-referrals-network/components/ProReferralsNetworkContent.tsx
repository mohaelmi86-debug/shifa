'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'directory' | 'new-referral' | 'tracking' | 'counter-referral' | 'stats';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'directory', label: 'Annuaire spécialistes', icon: 'UsersIcon' },
  { key: 'new-referral', label: 'Lettre de référence', icon: 'DocumentTextIcon' },
  { key: 'tracking', label: 'Suivi adressages', icon: 'ArrowPathIcon' },
  { key: 'counter-referral', label: 'Contre-référence', icon: 'ArrowUturnLeftIcon' },
  { key: 'stats', label: 'Statistiques', icon: 'ChartBarIcon' },
];

const specialists = [
  { id: 'SP-001', name: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', subspecialty: 'Cardiologie interventionnelle', institution: 'CHU Aristide Le Dantec', zone: 'Dakar Centre', phone: '+221 77 123 45 67', availability: 'available', avgWait: '3 jours', rating: 4.8, totalReferrals: 47, acceptRate: 94, languages: ['Français', 'Wolof'], dpi: true },
  { id: 'SP-002', name: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', subspecialty: 'Néonatologie', institution: 'Hôpital Principal de Dakar', zone: 'Dakar Plateau', phone: '+221 77 234 56 78', availability: 'busy', avgWait: '7 jours', rating: 4.9, totalReferrals: 62, acceptRate: 88, languages: ['Français', 'Wolof', 'Anglais'], dpi: true },
  { id: 'SP-003', name: 'Dr. Ibrahima Diallo', specialty: 'Neurologie', subspecialty: 'Épileptologie', institution: 'Clinique Pasteur', zone: 'Dakar Almadies', phone: '+221 77 345 67 89', availability: 'available', avgWait: '5 jours', rating: 4.5, totalReferrals: 31, acceptRate: 91, languages: ['Français', 'Wolof'], dpi: false },
  { id: 'SP-004', name: 'Dr. Seynabou Diop', specialty: 'Ophtalmologie', subspecialty: 'Chirurgie réfractive', institution: 'Institut d\'Ophtalmologie Tropicale', zone: 'Dakar Fann', phone: '+221 77 456 78 90', availability: 'available', avgWait: '4 jours', rating: 4.7, totalReferrals: 55, acceptRate: 96, languages: ['Français', 'Wolof', 'Anglais'], dpi: true },
  { id: 'SP-005', name: 'Dr. Moussa Sarr', specialty: 'Chirurgie générale', subspecialty: 'Chirurgie digestive', institution: 'Clinique du Cap', zone: 'Dakar Plateau', phone: '+221 77 567 89 01', availability: 'unavailable', avgWait: '14 jours', rating: 4.6, totalReferrals: 28, acceptRate: 82, languages: ['Français'], dpi: false },
  { id: 'SP-006', name: 'Dr. Alioune Ndiaye', specialty: 'Dermatologie', subspecialty: 'Dermatologie pédiatrique', institution: 'Clinique Pasteur', zone: 'Dakar Almadies', phone: '+221 77 678 90 12', availability: 'available', avgWait: '2 jours', rating: 4.4, totalReferrals: 39, acceptRate: 97, languages: ['Français', 'Wolof'], dpi: true },
  { id: 'SP-007', name: 'Dr. Rokhaya Seck', specialty: 'Endocrinologie', subspecialty: 'Diabétologie', institution: 'CHU Aristide Le Dantec', zone: 'Dakar Centre', phone: '+221 77 789 01 23', availability: 'available', avgWait: '6 jours', rating: 4.6, totalReferrals: 44, acceptRate: 90, languages: ['Français', 'Wolof'], dpi: true },
  { id: 'SP-008', name: 'Dr. Cheikh Fall', specialty: 'Pneumologie', subspecialty: 'Pneumologie interventionnelle', institution: 'Hôpital Principal de Dakar', zone: 'Dakar Plateau', phone: '+221 77 890 12 34', availability: 'busy', avgWait: '10 jours', rating: 4.3, totalReferrals: 22, acceptRate: 85, languages: ['Français'], dpi: false },
];

const referrals = [
  { id: 'REF-2026-0421', patient: 'Aïcha Diallo', patientId: 'PAT-7K4D', specialist: 'Dr. Aminata Kouyaté', specialty: 'Cardiologie', reason: 'Douleurs thoraciques récurrentes, ECG anormal', urgency: 'urgent', status: 'accepted', sentDate: '08/08/2026', appointmentDate: '15/08/2026', dpiAttached: true },
  { id: 'REF-2026-0418', patient: 'Oumar Ndiaye', patientId: 'PAT-3M2K', specialist: 'Dr. Fatou Mbaye', specialty: 'Pédiatrie', reason: 'Retard de croissance, bilan nutritionnel', urgency: 'routine', status: 'scheduled', sentDate: '06/08/2026', appointmentDate: '20/08/2026', dpiAttached: true },
  { id: 'REF-2026-0415', patient: 'Mariama Ba', patientId: 'PAT-9P1R', specialist: 'Dr. Ibrahima Diallo', specialty: 'Neurologie', reason: 'Céphalées chroniques, IRM recommandée', urgency: 'urgent', status: 'sent', sentDate: '09/08/2026', appointmentDate: '—', dpiAttached: false },
  { id: 'REF-2026-0412', patient: 'Lamine Diop', patientId: 'PAT-4Q6V', specialist: 'Dr. Moussa Sarr', specialty: 'Chirurgie', reason: 'Hernie inguinale, évaluation chirurgicale', urgency: 'routine', status: 'declined', sentDate: '01/08/2026', appointmentDate: '—', dpiAttached: true },
  { id: 'REF-2026-0410', patient: 'Cheikh Fall', patientId: 'PAT-2L8S', specialist: 'Dr. Seynabou Diop', specialty: 'Ophtalmologie', reason: 'Baisse acuité visuelle progressive', urgency: 'routine', status: 'completed', sentDate: '28/07/2026', appointmentDate: '05/08/2026', dpiAttached: true },
];

const counterReferrals = [
  { id: 'CR-2026-0089', originalRef: 'REF-2026-0410', patient: 'Cheikh Fall', fromSpecialist: 'Dr. Seynabou Diop', fromSpecialty: 'Ophtalmologie', date: '05/08/2026', summary: 'Myopie forte (-6 dioptries OD, -5.5 OG). Chirurgie réfractive non indiquée pour l\'instant. Prescription lunettes + contrôle dans 6 mois.', recommendations: 'Correction optique immédiate. Éviter sports de contact. Contrôle fond d\'œil annuel.', prescriptions: ['Lunettes -6.00 OD / -5.50 OG', 'Larmes artificielles si sécheresse'], followUp: '6 mois', status: 'received' },
  { id: 'CR-2026-0087', originalRef: 'REF-2026-0398', patient: 'Rokhaya Seck', fromSpecialist: 'Dr. Rokhaya Seck', fromSpecialty: 'Endocrinologie', date: '02/08/2026', summary: 'Diabète type 2 déséquilibré (HbA1c 9.2%). Introduction metformine 1g x2/j + sitagliptine 100mg/j. Objectif HbA1c < 7% à 3 mois.', recommendations: 'Contrôle glycémique strict. Régime diabétique. Activité physique 30 min/j. Bilan rénal dans 1 mois.', prescriptions: ['Metformine 1000mg x2/j', 'Sitagliptine 100mg x1/j'], followUp: '3 mois', status: 'received' },
];

const statsData = [
  { specialty: 'Cardiologie', count: 47, accepted: 44, declined: 3 },
  { specialty: 'Pédiatrie', count: 38, accepted: 33, declined: 5 },
  { specialty: 'Neurologie', count: 31, accepted: 28, declined: 3 },
  { specialty: 'Ophtalmologie', count: 55, accepted: 53, declined: 2 },
  { specialty: 'Chirurgie', count: 28, accepted: 23, declined: 5 },
];

const availabilityConfig: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a', dot: '#16a34a' },
  busy: { label: 'Chargé', bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
  unavailable: { label: 'Indisponible', bg: '#fee2e2', color: '#dc2626', dot: '#dc2626' },
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  accepted: { label: 'Accepté', bg: '#dcfce7', color: '#16a34a' },
  scheduled: { label: 'Planifié', bg: '#ede9fe', color: '#5b21b6' },
  sent: { label: 'Envoyé', bg: '#dbeafe', color: '#1d4ed8' },
  declined: { label: 'Refusé', bg: '#fee2e2', color: '#dc2626' },
  completed: { label: 'Complété', bg: '#f3f4f6', color: '#6b7280' },
  received: { label: 'Reçue', bg: '#dcfce7', color: '#16a34a' },
  urgent: { label: 'Urgent', bg: '#fef3c7', color: '#b45309' },
  routine: { label: 'Routine', bg: '#dbeafe', color: '#1d4ed8' },
};

export default function ProReferralsNetworkContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('directory');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [referralForm, setReferralForm] = useState({ patient: '', specialist: '', reason: '', urgency: 'routine', attachDpi: true, notes: '' });

  const specialties = ['all', ...Array.from(new Set(specialists.map(s => s.specialty)))];
  const filteredSpecialists = specialists.filter(s =>
    (searchSpecialty === '' || s.name.toLowerCase().includes(searchSpecialty.toLowerCase()) || s.specialty.toLowerCase().includes(searchSpecialty.toLowerCase())) &&
    (selectedSpecialty === 'all' || s.specialty === selectedSpecialty)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.1)' }}>
              <Icon name="ArrowsRightLeftIcon" className="w-5 h-5" style={{ color: 'var(--shifa-blue)' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Réseau d'Adressage & Référence</h1>
              <p className="text-sm text-gray-500">Annuaire spécialistes · Lettres de référence · Suivi · Contre-référence</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
            <Icon name="PlusIcon" className="w-4 h-4" />
            Nouvel adressage
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
        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Icon name="MagnifyingGlassIcon" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher spécialiste, spécialité..."
                  value={searchSpecialty}
                  onChange={e => setSearchSpecialty(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                {specialties.map(s => <option key={s} value={s}>{s === 'all' ? 'Toutes spécialités' : s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredSpecialists.map(sp => (
                <div key={sp.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{sp.name}</h3>
                        {sp.dpi && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">DPI</span>}
                      </div>
                      <p className="text-sm text-blue-600 font-medium">{sp.specialty}</p>
                      <p className="text-xs text-gray-500">{sp.subspecialty}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: availabilityConfig[sp.availability]?.dot }} />
                      <span className="text-xs font-medium" style={{ color: availabilityConfig[sp.availability]?.color }}>
                        {availabilityConfig[sp.availability]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Icon name="BuildingOffice2Icon" className="w-3.5 h-3.5 text-gray-400" />
                      {sp.institution}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="MapPinIcon" className="w-3.5 h-3.5 text-gray-400" />
                      {sp.zone}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{sp.avgWait}</div>
                      <div className="text-xs text-gray-500">Délai moy.</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">{sp.acceptRate}%</div>
                      <div className="text-xs text-gray-500">Acceptation</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-900">⭐ {sp.rating}</div>
                      <div className="text-xs text-gray-500">{sp.totalReferrals} adressages</div>
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--shifa-blue)' }}>
                    Adresser un patient
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Referral Tab */}
        {activeTab === 'new-referral' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Lettre de Référence Structurée</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sélectionner un patient...</option>
                    <option>Aïcha Diallo (PAT-7K4D)</option>
                    <option>Oumar Ndiaye (PAT-3M2K)</option>
                    <option>Mariama Ba (PAT-9P1R)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialiste destinataire</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sélectionner un spécialiste...</option>
                    {specialists.map(s => <option key={s.id}>{s.name} — {s.specialty}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif d'adressage</label>
                <textarea rows={3} placeholder="Décrivez le motif de l'adressage, les symptômes, les examens déjà réalisés..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degré d'urgence</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Urgence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-800">Joindre le DPI du patient</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
                <p className="text-xs text-blue-600">Le DPI complet (antécédents, traitements, résultats récents) sera joint à la lettre de référence.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes complémentaires</label>
                <textarea rows={2} placeholder="Informations supplémentaires pour le spécialiste..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--shifa-blue)' }}>
                  Envoyer la lettre de référence
                </button>
                <button className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700">
                  Sauvegarder brouillon
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Suivi des Adressages</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Référence', 'Patient', 'Spécialiste', 'Spécialité', 'Motif', 'Urgence', 'Envoyé le', 'RDV', 'DPI', 'Statut'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {referrals.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{r.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{r.patient}</div>
                        <div className="text-xs text-gray-400 font-mono">{r.patientId}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.specialist}</td>
                      <td className="px-4 py-3 text-gray-600">{r.specialty}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{r.reason}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[r.urgency]?.bg, color: statusConfig[r.urgency]?.color }}>
                          {statusConfig[r.urgency]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.sentDate}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{r.appointmentDate}</td>
                      <td className="px-4 py-3 text-center">
                        {r.dpiAttached ? <Icon name="CheckCircleIcon" className="w-4 h-4 text-green-500 mx-auto" /> : <Icon name="XCircleIcon" className="w-4 h-4 text-gray-300 mx-auto" />}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusConfig[r.status]?.bg, color: statusConfig[r.status]?.color }}>
                          {statusConfig[r.status]?.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Counter-Referral Tab */}
        {activeTab === 'counter-referral' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contre-Références Reçues</h2>
            <div className="grid gap-4">
              {counterReferrals.map(cr => (
                <div key={cr.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{cr.id}</span>
                        <span className="text-xs text-gray-400">→ Réf. originale: {cr.originalRef}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>Reçue</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{cr.patient}</h3>
                      <p className="text-sm text-gray-600">De: {cr.fromSpecialist} ({cr.fromSpecialty}) · {cr.date}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Intégrer au DPI</button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Compte-rendu de consultation</p>
                    <p className="text-sm text-gray-600">{cr.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommandations</p>
                      <p className="text-sm text-gray-700">{cr.recommendations}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prescriptions</p>
                      <ul className="space-y-1">
                        {cr.prescriptions.map((p, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-1">
                            <Icon name="CheckIcon" className="w-3 h-3 text-green-500" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="CalendarDaysIcon" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Suivi recommandé dans: <span className="font-semibold text-gray-900">{cr.followUp}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Statistiques d'Adressage</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="text-3xl font-bold text-gray-900">189</div>
                <div className="text-sm text-gray-500 mt-1">Adressages totaux (2026)</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--shifa-green)' }}>91%</div>
                <div className="text-sm text-gray-500 mt-1">Taux d'acceptation moyen</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--shifa-blue)' }}>5.2j</div>
                <div className="text-sm text-gray-500 mt-1">Délai moyen de prise en charge</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Adressages par spécialité</h3>
              <div className="space-y-3">
                {statsData.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{s.specialty}</span>
                      <span className="text-gray-500">{s.count} adressages · {s.accepted} acceptés · {s.declined} refusés</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 flex overflow-hidden">
                      <div className="h-2 bg-green-500" style={{ width: `${(s.accepted / s.count) * 100}%` }} />
                      <div className="h-2 bg-red-300" style={{ width: `${(s.declined / s.count) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
