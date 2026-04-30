import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { DistrictData, Category } from '../../types/travel';
import { SpotCard } from '../../components/travel/SpotCard';
import { FilterBar } from '../../components/travel/FilterBar';
import { HeroSection } from '../../components/travel/HeroSection';
import { StickyMagnetCTA, InlineMagnetCTA } from '../../components/travel/MagnetCTA';

const WHATSAPP_NUMBER = '919787337194';

function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, params);
  }
}

export default function DistrictPage({ data }: { data: DistrictData }) {
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');

  useEffect(() => {
    track('travel_page_view', { district: data.district.toLowerCase() });
  }, [data.district]);

  // Inject JSON-LD structured data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => {
    const seen = new Set<Category>();
    data.spots.forEach(s => seen.add(s.category));
    return Array.from(seen);
  }, [data.spots]);

  const filteredSpots = useMemo(
    () => activeFilter === 'All' ? data.spots : data.spots.filter(s => s.category === activeFilter),
    [data.spots, activeFilter]
  );

  const waMessage = `Hi! I'm planning a trip to ${data.district} and want to order a magnet!`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${data.district} Tourist Places`,
    description: `Complete list of tourist spots in ${data.district}, ${data.state} with timings and entry fees`,
    numberOfItems: data.spots.length,
    itemListElement: data.spots.map((spot, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: spot.name,
      description: spot.tip,
    })),
  };

  return (
    <>
      {/* React 19 native metadata — hoisted to <head> automatically */}
      <title>{`${data.district} Tourist Places ${new Date().getFullYear()} — Timings, Entry Fees & Itinerary | MelonMagnets`}</title>
      <meta name="description" content={`Complete guide to ${data.spots.length} ${data.district} tourist spots with ticket prices, timings and Google Maps links. Free ${data.idealDays} itinerary.`} />
      <link rel="canonical" href={`https://www.melonmagnets.com/travel/${data.productSlug}`} />

      <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px' }}>
        {/* Sticky nav bar */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link
              to="/travel"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors outline-none"
              style={{ fontSize: '14px' }}
            >
              <ArrowLeft size={15} />
              All Destinations
            </Link>
            <span className="text-slate-300 text-sm">·</span>
            <span className="text-slate-800 font-semibold" style={{ fontSize: '14px' }}>{data.district}</span>
          </div>
        </nav>

        <HeroSection data={data} />

        <div className="max-w-2xl mx-auto px-4 py-5">
          {/* Filter tabs */}
          <FilterBar active={activeFilter} categories={categories} onChange={setActiveFilter} />

          {/* Spot count */}
          <p className="text-slate-400 mt-3 mb-4" style={{ fontSize: '12px' }}>
            {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''}
            {activeFilter !== 'All' ? ` · ${activeFilter}` : ' · tap any card to expand'}
          </p>

          {/* Spot list */}
          <div className="space-y-2.5">
            {filteredSpots.map(spot => (
              <SpotCard key={spot.name} spot={spot} />
            ))}
          </div>

          {/* Inline CTA at bottom */}
          <div className="mt-8">
            <InlineMagnetCTA district={data.district} whatsappNumber={WHATSAPP_NUMBER} message={waMessage} />
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <StickyMagnetCTA district={data.district} whatsappNumber={WHATSAPP_NUMBER} message={waMessage} />
      </div>
    </>
  );
}
