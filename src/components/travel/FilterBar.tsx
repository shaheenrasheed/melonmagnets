import type { Category } from '../../types/travel';

const INACTIVE: Record<string, string> = {
  All:       'bg-gray-100 text-gray-700',
  Adventure: 'bg-green-100 text-green-800',
  Nature:    'bg-emerald-100 text-emerald-800',
  Wildlife:  'bg-orange-100 text-orange-800',
  Culture:   'bg-purple-100 text-purple-800',
  Waterfall: 'bg-blue-100 text-blue-800',
  Viewpoint: 'bg-amber-100 text-amber-800',
};

interface FilterBarProps {
  active: Category | 'All';
  categories: Category[];
  onChange: (cat: Category | 'All') => void;
  filteredCount: number;
  totalCount: number;
}

export function FilterBar({ active, categories, onChange, filteredCount, totalCount }: FilterBarProps) {
  const tabs = (['All', ...categories] as (Category | 'All')[]);

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {tabs.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`shrink-0 rounded-full font-semibold transition-colors outline-none border-none cursor-pointer ${
              active === cat ? 'bg-stone-900 text-white' : INACTIVE[cat]
            }`}
            style={{ padding: '8px 16px', minHeight: '44px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Showing {filteredCount} of {totalCount} spots
      </p>
    </div>
  );
}
