import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, User, ShoppingCart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function Header() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleSearchSubmit = (e: React.FormEvent) => {
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
    <header className="sticky top-0 w-full z-50 shadow-md">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker py-4 px-6 md:px-12 flex items-center justify-between border-b border-nova-gold/10">
        
        {/* Logo */}
        <Link to="/" className="flex items-center py-1 group">
          <img 
            src="/images/logo.png" 
            alt="NOVA Jewellery" 
            className="h-9 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]" 
          />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Search our luxury collection..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181c2b] text-white text-xs md:text-sm border border-nova-gold/20 rounded-full py-2.5 px-6 pr-10 focus:outline-none focus:ring-1 focus:ring-nova-gold focus:border-nova-gold transition-all duration-300"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-nova-gold/60 hover:text-nova-gold transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center space-x-6 text-white">
          <Link to="/wishlist" className="hover:text-nova-gold transition-colors duration-300 relative group" aria-label="Wishlist">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          <button onClick={handleShare} className="hover:text-nova-gold transition-colors duration-300 relative group cursor-pointer" aria-label="Share Website">
            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button className="hover:text-nova-gold transition-colors duration-300 relative group" aria-label="Stores">
            <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          {user ? (
            <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-nova-gold/25 border border-nova-gold/40 text-nova-gold font-serif font-bold text-xs uppercase hover:bg-nova-gold/35 hover:scale-105 transition-all shadow-[0_0_10px_rgba(197,168,128,0.2)]" aria-label="Profile">
              {getInitials(user)}
            </Link>
          ) : (
            <Link to="/login" className="hover:text-nova-gold transition-colors duration-300 relative group" aria-label="Login">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          )}
          <Link to="/cart" className="hover:text-nova-gold transition-colors duration-300 relative group" aria-label="Cart">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-nova-darker text-white border-b border-nova-gold/15 uppercase text-xs tracking-[0.15em] font-medium">
        <ul className="flex items-center justify-center space-x-6 md:space-x-10 px-6 py-3.5 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <li>
            <Link to="/shop" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              All Shop
            </Link>
          </li>
          <li>
            <Link to="/category/chains" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Chains
            </Link>
          </li>
          <li>
            <Link to="/category/earrings" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Earrings
            </Link>
          </li>
          <li>
            <Link to="/category/bracelets" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Bracelets
            </Link>
          </li>
          <li>
            <Link to="/category/bangles" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Bangles
            </Link>
          </li>
          <li>
            <Link to="/category/pendants" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Pendants
            </Link>
          </li>
          <li>
            <Link to="/category/sets" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Sets
            </Link>
          </li>
          <li>
            <Link to="/category/astro" className="relative py-1 hover:text-nova-gold transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-nova-gold after:transition-all after:duration-300">
              Astro Jewellery
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
