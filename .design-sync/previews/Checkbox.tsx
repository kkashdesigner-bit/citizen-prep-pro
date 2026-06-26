import { Checkbox, Label } from "gocivique-ui";

export const ThemeChecklist = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <Checkbox id="c1" defaultChecked />
      <Label htmlFor="c1">Valeurs de la République</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="c2" defaultChecked />
      <Label htmlFor="c2">Histoire et géographie</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="c3" />
      <Label htmlFor="c3">Institutions françaises</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="c4" disabled />
      <Label htmlFor="c4">Module verrouillé (Premium)</Label>
    </div>
  </div>
);
