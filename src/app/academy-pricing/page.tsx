'use client';
import AppLayout from '@/components/AppLayout';
import AcademyPricingContent from './components/AcademyPricingContent';

export default function AcademyPricingPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/academy-pricing">
      <AcademyPricingContent />
    </AppLayout>
  );
}
