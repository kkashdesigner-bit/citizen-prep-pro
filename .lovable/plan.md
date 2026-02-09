

## Fix User Authentication and Database Sync

### What already exists
- A `profiles` table with `id`, `display_name`, `subscription_tier`, `session_token`, and other fields
- A `handle_new_user()` trigger function on `auth.users` that creates a profile row on signup
- The trigger is attached and working

### What needs to change

#### 1. Database Migration -- Add missing columns to `profiles`
Add three new columns:
- `email` (text, nullable) -- synced from auth signup data
- `avatar_url` (text, nullable) -- synced from Google OAuth metadata
- `credits` (integer, default 0)

#### 2. Database Migration -- Update the `handle_new_user()` trigger function
Update the function to also populate `email` and `avatar_url` from the new user's auth metadata:
- `email` from `NEW.email`
- `avatar_url` from `NEW.raw_user_meta_data->>'avatar_url'`
- `display_name` from `NEW.raw_user_meta_data->>'full_name'` (already done, kept)

#### 3. Code Change -- Redirect to `/dashboard` after login

**`src/pages/Auth.tsx`**: Change `navigate('/')` to `navigate('/dashboard')` on line 27 for email login.

**`src/hooks/useAuth.ts`**: Change the Google OAuth `redirectTo` from `window.location.origin` to `window.location.origin + '/dashboard'` so after the Google OAuth flow completes, the user lands on the dashboard.

#### 4. Update TypeScript types
The `src/integrations/supabase/types.ts` file auto-updates from Supabase after the migration runs, so the new `email`, `avatar_url`, and `credits` columns will be reflected automatically.

### Technical Details

**SQL Migration:**
```sql
-- Add missing columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS credits integer NOT NULL DEFAULT 0;

-- Update trigger function to populate new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
```

**Code changes (2 files):**
- `src/pages/Auth.tsx` line 27: `navigate('/')` becomes `navigate('/dashboard')`
- `src/hooks/useAuth.ts` line 109: `redirectTo` changes to include `/dashboard`

### Backfill existing users (optional)
If you already have users in the system whose email/avatar are missing from profiles, you can run a one-time SQL query in the Supabase SQL Editor to backfill them.
