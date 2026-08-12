'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

type Tab = 'overview' | 'diabetes' | 'hypertension' | 'asthma' | 'alerts' | 'goals';

const glucoseData = [
  { date: '1 août', value: 8.2 }, { date: '3 août', value: 7.8 }, { date: '5 août', value: 9.1 },
  { date: '7 août', value: 7.4 }, { date: '9 août', value: 8.6 }, { date: '11 août', value: 7.9 },
];

const bpData = [
  { date: '1 août', systolic: 145, diastolic: 92 }, { date: '3 août', systolic: 138, diastolic: 88 },
  { date: '5 août', systolic: 152, diastolic: 95 }, { date: '7 août', systolic: 135, diastolic: 85 },
  { date: '9 août', systolic: 142, diastolic: 90 }, { date: '11 août', systolic: 139, diastolic: 87 },
];

const peakFlowData = [
  { date: '1 août', value: 320 }, { date: '3 août', value: 295 }, { date: '5 août', value: 340 },
  { date: '7 août', value: 310 }, { date: '9 août', value: 355 }, { date: '11 août', value: 330 },
];

const radarData = [
  { metric: 'Glycémie', score: 72 }, { metric: 'Tension', score: 65 }, { metric: 'Poids', score: 80 },
  { metric: 'Activité', score: 55 }, { metric: 'Médicaments', score: 90 }, { metric: 'Alimentation', score: 68 },
];

export default function PatientChronicDiseaseContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'diabetes', label: 'Diabète', icon: 'BeakerIcon' },
    { key: 'hypertension', label: 'Hypertension', icon: 'HeartIcon' },
    { key: 'asthma', label: 'Asthme', icon: 'CloudIcon' },
    { key: 'alerts', label: 'Alertes', icon: 'BellIcon' },
    { key: 'goals', label: 'Objectifs', icon: 'TrophyIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Maladies chroniques</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tableau de bord de suivi — Aïcha Diallo · Diabète T2 + HTA + Asthme</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground">
              <Icon name="DocumentTextIcon" size={15} /> Rapport PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
              <Icon name="PlusIcon" size={15} /> Saisir mesure
            </button>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'Diabète T2', status: 'Contrôle insuffisant', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'Hypertension', status: 'Non contrôlée', color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'Asthme', status: 'Partiellement contrôlé', color: 'bg-orange-50 text-orange-700 border-orange-200' },
          ].map(d => (
            <div key={d.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${d.color}`}>
              <span className="font-semibold">{d.label}</span>
              <span>·</span>
              <span>{d.status}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mt-4 border-b border-border -mb-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'HbA1c', value: '8.2%', target: '< 7%', status: 'bad', icon: 'BeakerIcon' },
                { label: 'Tension artérielle', value: '142/90', target: '< 130/80', status: 'bad', icon: 'HeartIcon' },
                { label: 'DEP (Peak Flow)', value: '330 L/min', target: '> 380 L/min', status: 'warn', icon: 'CloudIcon' },
                { label: 'IMC', value: '27.4', target: '18.5–25', status: 'warn', icon: 'ScaleIcon' },
              ].map(kpi => {
                const statusStyle = kpi.status === 'bad' ? 'border-red-200 bg-red-50' : kpi.status === 'warn' ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50';
                const valueColor = kpi.status === 'bad' ? 'text-red-700' : kpi.status === 'warn' ? 'text-amber-700' : 'text-emerald-700';
                return (
                  <div key={kpi.label} className={`border rounded-xl p-4 ${statusStyle}`}>
                    <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cible : {kpi.target}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Score de contrôle global</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Prochains rendez-vous</h3>
                <div className="space-y-3">
                  {[
                    { date: '15 août', label: 'Bilan HbA1c — Laboratoire', type: 'lab', urgent: true },
                    { date: '18 août', label: 'Consultation Dr. Sy — Diabétologie', type: 'consult', urgent: false },
                    { date: '22 août', label: 'Spirométrie — Pneumologie', type: 'imaging', urgent: false },
                    { date: '1 sept.', label: 'Consultation Cardio. Diop', type: 'consult', urgent: false },
                  ].map(appt => (
                    <div key={appt.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-12 text-center">
                        <p className="text-xs font-bold text-primary">{appt.date.split(' ')[0]}</p>
                        <p className="text-xs text-muted-foreground">{appt.date.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{appt.label}</p>
                      </div>
                      {appt.urgent && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">Urgent</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Medication adherence */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Observance médicamenteuse</h3>
              <div className="space-y-3">
                {[
                  { drug: 'Metformine 1000mg', schedule: '2x/jour', adherence: 92, status: 'good' },
                  { drug: 'Amlodipine 5mg', schedule: '1x/jour', adherence: 78, status: 'warn' },
                  { drug: 'Salbutamol (inhalateur)', schedule: 'Si besoin', adherence: 85, status: 'good' },
                  { drug: 'Béclométasone (inhalateur)', schedule: '2x/jour', adherence: 65, status: 'bad' },
                ].map(med => {
                  const barColor = med.status === 'good' ? 'bg-emerald-500' : med.status === 'warn' ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <div key={med.drug} className="flex items-center gap-4">
                      <div className="w-48 shrink-0">
                        <p className="text-sm font-medium text-foreground">{med.drug}</p>
                        <p className="text-xs text-muted-foreground">{med.schedule}</p>
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${med.adherence}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-10 text-right">{med.adherence}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Diabetes Tab */}
        {activeTab === 'diabetes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'HbA1c', value: '8.2%', prev: '8.5%', trend: 'down', target: '< 7%' },
                { label: 'Glycémie à jeun', value: '7.9 mmol/L', prev: '8.2 mmol/L', trend: 'down', target: '< 7 mmol/L' },
                { label: 'Glycémie post-prandiale', value: '11.4 mmol/L', prev: '10.8 mmol/L', trend: 'up', target: '< 10 mmol/L' },
              ].map(m => (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon name={m.trend === 'down' ? 'ArrowDownIcon' : 'ArrowUpIcon'} size={14} className={m.trend === 'down' ? 'text-emerald-600' : 'text-red-500'} />
                    <span className="text-xs text-muted-foreground">Préc. : {m.prev}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Cible : {m.target}</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Glycémie capillaire — 11 derniers jours</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[5, 12]} tick={{ fontSize: 11 }} unit=" mmol/L" />
                  <Tooltip formatter={(v: number) => [`${v} mmol/L`, 'Glycémie']} />
                  <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3">Recommandations</h3>
              <div className="space-y-2">
                {[
                  { text: 'Augmenter la dose de Metformine à 2000mg/jour — à valider avec Dr. Sy', priority: 'high' },
                  { text: 'Renforcer l\'éducation thérapeutique sur l\'alimentation', priority: 'medium' },
                  { text: 'Programmer un bilan rénal (créatinine, microalbuminurie)', priority: 'medium' },
                  { text: 'Encourager 30 min d\'activité physique modérée 5x/semaine', priority: 'low' },
                ].map((rec, i) => {
                  const pc = { high: 'bg-red-50 border-red-200 text-red-800', medium: 'bg-amber-50 border-amber-200 text-amber-800', low: 'bg-blue-50 border-blue-200 text-blue-800' }[rec.priority];
                  return (
                    <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${pc}`}>
                      <Icon name="LightBulbIcon" size={15} className="shrink-0 mt-0.5" />
                      {rec.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hypertension Tab */}
        {activeTab === 'hypertension' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Systolique moy.', value: '142 mmHg', target: '< 130 mmHg', status: 'bad' },
                { label: 'Diastolique moy.', value: '90 mmHg', target: '< 80 mmHg', status: 'bad' },
                { label: 'Fréquence cardiaque', value: '78 bpm', target: '60–100 bpm', status: 'good' },
              ].map(m => {
                const c = m.status === 'bad' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';
                return (
                  <div key={m.label} className={`border rounded-xl p-4 ${c}`}>
                    <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    <p className="text-2xl font-bold mt-1">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cible : {m.target}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Tension artérielle — 11 derniers jours</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 170]} tick={{ fontSize: 11 }} unit=" mmHg" />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Systolique" />
                  <Line type="monotone" dataKey="diastolic" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="Diastolique" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Asthma Tab */}
        {activeTab === 'asthma' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'DEP actuel', value: '330 L/min', target: '> 380 L/min', status: 'warn' },
                { label: 'Crises ce mois', value: '2', target: '0', status: 'warn' },
                { label: 'Utilisation bronchodilatateur', value: '3x/sem', target: '< 2x/sem', status: 'bad' },
              ].map(m => {
                const c = m.status === 'bad' ? 'border-red-200 bg-red-50 text-red-700' : m.status === 'warn' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';
                return (
                  <div key={m.label} className={`border rounded-xl p-4 ${c}`}>
                    <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                    <p className="text-2xl font-bold mt-1">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cible : {m.target}</p>
                  </div>
                );
              })}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">DEP (Peak Flow) — 11 derniers jours</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={peakFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[250, 420]} tick={{ fontSize: 11 }} unit=" L/min" />
                  <Tooltip formatter={(v: number) => [`${v} L/min`, 'DEP']} />
                  <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {[
              { title: 'Glycémie post-prandiale élevée', desc: 'Mesure de 11.4 mmol/L — dépasse le seuil de 10 mmol/L', severity: 'high', date: 'Aujourd\'hui 13h45', action: 'Contacter Dr. Sy' },
              { title: 'Tension artérielle non contrôlée', desc: 'Moyenne 7 jours : 142/90 mmHg — cible non atteinte', severity: 'high', date: 'Hier', action: 'Réviser traitement antihypertenseur' },
              { title: 'Observance béclométasone insuffisante', desc: '65% d\'observance — risque de décompensation asthmatique', severity: 'medium', date: 'Il y a 2 jours', action: 'Éducation thérapeutique' },
              { title: 'Bilan HbA1c en retard', desc: 'Dernier bilan il y a 4 mois — recommandé tous les 3 mois', severity: 'medium', date: 'Il y a 3 jours', action: 'Programmer laboratoire' },
              { title: 'Poids stable — objectif non atteint', desc: 'IMC 27.4 — objectif < 25', severity: 'low', date: 'Il y a 1 semaine', action: 'Consultation diététique' },
            ].map((alert, i) => {
              const sc = { high: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700', label: 'Haute' }, medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', label: 'Moyenne' }, low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Basse' } }[alert.severity];
              return (
                <div key={i} className={`border rounded-xl p-4 ${sc.bg} ${sc.border}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon name="ExclamationTriangleIcon" size={18} className={`${sc.icon} shrink-0 mt-0.5`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm">{alert.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.badge}`}>{sc.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.desc}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline shrink-0 ml-4">{alert.action}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            {[
              { title: 'Atteindre HbA1c < 7%', current: '8.2%', target: '< 7%', progress: 45, deadline: 'Déc. 2026', status: 'in_progress' },
              { title: 'Tension artérielle contrôlée', current: '142/90', target: '< 130/80', progress: 30, deadline: 'Oct. 2026', status: 'in_progress' },
              { title: 'Améliorer DEP asthme', current: '330 L/min', target: '> 380 L/min', progress: 60, deadline: 'Sept. 2026', status: 'in_progress' },
              { title: 'Réduire IMC', current: '27.4', target: '< 25', progress: 20, deadline: 'Mars 2027', status: 'in_progress' },
              { title: 'Observance médicamenteuse > 90%', current: '78%', target: '> 90%', progress: 78, deadline: 'Sept. 2026', status: 'in_progress' },
            ].map((goal, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Actuel : <span className="text-foreground font-medium">{goal.current}</span> → Cible : <span className="text-primary font-medium">{goal.target}</span> · Échéance : {goal.deadline}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">{goal.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
