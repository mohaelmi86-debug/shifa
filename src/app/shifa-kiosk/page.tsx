'use client';
import AppLayout from '@/components/AppLayout';
import ShifaKioskContent from './components/ShifaKioskContent';

export default function ShifaKioskPage() {
  return (
    <AppLayout role="admin" activeRoute="/shifa-kiosk">
      <ShifaKioskContent />
    </AppLayout>
  );
}
