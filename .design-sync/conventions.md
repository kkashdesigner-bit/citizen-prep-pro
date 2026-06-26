# GoCivique UI — how to build with this design system

A set of React primitives from **GoCivique** (a French civic-exam prep SaaS), built on
Radix UI + Tailwind CSS with CSS-variable tokens (shadcn/ui style). Components are exposed on
the bundle global **`window.GoCiviqueUI`** (e.g. `window.GoCiviqueUI.Button`); reference them by
name in design code. Light theme is the default.

## Setup & wrapping
- **No global provider is needed for most components** — the design tokens are CSS variables on
  `:root`, shipped in `styles.css`. Make sure `styles.css` is loaded and colors/fonts are correct.
- **Tooltip is the exception**: wrap Tooltip usage in `<TooltipProvider>` (one near the root is
  fine), otherwise it throws "Tooltip must be used within TooltipProvider".
- **Font** is **Inter** (bundled — no network needed). **Dark mode**: put `class="dark"` on an
  ancestor element; every token has a dark value.

## Styling idiom — Tailwind utilities + semantic token classes
Style with Tailwind classes, and **always use the semantic token classes for color — never
hard-coded hex.** The brand vocabulary (all verified present in `styles.css`):

| Purpose | Classes | Notes |
|---|---|---|
| Primary action | `bg-primary text-primary-foreground` | brand blue `#0055A4` |
| Danger / errors | `bg-destructive text-destructive-foreground` | tricolore red `#EF4135` |
| Secondary surface | `bg-secondary text-secondary-foreground` | pale blue-grey |
| Muted surface / text | `bg-muted` · `text-muted-foreground` | subtle backgrounds, secondary copy |
| Accent | `bg-accent text-accent-foreground` | brighter blue |
| Surfaces | `bg-background text-foreground` · `bg-card` · `bg-popover` | page / card / popover |
| Lines & focus | `border-border` · `border-input` · `ring-ring` | borders, focus rings |
| Radius | `rounded-md` · `rounded-2xl` (cards) · `rounded-full` (buttons, badges) | base `--radius: 0.75rem` |

Shape conventions: **buttons and badges are pill-shaped (`rounded-full`); cards use `rounded-2xl`**
with a soft shadow. `Button` takes `variant` (`default`/`secondary`/`outline`/`ghost`/`destructive`/`link`)
and `size` (`sm`/`default`/`lg`/`icon`); `Badge` and `Alert` take `variant`. Icons come from
`lucide-react`.

## Where the truth lives
- `styles.css` and its `@import` closure (`fonts/fonts.css`, `_ds_bundle.css`) — the exact tokens.
- Each component's `.prompt.md` (usage + examples) and `.d.ts` (props) under `components/`.

## Idiomatic build snippet
```tsx
// components available on window.GoCiviqueUI
<Card className="max-w-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Institutions françaises</CardTitle>
      <Badge>Premium</Badge>
    </div>
    <CardDescription>12 questions · niveau Naturalisation</CardDescription>
  </CardHeader>
  <CardContent className="text-sm text-muted-foreground">
    Président de la République, Assemblée nationale, Sénat.
  </CardContent>
  <CardFooter className="gap-2">
    <Button variant="outline">Réviser</Button>
    <Button>Passer l'examen</Button>
  </CardFooter>
</Card>
```
