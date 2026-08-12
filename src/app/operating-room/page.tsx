'use client';
import AppLayout from '@/components/AppLayout';
import OperatingRoomContent from './components/OperatingRoomContent';

export default function OperatingRoomPage() {
  return (
    <AppLayout role="professional" activeRoute="/operating-room">
      <OperatingRoomContent />
    </AppLayout>
  );
}
