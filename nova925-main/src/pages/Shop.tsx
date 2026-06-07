import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, shopCategories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, RefreshCw } from 'lucide-react';

export function Shop() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "name">("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  
  // Filter products by category
  let filtered = id ? products.filter(p => p.category === id) : products;
  
  // Apply manual price range filters if specified
  if (priceRange.min) {
    filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
  }
  if (priceRange.max) {
    filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
  }
  
  // Apply sorting
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  const activeCategory = shopCategories.find(c => c.id === id);

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      
      {/* Page Header Banner */}
      <div className="relative w-full h-[220px] md:h-[280px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 flex flex-col justify-center">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">NOVA COLLECTION</span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wider mb-3">
            {activeCategory ? activeCategory.name : "Luxury Shop"}
          </h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light leading-relaxed">
            {activeCategory 
              ? `Browse our exclusive range of certified 925 sterling silver ${activeCategory.name.toLowerCase()} crafted to elevate your style.` 
              : "Discover hand-finished 925 sterling silver jewellery, from classic pendants to elegant bracelets."}
          </p>
        </div>
      </div>
      
      {/* Category Pills Navigation */}
      <div className="bg-nova-dark border-b border-white/5 py-4 overflow-x-auto hide-scrollbar">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex items-center justify-start md:justify-center space-x-3 whitespace-nowrap">
          <Link 
            to="/shop" 
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
              !id 
                ? 'bg-nova-gold text-nova-darker font-bold shadow-md shadow-nova-gold/20' 
                : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            All Products
          </Link>
          {shopCategories.map(cat => (
            <Link 
              key={cat.id}
              to={`/category/${cat.id}`} 
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 ${
                id === cat.id 
                  ? 'bg-nova-gold text-nova-darker font-bold shadow-md shadow-nova-gold/20' 
                  : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl flex-1">
        
        {/* Filters Toolbar */}
        <div className="glass-dark rounded-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-4 h-4 text-nova-gold" />
            <span className="font-medium tracking-wide uppercase text-xs text-white/70">Filters & Sorting</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#181c2b] border border-white/10 hover:border-nova-gold/40 rounded-lg text-xs tracking-wider transition-colors">
                <span>Sort By: {
                  sortBy === "default" ? "Featured" :
                  sortBy === "price-low" ? "Price: Low to High" :
                  sortBy === "price-high" ? "Price: High to Low" : "Alphabetical"
                }</span>
                <ChevronDown className="w-3.5 h-3.5 text-nova-gold" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-[200px] bg-nova-dark border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                <button onClick={() => setSortBy("default")} className="w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker text-xs transition-colors">Featured</button>
                <button onClick={() => setSortBy("price-low")} className="w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker text-xs transition-colors">Price: Low to High</button>
                <button onClick={() => setSortBy("price-high")} className="w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker text-xs transition-colors">Price: High to Low</button>
                <button onClick={() => setSortBy("name")} className="w-full text-left py-2.5 px-4 hover:bg-nova-gold hover:text-nova-darker text-xs transition-colors">Alphabetical</button>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min Price" 
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-20 bg-[#181c2b] border border-white/10 focus:border-nova-gold rounded-lg py-1.5 px-3 text-xs text-center text-white focus:outline-none"
              />
              <span className="text-white/40 text-xs">-</span>
              <input 
                type="number" 
                placeholder="Max Price" 
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-20 bg-[#181c2b] border border-white/10 focus:border-nova-gold rounded-lg py-1.5 px-3 text-xs text-center text-white focus:outline-none"
              />
              {(priceRange.min || priceRange.max) && (
                <button 
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="p-1.5 text-nova-gold hover:text-white transition-colors"
                  title="Clear price filter"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-dark rounded-2xl border border-white/5">
            <span className="text-4xl block mb-4">✨</span>
            <h3 className="font-serif text-xl mb-2">No Products Found</h3>
            <p className="text-white/50 text-sm font-light">Try adjusting your filters or price range selections.</p>
          </div>
        )}

      </div>
    </div>
  );
}
