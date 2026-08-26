import { Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const originalPrice = product.originalPrice || Math.round(product.price * 1.83);
  const reviewCount = (product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 350) + 250;

  return (
    <article className="group relative bg-white border border-neutral-100 rounded-2xl overflow-hidden flex flex-col w-full mx-auto font-sans">
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-[#fafafa] p-0 flex items-center justify-center cursor-pointer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain pointer-events-none"
            loading="lazy"
          />

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white shadow-xs border border-neutral-100 flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-10 cursor-pointer"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-pink-400 hover:text-pink-500'
                }`}
            />
          </button>

          {/* Rating Badge (Bottom Left) */}
          <div className="absolute bottom-2 left-2 md:bottom-2.5 md:left-2.5 bg-neutral-100/90 backdrop-blur-xs px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-xs font-medium text-neutral-700 flex items-center gap-0.5 md:gap-1 shadow-2xs z-10 border border-neutral-200/50">
            <span>4.8</span>
            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-400 text-amber-400" />
            <span className="text-neutral-300 font-light">|</span>
            <span className="text-neutral-600 font-medium">{reviewCount}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-2.5 md:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Pricing */}
            <div className="flex items-baseline gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
              <span className="text-base md:text-xl font-bold text-neutral-900 tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] md:text-sm text-neutral-400 line-through font-normal">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-neutral-600 text-[11px] md:text-sm font-normal line-clamp-1 leading-snug mb-0.5 md:mb-1">
              {product.name}
            </h3>

            {/* Offer Tag */}
            <p className="text-blue-700 font-bold text-[9px] md:text-xs uppercase tracking-wider">
              PRICE DROP!
            </p>
          </div>
        </div>
      </Link>

      {/* Add To Cart Button */}
      <div className="px-2.5 pb-2.5 md:px-4 md:pb-4 pt-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id, 1, product.stock);
          }}
          className="w-full bg-linear-to-r from-blue-900 to-blue-300 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 md:py-3 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 text-[11px] md:text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
