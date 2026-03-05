import MarketingHeader from '@/components/MarketingHeader';
import HeroSection from '@/components/HeroSection';
import LandingCategoryTabs from '@/components/LandingCategoryTabs';
import LandingPassProbability from '@/components/LandingPassProbability';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

export default function Index() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "L'examen civique est-il obligatoire en 2026 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, à partir du 1er janvier 2026, l'examen civique devient obligatoire avec un seuil de 80% de bonnes réponses pour toute demande de naturalisation."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de questions comporte l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen officiel se compose de 40 questions à choix multiples (QCM). Il faut obtenir au moins 32 bonnes réponses pour le réussir (soit 80%)."
        }
      },
      {
        "@type": "Question",
        "name": "Où passer l'examen civique pour la naturalisation ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen se déroule dans des centres agréés en France, avec une épreuve sur un outil numérique centralisé évaluée par un correcteur certifié."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        path="/"
        descriptionKey="seo.indexDesc"
        schema={faqSchema}
      />
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

