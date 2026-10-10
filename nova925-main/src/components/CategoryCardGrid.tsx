import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CategoryCardItem {
  id: string;
  name: string;
  image: string;
}

interface CategoryCardGridProps {
  categories: CategoryCardItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  getHref?: (category: CategoryCardItem) => string;
}

export function CategoryCardGrid({ categories, selectedId, onSelect, getHref }: CategoryCardGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [arrowTop, setArrowTop] = useState<number | null>(null);

  const updateSlider = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(maxScroll > 2 && el.scrollLeft < maxScroll - 2);

    const image = el.querySelector<HTMLElement>('[data-category-image]');
    if (image) setArrowTop(image.offsetTop + image.offsetHeight / 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateSlider();
    el.addEventListener('scroll', updateSlider, { passive: true });
    const observer = new ResizeObserver(updateSlider);
    observer.observe(el);
    window.addEventListener('resize', updateSlider);

    return () => {
      el.removeEventListener('scroll', updateSlider);
      observer.disconnect();
      window.removeEventListener('resize', updateSlider);
    };
  }, [categories.length, updateSlider]);

  const scrollRow = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const distance = Math.max(el.clientWidth * 0.72, 220);
    el.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {canPrev && (
        <button
          type="button"
          onClick={() => scrollRow(-1)}
          aria-label="Previous categories"
          style={arrowTop != null ? { top: arrowTop } : undefined}
          className="absolute left-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-neutral-500 shadow-md transition hover:text-nova-darker cursor-pointer md:left-0 md:h-10 md:w-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth md:gap-5"
      >
        {categories.map((cat) => {
          const active = selectedId === cat.id;
          const card = (
            <>
              <div
                data-category-image
                className={`aspect-square w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ${
                  active
                    ? 'ring-2 ring-nova-gold ring-offset-2 ring-offset-white'
                    : 'group-hover:shadow-md'
                }`}
              >
                <img
                  src={cat.image}
                  alt=""
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <span className="mt-2.5 block text-center text-[13px] font-medium leading-snug text-nova-darker transition-colors group-hover:text-nova-gold md:text-[15px]">
                {cat.name}
              </span>
            </>
          );

          const className =
            'group flex w-[6.75rem] shrink-0 snap-start flex-col text-center sm:w-32 md:w-36 lg:w-[9.25rem] cursor-pointer';

          if (getHref) {
            return (
              <Link key={cat.id} to={getHref(cat)} className={className}>
                {card}
              </Link>
            );
          }

          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => onSelect?.(active ? 'all' : cat.id)}
              aria-pressed={active}
              className={className}
            >
              {card}
            </button>
          );
        })}
      </div>

      {canNext && (
        <button
          type="button"
          onClick={() => scrollRow(1)}
          aria-label="Next categories"
          style={arrowTop != null ? { top: arrowTop } : undefined}
          className="absolute right-1 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-neutral-500 shadow-md transition hover:text-nova-darker cursor-pointer md:right-0 md:h-10 md:w-10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
