// ─── SHIFA SUPABASE REAL-TIME SYNC QUEUE SERVICE ─────────────────────────────
// Manages offline-first operations with Supabase real-time synchronization.
// Handles conflict detection, retry logic, and audit trail.

import { createClient } from '@/lib/supabase/client';
import type { SyncQueueItem, SyncStatus, SyncConflict, ShifaEvent } from '@/lib/moduleInterconnect';

// ─── SYNC QUEUE SERVICE ───────────────────────────────────────────────────────

export class ShifaSyncQueueService {
  private supabase = createClient();
  private localQueue: SyncQueueItem[] = [];
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(items: SyncQueueItem[]) => void> = [];
  private activeChannels: Map<string, ReturnType<ReturnType<typeof createClient>['channel']>> = new Map();
  private conflictResolvers: Map<string, (conflict: SyncConflict) => 'server' | 'client' | 'merge'> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  // ─── ENQUEUE OPERATION ───────────────────────────────────────────────────

  enqueue(item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'attemptCount' | 'status' | 'encryptedLocally'>): SyncQueueItem {
    const queueItem: SyncQueueItem = {
      ...item,
      id: this.generateOfflineId(),
      createdAt: new Date().toISOString(),
      attemptCount: 0,
      status: 'pending',
      encryptedLocally: true,
    };

    this.localQueue.push(queueItem);
    this.persistLocalQueue();
    this.notifyListeners();

    if (this.isOnline) {
      this.processPendingItems();
    }

    return queueItem;
  }

  // ─── PROCESS QUEUE ────────────────────────────────────────────────────────

  async processPendingItems(): Promise<void> {
    const pending = this.localQueue
      .filter(item => item.status === 'pending' || item.status === 'error')
      .filter(item => item.attemptCount < item.maxAttempts)
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    for (let item of pending) {
      await this.syncItem(item);
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    this.updateItemStatus(item.id, 'syncing');

    try {
      // Conflict detection before upsert
      const conflict = await this.detectConflicts(item);
      if (conflict) {
        const resolver = this.conflictResolvers.get(item.moduleId) || (() => 'server' as const);
        const resolution = resolver(conflict);

        if (resolution === 'server') {
          // Server wins — discard local change
          this.updateItemStatus(item.id, 'synced', { syncedAt: new Date().toISOString() });
          this.notifyListeners();
          return;
        } else if (resolution === 'merge') {
          // Merge payloads
          item = {
            ...item,
            payload: { ...conflict.serverVersion, ...conflict.clientVersion },
          };
        }
        // 'client' falls through to normal upsert
      }

      const { error } = await this.supabase
        .from('sync_queue')
        .upsert({
          id: item.id,
          operation_type: item.operationType,
          module_id: item.moduleId,
          payload: item.payload,
          patient_id: item.patientId,
          organization_id: item.organizationId,
          created_at: item.createdAt,
          attempt_count: item.attemptCount + 1,
          status: 'syncing',
          priority: item.priority,
        });

      if (error) {
        throw error;
      }

      this.updateItemStatus(item.id, 'synced', { syncedAt: new Date().toISOString() });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown sync error';
      this.updateItemStatus(item.id, 'error', {
        errorMessage,
        attemptCount: item.attemptCount + 1,
      });
    }

    this.notifyListeners();
  }

  // ─── CONFLICT DETECTION ───────────────────────────────────────────────────

  async detectConflicts(item: SyncQueueItem): Promise<SyncConflict | null> {
    if (!item.patientId) return null;

    const { data: serverRecord } = await this.supabase
      .from('sync_queue')
      .select('*')
      .eq('patient_id', item.patientId)
      .eq('module_id', item.moduleId)
      .eq('status', 'synced')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!serverRecord) return null;

    const serverTime = new Date(serverRecord.created_at).getTime();
    const clientTime = new Date(item.createdAt).getTime();

    if (serverTime > clientTime) {
      return {
        id: this.generateOfflineId(),
        queueItemId: item.id,
        serverVersion: serverRecord.payload as Record<string, unknown>,
        clientVersion: item.payload,
        field: 'payload',
        detectedAt: new Date().toISOString(),
      };
    }

    return null;
  }

  // ─── CONFLICT RESOLUTION STRATEGY ────────────────────────────────────────

  registerConflictResolver(
    moduleId: string,
    resolver: (conflict: SyncConflict) => 'server' | 'client' | 'merge'
  ): void {
    this.conflictResolvers.set(moduleId, resolver);
  }

  resolveConflict(itemId: string, resolution: 'server' | 'client'): void {
    let item = this.localQueue.find(i => i.id === itemId);
    if (!item) return;

    if (resolution === 'server') {
      this.updateItemStatus(itemId, 'synced', { syncedAt: new Date().toISOString() });
    } else {
      // Force re-sync with client version
      this.updateItemStatus(itemId, 'pending', { attemptCount: 0 });
      if (this.isOnline) {
        this.processPendingItems();
      }
    }
    this.notifyListeners();
  }

  // ─── REAL-TIME SUBSCRIPTION (enhanced bi-directional) ────────────────────

  subscribeToQueue(organizationId: string, callback: (event: ShifaEvent) => void): () => void {
    const channelKey = `sync-queue-${organizationId}`;
    if (this.activeChannels.has(channelKey)) {
      const existing = this.activeChannels.get(channelKey)!;
      this.supabase.removeChannel(existing);
    }

    const channel = this.supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_queue',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          const newRecord = payload.new as Record<string, unknown>;
          // Bi-directional: if server updated a record we have locally, update local state
          if (newRecord?.id && typeof newRecord.id === 'string') {
            const localItem = this.localQueue.find(i => i.id === newRecord.id);
            if (localItem && newRecord.status === 'synced') {
              this.updateItemStatus(newRecord.id, 'synced', {
                syncedAt: String(newRecord.updated_at ?? new Date().toISOString()),
              });
            }
          }

          const shifaEvent: ShifaEvent = {
            id: this.generateOfflineId(),
            type: 'sync.completed',
            sourceModule: 'offline-sync',
            targetModules: ['audit'],
            payload: newRecord,
            timestamp: new Date().toISOString(),
            organizationId,
            userId: 'system',
            requiresAck: false,
          };
          callback(shifaEvent);
        }
      )
      .subscribe();

    this.activeChannels.set(channelKey, channel);

    return () => {
      this.supabase.removeChannel(channel);
      this.activeChannels.delete(channelKey);
    };
  }

  subscribeToTransferEvents(organizationId: string, callback: (event: ShifaEvent) => void): () => void {
    const channelKey = `transfer-events-${organizationId}`;
    if (this.activeChannels.has(channelKey)) {
      const existing = this.activeChannels.get(channelKey)!;
      this.supabase.removeChannel(existing);
    }

    const channel = this.supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'patient_transfers',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          const newRecord = payload.new as Record<string, unknown>;
          const shifaEvent: ShifaEvent = {
            id: this.generateOfflineId(),
            type: `transfer.${newRecord.status}` as ShifaEvent['type'],
            sourceModule: 'patient-transfer',
            targetModules: ['audit', 'hospitalization', 'billing'],
            payload: newRecord,
            timestamp: new Date().toISOString(),
            organizationId,
            userId: String(newRecord.updated_by ?? 'system'),
            patientId: String(newRecord.patient_id ?? ''),
            requiresAck: true,
          };
          callback(shifaEvent);
        }
      )
      .subscribe();

    this.activeChannels.set(channelKey, channel);

    return () => {
      this.supabase.removeChannel(channel);
      this.activeChannels.delete(channelKey);
    };
  }

  // ─── SUBSCRIBE TO ALL MODULE EVENTS (for Super Admin live screen) ─────────

  subscribeToAllModuleEvents(callback: (event: Record<string, unknown>) => void): () => void {
    const channelKey = 'platform-events-all';
    if (this.activeChannels.has(channelKey)) {
      const existing = this.activeChannels.get(channelKey)!;
      this.supabase.removeChannel(existing);
    }

    const channel = this.supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'platform_events' },
        (payload) => {
          if (payload.new) callback(payload.new as Record<string, unknown>);
        }
      )
      .subscribe();

    this.activeChannels.set(channelKey, channel);

    return () => {
      this.supabase.removeChannel(channel);
      this.activeChannels.delete(channelKey);
    };
  }

  // ─── CLEANUP ALL CHANNELS ─────────────────────────────────────────────────

  cleanupAllChannels(): void {
    this.activeChannels.forEach(channel => {
      this.supabase.removeChannel(channel);
    });
    this.activeChannels.clear();
  }

  // ─── QUEUE STATS ──────────────────────────────────────────────────────────

  getStats() {
    return {
      total: this.localQueue.length,
      pending: this.localQueue.filter(i => i.status === 'pending').length,
      syncing: this.localQueue.filter(i => i.status === 'syncing').length,
      synced: this.localQueue.filter(i => i.status === 'synced').length,
      conflicts: this.localQueue.filter(i => i.status === 'conflict').length,
      errors: this.localQueue.filter(i => i.status === 'error').length,
      critical: this.localQueue.filter(i => i.priority === 'critical' && i.status === 'pending').length,
    };
  }

  getQueue(): SyncQueueItem[] {
    return [...this.localQueue];
  }

  // ─── LISTENERS ────────────────────────────────────────────────────────────

  onQueueChange(listener: (items: SyncQueueItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l(this.getQueue()));
  }

  // ─── INTERNAL HELPERS ─────────────────────────────────────────────────────

  private handleOnline(): void {
    this.isOnline = true;
    this.processPendingItems();
  }

  private handleOffline(): void {
    this.isOnline = false;
  }

  private updateItemStatus(
    id: string,
    status: SyncStatus,
    extra?: Partial<SyncQueueItem>
  ): void {
    this.localQueue = this.localQueue.map(item =>
      item.id === id ? { ...item, status, ...extra } : item
    );
    this.persistLocalQueue();
  }

  private persistLocalQueue(): void {
    if (typeof window !== 'undefined') {
      try {
        const serialized = JSON.stringify(this.localQueue);
        sessionStorage.setItem('shifa_sync_queue', serialized);
      } catch {
        this.localQueue = this.localQueue.filter(i => i.status !== 'synced');
      }
    }
  }

  private generateOfflineId(): string {
    return `offline-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  loadPersistedQueue(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('shifa_sync_queue');
        if (stored) {
          this.localQueue = JSON.parse(stored) as SyncQueueItem[];
        }
      } catch {
        this.localQueue = [];
      }
    }
  }
}

// ─── SINGLETON EXPORT ─────────────────────────────────────────────────────────

export const syncQueueService = new ShifaSyncQueueService();

// ─── REACT HOOK ───────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

export function useSyncQueue(organizationId?: string) {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [stats, setStats] = useState(syncQueueService.getStats());
  const [isOnline, setIsOnline] = useState(true);
  const [liveEvents, setLiveEvents] = useState<ShifaEvent[]>([]);

  useEffect(() => {
    syncQueueService.loadPersistedQueue();
    setQueue(syncQueueService.getQueue());
    setStats(syncQueueService.getStats());

    const unsubQueue = syncQueueService.onQueueChange((items) => {
      setQueue(items);
      setStats(syncQueueService.getStats());
    });

    const handleOnline = () => {
      setIsOnline(true);
      syncQueueService.processPendingItems();
    };
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    let unsubSync: (() => void) | undefined;
    let unsubTransfer: (() => void) | undefined;

    if (organizationId) {
      unsubSync = syncQueueService.subscribeToQueue(organizationId, (event) => {
        setLiveEvents(prev => [event, ...prev].slice(0, 50));
      });

      unsubTransfer = syncQueueService.subscribeToTransferEvents(organizationId, (event) => {
        setLiveEvents(prev => [event, ...prev].slice(0, 50));
      });
    }

    return () => {
      unsubQueue();
      unsubSync?.();
      unsubTransfer?.();
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [organizationId]);

  return {
    queue,
    stats,
    isOnline,
    liveEvents,
    enqueue: syncQueueService.enqueue.bind(syncQueueService),
    processNow: syncQueueService.processPendingItems.bind(syncQueueService),
    resolveConflict: syncQueueService.resolveConflict.bind(syncQueueService),
    registerConflictResolver: syncQueueService.registerConflictResolver.bind(syncQueueService),
  };
}
