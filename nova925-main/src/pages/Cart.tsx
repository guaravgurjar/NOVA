import { products, featuredProducts } from '../data';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { Trash2, Tag, Gift, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

export function Cart() {
  const { addToast } = useToast();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Resolve products from data source
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id) || featuredProducts.find(p => p.id === id);
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
  const discount = Math.round(totalMrp * 0.05); // 5% discount
  const finalAmount = totalMrp - discount;

  const handleCheckout = () => {
    addToast('Redirecting to checkout...');
  };

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white">
      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl flex-1">
        <h1 className="text-3xl md:text-5xl font-serif text-center tracking-wider mb-16 font-light">
          Shopping Bag
        </h1>
        
        {resolvedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {resolvedItems.map(item => {
                const product = item.product;
                const itemQuantity = item.quantity;
                const itemTotal = product.price * itemQuantity;
                const itemDiscount = Math.round(itemTotal * 0.05);
                const itemFinal = itemTotal - itemDiscount;

                return (
                  <div key={product.id} className="glass-dark rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start border border-white/5 shadow-xl relative animate-fade-in">
                    
                    {/* Product Image */}
                    <Link to={`/product/${product.id}`} className="w-full md:w-44 aspect-square bg-[#07090f] rounded-xl overflow-hidden relative border border-white/5 block shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 w-full bg-nova-gold/90 text-nova-darker text-[9px] font-bold text-center py-1 uppercase tracking-widest">
                        Free Delivery
                      </div>
                    </Link>
                    
                    {/* Product Info */}
                    <div className="flex-1 w-full flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <Link to={`/product/${product.id}`} className="hover:text-nova-gold transition-colors">
                             <h3 className="font-serif text-lg text-nova-gold font-medium tracking-wide">
                               {product.name}
                             </h3>
                           </Link>
                           <button 
                             onClick={() => removeFromCart(product.id)}
                             className="text-white/40 hover:text-red-400 transition-colors p-1 cursor-pointer"
                             aria-label="Remove Item"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                        
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 font-medium">925 Sterling Silver Purity</p>
                        
                        <div className="text-lg font-bold text-white mb-6">
                          Rs. {itemFinal.toLocaleString('en-IN')}/-{' '}
                          <span className="text-white/30 line-through text-sm font-normal ml-2">
                            (Rs. {itemTotal.toLocaleString('en-IN')}/-)
                          </span>
                        </div>
                      </div>
                      
                      {/* Quantity & Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                        <div className="flex bg-[#181c2b] border border-white/10 rounded-lg overflow-hidden items-center">
                           <button onClick={() => updateQuantity(product.id, itemQuantity - 1)} className="px-3.5 py-1.5 hover:bg-white/5 text-white/75 transition-colors font-bold cursor-pointer">-</button>
                           <span className="px-4 py-1.5 font-mono text-xs font-semibold text-nova-gold">{String(itemQuantity).padStart(2, '0')}</span>
                           <button onClick={() => updateQuantity(product.id, itemQuantity + 1)} className="px-3.5 py-1.5 hover:bg-white/5 text-white/75 transition-colors font-bold cursor-pointer">+</button>
                        </div>
                        
                        <div className="flex gap-2 text-[8px] uppercase tracking-wider text-white/50">
                           <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5">7-day returns</span>
                           <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5">Lab certified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Pricing Panel */}
            <div>
              <button onClick={() => addToast('Coupon applied!')} className="w-full bg-[#181c2b] hover:bg-white/5 border border-white/10 hover:border-nova-gold/30 rounded-xl py-3.5 mb-3.5 flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-widest text-white/95 transition-all cursor-pointer">
                <Tag className="w-4 h-4 text-nova-gold" />
                <span>Apply Promo Coupon</span>
              </button>
              <button onClick={() => addToast('Gift card linked!')} className="w-full bg-[#181c2b] hover:bg-white/5 border border-white/10 hover:border-nova-gold/30 rounded-xl py-3.5 mb-8 flex items-center justify-center gap-2.5 text-xs font-medium uppercase tracking-widest text-white/95 transition-all cursor-pointer">
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
                
                <button 
                  onClick={handleCheckout}
                  className="btn-premium w-full bg-nova-gold text-nova-darker py-3.5 rounded-xl font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-nova-gold-light hover:shadow-lg hover:shadow-nova-gold/25 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Checkout Securely</span>
                </button>
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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.slice(2, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
