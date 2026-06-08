import { useEffect, useState } from 'react';
import { Sparkles, Users, Award, ChevronRight } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  photo: string;
  bio: string;
}

export function About() {
  const [activeLeaderIndex, setActiveLeaderIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Utkarsh Pathak",
      role: "FOUNDER & CEO — NOVA GROUP",
      initials: "UP",
      photo: "", // Future photo URL goes here
      bio: "Utkarsh Pathak is the Founder & CEO of “NOVA” Group, a passionate and purpose-driven entrepreneur who built “NOVA” from the ground up with one clear vision — to create a brand that redefines trust and elegance in 925 sterling silver jewellery.\n\nWith a sharp eye for quality and a deep understanding of what customers truly value, he has steered “NOVA” with a leadership style that blends strategic thinking with genuine passion for the craft. He believes that a great brand is not just built on great products — it is built on consistency, integrity, and the relationships it creates with its customers."
    },
    {
      name: "Akanksha Jain",
      role: "CO-FOUNDER — NOVA GROUP",
      initials: "AJ",
      photo: "", // Future photo URL goes here
      bio: "Akanksha Jain is the Co-Founder of NOVA Group, a bold and ambitious entrepreneur who stepped into the business world with one clear goal — to build a brand that people truly believe in.\n\nWhat sets her apart is her ability to blend creative thinking with sharp business strategy. She sees opportunities where others see challenges, and brings a unique perspective that continues to shape NOVA's identity and growth.\n\nDeeply passionate about building something meaningful, Akanksha ensures that every decision at NOVA reflects the brand's core values — quality, trust, and elegance. For her, NOVA is not just a jewellery brand — it is a statement she is determined to make stronger every single day."
    },
    {
      name: "Rishi Yadav",
      role: "CO-FOUNDER — NOVA GROUP",
      initials: "RY",
      photo: "", // Future photo URL goes here
      bio: "Rishi Yadav is the Co-Founder of NOVA Group, a visionary individual who brings a rare blend of creativity and strategic thinking to the brand. At NOVA, he plays a pivotal role in shaping the brand's personality and presence — building an identity that is not just visually compelling but deeply trustworthy.\n\nFor Rishi, building NOVA is about more than business — it is about creating a brand that people genuinely love, follow, and believe in."
    },
    {
      name: "Gaurav Gurjar",
      role: "CO-FOUNDER & LEAD DEVELOPER — NOVA GROUP",
      initials: "GG",
      photo: "/gaurav_gurjar.png",
      bio: "Gaurav , is the kind of leader every growing brand needs—someone who sees beyond the surface and builds beyond expectations. He brings clarity, structure, and a deep sense of ownership to everything he does. His ability to think strategically and execute with precision has been the powerful force behind NOVA's global direction. Ensuring that this vision translates flawlessly to the digital world is Gaurav, the site's lead developer. By engineering a premium, immersive web experience with seamless global architecture."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-nova-darker text-white font-sans">
      
      {/* Page Header Banner */}
      <div className="relative w-full h-[220px] bg-gradient-to-r from-nova-darker via-nova-dark to-nova-darker flex items-center overflow-hidden border-b border-nova-gold/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-nova-gold/5 blur-[80px] pointer-events-none"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-nova-gold font-semibold mb-2 block">OUR STORY & CRAFTSMANSHIP</span>
          <h1 className="text-3xl md:text-5xl font-serif tracking-wider mb-2 font-light">About NOVA</h1>
          <p className="text-white/60 max-w-xl text-xs md:text-sm font-light">
            Discover the cosmic inspiration, quality standards, and creative minds driving our silver revolution.
          </p>
        </div>
      </div>

      {/* Brand & Meaning Sections */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute -left-48 top-1/3 w-96 h-96 rounded-full bg-nova-gold/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute -right-48 bottom-1/3 w-96 h-96 rounded-full bg-nova-gold/5 blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            
            {/* Left Box: NOVA as a Brand */}
            <div className="glass-dark rounded-2xl p-8 md:p-10 border border-white/5 shadow-2xl relative flex flex-col justify-between glow-border group">
              <div>
                <div className="w-12 h-12 rounded-lg border border-nova-gold/20 bg-nova-gold/5 flex items-center justify-center mb-6 group-hover:border-nova-gold/40 transition-colors duration-300">
                  <Award className="w-6 h-6 text-nova-gold" />
                </div>
                <h2 className="text-2xl font-serif tracking-wide text-white mb-6 font-light">
                  NOVA <span className="text-silver-gradient font-normal">as a Brand</span>
                </h2>
                <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed font-light">
                  <p>
                    <span className="font-semibold text-white">Nova</span> is a 925 silver jewellery brand focused on bringing you stylish, high-quality pieces that are perfect for everyday wear and special moments.
                  </p>
                  <p>
                    Each design is thoughtfully curated to match modern trends while maintaining timeless elegance. At Nova, we aim to make premium silver jewellery accessible, reliable, and a part of your daily style—so you can shine with confidence, every day.
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
                <span className="text-xs text-nova-gold tracking-widest uppercase font-semibold">925 Pure Silver</span>
                <span className="text-white/30 text-xs font-serif italic">Designed for daily shine</span>
              </div>
            </div>

            {/* Right Box: What does the name NOVA mean? */}
            <div className="glass-dark rounded-2xl p-8 md:p-10 border border-white/5 shadow-2xl relative flex flex-col justify-between glow-border group">
              <div>
                <div className="w-12 h-12 rounded-lg border border-nova-gold/20 bg-nova-gold/5 flex items-center justify-center mb-6 group-hover:border-nova-gold/40 transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-nova-gold" />
                </div>
                <h2 className="text-2xl font-serif tracking-wide text-white mb-6 font-light">
                  What does the name <span className="text-silver-gradient font-normal">NOVA Mean?</span>
                </h2>
                <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed font-light">
                  <p>
                    The name <span className="font-semibold text-white">NOVA</span> is inspired by the astronomical phenomenon where a star suddenly becomes brighter, radiating a powerful burst of light. It symbolizes new beginnings, brilliance, and a glow that captures attention effortlessly. At NOVA, this meaning reflects our vision—to bring you jewellery that shines with the same intensity and elegance.
                  </p>
                  <p>
                    As a 925 silver jewellery brand, NOVA represents purity, timeless beauty, and everyday luxury. Each piece is thoughtfully curated to add a subtle yet striking sparkle to your look, whether it’s for daily wear or special occasions. Just like a nova lights up the sky, our jewellery is designed to enhance your confidence, help you stand out in your own unique way, and shine with you in every moment.
                  </p>
                  <p>
                    NOVA is not just a name—it’s a feeling of renewal, radiance, and self-expression. It stands for jewellery that doesn’t just complete your outfit, but becomes a part of your story.
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-white/5 pt-6 flex items-center justify-between">
                <span className="text-xs text-nova-gold tracking-widest uppercase font-semibold">Cosmic Brilliance</span>
                <span className="text-white/30 text-xs font-serif italic">Your story, radiating light</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Leadership Team Section */}
      <div className="bg-[#090b12] py-24 border-t border-white/5 relative">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nova-gold/25 bg-nova-gold/5 mb-4">
              <Users className="w-4 h-4 text-nova-gold" />
              <span className="text-[10px] text-nova-gold font-semibold uppercase tracking-wider">Leadership Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif tracking-wider font-light text-white mb-4">
              The Minds Behind <span className="text-silver-gradient font-normal">NOVA</span>
            </h2>
            <div className="w-12 h-[1px] bg-nova-gold mx-auto mb-4"></div>
            <p className="text-white/60 text-xs md:text-sm font-light">
              Meet the visionaries, designers, and innovators crafting a new digital and physical horizon for luxury silver.
            </p>
          </div>

          {/* Spotlight Editorial Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Column: Selector Stack (col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {teamMembers.map((member, index) => {
                const isActive = activeLeaderIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveLeaderIndex(index)}
                    className={`text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer relative overflow-hidden group w-full ${
                      isActive 
                        ? 'bg-nova-dark/80 border-nova-gold/40 shadow-lg shadow-nova-gold/5' 
                        : 'bg-nova-darker/40 border-white/5 hover:border-white/20 hover:bg-nova-darker/70'
                    }`}
                  >
                    {/* Active highlight glow strip on left */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-nova-gold"></div>
                    )}
                    
                    {/* Tiny initial icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isActive 
                        ? 'border-nova-gold bg-nova-gold/10' 
                        : 'border-white/10 bg-white/5 group-hover:border-white/30'
                    }`}>
                      <span className={`text-xs font-semibold font-serif ${isActive ? 'text-nova-gold' : 'text-white/60'}`}>
                        {member.initials}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-serif font-light tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-nova-gold' : 'text-white/80 group-hover:text-white'
                      }`}>
                        {member.name}
                      </h4>
                      <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5 font-medium">
                        {member.role.split(' — ')[0]}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                      isActive ? 'text-nova-gold translate-x-0' : 'text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Profile Spotlight (col-span-8) */}
            <div className="lg:col-span-8">
              <div className="glass-dark rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-stretch h-full glow-border">
                {/* Background soft seal watermark */}
                <div className="absolute -right-8 -bottom-8 text-[120px] font-serif font-bold text-white/[0.01] pointer-events-none select-none">
                  {teamMembers[activeLeaderIndex].initials}
                </div>

                {/* Profile Visual Slot */}
                <div className="w-full max-w-[240px] md:w-[240px] aspect-square md:aspect-auto md:h-auto rounded-xl overflow-hidden border border-white/10 bg-nova-darker/60 flex items-center justify-center shrink-0 relative group">
                  {teamMembers[activeLeaderIndex].photo ? (
                    <img
                      src={teamMembers[activeLeaderIndex].photo}
                      alt={teamMembers[activeLeaderIndex].name}
                      className="w-full h-full object-cover animate-fade-in"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-nova-darker to-[#161a29] p-6 relative">
                      <div className="absolute inset-3 border border-nova-gold/10 rounded-lg pointer-events-none"></div>
                      <div className="w-24 h-24 rounded-full bg-nova-darker/80 border border-nova-gold/20 flex items-center justify-center shadow-xl relative z-10 transition-all duration-500 group-hover:border-nova-gold/40 group-hover:scale-105">
                        <span className="text-4xl font-serif text-silver-gradient font-semibold tracking-wide">
                          {teamMembers[activeLeaderIndex].initials}
                        </span>
                      </div>
                      <span className="text-[9px] text-nova-gold tracking-[0.25em] uppercase font-semibold mt-4 relative z-10 opacity-60">
                        NOVA EST. 1995
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Bio Details */}
                <div className="flex-1 flex flex-col justify-between py-2 animate-fade-in" key={activeLeaderIndex}>
                  <div>
                    <span className="text-[10px] text-nova-gold font-semibold uppercase tracking-[0.2em] block mb-1">
                      {teamMembers[activeLeaderIndex].role}
                    </span>
                    <h3 className="text-2xl font-serif text-white tracking-wide font-light mb-4">
                      {teamMembers[activeLeaderIndex].name}
                    </h3>
                    <div className="w-12 h-[1px] bg-nova-gold/40 mb-6"></div>
                    <div className="space-y-4 text-white/70 text-sm leading-relaxed font-light">
                      {teamMembers[activeLeaderIndex].bio.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-white/30 tracking-widest uppercase">Signature Trust</span>
                    <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-nova-gold/40"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-nova-gold/60"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-nova-gold"></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Dynamic Brand Quote Banner */}
      <div className="py-20 relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#0f121d] to-[#07090f]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <span className="text-6xl text-nova-gold/20 font-serif block -mt-4 leading-none">“</span>
          <p className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed font-light italic mb-8">
            Redefining sterling elegance, making premium craftsmanship accessible to every moment of self-expression.
          </p>
          <div className="w-12 h-[1px] bg-nova-gold mx-auto mb-4"></div>
          <span className="text-[10px] text-nova-gold font-semibold uppercase tracking-[0.25em]">NOVA Group Purity Pledge</span>
        </div>
      </div>

    </div>
  );
}
