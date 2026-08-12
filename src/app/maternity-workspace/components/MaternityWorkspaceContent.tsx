'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'pregnancies' | 'prenatal' | 'delivery' | 'postpartum' | 'newborns';

interface Pregnancy { id: string; patient: string; age: number; sa: number; term: string; gravida: number; para: number; doctor: string; risk: 'bas' | 'modéré' | 'élevé'; status: 'suivi' | 'hospitalisée' | 'accouchée'; nextVisit: string; }
interface PrenatalVisit { id: string; patient: string; sa: number; date: string; weight: number; bp: string; fhr: number; uterus: number; notes: string; nextSa: number; }
interface Delivery { id: string; patient: string; sa: number; startTime: string; dilation: number; presentation: string; fhr: number; contractions: string; status: 'travail' | 'expulsion' | 'délivrance' | 'terminé'; mode?: string; }
interface Newborn { id: string; mother: string; birthDate: string; birthTime: string; sex: 'M' | 'F'; weight: number; apgar1: number; apgar5: number; status: 'normal' | 'surveillance' | 'soins intensifs'; }

const pregnancies: Pregnancy[] = [
  { id: 'MAT-001', patient: 'Mariama Koné', age: 26, sa: 28, term: '15/11/2026', gravida: 2, para: 1, doctor: 'Dr. Faye', risk: 'bas', status: 'suivi', nextVisit: '24/08/2026' },
  { id: 'MAT-002', patient: 'Aïssatou Diop', age: 32, sa: 36, term: '01/09/2026', gravida: 3, para: 2, doctor: 'Dr. Faye', risk: 'modéré', status: 'hospitalisée', nextVisit: 'Hospitalisée' },
  { id: 'MAT-003', patient: 'Rokhaya Sarr', age: 19, sa: 12, term: '12/02/2027', gravida: 1, para: 0, doctor: 'Dr. Ndiaye', risk: 'bas', status: 'suivi', nextVisit: '07/09/2026' },
  { id: 'MAT-004', patient: 'Fatou Mbaye', age: 38, sa: 32, term: '10/10/2026', gravida: 4, para: 3, doctor: 'Dr. Faye', risk: 'élevé', status: 'suivi', nextVisit: '17/08/2026' },
  { id: 'MAT-005', patient: 'Aminata Sow', age: 28, sa: 40, term: '12/08/2026', gravida: 2, para: 1, doctor: 'Dr. Ndiaye', risk: 'bas', status: 'hospitalisée', nextVisit: 'En travail' },
];

const prenatalVisits: PrenatalVisit[] = [
  { id: 'PV-01', patient: 'Mariama Koné', sa: 28, date: '10/08/2026', weight: 68.5, bp: '118/74', fhr: 148, uterus: 28, notes: 'Évolution normale. Mouvements actifs. Écho T3 programmée.', nextSa: 32 },
  { id: 'PV-02', patient: 'Fatou Mbaye', sa: 32, date: '10/08/2026', weight: 82.0, bp: '138/88', fhr: 142, uterus: 31, notes: 'TA légèrement élevée. Surveillance renforcée. Bilan prééclampsie.', nextSa: 34 },
  { id: 'PV-03', patient: 'Rokhaya Sarr', sa: 12, date: '05/08/2026', weight: 58.2, bp: '110/70', fhr: 162, uterus: 12, notes: 'Première consultation. Écho T1 normale. Supplémentation prescrite.', nextSa: 16 },
];

const deliveries: Delivery[] = [
  { id: 'DEL-01', patient: 'Aminata Sow', sa: 40, startTime: '08:30', dilation: 8, presentation: 'Céphalique', fhr: 138, contractions: '3/10 min · 45 sec', status: 'travail' },
  { id: 'DEL-02', patient: 'Aïssatou Diop', sa: 36, startTime: '06:15', dilation: 10, presentation: 'Céphalique', fhr: 144, contractions: 'Expulsives', status: 'expulsion' },
];

const newborns: Newborn[] = [
  { id: 'NB-001', mother: 'Kadiatou Ba', birthDate: '10/08/2026', birthTime: '07:42', sex: 'F', weight: 3250, apgar1: 9, apgar5: 10, status: 'normal' },
  { id: 'NB-002', mother: 'Aïssatou Diop', birthDate: '10/08/2026', birthTime: '10:58', sex: 'M', weight: 2780, apgar1: 7, apgar5: 9, status: 'surveillance' },
  { id: 'NB-003', mother: 'Marème Fall', birthDate: '09/08/2026', birthTime: '22:15', sex: 'M', weight: 3480, apgar1: 9, apgar5: 10, status: 'normal' },
];

const riskConfig = {
  bas: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Risque bas' },
  modéré: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Risque modéré' },
  élevé: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Risque élevé' },
};

const statusMatConfig: Record<string, { bg: string; color: string }> = {
  suivi: { bg: 'rgba(0,102,255,0.10)', color: 'var(--shifa-blue)' },
  hospitalisée: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  accouchée: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
};

const deliveryStatusConfig: Record<string, { bg: string; color: string; label: string }> = {
  travail: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'En travail' },
  expulsion: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Expulsion' },
  délivrance: { bg: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)', label: 'Délivrance' },
  terminé: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Terminé' },
};

const nbStatusConfig = {
  normal: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)', label: 'Normal' },
  surveillance: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)', label: 'Surveillance' },
  'soins intensifs': { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)', label: 'Soins intensifs' },
};

const kpis = [
  { label: 'Grossesses suivies', value: '47', icon: 'HeartIcon', color: 'var(--shifa-pink, var(--shifa-purple))' },
  { label: 'Hospitalisées', value: '3', icon: 'BuildingOffice2Icon', color: 'var(--shifa-amber)' },
  { label: 'En travail', value: '2', icon: 'BoltIcon', color: 'var(--shifa-red)' },
  { label: 'Accouchements ce mois', value: '18', icon: 'StarIcon', color: 'var(--shifa-green)' },
  { label: 'Nouveau-nés en suivi', value: '5', icon: 'UsersIcon', color: 'var(--shifa-cyan)' },
  { label: 'Grossesses à risque', value: '8', icon: 'ExclamationTriangleIcon', color: 'var(--shifa-amber)' },
];

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'pregnancies', label: 'Grossesses', icon: 'HeartIcon' },
  { key: 'prenatal', label: 'Soins prénataux', icon: 'ClipboardDocumentListIcon' },
  { key: 'delivery', label: 'Salle d\'accouchement', icon: 'BoltIcon' },
  { key: 'postpartum', label: 'Post-partum', icon: 'UserGroupIcon' },
  { key: 'newborns', label: 'Nouveau-nés', icon: 'StarIcon' },
];

export default function MaternityWorkspaceContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('pregnancies');

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-cyan))' }}>
              <Icon name="HeartIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Espace Maternité</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Suivi grossesse · Accouchement · Post-partum · Nouveau-nés</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="ArrowDownTrayIcon" size={14} /> Export</button>
            <button className="btn-primary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={14} /> Nouvelle grossesse</button>
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
      <div className="px-6 border-b flex gap-1" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-[var(--shifa-purple)] text-[var(--shifa-purple)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* PREGNANCIES */}
        {activeTab === 'pregnancies' && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Dossiers grossesses actifs</h3>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pregnancies.length} grossesses</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patiente', 'SA', 'Terme prévu', 'G/P', 'Médecin', 'Risque', 'Statut', 'Prochain RDV'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pregnancies.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < pregnancies.length - 1 ? '1px solid var(--border)' : 'none' }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{p.id}</td>
                    <td className="px-4 py-3"><p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.patient}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans</p></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-cyan))' }}>{p.sa}</div>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>SA</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{p.term}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--foreground)' }}>G{p.gravida}P{p.para}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.doctor}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: riskConfig[p.risk].bg, color: riskConfig[p.risk].color }}>{riskConfig[p.risk].label}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusMatConfig[p.status].bg, color: statusMatConfig[p.status].color }}>{p.status}</span></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{p.nextVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRENATAL */}
        {activeTab === 'prenatal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {prenatalVisits.map(v => (
              <div key={v.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{v.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{v.sa} SA · {v.date}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' }}>CPN {v.sa} SA</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Poids', value: `${v.weight} kg`, alert: false },
                    { label: 'TA', value: v.bp, alert: parseInt(v.bp.split('/')[0]) > 130 },
                    { label: 'BCF', value: `${v.fhr} bpm`, alert: v.fhr < 120 || v.fhr > 160 },
                    { label: 'HU', value: `${v.uterus} cm`, alert: false },
                  ].map(m => (
                    <div key={m.label} className="p-2 rounded-xl text-center" style={{ backgroundColor: m.alert ? 'rgba(239,68,68,0.08)' : 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{m.label}</p>
                      <p className="font-bold text-sm" style={{ color: m.alert ? 'var(--shifa-red)' : 'var(--foreground)' }}>{m.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>NOTES</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{v.notes}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Prochain RDV : <strong style={{ color: 'var(--shifa-purple)' }}>{v.nextSa} SA</strong></p>
                  <button className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: 'rgba(123,94,167,0.1)', color: 'var(--shifa-purple)' }}>Voir dossier complet</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELIVERY */}
        {activeTab === 'delivery' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {deliveries.map(d => (
              <div key={d.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{d.patient}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.sa} SA · Début travail : {d.startTime}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: deliveryStatusConfig[d.status].bg, color: deliveryStatusConfig[d.status].color }}>{deliveryStatusConfig[d.status].label}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dilatation</p>
                    <div className="flex items-end gap-1 mt-1">
                      <span className="text-2xl font-bold" style={{ color: d.dilation >= 10 ? 'var(--shifa-green)' : 'var(--shifa-amber)', fontFamily: 'var(--font-display)' }}>{d.dilation}</span>
                      <span className="text-sm mb-0.5" style={{ color: 'var(--muted-foreground)' }}>cm / 10</span>
                    </div>
                    <div className="h-2 rounded-full bg-border mt-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.dilation * 10}%`, backgroundColor: d.dilation >= 10 ? 'var(--shifa-green)' : 'var(--shifa-amber)' }} />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>BCF</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: d.fhr < 120 || d.fhr > 160 ? 'var(--shifa-red)' : 'var(--shifa-green)', fontFamily: 'var(--font-display)' }}>{d.fhr}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>bpm</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Présentation</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{d.presentation}</p>
                  </div>
                  <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Contractions</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{d.contractions}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>Partogramme</button>
                  <button className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: 'var(--shifa-purple)' }}>Mettre à jour</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POSTPARTUM */}
        {activeTab === 'postpartum' && (
          <div className="card p-6 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
            <Icon name="UserGroupIcon" size={40} style={{ color: 'var(--muted-foreground)' }} />
            <p className="mt-3 font-semibold" style={{ color: 'var(--foreground)' }}>Suivi post-partum</p>
            <p className="text-sm mt-1 text-center max-w-sm" style={{ color: 'var(--muted-foreground)' }}>Surveillance des patientes après accouchement : involution utérine, lochies, allaitement, état psychologique</p>
            <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-lg">
              {[{ name: 'Kadiatou Ba', days: 'J1', status: 'Normal' }, { name: 'Marème Fall', days: 'J2', status: 'Surveillance' }, { name: 'Ndeye Diop', days: 'J3', status: 'Normal' }].map(p => (
                <div key={p.name} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Post-partum {p.days}</p>
                  <span className="mt-1 inline-block text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: p.status === 'Normal' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: p.status === 'Normal' ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWBORNS */}
        {activeTab === 'newborns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {newborns.map(nb => (
              <div key={nb.id} className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: nb.sex === 'F' ? 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-cyan))' : 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                    {nb.sex}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{nb.id}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Mère : {nb.mother}</p>
                  </div>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: nbStatusConfig[nb.status].bg, color: nbStatusConfig[nb.status].color }}>{nbStatusConfig[nb.status].label}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Poids naissance</p>
                    <p className="font-bold text-sm" style={{ color: nb.weight < 2500 ? 'var(--shifa-amber)' : 'var(--shifa-green)' }}>{nb.weight} g</p>
                  </div>
                  <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Naissance</p>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{nb.birthTime}</p>
                  </div>
                  <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Apgar 1 min</p>
                    <p className="font-bold text-sm" style={{ color: nb.apgar1 >= 7 ? 'var(--shifa-green)' : nb.apgar1 >= 4 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>{nb.apgar1}/10</p>
                  </div>
                  <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Apgar 5 min</p>
                    <p className="font-bold text-sm" style={{ color: nb.apgar5 >= 7 ? 'var(--shifa-green)' : nb.apgar5 >= 4 ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>{nb.apgar5}/10</p>
                  </div>
                </div>
                <button className="w-full py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: 'rgba(123,94,167,0.1)', color: 'var(--shifa-purple)' }}>Voir dossier nouveau-né</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
