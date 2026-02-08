import { Question } from './types';

/**
 * Official exam distribution quotas by category + subcategory.
 * Total: 40 questions.
 */
export const EXAM_DISTRIBUTION: { category: string; subcategory: string; count: number }[] = [
  // Principles (11)
  { category: 'Principles', subcategory: 'Symbole', count: 3 },
  { category: 'Principles', subcategory: 'Laïcité', count: 2 },
  { category: 'Principles', subcategory: 'Situational', count: 6 },
  // Institutions (6)
  { category: 'Institutions', subcategory: 'Democracy', count: 3 },
  { category: 'Institutions', subcategory: 'Organization', count: 2 },
  { category: 'Institutions', subcategory: 'Europe', count: 1 },
  // Rights (11)
  { category: 'Rights', subcategory: 'Fundamental', count: 2 },
  { category: 'Rights', subcategory: 'Duties', count: 3 },
  { category: 'Rights', subcategory: 'Situational', count: 6 },
  // History/Geo (8)
  { category: 'History', subcategory: 'Periods', count: 3 },
  { category: 'History', subcategory: 'Geo', count: 3 },
  { category: 'History', subcategory: 'Heritage', count: 2 },
  // Society/Living (4)
  { category: 'Living', subcategory: 'Residence', count: 1 },
  { category: 'Living', subcategory: 'Health', count: 1 },
  { category: 'Living', subcategory: 'Work', count: 1 },
  { category: 'Living', subcategory: 'Education', count: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Select questions following the official distribution quotas.
 * Falls back gracefully when there aren't enough questions per subcategory.
 */
export function selectQuestionsByDistribution(
  allQuestions: Question[],
  excludeIds: string[] = [],
): Question[] {
  const available = allQuestions.filter((q) => !excludeIds.includes(q.id));
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  // First pass: fill by quota
  for (const slot of EXAM_DISTRIBUTION) {
    const pool = shuffle(
      available.filter(
        (q) =>
          q.category === slot.category &&
          q.subcategory === slot.subcategory &&
          !usedIds.has(q.id),
      ),
    );
    const picked = pool.slice(0, slot.count);
    picked.forEach((q) => {
      selected.push(q);
      usedIds.add(q.id);
    });
  }

  // Second pass: if we couldn't fill quotas, fill remaining from same categories
  const targetTotal = 40;
  if (selected.length < targetTotal) {
    const remaining = shuffle(available.filter((q) => !usedIds.has(q.id)));
    for (const q of remaining) {
      if (selected.length >= targetTotal) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  return shuffle(selected);
}
