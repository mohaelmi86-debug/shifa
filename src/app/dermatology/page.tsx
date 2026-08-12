'use client';
import AppLayout from '@/components/AppLayout';
import DermatologyContent from './components/DermatologyContent';

export default function DermatologyPage() {
  return (
    <AppLayout role="professional" activeRoute="/dermatology">
      <DermatologyContent />
    </AppLayout>
  );
}
