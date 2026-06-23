import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "gocivique-ui";

// Rendered open (defaultOpen) so the dialog content shows in the static card.
// Paired with cfg.overrides.Dialog { cardMode: "single", viewport }.
export const Confirm = () => (
  <Dialog defaultOpen>
    <DialogTrigger asChild>
      <Button>Passer l'examen blanc</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Démarrer l'examen blanc ?</DialogTitle>
        <DialogDescription>
          30 questions, 30 minutes, seuil de réussite 80 %. Vous ne pourrez pas
          mettre l'examen en pause une fois commencé.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Annuler</Button>
        <Button>Commencer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
