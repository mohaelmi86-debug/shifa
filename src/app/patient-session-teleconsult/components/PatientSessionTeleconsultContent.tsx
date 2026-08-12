'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type Tab = 'chat' | 'documents' | 'vitals';

interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  { id: 'm1', sender: 'doctor', text: 'Bonjour Aïcha, je vous entends bien. Comment vous sentez-vous aujourd\'hui ?', time: '14:31' },
  { id: 'm2', sender: 'patient', text: 'Bonjour Docteur, ça va merci. Les douleurs sont toujours présentes après les repas.', time: '14:31' },
  { id: 'm3', sender: 'doctor', text: 'D\'accord. Décrivez-moi la localisation exacte de la douleur.', time: '14:32' },
];

export default function PatientSessionTeleconsultContent() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setChatMessages(prev => [...prev, { id: `m${Date.now()}`, sender: 'patient', text: chatInput.trim(), time }]);
    setChatInput('');
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'chat', label: 'Chat', icon: 'ChatBubbleLeftRightIcon' },
    { key: 'documents', label: 'Documents', icon: 'PaperClipIcon' },
    { key: 'vitals', label: 'Mes constantes', icon: 'HeartIcon' },
  ];

  const sharedDocs = [
    { name: 'Résultats biologie — 28 juil. 2026', type: 'PDF', size: '1.2 MB' },
    { name: 'Ordonnance précédente', type: 'PDF', size: '0.4 MB' },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0a0f1a' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0d1420' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">Téléconsultation en cours</span>
          </div>
          <div className="px-3 py-1 rounded-lg text-sm font-mono font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#60a5fa' }}>
            {formatTime(elapsed)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>MS</div>
          <div>
            <p className="text-sm font-semibold text-white">Dr. Mohamed Sy</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Médecin généraliste</p>
          </div>
        </div>
        <button
          onClick={() => setShowEndModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#ef4444' }}>
          <Icon name="PhoneXMarkIcon" size={16} />
          Quitter
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative flex items-center justify-center" style={{ backgroundColor: '#0a0f1a' }}>
          {/* Doctor video (main) */}
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden mx-4 my-4"
              style={{ backgroundColor: '#111827', maxHeight: 'calc(100vh - 200px)' }}>
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#0d2137 100%)' }}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', opacity: 0.9 }}>MS</div>
                  <p className="text-white text-lg font-semibold">Dr. Mohamed Sy</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Connecté</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Self preview (PiP) */}
            <div className="absolute bottom-8 right-8 w-36 h-24 rounded-xl overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: '#1f2937' }}>
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#1a2744,#0d1a2e)' }}>
                {isCamOff ? (
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="VideoCameraSlashIcon" size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Caméra off</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>AD</div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Vous</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.15)' }}
              title={isMuted ? 'Activer le micro' : 'Couper le micro'}>
              <Icon name="MicrophoneIcon" size={20} className="text-white" />
            </button>
            <button
              onClick={() => setIsCamOff(!isCamOff)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: isCamOff ? '#ef4444' : 'rgba(255,255,255,0.15)' }}
              title={isCamOff ? 'Activer la caméra' : 'Désactiver la caméra'}>
              <Icon name={isCamOff ? 'VideoCameraSlashIcon' : 'VideoCameraIcon'} size={20} className="text-white" />
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: activeTab === 'chat' ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.15)' }}
              title="Chat">
              <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              title="Partager un document">
              <Icon name="PaperClipIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 flex flex-col border-l shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0d1420' }}>
          {/* Tabs */}
          <div className="flex border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all"
                style={activeTab === tab.key
                  ? { color: '#60a5fa', borderBottom: '2px solid #60a5fa' }
                  : { color: 'rgba(255,255,255,0.4)' }}>
                <Icon name={tab.icon as any} size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {/* Chat */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${msg.sender === 'patient' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                        style={{
                          backgroundColor: msg.sender === 'patient' ? 'rgba(0,102,255,0.3)' : 'rgba(255,255,255,0.08)',
                          border: msg.sender === 'patient' ? '1px solid rgba(0,102,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                        }}>
                        <p className="text-sm text-white">{msg.text}</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder="Écrire un message..."
                      className="flex-1 px-3 py-2 rounded-xl text-sm text-white border outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
                    />
                    <button
                      onClick={sendChat}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
                      style={{ backgroundColor: '#0066ff' }}>
                      <Icon name="PaperAirplaneIcon" size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>DOCUMENTS PARTAGÉS</p>
                {sharedDocs.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
                      <Icon name="DocumentTextIcon" size={18} style={{ color: '#f87171' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{doc.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{doc.type} · {doc.size}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <Icon name="ArrowDownTrayIcon" size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </button>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                  <Icon name="PaperClipIcon" size={15} />
                  Partager un document
                </button>
              </div>
            )}

            {/* Vitals */}
            {activeTab === 'vitals' && (
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>MES CONSTANTES (pré-consultation)</p>
                {[
                  { label: 'Tension artérielle', value: '128/82 mmHg', icon: 'HeartIcon', color: '#ef4444' },
                  { label: 'Fréquence cardiaque', value: '76 bpm', icon: 'BoltIcon', color: '#ec4899' },
                  { label: 'Température', value: '37.1°C', icon: 'FireIcon', color: '#f59e0b' },
                  { label: 'Saturation O₂', value: '98%', icon: 'CloudIcon', color: '#06b6d4' },
                  { label: 'Poids', value: '62 kg', icon: 'ScaleIcon', color: '#8b5cf6' },
                ].map(v => (
                  <div key={v.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon name={v.icon as any} size={16} style={{ color: v.color }} />
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{v.label}</p>
                      <p className="text-sm font-semibold text-white">{v.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End session modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="rounded-2xl p-6 w-full max-w-sm mx-4" style={{ backgroundColor: '#0d1420', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h3 className="text-lg font-bold text-white mb-2">Quitter la consultation ?</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Êtes-vous sûr(e) de vouloir quitter ? La session sera terminée et votre médecin sera notifié.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                Annuler
              </button>
              <Link href="/patient-prescription-receipt"
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#ef4444' }}>
                Quitter
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
