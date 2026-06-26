import { Alert, AlertTitle, AlertDescription } from "gocivique-ui";
import { Info, AlertTriangle } from "lucide-react";

export const Default = () => (
  <Alert className="max-w-md">
    <Info className="h-4 w-4" />
    <AlertTitle>Examen blanc disponible</AlertTitle>
    <AlertDescription>
      Vous avez débloqué un nouvel examen blanc chronométré de 40 questions.
    </AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive" className="max-w-md">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Seuil non atteint</AlertTitle>
    <AlertDescription>
      Votre score est de 65 %. Il faut au moins 80 % pour réussir l'examen civique.
    </AlertDescription>
  </Alert>
);
