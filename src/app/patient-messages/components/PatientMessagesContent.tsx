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
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
  read: boolean;
}

const conversations: Conversation[] = [
  { id: 'c1', name: 'Dr. Mohamed Sy', role: 'Médecin généraliste', avatar: 'MS', lastMessage: 'Vos résultats sont bons. Continuez le traitement.', time: '10:24', unread: 2, online: true },
  { id: 'c2', name: 'Dr. Fatou Sarr', role: 'Cardiologue', avatar: 'FS', lastMessage: 'RDV confirmé pour le 15 août à 14h00.', time: 'Hier', unread: 0, online: false },
  { id: 'c3', name: 'CHU Saint-Louis', role: 'Administration', avatar: 'CH', lastMessage: 'Votre dossier a été mis à jour.', time: 'Lun', unread: 1, online: false },
  { id: 'c4', name: 'Dr. Jean Kouassi', role: 'Dermatologue', avatar: 'JK', lastMessage: 'N\'oubliez pas d\'appliquer la crème 2x/jour.', time: '08/08', unread: 0, online: true },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', sender: 'other', text: 'Bonjour Aïcha, j\'ai reçu vos derniers résultats d\'analyse.', time: '10:10', read: true },
    { id: 'm2', sender: 'other', text: 'Votre glycémie est revenue dans les normes. Excellent travail !', time: '10:11', read: true },
    { id: 'm3', sender: 'me', text: 'Merci Docteur ! Je suis soulagée. Est-ce que je dois continuer le traitement ?', time: '10:18', read: true },
    { id: 'm4', sender: 'other', text: 'Vos résultats sont bons. Continuez le traitement.', time: '10:24', read: false },
    { id: 'm5', sender: 'other', text: 'On se revoit dans 3 mois pour un contrôle de routine.', time: '10:24', read: false },
  ],
  c2: [
    { id: 'm1', sender: 'other', text: 'Bonjour, je vous confirme votre rendez-vous de cardiologie.', time: 'Hier 14:30', read: true },
    { id: 'm2', sender: 'other', text: 'RDV confirmé pour le 15 août à 14h00.', time: 'Hier 14:31', read: true },
  ],
  c3: [
    { id: 'm1', sender: 'other', text: 'Votre dossier a été mis à jour suite à votre dernière consultation.', time: 'Lun 09:00', read: false },
  ],
  c4: [
    { id: 'm1', sender: 'other', text: 'Bonjour, suite à votre consultation du 8 août.', time: '08/08 16:00', read: true },
    { id: 'm2', sender: 'other', text: 'N\'oubliez pas d\'appliquer la crème 2x/jour.', time: '08/08 16:01', read: true },
    { id: 'm3', sender: 'me', text: 'Bien reçu, merci Docteur !', time: '08/08 16:45', read: true },
  ],
};

export default function PatientMessagesContent() {
  const [activeConv, setActiveConv] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const active = conversations.find(c => c.id === activeConv)!;
  const currentMessages = messages[activeConv] || [];

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInputText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ maxHeight: 'calc(100vh - 0px)' }}>
      {/* Conversations list */}
      <div className="w-80 shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-lg font-bold" style={{ color: 'var(--shifa-dark)' }}>Messagerie sécurisée</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Communications chiffrées de bout en bout</p>
        </div>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', focusRingColor: 'var(--shifa-blue)' } as React.CSSProperties}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted border-b"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: activeConv === conv.id ? 'var(--muted)' : 'transparent',
              }}
            >
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
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

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
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
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors" title="Appel vidéo">
              <Icon name="VideoCameraIcon" size={18} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors" title="Informations">
              <Icon name="InformationCircleIcon" size={18} className="text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Icon name="LockClosedIcon" size={12} style={{ color: 'var(--shifa-green)' } as React.CSSProperties} className="" />
            <span className="text-xs font-semibold" style={{ color: 'var(--shifa-green)' }}>Chiffré</span>
          </div>
        </div>

        {/* Messages */}
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
                <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs opacity-70">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <Icon name={msg.read ? 'CheckIcon' : 'CheckIcon'} size={12} className="opacity-70" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="flex items-end gap-3">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0" title="Joindre un fichier">
              <Icon name="PaperClipIcon" size={18} className="text-muted-foreground" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Écrivez votre message..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-2xl text-sm border resize-none focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  maxHeight: '120px',
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl transition-all shrink-0"
              style={{
                backgroundColor: inputText.trim() ? 'var(--shifa-blue)' : 'var(--muted)',
                color: inputText.trim() ? 'white' : 'var(--muted-foreground)',
              }}
            >
              <Icon name="PaperAirplaneIcon" size={18} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted-foreground)' }}>
            <Icon name="LockClosedIcon" size={10} className="inline mr-1" />
            Messages chiffrés de bout en bout — SHIFA Health OS
          </p>
        </div>
      </div>
    </div>
  );
}
