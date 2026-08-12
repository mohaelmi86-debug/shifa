'use client';
import AppLayout from '@/components/AppLayout';
import ProVerificationContent from './components/ProVerificationContent';

export default function ProVerificationPage() {
  return (
    <AppLayout role="admin" activeRoute="/pro-verification">
      <ProVerificationContent />
    </AppLayout>
  );
}
