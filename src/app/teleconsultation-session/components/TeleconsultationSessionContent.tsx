'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

type Tab = 'notes' | 'chat' | 'prescription' | 'documents';

interface ChatMessage {
  id: string;
  sender: 'pro' | 'patient';
  text: string;
  time: string;
}

interface PrescriptionLine {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const initialMessages: ChatMessage[] = [
  { id: 'm1', sender: 'patient', text: 'Bonjour Docteur, je vous entends bien.', time: '09:02' },
  { id: 'm2', sender: 'pro', text: 'Bonjour Aïcha, parfait. Commençons par votre motif de consultation.', time: '09:02' },
  { id: 'm3', sender: 'patient', text: 'J\'ai des douleurs abdominales depuis 3 jours, surtout après les repas.', time: '09:03' },
];

export default function TeleconsultationSessionContent() {
  const [activeTab, setActiveTab] = useState<Tab>('notes');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [notes, setNotes] = useState('');
  const [motif, setMotif] = useState('Douleurs abdominales post-prandiales — 3 jours');
  const [prescriptions, setPrescriptions] = useState<PrescriptionLine[]>([
    { id: 'rx1', drug: '', dosage: '', frequency: '', duration: '' },
  ]);
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
    setChatMessages(prev => [...prev, { id: `m${Date.now()}`, sender: 'pro', text: chatInput.trim(), time }]);
    setChatInput('');
  };

  const addRx = () => setPrescriptions(prev => [...prev, { id: `rx${Date.now()}`, drug: '', dosage: '', frequency: '', duration: '' }]);
  const removeRx = (id: string) => setPrescriptions(prev => prev.filter(r => r.id !== id));
  const updateRx = (id: string, field: keyof PrescriptionLine, value: string) =>
    setPrescriptions(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'notes', label: 'Notes', icon: 'ClipboardDocumentListIcon' },
    { key: 'prescription', label: 'Prescription', icon: 'DocumentCheckIcon' },
    { key: 'chat', label: 'Chat', icon: 'ChatBubbleLeftRightIcon' },
    { key: 'documents', label: 'Documents', icon: 'PaperClipIcon' },
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
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">REC</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>AD</div>
            <div>
              <p className="text-sm font-semibold text-white">Aïcha Diallo</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>33 ans · SH-2-SN-2025-7K4D</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowEndModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#ef4444' }}>
          <Icon name="PhoneXMarkIcon" size={16} />
          Terminer
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 relative flex items-center justify-center" style={{ backgroundColor: '#0a0f1a' }}>
          {/* Patient video (main) */}
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden mx-4 my-4"
              style={{ backgroundColor: '#111827', maxHeight: 'calc(100vh - 200px)' }}>
              {isCamOff ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)' }}>AD</div>
                  <p className="text-white font-semibold">Aïcha Diallo</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Caméra désactivée</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#0d2137 100%)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#0066ff,#00b4d8)', opacity: 0.9 }}>AD</div>
                      <p className="text-white text-lg font-semibold">Aïcha Diallo</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Connectée</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Self preview (PiP) */}
            <div className="absolute bottom-8 right-8 w-36 h-24 rounded-xl overflow-hidden border-2 shadow-2xl"
              style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: '#1f2937' }}>
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#1a2744,#0d1a2e)' }}>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#059669,#0d9488)' }}>MS</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Dr. Sy (vous)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.15)' }}>
              <Icon name={isMuted ? 'MicrophoneIcon' : 'MicrophoneIcon'} size={20} className="text-white" />
            </button>
            <button
              onClick={() => setIsCamOff(!isCamOff)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: isCamOff ? '#ef4444' : 'rgba(255,255,255,0.15)' }}>
              <Icon name={isCamOff ? 'VideoCameraSlashIcon' : 'VideoCameraIcon'} size={20} className="text-white" />
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: isRecording ? '#ef4444' : 'rgba(255,255,255,0.15)' }}>
              <Icon name="StopCircleIcon" size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Icon name="ArrowsPointingOutIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-96 flex flex-col border-l shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0d1420' }}>
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
                <Icon name={tab.icon as any} size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>MOTIF</label>
                  <input
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white border outline-none focus:ring-1"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', outlineColor: '#60a5fa' }}
                    placeholder="Motif de consultation..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>NOTES CLINIQUES</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white border outline-none focus:ring-1 resize-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
                    placeholder="Anamnèse, examen clinique, évaluation..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'TA', value: '128/82 mmHg' },
                    { label: 'FC', value: '78 bpm' },
                    { label: 'Temp.', value: '37.2°C' },
                    { label: 'SpO2', value: '98%' },
                  ].map(v => (
                    <div key={v.label} className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{v.label}</p>
                      <p className="text-sm font-semibold text-white">{v.value}</p>
                    </div>
                  ))}
                </div>
                <Link href="/teleconsultation-history"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: 'rgba(0,102,255,0.3)', border: '1px solid rgba(0,102,255,0.4)' }}>
                  <Icon name="DocumentArrowDownIcon" size={16} />
                  Sauvegarder & Terminer
                </Link>
              </div>
            )}

            {activeTab === 'prescription' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>ORDONNANCE</p>
                {prescriptions.map((rx, idx) => (
                  <div key={rx.id} className="p-3 rounded-xl border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">Médicament {idx + 1}</span>
                      {prescriptions.length > 1 && (
                        <button onClick={() => removeRx(rx.id)}>
                          <Icon name="XMarkIcon" size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                        </button>
                      )}
                    </div>
                    <input
                      value={rx.drug}
                      onChange={e => updateRx(rx.id, 'drug', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-sm text-white border mb-2 outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                      placeholder="Nom du médicament..."
                    />
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['dosage', 'frequency', 'duration'] as const).map(field => (
                        <input
                          key={field}
                          value={rx[field]}
                          onChange={e => updateRx(rx.id, field, e.target.value)}
                          className="px-2 py-1.5 rounded-lg text-xs text-white border outline-none"
                          style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}
                          placeholder={field === 'dosage' ? 'Dose' : field === 'frequency' ? 'Fréq.' : 'Durée'}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={addRx}
                  className="w-full py-2 rounded-xl text-sm font-medium border border-dashed transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
                  + Ajouter un médicament
                </button>
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ backgroundColor: 'rgba(16,185,129,0.3)', border: '1px solid rgba(16,185,129,0.4)' }}>
                  <Icon name="DocumentCheckIcon" size={15} className="inline mr-1.5" />
                  Valider l'ordonnance
                </button>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-3 overflow-y-auto mb-3" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'pro' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm`}
                        style={msg.sender === 'pro'
                          ? { backgroundColor: 'rgba(0,102,255,0.4)', color: 'white', borderBottomRightRadius: '4px' }
                          : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', borderBottomLeftRadius: '4px' }}>
                        <p>{msg.text}</p>
                        <p className="text-xs mt-0.5 opacity-60">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 mt-auto">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    className="flex-1 px-3 py-2 rounded-xl text-sm text-white border outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
                    placeholder="Message..."
                  />
                  <button onClick={sendChat}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,102,255,0.5)' }}>
                    <Icon name="PaperAirplaneIcon" size={16} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>DOCUMENTS PARTAGÉS</p>
                {[
                  { name: 'Bilan sanguin — 01/08/2026', type: 'PDF', size: '245 KB' },
                  { name: 'Ordonnance précédente', type: 'PDF', size: '128 KB' },
                  { name: 'Carnet de vaccination', type: 'PDF', size: '512 KB' },
                ].map(doc => (
                  <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Icon name="DocumentTextIcon" size={20} style={{ color: '#60a5fa' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{doc.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{doc.type} · {doc.size}</p>
                    </div>
                    <button>
                      <Icon name="ArrowDownTrayIcon" size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    </button>
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl text-sm font-medium border border-dashed transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
                  + Partager un document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End call modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="rounded-2xl p-6 w-full max-w-md mx-4" style={{ backgroundColor: '#0d1420', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h3 className="text-lg font-bold text-white mb-2">Terminer la consultation ?</h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              La session a duré {formatTime(elapsed)}. Vos notes seront sauvegardées.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                Annuler
              </button>
              <Link href="/teleconsultation-history"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                style={{ backgroundColor: '#ef4444' }}>
                Terminer & Sauvegarder
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
