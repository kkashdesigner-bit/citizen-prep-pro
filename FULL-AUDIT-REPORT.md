# SEO Full Audit Report — gocivique.fr
**Date:** 11 March 2026
**Audited by:** Claude Code SEO Skill
**Platform detected:** React SPA (Vite, CSR-only — no SSR/SSG)
**Hosting:** Cloudflare (lovable.app infrastructure)
**Business type:** EdTech / SaaS — French civic exam preparation (naturalisation française)
**Languages:** FR, EN, AR, ES, TR, PT

---

## SEO Health Score: 41 / 100

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 38/100 | 25% | 9.5 |
| Content Quality | 54/100 | 25% | 13.5 |
| On-Page SEO | 30/100 | 20% | 6.0 |
| Schema / Structured Data | 40/100 | 10% | 4.0 |
| Performance (CWV) | 35/100 | 10% | 3.5 |
| Images | 40/100 | 5% | 2.0 |
| AI Search Readiness | 52/100 | 5% | 2.6 |
| **TOTAL** | | | **41.1** |

---

## Executive Summary

GoCivique serves a high-value niche — French civic exam preparation for naturalisation candidates — with a well-structured feature set (quiz, mock exams, learning path) and correct multilingual intent. However, the site is built as a **pure Client-Side Rendered (CSR) SPA** with no server-side rendering or static generation. This single architectural decision is the root cause of **4 critical SEO failures** that collectively block Google from properly indexing any page beyond the homepage.

Every URL on the site returns the same HTML spinner shell to crawlers. Every page shares the same title tag, the same canonical URL (pointing to the homepage), and the same meta description. Google cannot distinguish `/quiz` from `/examens-blancs` from `/parcours`. All PageRank is collapsing into a single URL.

Beyond the architecture, there are **significant E-E-A-T gaps** — no legal publisher identity (mentions légales), a Gmail support address, placeholder hero avatars, and no named author — that would lower quality rater scores for a YMYL-adjacent immigration platform.

**Top 5 critical issues:**
1. All pages serve canonical `https://gocivique.fr/` — non-homepage pages will not be indexed
2. Pure CSR: zero content in server-delivered HTML (spinner only)
3. Identical title tags on all pages
4. No mentions légales page (French legal requirement — LCEN Article 6-III-1)
5. 422 KB uncompressed JS bundle with no Brotli compression

**Top 5 quick wins (no code required):**
1. Enable Brotli compression in Cloudflare (Speed → Optimization → Brotli)
2. Fix HTTP→HTTP→HTTPS two-hop redirect to a single 301 in Cloudflare
3. Remove `/dashboard` and `/auth` from sitemap.xml
4. Add AI crawler directives to robots.txt
5. Add X-Frame-Options and HSTS preload in Cloudflare Transform Rules

---

## Section 1 — Technical SEO (Score: 38/100)

### CRITICAL — C1: Universal Canonical Points to Homepage

Every page — `/quiz`, `/parcours`, `/examens-blancs`, `/about`, `/contact` — returns this in its static HTML:

```html
<link rel="canonical" href="https://gocivique.fr/" />
```

This canonical is hardcoded into the Vite `index.html` shell, which is served identically for all routes. Google interprets this as: "the content on /quiz is the same as the content on the homepage." The quiz, mock exams, and learning path pages will not be independently indexed.

**Fix:** Migrate to Next.js App Router with `generateMetadata()` per route, or implement a Cloudflare Worker prerendering layer that injects per-route canonicals.

---

### CRITICAL — C2: Pure Client-Side Rendering — No SSR/SSG

The `<body>` of every page contains only a loading spinner:
```html
<div id="root">
  <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f0f4f8">
    <svg style="animation:spin 1s linear infinite">...</svg>
  </div>
</div>
```

Confirmed: pure Vite React SPA (no `_next/`, no `__NEXT_DATA__`, no hydration markers). Googlebot operates a two-wave indexing system — the first wave sees a spinner, the second wave (JavaScript rendering) is queued and may execute days to weeks later with resource limits.

All meta tags, structured data, canonical tags, and page content depend on JavaScript execution. The `<noscript>` block is empty. There is no static content fallback.

**Fix:** Migrate public pages (/, /quiz, /examens-blancs, /parcours, /about, /contact) to Next.js with SSG/SSR. Keep /dashboard and /auth as CSR.

---

### CRITICAL — C3: Duplicate Title Tags on All Pages

Every page returns: `Examen Civique 2026 : Préparation, Quiz & Examens Blancs | GoCivique`

Same root cause as C1 and C2. Google may rewrite titles and cannot target individual pages for distinct keywords.

---

### CRITICAL — C4: Identical Meta Description on All Pages

Every page returns the same meta description:
> "Préparez l'examen civique obligatoire 2026 pour la naturalisation française, la carte de séjour pluriannuelle ou la carte de résident. Quiz interactifs, examens blancs chronométrés et suivi de progression. Essai gratuit !"

Functional for the homepage but applied universally. Google ignores duplicate meta descriptions and writes its own snippets.

---

### HIGH — H1: HTTP Redirect Chain (Two Hops Before HTTPS)

```
http://gocivique.fr → 302 → http://www.gocivique.fr/   ← unencrypted hop
https://gocivique.fr → 302 → https://www.gocivique.fr/
```

The first redirect hop is unencrypted HTTP-to-HTTP. Fix with a single Cloudflare redirect rule: `http://gocivique.fr/*` → `https://www.gocivique.fr/$1` (301).

---

### HIGH — H2: Canonical Domain Mismatch (non-www vs www)

- Canonical tags reference: `https://gocivique.fr/` (non-www)
- Server serves: `https://www.gocivique.fr/` (www after redirect)
- Sitemap uses: `https://gocivique.fr/` (non-www)

Pick one canonical form and enforce it everywhere.

---

### HIGH — H3: Authenticated Pages in Sitemap

`/dashboard` (priority 0.7) and `/auth` (priority 0.5) are in sitemap.xml. These pages require login — Google crawls them and finds a spinner or authentication wall, wasting crawl budget and triggering soft-404 signals.

**Fix:** Remove from sitemap. Add `noindex` directive.

---

### HIGH — H4: Missing Security Headers

| Header | Status |
|--------|--------|
| Strict-Transport-Security | ✅ Present (missing `preload`) |
| X-Content-Type-Options | ✅ Present |
| Referrer-Policy | ✅ Present |
| Content-Security-Policy | ❌ Missing |
| X-Frame-Options | ❌ Missing (clickjacking risk) |
| Permissions-Policy | ❌ Missing |

**Fix:** Add via Cloudflare Transform Rules → Modify Response Headers.

---

### HIGH — H5: No Brotli/Gzip Compression on JS/CSS Bundles

- Main JS bundle: **422 KB uncompressed**, no `Content-Encoding` header
- Main CSS bundle: **136 KB uncompressed**, no `Content-Encoding` header

With Brotli this compresses to ~120–140 KB. This is a severe LCP risk on mobile.

**Fix:** Cloudflare → Speed → Optimization → Brotli → Enable.

---

### MEDIUM — M1: Core Web Vitals — LCP Risk

- Pure CSR: no content in HTML shell before JS executes
- 422 KB uncompressed JS bundle (the only path to visible content)
- External Google Fonts (additional TCP connections, even with preconnect)
- LCP element is entirely JS-dependent

**INP risk:** Monolithic 422 KB bundle blocks main thread during parse/execute (1–3 seconds on mid-range mobile).

**CLS risk:** Root spinner uses `min-height:100vh` — replaced by React hydration causes full-viewport layout shift.

---

### MEDIUM — M2: Hreflang via Query Parameters

Language variants use `?lang=en`, `?lang=ar` etc. rather than separate URL paths. Google may treat these as duplicate URLs. Hreflang annotations are only on the homepage — not on `/quiz`, `/parcours`, `/examens-blancs`. The rendered DOM will contain **14 duplicate hreflang declarations** (7 from static shell + 7 injected by `react-helmet-async`).

---

### MEDIUM — M3: Sitemap URLs Don't Match Serving Domain

All sitemap `<loc>` entries use non-www (`https://gocivique.fr/`) but the server redirects all requests to www (`https://www.gocivique.fr/`). Every sitemap URL triggers a redirect — wasteful and messy.

---

### LOW — L1: No IndexNow Implementation

No IndexNow key file or meta tag detected. Bing and Yandex can receive instant URL updates instead of waiting for crawl discovery.

---

### LOW — L2: No AI Crawler Directives in robots.txt

Missing explicit rules for GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, CCBot. Recommended stance for this platform:

```
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /
```

---

### LOW — L3: llms.txt Missing (404)

No `/llms.txt` or `/llms-full.txt`. A machine-readable site summary would help AI assistants surface GoCivique for civic exam queries.

---

### LOW — L4: robots.txt Served via 302 Redirect

`https://gocivique.fr/robots.txt` redirects (302) to `https://www.gocivique.fr/robots.txt`. Unnecessary hop.

---

## Section 2 — Content Quality & E-E-A-T (Score: 54/100)

### CRITICAL — Missing Mentions Légales (French Legal Requirement)

French law (LCEN Article 6-III-1) mandates a mentions légales page for any professional website. Required content: publisher identity, legal form, SIRET/SIREN, registered address, hosting provider details.

The current legal footer only links to CGV/CGU, Privacy, and Refunds. **No mentions légales = legal compliance failure + E-E-A-T trust failure.**

---

### CRITICAL — Dynamic Date Bug in Legal Documents

`Terms.tsx` (line 21) and `Privacy.tsx` (line 20) use `new Date().toLocaleDateString('fr-FR')` for "Dernière mise à jour." The legal document always claims to have been modified today, regardless of when it was actually edited. This is:
- Legally incorrect (CNIL compliance risk)
- A quality rater trust signal failure
- A known anti-pattern that sophisticated crawlers flag

**Fix:** Hardcode the actual last-modification date as a static string.

---

### CRITICAL — All Body Content is JS-Rendered (No Static Fallback)

Any crawler, AI training bot, or social preview tool that doesn't execute JavaScript sees only a spinner. The site's factually accurate exam content (40 questions, 45 minutes, 80% threshold, 5 themes) exists only in JS-rendered DOM — invisible to static readers. No `<noscript>` fallback content exists.

---

### HIGH — Organization Schema `sameAs` is Circular

`SEOHead.tsx` defines `"sameAs": [BASE_URL]` — pointing back at itself. The `sameAs` property is designed to link to external authority profiles (Wikidata, LinkedIn, official directories). A self-reference provides zero Knowledge Graph authority signal.

**File:** [src/components/SEOHead.tsx](src/components/SEOHead.tsx)

---

### HIGH — Gmail Address as Legal and Support Contact

`gocivique@gmail.com` is used as contact, RGPD data controller, and support address. For a paid subscription platform targeting immigration candidates (YMYL-adjacent), a free Gmail address significantly undermines trustworthiness scoring. Google's quality raters are trained to flag this.

**Fix:** Create `support@gocivique.fr` and `dpo@gocivique.fr`.

---

### HIGH — No Named Author or Expert Anywhere

The About page has accurate exam content but no credited author, editorial team, or civic/legal expert. The Privacy Policy identifies the data controller as "l'éditeur du site gocivique.fr" with no name. Under the Sept 2025 QRG, YMYL-adjacent educational platforms must demonstrate expert authorship.

---

### HIGH — Placeholder Hero Avatars (pravatar.cc)

`HeroSection.tsx` uses `i.pravatar.cc/100?img=33` etc. — public placeholder avatar images presented as real user testimonials. The actual `/public/avatar-*.webp` files exist and should replace these.

**File:** [src/components/HeroSection.tsx](src/components/HeroSection.tsx)

---

### HIGH — Duplicate Hreflang Declarations

Static `index.html` (lines 55–61) contains 7 hreflang `<link>` elements. `SEOHead.tsx` injects another 7 via `react-helmet-async`. The homepage renders with 14 hreflang declarations — two competing sets for the same URLs.

---

### MEDIUM — FAQPage Promotional Language

`Index.tsx` FAQ answer for "Comment se préparer à l'examen civique 2026?" opens with "Préparez-vous avec GoCivique." AI Overviews prefer neutral, encyclopaedic answers. Factual content within the answer is citation-worthy; the brand-first framing is not.

**File:** [src/pages/Index.tsx](src/pages/Index.tsx)

---

### MEDIUM — Course Schema Missing `instructor` and `aggregateRating`

The Course schema in `SEOHead.tsx` is structurally sound but lacks:
- `instructor` (named `Person` entity — E-E-A-T anchor)
- `aggregateRating` (enables star rating display in SERPs)
- `datePublished` / `dateModified` (freshness signals)

**File:** [src/components/SEOHead.tsx](src/components/SEOHead.tsx)

---

### MEDIUM — `html lang` Hardcoded as `fr` for All Languages

When a user switches to Arabic (`?lang=ar`), the `<html lang="fr">` attribute stays `fr`. The `dir="rtl"` attribute for Arabic is also absent. Screen readers, language-specific crawlers, and RTL rendering all depend on these attributes.

---

### LOW — Footer PDF Link is Dead (`href="#"`)

`Footer.tsx` (line 49) has a link to "Livret du citoyen (PDF)" with `href="#"` — clicking it does nothing. The actual file `/public/Nationalité.pdf` should be linked.

**File:** [src/components/Footer.tsx](src/components/Footer.tsx)

---

## Section 3 — Schema / Structured Data (Score: 40/100)

### Current Implementation

All schema is injected client-side by `react-helmet-async` in `SEOHead.tsx`. The static HTML shell contains only a comment: `<!-- Structured Data injected via react-helmet-async -->`. Zero structured data is visible to crawlers reading the static HTML.

| Schema Type | Present | Quality |
|-------------|---------|---------|
| Organization | ✅ JS-only | Weak (`sameAs` circular) |
| WebSite + SearchAction | ✅ JS-only | Good |
| Course | ✅ JS-only | Good (missing instructor, rating) |
| FAQPage | ✅ JS-only (homepage only) | Good content, promotional framing |
| BreadcrumbList | ❌ Missing | — |
| LearningResource | ❌ Missing | — |
| SoftwareApplication | ❌ Missing | — |

### Recommended Additions

**WebSite (inline in `<head>` — static HTML):**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GoCivique",
  "url": "https://gocivique.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gocivique.fr/quiz?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Organization (update `sameAs` with real profiles):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GoCivique",
  "url": "https://gocivique.fr",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@gocivique.fr",
    "contactType": "customer support",
    "availableLanguage": ["French", "English", "Arabic"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/gocivique",
    "https://twitter.com/GoCivique"
  ]
}
```

**Course (add instructor and rating):**
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Préparation à l'Examen Civique 2026",
  "description": "Préparez l'examen civique obligatoire pour la naturalisation française...",
  "provider": { "@type": "Organization", "name": "GoCivique", "url": "https://gocivique.fr" },
  "instructor": { "@type": "Person", "name": "[Expert name]" },
  "educationalLevel": "Beginner",
  "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
  "datePublished": "2025-01-01",
  "dateModified": "2026-03-08",
  "offers": [
    { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "name": "Essai gratuit" },
    { "@type": "Offer", "price": "6.99", "priceCurrency": "EUR", "name": "Mensuel" },
    { "@type": "Offer", "price": "10.99", "priceCurrency": "EUR", "name": "Trimestriel" }
  ]
}
```

---

## Section 4 — Performance / Core Web Vitals (Score: 35/100)

| Metric | Risk Level | Root Cause |
|--------|-----------|------------|
| LCP | 🔴 High risk | 422 KB uncompressed JS bundle (CSR-only) + external fonts |
| INP | 🔴 High risk | Monolithic bundle blocks main thread 1–3s on mobile |
| CLS | 🟡 Medium risk | `min-height:100vh` spinner replaced by React hydration |

**Key actions:**
1. Enable Brotli on Cloudflare (immediate, no deploy)
2. Implement route-based code splitting with `React.lazy` + `Suspense`
3. Self-host fonts (eliminates external DNS lookup for fonts.googleapis.com)
4. After SSR: identify real LCP element per page, add `fetchpriority="high"`

---

## Section 5 — Sitemap Analysis

**Current sitemap:** 12 URLs, all `lastmod: 2026-03-08`

| Issue | Severity |
|-------|---------|
| `/dashboard` and `/auth` included — should be excluded | High |
| All URLs use non-www but server serves www | Medium |
| No language/locale variants in sitemap | Medium |
| Zero sitemap coverage for multilingual routes | Medium |
| Legal pages (privacy, terms, refunds) have correct low priority | ✅ OK |
| Sitemap referenced correctly in robots.txt | ✅ OK |

**Recommended sitemap additions for multilingual coverage:**
```xml
<url><loc>https://gocivique.fr/?lang=en</loc><priority>0.8</priority></url>
<url><loc>https://gocivique.fr/?lang=ar</loc><priority>0.8</priority></url>
<!-- etc for es, tr, pt -->
```

---

## Section 6 — AI Search Readiness (Score: 52/100)

| Factor | Status |
|--------|--------|
| llms.txt | ❌ Missing (404) |
| GPTBot access | ⚠️ No directive (open by default) |
| ClaudeBot access | ⚠️ No directive (open by default) |
| PerplexityBot access | ⚠️ No directive (open by default) |
| Static readable content | ❌ Zero (spinner only) |
| FAQPage schema | ✅ Present (JS-only) |
| Citation-ready passages | ⚠️ Exists in JS DOM only |
| Brand mention signals | ⚠️ No external authority links |

**Primary GEO opportunity:**
Query: "comment préparer examen civique naturalisation france 2026"

The FAQPage schema answers are factually accurate and dense with citable data (40 questions, 45 min, 80% threshold, 5 themes, 3 eligible populations). These are exactly what AI Overviews cite — but only if Google can read them. Currently they're JS-only.

**After SSR migration:** Inline FAQPage JSON-LD as static HTML → immediate AI citation eligibility.

---

## Section 7 — Generated Schema Markup (Ready to Implement)

All blocks should be inlined as static `<script type="application/ld+json">` in server-rendered HTML — not injected by react-helmet-async.

### Block 1 — Organization + EducationalOrganization (all pages)
```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "EducationalOrganization"],
  "@id": "https://gocivique.fr/#organization",
  "name": "GoCivique",
  "url": "https://gocivique.fr",
  "logo": { "@type": "ImageObject", "url": "https://gocivique.fr/LOGO.svg" },
  "description": "Plateforme de préparation en ligne à l'examen de la citoyenneté française.",
  "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
  "sameAs": ["https://twitter.com/GoCivique", "https://www.linkedin.com/company/gocivique"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://gocivique.fr/contact",
    "availableLanguage": ["French","English","Arabic","Spanish","Turkish","Portuguese"]
  }
}
```

### Block 2 — WebSite + SearchAction (homepage only)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://gocivique.fr/#website",
  "name": "GoCivique",
  "url": "https://gocivique.fr",
  "publisher": { "@id": "https://gocivique.fr/#organization" },
  "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://gocivique.fr/quiz?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
}
```

### Block 3 — Course: Parcours (/parcours)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://gocivique.fr/parcours#course",
  "name": "Parcours de préparation à la naturalisation française",
  "description": "Parcours thématiques pour préparer l'examen de citoyenneté française.",
  "url": "https://gocivique.fr/parcours",
  "provider": { "@id": "https://gocivique.fr/#organization" },
  "educationalLevel": "Beginner",
  "courseMode": "online",
  "isAccessibleForFree": true,
  "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
  "datePublished": "2025-01-01",
  "dateModified": "2026-03-08",
  "teaches": ["Histoire de France","Institutions de la République","Valeurs républicaines","Culture civique"]
}
```

### Block 4 — Course: Examens Blancs (/examens-blancs)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://gocivique.fr/examens-blancs#course",
  "name": "Examens blancs — Test de citoyenneté française",
  "description": "Simulations chronométrées de l'examen de naturalisation. 40 questions en 45 minutes.",
  "url": "https://gocivique.fr/examens-blancs",
  "provider": { "@id": "https://gocivique.fr/#organization" },
  "educationalLevel": "Intermediate",
  "courseMode": "online",
  "isAccessibleForFree": true,
  "datePublished": "2025-01-01",
  "dateModified": "2026-03-08"
}
```

### Block 5 — LearningResource: Quiz (/quiz)
```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "@id": "https://gocivique.fr/quiz#learningresource",
  "name": "Quiz de citoyenneté française",
  "learningResourceType": "quiz",
  "educationalLevel": "Beginner",
  "url": "https://gocivique.fr/quiz",
  "isAccessibleForFree": true,
  "provider": { "@id": "https://gocivique.fr/#organization" },
  "inLanguage": ["fr", "en", "ar", "es", "tr", "pt"],
  "about": [
    { "@type": "Thing", "name": "Naturalisation française" },
    { "@type": "Thing", "name": "Citoyenneté française" }
  ]
}
```

### Block 6 — BreadcrumbList (per inner page)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr" },
    { "@type": "ListItem", "position": 2, "name": "Quiz", "item": "https://gocivique.fr/quiz" }
  ]
}
```
*(Replace position 2 with the correct page name/URL per route)*

### FAQPage Note
Google restricts FAQ rich results to government and healthcare sites only (since Aug 2023). The existing FAQPage schema in `Index.tsx` will **not** produce SERP accordions for GoCivique. It remains useful for Bing and structured data signals, but should not be prioritised over the schemas above.

---

## Key Files

| File | Issues |
|------|--------|
| [index.html](index.html) | Hardcoded canonical (homepage), duplicate OG tags, empty noscript |
| [src/components/SEOHead.tsx](src/components/SEOHead.tsx) | All schema (JS-only), circular sameAs, hreflang injection |
| [src/pages/Index.tsx](src/pages/Index.tsx) | FAQPage schema with promotional language |
| [src/pages/About.tsx](src/pages/About.tsx) | No author attribution |
| [src/pages/Contact.tsx](src/pages/Contact.tsx) | Gmail address |
| [src/pages/Terms.tsx](src/pages/Terms.tsx) | Dynamic date bug (line 21) |
| [src/pages/Privacy.tsx](src/pages/Privacy.tsx) | Dynamic date bug (line 20) |
| [src/components/Footer.tsx](src/components/Footer.tsx) | Dead PDF link (line 49) |
| [src/components/HeroSection.tsx](src/components/HeroSection.tsx) | Placeholder pravatar images |
| [public/sitemap.xml](public/sitemap.xml) | /dashboard at priority 0.7, non-www URLs |
| [public/robots.txt](public/robots.txt) | No AI crawler directives |
