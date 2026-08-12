'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const usageData = [
  { day: 'Lun', calls: 1240, errors: 12 },
  { day: 'Mar', calls: 1580, errors: 8 },
  { day: 'Mer', calls: 2100, errors: 21 },
  { day: 'Jeu', calls: 1890, errors: 15 },
  { day: 'Ven', calls: 2340, errors: 9 },
  { day: 'Sam', calls: 980, errors: 4 },
  { day: 'Dim', calls: 720, errors: 3 },
];

const latencyData = [
  { time: '00h', p50: 42, p95: 180 },
  { time: '04h', p50: 38, p95: 145 },
  { time: '08h', p50: 65, p95: 290 },
  { time: '12h', p50: 88, p95: 380 },
  { time: '16h', p50: 72, p95: 310 },
  { time: '20h', p50: 55, p95: 220 },
];

const apiKeys = [
  { name: 'Production — App Mobile', key: 'sk_live_••••••••••••••••4f2a', scope: 'read:patients write:appointments', created: '2026-01-15', lastUsed: 'Il y a 2 min', status: 'active' },
  { name: 'Staging — Tests', key: 'sk_test_••••••••••••••••9c1b', scope: 'read:all', created: '2026-03-20', lastUsed: 'Il y a 1h', status: 'active' },
  { name: 'Webhook Processor', key: 'sk_live_••••••••••••••••7d3e', scope: 'webhooks:receive', created: '2026-05-10', lastUsed: 'Il y a 5 min', status: 'active' },
  { name: 'Ancienne clé (dépréciée)', key: 'sk_live_••••••••••••••••2a8f', scope: 'read:all write:all', created: '2025-11-01', lastUsed: 'Il y a 3 mois', status: 'revoked' },
];

const oauthApps = [
  { name: 'SHIFA Mobile Patient', clientId: 'client_pat_4f2a9c1b', redirectUri: 'https://app.shifa.sn/callback', scopes: ['openid', 'profile', 'appointments'], status: 'active' },
  { name: 'Portail Assureur Allianz', clientId: 'client_ins_7d3e2a8f', redirectUri: 'https://portail.allianz.sn/auth/callback', scopes: ['claims:read', 'patients:read'], status: 'active' },
];

const webhooks = [
  { url: 'https://api.clinique-dakar.sn/webhooks/shifa', events: ['appointment.created', 'appointment.cancelled', 'payment.completed'], status: 'active', lastDelivery: 'Succès · il y a 3 min' },
  { url: 'https://erp.hopital-fann.sn/api/shifa-events', events: ['patient.admitted', 'lab.result.ready'], status: 'active', lastDelivery: 'Succès · il y a 12 min' },
  { url: 'https://legacy.clinique-nord.sn/hook', events: ['appointment.created'], status: 'failing', lastDelivery: 'Échec 500 · il y a 1h' },
];

const fhirResources = [
  { resource: 'Patient', endpoint: '/fhir/r4/Patient', method: 'GET, POST, PUT', status: 'stable' },
  { resource: 'Appointment', endpoint: '/fhir/r4/Appointment', method: 'GET, POST, PUT, DELETE', status: 'stable' },
  { resource: 'Observation', endpoint: '/fhir/r4/Observation', method: 'GET, POST', status: 'stable' },
  { resource: 'MedicationRequest', endpoint: '/fhir/r4/MedicationRequest', method: 'GET, POST', status: 'beta' },
  { resource: 'DiagnosticReport', endpoint: '/fhir/r4/DiagnosticReport', method: 'GET', status: 'stable' },
  { resource: 'Encounter', endpoint: '/fhir/r4/Encounter', method: 'GET, POST', status: 'beta' },
];

const tabs = ['Vue d\'ensemble', 'Clés API', 'OAuth Apps', 'FHIR R4', 'Webhooks', 'Usage & Métriques'];

export default function APIDeveloperDashboardContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [showKey, setShowKey] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a, #334155)' }}>
            <Icon name="CodeBracketIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Portail Développeur</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>API SHIFA · FHIR R4 · OAuth 2.0 · Webhooks</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>● API opérationnelle</span>
          <a href="#" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border" style={{ borderColor: 'var(--border)' }}>
            <Icon name="DocumentTextIcon" size={14} />
            Documentation
          </a>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4">
        {[
          { label: 'Appels API (7j)', value: '10 850', icon: 'ArrowsRightLeftIcon', color: '#2563eb' },
          { label: 'Taux de succès', value: '99.2%', icon: 'CheckCircleIcon', color: '#16a34a' },
          { label: 'Latence médiane', value: '58ms', icon: 'BoltIcon', color: '#d97706' },
          { label: 'Webhooks actifs', value: '3', icon: 'BellIcon', color: '#7c3aed' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: k.color, fontFamily: 'DM Sans, sans-serif' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
              style={{ borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent', color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <h3 className="font-semibold mb-4 text-sm">Appels API (7 derniers jours)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#2563eb" radius={[3, 3, 0, 0]} name="Appels" />
                    <Bar dataKey="errors" fill="#f87171" radius={[3, 3, 0, 0]} name="Erreurs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <h3 className="font-semibold mb-4 text-sm">Latence P50 / P95 (24h)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 10 }} unit="ms" />
                    <Tooltip formatter={(v: number) => v + 'ms'} />
                    <Line type="monotone" dataKey="p50" stroke="#16a34a" strokeWidth={2} dot={false} name="P50" />
                    <Line type="monotone" dataKey="p95" stroke="#d97706" strokeWidth={2} dot={false} name="P95" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: '#0f172a' }}>
              <p className="text-xs font-mono mb-2" style={{ color: '#94a3b8' }}>// Exemple d'appel API SHIFA</p>
              <pre className="text-xs font-mono leading-relaxed" style={{ color: '#e2e8f0' }}>{`curl -X GET https://api.shifa.sn/v1/patients \\
  -H "Authorization: Bearer sk_live_••••••••4f2a"\ -H"Content-Type: application/json"\ -H"X-SHIFA-Version: 2026-08"`}</pre>
            </div>
          </div>
        )}

        {/* Tab 1: API Keys */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Clés API</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <Icon name="PlusIcon" size={14} />
                Créer une clé
              </button>
            </div>
            {apiKeys.map((k, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{k.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{k.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <code className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                        {showKey === i ? k.key.replace(/•/g, 'x') : k.key}
                      </code>
                      <button onClick={() => setShowKey(showKey === i ? null : i)} className="text-xs" style={{ color: 'var(--primary)' }}>
                        {showKey === i ? 'Masquer' : 'Afficher'}
                      </button>
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>Scopes : {k.scope} · Créée le {k.created} · {k.lastUsed}</p>
                  </div>
                  {k.status === 'active' && (
                    <button className="text-xs px-2.5 py-1 rounded-lg border" style={{ borderColor: '#fca5a5', color: '#dc2626' }}>Révoquer</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: OAuth Apps */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Applications OAuth 2.0</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <Icon name="PlusIcon" size={14} />
                Nouvelle app
              </button>
            </div>
            {oauthApps.map((app, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">{app.name}</p>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>Client ID: {app.clientId}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{app.status}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium w-24 shrink-0" style={{ color: 'var(--muted-foreground)' }}>Redirect URI</span>
                    <code className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{app.redirectUri}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-medium w-24 shrink-0" style={{ color: 'var(--muted-foreground)' }}>Scopes</span>
                    <div className="flex flex-wrap gap-1">
                      {app.scopes.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'var(--muted)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: FHIR */}
        {activeTab === 3 && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold text-sm">Ressources FHIR R4 disponibles</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Base URL : https://api.shifa.sn/fhir/r4</p>
            </div>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: 'var(--muted)' }}>
                <tr>
                  {['Ressource', 'Endpoint', 'Méthodes', 'Statut'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fhirResources.map((r, i) => (
                  <tr key={r.resource} style={{ backgroundColor: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td className="px-4 py-3 font-semibold text-sm">{r.resource}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.endpoint}</td>
                    <td className="px-4 py-3 text-xs">{r.method}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'stable' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Webhooks */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Endpoints Webhooks</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <Icon name="PlusIcon" size={14} />
                Ajouter un endpoint
              </button>
            </div>
            {webhooks.map((wh, i) => (
              <div key={i} className="p-4 rounded-xl border" style={{ borderColor: wh.status === 'failing' ? '#fca5a5' : 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-start justify-between mb-2">
                  <code className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{wh.url}</code>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${wh.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{wh.status}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {wh.events.map(e => (
                    <span key={e} className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: 'var(--muted)' }}>{e}</span>
                  ))}
                </div>
                <p className="text-xs" style={{ color: wh.status === 'failing' ? '#dc2626' : 'var(--muted-foreground)' }}>Dernière livraison : {wh.lastDelivery}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Usage */}
        {activeTab === 5 && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Quota mensuel', used: 85000, total: 100000, color: '#2563eb' },
                { label: 'Bande passante', used: 4.2, total: 10, unit: 'GB', color: '#7c3aed' },
                { label: 'Webhooks livrés', used: 2840, total: 5000, color: '#16a34a' },
              ].map(q => (
                <div key={q.label} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <p className="text-sm font-medium mb-2">{q.label}</p>
                  <p className="text-xl font-bold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {q.used.toLocaleString('fr-FR')}{q.unit || ''} <span className="text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>/ {q.total.toLocaleString('fr-FR')}{q.unit || ''}</span>
                  </p>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${(q.used / q.total) * 100}%`, backgroundColor: q.color }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{Math.round((q.used / q.total) * 100)}% utilisé</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold mb-4 text-sm">Volume d'appels par jour</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#2563eb" radius={[3, 3, 0, 0]} name="Appels" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
