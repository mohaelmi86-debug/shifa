'use client';
import AppLayout from '@/components/AppLayout';
import NutritionDieteticsContent from './components/NutritionDieteticsContent';

export default function NutritionDieteticsPage() {
  return (
    <AppLayout role="professional" activeRoute="/nutrition-dietetics">
      <NutritionDieteticsContent />
    </AppLayout>
  );
}
