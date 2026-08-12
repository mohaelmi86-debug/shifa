'use client';
import AppLayout from '@/components/AppLayout';
import { AmbassadorSubPageContent } from '../ambassador-network/components/AmbassadorNetworkContent';

export default function AmbassadorInvitationsPage() {
  return (
    <AppLayout role="ambassador" activeRoute="/ambassador-invitations">
      <AmbassadorSubPageContent
        title="Invitations"
        description="Envoyez et suivez vos invitations SHIFA"
        icon="EnvelopeIcon"
        comingSoonFeatures={[
          'Envoi d\'invitations par e-mail et SMS',
          'Suivi du statut des invitations (envoyée, acceptée, expirée)',
          'Modèles de messages personnalisables',
          'Historique complet des invitations',
          'Relances automatiques configurables',
        ]}
      />
    </AppLayout>
  );
}
