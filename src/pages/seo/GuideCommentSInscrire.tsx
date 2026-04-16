import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, ClipboardList, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment s'inscrire \u00e0 l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Vous ne vous inscrivez pas directement. C'est votre pr\u00e9fecture ou l'OFII qui vous envoie une convocation dans le cadre de votre dossier de naturalisation ou de renouvellement de titre de s\u00e9jour."
      }
    },
    {
      "@type": "Question",
      "name": "Qui est concern\u00e9 par l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "L'examen civique concerne toute personne souhaitant acqu\u00e9rir la nationalit\u00e9 fran\u00e7aise ou renouveler certains titres de s\u00e9jour. Il est obligatoire depuis le 1er janvier 2026."
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
    { "@type": "ListItem", "position": 3, "name": "Comment s'inscrire", "item": "https://gocivique.fr/guides/comment-sinscrire" },
  ]
};

export default function GuideCommentSInscrire() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Comment s'inscrire \u00e0 l'examen civique ? | GoCivique"
        description="Proc\u00e9dure d'inscription \u00e0 l'examen civique fran\u00e7ais : qui peut s'inscrire, quand, et comment obtenir une convocation pour votre entretien de naturalisation."
        path="/guides/comment-sinscrire"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <nav className="container max-w-3xl mx-auto px-4 pt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
        {" > "}
        <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
        {" > "}
        <span className="text-foreground font-medium">Comment s'inscrire</span>
      </nav>

      <article className="container max-w-3xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Comment s'inscrire &agrave; l'examen civique ?
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-blue-900 flex items-center gap-2">
            <Building className="h-5 w-5" />
            L'examen civique est convoqu&eacute; par l'administration — pas par vous
          </p>
          <p className="text-blue-800 text-sm mt-1">
            Vous ne vous inscrivez pas directement. C'est votre pr&eacute;fecture ou l'OFII
            qui vous envoie une convocation dans le cadre de votre dossier.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0055A4]" />
          Qui est concern&eacute; ?
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          L'examen civique concerne toute personne souhaitant acqu&eacute;rir la nationalit&eacute;
          fran&ccedil;aise ou renouveler certains titres de s&eacute;jour. &Agrave; partir du 1er janvier 2026,
          il devient obligatoire pour les demandes de naturalisation et les premi&egrave;res
          demandes de carte de r&eacute;sident.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#0055A4]" />
          Comment &ccedil;a se passe concr&egrave;tement
        </h2>
        <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4 leading-relaxed">
          <li>Vous d&eacute;posez votre dossier de naturalisation en pr&eacute;fecture ou &agrave; l'OFII.</li>
          <li>L'administration instruit votre dossier et v&eacute;rifie votre &eacute;ligibilit&eacute;.</li>
          <li>Vous recevez une convocation par courrier avec la date, l'heure et le lieu.</li>
          <li>Vous passez l'examen (40 questions, 45 minutes, seuil 80 %).</li>
          <li>Les r&eacute;sultats sont transmis &agrave; votre dossier dans les jours suivants.</li>
        </ol>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">Pr&eacute;parez-vous avant de recevoir la convocation</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Le d&eacute;lai entre le d&eacute;p&ocirc;t du dossier et la convocation peut &ecirc;tre de plusieurs mois.
          C'est le meilleur moment pour vous pr&eacute;parer, sans la pression de la date.
        </p>

        <div className="mt-12 bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-foreground">Commencez &agrave; vous pr&eacute;parer maintenant</h3>
          <p className="text-sm text-muted-foreground mb-4">
            300 questions, examens chronom&eacute;tr&eacute;s, analyse par th&egrave;me.
            Gratuit — sans carte bancaire.
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
