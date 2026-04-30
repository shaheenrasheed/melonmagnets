import { useState } from 'react';
import { ChevronDown, Clock, IndianRupee, MapPin, Globe, Lightbulb } from 'lucide-react';
import type { Spot } from '../../types/travel';

const BADGE_COLORS: Record<string, string> = {
  Adventure: 'bg-green-100 text-green-800',
  Nature: 'bg-emerald-100 text-emerald-800',
  Wildlife: 'bg-orange-100 text-orange-800',
  Culture: 'bg-purple-100 text-purple-800',
  Waterfall: 'bg-blue-100 text-blue-800',
  Viewpoint: 'bg-amber-100 text-amber-800',
};

function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, params);
  }
}

export function SpotCard({ spot }: { spot: Spot }) {
  const [expanded, setExpanded] = useState(false);

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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Collapsed header — always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left outline-none bg-transparent border-none cursor-pointer"
        style={{ minHeight: '56px' }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[spot.category] ?? 'bg-slate-100 text-slate-700'}`}>
              {spot.category}
            </span>
            {spot.isNew && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">NEW</span>
            )}
          </div>
          <p className="font-semibold text-slate-900 leading-snug" style={{ fontSize: '15px' }}>{spot.name}</p>
        </div>
        <ChevronDown
          size={17}
          className={`text-slate-400 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="pt-3 space-y-2 mb-3">
            <div className="flex items-start gap-2">
              <Clock size={13} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="text-slate-600" style={{ fontSize: '13px' }}>{spot.timings}</span>
            </div>
            <div className="flex items-start gap-2">
              <IndianRupee size={13} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800" style={{ fontSize: '13px' }}>{spot.price}</span>
                {spot.priceNote && (
                  <p className="text-slate-400 mt-0.5 leading-relaxed" style={{ fontSize: '12px' }}>{spot.priceNote}</p>
                )}
              </div>
            </div>
          </div>

          {spot.tip && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 mb-3">
              <Lightbulb size={13} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 italic leading-relaxed" style={{ fontSize: '12px' }}>{spot.tip}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {spot.mapsUrl && (
              <a
                href={spot.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleMapsClick}
                className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl font-semibold w-full"
                style={{ padding: '11px', fontSize: '14px' }}
              >
                <MapPin size={14} /> Open in Maps
              </a>
            )}
            {spot.website && (
              <a
                href={spot.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 rounded-xl font-semibold w-full"
                style={{ padding: '11px', fontSize: '14px' }}
              >
                <Globe size={14} /> Official Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
