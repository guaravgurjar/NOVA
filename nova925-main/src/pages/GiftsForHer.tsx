import { useState, useMemo, useRef } from 'react';
import { giftsForHerCategories } from '../data/heroCategories';
import { useProducts } from '../contexts/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryCardGrid } from '../components/CategoryCardGrid';
import { Sparkles, CircleDot } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

type CategoryFilter = 'all' | 'rings' | 'earrings' | 'bracelets' | 'chains' | 'bangles' | 'pendants' | 'sets' | 'anklets';

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
        subLabel: 'Explore All Gifts',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
        id: 'rings',
        label: 'Female Rings',
        subLabel: 'Signets & Band Rings',
        image: '/images/Products/01 Female/07 Female Rings/TYP 01/01/0101.webp'
    },
    {
        id: 'earrings',
        label: 'Female Earrings',
        subLabel: 'Jhumkas & Studs',
        image: '/images/Products/01 Female/01 Female Ear-Rings/TYP 01/01/0101.webp'
    },
    {
        id: 'bracelets',
        label: 'Female Bracelets',
        subLabel: 'Kadas & Charms',
        image: '/images/Products/01 Female/02 Female Bracelet/01 925 Silevr/TYP 01/01/0101.webp'
    },
    {
        id: 'chains',
        label: 'Chains',
        subLabel: 'Link & Snake Chains',
        image: '/images/Products/01 Female/04 Female Chain/01 (925 silver) Female  chain/01/0101.webp'
    },
    {
        id: 'bangles',
        label: 'Bangles',
        subLabel: 'Designer Bangles',
        image: '/images/Products/01 Female/03 Female Bangel/TYP 01/01/0101.webp'
    },
    {
        id: 'pendants',
        label: 'Pendants',
        subLabel: 'Necklace Pendants',
        image: '/images/Products/01 Female/06 Female Pendant Set/TYP 01/01/0101.webp'
    },
    {
        id: 'sets',
        label: 'Jewellery Sets',
        subLabel: 'Necklace & Earring Sets',
        image: '/images/Products/01 Female/05 Female sets/TYP 01/01/0101.webp'
    },
    {
        id: 'anklets',
        label: 'Payals & Anklets',
        subLabel: 'Traditional Silver Payals',
        image: '/images/Products/01 Female/08 Female Anklet/TYP 01 (Indian Silver)/01/0101.webp'
    },
];

export function GiftsForHer() {
    usePageSEO({ title: 'Gifts For Her', description: 'Discover the perfect gift for her — 925 sterling silver rings, bracelets, chains & ear studs from NOVA.', canonicalPath: '/gifts-for-her' });
    const { products, isLoading } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const catalogRef = useRef<HTMLElement>(null);

    const selectCategory = (id: string) => {
        setSelectedCategory(id as CategoryFilter);
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Filter products by selected category.
    // Exclude any empty product cards or products without valid images.
    const filteredProducts = useMemo(() => {
        if (!products) return [];

        return products.filter((product: any) => {
            // Strictly remove empty product cards or products without images
            if (!product || !product.name || typeof product.name !== 'string' || !product.name.trim()) return false;
            if (!product.image || typeof product.image !== 'string' || !product.image.trim()) return false;
            if (product.image.startsWith('/images/products/')) return false;

            const cat = (product.category || '').toLowerCase();
            const sub = (product.subcategory || '').toLowerCase();
            const name = (product.name || '').toLowerCase();

            // Only show products that belong to the Gifts For Her page
            const isForHer = cat === 'gifts-for-her' ||
                cat === 'rings' || cat === 'earrings' || cat === 'bracelets' ||
                cat === 'chains' || cat === 'bangles' || cat === 'pendants' ||
                cat === 'sets';

            if (!isForHer) return false;

            if (selectedCategory === 'all') return true;

            // Match by subcategory field (new system) or category keyword (legacy)
            if (selectedCategory === 'rings')
                return sub === 'rings' || cat === 'rings' || cat.includes('ring') || name.includes('ring');
            if (selectedCategory === 'earrings')
                return sub === 'earrings' || cat === 'earrings' || cat.includes('earring') || cat.includes('stud') || sub === 'nose-rings' || name.includes('nose');
            if (selectedCategory === 'bracelets')
                return sub === 'bracelets' || cat === 'bracelets' || cat.includes('bracelet');
            if (selectedCategory === 'chains')
                return sub === 'chains' || cat === 'chains' || cat.includes('chain') || cat.includes('necklace');
            if (selectedCategory === 'bangles')
                return sub === 'bangles' || cat === 'bangles' || cat.includes('bangle') || cat.includes('kada');
            if (selectedCategory === 'pendants')
                return sub === 'pendants' || cat === 'pendants' || cat.includes('pendant');
            if (selectedCategory === 'sets')
                return sub === 'sets' || cat === 'sets' || cat.includes('set') || name.includes('set');
            if (selectedCategory === 'anklets')
                return sub === 'anklets' || cat.includes('anklet') || name.includes('payal') || name.includes('anklet');

            return true;
        });
    }, [products, selectedCategory]);

    return (
        <div className="flex flex-col min-h-screen bg-white text-nova-darkfont-sans">

            {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
            <div className="relative w-full h-65 md:h-95 overflow-hidden border-b border-nova-gold/20 shadow-2xl flex items-center">
                <img
                    src="/images/banners/her.webp"
                    alt="Gifts for Her Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />

            </div>

            {/* Grid Categories Section */}
            <div className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
                <div className="text-center mb-12">
                    <span className="text-nova-darker text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR YOU</span>
                    <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light text-nova-darker">Shop By Category</h2>
                    <div className="w-30 h-px bg-nova-darker mx-auto mt-4"></div>
                </div>

                <CategoryCardGrid
                    categories={giftsForHerCategories}
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
                                ? 'All Gifts For Her'
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
                            Try selecting another category or check out our entire luxury catalog.
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
