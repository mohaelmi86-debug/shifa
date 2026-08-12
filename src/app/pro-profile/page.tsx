'use client';
import AppLayout from '@/components/AppLayout';
import ProProfileContent from './components/ProProfileContent';

export default function ProProfilePage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-profile">
      <ProProfileContent />
    </AppLayout>
  );
}
