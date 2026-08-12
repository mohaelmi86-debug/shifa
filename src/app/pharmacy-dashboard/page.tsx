'use client';
import AppLayout from '@/components/AppLayout';
import PharmacyDashboardContent from './components/PharmacyDashboardContent';

export default function PharmacyDashboardPage() {
  return (
    <AppLayout role="professional" activeRoute="/pharmacy-dashboard">
      <PharmacyDashboardContent />
    </AppLayout>
  );
}
