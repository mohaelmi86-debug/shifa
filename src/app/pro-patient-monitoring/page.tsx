'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProPatientMonitoringContent from './components/ProPatientMonitoringContent';

export default function ProPatientMonitoringPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-patient-monitoring">
      <ProPatientMonitoringContent />
    </AppLayout>
  );
}
