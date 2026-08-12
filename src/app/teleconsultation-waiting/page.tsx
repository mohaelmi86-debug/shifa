'use client';
import AppLayout from '@/components/AppLayout';
import TeleconsultationWaitingContent from './components/TeleconsultationWaitingContent';

export default function TeleconsultationWaitingPage() {
  return (
    <AppLayout role="professional" activeRoute="/teleconsultation-waiting">
      <TeleconsultationWaitingContent />
    </AppLayout>
  );
}
