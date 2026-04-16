// SM-2 algorithm — the foundation of Anki, Duolingo, and all serious SRS systems
// Reference: Wozniak, 1987 — https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method

export interface SRSCard {
  questionId: string;
  repetitions: number;   // number of successful reviews
  easeFactor: number;    // difficulty multiplier (starts at 2.5)
  intervalDays: number;  // days until next review
  nextReviewDate: Date;  // absolute date for next review
}

// quality: 0-5 (0 = complete blackout, 5 = perfect recall)
export function calculateNextReview(card: SRSCard, quality: 0 | 1 | 2 | 3 | 4 | 5): SRSCard {
  let { repetitions, easeFactor, intervalDays } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor (min 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  return { ...card, repetitions, easeFactor, intervalDays, nextReviewDate };
}

export function getQualityFromResult(correct: boolean, timeSpentMs: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!correct) return 1; // incorrect
  if (timeSpentMs < 5000) return 5;  // < 5 seconds — very easy
  if (timeSpentMs < 15000) return 4; // < 15 seconds — easy
  if (timeSpentMs < 30000) return 3; // < 30 seconds — medium
  return 2; // > 30 seconds — hard (but correct)
}
