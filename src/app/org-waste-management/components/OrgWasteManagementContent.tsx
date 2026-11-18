'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TabKey = 'dashboard' | 'dasri' | 'collection' | 'disposal' | 'compliance' | 'contractors';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
  { key: 'dasri', label: 'DASRI & Déchets', icon: 'TrashIcon' },
  { key: 'collection', label: 'Collecte', icon: 'TruckIcon' },
  { key: 'disposal', label: 'Élimination', icon: 'FireIcon' },
  { key: 'compliance', label: 'Conformité réglementaire', icon: 'ShieldCheckIcon' },
  { key: 'contractors', label: 'Prestataires agréés', icon: 'BuildingOffice2Icon' },
];

const kpis = [
  { label: 'DASRI ce mois', value: '2.4t', sub: 'Déchets infectieux', icon: 'TrashIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
  { label: 'Collectes planifiées', value: '12', sub: '3 cette semaine', icon: 'TruckIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { label: 'Taux conformité', value: '96%', sub: 'Objectif ≥ 95%', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { label: 'Non-conformités', value: '2', sub: 'Ce trimestre', icon: 'ExclamationTriangleIcon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const wasteCategories = [
  { code: 'DASRI-A', name: 'Déchets piquants/coupants/tranchants', color: '#dc2626', volume: 180, unit: 'kg', containers: 'Boîtes jaunes', frequency: 'Quotidienne' },
  { code: 'DASRI-B', name: 'Déchets mous infectieux', color: '#f59e0b', volume: 420, unit: 'kg', containers: 'Sacs jaunes', frequency: 'Quotidienne' },
  { code: 'DASRI-C', name: 'Déchets anatomiques', color: '#7c3aed', volume: 45, unit: 'kg', containers: 'Conteneurs spéciaux', frequency: 'Hebdomadaire' },
  { code: 'DAOM', name: 'Déchets assimilés ménagers', color: '#64748b', volume: 850, unit: 'kg', containers: 'Sacs noirs', frequency: 'Quotidienne' },
  { code: 'DCHIM', name: 'Déchets chimiques/pharmaceutiques', color: '#0891b2', volume: 28, unit: 'kg', containers: 'Conteneurs étanches', frequency: 'Mensuelle' },
  { code: 'DRAD', name: 'Déchets radioactifs', color: '#16a34a', volume: 3, unit: 'kg', containers: 'Conteneurs plombés', frequency: 'Trimestrielle' },
];

const collections = [
  { id: 'COL-001', date: '12/08/2026', time: '07:00', contractor: 'SEGED Sénégal', driver: 'Moussa Camara', vehicle: 'SN-4521-DK', categories: ['DASRI-A', 'DASRI-B'], weight: 185, status: 'scheduled', bsda: 'BSDA-2026-0812-001' },
  { id: 'COL-002', date: '10/08/2026', time: '07:30', contractor: 'SEGED Sénégal', driver: 'Ibrahima Fall', vehicle: 'SN-4521-DK', categories: ['DASRI-A', 'DASRI-B', 'DAOM'], weight: 612, status: 'completed', bsda: 'BSDA-2026-0810-001' },
  { id: 'COL-003', date: '08/08/2026', time: '08:00', contractor: 'SEGED Sénégal', driver: 'Moussa Camara', vehicle: 'SN-7834-DK', categories: ['DASRI-C', 'DCHIM'], weight: 68, status: 'completed', bsda: 'BSDA-2026-0808-001' },
  { id: 'COL-004', date: '15/08/2026', time: '07:00', contractor: 'SEGED Sénégal', driver: 'À confirmer', vehicle: 'À confirmer', categories: ['DASRI-A', 'DASRI-B'], weight: 0, status: 'planned', bsda: '' },
];

const disposals = [
  { id: 'DISP-001', date: '10/08/2026', facility: 'Centre incinération SEGED — Dakar', method: 'Incinération haute température', categories: ['DASRI-A', 'DASRI-B'], weight: 612, certificate: 'CERT-2026-0810-001', status: 'certified' },
  { id: 'DISP-002', date: '08/08/2026', facility: 'Centre incinération SEGED — Dakar', method: 'Incinération haute température', categories: ['DASRI-C', 'DCHIM'], weight: 68, certificate: 'CERT-2026-0808-001', status: 'certified' },
  { id: 'DISP-003', date: '01/08/2026', facility: 'Centre incinération SEGED — Dakar', method: 'Incinération haute température', categories: ['DASRI-A', 'DASRI-B', 'DAOM'], weight: 1240, certificate: 'CERT-2026-0801-001', status: 'certified' },
];

const monthlyData = [
  { month: 'Mar', dasri: 2.1, daom: 3.2 }, { month: 'Avr', dasri: 2.3, daom: 3.4 },
  { month: 'Mai', dasri: 2.0, daom: 3.1 }, { month: 'Jun', dasri: 2.5, daom: 3.6 },
  { month: 'Jul', dasri: 2.2, daom: 3.3 }, { month: 'Aoû', dasri: 2.4, daom: 3.5 },
];

const complianceChecks = [
  { category: 'Tri à la source', status: 'compliant', lastAudit: '05/08/2026', score: 98, notes: 'Excellent tri dans tous les services' },
  { category: 'Stockage intermédiaire', status: 'compliant', lastAudit: '03/08/2026', score: 94, notes: 'Local conforme — température OK' },
  { category: 'Traçabilité BSDA', status: 'compliant', lastAudit: '01/08/2026', score: 100, notes: 'Tous les BSDA archivés' },
  { category: 'Formation du personnel', status: 'warning', lastAudit: '15/07/2026', score: 82, notes: '3 agents à former — recyclage prévu' },
  { category: 'Contrats prestataires', status: 'compliant', lastAudit: '01/06/2026', score: 100, notes: 'Agréments à jour' },
  { category: 'Registre déchets', status: 'compliant', lastAudit: '10/08/2026', score: 97, notes: 'Registre tenu à jour' },
];

const contractors = [
  { name: 'SEGED Sénégal', type: 'Collecte & Incinération DASRI', approval: 'AGR-DASRI-SN-2024-001', expiry: '31/12/2026', contact: 'M. Diallo — 77 123 45 67', services: ['DASRI-A', 'DASRI-B', 'DASRI-C', 'DCHIM'], status: 'active', lastCollection: '10/08/2026' },
  { name: 'ECOPROTECT', type: 'Déchets radioactifs', approval: 'AGR-DRAD-SN-2023-004', expiry: '30/06/2027', contact: 'Mme. Ndiaye — 76 234 56 78', services: ['DRAD'], status: 'active', lastCollection: '15/06/2026' },
  { name: 'CLEANMED', type: 'Déchets pharmaceutiques', approval: 'AGR-DCHIM-SN-2024-002', expiry: '28/02/2027', contact: 'M. Sow — 70 345 67 89', services: ['DCHIM'], status: 'active', lastCollection: '08/08/2026' },
];

export default function OrgWasteManagementContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="TrashIcon" size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Gestion des Déchets Hospitaliers</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>DASRI — Traçabilité collecte/élimination — Conformité réglementaire</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: activeTab === t.key ? 600 : 400, color: activeTab === t.key ? '#166534' : '#64748b', borderBottom: activeTab === t.key ? '2px solid #166534' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            <Icon name={t.icon} size={15} color={activeTab === t.key ? '#166534' : '#94a3b8'} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 6px' }}>{k.label}</p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0 }}>{k.value}</p>
                      <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>{k.sub}</p>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={k.icon} size={20} color={k.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Production mensuelle (tonnes)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="dasri" name="DASRI" fill="#dc2626" radius={[4,4,0,0]} />
                    <Bar dataKey="daom" name="DAOM" fill="#64748b" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Catégories de déchets — Ce mois</h3>
                {wasteCategories.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < wasteCategories.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: w.color }} />
                      <span style={{ fontSize: 12, color: '#475569' }}>{w.code}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{w.volume} {w.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dasri' && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Catégories DASRI & déchets hospitaliers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {wasteCategories.map((w, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: `2px solid ${w.color}20`, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: w.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: w.color }}>{w.code}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 8px' }}>{w.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Volume ce mois:</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{w.volume} {w.unit}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Conteneurs:</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>{w.containers}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Collecte:</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>{w.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Collectes — Traçabilité BSDA</h3>
              <button style={{ padding: '8px 16px', background: '#166534', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Planifier collecte</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['ID', 'Date', 'Prestataire', 'Chauffeur', 'Véhicule', 'Catégories', 'Poids', 'N° BSDA', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collections.map((c, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{c.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.date} {c.time}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{c.contractor}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.driver}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.vehicle}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.categories.map((cat, j) => (
                          <span key={j} style={{ padding: '1px 6px', borderRadius: 4, fontSize: 10, background: '#fee2e2', color: '#dc2626' }}>{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{c.weight > 0 ? `${c.weight} kg` : '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{c.bsda || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, background: c.status === 'completed' ? '#dcfce7' : c.status === 'scheduled' ? '#dbeafe' : '#f1f5f9', color: c.status === 'completed' ? '#16a34a' : c.status === 'scheduled' ? '#1d4ed8' : '#64748b' }}>
                        {c.status === 'completed' ? 'Effectuée' : c.status === 'scheduled' ? 'Planifiée' : 'Prévue'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'disposal' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Élimination — Certificats de destruction</h3>
            </div>
            {disposals.map((d, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{d.facility}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{d.date} — {d.method} — {d.weight} kg</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: '#dcfce7', color: '#16a34a' }}>✓ Certifié</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {d.categories.map((cat, j) => (
                    <span key={j} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: '#fee2e2', color: '#dc2626' }}>{cat}</span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Certificat: <strong>{d.certificate}</strong></p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Conformité réglementaire — Audit déchets</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {complianceChecks.map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${c.status === 'warning' ? '#fed7aa' : '#e2e8f0'}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>{c.category}</p>
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: c.status === 'compliant' ? '#dcfce7' : '#fef3c7', color: c.status === 'compliant' ? '#16a34a' : '#b45309' }}>{c.status === 'compliant' ? 'Conforme' : 'À améliorer'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${c.score}%`, height: '100%', background: c.score >= 90 ? '#16a34a' : '#f59e0b', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.score >= 90 ? '#16a34a' : '#b45309' }}>{c.score}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}>{c.notes}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Dernier audit: {c.lastAudit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contractors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Prestataires agréés</h3>
              <button style={{ padding: '8px 16px', background: '#166534', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>+ Ajouter prestataire</button>
            </div>
            {contractors.map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{c.type}</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, background: '#dcfce7', color: '#16a34a' }}>Agréé</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
                  {[{ label: 'N° Agrément', value: c.approval }, { label: 'Expiration', value: c.expiry }, { label: 'Contact', value: c.contact }].map((d, j) => (
                    <div key={j} style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 2px' }}>{d.label}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>{d.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.services.map((s, j) => (
                    <span key={j} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: '#dcfce7', color: '#166534' }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
