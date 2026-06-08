import { Award, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export function WarrantyDetails() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">GUARANTEE</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Plating Warranty</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Enjoy your 925 sterling silver pieces with complete confidence and peace of mind.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1">
        <div className="space-y-12">
          
          {/* Section 1: Overview */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Plating Warranty Protection</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-3">
                NOVA offers a dedicated plating warranty on all jewelry purchased exclusively through our website, ensuring you can enjoy your luxury pieces with complete peace of mind.
              </p>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                The warranty is valid from the date of delivery and applies only to products where it is explicitly mentioned on the product page or certificate of authenticity.
              </p>
            </div>
          </div>

          {/* Section 2: Terms and Conditions */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Terms & Conditions</h2>
              <div className="space-y-4">
                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <h3 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-2">Applicability</h3>
                  <p className="text-white/70 text-xs font-light leading-relaxed">
                    This plating warranty is applicable only on products where the warranty is explicitly mentioned. The warranty card must be presented for any plating requests.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                  <h3 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-2">Product Condition</h3>
                  <p className="text-white/70 text-xs font-light leading-relaxed">
                    Only undamaged NOVA sterling silver jewelry is eligible for re-plating under this policy. The structure of the silver must be intact.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Exclusions */}
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Warranty Exclusions</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-4">
                Please note that certain types of damages and scenarios are not covered under the warranty terms.
              </p>
              <div className="bg-red-950/10 border border-red-900/20 p-5 rounded-2xl">
                <h3 className="text-xs uppercase tracking-widest text-red-400 font-semibold mb-3">What is NOT Covered:</h3>
                <ul className="list-disc list-inside text-xs font-light text-white/75 space-y-2 leading-relaxed">
                  <li>Mishandling, negligence, or improper chemical exposure (perfumes, detergents, swimming pool water, etc.).</li>
                  <li>Impact damage, scratches, accidents, or physical tampering.</li>
                  <li>Surface finish issues caused by friction or abrasive cleaning.</li>
                  <li>Stone fallouts or damage to setting structures.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: Notice */}
          <div className="flex gap-6 items-start border-t border-white/5 pt-10">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">How to Claim Plating Service</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                To claim your plating service, contact our support team with your invoice and warranty card. Customers will need to ship the product to our certified workshop, and we will handle the polishing and plating at no cost, returning it directly to your address.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
