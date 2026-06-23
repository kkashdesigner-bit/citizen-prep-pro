import { Input, Label } from "gocivique-ui";

export const WithLabel = () => (
  <div className="w-full max-w-sm space-y-2">
    <Label htmlFor="email">Adresse e-mail</Label>
    <Input id="email" type="email" placeholder="prenom.nom@exemple.fr" />
  </div>
);

export const States = () => (
  <div className="w-full max-w-sm space-y-3">
    <Input placeholder="Rechercher une question…" />
    <Input defaultValue="Marianne Dupont" />
    <Input placeholder="Champ désactivé" disabled />
  </div>
);
