'use client';
import AppLayout from '@/components/AppLayout';
import PalliativeCareContent from './components/PalliativeCareContent';

export default function PalliativeCarePage() {
  return (
    <AppLayout role="professional" activeRoute="/palliative-care">
      <PalliativeCareContent />
    </AppLayout>
  );
}
