import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Flag,
  FileText,
  Clock,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  GraduationCap,
  ChevronRight,
  Scale,
  Shield,
  Heart,
  AlertTriangle,
  Award,
} from "lucide-react";

/* ---------- JSON-LD schemas ---------- */

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
      name: "Naturalisation française et examen civique",
      item: "https://gocivique.fr/naturalisation",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien de temps dure le processus de naturalisation ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le processus de naturalisation dure en moyenne 12 à 18 mois, de la constitution du dossier jusqu'à la publication du décret au Journal Officiel. Les délais varient selon la préfecture de votre lieu de résidence et la complétude de votre dossier.",
      },
    },
    {
      "@type": "Question",
      name: "L'examen civique est-il le seul examen requis ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. En plus de l'examen civique, vous devez justifier d'un niveau de français B1 oral et écrit. Vous pouvez le prouver par un diplôme (DELF B1, TCF) ou par une attestation de formation linguistique.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il parler français couramment ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il n'est pas nécessaire de parler français couramment, mais un niveau B1 (utilisateur indépendant) est exigé à l'oral et à l'écrit. Cela correspond à la capacité de comprendre les points essentiels d'une conversation courante et de s'exprimer de manière simple mais cohérente sur des sujets familiers.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on repasser l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, en cas d'échec, vous pouvez repasser l'examen civique sans limitation du nombre de tentatives. Il est recommandé de réviser davantage et de vous entraîner avec des examens blancs avant de retenter l'épreuve.",
      },
    },
    {
      "@type": "Question",
      name: "L'examen civique est-il payant ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'examen civique est organisé dans le cadre du contrat d'intégration républicaine (CIR). Les frais sont généralement pris en charge par l'État. Toutefois, des frais de timbre fiscal de 25 euros sont à prévoir pour le dossier de naturalisation.",
      },
    },
    {
      "@type": "Question",
      name: "Quels documents apporter le jour de l'examen ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le jour de l'examen, vous devez présenter une pièce d'identité en cours de validité (passeport ou titre de séjour), votre convocation, et éventuellement votre attestation de formation civique OFII.",
      },
    },
    {
      "@type": "Question",
      name: "La naturalisation par mariage nécessite-t-elle l'examen civique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, depuis les réformes récentes, les candidats à la naturalisation par mariage doivent également passer l'examen civique et justifier d'un niveau de langue B1. Le processus est similaire à la naturalisation par décret, mais avec des conditions de durée de mariage spécifiques.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre naturalisation et déclaration de nationalité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La naturalisation est une procédure discrétionnaire par décret, décidée par l'État après examen du dossier. La déclaration de nationalité est un droit pour certaines personnes remplissant des conditions précises (mariage avec un Français depuis 4 ans, naissance et résidence en France, etc.). La naturalisation demande un examen civique, tandis que la déclaration ne l'exige pas toujours.",
      },
    },
  ],
};

/* ---------- animation helpers ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ---------- data ---------- */

const timelineSteps = [
  {
    icon: FileText,
    title: "Constitution du dossier",
    desc: "Rassemblez les pièces justificatives : justificatifs de domicile, bulletins de salaire, casier judiciaire, acte de naissance, etc.",
  },
  {
    icon: Calendar,
    title: "Dépôt en préfecture",
    desc: "Déposez votre dossier complet auprès de la préfecture de votre lieu de résidence, en ligne ou en personne.",
  },
  {
    icon: Users,
    title: "Entretien d'assimilation",
    desc: "Un agent de préfecture vérifie votre connaissance de la langue française, votre intégration et votre adhésion aux valeurs de la République.",
  },
  {
    icon: GraduationCap,
    title: "Examen civique",
    desc: "Passez l'examen civique (QCM) portant sur l'histoire, les institutions, les valeurs et les droits et devoirs du citoyen français.",
  },
  {
    icon: Clock,
    title: "Instruction du dossier",
    desc: "Le ministère de l'Intérieur examine votre dossier. Cette phase dure entre 6 et 12 mois selon les préfectures.",
  },
  {
    icon: Award,
    title: "Décret de naturalisation",
    desc: "En cas d'acceptation, un décret est publié au Journal Officiel. Vous recevez une convocation pour la cérémonie d'accueil dans la nationalité française.",
  },
];

const examCenters = [
  "Paris (Île-de-France)",
  "Lyon (Auvergne-Rhône-Alpes)",
  "Marseille (Provence-Alpes-Côte d'Azur)",
  "Toulouse (Occitanie)",
  "Bordeaux (Nouvelle-Aquitaine)",
  "Lille (Hauts-de-France)",
  "Strasbourg (Grand Est)",
  "Nantes (Pays de la Loire)",
  "Rennes (Bretagne)",
  "Montpellier (Occitanie)",
];

const goCiviqueFeatures = [
  {
    icon: CheckCircle2,
    title: "Quiz interactifs",
    desc: "Des centaines de questions à choix multiples classées par thème pour un entraînement ciblé et progressif.",
  },
  {
    icon: FileText,
    title: "Examens blancs chronométrés",
    desc: "Simulez les conditions réelles de l'examen avec des sessions de 40 à 60 questions en 45 minutes.",
  },
  {
    icon: GraduationCap,
    title: "Cours structurés",
    desc: "Des fiches de révision complètes sur les 5 thèmes du programme officiel, rédigées par des experts.",
  },
  {
    icon: Flag,
    title: "Disponible en 6 langues",
    desc: "Français, anglais, arabe, espagnol, turc et portugais pour que chacun puisse apprendre dans sa langue maternelle.",
  },
];

/* ---------- component ---------- */

export default function Naturalisation() {
  return (
    <>
      <SEOHead
        title="Naturalisation Française et Examen Civique 2026 — Guide Complet | GoCivique"
        description="Guide complet sur la naturalisation française et l'examen civique 2026 : conditions, démarches, inscription, centres d'examen, préparation et FAQ. Préparez votre examen civique pour la carte de séjour ou la naturalisation."
        path="/naturalisation"
        schema={[breadcrumbSchema, faqSchema]}
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:py-28">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              to="/guide-examen-civique"
              className="hover:text-white transition-colors"
            >
              Guide examen civique
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">Naturalisation</span>
          </nav>

          <motion.h1
            className="mb-6 text-3xl font-extrabold leading-tight md:text-5xl lg:text-[3.25rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Naturalisation Française et Examen Civique 2026&nbsp;— Guide Complet
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            L'examen civique est une étape incontournable du parcours de naturalisation
            française. Ce guide détaillé vous accompagne à travers toutes les étapes,
            de la constitution de votre dossier jusqu'à l'obtention du décret de
            naturalisation, en passant par la préparation et le passage de l'examen
            civique.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Link
              to="/quiz"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0055A4] shadow-lg hover:bg-white/90 transition-colors"
            >
              Commencer un quiz gratuit
            </Link>
            <Link
              to="/guide-examen-civique"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Voir le guide de l'examen
            </Link>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-slate-800">
        {/* ===== SECTION 1 — Introduction ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
            Le chemin vers la nationalité française
          </h2>
          <p className="mb-4 text-slate-700 leading-relaxed">
            Obtenir la nationalité française est un objectif partagé par des milliers de résidents étrangers chaque année. La France accueille environ 90 000 nouveaux citoyens par an grâce à la naturalisation, ce qui en fait l'un des pays européens les plus ouverts à l'acquisition de nationalité. Pourtant, le parcours reste exigeant et demande une préparation rigoureuse, tant sur le plan administratif que sur le plan des connaissances civiques.
          </p>
          <p className="mb-4 text-slate-700 leading-relaxed">
            L'examen civique occupe une place centrale dans ce parcours. Introduit dans le cadre du contrat d'intégration républicaine (CIR), il vise à s'assurer que chaque candidat à la naturalisation possède une connaissance suffisante de l'histoire de France, de ses institutions, de ses valeurs républicaines et des droits et devoirs du citoyen. Réussir cet examen, c'est démontrer votre volonté d'intégration et votre attachement aux principes qui fondent la République française.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Ce guide complet couvre l'ensemble du processus de naturalisation française en 2026 : les conditions d'éligibilité, les démarches administratives, le déroulement de l'examen civique, les conseils de préparation, les centres d'examen en France et les questions fréquemment posées. Que vous soyez en début de parcours ou déjà engagé dans la procédure, vous trouverez ici toutes les informations nécessaires pour avancer sereinement. L'objectif est de vous donner une vision claire et complète de chaque étape, afin que vous puissiez vous concentrer sur l'essentiel : votre préparation.
          </p>
        </motion.section>

        {/* ===== SECTION 2 — Qu'est-ce que la naturalisation ? ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <Scale className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Qu'est-ce que la naturalisation française ?
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            La naturalisation est une procédure par laquelle un ressortissant étranger acquiert la nationalité française par décision de l'État. Contrairement à l'acquisition automatique de la nationalité (droit du sol pour les enfants nés en France de parents étrangers, par exemple), la naturalisation est une décision discrétionnaire du gouvernement, qui examine chaque demande au cas par cas. Elle est encadrée par les articles 21-14-1 à 21-27 du Code civil français.
          </p>
          <p className="mb-4 text-slate-700 leading-relaxed">
            Il est important de distinguer la naturalisation des autres modes d'acquisition de la nationalité française. La <strong>déclaration de nationalité</strong> concerne les personnes ayant un lien direct avec la France (mariage avec un Français depuis au moins 4 ans, naissance et résidence en France). Le <strong>droit du sol</strong> s'applique aux enfants nés en France de parents étrangers, qui acquièrent automatiquement la nationalité à 18 ans sous certaines conditions. La <strong>naturalisation par décret</strong>, quant à elle, est ouverte à tout étranger remplissant les conditions légales, indépendamment de sa situation familiale.
          </p>

          <div className="mb-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-6">
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              Conditions à remplir pour la naturalisation
            </h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Résidence stable en France :</strong> au moins 5 ans de résidence habituelle et continue sur le territoire français (réduit à 2 ans pour les diplômés de l'enseignement supérieur français ou les personnes ayant rendu des services exceptionnels à la France).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Ressources stables et suffisantes :</strong> vous devez justifier de revenus réguliers permettant de subvenir à vos besoins et à ceux de votre famille, sans recourir de manière excessive aux aides sociales.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Bonne moralité :</strong> absence de condamnations pénales graves, casier judiciaire vierge ou ne présentant pas de mentions incompatibles avec la naturalisation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Maîtrise de la langue française :</strong> niveau B1 du Cadre européen commun de référence pour les langues (CECRL), à l'oral comme à l'écrit. Ce niveau correspond à celui d'un utilisateur indépendant, capable de comprendre les points essentiels d'une discussion courante et de s'exprimer sur des sujets familiers de manière simple et cohérente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Connaissance des valeurs et de l'histoire de France :</strong> validée par la réussite à l'examen civique et lors de l'entretien d'assimilation en préfecture.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>
                  <strong>Adhésion aux principes de la République :</strong> vous devez signer la Charte des droits et devoirs du citoyen français, qui rappelle les valeurs fondamentales (liberté, égalité, fraternité, laïcité, égalité homme-femme).
                </span>
              </li>
            </ul>
          </div>

          <p className="text-slate-700 leading-relaxed">
            Le non-respect de l'une de ces conditions peut entraîner un ajournement (report de la décision) ou un rejet de la demande. En cas d'ajournement, le candidat peut redéposer une demande après un délai de deux ans. Il est donc essentiel de bien préparer son dossier et de remplir toutes les conditions avant de faire sa demande.
          </p>
        </motion.section>

        {/* ===== SECTION 3 — Qui doit passer l'examen civique ? ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <Users className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Qui doit passer l'examen civique ?
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            L'examen civique ne concerne pas uniquement les candidats à la naturalisation. Plusieurs catégories de personnes sont tenues de le passer dans le cadre de leurs démarches administratives en France. Comprendre si vous êtes concerné est la première étape de votre préparation. Voici les situations dans lesquelles l'examen civique est requis et celles dans lesquelles vous en êtes dispensé.
          </p>

          <motion.div
            className="mb-6 grid gap-4 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Flag,
                title: "Naturalisation (première demande)",
                desc: "Toute personne demandant la nationalité française par décret doit réussir l'examen civique. C'est une condition sine qua non pour que votre dossier soit recevable.",
                color: "text-blue-600",
              },
              {
                icon: FileText,
                title: "Carte de séjour pluriannuelle (CSP)",
                desc: "Lors de votre première demande de CSP, dans le cadre du contrat d'intégration républicaine (CIR), l'examen civique est obligatoire pour valider votre parcours d'intégration.",
                color: "text-indigo-600",
              },
              {
                icon: Shield,
                title: "Carte de résident (CR)",
                desc: "La première demande de carte de résident (10 ans) nécessite également la réussite de l'examen civique, qui atteste de votre intégration dans la société française.",
                color: "text-emerald-600",
              },
              {
                icon: Heart,
                title: "Naturalisation par mariage",
                desc: "Les conjoints de Français demandant la nationalité par déclaration ou naturalisation après 4 ans de mariage doivent aussi passer l'examen civique depuis les réformes récentes.",
                color: "text-rose-600",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-5"
                variants={fadeIn}
              >
                <item.icon className={`mb-2 h-6 w-6 ${item.color}`} />
                <h3 className="mb-1 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="rounded-2xl bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 shadow p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Dispenses et exemptions</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Sont dispensés de l'examen civique : les citoyens de l'Union européenne (qui bénéficient de la libre circulation), les réfugiés statutaires dans certains cas, les personnes titulaires d'un diplôme de l'enseignement supérieur français, ainsi que les demandeurs d'une carte de séjour temporaire d'un an (qui n'est pas soumise à cette obligation). Si vous êtes dans l'une de ces situations, renseignez-vous auprès de votre préfecture pour confirmer votre dispense.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 4 — Timeline du parcours ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <Clock className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              L'examen civique dans le parcours de naturalisation
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            Comprendre l'ensemble du parcours de naturalisation vous aidera à planifier vos démarches et à anticiper les délais. Le processus complet, de la constitution du dossier jusqu'à l'obtention du décret de naturalisation, dure en moyenne entre 12 et 18 mois. Certaines préfectures connaissent des délais plus longs en raison du volume de demandes. L'examen civique intervient généralement après l'entretien d'assimilation en préfecture, mais il est fortement recommandé de commencer votre préparation bien en amont.
          </p>
          <p className="mb-8 text-slate-700 leading-relaxed">
            Voici les grandes étapes du parcours de naturalisation, dans l'ordre chronologique. Chaque étape est indispensable et conditionne la suivante. Un dossier incomplet ou un échec à l'examen civique peut retarder considérablement votre procédure. Préparez-vous donc de manière méthodique et complète pour maximiser vos chances de succès dès la première tentative.
          </p>

          {/* Timeline */}
          <motion.div
            className="relative ml-4 border-l-2 border-[#0055A4]/20 pl-8 space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {timelineSteps.map((step, i) => (
              <motion.div key={step.title} className="relative" variants={fadeIn}>
                {/* dot */}
                <div className="absolute -left-[2.85rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] text-white shadow-md">
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-5">
                  <span className="mb-1 inline-block rounded-full bg-[#0055A4]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0055A4]">
                    Étape {i + 1}
                  </span>
                  <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 rounded-2xl bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 shadow p-5">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Conseil pratique :</strong> N'attendez pas d'avoir reçu votre convocation en préfecture pour commencer à préparer l'examen civique. Idéalement, commencez votre préparation 2 à 3 mois avant le dépôt de votre dossier. Cela vous permettra d'aborder l'entretien d'assimilation avec confiance et de passer l'examen civique sans stress. La majorité des candidats qui échouent n'ont pas suffisamment anticipé cette étape.
            </p>
          </div>
        </motion.section>

        {/* ===== SECTION 5 — Comment s'inscrire ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <Calendar className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Comment s'inscrire à l'examen civique
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            L'inscription à l'examen civique se fait dans le cadre du contrat d'intégration républicaine (CIR), signé auprès de l'OFII (Office Français de l'Immigration et de l'Intégration). Lors de la signature du CIR, un parcours de formation civique vous est proposé, comprenant des sessions obligatoires sur les valeurs de la République, l'histoire et les institutions françaises. L'examen civique a lieu à l'issue de ce parcours de formation.
          </p>
          <p className="mb-6 text-slate-700 leading-relaxed">
            Pour les candidats à la naturalisation qui ont déjà validé leur CIR, l'inscription à l'examen peut se faire directement auprès de votre préfecture de résidence. La convocation vous est envoyée par courrier ou par voie dématérialisée, avec la date, l'heure et le lieu de l'examen. Veillez à bien vérifier votre boîte aux lettres et votre espace en ligne sur le site de la préfecture pour ne pas manquer cette convocation.
          </p>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-6">
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              Documents requis pour l'inscription
            </h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0055A4]" />
                <span>Passeport ou titre de séjour en cours de validité</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0055A4]" />
                <span>Attestation de domicile de moins de 3 mois (facture, quittance de loyer)</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0055A4]" />
                <span>Attestation de formation civique OFII (si applicable)</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0055A4]" />
                <span>Timbre fiscal de 25 euros pour le dossier de naturalisation</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0055A4]" />
                <span>Photos d'identité conformes aux normes en vigueur</span>
              </li>
            </ul>
          </div>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Les frais de l'examen civique sont généralement inclus dans le dispositif de formation du CIR et pris en charge par l'État. Cependant, des frais de timbre fiscal sont à prévoir pour la constitution du dossier de naturalisation. Pour choisir votre date et lieu d'examen, renseignez-vous auprès de la direction territoriale de l'OFII de votre département ou consultez le site officiel de l'OFII pour connaître les prochaines sessions disponibles dans votre région.
          </p>
        </motion.section>

        {/* ===== SECTION 6 — Centres d'examen ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <MapPin className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Centres d'examen en France
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            L'examen civique se déroule dans les centres de formation agréés par l'OFII, répartis sur l'ensemble du territoire français. Chaque direction territoriale de l'OFII organise des sessions régulières tout au long de l'année. Les grandes métropoles proposent des sessions mensuelles, tandis que les villes moyennes peuvent avoir des sessions trimestrielles. Renseignez-vous bien à l'avance pour réserver votre place.
          </p>

          <motion.div
            className="mb-6 grid gap-3 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {examCenters.map((center) => (
              <motion.div
                key={center}
                className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow p-3"
                variants={fadeIn}
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#0055A4]" />
                <span className="text-sm text-slate-700">{center}</span>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-slate-700 leading-relaxed">
            Pour trouver le centre le plus proche de votre domicile, consultez le site officiel de l'OFII (<strong>ofii.fr</strong>) ou contactez la direction territoriale de votre département. Le jour de l'examen, munissez-vous de votre pièce d'identité en cours de validité, de votre convocation et arrivez au moins 15 minutes avant l'heure prévue. Aucun appareil électronique n'est autorisé dans la salle d'examen. Un crayon et un formulaire de réponse vous seront fournis sur place.
          </p>
        </motion.section>

        {/* ===== SECTION 7 — Se préparer avec GoCivique ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <GraduationCap className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Se préparer avec GoCivique
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            GoCivique est la plateforme de référence pour la préparation à l'examen civique en France. Conçue spécifiquement pour les candidats à la naturalisation française, à la carte de séjour pluriannuelle et à la carte de résident, elle propose un parcours d'apprentissage complet et structuré couvrant les 5 thèmes officiels du programme : les valeurs de la République, l'histoire et la géographie de la France, les institutions et le système politique, les droits et devoirs du citoyen, et la vie en société française.
          </p>

          <motion.div
            className="mb-6 grid gap-4 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {goCiviqueFeatures.map((feat) => (
              <motion.div
                key={feat.title}
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg p-5"
                variants={fadeIn}
              >
                <feat.icon className="mb-2 h-6 w-6 text-[#0055A4]" />
                <h3 className="mb-1 font-bold text-slate-900">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            En plus des quiz et examens blancs, GoCivique offre un parcours guidé qui suit la progression officielle du programme OFII. Chaque module se termine par un test de validation qui vous permet de mesurer votre niveau de maîtrise sur chaque thème. Grâce aux statistiques détaillées, vous identifiez rapidement vos points faibles et pouvez concentrer vos révisions là où elles sont le plus nécessaires.
          </p>
          <p className="text-slate-700 leading-relaxed">
            La plateforme est disponible en 6 langues (français, anglais, arabe, espagnol, turc et portugais), ce qui permet aux candidats de comprendre les questions dans leur langue maternelle tout en apprenant les réponses en français. Un essai gratuit vous permet de découvrir la plateforme et de passer un premier examen blanc pour évaluer votre niveau de départ. Commencez dès maintenant pour maximiser vos chances de réussite le jour de l'examen.
          </p>
        </motion.section>

        {/* ===== SECTION 8 — Après l'examen ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <Award className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Après l'examen : résultats et suite du parcours
            </h2>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            Une fois l'examen civique passé, les résultats vous sont communiqués dans un délai de quelques semaines. Vous recevez une attestation de réussite ou un avis d'échec par courrier ou par voie dématérialisée. Cette attestation est un document officiel que vous devrez joindre à votre dossier de naturalisation. Conservez-la précieusement, car elle constitue une pièce essentielle de votre demande.
          </p>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-green-50/80 backdrop-blur-sm border border-green-200/60 shadow p-5">
              <CheckCircle2 className="mb-2 h-6 w-6 text-green-600" />
              <h3 className="mb-1 font-bold text-green-900">En cas de réussite</h3>
              <p className="text-sm text-green-800 leading-relaxed">
                Votre attestation de réussite est jointe à votre dossier de naturalisation. Le ministère de l'Intérieur poursuit l'instruction de votre demande. Si toutes les conditions sont remplies, un décret de naturalisation est publié au Journal Officiel, et vous êtes convoqué pour la cérémonie d'accueil dans la citoyenneté française. Cette cérémonie est un moment solennel au cours duquel vous recevez votre certificat de nationalité française.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 shadow p-5">
              <AlertTriangle className="mb-2 h-6 w-6 text-amber-600" />
              <h3 className="mb-1 font-bold text-amber-900">En cas d'échec</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                Un échec à l'examen civique n'est pas définitif. Vous pouvez repasser l'examen autant de fois que nécessaire, sans limitation du nombre de tentatives. Il est recommandé de réviser les thèmes sur lesquels vous avez échoué et de vous entraîner avec des examens blancs sur GoCivique avant de retenter l'épreuve. En général, un délai de quelques semaines entre deux tentatives est conseillé pour approfondir vos connaissances.
              </p>
            </div>
          </div>

          <p className="mb-4 text-slate-700 leading-relaxed">
            Les résultats de l'examen civique sont valides de manière illimitée. Une fois l'attestation de réussite obtenue, elle reste valable sans date d'expiration, ce qui signifie que vous n'aurez pas besoin de repasser l'examen même si votre procédure de naturalisation prend plus de temps que prévu. C'est une bonne raison de passer l'examen le plus tôt possible dans votre parcours.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Après la publication du décret de naturalisation au Journal Officiel, vous recevez une convocation pour la cérémonie d'accueil dans la citoyenneté française. Au cours de cette cérémonie, vous signez la Charte des droits et devoirs du citoyen français et vous recevez votre certificat de nationalité. Vous pouvez ensuite demander votre carte nationale d'identité et votre passeport français, et exercer pleinement vos droits de citoyen, notamment le droit de vote.
          </p>
        </motion.section>

        {/* ===== SECTION 9 — FAQ ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
              <FileText className="h-5 w-5 text-[#0055A4]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Questions fréquentes sur la naturalisation et l'examen civique
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                Combien de temps dure le processus de naturalisation ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Le processus de naturalisation dure en moyenne 12 à 18 mois, de la
                constitution du dossier jusqu'à la publication du décret au Journal
                Officiel. Les délais varient selon la préfecture de votre lieu de
                résidence et la complétude de votre dossier. Certaines préfectures,
                notamment en Île-de-France, connaissent des délais plus longs en raison
                du volume élevé de demandes. Il est recommandé de constituer un dossier
                complet dès le départ pour éviter les allers-retours avec
                l'administration et les retards inutiles.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                L'examen civique est-il le seul examen requis ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Non. En plus de l'examen civique, vous devez justifier d'un niveau de
                français B1 oral et écrit (Cadre européen commun de référence). Vous
                pouvez le prouver par un diplôme reconnu (DELF B1, TCF pour l'accès à
                la nationalité française) ou par une attestation de formation
                linguistique délivrée par un organisme agréé. L'examen civique porte
                uniquement sur les connaissances civiques (histoire, institutions,
                valeurs), tandis que le test de langue évalue votre maîtrise du
                français à l'oral et à l'écrit.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                Faut-il parler français couramment ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Il n'est pas nécessaire de parler français couramment, mais un niveau
                B1 (utilisateur indépendant) est exigé à l'oral et à l'écrit pour la
                naturalisation. Ce niveau correspond à la capacité de comprendre les
                points essentiels d'une conversation courante, de s'exprimer de manière
                simple mais cohérente sur des sujets familiers, et de rédiger un texte
                simple et structuré. L'examen civique, quant à lui, est un QCM : vous
                devez comprendre les questions en français, mais les réponses sont
                proposées sous forme de choix multiples, ce qui ne nécessite pas de
                rédaction.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                Peut-on repasser l'examen civique ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Oui, en cas d'échec, vous pouvez repasser l'examen civique sans
                limitation du nombre de tentatives. Il est recommandé de prendre le
                temps de bien réviser entre deux passages, en utilisant des outils de
                préparation comme les examens blancs de GoCivique. En général, un délai
                de 4 à 6 semaines entre deux tentatives est conseillé pour approfondir
                les thèmes sur lesquels vous avez échoué. La plupart des candidats
                réussissent dès la deuxième tentative avec une préparation adéquate.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                L'examen civique est-il payant ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                L'examen civique est organisé dans le cadre du contrat d'intégration
                républicaine (CIR). Les frais de formation et d'examen sont
                généralement pris en charge par l'État français via l'OFII. Toutefois,
                des frais de timbre fiscal de 25 euros sont à prévoir pour la
                constitution du dossier de naturalisation lui-même. Ces frais couvrent
                le traitement administratif de votre demande. Aucun frais
                supplémentaire ne vous sera demandé le jour de l'examen.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q6">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                Quels documents apporter le jour de l'examen ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Le jour de l'examen, vous devez impérativement vous munir de votre
                pièce d'identité en cours de validité (passeport ou titre de séjour),
                de votre convocation officielle reçue par courrier ou par voie
                dématérialisée, et éventuellement de votre attestation de formation
                civique OFII. Aucun appareil électronique (téléphone portable, tablette,
                montre connectée) n'est autorisé dans la salle d'examen. Prévoyez
                d'arriver 15 minutes avant l'heure prévue pour effectuer les formalités
                d'enregistrement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q7">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                La naturalisation par mariage nécessite-t-elle l'examen civique ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                Oui. Depuis les réformes récentes, les candidats à la naturalisation
                par mariage doivent également passer l'examen civique et justifier d'un
                niveau de langue B1. Le processus est similaire à la naturalisation par
                décret, mais les conditions de durée diffèrent : il faut être marié
                depuis au moins 4 ans avec un conjoint français, et la communauté de
                vie ne doit pas avoir cessé. Le conjoint français doit avoir conservé
                sa nationalité tout au long de cette période. L'examen civique reste
                obligatoire dans tous les cas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q8">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                Quelle est la différence entre naturalisation et déclaration de nationalité ?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 leading-relaxed">
                La naturalisation est une procédure discrétionnaire par décret, décidée
                par l'État après examen approfondi du dossier. L'administration peut
                refuser une demande même si toutes les conditions sont remplies, pour
                des motifs liés à l'intérêt national. La déclaration de nationalité, en
                revanche, est un droit pour certaines personnes remplissant des
                conditions précises (mariage avec un Français depuis 4 ans, naissance
                et résidence en France, ascendant français, etc.). Concrètement, la
                naturalisation exige l'examen civique et un entretien d'assimilation,
                tandis que la déclaration de nationalité peut avoir des exigences
                différentes selon les situations. Consultez votre préfecture pour
                déterminer la procédure qui s'applique à votre cas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>

        {/* ===== SECTION 10 — CTA ===== */}
        <motion.section
          className="mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-8 text-white shadow-xl md:p-10">
            <h2 className="mb-3 text-2xl font-extrabold md:text-3xl">
              Commencez votre préparation dès aujourd'hui
            </h2>
            <p className="mb-6 max-w-2xl text-white/85 leading-relaxed">
              Rejoignez des milliers de candidats qui ont réussi leur examen civique
              grâce à GoCivique. Quiz interactifs, examens blancs chronométrés, cours
              structurés et suivi de progression — tout ce dont vous avez besoin pour
              réussir du premier coup, disponible en 6 langues.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/quiz"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0055A4] shadow-lg hover:bg-white/90 transition-colors"
              >
                Quiz gratuit
              </Link>
              <Link
                to="/guide-examen-civique"
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Guide de l'examen
              </Link>
              <Link
                to="/courses"
                className="rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Cours par thème
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 11 — Related links ===== */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="border-t border-slate-200 pt-8">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Pages associées
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { to: "/themes/valeurs-republique", label: "Valeurs de la République" },
                { to: "/themes/histoire-geographie", label: "Histoire et géographie" },
                { to: "/themes/institutions", label: "Institutions françaises" },
                { to: "/themes/droits-devoirs", label: "Droits et devoirs" },
                { to: "/courses", label: "Tous les cours" },
                { to: "/guide-examen-civique", label: "Guide de l'examen civique" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-[#0055A4] hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
