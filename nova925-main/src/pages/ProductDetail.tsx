import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, shopCategories } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { 
  Heart, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  ArrowLeftRight, 
  ChevronDown, 
  ChevronUp, 
  Minus, 
  Plus 
} from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Find the product
  const product = products.find(p => p.id === id);
  
  // State variables
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset states on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setDeliveryStatus(null);
    setPincode('');
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-nova-darker text-white p-6">
        <span className="text-5xl mb-6">🔍</span>
        <h2 className="font-serif text-2xl mb-3">Product Not Found</h2>
        <p className="text-white/50 text-sm mb-8">The luxury piece you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-nova-gold text-nova-darker px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-nova-gold/20">
          Return to Shop
        </Link>
      </div>
    );
  }

  const categoryData = shopCategories.find(c => c.id === product.category);
  const originalPrice = product.originalPrice || Math.round(product.price * 1.6);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // Filter related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => quantity > 1 && setQuantity(prev => prev - 1);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(prev => (prev === section ? null : section));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      addToast('Please enter a valid 6-digit pincode');
      return;
    }
    
    // Simulate lookup response
    const days = 2 + (Number(pincode) % 4);
    const date = new Date();
    date.setDate(date.getDate() + days);
    
    const formattedDate = date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
    
    setDeliveryStatus(`Estimated delivery by ${formattedDate}. Cash on delivery is available.`);
    addToast('Pincode verified');
  };

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      <div className="container mx-auto px-6 md:px-12 py-8 max-w-7xl flex-1">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-white/40 tracking-wider uppercase mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-nova-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-nova-gold transition-colors">Shop</Link>
          <span>/</span>
          {categoryData && (
            <>
              <Link to={`/category/${categoryData.id}`} className="hover:text-nova-gold transition-colors">{categoryData.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-white/80 font-normal">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20">
          
          {/* LEFT: Image Section (7 columns) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 self-stretch">
            
            {/* Thumbnail vertical list (Desktop left) */}
            <div className="hidden md:flex flex-col gap-3 w-20 overflow-y-auto max-h-[500px] pr-1 scrollbar-thin">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-square w-full rounded-lg overflow-hidden bg-[#07090f] border-2 transition-all duration-300 ${
                    activeImageIndex === idx ? 'border-nova-gold shadow-md' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image View */}
            <div className="flex-1 flex flex-col gap-4">
              <div 
                ref={containerRef}
                className="relative aspect-square overflow-hidden bg-[#07090f] border border-white/5 rounded-2xl flex items-center justify-center cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => {
                  setIsZoomed(false);
                  setMousePos({ x: 50, y: 50 });
                }}
              >
                <img 
                  src={allImages[activeImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl pointer-events-none transition-transform duration-500 ease-out"
                  style={{
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: isZoomed ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
                
                {/* Navigation arrows inside main image */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-nova-darker/60 hover:bg-nova-gold hover:text-nova-darker border border-white/10 flex items-center justify-center transition-all duration-300 group"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-white group-hover:text-nova-darker" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-nova-darker/60 hover:bg-nova-gold hover:text-nova-darker border border-white/10 flex items-center justify-center transition-all duration-300 group"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-white group-hover:text-nova-darker" />
                    </button>
                  </>
                )}

                {/* Badge */}
                <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.25em] bg-nova-gold text-nova-darker px-3 py-1 rounded-full font-bold shadow-md shadow-nova-gold/10">
                  925 Silver
                </span>
              </div>

              {/* Horizontal Thumbnails (Mobile only) */}
              <div className="flex md:hidden gap-2 overflow-x-auto py-1 hide-scrollbar">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square w-16 shrink-0 rounded-lg overflow-hidden bg-[#07090f] border-2 transition-all ${
                      activeImageIndex === idx ? 'border-nova-gold' : 'border-white/5'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail Mobile ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Detail Information (5 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Title & Brand */}
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-bold mb-2">NOVA JEWELLERY</span>
            <h1 className="text-2xl md:text-4xl font-serif tracking-wide mb-3 font-medium leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className="flex text-nova-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-white/60 font-light">(4.8 rating based on 32 reviews)</span>
            </div>

            {/* Price section */}
            <div className="glass-dark rounded-xl p-5 mb-8 border border-white/5 flex flex-col gap-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-nova-gold/5 rounded-full blur-2xl"></div>
              <span className="text-white/40 text-xs tracking-wider uppercase">Special Price</span>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl md:text-3xl font-bold text-nova-gold font-serif">
                  Rs. {product.price.toLocaleString('en-IN')}/-
                </span>
                <span className="text-white/30 line-through text-sm">
                  Rs. {originalPrice.toLocaleString('en-IN')}/-
                </span>
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  {discountPercent}% OFF
                </span>
              </div>
              <span className="text-[10px] text-white/40">Inclusive of all local taxes & duties</span>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-3.5 mb-8 text-xs text-white/70 font-light">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-nova-gold shrink-0" />
                <span>Purity: Certified 925 Sterling Silver</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-nova-gold shrink-0" />
                <span>Finish: Rhodium Anti-Tarnish Coating</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-nova-gold shrink-0" />
                <span>Packaging: Premium Luxury gift box with authentication certificate</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs uppercase tracking-widest text-white/50">Quantity</span>
              <div className="flex bg-[#181c2b] border border-white/10 rounded-lg overflow-hidden items-center">
                <button onClick={handleDecrement} className="px-3.5 py-2 hover:bg-white/5 text-white/75 transition-colors font-bold"><Minus className="w-3.5 h-3.5" /></button>
                <span className="px-5 py-2 font-mono text-xs font-semibold text-nova-gold">{String(quantity).padStart(2, '0')}</span>
                <button onClick={handleIncrement} className="px-3.5 py-2 hover:bg-white/5 text-white/75 transition-colors font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => addToast(`Added ${quantity} item(s) to Cart`)}
                className="flex-1 bg-nova-gold hover:bg-nova-gold-light text-nova-darker py-4 rounded-xl font-sans font-bold tracking-[0.2em] text-xs uppercase transition-all duration-300 shadow-md shadow-nova-gold/15 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={() => {
                  if (product) toggleWishlist(product.id);
                }}
                className={`px-6 py-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                  isWishlisted 
                    ? 'bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30' 
                    : 'bg-[#181c2b] hover:bg-white/5 border-white/10 text-white/80 hover:text-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span className="sm:hidden font-medium text-xs tracking-wider uppercase">Wishlist</span>
              </button>
            </div>

            {/* Pincode Estimator */}
            <div className="glass-dark border border-white/5 rounded-xl p-5 mb-8 text-sm">
              <span className="font-serif text-nova-gold text-xs tracking-wider uppercase block mb-3 font-medium">Check Delivery Options</span>
              <form onSubmit={checkDelivery} className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 bg-[#181c2b] border border-white/10 focus:border-nova-gold rounded-lg py-2 px-3.5 text-xs text-white focus:outline-none tracking-widest placeholder-white/20"
                />
                <button 
                  type="submit"
                  className="px-5 bg-white/5 hover:bg-nova-gold border border-white/10 hover:border-nova-gold text-white hover:text-nova-darker text-xs font-semibold tracking-wider rounded-lg transition-all"
                >
                  Verify
                </button>
              </form>
              {deliveryStatus ? (
                <div className="flex gap-2 items-start text-xs text-emerald-400 mt-2 font-light">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{deliveryStatus}</span>
                </div>
              ) : (
                <span className="text-[10px] text-white/30 font-light block">Enter pincode to verify shipping timelines in your region.</span>
              )}
            </div>

            {/* Accordions */}
            <div className="border border-white/5 rounded-xl overflow-hidden glass-dark text-xs font-light">
              
              {/* Description Accordion */}
              <div className="border-b border-white/5">
                <button 
                  onClick={() => toggleAccordion('desc')}
                  className="w-full flex items-center justify-between p-4 font-serif text-nova-gold font-medium tracking-wide"
                >
                  <span>Description</span>
                  {openAccordion === 'desc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="p-4 pt-0 text-white/70 leading-relaxed space-y-2">
                    <p>
                      Crafted for the modern aesthetic, this hand-finished {product.category || 'jewellery'} piece is a stunning display of premium craftsmanship. Sculpted in hallmarked 925 sterling silver, it features a timeless design optimized for maximum shine and elegance.
                    </p>
                    <p>
                      Perfect for daily wear or formal events, it is layered with rhodium plating to prevent tarnishing and maintain a brilliant white gold shine.
                    </p>
                  </div>
                )}
              </div>

              {/* Specifications Accordion */}
              <div className="border-b border-white/5">
                <button 
                  onClick={() => toggleAccordion('specs')}
                  className="w-full flex items-center justify-between p-4 font-serif text-nova-gold font-medium tracking-wide"
                >
                  <span>Materials & Specifications</span>
                  {openAccordion === 'specs' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="p-4 pt-0 text-white/70 leading-relaxed grid grid-cols-2 gap-y-2.5">
                    <div><strong>Metal Purity:</strong> 925 Sterling Silver</div>
                    <div><strong>Plating:</strong> Rhodium (Anti-tarnish)</div>
                    <div><strong>Weight:</strong> Approx 6.4g - 12.8g</div>
                    <div><strong>Clasp:</strong> Secure Spring Ring/Lobster</div>
                    <div><strong>Packaging:</strong> Premium NOVA Luxury Box</div>
                    <div><strong>Certificate:</strong> Authenticity Included</div>
                  </div>
                )}
              </div>

              {/* Shipping & Returns Accordion */}
              <div>
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between p-4 font-serif text-nova-gold font-medium tracking-wide"
                >
                  <span>Shipping & Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 pt-0 text-white/70 leading-relaxed space-y-2">
                    <div className="flex gap-2 items-center text-[10px] text-nova-gold uppercase font-bold tracking-wider mb-2">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free Standard Shipping</span>
                    </div>
                    <p>We provide free secure shipping on all orders across India. Orders are processed within 24-48 hours and typically arrive within 4-7 business days.</p>
                    <div className="flex gap-2 items-center text-[10px] text-nova-gold uppercase font-bold tracking-wider mb-2 pt-2">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>15-Day Return Policy</span>
                    </div>
                    <p>Love it or return it. If you are not fully satisfied, you can initiate a return or exchange within 15 days of delivery. For more details on the process, please refer to our <Link to="/return" className="text-nova-gold hover:underline">Return Policy</Link>.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Complete the Look Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/5 pt-16">
            <h2 className="text-2xl md:text-3xl font-serif tracking-wider font-light mb-10 text-center">
              Complete Your Look
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
