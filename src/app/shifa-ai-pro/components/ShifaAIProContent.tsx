'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type ToolKey = 'clinical-notes' | 'summary' | 'differential' | 'prescription' | 'coding' | 'letter';

const tools: { key: ToolKey; label: string; icon: string; color: string; bg: string; description: string }[] = [
  { key: 'clinical-notes', label: 'Notes cliniques', icon: 'ClipboardDocumentListIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)', description: 'Structurer et rédiger des notes de consultation' },
  { key: 'summary', label: 'Synthèse dossier', icon: 'DocumentTextIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)', description: 'Résumer le dossier patient en points clés' },
  { key: 'differential', label: 'Diagnostics différentiels', icon: 'MagnifyingGlassCircleIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', description: 'Aide à la réflexion diagnostique' },
  { key: 'prescription', label: 'Aide à la prescription', icon: 'DocumentCheckIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)', description: 'Vérification interactions et posologies' },
  { key: 'coding', label: 'Codage CIM-10', icon: 'TagIcon', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', description: 'Suggestion de codes diagnostics' },
  { key: 'letter', label: 'Courrier médical', icon: 'EnvelopeIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', description: 'Rédaction de courriers et comptes-rendus' },
];

const quickPrompts: Record<ToolKey, string[]> = {
  'clinical-notes': ['Structurer une note de consultation pour HTA', 'Rédiger un examen clinique cardiaque', 'Note de suivi diabète type 2'],
  'summary': ['Résumer un dossier de patient diabétique', 'Points clés d\'un suivi cardiologique', 'Synthèse antécédents chirurgicaux'],
  'differential': ['Diagnostics différentiels pour douleur thoracique', 'Causes de céphalées chroniques', 'Dyspnée d\'effort chez adulte 50 ans'],
  'prescription': ['Vérifier interactions amoxicilline + ibuprofène', 'Posologie metformine insuffisance rénale', 'Adaptation anticoagulant sujet âgé'],
  'coding': ['Code CIM-10 pour hypertension essentielle', 'Coder un diabète type 2 avec complications', 'Code pour fracture du poignet'],
  'letter': ['Courrier d\'adressage en cardiologie', 'Compte-rendu de consultation initiale', 'Lettre de sortie d\'hospitalisation'],
};

const initialMessages: Message[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content: 'Bonjour Docteur. Je suis SHIFA AI Clinical, votre assistant clinique professionnel.\n\nJe peux vous aider à :\n• Structurer vos notes cliniques\n• Générer des synthèses de dossier\n• Explorer des diagnostics différentiels\n• Vérifier des interactions médicamenteuses\n• Coder vos diagnostics (CIM-10)\n• Rédiger des courriers médicaux\n\n⚠️ **Rappel** : Mes suggestions sont des aides à la décision. Le jugement clinique final vous appartient. Je n\'ai pas accès aux données réelles de vos patients.',
    timestamp: 'Maintenant',
  },
];

export default function ShifaAIProContent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [activeTool, setActiveTool] = useState<ToolKey>('clinical-notes');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: 'Maintenant' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Tu es SHIFA AI Clinical, un assistant clinique pour les professionnels de santé. Tu réponds en français, de manière précise et professionnelle. Tu aides avec : la rédaction de notes cliniques, les synthèses de dossier, les diagnostics différentiels, les vérifications d'interactions médicamenteuses, le codage CIM-10, et la rédaction de courriers médicaux. Tu rappelles toujours que tes suggestions sont des aides à la décision et que le jugement clinique final appartient au médecin. Tu ne génères jamais de données patient réelles. Mode actuel : ${tools.find(t => t.key === activeTool)?.label}.`,
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
        }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Je suis désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.',
        timestamp: 'Maintenant',
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: 'Une erreur est survenue. Veuillez réessayer.', timestamp: 'Maintenant' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTool_ = tools.find(t => t.key === activeTool)!;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-screen-xl mx-auto px-4 lg:px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)' }}>
          <Icon name="CpuChipIcon" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA AI Clinical — Assistant Professionnel</h1>
          <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Aide à la décision clinique · Suggestions uniquement · Jugement médical requis</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#7c3aed' }}></span>
          Mode Pro
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-2.5 mb-4 text-xs" style={{ background: 'rgba(139,92,246,0.06)', color: '#5b21b6', border: '1px solid rgba(139,92,246,0.2)' }}>
        ⚠️ SHIFA AI Clinical est un outil d'aide à la décision. Ses suggestions ne remplacent pas le jugement clinique du professionnel de santé. Aucune donnée patient réelle n'est utilisée.
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar tools */}
        <div className="hidden lg:flex flex-col gap-2 w-56 shrink-0">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--shifa-muted)' }}>OUTILS CLINIQUES</p>
          {tools.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTool(t.key)}
              className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: activeTool === t.key ? t.bg : 'var(--shifa-surface)',
                border: `1px solid ${activeTool === t.key ? t.color + '40' : 'var(--shifa-border)'}`,
              }}
            >
              <Icon name={t.icon} className="w-4 h-4 mt-0.5 shrink-0" style={{ color: activeTool === t.key ? t.color : 'var(--shifa-muted)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: activeTool === t.key ? t.color : 'var(--shifa-dark)' }}>{t.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--shifa-muted)' }}>{t.description}</p>
              </div>
            </button>
          ))}

          <div className="mt-3 rounded-xl p-3 border" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--shifa-muted)' }}>EXEMPLES</p>
            <div className="space-y-1.5">
              {quickPrompts[activeTool].map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: 'var(--shifa-dark)' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-col flex-1 rounded-2xl border overflow-hidden" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
          {/* Active tool indicator */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'var(--shifa-border)', background: activeTool_.bg }}>
            <Icon name={activeTool_.icon} className="w-4 h-4" style={{ color: activeTool_.color }} />
            <span className="text-sm font-medium" style={{ color: activeTool_.color }}>Mode : {activeTool_.label}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: msg.role === 'assistant' ? 'linear-gradient(135deg, #7c3aed, #0ea5e9)' : 'var(--shifa-blue)' }}
                >
                  {msg.role === 'assistant' ? 'AI' : 'Dr'}
                </div>
                <div
                  className="max-w-[75%] rounded-2xl px-4 py-3 text-sm"
                  style={{
                    background: msg.role === 'user' ? 'var(--shifa-blue)' : 'var(--shifa-bg)',
                    color: msg.role === 'user' ? '#fff' : 'var(--shifa-dark)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)' }}>AI</div>
                <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--shifa-bg)' }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--shifa-muted)', animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--shifa-muted)', animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--shifa-muted)', animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts mobile */}
          <div className="lg:hidden flex gap-2 px-4 py-2 overflow-x-auto border-t" style={{ borderColor: 'var(--shifa-border)' }}>
            {quickPrompts[activeTool].map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs border whitespace-nowrap"
                style={{ borderColor: 'var(--shifa-border)', color: 'var(--shifa-dark)', background: 'var(--shifa-bg)' }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--shifa-border)' }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder={`${activeTool_.label} — posez votre question clinique...`}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity"
                style={{ background: '#7c3aed', opacity: !input.trim() || isLoading ? 0.5 : 1 }}
              >
                <Icon name="PaperAirplaneIcon" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
