'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PatientShifaIdContent from './components/PatientShifaIdContent';

export default function PatientShifaIdPage() {
  return (
    <AppLayout role="patient" activeRoute="/patient-shifa-id">
      <PatientShifaIdContent />
    </AppLayout>
  );
}
