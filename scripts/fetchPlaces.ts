/**
 * scripts/fetchPlaces.ts
 *
 * JOB 1 — Auto-discover Place IDs for spots where placeId === ''
 * JOB 2 — Fetch ratings + photos for every spot that has a placeId
 *
 * Usage:
 *   npm run fetch-places           full run, writes wayanad.ts + wayanadPlaces.json
 *   npm run fetch-places-dry       dry run — prints only, no file writes
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');
const DRY_RUN    = process.argv.includes('--dry-run');

// ─── Load .env ───────────────────────────────────────────────────────────────
const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t  = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq > 0) {
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('\n❌  Missing GOOGLE_PLACES_API_KEY in .env');
  console.error('    Add this line to your .env file:');
  console.error('    GOOGLE_PLACES_API_KEY=your_key_here\n');
  process.exit(1);
}

if (DRY_RUN) console.log('\n🔍  DRY RUN — no files will be written\n');

// ─── Import spot data ─────────────────────────────────────────────────────────
const { wayanadData } = await import('../src/data/travel/wayanad');
type RawSpot = { name: string; placeId: string };
const spots = wayanadData.spots as RawSpot[];
const wayanadPath = join(ROOT, 'src/data/travel/wayanad.ts');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function isGoodMatch(spotName: string, displayName: string): boolean {
  const first = spotName.split(/\s+/)[0].toLowerCase();
  return displayName.toLowerCase().includes(first);
}

function updatePlaceIdInSource(source: string, spotName: string, newId: string): string {
  const lines = source.split('\n');
  const nameIdx = lines.findIndex(l => l.includes(`name: '${spotName}'`));
  if (nameIdx === -1) return source;
  for (let i = nameIdx + 1; i < Math.min(nameIdx + 8, lines.length); i++) {
    if (lines[i].includes("placeId: ''")) {
      lines[i] = lines[i].replace("placeId: ''", `placeId: '${newId}'`);
      return lines.join('\n');
    }
  }
  return source;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchResponse {
  places?: Array<{
    id: string;
    displayName: { text: string };
    formattedAddress?: string;
  }>;
}

interface PlaceDetailsResponse {
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{ name: string }>;
}

interface SpotResult {
  placeId: string;
  rating?: number;
  reviewCount?: number;
  photos: string[];
}

// ─── JOB 1 — Discover missing Place IDs ──────────────────────────────────────
const emptySpots    = spots.filter(s => !s.placeId?.trim());
const discovered: Record<string, string> = {};
const discoveryFailed: string[] = [];

if (emptySpots.length > 0) {
  console.log(`\n📍  JOB 1 — Discovering Place IDs for ${emptySpots.length} spot(s)…\n`);

  for (const spot of emptySpots) {
    await sleep(100);
    try {
      const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textQuery: `${spot.name} Wayanad Kerala` }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json() as SearchResponse;
      const place = data.places?.[0];

      if (!place) {
        console.log(`  ✗  ${spot.name} → no results`);
        discoveryFailed.push(spot.name);
        continue;
      }

      const displayName = place.displayName.text;
      const good        = isGoodMatch(spot.name, displayName);
      const flag        = good ? '' : '  ⚠️  uncertain match';
      console.log(`  ✓  ${spot.name}`);
      console.log(`       → ${place.id}  ("${displayName}")${flag}`);
      discovered[spot.name] = place.id;
    } catch (err) {
      console.error(`  ✗  ${spot.name}: ${err}`);
      discoveryFailed.push(spot.name);
    }
  }

  if (Object.keys(discovered).length > 0) {
    if (!DRY_RUN) {
      let src = readFileSync(wayanadPath, 'utf-8');
      for (const [name, id] of Object.entries(discovered)) {
        src = updatePlaceIdInSource(src, name, id);
      }
      writeFileSync(wayanadPath, src, 'utf-8');
      console.log(`\n  📝  Updated wayanad.ts with ${Object.keys(discovered).length} new Place ID(s)\n`);
    } else {
      console.log(`\n  [DRY RUN] Would update wayanad.ts with ${Object.keys(discovered).length} Place ID(s)\n`);
    }
  }
} else {
  console.log('\n✅  All spots already have Place IDs — skipping discovery.\n');
}

// ─── Merge original + newly discovered IDs ────────────────────────────────────
const allPlaceIds: Record<string, string> = {};
for (const spot of spots) {
  const id = discovered[spot.name] || spot.placeId;
  if (id?.trim()) allPlaceIds[spot.name] = id;
}
const fetchableSpots = Object.entries(allPlaceIds);

// ─── JOB 2 — Fetch ratings + photos ──────────────────────────────────────────
console.log(`\n⭐  JOB 2 — Fetching ratings & photos for ${fetchableSpots.length} spot(s)…\n`);

async function fetchPhotoUri(photoName: string): Promise<string | null> {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json() as { photoUri?: string };
    return json.photoUri ?? null;
  } catch { return null; }
}

async function fetchSpotData(name: string, placeId: string): Promise<SpotResult> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY!,
      'X-Goog-FieldMask': 'rating,userRatingCount,photos',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json() as PlaceDetailsResponse;

  const refs  = (data.photos ?? []).slice(0, 5);
  const uris  = await Promise.all(refs.map(p => fetchPhotoUri(p.name)));

  return {
    placeId,
    rating:      data.rating,
    reviewCount: data.userRatingCount,
    photos:      uris.filter((u): u is string => u !== null),
  };
}

const results: Record<string, SpotResult> = {};
const fetchFailed: string[] = [];

for (const [name, placeId] of fetchableSpots) {
  await sleep(100);
  try {
    const r = await fetchSpotData(name, placeId);
    results[name] = r;
    console.log(`  ✓  ${name}  ⭐ ${r.rating ?? 'n/a'}  📷 ${r.photos.length}`);
  } catch (err) {
    fetchFailed.push(name);
    console.error(`  ✗  ${name}: ${err}`);
  }
}

// ─── Build output ─────────────────────────────────────────────────────────────
const allFailed   = [...new Set([...discoveryFailed, ...fetchFailed])];
const photosCount = Object.values(results).filter(r => r.photos.length > 0).length;

const output = {
  _meta: {
    lastUpdated:  new Date().toISOString().split('T')[0],
    totalSpots:   spots.length,
    successCount: Object.keys(results).length,
    failedSpots:  allFailed,
  },
  ...results,
};

const outPath = join(ROOT, 'src/data/travel/wayanadPlaces.json');

if (!DRY_RUN) {
  writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`\n  💾  Saved → src/data/travel/wayanadPlaces.json`);
} else {
  console.log('\n  [DRY RUN] First entry preview:');
  const preview = Object.entries(results)[0];
  if (preview) console.log(`  ${preview[0]}: ${JSON.stringify(preview[1]).slice(0, 120)}…`);
}

// ─── Summary box ──────────────────────────────────────────────────────────────
const W    = 42;
const rule = '═'.repeat(W);
const cell = (s: string) => `║  ${s.padEnd(W - 2)}║`;

console.log(`\n╔${rule}╗`);
console.log(`║${'    Wayanad Places Fetch Complete    '.padEnd(W)}║`);
console.log(`╠${rule}╣`);
console.log(cell(`✓ Place IDs discovered:  ${Object.keys(discovered).length}/${emptySpots.length}`));
console.log(cell(`✓ Ratings fetched:       ${Object.keys(results).length}/${fetchableSpots.length}`));
console.log(cell(`✓ Photos fetched:        ${photosCount}/${fetchableSpots.length}`));
if (allFailed.length > 0) {
  console.log(cell('✗ Failed spots:'));
  for (const n of allFailed) console.log(cell(`    - ${n}`));
}
console.log(`╚${rule}╝`);

console.log('\nNext steps:');
if (!DRY_RUN) {
  console.log('  • Review src/data/travel/wayanadPlaces.json');
  console.log('  • Commit: git add src/data/travel/wayanadPlaces.json src/data/travel/wayanad.ts');
}
if (allFailed.length > 0) {
  console.log('  • For failed spots, add placeId manually to wayanad.ts');
}
console.log();
