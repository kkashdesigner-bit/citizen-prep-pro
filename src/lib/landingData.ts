export const EXAM_STATS = {
  totalQuestions: 7034,
  examQuestions: 40,
  examMinutes: 45,
  passScore: 32,
  passPercent: 80,
  themes: 5,
  totalCourses: 100,
};

export const EXAM_THEMES = [
  {
    id: 'valeurs',
    label: 'Valeurs de la République',
    examQuestions: 11,
    icon: '⚖️',
    color: '#0055A4',
    image: '/examen-civique-qcm-valeurs-republique-francaise.jpg',
    imageAlt: 'Quiz valeurs de la République — examen civique GoCivique',
    desc: 'Liberté, Égalité, Fraternité — laïcité, symboles, drapeau, Marseillaise.',
  },
  {
    id: 'institutions',
    label: 'Institutions et politique',
    examQuestions: 6,
    icon: '🏛️',
    color: '#4F46E5',
    image: '/examen-civique-qcm-institutions-systeme-politique.jpg',
    imageAlt: 'Quiz institutions françaises — examen civique GoCivique',
    desc: 'Président, Parlement, gouvernement, collectivités territoriales.',
  },
  {
    id: 'droits',
    label: 'Droits et devoirs',
    examQuestions: 11,
    icon: '📜',
    color: '#059669',
    image: '/examen-civique-qcm-droits-devoirs-citoyen.jpg',
    imageAlt: 'Quiz droits et devoirs citoyen — examen civique GoCivique',
    desc: 'Droits fondamentaux, libertés garanties, obligations civiques.',
  },
  {
    id: 'histoire',
    label: 'Histoire, géographie et culture',
    examQuestions: 8,
    icon: '🗺️',
    color: '#D97706',
    image: '/examen-civique-qcm-histoire-geographie-culture.jpg',
    imageAlt: 'Quiz histoire géographie — examen civique GoCivique',
    desc: 'Révolution, grandes périodes, géographie, patrimoine culturel.',
  },
  {
    id: 'societe',
    label: 'Vivre en société',
    examQuestions: 4,
    icon: '🤝',
    color: '#EF4135',
    image: '/examen-civique-qcm-vivre-societe-integration.jpg',
    imageAlt: 'Quiz vivre en société — examen civique GoCivique',
    desc: 'Santé, éducation, logement, travail — la vie quotidienne en France.',
  },
];

export const FAQ_ITEMS = [
  {
    q: "L'examen civique est-il obligatoire en 2026 ?",
    a: "Oui, depuis le 1er janvier 2026, l'examen civique est obligatoire pour toute première demande de CSP, carte de résident ou naturalisation. Le seuil est 80% (32/40).",
  },
  {
    q: "Combien de questions comporte l'examen civique ?",
    a: "40 questions réparties en 5 thèmes. La durée est de 45 minutes sur ordinateur.",
  },
  {
    q: "Quels sont les 5 thèmes ?",
    a: "Valeurs (11 q), Institutions (6 q), Droits et devoirs (11 q), Histoire/géo/culture (8 q), Vivre en société (4 q).",
  },
  {
    q: "Où passer l'examen civique ?",
    a: "Dans des centres agréés par Le français des affaires (CCI Paris Île-de-France), désigné par le Ministère de l'Intérieur.",
  },
  {
    q: "Le résultat est-il valable à vie ?",
    a: "Oui. Une fois réussi, le résultat est valable à vie.",
  },
  {
    q: "Comment se préparer efficacement ?",
    a: "15 minutes par jour pendant une semaine suffisent généralement. GoCivique propose 7 034 questions officielles et 100 cours structurés.",
  },
  {
    q: "L'examen est-il obligatoire pour la carte de séjour temporaire ?",
    a: "Non — uniquement pour la CSP, la carte de résident et la naturalisation.",
  },
  {
    q: "Quel est le taux de réussite ?",
    a: "32/40 suffit (80%). Pas de point négatif. Nos utilisateurs atteignent en moyenne 85% après entraînement.",
  },
];
