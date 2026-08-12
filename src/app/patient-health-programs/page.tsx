'use client';
import AppLayout from '@/components/AppLayout';
import PatientHealthProgramsContent from './components/PatientHealthProgramsContent';

export default function PatientHealthProgramsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-health-programs">
      <PatientHealthProgramsContent />
    </AppLayout>
  );
}
