# SEO Action Plan — gocivique.fr
**Generated:** 11 March 2026 | **Overall Score:** 41/100

---

## CRITICAL — Fix Immediately

### C1-C4 — Migrate from CSR to SSR/SSG *(Architecture — 1–2 weeks)*

The #1 priority. All four critical issues (canonical, title, meta description duplication + JS rendering) share the same root cause and the same fix.

**What to do:**
Migrate public pages to Next.js App Router with `generateMetadata()` per route.

```
Pages to SSG (static generation):
  / → Homepage
  /quiz → Quiz section
  /examens-blancs → Mock exams
  /parcours → Learning path
  /about → About
  /contact → Contact

Pages to keep as CSR:
  /dashboard
  /auth
  /settings
  /onboarding
```

**Per-route metadata example:**
```typescript
// app/quiz/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Quiz Examen Civique 2026 — Entraînez-vous | GoCivique',
    description: 'Plus de 500 questions d\'entraînement pour l\'examen civique 2026. Testez vos connaissances sur l\'histoire de France, les institutions et les valeurs républicaines.',
    alternates: {
      canonical: 'https://gocivique.fr/quiz',
      languages: {
        'fr': 'https://gocivique.fr/quiz',
        'en': 'https://gocivique.fr/quiz?lang=en',
        'ar': 'https://gocivique.fr/quiz?lang=ar',
      }
    }
  }
}
```

**Expected impact:** Unlocks indexing of /quiz, /examens-blancs, /parcours — the highest-value transactional pages on the site.

---

### C5 — Add Mentions Légales Page *(Legal + SEO — 1 day)*

Required by French law (LCEN Article 6-III-1). Creates the foundation of E-E-A-T trust.

**Required content:**
- Nom/prénom ou raison sociale de l'éditeur
- Numéro SIRET ou SIREN
- Adresse du siège social
- Numéro de téléphone (or email professionnel)
- Nom de l'hébergeur et ses coordonnées
- Directeur de la publication

**Add to footer nav:** `Mentions légales` link alongside CGV/CGU.

---

### C6 — Fix Dynamic Date in Terms and Privacy *(Legal compliance — 30 minutes)*

**File:** [src/pages/Terms.tsx](src/pages/Terms.tsx) line 21, [src/pages/Privacy.tsx](src/pages/Privacy.tsx) line 20

Replace:
```typescript
new Date().toLocaleDateString('fr-FR')
```
With:
```typescript
"8 mars 2026"  // actual last modification date — update manually when document changes
```

---

## HIGH — Fix This Week

### H1 — Fix HTTP→HTTP→HTTPS Redirect Chain *(Cloudflare — 10 minutes)*

In Cloudflare → Rules → Redirect Rules, create:
- Match: `http://gocivique.fr/*`
- Redirect to: `https://www.gocivique.fr/$1`
- Type: 301 Permanent

This replaces the two-hop `http → http → https` with a single `http → https` jump.

---

### H2 — Standardise Canonical Domain *(Config — 30 minutes)*

Pick `https://www.gocivique.fr/` (already the serving domain) and enforce everywhere:
1. Update all `<link rel="canonical">` tags to use www
2. Update all sitemap `<loc>` entries to use www
3. Update `robots.txt` Sitemap directive to use www
4. Ensure all internal links use www or relative paths

---

### H3 — Remove Authenticated Pages from Sitemap *(5 minutes)*

**File:** [public/sitemap.xml](public/sitemap.xml)

Remove these entries:
- `<url>` for `/dashboard`
- `<url>` for `/auth`

Also add `noindex` to these routes:
```typescript
// In SEOHead.tsx, set noindex={true} for /dashboard and /auth routes
```

---

### H4 — Add Missing Security Headers *(Cloudflare — 15 minutes)*

In Cloudflare → Rules → Transform Rules → Modify Response Headers:

```
X-Frame-Options: DENY
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Then submit to https://hstspreload.org for preload list inclusion.

---

### H5 — Enable Brotli Compression *(Cloudflare — 5 minutes)*

Cloudflare → Speed → Optimization → Content Optimization → **Brotli: ON**

Reduces 422 KB JS bundle to ~130 KB. Most impactful single action for Core Web Vitals.

---

### H6 — Fix Organization Schema `sameAs` *(Code — 30 minutes)*

**File:** [src/components/SEOHead.tsx](src/components/SEOHead.tsx)

Replace:
```json
"sameAs": ["https://gocivique.fr"]
```
With actual external profile URLs:
```json
"sameAs": [
  "https://www.linkedin.com/company/gocivique",
  "https://twitter.com/GoCivique",
  "https://www.facebook.com/gocivique"
]
```

---

### H7 — Replace Placeholder Hero Avatars *(Code — 30 minutes)*

**File:** [src/components/HeroSection.tsx](src/components/HeroSection.tsx)

Replace all `i.pravatar.cc/100?img=*` URLs with the existing `/public/avatar-1.webp` through `avatar-8.webp` files. Add real user names and testimonial text.

---

### H8 — Switch to Professional Domain Email *(Config — 1 day)*

Replace `gocivique@gmail.com` with:
- `support@gocivique.fr` — customer support contact
- `dpo@gocivique.fr` — RGPD data protection officer contact

Update in: Contact page, Terms, Privacy, and any transactional email templates.

---

### H9 — Add Named Author/Expert to About Page *(Content — half day)*

**File:** [src/pages/About.tsx](src/pages/About.tsx)

Add an author or editorial team section with:
- Name and photo
- Qualifications relevant to civic education / immigration law
- Brief bio

Also add `instructor` to the Course schema in `SEOHead.tsx`:
```json
"instructor": {
  "@type": "Person",
  "name": "[Expert Name]",
  "description": "[Brief credentials]"
}
```

---

### H10 — Fix Duplicate Hreflang Declarations *(Code — 30 minutes)*

**File:** [index.html](index.html)

Remove the 7 static hreflang `<link>` elements from the HTML shell (lines 55–61). Let `SEOHead.tsx` handle all hreflang injection dynamically. This eliminates the 14-tag duplication on the homepage.

---

## MEDIUM — Fix This Month

### M1 — Add AI Crawler Directives to robots.txt *(5 minutes)*

**File:** [public/robots.txt](public/robots.txt)

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

User-agent: Applebot-Extended
Allow: /
```

---

### M2 — Create /llms.txt *(Content — 1 hour)*

**Create file:** [public/llms.txt](public/llms.txt)

```
# GoCivique — Préparation à l'Examen Civique Français

> GoCivique est une plateforme d'entraînement à l'examen civique obligatoire pour
> les candidats à la naturalisation française, à la carte de séjour pluriannuelle (CSP),
> et à la carte de résident (CR).

## Fonctionnalités
- Quiz interactifs : 500+ questions basées sur le contenu officiel du livret du citoyen
- Examens blancs : simulations chronométrées de 40 questions en 45 minutes
- Parcours d'apprentissage : 5 thèmes (histoire, institutions, valeurs, symboles, UE)
- Suivi de progression : tableau de bord personnalisé
- Multilingue : français, anglais, arabe, espagnol, turc, portugais

## Format de l'examen officiel
- 40 questions à choix multiples (4 options)
- 45 minutes
- Seuil de réussite : 32/40 (80%)
- Administré par le CCI Paris Île-de-France
- Résultat valable sans limite de durée

## Thèmes couverts
1. Histoire de France (11 questions)
2. Institutions de la République (6 questions)
3. Valeurs et principes de la République (11 questions)
4. Symboles nationaux (8 questions)
5. Union européenne (4 questions)

## Liens
- Site : https://gocivique.fr
- Quiz : https://gocivique.fr/quiz
- Examens blancs : https://gocivique.fr/examens-blancs
- Contact : support@gocivique.fr
```

---

### M3 — Add IndexNow Protocol *(1 hour)*

1. Generate key at https://www.bing.com/indexnow
2. Place key file at `https://gocivique.fr/{key}.txt`
3. Add to HTML `<head>`: `<meta name="indexnow-key" content="{key}">`
4. Integrate IndexNow API call into CI/CD deployment pipeline

---

### M4 — Rewrite FAQPage Answer Opening *(30 minutes)*

**File:** [src/pages/Index.tsx](src/pages/Index.tsx)

Change the "Comment se préparer" answer from brand-first to fact-first:

Before: "Préparez-vous avec GoCivique : quiz interactifs..."
After: "Pour préparer l'examen civique 2026 : révisez les 5 thèmes (histoire, institutions, valeurs, symboles, UE) couvrant 40 questions en 45 minutes avec un seuil de 80%. Des quiz interactifs et des examens blancs chronométrés permettent de simuler les conditions réelles de l'examen. GoCivique propose une préparation complète gratuite à l'essai."

---

### M5 — Fix `html lang` and Add RTL Support *(Code — 2 hours)*

In `LanguageContext.tsx`, when language changes to Arabic, dynamically update:
```typescript
document.documentElement.lang = langCode;
document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
```

---

### M6 — Fix Footer PDF Link *(5 minutes)*

**File:** [src/components/Footer.tsx](src/components/Footer.tsx) line 49

Change `href="#"` to `href="/Nationalité.pdf"` (the file already exists in `/public/`).

---

### M7 — Add `datePublished` and `dateModified` to All Schemas *(1 hour)*

In `SEOHead.tsx`, add temporal metadata to Course, Organization, and FAQPage schemas:
```json
"datePublished": "2025-01-01",
"dateModified": "2026-03-08"
```

---

### M8 — Route-Based Code Splitting *(Code — half day)*

In Vite + React, implement `React.lazy` + `Suspense` for route-level splitting:
```typescript
const Quiz = React.lazy(() => import('./pages/Quiz'));
const ExamensBlancs = React.lazy(() => import('./pages/ExamensBlancs'));
const Parcours = React.lazy(() => import('./pages/Parcours'));
```

Target: reduce initial bundle from 422 KB to under 150 KB (compressed).

---

### M9 — Self-Host Google Fonts *(Performance — 1 hour)*

Download Inter, Playfair Display, JetBrains Mono WOFF2 files and serve from `/public/fonts/`. Replace Google Fonts CSS links with local `@font-face` declarations. Eliminates two external TCP connections (fonts.googleapis.com, fonts.gstatic.com).

---

### M10 — Update Sitemap with Language Variants *(30 minutes)*

**File:** [public/sitemap.xml](public/sitemap.xml)

Add language variant entries and fix non-www URLs:
```xml
<url>
  <loc>https://www.gocivique.fr/</loc>
  <xhtml:link rel="alternate" hreflang="fr" href="https://www.gocivique.fr/"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.gocivique.fr/?lang=en"/>
  <xhtml:link rel="alternate" hreflang="ar" href="https://www.gocivique.fr/?lang=ar"/>
  <priority>1.0</priority>
</url>
```

---

## LOW — Backlog

| Action | File | Effort |
|--------|------|--------|
| Add `Disallow: /dashboard` to robots.txt | [public/robots.txt](public/robots.txt) | 5 min |
| Fix robots.txt 302 redirect → serve directly from www | Cloudflare/server config | 15 min |
| Add `aggregateRating` to Course schema (once reviews collected) | [src/components/SEOHead.tsx](src/components/SEOHead.tsx) | 30 min |
| Add BreadcrumbList schema to /quiz, /parcours, /examens-blancs | [src/components/SEOHead.tsx](src/components/SEOHead.tsx) | 1 hr |
| Add `SoftwareApplication` schema to homepage | [src/components/SEOHead.tsx](src/components/SEOHead.tsx) | 30 min |
| Add `Livret du citoyen` PDF download to About page (prominent) | [src/pages/About.tsx](src/pages/About.tsx) | 30 min |
| Consolidate OG/Twitter meta tags into single block in index.html | [index.html](index.html) | 30 min |
| Add `Cache-Control: public, max-age=31536000, immutable` to hashed assets | Cloudflare | 15 min |
| Submit sitemap to Google Search Console | GSC dashboard | 5 min |
| Set up Google Search Console and verify property | GSC dashboard | 15 min |
| Create Twitter/X account @GoCivique if not active | External | — |
| Create Wikidata entity for GoCivique | wikidata.org | 30 min |
| Press/media outreach to immigration law blogs and OFII-adjacent sites | Marketing | ongoing |

---

## Summary by Sprint

### Sprint 0 — No-Code Fixes (Cloudflare Dashboard, ~1 hour total)
- [ ] Enable Brotli compression
- [ ] Fix HTTP redirect chain
- [ ] Add security headers (X-Frame-Options, Permissions-Policy, HSTS preload)
- [ ] Add `Cache-Control: immutable` to hashed assets

### Sprint 1 — Quick Code Fixes (1–2 days)
- [ ] Fix dynamic date in Terms.tsx and Privacy.tsx
- [ ] Remove /dashboard and /auth from sitemap.xml
- [ ] Fix Organisation `sameAs` in SEOHead.tsx
- [ ] Replace pravatar hero avatars with real images
- [ ] Fix Footer PDF link (`href="#"` → `/Nationalité.pdf`)
- [ ] Add AI crawler directives to robots.txt
- [ ] Fix hreflang duplication (remove from index.html, keep in SEOHead.tsx)
- [ ] Add `datePublished`/`dateModified` to schemas
- [ ] Rewrite FAQPage "how to prepare" opening

### Sprint 2 — Content & Legal (2–3 days)
- [ ] Create mentions légales page
- [ ] Create /llms.txt
- [ ] Add named author to About page and Course schema
- [ ] Switch to domain email (support@, dpo@)
- [ ] Fix `html lang` + RTL for Arabic
- [ ] Update sitemap to www URLs and add language variants
- [ ] Implement IndexNow

### Sprint 3 — Architecture Migration (1–2 weeks)
- [ ] Migrate to Next.js App Router (or add prerendering layer)
- [ ] Per-route `generateMetadata()` for title, description, canonical
- [ ] Inline JSON-LD as static HTML (FAQPage, Course, Organization, WebSite)
- [ ] Route-based code splitting (target: < 150 KB initial bundle)
- [ ] Self-host Google Fonts
- [ ] Remove root spinner, implement skeleton screens matching real layout
