'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import {
  getFinancialNotifications,
  markFinancialNotificationRead,
  markAllFinancialNotificationsRead,
  type FinancialNotification,
} from '@/lib/supabase/financialService';
import { useAuth } from '@/contexts/AuthContext';

const NOTIFICATION_TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; tab: string }> = {
  payment_received:       { icon: 'BanknotesIcon',              color: '#16a34a', bg: '#dcfce7', tab: 'Paiements' },
  payment_failed:         { icon: 'ExclamationCircleIcon',      color: '#dc2626', bg: '#fee2e2', tab: 'Paiements' },
  payment_refunded:       { icon: 'ArrowUturnLeftIcon',         color: '#f59e0b', bg: '#fef3c7', tab: 'Paiements' },
  subscription_activated: { icon: 'StarIcon',                   color: '#8b5cf6', bg: '#ede9fe', tab: 'Abonnements' },
  subscription_cancelled: { icon: 'XCircleIcon',                color: '#dc2626', bg: '#fee2e2', tab: 'Abonnements' },
  subscription_renewed:   { icon: 'ArrowPathIcon',              color: '#0ea5e9', bg: '#e0f2fe', tab: 'Abonnements' },
  subscription_expiring:  { icon: 'ClockIcon',                  color: '#f59e0b', bg: '#fef3c7', tab: 'Abonnements' },
  invoice_created:        { icon: 'DocumentTextIcon',           color: '#64748b', bg: '#f1f5f9', tab: 'Factures' },
  invoice_paid:           { icon: 'DocumentCheckIcon',          color: '#16a34a', bg: '#dcfce7', tab: 'Factures' },
  invoice_overdue:        { icon: 'ExclamationTriangleIcon',    color: '#dc2626', bg: '#fee2e2', tab: 'Factures' },
  commission_earned:      { icon: 'TrophyIcon',                 color: '#f59e0b', bg: '#fef3c7', tab: 'Commissions' },
  commission_paid:        { icon: 'BanknotesIcon',              color: '#16a34a', bg: '#dcfce7', tab: 'Commissions' },
  settlement_completed:   { icon: 'CheckCircleIcon',            color: '#16a34a', bg: '#dcfce7', tab: 'Règlements' },
  settlement_failed:      { icon: 'XCircleIcon',                color: '#dc2626', bg: '#fee2e2', tab: 'Règlements' },
  tax_due:                { icon: 'DocumentTextIcon',           color: '#f59e0b', bg: '#fef3c7', tab: 'Taxes' },
  tax_paid:               { icon: 'DocumentCheckIcon',          color: '#16a34a', bg: '#dcfce7', tab: 'Taxes' },
  payout_processed:       { icon: 'ArrowUpTrayIcon',            color: '#0ea5e9', bg: '#e0f2fe', tab: 'Versements' },
  payout_failed:          { icon: 'ExclamationCircleIcon',      color: '#dc2626', bg: '#fee2e2', tab: 'Versements' },
};

const TABS = ['Toutes', 'Paiements', 'Abonnements', 'Factures', 'Commissions', 'Règlements', 'Taxes', 'Versements'];

function formatAmount(amount?: number, currency?: string): string {
  if (!amount) return '';
  return `${amount.toLocaleString('fr-FR')} ${currency || 'XOF'}`;
}

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
  const [notifications, setNotifications] = useState<FinancialNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFinancialNotifications(user.id);
      setNotifications(data);
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
    const supabase = createClient();
    const channel = supabase
      .channel('financial_notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'financial_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as FinancialNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'financial_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.new.id ? (payload.new as FinancialNotification) : n))
          );
        }
      )
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
      await markFinancialNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      await markAllFinancialNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  const tabFilter = TABS[activeTab];
  const filtered =
    tabFilter === 'Toutes'
      ? notifications
      : notifications.filter((n) => {
          const cfg = NOTIFICATION_TYPE_CONFIG[n.notification_type];
          return cfg?.tab === tabFilter;
        });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <Icon name="BellIcon" size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Centre de notifications financières</h1>
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
        <div className="flex items-center gap-2">
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

      {/* Tabs */}
      <div className="border-b px-4 overflow-x-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab, i) => {
            const tabCount = i === 0
              ? notifications.filter((n) => !n.is_read).length
              : notifications.filter((n) => !n.is_read && NOTIFICATION_TYPE_CONFIG[n.notification_type]?.tab === tab).length;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
                style={{ borderColor: activeTab === i ? '#f59e0b' : 'transparent', color: activeTab === i ? '#f59e0b' : 'var(--muted-foreground)' }}
              >
                {tab}
                {tabCount > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full text-white font-bold" style={{ backgroundColor: '#ef4444', fontSize: '10px' }}>
                    {tabCount}
                  </span>
                )}
              </button>
            );
          })}
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
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#f59e0b', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chargement des notifications…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="BellSlashIcon" size={40} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Aucune notification</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {tabFilter === 'Toutes' ? 'Vous n\'avez aucune notification financière.' : `Aucune notification dans la catégorie "${tabFilter}".`}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map((n) => {
              const cfg = NOTIFICATION_TYPE_CONFIG[n.notification_type] || {
                icon: 'BellIcon', color: '#64748b', bg: '#f1f5f9', tab: 'Toutes',
              };
              return (
                <div
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className="flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-muted/30"
                  style={{ backgroundColor: n.is_read ? 'transparent' : cfg.bg + '30' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: cfg.bg }}>
                    <Icon name={cfg.icon as any} size={18} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
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
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{timeAgo(n.created_at)}</span>
                        {!n.is_read && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />}
                      </div>
                    </div>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{n.body}</p>
                    {n.amount && (
                      <p className="text-xs mt-1 font-semibold" style={{ color: cfg.color }}>
                        {formatAmount(n.amount, n.currency)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
