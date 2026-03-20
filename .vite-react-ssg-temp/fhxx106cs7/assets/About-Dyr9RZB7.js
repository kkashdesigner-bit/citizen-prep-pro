import { jsxs, jsx } from "react/jsx-runtime";
import { H as Header } from "./Header-CzgIuffk.js";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { F as Footer } from "./Footer-DfL4a8kP.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BbwBU_1g.js";
import { B as Badge } from "./badge-DObGNgcP.js";
import { u as useLanguage } from "../main.mjs";
import { BookOpen, Users, Shield, Award, Crown, FileText, CheckCircle, Clock, ExternalLink } from "lucide-react";
import "react-router-dom";
import "./button-AT0XyJsk.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./useSubscription-Cz7bDEZd.js";
import "./types-CapR02YX.js";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./Logo-RLfqH6ZW.js";
import "./use-mobile-BsFue-bT.js";
import "react-helmet-async";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
function About() {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        titleKey: "seo.aboutTitle",
        descriptionKey: "seo.aboutDesc",
        path: "/about"
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "container py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl", children: t("about.title") }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-muted-foreground", children: t("about.subtitle") }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-primary" }),
          t("about.whatIs")
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-foreground", children: [
          /* @__PURE__ */ jsx("p", { children: t("about.whatIsP1") }),
          /* @__PURE__ */ jsx("p", { children: t("about.whatIsP2") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-primary" }),
          t("about.whoMust")
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(Shield, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: t("about.cspTitle") }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("about.cspDesc") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(Award, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: t("about.crTitle") }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("about.crDesc") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(Crown, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: t("about.natTitle") }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("about.natDesc") })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-primary" }),
          t("about.format")
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: "40" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("about.questions") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: "45" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("about.minutes") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: "4" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("about.optionsPerQ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-secondary p-3 text-center", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-foreground", children: "80%" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("about.passThreshold") })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-primary" }),
          t("about.content")
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm", children: [
          { q: "11", key: "contentPrinciples" },
          { q: "6", key: "contentInstitutions" },
          { q: "11", key: "contentRights" },
          { q: "8", key: "contentHistory" },
          { q: "4", key: "contentLiving" }
        ].map(({ q, key }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
            q,
            " ",
            t("about.questions").toLowerCase()
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: t(`about.${key}`) })
        ] }, key)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-primary" }),
          t("about.procedure")
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm text-foreground", children: [
          /* @__PURE__ */ jsx("p", { children: t("about.procedureP1") }),
          /* @__PURE__ */ jsx("p", { children: t("about.procedureP2") }),
          /* @__PURE__ */ jsx("p", { children: t("about.procedureP3") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 font-serif", children: [
          /* @__PURE__ */ jsx(ExternalLink, { className: "h-5 w-5 text-primary" }),
          t("about.resources")
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://www.interieur.gouv.fr", target: "_blank", rel: "noopener noreferrer", className: "text-primary underline hover:text-primary/80", children: "Ministère de l'Intérieur" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://www.service-public.fr/particuliers/vosdroits/F2213", target: "_blank", rel: "noopener noreferrer", className: "text-primary underline hover:text-primary/80", children: "Service Public — Naturalisation française" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "https://www.service-public.fr/particuliers/vosdroits/F2215", target: "_blank", rel: "noopener noreferrer", className: "text-primary underline hover:text-primary/80", children: "Service Public — Examen civique" }) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  About as default
};
