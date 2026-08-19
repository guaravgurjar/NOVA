import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Search } from 'lucide-react';
import { usePageSEO } from '../lib/usePageSEO';

export function NotFound() {
  usePageSEO({
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    noIndex: true,
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#0B0D17] text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-nova-gold/10 text-nova-gold mb-2 border border-nova-gold/20 animate-pulse">
          <Search className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-extrabold text-nova-gold tracking-widest">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-medium text-white">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-nova-gold text-black font-semibold hover:bg-nova-gold/90 transition-colors shadow-lg shadow-nova-gold/20 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 hover:border-white/40 transition-colors text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-nova-gold" />
            Explore Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
