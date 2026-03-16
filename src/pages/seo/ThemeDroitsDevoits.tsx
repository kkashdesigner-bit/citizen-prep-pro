import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Droits et devoirs", "item": "https://gocivique.fr/themes/droits-devoirs" },
  ],
};

export default function ThemeDroitsDevoits() {
  return (
    <>
      <SEOHead
        title="Droits et Devoirs du Citoyen Français — Examen Civique | GoCivique"
        description="Droit de vote, libertés fondamentales, obligations civiques et fiscales : maîtrisez les droits et devoirs du citoyen français pour réussir l'examen civique 2026."
        path="/themes/droits-devoirs"
        schema={breadcrumbSchema}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Droits et devoirs</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 leading-tight">
          Droits et Devoirs du Citoyen Français
        </h1>
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          Être citoyen français, c'est bénéficier de droits fondamentaux et assumer des devoirs envers la collectivité. Ce thème représente environ 20 % des questions à l'examen civique.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les droits fondamentaux</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          La France garantit à chaque personne, citoyenne ou résidente, un ensemble de libertés et de droits fondamentaux, protégés par la Constitution, la Déclaration des droits de l'homme de 1789 et la Convention européenne des droits de l'homme.
        </p>
        <div className="mb-6 grid sm:grid-cols-2 gap-3">
          {[
            { droit: "Liberté d'expression", desc: "Droit de s'exprimer librement, dans le respect des lois (pas d'incitation à la haine, pas de diffamation)." },
            { droit: "Liberté de conscience et de religion", desc: "Chacun est libre de croire ou ne pas croire, de pratiquer sa religion dans l'espace privé." },
            { droit: "Droit à l'éducation", desc: "L'enseignement est obligatoire de 3 à 16 ans. L'école publique est laïque et gratuite." },
            { droit: "Droit à la santé", desc: "La Sécurité sociale rembourse une partie des frais de santé. La CMU-C couvre les personnes à faibles revenus." },
            { droit: "Droit au travail", desc: "Interdiction de la discrimination à l'embauche. Droit à un salaire minimum (SMIC)." },
            { droit: "Droit de vote", desc: "Réservé aux citoyens français de 18 ans et plus, inscrits sur les listes électorales." },
          ].map(({ droit, desc }) => (
            <div key={droit} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-[#0055A4] text-sm mb-1">{droit}</p>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Le droit de vote</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          Le droit de vote est l'un des piliers de la démocratie française. En France, il est <strong>universel, égal et secret</strong>.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li>Accessible à tous les citoyens français de <strong>18 ans et plus</strong></li>
          <li>Inscription sur les listes électorales obligatoire (automatique depuis 2019 à 18 ans)</li>
          <li>Élections présidentielles, législatives, sénatoriales, municipales, européennes</li>
          <li>Le vote n'est pas obligatoire en France (contrairement à certains pays)</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les devoirs du citoyen</h2>
        <div className="mb-6 space-y-4">
          <div className="rounded-xl border-l-4 border-[#0055A4] bg-blue-50 p-4">
            <h3 className="font-bold text-slate-900">💰 Devoir fiscal</h3>
            <p className="mt-1 text-sm text-slate-700">Tout contribuable doit déclarer ses revenus et payer ses impôts. L'impôt finance les services publics (éducation, santé, sécurité). La fraude fiscale est un délit puni par la loi.</p>
          </div>
          <div className="rounded-xl border-l-4 border-[#EF4135] bg-red-50 p-4">
            <h3 className="font-bold text-slate-900">📜 Respect des lois</h3>
            <p className="mt-1 text-sm text-slate-700">Tout résident est soumis aux lois françaises. L'ignorance de la loi n'est pas une excuse. Les lois s'appliquent de manière égale à tous.</p>
          </div>
          <div className="rounded-xl border-l-4 border-green-500 bg-green-50 p-4">
            <h3 className="font-bold text-slate-900">🎖️ Journée défense et citoyenneté (JDC)</h3>
            <p className="mt-1 text-sm text-slate-700">Anciennement appelé service national, la JDC est obligatoire pour tous les jeunes Français (hommes et femmes) à 16 ans. Elle remplace le service militaire supprimé en 1997.</p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <h3 className="font-bold text-slate-900">🗳️ Participation civique</h3>
            <p className="mt-1 text-sm text-slate-700">Bien que le vote ne soit pas obligatoire en France, la participation à la vie démocratique est encouragée : voter, s'engager, respecter les symboles républicains.</p>
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">L'égalité et la non-discrimination</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          La loi française interdit toute discrimination fondée sur l'origine, le sexe, la religion, le handicap, l'orientation sexuelle ou l'âge dans les domaines de l'emploi, du logement, de l'éducation et de l'accès aux services. Le Défenseur des droits est l'autorité indépendante chargée de traiter les réclamations.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les libertés qui ont des limites</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          En France, toutes les libertés ont des limites fixées par la loi pour protéger les autres citoyens et l'ordre public :
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li>La liberté d'expression ne permet pas l'incitation à la haine ou la diffamation.</li>
          <li>La liberté de réunion est soumise à déclaration préalable en mairie.</li>
          <li>La liberté de la presse est garantie mais encadrée (loi sur la presse de 1881).</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Questions types à l'examen</h2>
        <div className="mb-8 space-y-3">
          {[
            { q: "À partir de quel âge peut-on voter en France ?", a: "18 ans" },
            { q: "Le vote est-il obligatoire en France ?", a: "Non, le vote est un droit mais pas une obligation" },
            { q: "Comment s'appelle la prestation de sécurité sociale qui couvre les frais de santé ?", a: "L'Assurance maladie (Sécurité sociale)" },
            { q: "Quel organisme traite les discriminations en France ?", a: "Le Défenseur des droits" },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">❓ {q}</p>
              <p className="mt-1 text-sm text-[#0055A4] font-medium">✅ {a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white">
          <h2 className="mb-2 text-xl font-bold">Entraînez-vous sur ce thème</h2>
          <p className="mb-4 text-white/80 text-sm">
            Quiz ciblés sur les droits et devoirs du citoyen pour consolider vos connaissances.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quiz?category=Rights+and+duties"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors"
            >
              Quiz droits et devoirs
            </Link>
            <Link
              to="/exams"
              className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Examen blanc complet
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Autres thèmes :{" "}
            <Link to="/themes/valeurs-republique" className="text-[#0055A4] hover:underline">Valeurs de la République</Link>
            {" · "}
            <Link to="/themes/histoire-geographie" className="text-[#0055A4] hover:underline">Histoire & géographie</Link>
            {" · "}
            <Link to="/themes/institutions" className="text-[#0055A4] hover:underline">Institutions françaises</Link>
          </p>
        </div>
      </main>
    </>
  );
}
