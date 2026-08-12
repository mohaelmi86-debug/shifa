'use client';
import AppLayout from '@/components/AppLayout';
import HopitalConfigurationContent from './components/HopitalConfigurationContent';

export default function HopitalConfigurationPage() {
  return (
    <AppLayout role="admin" activeRoute="/hopital-configuration">
      <HopitalConfigurationContent />
    </AppLayout>
  );
}
