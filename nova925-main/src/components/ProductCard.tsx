import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div 
      className="group relative bg-[#0b0e17] border border-nova-gold/10 rounded-xl overflow-hidden hover:border-nova-gold/30 transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(197,168,128,0.15)] flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTimeout(() => setMousePos({ x: 50, y: 50 }), 400); 
      }}
    >
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
        {/* Image container */}
        <div 
          ref={containerRef}
          className="relative aspect-square overflow-hidden bg-[#07090f] p-2 md:p-4 flex items-center justify-center cursor-zoom-in"
          onMouseMove={handleMouseMove}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg pointer-events-none transition-transform duration-700 ease-out"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? 'scale(1.15)' : 'scale(1)'
            }}
          />
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 md:top-4 md:right-4 w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
              isWishlisted 
                 ? 'bg-red-500/20 border-red-500/30 text-red-500' 
                 : 'bg-[#0f121d]/60 border-white/10 text-white/70 hover:text-white hover:border-white/30'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 active:scale-75 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          {/* Category Badge */}
          {product.category && (
            <span className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-[7px] md:text-[9px] uppercase tracking-[0.25em] bg-[#0f121d]/85 text-nova-gold border border-nova-gold/20 px-1.5 py-0.5 rounded backdrop-blur-sm font-semibold z-10">
              {product.category}
            </span>
          )}
        </div>
        
        {/* Details */}
        <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-sm md:text-lg text-nova-gold font-medium mb-1 md:mb-1.5 tracking-wide">
              Rs. {product.price.toLocaleString('en-IN')}/-
            </h3>
            <p className="text-white/80 font-sans text-[10px] md:text-sm font-light leading-normal md:leading-relaxed mb-2 md:mb-4 line-clamp-2">
              {product.name}
            </p>
          </div>
        </div>
      </Link>
      
      {/* Action Button outside Link */}
      <div className="px-3 pb-3 pt-0 md:px-5 md:pb-5">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
          }}
          className="w-full bg-transparent hover:bg-nova-gold text-nova-gold hover:text-nova-darker border border-nova-gold/30 hover:border-nova-gold py-2 md:py-2.5 rounded-md md:rounded-lg font-sans font-medium tracking-[0.1em] md:tracking-[0.15em] text-[8px] md:text-[10px] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 md:gap-2"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

