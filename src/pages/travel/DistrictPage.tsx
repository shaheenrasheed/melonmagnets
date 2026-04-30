import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { DistrictData, Category } from '../../types/travel';
import { SpotCard } from '../../components/travel/SpotCard';
import { FilterBar } from '../../components/travel/FilterBar';
import { HeroSection } from '../../components/travel/HeroSection';
import { StickyMagnetCTA, InlineMagnetCTA } from '../../components/travel/MagnetCTA';
import { getLastUpdated } from '../../lib/places';

const WHATSAPP_NUMBER = '919787337194';

function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, params);
  }
}

export default function DistrictPage({ data }: { data: DistrictData }) {
  const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');
  const lastUpdated = getLastUpdated();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);

  const jsonLd = useMemo(() => ({
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
  }), [data]);

  useEffect(() => {
    track('travel_page_view', { district: data.district.toLowerCase() });
  }, [data.district]);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [jsonLd]);

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

  return (
    <>
      {/* React 19 native metadata */}
      <title>{`${data.district} Tourist Places ${new Date().getFullYear()} — Timings, Entry Fees & Itinerary | MelonMagnets`}</title>
      <meta name="description" content={`Complete guide to ${data.spots.length} ${data.district} tourist spots with ticket prices, timings and Google Maps links. Free ${data.idealDays} itinerary.`} />
      <link rel="canonical" href={`https://www.melonmagnets.com/travel/${data.productSlug}`} />

      <div className="min-h-screen" style={{ backgroundColor: '#f2f2f7', fontFamily: "'Plus Jakarta Sans', sans-serif", paddingBottom: '80px' }}>

        {/* ── Sticky back nav ── */}
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

        {/* ── Hero with parallax ── */}
        <div className="overflow-hidden">
          <motion.div style={{ y: heroY }}>
            <HeroSection data={data} />
          </motion.div>
        </div>

        {/* ── Sticky filter bar (below nav: top-14) ── */}
        <div className="sticky top-14 z-30 backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <FilterBar
              active={activeFilter}
              categories={categories}
              onChange={setActiveFilter}
              filteredCount={filteredSpots.length}
              totalCount={data.spots.length}
            />
          </div>
        </div>

        {/* ── Spot list ── */}
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {filteredSpots.map(spot => (
              <SpotCard key={spot.name} spot={spot} />
            ))}
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <p className="text-xs text-gray-400 text-center py-4">
              Ratings &amp; photos updated {lastUpdated}
            </p>
          )}

          {/* Inline magnet CTA */}
          <div className="mt-4">
            <InlineMagnetCTA district={data.district} whatsappNumber={WHATSAPP_NUMBER} message={waMessage} />
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <StickyMagnetCTA district={data.district} whatsappNumber={WHATSAPP_NUMBER} message={waMessage} />
      </div>
    </>
  );
}
