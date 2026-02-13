
-- Add missing columns to questions table
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS level text DEFAULT 'CSP',
  ADD COLUMN IF NOT EXISTS question_translated text,
  ADD COLUMN IF NOT EXISTS option_a_translated text,
  ADD COLUMN IF NOT EXISTS option_b_translated text,
  ADD COLUMN IF NOT EXISTS option_c_translated text,
  ADD COLUMN IF NOT EXISTS option_d_translated text;

-- Create lesson_questions join table
CREATE TABLE IF NOT EXISTS public.lesson_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_id bigint NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  UNIQUE(lesson_id, question_id)
);

ALTER TABLE public.lesson_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read lesson_questions"
  ON public.lesson_questions FOR SELECT
  USING (auth.uid() IS NOT NULL);
