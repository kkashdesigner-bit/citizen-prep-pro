import { RadioGroup, RadioGroupItem, Label } from "gocivique-ui";

export const QuizQuestion = () => (
  <div className="w-full max-w-md space-y-3">
    <p className="text-sm font-medium">Quel est l'hymne national français ?</p>
    <RadioGroup defaultValue="b" className="space-y-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="a" />
        <Label htmlFor="a">Le Chant des partisans</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="b" />
        <Label htmlFor="b">La Marseillaise</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="c" id="c" />
        <Label htmlFor="c">L'Internationale</Label>
      </div>
    </RadioGroup>
  </div>
);
