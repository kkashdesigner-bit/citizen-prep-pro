import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PricingSection from '@/components/PricingSection';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Index() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
      </main>
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
}
