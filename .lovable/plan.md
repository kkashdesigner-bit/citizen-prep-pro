

## Comprehensive Polish Pass for Citizen Prep Pro

This plan audits every page and component against the specification and fills the gaps. Most of the application is already built; this plan focuses on what is missing or incomplete.

### 1. Show All 5 Category Cards on Landing Page

**File:** `src/components/LandingCategoryTabs.tsx`

Currently only displays 3 categories (Principles, Institutions, Living). Add the missing two: **Rights** (with a Shield icon) and **History** (with a Clock/Scroll icon). Each card gets a translated description and a study-mode link.

### 2. Fix Progress Tracker for Guests

**File:** `src/components/LandingPassProbability.tsx`

Currently shows dummy/fake data (75% pass, 12 exams, 78% avg) when no user is logged in. Replace this with a sign-up invitation card that says "Create an account to track your progress" (translated), with a CTA button to `/auth`. Only show real statistics when the user is logged in.

### 3. Internationalize the About Page

**File:** `src/pages/About.tsx`

All text is currently hardcoded in French. Add ~20 translation keys for every string on this page and use `t()` calls throughout. Add translations for all 6 languages.

### 4. Internationalize the Dashboard Page

**File:** `src/pages/Dashboard.tsx`

Several labels are hardcoded in French ("Progression globale", "Statut actuel", "Activité récente", etc.). Replace with `t()` calls and add the corresponding translation keys.

### 5. Internationalize Remaining Hardcoded Strings

**File:** `src/contexts/LanguageContext.tsx`

Add missing translation keys across all 6 languages for:
- About page content (~20 keys)
- Dashboard labels (~15 keys)
- Category card descriptions (5 keys)
- Landing progress section (~5 keys)
- Footer branding update
- Auth page: password reset link text
- SubscriptionGate modal texts

### 6. Add Password Reset Flow to Auth Page

**File:** `src/pages/Auth.tsx`

Add a "Forgot password?" link below the password field in login mode. When clicked, show a simple form that calls `supabase.auth.resetPasswordForEmail()` with a success toast. Add the corresponding translation keys.

### 7. Update Branding in Footer

**File:** `src/components/Footer.tsx`

Replace the "EC" icon and "Examen Civique" text with the GoCivique logo image (same as Header), keeping the footer compact.

### 8. Update Branding on Auth Page

**File:** `src/pages/Auth.tsx`

Replace the "EC" square icon and "Examen Civique 2026" text with the GoCivique logo.

### 9. Internationalize Category Descriptions

**File:** `src/components/LandingCategoryTabs.tsx`

The category card descriptions are hardcoded in French. Add translation keys per category and use `t()`.

### 10. Internationalize SubscriptionGate Modal

**File:** `src/components/SubscriptionGate.tsx`

All feature texts and CTAs are hardcoded in French. Add translation keys and use `t()`.

---

### Summary of Files Changed

| File | Change |
|------|--------|
| `src/contexts/LanguageContext.tsx` | Add ~60 new translation keys across all 6 languages |
| `src/components/LandingCategoryTabs.tsx` | Add Rights + History cards, use `t()` for descriptions |
| `src/components/LandingPassProbability.tsx` | Replace dummy guest data with sign-up prompt |
| `src/pages/About.tsx` | Full internationalization with `t()` calls |
| `src/pages/Dashboard.tsx` | Replace hardcoded French with `t()` calls |
| `src/pages/Auth.tsx` | Add password reset flow, update branding to logo |
| `src/components/Footer.tsx` | Replace "EC" branding with GoCivique logo |
| `src/components/SubscriptionGate.tsx` | Internationalize all text |

### What Is NOT Changing

- Database schema (no changes needed)
- Quiz engine, timer, question distribution logic
- Results page (already internationalized)
- Header (already updated with logo)
- Theme toggle (already working)
- Supabase integration (already configured)
- Core routing structure

