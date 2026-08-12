'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const radarData = [
  { subject: 'Mortalité', A: 72, fullMark: 100 },
  { subject: 'Couverture', A: 85, fullMark: 100 },
  { subject: 'Vaccination', A: 91, fullMark: 100 },
  { subject: 'Maternité', A: 68, fullMark: 100 },
  { subject: 'Nutrition', A: 77, fullMark: 100 },
  { subject: 'Accès soins', A: 63, fullMark: 100 },
];

const claimsData = [
  { month: 'Jan', soumis: 1240, approuvés: 1100, rejetés: 140 },
  { month: 'Fév', soumis: 1380, approuvés: 1250, rejetés: 130 },
  { month: 'Mar', soumis: 1520, approuvés: 1400, rejetés: 120 },
  { month: 'Avr', soumis: 1290, approuvés: 1180, rejetés: 110 },
  { month: 'Mai', soumis: 1650, approuvés: 1510, rejetés: 140 },
  { month: 'Jun', soumis: 1780, approuvés: 1640, rejetés: 140 },
];

const insights = [
  { title: 'Pic épidémique détecté', desc: 'Augmentation de 34% des cas de paludisme dans la région de Thiès — 3 dernières semaines.', severity: 'high', icon: 'ExclamationTriangleIcon', color: '#dc2626' },
  { title: 'Taux de remboursement optimal', desc: 'Le taux moyen de remboursement des actes ambulatoires est de 87.4%, au-dessus de la cible nationale (85%).', severity: 'good', icon: 'CheckCircleIcon', color: '#16a34a' },
  { title: 'Sous-couverture identifiée', desc: '12 districts ruraux présentent un taux de couverture vaccinale inférieur à 60% — action recommandée.', severity: 'medium', icon: 'InformationCircleIcon', color: '#d97706' },
  { title: 'Fraude potentielle signalée', desc: '3 prestataires présentent des anomalies de facturation détectées par l\'IA — audit recommandé.', severity: 'high', icon: 'ShieldExclamationIcon', color: '#7c3aed' },
];

interface Message { role: 'user' | 'assistant'; content: string; }

const QUICK_PROMPTS = [
  'Analyse la couverture vaccinale par région',
  'Quels sont les indicateurs de mortalité maternelle ?',
  'Synthèse des remboursements du trimestre',
  'Détecte les anomalies de facturation',
];

export default function ShifaAIInstitutionContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour. Je suis SHIFA AI Institution — votre assistant d\'analyse agrégée. Je peux analyser les données de santé publique, les indicateurs épidémiologiques, les flux de remboursement et détecter des anomalies sur l\'ensemble du système de santé autorisé. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Tu es SHIFA AI Institution, un assistant d\'analyse agrégée pour les ministères de la santé et les assureurs. Tu analyses des données épidémiologiques, des indicateurs de santé publique, des flux de remboursement et détectes des anomalies. Réponds en français de manière précise et professionnelle.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.message || 'Analyse en cours...' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Tableau de bord', 'Indicateurs santé', 'Remboursements', 'Assistant IA'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
            <Icon name="CpuChipIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>SHIFA AI Institution</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Analyse agrégée autorisée · Ministères & Assureurs</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>● Données anonymisées</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#ede9fe', color: '#7c3aed' }}>Accès institutionnel</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2"
              style={{ borderBottomColor: activeTab === i ? 'var(--primary)' : 'transparent', color: activeTab === i ? 'var(--primary)' : 'var(--muted-foreground)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Tab 0: Dashboard */}
        {activeTab === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Établissements connectés', value: '1 247', icon: 'BuildingOffice2Icon', color: '#2563eb' },
                { label: 'Patients couverts', value: '4.2M', icon: 'UsersIcon', color: '#16a34a' },
                { label: 'Actes analysés (mois)', value: '892K', icon: 'ClipboardDocumentListIcon', color: '#7c3aed' },
                { label: 'Alertes actives', value: '7', icon: 'BellAlertIcon', color: '#dc2626' },
              ].map(k => (
                <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={k.icon as any} size={16} style={{ color: k.color }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{k.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: k.color, fontFamily: 'DM Sans, sans-serif' }}>{k.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Alertes & Insights IA</h3>
              {insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: ins.color + '20' }}>
                    <Icon name={ins.icon as any} size={18} style={{ color: ins.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ins.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ins.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Indicateurs */}
        {activeTab === 1 && (
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <h3 className="font-semibold mb-4 text-sm">Score santé publique (radar)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {radarData.map(r => (
                <div key={r.subject} className="p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{r.subject}</span>
                    <span className="text-sm font-bold" style={{ color: r.A >= 80 ? '#16a34a' : r.A >= 65 ? '#d97706' : '#dc2626' }}>{r.A}/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--muted)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${r.A}%`, backgroundColor: r.A >= 80 ? '#16a34a' : r.A >= 65 ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Remboursements */}
        {activeTab === 2 && (
          <div className="rounded-xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <h3 className="font-semibold mb-4 text-sm">Flux de remboursements (6 mois)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={claimsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="soumis" fill="#94a3b8" radius={[3, 3, 0, 0]} name="Soumis" />
                <Bar dataKey="approuvés" fill="#16a34a" radius={[3, 3, 0, 0]} name="Approuvés" />
                <Bar dataKey="rejetés" fill="#dc2626" radius={[3, 3, 0, 0]} name="Rejetés" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 3: AI Chat */}
        {activeTab === 3 && (
          <div className="flex flex-col h-[520px] rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                <Icon name="CpuChipIcon" size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm">SHIFA AI Institution</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>En ligne</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: 'var(--background)' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'text-white' : ''}`}
                    style={{ backgroundColor: m.role === 'user' ? 'var(--primary)' : 'var(--card)', border: m.role === 'assistant' ? '1px solid var(--border)' : 'none' }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl border text-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <span className="animate-pulse">Analyse en cours...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="px-4 py-2 border-t flex flex-wrap gap-1.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)} className="text-xs px-2.5 py-1 rounded-full border hover:bg-muted transition-colors" style={{ borderColor: 'var(--border)' }}>{p}</button>
              ))}
            </div>
            <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Posez une question d'analyse institutionnelle..."
                className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                <Icon name="PaperAirplaneIcon" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
