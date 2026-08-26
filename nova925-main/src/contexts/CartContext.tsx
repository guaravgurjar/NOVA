import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

export interface CartItem {
  id: string; // Represents the product's ID
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number, maxStock?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nova_cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart items from localStorage:", e);
      }
    }
  }, []);

  // Helper to persist cart items
  const saveCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem('nova_cart', JSON.stringify(newItems));
  };

  const addToCart = (productId: string, quantity = 1, maxStock?: number) => {
    let updated: CartItem[];
    const existingIndex = cartItems.findIndex(item => item.id === productId);
    const currentQty = existingIndex > -1 ? cartItems[existingIndex].quantity : 0;
    const desiredQty = currentQty + quantity;

    // Enforce stock limit if provided
    if (maxStock !== undefined && desiredQty > maxStock) {
      if (currentQty >= maxStock) {
        addToast(`Only ${maxStock} unit${maxStock === 1 ? '' : 's'} available — you've reached the limit!`);
        return;
      }
      // Partially fill up to the stock limit
      const allowedQty = maxStock - currentQty;
      addToast(`Only ${maxStock} unit${maxStock === 1 ? '' : 's'} in stock. Added ${allowedQty} to your bag.`);
      updated = existingIndex > -1
        ? cartItems.map((item, i) => i === existingIndex ? { ...item, quantity: maxStock } : item)
        : [...cartItems, { id: productId, quantity: allowedQty }];
    } else {
      updated = existingIndex > -1
        ? cartItems.map((item, i) => i === existingIndex ? { ...item, quantity: desiredQty } : item)
        : [...cartItems, { id: productId, quantity }];
      addToast('Item added to Shopping Bag!');
    }

    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cartItems.filter(item => item.id !== productId);
    saveCart(updated);
    addToast('Item removed from Shopping Bag.');
  };

  const updateQuantity = (productId: string, quantity: number, maxStock?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // Clamp to stock limit if provided
    const clampedQty = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity;
    if (maxStock !== undefined && quantity > maxStock) {
      addToast(`Only ${maxStock} unit${maxStock === 1 ? '' : 's'} available in stock.`);
    }
    const updated = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: clampedQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
