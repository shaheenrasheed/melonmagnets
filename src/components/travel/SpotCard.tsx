import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Ticket, Info, MapPin, ExternalLink } from 'lucide-react';
import type { Spot } from '../../types/travel';
import { getPlaceData } from '../../lib/places';
import { PhotoCarousel } from './PhotoCarousel';
import { RatingBadge } from './RatingBadge';

const BADGE_COLORS: Record<string, string> = {
  Adventure: 'bg-green-100 text-green-800',
  Nature:    'bg-emerald-100 text-emerald-800',
  Wildlife:  'bg-orange-100 text-orange-800',
  Culture:   'bg-purple-100 text-purple-800',
  Waterfall: 'bg-blue-100 text-blue-800',
  Viewpoint: 'bg-amber-100 text-amber-800',
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[category] ?? 'bg-gray-100 text-gray-700'}`}>
      {category}
    </span>
  );
}

function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, params);
  }
}

export function SpotCard({ spot }: { spot: Spot }) {
  const [expanded, setExpanded] = useState(false);

  // Synchronous — reads from static wayanadPlaces.json bundle, no loading state
  const placeData = getPlaceData(spot.name);
  const photos = placeData.photos;
  const rating = placeData.rating ?? spot.googleRating;
  const reviewCount = placeData.reviewCount ?? spot.reviewCount;

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) track('spot_card_expand', { spot_name: spot.name });
  };

  const handleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    track('maps_link_click', { spot_name: spot.name });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '0.5px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <PhotoCarousel photos={photos} spotName={spot.name} category={spot.category} />

      <div className="p-3">
        {/* Name + NEW badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-semibold text-gray-900 text-[15px] leading-snug flex-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {spot.name}
          </h3>
          {spot.isNew && (
            <span
              className="text-[9px] font-bold bg-[#F5C518] text-[#111] px-2 py-0.5 rounded-full shrink-0 mt-0.5 uppercase tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              NEW
            </span>
          )}
        </div>

        {/* Category + Rating */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryBadge category={spot.category} />
          <RatingBadge rating={rating} reviewCount={reviewCount} />
        </div>

        {/* Accordion toggle */}
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between text-sm text-gray-500 py-2 border-t border-gray-100 active:text-gray-800 outline-none bg-transparent border-x-0 border-b-0 cursor-pointer"
        >
          <span>{expanded ? 'Hide details' : 'View timings & fees'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2.5">
                <div className="flex gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                  <span>{spot.timings}</span>
                </div>

                <div className="flex gap-2 text-sm text-gray-600">
                  <Ticket className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                  <span>{spot.price}</span>
                </div>

                {spot.priceNote && (
                  <div className="flex gap-2 text-xs text-gray-400">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{spot.priceNote}</span>
                  </div>
                )}

                {spot.tip && (
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-3">
                    <p className="text-xs text-green-800 italic leading-relaxed">💡 {spot.tip}</p>
                  </div>
                )}

                <div
                  className={`grid gap-2 pt-1 ${spot.mapsUrl && spot.website ? 'grid-cols-2' : 'grid-cols-1'}`}
                >
                  {spot.mapsUrl && (
                    <a
                      href={spot.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleMapsClick}
                      className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl py-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4" /> Maps
                    </a>
                  )}
                  {spot.website && (
                    <a
                      href={spot.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
