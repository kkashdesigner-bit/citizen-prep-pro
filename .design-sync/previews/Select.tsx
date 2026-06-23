import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "gocivique-ui";

// The closed trigger renders the selected value inline (the dropdown opens into
// a portal on click), so it captures cleanly as a static card.
export const ThemePicker = () => (
  <div className="w-full max-w-xs space-y-2">
    <Label>Thème de révision</Label>
    <Select defaultValue="institutions">
      <SelectTrigger>
        <SelectValue placeholder="Choisir un thème" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="institutions">Institutions</SelectItem>
        <SelectItem value="histoire">Histoire de France</SelectItem>
        <SelectItem value="geographie">Géographie</SelectItem>
        <SelectItem value="valeurs">Valeurs de la République</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
