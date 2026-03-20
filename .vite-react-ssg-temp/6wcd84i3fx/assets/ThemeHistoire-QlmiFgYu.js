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
    { "@type": "ListItem", "position": 3, "name": "Histoire et géographie", "item": "https://gocivique.fr/themes/histoire-geographie" }
  ]
};
function ThemeHistoire() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Histoire et Géographie de France — Examen Civique | GoCivique",
        description: "Révolutions, guerres mondiales, géographie et symboles : maîtrisez le thème Histoire et géographie de la France pour réussir l'examen civique de naturalisation.",
        path: "/themes/histoire-geographie",
        schema: breadcrumbSchema
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/guide-examen-civique", className: "hover:text-[#0055A4]", children: "Guide" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Histoire et géographie" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: "Histoire et Géographie de France — Examen Civique" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: "Ce thème couvre les grandes étapes de l'histoire française, les événements fondateurs de la République, et les données essentielles sur le territoire et la géographie du pays." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les grandes dates à connaître" }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 space-y-3", children: [
        { date: "843", event: "Traité de Verdun — Naissance du royaume de France" },
        { date: "1515", event: "Bataille de Marignan — François Ier, roi de France" },
        { date: "1789", event: "Révolution française — Déclaration des droits de l'homme et du citoyen" },
        { date: "1792", event: "Proclamation de la Ire République" },
        { date: "1804", event: "Napoléon devient Empereur — Ier Empire" },
        { date: "1870-1871", event: "Guerre franco-prussienne — Naissance de la IIIe République" },
        { date: "1905", event: "Loi de séparation de l'Église et de l'État" },
        { date: "1914-1918", event: "Première Guerre mondiale" },
        { date: "1939-1945", event: "Seconde Guerre mondiale — Résistance et Libération" },
        { date: "1944", event: "Droit de vote accordé aux femmes" },
        { date: "1958", event: "Naissance de la Ve République — Constitution actuelle" },
        { date: "1992", event: "Traité de Maastricht — Construction européenne" }
      ].map(({ date, event }) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-16 text-right font-bold text-[#0055A4] text-sm", children: date }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-slate-700", children: event })
      ] }, date)) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La Révolution française (1789)" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "La Révolution française est l'événement fondateur de la République. Le 14 juillet 1789, la prise de la Bastille marque le début de la Révolution. C'est cette date qui est célébrée chaque année comme fête nationale française. La Déclaration des droits de l'homme et du citoyen (août 1789) pose les bases des libertés fondamentales toujours en vigueur." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les deux guerres mondiales" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "La France a joué un rôle central dans les deux conflits mondiaux du XXe siècle." }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "1914-1918 :" }),
          " La France perd 1,4 million de soldats. La victoire est célébrée le 11 novembre (Armistice), jour de commémoration nationale."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "1939-1945 :" }),
          " La France est occupée par l'Allemagne nazie (1940-1944). Le général de Gaulle lance l'Appel du 18 juin 1940 depuis Londres et dirige la France libre. La Résistance intérieure combat l'occupant. La Libération de Paris a lieu en août 1944."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La Ve République et la Constitution de 1958" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "La Ve République a été fondée par le général de Gaulle en 1958, en réponse à la crise algérienne. La Constitution du 4 octobre 1958 est le texte fondamental qui régit encore aujourd'hui les institutions françaises. Elle établit un régime semi-présidentiel où le Président de la République joue un rôle central." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Géographie de la France" }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 grid sm:grid-cols-2 gap-4", children: [
        { titre: "Superficie", info: "551 695 km² (métropole) — 6e pays d'Europe par la superficie" },
        { titre: "Population", info: "Environ 68 millions d'habitants" },
        { titre: "Capitale", info: "Paris — siège des principales institutions" },
        { titre: "Frontières terrestres", info: "Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Espagne, Andorre" },
        { titre: "Plus haut sommet", info: "Mont-Blanc (4 808 m) — Alpes" },
        { titre: "Principaux fleuves", info: "La Loire, la Seine, le Rhône, la Garonne" },
        { titre: "Outre-mer", info: "5 régions d'outre-mer : Guadeloupe, Martinique, Guyane, La Réunion, Mayotte" },
        { titre: "Union européenne", info: "Membre fondateur de l'UE — utilise l'euro depuis 2002" }
      ].map(({ titre, info }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[#0055A4] uppercase tracking-wide", children: titre }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-slate-700", children: info })
      ] }, titre)) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Questions types à l'examen" }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-3", children: [
        { q: "Quelle date est célébrée comme fête nationale en France ?", a: "Le 14 juillet (prise de la Bastille, 1789)" },
        { q: "Quel général a lancé l'Appel du 18 juin 1940 ?", a: "Le général de Gaulle" },
        { q: "En quelle année les femmes ont-elles obtenu le droit de vote en France ?", a: "1944" },
        { q: "Quel est le plus haut sommet de France ?", a: "Le Mont-Blanc (4 808 m)" }
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
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-xl font-bold", children: "Testez vos connaissances en histoire" }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-white/80 text-sm", children: "Quiz ciblés sur l'histoire et la géographie de France pour renforcer ce thème avant l'examen." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/quiz?category=History%2C+geography+and+culture",
              className: "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors",
              children: "Quiz histoire-géographie"
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
        "Autres thèmes :",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/valeurs-republique", className: "text-[#0055A4] hover:underline", children: "Valeurs de la République" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/institutions", className: "text-[#0055A4] hover:underline", children: "Institutions" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/droits-devoirs", className: "text-[#0055A4] hover:underline", children: "Droits et devoirs" })
      ] }) })
    ] })
  ] });
}
export {
  ThemeHistoire as default
};
