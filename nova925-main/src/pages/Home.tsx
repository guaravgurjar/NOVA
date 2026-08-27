import { Link } from 'react-router-dom';
import { shopCategories, reviews } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { PromoStrip } from '../components/PromoStrip';
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
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 5;
  const bannerImages = [
    '/images/banners/hero1.webp',
    '/images/banners/hero2.webp',
    '/images/banners/hero3.webp',
    '/images/banners/astro.webp',
    '/images/banners/kids.webp',


  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

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
      <section aria-label="Featured promotions" className="relative w-full overflow-hidden bg-white  aspect-[16/9] md:aspect-[6250/1953]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ width: `${totalSlides * 100}%`, transform: `translateX(-${activeSlide * (100 / totalSlides)}%)` }}
        >
          {bannerImages.map((src, index) => (
            <div key={index} className="w-full h-full shrink-0" style={{ width: `${100 / totalSlides}%` }}>
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Carousel dot indicators */}
        <div className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-500 cursor-pointer ${activeSlide === index
                ? 'bg-nova-gold w-5 md:w-7 shadow-[0_0_8px_rgba(197,168,128,0.5)]'
                : 'bg-white/40 w-1.5 md:w-2 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Promo Strip */}
      <PromoStrip />

      {/* Grid Categories Section */}
      <section aria-label="Shop by category" className="container mx-auto px-4 md:px-12 py-12 md:py-20 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-nova-darker text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] block mb-2">CURATED FOR YOU</span>
          <h2 className="text-fluid-2xl font-serif tracking-wide font-light text-nova-darker">Shop By Category</h2>
          <div className="w-20 md:w-30 h-px bg-nova-darker mx-auto mt-3 md:mt-4"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {shopCategories.map((cat) => (
            <Link
              to={`/category/${cat.id}`}
              key={cat.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-3/2 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 shadow-xl border border-white/5 group-hover:border-nova-gold/45 transition-all duration-300 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#07090f]/95 via-[#07090f]/20 to-transparent opacity-90 transition-opacity"></div>
                <div className="absolute bottom-3 md:bottom-4 left-0 right-0 text-center">
                  <span className="text-[9px] md:text-sm font-semibold tracking-[0.2em] md:tracking-[0.25em] font-sans text-white group-hover:text-nova-gold transition-colors">{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
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

            <div className="text-center px-6 md:px-8">
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
