'use client';
import AppLayout from '@/components/AppLayout';
import PhysiotherapyContent from './components/PhysiotherapyContent';

export default function PhysiotherapyPage() {
  return (
    <AppLayout role="professional" activeRoute="/physiotherapy">
      <PhysiotherapyContent />
    </AppLayout>
  );
}
