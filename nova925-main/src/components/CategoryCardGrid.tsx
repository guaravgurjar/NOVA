import { HeroCategoryCard } from '../data/heroCategories';

interface CategoryCardGridProps {
  categories: HeroCategoryCard[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function CategoryCardGrid({ categories, selectedId, onSelect }: CategoryCardGridProps) {
  const count = categories.length;
  const singleRow = count % 2 === 1;
  const columns = singleRow ? count : Math.max(1, count / 2);

  return (
    <div
      className={
        singleRow
          ? 'flex gap-2 overflow-x-auto snap-x hide-scrollbar pb-1 md:grid md:overflow-visible md:snap-none md:pb-0 md:gap-5'
          : 'grid gap-1.5 sm:gap-3 md:gap-5'
      }
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {categories.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <button
            type="button"
            key={cat.id}
            onClick={() => onSelect(active ? 'all' : cat.id)}
            aria-pressed={active}
            className={`flex flex-col items-center group cursor-pointer text-center min-w-0 ${
              singleRow ? 'w-[4.75rem] shrink-0 snap-start sm:w-[6.5rem] md:w-auto md:shrink' : ''
            }`}
          >
            <div
              className={`w-full aspect-square md:aspect-3/2 rounded-xl md:rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 relative ${
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
              <div className="absolute bottom-1.5 md:bottom-4 left-0 right-0 text-center px-0.5">
                <span className="block text-[8px] sm:text-[10px] md:text-sm font-semibold leading-tight tracking-normal md:tracking-[0.12em] font-sans text-white group-hover:text-nova-gold transition-colors">
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
