import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Target,
  Clock,
  GraduationCap,
  ChevronRight,
  Award,
  FileText,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  JSON-LD Schemas                                                    */
/* ------------------------------------------------------------------ */

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Accueil",
      item: "https://gocivique.fr/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guide de l'examen civique",
      item: "https://gocivique.fr/guide-examen-civique",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Test Blanc Examen Civique",
      item: "https://gocivique.fr/test-blanc-examen-civique",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien de questions comporte l'examen civique réel ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'examen civique réel comporte entre 40 et 60 questions à choix multiples (QCM). Le nombre exact peut varier selon la session et le centre d'examen. Chaque question propose quatre réponses possibles dont une seule est correcte. L'examen se déroule sur tablette ou ordinateur dans un centre agréé par l'OFII.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le score minimum pour réussir l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le score minimum requis pour valider l'examen civique est généralement fixé à 80 % de bonnes réponses, soit 32 réponses correctes sur 40 questions. Ce seuil peut varier légèrement selon les sessions. Il est donc recommandé de viser un score supérieur à 85 % lors de vos entraînements pour disposer d'une marge de sécurité confortable le jour de l'examen.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on utiliser un dictionnaire pendant l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, l'utilisation d'un dictionnaire, d'un téléphone portable ou de tout autre document est strictement interdite pendant l'examen civique. L'examen se déroule dans des conditions surveillées et les candidats ne peuvent utiliser aucune aide extérieure. C'est pourquoi il est essentiel de bien se préparer en amont et de maîtriser le vocabulaire civique de base.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps faut-il pour se préparer à l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La durée de préparation recommandée est de 4 à 8 semaines à raison de 30 à 45 minutes par jour. Cependant, ce délai dépend de votre niveau de connaissance initial de la France et de la langue française. Les candidats ayant un bon niveau de français et une certaine familiarité avec la culture française peuvent se préparer en 2 à 3 semaines. L'essentiel est de réviser régulièrement et de faire des tests blancs chronométrés.",
      },
    },
    {
      "@type": "Question",
      name: "Où passer l'examen civique en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'examen civique se passe dans un centre agréé par l'OFII (Office Français de l'Immigration et de l'Intégration). Il en existe dans chaque département de France métropolitaine et dans les départements d'outre-mer. La convocation vous est envoyée par courrier ou par e-mail avec l'adresse exacte du centre, la date et l'heure de l'examen. Vous pouvez contacter votre direction territoriale de l'OFII pour connaître les dates disponibles.",
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Question data                                                      */
/* ------------------------------------------------------------------ */

interface Question {
  id: number;
  theme: string;
  themeColor: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

const questions: Question[] = [
  /* ---------- Principes et valeurs ---------- */
  {
    id: 1,
    theme: "Principes et valeurs",
    themeColor: "bg-blue-100 text-blue-800",
    question: "Quelle est la devise de la République française ?",
    choices: [
      "A. Honneur, Patrie, Valeur",
      "B. Liberté, Égalité, Fraternité",
      "C. Unité, Force, Progrès",
      "D. Paix, Travail, Justice",
    ],
    correctIndex: 1,
    explanation:
      "La devise « Liberté, Égalité, Fraternité » est issue de la Révolution française de 1789. Elle est inscrite dans l'article 2 de la Constitution de la Ve République et figure sur les frontons des bâtiments publics, les pièces de monnaie et les documents officiels. Ces trois valeurs résument l'idéal républicain français et guident la vie en société.",
  },
  {
    id: 2,
    theme: "Principes et valeurs",
    themeColor: "bg-blue-100 text-blue-800",
    question:
      "Qu'est-ce que la laïcité en France ?",
    choices: [
      "A. L'interdiction de toutes les religions sur le territoire",
      "B. La séparation des Églises et de l'État",
      "C. L'obligation de pratiquer une religion reconnue",
      "D. La prédominance de la religion catholique",
    ],
    correctIndex: 1,
    explanation:
      "La laïcité, définie par la loi du 9 décembre 1905, établit la séparation des Églises et de l'État. Elle garantit la liberté de conscience et la liberté de culte tout en assurant la neutralité de l'État vis-à-vis de toutes les religions. La laïcité ne signifie pas l'interdiction des religions : chacun est libre de croire ou de ne pas croire, mais les institutions publiques doivent rester neutres.",
  },
  {
    id: 3,
    theme: "Principes et valeurs",
    themeColor: "bg-blue-100 text-blue-800",
    question:
      "Quand a été adoptée la Déclaration des droits de l'homme et du citoyen ?",
    choices: [
      "A. Le 14 juillet 1789",
      "B. Le 26 août 1789",
      "C. Le 4 août 1792",
      "D. Le 22 septembre 1792",
    ],
    correctIndex: 1,
    explanation:
      "La Déclaration des droits de l'homme et du citoyen a été adoptée le 26 août 1789 par l'Assemblée nationale constituante. Ce texte fondateur proclame des droits naturels et imprescriptibles tels que la liberté, la propriété, la sûreté et la résistance à l'oppression. Il fait partie intégrante du bloc de constitutionnalité et reste le socle des droits fondamentaux en France.",
  },
  {
    id: 4,
    theme: "Principes et valeurs",
    themeColor: "bg-blue-100 text-blue-800",
    question: "Quel est l'hymne national français ?",
    choices: [
      "A. Le Chant du Départ",
      "B. La Marseillaise",
      "C. La Carmagnole",
      "D. Le Chant des Partisans",
    ],
    correctIndex: 1,
    explanation:
      "La Marseillaise est l'hymne national de la France depuis 1879. Composée en 1792 par Claude Joseph Rouget de Lisle à Strasbourg, elle a été écrite à l'origine comme un chant de guerre pour l'armée du Rhin. Elle est chantée lors des cérémonies officielles, des événements sportifs internationaux et des commémorations nationales.",
  },
  /* ---------- Institutions ---------- */
  {
    id: 5,
    theme: "Institutions",
    themeColor: "bg-purple-100 text-purple-800",
    question:
      "Combien de temps dure le mandat du Président de la République française ?",
    choices: [
      "A. 4 ans",
      "B. 5 ans",
      "C. 6 ans",
      "D. 7 ans",
    ],
    correctIndex: 1,
    explanation:
      "Depuis le référendum de 2000 et la réforme constitutionnelle entrée en vigueur en 2002, le mandat présidentiel est de 5 ans (le quinquennat). Auparavant, le mandat durait 7 ans (le septennat). Le Président est élu au suffrage universel direct et peut être réélu une fois, soit un maximum de deux mandats consécutifs.",
  },
  {
    id: 6,
    theme: "Institutions",
    themeColor: "bg-purple-100 text-purple-800",
    question: "Qui nomme le Premier ministre en France ?",
    choices: [
      "A. L'Assemblée nationale",
      "B. Le Sénat",
      "C. Le Président de la République",
      "D. Le Conseil constitutionnel",
    ],
    correctIndex: 2,
    explanation:
      "Selon l'article 8 de la Constitution de la Ve République, c'est le Président de la République qui nomme le Premier ministre. Ce dernier est choisi parmi la majorité parlementaire à l'Assemblée nationale. Le Premier ministre dirige l'action du gouvernement, assure l'exécution des lois et peut engager la responsabilité du gouvernement devant l'Assemblée nationale.",
  },
  {
    id: 7,
    theme: "Institutions",
    themeColor: "bg-purple-100 text-purple-800",
    question:
      "Combien de députés siègent à l'Assemblée nationale ?",
    choices: [
      "A. 348 députés",
      "B. 450 députés",
      "C. 577 députés",
      "D. 925 députés",
    ],
    correctIndex: 2,
    explanation:
      "L'Assemblée nationale compte 577 députés, élus au suffrage universel direct lors des élections législatives. Les députés représentent les citoyens et votent les lois. Chaque député est élu dans une circonscription au scrutin uninominal majoritaire à deux tours. L'Assemblée nationale siège au Palais Bourbon à Paris et forme, avec le Sénat (348 sénateurs), le Parlement français.",
  },
  /* ---------- Droits et devoirs ---------- */
  {
    id: 8,
    theme: "Droits et devoirs",
    themeColor: "bg-green-100 text-green-800",
    question: "À quel âge peut-on voter en France ?",
    choices: [
      "A. 16 ans",
      "B. 17 ans",
      "C. 18 ans",
      "D. 21 ans",
    ],
    correctIndex: 2,
    explanation:
      "En France, le droit de vote est accordé à partir de 18 ans, l'âge de la majorité civile. Pour pouvoir voter, il faut être de nationalité française, jouir de ses droits civiques et être inscrit sur les listes électorales. L'inscription sur les listes électorales est automatique à 18 ans depuis 1997, mais il est recommandé de vérifier son inscription auprès de sa mairie.",
  },
  {
    id: 9,
    theme: "Droits et devoirs",
    themeColor: "bg-green-100 text-green-800",
    question: "Le vote est-il obligatoire en France ?",
    choices: [
      "A. Oui, sous peine d'amende",
      "B. Oui, pour les élections présidentielles uniquement",
      "C. Non, mais c'est un devoir civique",
      "D. Oui, depuis la réforme de 2019",
    ],
    correctIndex: 2,
    explanation:
      "Non, le vote n'est pas obligatoire en France, contrairement à certains pays comme la Belgique ou le Luxembourg. Cependant, il est considéré comme un devoir civique fondamental. La participation aux élections est un acte essentiel de la démocratie. Voter permet de choisir ses représentants et d'influencer les décisions politiques qui concernent la vie quotidienne de tous les citoyens.",
  },
  {
    id: 10,
    theme: "Droits et devoirs",
    themeColor: "bg-green-100 text-green-800",
    question:
      "Quelle autorité indépendante est chargée de lutter contre les discriminations en France ?",
    choices: [
      "A. La Cour des comptes",
      "B. Le Conseil d'État",
      "C. Le Défenseur des droits",
      "D. La Commission nationale consultative",
    ],
    correctIndex: 2,
    explanation:
      "Le Défenseur des droits est une autorité constitutionnelle indépendante créée en 2011. Il est chargé de défendre les droits et les libertés des citoyens dans leurs relations avec les administrations publiques et les organismes privés. Il lutte contre les discriminations, protège les droits des enfants, veille à la déontologie des forces de sécurité et aide les usagers des services publics.",
  },
  /* ---------- Histoire et géographie ---------- */
  {
    id: 11,
    theme: "Histoire et géographie",
    themeColor: "bg-amber-100 text-amber-800",
    question:
      "Quelle est la date de la fête nationale française ?",
    choices: [
      "A. Le 8 mai",
      "B. Le 11 novembre",
      "C. Le 14 juillet",
      "D. Le 1er mai",
    ],
    correctIndex: 2,
    explanation:
      "La fête nationale française est célébrée le 14 juillet. Cette date commémore à la fois la prise de la Bastille le 14 juillet 1789, symbole de la fin de l'absolutisme royal, et la Fête de la Fédération du 14 juillet 1790, célébrant l'unité nationale. Le 14 juillet est marqué par un défilé militaire sur les Champs-Élysées, des feux d'artifice et des bals populaires dans toute la France.",
  },
  {
    id: 12,
    theme: "Histoire et géographie",
    themeColor: "bg-amber-100 text-amber-800",
    question:
      "En quelle année les femmes ont-elles obtenu le droit de vote en France ?",
    choices: [
      "A. 1936",
      "B. 1944",
      "C. 1958",
      "D. 1968",
    ],
    correctIndex: 1,
    explanation:
      "Les femmes françaises ont obtenu le droit de vote le 21 avril 1944, par une ordonnance du Comité français de la Libération nationale signée par le général de Gaulle à Alger. Elles ont voté pour la première fois lors des élections municipales du 29 avril 1945. La France a été l'un des derniers pays européens à accorder ce droit, bien après la Finlande (1906) et le Royaume-Uni (1918).",
  },
  {
    id: 13,
    theme: "Histoire et géographie",
    themeColor: "bg-amber-100 text-amber-800",
    question: "Quel est le plus haut sommet de France métropolitaine ?",
    choices: [
      "A. Le Pic du Midi",
      "B. Le Mont Ventoux",
      "C. Le Mont-Blanc",
      "D. Le Puy de Sancy",
    ],
    correctIndex: 2,
    explanation:
      "Le Mont-Blanc, situé dans les Alpes à la frontière entre la France et l'Italie, culmine à 4 807 mètres d'altitude (mesure variable selon l'enneigement). C'est le plus haut sommet d'Europe occidentale. Il se trouve dans le département de la Haute-Savoie, en région Auvergne-Rhône-Alpes. Le massif du Mont-Blanc attire chaque année des milliers d'alpinistes et de randonneurs du monde entier.",
  },
  /* ---------- Vivre en société ---------- */
  {
    id: 14,
    theme: "Vivre en société",
    themeColor: "bg-rose-100 text-rose-800",
    question:
      "En France, l'instruction est obligatoire jusqu'à quel âge ?",
    choices: [
      "A. 14 ans",
      "B. 16 ans",
      "C. 18 ans",
      "D. 12 ans",
    ],
    correctIndex: 1,
    explanation:
      "En France, l'instruction est obligatoire de 3 à 16 ans depuis la loi du 28 mars 1882 (loi Jules Ferry), modifiée par la loi de 2019 abaissant l'âge de début à 3 ans. L'obligation de formation a été étendue jusqu'à 18 ans par la loi du 26 juillet 2019, signifiant que tout jeune de 16 à 18 ans doit être en formation, en emploi ou en service civique. L'école publique est gratuite et laïque.",
  },
  {
    id: 15,
    theme: "Vivre en société",
    themeColor: "bg-rose-100 text-rose-800",
    question:
      "Comment s'appelle le système de protection sociale en France ?",
    choices: [
      "A. L'Assurance maladie universelle",
      "B. La Sécurité sociale",
      "C. La Mutuelle nationale",
      "D. Le Régime général d'entraide",
    ],
    correctIndex: 1,
    explanation:
      "La Sécurité sociale est le système de protection sociale français, créé en 1945 après la Seconde Guerre mondiale. Elle couvre quatre grands domaines : la maladie (assurance maladie), la famille (allocations familiales), la vieillesse (retraites) et les accidents du travail. Elle est financée principalement par les cotisations sociales des employeurs et des salariés, ainsi que par des impôts et taxes affectés.",
  },
];

/* ------------------------------------------------------------------ */
/*  Theme icons helper                                                 */
/* ------------------------------------------------------------------ */

function themeIcon(theme: string) {
  switch (theme) {
    case "Principes et valeurs":
      return <Target className="h-4 w-4" />;
    case "Institutions":
      return <GraduationCap className="h-4 w-4" />;
    case "Droits et devoirs":
      return <FileText className="h-4 w-4" />;
    case "Histoire et géographie":
      return <BookOpen className="h-4 w-4" />;
    case "Vivre en société":
      return <HelpCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TestBlanc() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const score = useMemo(() => revealed.size, [revealed]);

  /* Group questions by theme for section headings */
  const themeGroups = useMemo(() => {
    const groups: { theme: string; items: Question[] }[] = [];
    let current = "";
    for (const q of questions) {
      if (q.theme !== current) {
        groups.push({ theme: q.theme, items: [q] });
        current = q.theme;
      } else {
        groups[groups.length - 1].items.push(q);
      }
    }
    return groups;
  }, []);

  return (
    <>
      <SEOHead
        title="Test Blanc Examen Civique 2026 — 15 Questions Gratuites | GoCivique"
        description="Entraînez-vous avec ce test blanc examen civique gratuit : 15 QCM corrigés sur les valeurs, institutions, droits, histoire et société françaises. Préparez l'examen civique 2026 efficacement."
        path="/test-blanc-examen-civique"
        schema={[breadcrumbSchema, faqSchema]}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* ============================================================ */}
        {/* BREADCRUMB                                                    */}
        {/* ============================================================ */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1 text-sm text-slate-500"
          >
            <Link to="/" className="hover:text-[#0055A4] transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/guide-examen-civique"
              className="hover:text-[#0055A4] transition-colors"
            >
              Guide
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700 font-medium">Test Blanc</span>
          </motion.nav>
        </div>

        {/* ============================================================ */}
        {/* HERO                                                          */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-24 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm border border-white/20">
                <FileText className="h-4 w-4" />
                Test blanc gratuit 2026
              </span>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Test Blanc Examen Civique 2026
                <br className="hidden sm:block" />
                <span className="text-white/90">
                  {" "}
                  — 15 Questions Gratuites avec Corrections
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
                Préparez-vous efficacement avec ce QCM examen civique gratuit.
                Testez vos connaissances sur les valeurs, les institutions, les
                droits et l'histoire de France. Chaque question est accompagnée
                d'une correction détaillée pour vous aider à progresser
                rapidement.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="#questions"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0055A4] shadow-lg hover:bg-white/90 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Commencer le test
                </a>
                <a
                  href="#faq"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Questions fréquentes
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTRODUCTION                                                  */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-slate-900">
              Pourquoi faire un test blanc examen civique ?
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                L'examen civique est une étape incontournable du parcours
                d'intégration en France. Que vous prépariez votre naturalisation,
                votre carte de séjour pluriannuelle ou votre carte de résident,
                la réussite de cet examen est obligatoire. Ce test blanc examen
                civique gratuit vous permet de vous entraîner dans des conditions
                proches du véritable examen, avec des questions couvrant les cinq
                grands thèmes du programme officiel.
              </p>
              <p>
                Le véritable examen civique comporte environ 40 questions à choix
                multiples (QCM) à traiter en 45 minutes. Pour le réussir, il faut
                obtenir au minimum 80 % de bonnes réponses, soit 32 réponses
                correctes sur 40. Chaque question propose quatre réponses
                possibles, dont une seule est correcte. Les questions portent sur
                les principes et valeurs de la République, les institutions
                françaises, les droits et devoirs du citoyen, l'histoire et la
                géographie de la France, ainsi que la vie en société.
              </p>
              <p>
                Ce test blanc de 15 questions vous offre un aperçu représentatif
                de l'examen. Nous vous recommandons de répondre à chaque question
                sans consulter la correction, puis de cliquer sur « Voir la
                réponse » pour vérifier. Notez votre score et identifiez les
                thèmes où vous avez des lacunes. Refaites le test plusieurs fois
                jusqu'à obtenir un score parfait, puis passez aux examens blancs
                complets de 40 questions disponibles sur GoCivique.
              </p>
            </div>
          </motion.div>

          {/* Quick stats bar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                icon: <BookOpen className="h-5 w-5 text-[#0055A4]" />,
                label: "Questions",
                value: "15 QCM",
              },
              {
                icon: <Clock className="h-5 w-5 text-[#0055A4]" />,
                label: "Durée estimée",
                value: "10–15 min",
              },
              {
                icon: <Target className="h-5 w-5 text-[#0055A4]" />,
                label: "Thèmes couverts",
                value: "5 thèmes",
              },
              {
                icon: <Award className="h-5 w-5 text-[#0055A4]" />,
                label: "Corrections",
                value: "Détaillées",
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardVariant}
                className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* QUESTIONS                                                     */}
        {/* ============================================================ */}
        <section id="questions" className="mx-auto max-w-4xl px-4 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              15 Questions — Test Blanc Examen Civique
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Répondez mentalement à chaque question, puis cliquez sur « Voir la
              réponse » pour découvrir la correction et l'explication détaillée.
              Ce QCM examen civique gratuit couvre les cinq thèmes officiels du
              programme.
            </p>
          </motion.div>

          {themeGroups.map((group) => (
            <div key={group.theme} className="mb-12">
              <motion.h3
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800"
              >
                {themeIcon(group.theme)}
                {group.theme}
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({group.items.length} question
                  {group.items.length > 1 ? "s" : ""})
                </span>
              </motion.h3>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {group.items.map((q) => {
                  const isRevealed = revealed.has(q.id);
                  return (
                    <motion.div
                      key={q.id}
                      variants={cardVariant}
                      className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-5 sm:p-6 transition-shadow hover:shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#0055A4] text-white text-sm font-bold">
                          {q.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${q.themeColor}`}
                        >
                          {themeIcon(q.theme)}
                          {q.theme}
                        </span>
                      </div>

                      {/* Question */}
                      <p className="mb-5 text-lg font-semibold text-slate-800 leading-snug">
                        {q.question}
                      </p>

                      {/* Choices */}
                      <div className="grid sm:grid-cols-2 gap-3 mb-5">
                        {q.choices.map((choice, idx) => {
                          const isCorrect = idx === q.correctIndex;
                          let choiceClass =
                            "rounded-xl border p-3 text-sm transition-colors ";

                          if (isRevealed && isCorrect) {
                            choiceClass +=
                              "border-green-300 bg-green-50 text-green-800 font-semibold";
                          } else if (isRevealed && !isCorrect) {
                            choiceClass +=
                              "border-slate-200 bg-slate-50/60 text-slate-400";
                          } else {
                            choiceClass +=
                              "border-slate-200 bg-white text-slate-700 hover:border-[#0055A4]/30 hover:bg-blue-50/30";
                          }

                          return (
                            <div key={idx} className={choiceClass}>
                              <div className="flex items-start gap-2">
                                {isRevealed && isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                                )}
                                {isRevealed && !isCorrect && (
                                  <XCircle className="h-4 w-4 mt-0.5 text-slate-300 shrink-0" />
                                )}
                                <span>{choice}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reveal button */}
                      {!isRevealed && (
                        <button
                          onClick={() => toggleReveal(q.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] px-5 py-2.5 text-sm font-bold text-white shadow hover:shadow-md transition-shadow"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Voir la réponse
                        </button>
                      )}

                      {/* Explanation */}
                      {isRevealed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.4, ease: "easeOut" as const }}
                        >
                          <div className="mt-2 rounded-xl border border-green-200 bg-green-50/60 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-800 text-sm">
                                Bonne réponse : {q.choices[q.correctIndex]}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleReveal(q.id)}
                            className="mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            Masquer la réponse
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </section>

        {/* ============================================================ */}
        {/* SCORE                                                         */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-8 text-center"
          >
            <Award className="mx-auto h-10 w-10 text-[#0055A4] mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Combien de bonnes réponses ?
            </h2>
            <p className="text-slate-600 mb-6">
              Vous avez consulté les réponses de{" "}
              <span className="font-bold text-[#0055A4]">{score}</span> question
              {score > 1 ? "s" : ""} sur 15. Continuez à vous entraîner pour
              maîtriser chaque thème du programme de l'examen civique.
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.span
                key={score}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
                className="text-5xl font-extrabold text-[#0055A4]"
              >
                {score}
              </motion.span>
              <span className="text-3xl text-slate-300 font-light">/</span>
              <span className="text-5xl font-extrabold text-slate-300">15</span>
            </div>

            {/* Progress bar */}
            <div className="mx-auto max-w-xs h-3 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6]"
                initial={{ width: 0 }}
                animate={{ width: `${(score / 15) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              {score === 0 &&
                "Cliquez sur « Voir la réponse » sous chaque question pour découvrir les corrections."}
              {score > 0 &&
                score < 8 &&
                "Vous progressez ! Continuez à réviser les thèmes où vous avez des doutes."}
              {score >= 8 &&
                score < 13 &&
                "Bon travail ! Vous maîtrisez déjà plusieurs thèmes. Concentrez-vous sur les questions restantes."}
              {score >= 13 &&
                score < 15 &&
                "Excellent ! Vous êtes presque prêt pour l'examen civique."}
              {score === 15 &&
                "Félicitations ! Vous avez consulté toutes les réponses. Passez maintenant à un examen blanc complet de 40 questions."}
            </p>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* CTA                                                           */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-8 md:p-12 text-white"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIwLjMiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            <div className="relative">
              <GraduationCap className="h-10 w-10 mb-4 text-white/80" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Passez un examen blanc complet
              </h2>
              <p className="max-w-xl text-white/80 leading-relaxed mb-6">
                Vous avez terminé ce test blanc de 15 questions. Pour vous
                préparer dans les conditions réelles de l'examen civique,
                passez à nos examens blancs complets de 40 questions
                chronométrées en 45 minutes. Suivez votre progression thème par
                thème et identifiez précisément vos points faibles grâce aux
                statistiques détaillées.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/exams"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0055A4] shadow-lg hover:bg-white/90 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Examen blanc complet
                </Link>
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  Quiz par thème
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* CONSEILS DE PREPARATION                                       */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-slate-900">
              Conseils pour réussir l'examen civique du premier coup
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                La préparation à l'examen civique demande de la régularité et de
                la méthode. Voici nos recommandations pour maximiser vos chances
                de réussite lors de votre premier passage.
              </p>
              <p>
                <strong>Planifiez vos révisions sur 4 à 6 semaines.</strong>{" "}
                Consacrez 30 à 45 minutes par jour à la révision d'un thème
                spécifique. Commencez par les principes et valeurs de la
                République, car c'est le thème le plus transversal et le plus
                souvent interrogé à l'examen. Passez ensuite aux institutions,
                puis à l'histoire et la géographie, aux droits et devoirs, et
                enfin à la vie en société.
              </p>
              <p>
                <strong>Faites des tests blancs régulièrement.</strong> Le
                meilleur moyen de se préparer à un examen est de s'entraîner
                dans les conditions réelles. Faites au moins un test blanc
                complet par semaine en vous chronométrant (45 minutes pour 40
                questions). Analysez vos erreurs après chaque test et concentrez
                vos révisions sur les thèmes où vous obtenez les scores les plus
                bas.
              </p>
              <p>
                <strong>Lisez le livret d'accueil de l'OFII.</strong> Ce
                document officiel, remis lors de la signature du contrat
                d'intégration républicaine (CIR), contient les informations
                essentielles sur les valeurs et le fonctionnement de la
                République française. C'est la base de votre préparation et de
                nombreuses questions de l'examen s'appuient directement sur son
                contenu.
              </p>
              <p>
                <strong>Mémorisez les dates clés et les chiffres importants.</strong>{" "}
                Certaines données reviennent très fréquemment à l'examen : la
                devise, l'hymne national, la date de la fête nationale (14
                juillet), la durée du mandat présidentiel (5 ans), le nombre de
                députés (577), l'année du droit de vote des femmes (1944), l'âge
                du droit de vote (18 ans) ou encore la loi de séparation de
                l'Église et de l'État (1905). Créez des fiches de révision avec
                ces informations pour les mémoriser efficacement.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* FAQ                                                           */}
        {/* ============================================================ */}
        <section id="faq" className="mx-auto max-w-4xl px-4 pb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-slate-900 text-center">
              Questions Fréquentes sur l'Examen Civique
            </h2>

            <div className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-left text-slate-800 font-semibold">
                    Combien de questions comporte l'examen civique réel ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    L'examen civique réel comporte entre 40 et 60 questions à
                    choix multiples (QCM). Le nombre exact peut varier selon la
                    session et le centre d'examen. Chaque question propose
                    quatre réponses possibles dont une seule est correcte.
                    L'examen se déroule sur tablette ou ordinateur dans un
                    centre agréé par l'OFII (Office Français de l'Immigration
                    et de l'Intégration). Le temps imparti est de 45 minutes,
                    ce qui laisse environ une minute par question. Il est
                    recommandé de ne pas passer trop de temps sur une question
                    difficile et de revenir dessus à la fin si le temps le
                    permet.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-left text-slate-800 font-semibold">
                    Quel est le score minimum pour réussir l'examen civique ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Le score minimum requis pour valider l'examen civique est
                    généralement fixé à 80 % de bonnes réponses, soit 32
                    réponses correctes sur 40 questions. Ce seuil peut varier
                    légèrement selon les sessions. Il est donc recommandé de
                    viser un score supérieur à 85 % lors de vos entraînements
                    pour disposer d'une marge de sécurité confortable le jour
                    de l'examen. En cas d'échec, vous pouvez repasser l'examen
                    lors d'une session ultérieure. GoCivique vous aide à
                    atteindre ce niveau grâce à des examens blancs réalistes
                    et un suivi de progression détaillé.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-left text-slate-800 font-semibold">
                    Peut-on utiliser un dictionnaire pendant l'examen civique ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    Non, l'utilisation d'un dictionnaire, d'un téléphone
                    portable ou de tout autre document est strictement
                    interdite pendant l'examen civique. L'examen se déroule
                    dans des conditions surveillées et les candidats ne peuvent
                    utiliser aucune aide extérieure. C'est pourquoi il est
                    essentiel de bien se préparer en amont et de maîtriser le
                    vocabulaire civique de base. Si le français n'est pas
                    votre langue maternelle, nous vous recommandons de
                    réviser les termes clés comme « laïcité », « suffrage
                    universel », « constitution » ou « République » à l'aide
                    des cours disponibles sur GoCivique, traduits en plusieurs
                    langues.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-left text-slate-800 font-semibold">
                    Combien de temps faut-il pour se préparer à l'examen
                    civique ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    La durée de préparation recommandée est de 4 à 8 semaines
                    à raison de 30 à 45 minutes par jour. Cependant, ce délai
                    dépend de votre niveau de connaissance initial de la France
                    et de la langue française. Les candidats ayant un bon
                    niveau de français et une certaine familiarité avec la
                    culture française peuvent se préparer en 2 à 3 semaines.
                    L'essentiel est de réviser régulièrement et de faire des
                    tests blancs chronométrés. GoCivique propose un programme
                    de révision structuré qui vous guide jour après jour
                    jusqu'à la date de votre examen.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-left text-slate-800 font-semibold">
                    Où passer l'examen civique en France ?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    L'examen civique se passe dans un centre agréé par l'OFII
                    (Office Français de l'Immigration et de l'Intégration). Il
                    en existe dans chaque département de France métropolitaine
                    et dans les départements d'outre-mer. La convocation vous
                    est envoyée par courrier ou par e-mail avec l'adresse
                    exacte du centre, la date et l'heure de l'examen. Vous
                    devez vous présenter muni d'une pièce d'identité en cours
                    de validité. En cas d'empêchement, contactez votre
                    direction territoriale de l'OFII le plus tôt possible
                    pour demander un report.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* RELATED LINKS                                                 */}
        {/* ============================================================ */}
        <section className="mx-auto max-w-4xl px-4 pb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Continuez votre préparation
            </h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                {
                  to: "/guide-examen-civique",
                  icon: <BookOpen className="h-5 w-5 text-[#0055A4]" />,
                  title: "Guide complet de l'examen",
                  desc: "Format, thèmes, conseils et ressources pour réussir l'examen civique 2026.",
                },
                {
                  to: "/themes/valeurs-republique",
                  icon: <Target className="h-5 w-5 text-[#0055A4]" />,
                  title: "Principes et valeurs",
                  desc: "Devise, laïcité, droits de l'homme : révisez le thème le plus important.",
                },
                {
                  to: "/themes/institutions",
                  icon: <GraduationCap className="h-5 w-5 text-[#0055A4]" />,
                  title: "Institutions françaises",
                  desc: "Président, Parlement, Conseil constitutionnel : maîtrisez les institutions.",
                },
                {
                  to: "/themes/droits-devoirs",
                  icon: <FileText className="h-5 w-5 text-[#0055A4]" />,
                  title: "Droits et devoirs",
                  desc: "Vote, impôts, service national : connaissez vos droits et obligations.",
                },
                {
                  to: "/themes/histoire-geographie",
                  icon: <BookOpen className="h-5 w-5 text-[#0055A4]" />,
                  title: "Histoire et géographie",
                  desc: "Dates clés, symboles nationaux et géographie du territoire français.",
                },
                {
                  to: "/courses",
                  icon: <Award className="h-5 w-5 text-[#0055A4]" />,
                  title: "Cours en ligne",
                  desc: "Fiches de révision complètes et cours structurés pour chaque thème.",
                },
              ].map((link) => (
                <motion.div key={link.to} variants={cardVariant}>
                  <Link
                    to={link.to}
                    className="group block bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {link.icon}
                      <h3 className="font-bold text-slate-800 group-hover:text-[#0055A4] transition-colors">
                        {link.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {link.desc}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#0055A4]">
                      En savoir plus
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
