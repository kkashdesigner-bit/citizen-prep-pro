
-- Create user_profile table for persona-driven onboarding
CREATE TABLE IF NOT EXISTS public.user_profile (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  first_name text,
  goal_type text, -- 'naturalisation' | 'carte_resident' | 'carte_resident_permanent' | 'ofii' | 'unknown'
  level text DEFAULT 'beginner', -- 'beginner' | 'intermediate' | 'advanced'
  timeline text, -- 'less_1_month' | '1_3_months' | 'more_3_months' | 'not_sure'
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can insert own profile"
  ON public.user_profile
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own profile"
  ON public.user_profile
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_profile
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON public.user_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
