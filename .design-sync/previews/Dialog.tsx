import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "gocivique-ui";

export const ConfirmExam = () => (
  <Dialog defaultOpen>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Commencer l'examen blanc ?</DialogTitle>
        <DialogDescription>
          40 questions chronométrées. Une fois lancé, l'examen ne peut pas être
          mis en pause.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Annuler</Button>
        <Button>Commencer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
