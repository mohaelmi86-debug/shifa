'use client';
import AppLayout from '@/components/AppLayout';
import AmbassadorCommercialContent from './components/AmbassadorCommercialContent';

export default function AmbassadorCommercialPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-commercial">
      <AmbassadorCommercialContent />
    </AppLayout>
  );
}
