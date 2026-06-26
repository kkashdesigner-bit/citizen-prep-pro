import { Textarea, Label } from "gocivique-ui";

export const WithLabel = () => (
  <div className="grid w-full max-w-sm gap-1.5">
    <Label htmlFor="msg">Votre message</Label>
    <Textarea id="msg" placeholder="Posez votre question sur l'examen civique…" />
  </div>
);

export const Filled = () => (
  <Textarea
    className="max-w-sm"
    defaultValue="La laïcité garantit la liberté de conscience et la séparation des Églises et de l'État."
  />
);
