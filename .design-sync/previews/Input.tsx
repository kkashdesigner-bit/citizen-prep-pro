import { Input, Label } from "gocivique-ui";

export const WithLabel = () => (
  <div className="grid w-full max-w-sm gap-1.5">
    <Label htmlFor="email">Adresse e-mail</Label>
    <Input id="email" type="email" placeholder="prenom@exemple.fr" />
  </div>
);

export const States = () => (
  <div className="grid w-full max-w-sm gap-3">
    <Input placeholder="Rechercher une question…" />
    <Input defaultValue="Naturalisation 2026" />
    <Input placeholder="Champ désactivé" disabled />
  </div>
);
