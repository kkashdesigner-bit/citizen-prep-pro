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
                        Dernière mise à jour : 17 juin 2026
                    </p>

                    <Card className="mb-8">
                        <CardContent className="p-6 md:p-8 space-y-8 text-foreground">
                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 1 – Objet</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les présentes conditions générales (les « Conditions ») définissent les règles d’utilisation du site gocivique.fr ainsi que les conditions de vente applicables à la souscription des offres et abonnements donnant accès aux contenus et services proposés (tests, examens blancs, parcours, formations et ressources pédagogiques). Toute création de compte ou tout achat emporte acceptation pleine et entière des présentes Conditions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 2 – Accès et compte utilisateur</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Certaines fonctionnalités nécessitent la création d’un compte. L’utilisateur s’engage à fournir des informations exactes et à les tenir à jour, et est seul responsable de la confidentialité de ses identifiants.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Le compte est <strong>strictement personnel, nominatif et non transférable</strong>. Il est destiné à l’usage d’une seule et même personne. Le partage des identifiants, la revente, le prêt ou la mise à disposition du compte ou de l’accès à des tiers sont interdits. Pour des raisons de sécurité, <strong>une seule session active est autorisée par compte</strong> : lorsqu’une connexion est effectuée depuis un nouvel appareil ou navigateur, la session précédente est automatiquement déconnectée. Toute utilisation frauduleuse, abusive ou partagée pourra entraîner la suspension ou la résiliation du compte, sans remboursement (voir Articles 6 et 9).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 3 – Offres, abonnements et « Accès à Vie »</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les produits proposés sur gocivique.fr sont des accès numériques à des contenus en ligne, disponibles immédiatement après paiement. Aucun support physique n’est envoyé. GoCivique propose notamment : une offre <strong>Gratuite</strong>, des abonnements <strong>mensuels</strong> (Standard, Premium), un abonnement <strong>Annuel</strong>, et un <strong>« Accès à Vie »</strong> (paiement unique).
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    <strong>Abonnements (mensuels et annuels).</strong> Les abonnements peuvent inclure une période d’essai gratuite (par exemple 3 jours). Ils sont à <strong>reconduction automatique</strong> par tacite reconduction pour des périodes successives identiques, jusqu’à résiliation par l’utilisateur. Le paiement est prélevé à l’issue de l’éventuelle période d’essai, puis au début de chaque nouvelle période. L’utilisateur peut résilier à tout moment depuis ses paramètres ; la résiliation prend effet à la fin de la période en cours et aucun prélèvement ultérieur n’est effectué.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    <strong>« Accès à Vie ».</strong> L’Accès à Vie correspond à un <strong>paiement unique</strong>, sans abonnement ni renouvellement. Il est expressément convenu que la mention « à vie » s’entend <strong>pour la durée de vie du service GoCivique, et non pour la durée de vie de l’utilisateur</strong>. GoCivique se réserve le droit de faire évoluer, de modifier ou d’interrompre tout ou partie du service ; en cas d’arrêt définitif du service, l’Accès à Vie prend fin sans ouvrir droit à indemnité ni à remboursement, sous réserve des dispositions légales impératives. L’Accès à Vie est <strong>strictement personnel, nominatif, incessible et non transférable</strong> et reste soumis aux Articles 2, 6 et 9.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 4 – Prix et paiement</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les prix sont indiqués en euros, toutes taxes comprises. Le paiement est effectué via un prestataire de paiement sécurisé (Stripe) ; GoCivique n’a pas accès aux données bancaires complètes de l’utilisateur. L’accès au service est activé dès la confirmation du paiement (ou, pour les abonnements avec essai, dès le début de l’essai). GoCivique se réserve le droit de modifier ses prix à tout moment ; les tarifs applicables sont ceux en vigueur au moment de la souscription.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 5 – Droit de rétractation</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Conformément à l’article L.221-28 du Code de la consommation, le droit de rétractation ne s’applique pas à la fourniture de contenus numériques sans support matériel dont l’exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation. En souscrivant et en accédant immédiatement au contenu, l’utilisateur demande expressément l’exécution immédiate du service et reconnaît perdre son droit de rétractation. Sauf cas exceptionnel prévu par la <a href="/refunds" className="text-primary hover:underline">politique de remboursement</a>, aucun remboursement ne pourra être effectué après activation.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 6 – Usage personnel et lutte contre le partage de compte</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    L’accès, quel que soit l’offre ou l’abonnement (y compris l’Accès à Vie), est concédé sous la forme d’une licence d’utilisation <strong>personnelle, non exclusive, incessible et non transférable</strong>, pour un usage strictement individuel.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Sont notamment interdits : le partage des identifiants, l’utilisation simultanée du compte par plusieurs personnes, la revente, la location, le prêt, ou toute mise à disposition de l’accès à un tiers. GoCivique peut mettre en œuvre des mesures techniques de protection (limitation à une session active, détection d’usages anormaux tels que des connexions simultanées ou depuis un nombre inhabituel d’appareils ou de localisations). En cas de manquement, GoCivique pourra, sans préavis, suspendre ou résilier le compte concerné, sans remboursement et sans préjudice de tout recours.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 7 – Propriété intellectuelle</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tous les contenus présents sur gocivique.fr (textes, illustrations, tests, questions, logos, codes, etc.) sont protégés par le droit d’auteur et demeurent la propriété exclusive de GoCivique ou de ses partenaires. Toute reproduction, extraction, diffusion, revente ou utilisation non autorisée, totale ou partielle, est strictement interdite.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 8 – Responsabilités</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Le service est fourni « en l’état ». GoCivique s’efforce d’assurer un service disponible et fonctionnel, mais ne garantit pas l’absence d’interruptions, d’erreurs ou d’évolutions du contenu, et se réserve le droit de faire évoluer la plateforme et ses contenus à tout moment. L’utilisateur est responsable de son matériel et de sa connexion Internet.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les contenus ont une vocation pédagogique d’aide à la préparation de l’examen civique ; ils ne remplacent pas les sources officielles et <strong>aucune garantie de réussite à l’examen n’est donnée</strong>. La réussite dépend du parcours et de l’engagement personnel de chacun.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 9 – Suspension et résiliation</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    GoCivique se réserve le droit de suspendre ou de résilier, immédiatement et sans préavis, l’accès de tout utilisateur en cas de violation des présentes Conditions, notamment en cas de fraude, d’usage abusif, de partage de compte ou d’atteinte à la sécurité du service. Une telle suspension ou résiliation n’ouvre droit à aucun remboursement, y compris pour l’Accès à Vie.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 10 – Données personnelles et cookies</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Les données collectées sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Elles sont utilisées pour la gestion des comptes, des paiements, de l’accès aux services et de la sécurité (y compris la prévention du partage de compte). L’utilisateur peut exercer ses droits d’accès, de rectification ou de suppression en contactant : <a href="mailto:dpo@gocivique.fr" className="text-primary hover:underline">dpo@gocivique.fr</a>
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Des cookies peuvent être utilisés pour améliorer la navigation ; ils peuvent être désactivés dans les paramètres du navigateur. Pour plus d’informations, veuillez consulter notre <a href="/privacy" className="text-primary hover:underline">Politique de Confidentialité</a>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 11 – Modification des conditions</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    gocivique.fr se réserve le droit de modifier les présentes Conditions à tout moment. Les utilisateurs seront informés de la mise à jour via le site. L’utilisation du service après modification vaut acceptation des nouvelles Conditions.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-3">Article 12 – Droit applicable et litiges</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Les présentes Conditions sont régies par le droit français. En cas de différend, l’utilisateur peut contacter le support ou recourir à un médiateur de la consommation via la plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
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
