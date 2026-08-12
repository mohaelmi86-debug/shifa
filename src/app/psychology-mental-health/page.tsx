'use client';
import AppLayout from '@/components/AppLayout';
import PsychologyMentalHealthContent from './components/PsychologyMentalHealthContent';

export default function PsychologyMentalHealthPage() {
  return (
    <AppLayout role="professional" activeRoute="/psychology-mental-health">
      <PsychologyMentalHealthContent />
    </AppLayout>
  );
}
