import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide", "item": "https://gocivique.fr/guide-examen-civique" },
    { "@type": "ListItem", "position": 3, "name": "Valeurs de la République", "item": "https://gocivique.fr/themes/valeurs-republique" },
  ],
};

export default function ThemeValeurs() {
  return (
    <>
      <SEOHead
        title="Valeurs de la République Française — Examen Civique | GoCivique"
        description="Liberté, Égalité, Fraternité, laïcité, droits de l'homme : maîtrisez les principes et valeurs fondamentaux de la République française pour réussir l'examen civique."
        path="/themes/valeurs-republique"
        schema={breadcrumbSchema}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/guide-examen-civique" className="hover:text-[#0055A4]">Guide</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Valeurs de la République</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 leading-tight">
          Principes et Valeurs de la République Française
        </h1>
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          Ce thème représente environ 20 % des questions à l'examen civique. Il couvre la devise nationale, les principes fondateurs de la République et les valeurs que tout résident est appelé à respecter en France.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La devise : Liberté, Égalité, Fraternité</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          Adoptée définitivement après la Révolution française, la devise <strong>Liberté, Égalité, Fraternité</strong> est gravée sur les frontons des bâtiments publics et figure dans la Constitution. Elle résume l'idéal républicain français.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Liberté :</strong> droits et libertés fondamentaux (expression, conscience, circulation, réunion).</li>
          <li><strong>Égalité :</strong> égalité devant la loi, égalité des droits entre hommes et femmes, non-discrimination.</li>
          <li><strong>Fraternité :</strong> solidarité nationale, cohésion sociale, aide aux plus vulnérables.</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">La laïcité</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          La laïcité est un principe fondamental de la République française, inscrit dans la loi de 1905 sur la séparation de l'Église et de l'État. Elle garantit la liberté de conscience et la neutralité de l'État vis-à-vis de toutes les religions.
        </p>
        <div className="mb-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>À retenir pour l'examen :</strong> La laïcité ne signifie pas l'interdiction de la religion, mais la séparation entre sphère publique (État, école, services publics) et sphère privée (croyances individuelles). En France, toutes les religions sont autorisées et égales devant la loi.
          </p>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les droits de l'homme</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          La <strong>Déclaration des droits de l'homme et du citoyen</strong> du 26 août 1789 est un texte fondateur. Elle proclame des droits naturels et imprescriptibles : liberté, propriété, sûreté et résistance à l'oppression. Elle est intégrée au préambule de la Constitution de 1958.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li>Article 1 : « Les hommes naissent et demeurent libres et égaux en droits. »</li>
          <li>Principe de présomption d'innocence</li>
          <li>Liberté d'opinion et d'expression</li>
          <li>Droit à la propriété</li>
          <li>Égalité devant l'impôt</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les symboles de la République</h2>
        <div className="mb-6 grid sm:grid-cols-2 gap-4">
          {[
            { sym: "🇫🇷 Le drapeau tricolore", desc: "Bleu, blanc, rouge — adopté lors de la Révolution française (1789). Composé de trois bandes verticales égales." },
            { sym: "🎵 La Marseillaise", desc: "Hymne national composé en 1792 par Rouget de Lisle. Chantée lors des cérémonies officielles et événements sportifs." },
            { sym: "🐓 Le coq gaulois", desc: "Symbole non officiel mais emblématique, associé à la France depuis l'Antiquité, présent sur de nombreux blasons." },
            { sym: "👩 Marianne", desc: "Figure allégorique de la République, représentée coiffée du bonnet phrygien, symbole de liberté." },
          ].map(({ sym, desc }) => (
            <div key={sym} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-bold text-slate-800 mb-1">{sym}</p>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">L'égalité homme-femme</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          L'égalité entre les femmes et les hommes est une valeur constitutionnelle en France depuis 1999. Les femmes ont obtenu le droit de vote en 1944. La loi interdit toute discrimination fondée sur le sexe dans l'emploi, l'éducation et la vie publique. L'égalité homme-femme est une valeur républicaine non négociable.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Questions fréquentes à l'examen</h2>
        <div className="mb-8 space-y-3">
          {[
            { q: "Quelle est la devise de la République française ?", a: "Liberté, Égalité, Fraternité" },
            { q: "En quelle année a été promulguée la loi sur la séparation de l'Église et de l'État ?", a: "1905" },
            { q: "Combien de bandes composent le drapeau français ?", a: "Trois bandes verticales (bleu, blanc, rouge)" },
            { q: "Quel est l'hymne national français ?", a: "La Marseillaise" },
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
            Testez vos connaissances avec des questions portant spécifiquement sur les principes et valeurs de la République.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quiz?category=Principles+and+values+of+the+Republic"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors"
            >
              Quiz sur ce thème
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
            <Link to="/themes/histoire-geographie" className="text-[#0055A4] hover:underline">Histoire & géographie</Link>
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
