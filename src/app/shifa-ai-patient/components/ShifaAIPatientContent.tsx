'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type TopicKey = 'general' | 'prevention' | 'appointment' | 'results' | 'medication' | 'emergency';

const topics: { key: TopicKey; label: string; icon: string; color: string; bg: string }[] = [
  { key: 'general', label: 'Santé générale', icon: 'HeartIcon', color: 'var(--shifa-blue)', bg: 'rgba(0,102,255,0.08)' },
  { key: 'prevention', label: 'Prévention', icon: 'ShieldCheckIcon', color: 'var(--shifa-green)', bg: 'rgba(16,185,129,0.08)' },
  { key: 'appointment', label: 'Préparer un RDV', icon: 'CalendarDaysIcon', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { key: 'results', label: 'Comprendre mes résultats', icon: 'BeakerIcon', color: 'var(--shifa-amber)', bg: 'rgba(245,158,11,0.08)' },
  { key: 'medication', label: 'Médicaments', icon: 'ArchiveBoxIcon', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
  { key: 'emergency', label: 'Urgences', icon: 'ExclamationTriangleIcon', color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
];

const quickPrompts: Record<TopicKey, string[]> = {
  general: ['Quels sont les signes d\'une bonne santé ?', 'Comment améliorer mon sommeil ?', 'Quand consulter un médecin ?'],
  prevention: ['Quels vaccins sont recommandés pour mon âge ?', 'Comment prévenir le diabète de type 2 ?', 'Conseils pour arrêter de fumer'],
  appointment: ['Comment me préparer pour une prise de sang ?', 'Quelles informations apporter à ma consultation ?', 'Comment décrire mes symptômes au médecin ?'],
  results: ['Comment lire un bilan sanguin ?', 'Que signifie un taux de cholestérol élevé ?', 'Qu\'est-ce qu\'une glycémie normale ?'],
  medication: ['Comment prendre un antibiotique correctement ?', 'Quels médicaments ne pas mélanger ?', 'Que faire si j\'oublie une dose ?'],
  emergency: ['Quels sont les signes d\'un AVC ?', 'Comment réagir face à une crise cardiaque ?', 'Quand appeler le 15 ?'],
};

const initialMessages: Message[] = [
  {
    id: 'init-1',
    role: 'assistant',
    content: 'Bonjour ! Je suis SHIFA AI, votre assistant santé personnel. Je suis là pour vous aider à mieux comprendre votre santé, vous préparer à vos consultations et vous orienter vers les bons professionnels.\n\n⚠️ **Important** : Je fournis des informations générales de santé. Je ne remplace pas un avis médical professionnel. En cas d\'urgence, contactez le 15 ou rendez-vous aux urgences.',
    timestamp: 'Maintenant',
  },
];

const disclaimer = '⚠️ SHIFA AI fournit des informations générales de santé uniquement. Ces informations ne constituent pas un diagnostic médical et ne remplacent pas l\'avis d\'un professionnel de santé qualifié.';

export default function ShifaAIPatientContent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [activeTopic, setActiveTopic] = useState<TopicKey>('general');
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
              content: 'Tu es SHIFA AI, un assistant santé pour les patients. Tu fournis des informations générales de santé en français, de manière claire et bienveillante. Tu ne poses pas de diagnostic. Tu rappelles toujours de consulter un professionnel de santé pour tout problème médical. Tu ne donnes jamais d\'informations médicales personnelles sur d\'autres patients.',
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

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-screen-xl mx-auto px-4 lg:px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
          <Icon name="CpuChipIcon" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--shifa-dark)' }}>SHIFA AI — Assistant Patient</h1>
          <p className="text-xs" style={{ color: 'var(--shifa-muted)' }}>Informations générales de santé · Ne remplace pas un médecin</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--shifa-green)' }}>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          En ligne
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg px-4 py-2.5 mb-4 text-xs" style={{ background: 'rgba(245,158,11,0.08)', color: '#92400e', border: '1px solid rgba(245,158,11,0.2)' }}>
        {disclaimer}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Sidebar topics */}
        <div className="hidden lg:flex flex-col gap-2 w-52 shrink-0">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--shifa-muted)' }}>THÈMES</p>
          {topics.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTopic(t.key)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                background: activeTopic === t.key ? t.bg : 'var(--shifa-surface)',
                color: activeTopic === t.key ? t.color : 'var(--shifa-muted)',
                border: `1px solid ${activeTopic === t.key ? t.color + '40' : 'var(--shifa-border)'}`,
              }}
            >
              <Icon name={t.icon} className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}

          <div className="mt-4 rounded-xl p-3 border" style={{ background: 'var(--shifa-surface)', borderColor: 'var(--shifa-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--shifa-muted)' }}>SUGGESTIONS</p>
            <div className="space-y-1.5">
              {quickPrompts[activeTopic].map(p => (
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
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: msg.role === 'assistant' ? 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' : 'var(--shifa-green)' }}
                >
                  {msg.role === 'assistant' ? 'AI' : 'M'}
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>AI</div>
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
            {quickPrompts[activeTopic].map(p => (
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
                placeholder="Posez votre question de santé..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--shifa-border)', background: 'var(--shifa-bg)', color: 'var(--shifa-dark)' }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity"
                style={{ background: 'var(--shifa-blue)', opacity: !input.trim() || isLoading ? 0.5 : 1 }}
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
