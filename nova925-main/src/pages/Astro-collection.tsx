import { useMemo } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Stars } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

const ZODIAC_DATES: Record<string, string> = {
  astro_aries: 'Mar 21 – Apr 19',
  astro_taurus: 'Apr 20 – May 20',
  astro_gemini: 'May 21 – Jun 20',
  astro_cancer: 'Jun 21 – Jul 22',
  astro_leo: 'Jul 23 – Aug 22',
  astro_virgo: 'Aug 23 – Sep 22',
  astro_libra: 'Sep 23 – Oct 22',
  astro_scorpio: 'Oct 23 – Nov 21',
  astro_sagittarius: 'Nov 22 – Dec 21',
  astro_capricorn: 'Dec 22 – Jan 19',
  astro_aquarius: 'Jan 20 – Feb 18',
  astro_pisces: 'Feb 19 – Mar 20',
};

export function AstroCollection() {
  usePageSEO({
    title: 'Astro Collection',
    description:
      'Discover your zodiac sign pendant — 925 sterling silver astro jewellery handcrafted for every star sign at NOVA.',
  });

  const { products, isLoading } = useProducts();

  const astroProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (p) => (p.category || '').toLowerCase() === 'astro'
    );
  }, [products]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-nova-dark font-sans">
      {/* ─── Hero Banner ────────────────────────────────────────────── */}
      <div className="relative w-full h-[260px] md:h-[420px] overflow-hidden border-b border-nova-gold/20 shadow-2xl">
        <img
          src="/images/banners/astro.jpg"
          alt="Astro Collection — Zodiac Sterling Silver Pendants"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-12 text-center px-4">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/80 mb-2">
            ✦ Written in the Stars ✦
          </span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wide text-white drop-shadow-lg">
            Astro Collection
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70 max-w-lg font-light">
            925 Sterling Silver zodiac pendants — wear the symbol that defines you.
          </p>
        </div>
      </div>

      {/* ─── Product Grid Section ───────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-12 py-14 md:py-20 max-w-7xl flex-1">
        {/* Section Heading */}
        <div className="flex items-center justify-between pb-6 mb-10 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <Stars className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-lg md:text-xl font-serif tracking-wide text-neutral-800">
              All Zodiac Pendants
            </h2>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
              {astroProducts.length} signs
            </span>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : astroProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 p-8 max-w-md mx-auto">
            <Sparkles className="w-12 h-12 text-amber-400/40 mx-auto mb-4" />
            <h4 className="text-lg font-serif text-neutral-800 mb-2">
              No zodiac pendants found
            </h4>
            <p className="text-xs text-neutral-500 font-light">
              Our astro collection is being restocked. Check back soon!
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {astroProducts.map((product) => (
              <div key={product.id} className="w-full flex flex-col">
                <ProductCard product={product} />
                {/* Zodiac date range badge */}
                {ZODIAC_DATES[product.id] && (
                  <div className="mt-1.5 text-center">
                    <span className="inline-block text-[10px] md:text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full font-medium tracking-wide">
                      ✦ {ZODIAC_DATES[product.id]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
