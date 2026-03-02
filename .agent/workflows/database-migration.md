---
description: How to create and apply a Supabase database migration
---

# Database Migration

## Steps

1. Decide on the migration name (snake_case, descriptive):
   - Example: `add_video_guides_table`, `update_category_constraints`

2. Write the SQL migration following these rules:
   - Use `IF NOT EXISTS` / `IF EXISTS` for safety
   - Always `ENABLE ROW LEVEL SECURITY` on new tables
   - Add `updated_at` trigger on any new table
   - Use `CREATE OR REPLACE` for functions
   - Never hardcode generated IDs

3. Apply the migration using the Supabase MCP tool:
   - Use `apply_migration` with `project_id: "jblhxpzqbbarpqstcbvq"`

4. After migration, verify with:
   - `list_tables` to confirm table exists
   - `execute_sql` to run a quick test query
   - `get_advisors` (type: "security") to check for RLS issues

5. Generate updated TypeScript types:
   - Use `generate_typescript_types` tool
   - Copy output to `src/integrations/supabase/types.ts`

## Template
```sql
-- Migration: <descriptive_name>

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.<table_name> (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- columns here
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies
CREATE POLICY "Users can view own data"
  ON public.<table_name> FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Updated_at trigger
CREATE TRIGGER update_<table_name>_updated_at
  BEFORE UPDATE ON public.<table_name>
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```
