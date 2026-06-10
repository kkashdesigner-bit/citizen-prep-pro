// shared.ts — common security helpers (CORS allowlist, auth, rate limiting, sanitization)
// Canonical copy distributed into each function directory (Deno edge functions are deployed standalone).
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const ALLOWED_ORIGINS = [
  'https://gocivique.fr',
  'https://www.gocivique.fr',
  'http://localhost:8080',
];

/** CORS headers echoing the origin only when it is on the allowlist (no wildcard). */
export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? '';
  const h: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (ALLOWED_ORIGINS.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

export function preflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  return null;
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });
}

export function tooMany(req: Request, retryAfter: number): Response {
  return new Response(JSON.stringify({ error: 'Trop de requêtes. Réessayez plus tard.' }), {
    status: 429,
    headers: {
      ...corsHeaders(req),
      'Content-Type': 'application/json',
      'Retry-After': String(Math.max(retryAfter, 1)),
    },
  });
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

/** True when the caller presents the service-role key (internal / cron / admin scripts). */
export function isServiceRoleRequest(req: Request): boolean {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  return serviceKey.length > 0 && token === serviceKey;
}

/** Resolve the authenticated user from the Authorization bearer JWT, or null. */
export async function getAuthedUser(req: Request, supabase: SupabaseClient) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export interface RateResult { allowed: boolean; retryAfter: number }

/** Fixed-window rate limit backed by public.consume_rate_limit (fails open on errors). */
export async function rateLimit(
  supabase: SupabaseClient,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateResult> {
  try {
    const { data, error } = await supabase.rpc('consume_rate_limit', {
      p_key: key.slice(0, 200),
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error || !data) return { allowed: true, retryAfter: 0 };
    const d = data as { allowed?: boolean; retry_after_seconds?: number };
    return { allowed: !!d.allowed, retryAfter: d.retry_after_seconds ?? 0 };
  } catch {
    return { allowed: true, retryAfter: 0 };
  }
}

/** HTML-escape every user-supplied value interpolated into email HTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Parse a JSON body, rejecting oversized or malformed payloads. */
export async function readJson<T>(req: Request, maxBytes = 25_000): Promise<T | null> {
  const len = Number(req.headers.get('content-length') ?? '0');
  if (Number.isFinite(len) && len > maxBytes) return null;
  let text: string;
  try {
    text = await req.text();
  } catch {
    return null;
  }
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function isValidEmail(s: unknown): s is string {
  return typeof s === 'string' && s.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Coerce to a length-capped trimmed string ('' when not a string). */
export function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Only allow redirect/return URLs pointing at our own origins (blocks open redirects). */
export function isAllowedReturnUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.length > 300) return false;
  try {
    return ALLOWED_ORIGINS.includes(new URL(url).origin);
  } catch {
    return false;
  }
}
