import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProMessagesContent from './components/ProMessagesContent';

export default function ProMessagesPage() {
  return (
    <AppLayout role="professional" activeRoute="/pro-messages">
      <ProMessagesContent />
    </AppLayout>
  );
}
