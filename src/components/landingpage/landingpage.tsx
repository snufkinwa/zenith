'use client';

import React from 'react';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import CompanyShowcaseSection from './sections/CompanyShowcase';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';
import UnifiedFlowingGrid from './sections/FlowingGrid';

const ZenithLandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <UnifiedFlowingGrid intensity="medium" />
      <HeroSection />
      <FeaturesSection />
      <CompanyShowcaseSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default ZenithLandingPage;
