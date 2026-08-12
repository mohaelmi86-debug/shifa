'use client';
import AppLayout from '@/components/AppLayout';
import ShifaDisplayContent from './components/ShifaDisplayContent';

export default function ShifaDisplayPage() {
  return (
    <AppLayout role="admin" activeRoute="/shifa-display">
      <ShifaDisplayContent />
    </AppLayout>
  );
}
