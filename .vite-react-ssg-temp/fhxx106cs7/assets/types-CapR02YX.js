function getQuestionOptions(q) {
  return [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
}
const OPTION_KEY_MAP = {
  a: "option_a",
  b: "option_b",
  c: "option_c",
  d: "option_d",
  option_a: "option_a",
  option_b: "option_b",
  option_c: "option_c",
  option_d: "option_d"
};
function getCorrectAnswerText(q) {
  var _a;
  const key = (_a = q.correct_answer) == null ? void 0 : _a.trim().toLowerCase();
  if (key && OPTION_KEY_MAP[key]) {
    return q[OPTION_KEY_MAP[key]] || q.correct_answer;
  }
  return q.correct_answer;
}
const LANGUAGES = {
  fr: "Français",
  en: "English",
  ar: "العربية",
  es: "Español",
  pt: "Português",
  zh: "中文",
  tr: "Türkçe"
};
const LANGUAGE_TO_DB = {
  fr: "fr",
  en: "en",
  ar: "ar",
  es: "es",
  pt: "pt",
  zh: "zh",
  tr: "tr"
};
const CATEGORY_LABELS = {
  fr: {
    "Principles and values of the Republic": "Principes et valeurs de la République",
    "Institutional and political system": "Système institutionnel et politique",
    "Rights and duties": "Droits et devoirs",
    "History, geography and culture": "Histoire, géographie et culture",
    "Living in French society": "Vivre dans la société française",
    Politics: "Politique",
    Society: "Société"
  },
  en: { "Principles and values of the Republic": "Principles", "Institutional and political system": "Institutions", "Rights and duties": "Rights", "History, geography and culture": "History", "Living in French society": "Daily Living", Politics: "Politics", Society: "Society" },
  ar: { "Principles and values of the Republic": "المبادئ", "Institutional and political system": "المؤسسات", "Rights and duties": "الحقوق", "History, geography and culture": "التاريخ", "Living in French society": "الحياة اليومية", Politics: "السياسة", Society: "المجتمع" },
  es: { "Principles and values of the Republic": "Principios", "Institutional and political system": "Instituciones", "Rights and duties": "Derechos", "History, geography and culture": "Historia", "Living in French society": "Vida cotidiana", Politics: "Política", Society: "Sociedad" },
  pt: { "Principles and values of the Republic": "Princípios", "Institutional and political system": "Instituições", "Rights and duties": "Direitos", "History, geography and culture": "História", "Living in French society": "Vida quotidiana", Politics: "Política", Society: "Sociedade" },
  zh: { "Principles and values of the Republic": "原则", "Institutional and political system": "机构", "Rights and duties": "权利", "History, geography and culture": "历史", "Living in French society": "日常生活", Politics: "政治", Society: "社会" },
  tr: { "Principles and values of the Republic": "İlkeler", "Institutional and political system": "Kurumlar", "Rights and duties": "Haklar", "History, geography and culture": "Tarih", "Living in French society": "Günlük Yaşam", Politics: "Siyaset", Society: "Toplum" }
};
const DB_CATEGORIES = [
  "Principles and values of the Republic",
  "Institutional and political system",
  "Rights and duties",
  "History, geography and culture",
  "Living in French society"
];
export {
  CATEGORY_LABELS as C,
  DB_CATEGORIES as D,
  LANGUAGES as L,
  LANGUAGE_TO_DB as a,
  getQuestionOptions as b,
  getCorrectAnswerText as g
};
