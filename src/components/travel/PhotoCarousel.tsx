import { useRef, useState } from 'react';

const GRADIENTS: Record<string, string> = {
  Adventure: 'bg-gradient-to-br from-green-900 to-stone-950',
  Nature:    'bg-gradient-to-br from-teal-900 to-green-950',
  Wildlife:  'bg-gradient-to-br from-orange-900 to-stone-950',
  Culture:   'bg-gradient-to-br from-purple-900 to-stone-950',
  Waterfall: 'bg-gradient-to-br from-blue-900 to-cyan-950',
  Viewpoint: 'bg-gradient-to-br from-amber-900 to-stone-950',
};

const EMOJI: Record<string, string> = {
  Adventure: '🏔',
  Nature:    '🌿',
  Wildlife:  '🐘',
  Culture:   '🏛',
  Waterfall: '🌊',
  Viewpoint: '👁',
};

interface Props {
  photos: string[];
  spotName: string;
  category: string;
}

export function PhotoCarousel({ photos, spotName, category }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (photos.length === 0) {
    return (
      <div
        className={`h-[140px] rounded-t-2xl flex flex-col items-center justify-center ${GRADIENTS[category] ?? 'bg-gradient-to-br from-slate-800 to-stone-950'}`}
      >
        <span className="text-4xl mb-2">{EMOJI[category] ?? '📍'}</span>
        <p className="text-white text-xs font-medium text-center px-4 leading-snug">{spotName}</p>
        <p className="text-white/40 text-xs mt-1">📷 Photos coming soon</p>
      </div>
    );
  }

  return (
    <div className="relative h-[140px] rounded-t-2xl overflow-hidden">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex h-full overflow-x-scroll [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
      >
        {photos.map((url, i) => (
          <div key={i} className="shrink-0 w-full h-full" style={{ scrollSnapAlign: 'start' }}>
            <img
              src={url}
              alt={`${spotName} ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-200 ${
                i === active ? 'w-4 h-1.5 bg-[#F5C518]' : 'w-1.5 h-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
