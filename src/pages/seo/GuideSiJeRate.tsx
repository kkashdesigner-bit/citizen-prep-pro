import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, ShieldCheck, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Que se passe-t-il si je rate l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "L'\u00e9chec \u00e0 l'examen civique n'est pas d\u00e9finitif. Vous pouvez repasser l'examen autant de fois que n\u00e9cessaire. Votre dossier reste actif et n'est pas clotur\u00e9."
      }
    },
    {
      "@type": "Question",
      "name": "L'\u00e9chec \u00e0 l'examen civique bloque-t-il mon dossier de naturalisation ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non, l'\u00e9chec suspend temporairement le traitement mais ne cl\u00f4ture pas votre dossier. Vous pouvez vous r\u00e9inscrire pour la prochaine session."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Si je rate l'examen", "item": "https://gocivique.fr/guides/si-je-rate-lexamen" },
  ]
};

export default function GuideSiJeRate() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Que se passe-t-il si je rate l'examen civique ? | GoCivique"
        description="L'\u00e9chec \u00e0 l'examen civique ne bloque pas d\u00e9finitivement votre dossier. D\u00e9couvrez les proc\u00e9dures de rattrapage, d\u00e9lais, et comment mieux vous pr\u00e9parer."
        path="/guides/si-je-rate-lexamen"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <nav className="container max-w-3xl mx-auto px-4 pt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
        {" > "}
        <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
        {" > "}
        <span className="text-foreground font-medium">Si je rate l'examen</span>
      </nav>

      <article className="container max-w-3xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Que se passe-t-il si je rate l'examen civique ?
        </h1>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Bonne nouvelle : l'&eacute;chec n'est pas d&eacute;finitif
          </p>
          <p className="text-emerald-800 text-sm mt-1">
            Vous pouvez repasser l'examen autant de fois que n&eacute;cessaire.
            Il n'y a pas de limite au nombre de tentatives.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">Ce qui se passe apr&egrave;s un &eacute;chec</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Si vous n'atteignez pas le seuil de 32 bonnes r&eacute;ponses sur 40 (80 %),
          vous recevez votre r&eacute;sultat et pouvez vous r&eacute;inscrire pour repasser l'examen.
          L'administration qui instruit votre dossier (pr&eacute;fecture ou OFII) sera inform&eacute;e
          du r&eacute;sultat, mais l'&eacute;chec n'entra&icirc;ne pas automatiquement un refus de votre titre.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0055A4]" />
          Aucune limite de tentatives
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Il n'existe pas de nombre maximal de passages. Vous pouvez repasser l'examen
          jusqu'&agrave; ce que vous l'obteniez. Entre deux sessions, votre dossier de demande
          reste actif : l'&eacute;chec &agrave; l'examen suspend temporairement le traitement mais ne
          cl&ocirc;ture pas votre dossier.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#0055A4]" />
          Comment se pr&eacute;parer mieux pour la prochaine fois
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Les th&egrave;mes les plus souvent &eacute;chou&eacute;s sont l'histoire de France (11 questions)
          et les valeurs de la R&eacute;publique (11 questions). Si vous identifiez vos lacunes
          par th&egrave;me, vous pouvez concentrer vos r&eacute;visions l&agrave; o&ugrave; cela compte le plus.
        </p>

        <div className="mt-12 bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-foreground">Identifiez vos points faibles avec GoCivique</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Notre analyse par th&egrave;me vous dit exactement sur quoi travailler.
            Faites un quiz gratuit — sans carte bancaire.
          </p>
          <Link to="/quiz?mode=demo">
            <Button className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white gap-2">
              Faire un quiz gratuit <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
