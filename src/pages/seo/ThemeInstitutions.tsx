import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Institutions françaises", "item": "https://gocivique.fr/themes/institutions" },
  ],
};

export default function ThemeInstitutions() {
  return (
    <>
      <SEOHead
        title="Institutions et Système Politique Français — Examen Civique | GoCivique"
        description="Président, Parlement, gouvernement, justice : comprenez le fonctionnement des institutions françaises pour réussir l'examen civique de naturalisation 2026."
        path="/themes/institutions"
        schema={breadcrumbSchema}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Institutions françaises</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 leading-tight">
          Institutions et Système Politique Français
        </h1>
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          La France est une République dont les institutions reposent sur la Constitution de 1958. Comprendre la séparation des pouvoirs et le rôle de chaque institution est essentiel pour l'examen civique.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La Ve République</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          La France vit sous la Ve République depuis 1958. Ce régime semi-présidentiel accorde un rôle prépondérant au Président de la République, élu au suffrage universel direct depuis 1962. La Constitution du 4 octobre 1958 reste le texte de référence, révisé à plusieurs reprises depuis lors.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La séparation des pouvoirs</h2>
        <div className="mb-6 space-y-4">
          <div className="rounded-xl border-l-4 border-[#0055A4] bg-blue-50 p-4">
            <h3 className="font-bold text-slate-900">⚡ Pouvoir exécutif</h3>
            <p className="mt-1 text-sm text-slate-700">Exercé par le <strong>Président de la République</strong> et le <strong>Premier ministre</strong>. Le Président dirige la politique étrangère et la défense ; le gouvernement conduit la politique intérieure.</p>
          </div>
          <div className="rounded-xl border-l-4 border-[#EF4135] bg-red-50 p-4">
            <h3 className="font-bold text-slate-900">🏛️ Pouvoir législatif</h3>
            <p className="mt-1 text-sm text-slate-700">Exercé par le <strong>Parlement</strong>, composé de l'Assemblée nationale (577 députés) et du Sénat (348 sénateurs). Il vote les lois et contrôle le gouvernement.</p>
          </div>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <h3 className="font-bold text-slate-900">⚖️ Pouvoir judiciaire</h3>
            <p className="mt-1 text-sm text-slate-700">Exercé par la <strong>magistrature</strong> (tribunaux, cours d'appel, Cour de cassation). Le Conseil d'État juge les conflits avec l'administration. Le Conseil constitutionnel vérifie la conformité des lois à la Constitution.</p>
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Le Président de la République</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          Le Président de la République est élu au suffrage universel direct pour un mandat de <strong>5 ans</strong> (quinquennat), renouvelable une fois. Il est le chef des armées et garant de la Constitution.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li>Nomme le Premier ministre</li>
          <li>Préside le Conseil des ministres</li>
          <li>Peut dissoudre l'Assemblée nationale</li>
          <li>Dirige la politique étrangère</li>
          <li>Peut organiser un référendum</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Le Parlement</h2>
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4] mb-2">Assemblée nationale</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• 577 députés</li>
              <li>• Élus pour 5 ans au suffrage universel direct</li>
              <li>• Siège au Palais Bourbon (Paris)</li>
              <li>• Peut renverser le gouvernement (motion de censure)</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4] mb-2">Sénat</h3>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• 348 sénateurs</li>
              <li>• Élus pour 6 ans par des grands électeurs</li>
              <li>• Siège au Palais du Luxembourg (Paris)</li>
              <li>• Représente les collectivités territoriales</li>
            </ul>
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">L'organisation territoriale</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          La France est divisée en collectivités territoriales à différents niveaux :
        </p>
        <div className="mb-6 space-y-2">
          {[
            { niveau: "Communes", nb: "~35 000", detail: "Dirigées par un maire élu" },
            { niveau: "Départements", nb: "101", detail: "96 en métropole + 5 outre-mer, dirigés par un Conseil départemental" },
            { niveau: "Régions", nb: "18", detail: "13 en métropole + 5 outre-mer, dirigées par un Conseil régional" },
          ].map(({ niveau, nb, detail }) => (
            <div key={niveau} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="w-24 text-right text-xs font-bold text-[#0055A4] uppercase">{niveau}</span>
              <span className="text-sm font-semibold text-slate-800">{nb}</span>
              <span className="text-sm text-slate-600">{detail}</span>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Questions types à l'examen</h2>
        <div className="mb-8 space-y-3">
          {[
            { q: "Combien de temps dure le mandat du Président de la République ?", a: "5 ans (quinquennat)" },
            { q: "Combien y a-t-il de députés à l'Assemblée nationale ?", a: "577 députés" },
            { q: "Qui nomme le Premier ministre ?", a: "Le Président de la République" },
            { q: "Combien y a-t-il de régions en France métropolitaine ?", a: "13 régions" },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">❓ {q}</p>
              <p className="mt-1 text-sm text-[#0055A4] font-medium">✅ {a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white">
          <h2 className="mb-2 text-xl font-bold">Entraînez-vous sur les institutions</h2>
          <p className="mb-4 text-white/80 text-sm">
            Quiz interactif sur les institutions et le système politique français.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quiz?category=Institutional+and+political+system"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors"
            >
              Quiz institutions
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
            <Link to="/themes/droits-devoirs" className="text-[#0055A4] hover:underline">Droits et devoirs</Link>
          </p>
        </div>
      </main>
    </>
  );
}
