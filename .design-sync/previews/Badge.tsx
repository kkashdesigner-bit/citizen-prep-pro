import { Badge } from "gocivique-ui";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Premium</Badge>
    <Badge variant="secondary">Gratuit</Badge>
    <Badge variant="destructive">Échec</Badge>
    <Badge variant="outline">Brouillon</Badge>
  </div>
);

export const ExamLevels = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>CSP</Badge>
    <Badge variant="secondary">Carte de résident</Badge>
    <Badge variant="secondary">Naturalisation</Badge>
    <Badge variant="outline">Réussi · 85 %</Badge>
  </div>
);
