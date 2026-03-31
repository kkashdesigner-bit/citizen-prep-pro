import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, XCircle, RotateCcw, X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFlashQuiz } from '@/hooks/useFlashQuiz';

interface FlashQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FlashQuizModal({ open, onOpenChange }: FlashQuizModalProps) {
  const { questions, currentIndex, currentQuestion, answers, loading, finished, score, total, startQuiz, submitAnswer, reset } = useFlashQuiz();
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  // Start quiz when modal opens
  useEffect(() => {
    if (open && questions.length === 0 && !loading) {
      startQuiz();
    }
  }, [open, questions.length, loading, startQuiz]);

  // Reset selection on question change
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [currentIndex]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };

  const handleAnswer = (key: string) => {
    if (answered || !currentQuestion) return;
    setSelected(key);
    setAnswered(true);
    submitAnswer(currentQuestion.id, key);
  };

  const handleReplay = () => {
    reset();
    startQuiz();
  };

  if (!open) return null;

  const q = currentQuestion;
  const options = q
    ? [
        { key: 'A', value: q.option_a },
        { key: 'B', value: q.option_b },
        { key: 'C', value: q.option_c },
        { key: 'D', value: q.option_d },
      ]
    : [];
  const correctKey = q?.correct_answer?.toUpperCase();

  const getOptionStyle = (key: string) => {
    if (!answered) {
      return selected === key
        ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
        : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50';
    }
    if (key === correctKey) return 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200';
    if (key === selected && key !== correctKey) return 'border-red-400 bg-red-50 ring-2 ring-red-200';
    return 'border-slate-200 opacity-50';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 sm:max-w-[520px] bg-white border-0 rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5" />
            <span className="font-bold text-sm">Quiz Flash</span>
          </div>
          {!finished && questions.length > 0 && (
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-1.5 rounded-full transition-all ${
                    i < currentIndex
                      ? answers[questions[i].id]?.correct
                        ? 'bg-emerald-400'
                        : 'bg-red-400'
                      : i === currentIndex
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-violet-600 border-t-transparent" />
            </div>
          ) : finished ? (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Quiz terminé !</h3>
              <p className="text-3xl font-black text-violet-600 mb-1">{score}/{total}</p>
              <p className="text-sm text-slate-500 mb-6">
                {score === total ? 'Parfait ! 🎉' : score >= 3 ? 'Bien joué !' : 'Continuez à vous entraîner !'}
              </p>
              <div className="flex gap-3">
                <Button onClick={handleReplay} variant="outline" className="flex-1 rounded-xl h-10 font-bold gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  Rejouer
                </Button>
                <Button onClick={handleClose} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-10 font-bold">
                  Fermer
                </Button>
              </div>
            </motion.div>
          ) : q ? (
            /* Question */
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Question {currentIndex + 1}/{total}
                </p>
                <p className="text-base font-bold text-slate-900 mb-5 leading-relaxed">{q.question_text}</p>

                <div className="grid gap-2.5">
                  {options.map(({ key, value }) => (
                    <motion.button
                      key={key}
                      whileTap={!answered ? { scale: 0.98 } : undefined}
                      disabled={answered}
                      onClick={() => handleAnswer(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer ${getOptionStyle(key)}`}
                    >
                      <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        answered && key === correctKey
                          ? 'bg-emerald-500 text-white'
                          : answered && key === selected && key !== correctKey
                          ? 'bg-red-400 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {answered && key === correctKey ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : answered && key === selected && key !== correctKey ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          key
                        )}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{value}</span>
                    </motion.button>
                  ))}
                </div>

                {answered && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3"
                  >
                    <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
