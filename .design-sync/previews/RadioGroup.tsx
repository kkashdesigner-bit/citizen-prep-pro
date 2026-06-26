import { RadioGroup, RadioGroupItem, Label } from "gocivique-ui";

export const ExamGoal = () => (
  <RadioGroup defaultValue="naturalisation" className="max-w-sm">
    <div className="flex items-center gap-2">
      <RadioGroupItem value="csp" id="g1" />
      <Label htmlFor="g1">Carte de séjour pluriannuelle</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="cr" id="g2" />
      <Label htmlFor="g2">Carte de résident</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="naturalisation" id="g3" />
      <Label htmlFor="g3">Naturalisation</Label>
    </div>
  </RadioGroup>
);
