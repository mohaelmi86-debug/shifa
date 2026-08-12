'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'waiting' | 'session' | 'notes' | 'prescription' | 'consent' | 'history';

interface WaitingPatient {
  id: string;
  name: string;
  age: number;
  reason: string;
  waitTime: number;
  paymentStatus: 'paid' | 'pending' | 'exempt';
  consentSigned: boolean;
  priority: 'normal' | 'urgent';
}

interface SessionHistory {
  id: string;
  patient: string;
  date: string;
  duration: number;
  reason: string;
  status: 'completed' | 'cancelled' | 'no_show';
  prescriptionIssued: boolean;
  amount: number;
}

const waitingPatients: WaitingPatient[] = [
  { id: 'p1', name: 'Oumar Diallo', age: 42, reason: 'Suivi hypertension', waitTime: 8, paymentStatus: 'paid', consentSigned: true, priority: 'normal' },
  { id: 'p2', name: 'Fatou Seck', age: 28, reason: 'Douleurs abdominales', waitTime: 15, paymentStatus: 'pending', consentSigned: false, priority: 'urgent' },
  { id: 'p3', name: 'Ibrahima Ba', age: 55, reason: 'Renouvellement ordonnance', waitTime: 22, paymentStatus: 'paid', consentSigned: true, priority: 'normal' },
  { id: 'p4', name: 'Mariama Ndiaye', age: 35, reason: 'Résultats analyses', waitTime: 30, paymentStatus: 'exempt', consentSigned: true, priority: 'normal' },
];

const sessionHistory: SessionHistory[] = [
  { id: 'tc-001', patient: 'Cheikh Diop', date: '10 août 2026 — 14h30', duration: 22, reason: 'Consultation générale', status: 'completed', prescriptionIssued: true, amount: 12000 },
  { id: 'tc-002', patient: 'Rokhaya Fall', date: '10 août 2026 — 11h00', duration: 18, reason: 'Suivi diabète', status: 'completed', prescriptionIssued: true, amount: 12000 },
  { id: 'tc-003', patient: 'Amadou Balde', date: '09 août 2026 — 16h15', duration: 0, reason: 'Dermatologie', status: 'no_show', prescriptionIssued: false, amount: 0 },
  { id: 'tc-004', patient: 'Aissatou Camara', date: '09 août 2026 — 09h45', duration: 31, reason: 'Renouvellement ordonnance', status: 'completed', prescriptionIssued: true, amount: 12000 },
  { id: 'tc-005', patient: 'Moussa Kouyate', date: '08 août 2026 — 15h00', duration: 0, reason: 'Consultation urgente', status: 'cancelled', prescriptionIssued: false, amount: 0 },
];

const paymentBadge = (s: WaitingPatient['paymentStatus']) => {
  const map = { paid: { label: 'Payé', color: '#16a34a', bg: '#dcfce7' }, pending: { label: 'En attente', color: '#d97706', bg: '#fef3c7' }, exempt: { label: 'Exonéré', color: '#6b7280', bg: '#f3f4f6' } };
  return map[s];
};

const historyStatusBadge = (s: SessionHistory['status']) => {
  const map = { completed: { label: 'Terminée', color: '#16a34a', bg: '#dcfce7' }, cancelled: { label: 'Annulée', color: '#dc2626', bg: '#fee2e2' }, no_show: { label: 'Absent', color: '#6b7280', bg: '#f3f4f6' } };
  return map[s];
};

export default function ProTeleconsultationContent() {
  const [activeTab, setActiveTab] = useState<Tab>('waiting');
  const [selectedPatient, setSelectedPatient] = useState<WaitingPatient | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [notes, setNotes] = useState('');
  const [prescriptionLines, setPrescriptionLines] = useState('');

  const tabs: { key: Tab; label: string; icon: string; badge?: number }[] = [
    { key: 'waiting', label: "Salle d'attente", icon: 'UsersIcon', badge: waitingPatients.length },
    { key: 'session', label: 'Session en cours', icon: 'VideoCameraIcon' },
    { key: 'notes', label: 'Notes cliniques', icon: 'PencilSquareIcon' },
    { key: 'prescription', label: 'Ordonnance', icon: 'DocumentCheckIcon' },
    { key: 'consent', label: 'Consentement', icon: 'ShieldCheckIcon' },
    { key: 'history', label: 'Historique', icon: 'ClockIcon' },
  ];

  const startSession = (p: WaitingPatient) => {
    setSelectedPatient(p);
    setSessionActive(true);
    setActiveTab('session');
  };

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Téléconsultation Professionnelle</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Salle d'attente virtuelle, sessions vidéo, notes et ordonnances</p>
        </div>
        <div className="flex items-center gap-2">
          {sessionActive && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Session active — {selectedPatient?.name}
            </span>
          )}
          <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg">
            <Icon name="PhoneIcon" className="w-4 h-4" />
            Démarrer une session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            style={{
              background: activeTab === t.key ? 'var(--shifa-blue)' : 'var(--card)',
              color: activeTab === t.key ? '#fff' : 'var(--muted-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            <Icon name={t.icon} className="w-4 h-4" />
            {t.label}
            {t.badge ? (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: activeTab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--shifa-blue)', color: activeTab === t.key ? '#fff' : '#fff' }}>
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Waiting Room */}
      {activeTab === 'waiting' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'En attente', value: waitingPatients.length, icon: 'UsersIcon', color: 'var(--shifa-blue)' },
              { label: 'Urgents', value: waitingPatients.filter(p => p.priority === 'urgent').length, icon: 'ExclamationTriangleIcon', color: 'var(--shifa-red)' },
              { label: 'Paiement en attente', value: waitingPatients.filter(p => p.paymentStatus === 'pending').length, icon: 'BanknotesIcon', color: '#d97706' },
              { label: 'Consentement manquant', value: waitingPatients.filter(p => !p.consentSigned).length, icon: 'ShieldExclamationIcon', color: '#8b5cf6' },
            ].map(kpi => (
              <div key={kpi.label} className="card-base p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18` }}>
                  <Icon name={kpi.icon} className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>{kpi.value}</div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {waitingPatients.map((p, i) => {
              const pb = paymentBadge(p.paymentStatus);
              return (
                <div key={p.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: p.priority === 'urgent' ? 'var(--shifa-red)' : 'var(--shifa-blue)' }}>
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--shifa-dark)' }}>
                        {p.name}
                        {p.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: '#fee2e2', color: '#dc2626' }}>URGENT</span>
                        )}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{p.age} ans — {p.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="ClockIcon" className="w-3.5 h-3.5 inline mr-1" />
                      {p.waitTime} min
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: pb.bg, color: pb.color }}>{pb.label}</span>
                    {p.consentSigned ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#dcfce7', color: '#16a34a' }}>Consentement ✓</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#fef3c7', color: '#d97706' }}>Consentement requis</span>
                    )}
                    <button
                      onClick={() => startSession(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'var(--shifa-blue)' }}
                    >
                      <Icon name="VideoCameraIcon" className="w-3.5 h-3.5" />
                      Appeler
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session */}
      {activeTab === 'session' && (
        <div className="space-y-4">
          {!sessionActive ? (
            <div className="card-base p-12 text-center">
              <Icon name="VideoCameraSlashIcon" className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
              <p className="font-medium" style={{ color: 'var(--shifa-dark)' }}>Aucune session active</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Appelez un patient depuis la salle d'attente pour démarrer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Video area */}
              <div className="lg:col-span-2 card-base overflow-hidden">
                <div className="relative" style={{ background: '#0f172a', minHeight: 320 }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'var(--shifa-blue)' }}>
                        {selectedPatient?.name.charAt(0)}
                      </div>
                      <p className="text-white font-medium">{selectedPatient?.name}</p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Connexion en cours… (Phase 3 — intégration vidéo)</p>
                    </div>
                  </div>
                  {/* Self preview */}
                  <div className="absolute bottom-3 right-3 w-24 h-16 rounded-lg flex items-center justify-center" style={{ background: '#1e293b', border: '2px solid rgba(255,255,255,0.2)' }}>
                    <Icon name="UserIcon" className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </div>
                  {/* Timer */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-mono text-white" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    00:04:32
                  </div>
                </div>
                {/* Controls */}
                <div className="p-4 flex items-center justify-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => setMicOn(!micOn)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: micOn ? 'var(--card)' : '#fee2e2', border: '1px solid var(--border)' }}>
                    <Icon name={micOn ? 'MicrophoneIcon' : 'NoSymbolIcon'} className="w-5 h-5" style={{ color: micOn ? 'var(--shifa-dark)' : '#dc2626' }} />
                  </button>
                  <button onClick={() => setCamOn(!camOn)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: camOn ? 'var(--card)' : '#fee2e2', border: '1px solid var(--border)' }}>
                    <Icon name={camOn ? 'VideoCameraIcon' : 'VideoCameraSlashIcon'} className="w-5 h-5" style={{ color: camOn ? 'var(--shifa-dark)' : '#dc2626' }} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <Icon name="ChatBubbleLeftRightIcon" className="w-5 h-5" style={{ color: 'var(--shifa-dark)' }} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <Icon name="PaperClipIcon" className="w-5 h-5" style={{ color: 'var(--shifa-dark)' }} />
                  </button>
                  <button onClick={() => { setSessionActive(false); setActiveTab('waiting'); }} className="px-4 py-2 rounded-full text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#dc2626' }}>
                    <Icon name="PhoneXMarkIcon" className="w-4 h-4" />
                    Terminer
                  </button>
                </div>
              </div>
              {/* Patient info panel */}
              <div className="space-y-3">
                <div className="card-base p-4">
                  <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--shifa-dark)' }}>Patient</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Nom</span><span className="font-medium">{selectedPatient?.name}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Âge</span><span className="font-medium">{selectedPatient?.age} ans</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Motif</span><span className="font-medium text-right max-w-32">{selectedPatient?.reason}</span></div>
                    <div className="flex justify-between"><span style={{ color: 'var(--muted-foreground)' }}>Paiement</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: paymentBadge(selectedPatient?.paymentStatus ?? 'pending').bg, color: paymentBadge(selectedPatient?.paymentStatus ?? 'pending').color }}>
                        {paymentBadge(selectedPatient?.paymentStatus ?? 'pending').label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-base p-4">
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--shifa-dark)' }}>Actions rapides</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Rédiger une note', icon: 'PencilSquareIcon', tab: 'notes' as Tab },
                      { label: 'Créer ordonnance', icon: 'DocumentCheckIcon', tab: 'prescription' as Tab },
                      { label: 'Vérifier consentement', icon: 'ShieldCheckIcon', tab: 'consent' as Tab },
                    ].map(a => (
                      <button key={a.label} onClick={() => setActiveTab(a.tab)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
                        <Icon name={a.icon} className="w-4 h-4" style={{ color: 'var(--shifa-blue)' }} />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {activeTab === 'notes' && (
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Notes cliniques de session</h2>
            {selectedPatient && <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Patient : {selectedPatient.name}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Motif de consultation', 'Anamnèse', 'Examen clinique', 'Diagnostic', 'Conduite à tenir', 'Suivi prévu'].map(field => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{field}</label>
                <textarea rows={3} className="w-full rounded-lg px-3 py-2 text-sm resize-none" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder={`Saisir ${field.toLowerCase()}…`} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-primary px-4 py-2 rounded-lg text-sm">Enregistrer les notes</button>
            <button className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>Effacer</button>
          </div>
        </div>
      )}

      {/* Prescription */}
      {activeTab === 'prescription' && (
        <div className="card-base p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Ordonnance électronique</h2>
            {selectedPatient && <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Patient : {selectedPatient.name}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Médicament / Produit</label>
              <input className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Nom du médicament…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Posologie</label>
              <input className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Ex: 1 cp matin et soir…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Durée</label>
              <input className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Ex: 7 jours…" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Renouvellement</label>
              <select className="w-full rounded-lg px-3 py-2 text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
                <option>Non renouvelable</option>
                <option>1 fois</option>
                <option>2 fois</option>
                <option>3 fois</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Instructions spéciales</label>
            <textarea rows={3} className="w-full rounded-lg px-3 py-2 text-sm resize-none" style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }} placeholder="Instructions particulières pour le patient…" value={prescriptionLines} onChange={e => setPrescriptionLines(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Icon name="DocumentCheckIcon" className="w-4 h-4" />
              Signer et envoyer
            </button>
            <button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
              <Icon name="PrinterIcon" className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      )}

      {/* Consent */}
      {activeTab === 'consent' && (
        <div className="space-y-4">
          <div className="card-base p-4 flex items-start gap-3" style={{ borderLeft: '4px solid var(--shifa-blue)' }}>
            <Icon name="InformationCircleIcon" className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--shifa-blue)' }} />
            <p className="text-sm" style={{ color: 'var(--shifa-dark)' }}>Le consentement éclairé du patient doit être obtenu avant toute téléconsultation. Vérifiez le statut ci-dessous.</p>
          </div>
          {waitingPatients.map(p => (
            <div key={p.id} className="card-base p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{p.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Consentement téléconsultation</div>
              </div>
              <div className="flex items-center gap-3">
                {p.consentSigned ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#dcfce7', color: '#16a34a' }}>
                    <Icon name="CheckCircleIcon" className="w-3.5 h-3.5" />
                    Signé
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#fef3c7', color: '#d97706' }}>
                      <Icon name="ExclamationTriangleIcon" className="w-3.5 h-3.5" />
                      Non signé
                    </span>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: 'var(--shifa-blue)' }}>
                      Envoyer demande
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: 'var(--shifa-dark)' }}>Historique des téléconsultations</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--shifa-dark)' }}>
              <Icon name="ArrowDownTrayIcon" className="w-4 h-4" />
              Exporter
            </button>
          </div>
          {sessionHistory.map(s => {
            const sb = historyStatusBadge(s.status);
            return (
              <div key={s.id} className="card-base p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--shifa-dark)' }}>{s.patient}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.date} — {s.reason}</div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {s.duration > 0 && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s.duration} min</span>}
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sb.bg, color: sb.color }}>{sb.label}</span>
                  {s.prescriptionIssued && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>Ordonnance émise</span>
                  )}
                  {s.amount > 0 && <span className="text-xs font-semibold" style={{ color: 'var(--shifa-dark)' }}>{s.amount.toLocaleString()} FCFA</span>}
                  <button className="p-1.5 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <Icon name="EyeIcon" className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
