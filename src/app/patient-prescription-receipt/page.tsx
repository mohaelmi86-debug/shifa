'use client';
import AppLayout from '@/components/AppLayout';
import PatientPrescriptionReceiptContent from './components/PatientPrescriptionReceiptContent';

export default function PatientPrescriptionReceiptPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-prescription-receipt">
      <PatientPrescriptionReceiptContent />
    </AppLayout>
  );
}
