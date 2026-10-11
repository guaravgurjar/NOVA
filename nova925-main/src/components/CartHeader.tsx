import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function CartHeader() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="w-full px-3 md:px-12 h-20 md:h-24 lg:h-28 flex items-center justify-between">
        {/* Left: Brand Logo (Exact placement & sizing as Home page header) */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <Link to="/" className="flex items-center py-1 group min-w-0" aria-label="NOVA Jewellery Home">
            <img
              src="/images/banners/logo_new.webp"
              alt="NOVA Jewellery — Home"
              width="180"
              height="48"
              fetchPriority="high"
              className="h-10 sm:h-12 md:h-14 lg:h-20 w-auto max-w-[42vw] sm:max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
        </div>

        {/* Center: Shopping Cart Title */}
        <div className="flex-1 flex items-center justify-center text-center px-2">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-900 tracking-normal whitespace-nowrap">
            Shopping Cart
          </h1>
        </div>

        {/* Right: 100% Secure Tag */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-900 select-none">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800 shrink-0" strokeWidth={1.8} />
            <span className="text-xs sm:text-sm md:text-base tracking-wider uppercase whitespace-nowrap">
              <strong className="font-bold text-gray-900">100%</strong>{' '}
              <span className="text-gray-700 font-medium">SECURE</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
