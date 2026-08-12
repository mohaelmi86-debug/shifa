'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type Tab = 'overview' | 'uptime' | 'performance' | 'errors' | 'sla' | 'alerts';

const uptimeData = [
  { time: '00h', uptime: 100 }, { time: '02h', uptime: 100 }, { time: '04h', uptime: 99.8 },
  { time: '06h', uptime: 100 }, { time: '08h', uptime: 100 }, { time: '10h', uptime: 99.5 },
  { time: '12h', uptime: 100 }, { time: '14h', uptime: 100 }, { time: '16h', uptime: 100 },
  { time: '18h', uptime: 99.9 }, { time: '20h', uptime: 100 }, { time: '22h', uptime: 100 },
];

const responseTimeData = [
  { time: '00h', api: 120, db: 45, cdn: 18 }, { time: '02h', api: 115, db: 42, cdn: 16 },
  { time: '04h', api: 118, db: 44, cdn: 17 }, { time: '06h', api: 125, db: 48, cdn: 19 },
  { time: '08h', api: 145, db: 55, cdn: 22 }, { time: '10h', api: 210, db: 78, cdn: 25 },
  { time: '12h', api: 195, db: 72, cdn: 24 }, { time: '14h', api: 185, db: 68, cdn: 23 },
  { time: '16h', api: 175, db: 65, cdn: 21 }, { time: '18h', api: 160, db: 60, cdn: 20 },
  { time: '20h', api: 140, db: 52, cdn: 19 }, { time: '22h', api: 125, db: 46, cdn: 17 },
];

const errorRateData = [
  { time: '00h', rate: 0.1 }, { time: '02h', rate: 0.08 }, { time: '04h', rate: 0.12 },
  { time: '06h', rate: 0.09 }, { time: '08h', rate: 0.15 }, { time: '10h', rate: 0.42 },
  { time: '12h', rate: 0.28 }, { time: '14h', rate: 0.18 }, { time: '16h', rate: 0.14 },
  { time: '18h', rate: 0.11 }, { time: '20h', rate: 0.09 }, { time: '22h', rate: 0.08 },
];

const services = [
  { name: 'API Gateway', status: 'operational', latency: '142ms', uptime: '99.98%', requests: '12.4K/min' },
  { name: 'Auth Service', status: 'operational', latency: '85ms', uptime: '99.99%', requests: '3.2K/min' },
  { name: 'Database (Primary)', status: 'operational', latency: '48ms', uptime: '99.97%', requests: '8.1K/min' },
  { name: 'Database (Replica)', status: 'operational', latency: '52ms', uptime: '99.95%', requests: '4.5K/min' },
  { name: 'File Storage (CDN)', status: 'operational', latency: '22ms', uptime: '100%', requests: '6.8K/min' },
  { name: 'AI Service (OpenAI)', status: 'degraded', latency: '1240ms', uptime: '98.2%', requests: '450/min' },
  { name: 'Email Service', status: 'operational', latency: '320ms', uptime: '99.9%', requests: '180/min' },
  { name: 'WebSocket Server', status: 'operational', latency: '18ms', uptime: '99.96%', requests: '2.1K/min' },
  { name: 'Teleconsult Media', status: 'operational', latency: '95ms', uptime: '99.94%', requests: '320/min' },
];

const slaMetrics = [
  { metric: 'Disponibilité globale', target: '99.9%', current: '99.97%', status: 'met', period: 'Août 2026' },
  { metric: 'Temps de réponse API (P95)', target: '< 500ms', current: '210ms', status: 'met', period: 'Août 2026' },
  { metric: 'Taux d\'erreur', target: '< 0.5%', current: '0.18%', status: 'met', period: 'Août 2026' },
  { metric: 'RTO (Recovery Time Objective)', target: '< 4h', current: '1h 12min', status: 'met', period: 'Dernier incident' },
  { metric: 'RPO (Recovery Point Objective)', target: '< 1h', current: '15min', status: 'met', period: 'Dernier incident' },
  { metric: 'Disponibilité téléconsultation', target: '99.5%', current: '99.94%', status: 'met', period: 'Août 2026' },
];

const activeAlerts = [
  { id: 'ALT-001', service: 'AI Service (OpenAI)', severity: 'warning', message: 'Latence élevée détectée — P95 > 1200ms depuis 45 min', since: 'Il y a 45 min', acknowledged: false },
  { id: 'ALT-002', service: 'Database (Primary)', severity: 'info', message: 'Utilisation CPU à 78% — seuil d\'alerte à 80%', since: 'Il y a 12 min', acknowledged: true },
];

export default function PlatformMonitoringContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'Squares2X2Icon' },
    { key: 'uptime', label: 'Disponibilité', icon: 'CheckCircleIcon' },
    { key: 'performance', label: 'Performance', icon: 'BoltIcon' },
    { key: 'errors', label: 'Erreurs', icon: 'ExclamationTriangleIcon' },
    { key: 'sla', label: 'SLA', icon: 'ShieldCheckIcon' },
    { key: 'alerts', label: 'Alertes', icon: 'BellIcon' },
  ];

  const statusConfig = {
    operational: { label: 'Opérationnel', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    degraded: { label: 'Dégradé', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    down: { label: 'Hors service', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Monitoring Plateforme</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Surveillance technique — Disponibilité, performance, erreurs et SLA</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Tous les systèmes opérationnels
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted text-foreground">
              <Icon name="ArrowPathIcon" size={15} /> Actualiser
            </button>
          </div>
        </div>

        <div className="flex gap-1 mt-5 border-b border-border -mb-5">
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
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Disponibilité (30j)', value: '99.97%', sub: 'SLA cible : 99.9%', icon: 'CheckCircleIcon', color: 'text-emerald-600', bg: 'bg-emerald-50', good: true },
                { label: 'Latence API (P95)', value: '210ms', sub: 'SLA cible : < 500ms', icon: 'BoltIcon', color: 'text-blue-600', bg: 'bg-blue-50', good: true },
                { label: 'Taux d\'erreur', value: '0.18%', sub: 'SLA cible : < 0.5%', icon: 'ExclamationTriangleIcon', color: 'text-emerald-600', bg: 'bg-emerald-50', good: true },
                { label: 'Alertes actives', value: '2', sub: '1 warning, 1 info', icon: 'BellIcon', color: 'text-amber-600', bg: 'bg-amber-50', good: false },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <Icon name={kpi.icon} size={18} className={kpi.color} />
                    </div>
                    <span className={`text-xs font-medium ${kpi.good ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {kpi.good ? '✓ SLA respecté' : '⚠ Attention'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Services status */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">État des services</h2>
              </div>
              <div className="divide-y divide-border">
                {services.map(svc => {
                  const sc = statusConfig[svc.status as keyof typeof statusConfig];
                  return (
                    <div key={svc.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                        <span className="text-sm font-medium text-foreground">{svc.name}</span>
                      </div>
                      <div className="flex items-center gap-8 text-xs text-muted-foreground">
                        <div className="text-right">
                          <p className="text-foreground font-medium">{svc.latency}</p>
                          <p>Latence</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">{svc.uptime}</p>
                          <p>Uptime</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">{svc.requests}</p>
                          <p>Requêtes</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active alerts */}
            {activeAlerts.length > 0 && (
              <div className="space-y-2">
                <h2 className="font-semibold text-foreground">Alertes actives</h2>
                {activeAlerts.map(alert => (
                  <div key={alert.id} className={`border rounded-xl p-4 flex items-start justify-between ${alert.severity === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-start gap-3">
                      <Icon name="ExclamationTriangleIcon" size={16} className={alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{alert.service}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.since}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.acknowledged && <button className="text-xs px-2 py-1 border border-border rounded-lg hover:bg-muted text-foreground">Acquitter</button>}
                      <button className="text-xs px-2 py-1 border border-border rounded-lg hover:bg-muted text-foreground">Détails</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Uptime Tab */}
        {activeTab === 'uptime' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Disponibilité — Aujourd'hui (par heure)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={uptimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis domain={[99, 100.1]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Disponibilité']} />
                  <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { period: 'Aujourd\'hui', uptime: '99.97%', downtime: '52 sec', incidents: 0 },
                { period: '7 derniers jours', uptime: '99.95%', downtime: '5 min 15 sec', incidents: 1 },
                { period: '30 derniers jours', uptime: '99.97%', downtime: '13 min 8 sec', incidents: 2 },
              ].map(p => (
                <div key={p.period} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground">{p.period}</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{p.uptime}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Indisponibilité : {p.downtime}</span>
                    <span>Incidents : {p.incidents}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Temps de réponse — Aujourd'hui (ms)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="ms" />
                  <Tooltip />
                  <Line type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} dot={false} name="API Gateway" />
                  <Line type="monotone" dataKey="db" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Base de données" />
                  <Line type="monotone" dataKey="cdn" stroke="#10b981" strokeWidth={2} dot={false} name="CDN" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> API Gateway</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-500 inline-block" /> Base de données</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> CDN</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'API P50', value: '142ms' }, { label: 'API P95', value: '210ms' },
                { label: 'API P99', value: '380ms' }, { label: 'DB P95', value: '78ms' },
              ].map(m => (
                <div key={m.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Taux d'erreur — Aujourd'hui (%)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={errorRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Taux d\'erreur']} />
                  <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Erreurs récentes</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  { code: '503', service: 'AI Service', message: 'Service Unavailable — OpenAI timeout', count: 12, last: 'Il y a 8 min' },
                  { code: '429', service: 'API Gateway', message: 'Too Many Requests — rate limit atteint', count: 5, last: 'Il y a 22 min' },
                  { code: '500', service: 'Auth Service', message: 'Internal Server Error — token validation', count: 2, last: 'Il y a 1h' },
                  { code: '404', service: 'File Storage', message: 'Not Found — ressource supprimée', count: 8, last: 'Il y a 2h' },
                ].map((err, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${err.code.startsWith('5') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{err.code}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{err.message}</p>
                        <p className="text-xs text-muted-foreground">{err.service}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">{err.count}x</p>
                      <p>{err.last}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLA Tab */}
        {activeTab === 'sla' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Indicateurs SLA — Août 2026</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {['Métrique', 'Cible SLA', 'Valeur actuelle', 'Période', 'Statut'].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {slaMetrics.map(m => (
                    <tr key={m.metric} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-foreground">{m.metric}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground font-mono">{m.target}</td>
                      <td className="px-5 py-3 text-sm font-bold text-emerald-600 font-mono">{m.current}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{m.period}</td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                          <Icon name="CheckCircleIcon" size={14} className="text-emerald-500" />
                          Respecté
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Alertes & Incidents</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--primary)' }}>
                <Icon name="PlusIcon" size={14} /> Créer une alerte
              </button>
            </div>
            <div className="space-y-3">
              {[...activeAlerts, ...[
                { id: 'ALT-003', service: 'API Gateway', severity: 'resolved', message: 'Latence élevée résolue — retour à la normale', since: 'Résolu il y a 3h', acknowledged: true },
                { id: 'ALT-004', service: 'Database (Primary)', severity: 'resolved', message: 'Connexions max atteintes — pool étendu', since: 'Résolu il y a 1j', acknowledged: true },
              ]].map(alert => {
                const colors = { warning: 'bg-amber-50 border-amber-200 text-amber-600', info: 'bg-blue-50 border-blue-200 text-blue-600', resolved: 'bg-slate-50 border-slate-200 text-slate-500' };
                const c = colors[alert.severity as keyof typeof colors] || colors.info;
                return (
                  <div key={alert.id} className={`border rounded-xl p-4 ${c.split(' ').slice(0, 2).join(' ')}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon name={alert.severity === 'resolved' ? 'CheckCircleIcon' : 'ExclamationTriangleIcon'} size={16} className={c.split(' ')[2]} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{alert.service}</p>
                            <span className="text-xs bg-white/70 px-2 py-0.5 rounded-full border">{alert.id}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{alert.since}</p>
                        </div>
                      </div>
                      {!alert.acknowledged && alert.severity !== 'resolved' && (
                        <button className="text-xs px-2 py-1 border border-border rounded-lg hover:bg-muted text-foreground">Acquitter</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
