

# Tiered Subscription System

This plan introduces a 3-tier subscription model (`free`, `tier_1`, `tier_2`) replacing the current binary `is_subscribed` boolean, with feature gating throughout the app.

---

## What Will Change

### 1. Database -- No Migration Needed
The `profiles` table already has a `subscription_tier` (text, nullable) column. We will standardize on using this column with values `'free'`, `'tier_1'`, `'tier_2'` (null treated as `'free'`). The existing `is_subscribed` boolean will remain for backward compatibility but the new tier logic takes precedence.

### 2. Subscription Tier Hook (`useSubscription`)
A new hook that provides the current user's tier and convenience helpers:

- `tier`: `'free' | 'tier_1' | 'tier_2'`
- `isTier1OrAbove`: boolean (tier_1 or tier_2)
- `isTier2`: boolean (tier_2 only)
- Reads from the `profiles` table, fetched once and cached

### 3. Dashboard Page Updates
- **Header**: Show a tier badge (Free / Tier 1 / Tier 2) next to the welcome message
- **Category Grid**: Free users see a "Locked" overlay with an upgrade CTA; Tier 1+ can click categories
- **Premium Video Guides Section**: New section visible to all, but clickable only for Tier 2 users. Tier 1 users clicking it see a "Tier 2 Required" upgrade wall dialog
- **Level Selector**: Uses `isTier1OrAbove` instead of `isSubscribed` for CR/Naturalisation levels

### 4. Translation Button -- Tier 2 Gating
- If user is Tier 2: translation works as-is (dropdown to select language)
- If user is Free or Tier 1: show the translate button with a Lock icon; clicking opens a modal explaining translation is a Tier 2 feature with a "Subscribe now" link to the pricing page

### 5. Updated Subscription Gate
- Refactor `SubscriptionGate` to accept a `requiredTier` prop (`'tier_1' | 'tier_2'`) so it can show tier-specific messaging
- Two variants of copy: one for "Upgrade to Tier 1" and one for "Upgrade to Tier 2"

---

## Technical Details

### Files to Create

1. **`src/hooks/useSubscription.ts`**
   - Fetches `subscription_tier` from `profiles` for the current user (via `useAuth`)
   - Returns `{ tier, isTier1OrAbove, isTier2, loading }`
   - Treats `null` or missing values as `'free'`

### Files to Modify

2. **`src/pages/Dashboard.tsx`**
   - Replace `isSubscribed` checks with `useSubscription()` hook
   - Add a `Badge` next to the page title showing the current tier
   - Category grid: wrap in a locked overlay when `tier === 'free'`
   - Add a "Premium Video Guides" section after the category training card:
     - 3 placeholder video cards (mock titles like "Les symboles de la Republique", "La Constitution expliquee", "Preparer l'entretien")
     - If user is not Tier 2, clicking a card opens `SubscriptionGate` with `requiredTier='tier_2'`
   - Level selector: pass `isTier1OrAbove` instead of `isSubscribed`

3. **`src/components/SubscriptionGate.tsx`**
   - Add optional `requiredTier` prop (default `'tier_1'`)
   - Conditionally render different title/description:
     - Tier 1: current messaging (study mode, unlimited exams, etc.)
     - Tier 2: "Unlock Translation Tools, Premium Video Guides, and advanced features"
   - "Subscribe now" button navigates to pricing page (`/#pricing`)

4. **`src/components/TranslateButton.tsx`**
   - Accept a new `userTier` prop (or use `useSubscription` directly)
   - If not Tier 2: show button with Lock icon, on click open a `SubscriptionGate` dialog with `requiredTier='tier_2'`
   - If Tier 2: existing behavior (language dropdown + translation)

5. **`src/components/QuizQuestion.tsx`**
   - Pass tier info to `TranslateButton` (either directly or let TranslateButton fetch it internally)

6. **`src/components/LevelSelector.tsx`**
   - Change `isSubscribed` prop to accept tier-based boolean (interface stays the same, just the parent passes `isTier1OrAbove`)

7. **`src/components/CategorySelector.tsx`**
   - No changes needed -- gating logic stays in the Dashboard parent

### Tier Logic Summary

```text
Feature                    Free    Tier 1    Tier 2
-----------------------------------------------------
Dashboard access           Yes     Yes       Yes
Category training          No      Yes       Yes
CR / Naturalisation levels No      Yes       Yes
Study mode                 No      Yes       Yes
Unlimited exams            No      Yes       Yes
Translation tool           No      No        Yes
Premium Video Guides       No      No        Yes
```

### Component Flow for Gating

```text
User clicks locked feature
       |
       v
  Check user tier
       |
  +----+----+
  |         |
 Has      Doesn't
 access    have access
  |         |
  v         v
 Allow    Show SubscriptionGate
 action   (with requiredTier prop)
            |
            v
         "Subscribe now"
         -> /#pricing
```

