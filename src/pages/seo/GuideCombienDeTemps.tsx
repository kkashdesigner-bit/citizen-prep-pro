import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Clock, Mail, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Combien de temps pour avoir les r\u00e9sultats de l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Les r\u00e9sultats de l'examen civique sont g\u00e9n\u00e9ralement communiqu\u00e9s dans les jours suivant l'examen, l'examen \u00e9tant informatis\u00e9."
      }
    },
    {
      "@type": "Question",
      "name": "Comment re\u00e7oit-on les r\u00e9sultats de l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Les r\u00e9sultats sont transmis \u00e0 l'administration qui instruit votre dossier (pr\u00e9fecture ou OFII). Vous \u00eates notifi\u00e9 par courrier ou via votre espace en ligne."
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
    { "@type": "ListItem", "position": 3, "name": "D\u00e9lai des r\u00e9sultats", "item": "https://gocivique.fr/guides/combien-de-temps-resultats" },
  ]
};

export default function GuideCombienDeTemps() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Combien de temps pour avoir les r\u00e9sultats de l'examen civique ? | GoCivique"
        description="Les r\u00e9sultats de l'examen civique sont communiqu\u00e9s rapidement. D\u00e9couvrez les d\u00e9lais officiels et ce qui se passe apr\u00e8s votre passage."
        path="/guides/combien-de-temps-resultats"
        schema={[faqSchema, breadcrumbSchema]}
      />

      <nav className="container max-w-3xl mx-auto px-4 pt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
        {" > "}
        <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
        {" > "}
        <span className="text-foreground font-medium">D&eacute;lai des r&eacute;sultats</span>
      </nav>

      <article className="container max-w-3xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Combien de temps pour avoir les r&eacute;sultats de l'examen civique ?
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-blue-900 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Les r&eacute;sultats sont g&eacute;n&eacute;ralement disponibles dans les jours suivant l'examen
          </p>
          <p className="text-blue-800 text-sm mt-1">
            L'examen &eacute;tant informatis&eacute;, le traitement des r&eacute;sultats est rapide.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#0055A4]" />
          D&eacute;lai de communication des r&eacute;sultats
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Apr&egrave;s votre passage, les r&eacute;sultats sont transmis &agrave; l'administration qui instruit
          votre dossier (pr&eacute;fecture ou OFII) dans un d&eacute;lai de quelques jours &agrave; quelques
          semaines selon les organismes. Vous serez notifi&eacute; par courrier ou par votre
          espace en ligne sur le site de la pr&eacute;fecture.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-[#0055A4]" />
          Ce qui se passe apr&egrave;s les r&eacute;sultats
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Si vous avez r&eacute;ussi, votre dossier avance vers l'&eacute;tape suivante
          (entretien de naturalisation ou renouvellement du titre de s&eacute;jour).
          Si vous avez &eacute;chou&eacute;, vous recevrez les informations pour vous r&eacute;inscrire
          &agrave; une prochaine session.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">Pendant l'attente</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Les d&eacute;lais administratifs globaux (de la demande au d&eacute;cret de naturalisation)
          peuvent s'&eacute;tendre sur plusieurs mois voire plus d'un an selon les dossiers
          et les pr&eacute;fectures. Le r&eacute;sultat de l'examen civique n'est qu'une &eacute;tape dans
          ce processus.
        </p>

        <div className="mt-12 bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-foreground">En attendant, continuez &agrave; vous pr&eacute;parer</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Si vous n'avez pas encore pass&eacute; l'examen, c'est le moment id&eacute;al pour
            vous entra&icirc;ner et maximiser vos chances de r&eacute;ussite.
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
