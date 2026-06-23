## GoCiviqueUI — build conventions

GoCiviqueUI is the GoCivique (French civic-exam prep) design system: shadcn/ui
primitives (Radix + class-variance-authority) styled with Tailwind utility
classes over CSS-variable tokens. Build with the real components below, and style
your own layout with the Tailwind vocabulary below — never hard-code colors.

### Components (`window.GoCiviqueUI`)
Button, Badge, Card, Alert, Input, Label, Textarea, Checkbox, Switch, RadioGroup,
Select, Tabs, Accordion, Dialog, Tooltip, Avatar, Progress, Separator, Skeleton —
plus their compound parts: CardHeader/CardTitle/CardDescription/CardContent/
CardFooter, DialogTrigger/DialogContent/DialogHeader/DialogTitle/DialogDescription/
DialogFooter, SelectTrigger/SelectValue/SelectContent/SelectItem, TabsList/
TabsTrigger/TabsContent, AccordionItem/AccordionTrigger/AccordionContent,
AlertTitle/AlertDescription, AvatarImage/AvatarFallback, RadioGroupItem,
TooltipTrigger/TooltipContent/TooltipProvider. Read each component's `.prompt.md`
for usage and `.d.ts` for its props.

### Setup & wrapping
- **No global theme provider is needed.** Tokens are plain `:root` CSS variables
  in the stylesheet; components render the light theme by default. Linking
  `styles.css` once themes the whole system.
- **Dark mode:** add `class="dark"` to an ancestor (the `.dark` block overrides
  `:root`).
- **Tooltips must be wrapped in `<TooltipProvider>`** once, high in the tree:
  `<TooltipProvider><Tooltip>…</Tooltip></TooltipProvider>`. Every other component
  is self-contained.

### Styling idiom — Tailwind utilities over semantic tokens
Style layout and your own elements with these token-backed classes (don't invent
hexes):
- **Surfaces:** `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
- **Text:** `text-foreground`, `text-muted-foreground`, `text-primary`,
  `text-card-foreground`
- **Brand / intent:** `bg-primary`+`text-primary-foreground`,
  `bg-accent`+`text-accent-foreground`, `bg-destructive`+`text-destructive-foreground`,
  `bg-secondary`+`text-secondary-foreground`
- **Borders & focus:** `border` (= `border-border`), `border-input`, `ring-ring`,
  `ring-offset-background`
- **Radius:** `rounded-sm` / `rounded-md` / `rounded-lg` (driven by `--radius`,
  0.75rem); pill controls use `rounded-full`
- **Elevation:** `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl`
- **Type:** `font-sans` (Inter), `font-mono` (JetBrains Mono)
- Standard layout utilities (`flex`, `grid`, `gap-*`, `p-*`, `space-y-*`,
  `max-w-*`, `text-sm`, …) work as usual.

⚠ **Avoid `Button variant="secondary"`** in this DS: it renders white text on a
near-white surface (low contrast). Prefer `default`, `outline`, or `ghost`.

### Where the truth lives
Before styling, read `styles.css` and its `@import` closure (`_ds_bundle.css`,
which carries the token definitions and the compiled utilities). Before composing
a component, read its `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`.

### Idiomatic example
```jsx
const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } = window.GoCiviqueUI;

<Card className="max-w-sm">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Institutions françaises</CardTitle>
      <Badge>Premium</Badge>
    </div>
    <CardDescription>12 questions · niveau Naturalisation</CardDescription>
  </CardHeader>
  <CardContent className="text-sm text-muted-foreground">
    Président de la République, Assemblée nationale, Sénat et Conseil constitutionnel.
  </CardContent>
  <CardFooter className="gap-2">
    <Button variant="outline">Réviser</Button>
    <Button>Passer l'examen</Button>
  </CardFooter>
</Card>
```
