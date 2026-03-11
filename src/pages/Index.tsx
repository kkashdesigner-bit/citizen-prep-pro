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
          "text": "Oui, à partir du 1er janvier 2026, l'examen civique devient obligatoire pour toute première demande de carte de séjour pluriannuelle, carte de résident ou naturalisation française. Le seuil de réussite est fixé à 80% (32/40)."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de questions comporte l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen officiel se compose de 40 questions : 28 questions à choix multiples (QCM) et 12 mises en situation, réparties en 5 thèmes. La durée est de 45 minutes sur ordinateur."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les 5 thèmes de l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les 5 thèmes sont : 1) Principes et valeurs de la République (11 questions), 2) Institutions et système politique (6 questions), 3) Droits et devoirs (11 questions), 4) Histoire, géographie et culture (8 questions), 5) Vivre en société (4 questions)."
        }
      },
      {
        "@type": "Question",
        "name": "Où passer l'examen civique pour la naturalisation ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen se déroule dans des centres agréés par Le français des affaires (CCI Paris Île-de-France), désigné par le Ministère de l'Intérieur, en France métropolitaine et outre-mer."
        }
      },
      {
        "@type": "Question",
        "name": "Le résultat de l'examen civique est-il valable à vie ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, une fois l'examen civique réussi, votre résultat est valable à vie. Vous n'aurez pas besoin de le repasser."
        }
      },
      {
        "@type": "Question",
        "name": "Comment se préparer à l'examen civique 2026 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour préparer l'examen civique 2026, révisez les 5 thèmes officiels (principes républicains, institutions, droits et devoirs, histoire-géographie, vie en société) couvrant 40 questions en 45 minutes avec un seuil de réussite de 80%. Entraînez-vous avec des quiz par catégorie et des examens blancs chronométrés qui reproduisent les conditions réelles. 15 minutes par jour pendant une semaine suffisent généralement pour atteindre le niveau requis. GoCivique propose cette préparation complète avec un essai gratuit."
        }
      },
      {
        "@type": "Question",
        "name": "L'examen civique est-il obligatoire pour la carte de séjour temporaire ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Non, l'examen civique n'est pas obligatoire pour la carte de séjour temporaire d'un an. Il est requis uniquement pour la carte de séjour pluriannuelle, la carte de résident et la naturalisation."
        }
      },
      {
        "@type": "Question",
        "name": "Quel est le taux de réussite à l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le seuil de réussite est de 80%, soit 32 bonnes réponses sur 40. 1 point par bonne réponse, pas de point négatif. Avec GoCivique, nos utilisateurs atteignent un score moyen de 85% après entraînement."
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

