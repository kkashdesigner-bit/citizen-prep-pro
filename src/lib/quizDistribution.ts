import { Question } from './types';

/**
 * Shuffle helper
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Select questions for a quiz session.
 * Optionally filter by category. Shuffles and limits to `count` (default 40).
 */
export function selectQuestionsByDistribution(
  allQuestions: Question[],
  excludeIds: number[] = [],
  options?: { category?: string; count?: number },
): Question[] {
  let pool = allQuestions.filter((q) => !excludeIds.includes(q.id));

  if (options?.category) {
    pool = pool.filter((q) => q.category === options.category);
  }

  const shuffled = shuffle(pool);
  const limit = options?.count ?? 40;
  return shuffled.slice(0, limit);
}
