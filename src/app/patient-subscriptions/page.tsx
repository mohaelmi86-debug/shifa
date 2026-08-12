'use client';
import AppLayout from '@/components/AppLayout';
import PatientSubscriptionsContent from './components/PatientSubscriptionsContent';

export default function PatientSubscriptionsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-subscriptions">
      <PatientSubscriptionsContent />
    </AppLayout>
  );
}
