'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const tabs = [
  { key: 'tab-overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'tab-diseases', label: 'Suivi des maladies', icon: 'EyeIcon' },
  { key: 'tab-vaccination', label: 'Vaccination', icon: 'ShieldCheckIcon' },
  { key: 'tab-campaigns', label: 'Campagnes santé', icon: 'MegaphoneIcon' },
  { key: 'tab-geo', label: 'Carte géographique', icon: 'MapPinIcon' },
];

const kpis = [
  { label: 'Maladies sous surveillance', value: '58', sub: '12 au-dessus du seuil', icon: 'EyeIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Incidence hebdomadaire', value: '4 820', sub: '+6.3% vs S31', icon: 'ArrowTrendingUpIcon', color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Couverture vaccinale', value: '82.4%', sub: 'Objectif OMS: 95%', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Campagnes actives', value: '7', sub: '3 nationales, 4 régionales', icon: 'MegaphoneIcon', color: 'var(--shifa-purple)', bg: 'rgba(123,94,167,0.08)' },
  { label: 'Indicateurs pop. santé', value: '94', sub: '18 hors cible', icon: 'ChartBarIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { label: 'Districts sous alerte', value: '5', sub: '2 critiques, 3 modérés', icon: 'MapPinIcon', color: '#EF4444', bg: 'rgba(239,68,68,0.06)' },
];

const incidenceWeekly = [
  { semaine: 'S26', paludisme: 1180, diarrhee: 760, ira: 590, dengue: 42 },
  { semaine: 'S27', paludisme: 1240, diarrhee: 820, ira: 640, dengue: 58 },
  { semaine: 'S28', paludisme: 1380, diarrhee: 790, ira: 680, dengue: 71 },
  { semaine: 'S29', paludisme: 1520, diarrhee: 850, ira: 720, dengue: 89 },
  { semaine: 'S30', paludisme: 1460, diarrhee: 810, ira: 700, dengue: 95 },
  { semaine: 'S31', paludisme: 1380, diarrhee: 780, ira: 660, dengue: 82 },
  { semaine: 'S32', paludisme: 1490, diarrhee: 830, ira: 710, dengue: 104 },
];

const diseases = [
  { id: 'd-001', nom: 'Paludisme', cas_semaine: 1490, seuil: 1500, tendance: 'hausse', mortalite: '0.8%', regions: 8, alerte: false, categorie: 'vectorielle' },
  { id: 'd-002', nom: 'Dengue', cas_semaine: 104, seuil: 50, tendance: 'hausse', mortalite: '1.2%', regions: 4, alerte: true, categorie: 'vectorielle' },
  { id: 'd-003', nom: 'Diarrhée aiguë', cas_semaine: 830, seuil: 1000, tendance: 'stable', mortalite: '0.3%', regions: 8, alerte: false, categorie: 'hydrique' },
  { id: 'd-004', nom: 'IRA', cas_semaine: 710, seuil: 800, tendance: 'stable', mortalite: '0.5%', regions: 8, alerte: false, categorie: 'respiratoire' },
  { id: 'd-005', nom: 'Méningite bactérienne', cas_semaine: 29, seuil: 20, tendance: 'baisse', mortalite: '6.4%', regions: 3, alerte: true, categorie: 'neurologique' },
  { id: 'd-006', nom: 'Choléra', cas_semaine: 12, seuil: 5, tendance: 'hausse', mortalite: '2.1%', regions: 2, alerte: true, categorie: 'hydrique' },
  { id: 'd-007', nom: 'Rougeole', cas_semaine: 28, seuil: 10, tendance: 'hausse', mortalite: '0.9%', regions: 3, alerte: true, categorie: 'vaccine-preventable' },
  { id: 'd-008', nom: 'Tuberculose', cas_semaine: 64, seuil: 80, tendance: 'baisse', mortalite: '4.2%', regions: 8, alerte: false, categorie: 'respiratoire' },
];

const vaccinePrograms = [
  { id: 'vac-001', vaccin: 'BCG (Tuberculose)', cible: 'Nouveau-nés', couverture: 94.2, objectif: 95, doses_admin: 48200, doses_stock: 12400, statut: 'on_track' },
  { id: 'vac-002', vaccin: 'Pentavalent (DTP-HepB-Hib)', cible: 'Nourrissons 6 sem.', couverture: 88.7, objectif: 95, doses_admin: 142800, doses_stock: 28600, statut: 'at_risk' },
  { id: 'vac-003', vaccin: 'Vaccin antipaludique (RTS,S)', cible: 'Enfants 5-17 mois', couverture: 71.3, objectif: 80, doses_admin: 89400, doses_stock: 18200, statut: 'at_risk' },
  { id: 'vac-004', vaccin: 'Vaccin anti-méningococcique', cible: 'Enfants 1-29 ans', couverture: 62.8, objectif: 90, doses_admin: 320000, doses_stock: 45000, statut: 'critical' },
  { id: 'vac-005', vaccin: 'Vaccin contre la rougeole (RR)', cible: 'Enfants 9-15 mois', couverture: 79.4, objectif: 95, doses_admin: 96200, doses_stock: 22800, statut: 'at_risk' },
  { id: 'vac-006', vaccin: 'Vaccin anti-cholérique oral', cible: 'Zones endémiques', couverture: 58.1, objectif: 80, doses_admin: 28400, doses_stock: 8600, statut: 'critical' },
];

const campaigns = [
  { id: 'camp-001', titre: 'Campagne nationale de vaccination anti-méningococcique', type: 'Vaccination', portee: 'Nationale', cible: '4.2M personnes', debut: '01 août 2026', fin: '31 août 2026', avancement: 68, statut: 'actif', budget: '820M FCFA' },
  { id: 'camp-002', titre: 'Journée mondiale contre le paludisme — Sensibilisation', type: 'Sensibilisation', portee: 'Nationale', cible: '8M personnes', debut: '25 avr. 2026', fin: '25 oct. 2026', avancement: 82, statut: 'actif', budget: '240M FCFA' },
  { id: 'camp-003', titre: 'Distribution moustiquaires imprégnées — Saison des pluies', type: 'Prévention', portee: 'Régionale', cible: '1.8M ménages', debut: '15 juil. 2026', fin: '30 sept. 2026', avancement: 54, statut: 'actif', budget: '1.4Mds FCFA' },
  { id: 'camp-004', titre: 'Campagne de dépistage VIH/SIDA', type: 'Dépistage', portee: 'Nationale', cible: '2.5M adultes', debut: '01 sept. 2026', fin: '30 nov. 2026', avancement: 0, statut: 'planifié', budget: '380M FCFA' },
  { id: 'camp-005', titre: 'Vaccination anti-cholérique — Zone côtière', type: 'Vaccination', portee: 'Régionale', cible: '480K personnes', debut: '10 août 2026', fin: '10 sept. 2026', avancement: 31, statut: 'actif', budget: '95M FCFA' },
  { id: 'camp-006', titre: 'Promotion hygiène et assainissement', type: 'Sensibilisation', portee: 'Régionale', cible: '600K ménages', debut: '01 juin 2026', fin: '31 déc. 2026', avancement: 45, statut: 'actif', budget: '120M FCFA' },
];

const healthIndicators = [
  { indicateur: 'Mortalité infantile (‰)', valeur: '38.2', cible: '25', tendance: 'baisse', statut: 'at_risk' },
  { indicateur: 'Mortalité maternelle (/ 100K NV)', valeur: '236', cible: '70', tendance: 'baisse', statut: 'critical' },
  { indicateur: 'Espérance de vie (ans)', valeur: '68.4', cible: '72', tendance: 'hausse', statut: 'at_risk' },
  { indicateur: 'Prévalence malnutrition aiguë (%)', valeur: '8.7', cible: '5', tendance: 'stable', statut: 'at_risk' },
  { indicateur: 'Taux de fécondité', valeur: '4.6', cible: '3.5', tendance: 'baisse', statut: 'at_risk' },
  { indicateur: 'Accès eau potable (%)', valeur: '74.3', cible: '90', tendance: 'hausse', statut: 'at_risk' },
  { indicateur: 'Couverture soins prénataux (%)', valeur: '88.1', cible: '95', tendance: 'hausse', statut: 'on_track' },
  { indicateur: 'Accouchements assistés (%)', valeur: '79.4', cible: '90', tendance: 'hausse', statut: 'at_risk' },
];

const geoRegions = [
  { region: 'Dakar', population: '3.8M', incidence: 142, alertes: 1, couverture_vac: 91, statut: 'modéré' },
  { region: 'Thiès', population: '1.9M', incidence: 198, alertes: 2, couverture_vac: 84, statut: 'élevé' },
  { region: 'Diourbel', population: '1.6M', incidence: 87, alertes: 0, couverture_vac: 78, statut: 'normal' },
  { region: 'Saint-Louis', population: '1.1M', incidence: 312, alertes: 3, couverture_vac: 72, statut: 'critique' },
  { region: 'Tambacounda', population: '0.8M', incidence: 264, alertes: 2, couverture_vac: 68, statut: 'élevé' },
  { region: 'Kaolack', population: '1.2M', incidence: 176, alertes: 1, couverture_vac: 81, statut: 'modéré' },
  { region: 'Ziguinchor', population: '0.6M', incidence: 94, alertes: 0, couverture_vac: 86, statut: 'normal' },
  { region: 'Fatick', population: '0.7M', incidence: 118, alertes: 1, couverture_vac: 79, statut: 'modéré' },
];

const vacCoverageData = vaccinePrograms.map(v => ({ name: v.vaccin.split(' ')[0], couverture: v.couverture, objectif: v.objectif }));

export default function EpidemioSurveillanceContent() {
  const [activeTab, setActiveTab] = useState('tab-overview');
  const [diseaseFilter, setDiseaseFilter] = useState('tous');

  const filteredDiseases = diseaseFilter === 'alerte' ? diseases.filter(d => d.alerte) : diseases;

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #EF4444, #7B5EA7)' }}>
            <Icon name="EyeIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Surveillance Épidémiologique</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Suivi des maladies, vaccination, campagnes et indicateurs de santé publique</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm"><Icon name="ArrowDownTrayIcon" size={15} />Exporter</button>
          <button className="btn-primary flex items-center gap-2 text-sm" style={{ backgroundColor: 'var(--shifa-red)', borderColor: 'var(--shifa-red)' }}>
            <Icon name="ExclamationCircleIcon" size={15} />Déclarer alerte
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin mb-6 pb-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${activeTab === tab.key ? 'shadow-shifa' : ''}`}
            style={{ backgroundColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--card)', color: activeTab === tab.key ? 'white' : 'var(--muted-foreground)', borderColor: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--border)' }}>
            <Icon name={tab.icon as any} size={15} />{tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'tab-overview' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card-base flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.bg }}>
                  <Icon name={kpi.icon as any} size={20} style={{ color: kpi.color } as any} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</p>
                  <p className="text-xs" style={{ color: kpi.color }}>{kpi.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Incidence hebdomadaire — Maladies prioritaires (cas notifiés)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={incidenceWeekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="semaine" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="paludisme" stroke="var(--shifa-blue)" strokeWidth={2} dot={false} name="Paludisme" />
                    <Line type="monotone" dataKey="diarrhee" stroke="var(--shifa-amber)" strokeWidth={2} dot={false} name="Diarrhée" />
                    <Line type="monotone" dataKey="ira" stroke="var(--shifa-green)" strokeWidth={2} dot={false} name="IRA" />
                    <Line type="monotone" dataKey="dengue" stroke="var(--shifa-red)" strokeWidth={2.5} dot={false} name="Dengue" />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Alertes actives par région</h3>
              <div className="flex flex-col gap-2">
                {geoRegions.filter(r => r.alertes > 0).map((r) => (
                  <div key={r.region} className="flex items-center justify-between p-2.5 rounded-xl border" style={{
                    borderColor: r.statut === 'critique' ? 'rgba(239,68,68,0.3)' : r.statut === 'élevé' ? 'rgba(245,158,11,0.3)' : 'var(--border)',
                    backgroundColor: r.statut === 'critique' ? 'rgba(239,68,68,0.04)' : r.statut === 'élevé' ? 'rgba(245,158,11,0.04)' : 'transparent',
                  }}>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPinIcon" size={14} style={{ color: r.statut === 'critique' ? 'var(--shifa-red)' : 'var(--shifa-amber)' } as any} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Inc. {r.incidence}/100K</span>
                      <span className={`badge-base ${r.statut === 'critique' ? 'status-critical' : 'status-pending'}`}>{r.alertes} alerte{r.alertes > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Population health indicators summary */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Indicateurs de santé de la population — Statut ODD</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {healthIndicators.slice(0, 4).map((ind) => (
                <div key={ind.indicateur} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--muted-foreground)' }}>{ind.indicateur}</p>
                  <p className="text-lg font-bold mb-0.5" style={{ color: ind.statut === 'critical' ? 'var(--shifa-red)' : ind.statut === 'at_risk' ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{ind.valeur}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cible: {ind.cible}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Icon name={ind.tendance === 'hausse' ? 'ArrowTrendingUpIcon' : ind.tendance === 'baisse' ? 'ArrowTrendingDownIcon' : 'MinusIcon'} size={12}
                      style={{ color: ind.tendance === 'hausse' ? 'var(--shifa-green)' : ind.tendance === 'baisse' ? 'var(--shifa-red)' : 'var(--muted-foreground)' } as any} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{ind.tendance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISEASE TRACKING */}
      {activeTab === 'tab-diseases' && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {['tous', 'alerte'].map((f) => (
                <button key={f} onClick={() => setDiseaseFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                  style={{ backgroundColor: diseaseFilter === f ? 'var(--shifa-blue)' : 'var(--card)', color: diseaseFilter === f ? 'white' : 'var(--muted-foreground)', borderColor: diseaseFilter === f ? 'var(--shifa-blue)' : 'var(--border)' }}>
                  {f === 'tous' ? 'Toutes les maladies' : '⚠ En alerte uniquement'}
                </button>
              ))}
            </div>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Ajouter maladie</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDiseases.map((d) => (
              <div key={d.id} className="card-base hover:shadow-shifa transition-all duration-150" style={d.alerte ? { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.02)' } : {}}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{d.nom}</p>
                      {d.alerte && <span className="badge-base status-critical">Alerte</span>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{d.categorie}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name={d.tendance === 'hausse' ? 'ArrowTrendingUpIcon' : d.tendance === 'baisse' ? 'ArrowTrendingDownIcon' : 'MinusIcon'} size={16}
                      style={{ color: d.tendance === 'hausse' ? 'var(--shifa-red)' : d.tendance === 'baisse' ? 'var(--shifa-green)' : 'var(--muted-foreground)' } as any} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Cas cette semaine</p>
                    <p className="text-xl font-bold" style={{ color: d.alerte ? 'var(--shifa-red)' : 'var(--shifa-dark)' }}>{d.cas_semaine.toLocaleString()}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Seuil: {d.seuil}</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Létalité</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{d.mortalite}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.regions} régions</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min((d.cas_semaine / d.seuil) * 100, 100)}%`, backgroundColor: d.alerte ? 'var(--shifa-red)' : 'var(--shifa-blue)' }} />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{Math.round((d.cas_semaine / d.seuil) * 100)}% du seuil d'alerte</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VACCINATION */}
      {activeTab === 'tab-vaccination' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Couverture vaccinale vs Objectif OMS (%)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vacCoverageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} width={60} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="couverture" fill="var(--shifa-blue)" radius={[0, 4, 4, 0]} name="Couverture %" />
                    <Bar dataKey="objectif" fill="rgba(0,102,255,0.15)" radius={[0, 4, 4, 0]} name="Objectif %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-base">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Statut des programmes de vaccination</h3>
              <div className="flex flex-col gap-2">
                {vaccinePrograms.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2.5 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{v.vaccin}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.cible}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: v.statut === 'critical' ? 'var(--shifa-red)' : v.statut === 'at_risk' ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{v.couverture}%</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>/ {v.objectif}%</p>
                      </div>
                      <span className={`badge-base ${v.statut === 'critical' ? 'status-critical' : v.statut === 'at_risk' ? 'status-pending' : 'status-active'}`}>
                        {v.statut === 'critical' ? 'Critique' : v.statut === 'at_risk' ? 'À risque' : 'OK'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card-base overflow-hidden p-0">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Détail des stocks et doses administrées</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Vaccin', 'Population cible', 'Doses administrées', 'Stock disponible', 'Couverture', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vaccinePrograms.map((v, i) => (
                  <tr key={v.id} className="hover:bg-muted/50 transition-colors" style={{ borderBottom: i < vaccinePrograms.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{v.vaccin}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.cible}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--shifa-blue)' }}>{v.doses_admin.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: v.doses_stock < 10000 ? 'var(--shifa-red)' : 'var(--foreground)' }}>{v.doses_stock.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${v.couverture}%`, backgroundColor: v.statut === 'critical' ? 'var(--shifa-red)' : v.statut === 'at_risk' ? 'var(--shifa-amber)' : 'var(--shifa-green)' }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{v.couverture}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-base ${v.statut === 'critical' ? 'status-critical' : v.statut === 'at_risk' ? 'status-pending' : 'status-active'}`}>
                        {v.statut === 'critical' ? 'Critique' : v.statut === 'at_risk' ? 'À risque' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CAMPAIGNS */}
      {activeTab === 'tab-campaigns' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{campaigns.filter(c => c.statut === 'actif').length} campagnes actives · {campaigns.filter(c => c.statut === 'planifié').length} planifiées</p>
            <button className="btn-primary flex items-center gap-2 text-sm"><Icon name="PlusIcon" size={15} />Nouvelle campagne</button>
          </div>
          {campaigns.map((c) => (
            <div key={c.id} className="card-base hover:shadow-shifa transition-all duration-150">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(123,94,167,0.1)' }}>
                    <Icon name="MegaphoneIcon" size={18} style={{ color: 'var(--shifa-purple)' } as any} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{c.titre}</p>
                      <span className={`badge-base ${c.statut === 'actif' ? 'status-active' : 'status-pending'}`}>{c.statut}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{c.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Portée: <strong style={{ color: 'var(--foreground)' }}>{c.portee}</strong></span>
                      <span>Cible: <strong style={{ color: 'var(--shifa-blue)' }}>{c.cible}</strong></span>
                      <span>Budget: <strong style={{ color: 'var(--shifa-green)' }}>{c.budget}</strong></span>
                      <span>{c.debut} → {c.fin}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="PencilSquareIcon" size={14} className="text-muted-foreground" /></button>
                  <button className="p-2 rounded-xl border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}><Icon name="ChartBarIcon" size={14} className="text-muted-foreground" /></button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${c.avancement}%`, backgroundColor: c.avancement >= 75 ? 'var(--shifa-green)' : c.avancement >= 40 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: 'var(--foreground)' }}>{c.avancement}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GEO */}
      {activeTab === 'tab-geo' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: 'Régions normales', count: geoRegions.filter(r => r.statut === 'normal').length, color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
              { label: 'Régions modérées', count: geoRegions.filter(r => r.statut === 'modéré').length, color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
              { label: 'Régions à risque élevé', count: geoRegions.filter(r => r.statut === 'élevé').length, color: 'var(--shifa-red)', bg: 'rgba(239,68,68,0.08)' },
              { label: 'Régions critiques', count: geoRegions.filter(r => r.statut === 'critique').length, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
            ].map((s) => (
              <div key={s.label} className="card-base flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                  <Icon name="MapPinIcon" size={18} style={{ color: s.color } as any} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated geographic grid */}
          <div className="card-base">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--shifa-dark)' }}>Carte de chaleur épidémiologique — Incidence pour 100 000 habitants</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {geoRegions.map((r) => {
                const intensity = r.incidence / 350;
                const bg = r.statut === 'critique' ? 'rgba(220,38,38,0.15)' : r.statut === 'élevé' ? 'rgba(245,158,11,0.12)' : r.statut === 'modéré' ? 'rgba(0,102,255,0.08)' : 'rgba(16,185,129,0.08)';
                const border = r.statut === 'critique' ? 'rgba(220,38,38,0.4)' : r.statut === 'élevé' ? 'rgba(245,158,11,0.4)' : r.statut === 'modéré' ? 'rgba(0,102,255,0.2)' : 'rgba(16,185,129,0.2)';
                const textColor = r.statut === 'critique' ? '#DC2626' : r.statut === 'élevé' ? 'var(--shifa-amber)' : r.statut === 'modéré' ? 'var(--shifa-blue)' : 'var(--shifa-green)';
                return (
                  <div key={r.region} className="p-4 rounded-2xl border cursor-pointer hover:shadow-shifa transition-all" style={{ backgroundColor: bg, borderColor: border }}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{r.region}</p>
                      {r.alertes > 0 && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: r.statut === 'critique' ? '#DC2626' : 'var(--shifa-amber)' }}>{r.alertes}</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-1" style={{ color: textColor }}>{r.incidence}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>/ 100K hab. · Pop. {r.population}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--muted-foreground)' }}>Vac. {r.couverture_vac}%</span>
                      <span className={`badge-base ${r.statut === 'critique' ? 'status-critical' : r.statut === 'élevé' ? 'status-pending' : r.statut === 'modéré' ? 'status-active' : 'status-completed'}`}>{r.statut}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(16,185,129,0.3)' }} />Normal (&lt;100)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(0,102,255,0.3)' }} />Modéré (100–199)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(245,158,11,0.3)' }} />Élevé (200–299)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(220,38,38,0.3)' }} />Critique (≥300)</span>
            </div>
          </div>

          <div className="card-base overflow-hidden p-0">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-bold" style={{ color: 'var(--shifa-dark)' }}>Tableau de bord régional détaillé</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Région', 'Population', 'Incidence /100K', 'Alertes actives', 'Couverture vac.', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-xs font-bold px-4 py-3" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geoRegions.map((r, i) => (
                  <tr key={r.region} className="hover:bg-muted/50 transition-colors cursor-pointer" style={{ borderBottom: i < geoRegions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.region}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.population}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: r.statut === 'critique' ? '#DC2626' : r.statut === 'élevé' ? 'var(--shifa-amber)' : 'var(--foreground)' }}>{r.incidence}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: r.alertes > 0 ? 'var(--shifa-red)' : 'var(--shifa-green)' }}>{r.alertes > 0 ? `${r.alertes} alerte${r.alertes > 1 ? 's' : ''}` : 'Aucune'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ width: `${r.couverture_vac}%`, backgroundColor: r.couverture_vac >= 90 ? 'var(--shifa-green)' : r.couverture_vac >= 75 ? 'var(--shifa-blue)' : 'var(--shifa-amber)' }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{r.couverture_vac}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-base ${r.statut === 'critique' ? 'status-critical' : r.statut === 'élevé' ? 'status-pending' : r.statut === 'modéré' ? 'status-active' : 'status-completed'}`}>{r.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
