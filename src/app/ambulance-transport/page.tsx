'use client';
import AppLayout from '@/components/AppLayout';
import AmbulanceTransportContent from './components/AmbulanceTransportContent';

export default function AmbulanceTransportPage() {
  return (
    <AppLayout role="professional" activeRoute="/ambulance-transport">
      <AmbulanceTransportContent />
    </AppLayout>
  );
}
