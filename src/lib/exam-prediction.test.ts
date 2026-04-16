import { describe, test, expect } from 'vitest';
import { calculateReadiness, ThemeScore } from './exam-prediction';

function makeThemeScores(overrides: Partial<ThemeScore>[] = []): ThemeScore[] {
  const defaults: ThemeScore[] = [
    { theme: 'histoire', totalQuestions: 11, correctRate: 0.8, questionsAttempted: 20 },
    { theme: 'institutions', totalQuestions: 6, correctRate: 0.8, questionsAttempted: 10 },
    { theme: 'valeurs', totalQuestions: 11, correctRate: 0.8, questionsAttempted: 20 },
    { theme: 'symboles', totalQuestions: 8, correctRate: 0.8, questionsAttempted: 15 },
    { theme: 'europe', totalQuestions: 4, correctRate: 0.8, questionsAttempted: 8 },
  ];
  return defaults.map((d, i) => ({ ...d, ...(overrides[i] ?? {}) }));
}

describe('calculateReadiness', () => {
  test('perfect score predicts 40/40', () => {
    const scores = makeThemeScores([
      { correctRate: 1.0 }, { correctRate: 1.0 }, { correctRate: 1.0 },
      { correctRate: 1.0 }, { correctRate: 1.0 },
    ]);
    const result = calculateReadiness(scores);
    expect(result.predictedScore).toBe(40);
    expect(result.willPass).toBe(true);
    expect(result.gapToPass).toBe(0);
  });

  test('80% across all themes predicts 32/40 (exact pass threshold)', () => {
    const scores = makeThemeScores();
    const result = calculateReadiness(scores);
    expect(result.predictedScore).toBe(32);
    expect(result.willPass).toBe(true);
    expect(result.gapToPass).toBe(0);
  });

  test('zero score predicts 0/40 and fails', () => {
    const scores = makeThemeScores([
      { correctRate: 0 }, { correctRate: 0 }, { correctRate: 0 },
      { correctRate: 0 }, { correctRate: 0 },
    ]);
    const result = calculateReadiness(scores);
    expect(result.predictedScore).toBe(0);
    expect(result.willPass).toBe(false);
    expect(result.gapToPass).toBe(32);
  });

  test('predictedPct is percentage of 40', () => {
    const scores = makeThemeScores();
    const result = calculateReadiness(scores);
    expect(result.predictedPct).toBe(80);
  });

  test('weakestThemes has 2 entries with lowest correctRate', () => {
    const scores = makeThemeScores([
      { theme: 'histoire', correctRate: 0.9 },
      { theme: 'institutions', correctRate: 0.3 },
      { theme: 'valeurs', correctRate: 0.8 },
      { theme: 'symboles', correctRate: 0.2 },
      { theme: 'europe', correctRate: 0.7 },
    ]);
    const result = calculateReadiness(scores);
    expect(result.weakestThemes).toContain('symboles');
    expect(result.weakestThemes).toContain('institutions');
    expect(result.weakestThemes.length).toBe(2);
  });

  test('confidenceLevel is low when < 30 questions attempted', () => {
    const scores = makeThemeScores([
      { questionsAttempted: 2 }, { questionsAttempted: 2 }, { questionsAttempted: 2 },
      { questionsAttempted: 2 }, { questionsAttempted: 2 },
    ]);
    const result = calculateReadiness(scores);
    expect(result.confidenceLevel).toBe('low');
  });

  test('confidenceLevel is high when >= 80 questions attempted', () => {
    const scores = makeThemeScores([
      { questionsAttempted: 20 }, { questionsAttempted: 20 }, { questionsAttempted: 20 },
      { questionsAttempted: 10 }, { questionsAttempted: 10 },
    ]);
    const result = calculateReadiness(scores);
    expect(result.confidenceLevel).toBe('high');
  });
});
