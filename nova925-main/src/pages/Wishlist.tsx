import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../lib/usePageSEO';

export function Wishlist() {
  usePageSEO({ title: 'Wishlist', description: 'Your saved NOVA Jewellery pieces. Review and add your favourite sterling silver jewellery to cart.', noIndex: true });
  const { products } = useProducts();
  const { wishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen bg-white  text-nova-dark">

      {/* Banner */}


      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl flex-1">
        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 animate-fade-in">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <h3 className="font-serif text-lg md:text-4xl text-nova-dark mb-2">It feels so empty in here</h3>
            <p className="text-nova-dark/80 text-xl font-bold mb-6">Make a wish !</p>
            <img
              src="/images/icons/empty-list.webp"
              alt="Empty Wishlist"
              className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-5"
            />

            <Link to="/shop" className="btn-premium inline-block bg-nova-darker text-white px-13 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-nova-dark transition-colors">
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
