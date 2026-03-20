import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useParams, Navigate, Link } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { Lock, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import "react-helmet-async";
import "../main.mjs";
import "react";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@radix-ui/react-slot";
const COURSE_PREVIEWS = [
  {
    slug: "examen-civique-symboles-republique",
    classNumber: 1,
    title: "Les Symboles de la République Française",
    metaTitle: "Les Symboles de la République — Examen Civique 2026 | GoCivique",
    metaDescription: "Drapeau tricolore, Marianne, La Marseillaise : apprenez les symboles officiels de la République française pour l'examen civique. Cours gratuit avec quiz.",
    introHook: "La France possède des symboles forts qui représentent son identité et ses valeurs républicaines. Ces symboles sont présents dans la vie quotidienne de chaque citoyen et incarnent les principes fondateurs de la nation.",
    previewParagraphs: [
      "Le drapeau tricolore est le symbole officiel le plus reconnaissable de la République française. Composé de trois bandes verticales — bleu, blanc et rouge — il représente une France unie. Le bleu et le rouge sont les couleurs historiques de la ville de Paris, tandis que le blanc représentait la monarchie. L'alliance de ces trois couleurs symbolise l'union entre le roi et le peuple lors de la Révolution française.",
      "Marianne est la figure allégorique de la République française. Elle porte le bonnet phrygien, symbole de liberté hérité de l'Antiquité romaine. Son buste est présent dans toutes les mairies de France, et son image figure sur les timbres-poste et les pièces de monnaie."
    ],
    keyConcepts: [
      { term: "Drapeau tricolore", definition: "Trois bandes verticales bleu, blanc, rouge — symbole officiel de la République" },
      { term: "Marianne", definition: "Figure allégorique de la République portant le bonnet phrygien, présente dans toutes les mairies" },
      { term: "La Marseillaise", definition: "Hymne national composé en 1792, chant de liberté et de résistance" },
      { term: "Le Coq gaulois", definition: "Symbole national très utilisé mais non officiel" },
      { term: "Symboles officiels", definition: "Drapeau tricolore, Marianne et devise nationale — reconnus par la Constitution" },
      { term: "Outrage aux symboles", definition: "Acte interdit par la loi, constitue une atteinte aux valeurs républicaines" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-devise-francaise",
    classNumber: 2,
    title: "La Devise Française : Liberté, Égalité, Fraternité",
    metaTitle: "La Devise Française — Examen Civique 2026 | GoCivique",
    metaDescription: "Apprenez la devise Liberté, Égalité, Fraternité pour l'examen civique. Origines, signification et dates clés. Cours gratuit avec quiz officiels.",
    introHook: "La devise de la France est bien plus qu'une simple phrase : elle résume en trois mots les valeurs essentielles qui guident la vie démocratique et unissent tous les citoyens.",
    previewParagraphs: [
      "La devise de la République française est « Liberté, Égalité, Fraternité ». Ces trois mots, indissociables, forment le socle des valeurs républicaines. La devise est apparue pendant la Révolution française en 1789, a été adoptée officiellement sous la IIe République en 1848, puis inscrite dans la Constitution de 1958.",
      "Chaque mot porte un sens précis. La Liberté signifie la liberté pour chacun. L'Égalité signifie l'égalité entre tous les citoyens en droits et en devoirs. La Fraternité représente la solidarité entre les citoyens : l'entraide et la cohésion sociale."
    ],
    keyConcepts: [
      { term: "Devise de la République", definition: "Liberté, Égalité, Fraternité — les trois valeurs fondamentales de la France" },
      { term: "Liberté", definition: "La liberté pour chacun de penser, s'exprimer et agir dans le respect de la loi" },
      { term: "Égalité", definition: "L'égalité entre tous les citoyens en droits et en devoirs" },
      { term: "Fraternité", definition: "La solidarité entre les citoyens, l'entraide et la cohésion sociale" },
      { term: "1789", definition: "Apparition de la devise pendant la Révolution française" },
      { term: "1848", definition: "Adoption officielle de la devise sous la IIe République" },
      { term: "Constitution de 1958", definition: "Texte dans lequel la devise est inscrite" },
      { term: "Bâtiments publics", definition: "Mairies, écoles, tribunaux — lieux où la devise est affichée" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-ddhc-1789",
    classNumber: 3,
    title: "La Déclaration des Droits de l'Homme et du Citoyen (DDHC)",
    metaTitle: "DDHC 1789 — Examen Civique 2026 | GoCivique",
    metaDescription: "La Déclaration des droits de l'homme et du citoyen de 1789 : texte fondateur, article premier, droits universels. Préparation examen civique gratuite.",
    introHook: "Ce texte fondateur a posé les bases des droits fondamentaux en France et dans le monde. Adoptée il y a plus de deux siècles, la DDHC reste aujourd'hui au cœur du droit français.",
    previewParagraphs: [
      "La Déclaration des droits de l'homme et du citoyen (DDHC) a été adoptée le 26 août 1789, au début de la Révolution française. Ce texte marque une rupture avec l'Ancien Régime. La DDHC affirme pour la première fois que tous les êtres humains possèdent des droits naturels, universels et inaliénables.",
      "L'article premier proclame que « les hommes naissent et demeurent libres et égaux en droits ». La Déclaration fixe les objectifs de la Révolution française : abolir les privilèges, garantir les libertés individuelles et établir un gouvernement fondé sur le consentement des citoyens."
    ],
    keyConcepts: [
      { term: "DDHC", definition: "Déclaration des droits de l'homme et du citoyen, adoptée le 26 août 1789" },
      { term: "Article premier", definition: "« Les hommes naissent et demeurent libres et égaux en droits »" },
      { term: "Droits universels", definition: "Des droits valables pour tous les êtres humains, sans distinction" },
      { term: "Droits inaliénables", definition: "Des droits qui ne peuvent être retirés ou cédés" },
      { term: "Bloc de constitutionnalité", definition: "Ensemble des textes à valeur constitutionnelle que les lois doivent respecter" },
      { term: "Révolution française", definition: "Événement historique dont la DDHC fixe les objectifs" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-laicite-neutralite",
    classNumber: 4,
    title: "La Laïcité et la Neutralité de l'État",
    metaTitle: "La Laïcité en France — Examen Civique 2026 | GoCivique",
    metaDescription: "Laïcité, loi de 1905, neutralité de l'État : tout comprendre pour l'examen civique. Liberté de conscience, école, service public. Cours gratuit.",
    introHook: "La laïcité est un principe fondamental de la République française. Elle garantit la liberté de croire ou de ne pas croire, tout en assurant la neutralité de l'État vis-à-vis de toutes les religions.",
    previewParagraphs: [
      "La laïcité est inscrite à l'article premier de la Constitution de 1958. C'est un principe constitutionnel qui garantit la liberté de conscience pour tous — le droit de croire en une religion, d'en changer ou de ne pas croire. La laïcité n'est pas anti-religieuse : elle assure la liberté de chacun.",
      "La loi de 1905 établit la séparation des Églises et de l'État. Les agents du service public sont tenus à une stricte neutralité. En revanche, les usagers des services publics peuvent librement exprimer leur religion."
    ],
    keyConcepts: [
      { term: "Laïcité", definition: "Principe constitutionnel garantissant la liberté de conscience et la neutralité de l'État" },
      { term: "Loi de 1905", definition: "Loi de séparation des Églises et de l'État" },
      { term: "Neutralité des agents publics", definition: "Les fonctionnaires ne peuvent pas exprimer leurs convictions religieuses au travail" },
      { term: "Liberté des usagers", definition: "Les citoyens peuvent librement exprimer leur religion" },
      { term: "Charte de la laïcité à l'école", definition: "Cadre de la neutralité scolaire, interdiction des signes ostensibles" },
      { term: "Blasphème autorisé", definition: "La critique des religions est permise en France" },
      { term: "Loi de 2010", definition: "Interdiction de la dissimulation du visage dans l'espace public" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-republique-indivisible",
    classNumber: 5,
    title: "La République Indivisible : Un Territoire, Une Loi",
    metaTitle: "La République Indivisible — Examen Civique 2026 | GoCivique",
    metaDescription: "Comprendre l'indivisibilité de la République française : unité du territoire, de la langue et du peuple. Préparation examen civique gratuite.",
    introHook: "Le caractère indivisible de la République française signifie que la loi est la même pour tous, partout sur le territoire. C'est un principe fondateur qui garantit l'unité et l'égalité de traitement.",
    previewParagraphs: [
      "La République indivisible est inscrite à l'article premier de la Constitution. L'indivisibilité signifie que la France forme un ensemble unifié : un seul territoire, un seul peuple et une seule loi. Aucune partie du territoire ne peut se déclarer indépendante.",
      "Le français est la langue de la République (article 2 de la Constitution). Cela n'interdit pas les langues régionales, mais le français est la seule langue officielle dans l'administration, la justice et l'enseignement public."
    ],
    keyConcepts: [
      { term: "République indivisible", definition: "Un seul territoire, un seul peuple, une seule loi pour tous" },
      { term: "Langue française", definition: "Seule langue officielle de la République (article 2)" },
      { term: "Égalité de traitement", definition: "La loi s'applique de manière identique sur tout le territoire" },
      { term: "Souveraineté nationale", definition: "Elle appartient au peuple dans son ensemble" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-democratie-souverainete",
    classNumber: 6,
    title: "Démocratie et Souveraineté Populaire",
    metaTitle: "La Démocratie Française — Examen Civique 2026 | GoCivique",
    metaDescription: "Souveraineté nationale, suffrage universel, référendum : comprendre la démocratie française pour l'examen civique. Cours et quiz gratuits.",
    introHook: "En France, la souveraineté nationale appartient au peuple. Chaque citoyen participe à la vie démocratique par son vote et son engagement civique.",
    previewParagraphs: [
      "L'article 3 de la Constitution proclame que « la souveraineté nationale appartient au peuple ». Les citoyens élisent des représentants qui gouvernent en leur nom. Le peuple peut aussi s'exprimer directement par référendum.",
      "Le suffrage universel est le fondement de la démocratie française. Depuis 1944, tous les citoyens majeurs ont le droit de vote. Le vote est libre et secret."
    ],
    keyConcepts: [
      { term: "Souveraineté nationale", definition: "Le pouvoir appartient au peuple (article 3)" },
      { term: "Démocratie représentative", definition: "Les citoyens élisent des représentants" },
      { term: "Référendum", definition: "Vote direct du peuple sur une question précise" },
      { term: "Suffrage universel", definition: "Tous les citoyens majeurs ont le droit de vote depuis 1944" },
      { term: "Pluralisme politique", definition: "Coexistence de plusieurs partis et opinions" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-etat-de-droit",
    classNumber: 7,
    title: "L'État de Droit en France",
    metaTitle: "L'État de Droit — Examen Civique 2026 | GoCivique",
    metaDescription: "Séparation des pouvoirs, hiérarchie des normes, justice indépendante : maîtrisez l'État de droit pour l'examen civique français. Cours gratuit.",
    introHook: "L'État de droit est le principe selon lequel personne n'est au-dessus de la loi. La séparation des pouvoirs et l'indépendance de la justice protègent chaque citoyen contre l'arbitraire.",
    previewParagraphs: [
      "L'État de droit signifie que l'État lui-même est soumis au droit. Ce principe s'oppose à l'arbitraire : aucun dirigeant ne peut prendre de décision contraire à la loi.",
      "Le pilier central est la séparation des pouvoirs, théorisée par Montesquieu : le pouvoir exécutif, le pouvoir législatif et le pouvoir judiciaire sont distincts et indépendants."
    ],
    keyConcepts: [
      { term: "État de droit", definition: "L'État et tous les citoyens sont soumis à la loi" },
      { term: "Séparation des pouvoirs", definition: "Exécutif, législatif et judiciaire (Montesquieu)" },
      { term: "Hiérarchie des normes", definition: "Constitution > traités > lois > décrets > règlements" },
      { term: "Conseil constitutionnel", definition: "Vérifie la conformité des lois à la Constitution" },
      { term: "Présomption d'innocence", definition: "Toute personne est innocente jusqu'à preuve du contraire" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-egalite-femmes-hommes",
    classNumber: 8,
    title: "L'Égalité entre les Femmes et les Hommes",
    metaTitle: "Égalité Femmes-Hommes — Examen Civique 2026 | GoCivique",
    metaDescription: "Parité, loi de 2000, droits des femmes en France : préparez l'examen civique avec ce cours sur l'égalité femmes-hommes. Quiz et révisions gratuits.",
    introHook: "L'égalité entre les femmes et les hommes est un droit fondamental inscrit dans la Constitution. La France garantit les mêmes droits et les mêmes devoirs à tous, quel que soit le sexe.",
    previewParagraphs: [
      "Le principe d'égalité entre les femmes et les hommes est inscrit dans le Préambule de la Constitution de 1946. Les femmes et les hommes ont les mêmes droits et les mêmes devoirs dans tous les domaines.",
      "L'égalité en France se décline en trois formes : l'égalité devant la loi, les droits civiques (voter, se présenter aux élections) et les droits sociaux (santé, éducation, logement, emploi)."
    ],
    keyConcepts: [
      { term: "Préambule de 1946", definition: "Texte constitutionnel qui garantit l'égalité des droits" },
      { term: "Trois formes d'égalité", definition: "Devant la loi, droits civiques, droits sociaux" },
      { term: "Parité", definition: "Égalité dans les responsabilités politiques (loi de 2000)" },
      { term: "Loi de 2000", definition: "Obligation de parité sur les listes électorales" },
      { term: "Inégalités persistantes", definition: "Écarts de salaires et sous-représentation en direction" }
    ],
    fullCoursePath: "/courses"
  },
  {
    slug: "examen-civique-non-discrimination",
    classNumber: 9,
    title: "Le Principe de Non-Discrimination",
    metaTitle: "Non-Discrimination — Examen Civique 2026 | GoCivique",
    metaDescription: "Discrimination, critères interdits, sanctions pénales, Défenseur des droits : tout savoir pour l'examen civique français. Cours gratuit GoCivique.",
    introHook: "La loi française interdit toute forme de discrimination. Chaque personne doit être traitée de manière égale, quels que soient son origine, son sexe, son handicap ou ses convictions.",
    previewParagraphs: [
      "La discrimination est le fait de traiter une personne moins favorablement qu'une autre en raison d'un critère interdit par la loi. La France reconnaît plus de 26 critères interdits, parmi lesquels l'origine, le sexe, l'âge, le handicap et l'orientation sexuelle.",
      "La discrimination peut toucher tous les domaines : emploi, logement, éducation, services publics. Les sanctions sont sévères : jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende."
    ],
    keyConcepts: [
      { term: "Discrimination", definition: "Traitement moins favorable basé sur un critère interdit par la loi" },
      { term: "26 critères interdits", definition: "Origine, sexe, âge, handicap, orientation sexuelle, religion, etc." },
      { term: "Sanctions pénales", definition: "Jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende" },
      { term: "Défenseur des droits", definition: "Autorité indépendante qui lutte contre les discriminations" },
      { term: "Protection des témoins", definition: "Les personnes qui signalent une discrimination sont protégées" }
    ],
    fullCoursePath: "/courses"
  }
];
function CoursPreview() {
  const { slug } = useParams();
  const course = COURSE_PREVIEWS.find((c) => c.slug === slug);
  if (!course) return /* @__PURE__ */ jsx(Navigate, { to: "/courses", replace: true });
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://gocivique.fr/" },
      { "@type": "ListItem", position: 2, name: "Cours", item: "https://gocivique.fr/courses" },
      { "@type": "ListItem", position: 3, name: course.title, item: `https://gocivique.fr/cours/${course.slug}` }
    ]
  };
  const courseSectionSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.metaDescription,
    provider: { "@type": "Organization", name: "GoCivique", url: "https://gocivique.fr" },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", inLanguage: "fr" },
    educationalLevel: course.classNumber <= 3 ? "Beginner" : course.classNumber <= 6 ? "Intermediate" : "Advanced",
    isPartOf: { "@type": "Course", name: "Préparation à l'examen civique français 2026", url: "https://gocivique.fr/courses" }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: course.metaTitle,
        description: course.metaDescription,
        path: `/cours/${course.slug}`,
        schema: [breadcrumbSchema, courseSectionSchema]
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/courses", className: "hover:text-[#0055A4]", children: "Cours" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: course.title })
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: [
        course.title,
        " — Examen Civique 2026"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: course.introHook }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Lecon Principale" }),
      course.previewParagraphs.map((p, i) => /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: p }, i)),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 mt-10 text-2xl font-bold text-slate-900", children: "Concepts Cles a Memoriser" }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-3", children: course.keyConcepts.map(({ term, definition }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800", children: term }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: definition })
      ] }, term)) }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-10 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none select-none", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("div", { className: "blur-sm opacity-50 space-y-3", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "Applications Pratiques" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-700", children: "Des exemples concrets pour comprendre comment ces principes s'appliquent dans la vie quotidienne en France..." }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-700", children: "Lors d'une ceremonie officielle, les symboles de la Republique sont presents pour rappeler les valeurs fondatrices..." })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white flex items-end justify-center pb-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-8 h-8 text-slate-300 mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-slate-500 mb-1", children: "Acces au cours complet avec quiz et flashcards" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400", children: "Inscrivez-vous gratuitement pour continuer" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Preparez l'examen civique 2026" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mb-5 text-white/80 text-sm leading-relaxed", children: "Accedez au cours complet, aux flashcards interactives et aux quiz avec les questions officielles de l'examen. Plus de 7 000 questions disponibles." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxs(Button, { className: "bg-white text-[#0055A4] hover:bg-white/90 font-bold rounded-xl gap-2", children: [
            "Commencer gratuitement ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
          ] }) }),
          /* @__PURE__ */ jsx(Link, { to: "/courses", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "border-white/30 text-white hover:bg-white/10 font-bold rounded-xl gap-2", children: [
            /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }),
            " Voir tous les cours"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium text-slate-700 mb-2", children: "Autres cours du Module 1 :" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: COURSE_PREVIEWS.filter((c) => c.slug !== course.slug).slice(0, 4).map((c) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/cours/${c.slug}`,
            className: "text-[#0055A4] hover:underline",
            children: c.title
          },
          c.slug
        )) })
      ] })
    ] })
  ] });
}
export {
  CoursPreview as default
};
