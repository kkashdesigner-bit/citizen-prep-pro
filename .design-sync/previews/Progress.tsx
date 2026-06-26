import { Progress } from "gocivique-ui";

export const Readiness = () => (
  <div className="flex w-full max-w-sm flex-col gap-4">
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Préparation à l'examen — 85 %</p>
      <Progress value={85} aria-label="Préparation à l'examen" />
    </div>
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Histoire et géographie — 60 %</p>
      <Progress value={60} aria-label="Histoire et géographie" />
    </div>
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Institutions — 30 %</p>
      <Progress value={30} aria-label="Institutions" />
    </div>
  </div>
);
