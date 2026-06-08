import { Link } from 'react-router-dom';
import { ArrowLeftRight, CreditCard, RotateCw, CheckCircle, Video } from 'lucide-react';
import { useEffect } from 'react';

export function ReturnPolicy() {
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
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Return & Refund Policy</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Read our guidelines for returns, exchanges, refunds, and pick-up details.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1">
        <div className="space-y-12">
          
          {/* Section 1: Return Policy */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">1. Return Policy</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                We offer a <strong>15-day return policy</strong> on all unused and unworn items—no questions asked. 
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                Please note that refunds are processed after a quality check of the returned product at our warehouse. If you purchased your NOVA product from any platform other than our website or other e-commerce website/apps, the return policy of that platform will apply. Shipping charges, if any, are non-refundable.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-4">
                In case of missing items in a return order—where multiple products were claimed but not all are received—we reserve the right to deduct up to the full MRP of the missing item from the refund. This also applies to promotional items, including free gifts and silver coins.
              </p>
              
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <h3 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-2">Return & Exchange Exclusions</h3>
                <p className="text-white/70 text-xs font-light leading-relaxed">
                  Products showing signs of wear and tear, having been resized or altered (especially by a jeweller other than NOVA), or damaged due to mishandling (e.g., bent, scratched, broken by an external force) are not eligible under the 15-day return/exchange policy. Coins and Made to Order products are not covered under 15-day returns, and nose pins (even normal orders) cannot be exchanged due to hygiene reasons; however, Lifetime Exchange/Buyback (LTE/LTB) is applicable on both these categories. Promo coins are not part of LTE/LTB and will be added to the promo wallet in case of returns/refunds.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Refund Policy */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">2. Refund Policy</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                If you request a return, your refund will be initiated once the product is received at our warehouse. 
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                All refunds are processed based on the original purchase price mentioned on your invoice. Please note that current prices or any fluctuations will not affect the refund amount.
              </p>
            </div>
          </div>

          {/* Section 3: Replacement & Exchange */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">3. Replacement & Exchange</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                You can also request a replacement or exchange as per your preference. The same conditions as our return policy will apply.
              </p>
            </div>
          </div>

          {/* Section 4: Return Process */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">4. Return Process</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                You can easily initiate a return through our website, or reach out to our Customer Support team for assistance. 
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                Once your return is scheduled, we kindly request you to be available for the reverse pick-up and answer calls from the delivery partner. If you’re unavailable or unable to respond, the pick-up may be canceled, and the process will need to be re-initiated, which may increase the overall timeline.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                Please note that while most pin codes support both delivery and return pick-ups, some areas may be eligible only for delivery. In such cases, you may be asked to return the product via an alternate courier service, such as India Post, and we will reimburse shipping costs up to ₹70.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                If the return shipping cost exceeds ₹70, the remaining amount will be adjusted against your refund. For non-serviceable pin codes, customers are responsible for sending the product back to our warehouse, and a reimbursement of ₹70 will be included in the refund.
              </p>
            </div>
          </div>

          {/* Section: Order Cancellation */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Order Cancellation</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                Order cancellations are permitted for standard online jewellery orders. You may cancel your order anytime after placement, provided it has not yet been delivered.
              </p>
            </div>
          </div>

          {/* Section 5: Unboxing Video */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Empty Parcel & Missing Items Claims</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                If you receive an empty parcel or a product is missing, please contact our Customer Support team within <strong>48 hours of delivery</strong>.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                You will need to share a clear 360° unboxing video for us to review your request. Please note that claims without sufficient proof or with signs of tampering may not be accepted. The final decision in such cases will rest with the brand. For more details, refer to our <Link to="/terms" className="text-nova-gold hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
