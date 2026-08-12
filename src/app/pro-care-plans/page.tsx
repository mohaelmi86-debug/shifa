'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProCarePlansContent from './components/ProCarePlansContent';

export default function ProCarePlansPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-care-plans">
      <ProCarePlansContent />
    </AppLayout>
  );
}
