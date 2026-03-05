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

    // Base Organization Schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GoCivique",
        "url": BASE_URL,
        "logo": `${BASE_URL}/LOGO.svg`
    };

    // Base Course Schema
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "GoCivique – Préparation à l'examen civique",
        "description": "Préparation complète à l'examen civique pour la naturalisation française avec quiz interactifs, leçons et examens blancs.",
        "provider": {
            "@type": "Organization",
            "name": "GoCivique",
            "sameAs": BASE_URL
        }
    };

    const schemasToInject = schema ?
        (Array.isArray(schema) ? [orgSchema, courseSchema, ...schema] : [orgSchema, courseSchema, schema])
        : [orgSchema, courseSchema];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={resolvedDesc} />
            <link rel="canonical" href={url} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={resolvedDesc} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />

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
