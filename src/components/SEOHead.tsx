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
    /** Set to true for guide/article pages to inject article:published_time etc. */
    isArticle?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
    ogImage?: string;
}

const SITE_NAME = 'GoCivique';
const BASE_URL = 'https://www.gocivique.fr';
const DEFAULT_OG_IMAGE = `${BASE_URL}/gocivique-og-image.png`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

const SUPPORTED_LANGS = [
    { code: 'fr', param: '', ogLocale: 'fr_FR' },
    { code: 'en', param: '?lang=en', ogLocale: 'en_US' },
    { code: 'ar', param: '?lang=ar', ogLocale: 'ar_AR' },
    { code: 'es', param: '?lang=es', ogLocale: 'es_ES' },
    { code: 'pt', param: '?lang=pt', ogLocale: 'pt_PT' },
    { code: 'zh', param: '?lang=zh', ogLocale: 'zh_CN' },
    { code: 'tr', param: '?lang=tr', ogLocale: 'tr_TR' },
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
    isArticle = false,
    publishedTime = '2025-01-01T00:00:00+00:00',
    modifiedTime = '2026-06-04T00:00:00+00:00',
    ogImage,
}: SEOHeadProps) {
    const { t, language } = useLanguage();

    const resolvedTitle = titleKey ? t(titleKey) : (title || t('seo.defaultTitle'));
    const resolvedDesc = descriptionKey ? t(descriptionKey) : (description || t('seo.defaultDesc'));

    const fullTitle = resolvedTitle.includes(SITE_NAME) ? resolvedTitle : `${resolvedTitle} | ${SITE_NAME}`;
    // Self-referencing canonical: each language variant canonicalizes to itself,
    // otherwise Google drops the translated versions from the index.
    const currentLang = SUPPORTED_LANGS.find((l) => l.code === language) || SUPPORTED_LANGS[0];
    const url = `${BASE_URL}${path}${currentLang.param}`;
    const ogLocale = currentLang.ogLocale;
    const imageUrl = ogImage || DEFAULT_OG_IMAGE;

    // ── Organization Schema ──
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "EducationalOrganization"],
        "@id": `${BASE_URL}/#organization`,
        "name": "GoCivique",
        "url": BASE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/gocivique-logo-examen-civique.png`,
            "width": 512,
            "height": 512
        },
        "description": "Plateforme de préparation à l'examen civique de naturalisation française 2026 — CSP, Carte de Résident, Naturalisation",
        "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
        "foundingDate": "2025-01-01",
        "sameAs": [
            "https://gocivique.fr"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@gocivique.fr",
            "url": `${BASE_URL}/contact`,
            "availableLanguage": ["French", "English", "Arabic", "Spanish", "Turkish", "Portuguese"]
        }
    };

    // ── WebSite Schema — enables Google Sitelinks Search Box ──
    const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GoCivique — Examen Civique 2026",
        "url": BASE_URL,
        "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${BASE_URL}/quiz?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // ── SoftwareApplication Schema ──
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/#app`,
        "name": "GoCivique — Préparation Examen Civique",
        "applicationCategory": "EducationalApplication",
        "applicationSubCategory": "Exam Preparation",
        "operatingSystem": "Web, iOS, Android",
        "url": BASE_URL,
        "description": "Application de préparation à l'examen civique 2026 : 7 034 questions officielles, mises en situation, examens blancs chronométrés, 100 cours, suivi de progression. Pour la CSP, la carte de résident et la naturalisation française.",
        "screenshot": `${BASE_URL}/gocivique-og-image.png`,
        "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
        "offers": [
            {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "name": "Gratuit",
                "description": "1 examen démo, 10 classes, accès limité",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "price": "6.99",
                "priceCurrency": "EUR",
                "name": "Standard",
                "description": "Examens illimités, parcours complet 1→100, suivi de progression",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "price": "30",
                "priceCurrency": "EUR",
                "name": "Accès à Vie",
                "description": "Paiement unique — toutes les fonctionnalités Premium à vie",
                "availability": "https://schema.org/InStock"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "412",
            "reviewCount": "412"
        }
    };

    // ── Course Schema ──
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${BASE_URL}/#course`,
        "name": "Préparation complète à l'examen civique 2026 — CSP, Carte de Résident, Naturalisation",
        "description": "Cours complet de préparation à l'examen civique obligatoire depuis le 1er janvier 2026 pour la naturalisation française, la carte de séjour pluriannuelle (CSP) et la carte de résident. 7 034 questions officielles, 100 cours, mises en situation, examens blancs chronométrés et suivi de progression.",
        "datePublished": "2025-01-01",
        "dateModified": "2026-06-04",
        "provider": { "@id": `${BASE_URL}/#organization` },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
            "courseWorkload": "PT15M"
        },
        "numberOfCredits": 0,
        "educationalLevel": "Beginner",
        "teaches": [
            "Principes et valeurs de la République française",
            "Institutions et système politique français",
            "Droits et devoirs du citoyen",
            "Histoire, géographie et culture de France",
            "Vivre en société — intégration"
        ],
        "about": [
            "Examen civique 2026",
            "Naturalisation française",
            "Carte de séjour pluriannuelle (CSP)",
            "Carte de résident",
            "QCM citoyenneté",
            "Mises en situation civiques"
        ],
        "offers": [
            {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
                "description": "Essai gratuit — 1 examen démo, 10 classes",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "price": "6.99",
                "priceCurrency": "EUR",
                "description": "Standard mensuel — Examens illimités, parcours complet",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "price": "30",
                "priceCurrency": "EUR",
                "description": "Accès à Vie — paiement unique, toutes fonctionnalités Premium",
                "availability": "https://schema.org/InStock"
            }
        ]
    };

    const baseSchemas = [orgSchema, webSiteSchema, softwareSchema, courseSchema];

    const schemasToInject = schema
        ? (Array.isArray(schema) ? [...baseSchemas, ...schema] : [...baseSchemas, schema])
        : baseSchemas;

    const articleType = isArticle ? 'article' : type;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={resolvedDesc} />
            <meta name="keywords" content="examen civique, préparation examen civique, qcm examen civique, mises en situation, naturalisation française, carte de résident, carte de séjour pluriannuelle, CSP, test civique france, examen civique 2026" />
            <meta name="application-name" content="GoCivique" />
            <meta name="author" content="GoCivique" />
            <meta name="creator" content="GoCivique" />
            <meta name="publisher" content="GoCivique" />
            <meta name="theme-color" content="#0055A4" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="GoCivique" />
            <link rel="canonical" href={url} />

            {noindex
                ? <meta name="robots" content="noindex, nofollow" />
                : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            }
            <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />

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
            <meta property="og:type" content={articleType} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content={ogLocale} />
            {SUPPORTED_LANGS.filter((l) => l.code !== language).map((l) => (
                <meta key={l.code} property="og:locale:alternate" content={l.ogLocale} />
            ))}
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:secure_url" content={imageUrl} />
            <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
            <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
            <meta property="og:image:alt" content={`${SITE_NAME} — Préparation examen civique 2026`} />
            <meta property="og:image:type" content="image/png" />

            {/* Article meta for guide/blog pages */}
            {isArticle && (
                <>
                    <meta property="article:published_time" content={publishedTime} />
                    <meta property="article:modified_time" content={modifiedTime} />
                    <meta property="article:section" content="Guide examen civique" />
                    <meta property="article:publisher" content="https://gocivique.fr" />
                </>
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={resolvedDesc} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content={`${SITE_NAME} — Préparation examen civique 2026`} />

            {/* Structured Data (JSON-LD) */}
            {schemasToInject.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
}
