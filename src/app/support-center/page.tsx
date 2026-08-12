'use client';
import AppLayout from '@/components/AppLayout';
import SupportCenterContent from './components/SupportCenterContent';

export default function SupportCenterPage() {
  return (
    <AppLayout role="professional" activeRoute="/support-center">
      <SupportCenterContent />
    </AppLayout>
  );
}
