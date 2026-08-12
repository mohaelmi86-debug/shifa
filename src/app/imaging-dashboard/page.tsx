'use client';
import AppLayout from '@/components/AppLayout';
import ImagingDashboardContent from './components/ImagingDashboardContent';

export default function ImagingDashboardPage() {
  return (
    <AppLayout role="professional" activeRoute="/imaging-dashboard">
      <ImagingDashboardContent />
    </AppLayout>
  );
}
