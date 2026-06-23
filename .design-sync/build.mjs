#!/usr/bin/env node
// design-sync buildCmd: produce the two source-derived artifacts the converter
// can't generate itself for this repo (a Vite app, not a published library):
//
//   1. _ds_bundle.css  — the app's Tailwind/shadcn styles, pre-compiled into one
//      static stylesheet (the converter copies cfg.cssEntry verbatim; it does not
//      run Tailwind). Brand fonts ride along as a Google-Fonts @import, mirroring
//      the app's index.html (→ validate reports [FONT_REMOTE], informational).
//
//   2. .cache/dts/**  — real .d.ts files emitted from the component source via
//      tsc, so <Name>Props carries the actual shadcn API (variant/size enums,
//      asChild, inherited HTML attrs) instead of an `unknown` stub. The converter
//      reads prop types only from .d.ts files under the repo root, so this is the
//      one way to give the design agent an accurate API contract here.
//
// Both outputs are gitignored (.design-sync/.cache/) and regenerated each sync,
// so they never need committing. Reproducible: re-sync re-runs this first.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, statSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const cacheDir = resolve(root, ".design-sync/.cache");
const cssOut = resolve(cacheDir, "ds-tailwind.css");
// Emitted under the (gitignored) dist/ rather than .design-sync/.cache/: the
// converter's .d.ts scan uses fast-glob with dot:false, so it never descends
// into a dot-directory. dist/types is exactly what findTypesRoot returns.
const dtsOut = resolve(root, "dist/types");
const bin = (n) => resolve(root, "node_modules/.bin/", n);
mkdirSync(cacheDir, { recursive: true });

// ── 1. Tailwind → static stylesheet ───────────────────────────────────────
execFileSync(
  bin("tailwindcss"),
  ["-c", ".design-sync/tailwind.ds.ts", "-i", "src/index.css", "-o", cssOut, "--minify"],
  { stdio: "inherit", cwd: root },
);
const fontImport =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');\n";
let css = readFileSync(cssOut, "utf8");
if (!css.includes("fonts.googleapis.com")) writeFileSync(cssOut, fontImport + css);
console.error(`[ds-css] ${cssOut} — ${(statSync(cssOut).size / 1024).toFixed(0)} KB (+ brand-font @import)`);

// ── 2. tsc → component declarations ────────────────────────────────────────
// emitDeclarationOnly + noEmitOnError:false means the .d.ts files are written
// even though unrelated app code has type errors, so tsc's non-zero exit is
// expected here — we proceed and assert the declarations landed.
rmSync(dtsOut, { recursive: true, force: true });
try {
  execFileSync(bin("tsc"), ["-p", ".design-sync/tsconfig.dts.json"], { stdio: "pipe", cwd: root });
} catch {
  /* type errors in app source don't block declaration emit — see note above */
}
let dtsCount = 0;
try {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) =>
    e.isDirectory() ? walk(resolve(d, e.name)) : e.name.endsWith(".d.ts") && dtsCount++);
  walk(dtsOut);
} catch { /* dtsOut missing — handled below */ }
if (!dtsCount) {
  console.error("[ds-dts] ERROR: no .d.ts emitted — component props would fall back to stubs");
  process.exit(1);
}

// 2b. Synthesize a `<Name>Props` alias per component into an index.d.ts. Many
//     shadcn components declare their props inline (no exported `<Name>Props`),
//     and the converter only extracts props it can find as a named interface/
//     alias — so without this they'd emit an `{ [key]: unknown }` stub. Aliasing
//     via React.ComponentProps<typeof X> recovers the real contract (variants,
//     Radix props, inherited HTML attrs). Components that DO ship a native
//     `<Name>Props` (Button, Badge) keep it — their own .d.ts is scanned first.
const cfg = JSON.parse(readFileSync(resolve(root, ".design-sync/config.json"), "utf8"));
const imports = ['import * as React from "react";'];
const aliases = [];
for (const [name, srcPath] of Object.entries(cfg.componentSrcMap ?? {})) {
  if (typeof srcPath !== "string") continue;
  const rel = "./" + srcPath.replace(/^src\//, "").replace(/\.[tj]sx?$/, "");
  imports.push(`import { ${name} as _${name} } from "${rel}";`);
  // ...WithoutRef: forwardRef components otherwise surface a noisy `ref` prop
  // (React's DO_NOT_USE callback-ref type) that the design agent never sets.
  aliases.push(`export type ${name}Props = React.ComponentPropsWithoutRef<typeof _${name}>;`);
}
writeFileSync(resolve(dtsOut, "index.d.ts"), imports.concat("", aliases).join("\n") + "\n");
console.error(`[ds-dts] ${dtsOut} — ${dtsCount + 1} declaration file(s) (+ synthesized index.d.ts: ${aliases.length} prop aliases)`);
