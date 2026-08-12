import React from 'react';
import AppLayout from '@/components/AppLayout';
import HopitalDashboardContent from './components/HopitalDashboardContent';

export default function HopitalDashboardPage() {
  return (
    <AppLayout role="admin" activeRoute="/hopital-dashboard">
      <HopitalDashboardContent />
    </AppLayout>
  );
}
