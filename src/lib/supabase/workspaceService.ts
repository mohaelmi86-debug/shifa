'use client';

import { createClient } from './client';

export interface WorkspaceProfile {
  professionalId: string | null;
  profession: string | null;
  specialty: string | null;
  firstName: string;
  lastName: string;
  status: string;
  isVerified: boolean;
  organizationId: string | null;
  organizationName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  roleTitle: string | null;
  permissions: Record<string, any>;
  activatedModuleCodes: string[];
}

export interface WorkspaceKPIs {
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
  teleconsultToday: number;
  totalPatients: number;
  recentRecords: number;
  pendingRecords: number;
}

export interface WorkspaceAlert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  action?: string;
  actionHref?: string;
}

/**
 * Fetch the professional profile for the current authenticated user.
 * Returns null if the user is not a professional.
 */
export async function fetchWorkspaceProfile(userId: string): Promise<WorkspaceProfile | null> {
  const supabase = createClient();

  // 1. Fetch professional record
  const { data: prof, error: profError } = await supabase
    .from('professionals')
    .select('id, first_name, last_name, profession, specialty, status, is_verified')
    .eq('user_id', userId)
    .maybeSingle();

  if (profError || !prof) return null;

  // 2. Fetch primary organization link
  const { data: orgLink } = await supabase
    .from('professional_organizations')
    .select(`
      organization_id,
      department_id,
      role_title,
      permissions,
      organizations ( id, name ),
      departments ( id, name )
    `)
    .eq('professional_id', prof.id)
    .eq('status', 'active')
    .eq('invitation_status', 'accepted')
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle();

  const org = orgLink?.organizations as any;
  const dept = orgLink?.departments as any;

  // 3. Fetch activated modules for the organization
  let activatedModuleCodes: string[] = [];
  if (orgLink?.organization_id) {
    const { data: orgModules } = await supabase
      .from('organization_modules')
      .select('modules ( code )')
      .eq('organization_id', orgLink.organization_id)
      .eq('is_active', true);

    if (orgModules) {
      activatedModuleCodes = orgModules
        .map((m: any) => m.modules?.code)
        .filter(Boolean);
    }
  }

  return {
    professionalId: prof.id,
    profession: prof.profession,
    specialty: prof.specialty,
    firstName: prof.first_name,
    lastName: prof.last_name,
    status: prof.status,
    isVerified: prof.is_verified,
    organizationId: orgLink?.organization_id ?? null,
    organizationName: org?.name ?? null,
    departmentId: orgLink?.department_id ?? null,
    departmentName: dept?.name ?? null,
    roleTitle: orgLink?.role_title ?? null,
    permissions: (orgLink?.permissions as Record<string, any>) ?? {},
    activatedModuleCodes,
  };
}

/**
 * Fetch role-specific KPIs for the professional.
 * Filtered by professional_id and organization_id.
 */
export async function fetchWorkspaceKPIs(
  professionalId: string,
  organizationId: string | null
): Promise<WorkspaceKPIs> {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  const todayStart = `${today}T00:00:00.000Z`;
  const todayEnd = `${today}T23:59:59.999Z`;

  // Today's appointments
  let apptQuery = supabase
    .from('appointments')
    .select('id, status, teleconsultation', { count: 'exact' })
    .eq('professional_id', professionalId)
    .gte('scheduled_at', todayStart)
    .lte('scheduled_at', todayEnd);

  if (organizationId) {
    apptQuery = apptQuery.eq('organization_id', organizationId);
  }

  const { data: todayAppts, count: totalToday } = await apptQuery;

  const pendingAppts = todayAppts?.filter(a =>
    ['scheduled', 'confirmed'].includes(a.status)
  ).length ?? 0;

  const completedToday = todayAppts?.filter(a => a.status === 'completed').length ?? 0;
  const teleconsultToday = todayAppts?.filter(a => a.teleconsultation).length ?? 0;

  // Total distinct patients
  let patientsQuery = supabase
    .from('appointments')
    .select('patient_id', { count: 'exact' })
    .eq('professional_id', professionalId);

  if (organizationId) {
    patientsQuery = patientsQuery.eq('organization_id', organizationId);
  }

  const { data: patientRows } = await patientsQuery;
  const uniquePatients = new Set(patientRows?.map(r => r.patient_id) ?? []).size;

  // Recent health records (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let recordsQuery = supabase
    .from('health_records')
    .select('id, is_signed', { count: 'exact' })
    .eq('professional_id', professionalId)
    .gte('created_at', sevenDaysAgo);

  if (organizationId) {
    recordsQuery = recordsQuery.eq('organization_id', organizationId);
  }

  const { data: recentRecords, count: recordCount } = await recordsQuery;
  const pendingRecords = recentRecords?.filter(r => !r.is_signed).length ?? 0;

  return {
    todayAppointments: totalToday ?? 0,
    pendingAppointments: pendingAppts,
    completedToday,
    teleconsultToday,
    totalPatients: uniquePatients,
    recentRecords: recordCount ?? 0,
    pendingRecords,
  };
}

/**
 * Build contextual alerts based on live data and profile state.
 */
export function buildWorkspaceAlerts(
  profile: WorkspaceProfile,
  kpis: WorkspaceKPIs
): WorkspaceAlert[] {
  const alerts: WorkspaceAlert[] = [];

  if (profile.status === 'pending') {
    alerts.push({
      id: 'verification-pending',
      type: 'warning',
      message: 'Votre profil professionnel est en attente de vérification.',
      action: 'Compléter le profil',
      actionHref: '/pro-verification',
    });
  }

  if (!profile.isVerified) {
    alerts.push({
      id: 'not-verified',
      type: 'info',
      message: 'Profil non vérifié — certaines fonctionnalités peuvent être limitées.',
      action: 'Vérifier',
      actionHref: '/pro-verification',
    });
  }

  if (!profile.organizationId) {
    alerts.push({
      id: 'no-org',
      type: 'info',
      message: 'Aucun établissement associé. Rejoignez ou créez un établissement.',
      action: 'Rejoindre',
      actionHref: '/pro-profile',
    });
  }

  if (kpis.pendingRecords > 0) {
    alerts.push({
      id: 'pending-records',
      type: 'warning',
      message: `${kpis.pendingRecords} dossier(s) non signé(s) en attente de validation.`,
      action: 'Voir les dossiers',
      actionHref: '/dossier-de-sant',
    });
  }

  if (kpis.pendingAppointments > 5) {
    alerts.push({
      id: 'heavy-schedule',
      type: 'info',
      message: `Journée chargée : ${kpis.pendingAppointments} rendez-vous en attente aujourd'hui.`,
      action: 'Voir l\'agenda',
      actionHref: '/pro-agenda',
    });
  }

  return alerts;
}
