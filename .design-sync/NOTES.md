# design-sync notes — gocivique-ui (citizen-prep-pro)

Repo-specific gotchas for future syncs. Read this first.

## Shape & wiring
- **Not a published component library** — this is a Vite + React app (Lovable
  `vite_react_shadcn_ts` template). There is no `dist/` and no shipped `.d.ts`.
  The bundle is synthesized from source via `.design-sync/entry.tsx` (a curated
  re-export of the shadcn/ui primitives) passed as `--entry`.
- Component discovery has no `.d.ts` to read, so `cfg.componentSrcMap` **pins
  every synced component** to its `src/components/ui/*.tsx` file. To add/remove a
  synced component, edit both `entry.tsx` (so it's in the bundle) and
  `componentSrcMap` (so it gets a card).
- Previews import from `"gocivique-ui"` (= `cfg.pkg`) → shimmed to
  `window.GoCiviqueUI` at preview-compile time. `globalName` is pinned because
  it wouldn't auto-derive to that casing from the pkg name.

## Package manager
- **Use `npm ci`** (package-lock.json is canonical and in sync — 511 packages).
- `bun install --frozen-lockfile` **FAILS** here: `bun.lock`/`bun.lockb` are
  stale (resolve only ~4 packages). Don't switch to bun without regenerating
  the bun lockfiles first.

## Styling (shadcn + Tailwind) — the important one
- Components are styled entirely by **Tailwind utility classes** (via cva/cn).
  Those classes only exist after Tailwind scans the source, and the converter
  **does not run Tailwind** — it copies `cfg.cssEntry` verbatim.
- So `cfg.buildCmd` (`node .design-sync/build.mjs`) **pre-compiles** Tailwind
  into `.design-sync/.cache/ds-tailwind.css` (gitignored, regenerated each sync),
  and `cfg.cssEntry` points at it. It uses `.design-sync/tailwind.ds.ts`, which
  `presets` the app's real `tailwind.config.ts` and widens `content` to also scan
  `.design-sync/previews/**` so authored-preview classes are emitted.

## Type contracts (.d.ts)
- The same `build.mjs` also emits **real declarations** via `tsc -p
  .design-sync/tsconfig.dts.json` into `dist/types/` (gitignored). The converter
  reads prop types only from `.d.ts` files under the repo root, and `findTypesRoot`
  returns `dist/types` — so without this, every `<Name>Props` is an `{ [key]:
  unknown }` stub. (It must NOT go in `.design-sync/.cache/`: the converter's
  `.d.ts` scan uses fast-glob `dot:false` and never descends into a dot-dir.)
- build.mjs then writes `dist/types/index.d.ts` aliasing each component's props
  via `React.ComponentPropsWithoutRef<typeof X>` (read from `componentSrcMap`).
  Many shadcn components declare props inline (no exported `<Name>Props`), so this
  alias is what recovers their real contract (variants, Radix props, HTML attrs).
  `...WithoutRef` avoids a noisy `ref` prop. Result: all 19 contracts are real.
- Design tokens are CSS custom properties in `src/index.css` (`:root` light +
  `.dark`), compiled into the stylesheet via its `@layer base`. `darkMode` is
  class-based (`.dark`); previews render the light theme (default `:root`).

## Fonts
- Brand fonts: **Inter** (primary sans), **JetBrains Mono** (mono), **Playfair
  Display** (display). The app loads them from Google Fonts via `<link>` in
  `index.html`. We replicate that with a Google-Fonts `@import` prepended to the
  compiled CSS (see build.mjs) → expect validate's **`[FONT_REMOTE]`**
  (informational). `cfg.runtimeFontPrefixes` covers the three families as a
  backstop so no `[FONT_MISSING]` fires.

## Render verification (browser)
- A headless browser is **pre-provisioned at `/opt/pw-browsers`** (chromium build
  **1194**). The Playwright CDN is blocked, so `playwright install chromium`
  FAILS — don't try to download. Instead install the matching client
  (`playwright@1.56.x`, which pins build 1194) into `.ds-sync/` and run validate/
  capture with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. (The latest playwright
  pins 1228, which has no local browser — version must match.)

## Git
- `.design-sync/` is **gitignored wholesale** in this repo; durable inputs are
  force-added (`git add -f`) — the prior run did this for `entry.tsx` and
  `previews/`. Do the same for `config.json`, `NOTES.md`, `conventions.md`,
  `build.mjs`, `tailwind.ds.ts`, `tsconfig.dts.json`, and `previews/`.

## Verification findings (surfaced to the user)
- **DS bug — `Button` `secondary` variant is illegible.** `button.tsx` ships
  `bg-secondary text-white`, but the `--secondary` token is near-white
  (`216 33% 97%`), so white-on-near-white text can't be read. Faithfully
  reproduced in the bundle/cards (not altered — syncing ships the real code). Fix
  belongs in the repo: `text-secondary-foreground` instead of `text-white`.
- **Tooltip open state can't be captured statically.** Radix Popper overlays
  (tooltip/popover/select-open) don't size in a static headless screenshot
  (Dialog works because it centers via CSS, not Popper). The `Tooltip` preview
  therefore shows the trigger (help affordance); the full open composition is in
  its `.prompt.md`.
- **Avatar remote image** falls back to initials in the sandbox (image host is
  network-gated) — expected; the fallback path is what renders.

## Known render warns (triaged — re-syncs should not treat as new)
- `[TOKENS_MISSING]` for `--radix-*` (accordion-content-height, toast-swipe-*,
  navigation-menu-viewport-height) + `--sidebar-width`, `--skeleton-width`,
  `--color-border`, `--color-bg`: these are set at runtime by Radix/components,
  not by a shipped stylesheet. Non-blocking; renders verified clean.

## Re-sync risks (watch-list)
- **Tailwind vocabulary is JIT-scoped.** The compiled CSS only contains classes
  used in `src/**` + `.design-sync/previews/**`. A design the agent builds using
  a Tailwind class that appears nowhere in that scan will render unstyled. The
  conventions header enumerates the shipped semantic vocabulary; if the design
  agent needs broader coverage, add a `safelist` to `tailwind.ds.ts`.
- **Remote font dependency.** Rendered designs need network access to load the
  Google fonts. If that's ever unacceptable, self-host the woff2s via
  `cfg.extraFonts` instead of the remote `@import`.
- **`.d.ts` depends on `tsc` emit succeeding.** If a future shadcn upgrade makes
  `tsconfig.dts.json` emit no declarations (build.mjs hard-fails `[ds-dts]`), or
  the `index.d.ts` aliases stop resolving, contracts silently regress to stubs —
  watch the `[ds-dts]` count and spot-check one `<Name>.d.ts` after a bump.
- **`componentSrcMap` is the component roster.** Adding a primitive to
  `entry.tsx` without adding it to `componentSrcMap` (or vice-versa) means it's in
  the bundle but has no card, or has a card but isn't bundled. Keep them in sync.
- Stale bun lockfiles (see above).
