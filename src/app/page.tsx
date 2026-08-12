import React from 'react';
import LandingTopbar from './components/LandingTopbar';
import HeroSection from './components/HeroSection';
import OnboardingPaths from './components/OnboardingPaths';
import FeaturesSection from './components/FeaturesSection';
import ShifaCardSection from './components/ShifaCardSection';
import SHIFAFooter from '@/components/SHIFAFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LandingTopbar />
      <main>
        {/* Hero + Onboarding two-column layout */}
        <section className="max-w-screen-2xl mx-auto px-6 lg:px-10 xl:px-16 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <HeroSection />
            <OnboardingPaths />
          </div>
        </section>
        <FeaturesSection />
        <ShifaCardSection />
      </main>
      <SHIFAFooter context="public" />
    </div>
  );
}