'use client';
import AppLayout from '@/components/AppLayout';
import ShifaAcademyContent from './components/ShifaAcademyContent';

export default function ShifaAcademyPage() {
  return (
    <AppLayout role="professional" activeRoute="/shifa-academy">
      <ShifaAcademyContent />
    </AppLayout>
  );
}
