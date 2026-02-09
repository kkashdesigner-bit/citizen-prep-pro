

# Cinematic Redesign -- "The Future of France" Edition

A complete visual overhaul transforming the current gov-tech aesthetic into a dark, cinematic, Netflix-style experience with glassmorphism, glow effects, particle animations, and immersive quiz interactions.

---

## Summary of Changes

The redesign touches every visual surface of the app while preserving all existing functionality (routing, auth, subscription gating, quiz logic). The core changes are:

1. **New dark color system** (Midnight Navy base)
2. **Glassmorphism card styles** throughout
3. **Animated particle mesh background** on the landing page
4. **Staggered letter-by-letter hero title reveal**
5. **Quiz "warp speed" transitions** and animated answer feedback (green pulse / red glitch)
6. **"Classified File" paywall** with blurred content and pulsing unlock button
7. **Glow-on-hover effects** for all interactive cards

---

## What Will Change

### 1. Color System and Base Styles (`src/index.css`)

Replace the current dark theme CSS variables with a Midnight Navy palette:

- `--background`: Midnight Navy (`#020617` / `222.2 84% 4.9%`)
- `--card`: slightly lighter navy with transparency for glass effect
- `--primary`: Electric Blue (`#3B82F6` / `217 91% 60%`)
- `--foreground`: near-white
- All shadow variables updated to use blue-tinted glows instead of neutral shadows
- New CSS utility classes:
  - `.glass-card` -- frosted glass effect (`bg-white/5 backdrop-blur-xl border border-white/10`)
  - `.glow-hover` -- on hover, emit a soft Electric Blue box-shadow
  - `.pulse-unlock` -- rhythmic pulse + shining border animation for the paywall button
  - `.glitch` -- brief CSS glitch/static effect for incorrect answers
  - `.heartbeat` -- single pulse animation for correct answers
  - `.warp-enter` / `.warp-exit` -- fast slide + blur for quiz transitions
  - `.letter-reveal` -- staggered letter animation
  - `.shine-border` -- moving gradient border animation

### 2. Tailwind Config (`tailwind.config.ts`)

Add new keyframes and animation utilities:

- `heartbeat` -- scale 1 to 1.05 and back with green glow
- `glitch` -- rapid translateX jitter + opacity flicker
- `warp-out` -- translateX(-100%) + blur(4px) fast
- `warp-in` -- translateX(100%) to 0 + blur clearing
- `shine` -- moving gradient along border
- `pulse-glow` -- rhythmic box-shadow pulse for unlock button
- `letter-pop` -- opacity 0 to 1 + slight translateY per letter

### 3. Particle Mesh Background (`src/components/ParticleMesh.tsx`) -- NEW

A new component using an HTML Canvas element:

- Renders ~80 small dots drifting slowly across the screen
- Draws connecting lines between nearby dots (< 120px apart)
- Dots nearest the mouse cursor get brighter and connect more strongly (parallax-like reactivity)
- Colors: Electric Blue dots, faint blue connection lines
- Lightweight: uses `requestAnimationFrame`, cleans up on unmount
- Placed behind the hero section on the landing page

### 4. Hero Section (`src/components/HeroSection.tsx`)

- Remove the static background image and gradient overlay
- Add `ParticleMesh` as the background layer
- Replace the instant title reveal with a **letter-by-letter staggered animation**:
  - Split the title string into individual `<span>` elements
  - Each letter gets a CSS animation delay (e.g., 30ms increments)
  - Animation: fade in + slight translateY upward
- Subtitle and CTAs still use the existing staggered delay approach but with updated timing
- Update all colors to use the new Electric Blue primary and white text on dark
- The icon container and CTA buttons get the new `glow-hover` effect
- Keep the HeroIllustration (celebrating man + confetti) but update its glow/shadow to match blue theme

### 5. Header (`src/components/Header.tsx`)

- Update background to use glassmorphism: `bg-background/60 backdrop-blur-xl border-b border-white/10`
- Logo badge: change from solid `bg-primary` to a glowing blue variant
- All nav buttons get subtle glow on hover

### 6. Landing Category Cards (`src/components/LandingCategoryTabs.tsx`)

- Replace `Card` styling with `.glass-card` class
- Add `.glow-hover` effect: on hover, cards emit a soft blue box-shadow from behind
- Icon containers get a subtle blue glow ring

### 7. Landing Pass Probability (`src/components/LandingPassProbability.tsx`)

- Cards become glassmorphism styled
- The progress ring gets a blue glow effect
- Stats cards get hover glow

### 8. Pricing Section (`src/components/PricingSection.tsx`)

- Cards use glassmorphism
- The "popular" card gets a permanent subtle glow border
- CTA buttons get the `glow-hover` pulse effect

### 9. Quiz Page -- Cinematic Transitions (`src/pages/Quiz.tsx`)

- Wrap `QuizQuestion` in a transition container that applies:
  - On question change: current question slides out left with blur (warp-out, ~200ms), new question slides in from right with blur clearing (warp-in, ~200ms)
  - Use React state + CSS classes to toggle between `warp-exit` and `warp-enter`
- The sticky progress bar becomes glassmorphism styled
- Navigation dots get glow effects

### 10. Quiz Question -- Answer Feedback (`src/components/QuizQuestion.tsx`)

- **Correct answer**: When feedback shows, the correct option card gets:
  - A green glow box-shadow
  - A single `heartbeat` CSS animation (scale up slightly, glow pulse, return)
- **Incorrect answer**: When feedback shows, the wrong option card gets:
  - A `glitch` CSS animation (rapid jitter + opacity flicker for ~300ms)
  - Then settles into the red border state
- Answer option buttons become glass-styled with subtle borders
- The explanation box gets glassmorphism treatment

### 11. Subscription Gate / Paywall (`src/components/SubscriptionGate.tsx`)

- Redesign as a "Classified File" aesthetic:
  - Dialog background: deep dark with a "TOP SECRET" stamp-like header graphic (CSS-only, using pseudo-elements with rotated red text and border)
  - Content behind the gate appears heavily blurred (visual only -- the gate is a dialog)
  - The "Subscribe now" / unlock button gets:
    - `pulse-glow` animation (rhythmic box-shadow expansion)
    - `shine-border` animation (a light gradient sweeping across the border continuously)
  - Pricing cards inside become glass-styled

### 12. Premium Video Guides (`src/components/PremiumVideoGuides.tsx`)

- Cards become glass-styled with glow-on-hover
- Locked cards show a stronger blur overlay
- The lock icon pulses subtly

### 13. Dashboard (`src/pages/Dashboard.tsx`)

- All stat cards become glassmorphism
- Glow hover on interactive cards
- The locked category overlay uses heavier blur + the "Classified" aesthetic

### 14. Results Page (`src/pages/Results.tsx`)

- Result card becomes glassmorphism
- Pass/fail header section gets a glow effect (green for pass, red for fail)

### 15. Auth Page (`src/pages/Auth.tsx`)

- Card becomes glassmorphism on a dark background
- Input fields get subtle blue border glow on focus

### 16. Footer (`src/components/Footer.tsx`)

- Glass-style background with subtle top border glow

### 17. Sound Design Placeholders

- Add a `src/lib/sounds.ts` utility file with placeholder functions:
  - `playHoverSound()` -- no-op with comment "// Add whoosh.mp3"
  - `playCorrectSound()` -- no-op with comment "// Add correct.mp3"
  - `playIncorrectSound()` -- no-op with comment "// Add incorrect.mp3"
- Wire these into the quiz answer handler and hover events (as no-ops for now)

---

## Technical Details

### Files to Create

1. **`src/components/ParticleMesh.tsx`** -- Canvas-based particle animation component with mouse reactivity
2. **`src/lib/sounds.ts`** -- Sound effect placeholder functions

### Files to Modify

3. **`src/index.css`** -- New dark color variables, glass/glow/glitch/heartbeat/warp/shine utility classes
4. **`tailwind.config.ts`** -- New keyframes (heartbeat, glitch, warp-in, warp-out, shine, pulse-glow, letter-pop) and corresponding animation utilities
5. **`src/components/HeroSection.tsx`** -- ParticleMesh background, letter-by-letter title reveal, updated colors
6. **`src/components/Header.tsx`** -- Glassmorphism navbar
7. **`src/components/LandingCategoryTabs.tsx`** -- Glass cards + glow hover
8. **`src/components/LandingPassProbability.tsx`** -- Glass cards + glow hover
9. **`src/components/PricingSection.tsx`** -- Glass cards + glow effects
10. **`src/pages/Quiz.tsx`** -- Warp-speed question transitions
11. **`src/components/QuizQuestion.tsx`** -- Heartbeat (correct) and glitch (incorrect) answer feedback animations
12. **`src/components/SubscriptionGate.tsx`** -- "Classified File" redesign with pulsing unlock button and shine border
13. **`src/components/PremiumVideoGuides.tsx`** -- Glass cards + blur lock overlay
14. **`src/pages/Dashboard.tsx`** -- Glass cards throughout
15. **`src/pages/Results.tsx`** -- Glass result card with glow header
16. **`src/pages/Auth.tsx`** -- Glass login card + glowing input focus
17. **`src/components/Footer.tsx`** -- Glass footer styling
18. **`src/components/AnimatedSection.tsx`** -- No changes needed (existing scroll animations work with new theme)

### Typography Note

The plan uses the existing Inter / Playfair Display fonts with increased size and weight on headings (applied via Tailwind classes like `text-5xl md:text-7xl font-black uppercase tracking-tighter`). Clash Display / Monument Extended are proprietary paid fonts that cannot be loaded from Google Fonts. The existing Playfair Display serif font at large bold sizes achieves a comparable cinematic "movie title" feel. If you have a license for Clash Display, it can be swapped in later via the font-family CSS variable.

### Performance Considerations

- The particle mesh uses `requestAnimationFrame` and limits to ~80 particles -- lightweight enough for mobile
- All CSS animations use `transform` and `opacity` only (GPU-accelerated)
- The warp transition uses CSS classes toggled via state, not re-mounting components
- Glass blur effects use `backdrop-filter` which is well-supported in modern browsers

