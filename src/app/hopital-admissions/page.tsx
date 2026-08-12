import HopitalAdmissionsContent from './components/HopitalAdmissionsContent';
import AppLayout from '@/components/AppLayout';

export default function HopitalAdmissionsPage() {
  return (
    <AppLayout role="admin" activeRoute="/hopital-admissions">
      <HopitalAdmissionsContent />
    </AppLayout>
  );
}
