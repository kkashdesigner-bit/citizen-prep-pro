import { Progress } from "gocivique-ui";

export const ThemeProgress = () => (
  <div className="w-full max-w-md space-y-4">
    {[
      ["Institutions", 80],
      ["Histoire de France", 55],
      ["Géographie", 30],
      ["Valeurs de la République", 95],
    ].map(([label, value]) => (
      <div key={label as string} className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="text-muted-foreground">{value} %</span>
        </div>
        <Progress value={value as number} />
      </div>
    ))}
  </div>
);
