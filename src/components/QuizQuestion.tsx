import { Question } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import TranslateButton from '@/components/TranslateButton';

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
  const options: string[] = Array.isArray(question.options) 
    ? question.options 
    : JSON.parse(question.options as unknown as string);

  const isCorrect = selectedAnswer === question.correct_answer;
  const hasAnswered = selectedAnswer !== undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          Question {questionNumber} sur {totalQuestions}
        </Badge>
        <Badge variant="secondary">{question.category}</Badge>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {question.question_fr}
        </h2>
        <TranslateButton translatedText={question.question_translated} />
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
                  ? 'border-primary bg-primary/10'
                  : showIncorrectHighlight
                  ? 'border-destructive bg-destructive/10'
                  : isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-secondary'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  showCorrectHighlight
                    ? 'border-primary bg-primary text-primary-foreground'
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
              {showCorrectHighlight && <CheckCircle className="ml-auto h-5 w-5 text-primary" />}
              {showIncorrectHighlight && <XCircle className="ml-auto h-5 w-5 text-destructive" />}
            </button>
          );
        })}
      </div>

      {showFeedback && hasAnswered && question.explanation && (
        <div
          className={`mt-6 rounded-lg border-2 p-4 ${
            isCorrect ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'
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
