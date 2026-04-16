import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEOHead
                title="Conditions Générales | GoCivique"
                description="Conditions Générales d'Utilisation et de Vente de la plateforme GoCivique."
                path="/terms"
            />
            <Header />
            <main className="flex-1 container py-10 px-4 md:px-6">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                        Conditions Générales d’Utilisation et de Vente
                    </h1>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Dernière mise à jour : 8 mars 2026
                    </p>

                    <Card className="mb-8">
                        <CardContent className="p-6 md:p-8 space-y-8 text-foreground">
                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 1 – Objet</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les présentes conditions générales définissent les règles d’utilisation du site gocivique.fr ainsi que les conditions de vente applicables à l’achat de pass donnant accès aux contenus et services proposés (tests, formations et ressources pédagogiques).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 2 – Accès et compte utilisateur</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Le site est accessible à tout utilisateur disposant d’une connexion Internet. Certaines fonctionnalités nécessitent la création d’un compte personnel. L’utilisateur s’engage à fournir des informations exactes et à les tenir à jour. Toute utilisation frauduleuse ou abusive pourra entraîner la suspension du compte.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 3 – Produits et services</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les produits proposés sur gocivique.fr sont des accès numériques à des contenus en ligne (tests, exercices, guides etc.), disponibles immédiatement après paiement. Aucun support physique n’est envoyé. Le site ne propose aucun renouvellement automatique : chaque pass correspond à un achat unique.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Chaque compte est destiné à un usage personnel. L’utilisateur peut accéder aux contenus depuis différents appareils (ordinateur, tablette ou smartphone). Pour des raisons de sécurité, lorsqu’une connexion est effectuée depuis un nouvel appareil, la session précédente est automatiquement déconnectée.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 4 – Prix et paiement</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les prix sont indiqués en euros, toutes taxes comprises. Le paiement est effectué via des prestataires sécurisés (Stripe). L’accès au service est activé dès la confirmation du paiement.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 5 – Absence de droit de rétractation</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Conformément à l’article L.221-28 du Code de la consommation, le droit de rétractation ne s’applique pas aux contenus numériques accessibles immédiatement après l’achat. Aucun remboursement ne pourra être effectué après activation de l'abonnement, sauf cas exceptionnel prévu dans la politique de remboursement.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 6 – Propriété intellectuelle</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tous les contenus présents sur gocivique.fr (textes, illustrations, tests, logos, codes, etc.) sont protégés par le droit d’auteur. Toute reproduction, diffusion ou utilisation non autorisée est strictement interdite.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 7 – Responsabilités</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Le site s’efforce d’assurer un service disponible et fonctionnel, mais ne peut garantir l’absence d’interruptions temporaires ou d’erreurs. L’utilisateur est responsable de son matériel et de sa connexion Internet. Le site ne saurait être tenu responsable d’un usage inapproprié du contenu fourni.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les contenus proposés ont pour objectif d’aider les candidats à se préparer au test civique. Ils s’inscrivent dans une démarche pédagogique et ne remplacent pas les sources officielles. La réussite à l’examen reste liée au parcours et à l’engagement personnel de chacun.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 8 – Données personnelles et cookies</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les données collectées sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Elles sont utilisées uniquement pour la gestion des comptes, paiements et accès aux services. L’utilisateur peut exercer ses droits d’accès, de rectification ou de suppression en contactant : <a href="mailto:dpo@gocivique.fr" className="text-primary hover:underline">dpo@gocivique.fr</a>
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Des cookies peuvent être utilisés pour améliorer la navigation ; ils peuvent être désactivés dans les paramètres du navigateur. Pour plus d’informations, veuillez consulter notre <a href="/privacy" className="text-primary hover:underline">Politique de Confidentialité</a>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 9 – Modification des conditions</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    gocivique.fr se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de la mise à jour via le site. L’utilisation du service après modification vaut acceptation des nouvelles conditions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 10 – Droit applicable et litiges</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les présentes conditions sont régies par le droit français. En cas de différend, l’utilisateur peut contacter le support ou recourir à un médiateur de la consommation via la plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
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
