import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, RefreshCw, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Combien de fois peut-on repasser l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Il n'y a aucune limite au nombre de passages de l'examen civique fran\u00e7ais. Vous pouvez le repasser autant de fois que n\u00e9cessaire jusqu'\u00e0 r\u00e9ussite."
      }
    },
    {
      "@type": "Question",
      "name": "Quel est le d\u00e9lai entre deux passages de l'examen civique ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En cas d'\u00e9chec, vous devrez attendre la prochaine session disponible dans votre d\u00e9partement, g\u00e9n\u00e9ralement quelques semaines \u00e0 quelques mois."
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
    { "@type": "ListItem", "position": 3, "name": "Combien de fois", "item": "https://gocivique.fr/guides/combien-de-fois" },
  ]
};

export default function GuideCombienDeFois() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Combien de fois peut-on repasser l'examen civique ? | GoCivique"
        description="Il n'y a aucune limite au nombre de passages de l'examen civique fran\u00e7ais. D\u00e9couvrez comment optimiser vos chances d\u00e8s la premi\u00e8re tentative."
        path="/guides/combien-de-fois"
        schema={[faqSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="container max-w-3xl mx-auto px-4 pt-8 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
        {" > "}
        <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
        {" > "}
        <span className="text-foreground font-medium">Combien de fois</span>
      </nav>

      <article className="container max-w-3xl mx-auto px-4 py-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
          Combien de fois peut-on repasser l'examen civique ?
        </h1>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
          <p className="font-semibold text-emerald-900 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Aucune limite — vous pouvez repasser autant de fois que n&eacute;cessaire
          </p>
          <p className="text-emerald-800 text-sm mt-1">
            La loi ne fixe pas de nombre maximal de tentatives pour l'examen civique.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground">Pas de plafond l&eacute;gal</h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          Contrairement &agrave; certains examens du permis de conduire ou concours de la
          fonction publique, l'examen civique ne comporte pas de limite de tentatives.
          Vous pouvez le repasser jusqu'&agrave; r&eacute;ussite.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#0055A4]" />
          D&eacute;lai entre deux passages
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          En cas d'&eacute;chec, vous devrez attendre la prochaine session d'examen disponible
          dans votre d&eacute;partement. Les sessions sont organis&eacute;es r&eacute;guli&egrave;rement par les
          pr&eacute;fectures et l'OFII. Le d&eacute;lai constat&eacute; est g&eacute;n&eacute;ralement de quelques semaines
          &agrave; quelques mois selon les territoires.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3 text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-[#0055A4]" />
          R&eacute;ussir du premier coup
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          La meilleure strat&eacute;gie reste d'&ecirc;tre pr&ecirc;t d&egrave;s la premi&egrave;re convocation.
          Le seuil de 80 % (32 bonnes r&eacute;ponses sur 40) est exigeant mais atteignable
          avec une pr&eacute;paration cibl&eacute;e sur les 5 th&egrave;mes officiels.
        </p>

        <div className="mt-12 bg-[#0055A4]/5 border border-[#0055A4]/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 text-foreground">Pr&eacute;parez-vous &agrave; r&eacute;ussir du premier coup</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Entra&icirc;nez-vous avec nos examens chronom&eacute;tr&eacute;s : m&ecirc;me format, m&ecirc;me dur&eacute;e,
            m&ecirc;mes th&egrave;mes que l'examen officiel.
          </p>
          <Link to="/exams">
            <Button className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white gap-2">
              Faire un examen blanc <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
