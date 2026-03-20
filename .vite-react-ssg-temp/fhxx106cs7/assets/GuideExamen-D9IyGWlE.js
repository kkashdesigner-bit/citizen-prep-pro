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
    { "@type": "ListItem", "position": 2, "name": "Guide de l'examen civique", "item": "https://gocivique.fr/guide-examen-civique" }
  ]
};
function GuideExamen() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Guide Complet de l'Examen Civique 2026 | GoCivique",
        description: "Tout ce qu'il faut savoir sur l'examen civique 2026 : format, thèmes, niveau de difficulté, conseils de préparation et ressources pour réussir du premier coup.",
        path: "/guide-examen-civique",
        schema: breadcrumbSchema
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Guide de l'examen civique" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: "Guide Complet de l'Examen Civique 2026" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: "L'examen civique est une étape obligatoire pour obtenir la naturalisation française, la carte de séjour pluriannuelle ou la carte de résident. Ce guide vous explique tout ce qu'il faut savoir pour vous préparer efficacement." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Qu'est-ce que l'examen civique ?" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "L'examen civique évalue votre connaissance des valeurs, des institutions et de l'histoire de la France. Il est organisé par l'OFII (Office Français de l'Immigration et de l'Intégration) et se déroule en présentiel dans un centre agréé. Réussir cet examen est indispensable pour valider votre contrat d'intégration républicaine (CIR)." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Format de l'examen" }),
      /* @__PURE__ */ jsx("p", { className: "mb-3 text-slate-700 leading-relaxed", children: "L'examen dure environ 45 minutes et comprend entre 40 et 60 questions à choix multiples (QCM). Chaque question propose quatre réponses possibles, dont une seule est correcte. Le seuil de réussite est généralement fixé à 50 % des bonnes réponses." }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Format :" }),
          " QCM (questions à choix multiples)"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Durée :" }),
          " 45 minutes"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Nombre de questions :" }),
          " 40 à 60 questions"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Langue :" }),
          " Français (niveau A2 minimum requis)"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Lieu :" }),
          " Centre de formation OFII ou établissement agréé"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les 5 grands thèmes du programme" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "Le programme officiel couvre cinq domaines principaux. Chaque thème représente environ 20 % des questions :" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4]", children: "1. Principes et valeurs de la République" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "La devise Liberté, Égalité, Fraternité, la laïcité, les droits de l'homme, la Déclaration des droits de 1789." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4]", children: "2. Histoire et géographie de la France" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Les grandes dates de l'histoire, la Révolution, les guerres mondiales, la géographie du territoire, les symboles nationaux." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4]", children: "3. Institutions et système politique" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "La Ve République, les pouvoirs exécutif, législatif et judiciaire, le rôle du Président et du Parlement." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4]", children: "4. Droits et devoirs des citoyens" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Le droit de vote, le service national, les obligations fiscales, les libertés fondamentales, l'égalité homme-femme." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4]", children: "5. Vivre en société française" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Le système éducatif, la sécurité sociale, le monde du travail, la culture française, les services publics." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Conseils pour bien se préparer" }),
      /* @__PURE__ */ jsxs("ol", { className: "mb-6 list-decimal pl-6 space-y-3 text-slate-700", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Commencez tôt :" }),
          " Prévoyez au minimum 4 à 6 semaines de préparation régulière (30 minutes par jour)."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Faites des quiz régulièrement :" }),
          " La répétition est la clé. Entraînez-vous avec des QCM dans les conditions de l'examen."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Réviserz par thème :" }),
          " Identifiez vos points faibles en consultant vos statistiques après chaque entraînement."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Lisez le livret d'accueil :" }),
          " Le document officiel remis lors de la signature du CIR contient l'essentiel du programme."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Faites des examens blancs :" }),
          " Simulez les conditions réelles avec 40 questions en 45 minutes pour vous habituer au rythme."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Niveau de difficulté" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "L'examen est accessible à toute personne ayant suivi une formation civique ou s'y étant préparée sérieusement. Les questions portent sur des notions fondamentales enseignées lors des sessions de formation OFII. Avec une préparation sérieuse de 4 à 6 semaines, la majorité des candidats réussissent dès le premier passage." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-bold", children: "Prêt à vous entraîner ?" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-white/80 text-sm", children: "GoCivique propose des quiz interactifs et des examens blancs chronométrés pour vous préparer dans les meilleures conditions." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/quiz",
              className: "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors",
              children: "Quiz gratuit"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/exams",
              className: "rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors",
              children: "Examen blanc"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500", children: /* @__PURE__ */ jsxs("p", { children: [
        "En savoir plus :",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-[#0055A4] hover:underline", children: "À propos de GoCivique" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/valeurs-republique", className: "text-[#0055A4] hover:underline", children: "Valeurs de la République" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/institutions", className: "text-[#0055A4] hover:underline", children: "Institutions françaises" })
      ] }) })
    ] })
  ] });
}
export {
  GuideExamen as default
};
