-- SM-2 spaced repetition data per user per question
CREATE TABLE IF NOT EXISTS question_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  repetitions INTEGER NOT NULL DEFAULT 0,
  ease_factor DECIMAL(4,2) NOT NULL DEFAULT 2.50,
  interval_days INTEGER NOT NULL DEFAULT 1,
  next_review_date TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 day',
  last_quality INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Index for fetching due reviews efficiently
CREATE INDEX IF NOT EXISTS idx_question_reviews_due
  ON question_reviews(user_id, next_review_date);

-- RLS: users can only see their own review data
ALTER TABLE question_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own reviews" ON question_reviews
  FOR ALL USING (auth.uid() = user_id);
