'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  priority: string;
  reference_id?: string;
  reference_type?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string; tab: string }> = {
  appointment_reminder:    { icon: 'CalendarDaysIcon',         color: '#0066ff', bg: '#eff6ff', label: 'Rendez-vous',    tab: 'Rendez-vous' },
  appointment_confirmed:   { icon: 'CheckCircleIcon',          color: '#10b981', bg: '#f0fdf4', label: 'Rendez-vous',    tab: 'Rendez-vous' },
  appointment_cancelled:   { icon: 'XCircleIcon',              color: '#dc2626', bg: '#fef2f2', label: 'Rendez-vous',    tab: 'Rendez-vous' },
  lab_result_available:    { icon: 'BeakerIcon',               color: '#8b5cf6', bg: '#f5f3ff', label: 'Résultats',      tab: 'Résultats' },
  lab_result_alert:        { icon: 'ExclamationTriangleIcon',  color: '#dc2626', bg: '#fef2f2', label: 'Résultats',      tab: 'Résultats' },
  message_received:        { icon: 'ChatBubbleLeftIcon',       color: '#0ea5e9', bg: '#f0f9ff', label: 'Messages',       tab: 'Messages' },
  message_request:         { icon: 'ChatBubbleLeftEllipsisIcon', color: '#0ea5e9', bg: '#f0f9ff', label: 'Messages',     tab: 'Messages' },
  consultation_invitation: { icon: 'UserPlusIcon',             color: '#f59e0b', bg: '#fffbeb', label: 'Consultations',  tab: 'Consultations' },
  consultation_update:     { icon: 'ClipboardDocumentListIcon',color: '#0066ff', bg: '#eff6ff', label: 'Consultations',  tab: 'Consultations' },
  prescription_ready:      { icon: 'DocumentTextIcon',         color: '#10b981', bg: '#f0fdf4', label: 'Prescriptions',  tab: 'Consultations' },
  system:                  { icon: 'BellIcon',                 color: '#64748b', bg: '#f8fafc', label: 'Système',        tab: 'Système' },
};

const TABS = ['Toutes', 'Rendez-vous', 'Résultats', 'Messages', 'Consultations', 'Système'];
const READ_FILTERS = ['Toutes', 'Non lues', 'Lues'];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hier';
  return `Il y a ${days} jours`;
}

export default function NotificationsCenterContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [readFilter, setReadFilter] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const supabase = createClient();

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (fetchError) throw fetchError;
      setNotifications(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`notifications_realtime_${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n))
        );
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected');
        else if (status === 'CHANNEL_ERROR') setRealtimeStatus('error');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleMarkRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('notifications').delete().eq('id', id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const tabFilter = TABS[activeTab];
  const readFilterLabel = READ_FILTERS[readFilter];

  const filtered = notifications.filter((n) => {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['system'];
    const tabMatch = tabFilter === 'Toutes' || cfg.tab === tabFilter;
    const readMatch =
      readFilterLabel === 'Toutes' ||
      (readFilterLabel === 'Non lues' && !n.is_read) ||
      (readFilterLabel === 'Lues' && n.is_read);
    return tabMatch && readMatch;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const tabCounts = TABS.map((tab, i) => {
    if (i === 0) return notifications.filter((n) => !n.is_read).length;
    return notifications.filter((n) => {
      const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['system'];
      return !n.is_read && cfg.tab === tab;
    }).length;
  });

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066ff, #00c2ff)' }}>
            <Icon name="BellIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Centre de notifications</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {loading ? 'Chargement…' : unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes lues'}
              </p>
              <span
                className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: realtimeStatus === 'connected' ? '#dcfce7' : realtimeStatus === 'error' ? '#fee2e2' : '#fef3c7',
                  color: realtimeStatus === 'connected' ? '#16a34a' : realtimeStatus === 'error' ? '#dc2626' : '#f59e0b',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
                {realtimeStatus === 'connected' ? 'Temps réel' : realtimeStatus === 'error' ? 'Erreur' : 'Connexion…'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Read filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
            {READ_FILTERS.map((f, i) => (
              <button
                key={i}
                onClick={() => setReadFilter(i)}
                className="text-xs px-2.5 py-1 rounded-md transition-colors"
                style={{
                  backgroundColor: readFilter === i ? 'var(--card)' : 'transparent',
                  color: readFilter === i ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontWeight: readFilter === i ? 600 : 400,
                  boxShadow: readFilter === i ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-muted"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={loadNotifications}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-muted"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <Icon name="ArrowPathIcon" size={13} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="border-b px-4 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{ borderColor: activeTab === i ? '#0066ff' : 'transparent', color: activeTab === i ? '#0066ff' : 'var(--muted-foreground)' }}
            >
              {tab}
              {tabCounts[i] > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: '#ef4444', fontSize: '10px' }}>
                  {tabCounts[i]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="m-4 p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
            <Icon name="ExclamationCircleIcon" size={18} style={{ color: '#dc2626' }} />
            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
            <button onClick={loadNotifications} className="ml-auto text-xs underline" style={{ color: '#dc2626' }}>Réessayer</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0066ff', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="BellSlashIcon" size={40} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Aucune notification</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {tabFilter === 'Toutes'
                ? readFilterLabel === 'Non lues' ? 'Aucune notification non lue.' : 'Vous n\'avez aucune notification.'
                : `Aucune notification dans la catégorie "${tabFilter}".`}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG['system'];
              return (
                <div
                  key={n.id}
                  className="flex items-start gap-4 px-6 py-4 group transition-colors"
                  style={{ backgroundColor: n.is_read ? 'transparent' : `${cfg.bg}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: cfg.bg }}>
                    <Icon name={cfg.icon as any} size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !n.is_read && handleMarkRead(n.id)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm ${n.is_read ? '' : 'font-semibold'}`} style={{ color: 'var(--foreground)' }}>
                          {n.title}
                        </p>
                        {n.priority === 'high' && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                            Urgent
                          </span>
                        )}
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{timeAgo(n.created_at)}</span>
                        {!n.is_read && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />}
                      </div>
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{n.body}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-muted shrink-0"
                    title="Supprimer"
                  >
                    <Icon name="XMarkIcon" size={14} className="text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
