
-- Add a read policy to questions so all users can read them
CREATE POLICY "Anyone can read questions"
ON public.questions FOR SELECT
USING (true);
