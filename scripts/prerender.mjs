// Per-route prerender for the public SEO pages.
// Renders each route in headless Chromium (so client-only window/localStorage code
// runs) and writes dist/<route>/index.html with the page's real title/meta/body.
// NON-FATAL by design: any failure logs a warning and exits 0 so a prerender
// hiccup can never break the production build/deploy.
import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const PORT = 45777;
const ROUTES = [
  '/',
  '/guide-examen-civique',
  '/test-blanc-examen-civique',
  '/naturalisation-examen-civique',
  '/themes/valeurs-republique',
  '/themes/histoire-geographie',
  '/themes/institutions',
  '/themes/droits-devoirs',
  '/guides/combien-de-fois',
  '/guides/si-je-rate-lexamen',
  '/guides/combien-de-temps-resultats',
  '/guides/comment-sinscrire',
  '/about',
  '/cours/examen-civique-symboles-republique',
  '/cours/examen-civique-devise-francaise',
  '/cours/examen-civique-ddhc-1789',
  '/cours/examen-civique-laicite-neutralite',
  '/cours/examen-civique-republique-indivisible',
  '/cours/examen-civique-democratie-souverainete',
  '/cours/examen-civique-etat-de-droit',
  '/cours/examen-civique-egalite-femmes-hommes',
  '/cours/examen-civique-non-discrimination',
];
const MIME = { '.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.txt':'text/plain','.tsv':'text/tab-separated-values','.csv':'text/csv','.webmanifest':'application/manifest+json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(DIST, urlPath);
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      if (!path.extname(filePath) || !existsSync(filePath)) filePath = path.join(DIST, 'index.html');
      const data = await readFile(filePath);
      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      res.end(data);
    } catch { res.statusCode = 404; res.end('not found'); }
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function main() {
  if (!existsSync(path.join(DIST, 'index.html'))) { console.warn('[prerender] no dist/index.html, skipping'); return; }
  let chromium, puppeteer;
  try {
    chromium = (await import('@sparticuz/chromium')).default;
    puppeteer = (await import('puppeteer-core')).default;
  } catch (e) { console.warn('[prerender] deps unavailable, skipping:', e.message); return; }

  const server = await startServer();
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: await chromium.executablePath(),
      headless: chromium.headless ?? true,
    });
    let ok = 0;
    for (const route of ROUTES) {
      try {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (r) => {
          const u = r.url();
          if (/clarity\.ms|googletagmanager|google-analytics|fonts\.googleapis|fonts\.gstatic|doubleclick/.test(u)) r.abort();
          else r.continue();
        });
        await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await sleep(3500); // let React + react-helmet render head + body
        const html = await page.content();
        const outDir = route === '/' ? DIST : path.join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, 'index.html'), html);
        ok++;
        console.log('[prerender] OK', route);
        await page.close();
      } catch (e) { console.warn('[prerender] FAIL', route, '-', e.message); }
    }
    console.log(`[prerender] done: ${ok}/${ROUTES.length} routes`);
  } catch (e) {
    console.warn('[prerender] browser launch failed, site still deploys without prerender:', e.message);
  } finally {
    if (browser) { try { await browser.close(); } catch {} }
    server.close();
  }
}

main().catch((e) => console.warn('[prerender] non-fatal error:', e.message)).finally(() => process.exit(0));
