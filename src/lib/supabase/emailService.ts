import { createClient } from '@/lib/supabase/client';

export type TransactionalEmailType =
  | 'password_reset' |'appointment_reminder' |'lab_result_notification' |'consultation_invitation';

interface PasswordResetData {
  name: string;
  resetUrl: string;
}

interface AppointmentReminderData {
  patientName: string;
  date: string;
  time: string;
  doctorName: string;
  location: string;
}

interface LabResultNotificationData {
  patientName: string;
  testName: string;
  labName: string;
  date: string;
  hasAlert?: boolean;
  dossierUrl?: string;
}

interface ConsultationInvitationData {
  patientName: string;
  doctorName: string;
  consultationType: string;
  proposedDate: string;
  reason: string;
  acceptUrl?: string;
  declineUrl?: string;
}

type EmailData =
  | PasswordResetData
  | AppointmentReminderData
  | LabResultNotificationData
  | ConsultationInvitationData;

export async function sendTransactionalEmail(
  type: TransactionalEmailType,
  to: string | string[],
  data: EmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: result, error } = await supabase.functions.invoke(
      'send-transactional-email',
      {
        body: { type, to, data },
      }
    );

    if (error) {
      console.error('Email service error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: result?.id };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Email service exception:', msg);
    return { success: false, error: msg };
  }
}

// Convenience wrappers

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  return sendTransactionalEmail('password_reset', to, { name, resetUrl });
}

export async function sendAppointmentReminderEmail(
  to: string,
  data: AppointmentReminderData
) {
  return sendTransactionalEmail('appointment_reminder', to, data);
}

export async function sendLabResultNotificationEmail(
  to: string,
  data: LabResultNotificationData
) {
  return sendTransactionalEmail('lab_result_notification', to, data);
}

export async function sendConsultationInvitationEmail(
  to: string,
  data: ConsultationInvitationData
) {
  return sendTransactionalEmail('consultation_invitation', to, data);
}
