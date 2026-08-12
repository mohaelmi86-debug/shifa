'use client';
import AppLayout from '@/components/AppLayout';
import { AmbassadorSubPageContent } from './components/AmbassadorNetworkContent';

export default function AmbassadorNetworkPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-network">
      <AmbassadorSubPageContent
        title="Mon Réseau"
        description="Gérez et développez votre réseau d'ambassadeurs SHIFA"
        icon="UsersIcon"
        comingSoonFeatures={[
          'Visualisation de votre arbre de parrainage',
          'Statistiques de performance de votre réseau',
          'Gestion des filleuls actifs et inactifs',
          'Classement et niveaux ambassadeurs',
          'Outils de recrutement et d\'invitation',
        ]}
      />
    </AppLayout>
  );
}
