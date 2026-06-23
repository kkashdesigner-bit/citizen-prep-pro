import { Checkbox, Label } from "gocivique-ui";

export const Tasks = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Checkbox id="t1" defaultChecked />
      <Label htmlFor="t1">Réviser les institutions</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="t2" defaultChecked />
      <Label htmlFor="t2">Réviser l'histoire de France</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="t3" />
      <Label htmlFor="t3">Réviser la géographie</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="t4" disabled />
      <Label htmlFor="t4" className="opacity-70">Examen blanc (Premium)</Label>
    </div>
  </div>
);
