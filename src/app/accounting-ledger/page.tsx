'use client';
import AppLayout from '@/components/AppLayout';
import AccountingLedgerContent from './components/AccountingLedgerContent';

export default function AccountingLedgerPage() {
  return (
    <AppLayout role="admin" activeRoute="/accounting-ledger">
      <AccountingLedgerContent />
    </AppLayout>
  );
}
