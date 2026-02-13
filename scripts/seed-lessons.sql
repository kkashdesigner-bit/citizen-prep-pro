-- Seed script for lessons + lesson_questions
-- Run via Supabase SQL Editor or CLI

-- Link each lesson to the first 5 questions in its category
INSERT INTO public.lesson_questions (lesson_id, question_id)
SELECT l.id, q.id
FROM public.lessons l
CROSS JOIN LATERAL (
  SELECT id FROM public.questions
  WHERE category = l.category AND language = 'fr'
  ORDER BY id
  LIMIT 5
) q
ON CONFLICT (lesson_id, question_id) DO NOTHING;

-- Update questions with subcategory and level defaults where missing
UPDATE public.questions SET level = 'CSP' WHERE level IS NULL;
UPDATE public.questions SET subcategory = 'General' WHERE subcategory IS NULL;
