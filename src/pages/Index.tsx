import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
