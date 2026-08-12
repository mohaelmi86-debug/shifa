'use client';
import AppLayout from '@/components/AppLayout';
import PatientPrecallVitalsContent from './components/PatientPrecallVitalsContent';

export default function PatientPrecallVitalsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-precall-vitals">
      <PatientPrecallVitalsContent />
    </AppLayout>
  );
}
