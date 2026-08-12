import PlatformAdminContent from './components/PlatformAdminContent';
import AppLayout from '@/components/AppLayout';

export default function PlatformAdminPage() {
  return (
    <AppLayout role="platform_admin">
      <PlatformAdminContent />
    </AppLayout>
  );
}
