'use client';
import AppLayout from '@/components/AppLayout';
import ShifaAIOrgContent from './components/ShifaAIOrgContent';

export default function ShifaAIOrgPage() {
  return (
    <AppLayout role="admin" activeRoute="/shifa-ai-org">
      <ShifaAIOrgContent />
    </AppLayout>
  );
}
