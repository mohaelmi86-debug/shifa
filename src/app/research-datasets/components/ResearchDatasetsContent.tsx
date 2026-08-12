'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'datasets' | 'requests' | 'access' | 'audit';

const tabs = [
  { id: 'datasets' as Tab, label: 'Jeux de données', icon: 'CircleStackIcon' },
  { id: 'requests' as Tab, label: 'Demandes d\'accès', icon: 'DocumentPlusIcon' },
  { id: 'access' as Tab, label: 'Accès accordés', icon: 'ShieldCheckIcon' },
  { id: 'audit' as Tab, label: 'Journal d\'audit', icon: 'ClipboardDocumentCheckIcon' },
];

const datasets = [
  { id: 'DS-001', name: 'Données épidémiologiques nationales 2020–2024', org: 'Ministère de la Santé', type: 'Épidémiologie', format: 'CSV / JSON', rows: '2.4M', anonymized: true, status: 'available', access: 'approved', lastUpdated: '01/08/2025' },
  { id: 'DS-002', name: 'Registre vaccinations pédiatriques', org: 'PNLP Sénégal', type: 'Vaccination', format: 'CSV', rows: '850K', anonymized: true, status: 'available', access: 'approved', lastUpdated: '15/07/2025' },
  { id: 'DS-003', name: 'Données hospitalières agrégées CHU', org: 'CHU Saint-Louis', type: 'Hospitalisation', format: 'FHIR R4', rows: '1.1M', anonymized: true, status: 'available', access: 'pending', lastUpdated: '10/08/2025' },
  { id: 'DS-004', name: 'Résultats laboratoire anonymisés', org: 'Réseau Labo National', type: 'Biologie', format: 'HL7', rows: '3.2M', anonymized: true, status: 'restricted', access: 'none', lastUpdated: '05/08/2025' },
  { id: 'DS-005', name: 'Indicateurs santé maternelle', org: 'OMS / UNFPA', type: 'Maternité', format: 'CSV', rows: '420K', anonymized: true, status: 'available', access: 'approved', lastUpdated: '20/07/2025' },
];

const requests = [
  { id: 'REQ-2025-041', dataset: 'Données hospitalières agrégées CHU', purpose: 'Étude sur les durées de séjour post-opératoires', status: 'pending', submitted: '08/08/2025', ethics: 'Comité CNERS — Réf. 2025-041' },
  { id: 'REQ-2025-038', dataset: 'Résultats laboratoire anonymisés', purpose: 'Analyse des résistances aux antibiotiques', status: 'under_review', submitted: '01/08/2025', ethics: 'Comité CNERS — Réf. 2025-038' },
  { id: 'REQ-2025-029', dataset: 'Registre vaccinations pédiatriques', purpose: 'Couverture vaccinale par région', status: 'approved', submitted: '15/07/2025', ethics: 'Comité CNERS — Réf. 2025-029' },
  { id: 'REQ-2025-018', dataset: 'Données épidémiologiques nationales', purpose: 'Modélisation propagation maladies infectieuses', status: 'approved', submitted: '01/06/2025', ethics: 'Comité CNERS — Réf. 2025-018' },
];

const accessLog = [
  { id: 1, user: 'Dr. Aminata Diallo', dataset: 'DS-001', action: 'Téléchargement partiel (500K lignes)', date: '11/08/2025 14:32', ip: '196.x.x.x' },
  { id: 2, user: 'Prof. Ibrahima Sow', dataset: 'DS-002', action: 'Consultation API', date: '11/08/2025 11:15', ip: '196.x.x.x' },
  { id: 3, user: 'Dr. Aminata Diallo', dataset: 'DS-005', action: 'Export CSV complet', date: '10/08/2025 16:48', ip: '196.x.x.x' },
  { id: 4, user: 'Système SHIFA', dataset: 'DS-001', action: 'Mise à jour automatique', date: '01/08/2025 02:00', ip: 'Système' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  available: { label: 'Disponible', bg: '#dcfce7', color: '#16a34a' },
  restricted: { label: 'Restreint', bg: '#fee2e2', color: '#dc2626' },
  pending: { label: 'En attente', bg: '#fef3c7', color: '#d97706' },
  under_review: { label: 'En révision', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  approved: { label: 'Approuvé', bg: '#dcfce7', color: '#16a34a' },
  none: { label: 'Non demandé', bg: '#f1f5f9', color: '#64748b' },
};

export default function ResearchDatasetsContent() {
  const [activeTab, setActiveTab] = useState<Tab>('datasets');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Jeux de Données Recherche</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Données autorisées, anonymisées et pseudonymisées pour la recherche</p>
        </div>
        <button onClick={() => setShowRequestForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
          <Icon name="PlusIcon" size={16} />Nouvelle demande
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)' }}>
        <Icon name="ShieldCheckIcon" size={18} style={{ color: 'var(--shifa-blue)' }} className="shrink-0 mt-0.5" />
        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Accès contrôlé : </span>
          Toutes les données sont anonymisées ou pseudonymisées. L'accès nécessite une autorisation éthique et une approbation SHIFA. Aucune donnée médicale individuelle identifiable n'est accessible.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.id ? 'shadow-sm' : ''}`}
            style={activeTab === t.id ? { backgroundColor: 'var(--card)', color: 'var(--shifa-blue)' } : { color: 'var(--muted-foreground)' }}>
            <Icon name={t.icon as any} size={15} />{t.label}
          </button>
        ))}
      </div>

      {/* Datasets */}
      {activeTab === 'datasets' && (
        <div className="space-y-3">
          {datasets.map(ds => {
            const accessSt = statusConfig[ds.access];
            const availSt = statusConfig[ds.status];
            return (
              <div key={ds.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ds.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: availSt.bg, color: availSt.color }}>{availSt.label}</span>
                      {ds.anonymized && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Anonymisé</span>
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{ds.org} · {ds.type} · {ds.format}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span className="flex items-center gap-1"><Icon name="CircleStackIcon" size={12} />{ds.rows} enregistrements</span>
                      <span className="flex items-center gap-1"><Icon name="CalendarDaysIcon" size={12} />Mis à jour: {ds.lastUpdated}</span>
                      <span className="flex items-center gap-1"><Icon name="TagIcon" size={12} />{ds.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: accessSt.bg, color: accessSt.color }}>
                      {accessSt.label}
                    </span>
                    {ds.access === 'approved' && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                        <Icon name="ArrowDownTrayIcon" size={13} />Accéder
                      </button>
                    )}
                    {ds.access === 'none' && (
                      <button onClick={() => { setSelectedDataset(ds.id); setShowRequestForm(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        Demander l'accès
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.map(r => {
            const s = statusConfig[r.status];
            return (
              <div key={r.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{r.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <h3 className="text-sm font-semibold mt-1" style={{ color: 'var(--foreground)' }}>{r.dataset}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Objectif: {r.purpose}</p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                      <Icon name="DocumentCheckIcon" size={12} />{r.ethics}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Soumis le {r.submitted}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Access */}
      {activeTab === 'access' && (
        <div className="space-y-3">
          {datasets.filter(d => d.access === 'approved').map(ds => (
            <div key={ds.id} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#dcfce7' }}>
                <Icon name="CircleStackIcon" size={20} style={{ color: '#16a34a' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ds.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ds.org} · {ds.rows} enregistrements</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="ArrowDownTrayIcon" size={13} />Télécharger
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Audit */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Journal d'accès aux données</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Toutes les opérations sont enregistrées de manière immuable</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {accessLog.map(log => (
              <div key={log.id} className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                  {log.user.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{log.user}</p>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{log.date}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{log.action} · {log.dataset}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>IP: {log.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request form modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Demande d'accès aux données</h3>
              <button onClick={() => setShowRequestForm(false)} className="p-1 rounded-lg hover:bg-muted">
                <Icon name="XMarkIcon" size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Jeu de données</label>
                <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Objectif de la recherche</label>
                <textarea rows={3} placeholder="Décrivez l'objectif scientifique..." className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--muted-foreground)' }}>Référence autorisation éthique</label>
                <input placeholder="Ex: CNERS-2025-XXX" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Annuler</button>
              <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Soumettre la demande</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
