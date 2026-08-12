'use client';
import AppLayout from '@/components/AppLayout';
import PatientResultsContent from './components/PatientResultsContent';

export default function PatientResultsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-results">
      <PatientResultsContent />
    </AppLayout>
  );
}
