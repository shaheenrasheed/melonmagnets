import type { Category } from '../../types/travel';

const INACTIVE: Record<string, string> = {
  All: 'bg-slate-100 text-slate-700',
  Adventure: 'bg-green-100 text-green-800',
  Nature: 'bg-emerald-100 text-emerald-800',
  Wildlife: 'bg-orange-100 text-orange-800',
  Culture: 'bg-purple-100 text-purple-800',
  Waterfall: 'bg-blue-100 text-blue-800',
  Viewpoint: 'bg-amber-100 text-amber-800',
};

const ACTIVE: Record<string, string> = {
  All: 'bg-slate-900 text-white',
  Adventure: 'bg-green-700 text-white',
  Nature: 'bg-emerald-700 text-white',
  Wildlife: 'bg-orange-600 text-white',
  Culture: 'bg-purple-700 text-white',
  Waterfall: 'bg-blue-700 text-white',
  Viewpoint: 'bg-amber-600 text-white',
};

interface FilterBarProps {
  active: Category | 'All';
  categories: Category[];
  onChange: (cat: Category | 'All') => void;
}

export function FilterBar({ active, categories, onChange }: FilterBarProps) {
  const tabs = (['All', ...categories] as (Category | 'All')[]);

  return (
    <div
      className="flex gap-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' as any, paddingBottom: '4px' }}
    >
      {tabs.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full font-semibold transition-colors outline-none border-none cursor-pointer ${
            active === cat ? ACTIVE[cat] : INACTIVE[cat]
          }`}
          style={{ padding: '8px 16px', minHeight: '44px', fontSize: '13px', whiteSpace: 'nowrap' }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
