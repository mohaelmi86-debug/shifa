'use client';
import AppLayout from '@/components/AppLayout';
import DentalCareContent from './components/DentalCareContent';

export default function DentalCarePage() {
  return (
    <AppLayout role="professional" activeRoute="/dental-care">
      <DentalCareContent />
    </AppLayout>
  );
}
