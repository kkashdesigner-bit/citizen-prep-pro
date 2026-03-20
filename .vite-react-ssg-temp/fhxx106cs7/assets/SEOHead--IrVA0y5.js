import { jsxs, jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { u as useLanguage } from "../main.mjs";
const SITE_NAME = "GoCivique";
const BASE_URL = "https://gocivique.fr";
const SUPPORTED_LANGS = [
  { code: "fr", param: "" },
  { code: "en", param: "?lang=en" },
  { code: "ar", param: "?lang=ar" },
  { code: "es", param: "?lang=es" },
  { code: "tr", param: "?lang=tr" },
  { code: "pt", param: "?lang=pt" }
];
function SEOHead({
  titleKey,
  descriptionKey,
  title,
  description,
  path = "",
  type = "website",
  noindex = false,
  schema
}) {
  const { t } = useLanguage();
  const resolvedTitle = titleKey ? t(titleKey) : title || t("seo.defaultTitle");
  const resolvedDesc = descriptionKey ? t(descriptionKey) : description || t("seo.defaultDesc");
  const fullTitle = resolvedTitle.includes(SITE_NAME) ? resolvedTitle : `${resolvedTitle} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${BASE_URL}/#organization`,
    "name": "GoCivique",
    "url": BASE_URL,
    "logo": { "@type": "ImageObject", "url": `${BASE_URL}/gocivique-logo-examen-civique.png` },
    "description": "Plateforme de préparation à l'examen civique de naturalisation française 2026",
    "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
    "sameAs": [
      "https://twitter.com/GoCivique"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": `${BASE_URL}/contact`,
      "availableLanguage": ["French", "English", "Arabic", "Spanish", "Turkish", "Portuguese"]
    }
  };
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GoCivique",
    "url": BASE_URL,
    "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/quiz?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${BASE_URL}/#course`,
    "name": "Préparation à l'examen civique français 2026",
    "description": "Cours complet de préparation à l'examen civique obligatoire pour la naturalisation française, la carte de séjour pluriannuelle et la carte de résident. Quiz interactifs, examens blancs chronométrés et suivi de progression.",
    "datePublished": "2025-01-01",
    "dateModified": "2026-03-08",
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"]
    },
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "description": "Essai gratuit — 1 examen démo",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "price": "6.99",
        "priceCurrency": "EUR",
        "description": "Standard — Examens illimités et mode entraînement",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "price": "10.99",
        "priceCurrency": "EUR",
        "description": "Premium — Traductions, guides et outils avancés",
        "availability": "https://schema.org/InStock"
      }
    ],
    "educationalLevel": "Beginner",
    "about": [
      "Examen civique",
      "Naturalisation française",
      "Carte de séjour pluriannuelle",
      "Carte de résident",
      "Valeurs de la République française"
    ]
  };
  const schemasToInject = schema ? Array.isArray(schema) ? [orgSchema, webSiteSchema, courseSchema, ...schema] : [orgSchema, webSiteSchema, courseSchema, schema] : [orgSchema, webSiteSchema, courseSchema];
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: resolvedDesc }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: url }),
    noindex && /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }),
    SUPPORTED_LANGS.map((lang) => /* @__PURE__ */ jsx(
      "link",
      {
        rel: "alternate",
        hrefLang: lang.code,
        href: `${BASE_URL}${path}${lang.param}`
      },
      lang.code
    )),
    /* @__PURE__ */ jsx("link", { rel: "alternate", hrefLang: "x-default", href: `${BASE_URL}${path}` }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: resolvedDesc }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: url }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: SITE_NAME }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "fr_FR" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: resolvedDesc }),
    schemasToInject.map((s, i) => /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify(s) }, i))
  ] });
}
export {
  SEOHead as S
};
