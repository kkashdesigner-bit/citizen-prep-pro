import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Users,
  FileText,
  ExternalLink,
  Shield,
  Award,
  Crown,
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
            À propos de l'Examen Civique
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Informations officielles sur l'examen de connaissance des valeurs de la République
            française.
          </p>

          {/* What is it */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <BookOpen className="h-5 w-5 text-primary" />
                Qu'est-ce que l'Examen Civique ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground">
              <p>
                L'examen civique est un test de connaissance des valeurs et principes de la
                République française. Il a été instauré pour s'assurer que les candidats à un titre
                de séjour ou à la nationalité française possèdent une compréhension suffisante des
                fondements de la République.
              </p>
              <p>
                L'examen est administré par l'Office Français de l'Immigration et de l'Intégration
                (OFII) dans le cadre du parcours d'intégration républicaine.
              </p>
            </CardContent>
          </Card>

          {/* Who must take it */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Users className="h-5 w-5 text-primary" />
                Qui doit passer cet examen ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      CSP — Carte de Séjour Pluriannuelle
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Les étrangers souhaitant obtenir un titre de séjour pluriannuel après un premier
                      titre d'un an.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">CR — Carte de Résident</p>
                    <p className="text-sm text-muted-foreground">
                      Les candidats à la carte de résident de 10 ans, nécessitant une connaissance
                      approfondie des institutions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Crown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Naturalisation</p>
                    <p className="text-sm text-muted-foreground">
                      Les candidats à la nationalité française, avec un niveau d'exigence renforcé
                      sur le patrimoine et l'histoire.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <FileText className="h-5 w-5 text-primary" />
                Format de l'examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">40</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">45</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Options/question</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">80%</p>
                  <p className="text-xs text-muted-foreground">Seuil de réussite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What it covers */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <CheckCircle className="h-5 w-5 text-primary" />
                Contenu de l'examen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">11 questions</Badge>
                  <span className="text-foreground">
                    <strong>Principes de la République</strong> — Devise, laïcité, symboles
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">6 questions</Badge>
                  <span className="text-foreground">
                    <strong>Institutions</strong> — Démocratie, organisation, Europe
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">11 questions</Badge>
                  <span className="text-foreground">
                    <strong>Droits et devoirs</strong> — Droits fondamentaux, devoirs civiques
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">8 questions</Badge>
                  <span className="text-foreground">
                    <strong>Histoire et géographie</strong> — Périodes clés, patrimoine
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">4 questions</Badge>
                  <span className="text-foreground">
                    <strong>Vie quotidienne</strong> — Santé, travail, éducation, résidence
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pass threshold */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Clock className="h-5 w-5 text-primary" />
                Déroulement et seuil de réussite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground">
              <p>
                L'examen se déroule en <strong>45 minutes</strong>. Le candidat doit répondre à{' '}
                <strong>40 questions à choix multiples</strong>, chacune proposant 4 réponses dont
                une seule est correcte.
              </p>
              <p>
                Le seuil de réussite est fixé à <strong>80%</strong>, soit un minimum de{' '}
                <strong>32 bonnes réponses sur 40</strong>.
              </p>
              <p>
                1 point est attribué par bonne réponse. Aucun point négatif n'est appliqué pour les
                réponses incorrectes ou les questions sans réponse.
              </p>
            </CardContent>
          </Card>

          {/* Official resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <ExternalLink className="h-5 w-5 text-primary" />
                Ressources officielles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.ofii.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Office Français de l'Immigration et de l'Intégration (OFII)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.interieur.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Ministère de l'Intérieur
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.service-public.fr/particuliers/vosdroits/F2215"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Service Public — Naturalisation
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
