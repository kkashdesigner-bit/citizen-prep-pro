import { Tabs, TabsList, TabsTrigger, TabsContent } from "gocivique-ui";

export const CourseTabs = () => (
  <Tabs defaultValue="contenu" className="w-full max-w-md">
    <TabsList>
      <TabsTrigger value="contenu">Contenu</TabsTrigger>
      <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
      <TabsTrigger value="quiz">Quiz rapide</TabsTrigger>
    </TabsList>
    <TabsContent value="contenu" className="text-sm text-muted-foreground">
      La devise de la République française est « Liberté, Égalité, Fraternité ».
    </TabsContent>
    <TabsContent value="flashcards" className="text-sm text-muted-foreground">
      12 termes clés à mémoriser pour ce thème.
    </TabsContent>
    <TabsContent value="quiz" className="text-sm text-muted-foreground">
      5 questions pour tester vos connaissances.
    </TabsContent>
  </Tabs>
);
