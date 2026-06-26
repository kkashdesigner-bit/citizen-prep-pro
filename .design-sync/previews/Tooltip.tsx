import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from "gocivique-ui";
import { Info } from "lucide-react";

export const Default = () => (
  <TooltipProvider>
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Aide">
          <Info />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Réussite : 80 % minimum à l'examen blanc</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
