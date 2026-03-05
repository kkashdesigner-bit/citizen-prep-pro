import MarketingHeader from '@/components/MarketingHeader';
import HeroSection from '@/components/HeroSection';
import LandingCategoryTabs from '@/components/LandingCategoryTabs';
import LandingPassProbability from '@/components/LandingPassProbability';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="pt-16">
        <HeroSection />
        <LandingCategoryTabs />
        <LandingPassProbability />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

