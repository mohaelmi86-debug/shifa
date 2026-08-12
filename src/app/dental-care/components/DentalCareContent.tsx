'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'patients' | 'consultations' | 'dental-chart' | 'treatments' | 'imaging' | 'reports';

const patients = [
  { id: 'DEN-001', name: 'Mariama Kouyaté', age: 35, lastVisit: '10 août', nextVisit: "Aujourd\'hui 09h", status: 'active', hygiene: 'Bonne', caries: 2, missing: 0, prosthetics: false, orthodontics: false, notes: 'Détartrage + soins caries 36, 46' },
  { id: 'DEN-002', name: 'Oumar Diallo', age: 52, lastVisit: '05 août', nextVisit: 'Demain 14h', status: 'active', hygiene: 'Moyenne', caries: 4, missing: 2, prosthetics: true, orthodontics: false, notes: 'Prothèse partielle amovible en cours' },
  { id: 'DEN-003', name: 'Kadiatou Barry', age: 14, lastVisit: '01 août', nextVisit: '16 août 10h', status: 'active', hygiene: 'Bonne', caries: 1, missing: 0, prosthetics: false, orthodontics: true, notes: 'Bague orthodontique — contrôle mensuel' },
  { id: 'DEN-004', name: 'Ibrahima Sow', age: 68, lastVisit: '20 juil', nextVisit: '17 août 11h', status: 'active', hygiene: 'Mauvaise', caries: 6, missing: 5, prosthetics: true, orthodontics: false, notes: 'Prothèse totale supérieure à refaire' },
  { id: 'DEN-005', name: 'Fatoumata Traoré', age: 28, lastVisit: '12 août', nextVisit: '18 août 15h', status: 'active', hygiene: 'Très bonne', caries: 0, missing: 0, prosthetics: false, orthodontics: false, notes: 'Blanchiment dentaire — suivi' },
];

const consultations = [
  { id: 'C-001', patient: 'Mariama Kouyaté', date: "Aujourd\'hui 09h", type: 'Soins conservateurs', dentist: 'Dr. Bah', teeth: ['36', '46'], acts: ['Détartrage', 'Obturation composite 36', 'Obturation composite 46'], anesthesia: 'Locale', duration: 60, status: 'scheduled', notes: 'Caries profondes — vérifier vitalité pulpaire' },
  { id: 'C-002', patient: 'Oumar Diallo', date: 'Hier 14h', type: 'Prothèse', dentist: 'Dr. Koné', teeth: ['35', '36', '37'], acts: ['Empreinte prothèse partielle', 'Essayage châssis'], anesthesia: 'Aucune', duration: 45, status: 'completed', notes: 'Châssis validé. Pose prévue dans 2 semaines.' },
  { id: 'C-003', patient: 'Kadiatou Barry', date: 'Avant-hier 10h', type: 'Orthodontie', dentist: 'Dr. Bah', teeth: ['11', '12', '21', '22'], acts: ['Activation arcs', 'Contrôle ancrage'], anesthesia: 'Aucune', duration: 30, status: 'completed', notes: 'Bonne progression. Prochain RDV dans 4 semaines.' },
];

const toothData = [
  { tooth: '18', status: 'absent' }, { tooth: '17', status: 'healthy' }, { tooth: '16', status: 'filled' }, { tooth: '15', status: 'healthy' },
  { tooth: '14', status: 'healthy' }, { tooth: '13', status: 'healthy' }, { tooth: '12', status: 'healthy' }, { tooth: '11', status: 'healthy' },
  { tooth: '21', status: 'healthy' }, { tooth: '22', status: 'healthy' }, { tooth: '23', status: 'healthy' }, { tooth: '24', status: 'healthy' },
  { tooth: '25', status: 'healthy' }, { tooth: '26', status: 'caries' }, { tooth: '27', status: 'healthy' }, { tooth: '28', status: 'absent' },
  { tooth: '48', status: 'absent' }, { tooth: '47', status: 'healthy' }, { tooth: '46', status: 'caries' }, { tooth: '45', status: 'healthy' },
  { tooth: '44', status: 'healthy' }, { tooth: '43', status: 'healthy' }, { tooth: '42', status: 'healthy' }, { tooth: '41', status: 'healthy' },
  { tooth: '31', status: 'healthy' }, { tooth: '32', status: 'healthy' }, { tooth: '33', status: 'healthy' }, { tooth: '34', status: 'healthy' },
  { tooth: '35', status: 'filled' }, { tooth: '36', status: 'caries' }, { tooth: '37', status: 'healthy' }, { tooth: '38', status: 'absent' },
];

const toothColors: Record<string, string> = {
  healthy: '#10b981',
  caries: '#ef4444',
  filled: '#3b82f6',
  absent: '#9ca3af',
  crown: '#f59e0b',
  implant: '#8b5cf6',
};

const treatments = [
  { name: 'Détartrage / Surfaçage', category: 'Hygiène', duration: '30-60 min', price: '15 000 FCFA', indication: 'Tartre, gingivite' },
  { name: 'Obturation composite', category: 'Conservateur', duration: '30-45 min', price: '8 000-15 000 FCFA', indication: 'Caries' },
  { name: 'Traitement endodontique', category: 'Endodontie', duration: '60-90 min', price: '25 000-45 000 FCFA', indication: 'Pulpite, nécrose' },
  { name: 'Extraction simple', category: 'Chirurgie', duration: '20-30 min', price: '10 000-20 000 FCFA', indication: 'Dent non conservable' },
  { name: 'Prothèse partielle amovible', category: 'Prothèse', duration: '4-6 RDV', price: '80 000-150 000 FCFA', indication: 'Édentement partiel' },
  { name: 'Couronne céramo-métallique', category: 'Prothèse fixe', duration: '2-3 RDV', price: '60 000-100 000 FCFA', indication: 'Dent délabrée' },
  { name: 'Implant dentaire', category: 'Implantologie', duration: '3-6 mois', price: '200 000-350 000 FCFA', indication: 'Édentement unitaire' },
  { name: 'Bague orthodontique', category: 'Orthodontie', duration: '18-36 mois', price: '300 000-500 000 FCFA', indication: 'Malposition dentaire' },
];

const activityData = [
  { month: 'Avr', conservateur: 45, prothese: 12, chirurgie: 8, ortho: 6 },
  { month: 'Mai', conservateur: 52, prothese: 15, chirurgie: 10, ortho: 8 },
  { month: 'Jun', conservateur: 48, prothese: 18, chirurgie: 7, ortho: 9 },
  { month: 'Jul', conservateur: 60, prothese: 20, chirurgie: 12, ortho: 10 },
  { month: 'Aoû', conservateur: 55, prothese: 16, chirurgie: 9, ortho: 11 },
];

const kpis = [
  { label: 'Patients actifs', value: '156', icon: 'UsersIcon', color: '#3b82f6' },
  { label: 'Actes ce mois', value: '312', icon: 'CalendarDaysIcon', color: '#10b981' },
  { label: 'Taux caries', value: '28%', icon: 'ExclamationTriangleIcon', color: '#f59e0b' },
  { label: 'CA ce mois', value: '4.2M FCFA', icon: 'BanknotesIcon', color: '#8b5cf6' },
];

export default function DentalCareContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'consultations', label: 'Consultations', icon: 'CalendarDaysIcon' },
    { key: 'dental-chart', label: 'Schéma dentaire', icon: 'SquaresPlusIcon' },
    { key: 'treatments', label: 'Actes & Tarifs', icon: 'ClipboardDocumentListIcon' },
    { key: 'imaging', label: 'Imagerie dentaire', icon: 'PhotoIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <Icon name="SparklesIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Soins Dentaires</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Odontologie & chirurgie dentaire</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>
            <Icon name="PlusIcon" size={16} />Nouveau patient
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {kpis.map(k => (
            <div key={k.label} className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={k.icon as any} size={14} style={{ color: k.color }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              style={tab === t.key ? { backgroundColor: '#3b82f6', color: 'white' } : { color: 'var(--muted-foreground)' }}>
              <Icon name={t.icon as any} size={14} />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {patients.map(p => (
                <div key={p.id} onClick={() => setSelectedPatient(p)}
                  className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#3b82f6' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>Actif</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: p.caries > 3 ? '#ef4444' : p.caries > 0 ? '#f59e0b' : '#10b981' }}>{p.caries}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Caries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: p.missing > 0 ? '#f59e0b' : '#10b981' }}>{p.missing}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Absentes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{p.prosthetics ? 'Oui' : 'Non'}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prothèse</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{p.hygiene}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Hygiène</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.notes}</p>
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Dernière visite: {p.lastVisit}</span>
                    <span>Prochain: {p.nextVisit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {selectedPatient ? (
                <div className="rounded-xl border p-4 sticky top-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#ef4444' }}>{selectedPatient.caries}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Caries</p>
                    </div>
                    <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{selectedPatient.missing}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Absentes</p>
                    </div>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.notes}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>Nouveau RDV</button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Schéma</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Icon name="UserIcon" size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez un patient</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'consultations' && (
          <div className="space-y-4">
            {consultations.map(c => (
              <div key={c.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{c.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.type} · {c.dentist} · {c.duration} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={c.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                      {c.status === 'completed' ? 'Terminée' : 'Planifiée'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.teeth.map((t, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>Dent {t}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.acts.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>{a}</span>
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.notes}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'dental-chart' && (
          <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Schéma dentaire — Mariama Kouyaté</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Cliquez sur une dent pour voir son statut</p>
            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Arcade supérieure</p>
              <div className="flex gap-1 flex-wrap justify-center mb-4">
                {toothData.slice(0, 16).map(t => (
                  <button key={t.tooth} onClick={() => setSelectedTooth(t.tooth)}
                    className="w-8 h-8 rounded text-xs font-bold border-2 transition-all"
                    style={{
                      backgroundColor: toothColors[t.status] + '30',
                      borderColor: selectedTooth === t.tooth ? '#1d4ed8' : toothColors[t.status],
                      color: toothColors[t.status],
                    }}>
                    {t.tooth}
                  </button>
                ))}
              </div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Arcade inférieure</p>
              <div className="flex gap-1 flex-wrap justify-center">
                {toothData.slice(16).map(t => (
                  <button key={t.tooth} onClick={() => setSelectedTooth(t.tooth)}
                    className="w-8 h-8 rounded text-xs font-bold border-2 transition-all"
                    style={{
                      backgroundColor: toothColors[t.status] + '30',
                      borderColor: selectedTooth === t.tooth ? '#1d4ed8' : toothColors[t.status],
                      color: toothColors[t.status],
                    }}>
                    {t.tooth}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(toothColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs capitalize" style={{ color: 'var(--muted-foreground)' }}>{status}</span>
                </div>
              ))}
            </div>
            {selectedTooth && (
              <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Dent {selectedTooth}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Statut: {toothData.find(t => t.tooth === selectedTooth)?.status}
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'treatments' && (
          <div className="space-y-3">
            <div className="rounded-xl border p-4 mb-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Activité par type d'acte</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="conservateur" fill="#3b82f6" name="Conservateur" />
                  <Bar dataKey="prothese" fill="#10b981" name="Prothèse" />
                  <Bar dataKey="chirurgie" fill="#ef4444" name="Chirurgie" />
                  <Bar dataKey="ortho" fill="#8b5cf6" name="Orthodontie" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {treatments.map((t, i) => (
                <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>{t.category}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Durée: {t.duration}</p>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Indication: {t.indication}</p>
                  <p className="text-sm font-bold" style={{ color: '#3b82f6' }}>{t.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'imaging' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { patient: 'Mariama Kouyaté', type: 'Panoramique', date: '10 août', status: 'Disponible', findings: 'Caries 36, 46 confirmées. Pas de lésion périapicale.' },
              { patient: 'Oumar Diallo', type: 'Rétroalvéolaire x4', date: '05 août', status: 'Disponible', findings: 'Résorption osseuse modérée secteur 3. Prothèse indiquée.' },
              { patient: 'Ibrahima Sow', type: 'Panoramique + CBCT', date: '20 juil', status: 'Disponible', findings: 'Édentement multiple. Évaluation implantaire en cours.' },
              { patient: 'Fatoumata Traoré', type: 'Rétroalvéolaire x2', date: '12 août', status: 'Disponible', findings: 'Pas de caries. Légère gingivite marginale.' },
            ].map((img, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{img.patient}</p>
                    <p className="text-xs" style={{ color: '#3b82f6' }}>{img.type}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>{img.status}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Date: {img.date}</p>
                <p className="text-xs" style={{ color: 'var(--foreground)' }}>{img.findings}</p>
                <button className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: '#3b82f6' }}>
                  <Icon name="EyeIcon" size={12} />Voir l'image
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Rapport mensuel d\'activité', 'Statistiques par acte', 'Rapport financier', 'Bilan de santé bucco-dentaire'].map((r, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--foreground)' }}>{r}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Août 2026</p>
                <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#3b82f6' }}>
                  <Icon name="ArrowDownTrayIcon" size={12} />Télécharger PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
