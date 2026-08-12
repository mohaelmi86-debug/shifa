'use client';
import AppLayout from '@/components/AppLayout';
import HealthMarketplaceContent from './components/HealthMarketplaceContent';

export default function HealthMarketplacePage() {
  return (
    <AppLayout role="professional" activeRoute="/health-marketplace">
      <HealthMarketplaceContent />
    </AppLayout>
  );
}
