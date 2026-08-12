'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'colleague' | 'patient' | 'admin';
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

const conversations: Conversation[] = [
  { id: 'c1', name: 'Dr. Fatou Sarr', role: 'Cardiologue — CHU Saint-Louis', avatar: 'FS', lastMessage: 'Pouvez-vous me transférer le dossier de M. Asante ?', time: '10:45', unread: 2, online: true, type: 'colleague' },
  { id: 'c2', name: 'Dr. Jean Kouassi', role: 'Dermatologue', avatar: 'JK', lastMessage: 'Merci pour la référence, je le prends en charge.', time: '09:30', unread: 0, online: false, type: 'colleague' },
  { id: 'c3', name: 'Aïcha Diallo', role: 'Patient', avatar: 'AD', lastMessage: 'Docteur, j\'ai une question sur mon traitement.', time: 'Hier', unread: 1, online: false, type: 'patient' },
  { id: 'c4', name: 'Admin CHU', role: 'Administration', avatar: 'CH', lastMessage: 'Réunion de service demain à 8h00.', time: 'Lun', unread: 0, online: false, type: 'admin' },
  { id: 'c5', name: 'Dr. Aminata Kouyaté', role: 'Gynécologue', avatar: 'AK', lastMessage: 'Résultats de Mme Benali reçus.', time: '08/08', unread: 0, online: true, type: 'colleague' },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', sender: 'other', text: 'Bonjour Dr. Sy, j\'ai vu votre patient Kwame Asante en urgence hier soir.', time: '10:30' },
    { id: 'm2', sender: 'other', text: 'Son BNP est à 450 pg/mL. Je pense à une décompensation cardiaque.', time: '10:31' },
    { id: 'm3', sender: 'me', text: 'Merci Dr. Sarr. Je vous envoie son dossier complet immédiatement.', time: '10:40' },
    { id: 'm4', sender: 'other', text: 'Pouvez-vous me transférer le dossier de M. Asante ?', time: '10:45' },
  ],
  c2: [
    { id: 'm1', sender: 'me', text: 'Bonjour Dr. Kouassi, je vous adresse Mme Fontaine pour une lésion cutanée suspecte.', time: '09:00' },
    { id: 'm2', sender: 'other', text: 'Merci pour la référence, je le prends en charge.', time: '09:30' },
  ],
  c3: [
    { id: 'm1', sender: 'other', text: 'Docteur, j\'ai une question sur mon traitement.', time: 'Hier 18:00' },
  ],
  c4: [
    { id: 'm1', sender: 'other', text: 'Réunion de service demain à 8h00.', time: 'Lun 14:00' },
  ],
  c5: [
    { id: 'm1', sender: 'other', text: 'Résultats de Mme Benali reçus. Tout est normal pour la grossesse.', time: '08/08 11:00' },
    { id: 'm2', sender: 'me', text: 'Parfait, merci Dr. Kouyaté !', time: '08/08 11:30' },
  ],
};

const typeColors = {
  colleague: 'var(--shifa-blue)',
  patient: 'var(--shifa-green)',
  admin: 'var(--shifa-purple)',
};

export default function ProMessagesContent() {
  const [activeConv, setActiveConv] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [typeFilter, setTypeFilter] = useState<'all' | 'colleague' | 'patient' | 'admin'>('all');

  const active = conversations.find(c => c.id === activeConv)!;
  const currentMessages = messages[activeConv] || [];

  const filteredConvs = conversations.filter(c => typeFilter === 'all' || c.type === typeFilter);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInputText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversations */}
      <div className="w-80 shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Messagerie professionnelle</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Communications sécurisées inter-professionnels</p>
        </div>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
            {(['all', 'colleague', 'patient', 'admin'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  backgroundColor: typeFilter === t ? 'var(--shifa-blue)' : 'transparent',
                  color: typeFilter === t ? 'white' : 'var(--muted-foreground)',
                }}
              >
                {t === 'all' ? 'Tous' : t === 'colleague' ? 'Collègues' : t === 'patient' ? 'Patients' : 'Admin'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: activeConv === conv.id ? 'var(--muted)' : 'transparent' }}
            >
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${typeColors[conv.type]}, var(--shifa-cyan))` }}
                >
                  {conv.avatar}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--shifa-green)' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{conv.name}</p>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{conv.time}</span>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{conv.role}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs truncate flex-1" style={{ color: conv.unread > 0 ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: conv.unread > 0 ? 600 : 400 }}>
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span className="ml-2 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${typeColors[active.type]}, var(--shifa-cyan))` }}
            >
              {active.avatar}
            </div>
            {active.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--shifa-green)' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{active.name}</p>
            <p className="text-xs" style={{ color: active.online ? 'var(--shifa-green)' : 'var(--muted-foreground)' }}>
              {active.online ? 'En ligne' : active.role}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Icon name="LockClosedIcon" size={12} style={{ color: 'var(--shifa-green)' } as React.CSSProperties} className="" />
            <span className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>Chiffré</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 flex flex-col gap-3" style={{ backgroundColor: 'var(--background)' }}>
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  backgroundColor: msg.sender === 'me' ? 'var(--shifa-blue)' : 'var(--card)',
                  color: msg.sender === 'me' ? 'white' : 'var(--foreground)',
                  border: msg.sender === 'me' ? 'none' : '1px solid var(--border)',
                  borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.sender === 'me' ? '16px' : '4px',
                }}
              >
                {msg.text}
                <p className="text-xs mt-1 opacity-70 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="flex items-end gap-3">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
              <Icon name="PaperClipIcon" size={18} className="text-muted-foreground" />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Écrivez votre message..."
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-2xl text-sm border resize-none focus:outline-none"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl transition-all shrink-0"
              style={{ backgroundColor: inputText.trim() ? 'var(--shifa-blue)' : 'var(--muted)', color: inputText.trim() ? 'white' : 'var(--muted-foreground)' }}
            >
              <Icon name="PaperAirplaneIcon" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
