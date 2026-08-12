'use client';
import AppLayout from '@/components/AppLayout';
import PatientTransferContent from './components/PatientTransferContent';

export default function PatientTransferPage() {
  return (
    <AppLayout role="professional" activeRoute="/patient-transfer">
      <PatientTransferContent />
    </AppLayout>
  );
}
