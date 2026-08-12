'use client';
import AppLayout from '@/components/AppLayout';
import BloodBankContent from './components/BloodBankContent';

export default function BloodBankPage() {
  return (
    <AppLayout role="professional" activeRoute="/blood-bank">
      <BloodBankContent />
    </AppLayout>
  );
}
