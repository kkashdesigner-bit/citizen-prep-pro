import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, HelpCircle, Users, ListChecks, CalendarCheck, BookOpen, CheckCircle2,
} from "lucide-react";

/* Plain-text definition reused by the JSON-LD FAQ answer. */
const DEFINITION =
  "L'examen civique est un test officiel, obligatoire depuis le 1er janvier 2026, qui évalue la connaissance des valeurs, de l'histoire et du fonctionnement de la République française. Il prend la forme d'un QCM et concerne les personnes qui demandent la naturalisation, la carte de résident ou la carte de séjour pluriannuelle (CSP).";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "C'est quoi l'examen civique ?",
      acceptedAnswer: { "@type": "Answer", text: DEFINITION },
    },
    {
      "@type": "Question",
      name: "L'examen civique est-il obligatoire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Depuis le 1er janvier 2026, l'examen civique est obligatoire pour les demandes de naturalisation, de carte de résident et de carte de séjour pluriannuelle (CSP).",
      },
    },
    {
      "@type": "Question",
      name: "Combien de questions y a-t-il à l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'examen civique prend la forme d'un QCM d'environ 40 questions réparties sur les 5 thèmes officiels. Il faut généralement atteindre 80 % de bonnes réponses (environ 32 sur 40) pour réussir.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre l'examen civique et le test de français ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'examen civique évalue vos connaissances sur les valeurs, l'histoire et les institutions françaises. Le niveau de langue (B1) est évalué séparément, par un diplôme (DELF B1, TCF) ou une attestation de formation linguistique.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.gocivique.fr/" },
    { "@type": "ListItem", position: 2, name: "Guide de l'examen civique", item: "https://www.gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", position: 3, name: "C'est quoi l'examen civique", item: "https://www.gocivique.fr/c-est-quoi-l-examen-civique" },
  ],
};

const THEMES: { label: string; to: string | null }[] = [
  { label: "Principes et valeurs de la République", to: "/themes/valeurs-republique" },
  { label: "Histoire, géographie et culture de France", to: "/themes/histoire-geographie" },
  { label: "Institutions et système politique", to: "/themes/institutions" },
  { label: "Droits et devoirs du citoyen", to: "/themes/droits-devoirs" },
  { label: "Vivre en société et intégration", to: null },
];

const FAQ: { q: string; a: string }[] = [
  { q: "L'examen civique est-il obligatoire ?", a: "Oui. Depuis le 1er janvier 2026, il est obligatoire pour les demandes de naturalisation, de carte de résident et de carte de séjour pluriannuelle (CSP)." },
  { q: "Combien de questions y a-t-il à l'examen civique ?", a: "Un QCM d'environ 40 questions réparties sur les 5 thèmes officiels. Il faut généralement 80 % de bonnes réponses (environ 32 sur 40) pour réussir." },
  { q: "Quelle est la différence avec le test de français ?", a: "L'examen civique évalue vos connaissances civiques. Le niveau de langue (B1) est évalué séparément, par un diplôme (DELF B1, TCF) ou une attestation." },
];

export default function QuestCeQueExamenCivique() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="C'est quoi l'examen civique ? Définition et déroulé 2026 | GoCivique"
        description="L'examen civique est un test obligatoire depuis 2026 pour la naturalisation, la carte de résident et la CSP. Définition, format (QCM), thèmes et conditions : tout comprendre en 2 minutes."
        path="/c-est-quoi-l-examen-civique"
        isArticle
        publishedTime="2026-01-15T00:00:00+00:00"
        modifiedTime="2026-06-04T00:00:00+00:00"
        schema={[faqSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="container max-w-3xl mx-auto px-4 pt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
        {" > "}
        <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
        {" > "}
        <span className="text-foreground font-medium">C'est quoi l'examen civique</span>
      </nav>

      <article className="container max-w-3xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          C'est quoi l'examen civique ?
        </h1>

        {/* Snippet-optimised definition — kept in the first paragraph on purpose */}
        <p className="text-lg text-foreground/90 leading-relaxed mb-6">
          <strong>L'examen civique</strong> est un test officiel, obligatoire depuis le
          1er janvier 2026, qui évalue la connaissance des valeurs, de l'histoire et du
          fonctionnement de la République française. Il prend la forme d'un QCM et concerne
          les personnes qui demandent la <strong>naturalisation</strong>, la{" "}
          <strong>carte de résident</strong> ou la{" "}
          <strong>carte de séjour pluriannuelle (CSP)</strong>.
        </p>

        <div className="bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-5 mb-10">
          <p className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-[#0055A4]" />
            En résumé
          </p>
          <ul className="text-muted-foreground text-sm space-y-1.5 list-disc pl-5">
            <li>Test obligatoire depuis le 1er janvier 2026</li>
            <li>Format : QCM d'environ 40 questions, seuil de réussite d'environ 80 %</li>
            <li>5 thèmes officiels : valeurs, histoire, institutions, droits et société</li>
            <li>Concerne la naturalisation, la carte de résident et la CSP</li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0055A4]" />
          Qui est concerné par l'examen civique ?
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          L'examen civique s'adresse aux personnes étrangères qui souhaitent obtenir un titre
          de séjour ou la nationalité française. Trois démarches sont principalement
          concernées :
        </p>
        <ul className="text-muted-foreground mb-4 leading-relaxed list-disc pl-6 space-y-1.5">
          <li>la <strong>carte de séjour pluriannuelle (CSP)</strong> ;</li>
          <li>la <strong>carte de résident</strong> ;</li>
          <li>
            la{" "}
            <Link to="/naturalisation-examen-civique" className="text-[#0055A4] font-medium hover:underline">
              naturalisation française
            </Link>{" "}
            (par décret ou par mariage).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-[#0055A4]" />
          Comment se déroule l'examen civique ?
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          L'examen prend la forme d'un <strong>QCM (questionnaire à choix multiple)</strong> d'environ
          40 questions, couvrant les 5 thèmes officiels. Il faut généralement atteindre
          <strong> 80 % de bonnes réponses</strong> (environ 32 sur 40) pour réussir. Le meilleur
          moyen de s'évaluer est de faire un{" "}
          <Link to="/test-blanc-examen-civique" className="text-[#0055A4] font-medium hover:underline">
            test blanc gratuit
          </Link>{" "}
          dans les conditions de l'examen, puis de consulter le{" "}
          <Link to="/guide-examen-civique" className="text-[#0055A4] font-medium hover:underline">
            guide complet de l'examen civique
          </Link>.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0055A4]" />
          Quels sont les 5 thèmes de l'examen civique ?
        </h2>
        <ul className="text-muted-foreground mb-4 leading-relaxed space-y-2">
          {THEMES.map((theme) => (
            <li key={theme.label} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0055A4] shrink-0 mt-0.5" />
              {theme.to ? (
                <Link to={theme.to} className="text-[#0055A4] font-medium hover:underline">
                  {theme.label}
                </Link>
              ) : (
                <span>{theme.label}</span>
              )}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-[#0055A4]" />
          Depuis quand l'examen civique est-il obligatoire ?
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          L'examen civique est obligatoire depuis le <strong>1er janvier 2026</strong>. Il fait
          partie des conditions d'intégration exigées pour accéder à un titre de séjour pluriannuel,
          à la carte de résident et à la nationalité française.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">Questions fréquentes</h2>
        <div className="space-y-5">
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-foreground mb-1">{item.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-foreground">Entraînez-vous gratuitement</h3>
          <p className="text-sm text-muted-foreground mb-4">
            La meilleure façon de comprendre l'examen civique, c'est de le passer. Faites un test
            blanc gratuit, chronométré et corrigé, dans les conditions réelles.
          </p>
          <Link to="/test-blanc-examen-civique">
            <Button className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white gap-2">
              Faire un test blanc gratuit <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
