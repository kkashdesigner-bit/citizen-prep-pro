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
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  GraduationCap,
  FileText,
  Users,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Award,
  Shield,
  Scale,
  Landmark,
  Globe,
  Heart,
  HelpCircle,
  ListChecks,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const as const } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  FAQ data (shared between Accordion UI and JSON-LD FAQPage schema)  */
/* ------------------------------------------------------------------ */
const faqData = [
  {
    question: "Qu'est-ce que l'examen civique ?",
    answer:
      "L'examen civique est une evaluation officielle des connaissances sur les valeurs, les principes, les institutions et l'histoire de la Republique francaise. Il est obligatoire dans le cadre du parcours d'integration republicaine pour toute personne souhaitant obtenir la nationalite francaise par naturalisation, une carte de sejour pluriannuelle (CSP) ou une carte de resident (CR). Depuis 2026, l'examen prend la forme d'un QCM de 40 questions administre par la CCI Paris Ile-de-France, sous l'autorite du Francais des Affaires.",
  },
  {
    question: "Comment s'inscrire a l'examen civique ?",
    answer:
      "L'inscription a l'examen civique se fait en ligne via le site officiel du Francais des Affaires (CCI Paris Ile-de-France). Vous devez creer un compte, remplir le formulaire d'inscription, choisir un centre d'examen et une date de session, puis regler les frais d'inscription. Munissez-vous d'une piece d'identite valide et de votre attestation de suivi de la formation civique OFII le jour de l'epreuve. Les sessions ont lieu regulierement dans les centres agrees repartis sur tout le territoire francais.",
  },
  {
    question: "Combien coute l'examen civique ?",
    answer:
      "Les frais d'inscription a l'examen civique s'elevent a environ 60 a 80 euros selon le centre d'examen choisi. Ce montant couvre les frais administratifs et la gestion de l'epreuve. En cas d'echec, les frais d'inscription devront etre regles a nouveau pour chaque nouvelle tentative. Certaines associations d'aide aux migrants proposent un soutien financier pour les personnes en difficulte economique.",
  },
  {
    question: "Peut-on repasser l'examen en cas d'echec ?",
    answer:
      "Oui, il est tout a fait possible de repasser l'examen civique en cas d'echec. Il n'y a pas de limite au nombre de tentatives. Vous devrez toutefois vous reinscrire et payer a nouveau les frais d'inscription pour chaque nouvelle session. Il est conseille d'attendre au moins deux a quatre semaines entre deux tentatives pour reviser les themes ou vous avez echoue et consolider vos connaissances.",
  },
  {
    question: "En quelle langue se deroule l'examen civique ?",
    answer:
      "L'examen civique se deroule exclusivement en francais. Les questions et les choix de reponses sont rediges en langue francaise. Un niveau de comprehension ecrite correspondant au minimum au niveau A2 du CECRL (Cadre europeen commun de reference pour les langues) est recommande pour comprendre les enonces. Aucune traduction ni aucun dictionnaire n'est autorise pendant l'epreuve.",
  },
  {
    question: "Quelle est la duree de validite du resultat ?",
    answer:
      "Le resultat de l'examen civique est valable indefiniment une fois obtenu. Contrairement a certains tests de langue qui doivent etre repasses periodiquement, la reussite a l'examen civique n'a pas de date d'expiration. Votre attestation de reussite pourra etre jointe a votre dossier de naturalisation ou de demande de titre de sejour a tout moment apres l'obtention du resultat.",
  },
  {
    question: "Faut-il un niveau de francais particulier pour passer l'examen ?",
    answer:
      "Il n'y a pas de prerequis formel en termes de certification de langue pour s'inscrire a l'examen civique. Cependant, l'epreuve etant entierement en francais, un niveau de comprehension ecrite equivalent au moins au niveau A2 du CECRL est vivement recommande. Si vous avez des difficultes avec le francais ecrit, il est conseille de suivre des cours de langue en parallele de votre preparation a l'examen civique.",
  },
  {
    question: "Ou se deroule l'examen civique ?",
    answer:
      "L'examen civique se deroule dans les centres d'examen agrees par la CCI Paris Ile-de-France repartis sur l'ensemble du territoire francais. On trouve des centres dans toutes les grandes villes ainsi que dans de nombreuses villes moyennes. Lors de votre inscription en ligne, vous pouvez choisir le centre le plus proche de votre domicile. L'epreuve se passe en presentiel, sur ordinateur, dans des conditions d'examen surveillees.",
  },
  {
    question: "Quand faut-il passer l'examen civique ?",
    answer:
      "Il est recommande de passer l'examen civique le plus tot possible dans votre parcours d'integration. Pour la naturalisation, l'attestation de reussite doit etre jointe a votre dossier de demande. Pour la carte de sejour pluriannuelle ou la carte de resident, l'examen doit etre passe avant l'expiration de votre titre de sejour en cours. Prevoyez un delai de preparation de quatre a huit semaines avant la date de l'examen.",
  },
  {
    question: "Comment obtenir les resultats de l'examen civique ?",
    answer:
      "Les resultats de l'examen civique sont generalement disponibles sous deux a quatre semaines apres la date de l'epreuve. Vous recevrez une notification par courriel vous invitant a consulter vos resultats sur votre espace personnel du site du Francais des Affaires. En cas de reussite, vous pourrez telecharger votre attestation officielle au format PDF, qui constitue le document a joindre a votre dossier administratif.",
  },
];

/* ------------------------------------------------------------------ */
/*  JSON-LD schemas                                                    */
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
      name: "Guide de l'examen civique 2026",
      item: "https://gocivique.fr/guide-examen-civique",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

/* ------------------------------------------------------------------ */
/*  Table of Contents data                                             */
/* ------------------------------------------------------------------ */
const tocItems = [
  { id: "quest-ce-que", label: "Qu'est-ce que l'examen civique ?" },
  { id: "changements-2026", label: "Ce qui change en 2026" },
  { id: "format-detaille", label: "Format detaille de l'examen" },
  { id: "cinq-themes", label: "Les 5 themes officiels" },
  { id: "qui-est-concerne", label: "Qui est concerne ?" },
  { id: "preparation", label: "Comment se preparer efficacement" },
  { id: "erreurs-frequentes", label: "Les erreurs frequentes a eviter" },
  { id: "exemples-questions", label: "Exemples de questions" },
  { id: "faq", label: "Questions frequentes (FAQ)" },
];

/* ------------------------------------------------------------------ */
/*  Glass card utility class                                           */
/* ------------------------------------------------------------------ */
const glassCard =
  "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl";

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */
export default function GuideExamen() {
  return (
    <>
      <SEOHead
        title="Guide Complet de l'Examen Civique 2026 — Tout Savoir pour Reussir | GoCivique"
        description="Le guide definitif de l'examen civique 2026 : nouveau format QCM, 5 themes officiels, plan de revision, exemples de questions et FAQ. Preparez-vous efficacement avec GoCivique."
        path="/guide-examen-civique"
        schema={[breadcrumbSchema, faqSchema]}
      />

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-white/70 flex items-center gap-1 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">
              Guide de l'examen civique 2026
            </span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <Calendar className="h-4 w-4" />
              Mis a jour en mars 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Guide Complet de l'Examen Civique 2026 — Tout Savoir pour Reussir
            </h1>

            <p className="text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl mb-8">
              Vous vous preparez a l'examen civique dans le cadre de votre naturalisation francaise,
              de l'obtention d'une carte de sejour pluriannuelle ou d'une carte de resident ? Ce guide
              est la ressource la plus complete disponible en ligne. Nous avons rassemble toutes les
              informations essentielles : le nouveau format de l'epreuve, les cinq themes officiels du
              programme, des strategies de revision eprouvees, des exemples de questions corriges et
              les reponses a toutes les questions que vous vous posez. Que vous disposiez de quatre
              semaines ou de deux mois pour vous preparer, ce guide vous accompagnera pas a pas vers
              la reussite.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                <Target className="h-4 w-4" />
                Commencer un quiz gratuit
              </Link>
              <Link
                to="/exams"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
              >
                <FileText className="h-4 w-4" />
                Passer un examen blanc
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: FileText, label: "Questions", value: "40 QCM" },
              { icon: Clock, label: "Duree", value: "45 min" },
              { icon: Target, label: "Seuil de reussite", value: "32/40" },
              { icon: BookOpen, label: "Themes", value: "5 themes" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MAIN CONTENT with sticky TOC sidebar                         */}
      {/* ============================================================ */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* ---------- Sticky Table of Contents (desktop) ---------- */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <div className={`${glassCard} p-6`}>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-[#0055A4]" />
                  Sommaire
                </h2>
                <ul className="space-y-2">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block text-sm text-slate-600 hover:text-[#0055A4] hover:pl-2 transition-all duration-200 py-1 border-l-2 border-transparent hover:border-[#0055A4] pl-3"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* ---------- Content column ---------- */}
          <main className="min-w-0">
            {/* ====================================================== */}
            {/*  SECTION 1 — Qu'est-ce que l'examen civique ?           */}
            {/* ====================================================== */}
            <motion.section
              id="quest-ce-que"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055A4]/10">
                  <HelpCircle className="h-5 w-5 text-[#0055A4]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Qu'est-ce que l'examen civique ?
                </h2>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  L'examen civique est une epreuve officielle mise en place par l'Etat francais pour evaluer
                  les connaissances des personnes etrangeres souhaitant s'integrer durablement en France. Il
                  porte sur les valeurs fondamentales de la Republique, les principes constitutionnels, le
                  fonctionnement des institutions politiques, les droits et devoirs des citoyens ainsi que
                  l'histoire et la geographie du pays. Cet examen constitue l'une des conditions obligatoires
                  du parcours d'integration republicaine prevue par le Code de l'entree et du sejour des
                  etrangers et du droit d'asile (CESEDA).
                </p>

                <p className="text-slate-700 leading-relaxed mb-4">
                  L'organisation et la certification de l'examen civique sont confiees au <strong>Francais
                  des Affaires</strong>, une entite de la <strong>Chambre de Commerce et d'Industrie (CCI)
                  Paris Ile-de-France</strong>. Cet organisme, deja reconnu pour la gestion du Test
                  d'Evaluation de Francais (TEF), dispose de l'expertise et de l'infrastructure necessaires
                  pour administrer une epreuve a l'echelle nationale. Les centres d'examen agrees sont
                  repartis sur tout le territoire metropolitain et en outre-mer, ce qui permet a chaque
                  candidat de passer l'epreuve dans une ville proche de son lieu de residence.
                </p>

                <p className="text-slate-700 leading-relaxed mb-4">
                  La base legale de l'examen civique repose sur la <strong>loi du 26 janvier 2024</strong>
                  relative a l'immigration et a l'integration. Ce texte legislatif a profondement reforme le
                  parcours d'integration republicaine en introduisant l'obligation de reussir un examen
                  civique standardise pour certaines categories de titres de sejour et pour la naturalisation.
                  Avant cette reforme, l'evaluation des connaissances civiques se faisait principalement lors
                  d'un entretien oral avec un agent de la prefecture, un format juge trop subjectif et peu
                  homogene sur le territoire. Le nouveau dispositif garantit une evaluation equitable et
                  identique pour tous les candidats, quel que soit le departement ou ils resident.
                </p>

                <p className="text-slate-700 leading-relaxed mb-4">
                  L'examen civique concerne trois categories principales de demandeurs. Premierement, toute
                  personne deposant une <strong>demande de naturalisation francaise</strong> par decret doit
                  fournir une attestation de reussite a l'examen civique. Deuxiemement, les detenteurs d'une
                  carte de sejour temporaire souhaitant obtenir une <strong>carte de sejour
                  pluriannuelle (CSP)</strong> doivent egalement justifier de la reussite de cette epreuve.
                  Troisiemement, les personnes demandant une <strong>carte de resident (CR)</strong> de dix
                  ans sont tenues de presenter cette attestation. Il existe toutefois des exemptions pour
                  certaines situations particulieres, comme les personnes agees de plus de 65 ans, les
                  titulaires d'un diplome francais de niveau superieur ou egal a la licence, ou encore les
                  personnes reconnues en situation de handicap rendant impossible le passage de l'epreuve.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  L'objectif fondamental de cet examen n'est pas de creer une barriere supplementaire a
                  l'integration, mais au contraire de s'assurer que chaque personne accedant a un titre de
                  sejour de longue duree ou a la nationalite francaise possede un socle commun de
                  connaissances sur le pays dans lequel elle s'installe. Comprendre les valeurs de la
                  Republique, connaitre ses droits et ses devoirs, savoir comment fonctionnent les
                  institutions democratiques : autant de savoirs qui facilitent la vie quotidienne, l'acces
                  a l'emploi et la participation a la vie citoyenne.
                </p>
              </div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 2 — Ce qui change en 2026                      */}
            {/* ====================================================== */}
            <motion.section
              id="changements-2026"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Ce qui change en 2026
                </h2>
              </div>

              <div className={`${glassCard} p-6 sm:p-8 mb-6`}>
                <p className="text-slate-700 leading-relaxed mb-4">
                  L'annee 2026 marque un tournant decisif dans le dispositif d'evaluation civique en France.
                  Le nouveau format de l'examen, entre en vigueur au cours de cette annee, remplace
                  definitivement l'ancien systeme d'entretien oral qui etait en place depuis plusieurs
                  annees. Ce changement avait ete annonce par la loi du 26 janvier 2024, mais sa mise en
                  application effective a necessite pres de deux ans de preparation logistique et
                  pedagogique par la CCI Paris Ile-de-France.
                </p>

                <p className="text-slate-700 leading-relaxed mb-4">
                  Le nouvel examen prend la forme d'un <strong>questionnaire a choix multiples (QCM) de
                  40 questions</strong>, a completer en <strong>45 minutes maximum</strong>. Chaque question
                  propose plusieurs reponses possibles, dont une seule est correcte. Le candidat doit obtenir
                  au minimum <strong>32 bonnes reponses sur 40, soit un taux de reussite de 80 %</strong>,
                  pour valider l'epreuve. Ce seuil, plus exigeant que celui initialement envisage, reflete
                  la volonte du legislateur de s'assurer d'un niveau de connaissances solide chez les
                  candidats.
                </p>

                <p className="text-slate-700 leading-relaxed mb-4">
                  Parmi les nouveautes les plus significatives, le <strong>resultat de l'examen est desormais
                  valable indefiniment</strong>. Une fois l'attestation de reussite obtenue, le candidat n'a
                  plus besoin de repasser l'epreuve, meme si sa demande administrative (naturalisation, carte
                  de sejour) intervient plusieurs annees apres la date de l'examen. Cette mesure simplifie
                  considerablement les demarches pour les personnes dont les procedures administratives
                  s'etendent sur de longues periodes.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  L'administration de l'examen est assuree par la <strong>CCI Paris Ile-de-France</strong>,
                  par l'intermediaire de son entite Le Francais des Affaires. L'epreuve se deroule
                  exclusivement en presentiel, sur ordinateur, dans des centres d'examen agrees et
                  surveilles. Les banques de questions sont regulierement mises a jour pour refleter
                  l'evolution de la legislation et de la vie institutionnelle francaise.
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {[
                  {
                    icon: FileText,
                    title: "Nouveau format QCM",
                    desc: "L'entretien oral est remplace par un questionnaire a choix multiples standardise, garantissant une evaluation equitable partout en France.",
                  },
                  {
                    icon: Target,
                    title: "Seuil de 80 % (32/40)",
                    desc: "Le seuil de reussite est fixe a 32 bonnes reponses sur 40, un niveau exigeant qui necessite une preparation serieuse.",
                  },
                  {
                    icon: Award,
                    title: "Validite illimitee",
                    desc: "L'attestation de reussite n'a pas de date d'expiration. Elle reste valable pour toutes vos futures demarches administratives.",
                  },
                  {
                    icon: Landmark,
                    title: "Gere par la CCI Paris",
                    desc: "La CCI Paris Ile-de-France, via Le Francais des Affaires, assure l'organisation et la certification de l'examen sur tout le territoire.",
                  },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    variants={itemVariants}
                    className={`${glassCard} p-5 hover:shadow-xl transition-shadow`}
                  >
                    <card.icon className="h-6 w-6 text-[#0055A4] mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">{card.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 3 — Format detaille de l'examen                */}
            {/* ====================================================== */}
            <motion.section
              id="format-detaille"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <ListChecks className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Format detaille de l'examen
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">
                Comprendre en detail le format de l'epreuve est un atout strategique considerable. L'examen
                civique 2026 se compose de <strong>40 questions reparties sur les cinq themes
                officiels</strong>. Chaque theme contribue un nombre precis de questions, ce qui permet au
                candidat d'orienter sa preparation en fonction du poids relatif de chaque matiere. Voici la
                repartition detaillee des questions par theme : <strong>Principes et valeurs de la
                Republique (11 questions)</strong>, <strong>Droits et devoirs des citoyens (11
                questions)</strong>, <strong>Histoire, geographie et culture (8 questions)</strong>,
                <strong> Institutions et systeme politique (6 questions)</strong> et <strong>Vivre en
                societe (4 questions)</strong>.
              </p>

              <p className="text-slate-700 leading-relaxed mb-4">
                La gestion du temps est un element crucial pour reussir l'examen. Avec 45 minutes pour
                repondre a 40 questions, vous disposez d'un peu plus d'une minute par question en moyenne.
                Il est recommande de commencer par lire attentivement chaque enonce et toutes les propositions
                de reponse avant de selectionner votre choix. Si vous hesitez sur une question, ne perdez
                pas de temps : passez a la suivante et revenez-y a la fin si le temps le permet. Les
                questions ne sont pas classees par ordre de difficulte, vous pouvez donc tomber sur une
                question facile apres une question difficile.
              </p>

              <p className="text-slate-700 leading-relaxed mb-6">
                Le systeme de notation est simple et transparent : chaque bonne reponse vaut un point,
                il n'y a <strong>pas de points negatifs</strong> pour les mauvaises reponses. Cela signifie
                qu'il est toujours preferable de repondre a une question plutot que de la laisser vide, meme
                si vous n'etes pas sur de votre choix. Votre score final est la somme de vos bonnes
                reponses sur 40. Le seuil de reussite est fixe a 32 points, soit 80 %. A la fin de
                l'epreuve, le systeme informatique enregistre automatiquement vos reponses, et les resultats
                sont generalement communiques sous deux a quatre semaines.
              </p>

              {/* Summary table */}
              <div className={`${glassCard} overflow-hidden`}>
                <div className="bg-[#0055A4]/5 px-6 py-3 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">Recapitulatif du format</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    ["Type d'epreuve", "QCM (questionnaire a choix multiples)"],
                    ["Nombre de questions", "40 questions"],
                    ["Duree", "45 minutes"],
                    ["Seuil de reussite", "32/40 (80 %)"],
                    ["Points negatifs", "Non"],
                    ["Langue", "Francais uniquement"],
                    ["Mode de passage", "En presentiel, sur ordinateur"],
                    ["Validite du resultat", "Illimitee"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:items-center px-6 py-3 gap-1"
                    >
                      <span className="font-medium text-slate-900 sm:w-48 shrink-0">
                        {label}
                      </span>
                      <span className="text-slate-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 4 — Les 5 themes officiels                     */}
            {/* ====================================================== */}
            <motion.section
              id="cinq-themes"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Les 5 themes officiels de l'examen civique
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                Le programme de l'examen civique est structure autour de cinq grands themes definis par
                arrete ministeriel. Chacun couvre un aspect essentiel de la vie en France et contribue a
                former le socle de connaissances attendu de tout candidat. La maitrise de l'ensemble de ces
                themes est indispensable pour atteindre le seuil de 80 % necessaire a la validation de
                l'epreuve. Voici un descriptif detaille de chaque theme, accompagne du nombre de questions
                correspondant et des principaux sujets abordes.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Theme 1 */}
                <motion.div variants={itemVariants} className={`${glassCard} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 shrink-0">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">
                          1. Principes et valeurs de la Republique
                        </h3>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                          11 questions
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Ce theme est le plus important de l'examen en nombre de questions. Il couvre les fondements
                    philosophiques et juridiques de la Republique francaise. Vous devrez maitriser la devise
                    nationale <em>Liberte, Egalite, Fraternite</em> et comprendre ce que chacun de ces termes
                    signifie concretement. Le principe de laicite, consacre par la loi de 1905 sur la
                    separation des Eglises et de l'Etat, est un sujet recurrent. Vous serez egalement
                    interroge sur la Declaration des droits de l'homme et du citoyen de 1789, les symboles
                    de la Republique (le drapeau tricolore, la Marseillaise, Marianne, le coq gaulois, le
                    14 Juillet), et les principes d'indivisibilite, de democratie et de caractere social de
                    la Republique inscrits a l'article premier de la Constitution.
                  </p>
                  <Link
                    to="/themes/valeurs-republique"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0055A4] hover:underline"
                  >
                    Reviser ce theme en detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Theme 2 */}
                <motion.div variants={itemVariants} className={`${glassCard} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 shrink-0">
                      <Landmark className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">
                          2. Institutions et systeme politique
                        </h3>
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                          6 questions
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Ce theme aborde le fonctionnement institutionnel de la Ve Republique. Vous devrez
                    connaitre le role du President de la Republique, ses pouvoirs et la duree de son mandat
                    (quinquennat). Le fonctionnement du Parlement bicameral, compose de l'Assemblee nationale
                    et du Senat, sera egalement interroge : comment les deputes et les senateurs sont-ils
                    elus, quel est le processus legislatif, quelle est la difference entre une loi et un
                    decret. Le role du Premier ministre et du Gouvernement, la hierarchie des normes
                    juridiques, le Conseil constitutionnel et les collectivites territoriales (communes,
                    departements, regions) font partie des sujets a maitriser. Bien que ce theme ne comporte
                    que six questions, elles portent souvent sur des notions precises qui necessitent une
                    bonne comprehension du systeme politique francais.
                  </p>
                  <Link
                    to="/themes/institutions"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0055A4] hover:underline"
                  >
                    Reviser ce theme en detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Theme 3 */}
                <motion.div variants={itemVariants} className={`${glassCard} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 shrink-0">
                      <Scale className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">
                          3. Droits et devoirs des citoyens
                        </h3>
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                          11 questions
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    A egalite avec le premier theme en termes de nombre de questions, ce sujet est
                    fondamental. Il traite des droits fondamentaux garantis par la Constitution et par les
                    conventions internationales ratifiees par la France : liberte d'expression, liberte de
                    la presse, droit de greve, droit de vote, liberte de conscience et de religion, droit a
                    l'education, droit au logement. En parallele, les devoirs des citoyens sont abordes : le
                    respect des lois, l'obligation fiscale (impots), l'obligation de scolarisation des
                    enfants de 3 a 16 ans, le devoir de defense de la nation, le respect d'autrui et des
                    regles de vie en societe. L'egalite entre les femmes et les hommes, la lutte contre les
                    discriminations et la protection des mineurs sont egalement des sujets frequemment abordes.
                  </p>
                  <Link
                    to="/themes/droits-devoirs"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0055A4] hover:underline"
                  >
                    Reviser ce theme en detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Theme 4 */}
                <motion.div variants={itemVariants} className={`${glassCard} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                      <Globe className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">
                          4. Histoire, geographie et culture
                        </h3>
                        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                          8 questions
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Ce theme explore le patrimoine historique, geographique et culturel de la France. Sur le
                    plan historique, les grands evenements a connaitre incluent la Revolution francaise de
                    1789, la Declaration des droits de l'homme, les guerres mondiales, la creation de l'Union
                    europeenne, les grandes avancees sociales (securite sociale, abolition de la peine de
                    mort, droit de vote des femmes). En geographie, vous serez interroge sur l'organisation
                    du territoire (regions metropolitaines, departements et territoires d'outre-mer), les
                    principaux fleuves, massifs montagneux et villes de France. Le volet culturel peut porter
                    sur les fetes nationales, les traditions, la gastronomie, les personnalites historiques
                    majeures (Victor Hugo, Marie Curie, Jean Moulin, Simone Veil) et la place de la France
                    dans le monde francophone.
                  </p>
                  <Link
                    to="/themes/histoire-geographie"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0055A4] hover:underline"
                  >
                    Reviser ce theme en detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Theme 5 */}
                <motion.div variants={itemVariants} className={`${glassCard} p-6 sm:p-8`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 shrink-0">
                      <Heart className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">
                          5. Vivre en societe
                        </h3>
                        <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                          4 questions
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Bien que ce theme ne represente que quatre questions, il porte sur des aspects tres
                    concrets de la vie quotidienne en France. Les sujets abordes incluent le systeme educatif
                    francais (ecole maternelle, primaire, college, lycee, universite), le systeme de
                    protection sociale (securite sociale, assurance maladie, allocations familiales, retraite),
                    le monde du travail (contrat de travail, code du travail, droit syndical, salaire
                    minimum), l'acces aux services publics et le role de la mairie dans la vie quotidienne.
                    Les questions sur ce theme sont generalement considerees comme les plus accessibles car
                    elles portent sur des realites que les candidats vivent au quotidien. C'est neanmoins un
                    theme a ne pas negliger pour securiser quatre points precieux.
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 5 — Qui est concerne ?                         */}
            {/* ====================================================== */}
            <motion.section
              id="qui-est-concerne"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                  <Users className="h-5 w-5 text-cyan-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Qui est concerne par l'examen civique ?
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                L'examen civique s'adresse a plusieurs categories de personnes residant en France et
                souhaitant consolider leur situation administrative. Il est important de bien identifier
                si vous etes concerne avant d'entamer votre preparation, car les exigences et les delais
                peuvent varier selon votre situation.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 gap-4 mb-6"
              >
                <motion.div variants={itemVariants} className={`${glassCard} p-6`}>
                  <GraduationCap className="h-7 w-7 text-[#0055A4] mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Naturalisation francaise</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Toute personne deposant une premiere demande de naturalisation par decret doit fournir
                    une attestation de reussite a l'examen civique. Cette obligation s'ajoute aux conditions
                    de residence, de ressources, d'assimilation linguistique et de bonne conduite. Le dossier
                    de naturalisation ne sera pas considere comme complet sans cette attestation. Il est donc
                    vivement recommande de passer l'examen en amont du depot du dossier pour eviter tout
                    retard dans le traitement de votre demande.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className={`${glassCard} p-6`}>
                  <FileText className="h-7 w-7 text-emerald-600 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Carte de sejour pluriannuelle (CSP)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Les titulaires d'une carte de sejour temporaire souhaitant passer a une carte de sejour
                    pluriannuelle doivent justifier de la reussite de l'examen civique. La CSP est delivree
                    pour une duree de deux a quatre ans et constitue une etape importante vers la
                    stabilisation de votre situation en France. L'examen doit avoir ete passe avant la date
                    du renouvellement de votre titre de sejour en cours pour etre pris en compte dans votre
                    dossier.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className={`${glassCard} p-6`}>
                  <Award className="h-7 w-7 text-purple-600 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Carte de resident (CR)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    La carte de resident, d'une duree de dix ans et renouvelable, offre une grande stabilite
                    de sejour. Pour en beneficier, la reussite a l'examen civique est desormais requise. Cela
                    concerne aussi bien les premieres demandes de carte de resident que les renouvellements
                    dans certains cas prevus par la reglementation en vigueur. La carte de resident confere
                    egalement le droit de travailler sans autorisation supplementaire.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className={`${glassCard} p-6`}>
                  <CheckCircle2 className="h-7 w-7 text-amber-600 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">Exemptions</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Certaines personnes sont dispensees de l'examen civique. C'est le cas des personnes agees
                    de plus de 65 ans, des titulaires d'un diplome francais de niveau superieur ou egal a la
                    licence (bac+3), des personnes souffrant d'un handicap reconnu rendant impossible le
                    passage de l'epreuve, ainsi que des refugies et beneficiaires de la protection
                    subsidiaire dans certains cas specifiques. Si vous pensez etre concerne par une
                    exemption, renseignez-vous aupres de votre prefecture.
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 6 — Comment se preparer efficacement           */}
            {/* ====================================================== */}
            <motion.section
              id="preparation"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Comment se preparer efficacement a l'examen civique
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                Une preparation structuree et reguliere est la cle de la reussite a l'examen civique.
                Le seuil de 80 % ne laisse pas de place a l'improvisation : sur 40 questions, vous ne
                pouvez vous permettre que huit erreurs maximum. Voici deux plans de revision adaptes a
                votre calendrier, ainsi que des conseils pratiques pour optimiser votre apprentissage au
                quotidien.
              </p>

              {/* 4-week plan */}
              <div className={`${glassCard} p-6 sm:p-8 mb-6`}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#0055A4]" />
                  Plan intensif : 4 semaines
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Ce plan convient aux candidats disposant d'un mois avant la date de l'examen. Il
                  demande un investissement quotidien d'environ 45 minutes a une heure par jour. La
                  premiere semaine est consacree aux deux themes les plus importants en nombre de
                  questions : les principes et valeurs de la Republique et les droits et devoirs des
                  citoyens. Lisez les fiches de cours correspondantes sur GoCivique, puis faites un
                  quiz thematique a la fin de chaque session pour ancrer vos connaissances. La deuxieme
                  semaine est dediee aux institutions et au systeme politique ainsi qu'a l'histoire,
                  la geographie et la culture. Prenez le temps de bien comprendre l'organisation de la
                  Ve Republique et memorisez les grandes dates historiques. La troisieme semaine couvre
                  le theme "Vivre en societe" et constitue une semaine de revision transversale :
                  refaites tous les quiz thematiques pour identifier vos lacunes persistantes. La
                  quatrieme et derniere semaine est entierement consacree aux examens blancs. Passez au
                  moins trois a quatre simulations completes en conditions reelles (40 questions, 45
                  minutes, chronometrees) pour vous habituer au rythme de l'epreuve.
                </p>
              </div>

              {/* 2-month plan */}
              <div className={`${glassCard} p-6 sm:p-8 mb-6`}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Plan confortable : 2 mois
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Ce plan est ideal pour les candidats qui souhaitent se preparer sereinement, a raison
                  de 20 a 30 minutes par jour. Le premier mois est dedie a l'apprentissage des cours :
                  consacrez environ une semaine et demie a chacun des trois themes les plus denses
                  (valeurs, droits et devoirs, histoire-geographie), et une semaine aux deux themes
                  restants (institutions, vivre en societe). Chaque session de revision devrait alterner
                  entre lecture des fiches de cours et pratique de quiz courts. Le second mois est
                  entierement consacre a la pratique : quiz thematiques cibles sur vos points faibles la
                  premiere quinzaine, puis examens blancs complets les deux dernieres semaines. Ce rythme
                  progressif permet une memorisation durable et reduit le stress le jour de l'examen.
                </p>
              </div>

              {/* Daily routine */}
              <div className={`${glassCard} p-6 sm:p-8`}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Routine quotidienne recommandee
                </h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Quel que soit le plan que vous choisissez, voici une routine quotidienne efficace pour
                  maximiser votre apprentissage. Commencez chaque session par cinq minutes de relecture
                  rapide de vos notes de la veille pour reactiver votre memoire. Consacrez ensuite 15 a
                  20 minutes a la lecture d'une nouvelle fiche de cours ou d'un chapitre que vous
                  n'avez pas encore vu. Terminez par 15 a 20 minutes de quiz sur GoCivique pour tester
                  immediatement ce que vous venez d'apprendre. Apres chaque quiz, prenez le temps de
                  relire les corrections et les explications des questions auxquelles vous avez mal
                  repondu. Cette alternance lecture-pratique-correction est la methode la plus efficace
                  pour ancrer les connaissances dans la memoire a long terme. Enfin, utilisez les
                  <Link to="/courses" className="text-[#0055A4] hover:underline mx-1 font-medium">
                    cours en ligne GoCivique
                  </Link>
                  pour approfondir les sujets les plus complexes, et les
                  <Link to="/exams" className="text-[#0055A4] hover:underline mx-1 font-medium">
                    examens blancs
                  </Link>
                  pour vous evaluer dans les conditions reelles de l'epreuve.
                </p>
              </div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 7 — Erreurs frequentes a eviter                */}
            {/* ====================================================== */}
            <motion.section
              id="erreurs-frequentes"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Les erreurs frequentes a eviter
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                Apres avoir accompagne des milliers de candidats dans leur preparation, nous avons
                identifie les erreurs les plus courantes qui empechent les candidats d'atteindre le seuil
                de 80 %. Evitez ces pieges pour maximiser vos chances de reussite des la premiere
                tentative.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    title: "Ne reviser qu'un ou deux themes",
                    desc: "Certains candidats se concentrent uniquement sur les themes qu'ils maitrisent deja et negligent les autres. Avec un seuil a 80 %, chaque point compte. Si vous ignorez completement un theme de 8 ou 11 questions, vous partez avec un handicap considerable. Repartissez votre effort sur les cinq themes, en insistant davantage sur ceux ou vous etes le plus faible.",
                  },
                  {
                    title: "Commencer la preparation trop tard",
                    desc: "Reviser trois jours avant l'examen ne suffit pas pour assimiler l'ensemble du programme. Les connaissances civiques necessitent une memorisation progressive qui se fait sur plusieurs semaines. Un bachotage de derniere minute engendre du stress et des confusions entre les notions. Prevoyez au minimum quatre semaines de preparation reguliere.",
                  },
                  {
                    title: "Ne faire que des quiz sans lire les cours",
                    desc: "Les quiz sont un excellent outil de verification, mais ils ne remplacent pas l'apprentissage des cours. Si vous faites des quiz sans avoir lu les fiches de cours au prealable, vous risquez de memoriser les reponses sans comprendre les notions sous-jacentes. Or, les questions de l'examen sont formulees differemment des quiz d'entrainement. Seule la comprehension profonde vous permettra de repondre correctement quelle que soit la formulation.",
                  },
                  {
                    title: "Negliger la gestion du temps",
                    desc: "Avec un peu plus d'une minute par question, le temps est un facteur determinant. De nombreux candidats passent trop de temps sur les questions difficiles du debut et doivent se precipiter sur les questions faciles de la fin, commettant des erreurs d'inattention evitables. Entralnez-vous avec un chronometre et habituez-vous a passer rapidement les questions sur lesquelles vous bloquez.",
                  },
                  {
                    title: "Confondre les dates et les chiffres cles",
                    desc: "Les questions portant sur les dates historiques, les durees de mandat ou les seuils legislatifs sont frequentes. Les candidats confondent souvent la date de la Declaration des droits de l'homme (1789) avec celle de la Constitution actuelle (1958), ou la duree du mandat presidentiel (5 ans) avec celle du mandat senatorial (6 ans). Creez des fiches memoire avec les chiffres cles et revisez-les regulierement.",
                  },
                  {
                    title: "Ne pas faire d'examens blancs en conditions reelles",
                    desc: "Beaucoup de candidats font des quiz courts de 10 questions mais ne font jamais un examen blanc complet de 40 questions en 45 minutes. L'examen reel teste non seulement vos connaissances mais aussi votre endurance mentale et votre capacite a gerer le stress. Faites au minimum deux a trois examens blancs complets avant le jour J pour vous familiariser avec les conditions de l'epreuve.",
                  },
                  {
                    title: "Ignorer les corrections et les explications",
                    desc: "Apres un quiz ou un examen blanc, ne vous contentez pas de regarder votre score. Prenez le temps de relire chaque question ratee, de comprendre pourquoi la bonne reponse est correcte et pourquoi votre choix etait errone. C'est dans l'analyse de vos erreurs que se situe le plus grand potentiel de progression. Sur GoCivique, chaque question est accompagnee d'une explication detaillee : lisez-les systematiquement.",
                  },
                ].map((err, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className={`${glassCard} p-5 flex gap-4`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{err.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{err.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 8 — Exemples de questions                      */}
            {/* ====================================================== */}
            <motion.section
              id="exemples-questions"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Target className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Exemples de questions de l'examen civique
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                Pour vous donner une idee concrete du type de questions posees a l'examen civique, voici
                six exemples representatifs couvrant differents themes du programme. Chaque question est
                accompagnee de la bonne reponse et d'une explication detaillee pour vous aider a
                comprendre la logique sous-jacente.
              </p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    num: 1,
                    theme: "Principes et valeurs",
                    question: "Quelle est la devise de la Republique francaise ?",
                    options: [
                      "Travail, Famille, Patrie",
                      "Liberte, Egalite, Fraternite",
                      "Unite, Solidarite, Progres",
                      "Democratie, Laicite, Egalite",
                    ],
                    answer: "Liberte, Egalite, Fraternite",
                    explanation:
                      "La devise de la Republique francaise est « Liberte, Egalite, Fraternite ». Elle apparait pour la premiere fois pendant la Revolution francaise et est inscrite dans la Constitution de 1958 a l'article 2. « Travail, Famille, Patrie » etait la devise du regime de Vichy (1940-1944) et ne correspond pas aux valeurs republicaines.",
                  },
                  {
                    num: 2,
                    theme: "Institutions",
                    question: "Quelle est la duree du mandat du President de la Republique ?",
                    options: ["4 ans", "5 ans", "6 ans", "7 ans"],
                    answer: "5 ans",
                    explanation:
                      "Depuis le referendum de 2000, le mandat presidentiel est un quinquennat, soit cinq ans. Avant cette reforme, le mandat etait de sept ans (septennat). Le President est elu au suffrage universel direct. Il peut etre reelu une seule fois, ce qui porte la duree maximale a dix ans de presidence consecutive.",
                  },
                  {
                    num: 3,
                    theme: "Droits et devoirs",
                    question: "A partir de quel age l'instruction est-elle obligatoire en France ?",
                    options: ["2 ans", "3 ans", "5 ans", "6 ans"],
                    answer: "3 ans",
                    explanation:
                      "Depuis la loi pour une ecole de la confiance du 26 juillet 2019, l'instruction est obligatoire a partir de l'age de 3 ans (contre 6 ans auparavant). L'obligation d'instruction s'etend jusqu'a 16 ans. Notez que c'est l'instruction qui est obligatoire, pas la scolarisation : les parents peuvent choisir l'enseignement a domicile sous certaines conditions strictes.",
                  },
                  {
                    num: 4,
                    theme: "Histoire et culture",
                    question: "En quelle annee la Declaration des droits de l'homme et du citoyen a-t-elle ete adoptee ?",
                    options: ["1776", "1789", "1848", "1958"],
                    answer: "1789",
                    explanation:
                      "La Declaration des droits de l'homme et du citoyen a ete adoptee le 26 aout 1789 par l'Assemblee nationale constituante, en pleine Revolution francaise. Ce texte fondateur proclame les droits naturels et imprescriptibles de l'homme : la liberte, la propriete, la surete et la resistance a l'oppression. Il fait partie du bloc de constitutionnalite et a donc une valeur juridique supreme en France.",
                  },
                  {
                    num: 5,
                    theme: "Vivre en societe",
                    question: "Quel organisme gere l'assurance maladie obligatoire en France ?",
                    options: [
                      "Pole Emploi",
                      "La Securite sociale",
                      "La Banque de France",
                      "Le Conseil constitutionnel",
                    ],
                    answer: "La Securite sociale",
                    explanation:
                      "La Securite sociale, creee en 1945, est l'organisme charge de la gestion de l'assurance maladie obligatoire en France. Elle couvre les frais de sante (consultations medicales, medicaments, hospitalisations) pour l'ensemble des residents. Pole Emploi gere l'assurance chomage, la Banque de France est l'institution monetaire nationale, et le Conseil constitutionnel veille a la conformite des lois a la Constitution.",
                  },
                  {
                    num: 6,
                    theme: "Principes et valeurs",
                    question: "Que signifie le principe de laicite en France ?",
                    options: [
                      "L'interdiction de toute religion",
                      "La separation des Eglises et de l'Etat",
                      "L'obligation de pratiquer une religion",
                      "La primaute de la religion catholique",
                    ],
                    answer: "La separation des Eglises et de l'Etat",
                    explanation:
                      "La laicite en France designe la separation des Eglises et de l'Etat, consacree par la loi du 9 decembre 1905. Ce principe garantit la liberte de conscience et le libre exercice des cultes, tout en assurant que l'Etat ne reconnait, ne salarie ni ne subventionne aucun culte. La laicite n'interdit pas la religion : elle garantit a chacun le droit de croire ou de ne pas croire, tout en preservant la neutralite de l'Etat et des services publics.",
                  },
                ].map((q) => (
                  <motion.div
                    key={q.num}
                    variants={itemVariants}
                    className={`${glassCard} p-6 hover:shadow-xl transition-all hover:scale-[1.01]`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0055A4] text-white text-sm font-bold">
                        {q.num}
                      </span>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                        {q.theme}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3">{q.question}</h3>
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      {q.options.map((opt) => (
                        <div
                          key={opt}
                          className={`rounded-lg px-3 py-2 text-sm border ${
                            opt === q.answer
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          {opt === q.answer && (
                            <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5 text-emerald-500" />
                          )}
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <strong className="text-[#0055A4]">Explication :</strong> {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <p className="text-slate-600 text-sm mt-6 text-center">
                Ces exemples ne representent qu'un apercu des questions possibles.{" "}
                <Link to="/quiz" className="text-[#0055A4] font-semibold hover:underline">
                  Essayez notre quiz gratuit
                </Link>{" "}
                pour vous entrainer sur des centaines de questions supplementaires.
              </p>
            </motion.section>

            {/* ====================================================== */}
            {/*  SECTION 9 — FAQ                                        */}
            {/* ====================================================== */}
            <motion.section
              id="faq"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16 scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <HelpCircle className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  FAQ — Questions frequentes sur l'examen civique
                </h2>
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                Vous avez encore des interrogations sur l'examen civique ? Retrouvez ci-dessous les
                reponses aux dix questions les plus frequemment posees par les candidats. Si vous ne
                trouvez pas la reponse a votre question, n'hesitez pas a consulter notre page d'aide ou
                a nous contacter directement.
              </p>

              <div className={`${glassCard} p-6 sm:p-8`}>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-slate-900 hover:text-[#0055A4] hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.section>

            {/* ====================================================== */}
            {/*  CTA SECTION                                            */}
            {/* ====================================================== */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mb-16"
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="h-8 w-8" />
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Pret a reussir votre examen civique ?
                    </h2>
                  </div>
                  <p className="text-white/85 leading-relaxed mb-8 max-w-2xl">
                    Rejoignez les milliers de candidats qui se preparent avec GoCivique. Notre plateforme
                    propose des quiz interactifs, des examens blancs chronometres et des cours complets
                    couvrant les cinq themes officiels. Commencez votre preparation des aujourd'hui et
                    mettez toutes les chances de votre cote pour reussir du premier coup.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/quiz"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#0055A4] hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                    >
                      <Target className="h-5 w-5" />
                      Quiz gratuit
                    </Link>
                    <Link
                      to="/exams"
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <FileText className="h-5 w-5" />
                      Examen blanc
                    </Link>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 font-bold text-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <BookOpen className="h-5 w-5" />
                      Cours complets
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ====================================================== */}
            {/*  RELATED LINKS FOOTER                                   */}
            {/* ====================================================== */}
            <motion.section
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Continuer votre preparation
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Pages thematiques
                    </h3>
                    <ul className="space-y-2">
                      {[
                        { to: "/themes/valeurs-republique", label: "Principes et valeurs de la Republique" },
                        { to: "/themes/institutions", label: "Institutions et systeme politique" },
                        { to: "/themes/droits-devoirs", label: "Droits et devoirs des citoyens" },
                        { to: "/themes/histoire-geographie", label: "Histoire, geographie et culture" },
                      ].map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="inline-flex items-center gap-1.5 text-sm text-[#0055A4] hover:underline"
                          >
                            <ChevronRight className="h-3 w-3" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Outils de preparation
                    </h3>
                    <ul className="space-y-2">
                      {[
                        { to: "/quiz", label: "Quiz interactif gratuit" },
                        { to: "/exams", label: "Examens blancs chronometres" },
                        { to: "/courses", label: "Cours en ligne complets" },
                        { to: "/about", label: "A propos de GoCivique" },
                      ].map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="inline-flex items-center gap-1.5 text-sm text-[#0055A4] hover:underline"
                          >
                            <ChevronRight className="h-3 w-3" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    </>
  );
}
