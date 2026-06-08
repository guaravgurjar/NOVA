import { Sparkles, Gift, Archive, Sparkle } from 'lucide-react';
import { useEffect } from 'react';

export function JewelleryKit() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      {/* Page Header Banner */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2">ACCESSORIES</span>
          <h1 className="text-3xl md:text-4xl font-serif tracking-wider mb-2">Jewellery Care Kit</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Keep your precious sterling silver shining for years to come.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-4xl flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-serif tracking-wide text-white mb-6">Combo of Elegance & Protection</h2>
            <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
              Our complete <strong>NOVA Jewellery Care Kit</strong> is designed as a perfect companion for your premium silver. It includes a luxury gift packaging box, a storage pouch, and a polishing cloth to keep your jewellery safe and tarnish-free.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Gift className="w-4 h-4 text-nova-gold" />
                <span>Luxury Signature Gift Box</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Archive className="w-4 h-4 text-nova-gold" />
                <span>Anti-Tarnish Storage Pouch</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <Sparkles className="w-4 h-4 text-nova-gold" />
                <span>Microfiber Polishing & Cleaning Cloth</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-72 rounded-3xl overflow-hidden border border-white/5 bg-nova-dark flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-nova-darker to-transparent opacity-80 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Jewellery packaging and cleaning" 
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-20 text-center p-6">
              <span className="text-nova-gold text-[10px] uppercase tracking-[0.25em] font-bold block mb-2">COMPLETE KIT</span>
              <p className="font-serif text-lg text-white">Gift Box + Pouch + Polishing Cloth</p>
            </div>
          </div>
        </div>

        {/* Cleaning Cloth Section */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-nova-gold/5 border border-nova-gold/20 flex items-center justify-center shrink-0 text-nova-gold">
              <Sparkle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-wide text-white mb-3">Premium Cleaning Cloth</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed mb-4">
                Keep your precious jewellery looking shiny with our premium soft cleaning cloth. A useful (and super cute!) little cloth to remove any debris and restore a clean, spotless surface instantly.
              </p>
              <h3 className="text-xs uppercase tracking-widest text-nova-gold font-semibold mb-2">How to Use:</h3>
              <ul className="list-disc list-inside text-xs font-light text-white/60 space-y-2 leading-relaxed">
                <li>Gently wipe the silver surface with the dry polishing cloth to remove tarnish and fingerprints.</li>
                <li>Avoid using liquid cleaners or water on the polishing cloth to preserve its integrated cleaning elements.</li>
                <li>When not in wear, store your silver pieces inside the anti-tarnish pouch to minimize exposure to air.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
