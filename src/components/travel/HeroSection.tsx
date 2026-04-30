import type { DistrictData } from '../../types/travel';

export function HeroSection({ data }: { data: DistrictData }) {
  return (
    <div className={`bg-gradient-to-br ${data.heroColor} px-4 pt-10 pb-8`}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(134,239,172,0.8)', fontFamily: "'Inter', sans-serif" }}>
          {data.state} · Free Travel Guide
        </p>
        <h1 className="font-black text-white tracking-tight leading-tight mb-1" style={{ fontSize: '36px', fontFamily: "'Inter', sans-serif" }}>
          {data.district}
        </h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(187,247,208,0.75)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {data.tagline}
        </p>

        <div className="flex gap-0">
          <div className="pr-5">
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(134,239,172,0.65)', fontFamily: "'Inter', sans-serif" }}>Best Time</p>
            <p className="text-white font-semibold text-sm">{data.bestTime}</p>
          </div>
          <div className="border-l border-white/10 pl-5 pr-5">
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(134,239,172,0.65)', fontFamily: "'Inter', sans-serif" }}>Ideal Stay</p>
            <p className="text-white font-semibold text-sm">{data.idealDays}</p>
          </div>
          <div className="border-l border-white/10 pl-5">
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(134,239,172,0.65)', fontFamily: "'Inter', sans-serif" }}>Spots Listed</p>
            <p className="text-white font-semibold text-sm">{data.spots.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
