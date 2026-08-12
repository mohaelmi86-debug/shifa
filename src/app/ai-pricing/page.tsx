'use client';
import AppLayout from '@/components/AppLayout';
import AIPricingContent from './components/AIPricingContent';

export default function AIPricingPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/ai-pricing">
      <AIPricingContent />
    </AppLayout>
  );
}
