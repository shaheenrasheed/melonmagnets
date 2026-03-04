import { useState, useRef, useCallback, memo } from 'react';
import { 
  Instagram, Mail, MapPin, Sparkles, Globe, 
  CheckCircle2, Ruler, X, Calendar, Send
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/** * DATA STRUCTURES  */
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

/** * REUSABLE COMPONENTS */
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
        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=Melon+Magnets"; }}
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

const SectionHeader = ({ id, title, description, tags }: { id: string, title: string, description: string, tags?: string[] }) => (
  <div className="bg-orange-50 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] mb-6 md:mb-10 border border-orange-100">
    <span className="text-melon-orange font-black text-[9px] tracking-[0.2em] uppercase mb-2 block font-bold">Category {id}</span>
    <h2 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase mb-3 text-slate-800 tracking-tight leading-none">{title}</h2>
    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 italic">{description}</p>
    {tags && (
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[8px] font-black bg-white border border-orange-200 px-2.5 py-1 rounded-full uppercase tracking-widest text-melon-orange shadow-sm">{tag}</span>
        ))}
      </div>
    )}
  </div>
);

export default function App() {
  const whatsappNumber = "919787337194";
  const instaLink = "https://www.instagram.com/melonmagnets/";
  const aboutRef = useRef<HTMLElement>(null);
  
  // Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState({ qty: '', location: '', date: '' });

  const scrollToAbout = useCallback(() => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /** IMPROVED PRODUCT MESSAGE FORMATTING */
  const handleProductInquiry = useCallback((product: any) => {
    const message = `Hi Melon Magnets 👋\n\nI'm interested in:\n\nProduct: ${product.name}\nSize: ${product.sizeIn} (${product.sizeCm})\nPrice: ${product.price}\n\nPlease share more details. Thank you!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }, [whatsappNumber]);

  /** IMPROVED BULK MESSAGE FORMATTING */
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi Melon Magnets 👋\n\nI'm interested in placing a bulk order.\n\nEstimated Quantity: ${quoteDetails.qty}\nDelivery Location: ${quoteDetails.location}\nRequired By: ${quoteDetails.date}\n\nPlease share pricing and timeline details.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setIsQuoteModalOpen(false);
  };

  const heroVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-slate-900 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[5%] left-[-10%] w-72 h-72 bg-melon-orange/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-melon-green/5 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg px-4 md:px-6 py-4 border-b border-slate-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button 
              onClick={scrollToAbout} 
              className="flex items-center gap-3 cursor-pointer group outline-none border-none bg-transparent"
            >
              <img src="/logo.png" alt="MelonMagnets Logo" className="h-10 md:h-16 w-auto transition-transform group-hover:scale-105" />
              <span className="text-xl md:text-3xl font-['Archivo_Black'] font-black tracking-tighter text-melon-green uppercase">Melon<span className="text-melon-orange">Magnets</span></span>
            </button>
            <button 
              onClick={() => setIsQuoteModalOpen(true)} 
              className="bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-green-600 transition-all shadow-md flex items-center gap-2 active:scale-95 outline-none"
            >
              <WhatsAppLogo size={16} /> Get Quote
            </button>
          </div>
        </nav>

        <header className="pt-16 pb-12 px-6 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={heroVariants} className="text-5xl md:text-9xl font-['Outfit'] font-black uppercase italic leading-[0.85] mb-6 tracking-tighter text-slate-800">
            Sticky <br/><span className="text-melon-orange">Souvenirs.</span>
          </motion.h1>
          <div className="flex justify-center items-center gap-3 text-slate-400 text-[9px] font-bold tracking-[0.2em] uppercase">
            <span>Bengaluru</span> <Globe size={10} /> <span>Pan-India Delivery</span>
          </div>
        </header>

        {/* --- CATEGORY 01 --- */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 mb-20">
          <SectionHeader id="01" title="Flexible Rubber Magnets" description="Thin, lightweight, bendable. Ideal for travel souvenirs and bulk gifting." tags={['Travel', 'Souvenirs', 'Bulk', 'Corporate']} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {RubberMagnets.map(m => (
              <article key={m.id} className="group border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
                <div className="p-4 md:p-8">
                  <h3 className="font-extrabold text-xs md:text-xl truncate mb-0.5 uppercase tracking-tighter leading-tight whitespace-normal">{m.name}</h3>
                  <p className="text-slate-400 text-[8px] md:text-[10px] font-bold tracking-widest mb-4 opacity-70 italic">{m.sizeIn} | {m.sizeCm}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-3xl font-black text-melon-green">{m.price}</span>
                    <button onClick={() => handleProductInquiry(m)} className="p-1 hover:scale-110 transition-transform active:scale-95 outline-none bg-transparent border-none">
                      <WhatsAppLogo size={32} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <div className="group border-2 border-dashed border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-50/50 flex flex-col hover:bg-slate-100 transition-all duration-500 relative">
              <div className="aspect-square flex flex-col items-center justify-center p-4 text-center border-b border-dashed border-slate-200">
                 <Ruler size={24} className="text-slate-400 mb-3" />
                 <h3 className="font-['Outfit'] font-black text-sm md:text-2xl uppercase tracking-tighter leading-tight">Custom Size <br/>Bulk Orders</h3>
                 <div className="mt-3 px-3 py-1 bg-slate-800 text-white text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-widest shadow-sm">Min: 150 Units</div>
              </div>
              <div className="p-4 md:p-8 flex flex-col flex-1 justify-center">
                <button onClick={() => setIsQuoteModalOpen(true)} className="w-full border-2 border-[#25D366] text-[#25D366] py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 outline-none">
                  <WhatsAppLogo size={16} /> Request Quote
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- CATEGORY 02 --- */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 mb-24">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch mb-10">
            <div className="md:w-1/3 bg-orange-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-orange-100 flex flex-col justify-center font-bold">
              <span className="text-melon-orange font-black text-[9px] tracking-[0.2em] uppercase mb-2 block">Category 02</span>
              <h2 className="text-2xl md:text-4xl font-['Outfit'] font-black uppercase mb-4 text-slate-800 tracking-tight leading-none">Square Metal Magnets</h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 italic font-medium">Thick, glossy, sturdy finish. Perfect for photo gifts.</p>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {['Photo gifts', 'Baby photos', 'Couples', 'Gifting'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-slate-700 uppercase tracking-tight"><CheckCircle2 size={12} className="text-melon-orange" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 gap-3 md:gap-6">
              {PremiumMagnets.map(m => (
                <article key={m.id} className="group border border-slate-100 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all">
                  <MediaCard videoSrc={m.media} imageSrc={m.fallback} name={m.name} />
                  <div className="p-4 md:p-8">
                    <h3 className="font-extrabold text-xs md:text-2xl mb-1 uppercase tracking-tighter whitespace-normal leading-tight">{m.name}</h3>
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-bold tracking-widest mb-4 opacity-70 italic">{m.sizeIn} | {m.sizeCm}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg md:text-3xl font-black text-melon-green">{m.price}</span>
                      <button onClick={() => handleProductInquiry(m)} className="p-1 hover:scale-110 transition-transform active:scale-95 outline-none bg-transparent border-none">
                        <WhatsAppLogo size={32} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- ABOUT US --- */}
        <section ref={aboutRef} className="max-w-5xl mx-auto px-4 mb-20 scroll-mt-24">
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-10 text-left font-bold">
              <div>
                <h2 className="text-xl md:text-2xl font-['Outfit'] font-black uppercase mb-4 flex items-center gap-2 text-melon-orange tracking-widest leading-none">
                  <Sparkles size={20} /> About Us ✨
                </h2>
                <div className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium space-y-4">
                  <p>Melon Magnets started in Bengaluru with a simple idea, to turn special moments into beautiful keepsakes. 💡</p>
                  <p>We create creative, high-quality fridge magnets and badges that are fun, affordable, and made with care. 🎨 From custom photo magnets to bulk event orders, we love bringing your ideas to life. 🚀</p>
                  <p className="italic text-melon-orange font-bold">Every magnet tells a story, let’s create yours. 🍉</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-6 md:border-l md:border-white/10 md:pl-12 pt-6 md:pt-0">
                <a href="mailto:hello@melonmagnets.com" className="flex items-center gap-4 text-[10px] font-bold text-white uppercase tracking-widest truncate hover:text-melon-orange transition-colors outline-none">
                  <div className="bg-white/10 p-2 rounded-lg"><Mail size={16} className="text-melon-orange" /></div>
                  hello@melonmagnets.com
                </a>
                <div className="flex items-start gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose text-left">
                  <div className="bg-white/10 p-2 rounded-lg shrink-0"><MapPin size={16} className="text-melon-orange" /></div>
                  Vizbook, Yashwantpur, Bengaluru, 560022 📍
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-12 text-center px-6">
          <div className="flex justify-center gap-6 mb-8 items-center">
            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-slate-50 hover:bg-melon-orange hover:text-white transition-all shadow-sm outline-none">
              <Instagram size={20} />
            </a>
            <button onClick={() => setIsQuoteModalOpen(true)} className="p-1 hover:scale-110 transition-transform active:scale-95 outline-none bg-transparent border-none">
              <WhatsAppLogo size={40} />
            </button>
          </div>
          <p className="text-[8px] font-black tracking-[0.3em] text-slate-300 uppercase italic">© 2026 Melon Magnets • Made with ❤️ in Bengaluru</p>
        </footer>
      </div>

      {/* --- BULK QUOTE MODAL --- */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuoteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-['Outfit'] font-black uppercase tracking-tight text-slate-800">Bulk Inquiry</h3>
                  <button onClick={() => setIsQuoteModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Estimated Quantity</label>
                    <input required type="number" placeholder="e.g. 150" value={quoteDetails.qty} onChange={(e) => setQuoteDetails({ ...quoteDetails, qty: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-melon-orange transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Location</label>
                    <input required type="text" placeholder="City, State" value={quoteDetails.location} onChange={(e) => setQuoteDetails({ ...quoteDetails, location: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-melon-orange transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Required By</label>
                    <div className="relative">
                      <input required type="date" value={quoteDetails.date} onChange={(e) => setQuoteDetails({ ...quoteDetails, date: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-melon-orange transition-all outline-none appearance-none" />
                      <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-lg active:scale-95 mt-4">
                    <WhatsAppLogo size={18} /> Send to WhatsApp
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