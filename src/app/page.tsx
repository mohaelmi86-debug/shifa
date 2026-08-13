import React from 'react';
import LandingHero from './components/LandingHero';
import LandingPaths from './components/LandingPaths';
import LandingStats from './components/LandingStats';
import LandingCard from './components/LandingCard';
import LandingTopbar from './components/LandingTopbar';
import SHIFAFooter from '@/components/SHIFAFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingTopbar />
      <main>
        <LandingHero />
        <LandingPaths />
        <LandingStats />
        <LandingCard />
      </main>
      <SHIFAFooter context="public" />
    </div>
  );
}