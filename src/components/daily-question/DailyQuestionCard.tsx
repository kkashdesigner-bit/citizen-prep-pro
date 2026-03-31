import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { Button } from '@/components/ui/button';

export default function DailyQuestionCard() {
  const { dailyQuestion, hasAnswered, userAnswer, isCorrect, loading, submitAnswer } = useDailyQuestion();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading || !dailyQuestion?.question) return null;

  const q = dailyQuestion.question;
  const options = [
    { key: 'A', value: q.option_a },
    { key: 'B', value: q.option_b },
    { key: 'C', value: q.option_c },
    { key: 'D', value: q.option_d },
  ];

  const correctKey = q.correct_answer?.toUpperCase();

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    await submitAnswer(selected);
    setSubmitting(false);
  };

  const getOptionStyle = (key: string) => {
    if (!hasAnswered) {
      return selected === key
        ? 'border-[#0055A4] bg-[#0055A4]/5 ring-2 ring-[#0055A4]/20'
        : 'border-slate-200 hover:border-[#0055A4]/40 hover:bg-slate-50';
    }
    // After answering
    if (key === correctKey) return 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200';
    if (key === userAnswer?.toUpperCase() && key !== correctKey) return 'border-red-400 bg-red-50 ring-2 ring-red-200';
    return 'border-slate-200 opacity-60';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gradient-to-br from-indigo-50 via-blue-50 to-white rounded-2xl border border-blue-100 shadow-[0_2px_12px_rgba(0,85,164,0.06)] p-5 md:p-6 overflow-hidden"
    >
      {/* Decorative */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0055A4]/10 text-[#0055A4]">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">Question du jour</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{dailyQuestion.category}</span>
      </div>

      {/* Question */}
      <p className="text-base sm:text-lg font-bold text-slate-900 mb-5 leading-relaxed">{q.question_text}</p>

      {/* Options */}
      <div className="grid gap-2.5 mb-4">
        {options.map(({ key, value }) => (
          <motion.button
            key={key}
            whileTap={!hasAnswered ? { scale: 0.98 } : undefined}
            disabled={hasAnswered}
            onClick={() => setSelected(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${getOptionStyle(key)} ${!hasAnswered ? 'cursor-pointer' : ''}`}
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              hasAnswered && key === correctKey
                ? 'bg-emerald-500 text-white'
                : hasAnswered && key === userAnswer?.toUpperCase() && key !== correctKey
                ? 'bg-red-400 text-white'
                : selected === key && !hasAnswered
                ? 'bg-[#0055A4] text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {hasAnswered && key === correctKey ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : hasAnswered && key === userAnswer?.toUpperCase() && key !== correctKey ? (
                <XCircle className="w-4 h-4" />
              ) : (
                key
              )}
            </span>
            <span className="text-sm font-medium text-slate-700">{value}</span>
          </motion.button>
        ))}
      </div>

      {/* Submit button or Result */}
      <AnimatePresence mode="wait">
        {!hasAnswered ? (
          <motion.div key="submit" exit={{ opacity: 0, y: -8 }}>
            <Button
              disabled={!selected || submitting}
              onClick={handleSubmit}
              className="w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 shadow-[0_4px_14px_rgba(0,85,164,0.2)] transition-all"
            >
              {submitting ? 'Envoi...' : 'Valider ma réponse'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">Bonne réponse !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Pas tout à fait...</span>
                </>
              )}
            </div>
            {q.explanation && (
              <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
