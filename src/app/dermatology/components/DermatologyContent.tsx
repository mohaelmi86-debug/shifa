'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type Tab = 'patients' | 'consultations' | 'lesions' | 'treatments' | 'phototherapy' | 'reports';

const patients = [
  { id: 'DER-001', name: 'Aïcha Kouyaté', age: 28, diagnosis: 'Dermatite atopique sévère', scorad: 52, dlqi: 14, status: 'active', therapist: 'Dr. Diallo', lastVisit: '10 août', nextVisit: "Aujourd\'hui 10h", areas: ['Visage', 'Cou', 'Plis coudes'] },
  { id: 'DER-002', name: 'Mamadou Barry', age: 45, diagnosis: 'Psoriasis en plaques', pasi: 18, dlqi: 12, status: 'active', therapist: 'Dr. Bah', lastVisit: '05 août', nextVisit: 'Demain 14h', areas: ['Coudes', 'Genoux', 'Scalp'] },
  { id: 'DER-003', name: 'Kadiatou Sow', age: 35, diagnosis: 'Mélanome — stade II', breslow: 1.8, dlqi: 18, status: 'urgent', therapist: 'Dr. Diallo', lastVisit: '12 août', nextVisit: '16 août 09h', areas: ['Dos'] },
  { id: 'DER-004', name: 'Ibrahima Traoré', age: 22, diagnosis: 'Acné nodulo-kystique', gea: 4, dlqi: 10, status: 'active', therapist: 'Dr. Bah', lastVisit: '08 août', nextVisit: '17 août 11h', areas: ['Visage', 'Dos', 'Thorax'] },
  { id: 'DER-005', name: 'Fatoumata Camara', age: 52, diagnosis: 'Vitiligo généralisé', repigmentation: 35, dlqi: 8, status: 'active', therapist: 'Dr. Diallo', lastVisit: '01 août', nextVisit: '18 août 15h', areas: ['Mains', 'Visage', 'Cou'] },
];

const consultations = [
  { id: 'C-001', patient: 'Aïcha Kouyaté', date: "Aujourd\'hui 10h", type: 'Suivi dermatite atopique', doctor: 'Dr. Diallo', acts: ['Évaluation SCORAD', 'Prescription émollients', 'Corticoïdes topiques'], findings: 'SCORAD 52 → 45. Amélioration partielle. Introduire dupilumab si pas d\'amélioration à 3 mois.', status: 'scheduled' },
  { id: 'C-002', patient: 'Mamadou Barry', date: 'Hier 14h', type: 'Suivi psoriasis', doctor: 'Dr. Bah', acts: ['PASI score', 'Photothérapie UVB', 'Méthotrexate suivi'], findings: 'PASI 18 → 14. Bonne réponse méthotrexate. Continuer 15mg/semaine.', status: 'completed' },
  { id: 'C-003', patient: 'Kadiatou Sow', date: 'Avant-hier 09h', type: 'Suivi mélanome post-exérèse', doctor: 'Dr. Diallo', acts: ['Dermatoscopie', 'Examen ganglions', 'Surveillance cicatrice'], findings: 'Cicatrice propre. Pas d\'adénopathie. Prochain contrôle dans 3 mois + IRM.', status: 'completed' },
];

const lesionTypes = [
  { name: 'Macule', description: 'Tache plane sans relief, < 1 cm', examples: 'Vitiligo, tache café au lait, purpura' },
  { name: 'Papule', description: 'Lésion surélevée solide, < 1 cm', examples: 'Acné, lichen plan, molluscum' },
  { name: 'Plaque', description: 'Lésion surélevée solide, > 1 cm', examples: 'Psoriasis, mycosis fongoïde' },
  { name: 'Vésicule', description: 'Lésion liquidienne < 5 mm', examples: 'Herpès, varicelle, eczéma' },
  { name: 'Bulle', description: 'Lésion liquidienne > 5 mm', examples: 'Pemphigus, brûlure, impétigo bulleux' },
  { name: 'Pustule', description: 'Lésion liquidienne purulente', examples: 'Acné, folliculite, psoriasis pustuleux' },
  { name: 'Nodule', description: 'Lésion profonde solide', examples: 'Mélanome, carcinome basocellulaire' },
  { name: 'Ulcère', description: 'Perte de substance cutanée', examples: 'Ulcère veineux, escarres, leishmaniose' },
];

const treatments = [
  { name: 'Corticoïdes topiques', category: 'Topique', indication: 'Eczéma, psoriasis, dermatite', level: 'Classe I-IV', notes: 'Éviter visage et plis avec classe forte' },
  { name: 'Rétinoïdes topiques', category: 'Topique', indication: 'Acné, kératoses, photovieilissement', level: 'Prescription', notes: 'Tératogène — contraception obligatoire' },
  { name: 'Méthotrexate', category: 'Systémique', indication: 'Psoriasis sévère, dermatite atopique', level: 'Spécialiste', notes: 'Surveillance NFS, bilan hépatique mensuel' },
  { name: 'Dupilumab (Dupixent)', category: 'Biologique', indication: 'Dermatite atopique sévère', level: 'Biologique', notes: 'Injection SC toutes les 2 semaines' },
  { name: 'Isotrétinoïne', category: 'Systémique', indication: 'Acné sévère résistante', level: 'Spécialiste', notes: 'Programme de prévention grossesse obligatoire' },
  { name: 'Photothérapie UVB étroite', category: 'Physique', indication: 'Psoriasis, vitiligo, eczéma', level: 'Spécialiste', notes: '3 séances/semaine, 20-30 séances' },
];

const scoradData = [
  { visit: 'V1', scorad: 65, dlqi: 18 },
  { visit: 'V2', scorad: 58, dlqi: 16 },
  { visit: 'V3', scorad: 52, dlqi: 14 },
  { visit: 'V4', scorad: 45, dlqi: 12 },
  { visit: 'V5', scorad: 38, dlqi: 10 },
];

const diagnosisData = [
  { name: 'Eczéma/DA', count: 45 },
  { name: 'Psoriasis', count: 32 },
  { name: 'Acné', count: 28 },
  { name: 'Vitiligo', count: 15 },
  { name: 'Mélanome', count: 8 },
  { name: 'Autres', count: 22 },
];

const kpis = [
  { label: 'Patients actifs', value: '124', icon: 'UsersIcon', color: '#f97316' },
  { label: 'Consultations/mois', value: '286', icon: 'CalendarDaysIcon', color: '#10b981' },
  { label: 'DLQI moyen', value: '11.2', icon: 'ChartBarIcon', color: '#f59e0b' },
  { label: 'Cas urgents', value: '4', icon: 'ExclamationTriangleIcon', color: '#ef4444' },
];

export default function DermatologyContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'consultations', label: 'Consultations', icon: 'CalendarDaysIcon' },
    { key: 'lesions', label: 'Atlas lésionnel', icon: 'BookOpenIcon' },
    { key: 'treatments', label: 'Traitements', icon: 'BeakerIcon' },
    { key: 'phototherapy', label: 'Photothérapie', icon: 'SunIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
              <Icon name="SparklesIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Dermatologie</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Soins cutanés & pathologies dermatologiques</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#f97316' }}>
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
              style={tab === t.key ? { backgroundColor: '#f97316', color: 'white' } : { color: 'var(--muted-foreground)' }}>
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
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#f97316' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans · {p.therapist}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={p.status === 'urgent' ? { backgroundColor: '#fee2e2', color: '#dc2626' } : { backgroundColor: '#ffedd5', color: '#c2410c' }}>
                      {p.status === 'urgent' ? 'Urgent' : 'Actif'}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--foreground)' }}>{p.diagnosis}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.areas.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>{a}</span>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Dernière visite: {p.lastVisit}</span>
                    <span>Prochain: {p.nextVisit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {selectedPatient ? (
                <div className="rounded-xl border p-4 sticky top-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.diagnosis}</p>
                  {'scorad' in selectedPatient && (
                    <div className="rounded-lg p-2 text-center mb-2" style={{ backgroundColor: 'var(--background)' }}>
                      <p className="text-lg font-bold" style={{ color: '#f97316' }}>{(selectedPatient as any).scorad}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>SCORAD</p>
                    </div>
                  )}
                  <div className="rounded-lg p-2 text-center mb-3" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{(selectedPatient as any).dlqi}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>DLQI</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#f97316' }}>Nouveau RDV</button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Ordonnance</button>
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
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.type} · {c.doctor} · {c.date}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={c.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#ffedd5', color: '#c2410c' }}>
                    {c.status === 'completed' ? 'Terminée' : 'Planifiée'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.acts.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>{a}</span>
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{c.findings}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'lesions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesionTypes.map((l, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{l.name}</p>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{l.description}</p>
                <p className="text-xs" style={{ color: '#f97316' }}>Ex: {l.examples}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'treatments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treatments.map((t, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>{t.category}</span>
                </div>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Indication: {t.indication}</p>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Niveau: {t.level}</p>
                <p className="text-xs italic" style={{ color: '#f97316' }}>{t.notes}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'phototherapy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { label: 'Séances ce mois', value: '48', color: '#f97316' },
                { label: 'Patients en cours', value: '12', color: '#10b981' },
                { label: 'Dose cumulée moy.', value: '8.4 J/cm²', color: '#3b82f6' },
              ].map(k => (
                <div key={k.label} className="rounded-xl border p-4 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            {patients.filter(p => p.diagnosis.includes('Psoriasis') || p.diagnosis.includes('Vitiligo')).map(p => (
              <div key={p.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.diagnosis}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>UVB étroite</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="text-sm font-bold" style={{ color: '#f97316' }}>3×/sem</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Fréquence</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="text-sm font-bold" style={{ color: '#f97316' }}>0.35 J/cm²</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dose actuelle</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="text-sm font-bold" style={{ color: '#f97316' }}>18/30</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Séances</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution SCORAD — Aïcha Kouyaté</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoradData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="visit" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="scorad" stroke="#f97316" strokeWidth={2} name="SCORAD" dot={false} />
                  <Line type="monotone" dataKey="dlqi" stroke="#3b82f6" strokeWidth={2} name="DLQI" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Répartition diagnostics</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={diagnosisData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
