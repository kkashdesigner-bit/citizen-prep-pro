import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import "react-helmet-async";
import "../main.mjs";
import "react";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Droits et devoirs", "item": "https://gocivique.fr/themes/droits-devoirs" }
  ]
};
function ThemeDroitsDevoits() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Droits et Devoirs du Citoyen Français — Examen Civique | GoCivique",
        description: "Droit de vote, libertés fondamentales, obligations civiques et fiscales : maîtrisez les droits et devoirs du citoyen français pour réussir l'examen civique 2026.",
        path: "/themes/droits-devoirs",
        schema: breadcrumbSchema
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/guide-examen-civique", className: "hover:text-[#0055A4]", children: "Guide" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Droits et devoirs" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: "Droits et Devoirs du Citoyen Français" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: "Être citoyen français, c'est bénéficier de droits fondamentaux et assumer des devoirs envers la collectivité. Ce thème représente environ 20 % des questions à l'examen civique." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les droits fondamentaux" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "La France garantit à chaque personne, citoyenne ou résidente, un ensemble de libertés et de droits fondamentaux, protégés par la Constitution, la Déclaration des droits de l'homme de 1789 et la Convention européenne des droits de l'homme." }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 grid sm:grid-cols-2 gap-3", children: [
        { droit: "Liberté d'expression", desc: "Droit de s'exprimer librement, dans le respect des lois (pas d'incitation à la haine, pas de diffamation)." },
        { droit: "Liberté de conscience et de religion", desc: "Chacun est libre de croire ou ne pas croire, de pratiquer sa religion dans l'espace privé." },
        { droit: "Droit à l'éducation", desc: "L'enseignement est obligatoire de 3 à 16 ans. L'école publique est laïque et gratuite." },
        { droit: "Droit à la santé", desc: "La Sécurité sociale rembourse une partie des frais de santé. La CMU-C couvre les personnes à faibles revenus." },
        { droit: "Droit au travail", desc: "Interdiction de la discrimination à l'embauche. Droit à un salaire minimum (SMIC)." },
        { droit: "Droit de vote", desc: "Réservé aux citoyens français de 18 ans et plus, inscrits sur les listes électorales." }
      ].map(({ droit, desc }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-[#0055A4] text-sm mb-1", children: droit }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: desc })
      ] }, droit)) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Le droit de vote" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 text-slate-700 leading-relaxed", children: [
        "Le droit de vote est l'un des piliers de la démocratie française. En France, il est ",
        /* @__PURE__ */ jsx("strong", { children: "universel, égal et secret" }),
        "."
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          "Accessible à tous les citoyens français de ",
          /* @__PURE__ */ jsx("strong", { children: "18 ans et plus" })
        ] }),
        /* @__PURE__ */ jsx("li", { children: "Inscription sur les listes électorales obligatoire (automatique depuis 2019 à 18 ans)" }),
        /* @__PURE__ */ jsx("li", { children: "Élections présidentielles, législatives, sénatoriales, municipales, européennes" }),
        /* @__PURE__ */ jsx("li", { children: "Le vote n'est pas obligatoire en France (contrairement à certains pays)" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les devoirs du citoyen" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-[#0055A4] bg-blue-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "💰 Devoir fiscal" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-700", children: "Tout contribuable doit déclarer ses revenus et payer ses impôts. L'impôt finance les services publics (éducation, santé, sécurité). La fraude fiscale est un délit puni par la loi." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-[#EF4135] bg-red-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "📜 Respect des lois" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-700", children: "Tout résident est soumis aux lois françaises. L'ignorance de la loi n'est pas une excuse. Les lois s'appliquent de manière égale à tous." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-green-500 bg-green-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "🎖️ Journée défense et citoyenneté (JDC)" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-700", children: "Anciennement appelé service national, la JDC est obligatoire pour tous les jeunes Français (hommes et femmes) à 16 ans. Elle remplace le service militaire supprimé en 1997." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "🗳️ Participation civique" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-700", children: "Bien que le vote ne soit pas obligatoire en France, la participation à la vie démocratique est encouragée : voter, s'engager, respecter les symboles républicains." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "L'égalité et la non-discrimination" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "La loi française interdit toute discrimination fondée sur l'origine, le sexe, la religion, le handicap, l'orientation sexuelle ou l'âge dans les domaines de l'emploi, du logement, de l'éducation et de l'accès aux services. Le Défenseur des droits est l'autorité indépendante chargée de traiter les réclamations." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les libertés qui ont des limites" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "En France, toutes les libertés ont des limites fixées par la loi pour protéger les autres citoyens et l'ordre public :" }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsx("li", { children: "La liberté d'expression ne permet pas l'incitation à la haine ou la diffamation." }),
        /* @__PURE__ */ jsx("li", { children: "La liberté de réunion est soumise à déclaration préalable en mairie." }),
        /* @__PURE__ */ jsx("li", { children: "La liberté de la presse est garantie mais encadrée (loi sur la presse de 1881)." })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Questions types à l'examen" }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-3", children: [
        { q: "À partir de quel âge peut-on voter en France ?", a: "18 ans" },
        { q: "Le vote est-il obligatoire en France ?", a: "Non, le vote est un droit mais pas une obligation" },
        { q: "Comment s'appelle la prestation de sécurité sociale qui couvre les frais de santé ?", a: "L'Assurance maladie (Sécurité sociale)" },
        { q: "Quel organisme traite les discriminations en France ?", a: "Le Défenseur des droits" }
      ].map(({ q, a }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-800", children: [
          "❓ ",
          q
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-[#0055A4] font-medium", children: [
          "✅ ",
          a
        ] })
      ] }, q)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-bold", children: "Entraînez-vous sur ce thème" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-white/80 text-sm", children: "Quiz ciblés sur les droits et devoirs du citoyen pour consolider vos connaissances." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/quiz?category=Rights+and+duties",
              className: "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors",
              children: "Quiz droits et devoirs"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/exams",
              className: "rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors",
              children: "Examen blanc complet"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500", children: /* @__PURE__ */ jsxs("p", { children: [
        "Autres thèmes :",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/valeurs-republique", className: "text-[#0055A4] hover:underline", children: "Valeurs de la République" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/histoire-geographie", className: "text-[#0055A4] hover:underline", children: "Histoire & géographie" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/institutions", className: "text-[#0055A4] hover:underline", children: "Institutions françaises" })
      ] }) })
    ] })
  ] });
}
export {
  ThemeDroitsDevoits as default
};
