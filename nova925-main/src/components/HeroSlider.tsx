import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Slide } from '../types';

export type { Slide };

export const slides: Slide[] = [
  {
    id: 1,
    image: '/images/banners/Web Banners/test.webp',
    mobileImage: '/images/banners/Mob Banners/Female Mob.webp',
    alt: "Women's 925 Sterling Silver Jewellery Collection",
    link: '/gifts-for-her',
  },
  {
    id: 2,
    image: '/images/banners/Web Banners/Male Web.webp',
    mobileImage: '/images/banners/Mob Banners/Male Mob.webp',
    alt: "Men's 925 Sterling Silver Jewellery Collection",
    link: '/gifts-for-him',
  },
  {
    id: 3,
    image: '/images/banners/Web Banners/Astro Web.webp',
    mobileImage: '/images/banners/Mob Banners/Astro Mob.webp',
    alt: 'NOVA Astro Zodiac Jewellery Collection',
    link: '/Astro-collection',
  },
  {
    id: 4,
    image: '/images/banners/Web Banners/Kids Web.webp',
    mobileImage: '/images/banners/Mob Banners/Kids Mob.webp',
    alt: 'NOVA Kids 925 Silver Jewellery Collection',
    link: '/kids',
  },
];

export const DEFAULT_BANNER_SLIDES = slides;

export const SLIDE_DURATION = 5000;
export const MOBILE_BREAKPOINT = 768; // px — same as Tailwind's `md`

// ── Hook: detects mobile viewport, re-evaluates on resize ────────────────────
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Use addEventListener for modern browsers, addListener as fallback
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      (mq as any).addListener(handler);
    }

    // Sync immediately in case window resized before effect ran
    setIsMobile(mq.matches);

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        (mq as any).removeListener(handler);
      }
    };
  }, []);

  return isMobile;
}

interface HeroSliderProps {
  slides?: Slide[];
  autoPlayInterval?: number;
  className?: string;
}

export function HeroSlider({
  slides: sliderSlides = slides,
  autoPlayInterval = SLIDE_DURATION,
  className = '',
}: HeroSliderProps) {
  const isMobile = useIsMobile();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const totalSlides = sliderSlides.length;

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nextSlide, totalSlides, isPaused, autoPlayInterval]);

  // Touch Swipe Handlers for Mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (diff > minSwipeDistance) {
      nextSlide();
    } else if (diff < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Banner Slider"
      className={`relative w-full overflow-hidden bg-black/5 select-none aspect-[3/1] h-auto sm:aspect-auto sm:h-[65vh] md:h-[80vh] ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out will-change-transform"
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${activeSlide * (100 / totalSlides)}%)`,
        }}
      >
        {sliderSlides.map((slide, index) => {
          // Fallback rule: When rendering, if on mobile (< 768px) and mobileImage exists, use mobileImage.
          // Otherwise, fall back to desktop image.
          const currentImage = isMobile && slide.mobileImage ? slide.mobileImage : slide.image;
          const isFirstSlide = index === 0;

          const slideContent = (
            <div className="relative w-full h-full">
              <picture className="w-full h-full block">
                {slide.mobileImage && (
                  <source media={`(max-width: ${MOBILE_BREAKPOINT - 1}px)`} srcSet={slide.mobileImage} />
                )}
                <img
                  src={currentImage}
                  alt={slide.alt || `NOVA Banner Slide ${index + 1}`}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                  decoding="async"
                  fetchPriority={isFirstSlide ? 'high' : 'low'}
                  loading={isFirstSlide ? 'eager' : 'lazy'}
                />
              </picture>
            </div>
          );

          return (
            <div
              key={slide.id}
              className="w-full h-full shrink-0"
              style={{ width: `${100 / totalSlides}%` }}
              aria-hidden={activeSlide !== index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
            >
              {slide.link ? (
                <Link
                  to={slide.link}
                  className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-nova-gold"
                  tabIndex={activeSlide === index ? 0 : -1}
                >
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 active:scale-95 text-white backdrop-blur-md border border-white/20 transition-all duration-300 opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 active:scale-95 text-white backdrop-blur-md border border-white/20 transition-all duration-300 opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Carousel dot indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3">
          {sliderSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 cursor-pointer ${activeSlide === index
                ? 'bg-nova-gold w-6 sm:w-8 shadow-[0_0_10px_rgba(197,168,128,0.7)]'
                : 'bg-white/50 hover:bg-white/80 w-1.5 sm:w-2'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HeroSlider;
