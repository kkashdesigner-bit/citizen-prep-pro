import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://gocivique.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Guide de l'examen civique", "item": "https://gocivique.fr/guide-examen-civique" },
  ],
};

export default function GuideExamen() {
  return (
    <>
      <SEOHead
        title="Guide Complet de l'Examen Civique 2026 | GoCivique"
        description="Tout ce qu'il faut savoir sur l'examen civique 2026 : format, thèmes, niveau de difficulté, conseils de préparation et ressources pour réussir du premier coup."
        path="/guide-examen-civique"
        schema={breadcrumbSchema}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 text-slate-800">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#0055A4]">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Guide de l'examen civique</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 leading-tight">
          Guide Complet de l'Examen Civique 2026
        </h1>
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          L'examen civique est une étape obligatoire pour obtenir la naturalisation française, la carte de séjour pluriannuelle ou la carte de résident. Ce guide vous explique tout ce qu'il faut savoir pour vous préparer efficacement.
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Qu'est-ce que l'examen civique ?</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          L'examen civique évalue votre connaissance des valeurs, des institutions et de l'histoire de la France. Il est organisé par l'OFII (Office Français de l'Immigration et de l'Intégration) et se déroule en présentiel dans un centre agréé. Réussir cet examen est indispensable pour valider votre contrat d'intégration républicaine (CIR).
        </p>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Format de l'examen</h2>
        <p className="mb-3 text-slate-700 leading-relaxed">
          L'examen dure environ 45 minutes et comprend entre 40 et 60 questions à choix multiples (QCM). Chaque question propose quatre réponses possibles, dont une seule est correcte. Le seuil de réussite est généralement fixé à 50 % des bonnes réponses.
        </p>
        <ul className="mb-6 list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Format :</strong> QCM (questions à choix multiples)</li>
          <li><strong>Durée :</strong> 45 minutes</li>
          <li><strong>Nombre de questions :</strong> 40 à 60 questions</li>
          <li><strong>Langue :</strong> Français (niveau A2 minimum requis)</li>
          <li><strong>Lieu :</strong> Centre de formation OFII ou établissement agréé</li>
        </ul>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Les 5 grands thèmes du programme</h2>
        <p className="mb-4 text-slate-700 leading-relaxed">
          Le programme officiel couvre cinq domaines principaux. Chaque thème représente environ 20 % des questions :
        </p>
        <div className="mb-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4]">1. Principes et valeurs de la République</h3>
            <p className="mt-1 text-sm text-slate-600">La devise Liberté, Égalité, Fraternité, la laïcité, les droits de l'homme, la Déclaration des droits de 1789.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4]">2. Histoire et géographie de la France</h3>
            <p className="mt-1 text-sm text-slate-600">Les grandes dates de l'histoire, la Révolution, les guerres mondiales, la géographie du territoire, les symboles nationaux.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4]">3. Institutions et système politique</h3>
            <p className="mt-1 text-sm text-slate-600">La Ve République, les pouvoirs exécutif, législatif et judiciaire, le rôle du Président et du Parlement.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4]">4. Droits et devoirs des citoyens</h3>
            <p className="mt-1 text-sm text-slate-600">Le droit de vote, le service national, les obligations fiscales, les libertés fondamentales, l'égalité homme-femme.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold text-[#0055A4]">5. Vivre en société française</h3>
            <p className="mt-1 text-sm text-slate-600">Le système éducatif, la sécurité sociale, le monde du travail, la culture française, les services publics.</p>
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Conseils pour bien se préparer</h2>
        <ol className="mb-6 list-decimal pl-6 space-y-3 text-slate-700">
          <li><strong>Commencez tôt :</strong> Prévoyez au minimum 4 à 6 semaines de préparation régulière (30 minutes par jour).</li>
          <li><strong>Faites des quiz régulièrement :</strong> La répétition est la clé. Entraînez-vous avec des QCM dans les conditions de l'examen.</li>
          <li><strong>Réviserz par thème :</strong> Identifiez vos points faibles en consultant vos statistiques après chaque entraînement.</li>
          <li><strong>Lisez le livret d'accueil :</strong> Le document officiel remis lors de la signature du CIR contient l'essentiel du programme.</li>
          <li><strong>Faites des examens blancs :</strong> Simulez les conditions réelles avec 40 questions en 45 minutes pour vous habituer au rythme.</li>
        </ol>

        <h2 className="mb-3 text-2xl font-bold text-slate-900">Niveau de difficulté</h2>
        <p className="mb-6 text-slate-700 leading-relaxed">
          L'examen est accessible à toute personne ayant suivi une formation civique ou s'y étant préparée sérieusement. Les questions portent sur des notions fondamentales enseignées lors des sessions de formation OFII. Avec une préparation sérieuse de 4 à 6 semaines, la majorité des candidats réussissent dès le premier passage.
        </p>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] p-6 text-white">
          <h2 className="mb-2 text-xl font-bold">Prêt à vous entraîner ?</h2>
          <p className="mb-4 text-white/80 text-sm">
            GoCivique propose des quiz interactifs et des examens blancs chronométrés pour vous préparer dans les meilleures conditions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quiz"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0055A4] hover:bg-white/90 transition-colors"
            >
              Quiz gratuit
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
            En savoir plus :{" "}
            <Link to="/about" className="text-[#0055A4] hover:underline">À propos de GoCivique</Link>
            {" · "}
            <Link to="/themes/valeurs-republique" className="text-[#0055A4] hover:underline">Valeurs de la République</Link>
            {" · "}
            <Link to="/themes/institutions" className="text-[#0055A4] hover:underline">Institutions françaises</Link>
          </p>
        </div>
      </main>
    </>
  );
}
