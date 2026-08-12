'use client';
import AppLayout from '@/components/AppLayout';
import NotificationsCenterContent from './components/NotificationsCenterContent';

export default function NotificationsCenterPage() {
  return (
    <AppLayout role="professional" activeRoute="/notifications-center">
      <NotificationsCenterContent />
    </AppLayout>
  );
}
