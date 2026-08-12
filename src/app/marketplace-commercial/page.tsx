'use client';
import AppLayout from '@/components/AppLayout';
import MarketplaceCommercialContent from './components/MarketplaceCommercialContent';

export default function MarketplaceCommercialPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/marketplace-commercial">
      <MarketplaceCommercialContent />
    </AppLayout>
  );
}
