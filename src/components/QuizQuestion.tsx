import { Question } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import TranslateButton from '@/components/TranslateButton';
import { playCorrectSound, playIncorrectSound } from '@/lib/sounds';
import { useEffect, useRef } from 'react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  hideTranslation?: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback,
  hideTranslation = false,
}: QuizQuestionProps) {
  const options: string[] = Array.isArray(question.options) 
    ? question.options 
    : JSON.parse(question.options as unknown as string);

  const isCorrect = selectedAnswer === question.correct_answer;
  const hasAnswered = selectedAnswer !== undefined;
  const soundPlayed = useRef(false);

  useEffect(() => {
    if (showFeedback && hasAnswered && !soundPlayed.current) {
      soundPlayed.current = true;
      if (isCorrect) playCorrectSound();
      else playIncorrectSound();
    }
  }, [showFeedback, hasAnswered, isCorrect]);

  // Reset sound ref when question changes
  useEffect(() => {
    soundPlayed.current = false;
  }, [question.id]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-sm border-border/50">
          Question {questionNumber} sur {totalQuestions}
        </Badge>
        <Badge variant="secondary">{question.category}</Badge>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {question.question_fr}
        </h2>
        {!hideTranslation && (
          <TranslateButton translatedText={question.question_translated} />
        )}
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correct_answer;
          const showCorrectHighlight = showFeedback && hasAnswered && isCorrectOption;
          const showIncorrectHighlight = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={showFeedback && hasAnswered}
              className={`glass-card flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                showCorrectHighlight
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  showCorrectHighlight
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
          className={`mt-6 glass-card p-4 ${
            isCorrect
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
