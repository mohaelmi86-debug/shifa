import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientDocumentsContent from './components/PatientDocumentsContent';

export default function PatientDocumentsPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-documents">
      <PatientDocumentsContent />
    </AppLayout>
  );
}
