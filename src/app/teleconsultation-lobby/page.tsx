'use client';
import AppLayout from '@/components/AppLayout';
import TeleconsultationLobbyContent from './components/TeleconsultationLobbyContent';

export default function TeleconsultationLobbyPage() {
  return (
    <AppLayout role="professional" activeRoute="/teleconsultation-lobby">
      <TeleconsultationLobbyContent />
    </AppLayout>
  );
}
