import AppLayout from '@/components/AppLayout';
import RegistrationReviewContent from './components/RegistrationReviewContent';

export default function RegistrationReviewPage() {
  return (
    <AppLayout role="platform_admin" activeRoute="/registration-review">
      <RegistrationReviewContent />
    </AppLayout>
  );
}
