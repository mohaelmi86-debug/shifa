'use client';
import AppLayout from '@/components/AppLayout';
import PatientFollowUpContent from './components/PatientFollowUpContent';

export default function PatientFollowUpPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-follow-up">
      <PatientFollowUpContent />
    </AppLayout>
  );
}
