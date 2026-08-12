'use client';
import AppLayout from '@/components/AppLayout';
import PatientConsentContent from './components/PatientConsentContent';

export default function PatientConsentPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-consent">
      <PatientConsentContent />
    </AppLayout>
  );
}
