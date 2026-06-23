import { Switch, Label } from "gocivique-ui";

export const Settings = () => (
  <div className="w-full max-w-sm space-y-4">
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="m1">Mode entraînement chronométré</Label>
      <Switch id="m1" defaultChecked />
    </div>
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="m2">Rappels de révision quotidiens</Label>
      <Switch id="m2" />
    </div>
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor="m3">Afficher la correction immédiate</Label>
      <Switch id="m3" defaultChecked />
    </div>
  </div>
);
