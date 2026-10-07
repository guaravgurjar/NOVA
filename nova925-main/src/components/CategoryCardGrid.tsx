import { HeroCategoryCard } from '../data/heroCategories';

interface CategoryCardGridProps {
  categories: HeroCategoryCard[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function CategoryCardGrid({ categories, selectedId, onSelect }: CategoryCardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <button
            type="button"
            key={cat.id}
            onClick={() => onSelect(active ? 'all' : cat.id)}
            aria-pressed={active}
            className="flex flex-col items-center group cursor-pointer text-left"
          >
            <div
              className={`w-full aspect-3/2 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 shadow-xl border transition-all duration-300 relative ${
                active ? 'border-nova-gold/70 ring-1 ring-nova-gold/40' : 'border-white/5 group-hover:border-nova-gold/45'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#07090f]/95 via-[#07090f]/20 to-transparent opacity-90 transition-opacity"></div>
              <div className="absolute bottom-3 md:bottom-4 left-0 right-0 text-center">
                <span className="text-[9px] md:text-sm font-semibold tracking-[0.08em] sm:tracking-[0.2em] font-sans text-white group-hover:text-nova-gold transition-colors px-2">
                  {cat.name}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
