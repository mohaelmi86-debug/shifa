'use client';
import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';

type Tool = 'interactions' | 'substitutions' | 'dosage' | 'contraindications' | 'pregnancy' | 'renal';

interface Message { role: 'user' | 'assistant'; content: string; }

const toolConfig: Record<Tool, { label: string; icon: string; color: string; bg: string; prompt: string; description: string }> = {
  interactions: { label: 'Interactions médicamenteuses', icon: 'ExclamationTriangleIcon', color: 'text-red-600', bg: 'bg-red-50', prompt: 'Analyse les interactions médicamenteuses pour la liste de médicaments suivante et donne les risques cliniques :', description: 'Détection des interactions entre médicaments' },
  substitutions: { label: 'Substitutions & génériques', icon: 'ArrowsRightLeftIcon', color: 'text-blue-600', bg: 'bg-blue-50', prompt: 'Propose des substitutions génériques ou thérapeutiques équivalentes pour :', description: 'Alternatives génériques et équivalents thérapeutiques' },
  dosage: { label: 'Aide à la posologie', icon: 'CalculatorIcon', color: 'text-emerald-600', bg: 'bg-emerald-50', prompt: 'Donne la posologie recommandée, les ajustements selon l\'âge/poids/fonction rénale pour :', description: 'Calcul de doses et ajustements posologiques' },
  contraindications: { label: 'Contre-indications', icon: 'NoSymbolIcon', color: 'text-orange-600', bg: 'bg-orange-50', prompt: 'Liste les contre-indications absolues et relatives pour :', description: 'Contre-indications absolues et relatives' },
  pregnancy: { label: 'Grossesse & allaitement', icon: 'HeartIcon', color: 'text-pink-600', bg: 'bg-pink-50', prompt: 'Évalue la sécurité d\'emploi pendant la grossesse et l\'allaitement pour :', description: 'Sécurité en grossesse et allaitement' },
  renal: { label: 'Insuffisance rénale/hépatique', icon: 'BeakerIcon', color: 'text-purple-600', bg: 'bg-purple-50', prompt: 'Donne les ajustements de dose nécessaires en cas d\'insuffisance rénale ou hépatique pour :', description: 'Ajustements en insuffisance d\'organe' },
};

const quickExamples: Record<Tool, string[]> = {
  interactions: ['Metformine + Amlodipine + Aspirine', 'Warfarine + Amoxicilline', 'Methotrexate + AINS'],
  substitutions: ['Amlodipine 5mg', 'Oméprazole 20mg', 'Atorvastatine 40mg'],
  dosage: ['Amoxicilline — enfant 15 kg', 'Gentamicine — adulte 70 kg', 'Vancomycine — IRC stade 3'],
  contraindications: ['Metformine', 'Bêtabloquants', 'AINS'],
  pregnancy: ['Paracétamol', 'Ibuprofène', 'Amoxicilline'],
  renal: ['Metformine — DFG 45', 'Digoxine — IRC', 'Ciprofloxacine — hépatique'],
};

const interactionAlerts = [
  { drugs: ['Warfarine', 'Aspirine'], severity: 'majeure', risk: 'Risque hémorragique majeur — surveiller INR', action: 'Éviter ou monitorer étroitement' },
  { drugs: ['Metformine', 'Alcool'], severity: 'modérée', risk: 'Risque d\'acidose lactique augmenté', action: 'Déconseiller la consommation d\'alcool' },
  { drugs: ['AINS', 'IEC'], severity: 'modérée', risk: 'Réduction de l\'effet antihypertenseur, risque rénal', action: 'Surveiller la fonction rénale et la TA' },
];

export default function ShifaAIPharmacyContent() {
  const [activeTool, setActiveTool] = useState<Tool>('interactions');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, response: aiResponse } = useChat('GEMINI', 'gemini-2.5-flash', false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;
    const tool = toolConfig[activeTool];
    const fullPrompt = `${tool.prompt}\n\n${query}\n\nRéponds en français de manière structurée, claire et cliniquement précise. Utilise des sections avec des titres.`;
    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      await sendMessage([{ role: 'user', content: fullPrompt }]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur lors de la génération de la réponse. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const tool = toolConfig[activeTool];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Icon name="BeakerIcon" size={20} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">SHIFA AI Pharmacie</h1>
              <p className="text-xs text-muted-foreground">Assistant IA — Interactions, substitutions, posologie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              IA active
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — tools */}
        <div className="w-64 border-r border-border bg-card p-3 space-y-1 shrink-0 overflow-y-auto">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">OUTILS PHARMACIE</p>
          {(Object.entries(toolConfig) as [Tool, typeof toolConfig[Tool]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setActiveTool(key); setMessages([]); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${activeTool === key ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
            >
              <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                <Icon name={cfg.icon} size={15} className={cfg.color} />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight">{cfg.label}</p>
              </div>
            </button>
          ))}

          {/* Interaction alerts */}
          <div className="mt-4 pt-3 border-t border-border">
            <button onClick={() => setShowAlerts(v => !v)} className="w-full flex items-center justify-between px-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">ALERTES INTERACTIONS</p>
              <Icon name={showAlerts ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={13} className="text-muted-foreground" />
            </button>
            {showAlerts && (
              <div className="mt-2 space-y-2">
                {interactionAlerts.map((alert, i) => (
                  <div key={i} className={`p-2 rounded-lg text-xs ${alert.severity === 'majeure' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <p className="font-semibold text-foreground">{alert.drugs.join(' + ')}</p>
                    <p className={`font-medium mt-0.5 ${alert.severity === 'majeure' ? 'text-red-700' : 'text-amber-700'}`}>{alert.severity}</p>
                    <p className="text-muted-foreground mt-0.5">{alert.risk}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tool header */}
          <div className={`px-5 py-3 border-b border-border ${tool.bg} shrink-0`}>
            <div className="flex items-center gap-2">
              <Icon name={tool.icon} size={16} className={tool.color} />
              <span className="font-semibold text-foreground text-sm">{tool.label}</span>
              <span className="text-xs text-muted-foreground">— {tool.description}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon name={tool.icon} size={28} className={tool.color} />
                </div>
                <h3 className="font-semibold text-foreground">{tool.label}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{tool.description}</p>
                <div className="mt-5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">EXEMPLES RAPIDES</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickExamples[activeTool].map(ex => (
                      <button key={ex} onClick={() => handleSend(ex)} className="text-xs bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-full border border-border transition-colors">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-full ${tool.bg} flex items-center justify-center shrink-0 mr-2 mt-0.5`}>
                    <Icon name={tool.icon} size={14} className={tool.color} />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-card border border-border text-foreground rounded-bl-sm'}`} style={msg.role === 'user' ? { background: 'var(--primary)' } : {}}>
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className={`w-7 h-7 rounded-full ${tool.bg} flex items-center justify-center shrink-0 mr-2`}>
                  <Icon name={tool.icon} size={14} className={tool.color} />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-5 py-2 bg-amber-50 border-t border-amber-200 shrink-0">
            <p className="text-xs text-amber-700 flex items-center gap-1.5">
              <Icon name="ExclamationTriangleIcon" size={13} />
              Outil d'aide à la décision — Ne remplace pas le jugement clinique du pharmacien ou du médecin
            </p>
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-border bg-card shrink-0">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Ex: ${quickExamples[activeTool][0]}`}
                className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 transition-opacity"
                style={{ background: 'var(--primary)' }}
              >
                <Icon name="PaperAirplaneIcon" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
