import { Tabs, TabsList, TabsTrigger, TabsContent } from "gocivique-ui";

export const Sections = () => (
  <Tabs defaultValue="cours" className="w-full max-w-md">
    <TabsList>
      <TabsTrigger value="cours">Cours</TabsTrigger>
      <TabsTrigger value="quiz">Quiz</TabsTrigger>
      <TabsTrigger value="examen">Examen blanc</TabsTrigger>
    </TabsList>
    <TabsContent value="cours" className="pt-3 text-sm text-muted-foreground">
      Fiches de révision sur les 5 thèmes officiels de l'examen civique.
    </TabsContent>
    <TabsContent value="quiz" className="pt-3 text-sm text-muted-foreground">
      Testez vos connaissances thème par thème, avec correction immédiate.
    </TabsContent>
    <TabsContent value="examen" className="pt-3 text-sm text-muted-foreground">
      Simulez l'examen réel : 30 questions, seuil de réussite 80 %.
    </TabsContent>
  </Tabs>
);
