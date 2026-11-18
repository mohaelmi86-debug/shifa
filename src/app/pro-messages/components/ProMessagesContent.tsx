'use client';
import React, { useState, useRef, useEffect } from 'react';
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
  status: 'sent' | 'delivered' | 'read';
  attachment?: { name: string; size: string; type: 'pdf' | 'image' | 'doc' };
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
    { id: 'm1', sender: 'other', text: 'Bonjour Dr. Sy, j\'ai vu votre patient Kwame Asante en urgence hier soir.', time: '10:30', status: 'read' },
    { id: 'm2', sender: 'other', text: 'Son BNP est à 450 pg/mL. Je pense à une décompensation cardiaque.', time: '10:31', status: 'read' },
    { id: 'm3', sender: 'me', text: 'Merci Dr. Sarr. Je vous envoie son dossier complet immédiatement.', time: '10:40', status: 'read' },
    { id: 'm4', sender: 'other', text: 'Pouvez-vous me transférer le dossier de M. Asante ?', time: '10:45', status: 'delivered', attachment: { name: 'Dossier_Asante_ECG.pdf', size: '2.4 MB', type: 'pdf' } },
  ],
  c2: [
    { id: 'm1', sender: 'me', text: 'Bonjour Dr. Kouassi, je vous adresse Mme Fontaine pour une lésion cutanée suspecte.', time: '09:00', status: 'read' },
    { id: 'm2', sender: 'other', text: 'Merci pour la référence, je le prends en charge.', time: '09:30', status: 'read' },
  ],
  c3: [
    { id: 'm1', sender: 'other', text: 'Docteur, j\'ai une question sur mon traitement.', time: 'Hier 18:00', status: 'delivered' },
  ],
  c4: [
    { id: 'm1', sender: 'other', text: 'Réunion de service demain à 8h00.', time: 'Lun 14:00', status: 'read' },
  ],
  c5: [
    { id: 'm1', sender: 'other', text: 'Résultats de Mme Benali reçus. Tout est normal pour la grossesse.', time: '08/08 11:00', status: 'read' },
    { id: 'm2', sender: 'me', text: 'Parfait, merci Dr. Kouyaté !', time: '08/08 11:30', status: 'read' },
  ],
};

const typeColors: Record<string, string> = {
  colleague: 'var(--shifa-blue)',
  patient: 'var(--shifa-green)',
  admin: 'var(--shifa-purple)',
};

const typeLabels: Record<string, string> = {
  colleague: 'Collègue',
  patient: 'Patient',
  admin: 'Admin',
};

function AttachmentBubble({ attachment }: { attachment: NonNullable<Message['attachment']> }) {
  const iconName = attachment.type === 'pdf' ? 'DocumentTextIcon' : attachment.type === 'image' ? 'PhotoIcon' : 'DocumentIcon';
  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
      <Icon name={iconName as any} size={16} style={{ color: 'white' } as React.CSSProperties} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate text-white">{attachment.name}</p>
        <p className="text-xs opacity-70 text-white">{attachment.size}</p>
      </div>
      <Icon name="ArrowDownTrayIcon" size={14} style={{ color: 'white' } as React.CSSProperties} />
    </div>
  );
}

export default function ProMessagesContent() {
  const [activeConv, setActiveConv] = useState('c1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [typeFilter, setTypeFilter] = useState<'all' | 'colleague' | 'patient' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = conversations.find(c => c.id === activeConv)!;
  const currentMessages = messages[activeConv] || [];

  const filteredConvs = conversations.filter(c => {
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Simulate typing indicator when switching conversations
  useEffect(() => {
    if (active?.online) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        const stopTimer = setTimeout(() => setIsTyping(false), 3000);
        return () => clearTimeout(stopTimer);
      }, 1500);
      return () => clearTimeout(timer);
    }
    setIsTyping(false);
  }, [activeConv, active?.online]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInputText('');
    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeConv]: (prev[activeConv] || []).map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m),
      }));
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)', margin: '16px', boxShadow: '0 4px 24px rgba(21,101,216,0.08)' }}>
      {/* ── Sidebar: Conversations ── */}
      <div className="w-72 xl:w-80 shrink-0 flex flex-col" style={{ backgroundColor: 'var(--card)', borderRight: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-base font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Messagerie Pro
            </h1>
            {totalUnread > 0 && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--shifa-blue)' }}
              >
                {totalUnread}
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Communications sécurisées inter-professionnels</p>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Type filter tabs */}
        <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--background)' }}>
            {(['all', 'colleague', 'patient', 'admin'] as const).map(t => (
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

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConvs.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
              <Icon name="ChatBubbleLeftRightIcon" size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Aucune conversation</p>
            </div>
          ) : filteredConvs.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className="w-full flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted"
              style={{
                borderBottom: '1px solid var(--border)',
                backgroundColor: activeConv === conv.id ? 'var(--muted)' : 'transparent',
              }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${typeColors[conv.type]}, var(--shifa-cyan))` }}
                >
                  {conv.avatar}
                </div>
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#059669' }} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className="text-xs font-bold truncate" style={{ color: 'var(--foreground)' }}>{conv.name}</p>
                  <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{conv.time}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${typeColors[conv.type]}15`, color: typeColors[conv.type], fontSize: '9px' }}
                  >
                    {typeLabels[conv.type]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs truncate flex-1"
                    style={{ color: conv.unread > 0 ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: conv.unread > 0 ? 600 : 400 }}
                  >
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span
                      className="ml-1.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: 'var(--shifa-blue)', fontSize: '9px' }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* New conversation button */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: 'rgba(21,101,216,0.08)', color: 'var(--shifa-blue)', border: '1px solid rgba(21,101,216,0.2)' }}
          >
            <Icon name="PlusIcon" size={14} />
            Nouvelle conversation
          </button>
        </div>
      </div>

      {/* ── Main: Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--background)' }}>
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-5 py-3.5"
          style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${typeColors[active.type]}, var(--shifa-cyan))` }}
            >
              {active.avatar}
            </div>
            {active.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#059669' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{active.name}</p>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: `${typeColors[active.type]}15`, color: typeColors[active.type], fontSize: '9px' }}
              >
                {typeLabels[active.type]}
              </span>
            </div>
            <p className="text-xs" style={{ color: active.online ? '#059669' : 'var(--muted-foreground)' }}>
              {active.online ? (isTyping ? 'En train d\'écrire...' : 'En ligne') : active.role}
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors" title="Appel vidéo">
              <Icon name="VideoCameraIcon" size={16} className="text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors" title="Informations">
              <Icon name="InformationCircleIcon" size={16} className="text-muted-foreground" />
            </button>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{ backgroundColor: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}
            >
              <Icon name="LockClosedIcon" size={11} style={{ color: '#059669' } as React.CSSProperties} />
              <span className="text-xs font-semibold" style={{ color: '#059669' }}>Chiffré</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 flex flex-col gap-2">
          {/* Date separator */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
              Aujourd'hui
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          </div>

          {currentMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    backgroundColor: msg.sender === 'me' ? 'var(--shifa-blue)' : 'var(--card)',
                    color: msg.sender === 'me' ? 'white' : 'var(--foreground)',
                    border: msg.sender === 'me' ? 'none' : '1px solid var(--border)',
                    borderBottomRightRadius: msg.sender === 'me' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.sender === 'me' ? '16px' : '4px',
                    boxShadow: msg.sender === 'me' ? '0 2px 8px rgba(21,101,216,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  {msg.text}
                  {msg.attachment && <AttachmentBubble attachment={msg.attachment} />}
                </div>
                {/* Time + status */}
                <div className={`flex items-center gap-1 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{msg.time}</span>
                  {msg.sender === 'me' && (
                    <Icon
                      name={msg.status === 'read' ? 'CheckIcon' : msg.status === 'delivered' ? 'CheckIcon' : 'ClockIcon'}
                      size={11}
                      style={{ color: msg.status === 'read' ? 'var(--shifa-blue)' : 'var(--muted-foreground)' } as React.CSSProperties}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: 'var(--muted-foreground)', animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="px-4 py-3"
          style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-end gap-2">
            {/* Attach button */}
            <div className="relative">
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors shrink-0"
                title="Joindre un fichier"
              >
                <Icon name="PaperClipIcon" size={17} className="text-muted-foreground" />
              </button>
              {showAttachMenu && (
                <div
                  className="absolute bottom-12 left-0 rounded-xl p-2 flex flex-col gap-1 z-10"
                  style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: '160px' }}
                >
                  {[
                    { icon: 'DocumentTextIcon', label: 'Document PDF' },
                    { icon: 'PhotoIcon', label: 'Image' },
                    { icon: 'BeakerIcon', label: 'Résultat médical' },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => setShowAttachMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted transition-colors text-left"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <Icon name={item.icon as any} size={14} style={{ color: 'var(--shifa-blue)' } as React.CSSProperties} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Text input */}
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Écrivez votre message..."
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-2xl text-sm border resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                maxHeight: '120px',
              }}
            />

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl transition-all shrink-0 disabled:opacity-40"
              style={{
                backgroundColor: inputText.trim() ? 'var(--shifa-blue)' : 'var(--muted)',
                color: inputText.trim() ? 'white' : 'var(--muted-foreground)',
                boxShadow: inputText.trim() ? '0 2px 8px rgba(21,101,216,0.3)' : 'none',
              }}
            >
              <Icon name="PaperAirplaneIcon" size={17} />
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
            <Icon name="LockClosedIcon" size={9} className="inline mr-1" />
            Messages chiffrés de bout en bout — SHIFA Health OS
          </p>
        </div>
      </div>
    </div>
  );
}
