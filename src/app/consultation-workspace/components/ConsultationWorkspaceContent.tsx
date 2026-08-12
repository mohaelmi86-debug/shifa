'use client';
import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';

type EncounterSection = 'motif' | 'anamnese' | 'constantes' | 'examen' | 'evaluation' | 'prescription' | 'documents' | 'plan';

interface VitalSign {
  label: string;
  value: string;
  unit: string;
  normal: boolean;
}

const sections: { key: EncounterSection; label: string; icon: string }[] = [
  { key: 'motif', label: 'Motif', icon: 'ChatBubbleBottomCenterTextIcon' },
  { key: 'anamnese', label: 'Anamnèse', icon: 'ClipboardDocumentListIcon' },
  { key: 'constantes', label: 'Constantes', icon: 'HeartIcon' },
  { key: 'examen', label: 'Examen clinique', icon: 'MagnifyingGlassCircleIcon' },
  { key: 'evaluation', label: 'Évaluation', icon: 'LightBulbIcon' },
  { key: 'prescription', label: 'Prescription', icon: 'DocumentCheckIcon' },
  { key: 'documents', label: 'Documents', icon: 'PaperClipIcon' },
  { key: 'plan', label: 'Plan de soins', icon: 'CalendarDaysIcon' },
];

const mockVitals: VitalSign[] = [
  { label: 'Tension artérielle', value: '128/82', unit: 'mmHg', normal: true },
  { label: 'Fréquence cardiaque', value: '78', unit: 'bpm', normal: true },
  { label: 'Température', value: '37.2', unit: '°C', normal: true },
  { label: 'SpO2', value: '98', unit: '%', normal: true },
  { label: 'Poids', value: '62', unit: 'kg', normal: true },
  { label: 'Taille', value: '165', unit: 'cm', normal: true },
];

interface PrescriptionLine {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

type AIMode = 'summary' | 'suggestions' | 'inconsistencies' | 'followup' | 'chat';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AI_MODES: { key: AIMode; label: string; icon: string; description: string }[] = [
  { key: 'summary', label: 'Résumé rencontre', icon: 'DocumentTextIcon', description: 'Synthèse automatique de la consultation' },
  { key: 'suggestions', label: 'Suggestions doc.', icon: 'PencilSquareIcon', description: 'Aide à la rédaction des notes cliniques' },
  { key: 'inconsistencies', label: 'Incohérences', icon: 'ExclamationTriangleIcon', description: 'Détection d\'incohérences cliniques' },
  { key: 'followup', label: 'Questions suivi', icon: 'QuestionMarkCircleIcon', description: 'Questions de suivi suggérées' },
  { key: 'chat', label: 'Assistance libre', icon: 'SparklesIcon', description: 'Posez une question clinique' },
];

export default function ConsultationWorkspaceContent() {
  const [activeSection, setActiveSection] = useState<EncounterSection>('motif');
  const [motif, setMotif] = useState('');
  const [anamnese, setAnamnese] = useState('');
  const [examen, setExamen] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitals, setVitals] = useState(mockVitals);
  const [prescriptions, setPrescriptions] = useState<PrescriptionLine[]>([
    { id: 'rx1', drug: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>('summary');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([]);
  const [lastAIResult, setLastAIResult] = useState<string>('');
  const [hasGeneratedForMode, setHasGeneratedForMode] = useState<Partial<Record<AIMode, string>>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4o', true);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  // Capture completed streaming response
  useEffect(() => {
    if (!isLoading && response) {
      setLastAIResult(response);
      if (aiMode === 'chat') {
        setChatHistory(prev => {
          // Avoid duplicate assistant messages
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.content === response) return prev;
          // Replace streaming placeholder if present
          if (last?.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: response }];
          }
          return [...prev, { role: 'assistant', content: response }];
        });
      } else {
        setHasGeneratedForMode(prev => ({ ...prev, [aiMode]: response }));
      }
    }
  }, [isLoading, response, aiMode]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, response]);

  const patient = {
    name: 'Aïcha Diallo',
    age: '33 ans',
    shifaId: 'SH-2-225-FR-2025-7K4D',
    dob: '12/03/1992',
    bloodType: 'O+',
    allergies: ['Pénicilline', 'AINS'],
    activeTreatments: ['Metformine 500mg', 'Vitamine D3'],
    avatar: 'AD',
  };

  const buildEncounterContext = () => {
    const parts: string[] = [];
    parts.push(`Patient: ${patient.name}, ${patient.age}`);
    parts.push(`Allergies: ${patient.allergies.join(', ')}`);
    parts.push(`Traitements actifs: ${patient.activeTreatments.join(', ')}`);
    if (motif) parts.push(`Motif: ${motif}`);
    if (anamnese) parts.push(`Anamnèse: ${anamnese}`);
    const vitalStr = vitals.map(v => `${v.label}: ${v.value} ${v.unit}`).join(', ');
    parts.push(`Constantes: ${vitalStr}`);
    if (examen) parts.push(`Examen clinique: ${examen}`);
    if (evaluation) parts.push(`Évaluation: ${evaluation}`);
    if (diagnosis) parts.push(`Diagnostic: ${diagnosis}`);
    const rxStr = prescriptions.filter(r => r.drug).map(r => `${r.drug} ${r.dosage} ${r.frequency} ${r.duration}`).join('; ');
    if (rxStr) parts.push(`Prescription: ${rxStr}`);
    return parts.join('\n');
  };

  const SYSTEM_PROMPT = `Tu es SHIFA AI, un assistant clinique IA intégré dans le système de santé SHIFA Health OS. 
Tu assistes les professionnels de santé en fournissant des suggestions documentaires, des résumés de consultation et un soutien à la décision clinique.
RÈGLES ABSOLUES:
- Tu ne poses JAMAIS de diagnostic définitif.
- Tu ne prescris JAMAIS de médicaments.
- Tu ne signes JAMAIS ni ne valides un acte clinique.
- Toutes tes réponses sont clairement étiquetées comme suggestions IA.
- Le professionnel de santé reste seul responsable de toutes les décisions cliniques.
- Réponds toujours en français.
- Sois concis, structuré et cliniquement pertinent.`;

  const handleGenerateAI = (mode: AIMode) => {
    const context = buildEncounterContext();
    let userPrompt = '';

    switch (mode) {
      case 'summary':
        userPrompt = `Voici les données de la consultation en cours:\n${context}\n\nGénère un résumé structuré de cette rencontre clinique en 3-5 points clés. Format: liste à puces courtes et précises.`;
        break;
      case 'suggestions':
        userPrompt = `Voici les données de la consultation:\n${context}\n\nSuggère des éléments à documenter ou à compléter dans les notes cliniques. Identifie les informations manquantes importantes. Format: liste à puces.`;
        break;
      case 'inconsistencies':
        userPrompt = `Voici les données de la consultation:\n${context}\n\nAnalyse ces données et identifie toute incohérence clinique potentielle, interaction médicamenteuse possible, ou point d'attention. Si aucune incohérence n'est détectée, indique-le clairement. Format: liste à puces avec niveau de priorité (⚠️ Attention / ℹ️ Information).`;
        break;
      case 'followup':
        userPrompt = `Voici les données de la consultation:\n${context}\n\nSuggère 4-6 questions de suivi pertinentes que le professionnel pourrait poser au patient pour compléter l'anamnèse ou le suivi. Format: liste numérotée.`;
        break;
      default:
        return;
    }

    setLastAIResult('');
    setHasGeneratedForMode(prev => ({ ...prev, [mode]: '' }));
    sendMessage([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], { max_completion_tokens: 600 });
  };

  const handleChatSend = () => {
    if (!chatInput.trim() || isLoading) return;
    const context = buildEncounterContext();
    const userMsg = chatInput.trim();
    setChatInput('');

    const newHistory: AIMessage[] = [...chatHistory, { role: 'user', content: userMsg }];
    setChatHistory(newHistory);

    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: `Contexte de la consultation:\n${context}` },
      ...newHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    sendMessage(apiMessages, { max_completion_tokens: 500 });
  };

  const handleModeChange = (mode: AIMode) => {
    setAiMode(mode);
    setLastAIResult(hasGeneratedForMode[mode] || '');
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: pro } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (pro) {
        const content = {
          motif,
          anamnese,
          vitals: vitals.map(v => ({ label: v.label, value: v.value, unit: v.unit })),
          examen,
          evaluation,
          diagnostic: diagnosis,
          medications: prescriptions.filter(rx => rx.drug).map(rx => ({
            drug: rx.drug, dosage: rx.dosage, frequency: rx.frequency, duration: rx.duration,
          })),
        };

        await supabase.from('health_records').insert({
          patient_id: null, // Would be set from appointment context
          professional_id: pro.id,
          record_type: 'consultation',
          title: motif || 'Consultation',
          content,
          is_signed: false,
          created_by: user.id,
        });
      }
    } catch (err: any) {
      console.log('Save draft error:', err.message);
    } finally {
      setIsSaving(false);
      setSavedDraft(true);
      setTimeout(() => setSavedDraft(false), 3000);
    }
  };

  const handleSign = async () => {
    setIsSigning(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: pro } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (pro) {
        const content = {
          motif,
          anamnese,
          vitals: vitals.map(v => ({ label: v.label, value: v.value, unit: v.unit })),
          examen,
          evaluation,
          diagnostic: diagnosis,
          medications: prescriptions.filter(rx => rx.drug).map(rx => ({
            drug: rx.drug, dosage: rx.dosage, frequency: rx.frequency, duration: rx.duration,
          })),
        };

        await supabase.from('health_records').insert({
          patient_id: null,
          professional_id: pro.id,
          record_type: 'consultation',
          title: motif || 'Consultation signée',
          content,
          is_signed: true,
          signed_at: new Date().toISOString(),
          signed_by: user.id,
          created_by: user.id,
        });

        // Also save prescription if medications present
        const meds = prescriptions.filter(rx => rx.drug);
        if (meds.length > 0) {
          await supabase.from('health_records').insert({
            patient_id: null,
            professional_id: pro.id,
            record_type: 'prescription',
            title: `Ordonnance — ${motif || 'Consultation'}`,
            content: { medications: meds },
            is_signed: true,
            signed_at: new Date().toISOString(),
            signed_by: user.id,
            created_by: user.id,
          });
        }
      }
    } catch (err: any) {
      console.log('Sign error:', err.message);
    } finally {
      setIsSigning(false);
      alert('Consultation signée et clôturée. Dossier mis à jour.');
    }
  };

  const addPrescriptionLine = () => {
    setPrescriptions(p => [...p, { id: `rx${Date.now()}`, drug: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removePrescriptionLine = (id: string) => {
    setPrescriptions(p => p.filter(rx => rx.id !== id));
  };

  const updatePrescription = (id: string, field: keyof PrescriptionLine, value: string) => {
    setPrescriptions(p => p.map(rx => rx.id === id ? { ...rx, [field]: value } : rx));
  };

  const updateVital = (index: number, value: string) => {
    setVitals(v => v.map((vital, i) => i === index ? { ...vital, value } : vital));
  };

  const currentModeConfig = AI_MODES.find(m => m.key === aiMode)!;
  const displayedResult = aiMode === 'chat' ? '' : (isLoading ? response : (hasGeneratedForMode[aiMode] || ''));

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Patient Header */}
      <div className="px-4 sm:px-6 py-4 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}>
                {patient.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{patient.name}</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{patient.age}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--shifa-blue)' }}>{patient.shifaId}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.allergies.map(a => (
                    <span key={a} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                      <Icon name="ExclamationTriangleIcon" size={11} />
                      {a}
                    </span>
                  ))}
                  {patient.activeTreatments.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(0,102,255,0.08)', color: 'var(--shifa-blue)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAI(!showAI)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all"
                style={{ backgroundColor: showAI ? 'rgba(0,242,195,0.1)' : 'var(--background)', borderColor: showAI ? 'var(--shifa-cyan)' : 'var(--border)', color: showAI ? 'var(--shifa-cyan)' : 'var(--muted-foreground)' }}
              >
                <Icon name="SparklesIcon" size={14} />
                SHIFA AI
              </button>
              {savedDraft && (
                <span className="flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                  <Icon name="CheckCircleIcon" size={14} />
                  Brouillon sauvegardé
                </span>
              )}
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-60"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {isSaving ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : <Icon name="CloudArrowUpIcon" size={14} />}
                Sauvegarder
              </button>
              <button
                onClick={handleSign}
                disabled={isSigning}
                className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
              >
                {isSigning ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : <Icon name="PencilSquareIcon" size={14} />}
                Signer & Clôturer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section nav */}
        <div className="hidden md:flex flex-col w-48 border-r overflow-y-auto py-3 px-2 shrink-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 text-left transition-all ${activeSection === s.key ? 'shadow-sm' : 'hover:bg-muted'}`}
              style={{
                backgroundColor: activeSection === s.key ? 'rgba(0,102,255,0.08)' : 'transparent',
                color: activeSection === s.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
              }}
            >
              <Icon name={s.icon as any} size={15} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            {/* Mobile section selector */}
            <div className="md:hidden flex overflow-x-auto gap-2 mb-5 pb-1">
              {sections.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0`}
                  style={{
                    backgroundColor: activeSection === s.key ? 'var(--shifa-blue)' : 'var(--muted)',
                    color: activeSection === s.key ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* SHIFA AI Panel — OpenAI powered */}
            {showAI && (
              <div className="rounded-2xl border mb-5 overflow-hidden" style={{ backgroundColor: 'rgba(0,242,195,0.03)', borderColor: 'rgba(0,242,195,0.2)' }}>
                {/* AI Panel Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,242,195,0.15)', backgroundColor: 'rgba(0,242,195,0.06)' }}>
                  <Icon name="SparklesIcon" size={16} style={{ color: 'var(--shifa-cyan)' } as any} />
                  <span className="text-sm font-bold" style={{ color: 'var(--shifa-cyan)' }}>SHIFA AI — Assistance clinique</span>
                  <span className="text-xs px-2 py-0.5 rounded-full ml-auto font-medium" style={{ backgroundColor: 'rgba(0,242,195,0.15)', color: 'var(--shifa-cyan)' }}>
                    Propulsé par OpenAI
                  </span>
                </div>

                {/* Mode selector */}
                <div className="flex overflow-x-auto gap-1.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,242,195,0.1)' }}>
                  {AI_MODES.map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => handleModeChange(mode.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                      style={{
                        backgroundColor: aiMode === mode.key ? 'rgba(0,242,195,0.15)' : 'var(--background)',
                        color: aiMode === mode.key ? 'var(--shifa-cyan)' : 'var(--muted-foreground)',
                        border: `1px solid ${aiMode === mode.key ? 'rgba(0,242,195,0.3)' : 'var(--border)'}`,
                      }}
                    >
                      <Icon name={mode.icon as any} size={12} />
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* AI Content Area */}
                <div className="p-4">
                  {aiMode === 'chat' ? (
                    /* Chat mode */
                    <div className="flex flex-col gap-3">
                      <div className="min-h-[120px] max-h-64 overflow-y-auto flex flex-col gap-2" ref={chatEndRef}>
                        {chatHistory.length === 0 && !isLoading && (
                          <p className="text-xs text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
                            Posez une question clinique en lien avec cette consultation. Le contexte du patient est automatiquement inclus.
                          </p>
                        )}
                        {chatHistory.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className="max-w-[85%] text-xs px-3 py-2 rounded-xl"
                              style={{
                                backgroundColor: msg.role === 'user' ? 'var(--shifa-blue)' : 'rgba(0,242,195,0.08)',
                                color: msg.role === 'user' ? 'white' : 'var(--foreground)',
                                border: msg.role === 'assistant' ? '1px solid rgba(0,242,195,0.15)' : 'none',
                              }}
                            >
                              {msg.role === 'assistant' && (
                                <div className="flex items-center gap-1 mb-1 opacity-60">
                                  <Icon name="SparklesIcon" size={10} />
                                  <span style={{ fontSize: '10px' }}>SHIFA AI</span>
                                </div>
                              )}
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && response && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(0,242,195,0.08)', color: 'var(--foreground)', border: '1px solid rgba(0,242,195,0.15)' }}>
                              <div className="flex items-center gap-1 mb-1 opacity-60">
                                <Icon name="SparklesIcon" size={10} />
                                <span style={{ fontSize: '10px' }}>SHIFA AI</span>
                              </div>
                              <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
                            </div>
                          </div>
                        )}
                        {isLoading && !response && (
                          <div className="flex justify-start">
                            <div className="text-xs px-3 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'rgba(0,242,195,0.08)', color: 'var(--muted-foreground)' }}>
                              <Icon name="ArrowPathIcon" size={12} className="animate-spin" />
                              Analyse en cours...
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="input-field flex-1 text-xs py-2"
                          placeholder="Ex: Quelles interactions vérifier avec la Metformine ?"
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
                          disabled={isLoading}
                        />
                        <button
                          onClick={handleChatSend}
                          disabled={isLoading || !chatInput.trim()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                          style={{ backgroundColor: 'var(--shifa-cyan)', color: '#0A1B3D' }}
                        >
                          {isLoading ? <Icon name="ArrowPathIcon" size={13} className="animate-spin" /> : <Icon name="PaperAirplaneIcon" size={13} />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Structured AI modes */
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{currentModeConfig.description}</p>
                        <button
                          onClick={() => handleGenerateAI(aiMode)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                          style={{ backgroundColor: 'rgba(0,242,195,0.15)', color: 'var(--shifa-cyan)', border: '1px solid rgba(0,242,195,0.3)' }}
                        >
                          {isLoading ? (
                            <><Icon name="ArrowPathIcon" size={12} className="animate-spin" /> Analyse...</>
                          ) : (
                            <><Icon name="SparklesIcon" size={12} /> Générer</>
                          )}
                        </button>
                      </div>

                      {/* Result area */}
                      {(displayedResult || (isLoading && response)) ? (
                        <div className="rounded-xl p-3 text-xs leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: 'rgba(0,242,195,0.06)', color: 'var(--foreground)', border: '1px solid rgba(0,242,195,0.12)', minHeight: '80px' }}>
                          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b" style={{ borderColor: 'rgba(0,242,195,0.15)' }}>
                            <Icon name="SparklesIcon" size={11} style={{ color: 'var(--shifa-cyan)' } as any} />
                            <span className="font-semibold" style={{ color: 'var(--shifa-cyan)', fontSize: '10px' }}>SUGGESTION IA — NON VALIDÉE CLINIQUEMENT</span>
                            {isLoading && <Icon name="ArrowPathIcon" size={10} className="animate-spin ml-auto" style={{ color: 'var(--shifa-cyan)' } as any} />}
                          </div>
                          {displayedResult || response}
                        </div>
                      ) : (
                        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(0,242,195,0.04)', border: '1px dashed rgba(0,242,195,0.2)' }}>
                          <Icon name="SparklesIcon" size={20} className="mx-auto mb-2" style={{ color: 'rgba(0,242,195,0.4)' } as any} />
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            Cliquez sur <strong>Générer</strong> pour obtenir une analyse IA basée sur les données de la consultation.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="px-4 py-2.5 border-t" style={{ borderColor: 'rgba(0,242,195,0.1)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    ⚠️ <strong>Suggestions IA uniquement.</strong> Le professionnel de santé reste seul responsable de toutes les décisions cliniques. Ne pas utiliser comme substitut au jugement médical.
                  </p>
                </div>
              </div>
            )}

            {/* Section content */}
            {activeSection === 'motif' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Motif de consultation</h3>
                <textarea
                  className="input-field w-full resize-none"
                  rows={4}
                  placeholder="Décrivez le motif principal de la consultation..."
                  value={motif}
                  onChange={e => setMotif(e.target.value)}
                />
                <div className="mt-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Motifs fréquents</p>
                  <div className="flex flex-wrap gap-2">
                    {['Douleur thoracique', 'Céphalées', 'Fièvre', 'Toux', 'Fatigue', 'Contrôle de routine', 'Renouvellement ordonnance'].map(m => (
                      <button key={m} onClick={() => setMotif(m)} className="text-xs px-2.5 py-1 rounded-full border transition-all hover:border-primary" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'anamnese' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Anamnèse</h3>
                <textarea
                  className="input-field w-full resize-none"
                  rows={8}
                  placeholder="Histoire de la maladie, antécédents pertinents, facteurs de risque..."
                  value={anamnese}
                  onChange={e => setAnamnese(e.target.value)}
                />
              </div>
            )}

            {activeSection === 'constantes' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Constantes vitales</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {vitals.map((vital, i) => (
                    <div key={vital.label} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                      <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>{vital.label}</p>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          className="flex-1 text-sm font-bold bg-transparent border-none outline-none"
                          style={{ color: 'var(--foreground)' }}
                          value={vital.value}
                          onChange={e => updateVital(i, e.target.value)}
                        />
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{vital.unit}</span>
                      </div>
                      <div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: vital.normal ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
                        <div className="h-full rounded-full w-3/4" style={{ backgroundColor: vital.normal ? '#10B981' : '#EF4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'examen' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Examen clinique</h3>
                <textarea
                  className="input-field w-full resize-none"
                  rows={8}
                  placeholder="Résultats de l'examen physique par système (cardiovasculaire, respiratoire, abdomen, neurologique...)..."
                  value={examen}
                  onChange={e => setExamen(e.target.value)}
                />
              </div>
            )}

            {activeSection === 'evaluation' && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Évaluation & Observations</h3>
                  <textarea
                    className="input-field w-full resize-none"
                    rows={4}
                    placeholder="Synthèse clinique, hypothèses diagnostiques..."
                    value={evaluation}
                    onChange={e => setEvaluation(e.target.value)}
                  />
                </div>
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Diagnostic</h3>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Diagnostic principal (CIM-10)..."
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Diagnostics fréquents</p>
                    <div className="flex flex-wrap gap-2">
                      {['J06.9 — Rhinopharyngite', 'J18.9 — Pneumonie', 'E11 — Diabète type 2', 'I10 — HTA', 'K29.7 — Gastrite'].map(d => (
                        <button key={d} onClick={() => setDiagnosis(d)} className="text-xs px-2.5 py-1 rounded-full border transition-all hover:border-primary" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'prescription' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: 'var(--foreground)' }}>Prescription médicale</h3>
                  <button onClick={addPrescriptionLine} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(0,102,255,0.1)', color: 'var(--shifa-blue)' }}>
                    <Icon name="PlusIcon" size={14} />
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {prescriptions.map((rx, i) => (
                    <div key={rx.id} className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: 'var(--shifa-blue)' }}>{i + 1}</span>
                        <input
                          type="text"
                          className="flex-1 text-sm font-semibold bg-transparent border-none outline-none"
                          placeholder="Médicament, DCI..."
                          style={{ color: 'var(--foreground)' }}
                          value={rx.drug}
                          onChange={e => updatePrescription(rx.id, 'drug', e.target.value)}
                        />
                        <button onClick={() => removePrescriptionLine(rx.id)} className="p-1 rounded-lg hover:bg-muted">
                          <Icon name="XMarkIcon" size={14} className="text-muted-foreground" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input type="text" className="input-field text-xs py-1.5" placeholder="Dosage" value={rx.dosage} onChange={e => updatePrescription(rx.id, 'dosage', e.target.value)} />
                        <input type="text" className="input-field text-xs py-1.5" placeholder="Fréquence" value={rx.frequency} onChange={e => updatePrescription(rx.id, 'frequency', e.target.value)} />
                        <input type="text" className="input-field text-xs py-1.5" placeholder="Durée" value={rx.duration} onChange={e => updatePrescription(rx.id, 'duration', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl border" style={{ backgroundColor: 'rgba(0,102,255,0.04)', borderColor: 'rgba(0,102,255,0.15)' }}>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    ⚠️ La prescription sera signée électroniquement lors de la clôture de la consultation. Vérifiez les interactions médicamenteuses et les contre-indications.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'documents' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Documents & Examens complémentaires</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Demande d\'analyse', icon: 'BeakerIcon' },
                    { label: 'Demande d\'imagerie', icon: 'PhotoIcon' },
                    { label: 'Certificat médical', icon: 'DocumentCheckIcon' },
                    { label: 'Arrêt de travail', icon: 'DocumentTextIcon' },
                  ].map(doc => (
                    <button key={doc.label} className="flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all hover:shadow-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <Icon name={doc.icon as any} size={18} style={{ color: 'var(--shifa-blue)' } as any} className="" />
                      {doc.label}
                    </button>
                  ))}
                </div>
                <div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                  <Icon name="PaperClipIcon" size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Glissez des fichiers ici ou cliquez pour joindre</p>
                </div>
              </div>
            )}

            {activeSection === 'plan' && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Plan de soins & Suivi</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Instructions au patient</label>
                    <textarea className="input-field w-full resize-none" rows={3} placeholder="Conseils, recommandations, mesures hygiéno-diététiques..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Prochain rendez-vous</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="date" className="input-field" />
                      <select className="input-field">
                        <option>Consultation de suivi</option>
                        <option>Contrôle résultats</option>
                        <option>Urgence si aggravation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Orientation</label>
                    <div className="flex flex-wrap gap-2">
                      {['Spécialiste', 'Urgences', 'Hospitalisation', 'Rééducation', 'Psychologue'].map(o => (
                        <button key={o} className="text-xs px-3 py-1.5 rounded-full border transition-all hover:border-primary" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
