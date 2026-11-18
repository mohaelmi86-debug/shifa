'use client';
import AppLayout from '@/components/AppLayout';
import { AmbassadorSubPageContent } from '../ambassador-network/components/AmbassadorNetworkContent';

export default function AmbassadorTrainingPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-training">
      <AmbassadorSubPageContent
        title="Formation"
        description="Accédez aux formations et certifications SHIFA"
        icon="AcademicCapIcon"
        comingSoonFeatures={[
          'Modules de formation en ligne (vidéos, quiz)',
          'Certification officielle Ambassadeur SHIFA',
          'Webinaires et sessions live',
          'Bibliothèque de ressources pédagogiques',
          'Suivi de progression et attestations',
        ]}
      />
    </AppLayout>
  );
}
