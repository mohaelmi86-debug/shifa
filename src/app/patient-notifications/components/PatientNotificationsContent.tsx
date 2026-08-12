'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type NotifCategory = 'all' | 'rdv' | 'resultats' | 'prescriptions' | 'messages' | 'systeme';

interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotifCategory;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

const mockNotifs: Notification[] = [
  { id: '1', title: 'Résultats disponibles', body: 'Votre bilan sanguin du 05/08/2026 est disponible. Consultez vos résultats.', category: 'resultats', time: 'Il y a 2h', read: false, icon: 'BeakerIcon', color: '#8b5cf6' },
  { id: '2', title: 'Rappel rendez-vous', body: 'Rendez-vous avec Dr. Mohamed Sy demain à 10h00 — Cabinet médical Plateau.', category: 'rdv', time: 'Il y a 4h', read: false, icon: 'CalendarDaysIcon', color: 'var(--shifa-blue)' },
  { id: '3', title: 'Nouveau message', body: 'Dr. Fatou Ndiaye vous a envoyé un message concernant votre suivi.', category: 'messages', time: 'Il y a 6h', read: false, icon: 'ChatBubbleLeftRightIcon', color: 'var(--shifa-cyan)' },
  { id: '4', title: 'Ordonnance renouvelée', body: 'Votre ordonnance pour Amlodipine 5mg a été renouvelée par Dr. Sy.', category: 'prescriptions', time: 'Hier', read: true, icon: 'DocumentCheckIcon', color: '#10b981' },
  { id: '5', title: 'Rendez-vous confirmé', body: 'Votre rendez-vous du 15/08/2026 à 14h30 a été confirmé.', category: 'rdv', time: 'Hier', read: true, icon: 'CheckCircleIcon', color: '#10b981' },
  { id: '6', title: 'Rappel vaccin grippe', body: 'La saison grippale approche. Pensez à votre vaccination annuelle.', category: 'systeme', time: 'Il y a 2 jours', read: true, icon: 'ShieldCheckIcon', color: '#f59e0b' },
  { id: '7', title: 'Mise à jour dossier', body: 'Votre dossier médical a été mis à jour suite à votre consultation du 01/08/2026.', category: 'systeme', time: 'Il y a 3 jours', read: true, icon: 'FolderOpenIcon', color: 'var(--shifa-blue)' },
];

const categories: { key: NotifCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'Toutes', icon: 'BellIcon' },
  { key: 'rdv', label: 'Rendez-vous', icon: 'CalendarDaysIcon' },
  { key: 'resultats', label: 'Résultats', icon: 'BeakerIcon' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'DocumentCheckIcon' },
  { key: 'messages', label: 'Messages', icon: 'ChatBubbleLeftRightIcon' },
  { key: 'systeme', label: 'Système', icon: 'CogIcon' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
      style={{ backgroundColor: checked ? 'var(--shifa-blue)' : 'var(--border)' }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: checked ? '22px' : '4px' }}
      />
    </button>
  );
}

export default function PatientNotificationsContent() {
  const [activeCategory, setActiveCategory] = useState<NotifCategory>('all');
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [notifications, setNotifications] = useState(mockNotifs);
  const [prefs, setPrefs] = useState({
    rdvEmail: true, rdvSms: true, rdvPush: true,
    resultatsEmail: true, resultatsSms: false, resultatsPush: true,
    prescriptionsEmail: true, prescriptionsSms: false, prescriptionsPush: false,
    messagesEmail: false, messagesSms: false, messagesPush: true,
    systemeEmail: true, systemeSms: false, systemePush: false,
  });

  const filtered = notifications.filter(n => activeCategory === 'all' || n.category === activeCategory);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const togglePref = (key: keyof typeof prefs) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="px-6 lg:px-8 xl:px-10 py-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--shifa-dark)' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full text-white" style={{ backgroundColor: 'var(--shifa-blue)' }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Centre de notifications et préférences de communication</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:shadow-sm"
            style={{ borderColor: 'var(--shifa-blue)', color: 'var(--shifa-blue)', backgroundColor: 'rgba(0,102,255,0.05)' }}
          >
            <Icon name="CheckIcon" size={15} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: 'var(--muted)' }}>
        {[
          { key: 'notifications', label: 'Notifications', icon: 'BellIcon' },
          { key: 'preferences', label: 'Préférences', icon: 'AdjustmentsHorizontalIcon' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.key ? 'var(--card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--shifa-blue)' : 'var(--muted-foreground)',
            }}
          >
            <Icon name={tab.icon as any} size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'notifications' && (
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Category filter */}
          <div className="lg:w-52 shrink-0">
            <div className="card-base p-2">
              <p className="section-label px-3 mb-2">Filtrer</p>
              {categories.map(cat => {
                const count = cat.key === 'all' ? notifications.filter(n => !n.read).length : notifications.filter(n => n.category === cat.key && !n.read).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5"
                    style={{
                      backgroundColor: activeCategory === cat.key ? 'var(--shifa-blue)' : 'transparent',
                      color: activeCategory === cat.key ? 'white' : 'var(--foreground)',
                    }}
                  >
                    <Icon name={cat.icon as any} size={16} />
                    <span className="flex-1 text-left">{cat.label}</span>
                    {count > 0 && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: activeCategory === cat.key ? 'rgba(255,255,255,0.25)' : 'var(--shifa-blue)',
                          color: 'white',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="card-base p-12 text-center">
                <Icon name="BellSlashIcon" size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Aucune notification</p>
              </div>
            ) : filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className="card-base p-4 flex items-start gap-4 cursor-pointer hover:shadow-shifa transition-all"
                style={{ borderLeft: !notif.read ? `3px solid var(--shifa-blue)` : undefined }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${notif.color}18` }}>
                  <Icon name={notif.icon as any} size={20} style={{ color: notif.color } as any} className="" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!notif.read ? '' : 'opacity-70'}`} style={{ color: 'var(--foreground)' }}>{notif.title}</p>
                    <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>{notif.time}</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{notif.body}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: 'var(--shifa-blue)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="card-base p-6 max-w-2xl">
          <h2 className="font-bold mb-5" style={{ color: 'var(--shifa-dark)' }}>Préférences de notification</h2>
          <div className="flex flex-col gap-6">
            {[
              { key: 'rdv', label: 'Rendez-vous', desc: 'Confirmations, rappels et annulations', emailKey: 'rdvEmail', smsKey: 'rdvSms', pushKey: 'rdvPush' },
              { key: 'resultats', label: 'Résultats', desc: 'Disponibilité de nouveaux résultats', emailKey: 'resultatsEmail', smsKey: 'resultatsSms', pushKey: 'resultatsPush' },
              { key: 'prescriptions', label: 'Prescriptions', desc: 'Nouvelles ordonnances et renouvellements', emailKey: 'prescriptionsEmail', smsKey: 'prescriptionsSms', pushKey: 'prescriptionsPush' },
              { key: 'messages', label: 'Messages', desc: 'Nouveaux messages de vos professionnels', emailKey: 'messagesEmail', smsKey: 'messagesSms', pushKey: 'messagesPush' },
              { key: 'systeme', label: 'Système', desc: 'Mises à jour et informations SHIFA', emailKey: 'systemeEmail', smsKey: 'systemeSms', pushKey: 'systemePush' },
            ].map(section => (
              <div key={section.key} className="pb-5 border-b last:border-0 last:pb-0" style={{ borderColor: 'var(--border)' }}>
                <p className="font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>{section.label}</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>{section.desc}</p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: 'Email', key: section.emailKey as keyof typeof prefs },
                    { label: 'SMS', key: section.smsKey as keyof typeof prefs },
                    { label: 'Push', key: section.pushKey as keyof typeof prefs },
                  ].map(channel => (
                    <div key={channel.label} className="flex items-center gap-2">
                      <Toggle checked={prefs[channel.key]} onChange={() => togglePref(channel.key)} />
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{channel.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
