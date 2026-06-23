import { Badge } from "gocivique-ui";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Premium</Badge>
    <Badge variant="secondary">Nouveau</Badge>
    <Badge variant="outline">Gratuit</Badge>
    <Badge variant="destructive">Expiré</Badge>
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Naturalisation</Badge>
    <Badge variant="secondary">Carte de séjour</Badge>
    <Badge variant="outline">5 thèmes</Badge>
    <Badge variant="outline">300+ questions</Badge>
  </div>
);
