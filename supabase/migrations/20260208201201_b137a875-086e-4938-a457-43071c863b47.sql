
-- Add difficulty_level column to questions table
ALTER TABLE public.questions
ADD COLUMN difficulty_level TEXT NOT NULL DEFAULT 'CSP';

-- Add check constraint for valid values
ALTER TABLE public.questions
ADD CONSTRAINT questions_difficulty_level_check
CHECK (difficulty_level IN ('CSP', 'CR', 'Naturalisation'));

-- Add analytics fields to profiles
ALTER TABLE public.profiles
ADD COLUMN weak_category TEXT,
ADD COLUMN total_questions_seen INTEGER NOT NULL DEFAULT 0;
