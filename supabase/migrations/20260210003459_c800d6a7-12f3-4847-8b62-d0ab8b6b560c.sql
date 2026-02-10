-- Fix #1: Restrict questions to authenticated users only
DROP POLICY "Anyone can read questions" ON public.questions;
CREATE POLICY "Authenticated users can read questions"
  ON public.questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix #2: Remove session_token column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS session_token;