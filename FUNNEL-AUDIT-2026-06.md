# GoCivique — Site & Funnel Audit

**Date:** 3 June 2026 · **Scope:** Vercel app + Supabase backend + conversion funnel

---

## Bottom line

Your problem isn't "people won't sign up." **People sign up fine — they don't convert to paid.**

- **135** registered accounts, **9** in the last 7 days — signup works.
- **Only ~2 are real paying customers.** Everything else flagged "paid" in the database is a founder/test/manual account, all created 9–20 Feb during setup. **No genuine paid conversion has happened since February.**
- The break is entirely at the **free → paid** step, and the single biggest cause is a funnel that throws away your most motivated buyers right at the moment they try to pay.

---

## The real funnel (from your data)

| Stage | Count | Note |
|---|---|---|
| Registered accounts | 135 | 64% via one-tap Google — low friction, working |
| Email confirmed | 134 / 135 | Email confirmation is **not** a bottleneck |
| Answered ≥1 question (activated) | 89 (66%) | Healthy activation |
| Started a class | 42 (31%) | |
| Flagged "paid" tier | 9 | Mostly manual/test accounts |
| **Real Stripe customer record** | **4** | |
| **Real Stripe subscription** | **2** | The only verifiable paid users (incl. the owner) |
| New paid since 20 Feb | **0** | |

Signups are still arriving (28 in the last 30 days) but **none are turning into revenue.**

---

## Why people aren't subscribing

**1. The highest-intent click dead-ends (the big one).**
A logged-out visitor who clicked "Passer au Standard/Premium" hit the paywall dialog, then got bounced to `/auth` — and their purchase intent was *discarded*. After signing up they landed on a dashboard, not checkout. The people most likely to pay were the ones the funnel dropped. **Fixed.**

**2. Pricing is buried.** It's the 8th section on a long landing page, with no persistent way to act on it while scrolling. **Fixed** (sticky CTA bar).

**3. The first ask is "pay now," with the safety net hidden.** Monthly was the default (annual is −40% but behind a toggle), and the 7-day money-back guarantee was tiny grey text. Nothing said "risk-free." **Fixed** (annual default + prominent guarantee framed as a risk-free trial).

**4. A security/data-integrity issue underneath it all.** The `question_difficulty` table had Row Level Security **off** — anyone with the public key could read or modify it. **Fixed.**

---

## What I changed (in code — ready to deploy)

All changes are in your repo, not yet deployed. Push to `main` to ship.

**Recover purchase intent (resume checkout after signup)**
- `src/lib/checkout.ts` *(new)* — one shared place to build/launch Stripe checkout and remember a pending plan.
- `src/hooks/useResumeCheckout.ts` *(new)* — auto-resumes checkout after auth.
- `src/components/SubscriptionGate.tsx` — logged-out buyers now keep their chosen plan through signup and are sent straight to Stripe afterward (works for both email and Google).
- `src/pages/Auth.tsx` — resumes checkout after login/signup, honors `?redirect=`, defaults to the sign-up form for buyers, and shows "Dernière étape avant votre abonnement."
- `src/pages/Onboarding.tsx` — resumes checkout for Google sign-ups landing here.

**Make subscribing easier to reach & lower-risk**
- `src/components/StickyCtaBar.tsx` *(new)* + `src/pages/Index.tsx` — slim, dismissible "Voir les offres / S'abonner" bar that follows the visitor (hidden for paying users).
- `src/components/PricingSection.tsx` — annual billing is now the default; guarantee is a prominent risk-free badge.
- `src/components/SubscriptionGate.tsx` — added a "Essayez sans risque — remboursé sous 7 jours" reassurance block above the buy button.

**Security (applied directly to Supabase — already live)**
- Enabled Row Level Security on `question_difficulty` with a read-only policy. The app still reads it; nobody can modify it via the public key anymore.

---

## What you need to do

**1. Deploy** — push to `main` (auto-deploys to Vercel).

**2. Verify the Stripe → Supabase webhook with a real test purchase.** This is critical: only 2 of your "paid" accounts have a real Stripe subscription ID, which means the automatic upgrade path has barely been exercised. Do a live test card purchase end-to-end and confirm the account flips to paid automatically. Specifically check that **`STRIPE_WEBHOOK_SECRET` is set** in the Supabase Edge Function secrets and that the webhook endpoint is registered in the Stripe dashboard for `checkout.session.completed`. If a real payer ever doesn't get upgraded, that's silent lost revenue.

> Note: the post-payment success page also self-marks the account as paid from the browser without verifying payment. It's a convenience fallback, but it means someone could self-upgrade. Once the webhook is confirmed working, consider removing that client-side upgrade and trusting the webhook only.

**3. Consider a true free trial.** The guarantee now *reads* like a trial. If you want a real "7 days free, then €X" trial, add a trial period to the Stripe price — happy to wire that up.

---

## Lower-priority items found (not changed)

- **Supabase security warnings (all non-critical):** leaked-password protection is off (one click to enable); a few `SECURITY DEFINER` functions are callable by the public API; `notifications`/`daily_questions` have permissive insert policies. None are urgent.
- **No product analytics funnel.** You have Microsoft Clarity (great for session replay) but no event funnel showing where visitors drop. Worth adding so you can measure these fixes.
- **Duplicate/legacy tables:** both `profiles` and `user_profile` exist; tidy up when convenient.

---

## Suggested next experiments (highest leverage first)

1. **Measure first:** confirm the webhook, then watch whether the resumed-checkout flow produces real subscriptions over the next 1–2 weeks.
2. **Tighten the free tier** if free users never feel a reason to upgrade — e.g. limit full mock exams or progress tracking behind the paywall at the moment of peak motivation (right after a good practice score).
3. **Exam-date urgency:** the 2026 exam is now mandatory — lean into a countdown / "be ready in 7 days" hook tied to the paid plan.
