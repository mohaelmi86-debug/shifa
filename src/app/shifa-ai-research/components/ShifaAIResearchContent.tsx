'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

type Tool = 'literature' | 'protocol' | 'statistics' | 'cohort' | 'ethics' | 'report';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ResearchTool {
  key: Tool;
  label: string;
  icon: string;
  description: string;
  prompts: string[];
}

const RESEARCH_TOOLS: ResearchTool[] = [
  {
    key: 'literature',
    label: 'Revue de littérature',
    icon: 'BookOpenIcon',
    description: 'Synthèse bibliographique, analyse d\'articles, identification de lacunes',
    prompts: ['Synthétiser les études sur le paludisme en Afrique subsaharienne', 'Identifier les lacunes dans la recherche sur la tuberculose résistante', 'Analyser les méta-analyses sur l\'efficacité des vaccins ARNm'],
  },
  {
    key: 'protocol',
    label: 'Protocole de recherche',
    icon: 'ClipboardDocumentListIcon',
    description: 'Aide à la rédaction de protocoles, critères d\'inclusion, méthodologie',
    prompts: ['Rédiger un protocole pour un essai clinique randomisé', 'Définir les critères d\'inclusion pour une étude de cohorte', 'Structurer une étude observationnelle prospective'],
  },
  {
    key: 'statistics',
    label: 'Analyse statistique',
    icon: 'ChartBarIcon',
    description: 'Choix des tests, interprétation des résultats, calcul de puissance',
    prompts: ['Choisir le test statistique adapté à mes données', 'Calculer la taille d\'échantillon nécessaire', 'Interpréter un odds ratio de 2.3 (IC 95% : 1.4–3.8)'],
  },
  {
    key: 'cohort',
    label: 'Gestion de cohorte',
    icon: 'UsersIcon',
    description: 'Suivi des participants, gestion des perdus de vue, analyse de survie',
    prompts: ['Stratégie pour réduire les perdus de vue dans une cohorte', 'Analyser les données de survie avec la méthode Kaplan-Meier', 'Gérer les données manquantes dans une étude longitudinale'],
  },
  {
    key: 'ethics',
    label: 'Éthique & Réglementation',
    icon: 'ShieldCheckIcon',
    description: 'Soumission comité d\'éthique, consentement éclairé, RGPD recherche',
    prompts: ['Rédiger un formulaire de consentement éclairé', 'Préparer un dossier pour le comité d\'éthique', 'Conformité RGPD pour les données de recherche clinique'],
  },
  {
    key: 'report',
    label: 'Rédaction scientifique',
    icon: 'DocumentTextIcon',
    description: 'Structure d\'article, abstract, discussion, réponse aux reviewers',
    prompts: ['Structurer la section Discussion d\'un article', 'Rédiger un abstract structuré pour une revue indexée', 'Répondre aux commentaires des reviewers'],
  },
];

const SYSTEM_PROMPT = `Tu es SHIFA AI Research, un assistant IA spécialisé pour les organisations de recherche en santé. 
Tu aides les chercheurs avec : la revue de littérature scientifique, la conception de protocoles de recherche, l'analyse statistique, la gestion de cohortes, les questions d'éthique et réglementation, et la rédaction scientifique.
Réponds en français, de manière précise et scientifiquement rigoureuse. Cite des méthodes reconnues et des références pertinentes quand c'est approprié.
Rappelle toujours que tes réponses sont des suggestions et ne remplacent pas l'expertise d'un biostatisticien ou d'un comité d'éthique.`;

export default function ShifaAIResearchContent() {
  const [activeTool, setActiveTool] = useState<Tool>('literature');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tool = RESEARCH_TOOLS.find(t => t.key === activeTool)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
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
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'assistant', content: 'Une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolChange = (key: Tool) => {
    setActiveTool(key);
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background: 'var(--background)' }}>
      {/* Left sidebar — tools */}
      <div className="w-64 shrink-0 border-r flex flex-col" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Icon name="BeakerIcon" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--foreground)', fontFamily: 'DM Sans, sans-serif' }}>SHIFA AI Research</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Assistant recherche</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide px-2 mb-2" style={{ color: 'var(--muted-foreground)' }}>Outils disponibles</p>
          {RESEARCH_TOOLS.map(t => (
            <button
              key={t.key}
              onClick={() => handleToolChange(t.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: activeTool === t.key ? 'var(--primary)' : 'transparent',
                color: activeTool === t.key ? '#fff' : 'var(--foreground)',
              }}
            >
              <Icon name={t.icon as any} size={16} />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl" style={{ background: '#fef9c3' }}>
            <p className="text-xs font-semibold" style={{ color: '#a16207' }}>⚠ Avertissement</p>
            <p className="text-xs mt-1" style={{ color: '#92400e' }}>
              Cet assistant ne remplace pas l'expertise d'un biostatisticien ou d'un comité d'éthique.
            </p>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Tool header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--muted)' }}>
              <Icon name={tool.icon as any} size={20} style={{ color: 'var(--foreground)' }} />
            </div>
            <div>
              <p className="font-bold" style={{ color: 'var(--foreground)' }}>{tool.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{tool.description}</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <Icon name="TrashIcon" size={14} />
            Effacer
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--muted)' }}>
                  <Icon name={tool.icon as any} size={28} style={{ color: 'var(--muted-foreground)' }} />
                </div>
                <p className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>{tool.label}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{tool.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted-foreground)' }}>Suggestions</p>
                <div className="space-y-2">
                  {tool.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="w-full text-left p-3 rounded-xl border text-sm transition-all hover:shadow-sm"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary)' }}>
                  <Icon name="CpuChipIcon" size={14} className="text-white" />
                </div>
              )}
              <div
                className="max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--card)',
                  color: msg.role === 'user' ? '#fff' : 'var(--foreground)',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: msg.role === 'assistant' ? `1px solid var(--border)` : 'none',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--primary)' }}>
                <Icon name="CpuChipIcon" size={14} className="text-white" />
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--muted-foreground)', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex gap-3 items-end">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } }}
              placeholder={`Posez votre question sur ${tool.label.toLowerCase()}...`}
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl border text-sm resize-none"
              style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-xl text-white transition-opacity"
              style={{ background: 'var(--primary)', opacity: !inputValue.trim() || isLoading ? 0.5 : 1 }}
            >
              <Icon name="PaperAirplaneIcon" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
