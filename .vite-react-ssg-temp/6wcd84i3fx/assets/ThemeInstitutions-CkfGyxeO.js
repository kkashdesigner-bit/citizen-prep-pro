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
    { "@type": "ListItem", "position": 3, "name": "Institutions françaises", "item": "https://gocivique.fr/themes/institutions" }
  ]
};
function ThemeInstitutions() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Institutions et Système Politique Français — Examen Civique | GoCivique",
        description: "Président, Parlement, gouvernement, justice : comprenez le fonctionnement des institutions françaises pour réussir l'examen civique de naturalisation 2026.",
        path: "/themes/institutions",
        schema: breadcrumbSchema
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/guide-examen-civique", className: "hover:text-[#0055A4]", children: "Guide" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Institutions françaises" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: "Institutions et Système Politique Français" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: "La France est une République dont les institutions reposent sur la Constitution de 1958. Comprendre la séparation des pouvoirs et le rôle de chaque institution est essentiel pour l'examen civique." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La Ve République" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "La France vit sous la Ve République depuis 1958. Ce régime semi-présidentiel accorde un rôle prépondérant au Président de la République, élu au suffrage universel direct depuis 1962. La Constitution du 4 octobre 1958 reste le texte de référence, révisé à plusieurs reprises depuis lors." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La séparation des pouvoirs" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-[#0055A4] bg-blue-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "⚡ Pouvoir exécutif" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-700", children: [
            "Exercé par le ",
            /* @__PURE__ */ jsx("strong", { children: "Président de la République" }),
            " et le ",
            /* @__PURE__ */ jsx("strong", { children: "Premier ministre" }),
            ". Le Président dirige la politique étrangère et la défense ; le gouvernement conduit la politique intérieure."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-[#EF4135] bg-red-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "🏛️ Pouvoir législatif" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-700", children: [
            "Exercé par le ",
            /* @__PURE__ */ jsx("strong", { children: "Parlement" }),
            ", composé de l'Assemblée nationale (577 députés) et du Sénat (348 sénateurs). Il vote les lois et contrôle le gouvernement."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "⚖️ Pouvoir judiciaire" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-slate-700", children: [
            "Exercé par la ",
            /* @__PURE__ */ jsx("strong", { children: "magistrature" }),
            " (tribunaux, cours d'appel, Cour de cassation). Le Conseil d'État juge les conflits avec l'administration. Le Conseil constitutionnel vérifie la conformité des lois à la Constitution."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Le Président de la République" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 text-slate-700 leading-relaxed", children: [
        "Le Président de la République est élu au suffrage universel direct pour un mandat de ",
        /* @__PURE__ */ jsx("strong", { children: "5 ans" }),
        " (quinquennat), renouvelable une fois. Il est le chef des armées et garant de la Constitution."
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsx("li", { children: "Nomme le Premier ministre" }),
        /* @__PURE__ */ jsx("li", { children: "Préside le Conseil des ministres" }),
        /* @__PURE__ */ jsx("li", { children: "Peut dissoudre l'Assemblée nationale" }),
        /* @__PURE__ */ jsx("li", { children: "Dirige la politique étrangère" }),
        /* @__PURE__ */ jsx("li", { children: "Peut organiser un référendum" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Le Parlement" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-6 grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4] mb-2", children: "Assemblée nationale" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-slate-700 space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "• 577 députés" }),
            /* @__PURE__ */ jsx("li", { children: "• Élus pour 5 ans au suffrage universel direct" }),
            /* @__PURE__ */ jsx("li", { children: "• Siège au Palais Bourbon (Paris)" }),
            /* @__PURE__ */ jsx("li", { children: "• Peut renverser le gouvernement (motion de censure)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#0055A4] mb-2", children: "Sénat" }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-slate-700 space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "• 348 sénateurs" }),
            /* @__PURE__ */ jsx("li", { children: "• Élus pour 6 ans par des grands électeurs" }),
            /* @__PURE__ */ jsx("li", { children: "• Siège au Palais du Luxembourg (Paris)" }),
            /* @__PURE__ */ jsx("li", { children: "• Représente les collectivités territoriales" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "L'organisation territoriale" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "La France est divisée en collectivités territoriales à différents niveaux :" }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 space-y-2", children: [
        { niveau: "Communes", nb: "~35 000", detail: "Dirigées par un maire élu" },
        { niveau: "Départements", nb: "101", detail: "96 en métropole + 5 outre-mer, dirigés par un Conseil départemental" },
        { niveau: "Régions", nb: "18", detail: "13 en métropole + 5 outre-mer, dirigées par un Conseil régional" }
      ].map(({ niveau, nb, detail }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsx("span", { className: "w-24 text-right text-xs font-bold text-[#0055A4] uppercase", children: niveau }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-800", children: nb }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-600", children: detail })
      ] }, niveau)) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Questions types à l'examen" }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-3", children: [
        { q: "Combien de temps dure le mandat du Président de la République ?", a: "5 ans (quinquennat)" },
        { q: "Combien y a-t-il de députés à l'Assemblée nationale ?", a: "577 députés" },
        { q: "Qui nomme le Premier ministre ?", a: "Le Président de la République" },
        { q: "Combien y a-t-il de régions en France métropolitaine ?", a: "13 régions" }
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
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-bold", children: "Entraînez-vous sur les institutions" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-white/80 text-sm", children: "Quiz interactif sur les institutions et le système politique français." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/quiz?category=Institutional+and+political+system",
              className: "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors",
              children: "Quiz institutions"
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
        /* @__PURE__ */ jsx(Link, { to: "/themes/droits-devoirs", className: "text-[#0055A4] hover:underline", children: "Droits et devoirs" })
      ] }) })
    ] })
  ] });
}
export {
  ThemeInstitutions as default
};
