'use client';
import AppLayout from '@/components/AppLayout';
import TeleconsultationHistoryContent from './components/TeleconsultationHistoryContent';

export default function TeleconsultationHistoryPage() {
  return (
    <AppLayout role="professional" activeRoute="/teleconsultation-history">
      <TeleconsultationHistoryContent />
    </AppLayout>
  );
}
