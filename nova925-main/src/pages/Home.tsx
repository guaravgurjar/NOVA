import { Link } from 'react-router-dom';
import { shopCategories, reviews } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { PromoStrip } from '../components/PromoStrip';
import { ShieldCheck, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const zodiacDates: Record<string, string> = {
  astro_aries: 'Mar 21 - Apr 19',
  astro_taurus: 'Apr 20 - May 20',
  astro_gemini: 'May 21 - Jun 20',
  astro_cancer: 'Jun 21 - Jul 22',
  astro_leo: 'Jul 23 - Aug 22',
  astro_virgo: 'Aug 23 - Sep 22',
  astro_libra: 'Sep 23 - Oct 22',
  astro_scorpio: 'Oct 23 - Nov 21',
  astro_sagittarius: 'Nov 22 - Dec 21',
  astro_capricorn: 'Dec 22 - Jan 19',
  astro_aquarius: 'Jan 20 - Feb 18',
  astro_pisces: 'Feb 19 - Mar 20',
};

export function Home() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeStoryTab, setActiveStoryTab] = useState<'legacy' | 'purity' | 'meaning'>('legacy');

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
      <PromoStrip />

      {/* Grid Categories Section */}
      <div className="container mx-auto px-6 md:px-12 py-20 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR YOU</span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide font-light">Shop By Category</h2>
          <div className="w-12 h-[1px] bg-nova-gold mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {shopCategories.map((cat) => (
            <Link 
              to={`/category/${cat.id}`} 
              key={cat.id} 
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden mb-4 shadow-xl border border-white/5 group-hover:border-nova-gold/45 transition-all duration-300 relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/95 via-[#07090f]/20 to-transparent opacity-90 transition-opacity"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-[10px] md:text-sm font-semibold tracking-[0.25em] font-sans text-white group-hover:text-nova-gold transition-colors">{cat.name}</span>
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
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Celestial Astro Jewellery Section */}
      <div className="relative py-24 bg-gradient-to-b from-[#090a15] to-[#121424] overflow-hidden border-y border-nova-gold/15">
        {/* Starry night subtle animations/overlays */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-nova-gold/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.3em] block mb-3">COSMIC COLLECTION</span>
            <h2 className="text-3xl md:text-5xl font-serif tracking-wide font-light text-white">
              Celestial Connection: <span className="text-nova-gold italic font-normal">Astro Jewellery</span>
            </h2>
            <div className="w-16 h-[1px] bg-nova-gold/50 mx-auto mt-5 mb-4"></div>
            <p className="text-white/60 max-w-2xl mx-auto text-xs md:text-sm font-light leading-relaxed">
              Find your stars in 925 sterling silver. Wear your birth sign's cosmic energy with our custom zodiac pendants, exquisitely crafted for everyday elegance.
            </p>
          </div>

          {/* Zodiac Carousel */}
          <div className="flex overflow-x-auto space-x-6 pb-10 px-4 hide-scrollbar snap-x snap-mandatory">
            {products.filter(p => p.category === 'astro').map((zodiac) => {
              const dateRange = zodiacDates[zodiac.id] || '';
              const zodiacName = zodiac.name.replace(' Zodiac Silver Pendant', '');
              return (
                <div 
                  key={zodiac.id} 
                  className="w-[260px] shrink-0 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center snap-align-start group hover:border-nova-gold/30 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden"
                >
                  {/* Subtle golden ring backdrop on card hover */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full border border-nova-gold/10 group-hover:scale-150 transition-all duration-700 bg-nova-gold/[0.01]"></div>
                  
                  {/* Image container */}
                  <div className="w-40 h-40 rounded-2xl overflow-hidden mb-6 relative border border-white/5 bg-nova-darker/50 group-hover:border-nova-gold/20 transition-all duration-300">
                    <img 
                      src={zodiac.image} 
                      alt={zodiac.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  {/* Zodiac text */}
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-nova-gold transition-colors duration-300">
                    {zodiacName}
                  </h3>
                  <span className="text-[10px] text-nova-gold/80 font-medium tracking-[0.15em] uppercase mb-4 block mt-1">
                    {dateRange}
                  </span>
                  
                  {/* Pricing and Action */}
                  <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-white font-serif text-base font-semibold">₹{zodiac.price}</span>
                    <Link 
                      to={`/product/${zodiac.id}`} 
                      className="text-[10px] uppercase tracking-widest text-nova-gold border border-nova-gold/30 hover:bg-nova-gold hover:text-nova-darker hover:border-nova-gold px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* CTA at bottom */}
          <div className="text-center mt-12">
            <Link 
              to="/category/astro" 
              className="inline-flex items-center gap-2 border border-nova-gold/40 text-nova-gold hover:bg-nova-gold hover:text-nova-darker hover:border-nova-gold px-8 py-3.5 rounded-xl font-semibold uppercase tracking-widest text-xs transition-all duration-300 shadow-lg shadow-nova-gold/5"
            >
              Shop the Celestial Collection
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Trust & Pure Silver Highlights */}
      <div className="bg-nova-dark border-t border-nova-gold/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif font-bold text-white/[0.02] select-none pointer-events-none tracking-widest">
          NOVA
        </div>
        <div className="absolute -left-20 top-10 w-72 h-72 rounded-full bg-nova-gold/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute right-10 bottom-10 w-96 h-96 rounded-full bg-nova-gold/5 blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 py-24 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Story (col-span-5) */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-nova-gold text-xs font-semibold uppercase tracking-[0.25em] block mb-3">
                OUR HERITAGE
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-light text-white mb-8 leading-tight">
                Crafting Legacies in <br />
                <span className="text-silver-gradient font-normal">Pure Sterling Silver</span>
              </h3>

              {/* Interactive Tabs Menu */}
              <div className="flex border-b border-white/10 mb-8 pb-px">
                <button
                  onClick={() => setActiveStoryTab('legacy')}
                  className={`pb-4 text-xs font-medium uppercase tracking-wider transition-all duration-300 relative mr-6 cursor-pointer ${
                    activeStoryTab === 'legacy' ? 'text-nova-gold' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Our Legacy
                  {activeStoryTab === 'legacy' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-nova-gold shadow-md shadow-nova-gold/40 transition-all duration-300"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveStoryTab('purity')}
                  className={`pb-4 text-xs font-medium uppercase tracking-wider transition-all duration-300 relative mr-6 cursor-pointer ${
                    activeStoryTab === 'purity' ? 'text-nova-gold' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  925 Promise
                  {activeStoryTab === 'purity' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-nova-gold shadow-md shadow-nova-gold/40 transition-all duration-300"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveStoryTab('meaning')}
                  className={`pb-4 text-xs font-medium uppercase tracking-wider transition-all duration-300 relative cursor-pointer ${
                    activeStoryTab === 'meaning' ? 'text-nova-gold' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  The Name 'NOVA'
                  {activeStoryTab === 'meaning' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-nova-gold shadow-md shadow-nova-gold/40 transition-all duration-300"></span>
                  )}
                </button>
              </div>

              {/* Tab Content with fade transition */}
              <div className="min-h-[160px] flex flex-col justify-start">
                {activeStoryTab === 'legacy' && (
                  <div className="animate-fade-in">
                    <p className="text-white/70 mb-4 leading-relaxed font-light text-sm md:text-base">
                      <span className="font-semibold text-white">NOVA</span> is not just jewellery - it's an extension of your persona. 
                      Hand-crafted in high-purity <span className="font-semibold text-silver-gradient inline-block">925 Sterling Silver</span>, each product features a tarnish-resistant finish designed for active, daily wear.
                    </p>
                    <p className="text-white/70 leading-relaxed font-light text-sm">
                      Brought to you by <span className="font-semibold text-white">"Utkarsh Jewellers"</span>, a trusted legacy since <span className="font-semibold text-white">1995</span> representing honest value, verified purity certificates, and customer-first values.
                    </p>
                  </div>
                )}

                {activeStoryTab === 'purity' && (
                  <div className="animate-fade-in">
                    <p className="text-white/70 mb-4 leading-relaxed font-light text-sm md:text-base">
                      Every single piece from our workshop is marked with the hallmark of authenticity. We guarantee <span className="font-semibold text-silver-gradient inline-block">92.5% pure silver</span> content blended with premium alloys for unmatched hardness, resilience, and shine.
                    </p>
                    <p className="text-white/70 leading-relaxed font-light text-sm">
                      Our products undergo rigorous quality assessments, certifying they are 100% hypoallergenic, lead-free, nickel-free, and perfectly safe for even the most sensitive skin.
                    </p>
                  </div>
                )}

                {activeStoryTab === 'meaning' && (
                  <div className="animate-fade-in">
                    <p className="text-white/70 mb-4 leading-relaxed font-light text-sm md:text-base">
                      The name <span className="font-semibold text-white">NOVA</span> is inspired by the astronomical phenomenon where a star suddenly becomes brighter, radiating a powerful burst of light. 
                    </p>
                    <p className="text-white/70 leading-relaxed font-light text-sm">
                      It symbolizes new beginnings, brilliance, and a glow that captures attention effortlessly. At <span className="font-semibold text-white">NOVA</span>, this meaning reflects our vision—to bring you jewellery that shines with the same intensity and elegance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Craftsmanship Card with Overlay Monogram Seal (col-span-4) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-nova-gold/20 group">
                {/* Visual backdrop of craft workshop */}
                <div className="absolute inset-0 bg-nova-darker/60 z-10 transition-all duration-500 group-hover:bg-nova-darker/40"></div>
                <img
                  src="/craftsmanship_heritage.png"
                  alt="Silver Craftsmanship"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Thin gold framing outline inside the card */}
                <div className="absolute inset-4 border border-nova-gold/10 z-20 pointer-events-none group-hover:border-nova-gold/30 transition-colors duration-500"></div>

                {/* Overlaid Silver Monogram Seal */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-nova-darker/80 border border-nova-gold/30 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:border-nova-gold/60 group-hover:scale-105">
                    <img
                      src="/nova_logo.png"
                      alt="NOVA Monogram Seal"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)] transition-all duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-nova-gold font-serif italic text-xs tracking-widest uppercase">
                      Official Seal
                    </p>
                    <p className="text-white/50 text-[10px] tracking-[0.2em] font-light mt-1">
                      EST. 1995
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Trust Cards (col-span-3) */}
            <div className="lg:col-span-3 flex flex-col gap-6 w-full">
              {/* Card 1 */}
              <div className="glass-dark rounded-xl p-5 border border-white/5 hover:border-nova-gold/30 shadow-lg glow-border transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg border border-nova-gold/30 flex items-center justify-center bg-nova-gold/5 group-hover:bg-nova-gold/10 transition-all duration-300 shrink-0">
                    <Award className="w-5 h-5 text-nova-gold group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-1">
                      925 Sterling
                    </h4>
                    <p className="text-white/50 text-xs font-light leading-relaxed">
                      Certified high-grade authentic silver with lasting shine.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-dark rounded-xl p-5 border border-white/5 hover:border-nova-gold/30 shadow-lg glow-border transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg border border-nova-gold/30 flex items-center justify-center bg-nova-gold/5 group-hover:bg-nova-gold/10 transition-all duration-300 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-nova-gold group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-1">
                      100% Secure
                    </h4>
                    <p className="text-white/50 text-xs font-light leading-relaxed">
                      Fully hallmarked and lab-certified purity standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-dark rounded-xl p-5 border border-white/5 hover:border-nova-gold/30 shadow-lg glow-border transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg border border-nova-gold/30 flex items-center justify-center bg-nova-gold/5 group-hover:bg-nova-gold/10 transition-all duration-300 shrink-0">
                    <RefreshCw className="w-5 h-5 text-nova-gold group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-1">
                      Lifetime Care
                    </h4>
                    <p className="text-white/50 text-xs font-light leading-relaxed">
                      Complimentary cleaning & tarnish inspections.
                    </p>
                  </div>
                </div>
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
