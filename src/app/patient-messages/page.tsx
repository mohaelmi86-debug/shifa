import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientMessagesContent from './components/PatientMessagesContent';

export default function PatientMessagesPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-messages">
      <PatientMessagesContent />
    </AppLayout>
  );
}
