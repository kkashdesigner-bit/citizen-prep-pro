import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEOHead
                title="Politique de Confidentialité | GoCivique"
                description="Politique de Confidentialité et gestion des données personnelles de la plateforme GoCivique."
                path="/privacy"
            />
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Politique de Confidentialité
                    </h1>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>

                    <Card className="mb-8">
                        <CardContent className="p-6 md:p-8 space-y-8 text-foreground">
                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 1 – Objet</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    La présente politique de confidentialité a pour objectif d’informer les utilisateurs du site gocivique.fr sur la manière dont leurs données personnelles sont collectées, utilisées et protégées, conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation française en vigueur.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 2 – Responsable du traitement</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Le responsable du traitement des données personnelles est l’éditeur du site gocivique.fr. Pour toute question relative aux données personnelles ou à l’exercice de vos droits, vous pouvez contacter l’éditeur à l’adresse suivante : <a href="mailto:gocivique@gmail.com" className="text-primary hover:underline">gocivique@gmail.com</a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 3 – Données collectées</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les données collectées sur gocivique.fr peuvent inclure :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li><strong>Informations d’identification :</strong> nom, prénom, adresse e-mail, lors de la création d’un compte ou d’un achat.</li>
                                    <li><strong>Données de paiement :</strong> traitées uniquement par des prestataires tiers sécurisés (Stripe).</li>
                                    <li><strong>Données de navigation :</strong> telles que les pages consultées ou les cookies, afin d’améliorer l’expérience utilisateur et les performances du site.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 4 – Finalités du traitement</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les données personnelles sont collectées et traitées pour les finalités suivantes :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li>Créer et gérer le compte utilisateur ;</li>
                                    <li>Fournir l’accès aux contenus pédagogiques et aux services du site ;</li>
                                    <li>Gérer les paiements et la facturation ;</li>
                                    <li>Améliorer le fonctionnement et la sécurité du site ;</li>
                                    <li>Envoyer, si l’utilisateur y consent, des communications relatives aux services proposés.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 5 – Partage des données</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec des prestataires techniques de confiance (hébergement, paiement en ligne, support), et strictement dans la mesure nécessaire à la fourniture du service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 6 – Durée de conservation</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les données personnelles sont conservées pour une durée adaptée à chaque finalité :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li><strong>Données de compte :</strong> jusqu’à suppression du compte ou après une période d’inactivité prolongée ;</li>
                                    <li><strong>Données de paiement :</strong> uniquement pendant la durée nécessaire au traitement de la transaction, sauf obligations légales contraires ;</li>
                                    <li><strong>Cookies et données techniques :</strong> selon les durées légales applicables.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 7 – Droits des utilisateurs</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Conformément au RGPD, tout utilisateur dispose des droits suivants :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                                    <li><strong>Droit d’accès :</strong> obtenir une copie des données le concernant ;</li>
                                    <li><strong>Droit de rectification :</strong> corriger les informations inexactes ou incomplètes ;</li>
                                    <li><strong>Droit à l’effacement :</strong> demander la suppression de ses données personnelles lorsque cela est possible ;</li>
                                    <li><strong>Droit d’opposition ou de limitation :</strong> s’opposer ou limiter certains traitements.</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed">
                                    Ces droits peuvent être exercés en contactant : <a href="mailto:gocivique@gmail.com" className="text-primary hover:underline">gocivique@gmail.com</a>
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 8 – Cookies et traceurs</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Le site gocivique.fr utilise des cookies afin d’améliorer la navigation et de mesurer l’audience. Vous pouvez configurer votre navigateur pour refuser tout ou partie des cookies. Certaines fonctionnalités peuvent toutefois être limitées en cas de refus total.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 9 – Sécurité des données</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Des mesures de sécurité techniques et organisationnelles sont mises en œuvre pour protéger les données personnelles contre tout accès non autorisé, perte, modification ou divulgation.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 10 – Modification de la politique</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    gocivique.fr se réserve le droit de modifier la présente politique à tout moment. Les utilisateurs seront informés des changements par une mise à jour visible sur le site.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 11 – Contact et recours</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Pour toute question relative à la protection des données, vous pouvez contacter : <a href="mailto:gocivique@gmail.com" className="text-primary hover:underline">gocivique@gmail.com</a>. En cas de désaccord sur la gestion de vos données, vous pouvez également saisir la <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-primary hover:underline">CNIL</a>.
                                </p>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
