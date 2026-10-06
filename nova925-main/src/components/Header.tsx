import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { DeliveryPincode } from './DeliveryPincode';

// ─── CATALOG MODE ─────────────────────────────────────────────────────────────
// Set to true to hide Cart icon in the header.
// Set to false to re-enable when pricing is ready.
const CATALOG_MODE = false;
// ──────────────────────────────────────────────────────────────────────────────

export function Header() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/shop', label: 'Shop By Category' },
    { to: '/gifts-for-him', label: 'Gifts For Him' },
    { to: '/gifts-for-her', label: 'Gifts For Her' },
    { to: '/kids', label: 'Kids' },
    { to: '/Astro-collection', label: 'Astro Collection' },
    { to: '/about', label: 'About Us' },
  ];

  const announcements = [
    "FREE SHIPPING PAN INDIA | 100% PURE 925 STERLING SILVER",
    "USE CODE 'NOVA10' FOR 10% OFF YOUR FIRST ORDER",
    "CASH ON DELIVERY & EASY 7-DAY RETURNS NATIONWIDE"
  ];

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
    <>
    {/* OPTIMIZATION 2: GPU-Accelerated Transform on the Wrapper */}
    <header
      role="banner"
      className={`sticky top-0 w-full z-100 shadow-md transition-transform duration-500 ease-in-out ${scrolled ? '-translate-y-9 md:-translate-y-10' : 'translate-y-0'
        }`}
    >
      {/* OPTIMIZATION 3: Fixed Height Announcement Bar */}
      <div
        className="h-9 md:h-10 bg-sky-100 text-[9px] sm:text-[11px] font-semibold text-nova-darker uppercase tracking-[0.08em] sm:tracking-[0.16em] md:tracking-[0.2em] px-3 sm:px-4 flex items-center justify-center border-b border-nova-gold/15 select-none"
      >
        <p key={announcementIndex} className="animate-slide-up w-full text-center truncate">
          {announcements[announcementIndex]}
        </p>
      </div>

      {/* Top Bar */}
      <div className="bg-white min-h-14 md:h-16 px-3 md:px-12 py-1.5 md:py-0 flex items-center justify-between gap-2">

        {/* Logo + Delivery Pincode */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            type="button"
            className="md:hidden shrink-0 w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-nova-dark hover:bg-nova-gold/10"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center py-1 group min-w-0">
            <img
              src="/images/banners/logo_new.webp"
              alt="NOVA Jewellery — Home"
              width="180"
              height="48"
              fetchPriority="high"
              className="h-10 sm:h-12 md:h-14 lg:h-20 w-auto max-w-[42vw] sm:max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
          <DeliveryPincode className="hidden lg:block" />
        </div>

        {/* Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8 relative min-w-0">
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
        <div className="flex items-center space-x-1 sm:space-x-2.5 md:space-x-6 shrink-0">
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
          {/* Cart Icon — hidden in catalog mode, restore by setting CATALOG_MODE = false */}
          {!CATALOG_MODE && (
            <Link to="/cart" className="hover:opacity-80 transition-opacity duration-300 relative group flex items-center justify-center" aria-label="Cart">
              <img src="/images/icons/shopping-bag.png" alt="Cart" width="28" height="28" className="w-6.0 h-6.0 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-nova-gold text-nova-darker text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-nova-darker shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
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

      {/* Navigation — desktop */}
      <nav aria-label="Main navigation" className="hidden md:block bg-white text-nova-dark uppercase text-xs tracking-[0.15em] font-medium">
        <ul className="flex items-center justify-start lg:justify-center gap-5 lg:gap-10 px-4 lg:px-6 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>

    {menuOpen && (
      <div className="fixed inset-0 z-[200] md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute top-0 left-0 h-full w-[min(100%,20rem)] bg-white text-nova-dark shadow-2xl overflow-y-auto px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-serif tracking-[0.2em] text-sm uppercase">Menu</span>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-nova-gold/10"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="flex flex-col uppercase text-sm tracking-[0.14em] font-medium">
            {navLinks.map((link) => (
              <li key={link.to} className="border-b border-nova-dark/10">
                <Link
                  to={link.to}
                  className={`block py-3.5 ${location.pathname === link.to ? 'text-nova-gold' : 'hover:text-nova-gold'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <DeliveryPincode className="block" />
          </div>
        </nav>
      </div>
    )}
    </>
  );
}