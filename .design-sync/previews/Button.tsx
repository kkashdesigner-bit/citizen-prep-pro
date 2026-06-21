import { Button } from "gocivique-ui";
import { Play, Download, ArrowRight } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Commencer l'examen</Button>
    <Button variant="secondary">Mode entraînement</Button>
    <Button variant="outline">Voir les cours</Button>
    <Button variant="ghost">Plus tard</Button>
    <Button variant="destructive">Réinitialiser</Button>
    <Button variant="link">En savoir plus</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm">Petit</Button>
    <Button size="default">Par défaut</Button>
    <Button size="lg">Grand</Button>
    <Button size="icon" aria-label="Question suivante">
      <ArrowRight />
    </Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>
      <Play /> Lancer l'examen blanc
    </Button>
    <Button variant="outline">
      <Download /> Télécharger le PDF
    </Button>
    <Button variant="secondary">
      Continuer <ArrowRight />
    </Button>
  </div>
);

export const States = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Actif</Button>
    <Button disabled>Désactivé</Button>
    <Button variant="outline" disabled>
      Indisponible
    </Button>
  </div>
);
