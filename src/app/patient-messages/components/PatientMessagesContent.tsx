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
  specialty?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
  read: boolean;
  status: 'sent' | 'delivered' | 'read';
  attachment?: { name: string; size: string; type: 'pdf' | 'image' | 'doc' };
}

const conversations: Conversation[] = [
  { id: 'c1', name: 'Dr. Mohamed Sy', role: 'Médecin généraliste', avatar: 'MS', lastMessage: 'Vos résultats sont bons. Continuez le traitement.', time: '10:24', unread: 2, online: true, specialty: 'Médecine générale' },
  { id: 'c2', name: 'Dr. Fatou Sarr', role: 'Cardiologue', avatar: 'FS', lastMessage: 'RDV confirmé pour le 15 août à 14h00.', time: 'Hier', unread: 0, online: false, specialty: 'Cardiologie' },
  { id: 'c3', name: 'CHU Saint-Louis', role: 'Administration', avatar: 'CH', lastMessage: 'Votre dossier a été mis à jour.', time: 'Lun', unread: 1, online: false },
  { id: 'c4', name: 'Dr. Jean Kouassi', role: 'Dermatologue', avatar: 'JK', lastMessage: 'N\'oubliez pas d\'appliquer la crème 2x/jour.', time: '08/08', unread: 0, online: true, specialty: 'Dermatologie' },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', sender: 'other', text: 'Bonjour Aïcha, j\'ai reçu vos derniers résultats d\'analyse.', time: '10:10', read: true, status: 'read' },
    { id: 'm2', sender: 'other', text: 'Votre glycémie est revenue dans les normes. Excellent travail !', time: '10:11', read: true, status: 'read' },
    { id: 'm3', sender: 'me', text: 'Merci Docteur ! Je suis soulagée. Est-ce que je dois continuer le traitement ?', time: '10:18', read: true, status: 'read' },
    { id: 'm4', sender: 'other', text: 'Vos résultats sont bons. Continuez le traitement.', time: '10:24', read: false, status: 'delivered', attachment: { name: 'Resultats_Analyse_Aout.pdf', size: '1.2 MB', type: 'pdf' } },
    { id: 'm5', sender: 'other', text: 'On se revoit dans 3 mois pour un contrôle de routine.', time: '10:24', read: false, status: 'delivered' },
  ],
  c2: [
    { id: 'm1', sender: 'other', text: 'Bonjour, je vous confirme votre rendez-vous de cardiologie.', time: 'Hier 14:30', read: true, status: 'read' },
    { id: 'm2', sender: 'other', text: 'RDV confirmé pour le 15 août à 14h00.', time: 'Hier 14:31', read: true, status: 'read' },
  ],
  c3: [
    { id: 'm1', sender: 'other', text: 'Votre dossier a été mis à jour suite à votre dernière consultation.', time: 'Lun 09:00', read: false, status: 'delivered' },
  ],
  c4: [
    { id: 'm1', sender: 'other', text: 'Bonjour, suite à votre consultation du 8 août.', time: '08/08 16:00', read: true, status: 'read' },
    { id: 'm2', sender: 'other', text: 'N\'oubliez pas d\'appliquer la crème 2x/jour.', time: '08/08 16:01', read: true, status: 'read' },
    { id: 'm3', sender: 'me', text: 'Bien reçu, merci Docteur !', time: '08/08 16:45', read: true, status: 'read' },
  ],
};

function AttachmentBubble({ attachment, isMe }: { attachment: NonNullable<Message['attachment']>; isMe: boolean }) {
  const iconName = attachment.type === 'pdf' ? 'DocumentTextIcon' : attachment.type === 'image' ? 'PhotoIcon' : 'DocumentIcon';
  return (
    <div
      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl cursor-pointer"
      style={{
        backgroundColor: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(21,101,216,0.06)',
        border: isMe ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(21,101,216,0.15)',
      }}
    >
      <Icon name={iconName as any} size={16} style={{ color: isMe ? 'white' : 'var(--shifa-blue)' } as React.CSSProperties} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate" style={{ color: isMe ? 'white' : 'var(--foreground)' }}>{attachment.name}</p>
        <p className="text-xs opacity-70" style={{ color: isMe ? 'white' : 'var(--muted-foreground)' }}>{attachment.size}</p>
      </div>
      <Icon name="ArrowDownTrayIcon" size={13} style={{ color: isMe ? 'white' : 'var(--shifa-blue)' } as React.CSSProperties} />
    </div>
  );
}

export default function PatientMessagesContent() {
  const [activeConv, setActiveConv] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const active = conversations.find(c => c.id === activeConv)!;
  const currentMessages = messages[activeConv] || [];
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConvs = conversations.filter(c =>
    !searchQuery ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Simulate typing indicator
  useEffect(() => {
    if (active?.online) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        const stopTimer = setTimeout(() => setIsTyping(false), 2500);
        return () => clearTimeout(stopTimer);
      }, 2000);
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
      read: false,
      status: 'sent',
    };
    setMessages(prev => ({ ...prev, [activeConv]: [...(prev[activeConv] || []), newMsg] }));
    setInputText('');
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
    <div
      className="flex h-[calc(100vh-64px)] overflow-hidden rounded-2xl"
      style={{ border: '1px solid var(--border)', margin: '16px', boxShadow: '0 4px 24px rgba(21,101,216,0.08)' }}
    >
      {/* ── Conversations sidebar ── */}
      <div
        className="w-72 xl:w-80 shrink-0 flex flex-col"
        style={{ backgroundColor: 'var(--card)', borderRight: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-base font-bold" style={{ color: 'var(--shifa-dark)', fontFamily: 'var(--font-heading)' }}>
              Messagerie sécurisée
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
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Communications chiffrées de bout en bout</p>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none"
              style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConvs.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className="w-full flex items-start gap-3 px-3 py-3.5 text-left transition-colors hover:bg-muted"
              style={{
                borderBottom: '1px solid var(--border)',
                backgroundColor: activeConv === conv.id ? 'var(--muted)' : 'transparent',
              }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
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
                <p className="text-xs truncate mb-1" style={{ color: 'var(--muted-foreground)' }}>{conv.role}</p>
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
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--background)' }}>
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-5 py-3.5"
          style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--shifa-blue), var(--shifa-cyan))' }}
            >
              {active.avatar}
            </div>
            {active.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#059669' }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{active.name}</p>
            <p className="text-xs" style={{ color: active.online ? '#059669' : 'var(--muted-foreground)' }}>
              {active.online ? (isTyping ? 'En train d\'écrire...' : 'En ligne') : active.role}
            </p>
          </div>
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
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
            >
              Aujourd'hui
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          </div>

          {currentMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
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
                  {msg.attachment && <AttachmentBubble attachment={msg.attachment} isMe={msg.sender === 'me'} />}
                </div>
                {/* Time + read status */}
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
                    { icon: 'DocumentTextIcon', label: 'Document' },
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
