/**
 * Sitemap generator for GoCivique.
 * Run: node scripts/generate-sitemap.cjs
 *
 * - LOCALIZED pages emit xhtml:link hreflang alternates for all 7 languages
 *   (fr canonical, others via ?lang=) + x-default.
 * - FRENCH_ONLY pages (long-form guides, cours, legal) are plain entries —
 *   no hreflang claims for content that exists only in French.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://gocivique.fr';
const LANGS = ['fr', 'en', 'ar', 'es', 'pt', 'zh', 'tr'];
const TODAY = new Date().toISOString().split('T')[0];

// Pages whose UI/meta are fully localized (LanguageContext keys)
const LOCALIZED = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/quiz', changefreq: 'weekly', priority: '0.95' },
  { path: '/exams', changefreq: 'weekly', priority: '0.95' },
  { path: '/courses', changefreq: 'weekly', priority: '0.9' },
  { path: '/parcours', changefreq: 'weekly', priority: '0.9' },
  { path: '/study-material', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
];

// French-only content pages (translate later → move up to LOCALIZED)
const FRENCH_ONLY = [
  { path: '/test-blanc-examen-civique', lastmod: '2026-06-04', changefreq: 'weekly', priority: '0.9' },
  { path: '/guide-examen-civique', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.85' },
  { path: '/naturalisation-examen-civique', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.85' },
  { path: '/themes/valeurs-republique', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/themes/histoire-geographie', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/themes/institutions', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/themes/droits-devoirs', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/guides/comment-sinscrire', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.75' },
  { path: '/guides/combien-de-fois', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.75' },
  { path: '/guides/si-je-rate-lexamen', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.75' },
  { path: '/guides/combien-de-temps-resultats', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.75' },
  { path: '/cours/examen-civique-symboles-republique', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-devise-francaise', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-ddhc-1789', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-laicite-neutralite', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-republique-indivisible', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-democratie-souverainete', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-etat-de-droit', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-egalite-femmes-hommes', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/cours/examen-civique-non-discrimination', lastmod: '2026-06-04', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
  { path: '/refunds', lastmod: '2026-01-01', changefreq: 'yearly', priority: '0.3' },
];

function langUrl(p, lang) {
  if (lang === 'fr') return `${BASE}${p}`;
  const sep = p.includes('?') ? '&' : '?';
  return `${BASE}${p}${sep}lang=${lang}`;
}

function localizedEntry({ path: p, changefreq, priority }) {
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${langUrl(p, l)}" />`
  ).join('\n');
  return `  <url>
    <loc>${BASE}${p}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${p}" />
  </url>`;
}

function plainEntry({ path: p, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${BASE}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- LOCALIZED PAGES (7 languages via ?lang=) -->
${LOCALIZED.map(localizedEntry).join('\n')}

  <!-- FRENCH-ONLY CONTENT PAGES -->
${FRENCH_ONLY.map(plainEntry).join('\n')}
</urlset>
`;

const out = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log(`sitemap.xml written: ${LOCALIZED.length} localized × ${LANGS.length} langs + ${FRENCH_ONLY.length} fr-only entries`);
