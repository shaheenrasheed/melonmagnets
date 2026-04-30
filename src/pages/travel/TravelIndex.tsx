import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const DISTRICTS = [
  {
    name: 'Wayanad',
    state: 'Kerala',
    slug: 'wayanad',
    tagline: "God's Own Forest",
    gradient: 'from-green-950 to-stone-950',
    accent: 'rgba(134,239,172,0.7)',
    available: true,
  },
  {
    name: 'Munnar',
    state: 'Kerala',
    slug: 'munnar',
    tagline: 'Tea Garden Paradise',
    gradient: 'from-emerald-950 to-stone-950',
    accent: 'rgba(110,231,183,0.7)',
    available: false,
  },
  {
    name: 'Alleppey',
    state: 'Kerala',
    slug: 'alleppey',
    tagline: 'Venice of the East',
    gradient: 'from-blue-950 to-stone-950',
    accent: 'rgba(147,197,253,0.7)',
    available: false,
  },
  {
    name: 'Coorg',
    state: 'Karnataka',
    slug: 'coorg',
    tagline: 'Scotland of India',
    gradient: 'from-green-900 to-stone-950',
    accent: 'rgba(134,239,172,0.7)',
    available: false,
  },
  {
    name: 'Ooty',
    state: 'Tamil Nadu',
    slug: 'ooty',
    tagline: 'Queen of Hill Stations',
    gradient: 'from-violet-950 to-stone-950',
    accent: 'rgba(196,181,253,0.7)',
    available: false,
  },
  {
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    slug: 'kodaikanal',
    tagline: 'Princess of Hill Stations',
    gradient: 'from-indigo-950 to-stone-950',
    accent: 'rgba(165,180,252,0.7)',
    available: false,
  },
];

export default function TravelIndex() {
  return (
    <>
      <Helmet>
        <title>India Travel Guide — Tourist Spots, Timings & Entry Fees | MelonMagnets</title>
        <meta
          name="description"
          content={`Free itineraries with ticket prices, Google Maps links and local tips. Updated ${new Date().getFullYear()}.`}
        />
        <link rel="canonical" href="https://www.melonmagnets.com/travel" />
      </Helmet>

      <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors outline-none"
              style={{ fontSize: '14px' }}
            >
              <ArrowLeft size={15} />
              MelonMagnets
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-stone-950 px-4 pt-10 pb-8">
          <div className="max-w-2xl mx-auto">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: '#F5C518', fontFamily: "'Inter', sans-serif" }}
            >
              Free Travel Guide
            </p>
            <h1
              className="text-3xl font-black text-white tracking-tight leading-tight mb-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              India Travel Guide
            </h1>
            <p className="text-slate-400 text-sm">
              Tourist spots, timings &amp; entry fees — free itineraries updated {new Date().getFullYear()}.
            </p>
          </div>
        </div>

        {/* District list */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
          {DISTRICTS.map(d =>
            d.available ? (
              <Link
                key={d.slug}
                to={`/travel/${d.slug}`}
                className="block group rounded-2xl overflow-hidden border border-slate-200 hover:border-yellow-300 hover:shadow-lg transition-all outline-none"
              >
                <div className={`bg-gradient-to-br ${d.gradient} px-5 py-5 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: d.accent, fontFamily: "'Inter', sans-serif" }}>
                      {d.state}
                    </p>
                    <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {d.name}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: d.accent }}>{d.tagline}</p>
                  </div>
                  <ArrowRight size={18} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                </div>
              </Link>
            ) : (
              <div
                key={d.slug}
                className="rounded-2xl overflow-hidden border border-slate-100"
                style={{ opacity: 0.55 }}
              >
                <div className={`bg-gradient-to-br ${d.gradient} px-5 py-5 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: d.accent, fontFamily: "'Inter', sans-serif" }}>
                      {d.state}
                    </p>
                    <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {d.name}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: d.accent }}>{d.tagline}</p>
                  </div>
                  <span
                    className="text-white/70 rounded-full font-medium shrink-0"
                    style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(255,255,255,0.1)' }}
                  >
                    Coming Soon
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
