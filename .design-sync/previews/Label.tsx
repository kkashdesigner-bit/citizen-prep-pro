import { Label, Input, Checkbox } from "gocivique-ui";

export const WithInput = () => (
  <div className="w-full max-w-sm space-y-2">
    <Label htmlFor="nom">Nom de naissance</Label>
    <Input id="nom" placeholder="Dupont" />
  </div>
);

export const WithCheckbox = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="cgu" defaultChecked />
    <Label htmlFor="cgu">J'accepte les conditions d'utilisation</Label>
  </div>
);
