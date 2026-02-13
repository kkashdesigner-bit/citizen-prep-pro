export type Category = 'Principles' | 'Institutions' | 'Rights' | 'History' | 'Living' | 'Politics' | 'Society';

export type Subcategory =
  | 'Symbole' | 'Laïcité' | 'Situational'
  | 'Democracy' | 'Organization' | 'Europe'
  | 'Fundamental' | 'Duties'
  | 'Periods' | 'Geo' | 'Heritage'
  | 'Residence' | 'Health' | 'Work' | 'Education';

export type ExamLevel = 'CSP' | 'CR' | 'Naturalisation';

/** Matches the actual Supabase `questions` table schema */
export interface Question {
  id: number;
  category: string;
  subcategory: string | null;
  level: ExamLevel | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  language: string;
  /** Translated fields for bilingual support */
  question_translated: string | null;
  option_a_translated: string | null;
  option_b_translated: string | null;
  option_c_translated: string | null;
  option_d_translated: string | null;
}

/** Convenience: get options as array */
export function getQuestionOptions(q: Question): string[] {
  return [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>;
  mode: 'exam' | 'study';
  startTime: number;
  timeRemaining: number;
  isFinished: boolean;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}

export type Language = 'fr' | 'en' | 'ar' | 'es' | 'pt' | 'zh';

export const LANGUAGES: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  pt: 'Português',
  zh: '中文',
};

/** Map app languages to DB language codes */
export const LANGUAGE_TO_DB: Record<Language, string> = {
  fr: 'fr',
  en: 'en',
  ar: 'ar',
  es: 'es',
  pt: 'pt',
  zh: 'zh',
};

export const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  fr: { Principles: 'Principes', Institutions: 'Institutions', Rights: 'Droits', History: 'Histoire', Living: 'Vie quotidienne', Politics: 'Politique', Society: 'Société' },
  en: { Principles: 'Principles', Institutions: 'Institutions', Rights: 'Rights', History: 'History', Living: 'Daily Living', Politics: 'Politics', Society: 'Society' },
  ar: { Principles: 'المبادئ', Institutions: 'المؤسسات', Rights: 'الحقوق', History: 'التاريخ', Living: 'الحياة اليومية', Politics: 'السياسة', Society: 'المجتمع' },
  es: { Principles: 'Principios', Institutions: 'Instituciones', Rights: 'Derechos', History: 'Historia', Living: 'Vida cotidiana', Politics: 'Política', Society: 'Sociedad' },
  pt: { Principles: 'Princípios', Institutions: 'Instituições', Rights: 'Direitos', History: 'História', Living: 'Vida quotidiana', Politics: 'Política', Society: 'Sociedade' },
  zh: { Principles: '原则', Institutions: '机构', Rights: '权利', History: '历史', Living: '日常生活', Politics: '政治', Society: '社会' },
};

/** All seven exam categories */
export const DB_CATEGORIES = ['Principles', 'Institutions', 'Rights', 'History', 'Living', 'Politics', 'Society'] as const;

export const EXAM_LEVEL_LABELS: Record<ExamLevel, { name: string; description: string }> = {
  CSP: {
    name: 'CSP',
    description: 'Carte de Séjour Pluriannuelle — valeurs républicaines fondamentales',
  },
  CR: {
    name: 'CR',
    description: 'Carte de Résident — institutions et contexte de résidence',
  },
  Naturalisation: {
    name: 'Naturalisation',
    description: 'Expert — patrimoine, Constitution et histoire approfondie',
  },
};
