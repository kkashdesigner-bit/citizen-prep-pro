

## Two-Tone Logo Text: "Go" in Red, "Civique" in White

Replace the logo image + plain text brand name with a styled text logo across the entire site. "Go" renders in red and "Civique" in white, creating a distinctive two-tone wordmark.

---

### What Changes

**1. Reusable Logo Component** (`src/components/Logo.tsx` -- new file)
- A simple component that renders the brand as styled text: `<span class="text-red-500 font-bold">Go</span><span class="text-white font-bold">Civique</span>`
- Accepts a `size` prop (sm, md, lg) for use in header, hero, footer, and auth
- Keeps the existing logo image (small icon) next to the text where appropriate, or replaces it entirely -- depending on context

**2. Files to Update**

| File | Change |
|------|--------|
| `src/components/Logo.tsx` | Create reusable two-tone logo component |
| `src/components/Header.tsx` | Replace `<img>` with Logo component (sm size) |
| `src/components/HeroSection.tsx` | Replace logo image + "GoCivique" text with Logo component (lg size) |
| `src/components/Footer.tsx` | Replace `<img>` with Logo component (sm size) |
| `src/pages/Auth.tsx` | Replace `<img>` with Logo component (md size) |
| `index.html` | Update `<title>` and og:title from "Lovable App" to "GoCivique" |

**3. Styling Details**
- "Go" -- `text-red-500` (or a custom red like `#EF4444`)
- "Civique" -- `text-white` (in dark mode), `text-foreground` (in light mode)
- Font: bold, tracking-tight, using the existing sans-serif (Inter)
- The logo image (`logo.png`) will still appear as a small icon beside the text in the header; in hero it is replaced by the larger text-only wordmark

**4. SEO / Meta**
- Update `index.html` title and Open Graph tags to say "GoCivique"

