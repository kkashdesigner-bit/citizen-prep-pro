import { Switch, Label } from "gocivique-ui";

export const Settings = () => (
  <div className="flex max-w-sm flex-col gap-4">
    <div className="flex items-center justify-between">
      <Label htmlFor="s1">Notifications par e-mail</Label>
      <Switch id="s1" defaultChecked />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="s2">Rappels de révision quotidiens</Label>
      <Switch id="s2" defaultChecked />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="s3">Mode sombre</Label>
      <Switch id="s3" />
    </div>
  </div>
);
