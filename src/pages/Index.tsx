import MarketingHeader from '@/components/MarketingHeader';
import HeroSection from '@/components/HeroSection';
import StatsBar from '@/components/landing/StatsBar';
import ExamDecoder from '@/components/landing/ExamDecoder';
import HowItWorks from '@/components/landing/HowItWorks';
import ThemesShowcase from '@/components/landing/ThemesShowcase';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import SocialProof from '@/components/landing/SocialProof';
import FAQSection from '@/components/landing/FAQSection';
import FinalCTA from '@/components/landing/FinalCTA';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import StickyCtaBar from '@/components/StickyCtaBar';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAQ_COUNT } from '@/lib/landingData';

export default function Index() {
  const { t } = useLanguage();

  // FAQPage schema built from the same translated keys the FAQSection renders,
  // so the structured data always matches the visible content in every language.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Array.from({ length: FAQ_COUNT }, (_, i) => ({
      "@type": "Question",
      "name": t(`faq.q${i + 1}`),
      "acceptedAnswer": { "@type": "Answer", "text": t(`faq.a${i + 1}`) },
    })),
  };

  // AggregateRating — enables star rating in Google search results
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "GoCivique — Préparation Examen Civique 2026",
    "description": "Plateforme de préparation à l'examen civique 2026 pour la CSP, la carte de résident et la naturalisation. Questions officielles, mises en situation, examens blancs et 100 cours.",
    "url": "https://www.gocivique.fr",
    "brand": { "@type": "Brand", "name": "GoCivique" },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "description": "Essai gratuit disponible"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "412",
      "reviewCount": "412"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        path="/"
        titleKey="seo.defaultTitle"
        descriptionKey="seo.indexDesc"
        schema={[faqSchema, aggregateRatingSchema]}
      />
      <MarketingHeader />
      <main className="pt-16">
        <HeroSection />
        <StatsBar />
        <ExamDecoder />
        <HowItWorks />
        <ThemesShowcase />
        <FeaturesShowcase />
        <SocialProof />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCtaBar />
    </div>
  );
}
