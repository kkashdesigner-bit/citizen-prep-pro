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
    { "@type": "ListItem", "position": 3, "name": "Valeurs de la République", "item": "https://gocivique.fr/themes/valeurs-republique" }
  ]
};
function ThemeValeurs() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Valeurs de la République Française — Examen Civique | GoCivique",
        description: "Liberté, Égalité, Fraternité, laïcité, droits de l'homme : maîtrisez les principes et valeurs fondamentaux de la République française pour réussir l'examen civique.",
        path: "/themes/valeurs-republique",
        schema: breadcrumbSchema
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12 text-slate-800", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-[#0055A4]", children: "Accueil" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/guide-examen-civique", className: "hover:text-[#0055A4]", children: "Guide" }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: "Valeurs de la République" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold text-slate-900 leading-tight", children: "Principes et Valeurs de la République Française" }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-slate-600 leading-relaxed", children: "Ce thème représente environ 20 % des questions à l'examen civique. Il couvre la devise nationale, les principes fondateurs de la République et les valeurs que tout résident est appelé à respecter en France." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La devise : Liberté, Égalité, Fraternité" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 text-slate-700 leading-relaxed", children: [
        "Adoptée définitivement après la Révolution française, la devise ",
        /* @__PURE__ */ jsx("strong", { children: "Liberté, Égalité, Fraternité" }),
        " est gravée sur les frontons des bâtiments publics et figure dans la Constitution. Elle résume l'idéal républicain français."
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Liberté :" }),
          " droits et libertés fondamentaux (expression, conscience, circulation, réunion)."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Égalité :" }),
          " égalité devant la loi, égalité des droits entre hommes et femmes, non-discrimination."
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Fraternité :" }),
          " solidarité nationale, cohésion sociale, aide aux plus vulnérables."
        ] })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "La laïcité" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-slate-700 leading-relaxed", children: "La laïcité est un principe fondamental de la République française, inscrit dans la loi de 1905 sur la séparation de l'Église et de l'État. Elle garantit la liberté de conscience et la neutralité de l'État vis-à-vis de toutes les religions." }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800", children: [
        /* @__PURE__ */ jsx("strong", { children: "À retenir pour l'examen :" }),
        " La laïcité ne signifie pas l'interdiction de la religion, mais la séparation entre sphère publique (État, école, services publics) et sphère privée (croyances individuelles). En France, toutes les religions sont autorisées et égales devant la loi."
      ] }) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les droits de l'homme" }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 text-slate-700 leading-relaxed", children: [
        "La ",
        /* @__PURE__ */ jsx("strong", { children: "Déclaration des droits de l'homme et du citoyen" }),
        " du 26 août 1789 est un texte fondateur. Elle proclame des droits naturels et imprescriptibles : liberté, propriété, sûreté et résistance à l'oppression. Elle est intégrée au préambule de la Constitution de 1958."
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "mb-6 list-disc pl-6 space-y-2 text-slate-700", children: [
        /* @__PURE__ */ jsx("li", { children: "Article 1 : « Les hommes naissent et demeurent libres et égaux en droits. »" }),
        /* @__PURE__ */ jsx("li", { children: "Principe de présomption d'innocence" }),
        /* @__PURE__ */ jsx("li", { children: "Liberté d'opinion et d'expression" }),
        /* @__PURE__ */ jsx("li", { children: "Droit à la propriété" }),
        /* @__PURE__ */ jsx("li", { children: "Égalité devant l'impôt" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Les symboles de la République" }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 grid sm:grid-cols-2 gap-4", children: [
        { sym: "🇫🇷 Le drapeau tricolore", desc: "Bleu, blanc, rouge — adopté lors de la Révolution française (1789). Composé de trois bandes verticales égales." },
        { sym: "🎵 La Marseillaise", desc: "Hymne national composé en 1792 par Rouget de Lisle. Chantée lors des cérémonies officielles et événements sportifs." },
        { sym: "🐓 Le coq gaulois", desc: "Symbole non officiel mais emblématique, associé à la France depuis l'Antiquité, présent sur de nombreux blasons." },
        { sym: "👩 Marianne", desc: "Figure allégorique de la République, représentée coiffée du bonnet phrygien, symbole de liberté." }
      ].map(({ sym, desc }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-800 mb-1", children: sym }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: desc })
      ] }, sym)) }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "L'égalité homme-femme" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-slate-700 leading-relaxed", children: "L'égalité entre les femmes et les hommes est une valeur constitutionnelle en France depuis 1999. Les femmes ont obtenu le droit de vote en 1944. La loi interdit toute discrimination fondée sur le sexe dans l'emploi, l'éducation et la vie publique. L'égalité homme-femme est une valeur républicaine non négociable." }),
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-2xl font-bold text-slate-900", children: "Questions fréquentes à l'examen" }),
      /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-3", children: [
        { q: "Quelle est la devise de la République française ?", a: "Liberté, Égalité, Fraternité" },
        { q: "En quelle année a été promulguée la loi sur la séparation de l'Église et de l'État ?", a: "1905" },
        { q: "Combien de bandes composent le drapeau français ?", a: "Trois bandes verticales (bleu, blanc, rouge)" },
        { q: "Quel est l'hymne national français ?", a: "La Marseillaise" }
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
        /* @__PURE__ */ jsx("p", { className: "mb-4 text-white/80 text-sm", children: "Testez vos connaissances avec des questions portant spécifiquement sur les principes et valeurs de la République." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/quiz?category=Principles+and+values+of+the+Republic",
              className: "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors",
              children: "Quiz sur ce thème"
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
        /* @__PURE__ */ jsx(Link, { to: "/themes/histoire-geographie", className: "text-[#0055A4] hover:underline", children: "Histoire & géographie" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/institutions", className: "text-[#0055A4] hover:underline", children: "Institutions" }),
        " · ",
        /* @__PURE__ */ jsx(Link, { to: "/themes/droits-devoirs", className: "text-[#0055A4] hover:underline", children: "Droits et devoirs" })
      ] }) })
    ] })
  ] });
}
export {
  ThemeValeurs as default
};
