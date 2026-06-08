import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given/declined
    const consent = localStorage.getItem('nova_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for a smoother entry animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('nova_cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('nova_cookie_consent', 'necessary');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md bg-nova-darker/95 backdrop-blur-md border border-nova-gold/20 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-nova-gold/10 rounded-full flex items-center justify-center border border-nova-gold/20 flex-shrink-0 mt-1">
          <Cookie className="w-5 h-5 text-nova-gold animate-pulse" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-semibold tracking-wider text-white uppercase">
              Cookie Preferences
            </h3>
            <button 
              onClick={handleAcceptNecessary} 
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-[11px] md:text-xs text-white/70 font-light mt-2 leading-relaxed">
            We use cookies to preserve your shopping cart items, remember your wishlist selections, and deliver personalized jewelry styling recommendations. By choosing <strong className="text-white">"Accept All"</strong>, you consent to our use of all functional and marketing cookies. See our{' '}
            <Link to="/cookies" className="text-nova-gold hover:underline font-medium">
              Cookie Policy
            </Link>{' '}
            for full details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2.5 mt-4 pt-1">
            <button
              onClick={handleAcceptAll}
              className="flex-1 bg-gradient-to-tr from-nova-gold-dark to-nova-gold hover:scale-[1.02] active:scale-[0.98] text-nova-darker text-[10px] md:text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg shadow-nova-gold/10 transition-all cursor-pointer text-center"
            >
              Accept All
            </button>
            <button
              onClick={handleAcceptNecessary}
              className="flex-1 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 text-white/80 hover:text-white text-[10px] md:text-xs font-medium uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
