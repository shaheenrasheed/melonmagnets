import wayanadPlaces from '../data/travel/wayanadPlaces.json';

export interface PlaceCache {
  rating?: number;
  reviewCount?: number;
  photos: string[];
}

type PlacesJson = Record<string, unknown>;

export function getPlaceData(spotName: string): PlaceCache {
  const json = wayanadPlaces as PlacesJson;
  const entry = json[spotName] as PlaceCache | undefined;
  if (entry && Array.isArray(entry.photos)) return entry;
  return { photos: [] };
}

export function formatReviewCount(n?: number): string {
  if (!n) return '';
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function getLastUpdated(): string {
  const json = wayanadPlaces as PlacesJson;
  const meta = json['_meta'] as { lastUpdated?: string } | undefined;
  const d = meta?.lastUpdated ?? '';
  if (!d || d.startsWith('Run')) return '';
  return d;
}
