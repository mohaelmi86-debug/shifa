import React from 'react';
import AppLayout from '@/components/AppLayout';
import EspaceSantePubliqueContent from './components/EspaceSantePubliqueContent';

export default function EspaceSantePubliquePage() {
  return (
    <AppLayout role="institution" activeRoute="/espace-sante-publique">
      <EspaceSantePubliqueContent />
    </AppLayout>
  );
}
