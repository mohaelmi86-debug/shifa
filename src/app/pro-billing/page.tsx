'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProBillingContent from './components/ProBillingContent';

export default function ProBillingPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-billing">
      <ProBillingContent />
    </AppLayout>
  );
}
