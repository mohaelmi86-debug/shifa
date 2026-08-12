'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Tab = 'patients' | 'assessments' | 'meal-plans' | 'monitoring' | 'education' | 'reports';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  bmi: number;
  bmiStatus: 'normal' | 'overweight' | 'obese' | 'underweight';
  lastVisit: string;
  nextVisit: string;
  dietitian: string;
  adherence: number;
  goals: string[];
}

interface Assessment {
  id: string;
  patient: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  waist: number;
  fatMass: number;
  muscleMass: number;
  hydration: number;
  notes: string;
  dietitian: string;
}

interface MealPlan {
  id: string;
  patient: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  adherence: number;
}

const patients: Patient[] = [
  { id: 'P-001', name: 'Aïcha Diallo', age: 45, condition: 'Diabète type 2', bmi: 28.4, bmiStatus: 'overweight', lastVisit: '05 août', nextVisit: '19 août', dietitian: 'Diét. Koné', adherence: 78, goals: ['Réduire HbA1c', 'Perte 5kg', 'Réduire sucres'] },
  { id: 'P-002', name: 'Moussa Traoré', age: 62, condition: 'Insuffisance rénale', bmi: 24.1, bmiStatus: 'normal', lastVisit: '08 août', nextVisit: '22 août', dietitian: 'Diét. Koné', adherence: 91, goals: ['Limiter protéines', 'Contrôle potassium', 'Hydratation'] },
  { id: 'P-003', name: 'Mariama Bah', age: 38, condition: 'Cancer — dénutrition', bmi: 17.2, bmiStatus: 'underweight', lastVisit: '10 août', nextVisit: '17 août', dietitian: 'Diét. Sow', adherence: 65, goals: ['Prise de poids', 'Apport protéique', 'Appétit'] },
  { id: 'P-004', name: 'Ibrahima Kouyaté', age: 55, condition: 'Obésité morbide', bmi: 38.7, bmiStatus: 'obese', lastVisit: '03 août', nextVisit: '17 août', dietitian: 'Diét. Koné', adherence: 54, goals: ['Perte 20kg', 'Activité physique', 'Comportement alimentaire'] },
  { id: 'P-005', name: 'Fatoumata Camara', age: 29, condition: 'Grossesse — nutrition', bmi: 23.8, bmiStatus: 'normal', lastVisit: '11 août', nextVisit: '25 août', dietitian: 'Diét. Sow', adherence: 88, goals: ['Apport folates', 'Fer et calcium', 'Prise de poids contrôlée'] },
  { id: 'P-006', name: 'Oumar Diallo', age: 71, condition: 'Dénutrition gériatrique', bmi: 18.9, bmiStatus: 'underweight', lastVisit: '07 août', nextVisit: '21 août', dietitian: 'Diét. Koné', adherence: 72, goals: ['Enrichissement alimentaire', 'Compléments nutritionnels', 'Appétit'] },
];

const assessments: Assessment[] = [
  { id: 'A-001', patient: 'Aïcha Diallo', date: '05 août 2025', weight: 74.2, height: 162, bmi: 28.4, waist: 92, fatMass: 34.2, muscleMass: 42.1, hydration: 52.3, notes: 'Légère amélioration depuis dernier bilan. Réduction tour de taille de 2cm.', dietitian: 'Diét. Koné' },
  { id: 'A-002', patient: 'Moussa Traoré', date: '08 août 2025', weight: 68.5, height: 168, bmi: 24.1, waist: 88, fatMass: 22.1, muscleMass: 38.4, hydration: 58.7, notes: 'Poids stable. Bonne observance régime hypoprotéique.', dietitian: 'Diét. Koné' },
  { id: 'A-003', patient: 'Mariama Bah', date: '10 août 2025', weight: 48.3, height: 167, bmi: 17.2, waist: 68, fatMass: 14.2, muscleMass: 28.1, hydration: 61.2, notes: 'Dénutrition sévère. Compléments nutritionnels oraux initiés.', dietitian: 'Diét. Sow' },
];

const mealPlans: MealPlan[] = [
  { id: 'MP-001', patient: 'Aïcha Diallo', type: 'Diabétique — IG bas', calories: 1800, protein: 90, carbs: 200, fat: 60, fiber: 35, startDate: '05 août', endDate: '02 sept', status: 'active', adherence: 78 },
  { id: 'MP-002', patient: 'Moussa Traoré', type: 'Hypoprotéique — IRC', calories: 2000, protein: 50, carbs: 280, fat: 70, fiber: 30, startDate: '08 août', endDate: '05 sept', status: 'active', adherence: 91 },
  { id: 'MP-003', patient: 'Mariama Bah', type: 'Hyperénergétique — dénutrition', calories: 2800, protein: 140, carbs: 350, fat: 90, fiber: 25, startDate: '10 août', endDate: '07 sept', status: 'active', adherence: 65 },
  { id: 'MP-004', patient: 'Ibrahima Kouyaté', type: 'Hypocalorique — obésité', calories: 1400, protein: 100, carbs: 140, fat: 45, fiber: 40, startDate: '03 août', endDate: '31 août', status: 'active', adherence: 54 },
  { id: 'MP-005', patient: 'Fatoumata Camara', type: 'Grossesse — T2', calories: 2200, protein: 110, carbs: 280, fat: 75, fiber: 32, startDate: '11 août', endDate: '08 sept', status: 'active', adherence: 88 },
];

const weightTrendData = [
  { month: 'Mars', aïcha: 78.1, moussa: 69.2, ibrahima: 102.4 },
  { month: 'Avr', aïcha: 77.3, moussa: 68.9, ibrahima: 101.1 },
  { month: 'Mai', aïcha: 76.8, moussa: 68.7, ibrahima: 99.8 },
  { month: 'Juin', aïcha: 76.1, moussa: 68.6, ibrahima: 98.2 },
  { month: 'Juil', aïcha: 75.4, moussa: 68.5, ibrahima: 97.0 },
  { month: 'Août', aïcha: 74.2, moussa: 68.5, ibrahima: 95.8 },
];

const macroDistribution = [
  { name: 'Glucides', value: 50, color: '#3b82f6' },
  { name: 'Protéines', value: 20, color: '#10b981' },
  { name: 'Lipides', value: 30, color: '#f59e0b' },
];

const adherenceData = [
  { week: 'S1', adherence: 72 },
  { week: 'S2', adherence: 78 },
  { week: 'S3', adherence: 75 },
  { week: 'S4', adherence: 82 },
  { week: 'S5', adherence: 79 },
  { week: 'S6', adherence: 85 },
];

const bmiStatusConfig = {
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Normal' },
  overweight: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Surpoids' },
  obese: { bg: 'bg-red-50', text: 'text-red-700', label: 'Obèse' },
  underweight: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Sous-poids' },
};

const planStatusConfig = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Actif' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Terminé' },
  draft: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Brouillon' },
};

const educationTopics = [
  { id: 'E-001', title: 'Alimentation et diabète', category: 'Maladies chroniques', format: 'Atelier groupe', duration: '90 min', nextSession: '16 août', enrolled: 8, capacity: 12, dietitian: 'Diét. Koné' },
  { id: 'E-002', title: 'Régime rénal — ce qu\'il faut savoir', category: 'Insuffisance rénale', format: 'Consultation individuelle', duration: '45 min', nextSession: '18 août', enrolled: 1, capacity: 1, dietitian: 'Diét. Koné' },
  { id: 'E-003', title: 'Nutrition pendant la grossesse', category: 'Maternité', format: 'Atelier groupe', duration: '60 min', nextSession: '20 août', enrolled: 6, capacity: 10, dietitian: 'Diét. Sow' },
  { id: 'E-004', title: 'Gestion du poids — approche comportementale', category: 'Obésité', format: 'Programme 8 semaines', duration: '60 min/séance', nextSession: '15 août', enrolled: 5, capacity: 8, dietitian: 'Diét. Koné' },
  { id: 'E-005', title: 'Enrichissement alimentaire pour seniors', category: 'Gériatrie', format: 'Atelier famille', duration: '45 min', nextSession: '22 août', enrolled: 4, capacity: 6, dietitian: 'Diét. Sow' },
];

export default function NutritionDieteticsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'patients', label: 'Patients', icon: 'UsersIcon' },
    { id: 'assessments', label: 'Bilans nutritionnels', icon: 'ClipboardDocumentListIcon' },
    { id: 'meal-plans', label: 'Plans alimentaires', icon: 'DocumentTextIcon' },
    { id: 'monitoring', label: 'Suivi & Évolution', icon: 'ChartBarIcon' },
    { id: 'education', label: 'Éducation thérapeutique', icon: 'AcademicCapIcon' },
    { id: 'reports', label: 'Rapports', icon: 'DocumentChartBarIcon' },
  ];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Icon name="HeartIcon" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Nutrition & Diététique</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Bilans, plans alimentaires et suivi nutritionnel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4 mr-4">
            {[
              { label: 'Patients actifs', value: '24', color: '#10b981' },
              { label: 'Plans en cours', value: '18', color: '#3b82f6' },
              { label: 'Séances aujourd\'hui', value: '6', color: '#f59e0b' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>
            <Icon name="PlusIcon" size={16} />
            Nouveau patient
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent'}`}
            style={{ color: activeTab === tab.id ? '#10b981' : 'var(--muted-foreground)' }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* PATIENTS TAB */}
        {activeTab === 'patients' && (
          <div className="flex gap-6 h-full">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}
                  />
                </div>
                <select className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)' }}>
                  <option>Tous les statuts</option>
                  <option>Surpoids</option>
                  <option>Obèse</option>
                  <option>Sous-poids</option>
                  <option>Normal</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredPatients.map(patient => {
                  const bmiCfg = bmiStatusConfig[patient.bmiStatus];
                  return (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.id === patient.id ? 'ring-2 ring-emerald-400' : 'hover:shadow-sm'}`}
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{patient.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{patient.age} ans — {patient.condition}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bmiCfg.bg} ${bmiCfg.text}`}>{bmiCfg.label}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{patient.bmi}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>IMC</p>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{patient.adherence}%</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Observance</p>
                        </div>
                        <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                          <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{patient.nextVisit}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochain RDV</p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                          <span>Observance plan alimentaire</span>
                          <span>{patient.adherence}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${patient.adherence}%`, backgroundColor: patient.adherence >= 80 ? '#10b981' : patient.adherence >= 60 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {patient.goals.map(g => (
                          <span key={g} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{g}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedPatient && (
              <div className="w-80 shrink-0 rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Détail patient</h3>
                  <button onClick={() => setSelectedPatient(null)}><Icon name="XMarkIcon" size={16} style={{ color: 'var(--muted-foreground)' }} /></button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedPatient.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.age} ans</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedPatient.condition}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'IMC', value: selectedPatient.bmi.toString() },
                    { label: 'Statut', value: bmiStatusConfig[selectedPatient.bmiStatus].label },
                    { label: 'Dernière visite', value: selectedPatient.lastVisit },
                    { label: 'Prochain RDV', value: selectedPatient.nextVisit },
                    { label: 'Diététicien', value: selectedPatient.dietitian },
                    { label: 'Observance', value: `${selectedPatient.adherence}%` },
                  ].map(item => (
                    <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Objectifs nutritionnels</p>
                  <div className="space-y-1">
                    {selectedPatient.goals.map(g => (
                      <div key={g} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>Nouveau bilan</button>
                  <button className="w-full py-2 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Modifier plan alimentaire</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Bilans nutritionnels</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>
                <Icon name="PlusIcon" size={16} />
                Nouveau bilan
              </button>
            </div>
            {assessments.map(a => (
              <div key={a.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{a.patient}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{a.date} — {a.dietitian}</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{a.id}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Poids', value: `${a.weight} kg` },
                    { label: 'Taille', value: `${a.height} cm` },
                    { label: 'IMC', value: a.bmi.toString() },
                    { label: 'Tour de taille', value: `${a.waist} cm` },
                    { label: 'Masse grasse', value: `${a.fatMass}%` },
                    { label: 'Masse musculaire', value: `${a.muscleMass}%` },
                    { label: 'Hydratation', value: `${a.hydration}%` },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Notes cliniques</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{a.notes}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEAL PLANS TAB */}
        {activeTab === 'meal-plans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Plans alimentaires</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>
                <Icon name="PlusIcon" size={16} />
                Créer un plan
              </button>
            </div>
            {mealPlans.map(plan => {
              const cfg = planStatusConfig[plan.status];
              return (
                <div key={plan.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{plan.patient}</p>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{plan.type}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{plan.startDate} → {plan.endDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {[
                      { label: 'Calories', value: `${plan.calories} kcal`, color: '#f59e0b' },
                      { label: 'Protéines', value: `${plan.protein}g`, color: '#10b981' },
                      { label: 'Glucides', value: `${plan.carbs}g`, color: '#3b82f6' },
                      { label: 'Lipides', value: `${plan.fat}g`, color: '#ef4444' },
                      { label: 'Fibres', value: `${plan.fiber}g`, color: '#8b5cf6' },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Observance du plan</span>
                      <span className="font-medium">{plan.adherence}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${plan.adherence}%`, backgroundColor: plan.adherence >= 80 ? '#10b981' : plan.adherence >= 60 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MONITORING TAB */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Évolution du poids (kg)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="aïcha" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Aïcha" />
                    <Line type="monotone" dataKey="moussa" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Moussa" />
                    <Line type="monotone" dataKey="ibrahima" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Ibrahima" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Distribution macronutriments</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={macroDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                      {macroDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {macroDistribution.map(m => (
                    <div key={m.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        <span style={{ color: 'var(--foreground)' }}>{m.name}</span>
                      </div>
                      <span className="font-medium" style={{ color: 'var(--muted-foreground)' }}>{m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Observance hebdomadaire moyenne (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="adherence" fill="#10b981" radius={[4, 4, 0, 0]} name="Observance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Éducation thérapeutique nutritionnelle</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>
                <Icon name="PlusIcon" size={16} />
                Nouvelle session
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {educationTopics.map(topic => (
                <div key={topic.id} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{topic.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{topic.category}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{topic.format}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: 'Durée', value: topic.duration },
                      { label: 'Prochaine session', value: topic.nextSession },
                      { label: 'Inscrits', value: `${topic.enrolled}/${topic.capacity}` },
                      { label: 'Animateur', value: topic.dietitian },
                    ].map(item => (
                      <div key={item.label} className="p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Remplissage</span>
                      <span>{Math.round((topic.enrolled / topic.capacity) * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${(topic.enrolled / topic.capacity) * 100}%`, backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                  <button className="w-full py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>Gérer la session</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Rapports & Statistiques</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Patients suivis', value: '24', sub: 'Ce mois', icon: 'UsersIcon', color: '#10b981' },
                { label: 'Bilans réalisés', value: '38', sub: 'Ce mois', icon: 'ClipboardDocumentListIcon', color: '#3b82f6' },
                { label: 'Plans actifs', value: '18', sub: 'En cours', icon: 'DocumentTextIcon', color: '#f59e0b' },
                { label: 'Observance moy.', value: '76%', sub: 'Tous patients', icon: 'ChartBarIcon', color: '#8b5cf6' },
              ].map(kpi => (
                <div key={kpi.label} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}20` }}>
                      <Icon name={kpi.icon as any} size={18} style={{ color: kpi.color }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.sub}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Rapport mensuel activité', desc: 'Bilans, plans, séances éducatives — août 2025', icon: 'DocumentChartBarIcon' },
                { title: 'Rapport observance patients', desc: 'Taux d\'adhérence par pathologie et plan', icon: 'ChartBarIcon' },
                { title: 'Statistiques anthropométriques', desc: 'IMC, composition corporelle — évolution', icon: 'UserGroupIcon' },
                { title: 'Rapport éducation thérapeutique', desc: 'Participation, évaluation des sessions', icon: 'AcademicCapIcon' },
              ].map(r => (
                <div key={r.title} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                      <Icon name={r.icon as any} size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.title}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                    <Icon name="ArrowDownTrayIcon" size={14} />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
