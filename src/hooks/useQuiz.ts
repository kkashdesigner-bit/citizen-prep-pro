import { useState, useEffect, useCallback } from 'react';
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/hooks/useQuiz.ts b/src/hooks/useQuiz.ts
index 59c2d566af587f2948046141173b50248511f16b..397f1ebf1587795d8141601c98d9e6185e1d76b3 100644
--- a/src/hooks/useQuiz.ts
+++ b/src/hooks/useQuiz.ts
@@ -2,172 +2,179 @@ import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/hooks/useAuth';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { Question, ExamLevel, LANGUAGE_TO_DB, DB_CATEGORIES } from '@/lib/types';
 
 function shuffle<T>(arr: T[]): T[] {
   const a = [...arr];
   for (let i = a.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [a[i], a[j]] = [a[j], a[i]];
   }
   return a;
 }
 
 export type QuizMode = 'exam' | 'study' | 'training' | 'demo';
 
 export interface UseQuizOptions {
   /** Single category for category training */
   category?: string | null;
   /** Exam level filter */
   level?: ExamLevel;
   /** Quiz mode — determines question count, saving, feedback */
   mode?: QuizMode;
   /** Mini-quiz mode: 5 questions, no timing */
   isMiniQuiz?: boolean;
+  /** Optional explicit question cap from route/query params */
+  questionLimit?: number;
 }
 
 /**
  * Mode-specific question limits:
- * - demo: 10 (free tier)
- * - exam: 20 (standard/premium)
+ * - demo: 20 (free tier)
+ * - exam: 40 (standard/premium)
  * - training: 50 per batch (standard/premium, unlimited via pagination)
  * - study (category training): 20 per category (premium)
  */
 function getQuestionLimit(mode: QuizMode, isMiniQuiz: boolean): number | null {
   if (isMiniQuiz) return 5;
   switch (mode) {
-    case 'demo': return 10;
-    case 'exam': return 20;
+    case 'demo': return 20;
+    case 'exam': return 40;
     case 'training': return 50;
     case 'study': return 20;
     default: return 20;
   }
 }
 
 export function useQuiz({
   category,
   level = 'CSP',
   mode = 'exam',
   isMiniQuiz = false,
+  questionLimit,
 }: UseQuizOptions = {}) {
   const { user } = useAuth();
   const { language } = useLanguage();
   const [questions, setQuestions] = useState<Question[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   // Whether this mode saves answers to the database
   const shouldSaveAnswers = mode !== 'demo';
 
   useEffect(() => {
     const fetchQuestions = async () => {
       setLoading(true);
       setError(null);
 
       // Resolve language
       let dbLang = LANGUAGE_TO_DB[language] || 'fr';
       if (user) {
         const { data: profile } = await supabase
           .from('profiles')
           .select('preferred_language')
           .eq('id', user.id)
           .maybeSingle();
         if (profile?.preferred_language) {
           dbLang = profile.preferred_language;
         }
       }
 
-      const questionLimit = getQuestionLimit(mode, isMiniQuiz);
+      const modeLimit = getQuestionLimit(mode, isMiniQuiz);
+      const resolvedQuestionLimit =
+        typeof questionLimit === 'number' && Number.isFinite(questionLimit) && questionLimit > 0
+          ? questionLimit
+          : modeLimit;
 
       try {
         let allQuestions: Question[] = [];
 
         if (mode === 'exam' && !category) {
           // Balanced exam: distribute questions across categories
           const cats = [...DB_CATEGORIES];
-          const perCat = Math.floor((questionLimit ?? 20) / cats.length);
-          let remainder = (questionLimit ?? 20) - perCat * cats.length;
+          const perCat = Math.floor((resolvedQuestionLimit ?? 40) / cats.length);
+          let remainder = (resolvedQuestionLimit ?? 40) - perCat * cats.length;
 
           const fetches = cats.map(async (cat) => {
             const count = perCat + (remainder-- > 0 ? 1 : 0);
             // Fetch more than needed to allow randomization
             const { data, error: fetchErr } = await supabase
               .from('questions')
               .select('*')
               .eq('language', dbLang)
               .eq('category', cat)
               .eq('level', level)
               .limit(Math.min(count * 4, 100));
 
             if (fetchErr) throw fetchErr;
             return shuffle((data || []) as Question[]).slice(0, count);
           });
 
           const results = await Promise.all(fetches);
           allQuestions = shuffle(results.flat());
         } else {
           // Single category or unfiltered fetch (demo, training, study)
           let q = supabase
             .from('questions')
             .select('*')
             .eq('language', dbLang);
 
           if (category) {
             q = q.eq('category', category);
           }
 
           if (level) {
             q = q.eq('level', level);
           }
 
           // Fetch a larger pool for randomization
-          const fetchSize = questionLimit ? Math.min(questionLimit * 4, 500) : 500;
+          const fetchSize = resolvedQuestionLimit ? Math.min(resolvedQuestionLimit * 4, 500) : 500;
           q = q.limit(fetchSize);
 
           const { data, error: fetchErr } = await q;
           if (fetchErr) throw fetchErr;
 
           allQuestions = shuffle((data || []) as Question[]);
 
-          if (questionLimit && questionLimit > 0) {
-            allQuestions = allQuestions.slice(0, questionLimit);
+          if (resolvedQuestionLimit && resolvedQuestionLimit > 0) {
+            allQuestions = allQuestions.slice(0, resolvedQuestionLimit);
           }
         }
 
         setQuestions(allQuestions);
       } catch (e: any) {
         console.error('Error fetching questions:', e);
         setError(e.message || 'Failed to load questions');
       }
 
       setLoading(false);
     };
 
     fetchQuestions();
     // eslint-disable-next-line react-hooks/exhaustive-deps
-  }, [language, category, user, level, mode, isMiniQuiz]);
+  }, [language, category, user, level, mode, isMiniQuiz, questionLimit]);
 
   /** Save a single answer to user_answers table (skipped in demo mode) */
   const saveAnswer = useCallback(
     async (question: Question, selectedAnswer: string) => {
       if (!user || !shouldSaveAnswers) return;
       const isCorrect = selectedAnswer === question.correct_answer;
       await supabase.from('user_answers' as any).insert({
         user_id: user.id,
         question_id: question.id,
         selected_answer: selectedAnswer,
         is_correct: isCorrect,
         category: question.category,
       });
     },
     [user, shouldSaveAnswers],
   );
 
   return {
     questions,
     loading,
     error,
     saveAnswer,
     isMiniQuiz: !!isMiniQuiz,
     mode,
     shouldSaveAnswers,
)
  };
}
