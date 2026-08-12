'use client';
import AppLayout from '@/components/AppLayout';
import ReferralsInterfaceContent from './components/ReferralsInterfaceContent';

export default function ReferralsInterfacePage() {
  return (
    <AppLayout role="professional" activeRoute="/referrals-interface">
      <ReferralsInterfaceContent />
    </AppLayout>
  );
}
