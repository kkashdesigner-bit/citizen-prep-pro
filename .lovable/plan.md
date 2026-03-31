

# Complete Site Audit — Findings & Fix Plan

## Issues Found

### 1. Broken Navigation Links (404 errors)

**`/progress` route does not exist** but is linked from two places:
- `src/pages/AnalyticsPage.tsx` line 29 — "Voir ma progression" button navigates to `/progress`
- `src/components/learn/DashboardLeftColumn.tsx` line 42 — "View all" button navigates to `/progress`

The `ProgressPage.tsx` file exists but is **not registered in `routes.tsx`**. The page was removed from navigation dropdowns but these two references remain.

**Fix:** Either add `/progress` route to `routes.tsx` (wrapped in `ProtectedRoute`), or redirect these buttons to `/learn` or `/analytics`.

---

### 2. Footer Broken Link

`src/components/Footer.tsx` line 50 — The "Livret du citoyen" link uses `href="#"` (goes nowhere). Should point to `/Nationalité.pdf` which exists in `/public/`.

---

### 3. AppHeader Dropdown — "Paramètres" Goes to Wrong Route

`src/components/AppHeader.tsx` line 122 — The "Paramètres" dropdown item navigates to `/learn` instead of `/settings`. This is likely a copy-paste error from the previous "Progression" removal.

---

### 4. Console Warning — SubscriptionGate Ref Issue

`SubscriptionGate` is a function component being passed a ref by `PricingSection`. Needs `React.forwardRef` wrapping or the ref usage removed.

---

### 5. AnalyticsPage Is a Dead-End Stub

`AnalyticsPage.tsx` only shows a single button pointing to the broken `/progress` route. The sidebar lists it but it provides no value. Should either be fleshed out or redirect to `/learn`.

---

### 6. Sidebar Navigation Missing "Analyses" Route

`LearnSidebar.tsx` does not include `/analytics` in its NAV_ITEMS — the AnalyticsPage is accessible only via direct URL. This is either intentional (removed feature) or an oversight.

---

## Implementation Plan

### Step 1 — Register `/progress` route in routes.tsx
Add the missing route: `{ path: "progress", element: <ProtectedRoute><ProgressPage /></ProtectedRoute> }` and the lazy import.

### Step 2 — Fix AppHeader "Paramètres" navigation
Change line 122 from `navigate('/learn')` to `navigate('/settings')`.

### Step 3 — Fix Footer PDF link
Change `href="#"` to `href="/Nationalité.pdf"` on the booklet link.

### Step 4 — Fix SubscriptionGate ref warning
Wrap the `SubscriptionGate` component with `React.forwardRef` to eliminate the console warning.

### Step 5 — Fix AnalyticsPage stub
Update the button in AnalyticsPage to navigate to `/progress` (now a valid route).

### Technical Details

| File | Change | Lines |
|------|--------|-------|
| `src/routes.tsx` | Add lazy import + route for ProgressPage | ~28, ~88 |
| `src/components/AppHeader.tsx` | Fix Paramètres nav → `/settings` | 122 |
| `src/components/Footer.tsx` | Fix booklet href → `/Nationalité.pdf` | 50 |
| `src/components/SubscriptionGate.tsx` | Wrap with `forwardRef` | 10-15, export |

