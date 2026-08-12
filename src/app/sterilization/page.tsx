'use client';
import AppLayout from '@/components/AppLayout';
import SterilizationContent from './components/SterilizationContent';

export default function SterilizationPage() {
  return (
    <AppLayout role="admin" activeRoute="/sterilization">
      <SterilizationContent />
    </AppLayout>
  );
}
