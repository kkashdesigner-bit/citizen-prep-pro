
-- Drop the old category constraint
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_category_check;

-- Add the new exact 5 category strings
ALTER TABLE public.questions ADD CONSTRAINT questions_category_check 
  CHECK (category IN (
    'Principles and values of the Republic', 
    'Institutional and political system', 
    'Rights and duties', 
    'History, geography and culture', 
    'Living in French society'
  ));

-- Delete existing questions since they don't conform to the new constraint
DELETE FROM public.questions;
