/**
 * scripts/generateMetaPages.ts
 *
 * Runs after `vite build`. Creates route-specific HTML files so WhatsApp,
 * Facebook and Google see the correct title + OG tags for each page.
 *
 * How it works:
 *   Render serves a real file before falling back to the SPA rewrite rule.
 *   So dist/travel/wayanad/index.html is served directly to crawlers,
 *   while React Router still handles in-app navigation for real users.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const base = readFileSync(join(DIST, 'index.html'), 'utf-8');

interface RouteMeta {
  /** Path inside dist/, e.g. "travel/wayanad" → dist/travel/wayanad/index.html */
  distPath: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
}

// ── Add new districts here as you build them ──────────────────────────────────
const routes: RouteMeta[] = [
  {
    distPath: 'travel/wayanad',
    title: 'Wayanad Tourist Places 2026 — Timings, Entry Fees & Itinerary | MelonMagnets',
    description:
      'Complete guide to 30 Wayanad tourist spots with ticket prices, timings and Google Maps links. ' +
      'Soochipara Falls, Edakkal Caves, Banasura Dam & more. Free 3-day itinerary.',
    url: 'https://www.melonmagnets.com/travel/wayanad',
    ogImage: 'https://www.melonmagnets.com/images/travel/wayanad-og.jpg',
  },
  {
    distPath: 'travel',
    title: 'Kerala Travel Guide — Tourist Spots, Timings & Entry Fees | MelonMagnets',
    description:
      'Free travel guides for Kerala districts. Timings, ticket prices and Google Maps links ' +
      'for every major tourist spot. Wayanad, Munnar, Alleppey & more.',
    url: 'https://www.melonmagnets.com/travel',
    ogImage: 'https://www.melonmagnets.com/images/travel/kerala-og.jpg',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function injectMeta(html: string, m: RouteMeta): string {
  const block = `<title>${m.title}</title>
    <meta name="description" content="${m.description}" />
    <meta property="og:title" content="${m.title}" />
    <meta property="og:description" content="${m.description}" />
    <meta property="og:url" content="${m.url}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${m.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="MelonMagnets Travel Guide" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${m.title}" />
    <meta name="twitter:description" content="${m.description}" />
    <meta name="twitter:image" content="${m.ogImage}" />
    <link rel="canonical" href="${m.url}" />`;

  return html
    // Strip existing title
    .replace(/<title>[^<]*<\/title>/, '')
    // Strip existing og/twitter/canonical tags (handles multi-line values with [^>]*)
    .replace(/<meta name="description"[^>]*\/>/g, '')
    .replace(/<meta property="og:[^"]*"[^>]*\/>/g, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*\/>/g, '')
    .replace(/<link rel="canonical"[^>]*\/>/g, '')
    // Inject the full route-specific block right after <meta charset>
    .replace(
      /(<meta charset="UTF-8" \/>)/,
      `$1\n    ${block}`,
    );
}

let ok = 0;
const failed: string[] = [];

for (const route of routes) {
  try {
    const html = injectMeta(base, route);
    const dir  = join(DIST, route.distPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf-8');
    console.log(`  ✓  dist/${route.distPath}/index.html`);
    ok++;
  } catch (err) {
    console.error(`  ✗  ${route.distPath}: ${err}`);
    failed.push(route.distPath);
  }
}

console.log(`\n📋  ${ok} route HTML file(s) generated.`);
if (failed.length) console.log(`❌  Failed: ${failed.join(', ')}`);
console.log(
  '\nHow it works:\n' +
  '  Render serves a real file before the SPA rewrite rule.\n' +
  '  WhatsApp/Google see the correct OG tags in these static files.\n' +
  '  React Router still handles in-app navigation for real users.\n'
);
