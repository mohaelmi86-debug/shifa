'use client';
import AppLayout from '@/components/AppLayout';
import PlatformRevenueContent from './components/PlatformRevenueContent';

export default function PlatformRevenuePage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/platform-revenue">
      <PlatformRevenueContent />
    </AppLayout>
  );
}
