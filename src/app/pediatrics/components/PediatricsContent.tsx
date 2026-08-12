'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type TabKey = 'patients' | 'growth' | 'consultations' | 'vaccines' | 'kpis' | 'followup';

interface PedPatient { id: string; name: string; dob: string; age: string; sex: 'M' | 'F'; parent: string; doctor: string; weight: number; height: number; bmi: number; status: 'normal' | 'surveillance' | 'suivi renforcé'; nextVisit: string; bloodType: string; }
interface GrowthEntry { date: string; age: string; weight: number; height: number; hc: number; bmi: number; percentileW: number; percentileH: number; }
interface Consultation { id: string; patient: string; date: string; age: string; doctor: string; motif: string; diagnosis: string; treatment: string; followUp: string; }
interface VaccineRecord { id: string; vaccine: string; doses: { dose: number; date: string | null; status: 'fait' | 'planifié' | 'en retard' | 'non applicable' }[]; }
interface FollowUpProtocol { id: string; patient: string; condition: string; frequency: string; lastVisit: string; nextVisit: string; adherence: number; status: 'actif' | 'suspendu' | 'terminé'; }

const pedPatients: PedPatient[] = [
  { id: 'PED-001', name: 'Ibrahima Diallo', dob: '2023-03-15', age: '3 ans 5 mois', sex: 'M', parent: 'Oumar Diallo', doctor: 'Dr. Sow', weight: 14.2, height: 96, bmi: 15.4, status: 'normal', nextVisit: '15/09/2026', bloodType: 'A+' },
  { id: 'PED-002', name: 'Fatoumata Ndiaye', dob: '2021-07-22', age: '5 ans 0 mois', sex: 'F', parent: 'Aminata Ndiaye', doctor: 'Dr. Sow', weight: 17.8, height: 108, bmi: 15.2, status: 'normal', nextVisit: '22/01/2027', bloodType: 'O+' },
  { id: 'PED-003', name: 'Moussa Ba', dob: '2024-11-08', age: '9 mois', sex: 'M', parent: 'Ibrahima Ba', doctor: 'Dr. Camara', weight: 8.1, height: 70, bmi: 16.5, status: 'surveillance', nextVisit: '10/09/2026', bloodType: 'B+' },
  { id: 'PED-004', name: 'Aïcha Koné', dob: '2020-05-30', age: '6 ans 2 mois', sex: 'F', parent: 'Mariama Koné', doctor: 'Dr. Sow', weight: 19.5, height: 115, bmi: 14.7, status: 'suivi renforcé', nextVisit: '24/08/2026', bloodType: 'AB-' },
  { id: 'PED-005', name: 'Cheikh Mbaye Jr.', dob: '2025-02-14', age: '6 mois', sex: 'M', parent: 'Cheikh Mbaye', doctor: 'Dr. Camara', weight: 7.2, height: 65, bmi: 17.0, status: 'normal', nextVisit: '14/08/2026', bloodType: 'O-' },
];

const growthHistory: GrowthEntry[] = [
  { date: '10/08/2026', age: '3a 5m', weight: 14.2, height: 96, hc: 50.2, bmi: 15.4, percentileW: 50, percentileH: 55 },
  { date: '15/05/2026', age: '3a 2m', weight: 13.8, height: 94, hc: 49.8, bmi: 15.6, percentileW: 48, percentileH: 52 },
  { date: '10/02/2026', age: '2a 11m', weight: 13.2, height: 92, hc: 49.5, bmi: 15.6, percentileW: 45, percentileH: 50 },
  { date: '12/11/2025', age: '2a 8m', weight: 12.8, height: 89, hc: 49.2, bmi: 16.2, percentileW: 44, percentileH: 48 },
  { date: '05/08/2025', age: '2a 5m', weight: 12.1, height: 86, hc: 48.8, bmi: 16.4, percentileW: 42, percentileH: 46 },
];

const consultations: Consultation[] = [
  { id: 'CONS-001', patient: 'Ibrahima Diallo', date: '10/08/2026', age: '3 ans 5 mois', doctor: 'Dr. Sow', motif: 'Consultation de suivi — croissance', diagnosis: 'Développement staturo-pondéral normal', treatment: 'Supplémentation vitamine D3 1000 UI/j', followUp: 'Contrôle à 4 ans' },
  { id: 'CONS-002', patient: 'Aïcha Koné', date: '10/08/2026', age: '6 ans 2 mois', doctor: 'Dr. Sow', motif: 'Retard statural — bilan', diagnosis: 'Retard de croissance — bilan hormonal en cours', treatment: 'Bilan thyroïdien + IGF-1 prescrit', followUp: 'Résultats dans 2 semaines — avis endocrinologie' },
  { id: 'CONS-003', patient: 'Moussa Ba', date: '08/08/2026', age: '9 mois', doctor: 'Dr. Camara', motif: 'Fièvre 38.8°C — irritabilité', diagnosis: 'Otite moyenne aiguë droite', treatment: 'Amoxicilline 80mg/kg/j × 8j + Paracétamol', followUp: 'Contrôle à J10' },
  { id: 'CONS-004', patient: 'Fatoumata Ndiaye', date: '05/08/2026', age: '5 ans', doctor: 'Dr. Sow', motif: 'Vaccination de rappel', diagnosis: 'Enfant en bonne santé', treatment: 'Rappel DTP administré', followUp: 'Prochain vaccin à 6 ans' },
];

const vaccineRecords: VaccineRecord[] = [
  { id: 'V-01', vaccine: 'BCG', doses: [{ dose: 1, date: '2023-03-20', status: 'fait' }] },
  { id: 'V-02', vaccine: 'Hépatite B', doses: [{ dose: 1, date: '2023-03-20', status: 'fait' }, { dose: 2, date: '2023-04-20', status: 'fait' }, { dose: 3, date: '2023-06-20', status: 'fait' }] },
  { id: 'V-03', vaccine: 'Pentavalent (DTP-Hib-HepB)', doses: [{ dose: 1, date: '2023-05-15', status: 'fait' }, { dose: 2, date: '2023-06-15', status: 'fait' }, { dose: 3, date: '2023-07-15', status: 'fait' }] },
  { id: 'V-04', vaccine: 'Polio oral (VPO)', doses: [{ dose: 1, date: '2023-05-15', status: 'fait' }, { dose: 2, date: '2023-06-15', status: 'fait' }, { dose: 3, date: '2023-07-15', status: 'fait' }] },
  { id: 'V-05', vaccine: 'Rougeole-Rubéole', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }, { dose: 2, date: null, status: 'planifié' }] },
  { id: 'V-06', vaccine: 'Méningite A', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }] },
  { id: 'V-07', vaccine: 'Fièvre jaune', doses: [{ dose: 1, date: '2024-03-15', status: 'fait' }] },
  { id: 'V-08', vaccine: 'Rappel DTP', doses: [{ dose: 1, date: null, status: 'en retard' }] },
];

const followUpProtocols: FollowUpProtocol[] = [
  { id: 'FUP-001', patient: 'Aïcha Koné', condition: 'Retard de croissance', frequency: 'Mensuel', lastVisit: '10/08/2026', nextVisit: '10/09/2026', adherence: 85, status: 'actif' },
  { id: 'FUP-002', patient: 'Moussa Ba', condition: 'Surveillance pondérale', frequency: 'Bimensuel', lastVisit: '08/08/2026', nextVisit: '22/08/2026', adherence: 100, status: 'actif' },
  { id: 'FUP-003', patient: 'Ibrahima Diallo', condition: 'Suivi développement psychomoteur', frequency: 'Trimestriel', lastVisit: '10/08/2026', nextVisit: '10/11/2026', adherence: 95, status: 'actif' },
];

const statusPedConfig = {
  normal: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Normal' },
  surveillance: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Surveillance' },
  'suivi renforcé': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Suivi renforcé' },
};

const vaccineStatusConfig = {
  fait: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Fait' },
  planifié: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)', label: 'Planifié' },
  'en retard': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'En retard' },
  'non applicable': { bg: 'rgba(156,163,175,0.15)', color: 'var(--muted-foreground)', label: 'N/A' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'patients', label: 'Profils enfants', icon: 'UsersIcon' },
  { key: 'growth', label: 'Courbes OMS', icon: 'ChartBarIcon' },
  { key: 'consultations', label: 'Consultations', icon: 'ClipboardDocumentListIcon' },
  { key: 'vaccines', label: 'Vaccinations', icon: 'ShieldCheckIcon' },
  { key: 'kpis', label: 'KPIs pédiatriques', icon: 'PresentationChartLineIcon' },
  { key: 'followup', label: 'Protocoles suivi', icon: 'CalendarDaysIcon' },
];

const kpis = [
  { label: 'Enfants suivis', value: '124', icon: 'UsersIcon', color: 'var(--shifa-blue)' },
  { label: 'Consultations ce mois', value: '38', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-cyan)' },
  { label: 'Vaccins en retard', value: String(vaccineRecords.flatMap(v => v.doses).filter(d => d.status === 'en retard').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Retards croissance', value: '3', icon: 'ChartBarIcon', color: 'var(--shifa-amber)' },
  { label: 'Malnutrition dépistée', value: '2', icon: 'ScaleIcon', color: 'var(--shifa-amber)' },
  { label: 'RDV cette semaine', value: '12', icon: 'CalendarDaysIcon', color: 'var(--shifa-green)' },
];

const kpiDetails = [
  { label: 'Taux de vaccination complète', value: '87%', trend: '+3%', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)' },
  { label: 'Prévalence malnutrition aiguë', value: '1.6%', trend: '-0.4%', icon: 'ScaleIcon', color: 'var(--shifa-amber)' },
  { label: 'Taux de suivi régulier', value: '92%', trend: '+1%', icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
  { label: 'Retards développement détectés', value: '2.4%', trend: '=', icon: 'ChartBarIcon', color: 'var(--shifa-purple)' },
  { label: 'Consultations urgentes', value: '8', trend: '-2', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Hospitalisations pédiatriques', value: '3', trend: '=', icon: 'BuildingOffice2Icon', color: 'var(--shifa-cyan)' },
];

export default function PediatricsContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('patients');
  const [selectedPatient, setSelectedPatient] = useState<PedPatient>(pedPatients[0]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-cyan), var(--shifa-blue))' }}>
              <Icon name="StarIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Pédiatrie</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Profils · Courbes OMS · Consultations · Vaccinations · KPIs · Protocoles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PrinterIcon" size={14} /> Rapport</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={14} /> Nouvel enfant</button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 grid grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="card p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xl font-bold" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b flex gap-1 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-blue)] text-[var(--shifa-blue)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* PATIENTS */}
        {activeTab === 'patients' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Enfant', 'Âge / DDN', 'Parent', 'Poids', 'Taille', 'IMC', 'Groupe', 'Médecin', 'Statut', 'Prochain RDV'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pedPatients.map((p, i) => (
                  <tr key={p.id} className="hover:bg-muted/30 cursor-pointer transition-colors" style={{ borderBottom: i < pedPatients.length - 1 ? '1px solid var(--border)' : 'none' }} onClick={() => { setSelectedPatient(p); setActiveTab('growth'); }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-blue)' }}>{p.id}</td>
                    <td className="px-4 py-3"><p className="font-medium" style={{ color: 'var(--foreground)' }}>{p.name}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.sex === 'M' ? 'Garçon' : 'Fille'}</p></td>
                    <td className="px-4 py-3"><p className="font-semibold text-sm" style={{ color: 'var(--shifa-blue)' }}>{p.age}</p><p className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.dob}</p></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.parent}</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.weight} kg</td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{p.height} cm</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{p.bmi}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>{p.bloodType}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.doctor}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: statusPedConfig[p.status].bg, color: statusPedConfig[p.status].color }}>{statusPedConfig[p.status].label}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.nextVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GROWTH CHARTS - WHO */}
        {activeTab === 'growth' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-2">
                {pedPatients.map(p => (
                  <button key={p.id} onClick={() => setSelectedPatient(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedPatient.id === p.id ? 'text-white' : 'hover:bg-muted'}`}
                    style={selectedPatient.id === p.id ? { backgroundColor: 'var(--shifa-blue)' } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Weight chart */}
              <div className="card p-4">
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Courbe poids — {selectedPatient.name} (OMS)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={growthHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="age" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} unit="kg" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <ReferenceLine y={13} stroke="rgba(245,158,11,0.5)" strokeDasharray="4 4" label={{ value: 'P3', fontSize: 9, fill: 'var(--shifa-amber)' }} />
                    <ReferenceLine y={16} stroke="rgba(16,185,129,0.5)" strokeDasharray="4 4" label={{ value: 'P97', fontSize: 9, fill: 'var(--shifa-green)' }} />
                    <Line type="monotone" dataKey="weight" stroke="var(--shifa-blue)" strokeWidth={2} dot={{ r: 4, fill: 'var(--shifa-blue)' }} name="Poids (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Height chart */}
              <div className="card p-4">
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Courbe taille — {selectedPatient.name} (OMS)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={growthHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="age" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} unit="cm" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <ReferenceLine y={84} stroke="rgba(245,158,11,0.5)" strokeDasharray="4 4" label={{ value: 'P3', fontSize: 9, fill: 'var(--shifa-amber)' }} />
                    <ReferenceLine y={100} stroke="rgba(16,185,129,0.5)" strokeDasharray="4 4" label={{ value: 'P97', fontSize: 9, fill: 'var(--shifa-green)' }} />
                    <Line type="monotone" dataKey="height" stroke="var(--shifa-green)" strokeWidth={2} dot={{ r: 4, fill: 'var(--shifa-green)' }} name="Taille (cm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Growth table */}
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Date', 'Âge', 'Poids (kg)', 'Taille (cm)', 'PC (cm)', 'IMC', 'Percentile Poids', 'Percentile Taille'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {growthHistory.map((g, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < growthHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{g.date}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--foreground)' }}>{g.age}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--shifa-blue)' }}>{g.weight}</td>
                      <td className="px-4 py-3 font-bold text-sm" style={{ color: 'var(--shifa-green)' }}>{g.height}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{g.hc}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{g.bmi}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${g.percentileW}%`, backgroundColor: 'var(--shifa-blue)' }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>P{g.percentileW}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                            <div className="h-1.5 rounded-full" style={{ width: `${g.percentileH}%`, backgroundColor: 'var(--shifa-green)' }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: 'var(--shifa-green)' }}>P{g.percentileH}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONSULTATIONS */}
        {activeTab === 'consultations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Consultations pédiatriques</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvelle consultation</button>
            </div>
            <div className="space-y-3">
              {consultations.map(c => (
                <div key={c.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{c.id}</span>
                      </div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{c.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{c.age} · {c.date} · {c.doctor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>MOTIF</p>
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>{c.motif}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>DIAGNOSTIC</p>
                      <p className="text-xs" style={{ color: 'var(--foreground)' }}>{c.diagnosis}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>TRAITEMENT</p>
                      <p className="text-xs" style={{ color: 'var(--foreground)' }}>{c.treatment}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>SUIVI</p>
                      <p className="text-xs" style={{ color: 'var(--foreground)' }}>{c.followUp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VACCINES */}
        {activeTab === 'vaccines' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {Object.entries(vaccineStatusConfig).map(([k, v]) => (
                  <span key={k} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: v.bg, color: v.color }}>
                    {v.label}: {vaccineRecords.flatMap(r => r.doses).filter(d => d.status === k).length}
                  </span>
                ))}
              </div>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Enregistrer vaccin</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Vaccin</th>
                    {[1, 2, 3].map(d => (
                      <th key={d} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Dose {d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vaccineRecords.map((v, i) => (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < vaccineRecords.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{v.vaccine}</td>
                      {[0, 1, 2].map(dIdx => {
                        const dose = v.doses[dIdx];
                        if (!dose) return <td key={dIdx} className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>—</td>;
                        return (
                          <td key={dIdx} className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: vaccineStatusConfig[dose.status].bg, color: vaccineStatusConfig[dose.status].color }}>{vaccineStatusConfig[dose.status].label}</span>
                            {dose.date && <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>{dose.date}</p>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KPIs */}
        {activeTab === 'kpis' && (
          <div>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Indicateurs clés pédiatriques — Août 2026</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {kpiDetails.map(k => (
                <div key={k.label} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${k.color}18` }}>
                      <Icon name={k.icon as any} size={20} style={{ color: k.color }} />
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: k.trend.startsWith('+') ? 'rgba(16,185,129,0.12)' : k.trend.startsWith('-') ? 'rgba(239,68,68,0.12)' : 'rgba(156,163,175,0.15)', color: k.trend.startsWith('+') ? 'var(--shifa-green)' : k.trend.startsWith('-') ? 'var(--shifa-red)' : 'var(--muted-foreground)' }}>{k.trend}</span>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: k.color, fontFamily: 'var(--font-display)' }}>{k.value}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{k.label}</p>
                </div>
              ))}
            </div>
            <div className="card p-5">
              <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Répartition par statut de suivi</h4>
              <div className="space-y-3">
                {Object.entries(statusPedConfig).map(([k, v]) => {
                  const count = pedPatients.filter(p => p.status === k).length;
                  const pct = Math.round((count / pedPatients.length) * 100);
                  return (
                    <div key={k}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{v.label}</span>
                        <span className="text-sm font-bold" style={{ color: v.color }}>{count} enfants ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: v.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FOLLOW-UP PROTOCOLS */}
        {activeTab === 'followup' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Protocoles de suivi pédiatrique</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouveau protocole</button>
            </div>
            <div className="space-y-3">
              {followUpProtocols.map(f => (
                <div key={f.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{f.patient}</h4>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{f.condition}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: f.status === 'actif' ? 'rgba(16,185,129,0.12)' : 'rgba(156,163,175,0.15)', color: f.status === 'actif' ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{f.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Fréquence</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{f.frequency}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Dernière visite</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{f.lastVisit}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Prochaine visite</p>
                      <p className="font-semibold text-sm" style={{ color: 'var(--shifa-blue)' }}>{f.nextVisit}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Adhérence au protocole</span>
                      <span className="text-xs font-bold" style={{ color: f.adherence >= 90 ? 'var(--shifa-green)' : f.adherence >= 70 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>{f.adherence}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${f.adherence}%`, backgroundColor: f.adherence >= 90 ? 'var(--shifa-green)' : f.adherence >= 70 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }} />
                    </div>
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
