import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from "gocivique-ui";
import { Info } from "lucide-react";

// The tooltip bubble is Popper-positioned and only appears on hover/focus, so a
// static screenshot shows the trigger (the help affordance), not the bubble.
// The full open composition lives in this component's .prompt.md for the agent.
export const HelpAffordance = () => (
  <TooltipProvider>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium">Seuil de réussite de l'examen blanc</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            aria-label="Plus d'informations"
          >
            <Info />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Il faut obtenir au moins 80 % de bonnes réponses pour valider l'examen.
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
