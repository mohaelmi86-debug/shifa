'use client';
import AppLayout from '@/components/AppLayout';
import EmergencyDashboardContent from './components/EmergencyDashboardContent';

export default function EmergencyDashboardPage() {
  return (
    <AppLayout role="professional" activeRoute="/emergency-dashboard">
      <EmergencyDashboardContent />
    </AppLayout>
  );
}
