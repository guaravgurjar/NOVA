import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Video, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

export function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">CUSTOMER CARE</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Shipping & Handling</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Understand our shipping timelines, delivery options, and security protocols.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1">
        <div className="space-y-12">
          
          {/* Section 1: Standard Delivery */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Delivery Timeline & Shipping Rates</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                We provide <strong>free standard shipping</strong> across India on all orders. Once you place an order, it is processed within 24 to 48 hours. The package is typically delivered within 4 to 7 business days depending on your location.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                All packages are dispatched in highly secure, premium tamper-evident packaging to ensure your jewelry arrives in perfect condition.
              </p>
            </div>
          </div>

          {/* Section 2: Pin Code Coverage */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Serviceable Pin Codes & Delivery Reverse Pickups</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                While most pin codes in India support both delivery and return pickups, some remote areas may only be eligible for delivery.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                In cases where reverse pickup is unavailable, you may be requested to return the product via an alternate courier service (e.g., India Post), and we will reimburse shipping costs up to ₹70. For detailed return shipping terms, please refer to our <Link to="/return" className="text-nova-gold hover:underline">Return Policy</Link>.
              </p>
            </div>
          </div>

          {/* Section 3: Damaged or Missing Shipments */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Empty Parcel & Missing Items Policy (Important)</h2>
              <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl mb-4 text-white/90">
                <h3 className="font-semibold text-nova-gold text-xs uppercase tracking-widest mb-2">48-Hour Claim Window</h3>
                <p className="text-white/70 text-xs font-light leading-relaxed">
                  If you receive an empty parcel or find any product is missing, please contact our Customer Support team within <strong>48 hours of delivery</strong>.
                </p>
              </div>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                To process such claims, you will need to share a <strong>clear 360° unboxing video</strong> showing the unopened package from all angles, followed by the unboxing process. 
              </p>
              <p className="text-white/70 text-xs font-light leading-relaxed italic text-white/50">
                Please note that claims without sufficient unboxing video proof or showing signs of tampering cannot be accepted. The final decision in such cases rests with the brand.
              </p>
            </div>
          </div>

          {/* Section 4: Support */}
          <div className="flex gap-6 items-start border-t border-white/5 pt-10">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Need Assistance?</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                If you have any questions regarding your shipment status or if delivery is delayed, feel free to submit an inquiry or email us at <a href="mailto:contact@novajewels.info" className="text-nova-gold hover:underline">contact@novajewels.info</a>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
