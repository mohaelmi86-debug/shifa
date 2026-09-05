// ─── SHIFA TRANSFER STATE MACHINE ────────────────────────────────────────────
// Real state machine: draft → consent → authorization → acceptance → in-transit → received → completed
// With notifications, document selection, and RLS enforcement per recipient permissions.

import { createClient } from '@/lib/supabase/client';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type TransferStatus =
  | 'draft' |'consent' |'authorization' |'acceptance' |'in-transit' |'received' |'completed' |'cancelled';

export type TransferType = 'inter-service' | 'inter-facility' | 'inter-region' | 'international';
export type TransferUrgency = 'routine' | 'urgent' | 'critical';

export interface TransferDocument {
  id: string;
  label: string;
  category: 'identity' | 'clinical' | 'imaging' | 'lab' | 'prescription' | 'administrative';
  required: boolean;
  selected: boolean;
}

export interface Transfer {
  id: string;
  patientId?: string;
  organizationId?: string;
  fromFacility: string;
  toFacility: string;
  transferType: TransferType;
  urgency: TransferUrgency;
  reason?: string;
  status: TransferStatus;
  consentObtained: boolean;
  consentObtainedAt?: string;
  authorizedBy?: string;
  authorizedAt?: string;
  acceptedBy?: string;
  acceptedAt?: string;
  departedAt?: string;
  receivedAt?: string;
  completedAt?: string;
  selectedDocuments: string[];
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferNotification {
  id: string;
  transferId: string;
  recipientUserId: string;
  notificationType: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StateTransition {
  from: TransferStatus;
  to: TransferStatus;
  label: string;
  requiresConsent?: boolean;
  requiresAuthorization?: boolean;
  notificationMessage: string;
}

// ─── STATE MACHINE DEFINITION ─────────────────────────────────────────────────

export const TRANSFER_STATES: Record<TransferStatus, {
  label: string;
  labelFr: string;
  color: string;
  bg: string;
  icon: string;
  description: string;
  allowedRoles: string[];
}> = {
  draft: {
    label: 'Draft',
    labelFr: 'Brouillon',
    color: '#64748b',
    bg: '#f1f5f9',
    icon: 'DocumentIcon',
    description: 'Transfert en cours de préparation',
    allowedRoles: ['professional', 'doctor', 'nurse', 'org_admin', 'platform_admin'],
  },
  consent: {
    label: 'Consent',
    labelFr: 'Consentement',
    color: '#d97706',
    bg: '#fef3c7',
    icon: 'ClipboardDocumentCheckIcon',
    description: 'En attente du consentement du patient',
    allowedRoles: ['professional', 'doctor', 'nurse', 'org_admin', 'platform_admin'],
  },
  authorization: {
    label: 'Authorization',
    labelFr: 'Autorisation',
    color: '#7c3aed',
    bg: '#ede9fe',
    icon: 'ShieldCheckIcon',
    description: 'En attente d\'autorisation médicale',
    allowedRoles: ['doctor', 'org_admin', 'platform_admin'],
  },
  acceptance: {
    label: 'Acceptance',
    labelFr: 'Acceptation',
    color: '#0891b2',
    bg: '#cffafe',
    icon: 'CheckCircleIcon',
    description: 'En attente d\'acceptation par l\'établissement destinataire',
    allowedRoles: ['doctor', 'org_admin', 'platform_admin'],
  },
  'in-transit': {
    label: 'In Transit',
    labelFr: 'En transit',
    color: '#2563eb',
    bg: '#dbeafe',
    icon: 'TruckIcon',
    description: 'Patient en cours de transfert',
    allowedRoles: ['professional', 'doctor', 'nurse', 'org_admin', 'platform_admin'],
  },
  received: {
    label: 'Received',
    labelFr: 'Reçu',
    color: '#059669',
    bg: '#d1fae5',
    icon: 'CheckBadgeIcon',
    description: 'Patient reçu par l\'établissement destinataire',
    allowedRoles: ['professional', 'doctor', 'nurse', 'org_admin', 'platform_admin'],
  },
  completed: {
    label: 'Completed',
    labelFr: 'Terminé',
    color: '#16a34a',
    bg: '#dcfce7',
    icon: 'CheckCircleIcon',
    description: 'Transfert complété avec succès',
    allowedRoles: ['professional', 'doctor', 'nurse', 'org_admin', 'platform_admin'],
  },
  cancelled: {
    label: 'Cancelled',
    labelFr: 'Annulé',
    color: '#dc2626',
    bg: '#fee2e2',
    icon: 'XCircleIcon',
    description: 'Transfert annulé',
    allowedRoles: ['professional', 'doctor', 'org_admin', 'platform_admin'],
  },
};

export const VALID_TRANSITIONS: StateTransition[] = [
  {
    from: 'draft',
    to: 'consent',
    label: 'Demander consentement',
    requiresConsent: false,
    notificationMessage: 'Consentement requis pour le transfert du patient',
  },
  {
    from: 'consent',
    to: 'authorization',
    label: 'Consentement obtenu → Demander autorisation',
    requiresConsent: true,
    notificationMessage: 'Autorisation médicale requise pour le transfert',
  },
  {
    from: 'authorization',
    to: 'acceptance',
    label: 'Autoriser → Demander acceptation',
    requiresAuthorization: true,
    notificationMessage: 'Acceptation requise par l\'établissement destinataire',
  },
  {
    from: 'acceptance',
    to: 'in-transit',
    label: 'Accepté → Départ',
    notificationMessage: 'Le patient est en cours de transfert',
  },
  {
    from: 'in-transit',
    to: 'received',
    label: 'Confirmer réception',
    notificationMessage: 'Le patient a été reçu par l\'établissement destinataire',
  },
  {
    from: 'received',
    to: 'completed',
    label: 'Clôturer le transfert',
    notificationMessage: 'Le transfert a été complété avec succès',
  },
  // Cancellation from any non-terminal state
  { from: 'draft', to: 'cancelled', label: 'Annuler', notificationMessage: 'Le transfert a été annulé' },
  { from: 'consent', to: 'cancelled', label: 'Annuler', notificationMessage: 'Le transfert a été annulé' },
  { from: 'authorization', to: 'cancelled', label: 'Annuler', notificationMessage: 'Le transfert a été annulé' },
  { from: 'acceptance', to: 'cancelled', label: 'Annuler', notificationMessage: 'Le transfert a été annulé' },
];

export const AVAILABLE_DOCUMENTS: TransferDocument[] = [
  { id: 'identity', label: 'Identité du patient', category: 'identity', required: true, selected: true },
  { id: 'reason', label: 'Motif & diagnostic principal', category: 'clinical', required: true, selected: true },
  { id: 'vitals', label: 'Constantes vitales récentes', category: 'clinical', required: false, selected: false },
  { id: 'prescriptions', label: 'Prescriptions en cours', category: 'prescription', required: false, selected: false },
  { id: 'lab_results', label: 'Résultats biologiques', category: 'lab', required: false, selected: false },
  { id: 'imaging', label: 'Imagerie médicale (DICOM)', category: 'imaging', required: false, selected: false },
  { id: 'surgical_reports', label: 'Comptes-rendus opératoires', category: 'clinical', required: false, selected: false },
  { id: 'consent_form', label: 'Formulaire de consentement signé', category: 'administrative', required: false, selected: false },
  { id: 'insurance', label: 'Informations assurance', category: 'administrative', required: false, selected: false },
  { id: 'transport_info', label: 'Informations de transport', category: 'administrative', required: false, selected: false },
];

// ─── TRANSFER STATE MACHINE SERVICE ──────────────────────────────────────────

export class TransferStateMachineService {
  private supabase = createClient();

  // ─── CREATE TRANSFER (draft) ────────────────────────────────────────────

  async createTransfer(data: {
    patientId?: string;
    organizationId?: string;
    fromFacility: string;
    toFacility: string;
    transferType: TransferType;
    urgency: TransferUrgency;
    reason?: string;
    selectedDocuments?: string[];
    notes?: string;
  }): Promise<{ transfer: Transfer | null; error: string | null }> {
    try {
      const { data: transfer, error } = await this.supabase
        .from('patient_transfers')
        .insert({
          patient_id: data.patientId,
          organization_id: data.organizationId,
          from_facility: data.fromFacility,
          to_facility: data.toFacility,
          transfer_type: data.transferType,
          urgency: data.urgency,
          reason: data.reason,
          status: 'draft',
          selected_documents: data.selectedDocuments || ['identity', 'reason'],
          notes: data.notes,
          consent_obtained: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Log platform event
      await this.logPlatformEvent({
        eventType: 'transfer.created',
        sourceModule: 'patient-transfer',
        organizationId: data.organizationId,
        payload: { transferId: transfer.id, status: 'draft', urgency: data.urgency },
        severity: data.urgency === 'critical' ? 'critical' : 'info',
      });

      return { transfer: this.mapTransfer(transfer), error: null };
    } catch (err) {
      return { transfer: null, error: err instanceof Error ? err.message : 'Erreur création transfert' };
    }
  }

  // ─── ADVANCE STATE ───────────────────────────────────────────────────────

  async advanceState(
    transferId: string,
    toStatus: TransferStatus,
    options?: {
      consentObtained?: boolean;
      authorizedBy?: string;
      acceptedBy?: string;
      notes?: string;
      recipientUserIds?: string[];
    }
  ): Promise<{ transfer: Transfer | null; error: string | null }> {
    try {
      // Fetch current transfer
      const { data: current, error: fetchError } = await this.supabase
        .from('patient_transfers')
        .select('*')
        .eq('id', transferId)
        .single();

      if (fetchError || !current) throw new Error('Transfert introuvable');

      const currentStatus = current.status as TransferStatus;

      // Validate transition
      const validTransition = VALID_TRANSITIONS.find(
        t => t.from === currentStatus && t.to === toStatus
      );
      if (!validTransition) {
        throw new Error(`Transition invalide: ${currentStatus} → ${toStatus}`);
      }

      // Build update payload
      const updatePayload: Record<string, unknown> = {
        status: toStatus,
        updated_at: new Date().toISOString(),
        updated_by: (await this.supabase.auth.getUser()).data.user?.id,
      };

      if (toStatus === 'consent' && options?.consentObtained) {
        updatePayload.consent_obtained = true;
        updatePayload.consent_obtained_at = new Date().toISOString();
      }
      if (toStatus === 'authorization' && options?.authorizedBy) {
        updatePayload.authorized_by = options.authorizedBy;
        updatePayload.authorized_at = new Date().toISOString();
      }
      if (toStatus === 'acceptance' && options?.acceptedBy) {
        updatePayload.accepted_by = options.acceptedBy;
        updatePayload.accepted_at = new Date().toISOString();
      }
      if (toStatus === 'in-transit') {
        updatePayload.departed_at = new Date().toISOString();
      }
      if (toStatus === 'received') {
        updatePayload.received_at = new Date().toISOString();
      }
      if (toStatus === 'completed') {
        updatePayload.completed_at = new Date().toISOString();
      }
      if (options?.notes) {
        updatePayload.notes = options.notes;
      }

      const { data: updated, error: updateError } = await this.supabase
        .from('patient_transfers')
        .update(updatePayload)
        .eq('id', transferId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Send notifications
      if (options?.recipientUserIds?.length) {
        await this.sendNotifications(
          transferId,
          options.recipientUserIds,
          toStatus,
          validTransition.notificationMessage
        );
      }

      // Log platform event
      await this.logPlatformEvent({
        eventType: `transfer.${toStatus}`,
        sourceModule: 'patient-transfer',
        organizationId: current.organization_id,
        payload: { transferId, fromStatus: currentStatus, toStatus },
        severity: toStatus === 'cancelled' ? 'warning' : 'info',
      });

      return { transfer: this.mapTransfer(updated), error: null };
    } catch (err) {
      return { transfer: null, error: err instanceof Error ? err.message : 'Erreur transition état' };
    }
  }

  // ─── UPDATE DOCUMENTS ────────────────────────────────────────────────────

  async updateSelectedDocuments(
    transferId: string,
    documentIds: string[]
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('patient_transfers')
        .update({
          selected_documents: documentIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transferId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erreur mise à jour documents' };
    }
  }

  // ─── SEND NOTIFICATIONS ──────────────────────────────────────────────────

  private async sendNotifications(
    transferId: string,
    recipientUserIds: string[],
    status: TransferStatus,
    message: string
  ): Promise<void> {
    const notifications = recipientUserIds.map(userId => ({
      transfer_id: transferId,
      recipient_user_id: userId,
      notification_type: `transfer.${status}`,
      message,
      read: false,
    }));

    await this.supabase.from('transfer_notifications').insert(notifications);
  }

  // ─── LOG PLATFORM EVENT ──────────────────────────────────────────────────

  async logPlatformEvent(data: {
    eventType: string;
    sourceModule: string;
    targetModule?: string;
    organizationId?: string;
    patientId?: string;
    payload?: Record<string, unknown>;
    severity?: 'info' | 'warning' | 'error' | 'critical';
  }): Promise<void> {
    try {
      const userId = (await this.supabase.auth.getUser()).data.user?.id;
      await this.supabase.from('platform_events').insert({
        event_type: data.eventType,
        source_module: data.sourceModule,
        target_module: data.targetModule,
        organization_id: data.organizationId,
        user_id: userId,
        patient_id: data.patientId,
        payload: data.payload || {},
        severity: data.severity || 'info',
        resolved: false,
      });
    } catch {
      // Non-blocking — event logging failure should not break main flow
    }
  }

  // ─── SUBSCRIBE TO TRANSFER EVENTS ───────────────────────────────────────

  subscribeToTransfers(
    organizationId: string,
    onEvent: (transfer: Transfer) => void
  ): () => void {
    const channel = this.supabase
      .channel(`transfers-org-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_transfers',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            onEvent(this.mapTransfer(payload.new as Record<string, unknown>));
          }
        }
      )
      .subscribe();

    return () => { this.supabase.removeChannel(channel); };
  }

  // ─── SUBSCRIBE TO PLATFORM EVENTS ───────────────────────────────────────

  subscribeToPlatformEvents(
    onEvent: (event: Record<string, unknown>) => void
  ): () => void {
    const channel = this.supabase
      .channel('platform-events-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'platform_events' },
        (payload) => {
          if (payload.new) onEvent(payload.new as Record<string, unknown>);
        }
      )
      .subscribe();

    return () => { this.supabase.removeChannel(channel); };
  }

  // ─── FETCH TRANSFERS ─────────────────────────────────────────────────────

  async fetchTransfers(filters?: {
    status?: TransferStatus;
    organizationId?: string;
    limit?: number;
  }): Promise<Transfer[]> {
    try {
      let query = this.supabase
        .from('patient_transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status) as typeof query;
      if (filters?.organizationId) query = query.eq('organization_id', filters.organizationId) as typeof query;
      if (filters?.limit) query = query.limit(filters.limit) as typeof query;

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(this.mapTransfer);
    } catch {
      return [];
    }
  }

  // ─── FETCH PLATFORM EVENTS ───────────────────────────────────────────────

  async fetchPlatformEvents(limit = 50): Promise<Record<string, unknown>[]> {
    try {
      const { data, error } = await this.supabase
        .from('platform_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  }

  // ─── MAPPER ──────────────────────────────────────────────────────────────

  private mapTransfer(raw: Record<string, unknown>): Transfer {
    return {
      id: String(raw.id ?? ''),
      patientId: raw.patient_id ? String(raw.patient_id) : undefined,
      organizationId: raw.organization_id ? String(raw.organization_id) : undefined,
      fromFacility: String(raw.from_facility ?? ''),
      toFacility: String(raw.to_facility ?? ''),
      transferType: (raw.transfer_type as TransferType) ?? 'inter-service',
      urgency: (raw.urgency as TransferUrgency) ?? 'routine',
      reason: raw.reason ? String(raw.reason) : undefined,
      status: (raw.status as TransferStatus) ?? 'draft',
      consentObtained: Boolean(raw.consent_obtained),
      consentObtainedAt: raw.consent_obtained_at ? String(raw.consent_obtained_at) : undefined,
      authorizedBy: raw.authorized_by ? String(raw.authorized_by) : undefined,
      authorizedAt: raw.authorized_at ? String(raw.authorized_at) : undefined,
      acceptedBy: raw.accepted_by ? String(raw.accepted_by) : undefined,
      acceptedAt: raw.accepted_at ? String(raw.accepted_at) : undefined,
      departedAt: raw.departed_at ? String(raw.departed_at) : undefined,
      receivedAt: raw.received_at ? String(raw.received_at) : undefined,
      completedAt: raw.completed_at ? String(raw.completed_at) : undefined,
      selectedDocuments: Array.isArray(raw.selected_documents) ? raw.selected_documents as string[] : [],
      notes: raw.notes ? String(raw.notes) : undefined,
      createdBy: raw.created_by ? String(raw.created_by) : undefined,
      updatedBy: raw.updated_by ? String(raw.updated_by) : undefined,
      createdAt: String(raw.created_at ?? new Date().toISOString()),
      updatedAt: String(raw.updated_at ?? new Date().toISOString()),
    };
  }
}

// ─── SINGLETON ────────────────────────────────────────────────────────────────

export const transferStateMachine = new TransferStateMachineService();

// ─── REACT HOOK ───────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';

export function useTransferStateMachine(organizationId?: string) {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    const data = await transferStateMachine.fetchTransfers({ organizationId });
    setTransfers(data);
    setLoading(false);
  }, [organizationId]);

  useEffect(() => {
    fetchTransfers();

    if (!organizationId) return;

    const unsub = transferStateMachine.subscribeToTransfers(organizationId, (updated) => {
      setTransfers(prev => {
        const idx = prev.findIndex(t => t.id === updated.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [updated, ...prev];
      });
    });

    return unsub;
  }, [organizationId, fetchTransfers]);

  const advanceState = useCallback(async (
    transferId: string,
    toStatus: TransferStatus,
    options?: Parameters<typeof transferStateMachine.advanceState>[2]
  ) => {
    const result = await transferStateMachine.advanceState(transferId, toStatus, options);
    if (!result.error) {
      await fetchTransfers();
    }
    return result;
  }, [fetchTransfers]);

  const createTransfer = useCallback(async (
    data: Parameters<typeof transferStateMachine.createTransfer>[0]
  ) => {
    const result = await transferStateMachine.createTransfer(data);
    if (!result.error) {
      await fetchTransfers();
    }
    return result;
  }, [fetchTransfers]);

  return {
    transfers,
    loading,
    error,
    advanceState,
    createTransfer,
    refetch: fetchTransfers,
    getValidTransitions: (status: TransferStatus) =>
      VALID_TRANSITIONS.filter(t => t.from === status),
  };
}
