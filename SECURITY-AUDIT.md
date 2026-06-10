# Security Audit — GoCivique (citizen-prep-pro)

**Date:** 2026-06-10 · **Scope:** frontend repo + Supabase project `jblhxpzqbbarpqstcbvq` (10 edge functions, database, auth flow)

## 1. What was found and fixed

### Critical — fixed and deployed

**`send-email` was a public, unauthenticated email relay.** Anyone could send branded GoCivique emails (welcome, password-changed, payment-failed…) to any address, and inject HTML via unescaped `name`, `email`, `subject`, `firstName` fields. Fixed: internal-only types (`payment_failed`, `subscription_cancelled`) now require the service-role key; self-service types require a logged-in user and always send to that user's own address; the public contact/report forms are validated, size-capped, fully HTML-escaped, and rate-limited per IP (10/15 min, signup 3/h).

**`create-direct-charge` allowed anyone to create arbitrary Stripe PaymentIntents** on arbitrary connected accounts, with no auth at all. It is not called anywhere by your frontend. Fixed: service-role-only + strict input validation. Recommended: delete the function entirely (see §4).

**`send-bulk-campaign` was callable by ANY logged-in user** (verify_jwt alone only checks for a valid JWT) — any customer could trigger a marketing blast to your full user base. Fixed: requires the service-role key or a user with the `admin` role in `user_roles`.

**Cron-style functions (`generate-notifications`, `generate-daily-question`, `email-automations`, `update-difficulty`) were publicly triggerable** — including `email-automations`, which mass-emails users. Fixed: service-role callers only. (No pg_cron job calls these over HTTP today — the only cron job runs `ensure_daily_question()` in SQL — so nothing broke.)

### High — fixed and deployed

**Wildcard CORS (`Access-Control-Allow-Origin: *`) on every browser-facing function.** Replaced with a strict allowlist: `https://gocivique.fr`, `https://www.gocivique.fr`, `http://localhost:8080` (dev). Verified live: allowed origin echoes back; foreign origins get no CORS header. (Your prompt said `mysite.com` — confirmed with you to use the real domain.)

**No rate limiting anywhere.** Added DB-backed fixed-window rate limiting (`rate_limits` table + `consume_rate_limit()` RPC, service-role-only). Limits: checkout 10/15 min/user, portal 30/15 min/user, emails 10/15 min/IP+user, plus IP caps.

**Login: max 5 attempts / 15 min** via `login_attempts` table + `check_login_allowed()` / `record_login_attempt()` RPCs (SECURITY DEFINER, input-capped). The Auth page checks the gate before sign-in, records failures, and clears on success. Verified live: 5 failures → blocked with `retry_after_seconds: 900`; success resets.

**Open-redirect via `return_url`** in `create-checkout-session` / `stripe-portal` (attacker-controlled Stripe success/cancel URLs). Fixed: `return_url` must match an allowed origin, else falls back to `https://gocivique.fr`.

**No input validation on function payloads.** All functions now reject malformed JSON, oversized bodies (25 KB cap), unknown `tier`/`action` values, and bad types. Stripe/internal error details are no longer leaked to clients (generic messages; details go to logs).

### Medium — fixed

- Hardcoded Supabase URL + anon key fallbacks removed from `src/integrations/supabase/client.ts` and `src/lib/checkout.ts`; config now comes only from `VITE_*` env vars (app fails fast with a clear error if missing). Note: the anon key is *publishable by design* — it appearing in the built bundle is normal and safe (RLS is the protection). `.env.example` added; `STRIPE_SECRET_KEY` placeholder removed from the frontend `.env` (server secrets belong in Supabase function secrets).
- Frontend forms (auth, contact, onboarding, settings, password reset) now validate with zod (`src/lib/validation.ts`) and carry `maxLength` caps on every free-text input.
- Over-exposed SECURITY DEFINER functions locked down: `ensure_daily_question`, `refresh_question_difficulty`, `handle_new_user` are no longer callable by `anon`/`authenticated`; `has_role` revoked from `anon` (kept for `authenticated` — used in RLS policies). `refresh_question_difficulty` got a pinned `search_path`.
- `stripe-webhook`: signature verification was already correct (kept); internal error details removed from responses.

### Secret scan — clean

No live API keys, tokens, or passwords in the working tree or in any of the 377 commits (scanned for Stripe/Anthropic/Resend/AWS/Google key patterns, private keys, and service-role usage). `.env` was never committed and is gitignored. No key rotation needed.

## 2. Verification performed

`tsc --noEmit` ✓ · `vite build` ✓ · 22/22 unit tests ✓ · `deno check` on all 10 functions ✓ · live checks against deployed functions: CORS allow/deny ✓, malformed body → 400 ✓, spam-relay attempts → 401/403 ✓, all cron endpoints → 401 ✓, unauthenticated checkout → 401 ✓, login lockout after 5 failures → blocked 900 s, cleared on success ✓.

## 3. Remaining vulnerabilities (require your action)

1. **npm dependency vulnerabilities** — `npm audit` reports issues incl. `@remix-run/router` (React Router XSS via open redirects, runtime-relevant) and dev-tooling items (vitest UI, rollup, esbuild dev server). The sandbox couldn't modify `node_modules`; run on your machine: `npm audit fix`, then `npm test && npm run build`.
2. **Unused risky dependencies** — `xlsx` (high severity, **no patched version exists**) and `@anthropic-ai/sdk` are in `package.json` but imported nowhere. Remove: `npm uninstall xlsx @anthropic-ai/sdk`.
3. **Supabase dashboard settings** (not reachable via API): enable **leaked password protection** (Auth → Passwords, flagged by Supabase advisor), and review **Auth rate limits** (Auth → Rate limits). The 5/15 min login gate is enforced in the database for your app flow, but a script talking directly to the GoTrue API bypasses the app — Supabase's own auth rate limits are the backstop there; for hard enforcement consider a *password verification* Auth Hook pointing at a SQL function.
4. **Delete `create-direct-charge`** (Dashboard → Edge Functions) unless Stripe Connect is planned — locked down now, but dead privileged code is best removed.
5. **`user_roles` is empty** — to run `send-bulk-campaign` yourself, either call it with the service-role key or insert your user id with role `admin`.

## 4. Accepted/known trade-offs

- Account-based lockout means someone who knows a victim's email can force a 15-min password-login lockout (5 fake failures). This is inherent to the requested policy; Google sign-in is unaffected, and a successful login clears the counter.
- `rate_limits` / `login_attempts` have RLS enabled with no policies **intentionally** (no direct client access; all access via SECURITY DEFINER RPCs or service role) — the advisor INFO notices for these two tables are expected.
- Anonymous `signup_welcome` emails remain possible (needed: the welcome fires before email confirmation) but are capped at 3/hour/IP with validated recipients.

## 5. Key files

`supabase/migrations/20260610000001_rate_limiting.sql` (rate-limit schema + RPCs) · `supabase/functions/*/index.ts` + `shared.ts` (hardened, deployed) · `src/lib/validation.ts`, `src/lib/authRateLimit.ts` (new) · `src/pages/Auth.tsx`, `Contact.tsx`, `Onboarding.tsx`, `SettingsPage.tsx`, `UpdatePassword.tsx` (validation + caps) · `.env.example` (new).
