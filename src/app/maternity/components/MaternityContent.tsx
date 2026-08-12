'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type TabKey = 'pregnancies' | 'prenatal' | 'risks' | 'delivery' | 'newborns' | 'postpartum' | 'documents';

interface Pregnancy { id: string; patient: string; age: number; sa: number; term: string; gravida: number; para: number; doctor: string; risk: 'bas' | 'modéré' | 'élevé'; status: 'suivi' | 'hospitalisée' | 'accouchée'; nextVisit: string; bloodType: string; }
interface PrenatalVisit { id: string; patient: string; sa: number; date: string; weight: number; bp: string; fhr: number; uterus: number; notes: string; nextSa: number; }
interface RiskIndicator { id: string; patient: string; category: string; indicator: string; severity: 'faible' | 'modéré' | 'élevé'; detected: string; action: string; }
interface Delivery { id: string; patient: string; sa: number; startTime: string; dilation: number; presentation: string; fhr: number; contractions: string; status: 'travail' | 'expulsion' | 'délivrance' | 'terminé'; mode?: string; }
interface Newborn { id: string; mother: string; birthDate: string; birthTime: string; sex: 'M' | 'F'; weight: number; apgar1: number; apgar5: number; status: 'normal' | 'surveillance' | 'soins intensifs'; length: number; hc: number; }
interface PostpartumRecord { id: string; patient: string; deliveryDate: string; visitDate: string; bp: string; bleeding: string; breastfeeding: boolean; episiotomy?: string; mood: 'bon' | 'modéré' | 'dépression suspectée'; notes: string; }
interface MaternityDoc { id: string; patient: string; type: string; date: string; author: string; status: 'validé' | 'brouillon'; }

const pregnancies: Pregnancy[] = [
  { id: 'MAT-001', patient: 'Mariama Koné', age: 26, sa: 28, term: '15/11/2026', gravida: 2, para: 1, doctor: 'Dr. Faye', risk: 'bas', status: 'suivi', nextVisit: '24/08/2026', bloodType: 'A+' },
  { id: 'MAT-002', patient: 'Aïssatou Diop', age: 32, sa: 36, term: '01/09/2026', gravida: 3, para: 2, doctor: 'Dr. Faye', risk: 'modéré', status: 'hospitalisée', nextVisit: 'Hospitalisée', bloodType: 'O+' },
  { id: 'MAT-003', patient: 'Rokhaya Sarr', age: 19, sa: 12, term: '12/02/2027', gravida: 1, para: 0, doctor: 'Dr. Ndiaye', risk: 'bas', status: 'suivi', nextVisit: '07/09/2026', bloodType: 'B+' },
  { id: 'MAT-004', patient: 'Fatou Mbaye', age: 38, sa: 32, term: '10/10/2026', gravida: 4, para: 3, doctor: 'Dr. Faye', risk: 'élevé', status: 'suivi', nextVisit: '17/08/2026', bloodType: 'AB-' },
  { id: 'MAT-005', patient: 'Aminata Sow', age: 28, sa: 40, term: '12/08/2026', gravida: 2, para: 1, doctor: 'Dr. Ndiaye', risk: 'bas', status: 'hospitalisée', nextVisit: 'En travail', bloodType: 'O-' },
];

const prenatalVisits: PrenatalVisit[] = [
  { id: 'PV-01', patient: 'Mariama Koné', sa: 28, date: '10/08/2026', weight: 68.5, bp: '118/74', fhr: 148, uterus: 28, notes: 'Évolution normale. Mouvements actifs. Écho T3 programmée.', nextSa: 32 },
  { id: 'PV-02', patient: 'Fatou Mbaye', sa: 32, date: '10/08/2026', weight: 82.0, bp: '138/88', fhr: 142, uterus: 31, notes: 'TA légèrement élevée. Surveillance renforcée. Bilan prééclampsie.', nextSa: 34 },
  { id: 'PV-03', patient: 'Rokhaya Sarr', sa: 12, date: '05/08/2026', weight: 58.2, bp: '110/70', fhr: 162, uterus: 12, notes: 'Première consultation. Écho T1 normale. Supplémentation prescrite.', nextSa: 16 },
  { id: 'PV-04', patient: 'Aïssatou Diop', sa: 34, date: '01/08/2026', weight: 74.0, bp: '125/80', fhr: 145, uterus: 33, notes: 'Légère protéinurie. Surveillance TA. Repos recommandé.', nextSa: 36 },
];

const riskIndicators: RiskIndicator[] = [
  { id: 'RI-01', patient: 'Fatou Mbaye', category: 'Cardiovasculaire', indicator: 'Hypertension artérielle gestationnelle', severity: 'élevé', detected: '10/08/2026', action: 'Surveillance TA quotidienne + bilan prééclampsie' },
  { id: 'RI-02', patient: 'Fatou Mbaye', category: 'Obstétrical', indicator: 'Grande multipare (G4P3)', severity: 'modéré', detected: '01/07/2026', action: 'Accouchement en milieu spécialisé obligatoire' },
  { id: 'RI-03', patient: 'Fatou Mbaye', category: 'Maternel', indicator: 'Âge maternel avancé (38 ans)', severity: 'modéré', detected: '01/07/2026', action: 'Amniocentèse proposée — refusée par patiente' },
  { id: 'RI-04', patient: 'Aïssatou Diop', category: 'Obstétrical', indicator: 'Protéinurie légère', severity: 'modéré', detected: '01/08/2026', action: 'Surveillance rapprochée — bilan rénal' },
  { id: 'RI-05', patient: 'Rokhaya Sarr', category: 'Social', indicator: 'Primipare adolescente (19 ans)', severity: 'faible', detected: '05/08/2026', action: 'Accompagnement psychosocial + éducation prénatale' },
];

const deliveries: Delivery[] = [
  { id: 'DEL-01', patient: 'Aminata Sow', sa: 40, startTime: '08:30', dilation: 8, presentation: 'Céphalique', fhr: 138, contractions: '3/10 min · 45 sec', status: 'travail' },
  { id: 'DEL-02', patient: 'Aïssatou Diop', sa: 36, startTime: '06:15', dilation: 10, presentation: 'Céphalique', fhr: 144, contractions: 'Expulsives', status: 'expulsion' },
];

const newborns: Newborn[] = [
  { id: 'NB-001', mother: 'Kadiatou Ba', birthDate: '10/08/2026', birthTime: '07:42', sex: 'F', weight: 3250, apgar1: 9, apgar5: 10, status: 'normal', length: 50, hc: 34 },
  { id: 'NB-002', mother: 'Aïssatou Diop', birthDate: '10/08/2026', birthTime: '10:58', sex: 'M', weight: 2780, apgar1: 7, apgar5: 9, status: 'surveillance', length: 47, hc: 33 },
  { id: 'NB-003', mother: 'Marème Fall', birthDate: '09/08/2026', birthTime: '22:15', sex: 'M', weight: 3480, apgar1: 9, apgar5: 10, status: 'normal', length: 51, hc: 35 },
];

const postpartumRecords: PostpartumRecord[] = [
  { id: 'PP-001', patient: 'Kadiatou Ba', deliveryDate: '10/08/2026', visitDate: '10/08/2026', bp: '118/74', bleeding: 'Normal', breastfeeding: true, episiotomy: 'Cicatrisation correcte', mood: 'bon', notes: 'Allaitement maternel exclusif. Bonne récupération.' },
  { id: 'PP-002', patient: 'Marème Fall', deliveryDate: '09/08/2026', visitDate: '10/08/2026', bp: '125/80', bleeding: 'Modéré', breastfeeding: false, mood: 'modéré', notes: 'Fatigue importante. Soutien psychologique proposé.' },
];

const maternityDocs: MaternityDoc[] = [
  { id: 'MD-001', patient: 'Kadiatou Ba', type: 'Compte rendu d\'accouchement', date: '10/08/2026', author: 'Dr. Faye', status: 'validé' },
  { id: 'MD-002', patient: 'Aïssatou Diop', type: 'Plan de naissance', date: '01/08/2026', author: 'Dr. Faye', status: 'validé' },
  { id: 'MD-003', patient: 'Fatou Mbaye', type: 'Fiche de surveillance prééclampsie', date: '10/08/2026', author: 'Dr. Faye', status: 'brouillon' },
  { id: 'MD-004', patient: 'Rokhaya Sarr', type: 'Carnet de suivi prénatal', date: '05/08/2026', author: 'Dr. Ndiaye', status: 'validé' },
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

const riskSeverityConfig = {
  faible: { bg: 'rgba(16,185,129,0.12)', color: 'var(--shifa-green)' },
  modéré: { bg: 'rgba(245,158,11,0.12)', color: 'var(--shifa-amber)' },
  élevé: { bg: 'rgba(239,68,68,0.12)', color: 'var(--shifa-red)' },
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'pregnancies', label: 'Grossesses', icon: 'HeartIcon' },
  { key: 'prenatal', label: 'Visites prénatales', icon: 'ClipboardDocumentListIcon' },
  { key: 'risks', label: 'Indicateurs de risque', icon: 'ExclamationTriangleIcon' },
  { key: 'delivery', label: 'Salle d\'accouchement', icon: 'BoltIcon' },
  { key: 'newborns', label: 'Nouveau-nés', icon: 'StarIcon' },
  { key: 'postpartum', label: 'Post-partum', icon: 'UserGroupIcon' },
  { key: 'documents', label: 'Documentation', icon: 'DocumentTextIcon' },
];

const kpis = [
  { label: 'Grossesses suivies', value: String(pregnancies.length), icon: 'HeartIcon', color: 'var(--shifa-purple)' },
  { label: 'Hospitalisées', value: String(pregnancies.filter(p => p.status === 'hospitalisée').length), icon: 'BuildingOffice2Icon', color: 'var(--shifa-amber)' },
  { label: 'En travail', value: String(deliveries.filter(d => d.status !== 'terminé').length), icon: 'BoltIcon', color: 'var(--shifa-red)' },
  { label: 'Grossesses à risque élevé', value: String(pregnancies.filter(p => p.risk === 'élevé').length), icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
  { label: 'Nouveau-nés en suivi', value: String(newborns.length), icon: 'StarIcon', color: 'var(--shifa-cyan)' },
  { label: 'Accouchements ce mois', value: '18', icon: 'CheckCircleIcon', color: 'var(--shifa-green)' },
];

export default function MaternityContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('pregnancies');

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-purple), var(--shifa-red))' }}>
              <Icon name="HeartIcon" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Maternité</h1>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Grossesses · Prénatal · Risques · Accouchement · Nouveau-nés · Post-partum</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5"><Icon name="PrinterIcon" size={14} /> Rapport</button>
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
      <div className="px-6 border-b flex gap-1 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? 'border-[var(--shifa-purple)] text-[var(--shifa-purple)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <Icon name={t.icon as any} size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* PREGNANCIES */}
        {activeTab === 'pregnancies' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Réf.', 'Patiente', 'SA / Terme', 'G/P', 'Groupe sanguin', 'Médecin', 'Risque', 'Statut', 'Prochain RDV'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pregnancies.map((p, i) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < pregnancies.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{p.id}</td>
                    <td className="px-4 py-3"><p className="font-medium" style={{ color: 'var(--foreground)' }}>{p.patient}</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans</p></td>
                    <td className="px-4 py-3"><p className="font-bold text-sm" style={{ color: 'var(--shifa-purple)' }}>{p.sa} SA</p><p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Terme: {p.term}</p></td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>G{p.gravida}P{p.para}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--shifa-red)' }}>{p.bloodType}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.doctor}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: riskConfig[p.risk].bg, color: riskConfig[p.risk].color }}>{riskConfig[p.risk].label}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusMatConfig[p.status].bg, color: statusMatConfig[p.status].color }}>{p.status}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.nextVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRENATAL VISITS */}
        {activeTab === 'prenatal' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Historique des visites prénatales</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvelle visite</button>
            </div>
            <div className="space-y-3">
              {prenatalVisits.map(v => (
                <div key={v.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{v.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Visite à {v.sa} SA · {v.date}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(123,94,167,0.10)', color: 'var(--shifa-purple)' }}>{v.sa} SA</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                    {[
                      { label: 'Poids', value: `${v.weight} kg`, alert: false },
                      { label: 'TA', value: v.bp, alert: parseInt(v.bp) > 130 },
                      { label: 'RCF', value: `${v.fhr} bpm`, alert: v.fhr < 120 || v.fhr > 160 },
                      { label: 'HU', value: `${v.uterus} cm`, alert: false },
                      { label: 'Prochain RDV', value: `${v.nextSa} SA`, alert: false },
                    ].map(item => (
                      <div key={item.label} className="text-center p-2 rounded-xl" style={{ backgroundColor: item.alert ? 'rgba(239,68,68,0.06)' : 'var(--muted)', border: item.alert ? '1px solid rgba(239,68,68,0.2)' : 'none' }}>
                        <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{item.label}</p>
                        <p className="font-bold text-sm" style={{ color: item.alert ? 'var(--shifa-red)' : 'var(--foreground)' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{v.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK INDICATORS */}
        {activeTab === 'risks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {(['élevé', 'modéré', 'faible'] as const).map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: riskSeverityConfig[s].bg, color: riskSeverityConfig[s].color }}>
                    {s}: {riskIndicators.filter(r => r.severity === s).length}
                  </span>
                ))}
              </div>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Signaler risque</button>
            </div>
            <div className="space-y-3">
              {riskIndicators.sort((a, b) => {
                const order = { élevé: 0, modéré: 1, faible: 2 };
                return order[a.severity] - order[b.severity];
              }).map(r => (
                <div key={r.id} className="card p-4 border-l-4" style={{ borderLeftColor: riskSeverityConfig[r.severity].color }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: riskSeverityConfig[r.severity].bg, color: riskSeverityConfig[r.severity].color }}>Risque {r.severity}</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{r.category}</span>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{r.patient}</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--foreground)' }}>{r.indicator}</p>
                      <div className="flex items-start gap-1 mt-2">
                        <Icon name="ArrowRightIcon" size={12} style={{ color: 'var(--shifa-green)', marginTop: 2 }} />
                        <p className="text-xs" style={{ color: 'var(--shifa-green)' }}>{r.action}</p>
                      </div>
                    </div>
                    <p className="text-xs ml-4 shrink-0" style={{ color: 'var(--muted-foreground)' }}>Détecté {r.detected}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELIVERY */}
        {activeTab === 'delivery' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Salle d'accouchement — {deliveries.filter(d => d.status !== 'terminé').length} patiente(s) en cours</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {deliveries.map(d => (
                <div key={d.id} className="card p-5 border-2" style={{ borderColor: deliveryStatusConfig[d.status].color }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{d.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.sa} SA · Début travail: {d.startTime}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: deliveryStatusConfig[d.status].bg, color: deliveryStatusConfig[d.status].color }}>{deliveryStatusConfig[d.status].label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-2xl font-bold" style={{ color: d.dilation >= 8 ? 'var(--shifa-red)' : 'var(--shifa-amber)', fontFamily: 'var(--font-display)' }}>{d.dilation} cm</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dilatation</p>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-2xl font-bold" style={{ color: d.fhr < 120 || d.fhr > 160 ? 'var(--shifa-red)' : 'var(--shifa-green)', fontFamily: 'var(--font-display)' }}>{d.fhr}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>RCF (bpm)</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Présentation</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{d.presentation}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Contractions</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{d.contractions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWBORNS */}
        {activeTab === 'newborns' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Profils nouveau-nés</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Enregistrer nouveau-né</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {newborns.map(nb => (
                <div key={nb.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{nb.id}</span>
                      <p className="font-bold text-base mt-1" style={{ color: 'var(--foreground)' }}>Bébé de {nb.mother}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{nb.birthDate} à {nb.birthTime} · {nb.sex === 'M' ? 'Garçon' : 'Fille'}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: nbStatusConfig[nb.status].bg, color: nbStatusConfig[nb.status].color }}>{nbStatusConfig[nb.status].label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-lg font-bold" style={{ color: 'var(--shifa-blue)', fontFamily: 'var(--font-display)' }}>{nb.weight}g</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Poids</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-lg font-bold" style={{ color: 'var(--shifa-cyan)', fontFamily: 'var(--font-display)' }}>{nb.length}cm</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Taille</p>
                    </div>
                    <div className="text-center p-2 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-lg font-bold" style={{ color: 'var(--shifa-purple)', fontFamily: 'var(--font-display)' }}>{nb.hc}cm</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>PC</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 text-center p-2 rounded-xl" style={{ backgroundColor: nb.apgar1 >= 7 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                      <p className="text-lg font-bold" style={{ color: nb.apgar1 >= 7 ? 'var(--shifa-green)' : 'var(--shifa-red)', fontFamily: 'var(--font-display)' }}>{nb.apgar1}/10</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Apgar 1 min</p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-xl" style={{ backgroundColor: nb.apgar5 >= 7 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                      <p className="text-lg font-bold" style={{ color: nb.apgar5 >= 7 ? 'var(--shifa-green)' : 'var(--shifa-red)', fontFamily: 'var(--font-display)' }}>{nb.apgar5}/10</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Apgar 5 min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POSTPARTUM */}
        {activeTab === 'postpartum' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Suivi post-partum</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouvelle visite</button>
            </div>
            <div className="space-y-3">
              {postpartumRecords.map(pp => (
                <div key={pp.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{pp.patient}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Accouchement: {pp.deliveryDate} · Visite: {pp.visitDate}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: pp.mood === 'bon' ? 'rgba(16,185,129,0.12)' : pp.mood === 'modéré' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)', color: pp.mood === 'bon' ? 'var(--shifa-green)' : pp.mood === 'modéré' ? 'var(--shifa-amber)' : 'var(--shifa-red)' }}>{pp.mood}</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>TA</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{pp.bp}</p>
                    </div>
                    <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Saignements</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{pp.bleeding}</p>
                    </div>
                    <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Allaitement</p>
                      <p className="font-bold text-sm" style={{ color: pp.breastfeeding ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>{pp.breastfeeding ? 'Oui' : 'Non'}</p>
                    </div>
                    {pp.episiotomy && (
                      <div className="p-2 rounded-xl text-center" style={{ backgroundColor: 'var(--muted)' }}>
                        <p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Épisiotomie</p>
                        <p className="font-bold text-xs" style={{ color: 'var(--foreground)' }}>{pp.episiotomy}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{pp.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Documentation maternité</h3>
              <button className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"><Icon name="PlusIcon" size={12} /> Nouveau document</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Réf.', 'Patiente', 'Type de document', 'Date', 'Auteur', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maternityDocs.map((d, i) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors" style={{ borderBottom: i < maternityDocs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--shifa-purple)' }}>{d.id}</td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: 'var(--foreground)' }}>{d.patient}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--foreground)' }}>{d.type}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{d.date}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>{d.author}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: d.status === 'validé' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: d.status === 'validé' ? 'var(--shifa-green)' : 'var(--shifa-amber)' }}>{d.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--shifa-blue)' }}>Voir</button>
                          <button className="text-xs px-2 py-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>Imprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
