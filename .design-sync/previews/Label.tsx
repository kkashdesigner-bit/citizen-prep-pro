import { Label, Input, Checkbox } from "gocivique-ui";

export const WithInput = () => (
  <div className="grid w-full max-w-sm gap-1.5">
    <Label htmlFor="name">Nom complet</Label>
    <Input id="name" placeholder="Marie Dupont" />
  </div>
);

export const WithCheckbox = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cgu" defaultChecked />
    <Label htmlFor="cgu">J'accepte les conditions d'utilisation</Label>
  </div>
);
