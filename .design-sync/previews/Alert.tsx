import { Alert, AlertTitle, AlertDescription } from "gocivique-ui";
import { Info, TriangleAlert } from "lucide-react";

export const Default = () => (
  <Alert className="max-w-md">
    <Info className="h-4 w-4" />
    <AlertTitle>Examen civique obligatoire</AlertTitle>
    <AlertDescription>
      Depuis 2026, l'examen est requis pour la naturalisation, la carte de
      séjour pluriannuelle et la carte de résident.
    </AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive" className="max-w-md">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Score insuffisant</AlertTitle>
    <AlertDescription>
      Vous avez obtenu 62 %. Un minimum de 70 % est requis pour valider ce quiz.
    </AlertDescription>
  </Alert>
);
