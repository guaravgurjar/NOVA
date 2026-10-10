import { useState, useMemo, useRef } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCardGrid } from '../components/CategoryCardGrid';
import { astroCategories } from '../data/heroCategories';
import { Sparkles, Stars } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

const ZODIAC_DATES: Record<string, string> = {
  aries: 'Mar 21 – Apr 19',
  taurus: 'Apr 20 – May 20',
  gemini: 'May 21 – Jun 20',
  cancer: 'Jun 21 – Jul 22',
  leo: 'Jul 23 – Aug 22',
  virgo: 'Aug 23 – Sep 22',
  libra: 'Sep 23 – Oct 22',
  scorpio: 'Oct 23 – Nov 21',
  sagittarius: 'Nov 22 – Dec 21',
  capricorn: 'Dec 22 – Jan 19',
  aquarius: 'Jan 20 – Feb 18',
  pisces: 'Feb 19 – Mar 20',
};

function getZodiacDate(product: { id?: string; name?: string }): string | null {
  if (!product) return null;
  const name = (product.name || '').toLowerCase();
  const id = (product.id || '').toLowerCase();
  for (const [sign, date] of Object.entries(ZODIAC_DATES)) {
    if (name.includes(sign) || id.includes(sign)) return date;
  }
  return null;
}

type AstroFilter = 'all' | 'pendants' | 'rings' | 'coins' | 'idols';

const ASTRO_TABS: { id: AstroFilter; label: string }[] = [
  { id: 'all', label: '✦ All Astro Collection' },
  { id: 'pendants', label: '🔮 Zodiac Pendants' },
  { id: 'rings', label: '💍 Astro Rings' },
  { id: 'coins', label: '🪙 Sacred Coins' },
  { id: 'idols', label: '🕉️ Deity Pendants' },
];

export function AstroCollection() {
  usePageSEO({
    title: 'Astro Collection',
    description:
      'Discover your zodiac sign pendant, deity pendants, silver coins & astro rings — 925 sterling silver astro jewellery handcrafted at NOVA.',
  });

  const { products, isLoading } = useProducts();
  const [astroFilter, setAstroFilter] = useState<AstroFilter>('all');
  const catalogRef = useRef<HTMLElement>(null);

  const selectCategory = (id: string) => {
    setAstroFilter(id as AstroFilter);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const astroProducts = useMemo(() => {
    if (!products) return [];
    return (products as any[]).filter((p) => {
      // Filter out empty cards or cards without images
      if (!p || !p.name || typeof p.name !== 'string' || !p.name.trim()) return false;
      if (!p.image || typeof p.image !== 'string' || !p.image.trim()) return false;
      if (p.image.startsWith('/images/products/')) return false;

      const cat = (p.category || '').toLowerCase();
      const sub = (p.subcategory || '').toLowerCase();
      const name = (p.name || '').toLowerCase();

      // Accept both new slug and legacy 'astro' value
      const isAstro = cat === 'astro-collection' || cat === 'astro';
      if (!isAstro) return false;

      if (astroFilter === 'all') return true;
      if (astroFilter === 'pendants')
        return name.includes('zodiac') || ((sub === 'pendants' || cat.includes('pendant')) && !name.includes('coin') && !name.includes('deity') && !name.includes('lord') && !name.includes('goddess') && !name.includes('shiva') && !name.includes('ganesha') && !name.includes('hanuman') && !name.includes('om'));
      if (astroFilter === 'rings')
        return sub === 'rings' || cat.includes('ring') || name.includes('ring');
      if (astroFilter === 'coins')
        return name.includes('coin');
      if (astroFilter === 'idols')
        return name.includes('deity') || name.includes('lord') || name.includes('goddess') || name.includes('shiva') || name.includes('ganesha') || name.includes('hanuman') || name.includes('om') || name.includes('shri') || name.includes('radha');
      return true;
    });
  }, [products, astroFilter]);

  return (
    <div className="flex flex-col min-h-screen  text-nova-dark font-sans">
      {/* ─── Hero Banner ────────────────────────────────────────────── */}
      <div className="relative w-full h-65 md:h-95 overflow-hidden border-b border-nova-gold/20 shadow-2xl flex items-center">
        <picture className="w-full h-full block">
          <source media="(max-width: 767px)" srcSet="/images/banners/Mob Banners/Astro Mob.webp" />
          <img
            src="/images/banners/Web Banners/Astro Web.webp"
            alt="Astro Collection — Zodiac Sterling Silver Pendants"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-nova-darker text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-2">Written in the Stars.</span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light text-nova-darker">Discover authentic wellness aesthetics and celestial energy collections.</h2>
          <div className="w-20 md:w-30 h-px bg-nova-darker mx-auto mt-3 md:mt-4"></div>
        </div>
        <CategoryCardGrid
          categories={astroCategories}
          selectedId={astroFilter}
          onSelect={selectCategory}
        />
      </div>

      {/* ─── Product Grid Section ───────────────────────────────────── */}
      <section ref={catalogRef} className="container mx-auto px-4 md:px-12 py-14 md:py-20 max-w-7xl flex-1 scroll-mt-24">
        {/* Section Heading */}
        {/* ─── Subcategory Filter Tabs ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 mb-10 border-b border-neutral-200">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Stars className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
            {ASTRO_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setAstroFilter(tab.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${astroFilter === tab.id
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-amber-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="self-start text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold shrink-0">
            {astroProducts.length} items
          </span>
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
                {getZodiacDate(product) && (
                  <div className="mt-1.5 text-center">
                    <span className="inline-block text-[10px] md:text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full font-medium tracking-wide">
                      ✦ {getZodiacDate(product)}
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
