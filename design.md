# GoCivique — Product & Engineering Design Reference

> **Purpose of this document.** A single, self-contained brief that tells any person or AI tool *everything important* about GoCivique: what it is, how it's built, the data model, every major feature, the business model, and the conventions to follow when changing it. Share this file with other tools to give them full project context.
>
> **Last updated:** 2026-06-20 · **Status:** current (supersedes the older `.agent/knowledge/architecture_overview.md`, which is stale on language count, pricing, and several newer features).

---

## 1. Product overview

**GoCivique** (repo name: `citizen-prep-pro`, production domain: **gocivique.fr**) is a **freemium SaaS web app** that helps immigrants prepare for France's mandatory **Examen Civique** — the civic-knowledge exam required since **January 1, 2026** for residence permits (carte de séjour pluriannuelle, carte de résident) and naturalisation.

Positioning: **"Duolingo for French civic knowledge."** Gamified learning paths, multiple quiz/exam modes, spaced repetition, progress tracking, a leaderboard, and tiered subscriptions.

- **Audience:** adult immigrants in France preparing for CSP (carte de séjour pluriannuelle), CR (carte de résident), or Naturalisation. Often non-native French speakers → heavy investment in translation.
- **Core value loop:** study lessons → practice questions → take mock exams → review mistakes → track readiness → pass the official exam.
- **Official content domains (5):** Principles and values of the Republic · Institutional and political system · Rights and duties · History, geography and culture · Living in French society.
- **Exam levels (content cascade):** `CSP` ⊂ `CR` ⊂ `Naturalisation` (a higher level includes the lower levels' questions).

---

## 2. Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite (SWC plugin) |
| Styling | Tailwind CSS + Radix UI + shadcn/ui |
| Animation | framer-motion (+ Tailwind keyframes); GSAP on marketing surfaces |
| Carousel | embla-carousel-react (mobile paywall, course cards) |
| Routing | react-router-dom, lazy-loaded routes (see `src/routes.tsx`) |
| State | React hooks only (no Redux/Zustand); TanStack Query provider present |
| Backend | Supabase — PostgreSQL + Auth + Row Level Security + Edge Functions + `pg_net` + `pg_cron` + Realtime |
| Payments | Stripe (Checkout links + webhook → Supabase) |
| Email | Resend API (transactional + branded template), sent server-side |
| SEO / prerender | Vercel Edge Middleware → Prerender.io (bot prerendering); react-helmet-async client-side |
| Hosting | Vercel (SPA, catch-all rewrite to `index.html`) |
| i18n | Custom `LanguageContext.tsx` single-file dictionary, **7 languages** |
| Testing | Vitest + Testing Library |
| Fonts | Inter (body) + Lexend (display) |

---

## 3. Architecture & directory structure

Single-page React app. Supabase is the system of record; the browser talks to it directly via the JS client (guarded by RLS) and to Stripe via Checkout. Server-side logic lives in Supabase Edge Functions and SQL functions; transactional email and some HTTP calls are issued from the database via `pg_net`.

```
citizen-prep-pro/
├── .agent/knowledge/        # (legacy) architecture + schema notes — partially stale
├── design-system/           # generated design-system docs (gocivique-courses)
├── public/                  # static assets (logo, mascot images, llms.txt, CSV fallbacks)
│   └── gocivique-logo-examen-civique.png   # brand logo (used in app + PDF exports)
├── middleware.js            # Vercel Edge Middleware — Prerender.io fail-open bot prerender
├── src/
│   ├── routes.tsx           # Router + global providers + SingleSessionGuard
│   ├── components/          # UI; ui/=shadcn primitives, learn/=dashboard, landing/=marketing
│   ├── contexts/LanguageContext.tsx   # i18n dictionary (7 langs) + ?lang= strategy
│   ├── hooks/               # custom hooks (quiz, parcours, auth, subscription, stats…)
│   ├── integrations/supabase/         # client + generated types
│   ├── lib/                 # types + utilities (incl. examPdf.ts)
│   └── pages/               # route-level pages
└── supabase/migrations/     # SQL migrations (RLS, functions, cron)
```

---

## 4. Routing map

Defined in `src/routes.tsx`. `ProtectedRoute` wraps authenticated routes; `<SingleSessionGuard />` mounts globally to enforce one active session.

| Path | Page | Access |
|------|------|--------|
| `/` | Landing (Index) | Public |
| `/auth`, `/auth/update-password` | Login / signup / reset | Public |
| `/onboarding` | Persona wizard (goal, level, timeline) | Auth |
| `/learn` | Learning Dashboard (main hub) | Auth |
| `/exams` | Exam launcher | Auth |
| `/quiz` | Quiz/exam engine (all modes via query params) | Auth |
| `/results` | Exam results + **downloadable PDF** | Auth |
| `/parcours`, `/parcours/classe/:id` | Parcours 1→100 map + class detail | Auth |
| `/courses` | Courses (lessons, flashcards, quiz, **fiche PDF**) | Auth |
| `/revision` | Per-category mistake review (Premium) | Auth |
| `/mastery` | Mastery/analytics | Auth |
| `/progress`, `/analytics` | Progress + analytics | Auth |
| `/settings` | Account + preferences | Auth |
| `/success` | Stripe payment success | Auth |
| `/about`, `/contact`, `/terms`, `/privacy`, `/refunds` | Static | Public |
| `/cours/:slug` | SEO course preview | Public |
| `/guide-examen-civique`, `/themes/*`, `/guides/*`, `/test-blanc-examen-civique`, `/naturalisation-examen-civique` | SEO content pages | Public |
| `*` | NotFound | Public |

---

## 5. Core hooks

| Hook | Responsibility |
|------|----------------|
| `useQuiz.ts` | The quiz/exam engine. Modes (exam/training/revision/demo), question selection, **fresh/unseen filtering off `user_answers`**, retake, scoring, writes results + full exam to `sessionStorage`, persists to `profiles.exam_history`. |
| `useParcours.ts` | "Parcours 1→100" path: classes, per-class progress, question counts. |
| `useClassDetail.ts` | One class: content markdown + its quiz questions (mapped via `class_questions`, else a random unseen pool excluding answered ids). |
| `useAuth.ts` | Supabase auth (Google OAuth + email/password); exposes user, displayName, avatarUrl. |
| `useSubscription.ts` | Reads tier; exposes `tier`, `isPremium`, `isStandardOrAbove`, `isTier1OrAbove`, `isTier2`. **`lifetime` counts as premium.** |
| `useUserProfile.ts` | Persona profile (goal/level/timeline, first_name, onboarding state). |
| `useDashboardStats.ts` | Aggregate stats: domain mastery, success rate, wrong-question count, weakness alerts, exam history. |

---

## 6. Data model (Supabase / PostgreSQL)

RLS is enabled on all user tables; reads/writes are scoped to `auth.uid()` unless a `SECURITY DEFINER` function widens access intentionally (e.g. leaderboard).

### Static content
- **`questions`** — the bank. Columns: `id`, `category` (one of the 5 official domains, CHECK-constrained), `subcategory`, `level` (`CSP`/`CR`/`Naturalisation`), `question_text`, `option_a..d`, `correct_answer` (option text or letter key — resolve via `getCorrectAnswerText()` in `src/lib/types`), `explanation`, `language`, plus `*_translated` columns. Note: both UUID and integer id schemas have coexisted; app-generated/synthetic rows use `id >= 9000` and are filtered out of some queries.
- **`classes`** — Parcours classes: `id`, `class_number`, `title`, `description`, `estimated_minutes`, `content` (markdown). (Linked to `learning_paths`.)
- **`class_questions`** — optional manual mapping of curated questions to a class.
- **`lessons`** / **`lesson_progress`** — theoretical modules + per-user lesson status (legacy-leaning; Parcours/classes is the active learning path).

### User state
- **`profiles`** — 1:1 with `auth.users`. `display_name`, `avatar_url`, `subscription_tier` (`'free'|'standard'|'premium'|'lifetime'`), `exam_history` (JSONB array of `ExamResult`), `preferred_language`, `is_test_account` (flag so internal/test subscribers are noticeable), legacy `is_subscribed`, legacy `used_questions`.
- **`user_profile`** — persona/onboarding: `first_name`, `goal_type` (`naturalisation`/`carte_resident`/`csp`), `level`, `timeline`, `onboarding_completed`.
- **`user_answers`** — every answer the user submits. **This is the source of truth for "fresh/unseen" filtering and for mistake/revision logic** (the legacy `profiles.used_questions` column was effectively empty and is no longer relied on). Used to compute wrong-but-never-right questions per category.
- **`user_class_progress`** — per-class `status`, `score`, `attempts_count`, `completed_at`.
- **`question_reviews`** — **SM-2 spaced-repetition** scheduling state per question (interval, ease, due date). Distinct from raw mistakes in `user_answers`.
- **`active_sessions`** — single-active-session enforcement (see §10). Realtime-watched.
- **`user_roles`** — `app_role` enum (`admin`/`user`) for admin gating.

### `ExamResult` (shape stored in `profiles.exam_history` and `sessionStorage`)
```ts
{
  id: string; date: string;            // ISO
  score: number; totalQuestions: number;
  answeredCount?: number; unansweredCount?: number;
  passed: boolean; timeSpent: number;   // seconds
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}
```

### Notable SQL functions / migrations (live)
- Leaderboard **`SECURITY DEFINER`** functions (so users can see ranked peers despite per-row RLS), with **other-user name masking** (Strava-style: full name for self, censored for others, e.g. `Marie D.`) and an **objectif (goal_type) join**.
- `active_sessions` single-session table + policies.
- `is_test_account` flag column.
- `handle_new_user()` (auto-create profile), `update_updated_at_column()`, `has_role()`.
- Email/HTTP issued from DB via `pg_net` `net.http_post` (used because the sandbox couldn't reach the Resend API directly).

---

## 7. Feature catalog

### 7.1 Auth & onboarding
Google OAuth + email/password (Supabase). New users go through a persona wizard (`/onboarding`) capturing goal, level, and timeline, which personalizes the dashboard's "next best action."

### 7.2 Quiz / exam engine (`useQuiz.ts`, `src/pages/Quiz.tsx`)
Modes are driven by query params (`mode`, `category`, `limit`, `classId`, `retake`):
- **Exam (blanc):** full mock exam (e.g. `mode=exam&limit=40`), timed, **pass threshold 80%** (`score/total ≥ 0.8`).
- **Training:** category-scoped practice (`mode=training&category=…&limit=…`).
- **Revision:** wrong-but-never-right questions, optionally category-scoped (`mode=revision&category=…`).
- **Demo:** offline fallback from CSV (no auth).
- **Parcours class quiz:** launched with `classId`; **pass threshold 70%**.

Selection prefers **fresh/unseen** questions by excluding ids already in `user_answers`. On finish, the engine writes to `sessionStorage`: `quizResults` (the `ExamResult`), `quizErrors` (wrong questions w/ options, correct answer, explanation), `quizQuestionIds` + `quizMode` (for retake), `quizClassId`, and **`quizExam`** (the full ordered exam with each question's options, correct answer, the user's selected answer, and correct flag — powers the PDF export). Results persist to `profiles.exam_history`.

### 7.3 Exam results + downloadable PDF (`src/pages/Results.tsx`, `src/lib/examPdf.ts`)
Results screen shows score, per-category breakdown, and an expandable "your mistakes" review. It offers **"Télécharger l'examen (PDF)"** with two options:
- **Avec réponses** — correction sheet: correct answer in green ✓, the user's wrong pick in red ✗, plus explanations and the score line.
- **Sans réponses** — a blank exam (questions + A–D options only) for re-practice.

Implementation: a zero-dependency **print-to-PDF** — `openExamPdf()` builds a branded HTML document (tricolore accent bar, **logo top-right**, gocivique.fr footer) in a new window and triggers `window.print()` (user saves as PDF). **Gating: Standard & above** (lifetime included); free users hit the upgrade gate. Data comes from `sessionStorage.quizExam`, falling back to `quizErrors`.

### 7.4 Parcours 1→100 (`/parcours`)
A guided 100-class curriculum mapped across the domains. Each class has content, an inline quiz, and progress tracking (`user_class_progress`); the dashboard surfaces the next incomplete class.

### 7.5 Courses (`/courses`, `src/pages/CoursesPage.tsx`)
Browsable lessons (the same `classes`), filterable by 10 UI modules (mapped to class-number ranges) and searchable. A course's detail view has tabs: **Contenu** (markdown fiche), **Flashcards** (auto-extracted key terms), **Quiz Rapide** (inline quiz over the class's questions), **Documents**. At the **end of the lesson** there is a **"Télécharger la fiche d'examen (PDF)"** block (`FicheDownload`) exporting that class's questions — **with or without answers** — so learners can study offline without taking the quiz. Same branded PDF helper; **Standard & above**.

### 7.6 Revision (`/revision`, `src/pages/RevisionPage.tsx`)
**Premium-only** per-category mistake review. Shows the 5 domains with per-category mistake counts (from `user_answers`) and a toggle between **mes erreurs** (→ `/quiz?mode=revision&category=…`) and **toutes les questions** (→ `/quiz?mode=training&category=…&limit=20`). The dashboard's "Révisez vos erreurs" card routes here.

### 7.7 Spaced repetition
`question_reviews` implements **SM-2** scheduling (interval/ease/due) as a complement to raw mistake review.

### 7.8 Leaderboard
Ranks users by progress. Served by `SECURITY DEFINER` functions so peers are visible despite RLS; **other users' names are masked** (full name for self only), and each entry shows the user's **objectif** (goal_type). Test accounts are flagged via `is_test_account`.

### 7.9 Dashboard & mastery
`/learn` is the hub: greeting, readiness gauge, an interactive animated "fire/streak" stats section, domain mastery, weakness alerts, and a personalized **Next Action** card. `/mastery` and `/progress` drill into per-domain performance.

---

## 8. Monetization & entitlements

Freemium with a deliberate **price-anchoring** structure (a high one-time "lifetime" anchor next to a cheap annual plan).

| Tier | Price | Notes |
|------|-------|-------|
| **Free** | €0 | Limited daily practice; capped question pool (RLS limits the free pool, ~202 questions); paywalled premium surfaces. |
| **Standard** | monthly (Stripe price) | Unlimited exams, full study/training. |
| **Premium** | monthly (Stripe price) | Everything: category training, translations, **PDF exports**, revision, etc. |
| **Annual** | **~€29/yr** | Cheap recurring anchor vs. lifetime. |
| **Lifetime** | **€99 one-time** | Inflated anchor; **grants premium-level features** (`isStandardOrAbove`/`isPremium` both true). |

- Exact monthly figures are configured via **Stripe price/product IDs** (env + webhook mapping), not hard-coded in the UI; treat Stripe as the source of truth.
- **Entitlement flow:** Stripe Checkout → webhook → Supabase updates `profiles.subscription_tier`. Yearly/premium products map to `'premium'`; lifetime maps to a premium-equivalent tier.
- **Enforcement:** `useSubscription.ts` reads the tier; `SubscriptionGate.tsx` renders the paywall (mobile = swipable embla cards with a single confirm CTA; desktop = 3-up grid). Pass `requiredTier="standard"` or `"premium"` to gate a surface.
- **Do not** hard-delete or move money / execute Stripe writes casually; the Stripe **webhook secret is managed manually by the owner** — do not touch it.

---

## 9. (reserved)

---

## 10. Anti-account-sharing — single active session

A real risk given the lifetime tier: users sharing one account after passing. Mitigation:
- **`active_sessions`** table records the current session per user; **`SingleSessionGuard`** (mounted globally in `routes.tsx`) subscribes via Supabase **Realtime** and signs out older sessions when a newer login appears — so an account is usable on one device at a time.
- Terms/Privacy include lifetime-liability and account-sharing clauses backing this up.

---

## 11. Internationalization

- **7 languages:** `fr` (French, source), `en`, `ar` (RTL), `es`, `pt`, `zh`, `tr`.
- **Single-file dictionary** in `src/contexts/LanguageContext.tsx`: every key has one entry per language block; balanced counts are maintained (audited so each key appears 7×).
- **URL strategy:** `?lang=` query param; hreflang alternates emitted for SEO.
- **Preferred-language switcher:** a Globe dropdown in the dashboard/sidebar header (`LearnSidebar.tsx`) and marketing header; the dashboard switcher is **session-only** (doesn't overwrite the saved `preferred_language`).
- Questions carry `*_translated` columns for translated content; UI strings come from the dictionary via `t('key')`.
- **Convention:** never leave raw keys (e.g. `dashboard.greeting.morning`) or English strings on French surfaces — add the key to all 7 blocks.

---

## 12. SEO & discoverability

- **Root problem solved:** as an SPA, crawlers received an empty shell. Fixed with **Vercel Edge Middleware (`middleware.js`)** that routes bots to **Prerender.io** (fail-open: if prerender fails, serve the SPA). Build-time headless Chrome prerender was abandoned — Vercel's build image lacks `libnss3`, so react-snap / `@sparticuz/chromium` / puppeteer all failed.
- **`public/llms.txt`** — spec-compliant (llmstxt.org), curated markdown links + `## Optional` section, to guide LLM crawlers.
- **`react-helmet-async`** (`SEOHead.tsx`) for client-side titles/meta; results pages use `noindex`.
- **Dedicated SEO content pages** under `/guides/*`, `/themes/*`, plus `/cours/:slug` previews, targeting examen-civique queries.
- DMARC alignment was corrected for deliverability.

---

## 13. Email & branding

- **Resend API** for transactional mail, sent **server-side** (issued from the DB via `pg_net` because the build sandbox can't reach `api.resend.com`).
- A **reusable GoCivique-branded email template** wraps messages (logo + tricolore). French subject + body for French users.
- **Operational note:** API keys must be rotated if they ever pass through a chat/log.

---

## 14. Design language & design system

- **Brand colors (French tricolore):** Primary **`#0055A4`** (deep blue), Accent/Destructive **`#EF4135`** (red), white. (Some marketing/design-system docs reference a brighter blue `#2563EB`/`#135bec`; the app's canonical primary is `#0055A4`.)
- **Theme:** light is the default (`next-themes`, `defaultTheme="light"`); dashboard uses CSS custom properties (`--dash-card`, `--dash-card-border`, `--dash-surface`, `--dash-text`, `--dash-text-muted`).
- **Typography:** Inter (body), Lexend (display/headings).
- **Components:** shadcn/ui + Radix primitives; **icons exclusively from `lucide-react`** (no emoji-as-icon).
- **Motion:** framer-motion; spring transitions; respect `prefers-reduced-motion`.
- **Accessibility:** WCAG AA targets — ≥4.5:1 text contrast, visible focus states, ≥48px touch targets, discernible names on icon buttons (`aria-label` + sr-only text), responsive at 375/768/1024/1440.
- `design-system/gocivique-courses/MASTER.md` holds a generated, playful "claymorphism/bento" course-design language; the production app is more restrained/professional — when they conflict, follow the live app conventions above.

---

## 15. PDF export module — `src/lib/examPdf.ts`

Shared, dependency-free exam→PDF helper used by both the results screen and the courses page.

- **`ExamPdfItem`** — `{ questionText, options[], selectedAnswer?, correctAnswer, category, explanation? }`.
- **`questionsToExamItems(questions)`** — maps raw DB `Question[]` → items (no user answers; for course fiches).
- **`openExamPdf(items, { title, subtitle?, withAnswers })`** — builds branded HTML (logo top-right via `${origin}/gocivique-logo-examen-civique.png`, tricolore accent bar, `gocivique.fr` footer), opens a new window, and calls `window.print()` so the user saves a PDF. `withAnswers=true` marks the correct option green ✓, the user's wrong pick red ✗, and includes explanations; `withAnswers=false` outputs a blank exam.
- **Branding note:** the on-page heading no longer prefixes "GoCivique —"; the logo carries the brand.
- **Gating:** callers restrict to Standard & above and show the upgrade gate otherwise.

---

## 16. Deployment & environment

- **Hosting:** Vercel. SPA with catch-all rewrite to `index.html`; `middleware.js` runs at the edge for bot prerender. Pushes to `main` auto-deploy.
- **Build constraint:** the Vercel build image **cannot run headless Chrome** (missing `libnss3`) — never reintroduce build-time browser prerender.
- **Local dev:** `npm install` → `npm run dev` (http://localhost:8080).
- **Frontend env (`.env`):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, Stripe link/product IDs (`VITE_STRIPE_*`). Prerender token is set as a Vercel **Environment Variable**.
- **Supabase:** Edge Functions via `supabase functions deploy`; secrets via `supabase secrets set` (e.g. `STRIPE_SECRET_KEY`). Migrations under `supabase/migrations/`.

---

## 17. Key file map

| File | Role |
|------|------|
| `src/routes.tsx` | Router, providers, global `SingleSessionGuard` |
| `src/pages/Quiz.tsx` + `src/hooks/useQuiz.ts` | Quiz/exam engine |
| `src/pages/Results.tsx` | Exam results + PDF export buttons |
| `src/lib/examPdf.ts` | Shared branded exam→PDF helper |
| `src/pages/CoursesPage.tsx` | Courses + `FicheDownload` (end-of-lesson PDF) |
| `src/pages/RevisionPage.tsx` | Per-category mistake review (Premium) |
| `src/components/SubscriptionGate.tsx` | Paywall (mobile carousel / desktop grid) |
| `src/hooks/useSubscription.ts` | Tier + entitlement booleans |
| `src/contexts/LanguageContext.tsx` | i18n dictionary (7 languages) |
| `src/components/learn/LearnSidebar.tsx` | Dashboard nav, language switcher, profile card |
| `src/components/SingleSessionGuard.tsx` | Single-active-session enforcement |
| `middleware.js` | Vercel edge prerender (Prerender.io, fail-open) |
| `public/llms.txt` | LLM crawler guidance |

---

## 18. Conventions & guardrails for contributors (human or AI)

- **Pass thresholds:** exam blanc **80%**, parcours class **70%**.
- **Fresh/mistake logic reads `user_answers`**, not `profiles.used_questions` (legacy/empty).
- **Synthetic questions** use `id >= 9000`; filter them out of user-facing pools where appropriate.
- **Gate features** with `SubscriptionGate` + `useSubscription`; remember **lifetime = premium**.
- **i18n:** add every new string to all 7 language blocks; never ship raw keys or English on French surfaces.
- **Icons:** lucide-react only. **Colors:** canonical primary `#0055A4`, accent `#EF4135`.
- **Never** reintroduce build-time headless-Chrome prerender (Vercel lacks `libnss3`).
- **Never** hard-delete data, change the Stripe webhook secret, or perform money movements automatically — surface these to the owner.
- **Secrets** that pass through logs/chat must be rotated.

---

## 19. Glossary

- **Examen Civique** — France's mandatory civic exam (since 2026-01-01) for residence/naturalisation.
- **Parcours 1→100** — the 100-class guided curriculum.
- **Fiche** — a printable study/exam sheet (here, the per-lesson question PDF).
- **CSP / CR / Naturalisation** — exam levels (carte de séjour pluriannuelle / carte de résident / naturalisation), nested in difficulty.
- **Examen blanc** — a mock/practice exam.
