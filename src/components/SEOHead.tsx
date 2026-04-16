import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHeadProps {
    titleKey?: string;
    descriptionKey?: string;
    title?: string;
    description?: string;
    path?: string;
    type?: string;
    noindex?: boolean;
    schema?: Record<string, any> | Record<string, any>[];
}

const SITE_NAME = 'GoCivique';
const BASE_URL = 'https://gocivique.fr';

const SUPPORTED_LANGS = [
    { code: 'fr', param: '' },
    { code: 'en', param: '?lang=en' },
    { code: 'ar', param: '?lang=ar' },
    { code: 'es', param: '?lang=es' },
    { code: 'tr', param: '?lang=tr' },
    { code: 'pt', param: '?lang=pt' },
];

export default function SEOHead({
    titleKey,
    descriptionKey,
    title,
    description,
    path = '',
    type = 'website',
    noindex = false,
    schema,
}: SEOHeadProps) {
    const { t } = useLanguage();

    const resolvedTitle = titleKey ? t(titleKey) : (title || t('seo.defaultTitle'));
    const resolvedDesc = descriptionKey ? t(descriptionKey) : (description || t('seo.defaultDesc'));

    const fullTitle = resolvedTitle.includes(SITE_NAME) ? resolvedTitle : `${resolvedTitle} | ${SITE_NAME}`;
    const url = `${BASE_URL}${path}`;

    // Organization Schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "EducationalOrganization"],
        "@id": `${BASE_URL}/#organization`,
        "name": "GoCivique",
        "url": BASE_URL,
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}/gocivique-logo-examen-civique.png` },
        "description": "Plateforme de préparation à l'examen civique de naturalisation française 2026",
        "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
        "foundingDate": "2025-01-01",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@gocivique.fr",
            "url": `${BASE_URL}/contact`,
            "availableLanguage": ["French", "English", "Arabic", "Spanish", "Turkish", "Portuguese"]
        }
    };

    // WebSite Schema — enables Google sitelinks search box
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

    // Course Schema — enhanced with courseInstance, offers, and multi-language
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${BASE_URL}/#course`,
        "name": "Préparation à l'examen civique français 2026",
        "description": "Cours complet de préparation à l'examen civique obligatoire pour la naturalisation française, la carte de séjour pluriannuelle et la carte de résident. Quiz interactifs, examens blancs chronométrés et suivi de progression.",
        "datePublished": "2025-01-01",
        "dateModified": "2026-04-14",
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

    const schemasToInject = schema ?
        (Array.isArray(schema) ? [orgSchema, webSiteSchema, courseSchema, ...schema] : [orgSchema, webSiteSchema, courseSchema, schema])
        : [orgSchema, webSiteSchema, courseSchema];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={resolvedDesc} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* hreflang tags for multi-language SEO */}
            {SUPPORTED_LANGS.map((lang) => (
                <link
                    key={lang.code}
                    rel="alternate"
                    hrefLang={lang.code}
                    href={`${BASE_URL}${path}${lang.param}`}
                />
            ))}
            <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${path}`} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={resolvedDesc} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="fr_FR" />

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={resolvedDesc} />

            {/* Structured Data (JSON-LD) */}
            {schemasToInject.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
}
