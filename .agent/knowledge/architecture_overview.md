# GoCivique Platform — Architecture Overview

## What Is This?
GoCivique (Citizen-Prep-Pro) is a **freemium SaaS web app** that helps immigrants prepare for France's mandatory **Examen Civique** (civic exam), required since January 1, 2026 for residence permits and naturalization.

Think of it like **Duolingo, but for French civic knowledge** — gamified learning paths, quiz modes, progress tracking, and tiered subscriptions.

---

## Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite (SWC plugin) |
| **Styling** | Tailwind CSS + Radix UI + shadcn/ui |
| **Animations** | GSAP + Tailwind custom keyframes (17 animations) |
| **Routing** | react-router-dom (16 lazy-loaded routes) |
| **State** | React hooks (no Redux/Zustand — custom hooks only) |
| **Backend** | Supabase (PostgreSQL + Auth + RLS + Edge Functions) |
| **Payments** | Stripe (via Supabase Edge Functions) |
| **i18n** | Custom `LanguageContext.tsx` (6 languages, ~65KB dictionary) |
| **Testing** | Vitest + Testing Library |
| **Font** | Inter (via Google Fonts) |

---

## Directory Structure

```
citizen-prep-pro/
├── .agent/               # AI agent skills & config
│   └── skills/examen_civique_francais/
├── public/               # Static assets
│   ├── demo_questions.csv    # 20-question offline fallback
│   ├── questions_V2.csv      # Full question bank (~2MB)
│   └── questions_mapped.csv  # Mapped/processed questions (~2MB)
├── scripts/              # Utility scripts
│   ├── create_migration.js
│   ├── map_csv.js
│   └── seed-lessons.sql
├── src/
│   ├── App.tsx            # Root: providers + router
│   ├── components/        # 87+ components
│   │   ├── learn/         # 11 dashboard components
│   │   ├── landing/       # Landing page components
│   │   └── ui/            # 49 shadcn/ui primitives
│   ├── contexts/
│   │   └── LanguageContext.tsx  # i18n (6 languages)
│   ├── hooks/             # 9 custom hooks
│   ├── integrations/supabase/  # Client + generated types
│   ├── lib/               # Utilities & type definitions
│   ├── pages/             # 17 page components
│   └── test/              # Vitest setup
├── supabase/
│   └── migrations/        # 18 SQL migrations
└── config files           # vite, tailwind, tsconfig, etc.
```

---

## Core Hooks (The Brain)

| Hook | Purpose | Lines |
|------|---------|-------|
| `useQuiz.ts` | 4-mode quiz engine (exam/study/training/demo) with CSV fallback | 235 |
| `useParcours.ts` | "Parcours 1→100" learning path with progress tracking | 149 |
| `useAuth.ts` | Supabase auth (Google OAuth + email/password) | 102 |
| `useSubscription.ts` | Reads subscription tier from profiles table | 57 |
| `useUserProfile.ts` | Persona-driven onboarding profile (goal, level, timeline) | 81 |
| `useClassDetail.ts` | Fetches individual class content + quiz questions | 134 |
| `useScrollAnimation.ts` | Intersection Observer for scroll-based animations | ~30 |
| `use-mobile.tsx` | Mobile breakpoint detection | ~20 |
| `use-toast.ts` | Toast notification system | ~100 |

---

## Routes (App.tsx)

| Path | Page | Access |
|------|------|--------|
| `/` | Landing page (Index) | Public |
| `/auth` | Login/Signup | Public |
| `/onboarding` | Persona selection wizard | Auth required |
| `/learn` | Learning Dashboard (main hub) | Auth required |
| `/parcours` | Parcours 1→100 curriculum map | Auth required |
| `/parcours/classe/:id` | Individual class detail + quiz | Auth required |
| `/quiz` | Quiz engine (all modes) | Mixed |
| `/results` | Legacy results page | Auth required |
| `/dashboard` | Legacy analytics dashboard | Auth required |
| `/progress` | Progress tracking | Auth required |
| `/exams` | Exam launcher | Auth required |
| `/analytics` | Analytics page | Auth required |
| `/about` | About page | Public |
| `/success` | Stripe payment success | Auth required |

---

## Quiz Engine Modes

1. **Exam Mode** — 20 questions, 45-min timer, no feedback, mimics real exam
2. **Study Mode** — No timer, instant feedback with explanations
3. **Training Mode** — Premium only, 50 questions from single category
4. **Demo Mode** — Offline, 20 questions from `demo_questions.csv`, no auth needed

### Question Level Cascade
- **CSP** → fetches only `CSP` questions
- **CR** → fetches `CR` + `CSP` questions
- **Naturalisation** → fetches `Naturalisation` + `CR` + `CSP` questions

---

## Monetization Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | €0 | 1 demo exam/day, first class of Parcours, limited access |
| **Standard** | €6.99/mo | Unlimited exams, full Study Mode, complete Parcours |
| **Premium** | €10.99/mo | Category Training, video guides, real-time translations |

Enforced by `SubscriptionGate.tsx` (intercepts routes) + `useSubscription.ts` hook reading `profiles.subscription_tier`.

---

## Design Language

- **Colors**: French tricolor — Primary `#0055A4` (deep blue), Destructive `#EF4135` (red)
- **Theme**: Dark mode default (`next-themes`), HSL CSS custom properties
- **Typography**: Inter font family
- **Animations**: 17 custom Tailwind keyframes (float, glow, confetti-fall, warp-in/out, heartbeat, glitch, etc.)
- **Components**: All from shadcn/ui + Radix UI primitives (49 UI components)
- **Icons**: lucide-react exclusively
- **Touch targets**: Minimum 48px (h-12) for mobile

---

## Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `VITE_SUPABASE_PROJECT_ID` | Project ID: `jblhxpzqbbarpqstcbvq` |
