'use client';
import AppLayout from '@/components/AppLayout';
import LabDashboardContent from './components/LabDashboardContent';

export default function LabDashboardPage() {
  return (
    <AppLayout role="professional" activeRoute="/lab-dashboard">
      <LabDashboardContent />
    </AppLayout>
  );
}
