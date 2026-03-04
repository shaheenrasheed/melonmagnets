import { useState, useRef, useCallback, memo } from 'react';
import { 
  Instagram, Mail, MapPin, Sparkles, Globe, 
  CheckCircle2, Ruler 
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

/** DATA STRUCTURES */
const RubberMagnets = [
  { id: 1, name: 'Standard Portrait', sizeIn: '2.17" × 3.39"', sizeCm: '5.5 × 8.6 cm', price: '₹50', media: '/videos/product1.mp4', fallback: '/images/product1.jpg' },
  { id: 2, name: 'Compact Rectangle', sizeIn: '1.97" × 2.95"', sizeCm: '5 × 7.5 cm', price: '₹30', media: '/videos/product2.mp4', fallback: '/images/product2.jpg' },
  { id: 3, name: 'Large Square', sizeIn: '2.75" × 2.75"', sizeCm: '6.99 × 6.99 cm', price: '₹30', media: '/videos/product4.mp4', fallback: '/images/product4.jpg' },
  { id: 4, name: 'Landscape Wide', sizeIn: '4" × 3"', sizeCm: '10.16 × 7.62 cm', price: '₹52', media: '/videos/product5.mp4', fallback: '/images/product5.jpg' },
  { id: 5, name: 'Sleek Rectangle', sizeIn: '1.97" × 3.15"', sizeCm: '5 × 8 cm', price: '₹60', media: '/videos/product6.mp4', fallback: '/images/product6.jpg' },
];

const PremiumMagnets = [
  { id: 6, name: 'Premium Photo Magnet', sizeIn: '2" × 2"', sizeCm: '5.08 × 5.08 cm', price: '₹70', media: '/videos/product3.mp4', fallback: '/images/product3.jpg' },
];

/** REUSABLE COMPONENTS */
const WhatsAppLogo = memo(({ size = 24 }: { size?: number }) => (
  <img 
    src="/whatsapp-logo.png" 
    alt="WhatsApp" 
    style={{ width: size, height: size }} 
    className="object-contain inline-block" 
  />
));

const MediaCard = memo(({ videoSrc, imageSrc, name }: { videoSrc: string; imageSrc: string, name: string }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="relative aspect-square bg-slate-100 overflow-hidden">
      <img 
        src={imageSrc} 
        alt={`${name} preview`}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <video 
        autoPlay muted loop playsInline 
        preload="metadata"
        onPlay={() => setVideoLoaded(true)}
        className={`relative z-10 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
});

/** MAIN APP */
export default function App() {
  const whatsappNumber = "919787337194";
  const instaLink = "https://www.instagram.com/melonmagnets/";
  const aboutRef = useRef<HTMLElement>(null);

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [requiredBy, setRequiredBy] = useState('');

  const handleWhatsApp = useCallback((msg: string) => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }, []);

  const handleProductInquiry = (m: any) => {
    handleWhatsApp(
`Hi Melon Magnets 👋

I'm interested in:

🧲 Product: ${m.name}
📏 Size: ${m.sizeIn} (${m.sizeCm})
💰 Price: ${m.price}

Please share more details. Thank you!`
    );
  };

  const handlePremiumInquiry = (m: any) => {
    handleWhatsApp(
`Hi Melon Magnets 👋

I'm interested in your Premium Magnet:

🧲 Product: ${m.name}
📏 Size: ${m.sizeIn} (${m.sizeCm})
💰 Price: ${m.price}

Please share customization details.`
    );
  };

  const submitBulkQuote = () => {
    handleWhatsApp(
`Hi Melon Magnets 👋

I'm interested in a bulk order.

📦 Estimated Quantity: ${quantity}
📍 Delivery Location: ${location}
📅 Required By: ${requiredBy}

Please share pricing and timeline details.`
    );

    setIsQuoteOpen(false);
    setQuantity('');
    setLocation('');
    setRequiredBy('');
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-slate-900 relative overflow-x-hidden">

      {/* BULK QUOTE MODAL */}
      {isQuoteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md space-y-4">
            <h3 className="font-bold text-lg">Bulk Quote Details</h3>

            <input
              type="number"
              placeholder="Estimated Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Delivery Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Required By (Date)"
              value={requiredBy}
              onChange={(e) => setRequiredBy(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-between gap-4">
              <button 
                onClick={() => setIsQuoteOpen(false)} 
                className="w-full border py-2 rounded-lg"
              >
                Cancel
              </button>

              <button 
                onClick={submitBulkQuote}
                className="w-full bg-[#25D366] text-white py-2 rounded-lg"
              >
                Send to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="sticky top-0 bg-white px-4 py-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10" />
            <span className="font-black uppercase">MelonMagnets</span>
          </button>

          <button 
            onClick={() => setIsQuoteOpen(true)} 
            className="bg-[#25D366] text-white px-5 py-2 rounded-full flex items-center gap-2"
          >
            <WhatsAppLogo size={16} /> Get Quote
          </button>
        </div>
      </nav>

      {/* PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {RubberMagnets.map(m => (
            <div key={m.id} className="border rounded-2xl overflow-hidden">
              <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
              <div className="p-4">
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.sizeIn} | {m.sizeCm}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-green-600">{m.price}</span>
                  <button onClick={() => handleProductInquiry(m)}>
                    <WhatsAppLogo size={28} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {PremiumMagnets.map(m => (
            <div key={m.id} className="border rounded-2xl overflow-hidden">
              <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
              <div className="p-4">
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.sizeIn} | {m.sizeCm}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-green-600">{m.price}</span>
                  <button onClick={() => handlePremiumInquiry(m)}>
                    <WhatsAppLogo size={28} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}