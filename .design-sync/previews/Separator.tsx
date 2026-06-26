import { Separator } from "gocivique-ui";

export const Sections = () => (
  <div className="max-w-sm">
    <div className="space-y-1">
      <h4 className="text-sm font-medium leading-none">Examen civique 2026</h4>
      <p className="text-sm text-muted-foreground">
        Préparation complète, disponible en 7 langues.
      </p>
    </div>
    <Separator className="my-4" />
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Cours</span>
      <Separator orientation="vertical" />
      <span>Quiz</span>
      <Separator orientation="vertical" />
      <span>Examens</span>
    </div>
  </div>
);
