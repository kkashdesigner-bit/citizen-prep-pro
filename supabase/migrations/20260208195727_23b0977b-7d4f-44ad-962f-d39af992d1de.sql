-- Add subcategory column to questions
ALTER TABLE public.questions ADD COLUMN subcategory text;

-- Update existing questions with subcategories
-- Principles
UPDATE public.questions SET subcategory = 'Symbole' WHERE id IN (
  '896da6e4-17b7-4342-aa3d-003a289bb27a', -- emblème
  '8bf403e3-ed19-4903-95ba-293fb9a9624b', -- devise
  '9409a3bf-d2ed-46bd-a793-b2a6b70d386b'  -- Marianne
);
UPDATE public.questions SET subcategory = 'Laïcité' WHERE id = '8d518c4a-d1bc-4bb3-be4b-43d3b0776844';
UPDATE public.questions SET subcategory = 'Situational' WHERE id = 'fd4293f6-eae3-4f67-b7af-9044b979e4bf';

-- Institutions
UPDATE public.questions SET subcategory = 'Democracy' WHERE id IN (
  '216e9812-8c42-46a6-8d85-6a55a195f755', -- vote les lois
  '81f396e2-9009-4100-8bc2-46e5fb9d123c'  -- élit le Président
);
UPDATE public.questions SET subcategory = 'Organization' WHERE id IN (
  '1f3bdd35-fe33-4e70-9481-bb89e1517371', -- Premier Ministre
  '91514831-2dbc-43e5-8183-fec076727fc0'  -- Sénat
);
UPDATE public.questions SET subcategory = 'Europe' WHERE id = 'a5d883ab-f44a-4962-80c9-2fa656fa5138';

-- Rights
UPDATE public.questions SET subcategory = 'Fundamental' WHERE id IN (
  '0dc5543b-6666-43b2-a18e-229ab0d91a53', -- femmes vote
  '37088272-c0b2-4a58-9190-47d5ac5e519e'  -- âge voter
);
UPDATE public.questions SET subcategory = 'Duties' WHERE id = 'e5bf40a6-77fe-4663-8f83-59dd66b48ec5';

-- History
UPDATE public.questions SET subcategory = 'Periods' WHERE id IN (
  '380d928f-d5f4-4402-b111-a7a806f27496', -- Fête Nationale
  '3a51c102-cbc8-4568-a869-55efb64d3809', -- DDHC
  '3e8890e9-5973-4375-a0f8-10a55997025c'  -- France Libre
);
UPDATE public.questions SET subcategory = 'Heritage' WHERE id = '26ea26cf-bfad-4a9b-a461-74e7bd94e32d';

-- Living/Society
UPDATE public.questions SET subcategory = 'Health' WHERE id = '054dfe23-d7e1-44f3-a54f-1d439dd4d974';
UPDATE public.questions SET subcategory = 'Education' WHERE id = '6e235340-d1f4-47c9-8ee3-2a9aad5c981a';
UPDATE public.questions SET subcategory = 'Residence' WHERE id = '8917142f-f6cc-475e-bd3f-a9ddb605fd8b';