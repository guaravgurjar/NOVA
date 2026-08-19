import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

type WishlistContextType = {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nova_wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const updated = exists
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updated);
    localStorage.setItem('nova_wishlist', JSON.stringify(updated));
    addToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist');
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
