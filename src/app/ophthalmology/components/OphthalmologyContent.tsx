'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type Tab = 'patients' | 'consultations' | 'vision-tests' | 'prescriptions' | 'equipment' | 'reports';

const patients = [
  { id: 'OPH-001', name: 'Aminata Kouyaté', age: 42, diagnosis: 'Myopie forte + DMLA débutante', od: '-6.50 (-1.25 × 90°)', og: '-7.00 (-1.00 × 85°)', iop: { od: 14, og: 15 }, acuity: { od: '8/10', og: '7/10' }, lastVisit: '10 août', nextVisit: "Aujourd\'hui 09h" },
  { id: 'OPH-002', name: 'Oumar Barry', age: 65, diagnosis: 'Glaucome chronique à angle ouvert', od: '+1.00 (-0.50 × 180°)', og: '+1.25 (-0.75 × 175°)', iop: { od: 22, og: 24 }, acuity: { od: '6/10', og: '5/10' }, lastVisit: '05 août', nextVisit: 'Demain 14h' },
  { id: 'OPH-003', name: 'Kadiatou Sow', age: 8, diagnosis: 'Hypermétropie + amblyopie OG', od: '+3.00', og: '+4.50 (-1.00 × 90°)', iop: { od: 12, og: 13 }, acuity: { od: '10/10', og: '4/10' }, lastVisit: '01 août', nextVisit: '16 août 10h' },
  { id: 'OPH-004', name: 'Ibrahima Diallo', age: 58, diagnosis: 'Cataracte bilatérale', od: '+2.50 (-2.00 × 95°)', og: '+3.00 (-2.50 × 88°)', iop: { od: 16, og: 17 }, acuity: { od: '3/10', og: '2/10' }, lastVisit: '20 juil', nextVisit: '17 août 11h' },
  { id: 'OPH-005', name: 'Fatoumata Traoré', age: 35, diagnosis: 'Astigmatisme mixte', od: '+0.50 (-2.00 × 180°)', og: '+0.75 (-2.25 × 175°)', iop: { od: 13, og: 14 }, acuity: { od: '9/10', og: '9/10' }, lastVisit: '12 août', nextVisit: '18 août 15h' },
];

const consultations = [
  { id: 'C-001', patient: 'Aminata Kouyaté', date: "Aujourd\'hui 09h", type: 'Contrôle DMLA', doctor: 'Dr. Bah', acts: ['OCT maculaire', 'Fond d\'œil', 'Champ visuel'], findings: 'Drusen maculaires stables. Pas de néovascularisation. Surveillance à 6 mois.', status: 'scheduled' },
  { id: 'C-002', patient: 'Oumar Barry', date: 'Hier 14h', type: 'Suivi glaucome', doctor: 'Dr. Koné', acts: ['Tonométrie', 'Champ visuel', 'OCT papille'], findings: 'PIO OD 22 mmHg, OG 24 mmHg. Augmentation traitement. Ajout Latanoprost.', status: 'completed' },
  { id: 'C-003', patient: 'Kadiatou Sow', date: 'Avant-hier 10h', type: 'Suivi amblyopie', doctor: 'Dr. Bah', acts: ['Réfraction sous cycloplégie', 'Orthoptie', 'Occlusion'], findings: 'Amélioration acuité OG: 3/10 → 4/10. Continuer occlusion 4h/jour.', status: 'completed' },
];

const visionTests = [
  { name: 'Acuité visuelle (Monoyer)', category: 'Réfraction', duration: '5 min', description: 'Mesure de l\'acuité visuelle de loin et de près' },
  { name: 'Réfraction objective (Autoréfractomètre)', category: 'Réfraction', duration: '5 min', description: 'Mesure automatique de la réfraction' },
  { name: 'Tonométrie (Goldman)', category: 'Glaucome', duration: '5 min', description: 'Mesure de la pression intra-oculaire' },
  { name: 'Fond d\'œil (Ophtalmoscope)', category: 'Rétine', duration: '10 min', description: 'Examen de la rétine, papille, vaisseaux' },
  { name: 'OCT (Tomographie cohérence optique)', category: 'Imagerie', duration: '10 min', description: 'Coupe transversale rétine et nerf optique' },
  { name: 'Champ visuel (Périmétrie)', category: 'Glaucome/Neuro', duration: '20 min', description: 'Cartographie du champ visuel' },
  { name: 'Biomicroscopie (Lampe à fente)', category: 'Segment antérieur', duration: '10 min', description: 'Examen cornée, cristallin, chambre antérieure' },
  { name: 'Pachymétrie', category: 'Cornée', duration: '5 min', description: 'Mesure épaisseur cornéenne' },
];

const iopData = [
  { month: 'Mar', od: 18, og: 20 },
  { month: 'Avr', od: 20, og: 22 },
  { month: 'Mai', od: 19, og: 21 },
  { month: 'Jun', od: 21, og: 23 },
  { month: 'Jul', od: 22, og: 24 },
  { month: 'Aoû', od: 22, og: 24 },
];

const acuityData = [
  { visit: 'V1', od: 3, og: 2 },
  { visit: 'V2', od: 4, og: 3 },
  { visit: 'V3', od: 5, og: 3 },
  { visit: 'V4', od: 5, og: 4 },
  { visit: 'V5', od: 6, og: 5 },
];

const equipment = [
  { name: 'Autoréfractomètre Topcon', status: 'available', lastCalibration: '01 août' },
  { name: 'Tonomètre Goldman', status: 'available', lastCalibration: '15 juil' },
  { name: 'OCT Zeiss Cirrus', status: 'in_use', lastCalibration: '10 août' },
  { name: 'Périmètre Humphrey', status: 'available', lastCalibration: '05 août' },
  { name: 'Lampe à fente Haag-Streit', status: 'available', lastCalibration: '20 juil' },
  { name: 'Rétinographe non mydriatique', status: 'maintenance', lastCalibration: '01 juil' },
];

const kpis = [
  { label: 'Patients actifs', value: '98', icon: 'UsersIcon', color: '#10b981' },
  { label: 'Consultations/mois', value: '245', icon: 'CalendarDaysIcon', color: '#3b82f6' },
  { label: 'PIO moyenne', value: '16.2 mmHg', icon: 'EyeIcon', color: '#f59e0b' },
  { label: 'Glaucomes suivis', value: '18', icon: 'ExclamationTriangleIcon', color: '#ef4444' },
];

export default function OphthalmologyContent() {
  const [tab, setTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { key: 'consultations', label: 'Consultations', icon: 'CalendarDaysIcon' },
    { key: 'vision-tests', label: 'Examens visuels', icon: 'EyeIcon' },
    { key: 'prescriptions', label: 'Ordonnances optiques', icon: 'DocumentTextIcon' },
    { key: 'equipment', label: 'Équipements', icon: 'CpuChipIcon' },
    { key: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Icon name="EyeIcon" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Ophtalmologie</h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bilan visuel & pathologies oculaires</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>
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
              style={tab === t.key ? { backgroundColor: '#10b981', color: 'white' } : { color: 'var(--muted-foreground)' }}>
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
                  style={{ backgroundColor: 'var(--card)', borderColor: selectedPatient?.id === p.id ? '#10b981' : 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.id} · {p.age} ans</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>Actif</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>{p.diagnosis}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>OD (œil droit)</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>Réfraction: {p.od}</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>PIO: {p.iop.od} mmHg · AV: {p.acuity.od}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>OG (œil gauche)</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>Réfraction: {p.og}</p>
                      <p style={{ color: 'var(--muted-foreground)' }}>PIO: {p.iop.og} mmHg · AV: {p.acuity.og}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
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
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[{ label: 'PIO OD', value: `${selectedPatient.iop.od} mmHg`, color: selectedPatient.iop.od > 21 ? '#ef4444' : '#10b981' },
                      { label: 'PIO OG', value: `${selectedPatient.iop.og} mmHg`, color: selectedPatient.iop.og > 21 ? '#ef4444' : '#10b981' },
                      { label: 'AV OD', value: selectedPatient.acuity.od, color: '#3b82f6' },
                      { label: 'AV OG', value: selectedPatient.acuity.og, color: '#3b82f6' }].map(m => (
                      <div key={m.label} className="rounded-lg p-2 text-center" style={{ backgroundColor: 'var(--background)' }}>
                        <p className="text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#10b981' }}>Nouveau RDV</button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Ordonnance</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border p-6 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Icon name="EyeIcon" size={32} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
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
                  <span className="text-xs px-2 py-0.5 rounded-full" style={c.status === 'completed' ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: '#d1fae5', color: '#065f46' }}>
                    {c.status === 'completed' ? 'Terminée' : 'Planifiée'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.acts.map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>{a}</span>
                  ))}
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{c.findings}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'vision-tests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visionTests.map((t, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>{t.category}</span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Durée: {t.duration}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.description}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'prescriptions' && (
          <div className="space-y-4">
            {patients.slice(0, 3).map(p => (
              <div key={p.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Ordonnance optique — {p.lastVisit}</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10b981' }}>
                    <Icon name="ArrowDownTrayIcon" size={12} />Imprimer
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>OD</p>
                    <p style={{ color: 'var(--muted-foreground)' }}>{p.od}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>AV: {p.acuity.od}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--background)' }}>
                    <p className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>OG</p>
                    <p style={{ color: 'var(--muted-foreground)' }}>{p.og}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>AV: {p.acuity.og}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'equipment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((eq, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{eq.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={
                    eq.status === 'available' ? { backgroundColor: '#dcfce7', color: '#16a34a' } :
                    eq.status === 'in_use' ? { backgroundColor: '#fef9c3', color: '#ca8a04' } :
                    { backgroundColor: '#fee2e2', color: '#dc2626' }
                  }>
                    {eq.status === 'available' ? 'Disponible' : eq.status === 'in_use' ? 'En utilisation' : 'Maintenance'}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dernière calibration: {eq.lastCalibration}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution PIO — Oumar Barry</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={iopData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[10, 30]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="od" stroke="#10b981" strokeWidth={2} name="OD" dot={false} />
                  <Line type="monotone" dataKey="og" stroke="#3b82f6" strokeWidth={2} name="OG" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution acuité — Kadiatou Sow</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={acuityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="visit" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="od" fill="#10b981" name="OD" />
                  <Bar dataKey="og" fill="#3b82f6" name="OG" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
