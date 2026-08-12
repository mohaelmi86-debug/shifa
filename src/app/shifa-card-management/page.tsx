'use client';
import AppLayout from '@/components/AppLayout';
import ShifaCardManagementContent from './components/ShifaCardManagementContent';

export default function ShifaCardManagementPage() {
  return (
    <AppLayout role="patient" activeRoute="/shifa-card-management">
      <ShifaCardManagementContent />
    </AppLayout>
  );
}
