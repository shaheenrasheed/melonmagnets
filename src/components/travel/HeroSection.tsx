import { useState, useEffect } from 'react';
import type { DistrictData } from '../../types/travel';

interface WeatherData {
  temp: number;
  condition: string;
  emoji: string;
  humidity: number;
}

function getCondition(code: number): { emoji: string; label: string } {
  if (code === 0)                          return { emoji: '☀️',  label: 'Clear' };
  if (code >= 1  && code <= 3)            return { emoji: '🌤',  label: 'Partly Cloudy' };
  if (code === 45 || code === 48)          return { emoji: '🌫',  label: 'Foggy' };
  if (code >= 51 && code <= 55)           return { emoji: '🌦',  label: 'Drizzle' };
  if (code >= 61 && code <= 65)           return { emoji: '🌧',  label: 'Rainy' };
  if (code >= 80 && code <= 82)           return { emoji: '🌧',  label: 'Showers' };
  if (code === 95)                         return { emoji: '⛈',  label: 'Thunderstorm' };
  return                                          { emoji: '🌤',  label: 'Cloudy' };
}

export function HeroSection({ data }: { data: DistrictData }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=11.6854&longitude=76.1320' +
      '&current=temperature_2m,weathercode,relative_humidity_2m' +
      '&timezone=Asia%2FKolkata'
    )
      .then(r => r.json())
      .then((d: { current: { temperature_2m: number; weathercode: number; relative_humidity_2m: number } }) => {
        const code = d.current.weathercode;
        const { emoji, label } = getCondition(code);
        setWeather({
          temp:      Math.round(d.current.temperature_2m),
          humidity:  d.current.relative_humidity_2m,
          condition: label,
          emoji,
        });
      })
      .catch(() => {}); // fail silently — pill just won't show
  }, []);

  return (
    <div className={`bg-gradient-to-br ${data.heroColor} px-4 pt-10 pb-8 relative`}>

      {/* Live weather — top right, transparent, no container */}
      {weather && (
        <div className="absolute top-4 right-4 text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '9px', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Now in {data.district}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '13px', fontWeight: 500, lineHeight: 1.3 }}>
            {weather.emoji} {weather.temp}°C · {weather.condition}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '1px' }}>
            {weather.humidity}% humidity
          </p>
        </div>
      )}

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

        {/* Stats pills */}
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
