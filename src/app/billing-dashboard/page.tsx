import BillingDashboardContent from './components/BillingDashboardContent';
import AppLayout from '@/components/AppLayout';

export default function BillingDashboardPage() {
  return (
    <AppLayout role="admin" activeRoute="/billing-dashboard">
      <BillingDashboardContent />
    </AppLayout>
  );
}
