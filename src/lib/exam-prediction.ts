export interface ThemeScore {
  theme: string;
  totalQuestions: number;     // questions in this theme in the exam
  correctRate: number;         // user's historical correct rate (0-1)
  questionsAttempted: number;
}

export interface ReadinessScore {
  predictedScore: number;      // out of 40
  predictedPct: number;        // percentage
  willPass: boolean;           // >= 32/40
  gapToPass: number;           // questions short of passing (0 if passing)
  weakestThemes: string[];     // themes with lowest correct rate
  strongestThemes: string[];   // themes with highest correct rate
  confidenceLevel: "low" | "medium" | "high"; // based on questions attempted
}

// Exam theme weights (official breakdown — total 40 questions)
export const EXAM_WEIGHTS: Record<string, number> = {
  "histoire": 11,
  "institutions": 6,
  "valeurs": 11,
  "symboles": 8,
  "europe": 4,
};

export function calculateReadiness(themeScores: ThemeScore[]): ReadinessScore {
  let predictedScore = 0;
  const sortedByRate = [...themeScores].sort((a, b) => a.correctRate - b.correctRate);

  for (const theme of themeScores) {
    const weight = EXAM_WEIGHTS[theme.theme] ?? 0;
    predictedScore += weight * theme.correctRate;
  }

  const predictedScoreRounded = Math.round(predictedScore);
  const totalAttempted = themeScores.reduce((sum, t) => sum + t.questionsAttempted, 0);

  return {
    predictedScore: predictedScoreRounded,
    predictedPct: Math.round((predictedScoreRounded / 40) * 100),
    willPass: predictedScoreRounded >= 32,
    gapToPass: Math.max(0, 32 - predictedScoreRounded),
    weakestThemes: sortedByRate.slice(0, 2).map(t => t.theme),
    strongestThemes: sortedByRate.slice(-2).map(t => t.theme),
    confidenceLevel: totalAttempted < 30 ? "low" : totalAttempted < 80 ? "medium" : "high",
  };
}
