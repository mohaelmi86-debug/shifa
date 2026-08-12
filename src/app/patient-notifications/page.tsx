import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientNotificationsContent from './components/PatientNotificationsContent';

export default function PatientNotificationsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-notifications">
      <PatientNotificationsContent />
    </AppLayout>
  );
}
