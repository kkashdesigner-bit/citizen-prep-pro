# design-sync notes — GoCivique UI

Repo-specific gotchas for future syncs. This is an **app** (`vite_react_shadcn_ts`), not a
component library, so the sync uses a hand-written entry + synth-style bundling.

## Build shape (package, synth-from-source)
- No library `dist/` exists — only `vite build` (app bundle). So the converter bundles the
  curated primitives straight from `src/` via a hand-written entry: **`.design-sync/entry.tsx`**
  (`export *` of the 19 scoped `src/components/ui/*` files).
- `--entry .design-sync/entry.tsx` is what makes `PKG_DIR` resolve to the **repo root**
  (the converter walks up from the entry to the nearest named `package.json`). Without
  `--entry`, `PKG_DIR` would be `node_modules/gocivique-ui` (doesn't exist) → `[NO_DIST]`.
- `cfg.tsconfig: tsconfig.json` lets esbuild resolve the `@/*` alias (→ `./src/*`).
- `window.GoCiviqueUI` carries every named export (components + sub-parts like CardHeader).
- `exported PascalCase symbols: 0` in the build log is expected (no `.d.ts` to scan; the
  component list comes from `componentSrcMap`). Non-fatal.

## CSS / tokens
- shadcn components are styled by Tailwind utility classes, so `cssEntry` must be a
  **compiled** stylesheet, not raw `@tailwind` directives. Source: **`.design-sync/tailwind-input.css`**
  (mirrors the `:root`/`.dark` token blocks of `src/index.css` — **keep in step with it**).
- Regenerate before every build (compiled.css is gitignored):
  ```
  npx tailwindcss -c tailwind.config.ts -i .design-sync/tailwind-input.css -o .design-sync/compiled.css \
    --content "./src/components/ui/{button,card,badge,alert,input,label,tabs,accordion,checkbox,switch,dialog,select,avatar,progress,tooltip,separator,skeleton,radio-group,textarea}.tsx,./.design-sync/previews/**/*.tsx"
  ```
  The `--content` is narrowed to the 19 synced files (+ previews) on purpose — scanning all
  of `src/components/ui` pulls in `--sidebar-*`/navigation-menu classes that reference
  undefined vars (the `[TOKENS_MISSING]` noise).

## Font (brand fidelity)
- The app loads **Inter** from Google Fonts at runtime (index.html `<link>`). A remote
  `@import` does NOT load in the preview/render sandbox (offline) → fallback font + screenshot
  hangs. So Inter is **self-hosted**: `@fontsource-variable/inter` woff2 copied to
  `.design-sync/fonts/inter-latin-variable.woff2` (committed), wired via
  `cfg.extraFonts: .design-sync/fonts.css`. Confirmed `document.fonts.check('Inter') === true`.
- On a fresh clone, re-install the font source into the staged deps before rebuild:
  `npm --prefix ./.ds-sync i @fontsource-variable/inter` (only needed if the committed woff2 is missing).

## Overlays
- `cfg.overrides`: Dialog & Tooltip use `cardMode: single` + a viewport so the open state
  renders inside the card. Their previews use `defaultOpen`; Tooltip is wrapped in
  `TooltipProvider` (required, else it throws "must be used within TooltipProvider").
- Select previews render **closed with a `defaultValue`** (the open dropdown positions via
  Popper measurement, unreliable in a static card) — the styled trigger is the showcase.

## Known render warns (triaged, not new on re-sync)
- `[FONT_REMOTE]` no longer fires (self-hosted). `[TOKENS_MISSING]` should be empty/minimal
  with the narrowed content scope; any `--radix-*` runtime var is expected-absent.
- React dev "unique key prop" warnings in the console come from the card-render harness /
  Radix internals, not the authored previews — benign.
- Screenshots via the preview MCP **time out** in this sandbox (capture mechanism, not the
  render). Verify via `preview_eval` (computed styles/text/dims) instead.

## RESOLVED — Progress color bug (fixed 2026-06-22)
- **`src/components/ui/progress.tsx`** previously used invalid CSS colors: `bg-[hsl(220,25,92)]`
  and `bg-[hsl(192,31,58)]` — missing `%` on saturation/lightness, so Tailwind dropped them and
  the Progress track + fill rendered transparent (invisible) in the app AND the DS card.
  Fixed in-session to `bg-[hsl(220,25%,92%)]` (track) and `bg-[hsl(192,31%,58%)]` (indicator).
  Verified: track `rgb(230,233,240)`, fill `rgb(115,168,181)`, fills at the authored values.
  (Did NOT switch to token classes `bg-secondary`/`bg-primary` — kept the original design intent.)

## Re-sync risks
- `tailwind-input.css` duplicates `src/index.css`'s token values — if the brand palette changes
  in `index.css`, update `tailwind-input.css` too (no automatic link).
- `compiled.css`, `.ds-sync/`, and the font source in `.ds-sync/node_modules` are gitignored /
  regenerated; the committed inputs are `config.json`, `entry.tsx`, `tailwind-input.css`,
  `fonts.css`, `fonts/inter-latin-variable.woff2`, `previews/`, `conventions.md`, this file.
- Previews import from `'gocivique-ui'` (the `cfg.pkg`), aliased to `window.GoCiviqueUI` at
  preview-compile time. Sub-components (CardHeader, DialogContent…) are available there too.
