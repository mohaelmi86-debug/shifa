'use client';
import AppLayout from '@/components/AppLayout';
import PatientConsultationsContent from './components/PatientConsultationsContent';

export default function PatientConsultationsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-consultations">
      <PatientConsultationsContent />
    </AppLayout>
  );
}
