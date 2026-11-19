'use client';
import AppLayout from '@/components/AppLayout';
import ShifaAIResearchContent from './components/ShifaAIResearchContent';

export default function ShifaAIResearchPage() {
  return (
    <AppLayout role="institution" activeRoute="/shifa-ai-research">
      <ShifaAIResearchContent />
    </AppLayout>
  );
}
