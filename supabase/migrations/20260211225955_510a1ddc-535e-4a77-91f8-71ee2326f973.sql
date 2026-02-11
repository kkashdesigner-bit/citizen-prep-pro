
-- Create user_answers table to track individual quiz answers
CREATE TABLE public.user_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id BIGINT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  category TEXT,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert own answers"
ON public.user_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own answers"
ON public.user_answers FOR SELECT
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_user_answers_user_id ON public.user_answers(user_id);
CREATE INDEX idx_user_answers_category ON public.user_answers(user_id, category);

-- Also fix the trailing space in questions categories
UPDATE public.questions SET category = TRIM(category) WHERE category != TRIM(category);
