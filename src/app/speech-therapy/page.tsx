'use client';
import AppLayout from '@/components/AppLayout';
import SpeechTherapyContent from './components/SpeechTherapyContent';

export default function SpeechTherapyPage() {
  return (
    <AppLayout role="professional" activeRoute="/speech-therapy">
      <SpeechTherapyContent />
    </AppLayout>
  );
}
