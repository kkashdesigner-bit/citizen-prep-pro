

## Redesign the Dashboard Page

The current `/dashboard` page already exists and has extensive functionality. This plan redesigns it to match the requested layout with three distinct sections: a Header Card, a Progress Section with 3 cards, and feature gating for free users.

### What Changes

**1. Rewrite `src/pages/Dashboard.tsx`**

Replace the current flat layout with the new 3-section structure while preserving all existing data fetching, auth guarding, and subscription logic.

- **Header Card**: A prominent card at the top displaying the user's avatar (from `profiles.avatar_url`), display name (from `profiles.display_name`, falling back to email), and a tier badge:
  - `free` -- Grey badge ("Free Plan")
  - `tier_1` -- Blue badge ("Essential")
  - `tier_2` -- Gold/amber badge ("Premium")

- **Progress Section (3 cards in a row)**:
  - **Card 1 -- Overall Progress**: A circular progress ring (built with SVG) showing the percentage of questions answered (`usedQuestions.length / totalQuestionCount`).
  - **Card 2 -- Current Status**: Shows "On Track" (with a green indicator) if `avgScore >= 70`, or "Needs Practice" (with a yellow/red indicator) otherwise.
  - **Card 3 -- Recent Activity**: Lists the last 3 exam history entries with scores (e.g., "Quiz: 80%"). If the user is `free`, this card gets a blurred "Locked" overlay with a "Start Free Trial" button that opens the existing `SubscriptionGate`.

- **Remaining sections** (Weakness Alert, Level Selector, Category Training, Video Guides, Full Exam History) stay below, kept as-is.

**2. Update `src/lib/subscriptionTiers.ts`**

Update `TIER_LABELS` to use the new display names:
- `free` -> "Free Plan"
- `tier_1` -> "Essential"
- `tier_2` -> "Premium"

Update `TIER_BADGE_VARIANT` to differentiate visually (tier_2 gets `"destructive"` variant which we'll style as gold, or use a custom className approach).

**3. Fetch additional profile fields**

Update the `fetchData` query in Dashboard to also select `display_name, avatar_url, email` from `profiles` so the Header Card can display them.

**4. Create `src/components/CircularProgress.tsx`**

A small SVG-based circular progress component that renders a ring with the percentage in the center. This replaces the linear progress bar for the "Overall Progress" card.

### Technical Details

- **No database changes needed** -- all data (`display_name`, `avatar_url`, `email`, `exam_history`, `used_questions`, `subscription_tier`) already exists in the `profiles` table.
- **No new dependencies** -- the circular progress ring will be a simple SVG component using Tailwind classes.
- **Existing components reused**: `Header`, `Footer`, `SubscriptionGate`, `WeaknessAlert`, `ProgressionBar`, `CategorySelector`, `LevelSelector`, `PremiumVideoGuides`.
- The locked overlay pattern already exists in the current Dashboard (used on Category Training); the same pattern with blur + Lock icon + CTA button will be applied to the Recent Activity card.
- Badge color for "Premium" (tier_2) will use a custom `className` with amber/gold colors (`bg-amber-500/20 text-amber-400 border-amber-500/30`).

