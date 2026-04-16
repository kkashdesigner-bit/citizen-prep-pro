import { describe, test, expect } from 'vitest';
import { calculateNextReview, getQualityFromResult, SRSCard } from './spaced-repetition';

function makeCard(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    questionId: 'q1',
    repetitions: 0,
    easeFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: new Date(),
    ...overrides,
  };
}

describe('calculateNextReview', () => {
  test('first correct answer sets interval to 1 day', () => {
    const card = makeCard();
    const result = calculateNextReview(card, 5);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  test('second correct answer sets interval to 6 days', () => {
    const card = makeCard({ repetitions: 1, intervalDays: 1 });
    const result = calculateNextReview(card, 4);
    expect(result.intervalDays).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  test('third correct answer multiplies by ease factor', () => {
    const card = makeCard({ repetitions: 2, intervalDays: 6, easeFactor: 2.5 });
    const result = calculateNextReview(card, 4);
    expect(result.intervalDays).toBe(15); // Math.round(6 * 2.5)
    expect(result.repetitions).toBe(3);
  });

  test('incorrect answer resets to 0 reps and 1 day interval', () => {
    const card = makeCard({ repetitions: 5, intervalDays: 30, easeFactor: 2.5 });
    const result = calculateNextReview(card, 1);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
  });

  test('ease factor does not drop below 1.3', () => {
    let card = makeCard();
    for (let i = 0; i < 20; i++) {
      card = calculateNextReview(card, 0);
    }
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  test('nextReviewDate is in the future', () => {
    const card = makeCard();
    const result = calculateNextReview(card, 5);
    expect(result.nextReviewDate.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('getQualityFromResult', () => {
  test('incorrect answer returns quality 1', () => {
    expect(getQualityFromResult(false, 1000)).toBe(1);
    expect(getQualityFromResult(false, 60000)).toBe(1);
  });

  test('fast correct answer returns quality 5', () => {
    expect(getQualityFromResult(true, 3000)).toBe(5);
  });

  test('medium-speed correct returns quality 4', () => {
    expect(getQualityFromResult(true, 10000)).toBe(4);
  });

  test('slow correct answer returns quality 2', () => {
    expect(getQualityFromResult(true, 45000)).toBe(2);
  });
});
