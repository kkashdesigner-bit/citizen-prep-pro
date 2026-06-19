// Vercel Edge Middleware — serves fully Chrome-rendered HTML to crawlers via
// Prerender.io so the SPA's per-route pages are indexable. It is intentionally
// FAIL-OPEN: only known bot user-agents are proxied, and ANY error (or a missing
// PRERENDER_TOKEN) falls straight through to the normal site, so real visitors
// are never affected.
import { next } from '@vercel/edge';

export const config = {
  // Run on page routes only — skip /api, static assets, and any path with a file extension.
  matcher: '/((?!api/|assets/|.*\\.).*)',
};

const BOT = /bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|slackbot|linkedinbot|whatsapp|applebot|petalbot|embedly|pinterest|redditbot|telegrambot|discordbot|ia_archiver|chatgpt|gptbot|claudebot|perplexity/i;

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (request.method !== 'GET' || !BOT.test(ua)) return next();

  const token = process.env.PRERENDER_TOKEN;
  if (!token) return next();

  try {
    const u = new URL(request.url);
    const target = `https://service.prerender.io/${u.protocol}//${u.host}${u.pathname}${u.search}`;
    const res = await fetch(target, {
      headers: { 'X-Prerender-Token': token, 'User-Agent': ua },
    });
    if (!res.ok) return next();
    const html = await res.text();
    return new Response(html, {
      status: res.status,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
        'x-prerendered-by': 'prerender.io',
      },
    });
  } catch {
    return next();
  }
}
