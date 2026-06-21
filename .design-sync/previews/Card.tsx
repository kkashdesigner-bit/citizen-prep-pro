import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "gocivique-ui";

export const Basic = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Valeurs de la République</CardTitle>
      <CardDescription>Liberté, Égalité, Fraternité, Laïcité</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Révisez les principes fondamentaux de la République française : la devise,
      les symboles et la laïcité.
    </CardContent>
    <CardFooter>
      <Button>Commencer le cours</Button>
    </CardFooter>
  </Card>
);

export const CourseCard = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Institutions françaises</CardTitle>
        <Badge>Premium</Badge>
      </div>
      <CardDescription>12 questions · niveau Naturalisation</CardDescription>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      Président de la République, Assemblée nationale, Sénat et Conseil
      constitutionnel.
    </CardContent>
    <CardFooter className="gap-2">
      <Button variant="outline">Réviser</Button>
      <Button>Passer l'examen</Button>
    </CardFooter>
  </Card>
);
