'use client';
import AppLayout from '@/components/AppLayout';
import SocialWorkContent from './components/SocialWorkContent';

export default function SocialWorkPage() {
  return (
    <AppLayout role="professional" activeRoute="/social-work">
      <SocialWorkContent />
    </AppLayout>
  );
}
