import { useLanguage } from '@/contexts/LanguageContext';
import { Question } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback,
}: QuizQuestionProps) {
  const { isBilingual, t } = useLanguage();
  const options: string[] = Array.isArray(question.options) 
    ? question.options 
    : JSON.parse(question.options as unknown as string);

  const isCorrect = selectedAnswer === question.correct_answer;
  const hasAnswered = selectedAnswer !== undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          {t('quiz.question')} {questionNumber} {t('quiz.of')} {totalQuestions}
        </Badge>
        <Badge variant="secondary">{question.category}</Badge>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {question.question_fr}
        </h2>
        {isBilingual && question.question_translated && (
          <p className="mt-2 text-base italic text-muted-foreground">
            {question.question_translated}
          </p>
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
              className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition-all ${
                showCorrectHighlight
                  ? 'border-green-500 bg-green-50'
                  : showIncorrectHighlight
                  ? 'border-destructive bg-red-50'
                  : isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-secondary'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  showCorrectHighlight
                    ? 'border-green-500 bg-green-500 text-primary-foreground'
                    : showIncorrectHighlight
                    ? 'border-destructive bg-destructive text-destructive-foreground'
                    : isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`text-base ${isSelected ? 'font-medium text-foreground' : 'text-foreground'}`}>
                {option}
              </span>
              {showCorrectHighlight && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
              {showIncorrectHighlight && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
            </button>
          );
        })}
      </div>

      {showFeedback && hasAnswered && question.explanation && (
        <div
          className={`mt-6 rounded-lg border-2 p-4 ${
            isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
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
