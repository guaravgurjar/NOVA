import { shopCategories, reviews } from '../data';
import { ProductCard } from '../components/ProductCard';
import { CategoryCardGrid } from '../components/CategoryCardGrid';
import { useProducts } from '../contexts/ProductsContext';
import { PromoStrip } from '../components/PromoStrip';
import { HeroSlider } from '../components/HeroSlider';
import { ShieldCheck, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

import { usePageSEO } from '../lib/usePageSEO';

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
  usePageSEO({
    title: 'Home',
    description: 'Shop certified 925 sterling silver jewellery at NOVA — rings, chains, earrings, bracelets, pendants. Free shipping, 7-day returns, COD available.',
  });

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
    <div className="flex flex-col min-h-screen bg-white text-white">

      {/* Visually hidden h1 for SEO — every page needs one */}
      <h1 className="sr-only">NOVA Jewellery — Buy 925 Sterling Silver Jewellery Online</h1>

      {/* Hero Banner Slider */}
      <HeroSlider />


      {/* Promo Strip */}
      <PromoStrip />

      {/* Grid Categories Section */}
      <section aria-label="Shop by category" className="container mx-auto px-4 md:px-12 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-nova-darker text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR YOU</span>
          <h2 className="text-fluid-2xl font-serif tracking-wide font-light text-nova-darker">Shop By Category</h2>
          <div className="w-20 md:w-30 h-px bg-nova-darker mx-auto mt-3 md:mt-4"></div>
        </div>

        <CategoryCardGrid
          categories={shopCategories}
          getHref={(cat) => `/category/${cat.id}`}
        />
      </section>

      {/* Premium Sale Campaign Banner */}
      <section aria-label="Sale campaign" className="relative w-full h-48 md:h-100 lg:h-120 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banners/him.webp"
            alt="Sale Banner"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section aria-label="Featured products" className="container mx-auto px-4 md:px-12 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-nova-dark text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-2">LATEST ARRIVALS</span>
          <h2 className="text-fluid-2xl font-serif tracking-wide font-light text-nova-darker">Featured Masterpieces</h2>
          <div className="w-10 md:w-12 h-px bg-nova-dark mx-auto mt-3 md:mt-4"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* Luxury Reviews Carousel */}
      <section aria-label="Customer testimonials" className="bg-white py-5 border-t border-nova-gold/10">
        <div className="container mx-auto px-4 md:px-12 max-w-4xl relative">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-nova-dark text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-2">TESTIMONIALS</span>
            <h2 className="text-fluid-xl font-serif tracking-wide font-light text-nova-darker">Whispers of Satisfaction</h2>
            <div className="w-10 md:w-12 h-px bg-nova-darker mx-auto mt-3 md:mt-4"></div>
          </div>

          <div className="glass-dark rounded-2xl p-5 md:p-12 border border-white/5 relative shadow-2xl">

            {/* Carousel Navigation buttons */}
            <button
              onClick={prevReview}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 hover:border-nova-gold/30 flex items-center justify-center bg-nova-darker/60 hover:bg-nova-dark text-white hover:text-nova-gold transition-all duration-300 z-10"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 hover:border-nova-gold/30 flex items-center justify-center bg-nova-darker/60 hover:bg-nova-dark text-white hover:text-nova-gold transition-all duration-300 z-10"
              aria-label="Next Review"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            <div className="text-center px-10 md:px-12">
              <span className="text-4xl md:text-6xl text-nova-gold/20 font-serif block -mt-2 md:-mt-4 leading-none">"</span>
              <p className="text-white/80 font-light text-xs md:text-base leading-relaxed mb-4 md:mb-6 italic">
                {reviews[activeReviewIndex]?.content}
              </p>
              <div className="flex justify-center text-nova-gold text-[10px] tracking-wider gap-0.5 mb-2 md:mb-3">
                {Array.from({ length: reviews[activeReviewIndex]?.rating || 5 }).map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              <h4 className="font-serif text-xs md:text-sm font-semibold text-nova-gold tracking-widest uppercase">
                {reviews[activeReviewIndex]?.author}
              </h4>
              <span className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest">Verified Collector</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
