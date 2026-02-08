
# Examen Civique 2026 -- Premium Ecosystem & Information Center

This plan covers four major areas: premium subscriber features, three exam difficulty levels, legal compliance, and header/footer expansion. Given the scope, this will be broken into manageable implementation steps.

---

## 1. Database Changes

A new migration will add a `difficulty_level` column to the `questions` table and an `exam_level` preference to `profiles`:

- **`questions` table**: Add `difficulty_level TEXT DEFAULT 'CSP'` with values `CSP`, `CR`, or `Naturalisation`. All existing 20 questions will default to `CSP`.
- **`profiles` table**: Add `weak_category TEXT` (computed on save) and `total_questions_seen INTEGER DEFAULT 0` to support the progression and weakness analytics.

---

## 2. Premium Subscriber Features

### 2a. Category Training Mode
- Create a new page **`/quiz?mode=training&category=History`** allowing subscribers to practice questions from a single category.
- Add a **Category Selector** component on the Dashboard with clickable cards for each of the 5 categories (Principles, Institutions, Rights, History, Living).
- When a category is selected, the quiz engine filters questions to only that category (no distribution quotas).
- Protected by a subscription check -- non-subscribers see the `SubscriptionGate` modal.

### 2b. Progression Bar
- Add a **Progression Bar** widget to the Dashboard showing `used_questions.length / total_questions_in_bank * 100%`.
- Query the total count from the `questions` table and compare against the user's `used_questions` array in their profile.
- Visual: a horizontal progress bar with percentage label (e.g., "42/80 questions completed -- 52%").

### 2c. Weakness Analytics ("Smart Pop-up")
- After each exam result is saved, compute the user's weakest category from their `exam_history` JSON.
- On the Dashboard, show an **alert banner** at the top when a weakness is detected (e.g., category score below 60%).
- The alert includes a direct "Practice this category" button that links to `/quiz?mode=training&category=X`.

### 2d. Training vs. Exam Mode Enforcement
Current behavior already partially implements this. The changes will enforce stricter rules:

- **Training Mode** (currently "Study Mode"):
  - Real-time feedback after each answer.
  - Explanations visible.
  - Translation button enabled.
  
- **Exam Mode**:
  - 45-minute timer.
  - No explanations shown during the test.
  - Translation button **hidden** (French-only).
  - No results shown until the "Submit" button is pressed at the end.
  - Modify `QuizQuestion.tsx` to conditionally hide `TranslateButton` when `mode === 'exam'`.

---

## 3. Three Exam Levels

### 3a. Type Definitions
Add a new type `ExamLevel = 'CSP' | 'CR' | 'Naturalisation'` to `src/lib/types.ts`.

### 3b. Level Selector UI
- Add a **level toggle** component (3 tabs/cards) shown before starting an exam on the Dashboard or a pre-quiz screen.
- Each level shows its name and a short description:
  - **CSP** (Carte de Sejour Pluriannuelle): "Standard -- valeurs republicaines fondamentales"
  - **CR** (Carte de Resident): "Avance -- institutions et contexte de residence"
  - **Naturalisation**: "Expert -- patrimoine, Constitution et histoire approfondie"
- Only subscribers can access CR and Naturalisation levels.

### 3c. Quiz Engine Integration
- The `selectQuestionsByDistribution` function will accept an optional `level` parameter.
- It filters the question pool by `difficulty_level` before applying the distribution quotas.
- Fallback: if not enough questions exist for a level, fill from the general pool (same as current behavior).

---

## 4. Legal Compliance & Footer

### 4a. Footer Enhancement
- Expand the footer in `Index.tsx` (and create a reusable `Footer.tsx` component used across all pages) with:
  - The legal disclaimer in a prominent, bordered box: *"Ce site n'est pas affilie au gouvernement francais. Il s'agit d'une plateforme d'entrainement privee pour l'Examen Civique."*
  - Links to: About, Pricing, Legal Notice.
  - Copyright notice.

### 4b. Landing Page Disclaimer
- Add the same disclaimer text on the landing page, positioned between the hero and pricing sections or just above the footer.

---

## 5. Header Expansion

### 5a. Pricing Link
- Add a "Tarifs" / "Pricing" link in the Header navigation that smooth-scrolls to `#pricing` on the landing page, or navigates to `/#pricing` from other pages.

### 5b. "About The Exam" Page
- Create a new **`/about`** page with official information about the French civic exam.
- Content sourced from the Ministry of Interior:
  - What is the Examen Civique?
  - Who must take it? (CSP, CR, Naturalisation candidates)
  - What it covers (values, institutions, rights, history, daily life)
  - Official pass threshold (80%)
  - Format (40 questions, 45 minutes, 4 options each)
  - Link to official government resources.
- Add an "A propos" link in the Header navigation.

---

## 6. New Files and Modified Files

### New Files
| File | Purpose |
|------|---------|
| `src/components/Footer.tsx` | Reusable footer with legal disclaimer |
| `src/components/CategorySelector.tsx` | Category training picker for dashboard |
| `src/components/WeaknessAlert.tsx` | Smart pop-up for weakest category |
| `src/components/LevelSelector.tsx` | CSP/CR/Naturalisation toggle |
| `src/pages/About.tsx` | Official exam information page |
| `supabase/migrations/[timestamp].sql` | Add `difficulty_level` column to questions |

### Modified Files
| File | Changes |
|------|---------|
| `src/lib/types.ts` | Add `ExamLevel` type, update `Question` interface |
| `src/lib/quizDistribution.ts` | Add `level` and `category` filter params |
| `src/pages/Quiz.tsx` | Enforce exam mode rules (hide translate, hide feedback), support `category` and `level` query params |
| `src/components/QuizQuestion.tsx` | Conditionally hide `TranslateButton` in exam mode |
| `src/pages/Dashboard.tsx` | Add progression bar, weakness alert, category training cards, level selector |
| `src/pages/Index.tsx` | Use new `Footer` component, add disclaimer section |
| `src/components/Header.tsx` | Add "Tarifs" and "A propos" navigation links |
| `src/App.tsx` | Add `/about` route |
| `src/contexts/LanguageContext.tsx` | Add new translation keys for all new UI text |
| `src/components/SubscriptionGate.tsx` | Update to mention category training and exam levels as premium features |

---

## 7. Implementation Order

Given the scope, implementation will proceed in this sequence:

1. **Database migration** -- Add `difficulty_level` column to questions.
2. **Types and quiz engine** -- Update types, add level/category filtering to distribution logic.
3. **Exam mode enforcement** -- Hide translations and feedback in exam mode.
4. **Footer and legal disclaimer** -- Create reusable Footer component.
5. **About page** -- Create the informational page with official exam details.
6. **Header updates** -- Add Pricing and About links.
7. **Dashboard enhancements** -- Progression bar, weakness alert, category selector, level selector.
8. **Translation keys** -- Add all new UI strings to the 6-language dictionary.

---

## Technical Notes

- The `difficulty_level` column will use a `TEXT` type with a `CHECK` constraint rather than an enum, to allow easy future expansion.
- Weakness calculation: iterate over `exam_history` entries, compute average score per category, identify the one with the lowest average. Only show the alert when the user has completed at least 2 exams and the weakest category is below 60%.
- The progression bar reads from `used_questions` (UUID array already in profiles) and compares against `SELECT COUNT(*) FROM questions`.
- Category training mode reuses the existing `Quiz.tsx` page with a `category` search param -- no separate page needed.
- All premium features (category training, CR/Naturalisation levels) check `is_subscribed` from the user's profile before proceeding.
