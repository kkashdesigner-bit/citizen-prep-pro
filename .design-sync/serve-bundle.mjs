// Local static server for reviewing the design-sync bundle (ds-bundle/).
// Serves every file including dot-prefixed ones (.review.html), with `/`
// mapped to the review page. Used for visual verification of preview cards.
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const ROOT = resolve("ds-bundle");
const PORT = 4505;
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    res.statusCode = 400;
    return res.end();
  }
  if (pathname === "/") pathname = "/.review.html";
  const p = resolve(ROOT, "." + pathname);
  if (!p.startsWith(ROOT + sep) || !existsSync(p) || !statSync(p).isFile()) {
    res.statusCode = 404;
    return res.end("not found");
  }
  res.setHeader("Content-Type", MIME[extname(p)] ?? "application/octet-stream");
  res.end(readFileSync(p));
}).listen(PORT, "127.0.0.1", () =>
  console.log(`serving ds-bundle at http://127.0.0.1:${PORT}/`),
);
