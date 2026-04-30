import { motion } from 'framer-motion';

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

export function InlineMagnetCTA({ district, whatsappNumber, message }: CTAProps) {
  const handleClick = () => {
    track('magnet_cta_click', { district, location: 'inline' });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    // Outer wrapper adds top padding so the overflowing image has room above the card
    <div style={{ paddingTop: '44px' }}>
      <div
        className="rounded-2xl relative"
        style={{ backgroundColor: '#F5C518', padding: '22px 20px 22px 20px', minHeight: '155px' }}
      >
        {/* Left column — text + button, padded right to leave room for the image */}
        <div style={{ paddingRight: '128px' }}>
          <p
            className="font-black text-stone-900 leading-snug mb-2"
            style={{ fontSize: '17px', fontFamily: "'Inter', sans-serif" }}
          >
            Visiting {district}?<br />Bring it home forever. 🧲
          </p>
          <p className="text-stone-700 mb-4" style={{ fontSize: '13px' }}>
            Custom fridge magnets of your favourite spots
          </p>
          <button
            onClick={handleClick}
            className="text-white font-bold rounded-xl"
            style={{
              backgroundColor: '#111111',
              padding: '12px 18px',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Order Your {district} Magnet →
          </button>
        </div>

        {/* Magnet image — absolutely positioned, overflows above the card */}
        <motion.img
          src="/magnet.png"
          alt={`${district} fridge magnet`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            right: '-2px',
            top: '-44px',
            height: '190px',
            width: 'auto',
            objectFit: 'contain',
            backgroundColor: 'transparent',
            rotate: 10,                                       // Framer Motion compose with y animation
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
          }}
        />
      </div>
    </div>
  );
}

// Kept for reference — removed from DistrictPage per user request
export function StickyMagnetCTA(_props: CTAProps) {
  return null;
}
