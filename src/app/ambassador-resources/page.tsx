'use client';
import AppLayout from '@/components/AppLayout';
import { AmbassadorSubPageContent } from '../ambassador-network/components/AmbassadorNetworkContent';

export default function AmbassadorResourcesPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-resources">
      <AmbassadorSubPageContent
        title="Kit Marketing"
        description="Ressources et outils marketing pour promouvoir SHIFA"
        icon="SparklesIcon"
        comingSoonFeatures={[
          'Bibliothèque de visuels et bannières',
          'Textes et scripts de présentation',
          'Vidéos promotionnelles téléchargeables',
          'Liens de parrainage personnalisés avec tracking',
          'Matériel imprimable (flyers, cartes de visite)',
        ]}
      />
    </AppLayout>
  );
}
