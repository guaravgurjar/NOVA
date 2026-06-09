import { products } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Wishlist() {
  const { wishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

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


      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl flex-1">
        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-dark rounded-2xl border border-white/5 max-w-lg mx-auto">
             <Heart className="w-10 h-10 mx-auto text-nova-gold/40 mb-4 animate-pulse" />
             <h3 className="font-serif text-lg mb-2">Your Wishlist is Empty</h3>
             <p className="text-white/50 text-xs font-light mb-6">Explore our catalog to save your favorite silver pieces.</p>
             <Link to="/shop" className="btn-premium inline-block bg-nova-gold text-nova-darker px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">
               Browse Shop
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
