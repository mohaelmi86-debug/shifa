'use client';
import AppLayout from '@/components/AppLayout';
import WalletInterfaceContent from './components/WalletInterfaceContent';

export default function WalletInterfacePage() {
  return (
    <AppLayout role="patient" activeRoute="/wallet-interface">
      <WalletInterfaceContent />
    </AppLayout>
  );
}
