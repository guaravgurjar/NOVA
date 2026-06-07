import { featuredProducts } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';

export function Wishlist() {
  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[240px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-15">
            <img src="https://images.unsplash.com/photo-1629851410884-6017c6670868?auto=format&fit=crop&q=80&w=1600&h=600" alt="Sale Banner" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
           <span className="text-nova-gold text-[10px] tracking-[0.25em] font-semibold uppercase block mb-1">YOUR COLLECTION</span>
           <h1 className="text-2xl md:text-4xl font-serif tracking-wide font-light">My Saved Wishlist</h1>
        </div>
      </div>
      
      {/* Promo Strip */}
      <div className="bg-nova-gold text-nova-darker py-2.5 font-medium border-b border-nova-gold/15">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-wrap justify-between items-center text-[10px] md:text-xs tracking-[0.15em] uppercase gap-2 font-semibold">
          <span>✨ 7-day easy returns</span>
          <span>✨ Free Delivery over ₹2000</span>
          <span>✨ Extra 5% OFF Above ₹3,000</span>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl flex-1">
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-dark rounded-2xl border border-white/5 max-w-lg mx-auto">
             <Heart className="w-10 h-10 mx-auto text-nova-gold/40 mb-4" />
             <h3 className="font-serif text-lg mb-2">Your Wishlist is Empty</h3>
             <p className="text-white/50 text-xs font-light mb-6">Explore our catalog to save your favorite silver pieces.</p>
             <a href="/shop" className="btn-premium inline-block bg-nova-gold text-nova-darker px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">
               Browse Shop
             </a>
          </div>
        )}
      </div>
    </div>
  );
}
