import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Share2 } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { DeliveryPincode } from './DeliveryPincode';

export function Header() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const announcements = [
    "FREE SHIPPING PAN INDIA | 100% PURE 925 STERLING SILVER",
    "USE CODE 'NOVA10' FOR 10% OFF YOUR FIRST ORDER",
    "CASH ON DELIVERY & EASY 7-DAY RETURNS NATIONWIDE"
  ];

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // OPTIMIZATION 1: State Check & Passive Listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled((prev) => {
        const isNowScrolled = window.scrollY > 20;
        // Only trigger a React re-render if the boolean actually changes
        if (prev !== isNowScrolled) return isNowScrolled;
        return prev;
      });
    };

    // The passive flag prevents the listener from blocking the main thread during scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'NOVA Jewellery',
      text: 'Discover timeless 925 sterling silver jewelry at NOVA.',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Shared successfully!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.origin);
    addToast('Website link copied to clipboard!');
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (u: any) => {
    if (u.authMethod === 'phone') return 'PH';
    const first = u.firstName ? u.firstName.charAt(0) : '';
    const last = u.lastName ? u.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    // OPTIMIZATION 2: GPU-Accelerated Transform on the Wrapper
    <header
      role="banner"
      className={`sticky top-0 w-full z-100 shadow-md transition-transform duration-500 ease-in-out ${scrolled ? '-translate-y-10' : 'translate-y-0'
        }`}
    >
      {/* OPTIMIZATION 3: Fixed Height Announcement Bar */}
      <div
        className="h-10 bg-sky-100 text-[9px] md:text-[11px] font-semibold text-nova-darker uppercase tracking-[0.2em] px-4 flex items-center justify-center border-b border-nova-gold/15 select-none"
      >
        <div key={announcementIndex} className="animate-slide-up flex items-center gap-2 text-center">
          <span>{announcements[announcementIndex]}</span>
        </div>
      </div>

      {/* Top Bar */}
      {/* Top Bar */}
      <div className="bg-white h-14 md:h-16 px-3 md:px-12 flex items-center justify-between">

        {/* Logo + Delivery Pincode */}
        <div className="flex items-center gap-2 md:gap-4 pt-5">
          <Link to="/" className="flex items-center py-1 group">
            <img
              src="/images/banners/logo_new.png"
              alt="NOVA Jewellery — Home"
              width="180"
              height="48"
              fetchPriority="high"
              className="h-16 md:h-20 -my-4 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
          <DeliveryPincode />
        </div>

        {/* Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Search our luxury collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white  text-nova-dark text-xs md:text-sm border border-black rounded-full py-2.5 px-6 pr-10 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all duration-300"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-nova-gold transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center space-x-2.5 md:space-x-6">
          <Link to="/wishlist" className="hover:opacity-80 transition-opacity duration-300 relative group flex items-center justify-center" aria-label="Wishlist">
            <img src="/images/icons/heart.png" alt="Wishlist" width="28" height="28" className="w-6.0 h-6.0 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nova-gold text-nova-darker text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-nova-darker shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-nova-gold/25 border border-nova-gold/40 text-nova-gold font-serif font-bold text-[10px] md:text-xs uppercase hover:bg-nova-gold/35 hover:scale-105 transition-all shadow-[0_0_10px_rgba(197,168,128,0.2)]" aria-label="Profile">
              {getInitials(user)}
            </Link>
          ) : (
            <Link to="/login" className="hover:opacity-80 transition-opacity duration-300 relative group flex items-center justify-center" aria-label="Login">
              <img src="/images/icons/user.png" alt="Account" width="28" height="28" className="w-6.0 h-6.0 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
            </Link>
          )}
          <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative group flex items-center justify-center" aria-label="Cart">
            <img src="/images/icons/shopping-bag.png" alt="Cart" width="28" height="28" className="w-6.0 h-6.0 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nova-gold text-nova-darker text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-nova-darker shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar (visible only on mobile) */}
      <div className="block md:hidden bg-linear-to-r from-nova-darker via-nova-dark to-nova-darker px-4 pb-3 pt-0.5 border-b border-nova-gold/10">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            placeholder="Search rings, earrings, bracelets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c2b] text-white text-xs border border-nova-gold/20 rounded-full py-2 px-5 pr-10 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all duration-300"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-nova-gold/60 hover:text-nova-gold transition-colors">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="bg-white text-nova-dark uppercase text-xs tracking-[0.15em] font-medium">
        <ul className="flex items-center justify-start md:justify-center space-x-5 md:space-x-10 px-4 md:px-6 py-2 md:py-3.5 overflow-x-auto whitespace-nowrap hide-scrollbar snap-x snap-mandatory scroll-pl-4">
          <li>
            <Link to="/shop" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Shop By Category
            </Link>
          </li>
          <li>
            <Link to="/gifts-for-him" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Gifts For Him
            </Link>
          </li>
          <li>
            <Link to="/gifts-for-her" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Gifts For Her
            </Link>
          </li>
          <li>
            <Link to="/category/earrings" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Astro Collection
            </Link>
          </li>
          <li>
            <Link to="/about" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              About Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}