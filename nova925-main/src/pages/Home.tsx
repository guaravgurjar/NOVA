import { Link } from 'react-router-dom';
import { featuredProducts, shopCategories, reviews } from '../data';
import { ProductCard } from '../components/ProductCard';
import { ShieldCheck, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      
      {/* Cinematic Hero Banner */}
      <div className="relative h-[550px] md:h-[680px] w-full overflow-hidden">
        {/* Animated Background Image (Ken Burns) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599643478514-4a4e0e69528d?auto=format&fit=crop&q=80&w=1200&h=800" 
            alt="Silver Jewelry" 
            className="w-full h-full object-cover object-right animate-kenburns opacity-60" 
          />
        </div>
        
        {/* Soft elegant gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-nova-darker via-nova-dark/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-nova-darker via-transparent to-transparent z-10" />

        <div className="relative z-20 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center max-w-7xl">
          <div className="mb-6 animate-fade-in">
            <span className="text-nova-gold text-sm font-semibold uppercase tracking-[0.3em] block mb-2">Exclusive 925 Sterling Silver</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-6xl md:text-8xl font-serif tracking-[0.15em] font-light block">NOVA</span>
              <span className="w-2.5 h-2.5 rounded-full bg-nova-gold"></span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-serif text-white/95 mb-6 tracking-wide max-w-xl font-light leading-snug">
            Silver That Speaks Your <span className="text-nova-gold italic font-normal">Style</span>
          </h1>
          <p className="text-white/60 max-w-md text-xs md:text-sm mb-10 leading-relaxed font-light">
            Discover timeless 925 sterling silver jewelry designed to reflect your individuality, celebrate your moments, and elevate your everyday style.
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="btn-premium inline-block bg-nova-gold text-nova-darker px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/25 transition-all">
              Explore Collection
            </Link>
            <Link to="/category/sets" className="inline-block border border-white/20 text-white hover:text-nova-gold hover:border-nova-gold/40 px-8 py-3 rounded-lg font-medium uppercase tracking-widest text-xs transition-colors backdrop-blur-sm bg-white/5">
              View Sets
            </Link>
          </div>
        </div>
      </div>

      {/* Promo Strip */}
      <div className="bg-nova-gold text-nova-darker py-3 border-y border-nova-gold/20 font-medium overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-wrap justify-between items-center text-[10px] md:text-xs tracking-[0.15em] uppercase gap-4 font-semibold">
          <span>✨ 7-Day Easy Returns</span>
          <span>✨ Free Delivery Over ₹2000</span>
          <span>✨ Extra 5% OFF Above ₹3,000</span>
          <span>✨ Extra 10% OFF Above ₹8,000</span>
        </div>
      </div>

      {/* Grid Categories Section */}
      <div className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR YOU</span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light">Shop By Category</h2>
          <div className="w-12 h-[1px] bg-nova-gold mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {shopCategories.map((cat) => (
            <Link 
              to={`/category/${cat.id}`} 
              key={cat.id} 
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-xl border border-white/5 group-hover:border-nova-gold/30 transition-all duration-300 relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nova-darker/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white group-hover:text-nova-gold transition-colors">{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Premium Sale Campaign Banner */}
      <div className="relative w-full h-[400px] md:h-[480px] bg-nova-dark border-y border-nova-gold/10 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img 
            src="https://images.unsplash.com/photo-1614088523910-c4ac114382f1?auto=format&fit=crop&q=80&w=1600&h=600" 
            alt="Sale Banner" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-nova-darker via-nova-darker/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#c5a880_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 flex flex-col items-start">
          <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.3em] mb-2">LIMITED TIME OFFER</span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-wider mb-2 font-light">SILVER GLOW</h2>
          <h3 className="text-2xl md:text-4xl tracking-widest text-nova-gold font-serif italic mb-8">Exclusive Seasonal Sale</h3>
          
          <div className="flex flex-col gap-3 mb-8 border-l border-nova-gold/30 pl-6 py-2">
            <div className="text-sm md:text-lg tracking-wider font-light text-white/90">Get <span className="font-semibold text-nova-gold">5% OFF</span> on orders above ₹3,000</div>
            <div className="text-sm md:text-lg tracking-wider font-light text-white/90">Get <span className="font-semibold text-nova-gold">10% OFF</span> on orders above ₹8,000</div>
          </div>
          
          <Link to="/shop" className="btn-premium inline-block bg-white text-nova-darker px-8 py-3 rounded-lg font-semibold uppercase tracking-widest text-xs hover:bg-nova-gold hover:text-nova-darker transition-colors shadow-lg shadow-black/40">
            Shop The Sale
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-2">LATEST ARRIVALS</span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light">Featured Masterpieces</h2>
          <div className="w-12 h-[1px] bg-nova-gold mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Brand Trust & Pure Silver Highlights */}
      <div className="bg-nova-dark border-t border-nova-gold/10">
        
        {/* Brand Bio */}
        <div className="py-20 relative overflow-hidden">
          <div className="absolute -right-32 top-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif font-bold text-white/5 select-none pointer-events-none tracking-widest">
            NOVA
          </div>
          <div className="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col lg:flex-row items-center gap-10">
             <div className="flex-1 text-center lg:text-left">
                <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-2">OUR HERITAGE</span>
                <h3 className="text-3xl font-serif font-light mb-6">NOVA Sterling Silver</h3>
                <p className="text-white/70 mb-4 leading-relaxed font-light text-sm">
                  <span className="font-semibold text-white">NOVA</span> is not just jewellery - it's an extension of your persona. 
                  Hand-crafted in high-purity <span className="font-semibold text-white text-nova-gold">925 Sterling Silver</span>, each product features a tarnish-resistant finish designed for active, daily wear.
                </p>
                <p className="text-white/70 leading-relaxed font-light text-sm">
                  Brought to you by <span className="font-semibold text-white">"Utkarsh Jewellers"</span>, a trusted legacy since <span className="font-semibold text-white">1995</span> representing honest value, verified purity certificates, and customer-first values.
                </p>
             </div>
             <div className="w-full lg:w-[1px] h-[1px] lg:h-48 bg-nova-gold/20"></div>
             <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-nova-gold/30 flex items-center justify-center mb-4 bg-nova-gold/5">
                    <Award className="w-6 h-6 text-nova-gold" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold tracking-wide mb-1">925 Sterling</h4>
                  <p className="text-white/50 text-[11px] font-light">Certified high-grade authentic silver.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-nova-gold/30 flex items-center justify-center mb-4 bg-nova-gold/5">
                    <ShieldCheck className="w-6 h-6 text-nova-gold" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold tracking-wide mb-1">100% Secure</h4>
                  <p className="text-white/50 text-[11px] font-light">Fully hallmarked and lab-certified purity.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border border-nova-gold/30 flex items-center justify-center mb-4 bg-nova-gold/5">
                    <RefreshCw className="w-6 h-6 text-nova-gold" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold tracking-wide mb-1">Easy Returns</h4>
                  <p className="text-white/50 text-[11px] font-light">Hassle-free 7-day returns & exchanges.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Luxury Reviews Carousel */}
      <div className="bg-[#090b12] py-20 border-t border-nova-gold/10">
         <div className="container mx-auto px-6 md:px-12 max-w-4xl relative">
            <div className="text-center mb-12">
              <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-2">TESTIMONIALS</span>
              <h2 className="text-3xl font-serif tracking-wide font-light">Whispers of Satisfaction</h2>
              <div className="w-12 h-[1px] bg-nova-gold mx-auto mt-4"></div>
            </div>
            
            <div className="glass-dark rounded-2xl p-8 md:p-12 border border-white/5 relative shadow-2xl">
              
              {/* Carousel Navigation buttons */}
              <button 
                onClick={prevReview}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 hover:border-nova-gold/30 flex items-center justify-center bg-nova-darker/60 hover:bg-nova-dark text-white hover:text-nova-gold transition-all duration-300 z-10"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextReview}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 hover:border-nova-gold/30 flex items-center justify-center bg-nova-darker/60 hover:bg-nova-dark text-white hover:text-nova-gold transition-all duration-300 z-10"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="text-center px-8">
                <span className="text-6xl text-nova-gold/20 font-serif block -mt-4 leading-none">“</span>
                <p className="text-white/80 font-light text-sm md:text-base leading-relaxed mb-6 italic">
                  {reviews[activeReviewIndex]?.content}
                </p>
                <div className="flex justify-center text-nova-gold text-[10px] tracking-wider gap-0.5 mb-3">
                  {Array.from({ length: reviews[activeReviewIndex]?.rating || 5 }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <h4 className="font-serif text-sm font-semibold text-nova-gold tracking-widest uppercase">
                  {reviews[activeReviewIndex]?.author}
                </h4>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Verified Collector</span>
              </div>
            </div>
         </div>
      </div>

    </div>
  );
}
