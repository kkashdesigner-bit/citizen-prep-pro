// Login rate limiting: max 5 failed attempts per 15 minutes per email.
// Enforced server-side via SECURITY DEFINER RPCs (see migration 20260610000001_rate_limiting.sql).

import { supabase } from '@/integrations/supabase/client';

export interface LoginAllowed {
  allowed: boolean;
  retryAfterSeconds?: number;
  remaining?: number;
}

/** Check whether this identifier may attempt a login right now. Fails open on RPC errors. */
export async function checkLoginAllowed(email: string): Promise<LoginAllowed> {
  try {
    const { data, error } = await supabase.rpc('check_login_allowed', {
      p_identifier: email,
    });
    if (error || !data) return { allowed: true };
    const d = data as { allowed: boolean; retry_after_seconds?: number; remaining?: number };
    return {
      allowed: d.allowed,
      retryAfterSeconds: d.retry_after_seconds,
      remaining: d.remaining,
    };
  } catch {
    return { allowed: true };
  }
}

/** Record the outcome of a login attempt (success clears the failure window). */
export async function recordLoginAttempt(email: string, success: boolean): Promise<void> {
  try {
    await supabase.rpc('record_login_attempt', {
      p_identifier: email,
      p_success: success,
    });
  } catch {
    // best effort
  }
}

/** Human-readable lockout message in French (app locale). */
export function lockoutMessage(retryAfterSeconds = 900): string {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `Trop de tentatives de connexion. Réessayez dans ${minutes} minute${minutes > 1 ? 's' : ''}.`;
}
