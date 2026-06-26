import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Label,
} from "gocivique-ui";

export const ExamLevel = () => (
  <div className="grid w-full max-w-xs gap-1.5">
    <Label>Niveau d'examen visé</Label>
    <Select defaultValue="naturalisation">
      <SelectTrigger>
        <SelectValue placeholder="Choisir un niveau" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Titres de séjour</SelectLabel>
          <SelectItem value="csp">Carte de séjour pluriannuelle</SelectItem>
          <SelectItem value="cr">Carte de résident</SelectItem>
          <SelectItem value="naturalisation">Naturalisation</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
