'use client';
import AppLayout from '@/components/AppLayout';
import MarketplaceVendorContent from './components/MarketplaceVendorContent';

export default function MarketplaceVendorPage() {
  return (
    <AppLayout role="admin" activeRoute="/marketplace-vendor">
      <MarketplaceVendorContent />
    </AppLayout>
  );
}
