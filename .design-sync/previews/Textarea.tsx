import { Textarea, Label } from "gocivique-ui";

export const WithLabel = () => (
  <div className="w-full max-w-md space-y-2">
    <Label htmlFor="motiv">Lettre de motivation</Label>
    <Textarea
      id="motiv"
      rows={4}
      placeholder="Expliquez les raisons de votre demande de naturalisation…"
    />
  </div>
);

export const Filled = () => (
  <div className="w-full max-w-md space-y-2">
    <Label htmlFor="notes">Notes de révision</Label>
    <Textarea
      id="notes"
      rows={4}
      defaultValue="La devise de la République est « Liberté, Égalité, Fraternité ». Les symboles : le drapeau tricolore, La Marseillaise et Marianne."
    />
  </div>
);
