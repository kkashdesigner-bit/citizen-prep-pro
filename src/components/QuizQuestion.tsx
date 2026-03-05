import { useState } from 'react';
import { Question, getQuestionOptions, getCorrectAnswerText } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info, Flag, AlertTriangle, Send } from 'lucide-react';
import { playCorrectSound, playIncorrectSound } from '@/lib/sounds';
import { useEffect, useRef } from 'react';
import TranslateButton from '@/components/TranslateButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORY_LABELS, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  showTranslateButton?: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback,
  showTranslateButton = false,
}: QuizQuestionProps) {
  const { language } = useLanguage();
  const options = getQuestionOptions(question);
  const correctAnswerText = getCorrectAnswerText(question);
  const isCorrect = selectedAnswer === correctAnswerText;
  const hasAnswered = selectedAnswer !== undefined;
  const soundPlayed = useRef(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Translate category based on current language
  const categoryLabel = CATEGORY_LABELS[language as keyof typeof CATEGORY_LABELS]?.[question.category as Category] || question.category;

  useEffect(() => {
    if (showFeedback && hasAnswered && !soundPlayed.current) {
      soundPlayed.current = true;
      if (isCorrect) playCorrectSound();
      else playIncorrectSound();
    }
  }, [showFeedback, hasAnswered, isCorrect]);

  useEffect(() => {
    soundPlayed.current = false;
  }, [question.id]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-sm border-border/50">
          Question {questionNumber} sur {totalQuestions}
        </Badge>
        <Badge variant="secondary">{categoryLabel}</Badge>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">
          {question.question_text}
        </h2>

        <TranslateButton
          text={question.question_text}
          onTranslated={(translated) => {
            void translated;
          }}
        />

        {/* Report Button */}
        <div className="mt-2">
          {!showReportForm ? (
            <button
              onClick={() => setShowReportForm(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-500 transition-colors font-medium"
            >
              <Flag className="h-3.5 w-3.5" />
              Signaler un problème
            </button>
          ) : (
            <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Signaler cette question
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'typo', label: 'Faute de frappe' },
                  { value: 'wrong_answer', label: 'Réponse incorrecte' },
                  { value: 'unclear', label: 'Question floue' },
                  { value: 'other', label: 'Autre problème' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setReportReason(opt.value)}
                    className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${reportReason === opt.value
                        ? 'border-orange-400 bg-orange-100 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => { setShowReportForm(false); setReportReason(''); }}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  className="text-xs bg-orange-500 hover:bg-orange-600 text-white gap-1.5"
                  disabled={!reportReason}
                  onClick={() => {
                    toast.success('Merci pour votre signalement ! Notre \u00e9quipe va v\u00e9rifier cette question.');
                    setShowReportForm(false);
                    setReportReason('');
                  }}
                >
                  <Send className="h-3 w-3" />
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswerText;
          const showCorrectHighlight = showFeedback && hasAnswered && isCorrectOption;
          const showIncorrectHighlight = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={showFeedback && hasAnswered}
              className={`glass-card flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${showCorrectHighlight
                ? 'heartbeat border-primary/50'
                : showIncorrectHighlight
                  ? 'glitch border-destructive/50'
                  : isSelected
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/30 hover:border-primary/30 hover:bg-primary/5'
                }`}
              style={
                showCorrectHighlight
                  ? { boxShadow: '0 0 25px -5px hsl(var(--success) / 0.4)' }
                  : showIncorrectHighlight
                    ? { boxShadow: '0 0 25px -5px hsl(var(--destructive) / 0.4)' }
                    : undefined
              }
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${showCorrectHighlight
                  ? 'border-primary bg-primary text-primary-foreground'
                  : showIncorrectHighlight
                    ? 'border-destructive bg-destructive text-destructive-foreground'
                    : isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/50 text-muted-foreground'
                  }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`text-base ${isSelected ? 'font-medium text-foreground' : 'text-foreground'}`}>
                {option}
              </span>
              {showCorrectHighlight && <CheckCircle className="ml-auto h-5 w-5 text-primary" />}
              {showIncorrectHighlight && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
            </button>
          );
        })}
      </div>

      {showFeedback && hasAnswered && question.explanation && (
        <div
          className={`mt-6 glass-card p-4 ${isCorrect
            ? 'shadow-[0_0_20px_hsl(var(--success)/0.15)]'
            : 'shadow-[0_0_20px_hsl(var(--destructive)/0.15)]'
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className={`font-bold ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
              {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-foreground">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
