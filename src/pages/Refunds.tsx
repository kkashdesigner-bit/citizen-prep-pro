import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Refunds() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEOHead
                title="Politique de Remboursement | GoCivique"
                description="Conditions et politique de remboursement pour la plateforme GoCivique."
                path="/refunds"
            />
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Politique de Remboursement
                    </h1>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                    </p>

                    <Card className="mb-8">
                        <CardContent className="p-6 md:p-8 space-y-8 text-foreground">
                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 1 – Objet</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    La présente politique de remboursement définit les conditions dans lesquelles les clients du site gocivique.fr peuvent demander un remboursement concernant l’achat de pass ou d’accès en ligne aux formations, tests et contenus pédagogiques proposés sur la plateforme.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 2 – Produits et services concernés</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les produits proposés sur gocivique.fr consistent en des accès numériques à des contenus éducatifs et outils interactifs, incluant notamment :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                                    <li>des tests d’entraînement et examens simulés ;</li>
                                    <li>des leçons, chapitres et ressources pédagogiques ;</li>
                                    <li>des fonctionnalités avancées réservées aux utilisateurs disposant d’un pass actif.</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed">
                                    L’accès au service est disponible immédiatement après confirmation du paiement.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 3 – Absence de droit de rétractation</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Conformément à l’article L.221-28 du Code de la consommation, le droit de rétractation ne s’applique pas aux contenus numériques fournis immédiatement après l’achat et pleinement exécutés avant la fin du délai légal. Ainsi, aucun remboursement ne pourra être accordé dès lors que l’accès au contenu ou au service a été activé.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 4 – Exceptions au non-remboursement</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Un remboursement peut toutefois être envisagé dans les cas suivants :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    <li>le client n’a pas obtenu l’accès à son espace utilisateur après le paiement et le support n’a pas résolu le problème ;</li>
                                    <li>une erreur technique empêche l’accès au contenu acheté ;</li>
                                    <li>une erreur de facturation est survenue (ex. : double paiement).</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 5 – Procédure de demande de remboursement</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Toute demande doit être adressée à : <a href="mailto:gocivique@gmail.com" className="text-primary hover:underline">gocivique@gmail.com</a> dans un délai de 7 jours suivant la commande, en précisant :
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                                    <li>le nom et prénom du titulaire du compte ;</li>
                                    <li>l’adresse e-mail utilisée lors de l’achat ;</li>
                                    <li>le numéro de commande ;</li>
                                    <li>et le motif de la demande.</li>
                                </ul>
                                <p className="text-muted-foreground leading-relaxed">
                                    Le support analysera la requête et répondra sous 7 jours ouvrés.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 6 – Modalités de remboursement</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Si un remboursement est accepté, il sera effectué via le même mode de paiement utilisé lors de l’achat initial. Aucun remboursement en espèces, chèque ou autre mode alternatif ne sera proposé.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 7 – Modification de la politique</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    gocivique.fr se réserve le droit de modifier la présente politique à tout moment. Toute modification sera publiée sur le site et prendra effet immédiatement.
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
