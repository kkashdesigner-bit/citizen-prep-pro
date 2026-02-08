export type Category = 'Principles' | 'Institutions' | 'Rights' | 'History' | 'Living';

export interface Question {
  id: string;
  category: Category;
  question_fr: string;
  question_translated: string | null;
  options: string[];
  correct_answer: string;
  explanation: string | null;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
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

export const CATEGORY_LABELS: Record<Language, Record<Category, string>> = {
  fr: { Principles: 'Principes', Institutions: 'Institutions', Rights: 'Droits', History: 'Histoire', Living: 'Vie quotidienne' },
  en: { Principles: 'Principles', Institutions: 'Institutions', Rights: 'Rights', History: 'History', Living: 'Daily Living' },
  ar: { Principles: 'المبادئ', Institutions: 'المؤسسات', Rights: 'الحقوق', History: 'التاريخ', Living: 'الحياة اليومية' },
  es: { Principles: 'Principios', Institutions: 'Instituciones', Rights: 'Derechos', History: 'Historia', Living: 'Vida cotidiana' },
  pt: { Principles: 'Princípios', Institutions: 'Instituições', Rights: 'Direitos', History: 'História', Living: 'Vida quotidiana' },
  zh: { Principles: '原则', Institutions: '机构', Rights: '权利', History: '历史', Living: '日常生活' },
};
