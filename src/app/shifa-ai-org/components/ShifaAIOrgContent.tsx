'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tab = 'insights' | 'analytics' | 'alerts' | 'chat';

const tabs = [
  { id: 'insights' as Tab, label: 'Insights opérationnels', icon: 'LightBulbIcon' },
  { id: 'analytics' as Tab, label: 'Analyse IA', icon: 'ChartBarIcon' },
  { id: 'alerts' as Tab, label: 'Alertes intelligentes', icon: 'BellAlertIcon' },
  { id: 'chat' as Tab, label: 'Assistant IA', icon: 'CpuChipIcon' },
];

const insights = [
  { id: 1, title: 'Pic d\'activité détecté', desc: 'Les consultations du lundi matin sont 40% supérieures à la moyenne. Envisagez d\'ajouter un médecin en renfort.', type: 'optimization', icon: 'ChartBarIcon', color: 'var(--shifa-blue)', priority: 'high' },
  { id: 2, title: 'Taux d\'absentéisme élevé', desc: 'Le département Pédiatrie affiche 18% d\'absentéisme cette semaine. Vérifiez les plannings.', type: 'hr', icon: 'UsersIcon', color: '#f59e0b', priority: 'medium' },
  { id: 3, title: 'Stock médicaments critique', desc: 'Amoxicilline 500mg — stock restant pour 3 jours. Commande urgente recommandée.', type: 'supply', icon: 'ArchiveBoxIcon', color: '#f87171', priority: 'critical' },
  { id: 4, title: 'Opportunité de réduction des délais', desc: 'L\'analyse des flux montre que les délais d\'attente aux urgences peuvent être réduits de 22% en réorganisant le triage.', type: 'optimization', icon: 'ClockIcon', color: '#16a34a', priority: 'low' },
];

const analyticsItems = [
  { label: 'Efficacité opérationnelle', score: 78, trend: '+5%', color: 'var(--shifa-blue)' },
  { label: 'Satisfaction patient (IA)', score: 84, trend: '+2%', color: '#16a34a' },
  { label: 'Utilisation des ressources', score: 91, trend: '+8%', color: '#f59e0b' },
  { label: 'Conformité protocoles', score: 96, trend: '+1%', color: '#7c3aed' },
  { label: 'Prévision charge (7j)', score: 67, trend: '—', color: '#64748b' },
];

const alerts = [
  { id: 1, title: 'Rupture de stock imminente', desc: 'Amoxicilline 500mg — 3 jours restants', severity: 'critical', time: 'Il y a 10 min', read: false },
  { id: 2, title: 'Anomalie facturation détectée', desc: '12 actes non facturés cette semaine', severity: 'high', time: 'Il y a 1h', read: false },
  { id: 3, title: 'Pic de consultations prévu', desc: 'Lundi prochain: +35% vs moyenne', severity: 'medium', time: 'Il y a 2h', read: true },
  { id: 4, title: 'Maintenance équipement', desc: 'Scanner IRM — révision prévue dans 5 jours', severity: 'low', time: 'Il y a 4h', read: true },
  { id: 5, title: 'Rapport qualité disponible', desc: 'Rapport mensuel août 2025 généré', severity: 'info', time: 'Il y a 6h', read: true },
];

const severityConfig: Record<string, { label: string; bg: string; color: string }> = {
  critical: { label: 'Critique', bg: '#fee2e2', color: '#dc2626' },
  high: { label: 'Élevé', bg: '#fef3c7', color: '#d97706' },
  medium: { label: 'Moyen', bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
  low: { label: 'Faible', bg: '#f1f5f9', color: '#64748b' },
  info: { label: 'Info', bg: '#dcfce7', color: '#16a34a' },
};

interface Message { role: 'user' | 'assistant'; content: string; }

const quickPrompts = [
  'Analyse la performance de ce mois',
  'Quels départements sous-performent ?',
  'Prévisions pour la semaine prochaine',
  'Optimiser les plannings infirmiers',
];

export default function ShifaAIOrgContent() {
  const [activeTab, setActiveTab] = useState<Tab>('insights');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis SHIFA AI Organisation. Je peux analyser les données opérationnelles de votre établissement, identifier des tendances et vous proposer des optimisations. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Tu es SHIFA AI Organisation, un assistant IA spécialisé dans l\'analyse opérationnelle des établissements de santé. Tu fournis des insights sur la performance, les ressources humaines, les finances et la qualité. Tu ne donnes jamais accès à des données médicales individuelles. Réponds en français, de manière concise et actionnable.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || data?.content || 'Je n\'ai pas pu générer une réponse.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
          <Icon name="CpuChipIcon" size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>SHIFA AI Organisation</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Intelligence artificielle opérationnelle — CHU Saint-Louis</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          IA active
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

      {/* Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map(ins => {
            const priorityConfig: Record<string, { bg: string; color: string }> = {
              critical: { bg: '#fee2e2', color: '#dc2626' },
              high: { bg: '#fef3c7', color: '#d97706' },
              medium: { bg: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' },
              low: { bg: '#dcfce7', color: '#16a34a' },
            };
            const pc = priorityConfig[ins.priority];
            return (
              <div key={ins.id} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${ins.color}18` }}>
                    <Icon name={ins.icon as any} size={20} style={{ color: ins.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{ins.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pc.bg, color: pc.color }}>
                        {ins.priority === 'critical' ? 'Critique' : ins.priority === 'high' ? 'Élevé' : ins.priority === 'medium' ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{ins.desc}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>Agir</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>Ignorer</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Scores IA — Performance organisationnelle</h3>
            <div className="space-y-4">
              {analyticsItems.map(a => (
                <div key={a.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ color: 'var(--foreground)' }}>{a.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.trend}</span>
                      <span className="text-sm font-bold" style={{ color: a.color }}>{a.score}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${a.score}%`, backgroundColor: a.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)', color: 'var(--muted-foreground)' }}>
            <Icon name="InformationCircleIcon" size={14} className="inline mr-1.5" style={{ color: 'var(--shifa-blue)' }} />
            Ces scores sont calculés par SHIFA AI à partir de données agrégées et anonymisées. Aucune donnée médicale individuelle n'est utilisée.
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map(a => {
            const sc = severityConfig[a.severity];
            return (
              <div key={a.id} className={`rounded-2xl border p-4 flex items-start gap-4 transition-opacity ${a.read ? 'opacity-70' : ''}`}
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                {!a.read && <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: sc.color }} />}
                {a.read && <div className="w-2 h-2 mt-1.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{a.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{a.desc}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chat */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', height: '520px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm`}
                  style={m.role === 'user'
                    ? { backgroundColor: 'var(--shifa-blue)', color: '#fff', borderBottomRightRadius: '4px' }
                    : { backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderBottomLeftRadius: '4px' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--muted-foreground)', animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map(q => (
                <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1 rounded-full text-xs border transition-colors hover:bg-muted" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>{q}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Posez une question sur votre organisation..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 transition-opacity" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                <Icon name="PaperAirplaneIcon" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
