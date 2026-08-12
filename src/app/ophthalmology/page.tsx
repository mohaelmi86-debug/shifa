'use client';
import AppLayout from '@/components/AppLayout';
import OphthalmologyContent from './components/OphthalmologyContent';

export default function OphthalmologyPage() {
  return (
    <AppLayout role="professional" activeRoute="/ophthalmology">
      <OphthalmologyContent />
    </AppLayout>
  );
}
