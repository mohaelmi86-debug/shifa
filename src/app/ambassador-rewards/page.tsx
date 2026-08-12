'use client';
import AppLayout from '@/components/AppLayout';
import { AmbassadorSubPageContent } from '../ambassador-network/components/AmbassadorNetworkContent';

export default function AmbassadorRewardsPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-rewards">
      <AmbassadorSubPageContent
        title="Récompenses"
        description="Consultez vos gains et récompenses SHIFA"
        icon="TrophyIcon"
        comingSoonFeatures={[
          'Tableau de bord des commissions et bonus',
          'Historique des paiements et virements',
          'Programme de fidélité et niveaux (Bronze, Argent, Or, Platine)',
          'Badges et certifications ambassadeur',
          'Objectifs mensuels et trimestriels',
        ]}
      />
    </AppLayout>
  );
}
