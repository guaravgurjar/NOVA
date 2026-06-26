import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, FormEvent } from 'react';
import { Trash2, Tag, Gift, Lock, Truck, ClipboardSignature, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

export function Cart() {
  const { addToast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();

  // Checkout form states
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [engravingText, setEngravingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill buyer details if logged in
  useEffect(() => {
    if (user) {
      setBuyerName(`${user.firstName} ${user.lastName}`);
      setBuyerEmail(user.email);
    }
  }, [user]);

  // Resolve products from data source
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const resolvedItems = cartItems
    .map(item => {
      const product = getProductById(item.id);
      return {
        product,
        quantity: item.quantity
      };
    })
    .filter(item => item.product !== undefined) as { product: Product; quantity: number }[];

  // Dynamic calculations
  const totalMrp = resolvedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(totalMrp * 0.05); // 5% campaign discount
  const finalAmount = totalMrp - discount;

  const handleCheckoutToggle = () => {
    setShowCheckoutForm(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail || !shippingAddress) {
      addToast('Please fill in all required checkout fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        buyerName,
        buyerEmail,
        shippingAddress,
        engravingText: engravingText || null,
        totalPrice: finalAmount,
        items: resolvedItems.map(item => ({
          variantId: (item.product as any).variantId || item.product.id,
          quantity: item.quantity,
          pricePaid: item.product.price
        }))
      };

      const res = await fetch('https://nova-git-main-nova-adminpanel.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success) {
          addToast(`Success! Order Number ${resData.order.orderNumber} placed.`);
          clearCart();
          setShowCheckoutForm(false);
          setShippingAddress('');
          setEngravingText('');
        } else {
          addToast(resData.error || 'Failed to place order.');
        }
      } else {
        addToast('Failed to connect to checkout backend.');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error: Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl flex-1">
        <h1 className="text-3xl md:text-5xl font-serif text-center tracking-wider mb-16 font-light">
          Shopping Bag
        </h1>
        
        {resolvedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Cart items / Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {!showCheckoutForm ? (
                <div className="space-y-4">
                  {resolvedItems.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="glass-dark border border-white/5 p-4 rounded-xl flex gap-4 items-center justify-between"
                    >
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded border border-white/10" 
                        />
                        <div>
                          <h4 className="text-sm font-medium text-white/90">{item.product.name}</h4>
                          <p className="text-xs text-nova-gold mt-1">
                            Rs. {item.product.price.toLocaleString('en-IN')}/-
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-white/10 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-1 text-xs hover:bg-white/5 text-white/50 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-mono">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs hover:bg-white/5 text-white/50 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => {
                            removeFromCart(item.product.id);
                            addToast('Removed from cart');
                          }}
                          className="text-white/40 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Secure Checkout Form */
                <form onSubmit={handlePlaceOrder} className="glass-dark border border-white/10 p-6 rounded-2xl space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-base font-serif text-nova-gold uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping & Sourcing Details
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setShowCheckoutForm(false)}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      Back to Cart
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">Buyer Name</label>
                      <input 
                        type="text" 
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Arjun Mehta" 
                        required
                        className="w-full bg-[#0b0e17] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nova-gold/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">Email Address</label>
                      <input 
                        type="email" 
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="e.g. arjun@gmail.com" 
                        required
                        className="w-full bg-[#0b0e17] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nova-gold/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60">Full Shipping Address</label>
                    <textarea 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, Sector, City, State, Pincode" 
                      rows={3}
                      required
                      className="w-full bg-[#0b0e17] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nova-gold/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                      <ClipboardSignature className="w-3.5 h-3.5 text-nova-gold" />
                      Custom Engraving / Sizing Notes (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={engravingText}
                      onChange={(e) => setOriginalEngraving(e.target.value)}
                      placeholder="e.g. Forever yours A&M (Size 7)" 
                      className="w-full bg-[#0b0e17] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-nova-gold/50"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Landmark className="w-4 h-4" />
                        <span>Place Order (Cash on Delivery)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
              <button onClick={() => addToast('Gift card linked!')} className="w-full bg-[#181c2b] hover:bg-white/5 border border-white/10 hover:border-nova-gold/30 rounded-xl py-3.5 flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-widest text-white/95 transition-all cursor-pointer">
                <Gift className="w-4 h-4 text-nova-gold" />
                <span>Redeem Gift Card</span>
              </button>

              <div className="glass-dark border border-white/10 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-semibold tracking-[0.2em] mb-6 font-serif text-nova-gold uppercase">Order Summary</h3>
                
                <div className="space-y-4 text-xs text-white/70 font-light mb-6">
                  <div className="flex justify-between">
                    <span>Total Price (MRP)</span>
                    <span>Rs. {totalMrp.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                    <span>Campaign Discount</span>
                    <span className="text-emerald-400 font-semibold">-Rs. {discount.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span>Standard Shipping</span>
                    <span className="text-emerald-400 font-medium">FREE</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-serif text-sm font-medium tracking-wide">Estimated Total</span>
                    <div className="text-right">
                      <div className="font-bold text-lg text-nova-gold">Rs. {finalAmount.toLocaleString('en-IN')}/-</div>
                      <div className="text-[9px] text-white/30 tracking-wide uppercase">Inclusive of all taxes</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center py-2.5 rounded-lg text-xs font-medium mb-5">
                  You save Rs. {discount.toLocaleString('en-IN')}/- on this order!
                </div>
                
                {!showCheckoutForm && (
                  <button 
                    onClick={handleCheckoutToggle}
                    className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/25 transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Checkout Securely</span>
                  </button>
                )}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="text-center py-20 glass-dark rounded-2xl border border-white/5 max-w-lg mx-auto">
             <span className="text-4xl block mb-4">🛒</span>
             <h3 className="font-serif text-lg mb-2">Your Shopping Bag is Empty</h3>
             <p className="text-white/50 text-xs font-light mb-6">Looks like you haven't added any luxury pieces yet.</p>
             <Link to="/shop" className="btn-premium inline-block bg-nova-gold text-nova-darker px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">
               Continue Shopping
             </Link>
          </div>
        )}
      </div>
      
      {/* Recommended Grid */}
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl border-t border-white/5">
         <h2 className="text-2xl font-serif tracking-wider font-light mb-10 text-center">Complete Your Look</h2>
         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  // Small helper to avoid compilation error on setOriginalEngraving
  function setOriginalEngraving(val: string) {
    setEngravingText(val);
  }
}
