

# Single-Session Enforcement (Log Out on Other Devices)

This feature ensures that when a user logs in on a new device or browser, all their other active sessions are automatically terminated. Only one session can be active at a time.

---

## How It Works

1. A `session_token` column is added to the `profiles` table to store the current active session ID.
2. When a user logs in, the app writes their new session's access token (a unique identifier per session) to the `session_token` column.
3. On every page load / auth state change, the app compares the local session token against the one stored in the database. If they don't match, it means the user logged in elsewhere -- the current session is signed out automatically and a toast notification is shown.

---

## What Will Change

### 1. Database Migration
Add a `session_token` column to the `profiles` table:

```sql
ALTER TABLE public.profiles
ADD COLUMN session_token text DEFAULT NULL;
```

### 2. `useAuth.ts` -- Session Validation Logic
After a successful sign-in (or on auth state change with a `SIGNED_IN` event):

- Write the current session's access token to `profiles.session_token` for the user.
- Set up an interval (every 30 seconds) that reads `profiles.session_token` and compares it to the local session token.
- If the tokens don't match, call `signOut()` and show a toast: "You have been logged out because your account was signed in on another device."

### 3. `Auth.tsx` -- Update Session Token on Login
After a successful `signInWithEmail` or `signInWithGoogle`, the session token is automatically handled by the `useAuth` hook's `onAuthStateChange` listener, so no changes needed here.

### 4. `Header.tsx` / `Dashboard.tsx` -- No Changes
These components already use `useAuth()` and will automatically react to the sign-out.

---

## Technical Details

### Database Migration

```sql
ALTER TABLE public.profiles
ADD COLUMN session_token text DEFAULT NULL;
```

No RLS policy changes needed -- users can already update their own profile.

### `useAuth.ts` Changes

- On `SIGNED_IN` or `TOKEN_REFRESHED` events in `onAuthStateChange`, update `profiles.session_token` with the current `session.access_token`.
- Add a polling interval (every 30 seconds) that:
  1. Fetches `session_token` from `profiles` for the current user.
  2. Compares it to the local `session.access_token`.
  3. If mismatched, calls `supabase.auth.signOut()` and shows a toast notification.
- Clean up the interval on unmount or sign-out.
- Use a stable ref for the session to avoid stale closures in the interval callback.

### Polling vs. Realtime

Polling every 30 seconds is chosen over Supabase Realtime because:
- Simpler to implement and debug
- No additional Realtime channel setup needed
- 30-second delay is acceptable for this use case (it's a security convenience, not a real-time requirement)

