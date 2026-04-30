import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DISMISS_KEY = 'melon_cta_dismissed_v1';

function track(event: string, params: Record<string, string>) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', event, params);
  }
}

interface CTAProps {
  district: string;
  whatsappNumber: string;
  message: string;
}

export function StickyMagnetCTA({ district, whatsappNumber, message }: CTAProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  const handleClick = () => {
    track('magnet_cta_click', { district, location: 'sticky' });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950 border-t border-white/10 flex items-center gap-3 px-4"
      style={{ height: '60px' }}
    >
      <p className="flex-1 text-white font-medium leading-tight min-w-0 truncate" style={{ fontSize: '13px' }}>
        🧲 Taking this trip? Grab a {district} magnet!
      </p>
      <button
        onClick={handleClick}
        className="shrink-0 bg-[#25D366] text-white rounded-lg font-bold whitespace-nowrap"
        style={{ padding: '8px 14px', fontSize: '13px' }}
      >
        Order Now
      </button>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-slate-400 outline-none border-none bg-transparent cursor-pointer p-1"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export function InlineMagnetCTA({ district, whatsappNumber, message }: CTAProps) {
  const handleClick = () => {
    track('magnet_cta_click', { district, location: 'inline' });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: '#F5C518' }}>
      <p className="font-black text-stone-900 mb-1" style={{ fontSize: '17px', fontFamily: "'Inter', sans-serif" }}>
        Visiting {district}? Bring it home forever. 🧲
      </p>
      <p className="text-stone-700 mb-4" style={{ fontSize: '13px' }}>
        Custom fridge magnets of your favourite spots
      </p>
      <button
        onClick={handleClick}
        className="bg-stone-900 text-white rounded-xl font-bold w-full"
        style={{ padding: '13px', fontSize: '14px' }}
      >
        Order Your {district} Magnet →
      </button>
    </div>
  );
}
