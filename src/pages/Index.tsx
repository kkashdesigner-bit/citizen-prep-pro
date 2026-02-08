import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LandingCategoryTabs from '@/components/LandingCategoryTabs';
import LandingPassProbability from '@/components/LandingPassProbability';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <LandingCategoryTabs />
        <LandingPassProbability />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
