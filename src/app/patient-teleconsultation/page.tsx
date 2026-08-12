'use client';
import AppLayout from '@/components/AppLayout';
import PatientTeleconsultationContent from './components/PatientTeleconsultationContent';

export default function PatientTeleconsultationPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-teleconsultation">
      <PatientTeleconsultationContent />
    </AppLayout>
  );
}
