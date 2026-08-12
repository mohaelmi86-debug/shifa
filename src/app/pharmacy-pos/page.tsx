'use client';
import AppLayout from '@/components/AppLayout';
import PharmacyPOSContent from './components/PharmacyPOSContent';

export default function PharmacyPOSPage() {
  return (
    <AppLayout role="professional" activeRoute="/pharmacy-pos">
      <PharmacyPOSContent />
    </AppLayout>
  );
}
