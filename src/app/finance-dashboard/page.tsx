'use client';
import AppLayout from '@/components/AppLayout';
import FinanceDashboardContent from './components/FinanceDashboardContent';

export default function FinanceDashboardPage() {
  return (
    <AppLayout role="admin" activeRoute="/finance-dashboard">
      <FinanceDashboardContent />
    </AppLayout>
  );
}
