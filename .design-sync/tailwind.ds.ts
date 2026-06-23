// Tailwind config for the design-sync CSS build (see .design-sync/build-css.mjs).
// Reuses the app's real Tailwind setup via `presets` (theme tokens, the
// tailwindcss-animate plugin, darkMode, prefix) and only widens `content` so
// the compiled stylesheet also covers the classes used by the authored preview
// cards in .design-sync/previews/. `content` is never inherited from a preset,
// so it is restated in full here.
import base from "../tailwind.config";

export default {
  presets: [base],
  content: [
    "./src/**/*.{ts,tsx}",
    "./index.html",
    "./.design-sync/previews/**/*.tsx",
  ],
};
