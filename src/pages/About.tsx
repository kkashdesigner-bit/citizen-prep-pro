import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
            {t('about.title')}
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            {t('about.subtitle')}
          </p>

          {/* What is it */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('about.whatIs')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground">
              <p>{t('about.whatIsP1')}</p>
              <p>{t('about.whatIsP2')}</p>
            </CardContent>
          </Card>

          {/* Who must take it */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Users className="h-5 w-5 text-primary" />
                {t('about.whoMust')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{t('about.cspTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('about.cspDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{t('about.crTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('about.crDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Crown className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{t('about.natTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('about.natDesc')}</p>
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
                {t('about.format')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">40</p>
                  <p className="text-xs text-muted-foreground">{t('about.questions')}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">45</p>
                  <p className="text-xs text-muted-foreground">{t('about.minutes')}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">{t('about.optionsPerQ')}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">80%</p>
                  <p className="text-xs text-muted-foreground">{t('about.passThreshold')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What it covers */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <CheckCircle className="h-5 w-5 text-primary" />
                {t('about.content')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {[
                  { q: '11', key: 'contentPrinciples' },
                  { q: '6', key: 'contentInstitutions' },
                  { q: '11', key: 'contentRights' },
                  { q: '8', key: 'contentHistory' },
                  { q: '4', key: 'contentLiving' },
                ].map(({ q, key }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="outline">{q} {t('about.questions').toLowerCase()}</Badge>
                    <span className="text-foreground">{t(`about.${key}`)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pass threshold */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Clock className="h-5 w-5 text-primary" />
                {t('about.procedure')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground">
              <p>{t('about.procedureP1')}</p>
              <p>{t('about.procedureP2')}</p>
              <p>{t('about.procedureP3')}</p>
            </CardContent>
          </Card>

          {/* Official resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <ExternalLink className="h-5 w-5 text-primary" />
                {t('about.resources')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.ofii.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    Office Français de l'Immigration et de l'Intégration (OFII)
                  </a>
                </li>
                <li>
                  <a href="https://www.interieur.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    Ministère de l'Intérieur
                  </a>
                </li>
                <li>
                  <a href="https://www.service-public.fr/particuliers/vosdroits/F2215" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
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
