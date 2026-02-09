

# Landing Page Animation Overhaul

This plan upgrades every section of the landing page with a cinematic, sequenced animation system -- from the navbar fade-in on page load, through staggered hero reveals, to scroll-triggered section animations with counting effects and hover micro-interactions.

---

## What Will Change

### 1. Navbar Fade-In on Page Load
The header will subtly fade in and slide down from the top when the page first loads. This only applies on the landing page (Index route) so it does not affect navigation on other pages.

- Add a `loaded` state with a short delay (similar to the hero pattern)
- Apply `opacity-0 -translate-y-2` initially, transitioning to `opacity-100 translate-y-0`

### 2. Enhanced Hero Animation Sequence
The hero section already has staged animations. This will refine the timing and add:

- **Icon**: Appears first with a scale + fade (already exists, will refine timing)
- **Headline**: Fades in and slides up after the icon (delay ~200ms)
- **Subtitle**: Fades in after the headline (delay ~400ms)
- **CTA Buttons**: Slide up from the bottom with a slight bounce effect (delay ~600ms), plus a brief glow on the button borders
- **Hero Illustration**: Add a decorative SVG illustration (book with rising bars and upward arrow) that slides in from the right, with bars that "grow" upward and a gentle floating animation after entry

### 3. Feature Cards (LandingCategoryTabs) -- Staggered Slide-In
The category section currently uses `AnimatedSection` but all tabs appear together. This will:

- Convert the 5 category buttons into 3 featured cards ("Principes Republicains", "Histoire & Institutions", "Vie Quotidienne en France") that slide in from the bottom with staggered delays (0ms, 150ms, 300ms)
- Each card gets a subtle fade-in combined with the slide-up
- Keep the existing category description panel and training button below

### 4. Dashboard Preview (LandingPassProbability) -- Animated Entry
- The `PassProbabilityRing` already animates its fill from 0% to the target value. Will ensure it only starts animating when scrolled into view (using intersection observer state)
- The stat cards (Examens passes, Score moyen, Seuil officiel) will slide up with staggered delays
- The progress bar will animate its fill from left to right when entering the viewport

### 5. Pricing/Paywall Section -- Animated Entry
- Cards slide up and fade in with staggered delays (already partially implemented)
- Add a subtle "lock" shimmer icon effect on the pricing section heading

### 6. Bottom Progress Bar
- The global progress bar at the bottom of the page will animate its fill from 0% to 50% when it scrolls into view

### 7. Hover Effects (Global)
Add consistent hover micro-interactions throughout:

- **Buttons**: Gentle scale-up (`scale(1.03)`) and a subtle glowing border shadow on hover
- **Cards**: Slight lift (`translateY(-3px)`) with a more pronounced shadow on hover
- Apply these via Tailwind utility classes added to the relevant components

---

## Technical Details

### Files to Modify

1. **`src/components/Header.tsx`**
   - Accept an optional `animate` prop (boolean)
   - When `animate=true`, use a `loaded` state + `useEffect` timer to trigger fade-in from top
   - Wrap the header content in transition classes

2. **`src/pages/Index.tsx`**
   - Pass `animate` prop to `<Header />`

3. **`src/components/HeroSection.tsx`**
   - Add an SVG illustration component (book with rising bars + arrow) that slides in from the right
   - Add CSS keyframes for bar growth animation and gentle floating bob
   - Refine button animation with a brief glow/border shimmer using a CSS animation
   - Adjust delay timings for the cinematic sequence: icon (0ms), headline (200ms), subtitle (400ms), buttons (600ms), illustration (800ms)

4. **`src/components/LandingCategoryTabs.tsx`**
   - Restructure into 3 feature cards (Principes, Histoire, Vie Quotidienne) instead of 5 tab buttons
   - Each card uses `AnimatedSection` with staggered `delay` (0, 150, 300)
   - Cards include icons + descriptions and link to study mode

5. **`src/components/LandingPassProbability.tsx`**
   - Connect `PassProbabilityRing` animation trigger to the `AnimatedSection` visibility state
   - Add a `useScrollAnimation` hook to detect when the ring enters the viewport, then start the ring fill animation
   - Stagger stat cards entry (100ms, 200ms, 300ms)
   - Animate the bottom progress bar fill from 0% when scrolled into view

6. **`src/components/PassProbabilityRing.tsx`**
   - Add an optional `startAnimation` prop that controls when the fill animation begins (defaults to `true` for backward compatibility)

7. **`src/components/PricingSection.tsx`**
   - Add a lock icon with shimmer/glow animation near the section heading
   - Enhance card hover effects with `hover:-translate-y-1 hover:shadow-lg` (partially exists)

8. **`tailwind.config.ts`**
   - Add new keyframes: `float` (gentle bobbing), `glow` (border shimmer), `grow-bar` (bar chart growth), `shimmer` (lock icon effect)
   - Add corresponding animation utilities

9. **`src/index.css`**
   - Add `.hover-lift` utility class for card hover (translate + shadow)
   - Add `.btn-glow` utility class for button hover glow effect

### Animation Timing Summary

```text
Page Load (t=0)
  |
  +-- Navbar fades in (0-300ms)
  |
  +-- Hero icon scales in (100-800ms)
  +-- Hero headline slides up (300-1000ms)
  +-- Hero subtitle slides up (500-1200ms)
  +-- Hero buttons slide up + glow (700-1400ms)
  +-- Hero illustration slides in from right (900-1600ms)
  |     +-- Bars grow upward (1100-1800ms)
  |     +-- Arrow draws/lights up (1400-2000ms)
  |     +-- Gentle float loop begins
  |
  [User scrolls down]
  |
  +-- Feature Card 1 slides up (on enter)
  +-- Feature Card 2 slides up (+150ms)
  +-- Feature Card 3 slides up (+300ms)
  |
  +-- Dashboard Preview slides up (on enter)
  |     +-- Ring fills 0% -> 75% (on enter, 1200ms)
  |     +-- Stat cards stagger in (+100/200/300ms)
  |     +-- Progress bar fills left-to-right (on enter)
  |
  +-- Pricing cards slide up (on enter, staggered)
  |     +-- Lock icon shimmer effect
  |
  +-- Bottom progress bar fills 0% -> 50% (on enter)
```

### Hover Effects (applied globally)

- Buttons: `transition-transform duration-200 hover:scale-[1.03]` + glow box-shadow
- Cards: `transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg`

