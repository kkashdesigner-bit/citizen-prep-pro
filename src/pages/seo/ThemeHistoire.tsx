import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Histoire et géographie", "item": "https://gocivique.fr/themes/histoire-geographie" },
  ],
};

export default function ThemeHistoire() {
  return (
    <>
      <SEOHead
        title="Histoire et Géographie de France — Examen Civique | GoCivique"
        description="Révolutions, guerres mondiales, géographie et symboles : maîtrisez le thème Histoire et géographie de la France pour réussir l'examen civique de naturalisation."
        path="/themes/histoire-geographie"
        schema={breadcrumbSchema}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Histoire et géographie</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 leading-tight">
          Histoire et Géographie de France — Examen Civique
        </h1>
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          Ce thème couvre les grandes étapes de l'histoire française, les événements fondateurs de la République, et les données essentielles sur le territoire et la géographie du pays.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les grandes dates à connaître</h2>
        <div className="mb-6 space-y-3">
          {[
            { date: "843", event: "Traité de Verdun — Naissance du royaume de France" },
            { date: "1515", event: "Bataille de Marignan — François Ier, roi de France" },
            { date: "1789", event: "Révolution française — Déclaration des droits de l'homme et du citoyen" },
            { date: "1792", event: "Proclamation de la Ire République" },
            { date: "1804", event: "Napoléon devient Empereur — Ier Empire" },
            { date: "1870-1871", event: "Guerre franco-prussienne — Naissance de la IIIe République" },
            { date: "1905", event: "Loi de séparation de l'Église et de l'État" },
            { date: "1914-1918", event: "Première Guerre mondiale" },
            { date: "1939-1945", event: "Seconde Guerre mondiale — Résistance et Libération" },
            { date: "1944", event: "Droit de vote accordé aux femmes" },
            { date: "1958", event: "Naissance de la Ve République — Constitution actuelle" },
            { date: "1992", event: "Traité de Maastricht — Construction européenne" },
          ].map(({ date, event }) => (
            <div key={date} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="flex-shrink-0 w-16 text-right font-bold text-[#0055A4] text-sm">{date}</span>
              <span className="text-sm text-slate-700">{event}</span>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La Révolution française (1789)</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          La Révolution française est l'événement fondateur de la République. Le 14 juillet 1789, la prise de la Bastille marque le début de la Révolution. C'est cette date qui est célébrée chaque année comme fête nationale française. La Déclaration des droits de l'homme et du citoyen (août 1789) pose les bases des libertés fondamentales toujours en vigueur.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les deux guerres mondiales</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          La France a joué un rôle central dans les deux conflits mondiaux du XXe siècle.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>1914-1918 :</strong> La France perd 1,4 million de soldats. La victoire est célébrée le 11 novembre (Armistice), jour de commémoration nationale.</li>
          <li><strong>1939-1945 :</strong> La France est occupée par l'Allemagne nazie (1940-1944). Le général de Gaulle lance l'Appel du 18 juin 1940 depuis Londres et dirige la France libre. La Résistance intérieure combat l'occupant. La Libération de Paris a lieu en août 1944.</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La Ve République et la Constitution de 1958</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          La Ve République a été fondée par le général de Gaulle en 1958, en réponse à la crise algérienne. La Constitution du 4 octobre 1958 est le texte fondamental qui régit encore aujourd'hui les institutions françaises. Elle établit un régime semi-présidentiel où le Président de la République joue un rôle central.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Géographie de la France</h2>
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          {[
            { titre: "Superficie", info: "551 695 km² (métropole) — 6e pays d'Europe par la superficie" },
            { titre: "Population", info: "Environ 68 millions d'habitants" },
            { titre: "Capitale", info: "Paris — siège des principales institutions" },
            { titre: "Frontières terrestres", info: "Belgique, Luxembourg, Allemagne, Suisse, Italie, Monaco, Espagne, Andorre" },
            { titre: "Plus haut sommet", info: "Mont-Blanc (4 808 m) — Alpes" },
            { titre: "Principaux fleuves", info: "La Loire, la Seine, le Rhône, la Garonne" },
            { titre: "Outre-mer", info: "5 régions d'outre-mer : Guadeloupe, Martinique, Guyane, La Réunion, Mayotte" },
            { titre: "Union européenne", info: "Membre fondateur de l'UE — utilise l'euro depuis 2002" },
          ].map(({ titre, info }) => (
            <div key={titre} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold text-[#0055A4] uppercase tracking-wide">{titre}</p>
              <p className="mt-1 text-sm text-slate-700">{info}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Questions types à l'examen</h2>
        <div className="mb-8 space-y-3">
          {[
            { q: "Quelle date est célébrée comme fête nationale en France ?", a: "Le 14 juillet (prise de la Bastille, 1789)" },
            { q: "Quel général a lancé l'Appel du 18 juin 1940 ?", a: "Le général de Gaulle" },
            { q: "En quelle année les femmes ont-elles obtenu le droit de vote en France ?", a: "1944" },
            { q: "Quel est le plus haut sommet de France ?", a: "Le Mont-Blanc (4 808 m)" },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">❓ {q}</p>
              <p className="mt-1 text-sm text-[#0055A4] font-medium">✅ {a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white">
          <h2 className="mb-2 text-xl font-bold">Testez vos connaissances en histoire</h2>
          <p className="mb-4 text-white/80 text-sm">
            Quiz ciblés sur l'histoire et la géographie de France pour renforcer ce thème avant l'examen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quiz?category=History%2C+geography+and+culture"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors"
            >
              Quiz histoire-géographie
            </Link>
            <Link
              to="/exams"
              className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Examen blanc
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Autres thèmes :{" "}
            <Link to="/themes/valeurs-republique" className="text-[#0055A4] hover:underline">Valeurs de la République</Link>
            {" · "}
            <Link to="/themes/institutions" className="text-[#0055A4] hover:underline">Institutions</Link>
            {" · "}
            <Link to="/themes/droits-devoirs" className="text-[#0055A4] hover:underline">Droits et devoirs</Link>
          </p>
        </div>
      </main>
    </>
  );
}
