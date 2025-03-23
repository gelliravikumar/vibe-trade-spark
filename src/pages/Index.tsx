
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { MarketSummarySection } from '@/components/home/MarketSummarySection';
import { TopMoversSection } from '@/components/home/TopMoversSection';
import { TrendingAssetsSection } from '@/components/home/TrendingAssetsSection';
import { CallToAction } from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <HeroSection />
        <MarketSummarySection />
        <TopMoversSection />
        <TrendingAssetsSection />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
