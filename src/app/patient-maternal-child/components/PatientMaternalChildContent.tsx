'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type TabKey = 'pregnancy' | 'booklet' | 'growth' | 'development' | 'vaccines' | 'appointments';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'pregnancy', label: 'Suivi grossesse', icon: 'HeartIcon' },
  { key: 'booklet', label: 'Carnet maternité', icon: 'BookOpenIcon' },
  { key: 'growth', label: 'Courbes de croissance', icon: 'ChartBarIcon' },
  { key: 'development', label: 'Développement psychomoteur', icon: 'StarIcon' },
  { key: 'vaccines', label: 'Vaccinations', icon: 'ShieldCheckIcon' },
  { key: 'appointments', label: 'Rendez-vous', icon: 'CalendarDaysIcon' },
];

const pregnancyData = {
  mother: 'Aminata Coulibaly',
  age: 29,
  ddr: '15/11/2025',
  dpa: '22/08/2026',
  sa: '38 SA + 4j',
  gravida: 2,
  para: 1,
  bloodGroup: 'O+',
  physician: 'Dr. Mariama Faye',
  weight: '72 kg',
  weightGain: '+11 kg',
  bp: '118/74',
  fundal: '36 cm',
  presentation: 'Céphalique',
  heartRate: '142 bpm',
  movements: 'Actifs',
  status: 'Grossesse normale',
};

const consultations = [
  { date: '10/12/2025', sa: '4 SA', type: 'Consultation initiale', physician: 'Dr. Faye', weight: '61 kg', bp: '110/70', notes: 'Grossesse confirmée. Bilan sanguin prescrit. Acide folique débuté.', status: 'done' },
  { date: '15/01/2026', sa: '9 SA', type: 'Écho T1', physician: 'Dr. Faye', weight: '62.5 kg', bp: '112/72', notes: 'Écho T1 normale. CN 1.8mm. Clarté nucale normale. Dépistage T21 négatif.', status: 'done' },
  { date: '20/02/2026', sa: '14 SA', type: 'Consultation 2e trimestre', physician: 'Dr. Faye', weight: '64 kg', bp: '114/72', notes: 'Évolution favorable. Mouvements actifs. Bilan biologique normal.', status: 'done' },
  { date: '18/04/2026', sa: '22 SA', type: 'Écho morphologique T2', physician: 'Dr. Faye', weight: '67 kg', bp: '116/74', notes: 'Morphologie fœtale normale. Placenta antérieur. Liquide amniotique normal.', status: 'done' },
  { date: '15/06/2026', sa: '30 SA', type: 'Consultation 3e trimestre', physician: 'Dr. Faye', weight: '70 kg', bp: '118/74', notes: 'Présentation céphalique. HU 29cm. Mouvements actifs. Dépistage diabète gestationnel négatif.', status: 'done' },
  { date: '10/08/2026', sa: '38 SA', type: 'Consultation pré-accouchement', physician: 'Dr. Faye', weight: '72 kg', bp: '118/74', notes: 'Présentation céphalique engagée. Col 2cm. Accouchement imminent.', status: 'current' },
  { date: '22/08/2026', sa: '40 SA', type: 'DPA — Accouchement prévu', physician: 'Dr. Faye', weight: '—', bp: '—', notes: '—', status: 'upcoming' },
];

const weightData = [
  { sa: '4 SA', weight: 61 }, { sa: '9 SA', weight: 62.5 }, { sa: '14 SA', weight: 64 }, { sa: '22 SA', weight: 67 }, { sa: '30 SA', weight: 70 }, { sa: '38 SA', weight: 72 },
];

// Child data (previous child)
const child = {
  name: 'Ibrahima Coulibaly',
  dob: '15/03/2022',
  age: '4 ans 5 mois',
  gender: 'M',
  bloodGroup: 'O+',
  birthWeight: '3.2 kg',
  birthHeight: '50 cm',
};

const growthData = [
  { age: '0m', weight: 3.2, height: 50, headCirc: 34 },
  { age: '2m', weight: 5.1, height: 57, headCirc: 38 },
  { age: '4m', weight: 6.8, height: 63, headCirc: 41 },
  { age: '6m', weight: 7.9, height: 67, headCirc: 43 },
  { age: '9m', weight: 9.2, height: 72, headCirc: 45 },
  { age: '12m', weight: 10.1, height: 76, headCirc: 46 },
  { age: '18m', weight: 11.5, height: 82, headCirc: 47 },
  { age: '24m', weight: 12.8, height: 88, headCirc: 48 },
  { age: '36m', weight: 14.5, height: 96, headCirc: 49 },
  { age: '48m', weight: 16.2, height: 103, headCirc: 50 },
];

const milestones = [
  { category: 'Motricité grossière', items: [
    { milestone: 'Tient sa tête', expectedAge: '3 mois', achieved: true, achievedAge: '3 mois' },
    { milestone: 'Se retourne', expectedAge: '4-5 mois', achieved: true, achievedAge: '4 mois' },
    { milestone: 'S\'assoit seul', expectedAge: '6-8 mois', achieved: true, achievedAge: '7 mois' },
    { milestone: 'Marche seul', expectedAge: '12-15 mois', achieved: true, achievedAge: '13 mois' },
    { milestone: 'Monte les escaliers', expectedAge: '18-24 mois', achieved: true, achievedAge: '20 mois' },
    { milestone: 'Saute à pieds joints', expectedAge: '24-30 mois', achieved: true, achievedAge: '26 mois' },
  ]},
  { category: 'Langage', items: [
    { milestone: 'Gazouillis', expectedAge: '2-3 mois', achieved: true, achievedAge: '2 mois' },
    { milestone: 'Premiers mots', expectedAge: '10-14 mois', achieved: true, achievedAge: '12 mois' },
    { milestone: 'Phrases de 2 mots', expectedAge: '18-24 mois', achieved: true, achievedAge: '22 mois' },
    { milestone: 'Phrases complètes', expectedAge: '3 ans', achieved: true, achievedAge: '3 ans' },
  ]},
  { category: 'Motricité fine', items: [
    { milestone: 'Pince pouce-index', expectedAge: '9-10 mois', achieved: true, achievedAge: '9 mois' },
    { milestone: 'Tient un crayon', expectedAge: '2-3 ans', achieved: true, achievedAge: '2.5 ans' },
    { milestone: 'Dessine un cercle', expectedAge: '3 ans', achieved: true, achievedAge: '3 ans' },
  ]},
];

const vaccines = [
  { name: 'BCG', doses: 1, given: 1, lastDate: '15/03/2022', status: 'complete' },
  { name: 'Polio (VPO)', doses: 4, given: 4, lastDate: '15/09/2022', status: 'complete' },
  { name: 'Pentavalent (DTP-HepB-Hib)', doses: 3, given: 3, lastDate: '15/09/2022', status: 'complete' },
  { name: 'Pneumocoque (PCV13)', doses: 3, given: 3, lastDate: '15/09/2022', status: 'complete' },
  { name: 'Rougeole-Oreillons-Rubéole (ROR)', doses: 2, given: 2, lastDate: '15/03/2023', status: 'complete' },
  { name: 'Méningite A (MenAfriVac)', doses: 1, given: 1, lastDate: '15/09/2023', status: 'complete' },
  { name: 'Rappel DTP', doses: 1, given: 0, lastDate: '—', status: 'due', dueDate: 'Avant 6 ans' },
];

const appointments = [
  { date: '22/08/2026', time: '09:00', type: 'Accouchement prévu', physician: 'Dr. Faye', location: 'Maternité — Salle 3', status: 'upcoming' },
  { date: '10/09/2026', time: '10:00', type: 'Consultation post-natale J21', physician: 'Dr. Faye', location: 'Consultation externe', status: 'upcoming' },
  { date: '15/09/2026', time: '09:30', type: 'Visite pédiatrique nouveau-né', physician: 'Dr. Diallo (Pédiatre)', location: 'Pédiatrie', status: 'upcoming' },
  { date: '10/08/2026', time: '08:30', type: 'Consultation pré-accouchement', physician: 'Dr. Faye', location: 'Maternité', status: 'done' },
];

export default function PatientMaternalChildContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('pregnancy');
  const [activeChild, setActiveChild] = useState<'pregnancy' | 'child'>('pregnancy');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--foreground)', marginBottom: '4px' }}>Santé Maternelle & Infantile</h1>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Suivi grossesse, carnet maternité, courbes de croissance et développement psychomoteur</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveChild('pregnancy')} style={{ padding: '8px 16px', background: activeChild === 'pregnancy' ? 'var(--shifa-blue)' : 'var(--muted)', color: activeChild === 'pregnancy' ? '#fff' : 'var(--foreground)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            🤰 Grossesse en cours
          </button>
          <button onClick={() => setActiveChild('child')} style={{ padding: '8px 16px', background: activeChild === 'child' ? 'var(--shifa-blue)' : 'var(--muted)', color: activeChild === 'child' ? '#fff' : 'var(--foreground)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            👶 Ibrahima (4 ans)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab.key ? 700 : 500, background: activeTab === tab.key ? '#ec4899' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>
            <Icon name={tab.icon} size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* Pregnancy Tab */}
      {activeTab === 'pregnancy' && (
        <div>
          {/* Summary card */}
          <div style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '1px solid #f9a8d4', borderRadius: '16px', padding: '20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              { label: 'Terme actuel', value: pregnancyData.sa, icon: '🤰' },
              { label: 'DPA', value: pregnancyData.dpa, icon: '📅' },
              { label: 'Présentation', value: pregnancyData.presentation, icon: '👶' },
              { label: 'BCF', value: pregnancyData.heartRate, icon: '💓' },
              { label: 'Prise de poids', value: pregnancyData.weightGain, icon: '⚖️' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#be185d' }}>{item.value}</p>
                <p style={{ fontSize: '11px', color: '#9d174d' }}>{item.label}</p>
              </div>
            ))}
          </div>
          {/* Consultations timeline */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Consultations prénatales</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {consultations.map((c, i) => (
              <div key={i} style={{ background: 'var(--card)', border: `1px solid ${c.status === 'current' ? '#f9a8d4' : c.status === 'upcoming' ? 'var(--border)' : 'var(--border)'}`, borderLeft: `4px solid ${c.status === 'current' ? '#ec4899' : c.status === 'upcoming' ? 'var(--border)' : '#16a34a'}`, borderRadius: '10px', padding: '14px 16px', opacity: c.status === 'upcoming' ? 0.7 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{c.type}</p>
                      <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '6px', background: '#fce7f3', color: '#be185d', fontWeight: 600 }}>{c.sa}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{c.date} · {c.physician}</p>
                    {c.notes !== '—' && <p style={{ fontSize: '13px', color: 'var(--foreground)', marginTop: '6px' }}>{c.notes}</p>}
                  </div>
                  {c.status !== 'upcoming' && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>TA: {c.bp}</p>
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Poids: {c.weight}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booklet Tab */}
      {activeTab === 'booklet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Informations mère</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { l: 'Nom', v: pregnancyData.mother }, { l: 'Âge', v: `${pregnancyData.age} ans` },
                { l: 'Groupe sanguin', v: pregnancyData.bloodGroup }, { l: 'Gestité/Parité', v: `G${pregnancyData.gravida}P${pregnancyData.para}` },
                { l: 'DDR', v: pregnancyData.ddr }, { l: 'DPA', v: pregnancyData.dpa },
                { l: 'Médecin référent', v: pregnancyData.physician }, { l: 'Statut', v: pregnancyData.status },
              ].map(f => (
                <div key={f.l} style={{ padding: '8px 10px', background: 'var(--muted)', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{f.l}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{f.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Évolution du poids maternel</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="sa" tick={{ fontSize: 10 }} />
                <YAxis domain={[58, 76]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} kg`, 'Poids']} />
                <Area type="monotone" dataKey="weight" stroke="#ec4899" fill="#fce7f3" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Résultats biologiques clés</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { test: 'Groupe sanguin', result: 'O+ — Rhésus positif', date: '10/12/2025', status: 'normal' },
                { test: 'Sérologie VIH', result: 'Négatif', date: '10/12/2025', status: 'normal' },
                { test: 'Sérologie Rubéole', result: 'Immune (IgG+)', date: '10/12/2025', status: 'normal' },
                { test: 'Dépistage T21', result: 'Risque faible 1/4200', date: '15/01/2026', status: 'normal' },
                { test: 'Glycémie jeun', result: '4.8 mmol/L', date: '15/06/2026', status: 'normal' },
                { test: 'NFS', result: 'Hb 11.8 g/dL', date: '15/06/2026', status: 'normal' },
                { test: 'ECBU', result: 'Stérile', date: '15/06/2026', status: 'normal' },
                { test: 'Écho T3', result: 'Normale — 38 SA', date: '10/08/2026', status: 'normal' },
              ].map(r => (
                <div key={r.test} style={{ padding: '10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>{r.test}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{r.result}</p>
                  <p style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === 'growth' && (
        <div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,102,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👦</div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700 }}>{child.name}</p>
              <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Né le {child.dob} · {child.age} · {child.gender === 'M' ? 'Garçon' : 'Fille'} · Groupe {child.bloodGroup}</p>
              <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>Poids naissance: {child.birthWeight} · Taille naissance: {child.birthHeight}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Courbe de poids (kg)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v} kg`, 'Poids']} />
                  <Line type="monotone" dataKey="weight" stroke="var(--shifa-blue)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Courbe de taille (cm)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} />
                  <YAxis domain={[45, 115]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v} cm`, 'Taille']} />
                  <Line type="monotone" dataKey="height" stroke="var(--shifa-green)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Development Tab */}
      {activeTab === 'development' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Développement psychomoteur — {child.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {milestones.map(cat => (
              <div key={cat.category} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--shifa-blue)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.category}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {cat.items.map(item => (
                    <div key={item.milestone} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '8px 10px', background: item.achieved ? 'rgba(16,185,129,0.05)' : 'var(--muted)', borderRadius: '8px', border: `1px solid ${item.achieved ? 'rgba(16,185,129,0.2)' : 'var(--border)'}` }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: item.achieved ? 'var(--shifa-green)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        {item.achieved && <Icon name="CheckIcon" size={10} color="#fff" />}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}>{item.milestone}</p>
                        <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Attendu: {item.expectedAge}</p>
                        {item.achieved && <p style={{ fontSize: '11px', color: 'var(--shifa-green)', fontWeight: 600 }}>✓ {item.achievedAge}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vaccines Tab */}
      {activeTab === 'vaccines' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Carnet de vaccination — {child.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {vaccines.map(v => (
              <div key={v.name} style={{ background: 'var(--card)', border: `1px solid ${v.status === 'due' ? '#fde68a' : 'var(--border)'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: v.status === 'complete' ? 'rgba(16,185,129,0.1)' : '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={v.status === 'complete' ? 'ShieldCheckIcon' : 'ExclamationTriangleIcon'} size={18} color={v.status === 'complete' ? 'var(--shifa-green)' : '#ca8a04'} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{v.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{v.given}/{v.doses} doses · Dernière: {v.lastDate}</p>
                    {v.status === 'due' && <p style={{ fontSize: '11px', color: '#ca8a04', fontWeight: 600 }}>À faire: {v.dueDate}</p>}
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: v.status === 'complete' ? '#dcfce7' : '#fef9c3', color: v.status === 'complete' ? '#16a34a' : '#ca8a04' }}>
                  {v.status === 'complete' ? '✓ Complet' : '⚠ À faire'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Rendez-vous maternité & pédiatrie</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#ec4899', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <Icon name="PlusIcon" size={14} /> Prendre RDV
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.map((apt, i) => (
              <div key={i} style={{ background: 'var(--card)', border: `1px solid ${apt.status === 'upcoming' ? '#f9a8d4' : 'var(--border)'}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: apt.status === 'upcoming' ? '#fce7f3' : 'var(--muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: apt.status === 'upcoming' ? '#be185d' : 'var(--muted-foreground)', lineHeight: 1 }}>{apt.date.split('/')[0]}</p>
                    <p style={{ fontSize: '10px', color: apt.status === 'upcoming' ? '#be185d' : 'var(--muted-foreground)' }}>{['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][parseInt(apt.date.split('/')[1])-1]}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--foreground)' }}>{apt.type}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{apt.time} · {apt.physician}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{apt.location}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: apt.status === 'upcoming' ? '#fce7f3' : '#dcfce7', color: apt.status === 'upcoming' ? '#be185d' : '#16a34a' }}>
                  {apt.status === 'upcoming' ? 'À venir' : 'Effectué'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
