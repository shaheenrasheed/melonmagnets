import { useState, useRef, useCallback, memo } from 'react';
import { Mail, MapPin, Globe, Ruler, X, Calendar, ArrowRight, CheckCircle, InstagramIcon } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { WovenCanvas } from './components/ui/woven-canvas';

const RubberMagnets = [
  { id: 1, name: 'Standard Portrait', sizeIn: '2.17" × 3.39"', sizeCm: '5.5 × 8.6 cm', price: '₹50', media: '/videos/product1.mp4', fallback: '/images/product1.jpg' },
  { id: 2, name: 'Compact Rectangle', sizeIn: '1.97" × 2.95"', sizeCm: '5 × 7.5 cm', price: '₹30', media: '/videos/product2.mp4', fallback: '/images/product2.jpg' },
  { id: 3, name: 'Large Square', sizeIn: '2.75" × 2.75"', sizeCm: '6.99 × 6.99 cm', price: '₹30', media: '/videos/product4.mp4', fallback: '/images/product4.jpg' },
  { id: 4, name: 'Landscape Wide', sizeIn: '4" × 3"', sizeCm: '10.16 × 7.62 cm', price: '₹52', media: '/videos/product5.mp4', fallback: '/images/product5.jpg' },
  { id: 5, name: 'Sleek Rectangle', sizeIn: '1.97" × 3.15"', sizeCm: '5 × 8 cm', price: '₹60', media: '/videos/product6.mp4', fallback: '/images/product6.jpg' },
];

const PremiumMagnets = [
  { id: 6, name: 'Square Photo Magnet', sizeIn: '2" × 2"', sizeCm: '5.08 × 5.08 cm', price: '₹70', media: '/videos/product3.mp4', fallback: '/images/product3.jpg' },
];

const CLIENTS = [
  { src: '/clients/Zolo Stays.png', name: 'Zolo Stays' },
  { src: '/clients/NCN Srivari.png', name: 'NCN Srivari' },
  { src: '/clients/TA.png', name: 'TA' },
  { src: '/clients/Sumadhura-Circle-logo.jpg', name: 'Sumadhura' },
  { src: '/clients/Eternal happiness convention logo 2026.png', name: 'Eternal Happiness Convention' },
];

const WhatsAppLogo = memo(({ size = 24 }: { size?: number }) => (
  <img src="/whatsapp-logo.png" alt="WhatsApp" style={{ width: size, height: size }} className="object-contain inline-block" />
));

const MediaCard = memo(({ videoSrc, imageSrc, name }: { videoSrc: string; imageSrc: string; name: string }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  return (
    <div className="relative aspect-square bg-slate-100 overflow-hidden">
      <img
        src={imageSrc}
        alt={`${name} preview`}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Melon+Magnets'; }}
      />
      <video
        autoPlay muted loop playsInline preload="metadata"
        onPlay={() => setVideoLoaded(true)}
        className={`relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
});

export default function App() {
  const whatsappNumber = '919787337194';
  const instaLink = 'https://www.instagram.com/melonmagnets/';
  const productsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState({ qty: '', location: '', date: '', size: '' });

  const trackConversion = (label: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'whatsapp_conversion', { event_category: 'Conversion', event_label: label, value: 1.0 });
    }
  };

  const handleProductInquiry = useCallback((product: any) => {
    trackConversion(`Inquiry: ${product.name}`);
    const message = `Hi Melon Magnets!\n\nI'm interested in:\n\nProduct: ${product.name}\nSize: ${product.sizeIn} | ${product.sizeCm}\nPrice: ${product.price}\n\nPlease share more details.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }, [whatsappNumber]);

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('Bulk Quote Success');
    const message = `Hi Melon Magnets!\n\nI'd like to place a bulk order.\n\nQuantity: ${quoteDetails.qty}\nSize: ${quoteDetails.size}\nLocation: ${quoteDetails.location}\nRequired By: ${quoteDetails.date}\n\nPlease share pricing and timeline.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsQuoteModalOpen(false);
  };

  const fadeUp: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: (i = 0) => ({ y: 0, opacity: 1, transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2.5 outline-none bg-transparent border-none cursor-pointer group"
          >
            <img src="/logo.png" alt="MelonMagnets" className="h-9 md:h-14 w-auto group-hover:scale-105 transition-transform" />
            <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-base font-bold tracking-tight text-slate-800">
              Melon<span className="text-melon-yellow">Magnets</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer outline-none">Products</button>
            <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer outline-none">About</button>
            <a href="mailto:hello@melonmagnets.com" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Contact</a>
          </div>

          <button
            onClick={() => { trackConversion('Navbar Quote Click'); setIsQuoteModalOpen(true); }}
            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors shadow-sm outline-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <WhatsAppLogo size={16} /> Get Quote
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-stone-950 min-h-[88vh] flex items-center">
        <WovenCanvas />
        {/* Gradient: solid dark on left (text area) fades to transparent on right (particles show) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-stone-950 from-40% via-stone-950/75 via-65% to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 w-full">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-melon-yellow/10 border border-melon-yellow/25 text-melon-yellow px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-melon-yellow animate-pulse inline-block" />
              Bengaluru's Premium Magnet Studio
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Turn moments into<br />
              <span className="text-melon-yellow">magnetic memories.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-base md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl font-normal">
              Custom fridge magnets and souvenirs for corporate events, weddings, and bulk gifting — designed with care, delivered pan-India.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { trackConversion('Hero Quote Click'); setIsQuoteModalOpen(true); }}
                className="flex items-center gap-2 bg-melon-yellow text-stone-900 px-6 py-3 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors outline-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Get a Quote <ArrowRight size={16} />
              </button>
              <button
                onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors bg-transparent outline-none cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Browse Products
              </button>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={fadeUp} custom={4}
            initial="hidden" animate="visible"
            className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-16 pt-10 border-t border-white/10"
          >
            {[
              { value: '6,000+', label: 'Magnets sold' },
              { value: '100+', label: 'Minimum bulk units' },
              { value: 'Worldwide', label: 'Shipping coverage' },
              { value: '2 types', label: 'Rubber & metal magnets' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── CLIENTS ── */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
            Trusted by leading brands
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 md:w-40 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 md:w-40 bg-gradient-to-l from-white to-transparent" />
          <div className="flex w-max animate-marquee gap-16 md:gap-24 items-center px-12">
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center justify-center h-12 md:h-16 shrink-0 cursor-pointer"
                title={client.name}
              >
                <img
                  src={client.src}
                  alt={client.name}
                  className="max-h-full max-w-[110px] md:max-w-[150px] w-auto object-contain transition-all duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <main ref={productsRef} className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">

        {/* Category 01 */}
        <section className="mb-24">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-melon-yellow mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Category 01</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Flexible Rubber Magnets
            </h2>
            <p className="text-slate-500 text-base max-w-xl">Thin, lightweight, and bendable. The go-to choice for travel souvenirs, events, and bulk corporate gifting.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {RubberMagnets.map((m, idx) => (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-melon-yellow/40 hover:shadow-lg hover:shadow-yellow-100 transition-all duration-300"
              >
                <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-1.5 leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>{m.name}</h3>
                  <p className="text-slate-400 text-xs mb-4 font-mono tracking-tight">
                    {m.sizeIn} <span className="text-slate-300 mx-0.5">|</span> {m.sizeCm}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl md:text-2xl font-bold text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>{m.price}</span>
                    <button onClick={() => handleProductInquiry(m)} className="p-1 hover:scale-110 transition-transform outline-none bg-transparent border-none cursor-pointer">
                      <WhatsAppLogo size={30} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Custom bulk card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: RubberMagnets.length * 0.07 }}
              className="border border-dashed border-melon-yellow/40 rounded-xl overflow-hidden bg-yellow-50/60 flex flex-col hover:bg-yellow-50 transition-all duration-300"
            >
              <div className="aspect-square flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-melon-yellow/15 flex items-center justify-center mb-4">
                  <Ruler size={18} className="text-melon-yellow" />
                </div>
                <h3 className="font-bold text-sm md:text-lg text-slate-800 leading-snug mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Custom Size<br />Bulk Orders</h3>
                <span className="text-xs bg-slate-800 text-white px-3 py-1 rounded-full font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Min 100 units</span>
              </div>
              <div className="p-4 md:p-6 border-t border-dashed border-melon-yellow/30">
                <button
                  onClick={() => { trackConversion('Grid Request Quote Click'); setIsQuoteModalOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors outline-none cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <WhatsAppLogo size={16} /> Request Quote
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category 02 */}
        <section>
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-melon-yellow mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Category 02</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Square Metal Magnets
            </h2>
            <p className="text-slate-500 text-base max-w-xl">Thick, glossy, and premium-feel. Ideal for photo gifts, couples, baby milestones, and special occasions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Feature list */}
            <div className="border border-yellow-100 rounded-xl p-6 md:p-8 bg-yellow-50/50">
              <p className="text-sm font-semibold text-slate-700 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>Perfect for</p>
              <ul className="space-y-3">
                {['Photo gifts', 'Baby photos', 'Couples & weddings', 'Corporate gifting'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle size={15} className="text-melon-yellow shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product cards */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
              {PremiumMagnets.map((m, idx) => (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-melon-yellow/40 hover:shadow-lg hover:shadow-yellow-100 transition-all duration-300"
                >
                  <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
                  <div className="p-4 md:p-6">
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{m.name}</h3>
                    <p className="text-slate-400 text-xs mb-4 font-mono tracking-tight">
                      {m.sizeIn} <span className="text-slate-300 mx-0.5">|</span> {m.sizeCm}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl md:text-2xl font-bold text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>{m.price}</span>
                      <button onClick={() => handleProductInquiry(m)} className="p-1 hover:scale-110 transition-transform outline-none bg-transparent border-none cursor-pointer">
                        <WhatsAppLogo size={30} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── ABOUT ── */}
      <section ref={aboutRef} className="bg-stone-950 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16 md:pt-28 md:pb-20">

          {/* Headline + Story */}
          <div className="grid md:grid-cols-5 gap-12 md:gap-16 mb-16 md:mb-24 items-start">
            <div className="md:col-span-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-melon-yellow mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>About Us</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                Making memories stick<br />since day one.
              </h2>
            </div>
            <div className="md:col-span-3 flex flex-col justify-end space-y-5 text-slate-400 text-sm md:text-base leading-relaxed md:pt-3">
              <p>Melon Magnets started in Bengaluru with one idea — turn special moments into beautiful keepsakes that last.</p>
              <p>From custom photo magnets to large-scale event orders, we work with brands, event organizers, and individuals who care about quality and detail.</p>
              <p className="text-melon-yellow font-semibold">Every magnet tells a story. Let's create yours.</p>
            </div>
          </div>

          {/* Contact strip */}
          <div className="border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <a href="mailto:hello@melonmagnets.com" className="group outline-none">
              <div className="flex items-center gap-2 mb-3">
                <Mail size={13} className="text-melon-yellow" />
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>Email us</p>
              </div>
              <p className="text-white text-sm md:text-base font-medium group-hover:text-melon-yellow transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>hello@melonmagnets.com</p>
            </a>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={13} className="text-melon-yellow" />
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>Studio location</p>
              </div>
              <p className="text-white text-sm md:text-base font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Vizbook, Yashwantpur,<br />Bengaluru 560022</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={13} className="text-melon-yellow" />
                <p className="text-xs font-semibold tracking-widest uppercase text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>Delivery</p>
              </div>
              <p className="text-white text-sm md:text-base font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Pan-India shipping available</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-950 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MelonMagnets" className="h-10 w-auto" />
            <span className="text-sm font-bold text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Melon<span className="text-melon-yellow">Magnets</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 order-last md:order-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 Melon Magnets. Made with care in Bengaluru.
          </p>

          <div className="flex items-center gap-4">
            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-melon-yellow hover:border-melon-yellow/30 transition-colors outline-none">
              <InstagramIcon size={16} />
            </a>
            <button
              onClick={() => { trackConversion('Footer WhatsApp'); setIsQuoteModalOpen(true); }}
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors outline-none cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <WhatsAppLogo size={14} /> Get in touch
            </button>
          </div>
        </div>
      </footer>

      {/* ── QUOTE MODAL ── */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full md:max-w-md bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>Bulk Inquiry</h3>
                    <p className="text-xs text-slate-400 mt-0.5">We'll respond within 24 hours</p>
                  </div>
                  <button onClick={() => setIsQuoteModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors outline-none cursor-pointer">
                    <X size={18} className="text-slate-500" />
                  </button>
                </div>
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  {[
                    { key: 'qty', label: 'Estimated Quantity', type: 'number', placeholder: 'e.g. 150' },
                    { key: 'size', label: 'Size Preference', type: 'text', placeholder: 'e.g. 2×2 inch or Custom Shape' },
                    { key: 'location', label: 'Delivery Location', type: 'text', placeholder: 'City, State' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                      <input
                        required type={type} placeholder={placeholder}
                        value={quoteDetails[key as keyof typeof quoteDetails]}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, [key]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-melon-yellow focus:border-transparent transition-all outline-none placeholder:text-slate-400"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Required By</label>
                    <div className="relative">
                      <input
                        required type="date"
                        value={quoteDetails.date}
                        onChange={(e) => setQuoteDetails({ ...quoteDetails, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-melon-yellow focus:border-transparent transition-all outline-none appearance-none"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors mt-2 outline-none cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <WhatsAppLogo size={18} /> Send via WhatsApp
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
