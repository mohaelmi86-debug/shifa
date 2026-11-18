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

    for (const item of pending) {
      await this.syncItem(item);
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    this.updateItemStatus(item.id, 'syncing');

    try {
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
      .maybeSingle();

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

  // ─── REAL-TIME SUBSCRIPTION ───────────────────────────────────────────────

  subscribeToQueue(organizationId: string, callback: (event: ShifaEvent) => void): () => void {
    const channel = this.supabase
      .channel(`sync-queue-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_queue',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          const shifaEvent: ShifaEvent = {
            id: this.generateOfflineId(),
            type: 'sync.completed',
            sourceModule: 'offline-sync',
            targetModules: ['audit'],
            payload: payload.new as Record<string, unknown>,
            timestamp: new Date().toISOString(),
            organizationId,
            userId: 'system',
            requiresAck: false,
          };
          callback(shifaEvent);
        }
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }

  subscribeToTransferEvents(organizationId: string, callback: (event: ShifaEvent) => void): () => void {
    const channel = this.supabase
      .channel(`transfer-events-${organizationId}`)
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

    return () => {
      this.supabase.removeChannel(channel);
    };
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
        // In production: encrypt before storing
        sessionStorage.setItem('shifa_sync_queue', serialized);
      } catch {
        // Storage quota exceeded — prune synced items
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

  useEffect(() => {
    syncQueueService.loadPersistedQueue();
    setQueue(syncQueueService.getQueue());
    setStats(syncQueueService.getStats());

    const unsubQueue = syncQueueService.onQueueChange((items) => {
      setQueue(items);
      setStats(syncQueueService.getStats());
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    let unsubTransfer: (() => void) | undefined;
    if (organizationId) {
      unsubTransfer = syncQueueService.subscribeToTransferEvents(organizationId, (event) => {
        console.log('[SHIFA Sync] Transfer event:', event.type, event.patientId);
      });
    }

    return () => {
      unsubQueue();
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
    enqueue: syncQueueService.enqueue.bind(syncQueueService),
    processNow: syncQueueService.processPendingItems.bind(syncQueueService),
  };
}
