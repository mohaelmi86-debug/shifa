import { createClient } from '@/lib/supabase/client';

export type TransactionalEmailType =
  | 'password_reset' |'appointment_reminder' |'appointment_confirmation' |'lab_result_notification' |'lab_result_ready' |'prescription_dispensed' |'shifa_card_shipped' |'access_verification_log' |'consultation_invitation';

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

interface AppointmentConfirmationData {
  patientName: string;
  date: string;
  time: string;
  doctorName: string;
  specialty?: string;
  location: string;
  appointmentType?: string;
  appointmentId?: string;
}

interface LabResultNotificationData {
  patientName: string;
  testName: string;
  labName: string;
  date: string;
  hasAlert?: boolean;
  dossierUrl?: string;
}

interface LabResultReadyData {
  patientName: string;
  testName: string;
  labName: string;
  collectionDate?: string;
  resultDate?: string;
  hasAlert?: boolean;
  dossierUrl?: string;
}

interface PrescriptionDispensedData {
  patientName: string;
  medicationName: string;
  dosage?: string;
  duration?: string;
  pharmacyName?: string;
  dispensedAt?: string;
  prescribedBy?: string;
  prescriptionId?: string;
}

interface ShifaCardShippedData {
  patientName: string;
  trackingNumber?: string;
  carrier?: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

interface AccessVerificationLogData {
  patientName: string;
  professionalName: string;
  specialty?: string;
  institution?: string;
  accessDate: string;
  accessType?: string;
  accessGranted: boolean;
  verificationId?: string;
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
  | AppointmentConfirmationData
  | LabResultNotificationData
  | LabResultReadyData
  | PrescriptionDispensedData
  | ShifaCardShippedData
  | AccessVerificationLogData
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

// ── Convenience wrappers ──────────────────────────────────────────────────────

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

export async function sendAppointmentConfirmationEmail(
  to: string,
  data: AppointmentConfirmationData
) {
  return sendTransactionalEmail('appointment_confirmation', to, data);
}

export async function sendLabResultNotificationEmail(
  to: string,
  data: LabResultNotificationData
) {
  return sendTransactionalEmail('lab_result_notification', to, data);
}

export async function sendLabResultReadyEmail(
  to: string,
  data: LabResultReadyData
) {
  return sendTransactionalEmail('lab_result_ready', to, data);
}

export async function sendPrescriptionDispensedEmail(
  to: string,
  data: PrescriptionDispensedData
) {
  return sendTransactionalEmail('prescription_dispensed', to, data);
}

export async function sendShifaCardShippedEmail(
  to: string,
  data: ShifaCardShippedData
) {
  return sendTransactionalEmail('shifa_card_shipped', to, data);
}

export async function sendAccessVerificationLogEmail(
  to: string,
  data: AccessVerificationLogData
) {
  return sendTransactionalEmail('access_verification_log', to, data);
}

export async function sendConsultationInvitationEmail(
  to: string,
  data: ConsultationInvitationData
) {
  return sendTransactionalEmail('consultation_invitation', to, data);
}
