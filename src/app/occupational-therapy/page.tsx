'use client';
import AppLayout from '@/components/AppLayout';
import OccupationalTherapyContent from './components/OccupationalTherapyContent';

export default function OccupationalTherapyPage() {
  return (
    <AppLayout role="professional" activeRoute="/occupational-therapy">
      <OccupationalTherapyContent />
    </AppLayout>
  );
}
