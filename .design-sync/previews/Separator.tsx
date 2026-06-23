import { Separator } from "gocivique-ui";

export const Sections = () => (
  <div className="w-full max-w-sm">
    <div className="space-y-1">
      <h4 className="text-sm font-medium leading-none">Parcours civique</h4>
      <p className="text-sm text-muted-foreground">5 thèmes · 300 questions</p>
    </div>
    <Separator className="my-4" />
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Cours</span>
      <Separator orientation="vertical" />
      <span>Quiz</span>
      <Separator orientation="vertical" />
      <span>Examen</span>
    </div>
  </div>
);
