import { useState, useMemo, useRef } from 'react';
import { kidsCategories } from '../data/heroCategories';
import { useProducts } from '../contexts/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCardGrid } from '../components/CategoryCardGrid';
import { Sparkles, CircleDot } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

type CategoryFilter = 'all' | 'rings' | 'earrings' | 'bracelets' | 'chains' | 'bangles' | 'pendants' | 'anklets' | 'nazar';

interface CategoryPill {
    id: CategoryFilter;
    label: string;
    subLabel: string;
    image: string;
}

const CATEGORIES: CategoryPill[] = [
    {
        id: 'all',
        label: 'All Collection',
        subLabel: 'Explore All Kids Gifts',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
        id: 'pendants',
        label: 'Kids Pendants',
        subLabel: 'Cute Pendants',
        image: '/images/Products/03 Kids/01 Kids Pendant/TYP 01/01/0101.webp'
    },
    {
        id: 'rings',
        label: 'Kids Rings',
        subLabel: 'Adjustable Bands',
        image: '/images/Products/03 Kids/02 Kids Rings/TYP 01 (Indian Silver)/01/0101.webp'
    },
    {
        id: 'bracelets',
        label: 'Kids Bracelets',
        subLabel: 'Playful Cuffs & Nazariya',
        image: '/images/Products/03 Kids/05 Kids bracelet chain wale/TYP 01 (925 silver)/01.webp'
    },
    {
        id: 'bangles',
        label: 'Kids Bangles',
        subLabel: 'Kadas & Bangles',
        image: '/images/Products/03 Kids/04 Kids Bangles/01 925 Kids breslet/01/0101.webp'
    },
    {
        id: 'chains',
        label: 'Kids Chains',
        subLabel: 'Dainty Necklaces',
        image: '/images/Products/03 Kids/07 Kids Chain/01/0101.webp'
    },
    {
        id: 'anklets',
        label: 'Nazariya & Payal',
        subLabel: 'Protective Silver Charms',
        image: '/images/Products/03 Kids/03 Kids Anklet/TYP 01 (Indian Silver)/01/0101.webp'
    },
];

export function Kids() {
    usePageSEO({
        title: 'Kids',
        description: 'Discover delightful 925 sterling silver jewellery for kids — rings, bracelets, chains & ear studs from NOVA.',
        canonicalPath: '/kids'
    });
    const { products, isLoading } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const catalogRef = useRef<HTMLElement>(null);

    const selectCategory = (id: string) => {
        setSelectedCategory(id as CategoryFilter);
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Filter products belonging to the Kids page.
    // Products added via admin should have category='kids' and a subcategory
    // like 'rings', 'earrings', 'bracelets', etc.
    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter((product: any) => {
            const cat = (product.category || '').toLowerCase();
            const sub = (product.subcategory || '').toLowerCase();
            const name = (product.name || '').toLowerCase();

            // Only show products that belong to the Kids page
            const isForKids = cat === 'kids' ||
                cat === 'kids-rings' || cat === 'kids-earrings' ||
                cat === 'kids-bracelets' || cat === 'kids-chains' ||
                cat === 'kids-bangles' || cat === 'kids-pendants';

            if (!isForKids) return false;

            if (selectedCategory === 'all') return true;

            // Match by subcategory field (new system) or category keyword (legacy)
            if (selectedCategory === 'rings')
                return sub === 'rings' || cat.includes('ring') || name.includes('ring');
            if (selectedCategory === 'earrings')
                return sub === 'earrings' || cat.includes('earring') || cat.includes('stud');
            if (selectedCategory === 'bracelets')
                return (sub === 'bracelets' || cat.includes('bracelet')) && !String(product.id || '').includes('nazar');
            if (selectedCategory === 'nazar')
                return String(product.id || '').includes('nazar') || (name.includes('nazariya') && sub !== 'anklets');
            if (selectedCategory === 'chains')
                return sub === 'chains' || cat.includes('chain') || cat.includes('necklace');
            if (selectedCategory === 'bangles')
                return sub === 'bangles' || cat.includes('bangle') || cat.includes('kada');
            if (selectedCategory === 'pendants')
                return sub === 'pendants' || cat.includes('pendant');
            if (selectedCategory === 'anklets')
                return sub === 'anklets' || cat.includes('anklet') || name.includes('payal') || name.includes('nazariya');

            return true;
        });
    }, [products, selectedCategory]);

    return (
        <div className="flex flex-col min-h-screen bg-white text-nova-dark font-sans">

            {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
            <div className="relative w-full h-65 md:h-95 overflow-hidden border-b border-nova-gold/20 shadow-2xl flex items-center">
                <img
                    src="/images/banners/kids.webp"
                    alt="Kids Collection Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Grid Categories Section */}
            <div className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
                <div className="text-center mb-12">
                    <span className="text-nova-darker text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR LITTLE ONES</span>
                    <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light text-nova-darker">Shop By Category</h2>
                    <div className="w-30 h-px bg-nova-darker mx-auto mt-4"></div>
                </div>

                <CategoryCardGrid
                    categories={kidsCategories}
                    selectedId={selectedCategory}
                    onSelect={selectCategory}
                />
            </div>

            {/* ─── Product Catalog Grid ─────────────────────────────────────────── */}
            <section ref={catalogRef} className="container mx-auto px-6 md:px-12 py-12 max-w-7xl flex-1 scroll-mt-24">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 mb-8 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                        <CircleDot className="w-4 h-4 text-nova-dark animate-pulse shrink-0" />
                        <h3 className="text-base sm:text-lg font-serif text-nova-dark tracking-wide">
                            {selectedCategory === 'all'
                                ? 'All Kids Collection'
                                : CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Collection'}
                        </h3>
                        <span className="text-xs text-nova-dark bg-nova-gold/10 px-2.5 py-0.5 rounded-full border border-nova-gold/20 font-semibold">
                            {filteredProducts.length} items
                        </span>
                    </div>

                    {selectedCategory !== 'all' && (
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="text-xs text-nova-darker hover:text-nova-dark hover:underline font-medium transition-colors cursor-pointer"
                        >
                            Clear filter
                        </button>
                    )}
                </div>

                {/* Loading Spinner */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="w-10 h-10 border-2 border-nova-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 bg-nova-dark/40 rounded-2xl border border-white/5 p-8 max-w-md mx-auto">
                        <Sparkles className="w-12 h-12 text-nova-gold/40 mx-auto mb-4" />
                        <h4 className="text-lg font-serif text-white mb-2">No products found in this category</h4>
                        <p className="text-xs text-white/50 font-light mb-6">
                            Try selecting another category or check out our entire kids catalog.
                        </p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="btn-premium bg-nova-gold text-nova-darker px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-nova-gold-light transition-all cursor-pointer"
                        >
                            View All Items
                        </button>
                    </div>
                ) : (
                    /* Products Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 justify-items-center">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
