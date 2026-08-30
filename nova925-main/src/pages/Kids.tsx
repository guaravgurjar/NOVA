import { useState, useMemo } from 'react';
import { shopCategories } from '../data';
import { useProducts } from '../contexts/ProductsContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, CircleDot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../lib/usePageSEO';

type CategoryFilter = 'all' | 'rings' | 'earrings' | 'bracelets' | 'chains' | 'bangles' | 'pendants';

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
        id: 'earrings',
        label: 'Kids Earrings',
        subLabel: 'Fun Ear Studs',
        image: '/images/products/earrings/1lgr1ZN3nw8rHPAC4NZ0nxHIzhaAOofUk.webp'
    },
    {
        id: 'bracelets',
        label: 'Kids Bracelets',
        subLabel: 'Playful Cuffs',
        image: 'https://images.unsplash.com/photo-1611591475140-4388584ae237?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
        id: 'chains',
        label: 'Kids Chains',
        subLabel: 'Dainty Necklaces',
        image: '/images/products/chains/15OWZ4q7jDXSoPmI2oQ1BJMLjb0ASwyTZ.webp'
    },
    {
        id: 'bangles',
        label: 'Kids Bangles',
        subLabel: 'Charm Bangles',
        image: 'https://images.unsplash.com/photo-1611591475140-4388584ae237?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
        id: 'pendants',
        label: 'Kids Pendants',
        subLabel: 'Cute Pendants',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400&h=300'
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
                return sub === 'bracelets' || cat.includes('bracelet');
            if (selectedCategory === 'chains')
                return sub === 'chains' || cat.includes('chain') || cat.includes('necklace');
            if (selectedCategory === 'bangles')
                return sub === 'bangles' || cat.includes('bangle') || cat.includes('kada');
            if (selectedCategory === 'pendants')
                return sub === 'pendants' || cat.includes('pendant');

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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {shopCategories.map((cat) => (
                        <Link
                            to={`/category/${cat.id}`}
                            key={cat.id}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className="w-full aspect-3/2 rounded-2xl overflow-hidden mb-4 shadow-xl border border-white/5 group-hover:border-nova-gold/45 transition-all duration-300 relative">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#07090f]/95 via-[#07090f]/20 to-transparent opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="text-[10px] md:text-sm font-semibold tracking-[0.25em] font-sans text-white group-hover:text-nova-gold transition-colors">{cat.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ─── Product Catalog Grid ─────────────────────────────────────────── */}
            <section className="container mx-auto px-6 md:px-12 py-12 max-w-7xl flex-1">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <CircleDot className="w-4 h-4 text-nova-dark animate-pulse" />
                        <h3 className="text-lg font-serif text-nova-dark tracking-wide">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
