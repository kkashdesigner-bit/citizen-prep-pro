import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "gocivique-ui";

export const FAQ = () => (
  <Accordion
    type="single"
    defaultValue="q1"
    collapsible
    className="w-full max-w-md"
  >
    <AccordionItem value="q1">
      <AccordionTrigger>Qu'est-ce que l'examen civique ?</AccordionTrigger>
      <AccordionContent>
        Un test obligatoire depuis 2026 pour la naturalisation, la carte de
        séjour pluriannuelle ou la carte de résident.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="q2">
      <AccordionTrigger>Combien de questions faut-il réviser ?</AccordionTrigger>
      <AccordionContent>
        Plus de 300 questions couvrant les 5 thèmes officiels de l'examen
        civique.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="q3">
      <AccordionTrigger>Quel est le seuil de réussite ?</AccordionTrigger>
      <AccordionContent>
        80 % pour l'examen blanc et 70 % pour les quiz du parcours.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
